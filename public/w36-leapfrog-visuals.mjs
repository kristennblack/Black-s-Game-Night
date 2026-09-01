/*
 * Black Family Game Night - W36 Leapfrog visual ratchet
 * Keeps the fullest proven world visible, promotes authored replacements only
 * when they pass structural checks, and upgrades legacy surfaces in-place.
 */
export const W36_VISUAL_PIPELINE_VERSION='W36.1';
export const W36_BENCHMARK_VIEW=Object.freeze({player:{x:8.4,z:18.2,yaw:-0.18},camera:{distance:4.55,height:1.72,pitch:-0.08},lookAt:{x:11.6,y:1.22,z:12.2}});

const TIER=Object.freeze({debug:0,legacy:1,production:2,approved:3});
export const visualTierRank=t=>TIER[String(t||'').toLowerCase()]??0;

function matList(mesh){return Array.isArray(mesh?.material)?mesh.material:[mesh?.material].filter(Boolean)}
export function inspectVisualAsset(root,THREE){
  const out={meshes:0,triangles:0,materials:0,texturedMaterials:0,skinnedMeshes:0,maxDim:0,minDim:0,validBounds:false};
  if(!root||!THREE)return out;
  const materials=new Set();
  root.updateMatrixWorld?.(true);
  root.traverse?.(o=>{
    if(!o?.isMesh)return;out.meshes++;if(o.isSkinnedMesh)out.skinnedMeshes++;
    const g=o.geometry;if(g){const count=g.index?.count||g.attributes?.position?.count||0;out.triangles+=Math.floor(count/3)}
    for(const m of matList(o)){materials.add(m);if(m?.map||m?.normalMap||m?.roughnessMap||m?.metalnessMap||m?.aoMap)out.texturedMaterials++}
  });
  out.materials=materials.size;
  try{const b=new THREE.Box3().setFromObject(root),s=new THREE.Vector3();if(!b.isEmpty()){b.getSize(s);out.maxDim=Math.max(s.x,s.y,s.z);out.minDim=Math.min(s.x,s.y,s.z);out.validBounds=Number.isFinite(out.maxDim)&&out.maxDim>.05&&out.maxDim<250}}catch{}
  return out;
}

export function passesPromotionGate(root,THREE,{minMeshes=4,minTriangles=100,minMaterials=1,minDim=.08,maxDim=30}={}){
  const stats=inspectVisualAsset(root,THREE);
  const pass=!!root&&stats.validBounds&&stats.meshes>=minMeshes&&stats.triangles>=minTriangles&&stats.materials>=minMaterials&&stats.maxDim>=minDim&&stats.maxDim<=maxDim;
  return {pass,stats,reason:pass?'structural-quality-pass':!root?'missing-asset':!stats.validBounds?'invalid-bounds':'below-structural-threshold'};
}

function visibleMeshes(root){const arr=[];root?.traverse?.(o=>{if(o?.isMesh)arr.push(o)});return arr}
export function setVisualVisibility(root,visible){for(const o of visibleMeshes(root))o.visible=!!visible;return root}

function boxOf(root,THREE){try{root.updateMatrixWorld?.(true);const b=new THREE.Box3().setFromObject(root);return b.isEmpty()?null:b}catch{return null}}
export function fitReplacementToFallback(candidate,fallback,THREE,{minScale=.55,maxScale=1.85}={}){
  if(!candidate||!fallback||!THREE)return candidate;
  const fb=boxOf(fallback,THREE),cb=boxOf(candidate,THREE);if(!fb||!cb)return candidate;
  const fs=new THREE.Vector3(),cs=new THREE.Vector3(),fc=new THREE.Vector3(),cc=new THREE.Vector3();fb.getSize(fs);cb.getSize(cs);fb.getCenter(fc);cb.getCenter(cc);
  const ratios=[fs.x/Math.max(.001,cs.x),fs.z/Math.max(.001,cs.z),fs.y/Math.max(.001,cs.y)].filter(Number.isFinite).sort((a,b)=>a-b);
  const ratio=Math.max(minScale,Math.min(maxScale,ratios[1]||1));candidate.scale.multiplyScalar(ratio);candidate.updateMatrixWorld?.(true);
  const cb2=boxOf(candidate,THREE);if(!cb2)return candidate;const cc2=new THREE.Vector3();cb2.getCenter(cc2);
  candidate.position.x+=fc.x-cc2.x;candidate.position.z+=fc.z-cc2.z;candidate.position.y+=fb.min.y-cb2.min.y;candidate.updateMatrixWorld?.(true);return candidate;
}

