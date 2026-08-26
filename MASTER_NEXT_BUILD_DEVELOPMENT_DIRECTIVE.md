# BLACK FAMILY GAME NIGHT
# MASTER NEXT-BUILD DEVELOPMENT DIRECTIVE

## Build Focus
**Prop Hunt P2 Character & Animation Visual Gate + Backgammon / Black Gammon Playability & Board UX Rebuild**

## 1. Primary objective
Continue from the actual latest working project build and materially improve what the family sees and plays. This build has two priority workstreams:

1. **Family Prop Hunt P2**: establish John as the first genuinely polished family character, improve animation/game feel around that authored character, preserve the repaired camera and controls, and strengthen Papa's Shop as the flagship 3D visual benchmark.
2. **Backgammon + Black Gammon**: make the board the dominant play surface, fix rolling reliability, remove the visible blue-line artifact, preserve all rule engines, and make normal play comfortable on portrait phones, tablets, and desktop.

These are focused upgrades. They are not permission to redesign unrelated finished work.

## 2. Start from the actual latest build
Before any major change:
- inspect the current source and assets;
- identify working systems;
- preserve them instead of recreating them;
- reuse shared 3D, multiplayer, tabletop, bot, and reconnect infrastructure;
- repair the actual failure rather than hiding it under another UI layer.

Do not perform a giant blind rewrite.

## 3. Preservation rule
Previously approved or working systems are locked unless this directive specifically requires them to change. Preserve:
- Prop Hunt rules, multiplayer, reconnect, hider/hunter rules, health, disguise, decoy, flash, shooting and round systems;
- the repaired third-person camera, spawn/recovery, collision, jump, mantle and movement systems;
- Island Life and Birthday Seat except for genuinely shared fixes;
- Phase Q Skip-Bo and Cribbage improvements;
- regular Backgammon rules;
- all locked Black Gammon house rules;
- player colors, lobby/seat/Ready flow, chat/reactions, rematch/history/leaderboard;
- Easy-first bots and selectable Medium/Hard difficulty.

If a regression is found, fix the regression without undoing unrelated improvements.

# PART A: FAMILY PROP HUNT P2

## 4. Prop Hunt remains the flagship
Family Prop Hunt is the benchmark 3D game. Do not spread major visual production across every 3D game until this benchmark works. Shared engine fixes may propagate, but visual asset work stays concentrated here.

## 5. P2 visual gate
The success test is: **John must look, animate, aim, fire and move convincingly inside Papa's Shop from the normal gameplay camera.**

Passing unit tests, GLB validation, clip counts, or successful loading do not by themselves pass the visual gate.

## 6. John V2 hero character
Use the existing family reference and approved stylized-realistic direction. Improve:
- head/skull silhouette;
- jaw, chin, cheeks, brow, nose, ears, eye placement and mouth;
- hair volume and hairline;
- beard volume and jaw/moustache relationship;
- neck and shoulder transitions;
- adult torso taper and believable clothing thickness;
- arms, elbows, wrists and hand silhouette;
- legs, knees, boots, soles, heels, toe shape and floor contact.

The character should no longer read as a collection of boxes or tubes. Do not chase photorealism. Prioritize recognizable stylized likeness at gameplay distance.

## 7. John materials
Use game-ready material response for skin, hair, beard, shirt, denim and boots. Avoid plastic skin, uniformly shiny clothes, flat painted-on facial features, and inconsistent material roughness.

The character must remain readable indoors and outdoors.

## 8. Shared character pipeline
John must stay on the reusable authored-character system. Preserve consistent:
- skeleton and joint naming;
- character scale;
- collision capsule;
- camera anchor;
- hand/back/head sockets;
- weapon attachment;
- animation controller;
- clothing tint contract.

The system should later be reusable for the rest of the family rather than becoming a John-only hack.

## 9. Animation set
Keep and refine the authored semantic animation set, including:
- Idle;
- Walk;
- Run;
- Sprint;
- Start Move;
- Stop Move;
- Turn Left / Turn Right;
- Jump;
- Fall;
- Land;
- Mantle;
- Crouch where applicable;
- Aim;
- Fire;
- Hit Reaction;
- Wave / Celebrate / Sit where appropriate.

