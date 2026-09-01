# PROP HUNT P0 GAMEPLAY ENGINE REBUILD

I want you to perform a focused production rebuild of **Family Prop Hunt** in my existing Black Family Game Night project.

The current Prop Hunt has three major problems:

**1. Animation quality**

**2. Controls and movement feel**

**3. Glitchiness / instability**

These are now the **highest-priority P0 issues in the game**.

Do not spend development effort adding new maps, decorative props, particles, textures, lighting upgrades, additional game modes or other visual polish until the core gameplay below is functioning at production quality.

This is **not a cosmetic polish pass**. Treat the current implementation as a prototype of the gameplay rules and rebuild/refactor the underlying control, locomotion, animation, collision, physics and camera systems wherever necessary.

The target is a **smooth, polished third-person 3D game with console-quality control principles adapted to mobile/browser gameplay**, while retaining the immediate accessibility of a very good Roblox-style game.

---

# 1. DEVELOPMENT PRIORITY

Work in this exact priority:

1.  Input and controls 
2.  Character movement 
3.  Animation 
4.  Collision and physics stability 
5.  Camera 
6.  Aiming and shooting 
7.  Prop movement/transformation 
8.  Performance/frame pacing 
9.  Visual polish 
10.  Additional content 

**Do not hide bad controls or bad animation behind better graphics.**

A prettier environment is not progress if the player still slides, snaps, jitters, gets stuck, loses camera control or feels awkward to move.

---

# 2. PLAYER MOVEMENT

Create one robust shared production character controller for all human family characters.

Movement should feel responsive and slightly weighted:

-  very fast response to joystick/input 
-  extremely slight acceleration rather than an instant robotic snap 
-  immediate response when stopping 
-  natural animated settling step without adding control latency 
-  light joystick input = walk 
-  medium input = jog 
-  full input = run 
-  Sprint button = faster run 
-  sprint should be slightly exaggerated for fun but remain controllable 

**Character weight must come from animation, not control delay.**

Movement must be camera-relative.

Pressing forward always means moving toward the horizontal direction the camera is facing.

Normalize diagonal movement so diagonal running is not faster.

---

# 3. MOVEMENT MUST BE GAMEPLAY-AUTHORITATIVE

Normal locomotion should be controller-driven rather than root-motion-driven.

The gameplay controller determines:

-  actual player position 
-  velocity 
-  acceleration 
-  direction 
-  collision 
-  jump movement 

Animation then represents the player's actual measured motion.

An animation clip must never unexpectedly change:

-  player position 
-  velocity 
-  camera 
-  gameplay facing direction 
-  collision state 

Animation is presentation. It must not be capable of breaking gameplay.

---

# 4. MOBILE INPUT MUST BE ROCK SOLID

Build a proper pointer/touch input manager.

Explicitly handle:

-  pointerdown 
-  pointermove 
-  pointerup 
-  pointercancel 
-  lost pointer capture 
-  browser/page blur 
-  visibility changes 
-  interrupted touches 
-  simultaneous fingers 

If a touch is lost, immediately clear its gameplay input.

These bugs are **release blockers**:

-  character continues walking after joystick release 
-  camera continues rotating after finger release 
-  Sprint stays active accidentally 
-  Aim gets stuck 
-  Jump gets stuck 
-  one finger disables another control 
-  controls become unresponsive after changing tabs or losing focus 

Input should visibly affect gameplay on the **next valid simulation update**.

Never wait for an animation callback before responding to player input.

---

# 5. MOBILE CONTROL LAYOUT

Hider controls:

-  left analog movement joystick 
-  right-side drag/swipe camera 
-  Jump 
-  Sprint 
-  Change Prop 
-  Flash 
-  Decoy 
-  Lock/Align where appropriate 

Hunter controls:

-  left analog movement joystick 
-  right-side drag/swipe camera 
-  Jump 
-  Sprint 
-  Aim 
-  Shoot 

Hide controls that are irrelevant to the current role.

Do not cover the screen with unnecessary buttons or giant HUD panels.

---

# 6. CHARACTER ROTATION

Do not instantly snap the entire character toward a new movement direction.

