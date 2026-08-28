import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
const app=await readFile(new URL('../public/app.js',import.meta.url),'utf8');
const css=await readFile(new URL('../public/styles.css',import.meta.url),'utf8');
const html=await readFile(new URL('../public/new-games.html',import.meta.url),'utf8');

test('Family Mystery uses illustrated rooms, glowing movement blocks and avatar standees',()=>{
  for(const token of ['room-zone','walk-tile','board-figure','figureSrc','roomScenes','reachablePulse','figureWalk']) assert.ok(html.includes(token),token);
  assert.match(html,/glowing raised clue block/);
});

test('Lodge home uses a responsive cabin hero, approved John crop and restrained ambient motion',()=>{
  for(const token of ['lodge-hero','john-home-approved.jpg','home-title-lockup','home-feature-strip']) assert.ok(app.includes(token),token);assert.ok(css.includes('home-cabin-background.jpg'));
  for(const token of ['home-firelight','homeFirelight','prefers-reduced-motion']) assert.ok(css.includes(token),token);
});
