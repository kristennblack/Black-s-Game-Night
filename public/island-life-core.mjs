export const FAMILY_IDS=['john','kristen','holly','elizabeth','vanessa','logan','james','dorothy','nana','papa','kelsi','molly','gunner'];
export const FAMILY_ID_SET=new Set(FAMILY_IDS);

export const JOBS={
  barista:{name:'Barista',building:'coffee',pay:95,cooldownMs:45000,skill:'hospitality',description:'Make drinks, tidy the café and serve island regulars.'},
  shopkeeper:{name:'Shopkeeper',building:'market',pay:105,cooldownMs:50000,skill:'retail',description:'Stock shelves, ring through purchases and keep the market humming.'},
  carpenter:{name:'Carpenter',building:'workshop',pay:135,cooldownMs:60000,skill:'crafting',description:'Build furniture, repair docks and help improve island homes.'},
  ranger:{name:'Island Ranger',building:'ranger',pay:125,cooldownMs:60000,skill:'foraging',description:'Care for trails, trees, beaches and resource areas.'},
  gardener:{name:'Gardener',building:'garden',pay:105,cooldownMs:50000,skill:'gardening',description:'Tend flowers, herbs, fruit trees and the meadow plots.'},
  fisher:{name:'Fisher',building:'marina',pay:120,cooldownMs:55000,skill:'fishing',description:'Work the docks, mend nets and bring in the island catch.'},
  stylist:{name:'Stylist',building:'boutique',pay:100,cooldownMs:50000,skill:'style',description:'Help residents put together outfits and keep the boutique looking sharp.'},
  cook:{name:'Cook',building:'cafe',pay:120,cooldownMs:55000,skill:'cooking',description:'Prep meals, bake treats and turn gathered ingredients into comfort food.'},
  courier:{name:'Island Courier',building:'post',pay:115,cooldownMs:50000,skill:'delivery',description:'Move parcels and supplies between homes and village shops.'}
};

export const HOUSE_LEVELS=[
  {level:0,name:'Starter Tent',price:0,width:5,depth:4.5,rooms:1,storage:18,description:'A canvas starter camp on your claimed lot.'},
  {level:1,name:'Island Cottage',price:650,width:6.6,depth:5.8,rooms:1,storage:32,materials:{wood:10,stone:4},description:'A cozy one-room cottage with a porch and room to decorate.'},
  {level:2,name:'Expanded Bungalow',price:2400,width:8.2,depth:7,rooms:2,storage:55,materials:{wood:18,stone:10,fiber:8},description:'A larger bungalow with separated living and bedroom areas.'},
  {level:3,name:'Family Island House',price:6500,width:10,depth:8.4,rooms:3,storage:90,materials:{hardwood:18,stone:18,clay:12},description:'A full family home with kitchen, living and bedroom zones.'},
  {level:4,name:'Two-Storey Tropical Villa',price:15000,width:12,depth:10,rooms:5,storage:150,materials:{hardwood:30,stone:25,clay:20,coral:6},description:'A roomy tropical villa with upstairs space and a broad porch.'}
];

export const LOTS=[
  {id:'lot01',x:-38,z:26,yaw:1.1,label:'Palm Point 1'}, {id:'lot02',x:-28,z:37,yaw:.8,label:'Palm Point 2'},
  {id:'lot03',x:-14,z:42,yaw:.35,label:'Sunset Row 1'}, {id:'lot04',x:2,z:44,yaw:0,label:'Sunset Row 2'},
  {id:'lot05',x:18,z:41,yaw:-.35,label:'Sunset Row 3'}, {id:'lot06',x:31,z:34,yaw:-.75,label:'Coral Lane 1'},
  {id:'lot07',x:40,z:22,yaw:-1.1,label:'Coral Lane 2'}, {id:'lot08',x:43,z:7,yaw:-1.45,label:'Coral Lane 3'},
  {id:'lot09',x:41,z:-11,yaw:-1.7,label:'Lagoon Road 1'}, {id:'lot10',x:34,z:-28,yaw:-2.1,label:'Lagoon Road 2'},
  {id:'lot11',x:19,z:-39,yaw:-2.6,label:'South Beach 1'}, {id:'lot12',x:1,z:-44,yaw:Math.PI,label:'South Beach 2'},
  {id:'lot13',x:-18,z:-40,yaw:2.7,label:'South Beach 3'}
];
export const LOT_BY_ID=Object.fromEntries(LOTS.map(x=>[x.id,x]));

