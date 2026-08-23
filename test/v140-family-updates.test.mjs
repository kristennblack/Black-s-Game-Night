import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {GAME_TYPES} from '../gameEngine.mjs';
import {extraDefaults,startExtraGame,extraPublicState,extraGameAction} from '../extraGames.mjs';

const player=(i)=>({id:`p${i}`,token:`t${i}`,name:`Player ${i}`,avatar:'kristen',variant:0,outfitVariant:0,color:'#2f6b4f',seat:i-1,ready:true,connected:true,bid:null,tricks:0,score:0,continued:false,hand:[],eliminated:false});
function room(type,n=2,settings={}){const ps=new Map(Array.from({length:n},(_,i)=>{const p=player(i+1);return[p.id,p]}));return{id:'test-room',gameType:type,settings:{...extraDefaults(type),...settings},players:ps,game:{phase:'lobby',history:[],schedule:[],winnerIds:[],extra:null}}}
const C=(id,rank,suit)=>({id,rank,suit});

test('Sweep Your Deck deals 20 cards as 12 hand + 4 face-up + 4 face-down',()=>{
  const r=room(GAME_TYPES.DECK_SWEEP,2);startExtraGame(r);for(const p of r.players.values()){const l=r.game.extra.layout[p.id];assert.equal(p.hand.length,12);assert.equal(l.up.length,4);assert.equal(l.down.length,4);assert.equal(l.up.filter(Boolean).length,4);assert.equal(l.down.filter(Boolean).length,4)}
});

test('Sweep Your Deck lets a player choose hand cards or any face-up table card before hand is empty',()=>{
  const r=room(GAME_TYPES.DECK_SWEEP,2);startExtraGame(r);const ex=r.game.extra,p=r.players.get(ex.turnPlayerId),l=ex.layout[p.id];
  p.hand=[C('h7','7','clubs'),C('h3','3','diamonds')];l.up=[C('u5','5','hearts'),C('u9','9','clubs'),C('u2','2','spades'),C('uK','K','diamonds')];ex.pile=[];
  const a=extraPublicState(r,p).actions;assert.ok(a.some(x=>x.action==='sweepPlay'&&x.args.cardIds?.includes('h7')));for(const id of ['u5','u9','u2','uK'])assert.ok(a.some(x=>x.action==='sweepPlay'&&x.args.cardIds?.length===1&&x.args.cardIds[0]===id),`missing face-up ${id}`);
});

test('Sweep Your Deck unlocks only the face-down card directly beneath a cleared face-up slot and commits it once chosen',()=>{
  const r=room(GAME_TYPES.DECK_SWEEP,2);startExtraGame(r);const ex=r.game.extra,p=r.players.get(ex.turnPlayerId),l=ex.layout[p.id];
  p.hand=[C('h4','4','hearts')];l.up=[null,C('u6','6','clubs'),C('u7','7','spades'),C('u8','8','diamonds')];l.down=[C('d4','4','clubs'),C('d5','5','hearts'),C('d6','6','spades'),C('d7','7','diamonds')];ex.pile=[];
  let view=extraPublicState(r,p);const reveals=view.actions.filter(x=>x.action==='sweepRevealBlind');assert.deepEqual(reveals.map(x=>x.args.blindIndex),[0]);
  extraGameAction(r,p,reveals[0]);assert.equal(ex.pendingBlind.playerId,p.id);assert.equal(ex.pendingBlind.card.id,'d4');assert.equal(l.down[0],null);
  view=extraPublicState(r,p);assert.ok(view.pendingBlind);assert.ok(view.actions.length>=1);assert.ok(view.actions.every(x=>x.action==='sweepCommitBlind'));
  const withMatch=view.actions.find(x=>(x.args.cardIds||[]).includes('h4'));assert.ok(withMatch,'matching hand card should be optionally playable with committed blind card');extraGameAction(r,p,withMatch);assert.equal(ex.pendingBlind,null);
});

