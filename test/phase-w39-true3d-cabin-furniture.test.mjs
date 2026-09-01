import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {CABIN_ROOM_ITEM_BY_ID,CABIN_ROOM_ITEM_CATALOG} from '../public/cabin-room-catalog.mjs';
import {W25_HOME_PRODUCTION} from '../public/w25-production-manifest.mjs';
import {inferW39FurnitureFamily,w39PhysicalFootprintFt,w39BenchmarkRoom,W39_BENCHMARK_IDS} from '../public/w39-cabin-furniture.mjs';
import {validateCabinPlacement,physicalFootprintForItem} from '../public/cabin-placement-validation.mjs';
import {STARTER_CABIN_BLUEPRINT_IDS} from '../public/cabin-progression.mjs';
import {GameHub} from '../worker.mjs';

const root=path.resolve(new URL('..',import.meta.url).pathname);
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const item=name=>CABIN_ROOM_ITEM_CATALOG.find(x=>x['Item Name']===name);

class MemoryStorage{constructor(){this.map=new Map()}async list({prefix=''}={}){return new Map([...this.map].filter(([k])=>k.startsWith(prefix)))}async get(k){return this.map.get(k)}async put(k,v){this.map.set(k,structuredClone(v))}}
const hub=()=>new GameHub({storage:new MemoryStorage(),waitUntil(){}},{});

test('W39 candidate preserves official release truth while establishing a separate furniture gate',()=>{
  assert.equal(read('CURRENT_RELEASE.txt').trim(),'GAME-NIGHT-STAGING-PHASE-W30-PROP-HUNT-P0-GAMEPLAY-54');
  assert.match(read('W39_CABIN_FURNITURE_CANDIDATE.txt'),/W39-TRUE3D-CABIN-FURNITURE-58/);
  assert.match(read('W39_CABIN_FURNITURE_CANDIDATE.txt'),/Actual WebGL device screenshot\/video/);
});

test('W39 identifies distinct furniture silhouettes instead of collapsing them by broad category',()=>{
  const cases=[
    ['Deep Hearth Sofa','sofa'],['Stitched Walnut Rocking Chair','rocking-chair'],['Carved Elk Canopy Bed','canopy-bed'],
    ['Slatted Wardrobe','wardrobe'],['Fold-Down Cabin Writing Desk','writing-desk'],['Blush Chaise Lounge','chaise'],['Glass Trophy Hutch','hutch']
  ];
  for(const [name,family] of cases){const x=item(name);assert.ok(x,name);assert.equal(inferW39FurnitureFamily(x),family,name)}
});

test('W39 physical furniture footprints are separated from old grid-like catalog footprints',()=>{
  const bed=item('Pine Single Bed'),sofa=item('Deep Hearth Sofa'),chair=item("Kristen's Cozy Lodge Reading Chair");
  assert.deepEqual(w39PhysicalFootprintFt(bed),{w:3.5,d:6.5,h:4.1});
  assert.ok(w39PhysicalFootprintFt(sofa).w>=7);
  const exact=physicalFootprintForItem(chair,0);assert.ok(exact.w>4&&exact.w<4.2);assert.ok(exact.d>2.6&&exact.d<2.8);
  assert.notEqual(Number(bed['Footprint D']),w39PhysicalFootprintFt(bed).d);
});

test('W39 shared placement validator rejects bad surface, wall penetration and furniture overlap while allowing rugs to layer',()=>{
  const bed=item('Pine Single Bed'),chair=item('Basic Desk Chair'),rug=item('Neutral Woven Rug'),tv=item('Wall-Mounted TV');
  const bedQ={id:'bed',itemId:bed['Item ID'],x:.5,z:.5,rotation:0,surface:'floor'};
  assert.equal(validateCabinPlacement(bed,bedQ,{placements:[],catalogById:CABIN_ROOM_ITEM_BY_ID}).ok,true);
  assert.equal(validateCabinPlacement(bed,{...bedQ,surface:'wall'},{placements:[],catalogById:CABIN_ROOM_ITEM_BY_ID}).code,'unsupported_surface');
  assert.equal(validateCabinPlacement(bed,{...bedQ,x:12},{placements:[],catalogById:CABIN_ROOM_ITEM_BY_ID}).code,'out_of_bounds');
  assert.equal(validateCabinPlacement(chair,{id:'chair',itemId:chair['Item ID'],x:1,z:1,rotation:0,surface:'floor'},{placements:[bedQ],catalogById:CABIN_ROOM_ITEM_BY_ID}).code,'overlap');
  assert.equal(validateCabinPlacement(rug,{id:'rug',itemId:rug['Item ID'],x:1,z:1,rotation:0,surface:'floor'},{placements:[bedQ],catalogById:CABIN_ROOM_ITEM_BY_ID}).ok,true);
  assert.equal(validateCabinPlacement(tv,{id:'tv',itemId:tv['Item ID'],x:5,z:5,rotation:0,surface:'wall'},{placements:[],catalogById:CABIN_ROOM_ITEM_BY_ID}).ok,true);
});

