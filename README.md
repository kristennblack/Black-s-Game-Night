# Black Family Game Night v1.2.6-test

Private family game-night web app for phones and computers.

## What changed in v1.2.5

### Family Prop Hunt visual + control rebuild

The Prop Hunt engine has been rebuilt around the approved third-person cabin look instead of the earlier placeholder boxes and circular face markers.

- **Actual joystick bug fixed:** the joystick math was attempting to modify `const` values, which threw a browser error on every drag. It now uses mutable coordinates and has been verified with a real headless-browser touch gesture.
- Added an explicit iPhone/Safari touch fallback in addition to Pointer Events.
- The small arrow pad remains available as a redundant movement control on phones.
- Family players now render as the packaged **full-body 3D family sprites**, not circular head portraits.
- Hiders disappear into their disguise exactly as expected.
- World props are no longer labelled cubes. They render as illustrated cartoon objects such as mugs, buckets, oil/gas cans, toolboxes, welding helmets, shop vacs, crates, stools/chairs, sawhorses, hay bales, wheelbarrows, rocks, stumps, firewood/logs, lanterns, coolers, tires, flower pots, watering cans, barrels, troughs, pallets, dog toys, feed bags, pool floats, shovels and animal feeders.
- **The scenery prop and disguised-player prop use the same renderer**, so if you become a gas can, you look like the same cartoon gas can that was already sitting in the map.
- Large scenery now has recognizable illustrated forms too, including tractors, motorcycles, fireplaces, furniture, beds/bunks, workbenches/tables, shelving, trucks, tents, BBQs, hot tubs/pools, trampolines, boats, trailers, trees, sheds/shops, hay stacks, sea cans and climbing platforms.
- Floating world-name labels were removed.
- The approved Prop Hunt scene and art-pack references are included in the build for continued visual tuning.

### Approved family avatar packs remain selectable

The 12 v1.2.4 family packs remain wired into the live multiplayer avatar system for all 13 family characters and pets: Anime, Western, Rich, Homeless, Country, Chinese-inspired, African American-inspired, Native American-inspired, South Asian-inspired, Korean-inspired, Superhero, and Criminal Crew. The existing Cute/Goofy/Rugged/Glam looks and John's 16 looks remain available too.

## Other retained updates

### Cribbage

- Visible pegging table showing played cards, owner and running count.
- Pair / 15 / 31 / run scoring feedback during pegging.
- End-of-hand card review with tappable scoring groups that highlight the exact scoring cards.
- Large persistent SEND SELECTED CARDS TO CRIB control.

### Family Prop Hunt

- Active third-person engine only; legacy top-down version remains removed.
- Working character/outfit/start controls.
- Human begins round one as a hider for immediate movement testing.
- WASD, phone joystick/direction pad, jump, prop, decoy, flash and lock controls.
- Jump buffering/coyote timing and clearer movement-status messages.

### Other retained features

- Approved Black Family Lodge home with animated fire/glow/embers.
- 18 synchronized Cloudflare multiplayer games.
- Family Mystery, Family Prop Hunt and John's Birthday Seat local/computer modes.
- 13 approved full-body 3D family runner choices.
- Per-computer family character + Easy / Medium / Hard setup.
- Working home-screen destination buttons and share/invite paths.
- Rebuilt 32-step John's Birthday Seat course.

## Online sharing

The 18 original room games are synchronized multiplayer. **Create & Share** creates a private room and shares its exact join URL, and active rooms retain Share Invite / Copy Link controls.

Family Mystery, Family Prop Hunt and John's Birthday Seat have direct Share Game links, but their gameplay state is still local to each device in v1.2.5. They are not yet synchronized between separate devices.

## Validation

Run:

    npm run check

The v1.2.5 test release passes **147 / 147 automated checks** with zero failures. A separate browser interaction smoke test also verified a real touch joystick gesture moved the player more than 100 world units, JUMP produced positive vertical velocity, and PROP successfully transformed the player into a nearby illustrated object.

## v1.2.6-test

Phone-focused Cribbage polish and global hand sorting:

- Cribbage now sizes its table to the small mobile viewport rather than enforcing the old 760px minimum.
- GO, manual score, and count-continue actions are mirrored into a large action strip immediately above the hand on narrow screens.
- The phone Cribbage board, pegging area, count review, and hand use more compact dimensions while retaining the full gameplay information.
- Standard playing-card hands are grouped Spades, Hearts, Diamonds, Clubs and sorted Ace-to-2 within each suit.
- Custom non-standard decks retain category grouping while numeric ranks sort high-to-low.
- All prior v1.2.5 Prop Hunt, avatar, multiplayer, Lodge, and Birthday Seat work is retained.
- Automated regression status: 150/150 passing.
