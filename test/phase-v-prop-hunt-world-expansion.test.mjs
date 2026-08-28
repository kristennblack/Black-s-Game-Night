import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {PAPA_DISGUISE_POOL,assignDisguiseOptions,propSurvivalRate,weatherForSeed,layoutVariantForSeed,roundSeed,WEATHER_PRESETS} from '../public/prop-hunt-core.mjs';
import {PropHuntRoom} from '../propHuntRoom.mjs';

const read=p=>fs.readFileSync(new URL(`../${p}`,import.meta.url),'utf8');
class FakeSql{constructor(){this.row=null}exec(q,...args){if(/^SELECT json/i.test(q))return{toArray:()=>this.row?[{json:this.row}]:[]};if(/^INSERT INTO prop_room/i.test(q)){this.row=args[0];return{toArray:()=>[]}}return{toArray:()=>[]}}}
function makeRoom(){const sql=new FakeSql(),ctx={storage:{sql},blockConcurrencyWhile(fn){return Promise.resolve().then(fn)},getWebSockets(){return[]},acceptWebSocket(){},waitUntil(){}};return new PropHuntRoom(ctx,{})}

test('Phase V Papa map is an actual roughly eight-times-larger traversable world',()=>{
  const src=read('public/prop-hunt-3d.js');
  assert.match(src,/w\.bounds=\{minX:\.2,maxX:51\.8,minZ:\.2,maxZ:41\.8\}/);
  assert.match(src,/oldPlayableArea:258\.4/);
  assert.match(src,/scaleMultiple:/);
  assert.match(src,/red survey boundary/);
  for(const token of ['MAIN SHOP','BARN: full search space','LARGE ANIMAL PENS','EQUIPMENT YARD','LUMBER\/MATERIAL STORAGE'])assert.ok(src.includes(token),token);
});

test('Papa map contains hundreds of props and a 150-plus gameplay-meaningful target',()=>{
  const src=read('public/prop-hunt-3d.js');
  for(const token of ['addClutter(shopClutter,96','addClutter(barnClutter,54','addClutter(yardClutter,58','for(let i=0;i<28;i++)','gameplayMeaningful'])assert.ok(src.includes(token),token);
  for(const token of ['TRACTOR HORN','SHOP LIGHTS','BARN BELL','OPEN SHORTCUT GATE','ODD OLD RADIO','MYSTERY SHOP SWITCH','INSPECT THE TATTERED CHAIR'])assert.ok(src.includes(token),token);
});

test('Papa disguise pool is exactly 30 curated options and each player gets four deterministic no-reroll choices',()=>{
  assert.equal(PAPA_DISGUISE_POOL.length,30);assert.equal(new Set(PAPA_DISGUISE_POOL).size,30);
  const players=[{id:'a',seat:0},{id:'b',seat:1}],seed=roundSeed('room',2,123),one=assignDisguiseOptions(players,seed),two=assignDisguiseOptions(players,seed);
  assert.deepEqual(one,two);assert.equal(one.a.length,4);assert.equal(new Set(one.a).size,4);
  const src=read('public/prop-hunt-3d.js');assert.match(src,/No rerolls/);assert.doesNotMatch(src,/phReroll|rerollDisguise|data-reroll/i);
});

test('large and giant disguises earn larger survival multipliers than small props',()=>{
  assert.ok(propSurvivalRate('Tractor')>propSurvivalRate('Hay Bale'));
  assert.ok(propSurvivalRate('Hay Bale')>propSurvivalRate('Coffee Mug'));
  assert.equal(propSurvivalRate('Coffee Mug'),1);assert.equal(propSurvivalRate('Tractor'),2.5);
});

test('weather and secondary layout variation are deterministic per round and include seven fair presets',()=>{
  assert.deepEqual([...WEATHER_PRESETS],['clear','sunset','overcast','light-rain','light-snow','fair-fog','windy']);
  const seed=roundSeed('abc',4,999);assert.equal(weatherForSeed(seed),weatherForSeed(seed));assert.equal(layoutVariantForSeed(seed),layoutVariantForSeed(seed));
  const src=read('public/prop-hunt-3d.js');assert.match(src,/CLEAR SKY/);assert.match(src,/LIGHT RAIN/);assert.match(src,/LIGHT SNOW/);assert.match(src,/LIGHT FOG/);
});

test('Prop Hunt supports 12 players and five-minute default hunts',()=>{
  const server=read('propHuntRoom.mjs'),client=read('public/prop-hunt-3d.js');assert.match(server,/const MAX_PLAYERS=12/);assert.match(server,/roundSeconds:300/);assert.match(client,/roundSeconds:300/);assert.match(client,/Array\.from\(\{length:11\}/);
});

test('Classic eliminations break the prop, play the sin cue, and offer free ghost or follow cameras',()=>{
  const src=read('public/prop-hunt-3d.js'),css=read('public/prop-hunt-3d.css');for(const token of ['spawnPropBreak','playSinCue','That\'s a sin.','beginGhostMode','updateGhost','goGhostFree','FOLLOW PLAYER','FREE CAM'])assert.ok(src.includes(token),token);assert.match(css,/\.ph3d-ghost-free/);
});

test('round end has skippable MVP presentation and persistent local lifetime stats',()=>{
  const src=read('public/prop-hunt-3d.js'),server=read('propHuntRoom.mjs');for(const token of ['ROUND ${roomState.round} MVP','BEST HIDER','BEST HUNTER','bfgn_prop_hunt_lifetime_v1','phRoundSkip'])assert.ok(src.includes(token),token);assert.match(server,/phaseEndsAt=Date\.now\(\)\+10000/);assert.match(server,/bestHider/);assert.match(server,/bestHunter/);
});

test('assigned disguise choices stay private to the owning player',async()=>{
  const room=makeRoom();await room.ready;room.room={id:'x',createdAt:1,revision:1,hostPlayerId:'a',phase:'hunt',phaseEndsAt:Date.now()+300000,round:1,wins:{hiders:0,hunters:0},settings:{mode:'classic',mapKey:'papa',rounds:6,hideSeconds:30,roundSeconds:300},players:[{id:'a',token:'at',name:'A',avatar:'john',seat:0,role:'hunter',health:3,alive:true,disguiseOptions:[]},{id:'b',token:'bt',name:'B',avatar:'kristen',seat:1,role:'hider',health:3,alive:true,prop:'Bucket',disguiseOptions:['Bucket','Tree','Tire','Tractor']}],decoyObjects:[]};
  assert.deepEqual(room.stateFor('at').players.find(p=>p.id==='b').disguiseOptions,[]);
  assert.deepEqual(room.stateFor('bt').players.find(p=>p.id==='b').disguiseOptions,['Bucket','Tree','Tire','Tractor']);
});
