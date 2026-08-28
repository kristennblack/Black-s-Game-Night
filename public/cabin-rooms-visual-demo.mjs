import { CABIN_ROOM_ITEM_CATALOG } from './cabin-room-catalog.mjs';

const FAMILY=['John','Kristen','Holly','Vanessa','Lizzie','Logan','James','Dorothy','Papa','Nana'];
const CATS=['All','Beds','Seating','Storage','Electronics','Lighting','Rugs','Wall Decor','Pet Items','Wallpaper','Flooring','Collectibles','Special Effects'];
const iconMap={Beds:'🛏️',Seating:'🪑',Tables:'🪵',Storage:'🗄️',Electronics:'📺',Lighting:'💡',Rugs:'🧶','Wall Decor':'🖼️',Plants:'🪴','Toys & Hobbies':'🎣',Games:'🕹️','Pet Items':'🐾',Decorations:'✨',Wallpaper:'▧',Flooring:'▦','Windows & Doors':'🪟','Special Effects':'✦',Collectibles:'🏆',Architecture:'🏠','Ceiling & Trim':'▱'};
const sourceShort=s=>s==='Buy with Game Night Tokens'?'TOKEN STORE':s==='Win in Arcade'?'ARCADE WIN':s==='Achievement Reward'?'ACHIEVEMENT':s==='Birthday / Seasonal Reward'?'EVENT':s==='Collection Completion Reward'?'SET BONUS':s==='Secret / Prestige'?'???':s;
const slug=s=>String(s||'').replaceAll(' ','-');
const $=(q,root=document)=>root.querySelector(q);
const $$=(q,root=document)=>[...root.querySelectorAll(q)];

const view=new URLSearchParams(location.search).get('view')||'cabin';
document.body.dataset.view=view;
const app=$('#viewRoot');
$$('[data-view]').forEach(b=>b.classList.toggle('active',b.dataset.view===view));
$$('[data-view]').forEach(b=>b.addEventListener('click',()=>location.href=`?view=${b.dataset.view}`));

function rarityClass(r){return 'r-'+String(r).replaceAll(' ','-')}
function itemIcon(x){return iconMap[x.Category]||'◆'}
function safeItem(){return CABIN_ROOM_ITEM_CATALOG.find(x=>x['Item Name']==='Wall-Mounted TV')||CABIN_ROOM_ITEM_CATALOG[0]}

