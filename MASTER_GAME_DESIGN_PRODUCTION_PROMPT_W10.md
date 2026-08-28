# BLACK FAMILY GAME NIGHT
# MASTER GAME DESIGN + PRODUCTION DIRECTIVE W.10
## Professional quality framework, flagship Prop Hunt plan, mobile-first controls, character fidelity, production gates and whole-app standards

Planning date: 2026-08-27
Status: HIGHEST-PRECEDENCE NEXT-BUILD DESIGN AND PRODUCTION PROMPT
Base runtime: Phase W.8 Arcade Tutorials + Tokens Store, including all locked W.7 Prop Hunt fixes
Supersedes for next-build planning: the append-only W.9 master prompt where any wording conflicts
Preserves: Project Constitution, approved character identity, locked game rules, existing multiplayer/reconnect, W.1-W.9 approved behavior unless this directive explicitly changes it

======================================================================
0. HOW TO USE THIS DOCUMENT
======================================================================

This is the canonical design and production instruction set for the next build of Black Family Game Night.

The project has accumulated many phase documents. Those documents remain valuable history and contain game-specific rules, but the development process must no longer rely on whichever old sentence is easiest to find. Use the following precedence order.

SOURCE-OF-TRUTH PRECEDENCE
1. Explicit instructions from the user in the current development conversation.
2. Approved visual references and `MASTER_APPROVED_FAMILY_CHARACTER_DIRECTIVE.md` for character identity.
3. Game-specific locked rule files for rules that are already finalized, such as Black Gammon or Prop Hunt round rules.
4. This W.10 Master Game Design + Production Directive.
5. Current phase-specific implementation directives that do not conflict with W.10.
6. Project Constitution.
7. Historical phase directives and reports.
8. Old placeholder art, obsolete GLBs, prototype screenshots and older generated character art.

If two sources conflict and the precedence is not obvious, do not guess. Preserve the current working behavior and document the conflict before changing it.

This directive is intentionally stricter about proof. A passing unit test is code proof. It is not proof that a character looks right, a camera feels good, a touch control is comfortable, or a level is fun.

======================================================================
1. PRODUCT NORTH STAR
======================================================================

Black Family Game Night should feel like a private, polished family game lodge that happens to contain many games, not a folder of browser prototypes.

The emotional target is:
- recognizable family identity;
- quick laughter and low-friction joining;
- games that are understandable within seconds;
- enough depth to replay with family;
- strong phone usability;
- tactile, physical-looking cards, boards, props and characters;
- personal details that feel affectionate and specific without becoming clutter;
- visual quality that is simple, cohesive and deliberate rather than technically elaborate but visually weak.

The player should be able to hand the phone to a family member who has not followed development and have that person understand what to do.

The most important quality rule is:

> PLAYER EXPERIENCE OUTRANKS FEATURE COUNT.

Do not add ten unfinished systems when one polished system would materially improve the game.

======================================================================
2. PRIMARY PLAYER GROUPS AND PLAY CONTEXTS
======================================================================

Design for a mixed family audience rather than a single expert-gamer persona.

Primary contexts:
- adults who play games regularly;
- adults who rarely play games;
- teenagers and children;
- players using a phone on a couch, at a table or at a family gathering;
- players joining from a link with little setup time;
- players returning after days or weeks and needing quick reorientation;
- players who prefer touch, mouse/keyboard or a connected gamepad.

Therefore:
- core controls must be readable without memorizing combinations;
- important state must be visible, not remembered;
- tutorials must be replayable and skippable;
- mistakes should usually be recoverable;
- controls should support sensitivity, inversion and comfort options;
- social play should not punish a less experienced family member with inaccessible mechanics.

======================================================================
3. EXPERIENCE PILLARS
======================================================================

Every major design decision should strengthen at least one of these pillars and should not seriously damage another.

PILLAR A - FAMILY RECOGNITION
Characters, jokes, locations and objects should feel specific to this family. Approved character identity is sacred.

PILLAR B - IMMEDIATE PLAYABILITY
A player should know what to do, what matters and what happened. Controls respond immediately and feedback is unambiguous.

PILLAR C - PHYSICAL GAME-NIGHT READABILITY
Cards, dominoes, boards, marbles, props, weapons and interactables should have believable depth, placement and hierarchy. Decorative framing must never hide the game surface.

PILLAR D - MOBILE-FIRST COMFORT
Phone is a first-class platform. A control scheme that only feels good with a mouse is not finished.

PILLAR E - SOCIAL REPLAYABILITY
Games should create stories, rematches, rivalries and funny moments. Persistence, tokens and achievements support replay but never grant unfair gameplay power.

PILLAR F - POLISH BEFORE EXPANSION
The project should establish a proven quality slice before copying a system across more characters, maps or games.

======================================================================
4. QUALITY PRIORITY LADDER
======================================================================

When tradeoffs are necessary, use this order:
1. Game launches and completes its primary loop.
2. Player can control the game reliably.
3. Camera and visibility remain stable.
4. Rules are correct.
5. Multiplayer state is fair and synchronized.
6. Character and object identity is correct.
7. Gameplay feedback is clear.
8. Performance is stable on phones.
9. Art, animation, audio and effects are polished.
10. Extra content and decorative features are added.

Never sacrifice items 1-8 to add item 10.

======================================================================
5. BUILD STRATEGY: VERTICAL SLICE FIRST
======================================================================

Family Prop Hunt remains the flagship 3D benchmark.

The next 3D production sequence is:
1. Perfect one approved John hunter in Papa's Shop.
2. Prove movement, camera, hands, weapon, shooting and impacts on a real phone.
3. Prove John as a hider, including transformation, decoy, flash, lock, jump and mantle.
4. Prove one full five-minute round with real multiplayer or representative bots.
5. Only after that gate passes, propagate the proven shared system to Kristen, Holly, Vanessa, Lizzie, Logan, James and Dorothy.
6. Finish Papa, Nana, Kelsi, Molly and Gunner turnarounds before treating their new 3D models as approved.
7. Expand to the other Prop Hunt maps only after Papa's Shop is stable.
8. Propagate the proven 3D framework to Island Life and Birthday Seat afterward.

Do not build all characters simultaneously and hope they converge later.

======================================================================
6. DEVELOPMENT WORKFLOW FOR EVERY PHASE
======================================================================

Before editing code:
1. Extract the latest known-good ZIP into a fresh working directory.
2. Read the Constitution, this W.10 directive, the relevant game-specific rule document and all directly affected locked addenda.
3. Identify current behavior in code before replacing it.
4. Write a short implementation plan separating rule changes, UX changes, art changes and technical changes.
5. Protect unrelated games from refactors unless shared infrastructure genuinely requires a change.

During implementation:
- make one system change at a time where possible;
- keep feature flags or clean fallbacks for risky 3D replacements;
- do not delete a known-good fallback until the replacement passes its visual gate;
- avoid fake files, fake GLBs, fake manifests and placeholder claims of completion;
- instrument high-risk systems so camera recovery, stuck recovery and transform failures can be diagnosed.

Before release:
- run syntax/unit/regression tests;
- run build/static-path validation;
- verify routes;
- verify asset manifests;
- verify ZIP integrity;
- extract the exact finished ZIP into a clean directory and rerun tests there;
- record what was actually visually inspected;
- never label a build phone-verified unless it was actually tested on a phone.

======================================================================
7. WHOLE-APP UX STANDARD
======================================================================

