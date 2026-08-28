import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {ARCADE_TUTORIALS} from '../public/arcade-tutorials.mjs';
import {COSMETIC_CATALOG,COSMETIC_SLOTS,normalizeEquipped} from '../public/avatar-cosmetics.mjs';

const root=path.resolve(new URL('..',import.meta.url).pathname);
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const activeArcades=[
 'papas-paddle-battle','gunners-goat-run','johns-shop-bomber','jamess-lumber-stack',
 'dorothys-garden-merge','logans-minefield','nanas-goat-whack','hollys-memory-mayhem',
 'lizzies-dramatic-lights','vanessas-pipe-problem','mollys-light-chase','gunners-snack-attack',
 'breakout','space-shooter','rocket-gap'
];

test('W8 gives every active arcade game a detailed multi-step visual tutorial',()=>{
 assert.deepEqual(Object.keys(ARCADE_TUTORIALS).sort(),[...activeArcades].sort());
 for(const id of activeArcades){const t=ARCADE_TUTORIALS[id];assert.ok(t?.name,`${id} name`);assert.ok(t.steps.length>=4,`${id} detailed steps`);for(const step of t.steps){assert.ok(step.visual);assert.ok(step.title);assert.ok(step.body);assert.ok(step.tip)}}
 const src=read('public/arcade-tutorials.mjs');assert.match(src,/SHOW TUTORIAL/);assert.match(src,/SKIP FOR ME/);assert.match(src,/bfgn_arcade_tutorial_choice_v2/);assert.match(src,/HOW TO PLAY/);
});

test('W8 mounts HOW TO and STORE controls across shared and legacy arcade pages',()=>{
 const platform=read('public/phase-w-platform.mjs');assert.match(platform,/mountArcadeTutorial/);assert.match(platform,/data-how/);assert.match(platform,/data-store/);assert.match(platform,/tokens-store\.html/);
 for(const f of ['public/breakout.html','public/rocket-gap.html']){const h=read(f);assert.match(h,/data-w8-tutorial-inline/);assert.match(h,/SHOW TUTORIAL/);assert.match(h,/SKIP FOR ME/);assert.match(h,/tokens-store\.html/);assert.doesNotMatch(h,/data-w6-how-inline/);assert.doesNotMatch(h,/<link[^>]+stylesheet/)}
});

test('W8 cosmetic foundation remains compatible while W16 expands it into fitted realistic slots',()=>{
 assert.ok(COSMETIC_SLOTS.includes('hat'));assert.ok(COSMETIC_SLOTS.includes('glasses'));assert.ok(COSMETIC_SLOTS.includes('accessory'));assert.ok(COSMETIC_SLOTS.includes('top'));assert.ok(COSMETIC_SLOTS.includes('hair'));assert.ok(COSMETIC_CATALOG.length>=120);
 assert.ok(COSMETIC_CATALOG.filter(x=>x.slot==='hat').length>=5);assert.ok(COSMETIC_CATALOG.filter(x=>x.slot==='glasses').length>=4);assert.ok(COSMETIC_CATALOG.filter(x=>x.slot==='accessory').length>=5);
 const eq=normalizeEquipped({hat:'camp-cap'});assert.equal(eq.hat,'camp-cap');assert.equal(eq.glasses,null);assert.equal(eq.accessory,null);
 const store=read('public/tokens-store.html');assert.match(store,/Game Night Tokens/i);assert.match(store,/REALISTIC CABIN COLLECTION/i);assert.match(store,/Cabin Shop \+ Cosmetics/i);assert.match(store,/cosmeticOverlayHTML/);
});

test('W8 server validates token purchases and persists equip or unequip operations',()=>{
 const worker=read('worker.mjs');assert.match(worker,/ARCADE_COSMETICS/);assert.match(worker,/\/api\/arcade\/cosmetic/);assert.match(worker,/updateArcadeCosmetic/);assert.match(worker,/Need .* Game Night Tokens/);assert.match(worker,/action==='equip'/);assert.match(worker,/action==='unequip'/);assert.match(worker,/equippedCosmetics/);assert.match(worker,/rewardAllowed/);
});

test('W8 selected avatar renders equipped cosmetics without altering base character identity',()=>{
 const app=read('public/app.js'),css=read('public/styles.css'),registry=read('public/approved-family-characters.mjs');
 assert.match(app,/equippedCosmetics/);assert.match(app,/cosmeticOverlayHTML/);assert.match(app,/Cabin Shop \+ Cosmetics/);assert.match(css,/avatar-cosmetic/);assert.match(registry,/HeadTop/);assert.match(registry,/ChestAccessory/);assert.match(registry,/removable/i);assert.match(registry,/never alter/i);
});

test('W8 arcade economy gives a repeatable daily 3-game token reward',()=>{
 const platform=read('public/phase-w-platform.mjs'),hub=read('public/arcade-hub.html');assert.match(platform,/dailyCount>=3/);assert.match(platform,/dailyDelta=10/);assert.match(platform,/Daily challenge: 3 different arcade games/);assert.match(hub,/reward \+10 tokens/);
});

test('W8 service worker caches tutorial store and cosmetics modules',()=>{
 const sw=read('public/sw.js');assert.match(sw,/phase-w8-arcade-tutorial-store-33/);for(const f of ['arcade-tutorials.mjs','avatar-cosmetics.mjs','tokens-store.html'])assert.match(sw,new RegExp(f.replace('.','\\.')));
});

test('W8 release identity remains preserved while cumulative W16 is current',()=>{
 assert.equal(read('CURRENT_RELEASE.txt').trim(),'GAME-NIGHT-STAGING-PHASE-W18-GAMEPLAY-REALISM-40');
 const pkg=JSON.parse(read('package.json')),app=read('public/app.js'),sw=read('public/sw.js');
 assert.equal(pkg.version,'3.16.0-staging-phase-w18-gameplay-realism-40');
 assert.match(app,/PHASE_W8_RELEASE='GAME-NIGHT-STAGING-PHASE-W8-ARCADE-TUTORIAL-STORE-33'/);
 assert.match(app,/PHASE_W11_RELEASE='GAME-NIGHT-STAGING-PHASE-W11-PROP-HUNT-SMOOTHNESS-STABILITY-35'/);
 assert.match(app,/CURRENT_BUILD=PHASE_W18_RELEASE/);
 assert.match(app,/sw\.js\?v=GAME-NIGHT-STAGING-PHASE-W18-GAMEPLAY-REALISM-40/);
 assert.match(sw,/PHASE_W8_CACHE='black-family-game-night-staging-phase-w8-arcade-tutorial-store-33'/);
 assert.match(sw,/PHASE_W11_CACHE='black-family-game-night-staging-phase-w11-prop-hunt-smoothness-stability-35'/);
 assert.match(sw,/const CACHE=PHASE_W18_CACHE/);
});
