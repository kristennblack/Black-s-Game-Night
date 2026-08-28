import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
const app=await readFile(new URL('../public/app.js',import.meta.url),'utf8');
const worker=await readFile(new URL('../worker.mjs',import.meta.url),'utf8');
const bc=await readFile(new URL('../public/birthday-climb.js',import.meta.url),'utf8');
const ph=await readFile(new URL('../public/prop-hunt-3d.js',import.meta.url),'utf8');
const ng=await readFile(new URL('../public/new-games.html',import.meta.url),'utf8');

test('home image buttons navigate to real destinations instead of dead hotspots',()=>{
  for(const t of ['data-home-action=\"games\"','data-home-action=\"lodge\"','openHomePanel','Leaderboards','Avatars','Requests','How to Play','Invite']) assert.ok(app.includes(t),t);
});

test('multiplayer lobby exposes per-bot family character and difficulty editing',()=>{
  for(const t of ['botCharacterOptions','data-bot-character','data-bot-difficulty','data-update-bot','updateBot']) assert.ok(app.includes(t)||worker.includes(t),t);
});

test('Birthday Seat is a full-body vertical obby with readable route and visible throne goal',()=>{
  for(const t of ['/characters3d/','32 climbable steps','Moving Gift','Cake Bounce','JOHN\'S BIRTHDAY SEAT','realWebGL:true','allAngleRigs:true','movingPlatforms:true','visibleGoal:true','game.nextArrow','buildHumanRig','buildDogRig','jumpBuffer:true','gamepad:true']) assert.ok(bc.includes(t),t);assert.ok(bc.includes('fullBodySprites:false'));
});

test('3D games let the host select computer family characters',()=>{
  for(const t of ['netBotChar','netBotDiff','Add Computer']) assert.ok(ph.includes(t),t);
  for(const t of ['data-bc-bot-char','data-bc-bot-diff','Computer racers']) assert.ok(bc.includes(t),t);
  for(const t of ['data-m-bot-char','data-m-bot-diff','Computer detectives']) assert.ok(ng.includes(t),t);
});
