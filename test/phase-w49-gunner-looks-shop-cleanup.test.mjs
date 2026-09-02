import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,access,stat} from 'node:fs/promises';
import {GameHub} from '../worker.mjs';
import {GUNNER_LOOKS,GUNNER_LOOK_BY_ID,normalizeGunnerLooks} from '../public/gunner-looks-catalog.mjs';

class MemoryStorage{constructor(){this.map=new Map()}async list({prefix=''}={}){return new Map([...this.map].filter(([k])=>k.startsWith(prefix)))}async get(k){return this.map.get(k)}async put(k,v){this.map.set(k,structuredClone(v))}}
function makeHub(){const storage=new MemoryStorage(),ctx={storage,waitUntil(){}};return {hub:new GameHub(ctx,{}),storage}}
const text=async p=>readFile(new URL(p,import.meta.url),'utf8');

test('W49 Gunner catalog contains exactly 30 approved complete looks and fresh runtime portraits',async()=>{
  assert.equal(GUNNER_LOOKS.length,30);assert.equal(new Set(GUNNER_LOOKS.map(x=>x.id)).size,30);
  assert.equal(GUNNER_LOOKS[0].name,'Everyday Gunner');assert.equal(GUNNER_LOOKS[29].name,'Sleepy Sweater Gunner');
  for(const x of GUNNER_LOOKS){assert.equal(GUNNER_LOOK_BY_ID[x.id].name,x.name);const url=new URL(`../public/look-assets/${x.id}.jpg`,import.meta.url);await access(url);assert.ok((await stat(url)).size>30000)}
  assert.ok(normalizeGunnerLooks({})['gunner-look-01']);
  await access(new URL('../visual_proofs/gunner_30_looks/GUNNER_APPROVED_GAME_AVATAR_SOURCE.png',import.meta.url));
  await access(new URL('../visual_proofs/gunner_30_looks/GUNNER_30_APPROVED_LOOKS.png',import.meta.url));
  await access(new URL('../visual_proofs/gunner_30_looks/GUNNER_30_RUNTIME_LOOKS_PROOF.jpg',import.meta.url));
});

test('W49 Gunner Looks Shop purchases, grants and equips server-side',async()=>{
  const {hub}=makeHub();await hub.ready;let p=await hub.recordArcade({profileId:'gunner-shop-user',name:'Gunner',achievement:'seed',label:'Seed',tokenDelta:250});
  p=await hub.updateFamilyLook({profileId:'gunner-shop-user',character:'gunner',action:'buy',itemId:'gunner-look-04'});assert.ok(p.gunnerLooks['gunner-look-04']);assert.equal(p.tokens,165);
  p=await hub.updateFamilyLook({profileId:'gunner-shop-user',character:'gunner',action:'grant',itemId:'gunner-look-14',rewardKey:'good-boy-gunner'});assert.equal(p.gunnerLooks['gunner-look-14'].source,'reward');
  p=await hub.updateFamilyLook({profileId:'gunner-shop-user',character:'gunner',action:'equip',itemId:'gunner-look-14'});assert.equal(p.equippedGunnerLook,'gunner-look-14');
  await assert.rejects(()=>hub.updateFamilyLook({profileId:'gunner-shop-user',character:'gunner',action:'equip',itemId:'gunner-look-30'}),/Unlock this Gunner look first/);
});

test('W49 unified Looks Shop exposes John Holly and Gunner and uses repaired fresh asset paths',async()=>{
  const shop=await text('../public/looks-shop.html'),app=await text('../public/app.js');
  for(const name of ['John · 30 Looks','Holly · 30 Looks','Gunner · 30 Looks'])assert.match(shop,new RegExp(name.replace('·','\\·')));
  assert.match(shop,/gunner-looks-catalog\.mjs/);assert.match(shop,/\/look-assets\/\$\{id\}\.jpg\?v=W49/);assert.match(shop,/fallback:\'\/avatars\/holly\.png\'/);assert.match(shop,/fallback:\'\/avatars\/john-black\.png\'/);
  assert.match(app,/completeLookAsset/);assert.match(app,/\/look-assets\/\$\{id\}\.jpg\?v=W49/);assert.match(app,/gunnerLookIsOwned/);
  for(const who of ['john','holly'])for(let i=1;i<=30;i++){const url=new URL(`../public/look-assets/${who}-look-${String(i).padStart(2,'0')}.jpg`,import.meta.url);await access(url);assert.ok((await stat(url)).size>30000)}
});

test('W49 Gunner arcade games grant three real Gunner shop rewards',async()=>{
  const goat=await text('../public/gunners-goat-run.html'),snack=await text('../public/gunners-snack-attack.html');
  assert.match(goat,/gunner-look-07/);assert.match(goat,/gunner-goat-first-save/);assert.match(goat,/gunner-look-14/);assert.match(goat,/good-boy-gunner/);assert.match(goat,/character:'gunner',action:'grant'/);
  assert.match(snack,/gunner-look-24/);assert.match(snack,/gunner-snack-attack/);assert.match(snack,/character:'gunner',action:'grant'/);
});

test('W49 player-facing shopping is simplified to Looks Shop and Cabin Room Shop',async()=>{
  const room=await text('../public/cabin-room-shop.html'),cabin=await text('../public/cabin.js'),index=await text('../public/index.html'),tokens=await text('../public/tokens-store.html');
  assert.match(room,/Cabin Room Shop/);assert.match(room,/CABIN_ROOM_ITEM_CATALOG/);assert.match(room,/\/api\/cabin\/item/);assert.match(room,/Looks Shop/);
  assert.match(cabin,/\/looks-shop\.html/);assert.match(cabin,/\/cabin-room-shop\.html/);const playerCabin=cabin.replace(/^\/\/.*$/gm,'');assert.doesNotMatch(playerCabin,/4,000 Item Catalog|2,000 World Props|Open Production Shop|QA Pending/);
  assert.doesNotMatch(index,/Catalog Approval Studio/);assert.match(tokens,/location\.replace\('\/cabin-room-shop\.html'\)/);
  for(const [file,target] of [['../public/w25-production-lab.html','cabin-room-shop'],['../public/w27-john-head-fit-lab.html','looks-shop'],['../public/w29-family-v1-lab.html','looks-shop'],['../public/catalog-approval-studio.html','cabin-room-shop']])assert.match(await text(file),new RegExp(`location\\.replace\\('[^']*${target}`));
});

test('W49 service worker refreshes cache and contains both shops plus all 90 fresh look portraits',async()=>{
  const sw=await text('../public/sw.js');assert.match(sw,/PHASE_W49_CACHE/);assert.match(sw,/RUNTIME_CACHE=PHASE_W49_CACHE/);assert.match(sw,/\/cabin-room-shop\.html/);assert.match(sw,/\/gunner-looks-catalog\.mjs/);
  for(const who of ['john','holly','gunner'])for(let i=1;i<=30;i++)assert.match(sw,new RegExp(`look-assets/${who}-look-${String(i).padStart(2,'0')}\\.jpg`));
});
