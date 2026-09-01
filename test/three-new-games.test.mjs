import test from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import { GAME_TYPES } from '../gameEngine.mjs';
import { extraDefaults, startExtraGame, extraPublicState, extraGameAction } from '../extraGames.mjs';
import { createDouble12Set, createSkipBoDeck, bgLegalSequences } from '../threeNewGames.mjs';

const player=(i)=>({id:`p${i}`,token:`t${i}`,name:`Player ${i}`,avatar:i===1?'john':'kristen',variant:0,outfitVariant:0,color:i===1?'#9b3e3a':'#2f6b4f',seat:i-1,ready:true,connected:true,isBot:false,botDifficulty:null,bid:null,tricks:0,score:0,continued:false,hand:[],eliminated:false});
function room(type,n,settings={}){
  const players=new Map(Array.from({length:n},(_,i)=>{const p=player(i+1);return[p.id,p]}));
  return {id:crypto.randomUUID(),gameType:type,settings:{...extraDefaults(type),...settings},players,game:{phase:'lobby',history:[],schedule:[],winnerIds:[],extra:null}};
}
const act=(r,p,a)=>extraGameAction(r,p,a);

// Mexican Train

test('Mexican Train creates one complete unique Double-12 set',()=>{
  const set=createDouble12Set();
  assert.equal(set.length,91);
  assert.equal(new Set(set.map(d=>`${d.a}-${d.b}`)).size,91);
  assert.ok(set.some(d=>d.a===0&&d.b===0));
  assert.ok(set.some(d=>d.a===12&&d.b===12));
  assert.ok(set.every(d=>d.a<=d.b));
});

for(const [players,expected] of [[2,15],[5,12],[8,11]])test(`Mexican Train deals ${expected} private tiles to ${players} players`,()=>{
  const r=room(GAME_TYPES.MEXICAN_TRAIN,players);startExtraGame(r);
  for(const p of r.players.values())assert.equal(p.hand.length,expected);
  const ids=[...r.players.keys()],pub=extraPublicState(r,r.players.get(ids[0]));
  assert.equal(pub.hand.length,expected);
  assert.equal(pub.handCounts[ids[1]],expected);
  assert.equal('hands' in pub,false);
});

test('Mexican Train engine search draws once, passes, then accepts the highest double',()=>{
  const r=room(GAME_TYPES.MEXICAN_TRAIN,2);startExtraGame(r);const ex=r.game.extra;
  const first=r.players.get(ex.turnPlayerId),second=r.players.get([...r.players.keys()].find(id=>id!==first.id));
  first.hand=[{id:'a',a:1,b:2}];ex.boneyard=[{id:'draw',a:3,b:4}];
  let pub=extraPublicState(r,first),draw=pub.actions.find(a=>a.action==='mtDraw');assert.ok(draw);act(r,first,draw);
  pub=extraPublicState(r,first);const pass=pub.actions.find(a=>a.action==='mtPass');assert.ok(pass);act(r,first,pass);
  assert.equal(ex.phase,'engine');assert.equal(ex.turnPlayerId,second.id);
  second.hand=[{id:'d55',a:5,b:5},{id:'d88',a:8,b:8},{id:'x',a:8,b:2}];
  pub=extraPublicState(r,second);const engine=pub.actions.find(a=>a.action==='mtSetEngine');assert.equal(engine.args.tileId,'d88');act(r,second,engine);
  assert.equal(ex.engine,8);assert.equal(ex.phase,'opening');assert.equal(ex.engineTile.a,8);
});