## 10. Locomotion quality
Tune the animations against real movement speed. Reduce:
- foot skating;
- floating feet;
- floor penetration;
- stiff hips;
- frozen shoulders;
- abrupt transitions;
- snapping turns;
- stride speed that disagrees with actual world speed.

Gameplay responsiveness remains more important than cinematic animation.

## 11. Aim and fire while moving
This is a critical requirement. Use layered animation so:
- lower body continues walking/running/sprinting as appropriate;
- upper body handles weapon hold, aim and fire;
- aiming does not freeze the entire body;
- firing does not replace locomotion with a mannequin pose.

Tune shoulder, elbow, wrist and weapon alignment so the gun remains attached to the hands and points consistently with the crosshair.

## 12. Third-person camera
Preserve the corrected shared camera. Do not reintroduce:
- top-down collapse;
- camera inside avatar;
- roof trapping;
- player visually pinned under geometry;
- severe wall clipping;
- unsafe spawn easing;
- stale/invalid spawn orientation.

Keep obstruction avoidance, multi-candidate solving, first-frame snap, recovery and Reset View.

Once John V2 is in place, retune only the presentation values needed to show him well: shoulder offset, camera distance, vertical angle, doorway transitions, jump visibility and aim composition.

## 13. Mobile and desktop controls
Preserve accessible controls:
- mobile movement joystick;
- camera drag;
- jump;
- shoot;
- sprint;
- prop change;
- flash grenade;
- appropriate aim assistance;
- keyboard/mouse equivalents on desktop.

Aim assistance should help touch users without playing the game for them.

## 14. Papa's Shop benchmark
Preserve the accepted gameplay layout and collision where possible. Improve the visible production layer, not the map logic, including:
- walls, floors, ceilings, beams and doors;
- shelving, workbench and tool areas;
- tractor and motorcycle;
- fireplace and Papa's chair;
- barn and outdoor apron;
- materials, clutter, shadows and local lighting.

## 15. Required Papa's Shop landmarks
Keep and improve:
- Papa's yellow, old, tattered chair with high curved arms beside the fireplace;
- climbable tractor;
- old motorcycle;
- fully searchable attached barn;
- small playable outdoor apron;
- believable workbench/tool areas.

## 16. Shop clutter and prop quality
Props should belong to the environment and remain convincing when used as disguises. Prioritize buckets, toolboxes, stools, cords, gas cans, oil containers, lumber, sawhorses, mugs, beer cases, shop vacs, bins, crates, welding items and machinery.

Where practical, the world prop and disguise should use the same production asset/materials. Do not make player-disguise versions visually cheaper or obviously different.

## 17. Lighting
Lighting is part of the visual benchmark. Preserve readable daylight and add restrained local lighting for shop depth, including fireplace warmth and work-bay/barn fill. Do not hide weak geometry in darkness. Use shadows selectively for characters, major machinery and architecture rather than every small clutter object.

## 18. Performance
Maintain browser/mobile performance using reasonable geometry budgets, texture sizing/compression, asset reuse, instancing, culling, LOD where useful, lazy loading and shared animation/material resources. Do not solve performance by reverting the scene to crude prototype geometry.

## 19. Prop Hunt proof requirement
Before visual signoff, capture real in-engine gameplay proof where tooling permits. Required views eventually include:
1. John idle front three-quarter;
2. side and rear views;
3. walk/run/sprint;
4. turn;
5. jump/fall/land;
6. aim standing and moving;
7. fire while moving;
8. doorway/workbench/tractor scale checks;
9. fireplace/Papa's-chair lighting;
10. interior and outdoor apron views.

If this environment cannot run a trustworthy browser/device proof, say so explicitly and leave phone visual approval open.

## 20. Prop Hunt P2 acceptance criteria
P2 passes only when the visible result is materially better:
- John is more recognizable;
- body and face no longer read as crude blocks;
- hands and boots read acceptably at gameplay distance;
- walk/run speed and foot motion agree;
- aim/fire layering works;
- camera remains stable;
- Papa's Shop feels intentionally authored;
- key props and lighting add depth;
- gameplay remains responsive.

