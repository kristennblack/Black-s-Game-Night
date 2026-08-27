# Phase R Report: Prop Hunt P2 + Gammon UX

## Build
`GAME-NIGHT-STAGING-PHASE-R-PROP-HUNT-P2-GAMMON-UX-16`

## Purpose
Phase R follows `MASTER_NEXT_BUILD_DEVELOPMENT_DIRECTIVE.md`. It addresses two user-visible priorities without rewriting unrelated game systems:

1. advance John / Papa's Shop toward the Prop Hunt P2 visual gate;
2. make standard Backgammon and Black Gammon large, direct, reliable board-game screens and repair the reported roll/line issues.

## Source baseline
Work was performed from the full Phase Q staging project source, not from a partial audit folder. Existing rule engines, multiplayer, reconnect, Phase Q Skip-Bo/Cribbage work, Prop Hunt camera recovery, movement/collision, and authored 3D pipeline were preserved.

## Prop Hunt P2 changes

### John PH-CHAR-01-P2
The existing authored/skinned John builder was refined rather than replaced with a disconnected model pipeline.

Changes include:
- tapered torso construction instead of the previous more rectangular shirt volume;
- refined pelvis/leg silhouette;
- adjusted head proportions and higher geometric subdivision;
- explicit eye whites, pupils, eyebrows and lip/mouth geometry for gameplay-distance face readability;
- reduced/refined beard volumes around jaw, cheeks and moustache;
- retained hair-volume construction with adjusted face relationship;
- articulated finger/thumb forms retained and refined by the P2 builder;
- boot wedge plus rounded toe volume for less block-like feet;
- Walk clip adds foot articulation and small hip translation/bob;
- all 19 semantic authored animation clips remain present;
- manifest/GLB metadata now identifies `PH-CHAR-01-P2`, phase `P2`, visual gate `character-and-animation`.

The rebuilt John GLB remains a single skinned production asset used through the shared authored-asset pipeline. `JOHN_P2_BINDPOSE_QA.png` is included as an offline source-space geometry proof. It is explicitly **not** an in-game lighting/camera approval image.

### Animation/gameplay preservation
The runtime already had the important P1 layered animation improvement: lower-body locomotion can remain active while upper-body Aim/Fire overlays play. Phase R preserves that system instead of replacing it.

The repaired shared third-person camera, spawn recovery, obstruction handling, movement, jump/mantle and shooting systems are also preserved.

### Papa's Shop
The accepted gameplay geometry/colliders and authored environment/prop set remain intact. Phase R adds three non-shadow-casting local P2 benchmark lights:
- warm fireplace glow;
- warm work-bay fill;
- subtle cooler barn fill.

The goal is to improve depth/readability without darkening the shop or adding an expensive shadow source to every clutter prop.

## Backgammon + Black Gammon changes

### Dedicated Gammon route
Backgammon and Black Gammon no longer use the generic `threeNewGameplay()` green tabletop composition. They now route through `gammonGameplay()`.

The new route provides:
- a screen-first Gammon surface;
- large board viewport;
- responsive board canvas;
- dedicated primary action strip;
- Fit / zoom out / zoom in controls;
- narrow secondary status/chat column on wide screens;
- stacked secondary content on narrower screens.

### Green table constraint
The dedicated Gammon surface does not use the large green `.three-new-table` wrapper that was shrinking the actual board in the user's screenshot. The board is now given the majority of the visual surface.

### Dice / action reliability
Roll-related actions are surfaced directly above the board. The old internal board primary-action area is hidden inside the new Gammon surface to prevent duplicated Roll controls.

The generic action panel also filters the primary Gammon roll/big-die/cube actions so the player is not presented with competing duplicates.

After these successful API actions:
- `bgOpeningRoll`
- `bgRoll`
- `blackRoll`
- `blackBigRoll`

the client now explicitly fetches fresh room state and immediately rerenders. SSE/live updates remain supported, but visible dice feedback no longer depends on the live event arriving first.

### Vertical line artifact
The long player-color line seen in the screenshot came from an absolutely positioned `.three-new-roster>div>span:before` pseudo-element without a positioned local containing block. A later border-left treatment already supplies player identity, so Phase R disables that pseudo-element at the source.

### Responsive board scale
New Gammon CSS increases the real board area and checker/die readability across wide screens and portrait widths. Fit uses width-first board fitting for the dedicated Gammon route and avoids the old green-table height constraint.

### Rule preservation
The rendering/interaction changes do not replace either game engine. Black Gammon retains the locked 4/4/4/3 setup, shared normal dice, large tiebreak die, matching-set directions, special 4, transfers, bar rules, contested stacks, rescue timing, overstack and bearing-off rules.

## Phase Q preservation
The dedicated Skip-Bo and Cribbage routes remain in `extraGameplay()` and are covered by regression tests in the Phase R suite.

## Technical validation
Current pre-package results: **354/354 Node tests passed**, the staging validator reports **151 passes / 2 warnings / 0 failures**, and the production 3D asset audit passes. The two staging warnings are the existing runtime Three.js CDN dependency and unavailable local Wrangler executable / unverified live Cloudflare deployment.

The working tree is validated with:
- JavaScript syntax checks;
- full Node regression suite;
- staging build validator;
- production GLB/manifest audit.

The final ZIP is then cold-extracted and those checks are rerun from the extracted package. Exact counts/results are recorded in `PHASE_R_PACKAGE_VERIFICATION.txt` after packaging.

## Visual status
This report does **not** claim phone visual approval.

The environment available for this build can validate source, rules, assets and package structure, but real-device confirmation is still required for:
- John's likeness from actual gameplay angles;
- foot sliding / animation feel;
- aim/fire layering appearance;
- Papa's Shop lighting balance;
- Gammon board size on the user's phone;
- real roll interaction;
- confirmation the blue line is gone on-device.

Use `PHONE_QA_PHASE_R_PROP_HUNT_P2_GAMMON_UX_16.md` after staging deployment.
