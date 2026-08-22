import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
const app=await readFile(new URL('../public/app.js',import.meta.url),'utf8');
const css=await readFile(new URL('../public/styles.css',import.meta.url),'utf8');
const html=await readFile(new URL('../public/new-games.html',import.meta.url),'utf8');

test('Family Mystery uses illustrated rooms, glowing movement blocks and avatar standees',()=>{
  for(const token of ['room-zone','walk-tile','board-figure','figureSrc','roomScenes','reachablePulse','figureWalk']) assert.ok(html.includes(token),token);
  assert.match(html,/glowing floor block/);
});

test('Lodge home uses a detailed cabin scene with animated fire',()=>{
  for(const token of ['approved-home-scene','home-cabin-approved.png','approved-fire','home-hotspot']) assert.ok(app.includes(token),token);
  for(const token of ['homeFlameA','homeGlow','emberRise']) assert.ok(css.includes(token),token);
});
