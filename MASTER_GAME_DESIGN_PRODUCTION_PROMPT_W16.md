
# BLACK FAMILY GAME NIGHT
# MASTER GAME DESIGN + PRODUCTION DIRECTIVE W.16
## Cabin + Realistic Cosmetics Runtime Integration

Planning/build date: 2026-08-28
Status: **HIGHEST-PRECEDENCE CURRENT MASTER PROMPT + IMPLEMENTED RUNTIME CONTRACT**
Runtime release: `GAME-NIGHT-STAGING-PHASE-W16-CABIN-COSMETICS-RUNTIME-38`
Design release: `GAME-NIGHT-DESIGN-PHASE-W16-CABIN-COSMETICS-RUNTIME-38`

W.16 converts the previously approved W.13-W.15 Cabin/Cosmetics design work into a real application runtime layer. Where W.16 conflicts with older token-store or cosmetic rendering language, W.16 wins. Approved family-character identity remains mandatory. W.12 gameplay corrections and W.11 Prop Hunt stability remain locked.

======================================================================
0. W.16 PRECEDENCE
======================================================================

1. Explicit current user instruction.
2. Approved family-character identity and family-specific rules.
3. W.16 Cabin + realistic cosmetics runtime contract.
4. W.15 realistic cosmetics / Cabin-entry target.
5. W.14 premium realistic Cabin visual target.
6. W.13 Cabin topology, economy, room catalog and collection rules.
7. W.12 gameplay corrections.
8. W.11 Prop Hunt stability.
9. W.10 professional production discipline.
10. Non-conflicting historical directives.

======================================================================
PART A — IMPLEMENTED W.16 RUNTIME
======================================================================

## 1. HOME SCREEN
- The home screen MUST expose **Visit the Cabin** directly.
- It is present as both a major hero action and a destination-row entry.
- The action routes to `/cabin.html`.
- The cosmetics link is renamed **Cabin Shop + Cosmetics** to reflect the merged long-term collection layer.

## 2. CABIN RUNTIME
Implemented initial production architecture:
- `/cabin.html` is a real application route, not a static mockup document.
- Cabin overview uses the approved realistic dollhouse visual direction.
- Permanent named family-room targets: John, Kristen, Holly, Vanessa, Lizzie, Logan, James, Dorothy, Papa and Nana.
- New/non-core players resolve to permanent `guest:<profileId>` rooms.
- Room ownership is validated server-side on save.
- Family rooms may only initially be claimed by a profile using the matching family avatar.
- Visitors are read-only.
- Guest-book messages and live-style reactions are stored with the room.
- Room data has an offline/local fallback so the editor does not silently lose work when the server is unavailable.
- The room editor uses the locked 14x16-foot design space, 0.5-foot movement increments and 90-degree rotation.
- Room placements are validated against the authoritative W.13 room catalog before server persistence.
- Room placement also validates blueprint ownership server-side. Starter blueprints are seeded automatically; previously saved/grandfathered placements remain valid for migration safety.
- The 400-item room catalog remains authoritative data.
- Token-purchasable room blueprints use the same Game Night Token wallet as wearables through `/api/cabin/item`.
- Earned/achievement/event/secret room items cannot silently be purchased with tokens.

## 3. REALISTIC COSMETICS RUNTIME
The old W.8 emoji renderer is superseded.

Implemented requirements:
- Cosmetics render as image/SVG assets, not Unicode emoji.
- The live catalog contains **154 fitted wearable records** at W.16 launch.
- The catalog spans hats, hair accessories, eyewear, headsets, neckwear/accessories, jewelry, tops and badges.
- Approved realistic art from the W.15 visual direction is now packaged as runtime artwork instead of prompt-only reference material.
- Material/color variants preserve shading and visual depth instead of appearing as flat colored stickers.
- Equipment slots are independent so a player can combine multiple compatible categories.
- Existing W.8 unlock IDs are retained/migrated where practical so older profiles do not unnecessarily lose their purchases.
- Token-purchased items and play/event/achievement reward items are distinguished in catalog data.

## 4. AVATAR FITTING SYSTEM
A single shared fitted-cosmetic renderer is the canonical portrait renderer.

It MUST be used by:
- home/profile avatar previews;
- lobby avatars;
- card/tabletop player portraits;
- score/seat avatars that call the shared avatar renderer;
- the Cabin Shop live preview.

Fitting model:
- slot-specific anchor, X/Y position, width/scale and rotation;
- character-specific overrides for John, Kristen, Dorothy, James, Nana, Papa, Holly, Vanessa, Lizzie and Logan;
- safe generic fallback for other avatar choices;
- reduced/safe compatibility rules for dog avatars;
- per-item override capability for exceptional assets;
- portrait-variant awareness so existing hats, glasses, scarves and earrings in a chosen portrait are not double-stacked with conflicting cosmetics.

Quality rule:
> An accessory is not considered implemented merely because it appears somewhere over the photo. It must visually sit on the correct anatomical region and remain readable at card-table portrait size.

## 5. REALISTIC STORE
`/tokens-store.html` is now the merged Cabin Shop + Cosmetics runtime, not a wearables-only page.

Required behavior:
- the 400-room-item catalog and 154 fitted wearables browse through one live shop surface;
- a shared Game Night Token wallet pays for eligible room blueprints and eligible cosmetics;
- large realistic item thumbnails;
- live preview on the player's actual selected portrait for wearables;
- live realistic room preview for furniture/room items;
- search and category filters;
- rarity/source labels;
- Game Night Token pricing;
- equip/unequip state;
- reward-only items visibly explain that they are won/earned/event-unlocked instead of pretending to be purchasable;
- current equipped-slot summary;
- owned-blueprint state for room items;
- server-backed room blueprint purchasing;
- direct path into the Cabin.

## 6. ROOM ART COVERAGE — TRUTHFUL STATUS
The W.16 runtime connects all 400 room catalog records, but it does **not** falsely claim that 400 unique production 3D furniture meshes already exist.

Current visual-runtime layer:
- approved realistic Cabin aerial artwork;
- approved realistic room artwork;
- representative realistic furniture/category cards for the connected catalog;
- interactive room placement/persistence architecture.

Still required for a true fully-authored 3D release:
- unique production model/material set for all 400 room items;
- true 3D dollhouse camera and cutaway shell rather than the current high-fidelity 2.5D presentation layer;
- physical visitor avatars walking in rooms;
- authored 3D wearable meshes attached to full-body 3D characters in 3D modes.

Do not hide this distinction in release notes.

## 7. QUALITY / NON-REGRESSION GATES
Before any later phase may call Cabin/Cosmetics complete:
- no emoji cosmetic rendering may reappear;
- Visit the Cabin must remain reachable directly from Home;
- fitted wearables must remain visible in shared tabletop portraits;
- portrait variants that already contain a hat/glasses/etc. must suppress only conflicting overlay slots rather than stacking duplicate accessories;
- room saves may only be written by the owner;
- unowned room blueprints may not be injected into new room placements through a crafted client request;
- secrets/achievement cosmetics may not silently become token purchases;
- approved family base identity may never be painted over or replaced by a cosmetic;
- mobile UI remains touch-sized and readable;
- full project tests + staging validation + cold ZIP validation remain mandatory.

======================================================================
PART B — PREVIOUS MASTER CONTENT CARRIED FORWARD
======================================================================

# BLACK FAMILY GAME NIGHT
# MASTER GAME DESIGN + PRODUCTION DIRECTIVE W.15
## Realistic Cabin Rooms, Premium Cosmetics Expansion, and Home-Screen Cabin Navigation

Planning/build date: 2026-08-28
Status: **HIGHEST-PRECEDENCE CURRENT MASTER PROMPT**
Runtime release base: `GAME-NIGHT-STAGING-PHASE-W12-GAMEPLAY-CORRECTIONS-36`
Design release base: `GAME-NIGHT-DESIGN-PHASE-W13-CABIN-ROOMS-COLLECTIONS-37`
Visual target release: `GAME-NIGHT-DESIGN-PHASE-W15-REALISTIC-COSMETICS-CABIN-NAV`

W.15 supersedes W.14 anywhere wearable/avatar cosmetics, cabin-entry navigation from the home screen, or the premium presentation standard for player-facing collections are discussed. W.14 remains authoritative for realistic cabin rooms, W.13 for room-system structure and the 400-item room catalog, W.12 for gameplay corrections, W.11 for Prop Hunt stability, and approved family-character locks remain mandatory.

======================================================================
0. W.15 PRECEDENCE
======================================================================

1. Explicit current user instruction.
2. Approved family-character identity and locked family-specific rules.
3. W.15 realistic cosmetics + home-screen cabin-navigation directive.
4. W.14 realistic cabin rooms premium-visual directive.
5. W.13 cabin rooms / collections directive and 400-item room catalog.
6. W.12 gameplay corrections.
7. W.11 Prop Hunt smoothness/stability.
8. W.10 professional production framework.
9. Non-conflicting older directives.
10. Historical prototypes/obsolete implementation details.

Authoritative room catalog remains: `CABIN_ROOMS_400_ITEM_MASTER_CATALOG_W13.xlsx`.
W.15 adds the authoritative wearable/cosmetics quality bar and the home-screen access requirement for the cabin.

======================================================================
PART A — W.15 IMMEDIATE LOCKS
======================================================================

## 1. HOME SCREEN ACCESS
The home screen must include a prominent **Visit the Cabin** button/destination. This is required, not optional. Selecting it must open the cabin aerial/dollhouse view directly.

## 2. COSMETICS UPGRADE
The cosmetics package must be expanded and upgraded into a larger, more realistic 3D wearable system that looks good on all visible avatars across tabletop/card games, cabin visits, and general player-presence surfaces.

## 3. COSMETICS SCALE
Target a large wearable catalog (recommended 450+ entries) across hats, props, outfits, jackets, glasses, accessories, seasonal items, achievement rewards, and other collectible categories. This sits alongside the room/furniture catalog rather than replacing it.

## 4. QUALITY BAR
Cosmetics should look premium, collectible, and believable. Avoid flat sticker-like accessories, crude clipping, weak materials, or low-detail placeholder geometry. The approved visual direction is realistic, warm, polished, and worth showing off on the first serious pass.

## 5. CROSS-GAME PERSISTENCE
Equipped avatar cosmetics should appear consistently anywhere the avatar is visible and technically appropriate, including card/tabletop views, cabin visits, and related social surfaces.

======================================================================
PART B — W.14 CABIN ROOMS VISUAL TARGET (CARRIED FORWARD)
======================================================================

======================================================================
PART B — W.14 CABIN ROOMS VISUAL TARGET (CARRIED FORWARD)
======================================================================

This directive upgrades the W.13 cabin-room feature from a design/system specification into a premium visual-production target. The goal is that the **first serious production pass** should already look polished, warm, realistic, and worth showing off. Avoid flat placeholders, toy-like furniture, weak textures, empty prototype rooms, or cheap mobile-game clutter.

## 1. NORTH STAR VISUAL GOAL
The cabin experience should feel like a premium, cozy, high-end family lodge mixed with a polished modern casual game UI.

The user has explicitly approved a more realistic direction. The target look should therefore be:
- realistic and visually rich rather than cartoony or blocky;
- warm, inviting, premium, and family-friendly;
- pristine on first presentation;
- readable on desktop and mobile;
- decorative enough to feel aspirational, but still believable as a real cabin interior.

## 2. TARGET SPACES TO MATCH
The system must be capable of presenting three linked views at this quality level:
1. **Cabin aerial / dollhouse view** — a handsome, realistic timber lodge shown from an angled overhead cutaway view, with clearly labeled rooms and smooth room-entry navigation.
2. **Room decorator view** — a beautiful furnished room with realistic wood, textiles, rugs, lamps, wall art, and thoughtfully arranged decor.
3. **Catalog / shop view** — a premium store/catalog experience with large attractive thumbnails/cards for furniture, finishes, and decorations, instead of spreadsheet-like low-fidelity blocks.

## 3. REALISM STANDARD FOR ROOMS
Every room should feel authored, not procedurally thrown together.

Mandatory room-quality rules:
- believable room proportions and furniture scale;
- high-quality wood, fabric, leather, metal, glass, and ceramic material definition;
- soft natural lighting plus warm lamp accent lighting;
- layered decor including rugs, throws, pillows, wall art, plants, books, storage, and small personal objects;
- premium floor and wall finishes;
- tasteful clutter, not messy clutter;
- pleasing composition from the default camera angle;
- no obviously fake or blocky geometry in the primary player-facing shot.

## 4. CATALOG PRESENTATION STANDARD
The full catalog may still contain 400 items in data, but the **player-facing experience** must feel curated.

Catalog UX requirements:
- high-end visual cards/tiles with large item thumbnails;
- item card shows item image, rarity/collection marker where applicable, token price or win-source, and category;
- categories such as Beds, Seating, Storage, Tables, Lighting, Electronics, Decor, Plants, Wall Decor, Flooring, Wallpaper, Pets, Seasonal, Trophies, Structural Expansions, Bathroom, Kitchen, and Special Rewards;
- clean filtering and sorting without making the screen look sterile or spreadsheet-like;
- cozy wood-and-brass / paper-card / soft-panel visual language preferred over flat neon storefront UI;
- reward items should look desirable enough that winning them feels exciting.

## 5. CABIN ARCHITECTURE STYLE
The exterior/interior shell for the cabin and guest house should lean toward:
- large rustic timber family lodge;
- pitched rooflines;
- stone and wood accents;
- warm window glow;
- readable room cutaway volumes from above;
- clearly differentiated bedrooms and expansion sockets;
- shared social spaces that look worth visiting.

## 6. MOBILE-FIRST POLISH
The user approved easy decorating and mobile support. Therefore the realistic presentation must still remain practical on phone.

Mandatory mobile rules:
- buttons large enough for touch;
- readable room labels;
- compact side/bottom trays for placement tools;
- item thumbnails still recognizable on smaller screens;
- camera defaults that show the room attractively without constant adjustment;
- do not bury the room beneath oversized UI chrome.

## 7. ITEM ART DIRECTION
The 400-item catalog should emphasize collectible desirability.

Preferred item families include:
- cabin rustic basics;
- cozy modern lodge;
- western/farm accents;
- trophy/achievement pieces;
- TV/media setups;
- plants and natural decor;
- premium bedding and rugs;
- kids/family-friendly novelty items;
- pet-friendly furnishings;
- holiday/seasonal decor;
- expansion modules such as bathroom, kitchen nook, balcony, bunk area, reading corner, trophy wall, and mini game corner.

Each item should read clearly as one of:
- buyable with tokens;
- winnable from arcade play;
- limited/seasonal;
- achievement/unlock;
- giftable/trade-in eligible.

## 8. ANTI-PROTOTYPE RULES
Do not ship the first serious visual pass if it includes any of the following as the primary presentation:
- empty greybox rooms;
- flat placeholder rectangles standing in for furniture;
- spreadsheet-only catalog presentation;
- crude low-detail beds/dressers/plants;
- weak lighting that makes the cabin feel dead;
- unreadable room labels or cluttered aerial navigation;
- surfaces that look plastic when they should look like wood/fabric/metal.

## 9. TEST / APPROVAL GATE
Before claiming the cabin-room visuals are ready, the build should pass a simple visual gate:
- the aerial cabin view looks immediately impressive;
- at least one fully furnished room looks beautiful and believable;
- the catalog/store screen looks premium and easy to browse;
- the mobile room-decorator screen remains attractive and usable;
- screenshots from these views would be good enough to show a stakeholder without apology.

## 10. IMPLEMENTATION EXPECTATION
Yes — the intended answer to the user's question is that this look is achievable. W.14 therefore locks this realistic direction as the required target for the next production-quality pass and future prompting/build work.

======================================================================
PART C — W.13 CONTENT CARRIED FORWARD
======================================================================

The following W.13 content remains in effect unless directly superseded by the W.14 realism requirements above.

This directive defines the long-term personalization/meta-game layer for Black Family Game Night. It does **not** claim the complete 3D cabin, room editor, visitor networking or 400 authored 3D assets are already implemented. It is the authoritative production contract those systems must now follow.

---

## 1. NORTH STAR

The Cabin is the persistent memory layer above every individual game.

**Core loop:**

> Play → earn → collect → decorate → expand → visit → remember.

A successful room must eventually feel less like a generic bedroom and more like a personal museum of that player’s history in Black Family Game Night.

The system should reward three different motivations at once:

1. **Expression** — “This looks like me.”
2. **Achievement** — “I earned that.”
3. **Family history** — “I remember when we got that.”

Do not optimize the system into a sterile inventory grid. The emotional purpose is visible personal history.

---

## 2. CABIN TOPOLOGY

