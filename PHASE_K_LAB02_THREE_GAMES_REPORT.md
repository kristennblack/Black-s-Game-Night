# Phase K Lab02 + Three Games Staging Report

**Local release date:** 2026-08-24  
**Build:** `GAME-NIGHT-STAGING-PHASE-K-LAB02-THREE-GAMES-08`  
**Package:** `3.0.1-staging-phase-k-lab02-three-games-08`  
**Status:** Staging candidate. Code/asset verification is required below; real-device visual approval is still required.

## Release contents

This release starts from the code-verified Phase I three-game package and keeps all three newly integrated game modules:

1. **Mexican Train Dominoes**
   - 2-8 players/bots
   - Double-12 set, private racks, private/shared trains and boneyard
   - family-avatar open-train markers
   - forced-double handling and three-round scoring

2. **Skip-Bo**
   - 2-6 players/bots
   - 162-card original Black Family Game Night deck
   - private hand/future Stock information
   - public Stock top/count and four Discard Piles
   - four Building Piles, Wild values, refill/recycle and Stock-clear win

3. **Backgammon**
   - standard 24-point / 15-checker game
   - complete legal turn-sequence enforcement
   - both-dice/larger-die rules, doubles, hits, Bar/re-entry and bearing off
   - normal/gammon/backgammon results
   - doubling cube, redoubles and optional Automatic Doubles / Beavers / Jacoby settings

## 3D character change

`john-character-lab-02.glb` has replaced the prior packaged production John file at:

`public/models/characters/john-production-skinned.glb`

The new model preserves the current shared runtime contract:

- glTF/GLB 2.0
- 1 skinned humanoid rig
- 14 authored clips
- embedded materials/textures
- same animation names used by the shared studio/controller layer:
  `Idle`, `Walk`, `Run`, `Turn_Left`, `Turn_Right`, `Jump`, `Fall`, `Land`, `Aim`, `Fire`, `Hit_Reaction`, `Wave`, `Celebrate`, `Sit`

The existing shared third-person controller, camera, collision, loader and animation-state systems remain in place.

## Cache / staging isolation

The visible build ID, app version, script query versions and service-worker cache name were bumped for this package. This is important because the production John URL remains the same while the GLB bytes changed. A phone loading this staging build should therefore request the new model rather than silently reuse the previous cached GLB.

## Verification status

Record the current automated results in `PHASE_K_TEST_RESULTS.txt` after running:

- `npm run check`
- `npm run build`
- `python tools/audit_production_assets.py`
- ZIP integrity test

## Still unverified / not claimed

- The new John model is a **staging visual candidate**, not a final likeness approval.
- Gunner and Papa's Shop production-art quality are not fixed by this character swap.
- Real-phone rendering, gesture comfort and complete live matches remain required.
- Actual Cloudflare deployment remains unverified unless Wrangler/deployment is run successfully outside this packaging environment.
