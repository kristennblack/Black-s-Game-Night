W51 MASTER PROMPT — Molly + Kelsi complete-avatar looks release

Objective
Add the newly approved Molly and Kelsi avatar collections into the living Black Family Game Night build, the Looks Shop, and the persistent profile/store pipeline.

Non-negotiable requirements
1. Keep Molly and Kelsi exact to their approved current playable avatars for look 01.
2. Add full 30-look complete-avatar collections for both Molly and Kelsi.
3. Do not treat these as loose accessory layers; each look is a complete approved portrait/character outfit.
4. Add both collections to:
   - Looks Shop UI
   - avatar picker / player profile outfit selection
   - persistent profile sync in the worker
   - service-worker pre-cache / asset bundle
   - release package documentation
5. Preserve all previously approved complete collections for John, Holly, Gunner, and Dorothy.

Implementation contract
- Add catalog modules:
  - public/molly-looks-catalog.mjs
  - public/kelsi-looks-catalog.mjs
- Add look assets:
  - public/look-assets/molly-look-01.jpg through molly-look-30.jpg
  - public/look-assets/kelsi-look-01.jpg through kelsi-look-30.jpg
- Extend public/app.js so Molly and Kelsi are handled everywhere complete-look characters are handled now.
- Extend public/looks-shop.html SYSTEMS config with Molly and Kelsi.
- Extend worker.mjs arcade profile schema with:
  - mollyLooks / equippedMollyLook
  - kelsiLooks / equippedKelsiLook
- Update public/sw.js cache version and include the new catalog files and look assets.

Source-of-truth art references used for this release
- Molly approval board: /visual_proofs/molly_30_looks_approval_board.png
- Kelsi approval board: /visual_proofs/kelsi_30_looks_approval_board.png
- Extracted asset manifests:
  - /visual_proofs/molly_30_looks_manifest.json
  - /visual_proofs/kelsi_30_looks_manifest.json

Release outcome
The downloadable package must ship with six fully supported complete-look families in the store:
John, Holly, Gunner, Dorothy, Molly, and Kelsi.
