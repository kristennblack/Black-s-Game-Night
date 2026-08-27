# Phase W.4 Gammon + Card Mobile Repair 29

## Scope
Focused repair built cumulatively on Phase W.3. Vanessa, Logan, Dorothy, join-request behavior, Trail Trouble/Prairie Pots start repairs, and all other prior game work are preserved.

## Backgammon
- Removed viewer-dependent point mirroring. Every device now renders the canonical physical board numbering: top 13-24 left-to-right, bottom 12-1 left-to-right.
- Preserves the engine's standard 15-checker 2/5/3/5 mirrored setup and renders it against those fixed physical points.
- Removes generic extra-game max-height/overflow cropping from Gammon and lowers the board fit floor so small phones can fit the complete physical case.
- Legal movement remains board-first: checker source then destination directly on the board.

## Black Gammon
- Preserves the locked 4/4/4/3 start and aligns it to the canonical setup reference for every viewer.
- Both players' rolled normal dice remain visible at opposite sides/corners of the physical board.
- Replaces ordinary move-list interaction with dice-first play: choose playable die/set -> checker -> destination.
- Four distinct singles are allocated by tapping two shared dice directly; the remaining two automatically go to the opponent.
- Matching-set action controls remain only for allocation/direction decisions required by doubles, triples and related matching sets.
- No-legal-move states auto-advance client-side so normal play does not require a miscellaneous action button.

## Standard card hands
- Standard hands above eight cards become horizontally swipeable phone trays.
- Large hands retain readable card faces and reliable touch targets instead of shrinking/clipping cards 9-13.
- Large-hand label explicitly tells the player to swipe to see all cards.

## QA limitation
Container Chromium screenshot capture is unreliable in this environment, so this release is source/engine/automated validated but still requires actual-device visual approval after deployment.

## Release identity
GAME-NIGHT-STAGING-PHASE-W4-GAMMON-CARD-MOBILE-REPAIR-29
