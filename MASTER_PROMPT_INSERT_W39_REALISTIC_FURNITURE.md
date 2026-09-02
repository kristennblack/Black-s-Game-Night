# MASTER PROMPT INSERT — W39 REALISTIC CABIN FURNITURE

This directive has highest precedence for cabin rooms, furniture rendering, furniture QA, room placement and Home-item production until superseded by a later explicit user-approved directive.

## Non-negotiable objective
The Cabin must stop reading as a flat decorator. The normal player-facing room must be a true 3D, mobile-safe, stylized-realistic cabin room with believable depth, furniture scale, materials, lighting, shadows, collision and interaction. The existing 2D/SVG room may remain only as an emergency WebGL fallback and catalog/concept-art source.

## Production rule
Do not call an item implemented because its ID, SVG, thumbnail or generic category mesh exists. Browse art, production model and placed in-room object must represent the same recognizable design. A sofa may not become a generic chair; a canopy bed may not become a generic bed; a wardrobe may not become a dresser; a desk may not become a generic table.

## W39 benchmark slice
Before mass-producing furniture, make one 14 × 16 ft bedroom excellent. It must use the real 3D cabin renderer and contain, at minimum:
- W25 Double Cabin Bed production GLB;
- W25 Kristen's Cozy Lodge Reading Chair production GLB;
- W25 Live-Edge Nightstand production GLB;
- W25 Warm Table Lamp production GLB;
- a dimensional dresser/storage piece;
- a dimensional rug;
- a dimensional wall-mounted TV or wall object;
- believable window/door architecture and cabin shell.

The room must show clear floor/wall depth, contact shadows, soft daylight, warm practical lighting, material variation, readable furniture silhouettes, and a close-enough camera that furniture quality can actually be judged.

## Rendering architecture
Separate:
1. persistent room data and gameplay state;
2. physical placement/collision proxies;
3. visible production models;
4. concept/legacy fallback art.

Visual priority for each furniture item:
1. Device-Approved production model;
2. Production/QA model;
3. W39 design-specific 3D fallback;
4. legacy generic 3D fallback;
5. SVG/2D fallback only when WebGL cannot run.

A failed new asset load must never make the room emptier. Preserve the previous visible fallback until the replacement is successfully loaded.

## Placement contract
Use one coordinate contract consistently. Persistent `x/z` values are room-placement anchors, not arbitrary model centers. Renderer and server must agree on footprint, rotation and surface. Floor items must remain inside room bounds after rotation. Wall items must be supported by their catalog surface metadata. Prevent obvious item-to-item overlap and wall penetration. Server validation is authoritative; client validation is convenience only.

Do not use the catalog's small grid-footprint numbers as literal real-world model dimensions. Maintain separate physical model dimensions/bounds for production assets. The 14 × 16 ft room is real scale.

## Furniture realism bar
- Stylized realism, not photorealism and not blocky placeholder art.
- Rounded/beveled-looking construction where furniture would naturally have softened edges.
- Wood must show grain/roughness variation; upholstery must read as fabric/leather; metal must read as metal; glass must read as glass; rugs must read as woven textiles.
- Furniture must have believable thickness, legs, backs, cushions, drawer fronts, hardware and construction details.
- No paper-thin furniture cards in the normal WebGL path.
- Shadows must ground furniture to the floor/wall.
- Room lighting must include cool/neutral window daylight and warm practical light without washing out material detail.

## Identity preservation
Runtime shape selection must use the actual intended furniture family inferred from approved identity/name when legacy W20 subcategory metadata is clearly wrong. Repair the catalog metadata where the intended type is unambiguous. Preserve IDs, ownership, price, collection and unlock rules.

## Interaction minimums
- seating: authored seat target and future sit-animation hook;
- beds: sleep/lie target and clearance region;
- tables/nightstands: valid tabletop surface target;
- storage: open/store interaction hook and door/drawer clearance;
- lighting: on/off state with emissive/real light behavior;
- wall electronics/decor: valid wall mounting and no floor-style placement unless explicitly supported.

## Mobile/performance
Do not solve performance by deleting visible furniture or returning to flat sprites. Use pixel-ratio limits, shadow budgets, model LOD/decimation where available, shared materials, instancing for repeated low-priority objects, culling and limited dynamic lights. The hero room must remain visually complete.

## QA gates
A furniture/cabin build does not advance unless all four gates pass:
1. **Technical:** assets load, IDs resolve, saves/migration work, no regressions.
2. **Spatial:** scale, rotation, floor/wall placement, collision and clearance are valid.
3. **Visual:** actual running WebGL screenshot is visibly dimensional and better than the flat W13/W19 baseline.
4. **Device:** real phone/tablet interaction and performance pass.

Automated tests are not visual approval. Concept renders are not runtime proof. AI-generated target images are not runtime proof. Only an actual running build screenshot/video can satisfy the visual/device gates.

## Non-regression rule
Every later furniture build must preserve the best previously proven room. A newer build may not remove furniture density, distinctive silhouettes, working placement, lighting, shadows or interactions unless the replacement is visibly and functionally better.

## Expansion rule
After the benchmark room passes, expand by furniture family, not random individual patches:
1. beds;
2. seating;
3. tables/desks;
4. storage;
5. lighting;
6. rugs/soft decor;
7. wall electronics/decor;
8. specialty/interactive furniture.

Do not claim the 2,000 Home catalog is production-complete until its visible runtime assets actually reach the required production and device gates.
