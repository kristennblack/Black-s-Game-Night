const A='/cosmetics/assets/';
export const COSMETIC_SLOTS=['hat','hair','glasses','headset','accessory','jewelry','top','badge'];
const colorNames={
  forest:'Forest',navy:'Navy',burgundy:'Burgundy',charcoal:'Charcoal',tan:'Tan',rose:'Rose',gold:'Gold',cream:'Cream',silver:'Silver',teal:'Teal'
};
const rarityForPrice=p=>p>=180?'Family Legendary':p>=120?'Epic':p>=75?'Rare':p>=40?'Uncommon':'Common';
const make=(id,slot,name,price,asset,category,extra={})=>({id,slot,name,price,asset:A+asset,category,rarity:extra.rarity||rarityForPrice(price),source:extra.source||'token',desc:extra.desc||`A realistic ${name.toLowerCase()} fitted for game-night avatars.`,fit:extra.fit||{},legacy:!!extra.legacy});
const entries=[];
const add=(...args)=>entries.push(make(...args));
const variantSet=(baseId,slot,baseName,assetBase,category,price,variants=['forest','navy','burgundy','charcoal','tan','rose','gold','cream'])=>{
  add(baseId,slot,baseName,price,`${assetBase}.png`,category);
  for(const v of variants)add(`${baseId}-${v}`,slot,`${colorNames[v]} ${baseName}`,price+5,`${assetBase}-${v}.png`,category);
};
const variantSetSvg=(baseId,slot,baseName,assetBase,category,price,variants=['navy','burgundy','forest','charcoal','gold','silver','teal'])=>{
  add(baseId,slot,baseName,price,`${assetBase}.svg`,category);
  for(const v of variants)add(`${baseId}-${v}`,slot,`${colorNames[v]} ${baseName}`,price+5,`${assetBase}-${v}.svg`,category);
};

// Core realistic ranges. Every visible item uses authored/rasterized art, never Unicode emoji.
variantSet('camp-cap','hat','Camp Cap','baseball-cap','Hats',30);
variantSet('cowboy-hat','hat','Cowboy Hat','cowboy-hat','Hats',50);
variantSet('winter-toque','hat','Cabin Knit Toque','knit-beanie','Hats',35);
add('firefighter-helmet','hat','Firefighter Helmet',120,'firefighter-helmet.png','Hats',{rarity:'Rare',source:'achievement',fit:{y:8,w:65}});
add('birthday-crown','hat','Birthday Crown',150,'birthday-crown.png','Birthday',{rarity:'Epic',source:'event',fit:{y:7,w:58}});
add('tiara','hat','Family Tiara',150,'tiara.png','Birthday',{rarity:'Epic',fit:{y:7,w:54}});
add('legendary-top-hat','hat','Legendary Top Hat',250,'legendary-top-hat.svg','Legendary',{rarity:'Family Legendary',fit:{y:5,w:64}});
add('flower-crown','hair','Garden Flower Clip',35,'flower-hair-clip.png','Hair Accessories',{legacy:true});

variantSetSvg('aviator-sunglasses','glasses','Aviator Sunglasses','aviator-sunglasses','Eyewear',40);
variantSetSvg('round-glasses','glasses','Reading Glasses','reading-glasses','Eyewear',35);
variantSetSvg('classic-glasses','glasses','Classic Glasses','classic-glasses','Eyewear',30);
add('sunglasses','glasses','Trail Sunglasses',45,'aviator-sunglasses-charcoal.svg','Eyewear',{legacy:true});
add('heart-glasses','glasses','Rose Party Glasses',50,'classic-glasses-rose.svg','Eyewear',{legacy:true});
add('safety-glasses','glasses','Shop Safety Glasses',40,'classic-glasses-silver.svg','Eyewear',{legacy:true});

