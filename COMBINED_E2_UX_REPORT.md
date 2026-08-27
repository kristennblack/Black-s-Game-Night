# Combined E2 / UX Staging Report

**Build:** `3D-STAGING-PHASE-E2-UX-03`  
**Package version:** `3.0.1-staging-phase-e2-ux-03`  
**Status:** CODE-SIDE STAGING CANDIDATE. NOT PRODUCTION READY. REAL-PHONE QA REQUIRED.

## 1. Scope completed

This build combines the requested phone-feedback cleanup for the three live WebGL games with the focused card-play, score-sheet and home-screen UX pass.

### Card interaction

Normal legal single-card table play in **Screw Your Buddy**, **Fuck Your Buddy**, and **Smear** now uses:

`tap legal card -> immediate visual acknowledgement -> server play action -> state refresh`

There is no second Confirm button for the ordinary legal play path. A `cardPlayPending` lock prevents a rapid second card submission while the first action is in flight. The client still uses the server-provided `legalCardIds` list, so removing confirmation does not bypass the existing rule engine.

Genuine multi-step actions remain multi-step. Examples retained include Cribbage crib selection, Marbles & Jokers / Trail Trouble card-plus-pawn/target decisions, Golf draw/swap/discard flow, and other extra-game action panels that require additional choices.

**Rule engines deliberately not rewritten:** `gameEngine.mjs`, `extraGames.mjs`.

### Screw Your Buddy score sheet

The end-of-round overlay now renders the full schedule from `game.schedule` and fills completed rows from `game.history`.

- rounds run vertically
- players are columns
- completed round points and cumulative totals remain visible
- the current/just-completed row is highlighted
- future rounds are visible in a neutral state
- current standings are repeated in a totals strip
- round/player headers use sticky positioning for phone review
- the final game-over panel also retains the complete sheet

No scoring rules were changed.

### Fuck Your Buddy score sheet

The same complete-sheet presentation is used, but it reads the **actual generated Fuck Your Buddy schedule**. It does not substitute the Screw Your Buddy up/down sequence. Each row shows the generated hand size, trump and power rank where present.

No game scheduling or scoring rules were changed.

### Home-screen rebuild

The old full-image hotspot composition is no longer the active home layout. The current home uses:

- a responsive cabin-background hero
- a stable `BLACK FAMILY / GAME NIGHT` title lockup
- a small coherent typography system
- clearer primary and secondary calls to action
- simplified destination chips
- coherent game-card spacing and shelf headings
- a dedicated John focal card
- restrained ambient firelight instead of constantly moving text
- `prefers-reduced-motion` handling
- phone layouts that collapse deliberately rather than simply shrinking desktop content

The new John focal image is `public/john-home-approved.jpg`, mechanically cropped from the project's approved `JOHN_16_LOOKS_REFERENCE.jpg`. This uses the supplied approved project reference rather than inventing a new face or generic male avatar.

The cabin background uses `public/home-cabin-background.jpg`, cropped from the existing approved cabin art so the home can compose cleanly around live HTML instead of relying on invisible hotspots baked over a poster image.

**Final rendered likeness/composition remains VISUAL RESULT UNVERIFIED until browser/phone review.**

## 2. 3D phone-feedback code work

The accepted E1 controller/collision/spawn recovery foundation was kept. This pass does not replace the movement or collision algorithms.

### Standard-player UI cleanup

Across Prop Hunt, Island Life and Birthday Seat:

- shoulder control is a compact `↔` button with accessible label/title
- Reset View is a compact `↺` button with accessible label/title
- zoom controls are smaller and moved away from the main action cluster
- control/audio preferences use compact icon buttons instead of large `CTRL` / `SND` labels
- large mobile instruction overlays are hidden at phone widths where appropriate
- QA toggle and developer asset-warning banner are hidden in standard staging play
- diagnostics remain available with `?qa3d=1`
- the staging build badge remains visible but quieter for screenshot identification

### Camera presentation tuning

The shared camera architecture remains intact, including first-frame snap, multi-ray camera-volume obstruction, solid:false filtering, recovery logic, zoom and Reset View.

Only presentation presets were tuned:

- Prop Hunt: less overhead pitch, slightly more minimum camera space, cleaner shoulder composition
- Island Life: slightly farther relaxed default view and narrower pitch range
- Birthday Seat: slightly farther route-readable framing and narrower pitch range

These are code-side readability improvements. They do not prove the camera is visually correct on the target phone, so real-device validation remains required.

### Player-facing truthfulness

Several labels that overclaimed the current asset state were removed. Standard UI no longer describes fallback models as fully modeled final family rigs. Family Mystery is described as an intended 3D board presentation still in production, not as proof that its current illustrated implementation is the final design.

## 3. 3D art gap remains open

The user-requested final visual standard cannot honestly be completed solely by adding more Three.js primitives or repository-generated parametric GLBs.

The current package still needs an external/proper 3D authoring step for:

- recognizable family-specific human models
- proper quadruped dog models
- shared skinned rigs
- authored animation clips
- finished Papa's Shop and barn art
- production-quality landmark furniture/vehicles/clutter
- other Prop Hunt environments
- Island Life environment kit
- Birthday Seat authored obstacle/environment art
- future Family Mystery dimensional board/rooms

Current collision/blockout coordinates should be preserved separately from future visual meshes.

## 4. Files/systems deliberately preserved

The following gameplay/network foundations were not rewritten for this presentation pass:

- `gameEngine.mjs`
- `extraGames.mjs`
- `worker.mjs`
- `propHuntRoom.mjs`
- `islandLifeRoom.mjs`
- E1 swept movement/collision math in `public/prop-hunt-core.mjs`
- E1 safe spawn / invalid-transform / bounds recovery
- E1 Prop Hunt muzzle revalidation
- E1 vertical disguise selection and decoy support height
- E1 Island interaction LOS / visitor swept movement / cleanup
- Birthday moving-platform carry/checkpoint rules

## 5. Automated validation

`npm run check`:
- **229 / 229 PASS**

`npm run build`:
- **110 PASS**
- **2 declared warnings**
- **0 FAIL**

GLB audit:
- **10 / 10 packaged GLBs validate** for manifest/header/hierarchy and benchmark dimensions

### Declared build warnings

1. Core 3D runtime still depends on Three.js 0.185.1 / addons from external CDNs.
2. Wrangler executable is unavailable in this environment, so actual Cloudflare deployment is **UNVERIFIED**.

## 6. Visual verification limitation

The individual John crop and cabin-background crop were directly inspected while preparing this pass. A reliable final composite browser render could not be completed because the available headless Chromium compositor did not initialize reliably in this environment.

Therefore:

**VISUAL RESULT UNVERIFIED**

Passing automated tests are code-side evidence only, not gameplay or visual proof.

Use the supplied phone checklist after staging deployment.
