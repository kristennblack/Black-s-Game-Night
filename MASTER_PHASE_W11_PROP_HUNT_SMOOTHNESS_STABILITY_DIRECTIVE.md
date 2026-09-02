# BLACK FAMILY GAME NIGHT
# PHASE W.11 — PROP HUNT SMOOTHNESS + STABILITY DIRECTIVE

Planning/build date: 2026-08-27
Runtime release: `GAME-NIGHT-STAGING-PHASE-W11-PROP-HUNT-SMOOTHNESS-STABILITY-35`
Design release: `GAME-NIGHT-DESIGN-PHASE-W11-PROP-HUNT-SMOOTHNESS-STABILITY-35`
Status: **HIGHEST-PRECEDENCE PROP HUNT STABILITY REQUIREMENT**
Base: W.10 Professional Game Design Bible + proven W.8 whole-app runtime + cumulative W.7 Prop Hunt combat work

---

## 1. WHY THIS PHASE EXISTS

Prop Hunt is not allowed to grow through additional maps, characters, effects or feature count while the moment-to-moment 3D experience still feels unstable.

The current quality target is not merely "the feature works." The target is:

> **The feature works continuously, predictably and smoothly on a real phone without camera collapse, collision sticking, visible jitter, frame spikes, control loss or transform corruption.**

W.11 is therefore a systems-health phase. New content is intentionally secondary to controller, camera, collision, animation handoff, frame pacing, networking presentation and recovery.

### W.11 hard scope rule

Until the W.11 gate passes:
- do not add another Prop Hunt map;
- do not propagate unfinished John controller/rig behavior to the whole family;
- do not add expensive decorative clutter solely for visual density;
- do not add new particle-heavy combat effects;
- do not call an automated test pass proof of smoothness.

Papa's Shop + approved John remain the benchmark slice.

---

## 2. SOURCE-OF-TRUTH PRECEDENCE

For Prop Hunt stability work, use this order:

1. Current explicit user instruction.
2. Approved character turnarounds and `MASTER_APPROVED_FAMILY_CHARACTER_DIRECTIVE.md`.
3. Locked Prop Hunt gameplay rules.
4. This W.11 stability directive.
5. `MASTER_GAME_DESIGN_PRODUCTION_PROMPT_W11.md`.
6. W.10 professional design directive.
7. W.9 character/detail/control directive.
8. W.7 character/combat directive.
9. Older architecture notes and historical prototypes.

If an old requirement demands a visually elaborate technique that destabilizes mobile play, W.11 wins unless that old requirement is itself a locked game rule or approved identity requirement.

---

# PART I — SIMULATION OWNERSHIP

## 3. ONE AUTHORITATIVE PLAYER BODY

The player capsule/body is the source of truth for gameplay position.

Rules:
- physics/controller simulation owns `x/y/z`, grounded state and collision;
- the render rig follows the simulation state;
- animation does not independently drag the collision body through the world;
- uncontrolled root motion is prohibited;
- if a future authored animation uses root motion, it must be an explicit bounded state such as a validated mantle and must reconcile back to the authoritative capsule cleanly;
- camera code never directly moves the player except an explicit recovery command;
- visual recoil never modifies gameplay position;
- foot IK never modifies gameplay collision.

This ownership model prevents movement, animation, camera correction and collision correction from fighting each other.

## 4. FIXED GAMEPLAY TIMESTEP

Target simulation cadence: **60 Hz**, step `1/60 s`.

Requirements:
- render rate may vary independently;
- long browser frames are clamped before entering simulation;
- use a maximum catch-up step count so one stall cannot trigger a spiral of death;
- excess accumulated simulation time may be dropped and measured rather than executing dozens of delayed physics steps;
- background/resume must reset the accumulator;
- gameplay timing such as jump buffer, coyote time, collision and bot movement uses fixed-step time;
- presentation effects may use render delta time where appropriate.

Fallback philosophy: a phone that renders 35–45 FPS should still receive stable 60 Hz movement semantics rather than moving farther on slow frames.

## 5. RENDER INTERPOLATION

Maintain previous and current fixed-simulation transforms.

Render at:

`renderTransform = interpolate(previousSimulation, currentSimulation, alpha)`

Apply to:
- local character rig;
- host-simulated bots;
- body yaw;
- appropriate deterministic world movers.

Do not interpolate intentional teleports, round respawns or explicit stuck recovery across the entire map. Snap those safely and reset interpolation history.

