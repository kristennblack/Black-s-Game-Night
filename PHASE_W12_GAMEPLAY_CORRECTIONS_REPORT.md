# Phase W.12 Gameplay Corrections Report

Release: `GAME-NIGHT-STAGING-PHASE-W12-GAMEPLAY-CORRECTIONS-36`

## Implemented
- Black Gammon renamed to **Blackgammon** in current product UI/rules; direct legal checker-move fallback added after dice allocation.
- Prop Hunt traversal speed increased modestly; reported mobile joystick direction corrected; procedural/authored fallback gun and grip moved to the forward side of the rig.
- Mexican Train held tiles can be visually flipped end-for-end, remain rearrangeable, all personal trains + Family Train are visible, and score sheet is outside board.
- Last Haven now displays viewer supply resources and survival cards as a planning hand.
- Deck Sweep now sorts by rank first, emphasizes 10, unlocks each face-down slot after its own face-up card is cleared, and renders all players' table stations.
- Prairie Pots now publishes/display chip totals, latest award and progression messages; special-pot transfer has regression coverage.

## Truthful limitations
- Real-device touch QA is still required for Prop Hunt orientation and dense mobile table layouts.
- Historical reports retain old naming where they describe old releases.

## Validation
- Full syntax + regression gate: **492/492 tests passed**.
- Staging validator: **211 passed, 0 failed, 2 environment warnings**.
- Known warnings: external Three.js CDN dependency; Cloudflare/Wrangler deployment cannot be verified in this local environment.
