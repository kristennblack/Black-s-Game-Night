import test from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import { GAME_TYPES } from '../gameEngine.mjs';
import { EXTRA_META, extraDefaults, startExtraGame, extraPublicState, extraGameAction } from '../extraGames.mjs';

const player=(i)=>({id:`p${i}`,token:`t${i}`,name:`Player ${i}`,avatar:'cowboy',variant:0,outfitVariant:0,color:'#2f6b4f',seat:i-1,ready:true,connected:true,bid:null,tricks:0,score:0,continued:false,hand:[],eliminated:false});
function room(type,n,settings={}){
  const ps=new Map(Array.from({length:n},(_,i)=>{const p=player(i+1);return[p.id,p]}));
  return {id:crypto.randomUUID(),gameType:type,settings:{...extraDefaults(type),...settings},players:ps,game:{phase:'lobby',history:[],schedule:[],winnerIds:[],extra:null}};
}
const countFor={
 [GAME_TYPES.CAMPFIRE]:3,[GAME_TYPES.TRAIL]:4,[GAME_TYPES.PRAIRIE]:4,[GAME_TYPES.BURN_LOGS]:3,[GAME_TYPES.DECK_SWEEP]:3,
 [GAME_TYPES.CRIBBAGE]:2,[GAME_TYPES.MARBLES]:4,[GAME_TYPES.EUCHRE]:4,[GAME_TYPES.THIRTY_ONE]:3,[GAME_TYPES.GOLF]:3,
 [GAME_TYPES.CRAZY_EIGHTS]:3,[GAME_TYPES.MITTS]:4,[GAME_TYPES.POKER]:4,[GAME_TYPES.PRESIDENT]:4,[GAME_TYPES.LAST_HAVEN]:3
};
for(const [type,meta] of Object.entries(EXTRA_META)){
  test(`${meta.name} starts and returns private public state`,()=>{
    const r=room(type,countFor[type]||meta.min);
    startExtraGame(r);
    assert.ok(r.game.extra);
    const p=[...r.players.values()][0];
    const pub=extraPublicState(r,p);
    assert.equal(pub.type,type);
    assert.ok(Array.isArray(pub.actions));
    if('hand' in pub) assert.ok(Array.isArray(pub.hand));
  });
}

