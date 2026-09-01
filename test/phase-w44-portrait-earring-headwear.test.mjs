import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
const root=path.resolve(import.meta.dirname,'..');
const anchors=await import(pathToFileURL(path.join(root,'public/portrait-accessory-anchors.mjs')).href+'?w44test=1');
const cosmetics=await import(pathToFileURL(path.join(root,'public/avatar-cosmetics.mjs')).href+'?w44test=1');

test('W44 exact portrait headwear uses semantic head seat and real asset override',()=>{
 const item=cosmetics.COSMETIC_BY_ID['firefighter-helmet'];
 const fit=anchors.portraitHeadwearFit('john',0,item);
 assert.equal(fit.exactCalibration,true);assert.match(fit.anchorMode,/(?:exact-head|w45-visual-head)-helmet-seat/);assert.ok(fit.w>30);assert.equal(anchors.portraitAccessoryAsset(item),'/cosmetics/generated/w44-headwear-3d/firefighter-helmet.png');
});

test('W44 earrings resolve left and right earlobe fits independently',()=>{
 const item=cosmetics.COSMETIC_BY_ID['wear-jewelry-0036-vanessa-modern-curved-beaded-hoop-earrings'];
 const fit=anchors.portraitEarringFits('john',0,item);
 assert.equal(fit.blocked,false);assert.ok(fit.left.landmark);assert.ok(fit.right.landmark);assert.notEqual(fit.left.x,fit.right.x);assert.ok(anchors.portraitEarringSideAsset(item,'left').endsWith('-left.png'));
});

test('W44 baked-earring portraits fail closed',()=>{
 const item=cosmetics.COSMETIC_BY_ID['wear-jewelry-0032-vanessa-modern-woven-beaded-stud-earrings'];
 const fit=anchors.portraitEarringFits('holly',0,item);
 assert.equal(fit.blocked,true);assert.match(fit.reason,/baked-earrings/);
});

test('W44 earring renderer emits side-specific overlays and semantic metadata',()=>{
 const id='wear-jewelry-0041-retro-closet-woven-plaid-drop-earrings';
 const html=cosmetics.cosmeticOverlayHTML({earrings:id},'logan',0);
 assert.match(html,/data-ear-side="left"/);assert.match(html,/data-ear-side="right"/);assert.match(html,/exact-earlobe/);assert.match(html,/--cty:-6%/);
});

test('W44 headwear renderer uses bottom-seat pivot rather than center-only placement',()=>{
 const html=cosmetics.cosmeticOverlayHTML({hat:'birthday-crown'},'kristen',0);
 assert.match(html,/w44-headwear-3d\/birthday-crown\.png/);assert.match(html,/(?:exact-head|w45-visual-head)-crown-seat/);assert.match(html,/--cty:-92%/);
});

test('W44 shop preview is square so exact portrait coordinates match card portraits',()=>{
 const s=fs.readFileSync(path.join(root,'public/tokens-store.html'),'utf8');assert.match(s,/\.preview-stage\{[^}]*aspect-ratio:1\/1/);
});

test('W44 shared CSS honors per-accessory local pivot variables',()=>{
 for(const rel of ['public/styles.css','public/phase-w-platform.css']){const s=fs.readFileSync(path.join(root,rel),'utf8');assert.match(s,/translate\(var\(--ctx,-50%\),var\(--cty,-50%\)\)/)}
});

test('W44 candidate cache is distinct from W43',()=>{
 const s=fs.readFileSync(path.join(root,'public/sw.js'),'utf8');assert.match(s,/PHASE_W44_CACHE/);assert.match(s,/black-family-game-night-staging-candidate-w44-earring-headwear-62/);assert.match(s,/RUNTIME_CACHE=PHASE_W45_CACHE/);
});

test('W44 rolls semantic portrait anchors to remaining head/face accessory families',()=>{
 const cases=[['headset','headphones'],['hair','flower-crown'],['face','wear-flagship-w045-goofy-nose-mustache-set'],['filter','wear-flagship-w046-puppy-nose-filter'],['neck','red-bandana'],['badge','sheriff-badge'],['back','wear-flagship-w063-structured-mini-bag'],['attachment','wear-flagship-w079-glowing-fairy-wings']];
 for(const [slot,id] of cases){const item=cosmetics.COSMETIC_BY_ID[id];assert.ok(item,`missing ${id}`);const fit=cosmetics.fitProfileForAvatar('john',slot,item,0);assert.equal(fit.calibrated,true,`${slot} should use portrait calibration`);assert.match(fit.anchorMode,/^exact-/);assert.ok(Number.isFinite(fit.x)&&Number.isFinite(fit.y)&&Number.isFinite(fit.w));}
});


test('W44 portrait wristwear fails closed instead of floating on head-and-shoulders portraits without wrist landmarks',()=>{
 const wrist=cosmetics.COSMETIC_CATALOG.find(x=>x.slot==='wrists');assert.ok(wrist);
 const f=anchors.portraitSemanticAccessoryFit('john',0,wrist,'wrists');assert.equal(f.blocked,true);assert.equal(f.hidden,true);assert.match(f.anchorMode,/wrists-not-visible/);
 assert.equal(cosmetics.cosmeticOverlayHTML({wrists:wrist.id},'john',0),'');
});
