export const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
export const lerp=(a,b,t)=>a+(b-a)*t;
export const lerpAngle=(a,b,t)=>{let d=wrapAngle(b-a);return a+d*t};
export const wrapAngle=a=>{while(a>Math.PI)a-=Math.PI*2;while(a<-Math.PI)a+=Math.PI*2;return a};
export const dist2=(a,b)=>Math.hypot((a.x||0)-(b.x||0),(a.z||0)-(b.z||0));

export function verticalIntervalGap(aMin,aMax,bMin,bMax){
  if(aMax<bMin)return bMin-aMax;
  if(bMax<aMin)return aMin-bMax;
  return 0;
}

/** Choose a nearby prop without reaching through a floor/ceiling to another level. */
export function nearestReachableProp(actor,props,maxHorizontal=1.6,maxVerticalGap=.55){
  if(!actor)return null;let best=null,bestScore=Infinity;
  const actorMin=Number(actor.y)||0,actorMax=actorMin+(Number(actor.height)||1.72);
  for(const prop of props||[]){
    const horizontal=Math.hypot((Number(actor.x)||0)-(Number(prop.x)||0),(Number(actor.z)||0)-(Number(prop.z)||0));
    if(horizontal>maxHorizontal)continue;
    const propMin=Number(prop.y)||0,propMax=propMin+Math.max(.05,Number(prop.h)||.5);
    const verticalGap=verticalIntervalGap(actorMin,actorMax,propMin,propMax);
    if(verticalGap>maxVerticalGap)continue;
    const score=Math.hypot(horizontal,verticalGap*1.35);
    if(score<bestScore){best=prop;bestScore=score}
  }
  return best;
}

export function rayAabbDistance(origin,dir,box,maxDistance=Infinity){
  const min={x:box.x-box.w/2,y:box.y??0,z:box.z-box.d/2};
  const max={x:box.x+box.w/2,y:(box.y??0)+box.h,z:box.z+box.d/2};
  let tmin=0,tmax=maxDistance;
  for(const k of ['x','y','z']){
    const o=origin[k],d=dir[k],lo=min[k],hi=max[k];
    if(Math.abs(d)<1e-8){if(o<lo||o>hi)return null;continue}
    const inv=1/d;let t1=(lo-o)*inv,t2=(hi-o)*inv;
    if(t1>t2){const q=t1;t1=t2;t2=q}
    tmin=Math.max(tmin,t1);tmax=Math.min(tmax,t2);
    if(tmax<tmin)return null;
  }
  return tmin<=maxDistance?tmin:null;
}

export function cameraObstructionDistance(target,desired,colliders,padding=.18,volumeRadius=.16){
  const dx=desired.x-target.x,dy=desired.y-target.y,dz=desired.z-target.z;
  const len=Math.hypot(dx,dy,dz)||1,dir={x:dx/len,y:dy/len,z:dz/len};
  // Treat the camera as a small volume rather than a zero-width center ray. This
  // catches roof edges, awnings and wall corners that can otherwise clip one side
  // of a third-person camera while the center line remains clear.
  const planar=Math.hypot(dir.x,dir.z)||1;
  const right={x:dir.z/planar,y:0,z:-dir.x/planar};
  const up={x:-dir.x*dir.y/planar,y:planar,z:-dir.z*dir.y/planar};
  const r=Math.max(0,volumeRadius);
  const offsets=[
    {x:0,y:0,z:0},
    {x:right.x*r,y:0,z:right.z*r},{x:-right.x*r,y:0,z:-right.z*r},
    {x:up.x*r,y:up.y*r,z:up.z*r},{x:-up.x*r,y:-up.y*r,z:-up.z*r},
    {x:(right.x+up.x)*r*.7,y:up.y*r*.7,z:(right.z+up.z)*r*.7},
    {x:(right.x-up.x)*r*.7,y:-up.y*r*.7,z:(right.z-up.z)*r*.7},
    {x:(-right.x+up.x)*r*.7,y:up.y*r*.7,z:(-right.z+up.z)*r*.7},
    {x:(-right.x-up.x)*r*.7,y:-up.y*r*.7,z:(-right.z-up.z)*r*.7}
  ];
  let nearest=len;
  for(const o of offsets){
    const origin={x:target.x+o.x,y:target.y+o.y,z:target.z+o.z};
    for(const b of colliders){
      if(b.noCamera||b.blocksCamera===false||b.solid===false)continue;
      const t=rayAabbDistance(origin,dir,b,len);
      if(t!=null&&t<nearest)nearest=t;
    }
  }
  if(nearest>=len-1e-6)return len;
  return Math.max(.35,Math.min(len,nearest-padding));
}

