# W29 Family V1 Candidates - Build 53

## Purpose
Build the first family-wide V1 human character candidates using the accepted Build 52 John approach as a temporary baseline, while explicitly deferring difficult profile, hair, and final likeness polish.

## Safe baseline
- John remains the Build 52 / W27 baseline and was not overwritten.
- Existing production model manifest remains unchanged so prior save/runtime contracts are preserved.
- W29 candidates live in a separate staged manifest and Family V1 Lab.

## New V1 candidates
- Kristen Black - `CHAR_KRISTEN.glb`
- Holly - `CHAR_HOLLY.glb`
- Vanessa - `CHAR_VANESSA.glb`
- Elizabeth / Lizzy - `CHAR_LIZZIE.glb`
- Logan - `CHAR_LOGAN.glb`
- James - `CHAR_JAMES.glb`
- Dorothy - `CHAR_DOROTHY.glb`

Each candidate includes:
- actual GLB model
- humanoid skin
- named `head` and `headSocket`
- 19 shared animation clips
- turnaround-derived face reference
- candidate status metadata
- separate W29 staged manifest entry

## In-game review surface
`/w29-family-v1-lab.html`

The lab lets the reviewer:
- switch between John and the seven W29 candidates
- rotate and zoom the actual GLB
- play Idle, Walk, Wave, and Celebrate
- compare candidates without globally replacing live avatars

## Visual status
These are intentionally V1 candidates, not final character art.

Known deferred polish:
- difficult profile and rear 3/4 head transitions
- layered hair silhouette and strand/group definition
- some face/skull blending
- final likeness refinement
- character-specific clothing refinement
- final wearable fitting and device approval

The user explicitly approved moving forward at this intermediate quality level and polishing looks later.

## Not included yet
- Papa and Nana: no individual approved turnaround is currently locked in the approved-character registry.
- Kelsi, Molly, Gunner: remain a separate quadruped production pipeline and should not be forced onto the humanoid rig.

## Compatibility strategy
- The production `public/models/manifest.json` remains at the Build 52 contract.
- W29 candidates are isolated in `public/w29-family-v1-manifest.json`.
- The normal shop retains its W25 production-slice identity while adding a Family V1 Lab route.
- Existing catalog IDs, ownership, cabin recovery, and John W27 baseline remain preserved.

## Validation before packaging
- `npm test`: 596 / 596 pass, 0 fail
- `npm run check`: pass
- `npm run staging:validate`: 4,294 pass, 2 known warnings, 0 fail

Known staging warnings:
1. Existing Three.js CDN dependency remains in the 3D runtime modules.
2. Wrangler executable is unavailable, so an actual Cloudflare deploy is not verified in this environment.

## Approval state
- Technical integration: PASS
- Regression safety: PASS
- Staging validation: PASS
- Visual candidate review: PENDING USER DEVICE REVIEW
- Final art approval: NOT CLAIMED
- Global live-avatar replacement: NOT YET ENABLED

## Recommended next step
Review the seven candidates in Family V1 Lab. Pick the two weakest candidates first for the next targeted polish pass, then continue through the batch before promoting any candidate to the permanent live avatar set.