---

# PART II — MOVEMENT + COLLISION

## 6. MOVEMENT RESPONSE

The controller should feel responsive but not twitchy.

Baseline targets:
- virtual-stick dead zone: approximately 8–12%;
- analog magnitude controls walking speed;
- acceleration is responsive rather than instant when useful for readability;
- braking is slightly stronger than acceleration so releasing the stick stops reliably;
- air control is useful but weaker than grounded steering;
- diagonal speed is normalized;
- sprint is an explicit semantic state, not simply an animation speed change;
- movement is camera-relative;
- actor facing is damped toward intended movement/aim direction rather than teleporting rotation.

## 7. SMALL STEPS, SLOPES AND WALL SLIDE

World collision should help the player traverse believable clutter rather than catch on it.

Requirements:
- small ledges use a stable step-up allowance;
- ordinary boards/thresholds below the chosen step height should not stop the player dead;
- slopes have a defined walkable maximum;
- horizontal blocked motion should attempt axis/slide resolution rather than converting every contact into a full stop;
- tiny decorative protrusions should normally be non-blocking;
- the authoritative collision shape is simpler than the visual mesh.

### Collision geometry rule

**Never use detailed visible art as the default gameplay collider.**

A visually complex workbench can use one or a few clean invisible boxes. A detailed tractor can use a small compound set of stable primitives. Decorative trim, cables, handles, leaves and tiny tools should not become character Velcro.

## 8. COLLISION LAYERS

Every world collider should be able to express distinct responsibilities.

Core conceptual layers:
- `Player`
- `WorldSolid`
- `Climbable`
- `PropSolid`
- `Decoration`
- `CameraBlocker`
- `ProjectileBlocker`
- `VisionBlocker`
- `Trigger`

At minimum, collider metadata must separately support:
- blocks player;
- blocks camera;
- blocks vision;
- solid/non-solid;
- walkable top;
- climbable.

Examples:
- window glass can block the player but optionally not block AI/visibility logic if required by the map rule;
- small decoration can be visible but block neither player nor camera;
- a wall blocks player, camera, vision and shots;
- a trigger blocks nothing.

## 9. JUMP FORGIVENESS

Family-game controls should prefer player intent over frame-perfect timing.

Baseline:
- coyote time: **100–140 ms**;
- jump buffer: **120–180 ms**;
- variable jump height by early release;
- ground reacquisition must be stable;
- landing should not double-trigger jump;
- jump should remain usable while moving and turning;
- phone multi-touch must allow move + look + jump concurrently.

## 10. VALIDATED MANTLE

Jump may initiate an automatic low/high mantle only if all checks pass:
- forward obstacle exists;
- obstacle top is in the allowed mantle range;
- landing surface exists;
- landing capsule fits;
- head clearance is valid;
- object is climbable or allowed by level rules;
- destination is inside play bounds.

Never start a mantle and discover halfway through that the character cannot fit.

During a mantle:
- controller owns a bounded mantle state;
- camera remains stable;
- animation may drive presentation but must finish at the validated capsule destination;
- failed validation leaves normal movement intact.

---

# PART III — CAMERA STABILITY

## 11. CAMERA AND PLAYER COLLISION ARE SEPARATE SYSTEMS

Camera collision must not use the player's capsule solution as a shortcut.

The camera solves a desired shoulder pose independently against camera-blocking geometry.

## 12. MULTI-SAMPLE / VOLUME CAMERA SOLVE

Do not rely on one thin ray.

The camera solver should sample a small camera volume using centre and offset rays/candidates around the desired view. It should:
- prioritize maintaining useful distance;
- try requested shoulder first;
- allow a neutral/alternate shoulder candidate when necessary;
- try a small set of safe pitch/lift candidates;
- ignore `solid:false` and `blocksCamera:false` geometry;
- never use leaves/tiny decorations as major camera blockers;
- preserve the shot/crosshair relationship.

## 13. CAMERA HYSTERESIS

When obstruction appears:
- retract promptly enough to avoid clipping.

When obstruction clears:
- do **not** immediately expand on one clear frame;
- require a short stable-clear interval;
- expand outward more slowly than the emergency retraction.

This prevents doorframes, rafters and clutter edges from pumping the camera in/out every other frame.

## 14. CAMERA COLLAPSE RECOVERY