### Main family cabin
- One large shared **two-storey family cabin**.
- Central great room/staircase acts as the visual anchor in the aerial/dollhouse view.
- Permanent named rooms for the core family members.
- Each room label is visible from the cabin overview, e.g. `John's Room`, `Kristen's Room`.
- Tapping a room smoothly focuses/zooms into that room.
- The home screen receives a prominent **VISIT THE CABIN** destination.

### Guest house
- Every new non-core player receives a **permanent personal room** in a separate guest house.
- Guest rooms are not temporary sessions.
- The guest house expands dynamically as more people join: new rooms, then additional floor/wing capacity as required.
- Guest rooms use the same core editor, collections, expansions and visitor rules as family bedrooms.

### Starting room
- Everyone begins from the same neutral base room.
- Approximate visual scale: **14 ft × 16 ft**.
- Starting room must comfortably support a bed, dresser, TV, seating, wall items and collectibles while leaving obvious value in expansion.

### Shared spaces
The cabin may progressively unlock/customize shared spaces including:
- great room;
- games room;
- trophy hall;
- movie room;
- kitchen;
- deck/patio.

Personal rooms remain owner-controlled. Shared-space editing permissions are a later system and must not introduce a host override over private rooms.

---

## 3. AERIAL / DOLLHOUSE NAVIGATION

The target experience is a **true 3D aerial/dollhouse cabin**, not a static menu pretending to be a floor plan.

Required interaction model:
1. Home → **Visit the Cabin**.
2. Camera opens over the cabin in an angled aerial view.
3. Roof/upper shell cleanly cuts away or fades so interior rooms are readable.
4. Named room labels hover/read clearly without covering the space.
5. Tap/click a room label or room volume.
6. Camera travels smoothly into the selected room.
7. Viewer enters either `VIEW ROOM` or, for their own room, `DECORATE`.
8. Back returns to the dollhouse without a full application reload.

The aerial view must make expansion visible. If a player buys/wins a bathroom, balcony, sitting room or other structural addition, their floor plan should physically grow from the overview.

---

## 4. ROOM OWNERSHIP + VISITING

### Ownership
- Only the room owner can edit/decorate that room.
- There is **no host/admin decorate override** for another person’s room.
- Server-side room writes must validate the owner profile, not trust a hidden client button.

### Visibility
- Rooms are visible to everyone in the private family app.
- No locked/private visibility mode is required at this stage.

### Simultaneous visitors
- Multiple people may view the same room at the same time.
- Physical visitor avatars walking inside the room are **not required yet**.
- Until avatar walking is built, visitors appear as compact profile/avatar bubbles with live reactions.
- Room view includes a shared guest-book/reaction surface.

### Guest book
Support short room reactions/messages such as:
- heart;
- laugh;
- wow;
- cozy;
- “love this room”;
- short free-form family message.

Use basic spam/rate limits even though the app is private.

---

## 5. DOGS

Kelsi, Molly and Gunner do **not** receive bedrooms.

Instead:
- dog beds, bowls, toys and themed decor may be placed throughout family rooms and shared spaces;
- dogs eventually wander between valid rooms/common spaces;
- pet furniture can become wander/rest/interest targets;
- the dog system must preserve each dog’s established visual personality;
- no dog item should imply that the dog permanently belongs only to the room owner unless explicitly designed that way.

---

## 6. DECORATOR UX

The room editor should be easy enough for a phone user who has never used a 3D editor.

### Camera
Use an **easy decorating camera**, not avatar walking.
- orbit/pan around room;
- pinch/scroll zoom;
- reset view;
- optional wall-focused camera when placing wall items.

### Placement model
Use a **hybrid free-placement system**:
- player drags furniture freely;
- gentle underlying grid/snap helps alignment;
- snap to compatible walls, floor, ceiling and tabletop/shelf surfaces;
- allow deliberately imperfect placement when still valid;
- prevent impossible overlap, outside-room placement and blocked architectural openings.

### Rotation
- Furniture rotates in **90-degree steps**.
- Preview rotated footprint before commit.

### Item footprints
Items have actual size metadata, not one universal square.
Examples:
- small decor: 1 × 1 or tabletop anchor;
- dresser: 2 × 1;
- bed: 2 × 3;
- rug: 2 × 2 or larger;
- sectional/showpiece: multi-cell footprint;
- wallpaper/flooring: room-surface application;
- architecture: expansion socket rather than furniture footprint.

### Wall layers
Wallpaper is a room finish and must not occupy the same placement slot as wall decor.
Allow:
- wallpaper;
- multiple frames;
- plaques;
- shelves;
- mirrors;
- wall TVs;
- signs;
- trophies;
on the same wall when their anchor rectangles do not overlap.

### No saved layout presets yet
Do not build multiple named room-layout save slots in the first release. One persistent current layout per room is enough.

### Undo safety
Before production release, decorator should support at least:
- undo recent placement/move/delete;
- cancel preview;
- reset selected item to last valid position;
- safe recovery if an old save references a removed/deprecated item.

---

## 7. CUSTOMIZABLE ROOM SURFACES + ARCHITECTURE

Players can eventually customize:
- furniture;
- wallpaper;
- wall color/finish;
- flooring;
- ceiling finish;
- trim;
- lighting fixtures;
- windows;
- doors;
- architecture/expansion pieces;
- room ambience/time-of-day preset.

Architecture should grow through explicit expansion sockets rather than arbitrary structural mesh editing on phone.

Initial expansion examples and starting target costs:
- closet/storage nook: **300 Game Night Tokens**;
- bathroom: **600**;
- gaming nook: **700**;
- balcony/deck: **900**;
- sitting room: **1,050**;
- kitchenette: **1,200**.

Major achievements may award an expansion directly instead of requiring purchase.

---

## 8. UNIVERSAL CURRENCY — GAME NIGHT TOKENS

Rename the long-term universal reward currency from **Arcade Tokens** to **Game Night Tokens**.

Game Night Tokens may eventually be earned from:
- arcade games;
- card games;
- board/table games;
- Prop Hunt;
- Family Island Life;
- birthday events;
- daily/weekly family challenges;
- achievements;
- duplicate item salvage.

There is **one currency**, not a maze of room coins, arcade coins and furniture credits.

### Starting earn pace
Initial economy target:
- meaningful completed arcade round: **+5**;
- win/complete objective: **+10 additional**;
- first eligible game of the day: **+10**;
- play 3 different eligible games: **+20 daily**;
- daily challenge: **+20–40** depending on difficulty, nominal target 30;
- milestone/achievement: **+25–100**;
- duplicate reward salvage: typically **25%** of equivalent token value.

Do not award completion tokens for instantly entering/quitting a game. “Completed round” requires a meaningful gameplay completion signal per game.

### Purchase pace
- basic decor: **10–50** tokens;
- mid-tier furniture: **75–200**;
- major showpiece: **250–750**;
- structural expansions: roughly **250–1,400**.

Goal: a casual player can normally choose a small/basic purchase after roughly one or two games, while showpieces and expansions remain visible medium/long-term goals.

---

## 9. BLUEPRINT OWNERSHIP, DUPLICATES, SALVAGE + GIFTS

The unlock object is a **blueprint**, not a consumable chair.

### Blueprint rule
Once an item is unlocked:
- it is permanently known by that profile;
- the owner may place unlimited copies in their room, subject to room performance/item-count limits;
- placing or deleting an instance never destroys the blueprint.

### Duplicate reward rule
Because a blueprint is permanent, duplicate drops must not create infinite money.
- duplicate reward copies may be salvaged once for a controlled token amount;
- default salvage target: **25% of equivalent token value**;
- salvage does not remove the already-owned blueprint.

### Gifts
- regular purchasable items can be purchased as gifts;
- regular arcade reward items may be giftable where specified;
- giving a gift does not remove the giver’s already-owned blueprint;
- gift is a new unlock for the receiver;
- gifts appear wrapped and require an `OPEN GIFT` moment;
- gift may contain sender name and short free-form family note.

### Non-giftable prestige
Performance/status items remain account-earned:
- top mastery trophies;
- perfect-run trophies;
- birthday heirlooms tied to that person/year;
- collection mastery trophies;
- secret long-term status objects.

A trophy should continue to mean the room owner did the thing described on the plaque.

---

## 10. RARITY SYSTEM

Use these five tiers:
1. **Common**
2. **Uncommon**
3. **Rare**
4. **Epic**
5. **Family Legendary**

Rarity affects presentation and collection value, not gameplay power.

### Visual treatment
- Common: normal presentation.
- Uncommon: subtle catalog accent.
- Rare: refined trim/accent.
- Epic: gentle sparkle/emissive detail where appropriate.
- Family Legendary: special plaque/aura/animation, but tasteful.

Do not turn every rare room into a flashing casino. The cabin should remain warm and believable.

---

## 11. 400-ITEM LAUNCH CATALOG

Authoritative catalog files:
- `CABIN_ROOMS_400_ITEM_MASTER_CATALOG_W13.xlsx`
- `CABIN_ROOM_ITEM_CATALOG_W13.json`
- `public/cabin-room-catalog.mjs`

Locked distribution:
- **175** Buy with Game Night Tokens;
- **144** individual arcade-game rewards;
- **6** cross-arcade achievement rewards;
- **35** seasonal/birthday rewards;
- **20** collection-completion rewards;
- **20** secret/prestige items;
- **400 total**.

Every one of the 16 active arcade games receives **9 distinct room rewards**, satisfying the 8–15 reward target while keeping launch scope controlled.

Catalog categories include:
- Beds;
- Seating;
- Tables;
- Storage;
- Electronics;
- Lighting;
- Rugs;
- Wall Decor;
- Plants;
- Toys & Hobbies;
- Games;
- Pet Items;
- Decorations;
- Wallpaper;
- Flooring;
- Windows & Doors;
- Ceiling & Trim;
- Special Effects;
- Collectibles;
- Architecture.

Each catalog item must carry build metadata such as:
- stable item ID;
- category/subcategory;
- collection;
- rarity;
- source type;
- source game;
- visible unlock text;
- internal unlock condition;
- purchase/equivalent value;
- salvage rate/value;
- gifting policy;
- account-earned policy;
- secret flag;
- footprint;
- placement surface;
- valid room types;
- rotation behavior;
- style tags;
- animation/VFX hooks;
- audio/ambience hooks;
- future interaction;
- collection set;
- 3D production notes.

Do not collapse this metadata into item names or hard-code rules throughout UI files. The catalog becomes data-driven.

---

## 12. THEMED + FAMILY-SIGNATURE COLLECTIONS

Support coordinated room styles while allowing free mixing.

Launch-facing style families include:
- Everyday Basics;
- Rustic Cabin;
- Modern Lodge;
- Farmhouse;
- Glam Suite;
- Gamer Den;
- Western Lodge;
- Princess & Dance;
- Industrial Shop;
- Retro Game Night;
- Cozy Grandma;
- Outdoors & Fishing;
- Construction Crew;
- Garden Cottage;
- seasonal/event sets;
- arcade reward sets.

Family-signature pieces should appear naturally throughout these sets and reward tracks, including recognizable themes for John, Kristen, Holly, Vanessa, Lizzie, Logan, James, Dorothy, Papa and Nana.

Players may mix sets. Never require the entire room to be one theme.

---

## 13. ARCADE ROOM REWARD TRACKS

Every active arcade game has a nine-piece room-reward track following this design ladder:
1. first clear / first meaningful completion;
2. 5 wins/clears;
3. 10 wins/clears;
4. perfect score or designated high-skill objective;
5. hard-mode/difficult-level milestone;
6. game-specific daily challenge;
7. mastery milestone;
8. game-specific TV channel;
9. long-term Family Legendary trophy.

Active launch tracks:
- Papa's Paddle Battle;
- Gunner's Goat Run;
- John's Shop Bomber;
- James's Lumber Stack;
- Dorothy's Garden Merge;
- Logan's Trail Logic;
- Nana's Goat Whack;
- Holly's Memory Mayhem;
- Lizzie's Dramatic Lights;
- Vanessa's Pipe Problem;
- Molly's Light Chase;
- Gunner's Snack Attack;
- Cabin Breakout;
- Kelsi's Rock 'n' Roll Rescue;
- Campfire Rocket;
- Neon Snake.

The exact item names and conditions live in the W.13 catalog.

Room rewards should visually reuse original Black Family Game Night motifs from those games, not external branded assets.

---

## 14. STORE UX

Keep **one store**, not separate Avatar Shop and Cabin Shop destinations.

Recommended top-level tabs:
- Avatar;
- Furniture;
- Walls & Floors;
- Decorations;
- Specials.

### Required item card states
Every item shows its source classification:
- Buy with Game Night Tokens;
- Win in Game;
- Achievement Reward;
- Birthday / Seasonal Reward;
- Collection Completion Reward;
- Secret.

### Preview
Before purchasing a room item:
- show the item in a miniature/live preview of the player's **actual current room**;
- allow 90° rotation preview where relevant;
- show footprint/surface compatibility;
- preview must not mutate the saved room until confirmed.

### Secret presentation
Before discovery:
- item art/name may appear as `???` / silhouette;
- unlock condition also displays `???`;
- internal condition remains server/catalog data only.

---

## 15. COLLECTION BOOK

Create a persistent collection book/catalog that shows:
- discovered items;
- owned blueprints;
- missing visible items;
- secret question-mark entries;
- collection progress;
- source/unlock route;
- rarity;
- set completion reward.

Completing defined collections unlocks dedicated bonus pieces. W.13 defines 20 launch completion rewards.

The collection book should make progress legible without making the main room editor feel like a spreadsheet.

---

## 16. TROPHIES + FAMILY MEMORY OBJECTS

Room items can preserve actual history.

Support:
- trophy cabinets;
- achievement plaques;
- game trophies;
- birthday heirlooms;
- family photographs;
- framed game screenshots/art;
- customizable text signs/plaques;
- dated/year-stamped memory objects;
- long-term time-capsule pieces.

### Inspect behavior
Visitors should eventually be able to tap an earned trophy/memory and see:
- item name;
- who earned it;
- what was done;
- game/event;
- date/year where meaningful.

### Photos
The system may eventually support user-uploaded family photos for approved room frames in addition to game-generated images/screenshots.

Because uploaded images are user content, store only references/approved derivatives needed by the private app and do not silently publish them elsewhere.

### Custom text
Free-form text is permitted because this is a private family app. Apply practical length limits and safe rendering/escaping.

---

## 17. TV CHANNELS, ARCADE MACHINES + AMBIENCE

### TVs
TVs may support unlockable channels such as:
- Prop Hunt highlight reel/screen saver;
- Logan dirt-bike channel;
- fireplace channel;
- family-photo slideshow;
- classic game screensavers;
- weather-style cabin screen;
- per-arcade game channels from reward tracks.

Channels should default muted and never auto-blast audio when opening a room.

### Arcade machines
Room arcade machines may later launch the relevant mini-game directly.

### Ambience packs
Collectible room ambience may include:
- daytime;
- sunset;
- night;
- fireplace glow;
- rain at window;
- snow;
- fireflies;
- seasonal lighting;
- music/soundscape packs.

Audio and lighting settings are part of the saved room environment, not separate avatar settings.

---

## 18. SEASONAL + BIRTHDAY HISTORY

Seasonal collections may include:
- Christmas;
- Halloween;
- spring/Easter;
- summer camping;
- winter/New Year;
- birthdays.

Birthday events should produce limited yearly room items/heirlooms.

Once earned:
- the birthday item remains permanent;
- preserve relevant person/year/event metadata;
- older birthday rewards become part of the family's visible history rather than disappearing when the event ends.

W.13 includes personalized birthday heirloom slots for John, Kristen, Holly, Vanessa, Lizzie, Logan, James, Dorothy, Papa and Nana.

---

## 19. SECRETS + PRESTIGE

W.13 contains 20 launch secret/prestige pieces.

Player-facing rule:
- undiscovered item = `???`;
- undiscovered condition = `???`.

The internal catalog may store the real condition for development/testing.

Secret items should reward unusual exploration, mastery, long-term family participation or funny family-specific achievements. They should not depend on gambling, paid random loot or real-money purchases.

Prestige can be ridiculous in a warm family-game way. W.13 deliberately reserves pieces such as:
- Family Legendary Golden Toilet;
- indoor hot tub;
- giant wall aquarium;
- hidden bookcase door;
- meteor shower skylight;
- Family Time Capsule;
- Cabin Founder's Grandfather Clock.

---

## 20. PERFORMANCE + TECHNICAL BUDGET

A 400-item catalog does **not** mean 400 meshes are loaded in every room.

### Loading
- Load current room + necessary cabin shell only.
- Lazy-load catalog thumbnails and 3D assets.
- Stream/instantiate placed room assets from stable item IDs.
- Dispose assets after leaving room when not shared elsewhere.

