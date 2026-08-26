import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const html=fs.readFileSync(new URL('../public/breakout.html',import.meta.url),'utf8');
const app=fs.readFileSync(new URL('../public/app.js',import.meta.url),'utf8');
const sw=fs.readFileSync(new URL('../public/sw.js',import.meta.url),'utf8');

test('Cabin Breakout is one self-contained canvas file with valid inline JS',()=>{
  assert.match(html,/<canvas id="game" width="720" height="960"/);
  assert.match(html,/<style>[\s\S]*<\/style>/);
  const script=html.match(/<script>([\s\S]*?)<\/script>/)?.[1];
  assert.ok(script,'inline script exists');
  assert.doesNotThrow(()=>new Function(script));
  assert.doesNotMatch(html,/<script[^>]+src=/i);
  assert.doesNotMatch(html,/<link[^>]+stylesheet/i);
  assert.doesNotMatch(html,/<img\b/i);
});

test('Breakout uses the selected 6x10 layout, 3 lives, both controls and MULTI extra',()=>{
  assert.match(html,/ROWS=6,COLS=10,START_LIVES=3/);
  assert.match(html,/ArrowLeft/);
  assert.match(html,/pointermove/);
  assert.match(html,/touch-action:none/);
  assert.match(html,/MULTI-ball power-ups|MULTI orb/i);
  assert.match(html,/function splitBalls\(/);
});

test('Breakout uses swept expanded-AABB collision and aimable paddle reflection',()=>{
  assert.match(html,/function rayExpandedAabb\(/);
  assert.match(html,/function earliestCollision\(/);
  assert.match(html,/while\(remain>1e-5&&iterations\+\+<10/);
  assert.match(html,/rel=clamp\(\(ball\.x-center\)\/\(paddle\.w\/2\),-1,1\)/);
  assert.match(html,/maxAngle=70\*Math\.PI\/180/);
});

test('Breakout includes score lives win game-over and restart flows',()=>{
  assert.match(html,/id="score"/);
  assert.match(html,/id="lives"/);
  assert.match(html,/YOU WIN!/);
  assert.match(html,/GAME OVER/);
  assert.match(html,/press Space to restart/i);
  assert.match(html,/restartBtn\.addEventListener\('click',resetGame\)/);
});

test('Cabin Breakout appears in the lodge Arcade Corner and routes to its page',()=>{
  assert.match(app,/const arcadeGames=\{/);
  assert.match(app,/breakout:\{name:'Cabin Breakout'/);
  assert.match(app,/path:'\/breakout\.html'/);
  assert.match(app,/>Arcade Corner</);
  assert.match(app,/data-arcade-game/);
  assert.match(app,/location\.href=m\.path/);
  assert.match(sw,/'\/breakout\.html'/);
});
