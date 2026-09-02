# Phase P1 Flagship Upgrade Report

**Build:** `GAME-NIGHT-STAGING-PHASE-P1-FLAGSHIP-UPGRADE-14`  
**Package:** `3.1.0-staging-phase-p1-flagship-upgrade-14`  
**Status:** Staging / visual acceptance candidate

## Purpose

Phase P1 applies the Master 3D Development Directive by concentrating the next major 3D pass on **Family Prop Hunt**, while preserving the working game rules, multiplayer room behavior, repaired camera/collision foundation, Black Gammon, standard Backgammon, and the rest of the Game Shelf.

This release deliberately improves the shared systems that can later be reused by Island Life and Birthday Seat rather than performing another independent rewrite of those games.

## Implemented upgrades

### John PH-CHAR-01 benchmark asset

- Rebuilt `public/models/characters/john-production-skinned.glb` as the Phase P1 flagship John candidate.
- Preserved one reusable humanoid skin/rig convention and the existing equipment sockets.
- Expanded the authored motion set to 19 clips:
  - Idle
  - Walk
  - Run
  - Sprint
  - Start_Move
  - Stop_Move
  - Turn_Left
  - Turn_Right
  - Jump
  - Fall
  - Land
  - Mantle
  - Crouch
  - Aim
  - Fire
  - Hit_Reaction
  - Wave
  - Celebrate
  - Sit
- Tightened and feathered the John facial reference treatment.
- Added additional facial/hair/beard silhouette geometry, small hand detail, shirt placket/pocket detail, and corrected boot placement discovered during offline geometry QA.
- Marked the asset explicitly as the `PH-CHAR-01` Phase P1 stylized-realism benchmark candidate instead of the prior experimental Character Lab candidate.

Technical asset audit result:

- 1 skin
- 19 clips
- 46,270 triangles
- 3 embedded images
- calibrated height approximately 1.828 m

### Layered locomotion + aiming/firing

`public/shared-3d-studio.mjs` is upgraded to Studio 3D v2.1 and now supports masked animation layers.

- Lower-body locomotion can keep walking/running/sprinting while the upper body aims or fires.
- Start/stop and sprint semantic states are now represented explicitly.
- Aim/fire no longer has to replace the complete locomotion animation.
- Mixer state is exposed for QA/debugging.

### Prop Hunt controls, aiming and shooting

- Preserved the existing repaired third-person camera, obstruction recovery, collision, movement, jump and mantle foundation.
- Added restrained touch/gamepad aim assistance for targets already very close to the crosshair.
- Aim assistance does **not** rotate the camera or play the game for the user.
- Final shot validation still runs from the weapon muzzle so walls/props continue to block hits correctly.
- Crosshair provides a subtle assisted-target state.
- Touch action controls are larger and clearer, with Shoot given the strongest visual priority.
- Narrow-phone layout protects more of the actual gameplay viewport.

### Papa's Shop benchmark support

- Preserved the existing Papa's Shop collider/gameplay layout instead of replacing it with an untested rewrite.
- Retained the authored Papa shop/barn and production prop set, including the tractor, motorcycle, Papa chair, fireplace, workbench, tool chest, shelving and shop clutter.
- Added static authored-scene optimization to reduce unnecessary small-object shadow work and freeze stable static transforms without changing gameplay geometry.
- Adjusted the baseline lighting for better interior/exterior readability and dimensionality.

Current technical asset totals:

- Papa shop + barn: 927 nodes, 16,524 triangles, 79 materials
- Papa production prop set: 172 nodes, 16,716 triangles, 22 materials

### Approved cabin + home Game Shelf polish

The approved cozy cabin composition remains the home-screen foundation.

- Preserved `home-cabin-background.jpg` and `john-home-approved.jpg` rather than inventing a different room.
- Reworked Game Shelf controls as dimensional cabin-style plaques with wood/metal depth treatment.
- Replaced emoji-style shelf icons with custom inline vector medallions that share one visual language.
- Sharpened title/label presentation and reduced flat webpage-card styling.
- Added restrained selection/press depth and warm framed treatment around John.
- Added reduced-motion handling.

### Preserved app/game contracts

- Standard Backgammon and Black Gammon remain separate games.
- Black Gammon rules and custom board remain preserved.
- Easy remains the default bot difficulty app-wide, with Medium/Hard selectable.
- Bot selector readability repair remains preserved.
- Existing multiplayer, reconnect, chat/reactions, avatars/outfits, player colours, leaderboards/rematch and other table/card games remain in the package.
- Major Island Life and Birthday Seat visual rewrites remain intentionally deferred until the Prop Hunt flagship benchmark is approved, per the governing directive.

## Verification completed in the packaging environment

- `npm test`: **339 / 339 PASS**
- `npm run check`: syntax/module checks PASS and **339 / 339 tests PASS**
- staging validator: **144 PASS, 2 WARN, 0 FAIL**
- production 3D asset audit: **PASS**
- Papa/John vertical-slice technical asset audit: **PASS**
- John offline bind-pose geometry/material preview inspected after rebuild; a detached-boot error was found and corrected before packaging.

## Declared warnings / open visual gates

1. The Master 3D Development Directive correctly states that automated tests are not visual proof. Phase P1 has **not** been declared visually approved on a real phone yet.
2. The offline John bind-pose preview is a structural geometry/material check, not a substitute for the actual Three.js gameplay camera.
3. John still requires real-device PH-CHAR-01 proof from front/side/rear gameplay views, locomotion, aim/fire while moving, jump/land/mantle and Papa's Shop scale/lighting positions.
4. Papa's Shop must be inspected in the deployed running game before its visual benchmark is locked.
5. The wider family cast is intentionally not mass-produced from an unapproved John benchmark. Once John is approved, the shared rig/material/animation pipeline can be propagated consistently.
6. Actual Cloudflare deployment is unverified in this packaging environment because Wrangler execution is unavailable here.
7. Core Three.js/addon loading still includes external CDN dependencies.

## Release decision

This package is a **staging flagship upgrade**, not a production-final visual signoff. It is safe to use as the next visual/device QA candidate because the technical regression suite and asset audits pass while the remaining visual approval gates are clearly documented.
