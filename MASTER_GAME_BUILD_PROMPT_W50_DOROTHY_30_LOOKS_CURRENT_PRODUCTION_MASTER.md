# MASTER GAME BUILD PROMPT · W50 Dorothy 30 Looks Shop Release

Release ID: GAME-NIGHT-STAGING-CANDIDATE-W50-DOROTHY-30-LOOKS-SHOP-68
Current active storefront focus: Looks Shop + Cabin Room Shop only.

## Locked store / avatar rules
- Keep the simplified shopping structure. The primary public-facing shop pages are Looks Shop and Cabin Room Shop.
- Retire or redirect older approval/lab pages from normal navigation. Legacy pages may remain in-package for recordkeeping but should not be presented as active storefront destinations unless `?legacy=1` is used.
- John, Holly, Gunner, and Dorothy use complete approved portrait looks in the Looks Shop. Do not layer generic clothing accessories over these complete portrait looks.
- Complete portrait looks are permanent unlocks. Once a player owns a look, it must remain available in avatar selection and the Looks Shop.
- The starter look for each complete collection is free and always owned.

## This W50 release adds Dorothy
Add Dorothy as a full complete-look character in the same production workflow already used for John, Holly, and Gunner.

### Dorothy collection requirements
- Source identity: `visual_proofs/dorothy_30_looks/DOROTHY_APPROVED_GAME_AVATAR_SOURCE.png`
- Approved look board: `visual_proofs/dorothy_30_looks/DOROTHY_30_APPROVED_LOOKS.png`
- Runtime proof: `visual_proofs/dorothy_30_looks/DOROTHY_30_RUNTIME_LOOKS_PROOF.jpg`
- Runtime assets: 30 portrait files in `public/look-assets/dorothy-look-01.jpg` through `public/look-assets/dorothy-look-30.jpg`
- Legacy compatibility copies: matching files in `public/avatars/styles/`
- Catalog file: `public/dorothy-looks-catalog.mjs`
- Manifest file: `DOROTHY_30_LOOKS_MANIFEST.json`

### Dorothy store behavior
- Add Dorothy as a selectable character tab in `looks-shop.html`.
- Add Dorothy’s collection to avatar selection and complete-look preview handling in `public/app.js`.
- Add Dorothy look ownership + equip support to `/api/arcade/profile` and `/api/arcade/look` handling in `worker.mjs`.
- Use local storage key `bfgn_dorothy_looks_v1` and profile fields `dorothyLooks` / `equippedDorothyLook`.
- Default Dorothy starter look: `dorothy-look-01`.

### Dorothy purchasable / winable requirements
Dorothy’s 30 looks should be purchasable with Family Tokens in the Looks Shop.
Selected Dorothy looks should also be winable from `dorothys-garden-merge.html`:
- `dorothy-look-05` unlocks at first Blooming Walk milestone / `dorothy-garden-first-bloom`
- `dorothy-look-10` unlocks when the player creates a 512 tile / `dorothy-green-thumb`
- `dorothy-look-29` unlocks when the player creates Dorothy’s Family Garden / `dorothy-family-garden`

## Existing collections preserved
- Keep John’s 30 looks working.
- Keep Holly’s 30 looks working.
- Keep Gunner’s 30 looks working.
- Preserve prior fixes for broken John and Holly shop images.

## Service worker / cache requirement
- Bump the live runtime cache to a new W50 cache identifier.
- Include Dorothy’s catalog file and Dorothy look assets in the pre-cache shell.

## Deliverables expected from this build
1. Updated app package source folder.
2. Updated master prompt text file and markdown master prompt.
3. Ready-to-upload zip archive for the full W50 package.
4. Dorothy manifests and visual proofs included in-package.

## Success condition
The uploaded W50 package should show Dorothy in the Looks Shop with 30 approved complete looks, allow Dorothy looks to be purchased or won, keep John / Holly / Gunner collections intact, and keep the store experience simplified to Looks Shop + Cabin Room Shop.