export const BUILDINGS={
  plaza:{name:'Island Plaza',x:0,z:0,radius:5},
  market:{name:'Sunbasket Market',x:-9,z:-5,radius:4.2},
  furniture:{name:'Palm & Pine Home',x:8,z:-6,radius:4.2},
  boutique:{name:'Drift Boutique',x:10,z:6,radius:3.8},
  coffee:{name:'Shoreline Coffee',x:-7,z:7,radius:3.7},
  workshop:{name:'Island Workshop',x:-20,z:6,radius:4.5},
  ranger:{name:'Ranger Hut',x:-28,z:-17,radius:3.7},
  garden:{name:'Meadow Garden Shed',x:22,z:20,radius:3.5},
  marina:{name:'Bluefin Marina',x:27,z:-27,radius:4.5},
  cafe:{name:'Seabreeze Kitchen',x:1,z:11,radius:3.8},
  post:{name:'Island Post',x:18,z:1,radius:3.6}
};

export const ITEMS={
  wood:{name:'Wood',type:'resource',buy:14,sell:7,store:'market',stack:99},hardwood:{name:'Hardwood',type:'resource',buy:28,sell:14,store:'market',stack:99},
  stone:{name:'Stone',type:'resource',buy:18,sell:9,store:'market',stack:99},clay:{name:'Clay',type:'resource',buy:20,sell:10,store:'market',stack:99},
  fiber:{name:'Palm Fiber',type:'resource',buy:12,sell:6,store:'market',stack:99},shell:{name:'Seashell',type:'resource',buy:0,sell:12,store:null,stack:99},
  coral:{name:'Coral Piece',type:'resource',buy:0,sell:24,store:null,stack:99},herb:{name:'Island Herb',type:'resource',buy:14,sell:7,store:'market',stack:60},
  flower:{name:'Tropical Flowers',type:'resource',buy:12,sell:6,store:'market',stack:60},
  coconut:{name:'Coconut',type:'food',buy:16,sell:8,store:'market',stack:40,needs:{hunger:8,fun:1}},mango:{name:'Mango',type:'food',buy:18,sell:9,store:'market',stack:40,needs:{hunger:10,fun:2}},
  fish:{name:'Fresh Fish',type:'food',buy:0,sell:26,store:null,stack:40,needs:{hunger:12}},
  axe:{name:'Trail Axe',type:'tool',buy:160,sell:80,store:'market',stack:1},pickaxe:{name:'Rock Pick',type:'tool',buy:180,sell:90,store:'market',stack:1},
  fishing_rod:{name:'Island Fishing Rod',type:'tool',buy:190,sell:95,store:'market',stack:1},watering_can:{name:'Watering Can',type:'tool',buy:110,sell:55,store:'market',stack:1},
  house_coffee:{name:'House Coffee',type:'consumable',buy:18,sell:6,store:'coffee',stack:20,needs:{energy:12,fun:3}},
  island_latte:{name:'Island Latte',type:'consumable',buy:28,sell:9,store:'coffee',stack:20,needs:{energy:18,fun:6}},
  coconut_smoothie:{name:'Coconut Smoothie',type:'consumable',buy:34,sell:12,store:'coffee',stack:20,needs:{hunger:10,energy:6,fun:5}},
  breakfast_wrap:{name:'Breakfast Wrap',type:'consumable',buy:38,sell:14,store:'cafe',stack:20,needs:{hunger:22,energy:4}},
  island_bowl:{name:'Island Harvest Bowl',type:'consumable',buy:45,sell:16,store:'cafe',stack:20,needs:{hunger:30,fun:3}},
  simple_bed:{name:'Wooden Bed',type:'furniture',buy:240,sell:120,store:'furniture',footprint:[2.2,1.5],kind:'bed'},
  sofa:{name:'Comfy Sofa',type:'furniture',buy:320,sell:160,store:'furniture',footprint:[2.2,.85],kind:'sofa'},armchair:{name:'Big Armchair',type:'furniture',buy:190,sell:95,store:'furniture',footprint:[.9,.9],kind:'chair'},
  dining_table:{name:'Dining Table',type:'furniture',buy:280,sell:140,store:'furniture',footprint:[1.8,1],kind:'table'},dining_chair:{name:'Dining Chair',type:'furniture',buy:95,sell:47,store:'furniture',footprint:[.55,.55],kind:'chair'},
  coffee_table:{name:'Coffee Table',type:'furniture',buy:135,sell:67,store:'furniture',footprint:[1.2,.7],kind:'table'},bookshelf:{name:'Tall Bookshelf',type:'furniture',buy:220,sell:110,store:'furniture',footprint:[1.3,.4],kind:'bookshelf'},
  floor_lamp:{name:'Floor Lamp',type:'furniture',buy:115,sell:57,store:'furniture',footprint:[.4,.4],kind:'lamp'},island_rug:{name:'Woven Island Rug',type:'furniture',buy:150,sell:75,store:'furniture',footprint:[2.4,1.7],kind:'rug'},
  potted_palm:{name:'Potted Palm',type:'furniture',buy:130,sell:65,store:'furniture',footprint:[.65,.65],kind:'plant'},tv:{name:'Flat Screen TV',type:'furniture',buy:460,sell:230,store:'furniture',footprint:[1.4,.35],kind:'tv'},
  dresser:{name:'Dresser',type:'furniture',buy:210,sell:105,store:'furniture',footprint:[1.3,.5],kind:'dresser'},nightstand:{name:'Nightstand',type:'furniture',buy:95,sell:47,store:'furniture',footprint:[.55,.5],kind:'table'},
  kitchen_counter:{name:'Kitchen Counter',type:'furniture',buy:250,sell:125,store:'furniture',footprint:[1.5,.65],kind:'counter'},fridge:{name:'Refrigerator',type:'furniture',buy:420,sell:210,store:'furniture',footprint:[.85,.8],kind:'fridge'},
  stove:{name:'Stove',type:'furniture',buy:360,sell:180,store:'furniture',footprint:[.85,.7],kind:'stove'},sink:{name:'Kitchen Sink',type:'furniture',buy:280,sell:140,store:'furniture',footprint:[1,.65],kind:'sink'},
  desk:{name:'Writing Desk',type:'furniture',buy:210,sell:105,store:'furniture',footprint:[1.25,.65],kind:'desk'},toilet:{name:'Bathroom Toilet',type:'furniture',buy:180,sell:90,store:'furniture',footprint:[.7,.85],kind:'toilet'},
  bathtub:{name:'Soaking Tub',type:'furniture',buy:390,sell:195,store:'furniture',footprint:[1.7,.85],kind:'tub'},wall_art:{name:'Island Wall Art',type:'furniture',buy:90,sell:45,store:'furniture',footprint:[.8,.1],kind:'art'},
  hammock:{name:'Porch Hammock',type:'furniture',buy:230,sell:115,store:'furniture',footprint:[2.2,.8],kind:'hammock'},patio_chair:{name:'Patio Chair',type:'furniture',buy:105,sell:52,store:'furniture',footprint:[.65,.65],kind:'chair'},
  island_shirt:{name:'Tropical Button-Up',type:'clothing',buy:120,sell:60,store:'boutique',look:{top:0x4f8f83,legs:0xdbc08d}},sunset_shirt:{name:'Sunset Shirt',type:'clothing',buy:125,sell:62,store:'boutique',look:{top:0xc9715b,legs:0x4d6884}},
  cozy_hoodie:{name:'Island Hoodie',type:'clothing',buy:135,sell:67,store:'boutique',look:{top:0x667b8f,legs:0x3f566d}},western_casual:{name:'Western Casual',type:'clothing',buy:155,sell:77,store:'boutique',look:{top:0x9b7655,legs:0x405a76}},
  beach_day:{name:'Beach Day Outfit',type:'clothing',buy:110,sell:55,store:'boutique',look:{top:0xd8b47e,legs:0x7aa4a1}},work_overalls:{name:'Carpenter Overalls',type:'clothing',buy:140,sell:70,store:'boutique',look:{top:0x806b50,legs:0x3e5369}},
  barista_apron:{name:'Barista Apron',type:'clothing',buy:135,sell:67,store:'boutique',look:{top:0x51453b,legs:0x313a46}},ranger_shirt:{name:'Ranger Uniform',type:'clothing',buy:145,sell:72,store:'boutique',look:{top:0x536f50,legs:0x65533d}},
  garden_overalls:{name:'Garden Overalls',type:'clothing',buy:135,sell:67,store:'boutique',look:{top:0x779066,legs:0x55705a}},fisher_vest:{name:'Fishing Vest',type:'clothing',buy:140,sell:70,store:'boutique',look:{top:0x6d7d65,legs:0x3e5868}},
  boutique_black:{name:'Boutique Black',type:'clothing',buy:150,sell:75,store:'boutique',look:{top:0x343238,legs:0x272a31}},cook_white:{name:'Cook Whites',type:'clothing',buy:145,sell:72,store:'boutique',look:{top:0xe1dfd6,legs:0x4a4d53}},
  courier_teal:{name:'Courier Teal',type:'clothing',buy:135,sell:67,store:'boutique',look:{top:0x3d7d7e,legs:0x374d62}}
};

