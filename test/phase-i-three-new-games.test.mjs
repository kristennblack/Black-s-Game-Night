import test from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import { GAME_TYPES } from '../gameEngine.mjs';
import { EXTRA_META, extraDefaults, startExtraGame, extraPublicState, extraGameAction } from '../extraGames.mjs';
import { createDouble12Set, createSkipBoDeck, bgLegalSequences } from '../threeNewGames.mjs';

const player=(i)=>({
  id:`p${i}`,token:`t${i}`,name:`Player ${i}`,avatar:i===1?'john':'cowboy',variant:0,outfitVariant:0,
  color:['#b94848','#4269aa','#4c8c59','#d49b35','#8055a8','#2d9292','#d6688b','#69533e'][i-1]||'#2f6b4f',
  seat:i-1,ready:true,connected:true,bid:null,tricks:0,score:0,continued:false,hand:[],eliminated:false
});
function room(type,n,settings={}){
  const ps=new Map(Array.from({length:n},(_,i)=>{const p=player(i+1);return[p.id,p]}));
  return {id:crypto.randomUUID(),gameType:type,settings:{...extraDefaults(type),...settings},players:ps,game:{phase:'lobby',history:[],schedule:[],winnerIds:[],extra:null}};
}
const ids=r=>[...r.players.keys()];
const clearBg=(ex,ids)=>{for(const id of ids){ex.points[id]=Array(24).fill(0);ex.bar[id]=0;ex.off[id]=0}}

test('three new games are exposed with the requested player ranges',()=>{
  assert.deepEqual([EXTRA_META[GAME_TYPES.MEXICAN_TRAIN].min,EXTRA_META[GAME_TYPES.MEXICAN_TRAIN].max],[2,8]);
  assert.deepEqual([EXTRA_META[GAME_TYPES.SKIP_BO].min,EXTRA_META[GAME_TYPES.SKIP_BO].max],[2,6]);
  assert.deepEqual([EXTRA_META[GAME_TYPES.BACKGAMMON].min,EXTRA_META[GAME_TYPES.BACKGAMMON].max],[2,2]);
});

test('Mexican Train uses a complete unique Double-12 set',()=>{
  const set=createDouble12Set();
  assert.equal(set.length,91);
  assert.equal(new Set(set.map(d=>`${d.a}-${d.b}`)).size,91);
  assert.ok(set.some(d=>d.a===0&&d.b===0));
  assert.ok(set.some(d=>d.a===12&&d.b===12));
  assert.ok(set.every(d=>d.a<=d.b));
});

test('Mexican Train deals the supplied rack sizes and keeps opponent racks private',()=>{
  for(const [n,count] of [[2,15],[4,15],[5,12],[6,12],[7,11],[8,11]]){
    const r=room(GAME_TYPES.MEXICAN_TRAIN,n);startExtraGame(r);
    for(const p of r.players.values())assert.equal(p.hand.length,count,`${n} players`);
    const [me,other]=[...r.players.values()];
    const mine=extraPublicState(r,me),theirs=extraPublicState(r,other);
    assert.equal(mine.hand.length,count);
    assert.equal(theirs.hand.length,count);
    assert.equal(mine.handCounts[other.id],count);
    assert.equal('opponentHands' in mine,false);
  }
});

test('Mexican Train requires the current player to use their highest double as the engine',()=>{
  const r=room(GAME_TYPES.MEXICAN_TRAIN,3);startExtraGame(r);const ex=r.game.extra,p=r.players.get(ex.turnPlayerId);
  p.hand=[{id:'d55',a:5,b:5},{id:'d1212',a:12,b:12},{id:'d29',a:2,b:9}];ex.boneyard=[];
  const pub=extraPublicState(r,p);assert.deepEqual(pub.actions.map(a=>a.args?.tileId).filter(Boolean),['d1212']);
  extraGameAction(r,p,pub.actions[0]);
  assert.equal(ex.engine,12);assert.equal(ex.phase,'opening');assert.equal(p.hand.some(d=>d.id==='d1212'),false);
});

