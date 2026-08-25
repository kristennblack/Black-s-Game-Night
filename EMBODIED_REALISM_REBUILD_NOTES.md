# Black Family Game Night v1.8.0
## Embodied Realism Rebuild Notes

## 1. Why this pass exists

The v1.5 Deep 3D pass replaced much of the obvious primitive-object look with a reusable asset kit. v1.6 unified movement, camera and controls. v1.7 made scenes denser, more purposeful and more alive.

The remaining weakness was embodiment. A technically animated character could still look disconnected from the place if the body faced away from the object being used, eyes stared straight ahead, feet landed without feedback, the weapon did not move with recoil, or every game configured light and shadows differently.

v1.8 therefore treats realism as agreement between systems. The body, camera, world and interaction logic should describe the same event.

This pass is deliberately shared across:

- Family Prop Hunt
- Family Island Life
- John's Birthday Seat

It does not create another independent controller for each game.

## 2. Shared gameplay architecture

The primary implementation remains `public/shared-3d-gameplay.mjs`.

The module now owns five connected layers:

1. movement intent and locomotion telemetry,
2. semantic animation state,
3. attention and contextual facing,
4. camera framing and obstruction behavior,
5. shared renderer/shadow quality contracts.

The point of this separation is future-proofing. The procedural rigs can eventually be replaced by authored GLB/GLTF characters while retaining the same gameplay signals.

For example, gameplay should continue to say:

- speed = 3.2,
- grounded = true,
- turnRate = 0.6,
- action = harvest,
- attention target = berry bush,
- recoil = 0.34.

A future authored skeleton can decide whether that means an animation clip, IK, additive upper-body layer or procedural head aim. The game rules do not need to know.

## 3. Attention and gaze

### Function

`updateAttention(actor, dt, target, options)`

### Purpose

A character should visually acknowledge what matters nearby without becoming a billboard that constantly faces the camera.

The helper converts a world-space target into a clamped local head/eye direction. It stores a smoothed attention state on the actor and returns:

- yaw,
- pitch,
- weight.

### Rules

- yaw is clamped to a believable local range,
- pitch is clamped more tightly than yaw,
- distant/unavailable targets fade out,
- target loss blends back to neutral rather than snapping,
- attention is visual and does not bypass occlusion or gameplay visibility rules.

### Per-game use

**Prop Hunt**

The local hunter can visually follow the camera/aim direction. A bot can acknowledge a detected target. Hidden enemies do not become visible merely because an attention target exists.

**Island Life**

The local resident looks toward the current interaction target. Remote residents may acknowledge nearby visible residents. Work and shopping become visually directed rather than generic.

**Birthday Seat**

Runners can glance toward the next traversal platform, giving the route a sense of anticipation without steering the character automatically.

## 4. Contextual body facing

### Functions

`playContextAnimation(actor, name, target, durationMs, now)`

`updateContextFacing(actor, dt, options)`

### Problem addressed

Before v1.8, a player could stand beside a workbench, press USE, and perform the work motion while facing away from the bench. The action was technically present but visually false.

### New behavior

When a short contextual action begins, the actor stores the target's world position for the duration of that action. While the actor is essentially stationary, `updateContextFacing()` rotates the body toward the target using a bounded smoothing rate.

The helper immediately stops taking control if the player moves. Direct player input always wins.

This gives us a safe order of authority:

1. player locomotion input,
2. required gameplay orientation such as active combat aim,
3. contextual interaction facing,
4. neutral idle orientation.

## 5. Semantic action language

`interactionAnimation(kind)` converts game-specific interaction words into shared animation meaning.

Current mappings include:

| Gameplay concept | Shared animation |
| --- | --- |
| forage / harvest / garden | harvest |
| fish / fishing | fish |
| craft / work / workplace / repair | work |
| bed / chair / sit | sit |
| food / eat / meal | eat |
| drink / coffee / latte / smoothie | drink |
| store / furniture / plaza / inspect | inspect |
| other local use | use |

The semantic vocabulary now includes locomotion and contextual states:

`idle`, `walk`, `run`, `jump`, `fall`, `land`, `mantle`, `aim`, `hit`, `use`, `inspect`, `harvest`, `fish`, `work`, `sit`, `eat`, `drink`, `wave`, `celebrate`.

This is important design wording, not just labels. It prevents a future visual pass from collapsing every interaction into a single generic arm swing.

## 6. Human procedural animation improvements

The v1.8 procedural human rig continues the v1.7 motion-driven gait but adds more contextual body language.

### Attention

- eyes bias toward the target,
- head yaw/pitch follow the attention state,
- upper body contributes a small amount when appropriate,
- head movement remains clamped.

### Feet and turning

When the actor turns while stationary, feet can pivot in opposite directions rather than leaving both feet visually frozen while the whole body spins as a rigid statue.

During locomotion, foot pitch responds to the stride phase to suggest heel/toe progression.

