import crypto from 'node:crypto';
import { GAME_TYPES } from './gameEngine.mjs';

const BIG_DIE_VALUES=[2,4,6,8,16,32,64];
const uid=(p='bgm')=>`${p}-${crypto.randomUUID().slice(0,10)}`;
const rollDie=()=>crypto.randomInt(1,7);
const rollBigDie=()=>BIG_DIE_VALUES[crypto.randomInt(0,BIG_DIE_VALUES.length)];
const order=room=>[...room.players.values()].filter(p=>p.seat!=null).sort((a,b)=>a.seat-b.seat).map(p=>p.id);
const P=(room,id)=>room.players.get(id);
const opponent=(room,id)=>order(room).find(x=>x!==id);
const seatIndex=(room,id)=>order(room).indexOf(id);
const forwardDir=(room,id)=>seatIndex(room,id)===0?-1:1;
const homePoints=(room,id)=>seatIndex(room,id)===0?[0,1,2,3,4,5]:[18,19,20,21,22,23];
const entryPoint=(room,id,die)=>forwardDir(room,id)<0?24-die:die-1;
const empty24=()=>Array(24).fill(0);
const emptyDue=()=>Array(24).fill(null);
const clonePoints=pts=>Object.fromEntries(Object.entries(pts).map(([id,a])=>[id,[...a]]));
const sum=a=>(a||[]).reduce((n,x)=>n+Number(x||0),0);

export const BLACK_GAMMON_META={name:'Black Gammon',icon:'⚫',sub:'Black family house rules: shared dice, backward sets, stacking, rescue and bar play',min:2,max:2};
export const BLACK_GAMMON_DEFAULTS={beginnerHelp:true};

function setup(room){
 const ids=order(room);if(ids.length!==2)throw new Error('Black Gammon needs exactly 2 players');
 const points=Object.fromEntries(ids.map(id=>[id,empty24()]));
 // Same occupied points as standard backgammon, Black Gammon counts 4/4/4/3.
 points[ids[0]][23]=4;points[ids[0]][12]=4;points[ids[0]][7]=4;points[ids[0]][5]=3;
 points[ids[1]][0]=4;points[ids[1]][11]=4;points[ids[1]][16]=4;points[ids[1]][18]=3;
 return {points,bar:Object.fromEntries(ids.map(id=>[id,0])),off:Object.fromEntries(ids.map(id=>[id,0])),top:Array(24).fill(null)};
}
function resetPlayers(room){for(const p of room.players.values()){p.hand=[];p.score=0;p.bid=null;p.tricks=0;p.continued=false;p.eliminated=false}}
function setExtra(room,ex){room.game.extra=ex;room.game.phase='extra';room.game.winnerIds=[];room.game.history=ex.history||[]}
function finish(room,winnerId){const ex=room.game.extra;ex.phase='gameOver';ex.turnPlayerId=null;ex.winnerId=winnerId;ex.message=`${P(room,winnerId).name} bore off all 15 checkers and wins Black Gammon.`;room.game.phase='gameOver';room.game.winnerIds=[winnerId];room.game.history=ex.history||[];P(room,winnerId).score=1}

export function startBlackGammon(room){
 resetPlayers(room);const ids=order(room),b=setup(room);
 const riskDue=Object.fromEntries(ids.map(id=>[id,emptyDue()])),overDue=Object.fromEntries(ids.map(id=>[id,emptyDue()])),lastMovedRound=Object.fromEntries(ids.map(id=>[id,0]));
 setExtra(room,{type:GAME_TYPES.BLACK_GAMMON,phase:'rolling',round:1,points:b.points,bar:b.bar,off:b.off,top:b.top,riskDue,overDue,lastMovedRound,rolls:Object.fromEntries(ids.map(id=>[id,null])),bigRolls:Object.fromEntries(ids.map(id=>[id,null])),bigDieSide:'right',bigTieCount:0,controllerId:null,pool:[],assignments:Object.fromEntries(ids.map(id=>[id,[]])),moveQueue:[],moveIndex:-1,turnPlayerId:null,message:'Both players roll two dice. Highest total controls the shared four-die pool.',lastMove:null,history:[],winnerId:null});
}

