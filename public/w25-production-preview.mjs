import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.185.1/build/three.module.min.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.185.1/examples/jsm/loaders/GLTFLoader.js';

const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
function disposeTree(root){root?.traverse?.(o=>{o.geometry?.dispose?.();const mats=Array.isArray(o.material)?o.material:[o.material];for(const m of mats){if(!m)continue;for(const k of ['map','normalMap','roughnessMap','metalnessMap','emissiveMap','alphaMap'])m[k]?.dispose?.();m.dispose?.()}})}

export function mountW25ProductionPreview(container,{model=null,label='Production asset',kind='room',cameraDistance=null,filterEffect=null}={}){
  if(!container)throw new Error('W25 preview container is required');
  container.replaceChildren();
  const shell=document.createElement('div');shell.className='w25-live3d-shell';
  const status=document.createElement('div');status.className='w25-live3d-status';status.textContent=model?'Loading actual production model…':'Production effect awaiting approved 3D face fit master';
  shell.append(status);container.append(shell);
  if(!model){return {dispose(){container.replaceChildren()},status:'fit-master-pending'}}
  let renderer;try{renderer=new THREE.WebGLRenderer({antialias:true,alpha:true,powerPreference:'high-performance'});}catch(err){status.textContent='3D preview unavailable on this browser.';return {dispose(){},status:'webgl-unavailable'}}
  renderer.setPixelRatio(Math.min(devicePixelRatio||1,kind==='room'?1.65:1.8));renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.05;renderer.domElement.className='w25-live3d-canvas';renderer.domElement.setAttribute('aria-label',`${label} live rotatable 3D production preview`);shell.prepend(renderer.domElement);
  const scene=new THREE.Scene();scene.background=new THREE.Color(0x17120e);scene.fog=new THREE.Fog(0x17120e,8,16);
  const camera=new THREE.PerspectiveCamera(kind==='room'?38:32,1,.02,30);let yaw=.55,pitch=.28,dist=cameraDistance||3.0;const target=new THREE.Vector3(0,.55,0);
  const hemi=new THREE.HemisphereLight(0xfff2da,0x2b2119,2.0);scene.add(hemi);
  const key=new THREE.DirectionalLight(0xffead0,4.1);key.position.set(3.5,5,-3.5);key.castShadow=true;key.shadow.mapSize.set(1024,1024);scene.add(key);
  const rim=new THREE.DirectionalLight(0xb7d9ff,2.1);rim.position.set(-4,3,2.5);scene.add(rim);
  const warm=new THREE.PointLight(0xffbe78,5.5,8,2);warm.position.set(-1.8,2.2,-1.8);scene.add(warm);
  const floorMat=new THREE.MeshStandardMaterial({color:0x2b211a,roughness:.96,metalness:0});const floor=new THREE.Mesh(new THREE.CircleGeometry(2.5,64),floorMat);floor.rotation.x=-Math.PI/2;floor.position.y=-.02;floor.receiveShadow=true;scene.add(floor);
  const group=new THREE.Group();scene.add(group);
  let disposed=false,raf=0,ro=null,down=null,moved=false;
  const setCamera=()=>{pitch=clamp(pitch,-.02,.95);dist=clamp(dist,1.25,8);const cp=Math.cos(pitch);camera.position.set(target.x+Math.sin(yaw)*cp*dist,target.y+Math.sin(pitch)*dist,target.z+Math.cos(yaw)*cp*dist);camera.lookAt(target)};
  const resize=()=>{if(disposed)return;const w=Math.max(80,shell.clientWidth),h=Math.max(150,shell.clientHeight);renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix()};
  const loader=new GLTFLoader();
  loader.loadAsync(model).then(gltf=>{if(disposed)return;const root=gltf.scene||gltf.scenes?.[0];if(!root)throw new Error('GLB contains no scene');root.traverse(o=>{if(o.isMesh){o.castShadow=true;o.receiveShadow=true}});group.add(root);const box=new THREE.Box3().setFromObject(root),size=box.getSize(new THREE.Vector3()),center=box.getCenter(new THREE.Vector3());root.position.sub(center);root.position.y+=size.y*.5;const max=Math.max(size.x,size.y,size.z);const desired=kind==='room'?1.75:1.15;const sc=desired/Math.max(max,.001);root.scale.setScalar(sc);const box2=new THREE.Box3().setFromObject(root),size2=box2.getSize(new THREE.Vector3());root.position.y-=box2.min.y;target.y=Math.max(.18,size2.y*.46);dist=cameraDistance||Math.max(kind==='room'?2.7:2.0,size2.length()*1.25);setCamera();status.textContent='ACTUAL PRODUCTION MODEL · drag to rotate · wheel/pinch area to zoom';status.dataset.ready='true'}).catch(err=>{console.warn('W25 model preview failed',model,err);status.textContent='Production model could not load. This item remains blocked from release.'});
  renderer.domElement.addEventListener('pointerdown',e=>{down={x:e.clientX,y:e.clientY,yaw,pitch};moved=false;renderer.domElement.setPointerCapture?.(e.pointerId)});
  renderer.domElement.addEventListener('pointermove',e=>{if(!down)return;const dx=e.clientX-down.x,dy=e.clientY-down.y;if(Math.hypot(dx,dy)>4)moved=true;if(moved){yaw=down.yaw-dx*.008;pitch=down.pitch+dy*.006;setCamera()}});
  renderer.domElement.addEventListener('pointerup',()=>{down=null});
  renderer.domElement.addEventListener('wheel',e=>{e.preventDefault();dist*=e.deltaY>0?1.08:.92;setCamera()},{passive:false});
  renderer.domElement.addEventListener('dblclick',()=>{yaw=.55;pitch=.28;setCamera()});
  ro=new ResizeObserver(resize);ro.observe(shell);resize();setCamera();let last=performance.now();
  const frame=now=>{if(disposed)return;const dt=Math.min(.05,(now-last)/1000);last=now;if(!down&&status.dataset.ready==='true')group.rotation.y+=dt*.12;renderer.render(scene,camera);raf=requestAnimationFrame(frame)};raf=requestAnimationFrame(frame);
  return {dispose(){disposed=true;cancelAnimationFrame(raf);ro?.disconnect();disposeTree(scene);floorMat.dispose();renderer.dispose();container.replaceChildren()},status:'loading'};
}
