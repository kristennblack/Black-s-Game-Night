/*
 * Black Family Game Night - Shared 3D Gameplay System
 * v2.0.0
 *
 * PURPOSE
 * ------
 * The three free-moving 3D games use one movement/camera/animation language:
 * - Prop Hunt
 * - Family Island Life
 * - John's Birthday Seat
 *
 * This module intentionally contains no game rules. It owns the feel of moving
 * a family character through a 3D world: camera damping, input normalization,
 * gamepad support, character pose blending, mobile look/joystick handling and
 * conservative performance scaling for phones/tablets.
 */

export const GAMEPLAY_3D_VERSION='2.0.0';
export const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
export const damp=(current,target,lambda,dt)=>current+(target-current)*(1-Math.exp(-lambda*Math.max(0,dt)));
export const dampAngle=(current,target,lambda,dt)=>{
  let d=target-current;while(d>Math.PI)d-=Math.PI*2;while(d<-Math.PI)d+=Math.PI*2;
  return current+d*(1-Math.exp(-lambda*Math.max(0,dt)));
};

const CONTROL_PREF_KEY='black-family-3d-control-preferences-v1';
export function loadControlPreferences(){
  const base={lookScale:1,invertY:false,leftHanded:false};
  try{if(typeof localStorage==='undefined')return base;const raw=JSON.parse(localStorage.getItem(CONTROL_PREF_KEY)||'{}');return{lookScale:clamp(Number(raw.lookScale)||1,.65,1.5),invertY:!!raw.invertY,leftHanded:!!raw.leftHanded}}catch{return base}
}
export function saveControlPreferences(next={}){
  const prefs={...loadControlPreferences(),...next};prefs.lookScale=clamp(Number(prefs.lookScale)||1,.65,1.5);prefs.invertY=!!prefs.invertY;prefs.leftHanded=!!prefs.leftHanded;
  try{if(typeof localStorage!=='undefined')localStorage.setItem(CONTROL_PREF_KEY,JSON.stringify(prefs))}catch{}
  return prefs;
}
export function applyControlPreferences(cameraRig,layoutTarget,prefs=loadControlPreferences()){
  if(cameraRig?.state){cameraRig.state.lookScale=prefs.lookScale;cameraRig.state.invertY=prefs.invertY}
  layoutTarget?.classList?.toggle('g3d-left-handed',!!prefs.leftHanded);return prefs;
}

/**
 * Small cross-game control panel. Preferences intentionally live outside game rules,
 * so changing sensitivity in Island Life also feels correct next time Prop Hunt opens.
 */
export function mountControlPreferences(host,cameraRig,{layoutTarget=host,top='112px'}={}){
  if(typeof document==='undefined'||!host)return()=>{};
  const styleId='g3d-shared-control-style';if(!document.getElementById(styleId)){const st=document.createElement('style');st.id=styleId;st.textContent=`.g3d-control-button{position:absolute;right:14px;z-index:19;border:1px solid #ffffff35;border-radius:999px;background:#11120fbd;color:#fff;padding:7px 10px;font:900 9px/1 system-ui,sans-serif;letter-spacing:.06em;backdrop-filter:blur(7px);box-shadow:0 5px 14px #0006;touch-action:manipulation}.g3d-control-button:active{transform:scale(.96)}.g3d-control-panel{position:absolute;right:14px;z-index:50;width:min(280px,calc(100% - 28px));padding:12px;border:1px solid #ffffff32;border-radius:16px;background:#121310f2;color:#fff;box-shadow:0 16px 38px #0009;backdrop-filter:blur(12px);font:600 11px/1.35 system-ui,sans-serif}.g3d-control-panel[hidden]{display:none}.g3d-control-panel strong{display:block;font-size:12px;margin-bottom:8px}.g3d-control-panel label{display:grid;grid-template-columns:1fr auto;gap:9px;align-items:center;margin:9px 0}.g3d-control-panel input[type=range]{grid-column:1/-1;width:100%;accent-color:#d8b867}.g3d-control-panel input[type=checkbox]{width:20px;height:20px;accent-color:#d8b867}.g3d-control-panel .g3d-row{display:flex;gap:7px;justify-content:flex-end;margin-top:10px}.g3d-control-panel button{border:1px solid #ffffff28;border-radius:10px;background:#2a2a25;color:#fff;padding:7px 9px;font-weight:800}.g3d-control-panel small{display:block;color:#cfc8bc;margin-top:4px}@media(max-width:700px){.g3d-control-button{right:10px;padding:6px 9px}.g3d-control-panel{right:10px;width:min(270px,calc(100% - 20px))}}`;document.head.appendChild(st)}
  const button=document.createElement('button');button.type='button';button.className='g3d-control-button no-look';button.textContent='CTRL';button.setAttribute('aria-label','3D control settings');button.style.top=top;host.appendChild(button);
  const panel=document.createElement('section');panel.className='g3d-control-panel no-look';panel.hidden=true;panel.style.top=`calc(${top} + 34px)`;panel.innerHTML=`<strong>3D Controls</strong><small>These preferences follow you between Prop Hunt, Island Life and Birthday Seat.</small><label><span>Look sensitivity <b data-g3d-sens></b></span><input data-g3d-range type="range" min="0.65" max="1.5" step="0.05"></label><label><span>Invert vertical look</span><input data-g3d-invert type="checkbox"></label><label><span>Left-handed mobile layout</span><input data-g3d-left type="checkbox"></label><div class="g3d-row"><button type="button" data-g3d-reset>RESET</button><button type="button" data-g3d-close>DONE</button></div>`;host.appendChild(panel);
  const range=panel.querySelector('[data-g3d-range]'),sens=panel.querySelector('[data-g3d-sens]'),invert=panel.querySelector('[data-g3d-invert]'),left=panel.querySelector('[data-g3d-left]');
  let prefs=applyControlPreferences(cameraRig,layoutTarget,loadControlPreferences());
  const render=()=>{range.value=String(prefs.lookScale);sens.textContent=`${prefs.lookScale.toFixed(2)}x`;invert.checked=prefs.invertY;left.checked=prefs.leftHanded;applyControlPreferences(cameraRig,layoutTarget,prefs)};render();
  const persist=next=>{prefs=saveControlPreferences({...prefs,...next});render()};
  button.onclick=()=>{panel.hidden=!panel.hidden};range.oninput=()=>persist({lookScale:Number(range.value)});invert.onchange=()=>persist({invertY:invert.checked});left.onchange=()=>persist({leftHanded:left.checked});panel.querySelector('[data-g3d-reset]').onclick=()=>{prefs=saveControlPreferences({lookScale:1,invertY:false,leftHanded:false});render()};panel.querySelector('[data-g3d-close]').onclick=()=>{panel.hidden=true};
  return()=>{button.remove();panel.remove()};
}



/**
 * Smooth world-space attention into a small local head/eye aim offset.
 * This is intentionally independent of rendering technology: procedural rigs
 * use the returned yaw/pitch today and authored GLTF rigs can feed the same
 * values into neck/head look-at constraints later.
 */
