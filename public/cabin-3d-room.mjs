import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.185.1/build/three.module.min.js';
import { create3DArtKit } from './shared-3d-art-kit.mjs';

const FT=.3048, ROOM_W=14*FT, ROOM_D=16*FT, ROOM_H=9*FT;
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const hash=s=>{let h=2166136261;for(const c of String(s||'')){h^=c.charCodeAt(0);h=Math.imul(h,16777619)}return h>>>0};
const colorFrom=(item,base=.42)=>{const seed=Number(item?.['Art Seed']||hash(item?.['Item ID']||item?.['Item Name']||''));const c=new THREE.Color();c.setHSL(((seed%360)+12)%360/360,.24,base);return c.getHex()};

function disposeTree(root){root?.traverse?.(o=>{if(o.geometry?.dispose)o.geometry.dispose();const mats=Array.isArray(o.material)?o.material:[o.material];for(const m of mats){if(!m)continue;for(const k of ['map','normalMap','roughnessMap','metalnessMap','alphaMap','emissiveMap'])m[k]?.dispose?.();m.dispose?.()}})}

function finishMaterial(art,item,kind='wall'){
  if(!item)return art.material('wood',kind==='floor'?0x65462f:0x805d3f,{seed:kind==='floor'?702:701,roughness:.84});
  const name=`${item['Item Name']||''} ${item.Collection||''}`.toLowerCase(),col=colorFrom(item,kind==='floor'?.35:.49),seed=Number(item['Art Seed']||hash(name));
  if(name.includes('stone'))return art.material('stone',col,{seed,roughness:.92});
  if(name.includes('brick'))return art.material('stone',0x794d3e,{seed,roughness:.94});
  if(name.includes('plaid')||name.includes('tartan'))return art.material('plaid',col,{seed,roughness:.9});
  if(name.includes('metal'))return art.material('metal',col,{seed,roughness:.55});
  if(name.includes('paint')||name.includes('white')||name.includes('cream'))return art.material('paintedWood',col,{seed,roughness:.78});
  if(name.includes('wallpaper')||name.includes('floral')||name.includes('stripe'))return art.material('fabric',col,{seed,roughness:.9});
  return art.material('wood',col,{seed,roughness:.86});
}

function meshBox(THREE,w,h,d,mat,x=0,y=0,z=0){const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;return m}

