# W39 True-3D Cabin Furniture — Real-Device QA

Candidate: `GAME-NIGHT-STAGING-CANDIDATE-W39-TRUE3D-CABIN-FURNITURE-58`

## Gate A — Benchmark load
Open:
`/cabin-furniture-benchmark.html`

Confirm:
- true perspective 3D room appears, not the flat SVG fallback;
- 14 x 16 ft room reads with real floor/wall depth;
- window, door, trim, beams and room lighting are visible;
- bed, reading chair, nightstand, lamp, dresser, rug, wall TV and desk chair are all visible.

Expected QA tiers after model loading:
- Double Cabin Bed -> `production-qa-glb`
- Kristen Reading Chair -> `production-qa-glb`
- Live-Edge Nightstand -> `production-qa-glb`
- Warm Table Lamp -> `production-qa-glb`
- dresser/rug/wall TV/desk chair -> `w39-design-specific-fallback` until bespoke GLBs replace them.

Any `legacy-generic-fallback` on these eight benchmark objects is a defect.

## Gate B — Visual realism
Capture one landscape/desktop screenshot and one phone screenshot from the fixed benchmark camera.
Check:
- furniture has dimensional silhouettes;
- bed/chair/table/lamp read at believable relative scale;
- pieces contact the floor/table correctly;
- nothing visibly floats or sinks;
- contact shadows ground large objects;
- walnut/wood does not look like plastic;
- leather reads differently from linen/wool;
- metal reads differently from wood/fabric;
- lamp bulb/light looks warm without blowing out the scene;
- window opening does not read as a black void;
- furniture does not visibly penetrate walls.

## Gate C — Camera / touch
On phone:
- one-finger drag orbits smoothly;
- two-finger pinch zooms in/out;
- camera does not flip, jump or tunnel through the room;
- Reset Camera returns to the fixed benchmark composition;
- UI remains tappable without obscuring the room.

## Gate D — Benchmark interaction
Use the benchmark buttons:
- select each of the eight objects;
- toggle the lamp on/off;
- confirm the QA state updates;
- confirm the four W25 GLBs report loaded instead of load error.

## Gate E — Live Cabin editor
Open a real owned room, for example:
`/cabin.html?room=kristen`

Verify:
- adding an item chooses a valid open location rather than piling all items at one default point;
- moving furniture cannot push its physical footprint through the room boundary;
- solid furniture cannot be saved overlapping another solid furniture piece;
- rugs may layer under furniture;
- unsupported wall/floor placement is rejected;
- 90-degree rotation rechecks physical bounds;
- duplicate finds open space or reports that no valid space is available;
- a server-rejected save stays rejected instead of silently appearing saved locally;
- save + reload reproduces the same legal room state.

## Gate F — Interaction hooks
- reading chair exposes seat target;
- bed exposes sleep target;
- nightstand exposes decor-surface target;
- lamp toggles visible light and retains state after save/reload;
- dresser/storage exposes storage hook;
- wall TV exposes screen hook.

Do not fail W39 because final full-body sit/lie/drawer animations are not yet authored; those are separate character/furniture animation gates. Do fail if the hooks are missing or physically wrong.

## Gate G — 3-minute stress loop
For at least 3 minutes:
- orbit and pinch repeatedly;
- select different furniture;
- toggle lamp repeatedly;
- add/move/rotate/duplicate/store several pieces in the live room;
- save/reload at least twice.

Record:
- visible stutters;
- model pop/failure;
- black/missing materials;
- touch loss;
- camera lock;
- save rejection bugs;
- device overheating or severe frame-rate collapse.

## Final grade
**GREEN:** benchmark visibly improves on the old flat runtime, four W25 GLBs load, spatial rules work, touch is usable, no serious performance defect.  
**AMBER:** clear improvement but one or more visible/material/scale/touch/performance defects remain.  
**RED:** SVG fallback is normal path, production GLBs fail, furniture still collapses to generic shapes, physical placement can corrupt rooms, or phone experience is not usable.

A real-device screenshot/video is mandatory before Device Approved status.
