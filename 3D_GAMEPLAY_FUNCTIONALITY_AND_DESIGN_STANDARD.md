# Black Family Game Night
## 3D Gameplay Functionality and Design Standard
### Version 2.0.0 - Studio Realism

## 1. Purpose

This document is the shared design and engineering contract for every free-moving 3D game in Black Family Game Night.

It currently governs:

- Family Prop Hunt
- Family Island Life
- John's Birthday Seat

The goal is not simply to render polygons. A game can be technically 3D and still feel like a blockout. The standard below defines what "real 3D" means for this project from the player's point of view.

A feature is not complete because a mesh exists. It is complete when the mesh, collision, animation, camera, input, interaction, multiplayer state and visual feedback work together.

---

## 2. Shared Player Experience

All three 3D games should feel like they belong to the same family of games even though their pacing is different.

Shared expectations:

1. The character exists as a true all-angle model.
2. The camera exists in the same 3D world as the player and cannot freely pass through walls.
3. Movement has acceleration and braking rather than instant teleport-like velocity changes.
4. Analog input preserves analog strength.
5. Jump input is forgiving through jump buffering and coyote time.
6. Releasing jump early produces a shorter jump.
7. Characters have semantic animation states rather than unrelated hard-coded poses in each game.
8. Short action animations such as waving and working survive long enough to be visible.
9. Mobile controls respect phone safe areas and browser chrome.
10. Gamepads use one consistent layout across all 3D games.
11. Environmental objects use visible detail meshes and separate simplified collision where practical.
12. Interactions are spatial. The player must be in the right place and generally facing the right thing.
13. Multiplayer remote players interpolate smoothly rather than snapping between network snapshots.
14. Performance scaling is allowed to reduce pixel density before reducing gameplay quality.

---

## 3. Shared Technology Layers

### 3.1 Visual layer

The shared visual layer is `public/shared-3d-art-kit.mjs`.

It owns reusable visual construction for:

- human family rigs
- dog rigs
- prop-zappers
- detailed materials
- shop equipment
- furniture
- vehicles
- campsite objects
- farm objects
- trees
- disguise props
- architectural details

Game-specific code should not create a second crude version of an object that already exists in the art kit.

Example: if a tractor exists in the shared kit, Prop Hunt and Birthday Seat should use that tractor builder or a deliberate variant. They should not independently build a different tractor from four anonymous boxes.

### 3.2 Gameplay feel layer

The shared gameplay feel layer is `public/shared-3d-gameplay.mjs`.

It owns:

- camera-relative movement intent
- analog stick strength
- acceleration and braking
- air control
- jump buffering
- coyote time
- variable jump height
- sprint decision logic
- gamepad input
- twin-stick camera look
- third-person camera smoothing
- camera obstruction handling
- shoulder swapping
- dynamic field of view
- recoil camera kick
- virtual joystick behavior
- semantic locomotion animation
- transient action animations
- interaction target preference
- performance pixel-ratio governance

Game rules remain in the individual game modules.

### 3.3 Collision layer

Collision is intentionally simpler than visible art.

A detailed workbench may contain drawers, handles, legs, tools and trim visually while using one or two clean collision boxes.

Reasons:

- smoother phone performance
- fewer snag points
- more predictable auto-mantling
- easier multiplayer reconciliation
- simpler raycasts

Visible geometry and collision geometry should still agree closely enough that players do not feel cheated.

---

## 4. Third-Person Camera Standard

### 4.1 Default camera

The default camera is character-centered and behind the player.

The camera should:

- show enough of the character to communicate body movement
- remain close enough for aiming and indoor navigation
- smoothly follow vertical motion
- avoid sudden distance changes
- shorten toward the player when walls obstruct it
- recover smoothly when the obstruction disappears

### 4.2 Camera obstruction

The camera is not allowed to use geometry clipping as a normal navigation technique.

If the desired camera position is behind a wall, the camera moves closer to the player.

The player model may be hidden only at extremely close camera distances where the model would otherwise occupy most of the screen.

### 4.3 Shoulder camera

Shoulder offset is available in the shared camera rig.

Desktop and controller users can swap shoulder side with:

- Keyboard: C
- Gamepad: LB / left shoulder button

Prop Hunt uses the largest shoulder offset because aiming is central to the game.

Island Life and Birthday Seat use smaller shoulder offsets.

### 4.4 Field of view

