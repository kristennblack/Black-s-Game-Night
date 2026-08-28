import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {createFixedStepRunner,rememberSafeActorPosition,recoverActorToLastSafe} from '../public/shared-3d-gameplay.mjs';
import * as core from '../public/prop-hunt-core.mjs';

const root=path.resolve(new URL('..',import.meta.url).pathname);
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const W11='GAME-NIGHT-STAGING-PHASE-W11-PROP-HUNT-SMOOTHNESS-STABILITY-35';

test('W11 fixed-step runner advances gameplay at 60 Hz and bounds catch-up after a long phone frame',()=>{
  const runner=createFixedStepRunner({hz:60,maxFrame:.12,maxSteps:6});
  let calls=0,total=0;
  const a=runner.advance(1/30,dt=>{calls++;total+=dt});
  assert.equal(a.steps,2);assert.equal(calls,2);assert.ok(Math.abs(total-1/30)<1e-9);assert.ok(a.alpha>=0&&a.alpha<1);
  const b=runner.advance(.5,()=>{calls++});
  assert.ok(b.steps<=6);assert.ok(b.droppedTime>.3,'long background/stall time should be dropped rather than simulated as a huge burst');
});

test('W11 last-known-safe recovery prefers a recorded open grounded point',()=>{
  const bounds={minX:-5,maxX:5,minZ:-5,maxZ:5};
  const wall={x:0,z:0,y:0,w:1.4,d:1.4,h:3,solid:true,blocksPlayer:true};
  const actor={x:-2,y:0,z:0,yaw:.4,vx:0,vy:0,vz:0,radius:.3,height:1.8,grounded:true,mantle:null,rig:{position:{set(){}}}};
  rememberSafeActorPosition(core,actor,[wall],bounds,.5,{interval:.45});
  assert.equal(actor._lastSafePosition.x,-2);
  actor.x=0;actor.z=0;actor.vx=4;actor.vy=-3;
  assert.ok(core.blockingCollider(actor.x,actor.z,actor.radius,actor.y,actor.height,[wall]));
  assert.equal(recoverActorToLastSafe(core,actor,[wall],bounds,{radius:.3,height:1.8}),true);
  assert.equal(actor.x,-2);assert.equal(actor.z,0);assert.equal(actor.vx,0);assert.equal(actor.vy,0);assert.equal(actor.grounded,true);
});

test('W11 collision responsibilities independently control player camera and vision blocking',()=>{
  const playerGhost={x:0,z:0,y:0,w:2,d:2,h:3,solid:true,blocksPlayer:false};
  assert.equal(core.blockingCollider(0,0,.3,0,1.8,[playerGhost]),null);
  const cameraGhost={x:0,z:-2,y:0,w:3,d:.5,h:3,solid:true,blocksCamera:false};
  assert.ok(core.cameraObstructionDistance({x:0,y:1,z:0},{x:0,y:1,z:-4},[cameraGhost],.2)>3.9);
  const visionGhost={x:0,z:-2,y:0,w:3,d:.5,h:3,solid:true,blocksVision:false};
  assert.equal(core.lineOfSightClear({x:0,y:1,z:0},{x:0,y:1,z:-4},[visionGhost]),true);
});

test('W11 Prop Hunt splits fixed simulation from presentation and interpolates render roots',()=>{
  const src=read('public/prop-hunt-3d.js');
  for(const token of ['createFixedStepRunner({hz:60','simulateFixed(dt,now)','presentFrame(frameDt,now,fixed.alpha)','snapshotSimulationStart','snapshotSimulationEnd','interpolateSimulationRoots(alpha)'])assert.ok(src.includes(token),token);
  assert.match(src,/game\.frameAlpha=fixed\.alpha/);
  assert.match(src,/core\.lerp\(p\.x,c\.x,t\)/);
});

test('W11 camera uses obstruction hysteresis and avoids a fresh right-vector allocation every update',()=>{
  const src=read('public/shared-3d-gameplay.mjs');
  for(const token of ['resolvedDistance','clearFor','W.11 camera hysteresis','state.clearFor>.11','temp.right.set(cy,0,-sy)'])assert.ok(src.includes(token),token);
  assert.doesNotMatch(src,/right=new THREE\.Vector3\(cy,0,-sy\)/);
});

test('W11 validates disguise/decoy placement and constrains network decoy placement near the sender',()=>{
  const prop=read('public/prop-hunt-3d.js'),room=read('propHuntRoom.mjs');
  for(const token of ['safeDisguisePlacement','prepareDisguise','Not enough room to disguise here','safeDecoyPlacement','No safe room for a decoy here'])assert.ok(prop.includes(token),token);
  assert.match(room,/Math\.hypot\(req\.x-live\.x,req\.y-live\.y,req\.z-live\.z\)<=1\.9/);
  assert.match(room,/position=close\?/);
});

