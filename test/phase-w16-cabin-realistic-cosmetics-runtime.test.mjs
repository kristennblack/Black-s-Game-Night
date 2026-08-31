import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {COSMETIC_CATALOG,COSMETIC_SLOTS,COSMETIC_BY_ID,normalizeEquipped,cosmeticOverlayHTML,fitProfileForAvatar} from '../public/avatar-cosmetics.mjs';
import {CABIN_ROOM_ITEM_CATALOG} from '../public/cabin-room-catalog.mjs';
import {STARTER_CABIN_BLUEPRINT_IDS,normalizeCabinBlueprints} from '../public/cabin-progression.mjs';
import {GameHub} from '../worker.mjs';
const root=path.resolve(new URL('..',import.meta.url).pathname);const read=p=>fs.readFileSync(path.join(root,p),'utf8');

test('W16 home has a direct working Cabin destination in both hero and destination navigation',()=>{
 const app=read('public/app.js');assert.match(app,/href="\/cabin\.html">Visit the Cabin<\/a>/);assert.ok((app.match(/Visit the Cabin/g)||[]).length>=2);assert.match(app,/Cabin Shop \+ Cosmetics/);
 assert.ok(fs.existsSync(path.join(root,'public/cabin.html')));assert.ok(fs.existsSync(path.join(root,'public/cabin.js')));assert.ok(fs.existsSync(path.join(root,'public/cabin.css')));
});

