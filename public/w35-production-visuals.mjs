/*
 * Black Family Game Night - W35 production visual pipeline
 * Authored scene presentation, material tuning, lighting and collision extraction.
 * Visible art and gameplay collision are deliberately separate.
 */
export const W35_VISUAL_PIPELINE_VERSION='W35.1';

const SURFACE_RULES=[
  ['concrete',/concrete|hearth|stone|masonry|drain/i],
  ['gravel',/gravel|apron/i],
  ['dirt',/dirt|soil|mud|ground/i],
  ['wood',/wood|siding|board|timber|barn|pallet|bench|shelf|chair/i],
  ['rubber',/rubber|tire|tyre|hose/i],
  ['glass',/glass|window/i],
  ['paintedMetal',/tractor|tool_red|paint|gascan|shopvac|storagebin/i],
  ['metal',/steel|metal|chrome|roof|rib|seam|grille|hub|exhaust|rollbar/i],
  ['fabric',/leather|fabric|cushion|seat/i]
];

export function classifyProductionSurface(name=''){
  const text=String(name||'');
  for(const [kind,re] of SURFACE_RULES)if(re.test(text))return kind;
  return 'general';
}

export function productionSurfaceProfile(name=''){
  const kind=classifyProductionSurface(name);
  const p={kind,roughness:.82,metalness:.04,envMapIntensity:.72,variation:.035};
  if(kind==='concrete')Object.assign(p,{roughness:.94,metalness:0,variation:.055});
  else if(kind==='gravel')Object.assign(p,{roughness:.98,metalness:0,variation:.075});
  else if(kind==='dirt')Object.assign(p,{roughness:.98,metalness:0,variation:.085});
  else if(kind==='wood')Object.assign(p,{roughness:.89,metalness:0,variation:.065});
  else if(kind==='rubber')Object.assign(p,{roughness:.78,metalness:0,envMapIntensity:.24,variation:.025});
  else if(kind==='glass')Object.assign(p,{roughness:.18,metalness:0,envMapIntensity:1.15,variation:0});
  else if(kind==='paintedMetal')Object.assign(p,{roughness:.56,metalness:.28,envMapIntensity:.9,variation:.035});
  else if(kind==='metal')Object.assign(p,{roughness:.48,metalness:.66,envMapIntensity:1.08,variation:.028});
  else if(kind==='fabric')Object.assign(p,{roughness:.92,metalness:0,envMapIntensity:.28,variation:.035});
  return p;
}

function safeColorTune(material,profile){
  if(!material?.color)return;
  // Keep authored palette intact, only recover a little saturation/contrast lost by flat prototype lighting.
  const hsl={h:0,s:0,l:0};material.color.getHSL(hsl);
  if(profile.kind==='wood')material.color.setHSL(hsl.h,Math.min(1,hsl.s*1.08+.015),Math.max(.04,Math.min(.82,hsl.l*.94)));
  else if(profile.kind==='concrete')material.color.setHSL(hsl.h,hsl.s*.72,Math.min(.72,hsl.l*1.02));
  else if(profile.kind==='metal'||profile.kind==='paintedMetal')material.color.setHSL(hsl.h,Math.min(1,hsl.s*1.04),Math.min(.75,hsl.l*1.02));
  else if(profile.kind==='dirt'||profile.kind==='gravel')material.color.setHSL(hsl.h,Math.min(1,hsl.s*1.06),Math.max(.035,hsl.l*.96));
}

function installMicroSurface(material,profile){
  if(!material?.isMeshStandardMaterial||profile.variation<=0||material.userData?.w35MicroSurface)return;
  material.userData=material.userData||{};material.userData.w35MicroSurface=true;
  const kind=profile.kind,amount=profile.variation;
  const prior=material.onBeforeCompile;
  material.onBeforeCompile=shader=>{
    prior?.(shader);
    shader.vertexShader=shader.vertexShader
      .replace('#include <common>','#include <common>\nvarying vec3 vW35WorldPos;\nvarying vec3 vW35WorldNormal;')
      .replace('#include <worldpos_vertex>','#include <worldpos_vertex>\nvW35WorldPos = worldPosition.xyz;\nvW35WorldNormal = normalize(mat3(modelMatrix) * objectNormal);');
    const helpers=`\nvarying vec3 vW35WorldPos;\nvarying vec3 vW35WorldNormal;\nfloat w35hash(vec3 p){return fract(sin(dot(p,vec3(12.9898,78.233,37.719)))*43758.5453);}\nfloat w35surface(){\n vec3 n=abs(normalize(vW35WorldNormal));\n float axisCoord=n.y>max(n.x,n.z)?vW35WorldPos.x:(n.x>n.z?vW35WorldPos.z:vW35WorldPos.x);\n float coarse=w35hash(floor(vW35WorldPos*3.7));\n float fine=w35hash(floor(vW35WorldPos*18.0));\n float wood=0.5+0.5*sin(axisCoord*24.0 + sin(vW35WorldPos.y*6.0)*1.4 + coarse*2.2);\n return ${kind==='wood'?'mix(coarse,wood,.72)':kind==='concrete'||kind==='gravel'?'mix(coarse,fine,.45)':kind==='dirt'?'mix(coarse,fine,.28)':'mix(.5,coarse,.55)'};\n}\n`;
    shader.fragmentShader=shader.fragmentShader.replace('#include <common>',`#include <common>${helpers}`);
    shader.fragmentShader=shader.fragmentShader.replace('#include <map_fragment>',`#include <map_fragment>\nfloat w35v=w35surface();\ndiffuseColor.rgb *= 1.0 + (w35v-.5)*${(amount*2).toFixed(4)};`);
  };
  const previousKey=material.customProgramCacheKey?.bind(material);
  material.customProgramCacheKey=()=>`${previousKey?previousKey():''}|w35:${kind}:${amount}`;
  material.needsUpdate=true;
}

