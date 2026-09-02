const PROFILE_KEY='gn_profile_v1';
const CHOICE_PREFIX='bfgn_arcade_tutorial_choice_v2:';

export const ARCADE_TUTORIALS={
 'papas-paddle-battle':{name:"Papa's Paddle Battle",steps:[
  {visual:'YOU ▬   ●   ▬ PAPA',title:'Move your paddle',body:'Drag or tap across the lower half on a phone, or use Left/Right and A/D on a keyboard. Your paddle follows horizontally.',tip:'Keep the paddle under the glowing ball.'},
  {visual:'↙ ● ↗',title:'Change the return angle',body:'Where the ball hits your paddle changes its direction. Catch it near an edge when you want a sharper return.',tip:'Small controlled moves are safer than chasing the ball.'},
  {visual:'YOU 6  ·  PAPA 5',title:'Do not let it pass',body:'If the ball gets behind your paddle, Papa scores. If it gets behind Papa, you score.',tip:'After a point, get centered before the next serve.'},
  {visual:'7 = WIN',title:'First to seven wins',body:'The match ends when either side reaches seven points. Tap the board or press Space to serve and to start a rematch.',tip:'Papa gets harder to beat when the rally speeds up.'}
 ]},
 'gunners-goat-run':{name:"Gunner's Goat Run",steps:[
  {visual:'🐕 ↑ 🐐',title:'Get Gunner to the goat pen',body:'Swipe, tap, or use arrows/WASD to move Gunner one lane at a time from the bottom of the field to the goats at the top.',tip:'Moving forward is good, but waiting one beat can save a life.'},
  {visual:'🐕  🚙 →',title:'Cross the roads',body:'Vehicles travel across the road lanes. Move into an open gap and never stop on a vehicle path longer than necessary.',tip:'Watch the whole lane before stepping into it.'},
  {visual:'🌊  🪵 ←  🐕',title:'Ride the creek logs',body:'Water lanes are only safe while Gunner is standing on a moving log. The log carries him sideways, so correct your position before the bank.',tip:'Falling in the creek costs a life.'},
  {visual:'🐐 +1  LEVEL ↑',title:'Save goats and climb levels',body:'Reaching the goat pen saves one goat, resets Gunner to the start and eventually increases the level speed.',tip:'Three lives. Slow down when the traffic speeds up.'}
 ]},
 'johns-shop-bomber':{name:"John's Shop Bomber",steps:[
  {visual:'JOHN → 📦',title:'Move through the shop grid',body:'Use the on-screen movement controls, swipe, or keyboard directions to move John between safe shop squares.',tip:'Always leave yourself an escape route.'},
  {visual:'💥 ━ ╋ ━',title:'Place a spark charge',body:'Drop a family-safe spark charge beside junk. After its fuse, the blast travels in straight lines until a solid obstacle stops it.',tip:'Do not stand in your own blast lane.'},
  {visual:'📦 → ✨ → clear',title:'Clear the runaway junk',body:'Breakable shop clutter disappears when a blast reaches it. Clearing space opens routes and may expose useful pickups.',tip:'Work from the outside inward instead of trapping yourself.'},
  {visual:'🔑 → 🚪',title:'Finish the shop',body:'Clear the required junk and reach the exit/goal when it becomes available. Later boards demand tighter timing and path planning.',tip:'A fast clear is nice. A safe clear is better.'}
 ]},
 'jamess-lumber-stack':{name:"James's Lumber Stack",steps:[
  {visual:'▰  ↓  ▰▰',title:'Guide the falling lumber',body:'Move and rotate each falling timber shape before it settles. Phone controls and keyboard controls both work.',tip:'Look at the next open space before the piece gets low.'},
  {visual:'████████ = CLEAR',title:'Complete a full row',body:'A completely filled horizontal lumber row clears and gives you room to keep building.',tip:'Flat surfaces are easier to build on than deep holes.'},
  {visual:'↻  L → ┘',title:'Rotate to fit gaps',body:'Use rotation to tuck awkward shapes into spaces. Rotations only succeed when the new position fits the stack.',tip:'Do not create a one-square chimney unless you have a plan for it.'},
  {visual:'STACK ↑ = DANGER',title:'Keep the pile below the roof',body:'The run ends if the lumber stack reaches the top. Clear rows steadily instead of waiting for a perfect big clear.',tip:'James approves of quiet, boring efficiency.'}
 ]},
 'dorothys-garden-merge':{name:"Dorothy's Garden Merge",steps:[
  {visual:'🌱 + 🌱 + 🌱 → 🌼',title:'Merge matching plants',body:'Drag or tap matching garden pieces together. The required matching pieces combine into the next named plant or garden feature.',tip:'The name and artwork change as the plant upgrades.'},
  {visual:'□  🌼  □',title:'Use the garden grid',body:'Every plant sits on a clear square footprint even though the board looks like a lively cottage garden. Empty soil squares are valid placement spaces.',tip:'Keep a few empty spaces so the garden does not jam.'},
  {visual:'✨ 🌸 ✨',title:'Follow merge-ready feedback',body:'Pieces that can combine glow, bloom or sparkle. Use those cues when the board gets crowded.',tip:'Higher merge chains are worth protecting.'},
  {visual:'🌿 → 🪴 → 🌺 → 🏡',title:'Restore upgraded zones',body:'Clear weeds, roots, stones and broken pots while building toward upgraded beds, trellises, greenhouse corners and Dorothy’s Family Garden.',tip:'Upgraded zones make progression visually obvious.'}
 ]},
 'logans-minefield':{name:"Logan's Trail Logic",steps:[
  {visual:'🏍️ · · ·',title:'Place one dirt bike in every row',body:'Each horizontal row must contain exactly one dirt bike. Beginner boards already reveal one correct bike to get you started.',tip:'A revealed bike immediately eliminates the rest of its row.'},
  {visual:'·\n🏍️\n·\n·',title:'One bike in every column',body:'Each vertical column also contains exactly one dirt bike. Mark impossible squares with an X as you eliminate them.',tip:'Tap cycles Empty → X → Bike → Empty.'},
  {visual:'▦ 🏍️',title:'One bike in every terrain region',body:'Every connected colored terrain region must contain exactly one bike, even when the region twists through several rows and columns.',tip:'Use the terrain border as another set of clues.'},
  {visual:'🏍️ ✕ 🏍️',title:'Bikes cannot touch',body:'Two bikes may not occupy neighboring cells horizontally, vertically or diagonally.',tip:'A bike removes all eight neighboring cells from consideration.'},
  {visual:'5×5 → 6×6 → 9×9',title:'Difficulty grows gradually',body:'Journey boards start small and guided, then grow into larger terrain maps. The How To button can reopen this lesson at any time.',tip:'Hints point you toward logic without immediately solving the board.'}
 ]},
 'nanas-goat-whack':{name:"Nana's Goat Whack",steps:[
  {visual:'🐐 +1',title:'Hit the goats',body:'Tap an animal while it is visible in a pen opening. Goats are worth one point.',tip:'Do not tap empty holes.'},
  {visual:'🐖 +2   🐔 +2',title:'Watch for higher-value animals',body:'Pigs and chickens are worth two points, so prioritize them when several targets appear together.',tip:'The point guide stays visible beside the game.'},
  {visual:'🧰 −5',title:'Never hit the red toolbox',body:'The red toolbox is a penalty target, not an animal. Hitting it costs five points.',tip:'Shape and color matter more than pure tapping speed.'},
  {visual:'COMBO ×3',title:'Build a clean streak',body:'Quick correct hits build combo pressure and a better score. A bad hit breaks your rhythm.',tip:'Accuracy beats frantic tapping.'}
 ]},
 'hollys-memory-mayhem':{name:"Holly's Memory Mayhem",steps:[
  {visual:'?  ?  ?  ?',title:'Flip two cards',body:'Tap one face-down card, then another. The pictures stay visible long enough for you to compare them.',tip:'Say the picture and location to yourself.'},
  {visual:'🐶 = 🐶',title:'Matching pictures stay open',body:'If the two pictures match, the pair stays cleared/open and you score progress.',tip:'Use confirmed matches to reduce the board.'},
  {visual:'🐶 ≠ 🧁 → ?',title:'Mismatches turn back over',body:'If the pictures do not match, remember both locations before they flip face down again.',tip:'A mismatch is still useful information.'},
  {visual:'EASY → HARD',title:'Choose your board difficulty',body:'Higher difficulty adds more pairs and a larger memory challenge. Clear every pair to finish the board.',tip:'Start small if a younger player is learning.'}
 ]},
 'lizzies-dramatic-lights':{name:"Lizzy's Dramatic Lights",steps:[
  {visual:'🟣 → 🔵 → 🟡',title:'Watch the light sequence',body:'The stage lights play a sequence one cue at a time. Do not tap until the playback is finished.',tip:'Watch the order, not just the colors.'},
  {visual:'1 · 2 · 3',title:'Repeat the exact order',body:'Tap the stage lights in the same order you just saw. Each correct input confirms before the next one.',tip:'A steady rhythm helps memory.'},
  {visual:'+ 1 LIGHT',title:'The sequence grows',body:'After a correct round, one more light is added to the end of the sequence.',tip:'Mentally break long sequences into small groups.'},
  {visual:'🎭 BEST 12',title:'Build your longest performance',body:'A wrong cue ends the run. Your best sequence length is saved so you can try to beat it.',tip:'Lizzy expects drama, but the inputs still need to be exact.'}
 ]},
 'vanessas-pipe-problem':{name:"Vanessa's Pipe Problem",steps:[
  {visual:'PUMP 💧 → ┐',title:'Rotate the pipe pieces',body:'Tap a pipe to rotate it inside its recessed socket. Open pipe ends must physically line up with neighboring pieces.',tip:'Trace forward from the pump rather than rotating randomly.'},
  {visual:'🟤  💦  ⚙',title:'Repair hazards first',body:'Later jobs include mud clogs, leaks and stuck valves. Repair or orient them correctly before water can travel through that section.',tip:'A broken-looking section is a clue, not decoration.'},
  {visual:'💧━━━━━━→🚚',title:'Connect the pump to the truck',body:'The goal is a continuous working route from the pump to Vanessa’s grey GMC wash truck. Unused side pipes do not have to connect.',tip:'Only the route that reaches the truck matters for the win.'},
  {visual:'GMC  ✓  NEXT',title:'Water at the GMC wins the level',body:'When the water reaches the grey GMC, the truck reacts, the level is marked complete and the next job loads automatically.',tip:'The GMC letters are pink; the truck itself stays grey.'}
 ]},
 'mollys-light-chase':{name:"Molly's Light Chase",steps:[
  {visual:'🐶 → ✨',title:'Steer Molly toward the light',body:'Use arrows/WASD, swipe, or the phone direction buttons. Molly keeps moving once the chase begins.',tip:'Turn before the next square, especially after the speed increases.'},
  {visual:'✨ = +1 + TRAIL',title:'Every light makes the trail longer',body:'Catching a light scores one and leaves another glowing paw-print segment behind Molly.',tip:'The growing trail is part of the challenge, not decoration.'},
  {visual:'WALL ✕  TRAIL ✕',title:'Do not get tangled',body:'Running into the cabin edge or Molly’s own glowing trail ends the run.',tip:'Keep an escape lane open instead of circling too tightly.'},
  {visual:'5 LIGHTS → SPEED ↑',title:'The chase gets faster',body:'Molly speeds up every few lights. Your best score is saved so you can keep improving.',tip:'At higher speeds, plan two turns ahead.'}
 ]},
 'gunners-snack-attack':{name:"Gunner's Snack Attack",steps:[
  {visual:'🐕 → 🦴',title:'Move Gunner to the snack',body:'Use arrows/WASD, swipe, or the four phone direction buttons to move one grid square at a time.',tip:'Plan the shortest safe route before moving.'},
  {visual:'🦴 +1',title:'Collect snacks',body:'Landing on the snack earns a point and immediately places another snack elsewhere on the grid.',tip:'The snack icon is the only thing you are trying to collect.'},
  {visual:'🧹 = −1',title:'Avoid chores',body:'Work/chores occupy blocked danger squares. Hitting one costs a point and sends Gunner back toward the start.',tip:'Sometimes the longer path is faster than recovering from a chore.'},
  {visual:'45s  BEST ↑',title:'Race the timer',body:'Collect as many snacks as possible before the timer reaches zero. Your best score is saved.',tip:'Keep moving, but do not sacrifice points for one risky shortcut.'}
 ]},
 'breakout':{name:'Cabin Breakout',steps:[
  {visual:'▬  ●  ▦▦▦',title:'Keep the ball above your paddle',body:'Drag/tap the paddle on phone or use the game controls to catch the ball and send it back into the cabin bricks.',tip:'Meet the ball instead of following it after the bounce.'},
  {visual:'● → ▦ = + SCORE',title:'Break every brick',body:'Each ball collision damages/removes a brick and adds score. Clear the brick field to complete the run.',tip:'Side angles reach hard corners better than straight shots.'},
  {visual:'MULTI → ● ● ●',title:'Catch power-ups',body:'Some broken bricks release a MULTI power-up. Catch it with the paddle to add more active balls.',tip:'Multiple balls clear fast, but they are harder to defend.'},
  {visual:'♥ ♥ ♥',title:'Protect your lives',body:'A ball that falls below the paddle costs a life. The game ends when all lives are gone.',tip:'When several balls are active, protect the lowest one first.'}
 ]},
 'space-shooter':{name:"Kelsi's Rock 'n' Roll Rescue",steps:[
  {visual:'🐶 ← 🪨',title:'Move Kelsi under the rocks',body:'Slide Kelsi across the trail with touch/drag or the available movement controls so good rocks reach her catch zone.',tip:'Track where a rock will land, not where it is now.'},
  {visual:'🪨 +1   ✨ +3',title:'Catch valuable rocks',body:'Normal rocks score, while shiny special rocks are worth more. Kelsi considers this serious treasure management.',tip:'Prioritize special rocks when two are falling together.'},
  {visual:'💗 +5',title:'Grab rare heart rocks',body:'Heart rocks are the highest-value catches. Move early so you are lined up before they reach the bottom.',tip:'Do not abandon an easy catch unless the rare one is reachable.'},
  {visual:'🟤 −3',title:'Avoid mud clumps',body:'Mud looks different from collectible rocks and subtracts points if Kelsi catches it.',tip:'Good rock, yes. Mud, absolutely not.'}
 ]},
 'rocket-gap':{name:'Campfire Rocket',steps:[
  {visual:'🚀 ↑',title:'Tap to boost upward',body:'Tap/click the game or use its single-button control to give the rocket an upward push. Gravity immediately pulls it down again.',tip:'Use small frequent corrections instead of huge late saves.'},
  {visual:'│   GAP   │',title:'Fly through the opening',body:'Each timber obstacle has one safe gap. Guide the rocket through the middle without touching the upper or lower timber.',tip:'Line up before you reach the obstacle.'},
  {visual:'GAP ↓',title:'The route gets tighter',body:'As your score rises, openings become less forgiving and require steadier timing.',tip:'Look at the next gap while finishing the current one.'},
  {visual:'BEST ↑',title:'Keep going for a high score',body:'Passing a gap adds score. A collision ends the run and your best score remains saved.',tip:'Restart quickly, but do not rush the first few taps.'}
 ]},

};

