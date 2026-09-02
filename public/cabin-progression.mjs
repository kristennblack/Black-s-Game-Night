import { CABIN_ROOM_ITEM_CATALOG, CABIN_ROOM_ITEM_BY_ID } from './cabin-room-catalog.mjs';

// W19: everybody starts with the same deliberately humble starter crate.
// Nothing is pre-placed in a room. These are blueprints only, so the owner still
// chooses what to use and where to put it.
export const STARTER_CABIN_ITEM_NAMES=[
  'Pine Single Bed',
  'Simple Nightstand',
  'Basic Desk Chair',
  'Plain Floor Lamp',
  'Neutral Woven Rug'
];
export const STARTER_CABIN_BLUEPRINT_IDS=STARTER_CABIN_ITEM_NAMES.map(name=>CABIN_ROOM_ITEM_CATALOG.find(x=>x['Item Name']===name)?.['Item ID']).filter(Boolean);
export const starterCabinBlueprints=()=>Object.fromEntries(STARTER_CABIN_BLUEPRINT_IDS.map(id=>[id,{unlockedAt:0,source:'starter-low-end'}]));
export function normalizeCabinBlueprints(raw={}){return {...starterCabinBlueprints(),...(raw&&typeof raw==='object'?raw:{})}}
export function cabinItemPurchasable(item){return !!item&&item.Secret!=='Yes'&&item['Source Type']==='Buy with Game Night Tokens'&&Number.isFinite(Number(item['Token Price']))&&Number(item['Token Price'])>=0}
export function cabinItemOwned(blueprints={},itemId=''){return !!normalizeCabinBlueprints(blueprints)[itemId]}
export function cabinItemById(id){return CABIN_ROOM_ITEM_BY_ID[String(id||'')]||null}
export function cabinRoomCategories(){return ['All',...new Set(CABIN_ROOM_ITEM_CATALOG.filter(x=>x.Secret!=='Yes').map(x=>x.Category))]}
