# Phone QA — W43 Portrait Anchor Recovery 61

## Hard rule
Judge the actual shop/card portraits. Do not use the full-body Prop Hunt character as the accessory acceptance surface.

## Fresh-load check
1. Deploy the W43 candidate.
2. Fully close/reopen the site or hard refresh once so the W43 candidate service worker controls the page.
3. Open the token shop and confirm the selected portrait look is the same portrait being fitted.

## Priority glasses
Test Reading Glasses, Classic Glasses, Rose Party Glasses, and Shop Safety Glasses.

## Required people/variants
- John: default plus at least two different John looks.
- Kristen: cute plus one alternate style.
- Holly: cute plus one alternate style.
- Vanessa: cute plus one alternate style.
- Elizabeth: cute plus one alternate style.
- Logan: cute plus one alternate style.

## Visual checks for every fit
- frame center follows the nose bridge;
- lens centers cover the pupils;
- frame rotates with the eye line;
- frame span reaches believable temple width;
- no tiny glasses floating between the eyes;
- no oversized frame running well beyond the temples;
- no CSS snap back to a generic horizontal position;
- selected portrait variant remains the portrait shown after changing cosmetics.

## Baked-eyewear behavior
On a portrait that already contains glasses, W43 should block the second glasses overlay and show the shop warning rather than double-stack eyewear.

## Card-game parity
After selecting a clean portrait + glasses in the shop, open any card game and confirm the player portrait uses the same portrait variant and the same anchored fit.

## Result
GREEN: exact portrait and fit remain correct in shop and card game, including after refresh.
AMBER: generally correct but one portrait needs landmark fine-tuning.
RED: generic coordinates return, wrong portrait variant is fitted, duplicate baked eyewear appears, or refresh restores old placement.
