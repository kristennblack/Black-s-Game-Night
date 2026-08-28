# Phase W.17 — Cabin + Portrait-Calibrated Cosmetics Polish Report

Release: `GAME-NIGHT-STAGING-PHASE-W17-CABIN-COSMETICS-POLISH-39`

## Implemented runtime
- Direct **Visit the Cabin** action on the home hero.
- Second **Visit the Cabin** destination in home navigation.
- Real `/cabin.html` runtime with cabin overview, room ownership, save, guestbook and reactions.
- W.13 400-item room catalog remains connected to the live Cabin Shop / Game Night Token economy.
- 154 asset-backed wearable records remain available; emoji-based cosmetic rendering is not used.
- Shared tabletop/card portrait renderer now applies cosmetics using semantic portrait anchors rather than one generic position.
- Approved-family fitting profiles define head, eyes, ears, neck, chest, badge and hair anchors.
- Hats, eyewear, headsets, scarves, jewelry, tops and badges use class-specific fitting logic.
- Earrings, headphones, scarves, jewelry and tops can control width and height independently to avoid bad aspect-ratio fitting.
- Portrait-variant conflicts suppress built-in glasses/hats/accessories where stacking would look wrong.
- Avatar frame clipping and explicit z-order reduce floating/sticker artifacts.
- Tiny score portraits hide body-level cosmetic clutter while retaining recognizable head/face items.
- True 3D modes remain governed by socket-mounted 3D wearable requirements; portrait compositing is not misrepresented as a full 3D wearable mesh system.

## QA
- `npm run check`: 520 / 520 tests passed.
- `npm run staging:validate`: 219 pass, 0 fail, 2 known environment warnings.
- Known warnings: external Three.js CDN dependency; live Wrangler/Cloudflare deployment cannot be verified in this environment.

## Visual truthfulness
The live catalog is connected to 400 room records and the wearable catalog is asset-backed. This release does not claim 400 unique final production 3D furniture meshes. Those remain an authored-asset production task and should only be declared complete after device-visible proof.
