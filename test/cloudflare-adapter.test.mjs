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
