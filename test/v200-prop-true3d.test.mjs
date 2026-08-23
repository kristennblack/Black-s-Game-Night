import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const here=path.dirname(fileURLToPath(import.meta.url));
const root=path.resolve(here,'..');
const rules=fs.readFileSync(path.join(root,'public/prop-hunt-3d.js'),'utf8');
const webgl=fs.readFileSync(path.join(root,'public/prop-hunt-webgl.js'),'utf8');
const html=fs.readFileSync(path.join(root,'public/new-games.html'),'utf8');
const css=fs.readFileSync(path.join(root,'public/prop-hunt-3d.css'),'utf8');
const sw=fs.readFileSync(path.join(root,'public/sw.js'),'utf8');

test('v2.0 Prop Hunt loads a real WebGL Three.js presentation layer before the rules engine',()=>{
  assert.match(webgl,/WebGLRenderer/);
  assert.match(webgl,/PerspectiveCamera/);
  assert.match(webgl,/MeshStandardMaterial/);
  assert.match(webgl,/cdn\.jsdelivr\.net\/npm\/three@0\.185\.1/);
  assert.ok(html.indexOf('/prop-hunt-webgl.js')>=0);
  assert.ok(html.indexOf('/prop-hunt-webgl.js')<html.indexOf('/prop-hunt-3d.js'));
});

test('v2.0 uses actual volumetric prop models for scenery, disguises and decoys',()=>{
  for(const token of ['makeProp(type','makeCrateInto','makeTable','makeChair','makeFridge','makeVehicle','makeMotorcycle'])assert.ok(webgl.includes(token),token);
  for(const token of ['lantern','mug|coffee','barrel','toolbox','gas can|oil jug','wheelbarrow','hay bale','tire','cooler','shovel'])assert.ok(webgl.includes(token),token);
  assert.ok(webgl.includes('this.makeProp(p.type,p)'));
  assert.ok(webgl.includes('this.makeProp(a.prop,a.propShape||{})'));
  assert.ok(rules.includes('exact3DDecoys:true'));
});

test('v2.0 replaces billboard-only players with articulated 3D family rigs and a 3D gun',()=>{
  for(const token of ['buildHuman','buildDog','makeZapper','armL','armR','legL','legR','rotation.y=a.yaw'])assert.ok(webgl.includes(token),token);
  assert.ok(webgl.includes('applyPortraitToHead'));
  assert.ok(rules.includes('threeDimensionalCharacters:true'));
  assert.ok(rules.includes('threeDimensionalZapper:true'));
});

test('v2.0 third-person camera keeps the player visible and collides with buildings',()=>{
  for(const token of ['updateCamera(state)','cameraBlockers','intersectObjects','hits[0].distance','this.camera.position.lerp'])assert.ok(webgl.includes(token),token);
  assert.ok(rules.includes('cameraCollision:true'));
});

test('v2.0 gives phone players explicit identity, disguise and location HUD',()=>{
  for(const token of ['ph3SelfStatus','VISIBLE FAMILY CHARACTER','DISGUISED AS','ph3MiniMap','drawMiniMapOverlay','YOU · ${p.person.name}'])assert.ok(rules.includes(token),token);
  assert.ok(css.includes('.ph3d-self-status'));
  assert.ok(css.includes('.ph3d-minimap-overlay'));
});

test('v2.0 uses textured materials, lighting and shadows instead of outline-only world geometry',()=>{
  for(const token of ['createCanvasTexture','wood','stone','grass','gravel','metal','PCFSoftShadowMap','castShadow=true','PointLight','ACESFilmicToneMapping'])assert.ok(webgl.includes(token),token);
});

test('v2.0 includes farm animals as real 3D scene objects',()=>{
  for(const token of ['makeAnimal','syncAnimals','pig','goat','peacock'])assert.ok(webgl.includes(token),token);
});

test('v2.0 service worker includes the WebGL layer and a fresh cache',()=>{
  assert.match(sw,/v200-prop-true3d-alpha/);
  assert.match(sw,/prop-hunt-webgl\.js/);
});
