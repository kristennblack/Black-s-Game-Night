import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const read=p=>fs.readFileSync(new URL(`../${p}`,import.meta.url),'utf8');
const build='GAME-NIGHT-STAGING-PHASE-P1-FLAGSHIP-UPGRADE-14';

test('Phase P0 installs flagship directive and locked-component register',()=>{
  assert.match(read('MASTER_3D_DEVELOPMENT_DIRECTIVE.md'),/Family Prop Hunt.*flagship/s);
  assert.match(read('PROP_HUNT_FLAGSHIP_AUDIT_AND_PLAN.md'),/PH-CHAR-01: John in Papa's Shop/);
  assert.match(read('LOCKED_COMPONENTS_REGISTER.md'),/third-person camera recovery/);
  assert.equal(read('VERSION.txt').trim(),build);
});

test('Easy is the default computer difficulty across exposed setup paths',()=>{
  const app=read('public/app.js'),prop=read('public/prop-hunt-3d.js'),room=read('propHuntRoom.mjs'),birthday=read('public/birthday-climb.js'),ng=read('public/new-games.html');
  assert.match(app,/botDifficultyOptions\('easy'\)/);
  assert.match(prop,/<option selected>easy<\/option>/);
  assert.match(room,/safeDifficulty=.*:'easy'/);
  assert.match(birthday,/difficulty:'easy'/);
  assert.match(ng,/id="mDifficulty"[\s\S]*?<option value="easy" selected>Easy<\/option>/);
});

test('locked Prop Hunt technical seams remain present',()=>{
  const prop=read('public/prop-hunt-3d.js'),gameplay=read('public/shared-3d-gameplay.mjs'),studio=read('public/shared-3d-studio.mjs');
  assert.match(prop,/phResetView/);
  assert.match(prop,/revalidateShotFromMuzzle/);
  assert.match(prop,/function buildPapa\(\)/);
  assert.match(prop,/upgradePapaProductionSlice/);
  assert.match(gameplay,/automatic close-camera collapse recovery/);
  assert.match(studio,/john-production-skinned\.glb/);
  assert.match(studio,/papa-shop-barn-production\.glb/);
  assert.match(studio,/papa-shop-production-props\.glb/);
});

test('approved cabin composition assets are still packaged',()=>{
  for(const f of ['public/home-cabin-approved.png','public/home-cabin-background.jpg','public/john-home-approved.jpg'])assert.ok(fs.existsSync(new URL(`../${f}`,import.meta.url)));
});