Field of view changes by state:

- normal movement: neutral field of view
- sprinting: slightly wider
- aiming: narrower

Transitions are damped. They should never snap.

### 4.5 Per-game camera tuning

#### Prop Hunt

- closest normal camera of the three games
- strongest shoulder aim view
- most aggressive aim zoom
- character rotates with camera

#### Island Life

- wider exploration camera
- softer shoulder offset
- camera supports exterior exploration and indoor home decorating
- character normally faces movement direction rather than camera direction

#### Birthday Seat

- medium-wide camera for platform visibility
- more air-control-friendly framing
- course visibility is more important than weapon precision

---

## 5. Movement Standard

### 5.1 Analog movement

Input strength must be preserved.

A half-pushed joystick should produce approximately half movement intent before acceleration is applied.

The system must not normalize a half-push to full strength and then attempt to reconstruct analog speed later.

### 5.2 Camera-relative input

Forward means forward relative to the camera, not world north.

This applies to:

- WASD
- arrow keys
- mobile joystick
- gamepad left stick

### 5.3 Acceleration

Characters should not instantly reach top speed.

Ground movement uses:

- acceleration when input is active
- stronger braking when input is released
- reduced control while airborne

Each game has its own tuning preset.

### 5.4 Sprint

Sprint can be activated by:

- Shift
- mobile SPRINT toggle
- gamepad sprint input

Sprint changes both player speed and camera field of view.

### 5.5 Jump buffering

If the player presses jump just before landing, the request remains buffered briefly and fires when a valid landing occurs.

This reduces missed jumps caused by touchscreen timing.

### 5.6 Coyote time

A short grace period remains after walking off a ledge.

If jump is pressed inside that grace period, the jump still fires.

### 5.7 Variable jump height

Holding jump produces the full jump arc.

Releasing jump early trims upward velocity and produces a shorter jump.

This is important for:

- precise Birthday Seat platforming
- controlled Prop Hunt climbing
- natural Island Life movement

### 5.8 Auto-mantle

There is no separate climb button.

If the player jumps toward a reasonable climbable obstacle, the movement system may mantle it automatically.

A mantle must be rejected if:

- the ledge is too high
- the destination does not have enough head clearance
- the obstacle is tagged non-climbable
- the player is a prop that should not mantle

### 5.9 Player separation

Players are not intended to occupy exactly the same physical space.

Local body separation should gently push overlapping characters apart without launching them.

---

## 6. Animation Standard

### 6.0 Living Worlds animation rule

Animation timing must respond to what the character is physically doing. A walk cycle is not a metronome pasted onto translation. The shared animator tracks smoothed speed, acceleration, turn rate, travel-driven stride phase, airtime and landing impact.

That telemetry should influence:

- stride frequency and amplitude,
- torso/hip lean under acceleration and braking,
- body lean while turning,
- jump/fall silhouette,
- landing compression,
- camera landing response,
- arm swing and elbow flex,
- dog gait/head/ear/tail behavior.

Idle animation should contain subtle life without becoming theatrical. Breathing, blinking, weight shift, small head looks and occasional dog sniffing are preferred over continuous exaggerated fidgeting.

### 6.1 Semantic states

Gameplay uses semantic animation names.

Current shared states include:

- idle
- walk
- run
- jump
- fall
- land
- mantle
- aim
- hit
- wave
- work
- drink
- sit
- celebrate

This matters because procedural rigs can later be replaced by authored GLTF animation clips without rewriting game rules.

The gameplay says "wave."

The visual system decides whether that means:

- procedural arm motion today
- a named animation clip later

### 6.2 Procedural human animation

Human rigs should animate more than the legs.

The shared animator includes:

- hip motion
- torso bob
- breathing
- upper-body lean
- head pitch
- turn response
- shoulder swing
- elbow motion
- knee bend
- foot roll
- blinking
- weapon sway
- recoil pose

### 6.3 Procedural dog animation

Dog animation includes:

- diagonal quadruped gait
- upper and lower leg articulation
- head movement
- ear movement
- tail movement
- jump/fall leg pose
- hit reaction
- backpack weapon movement

### 6.4 Transient actions

Action animations must not be overwritten by locomotion on the next frame.

The shared transient animation layer gives short actions an explicit duration.

Examples:

- waving
- working
- drinking
- hit reaction
- short seated/rest pose

### 6.5 Animation blending

