const PROFILE_KEY='gn_profile_v1';
const LOCAL_KEY='bfgn_arcade_phase_w_v1';
const GAMES={
 'papas-paddle-battle':{id:'papas-paddle-battle',person:'papa',name:'Papa',reaction:'Shop rules. Keep it moving.'},
 'gunners-goat-run':{id:'gunners-goat-run',person:'gunner',name:'Gunner',reaction:'Gunner is trying. Mostly.'},
 'johns-shop-bomber':{id:'johns-shop-bomber',person:'john',name:'John',reaction:'Fix it properly or do it again.'},
 'jamess-lumber-stack':{id:'jamess-lumber-stack',person:'james',name:'James',reaction:'Quiet. Steady. Stack it right.'},
 'dorothys-garden-merge':{id:'dorothys-garden-merge',person:'dorothy',name:'Dorothy',reaction:'Garden first. Smoke break later.'},
 'logans-minefield':{id:'logans-minefield',person:'logan',name:'Logan',reaction:'Fine. I am doing it.'},
 'nanas-goat-whack':{id:'nanas-goat-whack',person:'nana',name:'Nana',reaction:"That's a sin."},
 'hollys-memory-mayhem':{id:'hollys-memory-mayhem',person:'holly',name:'Holly',reaction:'That one was definitely cute.'},
 'lizzies-dramatic-lights':{id:'lizzies-dramatic-lights',person:'elizabeth',name:'Lizzie',reaction:'That deserved a better spotlight.'},
 'vanessas-pipe-problem':{id:'vanessas-pipe-problem',person:'vanessa',name:'Vanessa',reaction:'Obviously I had to fix it.'},
 'mollys-light-chase':{id:'mollys-light-chase',person:'molly',name:'Molly',reaction:'LIGHT!'},
 'gunners-snack-attack':{id:'gunners-snack-attack',person:'gunner',name:'Gunner',reaction:'Snack secured. Work avoided.'},
 'breakout':{id:'breakout',name:'Cabin Breakout',reaction:'Cabin clear!'},
 'space-shooter':{id:'space-shooter',person:'kelsi',name:"Kelsi's Rock 'n' Roll Rescue",reaction:'Important rock acquired.'},
 'rocket-gap':{id:'rocket-gap',name:'Campfire Rocket',reaction:'Threaded the gap.'},
 'neon-snake':{id:'neon-snake',name:'Neon Snake',reaction:'Clean turn.'}
};
const pathKey=(location.pathname.split('/').pop()||'').replace(/\.html$/,'');
const cfg=GAMES[pathKey]||{id:pathKey||'arcade',name:document.title.split(' - ')[0],reaction:'Nice run.'};
function readJSON(k,f={}){try{return JSON.parse(localStorage.getItem(k)||'')||f}catch{return f}}
function profile(){const p=readJSON(PROFILE_KEY,{});return{profileId:String(p.profileId||'local-profile'),name:String(p.name||localStorage.getItem('gn_name')||'Family Player'),avatar:String(p.avatar||'john')}}
function assetFor(person){if(!person)return'';return `/avatars/styles/${person==='john'?'john-look-02':person+'-cute'}.jpg`}
function activeEvent(date=new Date()){
 const y=date.getFullYear(),one=(m,d)=>new Date(y,m-1,d,12),birthdays=[['James',2,2,'james'],['Logan',3,17,'logan'],['Holly',3,28,'holly'],['Dorothy',4,6,'dorothy'],['Kristen',4,15,'kristen'],['Papa',7,19,'papa'],['Nana',8,18,'nana'],['Lizzie',8,27,'elizabeth'],['John',9,28,'john'],['Vanessa',10,6,'vanessa']];
 const holidays=[['New Year',1,1],['Valentine’s Day',2,14],['Canada Day',7,1],['Halloween',10,31],['Christmas',12,25]];
 const within=t=>Math.abs(date-t)<=5*86400000;
 const b=birthdays.map(x=>({name:`${x[0]}'s Birthday`,date:one(x[1],x[2]),person:x[3],birthday:true})).find(x=>within(x.date));
 const h=holidays.map(x=>({name:x[0],date:one(x[1],x[2])})).find(x=>within(x.date));
 if(b&&h)return{name:`${b.name} + ${h.name}`,birthday:b,holiday:h};return b||h||null;
}
function sceneLayer(){const themes={
 'papas-paddle-battle':['SHOP','TRACTOR','FIREPLACE','CHAIR'], 'gunners-goat-run':['BARN','FENCE','GOATS','CREEK'], 'johns-shop-bomber':['TOOLS','WELDER','TIRES','CRATES'], 'jamess-lumber-stack':['TIMBER','SAW','BEAMS','CABIN'], 'dorothys-garden-merge':['GARDEN','GREENHOUSE','FLOWERS','PLANTERS'], 'logans-minefield':['FISHING','MUD','ROCKS','GOOSE'], 'nanas-goat-whack':['GOATS','PIGS','CHICKENS','FENCE'], 'hollys-memory-mayhem':['TOYS','DOGS','CUPCAKES','HOODIES'], 'lizzies-dramatic-lights':['STAGE','SPOTLIGHT','DANCE','CURTAIN'], 'vanessas-pipe-problem':['TRUCK','PIPES','TANK','SHOP'], 'kelsis-rock-hunt':['ROCKS','YARD','CROWN','TRAIL'], 'mollys-light-chase':['LIGHTS','YARD','TRAIL','GLOW'], 'gunners-snack-attack':['FARM','SNACKS','BARN','WORK?'], 'breakout':['CABIN','BRICKS','EMBER','RAFTERS'], 'space-shooter':['ROCKS','TRAIL','CREEK','KELSI'], 'rocket-gap':['PINES','FIRE','ROCKET','TIMBER'], 'neon-snake':['GRID','GLOW','TRAIL','ARCADE']};const words=themes[cfg.id]||['ARCADE','FAMILY','GAME','NIGHT'];const el=document.createElement('div');el.className='phase-w-scene';el.innerHTML=words.map((w,i)=>`<span style="--i:${i}">${w}</span>`).join('');document.body.prepend(el)}
