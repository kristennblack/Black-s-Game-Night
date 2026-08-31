import fs from 'node:fs';
import path from 'node:path';
const root=path.resolve('/mnt/data/bfgn_w22');
const pub=path.join(root,'public');
const read=p=>JSON.parse(fs.readFileSync(path.join(pub,p),'utf8'));
const home=read('cabin-room-catalog-w20.json');
const wear=read('wearable-catalog-w20.json');
const world=read('world-prop-catalog-w21.json');

const rareRank={Common:1,Uncommon:2,Rare:3,Premium:4,Epic:5,Legendary:6,'Family Signature':7,'Event Exclusive':8};
const lc=v=>String(v||'').toLowerCase();
const yes=v=>String(v||'').toLowerCase()==='yes'||v===true;
function priorityHome(x){
 const c=lc(x.Collection),cat=lc(x.Category),name=lc(x['Item Name']);
 if(c.includes('christmas')||c.includes('halloween')||c.includes('season')||c.includes('event')||c.includes('birthday'))return 7;
 if(yes(x['Family Signature'])||c.includes('john')||c.includes('kristen')||c.includes('lizzy')||c.includes('papa')||c.includes('nana')||c.includes('logan')||c.includes('vanessa')||c.includes('holly')||c.includes('pet'))return 4;
 if(c.includes('fun')||name.includes('funny')||c.includes('arcade'))return 5;
 if((rareRank[x.Rarity]||0)>=5||yes(x.Hero))return 6;
 if(c.includes('everyday')||c.includes('rustic')||c.includes('cozy')||c.includes('farmhouse')||c.includes('lodge')||['beds & bedroom furniture','seating','tables & desks','storage','lighting','windows & doors','rugs & soft decor','wall decor & pictures'].some(k=>cat.includes(k)))return 1;
 return 1;
}
function priorityWear(x){
 const c=lc(x.collection),cat=lc(x.category),role=lc(x.role),name=lc(x.name);
 if(c.includes('christmas')||c.includes('halloween')||c.includes('winter')||c.includes('summer')||c.includes('festival')||c.includes('event'))return 7;
 if(c.includes('john')||c.includes('kristen')||c.includes('lizzy')||c.includes('papa')||c.includes('nana')||c.includes('logan')||c.includes('vanessa')||c.includes('holly')||c.includes('family')||c.includes('pet'))return 4;
 if(c.includes('silly')||c.includes('filter')||role==='funny'||cat.includes('filter')||name.includes('ears')||name.includes('horn'))return 5;
 if((rareRank[x.rarity]||0)>=5||role==='hero')return 6;
 if(c.includes('cabin casual')||c.includes('country')||c.includes('everyday')||['tops','bottoms','outerwear','footwear','dresses'].some(k=>cat.includes(k)))return 2;
 return 2;
}
function priorityWorld(x){
 const c=lc(x.Collection),map=lc(x['Primary Map']),tags=lc(x.Tags);
 if(yes(x.Seasonal)||c.includes('season')||c.includes('christmas')||c.includes('halloween'))return 7;
 if(yes(x['Family Signature'])||tags.includes('family signature'))return 4;
 if(yes(x.Funny)||tags.includes('funny'))return 5;
 if((rareRank[x.Rarity]||0)>=5||yes(x.Hero))return 6;
 if(map.includes('prop hunt')||map.includes('papa')||map.includes('camper')||map.includes('backyard')||map.includes('goat'))return 3;
 return 3;
}
const priorityLabel={1:'Cabin Home Essentials',2:'Avatar Everyday Wear',3:'Prop Hunt Shared World Props',4:'Family Signature Collections',5:'Funny Filters + Comedy',6:'Luxury / Rare / Achievement',7:'Seasonal / Event'};
function homeDims(x){
 const h={Low:1.5,Medium:3,Tall:6,'Wall-height':7.5}[x['Height Band']]||3;
 return {widthFt:Number(x['Footprint W'])||2,depthFt:Number(x['Footprint D'])||2,heightFt:h,surface:x['Placement Surface']||'Floor'};
}
function worldDims(x){
 const m={Tiny:[0.5,0.5,0.5],Small:[1,1,1],Medium:[2,2,2.5],Large:[4,3,5],Oversized:[7,5,7]}[x['Scale Class']]||[2,2,2];
 return {widthFt:m[0],depthFt:m[1],heightFt:m[2],surface:lc(x.Tags).includes('wall mounted')?'Wall':'Floor'};
}
const review=[];
for(const x of home){review.push({reviewId:`home:${x['Item ID']}`,catalog:'Home',sourceId:x['Item ID'],name:x['Item Name'],category:x.Category,subcategory:x.Subcategory||'',collection:x.Collection,rarity:x.Rarity,price:Number(x['Token Price'])||0,asset:`/cabin-assets/generated/thumbs/${x['Item ID']}.svg`,placementAsset:`/cabin-assets/generated/placeables/${x['Item ID']}.svg`,artBrief:x['3D Production Notes']||`${x['Item Name']} in approved rustic/cozy cabin realism.`,dimensions:homeDims(x),placementSurface:x['Placement Surface']||'Floor',interactive:yes(x.Interactive),hero:yes(x.Hero),familySignature:yes(x['Family Signature']),priority:priorityHome(x),proofMode:'room',variantStrategy:'Selectable finish/color variants; geometry changes require a distinct design ID.',fitStandard:'Realistic room scale with cozy rustic proportions.',pipelineStatus:'Concept',reviewDecision:'Unreviewed',approvedForLive:false,artStatus:'Concept',fitScaleStatus:'Needs Review',reviewNotes:''});}
for(const x of wear){review.push({reviewId:`avatar:${x.id}`,catalog:'Avatar',sourceId:x.id,name:x.name,category:x.category,subcategory:x.slot||'',collection:x.collection||'',rarity:x.rarity||'Common',price:Number(x.price)||0,asset:x.asset,artBrief:x.visualConcept||x.desc||`${x.name}, realistic wearable product render.`,dimensions:null,slot:x.slot||'',dogAdaptation:x.dogAdaptation||'No',interactive:!!x.animated,hero:lc(x.role)==='hero',familySignature:lc(x.rarity)==='family signature'||lc(x.collection).includes('family'),priority:priorityWear(x),proofMode:'avatar',variantStrategy:'Selectable finish/color variants; silhouette/geometry changes require a distinct design ID.',fitStandard:'Universal layered human fit; intentional dog adaptation only where appropriate.',pipelineStatus:'Concept',reviewDecision:'Unreviewed',approvedForLive:false,artStatus:'Concept',fitScaleStatus:'Needs Review',reviewNotes:''});}
for(const x of world){review.push({reviewId:`world:${x['Prop ID']}`,catalog:'World Props',sourceId:x['Prop ID'],name:x['Prop Name'],category:x.Category,subcategory:x.Subcategory||'',collection:x.Collection,rarity:x.Rarity,price:0,asset:x['Art Path'],artBrief:x['Art Brief']||`${x['Prop Name']} in approved shared 3D world style.`,dimensions:worldDims(x),primaryMap:x['Primary Map']||'',secondaryUses:x['Secondary Uses']||'',tags:x.Tags||'',hideable:yes(x.Hideable),climbable:yes(x.Climbable),interactive:yes(x.Interactive),hero:yes(x.Hero),familySignature:yes(x['Family Signature']),priority:priorityWorld(x),proofMode:'world',variantStrategy:'One master asset identity with optimized preview, world, cabin, and Prop Hunt runtime variants.',fitStandard:'Believable real-world scale; gameplay classifications remain explicit.',pipelineStatus:'Concept',reviewDecision:'Unreviewed',approvedForLive:false,artStatus:'Concept',fitScaleStatus:'Needs Review',reviewNotes:''});}
const collectionWeight=n=>{n=lc(n);for(const [i,k] of ['everyday basics','rustic pine','cozy cabin','heritage farmhouse','fireside living','country kitchen','old lodge','modern lodge','cabin casual','country weekend','work crew','outdoors & fishing'].entries())if(n.includes(k))return i;return 99};
const categoryWeight=n=>{n=lc(n);for(const [i,k] of ['beds','seating','tables','storage','lighting','windows','doors','rugs','wall','clutter','tops','bottoms','outerwear','footwear'].entries())if(n.includes(k))return i;return 99};
review.sort((a,b)=>a.priority-b.priority||collectionWeight(a.collection)-collectionWeight(b.collection)||categoryWeight(a.category)-categoryWeight(b.category)||a.catalog.localeCompare(b.catalog)||a.collection.localeCompare(b.collection)||a.category.localeCompare(b.category)||a.name.localeCompare(b.name));
review.forEach((x,i)=>{x.reviewOrder=i+1;x.batch=Math.floor(i/100)+1;x.batchOrder=(i%100)+1;x.priorityLabel=priorityLabel[x.priority];});
const batches=[];
for(let i=0;i<review.length;i+=100){const items=review.slice(i,i+100);const counts=Object.fromEntries(['Home','Avatar','World Props'].map(k=>[k,items.filter(x=>x.catalog===k).length]));batches.push({batch:Math.floor(i/100)+1,start:i+1,end:i+items.length,count:items.length,priority:items[0]?.priority||0,priorityLabel:items[0]?.priorityLabel||'',catalogCounts:counts,collections:[...new Set(items.map(x=>x.collection))].slice(0,12)});}
const meta={version:'W22',total:review.length,catalogCounts:{Home:home.length,Avatar:wear.length,'World Props':world.length},batchSize:100,batchCount:batches.length,pipelineStatuses:['Concept','Approved Art','3D Ready','Integrated','Device Approved'],reviewDecisions:['Unreviewed','Approve Concept','Needs Changes','Reject'],visualContract:'/catalog-review/approved-catalog-lookbook.png',reviewFormats:['Collection Lookbook','Grid / Board','Real-use Proof'],priorityOrder:Object.values(priorityLabel),wearableLayerStack:['hair','headwear','face/filter','earrings','neck','top','outerwear','bottoms','footwear','handheld/back','aura/signature'],releasePolicy:'Only approved priority collections may be promoted. Unapproved items stay in staging.'};
fs.writeFileSync(path.join(pub,'catalog-review-w22.json'),JSON.stringify({meta,batches,items:review}));

// Add pipeline status fields to source catalogs without changing IDs or ownership semantics.
for(const x of home){x['Art Status']='Concept';x['Review Status']='Unreviewed';x['Approved For Live']='No';x['Variant Strategy']='Finish Options';x['Catalog Version']=22;}
for(const x of wear){x.artStatus='Concept';x.reviewStatus='Unreviewed';x.approvedForLive=false;x.variantStrategy='finish-options';x.catalogVersion=22;}
for(const x of world){x['Art Status']='Concept';x['Review Status']='Unreviewed';x['Approved For Live']='No';x['Variant Strategy']='Master Asset + Runtime Variants';x['Catalog Version']=22;}
fs.writeFileSync(path.join(pub,'cabin-room-catalog-w20.json'),JSON.stringify(home));
fs.writeFileSync(path.join(pub,'wearable-catalog-w20.json'),JSON.stringify(wear));
fs.writeFileSync(path.join(pub,'world-prop-catalog-w21.json'),JSON.stringify(world));
console.log(JSON.stringify({items:review.length,batches:batches.length,counts:meta.catalogCounts,first:batches[0],last:batches.at(-1)},null,2));
