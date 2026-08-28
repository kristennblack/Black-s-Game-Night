import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {COSMETIC_BY_ID,fitProfileForAvatar,cosmeticOverlayHTML} from '../public/avatar-cosmetics.mjs';
const root=path.resolve(new URL('..',import.meta.url).pathname);const read=p=>fs.readFileSync(path.join(root,p),'utf8');

test('W17 historical release remains preserved while W20 is current and Cabin route remains live',()=>{
 assert.equal(read('CURRENT_RELEASE.txt').trim(),'GAME-NIGHT-STAGING-PHASE-W21-TRUE3D-WORLD-PROPS-GAMEPLAY-43');
 assert.equal(read('DESIGN_RELEASE.txt').trim(),'GAME-NIGHT-DESIGN-PHASE-W21-TRUE3D-WORLD-PROPS-GAMEPLAY-43');
 const app=read('public/app.js');assert.match(app,/PHASE_W17_RELEASE='GAME-NIGHT-STAGING-PHASE-W17-CABIN-COSMETICS-POLISH-39'/);assert.match(app,/CURRENT_BUILD=PHASE_W21_RELEASE/);assert.match(app,/href="\/cabin\.html">Visit the Cabin<\/a>/);
 const sw=read('public/sw.js');assert.match(sw,/PHASE_W17_CACHE/);assert.match(sw,/const CACHE=PHASE_W21_CACHE/);
});

test('W17 semantic portrait fitting remains represented in W20 universal anchors',()=>{
 const k=fitProfileForAvatar('kristen','face',COSMETIC_BY_ID['classic-glasses-charcoal'],0);
 const h=fitProfileForAvatar('holly','face',COSMETIC_BY_ID['classic-glasses-charcoal'],0);
 assert.notEqual(k.w,h.w);assert.ok(k.y>=25&&k.y<=36);assert.ok(h.y>=25&&h.y<=36);
 for(const who of ['john','kristen','holly','vanessa','elizabeth','logan','james','dorothy','papa','nana','kelsi','molly','gunner']){const f=fitProfileForAvatar(who,'hat',COSMETIC_BY_ID['camp-cap'],0);assert.ok(Number.isFinite(f.x)&&Number.isFinite(f.y)&&Number.isFinite(f.w));assert.equal(f.hidden,false)}
});

test('W20 keeps independent cosmetic width and height for face-safe fitting',()=>{
 const earrings=fitProfileForAvatar('elizabeth','earrings',COSMETIC_BY_ID['drop-earrings'],0);
 const headset=fitProfileForAvatar('logan','headset',COSMETIC_BY_ID['headphones-charcoal'],0);
 assert.ok(Number.isFinite(earrings.w));assert.ok(Number.isFinite(headset.w));
 const html=cosmeticOverlayHTML({earrings:'drop-earrings',headset:'headphones-charcoal'},'elizabeth',0);assert.match(html,/--ch:/);assert.match(html,/drop-earrings\.svg/);assert.match(html,/headphones-charcoal\.svg/);
});

test('W17 portrait clipping and W20 layered-avatar simplification remain explicit CSS rules',()=>{
 const css=read('public/styles.css');assert.match(css,/Phase W\.17 portrait-calibrated cosmetic compositing/);assert.match(css,/overflow:hidden!important/);assert.match(css,/W20/i);
});

test('W17 master prompt remains historical and W20 separates preview identity from bespoke 3D asset completion',()=>{
 const old=read('MASTER_GAME_DESIGN_PRODUCTION_PROMPT_W17.md');assert.match(old,/HIGHEST-PRECEDENCE CURRENT MASTER PROMPT/);assert.match(old,/True 3D modes/);
 const kit=read('public/shared-3d-art-kit.mjs');assert.match(kit,/createCatalogHomeMesh/);assert.match(kit,/not.*hand-sculpted|NOT.*hand-sculpted/i);
});
