import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {CABIN_ROOM_ITEM_CATALOG} from '../public/cabin-room-catalog.mjs';
import {STARTER_CABIN_BLUEPRINT_IDS,STARTER_CABIN_ITEM_NAMES} from '../public/cabin-progression.mjs';
import {COSMETIC_CATALOG,fitProfileForAvatar} from '../public/avatar-cosmetics.mjs';
import {GameHub} from '../worker.mjs';

const root=path.resolve(new URL('..',import.meta.url).pathname);
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const W19='GAME-NIGHT-STAGING-PHASE-W19-CABIN-ART-AVATAR-41';
const W20='GAME-NIGHT-STAGING-PHASE-W20-MASTER-CATALOG-42';
const W21='GAME-NIGHT-STAGING-PHASE-W21-TRUE3D-WORLD-PROPS-GAMEPLAY-43';
const W22='GAME-NIGHT-STAGING-PHASE-W24-FLAGSHIP-EARRINGS-49';

test('W19 and W21 identities remain historical while W22 is current',()=>{
  assert.equal(read('CURRENT_RELEASE.txt').trim(),W22);
  assert.equal(read('DESIGN_RELEASE.txt').trim(),'GAME-NIGHT-DESIGN-PHASE-W24-FLAGSHIP-EARRINGS-49');
  assert.equal(JSON.parse(read('package.json')).version,'3.22.0-staging-phase-w24-flagship-earrings-49');
  const app=read('public/app.js'),sw=read('public/sw.js');
  assert.match(app,/PHASE_W18_RELEASE='GAME-NIGHT-STAGING-PHASE-W18-GAMEPLAY-REALISM-40'/);
  assert.match(app,/PHASE_W19_RELEASE='GAME-NIGHT-STAGING-PHASE-W19-CABIN-ART-AVATAR-41'/);
  assert.match(app,/PHASE_W20_RELEASE='GAME-NIGHT-STAGING-PHASE-W20-MASTER-CATALOG-42'/);
  assert.match(app,/CURRENT_BUILD=PHASE_W24_RELEASE/);assert.match(sw,/const CACHE=PHASE_W24_CACHE/);
});

test('W19 cabin starts as a bare pine architectural shell with a tiny low-end starter crate',()=>{
  assert.deepEqual(STARTER_CABIN_ITEM_NAMES,['Pine Single Bed','Simple Nightstand','Basic Desk Chair','Plain Floor Lamp','Neutral Woven Rug']);
  assert.equal(STARTER_CABIN_BLUEPRINT_IDS.length,5);
  const js=read('public/cabin.js'),css=read('public/cabin.css');
  assert.match(js,/CABIN_DECOR_VERSION=21/);assert.match(js,/wallpaper:'bare-pine-wall'/);assert.match(js,/flooring:'bare-pine-floor'/);assert.match(js,/placements:\[\]/);
  assert.match(js,/decorVersion\|\|0\)<19/);assert.match(js,/decorVersion\|\|0\)<21/);assert.match(js,/mountCabinRoom3D/);assert.match(css,/cabin3d-canvas/);
});

test('W19 unique-art promise scales to all 2,000 active W20 home records',()=>{
  assert.equal(CABIN_ROOM_ITEM_CATALOG.length,2000);
  const thumbs=new Set(),places=new Set(),thumbHashes=new Set(),placeHashes=new Set();
  for(const item of CABIN_ROOM_ITEM_CATALOG){const id=item['Item ID'],t=path.join(root,'public/cabin-assets/generated/thumbs',`${id}.svg`),q=path.join(root,'public/cabin-assets/generated/placeables',`${id}.svg`);assert.ok(fs.existsSync(t),`${id} thumb`);assert.ok(fs.existsSync(q),`${id} placeable`);thumbs.add(t);places.add(q);thumbHashes.add(crypto.createHash('sha256').update(fs.readFileSync(t)).digest('hex'));placeHashes.add(crypto.createHash('sha256').update(fs.readFileSync(q)).digest('hex'));}
  assert.equal(thumbs.size,2000);assert.equal(places.size,2000);assert.equal(thumbHashes.size,2000);assert.equal(placeHashes.size,2000);
  const store=read('public/tokens-store.html'),cabin=read('public/cabin.js');
  assert.match(store,/cabinItemThumb/);assert.match(store,/cabinItemPlaceable/);assert.doesNotMatch(store,/const roomImages=/);assert.doesNotMatch(store,/const placeables=/);
  assert.match(cabin,/cabinItemThumb/);assert.match(cabin,/cabinItemPlaceable/);
});