Across the app:
- the primary play surface should dominate the screen;
- decorative chrome should be secondary;
- important actions should use consistent wording;
- every game should expose How to Play or How To from inside the game;
- tutorial state is per player and replayable;
- current objective, turn, role or round state should remain glanceable;
- destructive actions require confirmation only when accidental activation would cause meaningful loss;
- routine gameplay actions should not be slowed by confirmation dialogs;
- results screens should be skippable after the first meaningful presentation;
- loading states should explain what is happening rather than leaving a frozen screen.

Use progressive disclosure. Show the player what is needed now, and keep advanced information one tap away.

======================================================================
8. INPUT AND ACCESSIBILITY STANDARD
======================================================================

Controls must be action-based rather than tightly tied to one physical key.

Required settings where technically practical:
- look sensitivity;
- separate horizontal and vertical sensitivity if useful;
- invert X;
- invert Y;
- sprint hold/toggle/auto option where applicable;
- aim assist Off / Light / Standard for touch and gamepad where applicable;
- camera shake Off / Low / Standard;
- haptic vibration Off / Low / Standard when supported;
- reduced motion option for strong camera/effect motion;
- readable UI scale where practical;
- left-handed touch layout preset;
- large-button touch layout preset;
- remappable desktop/gamepad actions when the architecture supports it.

Do not require simultaneous multi-button chords for core family gameplay.
Do not require repeated rapid tapping when a hold or toggle can serve the same purpose.
Do not make a critical cue audio-only or color-only. Pair important state with shape/text/icon/audio where appropriate.

Touch controls:
- target approximately 44 pt minimum comfortable iOS controls and 48 dp Android-equivalent hit areas for important actions;
- use extra invisible padding when visual buttons must look smaller;
- separate adjacent high-risk controls enough to avoid accidental taps;
- respect safe areas, rounded corners and camera cutouts;
- preserve simultaneous move + look + action multi-touch.

======================================================================
9. PERFORMANCE AND WEBGL STANDARD
======================================================================

The game runs in a browser. Design to mobile WebGL realities, not desktop assumptions.

Frame-rate goals:
- preferred target: stable 60 fps on a representative modern phone for active gameplay;
- acceptable fallback floor: stable 30 fps on lower-power supported phones;
- no repeated large frame spikes during shooting, transformation, weather, map randomization or character spawn;
- measure frame-time percentiles, not only average fps.

Rendering principles:
- batch repeated props;
- instance repeated environment objects where practical;
- atlas materials where it reduces draw calls without damaging identity;
- use mipmaps for 3D textures;
- prefer GPU-compressed textures such as KTX2/Basis where supported by the existing pipeline;
- set a per-device/per-pixel memory budget rather than assuming desktop VRAM;
- reduce render resolution dynamically before destroying gameplay assets if a device is fill-rate bound;
- avoid blocking WebGL readbacks in active play;
- pool tracers, impact effects and frequently spawned temporary objects;
- cap particle counts;
- limit real-time shadow casters by significance;
- throttle animation and ambient-life updates by distance/significance;
- cull hidden zones aggressively while avoiding visible pop-in;
- recover gracefully from WebGL context loss where practical.

Initial mobile budget targets for Prop Hunt should be treated as tuning targets, not excuses to break visual quality:
- hero family character LOD0: approximately 8k-12k triangles;
- LOD1: approximately 4k-6k;
- LOD2: approximately 1.5k-2.5k;
- no more than four significant skin weights per vertex unless a visible deformation problem requires otherwise;
- keep material slots low and deliberate;
- use 1024 atlases by default, with 2048 reserved for hero/close-view needs that visibly justify the cost;
- prefer one shared humanoid skeleton and animation library.

======================================================================
10. VISUAL IDENTITY STANDARD
======================================================================

The art direction is not photorealism and not blocky placeholder art.

Target:
- warm, dimensional, tactile cartoon 3D;
- soft stylized PBR materials;
- readable silhouettes;
- believable object thickness;
- strong contact shadows;
- restrained surface detail;
- family likeness through shape, color and signature features rather than realism for its own sake.

For family characters, the approved turnaround controls identity. A more detailed model that looks less like the approved person is a failed model.

For props and environments, prioritize:
1. silhouette;
2. proportion;
3. material separation;
4. contact with the ground/world;
5. useful gameplay readability;
6. secondary detail.

Do not spend geometry on invisible seams while hands, faces, doors or weapons still look wrong.

======================================================================
11. AUDIO AND HAPTIC STANDARD
======================================================================

Audio is gameplay information and personality, not background decoration.

Use layers:
- UI confirmation;
- movement/footstep material response;
- weapon fire and impact;
- hider transform/decoy/flash;
- environment ambience;
- short family reactions;
- round transition cues.

Important events should have both visual and audio feedback.
Haptic feedback may reinforce shooting, damage or important UI actions, but must never be the only signal and must be adjustable/off.

Avoid constant loud stingers. Preserve dynamic range so meaningful events stand out.

======================================================================
12. ONBOARDING AND TUTORIAL DESIGN
======================================================================

Tutorials should teach by doing, not by presenting a wall of instructions.

Use a Prime -> Teach -> Observe pattern:
- Prime: show the immediate goal and one control.
- Teach: let the player perform that action safely.
- Observe: confirm success, then introduce the next mechanic.

For Prop Hunt, tutorial content must be role-specific.

Hunter tutorial sequence:
1. move;
2. look;
3. jump/mantle;
4. follow the crosshair;
5. shoot a harmless training prop;
6. see tracer and impact;
7. understand that hiders can look like props;
8. understand no ammo penalty exists.

Hider tutorial sequence:
1. move/look;
2. choose one assigned prop;
3. transform;
4. lock/unlock;
5. place a decoy;
6. use flash;
7. jump/mantle while disguised;
8. explain the three-change and ten-decoy limits.

Tutorials must be skippable and replayable from How To.
Do not force veteran players through tutorials every match.

======================================================================
13. SOCIAL AND MULTIPLAYER STANDARD
======================================================================

Preserve the private-room foundation:
- invite-link join;
- seat/player selection;
- Ready state;
- host control;
- reconnect;
- bots;
- chat/reactions;
- persistent profile/history systems already in the app.

Network architecture principle:
- local camera and local input response are immediate;
- authoritative room state decides roles, phase, health, eliminations, remaining resources and valid hits;
- remote characters interpolate rather than teleport between snapshots;
- remote animation is driven by replicated state/velocity/aim, not raw remote key presses;
- hidden hider information is not sent to hunters during the hide phase;
- disguise/decoy randomization uses an authoritative seed where all clients must agree;
- reconnect restores the player to a legal role/state without duplicating resources.

======================================================================
14. PROGRESSION AND COSMETICS
======================================================================

Arcade Tokens remain earned-only. No real-money purchase flow.

Cosmetics are identity-safe overlays:
- Hat -> HeadTop socket;
- Glasses -> Face socket;
- Accessory -> ChestAccessory socket.

Cosmetics may not change:
- skin tone;
- hair identity;
- face identity;
- approved body proportions;
- base outfit identity;
- dog coat markings.

Do not introduce power progression into Prop Hunt, board games or arcade games through cosmetics/tokens.

======================================================================
15. GAME-CATEGORY DESIGN STANDARDS
======================================================================

CARD GAMES
- cards are always readable;
- current hand is fully reachable on phone;
- hands larger than the comfortable width use horizontal swipe/scroll rather than microscopic cards;
- draw/discard/played zones have strong hierarchy;
- turn and legal-action feedback is explicit;
- preserve exact family rules.

