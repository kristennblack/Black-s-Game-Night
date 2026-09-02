# BLACK FAMILY GAME NIGHT
# MASTER PHASE W39 — TRUE-3D CABIN FURNITURE REALISM DIRECTIVE

Planning/build date: 2026-09-01
Status: HIGHEST-PRECEDENCE CABIN/FURNITURE PRODUCTION DIRECTIVE
Base candidate: W36 Leapfrog Hybrid
QA foundation: W38 Deep Furniture QA

## 0. Mission
Turn the Cabin from a catalog-driven decorator with legacy flat/generic presentation into a professional, believable, stylized-realistic 3D decorating space while preserving all existing ownership, blueprint, family-room and social rules.

The first deliverable is not 2,000 models. The first deliverable is one room that convincingly proves the production pipeline.

## 1. Problems W39 must correct
### 1.1 Flat presentation legacy
Historical Cabin screenshots show furniture as top-down/2D tokens. That is unacceptable as the normal path. The WebGL room renderer must be the primary player-facing surface.

### 1.2 Generic silhouette collapse
The W20 procedural bridge reduces many distinct catalog identities into a few generic families. This is a temporary bridge only. W39 must add design-specific/subtype-specific 3D fallback families and must never treat a category-generic silhouette as final art.

### 1.3 Catalog subtype corruption
W38 found large-scale mismatches between names and stored subcategories in generated core furniture. Where the intended furniture type is objectively clear from the item name, repair the subtype metadata without changing item ID, ownership, price, collection, source or unlock rules.

### 1.4 Placement coordinate mismatch
The existing 2D placement core treats x/z as a footprint anchor, while the 3D renderer historically treated x/z like object centers. W39 must establish one persisted anchor convention and convert to visual centers using the rotated footprint/physical bounds.

### 1.5 Grid footprint versus real dimensions
Catalog `Footprint W/D` values are editor metadata and are not trustworthy literal physical feet for production models. Production assets need separate actual dimensions/bounds. Use real 14 × 16 ft room scale.

### 1.6 Weak server spatial authority
Room saves must not rely on client-only placement checks. The server must revalidate item existence, ownership, surface compatibility, room bounds, rotation and overlap/clearance. A server rejection must not silently fall back to an unauthorized local save.

### 1.7 Mobile asset cost
W25 hero furniture is visually richer but heavy. W39 must record triangle/bounds data and maintain a mobile optimization plan. Do not downgrade hero visuals to flat sprites merely to improve frame rate.

## 2. Benchmark room contract
Create a W39 furniture benchmark mode/page that cannot mutate ownership or live saves. It must use the same renderer and same production assets as the real Cabin.

Room: 14 ft × 16 ft × approximately 9 ft high.

Required objects:
- W25-C04 Double Cabin Bed GLB;
- W25-C01 Cognac Lodge Reading Chair GLB;
- W25-C02 Live-Edge Nightstand GLB;
- W25-C03 Linen/Bronze Table Lamp GLB;
- W39 dimensional four-drawer dresser;
- W39 woven rug;
- W39 wall-mounted TV;
- optional W39 desk chair or wall art for density.

Composition:
- bed against a believable wall zone with walking clearance;
- nightstand adjacent to bed;
- table lamp positioned as a table lamp, not arbitrarily floating on the floor;
- reading chair in a lit reading corner;
- dresser with drawer-front depth and hardware;
- rug layered slightly above floor without z-fighting;
- TV mounted on a valid wall plane;
- window daylight and warm lamp/ceiling practical lighting.

## 3. 3D room shell
- True floor slab/plane with material scale appropriate to 14 × 16 ft.
- Three visible walls and open/cutaway camera side.
- True window opening/frame/glass, not a sticker.
- True door opening/slab/frame.
- Baseboards and selected trim.
- Optional simple ceiling beams where they improve cabin identity.
- Background beyond window should not be empty black; use a lightweight exterior/sky/tree suggestion when practical.

## 4. Camera
Default camera should make the room and furniture legible without looking like a map editor.
- Perspective camera.
- Three-quarter dollhouse/room view by default.
- Orbit with drag.
- Wheel/pinch-style zoom support where platform permits.
- Camera target near furniture center of mass.
- Clamp pitch/radius so users cannot lose the room.
- Double-click/reset control.
- Benchmark camera preset for regression screenshots.

## 5. Materials
Use a coherent cabin material library:
- pine/walnut/oak wood: base-color variation, grain, roughness, subtle normal/bump;
- leather: broad roughness and fine surface breakup;
- woven fabric: visible but not noisy weave;
- linen shade: soft roughness, warm translucency impression where practical;
- bronze/brass: controlled metalness and roughness;
- rug: fabric with pattern/border/fringe or equivalent geometry;
- TV glass/screen: dark reflective/emissive material;
- painted surfaces: controlled sheen, not plastic gloss.

No hero object may be uniformly flat-colored if its approved identity calls for a different material language.

## 6. Lighting
Minimum stack:
- hemisphere/environment fill;
- directional daylight motivated by window;
- soft practical ceiling or room light;
- window-area fill if needed;
- W25 lamp real point-light/emissive toggle.

Shadows:
- hero furniture casts and receives shadows;
- preserve readable contact with floor;
- mobile shadow map sizes must be bounded;
- if additional contact-shadow helpers are used, they must not visibly float.

Tone/color:
- sRGB output;
- ACES Filmic or equivalent tone mapping;
- warm cabin palette with daylight contrast;
- no crushed black corners that hide furniture.

## 7. Furniture identity system
Every furniture item resolves through this priority:
1. Device-approved GLB;
2. production/QA GLB;
3. W39 subtype/design-specific 3D procedural fallback;
4. older category-generic 3D bridge;
5. SVG/2D only on WebGL failure.

