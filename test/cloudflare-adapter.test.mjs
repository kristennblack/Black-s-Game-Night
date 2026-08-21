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
  [GAME_TYPES.PRESIDENT,3],[GAME_TYPES.LAST_HAVEN,2]
];

test('Cloudflare adapter creates, seats, readies and starts all 18 games', async()=>{
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

test('Launch assets advertise v1.0.2 and use a fresh service-worker cache', async()=>{
  const {readFile}=await import('node:fs/promises');
  const appSource=await readFile(new URL('../public/app.js',import.meta.url),'utf8');
  const swSource=await readFile(new URL('../public/sw.js',import.meta.url),'utf8');
  assert.match(appSource,/APP_VERSION='1\.0\.2'/);
  assert.match(swSource,/black-family-game-night-v102/);
});
