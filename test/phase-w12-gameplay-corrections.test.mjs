import test from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { GAME_TYPES } from '../gameEngine.mjs';
import { extraDefaults, startExtraGame, extraPublicState, extraGameAction } from '../extraGames.mjs';
import { blackLegalMoves } from '../blackGammon.mjs';

const player=i=>({id:`p${i}`,token:`t${i}`,name:`Player ${i}`,avatar:'cowboy',variant:0,outfitVariant:0,color:'#2f6b4f',seat:i-1,ready:true,connected:true,bid:null,tricks:0,score:0,continued:false,hand:[],eliminated:false,isBot:false});
function room(type,n,settings={}){const players=new Map(Array.from({length:n},(_,i)=>{const p=player(i+1);return[p.id,p]}));return{id:crypto.randomUUID(),gameType:type,settings:{...extraDefaults(type),...settings},players,game:{phase:'lobby',history:[],schedule:[],winnerIds:[],extra:null}}}

const files=async()=>({
 app:await readFile(new URL('../public/app.js',import.meta.url),'utf8'),
 css:await readFile(new URL('../public/styles.css',import.meta.url),'utf8'),
 prop:await readFile(new URL('../public/prop-hunt-3d.js',import.meta.url),'utf8'),
 shared:await readFile(new URL('../public/shared-3d-gameplay.mjs',import.meta.url),'utf8')
});

test('W12 renames the current house game to the one-word Blackgammon and provides direct legal-move controls',async()=>{
 const {app}=await files();
 assert.match(app,/blackgammon:\{name:'Blackgammon'/);
 assert.match(app,/black-direct-moves/);
 assert.match(app,/data-extra-action=/);
 const r=room(GAME_TYPES.BLACK_GAMMON,2);startExtraGame(r);const ex=r.game.extra;
 for(const id of ['p1','p2']){ex.points[id]=Array(24).fill(0);ex.bar[id]=0;ex.off[id]=0;ex.riskDue[id]=Array(24).fill(null);ex.overDue[id]=Array(24).fill(null)}ex.top=Array(24).fill(null);
 ex.points.p1[23]=15;ex.phase='moving';ex.turnPlayerId='p1';ex.assignments={p1:[{id:'w12die',kind:'single',value:1,direction:'auto',remaining:1,transferred:false}],p2:[]};ex.moveQueue=['p1'];ex.moveIndex=0;
 const moves=blackLegalMoves(r,'p1');assert.ok(moves.length,'a checker move must exist after dice allocation');
 const pub=extraPublicState(r,r.players.get('p1'));assert.ok(pub.actions.some(a=>a.action==='blackMove'));
 extraGameAction(r,r.players.get('p1'),pub.actions.find(a=>a.action==='blackMove'));
 assert.equal(ex.points.p1.reduce((a,b)=>a+b,0)+ex.off.p1+ex.bar.p1,15);
});

test('W30 supersedes W12 movement tuning while retaining forward weapon placement',async()=>{
 const {prop,shared}=await files();
 assert.match(shared,/walkSpeed:2\.35/);assert.match(shared,/jogSpeed:3\.35/);assert.match(shared,/runSpeed:4\.50/);assert.match(shared,/sprintSpeed:5\.70/);
 assert.ok(!/correctedJoy=\{x:joy\.x,z:-joy\.z\}/.test(prop));assert.match(prop,/movementIntent\(keys,joy,game\.cameraYaw\)/);
 assert.match(prop,/\[0,-\.02,\.12\]/);
 assert.match(shared,/basePos\(p\.weaponAnchor,'z',\.34\)-recoil\*\.06/);
});

test('W12 Mexican Train exposes flip controls, every player train, shared train, and keeps score outside the board',async()=>{
 const {app}=await files();
 assert.match(app,/data-domino-flip/);
 assert.match(app,/FLIP OR REARRANGE ANY TILE/);
 assert.match(app,/MEXICAN TRAIN · COMMUNITY/);
 assert.match(app,/orderedPlayers\.map\(p=>\{const tr=e\.trains/);
 const board=app.slice(app.indexOf('function mexicanTrainBoard'),app.indexOf('function mexicanRackPanel'));
 assert.doesNotMatch(board,/mtScoreSheet\(s,e\)/);
 assert.match(app,/function mexicanTrainGameplay[\s\S]*?<aside class="sidebar tabletop-secondary">\$\{mtScoreSheet\(s,e\)\}/);
});

test('W12 Last Haven shows a planning hand with resources and survival cards',async()=>{
 const {app}=await files();
 assert.match(app,/YOUR SUPPLY HAND · USE THIS TO PLAN BUILDS & TRADES/);
 assert.match(app,/haven-resource-cards/);
 assert.match(app,/SURVIVAL CARDS/);
});

test('W12 Deck Sweep unlocks each face-down slot independently after its own upright card is played',()=>{
 const r=room(GAME_TYPES.DECK_SWEEP,3);startExtraGame(r);const ex=r.game.extra,p=r.players.get(ex.turnPlayerId),l=ex.layout[p.id];
 p.hand=[];l.up[0]=null;assert.ok(l.down[0]);assert.ok(l.up.slice(1).some(Boolean),'other upright cards intentionally remain');
 let pub=extraPublicState(r,p);const blind=pub.actions.find(a=>a.action==='sweepPlay'&&a.args?.blindIndex===0);assert.ok(blind,'slot 0 face-down card should unlock without clearing other uprights');
 extraGameAction(r,p,blind);
 assert.equal(l.down[0],null);
});

test('W12 Deck Sweep is rank-first, highlights tens, and renders all player table stations',async()=>{
 const {app,css}=await files();
 assert.match(app,/if\(type===GAME\.DECK_SWEEP\)/);
 assert.match(app,/deck-sweep-ten/);
 assert.match(app,/10 = SPECIAL SWEEP CARD/);
 assert.match(app,/players\.map\(station\)/);
 assert.match(css,/\.deck-sweep-ten/);
});

test('W12 Prairie Pots visibly awards special pots into chip totals and reports progression',()=>{
 const r=room(GAME_TYPES.PRAIRIE,4,{startingChips:100,roundCount:3});startExtraGame(r);const ex=r.game.extra,p=r.players.get(ex.turnPlayerId);
 const special={id:'w12-10s',rank:'10',suit:'spades'};p.hand=[special,{id:'other',rank:'2',suit:'clubs'}];ex.required={rank:'10',suit:'spades'};ex.pots.black10=7;const before=p.score;
 let pub=extraPublicState(r,p);const action=pub.actions.find(a=>a.action==='prairiePlay'&&a.args.cardId===special.id);assert.ok(action);
 extraGameAction(r,p,action);pub=extraPublicState(r,p);
 assert.equal(p.score,before+7);assert.equal(pub.lastAward.amount,7);assert.match(pub.message,/claimed 7 chips/);assert.equal(pub.chipTotals[p.id],p.score);
});

test('W12 Prairie Pots UI exposes current chip totals and win messages',async()=>{
 const {app,css}=await files();
 assert.match(app,/prairie-status-banner/);assert.match(app,/CHIP TOTALS/);assert.match(app,/lastAward/);assert.match(css,/prairie-chip-score/);
});