export function updateAttention(actor,dt,target,{headHeight=1.55,maxDistance=7,maxYaw=.72,maxPitch=.34,rate=8}={}){
  if(!actor)return{yaw:0,pitch:0,weight:0};
  const a=actor._attention||(actor._attention={yaw:0,pitch:0,weight:0});
  let yaw=0,pitch=0,weight=0;
  if(target&&Number.isFinite(target.x)&&Number.isFinite(target.z)){
    const dx=target.x-(actor.x||0),dz=target.z-(actor.z||0),dy=(target.y??headHeight)-((actor.y||0)+headHeight),dist=Math.hypot(dx,dz);
    if(dist<=maxDistance&&dist>.04){let local=Math.atan2(dx,-dz)-(actor.yaw||0);while(local>Math.PI)local-=Math.PI*2;while(local<-Math.PI)local+=Math.PI*2;yaw=clamp(local,-maxYaw,maxYaw);pitch=clamp(Math.atan2(dy,dist),-maxPitch,maxPitch);weight=clamp(1-dist/maxDistance*.42,0,1)}
  }
  a.yaw=damp(a.yaw,yaw,rate,dt);a.pitch=damp(a.pitch,pitch,rate,dt);a.weight=damp(a.weight,weight,rate*.7,dt);return a;
}

/**
 * Turn interaction kinds into semantic body actions. The server still owns the
 * actual game rule; this function only describes how the body should communicate
 * that rule to the player.
 */
export function interactionAnimation(kind=''){
  const k=String(kind).toLowerCase();
  if(k==='forage'||k==='harvest'||k==='garden')return'harvest';
  if(k==='fish'||k==='fishing')return'fish';
  if(k==='craft'||k==='workplace'||k==='work'||k==='repair')return'work';
  if(k==='bed'||k==='chair'||k==='sit')return'sit';
  if(k==='food'||k==='eat'||k==='meal')return'eat';
  if(k==='drink'||k==='coffee'||k==='latte'||k==='smoothie')return'drink';
  if(k==='store'||k==='furniture'||k==='plaza'||k==='inspect')return'inspect';
  return'use';
}

/**
 * Convert distance-driven stride telemetry into discrete contact events. Games
 * can attach particles, audio or controller haptics without teaching the
 * locomotion system about a particular map or renderer.
 */
export function consumeMotionEvents(actor){
  const m=actor?._motion;if(!m)return[];const out=[];
  const step=Math.floor((m.stridePhase||0)/Math.PI);
  if(m.speed>.48&&actor.grounded!==false&&step!==actor._footstepIndex){actor._footstepIndex=step;out.push({type:'step',foot:(step&1)?'right':'left',strength:clamp(m.speed/4.8,.18,1)})}
  if((m.landing||0)>.24&&!actor._landingEvent){actor._landingEvent=true;out.push({type:'land',strength:clamp(m.landing,0,1)})}
  if((m.landing||0)<.08)actor._landingEvent=false;
  return out;
}

export const CONTROL_PRESETS=Object.freeze({
  propHunt:{
    walkSpeed:2.75,runSpeed:4.6,groundAccel:16.5,groundBrake:21,airControl:.31,
    jumpSpeed:6.15,gravity:18.5,cameraDistance:4.25,aimDistance:2.72,
    cameraHeight:1.4,shoulder:.52,fov:56,aimFov:47,sprintFov:62,
    lookSensitivity:.0048,touchLookSensitivity:.0054,minPitch:-.42,maxPitch:.66
  },
  island:{
    walkSpeed:2.55,runSpeed:4.35,groundAccel:15,groundBrake:20,airControl:.3,
    jumpSpeed:5.9,gravity:18,cameraDistance:4.45,aimDistance:3.2,
    cameraHeight:1.34,shoulder:.22,fov:58,aimFov:54,sprintFov:62,
    lookSensitivity:.0046,touchLookSensitivity:.0052,minPitch:-.38,maxPitch:.64
  },
  birthday:{
    walkSpeed:3.0,runSpeed:5.0,groundAccel:19,groundBrake:24,airControl:.48,
    jumpSpeed:6.65,gravity:18.2,cameraDistance:4.1,aimDistance:3.2,
    cameraHeight:1.34,shoulder:.18,fov:59,aimFov:55,sprintFov:65,
    lookSensitivity:.0048,touchLookSensitivity:.0055,minPitch:-.46,maxPitch:.66
  }
});

export function getControlPreset(name,overrides={}){
  return {...(CONTROL_PRESETS[name]||CONTROL_PRESETS.island),...overrides};
}

/** Camera-relative movement vector. The returned strength remains analog. */
export function movementIntent(keys,joy,yaw,{gamepad=true}={}){
  let x=((keys?.KeyD||keys?.ArrowRight)?1:0)-((keys?.KeyA||keys?.ArrowLeft)?1:0)+(joy?.x||0);
  let z=((keys?.KeyW||keys?.ArrowUp)?1:0)-((keys?.KeyS||keys?.ArrowDown)?1:0)+(joy?.z||0);
  if(gamepad&&typeof navigator!=='undefined'&&navigator.getGamepads){
    const pad=[...navigator.getGamepads()].find(Boolean);
    if(pad){
      const dead=.14,ax=Math.abs(pad.axes?.[0]||0)>dead?(pad.axes[0]||0):0,ay=Math.abs(pad.axes?.[1]||0)>dead?-(pad.axes[1]||0):0;
      x+=ax;z+=ay;
    }
  }
  const raw=Math.hypot(x,z),strength=clamp(raw,0,1);
  if(raw>.0001){x/=raw;z/=raw}else{x=0;z=0}
  const sy=Math.sin(yaw),cy=Math.cos(yaw),dirX=x*cy+z*sy,dirZ=x*sy-z*cy;
  // x/z intentionally preserve analog magnitude. A half-pushed stick now yields
  // a half-strength world vector rather than a normalized full-speed vector.
  return {x:dirX*strength,z:dirZ*strength,strength,directionX:dirX,directionZ:dirZ,rawX:x,rawZ:z};
}

export function smoothVelocity(actor,intent,speed,dt,{accel=18,brake=24,airControl=1}={}){
  const grounded=actor.grounded!==false,factor=grounded?1:airControl;
  const active=intent.strength>.045,targetX=(intent.x||0)*speed,targetZ=(intent.z||0)*speed;
  const rate=(active?accel:brake)*factor,t=1-Math.exp(-rate*Math.max(0,dt));
  actor.vx=(actor.vx||0)+(targetX-(actor.vx||0))*t;
  actor.vz=(actor.vz||0)+(targetZ-(actor.vz||0))*t;
  if(!active&&Math.hypot(actor.vx,actor.vz)<.025){actor.vx=0;actor.vz=0}
  return actor;
}

/**
 * Adds jump buffering and coyote time without changing game-specific collision.
 * Call updateJumpMemory each frame, then consumeBufferedJump before applying gravity.
 */
export function updateJumpMemory(actor,dt,jumpPressed){
  actor._jumpBuffer=Math.max(0,(actor._jumpBuffer||0)-dt);
  actor._coyote=Math.max(0,(actor._coyote||0)-dt);
  if(actor.grounded)actor._coyote=.11;
  if(jumpPressed)actor._jumpBuffer=.13;
}
export function consumeBufferedJump(actor,jumpSpeed){
  if((actor._jumpBuffer||0)>0&&((actor.grounded)||(actor._coyote||0)>0)){
    actor._jumpBuffer=0;actor._coyote=0;actor.vy=jumpSpeed;actor.grounded=false;return true;
  }
  return false;
}

/**
 * Variable jump height. Releasing jump early trims upward velocity instead of
 * forcing every jump to use the exact same arc. This makes phones/controllers
 * feel substantially less floaty without changing collision rules.
 */
export function applyVariableJump(actor,jumpHeld,{cutMultiplier=.56,minUpward=2.15}={}){
  if(!jumpHeld&&(actor?.vy||0)>minUpward)actor.vy*=cutMultiplier;
  return actor?.vy||0;
}

