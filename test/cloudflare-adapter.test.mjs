import test from 'node:test';
import assert from 'node:assert/strict';
import { GameHub } from '../worker.mjs';
import { GAME_TYPES } from '../gameEngine.mjs';

class MemoryStorage {
  constructor(){ this.map=new Map(); }
  async list({prefix='' }={}){ return new Map([...this.map].filter(([k])=>k.startsWith(prefix))); }
  async get(k){ return this.map.get(k); }
  async put(k,v){ this.map.set(k, structuredClone(v)); }
}
function makeHub(){
  const storage=new MemoryStorage();
  const waits=[];
  const ctx={storage,waitUntil(p){waits.push(Promise.resolve(p));}};
  const hub=new GameHub(ctx,{});
  return {hub,storage,flush:async()=>{while(waits.length) await Promise.all(waits.splice(0));}};
}
async function post(hub,path,body){
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

const starts=[
  [GAME_TYPES.SCREW,2],[GAME_TYPES.FUCK,2],[GAME_TYPES.SMEAR,4],[GAME_TYPES.CAMPFIRE,2],
  [GAME_TYPES.TRAIL,2],[GAME_TYPES.PRAIRIE,2],[GAME_TYPES.BURN_LOGS,2],[GAME_TYPES.DECK_SWEEP,2],
  [GAME_TYPES.CRIBBAGE,2],[GAME_TYPES.MARBLES,2],[GAME_TYPES.EUCHRE,4],[GAME_TYPES.THIRTY_ONE,2],
  [GAME_TYPES.GOLF,2],[GAME_TYPES.CRAZY_EIGHTS,2],[GAME_TYPES.MITTS,2],[GAME_TYPES.POKER,2],
  [GAME_TYPES.PRESIDENT,3],[GAME_TYPES.LAST_HAVEN,2],[GAME_TYPES.MEXICAN_TRAIN,2],
  [GAME_TYPES.SKIP_BO,2],[GAME_TYPES.BACKGAMMON,2]
];

test('Cloudflare adapter creates, seats, readies and starts all 21 games', async()=>{
  const {hub,flush}=makeHub();
  for(const [gameType,count] of starts){
    const created=await post(hub,'create',{name:'John Black',gameType});
    const players=[{token:created.playerToken}];
    for(let i=1;i<count;i++) players.push({token:(await post(hub,'join',{roomId:created.roomId,name:`Player ${i+1}`})).playerToken});
    for(let i=0;i<players.length;i++){
      await post(hub,'seat',{roomId:created.roomId,playerToken:players[i].token,seat:i});
      await post(hub,'ready',{roomId:created.roomId,playerToken:players[i].token,ready:true});
    }
    await post(hub,'start',{roomId:created.roomId,hostToken:created.hostToken});
    const s=await state(hub,created.roomId,created.playerToken);
    assert.equal(s.gameType,gameType);
    assert.notEqual(s.game.phase,'lobby');
    assert.equal(s.players[0].avatar,'john');
    assert.ok(Array.isArray(s.game.hand));
    // Privacy: other players expose only counts, never their cards in the player list.
    for(const p of s.players) assert.equal('hand' in p,false);
  }
  await flush();
});

test('All 21 table games can launch solo with computer players at Easy, Medium or Hard difficulty', async()=>{
  for(const difficulty of ['easy','medium','hard']){
    const {hub}=makeHub();
    for(const [gameType,count] of starts){
      const created=await post(hub,'create',{name:'Kristen',gameType});
      for(let i=1;i<count;i++)await post(hub,'addBot',{roomId:created.roomId,hostToken:created.hostToken,difficulty});
      await post(hub,'ready',{roomId:created.roomId,playerToken:created.playerToken,ready:true});
      const lobby=await state(hub,created.roomId,created.playerToken);
      assert.equal(lobby.players.length,count,`${gameType} did not fill required seats`);
      assert.equal(lobby.players.filter(p=>p.isBot).length,count-1,`${gameType} missing computer players`);
      assert.ok(lobby.players.filter(p=>p.isBot).every(p=>p.botDifficulty===difficulty),`${gameType} lost ${difficulty} difficulty`);
      await post(hub,'start',{roomId:created.roomId,hostToken:created.hostToken});
      for(let i=0;i<5;i++)await post(hub,'botTick',{roomId:created.roomId,hostToken:created.hostToken});
      const started=await state(hub,created.roomId,created.playerToken);
      assert.notEqual(started.game.phase,'lobby',`${gameType} failed solo computer launch`);
    }
  }
});

test('Cloudflare adapter persists room snapshots to Durable Object storage', async()=>{
  const {hub,storage,flush}=makeHub();
  const created=await post(hub,'create',{name:'John Black',gameType:GAME_TYPES.SCREW});
  await post(hub,'seat',{roomId:created.roomId,playerToken:created.playerToken,seat:0});
  await flush();
  const saved=await storage.get(`room:${created.roomId}`);
  assert.ok(saved);
  assert.equal(saved.players[0].name,'John Black');
  assert.equal(saved.players[0].avatar,'john');
});


test('Cloudflare live room stream returns the initial state without hanging', async()=>{
  const {hub}=makeHub();
  const created=await post(hub,'create',{name:'John Black',gameType:GAME_TYPES.SCREW});
  const response=await Promise.race([
    hub.fetch(new Request(`https://game.test/api/events?room=${encodeURIComponent(created.roomId)}&token=${encodeURIComponent(created.playerToken)}`)),
    new Promise((_,reject)=>setTimeout(()=>reject(new Error('SSE response timed out')),1000))
  ]);
  assert.equal(response.ok,true);
  assert.match(response.headers.get('content-type')||'',/text\/event-stream/);
  const reader=response.body.getReader();
  const first=await Promise.race([
    reader.read(),
    new Promise((_,reject)=>setTimeout(()=>reject(new Error('Initial SSE state timed out')),1000))
  ]);
  const text=new TextDecoder().decode(first.value||new Uint8Array());
  assert.match(text,/event: state/);
  assert.match(text,new RegExp(created.roomId));
  await reader.cancel();
});

test('Launch UI removes the nonfunctional install button and provides room retry controls', async()=>{
  const {readFile}=await import('node:fs/promises');
  const appSource=await readFile(new URL('../public/app.js',import.meta.url),'utf8');
  assert.doesNotMatch(appSource,/Install App|data-action=["']install["']|beforeinstallprompt|installPrompt/);
  assert.match(appSource,/Retry Connection/);
  assert.match(appSource,/data-action="retryConnect"/);
});

test('Launch assets advertise the Phase E staging build and use a fresh service-worker cache', async()=>{
  const {readFile}=await import('node:fs/promises');
  const appSource=await readFile(new URL('../public/app.js',import.meta.url),'utf8');
  const swSource=await readFile(new URL('../public/sw.js',import.meta.url),'utf8');
  assert.match(appSource,/APP_VERSION='GAME-NIGHT-STAGING-PHASE-R-PROP-HUNT-P2-GAMMON-UX-16'/);
  assert.match(swSource,/black-family-game-night-staging-phase-r-prop-hunt-p2-gammon-ux-16/);
});


test('Ready auto-assigns an open seat when a player did not choose one', async()=>{
  const {hub}=makeHub();
  const created=await post(hub,'create',{name:'John Black',gameType:GAME_TYPES.SCREW});
  const joined=await post(hub,'join',{roomId:created.roomId,name:'Kristen'});
  await post(hub,'ready',{roomId:created.roomId,playerToken:created.playerToken,ready:true});
  await post(hub,'ready',{roomId:created.roomId,playerToken:joined.playerToken,ready:true});
  const s=await state(hub,created.roomId,created.playerToken);
  assert.deepEqual(new Set(s.players.map(p=>p.seat)),new Set([0,1]));
  assert.ok(s.players.every(p=>p.ready));
  await post(hub,'start',{roomId:created.roomId,hostToken:created.hostToken});
  const started=await state(hub,created.roomId,created.playerToken);
  assert.equal(started.game.phase,'bidding');
  assert.ok(started.game.hand.length>0,'Screw hand should be dealt before bidding');
});

test('Fuck Your Buddy exposes the viewer hand during bidding', async()=>{
  const {hub}=makeHub();
  const created=await post(hub,'create',{name:'John Black',gameType:GAME_TYPES.FUCK});
  const joined=await post(hub,'join',{roomId:created.roomId,name:'Kristen'});
  await post(hub,'ready',{roomId:created.roomId,playerToken:created.playerToken,ready:true});
  await post(hub,'ready',{roomId:created.roomId,playerToken:joined.playerToken,ready:true});
  await post(hub,'start',{roomId:created.roomId,hostToken:created.hostToken});
  const a=await state(hub,created.roomId,created.playerToken);
  const b=await state(hub,created.roomId,joined.playerToken);
  assert.equal(a.game.phase,'bidding');
  assert.ok(a.game.hand.length>0);
  assert.ok(b.game.hand.length>0);
});

test('Chat is stored once and visible to the other player', async()=>{
  const {hub}=makeHub();
  const created=await post(hub,'create',{name:'John Black',gameType:GAME_TYPES.SCREW});
  const joined=await post(hub,'join',{roomId:created.roomId,name:'Kristen'});
  const before=await state(hub,created.roomId,joined.playerToken);
  await post(hub,'chat',{roomId:created.roomId,playerToken:created.playerToken,text:'Testing family chat'});
  const after=await state(hub,created.roomId,joined.playerToken);
  assert.ok(after.revision>before.revision);
  assert.equal(after.chat.at(-1).name,'John Black');
  assert.equal(after.chat.at(-1).text,'Testing family chat');
});

test('Family-play UI includes Game Shelf home, bid-hand visibility, middle-finger reaction, and no voice controls', async()=>{
  const {readFile}=await import('node:fs/promises');
  const appSource=await readFile(new URL('../public/app.js',import.meta.url),'utf8');
  assert.match(appSource,/⌂ Game Shelf/);
  assert.match(appSource,/showBidHand/);
  assert.match(appSource,/🖕/);
  assert.doesNotMatch(appSource,/Join Voice|Voice chat|voiceToggle|voiceMute|getUserMedia/);
  assert.doesNotMatch(appSource,/avatar-style-mark/);
  assert.match(appSource,/setInterval\(\(\)=>hydrate\(false\),1500\)/);
});

test('All 18 games can auto-seat players who simply press Ready', async()=>{
  const {hub}=makeHub();
  for(const [gameType,count] of starts){
    const created=await post(hub,'create',{name:'John Black',gameType});
    const tokens=[created.playerToken];
    for(let i=1;i<count;i++)tokens.push((await post(hub,'join',{roomId:created.roomId,name:`Auto ${i+1}`})).playerToken);
    for(const playerToken of tokens)await post(hub,'ready',{roomId:created.roomId,playerToken,ready:true});
    const lobby=await state(hub,created.roomId,created.playerToken);
    assert.ok(lobby.players.every(p=>Number.isInteger(p.seat)),`${gameType} left an unseated ready player`);
    assert.equal(new Set(lobby.players.map(p=>p.seat)).size,count,`${gameType} duplicated an assigned seat`);
    await post(hub,'start',{roomId:created.roomId,hostToken:created.hostToken});
    const started=await state(hub,created.roomId,created.playerToken);
    assert.notEqual(started.game.phase,'lobby');
  }
});

test('Middle-finger quick reaction is accepted and broadcast in room state', async()=>{
  const {hub}=makeHub();
  const created=await post(hub,'create',{name:'John Black',gameType:GAME_TYPES.SCREW});
  await post(hub,'react',{roomId:created.roomId,playerToken:created.playerToken,emoji:'🖕'});
  const s=await state(hub,created.roomId,created.playerToken);
  assert.equal(s.reaction.emoji,'🖕');
});


test('Named Black family and pet players receive their matching avatar automatically', async()=>{
  const {hub}=makeHub();
  const created=await post(hub,'create',{name:'Kristen',gameType:GAME_TYPES.SCREW});
  const expected={Dorothy:'dorothy',James:'james',Elizabeth:'elizabeth',Holly:'holly',Vanessa:'vanessa',Logan:'logan',Papa:'papa',Nana:'nana',Molly:'molly',Kelsi:'kelsi',Gunner:'gunner'};
  for(const [name,avatar] of Object.entries(expected)){
    const joined=await post(hub,'join',{roomId:created.roomId,name});
    const s=await state(hub,created.roomId,joined.playerToken);
    assert.equal(s.players.find(p=>p.id===s.viewerId).avatar,avatar,`${name} should default to ${avatar}`);
  }
  const hostState=await state(hub,created.roomId,created.playerToken);
  assert.equal(hostState.players.find(p=>p.id===hostState.viewerId).avatar,'kristen');
});

test('All named family avatars have four style image files and remain alongside the original library', async()=>{
  const {access,readFile}=await import('node:fs/promises');
  const ids=['dorothy','james','elizabeth','holly','vanessa','logan','papa','nana','kristen','molly','kelsi','gunner'];
  const styles=['cute','goofy','rugged','glam'];
  for(const id of ids) for(const style of styles) await access(new URL(`../public/avatars/styles/${id}-${style}.jpg`,import.meta.url));
  const appSource=await readFile(new URL('../public/app.js',import.meta.url),'utf8');
  for(const id of ids) assert.match(appSource,new RegExp(`\\['${id}'`));
  for(const original of ['cowboy','ballerina','construction','firefighter','chef','pirate','wizard','astronaut','princess','detective','lumberjack','hockey','braids','glasses','grandma','grandpa','fancy','moustache','pajamas','coolcap']) assert.match(appSource,new RegExp(`\\['${original}'`));
  assert.match(appSource,/Black Family & Pets/);
  assert.match(appSource,/Original Characters/);
});


test('John Black defaults to Birthday Guy and supports all 16 exclusive birthday looks', async()=>{
  const {hub}=makeHub();
  const created=await post(hub,'create',{name:'John Black',gameType:GAME_TYPES.SCREW});
  let s=await state(hub,created.roomId,created.playerToken);
  let john=s.players.find(p=>p.id===s.viewerId);
  assert.equal(john.avatar,'john');
  assert.equal(john.variant,1,'John should start on Birthday Guy look #2');
  await post(hub,'profile',{roomId:created.roomId,playerToken:created.playerToken,name:'John Black',avatar:'john',variant:15,outfitVariant:0,color:john.color});
  s=await state(hub,created.roomId,created.playerToken);
  john=s.players.find(p=>p.id===s.viewerId);
  assert.equal(john.variant,15,'John should be able to select look #16');
});

test('All 16 John look image files are packaged and the UI exposes the full Birthday Boy lookbook', async()=>{
  const {access,readFile}=await import('node:fs/promises');
  for(let i=1;i<=16;i++) await access(new URL(`../public/avatars/styles/john-look-${String(i).padStart(2,'0')}.jpg`,import.meta.url));
  const appSource=await readFile(new URL('../public/app.js',import.meta.url),'utf8');
  const cssSource=await readFile(new URL('../public/styles.css',import.meta.url),'utf8');
  assert.match(appSource,/const johnLooks=\[/);
  assert.match(appSource,/John gets all 16 Birthday Boy looks/);
  assert.match(appSource,/john-look-16/);
  assert.match(appSource,/selectedLookPicker/);
  assert.match(cssSource,/\.john-look-grid/);
  assert.match(cssSource,/\.john-look-choice/);
});


test('Avatar picker is character-first and reveals only the selected character looks beneath it', async()=>{
  const {readFile}=await import('node:fs/promises');
  const appSource=await readFile(new URL('../public/app.js',import.meta.url),'utf8');
  const cssSource=await readFile(new URL('../public/styles.css',import.meta.url),'utf8');
  assert.match(appSource,/Choose your character/);
  assert.match(appSource,/selectedLookPicker\(selected,me\)/);
  assert.match(appSource,/Choose \$\{esc\(selected\[1\]/);
  assert.match(appSource,/Choose your player colour/);
  assert.doesNotMatch(appSource,/avatar-style-grid/);
  assert.match(cssSource,/\.character-choice-grid/);
  assert.match(cssSource,/\.look-grid/);
  assert.match(cssSource,/\.colour-choice-columns/);
});

test('Refreshed original avatars and centered Elizabeth and Holly portraits are packaged at higher quality', async()=>{
  const {stat}=await import('node:fs/promises');
  const originals=['cowboy','ballerina','construction','firefighter','chef','pirate','wizard','astronaut','princess','detective','lumberjack','hockey','braids','glasses','grandma','grandpa','fancy','moustache','pajamas','coolcap'];
  for(const id of originals){
    const info=await stat(new URL(`../public/avatars/styles/${id}-cute.jpg`,import.meta.url));
    assert.ok(info.size>40000,`${id} cute portrait should be the sharpened high-quality asset`);
  }
  for(const file of ['elizabeth-cute.jpg','elizabeth-goofy.jpg','elizabeth-rugged.jpg','elizabeth-glam.jpg','holly-cute.jpg','holly-goofy.jpg','holly-rugged.jpg','holly-glam.jpg']){
    const info=await stat(new URL(`../public/avatars/styles/${file}`,import.meta.url));
    assert.ok(info.size>100000,`${file} should use the recentered high-resolution crop`);
  }
});


test('Host can switch the existing room to a new game while all players and tokens stay together', async()=>{
  const {hub}=makeHub();
  const created=await post(hub,'create',{name:'John Black',gameType:GAME_TYPES.SCREW});
  const joined=await post(hub,'join',{roomId:created.roomId,name:'Kristen'});
  await post(hub,'ready',{roomId:created.roomId,playerToken:created.playerToken,ready:true});
  await post(hub,'ready',{roomId:created.roomId,playerToken:joined.playerToken,ready:true});
  await post(hub,'start',{roomId:created.roomId,hostToken:created.hostToken});
  const before=await state(hub,created.roomId,joined.playerToken);
  const ids=new Set(before.players.map(p=>p.id));
  await post(hub,'switchGame',{roomId:created.roomId,playerToken:created.playerToken,hostToken:created.hostToken,gameType:GAME_TYPES.PRAIRIE});
  const hostView=await state(hub,created.roomId,created.playerToken);
  const guestView=await state(hub,created.roomId,joined.playerToken);
  assert.equal(hostView.gameType,GAME_TYPES.PRAIRIE);
  assert.equal(hostView.game.phase,'lobby');
  assert.deepEqual(new Set(hostView.players.map(p=>p.id)),ids);
  assert.equal(guestView.viewerId,joined.playerId,'guest token should remain valid after game switch');
  assert.ok(hostView.players.every(p=>p.ready===false&&p.seat===null),'new game should reset Ready and seats');
  assert.equal(hostView.chat.at(-1).name,'Game Lodge');
  assert.match(hostView.chat.at(-1).text,/Prairie Pots/);
});

test('Host can add Easy, Medium or Hard computer players and start solo', async()=>{
  const {hub}=makeHub();
  const created=await post(hub,'create',{name:'Kristen',gameType:GAME_TYPES.SCREW});
  for(const difficulty of ['easy','medium','hard'])await post(hub,'addBot',{roomId:created.roomId,playerToken:created.playerToken,hostToken:created.hostToken,difficulty});
  await post(hub,'ready',{roomId:created.roomId,playerToken:created.playerToken,ready:true});
  let s=await state(hub,created.roomId,created.playerToken);
  assert.equal(s.players.filter(p=>p.isBot).length,3);
  assert.deepEqual(new Set(s.players.filter(p=>p.isBot).map(p=>p.botDifficulty)),new Set(['easy','medium','hard']));
  assert.ok(s.players.filter(p=>p.isBot).every(p=>p.ready&&p.connected));
  await post(hub,'start',{roomId:created.roomId,hostToken:created.hostToken});
  s=await state(hub,created.roomId,created.playerToken);
  assert.notEqual(s.game.phase,'lobby');
});

test('Host can choose and later change each computer family character and difficulty', async()=>{
  const {hub}=makeHub();
  const created=await post(hub,'create',{name:'Kristen',gameType:GAME_TYPES.SCREW});
  const added=await post(hub,'addBot',{roomId:created.roomId,playerToken:created.playerToken,hostToken:created.hostToken,difficulty:'easy',avatar:'gunner'});
  let s=await state(hub,created.roomId,created.playerToken);
  let bot=s.players.find(p=>p.id===added.playerId);
  assert.equal(bot.avatar,'gunner');
  assert.equal(bot.botDifficulty,'easy');
  await post(hub,'updateBot',{roomId:created.roomId,playerToken:created.playerToken,hostToken:created.hostToken,targetId:bot.id,avatar:'papa',difficulty:'hard'});
  s=await state(hub,created.roomId,created.playerToken);
  bot=s.players.find(p=>p.id===added.playerId);
  assert.equal(bot.avatar,'papa');
  assert.equal(bot.botDifficulty,'hard');
  assert.match(bot.name,/Papa/);
});

test('botTick advances a computer turn without exposing hidden hands', async()=>{
  const {hub}=makeHub();
  const created=await post(hub,'create',{name:'Kristen',gameType:GAME_TYPES.SCREW});
  await post(hub,'addBot',{roomId:created.roomId,playerToken:created.playerToken,hostToken:created.hostToken,difficulty:'medium'});
  await post(hub,'ready',{roomId:created.roomId,playerToken:created.playerToken,ready:true});
  await post(hub,'start',{roomId:created.roomId,hostToken:created.hostToken});
  let s=await state(hub,created.roomId,created.playerToken);
  for(let i=0;i<8;i++){
    const before=s.revision;
    const r=await post(hub,'botTick',{roomId:created.roomId,playerToken:created.playerToken,hostToken:created.hostToken});
    s=await state(hub,created.roomId,created.playerToken);
    if(r.acted)assert.ok(s.revision>before);
    if(s.game.bidTurnId===s.viewerId||s.game.turnPlayerId===s.viewerId)break;
  }
  for(const p of s.players)assert.equal('hand' in p,false);
});
