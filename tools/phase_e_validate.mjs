import {readFile,readdir,stat,access} from 'node:fs/promises';
import {existsSync} from 'node:fs';
import path from 'node:path';

const ROOT=process.cwd();
const PUBLIC=path.join(ROOT,'public');
const BUILD='GAME-NIGHT-STAGING-PHASE-O-REALISTIC-ACTIONS-12';
const failures=[];
const warnings=[];
const passes=[];
const pass=m=>passes.push(m);
const fail=m=>failures.push(m);
const warn=m=>warnings.push(m);
const text=async p=>readFile(path.join(ROOT,p),'utf8');
const exists=p=>existsSync(path.join(ROOT,p));

for(const p of ['public','public/index.html','public/new-games.html','public/island-life.html','public/app.js','public/prop-hunt-3d.js','public/island-life.js','public/birthday-climb.js','public/phase-e-qa.mjs','worker.mjs','threeNewGames.mjs','wrangler.jsonc','wrangler.staging.jsonc']){
  exists(p)?pass(`exists: ${p}`):fail(`missing: ${p}`);
}

const wrangler=await text('wrangler.jsonc');
for(const token of ['"directory":"./public"','"binding":"ASSETS"','"not_found_handling":"single-page-application"'])wrangler.includes(token)?pass(`wrangler: ${token}`):fail(`wrangler missing ${token}`);
for(const token of ['GameHub','PropHuntRoom','IslandLifeRoom'])wrangler.includes(token)?pass(`durable object: ${token}`):fail(`wrangler missing Durable Object ${token}`);
const stagingWrangler=await text('wrangler.staging.jsonc');
for(const token of ['"name": "black-family-game-night-phase-o-staging"','"directory":"./public"','"binding":"ASSETS"','"not_found_handling":"single-page-application"'])stagingWrangler.includes(token)?pass(`staging wrangler: ${token}`):fail(`staging wrangler missing ${token}`);
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
const worker=await text('worker.mjs'),extra=await text('extraGames.mjs'),three=await text('threeNewGames.mjs'),styles=await text('public/styles.css'),studio=await text('public/shared-3d-studio.mjs');
app.includes(BUILD)&&sw.includes('black-family-game-night-staging-phase-o-realistic-actions-12')&&idx.includes(BUILD)&&ng.includes(BUILD)&&il.includes(BUILD)?pass('staging cache/version markers are consistent'):fail('staging cache/version markers are inconsistent');
sw.includes('/phase-e-qa.mjs')?pass('staging diagnostics module precached'):fail('phase-e diagnostics missing from service worker shell');
app.includes("s.gameType===GAME.SMEAR")&&app.includes('YOUR 6-CARD HAND · REVIEW IT BEFORE YOU BID')?pass('Smear six-card hand is rendered during bidding'):fail('Smear bidding-hand presentation marker missing');
app.includes("PROFILE_KEY='gn_profile_v1'")&&app.includes('homeAvatarHubHTML')&&app.includes('Character → outfit → player colour')?pass('persistent Avatar Hub profile flow present'):fail('Avatar Hub profile flow incomplete');
app.includes("api('requests'")&&app.includes("api('leaderboard'")&&worker.includes("/api/requests")&&worker.includes("/api/leaderboard")?pass('Requests and shared Leaderboards routes/UI present'):fail('Requests/Leaderboards integration incomplete');
app.includes('KEEP PLAYING')&&app.includes('RETURN TO GAME SHELF')&&worker.includes("/api/rematch")?pass('shared room rematch/end-of-game flow present'):fail('shared room rematch/end-of-game flow incomplete');
extra.includes('TRAIL_HAND_SIZE=5')&&extra.includes('trailDrawTo')&&extra.includes('trailDiscardCard')&&app.includes('bindTrailBoardGestures')&&styles.includes('touch-action:none')?pass('Trail Trouble five-card hand and gesture board controls present'):fail('Trail Trouble Phase F markers incomplete');
studio.includes('applyPrimaryClothingColor')?pass('future authored GLB primary-clothing tint contract present'):fail('primary clothing tint contract missing');
for(const token of ["MEXICAN_TRAIN:'mexicantrain'","SKIP_BO:'skipbo'","BACKGAMMON:'backgammon'"])(await text('gameEngine.mjs')).includes(token)?pass(`new game type: ${token}`):fail(`new game type missing: ${token}`);
extra.includes("from './threeNewGames.mjs'")&&extra.includes('THREE_NEW_META')?pass('three new games are integrated through the shared extra-game adapter'):fail('three-new-game adapter integration missing');
three.includes('createDouble12Set')&&three.includes('roundCount:3')&&three.includes('unresolvedDouble')?pass('Mexican Train Double-12, three-round and double-obligation engine present'):fail('Mexican Train engine markers incomplete');
three.includes('createSkipBoDeck')&&three.includes('builds:[[],[],[],[]]')&&three.includes('discards[id]=[[],[],[],[]]')&&three.includes('Stock Pile cleared')?pass('Skip-Bo Stock, four Discard, four Building and win engine present'):fail('Skip-Bo engine markers incomplete');
three.includes('bgLegalSequences')&&three.includes('bgCanBear')&&three.includes('pendingDouble')&&three.includes("kind='backgammon'")?pass('Backgammon legal-sequence, bar/bear-off and cube scoring engine present'):fail('Backgammon engine markers incomplete');
for(const token of ['mexican-train-table','skipbo-table','backgammon-table','mt-open-avatar-marker','mt-score-sheet'])app.includes(token)?pass(`new tabletop UI: ${token}`):fail(`new tabletop UI marker missing: ${token}`);
for(const token of ['.domino-tile','.skipbo-card','.bg-board','.bg-checker-stack','.bg-cube'])styles.includes(token)?pass(`new tabletop styling: ${token}`):fail(`new tabletop styling missing: ${token}`);

const wranglerBin=path.join(ROOT,'node_modules','.bin','wrangler');
if(existsSync(wranglerBin))pass('Wrangler executable available for deployment smoke test'); else warn('Wrangler executable unavailable: actual Cloudflare deployment remains UNVERIFIED');

console.log(`PLATFORM STAGING BUILD VALIDATION - ${BUILD}`);
for(const p of passes)console.log(`PASS ${p}`);
for(const w of warnings)console.log(`WARN ${w}`);
for(const f of failures)console.log(`FAIL ${f}`);
console.log(`SUMMARY: ${passes.length} pass, ${warnings.length} warning, ${failures.length} fail`);
if(failures.length)process.exitCode=1;
