import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,access} from 'node:fs/promises';
import {GameHub} from '../worker.mjs';
import {JOHN_LOOKS,JOHN_LOOK_BY_ID,normalizeJohnLooks} from '../public/john-looks-catalog.mjs';

class MemoryStorage{
  constructor(){this.map=new Map()}
  async list({prefix=''}={}){return new Map([...this.map].filter(([k])=>k.startsWith(prefix)))}
  async get(k){return this.map.get(k)}
  async put(k,v){this.map.set(k,structuredClone(v))}
}
function makeHub(){const storage=new MemoryStorage(),waits=[];const ctx={storage,waitUntil(p){waits.push(Promise.resolve(p))}};return {hub:new GameHub(ctx,{}),storage}}

test('W47 John catalog contains exactly 30 complete looks with packaged runtime portraits',async()=>{
  assert.equal(JOHN_LOOKS.length,30);
  assert.equal(new Set(JOHN_LOOKS.map(x=>x.id)).size,30);
  assert.equal(JOHN_LOOKS[0].name,'Everyday Check');
  assert.equal(JOHN_LOOKS[29].name,'Sunday Casual');
  for(const x of JOHN_LOOKS){assert.equal(JOHN_LOOK_BY_ID[x.id].name,x.name);await access(new URL(`../public/avatars/styles/${x.id}.jpg`,import.meta.url))}
  const owned=normalizeJohnLooks({});assert.ok(owned['john-look-01']);
});

test('W47 Looks Shop can buy and equip a full John look with Game Night Tokens',async()=>{
  const {hub}=makeHub();
  await hub.ready;
  let p=await hub.recordArcade({profileId:'john-shop-user',name:'John',achievement:'seed-tokens',label:'Seed',tokenDelta:200});
  assert.equal(p.tokens,200);
  p=await hub.updateJohnLook({profileId:'john-shop-user',name:'John',action:'buy',itemId:'john-look-08'});
  assert.ok(p.johnLooks['john-look-08']);
  assert.equal(p.tokens,110);
  p=await hub.updateJohnLook({profileId:'john-shop-user',name:'John',action:'equip',itemId:'john-look-08'});
  assert.equal(p.equippedJohnLook,'john-look-08');
  await assert.rejects(()=>hub.updateJohnLook({profileId:'john-shop-user',action:'equip',itemId:'john-look-30'}),/Unlock this John look first/);
});

test('W47 user-facing shop and avatar picker use the complete-look model',async()=>{
  const shop=await readFile(new URL('../public/john-looks-shop.html',import.meta.url),'utf8');
  const app=await readFile(new URL('../public/app.js',import.meta.url),'utf8');
  assert.match(shop,/Complete looks, not loose clothing pieces/);
  assert.match(shop,/JOHN_LOOKS/);
  assert.match(shop,/\/api\/arcade\/look/);
  assert.match(app,/Open John Looks Shop · 30 Looks/);
  assert.match(app,/isJohn\?normalizeEquipped\(\{\}\)/);
  assert.doesNotMatch(app,/all 16 Birthday Boy looks/);
});