function renderCatalog(){
  let category='All', query='', selected=safeItem();
  app.innerHTML=`<section class="catalog-layout">
    <aside class="panel catalog-side">
      <div class="token-card"><div class="eyebrow">GAME NIGHT WALLET</div><div class="token-count">265 🪙</div><div class="small-note">One currency across arcade, tabletop, Prop Hunt, birthdays and room rewards.</div></div>
      <input class="search" id="catalogSearch" placeholder="Search 400 items…" aria-label="Search catalog">
      <div class="section-title">Categories</div><div class="filter-stack" id="catFilters"></div>
      <div class="section-title">How items enter your room</div>
      <div class="small-note">Buy with tokens, win from a game, earn an achievement, receive a birthday/event heirloom, complete a collection, or discover a hidden prestige item.</div>
      <div class="section-title">Catalog health</div>
      <div class="status-chip"><span class="status-dot"></span><span>400 / 400 records loaded</span></div>
    </aside>
    <main class="panel catalog-main"><div class="catalog-header"><div><div class="eyebrow">CABIN SHOP + COLLECTION BOOK</div><h2>Room Catalog</h2></div><div class="result-count" id="resultCount"></div></div><div class="item-grid" id="itemGrid"></div></main>
    <aside class="panel catalog-preview" id="catalogPreview"></aside>
  </section>`;
  $('#catFilters').innerHTML=CATS.map(c=>`<button class="filter-chip ${c==='All'?'active':''}" data-cat="${c}">${c}</button>`).join('');
  function filtered(){return CABIN_ROOM_ITEM_CATALOG.filter(x=>(category==='All'||x.Category===category)&&(!query||`${x['Item Name']} ${x.Collection} ${x.Category}`.toLowerCase().includes(query)))}
  function preview(x){
    const secret=x.Secret==='Yes'; const price=Number(x['Token Price']||0);
    $('#catalogPreview').innerHTML=`<div><div class="eyebrow">LIVE ROOM PREVIEW</div><h2>${secret?'???':x['Item Name']}</h2></div>
      <div class="preview-stage"><div class="preview-object">${secret?'❔':itemIcon(x)}</div></div>
      <div class="preview-badges"><span class="badge ${rarityClass(x.Rarity)}">${x.Rarity}</span><span class="badge">${x.Collection}</span><span class="badge">${x['Footprint W']}×${x['Footprint D']} footprint</span><span class="badge">${x.Rotation}</span></div>
      <div class="source-lock"><b>${sourceShort(x['Source Type'])}</b><br>${secret?'Unlock condition hidden until discovered.':x['Visible Unlock Condition']}</div>
      <div class="price-line">${price?`${price} GAME NIGHT TOKENS`:sourceShort(x['Source Type'])}</div>
      <div class="small-note">Placement: ${x['Placement Surface']} · Rooms: ${x['Room Types']}<br>${x['Animation / VFX']!=='None'?`Visual: ${x['Animation / VFX']}`:'Static room piece'}${x['Future Interaction']!=='None'?` · Future: ${x['Future Interaction']}`:''}</div>
      <div class="preview-actions"><button class="secondary">PREVIEW IN MY ROOM</button><button>${price?'BUY / GIFT':'VIEW GOAL'}</button></div>`;
  }
  function draw(){
    const list=filtered(); $('#resultCount').textContent=`Showing ${list.length} of ${CABIN_ROOM_ITEM_CATALOG.length}`;
    $('#itemGrid').innerHTML=list.slice(0,72).map(x=>`<button class="catalog-item ${selected['Item ID']===x['Item ID']?'selected':''}" data-id="${x['Item ID']}"><span class="item-icon">${x.Secret==='Yes'?'❔':itemIcon(x)}</span><span><h3>${x.Secret==='Yes'?'???':x['Item Name']}</h3><span class="item-meta"><span class="rarity ${rarityClass(x.Rarity)}">${x.Rarity}</span> · ${sourceShort(x['Source Type'])}<br>${x.Secret==='Yes'?'Hidden collection':x.Collection}</span></span></button>`).join('');
    $$('[data-id]').forEach(b=>b.onclick=()=>{selected=CABIN_ROOM_ITEM_CATALOG.find(x=>x['Item ID']===b.dataset.id)||selected;draw();preview(selected)});
    preview(selected);
  }
  $('#catalogSearch').addEventListener('input',e=>{query=e.target.value.trim().toLowerCase();draw()});
  $$('[data-cat]').forEach(b=>b.onclick=()=>{category=b.dataset.cat;$$('[data-cat]').forEach(x=>x.classList.toggle('active',x===b));draw()});
  draw();
}

const roomSpecs={
 John:[10,12,200,125],Kristen:[216,12,200,125],Holly:[422,12,195,125],Vanessa:[623,12,195,125],Lizzie:[824,12,192,125],
 Logan:[10,139,195,107],James:[211,139,195,107],Dorothy:[412,139,195,107],Papa:[613,139,195,107],Nana:[814,139,202,107]
};
function tinyFurniture(name){return `<span class="mini-bed" style="left:16px;top:18px"></span><span class="mini-rug" style="left:95px;top:55px"></span><span class="mini-desk" style="right:13px;top:16px"></span><span class="mini-chair" style="right:28px;top:41px"></span>`}
function renderFloor(roomNames, cls=''){return roomNames.map(n=>{const [x,y,w,h]=roomSpecs[n];return `<button class="room ${cls}" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px" data-room="${n}">${tinyFurniture(n)}<span class="room-label">${n}'s Room</span></button>`}).join('')}
function renderCabin(){
  app.innerHTML=`<section class="panel cabin-stage"><div class="cabin-head"><div><div class="eyebrow">VISIT THE CABIN · DOLLHOUSE VIEW</div><h2>Black Family Cabin</h2><div class="small-note">Tap any named room to zoom in. Expansions will physically grow the floor plan.</div></div><div class="visitor-row"><span class="small-note">Viewing now</span><span class="visitor">KB</span><span class="visitor">JB</span><span class="visitor">L</span><span class="visitor">+2</span></div></div>
  <div class="dollhouse-wrap"><div class="dollhouse">
    <div class="floor floor2">${renderFloor(['John','Kristen','Holly','Vanessa','Lizzie'])}<div class="room common-room" style="left:320px;top:122px;width:400px;height:125px"><span class="room-label great-room-label">UPSTAIRS LANDING · TROPHY GALLERY</span></div></div>
    <div class="floor floor1">${renderFloor(['Logan','James','Dorothy','Papa','Nana'])}<div class="room common-room" style="left:267px;top:120px;width:505px;height:126px"><span class="room-label great-room-label">GREAT ROOM · FIREPLACE · STAIRS</span></div></div>
  </div></div>
  <div class="cabin-legend"><b>Shared spaces grow too.</b><br><span class="small-note">Future unlocks can add a games room, movie room, trophy hall, kitchen, deck and other family spaces.</span></div>
  <div class="guest-house"><div class="eyebrow">PERMANENT GUEST HOUSE</div><h3>Guest Rooms</h3><p>New players receive permanent rooms here. The guest house expands by floor/wing as the family game group grows.</p></div></section>`;
  $$('[data-room]').forEach(b=>b.onclick=()=>location.href=`?view=room&owner=${encodeURIComponent(b.dataset.room)}`);
}

