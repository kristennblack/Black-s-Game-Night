import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {PropHuntRoom} from '../propHuntRoom.mjs';

const read=p=>fs.readFileSync(new URL(`../${p}`,import.meta.url),'utf8');
const BUILD='GAME-NIGHT-STAGING-PHASE-U2-ARCADE-PACK-22';
const CACHE='black-family-game-night-staging-phase-u2-arcade-pack-22';
class FakeSql {constructor(){this.row=null;}exec(q,...args){if(/^SELECT json/i.test(q))return{toArray:()=>this.row?[{json:this.row}]:[]};if(/^INSERT INTO prop_room/i.test(q)){this.row=args[0];return{toArray:()=>[]}}return{toArray:()=>[]}}}
function makeRoom(){const sql=new FakeSql(),ctx={storage:{sql},blockConcurrencyWhile(fn){return Promise.resolve().then(fn)},getWebSockets(){return[]},acceptWebSocket(){},waitUntil(){}};return new PropHuntRoom(ctx,{})}

test('Phase T1 has a fresh isolated build/cache identity',()=>{assert.equal(read('VERSION.txt').trim(),BUILD);assert.match(read('public/app.js'),new RegExp(BUILD));assert.match(read('public/sw.js'),new RegExp(CACHE));assert.match(read('wrangler.staging.jsonc'),/black-family-game-night-phase-t1-staging/)});

test('hunter gets an opaque hide countdown and no separate aim button',()=>{const js=read('public/prop-hunt-3d.js'),css=read('public/prop-hunt-3d.css');for(const token of ['phHideBlind','HIDERS ARE HIDING','phHideCountdown','isHunterHidePhase','updateHunterHideOverlay','HUNT!'])assert.ok(js.includes(token),token);assert.ok(!js.includes('id="phAim"'));assert.match(css,/\.ph3d-hide-blind\{[^}]*background:#000/);assert.match(css,/z-index:60/)});

test('protected hide phase freezes hunter movement, look and weapon',()=>{const js=read('public/prop-hunt-3d.js');assert.match(js,/if\(isHunterHidePhase\(\)\)\{a\.vx=a\.vz=a\.vy=0/);assert.match(js,/if\(!blindHunter\)gameplay\.applyGamepadLook/);assert.match(js,/roomState\.phase!=='hunt'/);assert.match(js,/input\.shoot=false;game\.padShoot=false/)});

test('crosshair is always the hunter aim and hold SHOOT continuously fires at a controlled rate',()=>{const js=read('public/prop-hunt-3d.js');assert.match(js,/const HUNTER_FIRE_INTERVAL=1\/4\.8/);assert.match(js,/const aiming=a\.role==='hunter'/);assert.match(js,/game\.shotCooldown=HUNTER_FIRE_INTERVAL/);assert.match(js,/if\(\(input\.shoot\|\|game\.padShoot\)&&!blindHunter\)shoot\(\)/);assert.match(js,/shootBtn\.onpointerdown=startFire/);assert.match(js,/Crosshair: <b>ALWAYS ACTIVE<\/b>/)});

test('server masks hider position/disguise/decoys from a hunter during hide',()=>{const room=makeRoom();room.room={id:'x',createdAt:1,revision:1,hostPlayerId:'h',phase:'hide',phaseEndsAt:Date.now()+30000,round:1,wins:{hiders:0,hunters:0},settings:{mode:'classic',mapKey:'papa',rounds:6},decoyObjects:[{id:'d',prop:'Bucket',position:{x:5,y:0,z:5}}],players:[{id:'h',token:'ht',name:'Hunter',avatar:'john',seat:0,role:'hunter',health:3,alive:true,prop:null,live:{x:0,y:0,z:0}},{id:'p',token:'pt',name:'Hider',avatar:'kristen',seat:1,role:'hider',health:3,alive:true,prop:'Bucket',live:{x:7,y:0,z:-3}}]};const hunter=room.stateFor('ht'),hider=room.stateFor('pt');assert.equal(hunter.players.find(p=>p.id==='p').prop,null);assert.equal(hunter.players.find(p=>p.id==='p').live,null);assert.deepEqual(hunter.decoyObjects,[]);assert.equal(hider.players.find(p=>p.id==='p').prop,'Bucket');assert.equal(hider.decoyObjects.length,1)});

test('server only accepts hunter damage during the hunt phase',()=>{const source=read('propHuntRoom.mjs');assert.match(source,/action==='hit'&&this\.room\.phase==='hunt'/);assert.match(source,/hideFromHuntersDuringHide/);assert.match(source,/decoyObjects/)});

test('hider positional footsteps are suppressed for a blinded hunter',()=>{const js=read('public/prop-hunt-3d.js');assert.match(js,/!\(isHunterHidePhase\(\)&&a\.role==='hider'\)/)});