test('Sweep Your Deck sweeps on four consecutive cards of the same suit and grants the same player another turn',()=>{
  const r=room(GAME_TYPES.DECK_SWEEP,2);startExtraGame(r);const ex=r.game.extra,p=r.players.get(ex.turnPlayerId),l=ex.layout[p.id];
  ex.pile=[C('a','2','hearts'),C('b','3','hearts'),C('c','4','hearts')];p.hand=[C('d','4','hearts'),C('keep','A','clubs')];l.up=[C('u1','K','clubs'),C('u2','Q','clubs'),C('u3','J','clubs'),C('u4','9','clubs')];
  const turn=p.id;extraGameAction(r,p,{action:'sweepPlay',args:{cardIds:['d']}});assert.equal(ex.pile.length,0);assert.equal(ex.turnPlayerId,turn);assert.match(ex.message,/SWEEP/);
});

test('Sweep Your Deck 10 always sweeps and goes again',()=>{
  const r=room(GAME_TYPES.DECK_SWEEP,2);startExtraGame(r);const ex=r.game.extra,p=r.players.get(ex.turnPlayerId),l=ex.layout[p.id];p.hand=[C('ten','10','spades'),C('keep','A','clubs')];l.up=[C('u1','K','clubs'),C('u2','Q','clubs'),C('u3','J','clubs'),C('u4','9','clubs')];ex.pile=[C('x','2','diamonds')];const turn=p.id;extraGameAction(r,p,{action:'sweepPlay',args:{cardIds:['ten']}});assert.equal(ex.pile.length,0);assert.equal(ex.turnPlayerId,turn);
});

test('Sweep Your Deck end scoring uses 10 as 25 only when it remains in hand',()=>{
  const r=room(GAME_TYPES.DECK_SWEEP,2,{roundCount:1});startExtraGame(r);const ex=r.game.extra,p1=r.players.get(ex.turnPlayerId),p2=[...r.players.values()].find(p=>p.id!==p1.id),l1=ex.layout[p1.id],l2=ex.layout[p2.id];
  p1.hand=[C('last','2','clubs')];l1.up=[null,null,null,null];l1.down=[null,null,null,null];
  p2.hand=[C('hand10','10','hearts')];l2.up=[C('table10','10','clubs'),null,null,null];l2.down=[null,null,null,null];ex.pile=[];
  extraGameAction(r,p1,{action:'sweepPlay',args:{cardIds:['last']}});assert.equal(r.game.phase,'gameOver');assert.equal(ex.history.at(-1).scores[p2.id],35);
});

test('Campfire Chaos exposes LAST LOG and a two-card catch penalty',()=>{
  const r=room(GAME_TYPES.CAMPFIRE,2);startExtraGame(r);const ex=r.game.extra,ids=[...r.players.keys()],v=r.players.get(ids[0]),catcher=r.players.get(ids[1]);v.hand=[C('only','5','fire')];ex.lastLogVulnerable=v.id;ex.turnPlayerId=catcher.id;const before=v.hand.length;const action=extraPublicState(r,catcher).actions.find(x=>x.action==='catchLog');assert.ok(action);extraGameAction(r,catcher,action);assert.equal(v.hand.length,before+2);
});

test('v1.4 UI includes clickable lodge hotspots, inline computer character selection, prominent LAST LOG, replay and mystery zoom board',async()=>{
  const app=await readFile(new URL('../public/app.js',import.meta.url),'utf8');const css=await readFile(new URL('../public/styles.css',import.meta.url),'utf8');const ng=await readFile(new URL('../public/new-games.html',import.meta.url),'utf8');const worker=await readFile(new URL('../worker.mjs',import.meta.url),'utf8');
  for(const t of ['data-home-action="settings"','data-home-action="chat"','data-home-action="voice"','data-home-action="exit"','+ Add Computer Player','botOutfitOptions','LAST LOG!','Play Again / Reshuffle','restartGame'])assert.ok(app.includes(t),t);
  assert.ok(worker.includes("/api/restart"));assert.ok(worker.includes('outfitVariant:b.outfitVariant'));
  for(const t of ['mystery-board-viewport','zoomIn','zoomOut','Pinch / scroll to zoom','board-figure','room-scene','secretPassages'])assert.ok(ng.includes(t),t);
  assert.ok(css.includes('.home-hotspot.chat'));assert.ok(css.includes('.sweep-committed'));
});
