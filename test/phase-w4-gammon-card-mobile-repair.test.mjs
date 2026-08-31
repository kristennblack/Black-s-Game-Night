import test from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import {readFile} from 'node:fs/promises';
import {GAME_TYPES} from '../gameEngine.mjs';
import {extraDefaults,startExtraGame,extraPublicState,extraGameAction} from '../extraGames.mjs';

const read=p=>readFile(new URL(`../${p}`,import.meta.url),'utf8');
const player=i=>({id:`p${i}`,token:`t${i}`,name:`Player ${i}`,avatar:i===1?'john':'kristen',variant:0,outfitVariant:0,color:i===1?'#305c9b':'#9b3e3a',seat:i-1,ready:true,connected:true,isBot:false,botDifficulty:null,bid:null,tricks:0,score:0,continued:false,hand:[],eliminated:false});
function room(type){const players=new Map([['p1',player(1)],['p2',player(2)]]);return{id:crypto.randomUUID(),gameType:type,settings:{...extraDefaults(type)},players,game:{phase:'lobby',history:[],schedule:[],winnerIds:[],extra:null}}}

test('W4 canonical board order exactly matches the locked physical point numbering for every viewer',async()=>{
  const app=await read('public/app.js');
  assert.match(app,/function bgPointOrder\(\)\{return\{top:\[12,13,14,15,16,17,18,19,20,21,22,23\],bottom:\[11,10,9,8,7,6,5,4,3,2,1,0\]\}\}/);
  assert.match(app,/function blackPointOrder\(\)\{return bgPointOrder\(\)\}/);
  assert.doesNotMatch(app,/function bgPointOrder\(viewerIsFirst\)/);
});

test('W4 preserves exact standard and Black Gammon starting checker points',()=>{
  const bg=room(GAME_TYPES.BACKGAMMON);startExtraGame(bg);const b=bg.game.extra;
  assert.deepEqual([b.points.p1[23],b.points.p1[12],b.points.p1[7],b.points.p1[5]],[2,5,3,5]);
  assert.deepEqual([b.points.p2[0],b.points.p2[11],b.points.p2[16],b.points.p2[18]],[2,5,3,5]);
  const black=room(GAME_TYPES.BLACK_GAMMON);startExtraGame(black);const x=black.game.extra;
  assert.deepEqual([x.points.p1[23],x.points.p1[12],x.points.p1[7],x.points.p1[5]],[4,4,4,3]);
  assert.deepEqual([x.points.p2[0],x.points.p2[11],x.points.p2[16],x.points.p2[18]],[4,4,4,3]);
});

test('W4 distinct Black Gammon dice are allocated by tapping two dice, not a generic move list',()=>{
  const r=room(GAME_TYPES.BLACK_GAMMON);startExtraGame(r);const e=r.game.extra;
  e.phase='allocateSingles';e.controllerId='p1';e.pool=[1,2,3,5];e.rolls={p1:[1,5],p2:[2,3]};
  const pub=extraPublicState(r,r.players.get('p1'));
  const allocations=pub.actions.filter(a=>a.action==='blackAllocateSingles');
  assert.equal(allocations.length,6);
  const chosen=allocations.find(a=>[...(a.args.values||[])].sort().join(',')==='1,5');assert.ok(chosen);
  extraGameAction(r,r.players.get('p1'),chosen);
  assert.deepEqual(e.assignments.p1.map(t=>t.value).sort((a,b)=>a-b),[1,5]);
  assert.deepEqual(e.assignments.p2.map(t=>t.value).sort((a,b)=>a-b),[2,3]);
  assert.equal(e.phase,'moving');
});

test('W4 Black Gammon UI is dice first and keeps both players rolled dice visible beside the board',async()=>{
  const app=await read('public/app.js'),css=await read('public/styles.css');
  for(const token of ['blackSideRolls','black-board-rolls','data-black-token','blackPlayableTokenHTML','blackPoolPicker','Dice → checker → destination']) assert.ok(app.includes(token),token);
  assert.doesNotMatch(app,/YOUR ASSIGNED MOVES/);
  assert.match(css,/\.black-side-roll\.side-0\{left:/);assert.match(css,/\.black-side-roll\.side-1\{right:/);
  assert.match(css,/\.black-playable-dice\{/);assert.match(css,/\.bg-destination-hit/);
});

test('W4 mobile gammon viewport explicitly removes clipping and allows fit below old 72 percent floor',async()=>{
  const app=await read('public/app.js'),css=await read('public/styles.css');
  assert.match(css,/\.gammon-board-viewport\{overflow:visible!important;max-height:none!important\}/);
  assert.match(css,/\.gammon-board-canvas>\.extra-center\{max-height:none!important;overflow:visible!important\}/);
  assert.match(app,/if\(gammon\)return Math\.max\(\.5,/);
  assert.match(app,/const z=Math\.max\(\.45,/);
});

test('W4 standard hands over eight cards become a swipeable full-touch mobile tray',async()=>{
  const app=await read('public/app.js'),css=await read('public/styles.css');
  assert.match(app,/largeHand=sortedHand\.length>8/);
  assert.match(app,/SWIPE TO SEE ALL/);
  assert.match(app,/function fitStandardCardHands\(\)/);
  assert.match(css,/\.hand\.large-hand\{[^}]*overflow-x:auto!important/s);
  assert.match(css,/\.hand\.large-hand \.hand-card\{[^}]*flex:0 0 64px!important/s);
  assert.match(css,/touch-action:pan-x/);
});
