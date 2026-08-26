import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {movementRelativeToFacing,resolveDirectionalLocomotion} from '../public/shared-3d-gameplay.mjs';

const read=p=>fs.readFileSync(new URL(`../${p}`,import.meta.url),'utf8');
const BUILD='GAME-NIGHT-STAGING-PHASE-U2-ARCADE-PACK-22';
const CACHE='black-family-game-night-staging-phase-u2-arcade-pack-22';

test('Phase T has a fresh isolated build/cache identity',()=>{
  assert.equal(read('VERSION.txt').trim(),BUILD);
  assert.match(read('public/app.js'),new RegExp(BUILD));
  assert.match(read('public/sw.js'),new RegExp(CACHE));
  assert.match(read('wrangler.staging.jsonc'),/black-family-game-night-phase-t1-staging/);
});

test('directional aiming classifies forward, backpedal and strafes in facing space',()=>{
  const forward={yaw:0,vx:0,vz:-3},back={yaw:0,vx:0,vz:2},right={yaw:0,vx:2,vz:0},left={yaw:0,vx:-2,vz:0};
  assert.ok(movementRelativeToFacing(forward).z>.9);
  assert.equal(resolveDirectionalLocomotion(forward,{aiming:true}).semantic,'walk');
  assert.equal(resolveDirectionalLocomotion(back,{aiming:true}).semantic,'backward');
  assert.equal(resolveDirectionalLocomotion(right,{aiming:true}).semantic,'strafeRight');
  assert.equal(resolveDirectionalLocomotion(left,{aiming:true}).semantic,'strafeLeft');
});

test('player faces travel direction as hider and camera/crosshair direction as hunter',()=>{
  const src=read('public/prop-hunt-3d.js');
  assert.match(src,/targetYaw=aiming\?game\.cameraYaw:movingIntent\?Math\.atan2\(intent\.directionX,-intent\.directionZ\):a\.yaw/);
  assert.match(src,/resolveDirectionalLocomotion\(a,\{aiming,sprinting:sprint\}\)/);
});

test('authored locomotion keeps aim/fire layered and supports reverse backpedal playback',()=>{
  const prop=read('public/prop-hunt-3d.js'),studio=read('public/shared-3d-studio.mjs');
  assert.match(prop,/directional\.semantic/);
  assert.match(prop,/lower==='backward'\?-Math\.max/);
  assert.match(prop,/playLayered\(lower,overlay/);
  assert.match(studio,/if\(timeScale<0\)action\.time=/);
  assert.match(studio,/directionalAimLocomotion:true/);
});

test('jump landing and mantle have a stronger gameplay-feel pass',()=>{
  const src=read('public/prop-hunt-3d.js');
  for(const token of ['_landingStrength','_hardLandTimer','duration:.48','const lift=clamp(m.t/.62','push=clamp((m.t-.12)/.88,0,1)' ]) assert.ok(src.includes(token),token);
});

test('hider disguise, decoy and flash actions have deliberate readable feedback',()=>{
  const src=read('public/prop-hunt-3d.js');
  for(const token of ['spawnTransformBurst','_propTransform=1','spawnPlacementRing','spawnFlashBurst','Decoy placed.']) assert.ok(src.includes(token),token);
  assert.match(src,/a\.x\+fwdX\*\.78/);
});

test('damage and Classic elimination move into a spectator camera instead of a dead view',()=>{
  const src=read('public/prop-hunt-3d.js'),css=read('public/prop-hunt-3d.css');
  for(const token of ['showDamage(','cycleSpectate(','spectateTarget','SPECTATING ·']) assert.ok(src.includes(token),token);
  assert.match(css,/\.ph3d-damage/);
  assert.match(css,/\.ph3d-spectate/);
});

test('mobile hider HUD surfaces remaining tactical resources directly on buttons',()=>{
  const src=read('public/prop-hunt-3d.js');
  assert.match(src,/propBtn\.textContent=`PROP \$\{a\.propChanges\}`/);
  assert.match(src,/flashBtn\.textContent=a\.flash\?'FLASH ✓':'FLASH ×'/);
  assert.match(src,/decoyBtn\.textContent=`DECOY \$\{a\.decoys\}`/);
  assert.match(src,/health\.textContent=`HP \$\{'●'\.repeat\(hp\)\}\$\{'○'\.repeat/);
});

test('Phase S tabletop repairs remain present while Prop Hunt advances',()=>{
  const app=read('public/app.js');
  assert.match(app,/if\(s\.gameType===GAME\.SKIP_BO\)return skipBoGameplay/);
  assert.match(app,/if\(\[GAME\.BACKGAMMON,GAME\.BLACK_GAMMON\]\.includes\(s\.gameType\)\)return gammonGameplay/);
  assert.match(app,/if\(s\.gameType===GAME\.CRIBBAGE\)return cribbageGameplay/);
});
