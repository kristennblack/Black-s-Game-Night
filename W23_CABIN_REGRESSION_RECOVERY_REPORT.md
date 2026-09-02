# W23 Cabin Regression Recovery Report

Release: `GAME-NIGHT-STAGING-PHASE-W23-CABIN-REGRESSION-RECOVERY-48`
Date: 2026-08-31

## Reported symptom
After the W23 headwear fit correction builds, the cabin area could become blank/not visible and cabin presentation could fail.

## Investigation
A binary/file comparison of Build 46 and Build 47 showed that the core cabin HTML, CSS, room catalog, room renderer, and cabin artwork were not overwritten by the headwear fit work. The changed shared files were primarily release/cache markers and avatar cosmetics.

The cabin entrypoint did contain a fragile dependency chain:

`cabin.js` -> static import of `cabin-3d-room.mjs` -> static import of Three.js from an external CDN.

Because the import was eager, failure to load the external Three.js module prevented the entire `cabin.js` module graph from evaluating. In that state the `#cabinApp` element remained empty, which is consistent with a completely invisible cabin instead of the intended WebGL fallback.

A new service-worker release also rotates/deletes the previous application cache, making a fresh dependency load more likely. The external Three.js dependency is still a known staging warning.

## Repairs in Build 48
1. Removed the eager `cabin-3d-room.mjs` import from the cabin entrypoint.
2. The cabin overview now renders independently of the optional 3D room module.
3. Individual rooms immediately render a visible static cabin-shell fallback while the 3D module loads.
4. If the 3D dependency fails, the static room remains visible and the user's room data/placements are not reset.
5. The cabin aerial scene is explicitly included in the service-worker release shell/cache.
6. The overview aerial image falls back to the approved cabin background if the aerial asset itself cannot load.
7. No destructive cabin migration was added. Existing room placements, blueprints, wallpaper, flooring, guestbook and reactions remain under the same schemas/keys.
8. Added dedicated regression tests covering cabin entrypoint independence, visible fallback, cache coverage, and route integrity.

## Verification
- Full automated test suite: **571 / 571 PASS**
- Staging validation: **4,244 PASS, 2 WARN, 0 FAIL**
- Warning 1: external Three.js/CDN dependencies still exist in 3D features. Cabin now degrades visibly instead of blanking when its 3D module cannot load.
- Warning 2: Cloudflare/Wrangler deployment remains unverified in this environment.

## Preserved W23 headwear work
The 20/20 actual-avatar headwear geometry-fit corrections from Build 47 remain present. This recovery changes the cabin load/fallback path and release cache behavior; it does not roll back the headwear anchor work.
