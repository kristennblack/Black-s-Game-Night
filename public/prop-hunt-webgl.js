/*
 * Black Family Game Night - Prop Hunt true WebGL presentation layer
 * v2.0.0-prop-true3d-alpha
 *
 * This module replaces the old painted-card world with a real Three.js scene:
 * textured floors/walls, volumetric props, full 3D family rigs, third-person
 * camera collision, 3D prop disguises/decoys, and a visible 3D prop-zapper.
 * Gameplay/rules remain owned by prop-hunt-3d.js.
 */
(function(){
  'use strict';

  const THREE_URL='https://cdn.jsdelivr.net/npm/three@0.185.1/build/three.module.min.js';
  let threePromise=null;
  const S=0.01;
  const TAU=Math.PI*2;
  const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
  const deg=v=>v*Math.PI/180;

  function loadThree(){
    if(!threePromise)threePromise=import(THREE_URL);
    return threePromise;
  }

  function colorForPerson(id){
    return ({
      john:['#7a2f29','#304b63','#3b2b20','#2d2119'],kristen:['#b9a487','#35516d','#6a4a34','#d9c3a2'],holly:['#778694','#56677c','#4d433a','#d6b98d'],
      elizabeth:['#c36f7f','#b89462','#ede0cf','#d8b78c'],vanessa:['#a9784f','#466079','#533824','#d7b17c'],logan:['#4d6170','#3c5068','#39342e','#845b39'],
      james:['#55748d','#46617c','#4b392c','#9f8d79'],dorothy:['#9a6c82','#735461','#574038','#9d8d80'],nana:['#a77982','#444a51','#47392f','#c7b49a'],
      papa:['#79674d','#3f5870','#4c3525','#75634d'],kelsi:['#bd8351','#9f6e46','#6e4a31','#9b6b43'],molly:['#c28a55','#9e6d44','#6f4b30','#9d6d46'],gunner:['#d3c2a4','#8a765f','#5b4938','#80684f']
    }[id]||['#777','#4d5963','#332d29','#6a5545']);
  }

  function createCanvasTexture(THREE,kind,base='#6d5742'){
    const c=document.createElement('canvas');c.width=c.height=256;const x=c.getContext('2d');
    x.fillStyle=base;x.fillRect(0,0,256,256);
    const noise=(alpha=.08,count=900)=>{for(let i=0;i<count;i++){const v=Math.random()*255|0;x.fillStyle=`rgba(${v},${v},${v},${Math.random()*alpha})`;x.fillRect(Math.random()*256,Math.random()*256,1+Math.random()*3,1+Math.random()*3);}};
    if(kind==='wood'){
      const grad=x.createLinearGradient(0,0,256,0);grad.addColorStop(0,'#4b2f1f');grad.addColorStop(.45,'#7f5434');grad.addColorStop(1,'#3e281c');x.fillStyle=grad;x.fillRect(0,0,256,256);
      for(let y=0;y<256;y+=32){x.fillStyle='rgba(20,8,2,.28)';x.fillRect(0,y,256,3);x.strokeStyle='rgba(255,210,140,.08)';x.beginPath();x.moveTo(0,y+5);x.bezierCurveTo(60,y+10,120,y,256,y+7);x.stroke();}
      noise(.07,650);
    }else if(kind==='stone'){
      x.fillStyle='#554d43';x.fillRect(0,0,256,256);for(let y=0;y<256;y+=38){const off=(y/38)%2?24:0;for(let xx=-40+off;xx<256;xx+=58){x.fillStyle=['#665c50','#4e4740','#75695b'][Math.floor(Math.random()*3)];x.roundRect(xx+2,y+2,54,32,7);x.fill();x.strokeStyle='rgba(20,15,12,.55)';x.stroke();}}noise(.11,500);
    }else if(kind==='grass'){
      x.fillStyle='#52613f';x.fillRect(0,0,256,256);for(let i=0;i<1200;i++){const g=70+Math.random()*80|0;x.strokeStyle=`rgba(${40+Math.random()*25|0},${g},${35+Math.random()*25|0},.35)`;const xx=Math.random()*256,yy=Math.random()*256;x.beginPath();x.moveTo(xx,yy);x.lineTo(xx+Math.random()*3-1.5,yy-3-Math.random()*7);x.stroke();}
    }else if(kind==='gravel'||kind==='earth'){
      x.fillStyle=kind==='gravel'?'#6e675d':'#66523e';x.fillRect(0,0,256,256);for(let i=0;i<700;i++){const r=1+Math.random()*3;const v=kind==='gravel'?90+Math.random()*80:70+Math.random()*60;x.fillStyle=`rgba(${v|0},${(v*.9)|0},${(v*.76)|0},.45)`;x.beginPath();x.arc(Math.random()*256,Math.random()*256,r,0,TAU);x.fill();}
    }else if(kind==='metal'){
      const g=x.createLinearGradient(0,0,256,0);g.addColorStop(0,'#4e5858');g.addColorStop(.35,'#71807d');g.addColorStop(.5,'#3c4748');g.addColorStop(.75,'#68716f');g.addColorStop(1,'#333d3e');x.fillStyle=g;x.fillRect(0,0,256,256);for(let i=0;i<80;i++){x.strokeStyle='rgba(255,255,255,.04)';x.beginPath();x.moveTo(0,Math.random()*256);x.lineTo(256,Math.random()*256);x.stroke();}noise(.08,450);
    }else if(kind==='fabric'||kind==='plaid'){
      x.fillStyle=kind==='plaid'?'#6b3d34':'#81705b';x.fillRect(0,0,256,256);if(kind==='plaid'){for(let p=0;p<256;p+=48){x.fillStyle='rgba(34,44,37,.55)';x.fillRect(p,0,16,256);x.fillRect(0,p,256,16);x.fillStyle='rgba(203,159,88,.18)';x.fillRect(p+22,0,5,256);x.fillRect(0,p+22,256,5);}}noise(.05,400);
    }else if(kind==='hay'){
      x.fillStyle='#9b8148';x.fillRect(0,0,256,256);for(let i=0;i<800;i++){x.strokeStyle=`rgba(${150+Math.random()*80|0},${110+Math.random()*70|0},${35+Math.random()*35|0},.45)`;const xx=Math.random()*256,yy=Math.random()*256;x.beginPath();x.moveTo(xx,yy);x.lineTo(xx+8+Math.random()*18,yy+Math.random()*8-4);x.stroke();}
    }else noise(.07,500);
    const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=4;return t;
  }

  function setRepeat(tex,x=2,y=2){if(tex){tex.repeat.set(x,y);tex.needsUpdate=true;}return tex;}

  class PropHuntWebGLRenderer{
    constructor(THREE,canvas,opts){
      this.T=THREE;this.canvas=canvas;this.opts=opts;this.state=null;this.scene=null;this.camera=null;this.renderer=null;this.world=null;this.actorMeshes=new Map();this.propMeshes=new Map();this.animalMeshes=new Map();this.wallMeshes=[];this.cameraBlockers=[];this.materials={};this.textures={};this.highlight=null;this.muzzleLight=null;this.lastMap=null;this.lastRound=0;this.disposed=false;this.raycaster=new THREE.Raycaster();this.clock=new THREE.Clock();
      this.initCore();
    }
    initCore(){const T=this.T;
      this.scene=new T.Scene();this.scene.background=new T.Color(0x1a201c);this.scene.fog=new T.FogExp2(0x20251e,.018);
      this.camera=new T.PerspectiveCamera(62,1,.05,120);this.camera.position.set(0,2.2,4.5);
      this.renderer=new T.WebGLRenderer({canvas:this.canvas,antialias:true,alpha:false,powerPreference:'high-performance'});this.renderer.outputColorSpace=T.SRGBColorSpace;this.renderer.toneMapping=T.ACESFilmicToneMapping;this.renderer.toneMappingExposure=1.15;this.renderer.shadowMap.enabled=true;this.renderer.shadowMap.type=T.PCFSoftShadowMap;
      const hemi=new T.HemisphereLight(0xffd9a3,0x26322d,1.7);this.scene.add(hemi);const sun=new T.DirectionalLight(0xffe5bd,2.2);sun.position.set(-10,18,7);sun.castShadow=true;sun.shadow.mapSize.set(1024,1024);sun.shadow.camera.left=-25;sun.shadow.camera.right=25;sun.shadow.camera.top=25;sun.shadow.camera.bottom=-25;this.scene.add(sun);this.sun=sun;
      this.world=new T.Group();this.scene.add(this.world);
      this.makeMaterials();this.resize();
    }
    makeMaterials(){const T=this.T;
      this.textures.wood=createCanvasTexture(T,'wood');this.textures.stone=createCanvasTexture(T,'stone');this.textures.grass=createCanvasTexture(T,'grass');this.textures.gravel=createCanvasTexture(T,'gravel');this.textures.earth=createCanvasTexture(T,'earth');this.textures.metal=createCanvasTexture(T,'metal');this.textures.fabric=createCanvasTexture(T,'fabric');this.textures.plaid=createCanvasTexture(T,'plaid');this.textures.hay=createCanvasTexture(T,'hay');
      const std=(name,color,map=null,rough=.82,metal=.02)=>this.materials[name]=new T.MeshStandardMaterial({color,map,roughness:rough,metalness:metal});
      std('wood',0xffffff,this.textures.wood,.86,.01);std('stone',0xffffff,this.textures.stone,.95,0);std('grass',0xffffff,this.textures.grass,1,0);std('gravel',0xffffff,this.textures.gravel,1,0);std('earth',0xffffff,this.textures.earth,1,0);std('metal',0xffffff,this.textures.metal,.43,.58);std('fabric',0xffffff,this.textures.fabric,.95,0);std('plaid',0xffffff,this.textures.plaid,.96,0);std('hay',0xffffff,this.textures.hay,1,0);
      std('darkWood',0x4a2f20,this.textures.wood,.9,0);std('warmWood',0x8a5a33,this.textures.wood,.85,0);std('leather',0x5d2f22,null,.72,.03);std('greenFabric',0x526346,this.textures.fabric,.95,0);std('black',0x161716,null,.55,.2);std('red',0x8d3428,null,.6,.08);std('blue',0x375a73,null,.75,.04);std('gold',0xb68b3b,null,.35,.65);std('cream',0xd9c39e,null,.95,0);std('rubber',0x202323,null,.85,.02);std('glass',0xb9e8e2,null,.12,.05);this.materials.glass.transparent=true;this.materials.glass.opacity=.42;this.materials.glass.depthWrite=false;std('greenMetal',0x556957,this.textures.metal,.52,.34);std('orange',0xc47a2e,null,.78,.02);std('white',0xe7decf,null,.9,0);std('redFabric',0x8b3d37,this.textures.plaid,.96,0);std('green',0x55784b,null,.92,0);std('leaf',0x4f7043,null,.93,0);std('haySolid',0xaa8a49,this.textures.hay,.98,0);
    }
    mat(name){return this.materials[name]||this.materials.warmWood;}
    resize(){if(this.disposed)return;const r=this.canvas.getBoundingClientRect();const w=Math.max(320,r.width||900),h=Math.max(360,r.height||700);const dpr=Math.min(window.devicePixelRatio||1,1.6);this.renderer.setPixelRatio(dpr);this.renderer.setSize(w,h,false);this.camera.aspect=w/h;this.camera.updateProjectionMatrix();}
    disposeWorld(){if(this.world){this.scene.remove(this.world);this.world.traverse(o=>{if(o.geometry)o.geometry.dispose?.();if(o.material&&o.userData.uniqueMaterial)o.material.dispose?.();});}this.world=new this.T.Group();this.scene.add(this.world);this.actorMeshes.clear();this.propMeshes.clear();this.animalMeshes.clear();this.wallMeshes=[];this.cameraBlockers=[];this.highlight=null;this.lastMap=null;}
    rebuild(state){this.state=state;this.disposeWorld();this.lastMap=state.map;this.lastRound=state.round;this.scene.fog.density=/camp|acreage|farm/.test(state.mapKey)?0.011:0.015;this.scene.background.set(/camp|acreage|farm/.test(state.mapKey)?0x26352c:0x1c201d);this.buildGround(state);this.buildEnvironment(state);this.syncProps(state,true);this.syncActors(state,true);this.syncAnimals(state,true);this.addAmbientRoomLights(state);this.buildHighlight();}
    buildGround(state){const T=this.T,m=state.map;const ground=new T.Mesh(new T.PlaneGeometry(m.w*S,m.d*S,1,1),this.mat(/camp|acreage|farm/.test(state.mapKey)?'grass':'earth'));ground.rotation.x=-Math.PI/2;ground.position.set(m.w*S/2,-.02,m.d*S/2);ground.receiveShadow=true;this.world.add(ground);
      for(const z of m.zones||[]){const n=String(z.name).toLowerCase();let mk=/kitchen|room|shop|garage|barn|shed|loft|basement|silo|camper|coop|pantry/.test(n)?'wood':/parking|driveway|apron|launch|equipment/.test(n)?'gravel':/field|yard|woods|grove|pasture|garden|grass/.test(n)?'grass':'earth';const mesh=new T.Mesh(new T.PlaneGeometry(z.w*S,z.d*S),this.mat(mk));mesh.rotation.x=-Math.PI/2;mesh.position.set((z.x+z.w/2)*S,0,(z.z+z.d/2)*S);mesh.receiveShadow=true;this.world.add(mesh);}
    }
    buildEnvironment(state){for(const b of state.map.boxes||[]){const obj=this.makeEnvironment(b);if(!obj)continue;obj.position.set((b.x+b.w/2)*S,obj.userData.floorBased?0:(b.h*S)/2,(b.z+b.d/2)*S);this.world.add(obj);if(b.solid){obj.userData.box=b;this.cameraBlockers.push(...this.collectMeshes(obj));}if(/wall|divider|fence|gate|silo wall/i.test(b.name))this.wallMeshes.push(obj);}}
    collectMeshes(obj){const a=[];obj.traverse(o=>{if(o.isMesh)a.push(o)});return a;}
    addBox(g,sx,sy,sz,mat,x=0,y=sy/2,z=0,cast=true){const T=this.T,m=new T.Mesh(new T.BoxGeometry(Math.max(.02,sx),Math.max(.02,sy),Math.max(.02,sz)),mat);m.position.set(x,y,z);m.castShadow=cast;m.receiveShadow=true;g.add(m);return m;}
    addCyl(g,rt,rb,h,mat,x=0,y=h/2,z=0,segments=18,rotX=0,rotZ=0){const T=this.T,m=new T.Mesh(new T.CylinderGeometry(rt,rb,Math.max(.02,h),segments),mat);m.position.set(x,y,z);m.rotation.x=rotX;m.rotation.z=rotZ;m.castShadow=true;m.receiveShadow=true;g.add(m);return m;}
    addSphere(g,r,mat,x=0,y=r,z=0,sx=1,sy=1,sz=1){const T=this.T,m=new T.Mesh(new T.SphereGeometry(Math.max(.02,r),18,12),mat);m.position.set(x,y,z);m.scale.set(sx,sy,sz);m.castShadow=true;m.receiveShadow=true;g.add(m);return m;}
    addTorus(g,r,tube,mat,x=0,y=0,z=0,rx=0,ry=0,rz=0,arc=TAU){const T=this.T,m=new T.Mesh(new T.TorusGeometry(Math.max(.02,r),Math.max(.01,tube),8,24,arc),mat);m.position.set(x,y,z);m.rotation.set(rx,ry,rz);m.castShadow=true;g.add(m);return m;}
    makeEnvironment(b){const n=String(b.name||'').toLowerCase(),w=b.w*S,d=b.d*S,h=b.h*S,T=this.T,g=new T.Group();
      if(/wall|divider/.test(n)){this.addBox(g,w,h,d,/silo/.test(n)?this.mat('metal'):this.mat('darkWood'),0,0,0);return g;}
      if(/fence|gate|railing/.test(n)){const railMat=this.mat('warmWood');for(const x of [-w/2+.06,w/2-.06])this.addBox(g,.09,h,.09,railMat,x,0,0);this.addBox(g,w,.08,.08,railMat,0,h*.35,0);this.addBox(g,w,.08,.08,railMat,0,h*.72,0);return g;}
      if(/fireplace/.test(n)){this.addBox(g,w,h,d,this.mat('stone'),0,0,0);const opening=this.addBox(g,w*.54,h*.5,d*.08,this.mat('black'),0,h*.12,d/2+.01);opening.position.y=h*.32;const glow=new T.PointLight(0xff8a35,3.8,5);glow.position.set(0,h*.42,d*.58);g.add(glow);for(let i=0;i<4;i++){const log=this.addCyl(g,.05,.05,w*.36,this.mat('darkWood'),0,h*.13,d*.55,10,0,Math.PI/2);log.rotation.z=Math.PI/2;log.position.x=(i-1.5)*.08;}return g;}
      if(/tractor|service truck|truck/.test(n))return this.makeVehicle(w,h,d,/tractor/.test(n)?'tractor':'truck');
      if(/motorcycle/.test(n))return this.makeMotorcycle(w,h,d);
      if(/couch|sofa/.test(n))return this.makeSofa(w,h,d,b.color);
      if(/chair/.test(n))return this.makeChair(w,h,d,/yellow/.test(n)?'cream':'leather');
      if(/workbench|bench|table|counter|packing/.test(n))return this.makeTable(w,h,d,/counter/.test(n)?'greenMetal':'warmWood');
      if(/shelv|rack/.test(n))return this.makeShelves(w,h,d);
      if(/fridge/.test(n))return this.makeFridge(w,h,d);
      if(/tent/.test(n))return this.makeTent(w,h,d);
      if(/sea can|container/.test(n)){this.addBox(g,w,h,d,this.mat('greenMetal'),0,0,0);for(let x=-w/2+.08;x<w/2;x+=.18)this.addBox(g,.025,h*.92,d+.01,this.mat('metal'),x,0,0,false);return g;}
      if(/stairs|step/.test(n)){this.addBox(g,w,h,d,this.mat('warmWood'),0,0,0);return g;}
      if(/hay|lumber|pallet|platform|catwalk/.test(n)){this.addBox(g,w,h,d,/hay/.test(n)?this.mat('haySolid'):this.mat('warmWood'),0,0,0);return g;}
      this.addBox(g,w,h,d,/metal|equipment|utility/.test(n)?this.mat('metal'):this.mat('warmWood'),0,0,0);return g;
    }
    makeTable(w,h,d,matName='warmWood'){const g=new this.T.Group(),m=this.mat(matName);g.userData.floorBased=true;this.addBox(g,w,.08,d,m,0,h-.04,0);const leg=.08;for(const x of [-w*.4,w*.4])for(const z of [-d*.35,d*.35])this.addBox(g,leg,h-.08,leg,m,x,0,z);return g;}
    makeChair(w,h,d,matName='warmWood'){const g=new this.T.Group(),m=this.mat(matName);g.userData.floorBased=true;const seatY=h*.46;this.addBox(g,w*.82,.09,d*.74,m,0,seatY,0);this.addBox(g,w*.82,h*.48,.08,m,0,seatY+h*.25,-d*.34);for(const x of [-w*.34,w*.34])for(const z of [-d*.28,d*.28])this.addBox(g,.07,seatY,.07,this.mat('darkWood'),x,0,z);return g;}
    makeSofa(w,h,d){const g=new this.T.Group();g.userData.floorBased=true;const m=this.mat('greenFabric');this.addBox(g,w*.9,h*.38,d*.75,m,0,h*.2,0);this.addBox(g,w*.9,h*.55,d*.18,m,0,h*.45,-d*.32);this.addBox(g,w*.16,h*.46,d*.78,m,-w*.42,h*.16,0);this.addBox(g,w*.16,h*.46,d*.78,m,w*.42,h*.16,0);return g;}
    makeShelves(w,h,d){const g=new this.T.Group(),m=this.mat('darkWood');g.userData.floorBased=true;for(const x of [-w*.46,w*.46])this.addBox(g,.07,h,d,m,x,0,0);for(let y=.08;y<h;y+=Math.max(.25,h/4))this.addBox(g,w,.055,d,m,0,y,0);return g;}
    makeFridge(w,h,d){const g=new this.T.Group();g.userData.floorBased=true;this.addBox(g,w,h,d,this.mat('greenMetal'),0,0,0);this.addBox(g,.025,h*.42,.03,this.mat('metal'),w*.33,h*.4,d/2+.02);this.addBox(g,.025,h*.25,.03,this.mat('metal'),w*.33,h*.72,d/2+.02);return g;}
    makeTent(w,h,d){const T=this.T,g=new T.Group();g.userData.floorBased=true;const geom=new T.ConeGeometry(Math.max(w,d)*.58,h,4);const mesh=new T.Mesh(geom,this.mat('fabric'));mesh.rotation.y=Math.PI/4;mesh.position.y=h/2;mesh.castShadow=true;g.add(mesh);return g;}
    makeVehicle(w,h,d,kind){const T=this.T,g=new T.Group(),bodyMat=kind==='tractor'?this.mat('greenMetal'):this.mat('blue');g.userData.floorBased=true;this.addBox(g,w*.72,h*.42,d*.7,bodyMat,0,h*.25,0);this.addBox(g,w*.4,h*.34,d*.36,bodyMat,0,h*.55,-d*.12);const wheelMat=this.mat('rubber');for(const x of [-w*.38,w*.38])for(const z of [-d*.3,d*.3]){const wh=Math.min(w,d)*.17;const m=new T.Mesh(new T.CylinderGeometry(wh,wh,.1,18),wheelMat);m.rotation.z=Math.PI/2;m.position.set(x,wh,z);m.castShadow=true;g.add(m);}return g;}
    makeMotorcycle(w,h,d){const T=this.T,g=new T.Group(),rub=this.mat('rubber');g.userData.floorBased=true;for(const x of [-w*.32,w*.32]){const wheel=new T.Mesh(new T.TorusGeometry(Math.min(h,d)*.28,.055,10,24),rub);wheel.rotation.y=Math.PI/2;wheel.position.set(x,h*.25,0);g.add(wheel);}this.addBox(g,w*.55,.08,.08,this.mat('metal'),0,h*.42,0);this.addBox(g,w*.28,.12,d*.35,this.mat('red'),0,h*.5,0);return g;}
    addAmbientRoomLights(state){const T=this.T;let count=0;for(const z of state.map.zones||[]){if(count>=10)break;const n=String(z.name).toLowerCase();if(!/room|shop|garage|barn|kitchen|bed|loft|basement|silo|camper|shed|coop/.test(n))continue;const l=new T.PointLight(0xffb45f,1.35,7);l.position.set((z.x+z.w/2)*S,2.1,(z.z+z.d/2)*S);this.world.add(l);count++;}}
    propKey(type){return String(type||'').toLowerCase();}
    makeProp(type,p={w:50,d:50,h:60,color:'#7b644b'}){const T=this.T,g=new T.Group(),n=this.propKey(type),w=Math.max(.18,(p.w||50)*S),d=Math.max(.18,(p.d||50)*S),h=Math.max(.16,(p.h||60)*S);const wood=this.mat('warmWood'),dark=this.mat('darkWood'),metal=this.mat('metal'),fabric=this.mat('fabric');
      if(/lantern/.test(n)){this.addCyl(g,w*.3,w*.36,h*.18,metal,0,h*.09,0);this.addCyl(g,w*.25,w*.25,h*.48,this.mat('glass'),0,h*.42,0,14);this.addCyl(g,w*.2,w*.31,h*.13,metal,0,h*.72,0);this.addTorus(g,w*.26,.025,metal,0,h*.72,0,0,0,0,Math.PI);return g;}
      if(/table lamp|bedside lamp| lamp$/.test(n)){this.addCyl(g,w*.3,w*.4,h*.18,wood,0,h*.09,0);this.addCyl(g,.025,.025,h*.38,this.mat('gold'),0,h*.33,0,10);const shade=new T.Mesh(new T.CylinderGeometry(w*.4,w*.25,h*.36,18,1,true),this.mat('cream'));shade.position.y=h*.68;shade.castShadow=true;g.add(shade);return g;}
      if(/mug|coffee/.test(n)){this.addCyl(g,w*.34,w*.32,h*.72,this.mat('cream'),0,h*.36,0,18);this.addTorus(g,w*.23,.035,this.mat('cream'),w*.31,h*.42,0);return g;}
      if(/kettle|teapot/.test(n)){this.addSphere(g,w*.36,metal,0,h*.42,0,1,.82,1);this.addCyl(g,w*.18,w*.24,h*.18,metal,0,h*.68,0,16);this.addTorus(g,w*.35,.035,n.includes('copper')?this.mat('gold'):metal,0,h*.65,0);const spout=this.addCyl(g,.025,w*.12,w*.55,metal,w*.35,h*.5,0,12,0,deg(-62));spout.rotation.z=deg(-62);return g;}
      if(/frying|skillet| pan$/.test(n)){this.addCyl(g,w*.38,w*.4,h*.15,this.mat('black'),0,h*.08,0,22);this.addBox(g,w*.7,.06,.1,this.mat('black'),w*.48,h*.1,0);return g;}
      if(/pie|cake/.test(n)){this.addCyl(g,w*.46,w*.48,h*.32,n.includes('cake')?this.mat('cream'):this.mat('orange'),0,h*.16,0,26);if(n.includes('cake'))for(let i=0;i<5;i++)this.addCyl(g,.012,.012,h*.24,this.mat('white'),(i-2)*w*.13,h*.42,0,6);else{for(let i=-2;i<=2;i++)this.addBox(g,w*.75,.015,.025,this.mat('warmWood'),0,h*.34,i*w*.12,false);}return g;}
      if(/bread|loaf/.test(n)){this.addSphere(g,w*.42,this.mat('cream'),0,h*.28,0,1.4,.65,.75);return g;}
      if(/apple/.test(n)){this.addCyl(g,w*.48,w*.4,h*.34,wood,0,h*.17,0,18);for(let i=0;i<8;i++)this.addSphere(g,w*.1,this.mat('red'),(Math.random()-.5)*w*.55,h*.42+Math.random()*h*.12,(Math.random()-.5)*d*.45);return g;}
      if(/firewood|lumber|driftwood/.test(n)){if(/crate/.test(n))this.makeCrateInto(g,w,h*.6,d);for(let i=0;i<7;i++){const log=this.addCyl(g,.07,.07,w*.65,dark,(i%3-1)*w*.16,h*.25+Math.floor(i/3)*.13,(i%2-.5)*d*.25,10,0,Math.PI/2);log.rotation.z=Math.PI/2;}return g;}
      if(/pine|fern|plant|flower|succulent/.test(n)){this.addCyl(g,w*.26,w*.34,h*.27,this.mat('orange'),0,h*.135,0,16);for(let i=0;i<7;i++){const a=i/7*TAU;this.addSphere(g,w*.18,this.mat('leaf'),Math.cos(a)*w*.15,h*.43+Math.random()*h*.25,Math.sin(a)*d*.15,.7,1.8,.45);}return g;}
      if(/rocking horse/.test(n)){this.addSphere(g,w*.28,wood,0,h*.5,0,1.4,.75,.65);this.addSphere(g,w*.18,wood,w*.28,h*.7,0,.8,1.1,.75);for(const x of [-w*.18,w*.18])for(const z of [-d*.18,d*.18])this.addCyl(g,.035,.04,h*.4,wood,x,h*.22,z,8);for(const z of [-d*.25,d*.25])this.addTorus(g,w*.4,.03,dark,0,.05,z,Math.PI/2,0,0,Math.PI);return g;}
      if(/teddy/.test(n)){this.addSphere(g,w*.28,this.mat('orange'),0,h*.42,0,1,1.15,.8);this.addSphere(g,w*.22,this.mat('orange'),0,h*.72,0);this.addSphere(g,w*.08,this.mat('orange'),-w*.18,h*.87,0);this.addSphere(g,w*.08,this.mat('orange'),w*.18,h*.87,0);for(const x of [-w*.26,w*.26])this.addSphere(g,w*.11,this.mat('orange'),x,h*.42,0,.7,1.2,.7);return g;}
      if(/photo|painting/.test(n)){this.addBox(g,w,h*.78,.06,dark,0,h*.4,0);const inner=this.addBox(g,w*.78,h*.62,.065,this.mat('cream'),0,h*.4,.035,false);return g;}
      if(/boot/.test(n)){for(const x of [-w*.18,w*.18]){this.addBox(g,w*.22,h*.62,d*.34,n.includes('rubber')?this.mat('greenMetal'):this.mat('leather'),x,h*.31,0);this.addBox(g,w*.32,h*.16,d*.56,n.includes('rubber')?this.mat('greenMetal'):this.mat('leather'),x,h*.08,d*.08);}return g;}
      if(/book/.test(n)){const cols=['red','blue','greenMetal','cream'];for(let i=0;i<4;i++){const m=this.mat(cols[i]);this.addBox(g,w*(.8-i*.04),h*.17,d*.72,m,(i%2?-.03:.02)*w,i*h*.17,0);}return g;}
      if(/round table/.test(n)){const top=this.addCyl(g,w*.5,w*.5,.08,wood,0,h-.04,0,28);this.addCyl(g,w*.11,w*.16,h*.88,dark,0,h*.44,0,14);return g;}
      if(/side table|dresser/.test(n))return this.makeTable(w,h,d,'warmWood');
      if(/chair|camp chair/.test(n))return this.makeChair(w,h,d,/camp/.test(n)?'fabric':'warmWood');
      if(/stool/.test(n)){this.addCyl(g,w*.45,w*.45,.08,wood,0,h*.68,0,22);for(const x of [-w*.28,w*.28])for(const z of [-d*.22,d*.22])this.addCyl(g,.025,.035,h*.68,dark,x,h*.34,z,8);return g;}
      if(/pillow|feed bag|bag/.test(n)){this.addBox(g,w*.9,h*.7,d*.72,/hay/.test(n)?this.mat('hay'):this.mat('redFabric'),0,0,0);return g;}
      if(/blanket/.test(n)){for(let i=0;i<3;i++)this.addBox(g,w*.9,h*.24,d*.82,i%2?this.mat('plaid'):this.mat('fabric'),0,i*h*.24,0);return g;}
      if(/barrel/.test(n)){this.addCyl(g,w*.45,w*.42,h*.84,wood,0,h*.42,0,22);for(const yy of [h*.14,h*.42,h*.7])this.addTorus(g,w*.43,.025,metal,0,yy,0,Math.PI/2);return g;}
      if(/fridge|refrigerator/.test(n))return this.makeFridge(w,h,d);
      if(/clock/.test(n)){this.addBox(g,w*.72,h*.78,d*.24,wood,0,0,0);this.addCyl(g,w*.27,w*.27,.035,this.mat('cream'),0,h*.52,d*.14,24,Math.PI/2);return g;}
      if(/umbrella/.test(n)){this.addCyl(g,w*.32,w*.35,h*.42,wood,0,h*.21,0,18);for(let i=0;i<5;i++){const a=(i-2)*.1;this.addCyl(g,.018,.018,h*.7,this.mat(i%2?'red':'blue'),(i-2)*w*.1,h*.42,0,8,0,a);}return g;}
      if(/coat hook/.test(n)){this.addBox(g,w,h*.2,.08,wood,0,h*.62,0);for(let i=-2;i<=2;i++)this.addCyl(g,.018,.018,h*.3,metal,i*w*.18,h*.5,0,8);return g;}
      if(/coat rack/.test(n)){this.addCyl(g,.04,.06,h*.86,wood,0,h*.43,0,12);for(let i=0;i<5;i++){const a=i/5*TAU;const arm=this.addCyl(g,.025,.025,w*.34,wood,Math.cos(a)*w*.12,h*.76,Math.sin(a)*w*.12,8,0,Math.PI/2);arm.rotation.z=Math.PI/2;arm.rotation.y=a;}return g;}
      if(/crate/.test(n)){this.makeCrateInto(g,w,h,d);return g;}
      if(/trunk|chest/.test(n)){this.addBox(g,w,h*.68,d,this.mat('greenMetal'),0,0,0);this.addBox(g,w*.92,h*.18,d*.94,dark,0,h*.68,0);for(const x of [-w*.35,w*.35])this.addBox(g,.04,h*.86,d+.01,this.mat('gold'),x,0,0,false);return g;}
      if(/basket/.test(n)){this.addCyl(g,w*.45,w*.38,h*.52,wood,0,h*.26,0,20);this.addTorus(g,w*.35,.025,wood,0,h*.48,0,0,0,0,Math.PI);return g;}
      if(/toy truck/.test(n)){this.addBox(g,w*.68,h*.32,d*.56,this.mat('red'),0,h*.2,0);this.addBox(g,w*.28,h*.35,d*.54,this.mat('red'),w*.18,h*.42,0);for(const x of [-w*.26,w*.26])for(const z of [-d*.3,d*.3])this.addCyl(g,.08,.08,.05,this.mat('rubber'),x,h*.08,z,12,Math.PI/2);return g;}
      if(/milk can/.test(n)){this.addCyl(g,w*.34,w*.42,h*.66,metal,0,h*.33,0,18);this.addCyl(g,w*.23,w*.3,h*.2,metal,0,h*.72,0,18);return g;}
      if(/bucket|waterer|feeder/.test(n)){this.addCyl(g,w*.42,w*.34,h*.62,metal,0,h*.31,0,18);this.addTorus(g,w*.33,.018,metal,0,h*.56,0,0,0,0,Math.PI);return g;}
      if(/toolbox/.test(n)){this.addBox(g,w*.9,h*.62,d*.75,this.mat('red'),0,0,0);this.addTorus(g,w*.28,.025,metal,0,h*.68,0,0,0,0,Math.PI);return g;}
      if(/gas can|oil jug/.test(n)){this.addBox(g,w*.72,h*.74,d*.58,n.includes('gas')?this.mat('red'):this.mat('greenMetal'),0,0,0);this.addTorus(g,w*.22,.035,this.mat('black'),0,h*.62,0,0,0,0,Math.PI);this.addCyl(g,.035,.05,w*.34,this.mat('black'),w*.34,h*.54,0,8,0,Math.PI/2);return g;}
      if(/welding helmet/.test(n)){this.addSphere(g,w*.38,this.mat('black'),0,h*.45,0,1,1.05,.65);this.addBox(g,w*.38,h*.22,.03,this.mat('blue'),0,h*.52,d*.32,false);return g;}
      if(/shop vac/.test(n)){this.addCyl(g,w*.38,w*.42,h*.7,this.mat('red'),0,h*.35,0,18);this.addTorus(g,w*.35,.035,this.mat('black'),0,h*.64,0);return g;}
      if(/beer case/.test(n)){this.addBox(g,w,h*.5,d,this.mat('red'),0,0,0);for(let i=0;i<4;i++)this.addCyl(g,.035,.04,h*.32,this.mat('glass'),(i-1.5)*w*.18,h*.42,0,8);return g;}
      if(/sawhorse/.test(n)){this.addBox(g,w,.08,d*.22,wood,0,h*.72,0);for(const x of [-w*.3,w*.3])for(const z of [-d*.28,d*.28]){const leg=this.addBox(g,.06,h*.72,.06,dark,x,h*.34,z);leg.rotation.z=(x<0?-.18:.18);}return g;}
      if(/extension cord/.test(n)){for(let i=0;i<5;i++)this.addTorus(g,w*.25+i*.018,.018,i%2?this.mat('orange'):this.mat('red'),0,h*.25+i*.012,0,Math.PI/2);return g;}
      if(/hay bale/.test(n)){this.addBox(g,w,h,d,this.mat('haySolid'),0,0,0);return g;}
      if(/wheelbarrow/.test(n)){this.addBox(g,w*.7,h*.28,d*.7,this.mat('greenMetal'),0,h*.36,0);const wheel=this.addCyl(g,w*.16,w*.16,.08,this.mat('rubber'),0,h*.16,-d*.4,16,Math.PI/2);for(const x of [-w*.25,w*.25])this.addBox(g,.045,.045,d*.9,wood,x,h*.34,d*.35);return g;}
      if(/garbage can/.test(n)){this.addCyl(g,w*.42,w*.34,h*.8,metal,0,h*.4,0,20);this.addCyl(g,w*.45,w*.45,h*.08,metal,0,h*.84,0,20);return g;}
      if(/tire/.test(n)){this.addTorus(g,w*.33,w*.11,this.mat('rubber'),0,h*.36,0,Math.PI/2);return g;}
      if(/cooler/.test(n)){this.addBox(g,w,h*.72,d,this.mat('blue'),0,0,0);this.addBox(g,w*.98,h*.08,d*.98,this.mat('white'),0,h*.72,0);return g;}
      if(/dog toy/.test(n)){this.addSphere(g,w*.16,this.mat('red'),-w*.18,h*.3,0);this.addSphere(g,w*.16,this.mat('red'),w*.18,h*.3,0);this.addCyl(g,w*.09,w*.09,w*.42,this.mat('red'),0,h*.3,0,12,0,Math.PI/2);return g;}
      if(/rock/.test(n)){const mesh=new T.Mesh(new T.DodecahedronGeometry(w*.42,0),this.mat('stone'));mesh.scale.y=.7;mesh.position.y=h*.28;mesh.castShadow=true;g.add(mesh);return g;}
      if(/shovel/.test(n)){this.addCyl(g,.025,.025,h*.75,wood,0,h*.5,0,8);const blade=this.addBox(g,w*.5,h*.22,.035,metal,0,h*.12,0);blade.rotation.z=.08;return g;}
      if(/pallet/.test(n)){for(let i=-2;i<=2;i++)this.addBox(g,w*.18,h*.18,d,wood,i*w*.2,0,0);this.addBox(g,w,h*.12,d*.18,dark,0,h*.18,-d*.32);this.addBox(g,w,h*.12,d*.18,dark,0,h*.18,d*.32);return g;}
      if(/rubber duck/.test(n)){this.addSphere(g,w*.3,this.mat('orange'),0,h*.3,0,1.2,.8,.8);this.addSphere(g,w*.19,this.mat('orange'),w*.18,h*.56,0);return g;}
      if(/toilet paper/.test(n)){this.addCyl(g,w*.34,w*.34,h*.62,this.mat('white'),0,h*.31,0,20,Math.PI/2);return g;}
      if(/candle/.test(n)){this.addCyl(g,w*.2,w*.22,h*.68,this.mat('cream'),0,h*.34,0,16);return g;}
      this.addBox(g,w,h,d,wood,0,0,0);return g;
    }
    makeCrateInto(g,w,h,d){const wood=this.mat('warmWood'),dark=this.mat('darkWood');this.addBox(g,w,h,d,wood,0,0,0);for(const x of [-w*.42,w*.42])this.addBox(g,.055,h+.02,d+.02,dark,x,0,0,false);for(const z of [-d*.42,d*.42])this.addBox(g,w+.02,h+.02,.055,dark,0,0,z,false);}
    syncProps(state,force=false){const existing=new Set();for(const p of state.props){existing.add(p.id);let obj=this.propMeshes.get(p.id);if(!obj){obj=this.makeProp(p.type,p);obj.userData.propId=p.id;obj.userData.propRef=p;obj.rotation.y=p.rot||0;const sh=new this.T.Mesh(new this.T.CircleGeometry(Math.max(.12,(p.w||40)*S*.42),20),new this.T.MeshBasicMaterial({color:0x000000,transparent:true,opacity:.22,depthWrite:false}));sh.rotation.x=-Math.PI/2;sh.position.y=.008;obj.add(sh);this.world.add(obj);this.propMeshes.set(p.id,obj);}obj.position.set(p.x*S,(p.y||0)*S,p.z*S);obj.rotation.y=p.rot||0;obj.visible=true;}
      for(const [id,obj] of this.propMeshes)if(!existing.has(id)){this.world.remove(obj);this.propMeshes.delete(id);}
    }
    makeNameSprite(text,color='#f7e5ba'){const T=this.T,c=document.createElement('canvas');c.width=256;c.height=64;const x=c.getContext('2d');x.font='900 28px system-ui';x.textAlign='center';x.textBaseline='middle';x.fillStyle='rgba(8,6,4,.68)';x.roundRect(18,10,220,44,16);x.fill();x.strokeStyle='rgba(230,190,110,.45)';x.stroke();x.fillStyle=color;x.fillText(text,128,32);const tex=new T.CanvasTexture(c);tex.colorSpace=T.SRGBColorSpace;const sp=new T.Sprite(new T.SpriteMaterial({map:tex,transparent:true,depthTest:false}));sp.scale.set(1.6,.4,1);return sp;}
    makeActor(actor){const T=this.T,g=new T.Group();g.userData.actorIndex=actor.index;const id=actor.person.id,colors=colorForPerson(id),dog=!!actor.person.dog;if(dog)this.buildDog(g,colors,actor);else this.buildHuman(g,colors,actor);const tag=this.makeNameSprite(actor.person.name,actor.role==='hunter'?'#ffc3a7':'#d7f3df');tag.position.y=dog?1.05:1.95;g.add(tag);g.userData.nameTag=tag;const ring=new T.Mesh(new T.RingGeometry(.34,.42,28),new T.MeshBasicMaterial({color:actor.index===0?0xffd86a:(actor.role==='hunter'?0xe46143:0x52b67b),transparent:true,opacity:actor.index===0?.65:.24,side:T.DoubleSide}));ring.rotation.x=-Math.PI/2;ring.position.y=.012;g.add(ring);g.userData.ring=ring;return g;}
    buildHuman(g,colors,actor){const T=this.T,skin=new T.MeshStandardMaterial({color:0xd3a77f,roughness:.85}),top=new T.MeshStandardMaterial({color:colors[0],roughness:.88}),pants=new T.MeshStandardMaterial({color:colors[1],roughness:.9}),boots=new T.MeshStandardMaterial({color:colors[2],roughness:.82}),hair=new T.MeshStandardMaterial({color:colors[3],roughness:.9});g.userData.uniqueMaterials=[skin,top,pants,boots,hair];
      const torso=this.addBox(g,.48,.62,.26,top,0,.94,0);torso.scale.x=actor.person.id==='kristen'?1.12:1;const head=this.addSphere(g,.22,skin,0,1.55,0,1,.96,.95);this.addSphere(g,.225,hair,0,1.66,-.018,1,.52,1.01);const neck=this.addCyl(g,.07,.075,.12,skin,0,1.3,0,12);const hip=this.addBox(g,.42,.16,.24,pants,0,.58,0);
      const armL=new T.Group(),armR=new T.Group(),legL=new T.Group(),legR=new T.Group();g.add(armL,armR,legL,legR);armL.position.set(-.31,1.18,0);armR.position.set(.31,1.18,0);legL.position.set(-.12,.55,0);legR.position.set(.12,.55,0);this.addCyl(armL,.055,.065,.48,top,0,-.24,0,10);this.addSphere(armL,.07,skin,0,-.51,0);this.addCyl(armR,.055,.065,.48,top,0,-.24,0,10);this.addSphere(armR,.07,skin,0,-.51,0);this.addCyl(legL,.07,.075,.5,pants,0,-.25,0,10);this.addBox(legL,.14,.09,.24,boots,0,-.54,.055);this.addCyl(legR,.07,.075,.5,pants,0,-.25,0,10);this.addBox(legR,.14,.09,.24,boots,0,-.54,.055);g.userData.limbs={armL,armR,legL,legR};
      if(actor.role==='hunter'){const gun=this.makeZapper();gun.position.set(.06,-.43,-.16);gun.rotation.set(-.25,0,-.18);armR.add(gun);g.userData.gun=gun;armR.rotation.x=-.62;armR.rotation.z=-.22;}
      this.applyPortraitToHead(actor,head);
    }
    applyPortraitToHead(actor,head){const T=this.T,url=(actor.style&&actor.style!=='default')?`/avatars/family-packs/${actor.style}/${actor.person.id}.jpg`:(actor.person.id==='john'?'/avatars/john-black.png':`/avatars/${actor.person.id}.png`);const img=new Image();img.crossOrigin='anonymous';img.onload=()=>{if(this.disposed)return;const c=document.createElement('canvas');c.width=c.height=256;const x=c.getContext('2d');x.save();x.beginPath();x.arc(128,128,118,0,TAU);x.clip();const s=Math.min(img.naturalWidth,img.naturalHeight),sx=(img.naturalWidth-s)/2,sy=Math.max(0,(img.naturalHeight-s)*.18);x.drawImage(img,sx,sy,s,s,0,0,256,256);x.restore();const tex=new T.CanvasTexture(c);tex.colorSpace=T.SRGBColorSpace;const plane=new T.Mesh(new T.CircleGeometry(.178,32),new T.MeshBasicMaterial({map:tex,transparent:true,side:T.DoubleSide}));plane.position.set(0,0,.206);head.add(plane);};img.src=url;}
    buildDog(g,colors){const T=this.T,fur=new T.MeshStandardMaterial({color:colors[0],roughness:.92}),dark=new T.MeshStandardMaterial({color:colors[2],roughness:.9});this.addSphere(g,.34,fur,0,.48,0,1.6,.8,.8);this.addSphere(g,.24,fur,0,.77,.24,1,.9,1.05);for(const x of [-.24,.24])for(const z of [-.18,.18])this.addCyl(g,.045,.055,.38,fur,x,.2,z,10);this.addSphere(g,.055,dark,0,.8,.48,1.1,.85,.9);const tail=this.addCyl(g,.035,.05,.45,fur,0,.64,-.38,8,deg(70));tail.rotation.x=deg(70);g.userData.limbs={tail};}
    makeZapper(){const T=this.T,g=new T.Group();this.addBox(g,.14,.36,.12,this.mat('black'),0,-.18,.06);this.addCyl(g,.09,.11,.52,this.mat('metal'),0,.05,-.18,16,Math.PI/2);this.addCyl(g,.13,.13,.2,this.mat('blue'),0,.05,-.48,18,Math.PI/2);for(let i=0;i<3;i++)this.addTorus(g,.11,.018,this.mat('gold'),0,.05,-.32-i*.08,0,0,0);const muzzle=this.addCyl(g,.06,.08,.12,this.mat('black'),0,.05,-.65,16,Math.PI/2);g.userData.muzzle=muzzle;return g;}
    syncActors(state,force=false){const existing=new Set();for(const a of state.actors){existing.add(a.index);let obj=this.actorMeshes.get(a.index);if(!obj){obj=this.makeActor(a);this.world.add(obj);this.actorMeshes.set(a.index,obj);}obj.position.set(a.x*S,a.y*S,a.z*S);obj.rotation.y=a.yaw;obj.visible=a.alive;const hidden=!!a.prop&&a.role==='hider';obj.traverse(o=>{if(o.userData?.isDisguise)return;});
        const key=`${a.prop||''}`;if(obj.userData.disguiseKey!==key){if(obj.userData.disguise){obj.remove(obj.userData.disguise);obj.userData.disguise=null;}obj.userData.disguiseKey=key;if(a.prop){const d=this.makeProp(a.prop,a.propShape||{});d.userData.isDisguise=true;const sh=new this.T.Mesh(new this.T.CircleGeometry(Math.max(.12,(a.propShape?.w||40)*S*.42),20),new this.T.MeshBasicMaterial({color:0x000000,transparent:true,opacity:.24,depthWrite:false}));sh.rotation.x=-Math.PI/2;sh.position.y=.008;d.add(sh);obj.add(d);obj.userData.disguise=d;}}
        const bodyParts=obj.children.filter(c=>c!==obj.userData.nameTag&&c!==obj.userData.ring&&c!==obj.userData.disguise);for(const c of bodyParts)c.visible=!hidden;if(obj.userData.disguise)obj.userData.disguise.visible=hidden;
        const move=clamp(a.moveAmount||0,0,1),t=performance.now()*.009+a.index*.7,limbs=obj.userData.limbs;if(limbs&&!a.person.dog){if(limbs.legL)limbs.legL.rotation.x=Math.sin(t)*.62*move;if(limbs.legR)limbs.legR.rotation.x=-Math.sin(t)*.62*move;if(limbs.armL)limbs.armL.rotation.x=-Math.sin(t)*.45*move;if(limbs.armR&&a.role!=='hunter')limbs.armR.rotation.x=Math.sin(t)*.45*move;}else if(limbs?.tail)limbs.tail.rotation.z=Math.sin(t*1.4)*.45;
        if(obj.userData.nameTag)obj.userData.nameTag.visible=a.alive&&a!==state.player&&!hidden&&a.role===state.player.role;if(obj.userData.ring)obj.userData.ring.visible=a.alive;
      }
      for(const [id,obj] of this.actorMeshes)if(!existing.has(id)){this.world.remove(obj);this.actorMeshes.delete(id);}
    }
    makeAnimal(name){const T=this.T,g=new T.Group(),n=String(name||'').toLowerCase();let body,head,legMat;
      if(n.includes('pig')){body=new T.MeshStandardMaterial({color:0x5f4233,roughness:.9});head=body;this.addSphere(g,.28,body,0,.45,0,1.45,.78,.9);this.addSphere(g,.19,head,.34,.52,.05,1,.85,1);for(const x of [-.2,.2])for(const z of [-.15,.15])this.addCyl(g,.035,.045,.3,body,x,.15,z,8);this.addSphere(g,.07,new T.MeshStandardMaterial({color:0x2a211c,roughness:.9}),.5,.52,.05);}
      else if(n.includes('goat')){body=new T.MeshStandardMaterial({color:0xe5ddd0,roughness:.92});const dark=new T.MeshStandardMaterial({color:0x604d3d,roughness:.9});this.addSphere(g,.25,body,0,.5,0,1.5,.72,.78);this.addSphere(g,.18,body,.32,.64,.02,1,.9,.9);for(const x of [-.2,.2])for(const z of [-.14,.14])this.addCyl(g,.03,.04,.38,dark,x,.2,z,8);for(const zz of [-.07,.07]){const horn=this.addCyl(g,.018,.035,.22,dark,.38,.83,zz,8);horn.rotation.z=-.55;}if(n.includes('baby'))g.scale.setScalar(.72);}
      else if(n.includes('peacock')){body=new T.MeshStandardMaterial({color:0x315d6b,roughness:.75});this.addSphere(g,.17,body,0,.38,0,1,.9,1.2);this.addSphere(g,.1,new T.MeshStandardMaterial({color:0x426f5c}),0,.59,.05);for(let i=-3;i<=3;i++){const feather=this.addBox(g,.035,.55,.04,new T.MeshStandardMaterial({color:i%2?0x2f6f74:0x537a48,roughness:.8}),i*.05,.35,-.18);feather.rotation.x=-.25;}for(const x of [-.05,.05])this.addCyl(g,.018,.018,.28,this.mat('gold'),x,.14,.02,7);}
      else {body=new T.MeshStandardMaterial({color:n.includes('turkey')?0x654436:0xb79555,roughness:.9});this.addSphere(g,.16,body,0,.34,0,1.1,.9,1.2);this.addSphere(g,.085,new T.MeshStandardMaterial({color:0xc45a3d}),.04,.52,.05);for(const x of [-.04,.04])this.addCyl(g,.015,.015,.26,this.mat('gold'),x,.13,.02,7);}
      g.traverse(o=>{if(o.isMesh){o.castShadow=true;o.receiveShadow=true;}});return g;}
    syncAnimals(state,force=false){const existing=new Set();(state.animals||[]).forEach((a,i)=>{existing.add(i);let obj=this.animalMeshes.get(i);if(!obj){obj=this.makeAnimal(a.name);this.world.add(obj);this.animalMeshes.set(i,obj);}obj.position.set(a.x*S,(a.y||0)*S,a.z*S);const dx=(a.tx||a.x)-a.x,dz=(a.tz||a.z)-a.z;if(Math.hypot(dx,dz)>.5)obj.rotation.y=Math.atan2(dx,dz);});for(const [i,obj] of this.animalMeshes)if(!existing.has(i)){this.world.remove(obj);this.animalMeshes.delete(i);}}

    buildHighlight(){const T=this.T;this.highlight=new T.Mesh(new T.RingGeometry(.34,.48,32),new T.MeshBasicMaterial({color:0xffd35e,transparent:true,opacity:.72,side:T.DoubleSide,depthWrite:false}));this.highlight.rotation.x=-Math.PI/2;this.highlight.visible=false;this.world.add(this.highlight);}
    syncHighlight(state){const p=state.nearProp;if(p&&state.player?.role==='hider'&&!state.player.prop){this.highlight.visible=true;this.highlight.position.set(p.x*S,.025+(p.y||0)*S,p.z*S);const s=1+Math.sin(performance.now()*.008)*.08;this.highlight.scale.setScalar(s);}else this.highlight.visible=false;}
    updateCamera(state){const T=this.T,p=state.player;if(!p)return;const target=new T.Vector3(p.x*S,p.y*S+(p.person.dog?.7:1.25),p.z*S);const yaw=state.camera.yaw,pitch=clamp(state.camera.pitch,-.1,.65),dist=(state.camera.aiming?2.15:3.65);const forward=new T.Vector3(Math.sin(yaw)*Math.cos(pitch),Math.sin(pitch),Math.cos(yaw)*Math.cos(pitch));const desired=target.clone().addScaledVector(forward,-dist);desired.y+=.42;const right=new T.Vector3(Math.cos(yaw),0,-Math.sin(yaw));if(state.camera.aiming)desired.addScaledVector(right,.42);
      // True camera collision: ray from player to desired camera and pull in before walls.
      const rayDir=desired.clone().sub(target),wanted=rayDir.length();rayDir.normalize();this.raycaster.set(target,rayDir);this.raycaster.far=wanted;const hits=this.raycaster.intersectObjects(this.cameraBlockers,false);let final=desired;if(hits.length&&hits[0].distance<wanted-.08)final=target.clone().addScaledVector(rayDir,Math.max(.75,hits[0].distance-.18));this.camera.position.lerp(final,.22);const look=target.clone().addScaledVector(forward,.3);this.camera.lookAt(look);this.camera.fov=state.camera.aiming?48:62;this.camera.updateProjectionMatrix();
      this.sun.position.set(this.camera.position.x-8,16,this.camera.position.z+6);this.sun.target.position.copy(target);this.scene.add(this.sun.target);
    }
    getShotRay(){const T=this.T;const d=new T.Vector3();this.camera.getWorldDirection(d);return{o:{x:this.camera.position.x/S,y:this.camera.position.y/S,z:this.camera.position.z/S},d:{x:d.x,y:d.y,z:d.z}};}
    render(state){if(this.disposed||!state)return;if(this.lastMap!==state.map||this.lastRound!==state.round)this.rebuild(state);this.state=state;this.syncProps(state);this.syncActors(state);this.syncAnimals(state);this.syncHighlight(state);this.updateCamera(state);const p=state.player;if(p?.role==='hunter'&&state.shotCooldown>0){if(!this.muzzleLight){this.muzzleLight=new this.T.PointLight(0x7bdcff,0,3);this.world.add(this.muzzleLight);}const actor=this.actorMeshes.get(p.index);if(actor){const pos=new this.T.Vector3(.1,1.0,-.75);actor.localToWorld(pos);this.muzzleLight.position.copy(pos);this.muzzleLight.intensity=6*clamp(state.shotCooldown/.085,0,1);}}else if(this.muzzleLight)this.muzzleLight.intensity=0;this.renderer.render(this.scene,this.camera);}
    dispose(){this.disposed=true;this.disposeWorld();this.renderer?.dispose();}
  }

  window.PropHuntWebGL={
    load:loadThree,
    async create(canvas,opts={}){const THREE=await loadThree();return new PropHuntWebGLRenderer(THREE,canvas,opts);},
    url:THREE_URL,
    features:{realWebGL:true,volumetricProps:true,thirdPersonCamera:true,cameraCollision:true,threeDimensionalCharacters:true,threeDimensionalZapper:true,exact3DDecoys:true,shadowLighting:true,proceduralMaterials:true}
  };
})();
