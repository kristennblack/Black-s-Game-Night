import test from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import {readFile} from 'node:fs/promises';
import {GAME_TYPES} from '../gameEngine.mjs';
import {extraDefaults,startExtraGame,extraPublicState,extraGameAction} from '../extraGames.mjs';
import {GameHub} from '../worker.mjs';
import {applyPrimaryClothingColor} from '../public/shared-3d-studio.mjs';

class MemoryStorage{
  constructor(){this.map=new Map()}
  async list({prefix=''}={}){return new Map([...this.map].filter(([k])=>k.startsWith(prefix)))}
  async get(k){return this.map.get(k)}
  async put(k,v){this.map.set(k,structuredClone(v))}
}
function makeHub(){
  const storage=new MemoryStorage(),waits=[];
  const ctx={storage,waitUntil(p){waits.push(Promise.resolve(p))}};
  const hub=new GameHub(ctx,{});
  return {hub,storage,flush:async()=>{while(waits.length)await Promise.all(waits.splice(0))}};
}
async function post(hub,path,body={}){
  const r=await hub.fetch(new Request(`https://game.test/api/${path}`,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(body)}));
  const data=await r.json();
  assert.equal(r.ok,true,`${path} failed: ${JSON.stringify(data)}`);
  return data;
}
async function state(hub,roomId,token=''){
  const r=await hub.fetch(new Request(`https://game.test/api/state?room=${encodeURIComponent(roomId)}&token=${encodeURIComponent(token)}`));
  const data=await r.json();
  assert.equal(r.ok,true,`state failed: ${JSON.stringify(data)}`);
  return data;
}
const makePlayer=i=>({id:`p${i}`,token:`t${i}`,profileId:`profile-${i}`,name:`Player ${i}`,avatar:i===1?'john':'kristen',variant:0,outfitVariant:0,color:i===1?'#305c9b':'#9b3e3a',seat:i-1,ready:true,connected:true,bid:null,tricks:0,score:0,continued:false,hand:[],eliminated:false,isBot:false});
function extraRoom(type,n=2,settings={}){
  const players=new Map(Array.from({length:n},(_,i)=>{const p=makePlayer(i+1);return [p.id,p]}));
  return {id:crypto.randomUUID(),gameType:type,settings:{...extraDefaults(type),...settings},players,game:{phase:'lobby',history:[],schedule:[],winnerIds:[],extra:null}};
}

test('Smear deals and privately exposes all six owner cards before bidding',async()=>{
  const {hub}=makeHub();
  const created=await post(hub,'create',{name:'John',profileId:'john-profile',gameType:GAME_TYPES.SMEAR});
  const people=[{token:created.playerToken,name:'John'}];
  for(const name of ['Kristen','Holly','Vanessa'])people.push({name,token:(await post(hub,'join',{roomId:created.roomId,name,profileId:`${name.toLowerCase()}-profile`})).playerToken});
  for(let i=0;i<people.length;i++){
    await post(hub,'seat',{roomId:created.roomId,playerToken:people[i].token,seat:i});
    await post(hub,'ready',{roomId:created.roomId,playerToken:people[i].token,ready:true});
  }
  await post(hub,'start',{roomId:created.roomId,hostToken:created.hostToken});
  const views=[];
  for(const person of people)views.push(await state(hub,created.roomId,person.token));
  for(const view of views){
    assert.equal(view.game.phase,'bidding');
    assert.equal(view.game.hand.length,6,'viewer should receive their six private cards before bidding');
    assert.equal(new Set(view.game.hand.map(c=>c.id)).size,6);
    for(const publicPlayer of view.players){
      assert.equal('hand' in publicPlayer,false,'opponent card identities must never be included in the public player list');
      assert.equal(publicPlayer.handCount,6);
    }
  }
  assert.equal(new Set(views.flatMap(v=>v.game.hand.map(c=>c.id))).size,24,'each seat should receive a distinct six-card hand');
});

test('Smear client visibly renders the six-card bid hand instead of hiding it',async()=>{
  const src=await readFile(new URL('../public/app.js',import.meta.url),'utf8');
  assert.match(src,/showBidHand=g\.phase==='bidding'.*GAME\.SMEAR/);
  assert.match(src,/YOUR 6-CARD HAND · REVIEW IT BEFORE YOU BID/);
  assert.match(src,/bidding-hand/);
});

