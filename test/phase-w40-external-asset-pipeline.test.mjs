import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const read=p=>fs.readFileSync(new URL(`../${p}`,import.meta.url),'utf8');
const manifest=JSON.parse(read('public/models/w40/external-asset-manifest.json'));

test('W40 manifest keeps external assets gated instead of silently approving them',()=>{
  assert.equal(manifest.build,'GAME-NIGHT-STAGING-CANDIDATE-W40-EXTERNAL-ASSET-PIPELINE-59');
  assert.equal(manifest.slots.john.qaReady,false);assert.equal(manifest.slots.john.approved,false);
  assert.equal(manifest.slots.papaShopHeroBay.qaReady,false);assert.equal(manifest.slots.papaShopProps.qaReady,false);
  assert.match(manifest.slots.john.candidate,/CHAR_JOHN_W40\.glb$/);
  assert.match(manifest.slots.papaShopHeroBay.candidate,/ENV_PAPA_SHOP_HERO_BAY_W40\.glb$/);
});

test('W40 uses a shoulder-level Prop Hunt camera without changing the shared gameplay API',()=>{
  const s=read('public/w40-production-presentation.mjs');
  assert.match(s,/cameraDistance:3\.72/);assert.match(s,/cameraHeight:1\.34/);assert.match(s,/fov:56/);assert.match(s,/maxPitch:\.17/);assert.match(s,/pitch:\.012/);
  assert.match(s,/tryPromoteExternalPapa/);assert.match(s,/if\(!slot\?\.qaReady\)/);
});

test('Prop Hunt wires W40 presentation, lighting, telemetry and external promotion onto W36 fallback',()=>{
  const s=read('public/prop-hunt-3d.js');
  assert.match(s,/W40_PRESENTATION_URL/);assert.match(s,/W40_TELEMETRY_URL/);assert.match(s,/W40_TRUTH_OVERLAY/);
  assert.match(s,/installWorkshopEnvironment/);assert.match(s,/tryPromoteExternalPapa/);
  assert.match(s,/w40ExternalAssetPipeline:true/);assert.match(s,/w40RuntimeTruthOverlay:true/);assert.match(s,/w40ProfessionalCamera:true/);
});

test('W40 runtime truth reports actual asset sources, PBR coverage and camera state',()=>{
  const s=read('public/w40-runtime-telemetry.mjs');
  for(const token of ['W40 RUNTIME TRUTH','CHAR approval','AUTHORED ENVIRONMENT NOT ACTIVE','VERY LOW PBR MAP COVERAGE','CAMERA TOO HIGH','__W40_RUNTIME_TRUTH__'])assert.ok(s.includes(token),token);
});

test('W40 production proof is a real GLB drop-in bench, not a generated concept image',()=>{
  const html=read('public/w40-production-proof.html'),js=read('public/w40-production-proof.mjs');
  assert.match(html,/type="file"/);assert.match(html,/John candidate/i);assert.match(html,/Papa's Shop candidate/i);assert.match(html,/Load local GLB/i);
  assert.match(js,/GLTFLoader/);assert.match(js,/LOCAL EXTERNAL CANDIDATE/);assert.match(js,/triangles/i);assert.doesNotMatch(html,/approved.*mockup/i);
});

test('Cabin W40 truth distinguishes true WebGL from static fallback and counts furniture tiers',()=>{
  const room=read('public/cabin-3d-room.mjs'),app=read('public/cabin.js'),html=read('public/cabin.html');
  assert.match(room,/W40 CABIN RUNTIME TRUTH/);assert.match(room,/__W40_CABIN_RUNTIME_TRUTH__/);assert.match(room,/design fallback/);assert.match(room,/production GLB/);
  assert.match(app,/STATIC FALLBACK ACTIVE/);assert.match(app,/W40-EXTERNAL-ASSET-PIPELINE-59/);assert.match(html,/W40-EXTERNAL-ASSET-PIPELINE-59/);
});

test('W40 cache busts Prop Hunt entrypoint while official release marker remains W30',()=>{
  const html=read('public/new-games.html');assert.match(html,/prop-hunt-3d\.js\?v=GAME-NIGHT-STAGING-CANDIDATE-W40-EXTERNAL-ASSET-PIPELINE-59/);
  assert.match(read('CURRENT_RELEASE.txt'),/W30-PROP-HUNT-P0-GAMEPLAY-54/);
  assert.match(read('DESIGN_RELEASE.txt'),/W30-PROP-HUNT-P0-GAMEPLAY-54/);
});

test('W40 carries the actual user gameplay failure screenshot as a visual regression baseline',()=>{
  assert.ok(fs.existsSync(new URL('../visual_proofs/W40_ACTUAL_PROP_HUNT_FAILURE_BASELINE.png',import.meta.url)));
});
