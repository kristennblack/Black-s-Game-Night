import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {
  classifyProductionSurface,
  productionSurfaceProfile,
  productionVisualManifest
} from '../public/w35-production-visuals.mjs';

const read=(p)=>fs.readFileSync(new URL(p,import.meta.url),'utf8');

test('W35 turns Papa visual primitives into collision-only support and loads authored visible assets',()=>{
  const src=read('../public/prop-hunt-3d.js');
  assert.match(src,/phaseW35ProductionSlice=true/);
  assert.match(src,/markCollisionOnly/);
  assert.match(src,/assets\.loadEnvironment\('papaShop'/);
  assert.match(src,/assets\.loadSet\('papaShopProps'/);
  assert.match(src,/addAuthoredCollisionShell/);
  assert.match(src,/w35AuthoredVisibleWorld:true/);
  assert.match(src,/w35CollisionVisualSeparation:true/);
});

test('W35 authored material classifier distinguishes the flagship surface families',()=>{
  assert.equal(classifyProductionSurface('shop_concrete_floor'),'concrete');
  assert.equal(classifyProductionSurface('old barn timber wall'),'wood');
  assert.equal(classifyProductionSurface('tractor tire rubber'),'rubber');
  assert.equal(classifyProductionSurface('tractor painted body'),'paintedMetal');
  assert.equal(classifyProductionSurface('roof steel rib'),'metal');
  assert.equal(classifyProductionSurface('window glass'),'glass');
  assert.ok(productionSurfaceProfile('concrete').roughness>productionSurfaceProfile('metal').roughness);
});

test('W35 manifest truthfully preserves the approved-character gate while enabling the production visual pipeline',()=>{
  const m=productionVisualManifest();
  assert.equal(m.authoredVisibleWorld,true);
  assert.equal(m.collisionVisualSeparation,true);
  assert.equal(m.authoredCollisionExtraction,true);
  assert.equal(m.productionLighting,true);
  assert.equal(m.approvedModelGatePreserved,true);
});

test('W35 development John proxy is QA-only and visibly labelled as unapproved',()=>{
  const src=read('../public/prop-hunt-3d.js');
  assert.match(src,/W35_DEV_JOHN_PROXY=QA_MODE&&\(URL_FLAGS\.get\('w35ProxyJohn'\)==='1'\|\|URL_FLAGS\.get\('w36Benchmark'\)==='1'\)/);
  assert.match(src,/ANIMATION PROXY · JOHN LIKENESS NOT YET APPROVED/);
  assert.match(src,/w7UnapprovedLegacyModelBlocked:true/);
  assert.match(src,/w35ApprovedModelGatePreserved:true/);
});