test('W11 pools and caps repeated effects and adapts phone rendering quality',()=>{
  const prop=read('public/prop-hunt-3d.js'),shared=read('public/shared-3d-gameplay.mjs');
  for(const token of ['initEffectPool','acquireFx','releaseEffect','fxBudget','game.fxShared','applyPerformanceQuality'])assert.ok(prop.includes(token),token);
  assert.match(prop,/tier==='low'\?30:tier==='medium'\?54:84/);
  assert.match(shared,/createPerformanceGovernor/);assert.match(shared,/emaFps/);assert.match(shared,/setQuality\('low'\)/);assert.match(shared,/renderer\.setPixelRatio/);
});

test('W11 handles phone browser resume and WebGL context loss without simulating a giant stale frame',()=>{
  const prop=read('public/prop-hunt-3d.js');
  for(const token of ['webglcontextlost','webglcontextrestored','visibilitychange','game.fixedStep?.reset?.()','resumed from background','game.contextLost'])assert.ok(prop.includes(token),token);
  assert.match(prop,/if\(game\.contextLost\)\{game\.fixedStep\?\.reset/);
});

test('W11 QA exposes frame-time tail latency and stability diagnostics',()=>{
  const prop=read('public/prop-hunt-3d.js');
  for(const token of ['frameTimes','p95Ms','peak ${q.maxMs.toFixed(1)} ms','recoveries ${game.stability.recoveries}','quality ${game.qualityTier}'])assert.ok(prop.includes(token),token);
});

test('W11 release identity is current while W7/W8 historical identities remain preserved',()=>{
  assert.equal(read('CURRENT_RELEASE.txt').trim(),'GAME-NIGHT-STAGING-PHASE-W12-GAMEPLAY-CORRECTIONS-36');
  assert.equal(read('DESIGN_RELEASE.txt').trim(),'GAME-NIGHT-DESIGN-PHASE-W12-GAMEPLAY-CORRECTIONS-36');
  const pkg=JSON.parse(read('package.json')),app=read('public/app.js'),sw=read('public/sw.js');
  assert.equal(pkg.version,'3.13.0-staging-phase-w12-gameplay-corrections-36');
  assert.match(app,/PHASE_W7_RELEASE='GAME-NIGHT-STAGING-PHASE-W7-PROP-HUNT-CHARACTER-COMBAT-32'/);
  assert.match(app,/PHASE_W8_RELEASE='GAME-NIGHT-STAGING-PHASE-W8-ARCADE-TUTORIAL-STORE-33'/);
  assert.match(app,/PHASE_W11_RELEASE='GAME-NIGHT-STAGING-PHASE-W11-PROP-HUNT-SMOOTHNESS-STABILITY-35'/);
  assert.match(app,/CURRENT_BUILD=PHASE_W12_RELEASE/);
  assert.match(app,/sw\.js\?v=GAME-NIGHT-STAGING-PHASE-W12-GAMEPLAY-CORRECTIONS-36/);
  assert.match(sw,/PHASE_W11_CACHE='black-family-game-night-staging-phase-w11-prop-hunt-smoothness-stability-35'/);
  assert.match(sw,/const CACHE=PHASE_W12_CACHE/);
});

test('W11 canonical prompt locks smoothness before content and separates implemented runtime from future asset/network work',()=>{
  const master=read('MASTER_GAME_DESIGN_PRODUCTION_PROMPT_W11.md'),directive=read('MASTER_PHASE_W11_PROP_HUNT_SMOOTHNESS_STABILITY_DIRECTIVE.md');
  for(const phrase of ['fixed 60 Hz gameplay','render interpolation','CAMERA HYSTERESIS','LAST-KNOWN-SAFE POSITION','DYNAMIC QUALITY GOVERNOR','EFFECT POOLING','PAPA\'S SHOP PERFORMANCE BENCHMARK','BACKGROUND / RESUME','WEBGL CONTEXT LOSS','ASSET / NETWORK WORK STILL REQUIRED','actual phone'])assert.match(master,new RegExp(phrase,'i'));
  assert.match(directive,/Smoothness is a shipping feature\. Stability is gameplay/i);
  assert.match(master,/do not add another Prop Hunt map/i);
  assert.ok(fs.existsSync(path.join(root,'PHONE_QA_PHASE_W11_PROP_HUNT_SMOOTHNESS_STABILITY_35.md')));
});
