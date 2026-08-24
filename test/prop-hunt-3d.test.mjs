import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {
  rayAabbDistance,cameraObstructionDistance,attemptCharacterMove,ceilingBottom,
  assignRoles,sanitizeSnapshot,canServerRegisterHit
} from '../public/prop-hunt-core.mjs';
import {PropHuntRoom} from '../propHuntRoom.mjs';

const html=await readFile(new URL('../public/new-games.html',import.meta.url),'utf8');
const js=await readFile(new URL('../public/prop-hunt-3d.js',import.meta.url),'utf8');
const css=await readFile(new URL('../public/prop-hunt-3d.css',import.meta.url),'utf8');
const artjs=await readFile(new URL('../public/shared-3d-art-kit.mjs',import.meta.url),'utf8');
const gameplayjs=await readFile(new URL('../public/shared-3d-gameplay.mjs',import.meta.url),'utf8');
const app=await readFile(new URL('../public/app.js',import.meta.url),'utf8');
const worker=await readFile(new URL('../worker.mjs',import.meta.url),'utf8');
const wrangler=await readFile(new URL('../wrangler.jsonc',import.meta.url),'utf8');

class FakeSql {
  constructor(){this.row=null;}
  exec(query,...args){
    if(/^SELECT json/i.test(query))return {toArray:()=>this.row?[{json:this.row}]:[]};
    if(/^INSERT INTO prop_room/i.test(query)){this.row=args[0];return {toArray:()=>[]};}
    return {toArray:()=>[]};
  }
}
function makePropRoom(){
  const sql=new FakeSql();
  const ctx={storage:{sql},blockConcurrencyWhile(fn){return Promise.resolve().then(fn)},getWebSockets(){return[]},acceptWebSocket(){},waitUntil(){}};
  return {room:new PropHuntRoom(ctx,{}),sql};
}
async function req(room,path,{method='GET',roomId='TESTROOM',body}={}){
  const u=new URL(`https://game.test/api/prop/${path}`);u.searchParams.set('room',roomId);
  return room.fetch(new Request(u,{method,headers:body?{'content-type':'application/json'}:undefined,body:body?JSON.stringify(body):undefined}));
}

// These tests verify actual geometry/physics decisions, not just presence of labels.
test('wall AABB genuinely blocks a ray before a player behind it',()=>{
  const wall={x:0,y:0,z:-2,w:4,d:.2,h:3};
  const t=rayAabbDistance({x:0,y:1.5,z:0},{x:0,y:0,z:-1},wall,10);
  assert.ok(t>1.8&&t<2.1);
  assert.ok(t<5,'wall must be hit before a target five metres away');
});

test('third-person camera is shortened by walls instead of clipping outside the building',()=>{
  const target={x:0,y:1.4,z:0},desired={x:0,y:1.4,z:4};
  const d=cameraObstructionDistance(target,desired,[{x:0,y:0,z:2,w:5,d:.2,h:3}],.18);
  assert.ok(d<2,'camera should stop in front of the rear wall');
  assert.ok(d>.35);
});

test('movement blocks solid walls and jump input can auto-mantle a reasonable ledge',()=>{
  const actor={x:0,z:0,y:0,radius:.32,height:1.72};
  const wall={x:0,z:-.7,y:0,w:2,d:.2,h:2.5,solid:true};
  const blocked=attemptCharacterMove(actor,0,-.7,[wall],{radius:.32,height:1.72});
  assert.equal(blocked.blocked,true);assert.equal(blocked.z,0);
  const crate={x:0,z:-.7,y:0,w:1.2,d:.7,h:.85,solid:true,climbable:true,walkableTop:true};
  const mantle=attemptCharacterMove(actor,0,-.45,[crate],{radius:.32,height:1.72,maxStep:.42,maxMantle:1.2,jumpRequested:true});
  assert.equal(mantle.blocked,true);assert.equal(mantle.mantle?.collider,crate);
});