BOARD/TABLETOP GAMES
- game board/table is the hero, not the decorative room;
- all pieces relevant to a decision remain visible or intentionally scrollable;
- physical depth supports comprehension;
- players can inspect/rearrange personal racks where the real game allows it;
- camera should never make the player fight perspective to understand state.

ARCADE GAMES
- start quickly;
- How To is available inside every game;
- first-time tutorial is opt-in/skip and remembered per player;
- feedback is immediate;
- level progression communicates success clearly;
- each game has a distinct visible identity.

3D FAMILY GAMES
- shared camera/input/character systems are proven in Prop Hunt first;
- do not copy an unstable camera or character rig into other 3D games.

======================================================================
16. FLAGSHIP MODE: FAMILY PROP HUNT VISION
======================================================================

Family Prop Hunt should feel like a polished third-person hide-and-seek action game where the comedy comes from family characters, ridiculous disguises, near misses and map knowledge.

Desired emotional arc of a round:
1. anticipation during role reveal;
2. frantic creativity during hiding;
3. tense searching after HUNT;
4. readable chase or escape;
5. funny reveal/elimination;
6. quick family recap and rematch momentum.

The mode should reward:
- map knowledge;
- clever disguise choice;
- believable placement;
- movement skill;
- hunter observation;
- chase execution;
- decoy timing;
- flash timing.

It should not reward:
- camera exploits;
- hiding inside collision;
- invisible/undersized props;
- network desync;
- unreadable effects;
- guessing based on rendering bugs.

======================================================================
17. PROP HUNT LOCKED MATCH RULES
======================================================================

Preserve the established core rules unless the user explicitly changes them.

Match:
- default 6 rounds;
- Papa's Shop supports up to 12 players;
- Classic and Family Chaos modes remain separate.

Hide phase:
- default 30 seconds;
- hunters see a black screen and countdown;
- hunters cannot move, look, shoot or receive useful positional hider information;
- hiders may move, jump, climb, disguise and place decoys.

Hunt phase:
- default 5 minutes;
- synchronized 3-2-1 -> HUNT transition;
- hunter controls unlock immediately and reliably.

Hiders:
- curated map disguise pool around 30 types for Papa's Shop;
- exactly 4 assigned disguise choices for the round;
- no reroll;
- initial disguise plus up to 3 later disguise changes;
- health carries across disguise changes;
- each disguise refreshes one flash grenade;
- exactly 10 decoys total per hider per round;
- hiders can move, run, jump and climb reasonable surfaces while disguised;
- lock/unlock remains available to stabilize prop position/orientation.

Hunters:
- unlimited ammo;
- no penalty for shooting innocent environment props;
- no separate Aim button;
- permanent crosshair aiming during active hunt;
- tap Shoot fires once;
- hold Shoot uses a tuned controlled rapid-fire rate;
- hunter can move, turn, strafe, jump and shoot together;
- no mid-round combat power upgrades.

Health/elimination:
- standard hider target remains approximately three hits;
- disguise prop breaks visibly on elimination;
- short `That's a sin.` original comedic elimination cue remains;
- Classic: eliminated hider becomes spectator/ghost;
- Family Chaos: caught hider joins hunters.

======================================================================
18. PROP HUNT ROUND STATE MACHINE
======================================================================

Use an explicit state machine. Do not let UI and gameplay infer phase independently.

Recommended states:
LOBBY
ROLE_REVEAL
HIDE_COUNTDOWN
HUNT_RELEASE
HUNT
ROUND_RESOLVE
ROUND_MVP
MATCH_RESOLVE

Every state defines:
- allowed movement;
- allowed camera;
- allowed actions;
- visible HUD;
- allowed network data;
- audio cues;
- transition timeout;
- reconnect behavior.

A phase transition must be idempotent. Repeated network messages cannot grant extra decoys, refresh flash twice or duplicate eliminations.

======================================================================
19. PROP HUNT HUD INFORMATION HIERARCHY
======================================================================

The active viewport is the priority.

Always-visible during hunt:
- role;
- round/time remaining;
- health where relevant;
- small crosshair for hunters;
- role-specific resources only.

Hunter HUD:
- health/status if applicable;
- crosshair;
- Shoot;
- Jump;
- Sprint/toggle state;
- shoulder swap;
- Reset View;
- compact alive-hiders count if already part of the design.

Hider HUD:
- health;
- current disguise;
- disguise changes remaining;
- flash ready/not ready;
- decoys remaining out of 10;
- lock/unlock state;
- Prop / Flash / Decoy / Lock / Jump / Sprint;
- Reset View.

Do not show hider-only controls to hunters or hunter-only shooting controls to hiders.

======================================================================
20. PROP HUNT LEVEL-DESIGN PRINCIPLES
======================================================================

Papa's Shop remains the first map benchmark.

The map should be large enough for up to 12 players and roughly eight times the original prototype's meaningful traversable area.

Core zones remain:
- main shop;
- barn;
- animal pens;
- equipment yard;
- lumber/material storage;
- outdoor apron/grass/property circulation.

Design rules:
- primary circulation uses loops, not funnels;
- major zones aim for roughly three meaningful entrances/exits where practical;
- every large zone includes at least one fast chase route, one slower concealment route and one useful vertical/climb opportunity where theme permits;
- intentional dead-end hiding spots are rare and clearly high-risk;
- no accidental dead ends from collision clutter;
- large props need camera recovery space around them;
- landmarks remain stable across randomization;
- secondary clutter can vary by round without destroying navigation.

Use blockout first. Do not add final art until the greybox proves:
- traversal;
- sightlines;
- hiding density;
- camera clearance;
- spawn safety;
- round pacing.

======================================================================
21. LANDMARKS, GUIDANCE AND READABILITY
======================================================================

Players should build a mental map quickly without needing constant arrows.

Use:
- distinct silhouettes;
- lighting contrast;
- color/material accents;
- unique sounds;
- large recognizable props;
- visible exterior orientation;
- different floor/ground materials by zone.

Papa's yellow tattered chair by the fireplace remains a permanent shop landmark.
Barn, tractor/equipment yard and pen zones should also read as unmistakable anchors.

Avoid visual noise where hunters need to parse props. Clutter should create hiding opportunities, not make every square meter equally chaotic.

======================================================================
22. PROP ECOLOGY AND HIDING QUALITY
======================================================================

A good Prop Hunt map needs believable prop grammar.

Environment props should be arranged with enough consistency that a hider can imitate the world, but enough variation that hunters must observe rather than memorize one exact layout.

Each major zone should include a healthy mix of:
- small props;
- medium props;
- large/risky props;
- props near walls;
- props in clusters;
- props on surfaces;
- some open/exposed props;
- some vertical/climb-related props.

Disguise choices must use gameplay colliders that are fair and stable even if decorative mesh shapes are irregular.

No disguise may:
- fit into gaps smaller than the visible prop suggests;
- clip mostly inside a wall/floor;
- hide its hit volume far away from its visible mesh;
- create a camera pocket that reveals outside geometry;
- become effectively invisible due to scale/lighting.

======================================================================
23. HIDING-PHASE DESIGN
======================================================================

The 30-second hide phase must feel urgent but understandable.

At phase start:
- show the four assigned disguise options clearly;
- show Prop / Decoy / Flash / Lock controls;
- do not cover the screen with a tutorial if the player already skipped/finished it;
- give immediate movement control to hiders;
- hunters remain fully blind and input-locked.

Hider preparation flow:
1. pick an initial prop;
2. move to a plausible area;
3. orient/lock if desired;
4. place decoys deliberately;
5. optionally keep an escape route for the hunt.