function allHome(ex,room,id){if(ex.bar[id]>0)return false;const home=new Set(homePoints(room,id));for(let i=0;i<24;i++)if(ex.points[id][i]>0&&!home.has(i))return false;return true}
function singleDirection(ex,room,id,value){return Number(value)===4&&!allHome(ex,room,id)?'backward':'forward'}
function canBear(ex,room,id){return allHome(ex,room,id)}
function oversizeBearAllowed(ex,room,id,from,die){const dir=forwardDir(room,id);if(dir<0){if(die<=from+1)return false;for(let i=from+1;i<=5;i++)if(ex.points[id][i]>0)return false;return true}if(die<=24-from)return false;for(let i=18;i<from;i++)if(ex.points[id][i]>0)return false;return true}
function effectiveDirection(ex,room,id,token){if(token.kind==='single')return singleDirection(ex,room,id,token.value);if(ex.bar[id]>0)return'forward';return token.direction||'forward'}
function token(kind,value,direction='forward',remaining=null,transferred=false){return {id:uid('die'),kind,value:Number(value),direction,remaining:remaining??(kind==='double'?4:kind==='triple'?12:kind==='quad'?24:1),transferred:!!transferred}}
const singleToken=v=>token('single',v,'auto',1,false);
const setToken=(kind,v,dir)=>token(kind,v,dir);

function counts(pool){const m=new Map;for(const v of pool)m.set(v,(m.get(v)||0)+1);return [...m.entries()].sort((a,b)=>a[0]-b[0])}
function uniquePlans(plans){const seen=new Set;return plans.filter(p=>{const k=p.label;if(seen.has(k))return false;seen.add(k);return true})}
function plan(label,ids,a,b){return {label,assignments:{[ids[0]]:a,[ids[1]]:b}}}
function playerLabel(room,id){return P(room,id)?.name||'Player'}

