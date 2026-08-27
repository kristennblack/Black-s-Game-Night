# BLACK FAMILY GAME NIGHT
# MASTER PHASE T DEVELOPMENT DIRECTIVE
## Prop Hunt P3 - Gameplay & Animation Feel

### Governing build
**Phase T - Prop Hunt P3 Gameplay + Animation Feel**

### Primary objective
Family Prop Hunt remains the flagship 3D game. Phase T is not a broad visual rewrite and is not permission to disturb working tabletop games. Its purpose is to make the existing Papa's Shop Prop Hunt slice feel substantially more like a polished third-person game during real play.

The most important test is not whether an animation clip exists. The test is whether moving, aiming, jumping, mantling, shooting, disguising, placing decoys, using flash, taking damage and spectating all feel coherent from the actual gameplay camera.

> **Within the first 30 seconds of playing Papa's Shop, movement, aiming, jumping, mantling, shooting and disguising should feel like a real third-person game rather than a technical demo.**

---

## 1. Start from the actual latest build

Begin from the actual latest working Phase S project. Inspect the current source, assets, tests and multiplayer flow before changing anything.

Do not rebuild Prop Hunt from scratch. Preserve systems that are already solving real problems, especially the shared movement/collision foundation, camera recovery work, multiplayer room, reconnect, hider/hunter rules, authored John P2 asset pipeline, and Phase S tabletop repairs.

The objective is a focused feel pass, not another architecture reset.

---

## 2. Preservation rule

The following are locked unless a Phase T change genuinely requires touching them:

- Prop Hunt Classic and Family Chaos rules
- six-round default
- hider health persistence across disguise changes
- three disguise changes per hider
- flash refresh on disguise change
- ten decoys per hider per round
- hunter unlimited ammo
- no innocent-shot penalty
- family-safe prop-zapper presentation
- approximately three hits to eliminate a prop
- jump and climb support on reasonable surfaces
- camera anti-collapse / recovery behavior
- Reset View and keyboard reset
- camera ignoring `solid:false` geometry
- spawn recovery / safe positioning
- multiplayer snapshots and reconnect
- Easy-first bot defaults
- player identity colors
- Phase S Skip-Bo Stock and Discard play
- Phase S Cribbage board/scoring work
- Phase S Trail Trouble repair
- Phase S Last Haven progression repair
- Phase S Gammon / Black Gammon repairs and Black Gammon rules
- Phase S Marbles board-first layout
- trick-taking bid-context improvements

A Prop Hunt improvement must not regress unrelated games.

---

## 3. Flagship map for Phase T

Use **Papa's Shop** as the gameplay benchmark.

Do not dilute this pass by attempting equivalent animation tuning in Island Life or Birthday Seat. Shared fixes may be reusable later, but all primary Phase T proof should come from Papa's Shop.

Required traversal areas include:

- shop interior
- doorway transitions
- fireplace / Papa's yellow chair area
- workbench zones
- shelving / clutter zones
- tractor
- motorcycle
- attached barn
- outdoor apron

---

## 4. Third-person game-feel target

The character should feel responsive enough for a casual family game without appearing to slide like a debug capsule.

Phase T should improve the relationship between:

- input direction
- actual velocity
- character facing
- animation choice
- animation speed
- camera direction
- crosshair direction
- weapon pose
- ground contact

The player should understand what their character is doing from silhouette alone.

---

## 5. Locomotion controller

Use the character's actual horizontal velocity to select movement state.

Support at minimum:

- idle
- start movement
- walk
- run
- sprint
- stop movement
- turn left
- turn right
- backward movement while aiming
- strafe left while aiming
- strafe right while aiming
- jump
- fall
- land
- hard land
- mantle

The controller should avoid rapid flickering between states around thresholds. Use appropriate damping/hysteresis where needed.

---

## 6. Normal movement faces travel direction

When the player is **not aiming**, John should generally turn into the direction he is actually travelling.

This prevents the character from moonwalking or running sideways simply because the camera is pointed somewhere else.

Requirements:

- forward input relative to camera produces natural travel-facing behavior
- diagonal movement produces a smooth diagonal turn
- sharp reversals should visibly turn the body rather than snap instantly when possible
- rotation must remain responsive enough for gameplay

---

## 7. Aiming movement keeps the weapon/crosshair relationship

When aiming, the character should face the camera/crosshair direction while the legs handle the movement direction.

