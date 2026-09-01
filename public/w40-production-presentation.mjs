/*
 * Black Family Game Night - W40 external-asset production presentation
 * Professional camera + environment lighting + incoming asset promotion gate.
 */
export const W40_BUILD_ID='GAME-NIGHT-STAGING-CANDIDATE-W40-EXTERNAL-ASSET-PIPELINE-59';
export const W40_PRESENTATION_VERSION='W40.1';
export const W40_MANIFEST_URL='/models/w40/external-asset-manifest.json';
export const W40_PROP_HUNT_CAMERA=Object.freeze({
  cameraDistance:3.72,aimDistance:2.88,cameraHeight:1.34,cameraLift:.12,
  minCameraDistance:1.25,recoveryPitch:.012,shoulder:.46,fov:56,aimFov:49,sprintFov:59,
  minPitch:-.10,maxPitch:.17,pitch:.012
});

let manifestPromise=null,rgbePromise=null,gltfPromise=null;
export async function loadW40Manifest(fetchImpl=globalThis.fetch){
  if(manifestPromise)return manifestPromise;
  manifestPromise=(async()=>{try{const r=await fetchImpl(W40_MANIFEST_URL,{cache:'no-store'});if(!r.ok)throw new Error(`HTTP ${r.status}`);return await r.json()}catch(err){return{version:'W40.1',build:W40_BUILD_ID,error:String(err?.message||err),slots:{},environmentLighting:{}}}})();
  return manifestPromise;
}
function loader(){return gltfPromise||(gltfPromise=import('https://cdn.jsdelivr.net/npm/three@0.185.1/examples/jsm/loaders/GLTFLoader.js').then(({GLTFLoader})=>new GLTFLoader()));}
function rgbe(){return rgbePromise||(rgbePromise=import('https://cdn.jsdelivr.net/npm/three@0.185.1/examples/jsm/loaders/RGBELoader.js').then(({RGBELoader})=>new RGBELoader()));}

function mats(o){return Array.isArray(o?.material)?o.material:[o?.material].filter(Boolean)}
export function inspectW40Asset(root,THREE){
  const out={meshes:0,triangles:0,materials:0,texturedMaterials:0,baseColorMaps:0,normalMaps:0,roughnessMaps:0,metalnessMaps:0,aoMaps:0,skinnedMeshes:0,bones:0,animations:root?.userData?.authoredAnimations?.length||0,dimensions:null,validBounds:false};
  const ms=new Set(),bones=new Set();
  root?.updateMatrixWorld?.(true);root?.traverse?.(o=>{if(o?.isBone)bones.add(o);if(!o?.isMesh)return;out.meshes++;if(o.isSkinnedMesh)out.skinnedMeshes++;const count=o.geometry?.index?.count||o.geometry?.attributes?.position?.count||0;out.triangles+=Math.floor(count/3);for(const m of mats(o)){if(!m)continue;ms.add(m);let has=false;if(m.map){out.baseColorMaps++;has=true}if(m.normalMap){out.normalMaps++;has=true}if(m.roughnessMap){out.roughnessMaps++;has=true}if(m.metalnessMap){out.metalnessMaps++;has=true}if(m.aoMap){out.aoMaps++;has=true}if(has)out.texturedMaterials++}});out.materials=ms.size;out.bones=bones.size;
  try{const b=new THREE.Box3().setFromObject(root),s=new THREE.Vector3();if(!b.isEmpty()){b.getSize(s);out.dimensions={x:s.x,y:s.y,z:s.z};out.validBounds=[s.x,s.y,s.z].every(Number.isFinite)&&Math.max(s.x,s.y,s.z)>0.05&&Math.max(s.x,s.y,s.z)<250}}catch{}
  return out;
}
export function evaluateW40Asset(stats,{slot='generic',requiredAnimations=[]}={}){
  const reasons=[];if(!stats?.validBounds)reasons.push('invalid bounds');if((stats?.meshes||0)<1)reasons.push('no meshes');if((stats?.triangles||0)<100)reasons.push('too little geometry');
  if(slot==='john'){if((stats.skinnedMeshes||0)<1)reasons.push('no skinned mesh');if((stats.bones||0)<15)reasons.push('skeleton too small');if(requiredAnimations.length&&(stats.animations||0)<8)reasons.push('insufficient animation clips')}
  if(slot!=='john'){if((stats.baseColorMaps||0)+(stats.normalMaps||0)+(stats.roughnessMaps||0)<3)reasons.push('weak PBR texture coverage')}
  return{pass:reasons.length===0,reasons};
}

