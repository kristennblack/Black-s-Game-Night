import test from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import {readFile} from 'node:fs/promises';
import {GAME_TYPES} from '../gameEngine.mjs';
import {extraDefaults,startExtraGame,extraPublicState,extraGameAction} from '../extraGames.mjs';

const player=i=>({id:`p${i}`,token:`t${i}`,name:`Player ${i}`,avatar:i===1?'john':'kristen',variant:0,outfitVariant:0,color:'#2f6b4f',seat:i-1,ready:true,connected:true,bid:null,tricks:0,score:0,continued:false,hand:[],eliminated:false});
function cribRoom(settings={}){
  const ps=new Map([["p1",player(1)],["p2",player(2)]]);
  return {id:crypto.randomUUID(),gameType:GAME_TYPES.CRIBBAGE,settings:{...extraDefaults(GAME_TYPES.CRIBBAGE),...settings},players:ps,game:{phase:'lobby',history:[],schedule:[],winnerIds:[],extra:null}};
}

test('v1.2.3 Cribbage exposes every pegging card with owner, running total and scoring reason',()=>{
  const r=cribRoom(); startExtraGame(r); const ex=r.game.extra,[p1,p2]=[...r.players.values()];
  ex.phase='pegging'; ex.turnPlayerId=p1.id; ex.pegTotal=0; ex.pegSeq=[]; ex.pegPlays=[]; ex.pegHistory=[]; ex.go=[];
  p1.hand=[{id:'five-a',rank:'5',suit:'clubs'},{id:'nine-a',rank:'9',suit:'clubs'}];
  p2.hand=[{id:'five-b',rank:'5',suit:'diamonds'},{id:'king-b',rank:'K',suit:'hearts'}];
  extraGameAction(r,p1,{action:'cribPeg',args:{cardId:'five-a'}});
  let seen=extraPublicState(r,p2);
  assert.equal(seen.pegPlays.length,1); assert.equal(seen.pegPlays[0].playerId,p1.id); assert.equal(seen.pegPlays[0].total,5);
  extraGameAction(r,p2,{action:'cribPeg',args:{cardId:'five-b'}});
  seen=extraPublicState(r,p1);
  assert.equal(seen.pegPlays.length,2); assert.equal(seen.pegPlays[1].playerId,p2.id); assert.equal(seen.pegPlays[1].total,10);
  assert.equal(seen.pegPlays[1].points,2); assert.deepEqual(seen.pegPlays[1].why,['pair']);
});

test('v1.2.3 Cribbage counting review returns visible cards and exact highlight indexes for scoring groups',()=>{
  const r=cribRoom({countMode:'auto'}); startExtraGame(r); const ex=r.game.extra,[p1,p2]=[...r.players.values()];
  ex.dealerId=p2.id; ex.phase='pegging'; ex.turnPlayerId=p1.id; ex.pegTotal=0; ex.pegSeq=[]; ex.pegPlays=[]; ex.pegHistory=[]; ex.go=[];
  ex.starter={id:'starter5',rank:'5',suit:'spades'}; ex.crib=[];
  p1.countHand=[{id:'c5',rank:'5',suit:'clubs'},{id:'d5',rank:'5',suit:'diamonds'},{id:'h5',rank:'5',suit:'hearts'},{id:'sj',rank:'J',suit:'spades'}];
  p2.countHand=[{id:'a2',rank:'2',suit:'clubs'},{id:'a3',rank:'3',suit:'clubs'},{id:'a4',rank:'4',suit:'clubs'},{id:'a6',rank:'6',suit:'clubs'}];
  p1.hand=[{id:'last',rank:'A',suit:'clubs'}]; p2.hand=[];
  extraGameAction(r,p1,{action:'cribPeg',args:{cardId:'last'}});
  const pub=extraPublicState(r,p1);
  assert.equal(pub.phase,'counting'); assert.equal(pub.countReview.who,p1.id); assert.equal(pub.countReview.cards.length,4); assert.equal(pub.countReview.starter.id,'starter5');
  assert.ok(pub.countReview.groups.some(g=>g.type==='pair'&&g.indexes.length===2));
  assert.ok(pub.countReview.groups.every(g=>Array.isArray(g.indexes)&&g.indexes.every(i=>i>=0&&i<=4)));
  assert.ok(pub.countReview.score>0);
});

test('v1.2.3 Cribbage UI has persistent crib-send control, visible pegging table and tappable scoring highlights',async()=>{
  const app=await readFile(new URL('../public/app.js',import.meta.url),'utf8');
  const css=await readFile(new URL('../public/styles.css',import.meta.url),'utf8');
  for(const token of ['crib-send-bar','SEND SELECTED CARD','crib-peg-play','RUNNING COUNT','crib-count-review','data-crib-score-group','How the points are made']) assert.ok(app.includes(token),token);
  for(const token of ['.crib-send-bar','.crib-send:not(:disabled)','.crib-peg-play','.crib-score-card.active','.crib-score-group.selected']) assert.ok(css.includes(token),token);
});

test('v1.2.3 Prop Hunt uses one active engine with working setup selectors and redundant movement controls',async()=>{
  const html=await readFile(new URL('../public/new-games.html',import.meta.url),'utf8');
  const js=await readFile(new URL('../public/prop-hunt-3d.js',import.meta.url),'utf8');
  const css=await readFile(new URL('../public/prop-hunt-3d.css',import.meta.url),'utf8');
  assert.equal((html.match(/<script src="\/prop-hunt-3d\.js"><\/script>/g)||[]).length,1);
  assert.doesNotMatch(html,/window\.PropHunt\s*=\s*\{/);
  for(const token of ['ph3Next','ph3-character-card','data-ph3-outfit','data-ph3-move','touchMove','ph3Jump','pointerdown','firstRoundHider:true','MOVE NOW']) assert.ok(js.includes(token),token);
  for(const token of ['.ph3d-dpad','.ph3d-move-status']) assert.ok(css.includes(token),token);
});
