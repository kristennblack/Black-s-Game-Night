# W43 Portrait Anchor Regression Recovery Report

## Purpose
Recover the W42 shop/card portrait accessory fitting after live behavior regressed.

## Root causes confirmed
1. **Proof/runtime portrait mismatch.** Earlier fit proof used portrait sources that were not guaranteed to be the exact `john-look-XX` or `person-style` JPG selected by the live shop/card avatar.
2. **CSS transform override.** `phase-w-platform.css` still contained legacy slot rules capable of stomping the anchor-engine X/Y/width/rotation values and generic `img` styling could affect cosmetic overlays.
3. **Accessory geometry scaling error.** GLB-derived glasses overlays contain transparent padding; sizing the entire image using a generic eye-width multiplier made frame geometry inconsistent. W43 uses measured lens/temple geometry.
4. **Variant loss in family arcade.** The family arcade profile omitted the selected portrait variant and could display a different portrait from the one being fitted.
5. **Unsafe fallback behavior.** Baked-eyewear and uncalibrated portrait styles needed explicit live blocking rather than a visually bad generic fallback.
6. **Candidate cache ambiguity.** Candidate cosmetic code needed an isolated W43 runtime service-worker cache so stale W30/W42 assets cannot silently reappear.

## W43 implementation
- Exact portrait-style landmark keys for all 16 John portrait looks.
- Exact landmark keys for cute/goofy/rugged/glam portraits for Kristen, Holly, Vanessa, Elizabeth, and Logan.
- Landmark-driven pupils, bridge, temples, ears, head bounds and face angle data.
- Glasses sizing derived from actual eye or temple distances by accessory design.
- Phase-W avatar CSS now styles `.avatar-base` separately and honors `--cx/--cy/--cw/--cr` as authoritative cosmetic variables.
- Family arcade now preserves selected portrait variant and loads the matching portrait asset.
- Live cosmetic renderer suppresses `blocked` portrait fits while historical fit APIs continue returning finite geometry for backward compatibility.
- Baked-eyewear portraits are explicitly blocked from receiving duplicate eyewear.
- W43 candidate runtime service-worker cache is separated from the preserved W30 official-release identity marker.
- W43 runtime QA page is included in the candidate service-worker shell.

## Proof artifact
`visual_proofs/W43_EXACT_STYLE_MATH_PROOF.png` is composed from the exact app portrait files, real GLB-derived transparent accessory overlays, and W43 anchor math. It is not AI-generated concept art. It is not a live browser/device screenshot.

## Automated validation
- Full project tests: 663 / 663 PASS.
- Staging validator: 4,321 PASS / 2 infrastructure warnings / 0 FAIL.
- Production 3D asset audit: PASS.
- `npm run check`: PASS.

The two staging warnings remain infrastructure-only: Three.js CDN dependence and Wrangler/Cloudflare deployment cannot be verified from this environment.

## Remaining device gate
Deploy the W43 candidate to staging and verify the selected exact portrait variant in both the token shop and at least one card-game player avatar. A real-device screenshot remains required before release promotion.