Procedural rotations use damping rather than direct angle assignment wherever practical.

This prevents limbs from snapping between states.

---

## 7. Character Rig Standard

### 7.1 Humans

Every human must have readable front, back and side views.

The shared human rig includes:

- pelvis and hips
- torso
- neck
- head
- ears
- hair volume
- front-only face details
- eyes and brows
- nose and mouth
- clothing collar/placket/pocket detail
- belt/buckle detail
- articulated shoulders
- articulated elbows
- hands and thumbs
- articulated hips
- articulated knees
- feet and soles
- weapon attachment point

A character viewed from behind must not show the face.

### 7.2 Dogs

Every playable dog must have:

- chest
- torso
- haunches
- neck
- head
- muzzle
- nose
- eyes
- articulated ears
- four upper/lower legs
- paws
- tail pivot
- harness
- backpack weapon attachment

### 7.3 Future authored model contract

If procedural characters are replaced with GLB/GLTF characters later, authored models should expose equivalent logical anchors for:

- root
- hips
- spine / upper body
- head
- left/right shoulder
- left/right elbow
- left/right hand
- left/right hip
- left/right knee
- left/right foot
- weapon anchor

The game should not need to know whether the rig is procedural or authored.

---

## 8. Input Standard

### 8.1 Desktop

Shared desktop language:

- WASD / arrows: move
- mouse drag: look
- Shift: sprint
- Space: jump
- C: swap camera shoulder

Game-specific keys are added on top of that.

### 8.2 Gamepad

Shared gamepad language:

- left stick: move
- right stick: look
- A / primary face button: jump
- LB: swap camera shoulder
- left trigger: aim where supported
- right trigger: shoot where supported
- sprint stick/button: sprint
- X / interaction face button: interact where supported

### 8.3 Mobile

Shared mobile language:

- one thumb: analog joystick
- opposite thumb: drag open game view for camera
- dedicated jump button
- dedicated sprint toggle
- visible CAM shoulder-swap control
- shared CTRL preferences panel
- game-specific context actions

The shared CTRL panel persists across 3D games and supports:

- look sensitivity from 0.65x to 1.50x,
- invert vertical look,
- left-handed mobile layout,
- reset to defaults.

Left-handed layout flips movement/action placement without changing the underlying gameplay mapping. Camera and input preferences must follow the player between Prop Hunt, Island Life and Birthday Seat rather than being three unrelated settings stores.

Buttons must use `touch-action: none` or `touch-action: manipulation` where appropriate to reduce browser gesture interference.

The bottom control group must respect `safe-area-inset-bottom`.

### 8.4 Control density

Only relevant actions should be shown.

Example:

Prop Hunt hunter controls should not waste space showing unusable hider buttons.

Hider-only actions can be hidden rather than merely disabled.

---

## 9. Interaction Standard

Interactions are chosen using:

- player position
- interaction radius
- view/facing preference

A slightly farther object in front of the player may be preferred to a slightly closer object behind the player.

Island Life interaction targeting uses camera direction so the player can stand still, look at an object and interact with it.

The prompt should describe the current action rather than display a generic "USE" when a better label is available.

---

## 10. Prop Hunt Specific Standard

### 10.1 Character orientation

The local player rotates with camera yaw.

This is deliberate because weapon direction and body direction should agree.

### 10.2 Aiming

Aiming uses:

- shoulder camera
- narrower field of view
- shared upper-body aim pose
- visible prop-zapper
- camera recoil kick
- weapon recoil pose

Desktop players can hold right mouse to aim and fire while aiming with left click, in addition to the visible SHOOT control.

### 10.3 Shooting

The first 3D raycast hit wins.

A wall must block a shot before a player behind the wall can be hit.

The same geometry concept is used for bot line of sight.

### 10.4 Hiders

Disguises must change:

- visible mesh
- collision height
- collision radius
- camera target height

Health remains attached to the player, not the disguise.

### 10.5 Hit feedback

A hit can trigger:

- transient hit animation
- sparks
- hit marker
- health update
- elimination / conversion effect

---

## 11. Island Life Specific Standard

### 11.1 Exploration

Island Life prioritizes comfortable exploration over combat precision.

The camera is wider and movement slightly slower than Prop Hunt.

### 11.2 Interactions

Work, shopping, foraging, home entry and object use are spatial.

Server-authorized actions remain the source of truth for persistent economy changes.

