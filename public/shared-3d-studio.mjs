import {getApprovedFamilyCharacter,tagWithApprovedIdentity} from './approved-family-characters.mjs';

/*
 * Black Family Game Night - Shared 3D Studio Systems
 * v2.0.0
 *
 * High-level realism systems shared by Prop Hunt, Family Island Life and
 * John's Birthday Seat.  The procedural rigs remain a dependable fallback,
 * while the authored-asset pipeline can transparently replace high-attention
 * characters, dogs, vehicles, furniture and hero props with GLB/GLTF assets.
 *
 * Design goals:
 * - gameplay semantics drive animation, not file names scattered through games
 * - important actions have physical contact, attention and audiovisual feedback
 * - multiplayer motion is buffered/interpolated rather than frame-chased
 * - open-world systems (weather, NPCs, water, terrain, selective physics) are
 *   deterministic enough to remain stable on phones and private multiplayer
 */

export const STUDIO_3D_VERSION='2.1.0';
export const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
export const damp=(current,target,lambda,dt)=>current+(target-current)*(1-Math.exp(-lambda*Math.max(0,dt)));
export const wrapAngle=a=>{while(a>Math.PI)a-=Math.PI*2;while(a<-Math.PI)a+=Math.PI*2;return a};
export const dampAngle=(current,target,lambda,dt)=>current+wrapAngle(target-current)*(1-Math.exp(-lambda*Math.max(0,dt)));
export const smoothstep=t=>{t=clamp(t,0,1);return t*t*(3-2*t)};
export const hashString=(s='')=>{let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return h>>>0};
export function seededRandom(seed=1){let s=(Number(seed)>>>0)||1;return()=>{s=(Math.imul(s,1664525)+1013904223)>>>0;return s/4294967296}}

export const DEFAULT_MODEL_MANIFEST=Object.freeze({
  version:3,
  characters:{john:{file:'/models/characters/john-production-skinned.glb',scale:.991826,production:true,rig:'skinned-humanoid',referenceHeight:1.82,animations:['Idle','Walk','Run','Sprint','Start_Move','Stop_Move','Turn_Left','Turn_Right','Jump','Fall','Land','Mantle','Crouch','Aim','Fire','Hit_Reaction','Wave','Celebrate','Sit'],games:['propHunt','islandLife','birthdaySeat']}},
  dogs:{gunner:{file:'/models/dogs/gunner.glb',games:['propHunt','islandLife','birthdaySeat']}},
  props:{propZapper:{file:'/models/props/prop-zapper.glb',games:['propHunt']},tractor:{file:'/models/props/tractor.glb',games:['propHunt']},motorcycle:{file:'/models/props/motorcycle.glb',games:['propHunt']}},
  furniture:{papaChair:{file:'/models/furniture/papa-chair.glb',games:['propHunt']},fireplace:{file:'/models/furniture/fireplace.glb',games:['propHunt']},workbench:{file:'/models/furniture/workbench.glb',games:['propHunt']},toolChest:{file:'/models/furniture/tool-chest.glb',games:['propHunt']},shelving:{file:'/models/furniture/shelving.glb',games:['propHunt']}},
  environments:{papaShop:{file:'/models/environments/papa-shop-barn-production.glb',production:true,games:['propHunt']}},
  sets:{papaShopProps:{file:'/models/sets/papa-shop-production-props.glb',production:true,games:['propHunt']}}
});

/**
 * Authored model loader with procedural fallback.
 *
 * Models are optional on purpose.  The game never goes blank because an asset
 * is missing; when a GLB is added later, the same gameplay code automatically
 * swaps to it.  This is the bridge from today's procedural models to bespoke
 * sculpted/skinned family assets.
 */
export function createAuthoredAssetPipeline(THREE,{manifestUrl='/models/manifest.json',loaderUrl='https://esm.sh/three@0.185.1/examples/jsm/loaders/GLTFLoader.js',skeletonUtilsUrl='https://esm.sh/three@0.185.1/examples/jsm/utils/SkeletonUtils.js',fetchImpl=globalThis.fetch,assetVersion='',reporter=null}={}){
  let manifest=DEFAULT_MODEL_MANIFEST,loaderPromise=null,skeletonClonePromise=null,lastError=null;
  const cache=new Map(),failed=new Set();
  const versioned=url=>{if(!assetVersion||!url||/^https?:/i.test(url))return url;const sep=url.includes('?')?'&':'?';return `${url}${sep}v=${encodeURIComponent(assetVersion)}`};
  const report=detail=>{lastError={at:new Date().toISOString(),...detail};try{reporter?.(lastError)}catch{}try{if(typeof window!=='undefined')window.dispatchEvent(new CustomEvent('bfg:3d-asset-warning',{detail:lastError}))}catch{}return lastError};
  async function ensureManifest(){
    if(!fetchImpl)return manifest;
    try{const r=await fetchImpl(versioned(manifestUrl),{cache:'no-store'});if(r?.ok){const m=await r.json();manifest={...DEFAULT_MODEL_MANIFEST,...m,characters:Object.prototype.hasOwnProperty.call(m,'characters')?m.characters:DEFAULT_MODEL_MANIFEST.characters,dogs:Object.prototype.hasOwnProperty.call(m,'dogs')?m.dogs:DEFAULT_MODEL_MANIFEST.dogs,props:Object.prototype.hasOwnProperty.call(m,'props')?m.props:DEFAULT_MODEL_MANIFEST.props,furniture:Object.prototype.hasOwnProperty.call(m,'furniture')?m.furniture:DEFAULT_MODEL_MANIFEST.furniture}}else report({kind:'manifest-load',asset:'model manifest',file:manifestUrl,error:`HTTP ${r?.status||'unknown'}`,fallbackUsed:true})}catch(err){report({kind:'manifest-load',asset:'model manifest',file:manifestUrl,error:String(err?.message||err),fallbackUsed:true})}
    return manifest;
  }
  async function ensureLoader(){
    if(loaderPromise)return loaderPromise;
    loaderPromise=import(loaderUrl).then(m=>new m.GLTFLoader()).catch(e=>{loaderPromise=null;throw e});
    return loaderPromise;
  }
  function entry(category,id){return manifest?.[category]?.[id]||null}
  async function cloneAuthored(root){if(!root)return null;if(!skeletonClonePromise)skeletonClonePromise=import(skeletonUtilsUrl).then(m=>m.clone).catch(()=>null);const cloneFn=await skeletonClonePromise;return cloneFn?cloneFn(root):root.clone(true)}
  function configure(root,{castShadow=true,receiveShadow=true,scale=1,position=null,rotation=null}={}){
    root.scale.multiplyScalar(scale);if(Array.isArray(position)&&position.length>=3)root.position.set(Number(position[0])||0,Number(position[1])||0,Number(position[2])||0);if(Array.isArray(rotation)&&rotation.length>=3)root.rotation.set(Number(rotation[0])||0,Number(rotation[1])||0,Number(rotation[2])||0);root.traverse?.(o=>{if(o.isMesh){o.castShadow=castShadow;o.receiveShadow=receiveShadow;o.frustumCulled=true;if(o.material){const ms=Array.isArray(o.material)?o.material:[o.material];for(const m of ms){if('envMapIntensity'in m)m.envMapIntensity=.85;m.needsUpdate=true}}}});return root;
  }
  async function load(category,id,{fallback=null,scale=1,clone=true}={}){
    await ensureManifest();const e=entry(category,id);const key=`${category}:${id}`;
    if(!e?.file||failed.has(key))return fallback?.()||null;
    try{
      if(!cache.has(key)){const loader=await ensureLoader();const gltf=await loader.loadAsync(versioned(e.file));cache.set(key,gltf)}
      const gltf=cache.get(key),root=clone?await cloneAuthored(gltf.scene):gltf.scene;
      configure(root,{scale:Number(e.scale||scale)||1,position:e.position,rotation:e.rotation});
      root.userData.authoredAsset={category,id,file:e.file};
      root.userData.authoredAnimations=gltf.animations||[];
      if(category==='characters')tagWithApprovedIdentity(root,id,{modelMatchesReference:!!e.approvedModel});
      return root;
    }catch(err){failed.add(key);const fallbackUsed=!!fallback;report({kind:'asset-load',asset:key,category,id,file:e?.file||null,error:String(err?.message||err),fallbackUsed});console.error(`Authored asset unavailable (${key}); fallback used: ${fallbackUsed?'YES':'NO'}.`,err);return fallback?.()||null}
  }
  const has=(category,id)=>!!entry(category,id)?.file&&!failed.has(`${category}:${id}`);
  const reportMissing=(category,id,{fallbackUsed=true,context='runtime character'}={})=>{const e=entry(category,id);return report({kind:'missing-authored-asset',asset:`${category}:${id}`,category,id,file:e?.file||null,error:`REAL 3D AVATAR ASSET MISSING for ${context}`,fallbackUsed})};
  return {ensureManifest,setManifest:m=>{manifest=m||DEFAULT_MODEL_MANIFEST},getManifest:()=>manifest,entry,has,load,loadCharacter:(id,o)=>load('characters',id,o),loadDog:(id,o)=>load('dogs',id,o),loadProp:(id,o)=>load('props',id,o),loadFurniture:(id,o)=>load('furniture',id,o),loadEnvironment:(id,o)=>load('environments',id,o),loadSet:(id,o)=>load('sets',id,o),approvedSpec:getApprovedFamilyCharacter,reportMissing,getLastError:()=>lastError,failed};
}

