import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {GAME_TYPES} from '../gameEngine.mjs';
import {extraDefaults,startExtraGame,extraPublicState,extraGameAction} from '../extraGames.mjs';
import {startBlackGammon,publicBlackGammon,blackLegalMoves} from '../blackGammon.mjs';
import {WORLD_PROP_CATALOG,WORLD_PROP_COUNT,WORLD_PROP_FLAGSHIPS} from '../public/world-prop-catalog.mjs';

const root=path.resolve(new URL('..',import.meta.url).pathname);
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const W21='GAME-NIGHT-STAGING-PHASE-W21-TRUE3D-WORLD-PROPS-GAMEPLAY-43';
const player=(i,name=`Player ${i}`)=>({id:`p${i}`,token:`t${i}`,name,avatar:i===1?'kristen':'john',variant:0,outfitVariant:0,color:i===1?'#2f6b4f':'#8b593e',seat:i-1,ready:true,connected:true,bid:null,tricks:0,score:0,continued:false,hand:[],eliminated:false});
function room(type,n=2,settings={}){const ps=new Map(Array.from({length:n},(_,i)=>{const p=player(i+1);return[p.id,p]}));return{id:crypto.randomUUID(),gameType:type,settings:{...extraDefaults(type),...settings},players:ps,game:{phase:'lobby',history:[],schedule:[],winnerIds:[],extra:null}}}
const countBy=(rows,key)=>Object.fromEntries([...new Set(rows.map(x=>x[key]))].sort().map(v=>[v,rows.filter(x=>x[key]===v).length]));

test('W21 release identity is current while W20 remains preserved as history',()=>{
  assert.equal(read('CURRENT_RELEASE.txt').trim(),W21);
  assert.equal(read('DESIGN_RELEASE.txt').trim(),'GAME-NIGHT-DESIGN-PHASE-W21-TRUE3D-WORLD-PROPS-GAMEPLAY-43');
  assert.equal(JSON.parse(read('package.json')).version,'3.19.0-staging-phase-w21-true3d-world-props-gameplay-43');
  const app=read('public/app.js'),sw=read('public/sw.js'),qa=read('public/phase-e-qa.mjs');
  assert.match(app,/PHASE_W20_RELEASE='GAME-NIGHT-STAGING-PHASE-W20-MASTER-CATALOG-42'/);
  assert.match(app,/PHASE_W21_RELEASE='GAME-NIGHT-STAGING-PHASE-W21-TRUE3D-WORLD-PROPS-GAMEPLAY-43'/);
  assert.match(app,/CURRENT_BUILD=PHASE_W21_RELEASE/);
  assert.match(sw,/const CACHE=PHASE_W21_CACHE/);
  assert.match(qa,/STAGING_BUILD_ID='GAME-NIGHT-STAGING-PHASE-W21-TRUE3D-WORLD-PROPS-GAMEPLAY-43'/);
});

test('W21 cabin replaces the flat room decorator with a real Three.js room and raycast editing',()=>{
  const cabin=read('public/cabin.js'),room3d=read('public/cabin-3d-room.mjs'),css=read('public/cabin.css');
  assert.match(cabin,/mountCabinRoom3D/);
  assert.match(cabin,/CABIN_DECOR_VERSION=21/);
  assert.match(room3d,/new THREE\.WebGLRenderer/);
  assert.match(room3d,/new THREE\.PerspectiveCamera/);
  assert.match(room3d,/new THREE\.Raycaster/);
  assert.match(room3d,/new THREE\.BoxGeometry/);
  assert.match(room3d,/DirectionalLight/);
  assert.match(room3d,/PointLight/);
  assert.match(room3d,/shadowMap\.enabled=true/);
  assert.match(room3d,/createCatalogHomeMesh/);
  assert.match(room3d,/intersectObjects\(pickables,true\)/);
  assert.match(css,/\.cabin3d-canvas/);
});

