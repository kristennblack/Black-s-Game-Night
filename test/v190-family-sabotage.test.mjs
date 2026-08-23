import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';

const js=await readFile(new URL('../public/family-sabotage.js',import.meta.url),'utf8');
const css=await readFile(new URL('../public/family-sabotage.css',import.meta.url),'utf8');
const html=await readFile(new URL('../public/new-games.html',import.meta.url),'utf8');
const app=await readFile(new URL('../public/app.js',import.meta.url),'utf8');
const sw=await readFile(new URL('../public/sw.js',import.meta.url),'utf8');
const family={people:[{id:'john',name:'John',short:'JO'},{id:'kristen',name:'Kristen',short:'KR'}],supports:[{id:'papa',name:'Papa',short:'PA'}]};
const sandbox={window:{FAMILY:family,APP:{toast(){}}},Image:class{constructor(){this.complete=false;this.naturalWidth=0;this.naturalHeight=0}},performance:{now:()=>0},location:{href:'https://example.test/new-games.html?game=sabotage',search:'?game=sabotage'},URL,Math,Map,Set,Object,Array,console,setTimeout,clearTimeout,setInterval,clearInterval,requestAnimationFrame:()=>1,cancelAnimationFrame(){},devicePixelRatio:1,document:{querySelector(){return null}}};
vm.createContext(sandbox);vm.runInContext(js,sandbox);
const fs=sandbox.window.__FAMILY_SABOTAGE_TEST__;

test('Family Sabotage is registered in the game shelf and direct new-game loader',()=>{
  assert.match(html,/data-game="sabotage"/);assert.match(html,/screen-sabotage/);assert.match(html,/FamilySabotage\.mount/);assert.match(app,/sabotage:\{name:'Family Sabotage'/);
});

test('Family Sabotage uses original secret teams plus a crew Fixer role',()=>{
  assert.equal(fs.ROLES.crew.team,'crew');assert.equal(fs.ROLES.fixer.team,'crew');assert.equal(fs.ROLES.saboteur.team,'saboteur');assert.equal(fs.features.secretRoleReveal,true);assert.equal(fs.features.fixer,true);
});

test('service vents form a connected room travel network',()=>{
  const map={zones:[{name:'Shop',x:0,z:0,w:200,d:200},{name:'Barn',x:300,z:0,w:200,d:200},{name:'Kitchen',x:600,z:0,w:200,d:200},{name:'Cellar',x:900,z:0,w:200,d:200}]};
  const vents=fs.buildVents(map);assert.equal(vents.length,4);assert.ok(vents.every(v=>v.links.length>=2));assert.ok(vents.every(v=>v.name.includes('Service Vent')));
});

test('core social-deduction systems are present: chores, fake chores, sabotage, report, emergency, meeting chat and voting',()=>{
  for(const key of ['tasks','fakeTasks','sabotages','criticalSabotage','bodyReports','emergencyButton','meetingChat','voting','skipVote'])assert.equal(fs.features[key],true,key);
  for(const text of ['START SECRET-ROLE MATCH','Emergency Button','BODY REPORTED','CAST VOTE','SKIP VOTE','SABOTEUR FAKE CHORE','GENERATOR OVERLOAD'])assert.ok(js.includes(text),text);
});

test('Family Sabotage reuses Prop Hunt map geometry and full-body family characters',()=>{
  assert.equal(fs.features.propHuntMaps,true);assert.equal(fs.features.fullBodyFamilySprites,true);assert.equal(fs.features.sharedIllustratedPropArt,true);assert.match(js,/__PROP_3D_TEST__\?\.MAPS/);assert.match(js,/\/characters3d\//);assert.match(js,/\/prop-sprites\//);
});

test('phone and desktop controls are both wired',()=>{
  assert.equal(fs.features.phoneJoystick,true);assert.equal(fs.features.keyboardControls,true);for(const text of ['fs-joystick','KeyW','KeyA','KeyS','KeyD','KeyE','KeyR','KeyQ','KeyM'])assert.ok(js.includes(text)||css.includes(text),text);
});

test('computer seats preserve per-bot character, style and difficulty selectors',()=>{
  assert.equal(fs.features.computerPlayers,true);assert.equal(fs.features.perBotCharacter,true);assert.equal(fs.features.perBotStyle,true);for(const text of ['data-fs-bot-char','data-fs-bot-style','data-fs-bot-diff','Easy','Medium','Hard'])assert.ok(js.includes(text),text);
});

test('v1.9 service worker caches the new game assets and new cache name',()=>{
  assert.match(sw,/v190-family-sabotage/);assert.match(sw,/family-sabotage\.js/);assert.match(sw,/family-sabotage\.css/);
});