export function lineOfSightClear(origin,target,colliders,padding=.04){
  const dx=target.x-origin.x,dy=target.y-origin.y,dz=target.z-origin.z;
  const len=Math.hypot(dx,dy,dz)||1,dir={x:dx/len,y:dy/len,z:dz/len};
  for(const b of colliders){
    if(b.noVision||b.blocksVision===false||b.solid===false)continue;
    const t=rayAabbDistance(origin,dir,b,len);
    if(t!=null&&t<len-padding)return false;
  }
  return true;
}

export function overlapsCircleAabb(x,z,r,b){
  const minX=b.x-b.w/2,maxX=b.x+b.w/2,minZ=b.z-b.d/2,maxZ=b.z+b.d/2;
  const qx=clamp(x,minX,maxX),qz=clamp(z,minZ,maxZ);
  const dx=x-qx,dz=z-qz;
  return dx*dx+dz*dz<r*r;
}

export function supportHeight(x,z,r,colliders,currentY,maxStep=.42){
  let support=0;
  for(const b of colliders){
    if(!b.walkableTop||b.blocksPlayer===false)continue;
    const top=(b.y??0)+b.h;
    if(top>currentY+maxStep+0.02)continue;
    if(x+r>b.x-b.w/2&&x-r<b.x+b.w/2&&z+r>b.z-b.d/2&&z-r<b.z+b.d/2)support=Math.max(support,top);
  }
  return support;
}


/** Multi-probe ground support for a circular character footprint. */
export function groundSupport(x,z,r,colliders,currentY,maxStep=.42){
  const rr=Math.max(.04,(Number(r)||.3)*.68),probes=[[0,0],[rr,0],[-rr,0],[0,rr],[0,-rr],[rr*.7,rr*.7],[-rr*.7,rr*.7],[rr*.7,-rr*.7],[-rr*.7,-rr*.7]];
  let best=0,bestCount=0,bestCenter=false;
  const levels=new Map();
  for(let pi=0;pi<probes.length;pi++){
    const [ox,oz]=probes[pi],px=x+ox,pz=z+oz;
    for(const b of colliders||[]){
      if(!b.walkableTop||b.blocksPlayer===false)continue;const top=(b.y??0)+b.h;if(top>currentY+maxStep+.02)continue;
      if(px>=b.x-b.w/2&&px<=b.x+b.w/2&&pz>=b.z-b.d/2&&pz<=b.z+b.d/2){const key=top.toFixed(4),rec=levels.get(key)||{height:top,count:0,center:false};rec.count++;if(pi===0)rec.center=true;levels.set(key,rec)}
    }
  }
  for(const rec of levels.values())if(rec.height>best&&((rec.center&&rec.count>=1)||rec.count>=2)){best=rec.height;bestCount=rec.count;bestCenter=rec.center}
  return{height:best,normal:{x:0,y:1,z:0},slope:0,walkable:true,probeCount:bestCount,centerSupported:bestCenter};
}

