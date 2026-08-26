import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const read=p=>fs.readFileSync(new URL(`../${p}`,import.meta.url),'utf8');
const BUILD='GAME-NIGHT-STAGING-PHASE-R-PROP-HUNT-P2-GAMMON-UX-16';
const CACHE='black-family-game-night-staging-phase-r-prop-hunt-p2-gammon-ux-16';

test('Phase R build identity and directive are packaged',()=>{
  assert.match(read('public/app.js'),new RegExp(BUILD));
  assert.match(read('public/sw.js'),new RegExp(CACHE));
  assert.equal(read('VERSION.txt').trim(),BUILD);
  const d=read('MASTER_NEXT_BUILD_DEVELOPMENT_DIRECTIVE.md');
  for(const phrase of ['Prop Hunt P2 Character & Animation Visual Gate','board itself becomes the primary screen','Critical dice-roll fix','Remove the blue-line artifact at the source','Cold-package verification']) assert.ok(d.includes(phrase),phrase);
});

test('Backgammon family uses dedicated screen-first Gammon gameplay',()=>{
  const app=read('public/app.js'),css=read('public/styles.css');
  for(const token of ['function gammonPrimaryActions','function gammonGameplay','gammon-focus-surface','gammon-board-viewport','gammon-board-canvas']) assert.ok(app.includes(token)||css.includes(`.${token}`)||css.includes(token),token);
  assert.match(app,/if\(\[GAME\.BACKGAMMON,GAME\.BLACK_GAMMON\]\.includes\(s\.gameType\)\)return gammonGameplay/);
  assert.ok(css.includes('.gammon-focus-layout'));
  assert.ok(css.includes('.gammon-focus-surface .backgammon-table'));
  assert.ok(css.includes('.gammon-focus-surface .bg-board'));
  assert.ok(!/gammon-focus-surface[^}]*radial-gradient\(circle at 50% 45%,rgba\(41,105,72/.test(css));
});

test('Gammon blue-line artifact is disabled at its original roster pseudo-element',()=>{
  const css=read('public/styles.css');
  assert.match(css,/\.three-new-roster>div>span:before\{display:none!important;content:none!important\}/);
});

test('Gammon roll actions are primary and immediately refresh visible state',()=>{
  const app=read('public/app.js');
  for(const action of ['bgOpeningRoll','bgRoll','blackRoll','blackBigRoll']) assert.ok(app.includes(action),action);
  assert.match(app,/\['bgOpeningRoll','bgRoll','blackRoll','blackBigRoll'\]\.includes\(a\.action\)/);
  assert.match(app,/const fresh=await fetchState\(session\.roomId,session\.playerToken\);setRoomState\(fresh\);render\(\)/);
  assert.ok(app.includes('gammon-primary-btn'));
});

test('Black Gammon roll controls are not duplicated in the generic action panel',()=>{
  const app=read('public/app.js'),css=read('public/styles.css');
  assert.ok(app.includes("'blackRoll','blackBigRoll','bgOfferDouble','bgAcceptDouble','bgBeaver','bgDeclineDouble'"));
  assert.match(css,/\.gammon-focus-surface \.bg-primary-actions\{display:none!important\}/);
});

test('John P2 authored benchmark metadata and GLB are present',()=>{
  const manifest=JSON.parse(read('public/models/manifest.json'));
  const john=manifest.characters.john;
  assert.equal(john.phase,'P2');
  assert.equal(john.flagshipBenchmark,'PH-CHAR-01-P2');
  assert.equal(john.visualGate,'character-and-animation');
  assert.equal(john.animations.length,19);
  const glb=new URL(`../public${john.file}`,import.meta.url);
  const stat=fs.statSync(glb);
  assert.ok(stat.size>2_000_000,`John GLB unexpectedly small: ${stat.size}`);
});

test('John P2 builder includes refined face/body/boot and locomotion work',()=>{
  const src=read('tools/build_vertical_slice_assets.py');
  for(const token of ['m_eye_white','m_lip','P2','visualGate','add_boot_wedge',"trans_track('hips'"]) assert.ok(src.includes(token),token);
});

test('Papa Shop P2 benchmark lighting adds restrained local depth',()=>{
  const src=read('public/prop-hunt-3d.js');
  for(const token of ['P2 fireplace glow','P2 shop work-bay fill','P2 barn soft fill','p2BenchmarkLights']) assert.ok(src.includes(token),token);
  assert.match(src,/new THREE\.PointLight\(0xffa05c,1\.85,5\.2,2\)/);
});

test('Phase Q Skip-Bo and Cribbage screen-first routes remain preserved',()=>{
  const app=read('public/app.js');
  assert.match(app,/if\(s\.gameType===GAME\.SKIP_BO\)return skipBoGameplay/);
  assert.match(app,/if\(s\.gameType===GAME\.CRIBBAGE\)return cribbageGameplay/);
});
