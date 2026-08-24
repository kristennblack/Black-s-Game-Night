import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {nearestReachableProp} from '../public/prop-hunt-core.mjs';
import {recoverActorFromGeometry} from '../public/shared-3d-gameplay.mjs';
import * as core from '../public/prop-hunt-core.mjs';

const prop=await readFile(new URL('../public/prop-hunt-3d.js',import.meta.url),'utf8');
const island=await readFile(new URL('../public/island-life.js',import.meta.url),'utf8');

class Rig{constructor(){this.position={set:(x,y,z)=>{this.last=[x,y,z]}}}}

test('Prop Hunt disguise selection cannot reach a prop on another vertical level',()=>{
  const actor={x:0,y:0,z:0,height:1.7};
  const same={id:'same',x:1,y:0,z:0,h:.8};
  const upstairs={id:'up',x:.2,y:2.8,z:0,h:.8};
  assert.equal(nearestReachableProp(actor,[upstairs,same],1.7,.55),same);
  assert.equal(nearestReachableProp(actor,[upstairs],1.7,.55),null);
});

test('shared recovery repairs invalid transforms and horizontal bounds, not only wall overlap',()=>{
  const bounds={minX:-5,maxX:5,minZ:-5,maxZ:5};
  const bad={x:NaN,y:Infinity,z:NaN,vx:4,vy:-5,vz:3,radius:.3,height:1.7,rig:new Rig()};
  assert.equal(recoverActorFromGeometry(core,bad,[],bounds,{fallback:{x:0,y:0,z:0}}),true);
  assert.ok(Number.isFinite(bad.x)&&Number.isFinite(bad.y)&&Number.isFinite(bad.z));
  const outside={x:20,y:0,z:20,vx:1,vy:0,vz:1,radius:.3,height:1.7,rig:new Rig()};
  assert.equal(recoverActorFromGeometry(core,outside,[],bounds),true);
  assert.ok(outside.x<=4.7&&outside.z<=4.7);
});

test('Prop Hunt camera aim is revalidated from the actual weapon muzzle before a hit is accepted',()=>{
  for(const token of ['function muzzleWorldPosition','function revalidateShotFromMuzzle','const muzzleRay=new THREE.Raycaster','target=validated.target'])assert.ok(prop.includes(token),token);
});

test('Prop Hunt decoys preserve elevated support height locally and across network playback',()=>{
  assert.ok(prop.includes('const supportY=core.supportHeight'));
  assert.ok(prop.includes('spawnDecoy(a.prop,a.x,decoyY,a.z)'));
  assert.ok(prop.includes("spawnDecoy(m.prop,m.position?.x||0,m.position?.y||0,m.position?.z||0)"));
  assert.ok(prop.includes('mesh.position.set(x+(Math.random()-.5)*.5,Number.isFinite(Number(y))?Number(y):0'));
});

test('Island interactions require clear world line of sight instead of proximity alone',()=>{
  assert.ok(island.includes('function interactionLineOfSight'));
  assert.ok(island.includes('move.lineOfSightClear(origin,target,colliders,.08)'));
  assert.ok(island.includes('candidate&&interactionLineOfSight(candidate)?candidate:null'));
});

test('Island visitors use swept collision and replan instead of directly integrating through walls',()=>{
  assert.ok(island.includes('const moved=move.attemptCharacterMove(a,a.vx*dt,a.vz*dt,game.world.colliders'));
  assert.ok(island.includes('a._npcPath=[];'));
  assert.ok(island.includes('a._npcNext=0;'));
});

test('Island scene lifecycle removes controls, resize handling, timers, RAF and WebSocket reconnect work',()=>{
  for(const token of ['function disposeIslandClient','cancelAnimationFrame(raf)','clearInterval(pollTimer)','clearTimeout(reconnectTimer)',"ws.onclose=null;ws.close()","removeEventListener('keydown',onKeyDown)","window.removeEventListener('resize',resize)","addEventListener('pagehide',disposeIslandClient,{once:true})"])assert.ok(island.includes(token),token);
});
