# W.13 Cabin Rooms Production Plan

## Immediate build order

### 1. Data and persistence foundation
- Stable room-item catalog IDs.
- Rename long-term currency to Game Night Tokens.
- Add blueprint ownership model.
- Add server-authoritative gift and salvage transactions.
- Add room save schema with revision number and owner validation.

### 2. One-room vertical slice
Use one neutral 14 × 16 room and 24 representative items spanning:
- bed;
- chair;
- dresser;
- TV;
- lamp;
- rug;
- wall frame;
- wallpaper;
- flooring;
- window/door;
- tabletop decor;
- pet bed;
- animated aquarium/electronic item;
- collectible trophy.

Prove phone placement, 90° rotation, invalid-overlap feedback, save/reload and undo before expanding the asset library.

### 3. Dollhouse shell
- Two-storey family cabin.
- Central great room/staircase.
- Family room labels.
- Smooth aerial-to-room camera transitions.
- Expandable room socket visualization.
- Guest house initial block.

### 4. Visitor layer
- Read-only room state for visitors.
- Simultaneous visitor bubbles.
- Reaction events.
- Guest book.
- Trophy inspection cards.

### 5. Economy/reward hooks
- Game Night Token earns across game families.
- Arcade milestone event hooks.
- Collection Book.
- gifts;
- duplicate salvage;
- seasonal/birthday metadata.

### 6. Content scale
Only after the editor and room renderer pass phone performance gates should the 400 catalog assets be authored/ported at full scale.

## Key technical risk
The largest risk is not catalog size. It is allowing a room with dozens/hundreds of independently textured meshes to overwhelm a phone browser. Build the room renderer around shared materials, LOD/culling and lazy asset loading before the final art production wave.
