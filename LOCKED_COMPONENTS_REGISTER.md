# Black Family Game Night - Locked Components Register

**Build:** `GAME-NIGHT-STAGING-PHASE-P0-FLAGSHIP-FOUNDATION-13`

This register implements the preservation rule in the Master 3D Development Directive. A locked component may only be changed when a specific requested improvement requires it, and the replacement must preserve the solved behavior.

## Locked now
- Prop Hunt shared third-person camera recovery, obstruction solving, shoulder swap, zoom, Reset View and first-frame snap behavior.
- Shared movement/collision recovery, acceleration/braking, jump support, ceiling/support checks and mantling behavior.
- Prop Hunt multiplayer room, reconnect/state synchronization and established Prop Hunt rules.
- Wall/prop/player-first shooting validation from camera aim through muzzle revalidation.
- Papa's Shop gameplay layout/collider contract, including attached barn and existing playable footprints.
- Production asset loading seam and John authored runtime contract: same production URL, 1.82 m reference height, rig/sockets and semantic animation names.
- Approved cabin composition assets: `home-cabin-approved.png`, `home-cabin-background.jpg`, `john-home-approved.jpg`.
- Existing Black Gammon rules and all established tabletop/card-game rules.

## Not visually locked yet
- John Character Lab 02 likeness/mesh quality. It remains the current candidate, not the final approved John.
- Papa's Shop visible GLB art/material quality. Layout/collision is locked; visible art may be replaced against the same contract.
- Gunner final likeness/animation quality.

## Release rule
Automated tests may establish technical health. They do not constitute visual approval. A visual component becomes locked only after explicit user acceptance of real gameplay proof.

## Phase W.5 — Approved ultra-simplified family character identity
- Locked master: `MASTER_APPROVED_FAMILY_CHARACTER_DIRECTIVE.md`
- Runtime registry: `public/approved-family-characters.mjs`
- Approved turnarounds: John, Kristen, Holly, Vanessa, Elizabeth/Lizzie, Logan, James, Dorothy.
- Rule: **approved turnaround controls identity; simplify geometry, not identity.**
- Papa, Nana, Kelsi, Molly and Gunner remain pending individual turnaround approval.


## Phase W.6 gameplay/UX locks
- Vanessa: destination-connected grey GMC wash-truck win, pink GMC letters only, automatic next level.
- Logan: optional per-profile visual tutorial, 5x5 beginner levels, early locked starter bike, recognizable dirt-bike renderer.
- Mexican Train: full visible/rearrangeable rack and board-first surface.
- Golf: discard stock draw without forced flip/replacement; final-turn structure preserved.
- Mitts: capture mats retain cards and points.
- Nana: persistent scoring/avoid guide and dimensional animal drawing.
- Kelsi's Rock 'n' Roll Rescue replaces Neon Star Patrol; legacy Kelsi URL redirects.
- 31 Blind definition is now known and recorded: 3 unseen face-down cards; flip-and-keep, blind replace from discard, or pass. Do not invent extra scoring/end rules.

## Phase W.7 Prop Hunt character/combat locks
- Approved turnaround identity overrides legacy character models unless `approvedModel: true`.
- John is the first Prop Hunt character/combat vertical-slice gate.
- Hunter hand orientation: right trigger grip, left support grip, no backwards palms.
- Prop Zapper must remain visible in the normal phone camera.
- Hunter camera uses aim shoulder mode during the hunt.
- Visible crosshair is exactly centered on the camera shot ray.
- Shots use muzzle-origin obstruction validation plus visible tracer and impact feedback.
- Disguised hider hit feedback must not reveal identity before elimination.


## Phase W.8 arcade onboarding + cosmetic locks
- All 16 active arcade games have detailed visual HOW TO tutorials; minimum four game-specific steps.
- First-time tutorial Show/Skip choice persists per profile/game; HOW TO remains reopenable.
- Arcade Tokens are earned-only; no real-money token purchase.
- +5 first-play reward per arcade game and +10 daily 3-different-games reward.
- Tokens Store supports Hat, Glasses and Accessory unlock/equip slots.
- Cosmetics are removable overlays/attachments and may not modify approved family identity.
- Future 3D cosmetic sockets are HeadTop, Face and ChestAccessory.
