import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const app=fs.readFileSync(new URL('../public/app.js',import.meta.url),'utf8');
const css=fs.readFileSync(new URL('../public/styles.css',import.meta.url),'utf8');

test('Trail Trouble has a visual track, cabins, camps, homes, drawn-card panel and animated markers',()=>{
  for(const token of ['trail-real-board','trail-space','trail-home-hole','trail-camp-label','trail-marker','trailCardPanel','trailCardHTML','animateTrailPositions'])assert.ok(app.includes(token),`missing ${token}`);
  for(const token of ['.trail-real-board','.trail-space.cabin','.trail-marker','.trail-card','.trail-layout'])assert.ok(css.includes(token),`missing CSS ${token}`);
});

test('Trail Trouble launch UI identifies the version as 1.0.6',()=>{
  assert.ok(app.includes("const APP_VERSION='1.0.6'"));
});
