import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const root=path.resolve(new URL('..',import.meta.url).pathname);
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const RELEASE='GAME-NIGHT-STAGING-PHASE-W7-PROP-HUNT-CHARACTER-COMBAT-32';

test('W7 release identity remains preserved after cumulative later phases',()=>{
  const app=read('public/app.js'),sw=read('public/sw.js');
  assert.match(app,/PHASE_W7_RELEASE='GAME-NIGHT-STAGING-PHASE-W7-PROP-HUNT-CHARACTER-COMBAT-32'/);
  assert.match(app,/PHASE_W8_RELEASE='GAME-NIGHT-STAGING-PHASE-W8-ARCADE-TUTORIAL-STORE-33'/);
  assert.match(app,/PHASE_W11_RELEASE='GAME-NIGHT-STAGING-PHASE-W11-PROP-HUNT-SMOOTHNESS-STABILITY-35'/);
  assert.match(app,/PHASE_W11_RELEASE='GAME-NIGHT-STAGING-PHASE-W11-PROP-HUNT-SMOOTHNESS-STABILITY-35'/);
  assert.match(app,/CURRENT_BUILD=PHASE_W22_RELEASE/);
  assert.match(sw,/PHASE_W7_CACHE='black-family-game-night-staging-phase-w7-prop-hunt-character-combat-32'/);
  assert.match(sw,/PHASE_W8_CACHE='black-family-game-night-staging-phase-w8-arcade-tutorial-store-33'/);
  assert.match(sw,/PHASE_W11_CACHE='black-family-game-night-staging-phase-w11-prop-hunt-smoothness-stability-35'/);
  assert.match(sw,/PHASE_W11_CACHE='black-family-game-night-staging-phase-w11-prop-hunt-smoothness-stability-35'/);
  assert.match(sw,/const CACHE=PHASE_W22_CACHE/);
});

test('approved John blocks the unapproved legacy GLB and keeps the approved procedural fallback',()=>{
  const prop=read('public/prop-hunt-3d.js'),manifest=JSON.parse(read('public/models/manifest.json'));
  assert.equal(manifest.characters.john.approvedModel,false);
  assert.match(prop,/approvedSpec&&entry\.approvedModel!==true/);
  assert.match(prop,/unapproved legacy GLB intentionally withheld/);
  assert.match(prop,/approvedModelWithheld=true/);
});

test('procedural hunter rig uses explicit right and left weapon grip sockets with forward-facing grip hands',()=>{
  const art=read('public/shared-3d-art-kit.mjs'),gameplay=read('public/shared-3d-gameplay.mjs');
  for(const token of ['rightGripSocket','leftGripSocket','rightGripHand','leftGripHand','weapon.userData.gripHands'])assert.ok(art.includes(token),token);
  assert.match(art,/buildPropZapper\(\.82\)/);
  assert.match(gameplay,/weaponGripActive/);
  assert.match(gameplay,/p\.leftArm\.hand\.visible=!weaponGripActive/);
  assert.match(gameplay,/p\.rightArm\.hand\.visible=!weaponGripActive/);
  assert.match(gameplay,/Two-hand hunter stance/);
});

test('John procedural silhouette keeps approved short brown hair, beard and plaid identity cues',()=>{
  const art=read('public/shared-3d-art-kit.mjs'),registry=read('public/approved-family-characters.mjs');
  assert.match(art,/Approved John silhouette: short side-swept brown hair/);
  assert.match(art,/if\(id==='john'\)/);
  assert.match(registry,/short side-swept brown hair/);
  assert.match(registry,/full short brown beard/);
  assert.match(registry,/pattern:'plaid'/);
});

test('hunter camera enters close shoulder aim mode during the hunt',()=>{
  const prop=read('public/prop-hunt-3d.js'),gameplay=read('public/shared-3d-gameplay.mjs');
  assert.match(prop,/hunterAim=a===player&&player\.role==='hunter'/);
  assert.match(prop,/game\.cameraRig\.state\.aim=hunterAim/);
  assert.match(prop,/aim:hunterAim,shoulderAlways:hunterAim/);
  assert.match(gameplay,/cameraDistance:4\.35,aimDistance:3\.25/);
  assert.match(gameplay,/shoulder:\.54/);
});

test('visible crosshair is centered on the actual camera ray on phones and desktop',()=>{
  const css=read('public/prop-hunt-3d.css'),prop=read('public/prop-hunt-3d.js');
  assert.match(css,/\.ph3d-crosshair\{[^}]*left:50%;top:50%/);
  assert.match(css,/\.ph3d-hit\{[^}]*left:50%;top:50%/);
  assert.doesNotMatch(css,/\.ph3d-crosshair\{top:44%\}/);
  assert.match(prop,/ray\.setFromCamera\((?:new THREE\.Vector2\(0,0\)|q\.screenCenter),game\.camera\)/);
});

test('shots remain muzzle-validated and now render readable tracer plus impact feedback',()=>{
  const prop=read('public/prop-hunt-3d.js');
  assert.match(prop,/revalidateShotFromMuzzle/);
  assert.match(prop,/muzzleWorldPosition/);
  assert.match(prop,/new THREE\.CylinderGeometry\(\.014,\.022,(?:len|1)/);
  assert.match(prop,/spawnImpactBurst\(hitPoint/);
  assert.match(prop,/new THREE\.RingGeometry\(\.055,\.11,20\)/);
  assert.match(prop,/showShotImpact/);
  assert.match(prop,/target\._hitShake=\.22/);
});

test('W7 master directive locks the production gate and resolved 31 Blind definition',()=>{
  const master=read('MASTER_NEXT_BUILD_DEVELOPMENT_DIRECTIVE.md');
  for(const phrase of ['John is the first production gate','right hand on the trigger','left hand supporting the fore-end','visible 3D energy tracer','actual phone','Blind player starts with exactly 3 face-down cards','may pass and wait for the next turn'])assert.match(master,new RegExp(phrase.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'),'i'));
});
