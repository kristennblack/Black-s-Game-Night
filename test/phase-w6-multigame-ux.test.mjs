import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {EAST,WEST,SOUTH,NORTH,tracePipeFlow} from '../public/vanessas-pipe-core.mjs';
import {GAME_TYPES} from '../gameEngine.mjs';
import {extraDefaults,startExtraGame,extraPublicState,extraGameAction} from '../extraGames.mjs';

const root=path.resolve(new URL('..',import.meta.url).pathname);
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const player=i=>({id:`p${i}`,token:`t${i}`,name:`Player ${i}`,avatar:'cowboy',variant:0,outfitVariant:0,color:'#2f6b4f',seat:i-1,ready:true,connected:true,bid:null,tricks:0,score:0,continued:false,hand:[],eliminated:false});
function room(type,n,settings={}){const ps=new Map(Array.from({length:n},(_,i)=>{const p=player(i+1);return[p.id,p]}));return{id:crypto.randomUUID(),gameType:type,settings:{...extraDefaults(type),...settings},players:ps,game:{phase:'lobby',history:[],schedule:[],winnerIds:[],extra:null}}}

test('W6 Vanessa wins when pump reaches destination even with unrelated disconnected pipe cells',()=>{
  const flow=tracePipeFlow([EAST,WEST|SOUTH,0,NORTH],2);
  assert.equal(flow.destinationConnected,true);
  assert.equal(flow.connected,false);
  assert.equal(flow.destinationDepth,2);
});