test('Campfire Chaos first legal action works',()=>{
  const r=room(GAME_TYPES.CAMPFIRE,3);startExtraGame(r);const ex=r.game.extra,p=r.players.get(ex.turnPlayerId);const pub=extraPublicState(r,p);assert.ok(pub.actions.length);extraGameAction(r,p,pub.actions[0]);
});
test('31 can draw and discard',()=>{
  const r=room(GAME_TYPES.THIRTY_ONE,3);startExtraGame(r);const ex=r.game.extra,p=r.players.get(ex.turnPlayerId);let a=extraPublicState(r,p).actions.find(x=>x.action==='thirtyDraw');extraGameAction(r,p,a);a=extraPublicState(r,p).actions.find(x=>x.action==='thirtyDiscard');assert.ok(a);extraGameAction(r,p,a);
});
test('Golf can draw and replace',()=>{
  const r=room(GAME_TYPES.GOLF,3);startExtraGame(r);let ex=r.game.extra,p=r.players.get(ex.turnPlayerId);let a=extraPublicState(r,p).actions.find(x=>x.action==='golfDraw');extraGameAction(r,p,a);a=extraPublicState(r,p).actions.find(x=>x.action==='golfReplace');assert.ok(a);extraGameAction(r,p,a);
});
test('Euchre calling action works',()=>{
  const r=room(GAME_TYPES.EUCHRE,4);startExtraGame(r);const ex=r.game.extra,p=r.players.get(ex.callTurnId);const a=extraPublicState(r,p).actions[0];assert.ok(a);extraGameAction(r,p,a);
});
test('Cribbage discards to crib',()=>{
  const r=room(GAME_TYPES.CRIBBAGE,2);startExtraGame(r);const p=[...r.players.values()][0],a=extraPublicState(r,p).actions[0];assert.equal(a.action,'cribDiscard');extraGameAction(r,p,a);
});
test('Trail Trouble deals a persistent private five-card hand',()=>{
  const r=room(GAME_TYPES.TRAIL,4,{teamMode:'teams2'});startExtraGame(r);const p=r.players.get(r.game.extra.turnPlayerId),pub=extraPublicState(r,p);
  assert.equal(p.hand.length,5);assert.equal(pub.hand.length,5);assert.ok(pub.actions.every(a=>a.args?.cardId),'every Trail action is tied to a held card');
  for(const q of r.players.values())assert.equal(q.hand.length,5);
});
test('Marbles & Jokers draws a card',()=>{
  const r=room(GAME_TYPES.MARBLES,4);startExtraGame(r);const p=r.players.get(r.game.extra.turnPlayerId),a=extraPublicState(r,p).actions[0];assert.equal(a.action,'marbleDraw');extraGameAction(r,p,a);
});
test('Burn Logs draws then offers discard or mission actions',()=>{
  const r=room(GAME_TYPES.BURN_LOGS,3);startExtraGame(r);const p=r.players.get(r.game.extra.turnPlayerId);let a=extraPublicState(r,p).actions.find(x=>x.action==='burnDraw');extraGameAction(r,p,a);assert.ok(extraPublicState(r,p).actions.some(x=>x.action==='burnDiscard'));
});
test('Deck Sweep can play a legal starting group',()=>{
  const r=room(GAME_TYPES.DECK_SWEEP,3);startExtraGame(r);const p=r.players.get(r.game.extra.turnPlayerId),a=extraPublicState(r,p).actions[0];assert.equal(a.action,'sweepPlay');extraGameAction(r,p,a);
});
test('Poker first betting action works',()=>{
  const r=room(GAME_TYPES.POKER,4);startExtraGame(r);const p=r.players.get(r.game.extra.turnPlayerId),a=extraPublicState(r,p).actions[0];assert.ok(a.action.startsWith('poker'));extraGameAction(r,p,a);
});
test('Last Haven setup can place a camp and route',()=>{
  const r=room(GAME_TYPES.LAST_HAVEN,3);startExtraGame(r);let ex=r.game.extra,p=r.players.get(ex.turnPlayerId);let a=extraPublicState(r,p).actions.find(x=>x.action==='havenSetupCamp');assert.ok(a);extraGameAction(r,p,a);a=extraPublicState(r,p).actions.find(x=>x.action==='havenSetupRoute');assert.ok(a);extraGameAction(r,p,a);
});

test('Campfire LAST LOG catch window expires after the next player completes a turn',()=>{
  const r=room(GAME_TYPES.CAMPFIRE,3);startExtraGame(r);const ex=r.game.extra,ids=[...r.players.keys()];
  ex.lastLogVulnerable=ids[0];ex.turnPlayerId=ids[1];ex.pendingDraw=1;
  extraGameAction(r,r.players.get(ids[1]),{action:'campDrawPenalty'});
  assert.equal(ex.lastLogVulnerable,null);
});

test('31 recycles the discard pile when stock is exhausted',()=>{
  const r=room(GAME_TYPES.THIRTY_ONE,3);startExtraGame(r);const ex=r.game.extra,p=r.players.get(ex.turnPlayerId);
  ex.discard.push(ex.stock.pop(),ex.stock.pop());ex.stock=[];
  const a=extraPublicState(r,p).actions.find(x=>x.action==='thirtyDraw'&&x.args.source==='stock');assert.ok(a);
  extraGameAction(r,p,a);assert.ok(ex.drawn);assert.ok(ex.stock.length>=0);assert.equal(p.hand.length,4);
});

test('Golf recycles discards and is capped at six players for a 56-card deck',()=>{
  assert.equal(EXTRA_META[GAME_TYPES.GOLF].max,6);
  const r=room(GAME_TYPES.GOLF,3);startExtraGame(r);const ex=r.game.extra,p=r.players.get(ex.turnPlayerId);
  ex.discard.push(ex.stock.pop(),ex.stock.pop());ex.stock=[];
  const a=extraPublicState(r,p).actions.find(x=>x.action==='golfDraw'&&x.args.source==='stock');assert.ok(a);
  extraGameAction(r,p,a);assert.ok(ex.drawn);
});

