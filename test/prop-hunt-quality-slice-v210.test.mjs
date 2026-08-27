import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

const prop=await readFile(new URL('../public/prop-hunt-3d.js',import.meta.url),'utf8');
const art=await readFile(new URL('../public/shared-3d-art-kit.mjs',import.meta.url),'utf8');
const gameplay=await readFile(new URL('../public/shared-3d-gameplay.mjs',import.meta.url),'utf8');
const css=await readFile(new URL('../public/prop-hunt-3d.css',import.meta.url),'utf8');

function profile(id){
  const re=new RegExp(`${id}:\\{scale:([.0-9]+),height:([.0-9]+),radius:([.0-9]+),proportions:\\{([^}]*)\\}`);
  const m=gameplay.match(re);assert.ok(m,`missing ${id} body profile`);return {scale:Number(m[1]),height:Number(m[2]),radius:Number(m[3]),raw:m[4]};
}

test('Prop Hunt visible rig scale is calibrated to human-scale colliders instead of 2m prototype bodies',()=>{
  const john=profile('john'),holly=profile('holly'),liz=profile('elizabeth'),papa=profile('papa');
  assert.ok(john.scale<.9 && john.height===1.82,'John visual scale should match the 1.82m gameplay body');
  assert.ok(holly.scale<.72 && liz.scale<.73,'children should be visibly shorter than adults');
  assert.match(holly.raw,/headScale:1\.13/);assert.match(liz.raw,/headScale:1\.12/);
  assert.match(papa.raw,/bodyWidth:1\.07/,'Papa should not share the exact same silhouette as John/Logan');
});

test('dog profiles distinguish Gunner from the golden dogs instead of recolouring one generic quadruped',()=>{
  const k=profile('kelsi'),m=profile('molly'),g=profile('gunner');
  assert.ok(g.scale>k.scale && g.scale>m.scale);assert.ok(g.radius>k.radius);
  assert.match(g.raw,/headScale:1\.09/);assert.match(g.raw,/bodyLength:1\.08/);
  for(const token of ["id==='molly'","id==='kelsi'","id==='gunner'",'bandana','tongue.visible=true'])assert.ok(art.includes(token),token);
});

test('family identity includes real 3D silhouette/clothing cues rather than color-only clones',()=>{
  assert.ok(prop.includes("john:{top:0x79372f,pattern:'plaid'"));
  assert.ok(prop.includes("dorothy:{top:0x9a6d82,pattern:'floral'"));
  for(const token of ["kind==='plaid'","kind==='floral'",'addGlasses','addFacialHair','addLongBackHair','addHood','const hat=new THREE.Group()'])assert.ok(art.includes(token),token);
  assert.ok(art.includes('face.position.set(0,.94,-.204)'),'face remains on the true front of the head');
});

test("Papa's Shop has a real rural exterior, garage-scale overhead door and purposeful shop wear",()=>{
  for(const token of ['buildRuralBackdrop','buildExteriorTrim','buildOverheadDoor','buildFloorDrain','buildOilStain','buildHoseReel','buildWallConduit','buildTireStack','buildShopSideTable'])assert.ok(art.includes(token),token);
  assert.ok(prop.includes("width:3.55,height:2.48"),'main shop opening should use a garage-scale overhead door');
  assert.ok(prop.includes("label:'Shop man door'"),'pedestrian door should remain separate from the overhead opening');
  assert.ok(art.includes('QuadraticBezierCurve3'),'distant utility wires should sag rather than end at bare poles');
});

test('small Papa shop props can be deliberately placed on surfaces instead of every object sitting on the floor',()=>{
  assert.ok(prop.includes('addProp(type,x,z,rot=0,y=0)'));
  assert.ok(prop.includes("w.addProp('Welding Helmet',8.84,4.4,.18,.73)"));
  assert.ok(prop.includes("w.addProp('Coffee Mug',10.08,8.14,-.15,.72)"));
  assert.ok(prop.includes("w.addProp('Coffee Mug',10.78,7.15,.08,1.93)"));
});

test('quality slice keeps deliberate third-person framing, navigation and an opt-in phone QA HUD',()=>{
  for(const token of ['cameraDistance:4.35','aimDistance:3.25','minCameraDistance:1.40','maxPitch:.25','groundAccel:16.5','groundBrake:21'])assert.ok(gameplay.includes(token),token);
  assert.ok(prop.includes('createNavigationGrid'));assert.ok(prop.includes('function botMoveToward'));
  assert.ok(prop.includes("get('qa3d')==='1'"));assert.ok(prop.includes('updateQaHud'));assert.ok(css.includes('.ph3d-qa'));
});
