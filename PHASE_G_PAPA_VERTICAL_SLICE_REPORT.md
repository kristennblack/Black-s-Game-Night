# Phase G — Papa's Shop Production Vertical Slice 05

Build: `GAME-NIGHT-STAGING-PHASE-G-PAPA-VSLICE-05`

## Scope

This phase is intentionally limited to the first visual-production gate requested after the real-phone rejection of the previous three 3D games. It does **not** propagate the art approach to Island Life or Birthday Seat yet.

The target is Papa's Shop with:

- one John render asset,
- one reusable human animation set embedded in that asset,
- one Papa's Shop + attached barn render asset,
- one key-prop/clutter render set,
- cleaner Prop Hunt camera/control presentation,
- old gameplay/collision foundations preserved.

## What changed

### John

`public/models/characters/john-production-skinned.glb`

The previous John benchmark had no glTF skin and no authored clips. Phase G replaces that runtime path with a new GLB containing:

- one glTF skin,
- `JOINTS_0` / `WEIGHTS_0` skinned vertex data,
- named humanoid joints,
- right-hand, left-hand, back and head sockets,
- embedded approved John face reference texture,
- embedded plaid and denim textures,
- named `John_Shirt_PrimaryClothing` material for player-colour tinting,
- 14 embedded clips:
  - Idle
  - Walk
  - Run
  - Turn_Left
  - Turn_Right
  - Jump
  - Fall
  - Land
  - Aim
  - Fire
  - Hit_Reaction
  - Wave
  - Celebrate
  - Sit

Measured asset audit: approximately 2.33 MiB, 41,378 triangles, three embedded images.

### Papa's Shop + attached barn

`public/models/environments/papa-shop-barn-production.glb`

The dedicated visible environment asset contains the current accepted shop/barn layout as a render mesh, including the shop shell, attached barn, roof, fascia/gutters, openings, door/window framing, shop sign, interior structure, chimney, barn rails, and exterior dressing. It is aligned to the existing gameplay coordinates.

Measured asset audit: approximately 248 KiB, 574 nodes, 8,956 triangles, 37 materials.

### Production vertical-slice prop set

`public/models/sets/papa-shop-production-props.glb`

The set includes dedicated render meshes for the vertical slice's major recognizable objects and representative clutter, including:

- Papa's worn yellow high-back chair,
- fireplace,
- tractor,
- old motorcycle,
- workbench and pegboard tools,
- tool chest,
- shelving/storage bins,
- buckets,
- gas cans,
- shop vacuum,
- sawhorse/lumber,
- extension cord,
- oil jug,
- beer case,
- garbage can.

Measured asset audit: approximately 194 KiB, 172 nodes, 16,716 triangles, 22 materials.

### Gameplay integration

For Papa's Shop only, `public/prop-hunt-3d.js` now attempts to load the dedicated environment and prop-set GLBs. On successful load:

- old visible prototype structural meshes are hidden,
- old hero-object fallback render meshes are hidden,
- the dedicated vertical-slice assets become the visible representation,
- the existing collision/AABB/spawn/climb/gameplay layout remains authoritative,
- load failure restores the prior safe fallback rather than breaking the game.

This deliberately separates visible art from gameplay collision.

### Animation integration

The existing `SemanticAnimationMixer` and gameplay state system remain in place. Phase G gives that system embedded clips to play for John rather than relying only on procedural joint posing. Prop Hunt firing also triggers the semantic Fire state.

### Controls/camera

The accepted camera obstruction/recovery and movement foundation remains intact. Phase G adds/refines:

- right-side touch-drag camera look on mobile,
- two-finger pinch camera-distance zoom,
- mouse-wheel zoom on desktop remains,
- reduced permanent control-help text,
- a more conservative Prop Hunt default pitch/distance profile.

## Verification results

### CODE VERIFIED — PASS

- `npm run check`: **251 / 251 tests passing**.
- Existing E1 continuity and Phase F platform tests remain included.

### STATIC / PACKAGE-SHAPE VERIFIED — PASS WITH DECLARED WARNINGS

`node tools/phase_e_validate.mjs`:

- **120 pass**
- **2 warnings**
- **0 failures**

Declared warnings:

1. Three.js/addons are still loaded from the existing CDN path.
2. Wrangler is unavailable in this execution environment, so actual Cloudflare deployment is unverified.

### ASSET VERIFIED — TECHNICAL PASS

`python tools/audit_phase_g_vertical_slice.py` verifies:

- John contains a real glTF skin,
- skinned vertex attributes exist,
- all 14 required semantic clips are embedded,
- required sockets exist,
- clothing recolour material exists,
- Papa shop/barn asset contains named major structures,
- Papa prop set contains named major hero/clutter objects,
- manifest points to the Phase G assets,
- phone-aspect proof render exists.

The older production-asset audit also passes manifest/GLB hierarchy/scale checks.

### RENDER VERIFIED — LIMITED PASS

`PAPA_SHOP_VERTICAL_SLICE_PHONE_RENDER.png` was rendered offline from the actual packaged Phase G GLBs and visually inspected in this environment. It demonstrates that the Phase G asset path is materially different from the old runtime mannequin/blockout path.

This image is **not** a browser capture and **not** a real-phone screenshot.

### PHONE VERIFIED — NOT YET VERIFIED

The user must still test the packaged WebGL build on a real phone. This remains the acceptance gate for:

- actual browser GLB appearance,
- animation blending,
- camera feel around real geometry,
- pinch/touch-look feel,
- mobile performance,
- Cloudflare serving/caching of the new assets.

## Important art-production limitation

This environment does not provide Blender, Maya, or another full DCC modeling/rigging package, and no installable 3D-authoring plugin is available. The assets in this phase are therefore **locally code-authored/algorithmic GLB meshes** with real skinning, animation data and embedded textures. They are no longer assembled at runtime from Three.js mannequin primitives, but they are **not being represented as studio-final hand-modeled character/environment art**.

The approved John references and family lineup remain the final visual target. If the real-phone screenshot still does not meet that target, the correct next step is external DCC character/environment authoring, not another round of runtime primitive polishing.

## Not changed in this phase

- Island Life environment art
- Birthday Seat environment art
- other family avatar production assets
- Prop Hunt gameplay rules
- Island rules/state
- Birthday platform/checkpoint gameplay
- accepted E1 collision/spawn/recovery fixes
- Phase F card/board/profile/tutorial/platform upgrades

