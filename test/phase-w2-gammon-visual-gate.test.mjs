import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const read=async p=>readFile(new URL(`../${p}`,import.meta.url),'utf8');

test('Phase W.2 Gammon renderer draws one physical disc for every checker in a stack',async()=>{
  const app=await read('public/app.js');
  assert.match(app,/function bgCheckerDiscs\(count\)\{return Array\.from\(\{length:Math\.max\(0,Number\(count\)\|\|0\)\}/);
  assert.match(app,/bgCheckerDiscs\(count\)/);
  assert.match(app,/data-checker-count="\$\{count\}"/);
  const section=app.slice(app.indexOf('function bgCheckers'),app.indexOf('function extraCardLabel'));
  assert.doesNotMatch(section,/<i><\/i><i><\/i><i><\/i>\$\{count>3/);
});

test('Phase W.2 uses a real vertical center bar and four six-point board quadrants',async()=>{
  const app=await read('public/app.js'),css=await read('public/styles.css');
  for(const token of ['bg-quadrant top left','bg-quadrant top right','bg-quadrant bottom left','bg-quadrant bottom right']) assert.ok(app.includes(token),token);
  assert.match(css,/\.gammon-focus-surface \.bg-bar\{[^}]*grid-column:2!important;grid-row:1\/3!important/s);
  assert.match(css,/\.gammon-focus-surface \.bg-board\{[^}]*grid-template-columns:minmax\(0,1fr\).*minmax\(0,1fr\)/s);
});

test('Phase W.2 checker faces are circular and board-first layout no longer reserves a permanent side rail',async()=>{
  const css=await read('public/styles.css');
  const gate=css.slice(css.indexOf('Phase W.2: Backgammon / Black Gammon board-first visual gate'));
  assert.match(gate,/\.gammon-focus-layout\{grid-template-columns:1fr!important/);
  assert.match(gate,/\.gammon-board-viewport\{min-height:0!important;height:auto!important/);
  assert.match(gate,/\.gammon-focus-surface \.bg-checker-stack i\{[^}]*aspect-ratio:1\/1!important[^}]*border-radius:50%!important/s);
  assert.match(gate,/\.gammon-focus-surface \.backgammon-table\{[^}]*grid-template-columns:1fr!important/s);
});

test('Bear-off trays are integrated into the board case and render physical round pieces',async()=>{
  const app=await read('public/app.js'),css=await read('public/styles.css');
  assert.match(app,/class="bg-off-pieces"/);
  assert.match(css,/\.gammon-focus-surface \.bg-off-trays\{grid-column:2!important/);
  assert.match(css,/\.gammon-focus-surface \.bg-off-pieces em\{[^}]*aspect-ratio:1\/1!important[^}]*border-radius:50%!important/s);
});

test('Black Gammon shares standard viewer orientation and preserves blue red gold move language',async()=>{
  const app=await read('public/app.js');
  assert.match(app,/function blackPointOrder\(viewerIsFirst\)\{return bgPointOrder\(viewerIsFirst\)\}/);
  for(const phrase of ['BLUE · FORWARD','RED · BACKWARD','GOLD · RESCUE']) assert.ok(app.includes(phrase),phrase);
});

test('Phase W.2 visual QA fixtures show complete starting boards',async()=>{
  for(const file of ['public/_phase_w2_backgammon_visual_qa.html','public/_phase_w2_blackgammon_visual_qa.html']){
    const html=await read(file);
    assert.ok((html.match(/<i><\/i>/g)||[]).length>=30,`${file} should contain at least 30 physical checker discs`);
    assert.match(html,/all 30 checkers physically rendered/i);
  }
});
