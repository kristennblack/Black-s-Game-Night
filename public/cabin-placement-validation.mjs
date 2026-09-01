import { W25_HOME_PRODUCTION } from './w25-production-manifest.mjs';
import { w39PhysicalFootprintFt } from './w39-cabin-furniture.mjs';

export const CABIN_PHYSICAL_ROOM=Object.freeze({widthFt:14,depthFt:16,heightFt:9,gridStepFt:.5});
const FT=.3048;
export const normalizeCabinRotation=v=>((Math.round((Number(v)||0)/90)*90)%360+360)%360;
export const normalizeCabinSurface=v=>String(v||'floor').toLowerCase()==='wall'?'wall':'floor';
export const itemSupportsCabinSurface=(item,surface)=>{
  const rule=String(item?.['Placement Surface']||'Floor').toLowerCase(),s=normalizeCabinSurface(surface);
  return s==='wall'?rule.includes('wall'):rule.includes('floor');
};

export function physicalFootprintForItem(item,rotation=0){
  const spec=W25_HOME_PRODUCTION[item?.['Item ID']];
  let f=spec?.physical?{w:spec.physical.w/FT,d:spec.physical.d/FT,h:spec.physical.h/FT}:w39PhysicalFootprintFt(item);
  if(!f)f={w:Math.max(.5,Number(item?.['Footprint W'])||1),d:Math.max(.5,Number(item?.['Footprint D'])||1),h:2.5};
  const r=normalizeCabinRotation(rotation);return (r===90||r===270)?{...f,w:f.d,d:f.w}:{...f};
}
export function snapCabinAnchor(v,step=CABIN_PHYSICAL_ROOM.gridStepFt){return Math.round((Number(v)||0)/step)*step}
export function normalizeCabinPlacement(item,q={}){
  return {id:String(q.id||''),itemId:String(q.itemId||item?.['Item ID']||''),x:snapCabinAnchor(q.x),z:snapCabinAnchor(q.z),rotation:normalizeCabinRotation(q.rotation),surface:normalizeCabinSurface(q.surface),state:q.state&&typeof q.state==='object'?{...q.state}:{}};
}
export function isNonBlockingCabinItem(item){
  const cat=String(item?.Category||'');return cat==='Rugs & Soft Decor'||cat==='Wall Decor & Pictures'||cat==='Architectural Finishes';
}
export function cabinPlacementRect(item,q){
  const p=normalizeCabinPlacement(item,q),f=physicalFootprintForItem(item,p.rotation);return {x1:p.x,z1:p.z,x2:p.x+f.w,z2:p.z+f.d,w:f.w,d:f.d};
}
export function rectsOverlap(a,b,pad=.08){return a.x1<b.x2-pad&&a.x2>b.x1+pad&&a.z1<b.z2-pad&&a.z2>b.z1+pad}
export function validateCabinPlacement(item,q,{placements=[],catalogById={},room=CABIN_PHYSICAL_ROOM,ignoreId=''}={}){
  if(!item)return {ok:false,code:'unknown_item',message:'Unknown cabin furniture item'};
  const p=normalizeCabinPlacement(item,q),f=physicalFootprintForItem(item,p.rotation);
  if(!itemSupportsCabinSurface(item,p.surface))return {ok:false,code:'unsupported_surface',message:`${item['Item Name']||'This item'} cannot be placed on the ${p.surface}.`,placement:p,footprint:f};
  if(p.surface==='floor'){
    if(p.x<0||p.z<0||p.x+f.w>room.widthFt+.001||p.z+f.d>room.depthFt+.001)return {ok:false,code:'out_of_bounds',message:`${item['Item Name']||'Furniture'} does not fit inside the 14 x 16 ft room at that position.`,placement:p,footprint:f};
    if(!isNonBlockingCabinItem(item)){
      const a=cabinPlacementRect(item,p);
      for(const other of placements){if(!other||other.id===ignoreId||other.id===p.id||normalizeCabinSurface(other.surface)!=='floor')continue;const otherItem=catalogById[other.itemId];if(!otherItem||isNonBlockingCabinItem(otherItem))continue;const b=cabinPlacementRect(otherItem,other);if(rectsOverlap(a,b))return {ok:false,code:'overlap',message:`${item['Item Name']||'Furniture'} overlaps ${otherItem['Item Name']||'another furniture item'}.`,placement:p,footprint:f,overlapId:other.id}}
    }
  }else{
    if(p.x<0||p.x+f.w>room.widthFt+.001||p.z<0||p.z>16)return {ok:false,code:'wall_bounds',message:`${item['Item Name']||'Wall item'} is outside the valid wall area.`,placement:p,footprint:f};
  }
  return {ok:true,placement:p,footprint:f};
}