### Repetition
Repeated identical items should share:
- geometry;
- materials/textures;
- LOD data;
- instanced rendering where appropriate.

### LOD
Large/animated furniture gets purposeful LODs. Small tabletop items may use simpler distance culling rather than multiple unnecessary meshes.

### Room item count
Set a conservative launch per-room placed-instance budget after actual phone profiling. Do not choose the number from desktop testing alone.

The editor should warn before a room reaches the tested safe budget, not simply allow infinite placement until the browser crashes.

### Thumbnail/catalog performance
The 400-item store and Collection Book use lazy virtualized lists/grids on phone. Do not build 400 heavy DOM/3D previews simultaneously.

---

## 21. PERSISTENCE + DATA MODEL

Recommended room profile state:
- `roomOwnerProfileId`;
- room version/schema;
- room type/main cabin vs guest house;
- base-room style;
- unlocked expansions;
- wall/floor/ceiling/trim finishes;
- lighting/ambience preset;
- array of placed item instances;
- each instance references stable catalog `itemId` plus transform/anchor metadata;
- guest-book entries;
- reactions summary;
- last edited timestamp.

Recommended collection profile state:
- Game Night Token balance;
- unlocked blueprints;
- duplicate/reward inventory eligible for salvage where required;
- gifted/unopened gifts;
- collection progress;
- achievement metadata;
- birthday/event metadata;
- discovered secret IDs.

### Save migration
Never tie the save permanently to a particular mesh filename.
Stable `itemId` resolves through the current catalog so art can be upgraded without destroying room layouts.

---

## 22. MULTIPLAYER AUTHORITY + CONCURRENCY

Server remains authoritative for:
- token balance;
- purchase/unlock;
- gift transfer/unlock;
- duplicate salvage;
- room ownership;
- placed-layout writes;
- expansion ownership;
- achievement/trophy ownership;
- secret discovery;
- guest-book posts.

Visitors are read-only for furniture state.

If owner is editing while others are viewing:
- visitors receive room revision updates;
- avoid full room reload for each placement;
- send compact item add/move/remove/finish patches where practical;
- version room writes to avoid stale overwrites.

---

## 23. PROFESSIONAL PRODUCTION SEQUENCE

Do not attempt to author 400 final 3D objects before proving the system.

### Gate A — data + economy
- W.13 catalog authoritative and validated;
- Game Night Tokens schema;
- blueprint ownership;
- gift/salvage rules;
- catalog/collection APIs.

### Gate B — one room vertical slice
- one 14 × 16 room;
- owner-only editing;
- free placement + gentle snap;
- 90° rotation;
- floor/wall/surface anchors;
- save/reload;
- 20–30 representative items;
- phone performance proof.

### Gate C — cabin dollhouse
- two-storey cabin shell;
- room labels;
- tap-to-focus navigation;
- one real room per core family profile;
- dynamic guest-house foundation.

### Gate D — social visiting
- room viewer;
- simultaneous visitor presence bubbles;
- reactions;
- guest book;
- read-only enforcement.

### Gate E — progression integration
- Game Night Token earning from games;
- 16 arcade reward tracks;
- achievements;
- gifts;
- collection book;
- TV channels/trophies.

### Gate F — content scale
- author/finalize the full 400 launch-item library;
- LOD/material/thumbnail pass;
- season/birthday content;
- secrets;
- shared spaces;
- room expansions.

Do not let item quantity outrun editor usability or mobile performance.

---

## 24. DEFINITION OF DONE FOR FIRST PLAYABLE CABIN RELEASE

The first real Cabin Rooms runtime is not “done” because a room page opens.

It must prove on an actual phone:
- Visit the Cabin entry from home;
- cabin overview loads without blocking the rest of the app;
- room labels are readable/tappable;
- player can enter own room;
- player can drag, rotate, place and remove furniture reliably;
- invalid overlaps are rejected cleanly;
- wallpaper/flooring and wall items are independent layers;
- layout persists after reload/reconnect;
- visitor can enter but cannot edit;
- another visitor can appear simultaneously;
- reactions/guest book work;
- Game Night Token purchase changes authoritative balance once;
- blueprint remains permanently available after placement/deletion;
- a gift unlocks for the receiver without consuming giver blueprint;
- duplicate salvage cannot be exploited repeatedly;
- secret conditions are not leaked by client-facing UI;
- room remains within agreed mobile frame-time/memory budget.

---

## 25. RESEARCH PRINCIPLES USED

W.13 deliberately borrows **design principles**, not copyrighted art/assets, from successful housing/decorating systems:

- Palia publicly describes home expansion, themed furniture, visiting other homes, and a snap-to-grid option that can be toggled to freeform placement:
  https://palia.com/news/gpfl-highlights
- Palia's customization notes emphasize housing as player expression, mix-and-match themed sets, room sizes/add-ons and inspiration through visiting other homes:
  https://support.palia.com/hc/en-us/articles/7474242903444-Customization
- Nintendo's Animal Crossing materials describe collecting/purchasing/gifting furniture, wallpaper/flooring/lighting and visiting others, reinforcing the value of multiple acquisition paths and social display:
  https://www.nintendo.com/en-ca/store/products/animal-crossing-new-horizons-switch/
- Happy Home Paradise emphasizes easy redecorating, lighting/soundscapes and sharing/visiting designs:
  https://www.nintendo.com/en-ca/store/products/animal-crossing-new-horizons-happy-home-paradise-70050000030669-switch/
- Palia's housing performance notes explicitly pair decor-limit increases with performance optimization and headroom, reinforcing the W.13 rule that content scale must remain inside measured mobile budgets:
  https://palia.com/news/patch-191

These references are inspiration for product/UX patterns only. All Black Family Game Night names, room assets, UI, furniture art and reward designs must remain original/project-specific.

======================================================================
PART B — INHERITED W.12 GAMEPLAY DIRECTIVE
======================================================================

The complete W.12 master prompt follows for continuity. W.13 supersedes only the cabin/token/meta-game topics explicitly changed above.

# BLACK FAMILY GAME NIGHT
# MASTER GAME DESIGN + PRODUCTION DIRECTIVE W.12
## Gameplay correction release: Blackgammon, Prop Hunt controls, Mexican Train table state, Last Haven hand visibility, Deck Sweep progression and Prairie Pots scoring clarity

Planning/build date: 2026-08-28
Status: **HIGHEST-PRECEDENCE CURRENT MASTER PROMPT**
Runtime release: `GAME-NIGHT-STAGING-PHASE-W12-GAMEPLAY-CORRECTIONS-36`
Design release: `GAME-NIGHT-DESIGN-PHASE-W12-GAMEPLAY-CORRECTIONS-36`
Supersedes: W.11 wherever this W.12 section explicitly changes gameplay, controls, naming or table UX.
Preserves: W.11 Prop Hunt smoothness/stability architecture, W.10 professional production framework, approved character identity, W.8 tutorial/token systems, all locked rules not explicitly changed below.

======================================================================
0. W.12 PRECEDENCE + RELEASE OBJECTIVE
======================================================================

This is the canonical next-build prompt.

Current precedence:
1. Explicit current user instruction.
2. Approved family turnaround identity and locked family-specific rules.
3. This W.12 correction section and `MASTER_PHASE_W12_GAMEPLAY_CORRECTIONS_DIRECTIVE.md`.
4. W.11 stability requirements.
5. W.10 professional game-design framework.
6. Non-conflicting W.9/W.8/W.7 and older directives.
7. Historical prototypes and obsolete implementation details.

W.12 is a **playability correction release**. A game that visually launches but cannot complete its core turn loop is not considered playable. Each repaired game must expose enough state on screen for a player to understand what can be done next without guessing.

======================================================================
1. BLACKGAMMON — ONE-WORD NAME + GUARANTEED CHECKER MOVEMENT
======================================================================

### Naming lock
- The current product name is **Blackgammon**, one word.
- Standard Backgammon remains a separate game.
- Current shelf labels, current help/tutorial copy, current rules title and current win/error messages should use `Blackgammon`.
- Historical phase reports may retain the old two-word spelling as history.

### Core failure being corrected
Players could roll/allocate dice but then the phone UI could make checker movement effectively inaccessible.

### Required interaction contract
- After rolling and allocation, legal `blackMove` actions must always remain actionable.
- Board-first direct manipulation remains the preferred path: select die/token, select checker/bar source, select legal destination.
- Add a **direct legal-move fallback** below/beside the board. Every legal move can be executed from a readable button even if a checker stack is difficult to tap.
- When only one playable die token exists, it may be preselected to remove unnecessary taps.
- Legal destinations remain visually highlighted.
- Illegal checker taps must not consume the turn or dice.
- After every move, refresh the state immediately and expose remaining legal moves until the assigned dice are exhausted.
- Bar entry, bearing off, forward/backward sets, rescue and transfer rules remain unchanged.

### W.12 acceptance gate
A phone player must be able to start a Blackgammon game, roll, allocate, execute at least two successive checker moves and continue the round without needing precision taps on overlapping checkers.

======================================================================
2. FAMILY PROP HUNT — SPEED, CONTROL DIRECTION, HANDS + WEAPON
======================================================================

W.11 remains authoritative for fixed-step simulation, interpolation, camera hysteresis, collision ownership, recovery, pooling and frame pacing. W.12 changes the **control feel and weapon presentation** only.

### Movement tuning
- Increase Prop Hunt walk speed modestly from the W.11 value so traversal feels lively rather than sluggish.
- Current baseline: walk approximately 3.15 m/s, sprint approximately 5.35 m/s, with responsive acceleration/braking.
- Do not trade stability for speed. W.11 fixed simulation and collision behavior remain mandatory.

### Controller direction
- Fix the reported backwards mobile controller behavior.
- Pushing the left joystick upward must move the player forward relative to the current camera view.
- Pulling down moves backward; left/right strafe left/right relative to camera.
- Desktop WASD remains camera-relative and intuitive.
- Validate on a real touch device with camera yaw changed to at least 0°, 90°, 180° and 270°.

### Hands and Prop Zapper presentation
- Hunter hands and gun must appear **in front of the torso**, not behind the character.
- Right hand remains trigger hand; left hand supports the front grip.
- The procedural fallback rig must use the same forward-axis convention as approved authored rigs.
- Do not fix this with a camera trick that leaves the actual rig backwards.
- The gun must remain visible in normal shoulder gameplay, sprint-to-aim transitions and while firing.
- Muzzle, tracer and impact continue to align with W.11/W.7 shot-validation rules.

### W.12 acceptance gate
On phone: push joystick forward, run toward the center of the view, rotate camera, repeat; hands and gun remain visibly forward; fire at a wall and see aligned muzzle/tracer/impact.

======================================================================
3. MEXICAN TRAIN — FLIPPABLE DOMINOES + COMPLETE TABLE READABILITY
======================================================================

### Domino orientation
- A domino may be played using either end when either end legally matches.
- Provide an explicit **Flip** control on held dominoes so the player can inspect/rearrange the tile end-for-end before choosing it.
- Flip is presentation/orientation state only; server legality continues to validate either matching end and canonicalize placement.

### Full train visibility
The central play surface must show, at the same time:
- the engine;
- the community **Family Train / Mexican Train**;
- every player's personal train/run;
- each train's open end;
- whether each personal train is private or open;
- the visible avatar/open marker when a train becomes available to others;
- unresolved-double state where applicable.

A player should be able to look at the board and answer: **Where can I legally play right now?** without opening another menu.

### Held dominoes
- All of the viewer's held dominoes remain reachable/visible in the rack.
- Rack order can be rearranged on phone and desktop.
- Flipping a rack tile must not lose its identity or corrupt drag/reorder state.

### Score sheet
- The score sheet must live **outside the board play area**, in the side panel on wide screens and below the board on narrow/mobile layouts.
- It must not cover trains or shrink the usable train board.
- Show per-round scores and total; lowest total wins.

### W.12 acceptance gate
A player can visually inspect all personal trains + community line, flip any held tile, identify an open opponent train, select it as a legal destination when rules allow, and read the score without obscuring the board.

======================================================================
4. LAST HAVEN — SHOW THE PLAYER'S HAND / SUPPLY INVENTORY
======================================================================

The planning fantasy requires seeing what you own before deciding whether to build, play or trade.

### Required hand dock
Always expose the viewer's usable private inventory in a dedicated hand/supply area:
- Timber count;
- Scrap count;
- Food count;
- Fuel count;
- Medicine count;
- held Survival cards.

### UX rules
- Label it clearly as the player's supply hand/inventory.
- It remains visible during the main playing phase and trade/build decisions.
- Resource counts must update immediately after a trade, build, gain or spend.
- Do not reveal another player's private held cards/resources unless that game rule explicitly makes them public.

======================================================================
5. DECK SWEEP — RANK SORTING + SPECIAL TEN + SLOT-BY-SLOT TABLE FLOW
======================================================================

### Sorting
- Deck Sweep hands sort **by rank/number first**, not by suit.
- Suit is only a secondary tie-breaker for cards of the same rank.
- Keep rank order stable/predictable throughout the turn.

### Special 10 readability
- Rank 10 is a special Sweep card and must have a persistent visual highlight/reminder.
- Highlight 10s in the player's hand and visible table cards without making other legal-card highlights ambiguous.
- Include a nearby `10 = SPECIAL SWEEP CARD` reminder.

### Table-card progression, locked rule correction
Each player has four table columns/slots:
- one face-up card above;
- one face-down card beneath.

After the player's hand is exhausted:
1. Any legal face-up table card may be played.
2. When the face-up card from a **specific slot** is played, the face-down card under that slot becomes available on a later turn.
3. Other face-up cards do **not** have to be cleared first.
4. A face-down card cannot be played while its own face-up covering card remains.
5. Playing a face-down card is blind; resolve it according to Deck Sweep rules.

### Opponent readability
For every opponent, render the four table slots so the viewer can see:
- which face-up cards remain and their faces;
- which slots have cleared their face-up card;
- whether a face-down card remains under each slot;
- how many cards remain in the opponent's hand.

Never reveal the identities of face-down cards before they are legally turned/played.

### W.12 acceptance gate
With other face-up cards still present, clear one face-up slot and successfully play that slot's face-down card on a later turn. The same state is visually understandable for opponents.

======================================================================
6. PRAIRIE POTS — PROGRESSION + CHIP AWARD CLARITY
======================================================================

### Core goal
Prairie Pots must complete its playable sequence and make earned chip/pot progress unmistakable.

### Required scoring feedback
- Every pot award immediately transfers chips into the winning player's chip total.
- Public state exposes current chip totals.
- Public state exposes the most recent pot award: player, amount and pot(s) claimed.
- Board displays a clear current-status/win message such as `Player claimed 7 chips from the pots!`.
- Display current chip totals near/below the pot board.
- Claimed pots visibly change to claimed/empty state.
- Poker pot resolution remains visible at round start.
- Prairie Pot end-of-round settlement and carryover remain governed by existing locked rules.

### Progression safety
- At every sequence turn, the current player must either have a legal advertised action or the engine must advance according to the house sequence rules.
- A round may not silently stall with no actionable card and no explanation.
- `Continue` between rounds remains explicit and all-player synchronized.
- Final winner is determined by the locked Prairie Pots chip rule after configured rounds.

### W.12 acceptance gate
A test can force a known special pot card, play it, verify the pot empties, verify the player's chip total increases by the pot value, and verify the public/UI state reports the award.

======================================================================
7. CROSS-GAME PROFESSIONAL UX REQUIREMENTS
======================================================================

For every W.12 repair:
- legal action must be visible, not merely present in server JSON;
- critical public state belongs on the play surface or adjacent sidebar, not hidden behind debug/UI menus;
- mobile touch targets must remain comfortable and non-overlapping;
- player-private information stays private, while public table information is deliberately visible;
- server remains authoritative for legal moves; visual flipping/reordering cannot bypass rules;
- reconnect must reconstruct the same visible board state;
- do not regress W.8 HOW TO tutorial access;
- no W.12 correction may break W.11 Prop Hunt frame-pacing/recovery architecture.

======================================================================
8. W.12 DEFINITION OF DONE
======================================================================

A W.12 release candidate is not done until:
- Blackgammon can roll **and move** on phone using either board manipulation or the direct fallback;
- Prop Hunt mobile forward input actually moves forward relative to the camera and hunter hands/gun are visibly in front;
- Mexican Train shows every train + community train, supports rack flipping/reordering and keeps score off the board;
- Last Haven exposes the player's usable supply/survival hand;
- Deck Sweep sorts by rank, identifies 10s, supports per-slot face-down unlocking and shows opponent table-state without leaking hidden cards;
- Prairie Pots proves a pot award changes chips and communicates the award;
- automated regression suite passes;
- staging validator passes;
- the exact shipped ZIP passes archive integrity + cold-extraction regression checks;
- real-device visual/touch QA remains required for Prop Hunt and dense table layouts.

