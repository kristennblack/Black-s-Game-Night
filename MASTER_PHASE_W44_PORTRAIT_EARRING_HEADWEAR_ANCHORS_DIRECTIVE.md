# W44 — PORTRAIT EARRING + HEADWEAR ANCHOR DIRECTIVE

## Status
Highest-precedence production directive for portrait-based earrings and headwear until explicitly superseded.

## Objective
Make earrings and headwear fit correctly on the exact shop/card-game avatar portrait being displayed.

This directive applies to:
- avatar shop previews;
- card-game player portraits;
- profile/avatar portraits;
- any portrait-based cosmetic preview that reuses the same avatar images.

This directive does NOT replace the separate full-3D gameplay wearable system.

---

# 1. CORE NON-NEGOTIABLE RULE

Accessories must fit the exact portrait image being rendered.

Never use one generic fit per person when multiple portrait variants exist.

Required lookup hierarchy:

`character -> exact portrait asset/variant -> semantic landmarks -> accessory-category solver`

Examples:
- `john-look-07`
- `kristen-cute`
- `kristen-glam`
- `logan-rugged`
- `holly-goofy`

If the exact portrait has no approved landmark profile, the accessory must remain hidden or QA-only. Do not silently fall back to arbitrary legacy CSS offsets.

---

# 2. ONE AUTHORITATIVE PORTRAIT ACCESSORY TRANSFORM

There must be one authoritative portrait cosmetic solver.

Legacy CSS rules such as fixed:
- left/top percentages;
- width percentages;
- generic rotation;
- category-wide hard-coded offsets

must not override semantic-anchor output.

Shop, card games, family arcade portraits, and avatar previews must call the same portrait accessory fitting module.

---

# 3. LANDMARK DATA MODEL

Every supported portrait variant should be able to store:

## Face / eye landmarks
- leftPupil
- rightPupil
- noseBridge
- leftTemple
- rightTemple

## Ear landmarks
- leftEarTop
- leftEarCenter
- leftEarLobe
- rightEarTop
- rightEarCenter
- rightEarLobe
- leftEarVisible
- rightEarVisible
- leftEarOcclusion
- rightEarOcclusion

## Head landmarks
- headTop
- foreheadCenter
- hairlineCenter
- leftHeadEdge
- rightHeadEdge
- leftCrownEdge
- rightCrownEdge
- leftTemple
- rightTemple

## Orientation metadata
- faceRoll
- faceYawEstimate
- facePitchEstimate
- perspectiveSkew
- portraitCropScale

## Hair / baked-art metadata
- hairVolumeTop
- hairVolumeLeft
- hairVolumeRight
- hairOcclusionMask if available
- bakedHat
- bakedGlasses
- bakedEarrings
- bakedHeadAccessory

All coordinates should be normalized to the portrait image so resizing the UI does not invalidate calibration.

---

# 4. EARRING ANCHOR SYSTEM

## 4.1 Primary attachment point
Earrings must attach to the relevant `EarLobe` point, not a generic side-of-head coordinate.

Each earring render must define its own local pivot corresponding to the piercing / hook point.

The accessory solver aligns that local pivot to the portrait's lobe anchor.

## 4.2 Visibility
If an ear is not visible:
- do not draw that side's earring;
- do not mirror an earring into hair;
- do not place it based on the opposite ear.

If only one ear is visible, a one-sided visible result is correct.

## 4.3 Earring classes
Different classes need different fit logic.

### Stud
- small footprint around lobe;
- minimal vertical drop;
- scale primarily from ear size/head scale.

### Hoop
- pivot at lobe;
- ring drops below lobe;
- diameter scales from ear/head size;
- must not float beside cheek.

### Drop / dangle
- pivot at lobe;
- vertical length scales from head size;
- may require a slight gravity/downward angle;
- must clear shoulder/cheek where possible.

### Statement earring
- pivot at lobe;
- may need per-portrait maximum size;
- must not dominate the face or visibly detach from the ear.

## 4.4 Perspective
For strong three-quarter/profile faces:
- near-side earring may render at 100% scale;
- far-side earring may be reduced, partially occluded, or hidden;
- optional horizontal squash may be used for perspective;
- far-side layering must respect face/hair occlusion.

## 4.5 Hair occlusion
Where hair covers the upper earring or hook:
- render the earring behind a hair occlusion mask if available;
- otherwise hide the portion/side that cannot be represented cleanly;
- never place the full earring on top of dense hair merely to make it visible.

---

# 5. HEADWEAR ANCHOR SYSTEM

## 5.1 Headwear seat line
Headwear must not position from the image's top-left corner.

Each portrait needs a real head seat region derived from:
- headTop;
- left/right head edge;
- forehead/hairline;
- crown edges;
- face/head roll.

## 5.2 Category-specific fitting

### Baseball / camp / conductor caps
Use:
- forehead/hairline seat;
- left/right head width;
- head roll.

Rules:
- brim must sit above eyebrows;
- crown wraps upper head;
- no floating cap;
- no brim through eyes;
- rear crown should respect hair volume.

### Toques / beanies
Use:
- headTop;
- head width;
- hair volume;
- forehead seat.

Rules:
- wrap the crown;
- lower edge should sit near upper forehead/hairline;
- adapt height for buns/high hair;
- do not become an oversized egg.

### Cowboy / wide-brim hats
Use:
- crown seat;
- head width;
- forehead center;
- roll/perspective.

Rules:
- actual cowboy crown silhouette;
- brim width visibly exceeds skull width;
- brim angle follows face/head roll;
- crown must not read as a top hat;
- hair/ears may be partially occluded by brim.

