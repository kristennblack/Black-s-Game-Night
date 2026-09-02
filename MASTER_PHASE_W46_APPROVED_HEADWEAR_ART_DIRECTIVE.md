# W46 — APPROVED HEADWEAR ART DIRECTIVE

## Status
Highest-precedence production directive for the first approved portrait-headwear art batch until explicitly superseded.

## Approved visual source of truth
The user-approved `Headwear 3D Approval Board 01` controls the intended visual identity for these 12 items:

1. Camp Cap
2. Cowboy Hat
3. Cabin Knit Toque
4. Firefighter Helmet
5. Birthday Crown
6. Family Tiara
7. Legendary Top Hat
8. Trail Trouble Champion Cap
9. Prop Hunt Hunter Hat
10. Mexican Train Conductor Cap
11. Wide-Brim Sun Hat
12. Canvas Bucket Hat

For these items, old flat/generic SVG art is not the preferred portrait asset when a W46 approved-art portrait render is available.

## Portrait implementation contract
These 12 items use dedicated transparent W46 portrait-render assets in the shop/card portrait path.

The portrait asset path is distinct from full 3D gameplay wearables. W46 portrait PNGs must not be described as rigged GLB/gameplay meshes. They are detailed portrait-compatible render assets derived from the approved visual direction.

## Fit contract
W45 semantic head fitting remains authoritative for:
- exact portrait variant lookup;
- head width / temple span;
- crown or hairline seat;
- portrait roll;
- per-avatar correction;
- category-specific width.

W46 adds art-specific natural-aspect shaping required by the approved portrait asset. Do not shrink the W45 visual width merely to make a tall asset fit. W46 may use item-level width/roll refinement when the approved product-render perspective requires it.

Headwear rotation must use the semantic wear-seat as the transform origin. Do not rotate approved hats around the center of the PNG, because that causes brims to swing into the eyes on tilted portraits.

## Natural-aspect shaping
Each approved W46 asset may define:
- `assetAspect`;
- `targetDepthScale`;
- `seatNudge`.

The renderer should preserve the approved visual width while deriving portrait height from crown-to-seat depth. This prevents square-canvas padding or transparent margins from stretching a hat over the face.

## Item identity corrections
`Prop Hunt Hunter Hat` is an olive cap in the approved board. It must use the cap geometry/fitting family, not the generic cowboy/hunter-hat family.

## Non-regression
A later build may not silently return these 12 items to:
- generic SVG art;
- toy-sized W44 sizing;
- one-size-fits-all head boxes;
- stale service-worker assets.

If a W46 asset fails to load, fallback may preserve the prior asset rather than leave the portrait empty, but fallback status must remain diagnosable.

## Cache/version contract
W46 uses its own candidate cache/version (`W46-APPROVED-HEADWEAR-ART-64`) so older W44/W45 portrait art cannot silently reappear due to stale caching.

## QA gate
Automated tests establish code integrity only. Final visual approval still requires:
1. staging load of W46;
2. shop portrait inspection;
3. same-avatar card-game portrait inspection;
4. representative mobile/device proof;
5. user visual approval.

## Proof honesty
A code-driven composite using the exact app portraits + W46 asset files + production fit math is valid implementation evidence, but it is not a deployed phone screenshot. Label it accordingly.
