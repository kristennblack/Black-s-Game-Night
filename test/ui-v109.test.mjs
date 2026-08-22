import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const app=fs.readFileSync(new URL('../public/app.js',import.meta.url),'utf8');
const css=fs.readFileSync(new URL('../public/styles.css',import.meta.url),'utf8');
const worker=fs.readFileSync(new URL('../worker.mjs',import.meta.url),'utf8');

test('all displayed card hands auto-sort and use no-swipe fit layouts',()=>{
  assert.match(app,/function sortedCards\(/);
  assert.match(app,/sortedCards\(g\.hand/);
  assert.match(app,/sortedCards\(e\.hand/);
  assert.match(app,/auto-fit-hand/);
  assert.match(css,/A hand always fits on screen/);
  assert.match(css,/\.extra-card-row\{overflow:visible!important/);
  assert.match(css,/\.hand\.auto-fit-hand \.hand-card\{flex:1 1 0/);
});

test('turn ownership makes YOUR HAND glow',()=>{
  assert.match(app,/hand-label \$\{handActive\?'your-turn'/);
  assert.match(app,/extra-hand-label \$\{active\?'your-turn'/);
  assert.match(css,/\.hand-label\.your-turn,\.extra-hand-label\.your-turn/);
});

test('Prairie Pots uses tappable hand actions and visible live chip pots',()=>{
  assert.match(app,/function prairieChipStack/);
  assert.match(app,/STILL TO WIN/);
  assert.match(app,/Tap a highlighted card in your sorted hand/);
  assert.match(css,/\.prairie-board\.upgraded/);
  assert.match(css,/\.chip-stack/);
  assert.match(css,/\.pot\.live/);
});

test('room-preserving host game switch is wired through Worker and client UI',()=>{
  assert.match(worker,/function switchRoomGame/);
  assert.match(worker,/\/api\/switchGame/);
  assert.match(app,/Keep the room · change the game/);
  assert.match(app,/data-switch-game/);
  assert.match(app,/↻ Switch Game/);
  assert.match(css,/\.game-switcher-backdrop/);
});
