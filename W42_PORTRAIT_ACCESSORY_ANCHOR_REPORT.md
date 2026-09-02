# W42 Portrait Accessory Anchor Implementation Report

## Implemented
- Added `public/portrait-accessory-anchors.mjs` with semantic portrait landmarks for all 13 family avatars.
- Added variant-aware fitting contract and baked-accessory conflict flags.
- Glasses now derive scale from pupil distance, center from the nose bridge/pupil line, and rotation from the real eye line.
- Added horizontal perspective compression/skew fields for angled portraits.
- Added GLB-derived transparent portrait assets for Reading Glasses, Classic Glasses, Rose Party Glasses and Shop Safety Glasses.
- `cosmeticOverlayHTML()` now emits anchor-fit metadata and perspective transform variables.
- Shop product cards use the W42 production-derived overlay art for those four items.
- Shop preview labels those four as W42 anchored 3D-derived portrait previews.
- Shop warns when a chosen portrait already has baked eyewear and needs a clean base portrait.
- Card-game/player portrait overlays use the same shared anchored renderer through `avatarHTML()`.
- Added `public/w42-portrait-anchor-qa.html` to inspect actual portraits, overlays and landmark points.
- Preserved the separate 3D gameplay wearable path; portrait approval no longer uses the full 3D John rig.

## Honest limitations
- The W42A.3 approved board is a visual target; it is not runtime proof.
- W42A.4 is an exact code-driven composition using actual app portrait files and actual GLB-derived overlay PNGs.
- A few portrait variants contain eyewear baked into their base art (notably James, Dorothy, Nana and selected alternates). Those are flagged and remain blocked from glasses visual approval until clean portraits are available.
- Full per-variant landmark calibration remains a continuing QA task. Missing variant overrides inherit that person's calibrated base profile rather than a global box.

## Verification
- Focused W42 tests: 8/8 PASS.
- Full project tests: 655/655 PASS.
- `npm run check`: PASS.
- staging validator: 4320 pass, 2 infrastructure warnings, 0 fail.
- production 3D asset audit: PASS.
