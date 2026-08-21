# Black Family Game Night v1.0.2

A private family multiplayer game lodge built as a birthday gift for John Black.

## Included
- 18 playable games
- Real-time rooms and private hands
- Invite links, seating and Ready flow
- Text chat and reactions
- Optional WebRTC voice chat
- Reconnect and persistent room state
- PWA / Add to Home Screen support through the browser's normal menu
- Original 20-character avatar library with four styles each
- John Black special Birthday Guy host avatar

## v1.0.2 launch hardening
- Removed the in-app Install App button. Installation is still available through the browser's normal Add to Home Screen flow.
- Includes the v1.0.1 Cloudflare live-room stream fix.
- Added an immediate room-state fetch plus live EventSource updates.
- Added an 8-second connection watchdog with Retry Connection and Back to Game Shelf controls.
- Added a visible v1.0.2 badge so it is easy to confirm the newest app code is being served.
- Bumped the service-worker cache to force fresh launch assets after deployment.

## Cloudflare
This package is purpose-built for Cloudflare Workers + a SQLite-backed Durable Object.

For the existing live repository, follow `UPDATE_EXISTING_LIVE_APP.txt`.
For a brand-new setup, see `GITHUB_CLOUDFLARE_GUIDE.txt`.

## Tests
Run `npm run check` to syntax-check the app and execute the full test suite.
Final package result: **82 / 82 passing** on 2026-08-21.
