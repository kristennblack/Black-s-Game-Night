import { assignRoles, sanitizeSnapshot, canServerRegisterHit, clamp } from './public/prop-hunt-core.mjs';

const MAX_PLAYERS=13;
const BOT_DIFFICULTIES=new Set(['easy','medium','hard']);
const MAP_KEYS=new Set(['papa','camp','acreage','farm','rotate']);
const MODES=new Set(['classic','chaos']);
const FAMILY_IDS=new Set(['john','kristen','holly','elizabeth','vanessa','logan','james','dorothy','nana','papa','kelsi','molly','gunner']);
const safeName=v=>String(v||'Player').trim().slice(0,24)||'Player';
const safeAvatar=v=>FAMILY_IDS.has(String(v||'').toLowerCase())?String(v).toLowerCase():'john';
const safeDifficulty=v=>BOT_DIFFICULTIES.has(String(v||'').toLowerCase())?String(v).toLowerCase():'medium';
const json=(data,status=200)=>Response.json(data,{status,headers:{'Cache-Control':'no-store'}});
const token=()=>crypto.randomUUID().replaceAll('-','')+crypto.randomUUID().replaceAll('-','').slice(0,8);
const playerByToken=(room,t)=>room?.players?.find(p=>p.token===t)||null;
const hostOk=(room,t)=>!!t&&room?.hostToken===t;
const mapForRound=(setting,round)=>setting==='rotate'?['papa','camp','acreage','farm'][(round-1)%4]:setting;

function persistentPlayer(p){
  return {id:p.id,token:p.token,name:p.name,avatar:p.avatar,seat:p.seat,isBot:!!p.isBot,difficulty:p.difficulty||null,ready:!!p.ready,connected:!!p.connected,role:p.role||null,health:p.health??3,alive:p.alive!==false,prop:p.prop||null,propChanges:p.propChanges??3,decoys:p.decoys??10,flash:p.flash!==false,score:p.score||{hiderWins:0,hunterWins:0}};
}
function publicPlayer(p){
  return {id:p.id,name:p.name,avatar:p.avatar,seat:p.seat,isBot:!!p.isBot,difficulty:p.isBot?p.difficulty:null,ready:!!p.ready,connected:!!p.connected,role:p.role||null,health:p.health??3,alive:p.alive!==false,prop:p.prop||null,propChanges:p.propChanges??3,decoys:p.decoys??10,flash:p.flash!==false,score:p.score||{hiderWins:0,hunterWins:0},live:p.live||null};
}

export class PropHuntRoom {
  constructor(ctx,env){
    this.ctx=ctx;this.env=env;this.room=null;
    this.ready=ctx.blockConcurrencyWhile(async()=>{
      ctx.storage.sql.exec('CREATE TABLE IF NOT EXISTS prop_room (id INTEGER PRIMARY KEY CHECK(id=1), json TEXT NOT NULL, updated_at INTEGER NOT NULL)');
      const rows=ctx.storage.sql.exec('SELECT json FROM prop_room WHERE id=1').toArray();
      if(rows.length){try{this.room=JSON.parse(rows[0].json);this.room.players=(this.room.players||[]).map(p=>({...p,connected:!!p.isBot,live:null}))}catch{this.room=null}}
    });
  }

  save(){
    if(!this.room)return;
    const stable={...this.room,players:this.room.players.map(persistentPlayer)};
    this.ctx.storage.sql.exec('INSERT INTO prop_room (id,json,updated_at) VALUES (1,?,?) ON CONFLICT(id) DO UPDATE SET json=excluded.json, updated_at=excluded.updated_at',JSON.stringify(stable),Date.now());
  }

  stateFor(tokenValue){
    if(!this.room)return null;
    const viewer=playerByToken(this.room,tokenValue);
    return {id:this.room.id,createdAt:this.room.createdAt,revision:this.room.revision||0,phase:this.room.phase,phaseEndsAt:this.room.phaseEndsAt||0,round:this.room.round||0,activeMap:this.room.activeMap||mapForRound(this.room.settings?.mapKey||'papa',this.room.round||1),wins:this.room.wins||{hiders:0,hunters:0},settings:this.room.settings,players:this.room.players.map(publicPlayer),viewerId:viewer?.id||null,isHost:!!viewer&&viewer.id===this.room.hostPlayerId,hostPlayerId:this.room.hostPlayerId,roundResult:this.room.roundResult||null};
  }

  bump(persist=true){this.room.revision=(this.room.revision||0)+1;if(persist)this.save();}