export function blackAllocationPlans(room,{big=false}={}){
 const ex=room.game.extra,ids=order(room),c=ex.controllerId,o=opponent(room,c),pool=[...ex.pool],cs=counts(pool),plans=[];
 const C=playerLabel(room,c),O=playerLabel(room,o);
 const byId=(own,other,label)=>plan(label,[c,o],own,other);
 if(big){
  if(cs.length===1){const [v,n]=cs[0];if(n===4)return[byId([setToken('quad',v,'forward')],[],`${C}: quadruple ${v}s · 24 forward moves`)];}
  const triple=cs.find(([,n])=>n===3);if(triple){const [v]=triple,u=cs.find(([,n])=>n===1)?.[0];for(const d of ['forward','backward'])plans.push(byId([setToken('triple',v,d),singleToken(u)],[],`${C}: triple ${v}s ${d} + ${u}`));return plans}
  const doubles=cs.filter(([,n])=>n===2);if(doubles.length===2){for(const da of ['forward','backward'])for(const db of ['forward','backward'])plans.push(byId([setToken('double',doubles[0][0],da),setToken('double',doubles[1][0],db)],[],`${C}: ${doubles[0][0]}s ${da} + ${doubles[1][0]}s ${db}`));return plans}
  if(doubles.length===1){const d=doubles[0][0],ss=cs.filter(([,n])=>n===1).map(([v])=>v);for(const dir of ['forward','backward'])plans.push(byId([setToken('double',d,dir),...ss.map(singleToken)],[],`${C}: double ${d}s ${dir} + ${ss.join(' + ')}`));return plans}
  return[byId(pool.map(singleToken),[],`${C}: play all four dice`)]
 }
 const triple=cs.find(([,n])=>n===3);
 if(triple){const [v]=triple,u=cs.find(([,n])=>n===1)?.[0];for(const recipient of [c,o])for(const dir of ['forward','backward']){const cTokens=[singleToken(u)],oTokens=[singleToken(u)];(recipient===c?cTokens:oTokens).unshift(setToken('triple',v,dir));plans.push(byId(cTokens,oTokens,`${playerLabel(room,recipient)} gets triple ${v}s ${dir}; both play ${u}`))}return plans}
 const doubles=cs.filter(([,n])=>n===2);
 if(doubles.length===2){for(const keep of [0,1])for(const ownDir of ['forward','backward'])for(const otherDir of ['forward','backward']){const a=doubles[keep][0],b=doubles[1-keep][0];plans.push(byId([setToken('double',a,ownDir)],[setToken('double',b,otherDir)],`${C}: ${a}s ${ownDir} · ${O}: ${b}s ${otherDir}`))}return plans}
 if(doubles.length===1){
  const d=doubles[0][0],ss=cs.filter(([,n])=>n===1).map(([v])=>v);
  for(let i=0;i<ss.length;i++)for(const dir of ['forward','backward'])plans.push(byId([setToken('double',d,dir),singleToken(ss[i])],[singleToken(ss[1-i])],`${C}: double ${d}s ${dir} + ${ss[i]} · ${O}: ${ss[1-i]}`));
  for(const dir of ['forward','backward'])plans.push(byId(ss.map(singleToken),[setToken('double',d,dir)],`${C}: ${ss.join(' + ')} · ${O}: double ${d}s ${dir}`));
  // Split the natural pair so both matching values behave as ordinary singles.
  for(let i=0;i<ss.length;i++)plans.push(byId([singleToken(d),singleToken(ss[i])],[singleToken(d),singleToken(ss[1-i])],`${C}: ${d} + ${ss[i]} · ${O}: ${d} + ${ss[1-i]}`));
  return uniquePlans(plans)
 }
 // Four distinct singles: controller chooses any two.
 for(let i=0;i<pool.length;i++)for(let j=i+1;j<pool.length;j++){const own=[pool[i],pool[j]],rest=pool.filter((_,k)=>k!==i&&k!==j);plans.push(byId(own.map(singleToken),rest.map(singleToken),`${C}: ${own.join(' + ')} · ${O}: ${rest.join(' + ')}`))}
 return uniquePlans(plans)
}

function setControllerFromRolls(room){const ex=room.game.extra,ids=order(room),a=sum(ex.rolls[ids[0]]),b=sum(ex.rolls[ids[1]]);ex.pool=[...ex.rolls[ids[0]],...ex.rolls[ids[1]]];if(a===b){ex.phase='bigRoll';ex.bigRolls={[ids[0]]:null,[ids[1]]:null};ex.message=`Both totals are ${a}. Roll the large tiebreak die.`;return}ex.controllerId=a>b?ids[0]:ids[1];ex.phase='allocate';ex.message=`${P(room,ex.controllerId).name} controls the four dice (${Math.max(a,b)} to ${Math.min(a,b)}). Choose the split.`}
function setControllerFromBig(room){const ex=room.game.extra,ids=order(room),a=ex.bigRolls[ids[0]],b=ex.bigRolls[ids[1]];if(a===b){ex.bigTieCount++;ex.bigRolls={[ids[0]]:null,[ids[1]]:null};ex.bigDieSide=ex.bigDieSide==='right'?'left':'right';ex.message=`Large die tied at ${a}. Roll it again.`;return}ex.controllerId=a>b?ids[0]:ids[1];ex.phase='allocateBig';ex.message=`${P(room,ex.controllerId).name} wins the large die ${Math.max(a,b)} to ${Math.min(a,b)} and must play all four normal dice.`}