If actual camera distance remains below the safe minimum for a sustained interval:
- recover pitch/shoulder/distance automatically;
- do not relocate the player unless the player body is actually invalid;
- retain manual `RESET VIEW` and keyboard `R`;
- record recovery in QA diagnostics.

Camera failure and player-body failure are different events and must not be conflated.

---

# PART IV — SAFE RECOVERY

## 15. LAST-KNOWN-SAFE POSITION

Periodically record a safe transform only when:
- coordinates are finite;
- player is grounded;
- capsule is inside bounds;
- capsule is not embedded in a blocking collider.

If the player becomes invalid:
1. attempt the last-known-safe position;
2. only then use a broader radial safe-position search;
3. zero bad velocity;
4. clear invalid mantle state;
5. snap render interpolation history to the recovered transform;
6. reset camera safely.

Do not run broad geometric recovery every render frame. Recovery is exceptional, not locomotion.

## 16. STUCK DETECTOR

Diagnose at least:
- non-finite transform;
- capsule embedded in solid geometry;
- player outside map bounds;
- player below/above playable vertical limits;
- sustained camera collapse;
- optional future detector: meaningful movement input with near-zero displacement for a sustained period while not intentionally locked.

A false positive that teleports a valid hiding player is worse than a short delay, so movement-input stuck detection must use conservative thresholds.

---

# PART V — SAFE PROP-HUNT TRANSFORMS

## 17. DISGUISE PLACEMENT

Before committing to a prop disguise:
- calculate target prop bounds;
- test capsule/prop footprint against blocking geometry;
- test nearby candidate positions when the exact point does not fit;
- require map bounds and ground support;
- reject unsafe transforms with a clear message;
- never consume the disguise change if the transform cannot safely occur;
- zero stale movement velocity after a successful transformation;
- reset simulation interpolation history for the size/position change.

## 18. DECOY PLACEMENT

Decoys are lightweight gameplay objects, not full players.

Before placement:
- find a nearby open position;
- do not spend a decoy if no valid position exists;
- server validates that a client-requested position is close to the sender's live position;
- decoy uses a simple hitbox and minimal network state;
- decoy does not need full player physics, foot IK or complete animation graphs.

## 19. PROP VISUAL ROTATION VS COLLISION

When practical, visual orientation changes should not rebuild expensive collision data every frame. Keep simple collision representation stable and update only the gameplay-relevant orientation required by the chosen prop.

---

# PART VI — FRAME-TIME + GPU STABILITY

## 20. FRAME-TIME TARGETS

Average FPS alone is insufficient.

Track frame time and especially tail latency.

Reference budgets:
- 60 FPS: ~16.7 ms/frame;
- 45 FPS: ~22.2 ms/frame;
- 30 FPS: ~33.3 ms/frame.

Acceptance targets:
- minimum supported phone: sustained play should not remain above 33.3 ms/frame;
- target phone: strive for p95 frame time around 22–25 ms or better;
- no repeated large spikes during ordinary shooting, disguise or camera movement;
- a stable 40–45 FPS is preferable to oscillating 60 → 25 → 55 → 22.

QA should expose:
- current/short-window FPS;
- p95 recent frame time;
- recent peak frame time;
- draw calls;
- triangles;
- quality tier;
- pixel ratio;
- simulation recovery count.

## 21. DYNAMIC QUALITY GOVERNOR

Quality should adapt before controls become choppy.

Degradation order:
1. reduce render pixel ratio incrementally;
2. reduce nonessential particles/effect budget;
3. reduce/disable expensive dynamic shadows;
4. use more aggressive environment/character LOD when authored LODs exist;
5. hide low-significance decorative detail at the lowest tier.

Recovery upward should be slower than emergency degradation so the renderer does not oscillate quality every few seconds.

Do not lower UI resolution or interaction hit-target quality.

## 22. EFFECT POOLING

Frequently repeated effects must be pooled/reused where practical:
- shot beams/tracers;
- muzzle/impact particles;
- rings;
- poof/transform particles;
- flash effects;
- damage indicators where applicable.

Rules:
- cap simultaneous effect count;
- recycle oldest/nonessential effects when budget is reached;
- use shared immutable geometry where possible;
- do not create unique cylinder/sphere/ring geometry for every shot;
- lower particle counts automatically on lower quality tiers.

## 23. JAVASCRIPT HOT-PATH ALLOCATION

Avoid transient allocations in the animation/render loop.

Reuse:
- `Vector3` scratch objects;
- raycasters;
- quaternions/matrices when possible;
- camera centre coordinates;
- hit-test buffers;
- common geometry and materials.

