import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.185.1/build/three.module.min.js';
import { create3DArtKit } from './shared-3d-art-kit.mjs';
import { W25_HOME_PRODUCTION } from './w25-production-manifest.mjs';
import { createW39CabinFurnitureMesh, w39PhysicalFootprintFt } from './w39-cabin-furniture.mjs';

let w25LoaderPromise=null;
const w25Loader=()=>w25LoaderPromise||(w25LoaderPromise=import('https://cdn.jsdelivr.net/npm/three@0.185.1/examples/jsm/loaders/GLTFLoader.js').then(({GLTFLoader})=>new GLTFLoader()));

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


function windowBackdrop(THREE){
  let mat;
  if(typeof document!=='undefined'){
    const c=document.createElement('canvas');c.width=512;c.height=320;const x=c.getContext('2d');
    const sky=x.createLinearGradient(0,0,0,c.height);sky.addColorStop(0,'#9dc9dc');sky.addColorStop(.55,'#d9d5ba');sky.addColorStop(1,'#5e7651');x.fillStyle=sky;x.fillRect(0,0,c.width,c.height);
    x.fillStyle='#314735';for(let i=0;i<18;i++){const bx=(i*37+23)%520,h=55+(i%5)*18;x.beginPath();x.moveTo(bx,250);x.lineTo(bx+18,250-h);x.lineTo(bx+36,250);x.fill()}
    x.fillStyle='#20382b';x.fillRect(0,248,c.width,72);
    const tex=new THREE.CanvasTexture(c);tex.colorSpace=THREE.SRGBColorSpace;mat=new THREE.MeshBasicMaterial({map:tex,toneMapped:false});
  }else mat=new THREE.MeshBasicMaterial({color:0x89a8a3});
  const m=new THREE.Mesh(new THREE.PlaneGeometry(1.5,1.35),mat);m.position.set(1.02,1.38,-ROOM_D/2-.16);m.renderOrder=-2;return m;
}

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
  group.add(windowBackdrop(THREE));
  const glass=new THREE.MeshPhysicalMaterial({color:0xaed5dd,transparent:true,opacity:.20,roughness:.08,metalness:0,transmission:.45,depthWrite:false});
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

function rotatedPhysicalFootprint(item,rotation=0){
  const spec=W25_HOME_PRODUCTION[item?.['Item ID']];
  const f=spec?.physical?{w:spec.physical.w/FT,d:spec.physical.d/FT,h:spec.physical.h/FT}:(w39PhysicalFootprintFt(item)||{w:Number(item?.['Footprint W']||1),d:Number(item?.['Footprint D']||1),h:2.5});
  const r=((Math.round(Number(rotation||0)/90)*90)%360+360)%360;
  return (r===90||r===270)?{...f,w:f.d,d:f.w}:{...f};
}
function placementWorld(q,item){
  const surface=q.surface||'floor',f=rotatedPhysicalFootprint(item,q.rotation);
  const anchorX=clamp(Number(q.x)||0,0,14),anchorZ=clamp(Number(q.z)||0,0,16);
  const centerX=clamp(anchorX+f.w/2,0,14);
  const x=(centerX/14-.5)*ROOM_W;
  if(surface==='wall')return {x,y:.40+clamp(anchorZ/16,0,1)*(ROOM_H-.85),z:-ROOM_D/2+.075};
  const centerZ=clamp(anchorZ+f.d/2,0,16);
  return {x,y:0,z:ROOM_D/2-centerZ/16*ROOM_D};
}
function worldPlacement(v,surface='floor',item=null,rotation=0){
  const f=rotatedPhysicalFootprint(item,rotation),centerX=clamp((v.x/ROOM_W+.5)*14,0,14),x=clamp(centerX-f.w/2,0,14);
  if(surface==='wall')return {x,z:clamp((v.y-.40)/(ROOM_H-.85)*16,0,16)};
  const centerZ=clamp((ROOM_D/2-v.z)/ROOM_D*16,0,16);return {x,z:clamp(centerZ-f.d/2,0,16)};
}

