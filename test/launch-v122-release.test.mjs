import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,stat} from 'node:fs/promises';

const ng=await readFile(new URL('../public/new-games.html',import.meta.url),'utf8');
const bc=await readFile(new URL('../public/birthday-climb.js',import.meta.url),'utf8');
const app=await readFile(new URL('../public/app.js',import.meta.url),'utf8');

const family3d=['james','dorothy','john','kristen','holly','vanessa','elizabeth','logan','kelsi','molly','gunner','papa','nana'];

test('v1.2.2 Family Mystery lets the host configure every computer detective independently',()=>{
  for(const token of ['mysterySetup','data-m-bot-char','data-m-bot-diff','mysteryBotCharacterOptions','mysteryBotDifficultyOptions','resolvedBots']) assert.ok(ng.includes(token),token);
  assert.ok(ng.includes('Default computer difficulty'));
  assert.ok(ng.includes('Choose each character + difficulty'));
});

test('v1.2.2 packages the full approved 13-character 3D runner roster',async()=>{
  for(const id of family3d){
    const file=new URL(`../public/characters3d/${id}.png`,import.meta.url);
    const info=await stat(file);
    assert.ok(info.size>20_000,`${id} full-body sprite looks missing or too small`);
  }
  assert.ok(bc.includes("const ROSTER=()=>[...window.FAMILY.people,...window.FAMILY.supports]"));
});

test('v1.2.2 release keeps all approved Lodge destinations and the rebuilt 32-step Birthday climb',()=>{
  for(const action of ['games','lodge','recent','avatars','store','updates','how','invite']) assert.ok(app.includes(`data-home-action=\"${action}\"`),action);
  assert.ok(bc.includes('32 climbable steps'));
  assert.ok(bc.includes("JOHN'S BIRTHDAY SEAT"));
  assert.ok(bc.includes('fullBodySprites:true'));
});