This allows believable:

- forward aim-walk/run
- backward aim movement
- left strafe
- right strafe
- diagonal aim movement

The upper body should not lose the target simply because the player changes travel direction.

---

## 8. Directional aiming locomotion

During aim mode, resolve actor movement in actor-local coordinates so the animation controller knows whether movement is:

- forward
- backward
- strafe left
- strafe right

For the current authored clip set, reuse/retime clips intelligently rather than pretending nonexistent clips exist. Reverse playback of a suitable walk clip may be used for backpedal if it looks acceptable. Strafe semantics should be distinct in the controller so dedicated authored strafe clips can replace fallbacks later without rewriting gameplay logic.

Do not mix animation semantics with game-rule state in a way that makes later asset replacement difficult.

---

## 9. Animation speed tied to real motion

Animation playback should correspond to actual movement speed.

Correct obvious:

- foot skating
- rapid feet at low speed
- slow legs while sprinting
- sliding during stop transitions

Do not use exaggerated root motion that fights network/gameplay positioning. Gameplay position remains authoritative; animation should visually match it.

---

## 10. Start, stop and turns

Use start/stop states to make acceleration and braking readable without delaying controls.

Turns should feel better in two cases:

1. turning while moving
2. turning in place from idle

Avoid rigid instantaneous body snapping unless needed for safety/recovery.

---

## 11. Jump

Jump should have a readable takeoff and should stay responsive.

Requirements:

- retain jump buffer / coyote support already established
- transition into fall when upward momentum is gone
- preserve collision and ceiling safety
- do not let animation lock the player out of movement unnecessarily

---

## 12. Falling

The airborne pose should distinguish falling from takeoff.

Do not let the running animation continue indefinitely in midair.

The camera must remain stable during falls.

---

## 13. Landing and hard landing

Differentiate ordinary landings from larger impacts.

A short harder landing response is appropriate after a meaningful drop, but it must not become a long stun in a casual Prop Hunt game.

Use impact velocity to drive the visual strength of the landing response.

---

## 14. Mantle / climb

Mantling should read as an actual traversal action rather than the player capsule teleporting upward.

Use a staged motion:

1. approach / contact
2. lift
3. forward push-over
4. settle / land

Keep existing collision safety and destination validation.

Test on real Papa's Shop climbables such as appropriate workbench/tractor/ledge surfaces.

---

## 15. John P2 authored character

Phase T should use the existing John P2 authored asset as the primary benchmark character.

Do not falsely claim Phase T contains a brand-new John sculpt if it does not.

The focus in this phase is **runtime animation/gameplay feel** around the authored character:

- locomotion selection
- layered aim/fire
- directional movement
- grounding
- mantle
- landing
- camera relationship

A future art pass may further replace or refine the mesh.

---

## 16. Layered upper/lower body animation

Preserve and improve the layered animation approach.

While aiming/firing:

- lower body continues locomotion
- upper body maintains aim/fire pose
- weapon remains aligned with crosshair intent

Do not return to full-body Aim replacing the entire walk/run state.

---

## 17. Foot grounding

Use the current procedural IK/grounding support for authored John where stable.

Goals:

- feet closer to support surface
- less obvious hovering
- less penetration into floor
- reasonable behavior on mild uneven surfaces

Do not allow IK to violently distort knees/hips on stairs or collisions. Graceful fallback is better than unstable perfect contact.

---

## 18. Body feel

Add restrained procedural feel where useful:

- slight lean from lateral motion
- subtle turn response
- landing compression
- appropriate hip/upper-body counter motion while aiming

Keep it restrained. The character should not wobble or tilt like a toy.

---

## 19. Weapon alignment

The hunter weapon must remain attached to the intended hand/socket.

Check:

- grip
- wrist orientation
- elbow posture
- shoulder posture
- weapon direction
- crosshair relationship

Do not allow the weapon to float, detach or clip badly through the torso during locomotion.

---

## 20. Aim and firing feedback

Firing should be immediate and readable.

Preserve wall-first shot validation so a prop cannot be hit through blocking geometry.

Improve/retain:

- crosshair response
- short recoil response
- hit feedback
- wall/impact feedback where supported
- subtle muzzle feedback where appropriate

Effects should not hide the target.

---

## 21. Crosshair

The crosshair should clearly indicate the aim point and provide a brief visual reaction when firing/hitting.