function dueForOther(ex,id){return ex.lastMovedRound[id]>=ex.round?ex.round+1:ex.round}
function clearRisk(ex,id,point){ex.riskDue[id][point]=null}
function setRisk(ex,id,point,due){ex.riskDue[id][point]=Math.min(ex.riskDue[id][point]??Infinity,due)}
function updatePointStatus(ex,room,point,actorId=null,actorSelfWeaken=false){const [a,b]=order(room),ca=ex.points[a][point],cb=ex.points[b][point];if(!ca&&!cb){ex.top[point]=null;clearRisk(ex,a,point);clearRisk(ex,b,point);return}if(!ca){ex.top[point]=b;clearRisk(ex,a,point);clearRisk(ex,b,point);return}if(!cb){ex.top[point]=a;clearRisk(ex,a,point);clearRisk(ex,b,point);return}if(ca===cb){clearRisk(ex,a,point);clearRisk(ex,b,point);if(actorId)ex.top[point]=actorId;return}const strong=ca>cb?a:b,weak=ca>cb?b:a;ex.top[point]=strong;clearRisk(ex,strong,point);if(actorSelfWeaken&&weak===actorId)setRisk(ex,weak,point,ex.round);else setRisk(ex,weak,point,dueForOther(ex,weak))}
function markOverstack(ex,id,point){if(ex.points[id][point]>4&&ex.overDue[id][point]==null)ex.overDue[id][point]=ex.round+1;if(ex.points[id][point]<=4)ex.overDue[id][point]=null}

function barEntryLegal(ex,room,id,to){const opp=opponent(room,id),own=ex.points[id][to],other=ex.points[opp][to];if(own>=4)return {ok:false,reason:'Point already has 4 of your checkers.'};if(own===0){if(other>=2)return {ok:false,reason:'Two or more opposing checkers block bar entry.'};return {ok:true,hit:other===1}}if(own+1<other)return {ok:false,reason:`Need at least ${other-own} more checker${other-own===1?'':'s'} to enter this mixed point.`};return {ok:true,hit:false}}
function boardLandingLegal(ex,room,id,to,count){const opp=opponent(room,id),own=ex.points[id][to],other=ex.points[opp][to],after=own+count;if(other===0&&after>4)return {ok:false,reason:'A point may hold at most 4 of your checkers unless you are covering an opponent.'};if(other>=2&&after<other)return {ok:false,reason:`Need ${other} of your checkers here to equal or cover the opposing stack.`};return {ok:true,hit:other===1}}
function moveWouldBear(ex,room,id,from,die){if(!canBear(ex,room,id))return false;const dir=forwardDir(room,id),exact=dir<0?die===from+1:die===24-from;return exact||oversizeBearAllowed(ex,room,id,from,die)}

export function blackLegalMoves(room,id){
 const ex=room.game.extra;if(ex.phase!=='moving'||ex.turnPlayerId!==id)return[];const tokens=ex.assignments[id]||[],moves=[],opp=opponent(room,id);
 for(const tk of tokens){if(tk.remaining<=0)continue;const value=Number(tk.value),direction=effectiveDirection(ex,room,id,tk),setLike=tk.kind!=='single';
  if(ex.bar[id]>0){if(tk.kind==='single'&&value===4)continue;const to=entryPoint(room,id,value),leg=barEntryLegal(ex,room,id,to);if(leg.ok)moves.push({tokenId:tk.id,from:'bar',to,count:1,value,direction:'forward',entry:true,hit:!!leg.hit,rescue:false,label:`Bar → ${to+1} · ${value}`});continue}
  for(let from=0;from<24;from++){const available=ex.points[id][from];if(available<=0)continue;const maxCount=setLike?Math.min(available,tk.remaining):1;for(let count=1;count<=maxCount;count++){
    const dir=direction==='backward'?-forwardDir(room,id):forwardDir(room,id),to=from+dir*value,rescue=ex.riskDue[id][from]!=null;
    if(to<0||to>=24){if(direction==='forward'&&moveWouldBear(ex,room,id,from,value))moves.push({tokenId:tk.id,from,to:'off',count,value,direction,entry:false,hit:false,rescue,label:`${from+1} → OFF · ${count}×${value}`});continue}
    const leg=boardLandingLegal(ex,room,id,to,count);if(!leg.ok)continue;const rescueDest=ex.riskDue[id][to]!=null&&(ex.points[id][to]+count>=ex.points[opp][to]);moves.push({tokenId:tk.id,from,to,count,value,direction,entry:false,hit:!!leg.hit,rescue:rescue||rescueDest,label:`${from+1} → ${to+1} · ${count}×${value} ${direction}`});
   }
  }
 }
 // De-duplicate equivalent moves that can come from identical single tokens.
 const seen=new Set;return moves.filter(m=>{const k=`${m.from}:${m.to}:${m.count}:${m.value}:${m.direction}:${m.entry}`;if(seen.has(k))return false;seen.add(k);return true})
}

