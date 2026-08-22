/*
 * Black Family Game Night - John's Birthday Seat
 * v1.2.3-launch
 * Third-person software-3D family obby / platform race.
 */
(function(){
  'use strict';
  let root=null,canvas=null,ctx=null,state=null,raf=0,last=0;
  const keys=Object.create(null),joy={x:0,z:0,id:null,active:false},pointer={active:false,id:null,x:0,y:0};
  const TAU=Math.PI*2,clamp=(v,a,b)=>Math.max(a,Math.min(b,v)),rand=(a,b)=>a+Math.random()*(b-a);
  const ROSTER=()=>[...window.FAMILY.people,...window.FAMILY.supports];
  const spriteCache=new Map();
  const TEST_SCALE=new URL(location.href).searchParams.get('test')==='1'?.05:1;
  const stages=[
    {name:'Start Deck',at:0,icon:'🏁'},
    {name:"Papa's Shop",at:1,icon:'🔧'},
    {name:'Campsite',at:8,icon:'🏕️'},
    {name:'Farmyard',at:15,icon:'🐐'},
    {name:'Birthday Chaos',at:23,icon:'🎂'},
    {name:"John's Birthday Seat",at:32,icon:'👑'}
  ];
  const outfitSets=[
    {name:'Casual',top:'#765044',legs:'#38546c'},
    {name:'Western',top:'#9d7854',legs:'#49637b'},
    {name:'Plaid',top:'#8a4439',legs:'#38536d'},
    {name:'Sporty',top:'#5c7180',legs:'#3d4f62'},
    {name:'Winter',top:'#59656d',legs:'#3e5367'},
    {name:'Dressy',top:'#7b5b70',legs:'#414e61'}
  ];
  const setup={charId:'john',outfit:0,count:6,botConfigs:[]};

  function P(i,x,z,y,w,d,h,label,kind='wood',opt={}){return{route:i,x,z,y,w,d,h,label,kind,checkpoint:opt.checkpoint??null,bounce:opt.bounce||0,move:opt.move||null,goal:!!opt.goal,cx:x,cz:z}}
  const course=[
    P(0,0,0,0,430,390,34,'START DECK','start',{checkpoint:0}),
    // Papa's Shop
    P(1,190,-80,54,170,125,28,'Parts Crates','crate'),
    P(2,380,25,112,210,100,30,'Workbench','wood'),
    P(3,555,-65,168,115,115,30,'Tool Chest','metal'),
    P(4,700,70,225,185,100,30,'Tractor Hood','green'),
    P(5,835,-50,282,105,105,28,'Tire Stack','dark'),
    P(6,975,65,340,175,95,30,'Lumber Stack','wood'),
    P(7,1115,-35,400,210,105,30,'Shop Shelf','metal',{checkpoint:1}),
    // Campsite
    P(8,1245,90,458,120,120,28,'Cooler','blue'),
    P(9,1375,-30,515,210,105,30,'Picnic Bench','wood'),
    P(10,1490,110,570,105,105,28,'Camp Bin','green'),
    P(11,1605,-5,627,170,90,28,'Camper Step','cream'),
    P(12,1715,125,687,120,120,28,'Camper Roof Box','cream'),
    P(13,1835,5,746,185,86,28,'Log Bridge','wood'),
    P(14,1955,125,805,210,110,30,'Awning Deck','blue',{checkpoint:2}),
    // Farmyard
    P(15,2070,5,862,130,130,32,'Hay Bale','gold'),
    P(16,2190,115,920,160,95,30,'Feed Bin','green'),
    P(17,2310,-5,978,105,105,28,'Goat Step','wood'),
    P(18,2425,110,1037,190,90,28,'Goat Ramp','wood'),
    P(19,2535,-10,1095,110,110,28,'Water Trough','blue'),
    P(20,2645,105,1155,185,95,30,'Sea Can Step','green'),
    P(21,2760,-10,1214,120,120,28,'Hay Stack','gold'),
    P(22,2885,105,1274,220,110,32,'Sea Can Roof','green',{checkpoint:3}),
    // Birthday chaos
    P(23,2990,-20,1335,120,120,28,'Present #1','red'),
    P(24,3105,105,1395,125,125,28,'Present #2','purple',{move:{axis:'z',amount:65,speed:1.05,phase:.3}}),
    P(25,3225,-10,1455,150,90,28,'Birthday Table','pink'),
    P(26,3345,115,1515,120,120,28,'Cake Bounce','cake',{bounce:465}),
    P(27,3465,0,1590,115,115,28,'Moving Gift','red',{move:{axis:'z',amount:80,speed:1.3,phase:1.1}}),
    P(28,3585,120,1650,170,95,28,'Balloon Platform','purple',{move:{axis:'x',amount:55,speed:.85,phase:2}}),
    P(29,3700,5,1710,110,110,28,'Birthday Cooler','blue'),
    P(30,3820,110,1770,200,95,30,'Final Banner','gold',{checkpoint:4}),
    P(31,3940,-10,1830,120,120,28,'Crown Step','gold'),
    P(32,4065,80,1890,310,240,42,"JOHN'S BIRTHDAY SEAT",'throne',{checkpoint:5,goal:true})
  ];
  const palette={start:'#5f4a34',wood:'#876443',crate:'#76533b',metal:'#55575b',green:'#60764b',dark:'#44464a',blue:'#4e7690',cream:'#b5aa91',gold:'#ae8c47',red:'#a55146',purple:'#76527b',pink:'#a96878',cake:'#d2918f',throne:'#71382e'};

  function spriteSrc(p){return `/characters3d/${p.id}.png`}
  function preloadSprite(p){if(spriteCache.has(p.id))return spriteCache.get(p.id);const img=new Image();img.src=spriteSrc(p);spriteCache.set(p.id,img);return img}
  function rosterPerson(id){return ROSTER().find(p=>p.id===id)||ROSTER()[0]}
  function mount(el){root=el;stop();ROSTER().forEach(preloadSprite);renderCharacterChoice()}
  function stop(){if(raf)cancelAnimationFrame(raf);raf=0;window.removeEventListener('keydown',down);window.removeEventListener('keyup',up);window.removeEventListener('resize',resize);state=null}

  function figureCard(p,selected=false){return `<button class="bc-figure-choice ${selected?'selected':''}" data-bc-char="${p.id}"><div class="bc-figure-window"><img src="${spriteSrc(p)}" alt="${p.name} full-body character"></div><strong>${p.name}</strong><small>${p.dog?'Dog runner':'Family runner'}</small></button>`}
  function ensureBots(count,humanId){const need=Math.max(0,count-1),pool=ROSTER().filter(p=>p.id!==humanId);while(setup.botConfigs.length<need){const p=pool[setup.botConfigs.length%pool.length];setup.botConfigs.push({charId:p.id,difficulty:'medium'})}setup.botConfigs.length=need}
  function renderCharacterChoice(){
    const selected=rosterPerson(setup.charId);root.innerHTML=`<div class="game-title-row"><div><span class="eyebrow">3D FAMILY OBBY</span><h1>John's Birthday Seat</h1><p class="subtext">Pick a little full-body family character, then race up a real vertical obstacle course to John's birthday seat.</p></div><span class="pill">1–13 racers · computer fill</span></div><div class="bc-setup"><section class="panel panel-pad"><h2>Choose your runner</h2><p class="subtext">These are the approved 3D family characters used in the movement games.</p><div id="bcChars" class="bc-figure-grid">${ROSTER().map(p=>figureCard(p,p.id===selected.id)).join('')}</div></section><section class="panel panel-pad bc-preview-panel"><h2>Selected runner</h2><div class="bc-big-figure"><img src="${spriteSrc(selected)}" alt="${selected.name}"><div><strong>${selected.name}</strong><p class="subtext">You will see this full-body character running, jumping and landing on the course.</p></div></div><button class="btn success" id="bcChoose" style="width:100%">NEXT: OUTFIT & RACE</button></section></div>`;
    root.querySelectorAll('[data-bc-char]').forEach(b=>b.onclick=()=>{setup.charId=b.dataset.bcChar;renderCharacterChoice()});root.querySelector('#bcChoose').onclick=()=>renderOutfit();
  }
  function botRowsHTML(){return setup.botConfigs.map((b,i)=>`<div class="bc-bot-row"><span>Computer ${i+1}</span><select data-bc-bot-char="${i}" class="select">${ROSTER().map(p=>`<option value="${p.id}" ${p.id===b.charId?'selected':''}>${p.name}</option>`).join('')}</select><select data-bc-bot-diff="${i}" class="select"><option value="easy" ${b.difficulty==='easy'?'selected':''}>Easy</option><option value="medium" ${b.difficulty==='medium'?'selected':''}>Medium</option><option value="hard" ${b.difficulty==='hard'?'selected':''}>Hard</option></select></div>`).join('')||'<p class="subtext">Solo run: no computer racers.</p>'}
  function renderOutfit(){
    const p=rosterPerson(setup.charId);ensureBots(setup.count,p.id);const dog=p.dog;const sets=dog?[{name:'Classic',top:'#8c6a52',legs:'#8c6a52'},{name:'Blue Bandana',top:'#557694',legs:'#8c6a52'},{name:'Red Bandana',top:'#9a4c46',legs:'#8c6a52'},{name:'Birthday',top:'#a57b47',legs:'#8c6a52'}]:outfitSets;
    root.innerHTML=`<div class="game-title-row"><div><span class="eyebrow">RUNNER LOCK-IN</span><h1>${p.name}</h1><p class="subtext">Choose an outfit accent and set exactly which family characters the computers will use.</p></div><button class="btn secondary" id="bcBack">← Back to Characters</button></div><div class="bc-setup"><section class="panel panel-pad"><div class="bc-outfit-hero"><img src="${spriteSrc(p)}" alt="${p.name}"><div><h2>${p.name}</h2><p class="subtext">Approved full-body 3D look</p></div></div><h3>Outfit options</h3><div class="bc-outfit-grid">${sets.map((o,i)=>`<button class="bc-outfit ${setup.outfit===i?'selected':''}" data-bc-outfit="${i}"><i style="--top:${o.top};--legs:${o.legs}"></i><small>${o.name}</small></button>`).join('')}</div><div class="bc-course-promise"><b>Course rebuilt</b><span>32 climbable steps · moving gifts · bounce cake · 5 checkpoints · visible throne at the top.</span></div></section><section class="panel panel-pad"><h2>Race setup</h2><label class="field-label">Total racers</label><select class="select" id="bcCount">${Array.from({length:13},(_,i)=>i+1).map(n=>`<option ${n===setup.count?'selected':''}>${n}</option>`).join('')}</select><div class="bc-bot-head"><strong>Computer racers</strong><span>Pick each character and skill level</span></div><div id="bcBotRows" class="bc-bot-rows">${botRowsHTML()}</div><button class="btn success" id="bcStart" style="width:100%;margin-top:12px">START BIRTHDAY CLIMB</button></section></div>`;
    root.querySelector('#bcBack').onclick=renderCharacterChoice;root.querySelectorAll('[data-bc-outfit]').forEach(b=>b.onclick=()=>{setup.outfit=Number(b.dataset.bcOutfit);renderOutfit()});const count=root.querySelector('#bcCount');count.onchange=()=>{captureBotRows();setup.count=Number(count.value);ensureBots(setup.count,p.id);renderOutfit()};bindBotRows();root.querySelector('#bcStart').onclick=()=>{captureBotRows();start(p)};
  }
  function bindBotRows(){root.querySelectorAll('[data-bc-bot-char]').forEach(el=>el.onchange=()=>{setup.botConfigs[Number(el.dataset.bcBotChar)].charId=el.value});root.querySelectorAll('[data-bc-bot-diff]').forEach(el=>el.onchange=()=>{setup.botConfigs[Number(el.dataset.bcBotDiff)].difficulty=el.value})}
  function captureBotRows(){root?.querySelectorAll('[data-bc-bot-char]').forEach(el=>{const i=Number(el.dataset.bcBotChar);if(setup.botConfigs[i])setup.botConfigs[i].charId=el.value});root?.querySelectorAll('[data-bc-bot-diff]').forEach(el=>{const i=Number(el.dataset.bcBotDiff);if(setup.botConfigs[i])setup.botConfigs[i].difficulty=el.value})}

  function makeActor(person,index,bot=false,difficulty='medium'){return{person,index,bot,difficulty,x:0,z:0,y:0,prevY:0,vy:0,r:person.dog?14:17,height:person.dog?70:118,yaw:0,move:0,grounded:false,progress:0,checkpoint:0,done:false,finishTime:null,ai:{jumpWait:rand(.05,.3),mistake:0},outfit:index===0?setup.outfit:0}}
  function start(person){ensureBots(setup.count,person.id);const actors=[makeActor(person,0,false,'human'),...setup.botConfigs.map((c,i)=>makeActor(rosterPerson(c.charId),i+1,true,c.difficulty))];actors.forEach((a,i)=>{a.x=course[0].x-90+i*18;a.z=course[0].z+(i%2?40:-40);a.y=topOf(course[0])+2;a.progress=0});state={actors,player:actors[0],camera:{yaw:.42,pitch:.24,distance:455},running:true,start:performance.now(),elapsed:0,mobileSprint:false,courseTime:0,confetti:[],winner:null};renderGame()}
  function topOf(p){return p.y+p.h}
  function effective(p,t=state?.courseTime||0){let x=p.x,z=p.z;if(p.move){const v=Math.sin(t*p.move.speed+p.move.phase)*p.move.amount;if(p.move.axis==='x')x+=v;else z+=v}p.cx=x;p.cz=z;return p}
  function platformUnder(a,tolerance=5){let best=null,bestTop=-Infinity;for(const p0 of course){const p=effective(p0),top=topOf(p);if(a.x>=p.cx-p.w/2+a.r*.15&&a.x<=p.cx+p.w/2-a.r*.15&&a.z>=p.cz-p.d/2+a.r*.15&&a.z<=p.cz+p.d/2-a.r*.15&&Math.abs(a.y-top)<=tolerance&&top>bestTop){best=p;bestTop=top}}return best}
  function landingPlatform(a,prevY){if(a.vy>0)return null;let best=null,bestTop=-Infinity;for(const p0 of course){const p=effective(p0),top=topOf(p);if(a.x>=p.cx-p.w/2+a.r*.25&&a.x<=p.cx+p.w/2-a.r*.25&&a.z>=p.cz-p.d/2+a.r*.25&&a.z<=p.cz+p.d/2-a.r*.25&&prevY>=top-3&&a.y<=top+5&&top>bestTop){best=p;bestTop=top}}return best}
  function blocked(a,nx,nz){for(const p0 of course){const p=effective(p0),top=topOf(p),inside=nx>p.cx-p.w/2-a.r&&nx<p.cx+p.w/2+a.r&&nz>p.cz-p.d/2-a.r&&nz<p.cz+p.d/2+a.r;if(!inside)continue;if(a.y<top-9&&a.y+a.height>p.y+5)return true}return false}
  function moveActor(a,dx,dz){const nx=a.x+dx,nz=a.z+dz;if(!blocked(a,nx,a.z))a.x=nx;if(!blocked(a,a.x,nz))a.z=nz;if(Math.abs(dx)+Math.abs(dz)>.01)a.yaw=Math.atan2(dx,dz)}
  function grounded(a){return !!platformUnder(a,7)}
  function jumpActor(a,power=410){if(a.done||!grounded(a))return false;a.vy=power;a.grounded=false;return true}
  function jump(){if(state)jumpActor(state.player)}

  function renderGame(){
    root.innerHTML=`<div class="game-title-row"><div><span class="eyebrow">THIRD-PERSON FAMILY OBBY</span><h1>John's Birthday Seat</h1><p class="subtext">Follow the glowing next platform. Fall off and you return to your latest checkpoint.</p></div><button class="btn secondary" id="bcRestart">New race</button></div><div class="bc-shell"><section class="bc-stage" id="bcStage"><canvas class="bc-canvas" id="bcCanvas"></canvas><div class="bc-hud"><div class="bc-chip" id="bcNext"></div><div class="bc-chip" id="bcTime"></div><div class="bc-chip" id="bcPlace"></div></div><div class="bc-progress"><i id="bcProgressBar"></i></div><div class="bc-help">WASD move · drag to look · Space jump · Shift sprint</div><div class="bc-controls"><div class="bc-joy" id="bcJoy"><div class="bc-stick" id="bcStick"></div></div><div class="bc-actions"><button class="bc-act jump" id="bcJump">JUMP</button><button class="bc-act sprint" id="bcSprint">SPRINT</button></div></div></section><aside class="bc-side"><div class="bc-runner-card"><img src="${spriteSrc(state.player.person)}" alt="${state.player.person.name}"><div><span>YOU ARE</span><strong>${state.player.person.name}</strong><small>Full-body 3D runner</small></div></div><div class="bc-mini"><h3>Climb sections</h3><div class="bc-course-list" id="bcCourse"></div></div><div class="bc-mini"><h3>Computer racers</h3><div class="bc-rivals">${state.actors.filter(a=>a.bot).map(a=>`<div><img src="${spriteSrc(a.person)}" alt=""><span>${a.person.name}<small>${a.difficulty}</small></span></div>`).join('')||'<p class="subtext">Solo run</p>'}</div></div></aside></div>`;
    canvas=root.querySelector('#bcCanvas');ctx=canvas.getContext('2d',{alpha:false});root.querySelector('#bcRestart').onclick=()=>{stop();renderCharacterChoice()};bind();resize();last=performance.now();raf=requestAnimationFrame(loop)
  }
  function bind(){const stage=root.querySelector('#bcStage'),j=root.querySelector('#bcJoy'),stick=root.querySelector('#bcStick');j.onpointerdown=e=>{joy.active=true;joy.id=e.pointerId;j.setPointerCapture(e.pointerId);moveJoy(e)};j.onpointermove=e=>joy.active&&e.pointerId===joy.id&&moveJoy(e);j.onpointerup=j.onpointercancel=e=>{if(e.pointerId!==joy.id)return;joy.active=false;joy.x=joy.z=0;stick.style.transform='translate(0,0)'};function moveJoy(e){const r=j.getBoundingClientRect(),dx=e.clientX-(r.left+r.width/2),dy=e.clientY-(r.top+r.height/2),m=r.width*.34,l=Math.hypot(dx,dy)||1,k=Math.min(1,m/l);joy.x=dx*k/m;joy.z=-dy*k/m;stick.style.transform=`translate(${dx*k}px,${dy*k}px)`}stage.onpointerdown=e=>{if(e.target.closest('button')||e.target.closest('#bcJoy'))return;pointer.active=true;pointer.id=e.pointerId;pointer.x=e.clientX;pointer.y=e.clientY;stage.setPointerCapture(e.pointerId)};stage.onpointermove=e=>{if(!pointer.active||e.pointerId!==pointer.id)return;const dx=e.clientX-pointer.x,dy=e.clientY-pointer.y;pointer.x=e.clientX;pointer.y=e.clientY;state.camera.yaw-=dx*.005;state.camera.pitch=clamp(state.camera.pitch-dy*.003,.08,.52)};stage.onpointerup=stage.onpointercancel=e=>{if(e.pointerId===pointer.id)pointer.active=false};root.querySelector('#bcJump').onclick=jump;const sprint=root.querySelector('#bcSprint');sprint.onpointerdown=()=>state.mobileSprint=true;sprint.onpointerup=sprint.onpointercancel=()=>state.mobileSprint=false;window.addEventListener('keydown',down);window.addEventListener('keyup',up);window.addEventListener('resize',resize)}
  function down(e){keys[e.code]=true;if(e.code==='Space'){e.preventDefault();jump()}}function up(e){keys[e.code]=false}
  function resize(){const r=canvas.getBoundingClientRect(),d=Math.min(2,devicePixelRatio||1);canvas.width=Math.max(1,Math.round(r.width*d));canvas.height=Math.max(1,Math.round(r.height*d));ctx.setTransform(d,0,0,d,0,0);canvas._w=r.width;canvas._h=r.height}

  function updatePlayer(dt){const a=state.player;if(a.done)return;let ix=(keys.KeyD?1:0)-(keys.KeyA?1:0)+joy.x,iz=(keys.KeyW?1:0)-(keys.KeyS?1:0)+joy.z,l=Math.hypot(ix,iz);if(l>1){ix/=l;iz/=l}const speed=(keys.ShiftLeft||keys.ShiftRight||state.mobileSprint)?220:155,sy=Math.sin(state.camera.yaw),cy=Math.cos(state.camera.yaw),dx=(ix*cy+iz*sy)*speed*dt,dz=(iz*cy-ix*sy)*speed*dt;a.move=Math.hypot(dx,dz)/Math.max(.001,dt);moveActor(a,dx,dz);integrate(a,dt)}
  function integrate(a,dt){a.prevY=a.y;a.vy-=790*dt;a.y+=a.vy*dt;const land=landingPlatform(a,a.prevY);if(land){a.y=topOf(land);if(a.vy<0)a.vy=land.bounce||0;a.grounded=!land.bounce;onLand(a,land)}else a.grounded=false;if(a.y<-130)respawn(a)}
  function onLand(a,p){if(p.route>a.progress){a.progress=p.route;if(p.checkpoint!=null)a.checkpoint=p.checkpoint}if(p.checkpoint!=null&&p.checkpoint>a.checkpoint)a.checkpoint=p.checkpoint;if(p.goal&&!a.done){a.done=true;a.finishTime=(performance.now()-state.start)/1000;if(!state.winner)state.winner=a; if(a===state.player)finishPlayer()}}
  function respawn(a){const cpIndex=stages[Math.max(0,a.checkpoint)]?.at||0,p=effective(course[cpIndex]);a.x=p.cx;a.z=p.cz;a.y=topOf(p)+3;a.vy=0;a.progress=Math.max(a.progress,cpIndex);a.grounded=true}
  function updateBots(dt){for(const a of state.actors.filter(x=>x.bot&&!x.done)){const diff=a.difficulty,profile=diff==='easy'?{speed:112,jump:400,error:.10}:diff==='hard'?{speed:172,jump:430,error:.018}:{speed:142,jump:414,error:.05};let next=Math.min(course.length-1,a.progress+1),t=effective(course[next]),dx=t.cx-a.x,dz=t.cz-a.z,d=Math.hypot(dx,dz)||1;a.move=profile.speed;moveActor(a,dx/d*profile.speed*dt,dz/d*profile.speed*dt);a.ai.jumpWait-=dt;if(grounded(a)&&a.ai.jumpWait<=0){const dy=topOf(t)-a.y,near=d<Math.max(145,t.w*.65);if((dy>16&&near)||d<85){a.ai.jumpWait=rand(.18,.5)+(diff==='easy'?.2:0);if(Math.random()>profile.error)jumpActor(a,profile.jump);else a.vy=260}}integrate(a,dt)}}
  function update(dt){if(!state?.running)return;state.courseTime+=dt;state.elapsed=(performance.now()-state.start)/1000;updatePlayer(dt);updateBots(dt);hud()}

  function camera(){const a=state.player,dist=state.camera.distance,cy=Math.cos(state.camera.pitch),sy=Math.sin(state.camera.pitch);return{x:a.x-Math.sin(state.camera.yaw)*dist*cy,y:a.y+125+dist*sy,z:a.z-Math.cos(state.camera.yaw)*dist*cy,yaw:state.camera.yaw,pitch:state.camera.pitch}}
  function project(p,c,W,H){const dx=p.x-c.x,dy=p.y-c.y,dz=p.z-c.z,sy=Math.sin(c.yaw),cy=Math.cos(c.yaw),x=dx*cy-dz*sy,z=dx*sy+dz*cy,sp=Math.sin(c.pitch),cp=Math.cos(c.pitch),y=dy*cp-z*sp,zz=dy*sp+z*cp;if(zz<28)return null;const f=Math.min(W,H)*1.18/zz;return{x:W/2+x*f,y:H*.58-y*f,z:zz,s:f}}
  function shade(hex,n){let v=parseInt(hex.slice(1),16),r=v>>16,g=v>>8&255,b=v&255;r=clamp(r+n,0,255);g=clamp(g+n,0,255);b=clamp(b+n,0,255);return`rgb(${r},${g},${b})`}
  function poly(ps,fill=true){ctx.beginPath();ctx.moveTo(ps[0].x,ps[0].y);for(let i=1;i<ps.length;i++)ctx.lineTo(ps[i].x,ps[i].y);ctx.closePath();fill?ctx.fill():ctx.stroke()}
  function drawBox(p,c,W,H,isTarget=false){p=effective(p);const x0=p.cx-p.w/2,x1=p.cx+p.w/2,z0=p.cz-p.d/2,z1=p.cz+p.d/2,y0=p.y,y1=topOf(p),pts=[{x:x0,y:y0,z:z0},{x:x1,y:y0,z:z0},{x:x1,y:y0,z:z1},{x:x0,y:y0,z:z1},{x:x0,y:y1,z:z0},{x:x1,y:y1,z:z0},{x:x1,y:y1,z:z1},{x:x0,y:y1,z:z1}].map(q=>project(q,c,W,H));if(pts.some(q=>!q))return;const col=palette[p.kind]||palette.wood;for(const [ids,off] of [[[4,5,6,7],12],[[0,1,5,4],-12],[[1,2,6,5],-28],[[2,3,7,6],-38],[[3,0,4,7],-22]]){ctx.fillStyle=shade(col,off);poly(ids.map(i=>pts[i]),true);ctx.strokeStyle='#25170ea8';ctx.lineWidth=1;ctx.stroke()}if(isTarget){ctx.strokeStyle='#ffd65c';ctx.lineWidth=4;poly([pts[4],pts[5],pts[6],pts[7]],false);ctx.save();ctx.shadowColor='#ffd65c';ctx.shadowBlur=18;ctx.strokeStyle='#ffed9b';ctx.lineWidth=2;poly([pts[4],pts[5],pts[6],pts[7]],false);ctx.restore()}const label=project({x:p.cx,y:y1+10,z:p.cz},c,W,H);if(label&&label.s>.18){ctx.font=`900 ${clamp(10*label.s,8,13)}px system-ui`;ctx.textAlign='center';ctx.fillStyle=isTarget?'#fff0a6':'#f4e1bd';ctx.fillText(p.label,label.x,label.y);ctx.textAlign='left'}if(p.goal)drawThrone(p,c,W,H)}
  function drawThrone(p,c,W,H){const base=project({x:p.cx,y:topOf(p)+12,z:p.cz},c,W,H),top=project({x:p.cx,y:topOf(p)+150,z:p.cz},c,W,H);if(!base||!top)return;const h=Math.abs(base.y-top.y),w=Math.max(40,h*.72);ctx.save();ctx.fillStyle='#6f302d';ctx.strokeStyle='#e5b85a';ctx.lineWidth=3;ctx.beginPath();ctx.roundRect(base.x-w/2,top.y,w,h*.72,12);ctx.fill();ctx.stroke();ctx.fillStyle='#d8a747';ctx.font=`900 ${Math.max(18,h*.2)}px serif`;ctx.textAlign='center';ctx.fillText('👑',base.x,top.y+h*.28);ctx.font=`900 ${Math.max(9,h*.08)}px system-ui`;ctx.fillText("JOHN'S SEAT",base.x,top.y+h*.5);ctx.restore()}
  function drawCheckpoint(p,c,W,H){p=effective(p);const a=project({x:p.cx-p.w*.32,y:topOf(p),z:p.cz},c,W,H),b=project({x:p.cx-p.w*.32,y:topOf(p)+115,z:p.cz},c,W,H);if(!a||!b)return;ctx.save();ctx.strokeStyle='#f2c45d';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();ctx.fillStyle='#f2c45d';ctx.beginPath();ctx.moveTo(b.x,b.y);ctx.lineTo(b.x+34,b.y+11);ctx.lineTo(b.x,b.y+22);ctx.closePath();ctx.fill();ctx.restore()}
  function drawActor(a,c,W,H,isMe){const feet=project({x:a.x,y:a.y,z:a.z},c,W,H),head=project({x:a.x,y:a.y+a.height,z:a.z},c,W,H);if(!feet||!head)return;const h=clamp(Math.abs(feet.y-head.y),a.person.dog?25:34,isMe?175:145),img=preloadSprite(a.person),ratio=(img.naturalWidth&&img.naturalHeight)?img.naturalWidth/img.naturalHeight:(a.person.dog?.85:.5),w=h*ratio,bob=a.grounded&&a.move>5?Math.sin(state.courseTime*10+a.index)*2.3:0,x=feet.x-w/2,y=feet.y-h+bob;ctx.save();ctx.fillStyle='#0006';ctx.beginPath();ctx.ellipse(feet.x,feet.y+3,Math.max(9,w*.35),Math.max(3,h*.045),0,0,TAU);ctx.fill();if(img.complete&&img.naturalWidth){ctx.drawImage(img,x,y,w,h);const outfits=a.person.dog?[{top:'#0000',legs:'#0000'},{top:'#557694',legs:'#0000'},{top:'#9a4c46',legs:'#0000'},{top:'#a57b47',legs:'#0000'}]:outfitSets,o=outfits[a.outfit%outfits.length];if(o&&a.outfit>0){ctx.globalCompositeOperation='source-atop';ctx.globalAlpha=.16;ctx.fillStyle=o.top;ctx.fillRect(x,y+h*.28,w,h*.3);ctx.fillStyle=o.legs;ctx.fillRect(x,y+h*.56,w,h*.34);ctx.globalCompositeOperation='source-over';ctx.globalAlpha=1}}else{ctx.fillStyle='#d0a27c';ctx.beginPath();ctx.arc(feet.x,head.y,12,0,TAU);ctx.fill()}if(isMe){ctx.strokeStyle='#ffd965';ctx.lineWidth=3;ctx.shadowColor='#ffd965';ctx.shadowBlur=12;ctx.strokeRect(x-3,y-3,w+6,h+6)}ctx.restore()}
  function drawWorld(){const W=canvas._w,H=canvas._h,c=camera(),g=ctx.createLinearGradient(0,0,0,H);g.addColorStop(0,'#56728a');g.addColorStop(.42,'#b88a61');g.addColorStop(.68,'#4f5f3c');g.addColorStop(1,'#28251f');ctx.fillStyle=g;ctx.fillRect(0,0,W,H);drawMountains(W,H);const items=[],next=Math.min(course.length-1,state.player.progress+1);for(const p of course){const q=project({x:effective(p).cx,y:p.y,z:p.cz},c,W,H);if(q)items.push({d:q.z,fn:()=>{drawBox(p,c,W,H,p.route===next);if(p.checkpoint!=null&&p.route>0)drawCheckpoint(p,c,W,H)}})}for(const a of state.actors){const q=project({x:a.x,y:a.y,z:a.z},c,W,H);if(q)items.push({d:q.z,fn:()=>drawActor(a,c,W,H,a===state.player)})}items.sort((a,b)=>b.d-a.d).forEach(x=>x.fn());drawNextArrow(c,W,H,next)}
  function drawMountains(W,H){ctx.save();ctx.fillStyle='#304139';ctx.beginPath();ctx.moveTo(0,H*.5);for(let i=0;i<=12;i++){const x=i*W/12,y=H*(.34+((i*37)%5)*.025);ctx.lineTo(x,y)}ctx.lineTo(W,H*.72);ctx.lineTo(0,H*.72);ctx.closePath();ctx.fill();ctx.globalAlpha=.35;ctx.fillStyle='#182d27';for(let i=0;i<18;i++){const x=(i*73)%W,y=H*.5-((i*29)%60);ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x-18,H*.62);ctx.lineTo(x+18,H*.62);ctx.closePath();ctx.fill()}ctx.restore()}
  function drawNextArrow(c,W,H,index){const p=effective(course[index]),q=project({x:p.cx,y:topOf(p)+85,z:p.cz},c,W,H);if(!q)return;ctx.save();ctx.font='900 28px system-ui';ctx.textAlign='center';ctx.fillStyle='#ffe47a';ctx.shadowColor='#f4b93e';ctx.shadowBlur=12;ctx.fillText('▼',q.x,q.y+Math.sin(state.courseTime*5)*5);ctx.restore()}

  function hud(){if(!root||!state)return;const next=Math.min(course.length-1,state.player.progress+1),p=course[next],finished=state.actors.filter(a=>a.done).sort((a,b)=>a.finishTime-b.finishTime),place=state.player.done?finished.indexOf(state.player)+1:1+state.actors.filter(a=>a!==state.player&&a.progress>state.player.progress).length;root.querySelector('#bcNext').textContent=state.player.done?'👑 SEAT CLAIMED':`NEXT: ${p.label}`;root.querySelector('#bcTime').textContent=`${state.elapsed.toFixed(1)}s`;root.querySelector('#bcPlace').textContent=`PLACE ${place}/${state.actors.length}`;root.querySelector('#bcProgressBar').style.width=`${Math.round(state.player.progress/(course.length-1)*100)}%`;root.querySelector('#bcCourse').innerHTML=stages.map((s,i)=>`<span class="${i<state.player.checkpoint?'done':i===state.player.checkpoint?'current':''}">${s.icon} ${i+1}. ${s.name}</span>`).join('')}
  function finishPlayer(){state.running=false;if(raf)cancelAnimationFrame(raf);raf=0;const place=1+state.actors.filter(a=>a.bot&&a.done&&a.finishTime<state.player.finishTime).length;root.querySelector('.bc-stage').insertAdjacentHTML('beforeend',`<div class="bc-win-overlay"><div class="bc-throne-win"><img src="${spriteSrc(state.player.person)}" alt="${state.player.person.name}"><span>👑</span></div><h2>${place===1?'YOU CLAIMED THE BIRTHDAY SEAT!':`YOU FINISHED #${place}!`}</h2><p>${state.player.person.name} reached John's birthday seat in ${state.player.finishTime.toFixed(1)} seconds.</p><button class="btn success" id="bcAgain">RACE AGAIN</button></div>`);root.querySelector('#bcAgain').onclick=()=>{stop();renderCharacterChoice()}}
  function loop(t){if(!state?.running)return;const dt=Math.min(.035,(t-last)/1000||.016);last=t;update(dt);drawWorld();raf=requestAnimationFrame(loop)}

  window.BirthdayClimb={mount};window.__BIRTHDAY_CLIMB_TEST__={course,stages,features:{thirdPerson:true,fullBodySprites:true,jump:true,checkpoints:true,bots:true,botCharacters:true,movingPlatforms:true,bounce:true,visibleGoal:true,phone:true,desktop:true}};
})();