function buildShell(scene,art,wallItem,floorItem){
  const group=new THREE.Group();group.name='true-3d-cabin-shell';scene.add(group);
  const floorMat=finishMaterial(art,floorItem,'floor'),wallMat=finishMaterial(art,wallItem,'wall'),trim=art.material('wood',0x4b2f20,{seed:710,roughness:.82}),frame=art.material('wood',0x9a754f,{seed:711,roughness:.78}),doorMat=art.material('paintedWood',0x4e321f,{seed:712,roughness:.82});
  group.add(meshBox(THREE,ROOM_W,.12,ROOM_D,floorMat,0,-.06,0));
  // Back wall is genuine geometry with a real window opening.
  const wc=1.02,ww=1.16,wb=.82,wh=1.02,wt=wb+wh,wl=wc-ww/2,wr=wc+ww/2,t=.10;
  const leftW=wl+ROOM_W/2,rightW=ROOM_W/2-wr;
  if(leftW>0)group.add(meshBox(THREE,leftW,ROOM_H,t,wallMat,-ROOM_W/2+leftW/2,ROOM_H/2,-ROOM_D/2));
  if(rightW>0)group.add(meshBox(THREE,rightW,ROOM_H,t,wallMat,wr+rightW/2,ROOM_H/2,-ROOM_D/2));
  group.add(meshBox(THREE,ww,wb,t,wallMat,wc,wb/2,-ROOM_D/2));
  group.add(meshBox(THREE,ww,ROOM_H-wt,t,wallMat,wc,wt+(ROOM_H-wt)/2,-ROOM_D/2));
  // Left wall has a genuine door opening.
  const dc=.72,dw=.92,dh=2.05,df=dc-dw/2,db=dc+dw/2;
  const frontLen=ROOM_D/2-df,backLen=db+ROOM_D/2;
  if(frontLen>0)group.add(meshBox(THREE,t,ROOM_H,frontLen,wallMat,-ROOM_W/2,ROOM_H/2,df+frontLen/2));
  if(backLen>0)group.add(meshBox(THREE,t,ROOM_H,backLen,wallMat,-ROOM_W/2,ROOM_H/2,-ROOM_D/2+backLen/2));
  group.add(meshBox(THREE,t,ROOM_H-dh,dw,wallMat,-ROOM_W/2,dh+(ROOM_H-dh)/2,dc));
  // Right wall stays solid to make the dollhouse read as an actual room rather than a stage flat.
  group.add(meshBox(THREE,t,ROOM_H,ROOM_D,wallMat,ROOM_W/2,ROOM_H/2,0));
  // Window frame and glass.
  const glass=new THREE.MeshPhysicalMaterial({color:0xaed5dd,transparent:true,opacity:.26,roughness:.08,metalness:0,transmission:.35,depthWrite:false});
  const glassMesh=meshBox(THREE,ww-.12,wh-.12,.025,glass,wc,wb+wh/2,-ROOM_D/2-.015);glassMesh.castShadow=false;group.add(glassMesh);
  group.add(meshBox(THREE,ww+.12,.07,.13,frame,wc,wb-.035,-ROOM_D/2-.06),meshBox(THREE,ww+.12,.07,.13,frame,wc,wt+.035,-ROOM_D/2-.06),meshBox(THREE,.07,wh+.14,.13,frame,wl-.035,wb+wh/2,-ROOM_D/2-.06),meshBox(THREE,.07,wh+.14,.13,frame,wr+.035,wb+wh/2,-ROOM_D/2-.06),meshBox(THREE,.055,wh,.12,frame,wc,wb+wh/2,-ROOM_D/2-.07),meshBox(THREE,ww,.055,.12,frame,wc,wb+wh/2,-ROOM_D/2-.07));
  // Door slab sits slightly open so it reads as a dimensional object.
  const hinge=new THREE.Group();hinge.position.set(-ROOM_W/2+.055,0,df);hinge.rotation.y=-.35;const slab=meshBox(THREE,.075,dh,dw,doorMat,0,dh/2,dw/2);hinge.add(slab);const knob=art.sphere(.045,art.material('metal',0xc5a45d),[-.06,1.02,dw*.78]);hinge.add(knob);group.add(hinge);
  // Baseboards, ceiling beams and hanging lamp.
  group.add(meshBox(THREE,ROOM_W,.09,.08,trim,0,.07,-ROOM_D/2+.05),meshBox(THREE,.08,.09,ROOM_D,trim,-ROOM_W/2+.05,.07,0),meshBox(THREE,.08,.09,ROOM_D,trim,ROOM_W/2-.05,.07,0));
  for(const z of [-ROOM_D*.3,0,ROOM_D*.3])group.add(meshBox(THREE,ROOM_W+.12,.13,.13,trim,0,ROOM_H-.12,z));
  const lamp=art.createPropMesh('Cabin Lamp',{w:.58,d:.58,h:1.35,color:0xd0a85a});lamp.scale.setScalar(.72);lamp.position.set(0,ROOM_H-1.0,.15);group.add(lamp);
  return {group,floorMat,wallMat};
}

function placementWorld(q){
  const x=(clamp(Number(q.x)||0,0,14)/14-.5)*ROOM_W;
  if((q.surface||'floor')==='wall')return {x,y:.48+clamp(Number(q.z)||0,0,16)/16*(ROOM_H-1.02),z:-ROOM_D/2+.075};
  return {x,y:0,z:ROOM_D/2-clamp(Number(q.z)||0,0,16)/16*ROOM_D};
}
function worldPlacement(v,surface='floor'){
  const x=clamp((v.x/ROOM_W+.5)*14,0,14);
  if(surface==='wall')return {x,z:clamp((v.y-.48)/(ROOM_H-1.02)*16,0,16)};
  return {x,z:clamp((ROOM_D/2-v.z)/ROOM_D*16,0,16)};
}
function categoryScale(item){
  const c=String(item?.Category||'');
  if(c==='Clutter & Detail Props')return .72;
  if(c==='Lighting')return .78;
  if(c==='Wall Decor & Pictures')return .88;
  if(c==='Windows & Doors')return .9;
  if(c==='Rugs & Soft Decor')return 1.12;
  if(c==='Kitchen & Bath Utility Decor')return .75;
  return 1;
}

