import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';

const here=path.dirname(fileURLToPath(import.meta.url));
const root=path.resolve(here,'..');
const pub=path.join(root,'public');
const registry=await import(pathToFileURL(path.join(pub,'approved-family-characters.mjs')).href);

const approved=['john','kristen','holly','vanessa','elizabeth','logan','james','dorothy'];
const pending=['papa','nana','kelsi','molly','gunner'];

test('Phase W.5 registry locks exactly the explicitly approved turnarounds',()=>{
  assert.deepEqual([...registry.APPROVED_FAMILY_CHARACTER_IDS],approved);
  for(const id of approved){
    const spec=registry.getApprovedFamilyCharacter(id);
    assert.equal(spec?.identityLocked,true,`${id} must be identity locked`);
    assert.equal(spec?.approvalStatus,'TURNAROUND_APPROVED_MODEL_PENDING');
    assert.deepEqual([...spec.views],['front','front3q','side','back3q','back']);
    assert.match(spec.expectedModelFile,/^CHAR_[A-Z]+\.glb$/);
    assert.match(registry.expectedApprovedModelPath(id),/\/models\/characters\/approved\/CHAR_[A-Z]+\.glb$/);
    const ref=path.join(pub,spec.turnaround.replace(/^\//,''));
    assert.equal(fs.existsSync(ref),true,`${id} approved turnaround must be packaged`);
    assert.ok(fs.statSync(ref).size>50_000,`${id} turnaround should be a real image asset`);
  }
});

test('unapproved family members are not falsely promoted into the approved registry',()=>{
  for(const id of pending)assert.equal(registry.getApprovedFamilyCharacter(id),null,id);
});

test('Lizzy alias resolves to Elizabeth without creating a second identity',()=>{
  assert.equal(registry.getApprovedFamilyCharacter('lizzie')?.id,'elizabeth');
});

test('all free-moving 3D games consume the approved character registry',()=>{
  const files=['prop-hunt-3d.js','island-life.js','birthday-climb.js'];
  for(const f of files){
    const text=fs.readFileSync(path.join(pub,f),'utf8');
    assert.match(text,/approved-family-characters\.mjs/,`${f} must load the approved character registry`);
  }
});

test('master directives give approved turnarounds higher precedence than old realism language',()=>{
  for(const f of ['MASTER_APPROVED_FAMILY_CHARACTER_DIRECTIVE.md','MASTER_3D_DEVELOPMENT_DIRECTIVE.md','MASTER_NEXT_BUILD_DEVELOPMENT_DIRECTIVE.md']){
    const text=fs.readFileSync(path.join(root,f),'utf8');
    assert.match(text,/approved turnaround/i,f);
  }
  const master=fs.readFileSync(path.join(root,'MASTER_APPROVED_FAMILY_CHARACTER_DIRECTIVE.md'),'utf8');
  assert.match(master,/SIMPLIFY GEOMETRY, NOT IDENTITY/i);
  assert.match(master,/Dorothy[\s\S]*no glasses/i);
});

test('model manifest points approved characters at their locked reference files',()=>{
  const manifest=JSON.parse(fs.readFileSync(path.join(pub,'models','manifest.json'),'utf8'));
  assert.equal(manifest.approvedCharacterProgram.version,'W5-approved-turnarounds-2026-08-27');
  assert.deepEqual(manifest.approvedCharacterProgram.approvedIds,approved);
  assert.equal(manifest.characters.john.identityLocked,true,'John legacy runtime model carries the new identity lock metadata');
  assert.equal(manifest.characters.john.approvalStatus,'TURNAROUND_APPROVED_MODEL_PENDING');
  assert.deepEqual(Object.keys(manifest.characters),['john'],'pending approved GLBs must not be falsely listed as authored runtime assets');
});
