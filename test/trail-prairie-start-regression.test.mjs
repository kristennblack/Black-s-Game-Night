import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { GameHub } from '../worker.mjs';
import { GAME_TYPES } from '../gameEngine.mjs';

class MemoryStorage {
  constructor(){ this.map=new Map(); }
  async list({prefix=''}={}){ return new Map([...this.map].filter(([k])=>k.startsWith(prefix))); }
  async get(k){ return this.map.get(k); }
  async put(k,v){ this.map.set(k,structuredClone(v)); }
}
function makeHub(){
  const storage=new MemoryStorage();
  const ctx={storage,waitUntil(){}};
  return new GameHub(ctx,{});
}
async function post(hub,path,body){
  const r=await hub.fetch(new Request(`https://game.test/api/${path}`,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(body)}));
  const data=await r.json();
  assert.equal(r.ok,true,`${path} failed: ${JSON.stringify(data)}`);
  return data;
}
async function state(hub,roomId,token){
  const r=await hub.fetch(new Request(`https://game.test/api/state?room=${encodeURIComponent(roomId)}&token=${encodeURIComponent(token)}`));
  assert.equal(r.ok,true);
  return r.json();
}

for(const gameType of [GAME_TYPES.TRAIL,GAME_TYPES.PRAIRIE]){
  test(`${gameType} quick-start sequence works with one host plus one computer`,async()=>{
    const hub=makeHub();
    const created=await post(hub,'create',{name:'Kristen',gameType});
    await post(hub,'addBot',{roomId:created.roomId,playerToken:created.playerToken,hostToken:created.hostToken,difficulty:'medium'});
    await post(hub,'ready',{roomId:created.roomId,playerToken:created.playerToken,ready:true});
    await post(hub,'start',{roomId:created.roomId,playerToken:created.playerToken,hostToken:created.hostToken});
    const s=await state(hub,created.roomId,created.playerToken);
    assert.notEqual(s.game.phase,'lobby');
    assert.equal(s.players.length,2);
    assert.ok(s.players.some(p=>p.isBot&&p.ready));
    assert.ok(s.game.extra,`${gameType} should publish live extra-game state after start`);
  });
}

test('lobby exposes actionable Trail Trouble / Prairie Pots start controls instead of a silent disabled start',async()=>{
  const app=await readFile(new URL('../public/app.js',import.meta.url),'utf8');
  assert.match(app,/Quick Start vs Computer/);
  assert.match(app,/Ready & Start/);
  assert.match(app,/GAME\.TRAIL,GAME\.PRAIRIE/);
  assert.match(app,/Adds one Medium computer/);
});
