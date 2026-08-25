# Phase O - Realistic Actions & Animation Pass

**Build:** `GAME-NIGHT-STAGING-PHASE-O-REALISTIC-ACTIONS-12`  
**Package:** `3.0.1-staging-phase-o-realistic-actions-12`  
**Status:** Staging / real-device motion QA required

## Goal

Make every game feel less like a web page changing state and more like physical pieces being handled on a table, while also smoothing authored 3D character transitions.

## Shared motion layer

Cards and dominoes now carry stable client motion identities. Before a server-driven render, the client captures their previous screen position. After the updated state renders, matching pieces animate from their old location to the new one. This applies broadly across the card/table games without changing game rules or server authority.

Newly visible pieces also deal/settle into place from the most relevant visible deck/table source when no prior on-screen position exists.

## Game-family coverage

- **Screw Your Buddy / Fuck Your Buddy / Smear:** hand-to-trick movement plus completed-trick sweep to the winner.
- **Campfire Chaos / 31 / Crazy Eights / Burn Logs / Deck Sweep / Mitts:** shared card draw/play/settle motion and tactile deck actions.
- **Euchre:** shared card-to-trick movement.
- **President:** hand movement plus center pile state settle.
- **Golf:** deck/held/grid motion plus face-up card flip.
- **Cribbage:** shared card movement, peg-drop animation and pegging-card settle.
- **Marbles & Jokers:** existing board-path marble animation retained; card/deck/button interaction now shares the tactile layer.
- **Trail Trouble:** existing step-by-step pawn travel retained; card and action feedback improved.
- **Prairie Pots:** chip stacks drop/settle visually as pot state changes.
- **Poker:** community cards deal/settle and pot state gains physical feedback.
- **Last Haven:** built routes draw onto the board rather than appearing completely static.
- **Mexican Train:** rack-to-train domino movement, physical boneyard feedback and weighted domino presentation.
- **Skip-Bo:** hand/Stock/Discard-to-Build movement, physical draw pile, clearer card settling.
- **Backgammon:** checker arc between points, captured blot motion to the Bar, pip dice tumble/settle and cube flip.
- **Family Mystery:** visible pip die with roll animation; existing standee path movement retained.

## 3D animation changes

The shared authored `SemanticAnimationMixer` now:

- phase-matches locomotion when switching between walk/run-style clips;
- smooths animation playback speed instead of changing it abruptly;
- uses shorter crossfades for fire/hit and jump/land transitions;
- treats fire, hit, land, hard-land and mantle clips as one-shot semantics where authored clips exist.

This benefits authored characters in Family Prop Hunt, Family Island Life and John's Birthday Seat. It does not claim to replace missing authored animations for characters that are still using procedural fallback rigs.

## Accessibility

The new repeating/action-detail animations respect `prefers-reduced-motion`.

## Automated validation

- `npm run check`: **315 pass / 0 fail**
- `npm run build`: **138 pass / 2 warnings / 0 fail**
- `python tools/audit_production_assets.py`: **PASS**

The two build warnings remain unchanged: core 3D has external Three.js/addon CDN references, and Wrangler is unavailable in the packaging environment, so live Cloudflare deployment is not verified here.

## Real-device gate

Automated tests confirm wiring and regressions, not whether the motion feels perfect on an iPhone. The phone QA checklist should be completed before treating this as production-ready.
