import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {GAME_TYPES} from '../gameEngine.mjs';
import {extraDefaults,startExtraGame,extraPublicState,extraGameAction} from '../extraGames.mjs';

const root=path.resolve(new URL('..',import.meta.url).pathname);
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const player=i=>({id:`p${i}`,token:`t${i}`,name:`Player ${i}`,avatar:'cowboy',variant:0,outfitVariant:0,color:'#2f6b4f',seat:i-1,ready:true,connected:true,bid:null,tricks:0,score:0,continued:false,hand:[],eliminated:false});
function room(type,n=3,settings={}){const ps=new Map(Array.from({length:n},(_,i)=>{const p=player(i+1);return[p.id,p]}));return{id:crypto.randomUUID(),gameType:type,settings:{...extraDefaults(type),...settings},players:ps,game:{phase:'lobby',history:[],schedule:[],winnerIds:[],extra:null}}}

const W18='GAME-NIGHT-STAGING-PHASE-W18-GAMEPLAY-REALISM-40';
const W19='GAME-NIGHT-STAGING-PHASE-W19-CABIN-ART-AVATAR-41';
const W20='GAME-NIGHT-STAGING-PHASE-W20-MASTER-CATALOG-42';
const W21='GAME-NIGHT-STAGING-PHASE-W21-TRUE3D-WORLD-PROPS-GAMEPLAY-43';
const W22='GAME-NIGHT-STAGING-PHASE-W23-CABIN-REGRESSION-RECOVERY-48';

test('W22 is current without deleting the W18/W19/W20/W21 historical release constants',()=>{
  assert.equal(read('CURRENT_RELEASE.txt').trim(),W22);
  assert.equal(read('DESIGN_RELEASE.txt').trim(),'GAME-NIGHT-DESIGN-PHASE-W22-CATALOG-APPROVAL-STUDIO-44');
  const app=read('public/app.js'),sw=read('public/sw.js');
  assert.match(app,/PHASE_W17_RELEASE='GAME-NIGHT-STAGING-PHASE-W17-CABIN-COSMETICS-POLISH-39'/);
  assert.match(app,/PHASE_W18_RELEASE='GAME-NIGHT-STAGING-PHASE-W18-GAMEPLAY-REALISM-40'/);
  assert.match(app,/PHASE_W19_RELEASE='GAME-NIGHT-STAGING-PHASE-W19-CABIN-ART-AVATAR-41'/);
  assert.match(app,/PHASE_W20_RELEASE='GAME-NIGHT-STAGING-PHASE-W20-MASTER-CATALOG-42'/);
  assert.match(app,/CURRENT_BUILD=PHASE_W22_RELEASE/);
  assert.match(sw,/PHASE_W18_CACHE='black-family-game-night-staging-phase-w18-gameplay-realism-40'/);
  assert.match(sw,/PHASE_W19_CACHE='black-family-game-night-staging-phase-w19-cabin-art-avatar-41'/);
  assert.match(sw,/PHASE_W20_CACHE='black-family-game-night-staging-phase-w20-master-catalog-42'/);
  assert.match(sw,/const CACHE=PHASE_W22_CACHE/);
});

test('W18 Golf rejection forces a flip for stock and discard draws until the last hidden card',()=>{
  for(const source of ['stock','discard']){
    const r=room(GAME_TYPES.GOLF,3);startExtraGame(r);const ex=r.game.extra,p=r.players.get(ex.turnPlayerId);
    const draw=extraPublicState(r,p).actions.find(a=>a.action==='golfDraw'&&a.args?.source===source);assert.ok(draw,source);
    extraGameAction(r,p,draw);
    const pub=extraPublicState(r,p);
    assert.equal(pub.actions.some(a=>a.action==='golfDiscardDrawn'),false,`${source}: cannot skip required flip`);
    const flip=pub.actions.find(a=>a.action==='golfDiscardFlip');assert.ok(flip,source);
  }
  const r=room(GAME_TYPES.GOLF,3);startExtraGame(r);const ex=r.game.extra,p=r.players.get(ex.turnPlayerId),grid=ex.grids[p.id];
  grid.forEach((cell,i)=>cell.face=i!==7);
  const draw=extraPublicState(r,p).actions.find(a=>a.action==='golfDraw'&&a.args?.source==='stock');extraGameAction(r,p,draw);
  const direct=extraPublicState(r,p).actions.find(a=>a.action==='golfDiscardDrawn');assert.ok(direct);
  extraGameAction(r,p,direct);assert.equal(grid[7].face,false,'last card remains face-down');
});

test('W18 Deck Sweep permits exposed table cards while hand exists and matching hand plus table combos',()=>{
  const r=room(GAME_TYPES.DECK_SWEEP,3);startExtraGame(r);const ex=r.game.extra,p=r.players.get(ex.turnPlayerId),l=ex.layout[p.id];
  assert.ok(p.hand.length>0);const table=l.up[0];assert.ok(table);
  p.hand[0].rank=table.rank;const handId=p.hand[0].id;
  const plays=extraPublicState(r,p).actions.filter(a=>a.action==='sweepPlay'&&Array.isArray(a.args?.cardIds));
  assert.ok(plays.some(a=>a.args.cardIds.length===1&&a.args.cardIds[0]===table.id),'exposed table card alone is playable');
  assert.ok(plays.some(a=>a.args.cardIds.includes(table.id)&&a.args.cardIds.includes(handId)),'matching hand + exposed table cards can be played together');
});

