# W45 - PORTRAIT HEADWEAR VISUAL SCALE RECOVERY DIRECTIVE

## Status
Highest-precedence directive for portrait headwear scale, seat, and fit until explicitly superseded.

## Goal
Portrait headwear must look naturally worn, not miniaturized to stay inside conservative collision-style bounds.

This applies to shop portraits, card-game portraits, profile portraits, and any other portrait surface using the shared cosmetic renderer. It does not replace the separate full-3D gameplay wearable system.

## Core rule
Fit headwear from exact portrait landmarks and visual wearing proportions.

Do not solve clipping or uncertain hair volume by shrinking the accessory until it becomes toy-sized.

Correction order:
1. correct semantic anchor;
2. correct seat height;
3. correct roll;
4. allow hair-volume clearance;
5. adjust category scale;
6. only then reduce size slightly if absolutely necessary.

## Required portrait landmarks
Use the exact portrait variant currently displayed and its:
- head top;
- left/right head edges;
- left/right temples;
- pupil/eye line;
- nose bridge;
- derived hairline;
- derived crown center;
- portrait roll.

Per-person correction profiles may adjust scale and seat modestly after the semantic geometry is solved.

## W45 category fit families
- Caps/newsboy/trucker/conductor: fuller crown, brim above eyebrows, visual width near full head width.
- Cowboy/western: crown seated on skull, brim visibly wider than skull.
- Helmets: outer shell visibly larger than skull with eye/ear clearance.
- Toques/beanies: wrap crown and retain top volume.
- Crowns/flower crowns: readable ornamental width, seated near hairline rather than shrunk into the forehead.
- Tiaras: forward ornamental seat, readable width, no miniaturization.
- Top hats: narrow brim plus tall crown, centered over skull.
- Bucket hats: full crown and readable surrounding brim.
- Wide-brim/sun hats: clearly exceed skull width.
- Berets: slightly wider than crown with controlled asymmetric volume.
- Bandana/headwrap: follow hairline/crown, not generic center-box placement.
- Headbands: use forehead/hairline seat.
- Earmuffs: use ear-to-ear plus crown geometry.
- Hat pins/clips: remain small accessory classes and must not inherit full-hat scale.

## W45 current benchmark visual ratios
Production-fit values are intentionally larger than W44 safe-box values. Current benchmark families use approximately:
- cowboy: 1.27 x semantic head width, with temple-width safeguard;
- helmet: 1.17 x;
- cap: 1.08 x;
- toque/beanie: 1.08 x;
- wide brim: 1.32 x;
- bucket: 1.12 x;
- crown: 0.82 x;
- tiara: 0.78 x;
- top hat: 0.99 x.

These are starting production ratios, not immutable constants. Actual visual proof may tune them.

## Rollout scope
W45 routes the normal human headwear catalog through semantic visual sizing.

Specialty semantic items keep their dedicated solvers:
- earmuff/ear-specific flagship item;
- bun/ribbon accessory;
- forehead-specific headband.

Dog headwear stays blocked from the human solver until dog-specific skull/ear profiles are proven.

## Approval gate
A headwear item fails if it:
- looks miniature;
- has a visibly pinched crown;
- has an undersized brim;
- floats above the head;
- cuts through eyes;
- is seated on the wrong facial plane;
- only looks correct because it was excessively shrunk.

A headwear fit passes only when the actual app portrait makes it read as naturally worn.

## Art honesty
Correct fit does not make concept SVG art production-approved.

Production-art status and fit status are separate gates.

The W45 anchor system may be rolled across concept items to prove scale/seat behavior, but those items remain blocked from visual/live approval until their actual art passes the production-art gate.

## Non-regression
Future builds may not restore W44-style conservative shrinking or generic percentage-box headwear placement.

Shop and card-game portraits must continue sharing the same exact portrait source, landmark profile, accessory asset, and fit solver.
