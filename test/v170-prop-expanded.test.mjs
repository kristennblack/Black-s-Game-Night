import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const js=fs.readFileSync(new URL('../public/prop-hunt-3d.js',import.meta.url),'utf8');
const css=fs.readFileSync(new URL('../public/prop-hunt-3d.css',import.meta.url),'utf8');
const sw=fs.readFileSync(new URL('../public/sw.js',import.meta.url),'utf8');

test('v1.7 expands all four Prop Hunt worlds',()=>{
  for(const name of ['WORKSHOP ANNEX','GROUP CAMPSITE','GOAT BARN','TRACTOR SHED','SILO INTERIOR','DUGOUT DOCK']) assert.ok(js.includes(name),name);
  assert.ok(js.includes('expandedMaps:true'));
  assert.ok(js.includes('roomClutter:true'));
});

test('v1.7 adds dense room clutter and expanded prop art',()=>{
  assert.ok(js.includes('for(let zi=0;zi<map.zones.length;zi++)'));
  for(const prop of ['Table Lamp','Kettle','Pie','Loaf of Bread','Jam Jar','Wooden Chest','Blanket Stack','Apple Basket']) assert.ok(js.includes(prop),prop);
  assert.ok(js.includes("n.includes('table lamp')"));
  assert.ok(js.includes("n.includes('teddy')"));
});

test('v1.7 adds current-area HUD and mini-map',()=>{
  assert.ok(js.includes('ph3RoomChip'));
  assert.ok(js.includes('drawMiniMapHud(W,H)'));
  assert.ok(js.includes('roomMiniMap:true'));
  assert.ok(css.includes('.ph3d-room-chip'));
});

test('v1.7 packages approved expanded art references',()=>{
  for(const f of ['prop-hunt-expanded-cabin-rooms.png','prop-hunt-expanded-props.png','prop-hunt-expanded-hud.png','prop-hunt-cabin-map.png','prop-hunt-expanded-farm-overview.png']) assert.ok(fs.existsSync(new URL('../public/'+f,import.meta.url)),f);
  assert.ok(sw.includes('black-family-game-night-v180-prop-redesign-test'));
});