export const RECIPES={
  wooden_chair:{name:'Wooden Chair',output:'dining_chair',materials:{wood:4,fiber:1}},coffee_table:{name:'Coffee Table',output:'coffee_table',materials:{wood:7}},
  bookshelf:{name:'Bookshelf',output:'bookshelf',materials:{wood:8,hardwood:2}},potted_palm:{name:'Potted Palm',output:'potted_palm',materials:{clay:2,fiber:3}},
  island_rug:{name:'Woven Rug',output:'island_rug',materials:{fiber:8,flower:2}},floor_lamp:{name:'Floor Lamp',output:'floor_lamp',materials:{wood:2,stone:1,fiber:2}},
  hammock:{name:'Hammock',output:'hammock',materials:{fiber:10,wood:3}},harvest_bowl:{name:'Harvest Bowl',output:'island_bowl',materials:{mango:2,coconut:1,herb:2}}
};

const makeNodes=(pts,prefix,make)=>pts.map((p,i)=>({id:`${prefix}${i+1}`,x:p[0],z:p[1],...make(i)}));
export const FORAGE_NODES=[
  ...makeNodes([[-38,-4],[-34,2],[-31,9],[-41,11],[-36,18],[-27,15],[-42,-12],[-34,-16],[-27,-9],[-45,3]],'tree',i=>({kind:i%4===0?'hardwood':'wood',tool:'axe',cooldownMs:i%4===0?150000:110000})),
  ...makeNodes([[-47,-22],[-41,-27],[-35,-31],[-28,-26],[-22,-32]],'palm',i=>({kind:i%2?'fiber':'coconut',tool:null,cooldownMs:90000})),
  ...makeNodes([[-10,-33],[-5,-39],[2,-34],[8,-40],[13,-34],[18,-31]],'rock',i=>({kind:i%3===0?'clay':'stone',tool:'pickaxe',cooldownMs:120000})),
  ...makeNodes([[18,28],[24,31],[30,26],[15,34],[8,30],[27,18],[33,16]],'meadow',i=>({kind:i%3===0?'herb':i%3===1?'flower':'mango',tool:null,cooldownMs:75000})),
  ...makeNodes([[-33,43],[-20,49],[-5,51],[12,50],[27,44],[46,27],[50,12],[50,-7],[43,-28],[27,-45],[5,-52],[-15,-51],[-31,-43],[-45,-30]],'beach',i=>({kind:i%4===0?'coral':'shell',tool:null,cooldownMs:i%4===0?150000:65000})),
  ...makeNodes([[34,-36],[41,-30],[48,-20],[46,-5],[39,12],[-49,20],[-51,2],[-46,-19]],'fish',()=>({kind:'fish',tool:'fishing_rod',cooldownMs:90000}))
];
export const NODE_BY_ID=Object.fromEntries(FORAGE_NODES.map(n=>[n.id,n]));