W39 subtype fallback must differentiate, at minimum:
### Beds
single/twin, double, bunk, storage bed, canopy/four-poster, daybed/trundle.
### Seating
reading/club chair, desk/dining chair, rocking chair, barrel chair, sofa, loveseat, bench, chaise, recliner.
### Tables/desks
nightstand/side table, coffee table, writing desk, farm/dining table, game table, vanity/secretary where obvious.
### Storage
dresser, wardrobe/armoire, bookcase/shelf, chest/toy chest, hutch/display.

This fallback is still not final production art. It exists to prevent the room from visually collapsing while bespoke GLBs are authored.

## 8. Physical scale and bounds
Production model bounds must be measured from the GLB and stored separately from catalog grid footprint.

Measured W25 source bounds should be recorded in the runtime manifest/report. Visual models may be scaled only through an explicit production calibration field, never by arbitrary per-frame guessing.

Persistence remains compatible with existing room coordinates, but the 3D renderer must convert the persisted anchor to a visual center using the rotated footprint/bounds contract.

## 9. Placement validation
Client and server share equivalent rules.

For floor items:
- supported floor surface;
- normalized 0/90/180/270 rotation;
- physical/placement footprint inside room;
- no obvious overlap with other solid furniture;
- optional clearance zone for drawers, doors, sit/sleep targets.

For wall items:
- catalog supports Wall;
- wall anchor stays within valid wall region;
- item does not cross window/door exclusion regions when wall geometry is known;
- floor-only items cannot be saved as wall items.

Placement overlap may use simple oriented/AABB footprints in the first W39 slice. It does not need a full physics engine, but it must stop impossible obvious placements.

## 10. Security/data integrity
- Server remains authoritative for owner-only room edits.
- Server rejects unowned non-grandfathered blueprints.
- Server rejects unsupported surfaces and out-of-bounds placements.
- Server rejects impossible overlap where validation applies.
- A 4xx API rejection must be shown to the user; it must not be converted into a silent local success.
- Offline/local fallback may be used only for true network unavailability and must be clearly marked local/offline if surfaced to the player.

## 11. Interactions
### Chair
Provide a stable seat target. Full avatar sit animation may remain blocked until approved character rigs are production-ready, but the target and API hook must exist.

### Bed
Provide sleep/lie target and a clear access side/clearance zone. Full lie animation may be future work.

### Nightstand/table
Expose tabletop surface bounds for small decor snapping.

### Lamp
Toggle real light and emissive state, and persist lamp state when room save schema supports it.

### Dresser/storage
Expose open/store interaction contract and front clearance direction. Drawer animation can be later, but collision must not assume the dresser has no front clearance.

### TV
Support wall mount and future on/off/content hook. Screen should have material identity distinct from casing.

## 12. Performance budget
Initial benchmark budget is a gate, not a final universal number.
- pixel ratio capped around 2 or lower on constrained devices;
- dynamic shadow casters limited to hero/near objects;
- repeated low-priority geometry shares materials/geometries where practical;
- record triangle counts for production GLBs;
- create LOD/decimated variants before widespread repeated placement of very heavy assets;
- avoid one dynamic point light per decorative lamp when many lights are visible; only nearby/active hero lights should be real-time.

No optimization may silently replace a validated production object with a flat sprite in the normal hero-room view.

## 13. QA matrix
### Technical
- module syntax;
- full game regression suite;
- staging validation;
- model file integrity;
- catalog IDs and production manifest references;
- exact ZIP cold extraction.

### Spatial
Test each benchmark item at:
- room center;
- each wall/corner;
- 0/90/180/270 rotation;
- near door/window;
- adjacent to another furniture item;
- duplicate placement.

### Visual
Actual running WebGL proof must show:
- perspective depth;
- dimensional silhouettes;
- believable scale;
- real shadows;
- differentiated materials;
- no obvious floating/sinking;
- no generic chair/bed/table identity collapse in the benchmark.

### Mobile
Test:
- orbit drag;
- select;
- place/move;
- rotate;
- duplicate;
- store/remove;
- save;
- lamp toggle;
- pinch/zoom behavior or documented mobile zoom alternative;
- no unusable UI overlap;
- stable frame pacing during a several-minute decorate session.

## 14. Evidence rules
Generated concept images are design targets only.
Catalog thumbnails are catalog evidence only.
Automated tests are technical evidence only.
Only a screenshot/video captured from the running WebGL room is visual runtime evidence.
Only a real phone/tablet run can grant Device Approved.

## 15. Non-regression
Keep:
- room ownership;
- blueprint economy;
- unlimited placement for owned blueprints;
- family/guest room behavior;
- guestbook/reactions;
- W36 best-of-build philosophy;
- prior catalog IDs and user approvals.

Never make the room visually emptier as part of an upgrade. If a production model fails to load, retain the best available 3D fallback.

## 16. Expansion sequence after benchmark passes
1. Repair obvious subtype metadata.
2. Beds family.
3. Seating family.
4. Tables/desks family.
5. Storage family.
6. Lighting.
7. Rugs/soft decor.
8. Wall electronics/decor.
9. Specialty/interactive furniture.
10. Remaining Home catalog by priority/approval stage.

## 17. Release truthfulness
W39 is a production candidate until actual device proof passes. Do not advance official CURRENT_RELEASE merely because unit tests pass. Report separately:
- Technical Candidate;
- Visual Runtime Approved;
- Device Approved.

## Final rule
> The cabin is not done when a furniture record can be dragged around. It is done when the room looks and behaves like a believable 3D place, the furniture keeps its identity, the placement rules prevent impossible layouts, and the actual phone build proves it.
