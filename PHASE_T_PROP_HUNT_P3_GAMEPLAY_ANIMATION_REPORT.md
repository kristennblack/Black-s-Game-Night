# Phase T - Prop Hunt P3 Gameplay + Animation Feel

Build: `GAME-NIGHT-STAGING-PHASE-T-PROP-HUNT-P3-GAMEPLAY-ANIMATION-18`  
Package version: `3.5.0-staging-phase-t-prop-hunt-p3-gameplay-animation-18`  
Status: **Staging. Technical validation complete; real-device animation/visual approval still required.**

## Scope

Phase T is a focused Prop Hunt gameplay/animation-feel pass using John in Papa's Shop as the benchmark. It preserves Phase S tabletop/gameplay repairs and does not attempt a new full-family art rebuild.

## Implemented in Phase T

### Directional locomotion and facing

- Added shared movement-to-facing-space resolution.
- Normal non-aim movement now turns the character toward actual travel direction.
- Aim mode keeps the character facing the camera/crosshair while the lower body resolves forward, backward, strafe-left and strafe-right movement semantics.
- Directional semantics are explicit in the shared gameplay layer so dedicated authored clips can replace fallbacks later without rewriting the movement controller.

### Authored John animation behavior

- Preserved layered lower-body locomotion with upper-body Aim/Fire.
- Added reverse animation playback support and a reverse-walk backpedal fallback for authored John.
- Preserved the 19-clip John P2 authored animation contract rather than falsely adding nonexistent P3 model clips.
- Applied existing procedural foot-grounding/IK support to authored gameplay where safe.
- Added restrained procedural body lean/hip response during movement and aiming.

### Jump / landing / mantle

- Preserved jump buffer, coyote-time and variable-jump behavior.
- Added impact-driven landing strength and a distinct hard-land state for larger falls.
- Changed mantle presentation to a staged lift/push-over motion rather than a simple upward slide.

### Hunter feedback

- Preserved wall-first shot obstruction behavior.
- Kept layered firing while moving.
- Added/retained responsive crosshair/fire feedback and brief damage feedback.

### Hider/disguise gameplay feel

- Disguise change now produces a short transformation burst and scale-in.
- Prop movement gets restrained tilt/bob/grounding feedback.
- Decoys now place deliberately in front of the hider with support-height/collision fallback rather than random scatter.
- Decoy placement gets a short world marker.
- Flash receives a world-space burst/light effect in addition to the affected-screen response.
- HUD buttons now show Prop changes remaining, Flash ready/not-ready, Decoy count and Lock/Unlock state.
- HP is shown compactly with filled/empty dots.

### Damage / elimination / spectating

- Local damage shows a brief damage vignette/pulse.
- Classic-mode eliminated hiders receive a spectator camera following a living target.
- Added a `NEXT` control to cycle living spectator targets.
- Family Chaos conversion remains separate from Classic spectator behavior.

### Phase S preservation

Regression coverage retains the previously implemented Phase S systems, including:

- Skip-Bo Stock source and four Discard top-card source flow
- Cribbage physical board/scoring presentation markers
- Trail Trouble start/first-turn path
- Last Haven Camp-to-Route progression path
- Backgammon and Black Gammon roll flow
- custom Black Gammon engine/rules and 4/4/4/3 setup
- Marbles board-first route
- trick-taking bid context
- Easy-first bots, multiplayer and reconnect foundations

## Technical validation

Working-tree validation after the Phase T changes:

- Full Node test suite: **376 / 376 passed**
- Platform/build validator: **168 passed, 2 warnings, 0 failures**
- Production 3D asset audit: **PASS**
- Syntax/module check: **PASS**

The two build warnings are expected staging warnings:

1. the existing runtime Three.js/addon CDN dependency remains in the 3D stack
2. Wrangler executable is unavailable in this environment, so an actual Cloudflare deployment is **UNVERIFIED**

## What Phase T does NOT claim

- It does not contain a newly sculpted John P3 GLB. It improves gameplay/animation behavior around the existing John P2 authored asset.
- It does not claim that foot skating, strafing or backpedal animation is visually perfect. The controller is implemented and code-tested, but visual quality must be judged in real gameplay.
- It does not claim real-phone verification from this environment.
- It does not rebuild Papa's Shop art geometry in this phase; the established map/colliders and P2 visual slice are preserved while gameplay feel is improved.
- It does not claim Cloudflare staging deployment verification because Wrangler is unavailable here.

## Real-device visual gate

Use `PHONE_QA_PHASE_T_PROP_HUNT_P3_GAMEPLAY_ANIMATION_18.md`.

The most important device checks are:

1. John walking/run/sprint and sharp changes of direction
2. aim while forward/back/left/right movement
3. fire while moving
4. jump, hard land and mantle
5. doorway/camera stability inside Papa's Shop
6. disguise transformation and moving prop feel
7. decoy placement and flash feedback
8. damage and Classic spectator camera

## Acceptance statement

The Phase T code path is ready for staging/device evaluation. The milestone is **not visually approved** until phone gameplay confirms that the new motion, aiming, mantle and disguise behaviors actually look and feel better in the running game.