variantSetSvg('headphones','headset','Over-Ear Headphones','over-ear-headphones','Headphones',100,['navy','burgundy','forest','charcoal','rose','gold','silver','teal']);
variantSetSvg('winter-earmuffs','headset','Winter Earmuffs','winter-earmuffs','Headphones',60,['navy','burgundy','forest','charcoal','rose','gold','silver','teal']);

variantSet('red-bandana','accessory','Silk Scarf','silk-scarf','Neckwear',55,['forest','navy','burgundy','charcoal','tan','rose','gold','cream']);
variantSetSvg('leather-bracelet','jewelry','Braided Leather Necklace','leather-bracelet','Jewelry',30,['navy','burgundy','forest','charcoal','tan','rose','gold','cream']);
variantSet('drop-earrings','jewelry','Drop Earrings','drop-earrings','Jewelry',35,['navy','burgundy','forest','charcoal','rose','gold','silver','teal']);
add('gold-chain','jewelry','Gold Necklace Accent',45,'gold-necklace.svg','Jewelry',{legacy:true,fit:{x:50,y:80,w:60}});

variantSet('flower-pin','hair','Flower Hair Clip','flower-hair-clip','Hair Accessories',25,['navy','burgundy','forest','charcoal','rose','gold','silver','teal']);
variantSet('sheriff-badge','badge','Sheriff Badge','sheriff-badge','Badges',75,['navy','burgundy','forest','charcoal','rose','gold','silver','teal']);
add('rock-charm','badge',"Kelsi's Rock Charm",35,'sheriff-badge-silver.png','Badges',{legacy:true});

variantSet('flannel-shirt','top','Cabin Flannel Shirt','flannel-shirt','Tops',55,['forest','navy','burgundy','charcoal','tan','rose','gold','cream']);
variantSet('cabin-hoodie','top','Cabin Life Hoodie','cabin-hoodie','Tops',60,['forest','navy','burgundy','charcoal','tan','rose','gold','cream']);

// Special reward aliases keep the catalog broad while using the same approved realistic art language.
const specials=[
 ['trail-trouble-cap','hat','Trail Trouble Champion Cap',30,'baseball-cap-tan.png','Arcade Wins','arcade'],
 ['prop-hunt-hunter-hat','hat','Prop Hunt Hunter Hat',80,'cowboy-hat-charcoal.png','Arcade Wins','arcade'],
 ['mexican-train-cap','hat','Mexican Train Conductor Cap',75,'baseball-cap-charcoal.png','Arcade Wins','arcade'],
 ['blackgammon-winner-cap','hat','Blackgammon Winner Cap',85,'baseball-cap-navy.png','Achievement','achievement'],
 ['birthday-guy-crown','hat','Birthday Guy Crown',0,'birthday-crown-gold.png','Birthday','event'],
 ['birthday-girl-tiara','hat','Birthday Star Tiara',0,'tiara-rose.png','Birthday','event'],
 ['christmas-earmuffs','headset','Christmas Cabin Earmuffs',0,'winter-earmuffs-burgundy.png','Seasonal','event'],
 ['winter-cabin-scarf','accessory','Winter Cabin Scarf',0,'silk-scarf-forest.png','Seasonal','event'],
 ['family-night-badge','badge','Family Game Night Badge',90,'sheriff-badge-gold.png','Badges','token'],
 ['host-badge','badge','Family Host Badge',0,'sheriff-badge-gold.png','Achievement','achievement'],
 ['prairie-pots-bandana','accessory','Prairie Pots Bandana',65,'silk-scarf-tan.png','Arcade Wins','arcade'],
 ['deck-sweep-glasses','glasses','Deck Sweep Lucky Glasses',55,'classic-glasses-gold.svg','Arcade Wins','arcade'],
];
for(const [id,slot,name,price,asset,category,source] of specials)add(id,slot,name,price,asset,category,{source,rarity:source==='event'?'Epic':source==='achievement'?'Rare':'Uncommon'});

