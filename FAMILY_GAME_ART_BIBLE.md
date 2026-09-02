# Black Family Game Collection Art Bible

## Shared visual identity
- Warm, rustic family-lodge presentation with readable silhouettes and slightly stylized proportions.
- Characters must remain recognizable across games without becoming photorealistic portraits.
- Avoid flat front-facing gameplay sprites in any game presented as 3D. A 3D character must have a real back, side profile, volume, shadow and consistent orientation.
- Materials should read immediately: wood has visible warm roughness, steel is cooler and tighter, fabric is softer/matte, glass is transparent and reflective, dirt/grass/mud remain visually distinct.
- Lighting should be warm and inviting, with enough contrast that gameplay objects remain readable on phones.
- Family humour comes from details, animations and props, not from intentionally broken-looking models.

## Character continuity
- John: plaid/warm dark red shirt, jeans, cowboy boots; serious fixer stance.
- Kristen: T-shirt and jeans.
- Holly: hoodie and baggy jeans.
- Elizabeth: tank top and shorts; slightly theatrical idle gestures.
- Vanessa: western styling.
- Logan: hoodie and jeans; more reluctant/slouched idle language.
- James: denim shirt and jeans.
- Dorothy: flowy clothing.
- Nana: leggings and shirt.
- Papa: shirt and jeans.
- Dogs are full quadrupeds, never circular tokens in a 3D game.

## Prop Hunt branch
- Target: stylized 3D. Readability sits closer to accessible family games while camera, physicality and hiding tension move toward modern third-person Prop Hunt.
- Third-person camera stays close behind the character, with a modest over-shoulder aim zoom.
- Solid walls always occlude opponents. No enemy silhouettes or nameplates through walls.
- Teammate help should use small directional/UI information rather than full X-ray silhouettes.
- Prop-zappers are fictional but mechanically detailed, with receiver, barrel, grip, stock, sight, recoil and impact effects.
- Human weapons attach to the character rig. Dog weapons mount to a harness/backpack.
- Disguises are actual 3D objects with dimensions that affect collision and camera height.

## Environment rules
- Buildings are constructed spaces, not background paintings: floor, exterior/interior walls, wall thickness, door openings, windows, ceiling, roof, furniture and collision.
- Windows are transparent but physically solid unless deliberately open/broken.
- Reasonable surfaces are climbable; impossible/fragile geometry is not.
- Map clutter should create hiding opportunities without turning navigation into a collision maze.
- Papa's Shop is the reference vertical slice for quality and physicality across future maps.

## Animation language
- Movement uses acceleration/deceleration, gravity, jump/fall/land, turns and automatic mantling.
- Feet and paws should visually correspond to movement speed rather than sliding.
- Weapons stay with the skeleton during movement.
- Dogs use quadruped leg cycles and tail/head secondary motion.
- Animation can be playful, but it should not expose the implementation or look like placeholder geometry.

## UI and mobile
- Left side: movement joystick.
- Right side: camera-look region plus context actions.
- Core actions: Aim/Zoom, Shoot, Jump/Auto-Mantle, Sprint toggle, Prop, Flash, Decoy, Lock.
- Crosshair remains centered and readable without dominating the scene.
- HUD must not reveal hidden enemies through geometry.

## Family Island Life branch
- Target: warm stylized tropical 3D with enough material/detail variation to make the island feel inhabited, while keeping silhouettes and interactions readable on phones.
- The island should feel like one persistent place with recognizable districts, not a menu of disconnected scenes.
- Human and dog character continuity follows the same all-angle rule as Prop Hunt: real backs/sides, world-facing orientation and no camera-facing portrait billboards.
- Homes are physical places with exterior identity and enterable interiors. Furniture is real 3D scene geometry with placement bounds and useful scale.
- Residential areas should feel personal and expandable without becoming visually identical subdivisions.
- Village stores must each have a clear purpose and visual identity: groceries/supplies, furniture/home, clothing, coffee, food, workshop, ranger/nature, garden, marina/fishing and post/courier.
- Tropical vegetation should mix palms, broadleaf trees, shrubs, flowers and open meadow rather than covering the whole island in one tree type.
- Beaches, meadow, forest, rocky cove and village should remain visually distinct enough that a player can navigate by landmarks.
- Day/night lighting may become moodier at night, but interaction targets and paths must remain legible.
- Life-sim UI should feel like a friendly personal phone/notebook rather than a combat HUD.
- Needs bars are supportive background information and should not visually scream urgency unless a future mechanic genuinely requires it.
- Clothing changes should alter the 3D resident's visible outfit treatment, not just a menu thumbnail.
- Coffee, food, furniture and gathered resources should use original models/names/iconography rather than reproducing recognizable branded/game-specific objects from reference titles.
- Build mode must prioritize spatial clarity: show placement state, ownership and room boundaries without covering the room in UI.
- Future authored GLB character/environment assets should replace procedural geometry only if they preserve mobile performance, all-angle readability and the game's physical collision scale.

