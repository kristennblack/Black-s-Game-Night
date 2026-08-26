# BLACK FAMILY GAME NIGHT
# MASTER PHASE T.1 DEVELOPMENT DIRECTIVE
## Prop Hunt Hunter Release + Crosshair Combat Controls

### Governing build
**Phase T.1 - Prop Hunt Hunter Release + Combat Controls**

This directive supersedes any earlier Phase T instruction that requires a separate Aim button or a hold-to-aim state. All other Phase T gameplay, animation, camera, hider, spectator, map and preservation requirements remain in force unless explicitly changed below.

---

# 1. PRIMARY OBJECTIVE

The next Prop Hunt step is to make the beginning of every round fair and make hunter controls simpler, faster and more natural on a phone.

The core player experience should be:

> **Hiders get a protected setup period. Hunters see nothing until the hunt begins. Once released, the hunter always shoots through the centre crosshair and can hold SHOOT for controlled rapid fire.**

This is a gameplay/control pass, not permission to rebuild unrelated systems.

---

# 2. PRESERVE THE EXISTING PROP HUNT FOUNDATION

Preserve all previously approved systems unless this directive explicitly changes them:

- Classic and Family Chaos
- six-round default
- rotating hunters
- approximately three hits to eliminate a hider
- hider health carrying across disguise changes
- three disguise changes per hider
- flash refresh after a disguise change
- ten decoys per hider per round
- unlimited hunter ammunition
- no penalty for shooting innocent scenery
- jump and reasonable climbing/mantling
- John P2/P3 character and animation work
- directional locomotion and layered upper/lower body animation
- camera obstruction/recovery system
- Reset View
- multiplayer/reconnect
- bots
- Papa's Shop as the flagship benchmark
- Phase S tabletop fixes
- all locked Black Gammon and other game rules

Do not regress the broader game-night app while changing Prop Hunt controls.

---

# 3. PROTECTED HIDING PHASE

Every round begins with a dedicated hiding phase.

Default hiding time:

**30 seconds**

The server timer is authoritative in multiplayer.

Do not let each client run an independent countdown that can drift enough to reveal the game early.

---

# 4. HUNTER SCREEN DURING HIDING

If the local player is a hunter while the phase is `hide`, cover the entire gameplay viewport with an opaque black screen.

The hunter must see:

> **HIDERS ARE HIDING**
>
> Other player(s) are finding a hiding spot.
>
> **30**

The number counts down using the authoritative round timer.

The hunter must not be able to see the map behind the overlay.

The overlay must be fully opaque. Do not use a translucent blur that lets the hunter recognize shapes or locations.

---

# 5. HUNTER CONTROLS ARE LOCKED DURING HIDING

During the protected hide phase a hunter cannot:

- move
- rotate the gameplay camera
- jump
- sprint
- shoot
- swap into any alternate aim state
- damage hiders

The hunter character should remain safely idle at its start position.

The black overlay should intercept touch/pointer interaction, and gameplay code must independently enforce the lock so keyboard/gamepad inputs cannot bypass it.

---

# 6. HIDE-PHASE PRIVACY IN MULTIPLAYER

Do not rely only on a black UI rectangle.

While a viewer is a hunter and the round is in the hide phase, server state sent to that hunter must not expose hider hiding information unnecessarily.

At minimum, mask:

- live hider position snapshots
- hider disguise/prop identity
- hidden-phase decoy positions

Do not broadcast hider live snapshots to hunter connections during the hiding period.

Reconnects during the hide period must respect the same privacy rules.

When the hunt begins, current legal hider state can be revealed to the normal gameplay renderer so the match can function.

---

# 7. DECOYS CREATED DURING HIDING

Hiders are allowed to place decoys during the hiding period.

Those decoys must still exist once the hunt begins.

Therefore:

- persist network decoys as round state
- do not reveal their positions to hunters during the hide phase
- synchronize them to hunters when the hunt phase begins
- prevent duplicate decoys when state and action messages arrive in different orders
- clear round decoys when a new round begins

---

# 8. POSITIONAL AUDIO FAIRNESS

During the hiding period, a hunter must not be able to locate hiders by listening to their footsteps, landing sounds or similar positional movement cues.

Suppress positional hider movement audio for a blinded hunter during this phase.

Generic countdown/interface audio is allowed.

Normal gameplay audio resumes when the hunt begins.

---

# 9. HIDER INVULNERABILITY DURING HIDING

A hider cannot take hunter damage during the hide phase.

Enforce this on both sides:

- client shooting logic cannot fire before `hunt`
- server hit registration rejects hunter damage unless the room phase is `hunt`

This prevents accidental or desynchronized early shots from damaging hiders.

---

# 10. FINAL COUNTDOWN AND RELEASE

During the last three seconds, make the countdown more visually noticeable without becoming obnoxious.

At the transition to `hunt`:

