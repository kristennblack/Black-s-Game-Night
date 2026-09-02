import { GameHub } from '../worker.mjs';
import { pathToFileURL } from 'node:url';
import path from 'node:path';

class Storage {
  constructor(){this.m=new Map()}
  async get(k){return this.m.get(k)}
  async put(k,v){this.m.set(k,structuredClone(v))}
  async list({prefix}={}){return new Map([...this.m].filter(([k])=>!prefix||k.startsWith(prefix)))}
}
const storage=new Storage();
const ctx={storage,waitUntil(p){void Promise.resolve(p)}};
const hub=new GameHub(ctx,{}); await hub.ready;
const chars=['john','holly','gunner','dorothy','molly','kelsi','elizabeth','james','vanessa','logan','papa','nana','kristen'];
const profileId='w55-integration-profile';
await storage.put(`arcade-profile:${profileId}`,{profileId,name:'W55 QA',tokens:10000,updatedAt:0});
let expectedTokens=10000;
const report=[];
for(const char of chars){
  const mod=await import(pathToFileURL(path.resolve(`public/${char}-looks-catalog.mjs`)).href+`?integration=${Date.now()}`);
  const looks=mod[`${char.toUpperCase()}_LOOKS`];
  const buy=looks[1]; const earn=looks.find(x=>x.earn?.rewardKey);
  if(!buy||!earn) throw new Error(`${char}: test look missing`);
  const before=await hub.getArcadeProfile(profileId);
  const afterBuy=await hub.updateFamilyLook({profileId,name:'W55 QA',character:char,action:'buy',itemId:buy.id});
  expectedTokens-=Number(buy.price||0);
  if(afterBuy.tokens!==expectedTokens) throw new Error(`${char}: token deduction ${afterBuy.tokens} != ${expectedTokens}`);
  if(!afterBuy[`${char}Looks`]?.[buy.id]) throw new Error(`${char}: buy did not persist ownership`);
  if(afterBuy[`equipped${char[0].toUpperCase()+char.slice(1)}Look`]!==buy.id) throw new Error(`${char}: buy did not equip`);
  const afterGrant=await hub.updateFamilyLook({profileId,name:'W55 QA',character:char,action:'grant',itemId:earn.id,rewardKey:earn.earn.rewardKey});
  if(!afterGrant[`${char}Looks`]?.[earn.id]) throw new Error(`${char}: reward did not persist ownership`);
  if(afterGrant[`${char}Looks`][earn.id].rewardKey!==earn.earn.rewardKey && afterGrant[`${char}Looks`][earn.id].source!=='starter') throw new Error(`${char}: reward provenance missing`);
  const reloaded=await hub.getArcadeProfile(profileId);
  if(!reloaded[`${char}Looks`]?.[buy.id]||!reloaded[`${char}Looks`]?.[earn.id]) throw new Error(`${char}: reload lost ownership`);
  report.push({character:char,buy:buy.id,price:buy.price,earn:earn.id,rewardKey:earn.earn.rewardKey,tokensAfter:reloaded.tokens});
}
console.log(JSON.stringify({ok:true,profileId,startTokens:10000,endTokens:expectedTokens,characters:report},null,2));
