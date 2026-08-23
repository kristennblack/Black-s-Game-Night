/*
 * Black Family Game Night - Family Prop Hunt
 * v1.3.0-real3d
 *
 * Real WebGL third-person renderer. No Canvas 2D character projection is used.
 * Characters, dogs, buildings, props and weapons are actual 3D scene objects.
 */
(function(){
  'use strict';

  const THREE_URL='https://cdn.jsdelivr.net/npm/three@0.185.1/build/three.module.min.js';
  const CORE_URL='/prop-hunt-core.mjs';
  const FAMILY=window.FAMILY;
  const APP=window.APP||{toast:()=>{}};
  const family=()=>[...(FAMILY?.people||[]),...(FAMILY?.supports||[])];
  const personById=id=>family().find(p=>p.id===id)||family()[0];
  const isDog=p=>!!p?.dog||['kelsi','molly','gunner'].includes(p?.id);
  const TEST_SCALE=location.search.includes('test=1') ? .03 : 1;
  const CDN_NOTICE='Three.js 0.185.1';

  let root=null,THREE=null,core=null,loadPromise=null,game=null,raf=0,lastFrame=0;
  let network=null,roomState=null,ws=null,reconnectTimer=0,pollTimer=0;
  const keys=Object.create(null);
  const joy={x:0,z:0,id:null};
  const look={id:null,x:0,y:0};
  const input={jumpQueued:false,sprint:false,aim:false,shoot:false};
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
    loadPromise=Promise.all([import(THREE_URL),import(CORE_URL)]).then(([t,c])=>{THREE=t;core=c;return true}).catch(err=>{console.error('3D engine failed to load',err);throw new Error('The 3D engine could not load. Check the internet connection and reload the game.')});
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
    if(m.type==='snapshot'){const a=game.actorsById.get(m.playerId);if(a&&a!==game.player)a.netTarget=m.snapshot;return}
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
    const renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:false,powerPreference:'high-performance'});renderer.setPixelRatio(Math.min(2,devicePixelRatio||1));renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.05;
    const scene=new THREE.Scene();scene.background=new THREE.Color(0x89a0ab);scene.fog=new THREE.Fog(0x87969a,28,58);
    const camera=new THREE.PerspectiveCamera(64,1,.05,120);const clock=new THREE.Clock();
    game={renderer,scene,camera,clock,mapKey,world:null,actors:[],actorsById:new Map(),player:null,keys,feed:[],effects:[],decoys:[],cameraYaw:Math.PI,cameraPitch:.18,cameraDistance:3.2,cameraActualDistance:3.2,shotCooldown:0,recoil:0,round:roomState.round||1,lastNetworkSend:0,startedAt:performance.now(),nearProp:null};
    game.world=buildWorld(mapKey);spawnActors();bindControls();onResize();addFeed('Real 3D renderer active. Walls now occlude players through the depth buffer.');if(network)addFeed('Dedicated live Prop Hunt room connected.');lastFrame=performance.now();loop(lastFrame);
  }

  function disposeRoot(){if(game?.renderer){try{game.renderer.dispose()}catch{}}game=null;}

  function gameShell(){return `<div class="ph3d-shell"><section id="ph3Stage" class="ph3d-stage"><canvas id="ph3Canvas" class="ph3d-canvas"></canvas><div class="ph3d-top"><span id="ph3Role" class="ph3d-chip role"></span><span id="ph3Phase" class="ph3d-chip map"></span><span id="ph3Health" class="ph3d-chip health"></span></div><div id="ph3Crosshair" class="ph3d-crosshair"></div><div id="ph3Hit" class="ph3d-hit">x</div><div id="ph3Flash" class="ph3d-flash"></div><div id="ph3Prompt" class="ph3d-prop-prompt"></div><div class="ph3d-camera-help">Drag to look. WASD / joystick moves. Shift sprints. Jump automatically mantles reasonable ledges.</div><div class="ph3d-controls"><div id="phJoy" class="ph3d-joystick"><div id="phStick" class="ph3d-stick"></div></div><div class="ph3d-actions"><button id="phAim" class="ph3d-act aim">AIM</button><button id="phShoot" class="ph3d-act primary">SHOOT</button><button id="phJump" class="ph3d-act jump">JUMP</button><button id="phSprint" class="ph3d-act sprint">SPRINT</button><button id="phProp" class="ph3d-act prop">PROP</button><button id="phFlashBtn" class="ph3d-act flash">FLASH</button><button id="phDecoy" class="ph3d-act">DECOY</button><button id="phLock" class="ph3d-act lock">LOCK</button></div></div></section><aside class="ph3d-side"><div class="ph3d-mini"><h3>Loadout</h3><div id="ph3Load" class="ph3d-readout"></div></div><div class="ph3d-mini"><h3>3D status</h3><div class="ph3d-legend"><span>Real depth</span><span>Camera collision</span><span>All-angle rigs</span><span>Raycast hits</span></div></div><div class="ph3d-mini"><h3>Family feed</h3><div id="ph3Feed" class="ph3d-feed"></div></div></aside></div>`;}

  class WorldBuilder{
    constructor(scene,key){this.scene=scene;this.key=key;this.group=new THREE.Group();this.group.name=`world-${key}`;scene.add(this.group);this.colliders=[];this.raycastMeshes=[];this.props=[];this.spawn={x:4,z:4};this.bounds={minX:0,maxX:20,minZ:0,maxZ:14};}
    mat(color,rough=.82,metal=.05){return new THREE.MeshStandardMaterial({color,roughness:rough,metalness:metal});}
    box(o){const mesh=new THREE.Mesh(new THREE.BoxGeometry(o.w,o.h,o.d),o.material||this.mat(o.color||0x6b5b49,o.rough,o.metal));mesh.position.set(o.x,(o.y||0)+o.h/2,o.z);if(o.rotY)mesh.rotation.y=o.rotY;mesh.castShadow=o.castShadow!==false;mesh.receiveShadow=o.receiveShadow!==false;mesh.name=o.name||'box';this.group.add(mesh);if(o.solid!==false){const c={x:o.x,z:o.z,y:o.y||0,w:o.w,d:o.d,h:o.h,solid:true,climbable:!!o.climbable,walkableTop:o.walkableTop??!!o.climbable,noCamera:!!o.noCamera,name:o.name||'box',mesh};this.colliders.push(c);mesh.userData.worldCollider=c;this.raycastMeshes.push(mesh)}return mesh;}
    floor(x,z,w,d,color=0x655d4e,y=-.04){const m=this.box({x,z,y,w,d,h:.08,color,name:'floor',solid:false,receiveShadow:true,castShadow:false});m.userData.floor=true;return m;}
    cylinder(o){const r=o.r||o.w/2,mesh=new THREE.Mesh(new THREE.CylinderGeometry(r,r,o.h,o.segments||18),o.material||this.mat(o.color||0x777777,o.rough,o.metal));mesh.position.set(o.x,(o.y||0)+o.h/2,o.z);mesh.castShadow=true;mesh.receiveShadow=true;mesh.name=o.name||'cylinder';this.group.add(mesh);if(o.solid){const c={x:o.x,z:o.z,y:o.y||0,w:r*2,d:r*2,h:o.h,solid:true,climbable:!!o.climbable,walkableTop:!!o.climbable,name:o.name||'cylinder',mesh};this.colliders.push(c);mesh.userData.worldCollider=c;this.raycastMeshes.push(mesh)}return mesh;}
    window(x,y,z,w,h,axis='x'){const mat=new THREE.MeshPhysicalMaterial({color:0x9fc0cf,transparent:true,opacity:.34,roughness:.12,metalness:0,transmission:.18,side:THREE.DoubleSide});const mesh=new THREE.Mesh(new THREE.BoxGeometry(axis==='x'?w:.035,h,axis==='x' ? .035 : w),mat);mesh.position.set(x,y+h/2,z);mesh.receiveShadow=true;this.group.add(mesh);const c={x,z,y,w:axis==='x'?w:.065,d:axis==='x'?.065:w,h,solid:true,climbable:false,walkableTop:false,name:'window glass',mesh};this.colliders.push(c);this.raycastMeshes.push(mesh);mesh.userData.worldCollider=c;const frame=this.mat(0x47382e);if(axis==='x'){this.box({x,z:z+.03,y:y-.06,w:w+.12,d:.07,h:.07,material:frame,solid:false});this.box({x,z:z+.03,y:y+h-.01,w:w+.12,d:.07,h:.07,material:frame,solid:false})}else{this.box({x:x+.03,z,y:y-.06,w:.07,d:w+.12,h:.07,material:frame,solid:false});this.box({x:x+.03,z,y:y+h-.01,w:.07,d:w+.12,h:.07,material:frame,solid:false})}return mesh;}
    wallX(z,x0,x1,height,openings=[],color=0x4d3d31,thick=.22,name='wall'){
      let cur=x0;const sorted=[...openings].sort((a,b)=>a.from-b.from);for(const op of sorted){if(op.from>cur)this.box({x:(cur+op.from)/2,z,w:op.from-cur,d:thick,h:height,color,name});if(op.sill>0)this.box({x:(op.from+op.to)/2,z,w:op.to-op.from,d:thick,h:op.sill,color,name});const top=op.sill+op.h;if(top<height)this.box({x:(op.from+op.to)/2,z,y:top,w:op.to-op.from,d:thick,h:height-top,color,name});if(op.glass)this.window((op.from+op.to)/2,op.sill,z,op.to-op.from,op.h,'x');cur=op.to}if(cur<x1)this.box({x:(cur+x1)/2,z,w:x1-cur,d:thick,h:height,color,name});
    }
    wallZ(x,z0,z1,height,openings=[],color=0x4d3d31,thick=.22,name='wall'){
      let cur=z0;const sorted=[...openings].sort((a,b)=>a.from-b.from);for(const op of sorted){if(op.from>cur)this.box({x,z:(cur+op.from)/2,w:thick,d:op.from-cur,h:height,color,name});if(op.sill>0)this.box({x,z:(op.from+op.to)/2,w:thick,d:op.to-op.from,h:op.sill,color,name});const top=op.sill+op.h;if(top<height)this.box({x,z:(op.from+op.to)/2,y:top,w:thick,d:op.to-op.from,h:height-top,color,name});if(op.glass)this.window(x,op.sill,(op.from+op.to)/2,op.to-op.from,op.h,'z');cur=op.to}if(cur<z1)this.box({x,z:(cur+z1)/2,w:thick,d:z1-cur,h:height,color,name});
    }
    roofPanel(x,z,w,d,y,rotZ,color=0x4b4036){const mesh=this.box({x,z,y,w,d,h:.16,color,name:'roof',solid:false});mesh.rotation.z=rotZ;return mesh;}
    addProp(type,x,z,rot=0){const d=propDef(type),mesh=createPropMesh(type);mesh.position.set(x,0,z);mesh.rotation.y=rot;this.group.add(mesh);const rec={id:`prop-${this.props.length}`,type,x,z,y:0,w:d.w,d:d.d,h:d.h,mesh,def:d};this.props.push(rec);mesh.userData.worldProp=rec;if(d.solid){const c={x,z,y:0,w:d.w,d:d.d,h:d.h,solid:true,climbable:!!d.climbable,walkableTop:!!d.climbable,name:type,mesh};this.colliders.push(c);rec.collider=c;mesh.traverse(o=>{if(o.isMesh){o.userData.worldCollider=c;this.raycastMeshes.push(o)}})}else mesh.traverse(o=>{if(o.isMesh)this.raycastMeshes.push(o)});return rec;}
  }

  function baseLighting(scene,night=false){const hemi=new THREE.HemisphereLight(night?0x7583a4:0xa9c4d2,0x4d493b,night ? .75 : 1.18);scene.add(hemi);const sun=new THREE.DirectionalLight(night?0xffd0a2:0xffeed0,night?1.7:2.15);sun.position.set(-8,15,8);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);sun.shadow.camera.left=-24;sun.shadow.camera.right=24;sun.shadow.camera.top=24;sun.shadow.camera.bottom=-24;sun.shadow.bias=-.0008;scene.add(sun);}
  function addTree(w,x,z,s=1){w.cylinder({x,z,r:.16*s,h:2.2*s,color:0x5a4030,solid:true});const mat=w.mat(0x476345,.95,0);for(let i=0;i<3;i++){const crown=new THREE.Mesh(new THREE.ConeGeometry(.9*s,1.8*s,8),mat);crown.position.set(x,1.6*s+i*.48*s,z);crown.castShadow=true;w.group.add(crown)}}
  function addFence(w,x,z,length,axis='x'){const mat=w.mat(0x795d3e);const count=Math.max(2,Math.ceil(length/1.5));for(let i=0;i<count;i++){const t=i/(count-1),px=axis==='x'?x-length/2+t*length:x,pz=axis==='z'?z-length/2+t*length:z;w.box({x:px,z:pz,w:.09,d:.09,h:1.05,material:mat,climbable:true,name:'fence post'})}if(axis==='x'){w.box({x,z,w:length,d:.08,h:.09,y:.42,material:mat,climbable:true,name:'fence rail'});w.box({x,z,w:length,d:.08,h:.09,y:.78,material:mat,climbable:true,name:'fence rail'})}else{w.box({x,z,w:.08,d:length,h:.09,y:.42,material:mat,climbable:true,name:'fence rail'});w.box({x,z,w:.08,d:length,h:.09,y:.78,material:mat,climbable:true,name:'fence rail'})}}

  function buildWorld(key){
    baseLighting(game.scene,key==='acreage');let w;if(key==='camp')w=buildCamp();else if(key==='acreage')w=buildAcreage();else if(key==='farm')w=buildFarm();else w=buildPapa();game.scene.add(w.group);return w;
  }

  function buildPapa(){
    const w=new WorldBuilder(game.scene,'papa');w.bounds={minX:.2,maxX:18.4,minZ:.2,maxZ:13};w.spawn={x:5,z:10.8};w.floor(6.6,5.1,11,7.8,0x615647);w.floor(14.6,5.2,5.2,6.3,0x5b5145);w.floor(5.2,10.7,9.6,3.3,0x777166);
    const wall=0x503e32;w.wallX(1.2,1.1,12.1,2.9,[{from:3.0,to:4.25,sill:1.15,h:1.05,glass:true},{from:8.0,to:9.3,sill:1.1,h:1.1,glass:true}],wall);w.wallZ(1.1,1.2,9.0,2.9,[{from:4.0,to:5.2,sill:1.15,h:1.05,glass:true}],wall);w.wallX(9.0,1.1,12.1,2.9,[{from:4.8,to:8.45,sill:0,h:2.5},{from:10.35,to:11.25,sill:0,h:2.18}],wall);w.wallZ(12.1,1.2,8.2,2.9,[{from:4.15,to:6.0,sill:0,h:2.5}],wall);
    const barnWall=0x4b4034;w.wallX(2.1,12.1,17.3,2.65,[{from:13.0,to:14.1,sill:1.1,h:1.0,glass:true}],barnWall);w.wallZ(17.3,2.1,8.25,2.65,[{from:4.2,to:5.35,sill:0,h:2.15}],barnWall);w.wallX(8.25,12.1,17.3,2.65,[{from:13.7,to:16.2,sill:0,h:2.25}],barnWall);
    w.box({x:6.6,z:5.1,y:2.84,w:11,d:7.8,h:.08,color:0x6c5b4b,name:'shop ceiling',solid:true});w.roofPanel(4.05,5.1,5.8,8.2,3.1,.19,0x433a33);w.roofPanel(9.15,5.1,5.8,8.2,3.1,-.19,0x433a33);w.box({x:14.7,z:5.2,y:2.6,w:5.2,d:6.3,h:.08,color:0x67584a,name:'barn ceiling',solid:true});w.roofPanel(13.5,5.2,3,6.7,2.84,.17,0x443c35);w.roofPanel(15.9,5.2,3,6.7,2.84,-.17,0x443c35);
    for(let x=2;x<11.5;x+=1.5)w.box({x,z:5.1,y:2.62,w:.09,d:7.4,h:.12,color:0x5b4635,name:'rafter',solid:false});
    w.box({x:4.15,z:2.85,w:3.1,d:.9,h:.82,color:0x6b4a2e,climbable:true,name:'Workbench'});w.box({x:7.6,z:2.85,w:2.2,d:1.15,h:1.08,color:0x5d4035,climbable:true,name:'Tool chest'});w.box({x:10.25,z:3.0,w:1.6,d:2.8,h:2.25,color:0x5d503c,climbable:true,name:'Shelving'});
    buildTractor(w,4.2,6.8);buildMotorcycle(w,7.9,6.8);w.box({x:2.8,z:8.05,w:2.8,d:.75,h:.55,color:0x9a774d,climbable:true,name:'Lumber stack'});buildFireplace(w,10.8,7.35);buildPapaChair(w,9.45,8.05);
    w.box({x:9.0,z:4.6,w:.85,d:.72,h:.5,color:0x806242,climbable:true,name:'Step crate'});w.box({x:9.2,z:5.4,w:1.0,d:.78,h:.82,color:0x76573b,climbable:true,name:'Parts crate'});w.box({x:10.7,z:5.65,w:.78,d:.68,h:1.08,color:0x6b563f,climbable:true,name:'Shelf step'});
    addFence(w,14.6,3.4,3.5,'x');addFence(w,14.6,6.2,3.5,'x');addFence(w,16.0,4.8,2.8,'z');w.box({x:2.4,z:10.65,w:2.1,d:.72,h:.7,color:0x8c6b45,climbable:true,name:'Pallet stack'});w.box({x:5.3,z:10.8,w:1.8,d:1.05,h:.86,color:0x65615b,climbable:true,name:'Outdoor parts'});
    [['Bucket',2.2,3.8],['Bucket',2.55,4.2],['Oil Jug',2.85,3.95],['Toolbox',6.1,4.3],['Welding Helmet',6.9,4.25],['Gas Can',8.3,3.5],['Shop Vac',8.8,3.75],['Coffee Mug',10.4,6.2],['Beer Case',9.75,6.35],['Stool',8.8,8.0],['Coffee Mug',10.2,8.15],['Sawhorse',5.5,8.15],['Extension Cord',6.3,8.45],['Feed Bucket',13.0,7.2],['Hay Bale',13.8,7.2],['Wheelbarrow',15.8,7.0],['Feed Bucket',15.2,4.2],['Garbage Can',16.4,5.4],['Parts Crate',2.2,11.6],['Gas Can',4.3,11.6],['Toolbox',6.3,11.7],['Lumber',8.0,11.2]].forEach(([t,x,z],i)=>w.addProp(t,x,z,i*.31));
    addNpcAnimal(w,'pig',13.6,4.4);addNpcAnimal(w,'pig',15.7,4.7);addNpcAnimal(w,'goat',13.5,6.8);addNpcAnimal(w,'goat',15.6,6.9);return w;
  }

  function buildCamp(){
    const w=new WorldBuilder(game.scene,'camp');w.bounds={minX:.2,maxX:20,minZ:.2,maxZ:14};w.spawn={x:10.6,z:7.8};w.floor(10,7,19.5,13.5,0x526d48);w.floor(6.0,4.2,7.3,3.7,0x8a8374);
    const camper=0x9b9482;w.wallX(2.4,2.4,9.7,2.45,[{from:4.0,to:5.0,sill:1.1,h:.9,glass:true},{from:7.5,to:8.6,sill:1.1,h:.9,glass:true}],camper,.16);w.wallX(6.0,2.4,9.7,2.45,[{from:8.6,to:9.35,sill:0,h:2.05}],camper,.16);w.wallZ(2.4,2.4,6,2.45,[],camper,.16);w.wallZ(9.7,2.4,6,2.45,[{from:3.3,to:4.25,sill:1.0,h:1.0,glass:true}],camper,.16);w.box({x:6.05,z:4.2,y:2.4,w:7.3,d:3.7,h:.08,color:0x8f887a,name:'camper ceiling',solid:true});w.roofPanel(6.05,4.2,7.6,4,2.52,0,0x77766d);
    w.box({x:4.0,z:3.35,w:1.8,d:1.2,h:.68,color:0x86796a,climbable:true,name:'Front bed'});w.box({x:6.3,z:3.35,w:1.5,d:.9,h:.9,color:0x766d62,climbable:true,name:'Kitchen counter'});w.box({x:8.25,z:3.5,w:1.5,d:1,h:.75,color:0x6e5e51,climbable:true,name:'Couch'});w.box({x:5.3,z:5.05,w:1.15,d:.95,h:1.5,color:0x74634f,climbable:true,name:'Bunks'});w.box({x:8.2,z:5.1,w:1.05,d:.95,h:1.8,color:0x77736d,name:'Bathroom'});
    w.box({x:4.6,z:7.5,w:2.7,d:1.05,h:.75,color:0x8b6b48,climbable:true,name:'Picnic table'});w.box({x:7.4,z:7.4,w:1.35,d:.85,h:1.0,color:0x3e4140,climbable:true,name:'BBQ'});w.box({x:9.0,z:7.15,w:1.6,d:1.1,h:.86,color:0x567687,climbable:true,name:'Cooler stack'});buildTruck(w,13.4,3.8);buildTent(w,16,7.0);buildCampfire(w,12.5,8.2);w.box({x:14,z:11.6,w:2.6,d:.5,h:.45,color:0x795d42,climbable:true,name:'Shore logs'});w.floor(15.5,12.8,8,1.7,0x66898f,.01);
    for(let x=11;x<19;x+=2.1)addTree(w,x,1.1+(x%3),.8+((x*7)%4)*.08);
    [['Camp Chair',3.0,9],['Camp Chair',3.7,9.2],['Cooler',5.2,8.9],['Lantern',6.7,8.8],['Dog Toy',7.6,8.4],['Card Box',9.3,8.8],['Water Jug',10.2,8.2],['Firewood',11.6,6],['Camp Bin',14,5.5],['Rock',17,9],['Camp Chair',18,9.6],['Rock',13.5,12.2]].forEach(([t,x,z],i)=>w.addProp(t,x,z,i*.2));return w;
  }

  function buildAcreage(){
    const w=new WorldBuilder(game.scene,'acreage');w.bounds={minX:.2,maxX:25,minZ:.2,maxZ:17};w.spawn={x:9.2,z:5.6};w.floor(12.5,8.5,25,17,0x557348);w.floor(11.4,3.6,8.5,5.2,0x77736a);
    w.box({x:3.4,z:2.7,w:4.0,d:2.2,h:1.0,color:0x75634e,climbable:true,name:'Back deck'});w.cylinder({x:5.5,z:2.3,r:.78,h:1.05,color:0x6a7371,solid:true,climbable:true,name:'Hot tub'});w.box({x:6.8,z:3,w:.8,d:1.1,h:.95,color:0x4e5b50,climbable:true,name:'Bins'});buildTrailer(w,11.1,3.2);buildBoat(w,14.8,3.2);buildShopBuilding(w,3.0,8.4,2.5,2.6,'Quad shop',0x6e6559);buildShopBuilding(w,5.8,8.4,2.5,2.6,"John's tool shop",0x655d55);buildShopBuilding(w,3.1,11.4,2.6,2.0,'Storage shed',0x625b53);buildTrampoline(w,10.0,9.0);buildPool(w,13.0,9.1);buildCampfire(w,18.0,4.0);w.box({x:20.7,z:3.2,w:2.1,d:1.8,h:1.6,color:0x5b554e,climbable:true,name:'Garden shed'});
    for(let i=0;i<6;i++)w.box({x:18.3+i*.75,z:7.4,w:.55,d:3.2,h:.15,color:0x705438,name:'Garden row',solid:false});
    addFence(w,17.7,12.4,7,'x');addFence(w,14.3,14.2,3.5,'z');addFence(w,21.1,14.2,3.5,'z');for(let x=16;x<24;x+=1.7)addTree(w,x,10.2+((x*3)%2),.8);for(let i=0;i<7;i++)addTree(w,1.0+i*.8,14.8-(i%2),.7);
    [['Flower Pot',4.2,4.4],['Watering Can',5.0,4.3],['Tire',8.4,5.1],['Toolbox',7.5,7.1],['Gas Can',6.6,9.7],['Garbage Can',4.2,12.4],['Camp Chair',16.5,4.8],['Camp Chair',17.3,4.7],['Cooler',19.2,4.8],['Rock',21.8,8.6],['Pallet',13.8,12.3],['Feed Bucket',17.4,13.5]].forEach(([t,x,z],i)=>w.addProp(t,x,z,i*.23));return w;
  }

  function buildFarm(){
    const w=new WorldBuilder(game.scene,'farm');w.bounds={minX:.2,maxX:22,maxZ:.2,maxZ:15.5};w.spawn={x:6,z:7};w.floor(11,7.8,22,15.5,0x667050);buildShopBuilding(w,4.1,3.2,4.6,3.6,'Chicken coop',0x76614b,true);buildShopBuilding(w,9.0,3.0,3.2,3.0,'Old shed',0x625548,true);w.box({x:15,z:3.1,w:5.4,d:2.45,h:2.45,color:0x5d6669,climbable:true,name:'Sea can'});w.box({x:18.5,z:6.2,w:3.0,d:1.5,h:1.35,color:0x6a6256,climbable:true,name:'Farm platform'});w.box({x:19.3,z:7.55,w:1.0,d:.7,h:.45,color:0x7b6548,climbable:true,name:'Goat step'});w.box({x:18.7,z:8.0,w:1.0,d:.7,h:.85,color:0x7b6548,climbable:true,name:'Goat step'});w.box({x:18.1,z:8.45,w:1.0,d:.7,h:1.2,color:0x7b6548,climbable:true,name:'Goat stair'});addFence(w,6.5,9.7,11,'x');addFence(w,1.0,12.3,5.2,'z');addFence(w,12.0,12.3,5.2,'z');addFence(w,16.8,10.2,8,'x');addFence(w,13,12.5,4.6,'z');addFence(w,20.7,12.5,4.6,'z');w.cylinder({x:15.8,z:12.0,r:1.55,h:.08,color:0x594333,solid:false,name:'Mud wallow'});
    for(let i=0;i<5;i++)addNpcAnimal(w,i<2?'goat':i<4?'pig':'peacock',4+i*2,11+(i%2));
    [['Feed Barrel',2.4,6.8],['Trough',4,7.0],['Hay Bale',6.2,7.5],['Pallet',8.0,7.8],['Feed Sack',10.1,6.8],['Egg Crate',3.0,4.9],['Feed Bucket',11.5,9],['Mud Bucket',15,10.5],['Garbage Can',20,4.8],['Toolbox',13.3,5.0],['Tire',17.2,5.2],['Lumber',7.0,13.2]].forEach(([t,x,z],i)=>w.addProp(t,x,z,i*.19));return w;
  }

  function buildTractor(w,x,z){const green=w.mat(0x5f6f3f,.78,.15),dark=w.mat(0x252827,.9,.1);w.box({x,z,w:2.3,d:1.4,h:.75,color:0x5f6f3f,climbable:true,name:'Tractor body'});w.box({x:x-.55,z,y:.75,w:1.0,d:1.15,h:.7,color:0x53613a,climbable:true,name:'Tractor hood'});for(const sx of [-.85,.85])for(const sz of [-.68,.68]){const tire=new THREE.Mesh(new THREE.TorusGeometry(sz < 0 ? .42 : .48,.15,10,18),dark);tire.rotation.y=Math.PI/2;tire.position.set(x+sx,.48,z+sz);tire.castShadow=true;w.group.add(tire)}const seat=w.box({x:x+.45,z,y:.78,w:.5,d:.5,h:.55,material:dark,solid:false});seat.name='Tractor seat';}
  function buildMotorcycle(w,x,z){const metal=w.mat(0x3e4144,.45,.65),rubber=w.mat(0x202223,.9,.05);for(const dz of [-.65,.65]){const wheel=new THREE.Mesh(new THREE.TorusGeometry(.38,.1,10,20),rubber);wheel.rotation.y=Math.PI/2;wheel.position.set(x,.4,z+dz);wheel.castShadow=true;w.group.add(wheel)}const frame=w.box({x,z,w:.45,d:1.1,h:.42,y:.38,material:metal,climbable:true,name:'Old motorcycle'});frame.rotation.x=.05;w.box({x,z:z-.2,w:.42,d:.45,h:.28,y:.72,color:0x57473d,solid:false});}
  function buildFireplace(w,x,z){w.box({x,z,w:1.25,d:.65,h:1.75,color:0x49362f,name:'Fireplace'});const glow=new THREE.PointLight(0xff8b3d,2.5,6,2);glow.position.set(x,.65,z-.5);w.group.add(glow);const fireMat=new THREE.MeshStandardMaterial({color:0xff7a35,emissive:0xff4d16,emissiveIntensity:2});const flame=new THREE.Mesh(new THREE.ConeGeometry(.18,.6,10),fireMat);flame.position.set(x,.36,z-.38);w.group.add(flame);}
  function buildPapaChair(w,x,z){const yellow=w.mat(0xb49a45,.95,0);w.box({x,z,w:.8,d:.75,h:.45,y:.12,material:yellow,climbable:true,name:"Papa's chair"});w.box({x,z:z+.28,w:.78,d:.18,h:1.05,y:.45,material:yellow,solid:false});w.box({x:x-.45,z,w:.16,d:.72,h:.72,y:.25,material:yellow,solid:false});w.box({x:x+.45,z,w:.16,d:.72,h:.72,y:.25,material:yellow,solid:false});}
  function buildTruck(w,x,z){w.box({x,z,w:2.5,d:1.45,h:.7,y:.35,color:0x676b70,climbable:true,name:'Truck'});w.box({x:x-.55,z,w:1.05,d:1.35,h:.8,y:1.0,color:0x73787c,solid:false});for(const dx of [-.85,.85])for(const dz of [-.7,.7])w.cylinder({x:x+dx,z:z+dz,r:.3,h:.18,y:.18,color:0x242525,solid:false});}
  function buildTent(w,x,z){const mat=w.mat(0x7c6a4f,.9,0),g=new THREE.Group();const side=new THREE.Mesh(new THREE.CylinderGeometry(0,1.45,2.0,3,1,false,Math.PI/6),mat);side.scale.set(1,1,1.25);side.rotation.y=Math.PI/2;side.position.set(x,1.0,z);side.castShadow=true;g.add(side);w.group.add(g);w.colliders.push({x,z,y:0,w:2.7,d:2.1,h:1.5,solid:true,climbable:true,walkableTop:false,name:"Logan's tent",mesh:side});w.raycastMeshes.push(side);}
  function buildCampfire(w,x,z){const ring=w.cylinder({x,z,r:.62,h:.14,color:0x4d4036,solid:false});const light=new THREE.PointLight(0xff8d43,2.2,6,2);light.position.set(x,.8,z);w.group.add(light);for(let i=0;i<7;i++){const a=i/7*Math.PI*2,rock=new THREE.Mesh(new THREE.DodecahedronGeometry(.16,0),w.mat(0x6c665d));rock.position.set(x+Math.cos(a)*.52,.14,z+Math.sin(a)*.52);rock.castShadow=true;w.group.add(rock)}const flame=new THREE.Mesh(new THREE.ConeGeometry(.2,.65,10),new THREE.MeshStandardMaterial({color:0xff9a3e,emissive:0xff511f,emissiveIntensity:2.2}));flame.position.set(x,.38,z);w.group.add(flame);return ring;}
  function buildTrailer(w,x,z){w.box({x,z,w:3.6,d:1.4,h:1.45,y:.45,color:0x9b9482,climbable:true,name:'Holiday trailer'});w.box({x:x-1.1,z:z-.71,y:1.15,w:.9,d:.03,h:.65,color:0x92b0b7,solid:false});}
  function buildBoat(w,x,z){const hull=new THREE.Mesh(THREE.CapsuleGeometry ? new THREE.CapsuleGeometry(.45,1.7,6,12) : new THREE.BoxGeometry(2.3,.6,.9),w.mat(0x6c7d80,.55,.25));if(hull.geometry.type==='CapsuleGeometry'){hull.rotation.z=Math.PI/2;hull.rotation.x=Math.PI/2}else{}hull.position.set(x,.65,z);hull.castShadow=true;w.group.add(hull);w.colliders.push({x,z,y:.3,w:2.4,d:1.0,h:.8,solid:true,climbable:true,walkableTop:true,name:'Boat',mesh:hull});w.raycastMeshes.push(hull);}
  function buildShopBuilding(w,x,z,width,depth,name,color,open=false){w.floor(x,z,width,depth,0x62594c);w.wallX(z-depth/2,x-width/2,x+width/2,2.45,open?[{from:x-.55,to:x+.55,sill:0,h:2.0}]:[],color,.15,name);w.wallX(z+depth/2,x-width/2,x+width/2,2.45,[{from:x-.6,to:x+.6,sill:0,h:2.05}],color,.15,name);w.wallZ(x-width/2,z-depth/2,z+depth/2,2.45,[],color,.15,name);w.wallZ(x+width/2,z-depth/2,z+depth/2,2.45,[{from:z-.45,to:z+.45,sill:.95,h:.9,glass:true}],color,.15,name);w.roofPanel(x-width*.23,z,width*.58,depth+.3,2.62,.18,0x443a32);w.roofPanel(x+width*.23,z,width*.58,depth+.3,2.62,-.18,0x443a32);}
  function buildTrampoline(w,x,z){const frame=w.cylinder({x,z,r:1.25,h:.12,y:.62,color:0x303436,solid:true,climbable:true,name:'Trampoline'});const mat=new THREE.MeshStandardMaterial({color:0x202526,roughness:.85});const top=new THREE.Mesh(new THREE.CylinderGeometry(1.12,1.12,.05,28),mat);top.position.set(x,.74,z);top.receiveShadow=true;w.group.add(top);return frame;}
  function buildPool(w,x,z){const shell=w.cylinder({x,z,r:1.55,h:1.2,color:0x68899a,solid:true,climbable:true,name:'Above-ground pool'});const water=new THREE.Mesh(new THREE.CylinderGeometry(1.45,1.45,.04,28),new THREE.MeshPhysicalMaterial({color:0x4f9bb7,transparent:true,opacity:.65,roughness:.12}));water.position.set(x,1.12,z);w.group.add(water);return shell;}

  function createPropMesh(type){
    const d=propDef(type),g=new THREE.Group(),mat=new THREE.MeshStandardMaterial({color:d.color,roughness:.78,metalness:.06});const box=(w,h,dep,y=0)=>{const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,dep),mat);m.position.y=y+h/2;m.castShadow=true;m.receiveShadow=true;g.add(m);return m};const cyl=(r,h,y=0)=>{const m=new THREE.Mesh(new THREE.CylinderGeometry(r,r,h,18),mat);m.position.y=y+h/2;m.castShadow=true;m.receiveShadow=true;g.add(m);return m};
    if(d.kind==='cylinder')cyl(d.w/2,d.h);else if(d.kind==='ball'){const m=new THREE.Mesh(new THREE.SphereGeometry(d.w/2,16,12),mat);m.position.y=d.h/2;m.castShadow=true;g.add(m)}else if(d.kind==='mug'){cyl(.1,.2);const h=new THREE.Mesh(new THREE.TorusGeometry(.085,.022,8,16,Math.PI*1.5),mat);h.rotation.y=Math.PI/2;h.position.set(.11,.13,0);g.add(h)}else if(d.kind==='stool'){cyl(.18,.08,.5);for(const sx of [-.13,.13])for(const sz of [-.13,.13]){const l=box(.035,.5,.035);l.position.x=sx;l.position.z=sz}}else if(d.kind==='chair'){box(.5,.12,.48,.34);box(.5,.7,.1,.38).position.z=.2;for(const sx of [-.22,.22]){const l=box(.05,.38,.05);l.position.x=sx;l.position.z=-.14}}else if(d.kind==='tire'){const m=new THREE.Mesh(new THREE.TorusGeometry(.24,.09,10,20),mat);m.rotation.y=Math.PI/2;m.position.y=.31;g.add(m)}else if(d.kind==='rock'){const m=new THREE.Mesh(new THREE.DodecahedronGeometry(.38,1),mat);m.scale.set(1,.65,.85);m.position.y=.28;m.castShadow=true;g.add(m)}else if(d.kind==='lumber'){for(let i=0;i<4;i++){const m=box(d.w,.09,.11,i*.09);m.position.z=(i%2-.5)*.14}}else if(d.kind==='pallet'){for(let i=-2;i<=2;i++){const m=box(d.w/5*.85,.08,d.d,.12);m.position.x=i*d.w/5*.95}box(d.w,.08,.1,.02).position.z=-d.d*.35;box(d.w,.08,.1,.02).position.z=d.d*.35}else if(d.kind==='sawhorse'){box(d.w,.11,.14,.55);for(const sx of [-.35,.35])for(const sz of [-.17,.17]){const l=box(.06,.6,.06);l.position.x=sx;l.position.z=sz;l.rotation.z=sx > 0 ? .15 : -.15}}else if(d.kind==='coil'){const m=new THREE.Mesh(new THREE.TorusGeometry(.16,.045,8,22),mat);m.rotation.x=Math.PI/2;m.position.y=.08;g.add(m)}else if(d.kind==='lantern'){cyl(.11,.28,.04);const cap=box(.18,.05,.18,.32);cap.rotation.y=.4}else if(d.kind==='sack'){const m=new THREE.Mesh(new THREE.SphereGeometry(.3,14,10),mat);m.scale.set(.78,1.15,.6);m.position.y=.33;g.add(m)}else if(d.kind==='helmet'){const m=new THREE.Mesh(new THREE.SphereGeometry(.2,16,10,0,Math.PI*2,0,Math.PI*.65),mat);m.scale.z=.8;m.position.y=.19;g.add(m)}else if(d.kind==='vac'){cyl(.22,.5);box(.18,.16,.18,.5)}else if(d.kind==='pot'){cyl(.17,.25);const plant=new THREE.Mesh(new THREE.SphereGeometry(.2,10,8),new THREE.MeshStandardMaterial({color:0x4b7148,roughness:.9}));plant.position.y=.38;g.add(plant)}else if(d.kind==='trough'){box(d.w,.15,d.d,.05);box(.08,.38,d.d,0).position.x=-d.w/2+.04;box(.08,.38,d.d,0).position.x=d.w/2-.04}else if(d.kind==='wheelbarrow'){box(.75,.22,.45,.35).rotation.z=-.12;const wheel=new THREE.Mesh(new THREE.TorusGeometry(.16,.055,8,18),new THREE.MeshStandardMaterial({color:0x2b2d2c,roughness:.9}));wheel.rotation.y=Math.PI/2;wheel.position.set(-.42,.22,0);g.add(wheel);for(const z of [-.15,.15]){const h=box(.65,.05,.05,.34);h.position.x=.55;h.position.z=z}}else if(d.kind==='jug'){box(d.w*.8,d.h,d.d);const h=new THREE.Mesh(new THREE.TorusGeometry(.08,.025,8,14,Math.PI),mat);h.rotation.z=Math.PI/2;h.position.set(.05,d.h*.72,0);g.add(h)}else box(d.w,d.h,d.d);
    g.userData.propType=type;return g;
  }

  function addNpcAnimal(w,type,x,z){const p={id:`npc-${type}-${x}-${z}`,type};const rig=buildAnimalRig(type);rig.position.set(x,0,z);rig.rotation.y=Math.random()*Math.PI*2;rig.userData.npc={baseX:x,baseZ:z,timer:Math.random()*3+1};w.group.add(rig);if(!w.npcs)w.npcs=[];w.npcs.push(rig);return p;}
  function buildAnimalRig(type){const g=new THREE.Group(),fur=new THREE.MeshStandardMaterial({color:type==='pig'?0xb6745b:type==='peacock'?0x456d72:0xded3bd,roughness:.9});const body=new THREE.Mesh(new THREE.SphereGeometry(.36,14,10),fur);body.scale.set(1.35,.7,.75);body.position.y=.45;g.add(body);const head=new THREE.Mesh(new THREE.SphereGeometry(.22,12,10),fur);head.position.set(0,.58,-.46);g.add(head);for(const x of [-.22,.22])for(const z of [-.2,.2]){const l=new THREE.Mesh(new THREE.CylinderGeometry(.045,.05,.42,8),fur);l.position.set(x,.22,z);g.add(l)}return g;}

  function spawnActors(){
    const players=roomState.players,spawn=game.world.spawn;players.forEach((p,i)=>{const actor=createActor(p,i,spawn);game.actors.push(actor);game.actorsById.set(p.id,actor);if(p.id===roomState.viewerId)game.player=actor});if(!game.player)game.player=game.actors[0];game.cameraYaw=game.player.yaw;
  }
  function createActor(p,index,spawn){
    const person=personById(p.avatar),dog=isDog(person),angle=index/playerCountSafe()*Math.PI*2,r=1.2+Math.floor(index/6)*.7;const actor={id:p.id,person,isBot:!!p.isBot,difficulty:p.difficulty||'medium',role:p.role||'hider',health:p.health??3,alive:p.alive!==false,prop:p.prop||null,propChanges:p.propChanges??3,decoys:p.decoys??10,flash:p.flash!==false,locked:false,x:spawn.x+Math.cos(angle)*r,z:spawn.z+Math.sin(angle)*r,y:0,yaw:Math.PI,pitch:0,vx:0,vy:0,vz:0,radius:dog ? .38 : .32,height:dog ? .85 : 1.72,grounded:true,mantle:null,anim:'idle',animTime:Math.random()*2,recoil:0,netTarget:null,lastShot:0,ai:{timer:0,target:null,detected:null,changeTimer:5+Math.random()*5,decoyTimer:4+Math.random()*8}};
    actor.rig=dog?buildDogRig(person,actor.role):buildHumanRig(person,actor.role);actor.rig.userData.actor=actor;game.scene.add(actor.rig);applyActorVisual(actor);actor.rig.position.set(actor.x,actor.y,actor.z);actor.rig.rotation.y=actor.yaw;return actor;
  }
  function playerCountSafe(){return Math.max(1,roomState?.players?.length||1);}

  function skinMat(color){return new THREE.MeshStandardMaterial({color,roughness:.88});}
  function buildHumanRig(person,role){
    const style=OUTFITS[person.id]||OUTFITS.john,g=new THREE.Group();g.name=`human-${person.id}`;const mats={top:new THREE.MeshStandardMaterial({color:style.top,roughness:.86}),legs:new THREE.MeshStandardMaterial({color:style.legs,roughness:.9}),boots:new THREE.MeshStandardMaterial({color:style.boots,roughness:.95}),skin:skinMat(style.skin),hair:new THREE.MeshStandardMaterial({color:style.hair,roughness:.95})};
    const pelvis=new THREE.Mesh(new THREE.BoxGeometry(.46,.22,.28),mats.legs);pelvis.position.y=.88;g.add(pelvis);const torso=new THREE.Mesh(THREE.CapsuleGeometry ? new THREE.CapsuleGeometry(.27,.52,6,12) : new THREE.BoxGeometry(.56,.68,.32),mats.top);if(torso.geometry.type==='CapsuleGeometry'){}torso.position.y=1.26;torso.scale.set(1.0,1.0,.78);g.add(torso);
    const neck=new THREE.Mesh(new THREE.CylinderGeometry(.09,.1,.12,10),mats.skin);neck.position.y=1.63;g.add(neck);const head=new THREE.Mesh(new THREE.SphereGeometry(.22,18,14),mats.skin);head.position.y=1.82;g.add(head);const hair=new THREE.Mesh(new THREE.SphereGeometry(.226,18,10,0,Math.PI*2,0,Math.PI*.56),mats.hair);hair.position.set(0,1.9,.015);g.add(hair);
    const face=new THREE.Group();face.position.set(0,1.82,-.205);for(const x of [-.075,.075]){const eye=new THREE.Mesh(new THREE.SphereGeometry(.018,8,6),new THREE.MeshStandardMaterial({color:0x26201c}));eye.position.set(x,.035,-.012);face.add(eye)}const nose=new THREE.Mesh(new THREE.ConeGeometry(.024,.055,8),mats.skin);nose.rotation.x=-Math.PI/2;nose.position.set(0,-.005,-.035);face.add(nose);const mouth=new THREE.Mesh(new THREE.BoxGeometry(.08,.012,.012),new THREE.MeshStandardMaterial({color:0x7b4942}));mouth.position.set(0,-.075,-.02);face.add(mouth);g.add(face);
    const arm=(side)=>{const shoulder=new THREE.Group();shoulder.position.set(side*.34,1.5,0);const upper=new THREE.Mesh(new THREE.CylinderGeometry(.07,.075,.42,9),mats.top);upper.position.y=-.21;shoulder.add(upper);const elbow=new THREE.Group();elbow.position.y=-.42;shoulder.add(elbow);const lower=new THREE.Mesh(new THREE.CylinderGeometry(.055,.065,.38,9),mats.skin);lower.position.y=-.19;elbow.add(lower);const hand=new THREE.Mesh(new THREE.SphereGeometry(.072,10,8),mats.skin);hand.position.y=-.39;elbow.add(hand);g.add(shoulder);return{shoulder,elbow,hand}};
    const leg=(side)=>{const hip=new THREE.Group();hip.position.set(side*.16,.84,0);const upper=new THREE.Mesh(new THREE.CylinderGeometry(.09,.1,.46,9),mats.legs);upper.position.y=-.23;hip.add(upper);const knee=new THREE.Group();knee.position.y=-.46;hip.add(knee);const lower=new THREE.Mesh(new THREE.CylinderGeometry(.075,.085,.42,9),mats.legs);lower.position.y=-.21;knee.add(lower);const boot=new THREE.Mesh(new THREE.BoxGeometry(.16,.13,.3),mats.boots);boot.position.set(0,-.46,-.07);knee.add(boot);g.add(hip);return{hip,knee}};
    const leftArm=arm(-1),rightArm=arm(1),leftLeg=leg(-1),rightLeg=leg(1);const weaponAnchor=new THREE.Group();weaponAnchor.position.set(0,.015,-.08);rightArm.hand.add(weaponAnchor);const weapon=buildGun();weapon.position.set(0,.02,-.12);weaponAnchor.add(weapon);weapon.visible=role==='hunter';
    g.userData.parts={torso,head,face,hair,leftArm,rightArm,leftLeg,rightLeg,weaponAnchor,weapon};tagActorMeshes(g);return g;
  }

  function buildDogRig(person,role){
    const style=OUTFITS[person.id]||OUTFITS.gunner,g=new THREE.Group(),fur=new THREE.MeshStandardMaterial({color:style.fur,roughness:.92}),accent=new THREE.MeshStandardMaterial({color:style.accent,roughness:.9}),dark=new THREE.MeshStandardMaterial({color:0x2b2723,roughness:.9});g.name=`dog-${person.id}`;const body=new THREE.Mesh(new THREE.SphereGeometry(.42,16,12),fur);body.scale.set(1.15,.68,.9);body.position.set(0,.58,.08);g.add(body);const neck=new THREE.Mesh(new THREE.CylinderGeometry(.19,.24,.38,10),fur);neck.rotation.x=.35;neck.position.set(0,.67,-.36);g.add(neck);const head=new THREE.Mesh(new THREE.SphereGeometry(.29,16,12),fur);head.position.set(0,.78,-.58);g.add(head);const muzzle=new THREE.Mesh(new THREE.SphereGeometry(.17,12,9),accent);muzzle.scale.set(.8,.62,1.0);muzzle.position.set(0,.72,-.82);g.add(muzzle);const nose=new THREE.Mesh(new THREE.SphereGeometry(.055,10,8),dark);nose.position.set(0,.75,-.95);g.add(nose);for(const x of [-.11,.11]){const eye=new THREE.Mesh(new THREE.SphereGeometry(.025,8,6),dark);eye.position.set(x,.84,-.81);g.add(eye)}for(const x of [-.2,.2]){const ear=new THREE.Mesh(new THREE.ConeGeometry(.1,.28,8),fur);ear.position.set(x,.98,-.54);ear.rotation.z=x < 0 ? .2 : -.2;g.add(ear)}
    const legs=[];for(const x of [-.25,.25])for(const z of [-.23,.33]){const pivot=new THREE.Group();pivot.position.set(x,.42,z);const l=new THREE.Mesh(new THREE.CylinderGeometry(.055,.065,.44,8),fur);l.position.y=-.22;pivot.add(l);const paw=new THREE.Mesh(new THREE.SphereGeometry(.075,10,7),accent);paw.scale.set(1,.55,1.3);paw.position.set(0,-.45,-.03);pivot.add(paw);g.add(pivot);legs.push(pivot)}const tailPivot=new THREE.Group();tailPivot.position.set(0,.68,.52);const tail=new THREE.Mesh(new THREE.CylinderGeometry(.035,.065,.5,8),fur);tail.position.y=.22;tail.rotation.x=-.35;tailPivot.add(tail);g.add(tailPivot);const harness=new THREE.Mesh(new THREE.BoxGeometry(.62,.16,.5),new THREE.MeshStandardMaterial({color:0x3d4c49,roughness:.7,metalness:.12}));harness.position.set(0,.88,.06);g.add(harness);const weaponAnchor=new THREE.Group();weaponAnchor.position.set(0,.98,-.05);g.add(weaponAnchor);const weapon=buildGun(.72);weapon.rotation.x=.02;weaponAnchor.add(weapon);weapon.visible=role==='hunter';g.userData.parts={body,head,legs,tailPivot,weaponAnchor,weapon};tagActorMeshes(g);return g;
  }

  function buildGun(scale=.78){
    const g=new THREE.Group(),metal=new THREE.MeshStandardMaterial({color:0x343b3f,roughness:.38,metalness:.72}),accent=new THREE.MeshStandardMaterial({color:0x8a4b40,roughness:.55,metalness:.28}),dark=new THREE.MeshStandardMaterial({color:0x171b1d,roughness:.62,metalness:.4});g.scale.setScalar(scale);const receiver=new THREE.Mesh(new THREE.BoxGeometry(.24,.2,.68),metal);receiver.position.z=-.18;g.add(receiver);const stock=new THREE.Mesh(new THREE.BoxGeometry(.2,.25,.42),dark);stock.position.set(0,-.03,.35);stock.rotation.x=-.12;g.add(stock);const barrel=new THREE.Mesh(new THREE.CylinderGeometry(.035,.045,.72,10),metal);barrel.rotation.x=Math.PI/2;barrel.position.set(0,.03,-.86);g.add(barrel);const shroud=new THREE.Mesh(new THREE.CylinderGeometry(.075,.075,.28,10),accent);shroud.rotation.x=Math.PI/2;shroud.position.set(0,.03,-.58);g.add(shroud);const grip=new THREE.Mesh(new THREE.BoxGeometry(.11,.34,.15),dark);grip.position.set(0,-.22,-.03);grip.rotation.x=-.25;g.add(grip);const sight=new THREE.Mesh(new THREE.BoxGeometry(.08,.09,.16),accent);sight.position.set(0,.16,-.32);g.add(sight);const muzzle=new THREE.Object3D();muzzle.position.set(0,.03,-1.23);g.add(muzzle);g.userData.muzzle=muzzle;return g;
  }

  function tagActorMeshes(g){g.traverse(o=>{if(o.isMesh){o.castShadow=true;o.receiveShadow=true;o.userData.actorHit=true}});}

  function applyActorVisual(actor){
    if(actor.prop){if(actor.propMesh)actor.rig.remove(actor.propMesh);actor.rig.traverse(o=>{if(o!==actor.rig)o.visible=false});const m=createPropMesh(actor.prop);actor.propMesh=m;actor.rig.add(m);const d=propDef(actor.prop);actor.height=d.h;actor.radius=Math.max(.18,Math.min(.55,Math.max(d.w,d.d)*.45));}
    else{if(actor.propMesh){actor.rig.remove(actor.propMesh);actor.propMesh=null}actor.rig.traverse(o=>o.visible=true);const dog=isDog(actor.person);actor.height=dog ? .85 : 1.72;actor.radius=dog ? .38 : .32;const parts=actor.rig.userData.parts;if(parts?.weapon)parts.weapon.visible=actor.role==='hunter';}
  }

  function bindControls(){
    window.addEventListener('keydown',onKeyDown);window.addEventListener('keyup',onKeyUp);window.addEventListener('resize',onResize);const stage=root.querySelector('#ph3Stage'),joyEl=root.querySelector('#phJoy'),stick=root.querySelector('#phStick');
    stage.addEventListener('pointerdown',e=>{if(e.target.closest('button')||e.target.closest('#phJoy'))return;look.id=e.pointerId;look.x=e.clientX;look.y=e.clientY;stage.setPointerCapture?.(e.pointerId)});stage.addEventListener('pointermove',e=>{if(look.id!==e.pointerId)return;const dx=e.clientX-look.x,dy=e.clientY-look.y;look.x=e.clientX;look.y=e.clientY;game.cameraYaw-=dx*.006;game.cameraPitch=clamp(game.cameraPitch-dy*.004,-.38,.62)});stage.addEventListener('pointerup',e=>{if(look.id===e.pointerId)look.id=null});stage.addEventListener('contextmenu',e=>e.preventDefault());
    joyEl.addEventListener('pointerdown',e=>{joy.id=e.pointerId;joyEl.setPointerCapture?.(e.pointerId);updateJoy(e)});joyEl.addEventListener('pointermove',e=>{if(joy.id===e.pointerId)updateJoy(e)});joyEl.addEventListener('pointerup',e=>{if(joy.id===e.pointerId){joy.id=null;joy.x=joy.z=0;stick.style.transform='translate(0,0)'}});
    root.querySelector('#phJump').onpointerdown=()=>{input.jumpQueued=true};root.querySelector('#phSprint').onclick=()=>{input.sprint=!input.sprint;root.querySelector('#phSprint').classList.toggle('active',input.sprint)};const aim=root.querySelector('#phAim');aim.onpointerdown=()=>{input.aim=true};aim.onpointerup=aim.onpointercancel=()=>{input.aim=false};root.querySelector('#phShoot').onpointerdown=()=>shoot();root.querySelector('#phProp').onclick=()=>changeProp();root.querySelector('#phFlashBtn').onclick=()=>flash();root.querySelector('#phDecoy').onclick=()=>dropDecoy();root.querySelector('#phLock').onclick=()=>toggleLock();
    onResize();
  }
  function updateJoy(e){const el=root.querySelector('#phJoy'),stick=root.querySelector('#phStick'),r=el.getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height/2,dx=e.clientX-cx,dy=e.clientY-cy,max=r.width*.31,l=Math.hypot(dx,dy)||1,k=Math.min(1,max/l);joy.x=dx/max*k;joy.z=-dy/max*k;stick.style.transform=`translate(${dx*k}px,${dy*k}px)`;}
  function onKeyDown(e){keys[e.code]=true;if(e.code==='Space'){input.jumpQueued=true;e.preventDefault()}if(e.code==='KeyE')changeProp();if(e.code==='KeyF')flash();if(e.code==='KeyQ')dropDecoy();if(e.code==='KeyL')toggleLock();if(e.code==='Mouse0')shoot();}
  function onKeyUp(e){keys[e.code]=false;}
  function onResize(){if(!game?.renderer)return;const c=game.renderer.domElement,r=c.getBoundingClientRect();game.renderer.setSize(Math.max(320,r.width),Math.max(360,r.height),false);game.camera.aspect=Math.max(.5,r.width/Math.max(1,r.height));game.camera.updateProjectionMatrix();}

  function loop(now){if(!game)return;const dt=Math.min(.04,Math.max(.001,(now-lastFrame)/1000));lastFrame=now;update(dt,now);game.renderer.render(game.scene,game.camera);raf=requestAnimationFrame(loop);}
  function update(dt,now){
    if(!game.player)return;game.shotCooldown=Math.max(0,(game.shotCooldown||0)-dt);updatePhase();updatePlayer(dt);updateBots(dt);updateRemoteActors(dt);updateActorVisuals(dt);updateNpcs(dt);updateEffects(dt);updateCamera(dt);updateHud();if(network&&now-game.lastNetworkSend>100){sendNetworkSnapshots();game.lastNetworkSend=now}
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
    const a=game.player;if(!a.alive)return;if(a.locked&&a.prop){a.vx=a.vz=0;animateMantle(a,dt);return}a.yaw=game.cameraYaw;a.pitch=game.cameraPitch;
    if(a.mantle){animateMantle(a,dt);return}
    const kx=(keys.KeyD?1:0)-(keys.KeyA?1:0)+joy.x,kz=(keys.KeyW?1:0)-(keys.KeyS?1:0)+joy.z;let len=Math.hypot(kx,kz),mx=0,mz=0;if(len>.05){const nx=kx/len,nz=kz/len,sy=Math.sin(game.cameraYaw),cy=Math.cos(game.cameraYaw);mx=nx*cy+nz*sy;mz=nx*sy-nz*cy}
    const sprint=keys.ShiftLeft||keys.ShiftRight||input.sprint,speed=sprint?4.7:2.85,targetVx=mx*speed,targetVz=mz*speed,accel=len>.05?16:22;a.vx+=(targetVx-a.vx)*Math.min(1,accel*dt);a.vz+=(targetVz-a.vz)*Math.min(1,accel*dt);
    if(input.jumpQueued&&a.grounded){a.vy=6.35;a.grounded=false;input.jumpQueued=false}
    const moving=Math.hypot(a.vx,a.vz)>.15;moveActor(a,a.vx*dt,a.vz*dt,input.jumpQueued||a.vy>1.2);resolveActorOverlap(a);input.jumpQueued=false;
    a.vy-=18.5*dt;{const nextY=a.y+a.vy*dt,ceiling=a.vy>0?core.ceilingBottom(a.x,a.z,a.radius,a.y,a.height,nextY,game.world.colliders):null;if(ceiling!=null){a.y=ceiling-a.height-.015;a.vy=0}else a.y=nextY}const support=core.supportHeight(a.x,a.z,a.radius,game.world.colliders,a.y+.08,.46);if(a.y<=support){if(a.vy<-.8)a.anim='land';a.y=support;a.vy=0;a.grounded=true}else a.grounded=false;
    if(!a.grounded)a.anim=a.vy>0?'jump':'fall';else if(moving)a.anim=sprint?'run':'walk';else a.anim=input.aim?'aim':'idle';a.rig.position.set(a.x,a.y,a.z);a.rig.rotation.y=a.yaw;
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

  function updateRemoteActors(dt){if(!network)return;for(const a of game.actors){if(a===game.player||a.isBot&&roomState.isHost)continue;if(a.netTarget){core.interpolateSnapshot(a,a.netTarget,dt,12);a.rig.position.set(a.x,a.y,a.z);a.rig.rotation.y=a.yaw;const newProp=a.netTarget.prop||null;if(newProp!==a.prop){a.prop=newProp;applyActorVisual(a)}}}}
  function applyRoomState(){if(!game||!roomState)return;if(roomState.round!==game.round){game.round=roomState.round;const next=roomState.activeMap||mapFor(roomState.settings.mapKey,roomState.round);disposeRoot();ensureEngine().then(()=>startEngine(next));return}for(const p of roomState.players){const a=game.actorsById.get(p.id);if(!a)continue;a.role=p.role;a.health=p.health;a.alive=p.alive;a.propChanges=p.propChanges;a.decoys=p.decoys;a.flash=p.flash;if(p.prop!==a.prop){a.prop=p.prop;applyActorVisual(a)}const parts=a.rig.userData.parts;if(parts?.weapon)parts.weapon.visible=a.role==='hunter'&&!a.prop;}if(roomState.phase==='matchEnd')showMatchEnd();}
  function handleNetworkAction(m){if(m.action==='flash'){const source=game.actorsById.get(m.playerId);if(source&&game.player.role==='hunter'&&core.dist2(source,game.player)<3.5)flashScreen();addFeed(`${source?.person?.name||'A hider'} fired a flash.`)}if(m.action==='hit'){const target=game.actorsById.get(m.targetId);if(target){target.health=m.health;target.alive=m.alive;target.role=m.role;target.anim='hit';if(!target.alive)spawnPoof(target.x,target.y+.6,target.z);addFeed(`${target.person.name} was hit. ${target.health}/3.`)}}if(m.action==='decoy')spawnDecoy(m.prop,m.position?.x||0,m.position?.z||0);}

  function sendNetworkSnapshots(){if(!ws||ws.readyState!==1)return;const sendActor=a=>ws.send(JSON.stringify({type:'snapshot',playerId:a.id,snapshot:{x:a.x,y:a.y,z:a.z,yaw:a.yaw,pitch:a.pitch,vx:a.vx,vy:a.vy,vz:a.vz,anim:a.anim,prop:a.prop,locked:a.locked,seq:Math.floor(performance.now())}}));sendActor(game.player);if(roomState.isHost)for(const a of game.actors)if(a.isBot)sendActor(a);}

  function updateActorVisuals(dt){for(const a of game.actors){if(!a.alive){a.rig.visible=false;continue}a.rig.visible=true;a.animTime+=dt;animateRig(a,dt)}}
  function animateRig(a,dt){
    const p=a.rig.userData.parts;if(!p||a.prop)return;
    const speed=a.anim==='run'?10:a.anim==='walk'?6:2,swing=a.anim==='run' ? .7 : a.anim==='walk' ? .43 : .04,t=Math.sin(a.animTime*speed)*swing;
    if(p.leftLeg){
      p.leftLeg.hip.rotation.x=t;p.rightLeg.hip.rotation.x=-t;p.leftLeg.knee.rotation.x=Math.max(0,-t)*.5;p.rightLeg.knee.rotation.x=Math.max(0,t)*.5;
      if(a.anim==='mantle'){
        p.leftArm.shoulder.rotation.set(2.35,0,.18);p.rightArm.shoulder.rotation.set(2.35,0,-.18);p.leftArm.elbow.rotation.x=-.35;p.rightArm.elbow.rotation.x=-.35;p.leftLeg.hip.rotation.x=.6;p.rightLeg.hip.rotation.x=.25;
      }else if(a.role==='hunter'){
        const bob=(a.anim==='walk'||a.anim==='run')?t*.08:0;
        p.leftArm.shoulder.rotation.set(1.00+bob,0,.25);p.rightArm.shoulder.rotation.set(1.08-bob,0,-.18);p.leftArm.elbow.rotation.x=-.33;p.rightArm.elbow.rotation.x=-.2;
      }else{
        p.leftArm.shoulder.rotation.set(-t*.65,0,0);p.rightArm.shoulder.rotation.set(t*.65,0,0);p.leftArm.elbow.rotation.x=0;p.rightArm.elbow.rotation.x=0;
      }
    }else if(p.legs){
      p.legs.forEach((leg,i)=>leg.rotation.x=(i%2?t:-t)*.72);p.tailPivot.rotation.x=-.45+Math.sin(a.animTime*7)*.25;
    }
    if(p.weaponAnchor){a.recoil=Math.max(0,a.recoil-dt*7);p.weaponAnchor.rotation.x=-a.pitch*.42-a.recoil*.16;if(isDog(a.person))p.weaponAnchor.rotation.y=0}
  }

  function updateNpcs(dt){for(const n of game.world.npcs||[]){const ai=n.userData.npc;ai.timer-=dt;if(ai.timer<=0){ai.timer=1.5+Math.random()*3;ai.tx=ai.baseX+(Math.random()-.5)*1.6;ai.tz=ai.baseZ+(Math.random()-.5)*1.6}if(ai.tx!=null){const dx=ai.tx-n.position.x,dz=ai.tz-n.position.z,l=Math.hypot(dx,dz)||1;if(l>.08){n.position.x+=dx/l*.35*dt;n.position.z+=dz/l*.35*dt;n.rotation.y=Math.atan2(dx,-dz)}}}}

  function updateEffects(dt){for(let i=game.effects.length-1;i>=0;i--){const e=game.effects[i];e.life-=dt;if(e.kind==='tracer')e.mesh.material.opacity=Math.max(0,e.life/e.max);if(e.kind==='spark'){e.vy-=8*dt;e.mesh.position.x+=e.vx*dt;e.mesh.position.y+=e.vy*dt;e.mesh.position.z+=e.vz*dt;e.mesh.material.opacity=Math.max(0,e.life/e.max)}if(e.life<=0){game.scene.remove(e.mesh);e.mesh.geometry?.dispose?.();e.mesh.material?.dispose?.();game.effects.splice(i,1)}}}

  function updateCamera(dt){const a=game.player,target=new THREE.Vector3(a.x,a.y+a.height*(a.prop ? .58 : .78),a.z),forward=new THREE.Vector3(Math.sin(game.cameraYaw),0,-Math.cos(game.cameraYaw));const desiredDist=input.aim?1.8:3.25,desiredFov=input.aim?51:64;game.cameraDistance+=(desiredDist-game.cameraDistance)*Math.min(1,dt*10);game.camera.fov+=(desiredFov-game.camera.fov)*Math.min(1,dt*10);game.camera.updateProjectionMatrix();const horizontal=Math.cos(game.cameraPitch)*game.cameraDistance,desired={x:target.x-forward.x*horizontal,y:target.y+Math.sin(game.cameraPitch)*game.cameraDistance+.28,z:target.z-forward.z*horizontal};const dist=core.cameraObstructionDistance({x:target.x,y:target.y,z:target.z},desired,game.world.colliders,.18),full=Math.hypot(desired.x-target.x,desired.y-target.y,desired.z-target.z)||1,ratio=dist/full;game.cameraActualDistance+=(dist-game.cameraActualDistance)*Math.min(1,dt*18);const rr=game.cameraActualDistance/full;game.camera.position.set(target.x+(desired.x-target.x)*rr,target.y+(desired.y-target.y)*rr,target.z+(desired.z-target.z)*rr);game.camera.lookAt(target.x+forward.x*3,target.y-.05-game.cameraPitch*.3,target.z+forward.z*3);a.yaw=game.cameraYaw;}

  function shoot(){const a=game?.player;if(!a||a.role!=='hunter'||!a.alive||roomState.phase!=='hunt'||game.shotCooldown>0)return;game.shotCooldown=.11;a.recoil=.7;const ray=new THREE.Raycaster();ray.setFromCamera(new THREE.Vector2(0,0),game.camera);ray.far=28;const targets=[...game.world.raycastMeshes];for(const d of game.decoys)d.traverse(o=>{if(o.isMesh&&o.visible)targets.push(o)});for(const n of game.world.npcs||[])n.traverse(o=>{if(o.isMesh&&o.visible)targets.push(o)});for(const b of game.actors)if(b!==a&&b.alive)b.rig.traverse(o=>{if(o.isMesh&&o.visible)targets.push(o)});const hits=ray.intersectObjects(targets,false).filter(h=>h.object.visible);let hitPoint=game.camera.position.clone().add(ray.ray.direction.clone().multiplyScalar(25)),target=null;if(hits.length){const h=hits[0];hitPoint=h.point.clone();let o=h.object;while(o&&o!==game.scene){if(o.userData.actor){target=o.userData.actor;break}if(o.parent?.userData?.actor){target=o.parent.userData.actor;break}o=o.parent}if(!target){let parent=h.object;while(parent){if(parent.userData?.actor){target=parent.userData.actor;break}parent=parent.parent}}}spawnTracer(a,hitPoint);if(target&&target.role==='hider'){registerHit(a,target);showHit()}else spawnSparks(hitPoint,5);}
  function registerHit(shooter,target){if(!target.alive)return;if(network&&ws?.readyState===1){ws.send(JSON.stringify({type:'action',action:'hit',targetId:target.id}));return}target.health--;target.locked=false;target.anim='hit';spawnSparks(new THREE.Vector3(target.x,target.y+target.height*.55,target.z),8);addFeed(`Hit ${target.prop||target.person.name}: ${Math.max(0,target.health)}/3.`);if(target.health<=0){if(roomState.settings.mode==='chaos'){target.role='hunter';target.health=3;target.prop=null;target.alive=true;applyActorVisual(target);addFeed(`${target.person.name} joins the hunters.`)}else{target.alive=false;target.rig.visible=false;spawnPoof(target.x,target.y+.6,target.z);addFeed(`${target.person.name} was found.`)}}}
  function spawnTracer(a,end){const parts=a.rig.userData.parts,muzzle=parts?.weapon?.userData?.muzzle,start=new THREE.Vector3(a.x,a.y+a.height*.68,a.z);if(muzzle){muzzle.getWorldPosition(start)}const geom=new THREE.BufferGeometry().setFromPoints([start,end]);const mat=new THREE.LineBasicMaterial({color:0xffd36e,transparent:true,opacity:.95});const line=new THREE.Line(geom,mat);game.scene.add(line);game.effects.push({kind:'tracer',mesh:line,life:.08,max:.08});const flash=new THREE.PointLight(0xffd06a,3,2,2);flash.position.copy(start);game.scene.add(flash);game.effects.push({kind:'light',mesh:flash,life:.04,max:.04});}
  function spawnSparks(pos,n){for(let i=0;i<n;i++){const mesh=new THREE.Mesh(new THREE.SphereGeometry(.025,6,4),new THREE.MeshBasicMaterial({color:0xffcf5a,transparent:true}));mesh.position.copy(pos);game.scene.add(mesh);game.effects.push({kind:'spark',mesh,life:.28+Math.random()*.25,max:.5,vx:(Math.random()-.5)*2.2,vy:1+Math.random()*2,vz:(Math.random()-.5)*2.2})}}
  function spawnPoof(x,y,z){const mesh=new THREE.Mesh(new THREE.SphereGeometry(.3,12,8),new THREE.MeshBasicMaterial({color:0xfff1d1,transparent:true,opacity:.75}));mesh.position.set(x,y,z);game.scene.add(mesh);game.effects.push({kind:'spark',mesh,life:.55,max:.55,vx:0,vy:.35,vz:0})}
  function showHit(){const e=root.querySelector('#ph3Hit');if(!e)return;e.classList.remove('on');void e.offsetWidth;e.classList.add('on');}

  function nearestProp(a,max=1.6){let best=null,bd=max;for(const p of game.world.props){const d=Math.hypot(a.x-p.x,a.z-p.z);if(d<bd){best=p;bd=d}}return best;}
  function changeProp(){const a=game?.player;if(!a||a.role!=='hider'||!a.alive)return;const p=nearestProp(a,1.7);if(!p){APP.toast('Move closer to a prop');return}if(a.prop&&a.propChanges<=0){APP.toast('No prop changes left');return}if(network&&ws?.readyState===1){ws.send(JSON.stringify({type:'action',action:'disguise',prop:p.type}));return}applyDisguise(a,p.type,true);}
  function applyDisguise(a,type,announce=true){if(a.prop&&a.propChanges<=0)return;if(a.prop)a.propChanges--;a.prop=type;a.flash=true;a.locked=false;applyActorVisual(a);if(announce)addFeed(`${a.person.name} disguised as ${type}. Health stayed at ${a.health}/3.`);}
  function toggleLock(){const a=game?.player;if(!a||a.role!=='hider'||!a.prop)return;a.locked=!a.locked;APP.toast(a.locked?'Prop locked':'Prop unlocked');}
  function dropDecoy(){const a=game?.player;if(!a||a.role!=='hider'||!a.prop||a.decoys<=0)return;if(network&&ws?.readyState===1){ws.send(JSON.stringify({type:'action',action:'decoy'}));return}a.decoys--;spawnDecoy(a.prop,a.x,a.z);addFeed(`Decoy dropped. ${a.decoys}/10 left.`);}
  function spawnDecoy(type,x,z){const mesh=createPropMesh(type);mesh.position.set(x+(Math.random()-.5)*.5,0,z+(Math.random()-.5)*.5);mesh.rotation.y=Math.random()*Math.PI*2;game.scene.add(mesh);game.decoys.push(mesh);}
  function flash(){const a=game?.player;if(!a||a.role!=='hider'||!a.prop||!a.flash)return;if(network&&ws?.readyState===1){ws.send(JSON.stringify({type:'action',action:'flash'}));a.flash=false;return}useFlash(a,true);}
  function useFlash(a,announce=true){if(!a.flash)return;a.flash=false;for(const h of game.actors)if(h.role==='hunter'&&h.alive&&core.dist2(a,h)<3.5&&h===game.player)flashScreen();if(announce)addFeed(`${a.person.name} fired the flash.`);}
  function flashScreen(){const ov=root.querySelector('#ph3Flash');ov?.classList.add('on');setTimeout(()=>ov?.classList.remove('on'),850);}

  function updateHud(){const a=game.player,phase=root.querySelector('#ph3Phase'),role=root.querySelector('#ph3Role'),health=root.querySelector('#ph3Health'),load=root.querySelector('#ph3Load'),feed=root.querySelector('#ph3Feed'),prompt=root.querySelector('#ph3Prompt');if(!phase)return;const left=roomState.phaseEndsAt?Math.max(0,roomState.phaseEndsAt-Date.now()):0;phase.textContent=`${String(roomState.phase).toUpperCase()} ${left?fmt(left/1000):''} - ${mapName(game.mapKey)} - R${roomState.round}/${roomState.settings.rounds}`;role.textContent=a.role==='hunter'?'HUNTER - prop-zapper':`HIDER${a.prop?` - ${a.prop}`:''}`;health.textContent=`HP ${Math.max(0,a.health)}/3`;load.innerHTML=a.role==='hider'?`Disguise: <b>${esc(a.prop||'none')}</b><br>Changes left: <b>${a.propChanges}</b><br>Decoys: <b>${a.decoys}/10</b><br>Flash: <b>${a.flash?'READY':'USED'}</b><br>Lock: <b>${a.locked?'LOCKED':'FREE'}</b><br>Health carries through disguise changes.`:`Weapon: <b>3D prop-zapper</b><br>Aim: <b>${input.aim?'ZOOM':'HIP'}</b><br>Raycast stops at the first wall, prop or player.<br>Unlimited reserve ammunition.`;if(feed){feed.innerHTML=game.feed.slice(-12).map(x=>`<div>${esc(x)}</div>`).join('');feed.scrollTop=feed.scrollHeight}game.nearProp=a.role==='hider'?nearestProp(a,1.65):null;if(prompt){if(game.nearProp){prompt.textContent=`PROP: ${game.nearProp.type}`;prompt.classList.add('on')}else prompt.classList.remove('on')}for(const id of ['phProp','phFlashBtn','phDecoy','phLock']){const b=root.querySelector('#'+id);if(b)b.disabled=a.role!=='hider'}const s=root.querySelector('#phShoot');if(s)s.disabled=a.role!=='hunter'||roomState.phase!=='hunt';}
  function fmt(sec){sec=Math.ceil(sec);return `${Math.floor(sec/60)}:${String(sec%60).padStart(2,'0')}`;}
  function mapName(k){return k==='papa'?"Papa's Shop":k==='camp'?'Camper / Campsite':k==='acreage'?'Backyard + Fire Pit':'Goat / Farm';}
  function addFeed(t){if(!game)return;game.feed.push(t);if(game.feed.length>60)game.feed.shift();}

  function showMatchEnd(){if(!game)return;modal(`<div class="status-large"><span class="eyebrow">MATCH COMPLETE</span><strong>${roomState.wins.hiders>roomState.wins.hunters?'HIDERS WIN THE NIGHT':roomState.wins.hunters>roomState.wins.hiders?'HUNTERS WIN THE NIGHT':'TIE GAME'}</strong><p>Hiders ${roomState.wins.hiders} - Hunters ${roomState.wins.hunters}</p><button id="phReturn" class="btn success">RETURN TO LODGE</button></div>`,m=>m.querySelector('#phReturn').onclick=()=>{location.href='/'})}
  function modal(html,bind){closeModal();const d=document.createElement('div');d.className='modal-backdrop';d.id='ph3Modal';d.innerHTML=`<div class="modal">${html}</div>`;document.body.appendChild(d);if(bind)bind(d.querySelector('.modal'));}
  function closeModal(){document.getElementById('ph3Modal')?.remove();}

  window.__PROP_HUNT_REAL3D__={version:'1.3.0-real3d',renderer:'WebGL',three:'0.185.1',usesDepthBuffer:true,usesCanvas2D:false};
  window.PropHunt={mount,stop};
})();