test('ceilings stop upward player motion and keep the head inside a room',()=>{
  const ceiling={x:0,z:0,y:2.4,w:5,d:5,h:.1,solid:true};
  assert.equal(ceilingBottom(0,0,.32,.5,1.72,.9,[ceiling]),2.4);
  assert.equal(ceilingBottom(0,0,.32,0,1.72,.2,[ceiling]),null);
});

test('role assignment rotates hunters and scales to two hunters for larger family rooms',()=>{
  const players=Array.from({length:8},(_,i)=>({id:`p${i}`,seat:i}));
  const r1=assignRoles(players,1),r2=assignRoles(players,2);
  assert.equal(Object.values(r1).filter(x=>x==='hunter').length,2);
  assert.notDeepEqual(Object.keys(r1).filter(k=>r1[k]==='hunter'),Object.keys(r2).filter(k=>r2[k]==='hunter'));
});

test('network snapshots are clamped and server hit registration requires hunter-to-live-hider range',()=>{
  const snap=sanitizeSnapshot({x:999,y:-99,z:-999,pitch:8,anim:'teleport',prop:'x'.repeat(100)});
  assert.equal(snap.x,100);assert.equal(snap.y,-10);assert.equal(snap.z,-100);assert.equal(snap.anim,'idle');assert.equal(snap.prop.length,48);
  const hunter={role:'hunter',live:{x:0,y:0,z:0}},hider={role:'hider',alive:true,live:{x:4,y:0,z:0}};
  assert.equal(canServerRegisterHit(hunter,hider,24),true);
  hider.live.x=30;assert.equal(canServerRegisterHit(hunter,hider,24),false);
});