/** One shared decision for keyboard, touch-toggle and gamepad sprint. */
export function wantsSprint(keys,input,pad,intent,{autoAtFullStick=false}={}){
  return !!(keys?.ShiftLeft||keys?.ShiftRight||input?.sprint||pad?.sprint||(autoAtFullStick&&(intent?.strength||0)>.97));
}

/** Play a short semantic animation without the locomotion loop erasing it next frame. */
export function playTransientAnimation(actor,name,durationMs=900,now=Date.now()){
  if(!actor)return name;actor._transientAnim=name;actor._transientAnimUntil=now+Math.max(0,durationMs);actor.anim=name;return name;
}

/**
 * Start a readable world interaction and remember what the body is acting on.
 * The action target is deliberately gameplay-neutral: it can be a workbench,
 * berry bush, fishing spot, shop counter, bed or future authored prop.
 */
export function playContextAnimation(actor,name,target,durationMs=900,now=Date.now()){
  playTransientAnimation(actor,name,durationMs,now);
  if(actor&&target&&Number.isFinite(target.x)&&Number.isFinite(target.z)){actor._actionTarget={x:target.x,y:target.y,z:target.z};actor._actionTargetUntil=now+Math.max(0,durationMs)}
  return name;
}

/** Turn an idle/acting body toward the object it is actually using. */
export function updateContextFacing(actor,dt,{rate=11,now=Date.now(),movingThreshold=.32}={}){
  if(!actor)return 0;
  if(!actor._actionTarget||now>=(actor._actionTargetUntil||0)){actor._actionTarget=null;actor._actionTargetUntil=0;return actor.yaw||0}
  if(Math.hypot(actor.vx||0,actor.vz||0)>movingThreshold)return actor.yaw||0;
  const dx=actor._actionTarget.x-(actor.x||0),dz=actor._actionTarget.z-(actor.z||0);if(Math.hypot(dx,dz)<.04)return actor.yaw||0;
  actor.yaw=dampAngle(actor.yaw||0,Math.atan2(dx,-dz),rate,dt);return actor.yaw;
}

/** Semantic locomotion state used by every procedural and future authored rig. */
export function resolveLocomotionAnim(actor,{moving=false,sprinting=false,aiming=false,mantling=false,now=Date.now()}={}){
  if(actor?._transientAnim&&now<(actor._transientAnimUntil||0))return actor._transientAnim;
  if(actor?._transientAnim&&now>=(actor._transientAnimUntil||0)){actor._transientAnim=null;actor._transientAnimUntil=0}
  if(mantling||actor?.mantle)return 'mantle';
  if(actor?.grounded===false)return (actor?.vy||0)>0?'jump':'fall';
  if((actor?.landTimer||0)>0)return 'land';
  if(moving)return sprinting?'run':'walk';
  return aiming?'aim':'idle';
}

export function readGamepadButtons(){
  if(typeof navigator==='undefined'||!navigator.getGamepads)return{};
  const p=[...navigator.getGamepads()].find(Boolean);if(!p)return{};
  return {jump:!!p.buttons?.[0]?.pressed,interact:!!p.buttons?.[2]?.pressed,shoulder:!!p.buttons?.[4]?.pressed,aim:!!p.buttons?.[6]?.pressed,shoot:!!p.buttons?.[7]?.pressed,sprint:!!p.buttons?.[10]?.pressed};
}

export function applyGamepadLook(cameraState,dt,sensitivity=2.25){
  if(typeof navigator==='undefined'||!navigator.getGamepads)return;
  const p=[...navigator.getGamepads()].find(Boolean);if(!p)return;
  let x=p.axes?.[2]||0,y=p.axes?.[3]||0;const dead=.16;
  if(Math.abs(x)<dead)x=0;if(Math.abs(y)<dead)y=0;
  const scale=cameraState.lookScale||1,iy=cameraState.invertY?-1:1;cameraState.yaw-=x*sensitivity*scale*dt;cameraState.pitch=clamp(cameraState.pitch+y*sensitivity*.72*scale*iy*dt,cameraState.minPitch??-.4,cameraState.maxPitch??.65);
}

export function createThirdPersonCamera(THREE,camera,core,presetName='island',opts={}){
  const cfg=getControlPreset(presetName,opts),state={
    yaw:opts.yaw??Math.PI,pitch:opts.pitch??.18,distance:opts.distance??cfg.cameraDistance,
    targetDistance:opts.distance??cfg.cameraDistance,actualDistance:opts.distance??cfg.cameraDistance,
    shoulder:opts.shoulder??cfg.shoulder,shoulderSign:opts.shoulderSign??1,aim:false,sprinting:false,minPitch:cfg.minPitch,maxPitch:cfg.maxPitch,
    shake:0,recoilPitch:0,recoilYaw:0,targetReady:false,lookScale:1,invertY:false,effectiveShoulderSign:opts.shoulderSign??1
  };
  const temp={target:new THREE.Vector3(),smoothedTarget:new THREE.Vector3(),desired:new THREE.Vector3(),look:new THREE.Vector3(),pos:new THREE.Vector3(),velocity:new THREE.Vector3()};
  function rotate(dx,dy,{touch=false}={}){const s=(touch?cfg.touchLookSensitivity:cfg.lookSensitivity)*(state.lookScale||1),iy=state.invertY?-1:1;state.yaw-=dx*s;state.pitch=clamp(state.pitch+dy*s*iy,state.minPitch,state.maxPitch)}
  function zoom(delta){state.targetDistance=clamp(state.targetDistance+delta,2.25,7.5)}
  function swapShoulder(){state.shoulderSign*=-1;return state.shoulderSign}
  function recenter(actorYaw){state.yaw=dampAngle(state.yaw,actorYaw??state.yaw,20,1/30)}
  function kick(pitch=.035,yaw=0,shake=.04){state.recoilPitch+=pitch;state.recoilYaw+=yaw;state.shake=Math.max(state.shake,shake)}
  function update(target,colliders,dt,options={}){
    state.aim=!!options.aim;state.sprinting=!!options.sprinting;
    state.recoilPitch=damp(state.recoilPitch,0,13,dt);state.recoilYaw=damp(state.recoilYaw,0,15,dt);state.shake=damp(state.shake,0,12,dt);
    state.distance=damp(state.distance,state.targetDistance,10,dt);
    const desiredDist=state.aim?cfg.aimDistance:state.distance;
    const dog=!!options.dog,height=options.height??(dog?.73:cfg.cameraHeight),targetShoulder=(state.aim?state.shoulder:(options.shoulderAlways?state.shoulder:state.shoulder*.28))*state.shoulderSign;
    temp.target.set(target.x,target.y+height+(options.cameraBob||0),target.z);
    if(options.velocity){temp.velocity.set(options.velocity.x||0,0,options.velocity.z||0);const vlen=temp.velocity.length();if(vlen>.01)temp.target.addScaledVector(temp.velocity,Math.min(.12,.035*vlen));}
    if(!state.targetReady){temp.smoothedTarget.copy(temp.target);state.targetReady=true}else temp.smoothedTarget.lerp(temp.target,1-Math.exp(-18*dt));
    temp.target.copy(temp.smoothedTarget);
    const yaw=state.yaw+state.recoilYaw,pitch=state.pitch+state.recoilPitch,cp=Math.cos(pitch),sy=Math.sin(yaw),cy=Math.cos(yaw);
    const back=new THREE.Vector3(sy*cp,Math.sin(pitch)*.74,cy*cp),right=new THREE.Vector3(cy,0,-sy);
    temp.desired.copy(temp.target).addScaledVector(back,desiredDist).addScaledVector(right,targetShoulder);temp.desired.y+=.65;
    const td={x:temp.target.x,y:temp.target.y,z:temp.target.z};let dd={x:temp.desired.x,y:temp.desired.y,z:temp.desired.z};
    let hit=core?.cameraObstructionDistance?core.cameraObstructionDistance(td,dd,colliders||[],.2):temp.target.distanceTo(temp.desired),full=temp.target.distanceTo(temp.desired)||1,ratio=clamp(hit/full,0,1),effectiveShoulder=state.shoulderSign;
    // In tight rooms an aiming shoulder can be physically valid yet visually useless.
    // Try the opposite side only when the current side is substantially obstructed.
    if(state.aim&&options.autoShoulder!==false&&Math.abs(state.shoulder)>.05&&ratio<.74&&core?.cameraObstructionDistance){
      const opposite=temp.pos.copy(temp.target).addScaledVector(back,desiredDist).addScaledVector(right,-targetShoulder);opposite.y+=.65;const od={x:opposite.x,y:opposite.y,z:opposite.z},oppHit=core.cameraObstructionDistance(td,od,colliders||[],.2),oppFull=temp.target.distanceTo(opposite)||1,oppRatio=clamp(oppHit/oppFull,0,1);
      if(oppRatio>ratio+.16&&oppHit>hit+.3){temp.desired.copy(opposite);dd=od;hit=oppHit;full=oppFull;ratio=oppRatio;effectiveShoulder=-state.shoulderSign}
    }
    state.effectiveShoulderSign=effectiveShoulder;temp.pos.copy(temp.target).lerp(temp.desired,ratio);
    if(state.shake>.001){temp.pos.x+=(Math.random()-.5)*state.shake;temp.pos.y+=(Math.random()-.5)*state.shake*.65}
    camera.position.lerp(temp.pos,1-Math.exp(-(state.aim?19:15)*dt));
    temp.look.copy(temp.target).addScaledVector(right,state.aim?.16*state.effectiveShoulderSign:0);camera.lookAt(temp.look);
    const targetRoll=clamp(-(options.turnRate||0)*.0065,-.018,.018);camera.rotation.z=damp(camera.rotation.z||0,targetRoll,8,dt);
    const fov=state.aim?cfg.aimFov:state.sprinting?cfg.sprintFov:cfg.fov;camera.fov=damp(camera.fov||cfg.fov,fov,9,dt);camera.updateProjectionMatrix();
    state.actualDistance=temp.target.distanceTo(camera.position);return state;
  }
  return {state,cfg,rotate,zoom,swapShoulder,recenter,kick,update};
}