test('W6 Vanessa UI uses grey GMC, pink GMC lettering, destination win and automatic next level',()=>{
  const html=read('public/vanessas-pipe-problem.html'),ui=read('public/vanessas-pipe-problem.mjs');
  assert.match(html,/grey GMC/i);assert.match(html,/Reaching the truck wins the level/i);
  assert.match(ui,/destinationConnected/);assert.match(ui,/autoNextAt/);assert.match(ui,/level\+\+/);
  assert.match(ui,/fillText\('GMC'/);assert.match(ui,/#e85c9b/);
  assert.doesNotMatch(ui,/VANESSA.S PINK GMC|pink pickup/i);
});

test('W6 Logan offers per-profile tutorial choice, starts at 5x5 with a starter bike and draws a dirt bike',()=>{
  const html=read('public/logans-minefield.html'),core=read('public/logans-trail-logic-core.mjs');
  assert.match(html,/HOW TO PLAY/);assert.match(html,/SHOW TUTORIAL/);assert.match(html,/SKIP FOR ME/);assert.match(html,/bfgn_logan_tutorial_choice/);
  assert.match(html,/lockedGiven/);assert.match(html,/Starter bike placed for you/);assert.match(core,/if\(n<=3\)return 5/);
  for(const detail of ['Knobby tires','Engine block','Front suspension','number plate','Handlebars'])assert.match(html,new RegExp(detail,'i'));
});

test('W6 visual How To Play remains available after the W8 detailed tutorial upgrade',()=>{
  const platform=read('public/phase-w-platform.mjs'),tutorials=read('public/arcade-tutorials.mjs');
  assert.match(platform,/mountArcadeTutorial/);assert.match(platform,/HOW TO/);assert.match(tutorials,/SHOW TUTORIAL/);assert.match(tutorials,/SKIP FOR ME/);
  const app=read('public/app.js');assert.match(app,/How to Play · Guided Demo/);
});

test('W6 Mexican Train has board-first surface, shows every domino and permits rack rearranging',()=>{
  const app=read('public/app.js'),css=read('public/styles.css');
  assert.match(app,/mexicanTrainGameplay/);assert.match(app,/mexican-focus-surface/);assert.match(app,/mexican-all-dominoes/);assert.match(app,/data-domino-shift/);assert.match(app,/data-domino-drag/);
  assert.match(css,/mexican-all-dominoes/);assert.match(css,/flex-wrap\s*:\s*wrap/);
});

test('W6 Golf stock draw may be discarded without flipping or replacing a grid card',()=>{
  const r=room(GAME_TYPES.GOLF,3);startExtraGame(r);const ex=r.game.extra,p=r.players.get(ex.turnPlayerId);
  const before=ex.grids[p.id].map(x=>({face:x.face,id:x.card.id}));
  const draw=extraPublicState(r,p).actions.find(a=>a.action==='golfDraw'&&a.args?.source==='stock');assert.ok(draw);extraGameAction(r,p,draw);
  const discard=extraPublicState(r,p).actions.find(a=>a.action==='golfDiscardDrawn');assert.ok(discard);extraGameAction(r,p,discard);
  assert.deepEqual(ex.grids[p.id].map(x=>({face:x.face,id:x.card.id})),before);assert.equal(ex.drawn,null);
});

test('W6 Golf renders all eight own cards plus other players and final-turn status',()=>{
  const app=read('public/app.js');assert.match(app,/YOUR 8 CARDS · 2 × 4/);assert.match(app,/OTHER PLAYERS/);assert.match(app,/golfMiniGrid/);assert.match(app,/golf-final-turn-banner/);assert.match(app,/DISCARD · KEEP ALL GRID CARDS AS-IS/);
});

test('W6 Mitts records captured cards and renders them in front of the team',()=>{
  const r=room(GAME_TYPES.MITTS,4);startExtraGame(r);const ex=r.game.extra,p=r.players.get(ex.turnPlayerId),team=p.seat%2===0?'A':'B';
  ex.pile=[{id:'pile5',rank:'5',suit:'clubs'}];p.hand=[{id:'play5',rank:'5',suit:'hearts'},{id:'keep9',rank:'9',suit:'spades'}];
  extraGameAction(r,p,{action:'mittPlay',args:{cardId:'play5'}});
  assert.equal(ex.captures[team].length,1);assert.equal(ex.captures[team][0].cards.length,2);
  const app=read('public/app.js');assert.match(app,/mittCaptureMat/);assert.match(app,/isMine\?'YOUR '/);assert.match(app,/mitt-capture-mat/);assert.match(app,/CAPTURE/);
});

test('W6 Nana has a visible point guide, do-not-hit target and more dimensional animal drawing',()=>{
  const html=read('public/nanas-goat-whack.html');
  for(const animal of ['GOAT','PIG','CHICKEN','RED TOOLBOX','DO NOT HIT'])assert.match(html,new RegExp(animal,'i'));
  assert.match(html,/<strong>\+1<\/strong>/);assert.match(html,/<strong>\+2<\/strong>/);assert.match(html,/<strong>−5<\/strong>/);
  assert.match(html,/createRadialGradient/);assert.match(html,/createLinearGradient/);
});

test('W6 Kelsi Rock n Roll Rescue replaces Neon Star Patrol and old Kelsi game redirects',()=>{
  const app=read('public/app.js'),game=read('public/space-shooter.html'),old=read('public/kelsis-rock-hunt.html');
  assert.match(app,/Kelsi's Rock 'n' Roll Rescue/);assert.doesNotMatch(app,/name:'Neon Star Patrol'/);assert.doesNotMatch(app,/kelsirocks:\{/);
  assert.match(game,/Kelsi's Rock 'n' Roll Rescue/i);assert.match(game,/shiny/i);assert.match(game,/mud/i);assert.match(game,/rock/i);
  assert.match(old,/space-shooter\.html/);
});

test('W6 pending 31 Blind note is superseded by the later clarified family rule',()=>{
  const master=read('MASTER_NEXT_BUILD_DEVELOPMENT_DIRECTIVE.md');
  assert.match(master,/Blind player starts with exactly 3 face-down cards/i);
  assert.match(master,/replace one of their face-down cards without looking/i);
  assert.match(master,/pass and wait for the next turn/i);
});