  broadcast(payload,except=null){
    const data=JSON.stringify(payload);
    for(const ws of this.ctx.getWebSockets()){if(ws===except)continue;try{if(ws.readyState===1)ws.send(data)}catch{}}
  }
  broadcastState(persist=true){this.bump(persist);for(const ws of this.ctx.getWebSockets()){const a=ws.deserializeAttachment?.()||{};try{if(ws.readyState===1)ws.send(JSON.stringify({type:'state',state:this.stateFor(a.token)}))}catch{}}}

  startRound(){
    const r=this.room;const roles=assignRoles(r.players,r.round);
    r.phase='hide';r.phaseEndsAt=Date.now()+30000;r.roundResult=null;r.activeMap=mapForRound(r.settings.mapKey,r.round);
    for(const p of r.players){p.role=roles[p.id];p.health=3;p.alive=true;p.prop=null;p.propChanges=3;p.decoys=10;p.flash=true;p.live=null}
    this.broadcastState(true);
  }
  finishRound(winner){
    const r=this.room;if(r.phase==='roundEnd'||r.phase==='matchEnd')return;
    r.wins[winner]=(r.wins[winner]||0)+1;r.roundResult=winner;
    for(const p of r.players)if(p.role===(winner==='hiders'?'hider':'hunter'))p.score[winner==='hiders'?'hiderWins':'hunterWins']++;
    if(r.round>=r.settings.rounds){r.phase='matchEnd';r.phaseEndsAt=0}else{r.phase='roundEnd';r.phaseEndsAt=Date.now()+6500}
    this.broadcastState(true);
  }
  advanceClock(){
    const r=this.room;if(!r)return false;const now=Date.now();let changed=false;
    if(r.phase==='hide'&&now>=r.phaseEndsAt){r.phase='hunt';r.phaseEndsAt=now+180000;changed=true}
    if(r.phase==='hunt'){
      const hiders=r.players.filter(p=>p.role==='hider'&&p.alive);
      if(!hiders.length){this.finishRound('hunters');return true}
      if(now>=r.phaseEndsAt){this.finishRound('hiders');return true}
    }
    if(r.phase==='roundEnd'&&now>=r.phaseEndsAt){r.round++;this.startRound();return true}
    if(changed)this.broadcastState(true);
    return changed;
  }

  async fetch(request){
    await this.ready;const url=new URL(request.url),path=url.pathname;
    try{
      if(path==='/api/prop/create'&&request.method==='POST')return this.create(request,url);
      if(path==='/api/prop/join'&&request.method==='POST')return this.join(request);
      if(path==='/api/prop/state'&&request.method==='GET'){this.advanceClock();const s=this.stateFor(url.searchParams.get('token'));return s?json(s):json({error:'Room not found'},404)}
      if(path==='/api/prop/configure'&&request.method==='POST')return this.configure(request);
      if(path==='/api/prop/profile'&&request.method==='POST')return this.profile(request);
      if(path==='/api/prop/ready'&&request.method==='POST')return this.readyPlayer(request);
      if(path==='/api/prop/addBot'&&request.method==='POST')return this.addBot(request);
      if(path==='/api/prop/updateBot'&&request.method==='POST')return this.updateBot(request);
      if(path==='/api/prop/removeBot'&&request.method==='POST')return this.removeBot(request);
      if(path==='/api/prop/start'&&request.method==='POST')return this.start(request);
      if(path==='/api/prop/rematch'&&request.method==='POST')return this.rematch(request);
      if(path==='/api/prop/ws')return this.connectWebSocket(request,url);
      return json({error:'Unknown Prop Hunt route'},404);
    }catch(err){console.error(JSON.stringify({message:'prop hunt room error',path,error:err instanceof Error?err.message:String(err)}));return json({error:err instanceof Error?err.message:'Prop Hunt server error'},500)}
  }

