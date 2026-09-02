(()=>{
const read=(k,f)=>{try{return JSON.parse(localStorage.getItem(k)||'')||f}catch{return f}};
const write=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch{}};
window.BFGNGrantLook=async function(character,itemId,rewardKey){
  try{
    character=String(character||'').toLowerCase(); itemId=String(itemId||''); rewardKey=String(rewardKey||'arcade-reward'); if(!character||!itemId)return null;
    const key=`bfgn_${character}_looks_v1`, field=`${character}Looks`, owned=read(key,{});
    if(!owned[itemId]){owned[itemId]={unlockedAt:Date.now(),source:'reward',rewardKey};write(key,owned)}
    const cache=read('bfgn_arcade_phase_w_v1',{});cache[field]=owned;write('bfgn_arcade_phase_w_v1',cache);
    const profile=read('gn_profile_v1',{}); if(!profile.profileId)return owned;
    const r=await fetch('/api/arcade/look',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({profileId:profile.profileId,name:profile.name||'Family Player',character,action:'grant',itemId,rewardKey})});
    const d=await r.json().catch(()=>({})); if(r.ok&&d.profile?.[field]){write(key,d.profile[field]);const next=read('bfgn_arcade_phase_w_v1',{});next[field]=d.profile[field];write('bfgn_arcade_phase_w_v1',next);return d.profile[field]}
    return owned;
  }catch{return null}
};
})();
