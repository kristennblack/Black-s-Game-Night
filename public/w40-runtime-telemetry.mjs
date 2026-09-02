/*
 * Black Family Game Night - W40 runtime truth overlay
 * Makes the actual loaded renderer/assets/fallbacks visible during QA.
 */
export const W40_BUILD_ID='GAME-NIGHT-STAGING-CANDIDATE-W40-EXTERNAL-ASSET-PIPELINE-59';
export const W40_TELEMETRY_VERSION='W40.1';

const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const fmt=n=>Number.isFinite(n)?Number(n).toLocaleString():'--';
const deg=r=>Number.isFinite(r)?(r*180/Math.PI).toFixed(1):'--';

function materialList(mesh){return Array.isArray(mesh?.material)?mesh.material:[mesh?.material].filter(Boolean)}
export function collectSceneStats(scene){
  const out={meshes:0,visibleMeshes:0,triangles:0,materials:0,texturedMaterials:0,maps:0,normalMaps:0,roughnessMaps:0,metalnessMaps:0,aoMaps:0,skinnedMeshes:0,productionMeshes:0,legacyMeshes:0,collisionOnlyMeshes:0};
  const mats=new Set();
  scene?.traverse?.(o=>{
    if(!o?.isMesh)return;out.meshes++;if(o.visible!==false)out.visibleMeshes++;if(o.isSkinnedMesh)out.skinnedMeshes++;
    const g=o.geometry,count=g?.index?.count||g?.attributes?.position?.count||0;out.triangles+=Math.floor(count/3);
    const ud=o.userData||{};
    if(ud.w35AuthoredVisual||ud.w36Promoted||ud.w40ExternalCandidate)out.productionMeshes++;
    if(ud.w36MaterialUpgraded||ud.w40LegacyFallback)out.legacyMeshes++;
    if(ud.w35GameplayOnly||ud.w35CollisionOnly)out.collisionOnlyMeshes++;
    for(const m of materialList(o)){
      if(!m)continue;mats.add(m);let textured=false;
      for(const key of ['map','normalMap','roughnessMap','metalnessMap','aoMap'])if(m[key]){textured=true;if(key==='map')out.maps++;else if(key==='normalMap')out.normalMaps++;else if(key==='roughnessMap')out.roughnessMaps++;else if(key==='metalnessMap')out.metalnessMaps++;else if(key==='aoMap')out.aoMaps++}
      if(textured)out.texturedMaterials++;
    }
  });
  out.materials=mats.size;return out;
}

function worldAssetStatus(game){
  const w=game?.world||{},heroes=w.productionHeroes||{};
  const hero={};for(const [k,v] of Object.entries(heroes))hero[k]=!!v;
  return {
    visualStatus:w.w40VisualStatus||w.w35VisualStatus||'legacy/full-world',
    environment:!!w.productionEnvironment,
    propSet:!!w.productionPropSet,
    hero,
    external:w.w40ExternalStatus||null,
    mapScale:w.metrics?.scaleMultiple||game?.world?.phaseW36Leapfrog&&8.31||1
  };
}
function playerAssetStatus(game){
  const a=game?.player;if(!a)return{source:'none'};
  const withheld=!!a.rig?.userData?.approvedModelWithheld,proxy=!!(a.devProxyModel||a.rig?.userData?.w35DevelopmentProxy),external=!!a.rig?.userData?.w40ExternalCandidate;
  return {
    person:a.person?.id||a.person?.name||'unknown',
    source:external?'W40 EXTERNAL GLB':a.authored?(proxy?'LEGACY GLB QA PROXY':'AUTHORED GLB'):'PROCEDURAL FALLBACK',
    approved:external?!!a.rig?.userData?.w40Approved:!!a.rig?.userData?.approvedModel,
    withheld,proxy,clips:a.rig?.userData?.authoredAnimations?.length||0,anim:a.anim||'idle'
  };
}

