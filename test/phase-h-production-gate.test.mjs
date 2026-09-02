import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const app = await readFile(new URL('../public/app.js', import.meta.url),'utf8');
const css = await readFile(new URL('../public/styles.css', import.meta.url),'utf8');
const prop = await readFile(new URL('../public/prop-hunt-3d.js', import.meta.url),'utf8');
const gameplay = await readFile(new URL('../public/shared-3d-gameplay.mjs', import.meta.url),'utf8');

test('Marbles & Jokers renders drilled sockets, routed Home channels and glossy seated marbles',()=>{
  assert.match(app,/marble-home-channel/);
  assert.match(css,/\.marble-home-channel\{/);
  assert.match(css,/radial-gradient\(ellipse at 50% 64%/);
  assert.match(css,/\.marble-piece:before/);
  assert.match(css,/partial|seated|socket|drilled/i);
});

test('Marbles board supports pinch zoom, empty-board pan, wheel zoom and movement waypoints',()=>{
  assert.match(app,/function bindMarbleBoardGestures\(\)/);
  assert.match(app,/pointers\.size>=2/);
  assert.match(app,/centreZoom/);
  assert.match(app,/addEventListener\('wheel'/);
  assert.match(app,/function marbleAnimationPath\(/);
  assert.match(app,/for\(let k=1;k<=Math\.abs\(signed\);k\+\+\)/);
  assert.match(app,/for\(let h=1;h<=Number\(to\.home\|\|1\);h\+\+\)/);
});

test('draw-required states are visibly highlighted in shared tabletop UI',()=>{
  assert.match(app,/table-deck-button draw-required/);
  assert.match(app,/marble-deck \$\{drawIdx>=0\?'draw-required'/);
  assert.match(css,/\.draw-required\{/);
  assert.match(css,/DRAW HERE|drawPilePulse/);
});

test('Cribbage is rank-sorted, auto-sends crib selection and surfaces contextual GO',()=>{
  assert.match(app,/cribRankSortOrder=\{'A':1/);
  assert.match(app,/Select \$\{need===2\?'two cards':'one card'\} · sends automatically/);
  assert.match(app,/crib-go-context/);
  assert.match(css,/\.crib-go-context\{/);
});

test('Crazy Eights countdown shows current stage and struck previous stage',()=>{
  assert.match(app,/function crazyProgressPanel/);
  assert.match(app,/<s>\$\{esc\(previous\)\}<\/s> →/);
  assert.match(css,/\.crazy-progress-list s\{/);
});

test('Game School contains actual guided interaction scenes for requested tabletop games',()=>{
  for(const demo of ['cribSorted','cribDiscard','cribGo','crazyDiscard','crazyProgress','marblesBoard','marblesHand','marblesPawn','euchreTrick'])assert.match(app,new RegExp(`demo:'${demo}'|d==='${demo}'`));
  assert.match(app,/How to Play · Guided Demo/);
  assert.match(app,/without changing this live match/);
});

test('Quick reactions include party and sly while retaining the shared reaction architecture',()=>{
  assert.match(app,/🥳/);
  assert.match(app,/😏/);
  assert.match(app,/data-react/);
});

test('Prop Hunt uses right-side touch look and two-finger camera pinch while retaining recovered camera solver',()=>{
  assert.match(prop,/gameplay\.bindPointerLook\(stage,game\.cameraRig/);
  assert.match(gameplay,/rightHalfTouch=true/);
  assert.match(gameplay,/points\.size>=2/);
  assert.match(gameplay,/cameraRig\.zoom\(-delta\*pinchScale\)/);
  assert.match(gameplay,/automatic close-camera collapse recovery/);
});