function findToken(ex,id,tokenId){return (ex.assignments[id]||[]).find(t=>t.id===tokenId)}
function consume(ex,id,tokenId,count){const tk=findToken(ex,id,tokenId);if(!tk||tk.remaining<count)throw new Error('That die movement is no longer available');tk.remaining-=count;ex.assignments[id]=ex.assignments[id].filter(t=>t.remaining>0)}
function applyMove(room,id,m){const ex=room.game.extra,opp=opponent(room,id),beforeTopFrom=m.from==='bar'?null:ex.top[m.from];consume(ex,id,m.tokenId,m.count);
 if(m.from==='bar')ex.bar[id]-=m.count;else ex.points[id][m.from]-=m.count;
 if(m.to==='off'){ex.off[id]+=m.count;if(m.from!=='bar')updatePointStatus(ex,room,m.from,id,true);return}
 if(m.hit&&ex.points[opp][m.to]===1){ex.points[opp][m.to]=0;ex.bar[opp]++;clearRisk(ex,opp,m.to)}
 ex.points[id][m.to]+=m.count;
 if(m.from!=='bar')updatePointStatus(ex,room,m.from,id,true);
 if(ex.points[opp][m.to]>=2)updatePointStatus(ex,room,m.to,id,false);else{ex.top[m.to]=id;clearRisk(ex,id,m.to);clearRisk(ex,opp,m.to)}
 markOverstack(ex,id,m.to);
 ex.lastMove={playerId:id,from:m.from,to:m.to,count:m.count,value:m.value,direction:m.direction,hit:m.hit,rescue:m.rescue,round:ex.round};
}
function resolveEndOfOpportunity(room,id){const ex=room.game.extra,opp=opponent(room,id),events=[];
 for(let point=0;point<24;point++)if(ex.riskDue[id][point]!=null&&ex.riskDue[id][point]<=ex.round){const mine=ex.points[id][point],theirs=ex.points[opp][point];if(mine>0&&theirs>mine){ex.points[id][point]=0;ex.bar[id]+=mine;events.push(`${mine} trapped checker${mine===1?'':'s'} went to the bar`)}clearRisk(ex,id,point);updatePointStatus(ex,room,point)}
 for(let point=0;point<24;point++)if(ex.overDue[id][point]!=null&&ex.overDue[id][point]<=ex.round){const extra=Math.max(0,ex.points[id][point]-4);if(extra>0){ex.points[id][point]-=extra;ex.bar[id]+=extra;events.push(`${extra} extra checker${extra===1?'':'s'} from an overstack went to the bar`)}ex.overDue[id][point]=null;updatePointStatus(ex,room,point)}
 ex.lastMovedRound[id]=ex.round;return events
}
function transferSingles(room,fromId){const ex=room.game.extra,toId=opponent(room,fromId),remaining=ex.assignments[fromId]||[],transfers=[];for(const tk of remaining){if(tk.kind==='single'&&!tk.transferred&&tk.remaining>0){transfers.push(token('single',tk.value,'auto',1,true))}}
 ex.assignments[fromId]=[];if(transfers.length)ex.assignments[toId].push(...transfers);return {toId,transfers}
}
function nextMover(room){const ex=room.game.extra;ex.moveIndex++;while(ex.moveIndex<ex.moveQueue.length){const id=ex.moveQueue[ex.moveIndex];if((ex.assignments[id]||[]).some(t=>t.remaining>0)){ex.turnPlayerId=id;ex.phase='moving';ex.message=`${P(room,id).name} plays their assigned dice.`;return}ex.moveIndex++}return nextRoll(room)}
function nextRoll(room){const ex=room.game.extra,ids=order(room),deadlineEvents=[];for(const id of ids){const dueRisk=(ex.riskDue[id]||[]).some(x=>x!=null&&x<=ex.round),dueOver=(ex.overDue[id]||[]).some(x=>x!=null&&x<=ex.round);if(dueRisk||dueOver)deadlineEvents.push(...resolveEndOfOpportunity(room,id))}ex.round++;ex.phase='rolling';ex.rolls=Object.fromEntries(ids.map(id=>[id,null]));ex.bigRolls=Object.fromEntries(ids.map(id=>[id,null]));ex.controllerId=null;ex.pool=[];ex.assignments=Object.fromEntries(ids.map(id=>[id,[]]));ex.moveQueue=[];ex.moveIndex=-1;ex.turnPlayerId=null;ex.bigDieSide=ex.bigDieSide==='right'?'left':'right';ex.message=deadlineEvents.length?`${deadlineEvents.join(' · ')} · New roll: both players roll two dice.`:'New roll: both players roll two dice.'}
function finishMover(room,id){const ex=room.game.extra,events=resolveEndOfOpportunity(room,id),{toId,transfers}=transferSingles(room,id);if(transfers.length&&!ex.moveQueue.slice(ex.moveIndex+1).includes(toId))ex.moveQueue.push(toId);if(events.length)ex.message=events.join(' · ');return nextMover(room)}
function beginMovement(room,assignments){const ex=room.game.extra,ids=order(room),c=ex.controllerId,o=opponent(room,c);ex.assignments=Object.fromEntries(ids.map(id=>[id,(assignments[id]||[]).map(t=>({...t}))]));ex.moveQueue=[c];if((ex.assignments[o]||[]).length)ex.moveQueue.push(o);ex.moveIndex=-1;ex.phase='moving';nextMover(room)}

