import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {
  CONTROL_PRESETS,movementIntent,smoothVelocity,updateJumpMemory,consumeBufferedJump,applyVariableJump,
  wantsSprint,playTransientAnimation,resolveLocomotionAnim,chooseInteraction,loadControlPreferences,updateMotionTelemetry,updateAttention,consumeMotionEvents,interactionAnimation,playContextAnimation,updateContextFacing,GAMEPLAY_3D_VERSION
} from '../public/shared-3d-gameplay.mjs';

const gameplay=await readFile(new URL('../public/shared-3d-gameplay.mjs',import.meta.url),'utf8');
const art=await readFile(new URL('../public/shared-3d-art-kit.mjs',import.meta.url),'utf8');
const prop=await readFile(new URL('../public/prop-hunt-3d.js',import.meta.url),'utf8');
const island=await readFile(new URL('../public/island-life.js',import.meta.url),'utf8');
const birthday=await readFile(new URL('../public/birthday-climb.js',import.meta.url),'utf8');
const sw=await readFile(new URL('../public/sw.js',import.meta.url),'utf8');

test('all free-moving 3D games share the v2 studio-realism gameplay/control framework',()=>{
  assert.equal(GAMEPLAY_3D_VERSION,'2.0.0');
  for(const src of [prop,island,birthday])assert.ok(src.includes('/shared-3d-gameplay.mjs'));
  for(const token of ['createThirdPersonCamera','bindPointerLook','bindVirtualJoystick','readGamepadButtons','applyGamepadLook','createPerformanceGovernor','animateFamilyRig'])assert.ok(gameplay.includes(token),token);
  assert.ok(sw.includes('/shared-3d-gameplay.mjs'));
  assert.ok(sw.includes('black-family-game-night-v300-production3d-papa-alpha'));
});

test('movement input preserves analog joystick strength and is camera-relative',()=>{
  const a=movementIntent({}, {x:.5,z:0}, 0,{gamepad:false});
  assert.ok(Math.abs(a.strength-.5)<.001);assert.ok(Math.abs(a.x-.5)<.001);assert.ok(Math.abs(a.z)<.001);
  const b=movementIntent({KeyW:true},{x:0,z:0},Math.PI/2,{gamepad:false});
  assert.ok(b.x>.99);assert.ok(Math.abs(b.z)<.01);
});

test('velocity has acceleration and braking instead of instant start-stop motion',()=>{
  const actor={vx:0,vz:0,grounded:true};const intent={x:1,z:0,strength:1};
  smoothVelocity(actor,intent,4,1/60,{accel:12,brake:20,airControl:.3});
  assert.ok(actor.vx>0&&actor.vx<4);
  const before=actor.vx;smoothVelocity(actor,{x:0,z:0,strength:0},4,1/60,{accel:12,brake:20,airControl:.3});
  assert.ok(actor.vx<before&&actor.vx>=0);
});

test('jump buffering and coyote time both accept human-scale late/early jump input',()=>{
  const early={grounded:false,vy:0,_coyote:.05};updateJumpMemory(early,.01,true);assert.equal(consumeBufferedJump(early,6.2),true);assert.equal(early.vy,6.2);
  const buffered={grounded:false,vy:-1};updateJumpMemory(buffered,.01,true);assert.ok(buffered._jumpBuffer>0);buffered.grounded=true;updateJumpMemory(buffered,.02,false);assert.equal(consumeBufferedJump(buffered,5.9),true);
});

test('interaction targeting prefers something in front instead of a slightly closer object behind',()=>{
  const actor={x:0,z:0,yaw:0};
  const pick=chooseInteraction(actor,[{id:'behind',x:0,z:.8},{id:'front',x:0,z:-1.0}],{radius:2,yaw:0});
  assert.equal(pick.id,'front');
});

test('animation system contains semantic poses, blinking, quadruped gait and future-authored-rig language',()=>{
  for(const token of ["anim==='hit'","anim==='mantle'","anim==='drink'","anim==='wave'","anim==='work'","anim==='land'",'blinkWindow','tailPivot','leftArm','rightArm'])assert.ok(gameplay.includes(token),token);
  assert.ok(art.includes('const face=new THREE.Group(),eyes=[]'));
  assert.ok(art.includes('g.userData.parts={hips,upperBody,torso,head,face,eyes'));
  assert.ok(art.includes('g.userData.parts={body,chest,head,muzzle,jaw,tongue,eyes,ears,legs,tailPivot'));
});



test('variable jump height trims upward velocity when jump is released early',()=>{
  const held={vy:6.2};applyVariableJump(held,true);assert.equal(held.vy,6.2);
  const released={vy:6.2};applyVariableJump(released,false);assert.ok(released.vy<4&&released.vy>2);
});

