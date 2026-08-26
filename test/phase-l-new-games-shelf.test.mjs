import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const build='GAME-NIGHT-STAGING-PHASE-U2-ARCADE-PACK-22';
const cache='black-family-game-night-staging-phase-u2-arcade-pack-22';

test('Phase L uses a fresh build and service-worker cache',()=>{
  const app=fs.readFileSync('public/app.js','utf8');
  const sw=fs.readFileSync('public/sw.js','utf8');
  assert.match(app,new RegExp(build));
  assert.match(sw,new RegExp(cache));
});

test('Mexican Train, Skip-Bo, Backgammon and Black Gammon are visible on the actual home Game Shelf',()=>{
  const app=fs.readFileSync('public/app.js','utf8');
  assert.match(app,/\['New Table Games',\[GAME\.MEXICAN_TRAIN,GAME\.SKIP_BO,GAME\.BACKGAMMON,GAME\.BLACK_GAMMON\]\]/);
  assert.match(app,/mexicantrain:\{name:'Mexican Train'/);
  assert.match(app,/skipbo:\{name:'Skip-Bo'/);
  assert.match(app,/backgammon:\{name:'Backgammon'/);
  assert.match(app,/blackgammon:\{name:'Black Gammon'/);
});

test('the table-game shelf entries are wired into playable extra-game routing',()=>{
  const app=fs.readFileSync('public/app.js','utf8');
  assert.match(app,/EXTRA_GAMES=new Set\([^\n]*GAME\.MEXICAN_TRAIN,GAME\.SKIP_BO,GAME\.BACKGAMMON/);
  assert.match(app,/if\(t===GAME\.MEXICAN_TRAIN\)return mexicanTrainBoard/);
  assert.match(app,/if\(t===GAME\.SKIP_BO\)return skipBoBoard/);
  assert.match(app,/if\(t===GAME\.BACKGAMMON\)return backgammonBoard/);
  assert.match(app,/if\(t===GAME\.BLACK_GAMMON\)return blackGammonBoard/);
});
