import crypto from 'node:crypto';
import { GAME_TYPES, shuffle } from './gameEngine.mjs';

const uid=(p='x')=>`${p}-${crypto.randomUUID().slice(0,10)}`;
const rollDie=()=>crypto.randomInt(1,7);
const order=room=>[...room.players.values()].filter(p=>p.seat!=null).sort((a,b)=>a.seat-b.seat).map(p=>p.id);
const P=(room,id)=>room.players.get(id);
const next=(room,id)=>{const a=order(room),i=a.indexOf(id);return a[(i+1)%a.length]};
const setExtra=(room,ex)=>{room.game.extra=ex;room.game.phase='extra';room.game.winnerIds=[];room.game.history=ex.history||[]};
const finish=(room,winnerIds,reason='')=>{const ex=room.game.extra;ex.phase='gameOver';ex.reason=reason;room.game.phase='gameOver';room.game.winnerIds=[...winnerIds];room.game.history=ex.history||[]};
const resetPlayers=room=>{for(const p of room.players.values()){p.hand=[];p.score=0;p.bid=null;p.tricks=0;p.continued=false;p.eliminated=false}};
const removeById=(arr,id)=>{const i=arr.findIndex(x=>x.id===id);return i<0?null:arr.splice(i,1)[0]};

export const THREE_NEW_TYPES=new Set([GAME_TYPES.MEXICAN_TRAIN,GAME_TYPES.SKIP_BO,GAME_TYPES.BACKGAMMON]);
export const THREE_NEW_META={
 [GAME_TYPES.MEXICAN_TRAIN]:{name:'Mexican Train',icon:'🚂',sub:'Double-12 dominoes, family-avatar train markers and three-round low score',min:2,max:8},
 [GAME_TYPES.SKIP_BO]:{name:'Skip-Bo',icon:'🗂️',sub:'Clear your Stock Pile through four shared Building Piles',min:2,max:6},
 [GAME_TYPES.BACKGAMMON]:{name:'Backgammon',icon:'🎲',sub:'Dimensional board, legal-move guidance, bar, bearing off and doubling cube',min:2,max:2}
};
export const isThreeNewGame=t=>THREE_NEW_TYPES.has(t);
export function threeNewDefaults(t){
 if(t===GAME_TYPES.MEXICAN_TRAIN)return {roundCount:3};
 if(t===GAME_TYPES.SKIP_BO)return {stockSize:20};
 if(t===GAME_TYPES.BACKGAMMON)return {automaticDoubles:false,beavers:false,jacoby:false,beginnerHelp:true};
 return {};
}
export function applyThreeNewSettings(room,b){
 const t=room.gameType,s=room.settings;
 if(t===GAME_TYPES.SKIP_BO&&[10,20,30].includes(Number(b.stockSize)))s.stockSize=Number(b.stockSize);
 if(t===GAME_TYPES.BACKGAMMON){s.automaticDoubles=!!b.automaticDoubles;s.beavers=!!b.beavers;s.jacoby=!!b.jacoby;s.beginnerHelp=b.beginnerHelp!==false&&b.beginnerHelp!=='false'}
}

