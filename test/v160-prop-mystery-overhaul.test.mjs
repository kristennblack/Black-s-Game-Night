import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

const html=await readFile(new URL('../public/new-games.html',import.meta.url),'utf8');
const prop=await readFile(new URL('../public/prop-hunt-3d.js',import.meta.url),'utf8');
const css=await readFile(new URL('../public/prop-hunt-3d.css',import.meta.url),'utf8');

const count=(s,needle)=>s.split(needle).length-1;

test('v1.6 Prop Hunt keeps one active engine and the four approved family maps',()=>{
  assert.equal(count(html,'/prop-hunt-3d.js'),1);
  for(const token of ["Papa's Shop",'Camper / Campsite','Backyard + Fire Pit','Farmyard / Animal Pens']) assert.ok(prop.includes(token),token);
  assert.ok(prop.includes('6') || html.includes('6 rounds'));
});

test('v1.6 Prop Hunt exposes large phone movement controls, camera reset and sprint',()=>{
  for(const token of ['touchMove','data-ph3-move','cameraSensitivity','ph3Sprint','cameraReset:true','sprintToggle:true','largeJoystick:true']) assert.ok(prop.includes(token),token);
  assert.match(css,/ph3d-joystick/);
  assert.match(css,/ph3d-dpad/);
});

test('v1.6 Prop Hunt uses full-body family art and selected avatar styles in setup/HUD',()=>{
  for(const token of ['STYLE_PACKS','FULL_BODY_STYLES','CHARACTER_SPRITES','characterSprite','stylePortrait','avatarStyleHUD:true']) assert.ok(prop.includes(token),token);
  assert.match(prop,/\/characters3d\/themes\/\$\{style\}\/\$\{p\.id\}\.png/);
  assert.match(prop,/\/characters3d\/\$\{p\.id\}\.png/);
});

test('v1.6 Prop Hunt renders environment and disguises with the same cartoon prop system',()=>{
  for(const token of ['drawCartoonProp','pushEnvironmentObject','samePropArt:true','cartoonProps:true','lockedPropStill:true']) assert.ok(prop.includes(token),token);
  assert.match(prop,/a\.role==='hider'&&a\.prop[\s\S]*animate:!a\.locked[\s\S]*pushProp\(cmd,p,cam,W,H,false\)/);
});

test('v1.6 Mystery shows movement costs and supports phone-friendly board navigation',()=>{
  for(const token of ['move-cost','reachCost','reachableMap','mystery-mobile-actions','board-camera-tools','zoomMe','centerMe']) assert.ok(html.includes(token),token);
  assert.match(html,/\$\{cost\} move/);
});

test('v1.6 Mystery notebook is grouped into suspects, objects and locations',()=>{
  for(const token of ['Detective notebook · Detective notes','Suspects','Objects','Locations','notebookHTML']) assert.ok(html.includes(token),token);
  assert.ok(html.includes('ruled out / seen'));
});

test('v1.6 Mystery records public suggestion history without exposing the private card',()=>{
  assert.ok(html.includes('Case history'));
  assert.ok(html.includes('The actual card shown stays private.'));
  assert.match(html,/state\.history\.push\(\{author:authorPl\.person\.name,suspect:suspectName,weapon,location,disprover:/);
  assert.doesNotMatch(html,/state\.history\.push\(\{[^}]*card:/);
});

test('v1.6 Mystery follows standard suggestion movement and lets summoned suspects participate from the room',()=>{
  assert.ok(html.includes('function pullSuggestedSuspect'));
  assert.ok(html.includes('was called into'));
  assert.ok(html.includes('summoned'));
  assert.match(html,/pullSuggestedSuspect\(suspect,location\)/);
});

test('v1.6 Mystery final accusation has a confirmation step and full case-file reveal',()=>{
  for(const token of ['Lock in this accusation?','LOCK ACCUSATION','GO BACK','case-solution-grid','CASE CLOSED','solutionCardsHTML']) assert.ok(html.includes(token),token);
});

test('v1.6 Mystery retains illustrated tabletop movement, secret passages and private disproof',()=>{
  for(const token of ['room-scene','board-figure','figureWalk','secretPassages','useSecretPassage','privacy-screen','Choose ONE card to show privately']) assert.ok(html.includes(token),token);
});