### 11.3 Animation feedback

Life-sim actions should visibly affect the character.

Examples:

- forage: work motion
- job shift: work motion
- consume item: drink/use motion
- wave: wave motion
- sleep/rest: short seated/rest motion

### 11.4 Homes

Home interiors should support:

- enter/exit transitions
- furniture collision where appropriate
- camera obstruction
- roof hiding or transparency when needed
- camera-relative interaction

---

## 12. John's Birthday Seat Specific Standard

### 12.1 Technology

The playable race is WebGL/Three.js.

Roster PNGs may be used in setup UI only.

The race itself uses shared all-angle human and dog rigs.

### 12.2 Platforming

Birthday Seat gets the strongest air control of the three games.

Platforming features include:

- jump buffering
- coyote time
- variable jump height
- moving platforms
- moving-platform rider carry
- bounce platform
- checkpoints
- fall respawn

### 12.3 Bots

Computer runners use the same physical world and 3D rigs.

Difficulty can affect speed and jump confidence, but bots should not teleport between route steps.

### 12.4 Goal

The birthday throne must exist visibly in the 3D scene.

Reaching the goal must not collapse the game back into a flat presentation. The live 3D runner remains in the scene and plays a celebration pose while the finish UI is displayed.

The route should communicate progress through themed sections rather than anonymous floating blocks.

---

## 13. Environment Realism Standard

### 13.1 Visible construction

Important objects should have recognizable construction.

Examples:

A workbench may include:

- wood or metal top
- legs/frame
- lower shelf
- drawers or tools

A shop building may include:

- wall thickness
- framed openings
- windows
- doors
- ceiling
- roof
- rafters
- lights
- floor material

### 13.2 Materials

Shared material families include:

- wood grain
- painted wood
- concrete
- dirt
- gravel
- steel
- galvanized metal
- painted metal
- rubber
- fabric
- leather
- stone
- hay
- pegboard
- glass

Flat single-color materials should be reserved for deliberate stylization or tiny background details.

### 13.3 Scale

Objects should use believable relative scale.

Common scale checks:

- door height compared with human
- chair seat compared with knee height
- workbench compared with waist height
- pickup truck compared with character height
- dog size compared with human leg height
- gun size compared with forearm and torso

### 13.4 Environmental motion

A convincing world cannot be completely frozen, but ambience must remain cheaper than gameplay physics.

Shared low-cost ambience may include:

- foliage/crown sway,
- small water-surface movement,
- flame animation,
- practical fire-light variation,
- other subtle secondary motion that does not move collision geometry.

Visual ambience must never move authoritative colliders, alter hit detection, or cause multiplayer position drift.

The goal is perceptual life, not constant spectacle.

### 13.5 Place identity

Every major playable area must answer five questions visually before the player reads a label:

1. What kind of place is this?
2. What do people normally do here?
3. Where can I move next?
4. Which objects are important enough to interact with, climb, hide behind or remember?
5. What makes this place different from the room or district beside it?

A workshop therefore needs evidence of work: storage, tools, power equipment, benches, material stacks, lighting, electrical hardware and believable circulation space. A campsite needs evidence of staying there: tent/camper, seating, fire, food/cooler objects, lights, shoreline or vegetation, and a path between those activities. A tropical plaza needs civic objects: seating, signs, a landmark, lighting, planters, stalls and pathways to districts.

### 13.6 Landmark hierarchy

Each scene should have three levels of visual hierarchy.

**Primary landmark**

The object or building that explains the scene from a distance. Examples include Papa's Shop shell, the Island Life plaza fountain, the camper, the sea can/farm structures, or John's Birthday Seat throne.

**Secondary landmarks**

Objects that divide the place into understandable subareas. Examples include a tractor, fireplace, market stall, campfire, pool, hot tub, marina dock or party arch.

**Tertiary dressing**

Small objects that explain use and history: buckets, tools, cords, mailboxes, planters, feed sacks, lanterns, chairs, crates, signs and vegetation.

Tertiary dressing must support the primary/secondary hierarchy rather than flattening everything into equal visual noise.

### 13.7 Scene density and negative space

The project should not solve realism by filling every square metre.

Maintain intentional negative space for:

- player circulation,
- camera recovery,
- readable silhouettes,
- multiplayer passing,
- jump/mantle run-up,
- combat sight lines in Prop Hunt,
- social gathering in Island Life,
- safe landing zones in Birthday Seat.

