/*
 * Black Family Game Night - John's Birthday Seat
 * v1.5.0-polish-test
 * Landscape-first third-person family obby with eight color levels.
 */
(function(){
  'use strict';

  let root=null,canvas=null,ctx=null,state=null,raf=0,last=0;
  const keys=Object.create(null);
  const joy={x:0,z:0,id:null,active:false};
  const pointer={active:false,id:null,x:0,y:0};
  const TAU=Math.PI*2;
  const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
  const lerp=(a,b,t)=>a+(b-a)*t;
  const RISE=50;
  const PLAYER_RADIUS=22;
  const ROSTER=()=>[...window.FAMILY.people,...window.FAMILY.supports];
  const spriteCache=new Map();

  const stages=[
    {id:'green',name:'Backyard',color:'#55b96b',at:0,end:6,hazard:'Pool Water',hazardKind:'water',icon:'🌿'},
    {id:'blue',name:'Camper',color:'#4e9dd9',at:7,end:12,hazard:'Lake Water',hazardKind:'water',icon:'🏕️'},
    {id:'yellow',name:"Papa's Shop",color:'#e8bd48',at:13,end:18,hazard:'Oily Shop Floor',hazardKind:'oil',icon:'🔧'},
    {id:'orange',name:'Farmyard',color:'#df8c3d',at:19,end:24,hazard:'Pig Mud',hazardKind:'mud',icon:'🐐'},
    {id:'red',name:'Fire Pit',color:'#d9574d',at:25,end:30,hazard:'Hot Coals',hazardKind:'coal',icon:'🔥'},
    {id:'purple',name:'Family Chaos',color:'#8c65b7',at:31,end:36,hazard:"Don't Touch",hazardKind:'danger',icon:'⚡'},
    {id:'pink',name:'Birthday Party',color:'#d879a8',at:37,end:42,hazard:'Party Spill',hazardKind:'slime',icon:'🎂'},
    {id:'gold',name:'Final Climb',color:'#e3b850',at:43,end:48,hazard:'Golden Drop',hazardKind:'void',icon:'👑'}
  ];
  const stageStarts=stages.map(s=>s.at);

  const outfitSets=[
    {name:'Classic',top:'#765044',legs:'#38546c'},
    {name:'Western',top:'#9d7854',legs:'#49637b'},
    {name:'Plaid',top:'#8a4439',legs:'#38536d'},
    {name:'Sporty',top:'#5c7180',legs:'#3d4f62'},
    {name:'Winter',top:'#59656d',legs:'#3e5367'},
    {name:'Dressy',top:'#7b5b70',legs:'#414e61'}
  ];
  const dogOutfits=[
    {name:'Classic',top:'#0000',legs:'#0000'},
    {name:'Blue Bandana',top:'#557694',legs:'#0000'},
    {name:'Red Bandana',top:'#9a4c46',legs:'#0000'},
    {name:'Birthday',top:'#a57b47',legs:'#0000'}
  ];
  const setup={charId:'john',outfit:0,theme:'default'};
  const bodyThemes=[['default','Default'],['country','Country'],['rustic','Rustic'],['rich','Rich']];

  const spec=[
    // GREEN - Backyard
    {label:'START LAWN',kind:'grass',w:360,d:300,checkpoint:0},
    {label:'Deck Steps',kind:'wood',w:190,d:125},
    {label:'Picnic Table',kind:'wood',w:205,d:92},
    {label:'Trampoline',kind:'trampoline',w:145,d:145,bounce:520},
    {label:'Pool Rim',kind:'beam',w:220,d:46},
    {label:'Trailer Tires',kind:'tire',w:130,d:120},
    {label:'Garden Bridge',kind:'green',w:210,d:76,move:{axis:'z',amount:45,speed:.8,phase:.2}},
    // BLUE - Camper
    {label:'CAMPER CHECKPOINT',kind:'blue',w:240,d:160,checkpoint:1},
    {label:'Cooler Stack',kind:'cooler',w:135,d:110},
    {label:'Picnic Bench',kind:'beam',w:225,d:55},
    {label:'Awning Platform',kind:'blue',w:185,d:92,move:{axis:'x',amount:52,speed:.95,phase:1.1}},
    {label:'Bunk Ladder',kind:'ladder',w:145,d:115,climb:true},
    {label:'Camper Slide',kind:'cream',w:215,d:78,boost:true},
    // YELLOW - Papa's Shop
    {label:'SHOP CHECKPOINT',kind:'yellow',w:250,d:165,checkpoint:2},
    {label:'Parts Crates',kind:'crate',w:145,d:120},
    {label:'Workbench',kind:'wood',w:220,d:92},
    {label:'Tractor Hood',kind:'tractor',w:185,d:105},
    {label:'Shelf Ladder',kind:'ladder',w:150,d:110,climb:true},
    {label:'Moving Tool Cart',kind:'metal',w:165,d:88,move:{axis:'z',amount:65,speed:1.1,phase:.5}},
    // ORANGE - Farmyard
    {label:'FARM CHECKPOINT',kind:'orange',w:250,d:165,checkpoint:3},
    {label:'Hay Bale',kind:'hay',w:150,d:130},
    {label:'Goat Ramp',kind:'wood',w:210,d:64},
    {label:'Feed Bin',kind:'green',w:145,d:115},
    {label:'Sea Can Step',kind:'metal',w:190,d:90},
    {label:'Falling Barn Board',kind:'wood',w:210,d:60,fall:true},
    // RED - Fire Pit
    {label:'FIRE PIT CHECKPOINT',kind:'red',w:250,d:165,checkpoint:4},
    {label:'Log Ring',kind:'wood',w:150,d:125},
    {label:'BBQ Shelf',kind:'metal',w:175,d:80},
    {label:'Roasting Stick Beam',kind:'beam',w:225,d:42},
    {label:'Coal Island',kind:'red',w:140,d:120,move:{axis:'x',amount:42,speed:1.2,phase:2.1}},
    {label:'Hot Plate',kind:'metal',w:190,d:78,vanish:{on:1.5,off:.85,phase:.4}},
    // PURPLE - Family Chaos
    {label:'CHAOS CHECKPOINT',kind:'purple',w:250,d:165,checkpoint:5},
    {label:'Sliding Toolbox',kind:'metal',w:160,d:88,move:{axis:'z',amount:82,speed:1.35,phase:.8}},
    {label:'Disappearing Plank',kind:'purple',w:215,d:56,vanish:{on:1.35,off:.95,phase:1.1}},
    {label:'Pipe Crawl',kind:'pipe',w:175,d:90},
    {label:'Doorway Maze',kind:'purple',w:170,d:92},
    {label:'Falling Shelf',kind:'wood',w:205,d:72,fall:true},
    // PINK - Birthday Party
    {label:'PARTY CHECKPOINT',kind:'pink',w:250,d:165,checkpoint:6},
    {label:'Giant Present',kind:'present',w:145,d:125},
    {label:'Balloon Platform',kind:'pink',w:150,d:125,move:{axis:'x',amount:72,speed:.78,phase:2.4}},
    {label:'Cake Bounce',kind:'cake',w:150,d:135,bounce:545},
    {label:'Present Tunnel',kind:'present',w:180,d:88},
    {label:'Confetti Beam',kind:'beam',w:230,d:44,move:{axis:'z',amount:42,speed:.9,phase:.7}},
    // GOLD - Final climb
    {label:'GOLD CHECKPOINT',kind:'gold',w:250,d:165,checkpoint:7},
    {label:'Crown Steps',kind:'gold',w:145,d:115},
    {label:'Moving Trophy',kind:'gold',w:160,d:95,move:{axis:'x',amount:55,speed:1.05,phase:1.5}},
    {label:'Golden Balance Beam',kind:'beam',w:235,d:44},
    {label:'Final Present',kind:'present',w:155,d:125,move:{axis:'z',amount:38,speed:.75,phase:2.8}},
    {label:"JOHN'S BIRTHDAY SEAT",kind:'throne',w:330,d:265,goal:true}
  ];

  function routeStage(route){return stages.findIndex(s=>route>=s.at&&route<=s.end)}
  function routePos(route,radiusOverride){
    if(route===0)return{x:0,z:0,y:0};
    if(route===48)return{x:0,z:0,y:route*RISE};
    const angle=route*.72-Math.PI/2;
    let radius=radiusOverride??230;
    if(route===1)radius=150;
    if(route===47)radius=115;
    return{x:Math.cos(angle)*radius,z:Math.sin(angle)*radius,y:route*RISE};
  }
  function makePlatform(route,s,variant='main'){
    const pos=routePos(route,s.radius);
    const level=routeStage(route);
    return{
      id:`p-${route}-${variant}`,
      route,level,variant,
      x:pos.x,z:pos.z,y:pos.y,w:s.w||170,d:s.d||100,h:s.h||32,label:s.label,
      kind:s.kind||'wood',checkpoint:s.checkpoint??null,bounce:s.bounce||0,move:s.move||null,
      vanish:s.vanish||null,fall:!!s.fall,climb:!!s.climb,boost:!!s.boost,goal:!!s.goal,
      cx:pos.x,cz:pos.z,baseY:pos.y
    };
  }
  const course=spec.map((s,i)=>makePlatform(i,s));

  // Alternate routes: one wider/safer or shorter/tighter choice on selected levels.
  const alternateSpecs=[
    {route:4,rad:292,label:'Chair Route',kind:'green',w:180,d:88},
    {route:10,rad:292,label:'Cooler Route',kind:'blue',w:195,d:86},
    {route:17,rad:292,label:'Crate Ladder',kind:'yellow',w:175,d:90},
    {route:23,rad:294,label:'Goat Platform Route',kind:'orange',w:188,d:84},
    {route:34,rad:294,label:'Long Way Around',kind:'purple',w:205,d:90},
    {route:41,rad:292,label:'Gift Route',kind:'pink',w:185,d:90},
    {route:45,rad:286,label:'Wide Gold Route',kind:'gold',w:190,d:78}
  ];
  for(const a of alternateSpecs){
    const s=spec[a.route],p=makePlatform(a.route,{...s,label:a.label,kind:a.kind,w:a.w,d:a.d,radius:a.rad},'alt');
    p.checkpoint=null;p.goal=false;p.bounce=0;p.move=null;p.vanish=null;p.fall=false;p.climb=false;p.boost=false;
    course.push(p);
  }

  const hazards=stages.map((s,i)=>({
    id:`haz-${s.id}`,stage:i,label:s.hazard,kind:s.hazardKind,
    x:0,z:0,y:s.at*RISE-38,w:980,d:980,h:8,color:s.color
  }));

  const dangerPads=[
    {id:'oil-pad',stage:2,route:16,kind:'oil',label:'OIL',offset:74,w:95,d:80},
    {id:'mud-pad',stage:3,route:22,kind:'mud',label:'MUD',offset:-76,w:110,d:88},
    {id:'coal-pad',stage:4,route:28,kind:'coal',label:'HOT',offset:72,w:100,d:82},
    {id:'red-pad',stage:5,route:34,kind:'danger',label:'NOPE',offset:-80,w:105,d:84},
    {id:'spill-pad',stage:6,route:40,kind:'slime',label:'SPILL',offset:75,w:105,d:84}
  ].map(d=>{
    const p=course.find(x=>x.route===d.route&&x.variant==='main');
    const angle=d.route*.72;
    return{...d,x:p.x+Math.cos(angle)*d.offset,z:p.z+Math.sin(angle)*d.offset,y:p.y+12,h:8};
  });

  // Blockers make the purple level require going through / around structures instead of only jumping.
  const blockers=[];
  function addGate(route,color){
    const p=course.find(x=>x.route===route&&x.variant==='main');
    blockers.push(
      {id:`gate-${route}-a`,x:p.x-72,z:p.z,y:p.y+20,w:34,d:160,h:120,kind:color},
      {id:`gate-${route}-b`,x:p.x+72,z:p.z,y:p.y+20,w:34,d:160,h:120,kind:color}
    );
  }
  addGate(34,'purple');

  const spinners=[];
  {
    const p=course.find(x=>x.route===28&&x.variant==='main');
    spinners.push({id:'fire-spinner',x:p.x,z:p.z,y:p.y+90,radius:130,width:14,speed:1.65,color:'#ffb23f'});
  }

  const palette={
    grass:'#5b8b4a',wood:'#8a6645',green:'#5f8756',blue:'#4e7896',yellow:'#c6a142',orange:'#c1783d',red:'#b54f43',purple:'#77558b',pink:'#b76c91',gold:'#bc9848',
    metal:'#5f6265',crate:'#76553f',tractor:'#577149',beam:'#94724f',tire:'#43464a',cooler:'#4b7592',cream:'#b6ad98',ladder:'#92704d',hay:'#b4974b',trampoline:'#42596f',pipe:'#60666d',present:'#a8585a',cake:'#d28f98',throne:'#74352e'
  };

  function spriteSrc(p){return setup.theme&&setup.theme!=='default'?`/characters3d/themes/${setup.theme}/${p.id}.png`:`/characters3d/${p.id}.png`}
  function preloadSprite(p){
    const key=`${setup.theme}:${p.id}`;if(spriteCache.has(key))return spriteCache.get(key);
    const img=new Image();img.src=spriteSrc(p);spriteCache.set(key,img);return img;
  }
  function rosterPerson(id){return ROSTER().find(p=>p.id===id)||ROSTER()[0]}

  function mount(el){
    root=el;stop(false);ROSTER().forEach(preloadSprite);if(new URL(location.href).searchParams.get('birthdayAuto')==='1')start(rosterPerson(setup.charId));else renderCharacterChoice();
  }
  function stop(clearRoot=true){
    if(raf)cancelAnimationFrame(raf);raf=0;
    window.removeEventListener('keydown',down);window.removeEventListener('keyup',up);window.removeEventListener('resize',resize);
    document.body.classList.remove('birthday-game-active');
    state=null;joy.active=false;joy.id=null;pointer.active=false;pointer.id=null;
    if(clearRoot&&root)root.innerHTML='';
  }

  function figureCard(p,selected=false){
    return `<button class="bc-figure-choice ${selected?'selected':''}" data-bc-char="${p.id}"><div class="bc-figure-window"><img src="${spriteSrc(p)}" alt="${p.name} full-body character"></div><strong>${p.name}</strong><small>${p.dog?'Dog runner':'Family runner'}</small></button>`;
  }
  function renderCharacterChoice(){
    document.body.classList.remove('birthday-game-active');
    const selected=rosterPerson(setup.charId);
    root.innerHTML=`<div class="game-title-row"><div><span class="eyebrow">3D FAMILY OBBY</span><h1>John's Birthday Seat</h1><p class="subtext">Pick your approved full-body family character. The actual run is landscape-first with only Move + Jump on screen.</p></div><span class="pill">Human racers only · no computers</span></div><div class="bc-setup"><section class="panel panel-pad"><h2>Choose your runner</h2><div id="bcChars" class="bc-figure-grid">${ROSTER().map(p=>figureCard(p,p.id===selected.id)).join('')}</div></section><section class="panel panel-pad bc-preview-panel"><h2>Selected runner</h2><div class="bc-big-figure"><img src="${spriteSrc(selected)}" alt="${selected.name}"><div><strong>${selected.name}</strong><p class="subtext">You will see this little full-body character running and jumping in front of you.</p></div></div><button class="btn success" id="bcChoose" style="width:100%">NEXT: OUTFIT</button></section></div>`;
    root.querySelectorAll('[data-bc-char]').forEach(b=>b.onclick=()=>{setup.charId=b.dataset.bcChar;setup.outfit=0;renderCharacterChoice()});
    root.querySelector('#bcChoose').onclick=renderOutfit;
  }
  function renderOutfit(){
    const p=rosterPerson(setup.charId),sets=p.dog?dogOutfits:outfitSets;
    root.innerHTML=`<div class="game-title-row"><div><span class="eyebrow">RUNNER LOCK-IN</span><h1>${p.name}</h1><p class="subtext">Choose the full-body style and outfit accent, then turn your phone sideways for the climb.</p></div><button class="btn secondary" id="bcBack">← Back to Characters</button></div><div class="bc-setup"><section class="panel panel-pad"><div class="bc-outfit-hero"><img src="${spriteSrc(p)}" alt="${p.name}"><div><h2>${p.name}</h2><p class="subtext">Approved full-body 3D character</p></div></div><h3>3D character style</h3><div class="bc-theme-grid">${bodyThemes.map(([id,label])=>`<button class="bc-theme ${setup.theme===id?'selected':''}" data-bc-theme="${id}"><img src="${id==='default'?(p.id==='john'?'/avatars/john-black.png':`/avatars/${p.id}.png`):`/avatars/themes/${id}/${p.id}.jpg`}" alt="${p.name} ${label}"><small>${label}</small></button>`).join('')}</div><h3>Outfit options</h3><div class="bc-outfit-grid">${sets.map((o,i)=>`<button class="bc-outfit ${setup.outfit===i?'selected':''}" data-bc-outfit="${i}"><i style="--top:${o.top};--legs:${o.legs}"></i><small>${o.name}</small></button>`).join('')}</div></section><section class="panel panel-pad"><h2>Course 1 · Eight Levels</h2><div class="bc-level-preview">${stages.map((s,i)=>`<div style="--level:${s.color}"><b>${i+1}</b><span>${s.icon} ${s.name}</span><small>${s.at}-${s.end}</small></div>`).join('')}</div><div class="bc-course-promise"><b>Landscape play</b><span>Joystick + Jump only · checkpoints every color · moving/falling/disappearing obstacles · hazards · alternate routes · John’s seat at the top.</span></div><button class="btn success" id="bcStart" style="width:100%;margin-top:14px">START BIRTHDAY CLIMB</button></section></div>`;
    root.querySelector('#bcBack').onclick=renderCharacterChoice;
    root.querySelectorAll('[data-bc-theme]').forEach(b=>b.onclick=()=>{setup.theme=b.dataset.bcTheme;spriteCache.clear();renderOutfit()});
    root.querySelectorAll('[data-bc-outfit]').forEach(b=>b.onclick=()=>{setup.outfit=Number(b.dataset.bcOutfit);renderOutfit()});
    root.querySelector('#bcStart').onclick=()=>start(p);
  }

  function actor(person){
    return{person,x:0,z:0,y:34,vy:0,height:person.dog?68:105,grounded:true,progress:0,checkpoint:0,move:0,outfit:setup.outfit,supportId:'p-0-main',boost:null,done:false,finishTime:0,face:1};
  }
  function start(p){
    document.body.classList.add('birthday-game-active');
    state={player:actor(p),courseTime:0,elapsed:0,start:performance.now(),running:true,camera:{yaw:Math.atan2(routePos(1).x,routePos(1).z),pitch:.17,distance:430},falls:new Map(),currentStage:0,confetti:[]};
    renderGame();bindControls();resize();last=performance.now();raf=requestAnimationFrame(loop);
  }

  function renderGame(){
    root.innerHTML=`<div class="bc-immersive"><div class="bc-stage"><canvas id="bcCanvas" class="bc-canvas"></canvas><div class="bc-hud"><button type="button" class="bc-exit" id="bcExit" aria-label="Leave Birthday Seat">‹</button><div class="bc-level-chip" id="bcLevel">GREEN · BACKYARD</div><div class="bc-goal-chip" id="bcGoal">👑 JOHN'S SEAT · LEVEL 8</div></div><div class="bc-progress"><i id="bcProgressBar"></i></div><div class="bc-controls"><div class="bc-joy" id="bcJoy" aria-label="Move joystick"><div class="bc-stick" id="bcStick"></div></div><button type="button" class="bc-act jump" id="bcJump">JUMP</button></div><div class="bc-landscape-prompt"><div>↻</div><strong>Turn your phone sideways</strong><span>The obby fills the screen in landscape.</span></div><div class="bc-tip" id="bcTip">Move with the joystick · tap JUMP · swipe the course to look around</div></div></div>`;
    canvas=root.querySelector('#bcCanvas');ctx=canvas.getContext('2d');root.querySelector('#bcExit').onclick=()=>{stop(false);renderCharacterChoice()};
  }

  function resize(){
    if(!canvas)return;const r=canvas.getBoundingClientRect(),dpr=Math.min(2,window.devicePixelRatio||1);canvas.width=Math.max(2,Math.round(r.width*dpr));canvas.height=Math.max(2,Math.round(r.height*dpr));canvas._w=r.width;canvas._h=r.height;ctx.setTransform(dpr,0,0,dpr,0,0);
  }
  function bindControls(){
    window.addEventListener('keydown',down);window.addEventListener('keyup',up);window.addEventListener('resize',resize);
    const j=root.querySelector('#bcJoy'),stick=root.querySelector('#bcStick'),jump=root.querySelector('#bcJump');
    const updateJoy=e=>{const r=j.getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height/2,dx=e.clientX-cx,dy=e.clientY-cy,max=r.width*.31,l=Math.hypot(dx,dy)||1,k=Math.min(1,max/l);joy.x=dx/max*k;joy.z=-dy/max*k;stick.style.transform=`translate(${dx*k}px,${dy*k}px)`};
    j.addEventListener('pointerdown',e=>{joy.active=true;joy.id=e.pointerId;j.setPointerCapture(e.pointerId);updateJoy(e)});
    j.addEventListener('pointermove',e=>{if(joy.active&&e.pointerId===joy.id)updateJoy(e)});
    const endJoy=e=>{if(e.pointerId!==joy.id)return;joy.active=false;joy.id=null;joy.x=joy.z=0;stick.style.transform='translate(0,0)'};
    j.addEventListener('pointerup',endJoy);j.addEventListener('pointercancel',endJoy);
    jump.addEventListener('pointerdown',e=>{e.preventDefault();jumpActor(state?.player)});
    canvas.addEventListener('pointerdown',e=>{pointer.active=true;pointer.id=e.pointerId;pointer.x=e.clientX;pointer.y=e.clientY;canvas.setPointerCapture(e.pointerId)});
    canvas.addEventListener('pointermove',e=>{if(!pointer.active||e.pointerId!==pointer.id||!state)return;const dx=e.clientX-pointer.x,dy=e.clientY-pointer.y;pointer.x=e.clientX;pointer.y=e.clientY;state.camera.yaw-=dx*.007;state.camera.pitch=clamp(state.camera.pitch-dy*.004,-.05,.42)});
    const endPointer=e=>{if(e.pointerId===pointer.id){pointer.active=false;pointer.id=null}};
    canvas.addEventListener('pointerup',endPointer);canvas.addEventListener('pointercancel',endPointer);
  }
  function down(e){keys[e.code]=true;if(e.code==='Space'){e.preventDefault();jumpActor(state?.player)}}
  function up(e){keys[e.code]=false}

  function stageIndexForProgress(progress){return clamp(routeStage(progress),0,stages.length-1)}
  function topOf(p){return effective(p).y+p.h}
  function platformActive(p){
    if(!p.vanish||!state)return true;
    const cycle=p.vanish.on+p.vanish.off,t=(state.courseTime+(p.vanish.phase||0))%cycle;
    return t<p.vanish.on;
  }
  function effective(p){
    let x=p.x,z=p.z,y=p.baseY;
    if(state&&p.move){const v=Math.sin(state.courseTime*p.move.speed+(p.move.phase||0))*p.move.amount;if(p.move.axis==='x')x+=v;else if(p.move.axis==='z')z+=v;else y+=v}
    if(state&&p.fall&&state.falls.has(p.id)){
      const age=state.courseTime-state.falls.get(p.id),delay=.65;
      if(age>delay&&age<2.25)y-=Math.min(185,(age-delay)*150);
      if(age>=2.25)state.falls.delete(p.id);
    }
    return{...p,x,z,y,cx:x,cz:z};
  }
  function allPlatformsAtRoute(route){return course.filter(p=>p.route===route&&platformActive(p))}
  function nearestNext(a){
    const route=Math.min(48,a.progress+1),opts=allPlatformsAtRoute(route);if(!opts.length)return course.find(p=>p.route===route);
    return opts.reduce((best,p)=>{const e=effective(p),d=Math.hypot(e.x-a.x,e.z-a.z);return !best||d<best.d?{p,d}:best},null).p;
  }
  function within(a,p,pad=0){const e=effective(p);return Math.abs(a.x-e.x)<=e.w/2+pad&&Math.abs(a.z-e.z)<=e.d/2+pad}
  function touchingHazard(a,h){return Math.abs(a.x-h.x)<=h.w/2&&Math.abs(a.z-h.z)<=h.d/2&&a.y<=h.y+h.h+12&&a.y>=h.y-42}
  function touchingPad(a,h){return Math.abs(a.x-h.x)<=h.w/2+PLAYER_RADIUS&&Math.abs(a.z-h.z)<=h.d/2+PLAYER_RADIUS&&a.y<=h.y+h.h+25&&a.y>=h.y-34}
  function hitSpinner(a,s){
    if(Math.abs((a.y+a.height*.35)-s.y)>55)return false;
    const ang=state.courseTime*s.speed,ex=Math.cos(ang)*s.radius,ez=Math.sin(ang)*s.radius;
    const x1=s.x-ex,z1=s.z-ez,x2=s.x+ex,z2=s.z+ez;
    const vx=x2-x1,vz=z2-z1,wx=a.x-x1,wz=a.z-z1,t=clamp((wx*vx+wz*vz)/(vx*vx+vz*vz),0,1),px=x1+vx*t,pz=z1+vz*t;
    return Math.hypot(a.x-px,a.z-pz)<s.width+PLAYER_RADIUS;
  }

  function collisionBoxes(){return [...course.filter(platformActive),...blockers]}
  function moveActor(a,dx,dz){
    if(a.boost){dx+=a.boost.vx;dz+=a.boost.vz}
    let nx=a.x+dx,nz=a.z+dz;
    const boxes=collisionBoxes();
    for(const raw of boxes){
      const p=raw.route!=null?effective(raw):raw;
      if(raw.climb)continue;
      const top=p.y+(p.h||0);
      if(a.y>=top-12)continue;
      const hx=(p.w||0)/2+PLAYER_RADIUS,hz=(p.d||0)/2+PLAYER_RADIUS;
      if(Math.abs(nx-p.x)<hx&&Math.abs(a.z-p.z)<hz)nx=a.x;
      if(Math.abs(nx-p.x)<hx&&Math.abs(nz-p.z)<hz)nz=a.z;
    }
    a.x=nx;a.z=nz;
  }
  function jumpActor(a,power=455){if(!a||!state?.running)return;if(a.grounded){a.vy=power;a.grounded=false;a.supportId=null}}
  function climbAssist(a,moveLen,dt){
    if(moveLen<.12)return false;
    const next=nearestNext(a);if(!next?.climb)return false;
    const p=effective(next),dist=Math.hypot(a.x-p.x,a.z-p.z);
    if(dist<Math.max(p.w,p.d)*.7&&a.y<p.y+p.h-2&&a.y>p.y-100){a.y+=138*dt;a.vy=70;a.grounded=false;return true}
    return false;
  }
  function landingPlatform(a,prevY){
    if(a.vy>0)return null;let best=null,bestTop=-Infinity;
    for(const p of course){
      if(!platformActive(p)||p.level<a.checkpoint)continue;const e=effective(p),top=e.y+e.h;
      if(Math.abs(a.x-e.x)>e.w/2+PLAYER_RADIUS*.45||Math.abs(a.z-e.z)>e.d/2+PLAYER_RADIUS*.45)continue;
      if(prevY>=top-8&&a.y<=top+7&&top>bestTop){best=p;bestTop=top}
    }
    return best;
  }
  function onLand(a,p){
    const e=effective(p);a.supportId=p.id;
    if(p.route>a.progress)a.progress=p.route;
    if(p.checkpoint!=null&&p.checkpoint>=a.checkpoint)a.checkpoint=p.checkpoint;
    if(p.fall&&!state.falls.has(p.id))state.falls.set(p.id,state.courseTime);
    if(p.bounce){a.vy=p.bounce;a.grounded=false;a.supportId=null}
    if(p.boost){
      const next=allPlatformsAtRoute(Math.min(48,p.route+1))[0];if(next){const n=effective(next),dx=n.x-e.x,dz=n.z-e.z,l=Math.hypot(dx,dz)||1;a.boost={vx:dx/l*8,vz:dz/l*8,time:.85};a.vy=Math.max(a.vy,140);a.grounded=false}
    }
    if(p.goal&&!a.done){a.done=true;a.finishTime=(performance.now()-state.start)/1000;finishPlayer()}
  }
  function integrate(a,dt){
    if(a.boost){a.boost.time-=dt;if(a.boost.time<=0)a.boost=null}
    const prevY=a.y;a.vy-=980*dt;a.y+=a.vy*dt;
    const land=landingPlatform(a,prevY);
    if(land){const top=topOf(land);a.y=top;if(a.vy<0)a.vy=0;a.grounded=true;onLand(a,land)}else a.grounded=false;
    const stage=stageIndexForProgress(a.progress),haz=hazards[stage];
    if(touchingHazard(a,haz)||dangerPads.some(h=>h.stage===stage&&touchingPad(a,h))||spinners.some(s=>hitSpinner(a,s))||a.y<haz.y-70)respawn(a);
  }
  function respawn(a){
    const route=stageStarts[Math.max(0,a.checkpoint)]||0,p=course.find(x=>x.route===route&&x.variant==='main'),e=effective(p);
    a.x=e.x;a.z=e.z;a.y=e.y+e.h+2;a.vy=0;a.progress=route;a.grounded=true;a.supportId=p.id;a.boost=null;
    flashTip(`Checkpoint ${a.checkpoint+1}: ${stages[a.checkpoint].name}`);
  }
  function updatePlayer(dt){
    const a=state.player;
    let ix=(keys.KeyD||keys.ArrowRight?1:0)-(keys.KeyA||keys.ArrowLeft?1:0),iz=(keys.KeyW||keys.ArrowUp?1:0)-(keys.KeyS||keys.ArrowDown?1:0);
    if(joy.active){ix+=joy.x;iz+=joy.z}
    let l=Math.hypot(ix,iz);if(l>1){ix/=l;iz/=l;l=1}
    const speed=185,sy=Math.sin(state.camera.yaw),cy=Math.cos(state.camera.yaw),dx=(ix*cy+iz*sy)*speed*dt,dz=(iz*cy-ix*sy)*speed*dt;
    a.move=l*speed;
    if(l>.05)a.face=dx>=0?1:-1;
    moveActor(a,dx,dz);
    climbAssist(a,l,dt);
    integrate(a,dt);
    if(l>.15&&!pointer.active){const desired=Math.atan2(ix*cy+iz*sy,iz*cy-ix*sy);let delta=((desired-state.camera.yaw+Math.PI)%TAU)-Math.PI;state.camera.yaw+=delta*dt*.45}
  }
  function update(dt){if(!state?.running)return;state.courseTime+=dt;state.elapsed=(performance.now()-state.start)/1000;updatePlayer(dt);state.currentStage=stageIndexForProgress(state.player.progress);updateHud()}

  function camera(){
    const a=state.player,dist=state.camera.distance,cy=Math.cos(state.camera.pitch),sy=Math.sin(state.camera.pitch);
    return{x:a.x-Math.sin(state.camera.yaw)*dist*cy,y:a.y+125+dist*sy,z:a.z-Math.cos(state.camera.yaw)*dist*cy,yaw:state.camera.yaw,pitch:state.camera.pitch};
  }
  function project(p,c,W,H){
    const dx=p.x-c.x,dy=p.y-c.y,dz=p.z-c.z,sy=Math.sin(c.yaw),cy=Math.cos(c.yaw),x=dx*cy-dz*sy,z=dx*sy+dz*cy,sp=Math.sin(c.pitch),cp=Math.cos(c.pitch),y=dy*cp-z*sp,zz=dy*sp+z*cp;
    if(zz<25)return null;const f=Math.min(W,H)*1.26/zz;return{x:W/2+x*f,y:H*.59-y*f,z:zz,s:f};
  }
  function shade(hex,n){let v=parseInt(hex.slice(1),16),r=v>>16,g=v>>8&255,b=v&255;r=clamp(r+n,0,255);g=clamp(g+n,0,255);b=clamp(b+n,0,255);return`rgb(${r},${g},${b})`}
  function poly(ps,fill=true){ctx.beginPath();ctx.moveTo(ps[0].x,ps[0].y);for(let i=1;i<ps.length;i++)ctx.lineTo(ps[i].x,ps[i].y);ctx.closePath();fill?ctx.fill():ctx.stroke()}

  function drawBox(raw,c,W,H,isTarget=false){
    if(!platformActive(raw))return;const p=effective(raw),x0=p.x-p.w/2,x1=p.x+p.w/2,z0=p.z-p.d/2,z1=p.z+p.d/2,y0=p.y,y1=p.y+p.h;
    const pts=[{x:x0,y:y0,z:z0},{x:x1,y:y0,z:z0},{x:x1,y:y0,z:z1},{x:x0,y:y0,z:z1},{x:x0,y:y1,z:z0},{x:x1,y:y1,z:z0},{x:x1,y:y1,z:z1},{x:x0,y:y1,z:z1}].map(q=>project(q,c,W,H));
    if(pts.some(q=>!q))return;const base=palette[p.kind]||stages[p.level]?.color||palette.wood;
    for(const [ids,off] of [[[4,5,6,7],18],[[0,1,5,4],-10],[[1,2,6,5],-26],[[2,3,7,6],-38],[[3,0,4,7],-18]]){ctx.fillStyle=shade(base,off);poly(ids.map(i=>pts[i]),true);ctx.strokeStyle='#23170e99';ctx.lineWidth=1;ctx.stroke()}
    if(p.kind==='trampoline'){ctx.strokeStyle='#e6edf6';ctx.lineWidth=3;poly([pts[4],pts[5],pts[6],pts[7]],false);ctx.strokeStyle='#2e3944';ctx.lineWidth=6;poly([pts[4],pts[5],pts[6],pts[7]],false)}
    if(p.kind==='ladder'){ctx.save();ctx.strokeStyle='#f0d1a2';ctx.lineWidth=2;for(let i=0;i<5;i++){const t=(i+1)/6,x=lerp(pts[0].x,pts[4].x,t),y=lerp(pts[0].y,pts[4].y,t),x2=lerp(pts[1].x,pts[5].x,t),y2=lerp(pts[1].y,pts[5].y,t);ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x2,y2);ctx.stroke()}ctx.restore()}
    if(p.kind==='tire'){const q=project({x:p.x,y:p.y+p.h+18,z:p.z},c,W,H);if(q){ctx.save();ctx.strokeStyle='#222';ctx.lineWidth=Math.max(4,18*q.s);ctx.beginPath();ctx.arc(q.x,q.y,Math.max(8,25*q.s),0,TAU);ctx.stroke();ctx.restore()}}
    if(p.kind==='present'){ctx.save();ctx.strokeStyle='#f5d08b';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(pts[4].x,pts[4].y);ctx.lineTo(pts[6].x,pts[6].y);ctx.moveTo(pts[5].x,pts[5].y);ctx.lineTo(pts[7].x,pts[7].y);ctx.stroke();ctx.restore()}
    if(isTarget){ctx.save();ctx.strokeStyle='#fff08c';ctx.shadowColor='#ffd14d';ctx.shadowBlur=20;ctx.lineWidth=4;poly([pts[4],pts[5],pts[6],pts[7]],false);ctx.restore()}
    if(p.checkpoint!=null)drawCheckpoint(p,c,W,H);
    if(p.goal)drawThrone(p,c,W,H);
  }
  function drawCheckpoint(p,c,W,H){
    const q=project({x:p.x,y:p.y+p.h+76,z:p.z},c,W,H);if(!q)return;ctx.save();ctx.font=`900 ${clamp(22*q.s,13,25)}px system-ui`;ctx.textAlign='center';ctx.fillStyle=stages[p.checkpoint].color;ctx.shadowColor='#000';ctx.shadowBlur=5;ctx.fillText(`◆ LEVEL ${p.checkpoint+1}`,q.x,q.y);ctx.restore();
  }
  function drawThrone(p,c,W,H){
    const base=project({x:p.x,y:p.y+p.h+10,z:p.z},c,W,H),top=project({x:p.x,y:p.y+p.h+180,z:p.z},c,W,H);if(!base||!top)return;const h=Math.abs(base.y-top.y),w=Math.max(60,h*.78);ctx.save();ctx.fillStyle='#6f302d';ctx.strokeStyle='#efc764';ctx.lineWidth=4;ctx.beginPath();ctx.roundRect(base.x-w/2,top.y,w,h*.75,18);ctx.fill();ctx.stroke();ctx.fillStyle='#f4c85e';ctx.font=`900 ${Math.max(26,h*.24)}px serif`;ctx.textAlign='center';ctx.fillText('👑',base.x,top.y+h*.29);ctx.font=`900 ${Math.max(10,h*.085)}px system-ui`;ctx.fillText("JOHN'S SEAT",base.x,top.y+h*.52);ctx.restore();
  }
  function drawHazard(h,c,W,H){
    const x0=h.x-h.w/2,x1=h.x+h.w/2,z0=h.z-h.d/2,z1=h.z+h.d/2,ps=[{x:x0,y:h.y,z:z0},{x:x1,y:h.y,z:z0},{x:x1,y:h.y,z:z1},{x:x0,y:h.y,z:z1}].map(q=>project(q,c,W,H));if(ps.some(q=>!q))return;
    const colors={water:'#2f7ca2',oil:'#2e2d2a',mud:'#704d35',coal:'#9b302a',danger:'#b82735',slime:'#b76391',void:'#7a5e28'};ctx.save();ctx.globalAlpha=.65;ctx.fillStyle=colors[h.kind]||h.color;poly(ps,true);ctx.globalAlpha=.9;ctx.strokeStyle=h.color;ctx.lineWidth=2;poly(ps,false);ctx.restore();
  }
  function drawPad(h,c,W,H){
    const ps=[{x:h.x-h.w/2,y:h.y,z:h.z-h.d/2},{x:h.x+h.w/2,y:h.y,z:h.z-h.d/2},{x:h.x+h.w/2,y:h.y,z:h.z+h.d/2},{x:h.x-h.w/2,y:h.y,z:h.z+h.d/2}].map(q=>project(q,c,W,H));if(ps.some(q=>!q))return;ctx.save();ctx.fillStyle=h.kind==='coal'?'#ef5b2a':h.kind==='mud'?'#6e4a32':h.kind==='oil'?'#191a18':h.kind==='slime'?'#c35a93':'#c92d3b';ctx.globalAlpha=.82;poly(ps,true);ctx.strokeStyle='#ffd965';ctx.lineWidth=2;poly(ps,false);ctx.restore();
  }
  function drawBlocker(b,c,W,H){drawSimpleBox(b,c,W,H,palette[b.kind]||'#77558b')}
  function drawSimpleBox(p,c,W,H,color){
    const x0=p.x-p.w/2,x1=p.x+p.w/2,z0=p.z-p.d/2,z1=p.z+p.d/2,y0=p.y,y1=p.y+p.h,pts=[{x:x0,y:y0,z:z0},{x:x1,y:y0,z:z0},{x:x1,y:y0,z:z1},{x:x0,y:y0,z:z1},{x:x0,y:y1,z:z0},{x:x1,y:y1,z:z0},{x:x1,y:y1,z:z1},{x:x0,y:y1,z:z1}].map(q=>project(q,c,W,H));if(pts.some(q=>!q))return;ctx.fillStyle=color;poly([pts[4],pts[5],pts[6],pts[7]],true);ctx.fillStyle=shade(color,-24);poly([pts[1],pts[2],pts[6],pts[5]],true);ctx.fillStyle=shade(color,-12);poly([pts[0],pts[1],pts[5],pts[4]],true)
  }
  function drawSpinner(s,c,W,H){
    const a=state.courseTime*s.speed,ex=Math.cos(a)*s.radius,ez=Math.sin(a)*s.radius,p1=project({x:s.x-ex,y:s.y,z:s.z-ez},c,W,H),p2=project({x:s.x+ex,y:s.y,z:s.z+ez},c,W,H),center=project({x:s.x,y:s.y,z:s.z},c,W,H);if(!p1||!p2||!center)return;ctx.save();ctx.strokeStyle=s.color;ctx.shadowColor=s.color;ctx.shadowBlur=10;ctx.lineWidth=clamp(15*center.s,5,16);ctx.beginPath();ctx.moveTo(p1.x,p1.y);ctx.lineTo(p2.x,p2.y);ctx.stroke();ctx.restore();
  }
  function drawActor(a,c,W,H){
    const feet=project({x:a.x,y:a.y,z:a.z},c,W,H),head=project({x:a.x,y:a.y+a.height,z:a.z},c,W,H);if(!feet||!head)return;const h=clamp(Math.abs(feet.y-head.y),a.person.dog?70:115,205),img=preloadSprite(a.person),ratio=(img.naturalWidth&&img.naturalHeight)?img.naturalWidth/img.naturalHeight:(a.person.dog?.9:.52),w=h*ratio,bob=a.grounded&&a.move>8?Math.sin(state.courseTime*12)*3:0,x=feet.x-w/2,y=feet.y-h+bob;ctx.save();ctx.fillStyle='#0007';ctx.beginPath();ctx.ellipse(feet.x,feet.y+5,Math.max(13,w*.34),Math.max(4,h*.045),0,0,TAU);ctx.fill();if(img.complete&&img.naturalWidth){if(a.face<0){ctx.translate(feet.x*2,0);ctx.scale(-1,1);ctx.drawImage(img,x,y,w,h)}else ctx.drawImage(img,x,y,w,h);const sets=a.person.dog?dogOutfits:outfitSets,o=sets[a.outfit%sets.length];if(o&&a.outfit>0){ctx.globalCompositeOperation='source-atop';ctx.globalAlpha=.13;ctx.fillStyle=o.top;ctx.fillRect(x,y+h*.25,w,h*.35);ctx.fillStyle=o.legs;ctx.fillRect(x,y+h*.58,w,h*.32);ctx.globalCompositeOperation='source-over';ctx.globalAlpha=1}}ctx.restore();
  }
  function drawGoalBeacon(c,W,H){
    const goal=effective(course.find(p=>p.goal)),q=project({x:goal.x,y:goal.y+340,z:goal.z},c,W,H);if(!q)return;ctx.save();ctx.globalAlpha=.45;ctx.strokeStyle='#ffd65a';ctx.lineWidth=3;ctx.shadowColor='#ffcc48';ctx.shadowBlur=16;ctx.beginPath();ctx.moveTo(q.x,q.y);ctx.lineTo(q.x,Math.max(0,q.y-180));ctx.stroke();ctx.restore();
  }
  function drawWorld(){
    const W=canvas._w,H=canvas._h,c=camera(),stage=stages[state.currentStage];
    const g=ctx.createLinearGradient(0,0,0,H);g.addColorStop(0,shade(stage.color,-55));g.addColorStop(.45,'#45615a');g.addColorStop(1,'#201d18');ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
    drawMountains(W,H,stage.color);drawGoalBeacon(c,W,H);
    drawHazard(hazards[state.currentStage],c,W,H);
    for(const h of dangerPads)if(Math.abs(h.stage-state.currentStage)<=1)drawPad(h,c,W,H);
    const nextRoute=Math.min(48,state.player.progress+1),items=[];
    for(const p of course){const e=effective(p),q=project({x:e.x,y:e.y,z:e.z},c,W,H);if(q&&Math.abs(p.level-state.currentStage)<=2)items.push({d:q.z,fn:()=>drawBox(p,c,W,H,p.route===nextRoute)})}
    for(const b of blockers){const q=project({x:b.x,y:b.y,z:b.z},c,W,H);if(q)items.push({d:q.z,fn:()=>drawBlocker(b,c,W,H)})}
    for(const s of spinners){const q=project({x:s.x,y:s.y,z:s.z},c,W,H);if(q)items.push({d:q.z,fn:()=>drawSpinner(s,c,W,H)})}
    items.push({d:0,fn:()=>drawActor(state.player,c,W,H)});items.sort((a,b)=>b.d-a.d).forEach(i=>i.fn());
  }
  function drawMountains(W,H,color){
    ctx.save();ctx.globalAlpha=.45;ctx.fillStyle=shade(color,-70);ctx.beginPath();ctx.moveTo(0,H*.57);for(let i=0;i<=12;i++){const x=i*W/12,y=H*(.34+((i*37)%5)*.025);ctx.lineTo(x,y)}ctx.lineTo(W,H*.78);ctx.lineTo(0,H*.78);ctx.closePath();ctx.fill();ctx.restore();
  }

  function updateHud(){
    if(!root||!state)return;const stage=stages[state.currentStage],progress=Math.round(state.player.progress/48*100);
    root.querySelector('#bcLevel').textContent=`${stage.id.toUpperCase()} · ${stage.name.toUpperCase()} · ${state.currentStage+1}/8`;
    root.querySelector('#bcLevel').style.borderColor=stage.color;root.querySelector('#bcProgressBar').style.width=`${progress}%`;root.querySelector('#bcProgressBar').style.background=stage.color;
  }
  function flashTip(text){const el=root?.querySelector('#bcTip');if(!el)return;el.textContent=text;el.classList.add('show');clearTimeout(el._t);el._t=setTimeout(()=>el.classList.remove('show'),1400)}
  function finishPlayer(){
    state.running=false;if(raf)cancelAnimationFrame(raf);raf=0;
    const p=state.player;root.querySelector('.bc-stage').insertAdjacentHTML('beforeend',`<div class="bc-win-overlay"><div class="bc-confetti" aria-hidden="true">${Array.from({length:26},(_,i)=>`<i style="--i:${i};left:${(i*37)%100}%"></i>`).join('')}</div><div class="bc-throne-win"><img src="${spriteSrc(p.person)}" alt="${p.person.name}"><span>👑</span></div><h2>${p.person.name} claimed John's Birthday Seat!</h2><p>Crown on. Confetti everywhere. Time: ${p.finishTime.toFixed(1)} seconds.</p><button class="btn success" id="bcAgain">RACE AGAIN</button></div>`);
    root.querySelector('#bcAgain').onclick=()=>{stop(false);renderCharacterChoice()};
  }
  function loop(t){if(!state?.running)return;const dt=Math.min(.035,(t-last)/1000||.016);last=t;update(dt);drawWorld();raf=requestAnimationFrame(loop)}

  window.BirthdayClimb={mount};
  window.__BIRTHDAY_CLIMB_TEST__={course,stages,hazards,dangerPads,features:{thirdPerson:true,fullBodySprites:true,eightLevels:true,landscapeOnly:true,joystick:true,jumpOnly:true,bots:false,checkpoints:true,movingPlatforms:true,fallingPlatforms:true,disappearingPlatforms:true,alternateRoutes:true,hazards:true,climbing:true,bounce:true,visibleGoal:true}};
})();
