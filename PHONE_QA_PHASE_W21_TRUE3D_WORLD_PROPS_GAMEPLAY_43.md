# W.21 Real-Device QA — True-3D Cabin + Gameplay Recovery

Use the deployed W.21 build after a hard refresh/service-worker update.

## Cabin
- Open Kristen's room and at least two other personal rooms.
- Confirm the room is visibly 3D, not an SVG/photo backdrop: orbit the camera and verify wall/floor/furniture parallax.
- Confirm real shadows and dimensional window/door geometry are visible.
- In an empty room, confirm no furniture is pre-placed.
- Place a starter blueprint and a purchased blueprint.
- Tap the 3D furniture itself. Confirm it selects.
- Tap the floor/wall and confirm the selected object moves to the tapped 3D location.
- Rotate, duplicate, store/remove, save, reload, and confirm persistence.
- Apply a wall finish and floor finish and confirm they change the 3D materials.
- Test portrait + landscape phone/tablet layouts.

## Blackgammon
- Start a two-player/bot game and reach movement after rolling/allocation.
- Do **not** select a die.
- Confirm every checker with a legal move glows/can be tapped.
- Tap a checker, then one of its highlighted destinations. Confirm the move resolves.
- Repeat from the bar if a checker is on the bar.
- Tap a die and confirm it acts only as an optional move filter.

## Deck Sweep
- Play away one face-up card so its mystery card is uncovered while you still have cards in hand.
- Confirm the mystery card is tappable and still shows as unknown before play.
- Risk a mystery card lower/equal to the pile and confirm normal play.
- Risk a mystery card higher than the pile and confirm the full center pile is picked up.
- Confirm a mystery 10 still sweeps.

## Trail Trouble
- From the game shelf tap `Play Now vs Computer`.
- Confirm the game itself starts without stopping in an inert lobby.
- Make at least three legal moves and confirm turn advancement.

## Prairie Pots
- From the game shelf tap `Play Now vs Computer`.
- Confirm the game itself starts without stopping in an inert lobby.
- Play through several sequence actions and confirm chip pots/turns update.

## Mexican Train
- Test desktop, phone portrait and phone landscape.
- Build or load long personal/community trains.
- Confirm every played domino remains reachable/visible by wrapping or board scrolling.
- Confirm private and community headers show their full placed-tile counts.
- Confirm the player's rack remains usable while inspecting long trains.

## World Props
- Open `/world-props-catalog.html` and verify search/category/map/rarity filters.
- Spot-check Papa's Shop, Camper, Backyard/Fire Pit and Goat/Farm in Prop Hunt for catalog-driven clutter.
- Spot-check Family Mystery and Island Life for shared visual language.
