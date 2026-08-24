# PHONE QA — GAME-NIGHT-STAGING-PHASE-F-PLATFORM-04

Before testing, confirm the visible build ID is exactly:

**GAME-NIGHT-STAGING-PHASE-F-PLATFORM-04**

If it is not, stop and clear/reload the staging cache before reporting defects.

## A. Home / profile platform

1. Open Home in portrait on the main phone.
2. Check title, John framing, game shelf and destination buttons for overlap/cropping.
3. Open **Avatars**.
4. Choose a different character, outfit/style and player colour.
5. Confirm the preview's clothing tint changes while face/hair/skin do not.
6. Save, reload, and confirm the saved profile returns.
7. Create a room and confirm those choices are the defaults.
8. Change the look in the pre-game room to prove overrides still work.

## B. Requests

1. Open **Requests**.
2. Submit one request in each useful category.
3. Reload.
4. Confirm the request remains and shows name/category/status.
5. Verify empty text is rejected and phone keyboard does not cover the Submit control.

## C. Leaderboards

1. Complete a short test match.
2. Return Home → Leaderboards.
3. Confirm the winner appears once.
4. Open the relevant game-specific view.
5. Reopen/reload the victory screen if possible and confirm the same match is not counted twice.

## D. How to Play / Game School

Test at least:
- Smear
- Screw Your Buddy
- Fuck Your Buddy
- Trail Trouble
- one additional card game
- one other board/3D game

Confirm the tutorial:
- never joins a live room;
- gives short sequential instructions;
- required highlighted actions wait for the correct tap;
- Back / Restart / Exit work;
- does not create leaderboard wins.

## E. Smear bidding

1. Start a real 4-player room.
2. At the first bid, confirm your **six cards are all visible before you bid**.
3. Confirm rank/suit on all six can be read on portrait phone.
4. Confirm bidding controls do not cover the hand.
5. Have each player confirm only their own cards are visible.
6. Reconnect one player during bidding and confirm the same six-card hand returns.
7. Continue playing and confirm normal legal card taps play immediately.

## F. Universal game end

Test at least:
- Smear
- one Buddy game
- one extra card/board game
- Trail Trouble
- Prop Hunt or Birthday Seat when practical

At match completion confirm:
- winner/result displayed;
- KEEP PLAYING present for the host where a shared rematch is required;
- RETURN TO GAME SHELF present;
- rematch keeps players/avatars/colours/settings/bots;
- scores/cards/board state reset;
- old match does not remain active behind the new one.

## G. Trail Trouble five-card hand

1. Start with humans and at least one bot.
2. Confirm **five cards** appear in your hand immediately.
3. Confirm another player's card identities are not visible.
4. Tap one legal card.
5. Confirm legal markers/destinations highlight.
6. Complete the move without a redundant Confirm button.
7. Confirm played card goes away and a replacement arrives, returning hand to five.
8. Play several turns and confirm unplayed cards persist.
9. Reconnect and confirm your same current five-card hand returns.
10. Confirm bot also behaves as a five-card player.

## H. Trail Trouble movement / board

Test:
- 1-space move
- 4 backward
- 5+ spaces
- 7 split when available
- 10 +10 / -1
- 11 swap
- Hit the Trail / card 2 launch
- Send Packing
- Cabin Call
- normal bump/send-back
- Safe Trail / Home

For multi-space movement, verify the marker visibly follows the route spaces rather than teleporting directly to the destination.

## I. Trail Trouble gestures

On the board surface:
- two fingers apart = smooth zoom in;
- two fingers together = smooth zoom out;
- one-finger drag on empty board = pan;
- pinch/pan does not select markers;
- ordinary tap still selects cards/markers;
- browser page itself does not pinch-zoom while operating the board;
- zoom limits feel sensible;
- **RESET VIEW** restores normal board framing.

## J. Visual-quality status

Take screenshots of:
- Home portrait
- Avatar Hub
- Smear bid with six cards
- Requests
- Leaderboard
- one tutorial step
- Trail full board at default view
- Trail zoomed-in view with five-card hand

The 3D games still have a known authored-art gap. Do not use this package to judge that gap as solved. If reporting a 3D gameplay defect, include build ID and QA diagnostics when possible.