## Unified v1.6 3D gameplay language
- Prop Hunt, Family Island Life and John's Birthday Seat use the same shared movement/camera/animation vocabulary even though their tuning differs.
- A character's all-angle readability takes priority over decorative facial detail that only works from one view.
- Human animation should communicate weight through hips, knees, feet, shoulders and elbows rather than moving the entire body as one rigid piece.
- Dogs use quadruped gait and secondary ear/tail/head motion. Never fake dog locomotion by sliding the whole model while the legs remain static.
- Short semantic actions such as wave, work, drink, hit and celebrate must remain visible long enough for a player to read them.
- Environmental animation should be restrained. Foliage, fire and water may move visually, but gameplay colliders remain stable.
- Normal third-person view is wider than aim view. Prop Hunt aiming deliberately moves closer over one shoulder.
- Camera obstruction must always favor keeping the camera inside playable geometry rather than showing through a wall.
- Every mobile 3D game exposes a camera-shoulder button and shared control preferences.
- Control preferences persist across 3D games: look sensitivity, invert-Y and left-handed mobile layout.
- Touch controls must respect safe-area insets and leave enough open screen for camera-look gestures.
- Birthday Seat gameplay is now held to the same real-WebGL/all-angle rule as Prop Hunt and Island Life. Menu portraits may be flat artwork, but gameplay characters may not be camera-facing sprites.


## Living Worlds v1.7 scene language
- A believable place needs a visual hierarchy: one primary landmark, several secondary activity anchors, then small tertiary dressing. Do not give every object equal importance.
- Scene dressing must explain how the place is used. Workshops need tools/storage/material handling, camps need seating/fire/food/shelter, farms need gates/feed/tools/animals, and the island village needs civic seating/signage/lighting/shops.
- Leave deliberate negative space for walking, camera movement, multiplayer passing, combat sight lines and platform landings. Realism is not wall-to-wall clutter.
- Elevated platforms, decks, roofs, signs and shelves should visibly obey gravity through posts, frames, braces or stacked support unless they are intentionally magical/moving.
- Ambient motion comes from a small set of meaningful details: birds, pollen/dust, foliage, water, flames/smoke, fans and balloons. Most of the world should remain stable so these motions read clearly.
- Large ground surfaces need breakup. Grass gets understory patches/shrubs/rocks; concrete gets variation and edge context; wood gets grain/trim; water gets motion/transparency.
- Player-eye-height composition is the approval view. A scene that only looks good from an aerial/debug camera is unfinished.
- Homes and residential lots should include human-scale arrival details such as mailbox, path, porch, planter or exterior seating so each property reads as a home rather than a model dropped on terrain.
- Island districts should be navigable by landmark memory, not only labels. The plaza fountain, marina, stores, forest massing, field rows, rocky cove and residential coast should each produce a different silhouette.
- Birthday Seat is allowed fantasy objects, but the world around them should still feel constructed. Static stages need visible support; only deliberately moving gift/balloon obstacles may appear to float.
- Character animation should respond to motion telemetry: travel speed sets gait cadence, acceleration/turning influence lean, airtime changes silhouette, and landing visibly compresses the body.
- Idle life stays subtle: breathing, blinking, weight shifts, occasional head looks and dog sniffing. Avoid constant exaggerated fidgeting.


## Embodied Realism v1.8 character and place language
- Characters should appear aware of the space. Head and eye attention may acknowledge an interaction, opponent, social target or traversal objective, but gaze must remain anatomically clamped and must never become hidden-player information.
- A stationary character using an object should turn their body toward the object. Do not play a work, fishing or eating animation while the torso faces away from the thing being used.
- Semantic actions should be visually distinct. Harvesting, fishing, inspecting, working, eating, drinking, sitting, waving and celebrating are separate body ideas even when the procedural rig uses simple geometry.
- Weapon recoil belongs on the weapon attachment and the character's upper body. Avoid muzzle effects that fire while the weapon itself remains perfectly static.
- Dogs use the same semantic-action philosophy: paw/use gestures, head-down eating/drinking, focused fishing/inspection and excited wave/tail behavior where appropriate.
- Idle life stays sparse. Long calm intervals are desirable. Breathing, blinking, subtle weight shift, small gaze changes and occasional fidgets should make a body feel alive without making it look nervous.
- Practical lights should describe use. A cafe counter, marina path, birthday summit or shop work area may have a real pool of light. Do not turn every glowing decorative bulb into a dynamic light.
- Doors should have hinges, thickness and opening motion. A doorway is architecture; it should not read as a missing rectangle in a wall.
- Shadows should ground feet, furniture and vehicles. Soft shadow settings are shared so characters do not float in one game and become black cutouts in another.
- Contact effects are punctuation, not confetti. Small steps, stronger landings and transformation puffs should briefly explain physical events, then disappear.
- Camera assistance may adapt around walls, but the player should never feel that the camera changed sides for no reason. Temporary shoulder relief should be smooth and should preserve the chosen permanent shoulder.
- Future authored GLB/GLTF assets should preserve the project's semantic animation, attention and attachment contracts so visual upgrades do not require rewriting gameplay.

## Studio Realism v2.0 visual language

v2.0 introduces a two-tier asset philosophy.

### Hero assets
Family faces, dogs, weapons, signature vehicles and close-up furniture should eventually be authored with proper skinned or modeled GLB assets. These objects deserve smooth silhouettes, purposeful materials and real articulation.

### Support assets
Background clutter, shelves, fences, rocks, simple tools and structural pieces may remain procedural when they read correctly from player distance.

### Material truth
Do not solve realism by making everything glossy. Wood, painted steel, fabric, rubber, concrete, skin, hair and wet surfaces should each respond differently to light.

### Motion truth
Animation should have a reason. A person should not constantly wave, bob or sway simply to look “animated.” Motion is strongest when it explains weight, intention, contact, weather, machinery or life.

### Tropical island
The island should feel warm, lush and explorable, with subtle terrain change, sand/grass transitions, moving water, weather, useful town landmarks and inhabited homes. It should remain stylized and family-friendly rather than chasing photographic realism.

### Prop Hunt
Readability remains more important than visual clutter. Detailed rooms should contain enough negative space to understand doors, cover, climb routes and hiding opportunities.