function allocationActions(room){const ex=room.game.extra,plans=blackAllocationPlans(room,{big:ex.phase==='allocateBig'});return plans.map((p,i)=>({action:'blackAllocate',label:p.label,args:{planIndex:i}}))}
function illegalHint(room,id){const ex=room.game.extra;if(ex.bar[id]>0){const singles=(ex.assignments[id]||[]).filter(t=>t.kind==='single');if(singles.length&&singles.every(t=>t.value===4))return'Single 4 cannot enter from the bar.';return'Clear the bar before moving another checker.'}if(!(ex.assignments[id]||[]).length)return'No dice remain.';return'No legal destination exists for the remaining dice.'}

export function publicBlackGammon(room,viewer){const ex=room.game.extra,actions=[];if(viewer){const id=viewer.id;if(ex.phase==='rolling'&&!ex.rolls[id])actions.push({action:'blackRoll',label:'Roll my two dice'});if(ex.phase==='bigRoll'&&!ex.bigRolls[id])actions.push({action:'blackBigRoll',label:'Roll the large tiebreak die'});if(['allocate','allocateBig'].includes(ex.phase)&&ex.controllerId===id)actions.push(...allocationActions(room));if(ex.phase==='moving'&&ex.turnPlayerId===id){const moves=blackLegalMoves(room,id);for(const m of moves)actions.push({action:'blackMove',label:m.label,args:m});if(!moves.length)actions.push({action:'blackNoMove',label:`No legal move · ${illegalHint(room,id)}`})}}
 return {type:ex.type,phase:ex.phase,round:ex.round,turnPlayerId:ex.turnPlayerId,controllerId:ex.controllerId,points:clonePoints(ex.points),bar:{...ex.bar},off:{...ex.off},top:[...ex.top],riskDue:Object.fromEntries(Object.entries(ex.riskDue).map(([id,a])=>[id,[...a]])),overDue:Object.fromEntries(Object.entries(ex.overDue).map(([id,a])=>[id,[...a]])),rolls:Object.fromEntries(Object.entries(ex.rolls).map(([id,a])=>[id,a?[...a]:null])),bigRolls:{...ex.bigRolls},bigDieSide:ex.bigDieSide,pool:[...ex.pool],assignments:Object.fromEntries(Object.entries(ex.assignments).map(([id,a])=>[id,a.map(t=>({...t}))])),message:ex.message,lastMove:ex.lastMove,winnerId:ex.winnerId,illegalHint:viewer&&ex.turnPlayerId===viewer.id?illegalHint(room,viewer.id):null,actions}
}