======================================================================
9. IMPLEMENTATION STATUS IN THIS W.12 RUNTIME
======================================================================

Implemented in code for this candidate:
- one-word Blackgammon name and direct legal-move fallback;
- modest Prop Hunt speed increase, corrected mobile joystick direction transform, forward weapon/hand placement;
- Mexican Train tile flip UI, retained rack rearrangement, all personal/community trains visible, score sheet moved to sidebar/below layout;
- Last Haven supply/survival hand dock;
- Deck Sweep rank-first sorting, 10 highlight, per-slot face-down unlock, all-player table stations;
- Prairie Pots chip totals, last-award state and explicit board progression/win feedback.

Still requires actual-device confirmation:
- Prop Hunt direction/weapon presentation under real touch/camera conditions;
- dense Mexican Train and Deck Sweep layouts at target phone sizes;
- Blackgammon overlapping-checker touch comfort in an actual full game.

======================================================================
10. W.11 + EARLIER CANON CONTINUES BELOW
======================================================================

Everything below remains active unless it conflicts with W.12 above.

# BLACK FAMILY GAME NIGHT
# MASTER GAME DESIGN + PRODUCTION DIRECTIVE W.11
## Professional flagship-stability implementation, mobile frame-pacing, Prop Hunt controller/camera/collision ownership, character fidelity and whole-app production standards

Planning/build date: 2026-08-27
Status: **HIGHEST-PRECEDENCE CURRENT MASTER PROMPT**
Runtime release: `GAME-NIGHT-STAGING-PHASE-W11-PROP-HUNT-SMOOTHNESS-STABILITY-35`
Design release: `GAME-NIGHT-DESIGN-PHASE-W11-PROP-HUNT-SMOOTHNESS-STABILITY-35`
Supersedes for current production decisions: W.10 where this W.11 section explicitly changes stability/runtime requirements
Preserves: approved family turnarounds, locked game rules, W.10 professional design framework, W.8 arcade/token systems, W.7 combat readability, W.6 gameplay corrections and all non-conflicting earlier work

======================================================================
0. W.11 EXECUTIVE PRODUCTION ORDER
======================================================================

This is now the canonical master prompt for Black Family Game Night.

The immediate flagship objective is **not additional Prop Hunt content**. It is to make the existing John + Papa's Shop slice feel stable, smooth and trustworthy on a real phone.

Use this precedence for current development:
1. Explicit current user instructions.
2. Approved character turnaround identity and locked family rules.
3. This W.11 master prompt and its dedicated W.11 stability directive.
4. W.10 professional design framework embedded below.
5. W.9 character/control quality requirements.
6. W.8/W.7/W.6 and other phase directives when non-conflicting.
7. Historical prototypes, obsolete assets and old generated references.

**Shipping rule:** a working feature is not a finished feature if ordinary play produces camera collapse, collision sticking, transform embedding, visible interpolation jitter, frame-time spikes, stale mobile input or browser-resume failure.

The W.11 runtime implementation and the remaining asset-dependent/future tasks are explicitly separated below so documentation never pretends that an authored LOD, baked-lighting or full prediction system exists before it is actually built and measured.

======================================================================
1. W.11 PROP HUNT SMOOTHNESS + STABILITY CANON
======================================================================

## 1. WHY THIS PHASE EXISTS

Prop Hunt is not allowed to grow through additional maps, characters, effects or feature count while the moment-to-moment 3D experience still feels unstable.

The current quality target is not merely "the feature works." The target is:

> **The feature works continuously, predictably and smoothly on a real phone without camera collapse, collision sticking, visible jitter, frame spikes, control loss or transform corruption.**

W.11 is therefore a systems-health phase. New content is intentionally secondary to controller, camera, collision, animation handoff, frame pacing, networking presentation and recovery.

### W.11 hard scope rule

Until the W.11 gate passes:
- do not add another Prop Hunt map;
- do not propagate unfinished John controller/rig behavior to the whole family;
- do not add expensive decorative clutter solely for visual density;
- do not add new particle-heavy combat effects;
- do not call an automated test pass proof of smoothness.

Papa's Shop + approved John remain the benchmark slice.

---

## 2. SOURCE-OF-TRUTH PRECEDENCE

For Prop Hunt stability work, use this order:

1. Current explicit user instruction.
2. Approved character turnarounds and `MASTER_APPROVED_FAMILY_CHARACTER_DIRECTIVE.md`.
3. Locked Prop Hunt gameplay rules.
4. This W.11 stability directive.
5. `MASTER_GAME_DESIGN_PRODUCTION_PROMPT_W11.md`.
6. W.10 professional design directive.
7. W.9 character/detail/control directive.
8. W.7 character/combat directive.
9. Older architecture notes and historical prototypes.

If an old requirement demands a visually elaborate technique that destabilizes mobile play, W.11 wins unless that old requirement is itself a locked game rule or approved identity requirement.

---

# PART I — SIMULATION OWNERSHIP

## 3. ONE AUTHORITATIVE PLAYER BODY

The player capsule/body is the source of truth for gameplay position.

Rules:
- physics/controller simulation owns `x/y/z`, grounded state and collision;
- the render rig follows the simulation state;
- animation does not independently drag the collision body through the world;
- uncontrolled root motion is prohibited;
- if a future authored animation uses root motion, it must be an explicit bounded state such as a validated mantle and must reconcile back to the authoritative capsule cleanly;
- camera code never directly moves the player except an explicit recovery command;
- visual recoil never modifies gameplay position;
- foot IK never modifies gameplay collision.

This ownership model prevents movement, animation, camera correction and collision correction from fighting each other.

## 4. FIXED GAMEPLAY TIMESTEP

Target simulation cadence: **60 Hz**, step `1/60 s`.

Requirements:
- render rate may vary independently;
- long browser frames are clamped before entering simulation;
- use a maximum catch-up step count so one stall cannot trigger a spiral of death;
- excess accumulated simulation time may be dropped and measured rather than executing dozens of delayed physics steps;
- background/resume must reset the accumulator;
- gameplay timing such as jump buffer, coyote time, collision and bot movement uses fixed-step time;
- presentation effects may use render delta time where appropriate.

Fallback philosophy: a phone that renders 35–45 FPS should still receive stable 60 Hz movement semantics rather than moving farther on slow frames.

## 5. RENDER INTERPOLATION

Maintain previous and current fixed-simulation transforms.

Render at:

`renderTransform = interpolate(previousSimulation, currentSimulation, alpha)`

Apply to:
- local character rig;
- host-simulated bots;
- body yaw;
- appropriate deterministic world movers.

Do not interpolate intentional teleports, round respawns or explicit stuck recovery across the entire map. Snap those safely and reset interpolation history.

---

# PART II — MOVEMENT + COLLISION

## 6. MOVEMENT RESPONSE

The controller should feel responsive but not twitchy.

Baseline targets:
- virtual-stick dead zone: approximately 8–12%;
- analog magnitude controls walking speed;
- acceleration is responsive rather than instant when useful for readability;
- braking is slightly stronger than acceleration so releasing the stick stops reliably;
- air control is useful but weaker than grounded steering;
- diagonal speed is normalized;
- sprint is an explicit semantic state, not simply an animation speed change;
- movement is camera-relative;
- actor facing is damped toward intended movement/aim direction rather than teleporting rotation.

## 7. SMALL STEPS, SLOPES AND WALL SLIDE

World collision should help the player traverse believable clutter rather than catch on it.

Requirements:
- small ledges use a stable step-up allowance;
- ordinary boards/thresholds below the chosen step height should not stop the player dead;
- slopes have a defined walkable maximum;
- horizontal blocked motion should attempt axis/slide resolution rather than converting every contact into a full stop;
- tiny decorative protrusions should normally be non-blocking;
- the authoritative collision shape is simpler than the visual mesh.

### Collision geometry rule

**Never use detailed visible art as the default gameplay collider.**

A visually complex workbench can use one or a few clean invisible boxes. A detailed tractor can use a small compound set of stable primitives. Decorative trim, cables, handles, leaves and tiny tools should not become character Velcro.

## 8. COLLISION LAYERS

Every world collider should be able to express distinct responsibilities.

Core conceptual layers:
- `Player`
- `WorldSolid`
- `Climbable`
- `PropSolid`
- `Decoration`
- `CameraBlocker`
- `ProjectileBlocker`
- `VisionBlocker`
- `Trigger`

At minimum, collider metadata must separately support:
- blocks player;
- blocks camera;
- blocks vision;
- solid/non-solid;
- walkable top;
- climbable.

Examples:
- window glass can block the player but optionally not block AI/visibility logic if required by the map rule;
- small decoration can be visible but block neither player nor camera;
- a wall blocks player, camera, vision and shots;
- a trigger blocks nothing.

## 9. JUMP FORGIVENESS

Family-game controls should prefer player intent over frame-perfect timing.

Baseline:
- coyote time: **100–140 ms**;
- jump buffer: **120–180 ms**;
- variable jump height by early release;
- ground reacquisition must be stable;
- landing should not double-trigger jump;
- jump should remain usable while moving and turning;
- phone multi-touch must allow move + look + jump concurrently.

## 10. VALIDATED MANTLE

Jump may initiate an automatic low/high mantle only if all checks pass:
- forward obstacle exists;
- obstacle top is in the allowed mantle range;
- landing surface exists;
- landing capsule fits;
- head clearance is valid;
- object is climbable or allowed by level rules;
- destination is inside play bounds.

Never start a mantle and discover halfway through that the character cannot fit.

During a mantle:
- controller owns a bounded mantle state;
- camera remains stable;
- animation may drive presentation but must finish at the validated capsule destination;
- failed validation leaves normal movement intact.

---

# PART III — CAMERA STABILITY

## 11. CAMERA AND PLAYER COLLISION ARE SEPARATE SYSTEMS

Camera collision must not use the player's capsule solution as a shortcut.

The camera solves a desired shoulder pose independently against camera-blocking geometry.

## 12. MULTI-SAMPLE / VOLUME CAMERA SOLVE

Do not rely on one thin ray.

The camera solver should sample a small camera volume using centre and offset rays/candidates around the desired view. It should:
- prioritize maintaining useful distance;
- try requested shoulder first;
- allow a neutral/alternate shoulder candidate when necessary;
- try a small set of safe pitch/lift candidates;
- ignore `solid:false` and `blocksCamera:false` geometry;
- never use leaves/tiny decorations as major camera blockers;
- preserve the shot/crosshair relationship.

## 13. CAMERA HYSTERESIS

When obstruction appears:
- retract promptly enough to avoid clipping.

When obstruction clears:
- do **not** immediately expand on one clear frame;
- require a short stable-clear interval;
- expand outward more slowly than the emergency retraction.

This prevents doorframes, rafters and clutter edges from pumping the camera in/out every other frame.

## 14. CAMERA COLLAPSE RECOVERY

If actual camera distance remains below the safe minimum for a sustained interval:
- recover pitch/shoulder/distance automatically;
- do not relocate the player unless the player body is actually invalid;
- retain manual `RESET VIEW` and keyboard `R`;
- record recovery in QA diagnostics.

Camera failure and player-body failure are different events and must not be conflated.

---

# PART IV — SAFE RECOVERY

## 15. LAST-KNOWN-SAFE POSITION

Periodically record a safe transform only when:
- coordinates are finite;
- player is grounded;
- capsule is inside bounds;
- capsule is not embedded in a blocking collider.

If the player becomes invalid:
1. attempt the last-known-safe position;
2. only then use a broader radial safe-position search;
3. zero bad velocity;
4. clear invalid mantle state;
5. snap render interpolation history to the recovered transform;
6. reset camera safely.

Do not run broad geometric recovery every render frame. Recovery is exceptional, not locomotion.

## 16. STUCK DETECTOR

Diagnose at least:
- non-finite transform;
- capsule embedded in solid geometry;
- player outside map bounds;
- player below/above playable vertical limits;
- sustained camera collapse;
- optional future detector: meaningful movement input with near-zero displacement for a sustained period while not intentionally locked.

A false positive that teleports a valid hiding player is worse than a short delay, so movement-input stuck detection must use conservative thresholds.

---

# PART V — SAFE PROP-HUNT TRANSFORMS

## 17. DISGUISE PLACEMENT

Before committing to a prop disguise:
- calculate target prop bounds;
- test capsule/prop footprint against blocking geometry;
- test nearby candidate positions when the exact point does not fit;
- require map bounds and ground support;
- reject unsafe transforms with a clear message;
- never consume the disguise change if the transform cannot safely occur;
- zero stale movement velocity after a successful transformation;
- reset simulation interpolation history for the size/position change.

## 18. DECOY PLACEMENT

Decoys are lightweight gameplay objects, not full players.

Before placement:
- find a nearby open position;
- do not spend a decoy if no valid position exists;
- server validates that a client-requested position is close to the sender's live position;
- decoy uses a simple hitbox and minimal network state;
- decoy does not need full player physics, foot IK or complete animation graphs.

## 19. PROP VISUAL ROTATION VS COLLISION

When practical, visual orientation changes should not rebuild expensive collision data every frame. Keep simple collision representation stable and update only the gameplay-relevant orientation required by the chosen prop.

---

# PART VI — FRAME-TIME + GPU STABILITY

## 20. FRAME-TIME TARGETS

Average FPS alone is insufficient.

Track frame time and especially tail latency.

Reference budgets:
- 60 FPS: ~16.7 ms/frame;
- 45 FPS: ~22.2 ms/frame;
- 30 FPS: ~33.3 ms/frame.

Acceptance targets:
- minimum supported phone: sustained play should not remain above 33.3 ms/frame;
- target phone: strive for p95 frame time around 22–25 ms or better;
- no repeated large spikes during ordinary shooting, disguise or camera movement;
- a stable 40–45 FPS is preferable to oscillating 60 → 25 → 55 → 22.

QA should expose:
- current/short-window FPS;
- p95 recent frame time;
- recent peak frame time;
- draw calls;
- triangles;
- quality tier;
- pixel ratio;
- simulation recovery count.

## 21. DYNAMIC QUALITY GOVERNOR

Quality should adapt before controls become choppy.

Degradation order:
1. reduce render pixel ratio incrementally;
2. reduce nonessential particles/effect budget;
3. reduce/disable expensive dynamic shadows;
4. use more aggressive environment/character LOD when authored LODs exist;
5. hide low-significance decorative detail at the lowest tier.

Recovery upward should be slower than emergency degradation so the renderer does not oscillate quality every few seconds.

Do not lower UI resolution or interaction hit-target quality.

## 22. EFFECT POOLING

Frequently repeated effects must be pooled/reused where practical:
- shot beams/tracers;
- muzzle/impact particles;
- rings;
- poof/transform particles;
- flash effects;
- damage indicators where applicable.

Rules:
- cap simultaneous effect count;
- recycle oldest/nonessential effects when budget is reached;
- use shared immutable geometry where possible;
- do not create unique cylinder/sphere/ring geometry for every shot;
- lower particle counts automatically on lower quality tiers.

## 23. JAVASCRIPT HOT-PATH ALLOCATION

Avoid transient allocations in the animation/render loop.

Reuse:
- `Vector3` scratch objects;
- raycasters;
- quaternions/matrices when possible;
- camera centre coordinates;
- hit-test buffers;
- common geometry and materials.

Do not optimize readability into oblivion, but repeated `new Vector3`, geometry creation or temporary arrays in per-frame/per-shot hot paths should be treated as measurable technical debt because garbage collection creates visible hitches on phones.

---

# PART VII — ART + RENDER COST

## 24. CHARACTER LOD TARGETS

When authored approved GLBs are actually created, target approximately:
- local close-camera LOD0: **8k–12k triangles** where needed for approved likeness;
- nearby player LOD1: **4k–6k**;
- distant LOD2: **1.5k–3k**.

These are budgets, not quotas. Fewer triangles are better if the approved silhouette is preserved.

This W.11 runtime does **not** claim those authored GLBs already exist.

## 25. CHARACTER MATERIAL BUDGET

Aim for approximately **1–3 material groups per character** through atlases/material reuse where practical.

Do not create separate draw calls for every eyebrow, belt part or shirt panel when a texture/material atlas can preserve the approved look.

## 26. STATIC ENVIRONMENT BATCHING / INSTANCING

Repeated Papa's Shop assets such as tires, barrels, fence boards, crates, lumber and repeated hardware should use instancing/batching when the authored scene pipeline reaches that pass.

This is an asset-stage requirement and must not be falsely marked implemented merely because the master prompt contains it.

## 27. SHADOW STRATEGY

