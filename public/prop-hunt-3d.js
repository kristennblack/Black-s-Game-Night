/*
 * Black Family Game Night - Family Prop Hunt
 * v2.0.0-studio-realism
 *
 * Real WebGL third-person renderer. No Canvas 2D character projection is used.
 * Characters, dogs, buildings, props and weapons are actual 3D scene objects.
 */
(function(){
  'use strict';

  const THREE_URL='https://cdn.jsdelivr.net/npm/three@0.185.1/build/three.module.min.js';
  const CORE_URL='/prop-hunt-core.mjs';
  const ART_URL='/shared-3d-art-kit.mjs';
  const GAMEPLAY_URL='/shared-3d-gameplay.mjs';
  const STUDIO_URL='/shared-3d-studio.mjs';
  const FAMILY=window.FAMILY;
  const APP=window.APP||{toast:()=>{}};
  const family=()=>[...(FAMILY?.people||[]),...(FAMILY?.supports||[])];
  const personById=id=>family().find(p=>p.id===id)||family()[0];
  const isDog=p=>!!p?.dog||['kelsi','molly','gunner'].includes(p?.id);
  const TEST_SCALE=location.search.includes('test=1') ? .03 : 1;
  const CDN_NOTICE='Three.js 0.185.1';

  let root=null,THREE=null,core=null,art=null,gameplay=null,studio=null,assets=null,audio=null,loadPromise=null,game=null,raf=0,lastFrame=0;
  let network=null,roomState=null,ws=null,reconnectTimer=0,pollTimer=0;
  const keys=Object.create(null);
  const joy={x:0,z:0,id:null};
  const look={id:null,x:0,y:0};
  const input={jumpQueued:false,jumpHeld:false,sprint:false,aim:false,shoot:false};
  const setup={charId:'john',outfit:0,count:6,mode:'classic',mapKey:'papa',botConfigs:[]};

  const OUTFITS={
    john:{top:0x6e3340,legs:0x34506b,boots:0x4a2e1d,hair:0x3a2a20,skin:0xd3a477,label:'plaid shirt, jeans, cowboy boots'},
    kristen:{top:0xc7b69d,legs:0x35516d,boots:0x6a4a34,hair:0x5b3e2e,skin:0xd6ab83,label:'T-shirt and jeans'},
    holly:{top:0x7c8794,legs:0x59677b,boots:0x4d433a,hair:0x6a4a34,skin:0xe0b58d,label:'hoodie and baggy jeans'},
    elizabeth:{top:0xc57f8f,legs:0xc5a273,boots:0xeee2d2,hair:0x74523e,skin:0xe2b991,label:'tank top and shorts'},
    vanessa:{top:0xa87b55,legs:0x47617c,boots:0x5a3824,hair:0x4f382c,skin:0xd8aa82,label:'western look'},
    logan:{top:0x53616e,legs:0x3b5067,boots:0x3a342e,hair:0x4b382d,skin:0xd7aa82,label:'hoodie and jeans'},
    james:{top:0x567692,legs:0x46617c,boots:0x4d392b,hair:0xaaa49b,skin:0xcfa078,label:'denim shirt and jeans'},
    dorothy:{top:0x9a6d82,legs:0x8f6377,boots:0x5a4038,hair:0xb7a79a,skin:0xd3a47e,label:'flowy dress'},
    nana:{top:0xa97d83,legs:0x444a51,boots:0x47392f,hair:0xc0b3a8,skin:0xd0a17b,label:'leggings and shirt'},
    papa:{top:0x7b6a4e,legs:0x3f5870,boots:0x4c3525,hair:0x9d9287,skin:0xca9b75,label:'shirt and jeans'},
    kelsi:{fur:0xc69a69,accent:0xf2dfc3,label:'dog'},molly:{fur:0xd1a77f,accent:0xf0e0cc,label:'dog'},gunner:{fur:0x81705f,accent:0x5b4a3e,label:'dog'}
  };

  const PROP_DEFS={
    'Bucket':{kind:'cylinder',w:.42,d:.42,h:.48,color:0x77818a},
    'Oil Jug':{kind:'jug',w:.34,d:.28,h:.44,color:0x4d5a43},
    'Toolbox':{kind:'box',w:.72,d:.36,h:.34,color:0x7e3e32},
    'Welding Helmet':{kind:'helmet',w:.38,d:.32,h:.35,color:0x32383a},
    'Gas Can':{kind:'jug',w:.42,d:.26,h:.48,color:0x9b483d},
    'Shop Vac':{kind:'vac',w:.5,d:.5,h:.72,color:0x3e5966},
    'Coffee Mug':{kind:'mug',w:.22,d:.22,h:.24,color:0xe0d5c1},
    'Beer Case':{kind:'box',w:.62,d:.4,h:.28,color:0x8d6d42},
    'Stool':{kind:'stool',w:.42,d:.42,h:.58,color:0x70563e},
    'Sawhorse':{kind:'sawhorse',w:1.05,d:.48,h:.7,color:0x8a6846},
    'Extension Cord':{kind:'coil',w:.42,d:.42,h:.12,color:0xd99045},
    'Feed Bucket':{kind:'cylinder',w:.48,d:.48,h:.5,color:0x6f7772},
    'Hay Bale':{kind:'box',w:1.0,d:.55,h:.55,color:0xb19a55,solid:true,climbable:true},
    'Wheelbarrow':{kind:'wheelbarrow',w:1.0,d:.55,h:.55,color:0x6b735c},
    'Garbage Can':{kind:'cylinder',w:.58,d:.58,h:.82,color:0x4e5b50,solid:true,climbable:true},
    'Parts Crate':{kind:'box',w:.8,d:.62,h:.52,color:0x806242,solid:true,climbable:true},
    'Lumber':{kind:'lumber',w:1.4,d:.48,h:.42,color:0xa17d52,solid:true,climbable:true},
    'Camp Chair':{kind:'chair',w:.55,d:.62,h:.78,color:0x65745e},
    'Cooler':{kind:'box',w:.62,d:.42,h:.42,color:0x5d8293,solid:true,climbable:true},
    'Lantern':{kind:'lantern',w:.28,d:.28,h:.45,color:0xc6a85f},
    'Dog Toy':{kind:'ball',w:.28,d:.28,h:.28,color:0xc9654d},
    'Card Box':{kind:'box',w:.3,d:.22,h:.12,color:0x6f4e3a},
    'Water Jug':{kind:'jug',w:.4,d:.34,h:.55,color:0x718b91},
    'Firewood':{kind:'lumber',w:1.0,d:.55,h:.45,color:0x7f5d3e,solid:true,climbable:true},
    'Camp Bin':{kind:'box',w:.85,d:.62,h:.65,color:0x53655c,solid:true,climbable:true},
    'Rock':{kind:'rock',w:.72,d:.62,h:.45,color:0x77746a,solid:true,climbable:true},
    'Flower Pot':{kind:'pot',w:.38,d:.38,h:.42,color:0x76533f},
    'Watering Can':{kind:'jug',w:.42,d:.3,h:.35,color:0x657a65},
    'Tire':{kind:'tire',w:.62,d:.22,h:.62,color:0x2e3031,solid:true,climbable:true},
    'Feed Barrel':{kind:'cylinder',w:.6,d:.6,h:.86,color:0x5e6d6e,solid:true,climbable:true},
    'Trough':{kind:'trough',w:1.2,d:.58,h:.5,color:0x6e665a,solid:true,climbable:true},
    'Pallet':{kind:'pallet',w:1.0,d:.75,h:.25,color:0x8a6947,solid:true,climbable:true},
    'Feed Sack':{kind:'sack',w:.5,d:.35,h:.7,color:0xb3a27e},
    'Egg Crate':{kind:'box',w:.62,d:.4,h:.24,color:0x8f704a},
    'Mud Bucket':{kind:'cylinder',w:.48,d:.48,h:.48,color:0x6d5a47}
  };

  function propDef(type){return PROP_DEFS[type]||{kind:'box',w:.44,d:.36,h:.44,color:0x7a6d5b};}
  function avatarPath(p){return `/characters3d/${p.id}.png`;}
  function hex(n){return `#${Number(n).toString(16).padStart(6,'0')}`;}
  function esc(s=''){return String(s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));}
  const clamp=(v,a,b)=>core?core.clamp(v,a,b):Math.max(a,Math.min(b,v));

  async function ensureEngine(){
    if(loadPromise)return loadPromise;
    loadPromise=Promise.all([import(THREE_URL),import(CORE_URL),import(ART_URL),import(GAMEPLAY_URL),import(STUDIO_URL)]).then(([t,c,a,g,s])=>{THREE=t;core=c;art=a.create3DArtKit(THREE);gameplay=g;studio=s;assets=studio.createAuthoredAssetPipeline(THREE);audio=studio.createAudioSystem();return true}).catch(err=>{console.error('3D engine failed to load',err);throw new Error('The 3D engine could not load. Check the internet connection and reload the game.')});
    return loadPromise;
  }

  function stop(){
    if(raf)cancelAnimationFrame(raf);raf=0;lastFrame=0;
    if(game?.renderer){game.renderer.setAnimationLoop(null);game.renderer.dispose();}
    if(ws){try{ws.close()}catch{}ws=null}
    clearTimeout(reconnectTimer);clearInterval(pollTimer);reconnectTimer=0;pollTimer=0;
    window.removeEventListener('keydown',onKeyDown);window.removeEventListener('keyup',onKeyUp);window.removeEventListener('resize',onResize);
    game=null;network=null;roomState=null;Object.keys(keys).forEach(k=>delete keys[k]);joy.x=joy.z=0;look.id=null;
  }

  async function mount(el){
    root=el;stop();
    const q=new URL(location.href).searchParams,roomId=q.get('room');
    if(roomId){network={roomId,playerToken:localStorage.getItem(`gn_prop_player_${roomId}`)||localStorage.getItem(`gn_player_${roomId}`),hostToken:localStorage.getItem(`gn_prop_host_${roomId}`)||localStorage.getItem(`gn_host_${roomId}`)};await openNetworkRoom();}
    else renderSetup();
  }

  function renderSetup(){
    const selected=personById(setup.charId);
    root.innerHTML=`<div class="game-title-row"><div><span class="eyebrow">REAL WEBGL THIRD-PERSON GAME</span><h1>Family Prop Hunt</h1><p class="subtext">True 3D rooms, all-angle family characters, real depth and wall occlusion, camera collision, automatic mantling, detailed prop-zappers and fully modeled dog players.</p></div><span class="pill">${CDN_NOTICE}</span></div>
      <div class="setup-grid"><section class="panel panel-pad"><h2>Choose your character</h2><div class="ph3-character-grid">${family().map(p=>`<button class="ph3-character-card ${p.id===selected.id?'selected':''}" data-ph-char="${p.id}"><div><img src="${avatarPath(p)}" alt="${esc(p.name)}"></div><strong>${esc(p.name)}</strong><small>${isDog(p)?'3D quadruped + backpack zapper':esc(OUTFITS[p.id]?.label||'3D family character')}</small></button>`).join('')}</div></section>
      <section class="panel panel-pad"><h2>Match</h2><label class="field-label">Total players</label><select id="phCount" class="select">${Array.from({length:12},(_,i)=>i+2).map(n=>`<option ${n===setup.count?'selected':''}>${n}</option>`).join('')}</select><br><br><label class="field-label">Mode</label><select id="phMode" class="select"><option value="classic" ${setup.mode==='classic'?'selected':''}>Classic</option><option value="chaos" ${setup.mode==='chaos'?'selected':''}>Family Chaos</option></select><br><br><label class="field-label">Map</label><select id="phMap" class="select"><option value="papa">Papa's Shop</option><option value="camp">Camper / Campsite</option><option value="acreage">Backyard + Fire Pit</option><option value="farm">Goat / Farm</option><option value="rotate">Rotate all four</option></select><div class="ph3-engine-card"><strong>Foundation rebuilt</strong><span>WebGL depth buffer</span><span>3D mesh characters</span><span>camera-wall collision</span><span>raycast shooting</span><span>automatic mantle</span></div><button id="phStart" class="btn success" style="width:100%;margin-top:12px">START REAL 3D MATCH</button></section></div>`;
    root.querySelectorAll('[data-ph-char]').forEach(b=>b.onclick=()=>{setup.charId=b.dataset.phChar;renderSetup()});
    root.querySelector('#phCount').onchange=e=>setup.count=Number(e.target.value);
    root.querySelector('#phMode').onchange=e=>setup.mode=e.target.value;
    root.querySelector('#phMap').value=setup.mapKey;root.querySelector('#phMap').onchange=e=>setup.mapKey=e.target.value;
    root.querySelector('#phStart').onclick=async()=>{try{await ensureEngine();startSolo()}catch(e){APP.toast(e.message)}};
  }

  async function openNetworkRoom(){
    if(!network.playerToken){renderJoin();return}
    try{roomState=await propApi('state',null,'GET');if(!roomState.viewerId){network.playerToken=null;renderJoin();return}connectRoomSocket();renderNetworkState();pollTimer=setInterval(async()=>{if(game)return;try{roomState=await propApi('state',null,'GET');renderNetworkState()}catch{}},1800)}catch(e){renderJoin(e.message)}
  }

  function renderJoin(error=''){
    const selected=personById(setup.charId);
    root.innerHTML=`<div class="game-title-row"><div><span class="eyebrow">PRIVATE PROP HUNT ROOM</span><h1>Join Family Prop Hunt</h1><p class="subtext">Choose who you are, then enter the live 3D room.</p></div></div>${error?`<div class="error">${esc(error)}</div>`:''}<div class="setup-grid"><section class="panel panel-pad"><label class="field-label">Your name</label><input id="phJoinName" class="input" maxlength="24" value="${esc(localStorage.getItem('gn_name')||'')}"><div class="ph3-character-grid compact">${family().map(p=>`<button class="ph3-character-card ${p.id===selected.id?'selected':''}" data-ph-join-char="${p.id}"><div><img src="${avatarPath(p)}" alt="${esc(p.name)}"></div><strong>${esc(p.name)}</strong></button>`).join('')}</div></section><section class="panel panel-pad"><h2>Room ${esc(network.roomId)}</h2><p class="subtext">Walls and rooms use real 3D occlusion. Other players are synchronized through the dedicated Prop Hunt room.</p><button id="phJoin" class="btn success" style="width:100%">JOIN ROOM</button></section></div>`;
    root.querySelectorAll('[data-ph-join-char]').forEach(b=>b.onclick=()=>{setup.charId=b.dataset.phJoinChar;renderJoin(error)});
    root.querySelector('#phJoin').onclick=async()=>{const name=root.querySelector('#phJoinName').value.trim()||selected.name;try{const d=await propApi('join',{name,avatar:setup.charId});network.playerToken=d.playerToken;localStorage.setItem(`gn_prop_player_${network.roomId}`,d.playerToken);localStorage.setItem('gn_name',name);await openNetworkRoom()}catch(e){renderJoin(e.message)}};
  }

  function renderNetworkState(){
    if(game||!roomState)return;
    if(roomState.phase!=='lobby'){ensureEngine().then(()=>startNetworkGame()).catch(e=>APP.toast(e.message));return}
    const me=roomState.players.find(p=>p.id===roomState.viewerId),isHost=roomState.isHost;
    root.innerHTML=`<div class="game-title-row"><div><span class="eyebrow">PRIVATE REAL-TIME 3D ROOM</span><h1>Family Prop Hunt</h1><p class="subtext">Room ${esc(roomState.id)}. Everyone stays in one synchronized 3D match.</p></div><span class="pill">${roomState.players.length}/13</span></div><div class="setup-grid"><section class="panel panel-pad"><h2>Players</h2><div class="ph3-room-list">${roomState.players.map(p=>`<div class="ph3-room-player"><img src="${avatarPath(personById(p.avatar))}" alt=""><div><strong>${esc(p.name)}</strong><small>${p.isBot?`Computer - ${esc(p.difficulty)}`:(p.ready?'READY':'not ready')}</small></div><span>${p.avatar===me?.avatar&&p.id===me?.id?'YOU':''}</span>${isHost&&p.isBot?`<button class="mini-btn" data-remove-bot="${p.id}">x</button>`:''}</div>`).join('')}</div><h3>Your character</h3><div class="ph3-character-grid compact">${family().map(p=>`<button class="ph3-character-card ${p.id===me?.avatar?'selected':''}" data-net-char="${p.id}"><div><img src="${avatarPath(p)}" alt="${esc(p.name)}"></div><strong>${esc(p.name)}</strong></button>`).join('')}</div><button id="phReady" class="btn ${me?.ready?'secondary':'success'}" style="width:100%;margin-top:10px">${me?.ready?'NOT READY':'READY'}</button></section><section class="panel panel-pad"><h2>Match setup</h2>${isHost?`<label class="field-label">Mode</label><select id="netMode" class="select"><option value="classic">Classic</option><option value="chaos">Family Chaos</option></select><br><br><label class="field-label">Map</label><select id="netMap" class="select"><option value="papa">Papa's Shop</option><option value="camp">Camper / Campsite</option><option value="acreage">Backyard + Fire Pit</option><option value="farm">Goat / Farm</option><option value="rotate">Rotate maps</option></select><div class="ph3-bot-add"><select id="netBotChar" class="select">${family().map(p=>`<option value="${p.id}">${esc(p.name)}</option>`).join('')}</select><select id="netBotDiff" class="select"><option>easy</option><option selected>medium</option><option>hard</option></select><button id="netAddBot" class="btn secondary">Add Computer</button></div><button id="netStart" class="btn success" style="width:100%;margin-top:12px">START MATCH</button>`:`<div class="ph3-engine-card"><strong>Waiting for host</strong><span>${esc(roomState.settings.mapKey)}</span><span>${esc(roomState.settings.mode)}</span><span>6 rounds</span></div>`}<button id="netCopy" class="btn cream" style="width:100%;margin-top:10px">COPY INVITE LINK</button></section></div>`;
    if(isHost){const mode=root.querySelector('#netMode'),map=root.querySelector('#netMap');mode.value=roomState.settings.mode;map.value=roomState.settings.mapKey;mode.onchange=()=>propApi('configure',{hostToken:network.hostToken,mode:mode.value,mapKey:map.value,rounds:6});map.onchange=()=>propApi('configure',{hostToken:network.hostToken,mode:mode.value,mapKey:map.value,rounds:6});root.querySelector('#netAddBot').onclick=()=>propApi('addBot',{hostToken:network.hostToken,avatar:root.querySelector('#netBotChar').value,difficulty:root.querySelector('#netBotDiff').value});root.querySelector('#netStart').onclick=()=>propApi('start',{hostToken:network.hostToken}).catch(e=>APP.toast(e.message));root.querySelectorAll('[data-remove-bot]').forEach(b=>b.onclick=()=>propApi('removeBot',{hostToken:network.hostToken,targetId:b.dataset.removeBot}));}
    root.querySelector('#phReady').onclick=()=>propApi('ready',{playerToken:network.playerToken,ready:!me.ready});
    root.querySelectorAll('[data-net-char]').forEach(b=>b.onclick=()=>propApi('profile',{playerToken:network.playerToken,name:me.name,avatar:b.dataset.netChar}));
    root.querySelector('#netCopy').onclick=async()=>{const url=`${location.origin}/new-games.html?game=prophunt&room=${encodeURIComponent(network.roomId)}`;await navigator.clipboard.writeText(url);APP.toast('Invite link copied')};
  }

  async function propApi(path,body=null,method='POST'){
    const u=new URL(`/api/prop/${path}`,location.origin);u.searchParams.set('room',network.roomId);if(method==='GET'&&network.playerToken)u.searchParams.set('token',network.playerToken);
    const r=await fetch(u,{method,headers:body?{'Content-Type':'application/json'}:undefined,body:body?JSON.stringify(body):undefined,cache:'no-store'});const d=await r.json().catch(()=>({}));if(!r.ok)throw new Error(d.error||'Prop Hunt room error');return d;
  }

  function connectRoomSocket(){
    if(!network?.playerToken||ws?.readyState===1)return;const scheme=location.protocol==='https:'?'wss:':'ws:';const url=`${scheme}//${location.host}/api/prop/ws?room=${encodeURIComponent(network.roomId)}&token=${encodeURIComponent(network.playerToken)}`;ws=new WebSocket(url);ws.onmessage=e=>handleSocketMessage(e.data);ws.onclose=()=>{ws=null;if(network){clearTimeout(reconnectTimer);reconnectTimer=setTimeout(connectRoomSocket,1400)}};ws.onerror=()=>{};
  }
  function handleSocketMessage(raw){
    let m;try{m=JSON.parse(raw)}catch{return}
    if(m.type==='state'){roomState=m.state;if(!game)renderNetworkState();else applyRoomState();return}
    if(!game)return;
    if(m.type==='snapshot'){const a=game.actorsById.get(m.playerId);if(a&&a!==game.player){a.netBuffer?.push(m.snapshot,performance.now());a.netTarget=m.snapshot}return}
    if(m.type==='presence')return;
    if(m.type==='action')handleNetworkAction(m);
  }

  function startSolo(){
    const human=personById(setup.charId),pool=family().filter(p=>p.id!==human.id),players=[{id:'local',name:human.name,avatar:human.id,isBot:false,difficulty:null,ready:true,role:null,health:3,alive:true}];
    for(let i=1;i<setup.count;i++){const p=pool[(i-1)%pool.length];players.push({id:`bot-${i}`,name:p.name,avatar:p.id,isBot:true,difficulty:i%3===0?'hard':i%2===0?'easy':'medium',ready:true,role:null,health:3,alive:true})}
    const roles=core.assignRoles(players,1);players.forEach(p=>p.role=roles[p.id]);roomState={id:'solo',phase:'hide',phaseEndsAt:Date.now()+30000*TEST_SCALE,round:1,wins:{hiders:0,hunters:0},settings:{mode:setup.mode,mapKey:setup.mapKey,rounds:6},players,viewerId:'local',isHost:true,activeMap:mapFor(setup.mapKey,1)};network=null;startEngine(roomState.activeMap||mapFor(setup.mapKey,1));
  }

  function startNetworkGame(){if(game)return;const active=roomState.activeMap||mapFor(roomState.settings.mapKey,roomState.round||1);startEngine(active);}
  function mapFor(key,round){return key==='rotate'?['papa','camp','acreage','farm'][((round||1)-1)%4]:key;}

  function startEngine(mapKey){
    disposeRoot();root.innerHTML=gameShell();const canvas=root.querySelector('#ph3Canvas');
    const renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:false,powerPreference:'high-performance'});gameplay.configureRendererForRealism(renderer,THREE,{exposure:1.18,pixelRatio:Math.min(2,devicePixelRatio||1)});
    const scene=new THREE.Scene();scene.background=new THREE.Color(0xa8c3cf);scene.fog=new THREE.Fog(0xa2b7bd,48,105);
    const camera=new THREE.PerspectiveCamera(60,1,.07,180);const clock=new THREE.Clock();
    game={renderer,scene,camera,clock,mapKey,world:null,actors:[],actorsById:new Map(),player:null,keys,feed:[],effects:[],decoys:[],cameraYaw:Math.PI,cameraPitch:.18,cameraDistance:3.65,cameraActualDistance:3.65,shotCooldown:0,recoil:0,round:roomState.round||1,lastNetworkSend:0,startedAt:performance.now(),nearProp:null,controlDisposers:[],padPrev:{},padAim:false,padSprint:false};
    game.cameraRig=gameplay.createThirdPersonCamera(THREE,camera,core,'propHunt',{yaw:Math.PI,pitch:.18});
    game.performance=gameplay.createPerformanceGovernor(renderer,{targetFps:55,minPixelRatio:.82,maxPixelRatio:Math.min(2,devicePixelRatio||1)});
    game.motionFx=art.createMotionFxSystem(scene,{color:mapKey==='camp'?0xc8b793:mapKey==='farm'?0xa88c68:0xb1a28d,max:24});
    game.cinematic=studio.createCinematicCamera(game.cameraRig);audio.setAmbience(mapKey==='camp'?{birds:.22,water:.28,wind:.18}:mapKey==='farm'?{birds:.3,wind:.25}:{birds:.12,wind:.08});
    game.world=buildWorld(mapKey);spawnActors();bindControls();game.cinematic.start({duration:1.15,distance:5.15,pitch:.21,yawOffset:.28});onResize();addFeed('Real 3D renderer active. Walls now occlude players through the depth buffer.');if(network)addFeed('Dedicated live Prop Hunt room connected.');lastFrame=performance.now();loop(lastFrame);
  }

  function disposeRoot(){if(game?.controlDisposers)for(const off of game.controlDisposers){try{off?.()}catch{}}try{game?.motionFx?.dispose?.()}catch{}if(game?.renderer){try{game.renderer.dispose()}catch{}}game=null;}

  function gameShell(){return `<div class="ph3d-shell"><section id="ph3Stage" class="ph3d-stage"><canvas id="ph3Canvas" class="ph3d-canvas"></canvas><div class="ph3d-top"><span id="ph3Role" class="ph3d-chip role"></span><span id="ph3Phase" class="ph3d-chip map"></span><span id="ph3Health" class="ph3d-chip health"></span></div><div id="ph3Crosshair" class="ph3d-crosshair"></div><button id="phShoulder" class="ph3d-shoulder no-look" aria-label="Swap camera shoulder" title="Swap camera shoulder">CAM ↔</button><div id="ph3Hit" class="ph3d-hit">x</div><div id="ph3Flash" class="ph3d-flash"></div><div id="ph3Prompt" class="ph3d-prop-prompt"></div><div class="ph3d-camera-help">Drag to look · left stick/WASD moves · Shift/SPRINT runs · hold AIM/right mouse for shoulder aim · C/LB or CAM swaps shoulder · CTRL adjusts sensitivity/handedness · short jump taps stay low · jump auto-mantles ledges.</div><div class="ph3d-controls"><div id="phJoy" class="ph3d-joystick"><div id="phStick" class="ph3d-stick"></div></div><div class="ph3d-actions"><button id="phAim" class="ph3d-act aim">AIM</button><button id="phShoot" class="ph3d-act primary">SHOOT</button><button id="phJump" class="ph3d-act jump">JUMP</button><button id="phSprint" class="ph3d-act sprint">SPRINT</button><button id="phProp" class="ph3d-act prop">PROP</button><button id="phFlashBtn" class="ph3d-act flash">FLASH</button><button id="phDecoy" class="ph3d-act">DECOY</button><button id="phLock" class="ph3d-act lock">LOCK</button></div></div></section><aside class="ph3d-side"><div class="ph3d-mini"><h3>Loadout</h3><div id="ph3Load" class="ph3d-readout"></div></div><div class="ph3d-mini"><h3>3D status</h3><div class="ph3d-legend"><span>Real depth</span><span>Camera collision</span><span>All-angle rigs</span><span>Raycast hits</span></div></div><div class="ph3d-mini"><h3>Family feed</h3><div id="ph3Feed" class="ph3d-feed"></div></div></aside></div>`;}

  class WorldBuilder{
    constructor(scene,key){this.scene=scene;this.key=key;this.group=new THREE.Group();this.group.name=`world-${key}`;scene.add(this.group);this.colliders=[];this.raycastMeshes=[];this.props=[];this.npcs=[];this.spawn={x:4,z:4};this.bounds={minX:0,maxX:20,minZ:0,maxZ:14};}
    mat(color,rough=.82,metal=.05,kind=null){const k=kind||(metal>.32?'metal':rough>.93?'concrete':'paintedWood');return art.material(k,color,{roughness:rough,metalness:metal,seed:Math.abs((Number(color)||1)%97)+1});}
    box(o){const m=o.material||art.material(o.kind||((o.metal||0)>.32?'metal':'paintedWood'),o.color||0x6b5b49,{roughness:o.rough,metalness:o.metal,seed:o.seed||1});const mesh=new THREE.Mesh(new THREE.BoxGeometry(o.w,o.h,o.d,2,2,2),m);mesh.position.set(o.x,(o.y||0)+o.h/2,o.z);if(o.rotY)mesh.rotation.y=o.rotY;mesh.castShadow=o.castShadow!==false;mesh.receiveShadow=o.receiveShadow!==false;mesh.name=o.name||'box';this.group.add(mesh);if(o.solid!==false){const c={x:o.x,z:o.z,y:o.y||0,w:o.w,d:o.d,h:o.h,solid:true,climbable:!!o.climbable,walkableTop:o.walkableTop??!!o.climbable,noCamera:!!o.noCamera,name:o.name||'box',mesh};this.colliders.push(c);mesh.userData.worldCollider=c;this.raycastMeshes.push(mesh)}return mesh;}
    floor(x,z,w,d,color=0x655d4e,y=-.04,kind='concrete'){const m=this.box({x,z,y,w,d,h:.08,material:art.material(kind,color,{seed:17}),name:'floor',solid:false,receiveShadow:true,castShadow:false});m.userData.floor=true;return m;}
    cylinder(o){const r=o.r||o.w/2,mesh=new THREE.Mesh(new THREE.CylinderGeometry(r,r,o.h,o.segments||20),o.material||art.material(o.kind||((o.metal||0)>.32?'metal':'paintedMetal'),o.color||0x777777,{roughness:o.rough,metalness:o.metal,seed:o.seed||2}));mesh.position.set(o.x,(o.y||0)+o.h/2,o.z);mesh.castShadow=o.castShadow!==false;mesh.receiveShadow=true;mesh.name=o.name||'cylinder';this.group.add(mesh);if(o.solid){const c={x:o.x,z:o.z,y:o.y||0,w:r*2,d:r*2,h:o.h,solid:true,climbable:!!o.climbable,walkableTop:o.walkableTop??!!o.climbable,name:o.name||'cylinder',mesh};this.colliders.push(c);mesh.userData.worldCollider=c;this.raycastMeshes.push(mesh)}return mesh;}
    addRaycast(obj){obj.traverse?.(o=>{if(o.isMesh)this.raycastMeshes.push(o)});return obj;}
    window(x,y,z,w,h,axis='x'){
      const glass=art.material('glass',0x9fc7d2,{opacity:.28,transmission:.42}),mesh=new THREE.Mesh(new THREE.BoxGeometry(axis==='x'?w:.035,h,axis==='x'?.035:w),glass);mesh.position.set(x,y+h/2,z);mesh.receiveShadow=true;mesh.name='window glass';this.group.add(mesh);const c={x,z,y,w:axis==='x'?w:.065,d:axis==='x'?.065:w,h,solid:true,climbable:false,walkableTop:false,name:'window glass',mesh};this.colliders.push(c);this.raycastMeshes.push(mesh);mesh.userData.worldCollider=c;
      const frame=art.material('paintedWood',0xede3d0,{seed:3}),th=.065,dep=.08;
      if(axis==='x'){
        this.box({x,z:z+.035,y:y-.04,w:w+.15,d:dep,h:th,material:frame,solid:false});this.box({x,z:z+.035,y:y+h-.025,w:w+.15,d:dep,h:th,material:frame,solid:false});
        this.box({x:x-w/2-.04,z:z+.035,y,w:th,d:dep,h:h,material:frame,solid:false});this.box({x:x+w/2+.04,z:z+.035,y,w:th,d:dep,h:h,material:frame,solid:false});
        this.box({x,z:z+.04,y:y+h*.5-.025,w:th,d:dep,h:h,material:frame,solid:false});
      }else{
        this.box({x:x+.035,z,y:y-.04,w:dep,d:w+.15,h:th,material:frame,solid:false});this.box({x:x+.035,z,y:y+h-.025,w:dep,d:w+.15,h:th,material:frame,solid:false});
        this.box({x:x+.035,z:z-w/2-.04,y,w:dep,d:th,h:h,material:frame,solid:false});this.box({x:x+.035,z:z+w/2+.04,y,w:dep,d:th,h:h,material:frame,solid:false});
        this.box({x:x+.04,z,y:y+h*.5-.025,w:dep,d:th,h:h,material:frame,solid:false});
      }return mesh;
    }
    trimOpeningX(z,op,color=0xe7d8c2){const m=art.material('paintedWood',color,{seed:5}),th=.07,dep=.09,x=(op.from+op.to)/2,w=op.to-op.from,top=op.sill+op.h;this.box({x:op.from-.035,z:z-.01,y:op.sill,w:th,d:dep,h:op.h,material:m,solid:false});this.box({x:op.to+.035,z:z-.01,y:op.sill,w:th,d:dep,h:op.h,material:m,solid:false});this.box({x,z:z-.01,y:top-.035,w:w+.14,d:dep,h:th,material:m,solid:false});if(op.sill>0)this.box({x,z:z-.01,y:op.sill-.035,w:w+.14,d:dep,h:th,material:m,solid:false});}
    trimOpeningZ(x,op,color=0xe7d8c2){const m=art.material('paintedWood',color,{seed:5}),th=.07,dep=.09,z=(op.from+op.to)/2,d=op.to-op.from,top=op.sill+op.h;this.box({x:x-.01,z:op.from-.035,y:op.sill,w:dep,d:th,h:op.h,material:m,solid:false});this.box({x:x-.01,z:op.to+.035,y:op.sill,w:dep,d:th,h:op.h,material:m,solid:false});this.box({x:x-.01,z,y:top-.035,w:dep,d:d+.14,h:th,material:m,solid:false});if(op.sill>0)this.box({x:x-.01,z,y:op.sill-.035,w:dep,d:d+.14,h:th,material:m,solid:false});}
    wallX(z,x0,x1,height,openings=[],color=0x4d3d31,thick=.22,name='wall'){
      const wallMat=art.material('paintedWood',color,{seed:23});let cur=x0;const sorted=[...openings].sort((a,b)=>a.from-b.from);for(const op of sorted){if(op.from>cur)this.box({x:(cur+op.from)/2,z,w:op.from-cur,d:thick,h:height,material:wallMat,name});if(op.sill>0)this.box({x:(op.from+op.to)/2,z,w:op.to-op.from,d:thick,h:op.sill,material:wallMat,name});const top=op.sill+op.h;if(top<height)this.box({x:(op.from+op.to)/2,z,y:top,w:op.to-op.from,d:thick,h:height-top,material:wallMat,name});if(op.glass)this.window((op.from+op.to)/2,op.sill,z,op.to-op.from,op.h,'x');this.trimOpeningX(z,op);cur=op.to}if(cur<x1)this.box({x:(cur+x1)/2,z,w:x1-cur,d:thick,h:height,material:wallMat,name});
      this.box({x:(x0+x1)/2,z:z-thick*.56,y:.02,w:x1-x0,d:.05,h:.12,material:art.material('wood',0x4e3929,{seed:8}),solid:false});
    }
    wallZ(x,z0,z1,height,openings=[],color=0x4d3d31,thick=.22,name='wall'){
      const wallMat=art.material('paintedWood',color,{seed:25});let cur=z0;const sorted=[...openings].sort((a,b)=>a.from-b.from);for(const op of sorted){if(op.from>cur)this.box({x,z:(cur+op.from)/2,w:thick,d:op.from-cur,h:height,material:wallMat,name});if(op.sill>0)this.box({x,z:(op.from+op.to)/2,w:thick,d:op.to-op.from,h:op.sill,material:wallMat,name});const top=op.sill+op.h;if(top<height)this.box({x,z:(op.from+op.to)/2,y:top,w:thick,d:op.to-op.from,h:height-top,material:wallMat,name});if(op.glass)this.window(x,op.sill,(op.from+op.to)/2,op.to-op.from,op.h,'z');this.trimOpeningZ(x,op);cur=op.to}if(cur<z1)this.box({x,z:(cur+z1)/2,w:thick,d:z1-cur,h:height,material:wallMat,name});
      this.box({x:x-thick*.56,z:(z0+z1)/2,y:.02,w:.05,d:z1-z0,h:.12,material:art.material('wood',0x4e3929,{seed:8}),solid:false});
    }
    roofPanel(x,z,w,d,y,rotZ,color=0x4b4036){const mesh=this.box({x,z,y,w,d,h:.16,material:art.material('paintedMetal',color,{seed:14}),name:'roof',solid:false});mesh.rotation.z=rotZ;return mesh;}
    addProp(type,x,z,rot=0){const d=propDef(type),mesh=art.createPropMesh(type,d);mesh.position.set(x,0,z);mesh.rotation.y=rot;this.group.add(mesh);const rec={id:`prop-${this.props.length}`,type,x,z,y:0,w:d.w,d:d.d,h:d.h,mesh,def:d};this.props.push(rec);mesh.userData.worldProp=rec;if(d.solid){const c={x,z,y:0,w:d.w,d:d.d,h:d.h,solid:true,climbable:!!d.climbable,walkableTop:!!d.climbable,name:type,mesh};this.colliders.push(c);rec.collider=c;mesh.traverse(o=>{if(o.isMesh){o.userData.worldCollider=c;this.raycastMeshes.push(o)}})}else mesh.traverse(o=>{if(o.isMesh)this.raycastMeshes.push(o)});return rec;}
  }

  function baseLighting(scene,night=false){const hemi=new THREE.HemisphereLight(night?0x7b89a7:0xc5dbea,night?0x302f30:0x665d4c,night?1.0:1.45);scene.add(hemi);const ambient=new THREE.AmbientLight(night?0x8996b2:0xfff5df,night?.18:.24);scene.add(ambient);const sun=new THREE.DirectionalLight(night?0xffd2aa:0xfff1d2,night?2.0:3.0);sun.position.set(-11,18,10);gameplay.configureShadowCastingLight(sun,{mapSize:2048,left:-28,right:28,top:28,bottom:-28,near:.5,far:55});scene.add(sun);}
  function addTree(w,x,z,s=1){return art.buildDetailedTree(w,x,z,s,'spruce')}
  function addFence(w,x,z,length,axis='x'){return art.buildFence(w,x,z,length,axis)}

  function buildWorld(key){
    baseLighting(game.scene,key==='acreage');let w;if(key==='camp')w=buildCamp();else if(key==='acreage')w=buildAcreage();else if(key==='farm')w=buildFarm();else w=buildPapa();game.scene.add(w.group);return w;
  }

  function buildPapa(){
    const w=new WorldBuilder(game.scene,'papa');w.bounds={minX:.2,maxX:19.2,minZ:.2,maxZ:13.8};w.spawn={x:5.2,z:11.2};
    w.floor(9.7,7.0,19.1,13.6,0x6e6758,-.055,'gravel');
    w.floor(6.6,5.1,11,7.8,0x77736b,-.02,'concrete');w.floor(14.6,5.2,5.2,6.3,0x675a49,-.02,'dirt');w.floor(5.2,10.7,9.6,3.3,0x756f64,-.025,'gravel');
    const wall=0x6f5944;w.wallX(1.2,1.1,12.1,2.95,[{from:3.0,to:4.25,sill:1.15,h:1.05,glass:true},{from:8.0,to:9.3,sill:1.1,h:1.1,glass:true}],wall);w.wallZ(1.1,1.2,9.0,2.95,[{from:4.0,to:5.2,sill:1.15,h:1.05,glass:true}],wall);w.wallX(9.0,1.1,12.1,2.95,[{from:4.8,to:8.45,sill:0,h:2.5},{from:10.35,to:11.25,sill:0,h:2.18}],wall);w.wallZ(12.1,1.2,8.2,2.95,[{from:4.15,to:6.0,sill:0,h:2.5}],wall);
    const barnWall=0x5f5140;w.wallX(2.1,12.1,17.3,2.72,[{from:13.0,to:14.1,sill:1.1,h:1.0,glass:true}],barnWall);w.wallZ(17.3,2.1,8.25,2.72,[{from:4.2,to:5.35,sill:0,h:2.15}],barnWall);w.wallX(8.25,12.1,17.3,2.72,[{from:13.7,to:16.2,sill:0,h:2.25}],barnWall);
    w.box({x:6.6,z:5.1,y:2.88,w:11,d:7.8,h:.07,material:art.material('paintedWood',0x625546,{seed:19}),name:'shop ceiling',solid:true});w.roofPanel(4.05,5.1,5.8,8.3,3.14,.19,0x4c433c);w.roofPanel(9.15,5.1,5.8,8.3,3.14,-.19,0x4c433c);
    w.box({x:14.7,z:5.2,y:2.66,w:5.2,d:6.3,h:.07,material:art.material('paintedWood',0x5f5244,{seed:20}),name:'barn ceiling',solid:true});w.roofPanel(13.5,5.2,3,6.7,2.9,.17,0x50473f);w.roofPanel(15.9,5.2,3,6.7,2.9,-.17,0x50473f);
    const rafter=art.material('wood',0x5d4633,{seed:11});for(let x=1.8;x<11.8;x+=1.25){w.box({x,z:5.1,y:2.62,w:.09,d:7.35,h:.13,material:rafter,name:'shop rafter',solid:false});}for(let x=12.5;x<17.2;x+=1.15)w.box({x,z:5.2,y:2.45,w:.09,d:6.0,h:.12,material:rafter,name:'barn rafter',solid:false});
    art.buildOverheadLight(w,3.5,4.8,2.62);art.buildOverheadLight(w,7.2,4.8,2.62);art.buildOverheadLight(w,10.1,4.8,2.62);art.buildOverheadLight(w,14.7,4.8,2.42);
    art.buildCeilingFan(w,5.35,5.15,2.68,.92);art.buildToolRack(w,2.0,2.22,Math.PI/2);art.buildCabinet(w,10.85,2.5,0,{width:1.0,height:1.75,color:0x545d5e});art.buildAmbientParticles(w,{x:6.4,z:5.0,y:.45,width:9.5,depth:6.7,height:2.1,count:42,kind:'dust'});
    art.buildSwingDoor(w,4.8,9.0,0,{width:1.0,height:2.4,color:0x6b513d,openDistance:2.5,label:'Shop door'});art.buildSwingDoor(w,12.1,4.15,Math.PI/2,{width:1.05,height:2.35,color:0x67503c,openDistance:2.6,label:'Barn passage'});art.buildSwingDoor(w,17.3,4.2,Math.PI/2,{width:1.05,height:2.08,color:0x5b4939,openDistance:2.6,label:'Barn door'});art.buildWallPoster(w,2.0,1.33,1.68,0,{width:.78,height:1.0,color:0x6d5442,accent:0xe1b957});art.buildWallPoster(w,11.98,7.2,1.45,-Math.PI/2,{width:.64,height:.82,color:0x455a5a,accent:0xd29d63});
    art.buildWorkbench(w,4.25,2.78);art.buildToolChest(w,7.45,2.78);art.buildShelving(w,10.3,3.05,0,{width:1.55,height:2.25,depth:.66});
    art.buildDrillPress(w,2.15,6.1);art.buildAirCompressor(w,10.35,4.55,Math.PI/2);art.buildWeldingCart(w,8.85,4.4);art.buildLadder(w,11.58,7.0,Math.PI/2,2.25);
    buildTractor(w,4.25,6.75);buildMotorcycle(w,7.75,6.65);art.buildLumberStack(w,2.75,8.0,0,{width:2.75,height:.58,depth:.78});buildFireplace(w,10.85,7.26,0);buildPapaChair(w,9.35,8.0,-.12);
    art.buildCrate(w,8.85,4.75,.08,{width:.82,height:.5,depth:.7,name:'Step crate'});art.buildCrate(w,9.15,5.45,-.1,{width:1.0,height:.82,depth:.78,name:'Parts crate'});art.buildCrate(w,10.65,5.7,.05,{width:.78,height:1.06,depth:.68,name:'Shelf step'});
    art.buildBarnStall(w,13.6,4.25,0,{width:2.15,depth:1.95});art.buildBarnStall(w,15.85,4.25,0,{width:2.05,depth:1.95});art.buildBarnStall(w,14.7,6.45,Math.PI,{width:3.8,depth:1.25});
    art.buildFence(w,14.6,3.35,3.5,'x');art.buildFence(w,14.6,6.2,3.5,'x');art.buildFence(w,16.05,4.8,2.8,'z');
    art.buildLumberStack(w,2.45,10.65,0,{width:2.15,height:.7,depth:.72});art.buildCrate(w,5.3,10.8,.04,{width:1.8,height:.86,depth:1.05,color:0x6b6255,name:'Outdoor parts pallet'});
    const panel=art.material('paintedMetal',0x6b7779,{seed:4});w.box({x:1.25,z:7.2,y:1.05,w:.05,d:.5,h:.75,material:panel,solid:false,name:'Electrical panel'});for(let i=0;i<4;i++)w.box({x:1.21,z:7.05+i*.09,y:1.25,w:.02,d:.05,h:.08,material:art.material('paintedMetal',0x343b3c),solid:false});
    for(const [x,z,s] of [[18.1,1.2,.82],[18.25,8.8,.72],[.55,11.9,.68]])addTree(w,x,z,s);
    for(const [x,z,s] of [[.7,10.5,.75],[18.35,10.2,.9],[18.2,3.2,.72],[1.0,12.8,.8]])art.buildBush(w,x,z,s,0x465f3e);for(const [x,z] of [[2.0,12.8],[6.7,12.9],[11.5,12.8],[17.9,11.4]])art.buildGrassPatch(w,x,z,.9,{count:10});art.buildRockCluster(w,18.0,12.35,.9);art.buildNoticeBoard(w,1.9,12.4,.08,{titleColor:0x596b68});art.buildMailbox(w,6.2,13.0,Math.PI,{color:0x655b4f});art.buildAmbientBirds(w,{x:10,z:9,y:7,radius:5.5,count:4});
    [['Bucket',2.2,3.8],['Bucket',2.55,4.2],['Oil Jug',2.85,3.95],['Toolbox',6.1,4.3],['Welding Helmet',6.9,4.25],['Gas Can',8.1,3.65],['Shop Vac',8.55,3.8],['Coffee Mug',10.4,6.2],['Beer Case',9.75,6.35],['Stool',8.7,7.95],['Coffee Mug',10.1,8.05],['Sawhorse',5.55,8.1],['Extension Cord',6.35,8.42],['Feed Bucket',12.85,7.2],['Hay Bale',13.65,7.25],['Wheelbarrow',15.9,7.0],['Feed Bucket',15.2,4.9],['Garbage Can',16.45,5.7],['Parts Crate',2.1,11.65],['Gas Can',4.25,11.6],['Toolbox',6.25,11.7],['Lumber',8.0,11.2]].forEach(([t,x,z],i)=>w.addProp(t,x,z,i*.31));
    addNpcAnimal(w,'pig',13.65,4.45);addNpcAnimal(w,'pig',15.75,4.5);addNpcAnimal(w,'goat',13.55,6.75);addNpcAnimal(w,'goat',15.7,6.82);return w;
  }

  function buildCamp(){
    const w=new WorldBuilder(game.scene,'camp');w.bounds={minX:.2,maxX:20.5,minZ:.2,maxZ:14.5};w.spawn={x:10.6,z:7.8};w.floor(10.2,7.2,20.3,14.2,0x58704b,-.055,'dirt');w.floor(6.05,4.2,7.3,3.7,0x8a8273,-.02,'paintedWood');
    const camper=0xb1a994;w.wallX(2.4,2.4,9.7,2.48,[{from:4.0,to:5.0,sill:1.1,h:.9,glass:true},{from:7.5,to:8.6,sill:1.1,h:.9,glass:true}],camper,.16);w.wallX(6.0,2.4,9.7,2.48,[{from:8.6,to:9.35,sill:0,h:2.05}],camper,.16);w.wallZ(2.4,2.4,6,2.48,[],camper,.16);w.wallZ(9.7,2.4,6,2.48,[{from:3.3,to:4.25,sill:1.0,h:1.0,glass:true}],camper,.16);w.box({x:6.05,z:4.2,y:2.43,w:7.3,d:3.7,h:.07,material:art.material('paintedWood',0xd1c8b2,{seed:8}),name:'camper ceiling',solid:true});w.roofPanel(6.05,4.2,7.65,4.05,2.53,0,0x7e7e75);art.buildOverheadLight(w,6.1,4.1,2.25);art.buildSwingDoor(w,8.6,6.0,0,{width:.72,height:2.02,color:0x968c7a,openDistance:2.1,glass:true,label:'Camper door'});
    const bed=art.material('fabric',0x847868,{seed:4}),wood=art.material('wood',0x715641,{seed:5});w.box({x:4.0,z:3.35,w:1.82,d:1.22,h:.42,y:.22,material:wood,climbable:true,name:'Front bed base'});w.box({x:4.0,z:3.35,w:1.72,d:1.1,h:.22,y:.62,material:bed,climbable:true,name:'Front bed mattress'});
    w.box({x:6.3,z:3.35,w:1.55,d:.92,h:.88,material:art.material('paintedWood',0x7e7163,{seed:8}),climbable:true,name:'Kitchen counter'});for(let i=0;i<3;i++)w.box({x:5.8+i*.45,z:2.88,y:.35,w:.37,d:.025,h:.32,material:art.material('paintedWood',0x88796a,{seed:i+2}),solid:false});
    w.box({x:8.2,z:3.5,w:1.5,d:1.0,h:.34,y:.28,material:art.material('fabric',0x6d6258,{seed:3}),climbable:true,name:'Couch seat'});w.box({x:8.2,z:3.92,y:.45,w:1.48,d:.16,h:.62,material:art.material('fabric',0x756a5f,{seed:4}),solid:false});
    w.box({x:5.25,z:5.0,w:1.2,d:.98,h:.52,y:.1,material:wood,climbable:true,name:'Lower bunk'});w.box({x:5.25,z:5.0,w:1.2,d:.98,h:.42,y:1.08,material:wood,climbable:true,name:'Upper bunk'});w.box({x:8.2,z:5.08,w:1.05,d:.95,h:1.82,material:art.material('paintedWood',0x7c756d,{seed:9}),name:'Bathroom'});
    art.buildPicnicTable(w,4.7,7.55,Math.PI/2);art.buildBBQ(w,7.45,7.35);art.buildCrate(w,9.0,7.25,0,{width:1.5,height:.72,depth:1.0,color:0x5e8393,name:'Cooler stack'});buildTruck(w,13.4,3.8,-.08);buildTent(w,16,7.0,.12);buildCampfire(w,12.5,8.2);art.buildLumberStack(w,14,11.6,0,{width:2.6,height:.45,depth:.5});
    const water=new THREE.Mesh(new THREE.PlaneGeometry(8.6,2.5,12,4),new THREE.MeshPhysicalMaterial({color:0x4e8996,transparent:true,opacity:.72,roughness:.18,metalness:0,transmission:.08}));water.rotation.x=-Math.PI/2;water.position.set(15.8,.015,13.05);water.receiveShadow=true;water.userData.waterSurface={baseY:.015,phase:1.25};w.group.add(water);
    art.buildStringLights(w,[[2.7,6.45],[6.8,6.25],[10.2,7.1],[12.5,8.2]],2.38);art.buildAmbientParticles(w,{x:12.6,z:8.2,y:.25,width:3.6,depth:3.6,height:2.0,count:20,color:0xffd59a,kind:'pollen'});art.buildBench(w,11.0,10.0,.25);for(const [x,z,s] of [[2.0,8.2,.8],[8.2,11.4,.7],[19.0,8.7,.8],[10.3,12.5,.65]])art.buildBush(w,x,z,s,0x405f3f);for(const [x,z] of [[1.3,7.4],[6.0,10.9],[9.5,13.1],[18.8,12.1],[14.2,9.8]])art.buildGrassPatch(w,x,z,.9,{count:12});
    for(let x=10.8;x<20;x+=1.75)addTree(w,x,1.0+((x*7)%2),.72+((x*5)%3)*.07);for(const [x,z,s] of [[1.1,10.7,.8],[2.1,12.8,.72],[18.8,10.8,.74]])addTree(w,x,z,s);art.buildBeachUmbrella(w,17.2,12.0,-.25,.72);art.buildButterflies(w,{x:7,z:11,y:.55,width:5,depth:3,count:5,color:0xe8b55d});art.buildCloudLayer(w,{x:10,z:7,y:14,radius:12,count:5});art.buildAmbientBirds(w,{x:15,z:11,y:6.5,radius:4.5,count:3,color:0x33383c});
    [['Camp Chair',3.0,9],['Camp Chair',3.7,9.2],['Cooler',5.2,8.9],['Lantern',6.7,8.8],['Dog Toy',7.6,8.4],['Card Box',9.3,8.8],['Water Jug',10.2,8.2],['Firewood',11.6,6],['Camp Bin',14,5.5],['Rock',17,9],['Camp Chair',18,9.6],['Rock',13.5,12.2]].forEach(([t,x,z],i)=>w.addProp(t,x,z,i*.2));return w;
  }

  function buildAcreage(){
    const w=new WorldBuilder(game.scene,'acreage');w.bounds={minX:.2,maxX:25.2,minZ:.2,maxZ:17.3};w.spawn={x:9.2,z:5.6};w.floor(12.6,8.65,25.1,17.2,0x58754c,-.055,'dirt');w.floor(11.4,3.6,8.5,5.2,0x7d776d,-.02,'gravel');
    const deckWood=art.material('wood',0x7d5d42,{seed:22});for(let i=0;i<11;i++)w.box({x:3.4,z:2.7-1.0+i*.2,y:.2,w:4.0,d:.16,h:.12,material:deckWood,climbable:true,name:'Deck plank'});for(const xx of [1.45,5.35])for(const zz of [1.7,3.7])w.box({x:xx,z:zz,w:.12,d:.12,h:1.05,material:deckWood,climbable:true,name:'Deck post'});
    art.buildHotTub(w,5.6,2.5);art.buildCrate(w,6.95,3.0,0,{width:.9,height:.95,depth:1.1,color:0x4e5b50,name:'Bins'});buildTrailer(w,11.1,3.2,.03);buildBoat(w,14.8,3.2,-.08);buildShopBuilding(w,3.0,8.4,2.7,2.8,'Quad shop',0x796d60);buildShopBuilding(w,6.0,8.4,2.7,2.8,"John's tool shop",0x6f665d);buildShopBuilding(w,3.1,11.55,2.8,2.1,'Storage shed',0x6b625a);buildTrampoline(w,10.0,9.0);buildPool(w,13.2,9.1);buildCampfire(w,18.0,4.0);buildShopBuilding(w,21.0,3.3,2.25,2.0,'Garden shed',0x615a51,true);
    art.buildBench(w,16.7,5.25,-.2);art.buildStringLights(w,[[15.8,3.1],[18.0,2.6],[20.2,3.3],[19.5,5.6],[16.4,5.7]],2.25);art.buildLampPost(w,8.0,4.7,2.25,{activeLight:true,intensity:.48});art.buildPlanter(w,4.5,4.75,0,{width:1.05});for(const [x,z,s] of [[7.5,13.2,.8],[12.0,14.6,.75],[23.2,6.8,.8],[1.0,6.2,.7]])art.buildBush(w,x,z,s,0x4a7047);for(const [x,z] of [[7.7,6.0],[11.5,6.2],[15.1,7.1],[23.3,11.8],[5.0,14.2]])art.buildGrassPatch(w,x,z,1,{count:14});
    for(let i=0;i<7;i++){const soil=new THREE.Mesh(new THREE.BoxGeometry(.52,.08,3.3),art.material('dirt',0x6b4f38,{seed:i+20}));soil.position.set(17.7+i*.68,.04,7.5);soil.receiveShadow=true;w.group.add(soil);for(let j=0;j<4;j++){const plant=new THREE.Mesh(new THREE.SphereGeometry(.12,10,8),art.material('paintedWood',0x4f7d4b));plant.position.set(17.7+i*.68,.18,6.45+j*.68);w.group.add(plant)}}
    addFence(w,17.7,12.4,7,'x');addFence(w,14.3,14.2,3.5,'z');addFence(w,21.1,14.2,3.5,'z');for(let x=16;x<24;x+=1.55)addTree(w,x,10.25+((x*3)%2),.72);for(let i=0;i<8;i++)addTree(w,.8+i*.8,15.0-(i%2)*.7,.65);art.buildNoticeBoard(w,7.0,5.2,.1,{titleColor:0x6e5c50});art.buildAmbientBirds(w,{x:17,z:12,y:7,radius:5,count:4});
    [['Flower Pot',4.2,4.4],['Watering Can',5.0,4.3],['Tire',8.4,5.1],['Toolbox',7.5,7.1],['Gas Can',6.6,9.7],['Garbage Can',4.2,12.4],['Camp Chair',16.5,4.8],['Camp Chair',17.3,4.7],['Cooler',19.2,4.8],['Rock',21.8,8.6],['Pallet',13.8,12.3],['Feed Bucket',17.4,13.5]].forEach(([t,x,z],i)=>w.addProp(t,x,z,i*.23));return w;
  }

  function buildFarm(){
    const w=new WorldBuilder(game.scene,'farm');w.bounds={minX:.2,maxX:22.2,minZ:.2,maxZ:15.8};w.spawn={x:6,z:7};w.floor(11.1,7.9,22.1,15.7,0x687352,-.055,'dirt');buildShopBuilding(w,4.1,3.2,4.8,3.8,'Chicken coop',0x856d50,true);buildShopBuilding(w,9.1,3.0,3.35,3.1,'Old shed',0x6b5c4e,true);art.buildSeaCan(w,15.1,3.15,0);art.buildLumberStack(w,18.55,6.2,0,{width:3.0,height:1.3,depth:1.5});art.buildCrate(w,19.25,7.65,0,{width:1.0,height:.45,depth:.72,name:'Goat step'});art.buildCrate(w,18.65,8.08,0,{width:1.0,height:.84,depth:.72,name:'Goat step'});art.buildCrate(w,18.05,8.5,0,{width:1.0,height:1.18,depth:.72,name:'Goat stair'});
    addFence(w,6.5,9.7,11,'x');addFence(w,1.0,12.3,5.2,'z');addFence(w,12.0,12.3,5.2,'z');addFence(w,16.8,10.2,8,'x');addFence(w,13,12.5,4.6,'z');addFence(w,20.7,12.5,4.6,'z');
    art.buildBarnStall(w,3.2,11.3,0,{width:3.4,depth:2.0});art.buildBarnStall(w,7.4,11.3,0,{width:3.4,depth:2.0});art.buildBarnStall(w,16.5,12.2,0,{width:5.8,depth:2.5});
    const mud=new THREE.Mesh(new THREE.CylinderGeometry(1.55,1.55,.07,36),art.material('dirt',0x594333,{seed:33}));mud.position.set(15.8,.035,12.0);mud.receiveShadow=true;w.group.add(mud);
    art.buildLampPost(w,11.6,5.7,2.3,{activeLight:true,intensity:.48});art.buildToolRack(w,9.0,4.62,0);art.buildCabinet(w,3.0,4.82,0,{width:.9,height:1.45,color:0x6a604d});art.buildAmbientParticles(w,{x:9,z:10.5,y:.25,width:12,depth:7,height:2.2,count:30,color:0xe6d5a5,kind:'dust'});for(const [x,z,s] of [[1.0,7.8,.8],[12.4,7.3,.7],[21.1,11.2,.8],[13.2,14.4,.75]])art.buildBush(w,x,z,s,0x506a42);for(const [x,z] of [[2.0,8.7],[9.4,8.8],[14.2,8.4],[20.5,6.8],[13.0,13.8]])art.buildGrassPatch(w,x,z,1,{count:16,color:0x596e42});art.buildRockCluster(w,21.0,2.1,.8);
    for(let i=0;i<5;i++)addNpcAnimal(w,i<2?'goat':i<4?'pig':'peacock',4+i*2,11+(i%2));for(const [x,z,s] of [[.7,2.0,.7],[21.0,8.2,.75],[21.1,14.5,.7]])addTree(w,x,z,s);art.buildMarketStall(w,10.8,14.3,Math.PI,{color:0x8a7250,width:1.9});art.buildNoticeBoard(w,1.4,5.8,.04,{titleColor:0x5f6f4b});art.buildAmbientBirds(w,{x:10,z:10,y:6.8,radius:5.3,count:5});
    [['Feed Barrel',2.4,6.8],['Trough',4,7.0],['Hay Bale',6.2,7.5],['Pallet',8.0,7.8],['Feed Sack',10.1,6.8],['Egg Crate',3.0,4.9],['Feed Bucket',11.5,9],['Mud Bucket',15,10.5],['Garbage Can',20,4.8],['Toolbox',13.3,5.0],['Tire',17.2,5.2],['Lumber',7.0,13.2]].forEach(([t,x,z],i)=>w.addProp(t,x,z,i*.19));return w;
  }

  function buildTractor(w,x,z,rot=0){return art.buildTractor(w,x,z,rot)}
  function buildMotorcycle(w,x,z,rot=0){return art.buildMotorcycle(w,x,z,rot)}
  function buildFireplace(w,x,z,rot=0){return art.buildFireplace(w,x,z,rot)}
  function buildPapaChair(w,x,z,rot=0){return art.buildPapaChair(w,x,z,rot)}
  function buildTruck(w,x,z,rot=0){return art.buildTruck(w,x,z,rot)}
  function buildTent(w,x,z,rot=0){return art.buildTent(w,x,z,rot)}
  function buildCampfire(w,x,z){return art.buildCampfire(w,x,z)}
  function buildTrailer(w,x,z,rot=0){return art.buildTrailer(w,x,z,rot)}
  function buildBoat(w,x,z,rot=0){return art.buildBoat(w,x,z,rot)}
  function buildShopBuilding(w,x,z,width,depth,name,color,open=false){
    w.floor(x,z,width,depth,0x756a5d,-.02,'concrete');const h=2.5,backOpen=open?[]:[{from:x-.55,to:x+.55,sill:0,h:2.04}];w.wallX(z-depth/2,x-width/2,x+width/2,h,backOpen,color,.16,name);w.wallX(z+depth/2,x-width/2,x+width/2,h,[{from:x-.58,to:x+.58,sill:0,h:2.08}],color,.16,name);w.wallZ(x-width/2,z-depth/2,z+depth/2,h,[],color,.16,name);w.wallZ(x+width/2,z-depth/2,z+depth/2,h,[{from:z-.48,to:z+.48,sill:.95,h:.9,glass:true}],color,.16,name);art.buildSwingDoor(w,x-.58,z+depth/2+.015,0,{width:1.12,height:2.02,color:art.shadeHex(color,-.05),openDistance:2.35,label:`${name} door`});w.roofPanel(x,z,width+.32,depth+.4,2.54,0,0x4d4540);const trim=art.material('paintedWood',0xe2d5c2,{seed:3});for(const xx of [x-width/2+.04,x+width/2-.04])w.box({x:xx,z,y:0,w:.08,d:.08,h:2.5,material:trim,solid:false});art.buildOverheadLight(w,x,z,2.28);return w;
  }
  function buildTrampoline(w,x,z){return art.buildTrampoline(w,x,z)}
  function buildPool(w,x,z){return art.buildPool(w,x,z)}

  function createPropMesh(type){return art.createPropMesh(type,propDef(type));}

  function addNpcAnimal(w,type,x,z){const p={id:`npc-${type}-${x}-${z}`,type};const rig=buildAnimalRig(type);rig.position.set(x,0,z);rig.rotation.y=Math.random()*Math.PI*2;rig.userData.npc={baseX:x,baseZ:z,timer:Math.random()*3+1};w.group.add(rig);if(!w.npcs)w.npcs=[];w.npcs.push(rig);return p;}
  function buildAnimalRig(type){
    const g=new THREE.Group(),dark=art.material('rubber',0x26221f),hoof=art.material('rubber',0x2f2925),eye=art.material('rubber',0x171513);g.name=`npc-${type}`;
    const add=o=>{o.castShadow=true;o.receiveShadow=true;g.add(o);return o};
    if(type==='pig'){
      const pink=art.material('fabric',0xb97965,{seed:19}),snout=art.material('skin',0xd29882,{roughness:.92});
      add(art.sphere(.42,pink,[0,.48,.04],[1.34,.74,.9]));add(art.sphere(.25,pink,[0,.58,-.48],[1,.9,.95]));
      add(art.cylinder(.095,.11,.1,snout,[0,.52,-.69],[Math.PI/2,0,0],16));for(const sx of [-.04,.04])add(art.sphere(.012,dark,[sx,.53,-.75]));
      for(const sx of [-.15,.15]){const ear=new THREE.Mesh(new THREE.ConeGeometry(.075,.18,8),pink);ear.position.set(sx,.8,-.48);ear.rotation.z=sx<0?.28:-.28;add(ear);add(art.sphere(.018,eye,[sx*.52,.64,-.68]));}
      for(const sx of [-.25,.25])for(const zz of [-.19,.28]){add(art.cylinder(.045,.055,.35,pink,[sx,.2,zz],[],9));add(art.box(.09,.055,.11,hoof,[sx,.04,zz-.02]));}
      const tail=art.torus(.11,.018,pink,[0,.58,.54],[0,Math.PI/2,0],Math.PI*1.55);add(tail);
    }else if(type==='peacock'){
      const teal=art.material('fabric',0x245a5d,{seed:22}),blue=art.material('paintedMetal',0x274f86,{roughness:.75}),green=art.material('fabric',0x4d7a52,{seed:24}),gold=art.material('paintedMetal',0xc09b42);
      add(art.sphere(.25,teal,[0,.48,.02],[.9,1.12,.92]));add(art.capsule(.075,.42,blue,[0,.76,-.12],[-.18,0,0]));add(art.sphere(.13,blue,[0,1.03,-.18]));
      add(art.cylinder(.018,.022,.45,hoof,[-.07,.2,.02],[],7));add(art.cylinder(.018,.022,.45,hoof,[.07,.2,.02],[],7));
      for(const sx of [-.05,0,.05]){add(art.cylinder(.008,.008,.14,gold,[sx,1.18,-.18],[0,0,sx*2],6));add(art.sphere(.018,gold,[sx,1.25,-.18]));}
      for(let i=-4;i<=4;i++){const a=i*.15;const feather=new THREE.Mesh(new THREE.SphereGeometry(.32,14,10),green);feather.scale.set(.38,1.45,.13);feather.position.set(Math.sin(a)*.64,.7+Math.cos(a)*.12,.42+Math.abs(i)*.035);feather.rotation.z=-a*.65;add(feather);add(art.sphere(.048,blue,[feather.position.x,feather.position.y+.27,feather.position.z-.04],[1,.8,.25]));add(art.sphere(.024,gold,[feather.position.x,feather.position.y+.27,feather.position.z-.065],[1,.8,.25]));}
      for(const sx of [-.045,.045])add(art.sphere(.014,eye,[sx,1.07,-.29]));
    }else{
      const fur=art.material('hair',0xc7baa1,{roughness:.96}),cream=art.material('hair',0xe3d9c8,{roughness:.96}),horn=art.material('stone',0x8c806d,{roughness:.9});
      add(art.capsule(.28,.48,fur,[0,.58,.08],[Math.PI/2,0,0],[1,.95,1.12]));add(art.capsule(.12,.28,fur,[0,.75,-.38],[.35,0,0]));add(art.sphere(.2,cream,[0,.84,-.55],[.92,1,.9]));add(art.sphere(.11,cream,[0,.78,-.72],[.8,.6,1.05]));
      for(const sx of [-.12,.12]){const hornMesh=new THREE.Mesh(new THREE.ConeGeometry(.035,.3,9),horn);hornMesh.position.set(sx,.99,-.5);hornMesh.rotation.z=sx<0?-.2:.2;hornMesh.rotation.x=-.18;add(hornMesh);const ear=new THREE.Mesh(new THREE.ConeGeometry(.055,.2,8),fur);ear.position.set(sx*.95,.91,-.55);ear.rotation.z=sx<0?.8:-.8;add(ear);add(art.sphere(.018,eye,[sx*.5,.87,-.7]));}
      add(art.capsule(.035,.2,cream,[0,.68,-.69],[.2,0,0],[.9,1,.9]));
      for(const sx of [-.19,.19])for(const zz of [-.18,.29]){const leg=art.cylinder(.042,.052,.46,fur,[sx,.27,zz],[],9);add(leg);add(art.box(.08,.06,.11,hoof,[sx,.04,zz-.02]));}
      add(art.capsule(.032,.24,fur,[0,.68,.48],[-.65,0,0]));
    }
    return g;
  }

  function spawnActors(){
    const players=roomState.players,spawn=game.world.spawn;players.forEach((p,i)=>{const actor=createActor(p,i,spawn);game.actors.push(actor);game.actorsById.set(p.id,actor);if(p.id===roomState.viewerId)game.player=actor});if(!game.player)game.player=game.actors[0];game.cameraYaw=game.player.yaw;
  }
  function createActor(p,index,spawn){
    const person=personById(p.avatar),dog=isDog(person),angle=index/playerCountSafe()*Math.PI*2,r=1.2+Math.floor(index/6)*.7;const actor={id:p.id,person,isBot:!!p.isBot,difficulty:p.difficulty||'medium',role:p.role||'hider',health:p.health??3,alive:p.alive!==false,prop:p.prop||null,propChanges:p.propChanges??3,decoys:p.decoys??10,flash:p.flash!==false,locked:false,x:spawn.x+Math.cos(angle)*r,z:spawn.z+Math.sin(angle)*r,y:0,yaw:Math.PI,pitch:0,vx:0,vy:0,vz:0,radius:dog ? .4 : .33,height:dog ? .98 : 1.82,grounded:true,mantle:null,anim:'idle',animTime:Math.random()*2,recoil:0,netTarget:null,netBuffer:new studio.SnapshotBuffer({delayMs:92,maxExtrapolateMs:85}),lastShot:0,ai:{timer:0,target:null,detected:null,changeTimer:5+Math.random()*5,decoyTimer:4+Math.random()*8}};
    actor.rig=dog?buildDogRig(person,actor.role):buildHumanRig(person,actor.role);actor.rig.userData.actor=actor;game.scene.add(actor.rig);applyActorVisual(actor);actor.rig.position.set(actor.x,actor.y,actor.z);actor.rig.rotation.y=actor.yaw;queueMicrotask(()=>tryUpgradeAuthoredActor(actor));return actor;
  }
  function playerCountSafe(){return Math.max(1,roomState?.players?.length||1);}

  function buildHumanRig(person,role){
    const style=OUTFITS[person.id]||OUTFITS.john;return art.buildHumanRig(style,{id:person.id,role});
  }
  function buildDogRig(person,role){
    const style=OUTFITS[person.id]||OUTFITS.gunner;return art.buildDogRig(style,{id:person.id,role});
  }
  function buildGun(scale=.68){return art.buildPropZapper(scale);}
  async function tryUpgradeAuthoredActor(actor){try{await assets.ensureManifest();const dog=isDog(actor.person),entry=assets.entry(dog?'dogs':'characters',actor.person.id);if(!entry?.file||!game?.actorsById?.has(actor.id))return;const rig=await(dog?assets.loadDog(actor.person.id,{fallback:null}):assets.loadCharacter(actor.person.id,{fallback:null}));if(!rig||!game?.actorsById?.has(actor.id))return;rig.position.copy(actor.rig.position);rig.rotation.copy(actor.rig.rotation);const weapon=await assets.loadProp('propZapper',{fallback:()=>art.buildPropZapper(dog?.46:.62)});if(weapon){studio.attachToRigSocket(rig,weapon,{socket:dog?'back':'rightHand',position:dog?[0,.08,.04]:[0,-.02,-.08],rotation:dog?[0,0,0]:[-Math.PI/2,0,Math.PI],scale:dog?.7:.85});rig.userData.parts={...(rig.userData.parts||{}),weapon}}tagActorMeshes(rig);const old=actor.rig;actor.rig=rig;actor.rig.userData.actor=actor;actor.authored=true;actor.animMixer=new studio.SemanticAnimationMixer(THREE,rig,rig.userData.authoredAnimations||[]);game.scene.add(rig);game.scene.remove(old);applyActorVisual(actor)}catch(e){console.warn('Authored Prop Hunt actor upgrade skipped',e)}}

  function tagActorMeshes(g){g.traverse(o=>{if(o.isMesh){o.castShadow=true;o.receiveShadow=true;o.userData.actorHit=true}});}

  function applyActorVisual(actor){
    if(actor.prop){if(actor.propMesh)actor.rig.remove(actor.propMesh);actor.rig.traverse(o=>{if(o!==actor.rig)o.visible=false});const m=createPropMesh(actor.prop);actor.propMesh=m;actor.rig.add(m);const d=propDef(actor.prop);actor.height=d.h;actor.radius=Math.max(.18,Math.min(.55,Math.max(d.w,d.d)*.45));}
    else{if(actor.propMesh){actor.rig.remove(actor.propMesh);actor.propMesh=null}actor.rig.traverse(o=>o.visible=true);const dog=isDog(actor.person);actor.height=dog ? .98 : 1.82;actor.radius=dog ? .4 : .33;const parts=actor.rig.userData.parts;if(parts?.weapon)parts.weapon.visible=actor.role==='hunter';}
  }

  function bindControls(){
    // Unified controls: left stick moves, any open stage area looks, and controllers use modern twin-stick conventions.
    window.addEventListener('keydown',onKeyDown);window.addEventListener('keyup',onKeyUp);window.addEventListener('resize',onResize);const stage=root.querySelector('#ph3Stage'),joyEl=root.querySelector('#phJoy'),stick=root.querySelector('#phStick');stage.addEventListener('pointerdown',()=>audio?.unlock?.(),{once:true});
    game.controlDisposers.push(gameplay.bindPointerLook(stage,game.cameraRig,{ignoreSelector:'button,select,input,a,#phJoy'}));
    game.controlDisposers.push(gameplay.bindVirtualJoystick(joyEl,stick,joy,{deadzone:.09,travel:.34}));game.controlDisposers.push(gameplay.mountControlPreferences(stage,game.cameraRig,{layoutTarget:stage,top:'112px'}));game.controlDisposers.push(studio.mountAudioPreferences(stage,audio,{top:'112px',right:'72px'}));
    stage.addEventListener('contextmenu',e=>e.preventDefault());
    const jump=root.querySelector('#phJump');jump.onpointerdown=()=>{input.jumpQueued=true;input.jumpHeld=true};jump.onpointerup=jump.onpointercancel=()=>{input.jumpHeld=false};
    root.querySelector('#phSprint').onclick=()=>{input.sprint=!input.sprint;root.querySelector('#phSprint').classList.toggle('active',input.sprint)};
    const aim=root.querySelector('#phAim');aim.onpointerdown=()=>{input.aim=true};aim.onpointerup=aim.onpointercancel=()=>{input.aim=false};
    // Desktop shooter convention without sacrificing drag-to-look: hold right mouse to aim, then left-click to fire.
    const mouseDown=e=>{if(e.target?.closest?.('button,select,input,a,#phJoy'))return;if(e.button===2){input.aim=true;e.preventDefault()}else if(e.button===0&&input.aim)shoot()};
    const mouseUp=e=>{if(e.button===2)input.aim=false};stage.addEventListener('pointerdown',mouseDown);window.addEventListener('pointerup',mouseUp);game.controlDisposers.push(()=>{stage.removeEventListener('pointerdown',mouseDown);window.removeEventListener('pointerup',mouseUp)});
    root.querySelector('#phShoulder').onclick=()=>game.cameraRig.swapShoulder();root.querySelector('#phShoot').onpointerdown=()=>shoot();root.querySelector('#phProp').onclick=()=>changeProp();root.querySelector('#phFlashBtn').onclick=()=>flash();root.querySelector('#phDecoy').onclick=()=>dropDecoy();root.querySelector('#phLock').onclick=()=>toggleLock();
    onResize();
  }
  function updateJoy(e){const el=root.querySelector('#phJoy'),stick=root.querySelector('#phStick'),r=el.getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height/2,dx=e.clientX-cx,dy=e.clientY-cy,max=r.width*.31,l=Math.hypot(dx,dy)||1,k=Math.min(1,max/l);joy.x=dx/max*k;joy.z=-dy/max*k;stick.style.transform=`translate(${dx*k}px,${dy*k}px)`;}
  function onKeyDown(e){keys[e.code]=true;if(e.code==='Space'){if(!e.repeat)input.jumpQueued=true;input.jumpHeld=true;e.preventDefault()}if(e.code==='KeyC'&&!e.repeat)game?.cameraRig?.swapShoulder();if(e.code==='KeyE')changeProp();if(e.code==='KeyF')flash();if(e.code==='KeyQ')dropDecoy();if(e.code==='KeyL')toggleLock();}
  function onKeyUp(e){keys[e.code]=false;if(e.code==='Space')input.jumpHeld=false;}
  function onResize(){if(!game?.renderer)return;const c=game.renderer.domElement,r=c.getBoundingClientRect();game.renderer.setSize(Math.max(320,r.width),Math.max(360,r.height),false);game.camera.aspect=Math.max(.5,r.width/Math.max(1,r.height));game.camera.updateProjectionMatrix();}

  function loop(now){if(!game)return;const dt=Math.min(.04,Math.max(.001,(now-lastFrame)/1000));lastFrame=now;update(dt,now);game.performance?.sample(dt);game.renderer.render(game.scene,game.camera);raf=requestAnimationFrame(loop);}
  function update(dt,now){
    if(!game.player)return;
    // Gamepad support is sampled at frame rate so aiming and movement feel analog instead of menu-like.
    gameplay.applyGamepadLook(game.cameraRig.state,dt);const pad=gameplay.readGamepadButtons();
    if(pad.jump&&!game.padPrev.jump)input.jumpQueued=true;if(pad.shoulder&&!game.padPrev.shoulder)game.cameraRig?.swapShoulder();if(pad.shoot&&!game.padPrev.shoot)shoot();game.padAim=pad.aim;game.padSprint=pad.sprint;game.padJumpHeld=pad.jump;game.padPrev=pad;
    game.cameraYaw=game.cameraRig.state.yaw;game.cameraPitch=game.cameraRig.state.pitch;
    game.shotCooldown=Math.max(0,(game.shotCooldown||0)-dt);game.cinematic?.update(dt);audio?.update(dt);updatePhase();updatePlayer(dt);updateBots(dt);updateRemoteActors(dt);updateActorVisuals(dt);updateNpcs(dt);updateEffects(dt);updateCamera(dt);updateHud();if(network&&now-game.lastNetworkSend>100){sendNetworkSnapshots();game.lastNetworkSend=now}
  }

  function updatePhase(){
    if(network)return;
    const now=Date.now();if(roomState.phase==='hide'&&now>=roomState.phaseEndsAt){roomState.phase='hunt';roomState.phaseEndsAt=now+180000*TEST_SCALE;addFeed('Hunt started.')}if(roomState.phase==='hunt'){
      const h=game.actors.filter(a=>a.role==='hider'&&a.alive);if(!h.length)finishSoloRound('hunters');else if(now>=roomState.phaseEndsAt)finishSoloRound('hiders');
    }
  }
  function finishSoloRound(winner){if(roomState.phase==='roundEnd'||roomState.phase==='matchEnd')return;roomState.wins[winner]++;roomState.roundResult=winner;if(roomState.round>=roomState.settings.rounds){roomState.phase='matchEnd';roomState.phaseEndsAt=0;showMatchEnd()}else{roomState.phase='roundEnd';roomState.phaseEndsAt=Date.now()+3500;modal(`<div class="status-large"><span class="eyebrow">ROUND ${roomState.round} COMPLETE</span><strong>${winner==='hiders'?'HIDERS SURVIVE':'HUNTERS CLEAR THE MAP'}</strong><p>Hiders ${roomState.wins.hiders} - Hunters ${roomState.wins.hunters}</p><button id="phNextRound" class="btn success">NEXT ROUND</button></div>`,m=>m.querySelector('#phNextRound').onclick=()=>nextSoloRound())}}
  function nextSoloRound(){closeModal();roomState.round++;const roles=core.assignRoles(roomState.players,roomState.round);roomState.players.forEach(p=>{p.role=roles[p.id];p.health=3;p.alive=true;p.prop=null});roomState.phase='hide';roomState.phaseEndsAt=Date.now()+30000*TEST_SCALE;const next=mapFor(roomState.settings.mapKey,roomState.round);disposeRoot();ensureEngine().then(()=>startEngine(next));}

  function updatePlayer(dt){
    const a=game.player;if(!a.alive)return;if(a.locked&&a.prop){a.vx=a.vz=0;animateMantle(a,dt);return}
    {const oldYaw=a.yaw;a.yaw=game.cameraYaw;let d=a.yaw-oldYaw;while(d>Math.PI)d-=Math.PI*2;while(d<-Math.PI)d+=Math.PI*2;a.turnRate=d/Math.max(dt,.001)}a.pitch=game.cameraPitch;if(a.mantle){animateMantle(a,dt);return}
    const intent=gameplay.movementIntent(keys,joy,game.cameraYaw),sprint=gameplay.wantsSprint(keys,input,{sprint:game.padSprint},intent);
    const preset=game.cameraRig.cfg;gameplay.smoothVelocity(a,intent,sprint?preset.runSpeed:preset.walkSpeed,dt,{accel:preset.groundAccel,brake:preset.groundBrake,airControl:preset.airControl});
    gameplay.updateJumpMemory(a,dt,input.jumpQueued);gameplay.consumeBufferedJump(a,preset.jumpSpeed);gameplay.applyVariableJump(a,input.jumpHeld||game.padJumpHeld);
    const moving=Math.hypot(a.vx,a.vz)>.15;moveActor(a,a.vx*dt,a.vz*dt,(a._jumpBuffer||0)>0||a.vy>1.2);resolveActorOverlap(a);input.jumpQueued=false;
    a.vy-=preset.gravity*dt;{const nextY=a.y+a.vy*dt,ceiling=a.vy>0?core.ceilingBottom(a.x,a.z,a.radius,a.y,a.height,nextY,game.world.colliders):null;if(ceiling!=null){a.y=ceiling-a.height-.015;a.vy=0}else a.y=nextY}
    const support=core.supportHeight(a.x,a.z,a.radius,game.world.colliders,a.y+.08,.46);if(a.y<=support){if(a.vy<-.8){a.anim='land';a.landTimer=.12}a.y=support;a.vy=0;a.grounded=true}else a.grounded=false;
    a.landTimer=Math.max(0,(a.landTimer||0)-dt);a.anim=gameplay.resolveLocomotionAnim(a,{moving,sprinting:sprint,aiming:input.aim||game.padAim});
    a.rig.position.set(a.x,a.y,a.z);a.rig.rotation.y=a.yaw;
  }
  function resolveActorOverlap(a){
    for(const b of game.actors){
      if(b===a||!b.alive)continue;
      const vertical=a.y<b.y+b.height&&a.y+a.height>b.y;if(!vertical)continue;
      let dx=a.x-b.x,dz=a.z-b.z,d=Math.hypot(dx,dz),min=(a.radius+b.radius)*.88;if(d>=min)continue;
      if(d<.001){const sign=String(a.id).localeCompare(String(b.id))>=0?1:-1;dx=sign;dz=.25;d=Math.hypot(dx,dz)}
      const push=Math.min(.12,(min-d)*.55);moveActor(a,dx/d*push,dz/d*push,false);
    }
  }
  function moveActor(a,dx,dz,jumpRequested=false){const r=core.attemptCharacterMove(a,dx,dz,game.world.colliders,{radius:a.radius,height:a.height,maxStep:.42,maxMantle:isDog(a.person) ? .8 : 1.2,jumpRequested});if(r.mantle&&!a.prop){startMantle(a,r.mantle.collider,dx,dz);return}a.x=clamp(r.x,game.world.bounds.minX,game.world.bounds.maxX);a.z=clamp(r.z,game.world.bounds.minZ,game.world.bounds.maxZ);if(r.y>a.y)a.y=r.y;}
  function startMantle(a,b,dx,dz){const dirLen=Math.hypot(dx,dz)||1,dirX=dx/dirLen,dirZ=dz/dirLen,top=(b.y||0)+b.h,tx=clamp(a.x+dirX*(a.radius+.48),b.x-b.w/2+a.radius,b.x+b.w/2-a.radius),tz=clamp(a.z+dirZ*(a.radius+.48),b.z-b.d/2+a.radius,b.z+b.d/2-a.radius);a.mantle={t:0,duration:.36,fromX:a.x,fromY:a.y,fromZ:a.z,toX:tx,toY:top+.015,toZ:tz};a.vx=a.vz=a.vy=0;a.anim='mantle';}
  function animateMantle(a,dt){if(!a.mantle)return;const m=a.mantle;m.t=Math.min(1,m.t+dt/m.duration);const e=m.t<.5?2*m.t*m.t:1-Math.pow(-2*m.t+2,2)/2;a.x=core.lerp(m.fromX,m.toX,e);a.z=core.lerp(m.fromZ,m.toZ,e);a.y=core.lerp(m.fromY,m.toY,e)+Math.sin(Math.PI*m.t)*.22;a.rig.position.set(a.x,a.y,a.z);if(m.t>=1){a.y=m.toY;a.mantle=null;a.grounded=true;a.anim='idle'}}

  function updateBots(dt){
    for(const a of game.actors){if(!a.isBot||!a.alive)continue;if(network&&!roomState.isHost)continue;if(a.mantle){animateMantle(a,dt);continue}a.ai.timer-=dt;a.ai.changeTimer-=dt;a.ai.decoyTimer-=dt;const enemies=game.actors.filter(b=>b.alive&&b.role!==a.role);if(a.role==='hunter'&&roomState.phase==='hunt')botHunter(a,enemies,dt);else if(a.role==='hider')botHider(a,enemies,dt);else wanderBot(a,dt);resolveActorOverlap(a);a.vy-=18*dt;{const nextY=a.y+a.vy*dt,ceiling=a.vy>0?core.ceilingBottom(a.x,a.z,a.radius,a.y,a.height,nextY,game.world.colliders):null;if(ceiling!=null){a.y=ceiling-a.height-.015;a.vy=0}else a.y=nextY}const support=core.supportHeight(a.x,a.z,a.radius,game.world.colliders,a.y+.08,.46);if(a.y<=support){a.y=support;a.vy=0;a.grounded=true}else a.grounded=false;a.rig.position.set(a.x,a.y,a.z);a.rig.rotation.y=a.yaw;}
  }
  function botHunter(a,enemies,dt){let target=a.ai.detected;if(!target||!target.alive||!hasLineOfSight(a,target)){target=enemies.filter(e=>e.role==='hider').sort((u,v)=>core.dist2(a,u)-core.dist2(a,v)).find(e=>core.dist2(a,e)<9&&hasLineOfSight(a,e));a.ai.detected=target||null}if(target){const dx=target.x-a.x,dz=target.z-a.z,d=Math.hypot(dx,dz)||1;a.yaw=Math.atan2(dx,-dz);if(d>2.1)moveActor(a,dx/d*3.5*dt,dz/d*3.5*dt,false);a.anim=d>2.1?'run':'aim';if(d<8&&hasLineOfSight(a,target)&&performance.now()-a.lastShot>(a.difficulty==='hard'?350:a.difficulty==='easy'?900:600)){a.lastShot=performance.now();botShoot(a,target)}}else wanderBot(a,dt);}
  function botHider(a,hunters,dt){if(!a.prop){const p=nearestProp(a,3.2);if(p)applyDisguise(a,p.type,false)}const hunter=[...hunters].sort((u,v)=>core.dist2(a,u)-core.dist2(a,v))[0],danger=hunter?core.dist2(a,hunter):999;if(danger<4.2){a.locked=false;const dx=a.x-hunter.x,dz=a.z-hunter.z,l=Math.hypot(dx,dz)||1;a.yaw=Math.atan2(dx,-dz);moveActor(a,dx/l*3.6*dt,dz/l*3.6*dt,true);a.anim='run';if(a.flash&&danger<2.7)useFlash(a,false)}else{a.locked=!!a.prop;a.anim='idle';if(!a.prop)wanderBot(a,dt)}}
  function wanderBot(a,dt){if(a.ai.timer<=0||!a.ai.target){a.ai.timer=2+Math.random()*3;a.ai.target={x:clamp(a.x+(Math.random()-.5)*7,game.world.bounds.minX+.8,game.world.bounds.maxX-.8),z:clamp(a.z+(Math.random()-.5)*7,game.world.bounds.minZ+.8,game.world.bounds.maxZ-.8)}}const dx=a.ai.target.x-a.x,dz=a.ai.target.z-a.z,l=Math.hypot(dx,dz)||1;if(l>.35){a.yaw=Math.atan2(dx,-dz);moveActor(a,dx/l*1.7*dt,dz/l*1.7*dt,false);a.anim='walk'}else a.anim='idle';}
  function botShoot(a,target){if(!hasLineOfSight(a,target))return;const acc=a.difficulty==='hard' ? .88 : a.difficulty==='easy' ? .5 : .7;if(Math.random()>acc)return;registerHit(a,target);}
  function hasLineOfSight(a,b){const origin=new THREE.Vector3(a.x,a.y+a.height*.72,a.z),target=new THREE.Vector3(b.x,b.y+b.height*.58,b.z),dir=target.clone().sub(origin),dist=dir.length();dir.normalize();const ray=new THREE.Raycaster(origin,dir,.05,dist);const hits=ray.intersectObjects(game.world.raycastMeshes,true);return !hits.length||hits[0].distance>=dist-.25;}

  function updateRemoteActors(dt){if(!network)return;const now=performance.now();for(const a of game.actors){if(a===game.player||a.isBot&&roomState.isHost)continue;const t=a.netBuffer?.sample(now)||a.netTarget;if(t){a.netTarget=t;a.x=t.x??a.x;a.y=t.y??a.y;a.z=t.z??a.z;a.yaw=t.yaw??a.yaw;a.pitch=t.pitch??a.pitch;a.vx=t.vx??0;a.vy=t.vy??0;a.vz=t.vz??0;a.anim=t.anim||a.anim||'idle';a.rig.position.set(a.x,a.y,a.z);a.rig.rotation.y=a.yaw;const newProp=t.prop||null;if(newProp!==a.prop){spawnPoof(a.x,a.y+a.height*.45,a.z);a.prop=newProp;applyActorVisual(a)}}}}
  function applyRoomState(){if(!game||!roomState)return;if(roomState.round!==game.round){game.round=roomState.round;const next=roomState.activeMap||mapFor(roomState.settings.mapKey,roomState.round);disposeRoot();ensureEngine().then(()=>startEngine(next));return}for(const p of roomState.players){const a=game.actorsById.get(p.id);if(!a)continue;a.role=p.role;a.health=p.health;a.alive=p.alive;a.propChanges=p.propChanges;a.decoys=p.decoys;a.flash=p.flash;if(p.prop!==a.prop){spawnPoof(a.x,a.y+a.height*.45,a.z);a.prop=p.prop;applyActorVisual(a)}const parts=a.rig.userData.parts;if(parts?.weapon)parts.weapon.visible=a.role==='hunter'&&!a.prop;}if(roomState.phase==='matchEnd')showMatchEnd();}
  function handleNetworkAction(m){if(m.action==='flash'){const source=game.actorsById.get(m.playerId);if(source&&game.player.role==='hunter'&&core.dist2(source,game.player)<3.5)flashScreen();addFeed(`${source?.person?.name||'A hider'} fired a flash.`)}if(m.action==='hit'){const target=game.actorsById.get(m.targetId);if(target){target.health=m.health;target.alive=m.alive;target.role=m.role;gameplay.playTransientAnimation(target,'hit',460);if(!target.alive)spawnPoof(target.x,target.y+.6,target.z);addFeed(`${target.person.name} was hit. ${target.health}/3.`)}}if(m.action==='decoy')spawnDecoy(m.prop,m.position?.x||0,m.position?.z||0);}

  function sendNetworkSnapshots(){if(!ws||ws.readyState!==1)return;const sendActor=a=>ws.send(JSON.stringify({type:'snapshot',playerId:a.id,snapshot:{x:a.x,y:a.y,z:a.z,yaw:a.yaw,pitch:a.pitch,vx:a.vx,vy:a.vy,vz:a.vz,anim:a.anim,prop:a.prop,locked:a.locked,seq:Math.floor(performance.now())}}));sendActor(game.player);if(roomState.isHost)for(const a of game.actors)if(a.isBot)sendActor(a);}

  function propSurfaceAt(a){if(game?.mapKey==='camp')return Math.abs(a?.z||0)>9?'sand':'dirt';if(game?.mapKey==='farm')return'dirt';if(game?.mapKey==='acreage')return Math.abs(a?.x||0)<8&&Math.abs(a?.z||0)<8?'wood':'grass';if(game?.mapKey==='papa')return Math.abs(a?.x||0)<10&&Math.abs(a?.z||0)<9?'concrete':'gravel';return'default'}
  function updateActorVisuals(dt){for(const a of game.actors){if(!a.alive){a.rig.visible=false;continue}a.recoil=Math.max(0,(a.recoil||0)-dt*7);a.rig.visible=!(a===game.player&&a.cameraHidden);let focus=null;if(a===game.player){const dir=new THREE.Vector3();game.camera.getWorldDirection(dir);focus={x:a.x+dir.x*6,y:a.y+(isDog(a.person)?.8:1.48)+dir.y*6,z:a.z+dir.z*6}}else if(a.ai?.detected?.alive)focus={x:a.ai.detected.x,y:a.ai.detected.y+a.ai.detected.height*.55,z:a.ai.detected.z};else{const rival=game.actors.filter(o=>o!==a&&o.alive&&o.role!==a.role).sort((u,v)=>core.dist2(a,u)-core.dist2(a,v))[0];if(rival&&core.dist2(a,rival)<5.5)focus={x:rival.x,y:rival.y+rival.height*.55,z:rival.z}}const attention=gameplay.updateAttention(a,dt,focus,{headHeight:isDog(a.person)?.82:1.55,maxDistance:7});if(a.authored&&a.animMixer){let semantic=a.anim||'idle';if(a.role==='hunter'&&(a===game.player?(input.aim||game.padAim):a.ai?.detected))semantic='aim';a.animMixer.play(semantic,{timeScale:clamp(Math.hypot(a.vx||0,a.vz||0)/(semantic==='run'?4.5:2.5),.7,1.35)});a.animMixer.update(dt)}else{gameplay.animateFamilyRig(a,dt,{aim:a===game.player&&(input.aim||game.padAim),recoil:a.recoil||0,lookPitch:a.pitch||0,turnRate:a.turnRate||0,speed:Math.hypot(a.vx||0,a.vz||0),grounded:a.grounded,attention});studio.updateProceduralFace(a,dt,{expression:a.anim==='hit'?'hurt':a.role==='hunter'?'focused':'neutral'});studio.applyFootIK(a,THREE,{heightAt:(x,z)=>core.supportHeight(x,z,a.radius,game.world.colliders,a.y+.1,.5),dt,maxLift:.1})}if(!a.prop&&a.rig.visible)for(const ev of gameplay.consumeMotionEvents(a)){game.motionFx?.emit(a.x,a.y,a.z,{strength:ev.strength,kind:ev.type});if(a===game.player||core.dist2(a,game.player)<8)audio?.oneShot(ev.type==='land'?'land':'step',{volume:ev.type==='land'?.11:.03,pitch:.9+Math.random()*.18,pan:studio.computeStereoPan(game.cameraYaw,game.player,a),surface:propSurfaceAt(a)})}}}

  function updateNpcs(dt){for(const n of game.world.npcs||[]){const ai=n.userData.npc;ai.timer-=dt;ai.phase=(ai.phase||0)+dt;if(ai.timer<=0){ai.timer=1.5+Math.random()*3;ai.tx=ai.baseX+(Math.random()-.5)*1.6;ai.tz=ai.baseZ+(Math.random()-.5)*1.6}let moving=false;if(ai.tx!=null){const dx=ai.tx-n.position.x,dz=ai.tz-n.position.z,l=Math.hypot(dx,dz)||1;if(l>.08){moving=true;n.position.x+=dx/l*.35*dt;n.position.z+=dz/l*.35*dt;n.rotation.y=gameplay.dampAngle(n.rotation.y,Math.atan2(dx,-dz),7,dt)}}n.position.y=(moving?Math.abs(Math.sin(ai.phase*5.5))*.014:Math.sin(ai.phase*1.4)*.006);n.rotation.z=gameplay.damp(n.rotation.z||0,moving?Math.sin(ai.phase*5.5)*.012:0,7,dt)}}

  function updateEffects(dt){for(let i=game.effects.length-1;i>=0;i--){const e=game.effects[i];e.life-=dt;if(e.kind==='tracer')e.mesh.material.opacity=Math.max(0,e.life/e.max);if(e.kind==='spark'){e.vy-=8*dt;e.mesh.position.x+=e.vx*dt;e.mesh.position.y+=e.vy*dt;e.mesh.position.z+=e.vz*dt;e.mesh.material.opacity=Math.max(0,e.life/e.max)}if(e.life<=0){game.scene.remove(e.mesh);e.mesh.geometry?.dispose?.();e.mesh.material?.dispose?.();game.effects.splice(i,1)}}game.motionFx?.update(dt);if(game.world?.group)art.animateAmbience(game.world.group,performance.now()*.001,{player:game.player,dt})}

  function updateCamera(dt){
    const a=game.player;if(!a)return;const aim=input.aim||game.padAim,sprinting=gameplay.wantsSprint(keys,input,{sprint:game.padSprint},{strength:Math.min(1,Math.hypot(a.vx,a.vz)/(game.cameraRig.cfg.runSpeed||1))});
    game.cameraRig.state.aim=aim;game.cameraRig.update(a,game.world.colliders,dt,{aim,sprinting,dog:isDog(a.person),height:a.prop?a.height*.55:(isDog(a.person)?.72:1.38),velocity:{x:a.vx,z:a.vz},turnRate:a.turnRate||0,cameraBob:(a._motion?.landing||0)*-.025});
    game.cameraYaw=game.cameraRig.state.yaw;game.cameraPitch=game.cameraRig.state.pitch;game.cameraActualDistance=game.cameraRig.state.actualDistance;a.cameraHidden=game.cameraActualDistance<.7&&!a.prop;a.yaw=game.cameraYaw;
  }

  function shoot(){const a=game?.player;if(!a||a.role!=='hunter'||!a.alive||roomState.phase!=='hunt'||game.shotCooldown>0)return;game.shotCooldown=.11;a.recoil=.7;audio?.oneShot('zap',{volume:.12,pitch:.92+Math.random()*.12});game.cameraRig?.kick(.028,(Math.random()-.5)*.008,.025);const ray=new THREE.Raycaster();ray.setFromCamera(new THREE.Vector2(0,0),game.camera);ray.far=28;const targets=[...game.world.raycastMeshes];for(const d of game.decoys)d.traverse(o=>{if(o.isMesh&&o.visible)targets.push(o)});for(const n of game.world.npcs||[])n.traverse(o=>{if(o.isMesh&&o.visible)targets.push(o)});for(const b of game.actors)if(b!==a&&b.alive)b.rig.traverse(o=>{if(o.isMesh&&o.visible)targets.push(o)});const hits=ray.intersectObjects(targets,false).filter(h=>h.object.visible);let hitPoint=game.camera.position.clone().add(ray.ray.direction.clone().multiplyScalar(25)),target=null;if(hits.length){const h=hits[0];hitPoint=h.point.clone();let o=h.object;while(o&&o!==game.scene){if(o.userData.actor){target=o.userData.actor;break}if(o.parent?.userData?.actor){target=o.parent.userData.actor;break}o=o.parent}if(!target){let parent=h.object;while(parent){if(parent.userData?.actor){target=parent.userData.actor;break}parent=parent.parent}}}spawnTracer(a,hitPoint);if(target&&target.role==='hider'){registerHit(a,target);showHit();audio?.oneShot('impact',{volume:.08,pitch:.78+Math.random()*.12,pan:studio.computeStereoPan(game.cameraYaw,a,target)})}else{spawnSparks(hitPoint,5);audio?.oneShot('impact',{volume:.045,pitch:1.08+Math.random()*.18,pan:0})}}
  function registerHit(shooter,target){if(!target.alive)return;if(network&&ws?.readyState===1){ws.send(JSON.stringify({type:'action',action:'hit',targetId:target.id}));return}target.health--;target.locked=false;gameplay.playTransientAnimation(target,'hit',460);spawnSparks(new THREE.Vector3(target.x,target.y+target.height*.55,target.z),8);addFeed(`Hit ${target.prop||target.person.name}: ${Math.max(0,target.health)}/3.`);if(target.health<=0){if(roomState.settings.mode==='chaos'){target.role='hunter';target.health=3;target.prop=null;target.alive=true;applyActorVisual(target);addFeed(`${target.person.name} joins the hunters.`)}else{target.alive=false;target.rig.visible=false;spawnPoof(target.x,target.y+.6,target.z);addFeed(`${target.person.name} was found.`)}}}
  function spawnTracer(a,end){const parts=a.rig.userData.parts,muzzle=parts?.weapon?.userData?.muzzle,start=new THREE.Vector3(a.x,a.y+a.height*.68,a.z);if(muzzle){muzzle.getWorldPosition(start)}const geom=new THREE.BufferGeometry().setFromPoints([start,end]);const mat=new THREE.LineBasicMaterial({color:0xffd36e,transparent:true,opacity:.95});const line=new THREE.Line(geom,mat);game.scene.add(line);game.effects.push({kind:'tracer',mesh:line,life:.08,max:.08});const flash=new THREE.PointLight(0xffd06a,3,2,2);flash.position.copy(start);game.scene.add(flash);game.effects.push({kind:'light',mesh:flash,life:.04,max:.04});}
  function spawnSparks(pos,n){for(let i=0;i<n;i++){const mesh=new THREE.Mesh(new THREE.SphereGeometry(.025,6,4),new THREE.MeshBasicMaterial({color:0xffcf5a,transparent:true}));mesh.position.copy(pos);game.scene.add(mesh);game.effects.push({kind:'spark',mesh,life:.28+Math.random()*.25,max:.5,vx:(Math.random()-.5)*2.2,vy:1+Math.random()*2,vz:(Math.random()-.5)*2.2})}}
  function spawnPoof(x,y,z){const mesh=new THREE.Mesh(new THREE.SphereGeometry(.3,12,8),new THREE.MeshBasicMaterial({color:0xfff1d1,transparent:true,opacity:.75}));mesh.position.set(x,y,z);game.scene.add(mesh);game.effects.push({kind:'spark',mesh,life:.55,max:.55,vx:0,vy:.35,vz:0})}
  function showHit(){const e=root.querySelector('#ph3Hit');if(!e)return;e.classList.remove('on');void e.offsetWidth;e.classList.add('on');}

  function nearestProp(a,max=1.6){let best=null,bd=max;for(const p of game.world.props){const d=Math.hypot(a.x-p.x,a.z-p.z);if(d<bd){best=p;bd=d}}return best;}
  function changeProp(){const a=game?.player;if(!a||a.role!=='hider'||!a.alive)return;const p=nearestProp(a,1.7);if(!p){APP.toast('Move closer to a prop');return}if(a.prop&&a.propChanges<=0){APP.toast('No prop changes left');return}if(network&&ws?.readyState===1){ws.send(JSON.stringify({type:'action',action:'disguise',prop:p.type}));return}applyDisguise(a,p.type,true);}
  function applyDisguise(a,type,announce=true){if(a.prop&&a.propChanges<=0)return;audio?.oneShot('ui',{volume:.07,pitch:.72});spawnPoof(a.x,a.y+a.height*.45,a.z);if(a.prop)a.propChanges--;a.prop=type;a.flash=true;a.locked=false;applyActorVisual(a);if(announce)addFeed(`${a.person.name} disguised as ${type}. Health stayed at ${a.health}/3.`);}
  function toggleLock(){const a=game?.player;if(!a||a.role!=='hider'||!a.prop)return;a.locked=!a.locked;APP.toast(a.locked?'Prop locked':'Prop unlocked');}
  function dropDecoy(){const a=game?.player;if(!a||a.role!=='hider'||!a.prop||a.decoys<=0)return;if(network&&ws?.readyState===1){ws.send(JSON.stringify({type:'action',action:'decoy'}));return}a.decoys--;spawnDecoy(a.prop,a.x,a.z);addFeed(`Decoy dropped. ${a.decoys}/10 left.`);}
  function spawnDecoy(type,x,z){const mesh=createPropMesh(type);mesh.position.set(x+(Math.random()-.5)*.5,0,z+(Math.random()-.5)*.5);mesh.rotation.y=Math.random()*Math.PI*2;game.scene.add(mesh);game.decoys.push(mesh);spawnPoof(mesh.position.x,.28,mesh.position.z);}
  function flash(){const a=game?.player;if(!a||a.role!=='hider'||!a.prop||!a.flash)return;if(network&&ws?.readyState===1){ws.send(JSON.stringify({type:'action',action:'flash'}));a.flash=false;return}useFlash(a,true);}
  function useFlash(a,announce=true){if(!a.flash)return;a.flash=false;audio?.oneShot('ui',{volume:.09,pitch:1.7});for(const h of game.actors)if(h.role==='hunter'&&h.alive&&core.dist2(a,h)<3.5&&h===game.player)flashScreen();if(announce)addFeed(`${a.person.name} fired the flash.`);}
  function flashScreen(){const ov=root.querySelector('#ph3Flash');ov?.classList.add('on');setTimeout(()=>ov?.classList.remove('on'),850);}

  function updateHud(){const a=game.player,phase=root.querySelector('#ph3Phase'),role=root.querySelector('#ph3Role'),health=root.querySelector('#ph3Health'),load=root.querySelector('#ph3Load'),feed=root.querySelector('#ph3Feed'),prompt=root.querySelector('#ph3Prompt');if(!phase)return;const left=roomState.phaseEndsAt?Math.max(0,roomState.phaseEndsAt-Date.now()):0;phase.textContent=`${String(roomState.phase).toUpperCase()} ${left?fmt(left/1000):''} - ${mapName(game.mapKey)} - R${roomState.round}/${roomState.settings.rounds}`;role.textContent=a.role==='hunter'?'HUNTER':`HIDER${a.prop?` · ${a.prop}`:''}`;health.textContent=`HP ${Math.max(0,a.health)}/3`;load.innerHTML=a.role==='hider'?`Disguise: <b>${esc(a.prop||'none')}</b><br>Changes left: <b>${a.propChanges}</b><br>Decoys: <b>${a.decoys}/10</b><br>Flash: <b>${a.flash?'READY':'USED'}</b><br>Lock: <b>${a.locked?'LOCKED':'FREE'}</b><br>Health carries through disguise changes.`:`Weapon: <b>3D prop-zapper</b><br>Aim: <b>${(input.aim||game.padAim)?'ZOOM':'HIP'}</b><br>Raycast stops at the first wall, prop or player.<br>Unlimited reserve ammunition.`;if(feed){feed.innerHTML=game.feed.slice(-12).map(x=>`<div>${esc(x)}</div>`).join('');feed.scrollTop=feed.scrollHeight}game.nearProp=a.role==='hider'?nearestProp(a,1.65):null;if(prompt){if(game.nearProp){prompt.textContent=`PROP: ${game.nearProp.type}`;prompt.classList.add('on')}else prompt.classList.remove('on')}for(const id of ['phProp','phFlashBtn','phDecoy','phLock']){const b=root.querySelector('#'+id);if(b){b.disabled=a.role!=='hider';b.classList.toggle('role-hidden',a.role!=='hider')}}for(const id of ['phAim','phShoot']){const b=root.querySelector('#'+id);if(b)b.classList.toggle('role-hidden',a.role!=='hunter')}const shootBtn=root.querySelector('#phShoot');if(shootBtn)shootBtn.disabled=a.role!=='hunter'||roomState.phase!=='hunt';}
  function fmt(sec){sec=Math.ceil(sec);return `${Math.floor(sec/60)}:${String(sec%60).padStart(2,'0')}`;}
  function mapName(k){return k==='papa'?"Papa's Shop":k==='camp'?'Camper / Campsite':k==='acreage'?'Backyard + Fire Pit':'Goat / Farm';}
  function addFeed(t){if(!game)return;game.feed.push(t);if(game.feed.length>60)game.feed.shift();}

  function showMatchEnd(){if(!game)return;game.cinematic?.start({duration:1.7,distance:5.7,pitch:.25,yawOffset:.65,restore:false});modal(`<div class="status-large"><span class="eyebrow">MATCH COMPLETE</span><strong>${roomState.wins.hiders>roomState.wins.hunters?'HIDERS WIN THE NIGHT':roomState.wins.hunters>roomState.wins.hiders?'HUNTERS WIN THE NIGHT':'TIE GAME'}</strong><p>Hiders ${roomState.wins.hiders} - Hunters ${roomState.wins.hunters}</p><button id="phReturn" class="btn success">RETURN TO LODGE</button></div>`,m=>m.querySelector('#phReturn').onclick=()=>{location.href='/'})}
  function modal(html,bind){closeModal();const d=document.createElement('div');d.className='modal-backdrop';d.id='ph3Modal';d.innerHTML=`<div class="modal">${html}</div>`;document.body.appendChild(d);if(bind)bind(d.querySelector('.modal'));}
  function closeModal(){document.getElementById('ph3Modal')?.remove();}

  window.__PROP_HUNT_REAL3D__={version:'2.0.0-studio-realism',renderer:'WebGL',three:'0.185.1',usesDepthBuffer:true,usesCanvas2D:false};
  window.PropHunt={mount,stop};
})();
