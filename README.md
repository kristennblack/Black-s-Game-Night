# CURRENT DESIGN RELEASE - PHASE W.10 PROFESSIONAL MASTER PROMPT 34

**Current design release:** `GAME-NIGHT-STAGING-PHASE-W10-PRO-DESIGN-MASTER-34`  
**Package version:** `3.12.0-staging-phase-w10-professional-master-prompt-34`

Phase W.10 packages the latest known-good W.8 runtime with a professionally refactored next-build design bible. Runtime gameplay code is intentionally unchanged in this phase. The new canonical prompt is `MASTER_GAME_DESIGN_PRODUCTION_PROMPT_W10.md`, mirrored into `MASTER_NEXT_BUILD_DEVELOPMENT_DIRECTIVE.md` for compatibility.

W.10 replaces the append-only planning structure with explicit precedence, player-experience pillars, vertical-slice gates, action-based controls, accessibility/comfort settings, Prop Hunt round/level/camera/movement/weapon/hider specifications, WebGL performance budgets, local QA telemetry, professional playtest methods and measurable Definitions of Done.

The next runtime milestone is one approved John in one excellent Papa's Shop full round on an actual phone before the system is propagated across the family cast.

Research basis: `W10_PROFESSIONAL_GAME_DESIGN_RESEARCH_NOTES.md`.

---

# CURRENT CUMULATIVE RELEASE — PHASE W.8 ARCADE TUTORIAL + AVATAR TOKEN STORE 33

**Current release:** `GAME-NIGHT-STAGING-PHASE-W8-ARCADE-TUTORIAL-STORE-33`  
**Package version:** `3.11.0-staging-phase-w8-arcade-tutorial-store-33`

Phase W.8 preserves W.7 and adds a consistent visual onboarding layer to every active Arcade Corner game plus an earned-only avatar cosmetics store. All 16 arcade games now provide detailed step-by-step HOW TO tutorials. Each profile can choose SHOW TUTORIAL or SKIP FOR ME on first use, while HOW TO always remains available later.

Arcade Tokens unlock removable hats, glasses and accessories. The launch economy awards +5 tokens the first time a profile plays each arcade game and +10 tokens for the daily three-different-games challenge. There is no real-money checkout. Cosmetics are profile-persistent and may never alter the approved character identity underneath.

Future 3D cosmetics use removable `HeadTop`, `Face` and `ChestAccessory` sockets rather than editing the approved base character mesh.

Governing W.8 directive: `MASTER_PHASE_W8_ARCADE_TUTORIAL_COSMETICS_DIRECTIVE.md`.

# CURRENT CUMULATIVE RELEASE - PHASE W.7 PROP HUNT CHARACTER + COMBAT 32

**Current release:** `GAME-NIGHT-STAGING-PHASE-W7-PROP-HUNT-CHARACTER-COMBAT-32`  
**Package version:** `3.10.0-staging-phase-w7-prop-hunt-character-combat-32`

Phase W.7 preserves every W.6 gameplay/UX repair and the W.5 approved-character lock, then makes John the first production Prop Hunt character/combat gate. The runtime now blocks an unapproved legacy John GLB from overriding the approved identity, corrects the visible two-hand Prop Zapper grip, uses a close right-shoulder hunter camera, centres the crosshair on the actual camera ray, and adds visible beam/muzzle/impact feedback while preserving physical muzzle obstruction and hider privacy.

**Visual approval remains device-gated:** John must look correct, hold the weapon correctly and show readable shooting feedback on an actual phone before this system is propagated to the rest of the family.

**31 Blind family rules are now recorded in the master directive:** three unseen face-down cards; flip-and-keep, blind-replace from discard, or pass; a flipped card remains face up. No extra scoring/end conditions are guessed.

Governing W.7 directive: `MASTER_PHASE_W7_PROP_HUNT_CHARACTER_COMBAT_DIRECTIVE.md`.

# CURRENT CUMULATIVE RELEASE — PHASE W.6 MULTIGAME UX 31

**Current release:** `GAME-NIGHT-STAGING-PHASE-W6-MULTIGAME-UX-31`  
**Package version:** `3.9.6-staging-phase-w6-multigame-ux-31`

Phase W.6 preserves the W.5 approved family-character identity lock and adds the current gameplay/UX pass: Vanessa destination-based truck-wash wins and grey GMC, Logan optional visual tutorial/easier progression, shared visual How To paths, board-first Mexican Train with full rearrangeable rack, corrected Golf discard/final-turn presentation, Mitt capture mats, improved Nana animal/point presentation, and Kelsi's Rock 'n' Roll Rescue replacing Neon Star Patrol.

**31 Blind mode is intentionally pending the user's exact family rule and has not been guessed.**

# Black Family Game Night

**Build:** `GAME-NIGHT-STAGING-PHASE-T1-PROP-HUNT-HUNTER-RELEASE-COMBAT-19` + Phase U Cabin Breakout content patch  
**Package base:** `3.5.1-staging-phase-t1-prop-hunt-hunter-release-combat-19`  
**Status:** Staging / technical validation candidate. Real-device visual and gameplay approval is still required.

## Phase U focus

Phase U adds **Cabin Breakout** as the first dedicated instant-play game in a new **Arcade Corner** on the lodge home screen while preserving Phase T.1 Prop Hunt and every previous tabletop/room fix.

### Cabin Breakout

- One self-contained `public/breakout.html` file
- Inline CSS + vanilla JavaScript only
- HTML5 Canvas rendering
- 6 rows x 10 columns of bricks, colored by row
- 3 lives
- Mouse, arrow-key, and phone touch/pointer paddle control
- Aimable paddle reflection based on impact position
- Live score, lives, and remaining brick count
- MULTI-ball drop power-up
- Win and game-over states with tap/click/Space restart
- Swept expanded-AABB collision detection to reduce high-speed tunneling
- Responsive portrait-first presentation using the Black Family cabin/ember visual language

## Lodge integration

The main game list now includes an **Arcade Corner**. Cabin Breakout opens directly as `/breakout.html` and is intentionally not routed through the multiplayer room engine.

## Preserved work

Phase U preserves:
- Phase T.1 Prop Hunt hiding privacy, countdown, crosshair-first shooting, and hold-to-rapid-fire controls
- Phase T Prop Hunt gameplay/animation work
- Phase S tabletop/gameplay repairs
- Black Gammon house rules
- Existing multiplayer rooms, bots, reconnect, avatars/colors, chat/reactions, history, rematch, and game shelves

## Governing directives

- `MASTER_PHASE_U_CABIN_BREAKOUT_DIRECTIVE.md`
- `MASTER_PHASE_T1_PROP_HUNT_HUNTER_RELEASE_COMBAT_DIRECTIVE.md`
- `MASTER_PHASE_T_PROP_HUNT_P3_GAMEPLAY_ANIMATION_DIRECTIVE.md`
- `MASTER_PHASE_S_GAMEPLAY_TABLETOP_REALISM_DIRECTIVE.md`

## Validate locally

```bash
npm run check
npm run build
npm run assets:audit
```

Use `PHONE_QA_PHASE_U_CABIN_BREAKOUT_20.md` for the real-device pass.

### W.10 identity note

This archive contains the unchanged W.8 gameplay runtime plus the W.10 professional design master. Runtime identifiers intentionally remain W.8/T1-compatible; the documentation release is identified separately in `DESIGN_RELEASE.txt`.
