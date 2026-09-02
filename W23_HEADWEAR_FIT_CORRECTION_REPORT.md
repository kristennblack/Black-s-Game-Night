# BLACK FAMILY GAME NIGHT
## W23.1 Actual-Avatar Headwear Fit Correction Report
Date: 2026-08-31
Runtime: GAME-NIGHT-STAGING-PHASE-W23-HEADWEAR-FIT-CORRECTION-46

### Scope
- 20 headwear items from the W23 headwear review batch.
- 13 actual app family avatars: John, Kristen, Holly, Vanessa, Elizabeth/Lizzy, Logan, James, Dorothy, Papa, Nana, Kelsi, Molly and Gunner.
- 260 item/avatar combinations rerendered after correction.

### Corrections implemented
1. Normalized the 20 test headwear assets to tight SVG bounds so transparent generator padding no longer makes items look artificially tiny or floating.
2. Removed low-opacity generator speckle marks from the normalized fit-test/runtime copies.
3. Recalibrated per-avatar head x/y/width anchors.
4. Added/retained per-avatar head rotation for angled portraits, including John and Nana, plus dog-specific orientation for Kelsi and Molly.
5. Kept distinct dog head geometry for Kelsi, Molly and Gunner.
6. Changed John's normal app avatar/cosmetic base from the baked-in birthday-hat portrait to the already-approved clean `john-home-approved.jpg`, so wearable headwear can actually be layered correctly.
7. Bumped the runtime/cache marker so corrected cosmetic assets cannot be hidden behind the older service-worker cache.

### Corrected visual result
The conventional top-of-head anchor now lands on the actual head/hairline across the family portraits rather than floating above them or cutting through the eyes.

### Geometry fit classification
**GREEN: conventional top-of-head geometry**
- Camp Cap
- Cowboy Hat
- Cabin Knit Toque
- Firefighter Helmet
- Birthday Crown
- Family Tiara
- Legendary Top Hat
- Trail Trouble Champion Cap
- Prop Hunt Hunter Hat
- Mexican Train Conductor Cap
- Wide-Brim Sun Hat
- Canvas Bucket Hat
- Tiny Party Crown
- Weathered Gold Beret
- Embroidered Sky Flower Crown
- Braided Plum Bandana Headwrap
- Embroidered Sky Newsboy Cap

**AMBER: semantic anchor still required before final fit approval**
- Faux-Fur Earmuffs: must use ear/headset anchoring, not ordinary top-of-head hat anchoring.
- Ballet Ribbon Bun Accessory: must use bun/hair-accessory anchoring.
- Embroidered Teal Headband: must use forehead/headband anchoring.

### Approval meaning
The 17 GREEN items have a corrected **actual-avatar geometry-fit proof** using normalized test/runtime assets. This does not yet equal final Stage 2 art approval because W23 requires the final production-quality asset itself to be rerendered on the actual avatars.

The 3 AMBER items remain Fit Pending until their semantic anchor rules and final assets are tested.

### Automated validation
- `npm test`: 564 / 564 pass.
- `npm run check`: pass.
- `npm run build` / staging validator: 4,244 pass, 2 warnings, 0 fail.
- Remaining validator warnings: external Three.js CDN dependency in existing 3D surfaces; Wrangler deployment unavailable in this environment. These are not new headwear-fit failures.