If the player is still undisguised near release, provide a clear warning, but do not auto-invent a prop unless an existing rule explicitly supports it.

======================================================================
24. HUNTER SEARCH DESIGN
======================================================================

Hunter play should be about observation plus movement, not simply sweeping the mouse while holding fire.

Support this through design rather than ammo penalties:
- strong prop silhouettes;
- readable tracer/impact so shots feel deliberate;
- map routes that require turning and checking angles;
- vertical hiding possibilities;
- decoys that create uncertainty;
- movement/chase opportunities after a hider is discovered.

Do not add enemy outlines, wall hacks or automatic target reveal.

Aim assist may help input precision, but it may never identify a hidden player that the player has not visually found.

======================================================================
25. MOVEMENT FEEL
======================================================================

Movement is a flagship quality system.

Principles:
- immediate response to directional input;
- acceleration gives body weight without delaying control;
- braking is responsive enough for precise hiding/doorways;
- diagonal input is normalized;
- camera-relative movement is consistent;
- character does not rotate unpredictably when camera crosses behind;
- wall contact slides rather than sticks;
- small steps do not snag;
- slope handling is predictable;
- jump input uses buffering and coyote time;
- landing returns control quickly;
- mantle is validated and never teleports through ceilings/walls.

Initial tuning direction:
- joystick dead zone around 8-12 percent;
- walking available through partial analog input;
- normal run as the primary full-stick speed;
- sprint roughly 20-35 percent faster than run, tuned by actual map scale;
- jump buffer approximately 120-180 ms;
- coyote time approximately 100-140 ms;
- maintain useful but limited air steering;
- no animation may delay the first visible response to movement input.

Use measured tuning rather than copying arbitrary values from another game.

======================================================================
26. MANTLE AND CLIMB SYSTEM
======================================================================

Jump should also attempt a safe mantle when the player is moving toward a valid ledge.

A mantle candidate must validate:
- forward obstruction;
- reachable top height;
- walkable top surface;
- head/character clearance;
- destination collision;
- camera clearance where possible;
- climbable surface rules.

Use at least low and high mantle categories if the animation set supports them.

Failure behavior:
- if mantle is invalid, perform a normal jump or remain grounded as appropriate;
- never freeze input;
- never place the player inside geometry;
- never allow climbing through roofs or closed walls.

Papa's Shop benchmark surfaces include:
- tractor;
- reasonable workbench edges;
- hay/storage routes;
- selected lumber/pallet stacks;
- pen/fence sections intended as traversal;
- barn loft access.

======================================================================
27. THIRD-PERSON CAMERA SYSTEM
======================================================================

Camera quality is a release blocker.

General camera requirements:
- camera follows a solved target point rather than raw origin transforms;
- first frame, respawn and teleport snap to a valid solved view before easing;
- camera collision uses multiple candidates rather than one fragile ray;
- decorative `solid:false` geometry does not block the camera;
- camera tries shoulder/lift/pitch alternatives before collapsing distance;
- sustained collapse triggers automatic recovery;
- Reset View remains available;
- camera cannot become stuck top-down, under roofs, inside the character or inside a prop.

Default hunter framing:
- close right-shoulder view;
- character occupies roughly the left third rather than screen center;
- weapon and hands remain visible;
- crosshair area remains clear;
- shoulder swap available;
- camera may pull slightly back when sprinting or in tight combat if it improves readability.

Hider framing:
- slightly wider situational view;
- camera pivot and near/far distance recalculate from disguise bounds;
- prop transformation cannot inherit an invalid humanoid camera pocket;
- very small props must not put the camera on the floor;
- very large props must not push the camera through walls.

Camera settings:
- default vertical FOV around 58-65 degrees as a starting point, then tune on real target devices;
- allow a reasonable FOV range if the settings architecture supports it;
- separate look sensitivity from FOV;
- reduce camera shake independently from recoil/feedback.

======================================================================
28. HUNTER AIM AND WEAPON SYSTEM
======================================================================

The prop-zapper must be visible, readable and mechanically aligned with the crosshair.

Shot pipeline:
1. screen-center crosshair defines intended camera ray;
2. camera ray resolves intended world point;
3. character upper body and weapon aim toward that point;
4. physical weapon muzzle checks for a blocking wall/object between muzzle and target point;
5. authoritative hit validation uses the final legal shot;
6. muzzle flash, beam/tracer and impact render along that same shot result;
7. hit marker/audio only confirm actual hider damage.

No parallax lie is acceptable where the crosshair, beam and damage disagree.

Weapon presentation:
- right hand = trigger hand;
- left hand = support hand using IK or equivalent constraint;
- weapon cannot float;
- wrist/palm directions are anatomically correct;
- no backwards hands;
- weapon stays visible while walking, strafing and ordinary jumping;
- sprint may lower the weapon slightly but must transition back quickly;
- no conventional reload is required because ammo is unlimited;
- a brief zapper recharge/cooldown visual may communicate controlled fire rate without pretending ammo is limited.

Feedback per shot:
- muzzle flash;
- visible fast beam/tracer;
- impact effect at actual collision point;
- restrained recoil;
- audio;
- optional haptic pulse;
- material-aware impact variation where practical.

Hider hit feedback:
- stronger hit marker;
- short target shake/react;
- distinct audio cue;
- health update;
- no identity reveal until elimination.

======================================================================
29. MOBILE HUNTER CONTROLS
======================================================================

Default layout:
LEFT SIDE
- movement joystick;
- sprint integrated as joystick threshold or separate reachable button depending playtest preference.

RIGHT SIDE
- open drag zone for camera look;
- large Shoot button;
- large Jump/Mantle button;
- smaller shoulder-swap button;
- Reset View accessible but separated from combat actions.

No Aim button.

Requirements:
- player can move + look + shoot at the same time;
- player can move + look + jump at the same time;
- Shoot does not steal the pointer used for camera look;
- camera drag does not begin when the player intended to press Shoot;
- actions use large hit boxes even if art is visually compact;
- UI respects safe areas;
- landscape and portrait policies are explicit rather than accidental.

Default target is landscape for full 3D Prop Hunt unless a later phone test proves portrait genuinely superior.

======================================================================
30. MOBILE HIDER CONTROLS
======================================================================

Default layout keeps movement and camera consistent with hunter controls so role switching does not force relearning.

Role-specific right-side actions:
- Jump/Mantle;
- Prop;
- Flash;
- Decoy;
- Lock/Unlock;
- Sprint where used;
- Reset View.

Resource count appears on or immediately adjacent to the action:
- Prop: changes remaining;
- Decoy: remaining/10;
- Flash: Ready or spent;
- Lock: Locked/Free state.

Avoid stacking six identical round buttons in one cluster. Use visual hierarchy and thumb reach.

Provide at least:
- Default layout;
- Large Buttons layout;
- Left-Handed mirrored layout.

A future custom drag-to-position editor is optional, not required before core controls feel excellent.

======================================================================
31. DESKTOP AND GAMEPAD CONTROLS
======================================================================

DESKTOP DEFAULT
- WASD: movement;
- mouse: look;
- Left Mouse: Shoot for hunter;
- Space: Jump/Mantle;
- Shift: Sprint;
- C: shoulder swap;
- R: Reset View;
- hider role actions use clear remappable keys, preserving existing E/F/Q/L choices where practical unless usability testing supports a cleaner map.

Do not require Right Mouse Aim.

