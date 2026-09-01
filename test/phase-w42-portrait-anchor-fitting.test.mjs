import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {COSMETIC_BY_ID,fitProfileForAvatar,cosmeticOverlayHTML} from '../public/avatar-cosmetics.mjs';
import {portraitAnchorProfile,portraitGlassesFit,portraitAccessoryAsset,portraitAnchorDebugPoints} from '../public/portrait-accessory-anchors.mjs';
const root=path.resolve(new URL('..',import.meta.url).pathname);const read=p=>fs.readFileSync(path.join(root,p),'utf8');

test('W42 portrait fitting records semantic facial points for every family avatar',()=>{
 for(const who of ['john','kristen','holly','vanessa','elizabeth','logan','james','dorothy','papa','nana','kelsi','molly','gunner']){
  const p=portraitAnchorProfile(who,0);assert.ok(p,who);for(const k of ['pupils','bridge','temples','ears','head'])assert.ok(p[k],`${who} ${k}`);
  const pts=portraitAnchorDebugPoints(who,0);assert.ok(pts.length>=10,who);
 }
});

test('W42 approved glasses use GLB-derived portrait PNGs rather than staging SVGs',()=>{
 for(const id of ['round-glasses','classic-glasses','heart-glasses','safety-glasses']){
  const asset=portraitAccessoryAsset(COSMETIC_BY_ID[id]);assert.match(asset,/\/cosmetics\/generated\/w42-portrait-3d\/.+\.png$/);assert.ok(fs.existsSync(path.join(root,'public',asset.slice(1))),asset);
 }
});

test('W42 glasses scale from actual pupil geometry and are no longer tiny generic eye-box overlays',()=>{
 const expectedMin={john:47,kristen:53,holly:36,vanessa:41,elizabeth:38,logan:48};
 for(const [who,min] of Object.entries(expectedMin)){
  const f=portraitGlassesFit(who,0,COSMETIC_BY_ID['round-glasses']);assert.ok(f.w>=min,`${who} ${f.w}`);assert.match(f.anchorMode,/pupils-bridge-temples$/);assert.equal(f.calibrated,true);
 }
});

test('W42 rotation follows the actual eye line per portrait',()=>{
 const john=portraitGlassesFit('john',0,COSMETIC_BY_ID['round-glasses']);
 const kristen=portraitGlassesFit('kristen',0,COSMETIC_BY_ID['round-glasses']);
 const logan=portraitGlassesFit('logan',0,COSMETIC_BY_ID['round-glasses']);
 assert.ok(john.r<-20);assert.ok(Math.abs(kristen.r)<6);assert.ok(logan.r<-8);
});

test('W42 selected portrait variant is part of the fitting contract and flags baked-eyewear conflicts',()=>{
 assert.equal(portraitAnchorProfile('kristen',2).baked.glasses,true);
 assert.equal(portraitGlassesFit('kristen',2,COSMETIC_BY_ID['round-glasses']).portraitConflict,true);
 assert.equal(portraitGlassesFit('kristen',0,COSMETIC_BY_ID['round-glasses']).portraitConflict,false);
});

test('W42 app and shop overlays carry anchor metadata and perspective transform variables',()=>{
 const h=cosmeticOverlayHTML({glasses:'round-glasses'},'john',0);assert.match(h,/w42-portrait-3d\/round-glasses\.png/);assert.match(h,/data-fit-mode="[^"]*pupils-bridge-temples"/);assert.match(h,/--csx:/);assert.match(h,/--cskew:/);
 const css=read('public/styles.css');assert.match(css,/scale\(var\(--csx,1\),var\(--csy,1\)\)/);
 const store=read('public/tokens-store.html');assert.match(store,/portraitAccessoryAsset/);assert.match(store,/cosmeticOverlayHTML\(previewEq\(\),String\(profile\.avatar\|\|'john'\),Number\(profile\.variant\)\|\|0\)/);
});

test('W42 exact shop/card QA page is present and uses real app portraits plus anchor points',()=>{
 const h=read('public/w42-portrait-anchor-qa.html');assert.match(h,/\/avatars\/styles\/john-look-01\.jpg/);assert.match(h,/portraitAnchorDebugPoints/);assert.match(h,/Purple=pupils/);assert.doesNotMatch(h,/image_gen|concept mock/i);
});

test('W42 remains an approval candidate and does not silently promote all cosmetics live',()=>{
 assert.equal(read('CURRENT_RELEASE.txt').trim(),'GAME-NIGHT-STAGING-PHASE-W30-PROP-HUNT-P0-GAMEPLAY-54');
 assert.equal(COSMETIC_BY_ID['round-glasses'].approvedForLive,false);assert.equal(COSMETIC_BY_ID['classic-glasses'].approvedForLive,false);
});
