/*
 * Black Family Game Night - Family Prop Hunt 3D gameplay slice
 * v1.8.0-prop-redesign-test
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
  let setupSelection={charId:'john',outfit:0,style:'default',count:6,cameraSensitivity:1,botConfigs:[]};
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

  // v1.8 detailed illustrated prop sprites. These are cropped from the approved
  // cozy-cabin art direction and are reused for BOTH scenery and disguises.
  const PROP_SPRITE_FILES={
    lantern:'lantern.png',tableLamp:'table-lamp.png',coffeeMug:'coffee-mug.png',kettle:'kettle-copper.png',pan:'frying-pan.png',pie:'pie.png',bread:'bread.png',appleBasket:'apple-basket.png',
    firewood:'firewood-crate.png',pottedPine:'potted-pine.png',rockingHorse:'rocking-horse.png',teddy:'teddy-bear.png',framedPhoto:'framed-photo.png',boots:'cowboy-boots.png',books:'stacked-books.png',
    roundTable:'round-table.png',woodChair:'wood-chair.png',stool:'wood-stool.png',pillow:'throw-pillow.png',blankets:'blanket-stack.png',barrel:'wood-barrel.png',fridge:'old-fridge.png',
    metalKettle:'metal-kettle.png',crock:'ceramic-crock.png',blanketBasket:'blanket-basket.png',umbrellaStand:'umbrella-stand.png',clock:'cuckoo-clock.png',plant:'potted-plant.png',coatHooks:'coat-hooks.png',sideTable:'side-table.png',
    crate:'wood-crate.png',trunk:'green-trunk.png',basket:'woven-basket.png',produceCrate:'produce-crate.png',coatRack:'coat-rack.png',toyTruck:'toy-truck.png',foldedBlankets:'folded-blankets.png',fern:'fern.png',landscapePhoto:'landscape-photo.png',milkCan:'milk-can.png',copperLantern:'copper-lantern.png',rubberBoots:'rubber-boots.png',smallBasket:'small-basket.png'
  };
  const PROP_SPRITES=Object.create(null);
  function propSpriteKey(type){
    const n=String(type||'').toLowerCase();
    if(n.includes('table lamp')||n.includes('bedside lamp')||n==='lamp')return'tableLamp';
    if(n.includes('lantern'))return n.includes('copper')?'copperLantern':'lantern';
    if(n.includes('coffee mug')||n==='mug')return'coffeeMug';
    if(n.includes('frying')||n.includes('skillet')||n==='pan')return'pan';
    if(n.includes('teapot'))return'kettle'; if(n.includes('kettle'))return'metalKettle';
    if(n.includes('pie')||n.includes('cake'))return'pie'; if(n.includes('bread'))return'bread'; if(n.includes('apple'))return'appleBasket';
    if(n.includes('firewood')||n.includes('lumber')||n.includes('driftwood')||n==='log')return'firewood';
    if(n.includes('pine'))return'pottedPine'; if(n.includes('rocking horse'))return'rockingHorse'; if(n.includes('teddy'))return'teddy';
    if(n.includes('photo')||n.includes('painting'))return n.includes('landscape')?'landscapePhoto':'framedPhoto';
    if(n.includes('cowboy boot'))return'boots'; if(n.includes('rubber boot'))return'rubberBoots'; if(n==='boots'||n.includes(' boot'))return'boots';
    if(n.includes('book'))return'books'; if(n.includes('round table'))return'roundTable'; if(n.includes('stool'))return'stool'; if(n.includes('chair'))return'woodChair';
    if(n.includes('pillow'))return'pillow'; if(n.includes('folded blanket'))return'foldedBlankets'; if(n.includes('blanket basket'))return'blanketBasket'; if(n.includes('blanket'))return'blankets';
    if(n.includes('barrel'))return'barrel'; if(n.includes('fridge')||n.includes('refrigerator'))return'fridge'; if(n.includes('clock'))return'clock';
    if(n.includes('fern'))return'fern'; if(n.includes('plant')||n.includes('flower')||n.includes('succulent'))return'plant';
    if(n.includes('umbrella'))return'umbrellaStand'; if(n.includes('coat hook'))return'coatHooks'; if(n.includes('coat rack'))return'coatRack';
    if(n.includes('side table')||n.includes('dresser'))return'sideTable'; if(n.includes('produce crate')||n.includes('garden crate'))return'produceCrate'; if(n.includes('crate'))return'crate';
    if(n.includes('trunk')||n.includes('chest'))return'trunk'; if(n.includes('small basket'))return'smallBasket'; if(n.includes('basket'))return'basket';
    if(n.includes('toy truck'))return'toyTruck'; if(n.includes('milk can'))return'milkCan'; if(n.includes('crock'))return'crock';
    return null;
  }
  function getPropSprite(type){
    const key=propSpriteKey(type),file=key&&PROP_SPRITE_FILES[key]; if(!file||typeof Image==='undefined')return null;
    if(!PROP_SPRITES[key]){const im=new Image();im.decoding='async';im.src='/prop-sprites/'+file;PROP_SPRITES[key]=im;}
    return PROP_SPRITES[key];
  }

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


  // v1.7.0 expanded worlds: every launch map is substantially larger, with
  // additional themed rooms/areas, climb routes and room-specific clutter.
  function addExpandedZone(map,zone,boxes=[],props=[]){map.zones.push(zone);map.boxes.push(...boxes);map.props.push(...props);}
  function expandWorldMaps(){
    const papa=MAPS.papa;
    Object.assign(papa,{name:"Papa's Farm + Shop Complex",w:3900,d:2700,ambient:'Huge working farm complex · shop · garage · farmhouse · loft · animal yard · silo',zoneClutter:9,
      palette:['Toolbox','Gas Can','Oil Jug','Coffee Mug','Metal Lantern','Wooden Crate','Wooden Stool','Stack of Books','Thermos','Woven Basket','Kettle','Firewood Stack','Cowboy Boots','Blanket Stack','Potted Plant','Wheelbarrow','Feed Bucket','Hay Bale','Milk Can','Parts Crate']});
    addExpandedZone(papa,Z(1780,120,650,620,'WORKSHOP ANNEX','#77644f'),[
      B(1780,120,650,24,275,'Workshop back wall',{color:'#493a2f'}),B(1780,120,24,620,275,'Workshop side wall',{color:'#493a2f'}),B(2406,120,24,230,275,'Workshop divider wall',{color:'#493a2f'}),B(2406,500,24,240,275,'Workshop divider wall',{color:'#493a2f'}),
      B(1860,220,260,85,86,'Fabrication workbench',{climbable:true,color:'#6b4a2e'}),B(2140,220,180,95,120,'Welding bench',{climbable:true,color:'#55463b'}),B(1870,470,150,100,145,'Parts rack',{climbable:true,color:'#665744'}),B(2100,450,230,120,90,'Tool cart',{climbable:true,color:'#6c4b3c'})
    ],[E(1880,365,'Welding Helmet'),E(1940,375,'Extension Cord'),E(2050,380,'Gas Can'),E(2190,365,'Toolbox'),E(2290,390,'Oil Jug'),E(1990,610,'Metal Lantern'),E(2180,615,'Coffee Mug')]);
    addExpandedZone(papa,Z(2480,120,900,620,'GARAGE BAY','#6f6558'),[
      B(2480,120,900,24,285,'Garage back wall',{color:'#403a34'}),B(3356,120,24,620,285,'Garage side wall',{color:'#403a34'}),B(2480,716,330,24,285,'Garage front wall',{color:'#403a34'}),B(3040,716,340,24,285,'Garage front wall',{color:'#403a34'}),
      B(2600,280,420,190,155,'Service truck',{climbable:true,color:'#56656d',kind:'tractor'}),B(3090,250,180,110,100,'Tire rack',{climbable:true,color:'#44484b'}),B(2940,520,260,80,80,'Garage workbench',{climbable:true,color:'#6a4f36'})
    ],[E(2560,590,'Shop Vac'),E(2700,600,'Tire'),E(2790,580,'Tire'),E(2890,600,'Toolbox'),E(3220,590,'Gas Can'),E(3300,580,'Garbage Can')]);
    addExpandedZone(papa,Z(1780,800,720,430,'PARTS ROOM','#6b5c49'),[
      B(1780,800,720,24,250,'Parts room wall',{color:'#4b3d31'}),B(1780,800,24,430,250,'Parts room wall',{color:'#4b3d31'}),B(2476,800,24,160,250,'Parts room wall',{color:'#4b3d31'}),B(2476,1080,24,150,250,'Parts room wall',{color:'#4b3d31'}),B(1880,890,470,105,135,'Parts shelves',{climbable:true,color:'#5f523f'}),B(1900,1050,180,90,72,'Packing table',{climbable:true,color:'#76593c'})
    ],[E(2150,1080,'Parts Crate',{collider:true,climbable:true}),E(2260,1100,'Wooden Crate',{collider:true,climbable:true}),E(2360,1090,'Thermos')]);
    addExpandedZone(papa,Z(2570,800,760,430,'MEZZANINE / LOFT','#705b47'),[
      B(2630,900,520,260,160,'Loft platform',{climbable:true,color:'#6d5239'}),B(2510,1080,90,120,55,'Loft stairs 1',{climbable:true,color:'#7b5a3b'}),B(2560,1020,90,120,92,'Loft stairs 2',{climbable:true,color:'#7b5a3b'}),B(2610,960,90,120,126,'Loft stairs 3',{climbable:true,color:'#7b5a3b'}),B(2720,850,380,55,95,'Loft railing',{climbable:true,color:'#69503a'})
    ],[E(2810,1050,'Blanket Stack',{y:160}),E(2920,1060,'Stack of Books',{y:160}),E(3030,1050,'Wooden Crate',{y:160,collider:true,climbable:true})]);
    addExpandedZone(papa,Z(1760,1320,780,560,'FARMHOUSE LIVING ROOM','#75644f'),[
      B(1760,1320,780,24,255,'Farmhouse living wall',{color:'#4c3e32'}),B(1760,1320,24,560,255,'Farmhouse living wall',{color:'#4c3e32'}),B(2516,1320,24,200,255,'Farmhouse living wall',{color:'#4c3e32'}),B(2516,1660,24,220,255,'Farmhouse living wall',{color:'#4c3e32'}),B(1880,1460,240,120,85,'Farmhouse couch',{climbable:true,color:'#6d5d50',kind:'chair'}),B(2200,1470,160,100,65,'Coffee table',{climbable:true,color:'#805f3e'}),B(2310,1660,140,120,165,'Farmhouse fireplace',{color:'#4c3931',kind:'fireplace'})
    ],[E(1830,1630,'Table Lamp'),E(2210,1600,'Coffee Mug'),E(2290,1600,'Stack of Books'),E(1940,1770,'Throw Pillow'),E(2050,1770,'Potted Pine')]);
    addExpandedZone(papa,Z(2600,1320,760,560,'FARMHOUSE KITCHEN','#786a56'),[
      B(2600,1320,760,24,255,'Farmhouse kitchen wall',{color:'#4b4035'}),B(3336,1320,24,560,255,'Farmhouse kitchen wall',{color:'#4b4035'}),B(2710,1420,440,95,95,'Kitchen counter',{climbable:true,color:'#68704e'}),B(2790,1640,320,140,72,'Kitchen table',{climbable:true,color:'#845f3b'}),B(3170,1430,120,95,180,'Old fridge',{climbable:true,color:'#5d684e'})
    ],[E(2670,1570,'Kettle'),E(2750,1580,'Pie'),E(2850,1580,'Loaf of Bread'),E(2950,1580,'Jam Jar'),E(3070,1580,'Woven Basket'),E(3220,1720,'Apple Basket')]);
    addExpandedZone(papa,Z(1760,1940,820,500,'BASEMENT STORAGE','#5d554a'),[
      B(1760,1940,820,24,235,'Basement wall',{color:'#403a34'}),B(1760,1940,24,500,235,'Basement wall',{color:'#403a34'}),B(2556,1940,24,500,235,'Basement wall',{color:'#403a34'}),B(1890,2060,300,100,135,'Basement shelves',{climbable:true,color:'#5a5146'}),B(2260,2050,190,110,120,'Utility bench',{climbable:true,color:'#5d5348'})
    ],[E(1870,2310,'Wooden Chest',{collider:true,climbable:true}),E(2010,2310,'Blanket Stack'),E(2150,2310,'Milk Can'),E(2280,2310,'Woven Basket'),E(2410,2310,'Thermos')]);
    addExpandedZone(papa,Z(2660,1940,500,500,'SILO INTERIOR','#53514a'),[
      B(2680,2000,450,40,220,'Silo wall north',{color:'#4b4d4a'}),B(2680,2370,450,40,220,'Silo wall south',{color:'#4b4d4a'}),B(2680,2000,40,150,220,'Silo wall west',{color:'#4b4d4a'}),B(2680,2260,40,150,220,'Silo wall west',{color:'#4b4d4a'}),B(3090,2000,40,410,220,'Silo wall east',{color:'#4b4d4a'}),B(2780,2200,220,80,105,'Silo catwalk',{climbable:true,color:'#606261'}),B(3020,2140,55,230,160,'Silo ladder platform',{climbable:true,color:'#5a5d5c'})
    ],[E(2800,2320,'Feed Bag'),E(2900,2320,'Feed Barrel',{collider:true,climbable:true}),E(3000,2320,'Lantern')]);
    addExpandedZone(papa,Z(3200,900,600,1500,'FIELDS + ANIMAL YARD','#64724f'),[
      B(3300,1180,370,40,105,'Animal yard fence',{climbable:true,color:'#71573d'}),B(3300,1540,370,40,105,'Animal yard fence',{climbable:true,color:'#71573d'}),B(3300,1180,40,130,105,'Animal yard fence',{climbable:true,color:'#71573d'}),B(3300,1440,40,140,105,'Animal yard fence',{climbable:true,color:'#71573d'}),B(3630,1180,40,400,105,'Animal yard fence',{climbable:true,color:'#71573d'}),B(3370,1760,260,130,110,'Hay wagon',{climbable:true,color:'#8f7645'})
    ],[E(3400,1050,'Wheelbarrow'),E(3520,1060,'Waterer'),E(3450,1370,'Feed Bucket'),E(3540,1380,'Hay Bale',{collider:true,climbable:true}),E(3390,2070,'Firewood Stack',{collider:true,climbable:true}),E(3570,2070,'Wooden Crate',{collider:true,climbable:true})]);
    papa.animals.push(['White Goat',3450,1320],['Baby Goat',3520,1460],['Orange & Black Pig',3590,1320],['Peacock',3380,1660]);
    papa.landmarks.push('Workshop annex','Garage bay','Farmhouse','Basement','Silo interior','Fields');

    const camp=MAPS.camp;
    Object.assign(camp,{w:3600,d:2500,ambient:'Large lakeside campground · camper rooms · picnic grove · tents · dock · woods trail',zoneClutter:8,
      palette:['Lantern','Camp Chair','Cooler','Coffee Mug','Woven Basket','Firewood Stack','Table Lamp','Thermos','Dog Toy','Wooden Crate','Throw Pillow','Blanket Stack','Kettle','Stack of Books','Potted Plant','Rock','Driftwood']});
    addExpandedZone(camp,Z(2050,160,760,560,'PINE GROVE CAMPSITES','#49643f'),[
      B(2160,260,220,120,105,'Family tent 1',{climbable:true,color:'#786952'}),B(2460,320,250,140,115,'Family tent 2',{climbable:true,color:'#6f624f'}),B(2250,520,280,95,75,'Grove picnic table',{climbable:true,color:'#8a6846'})
    ],[E(2130,650,'Camp Chair'),E(2220,660,'Cooler'),E(2360,660,'Lantern'),E(2520,650,'Firewood Stack',{collider:true,climbable:true}),E(2680,660,'Dog Toy')]);
    addExpandedZone(camp,Z(2870,180,560,520,'UTILITY SHED + STORAGE','#635f50'),[
      B(2960,260,330,220,160,'Camp utility shed',{climbable:true,color:'#655744'}),B(3020,520,250,90,85,'Storage table',{climbable:true,color:'#70563e'})
    ],[E(2930,650,'Water Jug'),E(3060,650,'Wooden Crate',{collider:true,climbable:true}),E(3200,650,'Garbage Can'),E(3320,650,'Toolbox')]);
    addExpandedZone(camp,Z(170,1450,980,720,'GROUP CAMPSITE','#5c754c'),[
      B(260,1580,320,120,82,'Group picnic table',{climbable:true,color:'#8b6947'}),B(700,1550,250,145,115,'Large tent',{climbable:true,color:'#6f644f'}),B(450,1900,180,90,35,'Second fire pit',{color:'#5c4032',kind:'fireplace'}),B(800,1870,190,120,95,'Gear rack',{climbable:true,color:'#6f6557'})
    ],[E(230,1810,'Camp Chair'),E(320,1830,'Camp Chair'),E(600,1800,'Cooler'),E(720,1800,'Lantern'),E(920,1800,'Woven Basket'),E(1040,1800,'Blanket Stack')]);
    addExpandedZone(camp,Z(1230,1500,760,520,'BOAT LAUNCH + TRAILER','#657269'),[
      B(1350,1620,310,130,105,'Boat trailer',{climbable:true,color:'#72716b'}),B(1660,1630,240,120,95,'Fishing boat',{climbable:true,color:'#657c82'}),B(1340,1910,220,85,70,'Dock gear',{climbable:true,color:'#72604b'})
    ],[E(1310,2100,'Cooler'),E(1450,2100,'Water Jug'),E(1580,2100,'Tackle Crate',{collider:true,climbable:true}),E(1750,2100,'Thermos')]);
    addExpandedZone(camp,Z(2050,1120,950,360,'LAKE DOCK','#5c7d80'),[
      B(2160,1210,560,65,52,'Dock platform',{climbable:true,color:'#856a4b'}),B(2570,1280,170,100,65,'Dock bench',{climbable:true,color:'#766047'})
    ],[E(2200,1390,'Lantern'),E(2350,1390,'Fishing Crate',{collider:true,climbable:true}),E(2500,1390,'Cooler'),E(2730,1390,'Driftwood',{collider:true,climbable:true})]);
    addExpandedZone(camp,Z(2070,1580,1180,620,'WOODS TRAIL + OVERFLOW SITE','#405b3a'),[
      B(2220,1740,90,100,70,'Trail rocks',{climbable:true,color:'#777369'}),B(2510,1880,130,120,82,'Fallen log',{climbable:true,color:'#7c5d40'}),B(2850,1770,230,130,100,'Overflow tent',{climbable:true,color:'#74644f'})
    ],[E(2180,2110,'Rock',{collider:true,climbable:true}),E(2400,2100,'Firewood Stack',{collider:true,climbable:true}),E(2700,2090,'Lantern'),E(3000,2100,'Camp Chair')]);
    camp.landmarks.push('Pine grove','Group campsite','Boat launch','Dock','Woods trail','Utility shed');

    const acreage=MAPS.acreage;
    Object.assign(acreage,{w:4200,d:3000,ambient:'Expanded family acreage · shops · garden · woods · dugout · field · play yard · goat barn',zoneClutter:9,
      palette:['Garbage Can','Flower Pot','Cooler','Lawn Chair','Tire','Toolbox','Garden Crate','Watering Can','Wheelbarrow','Firewood Stack','Rock','Stump','Log','Storage Bin','Pool Float','Wooden Crate','Thermos','Woven Basket','Cowboy Boots','Blanket Stack']});
    addExpandedZone(acreage,Z(2380,120,720,520,'BIG GARAGE','#6d6256'),[
      B(2460,220,520,220,160,'Garage work bay',{climbable:true,color:'#62584f'}),B(2530,480,300,90,85,'Garage bench',{climbable:true,color:'#67503d'})
    ],[E(2440,650,'Toolbox'),E(2570,650,'Gas Can'),E(2700,650,'Tire'),E(2830,650,'Shop Vac'),E(2960,650,'Garbage Can')]);
    addExpandedZone(acreage,Z(3150,100,800,600,'FRONT YARD + DRIVEWAY','#69715f'),[
      B(3280,260,360,150,120,'Family truck',{climbable:true,color:'#666c70'}),B(3680,280,180,120,90,'Utility trailer',{climbable:true,color:'#79736c'})
    ],[E(3240,600,'Flower Pot'),E(3390,610,'Garbage Can'),E(3530,600,'Rock',{collider:true,climbable:true}),E(3780,610,'Garden Crate')]);
    addExpandedZone(acreage,Z(2360,760,760,650,'PLAY YARD','#5f7b50'),[
      B(2470,880,220,220,62,'Second trampoline',{climbable:true,bounce:450,color:'#3b4d56'}),B(2780,850,230,210,120,'Pool deck',{climbable:true,color:'#6b8090'}),B(2520,1190,330,85,90,'Play bench',{climbable:true,color:'#7a6045'})
    ],[E(2430,1320,'Pool Float'),E(2580,1320,'Dog Toy'),E(2750,1320,'Cooler'),E(2910,1320,'Lawn Chair')]);
    addExpandedZone(acreage,Z(3160,780,850,700,'ORCHARD + WOODLOT','#47613e'),[
      B(3310,940,120,220,190,'Orchard trees',{color:'#46563d'}),B(3510,920,120,230,185,'Orchard trees',{color:'#46563d'}),B(3730,950,120,220,195,'Orchard trees',{color:'#46563d'}),B(3360,1240,350,85,80,'Woodpile shelter',{climbable:true,color:'#71553c'})
    ],[E(3240,1370,'Firewood Stack',{collider:true,climbable:true}),E(3440,1380,'Apple Basket'),E(3650,1380,'Woven Basket'),E(3870,1370,'Rock',{collider:true,climbable:true})]);
    addExpandedZone(acreage,Z(2380,1580,760,620,'GOAT BARN','#6f604b'),[
      B(2480,1700,460,260,165,'Goat barn',{climbable:true,color:'#6d5945'}),B(2520,2070,320,80,95,'Goat platform',{climbable:true,color:'#80613f'})
    ],[E(2440,2200,'Feed Bucket'),E(2580,2200,'Hay Bale',{collider:true,climbable:true}),E(2750,2200,'Waterer'),E(2910,2200,'Feed Bag')]);
    addExpandedZone(acreage,Z(3200,1580,840,650,'BACK FIELD + TRAILER LANE','#64764f'),[
      B(3360,1700,300,120,100,'Equipment trailer',{climbable:true,color:'#77716a'}),B(3730,1730,200,150,140,'Field sea can',{climbable:true,color:'#6b725d'})
    ],[E(3260,2140,'Pallet',{collider:true,climbable:true}),E(3430,2140,'Wheelbarrow'),E(3600,2140,'Wooden Crate',{collider:true,climbable:true}),E(3900,2140,'Firewood Stack',{collider:true,climbable:true})]);
    addExpandedZone(acreage,Z(2450,2320,1450,480,'DUGOUT DOCK + SOUTH FIELD','#58786c'),[
      B(2590,2420,620,65,50,'Dugout dock',{climbable:true,color:'#81684b'}),B(3370,2420,380,100,75,'Field hay wagon',{climbable:true,color:'#8e7646'})
    ],[E(2550,2720,'Lawn Chair'),E(2720,2720,'Cooler'),E(2920,2720,'Fishing Crate',{collider:true,climbable:true}),E(3450,2720,'Hay Bale',{collider:true,climbable:true})]);
    acreage.animals.push(['White Goat',2700,1950],['Baby Goat',2790,2010],['Peacock',3500,1200]);
    acreage.landmarks.push('Big garage','Play yard','Orchard','Goat barn','Back field','Dugout dock');

    const farm=MAPS.farm;
    Object.assign(farm,{w:3800,d:2800,ambient:'Expanded farmyard · coop interiors · feed shed · goat barn · pig barn · tractor shed · silo · pasture',zoneClutter:9,
      palette:['Feed Bucket','Waterer','Chicken Feeder','Shovel','Wooden Crate','Feed Bag','Hay Bale','Garbage Can','Wheelbarrow','Trough','Feed Barrel','Pallet','Milk Can','Woven Basket','Lantern','Thermos','Boots','Firewood Stack']});
    addExpandedZone(farm,Z(2240,120,650,560,'TRACTOR SHED','#6c624f'),[
      B(2320,220,460,260,170,'Tractor shed',{climbable:true,color:'#665746'}),B(2380,520,230,90,90,'Repair bench',{climbable:true,color:'#6a513b'})
    ],[E(2290,650,'Toolbox'),E(2430,650,'Gas Can'),E(2580,650,'Tire'),E(2730,650,'Shovel')]);
    addExpandedZone(farm,Z(2940,120,700,560,'FEED SHED','#74654d'),[
      B(3020,220,500,240,160,'Feed shed',{climbable:true,color:'#6d5d47'}),B(3090,510,310,95,120,'Feed shelves',{climbable:true,color:'#665744'})
    ],[E(2990,650,'Feed Bag'),E(3110,650,'Feed Barrel',{collider:true,climbable:true}),E(3230,650,'Hay Bale',{collider:true,climbable:true}),E(3370,650,'Waterer')]);
    addExpandedZone(farm,Z(2230,760,760,600,'GOAT BARN + LOFT','#766149'),[
      B(2320,880,480,270,175,'Goat barn',{climbable:true,color:'#6b5944'}),B(2400,1180,300,100,105,'Goat loft stairs',{climbable:true,color:'#7e5f3e'}),B(2460,980,260,120,145,'Goat loft platform',{climbable:true,color:'#74583c'})
    ],[E(2280,1310,'Feed Bucket'),E(2440,1310,'Hay Bale',{collider:true,climbable:true}),E(2600,1310,'Trough',{collider:true,climbable:true}),E(2810,1310,'Lantern')]);
    addExpandedZone(farm,Z(3050,760,650,600,'PIG BARN + WALLOW','#705947'),[
      B(3130,870,420,230,165,'Pig barn',{climbable:true,color:'#655242'}),B(3150,1160,360,130,25,'Big pig wallow',{color:'#584637',solid:false})
    ],[E(3090,1320,'Feed Bucket'),E(3240,1320,'Trough',{collider:true,climbable:true}),E(3430,1320,'Feed Barrel',{collider:true,climbable:true})]);
    addExpandedZone(farm,Z(2260,1450,700,500,'COOP INTERIOR + HATCHERY','#806b4d'),[
      B(2350,1550,430,230,160,'Large chicken coop',{climbable:true,color:'#745f44'}),B(2400,1830,240,80,90,'Nest wall',{climbable:true,color:'#7e6646'})
    ],[E(2290,1950,'Chicken Feeder'),E(2420,1950,'Waterer'),E(2560,1950,'Wooden Crate',{collider:true,climbable:true}),E(2730,1950,'Woven Basket')]);
    addExpandedZone(farm,Z(3030,1450,650,500,'SILO + GRAIN ROOM','#5f5d54'),[
      B(3130,1530,420,40,220,'Silo north wall',{color:'#51534f'}),B(3130,1840,420,40,220,'Silo south wall',{color:'#51534f'}),B(3130,1530,40,100,220,'Silo west wall',{color:'#51534f'}),B(3130,1750,40,130,220,'Silo west wall',{color:'#51534f'}),B(3510,1530,40,350,220,'Silo east wall',{color:'#51534f'}),B(3240,1660,200,95,115,'Grain platform',{climbable:true,color:'#62625c'})
    ],[E(3090,1950,'Milk Can'),E(3220,1950,'Feed Bag'),E(3350,1950,'Feed Barrel',{collider:true,climbable:true}),E(3480,1950,'Lantern')]);
    addExpandedZone(farm,Z(2200,2070,1480,560,'PASTURE + EQUIPMENT YARD','#64784c'),[
      B(2360,2220,300,120,95,'Hay wagon',{climbable:true,color:'#8f7545'}),B(2800,2200,320,160,150,'Equipment sea can',{climbable:true,color:'#6c705a'}),B(3260,2220,250,130,105,'Farm trailer',{climbable:true,color:'#747069'})
    ],[E(2260,2540,'Hay Bale',{collider:true,climbable:true}),E(2440,2540,'Wheelbarrow'),E(2670,2540,'Pallet',{collider:true,climbable:true}),E(2940,2540,'Wooden Crate',{collider:true,climbable:true}),E(3210,2540,'Feed Bucket'),E(3440,2540,'Firewood Stack',{collider:true,climbable:true})]);
    farm.animals.push(['Chicken',2450,1760],['Turkey',2550,1760],['Peacock',2700,1680],['White Goat',2520,1120],['Baby Goat',2660,1200],['Orange & Black Pig',3300,1050]);
    farm.landmarks.push('Tractor shed','Feed shed','Goat barn','Pig barn','Hatchery','Silo','Pasture');
  }
  expandWorldMaps();

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
    if(t.includes('table lamp')||t==='lamp')return{w:38,d:38,h:62,color:'#b48a56',collider:false,climbable:false,kind:'lamp'};
    if(t.includes('pine')||t.includes('potted plant')||t.includes('succulent'))return{w:42,d:42,h:62,color:'#5f774c',collider:false,climbable:false,kind:'plant'};
    if(t.includes('photo')||t.includes('painting'))return{w:48,d:14,h:48,color:'#8b6440',collider:false,climbable:false,kind:'frame'};
    if(t.includes('book'))return{w:48,d:34,h:34,color:'#5d6a67',collider:false,climbable:false,kind:'books'};
    if(t.includes('candle'))return{w:18,d:18,h:38,color:'#e9d6a4',collider:false,climbable:false,kind:'candle'};
    if(t.includes('rug'))return{w:82,d:48,h:22,color:'#8b5140',collider:false,climbable:false,kind:'rug'};
    if(t.includes('clock'))return{w:42,d:28,h:55,color:'#765639',collider:false,climbable:false,kind:'clock'};
    if(t.includes('blanket'))return{w:58,d:44,h:42,color:'#8b5e45',collider:true,climbable:true,kind:'blankets'};
    if(t.includes('thermos'))return{w:24,d:24,h:50,color:'#a04f43',collider:false,climbable:false,kind:'thermos'};
    if(t.includes('basket'))return{w:48,d:40,h:38,color:'#9c744a',collider:false,climbable:false,kind:'basket'};
    if(t.includes('kettle')||t.includes('teapot'))return{w:42,d:38,h:42,color:'#777674',collider:false,climbable:false,kind:'kettle'};
    if(t.includes('pie')||t.includes('cake'))return{w:52,d:52,h:34,color:'#b9854e',collider:false,climbable:false,kind:'food'};
    if(t.includes('bread'))return{w:54,d:30,h:30,color:'#bd8950',collider:false,climbable:false,kind:'bread'};
    if(t.includes('cutting board'))return{w:58,d:28,h:12,color:'#9b7248',collider:false,climbable:false,kind:'board'};
    if(t.includes('jam jar'))return{w:22,d:22,h:34,color:'#93443e',collider:false,climbable:false,kind:'jar'};
    if(t.includes('round table'))return{w:92,d:92,h:72,color:'#7a583b',collider:true,climbable:true,kind:'furniture'};
    if(t.includes('armchair')||t.includes('rocking chair'))return{w:72,d:72,h:92,color:'#766149',collider:true,climbable:true,kind:'furniture'};
    if(t.includes('dresser')||t.includes('side table'))return{w:62,d:45,h:62,color:'#7a583b',collider:true,climbable:true,kind:'furniture'};
    if(t.includes('teddy'))return{w:38,d:32,h:48,color:'#9c7048',collider:false,climbable:false,kind:'toy'};
    if(t.includes('toy truck'))return{w:46,d:28,h:30,color:'#a4513e',collider:false,climbable:false,kind:'toy'};
    if(t.includes('chest')||t.includes('trunk'))return{w:70,d:50,h:50,color:'#715238',collider:true,climbable:true,kind:'chest'};
    if(t.includes('towel'))return{w:46,d:36,h:32,color:'#b9b29f',collider:false,climbable:false,kind:'linen'};
    if(t.includes('soap'))return{w:24,d:22,h:34,color:'#8a684d',collider:false,climbable:false,kind:'bottle'};
    if(t.includes('toothbrush'))return{w:24,d:24,h:40,color:'#927356',collider:false,climbable:false,kind:'cup'};
    if(t.includes('bath mat'))return{w:58,d:42,h:12,color:'#647066',collider:false,climbable:false,kind:'mat'};
    if(t.includes('rubber duck'))return{w:32,d:28,h:28,color:'#d7ad45',collider:false,climbable:false,kind:'duck'};
    if(t.includes('toilet paper'))return{w:32,d:28,h:32,color:'#e5ded0',collider:false,climbable:false,kind:'roll'};
    if(t.includes('pan')||t.includes('skillet'))return{w:52,d:32,h:20,color:'#3e4140',collider:false,climbable:false,kind:'pan'};
    if(t.includes('apple'))return{w:48,d:40,h:36,color:'#8f5b42',collider:false,climbable:false,kind:'fruit'};
    if(t.includes('rocking horse'))return{w:62,d:34,h:58,color:'#92683f',collider:true,climbable:true,kind:'toy'};
    if(t.includes('fridge'))return{w:68,d:58,h:120,color:'#62705d',collider:true,climbable:true,kind:'appliance'};
    if(t.includes('coat rack')||t.includes('umbrella'))return{w:38,d:38,h:90,color:'#75553a',collider:false,climbable:false,kind:'rack'};
    if(t.includes('milk can'))return{w:34,d:34,h:52,color:'#7b7c78',collider:false,climbable:false,kind:'can'};
    if(t.includes('boot'))return{w:44,d:36,h:46,color:'#65452f',collider:false,climbable:false,kind:'boots'};
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

  const STYLE_PACKS=[['default','Default'],['anime','Anime'],['western','Western'],['rich','Rich'],['homeless','Homeless'],['country','Country'],['chinese','Chinese-inspired'],['african-american','African American-inspired'],['native-american','Native American-inspired'],['south-asian','South Asian-inspired'],['korean','Korean-inspired'],['superhero','Superhero'],['criminal','Criminal Crew']];
  const FULL_BODY_STYLES=new Set(['country','rich','rustic']);
  function avatarPath(id){return id==='john'?'/avatars/john-black.png':`/avatars/${id}.png`;}
  function stylePortrait(p,style='default'){return style==='default'?avatarPath(p.id):`/avatars/family-packs/${style}/${p.id}.jpg`;}
  function phSprite(p,style='default'){return FULL_BODY_STYLES.has(style)?`/characters3d/themes/${style}/${p.id}.png`:`/characters3d/${p.id}.png`;}
  const CHARACTER_SPRITES=new Map();
  const BODY_SPRITES=CHARACTER_SPRITES;
  function characterSprite(person,style='default'){const key=`${style}:${person.id}`;if(CHARACTER_SPRITES.has(key))return CHARACTER_SPRITES.get(key);const img=new Image();img.decoding='async';img.src=phSprite(person,style);CHARACTER_SPRITES.set(key,img);return img;}
  function preloadCharacterSprites(){for(const person of P())for(const style of ['default','country','rich'])characterSprite(person,style);}
  preloadCharacterSprites();
  function phEnsureBots(count,humanId){const need=Math.max(0,count-1),pool=P().filter(p=>p.id!==humanId);while(setupSelection.botConfigs.length<need){const q=pool[setupSelection.botConfigs.length%pool.length];setupSelection.botConfigs.push({charId:q.id,style:'default',difficulty:'medium'})}setupSelection.botConfigs.length=need}
  function phBotRows(){return setupSelection.botConfigs.map((b,i)=>`<div class="ph3-bot-row"><span>Computer ${i+1}</span><select class="select" data-ph3-bot-char="${i}">${P().map(p=>`<option value="${p.id}" ${p.id===b.charId?'selected':''}>${p.name}</option>`).join('')}</select><select class="select" data-ph3-bot-style="${i}">${STYLE_PACKS.map(([id,label])=>`<option value="${id}" ${id===(b.style||'default')?'selected':''}>${label}</option>`).join('')}</select><select class="select" data-ph3-bot-diff="${i}"><option value="easy" ${b.difficulty==='easy'?'selected':''}>Easy</option><option value="medium" ${b.difficulty==='medium'?'selected':''}>Medium</option><option value="hard" ${b.difficulty==='hard'?'selected':''}>Hard</option></select></div>`).join('')}
  function phCaptureBots(){root?.querySelectorAll('[data-ph3-bot-char]').forEach(el=>{const i=Number(el.dataset.ph3BotChar);if(setupSelection.botConfigs[i])setupSelection.botConfigs[i].charId=el.value});root?.querySelectorAll('[data-ph3-bot-style]').forEach(el=>{const i=Number(el.dataset.ph3BotStyle);if(setupSelection.botConfigs[i])setupSelection.botConfigs[i].style=el.value});root?.querySelectorAll('[data-ph3-bot-diff]').forEach(el=>{const i=Number(el.dataset.ph3BotDiff);if(setupSelection.botConfigs[i])setupSelection.botConfigs[i].difficulty=el.value})}
  function phBindBotRows(){root.querySelectorAll('[data-ph3-bot-char]').forEach(el=>el.onchange=()=>{setupSelection.botConfigs[Number(el.dataset.ph3BotChar)].charId=el.value});root.querySelectorAll('[data-ph3-bot-style]').forEach(el=>el.onchange=()=>{setupSelection.botConfigs[Number(el.dataset.ph3BotStyle)].style=el.value});root.querySelectorAll('[data-ph3-bot-diff]').forEach(el=>el.onchange=()=>{setupSelection.botConfigs[Number(el.dataset.ph3BotDiff)].difficulty=el.value})}

  function renderSetup(){
    const defaultSelected=setupSelection.charId||'john';
    root.innerHTML=`
      <div class="game-title-row"><div><span class="eyebrow">THIRD-PERSON 3D FAMILY GAME</span><h1>Family Prop Hunt</h1><p class="subtext">Run as a visible full-body family character, jump and climb the map, transform into the exact same illustrated props you see in the world, and hunt in third person on phone or computer.</p></div><span class="pill">1–13 family characters</span></div>
      <div class="setup-grid">
        <section class="panel panel-pad"><h2>Choose your character</h2><p class="subtext">Choose the family member or dog first. Outfit choices appear on the next screen.</p><div id="ph3Chars" class="ph3-character-grid">${P().map(p=>`<button class="ph3-character-card ${p.id===defaultSelected?'selected':''}" data-id="${p.id}"><div><img src="${phSprite(p,'default')}" alt="${p.name} full-body character"></div><strong>${p.name}</strong><small>${p.dog?'Animated dog player':(OUTFITS[p.id]?.label||'animated family character')}</small></button>`).join('')}</div></section>
        <section class="panel panel-pad"><h2>Expanded Prop Hunt world</h2><div class="ph3-preview-stack"><img src="/prop-hunt-approved-scene.png" alt="Approved Prop Hunt gameplay look"><img src="/prop-hunt-expanded-farm-overview.png" alt="Expanded Papa's Farm Prop Hunt map"><div class="ph3-preview-pair"><img src="/prop-hunt-expanded-props.png" alt="Expanded cartoon prop collection"><img src="/prop-hunt-cabin-map.png" alt="Large multi-room cabin map"></div></div><p class="subtext">The test build now spreads detailed cartoon props through much larger rooms and outdoor areas. Every scenery prop remains a valid disguise target when its type is enabled in that map.</p><button id="ph3Next" class="btn success" style="width:100%;margin-top:12px">NEXT: OUTFIT & MATCH</button></section>
      </div>`;
    root.querySelectorAll('#ph3Chars [data-id]').forEach(b=>b.addEventListener('click',()=>{setupSelection.charId=b.dataset.id;root.querySelectorAll('#ph3Chars [data-id]').forEach(x=>x.classList.toggle('selected',x===b));const next=root.querySelector('#ph3Next');if(next)next.textContent=`NEXT: ${b.querySelector('strong')?.textContent||'CHARACTER'} OUTFIT & MATCH`;}));
    root.querySelector('#ph3Next').addEventListener('click',()=>renderPropOutfit(setupSelection.charId||defaultSelected));
  }

  function renderPropOutfit(fallback='john'){
    const charId=setupSelection.charId||fallback,person=P().find(p=>p.id===charId)||P()[0];phEnsureBots(setupSelection.count,person.id);
    const labels=person.dog?['Classic','Playful','Rugged','Party']:['Casual','Western','Plaid','Sporty','Winter','Dressy'];
    const imageFor=i=>person.id==='john'?`/avatars/styles/john-look-${String(Math.min(16,i+1)).padStart(2,'0')}.jpg`:`/avatars/styles/${person.id}-${['cute','rugged','glam','goofy'][i%4]}.jpg`;
    root.innerHTML=`<div class="game-title-row"><div><span class="eyebrow">CHARACTER LOCK-IN</span><h1>${person.name}</h1><p class="subtext">Pick the avatar look you want to represent, then tune controls and computer players.</p></div><button id="ph3Back" class="btn secondary">← Back to Characters</button></div><div class="setup-grid"><section class="panel panel-pad"><div class="ph3-outfit-figure"><img src="${phSprite(person,setupSelection.style)}" alt="${person.name}"><div><h2>${person.name}</h2><p class="subtext">The game uses a full-body movement figure. Approved portrait styles also appear in the HUD and player setup.</p></div></div><h3>Avatar style</h3><div class="ph3-style-grid">${STYLE_PACKS.map(([id,label])=>`<button class="ph3-style-choice ${setupSelection.style===id?'selected':''}" data-ph3-style="${id}"><img src="${stylePortrait(person,id)}" alt="${person.name} ${label}"><span>${label}</span></button>`).join('')}</div><h3>Outfit accent</h3><div class="look-grid">${labels.map((n,i)=>`<button class="look-choice ${setupSelection.outfit===i?'selected':''}" data-ph3-outfit="${i}"><img src="${imageFor(i)}" alt="${person.name} ${n}"><span><b>${i+1}</b>${n}</span></button>`).join('')}</div></section><section class="panel panel-pad"><h2>Match setup</h2><label class="field-label">Total players</label><select id="ph3Count" class="select">${Array.from({length:12},(_,i)=>i+2).map(n=>`<option ${n===setupSelection.count?'selected':''}>${n}</option>`).join('')}</select><br><br><label class="field-label">Mode</label><select id="ph3Mode" class="select"><option value="classic">Classic · caught hiders spectate</option><option value="chaos">Family Chaos · caught hiders join hunters</option></select><br><br><label class="field-label">3D map</label><select id="ph3Map" class="select"><option value="rotate">Rotate all four maps</option>${Object.entries(MAPS).map(([k,m])=>`<option value="${k}">${m.name}</option>`).join('')}</select><br><br><label class="field-label">Camera sensitivity</label><select id="ph3Sensitivity" class="select"><option value="0.72" ${setupSelection.cameraSensitivity===.72?'selected':''}>Gentle</option><option value="1" ${setupSelection.cameraSensitivity===1?'selected':''}>Normal</option><option value="1.35" ${setupSelection.cameraSensitivity===1.35?'selected':''}>Fast</option></select><div class="ph3-bot-head"><strong>Computer players</strong><span>Character · look · difficulty</span></div><div id="ph3BotRows" class="ph3-bot-rows">${phBotRows()}</div><div class="stat-card" style="margin-top:14px"><strong>Movement overhaul active</strong><p class="subtext">Large analog joystick · D-pad backup · camera drag zone · jump buffer/coyote time · sprint toggle · camera reset · climbable map geometry · identical disguise/scenery prop art.</p></div><button id="ph3Start" class="btn success" style="width:100%;margin-top:12px">START 3D MATCH</button></section></div>`;
    root.querySelector('#ph3Back').onclick=renderSetup;
    root.querySelectorAll('[data-ph3-style]').forEach(b=>b.onclick=()=>{setupSelection.style=b.dataset.ph3Style;renderPropOutfit(person.id)});
    root.querySelectorAll('[data-ph3-outfit]').forEach(b=>b.onclick=()=>{setupSelection.outfit=Number(b.dataset.ph3Outfit);root.querySelectorAll('[data-ph3-outfit]').forEach(x=>x.classList.toggle('selected',x===b));});
    const count=root.querySelector('#ph3Count');count.onchange=()=>{phCaptureBots();setupSelection.count=Number(count.value);phEnsureBots(setupSelection.count,person.id);renderPropOutfit(person.id)};phBindBotRows();
    root.querySelector('#ph3Sensitivity').onchange=e=>setupSelection.cameraSensitivity=Number(e.target.value)||1;
    root.querySelector('#ph3Start').onclick=()=>{phCaptureBots();startMatch({charId:person.id,outfit:setupSelection.outfit,style:setupSelection.style,count:setupSelection.count,cameraSensitivity:setupSelection.cameraSensitivity,botConfigs:setupSelection.botConfigs.map(x=>({...x})),mode:root.querySelector('#ph3Mode').value,mapKey:root.querySelector('#ph3Map').value})};
  }
  function startMatch(opts){
    const human=P().find(p=>p.id===opts.charId)||P()[0];phEnsureBots(opts.count,human.id);const configs=(opts.botConfigs?.length?opts.botConfigs:setupSelection.botConfigs).slice(0,opts.count-1);const family=[human,...configs.map(c=>P().find(p=>p.id===c.charId)||P()[1])];opts.botConfigs=configs;
    state={opts,family,round:0,wins:{hiders:0,hunters:0},feed:[],running:true,mapKey:null,map:null,player:null,actors:[],props:[],animals:[],effects:[],camera:{yaw:0,pitch:.24,distance:355,fov:720,aiming:false},phase:'hide',phaseLeft:30*TEST_SCALE,tauntIn:30*TEST_SCALE,shotCooldown:0,locked:false,nearProp:null,roundResult:null,botHunterMemory:[],screenShake:0,visitedZones:new Set()};
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
    state.actors=state.family.map((person,i)=>makeActor(person,i,hunterIndexes.includes(i)?'hunter':'hider',i!==0,i===0?'human':(state.opts.botConfigs[i-1]?.difficulty||'medium'),i===0?(state.opts.style||'default'):(state.opts.botConfigs[i-1]?.style||'default')));
    state.player=state.actors[0];state.player.bot=false;
    state.props=buildProps(state.map);state.animals=buildAnimals(state.map);scatterActors();placeHumanNearPlayableProp();
    for(const a of state.actors.filter(a=>a.role==='hider'&&a.bot))botChooseInitialProp(a);
    state.camera.yaw=state.player.yaw;state.camera.pitch=.28;state.camera.distance=state.player.role==='hunter'?360:330;
    state.feed=[`Round ${state.round}: ${state.map.name}. ${huntersNeeded} hunter${huntersNeeded>1?'s':''}.`,state.player.role==='hunter'?'You are hunting this round. Hiders have 30 seconds.':'You are hiding. Find a believable prop and get positioned.'];
    renderGame();
  }

  function makeActor(person,index,role,bot,botDifficulty='medium',style='default'){
    return{person,index,role,bot,botDifficulty,style,alive:true,x:0,y:0,z:0,vy:0,yaw:0,r:22,height:person.dog?62:118,speed:role==='hunter'?182:172,runSpeed:role==='hunter'?270:255,sprintToggle:false,health:3,prop:null,propShape:null,propChanges:3,decoys:10,flash:1,locked:false,ammo:30,reload:0,blind:0,moveAmount:0,jumpBuffer:0,coyote:.12,ai:{target:null,timer:0,detected:null,shot:0,decoyTimer:rand(5,10),changeTimer:rand(8,15)}};
  }

  function scatterActors(){
    const m=state.map,base=m.spawn;state.actors.forEach((a,i)=>{a.x=clamp(base.x+(i%4)*70,70,m.w-70);a.z=clamp(base.z+Math.floor(i/4)*70,70,m.d-70);a.y=groundSupport(a.x,a.z,0);a.yaw=rand(-Math.PI,Math.PI);});
  }
  function placeHumanNearPlayableProp(){
    const p=state.player;if(!p||p.role!=='hider'||!state.props.length)return;let near=null,best=Infinity;for(const q of state.props){const d=Math.hypot(q.x-state.map.spawn.x,q.z-state.map.spawn.z);if(d<best){best=d;near=q}}if(!near)return;const angle=Math.atan2(state.map.spawn.x-near.x,state.map.spawn.z-near.z);p.x=clamp(near.x+Math.sin(angle||0)*105,40,state.map.w-40);p.z=clamp(near.z+Math.cos(angle||0)*105,40,state.map.d-40);if(pointInsideAnySolid(p.x,p.z,state.map.boxes,p.r)){p.x=clamp(near.x+110,40,state.map.w-40);p.z=clamp(near.z+20,40,state.map.d-40)}p.y=groundSupport(p.x,p.z,0);p.yaw=Math.atan2(near.x-p.x,near.z-p.z);state.camera.yaw=p.yaw;}

  function seededUnit(n){const x=Math.sin(n*12.9898+78.233)*43758.5453;return x-Math.floor(x);}
  function zonePropPalette(name,map){
    const n=String(name||'').toLowerCase();
    if(/living|lodge|front room|games room/.test(n))return['Table Lamp','Coffee Mug','Framed Photo','Stack of Books','Throw Pillow','Blanket Stack','Potted Plant','Candle','Cuckoo Clock','Wooden Stool','Woven Basket','Cowboy Boots','Wooden Crate'];
    if(/kitchen|dining|pantry/.test(n))return['Kettle','Teapot','Pie','Birthday Cake','Loaf of Bread','Cutting Board','Jam Jar','Apple Basket','Coffee Mug','Wooden Stool','Woven Basket','Potted Plant','Wooden Crate'];
    if(/bed|bunk|loft|closet/.test(n))return['Blanket Stack','Bedside Lamp','Teddy Bear','Toy Truck','Wooden Chest','Alarm Clock','Cowboy Boots','Stack of Books','Potted Plant','Woven Basket','Throw Pillow'];
    if(/bath/.test(n))return['Towel Stack','Soap Dispenser','Toothbrush Cup','Woven Basket','Small Succulent','Bath Mat','Rubber Duck','Toilet Paper Roll','Wooden Stool'];
    if(/mudroom|entry|porch/.test(n))return['Cowboy Boots','Rubber Boots','Coat Rack','Umbrella Stand','Woven Basket','Wooden Crate','Table Lamp','Potted Plant','Thermos'];
    if(/workshop|garage|parts|shop|repair/.test(n))return['Toolbox','Gas Can','Oil Jug','Metal Lantern','Wooden Crate','Wooden Stool','Thermos','Milk Can','Tire','Firewood Stack','Cowboy Boots','Woven Basket'];
    if(/barn|feed|coop|hatch|animal|pig|goat|pasture|field|silo|yard/.test(n))return['Feed Bucket','Hay Bale','Wheelbarrow','Milk Can','Wooden Crate','Woven Basket','Feed Bag','Feed Barrel','Trough','Lantern','Firewood Stack','Rubber Boots'];
    if(/camp|shore|dock|woods|outdoor|apron|grove/.test(n))return['Lantern','Camp Chair','Cooler','Coffee Mug','Woven Basket','Firewood Stack','Thermos','Dog Toy','Wooden Crate','Throw Pillow','Blanket Stack','Kettle','Stack of Books','Potted Plant'];
    return (map.palette&&map.palette.length)?map.palette:map.props.map(p=>p.type);
  }
  function zoneClutterCount(zone,map){const n=String(zone.name||'').toLowerCase();if(/kitchen|living|workshop|garage|games room/.test(n))return Math.max(14,map.zoneClutter||9);if(/bed|bunk|mudroom|barn|feed|coop|parts/.test(n))return Math.max(11,map.zoneClutter||9);return Math.max(9,map.zoneClutter||8);}

  function buildProps(map){
    const out=map.props.map((p,i)=>({...p,id:`p${i}`,decoy:false}));
    const baseTypes=map.props.map(p=>p.type),types=(map.palette&&map.palette.length?map.palette:baseTypes);
    // Dense room-by-room clutter is the core of Prop Hunt. Each zone gets its own
    // believable spread so large maps do not turn into empty corridors.
    let serial=0;
    for(let zi=0;zi<map.zones.length;zi++){
      const zone=map.zones[zi],zoneTypes=zonePropPalette(zone.name,map),count=zoneClutterCount(zone,map);
      for(let j=0;j<count;j++){
        const type=zoneTypes[(zi*7+j*3)%zoneTypes.length],shape=propShape(type);let placed=false,x=0,z=0;
        for(let attempt=0;attempt<8&&!placed;attempt++){
          const rx=.12+.76*seededUnit(zi*91+j*17+attempt*7+1),rz=.12+.76*seededUnit(zi*53+j*29+attempt*11+3);
          x=zone.x+zone.w*rx;z=zone.z+zone.d*rz;
          const pad=shape.collider?Math.max(18,Math.min(shape.w,shape.d)*.35):10;
          placed=!pointInsideAnySolid(x,z,map.boxes,pad);
        }
        if(placed)out.push({...E(x,z,type,{rot:seededUnit(zi*31+j*13)*TAU}),id:`z${zi}-${j}-${serial++}`,decoy:false,w:shape.w,d:shape.d,h:shape.h});
      }
    }
    // Fixed room dressing makes each indoor area read like a designed room, not a random rectangle.
    for(let zi=0;zi<map.zones.length;zi++){
      const zone=map.zones[zi],n=String(zone.name||'').toLowerCase(),indoor=/room|kitchen|bed|bunk|loft|garage|workshop|shop|barn|shed|pantry|basement|camper|silo|coop/.test(n);if(!indoor)continue;
      const fixtures=/kitchen|pantry/.test(n)?['Framed Photo','Kettle','Potted Plant','Woven Basket']:/workshop|garage|shop/.test(n)?['Metal Lantern','Toolbox','Cowboy Boots','Stack of Books']:['Framed Photo','Table Lamp','Potted Plant','Stack of Books'];
      const spots=[[.18,.14],[.78,.16],[.14,.78],[.82,.74]];
      fixtures.forEach((type,i)=>{const shape=propShape(type),[rx,rz]=spots[i];const x=zone.x+zone.w*rx,z=zone.z+zone.d*rz;if(!pointInsideAnySolid(x,z,map.boxes,12))out.push({...E(x,z,type,{rot:(i%2)*Math.PI/2}),id:`fx${zi}-${i}`,decoy:false,w:shape.w,d:shape.d,h:shape.h});});
    }

    // A smaller ring around spawn guarantees an immediately testable disguise.
    for(let i=0;i<12;i++){
      const type=types[i%types.length],shape=propShape(type),ang=i*2.3999632297,r=150+(i%5)*72;
      let x=clamp(map.spawn.x+Math.cos(ang)*r,75,map.w-75),z=clamp(map.spawn.z+Math.sin(ang)*r,75,map.d-75);
      if(pointInsideAnySolid(x,z,map.boxes,12)){x=clamp(map.spawn.x+Math.cos(ang+.8)*(r+90),75,map.w-75);z=clamp(map.spawn.z+Math.sin(ang+.8)*(r+90),75,map.d-75);}
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
    const playerPortrait=stylePortrait(state.player.person,state.player.style||'default');
    root.innerHTML=`<div class="game-title-row ph3-title-row"><div><span class="eyebrow">ROUND ${state.round} · DELUXE PROP HUNT</span><h1>Family Prop Hunt</h1><p class="subtext">${state.map.name} · ${state.map.ambient}</p></div><div class="button-row"><button id="ph3Restart" class="btn secondary">New match</button></div></div>
      <div class="ph3d-shell ph3d-shell-deluxe">
        <section class="ph3d-stage" id="ph3Stage">
          <canvas class="ph3d-canvas" id="ph3Canvas" aria-label="Third-person Family Prop Hunt game view"></canvas>

          <div class="ph3d-player-hud"><img src="${playerPortrait}" alt="${state.player.person.name} avatar"><div><b>${state.player.person.name}</b><span id="ph3Health">♥ ♥ ♥</span></div></div>
          <div class="ph3d-role-banner" id="ph3RoleBanner"><strong id="ph3Role">HIDER</strong><span id="ph3Objective">DISGUISE & SURVIVE</span></div>
          <div class="ph3d-scorebar">
            <div class="team hide"><small>HIDERS</small><b id="ph3HiderCount">0</b></div>
            <div class="clock"><small id="ph3Phase">HIDE PHASE</small><b id="ph3Timer">0:30</b></div>
            <div class="team hunt"><small>HUNTERS</small><b id="ph3HunterCount">0</b></div>
          </div>
          <div class="ph3d-room-chip" id="ph3RoomChip"></div>
          <div class="ph3d-mode-ribbon" id="ph3ActionMode">HIDING MODE</div>
          <div class="ph3d-move-status" id="ph3MoveStatus"></div>
          <div class="ph3d-camera-help">WASD / left stick move · drag world to look · Space jump · Shift sprint</div>
          <div class="ph3d-crosshair" id="ph3Cross"></div><div class="ph3d-hit" id="ph3Hit">✦</div><div class="ph3d-flash" id="ph3Flash"></div><div class="ph3d-prop-prompt" id="ph3Prompt"></div>

          <div class="ph3d-controls">
            <div class="ph3d-move-cluster"><div class="ph3d-control-label">MOVE</div><div class="ph3d-joystick" id="ph3Joy"><div class="ph3d-stick" id="ph3Stick"></div></div><div class="ph3d-dpad" aria-label="Movement buttons"><button type="button" data-ph3-move="forward">▲</button><button type="button" data-ph3-move="left">◀</button><button type="button" data-ph3-move="back">▼</button><button type="button" data-ph3-move="right">▶</button></div></div>
            <div class="ph3d-action-panel">
              <div class="ph3d-role-actions hider" id="ph3HiderActions"><button class="ph3d-act prop" id="ph3Prop">▣<span>PROP</span></button><button class="ph3d-act flash" id="ph3FlashBtn">⚡<span>FLASH</span></button><button class="ph3d-act" id="ph3Decoy">◉<span>DECOY</span></button><button class="ph3d-act lock" id="ph3Lock">🔒<span>LOCK</span></button></div>
              <div class="ph3d-role-actions hunter" id="ph3HunterActions"><button class="ph3d-act primary shoot" id="ph3Shoot">✦<span>SHOOT</span></button><button class="ph3d-act reload" id="ph3Reload">↻<span>RELOAD</span></button><button class="ph3d-act aim" id="ph3Aim">⌖<span>AIM</span></button></div>
              <div class="ph3d-shared-actions"><button class="ph3d-act jump ph3d-big-jump" id="ph3Jump">↑<span>JUMP</span></button><button class="ph3d-act sprint" id="ph3Sprint">▶▶<span>SPRINT</span></button><button class="ph3d-act camera" id="ph3CameraReset">↻<span>CAMERA</span></button></div>
            </div>
          </div>
        </section>
        <aside class="ph3d-side">
          <div class="ph3d-mini ph3d-status-card"><h3 id="ph3SideTitle">Your role</h3><div class="ph3d-readout" id="ph3Load"></div></div>
          <div class="ph3d-mini"><h3>How this round works</h3><div class="ph3d-legend" id="ph3RoleHelp"></div></div>
          <div class="ph3d-mini"><h3>World</h3><div class="ph3d-legend"><span>Illustrated props = the disguises</span><span>Furniture and farm equipment can be climbed</span><span>AREA shows your current room</span><span>Gold glow = nearby disguise target</span><span>Mini-map shows you, never enemies</span></div></div>
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
    let touchJoyId=null;
    const applyJoyPoint=(clientX,clientY)=>{const r=j.getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height/2,max=Math.max(34,r.width*.37);let dx=clientX-cx,dy=clientY-cy;const len=Math.hypot(dx,dy)||1,k=Math.min(1,max/len);dx*=k;dy*=k;const raw=clamp(Math.hypot(dx,dy)/max,0,1),mag=raw<.07?0:Math.pow((raw-.07)/.93,.86),ux=len?dx/(Math.hypot(dx,dy)||1):0,uz=len?-dy/(Math.hypot(dx,dy)||1):0;joy.x=ux*mag;joy.z=uz*mag;stick.style.transform=`translate(${dx}px,${dy}px)`;j.classList.add('active');};
    const joyEnd=(pointerId=null)=>{if(pointerId!=null&&joy.id!=null&&pointerId!==joy.id)return;joy.active=false;joy.id=null;joy.x=joy.z=0;stick.style.transform='translate(0,0)';j.classList.remove('active');};

    // Pointer Events path for modern desktop/mobile browsers. Listen on window too so
    // movement keeps tracking even if Safari fails pointer capture at the joystick edge.
    j.addEventListener('pointerdown',e=>{e.preventDefault();e.stopPropagation();joy.active=true;joy.id=e.pointerId;try{j.setPointerCapture(e.pointerId)}catch{}applyJoyPoint(e.clientX,e.clientY)});
    j.addEventListener('pointermove',e=>{if(joy.active&&e.pointerId===joy.id){e.preventDefault();applyJoyPoint(e.clientX,e.clientY)}});
    window.addEventListener('pointermove',e=>{if(joy.active&&e.pointerId===joy.id)applyJoyPoint(e.clientX,e.clientY)},{passive:true});
    j.addEventListener('pointerup',e=>{e.preventDefault();joyEnd(e.pointerId)});j.addEventListener('pointercancel',e=>joyEnd(e.pointerId));j.addEventListener('lostpointercapture',()=>joyEnd());
    window.addEventListener('pointerup',e=>joyEnd(e.pointerId),{passive:true});window.addEventListener('pointercancel',e=>joyEnd(e.pointerId),{passive:true});

    // Explicit iOS touch fallback. This is intentionally redundant with Pointer Events.
    // It fixes the "joystick moves but character does not" failure on some iPhone/Safari builds.
    j.addEventListener('touchstart',e=>{if(!e.changedTouches.length)return;e.preventDefault();e.stopPropagation();const t=e.changedTouches[0];touchJoyId=t.identifier;joy.active=true;joy.id=null;applyJoyPoint(t.clientX,t.clientY)},{passive:false});
    j.addEventListener('touchmove',e=>{const t=[...e.changedTouches].find(x=>x.identifier===touchJoyId)||[...e.touches].find(x=>x.identifier===touchJoyId);if(!t)return;e.preventDefault();applyJoyPoint(t.clientX,t.clientY)},{passive:false});
    const touchEnd=e=>{if(touchJoyId==null)return;const ended=[...e.changedTouches].some(x=>x.identifier===touchJoyId);if(ended){e.preventDefault();touchJoyId=null;joyEnd();}};
    j.addEventListener('touchend',touchEnd,{passive:false});j.addEventListener('touchcancel',touchEnd,{passive:false});

    root.querySelectorAll('[data-ph3-move]').forEach(btn=>{const dir=btn.dataset.ph3Move,on=e=>{e.preventDefault();touchMove[dir]=true;btn.classList.add('pressed')},off=e=>{if(e)e.preventDefault();touchMove[dir]=false;btn.classList.remove('pressed')};btn.addEventListener('pointerdown',on);btn.addEventListener('pointerup',off);btn.addEventListener('pointercancel',off);btn.addEventListener('pointerleave',e=>{if(e.buttons===0)off(e)});btn.addEventListener('touchstart',on,{passive:false});btn.addEventListener('touchend',off,{passive:false});});
    stage.addEventListener('contextmenu',e=>e.preventDefault());
    stage.addEventListener('pointerdown',e=>{if(e.target.closest('button')||e.target.closest('#ph3Joy')||e.target.closest('.ph3d-dpad'))return;if(e.pointerType==='mouse'&&e.button!==2)return;pointer.active=true;pointer.id=e.pointerId;pointer.lastX=e.clientX;pointer.lastY=e.clientY;try{stage.setPointerCapture(e.pointerId)}catch{}});
    stage.addEventListener('pointermove',e=>{if(!pointer.active||e.pointerId!==pointer.id)return;const dx=e.clientX-pointer.lastX,dy=e.clientY-pointer.lastY;pointer.lastX=e.clientX;pointer.lastY=e.clientY;const sens=state.opts.cameraSensitivity||1;state.camera.yaw=wrapAngle(state.camera.yaw-dx*.006*sens);state.camera.pitch=clamp(state.camera.pitch-dy*.004*sens,-.12,.72)});
    const endPointer=e=>{if(e.pointerId===pointer.id){pointer.active=false;pointer.id=null}};stage.addEventListener('pointerup',endPointer);stage.addEventListener('pointercancel',endPointer);stage.addEventListener('lostpointercapture',()=>{pointer.active=false;pointer.id=null});
    const bindTap=(sel,fn)=>{const b=root.querySelector(sel);if(!b)return;let lastTouch=0;b.addEventListener('touchend',e=>{e.preventDefault();lastTouch=performance.now();fn()},{passive:false});b.addEventListener('click',e=>{e.preventDefault();if(performance.now()-lastTouch<450)return;fn()})};
    const shootBtn=root.querySelector('#ph3Shoot');if(shootBtn){const start=e=>{e.preventDefault();shoot();if(shootTimer)clearInterval(shootTimer);shootTimer=setInterval(shoot,110);shootBtn.classList.add('pressed')},stopShoot=e=>{if(e)e.preventDefault();if(shootTimer)clearInterval(shootTimer);shootTimer=0;shootBtn.classList.remove('pressed')};shootBtn.addEventListener('pointerdown',start);shootBtn.addEventListener('pointerup',stopShoot);shootBtn.addEventListener('pointercancel',stopShoot);shootBtn.addEventListener('touchstart',start,{passive:false});shootBtn.addEventListener('touchend',stopShoot,{passive:false});}
    bindTap('#ph3Jump',jump);bindTap('#ph3Prop',changeProp);bindTap('#ph3Decoy',dropDecoy);bindTap('#ph3FlashBtn',flash);bindTap('#ph3Lock',toggleLock);bindTap('#ph3Reload',reload);
    bindTap('#ph3Aim',()=>{if(!state?.player||state.player.role!=='hunter')return;state.camera.aiming=!state.camera.aiming;APP.toast(state.camera.aiming?'Aim zoom ON':'Aim zoom OFF');updateHud();});
    bindTap('#ph3Sprint',()=>{const p=state?.player;if(!p)return;p.sprintToggle=!p.sprintToggle;APP.toast(p.sprintToggle?'Sprint ON':'Sprint OFF');updateHud();});
    bindTap('#ph3CameraReset',()=>{if(!state?.player)return;state.camera.yaw=state.player.yaw;state.camera.pitch=.24;state.camera.aiming=false;APP.toast('Camera centered');updateHud();});
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
    const locked=p.role==='hider'&&p.prop&&p.locked;const sprint=keys.ShiftLeft||keys.ShiftRight||p.sprintToggle;const speed=sprint?p.runSpeed:p.speed;
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
    const p=state.player,c=state.camera,yaw=c.yaw,pitch=c.pitch,dist=c.aiming?Math.max(205,c.distance*.68):c.distance;const target={x:p.x,y:p.y+(p.person.dog?48:82),z:p.z};
    const horiz=Math.cos(pitch)*dist;let cam={x:target.x-Math.sin(yaw)*horiz,y:target.y+Math.sin(pitch)*dist+70,z:target.z-Math.cos(yaw)*horiz};
    if(state.screenShake>0){cam.x+=rand(-4,4)*state.screenShake;cam.y+=rand(-3,3)*state.screenShake;}
    let fx=target.x-cam.x,fy=target.y-cam.y,fz=target.z-cam.z,fl=Math.hypot(fx,fy,fz)||1;fx/=fl;fy/=fl;fz/=fl;
    // IMPORTANT: up = forward x right. The older renderer used right x forward,
    // which inverted the Y basis and could make the whole Prop Hunt world appear upside down.
    let rx=fz,ry=0,rz=-fx,rl=Math.hypot(rx,rz)||1;rx/=rl;rz/=rl;const ux=fy*rz-fz*ry,uy=fz*rx-fx*rz,uz=fx*ry-fy*rx;
    return{cam,target,forward:{x:fx,y:fy,z:fz},right:{x:rx,y:0,z:rz},up:{x:ux,y:uy,z:uz},fov:c.aiming?900:c.fov};
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

  function zoneForPoint(x,z){for(const q of state.map.zones)if(x>=q.x&&x<=q.x+q.w&&z>=q.z&&z<=q.z+q.d)return q;return null;}
  function drawMiniMapHud(W,H){
    const map=state.map,p=state.player;if(!map||!p)return;const mobile=W<680,mw=mobile?116:158,mh=mobile?84:112,x=W-mw-12,y=mobile?72:84,pad=8,sx=(mw-pad*2)/map.w,sz=(mh-pad*2)/map.d,active=zoneForPoint(p.x,p.z);
    ctx.save();ctx.globalAlpha=.92;roundRect(x,y,mw,mh,12,'#15110edd','#e8c88788',1.5);ctx.save();ctx.beginPath();ctx.rect(x+pad,y+pad,mw-pad*2,mh-pad*2);ctx.clip();
    for(const q of map.zones){ctx.fillStyle=q===active?'#c8984a88':'#7a6b5655';ctx.strokeStyle=q===active?'#ffe099':'#d2b98a55';ctx.lineWidth=q===active?2:1;ctx.fillRect(x+pad+q.x*sx,y+pad+q.z*sz,Math.max(2,q.w*sx),Math.max(2,q.d*sz));ctx.strokeRect(x+pad+q.x*sx,y+pad+q.z*sz,Math.max(2,q.w*sx),Math.max(2,q.d*sz));}
    const px=x+pad+p.x*sx,py=y+pad+p.z*sz;ctx.fillStyle='#77d7ff';ctx.strokeStyle='#071018';ctx.lineWidth=2;ctx.beginPath();ctx.arc(px,py,mobile?4:5,0,TAU);ctx.fill();ctx.stroke();ctx.restore();ctx.fillStyle='#f5e7c8';ctx.font=`900 ${mobile?7:9}px system-ui`;ctx.textAlign='center';ctx.fillText('YOU',x+mw/2,y+mh-3);ctx.restore();
  }
  function updateHud(){
    if(!root||!state||!state.player)return;
    const p=state.player,isHider=p.role==='hider',hunterWaiting=!isHider&&state.phase==='hide',currentZone=zoneForPoint(p.x,p.z);
    const role=root.querySelector('#ph3Role'),roleBanner=root.querySelector('#ph3RoleBanner'),objective=root.querySelector('#ph3Objective'),phase=root.querySelector('#ph3Phase'),timer=root.querySelector('#ph3Timer'),health=root.querySelector('#ph3Health'),load=root.querySelector('#ph3Load'),feed=root.querySelector('#ph3Feed'),prompt=root.querySelector('#ph3Prompt'),moveStatus=root.querySelector('#ph3MoveStatus'),roomChip=root.querySelector('#ph3RoomChip'),actionMode=root.querySelector('#ph3ActionMode'),hiderActions=root.querySelector('#ph3HiderActions'),hunterActions=root.querySelector('#ph3HunterActions'),cross=root.querySelector('#ph3Cross'),roleHelp=root.querySelector('#ph3RoleHelp'),sideTitle=root.querySelector('#ph3SideTitle');
    if(currentZone){state.visitedZones?.add(currentZone.name);if(roomChip)roomChip.textContent=`AREA · ${currentZone.name}`}else if(roomChip)roomChip.textContent='AREA · OPEN GROUND';
    const hiders=state.actors.filter(a=>a.role==='hider'&&a.alive).length,hunters=state.actors.filter(a=>a.role==='hunter'&&a.alive).length;
    const hc=root.querySelector('#ph3HiderCount'),huc=root.querySelector('#ph3HunterCount');if(hc)hc.textContent=hiders;if(huc)huc.textContent=hunters;
    if(timer)timer.textContent=fmt(state.phaseLeft/TEST_SCALE);if(phase)phase.textContent=state.phase==='hide'?'HIDE PHASE':'HUNT PHASE';
    if(health)health.textContent=`${'♥'.repeat(Math.max(0,p.health))}${'♡'.repeat(Math.max(0,3-p.health))}`;
    if(role)role.textContent=isHider?'YOU ARE A HIDER':'YOU ARE A HUNTER';
    if(roleBanner){roleBanner.classList.toggle('hunter',!isHider);roleBanner.classList.toggle('hider',isHider)}
    if(objective)objective.textContent=isHider?(state.phase==='hide'?'DISGUISE NOW · FIND A NATURAL HIDING SPOT':'SURVIVE · MOVE, DECOY, FLASH OR STAY LOCKED'):(hunterWaiting?'WAIT · HIDERS ARE HIDING':'FIND SUSPICIOUS PROPS · AIM & SHOOT');
    if(actionMode){actionMode.textContent=isHider?'HIDING MODE':'SHOOTING MODE';actionMode.classList.toggle('hunter',!isHider)}
    if(hiderActions)hiderActions.style.display=isHider?'grid':'none';if(hunterActions)hunterActions.style.display=isHider?'none':'grid';if(cross)cross.style.opacity=!isHider&&state.phase==='hunt'?'1':'0';
    if(sideTitle)sideTitle.textContent=isHider?'Hider loadout':'Hunter loadout';
    if(load)load.innerHTML=isHider?`Current disguise: <b>${p.prop||'YOUR CHARACTER'}</b><br>Prop changes: <b>${p.propChanges}</b><br>Decoys: <b>${p.decoys}/10</b><br>Flash: <b>${p.flash?'READY':'USED'}</b><br>Lock: <b>${p.locked?'STILL / HIDDEN':'MOBILE'}</b><br>Health: <b>${p.health}/3</b>`:`Weapon: <b>PROP-ZAPPER</b><br>Magazine: <b>${p.reload>0?'RELOADING':p.ammo+'/30'}</b><br>Reserve ammo: <b>∞</b><br>Aim zoom: <b>${state.camera.aiming?'ON':'OFF'}</b><br>Objective: <b>catch every hider</b>`;
    if(roleHelp)roleHelp.innerHTML=isHider?'<span>Move close to a real object and tap PROP</span><span>Your disguise uses the exact same artwork as the scenery</span><span>LOCK makes you perfectly still</span><span>FLASH blinds nearby hunters once per disguise</span><span>DECOY drops a copy of your current prop</span>':'<span>SHOOT is active only during the Hunt phase</span><span>AIM zooms the camera for precise shots</span><span>RELOAD refills the 30-shot magazine</span><span>Props take about 3 hits to catch</span><span>There is no penalty for shooting scenery</span>';
    if(feed){feed.innerHTML=state.feed.slice(-12).map(x=>`<div>${x}</div>`).join('');feed.scrollTop=feed.scrollHeight;}
    for(const id of ['ph3Prop','ph3FlashBtn','ph3Decoy','ph3Lock']){const b=root.querySelector('#'+id);if(b)b.disabled=!isHider;}
    const shoot=root.querySelector('#ph3Shoot');if(shoot)shoot.disabled=isHider||state.phase!=='hunt'||hunterWaiting;const reloadBtn=root.querySelector('#ph3Reload');if(reloadBtn)reloadBtn.disabled=isHider||p.reload>0||p.ammo===30;const aimBtn=root.querySelector('#ph3Aim');if(aimBtn){aimBtn.disabled=isHider||hunterWaiting;aimBtn.classList.toggle('pressed',!!state.camera.aiming);}
    const jumpBtn=root.querySelector('#ph3Jump');if(jumpBtn)jumpBtn.disabled=hunterWaiting||p.locked;
    const flashOverlay=root.querySelector('#ph3Flash');if(flashOverlay)flashOverlay.classList.toggle('on',p.blind>0);
    if(prompt){if(isHider&&state.nearProp){prompt.innerHTML=`<b>${state.nearProp.type}</b><span>tap PROP to disguise</span>`;prompt.classList.add('on')}else prompt.classList.remove('on');}
    const lock=root.querySelector('#ph3Lock');if(lock){lock.innerHTML=p.locked?'🔓<span>UNLOCK</span>':'🔒<span>LOCK</span>'}
    const sprintBtn=root.querySelector('#ph3Sprint');if(sprintBtn){sprintBtn.innerHTML=p.sprintToggle?'✓<span>SPRINT ON</span>':'▶▶<span>SPRINT</span>';sprintBtn.classList.toggle('pressed',!!p.sprintToggle);sprintBtn.disabled=hunterWaiting||p.locked;}
    if(moveStatus){if(hunterWaiting){moveStatus.textContent=`HUNTER HOLD · release in ${Math.max(0,Math.ceil(state.phaseLeft/TEST_SCALE))}s`;moveStatus.className='ph3d-move-status waiting'}else if(p.locked){moveStatus.textContent='PROP LOCKED · perfectly still';moveStatus.className='ph3d-move-status locked'}else{moveStatus.textContent=isHider?'MOVE NOW · FIND A PROP · HIDE':'MOVE NOW · AIM · SHOOT';moveStatus.className='ph3d-move-status ready'}}
  }
  function fmt(sec){sec=Math.max(0,Math.ceil(sec));return`${Math.floor(sec/60)}:${String(sec%60).padStart(2,'0')}`;}
  function addFeed(t){state.feed.push(t);if(state.feed.length>50)state.feed.shift();}

  // ---------- software 3D rendering ----------
  function draw(){
    if(!ctx||!state||!canvas)return;const W=canvas._cssW||canvas.clientWidth,H=canvas._cssH||canvas.clientHeight,cam=cameraData();
    const sky=state.map.sky;const g=ctx.createLinearGradient(0,0,0,H);g.addColorStop(0,sky[0]);g.addColorStop(.58,sky[1]);g.addColorStop(.59,state.map.ground);g.addColorStop(1,'#39372d');ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
    drawDistantBackdrop(cam,W,H);drawGround(cam,W,H);const commands=[];
    for(const b of state.map.boxes)pushEnvironmentObject(commands,b,cam,W,H);
    for(const p of state.props)pushProp(commands,p,cam,W,H,p===state.nearProp&&state.player.role==='hider');
    for(const a of state.animals)pushAnimal(commands,a,cam,W,H);
    for(const a of state.actors){if(a.alive&&a!==state.player)pushActor(commands,a,cam,W,H,false);}if(state.player.alive)pushActor(commands,state.player,cam,W,H,true);
    for(const e of state.effects)pushEffect(commands,e,cam,W,H);
    commands.sort((a,b)=>b.depth-a.depth);for(const c of commands)c.draw();drawMiniMapHud(W,H);
    if(state.phase==='hide'&&state.player.role==='hunter'){ctx.fillStyle='#090807dd';ctx.fillRect(0,0,W,H);ctx.fillStyle='#f6dfad';ctx.textAlign='center';ctx.font='900 26px system-ui';ctx.fillText('HIDERS ARE HIDING…',W/2,H*.43);ctx.font='600 14px system-ui';ctx.fillStyle='#d4c5b0';ctx.fillText(`${Math.max(0,Math.ceil(state.phaseLeft/TEST_SCALE))} seconds`,W/2,H*.48);ctx.textAlign='left';}
  }

  function drawDistantBackdrop(cam,W,H){ctx.save();ctx.globalAlpha=.45;ctx.fillStyle='#314033';ctx.beginPath();ctx.moveTo(0,H*.58);for(let x=0;x<=W;x+=45){const h=22+17*Math.sin(x*.04)+12*Math.sin(x*.13);ctx.lineTo(x,H*.58-h);}ctx.lineTo(W,H*.62);ctx.lineTo(0,H*.62);ctx.closePath();ctx.fill();ctx.restore();}
  function zoneColorAt(x,z){for(const q of state.map.zones)if(x>=q.x&&x<=q.x+q.w&&z>=q.z&&z<=q.z+q.d)return q.color;return state.map.ground;}
  function floorMaterialForZone(zone){const n=String(zone?.name||'').toLowerCase();if(/shop|room|kitchen|bed|bunk|loft|garage|barn|shed|coop|camper|pantry|basement|silo/.test(n))return'wood';if(/parking|driveway|apron|equipment|launch/.test(n))return'gravel';if(/dock|shore|dugout|lake/.test(n))return'wateredge';if(/garden|field|yard|woods|pasture|grove|grass/.test(n))return'grass';return'earth';}
  function floorTexture(pts,material,seed){
    const xs=pts.map(p=>p.x),ys=pts.map(p=>p.y),minX=Math.min(...xs),maxX=Math.max(...xs),minY=Math.min(...ys),maxY=Math.max(...ys);ctx.save();ctx.beginPath();ctx.moveTo(pts[0].x,pts[0].y);for(let i=1;i<pts.length;i++)ctx.lineTo(pts[i].x,pts[i].y);ctx.closePath();ctx.clip();ctx.globalAlpha=.22;
    if(material==='wood'){ctx.strokeStyle='#f0c27a66';ctx.lineWidth=1;for(let y=minY+5;y<maxY;y+=8){ctx.beginPath();ctx.moveTo(minX,y);ctx.lineTo(maxX,y);ctx.stroke();}ctx.strokeStyle='#3f241877';for(let x=minX+14;x<maxX;x+=28){ctx.beginPath();ctx.moveTo(x,minY);ctx.lineTo(x+8,maxY);ctx.stroke();}}
    else if(material==='gravel'){ctx.fillStyle='#e6d4aa66';for(let i=0;i<28;i++){const x=minX+seededUnit(seed*31+i*7)*(maxX-minX),y=minY+seededUnit(seed*17+i*13)*(maxY-minY);ctx.fillRect(x,y,1.5+(i%3),1+(i%2));}}
    else if(material==='grass'){ctx.strokeStyle='#bdd28d55';ctx.lineWidth=1;for(let i=0;i<24;i++){const x=minX+seededUnit(seed*23+i*5)*(maxX-minX),y=minY+seededUnit(seed*19+i*11)*(maxY-minY);ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+((i%3)-1)*3,y-4-(i%4));ctx.stroke();}}
    else if(material==='wateredge'){ctx.strokeStyle='#b6e4e455';ctx.lineWidth=1.1;for(let y=minY+7;y<maxY;y+=11){ctx.beginPath();ctx.moveTo(minX,y);ctx.quadraticCurveTo((minX+maxX)/2,y+3,maxX,y);ctx.stroke();}}
    else{ctx.strokeStyle='#e0bb8060';ctx.lineWidth=1;for(let i=0;i<12;i++){const x=minX+seededUnit(seed*7+i)*(maxX-minX);ctx.beginPath();ctx.moveTo(x,minY);ctx.lineTo(x+8,maxY);ctx.stroke();}}
    ctx.restore();
  }
  function drawGround(cam,W,H){
    const p=state.player,tile=120,range=900,minX=Math.floor(clamp(p.x-range,0,state.map.w)/tile)*tile,maxX=Math.ceil(clamp(p.x+range,0,state.map.w)/tile)*tile,minZ=Math.floor(clamp(p.z-range,0,state.map.d)/tile)*tile,maxZ=Math.ceil(clamp(p.z+range,0,state.map.d)/tile)*tile;
    const tiles=[];let seed=0;for(let x=minX;x<maxX;x+=tile)for(let z=minZ;z<maxZ;z+=tile){const pts=[project({x,y:0,z},cam,W,H),project({x:x+tile,y:0,z},cam,W,H),project({x:x+tile,y:0,z:z+tile},cam,W,H),project({x,y:0,z:z+tile},cam,W,H)];if(pts.some(q=>!q))continue;const zone=state.map.zones.find(q=>x+tile/2>=q.x&&x+tile/2<=q.x+q.w&&z+tile/2>=q.z&&z+tile/2<=q.z+q.d);tiles.push({pts,depth:pts.reduce((sum,q)=>sum+q.z,0)/4,color:zone?.color||state.map.ground,material:floorMaterialForZone(zone),seed:seed++});}tiles.sort((a,b)=>b.depth-a.depth);for(const t of tiles){ctx.fillStyle=shade(t.color,-.07);poly(t.pts,true);ctx.strokeStyle='#ffffff12';ctx.lineWidth=1;poly(t.pts,false);floorTexture(t.pts,t.material,t.seed);}
  }
  function boxMaterial(name){const n=String(name||'').toLowerCase();if(n.includes('silo'))return'metal';if(n.includes('fence')||n.includes('gate'))return'fence';if(n.includes('platform')||n.includes('stairs')||n.includes('catwalk'))return'boards';if(n.includes('wall')||n.includes('divider'))return'logs';return'wood';}
  function texturedFace(pts,material){
    const xs=pts.map(p=>p.x),ys=pts.map(p=>p.y),minX=Math.min(...xs),maxX=Math.max(...xs),minY=Math.min(...ys),maxY=Math.max(...ys);ctx.save();ctx.beginPath();ctx.moveTo(pts[0].x,pts[0].y);for(let i=1;i<pts.length;i++)ctx.lineTo(pts[i].x,pts[i].y);ctx.closePath();ctx.clip();ctx.globalAlpha=.26;
    if(material==='logs'){ctx.strokeStyle='#f1cf9244';ctx.lineWidth=1.2;for(let y=minY+9;y<maxY;y+=13){ctx.beginPath();ctx.moveTo(minX,y);ctx.lineTo(maxX,y);ctx.stroke();}ctx.strokeStyle='#2b160f77';for(let y=minY+15;y<maxY;y+=26){ctx.beginPath();ctx.moveTo(minX,y);ctx.lineTo(maxX,y);ctx.stroke();}}
    else if(material==='fence'){ctx.strokeStyle='#e2c18a55';ctx.lineWidth=2;for(let x=minX+8;x<maxX;x+=14){ctx.beginPath();ctx.moveTo(x,minY);ctx.lineTo(x,maxY);ctx.stroke();}}
    else if(material==='metal'){ctx.strokeStyle='#c4cbc655';ctx.lineWidth=1.4;for(let x=minX+5;x<maxX;x+=10){ctx.beginPath();ctx.moveTo(x,minY);ctx.lineTo(x,maxY);ctx.stroke();}ctx.fillStyle='#ffffff0c';for(let y=minY;y<maxY;y+=28)ctx.fillRect(minX,y,maxX-minX,5);}
    else{ctx.strokeStyle='#e9c4873b';ctx.lineWidth=1.1;for(let y=minY+8;y<maxY;y+=12){ctx.beginPath();ctx.moveTo(minX,y);ctx.lineTo(maxX,y);ctx.stroke();}ctx.strokeStyle='#2b1b1270';for(let x=minX+18;x<maxX;x+=32){ctx.beginPath();ctx.moveTo(x,minY);ctx.lineTo(x,maxY);ctx.stroke();}}
    ctx.restore();
  }
  function pushBox(cmd,b,cam,W,H,color,climbable){
    const x0=b.x,x1=b.x+b.w,z0=b.z,z1=b.z+b.d,y0=0,y1=b.h,material=boxMaterial(b.name);
    const c=[{x:x0,y:y0,z:z0},{x:x1,y:y0,z:z0},{x:x1,y:y0,z:z1},{x:x0,y:y0,z:z1},{x:x0,y:y1,z:z0},{x:x1,y:y1,z:z0},{x:x1,y:y1,z:z1},{x:x0,y:y1,z:z1}].map(p=>project(p,cam,W,H));
    if(c.filter(Boolean).length<5)return;
    const faces=[[4,5,6,7,.13],[0,1,5,4,-.09],[1,2,6,5,-.16],[2,3,7,6,-.24],[3,0,4,7,-.12]];
    for(const [a,d,e,f,sh] of faces){const pts=[c[a],c[d],c[e],c[f]];if(pts.some(q=>!q))continue;const depth=pts.reduce((sum,q)=>sum+q.z,0)/4;cmd.push({depth,draw:()=>{ctx.fillStyle=shade(color,sh);poly(pts,true);ctx.strokeStyle=climbable?'#d1a76c88':'#1c171399';ctx.lineWidth=climbable?1.8:1.1;poly(pts,false);texturedFace(pts,material);}});}
  }

  function pushEnvironmentObject(cmd,b,cam,W,H){
    const n=String(b.name||'').toLowerCase();
    // Structural geometry keeps its perspective box. Furniture, vehicles and landmarks
    // are rendered as illustrated billboards while retaining the exact same collision box.
    if(/wall|divider|fence|gate|garden rows|mud wallow|platform|stairs|railing|catwalk|silo wall/.test(n)){pushBox(cmd,b,cam,W,H,b.color,b.climbable);return;}
    const cx=b.x+b.w/2,cz=b.z+b.d/2,base=project({x:cx,y:0,z:cz},cam,W,H),top=project({x:cx,y:b.h,z:cz},cam,W,H);
    if(!base||!top){pushBox(cmd,b,cam,W,H,b.color,b.climbable);return;}
    const h=clamp(Math.abs(base.y-top.y)*1.12,18,310),w=clamp(h*(b.w/Math.max(35,b.h))*.74,24,360),depth=(base.z+top.z)/2;
    cmd.push({depth,draw:()=>drawMajorObject(b,base.x,base.y,w,h)});
  }

  function roundRect(x,y,w,h,r,fill,stroke=null,lw=1){ctx.beginPath();ctx.roundRect(x,y,w,h,Math.min(r,w/2,h/2));if(fill){ctx.fillStyle=fill;ctx.fill()}if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=lw;ctx.stroke()}}
  function ellipseFill(x,y,rx,ry,fill,stroke=null,lw=1){ctx.beginPath();ctx.ellipse(x,y,rx,ry,0,0,TAU);ctx.fillStyle=fill;ctx.fill();if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=lw;ctx.stroke()}}
  function line(x1,y1,x2,y2,color,width=2){ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.strokeStyle=color;ctx.lineWidth=width;ctx.lineCap='round';ctx.stroke()}
  function flame(x,y,s,phase=0){const flick=.86+.16*Math.sin(performance.now()*.012+phase);ctx.save();ctx.translate(x,y);ctx.scale(flick,1.08-flick*.08);ctx.fillStyle='#ffbe43';ctx.beginPath();ctx.moveTo(0,-s);ctx.bezierCurveTo(s*.75,-s*.45,s*.55,s*.15,0,s*.25);ctx.bezierCurveTo(-s*.65,s*.1,-s*.65,-s*.45,0,-s);ctx.fill();ctx.fillStyle='#ff6f2f';ctx.beginPath();ctx.moveTo(0,-s*.68);ctx.bezierCurveTo(s*.38,-s*.28,s*.3,s*.08,0,s*.14);ctx.bezierCurveTo(-s*.34,s*.02,-s*.34,-s*.3,0,-s*.68);ctx.fill();ctx.restore();}

  function drawMajorObject(b,x,y,w,h){
    const n=String(b.name||'').toLowerCase(),t=performance.now()*.002;
    ctx.save();ctx.translate(x,y);ctx.fillStyle='#0005';ctx.beginPath();ctx.ellipse(0,4,w*.42,Math.max(3,h*.06),0,0,TAU);ctx.fill();
    if(n.includes('tractor')){
      ellipseFill(-w*.28,-h*.15,w*.18,h*.18,'#2d2f28','#141612',2);ellipseFill(w*.29,-h*.12,w*.23,h*.23,'#2d2f28','#141612',2);ellipseFill(-w*.28,-h*.15,w*.09,h*.09,'#b48f50');ellipseFill(w*.29,-h*.12,w*.12,h*.12,'#b48f50');roundRect(-w*.28,-h*.58,w*.54,h*.28,h*.05,'#677b42','#354524',2);roundRect(-w*.03,-h*.78,w*.24,h*.25,h*.04,'#4f6538','#314226',2);line(w*.12,-h*.78,w*.2,-h*.96,'#2f332c',Math.max(2,w*.025));
    }else if(n.includes('motorcycle')){
      ellipseFill(-w*.3,-h*.12,w*.17,h*.17,'#232628','#0f1112',2);ellipseFill(w*.3,-h*.12,w*.17,h*.17,'#232628','#0f1112',2);line(-w*.3,-h*.13,0,-h*.46,'#a76a3e',Math.max(2,w*.04));line(0,-h*.46,w*.3,-h*.13,'#a76a3e',Math.max(2,w*.04));line(-w*.06,-h*.46,w*.13,-h*.47,'#35393b',Math.max(2,w*.05));line(w*.18,-h*.47,w*.3,-h*.78,'#35393b',Math.max(2,w*.035));
    }else if(n.includes('fireplace')||n.includes('camp fire')){
      roundRect(-w*.48,-h*.78,w*.96,h*.76,h*.08,'#5c4b3f','#2e251f',2);for(let r=0;r<3;r++)for(let c=0;c<4;c++)roundRect(-w*.43+c*w*.22+(r%2)*w*.04,-h*.72+r*h*.2,w*.19,h*.15,3,r%2?'#6e5a49':'#745f4c','#45372d',1);roundRect(-w*.25,-h*.42,w*.5,h*.37,h*.05,'#211713','#120d0b',2);line(-w*.19,-h*.11,w*.18,-h*.3,'#6a3c20',Math.max(3,w*.05));line(w*.18,-h*.11,-w*.18,-h*.3,'#6a3c20',Math.max(3,w*.05));flame(0,-h*.18,Math.min(w,h)*.2,t);
    }else if(n.includes('chair')||n.includes('couch')){
      const couch=n.includes('couch');roundRect(-w*.42,-h*.55,w*.84,h*.5,h*.11,couch?'#6e5f53':'#8f7538','#3e322a',2);roundRect(-w*.35,-h*.38,w*.7,h*.24,h*.07,couch?'#827064':'#a68b45','#4a3a2b',2);line(-w*.32,-h*.08,-w*.36,0,'#49362a',Math.max(2,w*.04));line(w*.32,-h*.08,w*.36,0,'#49362a',Math.max(2,w*.04));
    }else if(n.includes('bed')||n.includes('bunk')){
      roundRect(-w*.46,-h*.35,w*.92,h*.25,h*.05,'#bfae8c','#574839',2);roundRect(-w*.46,-h*.55,w*.92,h*.23,h*.05,'#8c725b','#4f4035',2);line(-w*.44,-h*.58,-w*.44,0,'#594535',Math.max(2,w*.035));line(w*.44,-h*.58,w*.44,0,'#594535',Math.max(2,w*.035));if(n.includes('bunk')){roundRect(-w*.46,-h*.84,w*.92,h*.2,h*.04,'#baa985','#574839',2);}
    }else if(n.includes('workbench')||n.includes('picnic table')||n.includes('bench')||n.includes('table')){
      roundRect(-w*.48,-h*.45,w*.96,h*.16,h*.035,'#8f6944','#503822',2);line(-w*.35,-h*.3,-w*.4,0,'#67492f',Math.max(3,w*.045));line(w*.35,-h*.3,w*.4,0,'#67492f',Math.max(3,w*.045));if(n.includes('picnic')){line(-w*.5,-h*.18,w*.5,-h*.18,'#7a583a',Math.max(4,h*.06));}
    }else if(n.includes('shelv')||n.includes('rack')){
      line(-w*.42,-h*.9,-w*.42,0,'#5e4b38',Math.max(3,w*.04));line(w*.42,-h*.9,w*.42,0,'#5e4b38',Math.max(3,w*.04));for(let i=1;i<=4;i++)roundRect(-w*.44,-h*.2*i,w*.88,h*.055,2,'#806347','#4a3727',1);
    }else if(n.includes('truck')){
      ellipseFill(-w*.27,-h*.09,w*.13,h*.13,'#24282b');ellipseFill(w*.31,-h*.09,w*.13,h*.13,'#24282b');roundRect(-w*.48,-h*.42,w*.8,h*.28,h*.04,'#666d70','#33383a',2);roundRect(-w*.16,-h*.64,w*.38,h*.26,h*.04,'#6f777b','#33383a',2);roundRect(-w*.08,-h*.59,w*.19,h*.13,2,'#96b0ba','#3f4e55',1);roundRect(w*.3,-h*.37,w*.18,h*.22,2,'#5b6265','#33383a',2);
    }else if(n.includes('tent')){
      ctx.fillStyle='#746247';ctx.beginPath();ctx.moveTo(0,-h*.9);ctx.lineTo(w*.48,0);ctx.lineTo(-w*.48,0);ctx.closePath();ctx.fill();ctx.strokeStyle='#443728';ctx.lineWidth=2;ctx.stroke();ctx.fillStyle='#2c251e';ctx.beginPath();ctx.moveTo(0,-h*.5);ctx.lineTo(w*.16,-h*.03);ctx.lineTo(-w*.16,-h*.03);ctx.closePath();ctx.fill();
    }else if(n.includes('bbq')){
      ellipseFill(0,-h*.4,w*.35,h*.18,'#35393a','#161819',2);line(-w*.26,-h*.29,-w*.32,0,'#303334',Math.max(2,w*.035));line(w*.26,-h*.29,w*.32,0,'#303334',Math.max(2,w*.035));line(0,-h*.57,0,-h*.82,'#303334',Math.max(2,w*.025));
    }else if(n.includes('hot tub')||n.includes('pool')){
      ellipseFill(0,-h*.34,w*.45,h*.18,'#677b7f','#324446',2);roundRect(-w*.45,-h*.34,w*.9,h*.31,h*.06,'#597176','#324446',2);ellipseFill(0,-h*.38,w*.37,h*.1,'#7fb2c0','#c6e1e7',2);ctx.strokeStyle='#d9f5ff99';ctx.lineWidth=1.5;ctx.beginPath();for(let i=0;i<5;i++){const xx=-w*.25+i*w*.12;ctx.moveTo(xx,-h*.39);ctx.quadraticCurveTo(xx+w*.05,-h*(.44+.02*Math.sin(t+i)),xx+w*.1,-h*.39)}ctx.stroke();
    }else if(n.includes('trampoline')){
      ellipseFill(0,-h*.38,w*.46,h*.13,'#202d32','#6f8b92',3);line(-w*.32,-h*.29,-w*.37,0,'#515d61',Math.max(2,w*.025));line(w*.32,-h*.29,w*.37,0,'#515d61',Math.max(2,w*.025));
    }else if(n.includes('boat')){
      ctx.fillStyle='#73868a';ctx.beginPath();ctx.moveTo(-w*.48,-h*.34);ctx.lineTo(w*.48,-h*.34);ctx.lineTo(w*.3,-h*.08);ctx.lineTo(-w*.3,-h*.08);ctx.closePath();ctx.fill();ctx.strokeStyle='#394a4d';ctx.lineWidth=2;ctx.stroke();line(0,-h*.34,0,-h*.86,'#5a5045',Math.max(2,w*.02));
    }else if(n.includes('trailer')){
      ellipseFill(-w*.32,-h*.08,w*.09,h*.1,'#26292a');ellipseFill(w*.32,-h*.08,w*.09,h*.1,'#26292a');roundRect(-w*.47,-h*.58,w*.94,h*.5,h*.05,'#a59b86','#554e43',2);roundRect(-w*.25,-h*.49,w*.2,h*.16,2,'#7d9ca6','#455b63',1);roundRect(w*.08,-h*.49,w*.2,h*.16,2,'#7d9ca6','#455b63',1);
    }else if(n.includes('tree')){
      roundRect(-w*.08,-h*.42,w*.16,h*.42,w*.03,'#62472e');for(let i=0;i<3;i++)ellipseFill((i-1)*w*.13,-h*(.55+i*.09),w*.28,h*.21,'#3f5b39','#2a4028',1);
    }else if(n.includes('shed')||n.includes('shop')){
      roundRect(-w*.45,-h*.62,w*.9,h*.6,h*.04,'#6e5b48','#3e3025',2);ctx.fillStyle='#4b392c';ctx.beginPath();ctx.moveTo(-w*.52,-h*.62);ctx.lineTo(0,-h*.94);ctx.lineTo(w*.52,-h*.62);ctx.closePath();ctx.fill();roundRect(-w*.12,-h*.42,w*.24,h*.4,2,'#3c2f26','#241c17',1);
    }else if(n.includes('hay')){
      for(let i=0;i<3;i++)roundRect(-w*.45+i*w*.3,-h*(.28+(i%2)*.18),w*.28,h*.27,h*.05,'#aa8f4b','#66552d',1);for(let i=0;i<3;i++)line(-w*.35+i*w*.3,-h*.5,-w*.35+i*w*.3,-h*.05,'#ddc875',1);
    }else if(n.includes('sea can')){
      roundRect(-w*.48,-h*.72,w*.96,h*.7,h*.03,'#66705b','#374039',2);for(let i=0;i<6;i++)line(-w*.4+i*w*.16,-h*.68,-w*.4+i*w*.16,-h*.08,'#505b49',Math.max(1,w*.012));
    }else if(n.includes('stairs')||n.includes('platform')){
      for(let i=0;i<4;i++)roundRect(-w*.45+i*w*.13,-h*(.18+i*.17),w*(.5-i*.08),h*.16,2,'#876644','#4d3826',1);
    }else{
      roundRect(-w*.44,-h*.55,w*.88,h*.52,h*.06,b.color||'#78644c','#45372a',2);roundRect(-w*.36,-h*.47,w*.72,h*.12,h*.025,'#ffffff12',null);for(let i=1;i<4;i++)line(-w*.37,-h*.12*i,w*.37,-h*.12*i,'#ffffff22',1);line(-w*.34,-h*.5,w*.34,-h*.08,'#2d221a55',1);
    }
    ctx.restore();
  }

  function pushProp(cmd,p,cam,W,H,highlight){
    const base=project({x:p.x,y:p.y||0,z:p.z},cam,W,H),top=project({x:p.x,y:(p.y||0)+p.h,z:p.z},cam,W,H);if(!base||!top)return;
    const h=clamp(Math.abs(base.y-top.y)*1.18,14,150),w=clamp(h*(p.w/Math.max(18,p.h)),12,170),depth=(base.z+top.z)/2;
    cmd.push({depth,draw:()=>drawCartoonProp(p.type,base.x,base.y,w,h,highlight,(p.id||p.type).length,p.animate!==false)});
  }

  function drawCartoonProp(type,x,y,w,h,highlight=false,seed=0,animate=true){
    const n=String(type||'prop').toLowerCase(),t=performance.now()*.002+seed,bob=animate?Math.sin(t*1.7)*Math.min(1.2,h*.012):0;
    ctx.save();ctx.translate(x,y+bob);ctx.fillStyle='#0005';ctx.beginPath();ctx.ellipse(0,3,w*.38,Math.max(2,h*.055),0,0,TAU);ctx.fill();
    if(highlight){ctx.shadowColor='#ffd96a';ctx.shadowBlur=22;ctx.strokeStyle='#ffe184';ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(0,-h*.47,w*.62,h*.58,0,0,TAU);ctx.stroke();ctx.shadowBlur=0;}
    const sprite=getPropSprite(type);
    if(sprite&&sprite.complete&&sprite.naturalWidth){const ratio=sprite.naturalWidth/sprite.naturalHeight,dh=Math.max(h*.95,24),dw=Math.min(Math.max(w*.9,dh*ratio),w*1.9);ctx.imageSmoothingEnabled=true;ctx.drawImage(sprite,-dw/2,-dh,dw,dh);ctx.restore();return;}
    const brown='#8b633d',dark='#3a3028',metal='#7b8180',red='#a24d3f',green='#61734b',blue='#5e8392',gold='#b99651';
    if(n.includes('table lamp')||n==='lamp'){roundRect(-w*.2,-h*.35,w*.4,h*.32,h*.08,'#8c6138',dark,2);ellipseFill(0,-h*.34,w*.18,h*.06,'#b78c55');ctx.fillStyle='#d8b16c';ctx.beginPath();ctx.moveTo(-w*.42,-h*.5);ctx.lineTo(-w*.24,-h*.82);ctx.lineTo(w*.24,-h*.82);ctx.lineTo(w*.42,-h*.5);ctx.closePath();ctx.fill();ctx.strokeStyle='#6d5236';ctx.stroke();line(0,-h*.5,0,-h*.34,'#6d5236',Math.max(2,w*.05));}
    else if(n.includes('pine')||n.includes('potted plant')||n.includes('succulent')){ctx.fillStyle='#765638';ctx.beginPath();ctx.moveTo(-w*.25,-h*.28);ctx.lineTo(w*.25,-h*.28);ctx.lineTo(w*.18,-h*.02);ctx.lineTo(-w*.18,-h*.02);ctx.closePath();ctx.fill();for(let i=0;i<5;i++){const yy=-h*(.35+i*.09),ww=w*(.12+i*.05);ctx.fillStyle=i%2?'#516944':'#627b4d';ctx.beginPath();ctx.moveTo(0,yy-h*.18);ctx.lineTo(-ww,yy);ctx.lineTo(ww,yy);ctx.closePath();ctx.fill();}}
    else if(n.includes('photo')||n.includes('painting')){roundRect(-w*.45,-h*.72,w*.9,h*.66,h*.04,'#765033','#3a271b',2);roundRect(-w*.34,-h*.62,w*.68,h*.45,h*.02,'#7b8b76','#d7c18e',1);ctx.fillStyle='#d9b27b';ctx.beginPath();ctx.arc(-w*.12,-h*.4,w*.07,0,TAU);ctx.fill();ctx.beginPath();ctx.arc(w*.12,-h*.4,w*.07,0,TAU);ctx.fill();}
    else if(n.includes('book')){for(let i=0;i<4;i++){const colors=['#4f655f','#8a5f3e','#6d4c48','#756947'];roundRect(-w*.43+i%2*w*.03,-h*(.14+i*.16),w*.86,h*.13,h*.025,colors[i],dark,1);line(-w*.28,-h*(.075+i*.16),w*.27,-h*(.075+i*.16),'#d1bf91',1);}}
    else if(n.includes('candle')){roundRect(-w*.2,-h*.55,w*.4,h*.5,h*.08,'#ead7ac','#9f8b68',1);flame(0,-h*.66,Math.min(w,h)*.14,t);}
    else if(n.includes('rug')){roundRect(-w*.48,-h*.28,w*.96,h*.23,h*.08,'#8a493d','#4b3028',2);for(let i=0;i<5;i++)line(-w*.38+i*w*.19,-h*.25,-w*.38+i*w*.19,-h*.08,'#c58f61',1);}
    else if(n.includes('clock')){roundRect(-w*.34,-h*.78,w*.68,h*.73,h*.08,'#795638',dark,2);ellipseFill(0,-h*.55,w*.23,h*.22,'#d9c99d','#4d3b2b',2);line(0,-h*.55,w*.1,-h*.47,'#4c4033',2);line(0,-h*.55,-w*.04,-h*.67,'#4c4033',2);}
    else if(n.includes('blanket')){for(let i=0;i<4;i++){roundRect(-w*.42,-h*(.14+i*.14),w*.84,h*.13,h*.03,i%2?'#80604d':'#9a654d',dark,1);for(let j=0;j<4;j++)line(-w*.35+j*w*.22,-h*(.12+i*.14),-w*.35+j*w*.22,-h*(.03+i*.14),'#d1ad77',1);}}
    else if(n.includes('thermos')){roundRect(-w*.25,-h*.72,w*.5,h*.67,h*.1,'#9b493e',dark,2);roundRect(-w*.2,-h*.82,w*.4,h*.14,h*.04,'#b7a990','#5c5145',1);}
    else if(n.includes('basket')){ellipseFill(0,-h*.18,w*.36,h*.18,'#9d7349','#5c422b',2);ctx.strokeStyle='#7b5737';ctx.lineWidth=2;for(let i=-2;i<=2;i++)line(i*w*.12,-h*.32,i*w*.09,-h*.06,'#6d4b30',1);ctx.beginPath();ctx.arc(0,-h*.38,w*.35,Math.PI,TAU);ctx.stroke();}
    else if(n.includes('kettle')||n.includes('teapot')){ellipseFill(0,-h*.3,w*.31,h*.27,n.includes('teapot')?'#b5a178':'#6d7171',dark,2);ctx.strokeStyle=dark;ctx.lineWidth=Math.max(2,w*.05);ctx.beginPath();ctx.arc(-w*.04,-h*.55,w*.25,Math.PI,TAU);ctx.stroke();ctx.fillStyle=n.includes('teapot')?'#b5a178':'#6d7171';ctx.beginPath();ctx.moveTo(w*.24,-h*.4);ctx.lineTo(w*.5,-h*.55);ctx.lineTo(w*.43,-h*.37);ctx.lineTo(w*.22,-h*.25);ctx.closePath();ctx.fill();}
    else if(n.includes('pie')||n.includes('cake')){ellipseFill(0,-h*.18,w*.4,h*.14,'#c69355','#6d4a31',2);roundRect(-w*.38,-h*.5,w*.76,h*.33,h*.08,n.includes('cake')?'#8d503b':'#b97b43','#6d4a31',1);if(n.includes('cake')){for(let i=-2;i<=2;i++){line(i*w*.13,-h*.51,i*w*.13,-h*.7,'#e3d5ba',2);flame(i*w*.13,-h*.74,Math.min(w,h)*.045,t+i);}}}
    else if(n.includes('bread')){roundRect(-w*.43,-h*.45,w*.86,h*.4,h*.15,'#bf8950','#704928',2);for(let i=-2;i<=2;i++)line(i*w*.13,-h*.43,(i+.15)*w*.13,-h*.29,'#e2b978',2);}
    else if(n.includes('cutting board')){roundRect(-w*.46,-h*.18,w*.78,h*.13,h*.035,'#9b7046','#5d4028',2);roundRect(w*.25,-h*.22,w*.22,h*.08,h*.03,'#9b7046','#5d4028',1);}
    else if(n.includes('jam jar')){roundRect(-w*.28,-h*.62,w*.56,h*.57,h*.08,'#963e3b','#63302e',2);roundRect(-w*.31,-h*.7,w*.62,h*.13,h*.04,'#d6b89a','#7e6a56',1);ctx.fillStyle='#f0d8b8';ctx.fillRect(-w*.18,-h*.43,w*.36,h*.18);}
    else if(n.includes('dresser')||n.includes('side table')){roundRect(-w*.43,-h*.67,w*.86,h*.62,h*.04,'#795638','#4d3523',2);for(let i=0;i<3;i++){line(-w*.36,-h*(.22+i*.15),w*.36,-h*(.22+i*.15),'#4d3523',1);ellipseFill(0,-h*(.29+i*.15),w*.025,w*.025,'#c49c61');}}
    else if(n.includes('teddy')){ellipseFill(0,-h*.35,w*.27,h*.28,'#9d714b','#5e402c',1);ellipseFill(0,-h*.66,w*.24,h*.23,'#9d714b','#5e402c',1);ellipseFill(-w*.2,-h*.79,w*.09,h*.09,'#8d6241');ellipseFill(w*.2,-h*.79,w*.09,h*.09,'#8d6241');ellipseFill(-w*.1,-h*.68,w*.025,h*.025,'#2c211b');ellipseFill(w*.1,-h*.68,w*.025,h*.025,'#2c211b');}
    else if(n.includes('toy truck')){roundRect(-w*.4,-h*.4,w*.6,h*.27,h*.04,'#a34c3e',dark,2);roundRect(w*.05,-h*.62,w*.32,h*.32,h*.04,'#a34c3e',dark,2);ellipseFill(-w*.23,-h*.08,w*.1,h*.1,'#26282a');ellipseFill(w*.25,-h*.08,w*.1,h*.1,'#26282a');}
    else if(n.includes('chest')||n.includes('trunk')){roundRect(-w*.44,-h*.56,w*.88,h*.5,h*.05,'#715137','#3d2a1d',2);ctx.strokeStyle='#ad8a5c';ctx.lineWidth=2;ctx.beginPath();ctx.arc(0,-h*.55,w*.42,Math.PI,TAU);ctx.stroke();line(0,-h*.55,0,-h*.06,'#3d2a1d',2);}
    else if(n.includes('towel')){for(let i=0;i<3;i++)roundRect(-w*.36,-h*(.16+i*.15),w*.72,h*.13,h*.03,i%2?'#a9b4ad':'#c8bda7','#7e7769',1);}
    else if(n.includes('soap')){roundRect(-w*.25,-h*.58,w*.5,h*.53,h*.07,'#9a654b','#5e4334',1);roundRect(-w*.13,-h*.72,w*.26,h*.18,h*.035,'#33342f',null);line(0,-h*.72,w*.24,-h*.77,'#33342f',2);}
    else if(n.includes('toothbrush')){roundRect(-w*.28,-h*.35,w*.56,h*.3,h*.08,'#9b7b59','#5e4934',1);for(let i=-1;i<=1;i++){line(i*w*.12,-h*.34,i*w*.12,-h*.82,['#dd6c6c','#6aa4c6','#7fbd7c'][i+1],Math.max(2,w*.05));}}
    else if(n.includes('bath mat')){roundRect(-w*.47,-h*.2,w*.94,h*.15,h*.05,'#65736b','#3e4943',1);}
    else if(n.includes('rubber duck')){ellipseFill(-w*.04,-h*.26,w*.3,h*.22,'#ddb447','#8b6c2d',1);ellipseFill(w*.17,-h*.48,w*.16,h*.15,'#ddb447','#8b6c2d',1);ctx.fillStyle='#db6d3d';ctx.beginPath();ctx.moveTo(w*.3,-h*.49);ctx.lineTo(w*.5,-h*.44);ctx.lineTo(w*.31,-h*.38);ctx.closePath();ctx.fill();}
    else if(n.includes('toilet paper')){ellipseFill(0,-h*.34,w*.28,h*.31,'#e7dfd2','#a9a094',1);ellipseFill(0,-h*.34,w*.08,h*.09,'#b9ac99');line(w*.25,-h*.34,w*.38,-h*.02,'#e7dfd2',Math.max(3,w*.08));}
    else if(n.includes('pan')||n.includes('skillet')){ellipseFill(-w*.08,-h*.22,w*.31,h*.18,'#393c3c','#1f2222',2);line(w*.17,-h*.24,w*.5,-h*.45,'#292b2b',Math.max(3,w*.07));}
    else if(n.includes('apple')){ellipseFill(0,-h*.18,w*.34,h*.16,'#9a744c','#5d422c',1);for(let i=0;i<5;i++){ellipseFill((i-2)*w*.1,-h*(.36+.03*(i%2)),w*.09,h*.09,i%2?'#b8493f':'#c75d48','#74382f',1);}}
    else if(n.includes('rocking horse')){line(-w*.4,-h*.05,w*.4,-h*.05,'#6e4a2f',Math.max(3,w*.05));ctx.strokeStyle='#6e4a2f';ctx.lineWidth=Math.max(3,w*.05);ctx.beginPath();ctx.arc(0,-h*.05,w*.45,0,Math.PI);ctx.stroke();roundRect(-w*.24,-h*.55,w*.5,h*.32,h*.09,'#966a40','#563a28',2);ellipseFill(w*.24,-h*.63,w*.16,h*.14,'#966a40','#563a28',1);}
    else if(n.includes('fridge')){roundRect(-w*.38,-h*.86,w*.76,h*.81,h*.05,'#61705e','#394239',2);line(-w*.34,-h*.52,w*.34,-h*.52,'#3e493e',1);line(w*.22,-h*.72,w*.22,-h*.6,'#c2c6b6',2);line(w*.22,-h*.42,w*.22,-h*.25,'#c2c6b6',2);}
    else if(n.includes('coat rack')||n.includes('umbrella')){line(0,-h*.88,0,-h*.05,'#765438',Math.max(3,w*.08));line(-w*.22,-h*.7,w*.22,-h*.7,'#765438',Math.max(2,w*.05));line(-w*.18,-h*.7,-w*.28,-h*.82,'#765438',2);line(w*.18,-h*.7,w*.28,-h*.82,'#765438',2);line(-w*.28,-h*.05,w*.28,-h*.05,'#765438',Math.max(2,w*.05));}
    else if(n.includes('milk can')){roundRect(-w*.3,-h*.7,w*.6,h*.65,h*.1,'#747876','#3e4341',2);roundRect(-w*.2,-h*.82,w*.4,h*.17,h*.05,'#8b8f8b','#4d514f',1);}
    else if(n.includes('boot')){for(const xx of [-w*.17,w*.17]){roundRect(xx-w*.13,-h*.66,w*.26,h*.52,h*.08,'#62432e','#38251a',2);roundRect(xx-w*.13,-h*.17,w*.36,h*.13,h*.05,'#62432e','#38251a',2);}}
    else if(n.includes('mug')){roundRect(-w*.35,-h*.64,w*.58,h*.58,h*.08,'#37332c','#1d1a17',2);ctx.strokeStyle='#a68b61';ctx.lineWidth=Math.max(2,w*.09);ctx.beginPath();ctx.arc(w*.25,-h*.39,w*.22,-Math.PI/2,Math.PI/2);ctx.stroke();ellipseFill(-w*.06,-h*.64,w*.27,h*.06,'#6c4a31');}
    else if(n.includes('bucket')){ctx.fillStyle=metal;ctx.beginPath();ctx.moveTo(-w*.34,-h*.62);ctx.lineTo(w*.34,-h*.62);ctx.lineTo(w*.25,-h*.05);ctx.lineTo(-w*.25,-h*.05);ctx.closePath();ctx.fill();ctx.strokeStyle=dark;ctx.lineWidth=2;ctx.stroke();ctx.beginPath();ctx.arc(0,-h*.62,w*.35,Math.PI,TAU);ctx.strokeStyle='#b7b9b4';ctx.stroke();}
    else if(n.includes('oil')||n.includes('gas')||n.includes('water jug')){roundRect(-w*.34,-h*.7,w*.68,h*.65,h*.07,n.includes('gas')?'#9c513e':n.includes('water')?blue:green,dark,2);roundRect(-w*.12,-h*.82,w*.3,h*.18,h*.04,dark,null);roundRect(-w*.03,-h*.78,w*.11,h*.08,h*.02,'#25251f',null);line(w*.34,-h*.56,w*.48,-h*.66,dark,Math.max(2,w*.07));}
    else if(n.includes('toolbox')||n.includes('tool box')){roundRect(-w*.46,-h*.46,w*.92,h*.4,h*.04,red,dark,2);roundRect(-w*.22,-h*.66,w*.44,h*.24,h*.05,dark,null);roundRect(-w*.14,-h*.61,w*.28,h*.16,h*.03,'#7f8584',null);line(-w*.4,-h*.3,w*.4,-h*.3,'#d6c3a0',1);}
    else if(n.includes('welding helmet')){roundRect(-w*.4,-h*.66,w*.8,h*.61,h*.14,'#30383a','#111617',2);roundRect(-w*.25,-h*.51,w*.5,h*.22,h*.03,'#16272a','#77999d',1);}
    else if(n.includes('shop vac')){ellipseFill(0,-h*.32,w*.33,h*.32,'#555e60',dark,2);roundRect(-w*.22,-h*.72,w*.44,h*.2,h*.05,'#3f4648',dark,2);ctx.strokeStyle='#25292a';ctx.lineWidth=Math.max(3,w*.08);ctx.beginPath();ctx.arc(w*.18,-h*.55,w*.45,-1.5,.4);ctx.stroke();}
    else if(n.includes('beer case')||n.includes('crate')||n.includes('bin')||n.includes('card box')){roundRect(-w*.45,-h*.62,w*.9,h*.57,h*.04,n.includes('card')?'#8c3e39':brown,dark,2);for(let i=1;i<4;i++)line(-w*.38,-h*.13*i,w*.38,-h*.13*i,'#e1c59655',1);if(n.includes('card')){ctx.fillStyle='#f4ead8';ctx.fillRect(-w*.17,-h*.48,w*.16,h*.25);ctx.fillRect(w*.01,-h*.43,w*.16,h*.25);}}
    else if(n.includes('stool')||n.includes('chair')){roundRect(-w*.35,-h*.58,w*.7,h*.18,h*.06,brown,dark,2);line(-w*.24,-h*.42,-w*.3,0,dark,Math.max(2,w*.06));line(w*.24,-h*.42,w*.3,0,dark,Math.max(2,w*.06));if(n.includes('chair')){line(-w*.3,-h*.54,-w*.3,-h*.9,dark,Math.max(2,w*.05));line(w*.3,-h*.54,w*.3,-h*.9,dark,Math.max(2,w*.05));}}
    else if(n.includes('sawhorse')){roundRect(-w*.48,-h*.62,w*.96,h*.15,h*.03,brown,dark,2);line(-w*.3,-h*.48,-w*.43,0,dark,Math.max(2,w*.04));line(-w*.12,-h*.48,-w*.02,0,dark,Math.max(2,w*.04));line(w*.3,-h*.48,w*.43,0,dark,Math.max(2,w*.04));line(w*.12,-h*.48,w*.02,0,dark,Math.max(2,w*.04));}
    else if(n.includes('hay')){roundRect(-w*.45,-h*.65,w*.9,h*.6,h*.12,'#b4974f','#6b592d',2);line(-w*.15,-h*.64,-w*.15,-h*.05,'#d3bf72',2);line(w*.15,-h*.64,w*.15,-h*.05,'#d3bf72',2);for(let i=0;i<5;i++)line(-w*.38,-h*(.12+i*.1),w*.38,-h*(.09+i*.1),'#caaa5d',1);}
    else if(n.includes('wheelbarrow')){ctx.fillStyle=green;ctx.beginPath();ctx.moveTo(-w*.4,-h*.6);ctx.lineTo(w*.35,-h*.6);ctx.lineTo(w*.22,-h*.2);ctx.lineTo(-w*.28,-h*.2);ctx.closePath();ctx.fill();ctx.strokeStyle=dark;ctx.lineWidth=2;ctx.stroke();ellipseFill(w*.05,-h*.07,w*.12,h*.12,'#2a2c2b',dark,1);line(w*.22,-h*.25,w*.48,-h*.02,dark,Math.max(2,w*.035));line(-w*.25,-h*.25,-w*.46,-h*.02,dark,Math.max(2,w*.035));}
    else if(n.includes('rock')){ctx.fillStyle='#77746b';ctx.beginPath();ctx.moveTo(-w*.43,-h*.08);ctx.lineTo(-w*.34,-h*.48);ctx.lineTo(-w*.05,-h*.72);ctx.lineTo(w*.32,-h*.55);ctx.lineTo(w*.44,-h*.14);ctx.closePath();ctx.fill();ctx.strokeStyle='#48463f';ctx.lineWidth=2;ctx.stroke();}
    else if(n.includes('stump')){roundRect(-w*.35,-h*.58,w*.7,h*.53,h*.09,'#775439',dark,2);ellipseFill(0,-h*.58,w*.34,h*.12,'#ad8559','#5a3e2b',2);ctx.strokeStyle='#6f4e34';ctx.beginPath();ctx.arc(0,-h*.58,w*.17,0,TAU);ctx.stroke();}
    else if(n.includes('lumber')||n.includes('log')||n.includes('driftwood')||n.includes('firewood')){for(let i=0;i<5;i++){const xx=(i%3-1)*w*.22,yy=-h*(.16+Math.floor(i/3)*.27);roundRect(xx-w*.23,yy-h*.14,w*.46,h*.18,h*.08,brown,dark,1);ellipseFill(xx+w*.2,yy-h*.05,w*.08,h*.08,'#aa8054','#57402c',1);}}
    else if(n.includes('lantern')){roundRect(-w*.28,-h*.58,w*.56,h*.45,h*.08,'#303333','#111',2);roundRect(-w*.2,-h*.52,w*.4,h*.31,h*.04,'#d9a849','#8c632d',1);ctx.globalAlpha=.75;flame(0,-h*.31,Math.min(w,h)*.12,t);ctx.globalAlpha=1;ctx.strokeStyle='#7a6a50';ctx.lineWidth=2;ctx.beginPath();ctx.arc(0,-h*.6,w*.28,Math.PI,TAU);ctx.stroke();}
    else if(n.includes('cooler')){roundRect(-w*.44,-h*.5,w*.88,h*.45,h*.06,blue,dark,2);roundRect(-w*.46,-h*.61,w*.92,h*.15,h*.04,'#d9d6c7','#77766d',1);ctx.strokeStyle='#c9c6b7';ctx.lineWidth=2;ctx.beginPath();ctx.arc(0,-h*.5,w*.32,0,Math.PI);ctx.stroke();}
    else if(n.includes('tire')){ctx.strokeStyle='#292c2e';ctx.lineWidth=Math.max(5,w*.18);ctx.beginPath();ctx.arc(0,-h*.36,w*.29,0,TAU);ctx.stroke();ctx.strokeStyle='#5d6062';ctx.lineWidth=Math.max(2,w*.05);ctx.beginPath();ctx.arc(0,-h*.36,w*.13,0,TAU);ctx.stroke();}
    else if(n.includes('flower')){ctx.fillStyle='#76563c';ctx.beginPath();ctx.moveTo(-w*.3,-h*.35);ctx.lineTo(w*.3,-h*.35);ctx.lineTo(w*.22,-h*.04);ctx.lineTo(-w*.22,-h*.04);ctx.closePath();ctx.fill();for(let i=0;i<5;i++){line(0,-h*.34,(i-2)*w*.13,-h*(.56+.06*Math.sin(i)),green,Math.max(2,w*.04));ellipseFill((i-2)*w*.13,-h*(.58+.06*Math.sin(i)),w*.08,h*.07,i%2?'#557040':'#69874f');}}
    else if(n.includes('watering')){ellipseFill(-w*.05,-h*.31,w*.29,h*.27,green,dark,2);ctx.strokeStyle=dark;ctx.lineWidth=Math.max(2,w*.06);ctx.beginPath();ctx.arc(-w*.05,-h*.5,w*.24,Math.PI,TAU);ctx.stroke();ctx.fillStyle=green;ctx.beginPath();ctx.moveTo(w*.19,-h*.42);ctx.lineTo(w*.5,-h*.62);ctx.lineTo(w*.45,-h*.5);ctx.lineTo(w*.22,-h*.29);ctx.closePath();ctx.fill();}
    else if(n.includes('feed barrel')){roundRect(-w*.34,-h*.72,w*.68,h*.68,h*.11,'#657373',dark,2);for(const yy of [-.58,-.25])line(-w*.32,h*yy,w*.32,h*yy,'#b7a47c',Math.max(2,h*.035));ellipseFill(0,-h*.71,w*.33,h*.08,'#7f8c8a',dark,1);}
    else if(n.includes('trough')){roundRect(-w*.48,-h*.38,w*.96,h*.34,h*.08,'#746a5c',dark,2);ellipseFill(0,-h*.38,w*.42,h*.08,'#8c8578','#49443d',1);}
    else if(n.includes('pallet')){for(let i=0;i<5;i++)roundRect(-w*.45,-h*(.13+i*.1),w*.9,h*.07,2,brown,'#5b402b',1);line(-w*.34,-h*.55,-w*.34,0,'#6e4d32',Math.max(2,w*.04));line(w*.34,-h*.55,w*.34,0,'#6e4d32',Math.max(2,w*.04));}
    else if(n.includes('dog toy')){ctx.fillStyle='#c75e55';for(const xx of [-w*.22,w*.22]){ellipseFill(xx,-h*.3,w*.18,h*.16,'#c75e55','#713631',1)}roundRect(-w*.27,-h*.38,w*.54,h*.16,h*.06,'#c75e55','#713631',1);}
    else if(n.includes('feed bag')){roundRect(-w*.34,-h*.72,w*.68,h*.68,h*.12,'#b9a77f','#71664c',2);ctx.strokeStyle='#8c7a5b';ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(-w*.25,-h*.57);ctx.quadraticCurveTo(0,-h*.46,w*.25,-h*.57);ctx.stroke();}
    else if(n.includes('pool float')){ctx.strokeStyle='#e07c88';ctx.lineWidth=Math.max(6,w*.22);ctx.beginPath();ctx.ellipse(0,-h*.32,w*.28,h*.23,0,0,TAU);ctx.stroke();ctx.strokeStyle='#ffd8df';ctx.lineWidth=Math.max(1,w*.035);ctx.beginPath();ctx.ellipse(0,-h*.32,w*.28,h*.23,0,0,TAU);ctx.stroke();}
    else if(n.includes('shovel')){line(0,-h*.85,0,-h*.2,brown,Math.max(3,w*.08));ctx.fillStyle=metal;ctx.beginPath();ctx.moveTo(-w*.18,-h*.2);ctx.lineTo(w*.18,-h*.2);ctx.lineTo(w*.1,-h*.02);ctx.lineTo(-w*.1,-h*.02);ctx.closePath();ctx.fill();}
    else if(n.includes('waterer')||n.includes('chicken feeder')){ellipseFill(0,-h*.12,w*.35,h*.11,n.includes('waterer')?'#b7d1d4':'#ad8e59',dark,1);roundRect(-w*.22,-h*.66,w*.44,h*.54,h*.08,n.includes('waterer')?'#d8e8e8':'#9d8151',dark,1);}
    else if(n.includes('extension cord')){ctx.strokeStyle='#d18b3b';ctx.lineWidth=Math.max(3,w*.08);for(let r=.1;r<.36;r+=.08){ctx.beginPath();ctx.ellipse(0,-h*.34,w*r,h*r*.7,0,0,TAU);ctx.stroke();}line(w*.28,-h*.17,w*.47,-h*.02,'#d18b3b',Math.max(2,w*.05));}
    else{roundRect(-w*.4,-h*.62,w*.8,h*.58,h*.08,brown,dark,2);ctx.fillStyle='#ffffff20';ctx.fillRect(-w*.3,-h*.5,w*.6,h*.08);}
    ctx.restore();
  }

  function pushAnimal(cmd,a,cam,W,H){
    const p=project({x:a.x,y:20+a.y,z:a.z},cam,W,H);if(!p)return;
    cmd.push({depth:p.z,draw:()=>{const s=clamp(34*p.scale,9,35),pig=a.name.includes('Pig'),bird=a.name.includes('Peacock')||a.name.includes('Chicken')||a.name.includes('Turkey'),goat=a.name.includes('Goat');ctx.save();ctx.translate(p.x,p.y);ctx.fillStyle='#0004';ctx.beginPath();ctx.ellipse(0,4,s*.72,s*.2,0,0,TAU);ctx.fill();ctx.fillStyle=pig?'#a86b55':bird?'#567766':goat?'#d8d0b8':'#d4b18a';ctx.beginPath();ctx.ellipse(0,-s*.45,s*.7,s*.43,0,0,TAU);ctx.fill();ellipseFill(s*.48,-s*.62,s*.27,s*.25,ctx.fillStyle);if(bird){ctx.fillStyle='#315e6b';ctx.beginPath();ctx.moveTo(-s*.55,-s*.6);ctx.lineTo(-s*1.05,-s*1.1);ctx.lineTo(-s*.8,-s*.15);ctx.closePath();ctx.fill();}else{ctx.fillStyle='#41352c';ctx.beginPath();ctx.arc(s*.57,-s*.65,s*.035,0,TAU);ctx.fill();}ctx.restore();}});
  }

  function pushActor(cmd,a,cam,W,H,isPlayer){
    if(a.role==='hider'&&a.prop){const s=a.propShape||propShape(a.prop),p={id:`actor-${a.index}`,x:a.x,z:a.z,y:a.y,type:a.prop,w:s.w,d:s.d,h:s.h,color:s.color,climbable:s.climbable,animate:!a.locked};pushProp(cmd,p,cam,W,H,false);return;}
    const base=project({x:a.x,y:a.y,z:a.z},cam,W,H),head=project({x:a.x,y:a.y+a.height,z:a.z},cam,W,H);if(!base||!head)return;const depth=(base.z+head.z)/2;cmd.push({depth,draw:()=>drawCharacterSprite(a,base,head,cam,W,H,isPlayer)});
  }
  function drawCharacterSprite(a,base,head,cam,W,H,isPlayer){
    const img=characterSprite(a.person,a.style||'default'),dog=a.person.dog,screenH=Math.abs(base.y-head.y),h=clamp(screenH*(dog?1.12:1.22),dog?38:64,dog?145:245),ratio=(img&&img.naturalHeight)?img.naturalWidth/img.naturalHeight:(dog?.78:.48),w=h*ratio,bob=a.moveAmount*Math.sin(performance.now()*.018+a.index)*Math.min(5,h*.025),x=base.x,y=base.y+bob;
    ctx.save();ctx.globalAlpha=a.blind>0?.7:1;ctx.fillStyle='#0005';ctx.beginPath();ctx.ellipse(x,y+4,w*.4,Math.max(3,h*.045),0,0,TAU);ctx.fill();
    if(isPlayer){ctx.shadowColor='#f5d477';ctx.shadowBlur=14;}const rel=wrapAngle(a.yaw-state.camera.yaw),flip=Math.sin(rel)<-.2?-1:1;
    ctx.translate(x,y);ctx.scale(flip,1);const lean=a.moveAmount*Math.sin(performance.now()*.012+a.index)*.025;ctx.rotate(lean);
    if(img&&img.complete&&img.naturalWidth){ctx.drawImage(img,-w/2,-h,w,h);}else{roundRect(-w*.25,-h*.75,w*.5,h*.7,h*.12,'#8b6b4b','#33271e',2);}
    ctx.restore();
    // Name and player marker are UI, not replacement heads. The actual full-body avatar stays visible.
    ctx.save();ctx.textAlign='center';ctx.font=`900 ${clamp(h*.09,9,14)}px system-ui`;ctx.lineWidth=3;ctx.strokeStyle='#15110dcc';ctx.fillStyle=isPlayer?'#ffe39a':'#e9f3ff';ctx.strokeText(a.person.name,x,y-h-8);ctx.fillText(a.person.name,x,y-h-8);if(isPlayer){ctx.fillStyle='#ffe082';ctx.beginPath();ctx.moveTo(x,y-h-28);ctx.lineTo(x-7,y-h-40);ctx.lineTo(x+7,y-h-40);ctx.closePath();ctx.fill();}
    if(a.role==='hunter'){const handY=y-h*.48,dir=flip;ctx.strokeStyle='#263238';ctx.lineWidth=Math.max(4,h*.045);ctx.beginPath();ctx.moveTo(x+dir*w*.15,handY);ctx.lineTo(x+dir*w*.55,handY-h*.09);ctx.stroke();ctx.strokeStyle='#d0914e';ctx.lineWidth=Math.max(2,h*.016);ctx.beginPath();ctx.moveTo(x+dir*w*.35,handY-h*.04);ctx.lineTo(x+dir*w*.63,handY-h*.1);ctx.stroke();ellipseFill(x+dir*w*.66,handY-h*.11,Math.max(3,h*.025),Math.max(3,h*.025),'#70d2ff');}
    ctx.restore();
  }

  function pushEffect(cmd,e,cam,W,H){const p=project({x:e.x,y:e.y,z:e.z},cam,W,H);if(!p)return;cmd.push({depth:p.z-.2,draw:()=>{if(e.kind==='spark'){ctx.fillStyle=e.color;ctx.beginPath();ctx.arc(p.x,p.y,clamp(3*p.scale,1.5,5),0,TAU);ctx.fill();}else{const q=1-e.life/e.max;ctx.strokeStyle=e.kind==='flash'?`rgba(255,245,180,${1-q})`:`rgba(255,245,215,${1-q})`;ctx.lineWidth=clamp(8*p.scale,2,10);ctx.beginPath();ctx.arc(p.x,p.y,(12+q*55)*p.scale,0,TAU);ctx.stroke();}}});}
  function poly(pts,fill){if(!pts.length)return;ctx.beginPath();ctx.moveTo(pts[0].x,pts[0].y);for(let i=1;i<pts.length;i++)ctx.lineTo(pts[i].x,pts[i].y);ctx.closePath();fill?ctx.fill():ctx.stroke();}
  function shade(hex,amt){const m=/^#([0-9a-f]{6})$/i.exec(hex);if(!m)return hex;let n=parseInt(m[1],16),r=n>>16,g=n>>8&255,b=n&255;const f=amt>=0?255:0,p=Math.abs(amt);r=Math.round(r+(f-r)*p);g=Math.round(g+(f-g)*p);b=Math.round(b+(f-b)*p);return`rgb(${r},${g},${b})`;}

  function modal(html,bind){closeModal();const back=document.createElement('div');back.className='modal-backdrop';back.id='ph3Modal';back.innerHTML=`<div class="modal">${html}</div>`;document.body.appendChild(back);if(bind)bind(back.querySelector('.modal'));}
  function closeModal(){document.getElementById('ph3Modal')?.remove();}

  // Exposed for the automated tryout suite and future multiplayer adapter.
  window.__PROP_3D_TEST__={MAPS,propShape,OUTFITS,getInput:()=>({joy:{x:joy.x,z:joy.z,active:joy.active,id:joy.id},touchMove:{...touchMove}}),getSnapshot:()=>state?{round:state.round,phase:state.phase,mapKey:state.mapKey,player:state.player?{x:state.player.x,y:state.player.y,z:state.player.z,vy:state.player.vy,role:state.player.role,locked:state.player.locked,prop:state.player.prop,propChanges:state.player.propChanges,decoys:state.player.decoys,flash:state.player.flash}:null}:null,features:{thirdPerson:true,jumpPhysics:true,climbableGeometry:true,computerPlayers:true,phoneControls:true,desktopControls:true,touchDpad:true,touchJoystickFallback:true,firstRoundHider:true,workingSelectors:true,sparks:true,propLock:true,fullBodySprites:true,cartoonProps:true,samePropArt:true,noWorldLabels:true,largeJoystick:true,cameraReset:true,sprintToggle:true,avatarStyleHUD:true,lockedPropStill:true,expandedMaps:true,roomClutter:true,roomMiniMap:true,expandedPropArt:true,uprightCamera:true,roleModeHUD:true,illustratedPropSprites:true,roomSpecificClutter:true,detailedWallMaterials:true,detailedFloorMaterials:true,roomFixtures:true,hunterAimMode:true}};
  window.PropHunt={mount};
})();