function watchReactions(){const p=profile(),targets=[...document.querySelectorAll('[id*=score],[id*=you],[id*=best],[id*=level],[id*=wave]')];for(const el of targets){let prev=el.textContent;new MutationObserver(()=>{const next=el.textContent;if(next===prev)return;prev=next;const n=Number(String(next).replace(/[^0-9.-]/g,''));if(Number.isFinite(n)&&/score|best/i.test(el.id)){const st=readJSON(LOCAL_KEY,{tokens:0,achievements:{},plays:{},records:{}});st.records=st.records||{};const r=st.records[cfg.id]||{};if(n>Number(r.highScore||0)){r.highScore=n;r.at=Date.now();st.records[cfg.id]=r;localStorage.setItem(LOCAL_KEY,JSON.stringify(st));fetch('/api/arcade/record',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({profileId:p.profileId,name:p.name,gameId:cfg.id,type:'score',score:n})}).catch(()=>{})}}if(!document.hidden&&Math.random()<.33)window.BFGNReaction?.()}).observe(el,{childList:true,subtree:true,characterData:true})}}
const ARCADE_HOW={
 'vanessas-pipe-problem':[['ROTATE','Tap a pipe to rotate it.'],['💧 → 🚚','Connect the pump to the grey GMC.'],['🟤 💦 ⚙','Clear clogs, leaks and stuck valves first.']],
 'logans-minefield':[['🏍️  ×  ×','One bike per row and column.'],['▦ 🏍️','One bike in every terrain region.'],['🏍️ ↔ 🏍️','Bikes may not touch, even diagonally.']],
 'nanas-goat-whack':[['🐐 +1','Hit the animals.'],['🐖 +2  🐔 +2','Pigs and chickens score more.'],['🧰 −5','Never hit the red toolbox.']],
 'space-shooter':[['🪨 +1','Catch rolling rocks with Kelsi.'],['✨ +3  💗 +5','Shiny and heart rocks are worth more.'],['🟤 −3','Avoid mud clumps.']],
};
function howSteps(){return ARCADE_HOW[cfg.id]||[['👆','Tap, drag or use the game controls to play.'],['⭐','Follow the highlighted goal on the game screen.'],['🏆','Complete the objective to win or set a high score.']]}
function showHowTo(){document.querySelector('.phase-w-how-overlay')?.remove();let i=0,steps=howSteps();const overlay=document.createElement('div');overlay.className='phase-w-how-overlay';overlay.innerHTML=`<div class="phase-w-how-card"><button class="phase-w-how-close">×</button><small>VISUAL HOW TO PLAY</small><h2>${cfg.name}</h2><div class="phase-w-how-demo"></div><p></p><footer><button data-how-prev>BACK</button><b></b><button data-how-next>NEXT</button></footer></div>`;const renderStep=()=>{const st=steps[i];overlay.querySelector('.phase-w-how-demo').textContent=st[0];overlay.querySelector('p').textContent=st[1];overlay.querySelector('footer b').textContent=`${i+1} / ${steps.length}`;overlay.querySelector('[data-how-prev]').disabled=i===0;overlay.querySelector('[data-how-next]').textContent=i===steps.length-1?'DONE':'NEXT'};overlay.querySelector('.phase-w-how-close').onclick=()=>overlay.remove();overlay.querySelector('[data-how-prev]').onclick=()=>{i=Math.max(0,i-1);renderStep()};overlay.querySelector('[data-how-next]').onclick=()=>{if(i===steps.length-1)return overlay.remove();i++;renderStep()};document.body.append(overlay);renderStep()}
window.BFGNShowHowToPlay=showHowTo;
function mountChrome(){
 document.body.classList.add('phase-w-arcade');
 document.body.dataset.arcadeGame=cfg.id;sceneLayer();
 const frame=document.createElement('div');frame.className='phase-w-frame';document.body.append(frame);
 const state=readJSON(LOCAL_KEY,{tokens:0,achievements:{},plays:{}}),p=profile();
 const status=document.createElement('div');status.className='phase-w-status';status.innerHTML=`<b>${state.tokens||0} TOKENS</b><span>${Object.keys(state.achievements||{}).length} BADGES</span><button type="button" data-how>HOW TO</button><button type="button" data-hub>HUB</button>`;status.querySelector('[data-how]').onclick=showHowTo;status.querySelector('[data-hub]').onclick=()=>location.href='/arcade-hub.html';document.body.append(status);
 if(cfg.person){const a=document.createElement('div');a.className='phase-w-avatar-stage';a.innerHTML=`<img src="${assetFor(cfg.person)}" alt="${cfg.name}"><strong>${cfg.name}</strong><small>PLAYABLE FAMILY ARCADE</small>`;document.body.append(a)}
 const reaction=document.createElement('div');reaction.className='phase-w-reaction';reaction.innerHTML=`<b>FAMILY REACTION</b><strong>${cfg.name}</strong><span>${cfg.reaction}</span>`;document.body.append(reaction);window.BFGNReaction=(message=cfg.reaction,title=cfg.name)=>{reaction.querySelector('strong').textContent=title;reaction.querySelector('span').textContent=message;reaction.classList.add('show');clearTimeout(window.__pwReact);window.__pwReact=setTimeout(()=>reaction.classList.remove('show'),1500)};
 const evt=activeEvent();if(evt){const ribbon=document.createElement('div');ribbon.className='phase-w-event-ribbon';ribbon.innerHTML=`<strong>LIVE EVENT</strong> · ${evt.name} · seasonal decorations active`;document.body.append(ribbon)}
 const q=document.createElement('div');q.className='phase-w-quality';q.innerHTML='<button data-q="low">PHONE</button><button data-q="high">RICH</button>';const qv=localStorage.getItem('bfgn_quality')||'phone';q.querySelector(`[data-q="${qv==='high'?'high':'low'}"]`)?.classList.add('active');q.onclick=e=>{const b=e.target.closest('button');if(!b)return;localStorage.setItem('bfgn_quality',b.dataset.q==='high'?'high':'phone');location.reload()};document.body.append(q);
 if((localStorage.getItem('bfgn_quality')||'phone')==='high'){const particles=document.createElement('div');particles.className='phase-w-particles';for(let i=0;i<16;i++){const d=document.createElement('i');d.style.setProperty('--x',`${Math.random()*100}%`);d.style.setProperty('--drift',`${Math.random()*90-45}px`);d.style.setProperty('--d',`${7+Math.random()*8}s`);d.style.animationDelay=`-${Math.random()*8}s`;particles.append(d)}document.body.append(particles)}
 syncServer(p,cfg.id).catch(()=>{});heartbeat(p,cfg).catch(()=>{});setInterval(()=>heartbeat(p,cfg).catch(()=>{}),20000);
 trackPlay(p,cfg.id);setTimeout(watchReactions,250);
}
function trackPlay(p,id){const s=readJSON(LOCAL_KEY,{tokens:0,achievements:{},plays:{},records:{}});const legacy=readJSON('bfgn_arcade_achievements_v1',{});s.achievements={...(legacy||{}),...(s.achievements||{})};s.plays=s.plays||{};s.plays[id]=(s.plays[id]||0)+1;if(s.plays[id]===1){s.tokens=(s.tokens||0)+5;s.achievements=s.achievements||{};s.achievements[`first:${id}`]={label:`First play: ${cfg.name}`,at:Date.now()};window.addEventListener('load',()=>setTimeout(()=>window.BFGNReaction?.('+5 Arcade Tokens · First Play','Achievement'),500),{once:true})}localStorage.setItem(LOCAL_KEY,JSON.stringify(s));fetch('/api/arcade/record',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({profileId:p.profileId,name:p.name,gameId:id,type:'play',tokenDelta:s.plays[id]===1?5:0,achievement:s.plays[id]===1?`first:${id}`:null,label:`First play: ${cfg.name}`})}).catch(()=>{})}
async function syncServer(p,id){const r=await fetch(`/api/arcade/profile?profileId=${encodeURIComponent(p.profileId)}`,{cache:'no-store'});if(!r.ok)return;const d=await r.json();if(!d.profile)return;const s=readJSON(LOCAL_KEY,{tokens:0,achievements:{},plays:{}});s.tokens=Math.max(Number(s.tokens||0),Number(d.profile.tokens||0));s.achievements={...(d.profile.achievements||{}),...(s.achievements||{})};localStorage.setItem(LOCAL_KEY,JSON.stringify(s))}
async function heartbeat(p,c){await fetch('/api/presence',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({profileId:p.profileId,name:p.name,avatar:p.avatar,gameId:c.id,gameName:c.name,path:location.pathname,joinable:false,mode:'solo'})})}
window.addEventListener('pagehide',()=>{const p=profile();navigator.sendBeacon?.('/api/presence',new Blob([JSON.stringify({profileId:p.profileId,action:'leave'})],{type:'application/json'}))});
mountChrome();
