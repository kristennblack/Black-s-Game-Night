import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {phaseWEvents} from '../public/phase-w-events.mjs';

const read=p=>fs.readFileSync(new URL(`../${p}`,import.meta.url),'utf8');
const app=read('public/app.js');
const worker=read('worker.mjs');
const sw=read('public/sw.js');
const birthday=read('public/birthday-event.html');
const garden=read('public/dorothys-garden-merge.html');
const platform=read('public/phase-w-platform.mjs');

const arcadeFiles=['papas-paddle-battle','gunners-goat-run','johns-shop-bomber','jamess-lumber-stack','dorothys-garden-merge','logans-minefield','nanas-goat-whack','hollys-memory-mayhem','lizzies-dramatic-lights','vanessas-pipe-problem','mollys-light-chase','gunners-snack-attack','breakout','space-shooter','rocket-gap','neon-snake'];

test('Phase W home categories are rendered in the locked order',()=>{
  const a=app.indexOf("section('cards','Card Games'");
  const b=app.indexOf("section('boards','Board & Tabletop Games'");
  const c=app.indexOf("section('three','3D Family Games'");
  const d=app.indexOf('<h2>Arcade Corner</h2>');
  assert.ok(a>=0&&a<b&&b<c&&c<d);
});

test('all 16 active arcade games are integrated and Kelsi replaces Neon Star Patrol',()=>{
  for(const id of arcadeFiles) assert.match(app,new RegExp(id.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')));
  for(const name of ['Cabin Breakout',"Kelsi's Rock 'n' Roll Rescue",'Campfire Rocket','Neon Snake']) assert.match(app,new RegExp(name));
  assert.doesNotMatch(app,/name:'Neon Star Patrol'/);
  assert.doesNotMatch(app,/kelsirocks:\{/);
  assert.match(app,/16 fast family games/);
});

test('every arcade page receives the Phase W dimensional platform',()=>{
  for(const id of arcadeFiles){const html=read(`public/${id}.html`);assert.ok(html.includes('phase-w-platform')||html.includes('data-phase-w-inline'),id)}
});

test('Dorothy Garden can be entered by tapping from ready state',()=>{
  assert.match(garden,/else if\(state==='ready'\)begin\(\);return/);
  assert.match(garden,/Tap to enter/i);
});

test('locked birthdays and five-day windows resolve correctly',()=>{
  const lizzie=phaseWEvents(new Date(2026,7,27,12));
  assert.equal(lizzie.birthday?.person,'elizabeth');
  assert.equal(phaseWEvents(new Date(2026,8,28,12)).birthday?.person,'john');
  assert.equal(phaseWEvents(new Date(2026,6,19,12)).birthday?.person,'papa');
  assert.equal(phaseWEvents(new Date(2026,7,18,12)).birthday?.person,'nana');
  assert.equal(phaseWEvents(new Date(2026,7,24,12)).birthday?.person,'elizabeth');
});

test('birthday page has permanent challenge, memory gallery and first-view greeting controls',()=>{
  assert.match(birthday,/Birthday Challenge/i);
  assert.match(birthday,/memory/i);
  assert.match(birthday,/birthday-greeting-overlay/);
  assert.match(birthday,/Replay family birthday messages/);
  assert.match(birthday,/data-skip/);
});

test('Arcade progression is earned-only and server-backed',()=>{
  assert.match(platform,/\+5 Game Night Tokens/);
  assert.doesNotMatch(platform,/checkout|credit card|purchase tokens|stripe/i);
  assert.match(worker,/\/api\/arcade\/profile/);
  assert.match(worker,/\/api\/arcade\/record/);
});

test('Who is Playing and Ask to Join are backed by presence and join-request endpoints',()=>{
  assert.match(app,/Who.?s Playing|Who's Playing/i);
  assert.match(app,/Ask to Join/i);
  assert.match(worker,/\/api\/presence/);
  assert.match(worker,/\/api\/join-request/);
  assert.match(app,/wants to join your game/);
});

test('arcade pages do not advertise joinable real-time multiplayer before synchronized arcade sessions exist',()=>{
  assert.match(platform,/joinable:false/);
});

test('Phase W uses a fresh service worker cache while retaining legacy compatibility markers',()=>{
  assert.match(sw,/black-family-game-night-staging-phase-w-living-app-25/);
  assert.match(app,/GAME-NIGHT-STAGING-PHASE-W-LIVING-APP-25/);
});
