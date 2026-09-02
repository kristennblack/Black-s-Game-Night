# Phone QA - W45 Headwear Scale Recovery 63

## Goal
Confirm that portrait headwear now looks naturally worn and is no longer miniaturized in the real shop and card-game avatar surfaces.

## First gate
Use one clean portrait each for:
- John
- Kristen
- Holly
- Vanessa
- Elizabeth
- Logan

## Benchmark headwear
Check:
1. Camp Cap
2. Dark Brown Ranch Cowboy Hat
3. Cabin Knit Toque
4. Birthday Crown
5. Firefighter Helmet
6. Wide-Brim Sun Hat
7. Canvas Bucket Hat

## Shop check
For each item verify:
- crown/head coverage looks natural;
- brim is not tiny;
- item is not floating;
- item is not sunk into eyes;
- roll follows the portrait;
- hair overlap is reasonable;
- headwear is not made artificially small to avoid clipping.

## Card-game check
Equip the same item and verify the portrait beside the cards uses the same:
- portrait source;
- size;
- seat;
- rotation;
- headwear art.

Shop correct + card game wrong = FAIL.

## Category expectations
- Caps: brim above eyebrows, crown around the head.
- Cowboy/wide-brim: visibly wider than skull.
- Toque/beanie: wraps crown with top volume.
- Crown/tiara: readable ornamental size near hairline.
- Helmet: shell larger than skull, face remains readable.
- Bucket: full crown with visible surrounding brim.

## Result
Record each benchmark as GREEN / AMBER / RED.

### GREEN
Natural wearing scale and seat in both shop and card portrait.

### AMBER
Usable but needs small per-portrait scale/seat/rotation adjustment.

### RED
Miniature, floating, eye-clipping, badly cropped, wrong category silhouette, or inconsistent between shop and card game.

## Important
Do not approve concept SVG art merely because W45 fits it correctly. Fit and production-art approval remain separate gates.