test('Mexican Train uses family open-train state and forces a double to be closed',()=>{
  const r=room(GAME_TYPES.MEXICAN_TRAIN,2);startExtraGame(r);const ex=r.game.extra,ids=[...r.players.keys()],p=r.players.get(ids[0]);
  ex.engine=6;ex.engineTile={id:'e',a:6,b:6};ex.phase='playing';ex.turnPlayerId=p.id;ex.boneyard=[];
  for(const id of ids){ex.trains[id].openEnd=8;ex.trains[id].open=false}
  ex.mexican.openEnd=6;p.hand=[{id:'dbl',a:8,b:8},{id:'close',a:8,b:3},{id:'remain',a:6,b:2}];
  let pub=extraPublicState(r,p),dbl=pub.actions.find(a=>a.action==='mtPlay'&&a.args.tileId==='dbl'&&a.args.trainId===p.id);assert.ok(dbl);act(r,p,dbl);
  assert.deepEqual(ex.unresolvedDouble,{trainId:p.id,value:8,playerId:p.id});assert.equal(ex.turnPlayerId,p.id);
  pub=extraPublicState(r,p);const close=pub.actions.find(a=>a.action==='mtPlay'&&a.args.tileId==='close');assert.ok(close);act(r,p,close);
  assert.equal(ex.unresolvedDouble,null);assert.notEqual(ex.turnPlayerId,p.id);
  const q=r.players.get(ex.turnPlayerId);q.hand=[{id:'blocked',a:11,b:12}];ex.boneyard=[];
  pub=extraPublicState(r,q);const pass=pub.actions.find(a=>a.action==='mtPass');assert.ok(pass);act(r,q,pass);
  assert.equal(ex.trains[q.id].open,true);
});

test('Mexican Train ends the third round with the lowest cumulative score',()=>{
  const r=room(GAME_TYPES.MEXICAN_TRAIN,2);startExtraGame(r);const ex=r.game.extra,ids=[...r.players.keys()],p=r.players.get(ids[0]),q=r.players.get(ids[1]);
  ex.round=3;ex.phase='playing';ex.engine=6;ex.turnPlayerId=p.id;ex.trains[p.id].openEnd=6;ex.trains[q.id].openEnd=6;p.score=4;q.score=10;p.hand=[{id:'last',a:6,b:1}];q.hand=[{id:'q1',a:12,b:12}];
  const play=extraPublicState(r,p).actions.find(a=>a.action==='mtPlay'&&a.args.tileId==='last');assert.ok(play);act(r,p,play);
  assert.equal(r.game.phase,'gameOver');assert.deepEqual(r.game.winnerIds,[p.id]);assert.equal(p.score,4);assert.equal(q.score,34);
});

// Skip-Bo

test('Skip-Bo deck contains 162 cards with 12 of each number and 18 Wilds',()=>{
  const deck=createSkipBoDeck();assert.equal(deck.length,162);assert.equal(deck.filter(c=>c.wild).length,18);
  for(let n=1;n<=12;n++)assert.equal(deck.filter(c=>c.rank===n).length,12);
  assert.equal(new Set(deck.map(c=>c.id)).size,162);
});

test('Skip-Bo keeps hands and future Stock cards private while exposing public pile tops',()=>{
  const r=room(GAME_TYPES.SKIP_BO,3,{stockSize:10});startExtraGame(r);const ex=r.game.extra,ids=[...r.players.keys()],p=r.players.get(ids[0]),q=r.players.get(ids[1]);
  act(r,p,extraPublicState(r,p).actions.find(a=>a.action==='sbDraw'));
  const pub=extraPublicState(r,p);assert.equal(pub.hand.length,5);assert.equal(pub.stocks[p.id].count,10);assert.ok(pub.stocks[q.id].top);assert.equal(pub.stocks[q.id].count,10);assert.equal('future' in pub.stocks[q.id],false);assert.equal('opponentHands' in pub,false);
});

test('Skip-Bo builds 1 through 12, uses Wild as the needed value and clears completed piles',()=>{
  const r=room(GAME_TYPES.SKIP_BO,2,{stockSize:10});startExtraGame(r);const ex=r.game.extra,p=r.players.get(ex.turnPlayerId);ex.phase='play';
  p.hand=[{id:'one',rank:1,wild:false},{id:'two',rank:2,wild:false},{id:'wild',rank:'WILD',wild:true}];
  for(const id of ['one','two','wild']){const a=extraPublicState(r,p).actions.find(x=>x.action==='sbPlay'&&x.args.source?.cardId===id&&x.args.pile===0);assert.ok(a);act(r,p,a)}
  assert.deepEqual(ex.builds[0].map(c=>c.value),[1,2,3]);
  ex.builds[0]=Array.from({length:11},(_,i)=>({id:`b${i+1}`,rank:i+1,wild:false,value:i+1}));p.hand=[{id:'twelve',rank:12,wild:false}];
  const finishPile=extraPublicState(r,p).actions.find(x=>x.action==='sbPlay'&&x.args.source?.cardId==='twelve'&&x.args.pile===0);assert.ok(finishPile);act(r,p,finishPile);
  assert.equal(ex.builds[0].length,0);assert.equal(ex.recycle.length,12);
});

