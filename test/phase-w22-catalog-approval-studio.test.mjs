import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const root=new URL('../',import.meta.url).pathname;
const read=p=>fs.readFileSync(root+p,'utf8');
const json=p=>JSON.parse(read(p));

test('W22 review manifest covers all 6,000 catalog records in 60 exact 100-item batches',()=>{
  const j=json('public/catalog-review-w22.json');
  assert.equal(j.meta.total,6000);
  assert.deepEqual(j.meta.catalogCounts,{Home:2000,Avatar:2000,'World Props':2000});
  assert.equal(j.meta.batchSize,100);
  assert.equal(j.meta.batchCount,60);
  assert.equal(j.batches.length,60);
  assert.equal(j.items.length,6000);
  assert.ok(j.batches.every(b=>b.count===100));
  assert.equal(new Set(j.items.map(x=>x.reviewId)).size,6000);
  assert.ok(j.items.every(x=>x.pipelineStatus==='Concept'&&x.reviewDecision==='Unreviewed'&&x.approvedForLive===false));
});

test('first review batch is Cabin Home Essentials and contains only 100 home items',()=>{
  const j=json('public/catalog-review-w22.json');
  const b=j.items.filter(x=>x.batch===1);
  assert.equal(b.length,100);
  assert.ok(b.every(x=>x.catalog==='Home'));
  assert.ok(b.every(x=>x.priorityLabel==='Cabin Home Essentials'));
  assert.ok(b.some(x=>x.collection==='Everyday Basics'));
  assert.ok(b.some(x=>x.collection==='Rustic Pine'));
});

test('source catalogs carry explicit art status and are blocked from live promotion by default',()=>{
  const home=json('public/cabin-room-catalog-w20.json');
  const wear=json('public/wearable-catalog-w20.json');
  const world=json('public/world-prop-catalog-w21.json');
  const w25Home=home.filter(x=>x['W25 Production']==='Yes');const w25Wear=wear.filter(x=>x.catalogVersion===25&&x.productionAssetReady===true);
  assert.equal(w25Home.length,4);assert.equal(w25Wear.length,4);
  assert.ok(home.every(x=>x['Approved For Live']==='No'&&typeof x['Art Status']==='string'&&typeof x['Review Status']==='string'));
  assert.ok(wear.every(x=>x.approvedForLive===false&&typeof x.artStatus==='string'&&typeof x.reviewStatus==='string'));
  assert.ok(world.every(x=>x['Approved For Live']==='No'&&typeof x['Art Status']==='string'&&typeof x['Review Status']==='string'));
});

test('approval studio includes all three approved review formats and decision export/import',()=>{
  const h=read('public/catalog-approval-studio.html');
  const js=read('public/catalog-approval-studio.js');
  for(const s of ['Collection Lookbook','Grid / Board','Real-use Proof','approved-catalog-lookbook.png'])assert.match(h,new RegExp(s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')));
  for(const s of ['Export decisions JSON','Import decisions','Clear local decisions'])assert.match(h,new RegExp(s));
  assert.match(js,/localStorage/);
  assert.match(js,/BFGN_W22_Catalog_Review_Decisions\.json/);
  assert.match(js,/Approve Concept/);
  assert.match(js,/Needs Changes/);
  assert.match(js,/Reject/);
});

test('real-use proof supports room, avatar, and world prop contexts',()=>{
  const js=read('public/catalog-approval-studio.js');
  const proof=read('public/catalog-proof-3d.mjs');
  assert.match(js,/mountHomeProof/);
  assert.match(js,/mountWorldProof/);
  assert.match(js,/fitProfileForAvatar/);
  assert.match(proof,/createCatalogHomeMesh/);
  assert.match(proof,/createWorldPropMesh/);
});

test('staging store clearly separates W25 production assets from unfinished concepts and keeps release gates closed',()=>{
  const h=read('public/tokens-store.html');
  assert.match(h,/W25 PRODUCTION SLICE/);
  assert.match(h,/Approval Studio/);
  assert.match(h,/CONCEPT \/ COMING SOON/);
  assert.match(h,/Device Approval Pending/);
  assert.match(h,/cannot be unlocked yet/);
});
