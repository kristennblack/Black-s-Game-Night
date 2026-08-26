# Black Family Game Night

**Build:** `GAME-NIGHT-STAGING-PHASE-T-PROP-HUNT-P3-GAMEPLAY-ANIMATION-18`  
**Package:** `3.5.0-staging-phase-t-prop-hunt-p3-gameplay-animation-18`  
**Status:** Staging / technical validation candidate. Real-device animation and visual approval is still required.

## Phase T focus

Phase T follows `MASTER_PHASE_T_PROP_HUNT_P3_GAMEPLAY_ANIMATION_DIRECTIVE.md` and concentrates on **Prop Hunt P3 gameplay + animation feel** in Papa's Shop while preserving all Phase S gameplay/tabletop repairs.

### Implemented Prop Hunt P3 runtime changes

- Normal movement now turns the actor toward actual travel direction instead of forcing camera-facing movement when not aiming.
- Aim mode keeps the actor facing the camera/crosshair while resolving forward, backpedal, strafe-left and strafe-right locomotion semantics.
- Authored John keeps layered lower-body locomotion with upper-body Aim/Fire; reverse walk playback is available as a backpedal fallback.
- Start/stop/turn handling is retained and directional semantics are now explicit for future dedicated strafe/backpedal clips.
- Jump/fall/land behavior now includes a stronger hard-landing response based on impact.
- Mantle motion has a staged lift/push-over curve for better readability.
- Authored John uses the existing foot-grounding/IK support during gameplay where safe.
- Disguise change has a short transform burst/scale-in rather than an instant silent pop.
- Moving props receive restrained tilt/bob and grounding behavior.
- Decoys are placed deliberately in front of the hider with support-height/collision fallback and a placement marker.
- Flash receives world-space burst/light plus the existing affected-screen response.
- Hider HUD buttons show remaining Prop changes, Flash readiness, Decoy count and Lock state; HP uses a compact dot indicator.
- Damage produces a brief vignette/pulse.
- Classic-mode elimination gets a living-player spectator camera plus a `NEXT` target button; Family Chaos conversion behavior remains separate.

## Preserved Phase S work

Phase T does not replace the Phase S repairs. Regression tests keep the Skip-Bo Stock/Discard source flow, Cribbage board/scoring, Trail Trouble start, Last Haven setup progression, Backgammon/Black Gammon roll flow and custom Black Gammon rules, Marbles board-first route, trick-bidding context, Easy-first bots, multiplayer and reconnect intact.

## Governing directives

- `MASTER_PHASE_T_PROP_HUNT_P3_GAMEPLAY_ANIMATION_DIRECTIVE.md`
- `MASTER_PHASE_S_GAMEPLAY_TABLETOP_REALISM_DIRECTIVE.md`
- `MASTER_3D_DEVELOPMENT_DIRECTIVE.md`
- `MASTER_MOBILE_TABLETOP_UX_DIRECTIVE.md`
- `BLACK_GAMMON_MASTER_RULES.md`

## Validate locally

```bash
npm run check
npm run build
npm run assets:audit
```

Phase T logs are written as:

- `PHASE_T_TEST_OUTPUT.tap`
- `PHASE_T_CHECK_OUTPUT.txt`
- `PHASE_T_BUILD_VALIDATION.txt`
- `PHASE_T_ASSET_AUDIT.txt`

The final ZIP is cold-extracted and the same validation is rerun against that extracted copy. See `PHASE_T_PACKAGE_VERIFICATION.txt`.

## Visual/device status

Phase T improves the runtime controller and interaction feedback around the existing John P2 authored asset. It does **not** claim to contain a brand-new John sculpt/model.

This environment can verify code, rule transitions, build markers, assets and packaging. It cannot substitute for the requested phone gameplay visual gate. Until real-device screenshots/video are reviewed, this release remains staging.

Use `PHONE_QA_PHASE_T_PROP_HUNT_P3_GAMEPLAY_ANIMATION_18.md` for the device pass.

## Deploy to staging

```bash
npm run deploy:staging
```

Expected visible build ID:

`GAME-NIGHT-STAGING-PHASE-T-PROP-HUNT-P3-GAMEPLAY-ANIMATION-18`
