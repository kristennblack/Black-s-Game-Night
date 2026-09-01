import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {
  CONTROL_PRESETS,movementSpeedForIntent,gaitForMovement,smoothVelocityToward,
  turnSemantic,sanitizeActorKinematics
} from '../public/shared-3d-gameplay.mjs';
import {groundSupport,mantleTarget} from '../public/prop-hunt-core.mjs';

const js=await readFile(new URL('../public/prop-hunt-3d.js',import.meta.url),'utf8');
const gameplay=await readFile(new URL('../public/shared-3d-gameplay.mjs',import.meta.url),'utf8');
const css=await readFile(new URL('../public/prop-hunt-3d.css',import.meta.url),'utf8');

const intent=strength=>({strength,directionX:0,directionZ:-1});

test('W30 analog locomotion has distinct walk, jog, run and sprint tiers',()=>{
  const p=CONTROL_PRESETS.propHunt;
  const walk=movementSpeedForIntent(intent(.4),p),jog=movementSpeedForIntent(intent(.7),p),run=movementSpeedForIntent(intent(1),p),sprint=movementSpeedForIntent(intent(1),p,{sprinting:true});
  assert.ok(walk>0&&walk<jog&&jog<run&&run<sprint,{walk,jog,run,sprint});
  assert.equal(gaitForMovement(intent(.35)),'walk');assert.equal(gaitForMovement(intent(.65)),'jog');assert.equal(gaitForMovement(intent(1)),'run');assert.equal(gaitForMovement(intent(1),{sprinting:true}),'sprint');
});

test('W30 velocity smoothing uses the already-scaled target speed only once',()=>{
  const a={vx:0,vz:0,grounded:true},half=intent(.5),target=movementSpeedForIntent(half,CONTROL_PRESETS.propHunt);for(let i=0;i<240;i++)smoothVelocityToward(a,half,target,1/60,{accel:25,brake:34,airControl:.34});
  assert.ok(Math.abs(Math.hypot(a.vx,a.vz)-target)<.02,{actual:Math.hypot(a.vx,a.vz),target});
});

test('W30 turn semantics distinguish sharp and planted 180 redirects',()=>{
  assert.equal(turnSemantic(.7),'turnRight');assert.equal(turnSemantic(-1.7),'sharpTurnLeft');assert.equal(turnSemantic(2.9),'turn180Right');
});

test('W30 multi-probe support remains stable when the center is near a walkable edge',()=>{
  const floor={x:0,z:0,y:0,w:3,d:3,h:.2,solid:true,blocksPlayer:true,walkableTop:true};const s=groundSupport(1.25,0,.32,[floor],.3,.42);
  assert.equal(s.height,.2);assert.ok(s.probeCount>=1);assert.equal(s.normal.y,1);
});

test('W30 mantle validation accepts a roomy top but rejects a top without capsule clearance',()=>{
  const actor={x:0,z:0,y:0,radius:.32,height:1.72};
  const roomy={x:0,z:-.8,y:0,w:1.5,d:1.2,h:.85,solid:true,blocksPlayer:true,climbable:true,walkableTop:true};
  assert.ok(mantleTarget(actor,roomy,0,-.2,[roomy],{radius:.32,height:1.72}));
  const narrow={x:0,z:-.7,y:0,w:1.2,d:.68,h:.85,solid:true,blocksPlayer:true,climbable:true,walkableTop:true};
  assert.equal(mantleTarget(actor,narrow,0,-.2,[narrow],{radius:.32,height:1.72}),null);
});

test('W30 invalid kinematics are rejected before they can cascade',()=>{
  const a={x:NaN,y:Infinity,z:2,vx:NaN,vy:4,vz:Infinity,yaw:NaN,pitch:Infinity,_lastSafePosition:{x:1,y:.2,z:3,yaw:.4}};
  assert.equal(sanitizeActorKinematics(a),true);for(const k of ['x','y','z','vx','vy','vz','yaw','pitch'])assert.ok(Number.isFinite(a[k]),k);assert.equal(a.x,1);assert.equal(a.z,2);
});

test('W30 source removes the mobile forward double-flip and uses the shared gait controller',()=>{
  assert.ok(!js.includes('correctedJoy={x:joy.x,z:-joy.z}'));
  assert.match(js,/movementIntent\(keys,joy,game\.cameraYaw\)/);assert.match(js,/movementSpeedForIntent/);assert.match(js,/gaitForMovement/);assert.match(js,/smoothVelocityToward/);
});

