# MASTER PHASE W22 — CATALOG ART RESCUE + APPROVAL STUDIO DIRECTIVE

Release: `GAME-NIGHT-STAGING-PHASE-W22-CATALOG-APPROVAL-STUDIO-44`

This directive has highest precedence for catalog-art production and review. It does not erase the W21 gameplay and true-3D cabin recovery work.

## 1. Problem being corrected
The W20/W21 catalogs contain correct ownership records, prices, collections, blueprint logic and fit metadata, but much of the visible catalog art is generated placeholder SVG artwork. Unique file hashes are not an acceptable proxy for professional art quality. A catalog item is not production-complete merely because it has a unique ID or a unique placeholder image.

## 2. Approved visual target
Use the approved Black Family Game Night master catalog lookbook as the visual contract:
- realistic 3D-product-render presentation;
- rustic/cozy cabin realism as the grounded base;
- strong readable silhouettes;
- believable wood, metal, glass, fabric, leather and painted finishes;
- larger product framing with minimal dead space;
- playful, glam, luxury, funny, family-signature and seasonal layers only where the collection calls for them.

## 3. Catalog scope under review
The review system must cover all 6,000 current design records:
- 2,000 Home items;
- 2,000 Avatar/Wearable items;
- 2,000 World Props.

Review occurs in 60 exact batches of 100 items.

## 4. Production status model
Every record carries a production art status:
1. Concept
2. Approved Art
3. 3D Ready
4. Integrated
5. Device Approved

A separate reviewer decision is tracked:
- Unreviewed
- Approve Concept
- Needs Changes
- Reject

No item may be treated as production-approved only because it exists in a catalog JSON file.

## 5. Review formats
Every batch must be reviewable in all three formats:
1. Collection Lookbook
2. Grid / Board
3. Real-use Proof

Real-use proof means:
- Home item: shown at believable scale in a 3D room context;
- Wearable: fitted on an actual family avatar using semantic fit anchors;
- World Prop: shown at believable scale in a 3D world context.

The review UI must support notes, approve/change/reject decisions, next-unreviewed navigation, local persistence, and JSON export/import so decisions can be handed back into production.

## 6. Release safety rule
Unapproved new concepts must not become newly purchasable/unlockable in staging by accident. Existing ownership must remain intact. The staging store may preview an unapproved concept, but must show that it is pending approval and block a brand-new unlock until promotion.

## 7. Home-item standards
- Real-world scale with slightly substantial cozy-rustic proportions.
- Doors/windows behave as architectural elements, not stickers.
- Floor, wall and tabletop placement must be explicit.
- Different color/finish does not consume a new design ID when the geometry is the same.
- Different geometry/silhouette/style is a distinct design.
- Browse render, detail preview and placed-room identity must visibly be the same object.

## 8. Wearable standards
Layer stack:
1. hair
2. headwear
3. face/filter
4. earrings
5. neck
6. top
7. outerwear
8. bottoms
9. footwear
10. handheld/back
11. aura/signature

Human wearables use semantic anchor fitting. Dog adaptations are deliberate where appropriate; human garments are not simply stretched onto dogs. Colorways should be selectable finishes when the geometry is unchanged. New IDs are reserved for genuinely different designs.

## 9. World-prop standards
Each prop keeps one master visual identity with optimized runtime variants for store/preview, cabin, world dressing and Prop Hunt use where needed. Props are explicitly classified as appropriate combinations of:
- Hideable
- Decor-only
- Climbable
- Interactive
- Ambient animated
- Landmark

Not every prop is disguisable.

## 10. Production priority
1. Cabin Home Essentials
2. Avatar Everyday Wear
3. Prop Hunt Shared World Props
4. Family Signature Collections
5. Funny Filters + Comedy Cosmetics
6. Luxury / Rare / Achievement
7. Seasonal / Event

Priority collections may ship once approved; unfinished/unapproved content stays in staging.

## 11. Truthfulness gate
W22 implements the complete review/approval system and status gating for all 6,000 records. It does **not** claim that all 6,000 production-quality bespoke assets have already been redrawn. Current placeholder images remain visible only as locators/concept placeholders until replaced by approved production art.

## 12. Required acceptance gates
- 6,000 review records, no duplicate review IDs.
- 60 batches of exactly 100.
- Batch 1 is Cabin Home Essentials.
- Three review modes operate.
- Decisions persist locally and export/import correctly.
- Source catalogs include explicit Concept / Unreviewed / not-approved-for-live fields.
- New unlocks of unapproved concepts are blocked in staging.
- W21 gameplay/cabin regressions remain green.
- Real-device review remains required before Device Approved status.
