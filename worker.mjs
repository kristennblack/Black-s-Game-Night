import { PropHuntRoom } from './propHuntRoom.mjs';
import { IslandLifeRoom } from './islandLifeRoom.mjs';
export { PropHuntRoom, IslandLifeRoom };
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
import { COSMETIC_BY_ID as ARCADE_COSMETICS, COSMETIC_SLOTS, normalizeEquipped as normalizeEquippedCosmetics } from './public/avatar-cosmetics.mjs';
import { CABIN_ROOM_ITEM_BY_ID } from './public/cabin-room-catalog.mjs';
import { normalizeCabinBlueprints, cabinItemPurchasable } from './public/cabin-progression.mjs';

const rooms = new Map();
let activeHub = null;
const encoder = new TextEncoder();

const safeId=(n=8)=>crypto.randomBytes(12).toString('base64url').replace(/[^A-Z0-9]/gi,'').slice(0,n).toUpperCase();
const token=()=>crypto.randomBytes(18).toString('base64url');
const now=()=>Date.now();
const gameName=t=>isExtraGame(t)?extraName(t):t===GAME_TYPES.FUCK?'Fuck Your Buddy':t===GAME_TYPES.SMEAR?'Smear':'Screw Your Buddy';
const maxSeatsFor=t=>isExtraGame(t)?extraMaxSeats(t):t===GAME_TYPES.SMEAR?4:t===GAME_TYPES.FUCK?56:52;
const jsonResponse=(data,status=200)=>new Response(JSON.stringify(data),{status,headers:{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store'}});
const namedAvatarKeys={
  'john black':'john','john':'john','dorothy':'dorothy','james':'james','elizabeth':'elizabeth','holly':'holly','vanessa':'vanessa','logan':'logan',
  'papa':'papa','nana':'nana','kristen':'kristen','molly':'molly','kelsi':'kelsi','gunner':'gunner'
};
const defaultAvatarForName=name=>namedAvatarKeys[String(name||'').trim().toLowerCase()]||'cowboy';
const defaultVariantForName=name=>defaultAvatarForName(name)==='john'?1:0;
const BOT_DIFFICULTIES=new Set(['easy','medium','hard']);
const BOT_PERSONAS=[
  ['John','john'],['Kristen','kristen'],['Holly','holly'],['Elizabeth','elizabeth'],['Vanessa','vanessa'],['Logan','logan'],['James','james'],['Dorothy','dorothy'],['Nana','nana'],['Papa','papa'],['Kelsi','kelsi'],['Molly','molly'],['Gunner','gunner']
];
const BOT_COLORS=['#9b3e3a','#305c9b','#2f6b4f','#95752a','#6c468f','#287878','#b5672f','#8b6d55','#171717','#a86d7b','#82b978','#83afe2','#e2bf54'];
const normalizeDifficulty=d=>BOT_DIFFICULTIES.has(String(d||'').toLowerCase())?String(d).toLowerCase():'easy';
const requestCategories=new Set(['New Game','Fix a Game','Improvement','Bug','Other']);

const profileIdFrom=b=>String(b?.profileId||'').trim().slice(0,80)||null;
const playerProfile=(b,nameFallback='Player')=>({profileId:profileIdFrom(b),name:String(b?.name||nameFallback).trim().slice(0,24)||nameFallback,avatar:String(b?.avatar||'').trim()||defaultAvatarForName(b?.name||nameFallback),variant:Number(b?.variant??defaultVariantForName(b?.name||nameFallback)),outfitVariant:Number(b?.outfitVariant||0),color:String(b?.color||'#2f6b4f'),equippedCosmetics:normalizeEquippedCosmetics(b?.equippedCosmetics)});
function freshGameState(){return {phase:'lobby',roundIndex:-1,schedule:[],handSize:0,dealerId:null,dealerCeremony:null,biddingOrder:[],bidTurnId:null,bidActionCount:0,highBid:null,highBidderId:null,contract:null,fourAndOut:false,biddingTeam:null,teamScores:{A:0,B:0},trump:null,trumpPlays:[],capturedByTeam:{A:[],B:[]},smearAwards:null,gameValues:null,turnPlayerId:null,leaderId:null,currentTrick:[],lastTrick:null,roundResults:null,winnerIds:[],history:[],extra:null,matchId:null,resultRecorded:false};}

function playerOrder(room){return [...room.players.values()].filter(p=>p.seat!=null).sort((a,b)=>a.seat-b.seat).map(p=>p.id)}
function assignOpenSeat(room,p){if(p.seat!=null)return p.seat;const used=new Set([...room.players.values()].filter(x=>x.id!==p.id&&x.seat!=null).map(x=>x.seat));for(let i=0;i<room.maxSeats;i++)if(!used.has(i)){p.seat=i;return i}return null}
function assignOpenSeats(room){for(const p of room.players.values())if(p.seat==null&&assignOpenSeat(room,p)==null)throw new Error('No open seats remain')}
function player(room,playerToken){return [...room.players.values()].find(p=>p.token===playerToken)}
function host(room,hostToken){return !!hostToken&&room.hostToken===hostToken}
function currentRound(room){return room.game.roundIndex>=0?room.game.schedule[room.game.roundIndex]||null:null}

function publicState(room,viewerToken=null){
  const viewer=player(room,viewerToken);const g=room.game;const round=currentRound(room);
  const visiblePlayers=[...room.players.values()].sort((a,b)=>(a.seat??9999)-(b.seat??9999)||a.name.localeCompare(b.name));
  const players=visiblePlayers.map(p=>({id:p.id,name:p.name,avatar:p.avatar,variant:p.variant,outfitVariant:p.outfitVariant??0,color:p.color,equippedCosmetics:normalizeEquippedCosmetics(p.equippedCosmetics),seat:p.seat,team:p.seat==null?null:teamForSeat(p.seat),ready:p.ready,connected:p.connected,bid:p.bid,tricks:p.tricks,score:p.score,continued:p.continued,handCount:p.hand.length,eliminated:!!p.eliminated,spectating:!!p.spectating,isHost:p.id===room.hostPlayerId,isBot:!!p.isBot,botDifficulty:p.isBot?normalizeDifficulty(p.botDifficulty):null}));
  const legal=!isExtraGame(room.gameType)&&viewer&&g.phase==='playing'&&g.turnPlayerId===viewer.id?[...legalCardIds(viewer.hand,g.currentTrick,room.gameType)]:[];
  const forbidden=!isExtraGame(room.gameType)&&room.gameType!==GAME_TYPES.SMEAR&&viewer&&g.phase==='bidding'&&g.bidTurnId===viewer.id&&viewer.id===g.dealerId
    ?forbiddenDealerBid(g.handSize,g.biddingOrder.filter(id=>id!==g.dealerId).map(id=>room.players.get(id).bid??0)):null;
  return {
    id:room.id,createdAt:room.createdAt,revision:room.revision||0,phase:g.phase,gameType:room.gameType,gameName:gameName(room.gameType),settings:room.settings,
    players,maxSeats:room.maxSeats,viewerId:viewer?.id||null,hostPlayerId:room.hostPlayerId,
    game:{phase:g.phase,matchId:g.matchId||null,roundIndex:g.roundIndex,roundNumber:g.roundIndex+1,totalRounds:room.gameType===GAME_TYPES.SMEAR?null:g.schedule.length,handSize:g.handSize,trump:(room.gameType===GAME_TYPES.SMEAR?g.trump:round?.trump)||null,powerRank:round?.powerRank||null,schedule:g.schedule,dealerId:g.dealerId,dealerCeremony:g.dealerCeremony,biddingOrder:g.biddingOrder,bidTurnId:g.bidTurnId,turnPlayerId:g.turnPlayerId,leaderId:g.leaderId,currentTrick:g.currentTrick,lastTrick:g.lastTrick,roundResults:g.roundResults,winnerIds:g.winnerIds,history:g.history,legalCardIds:legal,hand:viewer?viewer.hand:[],forbiddenBid:forbidden,teamScores:g.teamScores||null,highBid:g.highBid??null,highBidderId:g.highBidderId||null,contract:g.contract??null,fourAndOut:!!g.fourAndOut,biddingTeam:g.biddingTeam||null,smearAwards:g.smearAwards||null,gameValues:g.gameValues||null,extra:isExtraGame(room.gameType)&&g.extra?extraPublicState(room,viewer):null},
    chat:room.chat.slice(-80),reaction:room.reaction
  };
}

function serializeRoom(room){return {...room,subscribers:undefined,reaction:null,players:[...room.players.values()].map(p=>({...p,connected:p.isBot?true:false}))}}
function restoreRoom(raw){
  const gameType=raw.gameType||GAME_TYPES.SCREW;
  const restored={...raw,revision:Number(raw.revision||0),gameType,settings:{roundCount:10,...extraDefaults(gameType),...raw.settings},maxSeats:raw.maxSeats||maxSeatsFor(gameType),subscribers:new Set(),reaction:null,players:new Map((raw.players||[]).map(p=>[p.id,{...p,connected:p.isBot?true:false}]))};
  restored.game={...freshGameState(),...restored.game};
  if(!restored.game.schedule.length&&restored.game.handSizes?.length){restored.game.schedule=restored.game.handSizes.map((handSize,i)=>({handSize,trump:['hearts','clubs','diamonds','spades','none'][i%5],powerRank:null,source:null}))}
  return restored;
}
function persistRoom(room){activeHub?.persistRoom(room)}
function writeEvent(sub,type,payload){try{sub.controller.enqueue(encoder.encode(`event: ${type}\ndata: ${JSON.stringify(payload)}\n\n`));return true}catch{return false}}
function broadcast(room){room.revision=(room.revision||0)+1;persistRoom(room);if(room.game?.phase==='gameOver')activeHub?.maybeRecordCompletedMatch(room);for(const sub of [...room.subscribers]){if(!writeEvent(sub,'state',publicState(room,sub.token)))room.subscribers.delete(sub)}}
function sendVoiceSignal(room,targetId,payload){for(const sub of [...room.subscribers]){const target=player(room,sub.token);if(target?.id!==targetId)continue;if(!writeEvent(sub,'voice',payload))room.subscribers.delete(sub)}}

function newRoom(hostName='Host',gameType=GAME_TYPES.SCREW,profile={}){
  if(!Object.values(GAME_TYPES).includes(gameType))gameType=GAME_TYPES.SCREW;
  const id=safeId(),hostToken=token(),pToken=token(),pId=crypto.randomUUID(),pf=playerProfile({...profile,name:hostName},hostName);
  const room={id,revision:0,gameType,settings:{roundCount:10,...extraDefaults(gameType)},hostToken,hostPlayerId:pId,createdAt:now(),maxSeats:maxSeatsFor(gameType),subscribers:new Set(),chat:[],reaction:null,players:new Map([[pId,{id:pId,token:pToken,...pf,seat:null,ready:false,connected:true,bid:null,tricks:0,score:0,continued:false,hand:[],eliminated:false,spectating:false,isBot:false,botDifficulty:null}]]),game:freshGameState()};
  rooms.set(id,room);persistRoom(room);return {room,hostToken,playerToken:pToken};
}

function switchRoomGame(room,gameType){
  if(!Object.values(GAME_TYPES).includes(gameType))throw new Error('Unknown game');
  const max=maxSeatsFor(gameType);if(room.players.size>max)throw new Error(`${gameName(gameType)} supports a maximum of ${max} players`);
  room.gameType=gameType;room.settings={roundCount:10,...extraDefaults(gameType)};room.maxSeats=max;
  for(const p of room.players.values()){p.seat=null;p.ready=false;p.bid=null;p.tricks=0;p.score=0;p.continued=false;p.hand=[];p.eliminated=false;p.spectating=false}
  room.game=freshGameState();
  room.chat.push({id:crypto.randomUUID(),playerId:'system',name:'Game Lodge',text:`Host moved the group to ${gameName(gameType)}.`,at:now()});
}

function botPersonaForAvatar(avatar){return BOT_PERSONAS.find(([,key])=>key===String(avatar||'').toLowerCase())||null}
function uniqueBotName(room,baseName,ignoreId=null){
  const used=new Set([...room.players.values()].filter(p=>p.id!==ignoreId).map(p=>p.name));
  if(!used.has(baseName))return baseName;
  if(!used.has(`${baseName} Computer`))return `${baseName} Computer`;
  let n=2;while(used.has(`${baseName} Computer ${n}`))n++;return `${baseName} Computer ${n}`;
}
function makeBot(room,difficulty='easy',requestedAvatar=null){
  if(room.players.size>=room.maxSeats)throw new Error('Room is full');
  let persona=botPersonaForAvatar(requestedAvatar);
  if(!persona){const used=new Set([...room.players.values()].map(p=>p.avatar));persona=BOT_PERSONAS.find(([,avatar])=>!used.has(avatar))||BOT_PERSONAS[room.players.size%BOT_PERSONAS.length]}
  const [baseName,avatar]=persona,diff=normalizeDifficulty(difficulty),id=crypto.randomUUID(),name=uniqueBotName(room,baseName);
  const bot={id,token:null,profileId:null,name,avatar,variant:avatar==='john'?1:0,outfitVariant:0,color:BOT_COLORS[room.players.size%BOT_COLORS.length],seat:null,ready:true,connected:true,bid:null,tricks:0,score:0,continued:false,hand:[],eliminated:false,isBot:true,botDifficulty:diff};
  if(assignOpenSeat(room,bot)==null)throw new Error('No open seat available');
  room.players.set(id,bot);
  room.chat.push({id:crypto.randomUUID(),playerId:'system',name:'Game Lodge',text:`${name} joined as a ${diff} computer player using ${baseName}.`,at:now()});
  return bot;
}
function updateBot(room,targetId,{difficulty,avatar}={}){
  const bot=room.players.get(String(targetId||''));if(!bot||!bot.isBot)throw new Error('Computer player not found');
  if(difficulty!=null)bot.botDifficulty=normalizeDifficulty(difficulty);
  if(avatar!=null){const persona=botPersonaForAvatar(avatar);if(!persona)throw new Error('Unknown computer character');const [baseName,key]=persona;bot.avatar=key;bot.variant=key==='john'?1:0;bot.outfitVariant=0;bot.name=uniqueBotName(room,baseName,bot.id)}
  bot.ready=true;return bot;
}
function cardRankScore(c){
  if(c?.joker==='high')return 30;if(c?.joker==='low')return 1;
  return ({A:14,K:13,Q:12,J:11,'10':10,'9':9,'8':8,'7':7,'6':6,'5':5,'4':4,'3':3,'2':2}[c?.rank]||0);
}
function chooseBotBid(room,p){
  const d=normalizeDifficulty(p.botDifficulty),g=room.game;
  if(room.gameType===GAME_TYPES.SMEAR){
    const allowed=['pass','1','2','3','4','4out'].filter(x=>x==='pass'||smearBidValue(x)>smearBidValue(g.highBid));
    if(!allowed.length)return'pass';
    if(d==='easy')return allowed[Math.floor(Math.random()*allowed.length)];
    const trumpCounts={hearts:0,clubs:0,diamonds:0,spades:0};for(const c of p.hand)if(trumpCounts[c.suit]!=null)trumpCounts[c.suit]++;
    const best=Math.max(0,...Object.values(trumpCounts));const target=d==='hard'?Math.min(4,Math.max(1,best-1)):Math.min(3,Math.max(1,best-2));
    const pick=allowed.filter(x=>x!=='pass'&&x!=='4out'&&Number(x)<=target).at(-1);return pick||'pass';
  }
  let strength=p.hand.reduce((n,c)=>n+(cardRankScore(c)>=12?1:cardRankScore(c)>=10?.45:.1),0);
  let bid=d==='easy'?Math.floor(Math.random()*(g.handSize+1)):Math.round(strength*(d==='hard'?.72:.58));
  bid=Math.max(0,Math.min(g.handSize,bid));
  if(p.id===g.dealerId){const before=g.biddingOrder.filter(id=>id!==g.dealerId).map(id=>room.players.get(id).bid??0),forbidden=forbiddenDealerBid(g.handSize,before);if(bid===forbidden)bid=bid<g.handSize?bid+1:Math.max(0,bid-1)}
  return bid;
}
function applyStandardBid(room,p,bid){
  const g=room.game;if(g.phase!=='bidding'||g.bidTurnId!==p.id)throw new Error('Not your bid');
  if(room.gameType===GAME_TYPES.SMEAR){
    bid=String(bid);if(!['pass','1','2','3','4','4out'].includes(bid))throw new Error('Invalid Smear bid');const value=smearBidValue(bid);if(bid!=='pass'&&value<=smearBidValue(g.highBid))throw new Error('You must bid higher than the current bid');p.bid=bid;g.bidActionCount++;if(bid!=='pass'){g.highBid=bid;g.highBidderId=p.id}
    const idx=g.biddingOrder.indexOf(p.id),immediate=bid==='4out',circuitDone=idx===g.biddingOrder.length-1;
    if(immediate||(circuitDone&&g.highBidderId)){g.phase='playing';g.bidTurnId=null;g.leaderId=g.highBidderId;g.turnPlayerId=g.highBidderId;g.contract=g.highBid==='4out'?4:Number(g.highBid);g.fourAndOut=g.highBid==='4out';g.biddingTeam=teamForSeat(room.players.get(g.highBidderId).seat)}else if(circuitDone){for(const id of g.biddingOrder)room.players.get(id).bid=null;g.bidActionCount=0;g.bidTurnId=g.biddingOrder[0]}else g.bidTurnId=g.biddingOrder[idx+1];return;
  }
  bid=Number(bid);if(!Number.isInteger(bid)||bid<0||bid>g.handSize)throw new Error('Invalid bid');if(p.id===g.dealerId){const before=g.biddingOrder.filter(id=>id!==g.dealerId).map(id=>room.players.get(id).bid??0);if(forbiddenDealerBid(g.handSize,before)===bid)throw new Error('That bid would make total bids equal the hand size')}
  p.bid=bid;const idx=g.biddingOrder.indexOf(p.id);if(idx===g.biddingOrder.length-1){g.phase='playing';g.bidTurnId=null;g.turnPlayerId=g.leaderId}else g.bidTurnId=g.biddingOrder[idx+1];
}
function chooseBotCard(room,p){
  const legal=[...legalCardIds(p.hand,room.game.currentTrick,room.gameType)].map(id=>p.hand.find(c=>c.id===id)).filter(Boolean),d=normalizeDifficulty(p.botDifficulty);if(!legal.length)return null;
  if(d==='easy')return legal[Math.floor(Math.random()*legal.length)];
  const sorted=[...legal].sort((a,b)=>cardRankScore(a)-cardRankScore(b));
  if(d==='medium')return sorted[0];
  const g=room.game,round=currentRound(room),trump=room.gameType===GAME_TYPES.SMEAR?g.trump:round?.trump;
  const trumpCards=sorted.filter(c=>c.suit===trump);if(trumpCards.length&&g.currentTrick.length)return trumpCards[0];
  return sorted.at(-1);
}
function applyStandardPlay(room,p,cardId){
  const g=room.game;if(g.phase!=='playing'||g.turnPlayerId!==p.id)throw new Error('Not your turn');const played=p.hand.find(c=>c.id===cardId);if(!played)throw new Error('Card not in hand');if(!legalCardIds(p.hand,g.currentTrick,room.gameType).has(played.id))throw new Error('You must follow suit');
  if(room.gameType===GAME_TYPES.SMEAR&&!g.trump){g.trump=played.suit;g.schedule[g.roundIndex].trump=played.suit}p.hand=p.hand.filter(c=>c.id!==played.id);g.currentTrick.push({playerId:p.id,card:played});if(room.gameType===GAME_TYPES.SMEAR&&played.suit===g.trump)g.trumpPlays.push({playerId:p.id,team:teamForSeat(p.seat),card:played});const order=playerOrder(room);
  if(g.currentTrick.length===order.length){const round=currentRound(room),trump=room.gameType===GAME_TYPES.SMEAR?g.trump:round.trump,winner=trickWinnerForGame(room.gameType,g.currentTrick,trump,g.handSize);room.players.get(winner).tricks++;if(room.gameType===GAME_TYPES.SMEAR){const winningTeam=teamForSeat(room.players.get(winner).seat);g.capturedByTeam[winningTeam].push(...g.currentTrick.map(x=>x.card))}g.lastTrick={winnerId:winner,cards:g.currentTrick,at:now()};g.turnPlayerId=null;return{trickComplete:true,winner,order};}
  g.turnPlayerId=nextClockwise(order,p.id);return{trickComplete:false,order};
}
function scheduleTrickAdvance(room,result){if(!result?.trickComplete)return;setTimeout(()=>{const g=room.game;if(g.phase!=='playing')return;g.currentTrick=[];if(result.order.every(id=>room.players.get(id).hand.length===0))finishRound(room);else{g.leaderId=result.winner;g.turnPlayerId=result.winner;broadcast(room)}},700)}
function botActionScore(a,diff,room=null,p=null){
  const text=`${a.action||''} ${a.label||''}`.toLowerCase();let score=Math.random()*2;
  if(/win|home|finish|stronghold|build camp|build route|sweep|last log|lay|claim/.test(text))score+=diff==='hard'?10:4;
  if(/draw|roll|continue|end turn|discard/.test(text))score+=2;
  if(/fold|decline/.test(text))score-=diff==='hard'?3:0;
  if(/raise|bid|call|trade/.test(text))score+=diff==='hard'?2:0;
  if(room?.gameType===GAME_TYPES.BLACK_GAMMON){const q=a.args||{},hard=diff==='hard';if(a.action==='blackMove'){if(q.to==='off')score+=hard?22:10;if(q.rescue)score+=hard?18:8;if(q.hit)score+=hard?14:7;if(q.entry)score+=hard?9:4;score+=Math.max(0,Number(q.count||1)-1)*(hard?3:1.5);if(q.direction==='forward')score+=hard?2:1}if(a.action==='blackAllocate'&&p){const name=String(p.name||'').toLowerCase();if(text.includes(`${name}: triple`))score+=hard?12:6;if(text.includes(`${name}:`)&&text.includes('forward'))score+=hard?2:1;if(text.includes('backward'))score+=hard?1.5:.5}}
  return score;
}
function chooseExtraBotAction(room,p,actions){const d=normalizeDifficulty(p.botDifficulty);if(!actions?.length)return null;if(d==='easy')return actions[Math.floor(Math.random()*actions.length)];return [...actions].sort((a,b)=>botActionScore(b,d,room,p)-botActionScore(a,d,room,p))[0]}
function tickBot(room){
  const g=room.game;if(g.phase==='lobby'||g.phase==='gameOver')return false;
  if(isExtraGame(room.gameType)){
    for(const id of playerOrder(room)){const p=room.players.get(id);if(!p?.isBot)continue;const view=extraPublicState(room,p),actions=view?.actions||[];if(!actions.length)continue;const a=chooseExtraBotAction(room,p,actions);if(!a)continue;extraGameAction(room,p,{action:a.action,args:a.args||{}});return true;}return false;
  }
  if(g.phase==='roundResults'){const p=playerOrder(room).map(id=>room.players.get(id)).find(x=>x?.isBot&&!x.continued);if(!p)return false;p.continued=true;if(playerOrder(room).every(id=>room.players.get(id).continued)){beginNextRound(room);return'advanced'}return true;}
  if(g.phase==='bidding'){const p=room.players.get(g.bidTurnId);if(!p?.isBot)return false;applyStandardBid(room,p,chooseBotBid(room,p));return true;}
  if(g.phase==='playing'){const p=room.players.get(g.turnPlayerId);if(!p?.isBot)return false;const c=chooseBotCard(room,p);if(!c)return false;const r=applyStandardPlay(room,p,c.id);return r;}
  return false;
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
function startRoomMatch(room,{rematch=false}={}){
  const joined=[...room.players.values()];
  if(rematch){for(const p of joined){p.ready=true;p.bid=null;p.tricks=0;p.score=0;p.continued=false;p.hand=[];p.eliminated=false;p.spectating=false}room.game=freshGameState()}
  else if(joined.some(x=>!x.ready))throw new Error('Everyone must be Ready');
  assignOpenSeats(room);room.game.matchId=crypto.randomUUID();room.game.resultRecorded=false;
  if(isExtraGame(room.gameType)){startExtraGame(room);broadcast(room);return}
  if(room.gameType===GAME_TYPES.SMEAR&&joined.length!==4)throw new Error('Smear requires exactly 4 players');if(room.gameType!==GAME_TYPES.SMEAR&&joined.length<2)throw new Error('Need at least 2 players');const order=playerOrder(room);
  room.game.schedule=room.gameType===GAME_TYPES.SMEAR?[{handSize:6,trump:null,powerRank:null,source:null}]:room.gameType===GAME_TYPES.FUCK?generateFuckSchedule(room.settings.roundCount,order.length):buildScrewSchedule(order.length);for(const id of order){room.players.get(id).score=0}
  if(room.gameType===GAME_TYPES.SMEAR){room.game.teamScores={A:0,B:0};const dealerId=randomDealer(order);room.game.dealerId=dealerId;room.game.dealerCeremony={type:'random',dealerId,sequence:[],createdAt:now()}}else{const ceremony=firstDealerCeremony(order,room.gameType);room.game.dealerId=ceremony.dealerId;room.game.dealerCeremony={type:'jack',...ceremony,createdAt:now()}}startRound(room,0)
}

async function parseBody(request){try{return await request.json()}catch{return {}}}

async function handleApi(request){
  const u=new URL(request.url);
  if(u.pathname==='/healthz')return jsonResponse({ok:true,rooms:rooms.size,persistence:true});
  if(u.pathname==='/api/create'&&request.method==='POST'){const b=await parseBody(request),{room,hostToken,playerToken}=newRoom((b.name||'Host').slice(0,24),b.gameType,b);return jsonResponse({roomId:room.id,hostToken,playerToken,gameType:room.gameType})}
  if(u.pathname==='/api/leaderboard'&&request.method==='POST')return jsonResponse(await activeHub.getLeaderboard());
  if(u.pathname==='/api/requests'&&request.method==='POST'){const b=await parseBody(request);if(b.action==='submit'){try{return jsonResponse({ok:true,request:await activeHub.addRequest(b)})}catch(err){return jsonResponse({error:err.message},400)}}return jsonResponse({requests:await activeHub.getRequests()})}
  if(u.pathname==='/api/arcade/profile'&&request.method==='GET'){const profileId=u.searchParams.get('profileId');return jsonResponse({profile:await activeHub.getArcadeProfile(profileId),familyWeekPlays:await activeHub.getFamilyWeekPlays()})}
  if(u.pathname==='/api/arcade/record'&&request.method==='POST'){const b=await parseBody(request);try{return jsonResponse({ok:true,profile:await activeHub.recordArcade(b)})}catch(err){return jsonResponse({error:err.message},400)}}
  if(u.pathname==='/api/arcade/cosmetic'&&request.method==='POST'){const b=await parseBody(request);try{return jsonResponse({ok:true,profile:await activeHub.updateArcadeCosmetic(b)})}catch(err){return jsonResponse({error:err.message},400)}}
  if(u.pathname==='/api/cabin/item'&&request.method==='POST'){const b=await parseBody(request);try{return jsonResponse({ok:true,profile:await activeHub.updateCabinBlueprint(b)})}catch(err){return jsonResponse({error:err.message},400)}}
  if(u.pathname==='/api/cabin/overview'&&request.method==='GET')return jsonResponse({rooms:await activeHub.getCabinOverview()});
  if(u.pathname==='/api/cabin/room'&&request.method==='GET'){const roomKey=u.searchParams.get('roomKey');return jsonResponse({room:await activeHub.getCabinRoom(roomKey)});}
  if(u.pathname==='/api/cabin/room'&&request.method==='POST'){const b=await parseBody(request);try{return jsonResponse({ok:true,room:await activeHub.updateCabinRoom(b)})}catch(err){return jsonResponse({error:err.message},400)}}
  if(u.pathname==='/api/presence'&&request.method==='GET')return jsonResponse({presence:await activeHub.getPresence()});
  if(u.pathname==='/api/presence'&&request.method==='POST'){const b=await parseBody(request);try{return jsonResponse({ok:true,presence:await activeHub.updatePresence(b)})}catch(err){return jsonResponse({error:err.message},400)}}
  if(u.pathname==='/api/join-request'&&request.method==='POST'){const b=await parseBody(request);try{return jsonResponse(await activeHub.handleJoinRequest(b))}catch(err){return jsonResponse({error:err.message},400)}}
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
    const id=crypto.randomUUID(),t=token(),pf=playerProfile(b,'Player');room.players.set(id,{id,token:t,...pf,seat:null,ready:false,connected:true,bid:null,tricks:0,score:0,continued:false,hand:[],eliminated:false,spectating:false,isBot:false,botDifficulty:null});broadcast(room);return jsonResponse({playerToken:t,playerId:id,gameType:room.gameType});
  }
  if(!u.pathname.startsWith('/api/'))return jsonResponse({error:'Unknown route'},404);
  const b=await parseBody(request),room=await activeHub.getRoom(b.roomId);if(!room)return jsonResponse({error:'Room not found'},404);const p=player(room,b.playerToken);const fail=(msg,code=400)=>jsonResponse({error:msg},code);
  if(u.pathname==='/api/profile'&&request.method==='POST'){if(!p)return fail('Player not found',401);if(room.game.phase!=='lobby')return fail('Profile locked after start');p.name=(b.name||p.name).slice(0,24);if(profileIdFrom(b))p.profileId=profileIdFrom(b);p.avatar=b.avatar||p.avatar;p.variant=Number(b.variant??p.variant);p.outfitVariant=Number(b.outfitVariant??p.outfitVariant??0);p.color=b.color||p.color;p.equippedCosmetics=normalizeEquippedCosmetics(b.equippedCosmetics??p.equippedCosmetics);p.ready=false;broadcast(room);return jsonResponse({ok:true})}
  if(u.pathname==='/api/seat'&&request.method==='POST'){if(!p)return fail('Player not found',401);if(room.game.phase!=='lobby')return fail('Seats are locked');const seat=Number(b.seat);if(!Number.isInteger(seat)||seat<0||seat>=room.maxSeats)return fail('Invalid seat');if([...room.players.values()].some(x=>x.id!==p.id&&x.seat===seat))return fail('Seat occupied');p.seat=seat;p.ready=false;broadcast(room);return jsonResponse({ok:true})}
  if(u.pathname==='/api/removePlayer'&&request.method==='POST'){if(!host(room,b.hostToken))return fail('Host only',403);if(room.game.phase!=='lobby')return fail('Players can only be removed before the game starts');const target=room.players.get(String(b.targetId||''));if(!target)return fail('Player not found');if(target.id===room.hostPlayerId)return fail('The host cannot remove themselves');room.players.delete(target.id);broadcast(room);return jsonResponse({ok:true})}
  if(u.pathname==='/api/addBot'&&request.method==='POST'){if(!host(room,b.hostToken))return fail('Host only',403);if(room.game.phase!=='lobby')return fail('Computers can only be added before the game starts');try{const bot=makeBot(room,b.difficulty,b.avatar);broadcast(room);return jsonResponse({ok:true,playerId:bot.id,difficulty:bot.botDifficulty,avatar:bot.avatar})}catch(err){return fail(err.message)}}
  if(u.pathname==='/api/updateBot'&&request.method==='POST'){if(!host(room,b.hostToken))return fail('Host only',403);if(room.game.phase!=='lobby')return fail('Computers can only be changed before the game starts');try{const bot=updateBot(room,b.targetId,{difficulty:b.difficulty,avatar:b.avatar});broadcast(room);return jsonResponse({ok:true,playerId:bot.id,difficulty:bot.botDifficulty,avatar:bot.avatar})}catch(err){return fail(err.message)}}
  if(u.pathname==='/api/botTick'&&request.method==='POST'){if(!host(room,b.hostToken))return fail('Host only',403);try{const result=tickBot(room);if(result&&result!=='advanced'){broadcast(room);if(typeof result==='object'&&result.trickComplete)scheduleTrickAdvance(room,result)}return jsonResponse({ok:true,acted:!!result})}catch(err){return fail(err.message)}}
  if(u.pathname==='/api/ready'&&request.method==='POST'){if(!p)return fail('Player not found',401);if(room.game.phase!=='lobby')return fail('Game already started');const ready=!!b.ready;if(ready&&p.seat==null&&assignOpenSeat(room,p)==null)return fail('No open seat available');p.ready=ready;broadcast(room);return jsonResponse({ok:true,seat:p.seat})}
  if(u.pathname==='/api/settings'&&request.method==='POST'){if(!host(room,b.hostToken))return fail('Host only',403);if(room.game.phase!=='lobby')return fail('Settings locked after start');if(isExtraGame(room.gameType)){applyExtraSettings(room,b)}else if(room.gameType===GAME_TYPES.FUCK){const n=Number(b.roundCount);if(!Number.isInteger(n)||n<1||n>100)return fail('Choose 1 to 100 rounds');room.settings.roundCount=n}broadcast(room);return jsonResponse({ok:true})}
  if(u.pathname==='/api/switchGame'&&request.method==='POST'){if(!host(room,b.hostToken))return fail('Host only',403);try{switchRoomGame(room,String(b.gameType||''));broadcast(room);return jsonResponse({ok:true,gameType:room.gameType})}catch(err){return fail(err.message)}}
  if(u.pathname==='/api/start'&&request.method==='POST'){if(!host(room,b.hostToken))return fail('Host only',403);try{startRoomMatch(room);return jsonResponse({ok:true,matchId:room.game.matchId})}catch(err){return fail(err.message)}}
  if(u.pathname==='/api/rematch'&&request.method==='POST'){if(!host(room,b.hostToken))return fail('Host only',403);if(room.game.phase!=='gameOver')return fail('The match is not finished');try{startRoomMatch(room,{rematch:true});return jsonResponse({ok:true,matchId:room.game.matchId})}catch(err){return fail(err.message)}}
  if(u.pathname==='/api/gameAction'&&request.method==='POST'){if(!p)return fail('Player not found',401);if(!isExtraGame(room.gameType))return fail('This game uses the standard card actions');try{extraGameAction(room,p,b);broadcast(room);return jsonResponse({ok:true})}catch(err){return fail(err.message)}}
  if(u.pathname==='/api/bid'&&request.method==='POST'){if(!p)return fail('Player not found',401);try{applyStandardBid(room,p,b.bid);broadcast(room);return jsonResponse({ok:true})}catch(err){return fail(err.message)}}
  if(u.pathname==='/api/play'&&request.method==='POST'){if(!p)return fail('Player not found',401);try{const result=applyStandardPlay(room,p,b.cardId);broadcast(room);scheduleTrickAdvance(room,result);return jsonResponse({ok:true})}catch(err){return fail(err.message)}}
  if(u.pathname==='/api/continue'&&request.method==='POST'){if(!p)return fail('Player not found',401);if(room.game.phase!=='roundResults')return fail('Not between rounds');p.continued=true;broadcast(room);const order=playerOrder(room);if(order.every(id=>room.players.get(id).continued))beginNextRound(room);return jsonResponse({ok:true})}
  if(u.pathname==='/api/chat'&&request.method==='POST'){if(!p)return fail('Player not found',401);const text=String(b.text||'').trim().slice(0,400);if(!text)return fail('Empty message');room.chat.push({id:crypto.randomUUID(),playerId:p.id,name:p.name,text,at:now()});broadcast(room);return jsonResponse({ok:true})}
  if(u.pathname==='/api/voiceSignal'&&request.method==='POST'){if(!p)return fail('Player not found',401);const target=room.players.get(String(b.targetId||''));if(!target||target.id===p.id)return fail('Invalid voice target');const signal=b.signal||{};if(!['offer','answer','candidate','leave'].includes(signal.type))return fail('Invalid voice signal');sendVoiceSignal(room,target.id,{from:p.id,signal});return jsonResponse({ok:true})}
  if(u.pathname==='/api/react'&&request.method==='POST'){if(!p)return fail('Player not found',401);const reactionId=crypto.randomUUID();room.reaction={id:reactionId,playerId:p.id,emoji:String(b.emoji||'').slice(0,8),at:now()};broadcast(room);setTimeout(()=>{if(room.reaction?.id===reactionId){room.reaction=null;broadcast(room)}},1600);return jsonResponse({ok:true})}
  return fail('Unknown API route',404);
}

export class GameHub {
  constructor(ctx,env){this.ctx=ctx;this.env=env;this.recordingMatches=new Set();activeHub=this;this.ready=this.loadRooms()}
  async loadRooms(){const stored=await this.ctx.storage.list({prefix:'room:'});for(const [key,raw] of stored){const id=key.slice(5);if(!rooms.has(id))rooms.set(id,restoreRoom(raw))}}
  async getRoom(id){if(!id)return null;await this.ready;if(rooms.has(id))return rooms.get(id);const raw=await this.ctx.storage.get(`room:${id}`);if(!raw)return null;const room=restoreRoom(raw);rooms.set(id,room);return room}
  persistRoom(room){const data=serializeRoom(room);this.ctx.waitUntil(this.ctx.storage.put(`room:${room.id}`,data))}
  maybeRecordCompletedMatch(room){const matchId=room.game?.matchId;if(!matchId||room.game?.resultRecorded||this.recordingMatches.has(matchId))return;this.recordingMatches.add(matchId);this.ctx.waitUntil((async()=>{try{const key=`result:${matchId}`;if(await this.ctx.storage.get(key)){room.game.resultRecorded=true;this.persistRoom(room);return}const winners=(room.game.winnerIds||[]).map(id=>room.players.get(id)).filter(p=>p&&!p.isBot);const record={matchId,roomId:room.id,gameType:room.gameType,gameName:gameName(room.gameType),at:now(),winners:winners.map(p=>({profileId:p.profileId||`legacy:${String(p.name).toLowerCase()}`,name:p.name,playerId:p.id})),players:[...room.players.values()].filter(p=>!p.isBot).map(p=>({profileId:p.profileId||`legacy:${String(p.name).toLowerCase()}`,name:p.name,playerId:p.id,score:p.score}))};await this.ctx.storage.put(key,record);const board=await this.getLeaderboard();for(const w of record.winners){const id=w.profileId;let row=board.players[id];if(!row)row=board.players[id]={profileId:id,name:w.name,totalWins:0,games:{},lastWinAt:0};row.name=w.name;row.totalWins++;row.lastWinAt=record.at;const g=row.games[record.gameType]||{gameType:record.gameType,name:record.gameName,wins:0};g.name=record.gameName;g.wins++;row.games[record.gameType]=g}board.recent=[{matchId:record.matchId,gameType:record.gameType,gameName:record.gameName,at:record.at,winners:record.winners.map(w=>w.name)},...(board.recent||[]).filter(x=>x.matchId!==record.matchId)].slice(0,40);await this.ctx.storage.put('leaderboard:v1',board);room.game.resultRecorded=true;this.persistRoom(room)}finally{this.recordingMatches.delete(matchId)}})())}
  async getLeaderboard(){const data=await this.ctx.storage.get('leaderboard:v1');return data&&data.players?data:{players:{},recent:[]}}
  async addRequest(b){const text=String(b.text||'').trim().slice(0,800);if(!text)throw new Error('Please enter a request');const category=requestCategories.has(String(b.category))?String(b.category):'Other',name=String(b.name||'Family player').trim().slice(0,24)||'Family player',entry={id:crypto.randomUUID(),profileId:profileIdFrom(b),name,category,text,at:now(),status:'Requested'};const list=await this.getRequests();list.unshift(entry);await this.ctx.storage.put('requests:v1',list.slice(0,250));return entry}
  async getRequests(){const data=await this.ctx.storage.get('requests:v1');return Array.isArray(data)?data:[]}
  async getArcadeProfile(profileId){const id=String(profileId||'').trim().slice(0,80);if(!id)return null;const p=await this.ctx.storage.get(`arcade-profile:${id}`);return p&&p.profileId?{...p,cosmetics:{...(p.cosmetics||{})},cabinBlueprints:normalizeCabinBlueprints(p.cabinBlueprints),equippedCosmetics:normalizeEquippedCosmetics(p.equippedCosmetics)}:{profileId:id,name:'Family Player',tokens:0,achievements:{},plays:{},records:{},cosmetics:{},cabinBlueprints:normalizeCabinBlueprints({}),equippedCosmetics:normalizeEquippedCosmetics({}),updatedAt:0}}
  async getFamilyWeekPlays(){const d=new Date(),day=(d.getUTCDay()+6)%7,monday=new Date(Date.UTC(d.getUTCFullYear(),d.getUTCMonth(),d.getUTCDate()-day));const key=`family-week:${monday.toISOString().slice(0,10)}`;return Number(await this.ctx.storage.get(key)||0)}
  async recordArcade(b){const id=profileIdFrom(b);if(!id)throw new Error('Missing profile id');const gameId=String(b.gameId||'arcade').slice(0,80),type=String(b.type||'play').slice(0,30);let p=await this.getArcadeProfile(id);p={...p,name:String(b.name||p.name||'Family Player').slice(0,24),achievements:{...(p.achievements||{})},plays:{...(p.plays||{})},records:{...(p.records||{})},cosmetics:{...(p.cosmetics||{})},cabinBlueprints:normalizeCabinBlueprints(p.cabinBlueprints)};if(type==='play'){p.plays[gameId]=Number(p.plays[gameId]||0)+1;const d=new Date(),day=(d.getUTCDay()+6)%7,monday=new Date(Date.UTC(d.getUTCFullYear(),d.getUTCMonth(),d.getUTCDate()-day)),wk=`family-week:${monday.toISOString().slice(0,10)}`;const total=Number(await this.ctx.storage.get(wk)||0)+1;await this.ctx.storage.put(wk,total)}if(Number.isFinite(Number(b.score))){const r=p.records[gameId]||{};r.highScore=Math.max(Number(r.highScore||0),Number(b.score));r.lastAt=now();p.records[gameId]=r}let rewardAllowed=true;if(b.achievement){const aid=String(b.achievement).slice(0,120);if(p.achievements[aid])rewardAllowed=false;else p.achievements[aid]={label:String(b.label||aid).slice(0,120),at:now()}}const requestedDelta=Math.max(-500,Math.min(500,Number(b.tokenDelta||0))),delta=rewardAllowed?requestedDelta:0;p.tokens=Math.max(0,Number(p.tokens||0)+delta);p.updatedAt=now();await this.ctx.storage.put(`arcade-profile:${id}`,p);return p}
  async updateArcadeCosmetic(b){
    const id=profileIdFrom(b);if(!id)throw new Error('Missing profile id');const action=String(b.action||'equip'),itemId=String(b.itemId||''),item=ARCADE_COSMETICS[itemId]||null;let p=await this.getArcadeProfile(id);p={...p,name:String(b.name||p.name||'Family Player').slice(0,24),cosmetics:{...(p.cosmetics||{})},equippedCosmetics:normalizeEquippedCosmetics(p.equippedCosmetics)};
    if(action==='buy'){if(!item)throw new Error('Unknown cosmetic');if(item.source&&item.source!=='token')throw new Error('This cosmetic is earned through play or an event');if(!p.cosmetics[itemId]){if(Number(p.tokens||0)<item.price)throw new Error(`Need ${item.price} Game Night Tokens`);p.tokens=Number(p.tokens||0)-item.price;p.cosmetics[itemId]={unlockedAt:now(),slot:item.slot}}}
    else if(action==='equip'){if(!item)throw new Error('Unknown cosmetic');if(!p.cosmetics[itemId])throw new Error('Unlock this cosmetic first');p.equippedCosmetics[item.slot]=itemId}
    else if(action==='unequip'){const slot=String(b.slot||'');if(!COSMETIC_SLOTS.includes(slot))throw new Error('Unknown cosmetic slot');p.equippedCosmetics[slot]=null}
    else if(action==='grant'&&b.rewardKey){if(!item)throw new Error('Unknown cosmetic');p.cosmetics[itemId]=p.cosmetics[itemId]||{unlockedAt:now(),slot:item.slot,rewardKey:String(b.rewardKey).slice(0,120)}}
    else throw new Error('Unknown cosmetic action');
    p.updatedAt=now();await this.ctx.storage.put(`arcade-profile:${id}`,p);return p;
  }
  async updateCabinBlueprint(b){
    const id=profileIdFrom(b);if(!id)throw new Error('Missing profile id');const action=String(b.action||'buy'),itemId=String(b.itemId||''),item=CABIN_ROOM_ITEM_BY_ID[itemId]||null;let p=await this.getArcadeProfile(id);p={...p,name:String(b.name||p.name||'Family Player').slice(0,24),cabinBlueprints:normalizeCabinBlueprints(p.cabinBlueprints)};
    if(!item)throw new Error('Unknown cabin item');
    if(action==='buy'){
      if(!cabinItemPurchasable(item))throw new Error('This cabin item is earned through play, an achievement, an event, or discovery');
      if(!p.cabinBlueprints[itemId]){const price=Math.max(0,Number(item['Token Price'])||0);if(Number(p.tokens||0)<price)throw new Error(`Need ${price} Game Night Tokens`);p.tokens=Number(p.tokens||0)-price;p.cabinBlueprints[itemId]={unlockedAt:now(),source:'tokens'};}
    }else if(action==='grant'){
      if(!b.rewardKey)throw new Error('Missing reward key');p.cabinBlueprints[itemId]=p.cabinBlueprints[itemId]||{unlockedAt:now(),source:'reward',rewardKey:String(b.rewardKey).slice(0,120)};
    }else throw new Error('Unknown cabin item action');
    p.updatedAt=now();await this.ctx.storage.put(`arcade-profile:${id}`,p);return p;
  }
  async getCabinRoom(roomKey){
    const key=String(roomKey||'').trim().toLowerCase().replace(/[^a-z0-9:_-]/g,'').slice(0,100);if(!key)return null;
    const stored=await this.ctx.storage.get(`cabin-room:${key}`);
    return stored||{roomKey:key,ownerProfileId:null,ownerName:'',ownerAvatar:key.startsWith('guest:')?'cowboy':key,wallpaper:'pine-needle-wallpaper',flooring:'dark-oak-flooring',placements:[],guestbook:[],reactions:[],updatedAt:0};
  }
  async getCabinOverview(){const rows=await this.ctx.storage.list({prefix:'cabin-room:'});return [...rows.values()].map(r=>({roomKey:r.roomKey,ownerName:r.ownerName||'',ownerAvatar:r.ownerAvatar||'',updatedAt:r.updatedAt||0,placementCount:Array.isArray(r.placements)?r.placements.length:0})).sort((a,b)=>String(a.roomKey).localeCompare(String(b.roomKey)))}
  async updateCabinRoom(b){
    const profileId=profileIdFrom(b),roomKey=String(b.roomKey||'').trim().toLowerCase().replace(/[^a-z0-9:_-]/g,'').slice(0,100);if(!profileId||!roomKey)throw new Error('Missing room owner');
    let room=await this.getCabinRoom(roomKey);const action=String(b.action||'save');
    const familyKey=!roomKey.startsWith('guest:')?roomKey:null;const avatar=String(b.avatar||'').toLowerCase();
    if(!room.ownerProfileId&&action==='save'){
      if(familyKey&&avatar&&avatar!==familyKey)throw new Error('This named room belongs to its matching family avatar');
      room.ownerProfileId=profileId;room.ownerName=String(b.name||'Family Player').slice(0,24);room.ownerAvatar=avatar||familyKey||'cowboy';
    }
    if(action==='save'){
      if(room.ownerProfileId!==profileId)throw new Error('Only the room owner can decorate this room');
      const raw=Array.isArray(b.placements)?b.placements.slice(0,100):[];const placements=[],progress=await this.getArcadeProfile(profileId),owned=normalizeCabinBlueprints(progress?.cabinBlueprints),grandfathered=new Set((room.placements||[]).map(q=>String(q.itemId||'')));
      for(const q of raw){const itemId=String(q?.itemId||'');if(!CABIN_ROOM_ITEM_BY_ID[itemId])continue;if(!owned[itemId]&&!grandfathered.has(itemId))throw new Error('Unlock this cabin blueprint before placing it');const x=Math.max(0,Math.min(14,Number(q.x)||0)),z=Math.max(0,Math.min(16,Number(q.z)||0)),rotation=((Math.round((Number(q.rotation)||0)/90)*90)%360+360)%360;placements.push({id:String(q.id||crypto.randomUUID()).slice(0,80),itemId,x,z,rotation})}
      room.placements=placements;room.wallpaper=String(b.wallpaper||room.wallpaper||'pine-needle-wallpaper').slice(0,100);room.flooring=String(b.flooring||room.flooring||'dark-oak-flooring').slice(0,100);room.updatedAt=now();
    }else if(action==='guestbook'){
      const text=String(b.text||'').trim().slice(0,220);if(!text)throw new Error('Guest-book message is empty');room.guestbook=[...(room.guestbook||[]),{id:crypto.randomUUID(),profileId,name:String(b.name||'Visitor').slice(0,24),text,at:now()}].slice(-40);room.updatedAt=now();
    }else if(action==='react'){
      room.reactions=[...(room.reactions||[]),{id:crypto.randomUUID(),profileId,name:String(b.name||'Visitor').slice(0,24),emoji:String(b.emoji||'♥').slice(0,8),at:now()}].slice(-40);room.updatedAt=now();
    }else throw new Error('Unknown cabin action');
    await this.ctx.storage.put(`cabin-room:${roomKey}`,room);return room;
  }
  async getPresence(){const data=await this.ctx.storage.get('presence:v1')||{};const cutoff=now()-60000,out={};for(const [id,v] of Object.entries(data)){if(v&&v.at>=cutoff)out[id]=v}if(Object.keys(out).length!==Object.keys(data).length)await this.ctx.storage.put('presence:v1',out);return Object.values(out).sort((a,b)=>b.at-a.at)}
  async updatePresence(b){const id=profileIdFrom(b);if(!id)throw new Error('Missing profile id');const data=await this.ctx.storage.get('presence:v1')||{};if(b.action==='leave'){delete data[id]}else{data[id]={profileId:id,name:String(b.name||'Family Player').slice(0,24),avatar:String(b.avatar||'john').slice(0,40),gameId:String(b.gameId||'').slice(0,80),gameName:String(b.gameName||'Game').slice(0,100),path:String(b.path||'/').slice(0,220),mode:String(b.mode||'solo').slice(0,20),joinable:b.joinable!==false,roomId:String(b.roomId||'').slice(0,80),at:now()}}await this.ctx.storage.put('presence:v1',data);return data[id]||null}
  async handleJoinRequest(b){
    const action=String(b.action||'list'),requests=await this.ctx.storage.get('join-requests:v1')||[];
    if(action==='submit'){
      const from=profileIdFrom(b),to=String(b.toProfileId||'').trim().slice(0,80);if(!from||!to||from===to)throw new Error('Invalid join request');
      const recent=requests.find(r=>r.fromProfileId===from&&r.toProfileId===to&&r.status==='pending'&&now()-r.at<30000);if(recent)return{ok:true,request:recent};
      const entry={id:crypto.randomUUID(),fromProfileId:from,fromName:String(b.fromName||'Family Player').slice(0,24),toProfileId:to,toName:String(b.toName||'Family Player').slice(0,24),gameId:String(b.gameId||'').slice(0,80),gameName:String(b.gameName||'Game').slice(0,100),path:String(b.path||'/').slice(0,220),roomId:String(b.roomId||'').slice(0,80),status:'pending',at:now()};
      requests.unshift(entry);await this.ctx.storage.put('join-requests:v1',requests.slice(0,150));return{ok:true,request:entry};
    }
    if(action==='respond'){
      const id=String(b.id||''),who=profileIdFrom(b),r=requests.find(x=>x.id===id&&x.toProfileId===who);if(!r)throw new Error('Join request not found');if(r.status!=='pending')return{ok:true,request:r};
      r.status=b.accept?'accepted':'declined';r.respondedAt=now();r.joinMode=String(b.joinMode||'smart').slice(0,20);await this.ctx.storage.put('join-requests:v1',requests);return{ok:true,request:r};
    }
    if(action==='claim'){
      const id=String(b.id||''),who=profileIdFrom(b),r=requests.find(x=>x.id===id&&x.fromProfileId===who);if(!r)throw new Error('Join request not found');if(r.status!=='accepted')throw new Error(r.status==='declined'?'That join request was declined':'That join request is still waiting for an answer');
      let roomId=String(r.roomId||'');
      if(!roomId){const live=(await this.getPresence()).find(x=>x.profileId===r.toProfileId&&(!r.gameId||x.gameId===r.gameId));roomId=String(live?.roomId||'')}
      if(!roomId)throw new Error('The accepted game room is no longer available');const room=await this.getRoom(roomId);if(!room)throw new Error('The accepted game room has closed');
      let existing=[...room.players.values()].find(p=>!p.isBot&&p.profileId===who);
      if(!existing){
        const activePlayers=[...room.players.values()].filter(p=>!p.spectating);if(activePlayers.length>=room.maxSeats)throw new Error('The game filled up before you could enter');
        const id=crypto.randomUUID(),t=token(),pf=playerProfile(b,'Player'),spectating=room.game.phase!=='lobby';existing={id,token:t,...pf,seat:null,ready:false,connected:true,bid:null,tricks:0,score:0,continued:false,hand:[],eliminated:false,spectating,isBot:false,botDifficulty:null};room.players.set(id,existing);broadcast(room);
      }
      r.roomId=room.id;r.claimedAt=now();r.claimMode=room.game.phase==='lobby'&&!existing.spectating?'player':'spectator';await this.ctx.storage.put('join-requests:v1',requests);
      return{ok:true,request:r,roomId:room.id,playerToken:existing.token,playerId:existing.id,joinMode:r.claimMode,gameType:room.gameType};
    }
    const who=profileIdFrom(b);const list=requests.filter(r=>!who||r.toProfileId===who||r.fromProfileId===who).slice(0,50);return{ok:true,requests:list};
  }
  async fetch(request){activeHub=this;await this.ready;try{return await handleApi(request)}catch(err){console.error(err);return jsonResponse({error:err?.message||'Server error'},500)}}
}

export default {
  async fetch(request,env){
    const url=new URL(request.url);
    if(url.pathname.startsWith('/api/island/')){
      let roomId=url.searchParams.get('room');
      if(url.pathname==='/api/island/create'&&request.method==='POST'){
        roomId=safeId(8);
        const routed=new URL(request.url);routed.searchParams.set('room',roomId);
        return env.ISLAND_LIFE.getByName(roomId).fetch(new Request(routed.toString(),request));
      }
      if(!roomId)return jsonResponse({error:'Missing Island Life room id'},400);
      return env.ISLAND_LIFE.getByName(roomId).fetch(request);
    }
    if(url.pathname.startsWith('/api/prop/')){
      let roomId=url.searchParams.get('room');
      if(url.pathname==='/api/prop/create'&&request.method==='POST'){
        roomId=safeId(8);
        const routed=new URL(request.url);routed.searchParams.set('room',roomId);
        const stub=env.PROP_HUNT.getByName(roomId);
        return stub.fetch(new Request(routed.toString(),request));
      }
      if(!roomId)return jsonResponse({error:'Missing Prop Hunt room id'},400);
      return env.PROP_HUNT.getByName(roomId).fetch(request);
    }
    if(url.pathname==='/healthz'||url.pathname.startsWith('/api/')){
      const id=env.GAME_HUB.idFromName('black-family-game-night');
      return env.GAME_HUB.get(id).fetch(request);
    }
    return env.ASSETS.fetch(request);
  }
};
