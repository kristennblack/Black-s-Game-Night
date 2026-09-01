import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
const root=path.resolve(import.meta.dirname,'..');
const anchors=await import(pathToFileURL(path.join(root,'public/portrait-accessory-anchors.mjs')).href+'?w45test=1');
const cosmetics=await import(pathToFileURL(path.join(root,'public/avatar-cosmetics.mjs')).href+'?w45test=1');

const people=['john','kristen','holly','vanessa','elizabeth','logan'];
const hats=['cowboy-hat','firefighter-helmet','birthday-crown','tiara','legendary-top-hat','mexican-train-cap'];

test('W45 headwear profiles use visual wearing ratios instead of conservative W44 shrink values',()=>{
 const g=anchors.W45_HEADWEAR_GEOMETRY;
 assert.ok(g['cowboy-hat'].widthScale>=1.25);
 assert.ok(g['firefighter-helmet'].widthScale>=1.15);
 assert.ok(g['mexican-train-cap'].widthScale>=1.05);
 assert.ok(g['birthday-crown'].widthScale>=.8);
 assert.ok(g.tiara.widthScale>=.75);
});

test('W45 core portraits receive per-person scale and seat corrections',()=>{
 const c=anchors.W45_HEADWEAR_PORTRAIT_CORRECTIONS;
 for(const p of people){assert.ok(c[p],`missing ${p}`);assert.ok(c[p].scale>=1);assert.ok(Number.isFinite(c[p].y));}
});

test('W45 benchmark hats resolve larger semantic fits on all six clean portraits',()=>{
 for(const avatar of people){for(const id of hats){const item=cosmetics.COSMETIC_BY_ID[id];const f=anchors.portraitHeadwearFit(avatar,0,item);assert.ok(f,`${avatar}/${id}`);assert.equal(f.blocked,false);assert.equal(f.visualScaleRecovery,true);assert.match(f.anchorMode,/^w45-visual-head-/);assert.ok(f.w>=34,`${avatar}/${id} width ${f.w}`);assert.ok(f.landmarks.hairline&&f.landmarks.crownCenter&&f.landmarks.seat);}}
});

test('W45 wide headwear no longer reads as toy-sized on small-head portrait crops',()=>{
 const cowboy=cosmetics.COSMETIC_BY_ID['cowboy-hat'];
 const helmet=cosmetics.COSMETIC_BY_ID['firefighter-helmet'];
 for(const avatar of ['holly','elizabeth']){
   assert.ok(anchors.portraitHeadwearFit(avatar,0,cowboy).w>=64);
   assert.ok(anchors.portraitHeadwearFit(avatar,0,helmet).w>=60);
 }
});

test('W45 cap and crown seat lower than W44-safe placement while staying above the eyes',()=>{
 for(const avatar of people){
   const p=anchors.portraitAnchorProfile(avatar,0);const eyeY=(p.pupils.left.y+p.pupils.right.y)/2;
   for(const id of ['mexican-train-cap','birthday-crown']){const f=anchors.portraitHeadwearFit(avatar,0,cosmetics.COSMETIC_BY_ID[id]);assert.ok(f.y<eyeY,`${avatar}/${id} seat must stay above eyes`);assert.ok(f.y>p.head.top.y,`${avatar}/${id} seat must be below head top`);}
 }
});

test('W45 rendered headwear HTML carries W45 anchor mode and local bottom pivot',()=>{
 const html=cosmetics.cosmeticOverlayHTML({hat:'cowboy-hat'},'kristen',0);
 assert.match(html,/w44-headwear-3d\/cowboy-hat\.png/);
 assert.match(html,/w45-visual-head-cowboy-seat/);
 assert.match(html,/--cty:-88%/);
});

test('W45 candidate has independent service-worker cache and QA route',()=>{
 const sw=fs.readFileSync(path.join(root,'public/sw.js'),'utf8');
 assert.match(sw,/PHASE_W45_CACHE='black-family-game-night-staging-candidate-w45-headwear-scale-recovery-63'/);
 assert.match(sw,/RUNTIME_CACHE=PHASE_W45_CACHE/);
 assert.match(sw,/w45-headwear-scale-live-qa\.html/);
 const page=fs.readFileSync(path.join(root,'public/w45-headwear-scale-live-qa.html'),'utf8');
 assert.match(page,/ACTUAL BROWSER HEADWEAR SCALE RECOVERY QA/);
 assert.match(page,/W45-HEADWEAR-SCALE-RECOVERY-63/);
});

test('W45 rolls semantic visual sizing across the full human headwear catalog without pretending specialty anchors are generic hats',()=>{
 const hats=cosmetics.COSMETIC_CATALOG.filter(x=>x.slot==='hat');
 let routed=0,special=0;
 for(const item of hats){
   const f=anchors.portraitHeadwearFit('john',0,item);
   if(f){routed++;assert.match(f.anchorMode,/^w45-visual-head-/);assert.ok(f.w>=12&&f.w<=136);}
   else if(['ears','bun','forehead'].includes(String(item.fitAnchor||''))) special++;
   else assert.fail(`unrouted headwear ${item.id}`);
 }
 assert.equal(hats.length,141);
 assert.equal(routed,138);
 assert.equal(special,3);
});
