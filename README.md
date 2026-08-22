# Black Family Game Night v1.2.4-launch

Private family game-night web app for phones and computers.

## What changed in v1.2.4

### Approved family avatar packs are now selectable

The newest approved avatar artwork is now wired into the live multiplayer character closet instead of only being stored as reference art.

For each of the 13 family characters and pets, the build includes these 12 additional selectable packs:

- Anime
- Western
- Rich
- Homeless
- Country
- Chinese-inspired
- African American-inspired
- Native American-inspired
- South Asian-inspired
- Korean-inspired
- Superhero
- Criminal Crew

That is **156 newly packaged family avatar images** (12 packs x 13 characters/pets), plus the matching full-pack review sheets.

The existing artwork remains available:

- Non-John family characters keep Cute, Goofy, Rugged and Glam.
- John keeps all 16 existing Birthday Boy looks.
- All original non-family avatar characters remain in the game.

### Character-first selector

The lobby still uses the approved flow:

1. Choose a character.
2. See only that character's available looks.
3. Choose the avatar look and colours.
4. Use Back to Characters to switch people/pets.

For family characters, the approved style packs are displayed in their own section beneath the original looks.

### Computer players can use the avatar packs

Host controls now include a separate **Avatar style** selector for every computer player.

A computer can therefore be configured independently, for example:

- Papa / Criminal Crew / Hard
- Gunner / Superhero / Easy
- Kristen / Chinese-inspired / Medium

Changing a computer's character refreshes the available style list for that character. Bot difficulty remains Easy / Medium / Hard and does not change the no-cheating hidden-information rules.

### Home Avatar destination

The cabin home's Avatars button now opens a gallery showing the family roster plus all 12 approved style-pack sheets.

## Kept from v1.2.3

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

Family Mystery, Family Prop Hunt and John's Birthday Seat have direct Share Game links, but their gameplay state is still local to each device in v1.2.4. They are not yet synchronized between separate devices.

## Validation

Run:

    npm run check

The v1.2.4 test release passes **143 / 143 automated checks** with zero failures, including new checks for every approved avatar-pack file, human selection wiring, the home Avatar gallery, and computer-player character/style/difficulty persistence.
