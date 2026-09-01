# Black Family Game Night - W26 Character Production Handoff

## Purpose

This package is the handoff for replacing the remaining placeholder/legacy character geometry with authored stylized-realism character models that can support the real W25/W26 wearable pipeline.

The immediate production targets are:

- `CHAR_KRISTEN.glb`
- `CHAR_KELSI.glb`
- a visual replacement `CHAR_JOHN.glb` using the existing John rig/animation contract where practical

The current runtime already proves that authored GLB accessories can be loaded and attached to a named humanoid head bone. The included John fit proof uses the actual legacy `john-production-skinned.glb` skeleton and the actual W25 cowboy-hat/aviator GLBs. That proof is **technical only**. It also reveals that John's visible legacy mesh is still blocky/segmented and therefore is not W26 art-approved.

## Current art direction

**Stylized realism.** Preserve the approved family identities and recognizable silhouettes while moving the visible characters away from blocky procedural/mannequin geometry. The target is a warm, polished family-game character style with believable anatomy, hair volume, clothing, materials, hands, footwear and expressive faces.

Do not redesign identity to chase realism. Improve the mesh, materials, rigging and presentation while preserving who the character is.

## Source-of-truth references

### Kristen
1. `references/kristen-approved-turnaround.png` - identity/silhouette lock.
2. `references/family-prop-hunt-lineup.png` - broader stylized-realism family look.
3. `references/w25-production-characters-sheet.png` - W25 production direction and accessory intent.

### Kelsi
1. `references/kelsi-w26-turnaround-reference.png` - multi-angle W26 production reference.
2. `references/family-prop-hunt-lineup.png` - approved family identity context.
3. `references/w25-production-characters-sheet.png` - dog accessory adaptation direction.

### John
1. `references/john-approved-turnaround.png` - identity/silhouette reference.
2. `specs/CHAR_JOHN_W26_REPLACEMENT.json` - retain the useful runtime rig contract, replace the visible legacy geometry.

## Non-negotiable production rules

1. Do not make generic human bodies with swapped heads or shirt colors.
2. Do not use segmented/cylindrical limbs or Roblox-like proportions.
3. Do not make Kelsi from primitive boxes/cylinders or a generic retriever base with only a color change.
4. Hats do not delete the wearer's identity-defining hair. Use a separate hair mesh plus compression/tuck profiles.
5. Glasses use a real bridge/temple attachment system.
6. Earrings use left/right ear sockets.
7. Face filters are face-material/shader/effect layers, not transparent billboards pasted in front of the face.
8. Dog cosmetics receive deliberate dog adaptations. Never stretch a human wearable onto the dog.
9. Shop previews must ultimately be rendered from the same production asset the player receives.
10. A model is not approved merely because it imports or passes automated tests. It still requires actual in-game visual approval.

## File naming

Deliver:

- `CHAR_KRISTEN.glb`
- `CHAR_KELSI.glb`
- `CHAR_JOHN.glb` when the John visual replacement is ready

Optional authoring files can be supplied as `.blend` or equivalent, but the game integration contract is GLB 2.0.

## Coordinate and scale contract

- Y-up
- character faces -Z
- meters
- origin at ground midpoint for human characters
- root/origin placed consistently for quadruped locomotion
- apply object transforms before export
- no negative scales
- no non-finite transforms

Kristen's 1.70 m production height and Kelsi's provisional 0.48 m shoulder target are **game-space targets**, not claims about real-world measurements. Final scale is tuned during the cabin/device fit gate.

## Rig compatibility

Kristen should use the human bone naming defined in `specs/CHAR_KRISTEN_W26.json` so the current Black Family animation semantics can be reused with minimal remapping.

Kelsi requires a proper quadruped rig. Do not adapt the human skeleton to the dog.

## Wearable socket contract

See `specs/W26_WEARABLE_ANCHOR_CONTRACT.json`.

Human authored models must expose:

- `headSocket`
- `hatSocket`
- `glassesBridgeSocket`
- `leftTempleSocket`
- `rightTempleSocket`
- `leftEarSocket`
- `rightEarSocket`
- `faceMaskSocket`

Kelsi must expose:

- `hatSocket`
- `collarSocket`
- `leftEarCharmSocket`
- `rightEarCharmSocket`
- `backAccessorySocket`

## Hair requirement for Kristen

Hair must be a separate authored mesh/system with at least two runtime-compatible profiles:

- natural/base
- cowboy-hat compressed/tucked
- cap/beanie compressed/tucked

The compressed version must remain recognizably Kristen's hairstyle. It must not simply hide the hair.

## First integration gate after model delivery

The first complete in-game proof will use:

- Dark Brown Ranch Cowboy Hat
- Gold/Brown Aviators
- Smooth Gold Hoops
- Soft-Glam Face Filter

on:

- John
- Kristen
- Kelsi, with dog-specific adaptations where applicable

The gate checks:

- silhouette
- model/material quality
- correct socket placement
- no floating/sinking
- hair compatibility
- face identity preservation
- animation deformation
- shop preview fidelity
- cabin/gameplay presentation
- mid-range-phone performance

## Included proof

`proofs/W26_JOHN_WEARABLE_FIT_PROOF.png` demonstrates the head-bone attachment transform using the legacy John rig. It is **not** a visual approval of the old John model.

## Environment limitation

The current integration environment does not include Blender or an equivalent full character-sculpting/rigging application. Therefore this package intentionally does not manufacture fake character models from primitive procedural geometry. It provides the exact authored-asset contract needed for a proper Blender/Maya-equivalent production pass, after which the supplied GLBs can be integrated and tested in the game.