/** Reduce shadow/draw-state cost for large static authored sets without changing geometry. */
export function optimizeStaticAuthoredScene(root,{shadowMinRadius=.18,receiveShadow=true,freezeTransforms=true}={}){
  if(!root)return{meshes:0,shadowCasters:0};let meshes=0,shadowCasters=0;
  root.updateMatrixWorld?.(true);root.traverse?.(o=>{if(!o?.isMesh)return;meshes++;let radius=1;try{o.geometry?.computeBoundingSphere?.();radius=(o.geometry?.boundingSphere?.radius||1)*Math.max(Math.abs(o.scale?.x||1),Math.abs(o.scale?.y||1),Math.abs(o.scale?.z||1))}catch{}o.castShadow=radius>=shadowMinRadius;o.receiveShadow=receiveShadow;if(o.castShadow)shadowCasters++;o.frustumCulled=true;if(freezeTransforms){o.updateMatrix?.();o.matrixAutoUpdate=false}});root.userData.staticOptimization={meshes,shadowCasters,shadowMinRadius};return root.userData.staticOptimization;
}

export function findRigNode(root,names=[]){const targets=names.map(canonicalName);let exact=null,fuzzy=null;root?.traverse?.(o=>{const n=canonicalName(o.name||'');if(!n)return;if(!exact&&targets.includes(n))exact=o;else if(!fuzzy&&targets.some(t=>n.endsWith(t)||n.includes(t)))fuzzy=o});return exact||fuzzy}

/** Map a named authored hierarchy onto the same semantic parts contract used by
 * procedural rigs.  This lets a GLB become useful immediately, even before it
 * has authored clips: locomotion, gaze, recoil and contextual poses can drive
 * its named joints while AnimationMixer remains available when clips arrive. */
export function applyPrimaryClothingColor(root,color){
  if(!root||color==null)return 0;
  const roleMatch=v=>/^(primary[-_ ]?clothing|shirt|top|jacket|hoodie|sweater|dress[-_ ]?top)$/i.test(String(v||'').trim());
  const nameMatch=v=>/(^|[ _.-])(primary[-_ ]?clothing|shirt|top|jacket|hoodie|sweater|dress[-_ ]?top)([ _.-]|$)/i.test(String(v||''));
  let changed=0;
  root.traverse?.(mesh=>{
    if(!mesh?.isMesh)return;
    const meshTagged=mesh.userData?.primaryClothing===true||roleMatch(mesh.userData?.materialRole)||roleMatch(mesh.userData?.role)||nameMatch(mesh.name);
    const mats=Array.isArray(mesh.material)?mesh.material:[mesh.material];
    let cloned=false;
    const next=mats.map(mat=>{
      if(!mat)return mat;
      const tagged=meshTagged||mat.userData?.primaryClothing===true||roleMatch(mat.userData?.materialRole)||roleMatch(mat.userData?.role)||nameMatch(mat.name);
      if(!tagged||!mat.color?.set)return mat;
      const copy=mat.clone?.()||mat;copy.color.set(color);copy.needsUpdate=true;changed++;cloned=true;return copy;
    });
    if(cloned)mesh.material=Array.isArray(mesh.material)?next:next[0];
  });
  return changed;
}

export function bindAuthoredRigParts(root,{kind='human'}={}){
  if(!root)return null;
  const node=(...names)=>findRigNode(root,names);
  if(kind==='dog'){
    const leg=(prefix,front,side)=>({upper:node(prefix),lower:node(prefix+'Knee'),foot:node(prefix+'Paw'),front,side});
    const parts={
      body:node('body'),chest:node('chestPivot','chest'),head:node('head'),jaw:node('jaw'),tongue:node('tongue'),
      eyes:[node('leftEye'),node('rightEye')].filter(Boolean),ears:[node('leftEar'),node('rightEar')].filter(Boolean),
      legs:[leg('frontLeft',true,-1),leg('frontRight',true,1),leg('rearLeft',false,-1),leg('rearRight',false,1)].filter(l=>l.upper&&l.lower),
      tailPivot:node('tail'),weaponAnchor:node('backSocket','back_socket'),weapon:null
    };
    root.userData.parts=parts;root.userData.authoredRigKind='dog';return parts;
  }
  const parts={
    hips:node('hips','pelvis'),upperBody:node('upperBody','upper_body','spine2','spine_02','chest'),torso:node('torso'),head:node('head'),face:node('face'),
    eyes:[node('leftEye'),node('rightEye')].filter(Boolean),brows:[node('leftBrow'),node('rightBrow')].filter(Boolean),mouth:node('mouth'),
    leftArm:{shoulder:node('leftShoulder','shoulder_l'),elbow:node('leftElbow','elbow_l'),hand:node('leftHand','hand_l')},
    rightArm:{shoulder:node('rightShoulder','shoulder_r'),elbow:node('rightElbow','elbow_r'),hand:node('rightHand','hand_r')},
    leftLeg:{hip:node('leftHip','thigh_l'),knee:node('leftKnee','knee_l'),foot:node('leftFoot','foot_l')},
    rightLeg:{hip:node('rightHip','thigh_r'),knee:node('rightKnee','knee_r'),foot:node('rightFoot','foot_r')},
    weaponAnchor:node('rightHandSocket','right_hand_socket','rightHand','hand_r'),weapon:null
  };
  root.userData.parts=parts;root.userData.authoredRigKind='human';return parts;
}