test('W39 server enforces the same physical placement rule for modified/new furniture',async()=>{
  const h=hub(),bedId=STARTER_CABIN_BLUEPRINT_IDS[0],chairId=STARTER_CABIN_BLUEPRINT_IDS[2];
  const base=await h.updateCabinRoom({profileId:'k',name:'Kristen',avatar:'kristen',roomKey:'kristen',action:'save',wallpaper:'bare-pine-wall',flooring:'bare-pine-floor',placements:[{id:'bed',itemId:bedId,x:.5,z:.5,rotation:0,surface:'floor'}]});
  assert.equal(base.placements.length,1);
  await assert.rejects(()=>h.updateCabinRoom({profileId:'k',name:'Kristen',avatar:'kristen',roomKey:'kristen',action:'save',wallpaper:'bare-pine-wall',flooring:'bare-pine-floor',placements:[...base.placements,{id:'chair',itemId:chairId,x:1,z:1,rotation:0,surface:'floor'}]}),/overlaps/i);
  await assert.rejects(()=>h.updateCabinRoom({profileId:'k',name:'Kristen',avatar:'kristen',roomKey:'kristen',action:'save',wallpaper:'bare-pine-wall',flooring:'bare-pine-floor',placements:[{...base.placements[0],surface:'wall'}]}),/cannot be placed on the wall/i);
});

test('W39 carries measured physical bounds and interaction hooks on all four W25 home GLBs',()=>{
  const ids=Object.keys(W25_HOME_PRODUCTION);assert.equal(ids.length,4);
  for(const id of ids){const s=W25_HOME_PRODUCTION[id];assert.ok(s.physical?.w>0&&s.physical?.h>0&&s.physical?.d>0,id);assert.ok(s.interaction,id)}
  assert.equal(W25_HOME_PRODUCTION['buy-with-game-night-tokens-everyday-basics-double-cabin-bed'].interaction,'sleep');
});

test('W39 benchmark is a real renderer route with 8 representative objects and production GLB QA state',()=>{
  const page=read('public/cabin-furniture-benchmark.html'),room=w39BenchmarkRoom();
  assert.equal(room.placements.length,8);assert.equal(Object.keys(W39_BENCHMARK_IDS).length,8);
  assert.match(page,/mountCabinRoom3D/);assert.match(page,/benchmarkMode:true/);assert.match(page,/getQAState/);assert.match(page,/does not alter ownership or room saves/);
  assert.doesNotMatch(page,/generated target|AI mock/i);
});

test('W39 main cabin promotes design-specific 3D fallback before the legacy category-generic bridge',()=>{
  const room=read('public/cabin-3d-room.mjs');
  assert.match(room,/createW39CabinFurnitureMesh\(THREE,art,item\)\|\|art\.createCatalogHomeMesh/);
  assert.match(room,/w39-design-specific-fallback/);assert.match(room,/production-qa-glb/);assert.match(room,/enhanceW39ProductionMaterials/);
  assert.match(read('public/w39-cabin-furniture.mjs'),/w39PhysicalScaleApplied=true/);
  assert.match(room,/placementWorld\(q,item\)/);assert.match(room,/worldPlacement\(v,surface='floor',item=null,rotation=0\)/);
});

test('W39 client does not silently convert an explicit server rejection into a local successful save',()=>{
  const js=read('public/cabin.js');
  assert.match(js,/err\.serverRejected=true/);assert.match(js,/if\(err\?\.serverRejected\|\|response\)throw err/);
  assert.match(js,/validateCabinPlacement/);assert.match(js,/No valid open space is available/);
});

test('W39 high-confidence metadata repair fixes known furniture routing defects without approving the art',()=>{
  const cases=[['Carved Elk Canopy Bed','Canopy Bed'],['Deep Hearth Sofa','Sofa'],['Stitched Walnut Rocking Chair','Rocking Chair'],['Butcher Block Farm Table','Farm Table'],['Glass Trophy Hutch','Hutch']];
  for(const [name,sub] of cases){const x=item(name);assert.equal(x.Subcategory,sub,name);assert.equal(x['W39 Subcategory Repair'],'Yes',name);assert.notEqual(x['Approved For Live'],'Yes',name)}
  assert.ok(CABIN_ROOM_ITEM_CATALOG.filter(x=>x['W39 Subcategory Repair']==='Yes').length>=300);
});