export function mountCabinRoom3D(container,{room,catalogById,isOwner=false,selectedId=null,onSelect=()=>{},onMove=()=>{},wallItem=null,floorItem=null}={}){
  if(!container)throw new Error('Cabin 3D mount element is required');
  let renderer;
  try{renderer=new THREE.WebGLRenderer({antialias:true,alpha:false,powerPreference:'high-performance'});}catch(err){container.innerHTML='<div class="cabin3d-fallback">3D room renderer could not start on this device. Use a WebGL-capable browser.</div>';return {dispose(){}}}
  renderer.setPixelRatio(Math.min(devicePixelRatio||1,2));renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.08;renderer.domElement.className='cabin3d-canvas';renderer.domElement.setAttribute('aria-label','Interactive true 3D cabin room');container.replaceChildren(renderer.domElement);
  const scene=new THREE.Scene();scene.background=new THREE.Color(0x17100b);scene.fog=new THREE.Fog(0x17100b,18,34);
  const art=create3DArtKit(THREE),camera=new THREE.PerspectiveCamera(43,1,.05,80);let yaw=.72,pitch=.47,radius=9.4;const target=new THREE.Vector3(0,1.18,-.25),raycaster=new THREE.Raycaster(),pointer=new THREE.Vector2(),placementRoots=[],pickables=[],floorTargets=[],wallTargets=[];
  buildShell(scene,art,wallItem,floorItem);
  // Physical placement targets. They are transparent but raycastable.
  const floorTarget=new THREE.Mesh(new THREE.PlaneGeometry(ROOM_W,ROOM_D),new THREE.MeshBasicMaterial({transparent:true,opacity:0,depthWrite:false,side:THREE.DoubleSide}));floorTarget.rotation.x=-Math.PI/2;floorTarget.position.y=.006;floorTarget.userData.surface='floor';scene.add(floorTarget);floorTargets.push(floorTarget);
  const wallTarget=new THREE.Mesh(new THREE.PlaneGeometry(ROOM_W,ROOM_H),new THREE.MeshBasicMaterial({transparent:true,opacity:0,depthWrite:false,side:THREE.DoubleSide}));wallTarget.position.set(0,ROOM_H/2,-ROOM_D/2+.12);wallTarget.userData.surface='wall';scene.add(wallTarget);wallTargets.push(wallTarget);
  const hemi=new THREE.HemisphereLight(0xfff1d3,0x342516,1.4);scene.add(hemi);
  const sun=new THREE.DirectionalLight(0xe7f4ff,2.5);sun.position.set(5.5,6.8,-1.5);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);sun.shadow.camera.left=-6;sun.shadow.camera.right=6;sun.shadow.camera.top=6;sun.shadow.camera.bottom=-6;scene.add(sun);
  const warm=new THREE.PointLight(0xffbd6c,42,8,2);warm.position.set(0,ROOM_H-1.15,.2);warm.castShadow=true;scene.add(warm);
  const windowLight=new THREE.RectAreaLight(0xbfe7ff,5.5,1.3,1.2);windowLight.position.set(1.02,1.45,-ROOM_D/2+.16);windowLight.lookAt(1.02,1.1,0);scene.add(windowLight);

  for(const q of room?.placements||[]){const item=catalogById?.[q.itemId];if(!item)continue;const g=art.createCatalogHomeMesh(item),pos=placementWorld(q),surface=q.surface||'floor';g.name=`cabin-item-${q.itemId}`;g.userData.placementId=q.id;g.userData.surface=surface;g.userData.itemId=q.itemId;const scale=categoryScale(item);g.scale.setScalar(scale);g.position.set(pos.x,pos.y,pos.z);g.rotation.y=THREE.MathUtils.degToRad(Number(q.rotation)||0);if(surface==='wall'){g.rotation.x=0;g.position.z=-ROOM_D/2+.18;const box=new THREE.Box3().setFromObject(g),h=box.max.y-box.min.y;g.position.y=Math.max(.18,pos.y-h*.1)}g.traverse(o=>{if(o.isMesh){o.userData.placementId=q.id;o.userData.surface=surface;pickables.push(o)}});scene.add(g);placementRoots.push(g)}
  let helper=null;
  function showSelection(id){if(helper){scene.remove(helper);helper.geometry?.dispose?.();helper.material?.dispose?.();helper=null}const g=placementRoots.find(x=>x.userData.placementId===id);if(g){helper=new THREE.BoxHelper(g,0xffd46a);helper.material.depthTest=false;helper.renderOrder=50;scene.add(helper)}}
  showSelection(selectedId);
  function setCamera(){pitch=clamp(pitch,.16,1.02);radius=clamp(radius,5.4,15);const cp=Math.cos(pitch);camera.position.set(target.x+Math.sin(yaw)*cp*radius,target.y+Math.sin(pitch)*radius,target.z+Math.cos(yaw)*cp*radius);camera.lookAt(target)}setCamera();
  function resize(){const w=Math.max(10,container.clientWidth),h=Math.max(10,container.clientHeight);renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix()}resize();const ro=new ResizeObserver(resize);ro.observe(container);
  function ndc(e){const r=renderer.domElement.getBoundingClientRect();pointer.x=((e.clientX-r.left)/r.width)*2-1;pointer.y=-((e.clientY-r.top)/r.height)*2+1;raycaster.setFromCamera(pointer,camera)}
  let down=null,dragged=false;
  renderer.domElement.addEventListener('pointerdown',e=>{down={x:e.clientX,y:e.clientY,yaw,pitch};dragged=false;renderer.domElement.setPointerCapture?.(e.pointerId)});
  renderer.domElement.addEventListener('pointermove',e=>{if(!down)return;const dx=e.clientX-down.x,dy=e.clientY-down.y;if(Math.hypot(dx,dy)>7)dragged=true;if(dragged){yaw=down.yaw-dx*.0055;pitch=down.pitch+dy*.0045;setCamera()}});
  renderer.domElement.addEventListener('pointerup',e=>{if(!down)return;const wasDragged=dragged;down=null;if(wasDragged)return;ndc(e);const hits=raycaster.intersectObjects(pickables,true);if(hits.length){const id=hits[0].object.userData.placementId;if(id){showSelection(id);onSelect(id);return}}if(!isOwner||!selectedId)return;const root=placementRoots.find(x=>x.userData.placementId===selectedId),surface=root?.userData.surface||'floor',targets=surface==='wall'?wallTargets:floorTargets,hit=raycaster.intersectObjects(targets,false)[0];if(hit){const p=worldPlacement(hit.point,surface);onMove(selectedId,p,surface)}});
  renderer.domElement.addEventListener('wheel',e=>{e.preventDefault();radius=clamp(radius*(e.deltaY>0?1.08:.92),5.4,15);setCamera()},{passive:false});
  renderer.domElement.addEventListener('dblclick',()=>{yaw=.72;pitch=.47;radius=9.4;setCamera()});
  let raf=0,last=performance.now();function frame(now){const dt=Math.min(.05,(now-last)/1000);last=now;art.animateAmbience?.(scene,now/1000,{dt});renderer.render(scene,camera);raf=requestAnimationFrame(frame)}raf=requestAnimationFrame(frame);
  return {setSelected(id){selectedId=id;showSelection(id)},dispose(){cancelAnimationFrame(raf);ro.disconnect();renderer.dispose();disposeTree(scene);container.replaceChildren()}};
}