export function hasAuthoredAnimationClips(root){return !!root?.userData?.authoredAnimations?.length}

export function attachToRigSocket(root,obj,{socket='rightHand',position=[0,0,0],rotation=[0,0,0],scale=1}={}){if(!root||!obj)return null;const aliases={rightHand:['righthandsocket','right_hand_socket','righthand','right_hand','hand_r','mixamorigrighthand','r_hand','wrist_r'],leftHand:['lefthandsocket','left_hand_socket','lefthand','left_hand','hand_l','mixamoriglefthand','l_hand','wrist_l'],head:['headsocket','head_socket','head','mixamorighead','neck_02'],back:['backsocket','back_socket','spine2','spine_02','mixamorigspine2','upperchest','chest']}[socket]||[socket],node=findRigNode(root,aliases)||root;node.add(obj);obj.position.set(...position);obj.rotation.set(...rotation);obj.scale.multiplyScalar(scale);obj.userData.rigSocket=socket;return node}

export const SEMANTIC_CLIP_ALIASES=Object.freeze({
  idle:['idle','Idle','idle_relaxed','stand'],walk:['walk','Walk','walking'],jog:['jog','Jog','run'],run:['run','Run','jog'],sprint:['sprint','Sprint','run'],startMove:['start_move','Start_Move','walk'],stopMove:['stop_move','Stop_Move','idle'],backward:['walk_backward','backward'],
  strafeLeft:['strafe_left','left'],strafeRight:['strafe_right','right'],turnLeft:['turn_left'],turnRight:['turn_right'],sharpTurnLeft:['sharp_turn_left','turn_left'],sharpTurnRight:['sharp_turn_right','turn_right'],turn180Left:['turn_180_left','turn_left'],turn180Right:['turn_180_right','turn_right'],jump:['jump','jump_start'],fall:['fall','air'],
  land:['land','landing'],hardLand:['hard_land','land_heavy'],mantle:['mantle','Mantle','climb'],crouch:['crouch','Crouch'],aim:['aim','rifle_aim'],fire:['fire','shoot'],hit:['hit','hit_react'],
  wave:['wave'],celebrate:['celebrate','cheer'],sit:['sit'],sleep:['sleep'],drink:['drink'],eat:['eat'],fish:['fish','fishing'],cast:['cast','fish_cast'],reel:['reel','fish_reel'],
  chop:['chop','axe'],mine:['mine','pickaxe'],dig:['dig','shovel'],water:['water','watering'],cook:['cook'],work:['work'],carry:['carry'],inspect:['inspect'],dance:['dance'],
  transform:['transform'],throw:['throw'],place:['place'],scratch:['scratch'],shake:['shake'],pant:['pant'],sniff:['sniff'],lie:['lie_down','lay']
});

function canonicalName(s=''){return String(s).trim().toLowerCase().replace(/[^a-z0-9]+/g,'_').replace(/^_|_$/g,'')}
export function findSemanticClip(clips,semantic){
  const aliases=SEMANTIC_CLIP_ALIASES[semantic]||[semantic],list=Array.isArray(clips)?clips:[];
  for(const alias of aliases){const target=canonicalName(alias),hit=list.find(c=>canonicalName(c?.name)===target||canonicalName(c?.name).includes(target));if(hit)return hit}
  return null;
}

/**
 * AnimationMixer-backed controller for authored rigs.
 *
 * In addition to ordinary full-body crossfades, this supports a true two-layer
 * pose: legs/hips continue locomotion while chest/arms/head aim or fire.  The
 * clips use disjoint tracks, so the player no longer freezes into an Aim pose
 * every time the weapon comes up.
 */
