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

## Phase W.10 professional design/production locks
- Canonical next-build prompt: `MASTER_GAME_DESIGN_PRODUCTION_PROMPT_W10.md`.
- Historical W.9 cumulative prompt is archived as `MASTER_NEXT_BUILD_DEVELOPMENT_DIRECTIVE_W9_ARCHIVE.md`.
- W.10 source precedence resolves conflicting old generic quality language.
- Prop Hunt remains flagship; one approved John/Papa's Shop full-round phone vertical slice is required before broad propagation.
- Input is action/context based with role-specific hunter/hider maps, sensitivity/invert/comfort settings and mobile presets.
- Touch actions target comfortable platform-sized hit areas and must support move + look + action simultaneously.
- Character approval requires five-view proof and actual gameplay proof before `approvedModel: true`.
- Prop Hunt shot feedback must keep camera ray, muzzle obstruction, tracer, impact and registered hit aligned.
- Papa's Shop uses blockout/routing/camera proof before decorative final-art expansion.
- Mobile performance is measured through frame-time profiling, significance/LOD/culling and WebGL budgets rather than desktop-only fps.
- Local QA telemetry may diagnose camera/stuck/mantle/transform/shot/frame-time failures without third-party tracking.
- Automated tests never substitute for actual phone visual/control approval.

## Phase W.11 Prop Hunt smoothness/stability locks
- Canonical prompt: `MASTER_GAME_DESIGN_PRODUCTION_PROMPT_W11.md`.
- Dedicated stability contract: `MASTER_PHASE_W11_PROP_HUNT_SMOOTHNESS_STABILITY_DIRECTIVE.md`.
- No new Prop Hunt content before John + Papa's Shop real-phone stability gate.
- Fixed 60 Hz gameplay simulation with bounded catch-up and render interpolation.
- Camera obstruction hysteresis; camera failure does not automatically relocate a valid player.
- Last-known-safe recovery for actual invalid player states.
- Collider responsibilities separately support player/camera/vision behavior.
- Disguise and decoy placement must be validated before committing/spending.
- Repeated gameplay effects are capped/pooled where practical; quality tier reduces cost under load.
- QA includes recent p95/peak frame time, draw calls, triangles, quality tier, pixel ratio and recovery count.
- Background/resume and WebGL context loss/restore are phone-stability scenarios.
- Authored character LODs, material atlases, Papa's Shop instancing/baked lighting and full network reconciliation remain future/asset-dependent until actually produced and device-tested.


## Phase W.12 gameplay-correction locks
- Canonical prompt: `MASTER_GAME_DESIGN_PRODUCTION_PROMPT_W12.md`.
- Blackgammon is one word; legal checker moves must remain executable after rolling/allocation with a direct-move fallback.
- Prop Hunt: faster baseline movement, camera-relative mobile controller corrected, hunter hands/weapon forward.
- Mexican Train: end-for-end flip control, all player trains + Family Train visible, score outside board.
- Last Haven: viewer supply/resource + survival-card hand visible for planning.
- Deck Sweep: rank-first sorting; 10 special highlight; each face-down slot unlocks when its own covering face-up card is played; opponent table state visible without hidden-card identities.
- Prairie Pots: pot awards update chip totals and are explicitly reported/displayed; no silent sequence stall.

## Phase W.13 — Cabin Rooms + Collections
- LOCK: persistent main family cabin + dynamically growing permanent guest house.
- LOCK: home destination concept `Visit the Cabin` with true 3D aerial/dollhouse navigation.
- LOCK: owner-only room editing; all-family viewing; simultaneous visitor bubbles/reactions/guest book before avatar walking.
- LOCK: approx. 14 × 16 ft neutral starting room and physical floor-plan growth through bought/won expansions.
- LOCK: free placement with gentle grid/snap, collision prevention and 90° rotation.
- LOCK: customizable wallpaper, flooring, ceiling/trim, lights, windows/doors, ambience and architecture.
- LOCK: Kelsi/Molly/Gunner have no bedrooms; pet items live across rooms and dogs eventually wander among them.
- LOCK: universal currency name `Game Night Tokens` and approved earning/purchase pace.
- LOCK: permanent blueprint ownership, controlled duplicate salvage, gifting rules and non-giftable earned prestige trophies.
- LOCK: rarity tiers Common / Uncommon / Rare / Epic / Family Legendary.
- LOCK: single store with Avatar / Furniture / Walls & Floors / Decorations / Specials tabs.
- LOCK: Collection Book, secret `???` entries, collection completion rewards, seasonal/birthday heirlooms and family-history inspect metadata.
- LOCK: authoritative W.13 launch catalog contains exactly 400 entries in `CABIN_ROOMS_400_ITEM_MASTER_CATALOG_W13.xlsx`.