export function makeRuntimeTelemetry({root=document.body,getGame=()=>null,enabled=true}={}){
  if(!enabled||typeof document==='undefined')return{update(){},dispose(){}};
  let el=document.getElementById('w40RuntimeTruth');
  if(!el){
    el=document.createElement('aside');el.id='w40RuntimeTruth';el.setAttribute('aria-label','W40 runtime asset truth');
    el.style.cssText='position:absolute;left:10px;top:10px;z-index:80;max-width:min(420px,calc(100% - 20px));background:rgba(8,10,12,.92);color:#f5ead7;border:1px solid rgba(255,219,154,.42);border-radius:10px;padding:9px 11px;font:11px/1.35 ui-monospace,SFMono-Regular,Consolas,monospace;white-space:pre-wrap;pointer-events:none;box-shadow:0 8px 24px rgba(0,0,0,.28)';
    (root||document.body).appendChild(el);
  }
  let last=0;
  function update(force=false){
    const now=performance.now();if(!force&&now-last<450)return;last=now;const g=getGame();if(!g){el.textContent=`W40 RUNTIME TRUTH\nBUILD ${W40_BUILD_ID}\nWaiting for game...`;return}
    const s=collectSceneStats(g.scene),w=worldAssetStatus(g),p=playerAssetStatus(g),c=g.cameraRig?.state||{},cfg=g.cameraRig?.cfg||{},renderer=g.renderer;
    const env=w.external?.environment||{};const props=w.external?.props||{};
    const cameraLine=`CAMERA d=${Number(g.cameraActualDistance||c.actualDistance||0).toFixed(2)}m pitch=${deg(c.pitch)}° FOV=${Number(g.camera?.fov||0).toFixed(1)} targetH=${Number(cfg.cameraHeight||0).toFixed(2)}m`;
    const textureTotal=s.maps+s.normalMaps+s.roughnessMaps+s.metalnessMaps+s.aoMaps;
    const warn=[];
    if(p.source.includes('FALLBACK')||p.proxy)warn.push('CHARACTER NOT FINAL');
    if(!w.environment)warn.push('AUTHORED ENVIRONMENT NOT ACTIVE');
    if(textureTotal<5)warn.push('VERY LOW PBR MAP COVERAGE');
    if(c.pitch>.18)warn.push('CAMERA TOO HIGH');
    el.textContent=[
      'W40 RUNTIME TRUTH',
      `BUILD ${W40_BUILD_ID}`,
      `RENDERER ${renderer?.isWebGLRenderer?'WebGL':'unknown'} · DPR ${Number(renderer?.getPixelRatio?.()||1).toFixed(2)} · quality ${g.qualityTier||'--'}`,
      `CHAR ${p.person} · ${p.source} · clips ${p.clips} · anim ${p.anim}`,
      `CHAR approval ${p.approved?'APPROVED':'NOT APPROVED'}${p.withheld?' · approved replacement withheld':''}`,
      `WORLD ${w.visualStatus} · env ${w.environment?'AUTHORED':'FALLBACK'} · propSet ${w.propSet?'AUTHORED':'FALLBACK'} · map x${w.mapScale}`,
      `W40 incoming env ${env.state||'not-present'} · props ${props.state||'not-present'}`,
      `LIGHTING HDRI ${g.w40EnvironmentLighting?.state||'not-attempted'} · ${g.w40EnvironmentLighting?.asset||'Small Workshop'}`,
      cameraLine,
      `SCENE ${fmt(s.visibleMeshes)} visible meshes · ${fmt(s.triangles)} tris · ${fmt(s.materials)} materials · ${fmt(s.skinnedMeshes)} skinned`,
      `PBR maps base ${s.maps} · normal ${s.normalMaps} · rough ${s.roughnessMaps} · metal ${s.metalnessMaps} · AO ${s.aoMaps}`,
      `VISUAL tiers production ${s.productionMeshes} · legacy ${s.legacyMeshes} · collision-only ${s.collisionOnlyMeshes}`,
      warn.length?`STATUS ⚠ ${warn.join(' | ')}`:'STATUS ✓ no obvious fallback warning'
    ].join('\n');
    try{window.__W40_RUNTIME_TRUTH__={build:W40_BUILD_ID,player:p,world:w,camera:{distance:g.cameraActualDistance||c.actualDistance,pitch:c.pitch,fov:g.camera?.fov},scene:s,warnings:warn}}catch{}
  }
  function dispose(){el?.remove();el=null}
  return{update,dispose,element:el};
}