// ---------------------------------------------------------------------------
// Mexican Train
// ---------------------------------------------------------------------------
export function createDouble12Set(){const out=[];for(let a=0;a<=12;a++)for(let b=a;b<=12;b++)out.push({id:uid('dom'),a,b});return out}
const dominoPips=d=>Number(d?.a||0)+Number(d?.b||0);
const dominoHas=(d,n)=>!!d&&(Number(d.a)===Number(n)||Number(d.b)===Number(n));
const otherEnd=(d,n)=>Number(d.a)===Number(n)?Number(d.b):Number(d.a);
const orientDomino=(d,match)=>({id:d.id,a:Number(match),b:otherEnd(d,match),double:Number(d.a)===Number(d.b)});
const mtHandSize=n=>n<=4?15:n<=6?12:11;
function mtChooseFirst(ids,deck){let contenders=[...ids];while(contenders.length>1){const draws=contenders.map(id=>({id,tile:deck.pop()||{a:0,b:0}})),high=Math.max(...draws.map(x=>dominoPips(x.tile)));contenders=draws.filter(x=>dominoPips(x.tile)===high).map(x=>x.id)}return contenders[0]}
function mtRound(room,round=1,carryScores=true){
 const ids=order(room),deck=shuffle(createDouble12Set()),firstPlayerId=mtChooseFirst(ids,deck),fresh=shuffle(createDouble12Set()),count=mtHandSize(ids.length);
 for(const id of ids){P(room,id).hand=[];for(let i=0;i<count;i++)P(room,id).hand.push(fresh.pop());if(!carryScores)P(room,id).score=0;P(room,id).continued=false}
 const trains=Object.fromEntries(ids.map(id=>[id,{ownerId:id,tiles:[],openEnd:null,open:false}]));
 const ex={type:GAME_TYPES.MEXICAN_TRAIN,phase:'engine',round,roundCount:3,firstPlayerId,turnPlayerId:firstPlayerId,boneyard:fresh,engine:null,trains,mexican:{tiles:[],openEnd:null,started:false},unresolvedDouble:null,drawnThisTurn:false,openingOrder:[],openingIndex:0,oneTile:{},scores:Object.fromEntries(ids.map(id=>[id,[]])),continued:[],message:`${P(room,firstPlayerId).name} searches for the opening double.`,history:room.game.extra?.history||[]};
 if(carryScores&&room.game.extra?.scores)ex.scores=structuredClone(room.game.extra.scores);
 setExtra(room,ex)
}
function mtStart(room){resetPlayers(room);mtRound(room,1,false)}
function mtAdvanceEngine(room){const ex=room.game.extra;ex.drawnThisTurn=false;ex.turnPlayerId=next(room,ex.turnPlayerId);ex.message=`${P(room,ex.turnPlayerId).name} searches for a double.`}
function mtPlayableTrains(room,p,tile){const ex=room.game.extra,res=[];if(ex.phase==='opening'){
 const tr=ex.trains[p.id];if(dominoHas(tile,ex.engine))res.push({trainId:p.id,match:ex.engine});return res;
 }
 const targetIds=[];
 if(ex.unresolvedDouble)targetIds.push(ex.unresolvedDouble.trainId);else{
  targetIds.push(p.id,'mexican');for(const id of order(room))if(id!==p.id&&ex.trains[id].open)targetIds.push(id)
 }
 for(const trainId of [...new Set(targetIds)]){const tr=trainId==='mexican'?ex.mexican:ex.trains[trainId];const open=tr.openEnd??ex.engine;if(dominoHas(tile,open))res.push({trainId,match:open})}
 return res
}
function mtAnyLegal(room,p){return p.hand.some(t=>mtPlayableTrains(room,p,t).length)}
function mtAdvanceOpening(room){const ex=room.game.extra;ex.drawnThisTurn=false;ex.openingIndex++;if(ex.openingIndex>=ex.openingOrder.length){ex.phase='playing';ex.turnPlayerId=ex.firstPlayerId;ex.message='All trains are ready. Normal play begins.'}else{ex.turnPlayerId=ex.openingOrder[ex.openingIndex];ex.message=`${P(room,ex.turnPlayerId).name} starts their private train.`}}
function mtAdvanceTurn(room){const ex=room.game.extra;ex.drawnThisTurn=false;ex.turnPlayerId=next(room,ex.turnPlayerId);ex.message=`${P(room,ex.turnPlayerId).name}'s turn.`}
function mtRoundEnd(room,winnerId){const ex=room.game.extra,ids=order(room),roundScores={};for(const id of ids){const score=P(room,id).hand.reduce((n,d)=>n+dominoPips(d),0);roundScores[id]=score;P(room,id).score+=score;(ex.scores[id]??=[]).push(score)}ex.history.push({round:ex.round,winnerId,scores:roundScores,totals:Object.fromEntries(ids.map(id=>[id,P(room,id).score]))});if(ex.round>=ex.roundCount){const low=Math.min(...ids.map(id=>P(room,id).score));finish(room,ids.filter(id=>P(room,id).score===low),'Lowest score after three rounds.');return}ex.phase='roundResults';ex.roundWinnerId=winnerId;ex.roundScores=roundScores;ex.continued=[];ex.message=`${P(room,winnerId).name} emptied their domino rack.`}
function mtSetEngine(room,p,tileId){const ex=room.game.extra;if(ex.phase!=='engine'||ex.turnPlayerId!==p.id)throw new Error('Not your engine turn');const doubles=p.hand.filter(d=>d.a===d.b).sort((a,b)=>b.a-a.a),top=doubles[0];if(!top||top.id!==tileId)throw new Error('Play your highest double');removeById(p.hand,tileId);ex.engine=top.a;for(const tr of Object.values(ex.trains))tr.openEnd=top.a;ex.mexican.openEnd=top.a;ex.engineTile=top;ex.phase='opening';ex.openingOrder=[];let id=next(room,p.id);for(let i=0;i<order(room).length;i++){ex.openingOrder.push(id);id=next(room,id)}ex.openingIndex=0;ex.turnPlayerId=ex.openingOrder[0];ex.drawnThisTurn=false;ex.message=`Engine ${top.a}-${top.b}. ${P(room,ex.turnPlayerId).name} starts their train.`}
function mtDraw(room,p){const ex=room.game.extra;if(ex.turnPlayerId!==p.id)throw new Error('Not your turn');if(ex.drawnThisTurn)throw new Error('You already drew');const t=ex.boneyard.pop();if(t)p.hand.push(t);ex.drawnThisTurn=true;ex.message=t?`${p.name} drew one domino.`:'The boneyard is empty.'}
function mtPass(room,p){const ex=room.game.extra;if(ex.turnPlayerId!==p.id)throw new Error('Not your turn');if(ex.phase==='engine'){if(p.hand.some(d=>d.a===d.b))throw new Error('You have a double');if(!ex.drawnThisTurn&&ex.boneyard.length)throw new Error('Draw once before passing');return mtAdvanceEngine(room)}if(mtAnyLegal(room,p))throw new Error('You have a legal domino');ex.trains[p.id].open=true;if(ex.phase==='opening')mtAdvanceOpening(room);else mtAdvanceTurn(room)}
function mtPlay(room,p,args){const ex=room.game.extra;if(ex.turnPlayerId!==p.id)throw new Error('Not your turn');const tile=p.hand.find(x=>x.id===args.tileId);if(!tile)throw new Error('Domino not in rack');const legal=mtPlayableTrains(room,p,tile).find(x=>x.trainId===args.trainId);if(!legal)throw new Error('That domino does not fit there');removeById(p.hand,tile.id);const tr=args.trainId==='mexican'?ex.mexican:ex.trains[args.trainId],placed=orientDomino(tile,legal.match);tr.tiles.push({...placed,playerId:p.id});tr.openEnd=placed.b;if(args.trainId==='mexican')tr.started=true;if(args.trainId===p.id)ex.trains[p.id].open=false;
 if(ex.unresolvedDouble&&ex.unresolvedDouble.trainId===args.trainId&&!placed.double)ex.unresolvedDouble=null;
 if(placed.double)ex.unresolvedDouble={trainId:args.trainId,value:placed.b,playerId:p.id};
 ex.drawnThisTurn=false;ex.message=`${p.name} played ${tile.a}-${tile.b}.`;
 if(!p.hand.length)return mtRoundEnd(room,p.id);
 if(p.hand.length===1){ex.oneTile[p.id]=true;ex.message+=` ${p.name} has ONE TILE left!`}
 if(ex.phase==='opening')return mtAdvanceOpening(room);
 if(placed.double){ex.turnPlayerId=p.id;ex.message=`Double ${placed.a}-${placed.b} must be closed.`;return}
 mtAdvanceTurn(room)
}
function mtPublic(room,viewer){const ex=room.game.extra,actions=[];if(viewer&&ex.turnPlayerId===viewer.id){if(ex.phase==='engine'){
 const doubles=[...viewer.hand].filter(d=>d.a===d.b).sort((a,b)=>b.a-a.a);if(doubles.length)actions.push({action:'mtSetEngine',label:`Set engine ${doubles[0].a}-${doubles[0].b}`,args:{tileId:doubles[0].id}});else if(!ex.drawnThisTurn&&ex.boneyard.length)actions.push({action:'mtDraw',label:'Draw for a double'});else actions.push({action:'mtPass',label:'No double · pass'});
 }else if(['opening','playing'].includes(ex.phase)){
  for(const t of viewer.hand)for(const pl of mtPlayableTrains(room,viewer,t)){const owner=pl.trainId==='mexican'?'Mexican Train':pl.trainId===viewer.id?'your train':`${P(room,pl.trainId).name}'s open train`;actions.push({action:'mtPlay',label:`${t.a}-${t.b} → ${owner}`,args:{tileId:t.id,trainId:pl.trainId}})}
  if(!mtAnyLegal(room,viewer)){if(!ex.drawnThisTurn&&ex.boneyard.length)actions.push({action:'mtDraw',label:'Draw one domino'});else actions.push({action:'mtPass',label:'Open your train and pass'})}
 }else if(ex.phase==='roundResults'&&!ex.continued.includes(viewer.id))actions.push({action:'mtContinue',label:'Ready for next round'});
 }
 return {type:ex.type,phase:ex.phase,round:ex.round,roundCount:ex.roundCount,turnPlayerId:ex.turnPlayerId,firstPlayerId:ex.firstPlayerId,engine:ex.engine,engineTile:ex.engineTile||null,boneyardCount:ex.boneyard.length,trains:ex.trains,mexican:ex.mexican,unresolvedDouble:ex.unresolvedDouble,hand:viewer?[...viewer.hand]:[],handCounts:Object.fromEntries(order(room).map(id=>[id,P(room,id).hand.length])),scores:ex.scores,roundScores:ex.roundScores||null,roundWinnerId:ex.roundWinnerId||null,oneTile:ex.oneTile||{},totals:Object.fromEntries(order(room).map(id=>[id,P(room,id).score])),message:ex.message,actions}
}
function mtAction(room,p,{action,args={}}){const ex=room.game.extra;if(action==='mtSetEngine')return mtSetEngine(room,p,args.tileId);if(action==='mtDraw')return mtDraw(room,p);if(action==='mtPass')return mtPass(room,p);if(action==='mtPlay')return mtPlay(room,p,args);if(action==='mtContinue'){if(ex.phase!=='roundResults')throw new Error('Round is not complete');if(!ex.continued.includes(p.id))ex.continued.push(p.id);if(ex.continued.length===order(room).length)mtRound(room,ex.round+1,true);return}throw new Error('Invalid Mexican Train action')}