test('Mexican Train opens a private train after a failed opening draw/pass',()=>{
  const r=room(GAME_TYPES.MEXICAN_TRAIN,3);startExtraGame(r);let ex=r.game.extra,p=r.players.get(ex.turnPlayerId);
  p.hand=[{id:'engine',a:6,b:6}];extraGameAction(r,p,{action:'mtSetEngine',args:{tileId:'engine'}});
  ex=r.game.extra;p=r.players.get(ex.turnPlayerId);p.hand=[{id:'miss',a:1,b:2}];ex.boneyard=[];ex.drawnThisTurn=true;
  const pass=extraPublicState(r,p).actions.find(a=>a.action==='mtPass');assert.ok(pass);extraGameAction(r,p,pass);
  assert.equal(ex.trains[p.id].open,true);assert.notEqual(ex.turnPlayerId,p.id);
});

test('Mexican Train doubles create a forced closure obligation on that train',()=>{
  const r=room(GAME_TYPES.MEXICAN_TRAIN,3);startExtraGame(r);const ex=r.game.extra,p=r.players.get(ex.turnPlayerId);
  ex.phase='playing';ex.engine=6;ex.turnPlayerId=p.id;ex.trains[p.id].openEnd=8;ex.mexican.openEnd=9;
  p.hand=[{id:'dbl8',a:8,b:8},{id:'close8',a:8,b:5},{id:'mex9',a:9,b:1}];
  extraGameAction(r,p,{action:'mtPlay',args:{tileId:'dbl8',trainId:p.id}});
  assert.deepEqual(ex.unresolvedDouble,{trainId:p.id,value:8,playerId:p.id});assert.equal(ex.turnPlayerId,p.id);
  const plays=extraPublicState(r,p).actions.filter(a=>a.action==='mtPlay');
  assert.ok(plays.some(a=>a.args.tileId==='close8'&&a.args.trainId===p.id));
  assert.equal(plays.some(a=>a.args.tileId==='mex9'),false);
});

test('Mexican Train completes three rounds by lowest cumulative pip score',()=>{
  const r=room(GAME_TYPES.MEXICAN_TRAIN,2);startExtraGame(r);const [a,b]=[...r.players.values()],ex=r.game.extra;
  ex.phase='playing';ex.round=3;ex.engine=1;ex.turnPlayerId=a.id;ex.trains[a.id].openEnd=1;a.score=4;b.score=20;
  a.hand=[{id:'last',a:1,b:2}];b.hand=[{id:'ten',a:5,b:5}];
  extraGameAction(r,a,{action:'mtPlay',args:{tileId:'last',trainId:a.id}});
  assert.equal(r.game.phase,'gameOver');assert.deepEqual(r.game.winnerIds,[a.id]);assert.equal(a.score,4);assert.equal(b.score,30);
});

test('Skip-Bo deck contains 162 cards with 12 of each number and 18 Wilds',()=>{
  const deck=createSkipBoDeck();assert.equal(deck.length,162);
  for(let n=1;n<=12;n++)assert.equal(deck.filter(c=>c.rank===n).length,12);
  assert.equal(deck.filter(c=>c.wild).length,18);assert.equal(new Set(deck.map(c=>c.id)).size,162);
});

test('Skip-Bo creates private Stock piles, four Discard piles and four Building piles',()=>{
  const r=room(GAME_TYPES.SKIP_BO,4,{stockSize:20});startExtraGame(r);const ex=r.game.extra,[me,other]=[...r.players.values()];
  assert.equal(ex.stocks[me.id].length,20);assert.equal(ex.discards[me.id].length,4);assert.equal(ex.builds.length,4);
  const pub=extraPublicState(r,me);assert.equal(pub.stocks[other.id].count,20);assert.ok(pub.stocks[other.id].top);
  assert.equal(pub.hand.length,0);assert.equal('stockCards' in pub.stocks[other.id],false);
});

test('Skip-Bo draws to five and immediately refills after emptying a hand mid-turn',()=>{
  const r=room(GAME_TYPES.SKIP_BO,2,{stockSize:10});startExtraGame(r);const ex=r.game.extra,p=r.players.get(ex.turnPlayerId);
  extraGameAction(r,p,{action:'sbDraw'});assert.equal(p.hand.length,5);assert.equal(ex.phase,'play');
  // Make a deterministic one-card hand that can start an empty Building Pile.
  p.hand=[{id:'one',rank:1,wild:false}];ex.drawPile.push(...Array.from({length:5},(_,i)=>({id:`ref${i}`,rank:7,wild:false})));
  extraGameAction(r,p,{action:'sbPlay',args:{source:{kind:'hand',cardId:'one'},pile:0}});
  assert.equal(p.hand.length,5);assert.equal(ex.builds[0].at(-1).value,1);assert.equal(ex.turnPlayerId,p.id);
});

