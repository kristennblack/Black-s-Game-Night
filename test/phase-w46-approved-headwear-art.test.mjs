import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
const root=path.resolve(import.meta.dirname,'..');
const anchors=await import(pathToFileURL(path.join(root,'public/portrait-accessory-anchors.mjs')).href+'?w46test=1');
const cosmetics=await import(pathToFileURL(path.join(root,'public/avatar-cosmetics.mjs')).href+'?w46test=1');

const approved=[
 ['camp-cap','john'],['cowboy-hat','john'],['winter-toque','kristen'],['firefighter-helmet','holly'],
 ['birthday-crown','kristen'],['tiara','kristen'],['legendary-top-hat','logan'],['trail-trouble-cap','holly'],
 ['prop-hunt-hunter-hat','john'],['mexican-train-cap','elizabeth'],
 ['wear-flagship-w029-wide-brim-sun-hat','vanessa'],['wear-flagship-w030-canvas-bucket-hat','logan'],
];

function pngInfo(file){
 const b=fs.readFileSync(file);assert.equal(b.toString('hex',0,8),'89504e470d0a1a0a');
 return {width:b.readUInt32BE(16),height:b.readUInt32BE(20),bitDepth:b[24],colorType:b[25],bytes:b.length};
}

test('W46 maps all 12 user-approved Board 01 headwear items to approved portrait assets',()=>{
 const m=anchors.W46_APPROVED_HEADWEAR_ASSET_OVERRIDES;
 assert.equal(Object.keys(m).length,12);
 for(const [id] of approved){assert.ok(m[id],`missing W46 asset override ${id}`);assert.match(m[id],/^\/cosmetics\/generated\/w46-approved-headwear\/.+\.png$/);}
});

test('W46 approved headwear files are real RGBA PNGs with useful natural dimensions',()=>{
 for(const [id] of approved){const rel=anchors.W46_APPROVED_HEADWEAR_ASSET_OVERRIDES[id];const file=path.join(root,'public',rel.slice(1));assert.ok(fs.existsSync(file),file);const i=pngInfo(file);assert.equal(i.colorType,6,`${id} must be RGBA`);assert.ok(i.width>=500&&i.height>=380,`${id} ${i.width}x${i.height}`);assert.ok(i.bytes>30_000,`${id} suspiciously tiny`);}
});

test('W46 approved assets preserve W45 semantic width while adding portrait-shape control',()=>{
 for(const [id,avatar] of approved){const item=cosmetics.COSMETIC_BY_ID[id];assert.ok(item,id);const f=anchors.portraitHeadwearFit(avatar,0,item);assert.ok(f&&!f.blocked,`${avatar}/${id}`);assert.equal(f.w46ApprovedArt,true);assert.ok(f.w46PortraitShaping);assert.ok(f.sy>=.22&&f.sy<=.82,`${id} sy ${f.sy}`);assert.ok(f.w>=34&&f.w<=136,`${id} width ${f.w}`);assert.match(f.anchorMode,/^w45-visual-head-/);}
});

test('W46 Prop Hunt Hunter Hat follows the approved cap silhouette instead of cowboy classification',()=>{
 const f=anchors.portraitHeadwearFit('john',0,cosmetics.COSMETIC_BY_ID['prop-hunt-hunter-hat']);
 assert.equal(f.headwearKind,'cap');assert.ok(f.w<80,`hunter cap width ${f.w}`);
});

test('W46 runtime asset resolver prioritizes approved art and carries vertical shaping into HTML',()=>{
 for(const [id,avatar] of approved){const item=cosmetics.COSMETIC_BY_ID[id];assert.equal(anchors.portraitAccessoryAsset(item),anchors.W46_APPROVED_HEADWEAR_ASSET_OVERRIDES[id]);const html=cosmetics.cosmeticOverlayHTML({hat:id},avatar,0);assert.match(html,/w46-approved-headwear/);assert.match(html,/--csy:0\./);assert.match(html,/--coy:[0-9.]+%/);}
});

test('W46 app/store/platform imports and service worker are cache-busted to candidate 64',()=>{
 for(const f of ['public/app.js','public/avatar-cosmetics.mjs','public/phase-w-platform.mjs','public/tokens-store.html']) assert.match(fs.readFileSync(path.join(root,f),'utf8'),/W46-APPROVED-HEADWEAR-ART-64/);
 const sw=fs.readFileSync(path.join(root,'public/sw.js'),'utf8');assert.match(sw,/PHASE_W46_CACHE='black-family-game-night-staging-candidate-w46-approved-headwear-art-64'/);assert.match(sw,/RUNTIME_CACHE=PHASE_W46_CACHE/);assert.match(sw,/w46-approved-headwear-live-qa\.html/);assert.match(sw,/w46-approved-headwear\/camp-cap\.png/);
});

test('W46 QA page exercises all 12 approved item IDs through the actual portrait renderer',()=>{
 const page=fs.readFileSync(path.join(root,'public/w46-approved-headwear-live-qa.html'),'utf8');assert.match(page,/APPROVED HEADWEAR IN ACTUAL PORTRAIT RENDERER/);for(const [id] of approved)assert.ok(page.includes(`'${id}'`),id);
});

test('W46 candidate marker stays staging-only until device approval',()=>{
 const marker=fs.readFileSync(path.join(root,'W46_APPROVED_HEADWEAR_CANDIDATE.txt'),'utf8');assert.match(marker,/candidate/i);assert.match(marker,/device approval required/i);
});
