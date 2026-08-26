import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const build='GAME-NIGHT-STAGING-PHASE-S-GAMEPLAY-TABLETOP-REALISM-17';
const cache='black-family-game-night-staging-phase-s-gameplay-tabletop-realism-17';

function parseGlbJson(path){
  const b=fs.readFileSync(path);
  assert.equal(b.toString('ascii',0,4),'glTF');
  assert.equal(b.readUInt32LE(4),2);
  const jsonLength=b.readUInt32LE(12);
  const jsonType=b.toString('ascii',16,20);
  assert.equal(jsonType,'JSON');
  return JSON.parse(b.toString('utf8',20,20+jsonLength).trim());
}

test('Phase K build and cache markers are isolated from Phase I',()=>{
  const app=fs.readFileSync('public/app.js','utf8');
  const sw=fs.readFileSync('public/sw.js','utf8');
  assert.match(app,new RegExp(build));
  assert.match(sw,new RegExp(cache));
  assert.doesNotMatch(app,/GAME-NIGHT-STAGING-PHASE-I-THREE-GAMES-07/);
});

test('John Phase P1 flagship character occupies the production runtime slot',()=>{
  const doc=parseGlbJson('public/models/characters/john-production-skinned.glb');
  assert.match(doc.asset?.extras?.flagshipBenchmark||'',/^PH-CHAR-01(?:-P2)?$/);
  assert.equal(doc.asset?.extras?.productionFlagship,true);
  assert.ok(['P1','P2'].includes(doc.asset?.extras?.phase));
  assert.equal(doc.asset?.extras?.character,'John');
  assert.equal(doc.skins?.length,1);
  assert.equal(doc.images?.length,3);
});

test('John Phase P1 expands the shared authored animation contract',()=>{
  const doc=parseGlbJson('public/models/characters/john-production-skinned.glb');
  const names=(doc.animations||[]).map(a=>a.name);
  assert.deepEqual(names,['Idle','Walk','Run','Sprint','Start_Move','Stop_Move','Turn_Left','Turn_Right','Jump','Fall','Land','Mantle','Crouch','Aim','Fire','Hit_Reaction','Wave','Celebrate','Sit']);
});

test('all three new game modules remain present in the release source',()=>{
  const source=fs.readFileSync('threeNewGames.mjs','utf8');
  assert.match(source,/GAME_TYPES\.MEXICAN_TRAIN/);
  assert.match(source,/GAME_TYPES\.SKIP_BO/);
  assert.match(source,/GAME_TYPES\.BACKGAMMON/);
});