/** Validate a mantle landing on top of the collider before committing the move. */
export function mantleTarget(actor,block,dx,dz,colliders,opts={}){
  if(!actor||!block||!block.climbable||!block.walkableTop)return null;const radius=opts.radius??actor.radius??.32,height=opts.height??actor.height??1.72,top=(block.y??0)+block.h;
  const len=Math.hypot(dx,dz);if(len<1e-5)return null;const dirX=dx/len,dirZ=dz/len,pad=Math.max(.035,radius*.12);
  const minX=block.x-block.w/2+radius+pad,maxX=block.x+block.w/2-radius-pad,minZ=block.z-block.d/2+radius+pad,maxZ=block.z+block.d/2-radius-pad;if(minX>maxX||minZ>maxZ)return null;
  const tx=clamp(actor.x+dirX*(radius+.48),minX,maxX),tz=clamp(actor.z+dirZ*(radius+.48),minZ,maxZ),landingY=top+.015;
  const overhead=blockingCollider(tx,tz,radius,landingY,height,colliders,block);if(overhead)return null;
  const support=groundSupport(tx,tz,radius,colliders,landingY+.08,.16);if(Math.abs(support.height-top)>.08)return null;
  return{targetY:top,x:tx,z:tz,collider:block};
}

export function ceilingBottom(x,z,r,feetY,height,nextY,colliders){
  if(nextY<=feetY)return null;
  const oldHead=feetY+height,newHead=nextY+height;let nearest=null;
  for(const b of colliders){
    if(b.solid===false||b.blocksPlayer===false)continue;const bottom=b.y??0;
    if(bottom<oldHead-.015||bottom>newHead+.015)continue;
    if(overlapsCircleAabb(x,z,r,b))nearest=nearest==null?bottom:Math.min(nearest,bottom);
  }
  return nearest;
}

export function blockingCollider(x,z,r,feetY,height,colliders,ignore=null){
  const headY=feetY+height;
  for(const b of colliders){
    if(b===ignore||b.solid===false||b.blocksPlayer===false)continue;
    const bottom=b.y??0,top=bottom+b.h;
    if(headY<=bottom+.02||feetY>=top-.02)continue;
    if(overlapsCircleAabb(x,z,r,b))return b;
  }
  return null;
}

function attemptMoveStep(actor,dx,dz,colliders,opts={}){
  const radius=opts.radius??actor.radius??.32,height=opts.height??actor.height??1.72;
  const maxStep=opts.maxStep??.42,maxMantle=opts.maxMantle??1.15;
  const next={x:actor.x+dx,z:actor.z+dz,y:actor.y};
  const block=blockingCollider(next.x,next.z,radius,actor.y,height,colliders);
  if(!block)return {...next,mantle:null,blocked:false};
  const top=(block.y??0)+block.h,delta=top-actor.y;
  if(block.climbable&&block.walkableTop&&delta>maxStep&&delta<=maxMantle&&opts.jumpRequested){
    const mantle=mantleTarget(actor,block,dx,dz,colliders,{radius,height});if(mantle)return{x:actor.x,z:actor.z,y:actor.y,mantle,blocked:true};
  }
  if(delta>0&&delta<=maxStep&&block.walkableTop){
    const above=blockingCollider(next.x,next.z,radius,top+.01,height,colliders,block);
    if(!above)return {x:next.x,z:next.z,y:top,mantle:null,blocked:false,stepped:true};
  }
  let x=actor.x,z=actor.z;
  if(!blockingCollider(actor.x+dx,z,radius,actor.y,height,colliders))x=actor.x+dx;
  if(!blockingCollider(x,actor.z+dz,radius,actor.y,height,colliders))z=actor.z+dz;
  return {x,z,y:actor.y,mantle:null,blocked:true};
}