Prefer:
- important dynamic shadow: local player, nearby players, essential moving gameplay objects;
- baked/fake/contact shadow solutions for static architecture and clutter where feasible;
- reduced shadow distance and resolution on lower quality tiers.

Do not spend the phone GPU rendering high-quality dynamic shadows for fifty static props.

## 28. VISIBILITY / SIGNIFICANCE

Cull or reduce detail for content that cannot meaningfully affect the current view.

Future authored Papa's Shop pass should consider:
- frustum culling;
- distance significance;
- room/zone visibility where safe;
- lower-detail distant clutter;
- pausing expensive animation outside significance range.

Never cull gameplay-critical objects in a way that changes hiding fairness.

---

# PART VIII — ANIMATION STABILITY

## 29. BLENDED LOCOMOTION

Use semantic states with blending:
- idle;
- walk;
- jog/run;
- sprint;
- strafe left/right;
- backward;
- jump/fall/land;
- mantle;
- hunter upper-body aim/recoil;
- hider transform/lock/reaction.

Avoid abrupt full-body clip swaps when a blend or upper/lower layer can preserve continuity.

## 30. FOOT SLIDING

Match locomotion playback speed to actual planar velocity within reasonable clamp limits.

A visually fast run animation on a slowly moving capsule is a bug even if collision is mathematically correct.

## 31. FOOT IK

Foot IK remains a presentation layer:
- ray/sample terrain beneath each foot;
- adjust foot contact and modest pelvis height;
- damp changes to avoid ankle/pelvis vibration;
- never drive gameplay collision through foot IK;
- reduce/disable expensive IK for distant LODs later.

---

# PART IX — NETWORK SMOOTHNESS

## 32. NETWORK UPDATE RATE

Do not send gameplay state every render frame.

Baseline target for movement snapshots: approximately **10–20 Hz**, adjusted only from measured need.

Send meaningful state such as:
- position;
- velocity;
- yaw;
- animation/role state;
- timestamp/sequence.

## 33. REMOTE INTERPOLATION

Remote characters should render from a short interpolation buffer rather than teleport between snapshots.

Baseline visual buffer: approximately **100–150 ms**, tuned through playtest.

Limited extrapolation may bridge very short gaps but must not continue indefinitely.

## 34. LOCAL RESPONSIVENESS + FUTURE RECONCILIATION

The local player must respond immediately to local input.

The current browser architecture already moves the local player locally and smooths remote snapshots. A future formal multiplayer-authority pass may add full server reconciliation/prediction sequencing, but **do not claim full prediction/reconciliation is implemented until the protocol actually carries the required authoritative sequence/timestamps and correction path.**

Small authoritative corrections should be blended when safe. Large invalid/security corrections may snap.

---

# PART X — BROWSER / PHONE LIFECYCLE

## 35. BACKGROUND / RESUME

When the browser/tab returns from background:
- clear held shoot/jump/movement state that may have become stale;
- reset fixed-step accumulator;
- reset last-frame timestamp;
- do not simulate the entire background duration;
- keep round/network state synchronized through the normal reconnect/state path.

## 36. WEBGL CONTEXT LOSS

Listen for `webglcontextlost` and `webglcontextrestored`.

On loss:
- prevent destructive default behavior where appropriate;
- stop trying to advance/render unstable GPU presentation;
- clear held input;
- record QA reason.

On restore:
- reset simulation accumulator/timing;
- resize/reinitialize view state needed by the renderer;
- reset camera safely;
- resume without launching or teleporting the player.

W.10's requirement to replace unpinned external core 3D dependencies with pinned/self-hosted production dependencies remains technical debt before a true release.

---

# PART XI — PAPA'S SHOP PERFORMANCE BENCHMARK

## 37. WHY PAPA'S SHOP IS THE BENCHMARK

Papa's Shop intentionally combines the most stressful shared systems:
- indoor + outdoor transitions;
- roof/camera obstruction;
- barn geometry;
- clutter;
- tractor/climbables;
- hideable props;
- shooting;
- decoys;
- transformations;
- family characters;
- close third-person camera.

If this map runs smoothly, the shared foundation is meaningfully proven.

## 38. REQUIRED BENCHMARK SCENARIO

On a real target phone, run at least one complete round while deliberately testing:
1. spawn and immediate camera movement;
2. sprint from yard into shop;
3. circle doorframes and tight shelving;
4. jump repeatedly over small thresholds;
5. mantle tractor/workbench-valid surfaces;
6. aim while moving and jumping;
7. fire repeatedly into close and distant surfaces;
8. press the muzzle against a wall and fire;
9. transform beside clutter;
10. attempt an invalid transform;
11. place all ten decoys across the round;
12. use all three disguise changes;
13. use flash;
14. rotate/lock as a prop;
15. enter/leave barn and covered spaces;
16. background the phone briefly and resume;
17. rotate phone if orientation changes are supported;
18. complete round end/rematch without stale controls.

Record frame-time spikes, recoveries and any point where player input feels ignored.

---

# PART XII — DEFINITION OF DONE

## 39. W.11 RUNTIME FOUNDATION — IMPLEMENTED IN THIS PHASE

The W.11 JavaScript/Three.js foundation now includes:
- fixed 60 Hz gameplay runner with bounded catch-up;
- simulation/render transform interpolation;
- camera obstruction hysteresis;
- separate collider flags for player/camera/vision responsibilities;
- last-known-safe player recovery;
- safe disguise placement validation;
- safe decoy placement with server proximity validation;
- dynamic quality tier with pixel-ratio/effect/shadow response;
- capped pooled gameplay effects using shared geometry;
- reduced hot-path vector/ray allocations;
- background/resume fixed-step reset;
- WebGL context-loss/restore handling;
- QA display for FPS, p95 frame time, peak frame time, draw calls, triangles, quality, pixel ratio and recoveries;
- existing substep movement, jump buffer/coyote time, variable jump, animation layers, foot IK, remote snapshot interpolation and controlled ~10 Hz movement sends preserved.

## 40. ASSET / NETWORK WORK STILL REQUIRED — DO NOT FALSELY CLAIM COMPLETE

These remain future work because they require authored assets, device profiling or a broader multiplayer protocol pass:
- approved authored family GLBs with actual LOD0/1/2 meshes;
- character texture/material atlasing down toward 1–3 material groups;
- Papa's Shop authored repeated-prop instancing/batching;
- baked/static lighting and final shadow bake pipeline;
- measured real-phone p95 frame-time approval;
- formal server-authoritative client prediction/reconciliation protocol beyond the current locally responsive + remote interpolation model;
- broad device matrix including target iPhone/Safari and Android/Chrome hardware;
- production self-hosting/pinning of core Three.js dependencies.

## 41. W.11 ACCEPTANCE GATE

W.11 is not visually approved until a real phone demonstrates:
- no camera collapse/top-down failure during benchmark route;
- no persistent player pinning/sticking on ordinary clutter;
- no backwards/stale control after browser resume;
- no visible fixed-step judder under normal frame variation;
- no disguise embedding;
- no decoy placement trapping player;
- shooting remains readable and aligned;
- p95 frame time remains within the selected target-device budget for sustained normal play;
- no repeated garbage-collection-like hitch when rapid firing/effects;
- Reset View works but is not routinely necessary.

### Final rule

> **Smoothness is a shipping feature. Stability is gameplay. If the player notices the engine fighting them, Prop Hunt is not done.**


======================================================================
W.10 PROFESSIONAL DESIGN FRAMEWORK — PRESERVED SUBORDINATE CANON
======================================================================

The complete W.10 design bible follows for all broader game-design, accessibility, production, family identity, mobile UX, round design, level design and QA rules that do not conflict with W.11. Within this embedded historical text, statements saying W.10 is "canonical" are superseded by the W.11 header above.

# BLACK FAMILY GAME NIGHT
# MASTER GAME DESIGN + PRODUCTION DIRECTIVE W.10
## Professional quality framework, flagship Prop Hunt plan, mobile-first controls, character fidelity, production gates and whole-app standards

Planning date: 2026-08-27
Status: HIGHEST-PRECEDENCE NEXT-BUILD DESIGN AND PRODUCTION PROMPT
Base runtime: Phase W.8 Arcade Tutorials + Tokens Store, including all locked W.7 Prop Hunt fixes
Supersedes for next-build planning: the append-only W.9 master prompt where any wording conflicts
Preserves: Project Constitution, approved character identity, locked game rules, existing multiplayer/reconnect, W.1-W.9 approved behavior unless this directive explicitly changes it

======================================================================
0. HOW TO USE THIS DOCUMENT
======================================================================

This is the canonical design and production instruction set for the next build of Black Family Game Night.

The project has accumulated many phase documents. Those documents remain valuable history and contain game-specific rules, but the development process must no longer rely on whichever old sentence is easiest to find. Use the following precedence order.

SOURCE-OF-TRUTH PRECEDENCE
1. Explicit instructions from the user in the current development conversation.
2. Approved visual references and `MASTER_APPROVED_FAMILY_CHARACTER_DIRECTIVE.md` for character identity.
3. Game-specific locked rule files for rules that are already finalized, such as Black Gammon or Prop Hunt round rules.
4. This W.10 Master Game Design + Production Directive.
5. Current phase-specific implementation directives that do not conflict with W.10.
6. Project Constitution.
7. Historical phase directives and reports.
8. Old placeholder art, obsolete GLBs, prototype screenshots and older generated character art.

If two sources conflict and the precedence is not obvious, do not guess. Preserve the current working behavior and document the conflict before changing it.

This directive is intentionally stricter about proof. A passing unit test is code proof. It is not proof that a character looks right, a camera feels good, a touch control is comfortable, or a level is fun.

======================================================================
1. PRODUCT NORTH STAR
======================================================================

Black Family Game Night should feel like a private, polished family game lodge that happens to contain many games, not a folder of browser prototypes.

The emotional target is:
- recognizable family identity;
- quick laughter and low-friction joining;
- games that are understandable within seconds;
- enough depth to replay with family;
- strong phone usability;
- tactile, physical-looking cards, boards, props and characters;
- personal details that feel affectionate and specific without becoming clutter;
- visual quality that is simple, cohesive and deliberate rather than technically elaborate but visually weak.

The player should be able to hand the phone to a family member who has not followed development and have that person understand what to do.

The most important quality rule is:

> PLAYER EXPERIENCE OUTRANKS FEATURE COUNT.

Do not add ten unfinished systems when one polished system would materially improve the game.

======================================================================
2. PRIMARY PLAYER GROUPS AND PLAY CONTEXTS
======================================================================

Design for a mixed family audience rather than a single expert-gamer persona.

Primary contexts:
- adults who play games regularly;
- adults who rarely play games;
- teenagers and children;
- players using a phone on a couch, at a table or at a family gathering;
- players joining from a link with little setup time;
- players returning after days or weeks and needing quick reorientation;
- players who prefer touch, mouse/keyboard or a connected gamepad.

Therefore:
- core controls must be readable without memorizing combinations;
- important state must be visible, not remembered;
- tutorials must be replayable and skippable;
- mistakes should usually be recoverable;
- controls should support sensitivity, inversion and comfort options;
- social play should not punish a less experienced family member with inaccessible mechanics.

======================================================================
3. EXPERIENCE PILLARS
======================================================================

Every major design decision should strengthen at least one of these pillars and should not seriously damage another.

PILLAR A - FAMILY RECOGNITION
Characters, jokes, locations and objects should feel specific to this family. Approved character identity is sacred.

PILLAR B - IMMEDIATE PLAYABILITY
A player should know what to do, what matters and what happened. Controls respond immediately and feedback is unambiguous.

PILLAR C - PHYSICAL GAME-NIGHT READABILITY
Cards, dominoes, boards, marbles, props, weapons and interactables should have believable depth, placement and hierarchy. Decorative framing must never hide the game surface.

PILLAR D - MOBILE-FIRST COMFORT
Phone is a first-class platform. A control scheme that only feels good with a mouse is not finished.

PILLAR E - SOCIAL REPLAYABILITY
Games should create stories, rematches, rivalries and funny moments. Persistence, tokens and achievements support replay but never grant unfair gameplay power.

PILLAR F - POLISH BEFORE EXPANSION
The project should establish a proven quality slice before copying a system across more characters, maps or games.

======================================================================
4. QUALITY PRIORITY LADDER
======================================================================

When tradeoffs are necessary, use this order:
1. Game launches and completes its primary loop.
2. Player can control the game reliably.
3. Camera and visibility remain stable.
4. Rules are correct.
5. Multiplayer state is fair and synchronized.
6. Character and object identity is correct.
7. Gameplay feedback is clear.
8. Performance is stable on phones.
9. Art, animation, audio and effects are polished.
10. Extra content and decorative features are added.

Never sacrifice items 1-8 to add item 10.

======================================================================
5. BUILD STRATEGY: VERTICAL SLICE FIRST
======================================================================

Family Prop Hunt remains the flagship 3D benchmark.

The next 3D production sequence is:
1. Perfect one approved John hunter in Papa's Shop.
2. Prove movement, camera, hands, weapon, shooting and impacts on a real phone.
3. Prove John as a hider, including transformation, decoy, flash, lock, jump and mantle.
4. Prove one full five-minute round with real multiplayer or representative bots.
5. Only after that gate passes, propagate the proven shared system to Kristen, Holly, Vanessa, Lizzie, Logan, James and Dorothy.
6. Finish Papa, Nana, Kelsi, Molly and Gunner turnarounds before treating their new 3D models as approved.
7. Expand to the other Prop Hunt maps only after Papa's Shop is stable.
8. Propagate the proven 3D framework to Island Life and Birthday Seat afterward.

Do not build all characters simultaneously and hope they converge later.

======================================================================
6. DEVELOPMENT WORKFLOW FOR EVERY PHASE
======================================================================

Before editing code:
1. Extract the latest known-good ZIP into a fresh working directory.
2. Read the Constitution, this W.10 directive, the relevant game-specific rule document and all directly affected locked addenda.
3. Identify current behavior in code before replacing it.
4. Write a short implementation plan separating rule changes, UX changes, art changes and technical changes.
5. Protect unrelated games from refactors unless shared infrastructure genuinely requires a change.

During implementation:
- make one system change at a time where possible;
- keep feature flags or clean fallbacks for risky 3D replacements;
- do not delete a known-good fallback until the replacement passes its visual gate;
- avoid fake files, fake GLBs, fake manifests and placeholder claims of completion;
- instrument high-risk systems so camera recovery, stuck recovery and transform failures can be diagnosed.

Before release:
- run syntax/unit/regression tests;
- run build/static-path validation;
- verify routes;
- verify asset manifests;
- verify ZIP integrity;
- extract the exact finished ZIP into a clean directory and rerun tests there;
- record what was actually visually inspected;
- never label a build phone-verified unless it was actually tested on a phone.

======================================================================
7. WHOLE-APP UX STANDARD
======================================================================

Across the app:
- the primary play surface should dominate the screen;
- decorative chrome should be secondary;
- important actions should use consistent wording;
- every game should expose How to Play or How To from inside the game;
- tutorial state is per player and replayable;
- current objective, turn, role or round state should remain glanceable;
- destructive actions require confirmation only when accidental activation would cause meaningful loss;
- routine gameplay actions should not be slowed by confirmation dialogs;
- results screens should be skippable after the first meaningful presentation;
- loading states should explain what is happening rather than leaving a frozen screen.

Use progressive disclosure. Show the player what is needed now, and keep advanced information one tap away.

======================================================================
8. INPUT AND ACCESSIBILITY STANDARD
======================================================================

Controls must be action-based rather than tightly tied to one physical key.

Required settings where technically practical:
- look sensitivity;
- separate horizontal and vertical sensitivity if useful;
- invert X;
- invert Y;
- sprint hold/toggle/auto option where applicable;
- aim assist Off / Light / Standard for touch and gamepad where applicable;
- camera shake Off / Low / Standard;
- haptic vibration Off / Low / Standard when supported;
- reduced motion option for strong camera/effect motion;
- readable UI scale where practical;
- left-handed touch layout preset;
- large-button touch layout preset;
- remappable desktop/gamepad actions when the architecture supports it.

Do not require simultaneous multi-button chords for core family gameplay.
Do not require repeated rapid tapping when a hold or toggle can serve the same purpose.
Do not make a critical cue audio-only or color-only. Pair important state with shape/text/icon/audio where appropriate.

Touch controls:
- target approximately 44 pt minimum comfortable iOS controls and 48 dp Android-equivalent hit areas for important actions;
- use extra invisible padding when visual buttons must look smaller;
- separate adjacent high-risk controls enough to avoid accidental taps;
- respect safe areas, rounded corners and camera cutouts;
- preserve simultaneous move + look + action multi-touch.

