import { W25_HOME_PRODUCTION } from './w25-production-manifest.mjs';
const safeId=item=>encodeURIComponent(String(item?.['Item ID']||item?.id||''));
export const cabinItemThumb=item=>W25_HOME_PRODUCTION[String(item?.['Item ID']||item?.id||'')]?.thumb||`/cabin-assets/generated/thumbs/${safeId(item)}.svg`;
export const cabinItemPlaceable=item=>`/cabin-assets/generated/placeables/${safeId(item)}.svg`;
export const EMPTY_CABIN_ROOM_ART='/cabin-assets/generated/empty-room-shell.svg';
export function cabinArtSeed(value=''){let h=2166136261;for(const ch of String(value)){h^=ch.charCodeAt(0);h=Math.imul(h,16777619)}return h>>>0}
export const RUSTIC_CABIN_3D_PALETTE=Object.freeze({pine:0x8a603c,darkWood:0x553624,agedWood:0x6e4931,cream:0xe8d8bd,brass:0xb49352,iron:0x444a49,forest:0x405a43,plaidRed:0x7d3d38,warmLight:0xffc978});