# PART B: BACKGAMMON + BLACK GAMMON

## 21. Current failure to solve
The existing Gammon presentation places a small board inside a large decorative green table and wastes the majority of the useful play area. A visible vertical blue line crosses the UI and dice rolling has been unreliable. These are real usability/gameplay bugs, not cosmetic preferences.

## 22. Core board principle
For Backgammon and Black Gammon, **the board itself becomes the primary screen**. The decorative table must not determine board size.

## 23. Remove the green-table constraint
Remove or greatly reduce the oversized green table container for these two games. Keep tasteful wood/felt styling around the board only where it supports the game. Do not use decoration to shrink the board.

## 24. Board dominance
Prioritize:
- points/triangles;
- checkers;
- bar;
- dice;
- bear-off areas;
- legal destination highlights.

On wide screens, the board should receive the majority of horizontal space. The status/action/chat column may remain but should be narrower and secondary.

## 25. Mobile portrait layout
Portrait phone is the primary mobile target. On phone:
- board uses the useful screen width;
- normal turns do not require zooming or panning;
- supporting status/actions/chat may stack or become compact/collapsible;
- touch targets remain usable;
- there is no unnecessary dead space around a miniature board.

## 26. Zoom and pan
Support zoom in/out as an accessibility and inspection convenience. Default Fit must already be playable. Pan may be available after zooming, but ordinary play must not require hunting around the board.

## 27. Critical dice-roll fix
Treat roll reliability as a release blocker. Inspect:
- action availability;
- click/touch handlers;
- disabled states;
- pointer-events;
- z-index/overlays;
- event propagation;
- client/server phase gating;
- bot and reconnect state;
- live-state refresh after a successful roll.

A button that appears actionable must not do nothing. After a successful roll action, update the visible state promptly even if live event delivery is delayed.

## 28. Dice-roll QA
Test standard Backgammon and Black Gammon for:
- first roll;
- subsequent rolls;
- human vs human;
- human vs bot;
- reconnect;
- rematch;
- Black Gammon tied normal totals;
- large-die tiebreak and repeat ties;
- transition from big-die winner to allocation/movement.

## 29. Roll feedback
Roll controls should clearly communicate active vs inactive state. Inactive states may use short explanations such as Waiting for opponent, Finish your move, Opponent rolling, or Large-die tiebreak.

## 30. Dice visuals
Dice should be large enough to read and use the player's selected color. Black Gammon's special large die must remain visually distinct and remains only a tiebreaker.

## 31. Remove the blue-line artifact at the source
Locate and remove the actual element/pseudo-element/debug guide causing the vertical blue line. Do not simply cover it. While doing so, audit for debug borders, test overlays, hitbox guides, focus lines and transparent elements that may also intercept touch input.

## 32. Regular Backgammon style
Keep standard Backgammon recognizable and traditional while improving board scale, checker size, point clarity, board material quality, dice, bar/bear-off readability and player-color integration.

## 33. Black Gammon style and rules
Black Gammon remains a separate game. Preserve the confirmed 4/4/4/3 starting setup and the complete locked house-rule engine. Do not simplify it back toward ordinary Backgammon while changing the renderer.

## 34. Checker interaction
When a checker is selected:
- selected stack visibly lifts/outlines/highlights;
- legal destinations appear directly on the board;
- invalid destinations do not look tappable;
- tapping selection again may cancel;
- changing selection should be immediate and predictable.

## 35. Black Gammon direction and rescue colors
Preserve:
- **blue** for legal forward movement;
- **red** for legal backward movement;
- **gold** for rescue/save movement.

Use outline/shape support where useful so information is not color-only.

## 36. Black Gammon matching-set direction rules
Preserve all locked behavior, including:
- doubles are all forward or all backward once the set direction is chosen;
- triples are all forward or all backward;
- transferred singles stay singles and are forward-only except the special single-4 rule;
- quads use the big-die/tied-roll system and are not casually converted to ordinary doubles behavior.