======================================================================
9. PERFORMANCE AND WEBGL STANDARD
======================================================================

The game runs in a browser. Design to mobile WebGL realities, not desktop assumptions.

Frame-rate goals:
- preferred target: stable 60 fps on a representative modern phone for active gameplay;
- acceptable fallback floor: stable 30 fps on lower-power supported phones;
- no repeated large frame spikes during shooting, transformation, weather, map randomization or character spawn;
- measure frame-time percentiles, not only average fps.

Rendering principles:
- batch repeated props;
- instance repeated environment objects where practical;
- atlas materials where it reduces draw calls without damaging identity;
- use mipmaps for 3D textures;
- prefer GPU-compressed textures such as KTX2/Basis where supported by the existing pipeline;
- set a per-device/per-pixel memory budget rather than assuming desktop VRAM;
- reduce render resolution dynamically before destroying gameplay assets if a device is fill-rate bound;
- avoid blocking WebGL readbacks in active play;
- pool tracers, impact effects and frequently spawned temporary objects;
- cap particle counts;
- limit real-time shadow casters by significance;
- throttle animation and ambient-life updates by distance/significance;
- cull hidden zones aggressively while avoiding visible pop-in;
- recover gracefully from WebGL context loss where practical.

Initial mobile budget targets for Prop Hunt should be treated as tuning targets, not excuses to break visual quality:
- hero family character LOD0: approximately 8k-12k triangles;
- LOD1: approximately 4k-6k;
- LOD2: approximately 1.5k-2.5k;
- no more than four significant skin weights per vertex unless a visible deformation problem requires otherwise;
- keep material slots low and deliberate;
- use 1024 atlases by default, with 2048 reserved for hero/close-view needs that visibly justify the cost;
- prefer one shared humanoid skeleton and animation library.

======================================================================
10. VISUAL IDENTITY STANDARD
======================================================================

The art direction is not photorealism and not blocky placeholder art.

Target:
- warm, dimensional, tactile cartoon 3D;
- soft stylized PBR materials;
- readable silhouettes;
- believable object thickness;
- strong contact shadows;
- restrained surface detail;
- family likeness through shape, color and signature features rather than realism for its own sake.

For family characters, the approved turnaround controls identity. A more detailed model that looks less like the approved person is a failed model.

For props and environments, prioritize:
1. silhouette;
2. proportion;
3. material separation;
4. contact with the ground/world;
5. useful gameplay readability;
6. secondary detail.

Do not spend geometry on invisible seams while hands, faces, doors or weapons still look wrong.

======================================================================
11. AUDIO AND HAPTIC STANDARD
======================================================================

Audio is gameplay information and personality, not background decoration.

Use layers:
- UI confirmation;
- movement/footstep material response;
- weapon fire and impact;
- hider transform/decoy/flash;
- environment ambience;
- short family reactions;
- round transition cues.

Important events should have both visual and audio feedback.
Haptic feedback may reinforce shooting, damage or important UI actions, but must never be the only signal and must be adjustable/off.

Avoid constant loud stingers. Preserve dynamic range so meaningful events stand out.

======================================================================
12. ONBOARDING AND TUTORIAL DESIGN
======================================================================

Tutorials should teach by doing, not by presenting a wall of instructions.

Use a Prime -> Teach -> Observe pattern:
- Prime: show the immediate goal and one control.
- Teach: let the player perform that action safely.
- Observe: confirm success, then introduce the next mechanic.

For Prop Hunt, tutorial content must be role-specific.

Hunter tutorial sequence:
1. move;
2. look;
3. jump/mantle;
4. follow the crosshair;
5. shoot a harmless training prop;
6. see tracer and impact;
7. understand that hiders can look like props;
8. understand no ammo penalty exists.

Hider tutorial sequence:
1. move/look;
2. choose one assigned prop;
3. transform;
4. lock/unlock;
5. place a decoy;
6. use flash;
7. jump/mantle while disguised;
8. explain the three-change and ten-decoy limits.

Tutorials must be skippable and replayable from How To.
Do not force veteran players through tutorials every match.

======================================================================
13. SOCIAL AND MULTIPLAYER STANDARD
======================================================================

Preserve the private-room foundation:
- invite-link join;
- seat/player selection;
- Ready state;
- host control;
- reconnect;
- bots;
- chat/reactions;
- persistent profile/history systems already in the app.

Network architecture principle:
- local camera and local input response are immediate;
- authoritative room state decides roles, phase, health, eliminations, remaining resources and valid hits;
- remote characters interpolate rather than teleport between snapshots;
- remote animation is driven by replicated state/velocity/aim, not raw remote key presses;
- hidden hider information is not sent to hunters during the hide phase;
- disguise/decoy randomization uses an authoritative seed where all clients must agree;
- reconnect restores the player to a legal role/state without duplicating resources.

======================================================================
14. PROGRESSION AND COSMETICS
======================================================================

Arcade Tokens remain earned-only. No real-money purchase flow.

Cosmetics are identity-safe overlays:
- Hat -> HeadTop socket;
- Glasses -> Face socket;
- Accessory -> ChestAccessory socket.

Cosmetics may not change:
- skin tone;
- hair identity;
- face identity;
- approved body proportions;
- base outfit identity;
- dog coat markings.

Do not introduce power progression into Prop Hunt, board games or arcade games through cosmetics/tokens.

======================================================================
15. GAME-CATEGORY DESIGN STANDARDS
======================================================================

CARD GAMES
- cards are always readable;
- current hand is fully reachable on phone;
- hands larger than the comfortable width use horizontal swipe/scroll rather than microscopic cards;
- draw/discard/played zones have strong hierarchy;
- turn and legal-action feedback is explicit;
- preserve exact family rules.

BOARD/TABLETOP GAMES
- game board/table is the hero, not the decorative room;
- all pieces relevant to a decision remain visible or intentionally scrollable;
- physical depth supports comprehension;
- players can inspect/rearrange personal racks where the real game allows it;
- camera should never make the player fight perspective to understand state.

ARCADE GAMES
- start quickly;
- How To is available inside every game;
- first-time tutorial is opt-in/skip and remembered per player;
- feedback is immediate;
- level progression communicates success clearly;
- each game has a distinct visible identity.

3D FAMILY GAMES
- shared camera/input/character systems are proven in Prop Hunt first;
- do not copy an unstable camera or character rig into other 3D games.

======================================================================
16. FLAGSHIP MODE: FAMILY PROP HUNT VISION
======================================================================

Family Prop Hunt should feel like a polished third-person hide-and-seek action game where the comedy comes from family characters, ridiculous disguises, near misses and map knowledge.

Desired emotional arc of a round:
1. anticipation during role reveal;
2. frantic creativity during hiding;
3. tense searching after HUNT;
4. readable chase or escape;
5. funny reveal/elimination;
6. quick family recap and rematch momentum.

The mode should reward:
- map knowledge;
- clever disguise choice;
- believable placement;
- movement skill;
- hunter observation;
- chase execution;
- decoy timing;
- flash timing.

It should not reward:
- camera exploits;
- hiding inside collision;
- invisible/undersized props;
- network desync;
- unreadable effects;
- guessing based on rendering bugs.

======================================================================
17. PROP HUNT LOCKED MATCH RULES
======================================================================

Preserve the established core rules unless the user explicitly changes them.

Match:
- default 6 rounds;
- Papa's Shop supports up to 12 players;
- Classic and Family Chaos modes remain separate.

Hide phase:
- default 30 seconds;
- hunters see a black screen and countdown;
- hunters cannot move, look, shoot or receive useful positional hider information;
- hiders may move, jump, climb, disguise and place decoys.

Hunt phase:
- default 5 minutes;
- synchronized 3-2-1 -> HUNT transition;
- hunter controls unlock immediately and reliably.

Hiders:
- curated map disguise pool around 30 types for Papa's Shop;
- exactly 4 assigned disguise choices for the round;
- no reroll;
- initial disguise plus up to 3 later disguise changes;
- health carries across disguise changes;
- each disguise refreshes one flash grenade;
- exactly 10 decoys total per hider per round;
- hiders can move, run, jump and climb reasonable surfaces while disguised;
- lock/unlock remains available to stabilize prop position/orientation.

Hunters:
- unlimited ammo;
- no penalty for shooting innocent environment props;
- no separate Aim button;
- permanent crosshair aiming during active hunt;
- tap Shoot fires once;
- hold Shoot uses a tuned controlled rapid-fire rate;
- hunter can move, turn, strafe, jump and shoot together;
- no mid-round combat power upgrades.

Health/elimination:
- standard hider target remains approximately three hits;
- disguise prop breaks visibly on elimination;
- short `That's a sin.` original comedic elimination cue remains;
- Classic: eliminated hider becomes spectator/ghost;
- Family Chaos: caught hider joins hunters.

======================================================================
18. PROP HUNT ROUND STATE MACHINE
======================================================================

Use an explicit state machine. Do not let UI and gameplay infer phase independently.

Recommended states:
LOBBY
ROLE_REVEAL
HIDE_COUNTDOWN
HUNT_RELEASE
HUNT
ROUND_RESOLVE
ROUND_MVP
MATCH_RESOLVE

Every state defines:
- allowed movement;
- allowed camera;
- allowed actions;
- visible HUD;
- allowed network data;
- audio cues;
- transition timeout;
- reconnect behavior.

A phase transition must be idempotent. Repeated network messages cannot grant extra decoys, refresh flash twice or duplicate eliminations.

======================================================================
19. PROP HUNT HUD INFORMATION HIERARCHY
======================================================================

The active viewport is the priority.

Always-visible during hunt:
- role;
- round/time remaining;
- health where relevant;
- small crosshair for hunters;
- role-specific resources only.

Hunter HUD:
- health/status if applicable;
- crosshair;
- Shoot;
- Jump;
- Sprint/toggle state;
- shoulder swap;
- Reset View;
- compact alive-hiders count if already part of the design.

Hider HUD:
- health;
- current disguise;
- disguise changes remaining;
- flash ready/not ready;
- decoys remaining out of 10;
- lock/unlock state;
- Prop / Flash / Decoy / Lock / Jump / Sprint;
- Reset View.

Do not show hider-only controls to hunters or hunter-only shooting controls to hiders.

======================================================================
20. PROP HUNT LEVEL-DESIGN PRINCIPLES
======================================================================

Papa's Shop remains the first map benchmark.

The map should be large enough for up to 12 players and roughly eight times the original prototype's meaningful traversable area.

Core zones remain:
- main shop;
- barn;
- animal pens;
- equipment yard;
- lumber/material storage;
- outdoor apron/grass/property circulation.

Design rules:
- primary circulation uses loops, not funnels;
- major zones aim for roughly three meaningful entrances/exits where practical;
- every large zone includes at least one fast chase route, one slower concealment route and one useful vertical/climb opportunity where theme permits;
- intentional dead-end hiding spots are rare and clearly high-risk;
- no accidental dead ends from collision clutter;
- large props need camera recovery space around them;
- landmarks remain stable across randomization;
- secondary clutter can vary by round without destroying navigation.

Use blockout first. Do not add final art until the greybox proves:
- traversal;
- sightlines;
- hiding density;
- camera clearance;
- spawn safety;
- round pacing.

======================================================================
21. LANDMARKS, GUIDANCE AND READABILITY
======================================================================

Players should build a mental map quickly without needing constant arrows.

Use:
- distinct silhouettes;
- lighting contrast;
- color/material accents;
- unique sounds;
- large recognizable props;
- visible exterior orientation;
- different floor/ground materials by zone.

Papa's yellow tattered chair by the fireplace remains a permanent shop landmark.
Barn, tractor/equipment yard and pen zones should also read as unmistakable anchors.

Avoid visual noise where hunters need to parse props. Clutter should create hiding opportunities, not make every square meter equally chaotic.

======================================================================
22. PROP ECOLOGY AND HIDING QUALITY
======================================================================

A good Prop Hunt map needs believable prop grammar.

Environment props should be arranged with enough consistency that a hider can imitate the world, but enough variation that hunters must observe rather than memorize one exact layout.

Each major zone should include a healthy mix of:
- small props;
- medium props;
- large/risky props;
- props near walls;
- props in clusters;
- props on surfaces;
- some open/exposed props;
- some vertical/climb-related props.

Disguise choices must use gameplay colliders that are fair and stable even if decorative mesh shapes are irregular.

No disguise may:
- fit into gaps smaller than the visible prop suggests;
- clip mostly inside a wall/floor;
- hide its hit volume far away from its visible mesh;
- create a camera pocket that reveals outside geometry;
- become effectively invisible due to scale/lighting.

======================================================================
23. HIDING-PHASE DESIGN
======================================================================

The 30-second hide phase must feel urgent but understandable.

At phase start:
- show the four assigned disguise options clearly;
- show Prop / Decoy / Flash / Lock controls;
- do not cover the screen with a tutorial if the player already skipped/finished it;
- give immediate movement control to hiders;
- hunters remain fully blind and input-locked.

Hider preparation flow:
1. pick an initial prop;
2. move to a plausible area;
3. orient/lock if desired;
4. place decoys deliberately;
5. optionally keep an escape route for the hunt.

If the player is still undisguised near release, provide a clear warning, but do not auto-invent a prop unless an existing rule explicitly supports it.

======================================================================
24. HUNTER SEARCH DESIGN
======================================================================

Hunter play should be about observation plus movement, not simply sweeping the mouse while holding fire.

Support this through design rather than ammo penalties:
- strong prop silhouettes;
- readable tracer/impact so shots feel deliberate;
- map routes that require turning and checking angles;
- vertical hiding possibilities;
- decoys that create uncertainty;
- movement/chase opportunities after a hider is discovered.

Do not add enemy outlines, wall hacks or automatic target reveal.

Aim assist may help input precision, but it may never identify a hidden player that the player has not visually found.

======================================================================
25. MOVEMENT FEEL
======================================================================

Movement is a flagship quality system.

Principles:
- immediate response to directional input;
- acceleration gives body weight without delaying control;
- braking is responsive enough for precise hiding/doorways;
- diagonal input is normalized;
- camera-relative movement is consistent;
- character does not rotate unpredictably when camera crosses behind;
- wall contact slides rather than sticks;
- small steps do not snag;
- slope handling is predictable;
- jump input uses buffering and coyote time;
- landing returns control quickly;
- mantle is validated and never teleports through ceilings/walls.

Initial tuning direction:
- joystick dead zone around 8-12 percent;
- walking available through partial analog input;
- normal run as the primary full-stick speed;
- sprint roughly 20-35 percent faster than run, tuned by actual map scale;
- jump buffer approximately 120-180 ms;
- coyote time approximately 100-140 ms;
- maintain useful but limited air steering;
- no animation may delay the first visible response to movement input.

Use measured tuning rather than copying arbitrary values from another game.

======================================================================
26. MANTLE AND CLIMB SYSTEM
======================================================================

Jump should also attempt a safe mantle when the player is moving toward a valid ledge.

A mantle candidate must validate:
- forward obstruction;
- reachable top height;
- walkable top surface;
- head/character clearance;
- destination collision;
- camera clearance where possible;
- climbable surface rules.

Use at least low and high mantle categories if the animation set supports them.

Failure behavior:
- if mantle is invalid, perform a normal jump or remain grounded as appropriate;
- never freeze input;
- never place the player inside geometry;
- never allow climbing through roofs or closed walls.

Papa's Shop benchmark surfaces include:
- tractor;
- reasonable workbench edges;
- hay/storage routes;
- selected lumber/pallet stacks;
- pen/fence sections intended as traversal;
- barn loft access.

======================================================================
27. THIRD-PERSON CAMERA SYSTEM
======================================================================

Camera quality is a release blocker.

General camera requirements:
- camera follows a solved target point rather than raw origin transforms;
- first frame, respawn and teleport snap to a valid solved view before easing;
- camera collision uses multiple candidates rather than one fragile ray;
- decorative `solid:false` geometry does not block the camera;
- camera tries shoulder/lift/pitch alternatives before collapsing distance;
- sustained collapse triggers automatic recovery;
- Reset View remains available;
- camera cannot become stuck top-down, under roofs, inside the character or inside a prop.

Default hunter framing:
- close right-shoulder view;
- character occupies roughly the left third rather than screen center;
- weapon and hands remain visible;
- crosshair area remains clear;
- shoulder swap available;
- camera may pull slightly back when sprinting or in tight combat if it improves readability.

Hider framing:
- slightly wider situational view;
- camera pivot and near/far distance recalculate from disguise bounds;
- prop transformation cannot inherit an invalid humanoid camera pocket;
- very small props must not put the camera on the floor;
- very large props must not push the camera through walls.

Camera settings:
- default vertical FOV around 58-65 degrees as a starting point, then tune on real target devices;
- allow a reasonable FOV range if the settings architecture supports it;
- separate look sensitivity from FOV;
- reduce camera shake independently from recoil/feedback.

