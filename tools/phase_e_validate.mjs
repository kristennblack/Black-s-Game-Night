import {readFile,readdir,stat,access} from 'node:fs/promises';
import {existsSync} from 'node:fs';
import path from 'node:path';

const ROOT=process.cwd();
const PUBLIC=path.join(ROOT,'public');
const BUILD='GAME-NIGHT-STAGING-PHASE-T1-PROP-HUNT-HUNTER-RELEASE-COMBAT-19';
const failures=[];
const warnings=[];
const passes=[];
const pass=m=>passes.push(m);
const fail=m=>failures.push(m);
const warn=m=>warnings.push(m);
const text=async p=>readFile(path.join(ROOT,p),'utf8');
const exists=p=>existsSync(path.join(ROOT,p));

for(const p of ['public','public/index.html','public/new-games.html','public/island-life.html','public/app.js','public/prop-hunt-3d.js','public/island-life.js','public/birthday-climb.js','public/phase-e-qa.mjs','worker.mjs','threeNewGames.mjs','blackGammon.mjs','wrangler.jsonc','wrangler.staging.jsonc']){
  exists(p)?pass(`exists: ${p}`):fail(`missing: ${p}`);
}

const wrangler=await text('wrangler.jsonc');
for(const token of ['"directory":"./public"','"binding":"ASSETS"','"not_found_handling":"single-page-application"'])wrangler.includes(token)?pass(`wrangler: ${token}`):fail(`wrangler missing ${token}`);
for(const token of ['GameHub','PropHuntRoom','IslandLifeRoom'])wrangler.includes(token)?pass(`durable object: ${token}`):fail(`wrangler missing Durable Object ${token}`);
const stagingWrangler=await text('wrangler.staging.jsonc');
for(const token of ['"name": "black-family-game-night-phase-t1-staging"','"directory":"./public"','"binding":"ASSETS"','"not_found_handling":"single-page-application"'])stagingWrangler.includes(token)?pass(`staging wrangler: ${token}`):fail(`staging wrangler missing ${token}`);
for(const token of ['GameHub','PropHuntRoom','IslandLifeRoom'])stagingWrangler.includes(token)?pass(`staging durable object: ${token}`):fail(`staging wrangler missing Durable Object ${token}`);

const manifest=JSON.parse(await text('public/models/manifest.json'));
let modelCount=0;
for(const [category,items] of Object.entries(manifest)){
  if(category==='version'||!items||typeof items!=='object')continue;
  for(const [id,entry] of Object.entries(items)){
    if(!entry?.file)continue;
    modelCount++;
    const rel='public'+entry.file;
    if(!exists(rel)){fail(`manifest path missing/case mismatch: ${category}:${id} -> ${entry.file}`);continue}
    const b=await readFile(path.join(ROOT,rel));
    if(entry.file.endsWith('.glb')&&b.subarray(0,4).toString('ascii')!=='glTF')fail(`invalid GLB magic: ${entry.file}`); else pass(`manifest asset: ${entry.file}`);
  }
}
if(!modelCount)fail('no model files referenced by manifest');