export class SemanticAnimationMixer{
  constructor(THREE,root,clips=[],{fade=.18}={}){
    this.THREE=THREE;this.root=root;this.clips=clips;this.fade=fade;
    this.mixer=clips?.length?new THREE.AnimationMixer(root):null;
    this.current=null;this.currentSemantic='idle';this.actions=new Map();
    this.layerActions=new Map();this.layerClips=new Map();this.baseAction=null;this.overlayAction=null;
    this.baseSemantic=null;this.overlaySemantic=null;this.mode='full';
  }
  clipFor(semantic){
    const fallback={sprint:['run','walk','idle'],jog:['run','walk','idle'],sharpTurnLeft:['turnLeft','walk','idle'],sharpTurnRight:['turnRight','walk','idle'],turn180Left:['turnLeft','walk','idle'],turn180Right:['turnRight','walk','idle'],startMove:['walk','idle'],stopMove:['idle'],run:['walk','idle'],walk:['idle'],backward:['walk','idle'],strafeLeft:['walk','idle'],strafeRight:['walk','idle'],jump:['fall','idle'],land:['idle'],hardLand:['land','idle'],aim:['idle'],fire:['aim','idle'],hit:['idle'],mantle:['jump','idle'],crouch:['idle']}[semantic]||['idle'];
    let clip=findSemanticClip(this.clips,semantic);if(!clip)for(const alt of fallback){clip=findSemanticClip(this.clips,alt);if(clip)break}return clip||null;
  }
  actionFor(semantic){if(!this.mixer)return null;if(this.actions.has(semantic))return this.actions.get(semantic);const clip=this.clipFor(semantic),a=clip?this.mixer.clipAction(clip):null;if(a)this.actions.set(semantic,a);return a}
  _trackIsLower(track){const n=canonicalName(String(track?.name||'').split('.')[0]);return /(^|_)(hips|lefthip|leftknee|leftfoot|righthip|rightknee|rightfoot)(_|$)/.test(n)}
  _maskedClip(semantic,layer){
    const key=`${layer}:${semantic}`;if(this.layerClips.has(key))return this.layerClips.get(key);
    const clip=this.clipFor(semantic);if(!clip)return null;
    const wantLower=layer==='lower',tracks=(clip.tracks||[]).filter(t=>this._trackIsLower(t)===wantLower).map(t=>t.clone?.()||t);
    if(!tracks.length)return null;
    const masked=new this.THREE.AnimationClip(`${clip.name}__${layer}`,clip.duration,tracks,clip.blendMode);this.layerClips.set(key,masked);return masked;
  }
  _layerAction(semantic,layer){
    if(!this.mixer)return null;const key=`${layer}:${semantic}`;if(this.layerActions.has(key))return this.layerActions.get(key);const clip=this._maskedClip(semantic,layer),a=clip?this.mixer.clipAction(clip):null;if(a)this.layerActions.set(key,a);return a;
  }
  _start(action,{fade=this.fade,timeScale=1,once=false}={}){
    if(!action)return false;action.enabled=true;action.timeScale=timeScale;action.setEffectiveWeight(1);
    if(once){action.setLoop(this.THREE.LoopOnce,1);action.clampWhenFinished=true}else{action.setLoop(this.THREE.LoopRepeat,Infinity);action.clampWhenFinished=false}
    if(!action.isRunning?.()){action.reset();if(timeScale<0)action.time=Math.max(0,action.getClip?.().duration||0);action.fadeIn(fade).play()}return true;
  }
  _fade(action,fade=this.fade){if(action){action.fadeOut(fade);return true}return false}
  play(semantic,{fade=this.fade,loop=true,timeScale=1,once=false}={}){
    const next=this.actionFor(semantic);this.currentSemantic=semantic;if(!next)return false;
    if(this.mode==='layered'){this._fade(this.baseAction,fade);this._fade(this.overlayAction,fade);this.baseAction=this.overlayAction=null;this.baseSemantic=this.overlaySemantic=null}
    this.mode='full';if(next===this.current){next.timeScale=timeScale;return true}
    next.enabled=true;next.reset();next.timeScale=timeScale;if(timeScale<0)next.time=Math.max(0,next.getClip?.().duration||0);next.setEffectiveWeight(1);
    if(once){next.setLoop(this.THREE.LoopOnce,1);next.clampWhenFinished=true}else if(loop){next.setLoop(this.THREE.LoopRepeat,Infinity);next.clampWhenFinished=false}
    if(this.current){this.current.crossFadeTo(next,fade,false)}else next.fadeIn(fade);next.play();this.current=next;return true;
  }
  playLayered(baseSemantic='idle',overlaySemantic='aim',{fade=this.fade,baseTimeScale=1,overlayTimeScale=1,overlayOnce=false}={}){
    if(!this.mixer)return false;const base=this._layerAction(baseSemantic,'lower')||this.actionFor(baseSemantic),overlay=this._layerAction(overlaySemantic,'upper')||this.actionFor(overlaySemantic);if(!base||!overlay)return this.play(overlaySemantic,{fade,timeScale:overlayTimeScale,once:overlayOnce});
    if(this.mode==='full'&&this.current){this._fade(this.current,fade);this.current=null}
    this.mode='layered';this.currentSemantic=overlaySemantic;
    if(base!==this.baseAction){this._fade(this.baseAction,fade);this.baseAction=base;this.baseSemantic=baseSemantic;this._start(base,{fade,timeScale:baseTimeScale})}else base.timeScale=baseTimeScale;
    if(overlay!==this.overlayAction){this._fade(this.overlayAction,fade);this.overlayAction=overlay;this.overlaySemantic=overlaySemantic;this._start(overlay,{fade,timeScale:overlayTimeScale,once:overlayOnce})}else overlay.timeScale=overlayTimeScale;
    return true;
  }
  update(dt){this.mixer?.update(Math.max(0,dt))}
  stop(fade=.15){this._fade(this.current,fade);this._fade(this.baseAction,fade);this._fade(this.overlayAction,fade);this.current=this.baseAction=this.overlayAction=null;this.baseSemantic=this.overlaySemantic=null}
  getState(){return{mode:this.mode,full:this.currentSemantic,base:this.baseSemantic,overlay:this.overlaySemantic}}
}

export const EXPRESSIONS=Object.freeze({
  neutral:{mouth:0,brow:0,eye:1},happy:{mouth:.35,brow:.08,eye:.96},excited:{mouth:.55,brow:.18,eye:1.08},focused:{mouth:-.05,brow:-.12,eye:.94},
  surprised:{mouth:.75,brow:.24,eye:1.16},hurt:{mouth:-.35,brow:-.28,eye:.84},sleepy:{mouth:-.05,brow:0,eye:.5},annoyed:{mouth:-.18,brow:-.2,eye:.88}
});

export function setExpression(actor,name='neutral',amount=1){actor._expression={name:EXPRESSIONS[name]?name:'neutral',amount:clamp(amount,0,1),at:Date.now()};return actor._expression}
export function updateProceduralFace(actor,dt,{expression=null,speaking=0}={}){
  const p=actor?.rig?.userData?.parts;if(!p)return;const e=EXPRESSIONS[expression||actor?._expression?.name||'neutral']||EXPRESSIONS.neutral,amt=actor?._expression?.amount??1;
  actor._faceState=actor._faceState||{mouth:0,brow:0,eye:1};actor._faceState.mouth=damp(actor._faceState.mouth,e.mouth*amt+speaking*.16,9,dt);actor._faceState.brow=damp(actor._faceState.brow,e.brow*amt,8,dt);actor._faceState.eye=damp(actor._faceState.eye,e.eye,12,dt);
  if(p.mouth){p.mouth.scale.y=.65+Math.abs(actor._faceState.mouth)*1.7;p.mouth.position.y=-.078+actor._faceState.mouth*.012;p.mouth.rotation.z=actor._faceState.mouth<0?Math.PI:0}
  if(p.brows)for(let i=0;i<p.brows.length;i++){const side=i?1:-1;p.brows[i].position.y=.072+actor._faceState.brow*.035;p.brows[i].rotation.z=side*(-.08-actor._faceState.brow*.28)}
  if(p.eyes)for(const eye of p.eyes)eye.scale.y=actor._faceState.eye*(actor?._blink??1);
}

/**
 * Lightweight procedural foot grounding.  This is deliberately a visual solve:
 * collision remains deterministic, while feet adapt to small terrain/stair
 * differences and authored rigs can later replace this with true bone IK.
 */
export function applyFootIK(actor,THREE,{heightAt=()=>0,dt=.016,maxLift=.13,footSpread=.145,forward=.02}={}){
  const p=actor?.rig?.userData?.parts;if(!p?.leftLeg?.foot||!p?.rightLeg?.foot)return null;actor._footIK=actor._footIK||{left:0,right:0};
  const sample=(side)=>{const yaw=actor.yaw||0,lx=Math.cos(yaw)*side*footSpread+Math.sin(yaw)*forward,lz=-Math.sin(yaw)*side*footSpread+Math.cos(yaw)*forward;return Number(heightAt((actor.x||0)+lx,(actor.z||0)+lz))||0};
  const baseY=actor.y||0,left=clamp(sample(-1)-baseY,-.04,maxLift),right=clamp(sample(1)-baseY,-.04,maxLift);actor._footIK.left=damp(actor._footIK.left,left,18,dt);actor._footIK.right=damp(actor._footIK.right,right,18,dt);
  for(const [leg,val] of [[p.leftLeg,actor._footIK.left],[p.rightLeg,actor._footIK.right]]){leg.foot.userData.baseY??=leg.foot.position.y;leg.foot.position.y=leg.foot.userData.baseY+val;leg.foot.rotation.x=damp(leg.foot.rotation.x,clamp(-val*1.6,-.18,.18),14,dt)}return actor._footIK;
}

