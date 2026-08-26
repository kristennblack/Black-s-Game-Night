import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const read=p=>fs.readFileSync(new URL(`../${p}`,import.meta.url),'utf8');
const build='GAME-NIGHT-STAGING-PHASE-S-GAMEPLAY-TABLETOP-REALISM-17';
const cache='black-family-game-night-staging-phase-s-gameplay-tabletop-realism-17';
function glbJson(path){const b=fs.readFileSync(new URL(`../${path}`,import.meta.url));assert.equal(b.toString('ascii',0,4),'glTF');const len=b.readUInt32LE(12);return JSON.parse(b.toString('utf8',20,20+len).trim())}

test('Phase P1 has a fresh build/cache identity without removing Phase O games',()=>{
  assert.match(read('public/app.js'),new RegExp(build));assert.match(read('public/sw.js'),new RegExp(cache));assert.equal(read('VERSION.txt').trim(),build);
  assert.match(read('public/app.js'),/GAME\.BACKGAMMON,GAME\.BLACK_GAMMON/);
});

test('John PH-CHAR-01 is a skinned flagship asset with the expanded motion set',()=>{
  const doc=glbJson('public/models/characters/john-production-skinned.glb'),extras=doc.asset?.extras||{},names=(doc.animations||[]).map(a=>a.name);
  assert.equal(extras.productionFlagship,true);assert.match(extras.flagshipBenchmark||'',/^PH-CHAR-01(?:-P2)?$/);assert.ok(['P1','P2'].includes(extras.phase));assert.equal(doc.skins?.length,1);assert.ok((doc.images?.length||0)>=3);
  for(const name of ['Idle','Walk','Run','Sprint','Start_Move','Stop_Move','Turn_Left','Turn_Right','Jump','Fall','Land','Mantle','Crouch','Aim','Fire','Hit_Reaction'])assert.ok(names.includes(name),name);
  assert.ok(names.length>=19);
});

test('authored Prop Hunt keeps locomotion running under aim/fire overlays',()=>{
  const studio=read('public/shared-3d-studio.mjs'),prop=read('public/prop-hunt-3d.js');
  for(const token of ['playLayered(','_maskedClip(','layeredAimLocomotion:true'])assert.ok(studio.includes(token),token);
  assert.match(prop,/playLayered\(lower,overlay/);assert.match(prop,/overlay=transient==='fire'\?'fire':'aim'/);assert.match(prop,/base==='run'&&a\._sprinting/);
});

test('Prop Hunt adds restrained touch/gamepad aim assistance with muzzle validation',()=>{
  const prop=read('public/prop-hunt-3d.js'),css=read('public/prop-hunt-3d.css');
  assert.match(prop,/function aimAssistTarget/);assert.match(prop,/pointer:coarse/);assert.match(prop,/if\(assist\?\.point\)cameraPoint=assist\.point\.clone/);assert.match(prop,/revalidateShotFromMuzzle/);assert.match(css,/ph3d-crosshair\.assisted/);
});

test('Papa Shop production set keeps gameplay colliders and uses static visual optimization',()=>{
  const prop=read('public/prop-hunt-3d.js'),studio=read('public/shared-3d-studio.mjs');
  assert.match(prop,/upgradePapaProductionSlice/);assert.match(prop,/optimizeStaticAuthoredScene/);assert.match(prop,/prototypeNames/);assert.match(studio,/shadowMinRadius/);assert.match(studio,/matrixAutoUpdate=false/);
});

test('approved cabin stays in place while the home game controls become dimensional vector plaques',()=>{
  const app=read('public/app.js'),css=read('public/styles.css');
  assert.match(css,/home-cabin-background\.jpg/);assert.match(app,/john-home-approved\.jpg/);assert.match(app,/function premiumGameIcon/);assert.match(app,/premiumGameIcon\(key,m\)/);assert.match(css,/premium-game-icon/);assert.match(css,/crafted plaques instead of flat web cards/);
});

test('P1 preserves Easy-first bot defaults and readable bot selectors',()=>{
  const app=read('public/app.js'),worker=read('worker.mjs'),css=read('public/styles.css');
  assert.match(app,/botDifficultyOptions\(current='easy'\)/);assert.match(worker,/makeBot\(room,difficulty='easy'/);assert.match(css,/bot-add-grid select[\s\S]*background:#fff7e5/);
});