GAMEPAD DEFAULT
- left stick: movement;
- right stick: look;
- right trigger: Shoot hunter;
- south face button: Jump/Mantle;
- left stick click or a comfortable shoulder/face action: Sprint, with toggle option;
- shoulder action: camera shoulder swap;
- hider abilities use available face/shoulder buttons and always show correct glyphs where the web platform exposes mapping data.

Provide dead-zone and sensitivity settings.

======================================================================
32. HIDER TRANSFORMATION SYSTEM
======================================================================

Transformation must be reliable before it is pretty.

On prop change:
1. validate requested prop is one of the player's assigned legal options;
2. validate remaining change count;
3. choose a safe placement/collider solution;
4. update gameplay collider separately from decorative mesh if needed;
5. preserve world-facing direction unless the prop needs a safe snapped orientation;
6. recalculate camera target/clearance;
7. refresh flash per locked rules;
8. continue health unchanged;
9. show a short transformation effect;
10. return full movement control immediately.

If placement is invalid:
- show a clear invalid-placement response;
- search a small nearby safe placement only if it does not move the player unfairly;
- otherwise cancel without consuming the disguise change.

Never consume a limited resource because of a collision-system failure.

======================================================================
33. PROP LOCKING
======================================================================

Locking communicates `I am pretending to be part of the environment`.

Locked state should:
- stabilize visual orientation/position;
- make subtle movement/bob stop;
- keep collision valid;
- preserve camera control;
- be obvious in HUD;
- never trap the player.

Unlock should be immediate.
If movement while locked is not allowed by current implementation, movement input should clearly unlock or be rejected with readable feedback according to the established rule. Do not leave the player wondering why the joystick stopped working.

======================================================================
34. DECOY SYSTEM
======================================================================

Decoy placement should feel deliberate.

Requirements:
- preview legal/illegal placement where practical;
- place near/in front of the player rather than at an ambiguous hidden origin;
- validate support and collision;
- avoid walls and required routes;
- use a small placement effect/audio cue;
- decrement exactly one from the hider's ten total decoys;
- authoritative multiplayer state prevents duplicates;
- decoys visually match the relevant prop type enough to create mind games;
- decoys do not create collision traps.

======================================================================
35. FLASH SYSTEM
======================================================================

Each disguise grants one flash use.

Flash feedback:
- short world-space burst;
- clear activation sound;
- affected hunter receives a brief readable flash effect;
- reduced-motion/accessibility setting can reduce intensity;
- effect never becomes a long full-white screen;
- no photosensitive strobing;
- exact availability is visible to the hider.

======================================================================
36. CHARACTER IDENTITY PIPELINE
======================================================================

Approved turnaround images are the character source of truth.

Production workflow for each character:
1. approved five-view turnaround;
2. orthographic modeling reference extraction;
3. silhouette/proportion blockout;
4. front/side/back comparison render;
5. head/face/hair pass;
6. clothing/footwear pass;
7. shared-rig skinning;
8. neutral animation deformation test;
9. Prop Hunt weapon/aim test;
10. phone LOD/material test;
11. five-view final comparison;
12. only then set `approvedModel: true`.

Use silhouette overlays or side-by-side proof rather than judging from memory.

======================================================================
37. CHARACTER MODEL QUALITY STANDARD
======================================================================

Human LOD0 target for Prop Hunt close camera: approximately 8k-12k triangles.

Spend that detail on:
- face planes and rounded cheeks/jaw;
- eyelids/eye seating;
- nose and mouth volume;
- hair silhouette/clumps;
- hands/thumbs;
- collar/hood/apron/skirt/belt/boot volume;
- clean shoulder/elbow/knee deformation.

Do not spend it on:
- individual hair strands;
- tiny seams;
- hidden geometry;
- micro-wrinkles;
- photoreal pores.

Face standard:
- eyeballs sit inside the head, not on the surface;
- eyelids follow the eyeballs;
- nose has side/profile volume;
- mouth has volume and can smile/frown subtly;
- glasses anchor to nose/ears;
- beard/moustache follows facial planes;
- ears are placed consistently from front/side views.

Hair standard:
- main skull mass plus secondary clumps;
- preserve exact approved silhouette;
- curls/waves read as grouped forms;
- no helmet blob;
- no expensive strand simulation.

======================================================================
38. APPROVED CHARACTER PRODUCTION CARDS
======================================================================

The images still outrank text. These notes clarify what must read during gameplay.

JOHN BLACK
- sturdy/stocky approved cartoon build;
- short brown side-swept hair;
- full short brown beard;
- red/black plaid shirt;
- blue jeans;
- brown belt/work boots;
- hunter stance solid/confident;
- beard and plaid must remain readable at normal camera distance.

KRISTEN
- approved adult female proportions;
- shoulder-length wavy blonde hair;
- black fitted short-sleeve top;
- blue jeans;
- brown belt/boots;
- keep silhouette simple and recognizable.

HOLLY
- child proportions;
- bright blonde double buns;
- approved cream padded sweater/vest look;
- blue backpack/straps;
- blue pants;
- brown shoes;
- youthful rounded face and smaller body scale.

VANESSA
- long voluminous golden-blonde curls;
- burgundy/dark-red long-sleeve top;
- blue jeans;
- brown belt/boots;
- confident posture;
- curls are the dominant silhouette feature.

ELIZABETH / LIZZIE
- child proportions;
- bright blonde high ponytail;
- large pink bow;
- pink hoodie/top;
- pink skirt with white polka dots;
- white socks;
- pink Croc-style shoes;
- restrained ponytail secondary motion only.

LOGAN
- boy/young-teen proportions;
- short messy/spiky blonde hair;
- black fishing/outdoor-logo hoodie;
- dark cargo pants;
- tan/brown work boots;
- energetic personality may appear in idle/reactions, not speed advantage.

JAMES
- older adult compact cartoon proportions;
- short clustered grey curls;
- grey moustache;
- round glasses;
- bright blue button-up shirt;
- blue jeans;
- brown belt/shoes;
- age reads through silhouette/hair/posture, not photoreal wrinkles.

DOROTHY
- older adult compact rounded proportions;
- blonde high updo/bun;
- no glasses;
- blue long-sleeve dress/top;
- cream floral apron;
- blue shoes;
- apron is a major silhouette layer and must deform cleanly.

PAPA, NANA, KELSI, MOLLY, GUNNER
- remain turnaround-pending;
- current compatibility art may remain;
- do not invent final W.10 models until each individual turnaround is approved.

======================================================================
39. SHARED HUMANOID RIG STANDARD
======================================================================

Use one semantic humanoid rig wherever practical.

Required chain:
root -> hips -> lower spine -> chest -> neck -> head
left/right clavicle -> upper arm -> forearm -> hand
left/right thigh -> shin -> foot -> toe where useful

Rig rules:
- one documented forward axis;
- no runtime negative-scale mirroring of hand skeletons;
- freeze/apply transforms before export;
- elbows/knees bend anatomically;
- shoulders preserve volume during two-hand aim;
- foot IK may adapt to reasonable terrain;
- upper-body aim layers independently over lower-body locomotion;
- excessive spine twist triggers whole-body turn;
- head tracking is subtle and clamped.

Gameplay sockets:
- rightHand;
- leftHand;
- rightHandSocket;
- leftHandSupportTarget;
- weaponMuzzle;
- weaponSightTarget;
- back;
- HeadTop;
- Face;
- ChestAccessory.

======================================================================
40. ANIMATION SYSTEM STANDARD
======================================================================

