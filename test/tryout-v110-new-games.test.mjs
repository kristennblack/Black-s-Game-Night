import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

const app=await readFile(new URL('../public/app.js',import.meta.url),'utf8');
const html=await readFile(new URL('../public/new-games.html',import.meta.url),'utf8');
const worker=await readFile(new URL('../worker.mjs',import.meta.url),'utf8');
const prop=await readFile(new URL('../public/prop-hunt-3d.js',import.meta.url),'utf8');

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
  for(const name of ["Papa's Shop",'Camper / Campsite','Backyard + Fire Pit','Farmyard / Animal Pens']) assert.ok(prop.includes(name),name);
  for(const pattern of [/state\.round>=6/,/phaseLeft:30\*TEST_SCALE/,/phaseLeft=180\*TEST_SCALE/,/propChanges:3/,/decoys:10/,/flash:1/,/health:3/]) assert.match(prop,pattern);
});
