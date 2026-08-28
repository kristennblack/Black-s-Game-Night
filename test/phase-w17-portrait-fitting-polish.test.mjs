import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {COSMETIC_BY_ID,fitProfileForAvatar,cosmeticOverlayHTML,PORTRAIT_FIT_ANCHORS} from '../public/avatar-cosmetics.mjs';
const root=path.resolve(new URL('..',import.meta.url).pathname);const read=p=>fs.readFileSync(path.join(root,p),'utf8');

test('W17 is current and keeps a real home Cabin route',()=>{
 assert.equal(read('CURRENT_RELEASE.txt').trim(),'GAME-NIGHT-STAGING-PHASE-W17-CABIN-COSMETICS-POLISH-39');
 assert.equal(read('DESIGN_RELEASE.txt').trim(),'GAME-NIGHT-DESIGN-PHASE-W17-CABIN-COSMETICS-POLISH-39');
 const app=read('public/app.js');assert.match(app,/PHASE_W17_RELEASE/);assert.match(app,/href="\/cabin\.html">Visit the Cabin<\/a>/);
 const sw=read('public/sw.js');assert.match(sw,/PHASE_W17_CACHE/);assert.match(sw,/const CACHE=PHASE_W17_CACHE/);
});

test('W17 uses portrait semantic anchors instead of one generic sticker coordinate',()=>{
 for(const who of ['john','kristen','holly','vanessa','elizabeth','logan','james','dorothy','papa','nana'])assert.ok(PORTRAIT_FIT_ANCHORS[who],who);
 const k=fitProfileForAvatar('kristen','glasses',COSMETIC_BY_ID['classic-glasses-charcoal'],0);
 const h=fitProfileForAvatar('holly','glasses',COSMETIC_BY_ID['classic-glasses-charcoal'],0);
 assert.notEqual(k.w,h.w);assert.ok(k.y>=25&&k.y<=36);assert.ok(h.y>=25&&h.y<=36);
});

test('W17 supports independent cosmetic width and height for face-safe fitting',()=>{
 const earrings=fitProfileForAvatar('elizabeth','jewelry',COSMETIC_BY_ID['drop-earrings'],0);
 const headset=fitProfileForAvatar('logan','headset',COSMETIC_BY_ID['headphones-charcoal'],0);
 assert.ok(Number.isFinite(earrings.h)&&earrings.h<=25);assert.ok(earrings.w>=60);
 assert.ok(Number.isFinite(headset.h)&&headset.h<=45);assert.ok(headset.w>=60);
 const html=cosmeticOverlayHTML({jewelry:'drop-earrings'},'elizabeth',0);assert.match(html,/--ch:/);assert.match(html,/drop-earrings-left\.png/);assert.match(html,/drop-earrings-right\.png/);
});

test('W17 portrait clipping and tiny-avatar simplification are explicit CSS rules',()=>{
 const css=read('public/styles.css');assert.match(css,/Phase W\.17 portrait-calibrated cosmetic compositing/);assert.match(css,/overflow:hidden!important/);assert.match(css,/score-avatar \.avatar-cosmetic-top/);
});

test('W17 master prompt keeps the approved mockups as quality bar and separates portrait vs true 3D fitting',()=>{
 const m=read('MASTER_GAME_DESIGN_PRODUCTION_PROMPT_W17.md');assert.match(m,/HIGHEST-PRECEDENCE CURRENT MASTER PROMPT/);assert.match(m,/semantic head\/eye\/ear\/neck\/chest anchors/);assert.match(m,/True 3D modes/);assert.match(m,/W\.14\/W\.15 realistic cabin\/shop\/wearables mockups/);
});
