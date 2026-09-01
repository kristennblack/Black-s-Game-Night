import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {passesPromotionGate,leapfrogManifest,W36_BENCHMARK_VIEW} from '../public/w36-leapfrog-visuals.mjs';

const read=p=>fs.readFileSync(new URL(p,import.meta.url),'utf8');

class V3{constructor(){this.x=this.y=this.z=0}set(x,y,z){this.x=x;this.y=y;this.z=z;return this}}
class B3{setFromObject(root){this.root=root;return this}isEmpty(){return false}getSize(v){return v.set(...this.root.mockSize)}}
const THREE={Box3:B3,Vector3:V3};
const fakeAsset=({meshes=20,triangles=1000,materials=4,size=[2,2,2]}={})=>({mockSize:size,updateMatrixWorld(){},traverse(fn){for(let i=0;i<meshes;i++)fn({isMesh:true,isSkinnedMesh:false,geometry:{index:{count:Math.ceil(triangles*3/meshes)}},material:{name:`m${i%materials}`}})}});

test('W36 defaults to the full expanded Papa world instead of the compact sparse benchmark',()=>{
  const src=read('../public/prop-hunt-3d.js');
  assert.match(src,/W36_FULL_PAPA=URL_FLAGS\.get\('compactPapa'\)!=='1'/);
  assert.match(src,/phaseVExpanded=true;w\.phaseW36Leapfrog=true/);
  assert.match(src,/w\.spawn=\{x:14\.2,z:17\.4\}/);
  assert.match(src,/w36LegacyMaterialPass=w36vis\?\.upgradeLegacyMaterials/);
});

test('W36 composes hero mechanic assets inside the shop while preserving yard equipment',()=>{
  const src=read('../public/prop-hunt-3d.js');
  assert.match(src,/heroFallbacks\.tractor=buildTractor\(w,8\.2,14\.9/);
  assert.match(src,/heroFallbacks\.motorcycle=buildMotorcycle\(w,19\.2,15\.2/);
  assert.match(src,/buildTractor\(w,7\.0\+yardShift,27\.2/);
  assert.match(src,/buildMotorcycle\(w,12\.0-yardShift\*\.5,26\.6/);
});

test('W36 visual promotion gate keeps weak replacements from hiding the legacy fallback',()=>{
  const good=passesPromotionGate(fakeAsset(),THREE,{minMeshes:10,minTriangles:500,minMaterials:2,maxDim:8});
  const weak=passesPromotionGate(fakeAsset({meshes:2,triangles:20,materials:1}),THREE,{minMeshes:10,minTriangles:500,minMaterials:2,maxDim:8});
  assert.equal(good.pass,true);
  assert.equal(weak.pass,false);
});

test('W36 hybrid path promotes hero slots individually and preserves fallback on failure',()=>{
  const src=read('../public/prop-hunt-3d.js');
  assert.match(src,/upgradePapaLeapfrogHybrid/);
  assert.match(src,/w36vis\.promoteVisual/);
  assert.match(src,/every rejected slot kept its fuller legacy visual/);
  assert.match(src,/full legacy world remains visible/);
  assert.match(src,/w36NoVisualRegressionRatchet:true/);
});

test('W36 defines a repeatable gold-view benchmark and uses the skinned John QA proxy only in QA benchmark mode',()=>{
  const src=read('../public/prop-hunt-3d.js');
  assert.ok(Number.isFinite(W36_BENCHMARK_VIEW.player.x));
  assert.ok(W36_BENCHMARK_VIEW.camera.distance>3);
  assert.match(src,/applyW36BenchmarkStart/);
  assert.match(src,/w36Benchmark/);
  assert.match(src,/W35_DEV_JOHN_PROXY=QA_MODE&&\(URL_FLAGS\.get\('w35ProxyJohn'\)==='1'\|\|URL_FLAGS\.get\('w36Benchmark'\)==='1'\)/);
  assert.match(src,/JOHN LIKENESS NOT YET APPROVED/);
});

test('W36 manifest locks the leapfrog production rules',()=>{
  const m=leapfrogManifest();
  assert.equal(m.fullWorldDefault,true);
  assert.equal(m.noVisualRegressionRatchet,true);
  assert.equal(m.legacyFallbackPreserved,true);
  assert.equal(m.heroPromotionGate,true);
  assert.equal(m.legacyPbrUpgrade,true);
  assert.equal(m.fixedBenchmarkView,true);
});

test('W36 cache-busts Prop Hunt and service-worker caches the new visual module',()=>{
  const page=read('../public/new-games.html'),sw=read('../public/sw.js');
  assert.match(page,/prop-hunt-3d\.js\?v=GAME-NIGHT-STAGING-CANDIDATE-W40-EXTERNAL-ASSET-PIPELINE-59/);
  assert.match(sw,/w36-leapfrog-visuals\.mjs/);
});

test('W36 packages permanent visual-regression references and requires actual running proof',()=>{
  const baseline=JSON.parse(read('../W36_VISUAL_REGRESSION_BASELINE.json'));
  assert.equal(baseline.rules.newBuildMayNotBeVisuallyEmptierThanOlderFullerActual,true);
  assert.equal(baseline.rules.weakProductionReplacementMustKeepLegacyFallbackVisible,true);
  assert.equal(baseline.rules.actualRunningGameScreenshotRequiredForVisualPass,true);
  assert.equal(baseline.rules.generatedConceptImageDoesNotCountAsProof,true);
  assert.equal(baseline.visualPass,'PENDING_REAL_DEVICE_SCREENSHOT');
  for(const f of Object.values(baseline.references))assert.equal(fs.existsSync(new URL('../'+f,import.meta.url)),true);
});