/** Visual two-hand reach for procedural rigs during context actions. */
export function applyHandReach(actor,target,dt,{strength=1,twoHanded=false}={}){
  const p=actor?.rig?.userData?.parts;if(!target||!p?.rightArm)return;const dx=target.x-(actor.x||0),dy=(target.y??(actor.y||0)+1)-(actor.y||0),dz=target.z-(actor.z||0),dist=Math.hypot(dx,dz)||1,vertical=clamp(dy-1,-.8,.7),reach=clamp((dist-.35)/1.3,0,1)*strength;
  const apply=(arm,side=1,weight=1)=>{arm.shoulder.rotation.x=damp(arm.shoulder.rotation.x,-.35-reach*.95+vertical*.18,12,dt);arm.shoulder.rotation.z=damp(arm.shoulder.rotation.z,side*.08*(1-reach),12,dt);arm.elbow.rotation.x=damp(arm.elbow.rotation.x,-.15-reach*.75,12,dt)*weight};
  apply(p.rightArm,1,1);if(twoHanded&&p.leftArm)apply(p.leftArm,-1,.85);
}

/** Network snapshot buffer with interpolation and very short extrapolation. */
export class SnapshotBuffer{
  constructor({delayMs=100,maxAgeMs=1000,maxExtrapolateMs=100}={}){this.delayMs=delayMs;this.maxAgeMs=maxAgeMs;this.maxExtrapolateMs=maxExtrapolateMs;this.items=[]}
  push(s,receivedAt=globalThis.performance?.now?.()??Date.now()){if(!s)return;const at=Number(receivedAt)||Date.now();this.items.push({...s,_sourceAt:Number(s.at)||null,_at:at,_receivedAt:at});this.items.sort((a,b)=>a._at-b._at);const cutoff=at-this.maxAgeMs;while(this.items.length>2&&this.items[1]._at<cutoff)this.items.shift();if(this.items.length>32)this.items.splice(0,this.items.length-32)}
  sample(now=globalThis.performance?.now?.()??Date.now()){
    if(!this.items.length)return null;const target=now-this.delayMs;let a=this.items[0],b=this.items[this.items.length-1];for(let i=1;i<this.items.length;i++){if(this.items[i]._at>=target){a=this.items[i-1];b=this.items[i];break}}
    if(target>=b._at){const dt=clamp((target-b._at)/1000,0,this.maxExtrapolateMs/1000);return {...b,x:(b.x||0)+(b.vx||0)*dt,y:(b.y||0)+(b.vy||0)*dt,z:(b.z||0)+(b.vz||0)*dt,_extrapolated:dt>0}}
    const span=Math.max(1,b._at-a._at),t=clamp((target-a._at)/span,0,1),lerp=(x,y)=>(x??0)+((y??0)-(x??0))*t;return {...b,x:lerp(a.x,b.x),y:lerp(a.y,b.y),z:lerp(a.z,b.z),yaw:(a.yaw??0)+wrapAngle((b.yaw??0)-(a.yaw??0))*t,pitch:lerp(a.pitch,b.pitch),vx:lerp(a.vx,b.vx),vy:lerp(a.vy,b.vy),vz:lerp(a.vz,b.vz),_blend:t};
  }
}

/** A* navigation grid for family NPC routines. */
export function createNavigationGrid({minX=-50,maxX=50,minZ=-50,maxZ=50,cellSize=1.4,isBlocked=()=>false}={}){
  const width=Math.floor((maxX-minX)/cellSize)+1,depth=Math.floor((maxZ-minZ)/cellSize)+1;
  const toCell=(x,z)=>({x:clamp(Math.round((x-minX)/cellSize),0,width-1),z:clamp(Math.round((z-minZ)/cellSize),0,depth-1)}),toWorld=(x,z)=>({x:minX+x*cellSize,z:minZ+z*cellSize});
  const key=(x,z)=>`${x},${z}`,heur=(a,b)=>Math.hypot(a.x-b.x,a.z-b.z);
  function findPath(start,goal,{maxNodes=2500}={}){const s=toCell(start.x,start.z),g=toCell(goal.x,goal.z);if(isBlocked(...Object.values(toWorld(g.x,g.z))))return[];const open=[s],came=new Map(),gScore=new Map([[key(s.x,s.z),0]]),fScore=new Map([[key(s.x,s.z),heur(s,g)]]);let visited=0;
    while(open.length&&visited++<maxNodes){let bi=0;for(let i=1;i<open.length;i++)if((fScore.get(key(open[i].x,open[i].z))??Infinity)<(fScore.get(key(open[bi].x,open[bi].z))??Infinity))bi=i;const cur=open.splice(bi,1)[0];if(cur.x===g.x&&cur.z===g.z){const out=[cur],rev=new Map(came);let ck=key(cur.x,cur.z);while(rev.has(ck)){const prev=rev.get(ck);out.push(prev);ck=key(prev.x,prev.z)}return out.reverse().map(c=>toWorld(c.x,c.z))}
      for(const [dx,dz,cost] of [[1,0,1],[-1,0,1],[0,1,1],[0,-1,1],[1,1,1.414],[-1,1,1.414],[1,-1,1.414],[-1,-1,1.414]]){const nx=cur.x+dx,nz=cur.z+dz;if(nx<0||nz<0||nx>=width||nz>=depth)continue;const w=toWorld(nx,nz);if(isBlocked(w.x,w.z))continue;if(dx&&dz){const sideA=toWorld(cur.x+dx,cur.z),sideB=toWorld(cur.x,cur.z+dz);if(isBlocked(sideA.x,sideA.z)||isBlocked(sideB.x,sideB.z))continue}const nk=key(nx,nz),tent=(gScore.get(key(cur.x,cur.z))??Infinity)+cost;if(tent<(gScore.get(nk)??Infinity)){came.set(nk,cur);gScore.set(nk,tent);fScore.set(nk,tent+heur({x:nx,z:nz},g));if(!open.some(o=>o.x===nx&&o.z===nz))open.push({x:nx,z:nz})}}
    }return[]}
  return {minX,maxX,minZ,maxZ,cellSize,width,depth,toCell,toWorld,findPath};
}

export const NPC_ROUTINES=Object.freeze(['wander','shop','coffee','work','fish','gather','visitHome','sit','socialize']);
export function chooseNpcRoutine(seed,timeMs,{hour=null}={}){const segment=Math.floor(timeMs/45000),r=seededRandom((Number(seed)||1)^segment),h=hour??((timeMs/60000)%24);if(h<6||h>22)return'visitHome';const weighted=h<10?['coffee','work','wander','gather','shop']:h<17?['work','shop','fish','gather','socialize','wander']:['socialize','visitHome','sit','shop','wander'];return weighted[Math.floor(r()*weighted.length)]}

export const WEATHER_STATES=Object.freeze({
  sunny:{cloud:.05,rain:0,fog:0,wind:.18,exposure:1.12},partly:{cloud:.35,rain:0,fog:.04,wind:.28,exposure:1.04},overcast:{cloud:.75,rain:0,fog:.14,wind:.34,exposure:.9},
  rain:{cloud:.92,rain:.62,fog:.18,wind:.5,exposure:.82},storm:{cloud:1,rain:1,fog:.24,wind:.85,exposure:.72},mist:{cloud:.45,rain:.08,fog:.52,wind:.12,exposure:.9}
});
export function weatherForTime(seed,timeMs,segmentMs=180000){const segment=Math.floor(timeMs/segmentMs),r=seededRandom((Number(seed)||1)^Math.imul(segment+1,2654435761)),v=r();const state=v<.42?'sunny':v<.64?'partly':v<.78?'overcast':v<.9?'rain':v<.96?'mist':'storm';return{state,segment,progress:(timeMs%segmentMs)/segmentMs,...WEATHER_STATES[state]}}