Dense clutter belongs near walls, work zones, storage edges and environmental story pockets. Open floor belongs where humans would actually walk.

### 13.8 Structural support and gravity

If a platform, roof, shelf or stage is elevated, its support should usually be visible unless the design deliberately communicates magic or suspension.

Birthday Seat platforms should use posts, braces, stacked objects or themed supports where possible. Floating geometry is acceptable only for intentionally moving birthday gifts/balloons or explicitly fantastical obstacles.

The same rule applies to furniture and buildings: roofs need walls/rafters, shelves need frames, decks need posts, signs need poles, and lights need fixtures.

### 13.9 Ambient population and motion

A living world may use low-cost ambient elements such as:

- birds orbiting high above play space,
- pollen/dust particles,
- ceiling fans,
- hanging/string lights,
- moving water,
- campfire smoke/flames,
- foliage sway,
- idle NPC animals,
- gentle balloon bobbing.

Ambient motion must be visually subordinate to player motion. Avoid making every prop move. Static objects make moving details easier to perceive.

### 13.10 Material variation

Large repeated surfaces should avoid reading as a single computer-generated color field. Use procedural variation, trim, seams, framing, edge changes, furniture or decals where appropriate.

Examples:

- concrete gets value/noise variation and surrounding gravel/dirt,
- wood uses grain and separate trim,
- metal uses painted/galvanized/roughness differences,
- grass is supported by patches, bushes and trees rather than one green disk,
- water uses transparency/roughness and subtle motion.

### 13.11 Scene acceptance check

Before a scene is considered dressed, test it from:

- the normal third-person camera,
- a low camera near an obstacle,
- the main entrance,
- the farthest playable edge,
- behind the player's character,
- the primary interaction/combat position.

The scene should still communicate its identity and navigation from each view. A beautiful aerial composition that collapses at gameplay height does not pass.

---

## 14. Lighting Standard

Lighting should create readable volume.

Shared approach:

- hemisphere light for sky/ground fill
- directional sun or key light
- soft shadows
- interior practical lights where appropriate
- ACES filmic tone mapping
- sRGB output

Darkness should create mood, not hide unfinished geometry.

Important gameplay areas must remain legible.

---

## 15. Multiplayer Motion Standard

Remote characters should not snap directly to every network packet.

Client display uses interpolation toward the most recent authoritative or shared snapshot.

Snapshots may include:

- position
- yaw
- pitch
- velocity
- animation state
- game-specific state such as disguise or zone

Persistent game state remains server-authorized where required.

---

## 16. Performance Standard

The game targets family phones and tablets, not only desktop GPUs.

Performance strategy:

1. Keep collision simpler than art.
2. Reuse materials.
3. Reuse shared builders.
4. Limit expensive transparent surfaces.
5. Use fog and sensible far planes.
6. Reduce render pixel ratio dynamically if frame rate falls.
7. Keep gameplay simulation stable even if visual resolution is reduced.
8. Avoid creating new temporary Three.js objects every frame where practical.

A lower render pixel ratio is preferable to broken controls or delayed input.

---

## 17. QA Standard

Every 3D release should test the following on a real phone and desktop browser.

### Camera

- walk into a wall backward
- rotate camera in a small room
- aim beside a doorway
- stand under a low roof
- switch shoulder
- sprint and stop repeatedly

### Movement

- half-push joystick
- full-push joystick
- quick direction changes
- short jump tap
- long jump hold
- late ledge jump
- early buffered jump before landing
- automatic mantle
- failed mantle under low ceiling

### Animation

- view character from front
- view character from side
- view character from behind
- idle for 10 seconds
- walk
- sprint
- jump
- fall
- land
- wave
- work
- receive hit

### Dogs

- idle
- walk
- sprint
- jump
- view all four sides
- backpack weapon visibility where applicable

### Mobile

- portrait browser chrome visible
- landscape browser chrome visible
- safe-area bottom inset
- joystick near screen edge
- simultaneous movement and camera drag
- jump while moving
- sprint while turning camera

### Prop Hunt

- enemy hidden behind wall
- shot at wall with enemy behind it
- camera against wall
- disguise to very small prop
- disguise to large prop
- decoy placement
- flash
- lock
- hunter aim and shoot

### Island Life

- interact while camera faces object and character is stationary
- enter home
- exit home
- shop
- work shift
- forage
- consume item
- wave
- place furniture