export function tuneAuthoredMaterial(material,name=''){
  if(!material)return material;
  const profile=productionSurfaceProfile(`${name} ${material.name||''}`);
  if('roughness' in material)material.roughness=profile.roughness;
  if('metalness' in material)material.metalness=profile.metalness;
  if('envMapIntensity' in material)material.envMapIntensity=profile.envMapIntensity;
  material.dithering=true;
  safeColorTune(material,profile);
  installMicroSurface(material,profile);
  material.userData=material.userData||{};
  material.userData.w35Surface=profile.kind;
  return material;
}

export function prepareAuthoredVisual(root,{shadowMinRadius=.12,offset={x:0,y:0,z:0},scale=1,rotationY=0}={}){
  if(!root)return null;
  root.position.set(offset.x||0,offset.y||0,offset.z||0);root.rotation.y=rotationY||0;root.scale.setScalar(scale||1);root.updateMatrixWorld(true);
  root.traverse?.(o=>{
    if(!o.isMesh)return;
    if(Array.isArray(o.material))o.material=o.material.map(m=>tuneAuthoredMaterial(m?.clone?.()||m,o.name));
    else if(o.material)o.material=tuneAuthoredMaterial(o.material.clone?.()||o.material,o.name);
    o.receiveShadow=true;
    if(o.geometry?.boundingSphere==null)o.geometry?.computeBoundingSphere?.();
    const radius=o.geometry?.boundingSphere?.radius||0;
    o.castShadow=radius>=shadowMinRadius;
    o.frustumCulled=true;
    o.userData.w35AuthoredVisual=true;
  });
  root.userData.w35ProductionVisual=true;
  return root;
}

export function addAuthoredCollisionShell(root,world,THREE,{include=/^(shop|barn)_(front|rear|left|right)_wall_/i,minThickness=.08}={}){
  if(!root||!world||!THREE)return 0;
  root.updateMatrixWorld(true);let count=0;const box=new THREE.Box3(),size=new THREE.Vector3(),center=new THREE.Vector3();
  root.traverse?.(o=>{
    if(!o.isMesh||!include.test(String(o.name||'')))return;
    box.setFromObject(o);if(box.isEmpty())return;box.getSize(size);box.getCenter(center);
    if(size.x<minThickness&&size.z<minThickness)return;
    world.colliders.push({x:center.x,z:center.z,y:box.min.y,w:Math.max(minThickness,size.x),d:Math.max(minThickness,size.z),h:Math.max(.08,size.y),solid:true,layer:'w35AuthoredWall',blocksPlayer:true,blocksCamera:true,blocksVision:true,climbable:false,walkableTop:false,name:`W35 ${o.name}`,mesh:o,w35Authored:true});
    count++;
  });
  return count;
}

export function markCollisionOnly(object){
  if(!object)return object;
  object.traverse?.(o=>{if(o.isMesh){o.visible=false;o.userData.w35CollisionOnly=true;}});
  return object;
}

export function addProductionLighting(scene,THREE,{center={x:7,y:0,z:6},weather='clear'}={}){
  const group=new THREE.Group();group.name='W35 Papa production lighting';
  const warm=weather==='sunset'?0xffb77a:0xffd6a3;
  const key=new THREE.DirectionalLight(warm,.75);key.position.set(center.x-8,12,center.z-10);key.castShadow=true;key.shadow.mapSize.set(2048,2048);Object.assign(key.shadow.camera,{left:-18,right:18,top:18,bottom:-18,near:.5,far:50});key.shadow.camera.updateProjectionMatrix();key.shadow.bias=-.00035;key.shadow.normalBias=.025;group.add(key);
  const doorway=new THREE.SpotLight(0xffe2b8,62,24,Math.PI*.28,.62,1.45);doorway.position.set(6,4.2,10.8);doorway.target.position.set(6,0.5,5.7);doorway.castShadow=false;group.add(doorway,doorway.target);
  const workA=new THREE.PointLight(0xffd2a0,13,9,2);workA.position.set(4.2,3.2,3.4);group.add(workA);
  const workB=new THREE.PointLight(0xffcf96,10,8,2);workB.position.set(9.1,3.1,4.0);group.add(workB);
  const barnFill=new THREE.PointLight(0xd8dfc8,7,11,2);barnFill.position.set(14.7,3.2,5.4);group.add(barnFill);
  const fire=new THREE.PointLight(0xff8548,9,5.2,2);fire.position.set(10.7,1.05,7.0);group.add(fire);
  scene.add(group);return group;
}

export function productionVisualManifest(){
  return {version:W35_VISUAL_PIPELINE_VERSION,authoredVisibleWorld:true,collisionVisualSeparation:true,authoredCollisionExtraction:true,materialClassification:true,microSurfaceVariation:true,productionLighting:true,approvedModelGatePreserved:true};
}
