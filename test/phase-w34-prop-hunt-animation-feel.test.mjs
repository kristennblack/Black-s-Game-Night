import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {animateFamilyRig,GAMEPLAY_3D_VERSION,GAMEPLAY_ANIMATION_REVISION} from '../public/shared-3d-gameplay.mjs';

function node({x=0,y=0,z=0}={}){
  return {rotation:{x:0,y:0,z:0},position:{x,y,z},scale:{x:1,y:1,z:1},userData:{},visible:true};
}
function humanActor(anim='idle'){
  const leftLeg={hip:node(),knee:node(),foot:node()};
  const rightLeg={hip:node(),knee:node(),foot:node()};
  const leftArm={shoulder:node(),elbow:node(),hand:{visible:true},thumb:{visible:true}};
  const rightArm={shoulder:node(),elbow:node(),hand:{visible:true},thumb:{visible:true}};
  const weapon=node();weapon.userData.gripHands={left:{visible:false},right:{visible:false}};
  const parts={torso:node(),hips:node({y:.82}),upperBody:node({y:.92}),head:node(),eyes:[node(),node()],leftLeg,rightLeg,leftArm,rightArm,weapon,weaponAnchor:node({x:.16,y:.36,z:.34})};
  return {id:'john',anim,animTime:0,vx:0,vy:0,vz:0,yaw:0,grounded:true,rig:{userData:{parts}}};
}
function motion(overrides={}){return {speed:0,prevSpeed:0,accel:0,turn:0,stridePhase:Math.PI/2,idleTime:0,airTime:0,landing:0,vertical:0,...overrides};}

const common={dt:1/30,grounded:true,turnRate:0,lookPitch:0,recoil:0};

test('W34 animation revision is active without breaking the shared v2 API contract',()=>{
  assert.equal(GAMEPLAY_3D_VERSION,'2.0.0');
  assert.equal(GAMEPLAY_ANIMATION_REVISION,'W34.1');
});

test('jog and sprint are real moving procedural gaits',()=>{
  const jog=humanActor('jog');
  animateFamilyRig(jog,common.dt,{...common,speed:3.2,motion:motion({speed:3.2}),directional:{semantic:'jog',local:{x:0,z:1}}});
  assert.ok(Math.abs(jog.rig.userData.parts.leftLeg.hip.rotation.x)>.05,'jog must articulate the hip');

  const sprint=humanActor('sprint');
  animateFamilyRig(sprint,common.dt,{...common,speed:5.6,motion:motion({speed:5.6}),directional:{semantic:'sprint',local:{x:0,z:1}}});
  assert.ok(Math.abs(sprint.rig.userData.parts.leftLeg.hip.rotation.x)>.10,'sprint must produce a strong stride');
  assert.ok(sprint.rig.userData.parts.upperBody.rotation.x>.015,'sprint must carry a forward body lean');
});

test('aiming preserves directional lower-body strafe while hands stay on weapon',()=>{
  const a=humanActor('run');
  animateFamilyRig(a,common.dt,{...common,aim:true,speed:2.8,motion:motion({speed:2.8}),directional:{semantic:'strafeRight',local:{x:1,z:.05}}});
  const p=a.rig.userData.parts;
  assert.ok(Math.abs(p.leftLeg.hip.rotation.z)>.001,'strafe must influence lower-body lateral pose');
  assert.equal(p.weapon.userData.gripHands.left.visible,true);
  assert.equal(p.weapon.userData.gripHands.right.visible,true);
  assert.equal(p.leftArm.hand.visible,false);
  assert.equal(p.rightArm.hand.visible,false);
});

test('180 turn uses planted counter-rotation',()=>{
  const a=humanActor('turn180Left');
  animateFamilyRig(a,common.dt,{...common,speed:0,motion:motion(),directional:{semantic:'idle',local:{x:0,z:0}}});
  const p=a.rig.userData.parts;
  assert.ok(p.leftLeg.foot.rotation.y<0,'left foot should plant into a left turn');
  assert.ok(p.rightLeg.foot.rotation.y>0,'right foot should counter-plant');
  assert.ok(p.hips.rotation.y<0,'hips should lead the planted turn');
  assert.ok(p.upperBody.rotation.y>0,'upper body should counter-rotate for weight');
});

test('startMove transition is animated even before full gait speed',()=>{
  const a=humanActor('idle');
  animateFamilyRig(a,common.dt,{...common,speed:.7,transition:'startMove',motion:motion({speed:.7,accel:4}),directional:{semantic:'walk',local:{x:0,z:1}}});
  assert.ok(Math.abs(a.rig.userData.parts.leftLeg.hip.rotation.x)>.01);
  assert.ok(a.rig.userData.parts.upperBody.rotation.x>0);
});

test('hardLand has a visibly deeper recovery pose',()=>{
  const a=humanActor('hardLand');
  animateFamilyRig(a,common.dt,{...common,speed:0,motion:motion({landing:1,vertical:-7}),directional:{semantic:'idle',local:{x:0,z:0}}});
  assert.ok(a.rig.userData.parts.hips.position.y<.81,'hard land must lower the hips');
  assert.ok(a.rig.userData.parts.leftLeg.knee.rotation.x>0,'hard land must brace the knees');
});

test('caller-provided motion telemetry is not advanced a second time',()=>{
  const a=humanActor('walk'),m=motion({speed:2,stridePhase:1.2345,landing:.4});
  animateFamilyRig(a,common.dt,{...common,speed:2,motion:m,directional:{semantic:'walk',local:{x:0,z:1}}});
  assert.equal(m.stridePhase,1.2345);
  assert.equal(m.landing,.4);
});

test('Prop Hunt preserves the W34 animation contract inside the current W35 production candidate',()=>{
  const src=fs.readFileSync(new URL('../public/prop-hunt-3d.js',import.meta.url),'utf8');
  assert.match(src,/animateFamilyRig\(a,dt,\{[^}]*attention,motion,directional,transition:moveTransition/);
  assert.match(src,/w34ProceduralGaitCoverage:true/);
  assert.match(src,/w34SingleMotionTelemetry:true/);
  assert.match(src,/GAME-NIGHT-STAGING-CANDIDATE-W40-EXTERNAL-ASSET-PIPELINE-59/);
  assert.match(src,/shared-3d-gameplay\.mjs\?v=W40-EXTERNAL-ASSET-PIPELINE-59/);
  const page=fs.readFileSync(new URL('../public/new-games.html',import.meta.url),'utf8');
  assert.match(page,/prop-hunt-3d\.js\?v=GAME-NIGHT-STAGING-CANDIDATE-W40-EXTERNAL-ASSET-PIPELINE-59/);
  const candidate=fs.readFileSync(new URL('../W34_ANIMATION_CANDIDATE.txt',import.meta.url),'utf8');
  assert.match(candidate,/TECHNICAL CANDIDATE|technical candidate/i);
});
