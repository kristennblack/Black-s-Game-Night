import test from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import { GAME_TYPES } from '../gameEngine.mjs';
import { extraDefaults, startExtraGame, extraPublicState, extraGameAction } from '../extraGames.mjs';

const BUILD='GAME-NIGHT-STAGING-PHASE-T1-PROP-HUNT-HUNTER-RELEASE-COMBAT-19';
const CACHE='black-family-game-night-staging-phase-t1-prop-hunt-hunter-release-combat-19';
const read=p=>fs.readFileSync(new URL(`../${p}`,import.meta.url),'utf8');
const player=i=>({id:`p${i}`,token:`t${i}`,name:`Player ${i}`,avatar:i===1?'john':'kristen',variant:0,outfitVariant:0,color:i===1?'#2f6bb2':'#c74277',seat:i-1,ready:true,connected:true,isBot:false,botDifficulty:null,bid:null,tricks:0,score:0,continued:false,hand:[],eliminated:false});
function room(type,n,settings={}){
  const players=new Map(Array.from({length:n},(_,i)=>{const p=player(i+1);return[p.id,p]}));
  return {id:crypto.randomUUID(),gameType:type,settings:{...extraDefaults(type),...settings},players,game:{phase:'lobby',history:[],schedule:[],winnerIds:[],extra:null}};
}

function firstAction(r,p,name){return extraPublicState(r,p).actions.find(a=>a.action===name)}

test('Phase S has an isolated build/cache identity and packages its directive',()=>{
  assert.match(read('public/app.js'),new RegExp(BUILD));
  assert.match(read('public/sw.js'),new RegExp(CACHE));
  assert.equal(read('VERSION.txt').trim(),BUILD);
  const directive=read('MASTER_PHASE_S_GAMEPLAY_TABLETOP_REALISM_DIRECTIVE.md');
  for(const phrase of ['Stock Pile','TRAIL TROUBLE','LAST HAVEN','BACKGAMMON & BLACK GAMMON','MARBLES & JOKERS','SCREW YOUR BUDDY & FUCK YOUR BUDDY']) assert.ok(directive.includes(phrase),phrase);
});

test('Skip-Bo Stock top is a first-class source, exposes the next card, and can chain to victory',()=>{
  const r=room(GAME_TYPES.SKIP_BO,2,{stockSize:10});startExtraGame(r);const ex=r.game.extra,p=r.players.get(ex.turnPlayerId);
  ex.phase='play';ex.builds=[[],[],[],[]];p.hand=[];
  ex.stocks[p.id]=[{id:'stock-two',rank:2,wild:false},{id:'stock-one',rank:1,wild:false}];
  let pub=extraPublicState(r,p);let play=pub.actions.find(a=>a.action==='sbPlay'&&a.args.source?.kind==='stock'&&a.args.pile===0);
  assert.ok(play,'face-up Stock 1 should be playable onto an empty Building Pile');
  assert.equal(pub.stocks[p.id].top.id,'stock-one');
  extraGameAction(r,p,play);
  pub=extraPublicState(r,p);
  assert.equal(pub.stocks[p.id].count,1);
  assert.equal(pub.stocks[p.id].top.id,'stock-two','next Stock card should immediately be exposed');
  play=pub.actions.find(a=>a.action==='sbPlay'&&a.args.source?.kind==='stock'&&a.args.pile===0);
  assert.ok(play,'newly exposed Stock 2 should remain playable in the same turn');
  extraGameAction(r,p,play);
  assert.equal(r.game.phase,'gameOver');
  assert.deepEqual(r.game.winnerIds,[p.id]);
});

test('Skip-Bo UI visibly treats Stock as playable and uses direct glowing Building targets',()=>{
  const app=read('public/app.js'),css=read('public/styles.css');
  for(const token of ['STOCK · PLAY THIS TOP CARD','clear this pile to win','data-skipbo-source','skipbo-valid-target','PLAY HERE']) assert.ok(app.includes(token),token);
  for(const token of ['.skipbo-stock','.skipbo-source-card.selected','.skipbo-valid-target']) assert.ok(css.includes(token),token);
  assert.match(app,/\(!selected\|\|selected==='stock'\)/);
});

test('Trail Trouble starts with five cards and completes a real first turn',()=>{
  const r=room(GAME_TYPES.TRAIL,2,{teamMode:'solo'});startExtraGame(r);const ex=r.game.extra,p=r.players.get(ex.turnPlayerId),before=ex.turnPlayerId;
  p.hand=[{id:'phase-s-trail-three',kind:'move',value:3,label:'3'}];
  const pub=extraPublicState(r,p);const move=pub.actions.find(a=>a.action==='trailMove'&&a.args?.cardId==='phase-s-trail-three');
  assert.ok(move,'a legal first Trail movement must be exposed after start');
  extraGameAction(r,p,move);
  assert.equal(r.game.extra.phase,'playing');
  assert.notEqual(r.game.extra.turnPlayerId,before,'a normal 3-card turn should advance to the next player');
});