export function bindPointerLook(element,cameraRig,{ignoreSelector='button,select,input,a,.no-look'}={}){
  let id=null,lastX=0,lastY=0,moved=false;
  const down=e=>{if(e.pointerType==='mouse'&&e.button!==0)return;if(e.target?.closest?.(ignoreSelector))return;id=e.pointerId;lastX=e.clientX;lastY=e.clientY;moved=false;element.setPointerCapture?.(id)};
  const move=e=>{if(e.pointerId!==id)return;const dx=e.clientX-lastX,dy=e.clientY-lastY;lastX=e.clientX;lastY=e.clientY;if(Math.abs(dx)+Math.abs(dy)>1)moved=true;cameraRig.rotate(dx,dy,{touch:e.pointerType!=='mouse'})};
  const up=e=>{if(e.pointerId===id)id=null};
  element.addEventListener('pointerdown',down);element.addEventListener('pointermove',move);element.addEventListener('pointerup',up);element.addEventListener('pointercancel',up);
  const wheel=e=>cameraRig.zoom(Math.sign(e.deltaY)*.35);element.addEventListener('wheel',wheel,{passive:true});
  return ()=>{element.removeEventListener('pointerdown',down);element.removeEventListener('pointermove',move);element.removeEventListener('pointerup',up);element.removeEventListener('pointercancel',up);element.removeEventListener('wheel',wheel)};
}

export function bindVirtualJoystick(element,knob,joy,{deadzone=.08,travel=.34}={}){
  let id=null;
  const set=(x,z)=>{joy.x=x;joy.z=z;if(knob)knob.style.transform=`translate(${x*32}px,${-z*32}px)`};
  const update=e=>{const r=element.getBoundingClientRect(),x=e.clientX-(r.left+r.width/2),y=e.clientY-(r.top+r.height/2),raw=Math.hypot(x,y)/(r.width*travel),m=clamp((raw-deadzone)/(1-deadzone),0,1),a=Math.atan2(y,x);set(Math.cos(a)*m,-Math.sin(a)*m)};
  const down=e=>{id=e.pointerId;element.setPointerCapture?.(id);update(e)};
  const move=e=>{if(e.pointerId===id)update(e)};
  const end=e=>{if(e.pointerId!==id)return;id=null;set(0,0)};
  element.addEventListener('pointerdown',down);element.addEventListener('pointermove',move);element.addEventListener('pointerup',end);element.addEventListener('pointercancel',end);
  return ()=>{set(0,0);element.removeEventListener('pointerdown',down);element.removeEventListener('pointermove',move);element.removeEventListener('pointerup',end);element.removeEventListener('pointercancel',end)};
}

function poseBlend(obj,axis,target,rate,dt){if(!obj)return;obj.rotation[axis]=damp(obj.rotation[axis]||0,target,rate,dt)}
function posBlend(obj,axis,target,rate,dt){if(!obj)return;obj.position[axis]=damp(obj.position[axis]||0,target,rate,dt)}
function basePos(obj,axis,fallback=0){if(!obj)return fallback;obj.userData=obj.userData||{};if(!obj.userData._g3dBasePosition)obj.userData._g3dBasePosition={x:obj.position.x||0,y:obj.position.y||0,z:obj.position.z||0};const v=obj.userData._g3dBasePosition[axis];return Number.isFinite(v)?v:fallback}
function scaleBlend(obj,axis,target,rate,dt){if(!obj)return;obj.scale[axis]=damp(obj.scale[axis]||1,target,rate,dt)}

/**
 * Motion telemetry converts raw velocity into animation-friendly values.
 * Gait phase advances from distance travelled instead of wall-clock time, so
 * feet no longer cycle at the same speed while creeping, jogging and sprinting.
 */
export function updateMotionTelemetry(actor,dt,{speed=0,turnRate=0,grounded=actor?.grounded!==false,verticalSpeed=actor?.vy||0}={}){
  if(!actor)return null;
  const m=actor._motion||(actor._motion={speed:0,prevSpeed:0,accel:0,turn:0,stridePhase:Math.random()*Math.PI*2,idleTime:0,airTime:0,landing:0});
  const safeDt=Math.max(.001,Math.min(.05,dt||.016)),instantAccel=(speed-m.prevSpeed)/safeDt;
  m.speed=damp(m.speed,speed,12,safeDt);m.accel=damp(m.accel,instantAccel,8,safeDt);m.turn=damp(m.turn,turnRate||0,10,safeDt);m.prevSpeed=speed;
  if(speed>.06){m.stridePhase+=(speed*2.05+2.45)*safeDt;m.idleTime=0}else{m.stridePhase+=safeDt*.42;m.idleTime+=safeDt}
  if(!grounded)m.airTime+=safeDt;else{if(m.airTime>.12)m.landing=Math.min(1,.28+m.airTime*.48);m.airTime=0}
  m.landing=Math.max(0,m.landing-safeDt*4.6);m.vertical=verticalSpeed;return m;
}

