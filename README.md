# Black Family Game Night

**Build:** `GAME-NIGHT-STAGING-PHASE-R-PROP-HUNT-P2-GAMMON-UX-16`  
**Package:** `3.3.0-staging-phase-r-prop-hunt-p2-gammon-ux-16`  
**Status:** Staging / technical validation candidate. Real-device visual approval still required.

## Phase R focus

Phase R follows `MASTER_NEXT_BUILD_DEVELOPMENT_DIRECTIVE.md` and deliberately concentrates on two visible problem areas without rewriting unrelated working games.

### 1. Family Prop Hunt P2 visual gate

John remains the first production family-character benchmark. Phase R rebuilds the authored John asset from the same reusable skinned pipeline but moves the model toward the approved stylized-realistic direction:

- less rectangular torso construction
- more tapered adult body silhouette
- refined head proportions
- explicit stylized eyes, pupils, brows, nose/mouth volume
- smaller, more structured beard/jaw silhouette
- improved hair volume
- articulated hand/finger forms
- improved boot/toe geometry
- walk foot articulation and hip-bob motion
- all 19 authored semantic clips preserved
- P2 benchmark metadata: `PH-CHAR-01-P2`

The existing layered lower-body locomotion + upper-body aim/fire system remains in place rather than being replaced.

Papa's Shop keeps its accepted gameplay colliders and authored environment/prop GLBs. Phase R adds restrained local P2 benchmark lighting around the fireplace, work bay, and barn while preserving the repaired shared camera and movement systems.

### 2. Backgammon + Black Gammon board UX

Backgammon and Black Gammon no longer use the generic large green tabletop wrapper for their normal gameplay route. They now use a dedicated Gammon-first surface:

- board receives the majority of the play area
- narrower secondary status/chat area on wide screens
- supporting panels stack below on smaller screens
- large responsive board viewport
- Fit / zoom in / zoom out controls remain available
- default Fit is intended to be playable without mandatory zoom/pan
- old duplicate internal roll controls are hidden inside the dedicated surface
- primary Roll / Large Die / cube controls are placed directly above the board
- successful roll actions immediately fetch and render fresh room state, reducing dependence on SSE timing for visible roll feedback
- the roster pseudo-element responsible for the long vertical player-color line is disabled at its source

Black Gammon's custom rule engine is preserved, including 4/4/4/3 setup, shared dice, big-die tiebreak, backward matching sets, special single 4, contested stacks, rescue, bar and overstack behavior.

## Preserved Phase Q work

Skip-Bo and Cribbage retain their dedicated portrait-first renderers and scoring/play improvements. Phase R does not revert the mobile tabletop work that was already completed.

## Validation

Run locally:

```bash
npm run check
npm run build
python tools/audit_production_assets.py
```

Phase R release logs are written to:

- `PHASE_R_TEST_RESULTS.txt`
- `PHASE_R_CHECK_OUTPUT.txt`
- `PHASE_R_BUILD_VALIDATION.txt`
- `PHASE_R_ASSET_AUDIT.txt`

The final packaged ZIP is separately cold-extracted and retested. See `PHASE_R_PACKAGE_VERIFICATION.txt` in the release bundle for those exact results.

## Important visual status

Automated checks validate code paths, rules, GLBs, manifests and package integrity. They do **not** prove that John has reached final visual approval or that the Gammon layout feels correct on the user's real phone.

Phone/device visual confirmation remains required for:

- John from real Prop Hunt gameplay camera angles
- walk/run/sprint and aim/fire blending
- Papa's Shop lighting and scale
- Backgammon board fit and dice rolling
- Black Gammon board fit, dice rolling, big-die flow and direction highlighting
- confirmation that the vertical line is gone on the actual device

See `PHONE_QA_PHASE_R_PROP_HUNT_P2_GAMMON_UX_16.md`.

## Governing directives

- `MASTER_NEXT_BUILD_DEVELOPMENT_DIRECTIVE.md`
- `MASTER_3D_DEVELOPMENT_DIRECTIVE.md`
- `MASTER_MOBILE_TABLETOP_UX_DIRECTIVE.md`
- `BLACK_GAMMON_MASTER_RULES.md`

## Deploy to staging

```bash
npm run deploy:staging
```

Confirm the visible build ID is:

`GAME-NIGHT-STAGING-PHASE-R-PROP-HUNT-P2-GAMMON-UX-16`