Base locomotion coverage:
- relaxed idle;
- hunter-ready idle;
- forward walk/run;
- backpedal;
- strafe left/right;
- sprint;
- start/stop;
- turn in place;
- jump start;
- fall;
- soft land;
- hard land;
- crouch where used;
- low mantle;
- high mantle;
- fire/recoil;
- hit reaction;
- celebrate;
- transform;
- decoy placement;
- flash use.

Animation principles:
- gameplay input owns responsiveness;
- animation expresses motion, it does not veto valid input;
- avoid foot skating with speed-aware blending;
- avoid hard state snaps;
- use upper-body additive/aim layers;
- keep weapon grip stable through locomotion;
- character-specific personality belongs mainly in idle, reaction and celebration layers so gameplay remains fair.

======================================================================
41. COLLISION AND RECOVERY STANDARD
======================================================================

Common failure modes are release blockers:
- pinned player;
- invisible snag strip;
- camera collapsing into head;
- camera stuck top-down;
- spawn inside geometry;
- transformation inside geometry;
- mantle through roof;
- decorative mesh blocking camera.

Use:
- stable gameplay capsule/body collider;
- sensible skin width;
- slope/step handling;
- sub-step movement at high speed;
- wall sliding;
- safe spawn validation;
- camera-pocket validation;
- transform destination validation;
- sustained-invalid-state recovery.

Recovery must be conservative. Do not teleport during ordinary wall contact.

======================================================================
42. PROP HUNT MAP RANDOMIZATION
======================================================================

Use hybrid randomization.

Permanent anchors:
- main shop;
- barn;
- fireplace/Papa chair;
- major pen zones;
- property boundary/orientation.

Round-variable secondary elements may include:
- lumber arrangements;
- barrels/crates/pallets;
- portable equipment;
- selected doors starting open/closed;
- tractor/trailer parking in validated zones;
- hay clusters;
- workbench clutter;
- selected pen objects;
- rare harmless interactions.

Randomization must be seeded/authoritative and must pass route validation before the round begins.
If a generated arrangement blocks a required route or spawn, reject that arrangement and use a safe alternative.

======================================================================
43. WEATHER AND AMBIENCE
======================================================================

Per-round presets may include clear, sunset, overcast, light rain, light snow, fair fog and windy/cloud movement.

Rules:
- one preset remains stable for the whole round;
- weather does not alter collision;
- fog never becomes strong enough to materially hide one team;
- particles never obscure crosshair/hit feedback;
- snow/rain budgets scale on mobile;
- ambience does not reveal hider positions unfairly;
- positional hider audio remains protected during hide phase.

======================================================================
44. SPECTATOR EXPERIENCE
======================================================================

Classic eliminated players should remain entertained.

Provide:
- free-fly ghost mode;
- follow-living-player camera;
- next/previous target;
- return to free fly;
- no gameplay collision;
- no ability to interact;
- no information channel that can reveal hidden players to hunters through the game systems.

Family Chaos conversion must not accidentally trigger Classic spectator mode.

======================================================================
45. BOT DESIGN
======================================================================

Bots exist to keep games playable, not to demonstrate perfect AI.

Hunter bots:
- blind/frozen during hide phase;
- use believable search routes;
- do not read hidden hider transforms or exact positions;
- detection is based on legal visible information;
- aim skill respects difficulty level;
- avoid robotic instant 180-degree shots.

Hider bots:
- choose legal assigned props;
- move during hide phase;
- place reasonable decoys;
- use flash/escape sometimes;
- do not exploit collision inaccessible to humans.

Bot difficulty should change reaction/search/aim competence, not cheat access to hidden state.

======================================================================
46. ACCESSIBILITY AND COMFORT IN PROP HUNT
======================================================================

At minimum provide or plan for:
- sensitivity sliders;
- invert X/Y;
- reduced camera shake;
- haptic intensity/off;
- aim assist Off/Light/Standard for touch/gamepad;
- sprint hold/toggle/auto preference;
- large-button touch preset;
- left-handed touch preset;
- text/icon plus audio for important transitions;
- no flashing/strobing effects that can be avoided;
- brief flash-grenade exposure with reduced-motion/flash intensity option if practical;
- objective/role instructions reviewable from pause/How To.

Accessibility assists must not reveal hidden players or create competitive information that normal players do not have.

======================================================================
47. GAME FEEL AND FEEDBACK STACK
======================================================================

Every important action should answer three questions:
- Did my input happen?
- What did it affect?
- What can I do next?

Examples:
Shoot:
- input -> muzzle flash/audio immediately;
- beam -> actual impact;
- world hit -> surface response;
- hider hit -> stronger hit marker/audio/target reaction;
- elimination -> break effect + family cue + score state.

Transform:
- selection -> highlighted card;
- validation -> placement state;
- transform -> brief effect/sound;
- resource count -> updates;
- camera -> settles around new prop;
- control -> immediately returns.

Mantle:
- jump input -> immediate jump/mantle intent;
- valid ledge -> body commits;
- landing -> grounded response;
- invalid ledge -> normal jump/fallback, never frozen character.

======================================================================
48. PERFORMANCE BUDGETING FOR PAPA'S SHOP
======================================================================

The expanded property may contain hundreds of visible props and approximately 150 gameplay-meaningful/interactable objects, but it must be architected rather than brute-forced.

Use significance tiers:
TIER 1 - local player, nearby players, aimed-at/active props, weapon effects.
TIER 2 - nearby animated environment/animals/interactions.
TIER 3 - distant characters/ambient life.
TIER 4 - static scenery.

Scale updates, animation and shadows by significance.

Recommended initial WebGL targets on a representative mid-range phone:
- keep active draw calls as low as practical; use an initial engineering target around 150-200 visible draw submissions and revise from profiling rather than treating it as a sacred number;
- avoid more than a small handful of dynamic shadow-casting hero objects at once;
- use instancing for repeated fences, pallets, barrels, lumber pieces, vegetation and similar repeated props;
- keep temporary shot/impact objects pooled;
- use LOD/culling so the entire eight-times-larger property is not fully expensive at once;
- monitor JS heap, GPU memory proxies and context-loss events during a 15-minute soak.

Performance acceptance is based on actual profiling, not asset-count assumptions.

======================================================================
49. PLAYTEST METRICS AND LOCAL QA TELEMETRY
======================================================================

Because this is a private family app, telemetry should be local/developer-oriented by default. Do not add third-party analytics without explicit permission.

Useful debug events/counters:
- cameraResetUsed;
- automaticCameraRecovery;
- stuckRecovery;
- mantleAttempt / mantleSuccess / mantleFailReason;
- transformAttempt / transformSuccess / transformFailReason;
- decoyPlacementFail;
- shotFired;
- shotWorldHit;
- shotHiderHit;
- elimination;
- frameTimeP50 / P95 / P99;
- WebGL context loss;
- round duration;
- role win;
- time to first hider discovery;
- time spent in each map zone.

Use these to diagnose design, not to judge family players.

Balance target direction:
- over enough mixed-skill playtests, neither hunters nor hiders should dominate every map;
- a rough 40-60 percent band per side is a useful investigation threshold, not a rule to force from tiny samples;
- if balance is off, inspect spawn/routing/prop ecology/hunter count before adding artificial power-ups.

======================================================================
50. PROFESSIONAL PLAYTEST METHOD
======================================================================

For every major Prop Hunt iteration, run three types of test.

A. FIRST-TIME PLAYER TEST
Do not explain controls verbally beyond what the game itself teaches. Observe where the player hesitates.

B. EXPERT/DEVELOPER STRESS TEST
Try to break camera, collision, mantle, transform, decoy placement, boundary and networking.

