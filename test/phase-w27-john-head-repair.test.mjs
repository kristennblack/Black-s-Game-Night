import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
const root=path.resolve(new URL('..',import.meta.url).pathname);const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const runtime='GAME-NIGHT-STAGING-PHASE-W29-FAMILY-V1-CANDIDATES-53';
const design='GAME-NIGHT-DESIGN-PHASE-W29-FAMILY-V1-CANDIDATES-53';
const version='3.26.0-staging-phase-w29-family-v1-candidates-53';
function glbJson(rel){const b=fs.readFileSync(path.join(root,rel));assert.equal(b.subarray(0,4).toString(),'glTF');let off=12;while(off<b.length){const len=b.readUInt32LE(off),type=b.subarray(off+4,off+8).toString();off+=8;const chunk=b.subarray(off,off+len);off+=len;if(type==='JSON')return JSON.parse(chunk.toString().replace(/\0+$/,'').trim())}throw new Error('No JSON chunk')}

test('W27 release identity and cache isolation are current',()=>{
 assert.equal(read('CURRENT_RELEASE.txt').trim(),runtime);assert.equal(read('DESIGN_RELEASE.txt').trim(),design);assert.equal(JSON.parse(read('package.json')).version,version);
 const app=read('public/app.js'),sw=read('public/sw.js'),qa=read('public/phase-e-qa.mjs');
 assert.match(app,new RegExp(`PHASE_W29_RELEASE='${runtime}'`));assert.match(app,/CURRENT_BUILD=PHASE_W29_RELEASE/);assert.match(app,/sw\.js\?v=W29-FAMILY-V1-CANDIDATES-53/);
 assert.match(sw,/PHASE_W27_CACHE='black-family-game-night-staging-phase-w27-john-head-repair-52'/);assert.match(sw,/const CACHE=PHASE_W29_CACHE/);assert.match(sw,/w27-john-head-fit-lab\.html/);assert.match(sw,/w27-character-wearable-runtime\.mjs/);
 assert.match(qa,new RegExp(`STAGING_BUILD_ID='${runtime}'`));assert.match(qa,new RegExp(`STAGING_APP_VERSION='${version}'`));
});

test('John repaired GLB preserves rig and animation while using the approved stylized head source',()=>{
 const g=glbJson('public/models/characters/john-production-skinned.glb'),names=(g.nodes||[]).map(n=>n.name).filter(Boolean),materials=(g.materials||[]).map(m=>m.name);
 assert.ok(names.includes('head'));assert.ok(names.includes('headSocket'));assert.ok(names.includes('approvedFacePatch'));assert.ok((g.skins||[]).length>=1);assert.ok((g.animations||[]).length>=19);
 assert.ok(materials.includes('John_ApprovedStylizedFace'));assert.ok(!materials.includes('John_FacePhoto'));
 assert.equal(g.asset?.extras?.sourceReference,'/approved-character-turnarounds/john-approved-turnaround.png');assert.equal(g.asset?.extras?.headRepair,'W27-JOHN-HEAD-REPAIR');assert.equal(g.asset?.extras?.visualGate,'head-repair-device-pending');
 const patch=(g.nodes||[]).find(n=>n.name==='approvedFacePatch');assert.equal(patch?.extras?.source,'/approved-character-turnarounds/john-approved-turnaround.png');
});

test('W27 builder removes the legacy photo face source and the duplicate modeled-face conflict',()=>{
 const src=read('tools/build_vertical_slice_assets.py');
 assert.match(src,/approved-character-turnarounds.*john-approved-turnaround\.png/s);assert.doesNotMatch(src,/JOHN_16_LOOKS_REFERENCE\.jpg/);assert.match(src,/one curved approved face surface/);assert.match(src,/No duplicate modeled eyes/);
 // The repaired head uses one approved curved facial surface; semantic eye nodes remain rig targets only.
 const headBlock=src.slice(src.indexOf('# W27 head repair'),src.indexOf('# Knuckle/finger volumes'));
 assert.equal((headBlock.match(/add_face_patch\(/g)||[]).length,1);assert.doesNotMatch(headBlock,/m_eye_white|m_iris|m_pupil|m_lip/);
});

test('W27 exact head-bone fits are retuned for the repaired head',()=>{
 const m=read('public/w27-character-wearable-runtime.mjs');
 for(const token of ["parent:'head'","/models/w25/w25-dark-brown-ranch-cowboy-hat.glb","/models/w25/w25-gold-brown-aviators.glb","head.add(obj)","new THREE.AnimationMixer(john)"])assert.ok(m.includes(token),token);
 assert.match(m,/position:\[0,\.155,-\.005\].*scale:\.38/s);assert.match(m,/position:\[0,\.025,-\.202\].*scale:\.21/s);
 assert.match(m,/DEVICE APPROVAL PENDING/);
});

test('W27 fit lab and Production Shop expose repaired candidate without false device approval',()=>{
 const lab=read('public/w27-john-head-fit-lab.html'),shop=read('public/tokens-store.html'),manifest=read('public/w25-production-manifest.mjs');
 assert.match(lab,/repaired John head candidate/i);assert.match(lab,/final phone\/device visual approval is still required/i);assert.match(lab,/w27-character-wearable-runtime\.mjs/);assert.match(lab,/mountJohnHeadFitProof/);
 assert.match(shop,/w27-john-head-fit-lab\.html/);assert.match(shop,/John Head Fit Proof/);assert.match(shop,/w27-character-wearable-runtime\.mjs/);assert.match(shop,/mountJohnHeadFitProof/);assert.match(shop,/LIVE W27 REPAIRED-JOHN FIT PREVIEW/);assert.match(shop,/selected\.id==='cowboy-hat'\|\|selected\.id==='aviator-sunglasses'/);assert.match(manifest,/John W27 Repaired Head Fit Candidate; Device Approval Pending/);assert.match(shop,/Device Approval Pending/);
});
