import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const read=p=>fs.readFileSync(new URL(`../${p}`,import.meta.url),'utf8');

test('W13 cabin catalog remains authoritative under the promoted W16 runtime',()=>{
  assert.equal(read('CURRENT_RELEASE.txt').trim(),'GAME-NIGHT-STAGING-PHASE-W24-FLAGSHIP-EARRINGS-49');
  assert.equal(read('DESIGN_RELEASE.txt').trim(),'GAME-NIGHT-DESIGN-PHASE-W24-FLAGSHIP-EARRINGS-49');
  const master=read('MASTER_GAME_DESIGN_PRODUCTION_PROMPT_W13.md');
  assert.match(master,/HIGHEST-PRECEDENCE CURRENT MASTER PROMPT/);
  assert.match(master,/Runtime release: `GAME-NIGHT-STAGING-PHASE-W12-GAMEPLAY-CORRECTIONS-36`/);
});

test('W13 cabin catalog contains exactly 400 original room entries in the locked distribution',()=>{
  const data=JSON.parse(read('CABIN_ROOM_ITEM_CATALOG_W13.json'));
  assert.equal(data.length,400);
  const count=type=>data.filter(x=>x['Source Type']===type).length;
  assert.equal(count('Buy with Game Night Tokens'),175);
  assert.equal(count('Win in Arcade'),144);
  assert.equal(count('Achievement Reward'),6);
  assert.equal(count('Birthday / Seasonal Reward'),35);
  assert.equal(count('Collection Completion Reward'),20);
  assert.equal(count('Secret / Prestige'),20);
  assert.equal(new Set(data.map(x=>x['Item ID'])).size,400);
});

test('each active arcade receives nine room rewards and every secret hides its player-facing condition',()=>{
  const data=JSON.parse(read('CABIN_ROOM_ITEM_CATALOG_W13.json'));
  const rewards=data.filter(x=>x['Source Type']==='Win in Arcade');
  const byGame=new Map();
  for(const item of rewards)byGame.set(item['Source Game'],(byGame.get(item['Source Game'])||0)+1);
  assert.equal(byGame.size,16);
  for(const [game,n] of byGame)assert.equal(n,9,game);
  for(const item of data.filter(x=>x.Secret==='Yes'))assert.equal(item['Visible Unlock Condition'],'???');
});

test('W13 locks owner-only rooms, blueprint ownership, Game Night Tokens, gifts, salvage, pets and dollhouse navigation',()=>{
  const d=read('MASTER_PHASE_W13_CABIN_ROOMS_COLLECTIONS_DIRECTIVE.md');
  for(const token of ['VISIT THE CABIN','true 3D aerial/dollhouse','Only the room owner','Game Night Tokens','blueprint','duplicate reward copies may be salvaged','gifts appear wrapped','Kelsi, Molly and Gunner','90-degree steps','400 total']) assert.ok(d.includes(token),token);
});
