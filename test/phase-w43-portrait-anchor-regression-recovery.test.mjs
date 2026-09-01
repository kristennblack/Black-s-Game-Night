import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {COSMETIC_BY_ID,cosmeticOverlayHTML} from '../public/avatar-cosmetics.mjs';
import {portraitAnchorProfile,portraitGlassesFit,portraitStyleAsset,portraitStyleKey,EXACT_PORTRAIT_STYLE_ANCHORS} from '../public/portrait-accessory-anchors.mjs';
const root=path.resolve(new URL('..',import.meta.url).pathname);const read=p=>fs.readFileSync(path.join(root,p),'utf8');

test('W43 keys calibration to the exact portrait file used by shop and card avatars',()=>{
 for(const who of ['kristen','holly','vanessa','elizabeth','logan'])for(let v=0;v<4;v++){
  const p=portraitAnchorProfile(who,v);assert.equal(p.exactCalibration,true,`${who} v${v}`);assert.equal(p.portraitStyleKey,portraitStyleKey(who,v));assert.match(portraitStyleAsset(who,v),new RegExp(`${p.portraitStyleKey}\\.jpg$`));
 }
 for(let v=0;v<16;v++){const p=portraitAnchorProfile('john',v);assert.equal(p.exactCalibration,true,`john v${v}`);assert.equal(p.portraitStyleKey,`john-look-${String(v+1).padStart(2,'0')}`)}
 assert.ok(Object.keys(EXACT_PORTRAIT_STYLE_ANCHORS).length>=36);
});

test('W43 GLB-derived glasses size from actual lens geometry rather than a tiny generic width',()=>{
 for(const who of ['john','kristen','holly','vanessa','elizabeth','logan']){
  const round=portraitGlassesFit(who,0,COSMETIC_BY_ID['round-glasses']);
  const classic=portraitGlassesFit(who,0,COSMETIC_BY_ID['classic-glasses']);
  assert.equal(round.exactCalibration,true);assert.equal(round.hidden,false);assert.ok(round.w>55,`${who} round ${round.w}`);assert.ok(classic.w>round.w,`${who} classic`);
 }
});

test('W43 blocks double-glasses and uncalibrated fallback portraits instead of showing a bad fit',()=>{
 const baked=portraitGlassesFit('kristen',2,COSMETIC_BY_ID['round-glasses']);assert.equal(baked.portraitConflict,true);assert.equal(baked.hidden,false);assert.equal(baked.blocked,true);
 const uncal=portraitGlassesFit('papa',0,COSMETIC_BY_ID['round-glasses']);assert.equal(uncal.exactCalibration,false);assert.equal(uncal.hidden,false);assert.equal(uncal.blocked,true);
 assert.equal(cosmeticOverlayHTML({glasses:'round-glasses'},'kristen',2),'');
 assert.equal(cosmeticOverlayHTML({glasses:'round-glasses'},'papa',0),'');
});

test('W43 removes old CSS rules that stomp anchor variables in family arcade portrait surfaces',()=>{
 const css=read('public/phase-w-platform.css');
 assert.doesNotMatch(css,/avatar-cosmetic-glasses\{[^}]*left:50%[^}]*top:(?:20|15)px/);
 assert.match(css,/left:var\(--cx\)!important/);assert.match(css,/top:var\(--cy\)!important/);assert.match(css,/width:var\(--cw\)!important/);
 assert.match(css,/img\.avatar-base/);assert.doesNotMatch(css,/phase-w-avatar-stage img\{width:/);
});

test('W43 family arcade uses the selected portrait variant and no longer styles cosmetic images as avatar bases',()=>{
 const js=read('public/phase-w-platform.mjs');assert.match(js,/variant:Number\(p\.variant\)\|\|0/);assert.match(js,/class="avatar-base"/);assert.match(js,/assetFor\(cfg\.person,p\)/);assert.match(js,/W4(?:5-HEADWEAR-SCALE-RECOVERY-63|6-APPROVED-HEADWEAR-ART-64)/);
});

test('W43 candidate uses a candidate-specific service-worker cache so W30 cached cosmetics cannot reappear',()=>{
 const sw=read('public/sw.js'),app=read('public/app.js');assert.match(sw,/PHASE_W43_CACHE='black-family-game-night-staging-candidate-w43-portrait-anchor-recovery-61'/);assert.match(sw,/PHASE_W44_CACHE='black-family-game-night-staging-candidate-w44-earring-headwear-62'/);assert.match(sw,/const CACHE=PHASE_W30_CACHE/);assert.match(sw,/const RUNTIME_CACHE=PHASE_W4[56]_CACHE/);assert.match(app,/sw\.js\?v=W4(?:5-HEADWEAR-SCALE-RECOVERY-63|6-APPROVED-HEADWEAR-ART-64)/);assert.match(sw,/w43-portrait-anchor-runtime-qa\.html/);
 assert.equal(read('CURRENT_RELEASE.txt').trim(),'GAME-NIGHT-STAGING-PHASE-W30-PROP-HUNT-P0-GAMEPLAY-54');
});

test('W43 shop warns rather than silently rendering an uncalibrated or baked-eyewear portrait',()=>{
 const store=read('public/tokens-store.html');assert.match(store,/portraitGlassesFit/);assert.match(store,/W43 intentionally blocks a second pair of glasses/);assert.match(store,/has not been landmark-calibrated yet/);assert.match(store,/W4(?:5-HEADWEAR-SCALE-RECOVERY-63|6-APPROVED-HEADWEAR-ART-64)/);
});

test('W43 runtime QA page exercises exact shop-card portrait sources with shared app CSS',()=>{
 const h=read('public/w43-portrait-anchor-runtime-qa.html');assert.match(h,/styles\.css\?v=W45-HEADWEAR-SCALE-RECOVERY-63/);assert.match(h,/phase-w-platform\.css\?v=W45-HEADWEAR-SCALE-RECOVERY-63/);assert.match(h,/portraitStyleAsset/);assert.match(h,/cosmeticOverlayHTML/);
});