test('W18 Campfire Chaos Take 4 resolves the draw and advances instead of deadlocking',()=>{
  const r=room(GAME_TYPES.CAMPFIRE,3);startExtraGame(r);const ex=r.game.extra,p=r.players.get(ex.turnPlayerId),turn=p.id;
  p.hand=p.hand.filter(c=>!['draw2','draw4'].includes(c.kind));const before=p.hand.length;ex.pendingDraw=4;ex.draw4Challenge=null;
  const take=extraPublicState(r,p).actions.find(a=>a.action==='campDrawPenalty');assert.ok(take);assert.match(take.label,/Take 4/);
  extraGameAction(r,p,take);assert.equal(ex.pendingDraw,0);assert.ok(p.hand.length>=before,'penalty cards were dealt');
  assert.equal(ex.turnPlayerId===turn,false,'turn advances after penalty');
  assert.match(ex.message,/took 4 cards/i);
});

test('W18 Campfire draw penalty adds exactly four cards in a controlled state',()=>{
  const r=room(GAME_TYPES.CAMPFIRE,3);startExtraGame(r);const ex=r.game.extra,p=r.players.get(ex.turnPlayerId);
  p.hand=p.hand.filter(c=>!['draw2','draw4'].includes(c.kind));const before=p.hand.length;ex.pendingDraw=4;ex.draw4Challenge=null;
  extraGameAction(r,p,{action:'campDrawPenalty'});assert.equal(p.hand.length,before+4);assert.equal(ex.pendingDraw,0);
});

test('W18 Backgammon and Blackgammon expose reliable direct fallbacks in addition to board taps',()=>{
  const app=read('public/app.js'),black=read('blackGammon.mjs');
  assert.match(app,/function bgFallbackMoves/);assert.match(app,/LEGAL MOVES/);assert.match(app,/data-bg-from/);
  assert.match(app,/black-pool-fallback/);assert.match(app,/KEEP \$\{\(a\.args\?\.values\|\|\[\]\)\.join\(' \+ '\)\}/);
  assert.match(app,/black-direct-moves/);assert.match(black,/blackAllocateSingles/);
  for(const action of ['bgMove','blackMove','blackAllocate','blackAllocateSingles'])assert.ok(app.includes(`'${action}'`),action);
});

test('W18 Trail Trouble and Prairie Pots provide direct playable action fallbacks and immediate refresh',()=>{
  const app=read('public/app.js');
  assert.match(app,/trail-quick-actions/);assert.match(app,/Quick Move/i);assert.match(app,/prairie-play-now/);
  assert.match(app,/data-extra-action/);
  for(const action of ['trailMove','trailSplit','trailSwap','trailCabin','prairiePlay','prairieContinue'])assert.ok(app.includes(`'${action}'`),action);
});

test('W18 Mexican Train is a tile-first layout with private rails, community rail and double continuation',()=>{
  const app=read('public/app.js'),css=read('public/styles.css');
  assert.match(app,/tiles-only-layout/);assert.match(app,/MEXICAN TRAIN · COMMUNITY/);assert.match(app,/Everyone may play here/);
  assert.match(app,/PLAY ANOTHER DOMINO TO CLOSE IT/);assert.match(app,/orderedPlayers/);
  assert.match(css,/\.mexican-train-table\.tiles-only-layout/);assert.match(css,/background\s*:\s*transparent/);
  assert.doesNotMatch(app,/FAMILY TRAIN/);
});

test('W18 Family Mystery uses cabin realism, raised reachable clue blocks, auto routes and obvious kitty-corner passages',()=>{
  const mystery=read('public/new-games.html');
  assert.match(mystery,/shortcutEdges/);assert.match(mystery,/camper.*living/);assert.match(mystery,/shop.*papashop/);
  assert.match(mystery,/SECRET PASSAGE/);assert.match(mystery,/glowing raised clue block/i);assert.match(mystery,/showRoomArrival/);
  assert.match(mystery,/cabin-aerial-scene\.jpg/);assert.match(mystery,/cabin-assets\/generated\/empty-room-shell\.svg/);
  assert.match(mystery,/function shortest\(/);assert.match(mystery,/reachable/);
});

test('W18 Molly replaces active Neon Snake with a puppy light chase that grows a trail and speeds up',()=>{
  const app=read('public/app.js'),molly=read('public/mollys-light-chase.html'),old=read('public/neon-snake.html'),sw=read('public/sw.js');
  assert.doesNotMatch(app,/snake:\{name:'Neon Snake'/);assert.doesNotMatch(sw,/['\"]\/neon-snake\.html['\"]/);
  assert.match(old,/mollys-light-chase\.html/);assert.match(molly,/characters3d\/molly\.png/);assert.match(molly,/N=20/);
  assert.match(molly,/body\.unshift/);assert.match(molly,/Math\.floor\(score\/5\)/);assert.match(molly,/pointerdown|touchstart/);
});

test('W18 visible family spelling uses Lizzy or Elizabeth, never Lizzie',()=>{
  for(const f of ['public/app.js','public/new-games.html','public/arcade-tutorials.mjs','public/phase-w-platform.mjs'])assert.doesNotMatch(read(f),/\bLizzie\b/,f);
});
