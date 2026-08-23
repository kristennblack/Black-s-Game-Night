import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const here=path.dirname(fileURLToPath(import.meta.url));
const root=path.resolve(here,'..');
const js=fs.readFileSync(path.join(root,'public/prop-hunt-3d.js'),'utf8');
const css=fs.readFileSync(path.join(root,'public/prop-hunt-3d.css'),'utf8');
const sw=fs.readFileSync(path.join(root,'public/sw.js'),'utf8');

test('v1.8 fixes the Prop Hunt camera Y basis so the world renders upright',()=>{
  assert.ok(js.includes('up = forward x right'));
  assert.ok(js.includes('uy=fz*rx-fx*rz'));
  assert.ok(js.includes('uprightCamera:true'));
});

test('v1.8 makes HIDER versus HUNTER unmistakable and swaps role-specific controls',()=>{
  for(const token of ['YOU ARE A HIDER','YOU ARE A HUNTER','HIDING MODE','SHOOTING MODE','ph3HiderActions','ph3HunterActions','ph3RoleBanner','ph3Objective']) assert.ok(js.includes(token),token);
  for(const token of ['id="ph3Shoot"','id="ph3Reload"','id="ph3Aim"','id="ph3Prop"','id="ph3FlashBtn"','id="ph3Decoy"','id="ph3Lock"']) assert.ok(js.includes(token),token);
  assert.ok(css.includes('.ph3d-scorebar'));
  assert.ok(css.includes('.ph3d-role-banner'));
});

test('v1.8 includes a real illustrated sprite library for scenery and disguises',()=>{
  const dir=path.join(root,'public/prop-sprites');
  const files=fs.readdirSync(dir).filter(x=>x.endsWith('.png'));
  assert.ok(files.length>=40,`expected >=40 prop sprites, found ${files.length}`);
  for(const f of ['lantern.png','table-lamp.png','coffee-mug.png','firewood-crate.png','potted-pine.png','framed-photo.png','cowboy-boots.png','stacked-books.png','wood-barrel.png','old-fridge.png','toy-truck.png']) assert.ok(files.includes(f),f);
  assert.ok(js.includes("im.src='/prop-sprites/'"));
  assert.ok(js.includes('const sprite=getPropSprite(type)'));
  assert.ok(js.includes('samePropArt:true'));
});

test('v1.8 adds room-specific clutter palettes instead of scattering one generic object list everywhere',()=>{
  assert.ok(js.includes('function zonePropPalette'));
  for(const room of ['living','kitchen','bed','bath','workshop','barn','camp']) assert.ok(js.includes(room),room);
  assert.ok(js.includes('zoneClutterCount'));
  assert.ok(js.includes('roomSpecificClutter:true'));
});

test('v1.8 gives walls and structures material detail',()=>{
  assert.ok(js.includes("return'logs'"));
  assert.ok(js.includes("return'metal'"));
  assert.ok(js.includes("return'fence'"));
  assert.ok(js.includes('texturedFace(pts,material)'));
  assert.ok(js.includes('detailedWallMaterials:true'));
});

test('v1.8 hunter aim mode changes camera distance/FOV and is visible in HUD',()=>{
  assert.ok(js.includes('state.camera.aiming=!state.camera.aiming'));
  assert.ok(js.includes('c.aiming?Math.max(205,c.distance*.68):c.distance'));
  assert.ok(js.includes('fov:c.aiming?900:c.fov'));
  assert.ok(js.includes('hunterAimMode:true'));
});

test('v1.8 service worker caches detailed prop art and has a fresh release cache',()=>{
  assert.ok(sw.includes('black-family-game-night-v180-prop-redesign-test'));
  const spriteRefs=(sw.match(/\/prop-sprites\//g)||[]).length;
  assert.ok(spriteRefs>=40,`expected cached prop sprites, found ${spriteRefs}`);
});

test('v1.8 renders room-specific floor materials instead of one flat ground treatment',()=>{
  assert.ok(js.includes('function floorMaterialForZone'));
  assert.ok(js.includes('function floorTexture'));
  for(const material of ["return'wood'","return'gravel'","return'wateredge'","return'grass'","return'earth'"]) assert.ok(js.includes(material),material);
  assert.ok(js.includes('detailedFloorMaterials:true'));
});

test('v1.8 adds fixed room-dressing fixtures so rooms read as furnished places',()=>{
  assert.ok(js.includes('roomFixtures:true'));
  assert.ok(js.includes('fixed room') || js.includes('fixture') || js.includes('room dressing') || js.includes('Room dressing'));
});