Use smooth target-heading rotation.

Normal direction changes should blend naturally.

Large direction changes should trigger proper turning behavior.

For sharp turns, allow the character to plant and redirect.

Near-180-degree direction changes should use a convincing planted turn rather than rotating the model while its feet slide.

However, visual rotation must never make controls feel sluggish.

Gameplay response always takes priority over completing an animation.

---

# 7. PRODUCTION ANIMATION STATE SYSTEM

Replace fragile animation logic with a proper animation state machine / layered animation controller.

Human characters require at minimum:

### Grounded

-  breathing idle 
-  personality idle 
-  look around 
-  movement start 
-  walk 
-  jog 
-  run 
-  sprint 
-  movement stop 
-  left turn 
-  right turn 
-  sharp turn 
-  180-degree planted turn 

### Airborne

-  jump anticipation 
-  jump rise 
-  falling 
-  landing 

### Traversal

-  low mantle 
-  high mantle if required 

### Hunter

-  weapon idle 
-  raise weapon 
-  aim 
-  firing recoil 
-  hit reaction 

### Status

-  flash/stun 
-  elimination 
-  celebration/victory 

All transitions must blend smoothly.

No animation popping.

No animation freezing.

No character suddenly returning to T-pose/rest pose.

No restarting the same clip every few frames.

---

# 8. ANIMATION SPEED MUST MATCH ACTUAL MOVEMENT

Synchronize locomotion animation speed with actual controller velocity within sensible limits.

Eliminate visible foot sliding.

A build fails visual QA if:

-  feet are sprinting while the character barely moves 
-  the character travels across the floor while feet appear planted 
-  feet visibly skate during turns 
-  the animation plays at a noticeably different speed from movement 

Use blend parameters based on actual velocity rather than arbitrary animation timers.

---

# 9. UPPER-BODY AIMING

Hunters need layered animation.

Lower body handles:

-  walking 
-  jogging 
-  running 
-  sprinting 
-  turning 

Upper body independently handles:

-  torso aim 
-  shoulder position 
-  arm position 
-  head direction 
-  weapon alignment 

The hunter must be able to run while aiming naturally.

The weapon points toward the crosshair.

Allow reasonable torso rotation. Once aim exceeds that range, smoothly rotate the lower body to catch up.

Do not rotate the entire hunter model like a rigid statue.

---

# 10. FOOT PLACEMENT

Add restrained foot-placement IK where technically appropriate.

When standing or moving slowly:

-  feet should follow floor height 
-  feet should not float 
-  feet should not disappear through ramps or steps 
-  knees should react naturally to small height differences 

Fade foot IK during:

-  jumping 
-  falling 
-  mantling 
-  fast locomotion where needed 

---

# 11. COLLISION CONTROLLER

The player controller needs robust:

-  grounded detection 
-  slope detection 
-  wall collision 
-  ceiling collision 
-  step handling 
-  ground snapping 
-  collision skin width 
-  movement sub-stepping 
-  penetration recovery 
-  safe spawning 
-  invalid-position recovery 

Characters may never routinely:

-  fall through the map 
-  sink into the floor 
-  float above surfaces 
-  become embedded in walls 
-  vibrate against door frames 
-  get stuck between ordinary objects 
-  launch into the air after touching a small prop 
-  flick rapidly between grounded and airborne 

If penetration occurs, resolve it smoothly and automatically.

The player should not normally need to press RESET VIEW or respawn to repair gameplay.

---

# 12. FIXED GAMEPLAY SIMULATION

Movement and collision should use a stable simulation timestep or equivalent deterministic/sub-stepped architecture.

Rendering frame rate must not materially change:

-  player speed 
-  acceleration 
-  gravity 
-  jump height 
-  collision behavior 

A frame-rate drop must not cause physics explosions or movement distance changes.

Large frame deltas must be clamped/subdivided safely.

---

# 13. GROUND DETECTION

Do not rely on a single fragile ray.

Use robust capsule/sphere/multi-probe grounding logic.

Determine:

-  distance to ground 
-  ground normal 
-  slope 
-  safe standing surface 

Avoid grounded/airborne state flickering.

