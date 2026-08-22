import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const app=fs.readFileSync(new URL('../public/app.js',import.meta.url),'utf8');
const css=fs.readFileSync(new URL('../public/styles.css',import.meta.url),'utf8');

test('chat messages can surface as a temporary named banner',()=>{
  assert.match(app,/function noteNewChat\(next\)/);
  assert.match(app,/class="chat-toast"/);
  assert.match(app,/m\.name/);
  assert.match(app,/m\.text/);
  assert.match(css,/\.chat-toast\{/);
});

test('Last Haven uses a responsive felt board with routes, camps and direct board actions',()=>{
  assert.match(app,/haven-board-shell/);
  assert.match(app,/haven-route-layer/);
  assert.match(app,/class="haven-site/);
  assert.match(app,/data-extra-action/);
  assert.match(css,/\.extra-lasthaven \.extra-center/);
  assert.match(css,/\.haven-wrap\{background:linear-gradient/);
});

test('hand-based extra games support tap-to-play cards and contextual card choices',()=>{
  assert.match(app,/function extraCardActionIndexes/);
  assert.match(app,/data-extra-card=/);
  assert.match(app,/TAP A HIGHLIGHTED CARD TO PLAY/);
  assert.match(app,/function extraCardChoicePanel/);
  assert.match(css,/\.extra-hand-card\.playable/);
});