test('W30 mobile action lifecycle uses hold controls and clears every held action on blur/background',()=>{
  for(const token of ['id="phAim"','id="phShoot"','id="phSprint"','id="phJump"','id="phAlign"'])assert.ok(js.includes(token),token);
  for(const token of ['bindHoldButton(jump','bindHoldButton(sprint','bindHoldButton(aim','bindHoldButton(shootBtn','lostpointercapture','visibilitychange'])assert.ok(js.includes(token)||gameplay.includes(token),token);
  assert.match(js,/input\.shoot=false;input\.aim=false;input\.sprint=false;input\.jumpHeld=false;input\.jumpQueued=false/);assert.match(js,/game\.padShoot=false;game\.padAim=false;game\.padSprint=false;game\.padJumpHeld=false/);
  assert.match(js,/e\.pointerType!=='mouse'/,'touch camera gestures must not become shots');
});

test('W30 hunter aim is explicit and hider Lock auto-releases on intentional movement',()=>{
  assert.match(js,/input\.aim\|\|game\.padAim/);assert.match(js,/hunterAim=.*input\.aim\|\|game\.padAim/);assert.match(js,/if\(a\.locked&&a\.prop\)\{if\(intent\.strength>\.18\)\{a\.locked=false/);
  assert.match(css,/\.ph3d-act\.aim/);assert.match(css,/\.ph3d-act\.align/);
});

test('W30 disguise placement denies unsafe transformations instead of moving the player a metre',()=>{
  assert.match(js,/maxRadius:\.22,step:\.11/);assert.match(js,/Math\.hypot\(safe\.x-a\.x,safe\.z-a\.z\)>\.24/);
});

test('W30 pointer look and joystick can be disabled during the hunter hide phase',()=>{
  assert.match(gameplay,/bindPointerLook\(element,cameraRig,\{[^\n]*enabled=\(\)=>true/);assert.match(gameplay,/bindVirtualJoystick\(element,knob,joy,\{[^\n]*enabled=\(\)=>true/);
  assert.match(js,/bindPointerLook\(stage,game\.cameraRig,\{[^\n]*enabled:\(\)=>!isHunterHidePhase\(\)/);assert.match(js,/bindVirtualJoystick\(joyEl,stick,joy,\{[^\n]*enabled:\(\)=>!isHunterHidePhase\(\)/);
});


test('W30 QA autostart harness can force a deterministic solo role without affecting normal play',()=>{
  assert.match(js,/QA_MODE&&q\.get\('autostart'\)==='1'/);
  assert.match(js,/forcedRole=QA_MODE\?new URLSearchParams\(location\.search\)\.get\('qaRole'\):null/);
  assert.match(js,/forcedRole==='hunter'\|\|forcedRole==='hider'/);
});

test('W30 release identity, governing P0 contract and device QA checklist are packaged',async()=>{
  const current=(await readFile(new URL('../CURRENT_RELEASE.txt',import.meta.url),'utf8')).trim();
  const design=(await readFile(new URL('../DESIGN_RELEASE.txt',import.meta.url),'utf8')).trim();
  const pkg=JSON.parse(await readFile(new URL('../package.json',import.meta.url),'utf8'));
  const app=await readFile(new URL('../public/app.js',import.meta.url),'utf8');
  const sw=await readFile(new URL('../public/sw.js',import.meta.url),'utf8');
  const directive=await readFile(new URL('../MASTER_PROP_HUNT_P0_GAMEPLAY_ENGINE_REBUILD.md',import.meta.url),'utf8');
  const qa=await readFile(new URL('../PHONE_QA_PHASE_W30_PROP_HUNT_P0_GAMEPLAY_54.md',import.meta.url),'utf8');
  assert.equal(current,'GAME-NIGHT-STAGING-PHASE-W30-PROP-HUNT-P0-GAMEPLAY-54');
  assert.equal(design,'GAME-NIGHT-DESIGN-PHASE-W30-PROP-HUNT-P0-GAMEPLAY-54');
  assert.equal(pkg.version,'3.27.0-staging-phase-w30-prop-hunt-p0-gameplay-54');
  assert.match(app,/CURRENT_BUILD=PHASE_W30_RELEASE/);assert.match(sw,/const CACHE=PHASE_W30_CACHE/);
  assert.match(directive,/PROP HUNT P0 GAMEPLAY ENGINE REBUILD/);assert.match(qa,/P0 DEVICE GATE APPROVED/);
});
