import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,access,stat} from 'node:fs/promises';
import {GameHub} from '../worker.mjs';
import {HOLLY_LOOKS,HOLLY_LOOK_BY_ID,normalizeHollyLooks} from '../public/holly-looks-catalog.mjs';

class MemoryStorage{
  constructor(){this.map=new Map()}
  async list({prefix=''}={}){return new Map([...this.map].filter(([k])=>k.startsWith(prefix)))}
  async get(k){return this.map.get(k)}
  async put(k,v){this.map.set(k,structuredClone(v))}
}
function makeHub(){const storage=new MemoryStorage(),waits=[];const ctx={storage,waitUntil(p){waits.push(Promise.resolve(p))}};return {hub:new GameHub(ctx,{}),storage}}

test('W48 Holly catalog contains exactly 30 approved complete looks with runtime portraits',async()=>{
  assert.equal(HOLLY_LOOKS.length,30);
  assert.equal(new Set(HOLLY_LOOKS.map(x=>x.id)).size,30);
  assert.equal(HOLLY_LOOKS[0].name,'Everyday Holly');
  assert.equal(HOLLY_LOOKS[29].name,'Weekend Cutie');
  for(const x of HOLLY_LOOKS){assert.equal(HOLLY_LOOK_BY_ID[x.id].name,x.name);const url=new URL(`../public/avatars/styles/${x.id}.jpg`,import.meta.url);await access(url);assert.ok((await stat(url)).size>50000)}
  const owned=normalizeHollyLooks({});assert.ok(owned['holly-look-01']);
  await access(new URL('../visual_proofs/holly_30_looks/HOLLY_APPROVED_GAME_AVATAR_SOURCE.png',import.meta.url));
  await access(new URL('../visual_proofs/holly_30_looks/HOLLY_30_APPROVED_LOOKS.png',import.meta.url));
  await access(new URL('../visual_proofs/holly_30_looks/HOLLY_30_RUNTIME_LOOKS_PROOF.jpg',import.meta.url));
});

test('W48 Looks Shop can buy, reward-grant and equip Holly looks server-side',async()=>{
  const {hub}=makeHub();await hub.ready;
  let p=await hub.recordArcade({profileId:'holly-shop-user',name:'Holly',achievement:'seed-tokens',label:'Seed',tokenDelta:250});
  assert.equal(p.tokens,250);
  p=await hub.updateFamilyLook({profileId:'holly-shop-user',name:'Holly',character:'holly',action:'buy',itemId:'holly-look-05'});
  assert.ok(p.hollyLooks['holly-look-05']);assert.equal(p.tokens,160);
  p=await hub.updateFamilyLook({profileId:'holly-shop-user',name:'Holly',character:'holly',action:'grant',itemId:'holly-look-13',rewardKey:'holly-memory-star'});
  assert.equal(p.hollyLooks['holly-look-13'].source,'reward');
  p=await hub.updateFamilyLook({profileId:'holly-shop-user',name:'Holly',character:'holly',action:'equip',itemId:'holly-look-13'});
  assert.equal(p.equippedHollyLook,'holly-look-13');
  await assert.rejects(()=>hub.updateFamilyLook({profileId:'holly-shop-user',character:'holly',action:'equip',itemId:'holly-look-30'}),/Unlock this Holly look first/);
});

test('W48 unified Looks Shop exposes John and Holly and labels winnable Holly looks',async()=>{
  const shop=await readFile(new URL('../public/looks-shop.html',import.meta.url),'utf8');
  assert.match(shop,/John · 30 Looks/);assert.match(shop,/Holly · 30 Looks/);assert.match(shop,/holly-looks-catalog\.mjs/);assert.match(shop,/WIN IT:/);assert.match(shop,/character,action,itemId/);
  const app=await readFile(new URL('../public/app.js',import.meta.url),'utf8');
  assert.match(app,/HOLLY_LOOK_CATALOG/);assert.match(app,/holly-look/);assert.match(app,/looks-shop\.html\?character=/);assert.match(app,/Complete John and Holly portrait artwork is not recoloured/);
});

test('W48 Holly Memory Mayhem can grant three real Holly shop rewards',async()=>{
  const game=await readFile(new URL('../public/hollys-memory-mayhem.html',import.meta.url),'utf8');
  assert.match(game,/holly-look-08/);assert.match(game,/holly-memory-first-win/);
  assert.match(game,/holly-look-13/);assert.match(game,/holly-memory-star/);
  assert.match(game,/holly-look-25/);assert.match(game,/holly-memory-hard-star/);
  assert.match(game,/character:'holly',action:'grant'/);
});

test('W48 service worker caches the unified Looks Shop, Holly catalog and all 30 Holly portraits',async()=>{
  const sw=await readFile(new URL('../public/sw.js',import.meta.url),'utf8');
  assert.match(sw,/PHASE_W48_CACHE/);assert.match(sw,/RUNTIME_CACHE=PHASE_W48_CACHE/);assert.match(sw,/\/looks-shop\.html/);assert.match(sw,/\/holly-looks-catalog\.mjs/);
  for(let i=1;i<=30;i++)assert.match(sw,new RegExp(`holly-look-${String(i).padStart(2,'0')}\\.jpg`));
});
