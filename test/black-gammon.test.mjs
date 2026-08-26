import test from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { GAME_TYPES } from '../gameEngine.mjs';
import { extraDefaults, startExtraGame, extraPublicState, extraGameAction } from '../extraGames.mjs';
import { blackAllocationPlans, blackLegalMoves, BLACK_GAMMON_BIG_DIE_VALUES } from '../blackGammon.mjs';

const player=i=>({id:`p${i}`,token:`t${i}`,name:`Player ${i}`,avatar:i===1?'john':'kristen',variant:0,outfitVariant:0,color:i===1?'#9b3e3a':'#305c9b',seat:i-1,ready:true,connected:true,isBot:false,botDifficulty:null,bid:null,tricks:0,score:0,continued:false,hand:[],eliminated:false});
function room(){const players=new Map([["p1",player(1)],["p2",player(2)]]);return{id:crypto.randomUUID(),gameType:GAME_TYPES.BLACK_GAMMON,settings:{...extraDefaults(GAME_TYPES.BLACK_GAMMON)},players,game:{phase:'lobby',history:[],schedule:[],winnerIds:[],extra:null}}}
const act=(r,p,a)=>extraGameAction(r,p,a);
function clearBoard(ex){for(const id of Object.keys(ex.points)){ex.points[id]=Array(24).fill(0);ex.bar[id]=0;ex.off[id]=0;ex.riskDue[id]=Array(24).fill(null);ex.overDue[id]=Array(24).fill(null)}ex.top=Array(24).fill(null)}
function setMoving(ex,id,tokens){ex.phase='moving';ex.turnPlayerId=id;ex.assignments={p1:[],p2:[],[id]:tokens};ex.moveQueue=[id];ex.moveIndex=0}

 test('Black Gammon is a separate two-player game with the confirmed 4/4/4/3 starting setup',()=>{
  const r=room();startExtraGame(r);const ex=r.game.extra;
  assert.equal(ex.type,GAME_TYPES.BLACK_GAMMON);assert.equal(ex.phase,'rolling');
  assert.deepEqual([ex.points.p1[23],ex.points.p1[12],ex.points.p1[7],ex.points.p1[5]],[4,4,4,3]);
  assert.deepEqual([ex.points.p2[0],ex.points.p2[11],ex.points.p2[16],ex.points.p2[18]],[4,4,4,3]);
  assert.equal(ex.points.p1.reduce((a,b)=>a+b,0),15);assert.equal(ex.points.p2.reduce((a,b)=>a+b,0),15);
 });

test('Black Gammon large die has the locked seven tiebreak values only',()=>{
 assert.deepEqual(BLACK_GAMMON_BIG_DIE_VALUES,[2,4,6,8,16,32,64]);
});

test('Triple allocation lets the controller choose the triple recipient and direction while both players receive the unmatched single',()=>{
 const r=room();startExtraGame(r);const ex=r.game.extra;ex.controllerId='p1';ex.pool=[3,3,3,5];ex.phase='allocate';
 const plans=blackAllocationPlans(r);assert.equal(plans.length,4);
 const giveBack=plans.find(x=>x.label.includes('Player 2 gets triple 3s backward'));assert.ok(giveBack);
 assert.ok(giveBack.assignments.p2.some(t=>t.kind==='triple'&&t.value===3&&t.remaining===12&&t.direction==='backward'));
 assert.ok(giveBack.assignments.p1.some(t=>t.kind==='single'&&t.value===5));assert.ok(giveBack.assignments.p2.some(t=>t.kind==='single'&&t.value===5));
});

test('Two different doubles split as double sets and controller chooses direction for both',()=>{
 const r=room();startExtraGame(r);const ex=r.game.extra;ex.controllerId='p1';ex.pool=[2,2,5,5];ex.phase='allocate';
 const plans=blackAllocationPlans(r);assert.equal(plans.length,8);
 assert.ok(plans.some(x=>x.assignments.p1.some(t=>t.kind==='double'&&t.value===5&&t.direction==='backward')&&x.assignments.p2.some(t=>t.kind==='double'&&t.value===2&&t.direction==='forward')));
});

