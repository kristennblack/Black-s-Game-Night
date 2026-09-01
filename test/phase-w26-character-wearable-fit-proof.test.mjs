import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
const root=path.resolve(new URL('..',import.meta.url).pathname);const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const runtime='GAME-NIGHT-STAGING-PHASE-W30-PROP-HUNT-P0-GAMEPLAY-54';
const design='GAME-NIGHT-DESIGN-PHASE-W30-PROP-HUNT-P0-GAMEPLAY-54';
const version='3.27.0-staging-phase-w30-prop-hunt-p0-gameplay-54';
function glbJson(rel){const b=fs.readFileSync(path.join(root,rel));assert.equal(b.subarray(0,4).toString(),'glTF');let off=12;while(off<b.length){const len=b.readUInt32LE(off),type=b.subarray(off+4,off+8).toString();off+=8;const chunk=b.subarray(off,off+len);off+=len;if(type==='JSON')return JSON.parse(chunk.toString().replace(/\0+$/,'').trim())}throw new Error('No JSON chunk')}

test('W26 release identity and cache isolation are current',()=>{
 assert.equal(read('CURRENT_RELEASE.txt').trim(),runtime);assert.equal(read('DESIGN_RELEASE.txt').trim(),design);assert.equal(JSON.parse(read('package.json')).version,version);
 const app=read('public/app.js'),sw=read('public/sw.js'),qa=read('public/phase-e-qa.mjs');
 assert.match(app,new RegExp(`PHASE_W30_RELEASE='${runtime}'`));assert.match(app,/CURRENT_BUILD=PHASE_W30_RELEASE/);assert.match(app,/sw\.js\?v=W30-PROP-HUNT-P0-GAMEPLAY-54/);
 assert.match(sw,/PHASE_W26_CACHE='black-family-game-night-staging-phase-w26-character-wearable-fit-proof-51'/);assert.match(sw,/PHASE_W27_CACHE='black-family-game-night-staging-phase-w27-john-head-repair-52'/);assert.match(sw,/const CACHE=PHASE_W30_CACHE/);assert.match(sw,/w26-john-fit-lab\.html/);assert.match(sw,/w26-character-wearable-runtime\.mjs/);
 assert.match(qa,new RegExp(`STAGING_BUILD_ID='${runtime}'`));assert.match(qa,new RegExp(`STAGING_APP_VERSION='${version}'`));
});

test('John legacy rig exposes a real head bone and animation contract for technical attachment proof',()=>{
 const g=glbJson('public/models/characters/john-production-skinned.glb');const names=(g.nodes||[]).map(n=>n.name).filter(Boolean);
 assert.ok(names.includes('head'));assert.ok(names.includes('headSocket'));assert.ok(names.includes('JohnRig'));assert.ok((g.skins||[]).length>=1);assert.ok((g.animations||[]).length>=19);
});

test('W26 runtime attaches the actual cowboy hat and aviators GLBs to the John head bone',()=>{
 const m=read('public/w26-character-wearable-runtime.mjs');
 for(const token of ["parent:'head'","/models/w25/w25-dark-brown-ranch-cowboy-hat.glb","/models/w25/w25-gold-brown-aviators.glb","head.add(obj)","new THREE.AnimationMixer(john)"])assert.ok(m.includes(token),token);
 assert.match(m,/position:\[0,\.135,-\.005\]/);assert.match(m,/scale:\.38/);assert.match(m,/position:\[0,\.035,-\.202\]/);assert.match(m,/scale:\.31/);
});

test('W26 fit lab is a truthful technical proof and does not call legacy John art-approved',()=>{
 const h=read('public/w26-john-fit-lab.html');
 for(const token of ['John Wearable Rig Proof','Cowboy Hat','Aviators','Hat + Aviators','named humanoid rig',"John's visible legacy mesh",'not'])assert.ok(h.toLowerCase().includes(token.toLowerCase()),token);
 assert.match(h,/w26-character-wearable-runtime\.mjs/);assert.match(h,/mountJohnWearableFitProof/);
});

test('Kristen and Kelsi authored-character handoff pack is complete and machine-readable',()=>{
 const base=path.join(root,'W26_CHARACTER_PRODUCTION_HANDOFF');
 for(const rel of ['README_W26_CHARACTER_PRODUCTION_HANDOFF.md','ARTIST_DELIVERY_CHECKLIST.md','references/kristen-approved-turnaround.png','references/kelsi-w26-turnaround-reference.png','references/john-approved-turnaround.png','references/family-prop-hunt-lineup.png','specs/CHAR_KRISTEN_W26.json','specs/CHAR_KELSI_W26.json','specs/CHAR_JOHN_W26_REPLACEMENT.json','specs/W26_WEARABLE_ANCHOR_CONTRACT.json','proofs/W26_JOHN_WEARABLE_FIT_PROOF.png']){const p=path.join(base,rel);assert.ok(fs.existsSync(p),rel);assert.ok(fs.statSync(p).size>100,rel)}
 const k=JSON.parse(fs.readFileSync(path.join(base,'specs/CHAR_KRISTEN_W26.json'))),d=JSON.parse(fs.readFileSync(path.join(base,'specs/CHAR_KELSI_W26.json'))),a=JSON.parse(fs.readFileSync(path.join(base,'specs/W26_WEARABLE_ANCHOR_CONTRACT.json')));
 assert.equal(k.status,'AUTHORING_REQUIRED');assert.equal(d.status,'AUTHORING_REQUIRED');assert.ok(k.rig.required_sockets.includes('glassesBridgeSocket'));assert.ok(d.rig.required_sockets.includes('leftEarCharmSocket'));assert.equal(a.john_legacy_technical_fit.hat.parent_bone,'head');
});

test('Production shop links directly to the John fit proof while keeping release gates locked',()=>{
 const h=read('public/tokens-store.html'),m=read('public/w25-production-manifest.mjs');assert.match(h,/w27-john-head-fit-lab\.html/);assert.match(h,/John Head Fit Proof/);assert.match(m,/John W27 Repaired Head Fit Candidate; Device Approval Pending/);assert.match(h,/Device Approval Pending/);
});
