from pathlib import Path
import re
p=Path('/mnt/data/phase_u3_work/public/app.js')
s=p.read_text(encoding='utf-8')
s=s.replace("const APP_VERSION='GAME-NIGHT-STAGING-PHASE-T1-PROP-HUNT-HUNTER-RELEASE-COMBAT-19';","const APP_VERSION='GAME-NIGHT-STAGING-PHASE-U3-FAMILY-ARCADE-23';")
s=s.replace("/sw.js?v=GAME-NIGHT-STAGING-PHASE-T1-PROP-HUNT-HUNTER-RELEASE-COMBAT-19","/sw.js?v=GAME-NIGHT-STAGING-PHASE-U3-FAMILY-ARCADE-23")
block="""const arcadeGames={
  papapaddle:{name:"Papa's Paddle Battle",icon:'P',sub:'Defend Papa\'s Shop in a warm wood-and-ember paddle duel against Papa Bot',min:1,max:1,path:'/papas-paddle-battle.html'},
  gunnergoat:{name:"Gunner's Goat Run",icon:'G',sub:'Guide big goofy Gunner through farm traffic and creek logs to save the goats',min:1,max:1,path:'/gunners-goat-run.html'},
  johnshop:{name:"John's Shop Bomber",icon:'J',sub:'John clears runaway shop junk with family-safe spark charges and a wrench',min:1,max:1,path:'/johns-shop-bomber.html'},
  jameslumber:{name:"James's Lumber Stack",icon:'J',sub:'Quietly organize falling timber and clear clean lumber rows before the stack tops out',min:1,max:1,path:'/jamess-lumber-stack.html'},
  dorothygarden:{name:"Dorothy's Garden Merge",icon:'D',sub:'Merge seeds, sprouts, planters and garden rows into Dorothy\'s ultimate backyard garden',min:1,max:1,path:'/dorothys-garden-merge.html'},
  loganmine:{name:"Logan's Minefield",icon:'L',sub:'Clear a reluctant safe path through mud, hooks, rocks and angry-goose trouble',min:1,max:1,path:'/logans-minefield.html'},
  nanawhack:{name:"Nana's Goat Whack",icon:'N',sub:'Keep goats, pigs and chickens under control while Nana judges the whole operation',min:1,max:1,path:'/nanas-goat-whack.html'},
  hollymemory:{name:"Holly's Memory Mayhem",icon:'H',sub:'Match Holly\'s cozy toys, dogs, hoodies and treats across three difficulty levels',min:1,max:1,path:'/hollys-memory-mayhem.html'},
  lizzielights:{name:"Lizzie's Dramatic Lights",icon:'L',sub:'Repeat an ever-growing sequence of dramatic dance-stage light cues',min:1,max:1,path:'/lizzies-dramatic-lights.html'},
  vanessapipes:{name:"Vanessa's Pipe Problem",icon:'V',sub:'Rotate a ridiculous water system while Vanessa eye-rolls her way through the repair',min:1,max:1,path:'/vanessas-pipe-problem.html'},
  kelsirocks:{name:"Kelsi's Rock Hunt",icon:'K',sub:'Princess Kelsi searches the yard for shiny rocks and ridiculous prized treasures',min:1,max:1,path:'/kelsis-rock-hunt.html'},
  mollylights:{name:"Molly's Light Chase",icon:'M',sub:'Help tongue-out Molly catch a bouncing light before it zips away again',min:1,max:1,path:'/mollys-light-chase.html'},
  gunnersnacks:{name:"Gunner's Snack Attack",icon:'G',sub:'A bonus Gunner game: collect snacks while avoiding every suspicious sign of actual work',min:1,max:1,path:'/gunners-snack-attack.html'},
  breakout:{name:'Cabin Breakout',icon:'B',sub:'Fast brick-breaking arcade action with aiming paddle physics and MULTI-ball power-ups',min:1,max:1,path:'/breakout.html'},
  starpatrol:{name:'Neon Star Patrol',icon:'S',sub:'Top-down vector space combat with splitting asteroids, enemy ships and escalating waves',min:1,max:1,path:'/space-shooter.html'},
  rocketgap:{name:'Campfire Rocket',icon:'R',sub:'One-button rocket flying through shrinking timber gaps with persistent high score',min:1,max:1,path:'/rocket-gap.html'},
  snake:{name:'Neon Snake',icon:'S',sub:'Classic 20x20 Snake with responsive turns, swipe controls and a steady speed ramp',min:1,max:1,path:'/neon-snake.html'}
};"""
s=re.sub(r"const arcadeGames=\{.*?\n\};",block,s,flags=re.S)
s=s.replace("/snake|camppong|goatcrossing|shopbomber|cabinblocks|camp2048|minefield|goatwhack|memorymayhem|firelightsimon|papaspipes/.test(k)","/snake|papapaddle|gunnergoat|johnshop|jameslumber|dorothygarden|loganmine|nanawhack|hollymemory|lizzielights|vanessapipes|kelsirocks|mollylights|gunnersnacks/.test(k)")
old="const arcadeShelf=`<section class=\"lodge-shelf arcade-games\" id=\"arcadeShelf\"><div class=\"shelf-heading\"><span>◆</span><h2>Arcade Corner</h2><span>◆</span></div><div class=\"game-grid lodge-game-grid arcade-game-grid\">${Object.entries(arcadeGames).map(([key,m])=>`<article class=\"game-card playable lodge-game-card arcade-game-card\" data-game-card=\"${key}\"><div class=\"game-card-top\"><div class=\"game-icon\">${premiumGameIcon(key,m)}</div><span class=\"tag live\">ARCADE</span></div><h3>${esc(m.name)}</h3><p>${esc(m.sub)}</p><div class=\"game-card-meta\"><span>1 player</span><span>Instant play</span></div><div class=\"game-card-actions\"><button class=\"btn primary\" data-arcade-game=\"${key}\">Play Now</button><button class=\"btn cream\" data-share-arcade=\"${key}\">Share Link</button></div></article>`).join('')}</div></section>`;"
new="const arcadeProgress=(()=>{try{const p=JSON.parse(localStorage.getItem('bfgn_arcade_progress_v1')||'{}'),a=JSON.parse(localStorage.getItem('bfgn_arcade_achievements_v1')||'{}');return{plays:Number(p.plays)||0,achievements:Object.keys(a||{}).length}}catch{return{plays:0,achievements:0}}})();\n const arcadeShelf=`<section class=\"lodge-shelf arcade-games\" id=\"arcadeShelf\"><div class=\"shelf-heading\"><span>*</span><h2>Kristen's Arcade Corner</h2><span>*</span></div><div class=\"prototype-note\"><b>Kristen somehow organized all of this.</b> Family arcade games, personalized around the people and dogs who actually play here. ${arcadeProgress.plays} local plays / ${arcadeProgress.achievements} achievements unlocked.</div><div class=\"game-grid lodge-game-grid arcade-game-grid\">${Object.entries(arcadeGames).map(([key,m])=>`<article class=\"game-card playable lodge-game-card arcade-game-card\" data-game-card=\"${key}\"><div class=\"game-card-top\"><div class=\"game-icon\">${premiumGameIcon(key,m)}</div><span class=\"tag live\">FAMILY ARCADE</span></div><h3>${esc(m.name)}</h3><p>${esc(m.sub)}</p><div class=\"game-card-meta\"><span>1 player</span><span>Instant play</span></div><div class=\"game-card-actions\"><button class=\"btn primary\" data-arcade-game=\"${key}\">Play Now</button><button class=\"btn cream\" data-share-arcade=\"${key}\">Share Link</button></div></article>`).join('')}</div></section>`;"
if old not in s:
    raise SystemExit('arcade shelf source not found')
s=s.replace(old,new)
s=s.replace('21 Table Games + 4 Arcade','21 Table Games + 17 Arcade')
p.write_text(s,encoding='utf-8')
print('Updated app.js')
