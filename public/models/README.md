# Production 3D model manifest

`manifest.json` is the runtime opt-in list for authored visuals. Missing IDs intentionally fall back to the detailed procedural art kit.

Current production benchmark assets:
- `characters/john.glb`
- `dogs/gunner.glb`
- `props/prop-zapper.glb`
- `props/tractor.glb`
- `furniture/papa-chair.glb`

Rebuild with `npm run assets:build`; validate with `npm run assets:audit`.

The visible render mesh is never the authoritative gameplay collider. This allows higher-quality GLBs to replace visuals without changing multiplayer collision or hit rules.
