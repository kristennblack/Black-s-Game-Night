/*
 * W39 Cabin Furniture Realism
 * Design-specific 3D fallback families for the Cabin.
 * These are not a substitute for approved production GLBs. They exist between
 * production models and the older category-generic W20 bridge so upgrades do
 * not make the room visually collapse into one chair/bed/table/dresser shape.
 */

const lower=v=>String(v||'').toLowerCase();
const hash=s=>{let h=2166136261;for(const c of String(s||'')){h^=c.charCodeAt(0);h=Math.imul(h,16777619)}return h>>>0};

export const W39_BENCHMARK_IDS=Object.freeze([
  'buy-with-game-night-tokens-everyday-basics-double-cabin-bed',
  'buy-with-game-night-tokens-everyday-basics-kristen-s-cozy-lodge-',
  'buy-with-game-night-tokens-rustic-cabin-live-edge-nightstand',
  'buy-with-game-night-tokens-everyday-basics-warm-table-lamp',
  'buy-with-game-night-tokens-everyday-basics-four-drawer-dresser',
  'buy-with-game-night-tokens-everyday-basics-neutral-woven-rug',
  'buy-with-game-night-tokens-everyday-basics-wall-mounted-tv',
  'buy-with-game-night-tokens-everyday-basics-basic-desk-chair'
]);

export function inferW39FurnitureFamily(item={}){
  const name=lower(item['Item Name']),cat=String(item.Category||'');
  if(cat==='Beds & Bedroom Furniture'){
    if(/bunk/.test(name))return 'bunk-bed';
    if(/canopy|four-poster|four poster/.test(name))return 'canopy-bed';
    if(/daybed|day bed|trundle/.test(name))return 'daybed';
    if(/storage bed/.test(name))return 'storage-bed';
    if(/floating bed/.test(name))return 'floating-bed';
    if(/upholstered/.test(name))return 'upholstered-bed';
    if(/single|twin|cot/.test(name))return 'single-bed';
    return 'double-bed';
  }
  if(cat==='Seating'){
    if(/sofa/.test(name))return 'sofa';
    if(/loveseat|love seat/.test(name))return 'loveseat';
    if(/chaise/.test(name))return 'chaise';
    if(/recliner/.test(name))return 'recliner';
    if(/rocking|rocker/.test(name))return 'rocking-chair';
    if(/bench/.test(name))return 'bench';
    if(/barrel/.test(name))return 'barrel-chair';
    if(/desk chair|dining chair/.test(name))return 'desk-chair';
    if(/bean bag/.test(name))return 'bean-bag';
    return 'reading-chair';
  }
  if(cat==='Tables & Desks'){
    if(/nightstand|side table/.test(name))return 'nightstand';
    if(/coffee table/.test(name))return 'coffee-table';
    if(/writing desk|fold-down|fold down|secretary/.test(name))return 'writing-desk';
    if(/vanity/.test(name))return 'vanity';
    if(/game table/.test(name))return 'game-table';
    if(/farm table|dining table/.test(name))return 'farm-table';
    if(/desk/.test(name))return 'writing-desk';
    return 'table';
  }
  if(cat==='Storage'){
    if(/wardrobe|armoire/.test(name))return 'wardrobe';
    if(/bookcase|bookshelf|shelf/.test(name))return 'bookcase';
    if(/chest|toy chest/.test(name))return 'storage-chest';
    if(/hutch|display|showcase/.test(name))return 'hutch';
    return 'dresser';
  }
  if(cat==='Rugs & Soft Decor'&&/rug/.test(name))return 'rug';
  if(cat==='Electronics & Entertainment'&&/tv|television/.test(name))return 'wall-tv';
  if(cat==='Lighting'&&/floor lamp/.test(name))return 'floor-lamp';
  if(cat==='Lighting'&&/table lamp|desk lamp|reading lamp|lamp/.test(name))return 'lamp';
  if(cat==='Wall Decor & Pictures')return 'wall-art';
  return '';
}

