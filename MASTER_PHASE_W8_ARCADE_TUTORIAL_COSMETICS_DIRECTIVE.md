# MASTER PHASE W.8 — ARCADE TUTORIAL + AVATAR TOKEN STORE DIRECTIVE

**Release target:** `GAME-NIGHT-STAGING-PHASE-W8-ARCADE-TUTORIAL-STORE-33`

Phase W.8 is cumulative with W.1-W.7. It adds a consistent arcade onboarding system and an earned cosmetic economy without weakening the approved family-character identity lock.

## 1. Detailed visual tutorial contract
Every active Arcade Corner game must expose an in-game **HOW TO** control. A tutorial is not a rules paragraph. It must show the player, step by step:
- the primary control/input;
- the main objective;
- the important hazard/failure rule;
- the scoring/progression/win condition;
- game-specific tips where useful.

Each active arcade tutorial must contain at least four visual steps. Logan's Trail Logic remains the quality reference: simple visual demonstration, short text, one idea per step, Back/Next controls, and a way to reopen the tutorial during later play.

## 2. Per-player tutorial choice
On first use of each arcade game, each local profile is offered:
- **SHOW TUTORIAL**
- **SKIP FOR ME**

That preference is stored per profile and per arcade game. Skipping the first-time lesson never removes the HOW TO button. Tutorials must remain manually reopenable.

Logan retains his existing tutorial preference flow; the shared W.8 system must not double-prompt Logan.

## 3. Active arcade coverage
The tutorial system must cover all 16 active arcade titles:
Papa's Paddle Battle; Gunner's Goat Run; John's Shop Bomber; James's Lumber Stack; Dorothy's Garden Merge; Logan's Trail Logic; Nana's Goat Whack; Holly's Memory Mayhem; Lizzie's Dramatic Lights; Vanessa's Pipe Problem; Molly's Light Chase; Gunner's Snack Attack; Cabin Breakout; Kelsi's Rock 'n' Roll Rescue; Campfire Rocket; Neon Snake.

Legacy self-contained arcade pages remain self-contained. Their W.8 tutorial code may be embedded inline rather than adding a dependency that breaks the single-file contract.

## 4. Arcade Token economy
Arcade Tokens are an **earned-only in-game reward currency**. There is no real-money checkout and no token purchasing.

Current earn rules:
- +5 Arcade Tokens the first time a profile plays each arcade game;
- +10 Arcade Tokens once per day after that profile plays three different arcade games that day.

Server-side rewards linked to an achievement id must be idempotent. Repeating the same reward request may not grant the token amount twice.

## 5. Tokens Store
Expose a dedicated Tokens Store from the Lodge, Arcade Trophy Wall, and arcade-game status controls.

The store supports three independent equipment slots:
1. **Hat**
2. **Glasses**
3. **Accessory**

Initial catalog includes multiple choices in every slot. Items have Arcade Token prices, unlock state, equipped state, and can be removed/re-equipped after unlocking.

Unlocks and equipped selections persist per profile and sync through the server-backed Arcade profile when available.

## 6. Cosmetic identity lock
Cosmetics are removable additions. They may never alter:
- skin tone;
- face shape/features;
- approved hair colour/style;
- body proportions;
- approved base clothing;
- dog coat colour/markings;
- character identity.

The approved turnaround remains the identity source of truth. **Cosmetics layer over the character. They do not redesign the character.**

## 7. 2D avatar presentation
Equipped items should appear on the player's avatar anywhere the shared avatar renderer is used, including home/lobby/table surfaces where space allows.

Do not automatically place a player's cosmetic loadout onto a different named family mascot in an arcade game. A mascot only shows the player's cosmetics when that mascot is also the selected player avatar.

## 8. 3D attachment contract
For future authored/lightweight 3D avatars, reserve semantic cosmetic sockets:
- Hat → `HeadTop`
- Glasses → `Face`
- Accessory → `ChestAccessory`

Cosmetics should be lightweight child meshes attached to these sockets. Do not edit the base approved character mesh to add or remove a store item. LOD/culling should be appropriate for phones.

A cosmetic may not be used as justification to mark an otherwise-unapproved character GLB as approved.

## 9. Mobile UX
HOW TO and STORE controls must remain touch friendly, readable, and reachable on small phones. Tutorial overlays must reflow without page-level horizontal clipping. Store cards must become a one-column layout on narrow screens and preserve usable tap targets.

## 10. Release gate
Before release:
- all 16 active arcade games have >=4 detailed tutorial steps;
- every arcade keeps a working HOW TO entry point;
- first-time Show/Skip is profile-specific;
- self-contained legacy arcade files remain self-contained;
- store contains hats, glasses and accessories;
- buy/equip/unequip is server validated when online;
- duplicate reward requests cannot duplicate server tokens;
- equipped cosmetics render without changing base identity;
- W.7 Prop Hunt character/combat locks remain intact;
- full regression and staging validation pass from the finished ZIP.
