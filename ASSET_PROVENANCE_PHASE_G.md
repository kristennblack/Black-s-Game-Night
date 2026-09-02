# Phase G Asset Provenance

Build: `GAME-NIGHT-STAGING-PHASE-G-PAPA-VSLICE-05`

## Project references used

John's Phase G asset uses visual reference material already included with the Black Family Game Night project:

- `JOHN_16_LOOKS_REFERENCE.jpg`
- `BLACK_FAMILY_DESIGN_REFERENCE.png`
- `public/family-3d-lineup-approved.png`
- the existing Family Game Art Bible / Papa's Shop design specifications

The face reference, plaid treatment and denim treatment embedded in the Phase G John GLB are derived from project-local reference/source material.

## Phase G generated files

The following files are generated locally by `tools/build_vertical_slice_assets.py`:

- `public/models/characters/john-production-skinned.glb`
- `public/models/environments/papa-shop-barn-production.glb`
- `public/models/sets/papa-shop-production-props.glb`

No third-party model binary was copied into these files.

## Authoring method

The execution environment did not contain Blender, Maya, or another full DCC package. The assets were constructed locally using Python mesh processing/export tooling, then written as self-contained glTF 2.0 GLBs.

John contains actual glTF skinning data and embedded animation tracks. Shop/barn and prop assets are dedicated visible GLB render meshes rather than runtime Three.js placeholder construction.

This provenance is intentionally explicit because **technical GLB/skin/animation validity is not the same claim as studio-final hand-authored art quality**.

## External CC0 route researched but not bundled

A compatible external route exists using Quaternius' CC0 Universal Base Characters and Universal Animation Library. Those source binaries were not accessible to this execution container and are **not included** in this package. If the Phase G phone visual still misses the desired character-art bar, a DCC pass using a properly authored/rigged base and the approved John references is the recommended next art-production step.

