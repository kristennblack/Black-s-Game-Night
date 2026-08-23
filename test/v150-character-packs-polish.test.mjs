import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { GameHub } from '../worker.mjs';
import { GAME_TYPES } from '../gameEngine.mjs';

const root=new URL('..',import.meta.url);
const app=fs.readFileSync(new URL('../public/app.js',import.meta.url),'utf8');
const css=fs.readFileSync(new URL('../public/styles.css',import.meta.url),'utf8');
const mystery=fs.readFileSync(new URL('../public/new-games.html',import.meta.url),'utf8');
const prop=fs.readFileSync(new URL('../public/prop-hunt-3d.js',import.meta.url),'utf8');
const birthday=fs.readFileSync(new URL('../public/birthday-climb.js',import.meta.url),'utf8');
const roster=['john','kristen','holly','elizabeth','vanessa','logan','james','dorothy','nana','papa','kelsi','molly','gunner'];

test('v1.5.0 contains all five approved portrait packs and three full-body movement packs',()=>{
  for(const theme of ['country','rustic','rich','western','anime']){
    for(const id of roster){
      const p=new URL(`../public/avatars/themes/${theme}/${id}.jpg`,import.meta.url);
      assert.equal(fs.existsSync(p),true,`missing ${theme} avatar for ${id}`);
      assert.ok(fs.statSync(p).size>4000,`tiny/empty ${theme} avatar for ${id}`);
    }
    assert.equal(fs.existsSync(new URL(`../public/character-packs/${theme}-avatars-approved.png`,import.meta.url)),true);
  }
  for(const theme of ['country','rustic','rich'])for(const id of roster){
    const p=new URL(`../public/characters3d/themes/${theme}/${id}.png`,import.meta.url);
    assert.equal(fs.existsSync(p),true,`missing ${theme} full-body sprite for ${id}`);
    assert.ok(fs.statSync(p).size>8000,`tiny/empty ${theme} full-body sprite for ${id}`);
  }
});

test('tabletop character picker and bot editor expose the approved look packs',()=>{
  for(const token of ['Country','Rustic','Rich','Western','Cutesy Anime','familyThemeStyles','botLookOptions','tableFigureHTML'])assert.ok(app.includes(token),`missing ${token}`);
  for(const token of ['.character-pack-gallery','.table-family-figure','.theme-look','cardDealIn'])assert.ok(css.includes(token),`missing ${token}`);
});

test('Cribbage has the v1.5 physical board and peg animation treatment',()=>{
  for(const token of ['BLACK FAMILY CRIBBAGE','crib-board-shell','crib-hole','crib-pegging'])assert.ok(app.includes(token),`missing crib ${token}`);
  for(const token of ['cribPegLand','cribPlayCard','.extra-cribbage','perspective:1100px'])assert.ok(css.includes(token),`missing crib polish ${token}`);
});

test('Family Mystery, Prop Hunt and Birthday Seat can use approved full-body themes',()=>{
  assert.ok(mystery.includes('id="mTheme"'));
  assert.ok(mystery.includes('/characters3d/themes/${theme}/${person.id}.png'));
  assert.ok(prop.includes('BODY_SPRITES'));
  assert.ok(prop.includes('characterSprite(a.person'));
  assert.ok(prop.includes('/characters3d/themes/${style}/${p.id}.png'));
  assert.ok(birthday.includes("['country','Country']"));
  assert.ok(birthday.includes('/characters3d/themes/${setup.theme}/${p.id}.png'));
  assert.ok(birthday.includes('bots:false'));
});



test('all 18 original games have a dedicated polished table or board treatment',()=>{
  const themed=['standard-screw','standard-fuck','standard-smear','extra-campfire','trail-real-board','extra-prairie','extra-burnlogs','extra-decksweep','extra-cribbage','extra-marbles','extra-euchre','extra-thirtyone','extra-golf','extra-crazy8','extra-mitts','extra-poker','extra-president','extra-lasthaven'];
  for(const token of themed)assert.ok(css.includes(token)||app.includes(token),`missing dedicated visual hook ${token}`);
});

test('computer character look can be explicitly chosen and updated through the room API',async()=>{
  class MemoryStorage{constructor(){this.map=new Map()}async list({prefix=''}={}){return new Map([...this.map].filter(([k])=>k.startsWith(prefix)))}async get(k){return this.map.get(k)}async put(k,v){this.map.set(k,structuredClone(v))}}
  const ctx={storage:new MemoryStorage(),waitUntil(){}};
  const hub=new GameHub(ctx,{});
  const post=async(pathname,body)=>{const r=await hub.fetch(new Request(`https://game.test/api/${pathname}`,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(body)}));const d=await r.json();assert.equal(r.ok,true,JSON.stringify(d));return d};
  const created=await post('create',{name:'Kristen',gameType:GAME_TYPES.CRIBBAGE});
  const added=await post('addBot',{roomId:created.roomId,hostToken:created.hostToken,avatar:'john',variant:18,outfitVariant:3,difficulty:'hard'});
  let r=await hub.fetch(new Request(`https://game.test/api/state?room=${created.roomId}&token=${created.playerToken}`));let s=await r.json();let bot=s.players.find(p=>p.id===added.playerId);
  assert.equal(bot.avatar,'john');assert.equal(bot.variant,18);assert.equal(bot.outfitVariant,3);assert.equal(bot.botDifficulty,'hard');
  await post('updateBot',{roomId:created.roomId,hostToken:created.hostToken,targetId:bot.id,avatar:'molly',variant:8,outfitVariant:1,difficulty:'easy'});
  r=await hub.fetch(new Request(`https://game.test/api/state?room=${created.roomId}&token=${created.playerToken}`));s=await r.json();bot=s.players.find(p=>p.id===added.playerId);
  assert.equal(bot.avatar,'molly');assert.equal(bot.variant,8);assert.equal(bot.outfitVariant,1);assert.equal(bot.botDifficulty,'easy');
});
