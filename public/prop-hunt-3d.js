/*
 * Black Family Game Night - Family Prop Hunt 3D gameplay slice
 * v1.2.3-launch
 *
 * Self-contained third-person software-3D renderer using Canvas 2D.
 * This deliberately avoids an external 3D dependency so the Cloudflare static
 * asset build stays drop-in. World state is true X/Y/Z: obstacles have height,
 * players jump/fall/land on surfaces, climbable props support chained routes,
 * and shooting uses a camera ray into the 3D world.
 */
(function(){
  'use strict';

  const FAMILY=window.FAMILY;
  const P=()=>[...FAMILY.people,...FAMILY.supports];
  let root=null,canvas=null,ctx=null,raf=0,last=0,state=null;
  let setupSelection={charId:'john',outfit:0,count:6,botConfigs:[]};
  const keys=Object.create(null);
  const joy={x:0,z:0,active:false,id:null};
  const touchMove={forward:false,back:false,left:false,right:false};
  const pointer={active:false,id:null,lastX:0,lastY:0};
  let shootTimer=0;
  const TEST_SCALE=location.search.includes('test=1')?0.03:1;
  const TAU=Math.PI*2;
  const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
  const lerp=(a,b,t)=>a+(b-a)*t;
  const hypot2=(x,z)=>Math.hypot(x,z);
  const xzDist=(a,b)=>Math.hypot(a.x-b.x,a.z-b.z);
  const rand=(a,b)=>a+Math.random()*(b-a);
  const wrapAngle=a=>{while(a>Math.PI)a-=TAU;while(a<-Math.PI)a+=TAU;return a};

  const OUTFITS={
    john:{top:'#6e3340',legs:'#34506b',boots:'#4a2e1d',label:'plaid shirt · jeans · cowboy boots'},
    kristen:{top:'#c7b69d',legs:'#35516d',boots:'#6a4a34',label:'T-shirt · jeans'},
    holly:{top:'#7c8794',legs:'#59677b',boots:'#4d433a',label:'hoodie · baggy jeans'},
    elizabeth:{top:'#c57f8f',legs:'#c5a273',boots:'#eee2d2',label:'tank top · shorts'},
    vanessa:{top:'#a87b55',legs:'#47617c',boots:'#5a3824',label:'western look'},
    logan:{top:'#53616e',legs:'#3b5067',boots:'#3a342e',label:'hoodie · jeans'},
    james:{top:'#567692',legs:'#46617c',boots:'#4d392b',label:'denim shirt · jeans'},
    dorothy:{top:'#9a6d82',legs:'#8f6377',boots:'#5a4038',label:'flowy dress'},
    kelsi:{top:'#c8a17a',legs:'#c8a17a',boots:'#8b684a',label:'dog'},
    molly:{top:'#d2ae87',legs:'#d2ae87',boots:'#8c674c',label:'dog'},
    gunner:{top:'#8b745b',legs:'#8b745b',boots:'#594838',label:'dog'},
    nana:{top:'#a97d83',legs:'#444a51',boots:'#47392f',label:'leggings · shirt'},
    papa:{top:'#7b6a4e',legs:'#3f5870',boots:'#4c3525',label:'shirt · jeans'}
  };

  function B(x,z,w,d,h,name,opt={}){
    return {x,z,w,d,h,name,climbable:!!opt.climbable,color:opt.color||'#5d5041',kind:opt.kind||'box',bounce:opt.bounce||0,solid:opt.solid!==false};
  }
  function Z(x,z,w,d,name,color){return{x,z,w,d,name,color};}
  function E(x,z,type,opt={}){const sh=propShape(type);return{x,z,y:opt.y||0,type,w:opt.w||sh.w,d:opt.d||sh.d,h:opt.h||sh.h,color:opt.color||sh.color,rot:opt.rot||0,collider:opt.collider??sh.collider,climbable:opt.climbable??sh.climbable};}

  const MAPS={
    papa:{
      name:"Papa's Shop",w:1900,d:1300,sky:['#8295a0','#d0b78c'],ground:'#6d6455',ambient:'Warm shop evening · fireplace · barn noises',
      spawn:{x:470,z:1030},zones:[
        Z(120,120,1080,800,'MAIN SHOP','#786951'),Z(1200,210,520,620,'BARN','#6a5b47'),Z(70,950,760,240,'OUTDOOR APRON','#6d6b5e')
      ],
      boxes:[
        B(120,120,1080,26,285,'Back shop wall',{color:'#4d3d31'}),B(120,120,26,800,285,'Left shop wall',{color:'#4d3d31'}),
        B(120,895,390,26,285,'Front wall',{color:'#4d3d31'}),B(850,895,350,26,285,'Front wall',{color:'#4d3d31'}),
        B(1175,210,26,220,285,'Barn divider',{color:'#4a3a2e'}),B(1175,610,26,220,285,'Barn divider',{color:'#4a3a2e'}),
        B(1200,210,520,24,260,'Barn back wall',{color:'#4c4032'}),B(1696,210,24,620,260,'Barn outside wall',{color:'#4c4032'}),B(1200,806,520,24,260,'Barn front wall',{color:'#4c4032'}),
        B(260,240,310,90,82,'Workbench',{climbable:true,color:'#6b4a2e'}),B(650,240,220,120,108,'Tool chest',{climbable:true,color:'#5d4035'}),B(940,210,170,300,230,'Shelving',{climbable:true,color:'#5d503c'}),
        B(300,610,310,160,145,'Tractor',{climbable:true,color:'#5f6f3f',kind:'tractor'}),B(710,600,190,90,96,'Old motorcycle',{climbable:true,color:'#44474b',kind:'motorcycle'}),
        B(160,780,280,80,62,'Lumber stack',{climbable:true,color:'#9a774d'}),B(1010,650,130,130,170,'Fireplace',{color:'#4a3730',kind:'fireplace'}),
        B(930,800,100,90,74,"Papa's yellow chair",{climbable:true,color:'#b49a45',kind:'chair'}),
        B(1290,320,330,34,110,'Pig pen fence',{climbable:true,color:'#795d3e'}),B(1290,570,330,34,110,'Goat pen fence',{climbable:true,color:'#795d3e'}),B(1450,350,42,250,112,'Pen gate',{climbable:true,color:'#795d3e'}),
        B(180,1000,210,70,78,'Pallet stack',{climbable:true,color:'#8c6b45'}),B(490,1020,180,110,92,'Outdoor parts',{climbable:true,color:'#65615b'}),
        B(865,405,95,75,52,'Step crate',{climbable:true,color:'#806242'}),B(885,485,110,80,84,'Parts crate',{climbable:true,color:'#76573b'}),
        B(1030,515,80,70,118,'Shelf step',{climbable:true,color:'#6b563f'})
      ],
      props:[
        E(220,360,'Bucket'),E(250,400,'Bucket'),E(285,380,'Oil Jug'),E(610,430,'Toolbox'),E(690,425,'Welding Helmet'),E(830,330,'Gas Can'),E(870,355,'Shop Vac'),
        E(1000,560,'Coffee Mug'),E(965,585,'Beer Case'),E(885,760,'Stool'),E(1030,815,'Coffee Mug'),E(540,770,'Sawhorse'),E(590,805,'Extension Cord'),
        E(1280,690,'Feed Bucket'),E(1340,700,'Hay Bale',{collider:true,climbable:true}),E(1580,675,'Wheelbarrow'),E(1525,400,'Feed Bucket'),E(1625,510,'Garbage Can'),
        E(220,1110,'Parts Crate',{collider:true,climbable:true}),E(420,1105,'Gas Can'),E(620,1140,'Toolbox'),E(760,1060,'Lumber',{collider:true,climbable:true})
      ],
      animals:[['Orange & Black Pig',1390,430],['Orange & Black Pig',1580,470],['White Goat',1360,690],['White Goat',1560,700]],
      landmarks:["Papa's yellow chair","Tractor","Old motorcycle","Barn","Overhead door"]
    },
    camp:{
      name:'Camper / Campsite',w:2000,d:1400,sky:['#7f9eb0','#e0c398'],ground:'#5b7650',ambient:'Late afternoon · lake · campfire · cards outside',spawn:{x:1060,z:760},
      zones:[Z(240,270,720,330,'CAMPER','#a79d83'),Z(190,620,960,430,'AWNING + HANGOUT','#637451'),Z(1160,150,680,900,'CAMPSITE','#5e784f'),Z(1150,1060,750,250,'SHORELINE','#658181')],
      boxes:[B(310,330,180,120,70,'Front bed',{climbable:true,color:'#86796a'}),B(560,330,150,90,92,'Kitchen counter',{climbable:true,color:'#766d62'}),B(760,340,150,100,75,'Couch',{climbable:true,color:'#6e5e51'}),B(520,480,110,100,150,'Bunks',{climbable:true,color:'#74634f'}),B(790,470,110,100,180,'Bathroom wall',{color:'#77736d'}),B(320,720,270,110,76,'Picnic table',{climbable:true,color:'#8b6b48'}),B(670,710,160,90,105,'BBQ',{climbable:true,color:'#3e4140'}),B(850,680,170,120,90,'Cooler stack',{climbable:true,color:'#567687'}),B(1290,320,280,130,110,'Truck',{climbable:true,color:'#676b70'}),B(1220,760,160,80,40,'Camp fire',{color:'#5a4032',kind:'fireplace'}),B(1490,625,260,190,115,"Logan's tent",{climbable:true,color:'#7c6a4f'}),B(1330,1120,260,55,48,'Shore logs',{climbable:true,color:'#795d42'}),B(1630,1110,100,120,70,'Rock cluster',{climbable:true,color:'#77746a'})],
      props:[E(300,880,'Camp Chair'),E(370,900,'Camp Chair'),E(520,870,'Cooler'),E(670,875,'Lantern'),E(760,840,'Dog Toy'),E(930,880,'Card Box'),E(1010,810,'Water Jug'),E(1180,590,'Firewood',{collider:true,climbable:true}),E(1400,520,'Camp Bin',{collider:true,climbable:true}),E(1650,850,'Rock',{collider:true,climbable:true}),E(1770,930,'Camp Chair'),E(1260,1180,'Driftwood',{collider:true,climbable:true})],
      animals:[['Molly',1050,900],['Kelsi',920,940],['Gunner',1450,920]],landmarks:["Logan's tent",'Truck','Camper','Camp fire','Shoreline']
    },
    acreage:{
      name:'Backyard + Fire Pit',w:2500,d:1700,sky:['#6f7f9a','#d39c6a'],ground:'#557348',ambient:'Summer dusk · fire glow · woods · open fields',spawn:{x:920,z:560},
      zones:[Z(100,120,650,380,'HOUSE + DECK','#756b5a'),Z(760,100,850,520,'GRAVEL PARKING','#79776e'),Z(1650,100,650,520,'FIRE PIT + GARDEN','#536e43'),Z(210,720,250,260,'QUAD SHOP','#6e6559'),Z(485,720,250,260,"JOHN'S TOOL SHOP",'#655d55'),Z(210,1000,250,180,'STORAGE SHOP','#625b53'),Z(820,690,680,380,'GRASS + STORAGE','#5c7b4e'),Z(1540,690,720,380,'WOODS','#405b38'),Z(240,1160,950,390,'DUGOUT','#567c7e'),Z(1250,1120,1000,420,'GOAT RUN + FIELD','#66764e')],
      boxes:[B(180,250,380,120,80,'Back deck',{climbable:true,color:'#75634e'}),B(500,180,140,140,115,'Hot tub',{climbable:true,color:'#6a7371'}),B(660,290,80,130,95,'Garbage bins',{climbable:true,color:'#4e5b50'}),B(910,250,360,130,130,'Holiday trailer',{climbable:true,color:'#9b9482'}),B(1320,260,230,120,100,'Boat',{climbable:true,color:'#6c7d80'}),B(1770,220,260,80,58,'Fire pit chairs',{climbable:true,color:'#6d543c'}),B(2050,260,170,160,150,'Garden shed',{climbable:true,color:'#6e5f4b'}),B(1740,470,420,80,38,'Garden rows',{climbable:true,color:'#5a693d'}),B(260,800,160,55,78,'Quad bench',{climbable:true,color:'#65503b'}),B(540,800,150,55,80,"John's workbench",{climbable:true,color:'#62513f'}),B(250,1060,160,45,125,'Storage racks',{climbable:true,color:'#60564b'}),B(920,760,160,160,58,'Trampoline',{climbable:true,bounce:430,color:'#384955'}),B(1110,760,190,190,115,'Above-ground pool',{climbable:true,color:'#5c8290'}),B(1360,800,190,110,95,'Trailers',{climbable:true,color:'#777069'}),B(1640,760,120,230,180,'Trees',{color:'#4b523c'}),B(1830,740,100,260,190,'Trees',{color:'#46523b'}),B(2020,760,110,240,170,'Trees',{color:'#4a563e'}),B(1380,1200,450,40,110,'Goat fence',{climbable:true,color:'#6f583d'}),B(1880,1220,260,120,150,'Sea can',{climbable:true,color:'#6d725e'})],
      props:[E(350,600,'Garbage Can'),E(460,620,'Flower Pot'),E(650,600,'Cooler'),E(820,570,'Lawn Chair'),E(1030,620,'Tire'),E(1220,610,'Toolbox'),E(1550,590,'Garden Crate'),E(1720,600,'Watering Can'),E(1910,620,'Wheelbarrow'),E(2170,580,'Firewood',{collider:true,climbable:true}),E(1480,980,'Rock',{collider:true,climbable:true}),E(1610,960,'Stump',{collider:true,climbable:true}),E(1880,1010,'Log',{collider:true,climbable:true}),E(2050,1120,'Storage Bin',{collider:true,climbable:true}),E(1040,1110,'Pool Float')],
      animals:[['Kelsi',1850,500],['Molly',1000,1120],['Gunner',1500,1350],['Goat',1550,1360],['Goat',1700,1400]],landmarks:['Fire pit',"John's tool shop",'Dugout','Woods','Pool']
    },
    farm:{
      name:'Farmyard / Animal Pens',w:2300,d:1500,sky:['#87a3b5','#d9cf9c'],ground:'#6b754b',ambient:'Bright farm day · birds · goats · roaming peacock',spawn:{x:980,z:770},
      zones:[Z(100,130,620,500,'BIRD COOP + RUN','#88704c'),Z(760,170,400,450,'FUTURE COOP','#75624a'),Z(1210,110,910,610,'GOATS + PIGS','#79654d'),Z(140,760,890,580,'OPEN FARM LAND','#64784b'),Z(1100,790,990,520,'BIG ANIMAL RUN','#627447')],
      boxes:[B(235,275,140,70,85,'Nest boxes',{climbable:true,color:'#7d6544'}),B(470,250,170,270,115,'Bird fence',{climbable:true,color:'#705a3e'}),B(810,250,290,250,165,'Falling-apart shed',{climbable:true,color:'#655746'}),B(1290,210,350,38,110,'Goat fence',{climbable:true,color:'#71583b'}),B(1290,460,350,38,110,'Pig fence',{climbable:true,color:'#71583b'}),B(1530,270,90,180,95,'Goat stairs',{climbable:true,color:'#8d6a43'}),B(1690,350,300,130,20,'Mud wallow',{color:'#594a38',solid:false}),B(1260,850,310,150,155,'Sea can',{climbable:true,color:'#6d715a'}),B(1680,860,290,150,155,'Sea can',{climbable:true,color:'#686f5a'}),B(1320,1110,220,80,72,'Goat platforms',{climbable:true,color:'#846442'}),B(1650,1120,250,80,100,'Hay stack',{climbable:true,color:'#9b874b'}),B(320,900,250,90,105,'Feed storage',{climbable:true,color:'#76634c'}),B(680,940,180,130,120,'Farm equipment',{climbable:true,color:'#5b6651'})],
      props:[E(260,650,'Feed Bucket'),E(340,670,'Waterer'),E(430,680,'Chicken Feeder'),E(600,650,'Shovel'),E(820,680,'Crate',{collider:true,climbable:true}),E(990,690,'Feed Bag'),E(1180,720,'Hay Bale',{collider:true,climbable:true}),E(1450,720,'Garbage Can'),E(1600,720,'Wheelbarrow'),E(1830,730,'Trough',{collider:true,climbable:true}),E(2050,720,'Feed Barrel',{collider:true,climbable:true}),E(990,1080,'Pallet',{collider:true,climbable:true})],
      animals:[['Chicken',280,360],['Turkey',360,410],['Peacock',560,340],['White Goat',1380,350],['White Goat',1480,390],['Baby Goat',1420,560],['Baby Goat',1530,570],['Orange & Black Pig',1800,430],['Orange & Black Pig',1900,500]],landmarks:['Bird coop','Future coop','Pig mud wallow','Goat stairs','Sea cans']
    }
  };

  function propShape(type){
    const t=String(type).toLowerCase();
    if(t.includes('mug'))return{w:20,d:20,h:28,color:'#d6c6a7',collider:false,climbable:false,kind:'cylinder'};
    if(t.includes('bucket'))return{w:34,d:34,h:44,color:'#8a8577',collider:false,climbable:false,kind:'cylinder'};
    if(t.includes('oil')||t.includes('gas')||t.includes('water jug'))return{w:28,d:24,h:48,color:'#6d704f',collider:false,climbable:false,kind:'box'};
    if(t.includes('toolbox')||t.includes('tool box'))return{w:48,d:28,h:30,color:'#8e4b3e',collider:false,climbable:false,kind:'box'};
    if(t.includes('welding helmet'))return{w:34,d:32,h:38,color:'#3f4747',collider:false,climbable:false,kind:'box'};
    if(t.includes('shop vac'))return{w:46,d:46,h:62,color:'#555b5c',collider:false,climbable:false,kind:'cylinder'};
    if(t.includes('beer case')||t.includes('crate')||t.includes('bin')||t.includes('camp bin')||t.includes('storage bin'))return{w:60,d:42,h:42,color:'#8b6847',collider:true,climbable:true,kind:'box'};
    if(t.includes('stool')||t.includes('chair'))return{w:52,d:52,h:66,color:'#78624e',collider:true,climbable:true,kind:'box'};
    if(t.includes('sawhorse'))return{w:82,d:35,h:60,color:'#806344',collider:true,climbable:true,kind:'box'};
    if(t.includes('hay'))return{w:82,d:62,h:60,color:'#a9914d',collider:true,climbable:true,kind:'box'};
    if(t.includes('wheelbarrow'))return{w:88,d:45,h:52,color:'#6d725e',collider:true,climbable:true,kind:'box'};
    if(t.includes('rock')||t.includes('stump'))return{w:62,d:58,h:48,color:'#77736a',collider:true,climbable:true,kind:'box'};
    if(t.includes('lumber')||t.includes('log')||t.includes('driftwood')||t.includes('firewood'))return{w:100,d:46,h:42,color:'#8a6845',collider:true,climbable:true,kind:'box'};
    if(t.includes('lantern'))return{w:26,d:26,h:46,color:'#8f754e',collider:false,climbable:false,kind:'cylinder'};
    if(t.includes('cooler'))return{w:62,d:42,h:42,color:'#5d8293',collider:true,climbable:true,kind:'box'};
    if(t.includes('tire'))return{w:58,d:24,h:58,color:'#333536',collider:true,climbable:true,kind:'box'};
    if(t.includes('flower'))return{w:36,d:36,h:42,color:'#7a5f42',collider:false,climbable:false,kind:'cylinder'};
    if(t.includes('watering'))return{w:38,d:28,h:36,color:'#657a65',collider:false,climbable:false,kind:'box'};
    if(t.includes('feed barrel'))return{w:55,d:55,h:80,color:'#5e6d6e',collider:true,climbable:true,kind:'cylinder'};
    if(t.includes('trough'))return{w:100,d:48,h:48,color:'#6e665a',collider:true,climbable:true,kind:'box'};
    if(t.includes('pallet'))return{w:90,d:70,h:30,color:'#8a6947',collider:true,climbable:true,kind:'box'};
    return{w:44,d:36,h:44,color:'#7a6d5b',collider:false,climbable:false,kind:'box'};
  }

  const AVATARS={};
  function avatarPath(id){return id==='john'?'/avatars/john-black.png':`/avatars/${id}.png`;}
  function preloadAvatars(){for(const p of P()){const img=new Image();img.src=avatarPath(p.id);AVATARS[p.id]=img;}}
  preloadAvatars();

  function mount(el){
    root=el;stop();
    const q=new URL(location.href).searchParams;
    if(q.get('autostart')==='1'){
      const charId=q.get('char')||setupSelection.charId||'john',count=clamp(Number(q.get('players')||6),2,13);phEnsureBots(count,charId);
      startMatch({charId,outfit:0,count,botConfigs:setupSelection.botConfigs.map(x=>({...x})),mode:q.get('mode')||'classic',mapKey:q.get('map')||'papa'});
    }else renderSetup();
  }
  function stop(){
    if(raf)cancelAnimationFrame(raf);raf=0;last=0;state=null;if(shootTimer)clearInterval(shootTimer);shootTimer=0;keysClear();
    window.removeEventListener('keydown',onKeyDown);window.removeEventListener('keyup',onKeyUp);window.removeEventListener('resize',resizeCanvas);
  }
  function keysClear(){for(const k of Object.keys(keys))delete keys[k];joy.x=joy.z=0;joy.active=false;pointer.active=false;touchMove.forward=touchMove.back=touchMove.left=touchMove.right=false;}

  function phSprite(p){return `/characters3d/${p.id}.png`}
  function phEnsureBots(count,humanId){const need=Math.max(0,count-1),pool=P().filter(p=>p.id!==humanId);while(setupSelection.botConfigs.length<need){const q=pool[setupSelection.botConfigs.length%pool.length];setupSelection.botConfigs.push({charId:q.id,difficulty:'medium'})}setupSelection.botConfigs.length=need}
  function phBotRows(){return setupSelection.botConfigs.map((b,i)=>`<div class="ph3-bot-row"><span>Computer ${i+1}</span><select class="select" data-ph3-bot-char="${i}">${P().map(p=>`<option value="${p.id}" ${p.id===b.charId?'selected':''}>${p.name}</option>`).join('')}</select><select class="select" data-ph3-bot-diff="${i}"><option value="easy" ${b.difficulty==='easy'?'selected':''}>Easy</option><option value="medium" ${b.difficulty==='medium'?'selected':''}>Medium</option><option value="hard" ${b.difficulty==='hard'?'selected':''}>Hard</option></select></div>`).join('')}
  function phCaptureBots(){root?.querySelectorAll('[data-ph3-bot-char]').forEach(el=>{const i=Number(el.dataset.ph3BotChar);if(setupSelection.botConfigs[i])setupSelection.botConfigs[i].charId=el.value});root?.querySelectorAll('[data-ph3-bot-diff]').forEach(el=>{const i=Number(el.dataset.ph3BotDiff);if(setupSelection.botConfigs[i])setupSelection.botConfigs[i].difficulty=el.value})}
  function phBindBotRows(){root.querySelectorAll('[data-ph3-bot-char]').forEach(el=>el.onchange=()=>{setupSelection.botConfigs[Number(el.dataset.ph3BotChar)].charId=el.value});root.querySelectorAll('[data-ph3-bot-diff]').forEach(el=>el.onchange=()=>{setupSelection.botConfigs[Number(el.dataset.ph3BotDiff)].difficulty=el.value})}

  function renderSetup(){
    const defaultSelected=setupSelection.charId||'john';
    root.innerHTML=`
      <div class="game-title-row"><div><span class="eyebrow">THIRD-PERSON 3D FAMILY GAME</span><h1>Family Prop Hunt</h1><p class="subtext">Run as your animated family character, jump and climb real map geometry, transform into exact-looking props, and hunt in third person on phone or computer.</p></div><span class="pill">1–13 family characters</span></div>
      <div class="setup-grid">
        <section class="panel panel-pad"><h2>Choose your character</h2><p class="subtext">Choose the family member or dog first. Outfit choices appear on the next screen.</p><div id="ph3Chars" class="ph3-character-grid">${P().map(p=>`<button class="ph3-character-card ${p.id===defaultSelected?'selected':''}" data-id="${p.id}"><div><img src="${phSprite(p)}" alt="${p.name} full-body character"></div><strong>${p.name}</strong><small>${p.dog?'Animated dog player':(OUTFITS[p.id]?.label||'animated family character')}</small></button>`).join('')}</div></section>
        <section class="panel panel-pad"><h2>Approved 3D family style</h2><img src="/family-3d-lineup-approved.png" alt="Approved animated Black family 3D character style" style="width:100%;border-radius:16px;border:1px solid var(--line)"><p class="subtext">These full-body characters are the movement cast for Prop Hunt and Birthday Seat.</p><button id="ph3Next" class="btn success" style="width:100%;margin-top:12px">NEXT: OUTFIT & MATCH</button></section>
      </div>`;
    root.querySelectorAll('#ph3Chars [data-id]').forEach(b=>b.addEventListener('click',()=>{setupSelection.charId=b.dataset.id;root.querySelectorAll('#ph3Chars [data-id]').forEach(x=>x.classList.toggle('selected',x===b));const next=root.querySelector('#ph3Next');if(next)next.textContent=`NEXT: ${b.querySelector('strong')?.textContent||'CHARACTER'} OUTFIT & MATCH`;}));
    root.querySelector('#ph3Next').addEventListener('click',()=>renderPropOutfit(setupSelection.charId||defaultSelected));
  }

  function renderPropOutfit(fallback='john'){
    const charId=setupSelection.charId||fallback,person=P().find(p=>p.id===charId)||P()[0];phEnsureBots(setupSelection.count,person.id);
    const labels=person.dog?['Classic','Playful','Rugged','Party']:['Casual','Western','Plaid','Sporty','Winter','Dressy'];
    const imageFor=i=>person.id==='john'?`/avatars/styles/john-look-${String(Math.min(16,i+1)).padStart(2,'0')}.jpg`:`/avatars/styles/${person.id}-${['cute','rugged','glam','goofy'][i%4]}.jpg`;
    root.innerHTML=`<div class="game-title-row"><div><span class="eyebrow">CHARACTER LOCK-IN</span><h1>${person.name}</h1><p class="subtext">Pick an outfit, then choose exactly which family characters the computer players will use.</p></div><button id="ph3Back" class="btn secondary">← Back to Characters</button></div><div class="setup-grid"><section class="panel panel-pad"><div class="ph3-outfit-figure"><img src="${phSprite(person)}" alt="${person.name}"><div><h2>${person.name}</h2><p class="subtext">Approved full-body 3D character</p></div></div><h3>Outfit options</h3><div class="look-grid">${labels.map((n,i)=>`<button class="look-choice ${setupSelection.outfit===i?'selected':''}" data-ph3-outfit="${i}"><img src="${imageFor(i)}" alt="${person.name} ${n}"><span><b>${i+1}</b>${n}</span></button>`).join('')}</div></section><section class="panel panel-pad"><h2>Match setup</h2><label class="field-label">Total players</label><select id="ph3Count" class="select">${Array.from({length:12},(_,i)=>i+2).map(n=>`<option ${n===setupSelection.count?'selected':''}>${n}</option>`).join('')}</select><br><br><label class="field-label">Mode</label><select id="ph3Mode" class="select"><option value="classic">Classic · caught hiders spectate</option><option value="chaos">Family Chaos · caught hiders join hunters</option></select><br><br><label class="field-label">3D map</label><select id="ph3Map" class="select"><option value="rotate">Rotate all four maps</option>${Object.entries(MAPS).map(([k,m])=>`<option value="${k}">${m.name}</option>`).join('')}</select><div class="ph3-bot-head"><strong>Computer players</strong><span>Choose character + difficulty for each seat</span></div><div id="ph3BotRows" class="ph3-bot-rows">${phBotRows()}</div><div class="stat-card" style="margin-top:14px"><strong>Detailed movement active</strong><p class="subtext">Third-person camera · jump physics · climbable benches/crates/tractors/hay/trailers · prop lock · 3-hit health · sparks · 3 disguise changes · 10 decoys · flash per disguise.</p></div><button id="ph3Start" class="btn success" style="width:100%;margin-top:12px">START 3D MATCH</button></section></div>`;
    root.querySelector('#ph3Back').onclick=renderSetup;root.querySelectorAll('[data-ph3-outfit]').forEach(b=>b.onclick=()=>{setupSelection.outfit=Number(b.dataset.ph3Outfit);root.querySelectorAll('[data-ph3-outfit]').forEach(x=>x.classList.toggle('selected',x===b));});const count=root.querySelector('#ph3Count');count.onchange=()=>{phCaptureBots();setupSelection.count=Number(count.value);phEnsureBots(setupSelection.count,person.id);renderPropOutfit()};phBindBotRows();root.querySelector('#ph3Start').onclick=()=>{phCaptureBots();startMatch({charId:person.id,outfit:setupSelection.outfit,count:setupSelection.count,botConfigs:setupSelection.botConfigs.map(x=>({...x})),mode:root.querySelector('#ph3Mode').value,mapKey:root.querySelector('#ph3Map').value})};
  }

  function startMatch(opts){
    const human=P().find(p=>p.id===opts.charId)||P()[0];phEnsureBots(opts.count,human.id);const configs=(opts.botConfigs?.length?opts.botConfigs:setupSelection.botConfigs).slice(0,opts.count-1);const family=[human,...configs.map(c=>P().find(p=>p.id===c.charId)||P()[1])];opts.botConfigs=configs;
    state={opts,family,round:0,wins:{hiders:0,hunters:0},feed:[],running:true,mapKey:null,map:null,player:null,actors:[],props:[],animals:[],effects:[],camera:{yaw:0,pitch:.28,distance:355,fov:720},phase:'hide',phaseLeft:30*TEST_SCALE,tauntIn:30*TEST_SCALE,shotCooldown:0,locked:false,nearProp:null,roundResult:null,botHunterMemory:[],screenShake:0};
    nextRound();
  }

  function nextRound(){
    if(!state||state.round>=6){renderMatchEnd();return;}
    state.round++;
    state.roundResult=null;state.phase='hide';state.phaseLeft=30*TEST_SCALE;state.tauntIn=30*TEST_SCALE;state.effects=[];state.locked=false;state.nearProp=null;
    const mapKeys=Object.keys(MAPS);state.mapKey=state.opts.mapKey==='rotate'?mapKeys[(state.round-1)%mapKeys.length]:state.opts.mapKey;state.map=MAPS[state.mapKey];
    const huntersNeeded=state.family.length<=5?1:2;
    // Round one deliberately starts the human as a hider so movement, jumping and prop controls are immediately testable. Rotation remains fair across later rounds.
    const hunterIndexes=[];const rotationBase=((state.round-1)*huntersNeeded+1)%state.family.length;for(let j=0;j<huntersNeeded;j++)hunterIndexes.push((rotationBase+j)%state.family.length);
    state.actors=state.family.map((person,i)=>makeActor(person,i,hunterIndexes.includes(i)?'hunter':'hider',i!==0,i===0?'human':(state.opts.botConfigs[i-1]?.difficulty||'medium')));
    state.player=state.actors[0];state.player.bot=false;
    state.props=buildProps(state.map);state.animals=buildAnimals(state.map);scatterActors();placeHumanNearPlayableProp();
    for(const a of state.actors.filter(a=>a.role==='hider'&&a.bot))botChooseInitialProp(a);
    state.camera.yaw=state.player.yaw;state.camera.pitch=.28;state.camera.distance=state.player.role==='hunter'?360:330;
    state.feed=[`Round ${state.round}: ${state.map.name}. ${huntersNeeded} hunter${huntersNeeded>1?'s':''}.`,state.player.role==='hunter'?'You are hunting this round. Hiders have 30 seconds.':'You are hiding. Find a believable prop and get positioned.'];
    renderGame();
  }

  function makeActor(person,index,role,bot,botDifficulty='medium'){
    return{person,index,role,bot,botDifficulty,alive:true,x:0,y:0,z:0,vy:0,yaw:0,r:22,height:person.dog?62:118,speed:role==='hunter'?175:165,runSpeed:role==='hunter'?245:230,health:3,prop:null,propShape:null,propChanges:3,decoys:10,flash:1,locked:false,ammo:30,reload:0,blind:0,moveAmount:0,jumpBuffer:0,coyote:.12,ai:{target:null,timer:0,detected:null,shot:0,decoyTimer:rand(5,10),changeTimer:rand(8,15)}};
  }

  function scatterActors(){
    const m=state.map,base=m.spawn;state.actors.forEach((a,i)=>{a.x=clamp(base.x+(i%4)*70,70,m.w-70);a.z=clamp(base.z+Math.floor(i/4)*70,70,m.d-70);a.y=groundSupport(a.x,a.z,0);a.yaw=rand(-Math.PI,Math.PI);});
  }
  function placeHumanNearPlayableProp(){
    const p=state.player;if(!p||p.role!=='hider'||!state.props.length)return;let near=null,best=Infinity;for(const q of state.props){const d=Math.hypot(q.x-state.map.spawn.x,q.z-state.map.spawn.z);if(d<best){best=d;near=q}}if(!near)return;const angle=Math.atan2(state.map.spawn.x-near.x,state.map.spawn.z-near.z);p.x=clamp(near.x+Math.sin(angle||0)*105,40,state.map.w-40);p.z=clamp(near.z+Math.cos(angle||0)*105,40,state.map.d-40);if(pointInsideAnySolid(p.x,p.z,state.map.boxes,p.r)){p.x=clamp(near.x+110,40,state.map.w-40);p.z=clamp(near.z+20,40,state.map.d-40)}p.y=groundSupport(p.x,p.z,0);p.yaw=Math.atan2(near.x-p.x,near.z-p.z);state.camera.yaw=p.yaw;}

  function buildProps(map){
    const out=map.props.map((p,i)=>({...p,id:`p${i}`,decoy:false}));
    const types=map.props.map(p=>p.type);
    // Add believable clutter. A seeded-looking deterministic spiral keeps repeat play familiar.
    for(let i=0;i<28;i++){
      const type=types[i%types.length],shape=propShape(type),ang=i*2.3999632297,r=160+(i%8)*92;
      let x=map.spawn.x+Math.cos(ang)*r,z=map.spawn.z+Math.sin(ang)*r;
      x=clamp(x,75,map.w-75);z=clamp(z,75,map.d-75);
      if(pointInsideAnySolid(x,z,map.boxes,12)){x=clamp(map.w*.5+Math.cos(ang)*r,75,map.w-75);z=clamp(map.d*.5+Math.sin(ang)*r,75,map.d-75);}
      out.push({...E(x,z,type,{rot:ang}),id:`c${i}`,decoy:false,w:shape.w,d:shape.d,h:shape.h});
    }
    return out;
  }
  function buildAnimals(map){return map.animals.map((a,i)=>({name:a[0],x:a[1],z:a[2],y:0,tx:a[1],tz:a[2],timer:rand(1,3),phase:i*.8}));}

  function botChooseInitialProp(a){
    const candidates=state.props.filter(p=>xzDist(a,p)<650);if(!candidates.length)return;
    const p=candidates[Math.floor(Math.random()*candidates.length)];a.prop=p.type;a.propShape=propShape(p.type);a.x=clamp(p.x+rand(-80,80),50,state.map.w-50);a.z=clamp(p.z+rand(-80,80),50,state.map.d-50);a.r=Math.max(14,Math.min(34,a.propShape.w*.4));a.locked=Math.random()>.3;
  }

  function renderGame(){
    root.innerHTML=`<div class="game-title-row"><div><span class="eyebrow">ROUND ${state.round} · THIRD-PERSON</span><h1>Family Prop Hunt</h1><p class="subtext">${state.map.name} · ${state.map.ambient}</p></div><div class="button-row"><button id="ph3Restart" class="btn secondary">New match</button></div></div>
      <div class="ph3d-shell">
        <section class="ph3d-stage" id="ph3Stage">
          <canvas class="ph3d-canvas" id="ph3Canvas" aria-label="Third-person Family Prop Hunt game view"></canvas>
          <div class="ph3d-top"><div class="ph3d-chip role" id="ph3Role"></div><div class="ph3d-chip map" id="ph3Phase"></div><div class="ph3d-chip health" id="ph3Health"></div></div>
          <div class="ph3d-camera-help">Computer: WASD move · drag to look · Space jump · E prop · C decoy · Q flash · X lock · R reload</div><div class="ph3d-move-status" id="ph3MoveStatus"></div>
          <div class="ph3d-crosshair" id="ph3Cross"></div><div class="ph3d-hit" id="ph3Hit">✦</div><div class="ph3d-flash" id="ph3Flash"></div><div class="ph3d-prop-prompt" id="ph3Prompt"></div>
          <div class="ph3d-controls">
            <div class="ph3d-move-cluster"><div class="ph3d-joystick" id="ph3Joy"><div class="ph3d-stick" id="ph3Stick"></div></div><div class="ph3d-dpad" aria-label="Movement buttons"><button type="button" data-ph3-move="forward" aria-label="Move forward">▲</button><button type="button" data-ph3-move="left" aria-label="Move left">◀</button><button type="button" data-ph3-move="back" aria-label="Move back">▼</button><button type="button" data-ph3-move="right" aria-label="Move right">▶</button></div></div>
            <div class="ph3d-actions">
              <button class="ph3d-act primary" id="ph3Shoot">SHOOT</button><button class="ph3d-act jump" id="ph3Jump">JUMP</button><button class="ph3d-act prop" id="ph3Prop">PROP</button>
              <button class="ph3d-act flash" id="ph3FlashBtn">FLASH</button><button class="ph3d-act" id="ph3Decoy">DECOY</button><button class="ph3d-act lock" id="ph3Lock">LOCK</button>
            </div>
          </div>
        </section>
        <aside class="ph3d-side">
          <div class="ph3d-mini"><h3>Loadout</h3><div class="ph3d-readout" id="ph3Load"></div></div>
          <div class="ph3d-mini"><h3>3D movement</h3><div class="ph3d-legend"><span>Blue edges = climbable</span><span>Gold outline = prop target</span><span>Low objects auto-step</span><span>Jump chains reach higher spots</span></div></div>
          <div class="ph3d-mini"><h3>Family match</h3><div class="round-track">${[1,2,3,4,5,6].map(n=>`<div class="round-dot ${n<state.round?'done':n===state.round?'current':''}"></div>`).join('')}</div><p class="subtext">Computer players use the family characters and individual difficulty settings you chose.</p></div>
          <div class="ph3d-mini"><h3>Round feed</h3><div class="ph3d-feed" id="ph3Feed"></div></div>
        </aside>
      </div>`;
    canvas=root.querySelector('#ph3Canvas');ctx=canvas.getContext('2d',{alpha:false});
    root.querySelector('#ph3Restart').addEventListener('click',()=>{stop();renderSetup()});
    bindControls();resizeCanvas();window.addEventListener('resize',resizeCanvas);window.addEventListener('keydown',onKeyDown);window.addEventListener('keyup',onKeyUp);
    updateHud();last=performance.now();raf=requestAnimationFrame(loop);
  }

  function bindControls(){
    const stage=root.querySelector('#ph3Stage'),j=root.querySelector('#ph3Joy'),stick=root.querySelector('#ph3Stick');
    const setJoy=e=>{const r=j.getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height/2,dx=e.clientX-cx,dy=e.clientY-cy,max=Math.max(28,r.width*.34),len=Math.hypot(dx,dy)||1,k=Math.min(1,max/len);dx*=k;dy*=k;joy.x=dx/max;joy.z=-dy/max;stick.style.transform=`translate(${dx}px,${dy}px)`;};
    const joyEnd=e=>{if(e&&joy.id!=null&&e.pointerId!==joy.id)return;joy.active=false;joy.id=null;joy.x=joy.z=0;stick.style.transform='translate(0,0)'};
    j.addEventListener('pointerdown',e=>{e.preventDefault();joy.active=true;joy.id=e.pointerId;try{j.setPointerCapture(e.pointerId)}catch{}setJoy(e)});
    j.addEventListener('pointermove',e=>{if(joy.active&&e.pointerId===joy.id){e.preventDefault();setJoy(e)}});j.addEventListener('pointerup',joyEnd);j.addEventListener('pointercancel',joyEnd);j.addEventListener('lostpointercapture',()=>joyEnd());
    root.querySelectorAll('[data-ph3-move]').forEach(btn=>{const dir=btn.dataset.ph3Move,on=e=>{e.preventDefault();touchMove[dir]=true;btn.classList.add('pressed')},off=e=>{if(e)e.preventDefault();touchMove[dir]=false;btn.classList.remove('pressed')};btn.addEventListener('pointerdown',on);btn.addEventListener('pointerup',off);btn.addEventListener('pointercancel',off);btn.addEventListener('pointerleave',e=>{if(e.buttons===0)off(e)});});
    stage.addEventListener('contextmenu',e=>e.preventDefault());
    stage.addEventListener('pointerdown',e=>{if(e.target.closest('button')||e.target.closest('#ph3Joy')||e.target.closest('.ph3d-dpad'))return;if(e.pointerType==='mouse'&&e.button!==2)return;pointer.active=true;pointer.id=e.pointerId;pointer.lastX=e.clientX;pointer.lastY=e.clientY;try{stage.setPointerCapture(e.pointerId)}catch{}});
    stage.addEventListener('pointermove',e=>{if(!pointer.active||e.pointerId!==pointer.id)return;const dx=e.clientX-pointer.lastX,dy=e.clientY-pointer.lastY;pointer.lastX=e.clientX;pointer.lastY=e.clientY;state.camera.yaw=wrapAngle(state.camera.yaw-dx*.006);state.camera.pitch=clamp(state.camera.pitch-dy*.004,-.12,.72)});
    const endPointer=e=>{if(e.pointerId===pointer.id){pointer.active=false;pointer.id=null}};stage.addEventListener('pointerup',endPointer);stage.addEventListener('pointercancel',endPointer);stage.addEventListener('lostpointercapture',()=>{pointer.active=false;pointer.id=null});
    const bindTap=(sel,fn)=>{const b=root.querySelector(sel);if(!b)return;b.addEventListener('click',e=>{e.preventDefault();fn()})};
    const shootBtn=root.querySelector('#ph3Shoot');if(shootBtn){const start=e=>{e.preventDefault();shoot();if(shootTimer)clearInterval(shootTimer);shootTimer=setInterval(shoot,110);shootBtn.classList.add('pressed')},stopShoot=e=>{if(e)e.preventDefault();if(shootTimer)clearInterval(shootTimer);shootTimer=0;shootBtn.classList.remove('pressed')};shootBtn.addEventListener('pointerdown',start);shootBtn.addEventListener('pointerup',stopShoot);shootBtn.addEventListener('pointercancel',stopShoot);shootBtn.addEventListener('pointerleave',e=>{if(e.buttons===0)stopShoot(e)});}
    bindTap('#ph3Jump',jump);bindTap('#ph3Prop',changeProp);bindTap('#ph3Decoy',dropDecoy);bindTap('#ph3FlashBtn',flash);bindTap('#ph3Lock',toggleLock);
    canvas.addEventListener('mousedown',e=>{if(e.button===0&&!pointer.active)shoot()});
  }

  function onKeyDown(e){
    if(['INPUT','SELECT','TEXTAREA'].includes(document.activeElement?.tagName))return;
    keys[e.code]=true;
    if(e.repeat)return;
    if(e.code==='Space'){e.preventDefault();jump()}else if(e.code==='KeyE')changeProp();else if(e.code==='KeyC')dropDecoy();else if(e.code==='KeyQ')flash();else if(e.code==='KeyX')toggleLock();else if(e.code==='KeyR')reload();
  }
  function onKeyUp(e){keys[e.code]=false;}
  function resizeCanvas(){if(!canvas)return;const r=canvas.getBoundingClientRect(),dpr=Math.min(2,devicePixelRatio||1);canvas.width=Math.max(320,Math.round(r.width*dpr));canvas.height=Math.max(360,Math.round(r.height*dpr));canvas._cssW=r.width;canvas._cssH=r.height;canvas._dpr=dpr;ctx.setTransform(dpr,0,0,dpr,0,0);}

  function loop(now){if(!state||!state.running)return;const dt=Math.min(.04,(now-last)/1000||.016);last=now;update(dt);draw();raf=requestAnimationFrame(loop);}

  function update(dt){
    state.phaseLeft-=dt;state.tauntIn-=dt;state.shotCooldown=Math.max(0,state.shotCooldown-dt);state.screenShake=Math.max(0,state.screenShake-dt*3);
    const p=state.player;if(p.reload>0){p.reload-=dt;if(p.reload<=0)p.ammo=30;}if(p.blind>0)p.blind-=dt;
    if(state.phase==='hide'&&state.phaseLeft<=0){state.phase='hunt';state.phaseLeft=180*TEST_SCALE;state.tauntIn=30*TEST_SCALE;addFeed('HUNT STARTED. Hunters are released.');bubble('HUNT!')}
    else if(state.phase==='hunt'&&state.phaseLeft<=0){finishRound('hiders');return;}
    if(state.phase==='hunt'&&state.tauntIn<=0){state.tauntIn=30*TEST_SCALE;forcedTaunt();}
    updatePlayer(dt);updateBots(dt);updateAnimals(dt);updateEffects(dt);
    if(state.phase==='hunt'&&!state.actors.some(a=>a.role==='hider'&&a.alive)){finishRound('hunters');return;}
    state.nearProp=findNearestProp(p,125);updateHud();
  }

  function updatePlayer(dt){
    const p=state.player;if(!p.alive)return;
    let ix=(keys.KeyD?1:0)-(keys.KeyA?1:0)+(touchMove.right?1:0)-(touchMove.left?1:0)+joy.x,iz=(keys.KeyW?1:0)-(keys.KeyS?1:0)+(touchMove.forward?1:0)-(touchMove.back?1:0)+joy.z;
    if(state.phase==='hide'&&p.role==='hunter'){ix=iz=0;}if(p.blind>0){ix*=.6;iz*=.6;}
    const len=Math.hypot(ix,iz);if(len>1){ix/=len;iz/=len;}
    const locked=p.role==='hider'&&p.prop&&p.locked;const sprint=keys.ShiftLeft||keys.ShiftRight;const speed=sprint?p.runSpeed:p.speed;
    if(!locked&&len>.05){
      const sy=Math.sin(state.camera.yaw),cy=Math.cos(state.camera.yaw);const dx=(ix*cy+iz*sy),dz=(iz*cy-ix*sy);const dl=Math.hypot(dx,dz)||1;
      const nx=dx/dl,nz=dz/dl;p.yaw=Math.atan2(nx,nz);tryMove(p,nx*speed*dt,nz*speed*dt);p.moveAmount=lerp(p.moveAmount,1,.2);
    }else p.moveAmount=lerp(p.moveAmount,0,.12);
    // Hunter body points with camera so the visible prop-zapper aims with the crosshair.
    if(p.role==='hunter')p.yaw=state.camera.yaw;
    applyVerticalPhysics(p,dt);
  }

  function tryMove(a,dx,dz){
    const m=state.map;let nx=clamp(a.x+dx,28,m.w-28),nz=clamp(a.z+dz,28,m.d-28);
    const here=groundSupport(a.x,a.z,a.y),candidate=blockingBox(nx,nz,a.r,a.y,here);
    if(!candidate){a.x=nx;a.z=nz;return;}
    // Auto-step onto low/climbable geometry. Higher chains require a jump or being on a raised support already.
    const top=candidate.h,maxStep=(a.y>here+8?125:68);if(candidate.climbable&&top<=a.y+maxStep){a.x=nx;a.z=nz;if(a.y<top)a.y=top;return;}
    // Sliding makes mobile movement less sticky.
    const bx=blockingBox(nx,a.z,a.r,a.y,here);if(!bx)a.x=nx;const bz=blockingBox(a.x,nz,a.r,a.y,here);if(!bz)a.z=nz;
  }

  function applyVerticalPhysics(a,dt){
    const beforeSupport=groundSupport(a.x,a.z,a.y),nearGround=Math.abs(a.y-beforeSupport)<5&&a.vy<=15;
    a.coyote=nearGround ? .12 : Math.max(0,(a.coyote||0)-dt);a.jumpBuffer=Math.max(0,(a.jumpBuffer||0)-dt);
    a.vy-=820*dt;a.y+=a.vy*dt;const support=groundSupport(a.x,a.z,a.y);
    if(a.y<=support){a.y=support;if(a.vy<0){const b=topBoxAt(a.x,a.z,support);if(b?.bounce)a.vy=b.bounce;else a.vy=0;}a.coyote=.12;
      if(a===state.player&&a.jumpBuffer>0&&!a.locked&&!(state.phase==='hide'&&a.role==='hunter')){a.vy=365;a.jumpBuffer=0;a.coyote=0;APP.toast('Jump');}
    }
  }

  function groundSupport(x,z,currentY){
    let h=0;for(const b of state?.map?.boxes||[]){if(!b.solid&&b.h>22)continue;if(x>b.x&&x<b.x+b.w&&z>b.z&&z<b.z+b.d&&b.climbable&&b.h<=currentY+135)h=Math.max(h,b.h)}
    for(const p of state?.props||[]){if(!p.collider||!p.climbable)continue;if(x>p.x-p.w/2&&x<p.x+p.w/2&&z>p.z-p.d/2&&z<p.z+p.d/2&&p.h<=currentY+120)h=Math.max(h,p.y+p.h)}
    return h;
  }
  function topBoxAt(x,z,h){return(state?.map?.boxes||[]).find(b=>b.climbable&&Math.abs(b.h-h)<1&&x>b.x&&x<b.x+b.w&&z>b.z&&z<b.z+b.d);}
  function blockingBox(x,z,r,y,support){
    for(const b of state.map.boxes){if(!b.solid)continue;if(x+r>b.x&&x-r<b.x+b.w&&z+r>b.z&&z-r<b.z+b.d){if(b.climbable&&b.h<=y+68)continue;if(y>=b.h-8)continue;return b;}}
    for(const p of state.props){if(!p.collider)continue;if(x+r>p.x-p.w/2&&x-r<p.x+p.w/2&&z+r>p.z-p.d/2&&z-r<p.z+p.d/2){if(p.climbable&&p.h<=y+62)continue;if(y>=p.y+p.h-8)continue;return p;}}
    return null;
  }
  function pointInsideAnySolid(x,z,boxes,r=0){return boxes.some(b=>b.solid&&x+r>b.x&&x-r<b.x+b.w&&z+r>b.z&&z-r<b.z+b.d);}

  function jump(){const p=state?.player;if(!p||!p.alive)return;if(state.phase==='hide'&&p.role==='hunter'){APP.toast(`Hunters release in ${Math.max(0,Math.ceil(state.phaseLeft/TEST_SCALE))}s`);return}if(p.locked){APP.toast('Unlock your prop before jumping');return}const support=groundSupport(p.x,p.z,p.y);if(Math.abs(p.y-support)<6||(p.coyote||0)>0){p.vy=365;p.jumpBuffer=0;p.coyote=0;APP.toast('Jump');}else p.jumpBuffer=.22;}
  function toggleLock(){const p=state?.player;if(!p||p.role!=='hider'||!p.prop){APP.toast('Disguise first');return}p.locked=!p.locked;state.locked=p.locked;APP.toast(p.locked?'Prop locked. Camera stays free.':'Prop unlocked. Run!');updateHud();}

  function findNearestProp(a,maxD){let best=null,bd=maxD;for(const p of state.props){const d=xzDist(a,p);if(d<bd){best=p;bd=d;}}return best;}
  function changeProp(){
    const p=state?.player;if(!p||p.role!=='hider'||!p.alive){APP.toast('Hiders use disguises');return;}const near=findNearestProp(p,135);if(!near){APP.toast('Move closer to an object');return;}if(p.prop&&p.propChanges<=0){APP.toast('No prop changes left');return;}
    if(p.prop)p.propChanges--;p.prop=near.type;p.propShape=propShape(near.type);p.r=Math.max(13,Math.min(34,p.propShape.w*.38));p.flash=1;p.locked=false;state.effects.push(makePoof(p.x,p.y+25,p.z));addFeed(`${p.person.name} became ${p.prop}. Flash refreshed.`);APP.toast(`Disguised as ${p.prop}`);updateHud();
  }
  function dropDecoy(){
    const p=state?.player;if(!p||p.role!=='hider'||!p.prop){APP.toast('Disguise first');return;}if(p.decoys<=0){APP.toast('No decoys left');return;}
    p.decoys--;const s=p.propShape||propShape(p.prop);state.props.push({id:`d${Date.now()}${p.decoys}`,x:p.x+Math.cos(p.yaw)*60,z:p.z+Math.sin(p.yaw)*60,y:groundSupport(p.x,p.z,0),type:p.prop,w:s.w,d:s.d,h:s.h,color:s.color,rot:p.yaw,collider:s.collider,climbable:s.climbable,decoy:true});addFeed(`${p.person.name} dropped a ${p.prop} decoy.`);APP.toast(`${p.decoys} decoys left`);updateHud();
  }
  function flash(){
    const p=state?.player;if(!p||p.role!=='hider'||!p.prop){APP.toast('Disguise first');return;}if(!p.flash){APP.toast('Flash already used for this disguise');return;}p.flash=0;let n=0;for(const h of state.actors.filter(a=>a.role==='hunter'&&a.alive)){if(xzDist(p,h)<270){h.blind=1.8;n++;}}
    state.effects.push(makeFlash(p.x,p.y+45,p.z));addFeed(`${p.person.name} used the flash${n?' and blinded a hunter':''}.`);APP.toast('FLASH!');updateHud();
  }
  function reload(){const p=state?.player;if(!p||p.role!=='hunter'||p.reload>0||p.ammo===30)return;p.reload=1.05;APP.toast('Reloading…');}

  function cameraData(){
    const p=state.player,c=state.camera,yaw=c.yaw,pitch=c.pitch,dist=c.distance;const target={x:p.x,y:p.y+(p.person.dog?48:82),z:p.z};
    const horiz=Math.cos(pitch)*dist;let cam={x:target.x-Math.sin(yaw)*horiz,y:target.y+Math.sin(pitch)*dist+70,z:target.z-Math.cos(yaw)*horiz};
    if(state.screenShake>0){cam.x+=rand(-4,4)*state.screenShake;cam.y+=rand(-3,3)*state.screenShake;}
    let fx=target.x-cam.x,fy=target.y-cam.y,fz=target.z-cam.z,fl=Math.hypot(fx,fy,fz)||1;fx/=fl;fy/=fl;fz/=fl;
    let rx=fz,ry=0,rz=-fx,rl=Math.hypot(rx,rz)||1;rx/=rl;rz/=rl;const ux=ry*fz-rz*fy,uy=rz*fx-rx*fz,uz=rx*fy-ry*fx;
    return{cam,target,forward:{x:fx,y:fy,z:fz},right:{x:rx,y:0,z:rz},up:{x:ux,y:uy,z:uz},fov:state.camera.fov};
  }
  function project(pt,cam,W,H){const dx=pt.x-cam.cam.x,dy=pt.y-cam.cam.y,dz=pt.z-cam.cam.z;const cx=dx*cam.right.x+dy*cam.right.y+dz*cam.right.z,cy=dx*cam.up.x+dy*cam.up.y+dz*cam.up.z,cz=dx*cam.forward.x+dy*cam.forward.y+dz*cam.forward.z;if(cz<8)return null;const f=cam.fov,scale=f/cz;return{x:W/2+cx*scale,y:H*.46-cy*scale,z:cz,scale};}

  function shoot(){
    const p=state?.player;if(!p||p.role!=='hunter'||state.phase!=='hunt'||p.blind>0||state.shotCooldown>0)return;if(p.reload>0)return;if(p.ammo<=0){reload();return;}p.ammo--;state.shotCooldown=.085;state.screenShake=.35;
    const cam=cameraData(),ray={o:cam.cam,d:cam.forward};let hit=null,bestT=900;
    for(const a of state.actors){if(a===p||!a.alive||a.role!=='hider')continue;const center={x:a.x,y:a.y+(a.prop?(a.propShape?.h||50)/2:a.height*.55),z:a.z},radius=a.prop?Math.max(18,(a.propShape?.w||40)*.55):34;const t=raySphere(ray,center,radius);if(t!=null&&t<bestT){bestT=t;hit=a;}}
    if(hit){hit.health--;hit.locked=false;state.effects.push(...makeSparks(hit.x,hit.y+(hit.propShape?.h||60)*.5,hit.z,10));hit.ai.detected=p;hit.ai.timer=4;showHit();addFeed(`Hit ${hit.prop||hit.person.name}: ${Math.max(0,hit.health)}/3 health.`);if(hit.health<=0)catchHider(hit);}else{
      const impact=rayWorldImpact(ray,650);if(impact)state.effects.push(...makeSparks(impact.x,impact.y,impact.z,4));
    }
    if(p.ammo<=0)reload();updateHud();
  }
  function raySphere(ray,c,r){const ox=ray.o.x-c.x,oy=ray.o.y-c.y,oz=ray.o.z-c.z,b=ox*ray.d.x+oy*ray.d.y+oz*ray.d.z,cq=ox*ox+oy*oy+oz*oz-r*r,disc=b*b-cq;if(disc<0)return null;const t=-b-Math.sqrt(disc);return t>0?t:null;}
  function rayWorldImpact(ray,maxT){
    let best=null,bestT=maxT;for(const b of state.map.boxes){for(let t=20;t<bestT;t+=18){const x=ray.o.x+ray.d.x*t,y=ray.o.y+ray.d.y*t,z=ray.o.z+ray.d.z*t;if(x>b.x&&x<b.x+b.w&&z>b.z&&z<b.z+b.d&&y>=0&&y<=b.h){best={x,y,z};bestT=t;break;}}}return best;
  }
  function showHit(){const e=root.querySelector('#ph3Hit');if(!e)return;e.classList.remove('on');void e.offsetWidth;e.classList.add('on');}
  function catchHider(a){
    state.effects.push(makePoof(a.x,a.y+35,a.z));addFeed(`POOF! ${a.person.name} was found as ${a.prop||'a prop'}.`);
    if(state.opts.mode==='chaos'){a.role='hunter';a.prop=null;a.propShape=null;a.health=3;a.speed=175;a.runSpeed=245;a.alive=true;a.locked=false;addFeed(`${a.person.name} joins the hunters.`);}else a.alive=false;
  }

  function updateBots(dt){
    for(const a of state.actors){if(!a.bot||!a.alive)continue;const diff=a.botDifficulty||'medium',react=diff==='easy'?1.4:diff==='hard'?.55:.9,accuracy=diff==='easy'?.48:diff==='hard'?.86:.68;if(a.blind>0){a.blind-=dt;continue;}a.ai.timer-=dt;a.ai.shot=Math.max(0,a.ai.shot-dt);a.ai.decoyTimer-=dt;a.ai.changeTimer-=dt;
      if(a.role==='hider')updateBotHider(a,dt,react);else updateBotHunter(a,dt,react,accuracy,diff);applyVerticalPhysics(a,dt);
    }
  }
  function updateBotHider(a,dt,react){
    const hunters=state.actors.filter(x=>x.role==='hunter'&&x.alive),nearest=hunters.sort((u,v)=>xzDist(a,u)-xzDist(a,v))[0],danger=nearest?xzDist(a,nearest):9999;
    if(state.phase==='hide'){if(!a.prop)botChooseInitialProp(a);a.locked=true;return;}
    if(danger<250){a.locked=false;if(a.flash&&danger<180){a.flash=0;nearest.blind=1.5;}if(a.ai.changeTimer<=0&&a.propChanges>0){const p=findNearestProp(a,150);if(p){a.prop=p.type;a.propShape=propShape(p.type);a.propChanges--;a.flash=1;a.ai.changeTimer=rand(8,14);}}
      const ang=Math.atan2(a.x-nearest.x,a.z-nearest.z)+rand(-.35,.35);a.yaw=ang;tryMove(a,Math.sin(ang)*a.runSpeed*dt,Math.cos(ang)*a.runSpeed*dt);if(Math.random()<.012)botJump(a);
    }else{a.locked=true;if(a.ai.decoyTimer<=0&&a.decoys>0&&Math.random()<.25){a.decoys--;const s=a.propShape||propShape(a.prop||'Bucket');state.props.push({id:`bd${a.index}${Date.now()}`,x:a.x+rand(-55,55),z:a.z+rand(-55,55),y:0,type:a.prop||'Bucket',w:s.w,d:s.d,h:s.h,color:s.color,rot:rand(0,TAU),collider:s.collider,climbable:s.climbable,decoy:true});a.ai.decoyTimer=rand(7,13);}}
  }
  function updateBotHunter(a,dt,react,accuracy,diff){
    if(state.phase==='hide')return;const hiders=state.actors.filter(x=>x.role==='hider'&&x.alive);if(!hiders.length)return;
    let target=a.ai.detected;if(!target||!target.alive||target.role!=='hider'){
      target=null;let best=Infinity;for(const h of hiders){const d=xzDist(a,h),moving=!h.locked||!h.prop;let detect=0;if(d<180)detect=.95;else if(d<330&&moving)detect=.8;else if(d<520&&moving)detect=.35;if(Math.random()<detect*dt/react&&d<best){target=h;best=d;}}
      if(target){a.ai.detected=target;a.ai.timer=diffTimer(diff);}
    }else if(a.ai.timer<=0){a.ai.detected=null;target=null;}
    if(target){const dx=target.x-a.x,dz=target.z-a.z,d=Math.hypot(dx,dz)||1;a.yaw=Math.atan2(dx,dz);if(d>170)tryMove(a,dx/d*a.runSpeed*dt,dz/d*a.runSpeed*dt);if(d<420&&a.ai.shot<=0){a.ai.shot=diff==='hard'?.12:diff==='easy'?.34:.21;if(Math.random()<accuracy){target.health--;target.locked=false;state.effects.push(...makeSparks(target.x,target.y+25,target.z,7));if(target.health<=0)catchHider(target);}}}
    else{if(a.ai.timer<=0||!a.ai.target){a.ai.target={x:rand(80,state.map.w-80),z:rand(80,state.map.d-80)};a.ai.timer=rand(2.2,4.5);}const dx=a.ai.target.x-a.x,dz=a.ai.target.z-a.z,d=Math.hypot(dx,dz)||1;if(d>25){a.yaw=Math.atan2(dx,dz);tryMove(a,dx/d*a.speed*.65*dt,dz/d*a.speed*.65*dt);}}
  }
  function diffTimer(d){return d==='easy'?1.8:d==='hard'?4.5:3;}
  function botJump(a){const support=groundSupport(a.x,a.z,a.y);if(Math.abs(a.y-support)<5)a.vy=330;}

  function updateAnimals(dt){for(const a of state.animals){a.timer-=dt;a.phase+=dt;if(a.timer<=0){a.timer=rand(1.5,4);a.tx=clamp(a.x+rand(-120,120),40,state.map.w-40);a.tz=clamp(a.z+rand(-120,120),40,state.map.d-40);}const dx=a.tx-a.x,dz=a.tz-a.z,l=Math.hypot(dx,dz)||1;if(l>5){a.x+=dx/l*24*dt;a.z+=dz/l*24*dt;}a.y=Math.max(0,Math.sin(a.phase*2.3)*3);}}
  function updateEffects(dt){for(const e of state.effects){e.life-=dt;if(e.kind==='spark'){e.x+=e.vx*dt;e.y+=e.vy*dt;e.z+=e.vz*dt;e.vy-=320*dt;}}state.effects=state.effects.filter(e=>e.life>0);}
  function makeSparks(x,y,z,n){return Array.from({length:n},()=>({kind:'spark',x,y,z,vx:rand(-90,90),vy:rand(60,190),vz:rand(-90,90),life:rand(.25,.55),max:.55,color:'#ffd76a'}));}
  function makePoof(x,y,z){return{kind:'poof',x,y,z,life:.65,max:.65};}
  function makeFlash(x,y,z){return{kind:'flash',x,y,z,life:.5,max:.5};}

  function forcedTaunt(){
    const hiders=state.actors.filter(a=>a.role==='hider'&&a.alive);if(!hiders.length)return;const h=hiders[Math.floor(Math.random()*hiders.length)];const line=FAMILY.taunts[h.person.id]||"That's a sin!";addFeed(`${h.person.name} forced taunt: ${line}`);bubble(line);for(const hunter of state.actors.filter(a=>a.role==='hunter'&&a.bot)){if(xzDist(h,hunter)<750){hunter.ai.detected=h;hunter.ai.timer=2.5;}}
  }
  function bubble(text){const stage=root.querySelector('#ph3Stage');if(!stage)return;const d=document.createElement('div');d.className='ph3d-taunt';d.textContent=text;stage.appendChild(d);setTimeout(()=>d.remove(),2200);}

  function finishRound(team){if(state.roundResult)return;state.roundResult=team;state.wins[team]++;state.running=false;if(raf)cancelAnimationFrame(raf);raf=0;modal(`<div class="status-large"><span class="eyebrow">ROUND ${state.round} COMPLETE</span><strong>${team==='hiders'?'HIDERS SURVIVE':'HUNTERS CLEAR THE MAP'}</strong><p>Hiders ${state.wins.hiders} · Hunters ${state.wins.hunters}</p><button id="ph3Next" class="btn success">${state.round===6?'MATCH RESULTS':'NEXT ROUND'}</button></div>`,m=>m.querySelector('#ph3Next').addEventListener('click',()=>{closeModal();state.running=true;nextRound()}));}
  function renderMatchEnd(){if(raf)cancelAnimationFrame(raf);raf=0;const w=state.wins;root.innerHTML=`<div class="panel panel-pad status-large"><span class="eyebrow">SIX 3D ROUNDS COMPLETE</span><strong>${w.hiders>w.hunters?'HIDERS WIN THE NIGHT':w.hunters>w.hiders?'HUNTERS WIN THE NIGHT':'TIE GAME'}</strong><p class="subtext">Hiders ${w.hiders} · Hunters ${w.hunters}</p><button id="ph3Again" class="btn success">PLAY AGAIN</button></div>`;root.querySelector('#ph3Again').addEventListener('click',()=>{state=null;renderSetup()});}

  function updateHud(){
    if(!root||!state||!state.player)return;const p=state.player,role=root.querySelector('#ph3Role'),phase=root.querySelector('#ph3Phase'),health=root.querySelector('#ph3Health'),load=root.querySelector('#ph3Load'),feed=root.querySelector('#ph3Feed'),prompt=root.querySelector('#ph3Prompt'),moveStatus=root.querySelector('#ph3MoveStatus');if(!role)return;
    role.textContent=p.role==='hider'?`HIDER · ${p.prop||'family character'}`:'HUNTER · prop-zapper';phase.textContent=`${state.phase==='hide'?'HIDE':'HUNT'} ${fmt(state.phaseLeft/TEST_SCALE)} · ${state.map.name}`;health.textContent=`♥ ${Math.max(0,p.health)}/3`;
    load.innerHTML=p.role==='hider'?`Disguise: <b>${p.prop||'none'}</b><br>Changes: <b>${p.propChanges}</b><br>Decoys: <b>${p.decoys}/10</b><br>Flash: <b>${p.flash?'READY':'USED'}</b><br>Prop lock: <b>${p.locked?'LOCKED':'FREE'}</b><br>Health carries between disguises.`:`Magazine: <b>${p.reload>0?'RELOADING':p.ammo+'/30'}</b><br>Reserve: <b>∞</b><br>Aim: camera crosshair<br>No penalty for scenery shots.`;
    if(feed){feed.innerHTML=state.feed.slice(-12).map(x=>`<div>${x}</div>`).join('');feed.scrollTop=feed.scrollHeight;}
    const isHider=p.role==='hider',hunterWaiting=p.role==='hunter'&&state.phase==='hide';for(const id of ['ph3Prop','ph3FlashBtn','ph3Decoy','ph3Lock']){const b=root.querySelector('#'+id);if(b)b.disabled=!isHider;}const shoot=root.querySelector('#ph3Shoot');if(shoot)shoot.disabled=p.role!=='hunter'||state.phase!=='hunt';const jumpBtn=root.querySelector('#ph3Jump');if(jumpBtn)jumpBtn.disabled=hunterWaiting||p.locked;
    const flashOverlay=root.querySelector('#ph3Flash');if(flashOverlay)flashOverlay.classList.toggle('on',p.blind>0);
    if(prompt){if(isHider&&state.nearProp){prompt.textContent=`PROP: ${state.nearProp.type} · tap PROP`;prompt.classList.add('on')}else prompt.classList.remove('on');}
    const lock=root.querySelector('#ph3Lock');if(lock)lock.textContent=p.locked?'UNLOCK':'LOCK';
    if(moveStatus){if(hunterWaiting){moveStatus.textContent=`HUNTER HOLD · release in ${Math.max(0,Math.ceil(state.phaseLeft/TEST_SCALE))}s`;moveStatus.className='ph3d-move-status waiting'}else if(p.locked){moveStatus.textContent='PROP LOCKED · tap UNLOCK to move';moveStatus.className='ph3d-move-status locked'}else{moveStatus.textContent=isHider?'MOVE NOW · joystick, arrows or WASD':'MOVE & HUNT · joystick, arrows or WASD';moveStatus.className='ph3d-move-status ready'}}
  }
  function fmt(sec){sec=Math.max(0,Math.ceil(sec));return`${Math.floor(sec/60)}:${String(sec%60).padStart(2,'0')}`;}
  function addFeed(t){state.feed.push(t);if(state.feed.length>50)state.feed.shift();}

  // ---------- software 3D rendering ----------
  function draw(){
    if(!ctx||!state||!canvas)return;const W=canvas._cssW||canvas.clientWidth,H=canvas._cssH||canvas.clientHeight,cam=cameraData();
    const sky=state.map.sky;const g=ctx.createLinearGradient(0,0,0,H);g.addColorStop(0,sky[0]);g.addColorStop(.58,sky[1]);g.addColorStop(.59,state.map.ground);g.addColorStop(1,'#39372d');ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
    drawDistantBackdrop(cam,W,H);drawGround(cam,W,H);const commands=[];
    for(const b of state.map.boxes)pushBox(commands,b,cam,W,H,b.color,b.climbable);
    for(const p of state.props)pushProp(commands,p,cam,W,H,p===state.nearProp&&state.player.role==='hider');
    for(const a of state.animals)pushAnimal(commands,a,cam,W,H);
    for(const a of state.actors){if(a.alive&&a!==state.player)pushActor(commands,a,cam,W,H,false);}if(state.player.alive)pushActor(commands,state.player,cam,W,H,true);
    for(const e of state.effects)pushEffect(commands,e,cam,W,H);
    commands.sort((a,b)=>b.depth-a.depth);for(const c of commands)c.draw();
    if(state.phase==='hide'&&state.player.role==='hunter'){ctx.fillStyle='#090807dd';ctx.fillRect(0,0,W,H);ctx.fillStyle='#f6dfad';ctx.textAlign='center';ctx.font='900 26px system-ui';ctx.fillText('HIDERS ARE HIDING…',W/2,H*.43);ctx.font='600 14px system-ui';ctx.fillStyle='#d4c5b0';ctx.fillText(`${Math.max(0,Math.ceil(state.phaseLeft/TEST_SCALE))} seconds`,W/2,H*.48);ctx.textAlign='left';}
  }

  function drawDistantBackdrop(cam,W,H){ctx.save();ctx.globalAlpha=.45;ctx.fillStyle='#314033';ctx.beginPath();ctx.moveTo(0,H*.58);for(let x=0;x<=W;x+=45){const h=22+17*Math.sin(x*.04)+12*Math.sin(x*.13);ctx.lineTo(x,H*.58-h);}ctx.lineTo(W,H*.62);ctx.lineTo(0,H*.62);ctx.closePath();ctx.fill();ctx.restore();}
  function zoneColorAt(x,z){for(const q of state.map.zones)if(x>=q.x&&x<=q.x+q.w&&z>=q.z&&z<=q.z+q.d)return q.color;return state.map.ground;}
  function drawGround(cam,W,H){
    const p=state.player,tile=120,range=840,minX=Math.floor(clamp(p.x-range,0,state.map.w)/tile)*tile,maxX=Math.ceil(clamp(p.x+range,0,state.map.w)/tile)*tile,minZ=Math.floor(clamp(p.z-range,0,state.map.d)/tile)*tile,maxZ=Math.ceil(clamp(p.z+range,0,state.map.d)/tile)*tile;
    const tiles=[];for(let x=minX;x<maxX;x+=tile)for(let z=minZ;z<maxZ;z+=tile){const pts=[project({x,y:0,z},cam,W,H),project({x:x+tile,y:0,z},cam,W,H),project({x:x+tile,y:0,z:z+tile},cam,W,H),project({x,y:0,z:z+tile},cam,W,H)];if(pts.some(q=>!q))continue;tiles.push({pts,depth:pts.reduce((s,q)=>s+q.z,0)/4,color:zoneColorAt(x+tile/2,z+tile/2)});}tiles.sort((a,b)=>b.depth-a.depth);for(const t of tiles){ctx.fillStyle=shade(t.color,-.07);poly(t.pts,true);ctx.strokeStyle='#ffffff10';ctx.lineWidth=1;poly(t.pts,false);}}
  function pushBox(cmd,b,cam,W,H,color,climbable){const x0=b.x,x1=b.x+b.w,z0=b.z,z1=b.z+b.d,y0=0,y1=b.h;const c=[{x:x0,y:y0,z:z0},{x:x1,y:y0,z:z0},{x:x1,y:y0,z:z1},{x:x0,y:y0,z:z1},{x:x0,y:y1,z:z0},{x:x1,y:y1,z:z0},{x:x1,y:y1,z:z1},{x:x0,y:y1,z:z1}].map(p=>project(p,cam,W,H));if(c.filter(Boolean).length<5)return;const faces=[[4,5,6,7,.13],[0,1,5,4,-.09],[1,2,6,5,-.16],[2,3,7,6,-.24],[3,0,4,7,-.12]];for(const [a,d,e,f,sh] of faces){const pts=[c[a],c[d],c[e],c[f]];if(pts.some(q=>!q))continue;const depth=pts.reduce((s,q)=>s+q.z,0)/4;cmd.push({depth,draw:()=>{ctx.fillStyle=shade(color,sh);poly(pts,true);ctx.strokeStyle=climbable?'#8bb8ca66':'#1c171388';ctx.lineWidth=climbable?2:1;poly(pts,false);}});}const topCenter=project({x:b.x+b.w/2,y:b.h+2,z:b.z+b.d/2},cam,W,H);if(topCenter&&topCenter.scale>.25)cmd.push({depth:topCenter.z-.1,draw:()=>{ctx.fillStyle='#f4e6c9b8';ctx.font=`${clamp(9*topCenter.scale,8,12)}px system-ui`;ctx.textAlign='center';ctx.fillText(b.name,topCenter.x,topCenter.y-4);ctx.textAlign='left';}});}
  function pushProp(cmd,p,cam,W,H,highlight){const b={x:p.x-p.w/2,z:p.z-p.d/2,w:p.w,d:p.d,h:p.h,name:p.type,color:p.color,climbable:p.climbable};const before=cmd.length;pushBox(cmd,b,cam,W,H,p.color,p.climbable);if(highlight){for(let i=before;i<cmd.length;i++){const old=cmd[i].draw;cmd[i].draw=()=>{old();ctx.save();ctx.strokeStyle='#ffd86a';ctx.lineWidth=2;const top=project({x:p.x,y:p.h+8,z:p.z},cam,W,H);if(top){ctx.beginPath();ctx.arc(top.x,top.y,clamp(22*top.scale,8,25),0,TAU);ctx.stroke();}ctx.restore();};}}}
  function pushAnimal(cmd,a,cam,W,H){const p=project({x:a.x,y:20+a.y,z:a.z},cam,W,H);if(!p)return;cmd.push({depth:p.z,draw:()=>{const s=clamp(28*p.scale,8,28);ctx.fillStyle=a.name.includes('Pig')?'#b6745b':a.name.includes('Peacock')?'#456d72':a.name.includes('Chicken')||a.name.includes('Turkey')?'#a9784f':'#ded3bd';ctx.beginPath();ctx.ellipse(p.x,p.y,s,s*.65,0,0,TAU);ctx.fill();ctx.fillStyle='#fff7';ctx.font=`${clamp(9*p.scale,7,10)}px system-ui`;ctx.textAlign='center';ctx.fillText(a.name,p.x,p.y-s-3);ctx.textAlign='left';}});}
  function pushActor(cmd,a,cam,W,H,isPlayer){
    if(a.role==='hider'&&a.prop){const s=a.propShape||propShape(a.prop),p={x:a.x,z:a.z,y:a.y,type:a.prop,w:s.w,d:s.d,h:s.h,color:s.color,climbable:s.climbable};pushProp(cmd,p,cam,W,H,false);return;}
    const base=project({x:a.x,y:a.y,z:a.z},cam,W,H),head=project({x:a.x,y:a.y+a.height,z:a.z},cam,W,H);if(!base||!head)return;const depth=(base.z+head.z)/2;cmd.push({depth,draw:()=>drawCharacter(a,base,head,cam,W,H,isPlayer)});
  }
  function drawCharacter(a,base,head,cam,W,H,isPlayer){
    const dog=a.person.dog,scale=clamp((base.scale+head.scale)*.5,.28,1.9),x=base.x,bob=a.moveAmount*Math.sin(performance.now()*.018+a.index)*3*scale,groundY=base.y+bob,headY=head.y+bob,out=OUTFITS[a.person.id]||OUTFITS.kristen;
    ctx.save();ctx.globalAlpha=a.blind>0?.7:1;ctx.fillStyle='#0005';ctx.beginPath();ctx.ellipse(x,groundY+5,28*scale,8*scale,0,0,TAU);ctx.fill();
    if(dog){ctx.strokeStyle=out.top;ctx.lineWidth=13*scale;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(x-20*scale,groundY-20*scale);ctx.lineTo(x+18*scale,groundY-24*scale);ctx.stroke();ctx.lineWidth=6*scale;for(const lx of [-15,12]){ctx.beginPath();ctx.moveTo(x+lx*scale,groundY-18*scale);ctx.lineTo(x+lx*scale,groundY+1);ctx.stroke();}drawAvatarHead(a.person,x+23*scale,groundY-34*scale,15*scale,isPlayer);}
    else{
      const torsoTop=groundY-(a.height*.64)*base.scale,hipY=groundY-(a.height*.35)*base.scale,shoulder=30*scale,hip=20*scale;
      ctx.fillStyle=out.legs;ctx.strokeStyle=out.legs;ctx.lineWidth=11*scale;ctx.lineCap='round';const stride=a.moveAmount*Math.sin(performance.now()*.018+a.index)*12*scale;ctx.beginPath();ctx.moveTo(x-8*scale,hipY);ctx.lineTo(x-11*scale-stride*.35,groundY-3);ctx.moveTo(x+8*scale,hipY);ctx.lineTo(x+11*scale+stride*.35,groundY-3);ctx.stroke();ctx.strokeStyle=out.boots;ctx.lineWidth=7*scale;ctx.beginPath();ctx.moveTo(x-13*scale-stride*.35,groundY-3);ctx.lineTo(x-4*scale-stride*.35,groundY-3);ctx.moveTo(x+9*scale+stride*.35,groundY-3);ctx.lineTo(x+18*scale+stride*.35,groundY-3);ctx.stroke();
      ctx.fillStyle=out.top;ctx.beginPath();ctx.moveTo(x-shoulder,torsoTop);ctx.lineTo(x+shoulder,torsoTop);ctx.lineTo(x+hip,hipY);ctx.lineTo(x-hip,hipY);ctx.closePath();ctx.fill();
      ctx.strokeStyle=out.top;ctx.lineWidth=10*scale;ctx.beginPath();ctx.moveTo(x-shoulder*.8,torsoTop+5);ctx.lineTo(x-shoulder*1.15,hipY+4);ctx.stroke();
      const faceY=headY+15*scale;drawAvatarHead(a.person,x,faceY,20*scale,isPlayer);
      if(a.role==='hunter'){const muzzleWorld={x:a.x+Math.sin(a.yaw)*95,y:a.y+a.height*.58,z:a.z+Math.cos(a.yaw)*95},muzzle=project(muzzleWorld,cam,W,H),shoulderP=project({x:a.x,y:a.y+a.height*.58,z:a.z},cam,W,H);if(muzzle&&shoulderP){ctx.strokeStyle='#2d3436';ctx.lineWidth=8*scale;ctx.beginPath();ctx.moveTo(shoulderP.x,shoulderP.y);ctx.lineTo(muzzle.x,muzzle.y);ctx.stroke();ctx.strokeStyle='#b78c55';ctx.lineWidth=3*scale;ctx.beginPath();ctx.moveTo(lerp(shoulderP.x,muzzle.x,.35),lerp(shoulderP.y,muzzle.y,.35));ctx.lineTo(muzzle.x,muzzle.y);ctx.stroke();}}
    }
    if(isPlayer){ctx.strokeStyle='#f5d477';ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(x,groundY+6,32*scale,10*scale,0,0,TAU);ctx.stroke();}
    ctx.restore();
  }
  function drawAvatarHead(person,x,y,r,isPlayer){const img=AVATARS[person.id];ctx.save();ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.clip();if(img&&img.complete&&img.naturalWidth)ctx.drawImage(img,x-r,y-r,r*2,r*2);else{ctx.fillStyle='#a98255';ctx.fillRect(x-r,y-r,r*2,r*2);ctx.fillStyle='#fff';ctx.textAlign='center';ctx.fillText(person.short,x,y+3);}ctx.restore();ctx.strokeStyle=isPlayer?'#f7d77b':'#2a211a';ctx.lineWidth=isPlayer?3:2;ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.stroke();}
  function pushEffect(cmd,e,cam,W,H){const p=project({x:e.x,y:e.y,z:e.z},cam,W,H);if(!p)return;cmd.push({depth:p.z-.2,draw:()=>{if(e.kind==='spark'){ctx.fillStyle=e.color;ctx.beginPath();ctx.arc(p.x,p.y,clamp(3*p.scale,1.5,5),0,TAU);ctx.fill();}else{const q=1-e.life/e.max;ctx.strokeStyle=e.kind==='flash'?`rgba(255,245,180,${1-q})`:`rgba(255,245,215,${1-q})`;ctx.lineWidth=clamp(8*p.scale,2,10);ctx.beginPath();ctx.arc(p.x,p.y,(12+q*55)*p.scale,0,TAU);ctx.stroke();}}});}
  function poly(pts,fill){if(!pts.length)return;ctx.beginPath();ctx.moveTo(pts[0].x,pts[0].y);for(let i=1;i<pts.length;i++)ctx.lineTo(pts[i].x,pts[i].y);ctx.closePath();fill?ctx.fill():ctx.stroke();}
  function shade(hex,amt){const m=/^#([0-9a-f]{6})$/i.exec(hex);if(!m)return hex;let n=parseInt(m[1],16),r=n>>16,g=n>>8&255,b=n&255;const f=amt>=0?255:0,p=Math.abs(amt);r=Math.round(r+(f-r)*p);g=Math.round(g+(f-g)*p);b=Math.round(b+(f-b)*p);return`rgb(${r},${g},${b})`;}

  function modal(html,bind){closeModal();const back=document.createElement('div');back.className='modal-backdrop';back.id='ph3Modal';back.innerHTML=`<div class="modal">${html}</div>`;document.body.appendChild(back);if(bind)bind(back.querySelector('.modal'));}
  function closeModal(){document.getElementById('ph3Modal')?.remove();}

  // Exposed for the automated tryout suite and future multiplayer adapter.
  window.__PROP_3D_TEST__={MAPS,propShape,OUTFITS,getSnapshot:()=>state?{round:state.round,phase:state.phase,mapKey:state.mapKey,player:state.player?{x:state.player.x,y:state.player.y,z:state.player.z,vy:state.player.vy,role:state.player.role,locked:state.player.locked,prop:state.player.prop,propChanges:state.player.propChanges,decoys:state.player.decoys,flash:state.player.flash}:null}:null,features:{thirdPerson:true,jumpPhysics:true,climbableGeometry:true,computerPlayers:true,phoneControls:true,desktopControls:true,touchDpad:true,firstRoundHider:true,workingSelectors:true,sparks:true,propLock:true}};
  window.PropHunt={mount};
})();