test('W16 cosmetic catalog is substantially expanded and asset-backed rather than emoji-backed',()=>{
 assert.ok(COSMETIC_CATALOG.length>=150);for(const slot of ['hat','hair','face','headset','earrings','neck','top','badge'])assert.ok(COSMETIC_SLOTS.includes(slot),slot);
 assert.ok(COSMETIC_CATALOG.every(x=>x.asset&&/^\/cosmetics\/generated\//.test(x.asset)));assert.ok(COSMETIC_CATALOG.every(x=>!('icon' in x)));
 for(const x of COSMETIC_CATALOG){const local=path.join(root,'public',x.asset.replace(/^\//,''));assert.ok(fs.existsSync(local),`${x.id} asset`)}
});

test('W16 fitted renderer outputs images with anatomical position variables and passes avatar identity into shared portraits',()=>{
 const html=cosmeticOverlayHTML({hat:'camp-cap',glasses:'aviator-sunglasses',accessory:'red-bandana'},'kristen');assert.match(html,/<img/);assert.match(html,/--cx:/);assert.match(html,/--cy:/);assert.match(html,/--cw:/);assert.doesNotMatch(html,/🧢|🕶|👓/);
 const k=fitProfileForAvatar('kristen','hat',COSMETIC_BY_ID['camp-cap']);assert.ok(k.w<=65);assert.ok(k.y<=12,'Kristen headwear should sit on the head rather than across the eyes');
 const app=read('public/app.js');assert.match(app,/cosmeticOverlayHTML\(equipped,a\[0\],p\?\.variant\)/);const css=read('public/styles.css');assert.match(css,/Phase W\.16 fitted realistic cosmetics/);assert.match(css,/object-fit:contain/);
});



test('W19 universal fitting supersedes portrait conflicts so every cosmetic remains visible on every avatar',()=>{
 const glasses=COSMETIC_BY_ID['round-glasses'],hat=COSMETIC_BY_ID['winter-toque'],earrings=COSMETIC_BY_ID['drop-earrings'],necklace=COSMETIC_BY_ID['gold-chain'];
 for(const [avatar,slot,item,variant] of [['james','glasses',glasses,0],['kristen','glasses',glasses,2],['logan','hat',hat,3],['elizabeth','jewelry',earrings,3],['elizabeth','jewelry',necklace,3],['molly','top',COSMETIC_BY_ID['flannel-shirt'],0]]){
   const fit=fitProfileForAvatar(avatar,slot,item,variant);assert.notEqual(fit.hidden,true,`${avatar} ${slot}`);assert.ok(Number.isFinite(fit.x)&&Number.isFinite(fit.y)&&Number.isFinite(fit.w));
 }
 const app=read('public/app.js'),store=read('public/tokens-store.html');assert.match(app,/cosmeticOverlayHTML\(equipped,a\[0\],p\?\.variant\)/);assert.match(store,/cosmeticOverlayHTML\(previewEq\(\),String\(profile\.avatar\|\|'john'\),Number\(profile\.variant\)\|\|0\)/);
});

test('W16 preserves legacy cosmetic ids while normalizing expanded slots',()=>{
 for(const id of ['camp-cap','cowboy-hat','birthday-crown','winter-toque','flower-crown','round-glasses','sunglasses','heart-glasses','safety-glasses','red-bandana','gold-chain','headphones','flower-pin','rock-charm'])assert.ok(COSMETIC_BY_ID[id],id);
 const eq=normalizeEquipped({hat:'camp-cap',glasses:'round-glasses',top:'flannel-shirt'});assert.equal(eq.hat,'camp-cap');assert.equal(eq.glasses,'round-glasses');assert.equal(eq.top,'flannel-shirt');
});

test('W16 merged Cabin Shop uses realistic room catalog plus live fitted wearable preview',()=>{
 const h=read('public/tokens-store.html');assert.match(h,/Master Catalog/i);assert.match(h,/CABIN_ROOM_ITEM_CATALOG/);assert.match(h,/cabin-progression\.mjs/);assert.match(h,/cosmeticOverlayHTML/);assert.match(h,/Game Night Tokens/);assert.match(h,/ARCADE WIN/);assert.match(h,/ACHIEVEMENT/);assert.match(h,/Visit the Cabin/);assert.match(h,/ROOM PREVIEW/i);assert.doesNotMatch(h,/Apple Color Emoji|Segoe UI Emoji/);
});

test('W16 Cabin runtime connects the 400-item catalog, owner-only save API and social visit surfaces',()=>{
 assert.equal(CABIN_ROOM_ITEM_CATALOG.length,2000);const js=read('public/cabin.js'),worker=read('worker.mjs');assert.match(js,/guest:/);assert.match(js,/Guest Book/);assert.match(js,/14×16/);assert.match(js,/90°/);assert.match(worker,/\/api\/cabin\/overview/);assert.match(worker,/\/api\/cabin\/room/);assert.match(worker,/Only the room owner can decorate this room/);assert.match(worker,/CABIN_ROOM_ITEM_BY_ID/);assert.match(worker,/guestbook/);assert.match(worker,/reactions/);
});

test('W16 Cabin runtime remains preserved while W22 is current',()=>{
 assert.equal(read('CURRENT_RELEASE.txt').trim(),'GAME-NIGHT-STAGING-PHASE-W23-CABIN-REGRESSION-RECOVERY-48');assert.equal(read('DESIGN_RELEASE.txt').trim(),'GAME-NIGHT-DESIGN-PHASE-W22-CATALOG-APPROVAL-STUDIO-44');const pkg=JSON.parse(read('package.json'));assert.equal(pkg.version,'3.21.3-staging-phase-w23-cabin-regression-recovery-48');const sw=read('public/sw.js');assert.match(sw,/PHASE_W17_CACHE/);assert.match(sw,/const CACHE=PHASE_W22_CACHE/);for(const f of ['cabin.html','cabin.css','cabin.js','cabin-room-catalog.mjs','cabin-progression.mjs'])assert.match(sw,new RegExp(f.replace('.','\\.')));
});

test('W16 master prompt is truthful about implemented runtime vs remaining unique 3D asset work',()=>{
 const m=read('MASTER_GAME_DESIGN_PRODUCTION_PROMPT_W16.md');assert.match(m,/HIGHEST-PRECEDENCE CURRENT MASTER PROMPT/);assert.match(m,/154 fitted wearable records/);assert.match(m,/Visit the Cabin/);assert.match(m,/400 unique production 3D furniture meshes/);assert.match(m,/does \*\*not\*\* falsely claim/);
});


class W16MemoryStorage{
 constructor(){this.map=new Map()}
 async list({prefix=''}={}){return new Map([...this.map].filter(([k])=>k.startsWith(prefix)))}
 async get(k){return this.map.get(k)}
 async put(k,v){this.map.set(k,structuredClone(v))}
}
const makeW16Hub=()=>{const storage=new W16MemoryStorage(),waits=[];const ctx={storage,waitUntil(p){waits.push(Promise.resolve(p))}};return{hub:new GameHub(ctx,{}),storage,flush:async()=>{while(waits.length)await Promise.all(waits.splice(0))}}};

test('W16 Cabin ownership, visitor guestbook and 90-degree placement snapping work as persisted runtime data',async()=>{
 const {hub}=makeW16Hub();
 const validItem=STARTER_CABIN_BLUEPRINT_IDS[0];
 let room=await hub.updateCabinRoom({profileId:'k-profile',name:'Kristen',avatar:'kristen',action:'save',roomKey:'kristen',placements:[{id:'chair-1',itemId:validItem,x:7.2,z:6.4,rotation:92}]});
 assert.equal(room.ownerProfileId,'k-profile');assert.equal(room.ownerAvatar,'kristen');assert.equal(room.placements.length,1);assert.equal(room.placements[0].rotation,90);
 const locked=CABIN_ROOM_ITEM_CATALOG.find(x=>x['Source Type']==='Buy with Game Night Tokens'&&!STARTER_CABIN_BLUEPRINT_IDS.includes(x['Item ID']));
 await assert.rejects(()=>hub.updateCabinRoom({profileId:'k-profile',name:'Kristen',avatar:'kristen',action:'save',roomKey:'kristen',placements:[{id:'locked',itemId:locked['Item ID'],x:5,z:5,rotation:0}]}),/Unlock this cabin blueprint/);
 await assert.rejects(()=>hub.updateCabinRoom({profileId:'visitor',name:'Visitor',avatar:'john',action:'save',roomKey:'kristen',placements:[]}),/Only the room owner/);
 room=await hub.updateCabinRoom({profileId:'visitor',name:'Visitor',avatar:'john',action:'guestbook',roomKey:'kristen',text:'Love this room'});assert.equal(room.guestbook.at(-1).text,'Love this room');
 room=await hub.updateCabinRoom({profileId:'visitor',name:'Visitor',avatar:'john',action:'react',roomKey:'kristen',emoji:'✨'});assert.equal(room.reactions.at(-1).emoji,'✨');
 const loaded=await hub.getCabinRoom('kristen');assert.equal(loaded.placements[0].rotation,90);assert.equal(loaded.guestbook.length,1);
});

test('W16 Game Night Token cosmetics buy, equip and expanded slots persist server-side',async()=>{
 const {hub,storage}=makeW16Hub();
 await storage.put('arcade-profile:cosmetic-user',{profileId:'cosmetic-user',name:'Kristen',tokens:200,cosmetics:{},equippedCosmetics:{}});
 let p=await hub.updateArcadeCosmetic({profileId:'cosmetic-user',name:'Kristen',action:'buy',itemId:'camp-cap'});assert.ok(p.cosmetics['camp-cap']);assert.equal(p.tokens,170);
 p=await hub.updateArcadeCosmetic({profileId:'cosmetic-user',name:'Kristen',action:'equip',itemId:'camp-cap'});assert.equal(p.equippedCosmetics.hat,'camp-cap');
 p=await hub.updateArcadeCosmetic({profileId:'cosmetic-user',name:'Kristen',action:'unequip',slot:'hat'});assert.equal(p.equippedCosmetics.hat,null);
 await assert.rejects(()=>hub.updateArcadeCosmetic({profileId:'cosmetic-user',action:'buy',itemId:'firefighter-helmet'}),/earned through play or an event/);
});



test('W16 Cabin Shop purchases real room blueprints with the same Game Night Token wallet',async()=>{
 const {hub,storage}=makeW16Hub();
 await storage.put('arcade-profile:room-shop-user',{profileId:'room-shop-user',name:'Kristen',tokens:300,cosmetics:{},cabinBlueprints:{},equippedCosmetics:{}});
 const purchasable=CABIN_ROOM_ITEM_CATALOG.find(x=>x['Source Type']==='Buy with Game Night Tokens'&&!STARTER_CABIN_BLUEPRINT_IDS.includes(x['Item ID'])&&Number(x['Token Price'])>0);
 assert.ok(purchasable);
 let p=await hub.updateCabinBlueprint({profileId:'room-shop-user',name:'Kristen',action:'buy',itemId:purchasable['Item ID']});
 assert.ok(normalizeCabinBlueprints(p.cabinBlueprints)[purchasable['Item ID']]);
 assert.equal(p.tokens,300-Number(purchasable['Token Price']));
 const earned=CABIN_ROOM_ITEM_CATALOG.find(x=>x['Source Type']==='Win in Arcade');
 await assert.rejects(()=>hub.updateCabinBlueprint({profileId:'room-shop-user',action:'buy',itemId:earned['Item ID']}),/earned through play/);
});

test('W19 room placement uses per-item transparent art instead of category-reused square tokens',()=>{
 const js=read('public/cabin.js'),css=read('public/cabin.css'),art=read('public/cabin-item-art.mjs');
 assert.match(js,/cabinItemPlaceable/);assert.match(js,/cabinItemThumb/);assert.match(art,/generated\/placeables/);assert.match(art,/generated\/thumbs/);assert.match(css,/filter:drop-shadow/);
});