- remove the black hunter overlay
- activate hunter controls
- activate damage
- show a short **HUNT!** cue
- play a brief neutral release sound
- immediately return to the normal third-person camera

Do not add a long cinematic that steals control from the hunter.

---

# 11. REMOVE THE AIM BUTTON

There is **no separate Aim button** in Prop Hunt hunter controls.

Remove it from:

- mobile HUD
- desktop control instructions
- input state
- quick-control legend
- role-specific UI

Do not replace it with another aim toggle.

---

# 12. CROSSHAIR-FIRST SHOOTING

The centre crosshair is always the hunter's aiming reference during the hunt.

The weapon fires toward the centre reticle.

The player looks by dragging/using normal camera look controls. The hunter character naturally faces the crosshair/camera direction while the lower body resolves forward, backward and strafing locomotion.

The player should never need to press Aim before Shoot becomes meaningful.

---

# 13. CAMERA BEHAVIOR WITHOUT AIM MODE

Removing the Aim button must also simplify the camera.

Do not introduce a separate aim zoom or sudden camera snap every time the player fires.

Use the stable shared third-person camera:

- normal shoulder framing
- slight sprint follow where already supported
- obstruction handling indoors
- stable crosshair placement
- no special Aim-button zoom state

Keep all camera recovery protections from earlier phases.

---

# 14. TAP SHOOT

Tapping SHOOT fires one immediate shot when:

- player is a live hunter
- room phase is `hunt`
- weapon cooldown allows it

There should be no artificial delay before the first shot.

---

# 15. HOLD SHOOT = RAPID FIRE

Holding the SHOOT button continuously fires the prop zapper.

Target rate:

**approximately 4.8 shots per second**

The intended behavior is:

1. pointer/touch down
2. immediate shot
3. continue firing while held
4. obey controlled fire interval
5. stop immediately on release/cancel/lost pointer capture/window blur

Gamepad fire should follow the same held-button behavior.

Do not require repeated tapping.

---

# 16. WHY THE FIRE RATE IS CONTROLLED

Hunters have unlimited ammunition and there is no innocent-prop penalty.

A very high fire rate would turn the game into sweeping every room with a bullet hose instead of actually searching.

Keep rapid fire quick and satisfying but controlled enough that hiding and movement remain meaningful.

---

# 17. SHOOT WHILE MOVING

Holding SHOOT must not stop locomotion.

The hunter can:

- walk and fire
- run and fire
- sprint and fire where allowed
- backpedal and fire
- strafe left/right and fire
- turn and fire
- jump and fire

The lower body continues locomotion while the upper body carries the weapon/aim/fire response.

---

# 18. HUNTER FACING AND DIRECTIONAL LOCOMOTION

Hunters always orient toward the crosshair/camera direction during active play.

Movement is resolved in facing-local space so the animation layer can distinguish:

- forward
- backward
- strafe left
- strafe right

Hiders that are not in a weapon/crosshair state should continue to face their natural travel direction.

---

# 19. CROSSHAIR AND HIT FEEDBACK

Keep the crosshair small and readable.

Allow:

- subtle fire reaction
- brief hit confirmation on real hider damage
- surface impact feedback
- controlled aim assist only where already appropriate for coarse/mobile input

Do not reveal innocent props through special warning colors or target-lock effects.

Searching should remain part of the game.

---

# 20. WEAPON FEEL

Each shot may use restrained feedback such as:

- short zap/muzzle effect
- small recoil
- tracer/beam
- surface sparks
- hit reaction

Do not let recoil make mobile aiming frustrating.

This is a family party game, not a simulation shooter.

---

# 21. MOBILE CONTROL HIERARCHY

Hunter mobile controls should now be simpler:

### Left thumb
- movement joystick
- Sprint where used

### Right side
- drag open view area to look
- SHOOT
- Jump

No Aim button.

Hider-specific buttons remain available only when the player is a hider:

- Prop
- Flash
- Decoy
- Lock

Do not crowd hunter controls with hider-only buttons.

---

# 22. DESKTOP CONTROL HIERARCHY

Desktop should follow the same philosophy:

- WASD movement
- mouse/pointer look
- left fire input where supported
- jump
- sprint
- no right-mouse Aim requirement

Do not make desktop users hold a second mouse button before firing.

---

# 23. BOTS

Hunter bots are frozen during the hiding period.

Hider bots can use the hiding period to move/disguise/hide.

Hunter bot detection/firing begins only during `hunt`.

Bot behavior must not accidentally reveal hider location to the human hunter through camera/audio/UI effects.

---

# 24. ROUND TRANSITION ACCEPTANCE SEQUENCE

A valid round-start test is:

