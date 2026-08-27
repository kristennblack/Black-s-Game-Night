# BLACK FAMILY GAME NIGHT
# MASTER APPROVED FAMILY CHARACTER DIRECTIVE
## Ultra-Simplified 3D Character Identity Lock

**Approval date:** 2026-08-27  
**Status:** LOCKED / HIGHEST-PRECEDENCE CHARACTER ART CONTRACT  
**Runtime registry:** `public/approved-family-characters.mjs`  
**Machine-readable registry:** `public/approved-family-characters.json`  
**Master lineup:** `public/family-3d-lineup-approved.png`

---

## 1. NON-NEGOTIABLE RULE

> **THE APPROVED TURNAROUND CONTROLS IDENTITY. THE 3D BUILD MAY REVEAL UNSEEN ANGLES, BUT IT MAY NOT REDESIGN THE CHARACTER. SIMPLIFY GEOMETRY, NOT IDENTITY.**

This directive overrides older instructions that call for additional realism or additional facial/clothing detail whenever those instructions would cause the approved family cartoon appearance to drift.

Do not change an approved character's:
- skin tone
- hair colour
- hair style/silhouette
- face identity
- age read
- base body proportions
- approved base outfit
- dog coat colour/markings once a dog turnaround is approved

Do not add "improvements" that alter identity.

---

## 2. CURRENT TURNAROUND-APPROVED CAST

The following characters have passed the one-character-at-a-time turnaround approval gate and are locked:

1. **John Black** — `CHAR_JOHN`
   - Reference: `/approved-character-turnarounds/john-approved-turnaround.png`
   - Future authored model: `/models/characters/approved/CHAR_JOHN.glb`
2. **Kristen Black** — `CHAR_KRISTEN`
   - Reference: `/approved-character-turnarounds/kristen-approved-turnaround.png`
   - Future authored model: `/models/characters/approved/CHAR_KRISTEN.glb`
3. **Holly** — `CHAR_HOLLY`
   - Reference: `/approved-character-turnarounds/holly-approved-turnaround.png`
   - Future authored model: `/models/characters/approved/CHAR_HOLLY.glb`
4. **Vanessa** — `CHAR_VANESSA`
   - Reference: `/approved-character-turnarounds/vanessa-approved-turnaround.png`
   - Future authored model: `/models/characters/approved/CHAR_VANESSA.glb`
5. **Elizabeth (Lizzie)** — `CHAR_LIZZIE`
   - Reference: `/approved-character-turnarounds/elizabeth-approved-turnaround.png`
   - Future authored model: `/models/characters/approved/CHAR_LIZZIE.glb`
6. **Logan** — `CHAR_LOGAN`
   - Reference: `/approved-character-turnarounds/logan-approved-turnaround.png`
   - Future authored model: `/models/characters/approved/CHAR_LOGAN.glb`
7. **James** — `CHAR_JAMES`
   - Reference: `/approved-character-turnarounds/james-approved-turnaround.png`
   - Future authored model: `/models/characters/approved/CHAR_JAMES.glb`
8. **Dorothy** — `CHAR_DOROTHY`
   - Reference: `/approved-character-turnarounds/dorothy-approved-turnaround.png`
   - Future authored model: `/models/characters/approved/CHAR_DOROTHY.glb`

### Not yet turnaround-approved
Do **not** mark these as finished or infer a final design from older art:
- Papa
- Nana
- Kelsi
- Molly
- Gunner

Their current game assets may remain as compatibility fallbacks until their individual turnaround is approved.

---

## 3. REQUIRED PRODUCTION WORKFLOW

For every remaining character:

1. Start from the approved lineup/reference only.
2. Isolate one character.
3. Produce only:
   - Front
   - Front 3/4
   - Side
   - Back 3/4
   - Back
4. Obtain explicit approval.
5. Lock that turnaround into this directive and registry.
6. Only then author the GLB.
7. Compare the GLB against the turnaround from all five required views.
8. Only after visual approval may the manifest set `approvedModel: true`.

Never batch-redesign the family cast.

---

## 4. LIGHTWEIGHT 3D BUILD STANDARD

The approved cartoon appearance is intentionally simpler so the cast can be used throughout phone-first 3D games.

### Humans
Use one shared humanoid skeleton wherever practical.

