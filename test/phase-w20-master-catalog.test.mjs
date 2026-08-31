import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {CABIN_ROOM_ITEM_CATALOG,CABIN_ROOM_ITEM_BY_ID} from '../public/cabin-room-catalog.mjs';
import {COSMETIC_CATALOG,COSMETIC_BY_ID,fitProfileForAvatar,normalizeEquipped} from '../public/avatar-cosmetics.mjs';
import {HOME_COLLECTIONS,WEARABLE_COLLECTIONS,W20_HOME_ALLOCATION,W20_WEARABLE_ALLOCATION,APPROVED_CATALOG_PREVIEW} from '../public/w20-catalog-meta.mjs';
import {GameHub} from '../worker.mjs';

const root=path.resolve(new URL('..',import.meta.url).pathname);
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const W20='GAME-NIGHT-STAGING-PHASE-W20-MASTER-CATALOG-42';
const W21='GAME-NIGHT-STAGING-PHASE-W21-TRUE3D-WORLD-PROPS-GAMEPLAY-43';
const W22='GAME-NIGHT-STAGING-PHASE-W29-FAMILY-V1-CANDIDATES-53';
const countBy=(rows,key)=>Object.fromEntries([...new Set(rows.map(x=>x[key]))].sort().map(v=>[v,rows.filter(x=>x[key]===v).length]));

test('W20 catalog milestone remains preserved while W22 is current',()=>{
  assert.equal(read('CURRENT_RELEASE.txt').trim(),W22);
  assert.equal(read('DESIGN_RELEASE.txt').trim(),'GAME-NIGHT-DESIGN-PHASE-W29-FAMILY-V1-CANDIDATES-53');
  assert.equal(JSON.parse(read('package.json')).version,'3.26.0-staging-phase-w29-family-v1-candidates-53');
  const app=read('public/app.js'),sw=read('public/sw.js');
  assert.match(app,/PHASE_W18_RELEASE='GAME-NIGHT-STAGING-PHASE-W18-GAMEPLAY-REALISM-40'/);
  assert.match(app,/PHASE_W19_RELEASE='GAME-NIGHT-STAGING-PHASE-W19-CABIN-ART-AVATAR-41'/);
  assert.match(app,/PHASE_W20_RELEASE='GAME-NIGHT-STAGING-PHASE-W20-MASTER-CATALOG-42'/);
  assert.match(app,/CURRENT_BUILD=PHASE_W29_RELEASE/);
  assert.match(sw,/PHASE_W19_CACHE='black-family-game-night-staging-phase-w19-cabin-art-avatar-41'/);
  assert.match(sw,/PHASE_W20_CACHE='black-family-game-night-staging-phase-w20-master-catalog-42'/);
  assert.match(sw,/const CACHE=PHASE_W29_CACHE/);
});

test('W20 has exactly 2,000 home records and the approved category allocation',()=>{
  assert.equal(CABIN_ROOM_ITEM_CATALOG.length,2000);
  assert.deepEqual(countBy(CABIN_ROOM_ITEM_CATALOG,'Category'),Object.fromEntries(Object.entries(W20_HOME_ALLOCATION).sort(([a],[b])=>a.localeCompare(b))));
  assert.equal(new Set(CABIN_ROOM_ITEM_CATALOG.map(x=>x['Item ID'])).size,2000);
  assert.equal(CABIN_ROOM_ITEM_CATALOG.filter(x=>x['Legacy Preserved']==='Yes').length,400);
  assert.ok(HOME_COLLECTIONS.length>=30);
  assert.ok(HOME_COLLECTIONS.some(x=>x.Collection==='Papa’s Old Shop'));
  assert.ok(HOME_COLLECTIONS.some(x=>x.Collection==='Lizzy Ballet'));
});

test('W20 has exactly 2,000 wearable records and the approved category allocation',()=>{
  assert.equal(COSMETIC_CATALOG.length,2000);
  assert.deepEqual(countBy(COSMETIC_CATALOG,'category'),Object.fromEntries(Object.entries(W20_WEARABLE_ALLOCATION).sort(([a],[b])=>a.localeCompare(b))));
  assert.equal(new Set(COSMETIC_CATALOG.map(x=>x.id)).size,2000);
  assert.equal(COSMETIC_CATALOG.filter(x=>x.legacyPreserved).length,154);
  assert.ok(WEARABLE_COLLECTIONS.length>=31);
  assert.ok(WEARABLE_COLLECTIONS.some(x=>x.Collection==='Pet Party'));
  assert.ok(WEARABLE_COLLECTIONS.some(x=>x.Collection==='Lizzy Ballet Glam'));
});

