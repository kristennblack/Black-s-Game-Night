export const LEGACY_STAGING_BUILD_ID='GAME-NIGHT-STAGING-PHASE-T1-PROP-HUNT-HUNTER-RELEASE-COMBAT-19';
export const STAGING_BUILD_ID='GAME-NIGHT-STAGING-PHASE-W23-CATALOG-FIT-ACCESSORIES-45';
export const STAGING_APP_VERSION='3.20.0-staging-phase-w22-catalog-approval-studio-44';
// Historical QA lineage: 3.4.0-staging-phase-s-gameplay-tabletop-realism-17

const fmt=n=>Number.isFinite(Number(n))?Number(n).toFixed(2):'n/a';
const vec=v=>v?`${fmt(v.x)}, ${fmt(v.y)}, ${fmt(v.z)}`:'n/a';

function ensureStyle(){
  if(typeof document==='undefined'||document.getElementById('g3d-phase-e-style'))return;
  const style=document.createElement('style');style.id='g3d-phase-e-style';style.textContent=`
  .g3d-staging-badge{position:absolute;top:7px;left:50%;transform:translateX(-50%);z-index:78;pointer-events:none;padding:4px 8px;border:1px solid #ffffff42;border-radius:999px;background:#10120ed9;color:#f0df9f;font:800 8px/1.15 ui-monospace,SFMono-Regular,Consolas,monospace;letter-spacing:.035em;white-space:nowrap;box-shadow:0 3px 12px #0008;opacity:.72}
  .g3d-qa-toggle{position:absolute;top:32px;left:50%;transform:translateX(-50%);z-index:79;border:1px solid #ffffff42;border-radius:999px;background:#12140fe8;color:#fff;padding:6px 9px;font:900 9px/1 system-ui,sans-serif;letter-spacing:.06em;touch-action:manipulation}
  .g3d-qa-panel{position:absolute;top:65px;left:50%;transform:translateX(-50%);z-index:80;width:min(390px,calc(100% - 18px));max-height:48%;overflow:auto;padding:9px 10px;border:1px solid #ffffff3b;border-radius:12px;background:#0d0f0ceb;color:#f6f4ed;box-shadow:0 12px 32px #000a;backdrop-filter:blur(8px);font:700 10px/1.32 ui-monospace,SFMono-Regular,Consolas,monospace;white-space:pre-wrap;pointer-events:auto}
  .g3d-qa-panel[hidden]{display:none}.g3d-dev-warning{position:absolute;top:64px;left:50%;transform:translateX(-50%);z-index:81;width:min(420px,calc(100% - 18px));padding:7px 9px;border:1px solid #f0b06088;border-radius:10px;background:#321c12ed;color:#ffe4c2;font:800 9px/1.3 system-ui,sans-serif;box-shadow:0 8px 22px #0009}.g3d-dev-warning[hidden]{display:none}
  .g3d-zoom-stack{position:absolute;z-index:25;display:flex;flex-direction:column;gap:6px}.g3d-zoom-stack button{min-width:34px;min-height:34px;border:1px solid #ffffff35;border-radius:12px;background:#11130ed9;color:#fff;font:900 17px/1 system-ui,sans-serif;box-shadow:0 6px 16px #0007;touch-action:manipulation}
  .g3d-phase-e-stage,.g3d-phase-e-stage canvas{touch-action:none!important;overscroll-behavior:none!important;-webkit-user-select:none!important;user-select:none!important;-webkit-touch-callout:none!important}
  @media(max-width:700px){.g3d-staging-badge{font-size:7px;top:5px}.g3d-zoom-stack button{min-width:32px;min-height:32px}.g3d-qa-toggle{top:27px;padding:5px 8px}.g3d-qa-panel{top:56px;max-height:44%}.g3d-dev-warning{top:57px}}
  `;document.head.appendChild(style);
}

export function installInteractionGuards(stage){
  if(!stage)return()=>{};ensureStyle();stage.classList.add('g3d-phase-e-stage');
  const prevent=e=>{if(stage.contains(e.target))e.preventDefault()};
  const opts={passive:false};
  stage.addEventListener('gesturestart',prevent,opts);stage.addEventListener('gesturechange',prevent,opts);stage.addEventListener('gestureend',prevent,opts);
  stage.addEventListener('contextmenu',prevent);stage.addEventListener('selectstart',prevent);stage.addEventListener('dragstart',prevent);
  return()=>{stage.classList.remove('g3d-phase-e-stage');stage.removeEventListener('gesturestart',prevent,opts);stage.removeEventListener('gesturechange',prevent,opts);stage.removeEventListener('gestureend',prevent,opts);stage.removeEventListener('contextmenu',prevent);stage.removeEventListener('selectstart',prevent);stage.removeEventListener('dragstart',prevent)};
}

export function emitAssetIssue(detail={}){
  const issue={at:new Date().toISOString(),asset:detail.asset||detail.file||detail.id||'unknown asset',file:detail.file||null,category:detail.category||null,id:detail.id||null,error:String(detail.error?.message||detail.error||detail.message||'Asset loading failed'),fallbackUsed:!!detail.fallbackUsed,kind:detail.kind||'asset-load'};
  console.error('[3D STAGING ASSET WARNING]',issue);
  if(typeof window!=='undefined')window.dispatchEvent(new CustomEvent('bfg:3d-asset-warning',{detail:issue}));
  return issue;
}