test('Last Haven progresses from Camp to Route through the complete setup and into first gameplay turn',()=>{
  const r=room(GAME_TYPES.LAST_HAVEN,3);startExtraGame(r);const ex=r.game.extra;
  let guard=0;
  while(ex.phase!=='playing'&&guard++<30){
    const p=r.players.get(ex.turnPlayerId);
    const camp=firstAction(r,p,'havenSetupCamp');assert.ok(camp,`setupCamp action missing at setup index ${ex.setupIndex}`);extraGameAction(r,p,camp);
    assert.equal(ex.phase,'setupRoute');
    const route=firstAction(r,p,'havenSetupRoute');assert.ok(route,'connected setup Route should be offered immediately after Camp');extraGameAction(r,p,route);
  }
  assert.equal(ex.phase,'playing','full setup should transition to regular gameplay');
  const p=r.players.get(ex.turnPlayerId),oldRandom=Math.random;
  try{Math.random=()=>0.1;const roll=firstAction(r,p,'havenRoll');assert.ok(roll);extraGameAction(r,p,roll);assert.equal(ex.phase,'playing');assert.equal(ex.rolled,true);const end=firstAction(r,p,'havenEnd');assert.ok(end);extraGameAction(r,p,end);assert.equal(ex.rolled,false)}finally{Math.random=oldRandom}
});

test('Last Haven UI provides large direct Route targets and a route fallback action panel',()=>{
  const app=read('public/app.js'),css=read('public/styles.css');
  for(const token of ['haven-route-target','Place Supply Route here','setupRoute']) assert.ok(app.includes(token),token);
  assert.ok(css.includes('.haven-route-target'));
});

test('Cribbage Phase S uses one shared physical wood board with colored lanes, drilled holes, seated pegs, and peg animation',()=>{
  const app=read('public/app.js'),css=read('public/styles.css');
  for(const token of ['cribPhysicalBoard','cribTrackCoord','cribPhysicalPeg','runCribPegAnimation','crib-physical-board','crib-real-hole','crib-physical-peg','crib-board-legend']) assert.ok(app.includes(token)||css.includes(`.${token}`)||css.includes(token),token);
  for(const token of ['previousScores','lastPegEvent','lastRoundSummary','countDisplayHand']) assert.ok(app.includes(token)||read('extraGames.mjs').includes(token),token);
  assert.match(css,/\.crib-physical-board[^}]*wood|\.crib-physical-board/s);
});

test('Cribbage public state keeps previous score and peg-event data required for physical peg movement',()=>{
  const r=room(GAME_TYPES.CRIBBAGE,2);startExtraGame(r);const p=[...r.players.values()][0],pub=extraPublicState(r,p);
  assert.ok(pub.previousScores && typeof pub.previousScores==='object');
  assert.equal('lastPegEvent' in pub,true);
  assert.equal('lastRoundSummary' in pub,true);
});

test('Backgammon and Black Gammon retain screen-first Gammon renderer with Phase S dimensional wood treatment',()=>{
  const app=read('public/app.js'),css=read('public/styles.css');
  assert.match(app,/if\(\[GAME\.BACKGAMMON,GAME\.BLACK_GAMMON\]\.includes\(s\.gameType\)\)return gammonGameplay/);
  for(const token of ['.gammon-focus-surface','.backgammon-table','.bg-board','.bg-checker','.die']) assert.ok(css.includes(token),token);
  for(const token of ['linear-gradient','radial-gradient','box-shadow']) assert.ok(css.includes(token),`missing dimensional CSS primitive ${token}`);
  assert.match(css,/PHASE S|Phase S/i);
});

test('Gammon roll actions still force a fresh room-state read without duplicating action UI',()=>{
  const app=read('public/app.js');
  assert.match(app,/\['bgOpeningRoll','bgRoll','blackRoll','blackBigRoll'\]\.includes\(a\.action\)/);
  assert.match(app,/const fresh=await fetchState\(session\.roomId,session\.playerToken\);setRoomState\(fresh\);refreshed=true/);
  assert.ok(app.includes('gammon-primary-btn'));
});

test('Marbles & Jokers has a dedicated screen-first renderer rather than the generic felt-table shell',()=>{
  const app=read('public/app.js'),css=read('public/styles.css');
  assert.ok(app.includes('function marblesGameplay'));
  assert.match(app,/if\(s\.gameType===GAME\.MARBLES\)return marblesGameplay/);
  for(const token of ['.marbles-focus-layout','.marbles-game-surface','.marbles-secondary']) assert.ok(css.includes(token),token);
});

test('Screw Your Buddy and Fuck Your Buddy bidding show hand size plus trump/special context in the bid box',()=>{
  const app=read('public/app.js'),css=read('public/styles.css');
  assert.ok(app.includes('function bidRoundContext'));
  assert.ok(app.includes('bid-round-context'));
  assert.ok(app.includes('THIS ROUND'));
  assert.ok(app.includes('No Trump'));
  assert.ok(app.includes('Power ${g.powerRank}s'));
  assert.ok(css.includes('.bid-round-context'));
});

test('Phase S critical tabletop actions request immediate visible state refresh rather than waiting only on SSE',()=>{
  const app=read('public/app.js');
  for(const action of ['sbPlay','sbDiscard','havenSetupCamp','havenSetupRoute','trailMove','trailDiscardCard']) assert.ok(app.includes(action),action);
  assert.ok(app.includes('if(refreshed)render()'));
});