### Birthday Seat

- moving platform carries player
- moving platform carries bot
- Cake Bounce
- checkpoint respawn
- race with 13 runners
- finish throne

---

## 18. Definition of Done

A 3D feature is not considered done merely because automated tests pass.

For this project, "done" means:

- code path exists
- automated behavior tests pass
- visual object is recognizable
- collision agrees with visible object
- camera behaves correctly around it
- controls remain usable on mobile
- animation state is visible and coherent
- multiplayer state is synchronized where applicable
- real-device visual QA has been performed

Automated tests catch regressions.

They do not replace looking at the game on the phone.


---

## 19. Embodied Realism v1.8 Standard

v1.8 adds a second requirement on top of the Living Worlds scene rules: a character must appear to understand the space it occupies. More animation is not enough. Motion, gaze, body orientation, contact, camera framing and nearby objects must agree about what the player is doing.

### 19.1 Attention hierarchy

The shared animation layer exposes `updateAttention(actor, dt, target, options)`. The target is a world-space point and the output is a clamped local yaw/pitch with a blend weight. The hierarchy for choosing a target is intentionally game-specific:

1. active interaction target,
2. current combat/AI target,
3. next traversal objective,
4. camera/look direction for the local controlled character,
5. nearby social character when appropriate,
6. neutral forward/idle gaze.

Head and eye motion must be limited to believable ranges. If a target moves beyond the comfortable head range, the body should eventually turn instead of allowing the head to rotate through the torso. Attention is visual information only and must never reveal a hidden Prop Hunt player through geometry.

### 19.2 Contextual body facing

`playContextAnimation()` and `updateContextFacing()` give short actions a physical target. When a stationary resident works at a counter, inspects a shelf, drinks at a cafe, fishes, harvests or uses furniture, the body should turn toward that object before or during the action. Movement input always wins over this helper, so interaction facing never steals steering from the player.

### 19.3 Semantic action vocabulary

Gameplay code requests meanings rather than implementation-specific clip names. The current shared vocabulary includes:

- idle
- walk
- run
- jump
- fall
- land
- mantle
- aim
- hit
- use
- inspect
- harvest
- fish
- work
- sit
- eat
- drink
- wave
- celebrate

Procedural rigs interpret these states directly today. Future authored GLB/GLTF rigs should map the same semantic states to animation clips, additive layers or IK without changing game rules.

### 19.4 Contact events

`consumeMotionEvents()` turns continuous gait telemetry into discrete `step` and `land` events. These events may drive inexpensive local-only feedback such as dust, grass puffs, small landing rings, sound hooks or controller haptics. Contact feedback must not alter authoritative multiplayer position or collision.

The visual effect should scale with meaning. Walking contact is restrained. Sprint steps may be slightly stronger. A hard landing should read differently from a normal step. Do not spawn an effect every render frame.

### 19.5 Weapon embodiment

A weapon is part of the character rig, not a separate screen decoration. Human prop-zappers follow the hand/upper-body attachment; dog prop-zappers follow the harness/back attachment. Recoil is applied to the actual attachment point and recovers smoothly. Aiming may alter upper-body pose and camera framing, but should not twist the lower body into impossible orientations.

### 19.6 Adaptive shoulder relief

Manual shoulder selection remains under player control. While aiming in a tight interior, the camera may temporarily use the opposite shoulder when the selected side is substantially more obstructed and the opposite side has meaningfully more room. This is a temporary camera decision only. It must not silently change the stored player preference.

This behavior is especially important in Papa's Shop, camper interiors, store aisles and home interiors.

### 19.7 Shared renderer and shadow contract

Every free-moving 3D game must use `configureRendererForRealism()` rather than inventing its own renderer defaults. The shared contract owns:

- sRGB output color space,
- ACES filmic tone mapping,
- per-game exposure tuning,
- soft shadow-map type,
- bounded device pixel ratio.

Directional shadow lights must use `configureShadowCastingLight()` so map size, bias, normal bias, soft radius and camera coverage are deliberate rather than copied inconsistently between games.

The objective is visual continuity. The same family member should not appear washed out in Island Life and almost black in Prop Hunt because the renderer setup changed between pages.

### 19.8 Practical lights

A glowing bulb does not automatically create believable light. Selected lamps may own real low-cost point lights through the shared `ambientLamp` contract. Use them only where the pool of light helps describe a place, for example a plaza, marina, party summit, porch or important interior activity area.

