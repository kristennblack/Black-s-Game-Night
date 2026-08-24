import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,stat} from 'node:fs/promises';
import {bindAuthoredRigParts} from '../public/shared-3d-studio.mjs';

const manifest=JSON.parse(await readFile(new URL('../public/models/manifest.json',import.meta.url),'utf8'));
const studio=await readFile(new URL('../public/shared-3d-studio.mjs',import.meta.url),'utf8');
const gameplay=await readFile(new URL('../public/shared-3d-gameplay.mjs',import.meta.url),'utf8');
const prop=await readFile(new URL('../public/prop-hunt-3d.js',import.meta.url),'utf8');

async function assertGlb(rel,minBytes){
  const url=new URL('../public/'+rel,import.meta.url),buf=await readFile(url),info=await stat(url);
  assert.equal(buf.subarray(0,4).toString('ascii'),'glTF',rel+' GLB header');
  assert.ok(info.size>minBytes,`${rel} should be a substantive authored binary asset`);
}

test('Papa production slice ships real GLB binaries for benchmark characters and hero props',async()=>{
  await assertGlb('models/characters/john.glb',350_000);
  await assertGlb('models/dogs/gunner.glb',220_000);
  await assertGlb('models/props/prop-zapper.glb',15_000);
  await assertGlb('models/props/tractor.glb',45_000);
  await assertGlb('models/props/motorcycle.glb',60_000);
  await assertGlb('models/furniture/papa-chair.glb',25_000);
  await assertGlb('models/furniture/fireplace.glb',20_000);
  await assertGlb('models/furniture/workbench.glb',12_000);
  await assertGlb('models/furniture/tool-chest.glb',12_000);
  await assertGlb('models/furniture/shelving.glb',8_000);
});

test('production manifest calibrates John and Gunner to gameplay-scale authored models',()=>{
  assert.equal(manifest.version,2);
  assert.ok(manifest.characters.john.production);assert.ok(Math.abs(manifest.characters.john.referenceHeight-1.82)<.001);
  assert.ok(manifest.dogs.gunner.production);assert.ok(Math.abs(manifest.dogs.gunner.referenceHeight-1.08)<.001);
  assert.equal(manifest.props.tractor.production,true);assert.equal(manifest.props.motorcycle.production,true);
  assert.equal(manifest.furniture.papaChair.production,true);assert.equal(manifest.furniture.fireplace.production,true);
  assert.equal(manifest.furniture.workbench.production,true);assert.equal(manifest.furniture.toolChest.production,true);assert.equal(manifest.furniture.shelving.production,true);
});

test('authored named rigs can use procedural animation until bespoke clips arrive',()=>{
  for(const token of ['bindAuthoredRigParts','rightHandSocket','backSocket','chestPivot','hasAuthoredAnimationClips'])assert.ok(studio.includes(token),token);
  assert.ok(gameplay.includes('basePos(p.hips'));assert.ok(gameplay.includes('basePos(p.body'));
  assert.ok(prop.includes("studio.bindAuthoredRigParts(rig,{kind:dog?'dog':'human'})"));
  assert.ok(prop.includes('a.authored&&a.hasAuthoredClips&&a.animMixer'));
});

test('Papa high-attention hero kit is asynchronously replaced by authored visuals while colliders remain',()=>{
  assert.ok(prop.includes('upgradePapaHeroAssets(w)'));
  for(const token of ['heroFallbacks.tractor','heroFallbacks.motorcycle','heroFallbacks.fireplace','heroFallbacks.workbench','heroFallbacks.toolChest','heroFallbacks.shelving'])assert.ok(prop.includes(token),token);
  for(const token of ["assets.loadProp('tractor'","assets.loadProp('motorcycle'","assets.loadFurniture('papaChair'","assets.loadFurniture('fireplace'","assets.loadFurniture('workbench'","assets.loadFurniture('toolChest'","assets.loadFurniture('shelving'"])assert.ok(prop.includes(token),token);
  assert.ok(prop.includes('o.userData.productionHero=true'));
});


test('John and Gunner production GLBs carry curved approved-reference face texture nodes',async()=>{
  const john=await readFile(new URL('../public/models/characters/john.glb',import.meta.url));
  const gunner=await readFile(new URL('../public/models/dogs/gunner.glb',import.meta.url));
  // GLB JSON chunks keep node/material names readable, so this verifies the release
  // actually contains the textured-face production assets rather than an old cache.
  assert.ok(john.includes(Buffer.from('approvedFacePatch')));
  assert.ok(john.includes(Buffer.from('John_FacePhoto')));
  assert.ok(gunner.includes(Buffer.from('approvedFacePatch')));
  assert.ok(gunner.includes(Buffer.from('Gunner_FacePhoto')));
});
