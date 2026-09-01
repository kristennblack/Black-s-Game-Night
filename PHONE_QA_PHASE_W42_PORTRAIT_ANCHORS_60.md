# W42 Portrait Accessory Phone / Browser QA

Candidate: GAME-NIGHT-STAGING-CANDIDATE-W42-PORTRAIT-ANCHORS-60

## Primary proof routes
1. `/w42-portrait-anchor-qa.html`
2. `/tokens-store.html` with one of the four W42 glasses selected/equipped.
3. Any card game showing that player's normal portrait avatar.

## Verify
- Reading, Classic, Rose Party and Shop Safety Glasses use dimensional production-derived artwork, not the old generated SVG.
- Lenses sit over pupils.
- Bridge sits on the nose bridge.
- Frame rotates with the eye line.
- Glasses are large enough to span the face appropriately.
- Same equipped item appears consistently in shop preview and card-game avatar.
- John, Kristen, Holly, Vanessa, Elizabeth and Logan match the approved W42A.3 target closely.
- Changing portrait variants does not fall back to one generic global fit.
- Portraits with baked eyewear are visibly flagged in shop and are not declared approved.
- No regression to hats/headwear or unrelated cosmetics.

## Result
GREEN: fit is convincing and consistent in shop + card game.
AMBER: minor per-portrait calibration needed; note person, variant, item.
RED: tiny/floating/off-eye/double eyewear, old SVG visible, or different result between shop and card game.