function readProfile(){try{return JSON.parse(localStorage.getItem(PROFILE_KEY)||'{}')||{}}catch{return {}}}
function profileChoiceKey(gameId){const p=readProfile(),id=String(p.profileId||p.name||'local-profile');return `${CHOICE_PREFIX}${id}:${gameId}`}
function markChosen(gameId,value='shown'){try{localStorage.setItem(profileChoiceKey(gameId),value)}catch{}}
function chosen(gameId){try{return localStorage.getItem(profileChoiceKey(gameId))}catch{return null}}
function escapeHTML(s=''){return String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]))}

function tutorialHTML(data,choice=false){
 return `<div class="arcade-tutorial-card"><button type="button" class="arcade-tutorial-close" aria-label="Close tutorial">×</button><small>${choice?'OPTIONAL VISUAL TUTORIAL':'VISUAL HOW TO PLAY'}</small><h2>${escapeHTML(data.name)}</h2><section class="arcade-tutorial-choice" ${choice?'':'hidden'}><p>Want a quick visual lesson before you play? This choice is saved separately for each family player profile.</p><div class="arcade-tutorial-choice-actions"><button type="button" data-tutorial-show>SHOW TUTORIAL</button><button type="button" data-tutorial-skip>SKIP FOR ME</button></div></section><section class="arcade-tutorial-lesson" ${choice?'hidden':''}><div class="arcade-tutorial-visual" aria-live="polite"></div><h3></h3><p class="arcade-tutorial-body"></p><p class="arcade-tutorial-tip"></p><footer><button type="button" data-tutorial-prev>BACK</button><b></b><button type="button" data-tutorial-next>NEXT</button></footer></section></div>`;
}