/**
 * Shared hierarchical rig animator.
 * `actor.anim` is a semantic state, not a clip name. This keeps procedural rigs
 * and future GLTF rigs speaking the same gameplay language.
 */
export function animateFamilyRig(actor,dt,{aim=false,recoil=0,lookPitch=0,turnRate=0,speed=0,grounded=true,attention=null}={}){
  const rig=actor?.rig;if(!rig)return;const p=rig.userData?.parts||{},dog=!!p.legs&&!p.leftLeg;
  actor.animTime=(actor.animTime||0)+dt;
  const motion=updateMotionTelemetry(actor,dt,{speed,turnRate,grounded,verticalSpeed:actor.vy||0});
  const anim=actor.anim||'idle',moving=['walk','run'].includes(anim),run=anim==='run',phase=motion?.stridePhase||actor.animTime,moveAmount=run?.78:moving?.49:0;
  const speedFactor=clamp(speed/(run?4.5:2.7),.12,1.18),amount=moveAmount*(moving?speedFactor:1),bob=moving?Math.abs(Math.sin(phase*2))*(run?.034:.022):Math.sin(actor.animTime*1.55)*.004;
  const accelLean=clamp((motion?.accel||0)*.008,-.075,.085),turnLean=clamp((motion?.turn||turnRate||0)*.045,-.09,.09),landing=(motion?.landing||0);
  const idleShift=!moving&&anim==='idle'?Math.sin((motion?.idleTime||0)*.72+(String(actor.id||'').length*.53)):.0;
  // Sparse fidgets keep long idle moments alive without making characters twitch constantly.
  const fidgetClock=((motion?.idleTime||0)+String(actor.id||'').length*.73)%12.5,idleFidget=!moving&&anim==='idle'&&fidgetClock>10.7?Math.sin((fidgetClock-10.7)/1.8*Math.PI):0;
  // Procedural blink with a long quiet interval. Eyes are separate groups/meshes so only the face closes, never the whole head.
  const blinkWindow=(actor.animTime+(String(actor.id||'').length*.37))%4.7,blink=blinkWindow>4.55?.08:1;actor._blink=blink;(p.eyes||[]).forEach(e=>scaleBlend(e,'y',blink,35,dt));
  const breathing=1+Math.sin(actor.animTime*1.7+(String(actor.id||'').length*.21))*(moving?.003:.009);
  const idleGlance=!moving&&anim==='idle'?Math.sin(actor.animTime*.43+(String(actor.id||'').length*.61))*.065:0,attentionYaw=(attention?.yaw||0)*(attention?.weight??0),attentionPitch=(attention?.pitch||0)*(attention?.weight??0);
  (p.eyes||[]).forEach(e=>{poseBlend(e,'y',attentionYaw*.42,11,dt);poseBlend(e,'x',-attentionPitch*.25,11,dt)});
  const turnInPlace=!moving&&grounded?clamp((motion?.turn||turnRate||0)*.09,-.28,.28):0;
  if(p.torso){scaleBlend(p.torso,'y',breathing,6,dt);scaleBlend(p.torso,'x',2-breathing,6,dt)}
  if(dog){
    (p.legs||[]).forEach((leg,i)=>{const diagonal=(leg.front?1:-1)*(leg.side<0?1:-1),s=Math.sin(phase+diagonal*Math.PI*.48)*amount;poseBlend(leg.upper,'x',s,22,dt);poseBlend(leg.lower,'x',Math.max(0,-s)*.72-.09,22,dt)});
    if(p.body){posBlend(p.body,'y',basePos(p.body,'y',.58)+bob*.55,15,dt);poseBlend(p.body,'z',turnLean*.34,10,dt);poseBlend(p.body,'x',clamp(-accelLean*.55,-.055,.055),10,dt)}if(p.chest){posBlend(p.chest,'y',basePos(p.chest,'y',.62)+bob-landing*.018,15,dt);poseBlend(p.chest,'z',turnLean*.55,11,dt)}
    if(p.tailPivot){poseBlend(p.tailPivot,'x',-.5+Math.sin(actor.animTime*(run?9.5:5.2))*.25,12,dt);poseBlend(p.tailPivot,'y',Math.sin(actor.animTime*3.4)*.18,12,dt)}
    if(p.head){const sniff=!moving&&anim==='idle'&&((motion?.idleTime||0)%7.5)>5.9?Math.sin(((motion?.idleTime||0)-5.9)*2.4)*.14:0;poseBlend(p.head,'y',idleGlance+attentionYaw*.72+Math.sin(actor.animTime*.8)*.025-(motion?.turn||turnRate||0)*.07,10,dt);poseBlend(p.head,'x',clamp(lookPitch,-.25,.25)*.22+attentionPitch*.45+(moving?Math.sin(phase*2)*.014:0)+clamp(-(motion?.vertical||0)*.009,-.07,.07)+sniff,10,dt)}
    (p.ears||[]).forEach((ear,i)=>{poseBlend(ear,'z',(i?-.18:.18)+(moving?Math.sin(phase+i*Math.PI)*(.045+speedFactor*.035):Math.sin(actor.animTime*1.2+i)*.012),10,dt);poseBlend(ear,'x',moving?Math.sin(phase*2+i)*.025:0,10,dt)});
    if(p.jaw){const pant=anim==='pant'||(anim==='idle'&&!moving&&((motion?.idleTime||0)%10)>7.8);poseBlend(p.jaw,'x',pant?.16+Math.max(0,Math.sin(actor.animTime*5.6))*.06:0,14,dt);if(p.tongue){p.tongue.visible=pant;scaleBlend(p.tongue,'z',pant?1.1:1,12,dt)}}
    if(p.weaponAnchor){
      poseBlend(p.weaponAnchor,'x',recoil*.08,18,dt);
      poseBlend(p.weaponAnchor,'y',moving?Math.sin(phase)*.025:0,12,dt);
      posBlend(p.weaponAnchor,'y',basePos(p.weaponAnchor,'y',.98)+bob*.4,14,dt);
      posBlend(p.weaponAnchor,'z',basePos(p.weaponAnchor,'z',-.05)+recoil*.035,18,dt);
    }
    if(anim==='jump'||anim==='fall'){(p.legs||[]).forEach((leg,i)=>{poseBlend(leg.upper,'x',(leg.front?-.28:.22),14,dt);poseBlend(leg.lower,'x',.18,14,dt)})}
    if(anim==='sit'){if(p.body)posBlend(p.body,'y',basePos(p.body,'y',.58)-.15,12,dt);if(p.chest)posBlend(p.chest,'y',basePos(p.chest,'y',.62)-.04,12,dt);(p.legs||[]).forEach(leg=>{poseBlend(leg.upper,'x',leg.front?-.12:.72,14,dt);poseBlend(leg.lower,'x',leg.front?.04:-.55,14,dt)})}
    if(anim==='harvest'||anim==='work'||anim==='inspect'||anim==='use'){const paw=Math.max(0,Math.sin(actor.animTime*5));if(p.head)poseBlend(p.head,'x',.18+Math.sin(actor.animTime*2)*.025,12,dt);const front=(p.legs||[]).find(l=>l.front&&l.side>0)||(p.legs||[]).find(l=>l.front);if(front){poseBlend(front.upper,'x',-.42-paw*.22,16,dt);poseBlend(front.lower,'x',.2+paw*.12,16,dt)}}
    if(anim==='eat'||anim==='drink'){if(p.head)poseBlend(p.head,'x',.28+Math.sin(actor.animTime*3.4)*.035,12,dt);if(p.chest)poseBlend(p.chest,'x',.04,10,dt)}
    if(anim==='fish'){if(p.head){poseBlend(p.head,'x',-.05,12,dt);poseBlend(p.head,'y',attentionYaw*.9,12,dt)}if(p.tailPivot)poseBlend(p.tailPivot,'x',-.68+Math.sin(actor.animTime*2.1)*.08,10,dt)}
    if(anim==='wave'){const front=(p.legs||[]).find(l=>l.front&&l.side>0)||(p.legs||[]).find(l=>l.front);if(front){poseBlend(front.upper,'x',-.65,16,dt);poseBlend(front.lower,'x',-.2+Math.sin(actor.animTime*7)*.08,16,dt)}if(p.tailPivot)poseBlend(p.tailPivot,'y',Math.sin(actor.animTime*8)*.38,18,dt)}
    if(anim==='sleep'||anim==='lie'){if(p.body)posBlend(p.body,'y',basePos(p.body,'y',.58)-.27,14,dt);if(p.chest)posBlend(p.chest,'y',basePos(p.chest,'y',.62)-.28,14,dt);if(p.head){posBlend(p.head,'y',basePos(p.head,'y',.86)-.43,14,dt);poseBlend(p.head,'z',.16,10,dt)}(p.legs||[]).forEach(leg=>{poseBlend(leg.upper,'x',leg.front?.3:.6,14,dt);poseBlend(leg.lower,'x',-.45,14,dt)})}
    if(anim==='scratch'){const hind=(p.legs||[]).find(l=>!l.front&&l.side>0)||(p.legs||[]).find(l=>!l.front);if(hind){poseBlend(hind.upper,'x',-.9+Math.sin(actor.animTime*12)*.28,20,dt);poseBlend(hind.lower,'x',.65,20,dt)}if(p.head)poseBlend(p.head,'z',-.12,14,dt)}
    if(anim==='shake'){if(p.body)poseBlend(p.body,'z',Math.sin(actor.animTime*24)*.13,28,dt);if(p.chest)poseBlend(p.chest,'z',-Math.sin(actor.animTime*24)*.12,28,dt);if(p.head)poseBlend(p.head,'z',Math.sin(actor.animTime*30)*.25,32,dt);(p.ears||[]).forEach((ear,i)=>poseBlend(ear,'z',(i?-.18:.18)+Math.sin(actor.animTime*30+i)*.22,30,dt))}
    if(anim==='celebrate'||anim==='dance'){if(p.tailPivot)poseBlend(p.tailPivot,'y',Math.sin(actor.animTime*10)*.52,22,dt);if(p.chest)posBlend(p.chest,'y',basePos(p.chest,'y',.62)+.03+Math.abs(Math.sin(actor.animTime*5))*.06,18,dt);const front=(p.legs||[]).filter(l=>l.front);front.forEach((leg,i)=>poseBlend(leg.upper,'x',-.35+Math.sin(actor.animTime*6+i*Math.PI)*.22,18,dt))}
    if(anim==='carry'){if(p.head)poseBlend(p.head,'x',.04,10,dt);if(p.tailPivot)poseBlend(p.tailPivot,'x',-.62,12,dt)}
    if(anim==='hit'){if(p.head)poseBlend(p.head,'z',Math.sin(actor.animTime*28)*.16,24,dt);(p.legs||[]).forEach(leg=>poseBlend(leg.upper,'x',-.18,20,dt))}
    return;
  }
  const crouch=anim==='land'?.075:anim==='mantle'?.045:anim==='sit'?.22:anim==='sleep'?.38:0;
  if(p.hips){posBlend(p.hips,'y',basePos(p.hips,'y',.82)+bob-crouch-landing*.025,18,dt);poseBlend(p.hips,'y',(moving?Math.sin(phase)*.025:idleShift*.018),12,dt);poseBlend(p.hips,'z',-turnLean+idleShift*.012,10,dt);poseBlend(p.hips,'x',clamp(-accelLean*.35,-.04,.04),10,dt)}
  if(p.upperBody){posBlend(p.upperBody,'y',basePos(p.upperBody,'y',.92)+bob*.55-crouch*.25-landing*.02,18,dt);poseBlend(p.upperBody,'z',turnLean+(anim==='hit'?.12:0)-idleShift*.01,10,dt);poseBlend(p.upperBody,'x',anim==='mantle'?.24:anim==='hit'?-.08:(run?.055:0)+accelLean+landing*.055,10,dt);poseBlend(p.upperBody,'y',(moving?-Math.sin(phase)*.018:idleShift*.012)+attentionYaw*.12,10,dt)}
  if(p.head){poseBlend(p.head,'x',clamp(lookPitch,-.35,.35)*.28+attentionPitch*.55+(moving?Math.sin(phase*2)*.006:0)+clamp(-(motion?.vertical||0)*.006,-.045,.045),10,dt);poseBlend(p.head,'y',clamp((motion?.turn||turnRate||0)*.065,-.11,.11)+idleGlance+attentionYaw*.72,10,dt);poseBlend(p.head,'z',-turnLean*.22+idleShift*.008,9,dt)}
  if(p.leftLeg&&p.rightLeg){
    let leg=Math.sin(phase)*amount;if(!moving)leg=0;
    if(anim==='jump'){leg=clamp(-.22-(motion?.vertical||0)*.018,-.42,-.18)}else if(anim==='fall'){leg=.18+Math.min(.12,Math.abs(motion?.vertical||0)*.008)}else if(anim==='land'){leg=.1+landing*.16}else if(anim==='mantle'){leg=-.42}else if(anim==='sit'){leg=.82}else if(anim==='sleep'){leg=.96}
    poseBlend(p.leftLeg.hip,'x',leg,22,dt);poseBlend(p.rightLeg.hip,'x',-leg,22,dt);
    poseBlend(p.leftLeg.knee,'x',moving?Math.max(0,-leg)*.66:(anim==='jump'?-.28:0),22,dt);
    poseBlend(p.rightLeg.knee,'x',moving?Math.max(0,leg)*.66:(anim==='jump'?-.28:0),22,dt);
    if(p.leftLeg.foot&&p.rightLeg.foot){const heelL=moving?clamp(-leg*.24,-.16,.16):0,heelR=moving?clamp(leg*.24,-.16,.16):0;poseBlend(p.leftLeg.foot,'x',heelL,18,dt);poseBlend(p.rightLeg.foot,'x',heelR,18,dt);poseBlend(p.leftLeg.foot,'y',turnInPlace,14,dt);poseBlend(p.rightLeg.foot,'y',-turnInPlace,14,dt);poseBlend(p.leftLeg.foot,'z',moving?clamp(turnLean*.18,-.035,.035):0,14,dt);poseBlend(p.rightLeg.foot,'z',moving?clamp(turnLean*.18,-.035,.035):0,14,dt)}
  }
  if(p.weaponAnchor){
    poseBlend(p.weaponAnchor,'x',aim?-lookPitch*.18:0,12,dt);
    poseBlend(p.weaponAnchor,'y',moving?Math.sin(phase)*.018:0,12,dt);
    posBlend(p.weaponAnchor,'y',basePos(p.weaponAnchor,'y',.32)+bob*.6,14,dt);
    posBlend(p.weaponAnchor,'x',basePos(p.weaponAnchor,'x',.14)+(aim?0:Math.sin(phase)*.006),14,dt);
    posBlend(p.weaponAnchor,'z',basePos(p.weaponAnchor,'z',-.28)+recoil*.04,18,dt);
  }
  if(p.leftArm&&p.rightArm){
    if(anim==='hit'){
      poseBlend(p.leftArm.shoulder,'x',.38,22,dt);poseBlend(p.rightArm.shoulder,'x',-.42,22,dt);poseBlend(p.leftArm.elbow,'x',-.35,22,dt);poseBlend(p.rightArm.elbow,'x',-.35,22,dt);
    }else if(anim==='mantle'){
      poseBlend(p.leftArm.shoulder,'x',-1.45,22,dt);poseBlend(p.rightArm.shoulder,'x',-1.45,22,dt);poseBlend(p.leftArm.elbow,'x',-.55,22,dt);poseBlend(p.rightArm.elbow,'x',-.55,22,dt);
    }else if(anim==='jump'){
      poseBlend(p.leftArm.shoulder,'x',-.38,16,dt);poseBlend(p.rightArm.shoulder,'x',-.38,16,dt);poseBlend(p.leftArm.shoulder,'z',-.2,16,dt);poseBlend(p.rightArm.shoulder,'z',.2,16,dt);poseBlend(p.leftArm.elbow,'x',-.18,16,dt);poseBlend(p.rightArm.elbow,'x',-.18,16,dt);
    }else if(anim==='fall'){
      poseBlend(p.leftArm.shoulder,'x',.2,14,dt);poseBlend(p.rightArm.shoulder,'x',.2,14,dt);poseBlend(p.leftArm.shoulder,'z',-.42,14,dt);poseBlend(p.rightArm.shoulder,'z',.42,14,dt);poseBlend(p.leftArm.elbow,'x',-.12,14,dt);poseBlend(p.rightArm.elbow,'x',-.12,14,dt);
    }else if(anim==='land'){
      poseBlend(p.leftArm.shoulder,'x',.25+landing*.16,18,dt);poseBlend(p.rightArm.shoulder,'x',.25+landing*.16,18,dt);poseBlend(p.leftArm.elbow,'x',-.22,18,dt);poseBlend(p.rightArm.elbow,'x',-.22,18,dt);
    }else if(anim==='harvest'){
      const dig=Math.sin(actor.animTime*5.6);poseBlend(p.leftArm.shoulder,'x',-.75+dig*.26,16,dt);poseBlend(p.rightArm.shoulder,'x',-1.05-dig*.22,16,dt);poseBlend(p.leftArm.elbow,'x',-.7,16,dt);poseBlend(p.rightArm.elbow,'x',-.82,16,dt);poseBlend(p.upperBody,'x',.14+Math.max(0,dig)*.05,12,dt);
    }else if(anim==='fish'){
      poseBlend(p.leftArm.shoulder,'x',-1.05,16,dt);poseBlend(p.rightArm.shoulder,'x',-.92,16,dt);poseBlend(p.leftArm.elbow,'x',-.84,16,dt);poseBlend(p.rightArm.elbow,'x',-.72,16,dt);poseBlend(p.upperBody,'x',-.035+Math.sin(actor.animTime*2.2)*.018,10,dt);
    }else if(anim==='inspect'||anim==='use'){
      poseBlend(p.rightArm.shoulder,'x',-.65,14,dt);poseBlend(p.rightArm.elbow,'x',-1.05,14,dt);poseBlend(p.leftArm.shoulder,'x',-.16,14,dt);poseBlend(p.head,'x',.08+attentionPitch*.45,10,dt);
    }else if(anim==='drink'){
      poseBlend(p.rightArm.shoulder,'x',-1.22,16,dt);poseBlend(p.rightArm.elbow,'x',-1.28,16,dt);poseBlend(p.rightArm.shoulder,'z',-.08,16,dt);poseBlend(p.leftArm.shoulder,'x',-.15,16,dt);poseBlend(p.head,'x',-.035,10,dt);
    }else if(anim==='eat'){
      const bite=Math.max(0,Math.sin(actor.animTime*4.2));poseBlend(p.rightArm.shoulder,'x',-.78-bite*.28,15,dt);poseBlend(p.rightArm.elbow,'x',-.92-bite*.22,15,dt);poseBlend(p.leftArm.shoulder,'x',-.32,15,dt);poseBlend(p.leftArm.elbow,'x',-.55,15,dt);poseBlend(p.head,'x',.035+bite*.025,10,dt);
    }else if(anim==='wave'){
      poseBlend(p.leftArm.shoulder,'x',0,14,dt);poseBlend(p.rightArm.shoulder,'x',-.22,14,dt);poseBlend(p.rightArm.shoulder,'z',-1.72,14,dt);poseBlend(p.rightArm.elbow,'x',-.48+Math.sin(actor.animTime*8)*.26,18,dt);
    }else if(anim==='cook'){
      const stir=Math.sin(actor.animTime*7);poseBlend(p.leftArm.shoulder,'x',-.72,16,dt);poseBlend(p.rightArm.shoulder,'x',-.82+stir*.08,16,dt);poseBlend(p.leftArm.elbow,'x',-.78,16,dt);poseBlend(p.rightArm.elbow,'x',-.9+stir*.18,16,dt);poseBlend(p.rightArm.shoulder,'z',stir*.12,16,dt);poseBlend(p.upperBody,'x',.07,12,dt);
    }else if(anim==='carry'){
      poseBlend(p.leftArm.shoulder,'x',-.82,18,dt);poseBlend(p.rightArm.shoulder,'x',-.82,18,dt);poseBlend(p.leftArm.elbow,'x',-1.18,18,dt);poseBlend(p.rightArm.elbow,'x',-1.18,18,dt);poseBlend(p.leftArm.shoulder,'z',-.08,18,dt);poseBlend(p.rightArm.shoulder,'z',.08,18,dt);
    }else if(['chop','mine','dig'].includes(anim)){
      const strike=(Math.sin(actor.animTime*6.5)+1)*.5,overhead=-2.25+strike*1.45;poseBlend(p.leftArm.shoulder,'x',overhead,20,dt);poseBlend(p.rightArm.shoulder,'x',overhead,20,dt);poseBlend(p.leftArm.elbow,'x',-.55,20,dt);poseBlend(p.rightArm.elbow,'x',-.55,20,dt);poseBlend(p.upperBody,'x',.08+strike*.15,16,dt);
    }else if(anim==='water'){
      const pour=.1+Math.sin(actor.animTime*3.4)*.06;poseBlend(p.rightArm.shoulder,'x',-.95,15,dt);poseBlend(p.rightArm.elbow,'x',-.9,15,dt);poseBlend(p.rightArm.shoulder,'z',-.42+pour,15,dt);poseBlend(p.leftArm.shoulder,'x',-.35,15,dt);poseBlend(p.leftArm.elbow,'x',-.55,15,dt);
    }else if(anim==='cast'){
      const cast=(Math.sin(actor.animTime*4.4)+1)*.5;poseBlend(p.leftArm.shoulder,'x',-1.0-cast*.65,18,dt);poseBlend(p.rightArm.shoulder,'x',-.95-cast*.7,18,dt);poseBlend(p.leftArm.elbow,'x',-.62,18,dt);poseBlend(p.rightArm.elbow,'x',-.62,18,dt);poseBlend(p.upperBody,'x',-.08+cast*.12,14,dt);
    }else if(anim==='reel'){
      const reel=Math.sin(actor.animTime*8);poseBlend(p.leftArm.shoulder,'x',-.9,18,dt);poseBlend(p.leftArm.elbow,'x',-.82,18,dt);poseBlend(p.rightArm.shoulder,'x',-.75+reel*.08,18,dt);poseBlend(p.rightArm.elbow,'x',-1.05+reel*.22,18,dt);poseBlend(p.rightArm.shoulder,'z',reel*.08,18,dt);
    }else if(anim==='sleep'){
      poseBlend(p.leftArm.shoulder,'x',-.18,12,dt);poseBlend(p.rightArm.shoulder,'x',-.18,12,dt);poseBlend(p.leftArm.elbow,'x',-.32,12,dt);poseBlend(p.rightArm.elbow,'x',-.32,12,dt);poseBlend(p.upperBody,'x',-.18,10,dt);if(p.head){poseBlend(p.head,'x',.08,10,dt);poseBlend(p.head,'z',.12,10,dt)}
    }else if(anim==='dance'){
      const beat=Math.sin(actor.animTime*6);poseBlend(p.leftArm.shoulder,'x',-1.3+beat*.45,18,dt);poseBlend(p.rightArm.shoulder,'x',-1.3-beat*.45,18,dt);poseBlend(p.leftArm.shoulder,'z',-.45,18,dt);poseBlend(p.rightArm.shoulder,'z',.45,18,dt);poseBlend(p.hips,'z',beat*.12,18,dt);poseBlend(p.upperBody,'z',-beat*.1,18,dt);
    }else if(anim==='work'){
      poseBlend(p.leftArm.shoulder,'x',-.72+Math.sin(actor.animTime*6)*.2,16,dt);poseBlend(p.rightArm.shoulder,'x',-.72+Math.sin(actor.animTime*6+1)*.2,16,dt);poseBlend(p.leftArm.elbow,'x',-.55,16,dt);poseBlend(p.rightArm.elbow,'x',-.55,16,dt);
    }else if(anim==='celebrate'){
      poseBlend(p.leftArm.shoulder,'x',-2.35+Math.sin(actor.animTime*5)*.08,18,dt);poseBlend(p.rightArm.shoulder,'x',-2.35-Math.sin(actor.animTime*5)*.08,18,dt);poseBlend(p.leftArm.shoulder,'z',-.28,18,dt);poseBlend(p.rightArm.shoulder,'z',.28,18,dt);poseBlend(p.leftArm.elbow,'x',-.2,18,dt);poseBlend(p.rightArm.elbow,'x',-.2,18,dt);
    }else if(anim==='idle'&&!moving&&idleFidget>0){
      // Occasional sleeve/face adjustment. This is intentionally rare so idle still feels calm.
      poseBlend(p.rightArm.shoulder,'x',-.22-idleFidget*.58,12,dt);poseBlend(p.rightArm.elbow,'x',-.08-idleFidget*.86,12,dt);poseBlend(p.rightArm.shoulder,'z',-.04-idleFidget*.08,12,dt);poseBlend(p.leftArm.shoulder,'x',idleShift*.025,10,dt);poseBlend(p.head,'y',idleGlance+idleFidget*.035,9,dt);
    }else if(aim||anim==='aim'){
      poseBlend(p.rightArm.shoulder,'x',-1.05-recoil*.08,18,dt);poseBlend(p.rightArm.shoulder,'z',-.12,18,dt);poseBlend(p.rightArm.elbow,'x',-.55,18,dt);
      poseBlend(p.leftArm.shoulder,'x',-.9,18,dt);poseBlend(p.leftArm.shoulder,'z',.2,18,dt);poseBlend(p.leftArm.elbow,'x',-.82,18,dt);
    }else{
      const swing=moving?Math.sin(phase)*amount*.62:idleShift*.025;
      poseBlend(p.leftArm.shoulder,'x',-swing,18,dt);poseBlend(p.rightArm.shoulder,'x',swing,18,dt);poseBlend(p.leftArm.shoulder,'z',0,16,dt);poseBlend(p.rightArm.shoulder,'z',0,16,dt);poseBlend(p.leftArm.elbow,'x',moving?(run?-.22-.08*Math.max(0,Math.sin(phase)):-.1):-.015*Math.max(0,idleShift),16,dt);poseBlend(p.rightArm.elbow,'x',moving?(run?-.22-.08*Math.max(0,-Math.sin(phase)):-.1):-.015*Math.max(0,-idleShift),16,dt);
    }
  }
}