export function createWeatherSystem(THREE,scene,{renderer=null,sun=null,hemi=null,seed=1,bounds=55,maxDrops=900}={}){
  const count=maxDrops,pos=new Float32Array(count*3),vel=new Float32Array(count),rr=seededRandom(seed+77);for(let i=0;i<count;i++){pos[i*3]=(rr()-.5)*bounds*1.8;pos[i*3+1]=2+rr()*18;pos[i*3+2]=(rr()-.5)*bounds*1.8;vel[i]=9+rr()*8}const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.BufferAttribute(pos,3));const mat=new THREE.PointsMaterial({color:0xcfe3ed,size:.035,transparent:true,opacity:0,depthWrite:false,sizeAttenuation:true}),rain=new THREE.Points(geo,mat);rain.visible=false;scene.add(rain);let current={...WEATHER_STATES.sunny,state:'sunny'},lightning=0;
  function update(dt,timeMs,player={x:0,z:0}){const next=weatherForTime(seed,timeMs);for(const k of ['cloud','rain','fog','wind','exposure'])current[k]=damp(current[k]??next[k],next[k],.7,dt);current.state=next.state;rain.visible=current.rain>.03;mat.opacity=current.rain*.48;rain.position.x=player.x||0;rain.position.z=player.z||0;if(rain.visible){const a=geo.attributes.position.array;for(let i=0;i<count;i++){a[i*3+1]-=vel[i]*dt;a[i*3]+=current.wind*dt*1.5;if(a[i*3+1]<0){a[i*3+1]=14+rr()*8;a[i*3]=(rr()-.5)*bounds*1.5;a[i*3+2]=(rr()-.5)*bounds*1.5}}geo.attributes.position.needsUpdate=true}
    if(scene.fog){scene.fog.near=damp(scene.fog.near,55-current.fog*40,1.2,dt);scene.fog.far=damp(scene.fog.far,105-current.fog*62,1.2,dt)}if(renderer)renderer.toneMappingExposure=damp(renderer.toneMappingExposure,current.exposure,1.1,dt);if(sun)sun.intensity=damp(sun.intensity,2.9*(1-current.cloud*.58),1.1,dt);if(hemi)hemi.intensity=damp(hemi.intensity,1.65*(1-current.cloud*.28),1.1,dt);if(current.state==='storm'&&Math.random()<dt*.04)lightning=.12;lightning=Math.max(0,lightning-dt);if(lightning>0&&hemi)hemi.intensity+=4*lightning/.12;return current}
  function dispose(){scene.remove(rain);geo.dispose();mat.dispose()}
  return{update,dispose,get current(){return current}};
}

/** Stylized physically-aware water without an expensive reflection render pass. */
export function createWaterSurface(THREE,{radius=72,size=null,colorDeep=0x1f6f85,colorShallow=0x68c2cd,y=-.18,segments=96,opacity=.9,shoreRadius=null,foamWidth=1.6}={}){
  const geom=size?new THREE.PlaneGeometry(size,size,segments,segments):new THREE.CircleGeometry(radius,segments);geom.rotateX(-Math.PI/2);
  const resolvedShore=shoreRadius==null?(size?0:radius*.78):Math.max(0,Number(shoreRadius)||0);
  const uniforms={uTime:{value:0},uDeep:{value:new THREE.Color(colorDeep)},uShallow:{value:new THREE.Color(colorShallow)},uOpacity:{value:opacity},uWind:{value:.25},uShoreRadius:{value:resolvedShore},uFoamWidth:{value:Math.max(.15,foamWidth)}};
  const mat=new THREE.ShaderMaterial({transparent:true,depthWrite:false,uniforms,vertexShader:`uniform float uTime;uniform float uWind;varying vec3 vWorld;varying float vWave;void main(){vec3 p=position;float w=sin((p.x+uTime*1.4)*.21)+cos((p.z-uTime*.9)*.27)+sin((p.x+p.z+uTime*.6)*.11);w*=.035*(1.0+uWind*.5);p.y+=w;vec4 wp=modelMatrix*vec4(p,1.0);vWorld=wp.xyz;vWave=w;gl_Position=projectionMatrix*viewMatrix*vec4(p,1.0);}`,fragmentShader:`uniform vec3 uDeep;uniform vec3 uShallow;uniform float uOpacity;uniform float uTime;uniform float uShoreRadius;uniform float uFoamWidth;varying vec3 vWorld;varying float vWave;void main(){vec3 V=normalize(cameraPosition-vWorld);float fres=pow(1.0-clamp(abs(V.y),0.0,1.0),2.2);float sparkle=smoothstep(.02,.055,vWave)*.16;float r=length(vWorld.xz);float edge=abs(r-uShoreRadius);float shore=uShoreRadius>0.0?1.0-smoothstep(uFoamWidth*.25,uFoamWidth,edge):0.0;float lace=.55+.45*sin(vWorld.x*.75+vWorld.z*.58+uTime*1.8);float foam=shore*(.12+.2*lace);vec3 c=mix(uShallow,uDeep,.48+fres*.36)+sparkle+vec3(.86,.94,.93)*foam;float alpha=uOpacity*(.72+fres*.22)+shore*.06;gl_FragColor=vec4(c,clamp(alpha,0.0,1.0));}`,side:THREE.DoubleSide});const mesh=new THREE.Mesh(geom,mat);mesh.position.y=y;mesh.renderOrder=-1;mesh.userData.studioWater={uniforms,baseY:y,shoreRadius:resolvedShore,foamWidth};mesh.receiveShadow=false;return mesh;
}
export function animateWater(mesh,time,wind=.25){if(mesh?.userData?.studioWater){const u=mesh.userData.studioWater.uniforms;u.uTime.value=time;u.uWind.value=wind}}

/** Height function and visual terrain builder for the tropical island. */
export function tropicalHeightAt(x,z){const r=Math.hypot(x,z),shore=smoothstep(clamp((r-36)/13,0,1)),centerBlend=smoothstep(clamp((r-17)/8,0,1)),homeRing=1-smoothstep(clamp(Math.abs(r-39)/6,0,1));const broad=Math.sin(x*.095)*.1+Math.cos(z*.083)*.085+Math.sin((x+z)*.052)*.075;const meadow=Math.max(0,Math.sin((x-12)*.06)*.07);const levelBlend=clamp(centerBlend*(1-homeRing*.72),0,1);return clamp((broad+meadow)*(1-shore)*levelBlend,-.045,.19)}
export function createHeightfieldTerrain(THREE,{size=104,radius=null,segments=72,heightFn=tropicalHeightAt,material=null,color=0x6fa35f}={}){const geo=radius?new THREE.CircleGeometry(radius,Math.max(48,segments),Math.max(4,Math.round(segments*.55))):new THREE.PlaneGeometry(size,size,segments,segments);geo.rotateX(-Math.PI/2);const p=geo.attributes.position;for(let i=0;i<p.count;i++){const x=p.getX(i),z=p.getZ(i);p.setY(i,heightFn(x,z))}p.needsUpdate=true;geo.computeVertexNormals();const mat=material||new THREE.MeshStandardMaterial({color,roughness:.96,metalness:0});const mesh=new THREE.Mesh(geo,mat);mesh.receiveShadow=true;mesh.userData.terrainHeightAt=heightFn;return mesh}