export function showArcadeTutorial(gameId,{prompt=false}={}){
 const data=ARCADE_TUTORIALS[gameId];if(!data)return;
 document.querySelector('.arcade-tutorial-overlay')?.remove();let index=0;
 const overlay=document.createElement('div');overlay.className='arcade-tutorial-overlay';overlay.innerHTML=tutorialHTML(data,prompt);document.body.append(overlay);
 const choice=overlay.querySelector('.arcade-tutorial-choice'),lesson=overlay.querySelector('.arcade-tutorial-lesson');
 const render=()=>{const step=data.steps[index];overlay.querySelector('.arcade-tutorial-visual').textContent=step.visual;overlay.querySelector('h3').textContent=step.title;overlay.querySelector('.arcade-tutorial-body').textContent=step.body;overlay.querySelector('.arcade-tutorial-tip').textContent=`TIP · ${step.tip}`;overlay.querySelector('footer b').textContent=`${index+1} / ${data.steps.length}`;overlay.querySelector('[data-tutorial-prev]').disabled=index===0;overlay.querySelector('[data-tutorial-next]').textContent=index===data.steps.length-1?'DONE':'NEXT'};
 const showLesson=()=>{choice.hidden=true;lesson.hidden=false;index=0;render();markChosen(gameId,'shown')};
 const close=()=>{overlay.remove()};
 overlay.querySelector('.arcade-tutorial-close').onclick=()=>{markChosen(gameId,prompt?'skipped':'shown');close()};
 overlay.querySelector('[data-tutorial-show]')?.addEventListener('click',showLesson);
 overlay.querySelector('[data-tutorial-skip]')?.addEventListener('click',()=>{markChosen(gameId,'skipped');close()});
 overlay.querySelector('[data-tutorial-prev]').onclick=()=>{index=Math.max(0,index-1);render()};
 overlay.querySelector('[data-tutorial-next]').onclick=()=>{if(index>=data.steps.length-1){markChosen(gameId,'shown');return close()}index++;render()};
 overlay.addEventListener('click',e=>{if(e.target===overlay){markChosen(gameId,prompt?'skipped':'shown');close()}});
 if(!prompt)render();
}

export function mountArcadeTutorial(gameId,{button=null,autoPrompt=true}={}){
 const data=ARCADE_TUTORIALS[gameId];if(!data)return false;
 let btn=button||document.querySelector('[data-how]');
 if(!btn){btn=document.createElement('button');btn.type='button';btn.className='arcade-how-floating';btn.textContent='HOW TO';document.body.append(btn)}
 btn.addEventListener('click',()=>showArcadeTutorial(gameId));
 window.BFGNShowHowToPlay=()=>showArcadeTutorial(gameId);
 if(autoPrompt&&!chosen(gameId))setTimeout(()=>showArcadeTutorial(gameId,{prompt:true}),450);
 return true;
}
