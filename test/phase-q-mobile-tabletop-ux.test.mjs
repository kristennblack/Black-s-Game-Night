import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import crypto from 'node:crypto';
import { GAME_TYPES } from '../gameEngine.mjs';
import { extraDefaults, startExtraGame, extraPublicState } from '../extraGames.mjs';

const read=p=>fs.readFileSync(new URL(`../${p}`,import.meta.url),'utf8');
const BUILD='GAME-NIGHT-STAGING-PHASE-T1-PROP-HUNT-HUNTER-RELEASE-COMBAT-19';
const CACHE='black-family-game-night-staging-phase-t1-prop-hunt-hunter-release-combat-19';
const player=(i)=>({id:`p${i}`,token:`t${i}`,name:`Player ${i}`,avatar:'cowboy',variant:0,outfitVariant:0,color:i===1?'#2f6b9a':'#8b3d38',seat:i-1,ready:true,connected:true,bid:null,tricks:0,score:0,continued:false,hand:[],countHand:[],eliminated:false});
function room(type,n=2){const players=new Map(Array.from({length:n},(_,i)=>{const p=player(i+1);return[p.id,p]}));return{id:crypto.randomUUID(),gameType:type,settings:extraDefaults(type),players,game:{phase:'lobby',history:[],schedule:[],winnerIds:[],extra:null}}}

test('Phase Q has a fresh build, cache, and QA identity',()=>{
  assert.match(read('public/app.js'),new RegExp(BUILD));
  assert.match(read('public/sw.js'),new RegExp(CACHE));
  assert.equal(read('VERSION.txt').trim(),'GAME-NIGHT-STAGING-PHASE-W11-PROP-HUNT-SMOOTHNESS-STABILITY-35');
  assert.match(read('public/phase-e-qa.mjs'),/3\.4\.0-staging-phase-s-gameplay-tabletop-realism-17/);
});

test('Skip-Bo uses a portrait-first direct play surface rather than the zoom viewport',()=>{
  const app=read('public/app.js'),css=read('public/styles.css');
  for(const token of ['function skipBoGameplay','skipbo-screen-table','skipbo-hand-dock','selectedSkipBoSource','data-skipbo-source','skipbo-valid-target','skipbo-invalid-target']) assert.ok(app.includes(token),token);
  assert.match(app,/if\(s\.gameType===GAME\.SKIP_BO\)return skipBoGameplay/);
  assert.match(css,/\.skipbo-game-surface/);
  assert.match(css,/\.skipbo-hand-dock/);
  assert.match(css,/\.skipbo-valid-target/);
  assert.match(css,/\.skipbo-invalid-target/);
});

test('Skip-Bo presentation preserves private opponent hands and four visible discard destinations',()=>{
  const app=read('public/app.js');
  assert.match(app,/HAND \$\{e\.handCounts\?\.\[p\.id\]\|\|0\}/);
  assert.match(app,/Array\.from\(\{length:4\}/);
  assert.match(app,/DISCARD \$\{index\+1\}/);
  assert.match(app,/Tap a card, then a glowing destination/);
});

test('Cribbage UI exposes the real-board, two-peg, pegging-owner, and score-recap systems',()=>{
  const app=read('public/app.js'),css=read('public/styles.css');
  for(const token of ['function cribbageGameplay','function cribTrackRows','previousScores','lastPegEvent','playerId','function cribRoundRecap','crib-score-entry','crib-round-recap']) assert.ok(app.includes(token),token);
  assert.match(app,/if\(s\.gameType===GAME\.CRIBBAGE\)return cribbageGameplay/);
  for(const token of ['.crib-board-shell','.crib-player-track','.crib-peg.current','.crib-peg.trail','.crib-round-recap']) assert.ok(css.includes(token),token);
});

test('Cribbage public state can preserve a completed hand and crib scoring recap',()=>{
  const r=room(GAME_TYPES.CRIBBAGE,2);startExtraGame(r);
  const [p1,p2]=[...r.players.values()];
  r.game.extra.lastRoundSummary={hand:1,dealerId:p1.id,starter:{id:'s',rank:'5',suit:'hearts'},entries:[
    {who:p2.id,targetId:p2.id,hand:[{id:'a',rank:'5',suit:'clubs'}],score:2,details:['Pair'],from:0,to:2},
    {who:'crib',targetId:p1.id,hand:[{id:'b',rank:'J',suit:'hearts'}],score:1,details:['Nobs'],from:0,to:1}
  ],scores:{[p1.id]:1,[p2.id]:2}};
  r.game.extra.previousScores={[p1.id]:0,[p2.id]:0};
  r.game.extra.lastPegEvent={playerId:p2.id,from:0,to:2,points:2,label:'Pair'};
  const pub=extraPublicState(r,p1);
  assert.equal(pub.lastRoundSummary.entries.length,2);
  assert.equal(pub.lastRoundSummary.entries[1].who,'crib');
  assert.equal(pub.lastPegEvent.to,2);
  assert.equal(pub.previousScores[p2.id],0);
});

test('Phase Q packages the governing mobile tabletop directive',()=>{
  const d=read('MASTER_MOBILE_TABLETOP_UX_DIRECTIVE.md');
  for(const phrase of ['PORTRAIT-FIRST TABLETOP STANDARD','SKIP-BO IS A FULL-SCREEN CARD LAYOUT','CRIBBAGE SHOULD FEEL LIKE CRIBBAGE','No required pinch-zoom','actual crib cards','Do not claim real-device visual approval']) assert.match(d,new RegExp(phrase.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'),'i'));
});