/** Return the best nearby interaction with a small forward-facing preference. */
export function chooseInteraction(actor,interactions,{radius=3,yaw=actor?.yaw||0}={}){
  if(!actor)return null;let best=null,bestScore=Infinity;const fx=Math.sin(yaw),fz=-Math.cos(yaw);
  for(const item of interactions||[]){const dx=item.x-actor.x,dz=item.z-actor.z,d=Math.hypot(dx,dz);if(d>radius)continue;const dot=d>.01?(dx/d*fx+dz/d*fz):1,score=d-(dot*.38);if(score<bestScore){best=item;bestScore=score}}
  return best;
}



/**
 * One renderer contract for all real-time 3D games. Keeping color management,
 * tone mapping and shadow filtering together prevents the same character or
 * material from looking like a different asset when a player switches games.
 */
export function configureRendererForRealism(renderer,THREE,{exposure=1.15,pixelRatio=null,shadows=true}={}){
  if(!renderer||!THREE)return renderer;
  if(pixelRatio!=null)renderer.setPixelRatio(pixelRatio);
  renderer.outputColorSpace=THREE.SRGBColorSpace;
  renderer.toneMapping=THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure=exposure;
  if(renderer.shadowMap){renderer.shadowMap.enabled=!!shadows;if(shadows)renderer.shadowMap.type=THREE.PCFSoftShadowMap}
  return renderer;
}

