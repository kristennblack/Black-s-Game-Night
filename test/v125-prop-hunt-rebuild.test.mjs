import test from 'node:test';
import assert from 'node:assert/strict';
import {access,readFile} from 'node:fs/promises';

const js=await readFile(new URL('../public/prop-hunt-3d.js',import.meta.url),'utf8');
const css=await readFile(new URL('../public/prop-hunt-3d.css',import.meta.url),'utf8');
const people=['john','kristen','holly','elizabeth','vanessa','logan','james','dorothy','nana','papa','kelsi','molly','gunner'];

test('v1.2.5 Prop Hunt uses visible full-body family sprites instead of circular head avatars',async()=>{
  for(const id of people) await access(new URL(`../public/characters3d/${id}.png`,import.meta.url));
  for(const token of ['CHARACTER_SPRITES','preloadCharacterSprites','drawCharacterSprite','ctx.drawImage(img','fullBodySprites:true']) assert.ok(js.includes(token),token);
  assert.doesNotMatch(js,/drawCharacter\(a,base,head/);
});

test('v1.2.5 Prop Hunt renders illustrated cartoon props and uses the exact same renderer for disguised players',()=>{
  for(const token of ['drawCartoonProp','Coffee Mug','Toolbox','Wheelbarrow','Hay Bale','Lantern','Cooler','Tire','Watering Can','Feed Barrel','Pool Float','Shovel','samePropArt:true']) assert.ok(js.includes(token),token);
  assert.match(js,/if\(a\.role==='hider'&&a\.prop\)[\s\S]*pushProp\(cmd,p,cam,W,H,false\)/);
  assert.ok(js.includes('pushEnvironmentObject'));
  assert.ok(js.includes('noWorldLabels:true'));
});

test('v1.2.5 Prop Hunt joystick bug is fixed and includes real touch fallback plus redundant movement buttons',()=>{
  assert.match(js,/let dx=clientX-cx,dy=clientY-cy/);
  assert.doesNotMatch(js,/const r=j\.getBoundingClientRect\(\),cx=r\.left\+r\.width\/2,cy=r\.top\+r\.height\/2,dx=/);
  for(const token of ["addEventListener('touchstart'","addEventListener('touchmove'",'touchJoystickFallback:true','data-ph3-move']) assert.ok(js.includes(token),token);
  assert.ok(css.includes('.ph3d-joystick.active'));
  assert.match(css,/@media\(max-width:430px\)\{\.ph3d-dpad\{display:grid/);
});

test('v1.2.5 Prop Hunt ships the approved scene and prop-art references used for the rebuild',async()=>{
  await access(new URL('../public/prop-hunt-approved-scene.png',import.meta.url));
  await access(new URL('../public/prop-hunt-art-pack.png',import.meta.url));
  assert.ok(js.includes('/prop-hunt-approved-scene.png'));
});