test('Skip-Bo immediately refills an emptied hand and wins when the final Stock card is played',()=>{
  const r=room(GAME_TYPES.SKIP_BO,2,{stockSize:10});startExtraGame(r);const ex=r.game.extra,p=r.players.get(ex.turnPlayerId);ex.phase='play';ex.builds=[[],[],[],[]];
  p.hand=[{id:'hand1',rank:1,wild:false}];
  let a=extraPublicState(r,p).actions.find(x=>x.action==='sbPlay'&&x.args.source?.cardId==='hand1');assert.ok(a);act(r,p,a);assert.equal(p.hand.length,5);
  ex.builds=[[],[],[],[]];ex.stocks[p.id]=[{id:'stock-last',rank:1,wild:false}];
  a=extraPublicState(r,p).actions.find(x=>x.action==='sbPlay'&&x.args.source?.kind==='stock');assert.ok(a);act(r,p,a);
  assert.equal(r.game.phase,'gameOver');assert.deepEqual(r.game.winnerIds,[p.id]);
});

test('Skip-Bo has four public Discard Piles and discarding ends the turn',()=>{
  const r=room(GAME_TYPES.SKIP_BO,2,{stockSize:10});startExtraGame(r);const ex=r.game.extra,p=r.players.get(ex.turnPlayerId);act(r,p,extraPublicState(r,p).actions.find(a=>a.action==='sbDraw'));
  const before=ex.turnPlayerId,card=p.hand[0],discard=extraPublicState(r,p).actions.find(a=>a.action==='sbDiscard'&&a.args.cardId===card.id&&a.args.pile===3);assert.ok(discard);act(r,p,discard);
  assert.equal(ex.discards[p.id].length,4);assert.equal(ex.discards[p.id][3].at(-1).id,card.id);assert.notEqual(ex.turnPlayerId,before);assert.equal(ex.phase,'draw');
});

test('Skip-Bo rejects the impossible 30-card Stock setting for 5-6 players',()=>{
  const r=room(GAME_TYPES.SKIP_BO,5,{stockSize:30});assert.throws(()=>startExtraGame(r),/2-4 players/);
});

// Backgammon

test('Backgammon starts with exactly 15 mirrored checkers per player',()=>{
  const r=room(GAME_TYPES.BACKGAMMON,2);startExtraGame(r);const ex=r.game.extra,ids=[...r.players.keys()];
  assert.equal(ex.points[ids[0]].reduce((a,b)=>a+b,0),15);assert.equal(ex.points[ids[1]].reduce((a,b)=>a+b,0),15);
  assert.equal(ex.points[ids[0]][23],2);assert.equal(ex.points[ids[0]][12],5);assert.equal(ex.points[ids[0]][7],3);assert.equal(ex.points[ids[0]][5],5);
  assert.equal(ex.points[ids[1]][0],2);assert.equal(ex.points[ids[1]][11],5);assert.equal(ex.points[ids[1]][16],3);assert.equal(ex.points[ids[1]][18],5);
});

test('Backgammon opening roll chooses the higher player and uses both opening values',()=>{
  const r=room(GAME_TYPES.BACKGAMMON,2);startExtraGame(r);const ex=r.game.extra,p=r.players.get(ex.turnPlayerId),ids=[...r.players.keys()];
  act(r,p,{action:'bgOpeningRoll'});
  assert.equal(ex.phase,'playing');assert.equal(ex.dice.length,2);assert.notEqual(ex.dice[0],ex.dice[1]);assert.deepEqual(new Set(Object.values(ex.openingRoll)),new Set(ex.dice));
  const expected=ex.openingRoll[ids[0]]>ex.openingRoll[ids[1]]?ids[0]:ids[1];assert.equal(ex.turnPlayerId,expected);
});

