import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
const html=await readFile(new URL('../public/new-games.html',import.meta.url),'utf8');
const js=await readFile(new URL('../public/prop-hunt-3d.js',import.meta.url),'utf8');
const css=await readFile(new URL('../public/prop-hunt-3d.css',import.meta.url),'utf8');

test('Prop Hunt loads the third-person 3D override',()=>{
  assert.ok(html.includes('/prop-hunt-3d.js'));
  assert.ok(html.includes('/prop-hunt-3d.css'));
  for(const token of ['THIRD-PERSON 3D FAMILY GAME','cameraData','project','drawCharacter','raySphere']) assert.ok(js.includes(token),token);
});

test('3D Prop Hunt includes jump, climb, props, weapon and computer-fill systems',()=>{
  for(const token of ['applyVerticalPhysics','groundSupport','blockingBox','climbableGeometry','computerPlayers','prop-zapper','makeSparks','toggleLock','botChooseInitialProp']) assert.ok(js.includes(token),token);
  assert.ok(css.includes('.ph3d-crosshair'));
  assert.ok(css.includes('.ph3d-joystick'));
});

test('all four family maps contain vertical gameplay landmarks',()=>{
  for(const name of ["Papa's Shop",'Camper / Campsite','Backyard + Fire Pit','Farmyard / Animal Pens']) assert.ok(js.includes(name),name);
  for(const landmark of ['Tractor',"Papa's yellow chair",'Bunks','Trampoline','Sea can','Goat platforms']) assert.ok(js.includes(landmark),landmark);
});