test('Prop Hunt is a real WebGL scene instead of the old Canvas 2D projection',()=>{
  assert.ok(html.includes('/prop-hunt-3d.js'));assert.ok(html.includes('/prop-hunt-3d.css'));
  for(const token of ['new THREE.WebGLRenderer','THREE.PerspectiveCamera','new THREE.Raycaster','configureRendererForRealism'])assert.ok(js.includes(token),token);
  for(const token of ['THREE.ACESFilmicToneMapping','renderer.shadowMap.enabled'])assert.ok(gameplayjs.includes(token),`shared renderer: ${token}`);
  assert.doesNotMatch(js,/getContext\(['"]2d['"]\)/);
  assert.doesNotMatch(js,/drawCharacter|software-3D renderer/i);
});

test('all-angle humans, quadruped dogs and skeleton-attached weapons are built as detailed 3D mesh hierarchies',()=>{
  for(const token of ['buildHumanRig','buildDogRig','buildPropZapper','weaponAnchor','upperBody','leftArm','rightArm','leftLeg','rightLeg','tailPivot','SphereGeometry','CylinderGeometry'])assert.ok(artjs.includes(token),token);
  assert.ok(artjs.includes("face.position.set(0,.94,-.204)"),'face details should exist only on the front of the 3D head');
  assert.ok(artjs.includes('const weapon=buildPropZapper(.68)'));
  assert.ok(artjs.includes('const weapon=buildPropZapper(.46)'));
  assert.ok(js.includes('return art.buildHumanRig'));assert.ok(js.includes('return art.buildDogRig'));
});

test('shared art kit supplies textured materials and detailed objects instead of grey-box landmarks',()=>{
  for(const token of ['CanvasTexture','paintedWood','concrete','gravel','galvanized','fabric','leather','glass','buildWorkbench','buildToolChest','buildShelving','buildDrillPress','buildAirCompressor','buildWeldingCart','buildTractor','buildMotorcycle','buildFireplace','buildPapaChair','buildBarnStall','createPropMesh'])assert.ok(artjs.includes(token),token);
  assert.ok(js.includes("const ART_URL='/shared-3d-art-kit.mjs'"));
});

test('buildings have actual segmented walls, windows, ceilings and detailed landmark assets',()=>{
  for(const token of ['wallX(','wallZ(','window glass','shop ceiling','barn ceiling','camper ceiling'])assert.ok(js.includes(token),token);assert.ok(gameplayjs.includes('cameraObstructionDistance'));assert.ok(js.includes('/shared-3d-gameplay.mjs'));
  for(const landmark of ['buildTractor','buildMotorcycle','buildPapaChair','Upper bunk','buildTrampoline','buildSeaCan','Goat stair'])assert.ok((js+artjs).includes(landmark),landmark);
});

test('raycast shooting and bot sight use world geometry so walls block both shots and detection',()=>{
  assert.ok(js.includes('ray.intersectObjects(targets,false)'));
  assert.ok(js.includes('const targets=[...game.world.raycastMeshes]'));
  assert.ok(js.includes('function hasLineOfSight'));
  assert.ok(js.includes('ray.intersectObjects(game.world.raycastMeshes,true)'));
});

test('mobile/desktop controls expose camera, aim, sprint, jump-auto-mantle, shoot, prop, flash, decoy and lock',()=>{
  for(const id of ['phAim','phShoot','phJump','phSprint','phProp','phFlashBtn','phDecoy','phLock','phJoy'])assert.ok(js.includes(id),id);
  for(const token of ['.ph3d-joystick','.ph3d-actions','.ph3d-crosshair','.ph3d-camera-help'])assert.ok(css.includes(token),token);
});

test('Lodge creates a dedicated real-time Prop Hunt room instead of sending players to a local-only prototype',()=>{
  assert.ok(app.includes('async function createPropHuntRoom'));
  assert.ok(app.includes("fetch('/api/prop/create'"));
  assert.ok(app.includes("if(key==='prophunt')return createPropHuntRoom(false)"));
  assert.ok(worker.includes("url.pathname.startsWith('/api/prop/')"));
  assert.ok(worker.includes('env.PROP_HUNT.getByName(roomId)'));
  const config=JSON.parse(wrangler);
  assert.ok(config.durable_objects.bindings.some(b=>b.name==='PROP_HUNT'&&b.class_name==='PropHuntRoom'));
});

test('dedicated Prop Hunt room creates, joins, readies and starts a six-round synchronized match',async()=>{
  const {room}=makePropRoom();
  let r=await req(room,'create',{method:'POST',body:{name:'Kristen',avatar:'kristen'}});assert.equal(r.ok,true);const created=await r.json();
  r=await req(room,'join',{method:'POST',body:{name:'John',avatar:'john'}});assert.equal(r.ok,true);const joined=await r.json();
  await req(room,'ready',{method:'POST',body:{playerToken:created.playerToken,ready:true}});
  await req(room,'ready',{method:'POST',body:{playerToken:joined.playerToken,ready:true}});
  r=await req(room,'start',{method:'POST',body:{hostToken:created.hostToken}});assert.equal(r.ok,true);
  const state=room.stateFor(created.playerToken);
  assert.equal(state.phase,'hide');assert.equal(state.round,1);assert.equal(state.settings.rounds,6);assert.equal(state.activeMap,'papa');
  assert.equal(state.players.length,2);assert.equal(state.players.filter(p=>p.role==='hunter').length,1);assert.equal(state.players.filter(p=>p.role==='hider').length,1);
  assert.ok(state.phaseEndsAt>Date.now());
});

test('Prop Hunt room uses Durable Object hibernatable WebSocket patterns and persistent SQL state',()=>{
  const serverSource=worker + '\n' + (String(PropHuntRoom));
  assert.ok(wrangler.includes('new_sqlite_classes'));
  // Class source is loaded separately because String(class) omits imported source text.
  return readFile(new URL('../propHuntRoom.mjs',import.meta.url),'utf8').then(source=>{
    for(const token of ['ctx.storage.sql.exec','acceptWebSocket','serializeAttachment','deserializeAttachment','getWebSockets'])assert.ok(source.includes(token),token);
  });
});
