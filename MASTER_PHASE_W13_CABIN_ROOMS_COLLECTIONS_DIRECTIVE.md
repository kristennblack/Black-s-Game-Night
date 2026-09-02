# BLACK FAMILY GAME NIGHT
# MASTER PHASE W.13 — CABIN ROOMS, COLLECTIONS + GAME NIGHT TOKENS

Planning date: 2026-08-28
Status: **HIGHEST-PRECEDENCE CABIN/META-GAME DESIGN DIRECTIVE**
Design release: `GAME-NIGHT-DESIGN-PHASE-W13-CABIN-ROOMS-COLLECTIONS-37`
Runtime base: `GAME-NIGHT-STAGING-PHASE-W12-GAMEPLAY-CORRECTIONS-36`

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