Do not optimize readability into oblivion, but repeated `new Vector3`, geometry creation or temporary arrays in per-frame/per-shot hot paths should be treated as measurable technical debt because garbage collection creates visible hitches on phones.

---

# PART VII — ART + RENDER COST

## 24. CHARACTER LOD TARGETS

When authored approved GLBs are actually created, target approximately:
- local close-camera LOD0: **8k–12k triangles** where needed for approved likeness;
- nearby player LOD1: **4k–6k**;
- distant LOD2: **1.5k–3k**.

These are budgets, not quotas. Fewer triangles are better if the approved silhouette is preserved.

This W.11 runtime does **not** claim those authored GLBs already exist.

## 25. CHARACTER MATERIAL BUDGET

Aim for approximately **1–3 material groups per character** through atlases/material reuse where practical.

Do not create separate draw calls for every eyebrow, belt part or shirt panel when a texture/material atlas can preserve the approved look.

## 26. STATIC ENVIRONMENT BATCHING / INSTANCING

Repeated Papa's Shop assets such as tires, barrels, fence boards, crates, lumber and repeated hardware should use instancing/batching when the authored scene pipeline reaches that pass.

This is an asset-stage requirement and must not be falsely marked implemented merely because the master prompt contains it.

## 27. SHADOW STRATEGY

Prefer:
- important dynamic shadow: local player, nearby players, essential moving gameplay objects;
- baked/fake/contact shadow solutions for static architecture and clutter where feasible;
- reduced shadow distance and resolution on lower quality tiers.

Do not spend the phone GPU rendering high-quality dynamic shadows for fifty static props.

## 28. VISIBILITY / SIGNIFICANCE

Cull or reduce detail for content that cannot meaningfully affect the current view.

Future authored Papa's Shop pass should consider:
- frustum culling;
- distance significance;
- room/zone visibility where safe;
- lower-detail distant clutter;
- pausing expensive animation outside significance range.

Never cull gameplay-critical objects in a way that changes hiding fairness.

---

# PART VIII — ANIMATION STABILITY

## 29. BLENDED LOCOMOTION

Use semantic states with blending:
- idle;
- walk;
- jog/run;
- sprint;
- strafe left/right;
- backward;
- jump/fall/land;
- mantle;
- hunter upper-body aim/recoil;
- hider transform/lock/reaction.

Avoid abrupt full-body clip swaps when a blend or upper/lower layer can preserve continuity.

## 30. FOOT SLIDING

Match locomotion playback speed to actual planar velocity within reasonable clamp limits.

A visually fast run animation on a slowly moving capsule is a bug even if collision is mathematically correct.

## 31. FOOT IK

Foot IK remains a presentation layer:
- ray/sample terrain beneath each foot;
- adjust foot contact and modest pelvis height;
- damp changes to avoid ankle/pelvis vibration;
- never drive gameplay collision through foot IK;
- reduce/disable expensive IK for distant LODs later.

---

# PART IX — NETWORK SMOOTHNESS

## 32. NETWORK UPDATE RATE

Do not send gameplay state every render frame.

Baseline target for movement snapshots: approximately **10–20 Hz**, adjusted only from measured need.

Send meaningful state such as:
- position;
- velocity;
- yaw;
- animation/role state;
- timestamp/sequence.

## 33. REMOTE INTERPOLATION

Remote characters should render from a short interpolation buffer rather than teleport between snapshots.

Baseline visual buffer: approximately **100–150 ms**, tuned through playtest.

Limited extrapolation may bridge very short gaps but must not continue indefinitely.

## 34. LOCAL RESPONSIVENESS + FUTURE RECONCILIATION

The local player must respond immediately to local input.

The current browser architecture already moves the local player locally and smooths remote snapshots. A future formal multiplayer-authority pass may add full server reconciliation/prediction sequencing, but **do not claim full prediction/reconciliation is implemented until the protocol actually carries the required authoritative sequence/timestamps and correction path.**

Small authoritative corrections should be blended when safe. Large invalid/security corrections may snap.

---

# PART X — BROWSER / PHONE LIFECYCLE

## 35. BACKGROUND / RESUME

When the browser/tab returns from background:
- clear held shoot/jump/movement state that may have become stale;
- reset fixed-step accumulator;
- reset last-frame timestamp;
- do not simulate the entire background duration;
- keep round/network state synchronized through the normal reconnect/state path.