Do not make it so large that it blocks small props.

---

## 22. Disguise transformation

Changing disguise should no longer feel like an object instantly popping into existence without feedback.

Use a short transformation response such as:

- compact burst/ring
- quick scale-in
- short sound cue

Health must continue carrying across disguise changes.

The disguise change limit and flash refresh rules remain unchanged.

---

## 23. Prop movement feel

When the player is disguised as a prop:

- movement should remain responsive
- the prop should stay grounded
- small tilt/bob may communicate motion
- locked props should remain convincingly still

Do not make moving props so animated that they become trivially obvious from across the map.

---

## 24. Prop locking

The existing lock/unlock mechanic should remain obvious in the HUD.

Locking should stabilize prop orientation/position as intended without breaking collision.

---

## 25. Decoy placement

Decoys should be placed deliberately in a useful location near/in front of the hider, not scattered randomly.

Requirements:

- validate support/collision
- avoid spawning inside walls when possible
- use a small placement effect for feedback
- decrement the correct decoy count
- preserve exactly 10 total decoys per hider per round

---

## 26. Flash grenade feedback

Flash should be readable to both sides.

Use:

- local world-space burst
- brief light/effect
- screen flash for affected hunter where appropriate
- sound cue

Do not create a long uncomfortable white screen.

Flash availability should refresh after disguise change per locked rules.

---

## 27. Resource HUD

The hider should be able to glance at the HUD and understand:

- health
- disguise changes remaining
- flash ready/not ready
- decoys remaining
- lock state

Use compact button labels/status rather than adding a large permanent panel.

---

## 28. Damage feedback

Taking damage should be unmistakable but brief.

Use:

- short damage vignette/pulse
- HP indicator update
- existing hit response where appropriate

Health remains approximately three hits for the standard prop target.

---

## 29. Elimination behavior

Preserve mode rules:

### Classic
Eliminated hiders become spectators.

The spectator camera should follow a living participant rather than leaving the eliminated player's camera stranded on a dead body or invalid position.

Provide a simple way to cycle to the next living spectator target.

### Family Chaos
Caught hiders join the hunters per the locked game mode behavior.

Do not accidentally apply Classic spectator behavior to Chaos conversion.

---

## 30. Spectator camera

The spectator camera should reuse the stable third-person camera solution where sensible.

Requirements:

- select a living target
- follow cleanly
- allow cycling targets
- no top-down collapse
- no camera trapped inside geometry

---

## 31. Camera behavior during active play

Preserve all playability-recovery improvements.

Tune only where necessary for action readability:

- over-shoulder position
- sprint follow
- aiming framing
- doorway transitions
- indoor obstruction
- jump/mantle visibility

Do not casually replace the shared camera system.

---

## 32. Mobile controls

Mobile remains a primary target.

Verify:

- movement joystick
- camera drag
- aim
- shoot
- jump
- sprint
- prop change
- flash
- decoy
- lock
- spectator next target

Touch controls must not overlap essential viewport content or each other on common phone sizes.

---

## 33. Desktop controls

Verify keyboard/mouse equivalents remain functional:

- WASD / movement
- mouse look
- aim/fire
- jump
- sprint
- camera reset

Do not make a mobile improvement that breaks desktop input.

---

## 34. Papa's Shop traversal checks

Specifically test:

- entering/exiting main shop
- tight corners around workbenches
- tractor climb/mantle
- motorcycle area
- fireplace / Papa chair corner
- attached barn entrance
- barn interior
- outdoor apron
- shelves/clutter near walls

The player should not snag on tiny invisible collision edges or have the camera collapse beneath roof geometry.

---

## 35. Multiplayer compatibility

Do not bloat network snapshots with purely visual transient state when it can be derived locally.

Preserve shared position/facing/role/prop/health state compatibility.

Animation semantics should be derived from authoritative movement state where practical.

Reconnect must restore a playable camera and character.

---

## 36. Bots

Bots must continue to play both roles without crashes.

They do not need human-quality animation decision logic, but their visible locomotion should use the same improved actor animation presentation where available.

---

## 37. Performance

Do not trade game feel for excessive effects.

Keep:

- bounded transient effect lifetimes
- reusable materials/geometries where practical
- lightweight UI feedback
- existing performance governor

Test for frame drops during simultaneous movement, firing, flash and multiple props.

---