test('Trail Trouble only wins when all team markers reach the final Home space',()=>{
  const r=room(GAME_TYPES.TRAIL,4,{teamMode:'teams2'});startExtraGame(r);const ex=r.game.extra,ids=[...r.players.keys()],team=[ids[0],ids[2]],p=r.players.get(ids[0]);
  for(const id of team)for(const q of ex.pawns[id]){q.zone='home';q.home=0}
  ex.turnPlayerId=ids[0];p.hand=[{id:'no-move-1',kind:'out',label:'HIT THE TRAIL'}];let pub=extraPublicState(r,p);let discard=pub.actions.find(a=>a.action==='trailDiscardCard');assert.ok(discard);extraGameAction(r,p,discard);
  assert.notEqual(r.game.phase,'gameOver');
  for(const id of team)for(const q of ex.pawns[id]){q.zone='home';q.home=3}
  ex.turnPlayerId=ids[0];p.hand=[{id:'no-move-2',kind:'out',label:'HIT THE TRAIL'}];pub=extraPublicState(r,p);discard=pub.actions.find(a=>a.action==='trailDiscardCard');assert.ok(discard);extraGameAction(r,p,discard);
  assert.equal(r.game.phase,'gameOver');
});

test('President can finish a full round without assigning the turn to a player already out',()=>{
  const r=room(GAME_TYPES.PRESIDENT,4,{roundCount:1});startExtraGame(r);
  for(let i=0;i<1000&&r.game.phase!=='gameOver';i++){
    const ex=r.game.extra,p=r.players.get(ex.turnPlayerId);assert.ok(p,`missing turn player at step ${i}`);
    const actions=extraPublicState(r,p).actions;assert.ok(actions.length,`no President actions at step ${i}`);
    extraGameAction(r,p,actions[0]);
  }
  assert.equal(r.game.phase,'gameOver');
});

test('Poker all-ins automatically run out the board instead of hanging between streets',()=>{
  const r=room(GAME_TYPES.POKER,4,{mode:'tournament',startingChips:100,smallBlind:5,bigBlind:10});startExtraGame(r);
  for(let i=0;i<20&&!['handResults','gameOver'].includes(r.game.extra.phase);i++){
    const ex=r.game.extra,p=r.players.get(ex.turnPlayerId);const actions=extraPublicState(r,p).actions;
    const a=actions.find(x=>x.label==='All-In')||actions.find(x=>x.action==='pokerCall')||actions[0];assert.ok(a);extraGameAction(r,p,a);
  }
  assert.ok(['handResults','gameOver'].includes(r.game.extra.phase));assert.equal(r.game.extra.community.length,5);
});

test('Euchre exposes Ace-No-Face redeal to an eligible player',()=>{
  const r=room(GAME_TYPES.EUCHRE,4);startExtraGame(r);const ex=r.game.extra,p=r.players.get(ex.callTurnId);
  p.hand=[0,1,2,3,4].map((i)=>({id:`anf${i}`,rank:i%2?'10':'9',suit:['hearts','clubs','diamonds','spades'][i%4]}));
  assert.ok(extraPublicState(r,p).actions.some(x=>x.action==='euchreRedeal'));
});

test('Last Haven randomizes tiles, includes trading posts, and repeats the seven-warning Raider cycle',()=>{
  const r=room(GAME_TYPES.LAST_HAVEN,3);startExtraGame(r);const ex=r.game.extra;
  assert.ok(ex.board.tradingPosts.length>=6);assert.equal(ex.board.tiles.filter(t=>t.resource==='dead').length,1);
  // Complete snake setup through advertised legal actions.
  for(let i=0;i<20&&ex.phase!=='playing';i++){const p=r.players.get(ex.turnPlayerId),a=extraPublicState(r,p).actions[0];assert.ok(a);extraGameAction(r,p,a)}
  assert.equal(ex.phase,'playing');
  const orig=Math.random;let flip=0;Math.random=()=>((flip++%2)===0?0:0.999999);
  try{
    for(let k=1;k<=6;k++){const p=r.players.get(ex.turnPlayerId);extraGameAction(r,p,{action:'havenRoll'});assert.equal(ex.raiderWarnings,k);assert.equal(ex.phase,'playing');extraGameAction(r,p,{action:'havenEnd'})}
    let p=r.players.get(ex.turnPlayerId);extraGameAction(r,p,{action:'havenRoll'});assert.equal(ex.raiderWarnings,0);assert.equal(ex.phase,'moveRaiders');
    const move=extraPublicState(r,p).actions.find(x=>x.action==='havenRaidMove');assert.ok(move);extraGameAction(r,p,move);extraGameAction(r,p,{action:'havenEnd'});
    p=r.players.get(ex.turnPlayerId);flip=0;extraGameAction(r,p,{action:'havenRoll'});assert.equal(ex.raiderWarnings,1);
  } finally {Math.random=orig}
});