test('W21 world prop library contains exactly 2,000 distinct planned props with the approved allocation and 200 flagships',()=>{
  assert.equal(WORLD_PROP_COUNT,2000);
  assert.equal(WORLD_PROP_CATALOG.length,2000);
  assert.equal(WORLD_PROP_FLAGSHIPS.length,200);
  assert.equal(new Set(WORLD_PROP_CATALOG.map(x=>x['Prop ID'])).size,2000);
  assert.equal(new Set(WORLD_PROP_CATALOG.map(x=>x['Prop Name'])).size,2000);
  assert.deepEqual(countBy(WORLD_PROP_CATALOG,'Category'),{
    'Family Signature Props':160,
    'Farm / Barn / Goat Area':220,
    'Indoor Cabin Props':300,
    'Interactive / Animated Props':100,
    'Kitchen / Pantry / Dining':180,
    'Outdoor / Campsite / Yard':240,
    'Pet Props':120,
    'Seasonal / Event Props':130,
    'Specialty / Hero / Rare Props':120,
    'Wall / Shelf / Filler Decor':150,
    "Workshop / Garage / Papa's Shop":280
  });
  const hashes=new Set();
  for(const item of WORLD_PROP_CATALOG){const p=path.join(root,'public',String(item['Art Path']).replace(/^\//,''));assert.ok(fs.existsSync(p),item['Prop ID']);hashes.add(crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex'))}
  assert.equal(hashes.size,2000);
});

test('W21 shared world props are reusable in Prop Hunt maps and other priority 3D worlds',()=>{
  const prop=read('public/prop-hunt-3d.js'),island=read('public/island-life.js'),mystery=read('public/new-games.html'),kit=read('public/shared-3d-art-kit.mjs');
  assert.match(kit,/function createWorldPropMesh/);
  assert.match(prop,/WORLD_CATALOG_URL/);assert.match(prop,/sprinkleWorldCatalog/);
  for(const map of ["Papa's Shop",'Camper / Campsite','Backyard / Fire Pit','Goat / Farm'])assert.ok(prop.includes(map),map);
  assert.match(island,/WORLD_PROP_CATALOG/);assert.match(island,/createWorldPropMesh/);
  assert.match(mystery,/mysteryWorldProps/);assert.match(mystery,/world-props\/generated/);
});

test('W21 Blackgammon checker-first UI exposes movable checkers immediately after roll without requiring a die selection',()=>{
  const app=read('public/app.js');
  assert.match(app,/function blackMoveMap\(e,tokenId=null\)/);
  assert.match(app,/map=blackMoveMap\(e,tokenId\|\|null\)/);
  assert.match(app,/legal=mine&&acts\.length>0/);
  assert.match(app,/data-bg-from/);
  assert.match(app,/TAP CHECKER → DESTINATION/);
  assert.match(app,/Tap a die only if you want to filter/);
  assert.doesNotMatch(app,/if\(!tokenId\)return new Map/);
});

test('W21 Blackgammon engine publishes actual legal checker moves in moving phase',()=>{
  const r=room(GAME_TYPES.BLACK_GAMMON,2);startBlackGammon(r);const ex=r.game.extra,p=r.players.get('p1');
  ex.phase='moving';ex.turnPlayerId=p.id;ex.assignments[p.id]=[{id:'test-die',kind:'single',value:1,direction:'auto',remaining:1,transferred:false}];
  const moves=blackLegalMoves(r,p.id);assert.ok(moves.length>0,'at least one checker must be movable from the starting board with die 1');
  const pub=publicBlackGammon(r,p);assert.ok(pub.actions.some(a=>a.action==='blackMove'));
  assert.ok(pub.actions.some(a=>Number.isInteger(a.args?.from)||a.args?.from==='bar'));
});

test('W21 Deck Sweep exposes uncovered mystery cards while hand remains and a too-high mystery card picks up the pile',()=>{
  const r=room(GAME_TYPES.DECK_SWEEP,3);startExtraGame(r);const ex=r.game.extra,p=r.players.get(ex.turnPlayerId),l=ex.layout[p.id];
  assert.ok(p.hand.length>0);
  l.up[0]=null;l.down[0]={id:'mystery-k',rank:'K',suit:'spades'};ex.pile=[{id:'pile-two',rank:'2',suit:'clubs'}];
  const pub=extraPublicState(r,p),risk=pub.actions.find(a=>a.action==='sweepPlay'&&a.args?.blindIndex===0);assert.ok(risk,'uncovered mystery card must be playable before hand is empty');
  const before=p.hand.length;extraGameAction(r,p,risk);
  assert.equal(l.down[0],null);
  assert.equal(ex.pile.length,0);
  assert.equal(p.hand.length,before+2,'mystery K plus existing center pile are picked up');
  assert.match(ex.message,/Too high.*picked up/i);
});

test('W21 Trail Trouble and Prairie Pots Play Now buttons create, add a bot, ready and start in one action',()=>{
  const app=read('public/app.js');
  assert.match(app,/data-quick-create-game="\$\{key\}"/);
  assert.match(app,/Play Now vs Computer/);
  assert.match(app,/async function createQuickRoom\(gameType\)/);
  for(const step of ["api('create'","api('addBot'","api('ready'","api('start'"])assert.ok(app.includes(step),step);
  assert.match(app,/\[GAME\.TRAIL,GAME\.PRAIRIE\]\.includes\(key\)/);
  assert.match(app,/\[data-quick-create-game\]/);
});

test('W21 Mexican Train uses the full viewport and renders every train tile rather than clipping the rail tail',()=>{
  const app=read('public/app.js'),css=read('public/styles.css');
  assert.match(app,/\$\{tr\.tiles\?\.length\|\|0\} placed/);
  assert.match(app,/\$\{m\.tiles\?\.length\|\|0\} placed/);
  assert.match(css,/\.mexican-focus-layout\{grid-template-columns:minmax\(0,1fr\)!important;max-width:1540px/);
  assert.match(css,/\.mexican-board-viewport\{overflow:auto!important/);
  assert.match(css,/\.mexican-focus-surface \.mt-domino-chain\{display:flex!important;flex-wrap:wrap!important;[\s\S]*?overflow:visible!important/);
  assert.match(css,/\.mexican-focus-surface \.mexican-train-table\{width:100%!important;max-width:none!important;min-width:760px/);
});