test('Skip-Bo plays from Stock, exposes the next top, and wins when Stock is cleared',()=>{
  const r=room(GAME_TYPES.SKIP_BO,2,{stockSize:10});startExtraGame(r);const ex=r.game.extra,p=r.players.get(ex.turnPlayerId);
  ex.phase='play';p.hand=[{id:'h9',rank:9,wild:false}];ex.stocks[p.id]=[{id:'stock1',rank:1,wild:false}];ex.builds=[[],[],[],[]];
  const pub=extraPublicState(r,p);const play=pub.actions.find(a=>a.action==='sbPlay'&&a.args.source.kind==='stock');assert.ok(play);
  extraGameAction(r,p,play);assert.equal(r.game.phase,'gameOver');assert.deepEqual(r.game.winnerIds,[p.id]);
});

test('Skip-Bo Wilds represent the required number and completed 1-12 piles recycle',()=>{
  const r=room(GAME_TYPES.SKIP_BO,2,{stockSize:10});startExtraGame(r);const ex=r.game.extra,p=r.players.get(ex.turnPlayerId);
  ex.phase='play';ex.builds[0]=Array.from({length:11},(_,i)=>({id:`b${i+1}`,rank:i+1,wild:false,value:i+1}));
  p.hand=[{id:'wild12',rank:'WILD',wild:true},{id:'keep',rank:4,wild:false}];
  extraGameAction(r,p,{action:'sbPlay',args:{source:{kind:'hand',cardId:'wild12'},pile:0}});
  assert.equal(ex.builds[0].length,0);assert.equal(ex.recycle.length,12);assert.equal(p.hand.length,1);
});

test('Skip-Bo discarding to one of four piles ends the turn and keeps public top visible',()=>{
  const r=room(GAME_TYPES.SKIP_BO,2,{stockSize:10});startExtraGame(r);const ex=r.game.extra,p=r.players.get(ex.turnPlayerId),nxt=ids(r).find(id=>id!==p.id);
  ex.phase='play';p.hand=[{id:'discard7',rank:7,wild:false}];
  extraGameAction(r,p,{action:'sbDiscard',args:{cardId:'discard7',pile:2}});
  assert.equal(ex.discards[p.id][2].at(-1).id,'discard7');assert.equal(ex.turnPlayerId,nxt);assert.equal(ex.phase,'draw');
  const other=r.players.get(nxt),pub=extraPublicState(r,other);assert.equal(pub.discards[p.id][2].top.rank,7);
});

test('Backgammon starts with the standard mirrored 15-checker setup',()=>{
  const r=room(GAME_TYPES.BACKGAMMON,2);startExtraGame(r);const ex=r.game.extra,[a,b]=ids(r);
  assert.equal(ex.points[a].reduce((x,y)=>x+y,0),15);assert.equal(ex.points[b].reduce((x,y)=>x+y,0),15);
  assert.deepEqual([ex.points[a][23],ex.points[a][12],ex.points[a][7],ex.points[a][5]],[2,5,3,5]);
  assert.deepEqual([ex.points[b][0],ex.points[b][11],ex.points[b][16],ex.points[b][18]],[2,5,3,5]);
});

test('Backgammon legal-sequence engine enforces the larger die when only one can be used',()=>{
  const r=room(GAME_TYPES.BACKGAMMON,2);startExtraGame(r);const ex=r.game.extra,[a,b]=ids(r);clearBg(ex,[a,b]);
  ex.bar[a]=1;ex.points[b][13]=2;
  const seqs=bgLegalSequences(ex,r,a,[5,6]);assert.ok(seqs.length);assert.ok(seqs.every(s=>s.length===1));assert.ok(seqs.every(s=>s[0].die===6));
});

test('Backgammon forces bar entry before any other checker movement',()=>{
  const r=room(GAME_TYPES.BACKGAMMON,2);startExtraGame(r);const ex=r.game.extra,[a,b]=ids(r);clearBg(ex,[a,b]);
  ex.bar[a]=1;ex.points[a][23]=1;const seqs=bgLegalSequences(ex,r,a,[1]);assert.ok(seqs.length);assert.ok(seqs.every(s=>s[0].from==='bar'));
});

