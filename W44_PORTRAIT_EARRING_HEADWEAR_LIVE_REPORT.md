# W44 Portrait Earring + Headwear Live Browser QA Report

## Candidate
`GAME-NIGHT-STAGING-CANDIDATE-W44-EARRING-HEADWEAR-62`

## Purpose
W44 extends the proven W43 exact-portrait glasses landmark system to earrings, headwear, and the remaining portrait accessory families used in the Avatar Shop and card-game player portraits.

## What was actually tested
The W44 proof boards were rendered in headless Chromium from the production `cosmeticOverlayHTML()` output, exact app portrait assets, shared CSS transform rules, and file-backed accessory assets. They are not AI concept images. Local HTTP navigation is blocked in this environment, so the proof page was fed to Chromium directly with all production assets embedded. Cloudflare deployment remains unverified.

### Browser proof artifacts
- `visual_proofs/W44_LIVE_EARRINGS_QA.png`
- `visual_proofs/W44_LIVE_HEADWEAR_QA.png`

## Defects caught during live browser QA
1. Earring lobe positions initially received an extra downward offset, causing floating jewelry. Removed and replaced with explicit lobe landmarks.
2. Headwear initially seated too low near the eye line on several portraits. Category seat formulas were raised to the crown/hairline region.
3. Hair-covered ears were initially tempting the solver to force visible jewelry through hair. W44 now fails closed when no lobe is actually visible.
4. Shop preview used a 4:5 frame while the portrait assets/card avatars are square, causing `object-fit: cover` to shift the face under normalized anchors. W44 changes the shop preview to 1:1.
5. Historical CSS and fit APIs were separated from the authoritative live renderer so old compatibility behavior cannot overwrite the new semantic placement.

## Earring behavior
- Separate left and right overlays.
- Local pivot is the piercing/hook point.
- Exact left/right lobe landmarks for calibrated portraits.
- Baked earrings fail closed rather than double-stack.
- Hair-covered ears fail closed rather than render through hair.
- Human earring art is not forced onto dog portraits.

Current exact proof outcome:
- John: visible, anchored proof available.
- Logan: visible, anchored proof available.
- Kristen: blocked because current portrait has no reliably visible earlobes through hair.
- Holly, Vanessa, Elizabeth: blocked because current portraits already have earrings baked into the base art.

This is intentional. Clean portrait bases are required before selectable earrings can be honestly approved on those variants.

## Headwear behavior
- Category-specific seat solver using head top, crown/head width, forehead/hairline and portrait roll.
- Bottom/brim local pivot, not image center.
- Current browser proof covers cowboy hat, firefighter helmet, birthday crown, family tiara, legendary top hat and conductor cap across John, Kristen, Holly, Vanessa, Elizabeth and Logan.
- Anchor mechanics passed browser review, but individual art quality still requires user approval. W44 does not declare weak hat geometry production-approved merely because it fits.

## Full portrait-accessory anchor rollout
The catalog currently contains 1,060 portrait-accessory records:

| Slot | Count | W44 portrait behavior |
|---|---:|---|
| hat | 141 | exact head/crown semantic solver |
| hair | 150 | crown/head semantic solver |
| glasses | 117 | W43 exact pupil/bridge/temple solver preserved |
| headset | 19 | ear-to-ear + crown semantic solver |
| neck | 101 | head-derived neck anchor |
| earrings | 36 | independent exact earlobe solver |
| badge | 12 | derived upper-chest anchor |
| face | 33 | pupil/bridge/temple semantic solver |
| filter | 140 | face/head semantic solver |
| wrists | 111 | FAIL CLOSED on current head-and-shoulders portraits because wrists are not reliably visible |
| back | 100 | derived shoulder/back placement |
| attachment | 100 | derived shoulder/back placement |
| **Total** | **1,060** | semantic system routed |

Important: this table describes the fitting/attachment architecture. It does **not** mean all 1,060 accessory art files have been converted to final 3D-derived production art. Existing concept/SVG art remains blocked from final visual approval until upgraded and reviewed.

## Automated validation
Final working tree:
- Project tests: **673 / 673 PASS**
- Staging validator: **4,339 PASS, 2 WARN, 0 FAIL**
- `npm run check`: PASS
- `npm run assets:audit`: PASS

Known warnings:
1. Some 3D surfaces still use external Three.js CDN dependencies.
2. Wrangler/Cloudflare deployment cannot be verified in this environment.

## Release position
This remains a staging candidate. The W44 portrait anchor architecture may be tested on staging, but individual accessory art remains subject to visual/user/device approval before live promotion.
