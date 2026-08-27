# Phase W.1 - Join Response + Dorothy Garden

Release marker: `GAME-NIGHT-STAGING-PHASE-W1-JOIN-GARDEN-26`

## Join flow repair

The home-screen Ask to Join loop now transports the live room ID with the request, records the target name for clear requester feedback, polls both incoming and outgoing request status, and exposes accepted/declined results.

Accepted requests are claimed through the backend. Lobby rooms admit the accepted requester as a normal player. Active matches admit the requester as a spectator so current hands, turn order and game engines are not mutated mid-match. The spectator state is visible to the client and the requester receives an explanatory in-room banner. The next rematch/new game converts joined spectators back to normal players and assigns seats through the existing room start flow.

Presence now marks a room joinable only while a normal player seat remains available.

## Dorothy's Garden Merge rebuild

The previous colored-tile presentation has been replaced by a cozy cottage-garden board while preserving the reliable 4x4 merge grid underneath. Each named merge stage has distinct vector-drawn garden artwork. Empty cells are prepared soil beds, matching merge candidates glow/pulse and sparkle, successful merges emit petals, and garden zone progression upgrades the frame/set dressing.

The progression chain is:

1. Seed Packet
2. Tiny Sprout
3. Daisy Pot
4. Lavender Pot
5. Rose Planter
6. Peony Bed
7. Cottage Flower Bed
8. Blooming Trellis
9. Greenhouse Corner
10. Cottage Garden
11. Dorothy's Family Garden

Progression can introduce themed fixed garden jobs (weeds, tangled roots, garden stone, broken pot). Strong merges clear one garden job and award a small care bonus. Dorothy-specific watering-can and birdbath props are included in the visual frame.

## QA

- Full Node test suite: 418/418 passing after changes.
- Build validator: 196 pass, 0 fail, 2 environment warnings.
- Backend join integration test: lobby acceptance -> player; active-match acceptance -> spectator; spectator state visible in public room state.
- Inline Dorothy game JavaScript syntax check passed.
- Automated visual screenshot could not be produced because the container's Chromium executable hangs even on a minimal blank/data page. No claim of real-device visual approval is made.