export function w39PhysicalFootprintFt(item={}){
  const family=inferW39FurnitureFamily(item);
  const map={
    'single-bed':{w:3.5,d:6.5,h:4.1},'double-bed':{w:6.8,d:5.2,h:5.4},'upholstered-bed':{w:6.8,d:5.2,h:5.4},'canopy-bed':{w:6.8,d:6.6,h:7.2},'bunk-bed':{w:4.2,d:7,h:6.2},'storage-bed':{w:6.6,d:5.4,h:4.4},'floating-bed':{w:6.4,d:5.2,h:4.2},'daybed':{w:6.5,d:3.6,h:3.8},
    'reading-chair':{w:4,d:3,h:4.5},'barrel-chair':{w:3.4,d:3.2,h:3.4},'desk-chair':{w:2.3,d:2.4,h:3.4},'rocking-chair':{w:3.2,d:4,h:4.2},'recliner':{w:3.4,d:3.7,h:4.2},'sofa':{w:7.2,d:3.5,h:3.3},'loveseat':{w:5.2,d:3.4,h:3.3},'bench':{w:5,d:2.1,h:2.8},'chaise':{w:3.2,d:6.1,h:3.2},'bean-bag':{w:3.6,d:3.6,h:2.6},
    'nightstand':{w:2.4,d:2,h:2.5},'coffee-table':{w:4.5,d:2.6,h:1.7},'writing-desk':{w:5.2,d:2.6,h:3.2},'vanity':{w:4.6,d:2.3,h:5},'game-table':{w:4.2,d:4.2,h:2.7},'farm-table':{w:6.5,d:3.4,h:2.7},'table':{w:4.6,d:3,h:2.7},
    'dresser':{w:5,d:2,h:3.5},'wardrobe':{w:4.2,d:2.2,h:6.5},'bookcase':{w:4,d:1.5,h:6.2},'storage-chest':{w:3.4,d:2.1,h:2.1},'hutch':{w:4.6,d:1.8,h:6.3},
    'rug':{w:7,d:5,h:.1},'wall-tv':{w:4.2,d:.35,h:2.6},'floor-lamp':{w:1.7,d:1.7,h:5.6},'lamp':{w:1.9,d:1.9,h:3.2},'wall-art':{w:3.4,d:.2,h:2.4}
  };
  return map[family]||null;
}

function palette(THREE,art,item){
  const name=lower(item['Item Name']),seed=Number(item['Art Seed']||hash(item['Item ID']||item['Item Name']));
  let wood=0x765034;
  if(/walnut/.test(name))wood=0x5a3827; else if(/maple|birch/.test(name))wood=0x9a7650; else if(/pine|cedar/.test(name))wood=0x865d3c; else if(/oak/.test(name))wood=0x705038;
  let fabric=0x866452;if(/blush|rose/.test(name))fabric=0xa97477;else if(/moss|forest|green/.test(name))fabric=0x526a50;else if(/navy|blue/.test(name))fabric=0x4b5e70;else if(/cream|linen/.test(name))fabric=0xd8c7a9;
  const metal=/brass|gold/.test(name)?0xb58c45:/copper/.test(name)?0x9a6544:0x5d6462;
  return {seed,wood:art.material('wood',wood,{seed,roughness:.78}),woodDark:art.material('wood',art.shadeHex(wood,-.2),{seed:seed+1,roughness:.82}),fabric:art.material(/leather/.test(name)?'leather':'fabric',fabric,{seed:seed+2,roughness:.9}),cream:art.material('fabric',0xe4d5bb,{seed:seed+3,roughness:.94}),metal:art.material('metal',metal,{seed:seed+4,roughness:.42}),black:art.material('paintedMetal',0x292b2b,{seed:seed+5,roughness:.52})};
}
const tag=(g,family,item)=>{g.userData.w39Family=family;g.userData.w39DesignSpecificFallback=true;g.userData.catalogItemId=item['Item ID']||'';g.userData.catalogItemName=item['Item Name']||'';g.userData.physicalFootprintFt=w39PhysicalFootprintFt(item);g.traverse(o=>{if(o.isMesh){o.castShadow=true;o.receiveShadow=true}});return g};