/** Tiny selective physics for moveable household/prop objects. */
export function createSelectivePhysics(THREE,scene,{gravity=16,groundAt=()=>0,bounds=80}={}){const bodies=[];function register(mesh,{radius=.18,mass=1,bounce=.24,friction=.84,restOffset=0}={}){const b={mesh,radius,mass:Math.max(.01,mass),bounce,friction,restOffset,v:new THREE.Vector3(),spin:new THREE.Vector3(),sleep:0};bodies.push(b);mesh.userData.physicsBody=b;return b}function impulse(body,v){if(!body)return;body.v.x+=(v.x||0)/body.mass;body.v.y+=(v.y||0)/body.mass;body.v.z+=(v.z||0)/body.mass;body.sleep=0}function update(dt){for(const b of bodies){if(!b.mesh.parent)continue;if(b.sleep>1.5)continue;b.v.y-=gravity*dt;b.mesh.position.addScaledVector(b.v,dt);b.mesh.rotation.x+=b.spin.x*dt;b.mesh.rotation.y+=b.spin.y*dt;b.mesh.rotation.z+=b.spin.z*dt;const g=groundAt(b.mesh.position.x,b.mesh.position.z)+b.radius+b.restOffset;if(b.mesh.position.y<g){b.mesh.position.y=g;if(Math.abs(b.v.y)<.5){b.v.y=0;b.sleep+=dt}else{b.v.y=-b.v.y*b.bounce;b.sleep=0}b.v.x*=Math.pow(b.friction,dt*60);b.v.z*=Math.pow(b.friction,dt*60);b.spin.multiplyScalar(Math.pow(.9,dt*60))}if(Math.hypot(b.mesh.position.x,b.mesh.position.z)>bounds){b.mesh.position.x=clamp(b.mesh.position.x,-bounds,bounds);b.mesh.position.z=clamp(b.mesh.position.z,-bounds,bounds);b.v.x*=-.3;b.v.z*=-.3}}}function clear(){for(const b of bodies)b.mesh.userData.physicsBody=null;bodies.length=0}return{bodies,register,impulse,update,clear,remove:body=>{const i=bodies.indexOf(body);if(i>=0)bodies.splice(i,1)}}}

/** WebAudio soundscape. No binary audio assets required for the core experience. */
export function createAudioSystem({storageKey='gn_3d_audio'}={}){
  let ctx=null,master=null,unlocked=false,ambience={},ambientClock=0,nextAmbient=.8;const pref=()=>{try{return JSON.parse(localStorage.getItem(storageKey)||'{}')}catch{return{}}};let settings={volume:.72,muted:false,...pref()};
  function ensure(){if(ctx)return ctx;const AC=globalThis.AudioContext||globalThis.webkitAudioContext;if(!AC)return null;ctx=new AC();master=ctx.createGain();master.gain.value=settings.muted?0:settings.volume;master.connect(ctx.destination);return ctx}
  async function unlock(){const c=ensure();if(!c)return false;if(c.state==='suspended')await c.resume();unlocked=true;return true}
  function save(){try{localStorage.setItem(storageKey,JSON.stringify(settings))}catch{}if(master)master.gain.value=settings.muted?0:settings.volume}
  function noiseBuffer(c,d=.18){const n=Math.max(1,Math.floor(c.sampleRate*d)),b=c.createBuffer(1,n,c.sampleRate),a=b.getChannelData(0);for(let i=0;i<n;i++)a[i]=(Math.random()*2-1)*(1-i/n);return b}
  function oneShot(kind,{volume=.25,pitch=1,pan=0,surface='default'}={}){const c=ensure();if(!c||!unlocked||settings.muted)return;const gain=c.createGain(),panner=c.createStereoPanner?.();gain.gain.value=volume;const dst=panner||gain;if(panner){panner.pan.value=clamp(pan,-1,1);gain.connect(panner);panner.connect(master)}else gain.connect(master);const oscKinds={ui:[660,'sine',.05],door:[145,'triangle',.13],zap:[210,'sawtooth',.12],coffee:[420,'sine',.08],bird:[1200,'sine',.1],water:[260,'sine',.12]};if(kind==='step'||kind==='land'||kind==='rain'||kind==='impact'){const profiles={default:[650,1,1],grass:[520,.82,.96],dirt:[430,.88,.9],sand:[310,.72,.82],gravel:[1050,1.08,1.08],concrete:[1180,1.02,1.04],wood:[780,.95,1.02],metal:[1650,.88,1.15],water:[360,.62,.78]};const [surfaceCutoff,surfaceGain,surfaceRate]=profiles[surface]||profiles.default,src=c.createBufferSource();src.buffer=noiseBuffer(c,kind==='land'?.15:.07);src.playbackRate.value=pitch*surfaceRate;const filter=c.createBiquadFilter();filter.type='lowpass';filter.frequency.value=kind==='step'?surfaceCutoff:kind==='land'?surfaceCutoff*.7:1800;src.connect(filter);filter.connect(gain);gain.gain.setValueAtTime(volume*surfaceGain,c.currentTime);gain.gain.exponentialRampToValueAtTime(.001,c.currentTime+(kind==='land'?.16:.08));src.start();src.stop(c.currentTime+.18);return}const [freq=300,type='sine',dur=.08]=oscKinds[kind]||[330,'sine',.08],osc=c.createOscillator();osc.frequency.value=freq*pitch;osc.type=type;osc.connect(gain);gain.gain.setValueAtTime(volume,c.currentTime);gain.gain.exponentialRampToValueAtTime(.001,c.currentTime+dur);osc.start();osc.stop(c.currentTime+dur)}
  function setSettings(next){settings={...settings,...next};save();return settings}
  function setAmbience(next){ambience={...ambience,...next};return ambience}
  function update(dt){if(!unlocked||settings.muted)return;ambientClock+=Math.max(0,dt||0);if(ambientClock<nextAmbient)return;ambientClock=0;const rain=clamp(ambience.rain||0,0,1),birds=clamp(ambience.birds||0,0,1),water=clamp(ambience.water||0,0,1),wind=clamp(ambience.wind||0,0,1),r=Math.random(),sum=rain*.9+birds*.45+water*.32+wind*.22;if(sum>.02){let cursor=r*sum;if((cursor-=rain*.9)<=0)oneShot('rain',{volume:.018+.035*rain,pitch:.8+Math.random()*.35,pan:(Math.random()-.5)*1.5});else if((cursor-=birds*.45)<=0)oneShot('bird',{volume:.015+.025*birds,pitch:.8+Math.random()*.55,pan:(Math.random()-.5)*1.8});else if((cursor-=water*.32)<=0)oneShot('water',{volume:.012+.02*water,pitch:.7+Math.random()*.25,pan:(Math.random()-.5)*1.2});else if(wind>.05)oneShot('rain',{volume:.008+.014*wind,pitch:.45+Math.random()*.18,pan:(Math.random()-.5)*1.6})}nextAmbient=rain>.35?.13:.9+Math.random()*1.8}
  return{unlock,oneShot,update,setSettings,setAmbience,get settings(){return settings},get ambience(){return ambience},get unlocked(){return unlocked}};
}