## 37. Special single 4
Preserve the special 4 rule exactly:
- while any checker is outside home, a single 4 is forced backward;
- once the final outside checker enters home, an unused single 4 becomes positive immediately;
- single 4 cannot enter from the bar;
- double 4s remain matching-set direction choices;
- positive 4 bearing-off behavior resumes when all checkers are home.

## 38. Bar, contested points, rescue and overstack
Preserve the complete Black Gammon rules for:
- bar priority;
- bar entry restrictions;
- immediate death of a single underneath checker;
- contested stacks with 2+ defenders;
- rescue timing through the player's current movement opportunity;
- maximum normal own-color point occupancy of four;
- temporary attacking overstack of 5, 6, 7+ where legal;
- mandatory reduction to four at the next movement opportunity after the underlying stack is removed, with excess pieces dying if not reduced.

Do not replace the rule engine while solving presentation.

## 39. Overstack visualization
If physical stacking becomes unreadable, offset/compress checker stacks or add a count badge. Show excess-stack pressure contextually. Do not add the previously rejected giant SAVE THIS TURN OR GO TO BAR banner.

## 40. Illegal move explanations
Use short, contextual explanations when helpful, for example:
- Clear the bar first;
- Need more checkers to land here;
- Point already holds 4 of your checkers;
- Single 4 cannot enter from bar;
- Backward move leaves the board;
- No legal destination.

## 41. Board orientation
Preserve the established Black Gammon view: the player's entry/start side is toward the bottom and movement progresses toward the established top/right home/bear-off destination. Do not automatically rotate home to the bottom if it contradicts the locked design.

## 42. Player colors
Use selected family player colors consistently on checkers, normal dice and ownership accents in both Backgammon and Black Gammon, while maintaining contrast.

## 43. Bots
Both games support human-vs-human and human-vs-bot. Black Gammon bots must understand the Black Gammon engine, including allocation, backward moves, 4s, bar priority, trapping/rescue, overstack and bearing off. Easy remains the default difficulty globally.

## 44. Gammon QA matrix
Test at representative widths:
- small portrait phone;
- large portrait phone;
- landscape phone;
- tablet;
- laptop;
- desktop.

Test click/touch selection, zoom, fit/reset, roll, movement, end-turn transitions, bot turns, reconnect and rematch.

# PART C: SHARED TABLETOP STANDARD

## 45. Keep the Phase Q mobile-first principle
For applicable tabletop games, the phone should feel like the game board rather than a window into a small tabletop scene. Do not undo Skip-Bo or Cribbage improvements while applying this principle to Gammon.

## 46. Do not force one generic layout
The philosophy is shared, not the exact renderer. Skip-Bo should be card-first, Cribbage board-and-score-first, Gammon board-first, Mexican Train domino-first, and Marbles board-first.

## 47. Portrait-first
At small portrait widths, avoid page-level horizontal scrolling, clipped controls and unreadably tiny pieces. Larger screens may add breathing room without changing the gameplay hierarchy.

# PART D: RELEASE AND QUALITY CONTROL

## 48. Focused implementation order
Preferred order:
1. John V2 character geometry/material pass;
2. animation/aim/fire refinement;
3. Papa's Shop local lighting/visual benchmark pass;
4. dedicated Backgammon/Black Gammon screen-first layout;
5. roll reliability fix;
6. blue-line artifact removal;
7. checker/highlight/touch refinement;
8. full regression and asset validation;
9. visual/device QA where available.

Technical dependencies may alter the exact sequence, but do not turn the pass into a whole-app rewrite.

## 49. Regression testing
After meaningful changes, verify syntax, tests, rule engines, multiplayer contracts, reconnect, bots, asset manifest paths and staging version/cache markers.

## 50. Visual QA is separate from automated QA
Use precise labels:
- code verified;
- tests verified;
- asset verified;
- browser visually inspected;
- phone visually verified.

Never claim browser/phone visual approval if it was not actually performed.

## 51. Screenshot proof
Before final visual signoff, capture representative Prop Hunt and Gammon screens from a real running build where tooling permits. If local browser restrictions prevent this, document that gap and provide a phone QA checklist.

## 52. Release artifact
Create a new staging ZIP without overwriting the previous known-good release. Include:
- current source/assets;
- this directive;
- release report;
- changed-files list;
- phone QA checklist;
- exact technical validation logs;
- known limitations.

