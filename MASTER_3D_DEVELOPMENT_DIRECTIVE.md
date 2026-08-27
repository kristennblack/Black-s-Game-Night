# BLACK FAMILY GAME NIGHT

## Master 3D Development Directive


# PHASE W.5 CHARACTER ART OVERRIDE — HIGHEST PRECEDENCE

The file `MASTER_APPROVED_FAMILY_CHARACTER_DIRECTIVE.md` is now the highest-precedence source for family character identity. For characters with an explicitly approved turnaround, the older **stylized realism** target is superseded by the approved **ultra-simplified family cartoon** target.

**Core rule:** the approved turnaround controls identity. New 3D work may reveal missing angles and simplify topology, but it may not redesign skin tone, hair colour/style, face, body identity or approved base clothing.

Runtime code is centralized in `public/approved-family-characters.mjs`, and all candidate authored GLBs must be compared against the stored approved turnaround before they can be flagged `approvedModel: true`.

### PRIMARY OBJECTIVE

The immediate priority is to transform **Family Prop Hunt** into the flagship 3D game for Black Family Game Night.

Stop attempting to improve every 3D game simultaneously.

Family Prop Hunt will become the **visual, technical, character, animation, camera, control, lighting, environment and performance benchmark** for the rest of the application.

Build its systems so they are reusable by Island Life, Birthday Seat, future 3D games and other applicable areas of the app.

This is no longer a prototype-quality exercise.

Treat development as a small professional game studio would:

1. Establish the quality target.
2. Build reusable systems.
3. Validate them visually and through actual gameplay.
4. Polish them until they meet the target.
5. Lock approved work.
6. Only then propagate those systems to other games.

**Quality over quantity.**

Do not mark a visual system or asset as finished simply because it technically works.

---

# 1. FAMILY PROP HUNT IS THE FLAGSHIP

Family Prop Hunt receives first priority.

Do not dilute development time by attempting major visual rebuilds of Island Life, Birthday Seat or other 3D games until the Prop Hunt foundation reaches the required standard.

Prop Hunt should establish the shared standard for:

- Characters
- Character rigs
- Character materials
- Facial appearance
- Animation
- Movement
- Third-person camera
- Aiming
- Shooting
- Mobile controls
- Desktop controls
- Collision
- Environment assets
- Props
- Lighting
- Shadows
- Effects
- Audio integration
- Performance
- Multiplayer representation
- Overall visual polish

Once these systems work correctly in Prop Hunt, make them reusable rather than rebuilding them independently for every game.

---

# 2. CHARACTER QUALITY RESET

The current blocky, low-detail, prototype-looking characters are **not the target**.

Characters should become polished 3D game characters with:

- Believable human proportions
- Recognizable family likenesses
- Proper heads, faces, hands, arms, legs and bodies
- Clean silhouettes
- Good clothing geometry
- Proper materials
- Appropriate hair
- Expressive faces
- Natural posture
- Consistent scale
- Consistent art direction

The target is **stylized realism suitable for a polished modern family video game**, rather than photorealism.

Do not rely on crude geometric approximations when a proper character asset should exist.

Characters should look intentionally designed from every normal gameplay camera angle.

### Family likeness

Where reference photographs are available, use them to make each family character clearly recognizable while maintaining the shared game art style.

Do not sacrifice recognizability simply to make every character generic.

John is especially important because he is the focus of the birthday experience.

---

# 3. PROFESSIONAL CHARACTER PIPELINE

Build a reusable character system rather than individually hacking each character into the game.

Each playable human character should use a consistent:

- Skeleton
- Rigging convention
- Animation controller
- Movement controller
- Character scale
- Collision system
- Equipment attachment system
- Camera relationship
- Material quality level

Characters should be able to share animations wherever practical.

Build the pipeline correctly once, then use it across the family cast.

---

# 4. ANIMATION QUALITY

Characters must stop appearing stiff or simply sliding through the environment.

Create smooth transitions between appropriate animations, including:

- Idle
- Walk
- Jog
- Run
- Sprint
- Start movement
- Stop movement
- Turn
- Jump
- Falling
- Landing
- Crouching where applicable
- Climbing or mantling where applicable
- Holding the Prop Hunt weapon
- Aiming
- Firing
- Taking damage
- Using abilities
- Celebration/emotes where appropriate

Animation speed should correspond naturally with actual movement speed.

Feet should not obviously skate across the ground.