---

# 14. JUMPING

Use a useful Roblox-style arcade jump but animate it more naturally.

Include:

-  short jump anticipation 
-  rising phase 
-  apex/fall 
-  appropriate landing 
-  short jump-input buffer 
-  small amount of coyote time 

Do not introduce long animation locks after landing.

Gameplay responsiveness takes priority.

---

# 15. MANTLING

Players should automatically mantle sensible low obstacles rather than getting stuck against them.

Before mantling, verify:

-  valid obstacle 
-  reachable top 
-  sufficient overhead clearance 
-  valid landing area 
-  player capsule fits at destination 

Never mantle through:

-  walls 
-  ceilings 
-  shelves 
-  solid objects 
-  nonexistent floors 

---

# 16. CAMERA

Use a fairly close third-person camera.

The whole character should normally remain visible.

Normal movement camera is centered behind the character.

Hunters smoothly move toward a modest over-the-shoulder camera while aiming.

Mobile:

-  drag/swipe right side to look 
-  pinch zoom remains supported 

Player camera input always has priority.

After inactivity, the camera may gently settle toward travel direction, but never fight the player.

---

# 17. CAMERA OBSTRUCTION SYSTEM

Camera obstruction must smoothly shorten camera distance rather than clipping through geometry.

Use multiple obstruction checks/candidates rather than one fragile ray.

The camera may **never**:

-  pass through solid walls 
-  pass through roofs 
-  jump above buildings 
-  collapse into the avatar 
-  suddenly become top-down 
-  get trapped beneath geometry 
-  suddenly reverse pitch 
-  return NaN/Infinity transforms 

When an obstruction clears, smoothly return toward the player's chosen camera distance.

Decorative `solid:false` geometry must not block the camera.

---

# 18. CAMERA RECOVERY

Every frame, validate the camera solution.

At minimum ensure:

-  finite coordinates 
-  finite rotations 
-  legal pitch 
-  legal distance 
-  correct relationship to player 
-  camera not embedded in solid geometry 

If invalid, automatically restore a safe camera solution.

Do not allow one bad vector to destroy the camera.

---

# 19. NAN / INFINITY SAFETY

Validate critical:

-  positions 
-  velocities 
-  rotations 
-  camera vectors 
-  physics calculations 

If any become NaN, Infinity or otherwise invalid:

-  reject the value 
-  restore last-known-safe state 
-  log the originating system 

Never allow invalid math to cascade through the game.

---

# 20. LAST-KNOWN-SAFE PLAYER POSITION

Continuously maintain a valid recent player transform.

If a catastrophic collision/physics error occurs, recover to the recent safe transform first rather than teleporting all the way back to spawn.

Recovery should feel nearly invisible whenever possible.

---

# 21. HIDER PROP MOVEMENT

A disguised hider becomes the actual 3D prop model with appropriate dimensions/collision.

No:

-  2D sprite substitution 
-  billboard prop 
-  textured cube pretending to be the prop 
-  invisible human body with a fake prop image attached 

Prop locomotion should vary subtly according to object type:

-  barrels may roll/wobble 
-  tires rotate 
-  boxes scoot 
-  chairs shift/lean naturally 
-  small props move appropriately 

Do not give furniture visible human legs.

---

# 22. PROP TRANSFORMATION

Transformation should be fast, approximately 0.25 to 0.4 seconds.

Use a polished transformation effect rather than an abrupt model swap.

Before changing:

1.  validate candidate prop 
2.  calculate new collider 
3.  verify surrounding clearance 
4.  verify resulting position 
5.  transform 
6.  safely transition collision 
7.  update camera profile 

If the selected prop cannot safely fit, deny the transformation with subtle feedback.

Never spawn the player halfway through a wall.

---

# 23. PROP LOCK

Add **LOCK** for hiders.

When stationary, the player may lock their prop in place.

Lock should:

-  zero movement 
-  prevent tiny physics drift 
-  maintain orientation 
-  ignore accidental joystick noise 

Intentional movement immediately unlocks the prop.

Lock must be immediate and responsive.

---

# 24. PROP ALIGNMENT