1. Start Papa's Shop with at least one hunter and one hider.
2. Roles are assigned.
3. Phase becomes `hide` for 30 seconds.
4. Hider can move, jump, climb, disguise and place decoys.
5. Hunter screen is completely black.
6. Hunter sees **HIDERS ARE HIDING** and the countdown.
7. Hunter cannot move.
8. Hunter cannot rotate gameplay view.
9. Hunter cannot shoot.
10. Hunter does not receive useful hider positional movement audio.
11. Server does not expose live hider position/disguise/hidden decoy data to that hunter.
12. Final 3-2-1 is readable.
13. Phase changes to `hunt`.
14. Hunter sees **HUNT!** briefly.
15. Normal camera appears.
16. Crosshair is active immediately.
17. Hunter movement activates immediately.
18. Hunter can fire immediately.
19. Decoys placed during hiding are visible in the world.
20. Hiders can now take legal damage.

---

# 25. SHOOTING ACCEPTANCE SEQUENCE

A valid shooting test is:

1. Enter hunt phase as a hunter.
2. Confirm there is no Aim button.
3. Move the camera/crosshair over a target.
4. Tap SHOOT once.
5. Exactly one immediate shot occurs.
6. Hold SHOOT.
7. Shots repeat at approximately 4.8/sec.
8. Continue moving while holding SHOOT.
9. Backpedal while firing.
10. Strafe while firing.
11. Turn while firing.
12. Release SHOOT.
13. Repeating fire stops immediately.
14. Shoot a wall and verify wall-first impact behavior.
15. Shoot a hider and verify correct damage/hit feedback.

---

# 26. MULTIPLAYER / RECONNECT ACCEPTANCE

Test:

- human hunter + human hider
- human hunter + bot hider
- human hider + bot hunter
- reconnect hunter during hide
- reconnect hider during hide
- reconnect after hunt begins

A hunter reconnecting during hide must return to the black countdown, not a visible map.

---

# 27. PAPA'S SHOP BENCHMARK

Use Papa's Shop as the main proof map.

Verify the release transition and shooting around:

- main shop floor
- workbenches
- shelves
- tractor
- motorcycle
- Papa's yellow chair/fireplace
- barn entrance
- barn interior
- outdoor apron

Keep the camera stable in tight spaces while rapid firing and moving.

---

# 28. PERFORMANCE

The black hide overlay must be lightweight.

Rapid fire effects must have bounded lifetimes so holding fire does not continuously increase scene objects/memory.

Do not make rapid fire create excessive network traffic beyond the actual hit/action model.

---

# 29. REQUIRED REGRESSION CHECKS

Do not regress Phase T systems:

- John locomotion
- backpedal/strafe semantics
- layered fire animation
- jump/fall/land
- mantle
- disguise transformation
- decoy placement
- flash
- damage feedback
- Classic spectator mode
- Chaos hunter conversion
- camera recovery

Do not regress Phase S tabletop fixes.

---

# 30. RELEASE DISCIPLINE

For Phase T.1:

1. implement the focused changes
2. run syntax checks
3. run full automated test suite
4. run build validator
5. run 3D asset audit
6. write implementation report
7. write real-device QA checklist
8. create a new staging ZIP
9. cold-extract the exact ZIP
10. rerun tests/validator/audit against the cold copy
11. report exactly what is code-tested versus actually phone-verified

Do not overwrite Phase T or Phase S release ZIPs.

---

# 31. PHASE T.1 ACCEPTANCE BAR

Phase T.1 is ready for device testing only when:

- hunter gets a fully opaque black screen during hide
- countdown is visible
- hunter controls are frozen during hide
- hider positional movement audio is suppressed for blinded hunters
- server masks hider live/disguise/hidden-decoy information during hide
- hunter damage is impossible during hide
- decoys created while hiding survive into hunt
- HUNT release transition works
- Aim button is gone
- crosshair is always the hunter aiming reference
- no separate aim zoom/state is required
- tap SHOOT fires once
- hold SHOOT rapid fires at a controlled rate
- rapid fire stops immediately on release
- hunter can move while firing
- wall-first hit validation remains
- Phase T animation/camera systems remain intact
- all regression tests pass

### Visual approval remains separate

Automated checks cannot prove the black transition feels polished, that the fire rate feels right on a real phone, or that button placement is comfortable. Those remain real-device QA items.

---

# FINAL INSTRUCTION TO THE DEVELOPMENT CHAT

Use this document as the governing directive for **Phase T.1 - Prop Hunt Hunter Release + Combat Controls**.

It supersedes the earlier Phase T requirement for a separate Aim button. Preserve the rest of Phase T's animation/gameplay foundation.

The hunter must be completely blind and locked during the hiding countdown. When the hunt begins, release the player directly into the normal third-person camera with the crosshair already active.

There is **no separate Aim button**.

> **Tap SHOOT for one shot. Hold SHOOT for controlled rapid fire. Every hunter shot goes where the centre crosshair is pointing.**

Measure this phase by fairness, control simplicity and how quickly a family member can understand the hunter controls without instruction.