Characters should smoothly turn into movement rather than snapping unnaturally.

The upper body should work correctly with aiming while the lower body continues locomotion.

---

# 5. MOVEMENT AND GAME FEEL

The player should feel enjoyable to control before additional visual features are piled on top.

Movement should be:

- Responsive
- Smooth
- Predictable
- Easy to learn
- Comfortable on mobile
- Comfortable with keyboard/mouse
- Appropriate for a casual family game
- Forgiving without feeling automated

Preserve the useful movement work already completed, including appropriate acceleration, braking, jumping, recovery and collision improvements.

Do not reintroduce previous camera or movement failures.

---

# 6. THIRD-PERSON CAMERA

The camera is a critical gameplay system.

Use a polished third-person camera with:

- Comfortable over-the-shoulder perspective
- Smooth following
- Smooth rotation
- Appropriate distance from the character
- Sensible vertical angle
- Obstruction awareness
- Collision avoidance
- Automatic recovery
- No roof trapping
- No sudden top-down collapse
- No camera spawning inside the character
- No severe clipping through walls
- No player becoming visually pinned beneath geometry
- Adjustable zoom where appropriate
- Reset View option

The camera must remain stable while running, jumping, climbing and aiming.

Camera behavior should feel consistent across the entire map.

---

# 7. PROP HUNT AIMING AND SHOOTING CONTROLS

The current aiming/shooting experience needs a significant usability upgrade.

The desired feel is inspired by accessible, polished third-person Roblox-style games such as the control experience we discussed from **Zoo or Oof**, without copying proprietary assets or code.

The important target is the **feel**:

- Easy to understand immediately
- Smooth camera aiming
- Responsive shooting
- Comfortable third-person positioning
- Clear crosshair
- Clear hit feedback
- Minimal fighting against the camera
- Appropriate sensitivity
- Good mobile touch controls
- Good desktop mouse controls

For touch devices, investigate sensible assistance such as:

- Mild aim assistance
- Comfortable camera drag zones
- Large enough action controls
- Clear shoot control
- Jump control
- Prop-change control
- Flash-grenade control
- Easy movement joystick

Do not make aim assistance so strong that the game plays itself.

The goal is accessibility and fun.

---

# 8. PROP HUNT ENVIRONMENT QUALITY

After the core character system reaches the required standard, bring the environment to the same quality level.

Do not use a beautiful character inside an obviously primitive environment.

Papa's Shop should be the **first environment benchmark**.

It should feel like a real, lived-in family shop translated into a polished animated game world.

Improve:

- Architecture
- Walls
- Floors
- Roof structure
- Doors
- Shelving
- Workbenches
- Machinery
- Tractor
- Motorcycle
- Tools
- Lumber
- Welding equipment
- Buckets
- Cords
- Shop clutter
- Fireplace area
- Furniture
- Attached barn
- Outdoor apron
- Animal areas
- Lighting
- Materials
- Shadows

Papa's yellow, old, tattered chair beside the fireplace remains an important visual landmark.

The environment should contain enough believable clutter to make Prop Hunt interesting without becoming visually unreadable.

---

# 9. PROPS

Prop Hunt succeeds or fails partly on prop quality.

Props should look like objects that genuinely belong in their environments.

Avoid crude boxes standing in for finished assets.

Build reusable prop categories with consistent:

- Geometry
- Materials
- Scale
- Collision
- Shadows
- Interaction points

When a player becomes a prop, the disguised object should look identical or extremely close to the environmental version.

---

# 10. LIGHTING AND ATMOSPHERE

Lighting should be treated as part of the art direction, not an afterthought.

Use:

- Directional lighting
- Appropriate ambient/environment lighting
- Soft but readable shadows
- Local light sources
- Fireplace glow
- Interior/exterior contrast
- Material response
- Appropriate atmospheric effects

Do not hide poor geometry under darkness.

The game should remain easy to navigate while still looking rich and dimensional.

---

# 11. HOME SCREEN: RESTORE THE APPROVED CABIN

Restore the previously approved **realistic cozy log-cabin home screen**.

This was not necessarily the earliest release. It was an intermediate version that had the desired room composition.

The approved concept includes:

- Cozy log cabin
- Fireplace
- Realistic animated fire
- Moving firelight
- John sitting near the fireplace
- John's birthday portrait/photo above the fireplace
- Warm birthday/family atmosphere
- Dimensional cabin environment

