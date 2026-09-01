import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {CABIN_ROOM_ITEM_CATALOG,CABIN_ROOM_ITEM_BY_ID} from '../public/cabin-room-catalog.mjs';
import {COSMETIC_CATALOG,COSMETIC_BY_ID} from '../public/avatar-cosmetics.mjs';
import {W25_HOME_PRODUCTION,W25_COSMETIC_PRODUCTION,W25_PRODUCTION_IDS} from '../public/w25-production-manifest.mjs';
const root=path.resolve(new URL('..',import.meta.url).pathname);const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const runtime='GAME-NIGHT-STAGING-PHASE-W30-PROP-HUNT-P0-GAMEPLAY-54';
const design='GAME-NIGHT-DESIGN-PHASE-W30-PROP-HUNT-P0-GAMEPLAY-54';
const version='3.27.0-staging-phase-w30-prop-hunt-p0-gameplay-54';
const homeIds=Object.keys(W25_HOME_PRODUCTION),cosIds=Object.keys(W25_COSMETIC_PRODUCTION);

test('W25 release identity, cache isolation and production lab are current',()=>{
 assert.equal(read('CURRENT_RELEASE.txt').trim(),runtime);assert.equal(read('DESIGN_RELEASE.txt').trim(),design);assert.equal(JSON.parse(read('package.json')).version,version);
 const app=read('public/app.js'),sw=read('public/sw.js'),qa=read('public/phase-e-qa.mjs');
 assert.match(app,/PHASE_W25_RELEASE='GAME-NIGHT-STAGING-PHASE-W25-PRODUCTION-ASSET-VERTICAL-SLICE-50'/);assert.match(app,new RegExp(`PHASE_W30_RELEASE='${runtime}'`));assert.match(app,/CURRENT_BUILD=PHASE_W30_RELEASE/);assert.match(app,/sw\.js\?v=W30-PROP-HUNT-P0-GAMEPLAY-54/);
 assert.match(sw,/PHASE_W25_CACHE='black-family-game-night-staging-phase-w25-production-asset-vertical-slice-50'/);assert.match(sw,/PHASE_W26_CACHE='black-family-game-night-staging-phase-w26-character-wearable-fit-proof-51'/);assert.match(sw,/PHASE_W27_CACHE='black-family-game-night-staging-phase-w27-john-head-repair-52'/);assert.match(sw,/const CACHE=PHASE_W30_CACHE/);
 assert.match(qa,new RegExp(`STAGING_BUILD_ID='${runtime}'`));assert.match(qa,new RegExp(`STAGING_APP_VERSION='${version}'`));
 assert.ok(fs.existsSync(path.join(root,'public/w25-production-lab.html')));
});

test('W25 preserves the 2,000 + 2,000 catalog contracts while upgrading exactly eight gold-standard records',()=>{
 assert.equal(CABIN_ROOM_ITEM_CATALOG.length,2000);assert.equal(COSMETIC_CATALOG.length,2000);assert.equal(homeIds.length,4);assert.equal(cosIds.length,4);assert.equal(W25_PRODUCTION_IDS.size,8);
 for(const id of homeIds){const x=CABIN_ROOM_ITEM_BY_ID[id];assert.ok(x,id);assert.equal(x['W25 Production'],'Yes');assert.equal(x['Production Status'],'Production Asset');assert.equal(x['Approved For Live'],'No');assert.equal(x['Device Approved'],'No');assert.ok(x['Production Model']?.endsWith('.glb'))}
 for(const id of cosIds){const x=COSMETIC_BY_ID[id];assert.ok(x,id);assert.equal(x.catalogVersion,25);assert.equal(x.approvedForLive,false);assert.equal(x.deviceApproved,false);assert.ok(x.productionAssetReady);assert.match(String(x.visualRuntimeStatus),/Production/)}
});

test('W25 production models and model-derived thumbnails are real non-empty packaged assets',()=>{
 const specs=[...Object.values(W25_HOME_PRODUCTION),...Object.values(W25_COSMETIC_PRODUCTION)];
 for(const spec of specs){assert.ok(spec.thumb,`${spec.sku} thumb`);const thumb=path.join(root,'public',spec.thumb.replace(/^\//,''));assert.ok(fs.existsSync(thumb),thumb);assert.ok(fs.statSync(thumb).size>5000,thumb);assert.equal(fs.readFileSync(thumb).subarray(1,4).toString(),'PNG',thumb);if(spec.model){const model=path.join(root,'public',spec.model.replace(/^\//,''));assert.ok(fs.existsSync(model),model);assert.ok(fs.statSync(model).size>40000,model);assert.equal(fs.readFileSync(model).subarray(0,4).toString(),'glTF',model)}}
});

test('W25 main shop is production-only by default and unfinished records are isolated in Concept / Coming Soon',()=>{
 const h=read('public/tokens-store.html');
 for(const token of ['W25 PRODUCTION SLICE','Production Shop + Concept Lab','PRODUCTION SHOP','CONCEPT / COMING SOON','shopMode=new URLSearchParams(location.search).get(\'mode\')===\'concept\'?\'concept\':\'production\'','modeCatalog=()=>all.filter','isW25Production(x.id)','ACTUAL 3D ASSET · QA PENDING','Device Approval Pending','w25-production-lab.html'])assert.ok(h.includes(token),token);
 assert.match(h,/loadW25Preview\(\).*w25-production-preview\.mjs|import\('\.\/w25-production-preview\.mjs'\)/);
 assert.match(h,/LIVE 3D VIEW UNAVAILABLE/);
});

test('W25 cabin uses exact GLB records, model-derived blueprint thumbs and real interaction hooks',()=>{
 const art=read('public/cabin-item-art.mjs'),room=read('public/cabin-3d-room.mjs'),cabin=read('public/cabin.js');
 assert.match(art,/W25_HOME_PRODUCTION/);assert.match(art,/\.thumb\|\|/);
 for(const token of ['loadProductionModel','w25-model-${spec.sku}','toggle_light','seatTarget','Production Asset · QA Pending','W25 Production Home Assets'])assert.ok((room+'\n'+cabin).includes(token),token);
 assert.match(room,/new THREE\.PointLight\(0xffcf8a/);assert.match(room,/q\.state=\{\.\.\.\(q\.state\|\|\{\}\),lampOn:rec\.on\}/);
});

test('W25 staging lab proves exact cabin and shop models without mutating ownership',()=>{
 const h=read('public/w25-production-lab.html');
 for(const id of homeIds)assert.ok(h.includes(id),id);
 for(const id of cosIds)assert.ok(h.includes(id),id);
 assert.match(h,/does not change ownership or saves/i);assert.match(h,/mountCabinRoom3D/);assert.match(h,/mountW25ProductionPreview/);assert.match(h,/Toggle lamp/);
});
