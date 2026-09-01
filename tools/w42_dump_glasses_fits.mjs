import {portraitGlassesFit,portraitAnchorDebugPoints,portraitAccessoryAsset} from '../public/portrait-accessory-anchors.mjs';
import {COSMETIC_BY_ID} from '../public/avatar-cosmetics.mjs';
const avatars=['john','kristen','holly','vanessa','elizabeth','logan'];
const items=['round-glasses','classic-glasses','heart-glasses','safety-glasses'];
const out=[];
for(const avatar of avatars){for(const id of items){const item=COSMETIC_BY_ID[id];out.push({avatar,variant:0,id,name:item.name,asset:portraitAccessoryAsset(item),fit:portraitGlassesFit(avatar,0,item),points:portraitAnchorDebugPoints(avatar,0)});}}
console.log(JSON.stringify(out,null,2));
