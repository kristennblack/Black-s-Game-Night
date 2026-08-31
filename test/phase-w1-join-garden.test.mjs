import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const read=p=>fs.readFileSync(new URL(`../${p}`,import.meta.url),'utf8');
const app=read('public/app.js');
const worker=read('worker.mjs');
const garden=read('public/dorothys-garden-merge.html');
const styles=read('public/styles.css');
const sw=read('public/sw.js');

test('home join request carries the live room and the other player name',()=>{
  assert.match(app,/data-join-room=/);
  assert.match(app,/roomId:el\.dataset\.joinRoom/);
  assert.match(app,/toName:el\.dataset\.joinHost/);
});

test('requester polls accepted and declined outcomes instead of going silent',()=>{
  assert.match(app,/req\.fromProfileId!==savedProfile\.profileId/);
  assert.match(app,/request declined/i);
  assert.match(app,/declined your request to join/i);
  assert.match(app,/phaseWClaimAcceptedJoin/);
});

test('accepted request can be claimed into the room safely',()=>{
  assert.match(worker,/action==='claim'/);
  assert.match(worker,/r\.status!=='accepted'/);
  assert.match(worker,/spectating=room\.game\.phase!=='lobby'/);
  assert.match(worker,/playerToken:existing\.token/);
  assert.match(app,/history\.replaceState\(\{\},'',`\/\?room=/);
});

test('active-match accepted players get a clear spectator state until the next game',()=>{
  assert.match(worker,/spectating:!!p\.spectating/);
  assert.match(app,/You’re in the room/);
  assert.match(app,/starts the next game/);
  assert.match(styles,/spectator-join-notice/);
});

test('Dorothy Garden uses named living plant stages rather than generic boxes',()=>{
  for(const name of ['Seed Packet','Tiny Sprout','Daisy Pot','Lavender Pot','Rose Planter','Peony Bed','Cottage Flower Bed','Blooming Trellis','Greenhouse Corner','Cottage Garden',"Dorothy's Family Garden"]) assert.match(garden,new RegExp(name.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')));
  assert.match(garden,/drawPlant/);
  assert.match(garden,/drawPreparedBed/);
  assert.match(garden,/READY TO MERGE/);
});

test('Dorothy Garden includes cottage progression, signature props and themed obstacles',()=>{
  for(const term of ['COTTAGE BEDS','BLOOMING WALK','GREENHOUSE CORNER','FAMILY GARDEN','Weeds','Tangled Roots','Garden Stone','Broken Pot','WATERING CAN','BIRDBATH']) assert.match(garden,new RegExp(term,'i'));
  assert.match(garden,/spawnBlockerForLevel/);
  assert.match(garden,/clearOneBlocker/);
  assert.match(garden,/emitPetals/);
});

test('W.1 cache/version marker is fresh',()=>{
  assert.match(app,/GAME-NIGHT-STAGING-PHASE-W1-JOIN-GARDEN-26/);
  assert.match(sw,/black-family-game-night-staging-phase-w1-join-garden-26/);
});