test('Backgammon legal sequence generation enforces Bar priority and blocked entry',()=>{
  const r=room(GAME_TYPES.BACKGAMMON,2);startExtraGame(r);const ex=r.game.extra,ids=[...r.players.keys()],p=ids[0],q=ids[1];
  ex.phase='playing';ex.turnPlayerId=p;ex.bar[p]=1;ex.points[p]=Array(24).fill(0);ex.points[q]=Array(24).fill(0);ex.points[q][23]=1;ex.dice=[1];
  let seqs=bgLegalSequences(ex,r,p);assert.ok(seqs.length);assert.ok(seqs.every(s=>s[0].from==='bar'&&s[0].to===23));
  ex.points[q][23]=2;seqs=bgLegalSequences(ex,r,p);assert.ok(seqs.every(s=>s.length===0)||seqs.length===0);
});

test('Backgammon hits a blot and sends it to the Bar',()=>{
  const r=room(GAME_TYPES.BACKGAMMON,2);startExtraGame(r);const ex=r.game.extra,ids=[...r.players.keys()],p=r.players.get(ids[0]),q=ids[1];
  ex.phase='playing';ex.turnPlayerId=p.id;ex.dice=[1];ex.bar[p.id]=0;ex.points[p.id]=Array(24).fill(0);ex.points[q]=Array(24).fill(0);ex.points[p.id][5]=1;ex.points[q][4]=1;
  const move=extraPublicState(r,p).actions.find(a=>a.action==='bgMove'&&a.args.from===5&&a.args.to===4);assert.ok(move);act(r,p,move);
  assert.equal(ex.points[q][4],0);assert.equal(ex.bar[q],1);assert.equal(ex.points[p.id][4],1);
});

test('Backgammon bears off only from a legal all-home position',()=>{
  const r=room(GAME_TYPES.BACKGAMMON,2);startExtraGame(r);const ex=r.game.extra,ids=[...r.players.keys()],p=r.players.get(ids[0]);
  ex.phase='playing';ex.turnPlayerId=p.id;ex.dice=[1];ex.points[p.id]=Array(24).fill(0);ex.points[p.id][0]=15;ex.bar[p.id]=0;
  const move=extraPublicState(r,p).actions.find(a=>a.action==='bgMove'&&a.args.from===0&&a.args.to==='off');assert.ok(move);act(r,p,move);assert.equal(ex.off[p.id],1);
});

test('Backgammon doubling cube supports accept, beaver and decline outcomes',()=>{
  const r=room(GAME_TYPES.BACKGAMMON,2,{beavers:true});startExtraGame(r);const ex=r.game.extra,ids=[...r.players.keys()],p=r.players.get(ids[0]),q=r.players.get(ids[1]);ex.phase='playing';ex.turnPlayerId=p.id;ex.dice=null;
  act(r,p,{action:'bgOfferDouble'});let pub=extraPublicState(r,q);assert.ok(pub.actions.some(a=>a.action==='bgBeaver'));act(r,q,{action:'bgBeaver'});assert.equal(ex.cube,4);assert.equal(ex.cubeOwner,q.id);
  ex.turnPlayerId=q.id;ex.dice=null;act(r,q,{action:'bgOfferDouble'});pub=extraPublicState(r,p);assert.ok(pub.actions.some(a=>a.action==='bgDeclineDouble'));act(r,p,{action:'bgDeclineDouble'});assert.equal(r.game.phase,'gameOver');assert.deepEqual(r.game.winnerIds,[q.id]);assert.equal(ex.result.kind,'declined double');
});

test('Three new games expose their visual table, tutorial and responsive gesture contracts',async()=>{
  const {readFile}=await import('node:fs/promises');
  const app=await readFile(new URL('../public/app.js',import.meta.url),'utf8'),css=await readFile(new URL('../public/styles.css',import.meta.url),'utf8');
  for(const token of ['mexicanTrainBoard','skipBoBoard','backgammonBoard','bindThreeNewBoardGestures','GAME.MEXICAN_TRAIN','GAME.SKIP_BO','GAME.BACKGAMMON'])assert.match(app,new RegExp(token.replaceAll('.','\\.')));
  for(const token of ['mexican-train-table','domino-tile','skipbo-table','skipbo-builds','backgammon-table','bg-board','three-new-viewport'])assert.match(css,new RegExp(token));
  assert.match(app,/Mexican Train.*Set the engine/s);assert.match(app,/Skip-Bo.*Read the whole table/s);assert.match(app,/Backgammon.*Read the physical board/s);
});