### Idle fidgets

Idle motion has intentionally sparse timing. Long quiet intervals are expected. An occasional arm/face adjustment is allowed, but constant movement is considered a failure.

### Context actions

**Harvest**

The torso leans slightly toward the work. Arms alternate in a digging/gathering motion.

**Fish**

Both arms hold a forward working pose with calmer torso movement.

**Inspect/Use**

One arm lifts toward the target and the head contributes to the inspection.

**Drink**

The right arm bends toward the mouth and the head subtly adjusts.

**Eat**

A repeating bite phase brings the hand toward the face without running constantly at full amplitude.

**Work**

Both arms use a more active alternating work rhythm.

**Wave/Celebrate**

These remain transient readable gestures rather than permanent locomotion states.

## 7. Dog procedural animation improvements

Dogs retain the v1.7 quadruped gait with diagonal-leg timing, secondary ears, head, tail and landing behavior.

v1.8 adds semantic action interpretations so a dog is not forced to imitate human arm animations.

### Dog use/work/inspect/harvest

- head dips toward the target,
- one front paw lifts/works,
- chest remains grounded enough to read as a dog gesture.

### Dog eat/drink

- head lowers in a restrained repeated motion,
- chest/body stay stable.

### Dog fish/focus

- head settles toward the focus direction,
- tail motion becomes calmer.

### Dog wave

- one front paw lifts,
- tail becomes more excited.

### Backpack zapper recoil

The prop-zapper is physically attached to the dog harness/back anchor. Recoil now moves that actual attachment in pitch and local depth, then recovers smoothly.

This fixes the prior visual contradiction where muzzle feedback could occur while the backpack weapon itself remained completely static.

## 8. Human weapon recoil

Human weapon attachments now respond directly to recoil as part of the rig animation.

The shared animator moves the actual `weaponAnchor` in local depth as recoil rises, while the normal aiming/movement pose continues to affect the same anchor.

This keeps all weapon motion in one body hierarchy:

character root -> upper body -> arms/weapon anchor -> prop-zapper.

The gun is therefore not a HUD object floating near a character.

## 9. Motion contact events

### Function

`consumeMotionEvents(actor)`

### Purpose

Continuous movement telemetry is useful for animation, but visual/audio feedback often needs discrete events.

The helper watches stride phase and landing compression and emits events such as:

- `step`
- `land`

It suppresses duplicate events until the next meaningful phase/contact.

### Visual consumer

`createMotionFxSystem(scene, options)` in `public/shared-3d-art-kit.mjs` provides a pooled, inexpensive local effect system.

The games use these events to create brief ground-contact cues. This avoids creating or destroying a new mesh every frame.

### Design rule

Contact feedback is local presentation. It must never become the authoritative source of movement, damage or collision state.

## 10. Automatic shoulder relief

The third-person camera still exposes manual shoulder choice through the shared CAM control.

v1.8 adds `effectiveShoulderSign` and automatic shoulder relief while aiming.

### Behavior

1. calculate the desired camera position on the selected shoulder,
2. evaluate obstruction/camera clearance,
3. evaluate the opposite shoulder only when aiming and tight geometry makes it relevant,
4. if the opposite side has meaningfully better clearance, temporarily use it,
5. do not change the player's stored shoulder preference,
6. return to the selected side when clearance improves.

### Why this matters

Manual shoulder selection alone is not enough inside:

- Papa's Shop,
- camper interiors,
- store aisles,
- house interiors,
- tight doorways.

The camera should help preserve visibility without behaving unpredictably.

## 11. Shared renderer realism contract

### Function

`configureRendererForRealism(renderer, THREE, options)`

All three 3D games now use one renderer contract for:

- output color space,
- filmic tone mapping,
- exposure,
- shadow-map type,
- device-pixel-ratio bounds.

Each game can provide an exposure value appropriate to its mood, but the implementation path is shared.

### Why this matters

Lighting continuity is part of character continuity. The same procedural skin, denim or painted metal should not look radically different because each game independently copied a different renderer setup.

## 12. Shared directional shadow contract

### Function

`configureShadowCastingLight(light, options)`

The helper standardizes:

- shadow map resolution,
- directional shadow-camera bounds,
- near/far range,
- bias,
- normal bias,
- soft radius.

Coverage remains game-specific because Prop Hunt rooms, the large Island Life world and the Birthday Seat course have different extents.

The goal is stable grounding with fewer visible artifacts:

- less shadow acne,
- fewer detached/floating feet,
- softer edges,
- more consistent character/object readability.

## 13. Practical lights

`buildLampPost()` can now optionally create an actual point light in addition to the visible lamp mesh.

Only selected important lamps use this feature.

The lamp stores an `ambientLamp` contract containing:

- light reference,
- base intensity.

`animateAmbience(root, time, context)` can then modulate that light using `context.nightFactor`.