test('Last Haven trade target receives accept and decline actions',()=>{
  const r=room(GAME_TYPES.LAST_HAVEN,3);startExtraGame(r);const ex=r.game.extra,ids=[...r.players.keys()];
  ex.phase='playing';ex.turnPlayerId=ids[0];ex.rolled=true;ex.resources[ids[0]].timber=1;ex.resources[ids[1]].scrap=1;
  extraGameAction(r,r.players.get(ids[0]),{action:'havenOffer',args:{targetId:ids[1],give:'timber',get:'scrap'}});
  const acts=extraPublicState(r,r.players.get(ids[1])).actions;assert.ok(acts.some(x=>x.action==='havenTradeAccept'));assert.ok(acts.some(x=>x.action==='havenTradeDecline'));
  extraGameAction(r,r.players.get(ids[1]),{action:'havenTradeAccept'});assert.equal(ex.resources[ids[0]].scrap,1);assert.equal(ex.resources[ids[1]].timber,1);
});

test('Campfire Chaos only allows drawing when no card is playable',()=>{
  const r=room(GAME_TYPES.CAMPFIRE,3);startExtraGame(r);const ex=r.game.extra,p=r.players.get(ex.turnPlayerId);
  ex.discard=[{id:'top-fire-5',rank:'5',suit:'fire',kind:'number',color:'fire'}];ex.currentColor='fire';ex.pendingDraw=0;ex.drawnCardId=null;
  p.hand=[{id:'playable-fire-2',rank:'2',suit:'fire',kind:'number',color:'fire'},{id:'dead-forest-9',rank:'9',suit:'forest',kind:'number',color:'forest'}];
  const pub=extraPublicState(r,p);assert.ok(pub.actions.some(x=>x.action==='campPlay'));assert.equal(pub.actions.some(x=>x.action==='campDraw'),false);
  assert.throws(()=>extraGameAction(r,p,{action:'campDraw'}),/playable card/);
});

test('Campfire Chaos playable stock draw can be played or kept, but no other card can be substituted',()=>{
  const r=room(GAME_TYPES.CAMPFIRE,3);startExtraGame(r);const ex=r.game.extra,p=r.players.get(ex.turnPlayerId);
  ex.discard=[{id:'top-fire-5',rank:'5',suit:'fire',kind:'number',color:'fire'}];ex.currentColor='fire';ex.pendingDraw=0;ex.drawnCardId=null;
  p.hand=[{id:'dead-forest-9',rank:'9',suit:'forest',kind:'number',color:'forest'}];
  ex.stock=[{id:'draw-fire-7',rank:'7',suit:'fire',kind:'number',color:'fire'}];
  extraGameAction(r,p,{action:'campDraw'});assert.equal(ex.drawnCardId,'draw-fire-7');
  p.hand.push({id:'other-fire-4',rank:'4',suit:'fire',kind:'number',color:'fire'});
  const pub=extraPublicState(r,p);const playIds=pub.actions.filter(x=>x.action==='campPlay').map(x=>x.args.cardId);
  assert.deepEqual([...new Set(playIds)],['draw-fire-7']);assert.ok(pub.actions.some(x=>x.action==='campKeepDraw'));
  assert.throws(()=>extraGameAction(r,p,{action:'campPlay',args:{cardId:'other-fire-4'}}),/only the drawn card/);
});