function bed(THREE,art,item,family,p){
  const g=new THREE.Group();let w=family==='single-bed'||family==='bunk-bed'?1.1:2.0,d=family==='daybed'?1.25:1.58;
  const mattress=(y=.46,z=0)=>{g.add(art.box(w*.92,.22,d*.86,p.cream,[0,y,z]));g.add(art.box(w*.88,.07,d*.42,p.fabric,[0,y+.145,z+d*.18]));for(const x of [-w*.23,w*.23])g.add(art.box(w*.28,.10,d*.20,p.cream,[x,y+.15,z-d*.25]))};
  if(family==='bunk-bed'){
    for(const y of [.55,1.42]){g.add(art.box(w,.12,d,p.wood,[0,y-.18,0]));mattress(y,0)}
    for(const x of [-w*.46,w*.46])for(const z of [-d*.45,d*.45])g.add(art.box(.08,1.9,.08,p.woodDark,[x,.95,z]));
    for(let y=.25;y<1.65;y+=.28)g.add(art.box(.42,.05,.05,p.woodDark,[w*.58,y,d*.42]));g.add(art.box(.05,1.55,.05,p.woodDark,[w*.43,.9,d*.42]),art.box(.05,1.55,.05,p.woodDark,[w*.73,.9,d*.42]));
  }else{
    g.add(art.box(w,.16,d,p.wood,[0,.25,0]));for(const x of [-w*.46,w*.46])for(const z of [-d*.44,d*.44])g.add(art.box(.08,.48,.08,p.woodDark,[x,.24,z]));mattress(.48,0);
    let headH=family==='canopy-bed'?1.8:family==='upholstered-bed'?1.35:1.15;
    if(family==='upholstered-bed')g.add(art.box(w*.96,headH,.12,p.fabric,[0,.58+headH/2,d*.47])); else g.add(art.box(w*.96,headH,.10,p.woodDark,[0,.5+headH/2,d*.47]));
    if(family==='storage-bed')for(const x of [-w*.26,w*.26]){g.add(art.box(w*.42,.23,.035,p.wood,[x,.20,-d*.51]));g.add(art.sphere(.025,p.metal,[x,.2,-d*.54]))}
    if(family==='canopy-bed'){for(const x of [-w*.48,w*.48])for(const z of [-d*.47,d*.47])g.add(art.box(.07,2.15,.07,p.woodDark,[x,1.08,z]));g.add(art.box(w,.07,.07,p.woodDark,[0,2.12,-d*.47]),art.box(w,.07,.07,p.woodDark,[0,2.12,d*.47]),art.box(.07,.07,d,p.woodDark,[-w*.48,2.12,0]),art.box(.07,.07,d,p.woodDark,[w*.48,2.12,0]))}
    if(family==='daybed'){g.add(art.box(w*.96,.72,.08,p.woodDark,[0,.86,d*.47]));g.add(art.box(.08,.72,d*.92,p.woodDark,[-w*.48,.86,0]),art.box(.08,.72,d*.92,p.woodDark,[w*.48,.86,0]))}
    if(family==='floating-bed'){g.add(art.box(w*.55,.18,d*.56,p.black,[0,.10,0]))}
  }
  g.userData.interaction='sleep';return tag(g,family,item);
}