**Do not redesign this room from scratch.**

Search the existing project/history/assets for the closest implementation of this approved version and restore it where possible.

If the exact implementation cannot be recovered, recreate it faithfully from the established description rather than inventing a different home screen.

---

# 12. JOHN ON THE HOME SCREEN

The previous seated John character did not resemble John closely enough.

Keep the approved room composition, but replace or substantially improve the seated John character.

John should:

- Clearly resemble the provided reference photographs
- Maintain believable proportions
- Fit the game's stylized-realistic art direction
- Look natural while sitting
- Have a recognizable face
- Have believable hair and facial features
- Be properly lit by the fireplace
- Feel integrated into the room rather than pasted into it

The home screen is effectively the game's **hero shot**.

Give this scene additional visual attention.

---

# 13. HOME SCREEN GAME-SELECTION UI

Keep the cabin environment, but substantially upgrade the game-selection interface.

The existing interface has problems including:

- Game-name text appearing doubled or layered
- Blurry text
- Flat rectangular borders
- Weak dimensionality
- Generic-looking icons
- UI that appears placed over the scene rather than belonging to it

Correct all of these.

### Typography

Game names must be:

- Razor sharp
- Easy to read
- Properly aligned
- Consistent
- Free of accidental duplicate layers
- Free of blurry fake shadows
- Free of overlapping text

### Game-selection buttons

Replace the flat square-box appearance with premium dimensional controls.

Explore cabin-appropriate materials such as:

- Carved wood
- Dark metal
- Forged hardware
- Layered plaques
- Recessed or raised lettering

Buttons should have genuine visual depth through geometry, lighting and restrained shading.

They should feel like crafted objects belonging inside the cabin.

---

# 14. GAME ICONS

The small emoji-like images beside game names should be redesigned.

Each game should receive a recognizable custom icon reflecting its identity.

Icons should share one professional visual language while still making each game distinct.

Avoid generic emoji appearance.

Icons should be:

- Dimensional
- Detailed enough to feel premium
- Simple enough to read at small sizes
- Consistent in framing
- Consistent in lighting
- Consistent in rendering style

---

# 15. HOME SCREEN MICRO-ANIMATION

Bring the cabin to life without turning it into visual noise.

Potential subtle animation includes:

- Fireplace flames
- Firelight flicker
- Gentle shadows
- Very subtle environmental movement
- Button hover response
- Button press depth
- Soft illumination when a game is selected
- Small icon reactions where tasteful
- Natural seated idle movement for John

Animations should make the room feel alive rather than making the interface distracting.

---

# 16. UI MUST BELONG TO THE WORLD

The home-screen interface should feel integrated with the cabin.

Do not simply place modern flat web cards over a 3D room.

Where practical, make selections feel like physical or dimensional elements of the environment.

The goal is:

**a game room that happens to be an interface**, rather than a webpage with a cabin behind it.

---

# 17. LOCK APPROVED DESIGNS

Introduce a strict preservation rule.

Once the user approves a design, asset, layout, control system or visual direction, consider it **locked**.

Future releases must not casually replace approved work.

Before changing a locked component, determine whether the requested work actually requires that component to change.

If it does not, preserve it.

This applies especially to:

- Home-screen composition
- Cabin art direction
- Character appearance
- Controls
- Camera behavior
- Map layouts
- Game rules
- Multiplayer behavior

A release should move forward, not trade one solved problem for another.

---

# 18. DO NOT CONFUSE AUTOMATED TESTS WITH VISUAL QUALITY

Passing tests does not prove that a 3D game looks good.

Automated tests should continue, but visual quality requires actual visual inspection.

For major 3D milestones:

1. Build the change.
2. Run technical tests.
3. Launch the game.
4. Inspect it from real gameplay camera positions.
5. Capture visual proof.
6. Check characters, lighting, camera and environment.
7. Correct obvious visual failures.
8. Re-test.
9. Only then call the milestone complete.

A technically valid GLB or passing automated test is not sufficient evidence that the asset looks good.

---

# 19. PERFORMANCE

Visual improvements cannot make the web game unusable.

Optimize intelligently for browser/mobile delivery.

Use appropriate:

- Polygon budgets
- Texture sizes
- Texture compression
- Asset reuse
- Instancing
- LOD where useful
- Animation reuse
- Lazy loading
- Culling
- Lighting strategy

Do not achieve performance by reverting everything to primitive low-quality geometry.

