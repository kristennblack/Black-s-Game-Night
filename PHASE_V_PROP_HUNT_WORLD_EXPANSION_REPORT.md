# Black Family Game Night
## Phase V - Prop Hunt Papa's Shop World Expansion
### Implementation Report

## Release
`GAME-NIGHT-STAGING-PHASE-V-PROP-HUNT-WORLD-24`

## Starting point
Phase V was built from the Phase U.3 working project while treating the Project Constitution, cumulative Master Development Directive and Phase V Prop Hunt directive as governing continuity sources.

No unrelated game was intentionally rebuilt. The Phase T/T.1 Prop Hunt movement, camera recovery, protected hunter hiding screen, crosshair-first shooting and hold-to-rapid-fire controls remain in place.

## Papa's Shop footprint
The previous Papa benchmark footprint was recorded as approximately 258.4 square world units.

The Phase V Papa bounds are approximately 51.6 x 41.6 world units, or 2,146.56 square world units. That is approximately 8.31x the prior playable-area benchmark.

The expansion is actual walkable/searchable territory, not just distant scenery.

Primary zones now include:
- enlarged warehouse-style Papa's Shop with multiple bays and wide work lanes;
- fully searchable barn with multiple openings, stalls, playable loft and two ladder approaches;
- two large animal-pen areas with low/jump-friendly fencing and multiple gaps;
- equipment yard with tractor, old motorcycle, trailer and large-prop circulation;
- dedicated lumber/material storage;
- wide exterior grass/gravel/dirt circulation with rural horizon treatment;
- visible red survey boundary plus boundary posts around the playable edge.

## Prop density and interactivity
The expanded Papa build includes 236 procedurally distributed clutter-prop placements across shop, barn, yard and pen zones, plus dozens of explicit hand-placed props, large disguise exemplars, furniture, vehicles, climbable structures and environment pieces.

The world exposes eight explicit activation-style interactions in this pass:
- tractor horn;
- shop lights;
- barn bell;
- safe shortcut gate;
- odd old radio;
- peacock surprise;
- mystery shop switch;
- legendary Papa-chair Easter egg.

The broader gameplay-meaningful count also includes disguise-relevant props, climbable surfaces, doors/routes and world collision structures, exceeding the directive's approximate 150-object gameplay target.

The shortcut gate opens and does not re-close behind a player.

## Disguise system
Papa's Shop now has a curated 30-type disguise pool.

At the start of each round:
- each hider receives exactly four choices;
- assignments are deterministic from the multiplayer round seed;
- two hiders may receive overlapping choices;
- choices rotate on later rounds;
- no reroll action exists;
- other players do not receive another hider's four-choice list through public room state.

The player's four choices are shown through a mobile-friendly disguise tray instead of requiring proximity to a world prop.

Existing health carryover, three post-initial disguise changes, 10 decoys and flash refresh remain preserved.

## Risk/reward survival scoring
Time alive in a disguise now accrues hider survival points using current size/risk multipliers:
- Small: 1.00x
- Medium: 1.35x
- Large: 1.80x
- Giant: 2.50x

Examples include Coffee Mug as Small, Hay Bale/Papa Chair as Large and Tractor/Tree/Barrel Stack as Giant.

This does not change hider health. It rewards brave hiding choices and feeds Best Hider/MVP selection.

## Weather and round variety
Each round has a deterministic random preset chosen from:
- clear;
- sunset;
- overcast;
- light rain;
- light snow;
- fair fog;
- windy.

The time/mood remains fixed during the round. Fog is constrained to a fair visibility range.

The same round seed also selects a layout variant and drives secondary clutter placement so large landmarks remain learnable while smaller details shift.

## Ambient life
Papa's Shop includes lightweight rural ambience with goats, pigs, a peacock, birds, trees, grass movement and weather particles where appropriate.

Ambient NPC movement remains small and non-blocking.

## Elimination and spectator experience
When a hider is eliminated:
- the current prop produces a break/shard effect;
- the comedic `That's a sin.` cue is requested through browser speech synthesis, with a simple fallback sound and rate limiting;
- in Classic mode the player becomes a non-interactive ghost;
- the ghost can free-fly inside the map bounds;
- JUMP raises the free camera and SPRINT lowers it;
- the player can switch to follow/cycle living players;
- Family Chaos still converts the eliminated hider into a hunter.

Browser/system speech voices vary by device, so the exact timbre of the elimination cue is not considered visually/audio approved until phone testing.

## Round end and lifetime stats
Default hunt time is now 300 seconds / 5 minutes.

Round end uses an approximately 10-second skippable MVP card showing:
- winner;
- Best Hider and survival points;
- Best Hunter and eliminations;
- weather context;
- local lifetime round/hider-point/elimination totals.

Multiplayer room state also retains lifetime fields for the room session.

## Player capacity
The Prop Hunt room cap is now 12 players and the solo setup selector is capped at 12.

## Preserved controls
Phase T/T.1 remains intact:
- 30-second protected hiding screen for hunters;
- blacked-out hunter view during hide;
- no separate Aim button;
- permanent crosshair;
- tap Shoot for one shot;
- hold Shoot for controlled rapid fire at approximately 4.8 shots/second;
- movement/strafe/jump while firing;
- existing Reset View and camera-recovery systems.

## Files materially changed
- `public/prop-hunt-3d.js`
- `public/prop-hunt-3d.css`
- `public/prop-hunt-core.mjs`
- `public/shared-3d-art-kit.mjs`
- `propHuntRoom.mjs`
- `public/sw.js`
- `public/app.js`
- `package.json`
- `MASTER_NEXT_BUILD_DEVELOPMENT_DIRECTIVE.md`
- `BLACK_FAMILY_GAME_NIGHT_PROJECT_CONSTITUTION.md`
- new Phase V directive/report/QA/test/release files

## Approval status
Phase V is code/test/package validation work until the exact ZIP is played on a phone.

Do not call the expanded Papa map visually approved yet. The key real-device questions are map scale, routing feel, prop density, camera behavior in the loft/pens/yard, frame rate, disguise readability and whether five-minute rounds feel appropriately paced.
