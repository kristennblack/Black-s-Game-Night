import test from 'node:test';
import assert from 'node:assert/strict';
import {access,readFile} from 'node:fs/promises';
import {GameHub} from '../worker.mjs';

const root=new URL('../public/avatars/family-packs/',import.meta.url);
const packs=['anime','western','rich','homeless','country','chinese','african-american','native-american','south-asian','korean','superhero','criminal'];
const people=['john','kristen','holly','elizabeth','vanessa','logan','james','dorothy','nana','papa','kelsi','molly','gunner'];

async function post(hub,path,body){const r=await hub.fetch(new Request(`https://game.local/api/${path}`,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(body)}));const j=await r.json();assert.equal(r.status,200,`${path}: ${JSON.stringify(j)}`);return j}
async function state(hub,roomId,token){const r=await hub.fetch(new Request(`https://game.local/api/state?room=${roomId}&token=${token}`));assert.equal(r.status,200);return r.json()}
class MemoryStorage{constructor(){this.map=new Map()}async list({prefix=''}={}){return new Map([...this.map].filter(([k])=>k.startsWith(prefix)))}async get(k){return this.map.get(k)}async put(k,v){this.map.set(k,structuredClone(v))}}
function makeHub(){const storage=new MemoryStorage();const ctx={storage,waitUntil(){}};return new GameHub(ctx,{})}

test('v1.2.5 packages all 12 approved family avatar packs for all 13 family characters and pets',async()=>{
  const manifest=JSON.parse(await readFile(new URL('../public/avatars/family-packs/manifest.json',import.meta.url),'utf8'));
  assert.equal(manifest.version,'1.6.0-prop-mystery-test');
  assert.deepEqual(Object.keys(manifest.styles),packs);
  for(const pack of packs){
    assert.equal(Object.keys(manifest.styles[pack].avatars).length,13,pack);
    for(const id of people) await access(new URL(`${pack}/${id}.jpg`,root));
  }
});

test('v1.2.5 human avatar selector exposes original looks plus all approved family packs',async()=>{
  const app=await readFile(new URL('../public/app.js',import.meta.url),'utf8');
  for(const token of ['familyPackStyles','Anime','Western','Rich','Homeless','Country','Chinese-inspired','African American-inspired','Native American-inspired','South Asian-inspired','Korean-inspired','Superhero','Criminal Crew']) assert.ok(app.includes(token),token);
  assert.match(app,/lookOptionsForAvatar/);
  assert.match(app,/\/avatars\/family-packs\/\$\{pack\[0\]\}/);
  assert.match(app,/John keeps all 16 original looks plus all 12 approved family packs/);
  assert.match(app,/original four looks plus all 12 approved family packs/);
});

test('v1.2.5 computer players can be assigned a family character, avatar style and difficulty',async()=>{
  const app=await readFile(new URL('../public/app.js',import.meta.url),'utf8');
  assert.match(app,/id="botVariant"/);
  assert.match(app,/data-bot-variant/);
  assert.match(app,/Choose each computer's family character, avatar style and difficulty/);
  const hub=makeHub();
  const created=await post(hub,'create',{name:'Kristen',gameType:'screw'});
  const added=await post(hub,'addBot',{roomId:created.roomId,playerToken:created.playerToken,hostToken:created.hostToken,difficulty:'hard',avatar:'kristen',variant:9});
  assert.equal(added.avatar,'kristen');assert.equal(added.variant,9);
  let s=await state(hub,created.roomId,created.playerToken);let bot=s.players.find(p=>p.id===added.playerId);assert.equal(bot.variant,9);assert.equal(bot.botDifficulty,'hard');
  const updated=await post(hub,'updateBot',{roomId:created.roomId,playerToken:created.playerToken,hostToken:created.hostToken,targetId:bot.id,avatar:'john',variant:26,difficulty:'easy'});
  assert.equal(updated.avatar,'john');assert.equal(updated.variant,26);
  s=await state(hub,created.roomId,created.playerToken);bot=s.players.find(p=>p.id===added.playerId);assert.equal(bot.avatar,'john');assert.equal(bot.variant,26);assert.equal(bot.botDifficulty,'easy');
});

test('v1.2.5 home avatar destination shows the approved pack gallery',async()=>{
  const app=await readFile(new URL('../public/app.js',import.meta.url),'utf8');
  const css=await readFile(new URL('../public/styles.css',import.meta.url),'utf8');
  assert.match(app,/Approved family style packs/);
  assert.match(app,/family-pack-sheets/);
  assert.match(css,/\.home-avatar-pack-gallery/);
});
