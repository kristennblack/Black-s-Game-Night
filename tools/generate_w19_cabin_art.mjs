import fs from 'node:fs';
import path from 'node:path';
import {CABIN_ROOM_ITEM_CATALOG as C} from '../public/cabin-room-catalog.mjs';

const outRoot=path.resolve('public/cabin-assets/generated');
const thumbDir=path.join(outRoot,'thumbs'), placeDir=path.join(outRoot,'placeables');
fs.mkdirSync(thumbDir,{recursive:true});fs.mkdirSync(placeDir,{recursive:true});
const hash=s=>{let h=2166136261;for(const ch of String(s)){h^=ch.charCodeAt(0);h=Math.imul(h,16777619)}return h>>>0};
const esc=s=>String(s??'').replace(/[&<>\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;'}[c]||c));
const palette=['#8a5a32','#65412c','#a47745','#536b55','#6e5a70','#3f5f6c','#9b6b56','#756348','#a78762','#44524b','#7b4440','#58667b'];
const accent=['#dcb96a','#d9d2bb','#b7835a','#8aa48a','#7c9cad','#c18a92','#9b8c73','#e3c888'];
const wood=['#5a3825','#6c442a','#7c5030','#8a5b37','#4b3225'];
const rarGlow=r=>r==='Family Legendary'?'#f6c75b':r==='Epic'?'#d89be8':r==='Rare'?'#77b7e6':r==='Uncommon'?'#88c184':'#cfc7b7';
const split=(s,n=24)=>{const words=String(s).split(/\s+/);let a='',b='';for(const w of words){if(!b&&(`${a} ${w}`).trim().length<=n)a=(`${a} ${w}`).trim();else b=(`${b} ${w}`).trim()}return[a,b.slice(0,32)]};

function shape(item,h){
 const cat=item.Category, p=palette[h%palette.length], a=accent[(h>>>3)%accent.length], w=wood[(h>>>6)%wood.length], v=h%5, v2=(h>>>5)%5;
 const line='#27170f', hi='#f4dfb0';
 const shadow='<ellipse cx="160" cy="221" rx="105" ry="18" fill="#000" opacity=".24"/>';
 const common=`stroke="${line}" stroke-width="5" stroke-linejoin="round"`;
 const plank=(x,y,W,H,fill=w)=>`<rect x="${x}" y="${y}" width="${W}" height="${H}" rx="6" fill="${fill}" ${common}/><path d="M${x+8} ${y+H*.35} C${x+W*.32} ${y+H*.15},${x+W*.66} ${y+H*.58},${x+W-8} ${y+H*.3}" fill="none" stroke="#f3c987" stroke-opacity=".18" stroke-width="3"/>`;
 if(cat==='Beds'){
  const post=v%2?10:16, head=v===2?70:48;
  return `${shadow}${plank(52,89,216,head,w)}${plank(62,137,196,74,p)}<rect x="72" y="147" width="176" height="55" rx="14" fill="${a}" ${common}/><rect x="83" y="151" width="68" height="25" rx="12" fill="#eee0c9" ${common}/><rect x="169" y="151" width="68" height="25" rx="12" fill="#eee0c9" ${common}/><path d="M72 182 Q160 ${155+v2*5} 248 182 L248 202 L72 202Z" fill="${p}" opacity=".78"/>${[58,252].map(x=>`<rect x="${x}" y="82" width="${post}" height="142" rx="5" fill="${w}" ${common}/>`).join('')}`;
 }
 if(cat==='Seating'){
  const chairW=118+v*9;
  return `${shadow}<rect x="${160-chairW/2}" y="112" width="${chairW}" height="82" rx="${18+v*5}" fill="${p}" ${common}/><rect x="${160-chairW/2+9}" y="72" width="${chairW-18}" height="78" rx="${18+v2*5}" fill="${a}" ${common}/><rect x="${160-chairW/2-16}" y="126" width="24" height="70" rx="11" fill="${p}" ${common}/><rect x="${160+chairW/2-8}" y="126" width="24" height="70" rx="11" fill="${p}" ${common}/><path d="M112 195 l-8 28 M208 195 l8 28" stroke="${w}" stroke-width="12" stroke-linecap="round"/>`;
 }
 if(cat==='Tables')return `${shadow}${plank(58,96,204,34,p)}${[78,232].map(x=>`<path d="M${x} 130 L${x+(v%2?10:-6)} 218" stroke="${w}" stroke-width="17" stroke-linecap="round"/>`).join('')}<rect x="104" y="132" width="112" height="38" rx="6" fill="${a}" opacity="${v===3?.65:.2}" ${common}/>`;
 if(cat==='Storage')return `${shadow}${plank(76,61,168,161,p)}${Array.from({length:3+v%2},(_,i)=>`<rect x="91" y="${78+i*35}" width="138" height="28" rx="5" fill="${a}" fill-opacity="${.12+i*.04}" ${common}/><circle cx="160" cy="${92+i*35}" r="5" fill="${hi}"/>`).join('')}<path d="M92 222 v9 M228 222 v9" stroke="${w}" stroke-width="12"/>`;
 if(cat==='Electronics')return `${shadow}<rect x="53" y="65" width="214" height="132" rx="${7+v*4}" fill="#25292a" ${common}/><rect x="66" y="78" width="188" height="105" rx="5" fill="url(#screen)"/><path d="M141 198 v24 M179 198 v24 M111 225 h98" stroke="${a}" stroke-width="10" stroke-linecap="round"/><circle cx="160" cy="130" r="26" fill="none" stroke="${p}" stroke-width="4" opacity=".55"/>`;
 if(cat==='Lighting')return `${shadow}<ellipse cx="160" cy="221" rx="53" ry="10" fill="#000" opacity=".2"/><rect x="153" y="101" width="14" height="108" rx="7" fill="${w}" ${common}/><path d="M116 72 Q160 ${35+v*5} 204 72 L190 132 H130Z" fill="${a}" ${common}/><ellipse cx="160" cy="94" rx="25" ry="22" fill="#ffe4a0" opacity=".72"/><ellipse cx="160" cy="216" rx="43" ry="10" fill="${p}" ${common}/>`;
 if(cat==='Rugs'||cat==='Flooring')return `${shadow}<path d="M52 108 L235 74 L270 180 L86 214Z" fill="${p}" ${common}/>${Array.from({length:5},(_,i)=>`<path d="M${70+i*36} 107 L${103+i*34} 199" stroke="${i%2?a:hi}" stroke-width="${5+(i%3)*2}" opacity=".7"/>`).join('')}<path d="M78 124 L239 95 M87 154 L249 126 M97 183 L259 154" stroke="${w}" stroke-opacity=".42" stroke-width="4"/>`;
 if(cat==='Plants')return `${shadow}<path d="M126 157 h68 l-11 65 h-46Z" fill="${p}" ${common}/>${Array.from({length:7},(_,i)=>{const ang=(-1.2+i*.4),cx=160+Math.cos(ang)*44,cy=124-Math.sin(ang)*30;return `<path d="M160 168 Q${cx} ${cy} ${cx+Math.cos(ang)*25} ${cy-35}" stroke="${i%2?'#55774f':'#76955d'}" stroke-width="12" stroke-linecap="round"/><ellipse cx="${cx+Math.cos(ang)*25}" cy="${cy-35}" rx="13" ry="28" transform="rotate(${ang*45} ${cx} ${cy})" fill="${i%2?'#4d734a':'#71935a'}"/>`}).join('')}`;
 if(cat==='Wall Decor'||cat==='Collectibles'||cat==='Decorations')return `${shadow}<rect x="74" y="54" width="172" height="155" rx="${5+v*4}" fill="${w}" ${common}/><rect x="87" y="67" width="146" height="129" rx="4" fill="${p}" ${common}/><path d="M105 171 L142 ${112-v*5} L169 151 L197 ${95+v2*6} L220 171Z" fill="${a}" opacity=".72"/><circle cx="126" cy="100" r="19" fill="${hi}" opacity=".75"/>`;
 if(cat==='Pet Items')return `${shadow}<ellipse cx="160" cy="172" rx="102" ry="53" fill="${p}" ${common}/><ellipse cx="160" cy="170" rx="79" ry="34" fill="${a}" ${common}/><path d="M135 148 q25 -25 50 0 M145 178 q15 17 30 0" fill="none" stroke="${w}" stroke-width="8" stroke-linecap="round"/>`;
 if(cat==='Games'||cat==='Toys & Hobbies')return `${shadow}<rect x="70" y="88" width="180" height="122" rx="18" fill="${w}" ${common}/><rect x="84" y="102" width="152" height="94" rx="11" fill="${p}" ${common}/>${Array.from({length:9},(_,i)=>`<circle cx="${105+(i%3)*55}" cy="${122+Math.floor(i/3)*29}" r="${8+(i+v)%5}" fill="${i%2?a:hi}" opacity=".86"/>`).join('')}`;
 if(cat==='Wallpaper'||cat==='Ceiling & Trim'||cat==='Architecture'||cat==='Windows & Doors')return `${shadow}<rect x="61" y="54" width="198" height="165" rx="7" fill="${p}" ${common}/>${Array.from({length:6},(_,i)=>`<path d="M${68+i*33} 60 V212" stroke="${i%2?a:w}" stroke-width="${4+(i+v)%4}" opacity=".65"/>`).join('')}<rect x="110" y="82" width="100" height="115" rx="5" fill="${a}" fill-opacity=".22" ${common}/><path d="M160 84 V195 M112 138 H208" stroke="${hi}" stroke-width="7" opacity=".7"/>`;
 if(cat==='Special Effects')return `${shadow}<circle cx="160" cy="143" r="72" fill="${p}" opacity=".18" stroke="${a}" stroke-width="8"/>${Array.from({length:10},(_,i)=>{const aa=i/10*Math.PI*2,rr=36+(i%3)*23;return `<circle cx="${160+Math.cos(aa)*rr}" cy="${143+Math.sin(aa)*rr}" r="${5+i%4}" fill="${i%2?a:hi}" opacity=".9"/>`}).join('')}`;
 return `${shadow}${plank(77,77,166,136,p)}`;
}

function svg(item,{thumb=false}={}){
 const h=hash(item['Item ID']), p=palette[h%palette.length], glow=rarGlow(item.Rarity), hero=item.Rarity==='Family Legendary'||item.Secret==='Yes';
 const [l1,l2]=split(item['Item Name']);
 const art=shape(item,h);
 const bg=thumb?`<rect width="320" height="320" rx="24" fill="url(#bg)"/><path d="M0 235 H320 V320 H0Z" fill="#130d09" opacity=".72"/>`:'';
 const text=thumb?`<text x="160" y="257" text-anchor="middle" fill="#fff0ce" font-family="Georgia,serif" font-size="17" font-weight="700">${esc(l1)}</text>${l2?`<text x="160" y="278" text-anchor="middle" fill="#d8c09b" font-family="Georgia,serif" font-size="14">${esc(l2)}</text>`:''}<text x="160" y="300" text-anchor="middle" fill="${glow}" font-family="system-ui,sans-serif" font-size="10" font-weight="800" letter-spacing="1">${esc(item.Collection)} · ${esc(item.Rarity)}</text>`:'';
 const heroRing=hero?`<circle cx="160" cy="143" r="121" fill="none" stroke="${glow}" stroke-opacity=".55" stroke-width="4" stroke-dasharray="8 9"><animateTransform attributeName="transform" type="rotate" from="0 160 143" to="360 160 143" dur="12s" repeatCount="indefinite"/></circle>`:'';
 return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 320" role="img" aria-label="${esc(item['Item Name'])}"><defs><linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#39271a"/><stop offset=".55" stop-color="#20150f"/><stop offset="1" stop-color="#0d0907"/></linearGradient><linearGradient id="screen" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#4a7585"/><stop offset=".45" stop-color="#172b35"/><stop offset="1" stop-color="#0e161a"/></linearGradient><filter id="ds"><feDropShadow dx="0" dy="7" stdDeviation="6" flood-opacity=".45"/></filter></defs>${bg}<g filter="url(#ds)">${heroRing}${art}</g>${text}</svg>`;
}
for(const item of C){const id=item['Item ID'];fs.writeFileSync(path.join(thumbDir,`${id}.svg`),svg(item,{thumb:true}));fs.writeFileSync(path.join(placeDir,`${id}.svg`),svg(item,{thumb:false}));}
const shell=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 800"><defs><linearGradient id="wall" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#9a7550"/><stop offset="1" stop-color="#6c4d34"/></linearGradient><linearGradient id="floor" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#6b472e"/><stop offset="1" stop-color="#2d1c14"/></linearGradient><linearGradient id="win" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#b9d7dc"/><stop offset="1" stop-color="#57747c"/></linearGradient></defs><rect width="1280" height="800" fill="#27170f"/><path d="M0 0 H1280 V500 L970 440 L310 440 L0 500Z" fill="url(#wall)"/><path d="M0 800 V500 L310 440 H970 L1280 500 V800Z" fill="url(#floor)"/><g opacity=".32" stroke="#2b190f" stroke-width="6">${Array.from({length:12},(_,i)=>`<path d="M0 ${80+i*34} H1280"/>`).join('')}${Array.from({length:15},(_,i)=>`<path d="M${i*92} 800 L${310+i*47} 440"/>`).join('')}</g><rect x="850" y="108" width="230" height="220" rx="4" fill="#3e2a1e" stroke="#d2b080" stroke-width="15"/><rect x="870" y="128" width="190" height="180" fill="url(#win)"/><path d="M965 128 V308 M870 218 H1060" stroke="#d2b080" stroke-width="10"/><rect x="160" y="148" width="190" height="316" rx="6" fill="#4b3020" stroke="#d2b080" stroke-width="14"/><circle cx="315" cy="308" r="10" fill="#d6b45d"/><path d="M160 465 H350" stroke="#2d1a11" stroke-width="12"/><path d="M0 500 L310 440 H970 L1280 500" fill="none" stroke="#c99b5d" stroke-opacity=".35" stroke-width="8"/><ellipse cx="640" cy="95" rx="54" ry="17" fill="#382417"/><path d="M640 95 V150" stroke="#342219" stroke-width="8"/><path d="M575 150 H705 L674 208 H606Z" fill="#e2bf75" opacity=".82"/><ellipse cx="640" cy="204" rx="84" ry="24" fill="#f5c96a" opacity=".12"/></svg>`;
fs.writeFileSync(path.join(outRoot,'empty-room-shell.svg'),shell);
console.log(`Generated ${C.length} unique cabin item thumbnail + placement pairs.`);