### Top hats
Use:
- crown seat;
- head width;
- head roll.

Rules:
- narrow brim;
- tall crown;
- remain centered over skull, not face box.

### Crowns / tiaras
Use:
- hairline/forehead;
- crown edges;
- head roll.

Rules:
- sit forward at hairline/crown transition;
- smaller than helmets/hats;
- should not float high above hair.

### Helmets
Use:
- headTop;
- head width;
- ear line;
- forehead.

Rules:
- provide full-head coverage;
- leave eyes/face readable;
- ear clearance matters;
- scale must be larger than ordinary caps but must still follow head shape.

### Earmuffs / headsets
Use:
- left/right ear centers;
- headTop;
- head width.

Rules:
- pads must land on the actual ears;
- headband arcs over the crown;
- pad spacing is derived from ear-to-ear geometry;
- use portrait-specific vertical correction.

---

# 6. PIVOT + BOUNDS CONTRACT FOR ACCESSORY ART

Every production portrait accessory render must have:

- transparent background;
- documented local anchor pivot;
- tight visible-content bounds;
- no large transparent padding used for fit calculations;
- stable orientation;
- known category;
- source 3D asset / approved art provenance.

Do not scale from the entire PNG canvas if the canvas contains transparent margins.

Fit math must use measured visible bounds or per-asset fit metadata.

---

# 7. BAKED-IN COSMETIC PROTECTION

If the selected portrait already has:
- glasses;
- earrings;
- hat/headwear;
- other conflicting accessory

baked into its base artwork, do not stack another incompatible accessory.

The portrait must be flagged:
`cleanPortraitRequired: true`

Until a clean portrait is available, that category should display:
- unavailable;
- needs clean base;
- or QA-only.

Never hide double-accessory defects by shrinking the new accessory.

---

# 8. DOG-SPECIFIC RULES

Dogs need separate semantic profiles.

## Dog headwear
Use:
- headTop;
- left/right skull edge;
- left/right ear base;
- muzzle-safe face region.

Headwear must avoid:
- ear clipping;
- floating above fur;
- hats covering eyes/muzzle.

## Dog ear accessories
Human earrings should not automatically be applied to dogs.

Only dog-specific ear/bow accessories may use dog ear anchors unless the item is intentionally designed for dogs.

## Dog eyewear/headsets
Use dog-specific eye/ear landmarks, not human ratios.

---

# 9. SHOP + CARD-GAME CONSISTENCY

The shop preview and the card-game avatar must share:
- the same portrait source;
- the same landmark profile;
- the same accessory asset;
- the same fit solver;
- the same visibility/occlusion rules.

A cosmetic that looks correct in the shop but wrong beside cards is a FAIL.

---

# 10. QA APPROVAL BOARDS

## Earring approval boards
For each production earring style:
- show exact supported portrait variants;
- show left/right lobe anchor markers;
- show accessory pivot;
- show visible-ear state;
- show final composite without markers.

Minimum representative styles:
1. stud;
2. medium hoop;
3. pearl/drop;
4. gem dangle;
5. heart/charm;
6. statement.

## Headwear approval boards
Minimum representative styles:
1. camp/baseball cap;
2. toque/beanie;
3. cowboy hat;
4. crown;
5. tiara;
6. firefighter helmet;
7. top hat;
8. conductor cap;
9. earmuffs/headset if applicable.

For each proof:
- exact portrait source;
- head landmarks;
- fitted accessory;
- clean final composite.

No concept-only board counts as runtime approval.

---

# 11. QA STATUS RULES

### GREEN
- correct semantic anchor;
- believable scale;
- no meaningful float/sink;
- correct head/ear roll;
- appropriate occlusion;
- works in shop and card portrait;
- real production asset/render.

### AMBER
- technically anchored and usable;
- needs minor scale/rotation/occlusion tuning;
- not live approved.

### RED
- detached/floating;
- clips face/eyes/ears badly;
- wrong category silhouette;
- wrong portrait calibration;
- generic fallback pretending to be production;
- double accessory due to baked art;
- uses legacy generic CSS placement.

---

# 12. RELEASE GATE

An accessory cannot become live merely because:
- its file exists;
- tests pass;
- it renders somewhere;
- an isolated product image looks good.

For portrait cosmetics, release requires:
1. exact portrait calibration;
2. semantic-anchor fit;
3. shop proof;
4. card-game proof;
5. mobile/device proof;
6. user visual approval.

---

# 13. NON-REGRESSION RULE

Future builds may not replace semantic anchors with generic percentage offsets.

Every later build must preserve:
- portrait-specific landmarks;
- variant-specific lookup;
- one authoritative transform;
- baked-art protection;
- exact shop/card consistency.

If a new system cannot resolve a valid anchor, it must fail closed rather than display a visibly wrong accessory.

---

# 14. IMPLEMENTATION ORDER

1. Lock current W43 glasses anchor system.
2. Add complete ear/head landmarks to clean portrait variants.
3. Implement earring solver.
4. Produce earring internal QA board.
5. User approves earring fits.
6. Implement headwear category solvers.
7. Produce headwear internal QA boards.
8. User approves headwear fits.
9. Verify same assets in shop and card-game portraits.
10. Device QA.
11. Only then promote approved assets.

---

# 15. NEXT CATALOG EXPANSION

After W44 is proven:
- headphones/headsets;
- earmuffs;
- hair accessories;
- face accessories;
- necklaces/neckwear;
- badges;
- remaining portrait wearables

must use the same semantic-landmark architecture instead of one-off manual placement.