Find the appropriate balance.

---

# 20. REUSABILITY

Every major Prop Hunt improvement should answer:

**Can this improve the other 3D games later?**

Build shared systems wherever sensible.

Examples:

- Shared character renderer
- Shared character rigs
- Shared animation controller
- Shared movement controller
- Shared camera
- Shared mobile input
- Shared lighting utilities
- Shared asset loader
- Shared material library
- Shared performance settings

Avoid one-off hacks unless absolutely necessary.

---

# 21. DEVELOPMENT ORDER

Work in this order unless a genuine technical dependency requires otherwise:

### Phase 1: Preserve and stabilize

Protect existing gameplay, multiplayer behavior, rules, reconnect systems and approved content.

### Phase 2: Character benchmark

Produce the first genuinely polished family character and prove the character pipeline.

### Phase 3: Animation and locomotion

Make that character move convincingly.

### Phase 4: Camera and controls

Achieve polished third-person movement, aiming and shooting.

### Phase 5: Papa's Shop visual benchmark

Bring one complete Prop Hunt map to the target environmental quality.

### Phase 6: Prop quality

Upgrade disguises and environmental objects.

### Phase 7: Lighting and effects

Complete the visual presentation.

### Phase 8: Full Prop Hunt integration

Apply the finished pipeline across Prop Hunt.

### Phase 9: Home-screen restoration and polish

Restore the approved cabin and implement the improved dimensional UI.

### Phase 10: Reuse

Only after the benchmark is proven, begin transferring the shared systems to the other 3D games.

---

# 22. BIRTHDAY PRIORITY

The birthday deadline matters.

Do not sacrifice the flagship experience by spreading effort across too many unfinished 3D games.

If necessary, deliver **one excellent Prop Hunt experience** rather than several mediocre 3D experiences.

The birthday build should prioritize:

1. A beautiful home-screen entrance.
2. A recognizable John.
3. A polished cabin.
4. A visually convincing Prop Hunt.
5. Smooth controls.
6. Fun multiplayer gameplay.
7. Reliable performance.

Additional improvements can follow after the birthday.

---

# 23. RELEASE DISCIPLINE

For each meaningful milestone:

- Preserve the previous working release.
- Do not overwrite the only known-good version.
- Keep version numbers clear.
- Document what changed.
- Document what remains incomplete.
- Run regression tests.
- Visually inspect affected 3D areas.
- Package a new project ZIP when the milestone is genuinely complete and a release artifact is requested.

Do not claim something has been visually verified if it has only been tested through code.

---

# 24. FINAL QUALITY BAR

The target is not literal AAA photorealism.

The target is a **cohesive, polished, charming, modern 3D family game that feels intentionally made rather than procedurally assembled**.

When deciding whether something is finished, ask:

- Does it look intentional?
- Does it look cohesive?
- Does the character belong in this environment?
- Is the family member recognizable?
- Does movement feel good?
- Does the camera behave properly?
- Is the UI crisp?
- Does the lighting add depth?
- Would a player immediately understand the controls?
- Did this release preserve previously approved work?
- Is this genuinely better than the previous version?

If the answer to an important question is no, continue refining that component before declaring it complete.

---

## INSTRUCTION FOR THE DEVELOPMENT CHAT

Use this document as the governing design and development directive for the current project.

First inspect the **actual latest project ZIP and existing source/assets** before making changes.

Do not rebuild working systems unnecessarily.

Identify what already exists, what can be reused, what is broken, and what specifically prevents the current build from meeting this directive.

Then create a concrete implementation plan based on the actual repository.

**Do not immediately attempt a giant blind rewrite.**

Begin with Family Prop Hunt and establish the first visual benchmark.

Preserve all established game rules and multiplayer behavior unless explicitly instructed otherwise.

When there is a conflict between a generic improvement and an explicitly approved design decision, the approved design decision wins.

The objective is not simply to generate more code.

The objective is to make the game visibly, measurably and experientially better.
## Phase W.7 Prop Hunt character/combat override
For Prop Hunt hunter characters, approved turnaround identity has higher precedence than older realism language. A legacy GLB with `approvedModel !== true` must not replace the approved procedural fallback. Use a close shoulder camera, two-hand Prop Zapper grip, center-screen ray-matched crosshair, muzzle-origin obstruction validation, visible 3D tracer and visible impact burst. John is the first real-device vertical-slice gate before propagation to the rest of the family.