export const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
export const dist=(a,b)=>Math.hypot((a?.x||0)-(b?.x||0),(a?.z||0)-(b?.z||0));
export const itemCount=(inv,id)=>Math.max(0,Number(inv?.[id]||0));
export function addItem(inv,id,qty=1){if(!ITEMS[id])return false;inv[id]=Math.min(ITEMS[id].stack||99,itemCount(inv,id)+Math.max(0,Math.floor(qty)));return true}
export function removeItem(inv,id,qty=1){qty=Math.max(0,Math.floor(qty));if(itemCount(inv,id)<qty)return false;inv[id]=itemCount(inv,id)-qty;if(inv[id]<=0)delete inv[id];return true}
export function hasItems(inv,need={}){return Object.entries(need).every(([id,q])=>itemCount(inv,id)>=q)}
export function consumeItems(inv,need={}){if(!hasItems(inv,need))return false;for(const [id,q] of Object.entries(need))removeItem(inv,id,q);return true}
export function canAffordUpgrade(r,target){const d=HOUSE_LEVELS[target];return !!d&&target===(r.home?.level??0)+1&&r.money>=d.price&&hasItems(r.inventory,d.materials||{})}
export function projectedNeeds(r,at=Date.now()){const last=Number(r.needsUpdatedAt||at),mins=Math.max(0,(at-last)/60000),b=r.needs||{energy:100,hunger:100,fun:100,social:100};return{energy:clamp(Number(b.energy??100)-mins*.32,0,100),hunger:clamp(Number(b.hunger??100)-mins*.42,0,100),fun:clamp(Number(b.fun??100)-mins*.16,0,100),social:clamp(Number(b.social??100)-mins*.12,0,100)}}
export function commitNeeds(r,at=Date.now()){r.needs=projectedNeeds(r,at);r.needsUpdatedAt=at;return r.needs}
export function boostNeeds(r,boost={},at=Date.now()){commitNeeds(r,at);for(const [k,v] of Object.entries(boost))if(k in r.needs)r.needs[k]=clamp(r.needs[k]+Number(v||0),0,100);return r.needs}
export function jobPay(id,xp=0){const j=JOBS[id];if(!j)return 0;const level=Math.floor(Math.max(0,xp)/5);return Math.round(j.pay*(1+Math.min(.35,level*.035)))}
export function houseInteriorBounds(level=0){const h=HOUSE_LEVELS[clamp(Math.floor(level),0,HOUSE_LEVELS.length-1)];return{minX:-h.width/2+.55,maxX:h.width/2-.55,minZ:-h.depth/2+.65,maxZ:h.depth/2-.65,width:h.width,depth:h.depth}}
export function sanitizePlacement(p,level=0){const b=houseInteriorBounds(level);return{x:clamp(Number(p?.x)||0,b.minX,b.maxX),z:clamp(Number(p?.z)||0,b.minZ,b.maxZ),yaw:Number.isFinite(Number(p?.yaw))?Number(p.yaw):0}}
export function sanitizeIslandSnapshot(s,prev={}){const finite=(v,f=0)=>Number.isFinite(Number(v))?Number(v):f,zone=s?.zone==='home'?'home':'island';return{x:clamp(finite(s.x,prev.x||0),-58,58),y:clamp(finite(s.y,prev.y||0),-2,12),z:clamp(finite(s.z,prev.z||0),-58,58),yaw:finite(s.yaw,prev.yaw||0),pitch:clamp(finite(s.pitch,prev.pitch||0),-.9,.75),vx:clamp(finite(s.vx,0),-12,12),vy:clamp(finite(s.vy,0),-25,25),vz:clamp(finite(s.vz,0),-12,12),anim:['idle','walk','run','jump','fall','land','mantle','wave','work','sit','dance','cheer','drink','eat','fish','cast','reel','harvest','chop','mine','dig','water','cook','inspect','use','carry','sleep'].includes(s.anim)?s.anim:'idle',zone,homeOwnerId:zone==='home'?String(s.homeOwnerId||'').slice(0,64):null,seq:Math.max(0,Math.floor(finite(s.seq,prev.seq||0))),at:Date.now()}}