test('Trail Trouble starts every player with a persistent private five-card hand',()=>{
  const r=extraRoom(GAME_TYPES.TRAIL,4,{teamMode:'teams2'});startExtraGame(r);
  for(const p of r.players.values())assert.equal(p.hand.length,5);
  const viewer=r.players.get(r.game.extra.turnPlayerId),pub=extraPublicState(r,viewer);
  assert.equal(pub.hand.length,5);
  assert.equal(pub.handCounts[viewer.id],5);
  assert.deepEqual(pub.hand.map(c=>c.id),viewer.hand.map(c=>c.id));
  assert.ok(pub.actions.every(a=>a.args?.cardId),'every Trail move/discard action must be tied to one held card');
});

test('Trail Trouble plays one chosen held card, discards it and draws exactly back to five',()=>{
  const r=extraRoom(GAME_TYPES.TRAIL,2);startExtraGame(r);const ex=r.game.extra,p=r.players.get(ex.turnPlayerId);
  const chosen={id:'chosen-three',kind:'move',value:3,label:'3'};
  p.hand=[chosen,{id:'x1',kind:'move',value:1,label:'1'},{id:'x2',kind:'move',value:5,label:'5'},{id:'x3',kind:'out',label:'HIT THE TRAIL'},{id:'x4',kind:'cabin',label:'CABIN CALL'}];
  const beforeDeck=ex.deck.length,pub=extraPublicState(r,p),action=pub.actions.find(a=>a.args?.cardId===chosen.id&&a.action==='trailMove'&&a.args?.steps===3);
  assert.ok(action,'chosen movement card should advertise a legal pawn move');
  extraGameAction(r,p,action);
  assert.equal(p.hand.length,5);
  assert.equal(p.hand.some(c=>c.id===chosen.id),false);
  assert.equal(ex.discard.at(-1).id,chosen.id);
  assert.equal(ex.deck.length,beforeDeck-1,'one replacement card should be drawn');
});

test('Trail Trouble records intermediate board-space waypoints for multi-space animation',()=>{
  const r=extraRoom(GAME_TYPES.TRAIL,2);startExtraGame(r);const ex=r.game.extra,p=r.players.get(ex.turnPlayerId);
  p.hand=[{id:'five',kind:'move',value:5,label:'5'},{id:'a',kind:'move',value:1,label:'1'},{id:'b',kind:'move',value:3,label:'3'},{id:'c',kind:'out',label:'HIT THE TRAIL'},{id:'d',kind:'cabin',label:'CABIN CALL'}];
  const a=extraPublicState(r,p).actions.find(x=>x.args?.cardId==='five'&&x.action==='trailMove'&&x.args.steps===5);assert.ok(a);
  extraGameAction(r,p,a);
  assert.equal(ex.lastMove.kind,'move');
  assert.ok(ex.lastMove.motions[0].sequence.length>=6,'five spaces should include start plus each intermediate space');
});

test('Trail Trouble only permits a discard-turn when the whole five-card hand has no legal move',()=>{
  const r=extraRoom(GAME_TYPES.TRAIL,2);startExtraGame(r);const ex=r.game.extra,p=r.players.get(ex.turnPlayerId);
  for(const q of ex.pawns[p.id]){q.zone='home';q.home=3}
  p.hand=Array.from({length:5},(_,i)=>({id:`out${i}`,kind:'out',label:'HIT THE TRAIL'}));
  const pub=extraPublicState(r,p);
  assert.equal(pub.legalCardIds.length,0);
  assert.equal(pub.actions.length,5);
  assert.ok(pub.actions.every(a=>a.action==='trailDiscardCard'));
});

test('Trail Trouble bots use the same five-card hand model and replenish after acting',async()=>{
  const {hub}=makeHub();
  const created=await post(hub,'create',{name:'John',profileId:'john-trail',gameType:GAME_TYPES.TRAIL});
  await post(hub,'addBot',{roomId:created.roomId,hostToken:created.hostToken,difficulty:'medium',avatar:'kristen'});
  await post(hub,'ready',{roomId:created.roomId,playerToken:created.playerToken,ready:true});
  await post(hub,'start',{roomId:created.roomId,hostToken:created.hostToken});
  const room=await hub.getRoom(created.roomId),bot=[...room.players.values()].find(p=>p.isBot);
  assert.equal(bot.hand.length,5);
  room.game.extra.turnPlayerId=bot.id;
  await post(hub,'botTick',{roomId:created.roomId,hostToken:created.hostToken});
  assert.equal(bot.hand.length,5,'bot should draw back to five after a normal Trail card play/discard');
});

