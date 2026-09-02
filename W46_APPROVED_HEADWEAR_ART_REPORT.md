# W46 Approved Headwear Art Report

## Goal
Move the 12 user-approved Headwear 3D Approval Board 01 designs into the actual shop/card portrait cosmetic path without losing the W45 semantic anchor and visual-scale recovery work.

## Implemented
- Added a W46 approved-art override table for all 12 approved headwear IDs.
- Added transparent, natural-aspect portrait render assets under `public/cosmetics/generated/w46-approved-headwear/`.
- Preserved W45 semantic head width, head seat, portrait roll, and per-person fitting.
- Added W46 item-level portrait shaping (`assetAspect`, `targetDepthScale`, `seatNudge`, `widthScale`, `rollScale`) so detailed portrait assets do not get vertically stretched or over-rotated by transparent canvas/product-render geometry.
- Added pivot-aware transform origin so headwear rotates around its semantic seat rather than swinging around the middle of the PNG.
- Tightened/cleaned approved portrait render crops to remove leftover board/background slivers before runtime use.
- Corrected `Prop Hunt Hunter Hat` from the generic cowboy classification to the cap family to match the approved olive-cap design.
- Added a W46 QA page using the actual portrait renderer and all 12 IDs.
- Added a W46 candidate service-worker cache/version so W44/W45 art is not silently reused from stale cache.
- Preserved the official CURRENT_RELEASE at W30. W46 is a staging visual candidate pending device approval.

## What these assets are
The W46 headwear files are detailed transparent **portrait render assets** intended for the shop/card avatar system. They are not full rigged 3D gameplay GLBs. This distinction is deliberate and truthful.

## Implementation proof
`visual_proofs/W46_APPROVED_HEADWEAR_CODE_DRIVEN_PROOF.png` uses:
- exact app portrait JPGs;
- actual W46 portrait asset files from the candidate;
- real `portraitHeadwearFit()` output from the W46 module.

It is a code-driven implementation proof, not an AI concept board and not a deployed-device screenshot.

## Automated QA
- Focused W43-W46 compatibility/feature tests: 34 / 34 PASS.
- Full project tests: 689 / 689 PASS.
- Staging validator: 4,354 PASS / 2 WARN / 0 FAIL.
- Production 3D asset audit: PASS.

Known staging warnings remain unchanged:
1. core Three.js/CDN dependencies still exist on true-3D surfaces;
2. actual Cloudflare/Wrangler deployment cannot be verified in this environment.

## Remaining visual gate
Deploy W46 to staging and verify, at minimum:
- Camp Cap on John;
- Cowboy Hat on John;
- Cabin Knit Toque on Kristen;
- Firefighter Helmet on Holly;
- Birthday Crown / Family Tiara on Kristen or Elizabeth;
- Prop Hunt Hunter Hat uses cap silhouette;
- same selected hat looks consistent in shop and card-game portrait.

Do not mark live-approved until the actual staging/device result visibly matches the approved direction.