======================================================================
28. HUNTER AIM AND WEAPON SYSTEM
======================================================================

The prop-zapper must be visible, readable and mechanically aligned with the crosshair.

Shot pipeline:
1. screen-center crosshair defines intended camera ray;
2. camera ray resolves intended world point;
3. character upper body and weapon aim toward that point;
4. physical weapon muzzle checks for a blocking wall/object between muzzle and target point;
5. authoritative hit validation uses the final legal shot;
6. muzzle flash, beam/tracer and impact render along that same shot result;
7. hit marker/audio only confirm actual hider damage.

No parallax lie is acceptable where the crosshair, beam and damage disagree.

Weapon presentation:
- right hand = trigger hand;
- left hand = support hand using IK or equivalent constraint;
- weapon cannot float;
- wrist/palm directions are anatomically correct;
- no backwards hands;
- weapon stays visible while walking, strafing and ordinary jumping;
- sprint may lower the weapon slightly but must transition back quickly;
- no conventional reload is required because ammo is unlimited;
- a brief zapper recharge/cooldown visual may communicate controlled fire rate without pretending ammo is limited.

Feedback per shot:
- muzzle flash;
- visible fast beam/tracer;
- impact effect at actual collision point;
- restrained recoil;
- audio;
- optional haptic pulse;
- material-aware impact variation where practical.

Hider hit feedback:
- stronger hit marker;
- short target shake/react;
- distinct audio cue;
- health update;
- no identity reveal until elimination.

======================================================================
29. MOBILE HUNTER CONTROLS
======================================================================

Default layout:
LEFT SIDE
- movement joystick;
- sprint integrated as joystick threshold or separate reachable button depending playtest preference.

RIGHT SIDE
- open drag zone for camera look;
- large Shoot button;
- large Jump/Mantle button;
- smaller shoulder-swap button;
- Reset View accessible but separated from combat actions.

No Aim button.

Requirements:
- player can move + look + shoot at the same time;
- player can move + look + jump at the same time;
- Shoot does not steal the pointer used for camera look;
- camera drag does not begin when the player intended to press Shoot;
- actions use large hit boxes even if art is visually compact;
- UI respects safe areas;
- landscape and portrait policies are explicit rather than accidental.

Default target is landscape for full 3D Prop Hunt unless a later phone test proves portrait genuinely superior.

======================================================================
30. MOBILE HIDER CONTROLS
======================================================================

Default layout keeps movement and camera consistent with hunter controls so role switching does not force relearning.

Role-specific right-side actions:
- Jump/Mantle;
- Prop;
- Flash;
- Decoy;
- Lock/Unlock;
- Sprint where used;
- Reset View.

Resource count appears on or immediately adjacent to the action:
- Prop: changes remaining;
- Decoy: remaining/10;
- Flash: Ready or spent;
- Lock: Locked/Free state.

Avoid stacking six identical round buttons in one cluster. Use visual hierarchy and thumb reach.

Provide at least:
- Default layout;
- Large Buttons layout;
- Left-Handed mirrored layout.

A future custom drag-to-position editor is optional, not required before core controls feel excellent.

======================================================================
31. DESKTOP AND GAMEPAD CONTROLS
======================================================================

DESKTOP DEFAULT
- WASD: movement;
- mouse: look;
- Left Mouse: Shoot for hunter;
- Space: Jump/Mantle;
- Shift: Sprint;
- C: shoulder swap;
- R: Reset View;
- hider role actions use clear remappable keys, preserving existing E/F/Q/L choices where practical unless usability testing supports a cleaner map.

Do not require Right Mouse Aim.

GAMEPAD DEFAULT
- left stick: movement;
- right stick: look;
- right trigger: Shoot hunter;
- south face button: Jump/Mantle;
- left stick click or a comfortable shoulder/face action: Sprint, with toggle option;
- shoulder action: camera shoulder swap;
- hider abilities use available face/shoulder buttons and always show correct glyphs where the web platform exposes mapping data.

Provide dead-zone and sensitivity settings.

======================================================================
32. HIDER TRANSFORMATION SYSTEM
======================================================================

Transformation must be reliable before it is pretty.

On prop change:
1. validate requested prop is one of the player's assigned legal options;
2. validate remaining change count;
3. choose a safe placement/collider solution;
4. update gameplay collider separately from decorative mesh if needed;
5. preserve world-facing direction unless the prop needs a safe snapped orientation;
6. recalculate camera target/clearance;
7. refresh flash per locked rules;
8. continue health unchanged;
9. show a short transformation effect;
10. return full movement control immediately.

If placement is invalid:
- show a clear invalid-placement response;
- search a small nearby safe placement only if it does not move the player unfairly;
- otherwise cancel without consuming the disguise change.

Never consume a limited resource because of a collision-system failure.

======================================================================
33. PROP LOCKING
======================================================================

Locking communicates `I am pretending to be part of the environment`.

Locked state should:
- stabilize visual orientation/position;
- make subtle movement/bob stop;
- keep collision valid;
- preserve camera control;
- be obvious in HUD;
- never trap the player.

Unlock should be immediate.
If movement while locked is not allowed by current implementation, movement input should clearly unlock or be rejected with readable feedback according to the established rule. Do not leave the player wondering why the joystick stopped working.

======================================================================
34. DECOY SYSTEM
======================================================================

Decoy placement should feel deliberate.

Requirements:
- preview legal/illegal placement where practical;
- place near/in front of the player rather than at an ambiguous hidden origin;
- validate support and collision;
- avoid walls and required routes;
- use a small placement effect/audio cue;
- decrement exactly one from the hider's ten total decoys;
- authoritative multiplayer state prevents duplicates;
- decoys visually match the relevant prop type enough to create mind games;
- decoys do not create collision traps.

======================================================================
35. FLASH SYSTEM
======================================================================

Each disguise grants one flash use.

Flash feedback:
- short world-space burst;
- clear activation sound;
- affected hunter receives a brief readable flash effect;
- reduced-motion/accessibility setting can reduce intensity;
- effect never becomes a long full-white screen;
- no photosensitive strobing;
- exact availability is visible to the hider.

======================================================================
36. CHARACTER IDENTITY PIPELINE
======================================================================

Approved turnaround images are the character source of truth.

Production workflow for each character:
1. approved five-view turnaround;
2. orthographic modeling reference extraction;
3. silhouette/proportion blockout;
4. front/side/back comparison render;
5. head/face/hair pass;
6. clothing/footwear pass;
7. shared-rig skinning;
8. neutral animation deformation test;
9. Prop Hunt weapon/aim test;
10. phone LOD/material test;
11. five-view final comparison;
12. only then set `approvedModel: true`.

Use silhouette overlays or side-by-side proof rather than judging from memory.

======================================================================
37. CHARACTER MODEL QUALITY STANDARD
======================================================================

Human LOD0 target for Prop Hunt close camera: approximately 8k-12k triangles.

Spend that detail on:
- face planes and rounded cheeks/jaw;
- eyelids/eye seating;
- nose and mouth volume;
- hair silhouette/clumps;
- hands/thumbs;
- collar/hood/apron/skirt/belt/boot volume;
- clean shoulder/elbow/knee deformation.

Do not spend it on:
- individual hair strands;
- tiny seams;
- hidden geometry;
- micro-wrinkles;
- photoreal pores.

Face standard:
- eyeballs sit inside the head, not on the surface;
- eyelids follow the eyeballs;
- nose has side/profile volume;
- mouth has volume and can smile/frown subtly;
- glasses anchor to nose/ears;
- beard/moustache follows facial planes;
- ears are placed consistently from front/side views.

Hair standard:
- main skull mass plus secondary clumps;
- preserve exact approved silhouette;
- curls/waves read as grouped forms;
- no helmet blob;
- no expensive strand simulation.

======================================================================
38. APPROVED CHARACTER PRODUCTION CARDS
======================================================================

The images still outrank text. These notes clarify what must read during gameplay.

JOHN BLACK
- sturdy/stocky approved cartoon build;
- short brown side-swept hair;
- full short brown beard;
- red/black plaid shirt;
- blue jeans;
- brown belt/work boots;
- hunter stance solid/confident;
- beard and plaid must remain readable at normal camera distance.

KRISTEN
- approved adult female proportions;
- shoulder-length wavy blonde hair;
- black fitted short-sleeve top;
- blue jeans;
- brown belt/boots;
- keep silhouette simple and recognizable.

HOLLY
- child proportions;
- bright blonde double buns;
- approved cream padded sweater/vest look;
- blue backpack/straps;
- blue pants;
- brown shoes;
- youthful rounded face and smaller body scale.

VANESSA
- long voluminous golden-blonde curls;
- burgundy/dark-red long-sleeve top;
- blue jeans;
- brown belt/boots;
- confident posture;
- curls are the dominant silhouette feature.

ELIZABETH / LIZZIE
- child proportions;
- bright blonde high ponytail;
- large pink bow;
- pink hoodie/top;
- pink skirt with white polka dots;
- white socks;
- pink Croc-style shoes;
- restrained ponytail secondary motion only.

LOGAN
- boy/young-teen proportions;
- short messy/spiky blonde hair;
- black fishing/outdoor-logo hoodie;
- dark cargo pants;
- tan/brown work boots;
- energetic personality may appear in idle/reactions, not speed advantage.

JAMES
- older adult compact cartoon proportions;
- short clustered grey curls;
- grey moustache;
- round glasses;
- bright blue button-up shirt;
- blue jeans;
- brown belt/shoes;
- age reads through silhouette/hair/posture, not photoreal wrinkles.

DOROTHY
- older adult compact rounded proportions;
- blonde high updo/bun;
- no glasses;
- blue long-sleeve dress/top;
- cream floral apron;
- blue shoes;
- apron is a major silhouette layer and must deform cleanly.

PAPA, NANA, KELSI, MOLLY, GUNNER
- remain turnaround-pending;
- current compatibility art may remain;
- do not invent final W.10 models until each individual turnaround is approved.

======================================================================
39. SHARED HUMANOID RIG STANDARD
======================================================================

Use one semantic humanoid rig wherever practical.

Required chain:
root -> hips -> lower spine -> chest -> neck -> head
left/right clavicle -> upper arm -> forearm -> hand
left/right thigh -> shin -> foot -> toe where useful

Rig rules:
- one documented forward axis;
- no runtime negative-scale mirroring of hand skeletons;
- freeze/apply transforms before export;
- elbows/knees bend anatomically;
- shoulders preserve volume during two-hand aim;
- foot IK may adapt to reasonable terrain;
- upper-body aim layers independently over lower-body locomotion;
- excessive spine twist triggers whole-body turn;
- head tracking is subtle and clamped.

Gameplay sockets:
- rightHand;
- leftHand;
- rightHandSocket;
- leftHandSupportTarget;
- weaponMuzzle;
- weaponSightTarget;
- back;
- HeadTop;
- Face;
- ChestAccessory.

======================================================================
40. ANIMATION SYSTEM STANDARD
======================================================================

Base locomotion coverage:
- relaxed idle;
- hunter-ready idle;
- forward walk/run;
- backpedal;
- strafe left/right;
- sprint;
- start/stop;
- turn in place;
- jump start;
- fall;
- soft land;
- hard land;
- crouch where used;
- low mantle;
- high mantle;
- fire/recoil;
- hit reaction;
- celebrate;
- transform;
- decoy placement;
- flash use.

Animation principles:
- gameplay input owns responsiveness;
- animation expresses motion, it does not veto valid input;
- avoid foot skating with speed-aware blending;
- avoid hard state snaps;
- use upper-body additive/aim layers;
- keep weapon grip stable through locomotion;
- character-specific personality belongs mainly in idle, reaction and celebration layers so gameplay remains fair.

======================================================================
41. COLLISION AND RECOVERY STANDARD
======================================================================

Common failure modes are release blockers:
- pinned player;
- invisible snag strip;
- camera collapsing into head;
- camera stuck top-down;
- spawn inside geometry;
- transformation inside geometry;
- mantle through roof;
- decorative mesh blocking camera.

Use:
- stable gameplay capsule/body collider;
- sensible skin width;
- slope/step handling;
- sub-step movement at high speed;
- wall sliding;
- safe spawn validation;
- camera-pocket validation;
- transform destination validation;
- sustained-invalid-state recovery.

Recovery must be conservative. Do not teleport during ordinary wall contact.

======================================================================
42. PROP HUNT MAP RANDOMIZATION
======================================================================

Use hybrid randomization.

Permanent anchors:
- main shop;
- barn;
- fireplace/Papa chair;
- major pen zones;
- property boundary/orientation.

Round-variable secondary elements may include:
- lumber arrangements;
- barrels/crates/pallets;
- portable equipment;
- selected doors starting open/closed;
- tractor/trailer parking in validated zones;
- hay clusters;
- workbench clutter;
- selected pen objects;
- rare harmless interactions.

Randomization must be seeded/authoritative and must pass route validation before the round begins.
If a generated arrangement blocks a required route or spawn, reject that arrangement and use a safe alternative.

======================================================================
43. WEATHER AND AMBIENCE
======================================================================

Per-round presets may include clear, sunset, overcast, light rain, light snow, fair fog and windy/cloud movement.

Rules:
- one preset remains stable for the whole round;
- weather does not alter collision;
- fog never becomes strong enough to materially hide one team;
- particles never obscure crosshair/hit feedback;
- snow/rain budgets scale on mobile;
- ambience does not reveal hider positions unfairly;
- positional hider audio remains protected during hide phase.

======================================================================
44. SPECTATOR EXPERIENCE
======================================================================

Classic eliminated players should remain entertained.

Provide:
- free-fly ghost mode;
- follow-living-player camera;
- next/previous target;
- return to free fly;
- no gameplay collision;
- no ability to interact;
- no information channel that can reveal hidden players to hunters through the game systems.

Family Chaos conversion must not accidentally trigger Classic spectator mode.

======================================================================
45. BOT DESIGN
======================================================================

Bots exist to keep games playable, not to demonstrate perfect AI.

Hunter bots:
- blind/frozen during hide phase;
- use believable search routes;
- do not read hidden hider transforms or exact positions;
- detection is based on legal visible information;
- aim skill respects difficulty level;
- avoid robotic instant 180-degree shots.

Hider bots:
- choose legal assigned props;
- move during hide phase;
- place reasonable decoys;
- use flash/escape sometimes;
- do not exploit collision inaccessible to humans.

Bot difficulty should change reaction/search/aim competence, not cheat access to hidden state.

======================================================================
46. ACCESSIBILITY AND COMFORT IN PROP HUNT
======================================================================

At minimum provide or plan for:
- sensitivity sliders;
- invert X/Y;
- reduced camera shake;
- haptic intensity/off;
- aim assist Off/Light/Standard for touch/gamepad;
- sprint hold/toggle/auto preference;
- large-button touch preset;
- left-handed touch preset;
- text/icon plus audio for important transitions;
- no flashing/strobing effects that can be avoided;
- brief flash-grenade exposure with reduced-motion/flash intensity option if practical;
- objective/role instructions reviewable from pause/How To.

Accessibility assists must not reveal hidden players or create competitive information that normal players do not have.

======================================================================
47. GAME FEEL AND FEEDBACK STACK
======================================================================

Every important action should answer three questions:
- Did my input happen?
- What did it affect?
- What can I do next?

Examples:
Shoot:
- input -> muzzle flash/audio immediately;
- beam -> actual impact;
- world hit -> surface response;
- hider hit -> stronger hit marker/audio/target reaction;
- elimination -> break effect + family cue + score state.

Transform:
- selection -> highlighted card;
- validation -> placement state;
- transform -> brief effect/sound;
- resource count -> updates;
- camera -> settles around new prop;
- control -> immediately returns.

Mantle:
- jump input -> immediate jump/mantle intent;
- valid ledge -> body commits;
- landing -> grounded response;
- invalid ledge -> normal jump/fallback, never frozen character.

======================================================================
48. PERFORMANCE BUDGETING FOR PAPA'S SHOP
======================================================================

The expanded property may contain hundreds of visible props and approximately 150 gameplay-meaningful/interactable objects, but it must be architected rather than brute-forced.

Use significance tiers:
TIER 1 - local player, nearby players, aimed-at/active props, weapon effects.
TIER 2 - nearby animated environment/animals/interactions.
TIER 3 - distant characters/ambient life.
TIER 4 - static scenery.

Scale updates, animation and shadows by significance.