export function attemptCharacterMove(actor,dx,dz,colliders,opts={}){
  // Split long-frame movement into short pieces so a fast player cannot tunnel
  // through thin collision boxes during a hitch or low-FPS phone frame.
  const radius=opts.radius??actor.radius??.32;
  const distance=Math.hypot(dx,dz);
  const maxSubstep=opts.maxSubstep??Math.max(.075,Math.min(.18,radius*.45));
  const steps=Math.max(1,Math.ceil(distance/maxSubstep));
  let cur={...actor},blocked=false,stepped=false;
  for(let i=0;i<steps;i++){
    const r=attemptMoveStep(cur,dx/steps,dz/steps,colliders,opts);
    cur.x=r.x;cur.z=r.z;cur.y=r.y;
    blocked=blocked||!!r.blocked;stepped=stepped||!!r.stepped;
    if(r.mantle)return {...r,blocked:true,substeps:i+1};
  }
  return {x:cur.x,z:cur.z,y:cur.y,mantle:null,blocked,stepped,substeps:steps};
}

export function assignRoles(players,round=1){
  const sorted=[...players].sort((a,b)=>(a.seat??999)-(b.seat??999)||String(a.id).localeCompare(String(b.id)));
  const hunterCount=sorted.length<=5?1:2;
  const offset=Math.max(0,(round-1)*hunterCount)%Math.max(1,sorted.length);
  const hunterIds=new Set();
  for(let i=0;i<hunterCount&&i<sorted.length;i++)hunterIds.add(sorted[(offset+i)%sorted.length].id);
  return Object.fromEntries(sorted.map(p=>[p.id,hunterIds.has(p.id)?'hunter':'hider']));
}

export function sanitizeSnapshot(s,prev={}){
  const finite=(v,f=0)=>Number.isFinite(Number(v))?Number(v):f;
  return {
    x:clamp(finite(s.x,prev.x||0),-100,100),
    y:clamp(finite(s.y,prev.y||0),-10,50),
    z:clamp(finite(s.z,prev.z||0),-100,100),
    yaw:wrapAngle(finite(s.yaw,prev.yaw||0)),
    pitch:clamp(finite(s.pitch,prev.pitch||0),-.95,.8),
    vx:clamp(finite(s.vx,0),-20,20),
    vy:clamp(finite(s.vy,0),-30,30),
    vz:clamp(finite(s.vz,0),-20,20),
    anim:['idle','walk','jog','run','sprint','startMove','stopMove','turnLeft','turnRight','sharpTurnLeft','sharpTurnRight','turn180Left','turn180Right','backward','strafeLeft','strafeRight','jump','fall','land','hardLand','mantle','aim','fire','hit','celebrate'].includes(s.anim)?s.anim:'idle',
    prop:typeof s.prop==='string'?s.prop.slice(0,48):null,
    locked:!!s.locked,
    seq:Math.max(0,Math.floor(finite(s.seq,prev.seq||0))),
    at:Date.now()
  };
}

export function interpolateSnapshot(renderState,target,dt,speed=14){
  const t=1-Math.exp(-speed*Math.max(0,dt));
  renderState.x=lerp(renderState.x??target.x,target.x,t);
  renderState.y=lerp(renderState.y??target.y,target.y,t);
  renderState.z=lerp(renderState.z??target.z,target.z,t);
  renderState.yaw=lerpAngle(renderState.yaw??target.yaw,target.yaw,t);
  renderState.pitch=lerp(renderState.pitch??target.pitch,target.pitch,t);
  renderState.anim=target.anim;
  renderState.prop=target.prop;
  renderState.locked=target.locked;
  return renderState;
}

export function canServerRegisterHit(shooter,target,maxRange=22){
  if(!shooter||!target||shooter.role!=='hunter'||target.role!=='hider'||target.alive===false)return false;
  const dx=(shooter.live?.x??0)-(target.live?.x??0),dy=(shooter.live?.y??0)-(target.live?.y??0),dz=(shooter.live?.z??0)-(target.live?.z??0);
  return Math.hypot(dx,dy,dz)<=maxRange;
}

