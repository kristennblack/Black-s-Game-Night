import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const app=fs.readFileSync(new URL('../public/app.js',import.meta.url),'utf8');
const css=fs.readFileSync(new URL('../public/styles.css',import.meta.url),'utf8');

test('Trail Trouble has a square race board with Camp zones, Safe Trails, Home, zoom, cards and tappable markers',()=>{
  for(const token of ['trail-real-board','trail-safe-hole','trail-camp-zone','trail-marker','trailTableCards','trail-card-button','data-trail-zoom','data-trail-card-select','selectedTrailPawn','animateTrailPositions'])assert.ok(app.includes(token),`missing ${token}`);
  for(const token of ['.trail-real-board.advanced','.trail-safe-hole','.trail-camp-zone','.trail-board-viewport','.trail-table-cards','.trail-marker.selected'])assert.ok(css.includes(token),`missing CSS ${token}`);
});

test('Trail Trouble launch UI identifies the launch version',()=>{
  assert.ok(app.includes("const APP_VERSION='1.6.0-prop-mystery-test'"));
});
