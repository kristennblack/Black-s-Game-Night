import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.185.1/build/three.module.min.js';
import {GLTFLoader} from 'https://cdn.jsdelivr.net/npm/three@0.185.1/examples/jsm/loaders/GLTFLoader.js';

export const W26_JOHN_TECHNICAL_FITS=Object.freeze({
  cowboyHat:Object.freeze({
    id:'W25-A01',model:'/models/w25/w25-dark-brown-ranch-cowboy-hat.glb',parent:'head',
    position:[0,.135,-.005],rotation:[0,0,0],scale:.38,label:'Dark Brown Ranch Cowboy Hat'
  }),
  aviators:Object.freeze({
    id:'W25-A02',model:'/models/w25/w25-gold-brown-aviators.glb',parent:'head',
    position:[0,.035,-.202],rotation:[0,0,0],scale:.31,label:'Gold / Brown Aviators'
  })
});

const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const loader=new GLTFLoader();

function disposeObject(root){
  root?.traverse?.(o=>{
    o.geometry?.dispose?.();
    const mats=Array.isArray(o.material)?o.material:[o.material];
    for(const m of mats){if(!m)continue;for(const k of ['map','normalMap','roughnessMap','metalnessMap','emissiveMap','alphaMap'])m[k]?.dispose?.();m.dispose?.()}
  });
}

export async function loadJohnWithW26Wearables({hat=true,aviators=true}={}){
  const johnGltf=await loader.loadAsync('/models/characters/john-production-skinned.glb');
  const john=johnGltf.scene||johnGltf.scenes?.[0];
  if(!john)throw new Error('John GLB contains no scene.');
  const head=john.getObjectByName('head');
  if(!head)throw new Error('John rig is missing the required head bone.');
  const attached={};
  for(const [key,enabled] of [['cowboyHat',hat],['aviators',aviators]]){
    if(!enabled)continue;
    const fit=W26_JOHN_TECHNICAL_FITS[key],gltf=await loader.loadAsync(fit.model),obj=gltf.scene||gltf.scenes?.[0];
    if(!obj)throw new Error(`${fit.label} GLB contains no scene.`);
    obj.name=`W26_${key}`;obj.position.fromArray(fit.position);obj.rotation.set(...fit.rotation);obj.scale.setScalar(fit.scale);
    obj.traverse(o=>{if(o.isMesh){o.castShadow=true;o.receiveShadow=true}});
    head.add(obj);attached[key]=obj;
  }
  john.traverse(o=>{if(o.isMesh){o.castShadow=true;o.receiveShadow=true}});
  return {john,head,animations:johnGltf.animations||[],attached};
}

export function mountJohnWearableFitProof(container,{initial='both'}={}){
  if(!container)throw new Error('W26 fit proof container required.');
  container.replaceChildren();
  const shell=document.createElement('div');shell.className='w26-fit-shell';
  const status=document.createElement('div');status.className='w26-fit-status';status.textContent='Loading John rig + real W25 wearable GLBs…';
  shell.append(status);container.append(shell);
  let renderer;
  try{renderer=new THREE.WebGLRenderer({antialias:true,alpha:false,powerPreference:'high-performance'});}catch(err){status.textContent='WebGL unavailable on this browser.';return {dispose(){},setMode(){},status:'webgl-unavailable'}}
  renderer.setPixelRatio(Math.min(globalThis.devicePixelRatio||1,1.7));renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.05;renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.domElement.className='w26-fit-canvas';shell.prepend(renderer.domElement);
  const scene=new THREE.Scene();scene.background=new THREE.Color(0x17120e);scene.fog=new THREE.Fog(0x17120e,7,13);
  const camera=new THREE.PerspectiveCamera(30,1,.02,30),target=new THREE.Vector3(0,1.02,0);let yaw=.18,pitch=.08,dist=3.25,down=null,disposed=false,raf=0,ro=null,mixer=null,john=null,attachments=null;
  scene.add(new THREE.HemisphereLight(0xfff0d7,0x261d18,2.2));
  const key=new THREE.DirectionalLight(0xffe1bd,4.0);key.position.set(3.5,5,-4);key.castShadow=true;key.shadow.mapSize.set(1024,1024);scene.add(key);
  const rim=new THREE.DirectionalLight(0xa9c8ff,1.7);rim.position.set(-3,3.5,2);scene.add(rim);
  const floor=new THREE.Mesh(new THREE.CircleGeometry(1.65,64),new THREE.MeshStandardMaterial({color:0x34271d,roughness:.97}));floor.rotation.x=-Math.PI/2;floor.receiveShadow=true;scene.add(floor);
  const setCamera=()=>{pitch=clamp(pitch,-.04,.65);dist=clamp(dist,2.3,5.2);const cp=Math.cos(pitch);camera.position.set(Math.sin(yaw)*cp*dist,target.y+Math.sin(pitch)*dist,Math.cos(yaw)*cp*dist*-1);camera.lookAt(target)};
  const resize=()=>{if(disposed)return;const w=Math.max(240,shell.clientWidth),h=Math.max(420,shell.clientHeight);renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix()};
  const setMode=mode=>{if(!attachments)return;attachments.cowboyHat&&(attachments.cowboyHat.visible=mode==='hat'||mode==='both');attachments.aviators&&(attachments.aviators.visible=mode==='aviators'||mode==='both');status.textContent=`TECHNICAL RIG PROOF · ${mode.toUpperCase()} · attached to John head bone · legacy John visual mesh is NOT W26 art-approved`;status.dataset.mode=mode};
  Promise.all([loadJohnWithW26Wearables({hat:true,aviators:true})]).then(([loaded])=>{
    if(disposed)return;john=loaded.john;attachments=loaded.attached;scene.add(john);const idle=loaded.animations.find(a=>/idle/i.test(a.name))||loaded.animations[0];if(idle){mixer=new THREE.AnimationMixer(john);const action=mixer.clipAction(idle);action.play()};setMode(initial);status.dataset.ready='true';
  }).catch(err=>{console.error(err);status.textContent=`Fit proof failed: ${err.message||err}`});
  renderer.domElement.addEventListener('pointerdown',e=>{down={x:e.clientX,y:e.clientY,yaw,pitch};renderer.domElement.setPointerCapture?.(e.pointerId)});
  renderer.domElement.addEventListener('pointermove',e=>{if(!down)return;const dx=e.clientX-down.x,dy=e.clientY-down.y;yaw=down.yaw-dx*.008;pitch=down.pitch+dy*.006;setCamera()});
  renderer.domElement.addEventListener('pointerup',()=>down=null);
  renderer.domElement.addEventListener('wheel',e=>{e.preventDefault();dist*=e.deltaY>0?1.08:.92;setCamera()},{passive:false});
  renderer.domElement.addEventListener('dblclick',()=>{yaw=.18;pitch=.08;dist=3.25;setCamera()});
  ro=new ResizeObserver(resize);ro.observe(shell);resize();setCamera();let last=performance.now();
  const frame=now=>{if(disposed)return;const dt=Math.min(.05,(now-last)/1000);last=now;mixer?.update(dt);renderer.render(scene,camera);raf=requestAnimationFrame(frame)};raf=requestAnimationFrame(frame);
  return {setMode,dispose(){disposed=true;cancelAnimationFrame(raf);ro?.disconnect();mixer?.stopAllAction?.();disposeObject(scene);renderer.dispose();container.replaceChildren()},status:'loading'};
}