// ---------------------------------------------------------------------------
// Skip-Bo
// ---------------------------------------------------------------------------
export function createSkipBoDeck(){const out=[];for(let n=1;n<=12;n++)for(let i=0;i<12;i++)out.push({id:uid('sb'),rank:n,wild:false});for(let i=0;i<18;i++)out.push({id:uid('sbw'),rank:'WILD',wild:true});return out}
const sbNeed=pile=>pile.length?Number(pile.at(-1).value)+1:1;
function sbRefillDraw(ex){if(ex.drawPile.length)return;if(ex.recycle.length){ex.drawPile=shuffle(ex.recycle.map(c=>({id:c.id,rank:c.rank,wild:!!c.wild})));ex.recycle=[]}}
function sbDrawCards(ex,n){const out=[];for(let i=0;i<n;i++){sbRefillDraw(ex);const c=ex.drawPile.pop();if(!c)break;out.push(c)}return out}
function sbFillHand(ex,p){const need=Math.max(0,5-p.hand.length);p.hand.push(...sbDrawCards(ex,need));return need}
function sbStart(room){resetPlayers(room);const ids=order(room),deck=shuffle(createSkipBoDeck()),stockSize=Number(room.settings.stockSize)||20,stocks={},discards={};if(stockSize===30&&ids.length>4)throw new Error('30-card Stock Piles support 2-4 players; choose 20 cards for 5-6 players');for(const id of ids){stocks[id]=[];discards[id]=[[],[],[],[]];for(let i=0;i<stockSize;i++)stocks[id].push(deck.pop())}const ex={type:GAME_TYPES.SKIP_BO,phase:'draw',turnPlayerId:ids[0],drawPile:deck,recycle:[],builds:[[],[],[],[]],stocks,discards,stockSize,message:`${P(room,ids[0]).name} draws to five.`,history:[]};setExtra(room,ex)}
function sbSourceCard(room,p,src){const ex=room.game.extra;if(src.kind==='hand')return p.hand.find(c=>c.id===src.cardId)||null;if(src.kind==='stock')return ex.stocks[p.id].at(-1)||null;if(src.kind==='discard')return ex.discards[p.id][Number(src.index)]?.at(-1)||null;return null}
function sbRemoveSource(room,p,src){const ex=room.game.extra;if(src.kind==='hand')return removeById(p.hand,src.cardId);if(src.kind==='stock')return ex.stocks[p.id].pop();if(src.kind==='discard')return ex.discards[p.id][Number(src.index)].pop();return null}
function sbLegalTargets(ex,c){const out=[];for(let i=0;i<4;i++){const need=sbNeed(ex.builds[i]);if(need<=12&&(c.wild||Number(c.rank)===need))out.push(i)}return out}
function sbAnyPlay(room,p){const ex=room.game.extra,sources=[...p.hand.map(c=>({kind:'hand',cardId:c.id})),{kind:'stock'},...ex.discards[p.id].map((_,i)=>({kind:'discard',index:i}))];return sources.some(src=>{const c=sbSourceCard(room,p,src);return c&&sbLegalTargets(ex,c).length})}
function sbAdvance(room,p){const ex=room.game.extra;ex.turnPlayerId=next(room,p.id);ex.phase='draw';ex.message=`${P(room,ex.turnPlayerId).name} draws to five.`}
function sbPublic(room,viewer){const ex=room.game.extra,actions=[];if(viewer&&ex.turnPlayerId===viewer.id){if(ex.phase==='draw')actions.push({action:'sbDraw',label:`Draw to 5 (${Math.max(0,5-viewer.hand.length)} card${Math.max(0,5-viewer.hand.length)===1?'':'s'})`});if(ex.phase==='play'){
 const sources=[...viewer.hand.map(c=>({kind:'hand',cardId:c.id})),{kind:'stock'},...ex.discards[viewer.id].map((_,i)=>({kind:'discard',index:i}))];for(const src of sources){const c=sbSourceCard(room,viewer,src);if(!c)continue;for(const pile of sbLegalTargets(ex,c)){const srcName=src.kind==='hand'?'Hand':src.kind==='stock'?'STOCK':`Discard ${Number(src.index)+1}`;actions.push({action:'sbPlay',label:`${srcName} ${c.wild?'WILD':c.rank} → Build ${pile+1}`,args:{source:src,pile}})}}
 for(const c of viewer.hand)for(let i=0;i<4;i++)actions.push({action:'sbDiscard',label:`End turn: ${c.wild?'WILD':c.rank} → Discard ${i+1}`,args:{cardId:c.id,pile:i}})
 }}
 const publicStocks=Object.fromEntries(order(room).map(id=>[id,{count:ex.stocks[id].length,top:ex.stocks[id].at(-1)||null}]));const publicDiscards=Object.fromEntries(order(room).map(id=>[id,ex.discards[id].map(pile=>({count:pile.length,top:pile.at(-1)||null}))]));
 return {type:ex.type,phase:ex.phase,turnPlayerId:ex.turnPlayerId,drawCount:ex.drawPile.length,builds:ex.builds.map(p=>p.map(c=>({...c}))),stocks:publicStocks,discards:publicDiscards,hand:viewer?[...viewer.hand]:[],handCounts:Object.fromEntries(order(room).map(id=>[id,P(room,id).hand.length])),stockSize:ex.stockSize,message:ex.message,actions}
}
function sbAction(room,p,{action,args={}}){const ex=room.game.extra;if(ex.turnPlayerId!==p.id)throw new Error('Not your turn');if(action==='sbDraw'){if(ex.phase!=='draw')throw new Error('You already drew');sbFillHand(ex,p);ex.phase='play';ex.message='Play from Hand, Stock or Discard. Discard one card to end your turn.';return}if(ex.phase!=='play')throw new Error('Draw first');if(action==='sbPlay'){const src=args.source||{},card=sbSourceCard(room,p,src),pile=Number(args.pile);if(!card||!sbLegalTargets(ex,card).includes(pile))throw new Error('That card cannot be played there');const removed=sbRemoveSource(room,p,src),need=sbNeed(ex.builds[pile]);ex.builds[pile].push({...removed,value:need});if(need===12){ex.recycle.push(...ex.builds[pile]);ex.builds[pile]=[];ex.message=`Building Pile ${pile+1} completed and cleared.`}else ex.message=`${p.name} built ${need}.`;if(src.kind==='stock'&&!ex.stocks[p.id].length)return finish(room,[p.id],'Stock Pile cleared.');if(!p.hand.length){sbFillHand(ex,p);ex.message+=' Hand emptied: drew five more and continues.'}return}if(action==='sbDiscard'){const c=removeById(p.hand,args.cardId),pile=Number(args.pile);if(!c||pile<0||pile>3)throw new Error('Choose a hand card and discard pile');ex.discards[p.id][pile].push(c);return sbAdvance(room,p)}throw new Error('Invalid Skip-Bo action')}

