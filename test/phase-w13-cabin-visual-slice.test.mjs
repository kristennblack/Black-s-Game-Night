import test from 'node:test';
import assert from 'node:assert/strict';
import {CABIN_ROOM_ITEM_CATALOG} from '../public/cabin-room-catalog.mjs';
import {CABIN_FAMILY_ROOMS,STARTER_ROOM,GUEST_HOUSE,rotate90,snapPlacement,footprintFor,isPlacementInsideRoom,catalogSummary,filterCatalog,canEditRoom} from '../public/cabin-rooms-visual-core.mjs';

test('W13 visual slice loads the exact 400-item catalog distribution',()=>{
 const s=catalogSummary();
 assert.equal(s.total,400);
 assert.equal(s.sourceCounts['Buy with Game Night Tokens'],175);
 assert.equal(s.sourceCounts['Win in Arcade'],144);
 assert.equal(s.sourceCounts['Achievement Reward'],6);
 assert.equal(s.sourceCounts['Birthday / Seasonal Reward'],35);
 assert.equal(s.sourceCounts['Collection Completion Reward'],20);
 assert.equal(s.sourceCounts['Secret / Prestige'],20);
 assert.equal(s.secretCount,20);
});

test('W13 cabin has ten permanent named family rooms and permanent expandable guest house',()=>{
 assert.deepEqual(CABIN_FAMILY_ROOMS,['John','Kristen','Holly','Vanessa','Lizzie','Logan','James','Dorothy','Papa','Nana']);
 assert.equal(new Set(CABIN_FAMILY_ROOMS).size,10);
 assert.equal(GUEST_HOUSE.permanent,true);
 assert.equal(GUEST_HOUSE.expandable,true);
 assert.equal(GUEST_HOUSE.upgradeable,true);
});

test('W13 starter room is 14x16 with half-foot snapping and 90-degree rotation',()=>{
 assert.equal(STARTER_ROOM.widthFt,14);
 assert.equal(STARTER_ROOM.depthFt,16);
 assert.equal(STARTER_ROOM.gridStepFt,.5);
 assert.deepEqual(snapPlacement({x:1.24,z:3.76,rotation:88}),{x:1,z:4,rotation:90});
 assert.equal(rotate90(0),90);
 assert.equal(rotate90(90,-1),0);
 assert.equal(rotate90(270),0);
});

test('W13 furniture footprints rotate and placement rejects pieces outside room',()=>{
 const bed=CABIN_ROOM_ITEM_CATALOG.find(x=>x['Item Name']==='Double Cabin Bed');
 assert.ok(bed);
 assert.deepEqual(footprintFor(bed,0),{w:2,d:3});
 assert.deepEqual(footprintFor(bed,90),{w:3,d:2});
 assert.equal(isPlacementInsideRoom(bed,{x:10,z:10,rotation:0}),true);
 assert.equal(isPlacementInsideRoom(bed,{x:13,z:15,rotation:0}),false);
});

test('W13 collection book search/filter works and secrets remain secret-designated',()=>{
 assert.ok(filterCatalog({category:'Electronics'}).length>0);
 assert.ok(filterCatalog({query:'tv'}).some(x=>/tv/i.test(x['Item Name'])));
 assert.equal(CABIN_ROOM_ITEM_CATALOG.filter(x=>x.Secret==='Yes').length,20);
});

test('W13 visitor editing is owner-only',()=>{
 assert.equal(canEditRoom({viewerId:'kristen',ownerId:'kristen'}),true);
 assert.equal(canEditRoom({viewerId:'john',ownerId:'kristen'}),false);
});
