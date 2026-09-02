# Black Family Game Night — W39 True-3D Cabin Furniture Report

Candidate: `GAME-NIGHT-STAGING-CANDIDATE-W39-TRUE3D-CABIN-FURNITURE-58`  
Base official release: `GAME-NIGHT-STAGING-PHASE-W30-PROP-HUNT-P0-GAMEPLAY-54`  
Status: **Technical staging candidate. Visual/device approval is still required.**

## Why W39 exists
W38 furniture QA established that the Home catalog is much larger than the production 3D furniture set and that many distinct furniture identities still collapsed into a few broad runtime shapes. W39 fixes the runtime foundation before attempting mass furniture production.

## What W39 implements

### 1. True-3D benchmark room
`/cabin-furniture-benchmark.html` uses the actual Cabin WebGL renderer, not a target mockup. It creates a fixed 14 x 16 ft QA bedroom containing:
- W25 Double Cabin Bed production GLB;
- W25 Kristen's Cozy Lodge Reading Chair production GLB;
- W25 Live-Edge Nightstand production GLB;
- W25 Warm Table Lamp production GLB;
- W39 dimensional dresser fallback;
- W39 dimensional rug fallback;
- W39 dimensional wall TV fallback;
- W39 dimensional desk-chair fallback.

The benchmark does not mutate ownership or room saves. Its only purpose is repeatable runtime/visual proof.

### 2. Production-first visual hierarchy
Furniture now resolves in this order:
1. Device-approved production model when one eventually exists;
2. current W25 production/QA GLB;
3. W39 design-specific dimensional fallback;
4. older broad category-generic 3D fallback;
5. SVG/2D only when WebGL itself cannot run.

This prevents a missing/incomplete new model from making a room visually emptier or collapsing an item into the wrong silhouette.

### 3. Design-specific 3D fallback families
`public/w39-cabin-furniture.mjs` distinguishes beds, bunk/canopy/daybed/storage/floating beds, sofas, loveseats, chaise lounges, rocking chairs, recliners, benches, barrel chairs, desk chairs, bean bags, nightstands, coffee tables, writing desks, vanities, game/farm tables, dressers, wardrobes, bookcases, storage chests, hutches, rugs, wall TVs, lamps and wall art.

These procedural objects are explicitly **fallback art**, not final approved production assets.

### 4. Physical scale contract
Catalog `Footprint W/D` values remain useful editor metadata, but they are no longer treated as unquestioned real-world model dimensions. W39 adds a separate physical-footprint layer:
- exact measured W25 GLB bounds where available;
- family-specific physical dimensions for W39 fallback furniture;
- rotated physical bounds for placement and collision.

Persisted x/z remain room anchors. The 3D renderer converts the anchor to the object's physical center and converts a raycasted center back to the saved anchor. This fixes the prior anchor-vs-center mismatch.

### 5. Client + server spatial validation
`public/cabin-placement-validation.mjs` is shared by the browser and server. It now validates:
- supported floor/wall surfaces;
- physical room bounds;
- rotated physical footprints;
- furniture-vs-furniture overlap;
- non-blocking rug/decor layering.

The server uses the same rule for new or modified placements. Existing unchanged legacy placements may remain grandfathered so old rooms are not destructively cleared, but moving/editing them brings them under the new rule.

### 6. Rejected saves can no longer masquerade as success
The previous client save path treated a server 4xx rejection similarly to a network failure and could write the rejected state locally. W39 distinguishes:
- genuine network/offline failure -> local resilience path;
- explicit server rejection -> remains rejected and is surfaced to the player.

### 7. W25 production-material treatment
The four W25 Home GLBs retain their authored geometry and model identity. At runtime W39 tunes their PBR material behavior using the real material names:
- walnut/wood: grounded rough wood response;
- cognac leather/leather piping: softer leather roughness;
- linen/textile/wool: high-roughness cloth response;
- brass/bronze/steel: metallic response;
- lamp bulb: emissive response.

W39 does not falsely add texture maps that do not exist in the source GLB.

### 8. Furniture interactions
The benchmark/runtime exposes current interaction hooks:
- chair -> seat target;
- bed -> sleep target;
- nightstand/table -> decor surface target;
- lamp -> persisted on/off state + real point light;
- dresser/storage -> storage/clearance hook;
- wall TV -> screen hook.

Avatar sit/lie animations and fully animated drawers remain separate production gates and are not falsely claimed complete.

### 9. Mobile camera improvements
The Cabin retains orbit controls and adds/keeps:
- touch drag orbit;
- two-finger pinch zoom;
- wheel zoom on desktop;
- double-click/reset camera;
- fixed benchmark camera for comparable QA captures.

### 10. High-confidence catalog metadata repair
W39 repaired 364 core-furniture Subcategory records where the item name unambiguously identifies the furniture family. Examples:
- Carved Elk Canopy Bed -> Canopy Bed;
- Deep Hearth Sofa -> Sofa;
- Stitched Walnut Rocking Chair -> Rocking Chair;
- Framed Cedar Dining Chair -> Dining Chair;
- Butcher Block Farm Table -> Farm Table;
- Glass Trophy Hutch -> Hutch.

Item IDs, category, price, collection, ownership, source, Art Status and Approved For Live were not promoted or rewritten.

## Automated verification
Final verification must be read from the exact packaged candidate, but the working-tree gates for this pass are:
- W39 focused tests: 10/10 pass;
- full project tests: 639/639 pass before final cold-package rerun;
- `npm run check`: pass before final cold-package rerun;
- staging validator: 4,309 pass / 2 warnings / 0 fail before final cold-package rerun;
- production 3D asset audit: pass.

Known infrastructure warnings:
1. Three.js/addons still depend on CDN delivery;
2. Wrangler/Cloudflare deployment cannot be verified in this environment.

## Visual proof status
A local Chromium benchmark launch was attempted. The sandbox cannot initialize EGL/WebGL (`EGL_NOT_INITIALIZED`), so **no W39 gameplay screenshot is being claimed from this environment**.

The visual gate is therefore still open. The next legitimate proof is the actual benchmark running on staging/phone, followed by an actual screenshot/video review.

## Release truthfulness
`CURRENT_RELEASE.txt`, `DESIGN_RELEASE.txt`, package official identity and the W30 service-worker release lineage remain unchanged. W39 is a staging candidate until the visual/device gate is passed.