export function mountStagingDiagnostics(host,{gameName='3D Game',getSnapshot=()=>({}),open=false}={}){
  if(typeof document==='undefined'||!host)return{update(){},warnAsset:emitAssetIssue,setRecovery(){},dispose(){},lastAssetError:null,lastRecoveryReason:'none'};
  ensureStyle();
  const qaMode=!!open||(typeof location!=='undefined'&&new URLSearchParams(location.search).get('qa3d')==='1');
  const badge=document.createElement('div');badge.className='g3d-staging-badge no-look';badge.textContent=STAGING_BUILD_ID;host.appendChild(badge);
  const button=document.createElement('button');button.type='button';button.className='g3d-qa-toggle no-look';button.textContent='QA';button.setAttribute('aria-label','Toggle staging diagnostics');button.hidden=!qaMode;host.appendChild(button);
  const panel=document.createElement('pre');panel.className='g3d-qa-panel no-look';panel.hidden=!qaMode;host.appendChild(panel);
  const warning=document.createElement('div');warning.className='g3d-dev-warning no-look';warning.hidden=true;host.appendChild(warning);
  let lastAssetError=null,lastRecoveryReason='none',lastUpdate=0,frames=0,fps=0,fpsAccum=0;
  button.onclick=()=>{if(!qaMode)return;panel.hidden=!panel.hidden;if(panel.hidden)warning.hidden=true};
  const onAsset=e=>{lastAssetError=e.detail||null;if(!qaMode)return;warning.textContent=`DEV ASSET WARNING: ${lastAssetError?.file||lastAssetError?.asset||'unknown'} | fallback used: ${lastAssetError?.fallbackUsed?'YES':'NO'} | ${lastAssetError?.error||''}`;warning.hidden=false;setTimeout(()=>{warning.hidden=true},9000)};
  window.addEventListener('bfg:3d-asset-warning',onAsset);
  function warnAsset(detail){return emitAssetIssue(detail)}
  function setRecovery(reason){if(reason)lastRecoveryReason=String(reason)}
  function update(dt=0,now=performance.now()){
    if(dt>0){frames++;fpsAccum+=dt;if(fpsAccum>=.75){fps=frames/fpsAccum;frames=0;fpsAccum=0}}
    if(panel.hidden)return;if(now-lastUpdate<180)return;lastUpdate=now;
    const s=getSnapshot?.()||{},cam=s.camera||{},player=s.player||{},rig=s.cameraRig||{};
    if(rig.lastRecoveryReason&&rig.lastRecoveryReason!==lastRecoveryReason)lastRecoveryReason=rig.lastRecoveryReason;
    const lines=[
      `Game: ${s.game||gameName}`,
      `Build: ${STAGING_BUILD_ID}`,
      `Character: ${s.character||'n/a'}`,
      `Map: ${s.map||'n/a'}`,
      `Player XYZ: ${vec(player)}`,
      `Ground height: ${fmt(s.groundHeight)}`,
      `Camera XYZ: ${vec(cam)}`,
      `Camera-to-player: ${fmt(s.cameraDistance)}`,
      `Desired zoom: ${fmt(s.desiredZoom)}`,
      `Actual zoom: ${fmt(s.actualZoom)}`,
      `Camera pitch: ${fmt(s.cameraPitch)}`,
      `Camera obstruction: ${s.cameraObstructed?'YES':'NO'}${Number.isFinite(rig.lastSolveRatio)?` (${fmt(rig.lastSolveRatio)})`:''}`,
      `Animation: ${s.animation||'n/a'}`,
      `Movement: ${s.movement||'n/a'}`,
      `FPS: ${fps?fps.toFixed(1):'warming up'}`,
      `Last recovery: ${lastRecoveryReason}`,
      `Last asset error: ${lastAssetError?`${lastAssetError.file||lastAssetError.asset} | fallback=${lastAssetError.fallbackUsed?'YES':'NO'} | ${lastAssetError.error}`:'none'}`
    ];panel.textContent=lines.join('\n');
  }
  update(0,0);
  return{update,warnAsset,setRecovery,get lastAssetError(){return lastAssetError},get lastRecoveryReason(){return lastRecoveryReason},dispose(){window.removeEventListener('bfg:3d-asset-warning',onAsset);badge.remove();button.remove();panel.remove();warning.remove()}};
}

export function mountZoomButtons(host,cameraRig,{top='108px',right='12px'}={}){
  if(typeof document==='undefined'||!host||!cameraRig)return()=>{};ensureStyle();
  const wrap=document.createElement('div');wrap.className='g3d-zoom-stack no-look';wrap.style.top=top;wrap.style.right=right;wrap.innerHTML='<button type="button" data-g3d-zoom-in aria-label="Zoom in">+</button><button type="button" data-g3d-zoom-out aria-label="Zoom out">−</button>';host.appendChild(wrap);
  wrap.querySelector('[data-g3d-zoom-in]').onclick=()=>cameraRig.zoom(-.45);wrap.querySelector('[data-g3d-zoom-out]').onclick=()=>cameraRig.zoom(.45);
  return()=>wrap.remove();
}