test('Cribbage treats Ace as low in pegging runs',()=>{
  const r=room(GAME_TYPES.CRIBBAGE,2);startExtraGame(r);const ex=r.game.extra,[p1,p2]=[...r.players.values()];
  ex.phase='pegging';ex.turnPlayerId=p1.id;ex.pegTotal=0;ex.pegSeq=[];ex.go=[];p1.score=0;p2.score=0;
  p1.hand=[{id:'ca',rank:'A',suit:'clubs'},{id:'c3',rank:'3',suit:'clubs'}];p2.hand=[{id:'c2',rank:'2',suit:'diamonds'},{id:'c9',rank:'9',suit:'hearts'}];
  extraGameAction(r,p1,{action:'cribPeg',args:{cardId:'ca'}});extraGameAction(r,p2,{action:'cribPeg',args:{cardId:'c2'}});extraGameAction(r,p1,{action:'cribPeg',args:{cardId:'c3'}});
  assert.equal(p1.score,3);
});

test('Cribbage ends immediately when a player reaches 121 during pegging',()=>{
  const r=room(GAME_TYPES.CRIBBAGE,2);startExtraGame(r);const ex=r.game.extra,[p1,p2]=[...r.players.values()];
  ex.phase='pegging';ex.turnPlayerId=p1.id;ex.pegTotal=10;ex.pegSeq=[];ex.go=[];p1.score=120;p2.score=0;
  p1.hand=[{id:'c5',rank:'5',suit:'clubs'}];p2.hand=[{id:'c9b',rank:'9',suit:'hearts'}];
  extraGameAction(r,p1,{action:'cribPeg',args:{cardId:'c5'}});
  assert.equal(r.game.phase,'gameOver');assert.deepEqual(r.game.winnerIds,[p1.id]);
});

test('Burn Logs can finish when the target-log player goes out',()=>{
  const r=room(GAME_TYPES.BURN_LOGS,3,{targetLogs:1});startExtraGame(r);const ex=r.game.extra,p=r.players.get(ex.turnPlayerId);
  ex.laid[p.id]=true;ex.drawn=true;p.hand=[{id:'last-burn',rank:'5',suit:'clubs'}];
  extraGameAction(r,p,{action:'burnDiscard',args:{cardId:'last-burn'}});
  assert.equal(r.game.phase,'gameOver');assert.ok(r.game.winnerIds.includes(p.id));
});

test('Deck Sweep can finish a configured final round',()=>{
  const r=room(GAME_TYPES.DECK_SWEEP,3,{roundCount:1});startExtraGame(r);const ex=r.game.extra,p=r.players.get(ex.turnPlayerId),l=ex.layout[p.id];
  const c={id:'last-sweep',rank:'3',suit:'clubs'};p.hand=[c];l.up=[null,null,null,null];l.down=[null,null,null,null];ex.pile=[];
  extraGameAction(r,p,{action:'sweepPlay',args:{cardIds:[c.id]}});
  assert.equal(r.game.phase,'gameOver');
});

test('Last Haven can end as soon as a survivor reaches 15 Survival Points',()=>{
  const r=room(GAME_TYPES.LAST_HAVEN,3);startExtraGame(r);const ex=r.game.extra,p=[...r.players.values()][0];
  ex.phase='playing';ex.turnPlayerId=p.id;ex.rolled=true;ex.hiddenPoints[p.id]=14;ex.resources[p.id]={timber:0,scrap:0,food:1,fuel:1,medicine:1};ex.survivalDeck=['bunker'];
  extraGameAction(r,p,{action:'havenBuyCard'});
  assert.equal(r.game.phase,'gameOver');assert.ok(r.game.winnerIds.includes(p.id));
});


test('Marbles & Jokers uses all five Home holes and team help only after your own five are Home',()=>{
  const r=room(GAME_TYPES.MARBLES,4,{teamMode:'teams'});startExtraGame(r);const ex=r.game.extra,ids=[...r.players.keys()];
  const me=ids[0],partner=ids[2],p=r.players.get(me);
  ex.pawns[me].forEach((q,i)=>{q.zone='home';q.home=i+1;q.dist=0});
  ex.pawns[partner].forEach((q,i)=>{if(i<4){q.zone='home';q.home=i+2;q.dist=0}else{q.zone='track';q.home=0;q.dist=67}});
  ex.turnPlayerId=me;ex.drawn=true;p.hand=[{id:'mja',rank:'A',suit:'clubs'}];
  const pub=extraPublicState(r,p);const move=pub.actions.find(a=>a.action==='marbleMove'&&a.args.pawnId===ex.pawns[partner][4].id&&a.args.steps===1&&a.args.route==='home');
  assert.ok(move,'partner should be movable after all five of your own marbles are home');extraGameAction(r,p,move);
  assert.equal(ex.pawns[partner][4].home,1);assert.equal(r.game.phase,'gameOver');
});

