import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const root=process.cwd();
const pub=path.join(root,'public');
const chars=['john','holly','gunner','dorothy','molly','kelsi','elizabeth','james','vanessa','logan','papa','nana','kristen'];
const expected=30;
const errors=[];
const rows=[];
for (const char of chars){
  const catalogPath=path.join(pub,`${char}-looks-catalog.mjs`);
  if(!fs.existsSync(catalogPath)){errors.push(`${char}: catalog missing`);continue;}
  const mod=await import(pathToFileURL(catalogPath).href+`?audit=${Date.now()}`);
  const upper=char.toUpperCase();
  const arr=mod[`${upper}_LOOKS`] ?? mod[`${upper}_LOOK_CATALOG`];
  if(!Array.isArray(arr)){errors.push(`${char}: no exported look array`);continue;}
  const ids=new Set(); let earn=0, assetOk=0, fallbackOk=0, priceOk=0;
  for(const [i,item] of arr.entries()){
    if(!item?.id) errors.push(`${char}[${i}]: missing id`);
    else if(ids.has(item.id)) errors.push(`${char}: duplicate id ${item.id}`); else ids.add(item.id);
    if(Number.isFinite(Number(item?.price))) priceOk++; else errors.push(`${char}:${item?.id}: invalid price`);
    if(item?.earn?.rewardKey) earn++;
    const asset=path.join(pub,'look-assets',`${item.id}.jpg`);
    const fallback=path.join(pub,'avatars','styles',`${item.id}.jpg`);
    if(fs.existsSync(asset)&&fs.statSync(asset).size>1000) assetOk++; else errors.push(`${char}:${item.id}: canonical asset missing/empty`);
    if(fs.existsSync(fallback)&&fs.statSync(fallback).size>1000) fallbackOk++; else errors.push(`${char}:${item.id}: fallback asset missing/empty`);
  }
  if(arr.length!==expected) errors.push(`${char}: ${arr.length} looks, expected ${expected}`);
  if(Number(arr[0]?.price)!==0) errors.push(`${char}: starter look not free`);
  if(earn<3) errors.push(`${char}: only ${earn} earnable looks, expected at least 3`);
  rows.push({char,count:arr.length,earn,priceOk,assetOk,fallbackOk,starter:arr[0]?.id});
}
const total=rows.reduce((n,r)=>n+r.count,0);
console.log(JSON.stringify({release:'W55',characters:rows,totalLooks:total,errors},null,2));
if(total!==390) errors.push(`total looks ${total}, expected 390`);
if(errors.length){process.exitCode=1;}