C. FAMILY MATCH TEST
Play full rounds with normal conversation and distractions. Observe whether people understand what happened and whether the round creates funny/replayable moments.

Record:
- confusion points;
- accidental inputs;
- camera discomfort;
- stuck locations;
- unreadable hits;
- hiding spots everyone uses;
- zones nobody visits;
- controls players miss;
- moments players laugh/talk about afterward.

Fix repeated player confusion before adding new content.

======================================================================
51. PAPA'S SHOP JOHN VERTICAL-SLICE GATE
======================================================================

John is the first production gate. He must pass the complete actual-phone vertical-slice gate before the upgraded character/controller is propagated to the rest of the family.
For the hunter pose, the right hand on the trigger and the left hand supporting the fore-end are mandatory. Shooting must include a visible 3D energy tracer, and the proof must be captured on an actual phone.

Do not propagate the W.10 character/control system until one actual-phone capture proves all of these at the same time:

JOHN VISUAL
- unmistakably matches approved John turnaround;
- correct skin/hair/beard/plaid/jeans/boots;
- dimensional face and hair, not blocky;
- hands face anatomically correct direction;
- no severe arm/shoulder deformation;
- close-camera silhouette looks intentional from front 3/4, side and rear play angles.

HUNTER CONTROL
- stable right-shoulder camera;
- move + look + shoot simultaneously;
- jump/mantle works;
- sprint feels controllable;
- shoulder swap works;
- Reset View works;
- no top-down collapse;
- no pinned spawn.

WEAPON
- prop-zapper is clearly visible;
- right trigger hand grips correctly;
- left support hand remains on weapon;
- crosshair is clear;
- shot beam is visible;
- impact is visible;
- beam/crosshair/hit result agree;
- muzzle blocked by wall cannot shoot through wall.

HIDER
- transformation safe;
- camera adapts to prop;
- lock/unlock works;
- decoy placement works;
- flash works;
- jump/mantle works while disguised where allowed;
- resource counts remain correct.

PERFORMANCE
- sustained gameplay meets the target device's acceptable frame-rate tier;
- no major recurring stutters from shots/transforms;
- no WebGL errors/context loss in normal test.

Only after this gate passes can the shared implementation be called `PROVEN_PROP_HUNT_CHARACTER_CONTROLLER` or equivalent.

======================================================================
52. WHOLE-APP LOCKED RECENT CHANGES
======================================================================

Preserve the following recent W.6-W.8 requirements.

VANESSA'S PIPE PROBLEM / TRUCK WASH
- water reaching the grey GMC is the win condition;
- show clear win and advance to next level;
- truck is grey with only the letters GMC shown in pink;
- dimensional pipes, sockets/couplers/bolts, flow and worksite art.

LOGAN'S TRAIL LOGIC
- visual How To/tutorial;
- per-player tutorial choice;
- starts easier;
- early level shows one locked correct bike;
- difficulty grows through larger boards;
- dirt-bike icon must read as a dirt bike.

MEXICAN TRAIN
- game board is outside/above decorative table framing and easy to see;
- all personal dominoes are visible/reachable;
- player can rearrange personal domino rack.

GOLF
- player does not have to flip/replace the last card merely because a stock card was drawn;
- drawn stock card may be discarded while keeping all eight current cards;
- final-turn behavior follows the locked family rule;
- own eight cards and opponents' layouts are readable.

MITTS / GLOVES / SOCKS
- captured cards/points remain visibly in front of the player/team;
- active center pile remains distinct;
- presentation should resemble physical table play.

NANA'S GOAT WHACK
- animals are more dimensional and less blocky;
- point values and do-not-hit object are visible beside gameplay.

KELSI
- Kelsi's Rock 'n' Roll Rescue replaces Neon Star Patrol;
- old separate Kelsi game is removed/redirected according to W.6.

ARCADE TUTORIALS
- every active arcade game has in-game How To;
- detailed visual step tutorial;
- per-player show/skip choice remembered;
- tutorial can always be reopened.

TOKENS STORE
- earned-only Arcade Tokens;
- hats, glasses and accessories;
- cosmetic-only, identity-safe;
- unlocked items persist and can be equipped/removed.

======================================================================
53. 31 BLIND MODE LOCK
======================================================================

31 Blind mode is now defined.

Blind player starts with exactly 3 face-down cards in front of them and does not see those cards. If the player takes the discard, they replace one of their face-down cards without looking at the replaced card. They may pass and wait for the next turn.

Blind player:
- starts with exactly 3 cards face down in front of them;
- does not look at those cards;
- on a turn may choose one of three actions:
  1. flip one of their own face-down cards and keep it;
  2. take the top card from the discard pile and replace one chosen face-down card without looking at the replaced face-down card;
  3. pass and wait for the next turn;
- once one of the player's own cards is flipped and kept, it remains face up for the rest of the round.

Do not invent additional Blind scoring/end conditions beyond the existing 31 rules unless the user clarifies them.

======================================================================
54. DEFINITION OF DONE BY FEATURE TYPE
======================================================================

RULE FEATURE DONE
- rule documented;
- unit tests cover edge cases;
- main gameplay loop proves it;
- multiplayer authoritative state agrees;
- UI communicates it.

CONTROL FEATURE DONE
- works on target inputs;
- simultaneous-input cases work;
- sensitivity/dead zone tuned;
- no accidental input overlap;
- tested on actual phone for touch claims.

CHARACTER FEATURE DONE
- approved turnaround exists;
- model five-view proof matches;
- rig deformation passes;
- gameplay animation passes;
- LOD/material performance passes;
- actual in-game screenshot looks correct;
- only then model is flagged approved.

3D MAP FEATURE DONE
- blockout routes pass;
- collision pass;
- camera pass;
- visual pass;
- performance pass;
- full-round playtest;
- actual-phone proof.

ZIP RELEASE DONE
- tests pass;
- validator passes;
- archive integrity passes;
- exact ZIP cold extraction passes tests;
- changed-files report exists;
- known limitations are stated.

======================================================================
55. RELEASE PROOF BUNDLE
======================================================================

Every major 3D release should include, where tools allow:
- build/test report;
- changed-files list;
- performance/debug summary;
- at least one desktop gameplay screenshot;
- at least one target-phone gameplay screenshot supplied by real device or clearly labeled simulator/preview if not real device;
- character comparison proof for any newly approved model;
- short list of known limitations.

Do not substitute a bind-pose render for actual gameplay proof.

======================================================================
56. FORBIDDEN SHORTCUTS
======================================================================

Do not:
- silently redesign approved characters;
- mark unapproved GLBs approved;
- use fake manifests to imply assets exist;
- fix backwards hands by hiding the entire arm/weapon;
- solve camera collision by moving to permanent top-down view;
- make props tiny/invisible to solve hiding balance;
- add wall outlines to solve hunter difficulty;
- reduce the world to empty boxes to hit fps;
- add input delay so animation looks smoother;
- use giant full-screen effects that hide gameplay;
- make mobile buttons microscopic to preserve art;
- claim automated tests prove visual quality;
- rewrite unrelated game engines during a focused Prop Hunt pass;
- add major unapproved rules because they sound standard in another Prop Hunt game.

======================================================================
57. NEXT IMPLEMENTATION PRIORITIES
======================================================================

Priority 0 - preserve W.8 known-good build and W.9 approved prompt history.

Priority 1 - W.10 John + controls vertical slice
- approved John in actual gameplay;
- correct rig/hands;
- close shoulder camera;
- responsive movement;
- mantle;
- visible prop-zapper;
- aligned shots and impacts;
- mobile control presets;
- local QA counters.

