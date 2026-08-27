# Phone QA: Phase L New Games Shelf 09

Confirm visible build ID:
`GAME-NIGHT-STAGING-PHASE-L-NEW-GAMES-SHELF-09`

## Home shelf
- [ ] Open the Game Shelf after a hard refresh/reload.
- [ ] Find the **New Table Games** section.
- [ ] Confirm **Mexican Train** is visible with Create Game / Create & Share.
- [ ] Confirm **Skip-Bo** is visible with Create Game / Create & Share.
- [ ] Confirm **Backgammon** is visible with Create Game / Create & Share.

## Launch checks
- [ ] Create a Mexican Train room and reach its lobby/table.
- [ ] Create a Skip-Bo room and reach its lobby/table.
- [ ] Create a Backgammon room and reach its lobby/table.
- [ ] Confirm bots can be added where supported.
- [ ] Return to Game Shelf and confirm all three remain visible.

## Cache check
If the old shelf appears after deployment, close/reopen the site or hard refresh once. This release uses a new service-worker cache ID specifically to retire the prior shelf.