  async create(request,url){
    if(this.room)return json({error:'Room already exists'},409);
    const body=await request.json().catch(()=>({})),roomId=url.searchParams.get('room');if(!roomId)return json({error:'Missing room id'},400);
    const hostToken=token(),playerToken=token(),playerId=crypto.randomUUID();
    this.room={id:roomId,createdAt:Date.now(),revision:1,hostToken,hostPlayerId:playerId,phase:'lobby',phaseEndsAt:0,round:0,roundResult:null,wins:{hiders:0,hunters:0},settings:{mode:'classic',mapKey:'papa',rounds:6},players:[{id:playerId,token:playerToken,name:safeName(body.name||'Host'),avatar:safeAvatar(body.avatar||'john'),seat:0,isBot:false,difficulty:null,ready:false,connected:true,role:null,health:3,alive:true,prop:null,propChanges:3,decoys:10,flash:true,score:{hiderWins:0,hunterWins:0},live:null}]};
    this.save();return json({roomId,hostToken,playerToken,playerId});
  }
  async join(request){
    if(!this.room)return json({error:'Room not found'},404);if(this.room.phase!=='lobby')return json({error:'Match already started'},409);if(this.room.players.length>=MAX_PLAYERS)return json({error:'Room is full'},409);
    const b=await request.json().catch(()=>({})),p={id:crypto.randomUUID(),token:token(),name:safeName(b.name),avatar:safeAvatar(b.avatar),seat:this.room.players.length,isBot:false,difficulty:null,ready:false,connected:true,role:null,health:3,alive:true,prop:null,propChanges:3,decoys:10,flash:true,score:{hiderWins:0,hunterWins:0},live:null};
    this.room.players.push(p);this.broadcastState(true);return json({roomId:this.room.id,playerToken:p.token,playerId:p.id});
  }
  async configure(request){
    if(!this.room)return json({error:'Room not found'},404);const b=await request.json().catch(()=>({}));if(!hostOk(this.room,b.hostToken))return json({error:'Host only'},403);if(this.room.phase!=='lobby')return json({error:'Settings are locked'},409);
    if(MODES.has(b.mode))this.room.settings.mode=b.mode;if(MAP_KEYS.has(b.mapKey))this.room.settings.mapKey=b.mapKey;const rounds=Number(b.rounds);if(Number.isInteger(rounds)&&rounds>=1&&rounds<=12)this.room.settings.rounds=rounds;this.broadcastState(true);return json({ok:true});
  }
  async profile(request){
    if(!this.room)return json({error:'Room not found'},404);const b=await request.json().catch(()=>({})),p=playerByToken(this.room,b.playerToken);if(!p)return json({error:'Player not found'},401);if(this.room.phase!=='lobby')return json({error:'Profile locked'},409);p.name=safeName(b.name||p.name);p.avatar=safeAvatar(b.avatar||p.avatar);p.ready=false;this.broadcastState(true);return json({ok:true});
  }
  async readyPlayer(request){
    if(!this.room)return json({error:'Room not found'},404);const b=await request.json().catch(()=>({})),p=playerByToken(this.room,b.playerToken);if(!p)return json({error:'Player not found'},401);if(this.room.phase!=='lobby')return json({error:'Match already started'},409);p.ready=!!b.ready;this.broadcastState(true);return json({ok:true});
  }
  async addBot(request){
    if(!this.room)return json({error:'Room not found'},404);const b=await request.json().catch(()=>({}));if(!hostOk(this.room,b.hostToken))return json({error:'Host only'},403);if(this.room.phase!=='lobby')return json({error:'Bots are locked'},409);if(this.room.players.length>=MAX_PLAYERS)return json({error:'Room is full'},409);
    const avatar=safeAvatar(b.avatar||['gunner','papa','nana','logan'][this.room.players.length%4]),p={id:crypto.randomUUID(),token:null,name:`${avatar[0].toUpperCase()+avatar.slice(1)} Computer`,avatar,seat:this.room.players.length,isBot:true,difficulty:safeDifficulty(b.difficulty),ready:true,connected:true,role:null,health:3,alive:true,prop:null,propChanges:3,decoys:10,flash:true,score:{hiderWins:0,hunterWins:0},live:null};this.room.players.push(p);this.broadcastState(true);return json({ok:true,playerId:p.id});
  }
  async updateBot(request){
    if(!this.room)return json({error:'Room not found'},404);const b=await request.json().catch(()=>({}));if(!hostOk(this.room,b.hostToken))return json({error:'Host only'},403);const p=this.room.players.find(x=>x.id===b.targetId&&x.isBot);if(!p)return json({error:'Computer player not found'},404);p.avatar=safeAvatar(b.avatar||p.avatar);p.difficulty=safeDifficulty(b.difficulty||p.difficulty);p.name=`${p.avatar[0].toUpperCase()+p.avatar.slice(1)} Computer`;this.broadcastState(true);return json({ok:true});
  }
  async removeBot(request){
    if(!this.room)return json({error:'Room not found'},404);const b=await request.json().catch(()=>({}));if(!hostOk(this.room,b.hostToken))return json({error:'Host only'},403);const i=this.room.players.findIndex(x=>x.id===b.targetId&&x.isBot);if(i<0)return json({error:'Computer player not found'},404);this.room.players.splice(i,1);this.room.players.forEach((p,n)=>p.seat=n);this.broadcastState(true);return json({ok:true});
  }
  async start(request){
    if(!this.room)return json({error:'Room not found'},404);const b=await request.json().catch(()=>({}));if(!hostOk(this.room,b.hostToken))return json({error:'Host only'},403);if(this.room.phase!=='lobby')return json({error:'Already started'},409);if(this.room.players.length<2)return json({error:'Add at least one family member or computer player'},409);if(this.room.players.some(p=>!p.isBot&&!p.ready))return json({error:'Every real player must be Ready'},409);this.room.round=1;this.room.wins={hiders:0,hunters:0};this.startRound();return json({ok:true});
  }
  async rematch(request){
    if(!this.room)return json({error:'Room not found'},404);const b=await request.json().catch(()=>({}));if(!hostOk(this.room,b.hostToken))return json({error:'Host only'},403);if(this.room.phase!=='matchEnd')return json({error:'Match is not complete'},409);this.room.round=1;this.room.wins={hiders:0,hunters:0};this.room.roundResult=null;for(const p of this.room.players){p.health=3;p.alive=true;p.prop=null;p.propChanges=3;p.decoys=10;p.flash=true;p.live=null;p.score={hiderWins:0,hunterWins:0}}this.startRound();return json({ok:true});
  }

