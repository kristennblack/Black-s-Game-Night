# W47 John 30 Looks Shop Report

Candidate: `GAME-NIGHT-STAGING-CANDIDATE-W47-JOHN-30-LOOKS-SHOP-65`

## Implemented
- Rebuilt John around 30 complete approved looks from the three J1/J2/J3 boards.
- Packaged 30 runtime portrait assets at `public/avatars/styles/john-look-01.jpg` through `john-look-30.jpg`.
- Added a dedicated user-facing `John Looks Shop` with token prices, permanent unlock state, preview, purchase and equip actions.
- Added server-side `/api/arcade/look` validation and persistence.
- Added migration that preserves the player's currently selected John look on first W47 shop use.
- Updated the Lodge and avatar picker to route locked John looks to Looks Shop.
- Stopped the normal John portrait renderer from stacking the legacy loose cosmetic overlays on complete John looks.
- Kept cabin furniture and the legacy production/concept catalog available separately.
- Updated John portrait clamps across compatible cabin/platform surfaces to support 30 variants.
- Added W47 service-worker cache entries for the shop, catalog and 30 portrait files.

## Approved visual source
The three user-approved John collection boards are preserved in `visual_proofs/john_30_looks/` and the runtime image contact proof is `JOHN_30_RUNTIME_LOOKS_PROOF.jpg`.

## Automated verification
The full regression suite passed before packaging: 692 / 692 tests.

## Device status
Technical candidate only until the exact deployed build is viewed on the target phone/browser. This package does not claim device visual approval.
