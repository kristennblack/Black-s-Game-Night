import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import * as core from '../public/prop-hunt-core.mjs';
import {familyBodyProfile} from '../public/shared-3d-gameplay.mjs';
import {DEFAULT_MODEL_MANIFEST} from '../public/shared-3d-studio.mjs';
import {STAGING_BUILD_ID} from '../public/phase-e-qa.mjs';

const read=rel=>readFile(new URL(rel,import.meta.url),'utf8');
const [prop,island,birthday,sw,app,manifestText]=await Promise.all([
  read('../public/prop-hunt-3d.js'),read('../public/island-life.js'),read('../public/birthday-climb.js'),read('../public/sw.js'),read('../public/app.js'),read('../public/models/manifest.json')
]);
const manifest=JSON.parse(manifestText);

test('Phase E staging identifier is explicit and cache-versioned',()=>{
  assert.equal(STAGING_BUILD_ID,'GAME-NIGHT-STAGING-PHASE-R-PROP-HUNT-P2-GAMMON-UX-16');
  assert.ok(app.includes(STAGING_BUILD_ID));
  assert.ok(sw.includes('black-family-game-night-staging-phase-r-prop-hunt-p2-gammon-ux-16'));
  assert.ok(sw.includes('/phase-e-qa.mjs'));
});

test('all three realtime games expose Phase E diagnostics, mobile guards and zoom controls',()=>{
  for(const src of [prop,island,birthday]){
    assert.ok(src.includes('phase-e-qa.mjs'));
    assert.ok(src.includes('mountStagingDiagnostics'));
    assert.ok(src.includes('installInteractionGuards'));
    assert.ok(src.includes('mountZoomButtons'));
    assert.ok(src.includes('Reset camera'));
    assert.ok(src.includes('resetPlayableView'));
  }
});

test('missing authored family avatars are explicitly reported instead of silently claimed as authored',()=>{
  for(const src of [prop,island,birthday])assert.ok(src.includes('reportMissing'));
  assert.deepEqual(Object.keys(manifest.characters),['john']);
  assert.deepEqual(Object.keys(manifest.dogs),['gunner']);
  assert.deepEqual(Object.keys(DEFAULT_MODEL_MANIFEST.characters),['john']);
  assert.deepEqual(Object.keys(DEFAULT_MODEL_MANIFEST.dogs),['gunner']);
});

test('John and Gunner authored GLBs are shared across all three realtime games',()=>{
  for(const [cat,id] of [['characters','john'],['dogs','gunner']]){
    assert.deepEqual(manifest[cat][id].games,['propHunt','islandLife','birthdaySeat']);
  }
  assert.ok(prop.includes('hasAuthoredClips'));
  assert.ok(island.includes('hasAuthoredClips'));
  assert.ok(birthday.includes('hasAuthoredClips'));
});

test('family body dimensions are centralized for humans and dogs',()=>{
  const john=familyBodyProfile('john');
  const holly=familyBodyProfile('holly');
  const gunner=familyBodyProfile('gunner',{dog:true});
  assert.equal(john.height,1.82);
  assert.equal(holly.height,1.42);
  assert.equal(gunner.height,1.08);
  assert.ok(gunner.radius>john.radius);
});

test('camera obstruction treats the camera as a volume, catching a side-edge blocker missed by the center ray',()=>{
  const target={x:0,y:1.2,z:0},desired={x:0,y:1.2,z:-4};
  const edgeWall={x:.18,z:-2,y:0,w:.10,d:.35,h:3,solid:true};
  const centerOnly=core.cameraObstructionDistance(target,desired,[edgeWall],.1,0);
  const volume=core.cameraObstructionDistance(target,desired,[edgeWall],.1,.16);
  assert.ok(centerOnly>3.9,`center ray unexpectedly hit at ${centerOnly}`);
  assert.ok(volume<2.2,`camera volume missed edge blocker at ${volume}`);
});

test('long-frame movement is substepped so thin walls cannot be tunneled through',()=>{
  const actor={x:0,y:0,z:0,radius:.2,height:1.8};
  const wall={x:.8,z:0,y:0,w:.10,d:4,h:3,solid:true};
  const r=core.attemptCharacterMove(actor,2,0,[wall],{radius:.2,height:1.8});
  assert.ok(r.substeps>1);
  assert.ok(r.blocked);
  assert.ok(r.x<.6,`tunneled through wall to x=${r.x}`);
});

test('Island Life and Birthday Seat preserve user zoom during ordinary camera updates',()=>{
  assert.doesNotMatch(island,/state\.targetDistance=game\.zone==='home'\?3\.9:game\.cameraRig\.cfg\.cameraDistance/);
  assert.doesNotMatch(birthday,/state\.targetDistance=game\.finished\?3\.45:game\.cameraRig\.cfg\.cameraDistance/);
});