function seating(THREE,art,item,family,p){
  const g=new THREE.Group();
  if(family==='sofa'||family==='loveseat'){
    const w=family==='sofa'?2.2:1.65;g.add(art.box(w,.28,.88,p.woodDark,[0,.24,0]));
    const count=family==='sofa'?3:2;for(let i=0;i<count;i++){const x=(i-(count-1)/2)*(w/count*.88);g.add(art.box(w/count*.82,.20,.68,p.fabric,[x,.48,-.02]));g.add(art.box(w/count*.84,.62,.18,p.fabric,[x,.78,.31],[-.08,0,0]))}
    for(const x of [-w*.48,w*.48])g.add(art.box(.18,.55,.78,p.fabric,[x,.53,0]));
  }else if(family==='bench'){
    g.add(art.box(1.55,.18,.55,p.wood,[0,.48,0]));for(const x of [-.62,.62])g.add(art.box(.10,.48,.46,p.woodDark,[x,.24,0]));g.add(art.box(1.45,.45,.10,p.woodDark,[0,.82,.22]));
  }else if(family==='rocking-chair'){
    g.add(art.box(.72,.16,.66,p.fabric,[0,.54,0]));g.add(art.box(.72,.64,.14,p.fabric,[0,.93,.25],[-.12,0,0]));for(const x of [-.33,.33]){g.add(art.box(.08,.66,.08,p.woodDark,[x,.30,0]));const rocker=art.torus(.52,.035,p.woodDark,[x,.12,0],[0,0,Math.PI/2],Math.PI*.86);rocker.rotation.z=-Math.PI*.42;g.add(rocker)}}
  else if(family==='chaise'){
    g.add(art.box(.92,.23,1.55,p.fabric,[0,.39,0]));g.add(art.box(.92,.62,.16,p.fabric,[0,.78,.66],[-.16,0,0]));g.add(art.box(.12,.36,1.45,p.fabric,[-.46,.58,0]));for(const x of [-.34,.34])for(const z of [-.61,.61])g.add(art.box(.07,.34,.07,p.woodDark,[x,.17,z]));
  }else if(family==='bean-bag'){
    g.add(art.sphere(.66,p.fabric,[0,.55,0],[1,.78,1]));
  }else{
    const barrel=family==='barrel-chair',desk=family==='desk-chair',recline=family==='recliner';
    g.add(art.box(barrel?.78:desk?.62:.78,.18,desk?.58:.72,p.fabric,[0,.48,0]));
    g.add(art.box(barrel?.78:desk?.62:.78,recline?.72:.58,.15,p.fabric,[0,recline?.88:.82,.27],[-.11,0,0]));
    if(!desk)for(const x of [-.43,.43])g.add(art.box(.15,.45,.64,p.fabric,[x,.56,0]));
    for(const x of [-.28,.28])for(const z of [-.23,.23])g.add(art.box(.065,.45,.065,p.woodDark,[x,.22,z]));
    if(recline)g.add(art.box(.70,.15,.36,p.fabric,[0,.28,-.42],[.2,0,0]));
  }
  g.userData.interaction='sit';return tag(g,family,item);
}

function table(THREE,art,item,family,p){
  const g=new THREE.Group();let w=1.35,d=.72,h=.75;
  if(family==='nightstand'){w=.72;d=.60;h=.68}else if(family==='coffee-table'){w=1.35;d=.72;h=.44}else if(family==='farm-table'){w=1.95;d=.95;h=.78}else if(family==='game-table'){w=1.15;d=1.15;h=.76}else if(family==='writing-desk'||family==='vanity'){w=1.5;d=.70;h=.78}
  g.add(art.box(w,.11,d,p.wood,[0,h,0]));
  if(family==='nightstand'){g.add(art.box(w*.9,h*.72,d*.86,p.woodDark,[0,h*.42,0]));g.add(art.box(w*.75,.22,.03,p.wood,[0,h*.52,-d*.45]));g.add(art.sphere(.025,p.metal,[0,h*.52,-d*.49]))}
  else{for(const x of [-w*.42,w*.42])for(const z of [-d*.38,d*.38])g.add(art.box(.08,h,.08,p.woodDark,[x,h/2,z]));if(family==='writing-desk'||family==='vanity'){g.add(art.box(w*.48,.26,d*.12,p.wood,[0,h-.12,-d*.44]));for(const x of [-w*.16,w*.16])g.add(art.sphere(.022,p.metal,[x,h-.12,-d*.51]));}if(family==='farm-table')g.add(art.box(w*.82,.08,.08,p.woodDark,[0,.36,0]));}
  if(family==='game-table'){g.add(art.box(w*.82,.018,d*.82,art.material('fabric',0x425d49,{seed:p.seed+22}),[0,h+.066,0]))}
  if(family==='vanity'){g.add(art.box(w*.70,.88,.06,p.woodDark,[0,1.22,d*.39]));g.add(art.box(w*.55,.65,.025,art.material('glass',0xa9c0c2,{opacity:.3}),[0,1.22,d*.35]))}
  g.userData.interaction='surface';g.userData.surfaceTarget={y:h+.08,w:w*.9,d:d*.9};return tag(g,family,item);
}