Practical lights should respond to a scene's night factor. Daytime lamps can remain visually present but their emitted light should be reduced. Do not attach real lights to every decorative lamp on mobile.

### 19.9 Doors and moving architecture

A door opening must behave like an entrance, not a painted rectangle. `buildSwingDoor()` creates a hinged visual door and the ambience system can open it based on player proximity. Door animation should be smooth and should never be used as the authoritative collision solution by itself. Collision/open-state rules remain explicit in the game world.

### 19.10 Idle behavior

Idle animation exists to prevent mannequins, not to create constant twitching. Breathing, blinking, weight shift, small gaze changes and occasional context fidgets should have long quiet intervals. Dogs may sniff or adjust head/ears/tail. A stationary character should still look capable of standing still.

### 19.11 Future authored-model contract

Procedural characters remain the current mobile-friendly implementation, but the code is intentionally organized so higher-detail authored characters can replace them later. A future character asset should expose equivalent anchors for:

- root/body orientation,
- hips/pelvis,
- upper body/chest,
- head/neck,
- eyes when available,
- left/right arms and hands,
- left/right legs and feet,
- weapon attachment,
- dog harness/back attachment where applicable.

The gameplay layer should continue to produce motion telemetry, semantic action states, attention targets and recoil. The art/rig adapter decides how an authored skeleton consumes those values.

### 19.12 Embodied realism definition of done

A v1.8-style interaction is not complete until all of the following agree:

- the player is close enough to the object,
- the server authorizes the action when it affects persistent/multiplayer state,
- the character faces the object when stationary,
- head/eyes acknowledge the target where appropriate,
- a readable semantic action plays long enough to see,
- feet remain grounded unless the action requires otherwise,
- the camera keeps the action readable without clipping through geometry,
- lighting/materials let the object and hands read on a phone,
- the action returns smoothly to locomotion.

The rule is simple: **the body, camera and world should tell the same story.**

---

# Version 2.0 Studio Realism Standard

v2.0 adds a production rule above the v1.8 embodied-realism contract:

> High-attention assets may become authored, but gameplay semantics must remain independent of the asset source.

## Authored-vs-procedural boundary

Family members, dogs, signature vehicles, weapons and hero furniture are allowed to use authored GLB/GLTF assets. Background construction and filler props may remain procedural.

A missing authored asset must never remove a player from the game. Fallback is mandatory.

## Animation semantics

Game code requests `walk`, `run`, `aim`, `cook`, `sleep`, etc. It must not contain scattered assumptions such as `John_Rifle_Run_02`.

This semantic contract is what allows the same gameplay to animate either:

- a procedural rig today, or
- a skinned authored character tomorrow.

## Multiplayer presentation

Rendering may smooth/interpolate network motion, but may never invent authoritative game outcomes. Damage, ownership, inventory, money and persistent house state remain server-controlled.

## World simulation

Weather, NPC routines, water and ambient movement should make the world feel alive without becoming survival chores or an expensive simulation.

The private island may have changing weather and visitors. Prop Hunt must preserve hiding/readability. Birthday Seat must preserve precision platforming.

## Interactive furniture

Furniture interaction must pass three tests:

1. **Ownership/permission:** server decides whether the action is allowed.
2. **Proximity:** the player must be physically near the item.
3. **Embodiment:** the character uses a readable semantic animation and faces the item.

## Selective physics

Physics is a spice, not the soup.

Loose small objects may roll, bounce or be nudged. Structural scenery and important furniture should not drift, jitter or desync.

## Audio

Sound cues are event-driven. Footstep timbre should reflect the surface. Remote sound volume/pan may depend on distance and camera direction.

## Camera cinematics

Cinematics should be short, skippable by behavior where practical, and restore normal control-camera state after non-terminal shots.

## Weather and terrain

Terrain variation should improve silhouette and exploration without intersecting buildings. Weather should affect light, fog, motion and ambience together.

## Water

Water should communicate depth and shoreline through motion, color and foam while remaining inexpensive enough for mobile rendering.

## v2 visual truth rule

A screenshot is not proof of functionality, and passing tests are not proof of visual quality.

A v2 feature is complete only when:

- code behavior is tested,
- gameplay rules remain correct,
- the object/body/world relationship is coherent,
- and the result is checked at real player camera height on an actual target device.
