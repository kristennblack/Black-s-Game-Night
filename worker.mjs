import crypto from 'node:crypto';
import {
  GAME_TYPES, buildScrewSchedule, generateFuckSchedule,
  firstDealerCeremony, randomDealer, orderedAfterDealer, forbiddenDealerBid, legalCardIds,
  trickWinnerForGame, scoreBid, nextClockwise, dealRound, teamForSeat, smearBidValue,
  scoreSmearPoints, applySmearContract
} from './gameEngine.mjs';
import {
  isExtraGame, extraName, extraMaxSeats, extraDefaults, applyExtraSettings,
  startExtraGame, extraPublicState, extraGameAction
} from './extraGames.mjs';

const rooms = new Map();
let activeHub = null;
const encoder = new TextEncoder();

const safeId=(n=8)=>crypto.randomBytes(12).toString('base64url').replace(/[^A-Z0-9]/gi,'').slice(0,n).toUpperCase();
const token=()=>crypto.randomBytes(18).toString('base64url');
const now=()=>Date.now();
const gameName=t=>isExtraGame(t)?extraName(t):t===GAME_TYPES.FUCK?'Fuck Your Buddy':t===GAME_TYPES.SMEAR?'Smear':'Screw Your Buddy';
const maxSeatsFor=t=>isExtraGame(t)?extraMaxSeats(t):t===GAME_TYPES.SMEAR?4:t===GAME_TYPES.FUCK?56:52;
const jsonResponse=(data,status=200)=>new Response(JSON.stringify(data),{status,headers:{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store'}});

function playerOrder(room){return [...room.players.values()].filter(p=>p.seat!=null).sort((a,b)=>a.seat-b.seat).map(p=>p.id)}
function player(room,playerToken){return [...room.players.values()].find(p=>p.token===playerToken)}
function host(room,hostToken){return !!hostToken&&room.hostToken===hostToken}
function currentRound(room){return room.game.roundIndex>=0?room.game.schedule[room.game.roundIndex]||null:null}

function publicState(room,viewerToken=null){
  const viewer=player(room,viewerToken);const g=room.game;const round=currentRound(room);
  const visiblePlayers=[...room.players.values()].sort((a,b)=>(a.seat??9999)-(b.seat??9999)||a.name.localeCompare(b.name));
  const players=visiblePlayers.map(p=>({id:p.id,name:p.name,avatar:p.avatar,variant:p.variant,outfitVariant:p.outfitVariant??0,color:p.color,seat:p.seat,team:p.seat==null?null:teamForSeat(p.seat),ready:p.ready,connected:p.connected,bid:p.bid,tricks:p.tricks,score:p.score,continued:p.continued,handCount:p.hand.length,eliminated:!!p.eliminated,isHost:p.id===room.hostPlayerId}));
  const legal=!isExtraGame(room.gameType)&&viewer&&g.phase==='playing'&&g.turnPlayerId===viewer.id?[...legalCardIds(viewer.hand,g.currentTrick,room.gameType)]:[];
  const forbidden=!isExtraGame(room.gameType)&&room.gameType!==GAME_TYPES.SMEAR&&viewer&&g.phase==='bidding'&&g.bidTurnId===viewer.id&&viewer.id===g.dealerId
    ?forbiddenDealerBid(g.handSize,g.biddingOrder.filter(id=>id!==g.dealerId).map(id=>room.players.get(id).bid??0)):null;
  return {
    id:room.id,createdAt:room.createdAt,phase:g.phase,gameType:room.gameType,gameName:gameName(room.gameType),settings:room.settings,
    players,maxSeats:room.maxSeats,viewerId:viewer?.id||null,hostPlayerId:room.hostPlayerId,
    game:{phase:g.phase,roundIndex:g.roundIndex,roundNumber:g.roundIndex+1,totalRounds:room.gameType===GAME_TYPES.SMEAR?null:g.schedule.length,handSize:g.handSize,trump:(room.gameType===GAME_TYPES.SMEAR?g.trump:round?.trump)||null,powerRank:round?.powerRank||null,schedule:g.schedule,dealerId:g.dealerId,dealerCeremony:g.dealerCeremony,biddingOrder:g.biddingOrder,bidTurnId:g.bidTurnId,turnPlayerId:g.turnPlayerId,leaderId:g.leaderId,currentTrick:g.currentTrick,lastTrick:g.lastTrick,roundResults:g.roundResults,winnerIds:g.winnerIds,history:g.history,legalCardIds:legal,hand:viewer?viewer.hand:[],forbiddenBid:forbidden,teamScores:g.teamScores||null,highBid:g.highBid??null,highBidderId:g.highBidderId||null,contract:g.contract??null,fourAndOut:!!g.fourAndOut,biddingTeam:g.biddingTeam||null,smearAwards:g.smearAwards||null,gameValues:g.gameValues||null,extra:isExtraGame(room.gameType)&&g.extra?extraPublicState(room,viewer):null},
    chat:room.chat.slice(-80),reaction:room.reaction
  };
}

function serializeRoom(room){return {...room,subscribers:undefined,reaction:null,players:[...room.players.values()].map(p=>({...p,connected:false}))}}
function restoreRoom(raw){
  const gameType=raw.gameType||GAME_TYPES.SCREW;
  const restored={...raw,gameType,settings:{roundCount:10,...extraDefaults(gameType),...raw.settings},maxSeats:raw.maxSeats||maxSeatsFor(gameType),subscribers:new Set(),reaction:null,players:new Map((raw.players||[]).map(p=>[p.id,{...p,connected:false}]))};
  restored.game={schedule:[],history:[],...restored.game};
  if(!restored.game.schedule.length&&restored.game.handSizes?.length){restored.game.schedule=restored.game.handSizes.map((handSize,i)=>({handSize,trump:['hearts','clubs','diamonds','spades','none'][i%5],powerRank:null,source:null}))}
  return restored;
}
function persistRoom(room){activeHub?.persistRoom(room)}
function writeEvent(sub,type,payload){try{sub.controller.enqueue(encoder.encode(`event: ${type}\ndata: ${JSON.stringify(payload)}\n\n`));return true}catch{return false}}
function broadcast(room){persistRoom(room);for(const sub of [...room.subscribers]){if(!writeEvent(sub,'state',publicState(room,sub.token)))room.subscribers.delete(sub)}}
function sendVoiceSignal(room,targetId,payload){for(const sub of [...room.subscribers]){const target=player(room,sub.token);if(target?.id!==targetId)continue;if(!writeEvent(sub,'voice',payload))room.subscribers.delete(sub)}}

function newRoom(hostName='Host',gameType=GAME_TYPES.SCREW){
  if(!Object.values(GAME_TYPES).includes(gameType))gameType=GAME_TYPES.SCREW;
  const id=safeId(),hostToken=token(),pToken=token(),pId=crypto.randomUUID();
  const room={id,gameType,settings:{roundCount:10,...extraDefaults(gameType)},hostToken,hostPlayerId:pId,createdAt:now(),maxSeats:maxSeatsFor(gameType),subscribers:new Set(),chat:[],reaction:null,players:new Map([[pId,{id:pId,token:pToken,name:hostName,avatar:/^john black$/i.test(hostName.trim())?'john':'cowboy',variant:0,outfitVariant:0,color:'#2f6b4f',seat:null,ready:false,connected:true,bid:null,tricks:0,score:0,continued:false,hand:[],eliminated:false}]]),game:{phase:'lobby',roundIndex:-1,schedule:[],handSize:0,dealerId:null,dealerCeremony:null,biddingOrder:[],bidTurnId:null,bidActionCount:0,highBid:null,highBidderId:null,contract:null,fourAndOut:false,biddingTeam:null,teamScores:{A:0,B:0},trump:null,trumpPlays:[],capturedByTeam:{A:[],B:[]},smearAwards:null,gameValues:null,turnPlayerId:null,leaderId:null,currentTrick:[],lastTrick:null,roundResults:null,winnerIds:[],history:[],extra:null}};
  rooms.set(id,room);persistRoom(room);return {room,hostToken,playerToken:pToken};
}

function startRound(room,roundIndex){
  const g=room.game,order=playerOrder(room),round=g.schedule[roundIndex];if(!round)throw new Error('Round does not exist.');
  g.roundIndex=roundIndex;g.handSize=round.handSize;g.phase='bidding';g.currentTrick=[];g.lastTrick=null;g.roundResults=null;
  g.biddingOrder=orderedAfterDealer(order,g.dealerId);g.bidTurnId=g.biddingOrder[0];g.turnPlayerId=null;
  if(room.gameType===GAME_TYPES.SMEAR){g.leaderId=null;g.bidActionCount=0;g.highBid=null;g.highBidderId=null;g.contract=null;g.fourAndOut=false;g.biddingTeam=null;g.trump=null;g.trumpPlays=[];g.capturedByTeam={A:[],B:[]};g.smearAwards=null;g.gameValues=null}else g.leaderId=g.biddingOrder[0];
  const {hands}=dealRound(order,g.handSize,room.gameType);for(const id of order){const p=room.players.get(id);p.hand=hands[id];p.bid=null;p.tricks=0;p.continued=false}broadcast(room);
}

function finishRound(room){
  const g=room.game,order=playerOrder(room),round=currentRound(room);
  if(room.gameType===GAME_TYPES.SMEAR){
    const scored=scoreSmearPoints({trump:g.trump,trumpPlays:g.trumpPlays,capturedByTeam:g.capturedByTeam});
    const applied=applySmearContract({points:scored.points,biddingTeam:g.biddingTeam,contract:g.contract,fourAndOut:g.fourAndOut,currentScores:g.teamScores});
    g.teamScores=applied.scores;g.smearAwards=scored.awards;g.gameValues=scored.gameValues;
    for(const id of order){const p=room.players.get(id);p.score=g.teamScores[teamForSeat(p.seat)]}
    g.roundResults={type:'smear',points:scored.points,awards:scored.awards,gameValues:scored.gameValues,teamScores:{...g.teamScores},biddingTeam:g.biddingTeam,biddingPlayerId:g.highBidderId,contract:g.contract,fourAndOut:g.fourAndOut,made:applied.made,winnerTeam:applied.winnerTeam};
    g.history.push({roundIndex:g.roundIndex,handSize:6,trump:g.trump,dealerId:g.dealerId,biddingPlayerId:g.highBidderId,biddingTeam:g.biddingTeam,contract:g.contract,fourAndOut:g.fourAndOut,points:scored.points,awards:scored.awards,gameValues:scored.gameValues,teamScores:{...g.teamScores},made:applied.made});
    if(applied.winnerTeam){g.winnerIds=order.filter(id=>teamForSeat(room.players.get(id).seat)===applied.winnerTeam);g.phase='gameOver'}else g.phase='roundResults';broadcast(room);return;
  }
  const results=order.map(id=>{const p=room.players.get(id),points=scoreBid(p.bid,p.tricks);p.score+=points;return{playerId:id,bid:p.bid,tricks:p.tricks,points,total:p.score}});
  g.roundResults=results;g.history.push({roundIndex:g.roundIndex,handSize:g.handSize,trump:round?.trump||'none',powerRank:round?.powerRank||null,dealerId:g.dealerId,results});
  if(g.roundIndex>=g.schedule.length-1){const high=Math.max(...order.map(id=>room.players.get(id).score));g.winnerIds=order.filter(id=>room.players.get(id).score===high);g.phase='gameOver'}else g.phase='roundResults';broadcast(room);
}
function beginNextRound(room){const order=playerOrder(room);room.game.dealerId=nextClockwise(order,room.game.dealerId);if(room.gameType===GAME_TYPES.SMEAR)room.game.schedule.push({handSize:6,trump:null,powerRank:null,source:null});startRound(room,room.game.roundIndex+1)}

async function parseBody(request){try{return await request.json()}catch{return {}}}

async function handleApi(request){
  const u=new URL(request.url);
  if(u.pathname==='/healthz')return jsonResponse({ok:true,rooms:rooms.size,persistence:true});
  if(u.pathname==='/api/create'&&request.method==='POST'){const b=await parseBody(request),{room,hostToken,playerToken}=newRoom((b.name||'Host').slice(0,24),b.gameType);return jsonResponse({roomId:room.id,hostToken,playerToken,gameType:room.gameType})}
  if(u.pathname==='/api/state'&&request.method==='GET'){const room=await activeHub.getRoom(u.searchParams.get('room'));if(!room)return jsonResponse({error:'Room not found'},404);return jsonResponse(publicState(room,u.searchParams.get('token')))}
  if(u.pathname==='/api/events'&&request.method==='GET'){
    const room=await activeHub.getRoom(u.searchParams.get('room'));if(!room)return new Response('Room not found',{status:404});
    const t=u.searchParams.get('token');const p=player(room,t);if(p)p.connected=true;
    let sub=null;let cleaned=false;
    const cleanup=()=>{if(cleaned)return;cleaned=true;if(sub)room.subscribers.delete(sub);if(p){p.connected=false;setTimeout(()=>broadcast(room),50)}};
    const stream=new ReadableStream({
      start(controller){sub={controller,token:t};room.subscribers.add(sub);controller.enqueue(encoder.encode(`event: state\ndata: ${JSON.stringify(publicState(room,t))}\n\n`));},
      cancel(){cleanup()}
    });
    request.signal?.addEventListener('abort',cleanup,{once:true});
    broadcast(room);
    return new Response(stream,{status:200,headers:{'Content-Type':'text/event-stream; charset=utf-8','Cache-Control':'no-cache, no-transform','Connection':'keep-alive','X-Accel-Buffering':'no'}});
  }
  if(u.pathname==='/api/join'&&request.method==='POST'){
    const b=await parseBody(request),room=await activeHub.getRoom(b.roomId);if(!room)return jsonResponse({error:'Room not found'},404);if(room.game.phase!=='lobby')return jsonResponse({error:'Game already started'},409);if(room.players.size>=room.maxSeats)return jsonResponse({error:'Room is full'},409);
    const id=crypto.randomUUID(),t=token();room.players.set(id,{id,token:t,name:(b.name||'Player').slice(0,24),avatar:b.avatar||(/^john black$/i.test(String(b.name||'').trim())?'john':'cowboy'),variant:Number(b.variant||0),outfitVariant:Number(b.outfitVariant||0),color:b.color||'#6c7a89',seat:null,ready:false,connected:true,bid:null,tricks:0,score:0,continued:false,hand:[],eliminated:false});broadcast(room);return jsonResponse({playerToken:t,playerId:id,gameType:room.gameType});
  }
  if(!u.pathname.startsWith('/api/'))return jsonResponse({error:'Unknown route'},404);
  const b=await parseBody(request),room=await activeHub.getRoom(b.roomId);if(!room)return jsonResponse({error:'Room not found'},404);const p=player(room,b.playerToken);const fail=(msg,code=400)=>jsonResponse({error:msg},code);
  if(u.pathname==='/api/profile'&&request.method==='POST'){if(!p)return fail('Player not found',401);if(room.game.phase!=='lobby')return fail('Profile locked after start');p.name=(b.name||p.name).slice(0,24);p.avatar=b.avatar||p.avatar;p.variant=Number(b.variant??p.variant);p.outfitVariant=Number(b.outfitVariant??p.outfitVariant??0);p.color=b.color||p.color;p.ready=false;broadcast(room);return jsonResponse({ok:true})}
  if(u.pathname==='/api/seat'&&request.method==='POST'){if(!p)return fail('Player not found',401);if(room.game.phase!=='lobby')return fail('Seats are locked');const seat=Number(b.seat);if(!Number.isInteger(seat)||seat<0||seat>=room.maxSeats)return fail('Invalid seat');if([...room.players.values()].some(x=>x.id!==p.id&&x.seat===seat))return fail('Seat occupied');p.seat=seat;p.ready=false;broadcast(room);return jsonResponse({ok:true})}
  if(u.pathname==='/api/removePlayer'&&request.method==='POST'){if(!host(room,b.hostToken))return fail('Host only',403);if(room.game.phase!=='lobby')return fail('Players can only be removed before the game starts');const target=room.players.get(String(b.targetId||''));if(!target)return fail('Player not found');if(target.id===room.hostPlayerId)return fail('The host cannot remove themselves');room.players.delete(target.id);broadcast(room);return jsonResponse({ok:true})}
  if(u.pathname==='/api/ready'&&request.method==='POST'){if(!p||p.seat==null)return fail('Choose a seat first');if(room.game.phase!=='lobby')return fail('Game already started');p.ready=!!b.ready;broadcast(room);return jsonResponse({ok:true})}
  if(u.pathname==='/api/settings'&&request.method==='POST'){if(!host(room,b.hostToken))return fail('Host only',403);if(room.game.phase!=='lobby')return fail('Settings locked after start');if(isExtraGame(room.gameType)){applyExtraSettings(room,b)}else if(room.gameType===GAME_TYPES.FUCK){const n=Number(b.roundCount);if(!Number.isInteger(n)||n<1||n>100)return fail('Choose 1 to 100 rounds');room.settings.roundCount=n}broadcast(room);return jsonResponse({ok:true})}
  if(u.pathname==='/api/start'&&request.method==='POST'){
    if(!host(room,b.hostToken))return fail('Host only',403);if(isExtraGame(room.gameType)){try{startExtraGame(room);broadcast(room);return jsonResponse({ok:true})}catch(err){return fail(err.message)}}
    const joined=[...room.players.values()];if(room.gameType===GAME_TYPES.SMEAR&&joined.length!==4)return fail('Smear requires exactly 4 players');if(room.gameType!==GAME_TYPES.SMEAR&&joined.length<2)return fail('Need at least 2 players');if(joined.some(x=>x.seat==null))return fail('Everyone must choose a seat');if(joined.some(x=>!x.ready))return fail('Everyone must be Ready');const order=playerOrder(room);
    room.game.schedule=room.gameType===GAME_TYPES.SMEAR?[{handSize:6,trump:null,powerRank:null,source:null}]:room.gameType===GAME_TYPES.FUCK?generateFuckSchedule(room.settings.roundCount,order.length):buildScrewSchedule(order.length);for(const id of order){room.players.get(id).score=0}
    if(room.gameType===GAME_TYPES.SMEAR){room.game.teamScores={A:0,B:0};const dealerId=randomDealer(order);room.game.dealerId=dealerId;room.game.dealerCeremony={type:'random',dealerId,sequence:[],createdAt:now()}}else{const ceremony=firstDealerCeremony(order,room.gameType);room.game.dealerId=ceremony.dealerId;room.game.dealerCeremony={type:'jack',...ceremony,createdAt:now()}}startRound(room,0);return jsonResponse({ok:true});
  }
  if(u.pathname==='/api/gameAction'&&request.method==='POST'){if(!p)return fail('Player not found',401);if(!isExtraGame(room.gameType))return fail('This game uses the standard card actions');try{extraGameAction(room,p,b);broadcast(room);return jsonResponse({ok:true})}catch(err){return fail(err.message)}}
  if(u.pathname==='/api/bid'&&request.method==='POST'){
    const g=room.game;if(!p)return fail('Player not found',401);if(g.phase!=='bidding'||g.bidTurnId!==p.id)return fail('Not your bid');
    if(room.gameType===GAME_TYPES.SMEAR){
      const bid=String(b.bid);if(!['pass','1','2','3','4','4out'].includes(bid))return fail('Invalid Smear bid');const value=smearBidValue(bid);if(bid!=='pass'&&value<=smearBidValue(g.highBid))return fail('You must bid higher than the current bid');p.bid=bid;g.bidActionCount++;if(bid!=='pass'){g.highBid=bid;g.highBidderId=p.id}
      const idx=g.biddingOrder.indexOf(p.id),immediate=bid==='4out',circuitDone=idx===g.biddingOrder.length-1;
      if(immediate||(circuitDone&&g.highBidderId)){g.phase='playing';g.bidTurnId=null;g.leaderId=g.highBidderId;g.turnPlayerId=g.highBidderId;g.contract=g.highBid==='4out'?4:Number(g.highBid);g.fourAndOut=g.highBid==='4out';g.biddingTeam=teamForSeat(room.players.get(g.highBidderId).seat)}else if(circuitDone){for(const id of g.biddingOrder)room.players.get(id).bid=null;g.bidActionCount=0;g.bidTurnId=g.biddingOrder[0]}else g.bidTurnId=g.biddingOrder[idx+1];broadcast(room);return jsonResponse({ok:true});
    }
    const bid=Number(b.bid);if(!Number.isInteger(bid)||bid<0||bid>g.handSize)return fail('Invalid bid');if(p.id===g.dealerId){const before=g.biddingOrder.filter(id=>id!==g.dealerId).map(id=>room.players.get(id).bid??0);if(forbiddenDealerBid(g.handSize,before)===bid)return fail('That bid would make total bids equal the hand size')}
    p.bid=bid;const idx=g.biddingOrder.indexOf(p.id);if(idx===g.biddingOrder.length-1){g.phase='playing';g.bidTurnId=null;g.turnPlayerId=g.leaderId}else g.bidTurnId=g.biddingOrder[idx+1];broadcast(room);return jsonResponse({ok:true});
  }
  if(u.pathname==='/api/play'&&request.method==='POST'){
    const g=room.game;if(!p)return fail('Player not found',401);if(g.phase!=='playing'||g.turnPlayerId!==p.id)return fail('Not your turn');const played=p.hand.find(c=>c.id===b.cardId);if(!played)return fail('Card not in hand');if(!legalCardIds(p.hand,g.currentTrick,room.gameType).has(played.id))return fail(room.gameType===GAME_TYPES.FUCK?'You must follow suit (Jokers are always legal in Fuck Your Buddy)':'You must follow suit');
    if(room.gameType===GAME_TYPES.SMEAR&&!g.trump){g.trump=played.suit;g.schedule[g.roundIndex].trump=played.suit}p.hand=p.hand.filter(c=>c.id!==played.id);g.currentTrick.push({playerId:p.id,card:played});if(room.gameType===GAME_TYPES.SMEAR&&played.suit===g.trump)g.trumpPlays.push({playerId:p.id,team:teamForSeat(p.seat),card:played});const order=playerOrder(room);
    if(g.currentTrick.length===order.length){const round=currentRound(room),trump=room.gameType===GAME_TYPES.SMEAR?g.trump:round.trump,winner=trickWinnerForGame(room.gameType,g.currentTrick,trump,g.handSize);room.players.get(winner).tricks++;if(room.gameType===GAME_TYPES.SMEAR){const winningTeam=teamForSeat(room.players.get(winner).seat);g.capturedByTeam[winningTeam].push(...g.currentTrick.map(x=>x.card))}g.lastTrick={winnerId:winner,cards:g.currentTrick,at:now()};g.turnPlayerId=null;broadcast(room);setTimeout(()=>{if(g.phase!=='playing')return;g.currentTrick=[];if(order.every(id=>room.players.get(id).hand.length===0))finishRound(room);else{g.leaderId=winner;g.turnPlayerId=winner;broadcast(room)}},700)}else{g.turnPlayerId=nextClockwise(order,p.id);broadcast(room)}return jsonResponse({ok:true});
  }
  if(u.pathname==='/api/continue'&&request.method==='POST'){if(!p)return fail('Player not found',401);if(room.game.phase!=='roundResults')return fail('Not between rounds');p.continued=true;broadcast(room);const order=playerOrder(room);if(order.every(id=>room.players.get(id).continued))beginNextRound(room);return jsonResponse({ok:true})}
  if(u.pathname==='/api/chat'&&request.method==='POST'){if(!p)return fail('Player not found',401);const text=String(b.text||'').trim().slice(0,400);if(!text)return fail('Empty message');room.chat.push({id:crypto.randomUUID(),playerId:p.id,name:p.name,text,at:now()});broadcast(room);return jsonResponse({ok:true})}
  if(u.pathname==='/api/voiceSignal'&&request.method==='POST'){if(!p)return fail('Player not found',401);const target=room.players.get(String(b.targetId||''));if(!target||target.id===p.id)return fail('Invalid voice target');const signal=b.signal||{};if(!['offer','answer','candidate','leave'].includes(signal.type))return fail('Invalid voice signal');sendVoiceSignal(room,target.id,{from:p.id,signal});return jsonResponse({ok:true})}
  if(u.pathname==='/api/react'&&request.method==='POST'){if(!p)return fail('Player not found',401);const reactionId=crypto.randomUUID();room.reaction={id:reactionId,playerId:p.id,emoji:String(b.emoji||'').slice(0,8),at:now()};broadcast(room);setTimeout(()=>{if(room.reaction?.id===reactionId){room.reaction=null;broadcast(room)}},1600);return jsonResponse({ok:true})}
  return fail('Unknown API route',404);
}

export class GameHub {
  constructor(ctx,env){this.ctx=ctx;this.env=env;activeHub=this;this.ready=this.loadRooms()}
  async loadRooms(){const stored=await this.ctx.storage.list({prefix:'room:'});for(const [key,raw] of stored){const id=key.slice(5);if(!rooms.has(id))rooms.set(id,restoreRoom(raw))}}
  async getRoom(id){if(!id)return null;await this.ready;if(rooms.has(id))return rooms.get(id);const raw=await this.ctx.storage.get(`room:${id}`);if(!raw)return null;const room=restoreRoom(raw);rooms.set(id,room);return room}
  persistRoom(room){const data=serializeRoom(room);this.ctx.waitUntil(this.ctx.storage.put(`room:${room.id}`,data))}
  async fetch(request){activeHub=this;await this.ready;try{return await handleApi(request)}catch(err){console.error(err);return jsonResponse({error:err?.message||'Server error'},500)}}
}

export default {
  async fetch(request,env){
    const url=new URL(request.url);
    if(url.pathname==='/healthz'||url.pathname.startsWith('/api/')){
      const id=env.GAME_HUB.idFromName('black-family-game-night');
      return env.GAME_HUB.get(id).fetch(request);
    }
    return env.ASSETS.fetch(request);
  }
};
