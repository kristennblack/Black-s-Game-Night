# CABIN ROOMS DESIGN BIBLE W.13
## Black Family Game Night persistent home, collection and family-history system

### Product fantasy
Every person has a place in the family cabin. The room starts ordinary. Over months of game nights it fills with things that only make sense to this family: a trophy from a ridiculous arcade achievement, a birthday keepsake from a particular year, a framed family photo, a game-machine reward, a dog bed Kelsi keeps stealing, or a deeply unnecessary golden toilet that immediately becomes family folklore.

The room is therefore **not a housing simulator bolted onto the app**. It is the visual record of participation.

### Experience pillars
1. **Recognizably yours** — a visitor should be able to guess whose room it is before reading the label.
2. **Accomplishment is visible** — trophies and rare pieces explain what the owner did to earn them.
3. **Decorating is low-friction** — mobile-friendly free placement, gentle snap, 90° rotation, clear undo/cancel.
4. **The cabin grows with the family** — personal expansions change the aerial floor plan; new players permanently grow the guest house.
5. **Visiting matters** — rooms are meant to be seen, reacted to and remembered.
6. **No pay-to-progress nonsense** — Game Night Tokens come from playing; there is no real-money room economy.
7. **Warm, not noisy** — rare effects are tasteful enough that the shared cabin still feels cozy.

### Recommended cabin composition
**Ground floor:** central great room + staircase, shared kitchen, games room, deck access, selected family rooms.

**Upper floor:** remaining family rooms, trophy-hall overlook/movie nook, room-expansion sockets.

The exact location of each family room should be art-directed later around the final cabin shell. Do not encode emotional hierarchy through room size/location. Everyone begins with the same base room scale.

**Guest house:** visually related but distinct building on the same cabin property. Add rooms in predictable blocks so the structure can grow without remaking the entire map whenever a guest joins.

### Room editor modes
- `VIEW`: clean room presentation with visitor bubbles, reactions and inspectable trophy/memory objects.
- `DECORATE`: owner-only placement UI.
- `SHOP PREVIEW`: temporary preview layer over the owner's saved room.

Do not combine them into one cluttered HUD.

### Decorator interaction loop
1. Open inventory/catalog tray.
2. Pick item.
3. Ghost preview appears at a valid default anchor.
4. Drag freely.
5. Nearby valid grid/wall alignments provide gentle magnetic snap.
6. Red/invalid preview when overlap or room bounds fail.
7. Rotate 90°.
8. Confirm placement.
9. Item becomes a saved instance referencing catalog item ID.
10. Undo remains available.

### Item rendering strategy
The full catalog is a **library**, not a scene. A room only loads its placed items. Identical placed items share cached geometry/materials. Large animated pieces use LOD. Tiny decorative pieces may use aggressive distance culling. Catalog thumbnails do not load 3D scenes until a player requests preview.

### Social visiting
The initial social layer is intentionally light:
- who is currently viewing;
- live reaction bubbles;
- guest book;
- trophy/memory inspect cards.

Avatar walking can be added after the room editor and visiting pipeline prove stable. It should not delay the first useful social release.

### Dogs
Kelsi, Molly and Gunner become ambient life in the cabin. Room items can expose simple semantic tags such as `dogRest`, `dogToy`, `dogFood`, `dogLookAt`. Dog navigation should choose valid open targets and never rearrange furniture or block editing.

### Collections
Furniture sets make shopping navigable but should never become dress codes. A person can place a Glam vanity beside a Papa's Shop trophy beside a fishing rod rack if that is what makes the room feel like them.

### Reward philosophy
A shop item says **I chose this**.
A game reward says **I did this**.
A birthday heirloom says **I was here when this happened**.
A secret item says **I found something weird**.
The room needs all four types to become meaningful.

### Launch catalog
See `CABIN_ROOMS_400_ITEM_MASTER_CATALOG_W13.xlsx` for the authoritative 400-item list and build metadata.

The catalog intentionally has more earned items than a conventional furniture store would, because the app's unique advantage is that its games and family events can feed the room system directly.
