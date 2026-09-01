# W45 Headwear Visual Scale Recovery Report

## Candidate
`GAME-NIGHT-STAGING-CANDIDATE-W45-HEADWEAR-SCALE-RECOVERY-63`

## Purpose
Correct portrait headwear that was technically anchored but visibly undersized. W45 changes headwear fitting from conservative safe-box sizing to semantic visual wearing scale.

## Implemented
- exact portrait-variant head, temple, eye-line, hairline and crown-derived fitting retained from W43/W44;
- new W45 visual headwear family profiles;
- per-person scale/seat corrections for the primary family portraits;
- larger category-specific ratios for cowboy hats, helmets, caps, crowns, tiaras, top hats, bucket hats, wide-brim hats, toques/beanies, berets, wraps, headbands and pins;
- normal human headwear catalog routed through semantic W45 sizing;
- specialty ear/bun/forehead anchor items remain on dedicated solvers;
- dog headwear remains blocked from the human solver pending dog-specific visual profiles;
- independent W45 service-worker runtime cache;
- actual browser-rendered W45 visual proof pages included.

## Catalog routing
- Total portrait headwear records: 141
- W45 semantic visual-head solver: 138
- Dedicated specialty semantic solvers: 3
- Unrouted headwear: 0

## Visual proof
`visual_proofs/W45_LIVE_HEADWEAR_SCALE_QA.png`
- 36 browser-rendered cases
- exact app portraits
- exact production/3D-derived W44 hero headwear files
- W45 fit math

`visual_proofs/W45_SEVEN_HAT_LIVE_QA.png`
- 42 browser-rendered cases
- seven benchmark categories: cap, cowboy, toque, crown, helmet, wide-brim, bucket
- includes actual current catalog art where production art does not yet exist
- fit proof only; concept SVG art remains visually unapproved

## Automated verification
- `npm test`: 681 / 681 PASS
- `npm run check`: PASS, including 681 / 681 tests
- `npm run staging:validate`: 4,341 PASS, 2 WARN, 0 FAIL

Known infrastructure warnings:
1. core Three.js/addon CDN dependencies remain on 3D surfaces;
2. Wrangler executable/deployment is unavailable in this environment, so actual Cloudflare deployment remains unverified.

## Release honesty
W45 is a staging candidate. `CURRENT_RELEASE.txt`, package release identity and the official W30 release marker remain unchanged until real staging/device approval.

Correct fit does not automatically approve concept artwork. W45 separates fit approval from production-art approval.
