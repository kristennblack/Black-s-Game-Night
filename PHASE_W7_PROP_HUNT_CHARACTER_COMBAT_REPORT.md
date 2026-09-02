# Phase W.7 Prop Hunt Character + Combat Vertical Slice Report

**Release:** `GAME-NIGHT-STAGING-PHASE-W7-PROP-HUNT-CHARACTER-COMBAT-32`

## Goal

Phase W.7 is a focused Prop Hunt character-combat vertical slice. John is the first production gate. The goal is to make the approved family character identity, weapon pose, camera, aiming and shot feedback read clearly on a phone before the same system is propagated to the rest of the family.

## Implemented

- Approved-turnaround precedence is enforced at runtime. John's legacy authored GLB is **not** allowed to replace the approved-style fallback while its manifest has `approvedModel: false`.
- John keeps the approved simplified cartoon identity cues in the procedural fallback, including brown side-swept hair, beard and plaid treatment.
- The shared Prop Hunt rig now has explicit **right trigger-hand** and **left support-hand** weapon sockets.
- While aiming, the old procedural hand-end meshes are hidden and weapon-mounted grip hands are shown, removing the backwards-palm presentation.
- The Prop Zapper is larger and more readable, with a stronger emissive energy coil and a stable two-hand pose.
- Hunter play now uses a close right-shoulder aim camera with an aim-specific distance/FOV and visible weapon framing.
- The crosshair is locked to the actual camera-ray centre at 50%/50%, including the phone layout.
- Shots remain hitscan for responsive gameplay but render a visible 3D beam/tracer, muzzle flash/light and impact burst.
- Muzzle obstruction validation remains authoritative: a wall or object blocking the physical muzzle can stop the shot before the camera target.
- Disguised hiders receive a small hit shake and hit feedback without revealing identity before elimination.
- Existing mobile movement/camera/jump/shoot controls remain preserved, with the hunter weapon automatically in the ready/aim presentation during the hunt phase.
- Character-specific personality remains cosmetic. Core movement, aiming and combat timing are shared for fairness.

## John release gate

John should not be declared visually complete from automated tests alone. Actual-device QA must confirm:

1. John is recognizably the approved John.
2. Both visible hands face/grip correctly.
3. Right hand is on the trigger grip and left hand supports the fore-end.
4. Prop Zapper is clearly visible while moving and aiming.
5. Crosshair matches the actual shot direction.
6. Shot beam/tracer is visible.
7. Impact location is obvious on props and environment.
8. Arms do not break during movement, jumping or aim pitch.
9. The camera is close enough to appreciate the character without hiding the environment or weapon.
10. Phone controls do not cover the weapon/crosshair.

Only after this gate passes should the same character-combat rig be propagated across the approved family cast.

## 31 Blind rule recorded

The master directive also records the clarified family Blind rule for 31:

- Blind starts with exactly three face-down cards and the player may not look at them.
- On a turn, the player may flip one of their own face-down cards and keep it; it remains face up.
- Or the player may take the top discard and replace one of their face-down cards without looking at the replaced card.
- Or the player may pass until the next turn.
- No additional Blind scoring/end-condition assumptions are to be invented.

## Validation

- Complete project test suite: **465 / 465 passed**.
- Staging validator: **208 pass, 0 fail, 2 environment warnings**.
- The warnings are unchanged: existing Three.js CDN dependency and live Cloudflare deployment unavailable from this local environment.
- Final release ZIP must also pass the same test and staging-validation counts after a clean extraction.

## Visual status

This is a technical and interaction candidate, not final visual approval. The phone/device frame remains the authority for John before family-wide rollout.