Priority 2 - Papa's Shop gameplay blockout/route proof
- ensure full expanded map supports the improved controller;
- resolve camera/collision traps;
- validate prop ecology/disguise pool;
- full five-minute round.

Priority 3 - hider polish
- transform safety;
- lock;
- decoy preview/placement;
- flash comfort/readability;
- disguised traversal.

Priority 4 - multiplayer/bots/soak
- remote interpolation;
- reconnect;
- hide-phase privacy;
- bot fairness;
- 15-minute mobile soak.

Priority 5 - propagate to remaining turnaround-approved humans one at a time.

Priority 6 - finish remaining family turnarounds, then authored models.

Do not jump to Priority 5 or 6 merely because Priority 1 is difficult.

======================================================================
58. WHOLE-APP HOME LIBRARY AND NAVIGATION CONTINUITY
======================================================================

Preserve the lodge as one coherent entry point.

Primary shelf order remains:
1. Card Games.
2. Board & Tabletop Games.
3. 3D Family Games.
4. Arcade Corner.

The categories may have different visual personality, but they must still feel like one cabin/lodge product.

Home-screen principles:
- current/seasonal family event can receive a prominent hero treatment without burying normal game access;
- game cards communicate game type and player count quickly;
- Requests replaces Store for the original app navigation where that rename is already locked, while the W.8 Tokens Store remains a separate explicit cosmetic-rewards destination;
- Leaderboards show player names and games won according to the locked W. living-app direction;
- Avatars opens character selection and then outfit/cosmetic choices;
- How to Play opens the game list and relevant visual demo/tutorial;
- post-game choices offer Play Again/Reshuffle where applicable or return to the game shelf without destroying the room unnecessarily.

Do not make the lodge more decorative at the cost of slower access to games.

======================================================================
59. WHO'S PLAYING / ASK TO JOIN CONTINUITY
======================================================================

Preserve the shared social presence system where already implemented or specified.

The home experience should make it possible to understand:
- who is currently playing;
- which game/room they are in where privacy rules allow;
- whether a player can request to join;
- whether the request was accepted or declined;
- how reconnect behaves if the player leaves and returns.

Ask-to-Join is a social convenience, not a bypass around host/room rules.
Do not create duplicate room membership or duplicate player identity if a reconnect token already exists.

======================================================================
60. SEASONAL, BIRTHDAY AND FAMILY-EVENT CONTINUITY
======================================================================

Preserve the living-app event system from Phase W.

Event principles:
- events have explicit windows rather than permanently replacing the normal home screen;
- overlapping events blend predictably rather than stacking every decoration;
- event decorations must not obstruct game access or controls;
- event rewards remain cosmetic/memory/progression oriented rather than power advantages.

Birthday principles:
- the birthday person is featured prominently near the top of the home screen during their event window;
- show their approved avatar/character identity, name and birthday decoration;
- provide a prominent Birthday Challenge button that opens that year's personalized mini-event;
- first open during the event window may show a short personalized greeting sequence;
- family-character greetings are individual pop-ins/reactions rather than one generic combined message;
- dogs may use visual/sound reactions where spoken dialogue is inappropriate;
- after the first viewing, the greeting can be skipped so repeat visits are not interrupted;
- birthday rewards and memories are celebratory, not gameplay power;
- photos/memories remain a family-memory feature rather than a public social network.

======================================================================
61. TABLETOP AND CARD GAME RULE AUTHORITY
======================================================================

W.10 does not rewrite established family card/table rules.

Before changing any tabletop/card mechanic, read the relevant locked rule/test files and preserve the current rule engine unless the user explicitly changes the family rule.

Examples of especially sensitive locked behavior include:
- Screw Your Buddy / Fuck Your Buddy bidding, trump and scoring distinctions;
- Smear bidding/trump/scoring and six-card visibility before bidding;
- Black Gammon starting layout and special dice semantics;
- Backgammon standard legal movement/bar/bear-off/doubling behavior;
- Golf's eight-card family rules including the W.6 discard-without-forced-flip behavior;
- 31 standard rules plus the W.10 Blind definition in this prompt;
- Cribbage sorting and send-to-crib flow;
- Mexican Train personal rack visibility/rearrangement;
- any game-specific tests that encode an explicitly approved rule.

When visual polish and rule correctness conflict, rule correctness wins and the visual treatment must adapt.

======================================================================
62. PERSISTENCE, DATA OWNERSHIP AND SAFETY
======================================================================

Use one coherent profile/persistence model where possible.

Persist only what improves the private family experience, such as:
- profile name/avatar/color;
- cosmetic unlocks/equipment;
- Arcade Tokens;
- tutorial-completion preference;
- achievements/high scores;
- family game history where already supported;
- birthday/event memory metadata;
- room/reconnect identity as required.

Rules:
- do not invent a second competing wallet/profile database;
- validate token grants server-side where a server-authoritative path exists;
- token rewards must be idempotent so reconnect/retry cannot duplicate them;
- do not expose hidden Prop Hunt state to unauthorized clients;
- do not add third-party analytics, advertising or tracking to this private family app unless explicitly requested;
- local developer QA telemetry described in W.10 should avoid collecting unnecessary personal information.

======================================================================
63. PRODUCTION SCORECARD
======================================================================

For a major feature, the development team should score the candidate from 1 to 5 in each category before calling it release-ready:
- Rules/logic correctness.
- Input responsiveness.
- Camera/readability.
- Character/object visual fidelity.
- Animation/game feel.
- Audio/feedback.
- Mobile ergonomics.
- Performance/frame pacing.
- Multiplayer/reconnect robustness.
- Tutorial/first-time clarity.
- Accessibility/comfort settings.
- Regression safety.

A score of 1 or 2 in any core category blocks release.
A score of 3 means functional but needs explicit acceptance as a known limitation.
A score of 4 means strong release quality.
A score of 5 means a reusable benchmark for other games.

For Prop Hunt John/Papa's Shop, do not propagate the system until the core categories are at least 4 on the actual target phone, not just in desktop browser testing.

======================================================================
64. CHANGE CONTROL AND SCOPE DISCIPLINE
======================================================================

Every phase should classify requested work as one of:
- Rule correction.
- Playability repair.
- UX/readability improvement.
- Visual fidelity improvement.
- Performance/technical debt.
- New content.

Resolve in roughly that order unless the user explicitly prioritizes something else.

If a new request arrives during an unfinished flagship repair:
- preserve it in the master prompt/backlog;
- do not silently abandon the flagship quality gate;
- separate unrelated code changes into their own phase when possible.

Historical documents remain archived so a later developer can understand why a decision exists, but historical wording does not outrank the W.10 precedence table.


======================================================================
65. FINAL INSTRUCTION TO THE DEVELOPMENT AGENT
======================================================================

Treat Black Family Game Night as a real game product with a small-team production budget.

Do not optimize for the amount of code written, the number of tests generated or the number of features touched.

Optimize for:
- clarity;
- responsiveness;
- family identity;
- fair multiplayer;
- mobile comfort;
- stable performance;
- readable game state;
- fun full-round play;
- evidence that the thing actually works on the device people will use.

For Prop Hunt specifically, the next milestone is not `more 3D`.

The milestone is:

> ONE APPROVED JOHN, IN ONE EXCELLENT PAPA'S SHOP ROUND, WITH CONTROLS, CAMERA, HANDS, WEAPON, SHOOTING, HIDING AND PERFORMANCE THAT FEEL FINISHED ON A PHONE.

Once that exists, scale the proven system outward.