const sourceExt=/\.(?:html?|m?js|css)$/i;
const assetExt=/\.(?:html?|m?js|css|json|webmanifest|png|jpe?g|webp|gif|svg|glb|gltf|bin|mp3|wav|ogg)(?:\?[^'"`\s)]+)?$/i;
const refs=new Set();
async function walk(dir){
  for(const ent of await readdir(dir,{withFileTypes:true})){
    const full=path.join(dir,ent.name);
    if(ent.isDirectory())await walk(full);
    else if(sourceExt.test(ent.name)){
      let s;try{s=await readFile(full,'utf8')}catch{continue}
      for(const m of s.matchAll(/['"`]\/(?!api\/)([^'"`\s)]+)['"`]/g)){
        const raw='/'+m[1];
        if(assetExt.test(raw)&&!raw.includes('${'))refs.add(raw.split('?')[0]);
      }
    }
  }
}
await walk(PUBLIC);
for(const ref of refs){
  const rel='public'+ref;
  exists(rel)?pass(`literal asset ref: ${ref}`):fail(`literal asset path missing/case mismatch: ${ref}`);
}

let textureCount=0,glbCount=0,jsCount=0;
async function counts(dir){
  for(const ent of await readdir(dir,{withFileTypes:true})){
    const full=path.join(dir,ent.name);
    if(ent.isDirectory())await counts(full); else {
      if(/\.(?:png|jpe?g|webp)$/i.test(ent.name))textureCount++;
      if(/\.glb$/i.test(ent.name))glbCount++;
      if(/\.(?:m?js)$/i.test(ent.name))jsCount++;
    }
  }
}
await counts(PUBLIC);
textureCount?pass(`textures present: ${textureCount}`):fail('no texture/image files found');
glbCount?pass(`GLBs present: ${glbCount}`):fail('no GLBs found');
jsCount?pass(`JavaScript modules present: ${jsCount}`):fail('no bundled/local JavaScript found');

const allPublic=[];
async function scanText(dir){for(const ent of await readdir(dir,{withFileTypes:true})){const full=path.join(dir,ent.name);if(ent.isDirectory())await scanText(full);else if(sourceExt.test(ent.name)){try{allPublic.push([path.relative(ROOT,full),await readFile(full,'utf8')])}catch{}}}}
await scanText(PUBLIC);
for(const [file,s] of allPublic){
  if(/file:\/\/|\/mnt\/data\/|[A-Za-z]:\\\\/.test(s))fail(`filesystem-only path in ${file}`);
}
const cdnHits=[];
for(const [file,s] of allPublic){
  if(/cdn\.jsdelivr\.net\/npm\/three@0\.185\.1/i.test(s))cdnHits.push(`${file}: Three.js`);
  if(/esm\.sh\/three@0\.185\.1/i.test(s))cdnHits.push(`${file}: Three addon`);
}
if(cdnHits.length)warn(`core 3D CDN dependency remains (${[...new Set(cdnHits)].join(', ')})`); else pass('no Three.js / addon runtime CDN references');

const app=await text('public/app.js'),sw=await text('public/sw.js'),idx=await text('public/index.html'),ng=await text('public/new-games.html'),il=await text('public/island-life.html');
const worker=await text('worker.mjs'),extra=await text('extraGames.mjs'),three=await text('threeNewGames.mjs'),black=await text('blackGammon.mjs'),styles=await text('public/styles.css'),studio=await text('public/shared-3d-studio.mjs'),prop3d=await text('public/prop-hunt-3d.js');
app.includes(BUILD)&&sw.includes('black-family-game-night-staging-phase-t1-prop-hunt-hunter-release-combat-19')&&idx.includes(BUILD)&&ng.includes(BUILD)&&il.includes(BUILD)?pass('staging cache/version markers are consistent'):fail('staging cache/version markers are inconsistent');
sw.includes('/phase-e-qa.mjs')?pass('staging diagnostics module precached'):fail('phase-e diagnostics missing from service worker shell');
app.includes("s.gameType===GAME.SMEAR")&&app.includes('YOUR 6-CARD HAND · REVIEW IT BEFORE YOU BID')?pass('Smear six-card hand is rendered during bidding'):fail('Smear bidding-hand presentation marker missing');
app.includes("PROFILE_KEY='gn_profile_v1'")&&app.includes('homeAvatarHubHTML')&&app.includes('Character → outfit → player colour')?pass('persistent Avatar Hub profile flow present'):fail('Avatar Hub profile flow incomplete');
app.includes("api('requests'")&&app.includes("api('leaderboard'")&&worker.includes("/api/requests")&&worker.includes("/api/leaderboard")?pass('Requests and shared Leaderboards routes/UI present'):fail('Requests/Leaderboards integration incomplete');
app.includes('KEEP PLAYING')&&app.includes('RETURN TO GAME SHELF')&&worker.includes("/api/rematch")?pass('shared room rematch/end-of-game flow present'):fail('shared room rematch/end-of-game flow incomplete');
extra.includes('TRAIL_HAND_SIZE=5')&&extra.includes('trailDrawTo')&&extra.includes('trailDiscardCard')&&app.includes('bindTrailBoardGestures')&&styles.includes('touch-action:none')?pass('Trail Trouble five-card hand and gesture board controls present'):fail('Trail Trouble Phase F markers incomplete');
studio.includes('applyPrimaryClothingColor')?pass('future authored GLB primary-clothing tint contract present'):fail('primary clothing tint contract missing');
for(const token of ["MEXICAN_TRAIN:'mexicantrain'","SKIP_BO:'skipbo'","BACKGAMMON:'backgammon'","BLACK_GAMMON:'blackgammon'"])(await text('gameEngine.mjs')).includes(token)?pass(`new game type: ${token}`):fail(`new game type missing: ${token}`);
extra.includes("from './threeNewGames.mjs'")&&extra.includes('THREE_NEW_META')?pass('three new games are integrated through the shared extra-game adapter'):fail('three-new-game adapter integration missing');
three.includes('createDouble12Set')&&three.includes('roundCount:3')&&three.includes('unresolvedDouble')?pass('Mexican Train Double-12, three-round and double-obligation engine present'):fail('Mexican Train engine markers incomplete');
three.includes('createSkipBoDeck')&&three.includes('builds:[[],[],[],[]]')&&three.includes('discards[id]=[[],[],[],[]]')&&three.includes('Stock Pile cleared')?pass('Skip-Bo Stock, four Discard, four Building and win engine present'):fail('Skip-Bo engine markers incomplete');
three.includes('bgLegalSequences')&&three.includes('bgCanBear')&&three.includes('pendingDouble')&&three.includes("kind='backgammon'")?pass('Backgammon legal-sequence, bar/bear-off and cube scoring engine present'):fail('Backgammon engine markers incomplete');
black.includes('BLACK_GAMMON_BIG_DIE_VALUES')&&black.includes('blackAllocationPlans')&&black.includes('blackLegalMoves')&&black.includes('riskDue')&&black.includes('overDue')?pass('Black Gammon shared-dice, direction, rescue and overstack engine present'):fail('Black Gammon engine markers incomplete');
app.includes('blackGammonBoard')&&app.includes('BLUE · FORWARD')&&app.includes('RED · BACKWARD')&&app.includes('GOLD · RESCUE')?pass('Black Gammon board and direction/rescue UI present'):fail('Black Gammon UI markers incomplete');
app.includes("botDifficultyOptions(current='easy')")&&worker.includes("makeBot(room,difficulty='easy'")&&styles.includes('#fff7e5')?pass('Easy-first readable bot selector contract present'):fail('Easy-first bot selector contract incomplete');
app.includes('--die-color')&&styles.includes('.die[style*="--die-color"]')?pass('player-colour dice presentation present for Backgammon family'):fail('player-colour dice presentation missing');
for(const token of ['mexican-train-table','skipbo-table','backgammon-table','mt-open-avatar-marker','mt-score-sheet'])app.includes(token)?pass(`new tabletop UI: ${token}`):fail(`new tabletop UI marker missing: ${token}`);
for(const token of ['.domino-tile','.skipbo-card','.bg-board','.bg-checker-stack','.bg-cube'])styles.includes(token)?pass(`new tabletop styling: ${token}`):fail(`new tabletop styling missing: ${token}`);

// Phase R focused gates: Prop Hunt P2 + screen-first Gammon UX.
app.includes('function gammonGameplay')&&app.includes('[GAME.BACKGAMMON,GAME.BLACK_GAMMON].includes(s.gameType)')?pass('Phase R dedicated Gammon gameplay route present'):fail('Phase R dedicated Gammon gameplay route missing');
styles.includes('.gammon-focus-surface')&&styles.includes('.gammon-board-viewport')?pass('Phase R screen-first Gammon layout styles present'):fail('Phase R Gammon layout styles missing');
styles.includes('.three-new-roster>div>span:before{display:none!important;content:none!important}')?pass('Phase R vertical roster-line artifact disabled at source'):fail('Phase R roster-line artifact cleanup missing');
app.includes("['bgOpeningRoll','bgRoll','blackRoll','blackBigRoll'].includes(a.action)")&&app.includes('const fresh=await fetchState(session.roomId,session.playerToken);setRoomState(fresh);refreshed=true')&&app.includes('if(refreshed)render()')?pass('Phase R roll actions explicitly refresh visible room state'):fail('Phase R roll refresh contract missing');
manifest.characters?.john?.phase==='P2'&&manifest.characters?.john?.flagshipBenchmark==='PH-CHAR-01-P2'&&manifest.characters?.john?.animations?.length===19?pass('Phase R John P2 benchmark metadata and 19-clip contract present'):fail('Phase R John P2 benchmark contract incomplete');
prop3d.includes('P2 fireplace glow')&&prop3d.includes('P2 shop work-bay fill')&&prop3d.includes('P2 barn soft fill')?pass('Phase R Papa Shop local benchmark lighting present'):fail('Phase R Papa Shop benchmark lighting missing');
if(exists('MASTER_NEXT_BUILD_DEVELOPMENT_DIRECTIVE.md')){const directive=await text('MASTER_NEXT_BUILD_DEVELOPMENT_DIRECTIVE.md');directive.includes('Prop Hunt P2 Character & Animation Visual Gate')&&directive.includes('Critical dice-roll fix')?pass('Phase R governing next-build directive packaged'):fail('Phase R directive missing required focus');}else fail('Phase R governing next-build directive missing');

// Phase S focused gates: gameplay blockers + tabletop realism.
three.includes("src.kind==='stock'")&&three.includes('Stock Pile cleared')&&app.includes('STOCK · PLAY THIS TOP CARD')&&app.includes('skipbo-valid-target')?pass('Phase S Skip-Bo Stock source and direct destination UI present'):fail('Phase S Skip-Bo Stock source/direct play contract incomplete');
app.includes('cribPhysicalBoard')&&app.includes('cribPhysicalPeg')&&app.includes('runCribPegAnimation')&&app.includes('Array.from({length:121}')&&styles.includes('.crib-physical-board')&&styles.includes('.crib-real-hole')?pass('Phase S shared physical Cribbage board, holes and peg animation present'):fail('Phase S Cribbage physical board contract incomplete');
app.includes('haven-route-target')&&app.includes("e.phase==='setupRoute'")&&styles.includes('.haven-route-target')?pass('Phase S Last Haven setup Route has large direct touch targets'):fail('Phase S Last Haven Route touch target missing');
app.includes('function marblesGameplay')&&app.includes('if(s.gameType===GAME.MARBLES)return marblesGameplay')&&styles.includes('.marbles-focus-layout')?pass('Phase S Marbles board-first route present'):fail('Phase S Marbles board-first route missing');
app.includes('function bidRoundContext')&&app.includes('bid-round-context')&&styles.includes('.bid-round-context')?pass('Phase S trick-bidding hand/trump context present'):fail('Phase S trick-bidding context missing');
styles.includes('/* Backgammon / Black Gammon: premium physical wood treatment. */')&&styles.includes('.gammon-focus-surface .bg-checker-stack i')?pass('Phase S dimensional wood/checker treatment present for Gammon boards'):fail('Phase S Gammon realism treatment missing');
if(exists('MASTER_PHASE_S_GAMEPLAY_TABLETOP_REALISM_DIRECTIVE.md')){const directive=await text('MASTER_PHASE_S_GAMEPLAY_TABLETOP_REALISM_DIRECTIVE.md');directive.includes('Skip-Bo should finally play around the Stock Pile')&&directive.includes('Cribbage should feel like a real wooden cribbage game')?pass('Phase S governing directive packaged'):fail('Phase S directive missing required final goals');}else fail('Phase S governing directive missing');

// Phase T focused gates: Prop Hunt P3 gameplay + animation feel.
const gameplay3d=await text('public/shared-3d-gameplay.mjs'),studio3d=await text('public/shared-3d-studio.mjs'),propCore=await text('public/prop-hunt-core.mjs'),propCss=await text('public/prop-hunt-3d.css');
gameplay3d.includes('export function movementRelativeToFacing')&&gameplay3d.includes('export function resolveDirectionalLocomotion')&&gameplay3d.includes("semantic:'backward'")&&gameplay3d.includes("'strafeLeft':'strafeRight'")?pass('Phase T directional locomotion resolver present'):fail('Phase T directional locomotion resolver incomplete');
gameplay3d.includes("return 'hardLand'")&&prop3d.includes('_hardLandTimer')&&prop3d.includes('_landingStrength')?pass('Phase T impact-driven hard-land state present'):fail('Phase T hard-land contract missing');
studio3d.includes('directionalAimLocomotion:true')&&studio3d.includes('reverseBackpedalPlayback:true')&&studio3d.includes('timeScale<0')?pass('Phase T layered directional aim and reverse backpedal playback present'):fail('Phase T directional authored animation contract incomplete');
prop3d.includes('resolveDirectionalLocomotion(a,{aiming')&&prop3d.includes('targetYaw=aiming?game.cameraYaw:movingIntent?Math.atan2(intent.directionX,-intent.directionZ):a.yaw')&&prop3d.includes("const aiming=a.role==='hunter'")&&!prop3d.includes('id=\"phAim\"')?pass('Phase T/T1 hider travel-facing and hunter crosshair-facing behavior present'):fail('Phase T/T1 actor-facing contract incomplete');
prop3d.includes('spawnTransformBurst')&&prop3d.includes('spawnPlacementRing')&&prop3d.includes('spawnFlashBurst')&&prop3d.includes('_propTransform')?pass('Phase T disguise, decoy and flash feedback present'):fail('Phase T hider feedback contract incomplete');
prop3d.includes("SPECTATING ·")&&prop3d.includes('cycleSpectate')&&prop3d.includes("#phSpectate")&&prop3d.includes('showDamage')&&propCss.includes('.ph3d-damage')?pass('Phase T damage and Classic spectator flow present'):fail('Phase T damage/spectator contract incomplete');
prop3d.includes("`PROP ${a.propChanges}")&&prop3d.includes("`DECOY ${a.decoys}")&&prop3d.includes("a.flash?'FLASH ✓':'FLASH ×'")?pass('Phase T compact hider resource HUD present'):fail('Phase T hider resource HUD missing');
propCore.includes("'backward'")&&propCore.includes("'strafeLeft'")&&propCore.includes("'strafeRight'")&&propCore.includes("'hardLand'")?pass('Phase T network animation whitelist accepts new locomotion semantics'):fail('Phase T Prop Hunt snapshot animation whitelist incomplete');
if(exists('MASTER_PHASE_T_PROP_HUNT_P3_GAMEPLAY_ANIMATION_DIRECTIVE.md')){const directive=await text('MASTER_PHASE_T_PROP_HUNT_P3_GAMEPLAY_ANIMATION_DIRECTIVE.md');directive.includes('movement, aiming, jumping, mantling, shooting and disguising should feel like a real third-person game rather than a technical demo')&&directive.includes('Preservation of Phase S tabletop work')?pass('Phase T governing gameplay/animation directive packaged'):fail('Phase T directive missing required focus/preservation');}else fail('Phase T governing gameplay/animation directive missing');
if(exists('PHONE_QA_PHASE_T_PROP_HUNT_P3_GAMEPLAY_ANIMATION_18.md')){const qa=await text('PHONE_QA_PHASE_T_PROP_HUNT_P3_GAMEPLAY_ANIMATION_18.md');qa.includes('Aim + backpedal')&&qa.includes('Classic mode: eliminated hider enters spectator view')?pass('Phase T real-device gameplay QA checklist packaged'):fail('Phase T phone QA checklist incomplete');}else fail('Phase T phone QA checklist missing');

// Phase T1 focused gates: protected hide phase + simplified hunter combat controls.
prop3d.includes('phHideBlind')&&prop3d.includes('HIDERS ARE HIDING')&&propCss.includes('.ph3d-hide-blind')&&propCss.includes('background:#000')?pass('Phase T1 opaque hunter hide countdown present'):fail('Phase T1 hunter hide overlay missing');
prop3d.includes('isHunterHidePhase')&&prop3d.includes("a.vx=a.vz=a.vy=0")&&prop3d.includes('if(!blindHunter)gameplay.applyGamepadLook')?pass('Phase T1 hunter movement/look freeze during hide present'):fail('Phase T1 hide-phase control freeze incomplete');
prop3d.includes('HUNTER_FIRE_INTERVAL=1/4.8')&&prop3d.includes('(input.shoot||game.padShoot)')&&prop3d.includes('shootBtn.onpointerdown=startFire')&&!prop3d.includes('id=\"phAim\"')?pass('Phase T1 hold-to-rapid-fire and no-Aim control contract present'):fail('Phase T1 rapid-fire/no-Aim contract incomplete');
const propRoom=await text('propHuntRoom.mjs');
propRoom.includes("hideFromHunter=this.room.phase==='hide'&&viewer?.role==='hunter'")&&propRoom.includes('maskHide:hideFromHunter')&&propRoom.includes('hideFromHuntersDuringHide')&&propRoom.includes("action==='hit'&&this.room.phase==='hunt'")?pass('Phase T1 server privacy and hide-phase invulnerability contract present'):fail('Phase T1 server hide-phase protection incomplete');
if(exists('MASTER_PHASE_T1_PROP_HUNT_HUNTER_RELEASE_COMBAT_DIRECTIVE.md')){const directive=await text('MASTER_PHASE_T1_PROP_HUNT_HUNTER_RELEASE_COMBAT_DIRECTIVE.md');directive.includes('HIDERS ARE HIDING')&&directive.includes('Hold SHOOT')&&directive.includes('no separate Aim button')?pass('Phase T1 governing directive packaged'):fail('Phase T1 governing directive incomplete');}else fail('Phase T1 governing directive missing');
if(exists('PHONE_QA_PHASE_T1_PROP_HUNT_HUNTER_RELEASE_COMBAT_19.md')){const qa=await text('PHONE_QA_PHASE_T1_PROP_HUNT_HUNTER_RELEASE_COMBAT_19.md');qa.includes('Hunter view is fully black')&&qa.includes('Hold SHOOT')?pass('Phase T1 real-device QA checklist packaged'):fail('Phase T1 phone QA checklist incomplete');}else fail('Phase T1 phone QA checklist missing');

const wranglerBin=path.join(ROOT,'node_modules','.bin','wrangler');
if(existsSync(wranglerBin))pass('Wrangler executable available for deployment smoke test'); else warn('Wrangler executable unavailable: actual Cloudflare deployment remains UNVERIFIED');

console.log(`PLATFORM STAGING BUILD VALIDATION - ${BUILD}`);
for(const p of passes)console.log(`PASS ${p}`);
for(const w of warnings)console.log(`WARN ${w}`);
for(const f of failures)console.log(`FAIL ${f}`);
console.log(`SUMMARY: ${passes.length} pass, ${warnings.length} warning, ${failures.length} fail`);
if(failures.length)process.exitCode=1;