function enhanceW39ProductionMaterials(model){
  const tuned=new Map();model.traverse(o=>{if(!o.isMesh||!o.material)return;const mats=Array.isArray(o.material)?o.material:[o.material],next=mats.map(src=>{if(tuned.has(src))return tuned.get(src);const m=src.clone(),name=String(m.name||'').toLowerCase();m.envMapIntensity=.7;
    if(/walnut|wood/.test(name)){m.roughness=.74;m.metalness=.02}
    else if(/leather/.test(name)){m.roughness=.58;m.metalness=.03}
    else if(/linen|textile|wool|fabric/.test(name)){m.roughness=.92;m.metalness=0}
    else if(/brass|bronze|steel|metal/.test(name)){m.roughness=.38;m.metalness=.72}
    if(/bulb/.test(name)&&m.color){m.emissive=m.color.clone();m.emissiveIntensity=1.35;m.roughness=.22}
    m.needsUpdate=true;tuned.set(src,m);return m});o.material=Array.isArray(o.material)?next:next[0]});return model;
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

export function mountCabinRoom3D(container,{room,catalogById,isOwner=false,selectedId=null,onSelect=()=>{},onMove=()=>{},wallItem=null,floorItem=null,benchmarkMode=false}={}){
  if(!container)throw new Error('Cabin 3D mount element is required');
  let renderer;
  try{renderer=new THREE.WebGLRenderer({antialias:true,alpha:false,powerPreference:'high-performance'});}catch(err){container.innerHTML='<div class="cabin3d-fallback">3D room renderer could not start on this device. Use a WebGL-capable browser.</div>';return {dispose(){}}}
  renderer.setPixelRatio(Math.min(devicePixelRatio||1,2));renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.08;renderer.domElement.className='cabin3d-canvas';renderer.domElement.setAttribute('aria-label','Interactive true 3D cabin room');container.replaceChildren(renderer.domElement);
  const scene=new THREE.Scene();scene.background=new THREE.Color(0x17100b);scene.fog=new THREE.Fog(0x17100b,18,34);
  const art=create3DArtKit(THREE),camera=new THREE.PerspectiveCamera(benchmarkMode?46:43,1,.05,80);let yaw=benchmarkMode ? .68 : .72,pitch=benchmarkMode ? .42 : .47,radius=benchmarkMode ? 8.25 : 9.4;const target=new THREE.Vector3(0,benchmarkMode ? 1.06 : 1.18,benchmarkMode ? .18 : -.25),raycaster=new THREE.Raycaster(),pointer=new THREE.Vector2(),placementRoots=[],pickables=[],floorTargets=[],wallTargets=[];
  buildShell(scene,art,wallItem,floorItem);
  // Physical placement targets. They are transparent but raycastable.
  const floorTarget=new THREE.Mesh(new THREE.PlaneGeometry(ROOM_W,ROOM_D),new THREE.MeshBasicMaterial({transparent:true,opacity:0,depthWrite:false,side:THREE.DoubleSide}));floorTarget.rotation.x=-Math.PI/2;floorTarget.position.y=.006;floorTarget.userData.surface='floor';scene.add(floorTarget);floorTargets.push(floorTarget);
  const wallTarget=new THREE.Mesh(new THREE.PlaneGeometry(ROOM_W,ROOM_H),new THREE.MeshBasicMaterial({transparent:true,opacity:0,depthWrite:false,side:THREE.DoubleSide}));wallTarget.position.set(0,ROOM_H/2,-ROOM_D/2+.12);wallTarget.userData.surface='wall';scene.add(wallTarget);wallTargets.push(wallTarget);
  const hemi=new THREE.HemisphereLight(0xfff1d3,0x342516,1.4);scene.add(hemi);
  const sun=new THREE.DirectionalLight(0xe7f4ff,2.5);sun.position.set(5.5,6.8,-1.5);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);sun.shadow.camera.left=-6;sun.shadow.camera.right=6;sun.shadow.camera.top=6;sun.shadow.camera.bottom=-6;scene.add(sun);
  const warm=new THREE.PointLight(0xffbd6c,42,8,2);warm.position.set(0,ROOM_H-1.15,.2);warm.castShadow=true;scene.add(warm);
  const windowLight=new THREE.RectAreaLight(0xbfe7ff,5.5,1.3,1.2);windowLight.position.set(1.02,1.45,-ROOM_D/2+.16);windowLight.lookAt(1.02,1.1,0);scene.add(windowLight);

  const w25LampLights=new Map(),w39FallbackLights=new Map();
  const registerPickables=(root,q,surface)=>root.traverse(o=>{if(o.isMesh){o.userData.placementId=q.id;o.userData.surface=surface;pickables.push(o)}});
  const configureRoot=(root,q,item,surface,pos)=>{
    root.name=`cabin-item-${q.itemId}`;
    root.userData.placementId=q.id;root.userData.surface=surface;root.userData.itemId=q.itemId;root.userData.placementRef=q;root.userData.w25Spec=W25_HOME_PRODUCTION[q.itemId]||null;root.userData.catalogItem=item;
    root.position.set(pos.x,pos.y,pos.z);root.rotation.y=THREE.MathUtils.degToRad(Number(q.rotation)||0);
    const spec=W25_HOME_PRODUCTION[q.itemId];if(spec?.surfaceTopY)root.userData.surfaceTopY=spec.surfaceTopY;
    if(surface==='wall'){
      root.rotation.x=0;root.position.z=-ROOM_D/2+.18;
      const box=new THREE.Box3().setFromObject(root),h=box.max.y-box.min.y;root.position.y=Math.max(.18,pos.y-h*.1);
    }
    return root;
  };
  const loadProductionModel=(root,q,item,surface)=>{
    const spec=W25_HOME_PRODUCTION[q.itemId];if(!spec?.model)return;
    w25Loader().then(loader=>loader.loadAsync(spec.model)).then(gltf=>{
      if(!root.parent)return;
      const old=[...root.children];for(const child of old){root.remove(child);disposeTree(child)}
      const model=gltf.scene||gltf.scenes?.[0];if(!model)throw new Error(`No scene in ${spec.model}`);
      model.name=`w25-model-${spec.sku}`;enhanceW39ProductionMaterials(model);model.traverse(o=>{if(o.isMesh){o.castShadow=true;o.receiveShadow=true;o.userData.placementId=q.id;o.userData.surface=surface;pickables.push(o)}});root.add(model);
      root.userData.productionModelLoaded=true;root.userData.w39VisualTier='production-qa-glb';root.userData.interaction=spec.interaction||root.userData.interaction;
      if(spec.surfaceTopY)root.userData.surfaceTopY=spec.surfaceTopY;
      if(spec.interaction==='toggle_light'){
        const light=new THREE.PointLight(0xffcf8a,11,3.6,2);light.position.set(0,.72,0);light.castShadow=true;root.add(light);
        const initialOn=q.state?.lampOn!==false;light.visible=initialOn;w25LampLights.set(q.id,{light,on:initialOn});root.userData.lampOn=initialOn;
      }
      if(spec.interaction==='sit')root.userData.seatTarget={x:0,y:.73,z:-.02,rotationY:Math.PI};
      if(spec.interaction==='sleep')root.userData.sleepTarget={x:0,y:.70,z:0,rotationY:Math.PI/2};
      if(spec.interaction==='surface')root.userData.surfaceTarget={y:spec.surfaceTopY||spec.physical?.h||.75,w:spec.physical?.w||1,d:spec.physical?.d||.6};
      showSelection(selectedId);
    }).catch(err=>{
      root.userData.productionModelError=String(err?.message||err);root.userData.productionModelLoaded=false;root.userData.w39VisualTier=root.userData.w39FallbackLoaded?'w39-design-specific-fallback':'legacy-generic-fallback';
      console.warn('W25 production model fallback in cabin',q.itemId,err)
    });
  };
  for(const q of room?.placements||[]){
    const item=catalogById?.[q.itemId];if(!item)continue;
    const surface=q.surface||'floor',spec=W25_HOME_PRODUCTION[q.itemId];let pos=placementWorld(q,item);
    if(surface==='tabletop'&&q.parentId){
      const parent=placementRoots.find(x=>x.userData.placementId===q.parentId);
      if(parent)pos={x:parent.position.x,y:parent.position.y+(parent.userData.surfaceTopY||.75),z:parent.position.z};
    }
    let root;
    if(spec?.model){
      root=new THREE.Group();const fallback=createW39CabinFurnitureMesh(THREE,art,item)||art.createCatalogHomeMesh(item);fallback.name='w39-production-loading-fallback';fallback.traverse(o=>{if(o.material){o.material=o.material.clone();o.material.transparent=true;o.material.opacity=.38}});root.add(fallback);root.userData.w39FallbackLoaded=Boolean(fallback.userData?.w39DesignSpecificFallback);root.userData.w39VisualTier=root.userData.w39FallbackLoaded?'w39-design-specific-fallback':'legacy-generic-fallback';
      configureRoot(root,q,item,surface,pos);registerPickables(root,q,surface);scene.add(root);placementRoots.push(root);loadProductionModel(root,q,item,surface);
    }else{
      root=createW39CabinFurnitureMesh(THREE,art,item);if(root){root.userData.w39VisualTier='w39-design-specific-fallback';configureRoot(root,q,item,surface,pos)}else{root=art.createCatalogHomeMesh(item);const scale=categoryScale(item);root.scale.setScalar(scale);root.userData.w39VisualTier='legacy-generic-fallback';configureRoot(root,q,item,surface,pos)}
      registerPickables(root,q,surface);scene.add(root);placementRoots.push(root);
      if(root.userData.interaction==='toggle_light'){
        const light=new THREE.PointLight(0xffcc86,7.5,3.2,2);light.position.set(0,Math.max(.65,root.userData.physicalFootprintFt?.h*FT*.72||1),0);light.castShadow=false;root.add(light);const initialOn=q.state?.lampOn!==false;light.visible=initialOn;w39FallbackLights.set(q.id,{light,on:initialOn});
      }
    }
  }
  let helper=null;
  function showSelection(id){if(helper){scene.remove(helper);helper.geometry?.dispose?.();helper.material?.dispose?.();helper=null}const g=placementRoots.find(x=>x.userData.placementId===id);if(g){helper=new THREE.BoxHelper(g,0xffd46a);helper.material.depthTest=false;helper.renderOrder=50;scene.add(helper)}}
  showSelection(selectedId);
  function setCamera(){pitch=clamp(pitch,.16,1.02);radius=clamp(radius,5.4,15);const cp=Math.cos(pitch);camera.position.set(target.x+Math.sin(yaw)*cp*radius,target.y+Math.sin(pitch)*radius,target.z+Math.cos(yaw)*cp*radius);camera.lookAt(target)}setCamera();
  function resetCamera(){yaw=benchmarkMode ? .68 : .72;pitch=benchmarkMode ? .42 : .47;radius=benchmarkMode ? 8.25 : 9.4;setCamera()}
  function resize(){const w=Math.max(10,container.clientWidth),h=Math.max(10,container.clientHeight);renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix()}resize();const ro=new ResizeObserver(resize);ro.observe(container);
  function ndc(e){const r=renderer.domElement.getBoundingClientRect();pointer.x=((e.clientX-r.left)/r.width)*2-1;pointer.y=-((e.clientY-r.top)/r.height)*2+1;raycaster.setFromCamera(pointer,camera)}
  let down=null,dragged=false,pinchStart=null;const activePointers=new Map();
  const pointerDistance=()=>{const pts=[...activePointers.values()];return pts.length>=2?Math.hypot(pts[0].x-pts[1].x,pts[0].y-pts[1].y):0};
  renderer.domElement.addEventListener('pointerdown',e=>{activePointers.set(e.pointerId,{x:e.clientX,y:e.clientY});if(activePointers.size===2){pinchStart={distance:pointerDistance(),radius};down=null;dragged=true}else if(activePointers.size===1){down={x:e.clientX,y:e.clientY,yaw,pitch};dragged=false}renderer.domElement.setPointerCapture?.(e.pointerId)});
  renderer.domElement.addEventListener('pointermove',e=>{if(activePointers.has(e.pointerId))activePointers.set(e.pointerId,{x:e.clientX,y:e.clientY});if(activePointers.size>=2&&pinchStart){const dist=Math.max(10,pointerDistance());radius=clamp(pinchStart.radius*(pinchStart.distance/dist),5.4,15);setCamera();dragged=true;return}if(!down)return;const dx=e.clientX-down.x,dy=e.clientY-down.y;if(Math.hypot(dx,dy)>7)dragged=true;if(dragged){yaw=down.yaw-dx*.0055;pitch=down.pitch+dy*.0045;setCamera()}});
  renderer.domElement.addEventListener('pointerup',e=>{
    activePointers.delete(e.pointerId);if(activePointers.size<2)pinchStart=null;if(!down){if(activePointers.size===0)dragged=false;return}const wasDragged=dragged;down=null;if(wasDragged)return;
    ndc(e);const hits=raycaster.intersectObjects(pickables,true);if(hits.length){const id=hits[0].object.userData.placementId;if(id){showSelection(id);onSelect(id);return}}
    if(!isOwner||!selectedId)return;const root=placementRoots.find(x=>x.userData.placementId===selectedId),surface=root?.userData.surface||'floor';if(surface==='tabletop')return;const targets=surface==='wall'?wallTargets:floorTargets,hit=raycaster.intersectObjects(targets,false)[0];if(hit){const item=root?.userData.catalogItem,rotation=root?.userData.placementRef?.rotation||0,p=worldPlacement(hit.point,surface,item,rotation);onMove(selectedId,p,surface)}
  });
  renderer.domElement.addEventListener('pointercancel',e=>{activePointers.delete(e.pointerId);down=null;pinchStart=null;dragged=false});
  renderer.domElement.addEventListener('wheel',e=>{e.preventDefault();radius=clamp(radius*(e.deltaY>0?1.08:.92),5.4,15);setCamera()},{passive:false});
  renderer.domElement.addEventListener('dblclick',resetCamera);
  let raf=0,last=performance.now();function frame(now){const dt=Math.min(.05,(now-last)/1000);last=now;art.animateAmbience?.(scene,now/1000,{dt});renderer.render(scene,camera);raf=requestAnimationFrame(frame)}raf=requestAnimationFrame(frame);
  return {
    setSelected(id){selectedId=id;showSelection(id)},resetCamera,
    interact(id){
      const root=placementRoots.find(x=>x.userData.placementId===id),spec=root?.userData?.w25Spec,kind=spec?.interaction||root?.userData?.interaction||'none';if(!root)return {ok:false,type:'none',message:'Furniture is not loaded.'};
      if(kind==='toggle_light'){
        const rec=w25LampLights.get(id)||w39FallbackLights.get(id);if(!rec)return {ok:false,type:'toggle_light',message:'The lamp light is still loading.'};rec.on=!rec.on;rec.light.visible=rec.on;root.userData.lampOn=rec.on;const q=root.userData.placementRef;if(q)q.state={...(q.state||{}),lampOn:rec.on};root.traverse(o=>{const m=o.material;if(m?.emissive&&/bulb/i.test(o.name||''))m.emissiveIntensity=rec.on?1.5:.03});return {ok:true,type:'toggle_light',on:rec.on,message:`Lamp turned ${rec.on?'on':'off'}.`}
      }
      if(kind==='sit')return {ok:true,type:'sit',seatTarget:root.userData.seatTarget||{x:0,y:.72,z:0,rotationY:Math.PI},message:'Seat target is ready; final avatar sit animation remains a character-rig gate.'};
      if(kind==='sleep')return {ok:true,type:'sleep',sleepTarget:root.userData.sleepTarget||{x:0,y:.68,z:0,rotationY:Math.PI/2},message:'Bed sleep target and clearance hook are ready; final lie animation remains a character-rig gate.'};
      if(kind==='surface')return {ok:true,type:'surface',surfaceTarget:root.userData.surfaceTarget||null,message:'This furniture exposes a decor surface target.'};
      if(kind==='storage')return {ok:true,type:'storage',message:'Storage front/clearance hook is ready; drawer animation remains future production work.'};
      if(kind==='screen')return {ok:true,type:'screen',message:'Wall screen interaction hook is ready.'};
      return {ok:true,type:kind,message:'Furniture interaction hook is ready.'}
    },
    getQAState(){return placementRoots.map(root=>({id:root.userData.placementId,itemId:root.userData.itemId,tier:root.userData.w39VisualTier||'unknown',productionLoaded:!!root.userData.productionModelLoaded,productionError:root.userData.productionModelError||'',family:root.children.find(c=>c.userData?.w39Family)?.userData?.w39Family||root.userData.w39Family||''}))},
    dispose(){cancelAnimationFrame(raf);ro.disconnect();renderer.dispose();disposeTree(scene);container.replaceChildren()}
  };
}
