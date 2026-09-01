# W48 Phone QA — Holly 30 Looks Shop 66

1. Deploy the W48 ZIP to staging and hard refresh/reopen.
2. From the Lodge open **Looks Shop**.
3. Confirm both John and Holly tabs appear.
4. Open Holly and confirm all 30 approved Holly portraits are present.
5. Compare Holly's face to `visual_proofs/holly_30_looks/HOLLY_APPROVED_GAME_AVATAR_SOURCE.png`; confirm identity remains Holly and eyes read blue.
6. Buy one paid Holly look with tokens; confirm token balance decreases once and the look remains owned after reload.
7. Equip that Holly look; return to the Lodge/profile and confirm the same portrait is shown.
8. Confirm locked Holly looks cannot be equipped directly from the avatar picker.
9. Play Holly's Memory Mayhem and confirm reward behavior:
   - first win can unlock Gamer Holly;
   - Medium <= 14 moves can unlock Story Time Holly;
   - Hard <= 18 moves can unlock Sparkle Tiara.
10. Confirm John's W47 30-look collection still purchases/equips normally.
11. Confirm no unrelated game, cabin or multiplayer regression is visible.