test('Marbles & Jokers cannot pass over a marble of the same colour',()=>{
  const r=room(GAME_TYPES.MARBLES,4,{teamMode:'teams'});startExtraGame(r);const ex=r.game.extra,id=[...r.players.keys()][0],p=r.players.get(id);
  ex.pawns[id][0].zone='track';ex.pawns[id][0].dist=0;ex.pawns[id][1].zone='track';ex.pawns[id][1].dist=2;
  ex.turnPlayerId=id;ex.drawn=true;p.hand=[{id:'mj3',rank:'3',suit:'clubs'}];
  const acts=extraPublicState(r,p).actions.filter(a=>a.action==='marbleMove'&&a.args.pawnId===ex.pawns[id][0].id&&a.args.steps===3);
  assert.equal(acts.length,0);
});

test('Marbles & Jokers landing on a partner sends that partner to their in-spot',()=>{
  const r=room(GAME_TYPES.MARBLES,4,{teamMode:'teams'});startExtraGame(r);const ex=r.game.extra,ids=[...r.players.keys()],me=ids[0],partner=ids[2],p=r.players.get(me);
  ex.pawns[me][0].zone='track';ex.pawns[me][0].dist=0;
  // Player 1's +3 destination is absolute hole 11. Put the opposite-seat partner there.
  ex.pawns[partner][0].zone='track';ex.pawns[partner][0].dist=39;
  ex.turnPlayerId=me;ex.drawn=true;p.hand=[{id:'mj3b',rank:'3',suit:'clubs'}];
  const move=extraPublicState(r,p).actions.find(a=>a.action==='marbleMove'&&a.args.pawnId===ex.pawns[me][0].id&&a.args.steps===3&&a.args.route==='track');
  assert.ok(move);extraGameAction(r,p,move);
  assert.equal(ex.pawns[partner][0].zone,'track');assert.equal(ex.pawns[partner][0].dist,67);
});

test('31 skips eliminated players when a player knocks',()=>{
  const r=room(GAME_TYPES.THIRTY_ONE,4);startExtraGame(r);const ex=r.game.extra,ids=[...r.players.keys()],p=r.players.get(ids[0]);
  ex.turnPlayerId=p.id;ex.turnsTaken[p.id]=1;r.players.get(ids[1]).eliminated=true;r.players.get(ids[1]).score=0;
  extraGameAction(r,p,{action:'thirtyKnock'});
  assert.equal(ex.turnPlayerId,ids[2]);assert.equal(ex.finalTurns.includes(ids[1]),false);
});

test('Trail Trouble exposes board metadata and card 4 moves backward four',()=>{
  const r=room(GAME_TYPES.TRAIL,4,{teamMode:'teams2'});startExtraGame(r);const ex=r.game.extra,id=ex.turnPlayerId,p=r.players.get(id),pawn=ex.pawns[id][0];
  pawn.zone='track';pawn.dist=12;p.hand=[{id:'trail-four',kind:'move',value:4,label:'4'}];
  const pub=extraPublicState(r,p);assert.equal(pub.trackLength,60);assert.equal(pub.deckCount,ex.deck.length);assert.equal(pub.direction,1);assert.ok(pub.startPositions[id]===0);
  const backward=pub.actions.find(a=>a.action==='trailMove'&&a.args.pawnId===pawn.id&&a.args.steps===-4);assert.ok(backward,'4 should offer a backward-four move');
  assert.equal(pub.actions.some(a=>a.action==='trailMove'&&a.args.pawnId===pawn.id&&a.args.steps===4),false);
  extraGameAction(r,p,backward);assert.equal(pawn.dist,8);assert.equal(p.hand.length,5,'played card is replaced to restore the five-card hand');
});
