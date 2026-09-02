# W49 Gunner 30 Looks Shop + Cleanup Report

Candidate: `GAME-NIGHT-STAGING-CANDIDATE-W49-GUNNER-30-LOOKS-SHOP-CLEANUP-67`

## Implemented
- Added the user-approved 30-look Gunner collection as 30 packaged runtime portraits derived from the approved Gunner board.
- Locked the exact user-confirmed playable Gunner source into `visual_proofs/gunner_30_looks/`.
- Added `public/gunner-looks-catalog.mjs` and `GUNNER_30_LOOKS_MANIFEST.json`.
- Extended the unified Looks Shop from John + Holly to John + Holly + Gunner, 30 looks each.
- Added server-side `gunnerLooks` ownership and `equippedGunnerLook` selection.
- Added three real Gunner win paths: Game Night Buddy, Trail Champion and Adventure Harness.
- Repaired the user-reported broken John/Holly shop images by moving all 90 complete looks to fresh W49 `/look-assets/` URLs, adding image fallbacks, and forcing a new W49 service-worker cache.
- Added a dedicated player-facing `Cabin Room Shop` for purchasable room furniture/decor blueprints.
- Simplified normal player-facing shopping to exactly Looks Shop + Cabin Room Shop.
- Removed normal navigation to Approved Lookbook, Production Lab, John Head Fit Proof, Approval Studio and Family V1 Lab.
- Preserved old lab/catalog files only for engineering history/regression; direct legacy URLs redirect to the clean player shops unless `?legacy=1` is explicitly used.
- Simplified Cabin navigation so it no longer advertises the 4,000-item catalog, 2,000 World Props or production/approval tools.

## Verification before final packaging
- Full Node regression suite: 703 / 703 PASS.
- Syntax/check command: PASS.
- Staging validator: 4,509 PASS / 2 WARN / 0 FAIL.
- W49 focused suite: 6 / 6 PASS (included in the 703 total).

## Existing infrastructure warnings
- Existing Three.js/addon CDN dependencies remain.
- Actual Wrangler/Cloudflare deployment cannot be verified in this environment.

## Device status
This is a technical staging candidate until the exact packaged build is deployed and visually confirmed on the target browser/device.
