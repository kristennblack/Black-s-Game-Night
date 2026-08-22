# Black Family Game Night v1.2.0-launch

Private family game-night web app for the Black family, built for phones and computers.

## Lodge
The home screen uses the approved realistic cabin scene with John, John's Birthday Seat, the birthday portrait over the fireplace, cabin decor, and an animated fire/glow layer. The underlying game shelf, lobby, avatars, rooms, chat/reactions and room-preserving game switching remain part of the existing app.

## Games
The package keeps the 18 original multiplayer games and adds playable tryouts for:
- Family Mystery
- Family Prop Hunt
- John's Birthday Seat

## Solo / computers
Hosts can add computer players in Easy, Medium or Hard difficulty to the 18 original multiplayer games. The three new games also include computer-play options so they can be tested or played with one human.

## Sharing
For original multiplayer games, Create & Share creates the private room first and shares the exact room URL. Inside each room, Share Invite and Copy Link remain available. New-game pages have a Share Game control that opens the chosen game directly.

## New-game multiplayer status
The original 18 games use the synchronized Cloudflare room engine. The new Mystery/Prop Hunt/Birthday Seat tryouts are currently local/computer-play engines; their direct links navigate friends to the same game but do not yet synchronize the new 3D/local game state between devices.

## Validation
Run:

    npm run check

The launch candidate includes automated regression tests covering original games, computer-player seat fill, sharing paths, the animated Lodge, Family Mystery visuals/bots, 3D Prop Hunt hooks, and Birthday Seat.