for(const item of entries){
 if(item.id.startsWith('camp-cap'))item.fit={...(item.fit||{}),y:-8,w:64};
 if(item.id.startsWith('cowboy-hat'))item.fit={...(item.fit||{}),y:-5,w:66};
 if(item.id.startsWith('winter-toque'))item.fit={...(item.fit||{}),y:-5,w:61};
 if(item.id==='firefighter-helmet')item.fit={...(item.fit||{}),y:3,w:68};
 if(item.id.includes('birthday-crown'))item.fit={...(item.fit||{}),y:2,w:60};
 if(item.id==='tiara'||item.id.includes('birthday-star-tiara'))item.fit={...(item.fit||{}),y:2,w:58};
 if(item.id.startsWith('leather-bracelet'))item.fit={x:50,y:79,w:60,r:0};
 if(item.id.startsWith('drop-earrings'))item.fit={x:50,y:50,w:43,r:0};
 if(item.id.startsWith('headphones'))item.fit={x:50,y:17,w:78,r:0};
 if(item.id.startsWith('winter-earmuffs'))item.fit={x:50,y:17,w:78,r:0};
}
export const COSMETIC_CATALOG=entries;
export const COSMETIC_BY_ID=Object.fromEntries(COSMETIC_CATALOG.map(x=>[x.id,x]));

