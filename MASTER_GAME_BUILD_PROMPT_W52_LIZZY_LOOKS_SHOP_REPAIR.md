# MASTER GAME BUILD PROMPT · W52 Lizzy / Elizabeth Looks Shop Repair

Release ID: GAME-NIGHT-STAGING-CANDIDATE-W52-LIZZY-30-LOOKS-SHOP-REPAIR-70

## Locked identity rule
- Spell her name only as **Lizzy** or **Elizabeth**. Never use “Lizzie.”
- Character storage key remains `elizabeth` for compatibility with the existing playable avatar.
- The exact identity source is `visual_proofs/lizzy_30_looks/LIZZY_APPROVED_GAME_AVATAR_SOURCE.png`.
- The approved 30-look board is `visual_proofs/lizzy_30_looks/LIZZY_30_APPROVED_LOOKS.png`.
- Do not reinterpret Lizzy’s face, age, skin tone, eyes, facial structure, proportions, or identity. Outfit/accessory variation only.

## W52 Lizzy collection
- Catalog: `public/elizabeth-looks-catalog.mjs`
- Runtime images: `public/look-assets/elizabeth-look-01.jpg` through `elizabeth-look-30.jpg`
- Image fallbacks: `public/avatars/styles/elizabeth-look-01.jpg` through `elizabeth-look-30.jpg`
- Local ownership key: `bfgn_elizabeth_looks_v1`
- Server fields: `elizabethLooks` and `equippedElizabethLook`
- Display label: `Lizzy / Elizabeth`
- Starter: `elizabeth-look-01`
- All 30 are token-purchasable.
- Winable milestones in Lizzy's Dramatic Lights:
  - look 08 at round 5
  - look 27 at round 10
  - look 30 at round 15 / Drama Queen

## Looks Shop repair requirements
- Treat John, Holly, Gunner, Dorothy, Molly, Kelsi, and Elizabeth as complete-look characters everywhere in the app renderer, picker, thumbnails, and store.
- Every runtime look has a mirrored fallback under `/avatars/styles/`.
- Use W52 cache-busted image URLs.
- Service worker runtime cache must use the W52 identity, not the older W50 identity.
- Service-worker installation must not fail wholesale because one optional cached asset is missing. Precache a compact `CORE_SHELL` with `Promise.allSettled` and network-cache other assets at runtime.
- Keep Looks Shop and Cabin Room Shop as the public shopping destinations.

## Packaging
- The upload ZIP must be **root-flat**: `worker.mjs`, `wrangler.jsonc`, `package.json`, and `public/` are at the ZIP root, not wrapped in an extra release folder.