test('all W20 home browse and placement assets are individually identifiable and all wearable vectors are unique',()=>{
  const thumbHashes=new Set(),placeHashes=new Set(),wearHashes=new Set();
  for(const x of CABIN_ROOM_ITEM_CATALOG){const id=x['Item ID'],t=path.join(root,'public/cabin-assets/generated/thumbs',id+'.svg'),p=path.join(root,'public/cabin-assets/generated/placeables',id+'.svg');assert.ok(fs.existsSync(t),id+' thumb');assert.ok(fs.existsSync(p),id+' placeable');thumbHashes.add(crypto.createHash('sha256').update(fs.readFileSync(t)).digest('hex'));placeHashes.add(crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex'))}
  for(const x of COSMETIC_CATALOG){const p=path.join(root,'public',x.asset.replace(/^\//,''));assert.ok(fs.existsSync(p),x.id+' wearable');wearHashes.add(crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex'))}
  assert.equal(thumbHashes.size,2000);assert.equal(placeHashes.size,2000);assert.equal(wearHashes.size,2000);
});

test('W20 universal fitting keeps every wearable visible on every family avatar and migrates legacy slot saves',()=>{
  const avatars=['john','kristen','holly','vanessa','elizabeth','logan','james','dorothy','papa','nana','kelsi','molly','gunner'];
  for(const avatar of avatars)for(const item of COSMETIC_CATALOG){const f=fitProfileForAvatar(avatar,item.slot,item,0);assert.equal(f.hidden,false,`${avatar}/${item.id}`);assert.ok(Number.isFinite(f.x)&&Number.isFinite(f.y)&&Number.isFinite(f.w),`${avatar}/${item.id}`)}
  const eq=normalizeEquipped({glasses:'round-glasses',jewelry:'gold-chain',hat:'camp-cap'});
  assert.equal(eq.glasses,'round-glasses');assert.equal(eq.neck,'gold-chain');assert.equal(eq.hat,'camp-cap');
  const bandana=normalizeEquipped({accessory:'red-bandana'});assert.equal(bandana.neck,'red-bandana');
});

test('W20 catalog store is scalable, searchable, collection-driven and keeps the approved visual target visible',()=>{
  const h=read('public/tokens-store.html');
  for(const token of ['Search production items','categoryFilter','collectionFilter','rarityFilter','sortFilter','loadMore','4,000','Production Shop','Concept / Coming Soon','Approved Lookbook','master-catalog-preview-w20.png'])assert.ok(h.includes(token),token);
  assert.ok(fs.existsSync(path.join(root,'public',APPROVED_CATALOG_PREVIEW.replace(/^\//,''))));
});

test('W20 cabin preserves W19 rooms, retains bare-shell migration for older rooms and supports owned architectural finishes',async()=>{
  class MemoryStorage{constructor(){this.map=new Map()}async list({prefix=''}={}){return new Map([...this.map].filter(([k])=>k.startsWith(prefix)))}async get(k){return this.map.get(k)}async put(k,v){this.map.set(k,structuredClone(v))}}
  const storage=new MemoryStorage(),hub=new GameHub({storage,waitUntil(){}},{});
  const oldPlacement={id:'kept',itemId:'buy-with-game-night-tokens-everyday-basics-pine-single-bed',x:3,z:4,rotation:90,surface:'floor'};
  await storage.put('cabin-room:kristen',{roomKey:'kristen',ownerProfileId:'p1',ownerName:'Kristen',ownerAvatar:'kristen',wallpaper:'bare-pine-wall',flooring:'bare-pine-floor',placements:[oldPlacement],guestbook:[],reactions:[],decorVersion:19,updatedAt:1});
  let room=await hub.getCabinRoom('kristen');assert.equal(room.decorVersion,21);assert.equal(room.placements.length,1);assert.equal(room.placements[0].id,'kept');
  await storage.put('cabin-room:john',{roomKey:'john',ownerProfileId:'j1',ownerName:'John',ownerAvatar:'john',wallpaper:'old',flooring:'old',placements:[oldPlacement],guestbook:[],reactions:[],decorVersion:18,updatedAt:1});
  room=await hub.getCabinRoom('john');assert.equal(room.decorVersion,21);assert.deepEqual(room.placements,[]);assert.equal(room.wallpaper,'bare-pine-wall');
  const finish=CABIN_ROOM_ITEM_CATALOG.find(x=>x.Category==='Architectural Finishes'&&String(x['Placement Surface']).includes('Wall'));assert.ok(finish);
  await storage.put('arcade-profile:p1',{profileId:'p1',name:'Kristen',tokens:0,cosmetics:{},equippedCosmetics:{},cabinBlueprints:{[finish['Item ID']]:{unlockedAt:1,source:'test'}}});
  room=await hub.updateCabinRoom({profileId:'p1',name:'Kristen',avatar:'kristen',roomKey:'kristen',action:'save',placements:[oldPlacement],wallpaper:finish['Item ID'],flooring:'bare-pine-floor'});assert.equal(room.wallpaper,finish['Item ID']);assert.equal(room.placements.length,1);
});

test('W20 shared catalog art is visibly integrated into the four priority 3D experiences',()=>{
  const mystery=read('public/new-games.html'),prop=read('public/prop-hunt-3d.js'),island=read('public/island-life.js'),molly=read('public/mollys-light-chase.html'),kit=read('public/shared-3d-art-kit.mjs');
  assert.match(mystery,/home-flagship-h008-papa-s-worn-yellow-chair/);assert.match(mystery,/home-flagship-h085-dog-treat-station/);
  assert.match(prop,/W20 catalog integration/);assert.match(prop,/createCatalogHomeMesh/);assert.match(prop,/home-flagship-h095-john-s-wrench-display/);
  assert.match(island,/CABIN_ROOM_ITEM_BY_ID/);assert.match(island,/createCatalogHomeMesh/);assert.match(island,/home-flagship-h096-kristen-layered-linen-bed/);
  assert.match(molly,/home-flagship-h085-dog-treat-station/);assert.match(kit,/not a claim that all 2,000 home records are hand-sculpted GLBs/);
});

test('W20 player-facing family spelling stays Lizzy or Elizabeth, never Lizzie',()=>{
  for(const f of ['public/app.js','public/new-games.html','public/cabin.js','public/tokens-store.html','public/arcade-tutorials.mjs','public/phase-w-platform.mjs'])assert.doesNotMatch(read(f),/\bLizzie\b/,f);
});