## 38. Preservation of Phase S tabletop work

Phase T is a Prop Hunt pass. It must not undo the working Phase S changes.

At minimum regression-check:

- Skip-Bo Stock source
- Skip-Bo four playable Discard top cards
- Trail Trouble start/first turn
- Last Haven Camp-to-Route progression
- Cribbage physical-board/scoring state
- Backgammon / Black Gammon roll flow
- correct Black Gammon 4/4/4/3 starting layout
- Marbles board-first route
- Screw/Fuck Your Buddy bid context

---

## 39. Required gameplay proof sequence

Automated tests are necessary but insufficient.

The intended real-device proof sequence is:

### Hunter sequence
1. spawn as John in Papa's Shop
2. idle
3. walk
4. accelerate to run
5. sprint
6. stop
7. sharp turn
8. aim while moving forward
9. aim while backpedaling
10. aim while strafing left
11. aim while strafing right
12. fire while moving
13. jump
14. fall
15. land
16. perform a harder landing
17. mantle a reasonable shop object
18. move through a doorway without camera collapse
19. hit a moving prop
20. get flashed

### Hider sequence
1. spawn as hider
2. change disguise
3. move as prop
4. lock/unlock
5. place a decoy
6. use flash
7. change disguise again
8. take damage
9. escape through shop clutter
10. become eliminated and verify correct mode behavior

---

## 40. QA matrix

Test at minimum:

### Devices / input
- small portrait phone
- larger portrait phone
- landscape phone where practical
- desktop mouse/keyboard

### Camera
- shop interior
- barn interior
- doorway
- tractor
- fireplace area
- outdoor apron

### Character states
- idle
- walk
- run
- sprint
- stop
- turn
- forward aim
- backward aim
- left/right strafe
- jump
- fall
- land
- hard land
- mantle
- fire
- hit

### Hider systems
- transform
- lock
- decoy
- flash
- damage
- elimination

### Networking
- human vs human where available
- bot opponent
- reconnect

---

## 41. Release discipline

Do not overwrite the previous known-good Phase S ZIP.

For Phase T:

1. finish focused implementation
2. run syntax/module checks
3. run full tests
4. run build validator
5. run asset audit
6. document implemented vs unverified items
7. create staging ZIP
8. cold-extract the actual final ZIP
9. rerun tests/build/audit against that extracted copy
10. provide a phone QA checklist

Do not call the build phone-verified unless it was actually tested on a phone.

---

## 42. Acceptance bar

Phase T code work is acceptable for a staging device pass when:

- normal movement turns the body into travel direction
- aim mode supports forward/back/left/right movement semantics
- authored John preserves layered lower-body locomotion and upper-body aim/fire
- backpedal/strafe do not collapse into a generic frozen pose
- jump/fall/land transitions remain responsive
- meaningful falls receive a distinct hard-land response
- mantle is more readable than a simple upward slide
- authored John receives stable foot grounding where safe
- disguise change has short readable feedback
- prop movement is grounded and restrained
- decoys place deliberately and show placement feedback
- flash has readable world/screen feedback
- HUD shows health and hider resources compactly
- taking damage is visible
- Classic elimination has a usable spectator camera and next-target control
- Chaos conversion remains intact
- camera recovery protections remain intact
- Phase S tabletop fixes continue to pass regression tests

### Visual approval remains a separate gate

Automated validation does not prove that the animation *looks* good. Real phone/gameplay footage or screenshots must still confirm:

- foot skating is acceptably low
- strafing/backpedaling looks natural enough
- aiming does not twist the body badly
- mantle looks believable
- camera composition remains comfortable
- effects are not distracting

---

# FINAL INSTRUCTION TO THE DEVELOPMENT CHAT

Use this document as the governing directive for **Phase T - Prop Hunt P3 Gameplay + Animation Feel**.

Work from the actual latest Phase S project. Preserve all locked game rules and Phase S tabletop repairs. Concentrate the next 3D effort on **how Prop Hunt feels while being played**, with John in Papa's Shop as the benchmark.

Do not measure success by animation clip count or automated test count alone. Measure it by whether the player can move, turn, aim, strafe, shoot, jump, mantle, disguise and react to combat without the character or camera feeling like a prototype.

> **Within the first 30 seconds of playing Papa's Shop, movement, aiming, jumping, mantling, shooting and disguising should feel like a real third-person game rather than a technical demo.**