test('A single 4 is backward before all checkers are home and cannot enter from the bar',()=>{
 const r=room();startExtraGame(r);const ex=r.game.extra;clearBoard(ex);ex.points.p1[5]=1;ex.points.p1[12]=14;
 setMoving(ex,'p1',[{id:'s4',kind:'single',value:4,direction:'auto',remaining:1,transferred:false}]);
 let moves=blackLegalMoves(r,'p1');assert.ok(moves.length);assert.ok(moves.every(m=>m.direction==='backward'));assert.ok(moves.some(m=>m.from===5&&m.to===9));
 ex.bar.p1=1;ex.points.p1[5]=0;setMoving(ex,'p1',[{id:'s4b',kind:'single',value:4,direction:'auto',remaining:1,transferred:false}]);
 moves=blackLegalMoves(r,'p1');assert.equal(moves.length,0);
});

test('Double 4 can enter from the bar and uses normal entry before a backward set continues backward',()=>{
 const r=room();startExtraGame(r);const ex=r.game.extra;clearBoard(ex);ex.bar.p1=2;ex.points.p1[12]=13;
 setMoving(ex,'p1',[{id:'d4',kind:'double',value:4,direction:'backward',remaining:4,transferred:false}]);
 let moves=blackLegalMoves(r,'p1');assert.ok(moves.some(m=>m.from==='bar'&&m.to===20&&m.direction==='forward'));
 const first=extraPublicState(r,r.players.get('p1')).actions.find(a=>a.action==='blackMove'&&a.args.from==='bar');act(r,r.players.get('p1'),first);
 const second=extraPublicState(r,r.players.get('p1')).actions.find(a=>a.action==='blackMove'&&a.args.from==='bar');act(r,r.players.get('p1'),second);
 assert.equal(ex.bar.p1,0);assert.equal(ex.points.p1[20],2);
 const after=blackLegalMoves(r,'p1');assert.ok(after.some(m=>m.direction==='backward'));
});

test('A single opposing checker dies immediately, while a two-checker stack can be covered by a legal group and gets rescue time',()=>{
 const r=room();startExtraGame(r);const ex=r.game.extra;clearBoard(ex);ex.points.p1[10]=2;ex.points.p2[8]=1;
 setMoving(ex,'p1',[{id:'d2',kind:'double',value:2,direction:'forward',remaining:4,transferred:false}]);
 let a=extraPublicState(r,r.players.get('p1')).actions.find(x=>x.action==='blackMove'&&x.args.from===10&&x.args.to===8&&x.args.count===1);assert.ok(a);act(r,r.players.get('p1'),a);assert.equal(ex.points.p2[8],0);assert.equal(ex.bar.p2,1);
 clearBoard(ex);ex.points.p1[10]=2;ex.points.p2[8]=2;setMoving(ex,'p1',[{id:'d2b',kind:'double',value:2,direction:'forward',remaining:4,transferred:false}]);
 a=extraPublicState(r,r.players.get('p1')).actions.find(x=>x.action==='blackMove'&&x.args.from===10&&x.args.to===8&&x.args.count===2);assert.ok(a);act(r,r.players.get('p1'),a);assert.equal(ex.points.p1[8],2);assert.equal(ex.points.p2[8],2);assert.equal(ex.bar.p2,0);assert.equal(ex.riskDue.p2[8],null);
});

test('Four is the normal own-point cap but temporary overstack is permitted while covering opponents',()=>{
 const r=room();startExtraGame(r);const ex=r.game.extra;clearBoard(ex);ex.points.p1[10]=1;ex.points.p1[8]=4;
 setMoving(ex,'p1',[{id:'s2',kind:'single',value:2,direction:'auto',remaining:1,transferred:false}]);
 assert.equal(blackLegalMoves(r,'p1').some(m=>m.from===10&&m.to===8),false);
 ex.points.p2[8]=2;setMoving(ex,'p1',[{id:'s2x',kind:'single',value:2,direction:'auto',remaining:1,transferred:false}]);
 assert.ok(blackLegalMoves(r,'p1').some(m=>m.from===10&&m.to===8));
});

