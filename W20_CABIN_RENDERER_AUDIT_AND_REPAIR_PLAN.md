# Black Family Game Night — W20 Cabin Renderer Audit

## Finding
The bedroom screenshot is not a temporary graphics failure. The current room runtime is fundamentally a 2D DOM/SVG decorator, while the realistic cabin/dollhouse work remained a visual target and reference layer.

## Exact failure path

1. `public/cabin.html` contains only the page shell and loads `cabin.js`; it does not create a WebGL/Three.js room canvas.
2. `public/cabin.css` renders `.room-scene` with `cabin-assets/generated/empty-room-shell.svg` as the background.
3. `empty-room-shell.svg` is a flat illustrated perspective plate containing the walls, floor, window, door and lamp.
4. `public/cabin.js` places furniture as absolutely positioned HTML `<button>` elements containing `<img>` artwork. Position is converted to percentages and the image is rotated in CSS.
5. Wall/floor finishes are repeated 2D image layers over the SVG plate.
6. Therefore the owner can select/move/rotate an item, but the item never becomes a true object occupying a 3D room.

## Where the project drifted
W19/W20 correctly expanded item identity and catalog compatibility, but the implementation solved the catalog problem with SVG browse/placeable assets. The reports explicitly describe 2,000 browse SVGs, 2,000 placed/preview SVGs and a smaller procedural 3D bridge for priority games. The long-term master direction still calls for a true 3D cabin, but that renderer was never promoted into the cabin room runtime.

The key production mistake was allowing the 2D fallback/prototype decorator to become the primary shipped room editor. Automated checks then validated catalog IDs, ownership, placement state and asset uniqueness without requiring a real 3D visual acceptance gate. As a result, tests could be green while the actual room still looked flat.

## Required repair

### 1. Replace the room scene, not the artwork around it
Keep the current sidebar/inventory/guest-book UI if desired, but replace `.room-scene` with a true Three.js/WebGL canvas.

### 2. Build the 14 × 16 ft room at real scale
Create actual wall, floor, ceiling/trim, door and window geometry. The empty starting room remains a simple pine shell, but it must have depth, lighting and perspective.

### 3. Use the approved cabin realism target
Use warm pine, realistic roughness, soft window daylight, warm practical lighting, believable shadows, dimensional trim and the same visual family as the cabin/home artwork.

### 4. Convert placed blueprint records into 3D scene objects
The saved record can remain `itemId, x, z, rotation, surface`, but the renderer must resolve that record into a model/procedural 3D asset instead of an `<img>`.

### 5. Make editing raycast-based
Tap/click a furniture mesh to select it. Use raycasting against the floor/walls for move placement, with the current move/rotate/store/duplicate buttons as accessible fallbacks.

### 6. Preserve mobile simplicity
Tap object → highlighted mesh → tap reachable floor/wall position. Keep gentle snapping and clear placement bounds. Do not turn this into a complicated CAD editor.

### 7. Architectural catalog pieces need real openings
Windows and doors cannot be stickers. Placement must create or select valid wall openings/frames. Wallpaper/wall finishes should map to materials, not flat overlays floating above the room.

### 8. 2D should become fallback only
The SVG room can remain as an emergency compatibility fallback when WebGL cannot initialize. It should not be the normal path.

### 9. New release gate
A cabin-room release is not visually accepted unless a real device screenshot proves:
- perspective depth and real room geometry;
- furniture with dimensional silhouettes and shadows;
- correct item scale;
- selection/movement in the actual 3D scene;
- windows/doors/finishes integrated into geometry;
- no obvious flat cutout furniture.

## Recommended production sequence
1. One empty production-quality 14 × 16 room shell.
2. One window + one door + one wall finish + one floor finish.
3. Five starter items as true 3D objects.
4. Complete tap/select/move/rotate/store/duplicate loop.
5. Phone screenshot and interaction proof.
6. Expand the model registry by catalog collection/hero priority.
7. Reuse the same shared prop/model registry in Family Mystery, Prop Hunt, Island Life and Molly's Light Chase.

## Bottom line
The catalog work is useful and should be preserved. The room renderer is the piece that needs replacement. Do not spend another pass polishing the current SVG room shell as though it can become the designed 3D experience through styling alone.