export function applyProfessionalRenderer(renderer,camera){
  if(renderer){renderer.toneMappingExposure=1.02;renderer.shadowMap.enabled=true;renderer.shadowMap.autoUpdate=true;}
  if(camera){camera.fov=W40_PROP_HUNT_CAMERA.fov;camera.near=.07;camera.far=Math.max(camera.far||180,180);camera.updateProjectionMatrix?.()}
}

export async function installWorkshopEnvironment(THREE,renderer,scene,{url=null}={}){
  const manifest=await loadW40Manifest();const hdri=url||manifest?.environmentLighting?.hdri1k;const status={provider:'Poly Haven',asset:manifest?.environmentLighting?.asset||'Small Workshop',url:hdri,state:'not-attempted'};
  if(!hdri||!renderer||!scene){status.state='unavailable';return status}
  try{status.state='loading';const RGBELoader=await rgbe(),tex=await RGBELoader.loadAsync(hdri),pmrem=new THREE.PMREMGenerator(renderer);pmrem.compileEquirectangularShader();const env=pmrem.fromEquirectangular(tex).texture;scene.environment=env;tex.dispose();pmrem.dispose();status.state='active';status.environment=env;return status}catch(err){status.state='failed';status.error=String(err?.message||err);return status}
}

async function loadCandidate(url){const l=await loader();const gltf=await l.loadAsync(url);const root=gltf.scene||gltf.scenes?.[0];if(root){root.userData=root.userData||{};root.userData.authoredAnimations=gltf.animations||[];root.userData.w40ExternalCandidate=true;}return root}
function hideRoot(root,hide=true){root?.traverse?.(o=>{if(o?.isMesh)o.visible=!hide})}
function fitRoot(candidate,fallback,THREE){if(!candidate||!fallback)return;candidate.updateMatrixWorld(true);fallback.updateMatrixWorld(true);const cb=new THREE.Box3().setFromObject(candidate),fb=new THREE.Box3().setFromObject(fallback);if(cb.isEmpty()||fb.isEmpty())return;const cs=new THREE.Vector3(),fs=new THREE.Vector3(),cc=new THREE.Vector3(),fc=new THREE.Vector3();cb.getSize(cs);fb.getSize(fs);cb.getCenter(cc);fb.getCenter(fc);const r=Math.min(fs.x/Math.max(.001,cs.x),fs.z/Math.max(.001,cs.z));const scale=Math.max(.3,Math.min(3,r));candidate.scale.multiplyScalar(scale);candidate.updateMatrixWorld(true);const cb2=new THREE.Box3().setFromObject(candidate),cc2=new THREE.Vector3();cb2.getCenter(cc2);candidate.position.x+=fc.x-cc2.x;candidate.position.z+=fc.z-cc2.z;candidate.position.y+=fb.min.y-cb2.min.y;candidate.updateMatrixWorld(true)}
function markShadows(root){root?.traverse?.(o=>{if(o?.isMesh){o.castShadow=true;o.receiveShadow=true}})}

export async function tryPromoteExternalPapa({THREE,world,scene,onStatus=()=>{}}={}){
  const manifest=await loadW40Manifest(),status={environment:{state:'not-ready'},props:{state:'not-ready'}};if(!world||world.key!=='papa')return status;
  const pairs=[['environment','papaShopHeroBay',world.productionEnvironment],['props','papaShopProps',world.productionPropSet]];
  for(const [key,slotName,fallback] of pairs){const slot=manifest?.slots?.[slotName];if(!slot?.qaReady){status[key]={state:'not-ready',candidate:slot?.candidate||null};continue}try{const candidate=await loadCandidate(slot.candidate),stats=inspectW40Asset(candidate,THREE),verdict=evaluateW40Asset(stats,{slot:slotName});if(!verdict.pass)throw new Error(verdict.reasons.join(', '));markShadows(candidate);if(fallback)fitRoot(candidate,fallback,THREE);(world.group||scene).add(candidate);hideRoot(fallback,true);candidate.userData.w40Approved=!!slot.approved;candidate.userData.w40Slot=slotName;if(key==='environment')world.productionEnvironment=candidate;else world.productionPropSet=candidate;status[key]={state:'promoted',candidate:slot.candidate,approved:!!slot.approved,stats};onStatus({key,...status[key]})}catch(err){hideRoot(fallback,false);status[key]={state:'rejected',candidate:slot?.candidate||null,error:String(err?.message||err)};onStatus({key,...status[key]})}}
  world.w40ExternalStatus=status;world.w40VisualStatus='w40-external-pipeline-active';return status;
}
