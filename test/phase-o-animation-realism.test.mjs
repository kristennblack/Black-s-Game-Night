import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const app=fs.readFileSync(new URL('../public/app.js',import.meta.url),'utf8');
const css=fs.readFileSync(new URL('../public/styles.css',import.meta.url),'utf8');
const studio=fs.readFileSync(new URL('../public/shared-3d-studio.mjs',import.meta.url),'utf8');
const sw=fs.readFileSync(new URL('../public/sw.js',import.meta.url),'utf8');
const newGames=fs.readFileSync(new URL('../public/new-games.html',import.meta.url),'utf8');

const build='GAME-NIGHT-STAGING-PHASE-O-REALISTIC-ACTIONS-12';
const cache='black-family-game-night-staging-phase-o-realistic-actions-12';

test('Phase O build and cache identity are isolated',()=>{
  assert.match(app,new RegExp(build));
  assert.match(sw,new RegExp(cache));
});

test('tabletop pieces have shared physical motion infrastructure',()=>{
  assert.match(app,/function motionKey\(/);
  assert.match(app,/data-motion-key/);
  assert.match(app,/function captureTableMotionRects\(/);
  assert.match(app,/function animatePhysicalPieces\(/);
  assert.match(app,/runTabletopMotion\(motionBefore\)/);
  assert.match(app,/function runTrickCollection\(/);
  assert.match(app,/motionSourceFor\(/);
});

test('Backgammon gets checker flight, dice tumble, cube flip and pip dice',()=>{
  assert.match(app,/function flyChecker\(/);
  assert.match(app,/function runBackgammonPhysicalMotion\(/);
  assert.match(app,/pendingBgMove/);
  assert.match(app,/pendingDiceMotion/);
  assert.match(app,/pendingCubeMotion/);
  assert.match(app,/function physicalDieHTML\(/);
  assert.match(css,/\.motion-flying-checker/);
  assert.match(css,/\.die-pips/);
});

test('physical tabletop feedback covers decks, cards, dominoes and reduced motion',()=>{
  assert.match(css,/@keyframes physicalDeckReady/);
  assert.match(css,/@keyframes cribPegDrop/);
  assert.match(css,/@keyframes golfCardFlip/);
  assert.match(css,/@keyframes pokerDealSettle/);
  assert.match(css,/@keyframes routeBuildIn/);
  assert.match(css,/\.domino-tile\{box-shadow/);
  assert.match(css,/\.hand-card:not\(:disabled\):active/);
  assert.match(css,/@media\(prefers-reduced-motion:reduce\)/);
  assert.match(app,/navigator\.vibrate/);
  assert.match(newGames,/mysteryDieHTML/);
  assert.match(newGames,/@keyframes mysteryDieRoll/);
});

test('authored 3D clips use phase-matched crossfades and smoothed playback speed',()=>{
  assert.match(studio,/oneShotSemantics/);
  assert.match(studio,/phaseMatch/);
  assert.match(studio,/crossFadeTo\(next,transition,phaseMatch\)/);
  assert.match(studio,/targetTimeScale/);
  assert.match(studio,/Math\.exp\(-step\*12\)/);
});