function storage(THREE,art,item,family,p){
  const g=new THREE.Group();let w=1.45,d=.58,h=1.1;if(family==='wardrobe'){w=1.3;d=.65;h=2.0}else if(family==='bookcase'){w=1.3;d=.42;h=1.9}else if(family==='storage-chest'){w=1.08;d=.64;h=.62}else if(family==='hutch'){w=1.42;d=.48;h=1.9}
  if(family==='bookcase'){
    for(const x of [-w*.48,w*.48])g.add(art.box(.07,h,d,p.woodDark,[x,h/2,0]));g.add(art.box(w,.08,d,p.woodDark,[0,.04,0]),art.box(w,.08,d,p.woodDark,[0,h-.04,0]));for(const y of [.42,.82,1.22,1.62])g.add(art.box(w*.94,.06,d,p.wood,[0,y,0]));
  }else if(family==='storage-chest'){
    g.add(art.box(w,h*.78,d,p.wood,[0,h*.39,0]));g.add(art.box(w*1.02,.12,d*1.03,p.woodDark,[0,h*.84,0],[0,0,.02]));g.add(art.box(.18,.10,.03,p.metal,[0,h*.42,-d*.52]));
  }else{
    g.add(art.box(w,h,d,p.woodDark,[0,h/2,0]));
    if(family==='wardrobe'){for(const x of [-w*.24,w*.24]){g.add(art.box(w*.46,h*.86,.035,p.wood,[x,h*.49,-d*.51]));g.add(art.sphere(.03,p.metal,[x+(x<0?.12:-.12),h*.55,-d*.55]))}}
    else if(family==='hutch'){g.add(art.box(w*.9,h*.48,d*.83,p.wood,[0,h*.25,0]));for(const x of [-w*.25,w*.25])g.add(art.box(w*.42,h*.42,.035,art.material('glass',0xb9d0d2,{opacity:.22}),[x,h*.70,-d*.51]));for(const y of [h*.58,h*.78])g.add(art.box(w*.82,.04,d*.65,p.wood,[0,y,0]))}
    else{for(let i=0;i<4;i++){const y=.18+i*(h*.2);g.add(art.box(w*.84,h*.16,.035,p.wood,[0,y,-d*.51]));for(const x of [-w*.16,w*.16])g.add(art.sphere(.03,p.metal,[x,y,-d*.55]))}}
    g.add(art.box(w*1.04,.06,d*1.06,p.wood,[0,h+.03,0]));
  }
  g.userData.interaction='storage';g.userData.clearanceDirection='front';return tag(g,family,item);
}

function furnishing(THREE,art,item,family,p){
  const g=new THREE.Group();
  if(family==='rug'){
    const base=art.material('fabric',0x745449,{seed:p.seed+40,roughness:.98}),border=art.material('fabric',0xd0b177,{seed:p.seed+41,roughness:.98});g.add(art.box(2.15,.025,1.55,base,[0,.013,0]));g.add(art.box(2.02,.008,.045,border,[0,.034,-.70]),art.box(2.02,.008,.045,border,[0,.034,.70]),art.box(.045,.008,1.36,border,[-.99,.034,0]),art.box(.045,.008,1.36,border,[.99,.034,0]));for(let x=-.9;x<=.9;x+=.12){g.add(art.box(.035,.008,.14,border,[x,.032,-.84]),art.box(.035,.008,.14,border,[x,.032,.84]))}
  }else if(family==='wall-tv'){
    const frame=art.material('paintedMetal',0x202323,{seed:p.seed+44,roughness:.35}),screen=new THREE.MeshStandardMaterial({color:0x0c151a,roughness:.11,metalness:.06,emissive:0x173843,emissiveIntensity:.42});g.add(art.box(1.55,.92,.09,frame,[0,.46,0]));g.add(art.box(1.43,.80,.025,screen,[0,.46,-.058]));g.add(art.box(.26,.18,.12,p.black,[0,.46,.12]));g.userData.interaction='screen';
  }else if(family==='floor-lamp'||family==='lamp'){
    const h=family==='floor-lamp'?1.65:.92;g.add(art.cylinder(.035,.045,h*.72,p.metal,[0,h*.36,0],[],12));g.add(art.cylinder(.24,.30,.08,p.black,[0,.04,0],[],20));const shade=art.material('fabric',0xe1d2b3,{seed:p.seed+48,roughness:.96});g.add(new THREE.Mesh(new THREE.ConeGeometry(.34,.38,24,1,true),shade));g.children[g.children.length-1].position.y=h*.83;g.add(art.sphere(.07,new THREE.MeshStandardMaterial({color:0xffe6ad,emissive:0xffc978,emissiveIntensity:1.15}),[0,h*.73,0]));g.userData.interaction='toggle_light';
  }else if(family==='wall-art'){
    g.add(art.box(1.05,.80,.07,p.wood,[0,.4,0]));g.add(art.box(.90,.65,.025,art.material('fabric',0x876c52,{seed:p.seed+52}),[0,.4,-.052]));
  }
  return tag(g,family,item);
}

