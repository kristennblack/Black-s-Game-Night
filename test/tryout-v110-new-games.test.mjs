import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

const app=await readFile(new URL('../public/app.js',import.meta.url),'utf8');
const html=await readFile(new URL('../public/new-games.html',import.meta.url),'utf8');
const worker=await readFile(new URL('../worker.mjs',import.meta.url),'utf8');

test('tryout keeps the existing Worker backend untouched while adding two Lodge games',()=>{
  assert.match(app,/Family Mystery/);
  assert.match(app,/Family Prop Hunt/);
  assert.match(app,/data-prototype-game/);
  assert.match(worker,/GAME_HUB/);
});

test('Family Mystery tryout contains the complete family case file',()=>{
  for(const name of ['James','Dorothy','John','Kristen','Holly','Vanessa','Elizabeth','Logan','Kelsi','Molly','Gunner']) assert.match(html,new RegExp(name));
  for(const place of ['Camper','Fire Pit','Shop','Backyard','Living Room','Kitchen',"Papa's Shop",'Bathroom',"Papa's Shack",'Goat Pen']) assert.ok(html.includes(place),place);
  assert.match(html,/reachable/);
  assert.match(html,/Detective notes/);
});

test('Family Prop Hunt tryout contains the locked six-round loadout and four maps',()=>{
  for(const text of ['6 rounds','30s hide','3m hunt','3 prop changes','10 decoys','1 flash per disguise','3 health',"Papa's Shop",'Camper / Campsite','Backyard + Fire Pit','Farmyard / Animal Pens']) assert.ok(html.includes(text),text);
});