// ---------------------------------------------------------------------------
// Backgammon
// ---------------------------------------------------------------------------
const bgClone=ex=>({points:Object.fromEntries(Object.entries(ex.points).map(([id,a])=>[id,[...a]])),bar:{...ex.bar},off:{...ex.off}});
const bgOpponent=(room,id)=>order(room).find(x=>x!==id);
const bgPlayerIndex=(room,id)=>order(room).indexOf(id);
const bgDir=(room,id)=>bgPlayerIndex(room,id)===0?-1:1;
const bgHomePoints=(room,id)=>bgDir(room,id)<0?[0,1,2,3,4,5]:[18,19,20,21,22,23];
function bgSetup(room){const ids=order(room),points=Object.fromEntries(ids.map(id=>[id,Array(24).fill(0)]));points[ids[0]][23]=2;points[ids[0]][12]=5;points[ids[0]][7]=3;points[ids[0]][5]=5;points[ids[1]][0]=2;points[ids[1]][11]=5;points[ids[1]][16]=3;points[ids[1]][18]=5;return {points,bar:Object.fromEntries(ids.map(id=>[id,0])),off:Object.fromEntries(ids.map(id=>[id,0]))}}
function bgStart(room){resetPlayers(room);const ids=order(room),b=bgSetup(room);setExtra(room,{type:GAME_TYPES.BACKGAMMON,phase:'opening',turnPlayerId:ids[0],points:b.points,bar:b.bar,off:b.off,dice:null,cube:1,cubeOwner:null,pendingDouble:null,openingRoll:null,message:`${P(room,ids[0]).name} rolls for the opening move.`,history:[],lastMove:null,result:null})}
function bgBlocked(ex,room,id,to){const opp=bgOpponent(room,id);return ex.points[opp][to]>=2}
function bgCanBear(ex,room,id){if(ex.bar[id]>0)return false;const home=new Set(bgHomePoints(room,id));for(let i=0;i<24;i++)if(ex.points[id][i]>0&&!home.has(i))return false;return true}
function bgOversizeAllowed(ex,room,id,from,die){const dir=bgDir(room,id);if(dir<0){if(die<=from+1)return false;for(let i=from+1;i<=5;i++)if(ex.points[id][i]>0)return false;return true}if(die<=24-from)return false;for(let i=18;i<from;i++)if(ex.points[id][i]>0)return false;return true}
function bgSingleMoves(ex,room,id,die){const out=[],dir=bgDir(room,id),opp=bgOpponent(room,id);if(ex.bar[id]>0){const to=dir<0?24-die:die-1;if(to>=0&&to<24&&!bgBlocked(ex,room,id,to))out.push({from:'bar',to,die,hit:ex.points[opp][to]===1});return out}
 for(let from=0;from<24;from++){if(ex.points[id][from]<=0)continue;const to=from+dir*die;if(to>=0&&to<24){if(!bgBlocked(ex,room,id,to))out.push({from,to,die,hit:ex.points[opp][to]===1})}else if(bgCanBear(ex,room,id)){const exact=dir<0?die===from+1:die===24-from;if(exact||bgOversizeAllowed(ex,room,id,from,die))out.push({from,to:'off',die,hit:false})}}
 return out
}
function bgApplyState(state,room,id,m){const opp=bgOpponent(room,id);if(m.from==='bar')state.bar[id]--;else state.points[id][m.from]--;if(m.to==='off')state.off[id]++;else{if(state.points[opp][m.to]===1){state.points[opp][m.to]=0;state.bar[opp]++}state.points[id][m.to]++}}
function bgOrderedSequences(ex,room,id,orderedDice){const results=[];function rec(state,idx,seq){if(idx>=orderedDice.length){results.push(seq);return}const die=orderedDice[idx],moves=bgSingleMoves(state,room,id,die);if(!moves.length){rec(state,idx+1,seq);return}for(const m of moves){const nextState={...state,points:Object.fromEntries(Object.entries(state.points).map(([k,a])=>[k,[...a]])),bar:{...state.bar},off:{...state.off}};bgApplyState(nextState,room,id,m);rec(nextState,idx+1,[...seq,m])}}rec(bgClone(ex),0,[]);return results}
export function bgLegalSequences(ex,room,id,dice=ex.dice||[]){if(!dice.length)return[];const orders=[];if(dice.length===2&&dice[0]!==dice[1])orders.push(dice,[dice[1],dice[0]]);else orders.push(dice);let seqs=orders.flatMap(ds=>bgOrderedSequences(ex,room,id,ds));const max=Math.max(0,...seqs.map(s=>s.length));seqs=seqs.filter(s=>s.length===max);if(max===1&&dice.length===2&&dice[0]!==dice[1]){const high=Math.max(...dice);if(seqs.some(s=>s[0]?.die===high))seqs=seqs.filter(s=>s[0]?.die===high)}const seen=new Set;return seqs.filter(s=>{const k=s.map(m=>`${m.from}:${m.to}:${m.die}`).join('|');if(seen.has(k))return false;seen.add(k);return true})}
function bgFirstMoves(ex,room,id){const seqs=bgLegalSequences(ex,room,id);const map=new Map;for(const s of seqs)if(s[0]){const m=s[0],k=`${m.from}:${m.to}:${m.die}`;map.set(k,m)}return [...map.values()]}
function bgConsumeDie(ex,die){const i=ex.dice.indexOf(die);if(i>=0)ex.dice.splice(i,1)}
function bgEndTurn(room){const ex=room.game.extra;ex.turnPlayerId=next(room,ex.turnPlayerId);ex.dice=null;ex.message=`${P(room,ex.turnPlayerId).name}'s turn · roll the dice.`}
function bgResult(room,winnerId){const ex=room.game.extra,loser=bgOpponent(room,winnerId),winnerHome=new Set(bgHomePoints(room,winnerId));let kind='normal',mult=1;if(ex.off[loser]===0){const loserInWinnerHome=winnerHome.size&&[...winnerHome].some(i=>ex.points[loser][i]>0);if(ex.bar[loser]>0||loserInWinnerHome){kind='backgammon';mult=3}else{kind='gammon';mult=2}}if(room.settings.jacoby&&ex.cube===1&&kind!=='normal'){kind='normal';mult=1}const pts=mult*ex.cube;P(room,winnerId).score=pts;ex.result={winnerId,loserId:loser,kind,points:pts,cube:ex.cube};ex.history.push({...ex.result});finish(room,[winnerId],`${kind} · ${pts} point${pts===1?'':'s'}`)}
function bgPublic(room,viewer){const ex=room.game.extra,actions=[];if(viewer){if(ex.phase==='opening'&&ex.turnPlayerId===viewer.id)actions.push({action:'bgOpeningRoll',label:'Roll opening dice'});if(ex.phase==='doubleOffer'&&ex.pendingDouble?.targetId===viewer.id){actions.push({action:'bgAcceptDouble',label:`Accept double to ${ex.pendingDouble.to}`});if(room.settings.beavers&&ex.pendingDouble.to<64)actions.push({action:'bgBeaver',label:`Beaver · accept and redouble to ${Math.min(64,ex.pendingDouble.to*2)}`});actions.push({action:'bgDeclineDouble',label:`Decline · concede at ${ex.cube}`})}if(ex.phase==='playing'&&ex.turnPlayerId===viewer.id){if(!ex.dice){actions.push({action:'bgRoll',label:'Roll dice'});if(!ex.pendingDouble&&(ex.cubeOwner==null||ex.cubeOwner===viewer.id)&&ex.cube<64)actions.push({action:'bgOfferDouble',label:`Offer double to ${ex.cube*2}`})}else{const moves=bgFirstMoves(ex,room,viewer.id);for(const m of moves)actions.push({action:'bgMove',label:`${m.from==='bar'?'Bar':`Point ${Number(m.from)+1}`} → ${m.to==='off'?'Bear off':`Point ${Number(m.to)+1}`} · use ${m.die}`,args:m});if(!moves.length)actions.push({action:'bgEndNoMove',label:'No legal move · end turn'})}}}
 return {type:ex.type,phase:ex.phase,turnPlayerId:ex.turnPlayerId,points:ex.points,bar:ex.bar,off:ex.off,dice:ex.dice? [...ex.dice]:null,cube:ex.cube,cubeOwner:ex.cubeOwner,pendingDouble:ex.pendingDouble,openingRoll:ex.openingRoll,message:ex.message,lastMove:ex.lastMove,result:ex.result,settings:{automaticDoubles:!!room.settings.automaticDoubles,beavers:!!room.settings.beavers,jacoby:!!room.settings.jacoby,beginnerHelp:room.settings.beginnerHelp!==false},actions}
}
function bgAction(room,p,{action,args={}}){const ex=room.game.extra;if(action==='bgOpeningRoll'){if(ex.phase!=='opening'||ex.turnPlayerId!==p.id)throw new Error('Opening roll unavailable');let a,b,ties=0;do{a=rollDie();b=rollDie();if(a===b){ties++;if(room.settings.automaticDoubles&&ex.cube<64)ex.cube=Math.min(64,ex.cube*2)}}while(a===b);const ids=order(room),winner=a>b?ids[0]:ids[1];ex.openingRoll={[ids[0]]:a,[ids[1]]:b};ex.turnPlayerId=winner;ex.dice=[a,b];ex.phase='playing';ex.message=`${P(room,ids[0]).name} rolled ${a}; ${P(room,ids[1]).name} rolled ${b}. ${P(room,winner).name} moves first.${ties&&room.settings.automaticDoubles?` ${ties} tied opening roll${ties===1?'':'s'} raised the cube to ${ex.cube}.`:''}`;return}if(action==='bgOfferDouble'){if(ex.phase!=='playing'||ex.turnPlayerId!==p.id||ex.dice)throw new Error('Offer before rolling');if(ex.cubeOwner!=null&&ex.cubeOwner!==p.id)throw new Error('You do not own the cube');const target=bgOpponent(room,p.id);ex.pendingDouble={fromId:p.id,targetId:target,to:ex.cube*2};ex.phase='doubleOffer';ex.message=`${p.name} offers to double to ${ex.cube*2}.`;return}if(action==='bgAcceptDouble'){if(ex.phase!=='doubleOffer'||ex.pendingDouble?.targetId!==p.id)throw new Error('No double offer');ex.cube=ex.pendingDouble.to;ex.cubeOwner=p.id;ex.turnPlayerId=ex.pendingDouble.fromId;ex.pendingDouble=null;ex.phase='playing';ex.message=`${p.name} accepted. Cube is ${ex.cube}.`;return}if(action==='bgBeaver'){if(!room.settings.beavers||ex.phase!=='doubleOffer'||ex.pendingDouble?.targetId!==p.id)throw new Error('Beaver is unavailable');const original=ex.pendingDouble.fromId;ex.cube=Math.min(64,ex.pendingDouble.to*2);ex.cubeOwner=p.id;ex.turnPlayerId=original;ex.pendingDouble=null;ex.phase='playing';ex.message=`${p.name} beavered. Cube is ${ex.cube}, owned by ${p.name}.`;return}if(action==='bgDeclineDouble'){if(ex.phase!=='doubleOffer'||ex.pendingDouble?.targetId!==p.id)throw new Error('No double offer');const winner=ex.pendingDouble.fromId,loser=p.id,pts=ex.cube;ex.result={winnerId:winner,loserId:loser,kind:'declined double',points:pts,cube:ex.cube};ex.history.push({...ex.result});P(room,winner).score=pts;ex.pendingDouble=null;return finish(room,[winner],`Double declined · ${pts} point${pts===1?'':'s'}`)}if(ex.phase!=='playing'||ex.turnPlayerId!==p.id)throw new Error('Not your turn');if(action==='bgRoll'){if(ex.dice)throw new Error('Dice already rolled');const a=rollDie(),b=rollDie();ex.dice=a===b?[a,a,a,a]:[a,b];ex.message=a===b?`Doubles ${a}! Four moves.`:`Rolled ${a} and ${b}.`;if(!bgFirstMoves(ex,room,p.id).length)bgEndTurn(room);return}if(action==='bgMove'){if(!ex.dice)throw new Error('Roll first');const legal=bgFirstMoves(ex,room,p.id).find(m=>String(m.from)===String(args.from)&&String(m.to)===String(args.to)&&Number(m.die)===Number(args.die));if(!legal)throw new Error('That move is not legal');bgApplyState(ex,room,p.id,legal);bgConsumeDie(ex,legal.die);ex.lastMove={playerId:p.id,...legal};if(ex.off[p.id]>=15)return bgResult(room,p.id);if(!ex.dice.length||!bgFirstMoves(ex,room,p.id).length)bgEndTurn(room);else ex.message=`${ex.dice.join(' · ')} remaining.`;return}if(action==='bgEndNoMove'){if(ex.dice&&bgFirstMoves(ex,room,p.id).length)throw new Error('A legal move remains');return bgEndTurn(room)}throw new Error('Invalid Backgammon action')}

// ---------------------------------------------------------------------------
// Dispatch
// ---------------------------------------------------------------------------
export function startThreeNewGame(room){if(room.gameType===GAME_TYPES.MEXICAN_TRAIN)return mtStart(room);if(room.gameType===GAME_TYPES.SKIP_BO)return sbStart(room);if(room.gameType===GAME_TYPES.BACKGAMMON)return bgStart(room);return false}
export function publicThreeNewGame(room,viewer){if(room.gameType===GAME_TYPES.MEXICAN_TRAIN)return mtPublic(room,viewer);if(room.gameType===GAME_TYPES.SKIP_BO)return sbPublic(room,viewer);if(room.gameType===GAME_TYPES.BACKGAMMON)return bgPublic(room,viewer);return null}
export function actionThreeNewGame(room,p,b){if(room.gameType===GAME_TYPES.MEXICAN_TRAIN)return mtAction(room,p,b);if(room.gameType===GAME_TYPES.SKIP_BO)return sbAction(room,p,b);if(room.gameType===GAME_TYPES.BACKGAMMON)return bgAction(room,p,b);throw new Error('Unsupported new game')}
