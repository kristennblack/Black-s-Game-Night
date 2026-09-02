import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.185.1/build/three.module.min.js';
import {GLTFLoader} from 'https://cdn.jsdelivr.net/npm/three@0.185.1/examples/jsm/loaders/GLTFLoader.js';

export const W29_FAMILY_V1=Object.freeze({
  john:Object.freeze({label:'John',model:'/models/characters/john-production-skinned.glb',status:'BUILD 52 V1 BASELINE'}),
  kristen:Object.freeze({label:'Kristen',model:'/models/characters/approved/CHAR_KRISTEN.glb',status:'W29 V1 CANDIDATE'}),
  holly:Object.freeze({label:'Holly',model:'/models/characters/approved/CHAR_HOLLY.glb',status:'W29 V1 CANDIDATE'}),
  vanessa:Object.freeze({label:'Vanessa',model:'/models/characters/approved/CHAR_VANESSA.glb',status:'W29 V1 CANDIDATE'}),
  elizabeth:Object.freeze({label:'Elizabeth / Lizzy',model:'/models/characters/approved/CHAR_LIZZIE.glb',status:'W29 V1 CANDIDATE'}),
  logan:Object.freeze({label:'Logan',model:'/models/characters/approved/CHAR_LOGAN.glb',status:'W29 V1 CANDIDATE'}),
  james:Object.freeze({label:'James',model:'/models/characters/approved/CHAR_JAMES.glb',status:'W29 V1 CANDIDATE'}),
  dorothy:Object.freeze({label:'Dorothy',model:'/models/characters/approved/CHAR_DOROTHY.glb',status:'W29 V1 CANDIDATE'})
});

const loader=new GLTFLoader();
function disposeRoot(root){root?.traverse?.(o=>{o.geometry?.dispose?.();const ms=Array.isArray(o.material)?o.material:[o.material];for(const m of ms){if(!m)continue;for(const k of ['map','normalMap','roughnessMap','metalnessMap','emissiveMap','alphaMap'])m[k]?.dispose?.();m.dispose?.()}})}

export async function loadW29FamilyCharacter(id){
  const spec=W29_FAMILY_V1[id];if(!spec)throw new Error(`Unknown W29 family candidate: ${id}`);
  const gltf=await loader.loadAsync(spec.model),root=gltf.scene||gltf.scenes?.[0];if(!root)throw new Error(`${spec.label} GLB contains no scene.`);
  const head=root.getObjectByName('head');if(!head)throw new Error(`${spec.label} candidate is missing the shared humanoid head bone.`);
  root.traverse(o=>{if(o.isMesh){o.castShadow=true;o.receiveShadow=true}});
  return {root,head,animations:gltf.animations||[],spec};
}

