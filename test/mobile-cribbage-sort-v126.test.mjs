import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
const app=await readFile(new URL('../public/app.js',import.meta.url),'utf8');
const css=await readFile(new URL('../public/styles.css',import.meta.url),'utf8');
const sw=await readFile(new URL('../public/sw.js',import.meta.url),'utf8');

test('v1.2.6 standard card hands are grouped by suit and sorted high to low',()=>{
  assert.match(app,/const suitSortOrder=\{spades:0,hearts:1,diamonds:2,clubs:3,joker:4,none:5\}/);
  assert.match(app,/return rb-ra/);
  assert.match(app,/sortedCards\(g\.hand/);
  assert.match(app,/sortedCards\(e\.hand/);
});

test('v1.2.6 Cribbage exposes GO and count actions above the hand on phones',()=>{
  for(const token of ['function cribMobileActions','cribGo','cribReveal','cribCountNext','crib-mobile-actions','aria-label="Cribbage actions"']) assert.ok(app.includes(token),token);
  assert.match(css,/\.crib-mobile-actions\{display:none\}/);
  assert.match(css,/@media\(max-width:620px\)[\s\S]*\.crib-mobile-actions\{display:flex/);
  assert.match(css,/bottom:calc\(104px \+ env\(safe-area-inset-bottom\)\)/);
});

test('v1.2.6 Cribbage phone table is viewport-height and compact instead of forcing 760px',()=>{
  assert.match(css,/\.extra-cribbage\{min-height:calc\(100svh - 142px\)!important;height:calc\(100svh - 142px\)/);
  assert.match(css,/\.extra-cribbage \.extra-center\{width:98%!important/);
  assert.match(css,/\.crib-pegging\{grid-template-columns:58px minmax\(0,1fr\)!important/);
  assert.match(css,/\.extra-cribbage \.extra-hand-card\{max-width:50px!important\}/);
  assert.ok(sw.includes('black-family-game-night-v180-prop-redesign-test'));
});