export function promoteVisual({candidate,fallback,THREE,slot='visual',tier='production',gate={},prepare=null,parent=null}){
  const verdict=passesPromotionGate(candidate,THREE,gate);
  if(!verdict.pass){setVisualVisibility(fallback,true);if(candidate)setVisualVisibility(candidate,false);return {slot,tier,promoted:false,...verdict}}
  if(typeof prepare==='function')prepare(candidate);
  if(parent&&candidate.parent!==parent)parent.add(candidate);
  fitReplacementToFallback(candidate,fallback,THREE);
  candidate.userData=candidate.userData||{};candidate.userData.w36VisualTier=tier;candidate.userData.w36VisualSlot=slot;candidate.userData.w36Promoted=true;
  setVisualVisibility(candidate,true);setVisualVisibility(fallback,false);
  return {slot,tier,promoted:true,...verdict};
}

const SURFACES=[
  ['concrete',/concrete|floor|drain|hearth|stone|masonry/i],['wood',/wood|wall|board|timber|barn|bench|shelf|chair|pallet|lumber|rafter/i],
  ['rubber',/tire|tyre|rubber|hose|mat/i],['metal',/metal|steel|roof|tool|tractor|motorcycle|welder|compressor|cabinet|conduit|door/i],
  ['dirt',/dirt|gravel|mud|soil|yard|ground/i],['fabric',/fabric|leather|cushion|seat|rug/i]
];
function surfaceOf(name=''){for(const [k,re] of SURFACES)if(re.test(name))return k;return 'general'}

function canvasTexture(THREE,kind,size=128){
  if(typeof document==='undefined'||!THREE?.CanvasTexture)return null;const c=document.createElement('canvas');c.width=c.height=size;const x=c.getContext('2d');if(!x)return null;
  const fill={wood:'#8a6748',concrete:'#77736c',metal:'#666a69',rubber:'#252728',dirt:'#6e6049',fabric:'#6d665f',general:'#77736c'}[kind]||'#777';x.fillStyle=fill;x.fillRect(0,0,size,size);
  let seed=2166136261;const rnd=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296};
  if(kind==='wood'){
    for(let i=0;i<26;i++){const y=rnd()*size;x.strokeStyle=`rgba(${80+Math.floor(rnd()*35)},${45+Math.floor(rnd()*28)},${25+Math.floor(rnd()*18)},${.08+rnd()*.13})`;x.lineWidth=.6+rnd()*1.6;x.beginPath();x.moveTo(0,y);for(let p=0;p<=size;p+=8)x.lineTo(p,y+Math.sin(p*.11+rnd()*2)*2.2);x.stroke()}
    for(let i=0;i<4;i++){const yy=(i+1)*size/4;x.fillStyle='rgba(35,24,15,.12)';x.fillRect(0,yy, size,1)}
  }else if(kind==='concrete'||kind==='dirt'){
    for(let i=0;i<1800;i++){const v=Math.floor(90+rnd()*100),a=.025+rnd()*.055;x.fillStyle=`rgba(${v},${v-(kind==='dirt'?18:2)},${v-(kind==='dirt'?30:5)},${a})`;x.fillRect(rnd()*size,rnd()*size,1+rnd()*2,1+rnd()*2)}
    if(kind==='concrete')for(let i=0;i<8;i++){x.strokeStyle='rgba(40,36,32,.08)';x.lineWidth=.5;x.beginPath();x.moveTo(rnd()*size,rnd()*size);x.lineTo(rnd()*size,rnd()*size);x.stroke()}
  }else if(kind==='metal'){
    for(let i=0;i<70;i++){const y=rnd()*size;x.strokeStyle=`rgba(220,220,215,${.018+rnd()*.04})`;x.beginPath();x.moveTo(0,y);x.lineTo(size,y+rnd()*2-1);x.stroke()}
  }else if(kind==='rubber'){
    for(let i=0;i<400;i++){const v=35+Math.floor(rnd()*35);x.fillStyle=`rgba(${v},${v},${v},.08)`;x.fillRect(rnd()*size,rnd()*size,1,1)}
  }else if(kind==='fabric'){
    x.strokeStyle='rgba(255,255,255,.045)';for(let i=0;i<size;i+=5){x.beginPath();x.moveTo(i,0);x.lineTo(0,i);x.stroke();x.beginPath();x.moveTo(size,i);x.lineTo(i,size);x.stroke()}
  }
  const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=4;t.needsUpdate=true;return t;
}