Allow a stationary disguised player to rotate and align themselves naturally with nearby scenery.

Where appropriate, offer a subtle Align function to match orientation with comparable nearby environmental props.

Do not teleport the prop.

---

# 25. PROP CAMERA

Tiny props must still have a useful gameplay camera.

Do not place the camera at coffee-mug height just because the hider transformed into a mug.

Adapt the camera intelligently while retaining good room visibility.

---

# 26. DECOYS

Each hider retains 10 decoys per round.

Decoys use the current disguise.

Provide safe placement validation/preview.

Decoys may have extremely subtle randomized reactions such as:

-  wobble 
-  small orientation shift 
-  minor response to being shot 

Do not make decoys obviously artificial.

---

# 27. FLASH

Each disguise grants one flash.

Flash should:

-  throw toward camera/crosshair direction 
-  create a strong but short visual impairment 
-  briefly affect directional audio 
-  make aiming difficult 
-  not completely disable hunter movement 
-  recover quickly 

Target roughly 1.25 to 1.75 seconds of strong impairment followed by rapid recovery.

---

# 28. HUNTER AIMING AND SHOOTING

Hunters use:

-  Aim 
-  Shoot 
-  mild hip-fire where appropriate 
-  over-the-shoulder aiming camera 
-  crosshair 
-  recoil animation 
-  muzzle/energy effect 
-  impact effects 
-  directional firing sound 

Unlimited ammo remains.

Apply a sensible maximum fire rate so players cannot produce absurd shot spam.

Add extremely mild touchscreen aim assistance.

It may help fingers but must **not auto-play the game**.

No aggressive target snapping.

---

# 29. DAMAGE FEEDBACK

A successful hunter hit on a disguised player should provide:

Hunter:

-  subtle hit marker 
-  satisfying hit sound 
-  impact effect 

Hider:

-  brief prop reaction/jolt 
-  health feedback 
-  subtle camera response 

Do **not** reveal the player with giant glowing outlines.

Hiders generally require approximately three successful hits to eliminate.

Health carries across disguise changes.

---

# 30. ENVIRONMENT RESPONSE

Shooting normal environmental props should produce appropriate feedback:

-  wood impact 
-  metal impact 
-  small object wobble 
-  appropriate sound 
-  restrained particles 

Do not use uncontrolled physics capable of launching objects or players across the map.

---

# 31. DOORS

Doors should function naturally.

Players should be able to:

-  interact with doors 
-  push suitable doors open while moving 
-  chase through doorways without becoming stuck 

Door collision must not trap the player or camera.

---

# 32. COLLISION LAYERS

Separate collision responsibilities for:

-  player bodies 
-  camera obstruction 
-  static world 
-  movable props 
-  disguised hiders 
-  projectiles 
-  triggers 
-  decorative non-solid objects 

A decorative mesh should never unexpectedly trap a character or camera.

---

# 33. DOGS

Kelsi, Molly and Gunner must use proper quadruped movement/animation systems.

They are **not short humans**.

Dogs require:

-  quadruped idle 
-  walk 
-  trot 
-  run 
-  sprint 
-  turn 
-  jump 
-  land 
-  reactions 
-  appropriate collision profile 
-  dog-specific camera anchor 

Do not blindly retarget human animation onto dog skeletons.

---

# 34. CHARACTER RETARGETING

Shared animation families are acceptable, but every avatar must have validated retargeting.

Check for:

-  foot contact 
-  shoulder alignment 
-  wrist angle 
-  knee deformation 
-  body proportions 
-  weapon grip 
-  camera anchor 

Do not simply stretch one animation onto every character.

---

# 35. ANIMATION WATCHDOG

If an animation or clip fails:

-  do not freeze controls 
-  fall back safely to idle/locomotion 
-  log the error 

Missing animation assets must never make the player unplayable.

---

# 36. ASSET VALIDATION

Before spawning a playable avatar, verify:

-  skeleton 
-  required bones 
-  scale 
-  orientation 
-  animation clips 
-  attachment sockets 
-  collision profile 
-  avatar height 
-  foot placement 
-  camera anchor 
-  weapon attachment 