## 36. WEBGL CONTEXT LOSS

Listen for `webglcontextlost` and `webglcontextrestored`.

On loss:
- prevent destructive default behavior where appropriate;
- stop trying to advance/render unstable GPU presentation;
- clear held input;
- record QA reason.

On restore:
- reset simulation accumulator/timing;
- resize/reinitialize view state needed by the renderer;
- reset camera safely;
- resume without launching or teleporting the player.

W.10's requirement to replace unpinned external core 3D dependencies with pinned/self-hosted production dependencies remains technical debt before a true release.

---

# PART XI — PAPA'S SHOP PERFORMANCE BENCHMARK

## 37. WHY PAPA'S SHOP IS THE BENCHMARK

Papa's Shop intentionally combines the most stressful shared systems:
- indoor + outdoor transitions;
- roof/camera obstruction;
- barn geometry;
- clutter;
- tractor/climbables;
- hideable props;
- shooting;
- decoys;
- transformations;
- family characters;
- close third-person camera.

If this map runs smoothly, the shared foundation is meaningfully proven.

## 38. REQUIRED BENCHMARK SCENARIO

On a real target phone, run at least one complete round while deliberately testing:
1. spawn and immediate camera movement;
2. sprint from yard into shop;
3. circle doorframes and tight shelving;
4. jump repeatedly over small thresholds;
5. mantle tractor/workbench-valid surfaces;
6. aim while moving and jumping;
7. fire repeatedly into close and distant surfaces;
8. press the muzzle against a wall and fire;
9. transform beside clutter;
10. attempt an invalid transform;
11. place all ten decoys across the round;
12. use all three disguise changes;
13. use flash;
14. rotate/lock as a prop;
15. enter/leave barn and covered spaces;
16. background the phone briefly and resume;
17. rotate phone if orientation changes are supported;
18. complete round end/rematch without stale controls.

Record frame-time spikes, recoveries and any point where player input feels ignored.

---

# PART XII — DEFINITION OF DONE

## 39. W.11 RUNTIME FOUNDATION — IMPLEMENTED IN THIS PHASE

The W.11 JavaScript/Three.js foundation now includes:
- fixed 60 Hz gameplay runner with bounded catch-up;
- simulation/render transform interpolation;
- camera obstruction hysteresis;
- separate collider flags for player/camera/vision responsibilities;
- last-known-safe player recovery;
- safe disguise placement validation;
- safe decoy placement with server proximity validation;
- dynamic quality tier with pixel-ratio/effect/shadow response;
- capped pooled gameplay effects using shared geometry;
- reduced hot-path vector/ray allocations;
- background/resume fixed-step reset;
- WebGL context-loss/restore handling;
- QA display for FPS, p95 frame time, peak frame time, draw calls, triangles, quality, pixel ratio and recoveries;
- existing substep movement, jump buffer/coyote time, variable jump, animation layers, foot IK, remote snapshot interpolation and controlled ~10 Hz movement sends preserved.

## 40. ASSET / NETWORK WORK STILL REQUIRED — DO NOT FALSELY CLAIM COMPLETE

These remain future work because they require authored assets, device profiling or a broader multiplayer protocol pass:
- approved authored family GLBs with actual LOD0/1/2 meshes;
- character texture/material atlasing down toward 1–3 material groups;
- Papa's Shop authored repeated-prop instancing/batching;
- baked/static lighting and final shadow bake pipeline;
- measured real-phone p95 frame-time approval;
- formal server-authoritative client prediction/reconciliation protocol beyond the current locally responsive + remote interpolation model;
- broad device matrix including target iPhone/Safari and Android/Chrome hardware;
- production self-hosting/pinning of core Three.js dependencies.

## 41. W.11 ACCEPTANCE GATE

W.11 is not visually approved until a real phone demonstrates:
- no camera collapse/top-down failure during benchmark route;
- no persistent player pinning/sticking on ordinary clutter;
- no backwards/stale control after browser resume;
- no visible fixed-step judder under normal frame variation;
- no disguise embedding;
- no decoy placement trapping player;
- shooting remains readable and aligned;
- p95 frame time remains within the selected target-device budget for sustained normal play;
- no repeated garbage-collection-like hitch when rapid firing/effects;
- Reset View works but is not routinely necessary.

### Final rule

> **Smoothness is a shipping feature. Stability is gameplay. If the player notices the engine fighting them, Prop Hunt is not done.**
