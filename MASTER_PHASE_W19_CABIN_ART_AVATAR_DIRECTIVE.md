# BLACK FAMILY GAME NIGHT
# MASTER PHASE W.19 — CABIN ART, EMPTY-ROOM PROGRESSION + UNIVERSAL AVATAR FIT

Planning/build date: 2026-08-28  
Runtime release: `GAME-NIGHT-STAGING-PHASE-W19-CABIN-ART-AVATAR-41`  
Design release: `GAME-NIGHT-DESIGN-PHASE-W19-CABIN-ART-AVATAR-41`  
Status: **HIGHEST-PRECEDENCE CURRENT DIRECTIVE**

W.19 is cumulative on W.18. Preserve every W.18 gameplay repair unless this directive explicitly supersedes it.

## 1. Cabin progression contract

- Every personal bedroom begins as an **empty architectural shell**: rustic pine/wood walls and floor, door/window architecture and simple room lighting only.
- No bed, television, dresser, chair, decoration or other furniture is pre-placed.
- W.19 is a migration, not just a new-player setting. Legacy room placements are cleared when old room data is read. Ownership, guest-book entries, reactions and unlocked blueprints remain intact.
- The only free inventory is a deliberately low-end five-piece Starter Crate:
  1. Pine Single Bed
  2. Simple Nightstand
  3. Basic Desk Chair
  4. Plain Floor Lamp
  5. Neutral Woven Rug
- The existing blueprint economy is authoritative: unlock once, place unlimited copies. Removing/storing a placed object never destroys its blueprint.
- Only the room owner may decorate their room. There is no host/admin decoration override.
- Starting bedroom scale remains approximately 14×16 ft.

## 2. Room editor interaction contract

Phone and desktop must both support the same reliable loop:
1. tap/click a placed item to select it;
2. tap/click a valid room destination to move it;
3. use precision arrows when desired;
4. rotate in 90-degree steps;
5. store/remove it;
6. duplicate it when its blueprint is owned;
7. switch floor/wall surface where the catalog record supports both;
8. snap floor and wall placements to readable placement planes;
9. reject placements that exceed the room footprint;
10. explicitly save dirty room state.

Do not require freeform resizing. Asset scale is art-directed so furniture remains believable.

## 3. Item-art identity contract

The old category-image shortcut is prohibited. “Beds” cannot all reuse one bed image; “Electronics” cannot all reuse one television image.

Every one of the 400 cabin catalog records must have a stable item identity used throughout the product. W.19 ships a generated authored-vector identity pair for every record:
- `public/cabin-assets/generated/thumbs/<Item ID>.svg`
- `public/cabin-assets/generated/placeables/<Item ID>.svg`

The item seed, category silhouette, construction details, finish treatment, accents and rarity treatment are derived per record so all 400 output files are visually and cryptographically distinct.

Identity must remain consistent through:
- Browse / Cabin Shop catalog card
- Collection / owned inventory
- Large preview / turntable-style room preview
- Cabin placement
- Shared cabin-prop references in 3D games where appropriate

Hero / Family Legendary / Secret objects should receive the strongest silhouette, finish and accent treatment.

### Truthfulness boundary
W.19 does **not** claim that all 400 catalog items now have bespoke production GLB meshes. The 400-item collection has distinct 2D/vector browse-and-placement art. The shared 3D art kit gains a smaller production-style rustic prop vocabulary (bed, television, dresser, lamp and rug) that is propagated to priority 3D games. Future authored GLBs must preserve each item’s W.19 identity rather than collapsing back to category clones.

## 4. Store preview contract

- Room store cards use each item’s own thumbnail asset.
- Room preview uses the same item’s own placeable identity against the empty cabin shell.
- Preview uses a subtle turntable/presentation motion rather than a static category photo.
- Avatar store preview is a larger rounded rectangle / bust-body stage, not a tiny circle.
- “Preview in room” remains available before purchase/use.

## 5. Avatar + accessory fit contract

Every wearable/accessory is expected to fit every selectable avatar, including Kelsi, Molly and Gunner.

- Never solve a portrait conflict by silently hiding the cosmetic.
- Use anatomical anchors, scale, offsets and per-avatar fitting.
- Human slots: head, hair, eyes, ears/headset, neck/accessory, jewelry, chest/top and badge.
- Dog slots use dog-specific anchors. Torso/top pieces become fitted dog shirts/harness-style overlays where needed.
- Drop earrings and jewelry remain visible rather than being suppressed by a portrait variant.
- Important presentation priority:
  1. Avatar customization screen
  2. Store preview
  3. Cabin player panels
- Small circular quick-select portraits may remain where space requires them, but primary dressing/fitting surfaces should use larger bust/full-body framing.

## 6. Shared 3D cabin art language

Cross-game priority remains:
1. Family Mystery
2. Family Prop Hunt
3. Island Life
4. Molly’s Light Chase

W.19 implementation:
- **Family Mystery:** room illustrations use the empty cabin shell and actual generated cabin collection props; existing glowing reachable clue blocks, tap-destination routing and obvious kitty-corner secret passages remain.
- **Prop Hunt / Papa’s Shop:** shared 3D art kit adds Cabin Bed, Cabin TV, Cabin Dresser, Cabin Lamp and Cabin Rug geometry/material language. A lodge corner in Papa’s Shop uses this prop family without blocking the established chase lanes.
- **Island Life:** Palm & Pine Home displays shared cabin furniture; home furniture materials use the shared rustic pine, aged wood, cream fabric, iron and forest palette.
- **Molly’s Light Chase:** cabin scene uses cabin collection placeable artwork as environmental dressing while preserving Molly’s growing light-trail gameplay.

The cabin is the visual source of truth. New 3D work should inherit its warm wood, aged pine, cream fabric, iron/brass accents, believable object scale and cozy realism.

## 7. Naming lock

The family character is **Lizzy** or **Elizabeth**. Do not use “Lizzie.”

## 8. QA / acceptance gates

A W.19 build is not shippable unless automated QA proves:
- current release/cache markers are W.19;
- existing W.18 gameplay regression suite still passes;
- room defaults and migrated legacy rooms are empty shells;
- the five low-end starter blueprints are present;
- all 400 catalog records have a thumbnail and placeable asset and all 400 hashes are unique in each set;
- browse and cabin use the per-item art helper rather than category maps;
- room selection/move/rotate/remove/duplicate/surface controls are wired;
- server persists placement surfaces and owner-only rules;
- every cosmetic returns a visible finite fit for every family avatar and dog;
- Family Mystery, Prop Hunt, Island Life and Molly contain the shared W.19 art hooks;
- visible user-facing family spelling contains no “Lizzie.”

Real-device acceptance still matters. Automated tests cannot prove finger feel, perceived visual scale or final art taste on a phone/tablet.
