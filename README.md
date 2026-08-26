# Black Family Game Night

**Build:** `GAME-NIGHT-STAGING-PHASE-P1-FLAGSHIP-UPGRADE-14`  
**Package:** `3.1.0-staging-phase-p1-flagship-upgrade-14`  
**Status:** Staging / real-device flagship QA candidate

## Phase P1: Prop Hunt flagship upgrade

Phase P1 follows `MASTER_3D_DEVELOPMENT_DIRECTIVE.md`: **Family Prop Hunt is the first 3D quality benchmark**, and the shared systems are improved there before being propagated to Island Life, Birthday Seat or future 3D games.

### John PH-CHAR-01

The current John production candidate has been rebuilt as the first flagship character benchmark:

- one skinned humanoid rig
- 19 authored clips covering idle, locomotion, start/stop/turn, jump/fall/land, mantle, crouch, aim, fire, hit reaction and social states
- tighter John facial reference treatment and additional facial/hair/beard silhouette detail
- added hand/clothing detail and corrected boot placement found during offline QA
- explicit PH-CHAR-01 / Phase P1 / stylized-realism metadata

Technical asset audit: 46,270 triangles, 3 embedded images, calibrated height about 1.828 m.

### Animation, movement and aiming

Studio 3D is upgraded to v2.1 with masked animation layering, allowing lower-body walking/running/sprinting to continue while the upper body aims or fires. Prop Hunt retains the repaired third-person camera, movement, collision, jump/mantle and shot obstruction systems.

Touch/gamepad aiming now includes mild assistance only for targets already very close to the crosshair. It does not rotate the camera, and shots are still revalidated from the weapon muzzle so solid geometry can block them.

### Papa's Shop

The working Papa's Shop gameplay/collider layout is preserved. The authored shop/barn and production prop set remain the visual foundation while Phase P1 adds static-scene optimization and lighting/readability adjustments. Important production assets remain present, including tractor, motorcycle, workbench, tool chest, shelving, fireplace and Papa's yellow chair.

### Approved cabin home screen

The approved cabin composition remains in place using the existing cabin and John home assets. The Game Shelf now uses custom vector medallions and more dimensional cabin-style plaques rather than flat/emoji-like controls.

### Preserved game systems

- Black Gammon and standard Backgammon remain separate games.
- Black Gammon rules/setup remain packaged.
- Easy remains the default bot difficulty, with Medium/Hard selectable.
- Bot selector readability fixes remain in place.
- Existing room/lobby, reconnect, avatars/outfits/player colours, chat/reactions, leaderboards/rematch and retained games remain in the build.

## Validate locally

```bash
npm run check
npm run build
python tools/audit_production_assets.py
python tools/audit_phase_g_vertical_slice.py
```

Recorded Phase P1 technical results:

- `npm test`: 339 / 339 PASS
- `npm run check`: PASS + 339 / 339 tests PASS
- staging validator: 144 PASS, 2 WARN, 0 FAIL
- production 3D asset audit: PASS
- John/Papa vertical-slice technical audit: PASS

## Important visual status

Passing automated tests is **not** visual approval. The offline John bind-pose geometry preview was inspected and a boot-placement defect was corrected, but the actual Three.js running-game appearance must still pass the real-device PH-CHAR-01 and Papa's Shop visual gates before those components are locked as final.

See:

- `PHASE_P1_FLAGSHIP_UPGRADE_REPORT.md`
- `PHONE_QA_PHASE_P1_FLAGSHIP_UPGRADE_14.md`
- `PROP_HUNT_FLAGSHIP_AUDIT_AND_PLAN.md`
- `LOCKED_COMPONENTS_REGISTER.md`

## Known staging limitations

- Actual Cloudflare deployment remains unverified in the packaging environment because Wrangler execution is unavailable.
- Core Three.js/addon loading still includes external CDN URLs.
- Full-family authored character propagation intentionally waits for approval of the John flagship benchmark.
- Real-device visual/game-feel QA is still required before production signoff.

## Deploy to staging

```bash
npm run deploy:staging
```

Confirm the visible build ID is:

`GAME-NIGHT-STAGING-PHASE-P1-FLAGSHIP-UPGRADE-14`
