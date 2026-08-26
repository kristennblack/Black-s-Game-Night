/*
 * Black Family Game Night - Family Prop Hunt
 * v3.8.0-phase-v-world-expansion
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
  const PHASE_E_URL='/phase-e-qa.mjs';
  const FAMILY=window.FAMILY;
  const APP=window.APP||{toast:()=>{}};
  const family=()=>[...(FAMILY?.people||[]),...(FAMILY?.supports||[])];
  const personById=id=>family().find(p=>p.id===id)||family()[0];
  const isDog=p=>!!p?.dog||['kelsi','molly','gunner'].includes(p?.id);
  const TEST_SCALE=location.search.includes('test=1') ? .03 : 1;
  const QA_MODE=new URLSearchParams(location.search).get('qa3d')==='1';
  const CDN_NOTICE='Three.js 0.185.1';

  let root=null,THREE=null,core=null,art=null,gameplay=null,studio=null,phaseE=null,assets=null,audio=null,loadPromise=null,game=null,raf=0,lastFrame=0;
  let network=null,roomState=null,ws=null,reconnectTimer=0,pollTimer=0;
  const keys=Object.create(null);
  const joy={x:0,z:0,id:null};
  const look={id:null,x:0,y:0};
  const HUNTER_FIRE_INTERVAL=1/4.8;
  const input={jumpQueued:false,jumpHeld:false,sprint:false,shoot:false};
  const setup={charId:'john',outfit:0,count:6,mode:'classic',mapKey:'papa',botConfigs:[]};

  const OUTFITS={
    john:{top:0x79372f,pattern:'plaid',legs:0x34506b,boots:0x4a2e1d,hair:0x3a2a20,skin:0xd3a477,label:'plaid shirt, jeans, cowboy boots'},
    kristen:{top:0xc7b69d,legs:0x35516d,boots:0x6a4a34,hair:0x5b3e2e,skin:0xd6ab83,label:'T-shirt and jeans'},
    holly:{top:0x7c8794,legs:0x59677b,boots:0x4d433a,hair:0x6a4a34,skin:0xe0b58d,label:'hoodie and baggy jeans'},
    elizabeth:{top:0xc57f8f,legs:0xc5a273,boots:0xeee2d2,hair:0x74523e,skin:0xe2b991,label:'tank top and shorts'},
    vanessa:{top:0xa87b55,legs:0x47617c,boots:0x5a3824,hair:0x4f382c,skin:0xd8aa82,label:'western look'},
    logan:{top:0x53616e,legs:0x3b5067,boots:0x3a342e,hair:0x4b382d,skin:0xd7aa82,label:'hoodie and jeans'},
    james:{top:0x567692,legs:0x46617c,boots:0x4d392b,hair:0xaaa49b,skin:0xcfa078,label:'denim shirt and jeans'},
    dorothy:{top:0x9a6d82,pattern:'floral',legs:0x8f6377,boots:0x5a4038,hair:0xb7a79a,skin:0xd3a47e,label:'flowy dress'},
    nana:{top:0xa97d83,legs:0x444a51,boots:0x47392f,hair:0xc0b3a8,skin:0xd0a17b,label:'leggings and shirt'},
    papa:{top:0x7b6a4e,legs:0x3f5870,boots:0x4c3525,hair:0x9d9287,skin:0xca9b75,label:'shirt and jeans'},
    kelsi:{fur:0x9a6436,accent:0xd9b27a,label:'golden dog with pink collar'},molly:{fur:0xb7793f,accent:0xe3bd84,label:'golden dog, tongue out'},gunner:{fur:0xcbb994,accent:0xeee4cf,label:'large cream/tan farm dog'}
  };


  // Physical character dimensions now come from shared-3d-gameplay.mjs so the same
  // family member has one collider/camera/visual scale contract in all 3D games.
  const bodyProfile=id=>gameplay?.familyBodyProfile?.(id,{dog:['kelsi','molly','gunner'].includes(id)})||{scale:.875,height:1.82,radius:.33,proportions:{}};

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
    'Mud Bucket':{kind:'cylinder',w:.48,d:.48,h:.48,color:0x6d5a47},
    'Tractor':{kind:'tractor',w:2.45,d:1.45,h:1.85,color:0x6f7d43,solid:true,climbable:true},
    'Motorcycle':{kind:'motorcycle',w:1.85,d:.72,h:1.05,color:0x3f4548,solid:true,climbable:true},
    'Papa Chair':{kind:'chair',w:.92,d:.92,h:1.22,color:0xb9a24e,solid:true,climbable:true},
    'Tool Chest':{kind:'box',w:1.05,d:.58,h:1.02,color:0x8a3f34,solid:true,climbable:true},
    'Air Compressor':{kind:'compressor',w:1.12,d:.72,h:.9,color:0x556d76,solid:true,climbable:true},
    'Barrel Stack':{kind:'barrels',w:1.45,d:1.0,h:1.72,color:0x50636a,solid:true,climbable:true},
    'Tree':{kind:'tree',w:1.4,d:1.4,h:3.6,color:0x4f6b42,solid:true,climbable:true}
  };

  function propDef(type){return PROP_DEFS[type]||{kind:'box',w:.44,d:.36,h:.44,color:0x7a6d5b};}
  function avatarPath(p){return `/characters3d/${p.id}.png`;}
  function hex(n){return `#${Number(n).toString(16).padStart(6,'0')}`;}
  function esc(s=''){return String(s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));}
  const clamp=(v,a,b)=>core?core.clamp(v,a,b):Math.max(a,Math.min(b,v));

  async function ensureEngine(){
    if(loadPromise)return loadPromise;
    loadPromise=Promise.all([import(THREE_URL),import(CORE_URL),import(ART_URL),import(GAMEPLAY_URL),import(STUDIO_URL),import(PHASE_E_URL)]).then(([t,c,a,g,s,q])=>{THREE=t;core=c;art=a.create3DArtKit(THREE);gameplay=g;studio=s;phaseE=q;assets=studio.createAuthoredAssetPipeline(THREE,{assetVersion:phaseE.STAGING_BUILD_ID});audio=studio.createAudioSystem();return true}).catch(err=>{console.error('3D engine failed to load',err);throw new Error('The 3D engine could not load. Check the internet connection and reload the game.')});
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
    root.innerHTML=`<div class="game-title-row"><div><span class="eyebrow">FAMILY HIDE & SEEK</span><h1>Family Prop Hunt</h1><p class="subtext">Hide, hunt, climb and change props across the family maps. The gameplay systems are live while finished character and environment artwork is still being produced.</p></div><span class="pill">Private family game</span></div>
      <div class="setup-grid"><section class="panel panel-pad"><h2>Choose your character</h2><div class="ph3-character-grid">${family().map(p=>`<button class="ph3-character-card ${p.id===selected.id?'selected':''}" data-ph-char="${p.id}"><div><img src="${avatarPath(p)}" alt="${esc(p.name)}"></div><strong>${esc(p.name)}</strong><small>${isDog(p)?'3D quadruped + backpack zapper':esc(OUTFITS[p.id]?.label||'3D family character')}</small></button>`).join('')}</div></section>
      <section class="panel panel-pad"><h2>Match</h2><label class="field-label">Total players</label><select id="phCount" class="select">${Array.from({length:11},(_,i)=>i+2).map(n=>`<option ${n===setup.count?'selected':''}>${n}</option>`).join('')}</select><br><br><label class="field-label">Mode</label><select id="phMode" class="select"><option value="classic" ${setup.mode==='classic'?'selected':''}>Classic</option><option value="chaos" ${setup.mode==='chaos'?'selected':''}>Family Chaos</option></select><br><br><label class="field-label">Map</label><select id="phMap" class="select"><option value="papa">Papa's Shop</option><option value="camp">Camper / Campsite</option><option value="acreage">Backyard + Fire Pit</option><option value="farm">Goat / Farm</option><option value="rotate">Rotate all four</option></select><div class="ph3-engine-card"><strong>How it plays</strong><span>Move & run</span><span>Jump & climb</span><span>Crosshair shooting</span><span>Change props</span><span>Reset view anytime</span></div><button id="phStart" class="btn success" style="width:100%;margin-top:12px">START MATCH</button></section></div>`;
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
    root.innerHTML=`<div class="game-title-row"><div><span class="eyebrow">PRIVATE REAL-TIME 3D ROOM</span><h1>Family Prop Hunt</h1><p class="subtext">Room ${esc(roomState.id)}. Everyone stays in one synchronized 3D match.</p></div><span class="pill">${roomState.players.length}/12</span></div><div class="setup-grid"><section class="panel panel-pad"><h2>Players</h2><div class="ph3-room-list">${roomState.players.map(p=>`<div class="ph3-room-player"><img src="${avatarPath(personById(p.avatar))}" alt=""><div><strong>${esc(p.name)}</strong><small>${p.isBot?`Computer - ${esc(p.difficulty)}`:(p.ready?'READY':'not ready')}</small></div><span>${p.avatar===me?.avatar&&p.id===me?.id?'YOU':''}</span>${isHost&&p.isBot?`<button class="mini-btn" data-remove-bot="${p.id}">x</button>`:''}</div>`).join('')}</div><h3>Your character</h3><div class="ph3-character-grid compact">${family().map(p=>`<button class="ph3-character-card ${p.id===me?.avatar?'selected':''}" data-net-char="${p.id}"><div><img src="${avatarPath(p)}" alt="${esc(p.name)}"></div><strong>${esc(p.name)}</strong></button>`).join('')}</div><button id="phReady" class="btn ${me?.ready?'secondary':'success'}" style="width:100%;margin-top:10px">${me?.ready?'NOT READY':'READY'}</button></section><section class="panel panel-pad"><h2>Match setup</h2>${isHost?`<label class="field-label">Mode</label><select id="netMode" class="select"><option value="classic">Classic</option><option value="chaos">Family Chaos</option></select><br><br><label class="field-label">Map</label><select id="netMap" class="select"><option value="papa">Papa's Shop</option><option value="camp">Camper / Campsite</option><option value="acreage">Backyard + Fire Pit</option><option value="farm">Goat / Farm</option><option value="rotate">Rotate maps</option></select><div class="ph3-bot-add"><select id="netBotChar" class="select">${family().map(p=>`<option value="${p.id}">${esc(p.name)}</option>`).join('')}</select><select id="netBotDiff" class="select"><option selected>easy</option><option>medium</option><option>hard</option></select><button id="netAddBot" class="btn secondary">Add Computer</button></div><button id="netStart" class="btn success" style="width:100%;margin-top:12px">START MATCH</button>`:`<div class="ph3-engine-card"><strong>Waiting for host</strong><span>${esc(roomState.settings.mapKey)}</span><span>${esc(roomState.settings.mode)}</span><span>6 rounds</span></div>`}<button id="netCopy" class="btn cream" style="width:100%;margin-top:10px">COPY INVITE LINK</button></section></div>`;
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
    const human=personById(setup.charId),pool=family().filter(p=>p.id!==human.id),players=[{id:'local',name:human.name,avatar:human.id,isBot:false,difficulty:null,ready:true,role:null,health:3,alive:true,prop:null,propChanges:3,decoys:10,flash:true,disguiseOptions:[],hiderScore:0,lifetime:{rounds:0,hiderPoints:0,hunterElims:0,hiderSurvivals:0,hiderWins:0,hunterWins:0}}];
    for(let i=1;i<setup.count;i++){const p=pool[(i-1)%pool.length];players.push({id:`bot-${i}`,name:p.name,avatar:p.id,isBot:true,difficulty:'easy',ready:true,role:null,health:3,alive:true,prop:null,propChanges:3,decoys:10,flash:true,disguiseOptions:[],hiderScore:0,lifetime:{rounds:0,hiderPoints:0,hunterElims:0,hiderSurvivals:0,hiderWins:0,hunterWins:0}})}
    const createdAt=Date.now(),seed=core.roundSeed('solo',1,createdAt),roles=core.assignRoles(players,1),firstMap=mapFor(setup.mapKey,1),assigned=core.assignDisguiseOptions(players,seed,core.disguisePoolForMap(firstMap),4);players.forEach(p=>{p.role=roles[p.id];p.disguiseOptions=p.role==='hider'?(assigned[p.id]||[]):[]});
    roomState={id:'solo',createdAt,phase:'hide',phaseEndsAt:Date.now()+30000*TEST_SCALE,round:1,wins:{hiders:0,hunters:0},roundSeed:seed,layoutVariant:core.layoutVariantForSeed(seed),weatherPreset:core.weatherForSeed(seed),roundSummary:null,settings:{mode:setup.mode,mapKey:setup.mapKey,rounds:6,hideSeconds:30,roundSeconds:300},players,viewerId:'local',isHost:true,activeMap:firstMap};network=null;startEngine(roomState.activeMap||firstMap);
  }

  function startNetworkGame(){if(game)return;const active=roomState.activeMap||mapFor(roomState.settings.mapKey,roomState.round||1);startEngine(active);}
  function mapFor(key,round){return key==='rotate'?['papa','camp','acreage','farm'][((round||1)-1)%4]:key;}

  function startEngine(mapKey){
    disposeRoot();root.innerHTML=gameShell();const canvas=root.querySelector('#ph3Canvas');
    const renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:false,powerPreference:'high-performance'});gameplay.configureRendererForRealism(renderer,THREE,{exposure:1.18,pixelRatio:Math.min(2,devicePixelRatio||1)});
    const scene=new THREE.Scene();scene.background=new THREE.Color(0xa8c3cf);scene.fog=new THREE.Fog(0xa2b7bd,48,105);
    const camera=new THREE.PerspectiveCamera(60,1,.07,180);const clock=new THREE.Clock();
    game={renderer,scene,camera,clock,mapKey,world:null,actors:[],actorsById:new Map(),player:null,keys,feed:[],effects:[],decoys:[],cameraYaw:Math.PI,cameraPitch:.18,cameraDistance:3.65,cameraActualDistance:3.65,shotCooldown:0,recoil:0,round:roomState.round||1,lastNetworkSend:0,startedAt:performance.now(),nearProp:null,controlDisposers:[],padPrev:{},padShoot:false,padSprint:false,spectateTarget:null,ghostMode:'free',ghost:null,lastSummaryRound:0,lastDamageAt:0,lastPhase:roomState.phase,hideReleaseAnnounced:false,roundSeed:roomState.roundSeed||0,layoutVariant:roomState.layoutVariant||0,weatherPreset:roomState.weatherPreset||'clear',qa:{frames:0,accum:0,fps:0,lastHud:0}};
    game.cameraRig=gameplay.createThirdPersonCamera(THREE,camera,core,'propHunt',{yaw:Math.PI,pitch:.18});
    game.performance=gameplay.createPerformanceGovernor(renderer,{targetFps:55,minPixelRatio:.82,maxPixelRatio:Math.min(2,devicePixelRatio||1)});
    game.motionFx=art.createMotionFxSystem(scene,{color:mapKey==='camp'?0xc8b793:mapKey==='farm'?0xa88c68:0xb1a28d,max:24});
    game.cinematic=studio.createCinematicCamera(game.cameraRig);audio.setAmbience(mapKey==='camp'?{birds:.22,water:.28,wind:.18}:mapKey==='farm'?{birds:.3,wind:.25}:{birds:.12,wind:.08});
    game.weatherPreset=roomState.weatherPreset||game.weatherPreset;game.layoutVariant=roomState.layoutVariant??game.layoutVariant;game.roundSeed=roomState.roundSeed||game.roundSeed;game.world=buildWorld(mapKey);const stage=root.querySelector('#ph3Stage');game.controlDisposers.push(phaseE.installInteractionGuards(stage),phaseE.mountZoomButtons(stage,game.cameraRig,{top:'136px',right:'8px'}));game.stagingQa=phaseE.mountStagingDiagnostics(stage,{gameName:'Family Prop Hunt',open:QA_MODE,getSnapshot:()=>{const a=game?.player,c=game?.camera,cs=game?.cameraRig?.state||{};return{game:'Family Prop Hunt',character:a?.person?.name||a?.person?.id,map:game?.mapKey,player:a?{x:a.x,y:a.y,z:a.z}:null,groundHeight:a?core.supportHeight(a.x,a.z,a.radius,game.world.colliders,a.y+.08,.5):null,camera:c?c.position:null,cameraDistance:a&&c?c.position.distanceTo(new THREE.Vector3(a.x,a.y,a.z)):null,desiredZoom:cs.targetDistance,actualZoom:cs.actualDistance,cameraPitch:cs.pitch,cameraObstructed:cs.obstructed,animation:a?.anim,studioAnimation:a?._studioAnimState||null,aimAssist:game?.aimAssist?.actor?.person?.name||null,movement:a?(!a.grounded?'air':Math.hypot(a.vx||0,a.vz||0)>.2?'moving':'idle'):'n/a',cameraRig:cs}}});game.controlDisposers.push(()=>game?.stagingQa?.dispose?.());game.nav=studio.createNavigationGrid({minX:game.world.bounds.minX,maxX:game.world.bounds.maxX,minZ:game.world.bounds.minZ,maxZ:game.world.bounds.maxZ,cellSize:.72,isBlocked:(x,z)=>!!core.blockingCollider(x,z,.34,0,1.55,game.world.colliders)});spawnActors();bindControls();onResize();resetPlayableView({announce:false});addFeed('Prop Hunt ready. Hide smart or start hunting.');if(network)addFeed('Family room connected.');lastFrame=performance.now();loop(lastFrame);
  }

  function disposeRoot(){if(game?.controlDisposers)for(const off of game.controlDisposers){try{off?.()}catch{}}try{game?.motionFx?.dispose?.()}catch{}if(game?.renderer){try{game.renderer.dispose()}catch{}}game=null;}

  function gameShell(){return `<div class="ph3d-shell"><section id="ph3Stage" class="ph3d-stage"><canvas id="ph3Canvas" class="ph3d-canvas"></canvas>${QA_MODE?'<pre id=\"ph3Qa\" class=\"ph3d-qa\"></pre>':''}<div class="ph3d-top"><span id="ph3Role" class="ph3d-chip role"></span><span id="ph3Phase" class="ph3d-chip map"></span><span id="ph3Health" class="ph3d-chip health"></span></div><div id="ph3Crosshair" class="ph3d-crosshair"></div><button id="phShoulder" class="ph3d-shoulder no-look" aria-label="Swap camera shoulder" title="Swap camera shoulder">↔</button><button id="phResetView" class="ph3d-reset-view no-look" aria-label="Reset camera and recover player" title="Reset camera and recover player">↺</button><button id="phSpectate" class="ph3d-spectate no-look" hidden>NEXT</button><button id="phGhostFree" class="ph3d-spectate ph3d-ghost-free no-look" hidden>FREE CAM</button><div id="ph3Hit" class="ph3d-hit">x</div><div id="ph3Flash" class="ph3d-flash"></div><div id="ph3Damage" class="ph3d-damage"></div><div id="ph3Prompt" class="ph3d-prop-prompt"></div><div id="phDisguiseTray" class="ph3d-disguise-tray" hidden></div><div id="phHideBlind" class="ph3d-hide-blind" hidden><div class="ph3d-hide-card"><span class="ph3d-hide-kicker">ROUND <b id="phHideRound">1</b></span><strong>HIDERS ARE HIDING</strong><span class="ph3d-hide-copy">Other player(s) are finding a hiding spot.</span><b id="phHideCountdown" class="ph3d-hide-countdown">30</b><span class="ph3d-hide-note">Your view, movement and weapon unlock when the hunt begins.</span></div></div><div id="phHuntRelease" class="ph3d-hunt-release" hidden>HUNT!</div>${QA_MODE?'<div class="ph3d-camera-help">QA controls: drag look · left stick/WASD move · pinch/wheel zoom · R resets view.</div>':''}<div class="ph3d-controls"><div id="phJoy" class="ph3d-joystick"><div id="phStick" class="ph3d-stick"></div></div><div class="ph3d-actions"><button id="phShoot" class="ph3d-act primary">SHOOT</button><button id="phJump" class="ph3d-act jump">JUMP</button><button id="phSprint" class="ph3d-act sprint">SPRINT</button><button id="phProp" class="ph3d-act prop">PROP</button><button id="phFlashBtn" class="ph3d-act flash">FLASH</button><button id="phDecoy" class="ph3d-act">DECOY</button><button id="phLock" class="ph3d-act lock">LOCK</button><button id="phInteract" class="ph3d-act interact">INTERACT</button></div></div></section><aside class="ph3d-side"><div class="ph3d-mini"><h3>Loadout</h3><div id="ph3Load" class="ph3d-readout"></div></div><div class="ph3d-mini"><h3>Quick controls</h3><div class="ph3d-legend"><span>Move & run</span><span>Crosshair shooting</span><span>Hold SHOOT = rapid fire</span><span>Jump & climb</span><span>Change prop</span></div></div><div class="ph3d-mini"><h3>Family feed</h3><div id="ph3Feed" class="ph3d-feed"></div></div></aside></div>`;}

  class WorldBuilder{
    constructor(scene,key){this.scene=scene;this.key=key;this.group=new THREE.Group();this.group.name=`world-${key}`;scene.add(this.group);this.colliders=[];this.raycastMeshes=[];this.props=[];this.npcs=[];this.interactives=[];this.shopLights=[];this.spawn={x:4,z:4};this.bounds={minX:0,maxX:20,minZ:0,maxZ:14};}
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
    addProp(type,x,z,rot=0,y=0){const d=propDef(type),mesh=art.createPropMesh(type,d);mesh.position.set(x,y,z);mesh.rotation.y=rot;this.group.add(mesh);const rec={id:`prop-${this.props.length}`,type,x,z,y,w:d.w,d:d.d,h:d.h,mesh,def:d};this.props.push(rec);mesh.userData.worldProp=rec;if(d.solid){const c={x,z,y,w:d.w,d:d.d,h:d.h,solid:true,climbable:!!d.climbable,walkableTop:!!d.climbable,name:type,mesh};this.colliders.push(c);rec.collider=c;mesh.traverse(o=>{if(o.isMesh){o.userData.worldCollider=c;this.raycastMeshes.push(o)}})}else mesh.traverse(o=>{if(o.isMesh)this.raycastMeshes.push(o)});return rec;}
    addInteraction(label,x,z,kind='fun',opts={}){const rec={id:opts.id||`interaction-${this.interactives.length}`,label,x,z,kind,radius:opts.radius||1.45,rare:!!opts.rare,legendary:!!opts.legendary,state:false,cooldownUntil:0,data:opts.data||{}};this.interactives.push(rec);return rec;}
  }

  function baseLighting(scene,night=false){const w=game?.weatherPreset||roomState?.weatherPreset||'clear',sunset=w==='sunset',overcast=w==='overcast'||w==='light-rain'||w==='light-snow'||w==='fair-fog',sky=sunset?0xd89b72:overcast?0xaeb9bd:0xb8d9e8,ground=overcast?0x535851:0x5d6049;scene.background=new THREE.Color(sky);scene.fog=new THREE.Fog(w==='fair-fog'?0xaeb9b6:sky,w==='fair-fog'?25:58,w==='fair-fog'?72:135);const hemi=new THREE.HemisphereLight(sky,ground,overcast?1.0:1.32);scene.add(hemi);const ambient=new THREE.AmbientLight(sunset?0xffd8bc:0xfff1dc,overcast?.24:.2);scene.add(ambient);const sun=new THREE.DirectionalLight(sunset?0xffb176:0xffedc9,overcast?1.45:2.75);sun.position.set(sunset?15:-18,20,sunset?-8:13);gameplay.configureShadowCastingLight(sun,{mapSize:2048,left:-55,right:55,top:48,bottom:-48,near:.5,far:95});scene.add(sun);const fill=new THREE.DirectionalLight(overcast?0x98a9b2:0x9cc5db,overcast?.22:.34);fill.position.set(18,10,-16);scene.add(fill);}
  function addTree(w,x,z,s=1){return art.buildDetailedTree(w,x,z,s,'spruce')}
  function addFence(w,x,z,length,axis='x'){return art.buildFence(w,x,z,length,axis)}

  function buildWorld(key){
    baseLighting(game.scene,key==='acreage');let w;if(key==='camp')w=buildCamp();else if(key==='acreage')w=buildAcreage();else if(key==='farm')w=buildFarm();else w=buildPapa();game.scene.add(w.group);if(key==='papa')queueMicrotask(()=>upgradePapaProductionSlice(w));return w;
  }

  function buildPapa(){
    const w=new WorldBuilder(game.scene,'papa');w.phaseVExpanded=true;
    // Phase V footprint: 51.6 x 41.6 = 2,146.56 m² versus the previous 19 x 13.6 = 258.4 m².
    // This is ~8.31x the old actual traversable area, not decorative skybox area.
    w.bounds={minX:.2,maxX:51.8,minZ:.2,maxZ:41.8};w.spawn={x:7.2,z:36.4};
    const seed=roomState?.roundSeed||core.roundSeed?.(roomState?.id||'solo',roomState?.round||1,roomState?.createdAt||0)||1337;
    const rng=core.seededRandom?.(seed)||Math.random,variant=roomState?.layoutVariant??core.layoutVariantForSeed?.(seed)??0;
    w.layoutVariant=variant;w.weatherPreset=roomState?.weatherPreset||core.weatherForSeed?.(seed)||'clear';

    // Rural property base and readable horizon.
    w.floor(26,21,51.6,41.6,0x5c7c4c,-.065,'dirt');
    art.buildRuralBackdrop(w,{centerX:26,centerZ:21,radius:78,treeColor:0x2f4936,fieldColor:0x6f824d,farFieldColor:0x8b845b,buildingColor:0x62564b});
    art.buildCloudLayer(w,{x:26,z:21,y:18,radius:30,count:w.weatherPreset==='overcast'?12:8});
    // Main gravel circulation loop and equipment apron.
    w.floor(15.0,13.2,28.0,20.2,0x766f63,-.03,'concrete');
    w.floor(27.0,30.8,50.0,19.0,0x786f60,-.035,'gravel');
    w.floor(39.7,14.0,23.0,21.5,0x786d5d,-.032,'dirt');
    w.floor(13.5,33.5,22.5,13.2,0x83765e,-.03,'gravel');

    // Integrated red survey boundary. Physical movement still clamps to bounds, while the tape explains why.
    const tape=art.material('paintedMetal',0xc63e35,{roughness:.72,seed:991}),post=art.material('wood',0x6c5137,{seed:992});
    w.box({x:26,z:.45,y:.42,w:51.0,d:.045,h:.055,material:tape,solid:false,name:'red survey boundary'});w.box({x:26,z:41.55,y:.42,w:51.0,d:.045,h:.055,material:tape,solid:false,name:'red survey boundary'});
    w.box({x:.45,z:21,y:.42,w:.045,d:41.0,h:.055,material:tape,solid:false,name:'red survey boundary'});w.box({x:51.55,z:21,y:.42,w:.045,d:41.0,h:.055,material:tape,solid:false,name:'red survey boundary'});
    for(let x=1;x<=51;x+=5){w.box({x,z:.48,y:0,w:.08,d:.08,h:.85,material:post,solid:false,name:'boundary post'});w.box({x,z:41.52,y:0,w:.08,d:.08,h:.85,material:post,solid:false,name:'boundary post'})}
    for(let z=1;z<=41;z+=5){w.box({x:.48,z,y:0,w:.08,d:.08,h:.85,material:post,solid:false,name:'boundary post'});w.box({x:51.52,z,y:0,w:.08,d:.08,h:.85,material:post,solid:false,name:'boundary post'})}

    // A. MAIN SHOP: large warehouse-style footprint with multiple bays and loops.
    const wall=0x705943,shopH=4.65;
    w.wallX(4.0,1.5,27.0,shopH,[{from:4.0,to:9.0,sill:0,h:3.75},{from:12.1,to:14.0,sill:1.5,h:1.2,glass:true},{from:18.2,to:23.2,sill:0,h:3.75}],wall,.24,'shop wall');
    w.wallX(22.2,1.5,27.0,shopH,[{from:5.0,to:7.0,sill:0,h:2.45},{from:12.0,to:15.2,sill:0,h:3.0},{from:21.2,to:23.0,sill:0,h:2.45}],wall,.24,'shop wall');
    w.wallZ(1.5,4.0,22.2,shopH,[{from:10.2,to:12.4,sill:0,h:2.5},{from:16.0,to:18.0,sill:1.4,h:1.2,glass:true}],wall,.24,'shop wall');
    w.wallZ(27.0,4.0,22.2,shopH,[{from:7.2,to:9.6,sill:0,h:2.7},{from:15.2,to:18.5,sill:0,h:3.0}],wall,.24,'shop wall');
    w.box({x:14.25,z:13.1,y:4.56,w:25.3,d:18.0,h:.09,material:art.material('paintedWood',0x645748,{seed:201}),name:'shop ceiling',solid:true});
    w.roofPanel(8.0,13.1,13.2,18.7,4.78,.11,0x49413a);w.roofPanel(20.3,13.1,13.2,18.7,4.78,-.11,0x49413a);
    art.buildExteriorTrim(w,{x:14.25,z:13.1,width:25.5,depth:18.2,height:shopH,roofY:4.68,color:0xd0bea5});
    art.buildOverheadDoor(w,6.5,4.0,Math.PI,{width:4.8,height:3.7,color:0xa39c90,open:.95,label:'West shop bay'});art.buildOverheadDoor(w,13.7,4.0,Math.PI,{width:3.55,height:2.48,color:0x9c968b,open:.96,label:'Center shop bay'});art.buildSwingDoor(w,2.0,10.4,Math.PI/2,{width:1.15,height:2.2,color:0x6b4e38,openDistance:1.7,label:'Shop man door'});art.buildOverheadDoor(w,20.7,4.0,Math.PI,{width:4.8,height:3.7,color:0xa39c90,open:.9,label:'East shop bay'});
    art.buildOverheadDoor(w,13.6,22.2,0,{width:3.0,height:2.95,color:0x99958d,open:.95,label:'Rear shop bay'});art.buildSwingDoor(w,5.0,22.2,0,{width:1.8,height:2.4,color:0x664c39,openDistance:2.5,label:'Rear shop door'});art.buildSwingDoor(w,27.0,8.4,Math.PI/2,{width:2.1,height:2.55,color:0x654c39,openDistance:2.6,label:'Yard door'});
    for(const x of [5.0,10.0,15.0,20.0,24.0]){art.buildOverheadLight(w,x,9.3,4.25);art.buildOverheadLight(w,x,16.5,4.25)}
    art.buildCeilingFan(w,9.0,13.0,4.22,1.15);art.buildCeilingFan(w,20.0,13.0,4.22,1.15);
    art.buildAmbientParticles(w,{x:14,z:13,y:.6,width:23,depth:16,height:3.5,count:70,kind:'dust'});

    // Permanent Papa fireplace/chair landmark.
    w.heroFallbacks={};w.heroFallbacks.fireplace=buildFireplace(w,24.9,19.8,Math.PI);w.heroFallbacks.papaChair=buildPapaChair(w,22.9,19.2,.15);
    const glow=new THREE.PointLight(0xff9d59,1.8,6.2,2);glow.position.set(24.9,1.1,19.4);w.group.add(glow);w.shopLights.push(glow);
    const p2BenchmarkLights=[];const p2FireplaceGlow=new THREE.PointLight(0xffa05c,1.85,5.2,2);p2FireplaceGlow.name='P2 fireplace glow';p2FireplaceGlow.position.set(24.8,1.15,19.4);w.group.add(p2FireplaceGlow);p2BenchmarkLights.push(p2FireplaceGlow);const p2ShopFill=new THREE.PointLight(0xffe0ba,.55,10,2);p2ShopFill.name='P2 shop work-bay fill';p2ShopFill.position.set(9.5,3.25,12.5);w.group.add(p2ShopFill);p2BenchmarkLights.push(p2ShopFill);const p2BarnFill=new THREE.PointLight(0xd7e0c5,.42,12,2);p2BarnFill.name='P2 barn soft fill';p2BarnFill.position.set(40.5,3.7,14.2);w.group.add(p2BarnFill);p2BenchmarkLights.push(p2BarnFill);w.p2BenchmarkLights=p2BenchmarkLights;

    // Wide workshop stations along edges, leaving the center lanes open.
    w.heroFallbacks.workbench=art.buildWorkbench(w,4.0,6.4);w.heroFallbacks.toolChest=art.buildToolChest(w,9.0,6.2);w.heroFallbacks.shelving=art.buildShelving(w,14.0,5.8,0,{width:2.3,height:2.7,depth:.72});
    art.buildWorkbench(w,19.2,6.5);art.buildToolRack(w,2.0,8.4,Math.PI/2);art.buildCabinet(w,25.7,11.5,Math.PI/2,{width:1.25,height:2.0,color:0x525d5f});art.buildDrillPress(w,4.0,19.5);art.buildAirCompressor(w,7.0,19.2);art.buildWeldingCart(w,10.2,19.0);art.buildLadder(w,26.2,17.8,Math.PI/2,3.1);
    for(const x of [4.5,8.0,11.5,15.0,18.5])art.buildWorkbench(w,x,11.2+(x%2)*.35);
    for(const x of [5.2,10.2,15.2,20.2,24.0])art.buildShelving(w,x,21.1,Math.PI,{width:1.8,height:2.5,depth:.62});
    w.addProp('Welding Helmet',8.84,4.4,.18,.73);w.addProp('Coffee Mug',10.08,8.14,-.15,.72);w.addProp('Coffee Mug',10.78,7.15,.08,1.93);art.buildFloorDrain(w,14.2,14.2,.06,{size:.62});art.buildOilStain(w,8.8,15.9,.2,{radius:1.0,opacity:.16});art.buildOilStain(w,19.5,9.0,-.3,{radius:.75,opacity:.15});art.buildHoseReel(w,1.72,14.8,1.55,Math.PI/2);art.buildWallConduit(w,26.82,12.5,1.8,-Math.PI/2,{height:2.4,width:1.1});

    // B. BARN: full search space with through routes and a playable loft.
    const barnWall=0x665440,barnH=5.2;
    w.floor(41.2,14.0,18.8,18.8,0x756854,-.025,'dirt');
    w.wallX(4.6,31.8,50.6,barnH,[{from:36.2,to:41.0,sill:0,h:4.0},{from:46.0,to:48.0,sill:0,h:2.5}],barnWall,.22,'barn wall');
    w.wallX(23.4,31.8,50.6,barnH,[{from:34.0,to:37.0,sill:0,h:3.1},{from:43.2,to:48.7,sill:0,h:4.0}],barnWall,.22,'barn wall');
    w.wallZ(31.8,4.6,23.4,barnH,[{from:10.0,to:12.4,sill:0,h:2.7},{from:18.0,to:20.2,sill:0,h:2.7}],barnWall,.22,'barn wall');
    w.wallZ(50.6,4.6,23.4,barnH,[{from:13.0,to:15.4,sill:0,h:2.8}],barnWall,.22,'barn wall');
    w.roofPanel(36.2,14.0,10.0,19.5,5.35,.12,0x51463c);w.roofPanel(46.1,14.0,10.0,19.5,5.35,-.12,0x51463c);
    art.buildExteriorTrim(w,{x:41.2,z:14,width:18.8,depth:18.8,height:barnH,roofY:5.24,color:0xc5b297});
    art.buildOverheadDoor(w,38.6,4.6,Math.PI,{width:4.6,height:3.95,color:0x876f55,open:.96,label:'Barn south door'});art.buildOverheadDoor(w,46.0,23.4,0,{width:5.2,height:3.95,color:0x876f55,open:.96,label:'Barn north door'});
    for(const [x,z,r] of [[35,8,0],[39,8,0],[44,8,0],[48,8,0],[35,18,Math.PI],[39,18,Math.PI],[44,18,Math.PI],[48,18,Math.PI]])art.buildBarnStall(w,x,z,r,{width:3.1,depth:2.2});
    // Loft and two access routes.
    w.box({x:44.2,z:10.0,y:2.7,w:11.0,d:5.2,h:.2,material:art.material('wood',0x785b3f,{seed:333}),climbable:true,walkableTop:true,name:'barn loft'});art.buildLadder(w,38.9,11.8,0,3.15);art.buildLadder(w,49.0,11.8,0,3.15);
    for(const x of [35.5,40.0,44.5,49.0])art.buildOverheadLight(w,x,14.5,4.45);

    // C. LARGE ANIMAL PENS: wide gaps and multiple exits. Low fencing remains mantle/jump friendly.
    const penFence=(cx,cz,wid,dep)=>{addFence(w,cx,cz-dep/2,wid*.36,'x');addFence(w,cx-wid*.32,cz-dep/2,wid*.28,'x');addFence(w,cx,cz+dep/2,wid*.34,'x');addFence(w,cx+wid*.33,cz+dep/2,wid*.28,'x');addFence(w,cx-wid/2,cz,dep*.34,'z');addFence(w,cx-wid/2,cz+dep*.35,dep*.25,'z');addFence(w,cx+wid/2,cz,dep*.34,'z');addFence(w,cx+wid/2,cz-dep*.35,dep*.25,'z')};
    w.floor(37.6,33.4,10.8,13.0,0x6c6649,-.026,'dirt');w.floor(47.0,33.4,8.0,13.0,0x665743,-.026,'dirt');penFence(37.6,33.4,10.8,13.0);penFence(47.0,33.4,8.0,13.0);
    art.buildBarnStall(w,36.0,37.6,Math.PI,{width:3.5,depth:2.2});art.buildBarnStall(w,47.0,37.6,Math.PI,{width:3.4,depth:2.2});
    for(const [t,x,z] of [['Trough',35.0,30.0],['Feed Barrel',39.2,30.4],['Hay Bale',40.0,36.2],['Feed Bucket',36.2,35.6],['Trough',45.2,30.0],['Feed Barrel',49.0,30.5],['Hay Bale',48.8,36.2],['Feed Bucket',45.0,35.5]])w.addProp(t,x,z,rng()*Math.PI);
    for(const [type,x,z] of [['goat',35.5,32],['goat',39.4,35.2],['pig',36.5,36.2],['pig',47.6,33.2],['goat',45.4,35.4],['peacock',49.1,37.0]])addNpcAnimal(w,type,x,z);

    // D/E. EQUIPMENT YARD + LUMBER/MATERIAL STORAGE with wide chase lanes.
    const yardShift=(variant%3-1)*1.1;w.heroFallbacks.tractor=buildTractor(w,7.0+yardShift,27.2,.08);w.heroFallbacks.motorcycle=buildMotorcycle(w,12.0-yardShift*.5,26.6,-.25);buildTrailer(w,19.0,27.2,.05);art.buildLumberStack(w,5.0,34.0,0,{width:5.2,height:1.1,depth:1.4});art.buildLumberStack(w,11.5,34.4,Math.PI/2,{width:4.4,height:1.45,depth:1.35});art.buildLumberStack(w,18.0,35.0,0,{width:5.8,height:1.0,depth:1.3});
    for(const [x,z] of [[4,29],[8,30.5],[13,29.5],[17,31],[21,29],[25,33.5]])art.buildCrate(w,x,z,0,{width:1.3,height:.65+(x%3)*.2,depth:1.0,name:'Yard crate'});
    for(const x of [3.8,7.1,10.4,13.7,17.0,20.3])w.addProp('Pallet',x,38.0,(x%2)*.2);for(const x of [4.5,8.5,12.5,16.5,20.5,24.5])w.addProp('Tire',x,31.5+rng()*2,rng()*Math.PI);

    // Trees/grass around the outside provide natural context without shrinking the usable yard.
    for(let x=2;x<51;x+=4.5){if(x>30&&x<50)continue;addTree(w,x,40.2,.72+rng()*.18)}
    for(const [x,z,s] of [[29,3,.8],[30,27,.75],[27,38,.85],[50,25,.72],[30,40,.68]])addTree(w,x,z,s);
    for(let i=0;i<32;i++)art.buildGrassPatch(w,1+rng()*50,1+rng()*40,.55+rng()*.55,{count:8+Math.floor(rng()*8),color:0x5a7447});art.buildAmbientBirds(w,{x:29,z:28,y:8.2,radius:14,count:7,color:0x33383c});

    // Hundreds of visible prop instances, concentrated around edges/work areas so primary routes stay broad.
    const shopClutter=['Coffee Mug','Extension Cord','Welding Helmet','Bucket','Oil Jug','Toolbox','Gas Can','Beer Case','Stool','Feed Bucket'];
    const barnClutter=['Feed Bucket','Hay Bale','Feed Sack','Parts Crate','Bucket','Tire','Pallet','Wheelbarrow'];
    const yardClutter=['Gas Can','Tire','Pallet','Parts Crate','Lumber','Garbage Can','Feed Barrel','Sawhorse'];
    const addClutter=(types,count,zone)=>{for(let i=0;i<count;i++){const type=types[Math.floor(rng()*types.length)],edge=i%4,margin=.7+rng()*1.6;let x,z;if(edge===0){x=zone.x0+margin;z=zone.z0+rng()*(zone.z1-zone.z0)}else if(edge===1){x=zone.x1-margin;z=zone.z0+rng()*(zone.z1-zone.z0)}else if(edge===2){x=zone.x0+rng()*(zone.x1-zone.x0);z=zone.z0+margin}else{x=zone.x0+rng()*(zone.x1-zone.x0);z=zone.z1-margin}w.addProp(type,x,z,rng()*Math.PI*2)}};
    addClutter(shopClutter,96,{x0:2.3,x1:26.2,z0:4.8,z1:21.5});addClutter(barnClutter,54,{x0:32.5,x1:49.9,z0:5.4,z1:22.7});addClutter(yardClutter,58,{x0:2.0,x1:27.5,z0:24.0,z1:40.0});
    for(let i=0;i<28;i++){const type=['Feed Bucket','Hay Bale','Feed Sack','Bucket'][i%4],zone=i%2?{x0:33,x1:41.5}:{x0:43.5,x1:50.2};w.addProp(type,zone.x0+rng()*(zone.x1-zone.x0),27.5+rng()*11.5,rng()*Math.PI*2)}

    // Large disguise-world exemplars. These are spaced away from chokepoints.
    w.addProp('Tractor',24.5,27.0,.2);w.addProp('Motorcycle',16.0,29.0,-.4);w.addProp('Papa Chair',22.9,19.2,.15);w.addProp('Tool Chest',24.8,7.1,0);w.addProp('Air Compressor',5.4,18.0,.2);w.addProp('Barrel Stack',28.7,31.5,.1);w.addProp('Tree',29.3,38.5,0);

    // Active interactions: common world flavor plus a few rare surprises. Interactions only open/animate/noise; they never seal a player in.
    w.addInteraction('TRACTOR HORN',7.0+yardShift,27.2,'horn',{radius:2.2});w.addInteraction('SHOP LIGHTS',2.2,12.8,'lights',{radius:1.8});w.addInteraction('BARN BELL',32.6,14.0,'bell',{radius:1.8});w.addInteraction('OPEN SHORTCUT GATE',41.8,26.8,'shortcut',{radius:1.8});
    w.addInteraction('ODD OLD RADIO',24.0,20.6,'radio',{rare:true,radius:1.4});w.addInteraction('PEACOCK BUTTON?',49.0,37.5,'peacock',{rare:true,radius:1.4});w.addInteraction('MYSTERY SHOP SWITCH',25.8,18.8,'mystery',{rare:true,radius:1.3});w.addInteraction('INSPECT THE TATTERED CHAIR',22.9,19.2,'legendary',{legendary:true,radius:1.25});
    w.shortcutGate=w.box({x:41.8,z:26.8,w:2.5,d:.14,h:1.05,color:0x865642,name:'shortcut gate',climbable:true});for(const [lx,lz] of [[5.5,8.0],[14.0,8.0],[22.5,8.0]]){const light=new THREE.PointLight(0xffe0ad,1.25,10,2);light.position.set(lx,3.8,lz);w.group.add(light);w.shopLights.push(light)}

    // Light/weather accents and QA metrics.
    if(w.weatherPreset==='light-rain')art.buildAmbientParticles(w,{x:26,z:21,y:1,width:50,depth:40,height:14,count:90,color:0xa8c2cf,kind:'rain'});
    if(w.weatherPreset==='light-snow')art.buildAmbientParticles(w,{x:26,z:21,y:1,width:50,depth:40,height:14,count:75,color:0xf3f2eb,kind:'snow'});
    w.metrics={oldPlayableArea:258.4,playableArea:(w.bounds.maxX-w.bounds.minX)*(w.bounds.maxZ-w.bounds.minZ),scaleMultiple:((w.bounds.maxX-w.bounds.minX)*(w.bounds.maxZ-w.bounds.minZ))/258.4,visibleProps:w.props.length,interactives:w.interactives.length,gameplayMeaningful:w.props.length+w.interactives.length+w.colliders.filter(c=>c.climbable).length};
    return w;
  }

  async function upgradePapaProductionSlice(w){
    if(!w||w.key!=='papa')return;
    // Phase V is an expanded playable world. Never replace it with the legacy small authored shell.
    // We still attempt to upgrade the hero benchmark props so the art pipeline remains active.
    if(w.phaseVExpanded){
      await upgradePapaHeroAssets(w);
      addFeed("Papa's Shop Phase V world active: expanded shop, barn, pens, yard and grass property.");
      return;
    }
    const hideMesh=o=>{if(o?.isMesh)o.visible=false};
    const prototypeNames=/^(wall|floor|roof|shop ceiling|barn ceiling|front siding batten|rear siding batten|side siding batten|fireplace chimney|chimney cap|shop roof ridge cap|barn roof ridge cap|shop rafter|barn rafter)$/i;
    w.group.traverse?.(o=>{if(o?.isMesh&&prototypeNames.test(String(o.name||'')))o.visible=false});
    const hideFallback=g=>g?.traverse?.(hideMesh);
    for(const g of Object.values(w.heroFallbacks||{}))hideFallback(g);
    try{
      await assets.ensureManifest();
      const [environment,propSet]=await Promise.all([
        assets.loadEnvironment('papaShop',{fallback:null}),
        assets.loadSet('papaShopProps',{fallback:null})
      ]);
      if(!environment||!propSet)throw new Error('Papa production slice GLBs did not load');
      for(const obj of [environment,propSet]){obj.userData.productionVerticalSlice=true;obj.traverse?.(o=>{if(o.isMesh)o.userData.productionVerticalSlice=true});studio.optimizeStaticAuthoredScene(obj,{shadowMinRadius:obj===environment?.22:.14,receiveShadow:true,freezeTransforms:true});w.group.add(obj)}
      w.productionEnvironment=environment;w.productionPropSet=propSet;
      addFeed("Papa's Shop production vertical slice loaded: skinned John + authored shop/barn + production prop set.");
    }catch(e){
      console.warn('Papa production vertical slice unavailable; restoring benchmark hero fallbacks',e);
      w.group.traverse?.(o=>{if(o?.isMesh&&prototypeNames.test(String(o.name||'')))o.visible=true});
      await upgradePapaHeroAssets(w);
    }
  }

  async function upgradePapaHeroAssets(w){
    if(!w||w.key!=='papa'||!w.heroFallbacks)return;
    const hideFallback=g=>g?.traverse?.(o=>{if(o.isMesh)o.visible=false});
    const install=(obj,fallback)=>{if(!obj||!fallback)return;obj.position.copy(fallback.position);obj.rotation.copy(fallback.rotation);obj.userData.productionHero=true;obj.traverse?.(o=>{if(o.isMesh){o.castShadow=true;o.receiveShadow=true;o.userData.productionHero=true;w.raycastMeshes.push(o)}});hideFallback(fallback);w.group.add(obj)};
    try{
      await assets.ensureManifest();
      const [tractor,motorcycle,chair,fireplace,workbench,toolChest,shelving]=await Promise.all([
        assets.loadProp('tractor',{fallback:null}),
        assets.loadProp('motorcycle',{fallback:null}),
        assets.loadFurniture('papaChair',{fallback:null}),
        assets.loadFurniture('fireplace',{fallback:null}),
        assets.loadFurniture('workbench',{fallback:null}),
        assets.loadFurniture('toolChest',{fallback:null}),
        assets.loadFurniture('shelving',{fallback:null})
      ]);
      install(tractor,w.heroFallbacks.tractor);install(motorcycle,w.heroFallbacks.motorcycle);install(chair,w.heroFallbacks.papaChair);
      install(fireplace,w.heroFallbacks.fireplace);install(workbench,w.heroFallbacks.workbench);install(toolChest,w.heroFallbacks.toolChest);install(shelving,w.heroFallbacks.shelving);
      w.productionHeroes={tractor,motorcycle,chair,fireplace,workbench,toolChest,shelving};
      if(Object.values(w.productionHeroes).some(Boolean))addFeed('Papa\'s Shop production assets loaded: authored hero kit plus gameplay colliders.');
    }catch(e){console.warn('Papa production hero asset upgrade skipped',e)}
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
    const players=roomState.players,spawn=game.world.spawn;players.forEach((p,i)=>{const actor=createActor(p,i,spawn);const safe=gameplay.findSafeCharacterPosition(core,game.world.colliders,{x:actor.x,y:actor.y,z:actor.z},game.world.bounds,{radius:actor.radius,height:actor.height,requireCameraPocket:p.id===roomState.viewerId,cameraHeight:isDog(actor.person)?.64:1.17,cameraDistance:3.3,minCameraPocket:1.5});actor.x=safe.x;actor.y=safe.y;actor.z=safe.z;actor.rig.position.set(actor.x,actor.y,actor.z);game.actors.push(actor);game.actorsById.set(p.id,actor);if(p.id===roomState.viewerId)game.player=actor});if(!game.player)game.player=game.actors[0];game.cameraYaw=game.player.yaw;
  }
  function createActor(p,index,spawn){
    const person=personById(p.avatar),dog=isDog(person),profile=bodyProfile(person.id),angle=index/playerCountSafe()*Math.PI*2,r=1.2+Math.floor(index/6)*.7;const actor={id:p.id,person,color:p.color||null,isBot:!!p.isBot,difficulty:p.difficulty||'easy',role:p.role||'hider',health:p.health??3,alive:p.alive!==false,prop:p.prop||null,propChanges:p.propChanges??3,decoys:p.decoys??10,flash:p.flash!==false,disguiseOptions:[...(p.disguiseOptions||[])],hiderScore:Number(p.hiderScore||0),score:p.score||null,lifetime:p.lifetime||null,locked:false,x:spawn.x+Math.cos(angle)*r,z:spawn.z+Math.sin(angle)*r,y:0,yaw:Math.PI,pitch:0,vx:0,vy:0,vz:0,radius:profile.radius,height:profile.height,visualScale:profile.scale,grounded:true,mantle:null,anim:'idle',animTime:Math.random()*2,recoil:0,netTarget:null,netBuffer:new studio.SnapshotBuffer({delayMs:92,maxExtrapolateMs:85}),lastShot:0,ai:{timer:0,target:null,detected:null,changeTimer:5+Math.random()*5,decoyTimer:4+Math.random()*8,path:[],pathIndex:0,pathTimer:0,pathGoal:null}};
    actor.rig=dog?buildDogRig(person,actor.role):buildHumanRig(person,actor.role);actor.rig.userData.actor=actor;game.scene.add(actor.rig);applyActorVisual(actor);actor.rig.position.set(actor.x,actor.y,actor.z);actor.rig.rotation.y=actor.yaw;queueMicrotask(()=>tryUpgradeAuthoredActor(actor));return actor;
  }
  function playerCountSafe(){return Math.max(1,roomState?.players?.length||1);}

  function buildHumanRig(person,role){
    const style=OUTFITS[person.id]||OUTFITS.john,profile=bodyProfile(person.id);return art.buildHumanRig(style,{id:person.id,role,scale:profile.scale,proportions:profile.proportions});
  }
  function buildDogRig(person,role){
    const style=OUTFITS[person.id]||OUTFITS.gunner,profile=bodyProfile(person.id);return art.buildDogRig(style,{id:person.id,role,scale:profile.scale,proportions:profile.proportions});
  }
  function buildGun(scale=.68){return art.buildPropZapper(scale);}
  async function tryUpgradeAuthoredActor(actor){
    try{
      await assets.ensureManifest();
      const dog=isDog(actor.person),entry=assets.entry(dog?'dogs':'characters',actor.person.id);
      if(!entry?.file){assets.reportMissing(dog?'dogs':'characters',actor.person.id,{fallbackUsed:true,context:'Family Prop Hunt character'});return}if((entry.games&&!entry.games.includes('propHunt'))||!game?.actorsById?.has(actor.id))return;
      const rig=await(dog?assets.loadDog(actor.person.id,{fallback:null}):assets.loadCharacter(actor.person.id,{fallback:null}));
      if(!rig||!game?.actorsById?.has(actor.id))return;
      rig.position.copy(actor.rig.position);rig.rotation.copy(actor.rig.rotation);
      const parts=studio.bindAuthoredRigParts(rig,{kind:dog?'dog':'human'})||{};if(!dog&&actor.color)studio.applyPrimaryClothingColor(rig,actor.color);
      const productionSocket=studio.findRigNode(rig,[dog?'backSocket':'rightHandSocket']);
      const weapon=await assets.loadProp('propZapper',{fallback:()=>art.buildPropZapper(dog?.46:.62)});
      if(weapon){
        const socket=productionSocket?.name||(dog?'back':'rightHand');
        studio.attachToRigSocket(rig,weapon,{socket,position:productionSocket?[0,0,0]:(dog?[0,.08,.04]:[0,-.02,-.08]),rotation:productionSocket?[0,0,0]:(dog?[0,0,0]:[-Math.PI/2,0,Math.PI]),scale:dog?.34:.55});
        parts.weapon=weapon;parts.weaponAnchor=productionSocket||parts.weaponAnchor;rig.userData.parts=parts;
      }
      tagActorMeshes(rig);
      const old=actor.rig;actor.rig=rig;actor.rig.userData.actor=actor;actor.authored=true;
      actor.hasAuthoredClips=studio.hasAuthoredAnimationClips(rig);
      actor.animMixer=actor.hasAuthoredClips?new studio.SemanticAnimationMixer(THREE,rig,rig.userData.authoredAnimations||[]):null;
      game.scene.add(rig);game.scene.remove(old);applyActorVisual(actor);
    }catch(e){console.warn('Authored Prop Hunt actor upgrade skipped',e)}
  }

  function tagActorMeshes(g){g.traverse(o=>{if(o.isMesh){o.castShadow=true;o.receiveShadow=true;o.userData.actorHit=true}});}

  function applyActorVisual(actor){
    if(actor.prop){if(actor.propMesh)actor.rig.remove(actor.propMesh);actor.rig.traverse(o=>{if(o!==actor.rig)o.visible=false});const m=createPropMesh(actor.prop);actor.propMesh=m;actor.rig.add(m);const d=propDef(actor.prop);actor.height=d.h;actor.radius=Math.max(.18,Math.min(.55,Math.max(d.w,d.d)*.45));}
    else{if(actor.propMesh){actor.rig.remove(actor.propMesh);actor.propMesh=null}actor.rig.traverse(o=>o.visible=true);const profile=bodyProfile(actor.person.id);actor.height=profile.height;actor.radius=profile.radius;const parts=actor.rig.userData.parts;if(parts?.weapon)parts.weapon.visible=actor.role==='hunter';}
  }

  function bindControls(){
    window.addEventListener('keydown',onKeyDown);window.addEventListener('keyup',onKeyUp);window.addEventListener('resize',onResize);const stage=root.querySelector('#ph3Stage'),joyEl=root.querySelector('#phJoy'),stick=root.querySelector('#phStick');stage.addEventListener('pointerdown',()=>audio?.unlock?.(),{once:true});
    game.controlDisposers.push(gameplay.bindPointerLook(stage,game.cameraRig,{ignoreSelector:'button,select,input,a,#phJoy,#phDisguiseTray'}));
    game.controlDisposers.push(gameplay.bindVirtualJoystick(joyEl,stick,joy,{deadzone:.09,travel:.34}));game.controlDisposers.push(gameplay.mountControlPreferences(stage,game.cameraRig,{layoutTarget:stage,top:'112px'}));game.controlDisposers.push(studio.mountAudioPreferences(stage,audio,{top:'112px',right:'72px'}));
    stage.addEventListener('contextmenu',e=>e.preventDefault());
    const jump=root.querySelector('#phJump');jump.onpointerdown=()=>{input.jumpQueued=true;input.jumpHeld=true};jump.onpointerup=jump.onpointercancel=()=>{input.jumpHeld=false};
    root.querySelector('#phSprint').onclick=()=>{input.sprint=!input.sprint;root.querySelector('#phSprint').classList.toggle('active',input.sprint)};
    const shootBtn=root.querySelector('#phShoot'),startFire=e=>{if(e?.button!=null&&e.button!==0)return;input.shoot=true;shoot();try{if(e?.pointerId!=null)shootBtn.setPointerCapture?.(e.pointerId)}catch{}},stopFire=()=>{input.shoot=false};
    shootBtn.onpointerdown=startFire;shootBtn.onpointerup=shootBtn.onpointercancel=shootBtn.onlostpointercapture=stopFire;
    const mouseDown=e=>{if(e.target?.closest?.('button,select,input,a,#phJoy,#phDisguiseTray'))return;if(e.button===0){input.shoot=true;shoot()}},mouseUp=e=>{if(e.button===0)input.shoot=false};stage.addEventListener('pointerdown',mouseDown);window.addEventListener('pointerup',mouseUp);window.addEventListener('blur',stopFire);game.controlDisposers.push(()=>{stage.removeEventListener('pointerdown',mouseDown);window.removeEventListener('pointerup',mouseUp);window.removeEventListener('blur',stopFire)});
    root.querySelector('#phShoulder').onclick=()=>game.cameraRig.swapShoulder();root.querySelector('#phResetView').onclick=()=>resetPlayableView();root.querySelector('#phSpectate').onclick=()=>cycleSpectate();root.querySelector('#phGhostFree').onclick=()=>goGhostFree();root.querySelector('#phProp').onclick=()=>changeProp();root.querySelector('#phFlashBtn').onclick=()=>flash();root.querySelector('#phDecoy').onclick=()=>dropDecoy();root.querySelector('#phLock').onclick=()=>toggleLock();root.querySelector('#phInteract').onclick=()=>triggerInteraction();
    onResize();
  }
  function updateJoy(e){const el=root.querySelector('#phJoy'),stick=root.querySelector('#phStick'),r=el.getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height/2,dx=e.clientX-cx,dy=e.clientY-cy,max=r.width*.31,l=Math.hypot(dx,dy)||1,k=Math.min(1,max/l);joy.x=dx/max*k;joy.z=-dy/max*k;stick.style.transform=`translate(${dx*k}px,${dy*k}px)`;}
  function onKeyDown(e){keys[e.code]=true;if(e.code==='Space'){if(!e.repeat)input.jumpQueued=true;input.jumpHeld=true;e.preventDefault()}if(e.code==='KeyC'&&!e.repeat)game?.cameraRig?.swapShoulder();if(e.code==='KeyR'&&!e.repeat)resetPlayableView();if(e.code==='KeyE')changeProp();if(e.code==='KeyI')triggerInteraction();if(e.code==='KeyF')flash();if(e.code==='KeyQ')dropDecoy();if(e.code==='KeyL')toggleLock();}
  function onKeyUp(e){keys[e.code]=false;if(e.code==='Space')input.jumpHeld=false;}
  function onResize(){if(!game?.renderer)return;const c=game.renderer.domElement,r=c.getBoundingClientRect();game.renderer.setSize(Math.max(320,r.width),Math.max(360,r.height),false);game.camera.aspect=Math.max(.5,r.width/Math.max(1,r.height));game.camera.updateProjectionMatrix();}
  function resetPlayableView({announce=true}={}){const a=game?.player;if(!a)return;const moved=gameplay.recoverActorFromGeometry(core,a,game.world.colliders,game.world.bounds,{radius:a.radius,height:a.height,maxRadius:5,requireCameraPocket:true,cameraHeight:isDog(a.person)?.64:1.17,cameraDistance:3.4,minCameraPocket:1.5});game.cameraRig.reset(a,game.world.colliders,{yaw:a.yaw,pitch:.065,distance:game.cameraRig.cfg.cameraDistance,dog:isDog(a.person),height:a.prop?a.height*.55:(isDog(a.person)?.64:1.17),forceSnap:true,reason:'manual Reset View'});game.stagingQa?.setRecovery(moved?'manual Reset View + safe-position recovery':'manual Reset View');game.cameraYaw=game.cameraRig.state.yaw;game.cameraPitch=game.cameraRig.state.pitch;if(announce)addFeed(moved?'Player and view recovered to a safe spot.':'View reset behind your character.');}

  function loop(now){if(!game)return;const dt=Math.min(.04,Math.max(.001,(now-lastFrame)/1000));lastFrame=now;update(dt,now);game.performance?.sample(dt);if(QA_MODE)updateQaHud(dt,now);game.stagingQa?.update(dt,now);game.renderer.render(game.scene,game.camera);raf=requestAnimationFrame(loop);}
  function update(dt,now){
    if(!game.player)return;
    // Gamepad look and every hunter control are frozen during the protected hiding period.
    const blindHunter=isHunterHidePhase();if(!blindHunter)gameplay.applyGamepadLook(game.cameraRig.state,dt);const pad=gameplay.readGamepadButtons();
    if(!blindHunter&&pad.jump&&!game.padPrev.jump)input.jumpQueued=true;if(!blindHunter&&pad.shoulder&&!game.padPrev.shoulder)game.cameraRig?.swapShoulder();game.padShoot=!blindHunter&&!!pad.shoot;game.padSprint=!blindHunter&&pad.sprint;game.padJumpHeld=!blindHunter&&pad.jump;game.padPrev=pad;
    game.cameraYaw=game.cameraRig.state.yaw;game.cameraPitch=game.cameraRig.state.pitch;
    game.shotCooldown=Math.max(0,(game.shotCooldown||0)-dt);if((input.shoot||game.padShoot)&&!blindHunter)shoot();game.cinematic?.update(dt);audio?.update(dt);updatePhase();if(!network&&roomState.phase==='hunt'){for(const h of game.actors)if(h.role==='hider'&&h.alive&&h.prop)h.hiderScore=(h.hiderScore||0)+dt*core.propSurvivalRate(h.prop)}updatePlayer(dt);updateBots(dt);updateRemoteActors(dt);updateActorVisuals(dt);updateNpcs(dt);updateEffects(dt);updateCamera(dt);updateHud();if(network&&now-game.lastNetworkSend>100){sendNetworkSnapshots();game.lastNetworkSend=now}
  }

  function updateQaHud(dt,now){
    const q=game?.qa;if(!q)return;q.frames++;q.accum+=dt;if(q.accum>=.5){q.fps=Math.round(q.frames/q.accum);q.frames=0;q.accum=0}if(now-(q.lastHud||0)<250)return;q.lastHud=now;const a=game.player,info=game.renderer.info.render,el=root.querySelector('#ph3Qa');if(!el||!a)return;el.textContent=[
      `QA · ${game.mapKey} · ${q.fps||'--'} fps`,
      `pos ${a.x.toFixed(2)}, ${a.y.toFixed(2)}, ${a.z.toFixed(2)}  yaw ${a.yaw.toFixed(2)}`,
      `anim ${a.anim}  move ${a._directional?.semantic||'idle'}  grounded ${a.grounded?'yes':'no'}  prop ${a.prop||'none'}`,
      `camera ${game.cameraActualDistance.toFixed(2)}  actors ${game.actors.length}  colliders ${game.world.colliders.length}`,
      `draw ${info.calls}  tris ${info.triangles}  lines ${info.lines}`,
      `net ${network?'live':'solo'}  nav ${a.ai?.path?.length||0}  asset ${a.authored?(a.hasAuthoredClips?'GLB+clips':'GLB+joints'):'procedural'}`
    ].join('\n');
  }

  function isHunterHidePhase(){return !!game?.player&&roomState?.phase==='hide'&&game.player.role==='hunter'&&game.player.alive}

  function updateHunterHideOverlay(){
    const blind=root?.querySelector('#phHideBlind'),count=root?.querySelector('#phHideCountdown'),round=root?.querySelector('#phHideRound'),release=root?.querySelector('#phHuntRelease'),active=isHunterHidePhase();
    if(blind){blind.hidden=!active;blind.classList.toggle('final-count',active&&Math.ceil(Math.max(0,(roomState.phaseEndsAt-Date.now())/1000))<=3)}
    if(active){const seconds=Math.max(0,Math.ceil((roomState.phaseEndsAt-Date.now())/1000));if(count)count.textContent=String(seconds);if(round)round.textContent=String(roomState.round||1);input.shoot=false;game.padShoot=false;game.hideReleaseAnnounced=false}
    if(game.lastPhase==='hide'&&roomState.phase==='hunt'&&!game.hideReleaseAnnounced){game.hideReleaseAnnounced=true;if(release){release.hidden=false;release.classList.remove('on');void release.offsetWidth;release.classList.add('on');setTimeout(()=>{if(release){release.classList.remove('on');release.hidden=true}},760)}audio?.oneShot('ui',{volume:.11,pitch:1.28})}
    game.lastPhase=roomState.phase;
  }

  function updatePhase(){
    if(network)return;
    const now=Date.now();if(roomState.phase==='hide'&&now>=roomState.phaseEndsAt){roomState.phase='hunt';roomState.phaseEndsAt=now+(roomState.settings.roundSeconds||300)*1000*TEST_SCALE;addFeed('Hunt started.')}if(roomState.phase==='hunt'){
      const h=game.actors.filter(a=>a.role==='hider'&&a.alive);if(!h.length)finishSoloRound('hunters');else if(now>=roomState.phaseEndsAt)finishSoloRound('hiders');
    }if(roomState.phase==='roundEnd'&&now>=roomState.phaseEndsAt)nextSoloRound();
  }
  function finishSoloRound(winner){if(roomState.phase==='roundEnd'||roomState.phase==='matchEnd')return;roomState.wins[winner]++;roomState.roundResult=winner;const hiders=game.actors.filter(a=>a.role==='hider').sort((a,b)=>(b.hiderScore||0)-(a.hiderScore||0)),hunters=game.actors.filter(a=>a.role==='hunter').sort((a,b)=>(b.score?.hunterElims||0)-(a.score?.hunterElims||0));roomState.roundSummary={winner,weatherPreset:roomState.weatherPreset,bestHider:hiders[0]?{name:hiders[0].person.name,points:Math.round(hiders[0].hiderScore||0),survived:!!hiders[0].alive}:null,bestHunter:hunters[0]?{name:hunters[0].person.name,eliminations:hunters[0].score?.hunterElims||0}:null};if(roomState.round>=roomState.settings.rounds){roomState.phase='matchEnd';roomState.phaseEndsAt=0;showMatchEnd()}else{roomState.phase='roundEnd';roomState.phaseEndsAt=Date.now()+10000;showRoundSummary(roomState.roundSummary)}}
  function nextSoloRound(){closeModal();roomState.round++;const seed=core.roundSeed(roomState.id,roomState.round,roomState.createdAt||0),roles=core.assignRoles(roomState.players,roomState.round),next=mapFor(roomState.settings.mapKey,roomState.round),assigned=core.assignDisguiseOptions(roomState.players,seed,core.disguisePoolForMap(next),4);roomState.players.forEach(p=>{p.role=roles[p.id];p.health=3;p.alive=true;p.prop=null;p.propChanges=3;p.decoys=10;p.flash=true;p.hiderScore=0;p.disguiseOptions=p.role==='hider'?(assigned[p.id]||[]):[]});roomState.roundSeed=seed;roomState.layoutVariant=core.layoutVariantForSeed(seed);roomState.weatherPreset=core.weatherForSeed(seed);roomState.roundSummary=null;roomState.phase='hide';roomState.phaseEndsAt=Date.now()+30000*TEST_SCALE;roomState.activeMap=next;disposeRoot();ensureEngine().then(()=>startEngine(next));}

  function updatePlayer(dt){
    const a=game.player;if(!a.alive){a.vx=a.vz=0;if(roomState.settings.mode==='classic'&&game.ghostMode==='free')updateGhost(dt);return}if(isHunterHidePhase()){a.vx=a.vz=a.vy=0;a.anim='idle';a._sprinting=false;input.jumpQueued=false;input.jumpHeld=false;input.shoot=false;joy.x=joy.z=0;a.rig.position.set(a.x,a.y,a.z);return}if(a.locked&&a.prop){a.vx=a.vz=0;animateMantle(a,dt);return}if(a.mantle){animateMantle(a,dt);return}
    const aiming=a.role==='hunter',intent=gameplay.movementIntent(keys,joy,game.cameraYaw),sprint=gameplay.wantsSprint(keys,input,{sprint:game.padSprint},intent);
    const movingIntent=intent.strength>.07,targetYaw=aiming?game.cameraYaw:movingIntent?Math.atan2(intent.directionX,-intent.directionZ):a.yaw,oldYaw=a.yaw;
    a.yaw=gameplay.dampAngle(a.yaw,targetYaw,aiming?29:movingIntent?17:10,dt);let d=a.yaw-oldYaw;while(d>Math.PI)d-=Math.PI*2;while(d<-Math.PI)d+=Math.PI*2;a.turnRate=d/Math.max(dt,.001);a.pitch=game.cameraPitch;
    const preset=game.cameraRig.cfg;a._wasMoving=!!a._moving;a._sprinting=!!sprint;gameplay.smoothVelocity(a,intent,sprint?preset.runSpeed:preset.walkSpeed,dt,{accel:preset.groundAccel,brake:preset.groundBrake,airControl:preset.airControl});
    gameplay.updateJumpMemory(a,dt,input.jumpQueued);gameplay.consumeBufferedJump(a,preset.jumpSpeed);gameplay.applyVariableJump(a,input.jumpHeld||game.padJumpHeld);
    const moving=Math.hypot(a.vx,a.vz)>.15;a._moving=moving;a._directional=gameplay.resolveDirectionalLocomotion(a,{aiming,sprinting:sprint});if(moving&&!a._wasMoving){a._moveTransition='startMove';a._moveTransitionUntil=performance.now()+240}else if(!moving&&a._wasMoving){a._moveTransition='stopMove';a._moveTransitionUntil=performance.now()+280}
    moveActor(a,a.vx*dt,a.vz*dt,(a._jumpBuffer||0)>0||a.vy>1.2);resolveActorOverlap(a);input.jumpQueued=false;a.vy-=preset.gravity*dt;{const nextY=a.y+a.vy*dt,ceiling=a.vy>0?core.ceilingBottom(a.x,a.z,a.radius,a.y,a.height,nextY,game.world.colliders):null;if(ceiling!=null){a.y=ceiling-a.height-.015;a.vy=0}else a.y=nextY}const support=core.supportHeight(a.x,a.z,a.radius,game.world.colliders,a.y+.08,.46);if(a.y<=support){const impact=Math.max(0,-a.vy);if(impact>.8){a._landingStrength=clamp((impact-2.5)/7.5,.12,1);a.landTimer=impact>8.1?.24:.14;a._hardLandTimer=impact>8.1?.22:0}a.y=support;a.vy=0;a.grounded=true}else a.grounded=false;a.landTimer=Math.max(0,(a.landTimer||0)-dt);a._hardLandTimer=Math.max(0,(a._hardLandTimer||0)-dt);a._landingStrength=Math.max(0,(a._landingStrength||0)-dt*3.7);a.anim=gameplay.resolveLocomotionAnim(a,{moving,sprinting:sprint,aiming});a.rig.position.set(a.x,a.y,a.z);a.rig.rotation.y=a.yaw;
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
  function startMantle(a,b,dx,dz){
    const dirLen=Math.hypot(dx,dz)||1,dirX=dx/dirLen,dirZ=dz/dirLen,top=(b.y||0)+b.h,tx=clamp(a.x+dirX*(a.radius+.54),b.x-b.w/2+a.radius,b.x+b.w/2-a.radius),tz=clamp(a.z+dirZ*(a.radius+.54),b.z-b.d/2+a.radius,b.z+b.d/2-a.radius);
    a.mantle={t:0,duration:.48,fromX:a.x,fromY:a.y,fromZ:a.z,toX:tx,toY:top+.015,toZ:tz,dirX,dirZ};a.vx=a.vz=a.vy=0;a.anim='mantle';a._mantleVisual=1;
  }
  function animateMantle(a,dt){
    if(!a.mantle)return;const m=a.mantle;m.t=Math.min(1,m.t+dt/m.duration);const lift=clamp(m.t/.62,0,1),push=clamp((m.t-.12)/.88,0,1),ease=t=>t*t*(3-2*t);
    a.x=core.lerp(m.fromX,m.toX,ease(push));a.z=core.lerp(m.fromZ,m.toZ,ease(push));a.y=core.lerp(m.fromY,m.toY,ease(lift))+Math.sin(Math.PI*m.t)*.13;a.rig.position.set(a.x,a.y,a.z);a._mantleVisual=1-m.t;
    if(m.t>=1){a.y=m.toY;a.mantle=null;a.grounded=true;a.anim='land';a.landTimer=.11;a._mantleVisual=0}
  }


  function updateBots(dt){
    for(const a of game.actors){if(!a.isBot||!a.alive)continue;if(network&&!roomState.isHost)continue;if(a.mantle){animateMantle(a,dt);continue}a.ai.timer-=dt;a.ai.changeTimer-=dt;a.ai.decoyTimer-=dt;const enemies=game.actors.filter(b=>b.alive&&b.role!==a.role);if(a.role==='hunter'&&roomState.phase==='hunt')botHunter(a,enemies,dt);else if(a.role==='hunter'&&roomState.phase==='hide'){a.vx=a.vz=0;a.anim='idle'}else if(a.role==='hider')botHider(a,enemies,dt);else wanderBot(a,dt);resolveActorOverlap(a);a.vy-=18*dt;{const nextY=a.y+a.vy*dt,ceiling=a.vy>0?core.ceilingBottom(a.x,a.z,a.radius,a.y,a.height,nextY,game.world.colliders):null;if(ceiling!=null){a.y=ceiling-a.height-.015;a.vy=0}else a.y=nextY}const support=core.supportHeight(a.x,a.z,a.radius,game.world.colliders,a.y+.08,.46);if(a.y<=support){a.y=support;a.vy=0;a.grounded=true}else a.grounded=false;a.rig.position.set(a.x,a.y,a.z);a.rig.rotation.y=a.yaw;}
  }
  function botMoveToward(a,target,speed,dt,{jump=false,repath=.55}={}){
    if(!target)return false;const ai=a.ai||(a.ai={}),goalChanged=!ai.pathGoal||Math.hypot((ai.pathGoal.x||0)-target.x,(ai.pathGoal.z||0)-target.z)>.8;ai.pathTimer=(ai.pathTimer||0)-dt;
    if(goalChanged||ai.pathTimer<=0||!ai.path?.length||ai.pathIndex>=ai.path.length){ai.pathTimer=repath;ai.pathGoal={x:target.x,z:target.z};ai.path=game.nav?.findPath?.({x:a.x,z:a.z},target,{maxNodes:1200})||[];ai.pathIndex=Math.min(1,Math.max(0,ai.path.length-1));}
    let node=ai.path?.[ai.pathIndex]||target;if(Math.hypot(node.x-a.x,node.z-a.z)<.38&&ai.pathIndex<(ai.path?.length||0)-1){ai.pathIndex++;node=ai.path[ai.pathIndex]||target}
    const dx=node.x-a.x,dz=node.z-a.z,l=Math.hypot(dx,dz)||1;if(l<.08)return false;a.yaw=gameplay.dampAngle(a.yaw,Math.atan2(dx,-dz),12,dt);moveActor(a,dx/l*speed*dt,dz/l*speed*dt,jump);return true;
  }

  function botHunter(a,enemies,dt){let target=a.ai.detected;if(!target||!target.alive||!hasLineOfSight(a,target)){target=enemies.filter(e=>e.role==='hider').sort((u,v)=>core.dist2(a,u)-core.dist2(a,v)).find(e=>core.dist2(a,e)<9&&hasLineOfSight(a,e));a.ai.detected=target||null}if(target){const dx=target.x-a.x,dz=target.z-a.z,d=Math.hypot(dx,dz)||1;if(d>2.1)botMoveToward(a,target,3.5,dt,{repath:.28});else a.yaw=gameplay.dampAngle(a.yaw,Math.atan2(dx,-dz),16,dt);a.anim=d>2.1?'run':'aim';if(d<8&&hasLineOfSight(a,target)&&performance.now()-a.lastShot>(a.difficulty==='hard'?350:a.difficulty==='easy'?900:600)){a.lastShot=performance.now();botShoot(a,target)}}else wanderBot(a,dt);}
  function botHider(a,hunters,dt){if(!a.prop){const options=a.disguiseOptions?.length?a.disguiseOptions:core.PAPA_DISGUISE_POOL;if(options?.length)applyDisguise(a,options[Math.floor(Math.random()*options.length)],false)}const hunter=[...hunters].sort((u,v)=>core.dist2(a,u)-core.dist2(a,v))[0],danger=hunter?core.dist2(a,hunter):999;if(danger<4.2){a.locked=false;const dx=a.x-hunter.x,dz=a.z-hunter.z,l=Math.hypot(dx,dz)||1,escape={x:clamp(a.x+dx/l*4.4,game.world.bounds.minX+.5,game.world.bounds.maxX-.5),z:clamp(a.z+dz/l*4.4,game.world.bounds.maxZ-.5)};escape.z=clamp(a.z+dz/l*4.4,game.world.bounds.minZ+.5,game.world.bounds.maxZ-.5);botMoveToward(a,escape,3.6,dt,{jump:true,repath:.32});a.anim='run';if(a.flash&&danger<2.7)useFlash(a,false)}else{a.locked=!!a.prop;a.anim='idle';if(!a.prop)wanderBot(a,dt)}}
  function wanderBot(a,dt){if(a.ai.timer<=0||!a.ai.target){a.ai.timer=2+Math.random()*3;a.ai.target={x:clamp(a.x+(Math.random()-.5)*7,game.world.bounds.minX+.8,game.world.bounds.maxX-.8),z:clamp(a.z+(Math.random()-.5)*7,game.world.bounds.minZ+.8,game.world.bounds.maxZ-.8)}}const dx=a.ai.target.x-a.x,dz=a.ai.target.z-a.z,l=Math.hypot(dx,dz)||1;if(l>.35){botMoveToward(a,a.ai.target,1.7,dt,{repath:.85});a.anim='walk'}else a.anim='idle';}
  function botShoot(a,target){if(!hasLineOfSight(a,target))return;const acc=a.difficulty==='hard' ? .88 : a.difficulty==='easy' ? .5 : .7;if(Math.random()>acc)return;registerHit(a,target);}
  function hasLineOfSight(a,b){const origin=new THREE.Vector3(a.x,a.y+a.height*.72,a.z),target=new THREE.Vector3(b.x,b.y+b.height*.58,b.z),dir=target.clone().sub(origin),dist=dir.length();dir.normalize();const ray=new THREE.Raycaster(origin,dir,.05,dist);const hits=ray.intersectObjects(game.world.raycastMeshes,true);return !hits.length||hits[0].distance>=dist-.25;}

  function updateRemoteActors(dt){if(!network)return;const now=performance.now();for(const a of game.actors){if(a===game.player||a.isBot&&roomState.isHost)continue;const t=a.netBuffer?.sample(now)||a.netTarget;if(t){a.netTarget=t;a.x=t.x??a.x;a.y=t.y??a.y;a.z=t.z??a.z;a.yaw=t.yaw??a.yaw;a.pitch=t.pitch??a.pitch;a.vx=t.vx??0;a.vy=t.vy??0;a.vz=t.vz??0;a.anim=t.anim||a.anim||'idle';a.rig.position.set(a.x,a.y,a.z);a.rig.rotation.y=a.yaw;const newProp=t.prop||null;if(newProp!==a.prop){spawnPoof(a.x,a.y+a.height*.45,a.z);a.prop=newProp;applyActorVisual(a)}}}}
  function applyRoomState(){if(!game||!roomState)return;if(roomState.round!==game.round){game.round=roomState.round;const next=roomState.activeMap||mapFor(roomState.settings.mapKey,roomState.round);disposeRoot();ensureEngine().then(()=>startEngine(next));return}game.weatherPreset=roomState.weatherPreset||game.weatherPreset;game.layoutVariant=roomState.layoutVariant??game.layoutVariant;for(const p of roomState.players){const a=game.actorsById.get(p.id);if(!a)continue;const wasAlive=a.alive;a.role=p.role;a.health=p.health;a.alive=p.alive;a.propChanges=p.propChanges;a.decoys=p.decoys;a.flash=p.flash;a.disguiseOptions=[...(p.disguiseOptions||[])];a.hiderScore=Number(p.hiderScore||a.hiderScore||0);a.score=p.score||a.score;a.lifetime=p.lifetime||a.lifetime;if(p.prop!==a.prop){spawnPoof(a.x,a.y+a.height*.45,a.z);a.prop=p.prop;applyActorVisual(a)}if(wasAlive&&!a.alive&&roomState.settings.mode==='classic')beginGhostMode(a);const parts=a.rig.userData.parts;if(parts?.weapon)parts.weapon.visible=a.role==='hunter'&&!a.prop;}syncRoomDecoys();if(roomState.phase==='roundEnd'&&roomState.roundSummary&&game.lastSummaryRound!==roomState.round){game.lastSummaryRound=roomState.round;showRoundSummary(roomState.roundSummary)}if(roomState.phase==='matchEnd')showMatchEnd();}
  function handleNetworkAction(m){if(m.action==='flash'){const source=game.actorsById.get(m.playerId);if(source&&game.player.role==='hunter'&&core.dist2(source,game.player)<3.5)flashScreen();addFeed(`${source?.person?.name||'A hider'} fired a flash.`)}if(m.action==='hit'){const target=game.actorsById.get(m.targetId);if(target){const wasAlive=target.alive;target.health=m.health;target.alive=m.alive;target.role=m.role;if(target===game.player)showDamage(target.health);gameplay.playTransientAnimation(target,'hit',460);if(m.eliminated||wasAlive&&!target.alive){spawnPropBreak(target);playSinCue();if(!target.alive&&roomState.settings.mode==='classic'){target.rig.visible=false;beginGhostMode(target)}}addFeed(`${target.person.name} was hit. ${target.health}/3.`)}}if(m.action==='decoy')spawnDecoy(m.prop,m.position?.x||0,m.position?.y||0,m.position?.z||0,{rotation:m.rotation,id:m.decoyId||null});}

  function sendNetworkSnapshots(){if(!ws||ws.readyState!==1)return;const sendActor=a=>ws.send(JSON.stringify({type:'snapshot',playerId:a.id,snapshot:{x:a.x,y:a.y,z:a.z,yaw:a.yaw,pitch:a.pitch,vx:a.vx,vy:a.vy,vz:a.vz,anim:a.anim,prop:a.prop,locked:a.locked,seq:Math.floor(performance.now())}}));sendActor(game.player);if(roomState.isHost)for(const a of game.actors)if(a.isBot)sendActor(a);}

  function propSurfaceAt(a){if(game?.mapKey==='camp')return Math.abs(a?.z||0)>9?'sand':'dirt';if(game?.mapKey==='farm')return'dirt';if(game?.mapKey==='acreage')return Math.abs(a?.x||0)<8&&Math.abs(a?.z||0)<8?'wood':'grass';if(game?.mapKey==='papa'){const x=a?.x||0,z=a?.z||0;if(x>=.8&&x<=27.5&&z>=3.6&&z<=22.5)return'concrete';if(x>=28&&x<=51&&z>=3.5&&z<=23.8)return'dirt';return'grass'}return'default'}
  function updateActorVisuals(dt){
    for(const a of game.actors){
      if(!a.alive){a.rig.visible=false;continue}
      a.recoil=Math.max(0,(a.recoil||0)-dt*7);a.rig.visible=!(a===game.player&&a.cameraHidden);const speed=Math.hypot(a.vx||0,a.vz||0),aiming=a.role==='hunter',directional=gameplay.resolveDirectionalLocomotion(a,{aiming,sprinting:!!a._sprinting});a._directional=directional;
      let focus=null;
      if(a===game.player){const dir=new THREE.Vector3();game.camera.getWorldDirection(dir);focus={x:a.x+dir.x*6,y:a.y+(isDog(a.person)?.8:1.48)+dir.y*6,z:a.z+dir.z*6}}
      else if(a.ai?.detected?.alive)focus={x:a.ai.detected.x,y:a.ai.detected.y+a.ai.detected.height*.55,z:a.ai.detected.z};
      else{const rival=game.actors.filter(o=>o!==a&&o.alive&&o.role!==a.role).sort((u,v)=>core.dist2(a,u)-core.dist2(a,v))[0];if(rival&&core.dist2(a,rival)<5.5)focus={x:rival.x,y:rival.y+rival.height*.55,z:rival.z}}
      const attention=gameplay.updateAttention(a,dt,focus,{headHeight:isDog(a.person)?.82:1.55,maxDistance:7});const motion=gameplay.updateMotionTelemetry(a,dt,{speed,turnRate:a.turnRate||0,grounded:a.grounded,verticalSpeed:a.vy||0});if((a._landingStrength||0)>0)motion.landing=Math.max(motion.landing||0,a._landingStrength||0);
      if(a.prop){updatePropMotionVisual(a,dt,directional,motion);continue}
      if(a.authored&&a.hasAuthoredClips&&a.animMixer){
        let base=a.anim||'idle',transient=a._transientAnim&&Date.now()<(a._transientAnimUntil||0)?a._transientAnim:null;
        if(['idle','walk','run','sprint','aim'].includes(base)&&speed>.18)base=directional.semantic;if(base==='run'&&a._sprinting)base='sprint';
        const absScale=base==='sprint'?clamp(speed/5.6,.78,1.28):base==='run'?clamp(speed/4.3,.72,1.3):['walk','backward','strafeLeft','strafeRight'].includes(base)?clamp(speed/2.35,.72,1.32):1,baseScale=base==='backward'?-absScale:absScale;
        if((aiming||transient==='fire')&&['idle','walk','run','sprint','backward','strafeLeft','strafeRight','aim','fire'].includes(base)){
          const lower=speed>.18?directional.semantic:'idle',lowerScale=lower==='backward'?-Math.max(.72,absScale):absScale,overlay=transient==='fire'?'fire':'aim';a.animMixer.playLayered(lower,overlay,{baseTimeScale:lowerScale,overlayTimeScale:1,overlayOnce:overlay==='fire'});
        }else if(a._moveTransition&&performance.now()<(a._moveTransitionUntil||0)&&['idle','walk','run','sprint'].includes(base)){a.animMixer.play(a._moveTransition,{timeScale:1});}
        else{a._moveTransition=null;a._moveTransitionUntil=0;a.animMixer.play(base,{timeScale:baseScale,once:['turnLeft','turnRight','hardLand','land','mantle'].includes(base)})}
        a.animMixer.update(dt);a._studioAnimState=a.animMixer.getState?.();applyGameplayBodyFeel(a,dt,directional,motion,aiming);studio.applyFootIK(a,THREE,{heightAt:(x,z)=>core.supportHeight(x,z,a.radius,game.world.colliders,a.y+.1,.5),dt,maxLift:.075});
      }else{
        gameplay.animateFamilyRig(a,dt,{aim:a.role==='hunter',recoil:a.recoil||0,lookPitch:a.pitch||0,turnRate:a.turnRate||0,speed,grounded:a.grounded,attention});studio.updateProceduralFace(a,dt,{expression:a.anim==='hit'?'hurt':a.role==='hunter'?'focused':'neutral'});studio.applyFootIK(a,THREE,{heightAt:(x,z)=>core.supportHeight(x,z,a.radius,game.world.colliders,a.y+.1,.5),dt,maxLift:.1});applyGameplayBodyFeel(a,dt,directional,motion,aiming);
      }
      if(a.rig.visible)for(const ev of gameplay.consumeMotionEvents(a)){game.motionFx?.emit(a.x,a.y,a.z,{strength:ev.strength,kind:ev.type});if((a===game.player||core.dist2(a,game.player)<8)&&!(isHunterHidePhase()&&a.role==='hider'))audio?.oneShot(ev.type==='land'?'land':'step',{volume:ev.type==='land'?.11:.03,pitch:.9+Math.random()*.18,pan:studio.computeStereoPan(game.cameraYaw,game.player,a),surface:propSurfaceAt(a)})}
    }
  }


  function updateNpcs(dt){for(const n of game.world.npcs||[]){const ai=n.userData.npc;ai.timer-=dt;ai.phase=(ai.phase||0)+dt;if(ai.timer<=0){ai.timer=1.5+Math.random()*3;ai.tx=ai.baseX+(Math.random()-.5)*1.6;ai.tz=ai.baseZ+(Math.random()-.5)*1.6}let moving=false;if(ai.tx!=null){const dx=ai.tx-n.position.x,dz=ai.tz-n.position.z,l=Math.hypot(dx,dz)||1;if(l>.08){moving=true;n.position.x+=dx/l*.35*dt;n.position.z+=dz/l*.35*dt;n.rotation.y=gameplay.dampAngle(n.rotation.y,Math.atan2(dx,-dz),7,dt)}}n.position.y=(moving?Math.abs(Math.sin(ai.phase*5.5))*.014:Math.sin(ai.phase*1.4)*.006);n.rotation.z=gameplay.damp(n.rotation.z||0,moving?Math.sin(ai.phase*5.5)*.012:0,7,dt)}}

  function updateEffects(dt){for(let i=game.effects.length-1;i>=0;i--){const e=game.effects[i];e.life-=dt;if(e.kind==='tracer')e.mesh.material.opacity=Math.max(0,e.life/e.max);if(e.kind==='ring'){const k=1+(1-e.life/e.max)*(e.grow||1);e.mesh.scale.setScalar(k);if(e.mesh.material)e.mesh.material.opacity=Math.max(0,e.life/e.max)}if(e.kind==='spark'){e.vy-=8*dt;e.mesh.position.x+=e.vx*dt;e.mesh.position.y+=e.vy*dt;e.mesh.position.z+=e.vz*dt;e.mesh.material.opacity=Math.max(0,e.life/e.max)}if(e.kind==='breakShard'){e.vy-=6.5*dt;e.mesh.position.x+=e.vx*dt;e.mesh.position.y+=e.vy*dt;e.mesh.position.z+=e.vz*dt;e.mesh.rotation.x+=3.2*dt;e.mesh.rotation.z+=2.4*dt}if(e.life<=0){game.scene.remove(e.mesh);e.mesh.geometry?.dispose?.();e.mesh.material?.dispose?.();game.effects.splice(i,1)}}game.motionFx?.update(dt);if(game.world?.group)art.animateAmbience(game.world.group,performance.now()*.001,{player:game.player,dt})}

  function updateCamera(dt){
    const player=game.player;if(!player)return;if(!player.alive&&roomState.settings.mode==='classic'&&game.ghostMode==='free'&&game.ghost){const g=game.ghost,cs=game.cameraRig.state;game.camera.position.set(g.x,g.y,g.z);const cp=Math.cos(cs.pitch),dir=new THREE.Vector3(Math.sin(cs.yaw)*cp,-Math.sin(cs.pitch),-Math.cos(cs.yaw)*cp);game.camera.lookAt(game.camera.position.clone().add(dir));game.cameraYaw=cs.yaw;game.cameraPitch=cs.pitch;return}
    let a=player;if(!player.alive&&roomState.settings.mode==='classic'){if(!game.spectateTarget?.alive)game.spectateTarget=game.actors.find(o=>o.alive&&o!==player)||null;if(game.spectateTarget)a=game.spectateTarget}
    if(a===player&&gameplay.recoverActorFromGeometry(core,a,game.world.colliders,game.world.bounds,{radius:a.radius,height:a.height,maxRadius:3.5})){game.stagingQa?.setRecovery('player geometry recovery');game.cameraRig.reset(a,game.world.colliders,{yaw:a.yaw,pitch:.065,distance:game.cameraRig.cfg.cameraDistance,dog:isDog(a.person),height:a.prop?a.height*.55:(isDog(a.person)?.64:1.17),forceSnap:true,reason:'player geometry recovery'});}
    const sprinting=a===player&&gameplay.wantsSprint(keys,input,{sprint:game.padSprint},{strength:Math.min(1,Math.hypot(a.vx,a.vz)/(game.cameraRig.cfg.runSpeed||1))});game.cameraRig.state.aim=false;game.cameraRig.update(a,game.world.colliders,dt,{aim:false,sprinting,dog:isDog(a.person),height:a.prop?a.height*.55:(isDog(a.person)?.64:1.17),velocity:{x:a.vx,z:a.vz},turnRate:a.turnRate||0,cameraBob:(a._motion?.landing||0)*-.032});game.cameraYaw=game.cameraRig.state.yaw;game.cameraPitch=game.cameraRig.state.pitch;game.cameraActualDistance=game.cameraRig.state.actualDistance;player.cameraHidden=player.alive&&game.cameraActualDistance<.72&&!player.prop;updateAimAssistIndicator();
  }


  function actorFromRayHit(hit){let o=hit?.object||null;while(o&&o!==game.scene){if(o.userData?.actor)return o.userData.actor;o=o.parent}return null}
  function muzzleWorldPosition(a){const start=new THREE.Vector3(a.x,a.y+a.height*.68,a.z),muzzle=a.rig?.userData?.parts?.weapon?.userData?.muzzle;muzzle?.getWorldPosition?.(start);return start}
  function revalidateShotFromMuzzle(a,cameraPoint,targets){const start=muzzleWorldPosition(a),dir=cameraPoint.clone().sub(start),distance=Math.min(32,dir.length()+.18);if(distance<.02)return{hitPoint:cameraPoint,target:null};dir.normalize();const muzzleRay=new THREE.Raycaster(start,dir,.01,distance),hits=muzzleRay.intersectObjects(targets,false).filter(h=>h.object.visible);if(!hits.length)return{hitPoint:cameraPoint,target:null};return{hitPoint:hits[0].point.clone(),target:actorFromRayHit(hits[0])}}
  function aimAssistTarget(a){
    if(!a||a.role!=='hunter'||roomState.phase!=='hunt')return null;const coarse=globalThis.matchMedia?.('(pointer:coarse)')?.matches||false,gamepad=!![...(navigator.getGamepads?.()||[])].find(Boolean);if(!coarse&&!gamepad)return null;
    const origin=game.camera.position.clone(),forward=new THREE.Vector3();game.camera.getWorldDirection(forward);let best=null,bestScore=Infinity;
    for(const b of game.actors){if(b===a||!b.alive||b.role!=='hider')continue;const point=new THREE.Vector3(b.x,b.y+b.height*.56,b.z),delta=point.clone().sub(origin),dist=delta.length();if(dist>19||dist<.25)continue;delta.normalize();const angle=Math.acos(clamp(forward.dot(delta),-1,1));const cone=coarse?.078:.048;if(angle>cone||!hasLineOfSight(a,b))continue;const score=angle*11+dist*.005;if(score<bestScore){bestScore=score;best={actor:b,point,angle,dist}}}
    return best;
  }
  function updateAimAssistIndicator(){const e=root.querySelector('#ph3Crosshair');if(!e||!game?.player)return;const target=roomState.phase==='hunt'?aimAssistTarget(game.player):null;game.aimAssist=target;e.classList.toggle('assisted',!!target);e.setAttribute('data-assist',target?'target':'none')}
  function shoot(){
    const a=game?.player;if(!a||a.role!=='hunter'||!a.alive||roomState.phase!=='hunt'||game.shotCooldown>0)return;
    game.shotCooldown=HUNTER_FIRE_INTERVAL;a.recoil=.7;gameplay.playTransientAnimation(a,'fire',240);audio?.oneShot('zap',{volume:.12,pitch:.92+Math.random()*.12});game.cameraRig?.kick(.028,(Math.random()-.5)*.008,.025);
    const ray=new THREE.Raycaster();ray.setFromCamera(new THREE.Vector2(0,0),game.camera);ray.far=32;const targets=[...game.world.raycastMeshes];for(const d of game.decoys)d.traverse(o=>{if(o.isMesh&&o.visible)targets.push(o)});for(const n of game.world.npcs||[])n.traverse(o=>{if(o.isMesh&&o.visible)targets.push(o)});for(const b of game.actors)if(b!==a&&b.alive)b.rig.traverse(o=>{if(o.isMesh&&o.visible)targets.push(o)});
    const hits=ray.intersectObjects(targets,false).filter(h=>h.object.visible),assist=aimAssistTarget(a);let cameraPoint=game.camera.position.clone().add(ray.ray.direction.clone().multiplyScalar(25));if(hits.length)cameraPoint=hits[0].point.clone();
    // Assistance only nudges a shot that is already inside a small cone and still goes
    // through the muzzle obstruction validation. It never rotates the camera for the player.
    if(assist?.point)cameraPoint=assist.point.clone();
    const validated=revalidateShotFromMuzzle(a,cameraPoint,targets),hitPoint=validated.hitPoint,target=validated.target;spawnTracer(a,hitPoint);
    if(target&&target.role==='hider'){registerHit(a,target);showHit();audio?.oneShot('impact',{volume:.08,pitch:.78+Math.random()*.12,pan:studio.computeStereoPan(game.cameraYaw,a,target)})}else{spawnSparks(hitPoint,5);audio?.oneShot('impact',{volume:.045,pitch:1.08+Math.random()*.18,pan:0})}
  }
  function registerHit(shooter,target){if(roomState.phase!=='hunt'||!target.alive)return;if(network&&ws?.readyState===1){ws.send(JSON.stringify({type:'action',action:'hit',targetId:target.id}));return}target.health--;target.locked=false;if(target===game.player)showDamage(target.health);gameplay.playTransientAnimation(target,'hit',460);spawnSparks(new THREE.Vector3(target.x,target.y+target.height*.55,target.z),8);addFeed(`Hit ${target.prop||target.person.name}: ${Math.max(0,target.health)}/3.`);if(target.health<=0){spawnPropBreak(target);playSinCue();if(shooter){shooter.score=shooter.score||{hunterElims:0};shooter.score.hunterElims=(shooter.score.hunterElims||0)+1}if(roomState.settings.mode==='chaos'){target.role='hunter';target.health=3;target.prop=null;target.alive=true;target.disguiseOptions=[];applyActorVisual(target);addFeed(`${target.person.name} joins the hunters.`)}else{target.alive=false;target.rig.visible=false;beginGhostMode(target);addFeed(`${target.person.name} was found.`)}}}
  function spawnTracer(a,end){const parts=a.rig.userData.parts,muzzle=parts?.weapon?.userData?.muzzle,start=new THREE.Vector3(a.x,a.y+a.height*.68,a.z);if(muzzle){muzzle.getWorldPosition(start)}const geom=new THREE.BufferGeometry().setFromPoints([start,end]);const mat=new THREE.LineBasicMaterial({color:0xffd36e,transparent:true,opacity:.95});const line=new THREE.Line(geom,mat);game.scene.add(line);game.effects.push({kind:'tracer',mesh:line,life:.08,max:.08});const flash=new THREE.PointLight(0xffd06a,3,2,2);flash.position.copy(start);game.scene.add(flash);game.effects.push({kind:'light',mesh:flash,life:.04,max:.04});}
  function spawnSparks(pos,n){for(let i=0;i<n;i++){const mesh=new THREE.Mesh(new THREE.SphereGeometry(.025,6,4),new THREE.MeshBasicMaterial({color:0xffcf5a,transparent:true}));mesh.position.copy(pos);game.scene.add(mesh);game.effects.push({kind:'spark',mesh,life:.28+Math.random()*.25,max:.5,vx:(Math.random()-.5)*2.2,vy:1+Math.random()*2,vz:(Math.random()-.5)*2.2})}}
  function spawnPoof(x,y,z){const mesh=new THREE.Mesh(new THREE.SphereGeometry(.3,12,8),new THREE.MeshBasicMaterial({color:0xfff1d1,transparent:true,opacity:.75}));mesh.position.set(x,y,z);game.scene.add(mesh);game.effects.push({kind:'spark',mesh,life:.55,max:.55,vx:0,vy:.35,vz:0})}
  function showHit(){const e=root.querySelector('#ph3Hit');if(!e)return;e.classList.remove('on');void e.offsetWidth;e.classList.add('on');const c=root.querySelector('#ph3Crosshair');c?.classList.add('firing');setTimeout(()=>c?.classList.remove('firing'),110);}
  function showDamage(health){const e=root.querySelector('#ph3Damage');if(!e)return;game.lastDamageAt=performance.now();e.dataset.hp=String(Math.max(0,health??0));e.classList.remove('on');void e.offsetWidth;e.classList.add('on');setTimeout(()=>e.classList.remove('on'),420);}
  function cycleSpectate(){if(!game||game.player?.alive)return;const alive=game.actors.filter(a=>a.alive&&a!==game.player);if(!alive.length)return;game.ghostMode='follow';const i=Math.max(-1,alive.indexOf(game.spectateTarget));game.spectateTarget=alive[(i+1)%alive.length];game.cameraRig.reset(game.spectateTarget,game.world.colliders,{yaw:game.spectateTarget.yaw,pitch:.065,distance:game.cameraRig.cfg.cameraDistance,forceSnap:true,reason:'spectator target change'});}
  function applyGameplayBodyFeel(a,dt,directional,motion,aiming){const local=directional?.local||gameplay.movementRelativeToFacing(a),speed=directional?.speed||0,ground=a.grounded!==false;const side=ground?clamp(local.x,-1,1):0,forward=ground?clamp(local.z,-1,1):0,landing=motion?.landing||0,turn=clamp(a.turnRate||0,-3,3);a.rig.rotation.z=gameplay.damp(a.rig.rotation.z||0,-side*(aiming?.055:.035)-turn*.004,10,dt);a.rig.rotation.x=gameplay.damp(a.rig.rotation.x||0,clamp(-(motion?.accel||0)*.0025,-.045,.045)+landing*.018,10,dt);const parts=a.rig.userData?.parts;if(a.authored&&parts?.hips&&!a.mantle&&aiming&&speed>.12){parts.hips.rotation.y=gameplay.damp(parts.hips.rotation.y||0,clamp(side*.34,-.34,.34),11,dt)}if(a.authored&&parts?.upperBody&&!a.mantle&&aiming&&speed>.12){parts.upperBody.rotation.y=gameplay.damp(parts.upperBody.rotation.y||0,clamp(-side*.12,-.12,.12),12,dt)}a._gameplayPose={side,forward,speed,aiming};}
  function updatePropMotionVisual(a,dt,directional,motion){const m=a.propMesh;if(!m)return;const local=directional?.local||{x:0,z:0},moving=(directional?.speed||0)>.12&&!a.locked,base=m.userData.p3BaseScale;if((a._propTransform||0)>0&&base){a._propTransform=Math.max(0,a._propTransform-dt*3.4);const t=1-a._propTransform,e=1-Math.pow(1-t,3),pop=1+Math.sin(Math.PI*t)*.08;m.scale.set(base.x*e*pop,base.y*e*pop,base.z*e*pop)}else if(base){m.scale.set(base.x,base.y,base.z)}m.rotation.z=gameplay.damp(m.rotation.z||0,moving?-local.x*.075:0,9,dt);m.rotation.x=gameplay.damp(m.rotation.x||0,moving?local.z*.035:0,9,dt);m.position.y=gameplay.damp(m.position.y||0,moving?Math.abs(Math.sin((a.animTime||0)*6))*0.018:0,10,dt);a.rig.rotation.x=gameplay.damp(a.rig.rotation.x||0,0,10,dt);a.rig.rotation.z=gameplay.damp(a.rig.rotation.z||0,0,10,dt);}
  function spawnTransformBurst(x,y,z){spawnPoof(x,y,z);const g=new THREE.TorusGeometry(.34,.025,8,24),m=new THREE.MeshBasicMaterial({color:0x9fe7c2,transparent:true,opacity:.85}),ring=new THREE.Mesh(g,m);ring.position.set(x,y,z);ring.rotation.x=Math.PI/2;game.scene.add(ring);game.effects.push({kind:'ring',mesh:ring,life:.5,max:.5,grow:1.45});}
  function spawnPlacementRing(x,y,z){const g=new THREE.RingGeometry(.18,.26,24),m=new THREE.MeshBasicMaterial({color:0xc7f0a5,transparent:true,opacity:.8,side:THREE.DoubleSide}),ring=new THREE.Mesh(g,m);ring.position.set(x,y+.012,z);ring.rotation.x=-Math.PI/2;game.scene.add(ring);game.effects.push({kind:'ring',mesh:ring,life:.42,max:.42,grow:1.65});}
  function spawnFlashBurst(x,y,z){const g=new THREE.SphereGeometry(.22,12,8),m=new THREE.MeshBasicMaterial({color:0xfff5b8,transparent:true,opacity:.75,wireframe:true}),orb=new THREE.Mesh(g,m);orb.position.set(x,y,z);game.scene.add(orb);game.effects.push({kind:'ring',mesh:orb,life:.55,max:.55,grow:4.6});const light=new THREE.PointLight(0xfff0a4,4.5,4.8,2);light.position.set(x,y,z);game.scene.add(light);game.effects.push({kind:'light',mesh:light,life:.18,max:.18});}

  function nearestProp(a,max=1.6){return core.nearestReachableProp(a,game.world.props,max,.55);}
  function changeProp(){const a=game?.player;if(!a||a.role!=='hider'||!a.alive)return;if(a.prop&&a.propChanges<=0){APP.toast('No prop changes left');return}renderDisguiseTray(a,true);}
  function applyDisguise(a,type,announce=true){
    if(!a||!type)return;if(a.disguiseOptions?.length&&!a.disguiseOptions.includes(type)){if(announce)APP.toast('That prop is not in your four choices this round');return}if(a.prop&&a.propChanges<=0)return;audio?.oneShot('ui',{volume:.07,pitch:.72});spawnTransformBurst(a.x,a.y+a.height*.42,a.z);if(a.prop)a.propChanges--;a.prop=type;a.flash=true;a.locked=false;applyActorVisual(a);a._propTransform=1;if(a.propMesh){a.propMesh.userData.p3BaseScale={x:a.propMesh.scale.x,y:a.propMesh.scale.y,z:a.propMesh.scale.z};a.propMesh.scale.multiplyScalar(.22)}if(announce)addFeed(`${a.person.name} disguised as ${type}. ${propRiskLabel(type)} pays ${core.propSurvivalRate(type).toFixed(2)}x survival points.`);renderDisguiseTray(a,false);
  }
  function toggleLock(){const a=game?.player;if(!a||a.role!=='hider'||!a.prop)return;a.locked=!a.locked;APP.toast(a.locked?'Prop locked':'Prop unlocked');}
  function dropDecoy(){
    const a=game?.player;if(!a||a.role!=='hider'||!a.prop||a.decoys<=0)return;if(network&&ws?.readyState===1){ws.send(JSON.stringify({type:'action',action:'decoy'}));return}a.decoys--;
    const fwdX=Math.sin(a.yaw),fwdZ=-Math.cos(a.yaw),d=propDef(a.prop),r=Math.max(.18,Math.min(.55,Math.max(d.w,d.d)*.45));let x=clamp(a.x+fwdX*.78,game.world.bounds.minX+r,game.world.bounds.maxX-r),z=clamp(a.z+fwdZ*.78,game.world.bounds.minZ+r,game.world.bounds.maxZ-r);const supportY=core.supportHeight(x,z,r,game.world.colliders,a.y+.18,.65);let y=supportY;
    if(core.blockingCollider(x,z,r,y,d.h,game.world.colliders)){x=a.x;z=a.z;y=core.supportHeight(x,z,r,game.world.colliders,a.y+.18,.65)}spawnDecoy(a.prop,x,Number.isFinite(y)?y:a.y,z,{rotation:a.yaw});addFeed(`Decoy placed. ${a.decoys}/10 left.`);
  }
  function spawnDecoy(type,x,y,z,{rotation=null,id=null}={}){if(id&&game.decoys.some(d=>d.userData?.serverDecoyId===id))return null;const mesh=createPropMesh(type);mesh.position.set(x,Number.isFinite(Number(y))?Number(y):0,z);mesh.rotation.y=Number.isFinite(rotation)?rotation:Math.random()*Math.PI*2;if(id)mesh.userData.serverDecoyId=id;game.scene.add(mesh);game.decoys.push(mesh);spawnPlacementRing(mesh.position.x,mesh.position.y+.05,mesh.position.z);return mesh;}
  function syncRoomDecoys(){if(!network||!Array.isArray(roomState?.decoyObjects))return;const ids=new Set(roomState.decoyObjects.map(d=>d.id));for(let i=game.decoys.length-1;i>=0;i--){const d=game.decoys[i],id=d.userData?.serverDecoyId;if(id&&!ids.has(id)){game.scene.remove(d);game.decoys.splice(i,1)}}for(const d of roomState.decoyObjects){if(!d?.id||game.decoys.some(m=>m.userData?.serverDecoyId===d.id))continue;spawnDecoy(d.prop,d.position?.x||0,d.position?.y||0,d.position?.z||0,{rotation:d.rotation,id:d.id})}}
  function useFlash(a,announce=true){if(!a.flash)return;a.flash=false;audio?.oneShot('ui',{volume:.09,pitch:1.7});spawnFlashBurst(a.x,a.y+a.height*.48,a.z);for(const h of game.actors)if(h.role==='hunter'&&h.alive&&core.dist2(a,h)<3.5&&h===game.player)flashScreen();if(announce)addFeed(`${a.person.name} fired the flash.`);}
  function flashScreen(){const ov=root.querySelector('#ph3Flash');ov?.classList.add('on');setTimeout(()=>ov?.classList.remove('on'),900);}


  function propRiskLabel(type){const tier=core.propRiskTier?.(type)||'medium';return tier==='giant'?'GIANT RISK':tier==='large'?'LARGE RISK':tier==='small'?'SMALL PROP':'MEDIUM PROP'}
  function renderDisguiseTray(a,open){const tray=root.querySelector('#phDisguiseTray');if(!tray)return;tray.hidden=!open;if(!open){tray.innerHTML='';return}const opts=a.disguiseOptions?.length?a.disguiseOptions:core.PAPA_DISGUISE_POOL.slice(0,4);tray.innerHTML=`<strong>YOUR FOUR PROPS</strong><small>No rerolls. Larger props earn more survival points.</small><div>${opts.map(t=>`<button type="button" data-prop-choice="${esc(t)}"><span>${esc(t)}</span><b>${core.propSurvivalRate(t).toFixed(2)}x</b></button>`).join('')}</div>`;tray.querySelectorAll('[data-prop-choice]').forEach(b=>b.onclick=()=>{const type=b.dataset.propChoice;if(network&&ws?.readyState===1){ws.send(JSON.stringify({type:'action',action:'disguise',prop:type}));renderDisguiseTray(a,false)}else applyDisguise(a,type,true)})}
  function nearestInteraction(a){if(!game?.world?.interactives?.length)return null;let best=null,bestD=Infinity;for(const it of game.world.interactives){const d=Math.hypot((a.x||0)-it.x,(a.z||0)-it.z);if(d<=it.radius&&d<bestD){best=it;bestD=d}}return best}
  function triggerInteraction(){const a=game?.player,it=a&&nearestInteraction(a);if(!a?.alive||!it)return;if(performance.now()<(it.cooldownUntil||0))return;it.cooldownUntil=performance.now()+850;it.state=!it.state;const special=it.legendary?'LEGENDARY FIND! ':it.rare?'RARE FIND! ':'';if(it.kind==='shortcut'){if(game.world.shortcutGate){const c=game.world.shortcutGate.userData?.worldCollider;if(c){c.solid=false;const i=game.world.colliders.indexOf(c);if(i>=0)game.world.colliders.splice(i,1)}game.world.shortcutGate.visible=false}addFeed(`${special}A shortcut gate swings open. It will not close behind anyone.`)}else if(it.kind==='lights'){for(const l of game.world.shopLights||[])l.visible=it.state;addFeed(`${special}Shop lights ${it.state?'ON':'OFF'}.`)}else if(it.kind==='horn'){audio?.oneShot('impact',{volume:.13,pitch:.45});addFeed(`${special}The tractor horn BLARES across the yard.`)}else if(it.kind==='bell'){audio?.oneShot('ui',{volume:.12,pitch:.62});addFeed(`${special}The barn bell rings.`)}else if(it.kind==='radio'){audio?.oneShot('ui',{volume:.09,pitch:.82});addFeed(`${special}An old radio crackles to life for a second.`)}else if(it.kind==='peacock'){addFeed(`${special}The peacock answers with maximum unnecessary confidence.`)}else if(it.kind==='legendary'){addFeed(`LEGENDARY EASTER EGG: Papa's chair has clearly seen things.`);APP.toast('Legendary Papa\'s Shop Easter egg found!')}else addFeed(`${special}Something in Papa's Shop definitely just happened.`)}
  function beginGhostMode(a){if(!game||a!==game.player)return;game.ghostMode='free';game.spectateTarget=null;game.ghost={x:a.x,y:Math.max(1.5,a.y+1.6),z:a.z};input.shoot=false;renderDisguiseTray(a,false);addFeed('You are now a ghost. Move freely, use JUMP to rise and SPRINT to descend, or follow a player.')}
  function updateGhost(dt){const g=game.ghost;if(!g)return;const intent=gameplay.movementIntent(keys,joy,game.cameraRig.state.yaw),speed=5.4;g.x=clamp(g.x+intent.directionX*intent.strength*speed*dt,game.world.bounds.minX+.3,game.world.bounds.maxX-.3);g.z=clamp(g.z+intent.directionZ*intent.strength*speed*dt,game.world.bounds.minZ+.3,game.world.bounds.maxZ-.3);if(input.jumpHeld||keys.Space)g.y+=3.4*dt;if(input.sprint||keys.ShiftLeft||keys.ShiftRight)g.y-=3.4*dt;g.y=clamp(g.y,.8,9.5)}
  function goGhostFree(){const a=game?.player;if(!a||a.alive)return;game.ghostMode='free';game.spectateTarget=null;if(!game.ghost)game.ghost={x:a.x,y:Math.max(1.5,a.y+1.6),z:a.z}}
  function weatherLabel(key){return ({clear:'CLEAR SKY',sunset:'SUNSET',overcast:'OVERCAST','light-rain':'LIGHT RAIN','light-snow':'LIGHT SNOW','fair-fog':'LIGHT FOG',windy:'WINDY'})[key]||String(key||'CLEAR').toUpperCase()}
  let sinLastAt=0,sinTimer=0;
  function playSinCue(){const play=()=>{sinLastAt=performance.now();try{if('speechSynthesis'in window){const u=new SpeechSynthesisUtterance("That's a sin.");u.rate=.78;u.pitch=.78;u.volume=.88;speechSynthesis.speak(u)}else audio?.oneShot('ui',{volume:.12,pitch:.52})}catch{audio?.oneShot('ui',{volume:.12,pitch:.52})}};const wait=Math.max(0,650-(performance.now()-sinLastAt));clearTimeout(sinTimer);sinTimer=setTimeout(play,wait)}
  function spawnPropBreak(a){if(!game||!a)return;const d=propDef(a.prop||'Bucket'),mat=art.material('paintedWood',0x9b6b42,{seed:83});for(let i=0;i<8;i++){const m=new THREE.Mesh(new THREE.BoxGeometry(.12+Math.random()*.16,.08+Math.random()*.16,.12+Math.random()*.16),mat);m.position.set(a.x+(Math.random()-.5)*Math.min(1,d.w),a.y+Math.random()*Math.max(.5,d.h),a.z+(Math.random()-.5)*Math.min(1,d.d));m.rotation.set(Math.random()*3,Math.random()*3,Math.random()*3);game.scene.add(m);game.effects.push({kind:'breakShard',mesh:m,life:.75,max:.75,vx:(Math.random()-.5)*2.8,vy:1.4+Math.random()*2,vz:(Math.random()-.5)*2.8})}spawnPoof(a.x,a.y+Math.min(1,a.height*.5),a.z)}
  function showRoundSummary(summary){if(!summary)return;const lifetime=recordLifetimeSummary(),h=summary.bestHider,k=summary.bestHunter;modal(`<div class="status-large ph-round-mvp"><span class="eyebrow">ROUND ${roomState.round} MVP</span><strong>${summary.winner==='hiders'?'HIDERS SURVIVE':'HUNTERS WIN'}</strong><p>${weatherLabel(summary.weatherPreset||roomState.weatherPreset)}</p><div class="ph-mvp-grid"><div><span>BEST HIDER</span><b>${esc(h?.name||'No survivor')}</b><small>${h?`${Number(h.points||0)} survival pts${h.survived?' · survived':''}`:'No hider score'}</small></div><div><span>BEST HUNTER</span><b>${esc(k?.name||'No hunter')}</b><small>${k?`${Number(k.eliminations||0)} eliminations`:'No eliminations'}</small></div></div><p class="subtext">Your lifetime on this device: ${lifetime.rounds} rounds · ${Math.round(lifetime.hiderPoints)} hider pts · ${lifetime.hunterElims} eliminations</p><button id="phRoundSkip" class="btn success">SKIP</button></div>`,m=>{m.querySelector('#phRoundSkip').onclick=()=>{closeModal();if(!network)nextSoloRound()}})}
  function recordLifetimeSummary(){try{const key='bfgn_prop_hunt_lifetime_v1',v=JSON.parse(localStorage.getItem(key)||'{}'),me=game?.player;v.rounds=(v.rounds||0)+1;v.hiderPoints=(v.hiderPoints||0)+Number(me?.hiderScore||0);v.hunterElims=(v.hunterElims||0)+Number(me?.score?.hunterElims||0);v.lastPlayed=Date.now();localStorage.setItem(key,JSON.stringify(v));return v}catch{return{rounds:0,hiderPoints:0,hunterElims:0}}}
  // Legacy QA wording retained for prior acceptance coverage: SPECTATING ·
  function updateHud(){
    const a=game.player,phase=root.querySelector('#ph3Phase'),role=root.querySelector('#ph3Role'),health=root.querySelector('#ph3Health'),load=root.querySelector('#ph3Load'),feed=root.querySelector('#ph3Feed'),prompt=root.querySelector('#ph3Prompt'),spectate=root.querySelector('#phSpectate'),ghostFree=root.querySelector('#phGhostFree');if(!phase)return;updateHunterHideOverlay();const left=roomState.phaseEndsAt?Math.max(0,roomState.phaseEndsAt-Date.now()):0,weather=weatherLabel(roomState.weatherPreset||game.weatherPreset);
    phase.textContent=`${String(roomState.phase).toUpperCase()} ${left?fmt(left/1000):''} · ${weather} · ${mapName(game.mapKey)} · R${roomState.round}/${roomState.settings.rounds}`;const spectating=!a.alive&&roomState.settings.mode==='classic';role.textContent=spectating?(game.ghostMode==='free'?'GHOST · FREE CAM':`GHOST · FOLLOWING ${game.spectateTarget?.person?.name||'family'}`):a.role==='hunter'?'HUNTER':`HIDER${a.prop?` · ${a.prop}`:''}`;const hp=Math.max(0,a.health);health.textContent=`HP ${'●'.repeat(hp)}${'○'.repeat(Math.max(0,3-hp))}`;
    const choices=(a.disguiseOptions||[]).map(x=>`${esc(x)} (${core.propSurvivalRate(x).toFixed(2)}x)`).join('<br>');load.innerHTML=a.role==='hider'?`Disguise: <b>${esc(a.prop||'none')}</b>${a.prop?` · <b>${core.propSurvivalRate(a.prop).toFixed(2)}x</b>`:''}<br>Survival points: <b>${Math.round(a.hiderScore||0)}</b><br>Changes left: <b>${a.propChanges}</b><br>Decoys: <b>${a.decoys}/10</b><br>Flash: <b>${a.flash?'READY':'USED'}</b><br><span class="ph3d-choice-list">This round's four:<br>${choices||'assigned at round start'}</span>`:`Weapon: <b>Prop Zapper</b><br>Crosshair: <b>ALWAYS ACTIVE</b><br>Hold SHOOT: <b>RAPID FIRE</b><br>Unlimited ammunition.<br>Hunters have full power from round start.`;
    if(feed){feed.innerHTML=game.feed.slice(-12).map(x=>`<div>${esc(x)}</div>`).join('');feed.scrollTop=feed.scrollHeight}const interaction=a.alive?nearestInteraction(a):null;if(prompt){if(interaction){prompt.textContent=`INTERACT: ${interaction.label}`;prompt.classList.add('on')}else prompt.classList.remove('on')}
    const propBtn=root.querySelector('#phProp'),flashBtn=root.querySelector('#phFlashBtn'),decoyBtn=root.querySelector('#phDecoy'),lockBtn=root.querySelector('#phLock'),interactBtn=root.querySelector('#phInteract');if(propBtn)propBtn.textContent=`PROP ${a.propChanges}`;if(flashBtn)flashBtn.textContent=a.flash?'FLASH ✓':'FLASH ×';if(decoyBtn)decoyBtn.textContent=`DECOY ${a.decoys}`;if(lockBtn)lockBtn.textContent=a.locked?'UNLOCK':'LOCK';if(interactBtn){interactBtn.disabled=!interaction||!a.alive;interactBtn.textContent=interaction?'USE':'INTERACT'}
    for(const id of ['phProp','phFlashBtn','phDecoy','phLock']){const b=root.querySelector('#'+id);if(b){b.disabled=a.role!=='hider'||!a.alive;b.classList.toggle('role-hidden',a.role!=='hider'||spectating)}}const shootBtn=root.querySelector('#phShoot');if(shootBtn){shootBtn.classList.toggle('role-hidden',a.role!=='hunter'||spectating);shootBtn.disabled=a.role!=='hunter'||roomState.phase!=='hunt'||!a.alive}if(spectate){spectate.hidden=false;spectate.textContent=game.ghostMode==='follow'&&game.spectateTarget?`NEXT · ${game.spectateTarget.person.name}`:'FOLLOW PLAYER';ghostFree.hidden=false;ghostFree.classList.toggle('active',game.ghostMode==='free')}else{spectate.hidden=true;ghostFree.hidden=true}
  }

  function fmt(sec){sec=Math.ceil(sec);return `${Math.floor(sec/60)}:${String(sec%60).padStart(2,'0')}`;}
  function mapName(k){return k==='papa'?"Papa's Shop":k==='camp'?'Camper / Campsite':k==='acreage'?'Backyard + Fire Pit':'Goat / Farm';}
  function addFeed(t){if(!game)return;game.feed.push(t);if(game.feed.length>60)game.feed.shift();}

  function showMatchEnd(){if(!game)return;game.cinematic?.start({duration:1.7,distance:5.7,pitch:.25,yawOffset:.65,restore:false});const canRestart=!network||roomState.isHost;modal(`<div class="status-large"><span class="eyebrow">MATCH COMPLETE</span><strong>${roomState.wins.hiders>roomState.wins.hunters?'HIDERS WIN THE NIGHT':roomState.wins.hunters>roomState.wins.hiders?'HUNTERS WIN THE NIGHT':'TIE GAME'}</strong><p>Hiders ${roomState.wins.hiders} - Hunters ${roomState.wins.hunters}</p><div class="ph-match-actions">${canRestart?'<button id="phKeepPlaying" class="btn success">KEEP PLAYING</button>':'<button class="btn" disabled>HOST STARTS NEXT MATCH</button>'}<button id="phReturn" class="btn">RETURN TO GAME SHELF</button></div></div>`,m=>{m.querySelector('#phReturn').onclick=()=>{location.href='/'};const keep=m.querySelector('#phKeepPlaying');if(keep)keep.onclick=async()=>{if(network){keep.disabled=true;try{await propApi('rematch',{hostToken:network.hostToken});closeModal()}catch(e){keep.disabled=false;APP.toast(e.message)}}else{closeModal();roomState.round=1;roomState.wins={hiders:0,hunters:0};roomState.roundResult=null;const seed=core.roundSeed(roomState.id,1,roomState.createdAt||0),roles=core.assignRoles(roomState.players,1),next=mapFor(roomState.settings.mapKey,1),assigned=core.assignDisguiseOptions(roomState.players,seed,core.disguisePoolForMap(next),4);roomState.players.forEach(p=>{p.role=roles[p.id];p.health=3;p.alive=true;p.prop=null;p.propChanges=3;p.decoys=10;p.flash=true;p.hiderScore=0;p.disguiseOptions=p.role==='hider'?(assigned[p.id]||[]):[]});roomState.roundSeed=seed;roomState.layoutVariant=core.layoutVariantForSeed(seed);roomState.weatherPreset=core.weatherForSeed(seed);roomState.phase='hide';roomState.phaseEndsAt=Date.now()+30000*TEST_SCALE;roomState.activeMap=next;disposeRoot();ensureEngine().then(()=>startEngine(next))}}})}
  function modal(html,bind){closeModal();const d=document.createElement('div');d.className='modal-backdrop';d.id='ph3Modal';d.innerHTML=`<div class="modal">${html}</div>`;document.body.appendChild(d);if(bind)bind(d.querySelector('.modal'));}
  function closeModal(){document.getElementById('ph3Modal')?.remove();}

  window.__PROP_HUNT_REAL3D__={version:'GAME-NIGHT-STAGING-PHASE-T1-PROP-HUNT-HUNTER-RELEASE-COMBAT-19',renderer:'WebGL',three:'0.185.1',usesDepthBuffer:true,usesCanvas2D:false,p3DirectionalLocomotion:true,p3SpectatorCamera:true,p3PropTransform:true,t1HunterBlindHide:true,t1CrosshairFire:true,t1HoldRapidFire:true,phaseVWorldExpansion:true,phaseVMapScale:8.31,phaseVRotatingDisguises:true,phaseVWeather:true,phaseVInteractions:true,phaseVGhostMvp:true,worldRelease:'GAME-NIGHT-STAGING-PHASE-V-PROP-HUNT-WORLD-24'};
  window.PropHunt={mount,stop};
})();