test('W19 room editing supports direct selection, tap-to-move, rotate, store, wall-floor snapping and blueprint duplication',()=>{
  const js=read('public/cabin.js');
  for(const token of ['mountCabinRoom3D','onSelect','onMove','data-rotate','data-duplicate','data-delete','data-surface','snapPlacement','isPlacementInsideRoom'])assert.ok(js.includes(token),token);
  const room3d=read('public/cabin-3d-room.mjs');assert.match(room3d,/THREE\.Raycaster/);assert.match(room3d,/WebGLRenderer/);
  assert.match(js,/surface.*wall/);assert.match(js,/surface.*floor/);assert.match(js,/90/);
});

test('W19 universal avatar fit never hides a cosmetic, including on Kelsi, Molly and Gunner',()=>{
  const avatars=['john','kristen','holly','vanessa','elizabeth','logan','james','dorothy','papa','nana','kelsi','molly','gunner'];
  for(const avatar of avatars)for(const item of COSMETIC_CATALOG){const fit=fitProfileForAvatar(avatar,item.slot,item,0);assert.notEqual(fit.hidden,true,`${avatar}/${item.id}`);assert.ok(Number.isFinite(fit.x)&&Number.isFinite(fit.y)&&Number.isFinite(fit.w),`${avatar}/${item.id} finite fit`);}
  const cosmetics=read('public/avatar-cosmetics.mjs'),styles=read('public/styles.css'),store=read('public/tokens-store.html');
  assert.match(cosmetics,/hidden:false/);assert.match(styles,/aspect-ratio:4\/5/);assert.match(store,/aspect-ratio:4\/5/);
});

class MemoryStorage{constructor(){this.map=new Map()}async list({prefix=''}={}){return new Map([...this.map].filter(([k])=>k.startsWith(prefix)))}async get(k){return this.map.get(k)}async put(k,v){this.map.set(k,structuredClone(v))}}
const hub=()=>new GameHub({storage:new MemoryStorage(),waitUntil(){}},{});

test('W19 automatically migrates any persisted legacy room to the empty shell without touching ownership',async()=>{
  const storage=new MemoryStorage();await storage.put('cabin-room:kristen',{roomKey:'kristen',ownerProfileId:'k',ownerName:'Kristen',ownerAvatar:'kristen',wallpaper:'old',flooring:'old',placements:[{id:'old',itemId:STARTER_CABIN_BLUEPRINT_IDS[0],x:1,z:1,rotation:0}],guestbook:[{text:'keep'}],reactions:[],updatedAt:1});
  const h=new GameHub({storage,waitUntil(){}},{}),r=await h.getCabinRoom('kristen');assert.equal(r.ownerProfileId,'k');assert.deepEqual(r.placements,[]);assert.equal(r.wallpaper,'bare-pine-wall');assert.equal(r.flooring,'bare-pine-floor');assert.equal(r.decorVersion,21);assert.equal(r.guestbook.length,1);
});
test('W19 server persists bare room defaults and placement surfaces while preserving owner-only blueprint rules',async()=>{
  const h=hub(),d=await h.getCabinRoom('kristen');assert.equal(d.wallpaper,'bare-pine-wall');assert.equal(d.flooring,'bare-pine-floor');assert.equal(d.decorVersion,21);assert.deepEqual(d.placements,[]);
  const itemId=STARTER_CABIN_BLUEPRINT_IDS[0];const saved=await h.updateCabinRoom({profileId:'k',name:'Kristen',avatar:'kristen',roomKey:'kristen',action:'save',wallpaper:'bare-pine-wall',flooring:'bare-pine-floor',placements:[{id:'a',itemId,x:3,z:4,rotation:90,surface:'wall'}]});assert.equal(saved.placements[0].surface,'wall');assert.equal(saved.decorVersion,21);
});

test('W19 Family Mystery, Prop Hunt, Island Life and Molly share the cabin art language in priority order',()=>{
  const mystery=read('public/new-games.html'),prop=read('public/prop-hunt-3d.js'),art=read('public/shared-3d-art-kit.mjs'),island=read('public/island-life.js'),molly=read('public/mollys-light-chase.html');
  assert.match(mystery,/mysteryCabinProps/);assert.match(mystery,/generated\/placeables/);assert.match(mystery,/SECRET PASSAGE/);
  for(const name of ['Cabin Bed','Cabin TV','Cabin Dresser','Cabin Lamp','Cabin Rug'])assert.match(art,new RegExp(name));
  assert.match(prop,/W20 catalog integration/);assert.match(prop,/home-flagship-h008-papa-s-worn-yellow-chair/);assert.match(prop,/createCatalogHomeMesh/);
  assert.match(island,/RUSTIC_CABIN_3D_PALETTE/);assert.match(island,/createCatalogHomeMesh/);
  assert.match(molly,/cabinProps=/);assert.match(molly,/generated\/placeables/);
});

test('W19 visible family spelling remains Lizzy or Elizabeth, never Lizzie',()=>{
  for(const f of ['public/app.js','public/new-games.html','public/cabin.js','public/arcade-tutorials.mjs','public/phase-w-platform.mjs'])assert.doesNotMatch(read(f),/\bLizzie\b/,f);
});
