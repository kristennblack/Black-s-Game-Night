import { CABIN_ROOM_ITEM_CATALOG } from './cabin-room-catalog.mjs';

export const CABIN_FAMILY_ROOMS=['John','Kristen','Holly','Vanessa','Lizzy','Logan','James','Dorothy','Papa','Nana'];
export const STARTER_ROOM={widthFt:14,depthFt:16,gridStepFt:.5,rotationStep:90,ownerEditable:true,visitorEditable:false};
export const GUEST_HOUSE={permanent:true,expandable:true,upgradeable:true};

export function rotate90(degrees,dir=1){
  const step=dir<0?-90:90;
  return ((Math.round(Number(degrees||0)/90)*90+step)%360+360)%360;
}
export function snapToGrid(value,step=.5){
  const s=Math.max(.01,Number(step)||.5);
  return Math.round(Number(value||0)/s)*s;
}
export function snapPlacement({x=0,z=0,rotation=0},step=.5){
  return {x:snapToGrid(x,step),z:snapToGrid(z,step),rotation:((Math.round(rotation/90)*90)%360+360)%360};
}
export function footprintFor(item,rotation=0){
  const w=Number(item?.['Footprint W']||1),d=Number(item?.['Footprint D']||1),r=((rotation%360)+360)%360;
  return (r===90||r===270)?{w:d,d:w}:{w,d};
}
export function isPlacementInsideRoom(item,placement,room=STARTER_ROOM){
  const p=snapPlacement(placement,room.gridStepFt),f=footprintFor(item,p.rotation);
  return p.x>=0&&p.z>=0&&p.x+f.w<=room.widthFt&&p.z+f.d<=room.depthFt;
}
export function catalogSummary(catalog=CABIN_ROOM_ITEM_CATALOG){
  const sourceCounts={},categoryCounts={},rarityCounts={};
  for(const x of catalog){sourceCounts[x['Source Type']]=(sourceCounts[x['Source Type']]||0)+1;categoryCounts[x.Category]=(categoryCounts[x.Category]||0)+1;rarityCounts[x.Rarity]=(rarityCounts[x.Rarity]||0)+1}
  return {total:catalog.length,sourceCounts,categoryCounts,rarityCounts,secretCount:catalog.filter(x=>x.Secret==='Yes').length};
}
export function filterCatalog({category='All',query='',catalog=CABIN_ROOM_ITEM_CATALOG}={}){
  const q=String(query||'').trim().toLowerCase();
  return catalog.filter(x=>(category==='All'||x.Category===category)&&(!q||`${x['Item Name']} ${x.Collection} ${x.Category} ${x['Source Type']}`.toLowerCase().includes(q)));
}
export function canEditRoom({viewerId,ownerId}){return Boolean(viewerId&&ownerId&&viewerId===ownerId)}