Catch broken assets before gameplay begins.

---

# 37. PERFORMANCE

Target **60 FPS** on supported phones.

Gameplay must still remain stable and responsive around 30 FPS.

If performance drops, reduce visual expense before gameplay fidelity.

Reduction order should favor:

1.  expensive shadows 
2.  distant detail 
3.  particles 
4.  reflections 
5.  other nonessential graphical effects 

Do not degrade the core controller/collision simulation first.

---

# 38. P0 RELEASE-BLOCKING GLITCHES

Treat all of the following as failures:

-  stuck movement 
-  stuck joystick 
-  camera trapped in geometry 
-  top-down camera collapse 
-  avatar stuck in floor/wall 
-  character jitter 
-  foot skating 
-  broken animation transition 
-  T-pose/rest pose appearing 
-  sudden teleport without recovery reason 
-  physics launch 
-  camera jump 
-  nonresponsive Jump/Sprint/Aim/Shoot 
-  prop collider exploding on transformation 
-  avatar facing wrong direction while moving 
-  weapon aiming away from crosshair 
-  animation preventing control input 

Do not classify these as minor polish issues.

---

# 39. AUTOMATED TESTING

Create or strengthen automated tests for:

-  movement 
-  diagonal speed 
-  jumping 
-  grounded detection 
-  collision 
-  slopes 
-  doorways 
-  camera obstruction 
-  camera recovery 
-  camera pitch 
-  spawn validation 
-  frame-delta variation 
-  pointer cancellation 
-  lost focus 
-  animation states 
-  animation transitions 
-  prop transformation 
-  large/small prop clearance 
-  lock/unlock 
-  NaN/Infinity recovery 
-  last-known-safe recovery 

But automated tests are only **Gate 1**.

---

# 40. REAL-DEVICE GAMEPLAY GATE

Automated test success does **not** mean Prop Hunt is finished.

Gate 2 requires hands-on gameplay on at least:

-  mobile phone 
-  desktop 

Test all of the following manually:

-  walk slowly 
-  jog 
-  run 
-  sprint 
-  stop abruptly 
-  repeatedly change direction 
-  circle movement 
-  180-degree turn 
-  jump repeatedly 
-  jump near ledges 
-  mantle 
-  run through doors 
-  hug walls 
-  navigate clutter 
-  aim while standing 
-  aim while moving 
-  shoot while moving 
-  rotate camera against walls 
-  enter tight rooms 
-  pinch zoom 
-  become very small prop 
-  become large prop 
-  rotate prop 
-  lock/unlock 
-  use decoys 
-  use flash 
-  chase another player 
-  play several continuous minutes without Reset 

If any of these visibly **looks or feels poor**, Prop Hunt fails the gate even if every automated test is green.

---

# 41. VISUAL PROOF REQUIRED

Do not tell me that the rebuild is successful based only on code changes or automated test counts.

I want actual proof from the running build.

After implementing this P0 rebuild, provide:

-  screenshots from actual Prop Hunt gameplay 
-  confirmation of real-device testing 
-  animation/state audit results 
-  control/input test results 
-  camera/collision test results 
-  remaining known defects 

Do not conceal or downgrade remaining problems.

---

# 42. STOP CONDITION

**Do not move on to additional Prop Hunt content until the gameplay foundation passes.**

The current largest problems are **animation, controls and glitchiness**.

I want these engineered to the highest practical standard possible.

Continue debugging, refactoring and retesting instead of declaring success after the first working implementation.

When an issue is found, identify its root cause rather than stacking temporary patches on top of it.

Reuse the shared fixes anywhere else in Black Family Game Night that uses the same third-person controller, animation, camera or collision architecture, but make **Prop Hunt the primary visual and gameplay validation gate**.

**The goal is no longer “Prop Hunt runs.” The goal is “Prop Hunt feels like a finished 3D game.”**

Please begin by auditing the current Prop Hunt implementation against this contract, identify the root causes of the current poor controls, animation and glitchiness, then implement the P0 rebuild in priority order. Do not ask me to choose technical implementation details when there is a clearly superior gameplay-engineering option. Use your best judgment and prioritize actual player feel.