Recommended initial WebGL targets on a representative mid-range phone:
- keep active draw calls as low as practical; use an initial engineering target around 150-200 visible draw submissions and revise from profiling rather than treating it as a sacred number;
- avoid more than a small handful of dynamic shadow-casting hero objects at once;
- use instancing for repeated fences, pallets, barrels, lumber pieces, vegetation and similar repeated props;
- keep temporary shot/impact objects pooled;
- use LOD/culling so the entire eight-times-larger property is not fully expensive at once;
- monitor JS heap, GPU memory proxies and context-loss events during a 15-minute soak.

Performance acceptance is based on actual profiling, not asset-count assumptions.

======================================================================
49. PLAYTEST METRICS AND LOCAL QA TELEMETRY
======================================================================

Because this is a private family app, telemetry should be local/developer-oriented by default. Do not add third-party analytics without explicit permission.

Useful debug events/counters:
- cameraResetUsed;
- automaticCameraRecovery;
- stuckRecovery;
- mantleAttempt / mantleSuccess / mantleFailReason;
- transformAttempt / transformSuccess / transformFailReason;
- decoyPlacementFail;
- shotFired;
- shotWorldHit;
- shotHiderHit;
- elimination;
- frameTimeP50 / P95 / P99;
- WebGL context loss;
- round duration;
- role win;
- time to first hider discovery;
- time spent in each map zone.

Use these to diagnose design, not to judge family players.

Balance target direction:
- over enough mixed-skill playtests, neither hunters nor hiders should dominate every map;
- a rough 40-60 percent band per side is a useful investigation threshold, not a rule to force from tiny samples;
- if balance is off, inspect spawn/routing/prop ecology/hunter count before adding artificial power-ups.

======================================================================
50. PROFESSIONAL PLAYTEST METHOD
======================================================================

For every major Prop Hunt iteration, run three types of test.

A. FIRST-TIME PLAYER TEST
Do not explain controls verbally beyond what the game itself teaches. Observe where the player hesitates.

B. EXPERT/DEVELOPER STRESS TEST
Try to break camera, collision, mantle, transform, decoy placement, boundary and networking.

C. FAMILY MATCH TEST
Play full rounds with normal conversation and distractions. Observe whether people understand what happened and whether the round creates funny/replayable moments.

Record:
- confusion points;
- accidental inputs;
- camera discomfort;
- stuck locations;
- unreadable hits;
- hiding spots everyone uses;
- zones nobody visits;
- controls players miss;
- moments players laugh/talk about afterward.

Fix repeated player confusion before adding new content.

======================================================================
51. PAPA'S SHOP JOHN VERTICAL-SLICE GATE
======================================================================

John is the first production gate. He must pass the complete actual-phone vertical-slice gate before the upgraded character/controller is propagated to the rest of the family.
For the hunter pose, the right hand on the trigger and the left hand supporting the fore-end are mandatory. Shooting must include a visible 3D energy tracer, and the proof must be captured on an actual phone.

Do not propagate the W.10 character/control system until one actual-phone capture proves all of these at the same time:

JOHN VISUAL
- unmistakably matches approved John turnaround;
- correct skin/hair/beard/plaid/jeans/boots;
- dimensional face and hair, not blocky;
- hands face anatomically correct direction;
- no severe arm/shoulder deformation;
- close-camera silhouette looks intentional from front 3/4, side and rear play angles.

HUNTER CONTROL
- stable right-shoulder camera;
- move + look + shoot simultaneously;
- jump/mantle works;
- sprint feels controllable;
- shoulder swap works;
- Reset View works;
- no top-down collapse;
- no pinned spawn.

WEAPON
- prop-zapper is clearly visible;
- right trigger hand grips correctly;
- left support hand remains on weapon;
- crosshair is clear;
- shot beam is visible;
- impact is visible;
- beam/crosshair/hit result agree;
- muzzle blocked by wall cannot shoot through wall.

HIDER
- transformation safe;
- camera adapts to prop;
- lock/unlock works;
- decoy placement works;
- flash works;
- jump/mantle works while disguised where allowed;
- resource counts remain correct.

PERFORMANCE
- sustained gameplay meets the target device's acceptable frame-rate tier;
- no major recurring stutters from shots/transforms;
- no WebGL errors/context loss in normal test.

Only after this gate passes can the shared implementation be called `PROVEN_PROP_HUNT_CHARACTER_CONTROLLER` or equivalent.

======================================================================
52. WHOLE-APP LOCKED RECENT CHANGES
======================================================================

Preserve the following recent W.6-W.8 requirements.

VANESSA'S PIPE PROBLEM / TRUCK WASH
- water reaching the grey GMC is the win condition;
- show clear win and advance to next level;
- truck is grey with only the letters GMC shown in pink;
- dimensional pipes, sockets/couplers/bolts, flow and worksite art.

LOGAN'S TRAIL LOGIC
- visual How To/tutorial;
- per-player tutorial choice;
- starts easier;
- early level shows one locked correct bike;
- difficulty grows through larger boards;
- dirt-bike icon must read as a dirt bike.

MEXICAN TRAIN
- game board is outside/above decorative table framing and easy to see;
- all personal dominoes are visible/reachable;
- player can rearrange personal domino rack.

GOLF
- player does not have to flip/replace the last card merely because a stock card was drawn;
- drawn stock card may be discarded while keeping all eight current cards;
- final-turn behavior follows the locked family rule;
- own eight cards and opponents' layouts are readable.

MITTS / GLOVES / SOCKS
- captured cards/points remain visibly in front of the player/team;
- active center pile remains distinct;
- presentation should resemble physical table play.

NANA'S GOAT WHACK
- animals are more dimensional and less blocky;
- point values and do-not-hit object are visible beside gameplay.

KELSI
- Kelsi's Rock 'n' Roll Rescue replaces Neon Star Patrol;
- old separate Kelsi game is removed/redirected according to W.6.

ARCADE TUTORIALS
- every active arcade game has in-game How To;
- detailed visual step tutorial;
- per-player show/skip choice remembered;
- tutorial can always be reopened.

TOKENS STORE
- earned-only Arcade Tokens;
- hats, glasses and accessories;
- cosmetic-only, identity-safe;
- unlocked items persist and can be equipped/removed.

======================================================================
53. 31 BLIND MODE LOCK
======================================================================

31 Blind mode is now defined.

Blind player starts with exactly 3 face-down cards in front of them and does not see those cards. If the player takes the discard, they replace one of their face-down cards without looking at the replaced card. They may pass and wait for the next turn.

Blind player:
- starts with exactly 3 cards face down in front of them;
- does not look at those cards;
- on a turn may choose one of three actions:
  1. flip one of their own face-down cards and keep it;
  2. take the top card from the discard pile and replace one chosen face-down card without looking at the replaced face-down card;
  3. pass and wait for the next turn;
- once one of the player's own cards is flipped and kept, it remains face up for the rest of the round.

Do not invent additional Blind scoring/end conditions beyond the existing 31 rules unless the user clarifies them.

======================================================================
54. DEFINITION OF DONE BY FEATURE TYPE
======================================================================

RULE FEATURE DONE
- rule documented;
- unit tests cover edge cases;
- main gameplay loop proves it;
- multiplayer authoritative state agrees;
- UI communicates it.

CONTROL FEATURE DONE
- works on target inputs;
- simultaneous-input cases work;
- sensitivity/dead zone tuned;
- no accidental input overlap;
- tested on actual phone for touch claims.

CHARACTER FEATURE DONE
- approved turnaround exists;
- model five-view proof matches;
- rig deformation passes;
- gameplay animation passes;
- LOD/material performance passes;
- actual in-game screenshot looks correct;
- only then model is flagged approved.

3D MAP FEATURE DONE
- blockout routes pass;
- collision pass;
- camera pass;
- visual pass;
- performance pass;
- full-round playtest;
- actual-phone proof.

ZIP RELEASE DONE
- tests pass;
- validator passes;
- archive integrity passes;
- exact ZIP cold extraction passes tests;
- changed-files report exists;
- known limitations are stated.

======================================================================
55. RELEASE PROOF BUNDLE
======================================================================

Every major 3D release should include, where tools allow:
- build/test report;
- changed-files list;
- performance/debug summary;
- at least one desktop gameplay screenshot;
- at least one target-phone gameplay screenshot supplied by real device or clearly labeled simulator/preview if not real device;
- character comparison proof for any newly approved model;
- short list of known limitations.

Do not substitute a bind-pose render for actual gameplay proof.

======================================================================
56. FORBIDDEN SHORTCUTS
======================================================================

Do not:
- silently redesign approved characters;
- mark unapproved GLBs approved;
- use fake manifests to imply assets exist;
- fix backwards hands by hiding the entire arm/weapon;
- solve camera collision by moving to permanent top-down view;
- make props tiny/invisible to solve hiding balance;
- add wall outlines to solve hunter difficulty;
- reduce the world to empty boxes to hit fps;
- add input delay so animation looks smoother;
- use giant full-screen effects that hide gameplay;
- make mobile buttons microscopic to preserve art;
- claim automated tests prove visual quality;
- rewrite unrelated game engines during a focused Prop Hunt pass;
- add major unapproved rules because they sound standard in another Prop Hunt game.

======================================================================
57. NEXT IMPLEMENTATION PRIORITIES
======================================================================

Priority 0 - preserve W.8 known-good build and W.9 approved prompt history.

Priority 1 - W.10 John + controls vertical slice
- approved John in actual gameplay;
- correct rig/hands;
- close shoulder camera;
- responsive movement;
- mantle;
- visible prop-zapper;
- aligned shots and impacts;
- mobile control presets;
- local QA counters.

Priority 2 - Papa's Shop gameplay blockout/route proof
- ensure full expanded map supports the improved controller;
- resolve camera/collision traps;
- validate prop ecology/disguise pool;
- full five-minute round.

Priority 3 - hider polish
- transform safety;
- lock;
- decoy preview/placement;
- flash comfort/readability;
- disguised traversal.

Priority 4 - multiplayer/bots/soak
- remote interpolation;
- reconnect;
- hide-phase privacy;
- bot fairness;
- 15-minute mobile soak.

Priority 5 - propagate to remaining turnaround-approved humans one at a time.

Priority 6 - finish remaining family turnarounds, then authored models.

Do not jump to Priority 5 or 6 merely because Priority 1 is difficult.

======================================================================
58. WHOLE-APP HOME LIBRARY AND NAVIGATION CONTINUITY
======================================================================

Preserve the lodge as one coherent entry point.

Primary shelf order remains:
1. Card Games.
2. Board & Tabletop Games.
3. 3D Family Games.
4. Arcade Corner.

The categories may have different visual personality, but they must still feel like one cabin/lodge product.

Home-screen principles:
- current/seasonal family event can receive a prominent hero treatment without burying normal game access;
- game cards communicate game type and player count quickly;
- Requests replaces Store for the original app navigation where that rename is already locked, while the W.8 Tokens Store remains a separate explicit cosmetic-rewards destination;
- Leaderboards show player names and games won according to the locked W. living-app direction;
- Avatars opens character selection and then outfit/cosmetic choices;
- How to Play opens the game list and relevant visual demo/tutorial;
- post-game choices offer Play Again/Reshuffle where applicable or return to the game shelf without destroying the room unnecessarily.

Do not make the lodge more decorative at the cost of slower access to games.

======================================================================
59. WHO'S PLAYING / ASK TO JOIN CONTINUITY
======================================================================

Preserve the shared social presence system where already implemented or specified.

The home experience should make it possible to understand:
- who is currently playing;
- which game/room they are in where privacy rules allow;
- whether a player can request to join;
- whether the request was accepted or declined;
- how reconnect behaves if the player leaves and returns.

Ask-to-Join is a social convenience, not a bypass around host/room rules.
Do not create duplicate room membership or duplicate player identity if a reconnect token already exists.

======================================================================
60. SEASONAL, BIRTHDAY AND FAMILY-EVENT CONTINUITY
======================================================================

Preserve the living-app event system from Phase W.

Event principles:
- events have explicit windows rather than permanently replacing the normal home screen;
- overlapping events blend predictably rather than stacking every decoration;
- event decorations must not obstruct game access or controls;
- event rewards remain cosmetic/memory/progression oriented rather than power advantages.

Birthday principles:
- the birthday person is featured prominently near the top of the home screen during their event window;
- show their approved avatar/character identity, name and birthday decoration;
- provide a prominent Birthday Challenge button that opens that year's personalized mini-event;
- first open during the event window may show a short personalized greeting sequence;
- family-character greetings are individual pop-ins/reactions rather than one generic combined message;
- dogs may use visual/sound reactions where spoken dialogue is inappropriate;
- after the first viewing, the greeting can be skipped so repeat visits are not interrupted;
- birthday rewards and memories are celebratory, not gameplay power;
- photos/memories remain a family-memory feature rather than a public social network.

======================================================================
61. TABLETOP AND CARD GAME RULE AUTHORITY
======================================================================

W.10 does not rewrite established family card/table rules.

Before changing any tabletop/card mechanic, read the relevant locked rule/test files and preserve the current rule engine unless the user explicitly changes the family rule.

Examples of especially sensitive locked behavior include:
- Screw Your Buddy / Fuck Your Buddy bidding, trump and scoring distinctions;
- Smear bidding/trump/scoring and six-card visibility before bidding;
- Black Gammon starting layout and special dice semantics;
- Backgammon standard legal movement/bar/bear-off/doubling behavior;
- Golf's eight-card family rules including the W.6 discard-without-forced-flip behavior;
- 31 standard rules plus the W.10 Blind definition in this prompt;
- Cribbage sorting and send-to-crib flow;
- Mexican Train personal rack visibility/rearrangement;
- any game-specific tests that encode an explicitly approved rule.

When visual polish and rule correctness conflict, rule correctness wins and the visual treatment must adapt.

======================================================================
62. PERSISTENCE, DATA OWNERSHIP AND SAFETY
======================================================================

Use one coherent profile/persistence model where possible.

Persist only what improves the private family experience, such as:
- profile name/avatar/color;
- cosmetic unlocks/equipment;
- Arcade Tokens;
- tutorial-completion preference;
- achievements/high scores;
- family game history where already supported;
- birthday/event memory metadata;
- room/reconnect identity as required.

Rules:
- do not invent a second competing wallet/profile database;
- validate token grants server-side where a server-authoritative path exists;
- token rewards must be idempotent so reconnect/retry cannot duplicate them;
- do not expose hidden Prop Hunt state to unauthorized clients;
- do not add third-party analytics, advertising or tracking to this private family app unless explicitly requested;
- local developer QA telemetry described in W.10 should avoid collecting unnecessary personal information.

======================================================================
63. PRODUCTION SCORECARD
======================================================================

For a major feature, the development team should score the candidate from 1 to 5 in each category before calling it release-ready:
- Rules/logic correctness.
- Input responsiveness.
- Camera/readability.
- Character/object visual fidelity.
- Animation/game feel.
- Audio/feedback.
- Mobile ergonomics.
- Performance/frame pacing.
- Multiplayer/reconnect robustness.
- Tutorial/first-time clarity.
- Accessibility/comfort settings.
- Regression safety.

A score of 1 or 2 in any core category blocks release.
A score of 3 means functional but needs explicit acceptance as a known limitation.
A score of 4 means strong release quality.
A score of 5 means a reusable benchmark for other games.

For Prop Hunt John/Papa's Shop, do not propagate the system until the core categories are at least 4 on the actual target phone, not just in desktop browser testing.

======================================================================
64. CHANGE CONTROL AND SCOPE DISCIPLINE
======================================================================

Every phase should classify requested work as one of:
- Rule correction.
- Playability repair.
- UX/readability improvement.
- Visual fidelity improvement.
- Performance/technical debt.
- New content.

Resolve in roughly that order unless the user explicitly prioritizes something else.

If a new request arrives during an unfinished flagship repair:
- preserve it in the master prompt/backlog;
- do not silently abandon the flagship quality gate;
- separate unrelated code changes into their own phase when possible.

Historical documents remain archived so a later developer can understand why a decision exists, but historical wording does not outrank the W.10 precedence table.


======================================================================
65. FINAL INSTRUCTION TO THE DEVELOPMENT AGENT
======================================================================

Treat Black Family Game Night as a real game product with a small-team production budget.

Do not optimize for the amount of code written, the number of tests generated or the number of features touched.

Optimize for:
- clarity;
- responsiveness;
- family identity;
- fair multiplayer;
- mobile comfort;
- stable performance;
- readable game state;
- fun full-round play;
- evidence that the thing actually works on the device people will use.

For Prop Hunt specifically, the next milestone is not `more 3D`.

The milestone is:

> ONE APPROVED JOHN, IN ONE EXCELLENT PAPA'S SHOP ROUND, WITH CONTROLS, CAMERA, HANDS, WEAPON, SHOOTING, HIDING AND PERFORMANCE THAT FEEL FINISHED ON A PHONE.

Once that exists, scale the proven system outward.