## 53. Cold-package verification
After creating the ZIP:
1. extract it into a clean directory;
2. run the same syntax/test/build/asset checks against that extracted copy;
3. verify ZIP integrity;
4. record the exact results;
5. do not report pre-ZIP results as package verification.

## 54. Success criteria
This release is successful only if it materially improves both workstreams without regressions.

### Prop Hunt
- John P2 is a genuine visual/geometry step toward the approved likeness;
- 19-clip authored pipeline remains valid;
- layered locomotion + aim/fire remains intact;
- Papa's Shop benchmark lighting/depth improves without destabilizing the map;
- camera/movement/shooting foundation remains intact.

### Backgammon
- board is much larger and screen-dominant;
- green-table constraint is removed from normal Gammon play;
- dice rolling works reliably;
- blue-line artifact is gone;
- standard rules remain intact.

### Black Gammon
- same board/readability gains;
- rolling and big-die progression work;
- complete custom rules remain intact;
- direction/rescue highlighting remains clear;
- bots remain supported.

## 55. Final development instruction
Do not optimize for the amount of code written. Optimize for visible game quality and playability. Ask:
- Is John more recognizable and less blocky?
- Does movement look connected to motion?
- Does aim/fire preserve locomotion?
- Is Papa's Shop more dimensional without becoming dark?
- Does the camera remain stable?
- Is the Gammon board now the main screen?
- Can the player roll immediately when legally allowed?
- Is the blue artifact truly removed?
- Are touch targets and legal moves clear?
- Were locked rules and multiplayer behavior preserved?

If an important answer is no, continue refining before calling the milestone complete.

**Target release name:** `GAME-NIGHT-STAGING-PHASE-R-PROP-HUNT-P2-GAMMON-UX-16`

The goal is no longer to prove that the app can render 3D or simulate a board game. The goal is to make these experiences look and play like intentionally designed games.

---

# PHASE U.2 MASTER ADDENDUM - FAMILY ARCADE PACK
The latest governing Arcade Corner expansion is `MASTER_PHASE_U2_ARCADE_PACK_DIRECTIVE.md`. Preserve all prior locked gameplay and 3D work, then add these ten original single-file games to Arcade Corner: Camp Pong, Goat Crossing, Shop Bomber, Cabin Blocks, Camp 2048, Minefield, Goat Whack, Memory Mayhem, Firelight Simon and Papa's Pipes. The Arcade Corner count is now 14. Use original code/art/presentation, static Cloudflare-friendly HTML files, responsive touch controls and the Phase U.2 service-worker/version identifier. The target release is `GAME-NIGHT-STAGING-PHASE-U2-ARCADE-PACK-22`.

---

# PHASE U.3 MASTER ADDENDUM - FAMILY ARCADE PERSONALIZATION
The latest governing personalization directive is `MASTER_PHASE_U3_FAMILY_ARCADE_PERSONALIZATION_DIRECTIVE.md` and the permanent project-level source of truth is `BLACK_FAMILY_GAME_NIGHT_PROJECT_CONSTITUTION.md`.

Future work must begin from the latest working ZIP + Project Constitution + this cumulative Master Development Directive.

Phase U.3 replaces the first ten generic Phase U.2 arcade cards with character-specific versions:
- Papa's Paddle Battle;
- Gunner's Goat Run;
- John's Shop Bomber;
- James's Lumber Stack;
- Dorothy's Garden Merge;
- Logan's Minefield;
- Nana's Goat Whack;
- Holly's Memory Mayhem;
- Lizzie's Dramatic Lights;
- Vanessa's Pipe Problem.

It also adds three dog bonus games:
- Kelsi's Rock Hunt;
- Molly's Light Chase;
- Gunner's Snack Attack.

Kristen is the Arcade Corner host layer. The arcade shelf now has 17 playable games total including the four preserved Phase U/U.1 titles: Cabin Breakout, Neon Star Patrol, Campfire Rocket and Neon Snake.

Use the shared localStorage progression keys `bfgn_arcade_progress_v1` and `bfgn_arcade_achievements_v1` for local plays/achievements. Do not add a database for this phase.

