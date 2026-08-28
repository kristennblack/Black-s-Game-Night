import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,stat} from 'node:fs/promises';

const manifest=JSON.parse(await readFile(new URL('../public/models/manifest.json',import.meta.url),'utf8'));
const prop=await readFile(new URL('../public/prop-hunt-3d.js',import.meta.url),'utf8');
const studio=await readFile(new URL('../public/shared-3d-studio.mjs',import.meta.url),'utf8');
const gameplay=await readFile(new URL('../public/shared-3d-gameplay.mjs',import.meta.url),'utf8');

async function glbJson(rel){
  const buf=await readFile(new URL('../public/'+rel,import.meta.url));
  assert.equal(buf.subarray(0,4).toString('ascii'),'glTF',rel);
  const jsonLen=buf.readUInt32LE(12),chunkType=buf.readUInt32LE(16);
  assert.equal(chunkType,0x4E4F534A,'GLB first chunk must be JSON');
  return JSON.parse(buf.subarray(20,20+jsonLen).toString('utf8').replace(/\u0000/g,'').trim());
}

test('Phase G John is a genuinely skinned GLB with an embedded semantic animation library',async()=>{
  const j=await glbJson('models/characters/john-production-skinned.glb');
  assert.ok((j.skins||[]).length>=1,'John must contain a glTF skin');
  assert.ok((j.animations||[]).length>=12,'John must contain authored animation clips');
  const names=new Set((j.animations||[]).map(a=>a.name));
  for(const n of ['Idle','Walk','Run','Turn_Left','Turn_Right','Jump','Fall','Land','Aim','Fire','Wave','Celebrate'])assert.ok(names.has(n),n);
  const nodes=new Set((j.nodes||[]).map(n=>n.name));
  for(const n of ['hips','head','leftShoulder','rightShoulder','leftKnee','rightKnee','leftFoot','rightFoot','rightHandSocket'])assert.ok(nodes.has(n),n);
});

test('Phase G production manifest points John and Papa Shop at dedicated production-slice GLBs',async()=>{
  assert.equal(manifest.version,4);
  assert.equal(manifest.characters.john.file,'/models/characters/john-production-skinned.glb');
  assert.equal(manifest.characters.john.rig,'skinned-humanoid');
  assert.equal(manifest.environments.papaShop.file,'/models/environments/papa-shop-barn-production.glb');
  assert.equal(manifest.sets.papaShopProps.file,'/models/sets/papa-shop-production-props.glb');
  for(const rel of ['models/environments/papa-shop-barn-production.glb','models/sets/papa-shop-production-props.glb']){
    const st=await stat(new URL('../public/'+rel,import.meta.url));assert.ok(st.size>120_000,rel);
  }
});

test('Papa production slice swaps visible blockout for authored environment/set while preserving gameplay colliders',()=>{
  for(const token of ["upgradePapaProductionSlice(w)","assets.loadEnvironment('papaShop'","assets.loadSet('papaShopProps'",'w.productionEnvironment=environment','w.productionPropSet=propSet'])assert.ok(prop.includes(token),token);
  assert.ok(prop.includes('const prototypeNames='));
  assert.ok(prop.includes('prototypeNames.test'));
  assert.ok(prop.includes('visible=false'));
  assert.ok(prop.includes('this.colliders.push(c)'),'existing collider/blockout creation remains the gameplay contract');
});

test('production asset pipeline supports environment/set loading and authored clothing recolor hooks',()=>{
  for(const token of ['loadEnvironment','loadSet','applyPrimaryClothingColor'])assert.ok(studio.includes(token),token);
  assert.ok(prop.includes('studio.applyPrimaryClothingColor(rig,actor.color)'));
});

test('mobile third-person input adds real two-finger camera pinch while preserving right-half touch look',()=>{
  for(const token of ['const points=new Map()','pinchDistance','cameraRig.zoom',"e.pointerType!=='mouse'",'e.clientX<r.left+r.width*.42'])assert.ok(gameplay.includes(token),token);
});

test('normal Prop Hunt no longer leaves a permanent camera-instruction paragraph over play',()=>{
  assert.ok(prop.includes("get('qa3d')==='1'"));
  assert.ok(!prop.includes('Drag to look · Wheel / +/- to zoom'));
  assert.ok(prop.includes("playTransientAnimation(a,'fire',240)"),'authored fire clip should be requested for shooting');
});
