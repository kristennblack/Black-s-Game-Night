import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {COSMETIC_CATALOG,COSMETIC_BY_ID,fitProfileForAvatar,cosmeticOverlayHTML} from '../public/avatar-cosmetics.mjs';
const root=path.resolve(new URL('..',import.meta.url).pathname);const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const ids=[
'wear-jewelry-0032-vanessa-modern-woven-beaded-stud-earrings',
'wear-jewelry-0036-vanessa-modern-curved-beaded-hoop-earrings',
'wear-jewelry-0041-retro-closet-woven-plaid-drop-earrings',
'wear-jewelry-0046-vanessa-modern-slatted-gold-stud-earrings',
'wear-jewelry-0050-vanessa-modern-woven-gold-hoop-earrings',
'wear-jewelry-0055-retro-closet-slatted-turquoise-drop-earrings'];
const avatars=['john','kristen','holly','vanessa','elizabeth','logan','james','dorothy','papa','nana','kelsi','molly','gunner'];

test('W24 flagship earrings is current while the Build 48 cabin recovery remains preserved',()=>{
 assert.equal(read('CURRENT_RELEASE.txt').trim(),'GAME-NIGHT-STAGING-PHASE-W30-PROP-HUNT-P0-GAMEPLAY-54');
 assert.equal(read('DESIGN_RELEASE.txt').trim(),'GAME-NIGHT-DESIGN-PHASE-W30-PROP-HUNT-P0-GAMEPLAY-54');
 const pkg=JSON.parse(read('package.json')),app=read('public/app.js'),sw=read('public/sw.js');
 assert.equal(pkg.version,'3.27.0-staging-phase-w30-prop-hunt-p0-gameplay-54');
 assert.match(app,/PHASE_W22_RELEASE='GAME-NIGHT-STAGING-PHASE-W23-CABIN-REGRESSION-RECOVERY-48'/);
 assert.match(app,/PHASE_W24_RELEASE='GAME-NIGHT-STAGING-PHASE-W24-FLAGSHIP-EARRINGS-49'/);
 assert.match(app,/CURRENT_BUILD=PHASE_W30_RELEASE/);assert.match(sw,/const CACHE=PHASE_W30_CACHE/);
 for(const token of ['cabin-aerial-scene.jpg','cabin-3d-room.mjs','empty-room-shell.svg'])assert.ok(sw.includes(token),token);
});

test('W24 replaces six placeholder jewelry records without changing the 2,000 wearable contract',()=>{
 assert.equal(COSMETIC_CATALOG.length,2000);const items=ids.map(id=>COSMETIC_BY_ID[id]);assert.equal(items.filter(Boolean).length,6);
 assert.deepEqual(items.map(x=>x.sku),['W24-E01','W25-A03','W24-E03','W24-E04','W24-E05','W24-E06']);
 for(const [i,x] of items.entries()){assert.equal(x.approvedForLive,false);assert.equal(x.fitAnchor,'earlobes');assert.ok(x.asset.endsWith('.png'));assert.ok(x.shopAsset.endsWith('.png'));assert.ok(x.dogAsset.endsWith('.png'));for(const a of [x.asset,x.shopAsset,x.dogAsset])assert.ok(fs.existsSync(path.join(root,'public',a.replace(/^\//,''))),a);if(i===1){assert.equal(x.collection,'W25 Gold Standard');assert.equal(x.artStatus,'Production Asset');assert.equal(x.fitAuditStatus,'Fit Master Pending');assert.ok(x.productionModel.endsWith('.glb'))}else{assert.equal(x.collection,'W24 Flagship Earrings');assert.equal(x.artStatus,'Approved Art');assert.equal(x.fitAuditStatus,'Geometry Fit Approved')}}
});

test('W24 historical earring fit API stays finite while W44 live portrait rendering fails closed when semantic lobe proof is unavailable',()=>{
 for(const id of ids)for(const avatar of avatars){const x=COSMETIC_BY_ID[id],f=fitProfileForAvatar(avatar,'earrings',x,0);assert.equal(f.hidden,false,`${id}/${avatar}`);for(const k of ['x','y','w','r'])assert.ok(Number.isFinite(f[k]),`${id}/${avatar}/${k}`);assert.ok(f.w>0&&f.w<130,`${id}/${avatar}/width`)}
 // W44 deliberately no longer forces human earrings onto dog portraits or through hair-covered ears.
 assert.equal(cosmeticOverlayHTML({earrings:ids[1]},'gunner',0),'');
 assert.equal(cosmeticOverlayHTML({earrings:ids[1]},'kristen',0),'');
 const john=cosmeticOverlayHTML({earrings:ids[1]},'john',0);assert.match(john,/avatar-cosmetic-earrings-left/);assert.match(john,/avatar-cosmetic-earrings-right/);
});

test('W24 earring art remains preserved while W25 no longer presents PNG-only items as finished production shop inventory',()=>{
 const h=read('public/tokens-store.html');assert.match(h,/W25 PRODUCTION SLICE/);assert.match(h,/Production Shop/);assert.match(h,/Concept \/ Coming Soon/);assert.match(h,/cardAsset=x=>w25ProductionSpec/);assert.match(h,/Device Approval Pending/);
 for(const id of ids){const x=COSMETIC_BY_ID[id];assert.ok(fs.existsSync(path.join(root,'public',x.shopAsset.replace(/^\//,''))))}
});