Preserve Prop Hunt Phase T/T.1, Island Life, Birthday Seat, tabletop games, bots, multiplayer room/reconnect/chat systems and all locked rules. Do not show duplicate generic Phase U.2 cards after personalization.

Release marker: `GAME-NIGHT-STAGING-PHASE-U3-FAMILY-ARCADE-23`.
Target ZIP: `black-family-game-night-STAGING-PHASE-U3-FAMILY-ARCADE-23.zip`.

---

# PHASE V MASTER ADDENDUM - PROP HUNT PAPA'S SHOP WORLD EXPANSION
The latest governing Prop Hunt world directive is `MASTER_PHASE_V_PROP_HUNT_PAPA_SHOP_WORLD_EXPANSION_DIRECTIVE.md`.

Phase V expands Papa's Shop from the prior compact benchmark into an approximately 8.31x larger actual traversable property, targeting up to 12 players and preserving the Phase T/T.1 movement, camera, hunter blackout, crosshair-first shooting and hold-to-rapid-fire systems.

Permanent Phase V rules and standards:
- Papa's Shop is now the flagship world-scale benchmark, with a large warehouse-like main shop, fully searchable barn with loft/ladder routes, large animal pens, equipment yard, lumber/material storage and wide exterior grass/apron circulation.
- The actual Papa playable bounds are approximately 51.6 x 41.6 world units, about 2,146.56 square units versus the prior 258.4 square-unit benchmark footprint.
- Clear map-edge treatment is mandatory. Papa's Shop uses rural boundary posts plus red survey-line/tape treatment rather than unexplained invisible edges.
- Major zones should form loops with multiple exits and camera-safe chase space. Avoid accidental trap pockets.
- Papa's Shop should present hundreds of visible prop instances and at least roughly 150 gameplay-meaningful objects when disguise targets, climbables, doors/routes and explicit interactions are counted together.
- Explicit world interactions include shop lights, tractor horn, barn bell, a one-way-safe shortcut gate, several rare surprises and a legendary Papa-chair Easter egg. Interactions must never permanently trap players.
- Papa's Shop has a curated 30-prop disguise pool. Each hider is assigned exactly four choices each round. Choices change by round/player, can overlap across players and have no reroll.
- Hiders retain three disguise changes after the initial disguise, 10 decoys per round and flash refresh on disguise change.
- Hider survival scoring rewards disguise risk/size over time. Current multipliers are Small 1.00x, Medium 1.35x, Large 1.80x and Giant 2.50x. This scoring informs Best Hider/MVP without changing health.
- Hunters begin fully powered. No hunter upgrade/progression system is added.
- Default hide time remains 30 seconds. Default hunt time is 5 minutes.
- Classic elimination visibly breaks the prop and moves the eliminated player into ghost spectator mode. Ghosts can free-fly or follow/cycle living players and cannot interact with the match. Family Chaos still converts eliminated hiders into hunters.
- Each elimination triggers the original comedic synthesized line, `That's a sin.`, with queue/rate limiting. Do not clone or impersonate a real person's voice.
- Each round selects one deterministic weather/time mood from clear, sunset, overcast, light rain, light snow, fair fog or windy. Time of day remains fixed within that round. Visibility must remain fair.
- Large landmarks remain learnable while secondary clutter, equipment placement and small environmental details vary deterministically by round seed.
- Papa's Shop includes lightweight ambient farm life and environmental movement without allowing NPCs to block competitive routes.
- End each completed round with a roughly 10-second skippable MVP presentation for Best Hider and Best Hunter. Track lifetime Prop Hunt stats locally and preserve server-side lifetime fields within multiplayer rooms.
- Preserve a few rare Easter eggs plus one legendary Easter egg per map with no competitive advantage.

Deferred decisions remain deferred. Do not invent hunter cosmetics/progression or materially different prop-physics rules until they are explicitly approved.

Release marker: `GAME-NIGHT-STAGING-PHASE-V-PROP-HUNT-WORLD-24`.
Target ZIP: `black-family-game-night-STAGING-PHASE-V-PROP-HUNT-WORLD-24.zip`.
