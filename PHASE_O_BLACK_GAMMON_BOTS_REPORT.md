# Phase O - Black Gammon + Bot UX Staging Report

**Build:** `GAME-NIGHT-STAGING-PHASE-O-BLACK-GAMMON-BOTS-12`  
**Package:** `3.0.1-staging-phase-o-black-gammon-bots-12`  
**Status:** Staging / device QA required

## Added

- Separate two-player **Black Gammon** Game Shelf module built from the family's confirmed house rules.
- Confirmed 4/4/4/3 starting setup on standard backgammon occupied points.
- Shared four-dice allocation, tied-total large die, doubles/triples/quads, backward matching sets, special single 4, Bar rules, mixed stacks, rescue/death deadlines, temporary overstacking and bearing off.
- Direction-aware board actions: blue forward, red backward and gold rescue destinations.
- Player colour applied to Black Gammon checkers/dice and standard Backgammon dice for a related presentation.
- Human-vs-human and bot-compatible room flow.

## Bot UX repair

- App-wide default bot difficulty changed to **Easy**.
- Medium and Hard remain selectable.
- Add Computer and inline bot editor selects now use a light readable surface, dark option text, visible focus outline and a phone-friendly layout.

## Safety / continuity

- Regular Backgammon remains a separate game and retains its standard rules/cube system.
- Existing Mexican Train, Skip-Bo and Backgammon shelf entries remain visible.
- Existing room, reconnect, chat, reactions, profile, leaderboard and Keep Playing systems are reused.
- Prior 3D John Lab02 integration and 3D playability work are retained.

## Validation requirement

Automated validation is necessary but not sufficient. Black Gammon still needs real-device visual QA and at least several complete human/bot and human/human matches before production signoff.
