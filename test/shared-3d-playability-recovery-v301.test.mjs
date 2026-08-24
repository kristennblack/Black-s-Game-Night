import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createThirdPersonCamera,findSafeCharacterPosition,recoverActorFromGeometry,CONTROL_PRESETS} from '../public/shared-3d-gameplay.mjs';
import * as core from '../public/prop-hunt-core.mjs';

class V3{
  constructor(x=0,y=0,z=0){this.x=x;this.y=y;this.z=z}
  set(x,y,z){this.x=x;this.y=y;this.z=z;return this}
  copy(v){return this.set(v.x,v.y,v.z)}
  clone(){return new V3(this.x,this.y,this.z)}
  addScaledVector(v,s){this.x+=v.x*s;this.y+=v.y*s;this.z+=v.z*s;return this}
  sub(v){this.x-=v.x;this.y-=v.y;this.z-=v.z;return this}
  length(){return Math.hypot(this.x,this.y,this.z)}
  multiplyScalar(s){this.x*=s;this.y*=s;this.z*=s;return this}
  distanceTo(v){return Math.hypot(this.x-v.x,this.y-v.y,this.z-v.z)}
  distanceToSquared(v){const x=this.x-v.x,y=this.y-v.y,z=this.z-v.z;return x*x+y*y+z*z}
  lerp(v,a){this.x+=(v.x-this.x)*a;this.y+=(v.y-this.y)*a;this.z+=(v.z-this.z)*a;return this}
}
const THREE={Vector3:V3};
function fakeCamera(){return{position:new V3(),rotation:{z:0},fov:60,lookAt(v){this.look={...v}},updateProjectionMatrix(){}}}

test('third-person camera snaps to a playable solved view on its first frame instead of easing from WebGL origin',()=>{
  const camera=fakeCamera(),rig=createThirdPersonCamera(THREE,camera,core,'birthday',{yaw:Math.PI,pitch:.06});
  const target={x:8,y:.29,z:5,yaw:Math.PI};
  rig.update(target,[],1/60,{height:1.15});
  assert.ok(rig.state.initialized);
  assert.ok(rig.state.actualDistance>3.7,`camera distance ${rig.state.actualDistance}`);
  assert.ok(camera.position.distanceTo(new V3(0,0,0))>5,'camera should not still be travelling from world origin');
});

test('normal third-person framing stays below a low interior ceiling instead of collapsing onto the avatar',()=>{
  const camera=fakeCamera(),rig=createThirdPersonCamera(THREE,camera,core,'propHunt',{yaw:Math.PI,pitch:.06});
  const roof={x:0,z:0,y:2.15,w:12,d:12,h:.18,solid:true};
  rig.update({x:0,y:0,z:0,yaw:Math.PI},[roof],1/60,{height:1.17});
  assert.ok(rig.state.actualDistance>CONTROL_PRESETS.propHunt.minCameraDistance+1.5,`collapsed to ${rig.state.actualDistance}`);
  assert.ok(camera.position.y<2.15,'default camera should not be driven into the ceiling');
});

test('camera obstruction ignores non-solid decorative/floor geometry',()=>{
  const target={x:0,y:1.1,z:0},desired={x:0,y:1.5,z:-4};
  const decorative={x:0,z:-2,y:0,w:4,d:1,h:3,solid:false};
  assert.ok(core.cameraObstructionDistance(target,desired,[decorative],.2)>3.9);
});

test('safe spawn search moves an embedded player into open geometry and recovery zeros bad velocity',()=>{
  const wall={x:0,z:0,y:0,w:1.4,d:1.4,h:3,solid:true};
  const bounds={minX:-5,maxX:5,minZ:-5,maxZ:5};
  const safe=findSafeCharacterPosition(core,[wall],{x:0,y:0,z:0},bounds,{radius:.3,height:1.82});
  assert.ok(Math.hypot(safe.x,safe.z)>.7);
  const actor={x:0,y:0,z:0,vx:3,vy:-4,vz:2,radius:.3,height:1.82,rig:{position:{set(x,y,z){this.last=[x,y,z]}}}};
  assert.equal(recoverActorFromGeometry(core,actor,[wall],bounds,{radius:.3,height:1.82}),true);
  assert.equal(actor.vx,0);assert.equal(actor.vy,0);assert.equal(actor.vz,0);
  assert.equal(core.blockingCollider(actor.x,actor.z,.3,actor.y,actor.height,[wall]),null);
});

test('all three 3D games expose a visible emergency RESET VIEW and keyboard recovery path',async()=>{
  for(const file of ['../public/prop-hunt-3d.js','../public/island-life.js','../public/birthday-climb.js']){
    const src=await readFile(new URL(file,import.meta.url),'utf8');assert.ok(src.includes('RESET VIEW'));assert.ok(src.includes('resetPlayableView'));assert.ok(src.includes("KeyR"));assert.ok(src.includes('QA_MODE')||file.includes('prop-hunt'));assert.ok(src.includes('qa3d')||file.includes('prop-hunt'));
  }
});
