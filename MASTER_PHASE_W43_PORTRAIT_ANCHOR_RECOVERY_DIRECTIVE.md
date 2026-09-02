# MASTER PHASE W43 — PORTRAIT ANCHOR REGRESSION RECOVERY DIRECTIVE

Status: highest-precedence shop/card portrait accessory-fitting directive until superseded.

## Why W43 exists
W42 proved the landmark-fitting idea but the live app could still regress because the proof surface and runtime surface were not guaranteed to use the same portrait file, old CSS could override the fitted transform, the GLB-derived overlay image bounds were not the same as the lens geometry, and a stale service-worker cache could obscure which cosmetic code was actually running.

## Non-negotiable runtime truth
1. Fit against the exact portrait image that is actually displayed. For John this means the selected `john-look-XX.jpg`; for the rest of the family it means the selected `cute/goofy/rugged/glam` style image.
2. Landmark data is keyed by exact portrait-style key, not only by person name.
3. Shop, card games, and family-arcade portrait surfaces must call the same `cosmeticOverlayHTML()` fitting path with the selected portrait variant.
4. The fitted CSS custom properties are authoritative. No later stylesheet may replace portrait cosmetic position/size with hard-coded slot coordinates.
5. GLB-derived portrait renders must scale from measured accessory geometry. Glasses use eye spacing or temple span according to design; the transparent PNG canvas width is not treated as frame width.
6. A portrait containing baked-in eyewear must not receive a second glasses overlay. An uncalibrated exact portrait style must be blocked from live glasses rendering until calibrated rather than silently using a bad generic fallback.
7. Candidate service-worker assets must use a candidate-specific runtime cache. Historical release markers may remain for compatibility but may not control the candidate runtime cache.

## W43 calibration coverage
The W43 recovery calibrates all 16 John style portraits and all four current style portraits for Kristen, Holly, Vanessa, Elizabeth, and Logan. The exact landmark data is packaged in `W43_EXACT_PORTRAIT_ANCHORS.json` and embedded in the portrait anchor module used by runtime code.

## Visual proof rule
The W43 exact-source proof uses the actual app portrait JPGs plus the actual transparent overlays derived from the W42 GLB masters and the same fit mathematics used by runtime. It is a code/math proof, not a live browser screenshot and not AI concept art. Real-device shop/card screenshots remain the final device gate.

## Regression rule
Any future accessory build that reintroduces person-only anchors, generic hard-coded glasses coordinates, ignores the selected portrait variant, shows duplicate glasses over baked eyewear, or uses stale candidate assets fails QA regardless of automated test count.