test('Trail Trouble client implements five-card selection, waypoint motion, pinch zoom, pan and Reset View',async()=>{
  const [app,css]=await Promise.all([
    readFile(new URL('../public/app.js',import.meta.url),'utf8'),
    readFile(new URL('../public/styles.css',import.meta.url),'utf8')
  ]);
  assert.match(app,/function trailTableCards/);
  assert.match(app,/selectedTrailCardId/);
  assert.match(app,/function animateTrailPositions/);
  assert.match(app,/lastMove/);
  assert.match(app,/function bindTrailBoardGestures/);
  assert.match(app,/pointerdown/);
  assert.match(app,/pointermove/);
  assert.match(app,/wheel/);
  assert.match(app,/RESET VIEW|Reset View/);
  assert.match(css,/\.trail-board-viewport[^}]*touch-action:\s*none/s);
  assert.match(css,/\.trail-five-hand/);
});

test('room rematch preserves player identity/look while resetting match-specific state',async()=>{
  const {hub}=makeHub();
  const created=await post(hub,'create',{name:'John',profileId:'stable-john',avatar:'john',variant:3,color:'#305c9b',gameType:GAME_TYPES.SCREW});
  const joined=await post(hub,'join',{roomId:created.roomId,name:'Kristen',profileId:'stable-kristen',avatar:'kristen',color:'#9b3e3a'});
  for(const [seat,t] of [[0,created.playerToken],[1,joined.playerToken]]){await post(hub,'seat',{roomId:created.roomId,playerToken:t,seat});await post(hub,'ready',{roomId:created.roomId,playerToken:t,ready:true})}
  const first=await post(hub,'start',{roomId:created.roomId,hostToken:created.hostToken});
  const room=await hub.getRoom(created.roomId);const beforeProfiles=[...room.players.values()].map(p=>({id:p.id,profileId:p.profileId,avatar:p.avatar,variant:p.variant,color:p.color,seat:p.seat}));
  room.game.phase='gameOver';room.game.winnerIds=[room.hostPlayerId];for(const p of room.players.values()){p.score=999;p.hand=[{id:'old'}]}
  const rematch=await post(hub,'rematch',{roomId:created.roomId,hostToken:created.hostToken});
  assert.notEqual(rematch.matchId,first.matchId);
  assert.notEqual(room.game.phase,'gameOver');
  assert.deepEqual([...room.players.values()].map(p=>({id:p.id,profileId:p.profileId,avatar:p.avatar,variant:p.variant,color:p.color,seat:p.seat})),beforeProfiles);
  assert.ok([...room.players.values()].every(p=>p.score===0));
});

test('completed result recording is duplicate-safe and keyed to stable player profile identity',async()=>{
  const {hub,storage,flush}=makeHub();await hub.ready;
  const p1=makePlayer(1),p2=makePlayer(2);
  const room={id:'RESULTROOM',revision:0,gameType:GAME_TYPES.SCREW,settings:{},hostToken:'h',hostPlayerId:p1.id,createdAt:Date.now(),maxSeats:8,subscribers:new Set(),chat:[],reaction:null,players:new Map([[p1.id,p1],[p2.id,p2]]),game:{phase:'gameOver',matchId:'match-dedupe-1',resultRecorded:false,winnerIds:[p1.id],history:[]}};
  hub.maybeRecordCompletedMatch(room);hub.maybeRecordCompletedMatch(room);await flush();hub.maybeRecordCompletedMatch(room);await flush();
  const board=await hub.getLeaderboard();
  assert.equal(board.players[p1.profileId].totalWins,1);
  assert.equal(board.players[p1.profileId].games[GAME_TYPES.SCREW].wins,1);
  assert.equal((await storage.get('result:match-dedupe-1')).winners[0].profileId,p1.profileId);
});

test('Requests are stored persistently with category, player identity and status',async()=>{
  const {hub}=makeHub();
  const saved=await post(hub,'requests',{action:'submit',profileId:'profile-k',name:'Kristen',category:'Fix a Game',text:'Please fix this game.'});
  assert.equal(saved.request.profileId,'profile-k');assert.equal(saved.request.category,'Fix a Game');assert.equal(saved.request.status,'Requested');
  const list=await post(hub,'requests',{});assert.equal(list.requests.length,1);assert.equal(list.requests[0].text,'Please fix this game.');
});

