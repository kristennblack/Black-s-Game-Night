# Authored GLB/GLTF model slots - v2.0

The v2 runtime can replace procedural hero assets with authored GLB/GLTF files without changing gameplay rules.

The current `manifest.json` is intentionally empty. This prevents requests for model files that do not exist yet. Until an entry is added, the detailed procedural all-angle rig is the fallback.

The loader uses a skeleton-aware clone path for skinned models, so multiple players can use the same GLB without sharing one live skeleton pose.

## Folders

- `characters/` - family humanoid GLBs
- `dogs/` - quadruped Gunner/Kelsi/Molly GLBs
- `props/` - prop-zapper, vehicles and hero props
- `furniture/` - high-attention home/store furniture

## Semantic clips

Preferred clip names include:

`idle`, `walk`, `run`, `jump`, `fall`, `land`, `mantle`, `aim`, `fire`, `hit`, `wave`, `sit`, `sleep`, `drink`, `eat`, `fish`, `fish_cast`, `fish_reel`, `chop`, `mine`, `dig`, `water`, `cook`, `work`, `carry`, `inspect`, `dance`, `celebrate`, `sniff`, `pant`, `scratch`, `shake`, `lie_down`.

The mixer uses aliases and graceful fallbacks when a particular clip is absent.

## Manifest example

```json
{
  "version": 1,
  "characters": {
    "john": {"file":"/models/characters/john.glb","scale":1}
  },
  "dogs": {
    "gunner": {"file":"/models/dogs/gunner.glb","scale":1}
  },
  "props": {
    "propZapper": {"file":"/models/props/prop-zapper.glb","scale":1}
  },
  "furniture": {}
}
```

Optional manifest entries may also provide `position:[x,y,z]` and `rotation:[x,y,z]` corrections when an authored source cannot be exported in the preferred orientation.

Read the root `AUTHORED_3D_ASSET_GUIDE.md` before accepting a model into the project.