export function upgradeLegacyMaterials(root,THREE,{maxMeshes=1400}={}){
  if(!root||!THREE)return {meshes:0,upgraded:0,textures:0};const cache=new Map();let meshes=0,upgraded=0;
  const textureFor=k=>{if(!cache.has(k))cache.set(k,canvasTexture(THREE,k));return cache.get(k)};
  root.traverse?.(o=>{
    if(!o?.isMesh||o.userData?.w35AuthoredVisual||o.userData?.w36MaterialUpgraded||meshes++>=maxMeshes)return;
    const name=`${o.name||''} ${matList(o).map(m=>m?.name||'').join(' ')}`,kind=surfaceOf(name);if(kind==='general')return;
    const mats=matList(o),next=[];let changed=false;for(const old of mats){if(!old){next.push(old);continue}const m=old.clone?.()||old;if('roughness'in m)m.roughness={concrete:.93,wood:.86,rubber:.76,metal:.52,dirt:.96,fabric:.9}[kind]??.82;if('metalness'in m)m.metalness=kind==='metal'?.38:0;if(!m.map){const tex=textureFor(kind);if(tex){m.map=tex;changed=true}}m.dithering=true;m.needsUpdate=true;next.push(m)}
    if(changed||kind!=='general'){o.material=Array.isArray(o.material)?next:next[0];o.userData.w36MaterialUpgraded=true;upgraded++}
  });
  return {meshes,upgraded,textures:[...cache.values()].filter(Boolean).length};
}

export function addLeapfrogLighting(scene,THREE,{weather='clear'}={}){
  const g=new THREE.Group();g.name='W36 Leapfrog main shop lighting';
  const sun=new THREE.DirectionalLight(weather==='sunset'?0xffb270:0xffe4bd,1.0);sun.position.set(1,16,-8);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);Object.assign(sun.shadow.camera,{left:-30,right:30,top:28,bottom:-28,near:.5,far:70});sun.shadow.camera.updateProjectionMatrix();sun.shadow.bias=-.00025;sun.shadow.normalBias=.028;g.add(sun);
  for(const [x,z,i,d] of [[6.5,5.0,18,10],[14.0,8.0,13,9],[22.0,8.0,12,9],[14.0,17.0,10,10],[39.0,10.0,7,12]]){const l=new THREE.PointLight(0xffd29a,i,d,2);l.position.set(x,3.7,z);g.add(l)}
  const door=new THREE.SpotLight(0xffedc9,82,28,Math.PI*.24,.58,1.35);door.position.set(13.6,4.3,2.2);door.target.position.set(13.6,.65,11.5);g.add(door,door.target);
  scene.add(g);return g;
}

export function leapfrogManifest(){return {version:W36_VISUAL_PIPELINE_VERSION,fullWorldDefault:true,noVisualRegressionRatchet:true,legacyFallbackPreserved:true,heroPromotionGate:true,legacyPbrUpgrade:true,fixedBenchmarkView:true,productionGameplayPreserved:true};}
