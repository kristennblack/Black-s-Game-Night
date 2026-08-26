import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const build='GAME-NIGHT-STAGING-PHASE-T-PROP-HUNT-P3-GAMEPLAY-ANIMATION-18';
const cache='black-family-game-night-staging-phase-t-prop-hunt-p3-gameplay-animation-18';

test('Phase O has an isolated build/cache identity',()=>{
 const app=fs.readFileSync('public/app.js','utf8'),sw=fs.readFileSync('public/sw.js','utf8'),version=fs.readFileSync('VERSION.txt','utf8'),wrangler=fs.readFileSync('wrangler.staging.jsonc','utf8');
 assert.match(app,new RegExp(build));assert.match(sw,new RegExp(cache));assert.equal(version.trim(),build);assert.match(wrangler,/black-family-game-night-phase-t-staging/);
});

test('Phase O keeps standard Backgammon and adds separate Black Gammon',()=>{
 const app=fs.readFileSync('public/app.js','utf8'),engine=fs.readFileSync('gameEngine.mjs','utf8'),extra=fs.readFileSync('extraGames.mjs','utf8');
 assert.match(app,/GAME\.BACKGAMMON,GAME\.BLACK_GAMMON/);assert.match(engine,/BLACK_GAMMON:'blackgammon'/);assert.match(extra,/startBlackGammon/);assert.match(app,/if\(t===GAME\.BACKGAMMON\)return backgammonBoard/);assert.match(app,/if\(t===GAME\.BLACK_GAMMON\)return blackGammonBoard/);
});

test('Phase O bot controls are Easy-first and readable',()=>{
 const app=fs.readFileSync('public/app.js','utf8'),worker=fs.readFileSync('worker.mjs','utf8'),css=fs.readFileSync('public/styles.css','utf8');
 assert.match(app,/botDifficultyOptions\(current='easy'\)/);assert.match(app,/botDifficultyOptions\('easy'\)/);assert.match(worker,/makeBot\(room,difficulty='easy'/);assert.match(css,/bot-add-grid select[\s\S]*background:#fff7e5/);assert.match(css,/color-scheme:light/);
});

test('Phase O exposes shared player-colour dice and Black Gammon directional guidance',()=>{
 const app=fs.readFileSync('public/app.js','utf8'),css=fs.readFileSync('public/styles.css','utf8');
 assert.match(app,/backgammonBoard[\s\S]*--die-color/);assert.match(app,/BLACK_GAMMON[\s\S]*BLUE · FORWARD/);assert.match(app,/RED · BACKWARD/);assert.match(app,/GOLD · RESCUE/);assert.match(css,/\.die\[style\*="--die-color"\]/);
});

test('Phase O packages the locked Black Gammon rules and confirmed setup reference',()=>{
 assert.ok(fs.existsSync('BLACK_GAMMON_MASTER_RULES.md'));assert.ok(fs.existsSync('BLACK_GAMMON_STARTING_SETUP.png'));
 const rules=fs.readFileSync('BLACK_GAMMON_MASTER_RULES.md','utf8');for(const phrase of ['4 / 4 / 4 / 3','2, 4, 6, 8, 16, 32, 64','12 moves','24 moves','single 4','blue highlight','red highlight','gold highlight'])assert.match(rules,new RegExp(phrase.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'),'i'));
});