  connectWebSocket(request,url){
    if(request.headers.get('Upgrade')!=='websocket')return new Response('Expected WebSocket',{status:426});if(!this.room)return new Response('Room not found',{status:404});const t=url.searchParams.get('token'),p=playerByToken(this.room,t);if(!p)return new Response('Player not found',{status:401});
    const pair=new WebSocketPair(),[client,server]=Object.values(pair);this.ctx.acceptWebSocket(server,[`player:${p.id}`]);server.serializeAttachment({playerId:p.id,token:t,isHost:p.id===this.room.hostPlayerId});p.connected=true;this.bump(false);server.send(JSON.stringify({type:'state',state:this.stateFor(t)}));for(const q of this.room.players)if(q.live)server.send(JSON.stringify({type:'snapshot',playerId:q.id,snapshot:q.live}));this.broadcast({type:'presence',playerId:p.id,connected:true},server);return new Response(null,{status:101,webSocket:client});
  }

  async webSocketMessage(ws,message){
    await this.ready;this.advanceClock();let msg;try{msg=JSON.parse(typeof message==='string'?message:new TextDecoder().decode(message))}catch{return}const auth=ws.deserializeAttachment?.()||{},sender=this.room?.players.find(p=>p.id===auth.playerId);if(!sender)return;
    if(msg.type==='snapshot'){
      let target=sender;if(msg.playerId&&msg.playerId!==sender.id&&auth.isHost){const q=this.room.players.find(p=>p.id===msg.playerId&&p.isBot);if(q)target=q}const snap=sanitizeSnapshot(msg.snapshot||{},target.live||{});target.live=snap;this.broadcast({type:'snapshot',playerId:target.id,snapshot:snap},ws);return;
    }
    if(msg.type!=='action')return;const action=String(msg.action||'');
    if(action==='disguise'&&sender.role==='hider'&&sender.alive){const prop=String(msg.prop||'').slice(0,48);if(!prop)return;if(sender.prop&&sender.propChanges<=0)return;if(sender.prop)sender.propChanges--;sender.prop=prop;sender.flash=true;this.broadcastState(true);this.broadcast({type:'action',action:'disguise',playerId:sender.id,prop});return}
    if(action==='decoy'&&sender.role==='hider'&&sender.alive&&sender.prop&&sender.decoys>0){sender.decoys--;this.broadcastState(true);this.broadcast({type:'action',action:'decoy',playerId:sender.id,prop:sender.prop,position:sender.live});return}
    if(action==='flash'&&sender.role==='hider'&&sender.alive&&sender.prop&&sender.flash){sender.flash=false;this.broadcastState(true);this.broadcast({type:'action',action:'flash',playerId:sender.id,position:sender.live});return}
    if(action==='hit'&&sender.role==='hunter'&&sender.alive){const target=this.room.players.find(p=>p.id===msg.targetId);if(!canServerRegisterHit(sender,target,24))return;target.health=clamp((target.health??3)-1,0,3);if(target.health<=0){if(this.room.settings.mode==='chaos'){target.role='hunter';target.prop=null;target.health=3;target.alive=true}else target.alive=false}this.broadcastState(true);this.broadcast({type:'action',action:'hit',playerId:sender.id,targetId:target.id,health:target.health,alive:target.alive,role:target.role});this.advanceClock();return}
  }
  async webSocketClose(ws){await this.ready;const a=ws.deserializeAttachment?.()||{},p=this.room?.players.find(q=>q.id===a.playerId);if(p&&!p.isBot){p.connected=false;this.broadcast({type:'presence',playerId:p.id,connected:false});this.broadcastState(false)}}
  async webSocketError(ws,error){console.error(JSON.stringify({message:'prop hunt websocket error',error:String(error)}));try{ws.close(1011,'socket error')}catch{}}
}