test('Backgammon hitting moves a blot to the bar',()=>{
  const r=room(GAME_TYPES.BACKGAMMON,2);startExtraGame(r);const ex=r.game.extra,[a,b]=ids(r),p=r.players.get(a);clearBg(ex,[a,b]);
  ex.phase='playing';ex.turnPlayerId=a;ex.dice=[1];ex.points[a][6]=1;ex.points[b][5]=1;
  const move=extraPublicState(r,p).actions.find(x=>x.action==='bgMove'&&x.args.from===6&&x.args.to===5);assert.ok(move);extraGameAction(r,p,move);
  assert.equal(ex.bar[b],1);assert.equal(ex.points[a][5],1);assert.equal(ex.points[b][5],0);
});

test('Backgammon allows exact and oversized bearing off only after all checkers are home',()=>{
  const r=room(GAME_TYPES.BACKGAMMON,2);startExtraGame(r);const ex=r.game.extra,[a,b]=ids(r);clearBg(ex,[a,b]);
  ex.points[a][1]=15;let seqs=bgLegalSequences(ex,r,a,[2]);assert.ok(seqs.some(s=>s[0].from===1&&s[0].to==='off'));
  clearBg(ex,[a,b]);ex.points[a][0]=15;seqs=bgLegalSequences(ex,r,a,[6]);assert.ok(seqs.some(s=>s[0].from===0&&s[0].to==='off'));
  ex.points[a][10]=1;seqs=bgLegalSequences(ex,r,a,[6]);assert.equal(seqs.some(s=>s[0]?.to==='off'),false);
});

test('Backgammon doubling cube can be offered, accepted, owned, and declined',()=>{
  const r=room(GAME_TYPES.BACKGAMMON,2);startExtraGame(r);const ex=r.game.extra,[a,b]=ids(r),pa=r.players.get(a),pb=r.players.get(b);
  ex.phase='playing';ex.turnPlayerId=a;ex.dice=null;
  extraGameAction(r,pa,{action:'bgOfferDouble'});assert.equal(ex.phase,'doubleOffer');assert.equal(ex.pendingDouble.targetId,b);
  extraGameAction(r,pb,{action:'bgAcceptDouble'});assert.equal(ex.cube,2);assert.equal(ex.cubeOwner,b);assert.equal(ex.phase,'playing');
  // Put the turn on the cube owner and verify a legal redouble can be declined.
  ex.turnPlayerId=b;ex.dice=null;extraGameAction(r,pb,{action:'bgOfferDouble'});extraGameAction(r,pa,{action:'bgDeclineDouble'});
  assert.equal(r.game.phase,'gameOver');assert.deepEqual(r.game.winnerIds,[b]);assert.equal(ex.result.points,2);
});

test('Backgammon identifies a backgammon and applies cube multiplier',()=>{
  const r=room(GAME_TYPES.BACKGAMMON,2);startExtraGame(r);const ex=r.game.extra,[a,b]=ids(r),p=r.players.get(a);clearBg(ex,[a,b]);
  ex.phase='playing';ex.turnPlayerId=a;ex.dice=[1];ex.off[a]=14;ex.points[a][0]=1;ex.bar[b]=1;ex.cube=2;
  const move=extraPublicState(r,p).actions.find(x=>x.action==='bgMove'&&x.args.to==='off');assert.ok(move);extraGameAction(r,p,move);
  assert.equal(r.game.phase,'gameOver');assert.equal(ex.result.kind,'backgammon');assert.equal(ex.result.points,6);
});

test('new-game UI includes the three shelves, physical table components, settings and guided demos',()=>{
  const app=fs.readFileSync(new URL('../public/app.js',import.meta.url),'utf8');
  const css=fs.readFileSync(new URL('../public/styles.css',import.meta.url),'utf8');
  for(const text of ['Mexican Train','Skip-Bo','Backgammon','Double-12','Stock Pile','doubling cube'])assert.match(app,new RegExp(text,'i'));
  for(const klass of ['mt-station','domino-tile','skipbo-table','skipbo-stock','bg-board','bg-checker-stack','die','bg-cube'])assert.match(css,new RegExp(`\\.${klass}`));
  assert.match(app,/tutorialCatalog/);assert.match(app,/mexicantrain:/);assert.match(app,/skipbo:/);assert.match(app,/backgammon:/);
});
