import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const read=p=>fs.readFileSync(new URL(`../${p}`,import.meta.url),'utf8');
const games={
  'camp-pong.html':['CAMP PONG','paddleHit','First to 7'],
  'goat-crossing.html':['GOAT CROSSING','type:\'water\'','resetGoat'],
  'shop-bomber.html':['SHOP BOMBER','function explode','PLACE CHARGE'],
  'cabin-blocks.html':['CABIN BLOCKS','const shapes=','function rotate'],
  'camp-2048.html':['CAMP 2048','lineMove','localStorage'],
  'minefield.html':['MINEFIELD','function plant','contextmenu'],
  'goat-whack.html':['GOAT WHACK','time=30','tool'],
  'memory-mayhem.html':['MEMORY MAYHEM','matched===16','localStorage'],
  'firelight-simon.html':['FIRELIGHT SIMON','createOscillator','nextRound'],
  'papas-pipes.html':["PAPA'S PIPES",'function makeMaze','lit.size===N*N']
};

test('Phase U2 build identity and master directive are current',()=>{
  assert.equal(read('VERSION.txt').trim(),'GAME-NIGHT-STAGING-PHASE-U2-ARCADE-PACK-22');
  assert.match(read('MASTER_PHASE_U2_ARCADE_PACK_DIRECTIVE.md'),/Arcade Corner therefore contains 14 instant-play games/);
});

test('Phase U2 adds ten self-contained original arcade HTML files',()=>{
  for(const [file,tokens] of Object.entries(games)){
    const html=read(`public/${file}`);
    assert.match(html,/<!doctype html>/i,file);
    assert.match(html,/<canvas/i,file);
    assert.match(html,/<style>/i,file);
    assert.match(html,/<script>/i,file);
    assert.doesNotMatch(html,/<script[^>]+src=/i,file);
    assert.doesNotMatch(html,/https?:\/\//i,file);
    for(const token of tokens)assert.ok(html.includes(token),`${file}: ${token}`);
  }
});

test('Arcade Corner registers all 14 direct-play games',()=>{
  const app=read('public/app.js');
  const paths=['breakout.html','space-shooter.html','rocket-gap.html','neon-snake.html',...Object.keys(games)];
  for(const path of paths)assert.ok(app.includes(`/${path}`),path);
  assert.match(app,/21 Table Games \+ 14 Arcade/);
});

test('Phase U2 service worker caches all ten new arcade routes with new namespace',()=>{
  const sw=read('public/sw.js');
  assert.match(sw,/black-family-game-night-staging-phase-u2-arcade-pack-22/);
  for(const file of Object.keys(games))assert.ok(sw.includes(`/${file}`),file);
});

test('Camp Pong uses hit-position reflection rather than fixed bounce only',()=>{
  const h=read('public/camp-pong.html');
  assert.match(h,/offset=\(ball\.x-pd\.x\)/);
  assert.match(h,/Math\.sin\(angle\)/);
});

test('Goat Crossing implements moving logs and lives',()=>{
  const h=read('public/goat-crossing.html');
  assert.match(h,/type:'log'/);assert.match(h,/goat\.x\+=log\.spd/);assert.match(h,/lives--/);
});

test('Shop Bomber blast propagation stops at walls and breaks crates',()=>{
  const h=read('public/shop-bomber.html');
  assert.match(h,/grid\[key\(x,y\)\]===1\)break/);assert.match(h,/grid\[key\(x,y\)\]===2/);
});

test('Cabin Blocks has a 10x20 field, line clears and speed ramp',()=>{
  const h=read('public/cabin-blocks.html');
  assert.match(h,/CW=10,RH=20/);assert.match(h,/board\.splice\(y,1\)/);assert.match(h,/Math\.floor\(lines\/10\)/);
});

test('Camp 2048 prevents move-spawn on unchanged boards and detects no moves',()=>{
  const h=read('public/camp-2048.html');
  assert.match(h,/if\(!same\(before,board\)\)/);assert.match(h,/if\(!canMove\(\)\)state='over'/);
});

test('Minefield protects first reveal neighborhood and supports long-press flags',()=>{
  const h=read('public/minefield.html');
  assert.match(h,/\[\[sx,sy\],\.\.\.neighbors\(sx,sy\)\]/);assert.match(h,/setTimeout\(\(\)=>\{if\(downCell\)/);
});

test('Papa pipes generates a spanning solvable network before scrambling rotations',()=>{
  const h=read('public/papas-pipes.html');
  assert.match(h,/seen=new Set\(\[0\]\)/);assert.match(h,/target\[idx\(x,y\)\]\|=a/);assert.match(h,/Math\.floor\(Math\.random\(\)\*4\)/);
});
