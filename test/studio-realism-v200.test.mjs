import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {
  STUDIO_3D_VERSION,SnapshotBuffer,createNavigationGrid,weatherForTime,tropicalHeightAt,
  findSemanticClip,studioFeatureManifest,chooseNpcRoutine
} from '../public/shared-3d-studio.mjs';

const studio=await readFile(new URL('../public/shared-3d-studio.mjs',import.meta.url),'utf8');
const island=await readFile(new URL('../public/island-life.js',import.meta.url),'utf8');
const islandRoom=await readFile(new URL('../islandLifeRoom.mjs',import.meta.url),'utf8');
const prop=await readFile(new URL('../public/prop-hunt-3d.js',import.meta.url),'utf8');
const birthday=await readFile(new URL('../public/birthday-climb.js',import.meta.url),'utf8');
const gameplay=await readFile(new URL('../public/shared-3d-gameplay.mjs',import.meta.url),'utf8');
const manifest=JSON.parse(await readFile(new URL('../public/models/manifest.json',import.meta.url),'utf8'));

function clip(name){return{name}}

test('v2.1 Studio Realism module exposes the cross-game realism foundation',()=>{
  assert.equal(STUDIO_3D_VERSION,'2.1.0');
  const f=studioFeatureManifest();
  for(const key of ['authoredAssets','skeletonSafeCloning','authoredRigSockets','semanticAnimationMixer','proceduralIK','networkSnapshotBuffer','navGrid','npcRoutines','weather','shaderWater','shorelineFoam','heightfieldTerrain','selectivePhysics','webAudio','surfaceAudio','cinematics'])assert.equal(f[key],true,key);
  for(const src of [prop,island,birthday])assert.ok(src.includes('/shared-3d-studio.mjs'));
});

test('authored-model manifest is fallback-safe and may opt high-attention assets into production GLBs',()=>{
  assert.ok(manifest.version>=1);
  assert.equal(manifest.characters?.john?.file,'/models/characters/john-production-skinned.glb');
  assert.equal(manifest.dogs?.gunner?.file,'/models/dogs/gunner.glb');
  assert.equal(manifest.props?.propZapper?.file,'/models/props/prop-zapper.glb');
  for(const token of ['createAuthoredAssetPipeline','cloneAuthored','SkeletonUtils.js','loadCharacter','loadDog','attachToRigSocket','SemanticAnimationMixer','bindAuthoredRigParts'])assert.ok(studio.includes(token),token);
});

test('semantic authored animation lookup maps gameplay words to likely clip names',()=>{
  const clips=[clip('Idle_Breathing'),clip('Walk_Forward'),clip('Aim_Rifle'),clip('Drink_Coffee')];
  assert.equal(findSemanticClip(clips,'idle')?.name,'Idle_Breathing');
  assert.equal(findSemanticClip(clips,'walk')?.name,'Walk_Forward');
  assert.equal(findSemanticClip(clips,'aim')?.name,'Aim_Rifle');
  assert.equal(findSemanticClip(clips,'drink')?.name,'Drink_Coffee');
});

test('network snapshot buffering uses local receive time and interpolates/extrapolates safely',()=>{
  const b=new SnapshotBuffer({delayMs:50,maxExtrapolateMs:100});
  b.push({x:0,y:0,z:0,vx:2,at:1700000000000},1000);
  b.push({x:1,y:0,z:0,vx:2,at:1700000000500},1100);
  const mid=b.sample(1100);assert.ok(mid.x>0&&mid.x<1);
  const future=b.sample(1250);assert.ok(future.x>=1&&future.x<=1.21);assert.equal(future._sourceAt,1700000000500);
});

test('island nav grid routes around blockers rather than walking bots through buildings',()=>{
  const nav=createNavigationGrid({minX:-4,maxX:4,minZ:-4,maxZ:4,cellSize:1,isBlocked:(x,z)=>Math.abs(x)<.4&&Math.abs(z)<2.2});
  const path=nav.findPath({x:-3,z:0},{x:3,z:0});assert.ok(path.length>3);assert.ok(path.some(p=>Math.abs(p.z)>=2));
});

test('weather and NPC routines are deterministic enough for a persistent private island',()=>{
  assert.deepEqual(weatherForTime(42,600000),weatherForTime(42,600000));
  assert.equal(chooseNpcRoutine(99,1234567,{hour:14}),chooseNpcRoutine(99,1234567,{hour:14}));
});

test('tropical terrain keeps village/home pads restrained instead of poking through buildings',()=>{
  assert.ok(Math.abs(tropicalHeightAt(0,0))<.03);
  assert.ok(Math.abs(tropicalHeightAt(39,0))<.08);
  assert.ok(Math.abs(tropicalHeightAt(22,22))<=.19);
});

test('Island Life furniture actions are server-authorized and include stateful lamps',()=>{
  for(const token of ["action==='useFurniture'",'piece.on=piece.on===false?true:false','activityReadyAt','const allowed='])assert.ok(islandRoom.includes(token),token);
  assert.ok(island.includes("kind:'furniture'"));assert.ok(island.includes('lampLight.visible=piece.on!==false'));
});

test('v2 worlds include surface-aware sound, shoreline foam, selective physics and cinematic recovery',()=>{
  for(const token of ["surface='default'",'uShoreRadius','uFoamWidth','createSelectivePhysics','createCinematicCamera'])assert.ok(studio.includes(token),token);
  assert.ok(island.includes('shoreRadius:56.2'));assert.ok(island.includes('islandSurfaceAt'));
  assert.ok(prop.includes('propSurfaceAt'));assert.ok(birthday.includes('birthdaySurfaceFor'));
});

test('semantic procedural actions are visibly distinct rather than generic arm movement',()=>{
  for(const token of ["anim==='cook'","anim==='carry'","['chop','mine','dig'].includes(anim)","anim==='water'","anim==='cast'","anim==='reel'","anim==='sleep'","anim==='dance'"])assert.ok(gameplay.includes(token),token);
  for(const token of ["anim==='pant'","anim==='shake'","anim==='lie'"])assert.ok(gameplay.includes(token),token);
});