test('Black Gammon UI is on the shelf, uses direction/rescue colors, and bot controls default Easy with readable selects',async()=>{
 const app=await readFile(new URL('../public/app.js',import.meta.url),'utf8'),css=await readFile(new URL('../public/styles.css',import.meta.url),'utf8'),worker=await readFile(new URL('../worker.mjs',import.meta.url),'utf8');
 for(const token of ['BLACK_GAMMON','Black Gammon','blackGammonBoard','BLUE · FORWARD','RED · BACKWARD','GOLD · RESCUE'])assert.match(app,new RegExp(token.replaceAll('.','\\.')));
 assert.match(app,/botDifficultyOptions\('easy'\)/);assert.match(app,/value\|\|'easy'/);assert.match(worker,/normalizeDifficulty[\s\S]*:'easy'/);assert.match(worker,/makeBot\(room,difficulty='easy'/);
 assert.match(css,/bot-add-grid select[\s\S]*#fff7e5/);assert.match(css,/black-dest-actions button\.forward/);assert.match(css,/black-dest-actions button\.backward/);assert.match(css,/black-dest-actions button\.rescue/);
});

test('unused ordinary singles transfer once without upgrading matching sets',()=>{
 const r=room();startExtraGame(r);const ex=r.game.extra;clearBoard(ex);ex.bar.p1=1;ex.points.p1[12]=14;ex.points.p2[0]=15;
 setMoving(ex,'p1',[{id:'only4',kind:'single',value:4,direction:'auto',remaining:1,transferred:false}]);ex.assignments.p2=[{id:'held4',kind:'single',value:4,direction:'auto',remaining:1,transferred:false}];ex.moveQueue=['p1','p2'];ex.moveIndex=0;
 act(r,r.players.get('p1'),{action:'blackNoMove'});
 assert.equal(ex.turnPlayerId,'p2');const fours=ex.assignments.p2.filter(t=>t.value===4);assert.equal(fours.length,2);assert.ok(fours.every(t=>t.kind==='single'));assert.ok(fours.some(t=>t.transferred));
});

test('a single 4 flips positive immediately after the last outside checker reaches home',()=>{
 const r=room();startExtraGame(r);const ex=r.game.extra;clearBoard(ex);ex.points.p1[6]=1;ex.points.p1[0]=4;ex.points.p1[1]=4;ex.points.p1[2]=3;ex.points.p1[3]=3;
 setMoving(ex,'p1',[{id:'s1home',kind:'single',value:1,direction:'auto',remaining:1,transferred:false},{id:'s4flip',kind:'single',value:4,direction:'auto',remaining:1,transferred:false}]);
 let moves=blackLegalMoves(r,'p1');assert.ok(moves.some(m=>m.tokenId==='s4flip'&&m.direction==='backward'));
 const home=extraPublicState(r,r.players.get('p1')).actions.find(a=>a.action==='blackMove'&&a.args.tokenId==='s1home'&&a.args.from===6&&a.args.to===5);assert.ok(home);act(r,r.players.get('p1'),home);
 moves=blackLegalMoves(r,'p1');assert.ok(moves.some(m=>m.tokenId==='s4flip'&&m.direction==='forward'&&m.to==='off'));
});

test('risk and overstack deadlines resolve even when a player receives no movement in that roll',()=>{
 const r=room();startExtraGame(r);const ex=r.game.extra;clearBoard(ex);ex.round=2;ex.points.p1[8]=3;ex.points.p2[8]=2;ex.riskDue.p2[8]=2;ex.points.p2[10]=5;ex.overDue.p2[10]=2;
 ex.phase='moving';ex.turnPlayerId='p1';ex.assignments={p1:[],p2:[]};ex.moveQueue=['p1'];ex.moveIndex=0;
 act(r,r.players.get('p1'),{action:'blackNoMove'});
 assert.equal(ex.round,3);assert.equal(ex.points.p2[8],0);assert.equal(ex.points.p2[10],4);assert.equal(ex.bar.p2,3);
});