export function mountW29FamilyV1Viewer(container,{initial='kristen',animation='Idle'}={}){
  if(!container)throw new Error('W29 family viewer container required.');container.replaceChildren();
  const shell=document.createElement('div');shell.className='w29-family-shell';const status=document.createElement('div');status.className='w29-family-status';status.textContent='Loading W29 V1 family candidate…';shell.append(status);container.append(shell);
  let renderer;try{renderer=new THREE.WebGLRenderer({antialias:true,alpha:false,powerPreference:'high-performance'});}catch{status.textContent='WebGL unavailable on this browser.';return{setCharacter(){},setAnimation(){},dispose(){},status:'webgl-unavailable'}}
  renderer.setPixelRatio(Math.min(globalThis.devicePixelRatio||1,1.6));renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.03;renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.domElement.className='w29-family-canvas';shell.prepend(renderer.domElement);
  const scene=new THREE.Scene();scene.background=new THREE.Color(0x17120e);scene.add(new THREE.HemisphereLight(0xfff0d7,0x241b17,2.25));const key=new THREE.DirectionalLight(0xffdfb8,3.6);key.position.set(3.5,5,-4);key.castShadow=true;scene.add(key);const rim=new THREE.DirectionalLight(0x9fc5ff,1.45);rim.position.set(-3,3.6,2.5);scene.add(rim);
  const floor=new THREE.Mesh(new THREE.CircleGeometry(1.5,64),new THREE.MeshStandardMaterial({color:0x34271d,roughness:.98}));floor.rotation.x=-Math.PI/2;floor.receiveShadow=true;scene.add(floor);
  const camera=new THREE.PerspectiveCamera(30,1,.02,30),target=new THREE.Vector3(0,.95,0);let yaw=.18,pitch=.08,dist=3.1,down=null,current=null,mixer=null,currentAnimation=animation,seq=0,disposed=false,raf=0,ro=null;
  const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
  const setCamera=()=>{pitch=clamp(pitch,-.06,.66);dist=clamp(dist,2.0,5.0);const cp=Math.cos(pitch);camera.position.set(Math.sin(yaw)*cp*dist,target.y+Math.sin(pitch)*dist,-Math.cos(yaw)*cp*dist);camera.lookAt(target)};
  const resize=()=>{if(disposed)return;const w=Math.max(240,shell.clientWidth),h=Math.max(440,shell.clientHeight);renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix()};
  function play(name){currentAnimation=name;mixer?.stopAllAction?.();if(!current)return;const clip=current.animations.find(a=>a.name===name)||current.animations.find(a=>/idle/i.test(a.name))||current.animations[0];if(clip){mixer=new THREE.AnimationMixer(current.root);mixer.clipAction(clip).play()}status.dataset.animation=clip?.name||'None'}
  async function setCharacter(id){const my=++seq;status.textContent=`Loading ${W29_FAMILY_V1[id]?.label||id}…`;try{const loaded=await loadW29FamilyCharacter(id);if(disposed||my!==seq){disposeRoot(loaded.root);return}mixer?.stopAllAction?.();if(current){scene.remove(current.root);disposeRoot(current.root)}current=loaded;scene.add(loaded.root);const box=new THREE.Box3().setFromObject(loaded.root),size=new THREE.Vector3(),center=new THREE.Vector3();box.getSize(size);box.getCenter(center);target.set(center.x,Math.max(.55,center.y*.88),center.z);dist=clamp(Math.max(2.25,size.y*1.65),2.25,4.1);yaw=.18;pitch=.07;setCamera();play(currentAnimation);status.textContent=`${loaded.spec.label.toUpperCase()} · ${loaded.spec.status} · 19-CLIP SHARED RIG · PROFILE/HAIR POLISH DEFERRED`;status.dataset.character=id;status.dataset.ready='true'}catch(err){console.error(err);status.textContent=`Candidate failed: ${err.message||err}`}}
  renderer.domElement.addEventListener('pointerdown',e=>{down={x:e.clientX,y:e.clientY,yaw,pitch};renderer.domElement.setPointerCapture?.(e.pointerId)});renderer.domElement.addEventListener('pointermove',e=>{if(!down)return;yaw=down.yaw-(e.clientX-down.x)*.008;pitch=down.pitch+(e.clientY-down.y)*.006;setCamera()});renderer.domElement.addEventListener('pointerup',()=>down=null);renderer.domElement.addEventListener('wheel',e=>{e.preventDefault();dist*=e.deltaY>0?1.08:.92;setCamera()},{passive:false});renderer.domElement.addEventListener('dblclick',()=>{yaw=.18;pitch=.07;setCamera()});
  ro=new ResizeObserver(resize);ro.observe(shell);resize();setCamera();let last=performance.now();const frame=now=>{if(disposed)return;const dt=Math.min(.05,(now-last)/1000);last=now;mixer?.update(dt);renderer.render(scene,camera);raf=requestAnimationFrame(frame)};raf=requestAnimationFrame(frame);setCharacter(initial);
  return{setCharacter,setAnimation:play,dispose(){disposed=true;cancelAnimationFrame(raf);ro?.disconnect();mixer?.stopAllAction?.();if(current)disposeRoot(current.root);disposeRoot(scene);renderer.dispose();container.replaceChildren()},status:'loading'};
}