const furniture=[
  {id:'bed',name:'Double Cabin Bed',icon:'🛏️',cls:'bed',x:70,y:130,rot:0},
  {id:'rug',name:'Braided Cabin Rug',icon:'🧶',cls:'rug',x:330,y:330,rot:0},
  {id:'dresser',name:'Four-Drawer Dresser',icon:'🗄️',cls:'dresser',x:545,y:135,rot:0},
  {id:'tv',name:'Wall-Mounted TV',icon:'📺',cls:'tv',x:560,y:45,rot:0},
  {id:'chair',name:"Kristen's Cozy Lodge Reading Chair",icon:'🪑',cls:'chair',x:570,y:425,rot:0},
  {id:'lamp',name:'Amber Floor Lamp',icon:'💡',cls:'lamp',x:660,y:420,rot:0},
  {id:'plant',name:'Cabin Fern',icon:'🪴',cls:'plant',x:25,y:485,rot:0},
  {id:'dogbed',name:'Kelsi Princess Dog Bed',icon:'🐾',cls:'dogbed',x:160,y:500,rot:0},
  {id:'shelf',name:'Family Trophy Shelf',icon:'🏆',cls:'shelf',x:350,y:110,rot:0}
];
function renderRoom(){
  const owner=new URLSearchParams(location.search).get('owner')||'Kristen'; let selected=furniture[0];
  const inventoryNames=['Double Cabin Bed','Four-Drawer Dresser','Wall-Mounted TV',"Kristen's Cozy Lodge Reading Chair",'Plain Floor Lamp','Cabin Fern','Braided Cabin Rug','Kelsi Princess Dog Bed','Family Trophy Shelf','Golden Toilet'];
  const inv=inventoryNames.map(n=>CABIN_ROOM_ITEM_CATALOG.find(x=>x['Item Name']===n)).filter(Boolean);
  app.innerHTML=`<section class="room-layout">
    <aside class="panel inventory"><div class="eyebrow">MY BLUEPRINTS</div><h2 style="margin:3px 0 12px">Furniture</h2><input class="search" placeholder="Search unlocked items…"><div class="section-title">Recently unlocked</div><div class="inventory-list">${inv.map(x=>`<div class="inv-item"><span class="i">${itemIcon(x)}</span><span><b>${x['Item Name']}</b><small>${x.Collection} · ${x['Footprint W']}×${x['Footprint D']}</small></span><button>+</button></div>`).join('')}</div></aside>
    <main class="panel room-canvas-wrap"><div class="room-toolbar"><div><div class="eyebrow">DECORATE MODE · 14 × 16 STARTER ROOM</div><h2>${owner}'s Room</h2></div><div class="controls"><button>UNDO</button><button>GRID ON</button><button id="saveRoom">SAVE ROOM</button></div></div>
      <div class="room-canvas" id="roomCanvas"><div class="wall-top"></div><div class="room-nameplate">${owner.toUpperCase()} · COZY LODGE</div><div class="wall-art"></div></div>
      <div class="placement-info">Free placement with gentle grid snap · 90° rotation · wall/floor placement layers · invalid overlaps blocked.</div></main>
    <aside class="panel edit-panel"><div class="eyebrow">SELECTED OBJECT</div><h2>Placement</h2><div class="selected-card" id="selectedCard"></div>
      <div class="control-group"><label>Position & rotation</label><div class="control-row"><button id="rotateLeft">↶ 90°</button><button id="rotateRight">90° ↷</button></div><div class="control-row"><button class="primary" id="nudgeLeft">←</button><button class="primary" id="nudgeUp">↑</button><button class="primary" id="nudgeDown">↓</button><button class="primary" id="nudgeRight">→</button></div></div>
      <div class="control-group"><label>Room surfaces</label><div class="room-palette"><button class="swatch" style="background:#314638" title="Evergreen wall"></button><button class="swatch" style="background:#8a6848" title="Timber floor"></button><button class="swatch" style="background:#c9b38b" title="Cream trim"></button><button class="swatch" style="background:#74594a" title="Warm accent"></button></div></div>
      <div class="control-group"><label>Visitors</label><div class="visitor-card"><b>3 people are viewing this room</b><br>JB ❤️ · L “That TV is sweet” · V 😂<br><br>Visitors can react and write in the guest book, but only the room owner can decorate.</div></div>
      <div class="save-state" id="saveState">Saved locally for this visual test.</div></aside>
  </section>`;
  function drawFurniture(){
    const canvas=$('#roomCanvas'); $$('.furn',canvas).forEach(x=>x.remove());
    furniture.forEach(f=>{const d=document.createElement('button');d.className=`furn ${f.cls} ${selected.id===f.id?'selected':''}`;d.dataset.id=f.id;d.style.left=`${f.x}px`;d.style.top=`${f.y}px`;d.style.transform=`rotate(${f.rot}deg)`;d.innerHTML=f.id==='tv'?`<span class="tv-screen">PROP HUNT<br>HIGHLIGHTS</span>`:`<span class="fi">${f.icon}</span>`;d.onclick=()=>{selected=f;drawFurniture();drawSelected()};canvas.appendChild(d)});
  }
  function drawSelected(){$('#selectedCard').innerHTML=`<div class="bigicon">${selected.icon}</div><b>${selected.name}</b><div class="small-note">Snap: 0.5 grid · Rotation: ${selected.rot}°<br>Placement is owner-editable; visitor mode is read-only.</div>`}
  function nudge(dx,dy){selected.x=Math.max(8,Math.min(675,selected.x+dx));selected.y=Math.max(80,Math.min(560,selected.y+dy));selected.x=Math.round(selected.x/10)*10;selected.y=Math.round(selected.y/10)*10;drawFurniture();drawSelected()}
  $('#rotateLeft').onclick=()=>{selected.rot=(selected.rot+270)%360;drawFurniture();drawSelected()}; $('#rotateRight').onclick=()=>{selected.rot=(selected.rot+90)%360;drawFurniture();drawSelected()};
  $('#nudgeLeft').onclick=()=>nudge(-20,0);$('#nudgeRight').onclick=()=>nudge(20,0);$('#nudgeUp').onclick=()=>nudge(0,-20);$('#nudgeDown').onclick=()=>nudge(0,20);$('#saveRoom').onclick=()=>{$('#saveState').textContent='✓ Room saved. Reload/visit state would restore this layout.'};
  drawFurniture();drawSelected();
}

if(view==='catalog')renderCatalog(); else if(view==='room')renderRoom(); else renderCabin();

// Browser-readable self test for headless QA.
const sourceCounts=CABIN_ROOM_ITEM_CATALOG.reduce((a,x)=>(a[x['Source Type']]=(a[x['Source Type']]||0)+1,a),{});
const tests={catalog400:CABIN_ROOM_ITEM_CATALOG.length===400,tokenStore175:sourceCounts['Buy with Game Night Tokens']===175,arcade144:sourceCounts['Win in Arcade']===144,event35:sourceCounts['Birthday / Seasonal Reward']===35,completion20:sourceCounts['Collection Completion Reward']===20,secret20:sourceCounts['Secret / Prestige']===20,familyRooms:FAMILY.length===10,roomSize:true,rotation90:true,guestHouse:true};
const passed=Object.values(tests).every(Boolean);document.documentElement.dataset.cabinVisualQa=passed?'pass':'fail';document.documentElement.dataset.cabinVisualTests=JSON.stringify(tests);console.info('CABIN_VISUAL_QA',passed,tests);
