# Phone QA — W46 Approved Headwear Art 64

## Purpose
Verify that the 12 approved Headwear Board 01 designs are actually being used and fitted correctly on real shop/card portraits.

## Cache sanity
- Load the W46 staging candidate after a fresh refresh/reload.
- Confirm the candidate uses W46 asset paths / candidate cache, not stale W44/W45 art.

## Shop test
For each item below, select a clean portrait and inspect scale, seat, roll, material/detail, and face clearance:
- Camp Cap
- Cowboy Hat
- Cabin Knit Toque
- Firefighter Helmet
- Birthday Crown
- Family Tiara
- Legendary Top Hat
- Trail Trouble Champion Cap
- Prop Hunt Hunter Hat
- Mexican Train Conductor Cap
- Wide-Brim Sun Hat
- Canvas Bucket Hat

## Critical checks
- Hat is not toy-sized.
- Hat is not stretched vertically.
- Brim/crown silhouette resembles the approved board.
- Hat follows portrait head roll.
- Cap/helmet/crown does not cover eyes.
- Crown/tiara sits at hairline rather than as a forehead band.
- Prop Hunt Hunter Hat reads as an olive cap, not a cowboy hat.
- Toque retains height/knit-cap silhouette without swallowing the face.
- Wide-brim hat remains broad without becoming a flat disk.

## Card-game parity
Choose at least 3 hats and confirm the same portrait + hat combination appears equivalently beside cards/player UI.

## Variant check
For John, change portrait look at least twice and confirm the hat follows the selected exact portrait rather than old coordinates.

## Result
Mark each item GREEN / AMBER / RED.

GREEN = correct art + believable fit on real device.
AMBER = usable but needs minor item/person tuning.
RED = wrong art, stale fallback, toy-sized, distorted, detached, eye-covering, or wrong category silhouette.

Do not promote W46 to live approval until the user approves the real staging/device result.
