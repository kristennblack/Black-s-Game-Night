import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {generatePuzzle,countSolutions,allRegionsConnected,isSolved,placementConflicts,solutionIndexForRow,sizeForJourneyLevel} from '../public/logans-trail-logic-core.mjs';
import {rotateMask,buildPipePuzzle,tracePipeFlow} from '../public/vanessas-pipe-core.mjs';

const read=p=>readFile(new URL(p,import.meta.url),'utf8');

test('Logan journey progresses 6x6 through expert 9x9',()=>{
  assert.equal(sizeForJourneyLevel(1),6);assert.equal(sizeForJourneyLevel(6),7);assert.equal(sizeForJourneyLevel(11),8);assert.equal(sizeForJourneyLevel(16),9);
});

test('Logan generated terrain puzzles are connected and uniquely solvable at every supported size',()=>{
  for(const n of [6,7,8,9])for(const seed of [11,29,47,83,131]){
    const puzzle=generatePuzzle({n,seed});
    assert.equal(countSolutions(puzzle,2),1,`${n}x${n} seed ${seed} should be unique`);
    assert.equal(allRegionsConnected(puzzle),true,`${n}x${n} seed ${seed} should have connected regions`);
    const marks=Array(n*n).fill(0);for(let r=0;r<n;r++)marks[solutionIndexForRow(puzzle,r)]=2;
    assert.equal(isSolved(puzzle,marks),true,`${n}x${n} known solution should solve`);
  }
});

test('Logan conflicts detect row/column/region/touch violations instead of blocking experimentation',()=>{
  const puzzle=generatePuzzle({n:6,seed:77}),marks=Array(36).fill(0);
  marks[0]=2;marks[1]=2;
  assert.ok(placementConflicts(puzzle,marks).size>=2,'adjacent same-row bikes must conflict');
});

test('Logan page is fully re-themed from Minefield to dirt-bike and fishing trail logic',async()=>{
  const html=await read('../public/logans-minefield.html');
  assert.match(html,/LOGAN'S TRAIL LOGIC/);assert.match(html,/DIRT BIKES \+ FISHING/);assert.match(html,/LEVEL JOURNEY/);assert.match(html,/DAILY PUZZLE/);
  assert.match(html,/One bike per row, column and terrain/);assert.match(html,/Bikes cannot touch/);assert.match(html,/X → dirt bike → empty/);
  assert.doesNotMatch(html,/Minesweeper|angry goose|Tap to clear|Hold or right-click to flag/i);
});

test('home shelf identifies Logan as Trail Logic and Vanessa as detailed worksite service game',async()=>{
  const app=await read('../public/app.js');
  assert.match(app,/Logan's Trail Logic/);assert.match(app,/one per row, column and terrain region/);
  assert.match(app,/Vanessa’s pink GMC and grey hauler/);
});

test('Vanessa pipe rotation and flow core support full connected service networks',()=>{
  for(const mask of [1,2,3,5,7,15]){let out=mask;for(let i=0;i<4;i++)out=rotateMask(out);assert.equal(out,mask)}
  const p=buildPipePuzzle({n:6,level:7,rng:()=>0.37});
  assert.equal(p.target.length,36);assert.ok(p.hazards.filter(Boolean).length>=3,'later levels should include repair hazards');
  const flow=tracePipeFlow(p.target,6);assert.equal(flow.connected,true);assert.ok(flow.maxDepth>0);
});

test('Vanessa presentation contains dimensional pipes, grey hauler, pink GMC and repair hazards',async()=>{
  const html=await read('../public/vanessas-pipe-problem.html'),ui=await read('../public/vanessas-pipe-problem.mjs');
  assert.match(html,/pink GMC pickup/);assert.match(html,/REPAIRS/);assert.match(html,/repair a damaged socket first/);
  assert.match(ui,/GREY HAULER • SERVICE DECK/);assert.match(ui,/VANESSA’S PINK GMC/);assert.match(ui,/GMC/);
  assert.match(ui,/Couplers at each opening/);assert.match(ui,/drawHazard/);assert.match(ui,/lineDashOffset/);assert.match(ui,/rotate\(angle\)/);
});