test('sprint and locomotion semantics are shared instead of reimplemented per game',()=>{
  assert.equal(wantsSprint({ShiftLeft:true},{},{},{strength:.2}),true);
  assert.equal(wantsSprint({}, {sprint:true},{},{strength:.2}),true);
  assert.equal(resolveLocomotionAnim({grounded:false,vy:2},{moving:false}),'jump');
  assert.equal(resolveLocomotionAnim({grounded:false,vy:-1},{moving:false}),'fall');
  assert.equal(resolveLocomotionAnim({grounded:true,landTimer:.1},{moving:true,sprinting:true}),'land');
  assert.equal(resolveLocomotionAnim({grounded:true,landTimer:0},{moving:true,sprinting:true}),'run');
  assert.equal(resolveLocomotionAnim({grounded:true,landTimer:0},{moving:false,aiming:true}),'aim');
});

test('transient semantic animations survive the locomotion loop long enough to be visible',()=>{
  const actor={grounded:true,landTimer:0};playTransientAnimation(actor,'wave',1000,5000);
  assert.equal(resolveLocomotionAnim(actor,{moving:false,now:5500}),'wave');
  assert.equal(resolveLocomotionAnim(actor,{moving:false,now:6100}),'idle');
  for(const token of ['playTransientAnimation','celebrate','drink','work','wave'])assert.ok(gameplay.includes(token));
  assert.ok(island.includes('jobAnimationFor(state.viewer.job)')||island.includes("playContextAnimation(game.player,'work'"));
  assert.ok(prop.includes("playTransientAnimation(target,'hit'"));
});

test('shared 3D art kit provides low-cost environmental ambience in every free-moving 3D game',()=>{
  assert.ok(art.includes('function animateAmbience'));
  assert.ok(art.includes('ambientSway'));
  assert.ok(art.includes('waterSurface'));
  for(const src of [prop,island,birthday])assert.ok(src.includes('animateAmbience'));
});

test('3D control preferences are shared, persistent-capable and exposed in every free-moving game',()=>{
  const prefs=loadControlPreferences();
  assert.equal(prefs.lookScale,1);assert.equal(prefs.invertY,false);assert.equal(prefs.leftHanded,false);
  for(const token of ['mountControlPreferences','lookScale','invertY','leftHanded','g3d-left-handed'])assert.ok(gameplay.includes(token),token);
  for(const src of [prop,island,birthday])assert.ok(src.includes('mountControlPreferences'));
  for(const src of [prop,island,birthday])assert.ok(src.includes('CAM ↔'));
});

test('camera framework supports shoulder swapping and all three games expose it',()=>{
  assert.ok(gameplay.includes('swapShoulder'));
  assert.ok(gameplay.includes('shoulderSign'));
  for(const src of [prop,island,birthday])assert.ok(src.includes('swapShoulder'));
});

