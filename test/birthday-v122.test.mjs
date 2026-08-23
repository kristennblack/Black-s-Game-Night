import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';
const js=await readFile(new URL('../public/birthday-climb.js',import.meta.url),'utf8');
const css=await readFile(new URL('../public/birthday-climb.css',import.meta.url),'utf8');
const sandbox={window:{FAMILY:{people:[],supports:[]}},location:{href:'http://localhost/new-games.html'},Image:class{},URL,Math,Map,performance:{now:()=>0},console,setTimeout,clearTimeout};
vm.createContext(sandbox);vm.runInContext(js,sandbox);
const exposed=sandbox.window.__BIRTHDAY_CLIMB_TEST__;

test('Birthday Seat has exactly eight locked color themes',()=>{
  assert.equal(exposed.stages.length,8);
  assert.deepEqual(Array.from(exposed.stages,s=>s.name),['Backyard','Camper',"Papa's Shop",'Farmyard','Fire Pit','Family Chaos','Birthday Party','Final Climb']);
});

test('each color level has five to seven main route obstacles',()=>{
  for(const stage of exposed.stages){
    const routes=new Set(exposed.course.filter(p=>p.variant==='main'&&p.route>=stage.at&&p.route<=stage.end).map(p=>p.route));
    assert.ok(routes.size>=5&&routes.size<=7,`${stage.name} has ${routes.size} obstacles`);
  }
});

test('Birthday Seat includes checkpoint and reset hazards',()=>{
  assert.equal(exposed.hazards.length,8);
  for(const t of ['Pool Water','Lake Water','Oily Shop Floor','Pig Mud','Hot Coals',"Don't Touch",'Party Spill','checkpoints:true','hazards:true']) assert.ok(js.includes(t),t);
});

test('Birthday Seat mixes obstacle types instead of only static boxes',()=>{
  for(const t of ['Trampoline','Bunk Ladder','Camper Slide','Moving Tool Cart','Falling Barn Board','Hot Plate','Disappearing Plank','Doorway Maze','Cake Bounce','Golden Balance Beam']) assert.ok(js.includes(t),t);
  assert.equal(exposed.features.movingPlatforms,true);
  assert.equal(exposed.features.fallingPlatforms,true);
  assert.equal(exposed.features.disappearingPlatforms,true);
  assert.equal(exposed.features.alternateRoutes,true);
});

test('Birthday Seat is landscape immersive with only joystick and jump visible as gameplay controls',()=>{
  for(const t of ['birthday-game-active','bc-landscape-prompt','bc-joy','bc-act jump','Turn your phone sideways']) assert.ok(js.includes(t)||css.includes(t),t);
  assert.equal(exposed.features.landscapeOnly,true);
  assert.equal(exposed.features.joystick,true);
  assert.equal(exposed.features.jumpOnly,true);
  assert.equal(js.includes('bc-act sprint'),false);
});

test('Birthday Seat is human-only with no bot racers',()=>{
  assert.equal(exposed.features.bots,false);
  assert.ok(js.includes('Human racers only · no computers'));
  assert.equal(js.includes('data-bc-bot-char'),false);
});

test('approved full-body family sprites and crown/confetti throne finish are retained',()=>{
  for(const t of ['/characters3d/','bc-throne-win','bc-confetti','claimed John\'s Birthday Seat','👑']) assert.ok(js.includes(t)||css.includes(t),t);
});