function fitFallbackToPhysical(THREE,g,item){
  if(!g)return g;const target=w39PhysicalFootprintFt(item);if(!target)return g;const box=new THREE.Box3().setFromObject(g),size=new THREE.Vector3();box.getSize(size);
  const desired={x:target.w*.3048,y:target.h*.3048,z:target.d*.3048};
  const sx=size.x>.001?desired.x/size.x:1,sy=size.y>.001?desired.y/size.y:1,sz=size.z>.001?desired.z/size.z:1;g.scale.multiply(new THREE.Vector3(sx,sy,sz));g.userData.w39PhysicalScaleApplied=true;return g;
}

export function createW39CabinFurnitureMesh(THREE,art,item={}){
  const family=inferW39FurnitureFamily(item);if(!family)return null;const p=palette(THREE,art,item);let g=null;
  if(family.includes('bed'))g=bed(THREE,art,item,family,p);
  else if(['sofa','loveseat','chaise','recliner','rocking-chair','bench','barrel-chair','desk-chair','bean-bag','reading-chair'].includes(family))g=seating(THREE,art,item,family,p);
  else if(['nightstand','coffee-table','writing-desk','vanity','game-table','farm-table','table'].includes(family))g=table(THREE,art,item,family,p);
  else if(['dresser','wardrobe','bookcase','storage-chest','hutch'].includes(family))g=storage(THREE,art,item,family,p);
  else g=furnishing(THREE,art,item,family,p);
  return fitFallbackToPhysical(THREE,g,item);
}

export function w39BenchmarkRoom(){
  return {roomKey:'w39-furniture-benchmark',wallpaper:'bare-pine-wall',flooring:'bare-pine-floor',decorVersion:39,placements:[
    {id:'w39-bed',itemId:'buy-with-game-night-tokens-everyday-basics-double-cabin-bed',surface:'floor',x:1.0,z:8.7,rotation:0,state:{}},
    {id:'w39-nightstand',itemId:'buy-with-game-night-tokens-rustic-cabin-live-edge-nightstand',surface:'floor',x:8.2,z:10.0,rotation:0,state:{}},
    {id:'w39-lamp',itemId:'buy-with-game-night-tokens-everyday-basics-warm-table-lamp',surface:'tabletop',x:8.2,z:10.0,rotation:0,state:{lampOn:true},parentId:'w39-nightstand'},
    {id:'w39-chair',itemId:'buy-with-game-night-tokens-everyday-basics-kristen-s-cozy-lodge-',surface:'floor',x:9.4,z:3.0,rotation:315,state:{}},
    {id:'w39-dresser',itemId:'buy-with-game-night-tokens-everyday-basics-four-drawer-dresser',surface:'floor',x:7.4,z:12.6,rotation:0,state:{}},
    {id:'w39-rug',itemId:'buy-with-game-night-tokens-everyday-basics-neutral-woven-rug',surface:'floor',x:4.0,z:3.8,rotation:0,state:{}},
    {id:'w39-tv',itemId:'buy-with-game-night-tokens-everyday-basics-wall-mounted-tv',surface:'wall',x:7.8,z:9.4,rotation:0,state:{}},
    {id:'w39-desk-chair',itemId:'buy-with-game-night-tokens-everyday-basics-basic-desk-chair',surface:'floor',x:3.0,z:3.2,rotation:35,state:{}}
  ]};
}