test('John birthday race is a genuine WebGL 3D game using the shared rigs and controls',()=>{
  assert.ok(birthday.includes('new THREE.WebGLRenderer'));
  assert.ok(birthday.includes('createThirdPersonCamera'));
  assert.ok(birthday.includes('art.buildHumanRig'));
  assert.ok(birthday.includes('art.buildDogRig'));
  assert.ok(birthday.includes('applyVariableJump'));
  assert.ok(birthday.includes('movingPlatforms')||birthday.includes('movingUpdate'));
  assert.ok(birthday.includes('const riders=game.actors.filter'));
  assert.ok(birthday.includes('a.x+=dx;a.z+=dz'));
  assert.ok(birthday.includes("playTransientAnimation(game.player,'celebrate'"));
  assert.ok(birthday.includes('movingPlatformsCarryRiders:true'));
  assert.ok(birthday.includes('live3DFinishCelebration:true'));
  assert.doesNotMatch(birthday,/getContext\(['"]2d['"]\)|fillRect\(|drawImage\(/i);
});

test('Island Life interaction targeting follows the camera view and Prop Hunt no longer keeps a second one-off rig animator',()=>{
  assert.ok(island.includes('yaw:game.cameraYaw'));
  assert.doesNotMatch(prop,/function animateRig\(/);
});

test('each 3D game has a deliberately different movement/camera tuning profile',()=>{
  assert.ok(CONTROL_PRESETS.propHunt.cameraDistance<CONTROL_PRESETS.island.cameraDistance);
  assert.ok(CONTROL_PRESETS.birthday.airControl>CONTROL_PRESETS.island.airControl);
  assert.ok(CONTROL_PRESETS.propHunt.aimFov<CONTROL_PRESETS.propHunt.fov);
  assert.ok(CONTROL_PRESETS.birthday.sprintFov>CONTROL_PRESETS.birthday.fov);
});


test('motion telemetry drives gait by travel speed and records acceleration, turns and landings',()=>{
  const actor={grounded:true,vy:0,id:'john'};
  const a=updateMotionTelemetry(actor,1/60,{speed:1,turnRate:.5,grounded:true});
  const phase=a.stridePhase;
  const b=updateMotionTelemetry(actor,1/60,{speed:4,turnRate:1.2,grounded:true});
  assert.ok(b.stridePhase>phase);assert.ok(b.accel>0);assert.ok(b.turn>0);
  for(let i=0;i<4;i++)updateMotionTelemetry(actor,.04,{speed:0,grounded:false,verticalSpeed:-4});
  const landed=updateMotionTelemetry(actor,.016,{speed:0,grounded:true,verticalSpeed:0});
  assert.ok(landed.landing>0);
});

test('living-world art kit exposes reusable landmarks, environmental motion and place-detail builders',()=>{
  for(const token of ['buildFountain','buildBeachUmbrella','buildMarketStall','buildNoticeBoard','buildMailbox','buildPartyArch','buildAmbientBirds','ambientParticles','ambientSpin','ambientBob','ambientWing'])assert.ok(art.includes(token),token);
  assert.ok(island.includes('buildFountain'));assert.ok(island.includes('buildBeachUmbrella'));assert.ok(island.includes('buildMailbox'));
  assert.ok(prop.includes('buildNoticeBoard'));assert.ok(prop.includes('buildAmbientBirds'));
  assert.ok(birthday.includes('buildPartyArch'));assert.ok(birthday.includes('addSupportStructure'));
});

test('v1.7 animation pass includes acceleration lean, turn lean, airborne arm poses and dog idle sniffing',()=>{
  for(const token of ['accelLean','turnLean',"anim==='jump'", "anim==='fall'", "anim==='land'",'const sniff='])assert.ok(gameplay.includes(token),token);
  for(const src of [prop,island,birthday])assert.ok(src.includes('turnRate'));
  assert.ok(birthday.includes('cameraBob'));
});


test('attention system gives characters a clamped local head target instead of billboard-style staring',()=>{
  const actor={x:0,y:0,z:0,yaw:0};
  const front=updateAttention(actor,.2,{x:0,y:1.5,z:-2});assert.ok(Math.abs(front.yaw)<.02);assert.ok(front.weight>.5);
  const right=updateAttention(actor,.4,{x:3,y:1.6,z:0},{maxYaw:.6,rate:20});assert.ok(right.yaw>0&&right.yaw<=.61);const rightYaw=Math.abs(right.yaw);
  const none=updateAttention(actor,.4,null,{rate:20});assert.ok(Math.abs(none.yaw)<rightYaw);
});

test('distance-driven gait exposes discrete footstep and landing contact events',()=>{
  const actor={grounded:true,_motion:{stridePhase:Math.PI*1.2,speed:2.4,landing:0}};
  let events=consumeMotionEvents(actor);assert.equal(events[0]?.type,'step');
  assert.equal(consumeMotionEvents(actor).length,0);
  actor._motion.landing=.6;events=consumeMotionEvents(actor);assert.ok(events.some(e=>e.type==='land'));
  assert.equal(consumeMotionEvents(actor).filter(e=>e.type==='land').length,0);
});

test('world interactions map to readable semantic body actions',()=>{
  assert.equal(interactionAnimation('forage'),'harvest');assert.equal(interactionAnimation('fishing'),'fish');assert.equal(interactionAnimation('store'),'inspect');assert.equal(interactionAnimation('bed'),'sit');assert.equal(interactionAnimation('workplace'),'work');assert.equal(interactionAnimation('meal'),'eat');assert.equal(interactionAnimation('coffee'),'drink');
  for(const token of ["anim==='harvest'","anim==='fish'","anim==='inspect'",'turnInPlace','attentionYaw'])assert.ok(gameplay.includes(token),token);
});

test('context actions turn an idle body toward the object being used and add eat/drink semantics',()=>{
  const a={x:0,z:0,yaw:0,vx:0,vz:0};playContextAnimation(a,'inspect',{x:2,z:0},900,1000);updateContextFacing(a,.25,{rate:20,now:1100});assert.ok(a.yaw>0.5);
  a.vx=2;const before=a.yaw;updateContextFacing(a,.25,{rate:20,now:1150});assert.equal(a.yaw,before);
  for(const token of ["anim==='eat'","anim==='drink'","anim==='sit'",'idleFidget'])assert.ok(gameplay.includes(token),token);
  assert.ok(island.includes('playContextAnimation'));assert.ok(island.includes("liquid?'drink':'eat'"));
});

test('v1.8 realism layer is shared: renderer, shadows, contact FX, attention, doors and practical lights',()=>{
  for(const token of ['configureRendererForRealism','configureShadowCastingLight','updateAttention','consumeMotionEvents','playContextAnimation','updateContextFacing'])assert.ok(gameplay.includes(token),token);
  for(const token of ['createMotionFxSystem','buildSwingDoor','proximityDoor','buildCloudLayer','buildButterflies','ambientLamp'])assert.ok(art.includes(token),token);
  for(const src of [prop,island,birthday]){assert.ok(src.includes('configureRendererForRealism'));assert.ok(src.includes('configureShadowCastingLight'));assert.ok(src.includes('createMotionFxSystem'));assert.ok(src.includes('updateAttention'));assert.ok(src.includes('consumeMotionEvents'))}
  assert.ok(prop.includes('buildSwingDoor'));assert.ok(island.includes('buildSwingDoor'));assert.ok(gameplay.includes('effectiveShoulderSign'));assert.ok(gameplay.includes('autoShoulder'));
  assert.ok(birthday.includes('buildLampPost(deco,-4.2,24.5,2.45'));
  assert.ok(prop.includes('spawnPoof'));
  assert.ok(gameplay.includes("basePos(p.weaponAnchor,'z',-.28)+recoil*.04"));
});