// Phase V: Papa's Shop world expansion and round variety contracts.
export const PAPA_DISGUISE_POOL=Object.freeze([
  'Coffee Mug','Extension Cord','Welding Helmet','Bucket','Oil Jug','Toolbox','Gas Can','Shop Vac','Beer Case','Stool',
  'Sawhorse','Feed Bucket','Hay Bale','Wheelbarrow','Garbage Can','Parts Crate','Lumber','Tire','Feed Barrel','Trough',
  'Pallet','Feed Sack','Rock','Tractor','Motorcycle','Papa Chair','Tool Chest','Air Compressor','Barrel Stack','Tree'
]);


export const MAP_DISGUISE_POOLS=Object.freeze({
  papa:PAPA_DISGUISE_POOL,
  camp:Object.freeze(['Camp Chair','Cooler','Lantern','Dog Toy','Card Box','Water Jug','Firewood','Camp Bin','Rock','Bucket','Tire','Pallet']),
  acreage:Object.freeze(['Flower Pot','Watering Can','Tire','Toolbox','Gas Can','Garbage Can','Camp Chair','Cooler','Rock','Pallet','Feed Bucket','Bucket']),
  farm:Object.freeze(['Feed Barrel','Trough','Hay Bale','Pallet','Feed Sack','Egg Crate','Feed Bucket','Mud Bucket','Garbage Can','Toolbox','Tire','Lumber'])
});
export function disguisePoolForMap(mapKey){return MAP_DISGUISE_POOLS[mapKey]||PAPA_DISGUISE_POOL}

export const PROP_SURVIVAL_RATES=Object.freeze({small:1,medium:1.35,large:1.8,giant:2.5});
const PROP_RISK=Object.freeze({
  'Coffee Mug':'small','Extension Cord':'small','Welding Helmet':'small','Bucket':'small','Oil Jug':'small','Toolbox':'medium','Gas Can':'medium','Shop Vac':'medium','Beer Case':'medium','Stool':'medium',
  'Sawhorse':'medium','Feed Bucket':'small','Hay Bale':'large','Wheelbarrow':'large','Garbage Can':'medium','Parts Crate':'medium','Lumber':'large','Tire':'medium','Feed Barrel':'medium','Trough':'large',
  'Pallet':'large','Feed Sack':'medium','Rock':'medium','Tractor':'giant','Motorcycle':'giant','Papa Chair':'large','Tool Chest':'large','Air Compressor':'large','Barrel Stack':'giant','Tree':'giant'
});

export function propRiskTier(type){return PROP_RISK[type]||'medium'}
export function propSurvivalRate(type){return PROP_SURVIVAL_RATES[propRiskTier(type)]||PROP_SURVIVAL_RATES.medium}

export function hashSeed(value){
  const s=String(value??'');let h=2166136261>>>0;
  for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}
  return h>>>0;
}
export function seededRandom(seed){
  let a=(Number(seed)>>>0)||0x6d2b79f5;
  return ()=>{a|=0;a=a+0x6d2b79f5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return ((t^t>>>14)>>>0)/4294967296};
}
export function pickUnique(items,count,rng=Math.random){
  const a=[...(items||[])],out=[];while(a.length&&out.length<count){const i=Math.floor(rng()*a.length);out.push(a.splice(i,1)[0])}return out;
}
export function assignDisguiseOptions(players,seed,pool=PAPA_DISGUISE_POOL,count=4){
  const result={};for(const p of players||[]){const rng=seededRandom(hashSeed(`${seed}:${p.id}:${p.seat??0}`));result[p.id]=pickUnique(pool,count,rng)}return result;
}

export const WEATHER_PRESETS=Object.freeze(['clear','sunset','overcast','light-rain','light-snow','fair-fog','windy']);
export function weatherForSeed(seed){const rng=seededRandom(hashSeed(`weather:${seed}`));return WEATHER_PRESETS[Math.floor(rng()*WEATHER_PRESETS.length)]}
export function layoutVariantForSeed(seed){const rng=seededRandom(hashSeed(`layout:${seed}`));return Math.floor(rng()*6)}

export function roundSeed(roomId,round,createdAt=0){return hashSeed(`${roomId}:${round}:${createdAt}`)}
