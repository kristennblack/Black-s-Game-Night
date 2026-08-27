export const COSMETIC_CATALOG=[
 {id:'camp-cap',slot:'hat',name:'Camp Cap',price:10,icon:'🧢',desc:'Easy everyday cap for game night.'},
 {id:'cowboy-hat',slot:'hat',name:'Cowboy Hat',price:20,icon:'🤠',desc:'A proper family-game-night western lid.'},
 {id:'birthday-crown',slot:'hat',name:'Birthday Crown',price:30,icon:'👑',desc:'Gold birthday crown for whoever wants the spotlight.'},
 {id:'winter-toque',slot:'hat',name:'Cabin Toque',price:25,icon:'🧶',desc:'Warm knit toque for cold-map adventures.'},
 {id:'flower-crown',slot:'hat',name:'Garden Flower Crown',price:35,icon:'🌼',desc:'Dorothy-approved cottage-garden flowers.'},
 {id:'round-glasses',slot:'glasses',name:'Round Glasses',price:10,icon:'👓',desc:'Classic clear round frames.'},
 {id:'sunglasses',slot:'glasses',name:'Trail Sunglasses',price:20,icon:'🕶️',desc:'Dark shades for maximum unnecessary confidence.'},
 {id:'heart-glasses',slot:'glasses',name:'Heart Glasses',price:25,icon:'💗',desc:'Bright heart-shaped party glasses.'},
 {id:'safety-glasses',slot:'glasses',name:'Shop Safety Glasses',price:20,icon:'🥽',desc:'Clear protective glasses for shop maps.'},
 {id:'red-bandana',slot:'accessory',name:'Red Bandana',price:15,icon:'🔻',desc:'Simple neck bandana for people or dogs.'},
 {id:'gold-chain',slot:'accessory',name:'Gold Chain',price:25,icon:'⛓️',desc:'A small gold necklace accent.'},
 {id:'headphones',slot:'accessory',name:'Game Night Headphones',price:30,icon:'🎧',desc:'Chunky headphones for arcade mode.'},
 {id:'flower-pin',slot:'accessory',name:'Garden Flower Pin',price:15,icon:'🌸',desc:'A small floral accessory.'},
 {id:'rock-charm',slot:'accessory',name:"Kelsi's Rock Charm",price:20,icon:'🪨',desc:'A tiny prized-rock charm.'}
];
export const COSMETIC_BY_ID=Object.fromEntries(COSMETIC_CATALOG.map(x=>[x.id,x]));
export const COSMETIC_SLOTS=['hat','glasses','accessory'];

export function normalizeEquipped(raw={}){const out={hat:null,glasses:null,accessory:null};for(const slot of COSMETIC_SLOTS){const id=String(raw?.[slot]||'');if(id&&COSMETIC_BY_ID[id]?.slot===slot)out[slot]=id}return out}
export function cosmeticOverlayHTML(equipped={}){const eq=normalizeEquipped(equipped);return COSMETIC_SLOTS.map(slot=>{const item=COSMETIC_BY_ID[eq[slot]];return item?`<span class="avatar-cosmetic avatar-cosmetic-${slot}" data-cosmetic-id="${item.id}" aria-hidden="true">${item.icon}</span>`:''}).join('')}
export function cosmeticLabelList(equipped={}){const eq=normalizeEquipped(equipped);return COSMETIC_SLOTS.map(slot=>COSMETIC_BY_ID[eq[slot]]?.name).filter(Boolean)}