### Design philosophy

A real light is used when it helps explain the place:

- plaza,
- marina,
- party summit,
- important path/activity location.

It is not used for every decorative bulb. This protects mobile performance and keeps lighting hierarchy readable.

## 14. Proximity swing doors

### Builder

`buildSwingDoor()`

The visual door has:

- thickness,
- frame relationship,
- hinge pivot,
- closed/open rotation state.

`animateAmbience()` can detect player proximity and smoothly move the visual hinge.

### Important boundary

The visual door animation is not allowed to become a hidden collision system. Collision/open-state logic stays explicit in each game. This prevents the visible door and authoritative movement rules from silently disagreeing.

## 15. Prop Hunt transformation feedback

Disguise and decoy changes are intentionally fast game mechanics, but an instantaneous mesh swap can look like a rendering glitch.

v1.8 adds a brief local `spawnPoof()` cue around:

- local disguise changes,
- remote/network disguise changes,
- decoy appearance.

The effect explains the transition without delaying gameplay or changing server state.

## 16. Birthday Seat scale regression fixed

During the v1.8 scene audit, the birthday summit lamp calls were found to pass `.1` and `-.1` as the fourth argument to `buildLampPost()`.

That fourth argument is lamp height, not rotation.

As a result, the decorative lamps could become approximately 0.1 world units tall and make the summit look toy-sized even though the rest of the scene geometry was correct.

The lamps now use approximately `2.45` world units, matching human-scale environmental proportions.

A regression assertion now checks the corrected call so this specific visual error cannot silently return.

## 17. Per-game implementation summary

### Family Prop Hunt

v1.8 adds:

- camera/target attention,
- body-aware rig animation,
- human/dog weapon-anchor recoil,
- automatic shoulder relief in tight aim situations,
- proximity doors in relevant structures,
- contact effects,
- transformation/decoy poofs,
- shared renderer/shadow configuration,
- continued first-hit world raycast and wall occlusion rules.

### Family Island Life

v1.8 adds:

- interaction attention,
- contextual body facing,
- distinct harvest/fish/work/inspect/sit/eat/drink actions,
- proximity store/home doors where built,
- contact effects,
- selected night practical lights,
- shared renderer/shadow configuration,
- preserved server authorization for persistent economy/home actions.

### John's Birthday Seat

v1.8 adds:

- next-platform attention,
- contact effects,
- shared renderer/shadow configuration,
- human-scale summit lamps,
- selected practical summit lighting,
- continued real Three.js runners, moving-platform carry, Cake Bounce, checkpoints and live 3D celebration.

## 18. Realism is not polygon count

The project now explicitly rejects a common failure mode: adding more meshes without improving the relationship between them.

A believable scene is produced by hierarchy and agreement:

- objects are correctly scaled,
- structures appear supported,
- doors imply entrances,
- lights create useful pools,
- characters face what they use,
- shadows connect objects to the ground,
- contact cues explain weight,
- the camera respects architecture,
- interaction animation matches the action word.

Adding twenty random crates does not solve any of those problems.

## 19. Mobile performance boundaries

The realism pass keeps several safeguards:

- procedural/instanced/simple geometry for repeated dressing,
- pooled contact FX,
- only selected dynamic practical lights,
- visual ambience separated from collision,
- bounded renderer pixel ratio,
- simple collision even when visible object geometry is more detailed,
- transient action states rather than independent animation systems per game.

The performance governor remains allowed to reduce visual resolution before degrading controls or simulation quality.

## 20. Future authored GLB/GLTF path

v1.8 is intentionally preparing for the next visual ceiling.

If procedural family characters remain visually insufficient on real devices, the correct next step is not to add dozens of primitive meshes to every face. The correct step is to introduce authored GLB/GLTF family, dog and hero-object assets that consume the existing contracts.

The authored rig adapter should preserve:

- motion telemetry,
- semantic action state,
- attention target,
- contextual facing,
- weapon attachments,
- recoil,
- ground contact events,
- multiplayer interpolation.

That lets the collection improve artistically without throwing away the gameplay architecture again.

## 21. Release signoff rule

Automated tests can prove that a feature path exists and that important math/contracts do not regress. They cannot prove that a face is attractive, that a room feels correctly scaled or that a thumb can comfortably reach a mobile button.

v1.8 therefore still requires real-device signoff.

A candidate is visually blocked if any normal gameplay screenshot shows:

- face visible on the back of a head,
- player visible through opaque geometry,
- major object at toy-like accidental scale,
- character interacting while facing clearly away from the target,
- camera outside the room looking through walls,
- weapon disconnected from the body,
- floating feet/shadows that destroy grounding,
- controls hidden under mobile browser safe areas,
- grey-box scene composition despite technically detailed meshes.

The desired result is not photorealism. It is a coherent stylized 3D world in which the player's body, camera and surroundings appear to understand each other.