Target:
- approximately 5,000–6,500 triangles at LOD0 for the approved simplified human cast
- roughly half at LOD1
- approximately 1,100–1,400 triangles at LOD2
- one compact texture atlas where practical
- simplified fingers/hands at normal gameplay distance
- hair as solid readable sculpted masses, not individual strands
- beard/moustache as low-cost solid or texture-supported forms
- clothing seams/details primarily in textures rather than extra geometry
- simple boots/shoes with readable silhouettes
- no unnecessary facial topology loops

### Identity priority
If performance requires reduction, simplify in this order:
1. tiny clothing seams
2. fingers
3. shoe details
4. hair strand detail
5. small facial topology

Never solve performance by changing the character's locked hair colour, hairstyle, skin tone, face, body identity or approved outfit read.

---

## 5. SHARED RIG + SOCKET CONTRACT

Approved human GLBs must use the shared humanoid contract and expose or map to:
- Head
- Neck
- Spine / chest
- Hips
- Shoulders
- Elbows
- Wrists
- Hands
- Knees
- Ankles

Required gameplay sockets:
- `rightHand` — weapon/tool/prop
- `leftHand` — secondary prop/support grip
- `back` — backpack/equipment
- `head` — hats/event attachments where explicitly allowed

Base animation compatibility:
- Idle
- Walk
- Run
- Sprint
- Turn Left / Right
- Jump
- Fall
- Land
- Crouch
- Wave
- Point
- React
- Celebrate

Prop Hunt may additionally use aim/fire/hit/mantle animations.

---

## 6. RUNTIME CODE CONTRACT

All 3D games may import:

```js
import {
  getApprovedFamilyCharacter,
  approvedFallbackStyle,
  tagWithApprovedIdentity,
  expectedApprovedModelPath
} from '/approved-family-characters.mjs';
```

Rules:
- `getApprovedFamilyCharacter(id)` is the source of truth for locked appearance metadata.
- `approvedFallbackStyle(id)` supplies mobile-friendly fallback colours/material identity.
- `tagWithApprovedIdentity(root,id)` records which turnaround the runtime asset must match.
- `expectedApprovedModelPath(id)` gives the reserved GLB path.
- A missing GLB must fall back safely. Never substitute a newly invented family design.

The current Phase W.5 integration applies this registry to:
- Family Prop Hunt
- Family Island Life
- John's Birthday Seat

---

## 7. AUTHORED GLB ACCEPTANCE GATE

A candidate GLB is **not approved** because it loads, animates or passes automated tests.

For each character, verify:
- front matches approved turnaround
- front 3/4 matches
- side silhouette matches
- back 3/4 matches
- back silhouette matches
- hair colour/style is unchanged
- skin tone is unchanged
- face remains recognizable as the approved cartoon version
- base outfit is unchanged
- normal animation does not distort the face/body badly
- props attach cleanly
- phone frame rate remains acceptable

Only then set the model's manifest flag:

```json
"approvedModel": true
```

Until then use:

```json
"approvalStatus": "TURNAROUND_APPROVED_MODEL_PENDING"
```

---

## 8. CURRENT APPROVED IDENTITY SUMMARY

### John
Red/black plaid shirt; blue jeans; brown work boots/belt; short brown side-swept hair; full short brown beard.

### Kristen
Black fitted T-shirt; blue jeans; brown belt/boots; shoulder-length wavy blonde hair.

### Holly
Cream padded sweater/vest look; blue pants; blue backpack straps; brown shoes; bright blonde double buns.

### Vanessa
Maroon/dark-red long-sleeve top; blue jeans; brown belt/boots; long voluminous curly blonde hair.

### Lizzie
Pink hoodie; pink white-polka-dot skirt; white socks; pink Crocs; bright blonde high ponytail with large pink bow.

### Logan
Black fishing-logo hoodie; black cargo pants; tan/brown work boots; short messy/spiky blonde hair.

### James
Bright blue button-up shirt; blue jeans; brown belt/shoes; short curly grey hair; grey moustache; round glasses.

### Dorothy
Blonde high updo/bun; **no glasses**; blue long-sleeve dress/top; cream floral apron; blue shoes.

---

## 9. PRECEDENCE

When any old photo-based reference, old `characters3d` PNG, old GLB, previous prompt, generated image or generic family style conflicts with an explicitly approved turnaround in this directive:

**THE APPROVED TURNAROUND WINS.**