// W.17 portrait fitting uses semantic anchors rather than one generic sticker coordinate.
// These values describe where the face/head/neck actually sit inside each approved portrait crop.
const anchorDefaults={
  head:{x:50,y:8,w:58}, eyes:{x:50,y:31,w:42}, ears:{x:50,y:36,w:56},
  neck:{x:50,y:76,w:45}, chest:{x:50,y:92,w:92}, badge:{x:76,y:75,w:15}, hair:{x:25,y:12,w:15}
};
const avatarAnchors={
  john:{head:{x:47,y:8,w:64},eyes:{x:48,y:32,w:44},ears:{x:49,y:38,w:59},neck:{x:50,y:78,w:50},chest:{x:50,y:96,w:96},badge:{x:78,y:78,w:15}},
  kristen:{head:{x:50,y:8,w:56},eyes:{x:50,y:31,w:41},ears:{x:50,y:36,w:54},neck:{x:50,y:80,w:40},chest:{x:50,y:99,w:94},badge:{x:77,y:79,w:14},hair:{x:25,y:13,w:14}},
  holly:{head:{x:50,y:10,w:48},eyes:{x:50,y:31,w:34},ears:{x:50,y:35,w:49},neck:{x:50,y:75,w:34},chest:{x:50,y:96,w:86},badge:{x:76,y:77,w:12},hair:{x:23,y:13,w:13}},
  vanessa:{head:{x:50,y:8,w:55},eyes:{x:50,y:30,w:39},ears:{x:50,y:35,w:53},neck:{x:50,y:78,w:39},chest:{x:50,y:98,w:92},badge:{x:77,y:78,w:13},hair:{x:24,y:13,w:14}},
  elizabeth:{head:{x:50,y:10,w:47},eyes:{x:50,y:31,w:34},ears:{x:50,y:35,w:48},neck:{x:50,y:74,w:34},chest:{x:50,y:97,w:86},badge:{x:76,y:77,w:12},hair:{x:23,y:13,w:12}},
  logan:{head:{x:50,y:10,w:54},eyes:{x:50,y:34,w:38},ears:{x:50,y:39,w:54},neck:{x:50,y:79,w:40},chest:{x:50,y:98,w:92},badge:{x:76,y:78,w:13}},
  james:{head:{x:50,y:8,w:58},eyes:{x:50,y:31,w:43},ears:{x:50,y:37,w:56},neck:{x:50,y:78,w:44},chest:{x:50,y:97,w:94},badge:{x:77,y:78,w:14}},
  dorothy:{head:{x:51,y:8,w:56},eyes:{x:52,y:32,w:41},ears:{x:52,y:37,w:54},neck:{x:51,y:78,w:42},chest:{x:50,y:98,w:93},badge:{x:77,y:78,w:14},hair:{x:27,y:12,w:14}},
  papa:{head:{x:51,y:7,w:59},eyes:{x:52,y:34,w:41},ears:{x:51,y:39,w:57},neck:{x:51,y:78,w:44},chest:{x:50,y:98,w:95},badge:{x:77,y:78,w:14}},
  nana:{head:{x:52,y:8,w:55},eyes:{x:53,y:34,w:40},ears:{x:52,y:39,w:53},neck:{x:52,y:78,w:41},chest:{x:50,y:98,w:93},badge:{x:77,y:78,w:14}},
};
const portraitSlotConflicts={
 john:{1:['hat'],3:['hat'],6:['hat'],9:['hat'],12:['hat','accessory']},
 kristen:{1:['hat'],2:['glasses']},
 james:{0:['glasses'],1:['glasses','hat'],2:['glasses'],3:['glasses','hat']},
 dorothy:{0:['glasses'],1:['glasses','hat'],2:['glasses'],3:['glasses']},
 nana:{0:['glasses'],1:['glasses','accessory'],2:['glasses','accessory'],3:['glasses']},
 papa:{1:['hat','glasses'],2:['glasses','accessory'],3:['hat']},
 logan:{3:['hat']}, holly:{2:['accessory'],3:['hair']}, elizabeth:{1:['glasses']}
};
const dogKeys=new Set(['kelsi','molly','gunner']);
const anchorFor=(avatar,key)=>({...anchorDefaults[key],...(avatarAnchors[avatar]?.[key]||{})});
const fitFromAnchor=(avatar,slot,item)=>{
  const id=String(item?.id||'');
  if(slot==='hat'){
    const a=anchorFor(avatar,'head');
    let scale=1.08,dy=0;
    if(id.startsWith('camp-cap')||id.includes('winner-cap')||id.includes('conductor-cap')||id.includes('trail-trouble-cap')){scale=.82;dy=-2}
    else if(id.startsWith('winter-toque')){scale=.80;dy=-4}
    else if(id.includes('tiara')){scale=.78;dy=3}
    else if(id.includes('crown')){scale=.82;dy=2}
    else if(id.includes('firefighter')){scale=.95;dy=-1}
    if(id.startsWith('cowboy-hat')||id.includes('hunter-hat')){scale=.96;dy=-6}
    return{x:a.x,y:a.y+dy,w:a.w*scale,r:0};
  }
  if(slot==='hair'){const a=anchorFor(avatar,'hair');return{x:a.x,y:a.y,w:a.w,r:-7}}
  if(slot==='glasses'){const a=anchorFor(avatar,'eyes');return{x:a.x,y:a.y,w:a.w,r:0}}
  if(slot==='headset'){const a=anchorFor(avatar,'ears');return{x:a.x,y:a.y-8,w:Math.max(62,a.w*1.12),h:31,r:0}}
  if(slot==='accessory'){const a=anchorFor(avatar,'neck');return{x:a.x,y:a.y+12,w:a.w*1.08,h:20,r:0}}
  if(slot==='jewelry'){
    if(id.startsWith('drop-earrings')){const a=anchorFor(avatar,'ears');return{x:a.x,y:a.y+14,w:70,h:22,r:0}}
    const a=anchorFor(avatar,'neck');return{x:a.x,y:a.y+9,w:a.w*1.12,h:19,r:0};
  }
  if(slot==='top'){const a=anchorFor(avatar,'chest');return{x:a.x,y:a.y+7,w:a.w,h:42,r:0}}
  if(slot==='badge'){const a=anchorFor(avatar,'badge');return{x:a.x,y:a.y,w:a.w,r:0}}
  return{x:50,y:50,w:25,r:0};
};
export function fitProfileForAvatar(avatar='john',slot='hat',item=null,variant=0){
 const v=Math.max(0,Number(variant)||0);
 let base=fitFromAnchor(avatar,slot,item);
 // Explicit fit records are now treated as fine offsets/scales only when marked relative.
 if(item?.fit?.relative){base={...base,x:base.x+(item.fit.x||0),y:base.y+(item.fit.y||0),w:base.w*(item.fit.scale||1),r:item.fit.r||base.r}}
 if((portraitSlotConflicts[avatar]?.[v]||[]).includes(slot))return {...base,hidden:true,conflict:true};
 if(avatar==='elizabeth'&&v===3&&slot==='jewelry'&&String(item?.id||'').startsWith('drop-earrings'))return {...base,hidden:true,conflict:true};
 if(dogKeys.has(avatar)){
   if(slot==='hat')return{x:50,y:10,w:68,r:0};
   if(slot==='glasses')return{x:50,y:34,w:50,r:0};
   if(slot==='accessory')return{x:50,y:66,w:68,r:0};
   return {...base,hidden:true};
 }
 return base;
}
export const PORTRAIT_FIT_ANCHORS=Object.freeze(avatarAnchors);
function dropEarringPairHTML(item,avatar,variant){
 const v=Math.max(0,Number(variant)||0),a=anchorFor(avatar,'ears');
 if((portraitSlotConflicts[avatar]?.[v]||[]).includes('jewelry'))return'';
 if(avatar==='elizabeth'&&v===3)return'';
 const stem=item.asset.replace(/\.png$/,'');
 const halfW=Math.max(8,Math.min(13,a.w*.22)),h=19,y=a.y+14,dx=a.w*.48;
 const one=(side,x)=>`<img class="avatar-cosmetic avatar-cosmetic-jewelry avatar-cosmetic-earring avatar-cosmetic-earring-${side}" data-cosmetic-id="${item.id}" src="${stem}-${side}.png" alt="" aria-hidden="true" style="--cx:${x}%;--cy:${y}%;--cw:${halfW}%;--ch:${h}%;--cr:0deg">`;
 return one('left',a.x-dx)+one('right',a.x+dx);
}
export function normalizeEquipped(raw={}){
 const out=Object.fromEntries(COSMETIC_SLOTS.map(s=>[s,null]));
 // migrate the original W8 accessory slot into the new neck/accessory slot.
 const migrated={...raw}; if(!migrated.accessory&&migrated.neckwear)migrated.accessory=migrated.neckwear;
 for(const slot of COSMETIC_SLOTS){const id=String(migrated?.[slot]||'');if(id&&COSMETIC_BY_ID[id]?.slot===slot)out[slot]=id}
 return out;
}
export function cosmeticOverlayHTML(equipped={},avatar='john',variant=0){
 const eq=normalizeEquipped(equipped);
 return COSMETIC_SLOTS.map(slot=>{const item=COSMETIC_BY_ID[eq[slot]];if(!item)return'';if(slot==='jewelry'&&String(item.id).startsWith('drop-earrings'))return dropEarringPairHTML(item,avatar,variant);const f=fitProfileForAvatar(avatar,slot,item,variant);if(f.hidden)return'';return `<img class="avatar-cosmetic avatar-cosmetic-${slot}" data-cosmetic-id="${item.id}" src="${item.asset}" alt="" aria-hidden="true" style="--cx:${f.x}%;--cy:${f.y}%;--cw:${f.w}%;--ch:${Number.isFinite(f.h)?`${f.h}%`:'auto'};--cr:${f.r||0}deg">`}).join('');
}
export function cosmeticLabelList(equipped={}){const eq=normalizeEquipped(equipped);return COSMETIC_SLOTS.map(slot=>COSMETIC_BY_ID[eq[slot]]?.name).filter(Boolean)}
export function cosmeticCategories(){return ['All',...new Set(COSMETIC_CATALOG.map(x=>x.category))]}