export function actionBlackGammon(room,p,{action,args={}}){const ex=room.game.extra,ids=order(room);if(action==='blackRoll'){if(ex.phase!=='rolling')throw new Error('Normal dice are not being rolled now');if(ex.rolls[p.id])throw new Error('You already rolled');ex.rolls[p.id]=[rollDie(),rollDie()];ex.message=`${p.name} rolled ${ex.rolls[p.id].join(' + ')}.${ids.every(id=>ex.rolls[id])?' Comparing totals…':' Waiting for the other roll.'}`;if(ids.every(id=>ex.rolls[id]))setControllerFromRolls(room);return}
 if(action==='blackBigRoll'){if(ex.phase!=='bigRoll')throw new Error('Large die is not active');if(ex.bigRolls[p.id]!=null)throw new Error('You already rolled the large die');ex.bigRolls[p.id]=rollBigDie();ex.bigDieSide=ex.bigDieSide==='right'?'left':'right';ex.message=`${p.name} rolled ${ex.bigRolls[p.id]} on the large die.`;if(ids.every(id=>ex.bigRolls[id]!=null))setControllerFromBig(room);return}
 if(action==='blackAllocate'){if(!['allocate','allocateBig'].includes(ex.phase)||ex.controllerId!==p.id)throw new Error('You do not control this allocation');const plans=blackAllocationPlans(room,{big:ex.phase==='allocateBig'}),pl=plans[Number(args.planIndex)];if(!pl)throw new Error('Choose a valid dice split');beginMovement(room,pl.assignments);return}
 if(action==='blackMove'){if(ex.phase!=='moving'||ex.turnPlayerId!==p.id)throw new Error('Not your movement opportunity');const legal=blackLegalMoves(room,p.id).find(m=>m.tokenId===args.tokenId&&String(m.from)===String(args.from)&&String(m.to)===String(args.to)&&Number(m.count)===Number(args.count)&&Number(m.value)===Number(args.value));if(!legal)throw new Error(illegalHint(room,p.id));applyMove(room,p.id,legal);if(ex.off[p.id]>=15)return finish(room,p.id);if(!(ex.assignments[p.id]||[]).length||!blackLegalMoves(room,p.id).length)finishMover(room,p.id);else ex.message=`${P(room,p.id).name}: keep moving. Matching sets must use as many legal moves as possible.`;return}
 if(action==='blackNoMove'){if(ex.phase!=='moving'||ex.turnPlayerId!==p.id)throw new Error('Not your movement opportunity');if(blackLegalMoves(room,p.id).length)throw new Error('A legal move remains and must be played');return finishMover(room,p.id)}
 throw new Error('Invalid Black Gammon action')
}

export const BLACK_GAMMON_BIG_DIE_VALUES=[...BIG_DIE_VALUES];
