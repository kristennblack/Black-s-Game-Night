import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {buildScrewSchedule,generateFuckSchedule} from '../gameEngine.mjs';

const read=rel=>readFile(new URL(rel,import.meta.url),'utf8');
const [app,css,phaseQa,gameplay,prop,island,birthday,sw]=await Promise.all([
  read('../public/app.js'),read('../public/styles.css'),read('../public/phase-e-qa.mjs'),read('../public/shared-3d-gameplay.mjs'),
  read('../public/prop-hunt-3d.js'),read('../public/island-life.js'),read('../public/birthday-climb.js'),read('../public/sw.js')
]);

test('normal Screw/Fuck/Smear table cards use immediate legal tap-to-play with a pending-action lock',()=>{
  assert.ok(app.includes('async function playStandardCardNow(cardId,source=null)'));
  assert.ok(app.includes("g.legalCardIds?.includes(cardId)"),'client preserves server-provided legal card filter');
  assert.ok(app.includes('session.cardPlayPending'),'pending lock must exist');
  assert.ok(app.includes("await api('play',{roomId:session.roomId,playerToken:session.playerToken,cardId})"));
  assert.ok(app.includes("document.querySelectorAll('[data-card]').forEach(el=>el.onclick=()=>playStandardCardNow(el.dataset.card,el))"));
  assert.ok(app.includes('function animateCardCommit(source)'));
  assert.ok(app.includes("document.querySelector('.center-trick')"));
  assert.doesNotMatch(app,/data-action=["']confirmCard["']/);
  assert.doesNotMatch(app,/case ['"]confirmCard['"]/);
});

test('genuine multi-step card actions remain available instead of being flattened into immediate play',()=>{
  for(const token of ['data-crib-send','selectedCribCards','extraCardChoicePanel','selectedTrailPawn','selectedMarblePawn','golfDiscardMode'])assert.ok(app.includes(token),token);
});

test('Screw score sheet is driven by the engine schedule and includes the complete up/down round progression',()=>{
  const schedule=buildScrewSchedule(4);
  assert.equal(schedule[0].handSize,1);
  assert.equal(schedule.at(-1).handSize,1);
  assert.ok(schedule.some((r,i)=>i>0&&r.handSize<schedule[i-1].handSize),'schedule includes descending rounds');
  for(const token of ['completeRoundScoreSheet','g.schedule||[]','g.history||[]','round-sheet-row','round-sheet-scroll','round-total-strip'])assert.ok(app.includes(token),token);
  assert.ok(css.includes('.round-sheet-scroll'));
});

test('Fuck score sheet uses the generated game schedule rather than inventing a fixed Screw sequence',()=>{
  const schedule=generateFuckSchedule(10,4);
  assert.equal(schedule.length,10);
  assert.ok(schedule.every(r=>Number.isInteger(r.handSize)&&r.handSize>=1));
  assert.ok(app.includes("s.gameType===GAME.FUCK"));
  assert.ok(app.includes('Power ${r.powerRank'));
  assert.ok(app.includes('schedule.map((r,i)=>'));
});

test('complete game sheets preserve completed scores, highlight focus round and show future rows',()=>{
  for(const token of ["state=i<focusRound||h?'complete':i===focusRound?'current':'future'","${i===focusRound?'focus':''}","x?`<strong>+${x.points}</strong><small>Total ${x.total}</small>`:'<span>—</span>'"])assert.ok(app.includes(token),token);
  for(const token of ['.round-sheet-row.complete','.round-sheet-row.future','.round-sheet-row.focus'])assert.ok(css.includes(token),token);
});

test('home redesign uses a stable cabin hero, approved John reference crop and restrained reduced-motion aware animation',()=>{
  for(const token of ['lodge-hero','home-title-lockup','BLACK FAMILY','GAME NIGHT','john-home-approved.jpg','home-john-feature','home-feature-strip'])assert.ok(app.includes(token),token);
  assert.ok(css.includes('home-cabin-background.jpg'));
  for(const token of ['homeFirelight','prefers-reduced-motion:reduce','.home-title-lockup','.lodge-game-card'])assert.ok(css.includes(token),token);
  assert.doesNotMatch(app,/approved-home-scene/);
});

test('standard 3D play hides developer warnings and QA controls unless qa3d mode is explicitly enabled',()=>{
  assert.ok(phaseQa.includes("get('qa3d')==='1'"));
  assert.ok(phaseQa.includes('button.hidden=!qaMode'));
  assert.ok(phaseQa.includes('panel.hidden=!qaMode'));
  assert.ok(phaseQa.includes('if(!qaMode)return;warning.textContent='));
});

test('3D phone cleanup keeps core recovery while using more readable per-game camera framing',()=>{
  for(const token of ['propHunt:{','cameraDistance:5.05','minCameraDistance:1.68','maxPitch:.25','island:{','cameraDistance:5.15','maxPitch:.29','birthday:{','cameraDistance:4.95','maxPitch:.31'])assert.ok(gameplay.includes(token),token);
  for(const src of [prop,island,birthday]){
    assert.ok(src.includes('resetPlayableView'));
    assert.ok(src.includes('mountZoomButtons'));
    assert.ok(src.includes('aria-label="Swap camera shoulder"'));
    assert.ok(src.includes('>↺</button>'));
  }
  assert.ok(sw.includes('black-family-game-night-staging-phase-h-tabletop-06'));
  assert.ok(sw.includes('/john-home-approved.jpg'));
  assert.ok(sw.includes('/home-cabin-background.jpg'));
});
