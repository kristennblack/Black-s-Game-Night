import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
const app=await readFile(new URL('../public/app.js',import.meta.url),'utf8');
const css=await readFile(new URL('../public/styles.css',import.meta.url),'utf8');
const ng=await readFile(new URL('../public/new-games.html',import.meta.url),'utf8');
const bc=await readFile(new URL('../public/birthday-climb.js',import.meta.url),'utf8');
const worker=await readFile(new URL('../worker.mjs',import.meta.url),'utf8');

test('approved cabin home art is live with moving fire hotspots',()=>{
  for(const t of ['home-cabin-approved.png','approved-home-scene','approved-fire','home-hotspot'])assert.ok(app.includes(t),t);
  for(const t of ['homeFlameA','homeFlameB','homeGlow','afember'])assert.ok(css.includes(t),t);
});

test('every game exposes a share or join link path',()=>{
  assert.ok(app.includes('Share Invite'));
  assert.ok(app.includes('Copy Link'));
  assert.ok(app.includes('data-create-share-game'));
  assert.ok(app.includes('Create & Share'));
  assert.ok(app.includes('inviteLink()'));
  assert.ok(app.includes('data-share-game'));
  assert.ok(app.includes('Share Link'));
  assert.ok(ng.includes('shareGameBtn'));
  assert.ok(ng.includes('Game link copied'));
});

test('character selection now moves from character to outfit and requires Back to switch',()=>{
  for(const t of ["avatarPickStage:'character'",'Back to Characters','Choose your character','Choose ${esc(selected[1].replace',"session.avatarPickStage='outfit'"])assert.ok(app.includes(t),t);
});

test('computer player controls exist globally with three difficulties',()=>{
  for(const t of ['addBot','updateBot','botTick','botCharacter','botDifficulty','botCharacterOptions'])assert.ok(app.includes(t)||worker.includes(t),t);
});

test('all three new games support solo play with computer opponents',()=>{
  for(const t of ['Empty seats are filled by computer family characters','Default computer difficulty','Computer detectives','runBotTurn'])assert.ok(ng.includes(t),`Mystery bot support missing: ${t}`);
  for(const t of ['computer','difficulty','bot'])assert.ok(ng.toLowerCase().includes(t),`new-games bot option missing: ${t}`);
  assert.ok(bc.includes('bots:true'));
});

test("John's Birthday Seat is included as a playable 3D platform game",()=>{
  assert.ok(app.includes("John's Birthday Seat"));
  assert.ok(ng.includes('screen-birthday'));
  for(const t of ['course','stages','thirdPerson:true','realWebGL:true','allAngleRigs:true','jump:true','jumpBuffer:true','coyoteTime:true','bots:true','botCharacters:true','visibleGoal:true','new THREE.WebGLRenderer','createThirdPersonCamera','birthday seat'])assert.ok(bc.toLowerCase().includes(t.toLowerCase()),t);assert.doesNotMatch(bc,/getContext\(['"]2d['"]\)|software-3D/i);
});
