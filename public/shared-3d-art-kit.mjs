/*
 * Black Family Game Night - Shared 3D Art Kit
 * Procedural stylized-realistic assets for browser WebGL games.
 * The kit intentionally uses reusable geometry and generated materials so the
 * games can look materially richer without relying on front-facing sprites.
 */

export function create3DArtKit(THREE){
  const textureCache=new Map();
  const materialCache=new Map();
  const TAU=Math.PI*2;

  const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
  const numColor=c=>typeof c==='number'?c:new THREE.Color(c).getHex();
  const cssColor=c=>`#${numColor(c).toString(16).padStart(6,'0')}`;
  const shade=(c,amount)=>{
    const color=new THREE.Color(numColor(c));
    if(amount>=0)color.lerp(new THREE.Color(0xffffff),clamp(amount,0,1));
    else color.lerp(new THREE.Color(0x000000),clamp(-amount,0,1));
    return `#${color.getHexString()}`;
  };
  function rng(seed=1){let s=(seed>>>0)||1;return()=>{s=(s*1664525+1013904223)>>>0;return s/4294967296}};
  function hashString(s=''){let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return h>>>0;}

  function makeTexture(kind,color,seed=1){
    const key=`${kind}:${numColor(color)}:${seed}`;
    if(textureCache.has(key))return textureCache.get(key);
    if(typeof document==='undefined')return null;
    const c=document.createElement('canvas');c.width=256;c.height=256;
    const x=c.getContext('2d'),r=rng(hashString(key));
    x.fillStyle=cssColor(color);x.fillRect(0,0,256,256);
    if(kind==='wood'||kind==='paintedWood'){
      const plank=64;
      for(let py=0;py<256;py+=plank){
        x.fillStyle=shade(color,(r()-.5)*.12);x.fillRect(0,py,256,plank-2);
        x.fillStyle=shade(color,-.22);x.fillRect(0,py+plank-2,256,2);
        for(let i=0;i<18;i++){
          const yy=py+5+r()*(plank-10),amp=2+r()*4;
          x.strokeStyle=shade(color,-(.08+r()*.15));x.globalAlpha=.28+r()*.22;x.lineWidth=.5+r()*1.2;x.beginPath();x.moveTo(0,yy);
          for(let xx=0;xx<=256;xx+=16)x.lineTo(xx,yy+Math.sin(xx*.035+r()*5)*amp);
          x.stroke();
        }
        if(r()>.25){const kx=25+r()*205,ky=py+12+r()*(plank-24);x.globalAlpha=.32;x.strokeStyle=shade(color,-.28);for(let q=0;q<3;q++){x.beginPath();x.ellipse(kx,ky,7+q*4,3+q*1.8,r()*.3,0,TAU);x.stroke()}}
      }
      x.globalAlpha=1;
      if(kind==='paintedWood'){x.fillStyle='rgba(255,255,255,.08)';x.fillRect(0,0,256,256)}
    }else if(kind==='concrete'){
      for(let i=0;i<1800;i++){const v=r()>.5?255:0;x.fillStyle=`rgba(${v},${v},${v},${.01+r()*.035})`;const s=.5+r()*2;x.fillRect(r()*256,r()*256,s,s)}
      for(let i=0;i<12;i++){x.strokeStyle='rgba(55,45,35,.045)';x.lineWidth=1+r()*3;x.beginPath();x.moveTo(r()*256,r()*256);x.bezierCurveTo(r()*256,r()*256,r()*256,r()*256,r()*256,r()*256);x.stroke()}
    }else if(kind==='gravel'||kind==='dirt'||kind==='grass'){
      for(let i=0;i<2400;i++){const d=(r()-.5)*.32;x.fillStyle=shade(color,d);x.globalAlpha=.12+r()*.32;const s=kind==='gravel'?1+r()*3:kind==='grass'?.35+r()*1.4:.5+r()*2;x.beginPath();x.ellipse(r()*256,r()*256,s,s*.65,r()*TAU,0,TAU);x.fill()}if(kind==='grass'){x.globalAlpha=.22;for(let i=0;i<220;i++){x.strokeStyle=shade(color,(r()-.5)*.28);x.beginPath();const xx=r()*256,yy=r()*256;x.moveTo(xx,yy);x.lineTo(xx+(r()-.5)*3,yy-2-r()*7);x.stroke()}}x.globalAlpha=1;
    }else if(kind==='plaster'||kind==='asphalt'){
      for(let i=0;i<1500;i++){const v=kind==='plaster'?(r()>.5?255:0):(r()>.5?210:20);x.fillStyle=`rgba(${v},${v},${v},${.008+r()*.028})`;const ss=.4+r()*1.7;x.fillRect(r()*256,r()*256,ss,ss)}
      if(kind==='plaster'){x.globalAlpha=.06;for(let i=0;i<24;i++){x.strokeStyle='#000';x.beginPath();x.moveTo(r()*256,r()*256);x.quadraticCurveTo(r()*256,r()*256,r()*256,r()*256);x.stroke()}x.globalAlpha=1}
    }else if(kind==='metal'||kind==='paintedMetal'||kind==='galvanized'){
      for(let i=0;i<900;i++){const xx=r()*256,yy=r()*256;x.fillStyle=`rgba(255,255,255,${.015+r()*.045})`;x.fillRect(xx,yy,.5+r()*1.4,.5+r()*1.4)}
      for(let i=0;i<65;i++){x.strokeStyle=`rgba(0,0,0,${.012+r()*.04})`;x.beginPath();const yy=r()*256;x.moveTo(0,yy);x.lineTo(256,yy+(r()-.5)*3);x.stroke()}
      if(kind==='galvanized'){x.globalAlpha=.12;for(let i=0;i<60;i++){x.fillStyle=i%2?'#fff':'#000';x.beginPath();x.arc(r()*256,r()*256,3+r()*12,0,TAU);x.fill()}x.globalAlpha=1}
      if(kind==='paintedMetal'){x.fillStyle='rgba(255,255,255,.035)';x.fillRect(0,0,256,256)}
    }else if(kind==='rubber'){
      for(let i=0;i<1200;i++){x.fillStyle=`rgba(255,255,255,${.008+r()*.025})`;const s=.8+r()*1.4;x.fillRect(r()*256,r()*256,s,s)}
    }else if(kind==='fabric'||kind==='leather'){
      x.globalAlpha=.16;x.strokeStyle=kind==='fabric'?'#fff':'#000';x.lineWidth=.5;
      const step=kind==='fabric'?5:12;for(let i=0;i<256;i+=step){x.beginPath();x.moveTo(i,0);x.lineTo(i,256);x.stroke();x.beginPath();x.moveTo(0,i);x.lineTo(256,i);x.stroke()}x.globalAlpha=1;
      if(kind==='leather'){for(let i=0;i<600;i++){x.fillStyle=`rgba(255,255,255,${.01+r()*.025})`;x.fillRect(r()*256,r()*256,1,1)}}
    }else if(kind==='stone'){
      x.lineWidth=2;for(let yy=-20;yy<276;yy+=42){let xx=(Math.floor(yy/42)%2)*-25;while(xx<276){const ww=38+r()*34,hh=30+r()*12;x.fillStyle=shade(color,(r()-.5)*.24);x.fillRect(xx+2,yy+2,ww-4,hh-4);x.strokeStyle=shade(color,-.28);x.strokeRect(xx+1,yy+1,ww-2,hh-2);xx+=ww}}
    }else if(kind==='hay'){
      for(let i=0;i<1400;i++){x.strokeStyle=shade(color,(r()-.5)*.28);x.globalAlpha=.35+r()*.45;x.lineWidth=.5+r();const xx=r()*256,yy=r()*256;x.beginPath();x.moveTo(xx,yy);x.lineTo(xx+(r()-.5)*16,yy-4-r()*18);x.stroke()}x.globalAlpha=1;
    }else if(kind==='pegboard'){
      x.fillStyle=cssColor(color);x.fillRect(0,0,256,256);x.fillStyle=shade(color,-.42);for(let yy=10;yy<256;yy+=16)for(let xx=10;xx<256;xx+=16){x.beginPath();x.arc(xx,yy,2.2,0,TAU);x.fill()}
    }
    const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(2,2);t.anisotropy=4;t.needsUpdate=true;textureCache.set(key,t);return t;
  }

  function makeSurfacePropertyTexture(kind,color,seed=1,channel='roughness'){
    const key=`surface:${channel}:${kind}:${numColor(color)}:${seed}`;
    if(textureCache.has(key))return textureCache.get(key);
    if(typeof document==='undefined')return null;
    const size=96,c=document.createElement('canvas');c.width=c.height=size;const x=c.getContext('2d'),r=rng(hashString(key));
    const img=x.createImageData(size,size),d=img.data;
    for(let yy=0;yy<size;yy++)for(let xx=0;xx<size;xx++){
      const i=(yy*size+xx)*4;
      if(channel==='roughness'){
        const grain=Math.sin(xx*.31+seed*.13)*.12+Math.cos(yy*.27+seed*.19)*.1+(r()-.5)*.2;
        const base={metal:.38,paintedMetal:.58,galvanized:.48,wood:.78,paintedWood:.7,concrete:.94,gravel:.98,dirt:.98,grass:.97,rubber:.95,fabric:.98,leather:.86,stone:.95,hay:.99,plaster:.91,asphalt:.98,skin:.83,hair:.93}[kind]??.82;
        const v=Math.round(clamp(base+grain*.18,0,1)*255);d[i]=d[i+1]=d[i+2]=v;d[i+3]=255;
      }else{
        // Tangent-space normal approximation.  Low amplitude is intentional so
        // generated materials gain surface breakup without looking crumpled.
        const a=(Math.sin(xx*.34+seed)+Math.cos(yy*.29+seed*.7)+(r()-.5)*.7)*.08;
        const b=(Math.cos(xx*.25-seed*.3)-Math.sin(yy*.37+seed*.2)+(r()-.5)*.7)*.08;
        d[i]=Math.round((.5+a)*255);d[i+1]=Math.round((.5+b)*255);d[i+2]=255;d[i+3]=255;
      }
    }
    x.putImageData(img,0,0);const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(2,2);t.colorSpace=THREE.NoColorSpace||'';t.anisotropy=2;t.needsUpdate=true;textureCache.set(key,t);return t;
  }

  function material(kind='paintedMetal',color=0x777777,opts={}){
    const rough=opts.roughness??({wood:.74,paintedWood:.66,concrete:.95,gravel:1,dirt:1,metal:.34,paintedMetal:.52,galvanized:.45,rubber:.94,fabric:.96,leather:.84,stone:.94,hay:.98,pegboard:.9,grass:.98,plaster:.9,asphalt:.97,skin:.84,hair:.92,glass:.12}[kind]??.82);
    const metal=opts.metalness??({metal:.78,paintedMetal:.28,galvanized:.7}[kind]??0);
    const key=`${kind}:${numColor(color)}:${rough}:${metal}:${opts.emissive||0}:${opts.transparent||false}:${opts.opacity||1}`;
    if(materialCache.has(key))return materialCache.get(key);
    let m;
    if(kind==='glass'){
      m=new THREE.MeshPhysicalMaterial({color,roughness:.08,metalness:0,transparent:true,opacity:opts.opacity??.34,transmission:opts.transmission??.36,thickness:.03,ior:1.45,side:THREE.DoubleSide});
    }else{
      const map=makeTexture(kind,color,opts.seed||1),surfaceKinds=['wood','paintedWood','concrete','gravel','dirt','grass','plaster','asphalt','metal','paintedMetal','galvanized','rubber','fabric','leather','stone','hay','pegboard','skin','hair'];
      m=new THREE.MeshStandardMaterial({color,map:map||null,roughness:rough,metalness:metal,emissive:opts.emissive||0,emissiveIntensity:opts.emissiveIntensity||0});
      if(map&&surfaceKinds.includes(kind)){m.bumpMap=map;m.bumpScale=opts.bumpScale??(['gravel','stone','concrete'].includes(kind)?.055:.025);m.roughnessMap=makeSurfacePropertyTexture(kind,color,opts.seed||1,'roughness');m.normalMap=makeSurfacePropertyTexture(kind,color,opts.seed||1,'normal');m.normalScale?.set?.(opts.normalScale??.22,opts.normalScale??.22)}
    }
    materialCache.set(key,m);return m;
  }

  function mesh(g,mat,pos=[0,0,0],rot=[0,0,0],scale=null){const m=new THREE.Mesh(g,mat);m.position.set(...pos);m.rotation.set(...rot);if(scale)m.scale.set(...scale);m.castShadow=true;m.receiveShadow=true;return m}
  function box(w,h,d,mat,pos=[0,0,0],rot=[0,0,0]){return mesh(new THREE.BoxGeometry(w,h,d,2,2,2),mat,pos,rot)}
  function sphere(r,mat,pos=[0,0,0],scale=[1,1,1]){return mesh(new THREE.SphereGeometry(r,24,18),mat,pos,[0,0,0],scale)}
  function cylinder(r1,r2,h,mat,pos=[0,0,0],rot=[0,0,0],segments=16){return mesh(new THREE.CylinderGeometry(r1,r2,h,segments),mat,pos,rot)}
  function capsule(radius,length,mat,pos=[0,0,0],rot=[0,0,0],scale=[1,1,1]){
    const geo=THREE.CapsuleGeometry?new THREE.CapsuleGeometry(radius,length,8,16):new THREE.CylinderGeometry(radius,radius,length+radius*2,18);
    return mesh(geo,mat,pos,rot,scale);
  }
  function torus(r,tube,mat,pos=[0,0,0],rot=[0,0,0],arc=TAU){return mesh(new THREE.TorusGeometry(r,tube,10,28,arc),mat,pos,rot)}
  function addRaycast(w,obj){if(!w?.raycastMeshes)return;obj.traverse?.(o=>{if(o.isMesh)w.raycastMeshes.push(o)});}
  function addCollider(w,spec,obj){if(!w?.colliders)return null;const c={x:spec.x,z:spec.z,y:spec.y||0,w:spec.w,d:spec.d,h:spec.h,solid:spec.solid!==false,climbable:!!spec.climbable,walkableTop:spec.walkableTop??!!spec.climbable,noCamera:!!spec.noCamera,name:spec.name||'asset',mesh:obj};w.colliders.push(c);if(obj)obj.userData.worldCollider=c;return c}
  function addAsset(w,g,spec=null,{raycast=true}={}){w.group.add(g);if(spec)addCollider(w,spec,g);if(raycast)addRaycast(w,g);return g}
  function tubeBetween(a,b,r,mat){
    const av=new THREE.Vector3(...a),bv=new THREE.Vector3(...b),mid=av.clone().add(bv).multiplyScalar(.5),dir=bv.clone().sub(av),len=dir.length();
    const m=cylinder(r,r,len,mat,[mid.x,mid.y,mid.z]);m.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),dir.normalize());return m;
  }

  function slatWall(w,{x,z,width,height,axis='x',color=0x6d563d,spacing=.72}){
    const g=new THREE.Group(),wood=material('paintedWood',color,{seed:7}),trim=material('wood',shadeHex(color,-.18),{seed:11});
    const count=Math.max(2,Math.ceil(width/spacing));for(let i=0;i<count;i++){
      const t=count===1?.5:i/(count-1),off=-width/2+t*width;
      const s=box(axis==='x'?.055:.11,height-.16,axis==='x'?.11:.055,wood,axis==='x'?[off,height/2,0]:[0,height/2,off]);g.add(s);
    }
    g.add(box(axis==='x'?width:.12,.08,axis==='x'?.12:width,trim,[0,.08,0]));g.add(box(axis==='x'?width:.12,.08,axis==='x'?.12:width,trim,[0,height-.08,0]));g.position.set(x,0,z);addAsset(w,g,{x,z,y:0,w:axis==='x'?width:.14,d:axis==='x'?.14:width,h:height,name:'slat wall'});return g;
  }

  function shadeHex(c,amt){const cc=new THREE.Color(numColor(c));if(amt>0)cc.lerp(new THREE.Color(0xffffff),amt);else cc.lerp(new THREE.Color(0x000000),-amt);return cc.getHex()}

  function buildWorkbench(w,x,z,rot=0){
    const g=new THREE.Group(),wood=material('wood',0x8d6742,{seed:19}),darkWood=material('wood',0x5c422f,{seed:23}),steel=material('galvanized',0x6f7372,{seed:3});
    g.add(box(3.0,.14,.86,wood,[0,.93,0]));
    for(const sx of [-1.28,1.28])for(const sz of [-.31,.31])g.add(box(.13,.88,.13,darkWood,[sx,.44,sz]));
    g.add(box(2.7,.10,.66,darkWood,[0,.28,0]));
    g.add(box(2.85,.95,.055,material('pegboard',0x9a7958,{seed:6}),[0,1.45,.39]));
    for(let i=0;i<5;i++){const tool=tubeBetween([-1.0+i*.48,1.52,.34],[-.9+i*.48,1.18,.34],.025,steel);g.add(tool)}
    const vise=new THREE.Group();vise.add(box(.34,.18,.28,material('paintedMetal',0x31566a),[0,.08,0]));vise.add(box(.26,.11,.08,steel,[0,.18,-.12]));vise.position.set(1.05,1.05,-.12);g.add(vise);
    const power=new THREE.Group();power.add(box(.38,.22,.28,material('paintedMetal',0xb27332),[0,.11,0]));power.add(cylinder(.035,.035,.22,steel,[.22,.12,0],[0,0,Math.PI/2]));power.position.set(-.75,1.08,0);g.add(power);
    g.rotation.y=rot;g.position.set(x,0,z);return addAsset(w,g,{x,z,y:0,w:3.15,d:.95,h:1.95,climbable:true,walkableTop:true,name:'Detailed workbench'});
  }

  function buildToolChest(w,x,z,rot=0){
    const g=new THREE.Group(),red=material('paintedMetal',0x8f342e,{seed:9}),steel=material('metal',0x9da3a1),rub=material('rubber',0x1c1f20);
    g.add(box(1.45,1.02,.64,red,[0,.55,0]));g.add(box(1.5,.11,.69,material('rubber',0x232526),[0,1.115,0]));
    for(let i=0;i<6;i++){const y=.25+i*.135;g.add(box(1.31,.105,.035,material('paintedMetal',i%2?0x943c35:0x82312b),[0,y,-.335]));g.add(box(.42,.025,.025,steel,[0,y,-.365]));}
    for(const sx of [-.55,.55])for(const sz of [-.23,.23])g.add(cylinder(.085,.085,.08,rub,[sx,.08,sz],[Math.PI/2,0,0],12));
    g.rotation.y=rot;g.position.set(x,0,z);return addAsset(w,g,{x,z,y:0,w:1.55,d:.75,h:1.2,climbable:true,walkableTop:true,name:'Rolling tool chest'});
  }

  function buildShelving(w,x,z,rot=0,{width=1.85,height=2.25,depth=.62}={}){
    const g=new THREE.Group(),steel=material('paintedMetal',0x454c4d,{seed:10}),shelf=material('wood',0x866646,{seed:13});
    for(const sx of [-width/2+.06,width/2-.06])for(const sz of [-depth/2+.05,depth/2-.05])g.add(box(.08,height,.08,steel,[sx,height/2,sz]));
    for(let i=0;i<5;i++){const y=.12+i*(height-.2)/4;g.add(box(width,.07,depth,shelf,[0,y,0]));if(i>0){for(let k=0;k<3;k++){const col=[0x6b795d,0x8e5941,0x445a67,0x9a783e][(i+k)%4];const bin=box(.4,.22,.42,material('paintedMetal',col,{seed:i*3+k}),[-.55+k*.55,y+.14,0]);g.add(bin)}}}
    for(let i=0;i<4;i++){const can=cylinder(.07,.07,.2,material('metal',0x8a8e87),[-.55+i*.35,height-.02,-.05]);g.add(can)}
    g.rotation.y=rot;g.position.set(x,0,z);return addAsset(w,g,{x,z,y:0,w:width+.08,d:depth+.08,h:height,climbable:true,walkableTop:false,name:'Loaded shelving'});
  }

  function buildLumberStack(w,x,z,rot=0,{width=2.6,height=.58,depth=.72}={}){
    const g=new THREE.Group(),wood=material('wood',0xa47b4f,{seed:31});
    const rows=Math.max(3,Math.round(height/.1)),cols=4;for(let j=0;j<rows;j++)for(let i=0;i<cols;i++)g.add(box(width,.075,depth/cols-.025,wood,[0,.06+j*.09,-depth/2+(i+.5)*depth/cols]));
    for(const z0 of [-depth*.34,depth*.34])g.add(box(width+.05,.045,.04,material('paintedMetal',0x7d5b31),[0,height*.45,z0]));
    g.rotation.y=rot;g.position.set(x,0,z);return addAsset(w,g,{x,z,y:0,w:width,d:depth,h:height,climbable:true,walkableTop:true,name:'Lumber stack'});
  }

  function buildCrate(w,x,z,rot=0,{width=.85,height=.55,depth=.65,color=0x7e6040,name='Parts crate'}={}){
    const g=new THREE.Group(),wood=material('wood',color,{seed:42});g.add(box(width,height,depth,wood,[0,height/2,0]));
    const slat=material('wood',shadeHex(color,-.15),{seed:45});for(const xx of [-width*.38,width*.38])g.add(box(.06,height+.02,depth+.03,slat,[xx,height/2,0]));for(const zz of [-depth*.38,depth*.38])g.add(box(width+.03,.06,.06,slat,[0,height*.72,zz]));
    g.rotation.y=rot;g.position.set(x,0,z);return addAsset(w,g,{x,z,y:0,w:width,d:depth,h:height,climbable:true,walkableTop:true,name});
  }

  function buildTractor(w,x,z,rot=0){
    const g=new THREE.Group(),green=material('paintedMetal',0x58713d,{seed:12}),greenDark=material('paintedMetal',0x40552e,{seed:13}),steel=material('metal',0x707674),rubber=material('rubber',0x1a1c1c),yellow=material('glass',0xf5d77b,{opacity:.58,transmission:.15});
    g.add(box(1.18,.64,1.22,green,[-.42,.68,-.05]));g.add(box(1.0,.18,1.1,greenDark,[-.5,1.08,-.05]));
    g.add(box(.72,.78,1.02,green,[.55,.84,.02]));g.add(box(.52,.18,.62,material('leather',0x292c28),[.52,1.35,.05]));
    const wheelData=[[-.85,-.68,.43],[-.85,.68,.43],[.68,-.68,.56],[.68,.68,.56]];
    for(const [xx,zz,rr] of wheelData){const tire=torus(rr,.15, rubber,[xx,rr,zz],[0,Math.PI/2,0]);g.add(tire);g.add(cylinder(rr*.42,rr*.42,.12,steel,[xx,rr,zz],[Math.PI/2,0,0],16));}
    g.add(cylinder(.045,.055,1.25,material('metal',0x34393a),[-.66,1.73,.37]));g.add(cylinder(.08,.08,.1,material('metal',0x222627),[-.66,2.36,.37]));
    const steer=torus(.18,.025,material('rubber',0x252727),[.22,1.58,-.05],[Math.PI/2,.25,0]);g.add(steer);g.add(tubeBetween([.22,1.42,-.05],[.22,1.58,-.05],.025,steel));
    for(const zz of [-.38,.38]){g.add(cylinder(.085,.085,.06,material('glass',0xffe7a3,{opacity:.75}),[-1.02,1.0,zz],[0,0,Math.PI/2],16));}
    g.add(box(1.75,.08,1.52,greenDark,[.1,.22,0]));
    g.rotation.y=rot;g.position.set(x,0,z);return addAsset(w,g,{x,z,y:0,w:2.55,d:1.65,h:2.45,climbable:true,walkableTop:true,name:'Detailed tractor'});
  }

  function buildMotorcycle(w,x,z,rot=0){
    const g=new THREE.Group(),rub=material('rubber',0x171919),chrome=material('metal',0x9ea4a1),paint=material('paintedMetal',0x413f3e,{seed:18}),leather=material('leather',0x4b382d,{seed:8});
    for(const zz of [-.68,.68]){g.add(torus(.38,.07,rub,[0,.4,zz],[0,Math.PI/2,0]));g.add(cylinder(.22,.22,.05,chrome,[0,.4,zz],[Math.PI/2,0,0],18));}
    g.add(tubeBetween([0,.45,-.48],[0,.72,.12],.035,chrome));g.add(tubeBetween([0,.72,.12],[0,.45,.52],.035,chrome));g.add(tubeBetween([0,.45,-.48],[0,.45,.52],.035,chrome));
    const tank=sphere(.25,paint,[0,.82,-.16],[1,.72,1.3]);g.add(tank);g.add(box(.32,.12,.5,leather,[0,.82,.34],[.05,0,0]));
    g.add(tubeBetween([0,.56,-.53],[0,1.05,-.72],.035,chrome));g.add(tubeBetween([0,1.05,-.72],[-.28,1.05,-.78],.025,chrome));g.add(tubeBetween([0,1.05,-.72],[.28,1.05,-.78],.025,chrome));
    g.add(cylinder(.09,.11,.3,material('metal',0x474b49),[0,.55,.18],[0,0,Math.PI/2]));
    g.rotation.y=rot;g.position.set(x,0,z);return addAsset(w,g,{x,z,y:0,w:.8,d:1.65,h:1.2,climbable:true,walkableTop:false,name:'Old motorcycle'});
  }

  function buildFireplace(w,x,z,rot=0){
    const g=new THREE.Group(),stone=material('stone',0x6d6255,{seed:17}),dark=material('paintedMetal',0x1f1c19),wood=material('wood',0x4e3524,{seed:6});
    g.add(box(1.38,.28,.78,stone,[0,.14,0]));g.add(box(.26,1.55,.72,stone,[-.56,.95,0]));g.add(box(.26,1.55,.72,stone,[.56,.95,0]));g.add(box(1.38,.32,.72,stone,[0,1.62,0]));g.add(box(1.08,.12,.92,wood,[0,1.88,0]));
    const back=box(.98,1.1,.08,dark,[0,.78,.32]);g.add(back);for(const rz of [-.04,.08]){const log=cylinder(.07,.09,.7,wood,[-.12,.33,rz],[0,0,Math.PI/2],10);g.add(log)}
    const flameMat=new THREE.MeshStandardMaterial({color:0xff8a32,emissive:0xff531a,emissiveIntensity:2.4,roughness:.45});for(let i=0;i<3;i++){const f=mesh(new THREE.ConeGeometry(.13+i*.02,.48-i*.07,12),flameMat,[(i-1)*.14,.48,-.08+i*.04],[0,0,(i-1)*.12]);f.userData.flamePhase=i*1.7;g.add(f)}
    const glow=new THREE.PointLight(0xff8b42,3.0,6.5,2);glow.position.set(0,.75,-.28);g.add(glow);g.userData.fireLight=glow;
    g.rotation.y=rot;g.position.set(x,0,z);return addAsset(w,g,{x,z,y:0,w:1.55,d:.95,h:2.0,climbable:false,name:'Stone fireplace'});
  }

  function buildPapaChair(w,x,z,rot=0){
    const g=new THREE.Group(),fabric=material('fabric',0xb59a43,{seed:33}),dark=material('fabric',0x796730,{seed:35}),wood=material('wood',0x4d3826,{seed:2});
    g.add(box(.78,.18,.72,fabric,[0,.47,0]));g.add(capsule(.29,.63,fabric,[0,1.04,.26],[0,0,Math.PI/2],[1.0,1.15,.58]));
    for(const sx of [-.48,.48]){const arm=capsule(.12,.52,fabric,[sx,.72,-.02],[Math.PI/2,0,0],[1,1,1]);g.add(arm);g.add(box(.11,.48,.11,wood,[sx,.24,.2]));g.add(box(.11,.48,.11,wood,[sx,.24,-.22]));}
    for(const sx of [-.28,.28])g.add(box(.1,.34,.1,wood,[sx,.17,-.22]));
    const patch=box(.24,.018,.22,dark,[-.18,.57,-.36],[Math.PI/2,0,.12]);g.add(patch);const tear=box(.16,.015,.12,material('fabric',0x6d5824),[.2,1.16,.52]);g.add(tear);
    g.rotation.y=rot;g.position.set(x,0,z);return addAsset(w,g,{x,z,y:0,w:1.12,d:.92,h:1.55,climbable:true,walkableTop:false,name:"Papa's tattered yellow chair"});
  }

  function buildDrillPress(w,x,z,rot=0){
    const g=new THREE.Group(),steel=material('metal',0x6d7371),blue=material('paintedMetal',0x3c5b66),dark=material('metal',0x303536);
    g.add(box(.7,.14,.55,dark,[0,.07,0]));g.add(cylinder(.055,.065,1.45,steel,[0, .82,.12]));g.add(box(.52,.18,.42,blue,[0,1.42,.02]));g.add(box(.55,.06,.42,steel,[0,.72,-.03]));g.add(cylinder(.035,.04,.52,dark,[0,1.12,-.08]));g.add(cylinder(.08,.08,.14,dark,[0,1.0,-.08]));
    g.rotation.y=rot;g.position.set(x,0,z);return addAsset(w,g,{x,z,y:0,w:.8,d:.65,h:1.62,name:'Drill press'});
  }

  function buildAirCompressor(w,x,z,rot=0){
    const g=new THREE.Group(),tank=material('paintedMetal',0x315b6a,{seed:11}),steel=material('metal',0x777d7a),rub=material('rubber',0x222424);
    const cyl=cylinder(.32,.32,1.15,tank,[0,.42,0],[0,0,Math.PI/2],20);g.add(cyl);g.add(box(.48,.34,.42,material('paintedMetal',0x272c2d),[0,.78,0]));for(const sx of [-.45,.45])g.add(torus(.16,.045,rub,[sx,.18,0],[0,Math.PI/2,0]));g.add(tubeBetween([.15,.76,0],[.42,.9,-.12],.025,steel));
    g.rotation.y=rot;g.position.set(x,0,z);return addAsset(w,g,{x,z,y:0,w:1.25,d:.72,h:1.1,name:'Air compressor'});
  }

  function buildWeldingCart(w,x,z,rot=0){
    const g=new THREE.Group(),steel=material('metal',0x525857),welder=material('paintedMetal',0x894335,{seed:8}),rub=material('rubber',0x222323);
    g.add(box(.72,.08,.5,steel,[0,.14,0]));for(const sx of [-.28,.28])for(const sz of [-.18,.18])g.add(torus(.075,.025,rub,[sx,.075,sz],[Math.PI/2,0,0]));g.add(box(.58,.48,.42,welder,[0,.46,0]));g.add(box(.42,.08,.04,material('paintedMetal',0x202526),[0,.52,-.23]));g.add(tubeBetween([.25,.7,.1],[.25,1.05,.1],.03,steel));g.add(cylinder(.13,.13,.72,material('paintedMetal',0x467244),[.25,1.12,.1],[],14));
    g.rotation.y=rot;g.position.set(x,0,z);return addAsset(w,g,{x,z,y:0,w:.8,d:.6,h:1.52,name:'Welding cart'});
  }

  function buildLadder(w,x,z,rot=0,height=2.35){
    const g=new THREE.Group(),al=material('metal',0xa8aaa4);g.add(box(.06,height,.07,al,[-.28,height/2,0]));g.add(box(.06,height,.07,al,[.28,height/2,0]));for(let y=.25;y<height-.1;y+=.28)g.add(box(.58,.04,.07,al,[0,y,0]));g.rotation.y=rot;g.position.set(x,0,z);return addAsset(w,g,{x,z,y:0,w:.68,d:.18,h:height,climbable:true,walkableTop:false,name:'Aluminum ladder'});
  }

  function buildOverheadLight(w,x,z,y=2.62,rot=0){
    const g=new THREE.Group(),fixture=material('paintedMetal',0xe7e2d5),lamp=new THREE.MeshStandardMaterial({color:0xf7f1df,emissive:0xfaf2d8,emissiveIntensity:1.35,roughness:.35});g.add(box(1.55,.07,.22,fixture,[0,0,0]));g.add(box(1.35,.025,.15,lamp,[0,-.045,0]));const light=new THREE.PointLight(0xfff2d1,1.3,7,2);light.position.set(0,-.15,0);g.add(light);g.rotation.y=rot;g.position.set(x,y,z);w.group.add(g);return g;
  }

  function buildBarnStall(w,x,z,rot=0,{width=2.35,depth=2.0}={}){
    const g=new THREE.Group(),wood=material('wood',0x725238,{seed:14}),metal=material('metal',0x4f5757);
    for(const xx of [-width/2,width/2])for(const zz of [-depth/2,depth/2])g.add(box(.11,1.55,.11,wood,[xx,.775,zz]));
    for(const zz of [-depth/2,depth/2])for(const yy of [.48,.92,1.32])g.add(box(width,.07,.08,wood,[0,yy,zz]));
    for(const xx of [-width/2,width/2])for(const yy of [.48,.92,1.32])g.add(box(.08,.07,depth,wood,[xx,yy,0]));
    const gate=box(width*.75,.06,.06,metal,[0,.72,-depth/2-.04],[0,0,0]);g.add(gate);g.rotation.y=rot;g.position.set(x,0,z);return addAsset(w,g,{x,z,y:0,w:width+.12,d:depth+.12,h:1.6,name:'Barn stall'});
  }

  function buildPicnicTable(w,x,z,rot=0){
    const g=new THREE.Group(),wood=material('wood',0x8f6845,{seed:21});for(let i=-2;i<=2;i++)g.add(box(.32,.08,2.2,wood,[i*.34,.78,0]));for(const sx of [-.78,.78]){g.add(box(.34,.08,2.15,wood,[sx,.42,0]));g.add(tubeBetween([sx*.52,.1,-.8],[sx,.72,-.8],.06,wood));g.add(tubeBetween([sx*.52,.1,.8],[sx,.72,.8],.06,wood));}g.rotation.y=rot;g.position.set(x,0,z);return addAsset(w,g,{x,z,y:0,w:2.15,d:2.35,h:.84,climbable:true,walkableTop:true,name:'Picnic table'});
  }

  function buildBBQ(w,x,z,rot=0){
    const g=new THREE.Group(),black=material('paintedMetal',0x24292a,{seed:5}),steel=material('metal',0x777d7b),rub=material('rubber',0x202222);
    g.add(cylinder(.42,.4,.45,black,[0,.93,0],[],20));g.add(mesh(new THREE.SphereGeometry(.43,20,12,0,TAU,0,Math.PI*.5),black,[0,1.15,0]));g.add(box(.85,.05,.08,steel,[0,.95,-.42]));for(const sx of [-.26,.26])g.add(tubeBetween([sx,.12,0],[sx,.75,0],.035,steel));for(const sx of [-.28,.28])g.add(torus(.1,.035,rub,[sx,.1,.18],[Math.PI/2,0,0]));g.rotation.y=rot;g.position.set(x,0,z);return addAsset(w,g,{x,z,y:0,w:1.0,d:.9,h:1.55,climbable:true,name:'BBQ'});
  }

  function buildTruck(w,x,z,rot=0){
    const g=new THREE.Group(),paint=material('paintedMetal',0x66737a,{seed:20}),dark=material('paintedMetal',0x3e474b),rub=material('rubber',0x171919),glass=material('glass',0x7fa7b6,{opacity:.38});
    g.add(box(2.55,.52,1.35,paint,[0,.62,0]));g.add(box(1.08,.78,1.24,paint,[-.55,1.25,0]));g.add(box(.06,.5,1.0,glass,[-1.12,1.33,0]));g.add(box(1.0,.42,1.1,dark,[.72,.97,0]));
    for(const xx of [-.82,.82])for(const zz of [-.68,.68]){g.add(torus(.31,.09,rub,[xx,.34,zz],[0,Math.PI/2,0]));g.add(cylinder(.15,.15,.08,material('metal',0x8a8f8c),[xx,.34,zz],[Math.PI/2,0,0],14));}
    for(const zz of [-.4,.4])g.add(cylinder(.07,.07,.05,material('glass',0xffe5a8,{opacity:.72}),[-1.3,.75,zz],[0,0,Math.PI/2],12));g.rotation.y=rot;g.position.set(x,0,z);return addAsset(w,g,{x,z,y:0,w:2.75,d:1.55,h:1.75,climbable:true,walkableTop:true,name:'Pickup truck'});
  }

  function buildTent(w,x,z,rot=0){
    const g=new THREE.Group(),fabric=material('fabric',0x756447,{seed:16}),dark=material('fabric',0x4f4a3f,{seed:17});
    const shape=new THREE.Shape();shape.moveTo(-1.25,0);shape.lineTo(0,1.65);shape.lineTo(1.25,0);shape.lineTo(-1.25,0);const geo=new THREE.ExtrudeGeometry(shape,{depth:2.0,bevelEnabled:false});geo.translate(0,0,-1.0);const body=mesh(geo,fabric,[0,0,0],[0,Math.PI/2,0]);g.add(body);const door=box(.95,1.25,.015,dark,[0,.61,-1.02]);g.add(door);g.add(tubeBetween([-1.2,.04,-1.03],[0,1.67,-1.03],.025,material('metal',0x777c78)));g.add(tubeBetween([1.2,.04,-1.03],[0,1.67,-1.03],.025,material('metal',0x777c78)));g.rotation.y=rot;g.position.set(x,0,z);return addAsset(w,g,{x,z,y:0,w:2.2,d:2.65,h:1.72,climbable:true,name:"Logan's tent"});
  }

  function buildCampfire(w,x,z){
    const g=new THREE.Group(),stone=material('stone',0x6c655c,{seed:4}),wood=material('wood',0x4d3424,{seed:7});for(let i=0;i<10;i++){const a=i/10*TAU;g.add(sphere(.14,stone,[Math.cos(a)*.55,.11,Math.sin(a)*.55],[1,.75,1]));}for(const a of [-.55,.55])g.add(cylinder(.08,.1,.9,wood,[0,.18,0],[Math.PI/2,a,0],10));const fm=new THREE.MeshStandardMaterial({color:0xff8a35,emissive:0xff4718,emissiveIntensity:2.4,roughness:.38});for(let i=0;i<3;i++){const flame=mesh(new THREE.ConeGeometry(.12+i*.02,.48-i*.06,10),fm,[(i-1)*.12,.45,0],[0,0,(i-1)*.14]);flame.userData.flamePhase=i*1.37;g.add(flame)}const light=new THREE.PointLight(0xff8a44,2.6,7,2);light.position.set(0,.7,0);g.add(light);g.userData.fireLight=light;const smoke=new THREE.Group();for(let i=0;i<4;i++){const puff=sphere(.1+i*.025,new THREE.MeshStandardMaterial({color:0x8d8982,transparent:true,opacity:.12,roughness:1,depthWrite:false}),[(i%2?-.05:.05),.82+i*.22,0],[1,1.25,1]);puff.userData.ambientBob={baseY:.82+i*.22,phase:i*.8,speed:.65,amount:.035};smoke.add(puff)}g.add(smoke);g.position.set(x,0,z);w.group.add(g);addRaycast(w,g);return g;
  }

  function buildTrailer(w,x,z,rot=0){
    const g=new THREE.Group(),white=material('paintedMetal',0xc9c1ac,{seed:12}),trim=material('paintedMetal',0x6f817f,{seed:8}),glass=material('glass',0x84aebc,{opacity:.36}),rub=material('rubber',0x1e2020);
    g.add(box(3.55,1.55,1.45,white,[0,1.04,0]));g.add(box(3.65,.18,1.55,trim,[0,1.88,0]));for(const xx of [-1.15,.25])g.add(box(.75,.55,.025,glass,[xx,1.25,-.74]));g.add(box(.72,1.35,.04,trim,[1.18,.75,-.75]));for(const xx of [-1.0,1.05])for(const zz of [-.68,.68])g.add(torus(.24,.07,rub,[xx,.28,zz],[0,Math.PI/2,0]));g.rotation.y=rot;g.position.set(x,0,z);return addAsset(w,g,{x,z,y:0,w:3.75,d:1.65,h:2.0,climbable:true,walkableTop:true,name:'Holiday trailer'});
  }

  function buildBoat(w,x,z,rot=0){
    const g=new THREE.Group(),hull=material('paintedMetal',0x66858a,{seed:7}),trim=material('paintedMetal',0xe4dfd1),glass=material('glass',0x77a5b8,{opacity:.36});
    const hullShape=new THREE.Shape();hullShape.moveTo(-1.45,0);hullShape.lineTo(-1.15,.55);hullShape.lineTo(1.1,.55);hullShape.lineTo(1.55,0);hullShape.lineTo(1.0,-.15);hullShape.lineTo(-1.0,-.15);hullShape.lineTo(-1.45,0);const geo=new THREE.ExtrudeGeometry(hullShape,{depth:1.15,bevelEnabled:true,bevelSize:.06,bevelThickness:.06,bevelSegments:2});geo.translate(0,0,-.575);const hmesh=mesh(geo,hull,[0,.55,0],[0,Math.PI/2,0]);g.add(hmesh);g.add(box(1.15,.55,.92,trim,[.2,1.02,0]));g.add(box(.05,.4,.72,glass,[-.4,1.14,0]));g.rotation.y=rot;g.position.set(x,0,z);return addAsset(w,g,{x,z,y:.25,w:2.6,d:1.35,h:1.25,climbable:true,walkableTop:true,name:'Boat'});
  }

  function buildTrampoline(w,x,z,rot=0){
    const g=new THREE.Group(),steel=material('metal',0x535957),matr=material('fabric',0x202526,{seed:3});g.add(cylinder(1.18,1.18,.07,matr,[0,.72,0],[],32));g.add(torus(1.23,.035,steel,[0,.74,0],[Math.PI/2,0,0]));for(let i=0;i<8;i++){const a=i/8*TAU;g.add(tubeBetween([Math.cos(a)*1.08,.1,Math.sin(a)*1.08],[Math.cos(a)*1.18,.7,Math.sin(a)*1.18],.025,steel));}g.rotation.y=rot;g.position.set(x,0,z);return addAsset(w,g,{x,z,y:.1,w:2.5,d:2.5,h:.7,climbable:true,walkableTop:true,name:'Trampoline'});
  }

  function buildPool(w,x,z,rot=0){
    const g=new THREE.Group(),wall=material('paintedMetal',0x7396a5,{seed:12}),water=new THREE.MeshPhysicalMaterial({color:0x48a0bd,transparent:true,opacity:.63,roughness:.08,metalness:0,transmission:.15});g.add(cylinder(1.5,1.5,1.1,wall,[0,.55,0],[],36));const top=cylinder(1.43,1.43,.035,water,[0,1.08,0],[],36);top.castShadow=false;top.userData.waterSurface={baseY:1.08,phase:1.7};g.add(top);g.add(torus(1.5,.04,material('metal',0xc3c6bd),[0,1.1,0],[Math.PI/2,0,0]));g.rotation.y=rot;g.position.set(x,0,z);return addAsset(w,g,{x,z,y:0,w:3.05,d:3.05,h:1.13,climbable:true,name:'Above-ground pool'});
  }

  function buildHotTub(w,x,z,rot=0){
    const g=new THREE.Group(),wood=material('paintedWood',0x765f49,{seed:4}),water=new THREE.MeshPhysicalMaterial({color:0x69a6b8,transparent:true,opacity:.62,roughness:.1,transmission:.18});g.add(cylinder(.85,.85,.85,wood,[0,.425,0],[],28));const waterTop=cylinder(.73,.73,.035,water,[0,.79,0],[],28);waterTop.userData.waterSurface={baseY:.79,phase:3.1};g.add(waterTop);g.add(torus(.84,.05,material('paintedMetal',0xc5c4b5),[0,.84,0],[Math.PI/2,0,0]));g.rotation.y=rot;g.position.set(x,0,z);return addAsset(w,g,{x,z,y:0,w:1.75,d:1.75,h:.9,climbable:true,name:'Hot tub'});
  }

  function buildSeaCan(w,x,z,rot=0){
    const g=new THREE.Group(),metalM=material('paintedMetal',0x59676b,{seed:31}),dark=material('metal',0x444a4a);g.add(box(5.35,2.45,2.42,metalM,[0,1.225,0]));for(let xx=-2.45;xx<=2.45;xx+=.34){g.add(box(.035,2.25,2.46,dark,[xx,1.25,0]));}for(const zz of [-1.22,1.22]){g.add(box(2.45,.06,.04,dark,[1.25,1.5,zz]));g.add(box(2.45,.06,.04,dark,[-1.25,.75,zz]));}g.rotation.y=rot;g.position.set(x,0,z);return addAsset(w,g,{x,z,y:0,w:5.5,d:2.55,h:2.5,climbable:true,walkableTop:true,name:'Ribbed sea can'});
  }

  function buildFence(w,x,z,length,axis='x',style='wood'){
    const g=new THREE.Group(),matr=style==='metal'?material('galvanized',0x828784):material('wood',0x78583b,{seed:12});const count=Math.max(2,Math.ceil(length/1.45));for(let i=0;i<count;i++){const t=i/(count-1),px=axis==='x'?-length/2+t*length:0,pz=axis==='z'?-length/2+t*length:0;g.add(box(.1,1.1,.1,matr,[px,.55,pz]));}if(axis==='x'){g.add(box(length,.08,.08,matr,[0,.45,0]));g.add(box(length,.08,.08,matr,[0,.82,0]));}else{g.add(box(.08,.08,length,matr,[0,.45,0]));g.add(box(.08,.08,length,matr,[0,.82,0]));}g.position.set(x,0,z);return addAsset(w,g,{x,z,y:0,w:axis==='x'?length:.14,d:axis==='x'?.14:length,h:1.1,climbable:true,name:'Fence'});
  }

  function buildGrassPatch(w,x,z,s=1,{count=12,color=0x4e7444}={}){
    const g=new THREE.Group(),matr=material('grass',color,{seed:Math.round((x+31)*17+(z+13)*23)});const rr=rng(Math.abs(Math.round(x*91+z*47))+17);
    for(let i=0;i<count;i++){const blade=mesh(new THREE.ConeGeometry(.025*s,(.22+rr()*.28)*s,4),matr,[(rr()-.5)*.85*s,.12*s,(rr()-.5)*.85*s],[0,rr()*TAU,(rr()-.5)*.12]);g.add(blade)}
    g.userData.ambientSway={phase:(Math.abs(x*.33+z*.47)%TAU),amount:.035};g.position.set(x,0,z);w.group.add(g);return g;
  }

  function buildBush(w,x,z,s=1,color=0x4d7748){
    const g=new THREE.Group(),leaf1=material('grass',color,{seed:Math.round(x*21+z*37)}),leaf2=material('grass',shadeHex(color,.12),{seed:9});
    for(let i=0;i<7;i++){const a=i/7*TAU,r=.24+(i%3)*.08;g.add(sphere((.22+(i%2)*.07)*s,i%2?leaf1:leaf2,[Math.cos(a)*r*s,(.26+(i%3)*.1)*s,Math.sin(a)*r*s],[1.1,.8,1]))}
    g.userData.ambientSway={phase:(Math.abs(x*.52+z*.29)%TAU),amount:.018};g.position.set(x,0,z);w.group.add(g);return g;
  }

  function buildRockCluster(w,x,z,s=1){
    const g=new THREE.Group(),rock=material('stone',0x77766e,{seed:Math.round(x*19+z*11)});for(let i=0;i<4;i++){const a=i/4*TAU,r=.22+i*.05,m=mesh(new THREE.DodecahedronGeometry((.18+i*.035)*s,1),rock,[Math.cos(a)*r*s,(.12+i*.025)*s,Math.sin(a)*r*s],[i*.3,i*.5,0],[1.2,.7,.9]);g.add(m)}g.position.set(x,0,z);w.group.add(g);return g;
  }

  function buildBench(w,x,z,rot=0){
    const g=new THREE.Group(),wood=material('wood',0x7f6042,{seed:71}),steel=material('paintedMetal',0x48504e,{seed:3});g.add(box(1.55,.09,.42,wood,[0,.52,0]));g.add(box(1.55,.62,.08,wood,[0,.86,.18],[-.12,0,0]));for(const sx of [-.58,.58]){g.add(tubeBetween([sx,.08,-.14],[sx,.5,-.14],.035,steel));g.add(tubeBetween([sx,.08,.14],[sx,.5,.14],.035,steel));}g.rotation.y=rot;g.position.set(x,0,z);return addAsset(w,g,{x,z,y:0,w:1.7,d:.62,h:1.18,climbable:true,name:'Bench'});
  }

  function buildPlanter(w,x,z,rot=0,{width=.9,color=0x6d5845,flowers=true}={}){
    const g=new THREE.Group(),pot=material('stone',color,{seed:14}),soil=material('dirt',0x4d3928,{seed:17}),leaf=material('grass',0x4c7b4d,{seed:19});g.add(box(width,.42,.48,pot,[0,.21,0]));g.add(box(width*.86,.06,.38,soil,[0,.44,0]));for(let i=0;i<7;i++){const xx=-width*.34+i*width*.11,z0=(i%2?-.09:.08);g.add(capsule(.018,.3,leaf,[xx,.62,z0],[0,0,(i%3-1)*.08],[.7,1,.7]));if(flowers)g.add(sphere(.045,material('fabric',[0xd97872,0xe2b85d,0x9a78b8,0xe9ddd0][i%4]),[xx,.82,z0],[1,.7,1]))}g.rotation.y=rot;g.position.set(x,0,z);w.group.add(g);return g;
  }

  function buildLampPost(w,x,z,h=2.35,{warm=true,activeLight=false,intensity=.62,distance=5.4}={}){
    const g=new THREE.Group(),steel=material('paintedMetal',0x31383a,{seed:2}),lightColor=warm?0xffd69a:0xc5ddff,bulb=new THREE.MeshStandardMaterial({color:warm?0xffe7b5:0xddeeff,emissive:warm?0xffc766:0x9cc8ff,emissiveIntensity:2.25,roughness:.28});g.add(cylinder(.035,.055,h,steel,[0,h/2,0],[],10));g.add(box(.28,.11,.28,steel,[0,h+.02,0]));g.add(sphere(.105,bulb,[0,h-.08,0],[1,.8,1]));if(activeLight){const lamp=new THREE.PointLight(lightColor,intensity,distance,2);lamp.position.set(0,h-.16,0);lamp.castShadow=false;g.add(lamp);g.userData.ambientLamp={light:lamp,baseIntensity:intensity}}g.position.set(x,0,z);w.group.add(g);return g;
  }

  function buildCeilingFan(w,x,z,y=2.55,scale=1){
    const g=new THREE.Group(),steel=material('paintedMetal',0x393f40,{seed:7}),wood=material('paintedWood',0x6c543f,{seed:12});g.add(cylinder(.035,.04,.24,steel,[0,-.12,0]));const rotor=new THREE.Group();rotor.position.y=-.25;for(let i=0;i<4;i++){const a=i/4*TAU,blade=box(.62*scale,.025,.11*scale,wood,[Math.cos(a)*.31*scale,0,Math.sin(a)*.31*scale],[0,-a,0]);rotor.add(blade)}rotor.add(cylinder(.08,.1,.08,steel,[0,0,0]));rotor.userData.ambientSpin={axis:'y',speed:2.2,phase:(x+z)%TAU};g.add(rotor);g.position.set(x,y,z);w.group.add(g);return g;
  }

  function buildToolRack(w,x,z,rot=0){
    const g=new THREE.Group(),board=material('pegboard',0x957655,{seed:45}),steel=material('metal',0x8b918e);g.add(box(1.4,.85,.05,board,[0,.62,0]));for(let i=0;i<6;i++){const xx=-.52+i*.21,len=.28+(i%3)*.08;g.add(tubeBetween([xx,.8,-.04],[xx+.04*(i%2?1:-1),.8-len,-.04],.018,steel));}g.rotation.y=rot;g.position.set(x,0,z);w.group.add(g);return g;
  }

  function buildCabinet(w,x,z,rot=0,{width=1.15,height=1.65,color=0x5c6465}={}){
    const g=new THREE.Group(),body=material('paintedMetal',color,{seed:26}),steel=material('metal',0xa2a6a2);g.add(box(width,height,.45,body,[0,height/2,0]));for(const sx of [-width*.24,width*.24]){g.add(box(width*.44,height*.9,.025,material('paintedMetal',shadeHex(color,.04)),[sx,height*.52,-.238]));g.add(cylinder(.012,.012,.16,steel,[sx+(sx<0?.12:-.12),height*.55,-.27],[],8));}g.rotation.y=rot;g.position.set(x,0,z);return addAsset(w,g,{x,z,y:0,w:width,d:.5,h:height,name:'Storage cabinet'});
  }

  function buildStringLights(w,points,y=2.35){
    if(!points?.length)return null;const g=new THREE.Group(),wire=material('rubber',0x232323),bulbColors=[0xffd487,0xffa970,0x9bd4ff,0xe9a7c2];
    for(let i=1;i<points.length;i++){const a=points[i-1],b=points[i];g.add(tubeBetween([a[0],y,a[1]],[b[0],y,b[1]],.008,wire));const dist=Math.hypot(b[0]-a[0],b[1]-a[1]),n=Math.max(2,Math.round(dist/.65));for(let k=0;k<=n;k++){const t=k/n,xx=a[0]+(b[0]-a[0])*t,zz=a[1]+(b[1]-a[1])*t,matr=new THREE.MeshStandardMaterial({color:bulbColors[(i+k)%bulbColors.length],emissive:bulbColors[(i+k)%bulbColors.length],emissiveIntensity:1.3,roughness:.3});g.add(sphere(.028,matr,[xx,y-.04-Math.sin(t*Math.PI)*.08,zz]))}}
    w.group.add(g);return g;
  }

  function buildAmbientParticles(w,{x=0,z=0,y=1.2,width=6,depth=6,height=2,count=32,color=0xffe7bd,opacity=.32,kind='dust'}={}){
    const rr=rng(Math.abs(Math.round(x*101+z*131))+31),pos=new Float32Array(count*3);for(let i=0;i<count;i++){pos[i*3]=(rr()-.5)*width;pos[i*3+1]=rr()*height;pos[i*3+2]=(rr()-.5)*depth}const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.BufferAttribute(pos,3));const matp=new THREE.PointsMaterial({color,size:kind==='pollen'?.035:.024,transparent:true,opacity,depthWrite:false,sizeAttenuation:true});const pts=new THREE.Points(geo,matp);pts.position.set(x,y,z);pts.userData.ambientParticles={baseY:y,phase:rr()*TAU,kind};w.group.add(pts);return pts;
  }

  function buildFountain(w,x,z,scale=1){
    const g=new THREE.Group(),stone=material('stone',0xa29b88,{seed:64}),darkStone=material('stone',0x79756c,{seed:65}),water=new THREE.MeshPhysicalMaterial({color:0x6fb6c5,transparent:true,opacity:.72,roughness:.16,metalness:0,transmission:.08});
    g.add(cylinder(1.15*scale,1.28*scale,.28*scale,darkStone,[0,.14*scale,0],[],32));g.add(torus(.92*scale,.13*scale,stone,[0,.34*scale,0],[Math.PI/2,0,0],Math.PI*2));
    const basin=cylinder(.88*scale,.88*scale,.055*scale,water,[0,.34*scale,0],[],32);basin.userData.waterSurface={baseY:.34*scale,phase:(x+z)*.21};g.add(basin);
    g.add(cylinder(.13*scale,.18*scale,1.05*scale,stone,[0,.84*scale,0],[],18));g.add(cylinder(.42*scale,.48*scale,.12*scale,stone,[0,1.25*scale,0],[],24));const upper=cylinder(.34*scale,.34*scale,.035*scale,water,[0,1.32*scale,0],[],24);upper.userData.waterSurface={baseY:1.32*scale,phase:1.7};g.add(upper);
    for(let i=0;i<6;i++){const a=i/6*TAU;g.add(sphere(.035*scale,water,[Math.sin(a)*.45*scale,1.05*scale,Math.cos(a)*.45*scale],[.7,1.8,.7]))}
    g.position.set(x,0,z);return addAsset(w,g,{x,z,y:0,w:2.7*scale,d:2.7*scale,h:1.4*scale,name:'Plaza fountain'});
  }

  function buildBeachUmbrella(w,x,z,rot=0,scale=1){
    const g=new THREE.Group(),pole=material('wood',0x86684c,{seed:84}),clothA=material('fabric',0xf1d5a0,{seed:85}),clothB=material('fabric',0x76a9ad,{seed:86});g.add(cylinder(.028,.035,1.85*scale,pole,[0,.925*scale,0],[],10));
    for(let i=0;i<8;i++){const a=i/8*TAU,seg=new THREE.Mesh(new THREE.ConeGeometry(.82*scale,.42*scale,3,1,false,a,TAU/8),i%2?clothA:clothB);seg.position.y=1.82*scale;seg.rotation.y=a;g.add(seg)}
    const chairMat=material('fabric',0xd5c6aa,{seed:87}),steel=material('metal',0x9b9d98);for(const side of [-1,1]){const cx=side*.72*scale;g.add(box(.52*scale,.045*scale,.72*scale,chairMat,[cx,.28*scale,.15*scale],[.12,0,0]));for(const sx of [-.18,.18])g.add(tubeBetween([cx+sx*scale,.05*scale,-.1*scale],[cx+sx*scale,.52*scale,.4*scale],.018*scale,steel))}
    g.rotation.y=rot;g.position.set(x,0,z);w.group.add(g);return g;
  }

  function buildMarketStall(w,x,z,rot=0,{color=0xc97361,width=2.25}={}){
    const g=new THREE.Group(),wood=material('wood',0x76583d,{seed:90}),cloth=material('fabric',color,{seed:91});g.add(box(width,.12,.72,wood,[0,.72,0]));for(const sx of [-width*.43,width*.43]){g.add(box(.08,1.95,.08,wood,[sx,.98,.3]));g.add(box(.08,1.95,.08,wood,[sx,.98,-.3]))}g.add(box(width+.18,.08,.92,cloth,[0,1.9,0],[0,0,.03]));
    for(let i=0;i<6;i++){const a=(i%3-1)*.42,row=Math.floor(i/3);g.add(sphere(.095,material('paintedWood',row?0xd9a755:0xb85e4f,{seed:95+i}),[a,.83,row?-.16:.14],[1,.85,1]))}
    g.rotation.y=rot;g.position.set(x,0,z);return addAsset(w,g,{x,z,y:0,w:width+ .25,d:1.0,h:2.0,name:'Market stall'});
  }

  function buildNoticeBoard(w,x,z,rot=0,{titleColor=0x35615e}={}){
    const g=new THREE.Group(),wood=material('wood',0x74583d,{seed:101}),board=material('paintedWood',0xd6c69e,{seed:102}),trim=material('paintedMetal',titleColor,{seed:103});for(const sx of [-.72,.72])g.add(box(.08,1.45,.08,wood,[sx,.72,0]));g.add(box(1.65,1.02,.12,board,[0,1.15,0]));g.add(box(1.72,.18,.14,trim,[0,1.72,0]));for(let i=0;i<5;i++){const xx=(i%3-.95)*.48,yy=1.42-Math.floor(i/3)*.42;g.add(box(.38,.28,.01,material('paintedWood',[0xf0e2c5,0xd4e4db,0xead2bd][i%3],{seed:110+i}),[xx,yy,-.067],[0,0,(i%2?-.03:.02)]))}g.rotation.y=rot;g.position.set(x,0,z);return addAsset(w,g,{x,z,y:0,w:1.8,d:.3,h:1.85,name:'Notice board'});
  }

  function buildMailbox(w,x,z,rot=0,{color=0x557a77}={}){
    const g=new THREE.Group(),post=material('wood',0x76583d,{seed:121}),metal=material('paintedMetal',color,{seed:122});g.add(box(.1,1.05,.1,post,[0,.525,0]));g.add(box(.5,.34,.62,metal,[0,1.08,0]));g.add(cylinder(.25,.25,.5,metal,[0,1.25,-.06],[0,0,Math.PI/2],16));g.add(box(.04,.38,.04,material('paintedMetal',0xb75e4e),[.28,1.2,-.1]));g.rotation.y=rot;g.position.set(x,0,z);w.group.add(g);return g;
  }

  function buildPartyArch(w,x,z,rot=0,{width=3.2,height=2.7}={}){
    const g=new THREE.Group(),gold=material('paintedMetal',0xc8a458,{seed:131}),cols=[0xd96668,0x6b94c0,0xe5bd55,0x8c72a8,0x75a876];for(const sx of [-width/2,width/2])g.add(cylinder(.045,.055,height,gold,[sx,height/2,0],[],10));g.add(tubeBetween([-width/2,height,0],[width/2,height,0],.045,gold));for(let i=0;i<13;i++){const t=i/12,xx=-width/2+t*width,yy=height+.22+Math.sin(t*Math.PI)*.32,c=cols[i%cols.length];const b=sphere(.13,material('fabric',c,{roughness:.45}),[xx,yy,0],[.9,1.08,.9]);b.userData.ambientBob={baseY:yy,phase:i*.47,speed:1.05,amount:.018};g.add(b)}g.rotation.y=rot;g.position.set(x,0,z);w.group.add(g);return g;
  }

  function buildAmbientBirds(w,{x=0,z=0,y=6,radius=5,count=5,color=0x2d3436}={}){
    const g=new THREE.Group(),matb=material('rubber',color);for(let i=0;i<count;i++){const bird=new THREE.Group(),a=i/count*TAU,left=new THREE.Group(),right=new THREE.Group();left.add(tubeBetween([-.13,0,0],[0,.02,0],.012,matb));right.add(tubeBetween([0,.02,0],[.13,0,0],.012,matb));left.userData.ambientWing={phase:i*.73,side:-1};right.userData.ambientWing={phase:i*.73+.2,side:1};bird.add(left,right);bird.add(sphere(.022,matb,[0,.01,-.025],[.9,.7,1.25]));bird.position.set(Math.cos(a)*radius,Math.sin(i*1.7)*.45,Math.sin(a)*radius);bird.rotation.y=-a;g.add(bird)}g.position.set(x,y,z);g.userData.ambientSpin={axis:'y',speed:.08,phase:(x+z)*.1};w.group.add(g);return g;
  }

  function buildDetailedTree(w,x,z,s=1,kind='spruce'){
    const g=new THREE.Group(),trunk=material('wood',0x59402d,{seed:Math.round(x*13+z*17)}),leaf1=material('paintedWood',kind==='spruce'?0x385b3f:0x47794c,{roughness:.92}),leaf2=material('paintedWood',kind==='spruce'?0x476d48:0x5b8c59,{roughness:.94}),crownGroup=new THREE.Group();g.add(cylinder(.13*s,.2*s,2.35*s,trunk,[0,1.175*s,0],[],14));g.add(crownGroup);
    if(kind==='spruce'){for(let i=0;i<4;i++){const crown=mesh(new THREE.ConeGeometry((.92-i*.1)*s,(1.55-i*.05)*s,10),i%2?leaf1:leaf2,[0,(1.65+i*.45)*s,0]);crownGroup.add(crown)}}else{for(let i=0;i<5;i++){const a=i/5*TAU;crownGroup.add(sphere(.62*s,i%2?leaf1:leaf2,[Math.cos(a)*.35*s,(2.25+(i%2)*.2)*s,Math.sin(a)*.35*s],[1,.82,1]));}}
    crownGroup.userData.ambientSway={phase:((Math.abs(x)*.37+Math.abs(z)*.61)%6.28),amount:kind==='spruce'?.018:.026};
    g.position.set(x,0,z);return addAsset(w,g,{x,z,y:0,w:.55*s,d:.55*s,h:2.45*s,name:'Tree'});
  }

  function buildPropZapper(scale=1){
    const g=new THREE.Group(),body=material('paintedMetal',0x59636a,{seed:5}),dark=material('rubber',0x202427),accent=material('paintedMetal',0x98533e,{seed:7}),steel=material('metal',0x929794),energy=new THREE.MeshStandardMaterial({color:0x77c7d0,emissive:0x37a9b7,emissiveIntensity:1.8,roughness:.24,metalness:.18});
    g.add(box(.18,.18,.38,body,[0,0,-.08]));g.add(box(.15,.17,.23,dark,[0,-.02,.24],[.1,0,0]));g.add(box(.09,.27,.12,dark,[0,-.19,.02],[-.18,0,0]));
    const barrel=cylinder(.032,.038,.38,steel,[0,.015,-.48],[Math.PI/2,0,0],12);g.add(barrel);for(let i=0;i<3;i++)g.add(torus(.065,.015,accent,[0,.015,-.31-i*.09],[Math.PI/2,0,0]));
    const coil=cylinder(.045,.045,.18,energy,[0,.015,-.71],[Math.PI/2,0,0],16);g.add(coil);g.add(torus(.082,.018,steel,[0,.015,-.82],[Math.PI/2,0,0]));g.add(cylinder(.055,.07,.08,accent,[0,.015,-.88],[Math.PI/2,0,0],16));
    g.add(box(.075,.07,.12,accent,[0,.13,-.2]));g.add(box(.035,.035,.29,steel,[.12,.02,-.08]));const muzzle=new THREE.Object3D();muzzle.position.set(0,.015,-.94);g.add(muzzle);g.userData.muzzle=muzzle;g.userData.leftGrip=new THREE.Vector3(-.08,-.02,-.38);g.userData.rightGrip=new THREE.Vector3(0,-.17,.01);g.scale.setScalar(scale);return g;
  }

  function buildHumanRig(style={},opts={}){
    const g=new THREE.Group(),id=opts.id||'person',skin=material('skin',style.skin||0xd3a47f,{roughness:.83}),top=material('fabric',style.top||0x6e3340,{seed:hashString(id)}),legs=material('fabric',style.legs||0x3c536b,{seed:hashString(id)+2}),boots=material('leather',style.boots||0x493728,{seed:hashString(id)+4}),hairM=material('hair',style.hair||0x433027,{roughness:.93}),dark=material('rubber',0x26211e),belt=material('leather',0x493626,{seed:3});g.name=`human-${id}`;
    const hips=new THREE.Group();hips.position.y=.82;g.add(hips);const pelvis=sphere(.28,legs,[0,.02,0],[1.03,.55,.78]);hips.add(pelvis);hips.add(box(.48,.07,.28,belt,[0,.16,0]));
    const upperBody=new THREE.Group();upperBody.position.y=.92;g.add(upperBody);const torso=sphere(.47,top,[0,.31,0],[.64,.82,.46]);upperBody.add(torso);upperBody.add(box(.54,.19,.31,top,[0,.03,0]));
    const neck=cylinder(.075,.09,.12,skin,[0,.72,0]);upperBody.add(neck);const head=sphere(.225,skin,[0,.94,0],[.93,1.03,.92]);upperBody.add(head);
    for(const sx of [-.205,.205])upperBody.add(sphere(.048,skin,[sx,.94,0],[.55,1,.65]));
    const hair=sphere(.229,hairM,[0,1.005,.014],[.96,.62,.95]);upperBody.add(hair);if(['vanessa','elizabeth','holly','dorothy'].includes(id)){for(const sx of [-.18,.18])upperBody.add(capsule(.055,.3,hairM,[sx,.78,.09],[0,0,.05*sx],[.75,1,.75]));}
    const face=new THREE.Group(),eyes=[],brows=[],eyeWhite=material('paintedMetal',0xf3eee4,{roughness:.52});face.position.set(0,.94,-.204);for(const sx of [-.072,.072]){const eye=new THREE.Group();eye.position.set(sx,.035,-.012);eye.add(sphere(.026,eyeWhite,[0,0,0],[1,.72,.48]));eye.add(sphere(.011,dark,[0,-.001,-.021],[1,.95,.55]));eyes.push(eye);face.add(eye);const brow=box(.055,.012,.012,hairM,[sx,.072,-.01],[0,0,sx>0?-.08:.08]);brows.push(brow);face.add(brow)}const nose=mesh(new THREE.ConeGeometry(.025,.06,10),skin,[0,-.005,-.04],[-Math.PI/2,0,0]);face.add(nose);const mouth=box(.082,.012,.012,material('paintedMetal',0x7d493f),[0,-.078,-.02]);face.add(mouth);const lowerLip=box(.062,.008,.009,material('paintedMetal',0x9b6258),[0,-.088,-.022]);face.add(lowerLip);upperBody.add(face);
    // Clothing construction: collar, placket, pocket and belt buckle give the body readable front/back orientation at gameplay distance.
    const trim=material('fabric',shadeHex(style.top||0x6e3340,.16),{seed:hashString(id)+8});
    upperBody.add(box(.14,.035,.018,trim,[-.075,.63,-.255],[0,0,-.32]));upperBody.add(box(.14,.035,.018,trim,[.075,.63,-.255],[0,0,.32]));
    upperBody.add(box(.022,.28,.015,trim,[0,.45,-.258]));upperBody.add(box(.15,.12,.015,trim,[.17,.39,-.258]));
    hips.add(box(.07,.085,.025,material('metal',0xb8a56f),[0,.17,-.155]));
    const arm=(side)=>{const shoulder=new THREE.Group();shoulder.position.set(side*.34,.52,0);const shoulderCap=sphere(.09,top,[0,0,0]);shoulder.add(shoulderCap);const upper=cylinder(.065,.075,.38,top,[0,-.19,0]);shoulder.add(upper);const elbow=new THREE.Group();elbow.position.y=-.38;shoulder.add(elbow);const cuff=cylinder(.057,.062,.045,trim,[0,-.025,0]);elbow.add(cuff);const lower=cylinder(.052,.062,.34,skin,[0,-.17,0]);elbow.add(lower);const hand=sphere(.068,skin,[0,-.36,0],[.88,1,.8]);elbow.add(hand);const thumb=sphere(.025,skin,[side*.055,-.35,-.02],[.7,1,.7]);elbow.add(thumb);upperBody.add(shoulder);return{shoulder,elbow,hand,thumb}};
    const leg=(side)=>{const hip=new THREE.Group();hip.position.set(side*.145,.83,0);const upper=cylinder(.082,.096,.42,legs,[0,-.21,0]);hip.add(upper);const knee=new THREE.Group();knee.position.y=-.42;hip.add(knee);const lower=cylinder(.07,.08,.39,legs,[0,-.195,0]);knee.add(lower);const foot=new THREE.Group();foot.position.set(0,-.41,-.06);foot.add(box(.17,.12,.26,boots,[0,0,-.04]));foot.add(sphere(.085,boots,[0,-.005,-.15],[1,.72,1.2]));knee.add(foot);g.add(hip);return{hip,knee,foot}};
    const leftArm=arm(-1),rightArm=arm(1),leftLeg=leg(-1),rightLeg=leg(1);
    for(const L of [leftLeg,rightLeg])L.foot.add(box(.17,.025,.27,material('rubber',0x292826),[0,-.072,-.04]));
    const weaponAnchor=new THREE.Group();weaponAnchor.position.set(.14,.32,-.28);upperBody.add(weaponAnchor);const weapon=buildPropZapper(.68);weaponAnchor.add(weapon);weapon.visible=opts.role==='hunter';
    g.userData.parts={hips,upperBody,torso,head,face,eyes,brows,mouth,lowerLip,hair,leftArm,rightArm,leftLeg,rightLeg,weaponAnchor,weapon};g.userData.rigKind='procedural-human';tagRig(g);return g;
  }

  function buildDogRig(style={},opts={}){
    const g=new THREE.Group(),id=opts.id||'dog',fur=material('hair',style.fur||0x81705f,{roughness:.94}),accent=material('hair',style.accent||0xc7aa89,{roughness:.92}),dark=material('rubber',0x26221f),harnessM=material('fabric',0x385253,{seed:6});g.name=`dog-${id}`;
    const chest=sphere(.35,fur,[0,.62,-.12],[1.0,.9,1.05]);g.add(chest);const body=capsule(.27,.48,fur,[0,.58,.18],[Math.PI/2,0,0],[1.0,1.0,1.05]);g.add(body);const haunch=sphere(.31,fur,[0,.58,.45],[1.02,.9,1.0]);g.add(haunch);const neck=capsule(.15,.22,fur,[0,.73,-.4],[.42,0,0]);g.add(neck);const head=sphere(.27,fur,[0,.86,-.58],[.95,1,.94]);g.add(head);const muzzle=sphere(.15,accent,[0,.8,-.82],[.82,.62,1.1]);g.add(muzzle);g.add(sphere(.052,dark,[0,.82,-.95],[1,.8,1]));const jaw=new THREE.Group();jaw.position.set(0,.77,-.84);jaw.add(sphere(.11,accent,[0,0,0],[.82,.38,1]));const tongue=box(.055,.012,.11,material('fabric',0xc97878),[0,-.045,-.075],[.2,0,0]);tongue.visible=false;jaw.add(tongue);g.add(jaw);const eyes=[];for(const sx of [-.105,.105]){const eye=sphere(.024,dark,[sx,.9,-.8]);eyes.push(eye);g.add(eye)}
    const ears=[];for(const sx of [-.18,.18]){const earPivot=new THREE.Group();earPivot.position.set(sx,1.04,-.54);const ear=mesh(new THREE.ConeGeometry(.09,.28,10),fur,[0,0,0],[.1,0,sx<0?.28:-.28]);earPivot.add(ear);g.add(earPivot);ears.push(earPivot)}
    const legs=[];for(const sx of [-.23,.23])for(const zz of [-.23,.35]){const upperPivot=new THREE.Group();upperPivot.position.set(sx,.48,zz);const upper=cylinder(.052,.065,.28,fur,[0,-.14,0]);upperPivot.add(upper);const lowerPivot=new THREE.Group();lowerPivot.position.y=-.28;upperPivot.add(lowerPivot);const lower=cylinder(.045,.052,.25,fur,[0,-.125,0]);lowerPivot.add(lower);lowerPivot.add(sphere(.07,accent,[0,-.27,-.02],[1,.55,1.3]));g.add(upperPivot);legs.push({upper:upperPivot,lower:lowerPivot,front:zz<0,side:sx<0?-1:1})}
    const tailPivot=new THREE.Group();tailPivot.position.set(0,.68,.68);const tail=capsule(.035,.38,fur,[0,.18,.08],[-.55,0,0],[1,1,1]);tailPivot.add(tail);g.add(tailPivot);
    g.add(box(.58,.11,.48,harnessM,[0,.88,.08]));g.add(box(.66,.08,.08,harnessM,[0,.69,-.1]));g.add(box(.13,.12,.035,material('metal',0xb8a56f),[0,.91,-.245]));const weaponAnchor=new THREE.Group();weaponAnchor.position.set(0,.98,-.05);g.add(weaponAnchor);const weapon=buildPropZapper(.46);weaponAnchor.add(weapon);weapon.visible=opts.role==='hunter';g.userData.parts={body,chest,head,muzzle,jaw,tongue,eyes,ears,legs,tailPivot,weaponAnchor,weapon};g.userData.rigKind='procedural-dog';tagRig(g);return g;
  }

  function tagRig(g){g.traverse(o=>{if(o.isMesh){o.castShadow=true;o.receiveShadow=true;o.userData.actorHit=true}})}

  function createPropMesh(type,d={}){
    const g=new THREE.Group(),col=d.color||0x777777,metal=material('paintedMetal',col,{seed:hashString(type)}),wood=material('wood',col,{seed:hashString(type)+4}),rub=material('rubber',0x202222),steel=material('metal',0x8b918e),fabric=material('fabric',col,{seed:hashString(type)+8});
    const bw=d.w||.5,bd=d.d||.5,bh=d.h||.5;
    const add=o=>{g.add(o);return o};
    switch(type){
      case 'Bucket':case 'Feed Bucket':case 'Mud Bucket':{add(cylinder(bw*.42,bw*.5,bh*.9,metal,[0,bh*.45,0],[],20));add(torus(bw*.42,.018,steel,[0,bh*.72,0],[Math.PI/2,0,0],Math.PI));break}
      case 'Oil Jug':case 'Water Jug':{add(box(bw*.7,bh*.82,bd*.82,metal,[0,bh*.42,0]));add(cylinder(.04,.04,bh*.28,metal,[bw*.27,bh*.75,0]));add(torus(.09,.025,metal,[-bw*.16,bh*.77,0],[0,Math.PI/2,0],Math.PI*1.35));add(cylinder(.055,.065,.08,material('rubber',0x222323),[bw*.27,bh*.92,0]));break}
      case 'Gas Can':{add(box(bw*.82,bh*.82,bd*.82,metal,[0,bh*.43,0]));add(box(bw*.42,.07,bd*.18,metal,[0,bh*.87,0]));add(cylinder(.035,.04,.22,steel,[bw*.3,bh*.76,0],[0,0,-.65]));break}
      case 'Toolbox':{add(box(bw,bh*.72,bd,metal,[0,bh*.36,0]));add(box(bw*.96,bh*.25,bd*.96,material('paintedMetal',shadeHex(col,.08)),[0,bh*.82,0]));add(torus(.14,.024,steel,[0,bh*1.03,0],[Math.PI/2,0,0],Math.PI));break}
      case 'Welding Helmet':{add(mesh(new THREE.SphereGeometry(bw*.5,20,12,0,TAU,0,Math.PI*.67),material('paintedMetal',col),[0,bh*.48,0],[0,0,0],[1,.95,.82]));add(box(bw*.55,bh*.28,.025,material('glass',0x31535c,{opacity:.6}),[0,bh*.58,-bd*.42]));break}
      case 'Shop Vac':{add(cylinder(bw*.42,bw*.43,bh*.65,metal,[0,bh*.36,0],[],20));add(cylinder(bw*.47,bw*.47,bh*.12,material('rubber',0x242828),[0,bh*.72,0],[],20));add(torus(bw*.2,.025,rub,[0,bh*.92,0],[0,0,Math.PI/2],Math.PI));break}
      case 'Coffee Mug':{add(cylinder(bw*.4,bw*.34,bh*.82,material('paintedMetal',col),[0,bh*.41,0],[],20));add(torus(bw*.28,.025,material('paintedMetal',col),[bw*.35,bh*.48,0],[0,Math.PI/2,0],Math.PI*1.55));break}
      case 'Beer Case':{add(box(bw,bh*.72,bd,material('paintedWood',col),[0,bh*.36,0]));for(let xx=-bw*.32;xx<=bw*.32;xx+=bw*.22)for(let zz=-bd*.25;zz<=bd*.25;zz+=bd*.3)add(cylinder(.035,.035,bh*.32,steel,[xx,bh*.82,zz],[],10));break}
      case 'Stool':{add(cylinder(bw*.42,bw*.42,.08,wood,[0,bh-.04,0],[],20));for(const sx of [-.14,.14])for(const sz of [-.14,.14])add(tubeBetween([sx,.05,sz],[sx,bh-.08,sz],.025,steel));break}
      case 'Sawhorse':{add(box(bw,.1,bd*.25,wood,[0,bh-.06,0]));for(const sx of [-bw*.32,bw*.32]){add(tubeBetween([sx*.7,0,-bd*.3],[sx,bh-.12,0],.035,wood));add(tubeBetween([sx*.7,0,bd*.3],[sx,bh-.12,0],.035,wood));}break}
      case 'Extension Cord':{add(torus(bw*.36,.045,material('rubber',col),[0,bh*.45,0],[Math.PI/2,0,0]));add(torus(bw*.28,.04,material('rubber',col),[0,bh*.46,0],[Math.PI/2,0,0]));break}
      case 'Hay Bale':{add(box(bw,bh,bd,material('hay',col,{seed:8}),[0,bh/2,0]));for(const xx of [-bw*.25,bw*.25])add(box(.025,bh+.02,bd+.02,material('rubber',0x6b5436),[xx,bh/2,0]));break}
      case 'Wheelbarrow':{const bowl=mesh(new THREE.SphereGeometry(.45,18,10,0,TAU,0,Math.PI*.55),metal,[0,bh*.54,-.04],[Math.PI,0,0],[1,.5,.72]);add(bowl);add(torus(.16,.045,rub,[-bw*.42,.19,0],[0,Math.PI/2,0]));for(const zz of [-bd*.25,bd*.25])add(tubeBetween([.05,.36,zz],[bw*.62,.45,zz],.025,steel));break}
      case 'Garbage Can':case 'Feed Barrel':{add(cylinder(bw*.48,bw*.43,bh*.88,metal,[0,bh*.44,0],[],22));add(cylinder(bw*.52,bw*.52,bh*.08,material('paintedMetal',shadeHex(col,-.1)),[0,bh*.92,0],[],22));break}
      case 'Parts Crate':case 'Egg Crate':{add(box(bw,bh,bd,wood,[0,bh/2,0]));for(const sx of [-bw*.4,bw*.4])add(box(.05,bh+.02,bd+.02,material('wood',shadeHex(col,-.15)),[sx,bh/2,0]));break}
      case 'Lumber':case 'Firewood':{const count=type==='Lumber'?6:7;for(let i=0;i<count;i++){const row=Math.floor(i/3),zz=(i%3-1)*bd*.28;if(type==='Lumber')add(box(bw,.075,bd*.22,wood,[0,.05+row*.08,zz]));else add(cylinder(.055,.075,bw*.78,wood,[0,.08+row*.11,zz],[0,0,Math.PI/2],10));}break}
      case 'Camp Chair':{for(const sx of [-bw*.37,bw*.37]){add(tubeBetween([sx,0,-bd*.34],[sx,bh*.72,bd*.28],.018,steel));add(tubeBetween([sx,0,bd*.34],[sx,bh*.72,-bd*.28],.018,steel));}add(box(bw*.72,.035,bd*.65,fabric,[0,bh*.47,0],[.18,0,0]));add(box(bw*.72,bh*.42,.035,fabric,[0,bh*.68,bd*.25],[-.18,0,0]));break}
      case 'Cooler':case 'Camp Bin':{add(box(bw,bh*.82,bd,material('paintedMetal',col),[0,bh*.41,0]));add(box(bw*.98,bh*.17,bd*1.03,material('paintedMetal',shadeHex(col,.12)),[0,bh*.91,0]));add(torus(bw*.35,.02,steel,[0,bh*.72,0],[0,0,Math.PI/2],Math.PI));break}
      case 'Lantern':{add(cylinder(bw*.34,bw*.42,bh*.24,metal,[0,bh*.12,0],[],18));add(cylinder(bw*.3,bw*.3,bh*.42,material('glass',0xf9d994,{opacity:.46}),[0,bh*.46,0],[],18));add(cylinder(bw*.38,bw*.34,bh*.12,metal,[0,bh*.75,0],[],18));add(torus(bw*.42,.018,steel,[0,bh*.8,0],[0,0,Math.PI/2],Math.PI));break}
      case 'Dog Toy':{add(sphere(bw*.5,material('rubber',col),[0,bh*.5,0]));break}
      case 'Card Box':{add(box(bw,bh,bd,material('paintedWood',col),[0,bh/2,0]));add(box(bw*.78,.01,bd*.82,material('paintedWood',shadeHex(col,.18)),[0,bh+.006,0]));break}
      case 'Rock':{const rock=mesh(new THREE.DodecahedronGeometry(bw*.52,1),material('stone',col),[0,bh*.48,0],[0,.4,0],[1,.72,.9]);add(rock);break}
      case 'Flower Pot':{add(cylinder(bw*.38,bw*.5,bh*.55,material('concrete',col),[0,bh*.28,0],[],18));for(let i=0;i<4;i++){const a=i/4*TAU;add(sphere(bw*.25,material('paintedWood',0x4c7b4d),[Math.cos(a)*.12,bh*.75,Math.sin(a)*.12],[.7,1.2,.7]));}break}
      case 'Watering Can':{add(cylinder(bw*.34,bw*.38,bh*.75,metal,[0,bh*.38,0],[],18));add(torus(bw*.4,.025,metal,[0,bh*.68,0],[0,0,Math.PI/2],Math.PI));add(tubeBetween([bw*.25,bh*.45,0],[bw*.72,bh*.58,0],.035,metal));break}
      case 'Tire':{add(torus(bw*.38,bw*.13,rub,[0,bh*.5,0],[0,Math.PI/2,0]));break}
      case 'Trough':{add(box(bw,.12,bd,material('galvanized',col),[0,.06,0]));for(const sx of [-bw*.46,bw*.46])add(box(.08,bh,bd,material('galvanized',col),[sx,bh/2,0]));for(const sz of [-bd*.45,bd*.45])add(box(bw-.1,bh,.06,material('galvanized',col),[0,bh/2,sz]));break}
      case 'Pallet':{for(let i=-2;i<=2;i++)add(box(bw/5*.78,.07,bd,wood,[i*bw/5,.16,0]));for(const zz of [-bd*.35,0,bd*.35])add(box(bw,.08,.09,wood,[0,.06,zz]));break}
      case 'Feed Sack':{add(sphere(bw*.55,fabric,[0,bh*.47,0],[.78,1.18,.62]));add(torus(bw*.16,.018,material('rubber',0x6b5438),[0,bh*.85,0],[Math.PI/2,0,0]));break}
      default:{add(box(bw,bh,bd,metal,[0,bh/2,0]));}
    }
    g.userData.propType=type;g.traverse(o=>{if(o.isMesh){o.castShadow=true;o.receiveShadow=true}});return g;
  }



  /**
   * Lightweight visual door. Collision is intentionally owned by the building
   * opening, while this hinge only communicates that the doorway is being used.
   * Passing a player to animateAmbience() makes it open before the camera reaches it.
   */
  function buildSwingDoor(w,x,z,rot=0,{width=.92,height=2.05,color=0x76583f,openDistance=2.35,openAngle=1.28,glass=false,label='Door'}={}){
    const hinge=new THREE.Group(),panel=new THREE.Group(),wood=material('paintedWood',color,{seed:Math.round((x+z)*41)+61}),trim=material('paintedWood',shadeHex(color,.12),{seed:9}),metal=material('metal',0xb7a46d);
    panel.position.x=-width/2;panel.add(box(width,height,.075,wood,[width/2,height/2,0]));panel.add(box(width*.78,.055,.09,trim,[width/2,height*.22,-.006]));panel.add(box(width*.78,.055,.09,trim,[width/2,height*.78,-.006]));panel.add(box(.055,height*.68,.09,trim,[width*.22,height*.5,-.006]));panel.add(box(.055,height*.68,.09,trim,[width*.78,height*.5,-.006]));
    if(glass)panel.add(box(width*.5,height*.36,.02,material('glass',0xa9d2dc,{opacity:.32}),[width*.5,height*.62,-.052]));
    panel.add(sphere(.045,metal,[width*.83,height*.48,-.075]));hinge.add(panel);hinge.position.set(x,0,z);hinge.rotation.y=rot;hinge.userData.proximityDoor={panel,x,z,openDistance,openAngle,current:0,label};w.group.add(hinge);return hinge;
  }

  function buildWallPoster(w,x,z,y=1.45,rot=0,{width=.7,height=.95,color=0x8d6347,accent=0xe4c26b}={}){
    const g=new THREE.Group(),frame=material('wood',0x4e3929,{seed:77}),paper=material('paintedWood',color,{seed:79,roughness:.8}),ink=material('paintedMetal',accent,{roughness:.7});
    g.add(box(width+.08,height+.08,.035,frame,[0,0,0]));g.add(box(width,height,.018,paper,[0,0,-.027]));g.add(box(width*.62,.055,.01,ink,[0,height*.2,-.043]));for(let i=0;i<4;i++)g.add(box(width*(.45-i*.04),.025,.01,material('paintedMetal',0x342f2b,{roughness:.82}),[0,height*.04-i*.095,-.043]));g.position.set(x,y,z);g.rotation.y=rot;w.group.add(g);return g;
  }

  function buildCloudLayer(w,{x=0,z=0,y=16,radius=22,count=7}={}){
    const g=new THREE.Group(),cloudMat=new THREE.MeshStandardMaterial({color:0xf5f4ed,transparent:true,opacity:.2,roughness:1,depthWrite:false});
    for(let i=0;i<count;i++){const c=new THREE.Group(),a=i/count*TAU,r=radius*(.62+(i%3)*.12);for(let q=0;q<4;q++)c.add(sphere(.8+q*.14,cloudMat,[(q-1.5)*.72,Math.sin(q)*.12,0],[1.45,.62,1]));c.position.set(Math.cos(a)*r,(i%2)*1.3,Math.sin(a)*r);g.add(c)}
    g.position.set(x,y,z);g.userData.ambientSpin={axis:'y',speed:.018,phase:(x+z)*.01};w.group.add(g);return g;
  }

  function buildButterflies(w,{x=0,z=0,y=.65,width=6,depth=5,count=7,color=0xe5ad5c}={}){
    const g=new THREE.Group(),matb=material('fabric',color,{roughness:.5});for(let i=0;i<count;i++){const b=new THREE.Group(),rr=rng(i*97+Math.round(x*11+z*13)+5),left=box(.08,.008,.055,matb,[-.055,0,0],[0,0,.18]),right=box(.08,.008,.055,matb,[.055,0,0],[0,0,-.18]);left.userData.ambientWing={phase:i*.61,side:-1,speed:10};right.userData.ambientWing={phase:i*.61+.15,side:1,speed:10};b.add(left,right);b.position.set((rr()-.5)*width,rr()*.65,(rr()-.5)*depth);b.userData.ambientBob={baseY:b.position.y,phase:rr()*TAU,speed:.75+rr()*.45,amount:.18};b.userData.ambientDrift={phase:rr()*TAU,amount:.12+rr()*.12};g.add(b)}g.position.set(x,y,z);w.group.add(g);return g;
  }

  /** Small pooled contact effects for footsteps and landings. */
  function createMotionFxSystem(scene,{color=0xb5a58c,max=20}={}){
    const pool=[],geo=new THREE.CircleGeometry(.12,12);geo.rotateX(-Math.PI/2);
    for(let i=0;i<max;i++){const mat=new THREE.MeshBasicMaterial({color,transparent:true,opacity:0,depthWrite:false,side:THREE.DoubleSide}),m=new THREE.Mesh(geo,mat);m.visible=false;m.renderOrder=2;scene.add(m);pool.push({mesh:m,life:0,maxLife:.42,vy:0})}
    let cursor=0;
    const emit=(x,y,z,{strength=.4,kind='step'}={})=>{const p=pool[cursor++%pool.length],heavy=kind==='land';p.life=p.maxLife=heavy?.58:.34;p.vy=heavy?.045:.02;p.mesh.visible=true;p.mesh.position.set(x,y+.012,z);p.mesh.scale.setScalar((heavy?.8:.45)+strength*(heavy?.85:.38));p.mesh.material.opacity=heavy?.3:.18};
    const update=dt=>{for(const p of pool){if(p.life<=0)continue;p.life-=dt;if(p.life<=0){p.mesh.visible=false;p.mesh.material.opacity=0;continue}const t=1-p.life/p.maxLife;p.mesh.scale.multiplyScalar(1+dt*(p.maxLife>.5?1.4:.9));p.mesh.position.y+=p.vy*dt;p.mesh.material.opacity=(p.maxLife>.5?.3:.18)*(1-t)}};
    const dispose=()=>{for(const p of pool){scene.remove(p.mesh);p.mesh.material.dispose()}geo.dispose()};return{emit,update,dispose};
  }

  function animateFire(root,time){root?.traverse?.(o=>{if(o.userData?.flamePhase!=null){const s=1+Math.sin(time*8+o.userData.flamePhase)*.09;o.scale.y=s;o.rotation.z=Math.sin(time*5+o.userData.flamePhase)*.06}});if(root?.userData?.fireLight)root.userData.fireLight.intensity=2.7+Math.sin(time*9)*.35;}

  // Tiny ambient motion sells depth without physics overhead. Only visual child groups move,
  // so collision stays deterministic and multiplayer positions do not drift with foliage/water.
  function animateAmbience(root,time,context={}){
    root?.traverse?.(o=>{
      const sway=o.userData?.ambientSway;if(sway){o.rotation.z=Math.sin(time*.78+sway.phase)*sway.amount;o.rotation.x=Math.sin(time*.51+sway.phase*.73)*sway.amount*.42}
      const water=o.userData?.waterSurface;if(water){o.position.y=water.baseY+Math.sin(time*1.8+water.phase)*.009;o.rotation.z=Math.sin(time*.72+water.phase)*.0025;o.rotation.x=Math.cos(time*.61+water.phase)*.0025}
      const spin=o.userData?.ambientSpin;if(spin){o.rotation[spin.axis||'y']=time*(spin.speed||1)+(spin.phase||0)}
      const bob=o.userData?.ambientBob;if(bob){o.position.y=bob.baseY+Math.sin(time*(bob.speed||1)+(bob.phase||0))*(bob.amount||.03)}
      const particles=o.userData?.ambientParticles;if(particles){o.position.y=particles.baseY+Math.sin(time*.34+particles.phase)*.06;o.rotation.y=time*.025+particles.phase}
      const wing=o.userData?.ambientWing;if(wing){o.rotation.z=(wing.side||1)*(.12+Math.sin(time*(wing.speed||6.4)+(wing.phase||0))*.32)}
      const drift=o.userData?.ambientDrift;if(drift){o.position.x+=Math.sin(time*.31+drift.phase)*(drift.amount||.1)*.002;o.position.z+=Math.cos(time*.27+drift.phase)*(drift.amount||.1)*.002}
      const door=o.userData?.proximityDoor;if(door?.panel){const player=context.player,near=player?Math.hypot((player.x||0)-door.x,(player.z||0)-door.z)<door.openDistance:false,target=near?-door.openAngle:0;door.current+=(target-door.current)*(1-Math.exp(-7*Math.max(.001,context.dt||.016)));door.panel.rotation.y=door.current}
      const lamp=o.userData?.ambientLamp;if(lamp?.light&&Number.isFinite(context.nightFactor)){lamp.light.intensity=lamp.baseIntensity*Math.max(.08,Math.min(1,context.nightFactor*.92+.08))}
    });
    animateFire(root,time);
  }

  return {
    material,makeTexture,addRaycast,addCollider,addAsset,tubeBetween,box,sphere,cylinder,capsule,torus,
    slatWall,buildWorkbench,buildToolChest,buildShelving,buildLumberStack,buildCrate,buildTractor,buildMotorcycle,buildFireplace,buildPapaChair,buildDrillPress,buildAirCompressor,buildWeldingCart,buildLadder,buildOverheadLight,buildBarnStall,buildPicnicTable,buildBBQ,buildTruck,buildTent,buildCampfire,buildTrailer,buildBoat,buildTrampoline,buildPool,buildHotTub,buildSeaCan,buildFence,buildGrassPatch,buildBush,buildRockCluster,buildBench,buildPlanter,buildLampPost,buildCeilingFan,buildToolRack,buildCabinet,buildStringLights,buildAmbientParticles,buildFountain,buildBeachUmbrella,buildMarketStall,buildNoticeBoard,buildMailbox,buildPartyArch,buildAmbientBirds,buildDetailedTree,buildSwingDoor,buildWallPoster,buildCloudLayer,buildButterflies,buildPropZapper,buildHumanRig,buildDogRig,createPropMesh,createMotionFxSystem,animateFire,animateAmbience,shadeHex
  };
}