export function mountAudioPreferences(host,audio,{top='112px',right='66px'}={}){if(!host||!audio||typeof document==='undefined')return()=>{};const styleId='g3d-studio-audio-style';if(!document.getElementById(styleId)){const st=document.createElement('style');st.id=styleId;st.textContent=`.g3d-audio-button{position:absolute;z-index:19;border:1px solid #ffffff35;border-radius:999px;background:#11120fbd;color:#fff;width:34px;height:34px;padding:0;display:grid;place-items:center;font:900 14px/1 system-ui,sans-serif;letter-spacing:.06em;backdrop-filter:blur(7px);box-shadow:0 5px 14px #0006;touch-action:manipulation}.g3d-audio-panel{position:absolute;z-index:51;width:min(250px,calc(100% - 28px));padding:12px;border:1px solid #ffffff32;border-radius:16px;background:#121310f2;color:#fff;box-shadow:0 16px 38px #0009;backdrop-filter:blur(12px);font:600 11px/1.35 system-ui,sans-serif}.g3d-audio-panel[hidden]{display:none}.g3d-audio-panel strong{display:block;font-size:12px}.g3d-audio-panel label{display:grid;grid-template-columns:1fr auto;gap:8px;align-items:center;margin:9px 0}.g3d-audio-panel input[type=range]{grid-column:1/-1;width:100%;accent-color:#d8b867}.g3d-audio-panel input[type=checkbox]{width:20px;height:20px;accent-color:#d8b867}.g3d-audio-panel button{border:1px solid #ffffff28;border-radius:10px;background:#2a2a25;color:#fff;padding:7px 9px;font-weight:800}@media(max-width:700px){.g3d-audio-button{width:32px;height:32px;padding:0}}`;document.head.appendChild(st)}const b=document.createElement('button');b.type='button';b.className='g3d-audio-button no-look';b.textContent='♪';b.style.top=top;b.style.right=right;b.setAttribute('aria-label','3D audio settings');const panel=document.createElement('section');panel.className='g3d-audio-panel no-look';panel.hidden=true;panel.style.top=`calc(${top} + 34px)`;panel.style.right=right;const prefs=audio.settings;panel.innerHTML=`<strong>3D Sound</strong><label><span>Volume <b data-studio-volume>${Math.round((prefs.volume??.72)*100)}%</b></span><input data-studio-volume-range type="range" min="0" max="1" step="0.05" value="${prefs.volume??.72}"></label><label><span>Mute sound</span><input data-studio-mute type="checkbox" ${prefs.muted?'checked':''}></label><button type="button" data-studio-done>DONE</button>`;host.append(b,panel);const range=panel.querySelector('[data-studio-volume-range]'),label=panel.querySelector('[data-studio-volume]'),mute=panel.querySelector('[data-studio-mute]');const apply=()=>{audio.setSettings({volume:Number(range.value),muted:!!mute.checked});label.textContent=`${Math.round(Number(range.value)*100)}%`;if(!mute.checked)audio.unlock?.()};range.addEventListener('input',apply);mute.addEventListener('change',apply);b.onclick=()=>{panel.hidden=!panel.hidden;if(!panel.hidden)audio.unlock?.()};panel.querySelector('[data-studio-done]').onclick=()=>panel.hidden=true;const outside=e=>{if(!panel.hidden&&!panel.contains(e.target)&&e.target!==b)panel.hidden=true};document.addEventListener('pointerdown',outside);return()=>{document.removeEventListener('pointerdown',outside);b.remove();panel.remove()}}

export function createCinematicCamera(cameraRig){let shot=null;function start({duration=1.15,distance=null,pitch=null,yawOffset=0,hold=.08,returnDuration=.6,restore=true,onDone=null}={}){shot={phase:'out',duration:Math.max(.05,duration),remaining:Math.max(.05,duration),distance,pitch,yawOffset,hold:Math.max(0,hold),returnDuration:Math.max(.05,returnDuration),restore,onDone,baseYaw:cameraRig.state.yaw,basePitch:cameraRig.state.pitch,baseDistance:cameraRig.state.targetDistance||cameraRig.state.distance,peakYaw:null,peakPitch:null,peakDistance:null}}function applyOut(s,e){if(s.distance!=null)cameraRig.state.targetDistance=s.baseDistance+(s.distance-s.baseDistance)*e;if(s.pitch!=null)cameraRig.state.pitch=s.basePitch+(s.pitch-s.basePitch)*e;cameraRig.state.yaw=s.baseYaw+s.yawOffset*e}function update(dt){if(!shot)return false;const s=shot;if(s.phase==='out'){s.remaining-=dt;const t=1-clamp(s.remaining/s.duration,0,1);applyOut(s,smoothstep(t));if(s.remaining<=0){s.peakYaw=cameraRig.state.yaw;s.peakPitch=cameraRig.state.pitch;s.peakDistance=cameraRig.state.targetDistance;if(!s.restore){const done=s.onDone;shot=null;done?.();return true}s.phase=s.hold>0?'hold':'back';s.remaining=s.hold>0?s.hold:s.returnDuration}}else if(s.phase==='hold'){s.remaining-=dt;if(s.remaining<=0){s.phase='back';s.remaining=s.returnDuration}}else if(s.phase==='back'){s.remaining-=dt;const t=1-clamp(s.remaining/s.returnDuration,0,1),e=smoothstep(t);cameraRig.state.yaw=(s.peakYaw??cameraRig.state.yaw)+wrapAngle(s.baseYaw-(s.peakYaw??cameraRig.state.yaw))*e;cameraRig.state.pitch=(s.peakPitch??cameraRig.state.pitch)+(s.basePitch-(s.peakPitch??cameraRig.state.pitch))*e;cameraRig.state.targetDistance=(s.peakDistance??cameraRig.state.targetDistance)+(s.baseDistance-(s.peakDistance??cameraRig.state.targetDistance))*e;if(s.remaining<=0){const done=s.onDone;shot=null;done?.()}}return true}return{start,update,cancel:()=>shot=null,get active(){return!!shot}}}

export function computeStereoPan(listenerYaw,listener,target){const dx=target.x-listener.x,dz=target.z-listener.z,a=Math.atan2(dx,-dz),rel=wrapAngle(a-listenerYaw);return clamp(Math.sin(rel),-1,1)}

/** Returns a compact feature manifest used by QA and in-game diagnostics. */
export function studioFeatureManifest(){return{version:STUDIO_3D_VERSION,authoredAssets:true,skeletonSafeCloning:true,authoredRigSockets:true,semanticAnimationMixer:true,layeredAimLocomotion:true,directionalAimLocomotion:true,reverseBackpedalPlayback:true,staticSceneOptimization:true,proceduralIK:true,faceStates:true,networkSnapshotBuffer:true,navGrid:true,cornerSafePathing:true,npcRoutines:true,weather:true,shaderWater:true,shorelineFoam:true,heightfieldTerrain:true,selectivePhysics:true,webAudio:true,surfaceAudio:true,cinematics:true}}