test('Avatar Hub persists Character -> Outfit -> Color profile defaults and player color drives 2D clothing tint',async()=>{
  const src=await readFile(new URL('../public/app.js',import.meta.url),'utf8');
  assert.match(src,/PROFILE_KEY='gn_profile_v1'/);
  assert.match(src,/profileId/);
  assert.match(src,/Choose character/i);
  assert.match(src,/Choose outfit/i);
  assert.match(src,/Choose player colour|player colour/i);
  assert.match(src,/Save \/ Use This Look/i);
  assert.match(src,/--outfit:\$\{color\}/);
  assert.match(src,/profilePayload/);
});

test('authored avatar clothing tint contract recolors shirt materials without touching skin',()=>{
  const colorObj=v=>({value:v,set(next){this.value=next}});
  const makeMat=(name,color)=>({name,userData:{},color:colorObj(color),clone(){return {name:this.name,userData:{...this.userData},color:colorObj(this.color.value),clone:this.clone}}});
  const shirt={isMesh:true,name:'John_Shirt',userData:{},material:makeMat('shirt-fabric','#ffffff')};
  const skin={isMesh:true,name:'John_Face',userData:{},material:makeMat('skin','#ddaa88')};
  const root={traverse(fn){fn(shirt);fn(skin)}};
  const changed=applyPrimaryClothingColor(root,'#305c9b');
  assert.equal(changed,1);assert.equal(shirt.material.color.value,'#305c9b');assert.equal(skin.material.color.value,'#ddaa88');
});

test('home platform exposes Requests, shared Leaderboards, Avatar Hub and interactive game-school tutorials',async()=>{
  const src=await readFile(new URL('../public/app.js',import.meta.url),'utf8');
  assert.match(src,/REQUESTS/i);assert.doesNotMatch(src,/>\s*STORE\s*</i);
  assert.match(src,/api\('requests'/);assert.match(src,/api\('leaderboard'/);
  assert.match(src,/tutorial-game-grid/);assert.match(src,/data-tutorial-action/);assert.match(src,/safe practice scene/i);
  assert.match(src,/smearHand/);assert.match(src,/trailHand/);
});

test('all applicable game-end presentations expose Keep Playing and Return to Game Shelf',async()=>{
  const [app,prop,birthday,newGames,propRoom]=await Promise.all([
    readFile(new URL('../public/app.js',import.meta.url),'utf8'),
    readFile(new URL('../public/prop-hunt-3d.js',import.meta.url),'utf8'),
    readFile(new URL('../public/birthday-climb.js',import.meta.url),'utf8'),
    readFile(new URL('../public/new-games.html',import.meta.url),'utf8'),
    readFile(new URL('../propHuntRoom.mjs',import.meta.url),'utf8')
  ]);
  assert.match(app,/KEEP PLAYING/);assert.match(app,/RETURN TO GAME SHELF/);assert.match(app,/data-action="rematch"/);
  assert.match(prop,/KEEP PLAYING/);assert.match(prop,/RETURN TO GAME SHELF/);assert.match(propRoom,/\/api\/prop\/rematch/);
  assert.match(birthday,/KEEP PLAYING/);assert.match(birthday,/RETURN TO GAME SHELF/);
  assert.match(newGames,/KEEP PLAYING/);assert.match(newGames,/RETURN TO GAME SHELF/);
});

test('Phase F platform build ID and cache namespace are explicit and fresh',async()=>{
  const [app,sw,qa,version]=await Promise.all([
    readFile(new URL('../public/app.js',import.meta.url),'utf8'),readFile(new URL('../public/sw.js',import.meta.url),'utf8'),readFile(new URL('../public/phase-e-qa.mjs',import.meta.url),'utf8'),readFile(new URL('../VERSION.txt',import.meta.url),'utf8')
  ]);
  assert.match(app,/GAME-NIGHT-STAGING-PHASE-S-GAMEPLAY-TABLETOP-REALISM-17/);assert.match(sw,/black-family-game-night-staging-phase-s-gameplay-tabletop-realism-17/);assert.match(qa,/GAME-NIGHT-STAGING-PHASE-S-GAMEPLAY-TABLETOP-REALISM-17/);assert.equal(version.trim(),'GAME-NIGHT-STAGING-PHASE-S-GAMEPLAY-TABLETOP-REALISM-17');
});