/**
 * Consistent sun/shadow contract. Coverage stays game-specific because a tropical
 * island needs a much larger shadow camera than Papa's Shop, but bias/filter
 * behavior should not make the same character appear grounded in one game and
 * floating in another.
 */
export function configureShadowCastingLight(light,{mapSize=2048,left=-28,right=28,top=28,bottom=-28,near=.5,far=70,bias=-.00045,normalBias=.025}={}){
  if(!light)return light;light.castShadow=true;if(light.shadow?.mapSize?.set)light.shadow.mapSize.set(mapSize,mapSize);if(light.shadow?.camera){Object.assign(light.shadow.camera,{left,right,top,bottom,near,far});light.shadow.camera.updateProjectionMatrix?.()}if(light.shadow){light.shadow.bias=bias;light.shadow.normalBias=normalBias;light.shadow.radius=2}return light;
}

export function createPerformanceGovernor(renderer,{targetFps=55,minPixelRatio=.8,maxPixelRatio=2}={}){
  let acc=0,frames=0,lastAdjust=0,current=Math.min(maxPixelRatio,typeof devicePixelRatio==='number'?devicePixelRatio:1.5);
  renderer.setPixelRatio(current);
  function sample(dt){acc+=dt;frames++;if(acc<2.2)return current;const fps=frames/acc,now=typeof performance!=='undefined'?performance.now():Date.now();if(now-lastAdjust>3000){let next=current;if(fps<targetFps-10)next=Math.max(minPixelRatio,current-.18);else if(fps>targetFps+4)next=Math.min(maxPixelRatio,current+.1);if(Math.abs(next-current)>.04){current=next;renderer.setPixelRatio(current);lastAdjust=now}acc=0;frames=0}return current}
  return {sample,get pixelRatio(){return current}};
}
