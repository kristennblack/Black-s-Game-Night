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
