# Black Family Game Night v1.6.0-prop-mystery-test

Private family game-night web app test build focused on a deeper **Family Prop Hunt** and **Family Mystery** experience while retaining the v1.5 visual/tabletop polish, v1.2.6 phone Cribbage fixes, global card sorting, cabin home, avatar packs, bots and the original synchronized multiplayer games.

## Prop Hunt overhaul

- One active third-person Prop Hunt engine, with the older conflicting prototype removed.
- Full-body family movement figures in the world instead of circular head markers.
- Approved avatar-style portraits in setup/HUD; Country, Rustic and Rich use their approved themed full-body movement sprites when available.
- Larger analog phone joystick with explicit touch handling, D-pad backup, Jump, Sprint, Camera Reset, Prop, Flash, Decoy, Lock/Unlock and Shoot controls.
- Desktop movement remains WASD + mouse/camera controls.
- Jump buffer, coyote-time forgiveness, gravity, landing, collision, low-object stepping, climbable geometry and trampoline/bounce behavior.
- Illustrated/cartoon prop renderer for environmental items, with the same renderer used when a hider transforms into that item.
- Locked disguised players remain visually still while the camera can move independently.
- Four family maps remain: Papa's Shop, Camper / Campsite, Backyard + Fire Pit, and Farmyard / Animal Pens.
- Six-round family rules remain: 30-second hide, 3-minute hunt, 3 additional prop changes, 10 decoys, one flash per disguise and three-hit health.
- Easy / Medium / Hard computer players remain supported without hidden-information cheating.

## Family Mystery overhaul

- Illustrated family-room board and full-body moving family standees retained from the polished tabletop branch.
- Legal destinations now display the exact movement cost after a dice roll.
- FIT, ME, zoom and pan controls make the large board easier to navigate on phones.
- Sticky phone action tray keeps Roll, Suggest, Accuse and End Turn controls reachable.
- Detective notebook is grouped into Suspects, Objects and Locations.
- Seen/revealed cards are marked automatically; players can also flag suspicious possibilities.
- Public Case History records each suggestion and who disproved it, while keeping the actual privately shown card secret.
- Standard suggestion movement is supported: a suggested suspect is pulled into the room and may make a suggestion from there on their own turn without first rolling out.
- Secret family shortcuts/passages remain available from supported rooms.
- Final accusations now have a confirmation screen before locking the answer.
- Correct accusations reveal the full three-card case file: suspect, object and location.
- Wrong accusers leave the active turn rotation but still participate when they must disprove a suggestion.
- Easy / Medium / Hard computer detectives continue to use only information they are legally allowed to know.

## Other retained improvements

- Phone-focused Cribbage layout with accessible GO / Score Hand / Continue actions above the player's cards.
- Pegging cards remain visible, and end-of-hand scoring can show/highlight the exact scoring combinations.
- Shared standard-card sorting: Spades, Hearts, Diamonds, Clubs; Ace through 2 within each suit.
- Approved family avatar/style packs and per-computer character/look/difficulty setup.
- Detailed lodge home and animated fireplace.
- The original 18 room games retain their synchronized Cloudflare multiplayer flow and shareable room links.

## Multiplayer status

The original 18 room games are the synchronized cross-device online games. Family Mystery, Family Prop Hunt and John's Birthday Seat are still the newer local/computer test engines; their share links open the correct game, but their live game state is not yet synchronized between separate devices.

## Verify

Run:

```sh
npm run check
```

The packaged v1.6.0 test build passed **180 / 180 automated tests**.
