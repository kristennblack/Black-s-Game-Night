import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const here=path.dirname(fileURLToPath(import.meta.url));
const root=path.resolve(here,'..');
const js=fs.readFileSync(path.join(root,'public/prop-hunt-3d.js'),'utf8');
const sw=fs.readFileSync(path.join(root,'public/sw.js'),'utf8');

test('v1.10 includes realistic scene plate artwork for rooms and farm exteriors',()=>{
  for(const f of ['prop-hunt-realistic-room-plates.png','prop-hunt-realistic-farmstead.png','prop-hunt-realistic-prop-atlas.png']) assert.ok(fs.existsSync(path.join(root,'public',f)),f);
  assert.ok(js.includes('function drawRealisticScenePlate'));
  assert.ok(js.includes('realisticScenePlates:true'));
});

test('v1.10 adds a large second-generation prop sprite library',()=>{
  const dir=path.join(root,'public/prop-sprites-v2');
  const files=fs.readdirSync(dir).filter(x=>x.endsWith('.png'));
  assert.ok(files.length>=70,`expected >=70 v2 sprites, found ${files.length}`);
  for(const f of ['gas-can.png','oil-jug.png','toolbox-extra.png','welding-helmet.png','shop-vac.png','wheelbarrow.png','garbage-can.png','feed-bag.png','camp-chair.png','pool-float.png','watering-can.png','shovel.png','tire.png','pallet.png']) assert.ok(files.includes(f),f);
});

test('v1.10 maps former outline-only game props to image sprites',()=>{
  for(const token of ["return'gasCan'","return'oilJug'","return'toolbox'","return'weldingHelmet'","return'shopVac'","return'wheelbarrow'","return'campChair'","return'poolFloat'","return'wateringCan'","return'shovel'","return'tire'","return'pallet'"]) assert.ok(js.includes(token),token);
  assert.ok(js.includes("return'crate';"),'unmatched props should use an illustrated crate instead of procedural line art');
  assert.ok(js.includes('fullSpriteFallback:true'));
});

test('v1.10 keeps scenery, disguises and decoys on the same prop renderer',()=>{
  assert.ok(js.includes('const sprite=getPropSprite(type)'));
  assert.ok(js.includes('pushProp(commands,p'));
  assert.ok(js.includes("id:`d${Date.now()}"));
  assert.ok(js.includes('samePropArt:true'));
});

test('v1.10 increases room dressing density and ships a fresh service-worker cache',()=>{
  assert.ok(js.includes('Math.max(18,map.zoneClutter||12)'));
  assert.ok(js.includes('highDensityDressing:true'));
  assert.ok(sw.includes('black-family-game-night-v1100-prop-visual-test'));
  assert.ok((sw.match(/\/prop-sprites-v2\//g)||[]).length>=70);
  assert.ok(sw.includes('/prop-hunt-realistic-room-plates.png'));
});
