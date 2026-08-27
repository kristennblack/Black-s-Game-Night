# BLACK FAMILY GAME NIGHT
# MASTER APP NEXT-BUILD DEVELOPMENT DIRECTIVE
## Home Library Reorganization + 3D/2.5D Arcade Rebuild + Social Join Flow + Family Progression + Seasonal & Birthday Event System

**Planning date:** 2026-08-26  
**Status:** MASTER BUILD DIRECTIVE / SOURCE OF TRUTH FOR THE NEXT APP PASS  
**Base project:** Continue from the latest working Black Family Game Night build. Preserve the Project Constitution, locked game rules, Phase V Prop Hunt world work, existing multiplayer/reconnect systems, and all previously approved functionality unless this directive explicitly changes it.

---

# 1. PURPOSE

The next app pass should make Black Family Game Night feel like one polished, living family game platform rather than a collection of separate prototypes.

This pass has four major goals:

1. Reorganize and improve the **home-screen game library** so games appear in a clear category order.
2. Rebuild the **Arcade Corner** from simple HTML/canvas prototypes into richer, mobile-friendly **3D / 2.5D family mini-games**, while keeping each game distinct.
3. Add a shared **Who’s Playing / Ask to Join** social flow across the app.
4. Add persistent **family progression, achievements, Arcade Tokens, challenges, seasonal events, birthdays, birthday mini-events, and memories**.

Quality matters more than raw feature count. Do not hide weak gameplay behind decoration. Do not sacrifice phone responsiveness for unnecessary visual effects.

---

# 2. PRECEDENCE AND NON-REGRESSION

This directive is cumulative.

- Where this document conflicts with an older next-build prompt, **this document wins**.
- Where this document is silent, preserve the existing Project Constitution and all previously locked rules.
- Do not rewrite working multiplayer, reconnect, bot, room, seat, Ready, chat, history, player-color, or game-rule systems simply to support this pass.
- Keep existing game URLs and saved data compatible wherever practical.
- Automated tests are required, but they are **not visual proof** and are **not phone/device approval**.
- A feature is not considered visually approved until it has been inspected in actual gameplay at the intended device size.

---

# 3. HOME-SCREEN GAME LIBRARY ORDER

The home screen must organize the game shelf in this order from top to bottom:

## 3.1 Card Games
All card-centric games appear first.

Examples include:
- Screw Your Buddy
- Fuck Your Buddy
- Smear
- Skip-Bo
- Euchre
- President
- poker-style games
- UNO-style / Last Card games
- Crazy Eights Countdown
- other card-first games already in the library

## 3.2 Board & Tabletop Games
Board, tabletop, dice, tile, and physical-table-style games appear second.

Examples include:
- Backgammon
- Black Gammon
- Cribbage
- Marbles & Jokers
- Campfire Chaos
- Trail Trouble
- Last Haven
- Rummoli
- other board/table games

## 3.3 3D Family Games
Full 3D family-world games appear third.

Examples include:
- Family Prop Hunt
- Family Island Life
- Birthday Seat
- 3D platform/jumping games
- future full 3D family-world games

## 3.4 Arcade Corner
All arcade-style mini-games appear at the bottom.

The Arcade Corner currently contains 17 games and is part of the major rebuild in this directive.

---

# 4. HOME-SCREEN CATEGORY VISUAL PERSONALITY

Keep one unified cozy Black Family Game Night cabin identity, but give each library section a subtle visual personality.

## Card Games
- warm wood
- tasteful felt/card-table cues
- classic family game-night feel
- clear card-oriented iconography

## Board & Tabletop Games
- polished tabletop presentation
- dimensional boards, pieces, dice, pegs, tiles, or checkers
- less felt-heavy than the card section

## 3D Family Games
- slightly larger, more cinematic cards
- character/environment imagery
- action-forward presentation
- stronger depth and motion cues

## Arcade Corner
- brighter and punchier while still belonging to the cabin
- tasteful glow, animated signage, cabinet/arcade energy where useful
- do not turn the entire app into neon

Do not create four disconnected visual brands. They should clearly belong to the same app.

---

# 5. ARCADE CORNER: 17-GAME QUALITY REBUILD

The entire Arcade Corner receives the quality pass, not only the personalized games.

## Personalized family arcade games
1. Papa’s Paddle Battle
2. Gunner’s Goat Run
3. John’s Shop Bomber
4. James’s Lumber Stack
5. Dorothy’s Garden Merge
6. Logan’s Minefield
7. Nana’s Goat Whack
8. Holly’s Memory Mayhem
9. Lizzie’s Dramatic Lights
10. Vanessa’s Pipe Problem
11. Kelsi’s Rock Hunt
12. Molly’s Light Chase
13. Gunner’s Snack Attack

## General Black Family arcade games
These names remain unchanged and they do **not** need a family member forced onto them:
14. Cabin Breakout
15. Neon Star Patrol
16. Campfire Rocket
17. Neon Snake

---

# 6. ARCADE REBUILD PHILOSOPHY

## 6.1 Move beyond simple prototypes
The current arcade games are too simple visually and mechanically. The next version should feel like actual little games, not lightly customized browser demos.

Upgrade the Arcade Corner toward **mini 3D / 2.5D games** with:
- dimensional environments
- animated family characters and dogs
- proper camera depth
- better lighting
- physical-feeling movement
- particles and effects used selectively
- improved sound
- stronger feedback and impact
- better menus, intros, results, and game-over presentation

## 6.2 Distinct visible world for every game
Each of the 17 games should have its own recognizable visible identity.

The underlying engine may reuse:
- shared renderer
- character rig
- animation controller
- camera helpers
- mobile input
- particles
- audio plumbing
- UI components
- networking
- persistence

But the games must not look like reskins of one shared room.

## 6.3 Theme vs abstraction
Most personalized games should use strongly themed environments tied to the relevant family member.

However, when a more abstract arcade environment makes a game cleaner, faster, or more fun, use the abstract approach. This is especially acceptable for games whose core identity benefits from stylized play space.

The rule is: **distinct and intentional, not forced literalism**.

---

# 7. FAMILY CHARACTER PRESENCE IN ARCADE GAMES

## 7.1 Use actual 3D family avatars
Every upgraded personalized arcade game should visibly use the appropriate family avatar or dog.

Use the existing reusable family character/rig foundation from the larger 3D games wherever practical so improvements can propagate over time.

## 7.2 Playable character where mechanics allow
The family character should be the actual playable/controller character whenever that makes sense.

Do not reduce the character to a decorative host if the mechanic can reasonably be reframed around them.

Examples:
- John can physically move through or interact with a shop game.
- Gunner can physically run through farm obstacles.
- Dorothy can tend/interact with the garden world.
- Vanessa can physically work through a pipe/truck/workshop challenge.

For grid/abstract mechanics where direct character control would damage the game, keep the character physically present and meaningfully reactive.

## 7.3 Keep core outfits
Do not invent game-specific costumes by default.

Keep each family member’s established recognizable outfit/look. Express personality through:
- animation
- stance
- facial expression
- gestures
- props
- environment
- camera
- dialogue/reaction cues

---

# 8. CHARACTER REACTIONS AND CLOSE-UPS

Every personalized arcade game should include short character-specific reaction moments for important events.

Possible triggers:
- winning
- losing
- getting hit
- narrowly escaping
- completing a level
- large combo
- record score
- rare pickup
- dramatic mistake
- multiplayer victory

Use:
- facial expression
- body pose
- quick close-up or camera push
- short reaction animation
- stylized voice/sound cue

These reactions must be brief and must not repeatedly interrupt gameplay.

Examples of personality direction:
- Nana can use “That’s a sin” where appropriate.
- Vanessa can eye-roll or react sarcastically.
- Lizzie can be theatrically dramatic.
- Logan can look reluctant or unimpressed.
- Holly can react sweetly or emotionally.
- Papa can be stubborn/proud/shop-oriented.
- John can use serious fixer energy.
- Gunner should remain large, goofy, mellow, and lovable.

---

# 9. ARCADE AUDIO

For now, use **stylized arcade voices and sound reactions**, not cloned/real family voices.

Build the audio system modularly so real family recordings can be substituted later without rebuilding gameplay logic.

Audio should include where appropriate:
- movement/impact sounds
- environment loops
- character reactions
- combo feedback
- win/loss cues
- multiplayer cues
- event/holiday overlays

Phone speakers must remain intelligible and not overly noisy.

---

# 10. ENVIRONMENTAL INTERACTION

Add selective environmental interaction so each game world feels alive.

Examples:
- small movable objects
- opening a gate/door
- triggered lights
- kicking loose items
- breakable decorations
- reactive animals
- switches/buttons
- little hidden interactions
- family Easter eggs

These are supporting details, not the main objective. Do not clutter the controls or confuse the player about the actual game mechanic.

---

# 11. GAME STRUCTURE: DECIDE PER GAME

Do not force one progression structure across the entire Arcade Corner.

Choose per game from:
- endless score-chaser
- short rounds
- waves
- multi-stage levels
- objectives
- puzzle progression
- mini-adventure structure
- survival mode
- time attack

Use whichever makes the individual game more fun and replayable.

Some games should remain quick pick-up-and-play experiences. Others should become short multi-stage mini-adventures.

---

# 12. PERMISSION TO REDESIGN GAMEPLAY

The arcade upgrade is **not** limited to visual polish.

Keep each game’s recognizable core idea, but substantially improve or expand gameplay when the current version is too shallow.

Permitted improvements include:
- new objectives
- stages
- environmental mechanics
- scoring/combo systems
- character-specific abilities
- special rounds
- bosses where genuinely appropriate
- pickups
- risk/reward choices
- better win/lose loops
- improved pacing
- improved movement
- redesigned controls

Do not preserve a bad mechanic solely because it existed in an early prototype.

**Dorothy’s Garden Merge is a rebuild priority because the current version has been reported as not enterable/playable. Fix the actual entry/gameplay failure before polishing it.**

---

# 13. CAMERA AND ORIENTATION: CHOOSE PER GAME

## 13.1 Camera
Choose the camera that best fits each game:
- third-person
- side-view 3D
- angled/isometric
- top-down 3D
- cinematic fixed camera
- other suitable 2.5D presentation

Do not force one camera template across all 17 games.

## 13.2 Phone orientation
Choose **portrait or landscape separately for each game** based on playability.

Requirements:
- clear orientation handling
- sensible rotation behavior
- correct camera scaling
- UI reflow rather than canvas stretching
- readable touch targets

---

# 14. PHONE PERFORMANCE IS THE PRIORITY

If visual detail and phone smoothness conflict, **phone performance wins**.

Scale down, in this general order, before sacrificing controls/frame pacing:
- distant decoration
- particle counts
- shadow complexity
- background animation density
- post-processing
- nonessential physics
- draw distance/LOD

Preserve visual quality where the player notices it most:
- main character
- nearby environment
- gameplay objects
- readable lighting
- reactions
- effects tied directly to player actions

Target smooth responsive play on normal family phones rather than benchmark-only desktop visuals.

---

# 15. MULTIPLAYER IN ARCADE GAMES

Add multiplayer where it naturally improves the game. Do not force multiplayer into every arcade mechanic.

Reuse the existing Family Game Night infrastructure:
- room
- seats
- Ready flow
- reconnect
- player identity
- player colors
- bot system
- chat/reactions where suitable
- history/rematch where suitable

Potential multiplayer styles include:
- head-to-head
- co-op
- versus survival
- simultaneous race
- shared objective
- family score competition

---

# 16. SOLO MODE IS REQUIRED FOR MULTIPLAYER-CAPABLE ARCADE GAMES

Every arcade game that supports multiplayer must also retain a complete solo mode.

A player must be able to tap the game and play without creating or joining a family room.

Multiplayer is an additional mode, not a gate.

---

# 17. ARCADE BOTS

Multiplayer-capable arcade games must support computer-controlled family-character bots when feasible.

Use the shared difficulty convention:
- Easy = default
- Medium
- Hard

Bots should use actual family avatars and character reactions where appropriate.

Bot behavior must be game-aware. Do not use one generic random-action bot across unrelated games.

---

# 18. WHO’S PLAYING + ASK TO JOIN SYSTEM

Create a shared active-game presence and join-request system across the app, not just the Arcade Corner.

## 18.1 Home-screen presence
If family members are currently inside a game, show useful presence information such as:
- player name/avatar
- game being played
- whether the session can accept requests

Example concept:
“John + Vanessa are playing Black Gammon.”

## 18.2 Ask to Join
Tapping an active game/session should allow an eligible family member to choose **Ask to Join**.

The active host/session receives an in-game prompt:

> “[Player] wants to join your game.”  
> **YES** / **NO**

## 18.3 Accepted request
If the game can safely add the player mid-game:
- join immediately
- preserve fairness and existing match state

If the game cannot safely add a player mid-round:
- enter as spectator/waiting participant
- automatically become eligible for the next round/game

## 18.4 Declined request
A declined request should return a simple friendly status to the requester without disrupting the game.

## 18.5 Reconnect compatibility
Join requests, accepted participation, spectatorship, and next-round eligibility must coexist with the existing reconnect system.

---

# 19. ARCADE CORNER FAMILY LEADERBOARD + ACHIEVEMENT HUB

Create a shared Arcade Corner progression area covering all 17 arcade games.

Track meaningful per-game records rather than forcing all games into one universal score.

Possible stats:
- high score
- wins
- streaks
- fastest clear
- best combo
- survival time
- multiplayer records
- bot difficulty records
- special challenge records
- game-specific achievements

Show which family profile holds each record.

---

# 20. COSMETIC REWARDS

Achievements and records can unlock cosmetic rewards such as:
- avatar emotes
- victory poses
- profile badges
- Arcade Corner/cabinet decorations
- home-screen trophies
- event decorations
- profile flourishes

Cosmetics must **not** provide gameplay advantage.

---

# 21. MIXED REWARD SYSTEM

Use both:

## Achievement-specific unlocks
Special achievements directly unlock unique cosmetics, trophies, poses, badges, or decorations.

## Shared Arcade Tokens
Normal play and challenges also award a shared **Arcade Token** currency that can be spent on general Arcade Corner cosmetics.

---

# 22. ARCADE TOKENS: EARNED ONLY

Arcade Tokens are strictly earned through play.

There must be:
- no real-money purchase
- no paid currency
- no monetization
- no pay-to-win
- no paid cosmetic store

Arcade Tokens are a private family progression mechanic only.

---

# 23. SHARED TOKEN WALLET ACROSS ALL 17 ARCADE GAMES

Arcade Tokens earned in any Arcade Corner game go into the same family-player wallet.

Tokens may be spent on general Arcade Corner cosmetics regardless of which game generated them.

Rare game-specific achievement rewards may remain exclusive to the game/achievement that earned them.

---

# 24. CROSS-DEVICE PROFILE PERSISTENCE

Persist the following to the family player profile across devices:
- Arcade Tokens
- achievements
- high scores
- records
- unlocked cosmetics
- badges
- birthday/event collectibles
- challenge progress where appropriate

Use server-backed/profile-backed persistence with local caching/fallback where practical.

Do not make a player’s progression depend solely on one browser’s localStorage.

---

# 25. DAILY AND WEEKLY ARCADE CHALLENGES

Add rotating daily and weekly Arcade Challenges.

Challenge examples:
- play 3 different arcade games
- beat a Medium bot
- achieve a target combo
- complete a game-specific objective
- play a multiplayer round
- win with another family member
- complete several stages

Rewards can include:
- Arcade Tokens
- badges
- cosmetics
- special challenge rewards

Challenges should encourage variety without becoming chores.

---

# 26. FAMILY-WIDE COOPERATIVE CHALLENGES

Add family-wide shared goals where all family profiles contribute.

Examples:
- cumulative arcade score
- total games completed
- multiplayer sessions
- total achievements earned
- shared event target

Show a visible family progress meter.

Shared rewards can include:
- Arcade Tokens
- family trophies
- badges
- special decorations
- cosmetics

---

# 27. WHOLE-APP SEASONAL AND SPECIAL EVENT SYSTEM

Seasonal and special events should theme the **whole Black Family Game Night app**, not only the Arcade Corner.

Events may affect:
- home screen
- game cards
- background environment
- participating game environments
- lighting
- ambient effects
- music/sound layer
- temporary challenges
- achievements
- earnable cosmetics

Do not alter core rules or make the games less readable.

---

# 28. EVENT WINDOW

For single-day holidays and birthdays, use this standard active window:

- begin **5 days before** the event
- include the event day
- continue **5 days after**

This creates an 11-day event window for single-day events.

For multi-day events, start five days before the event begins and continue five days after the event ends.

The event system should calculate annual dates automatically.

---

# 29. DEFAULT YEARLY EVENT CALENDAR

Include a default Canadian/family-friendly yearly calendar.

At minimum:
- New Year’s Day — January 1
- Valentine’s Day — February 14
- Easter — calculated annually
- Mother’s Day — second Sunday in May
- Father’s Day — third Sunday in June
- Canada Day — July 1
- Canadian Thanksgiving — second Monday in October
- Halloween — October 31
- Christmas — December 25

Also support lighter seasonal ambient identity for:
- winter
- spring
- summer
- fall

The holiday/special-event layer has priority over generic seasonal ambience.

---

# 30. EVENT OVERLAP AND BLENDING

If a birthday overlaps a holiday or seasonal event, **blend the themes**.

Rules:
- birthday person remains the main focus
- seasonal/holiday elements support the birthday presentation
- do not completely erase either theme
- avoid visually chaotic combinations
- preserve legibility and phone performance

Example: a birthday near a holiday can keep the holiday environment while birthday banners, character spotlight, challenge, and rewards become the dominant layer.

---

# 31. FAMILY BIRTHDAY CALENDAR

Add these annual birthday events:

| Family member | Birthday |
|---|---|
| James | February 2 |
| Logan | March 17 |
| Holly | March 28 |
| Dorothy | April 6 |
| Kristen | April 15 |
| Papa | July 19 |
| Nana | August 18 |
| Elizabeth / Lizzie | August 27 |
| John | September 28 |
| Vanessa | October 6 |

Dog birthdays are planned but dates remain **TBD**:
- Kelsi
- Molly
- Gunner

Do not invent the dog birthday dates. Leave them unset until provided.

---

# 32. BIRTHDAY HOME-SCREEN SPOTLIGHT

During a birthday event window, feature the birthday person near the top of the home screen.

Include:
- their avatar
- their name
- birthday decorations
- personality-specific visual details
- countdown to the birthday before the date
- birthday-day state
- count-up / “birthday week” state after the date where appropriate
- prominent **Birthday Challenge** button

Keep the normal game order underneath:

**Card Games → Board & Tabletop Games → 3D Family Games → Arcade Corner**

The birthday module should not hide or scramble the normal game library.

---

# 33. PERSONALIZED BIRTHDAY MINI-EVENT

Each family member receives one small temporary personalized birthday challenge or mini-event during their birthday window.

This is **not** a new permanent game shelf entry every year.

The mini-event should reflect that person’s established personality, interests, family jokes, or environment.

Examples of direction only:
- John: fixing ridiculous shop problems
- Nana: judging/reacting to family chaos
- Lizzie: dramatic birthday performance
- Papa: shop/tractor/motorcycle/tinkering challenge
- Logan: fishing/outdoor/reluctant teen challenge

Do not use the same template with only names swapped.

---

# 34. BIRTHDAY REWARDS

Birthday-event rewards that are earned remain **permanently unlocked** after the event ends.

Use a mixed return model:

## Core birthday rewards
Return in future years so someone who missed them can earn them later.

## Year-specific collectibles
Each year may add a small number of dated/unique collectibles.

Example concept:
- recurring John Birthday badge
- separate 2026 John collectible
- different 2027 John collectible

Once earned, both recurring and year-specific rewards stay permanently attached to the profile.

---

# 35. PERSONALIZED BIRTHDAY GREETING SEQUENCE

When the birthday person first opens the app during their event window, present a short personalized birthday greeting sequence.

## Individual messages, not one generic group card
Family characters should pop in individually with short reactions/messages matching:
- their personality
- their relationship to the birthday person
- established family jokes

Examples:
- Nana’s reaction should sound like Nana.
- Vanessa can be sarcastic/eye-rolling.
- Lizzie can be theatrical.
- John can be serious/fixer-oriented.
- Papa and Nana can bicker lightly where appropriate.

Dogs should participate through animation, sound, props, or visual reactions rather than forced human dialogue.

## Repeat viewing
- first viewing should be allowed to play as the full special sequence
- after the first viewing, it must be immediately skippable
- do not make repeat app openings annoying

---

# 36. BIRTHDAY PHOTO + MEMORY GALLERY

Add a birthday photo/memory gallery for each family profile/event.

The system should be designed so the family can gradually add:
- photos
- short captions
- memorable moments
- prior birthday memories
- year labels where useful

The gallery should grow over time rather than reset every year.

Design principles:
- warm and personal
- optional to browse
- does not block gameplay
- preserves the private-family nature of the app
- works well on phone
- can later support richer media without redesigning the entire birthday system

Do not fabricate memories or photos. The app should only display family-provided content.

---

# 37. ARCADE GAME-SPECIFIC CREATIVE DIRECTION

Use these established directions as starting points. They are not limits on mechanic improvement.

## Papa’s Paddle Battle
- Papa’s Shop / wood / clutter / tractor / motorcycle / yellow chair / fireplace warmth
- paddle game can become a dimensional shop challenge
- Papa reactions and shop personality

## Gunner’s Goat Run
- farmyard, mud, fences, tractors, trucks, pens, animals
- Gunner as oversized goofy playable dog
- running/crossing/escort/obstacle energy

## John’s Shop Bomber
- workshop maze / lumber / shelves / tools / welding / tires / crates / machinery
- harmless mechanical chaos
- wrench/tool pickups
- substantial gameplay expansion allowed

## James’s Lumber Stack
- timber / boards / beams / cabin workshop
- calm, practical presentation
- satisfying dimensional stacking/physics where performant

## Dorothy’s Garden Merge
- garden world physically grows and changes
- merge chain can move from seed/sprout/flower/planter/garden/greenhouse concepts
- Dorothy physically present and reactive
- current entry/play failure must be repaired first

## Logan’s Minefield
- harmless outdoor hazards rather than literal warfare
- mud holes, fishing hooks, tangled line, rocks, geese/outdoor obstacles
- fishing/outdoor visual identity

## Nana’s Goat Whack
- goats/pigs/chickens/farm objects
- comic family-safe impact
- Nana’s reactions, including “That’s a sin” when appropriate

## Holly’s Memory Mayhem
- sweet toy/squishy-inspired world using original designs
- dogs, hoodies, colorful objects, cupcakes/game-night objects
- warm and playful rather than babyish

## Lizzie’s Dramatic Lights
- dimensional stage/dance/light environment
- dramatic camera reactions
- ballet/stage cues
- theatrical character presentation

## Vanessa’s Pipe Problem
- truck/campsite/backyard/workshop plumbing feel
- sarcasm and competitive reactions
- dimensional pipe/environment interactions

## Kelsi’s Rock Hunt
- princess-dog personality
- collectible rocks and exploration
- playful dog movement

## Molly’s Light Chase
- light-based chase/reaction game
- Molly’s silly tongue-out energy
- visually lively but performance-safe effects

## Gunner’s Snack Attack
- large goofy farm dog
- snack pursuit / obstacle / timing mechanics
- physical comedy and expressive animation

## Cabin Breakout
- keep the name
- remain a general Black Family arcade game
- upgrade its cabin/brick-break identity into a richer dimensional presentation

## Neon Star Patrol
- keep the name
- remain a general Black Family arcade game
- can remain more abstract/stylized if that improves readability

## Campfire Rocket
- keep the name
- remain a general Black Family arcade game
- dimensional campfire/outdoor theme, fast readable play

## Neon Snake
- keep the name
- remain a general Black Family arcade game
- abstract arcade presentation is acceptable
- make the 3D/2.5D depth improve the game rather than obscure the grid/path logic

---

# 38. SHARED TECHNICAL FOUNDATION FOR ARCADE REBUILD

Build common reusable systems first where doing so is efficient, including:
- lightweight 3D/2.5D scene bootstrap
- shared family avatar loader
- shared animation-state interface
- camera helpers
- touch/keyboard/gamepad input abstraction where relevant
- scalable quality settings
- particle budget controls
- shared audio/reaction manager
- intro/results card system
- multiplayer hooks
- bot hooks
- achievement/progression hooks
- seasonal/event decoration hooks

Visible game worlds must still remain distinct.

---

# 39. EVENT DECORATION HOOKS IN GAMES

Games should expose safe decoration slots or event hooks rather than hard-coding every holiday into gameplay.

Examples:
- background props
- sky/lighting tint presets
- small decorations
- particles
- temporary music layer
- event pickups/challenge markers
- birthday banner/character spotlight

Do not allow event content to:
- cover controls
- change collision unexpectedly
- create unfair multiplayer visibility
- break saved state
- tank phone frame rate

---

# 40. PERSISTENCE AND DATA MODEL PRINCIPLES

Design progression/event data so it can evolve without corrupting player profiles.

Recommended separation:
- player identity/profile
- game-specific records
- achievement ledger
- Arcade Token balance and transaction history
- cosmetic unlock inventory
- active daily/weekly challenges
- family cooperative challenge progress
- event/birthday reward ledger
- greeting-seen flags per event/year
- birthday memory-gallery metadata

Use stable IDs rather than display names as permanent keys where practical.

---

# 41. SECURITY / FAIRNESS / PRIVATE FAMILY APP PRINCIPLES

This remains a private family/friends game app.

- Do not add monetization.
- Do not expose private family content publicly.
- Treat server-authoritative multiplayer state as the source of truth where fairness matters.
- Do not trust client-only score submissions for meaningful records if multiplayer/server verification is available.
- Avoid join-request spam and duplicate session actions.
- Preserve reconnect behavior.

---

# 42. VISUAL STYLE

The overall visual target is a **blend of realism and stylization**:
- recognizable family likenesses
- believable materials
- dimensional objects
- clear lighting
- colorful and expressive presentation
- game-like exaggeration where fun
- not photorealistic
- not blocky prototype geometry

Think “miniature animated family world,” with quality concentrated where players interact.

---

# 43. ACCEPTANCE CRITERIA

This next app pass should not be considered complete until the following are true.

## Home screen
- game shelf order is Card → Board/Tabletop → 3D → Arcade
- section headers are clear
- section styles are distinct but unified
- existing links/saves are not unnecessarily broken

## Arcade
- all 17 games are present
- the four general games retain their names
- Dorothy’s Garden is enterable and playable
- each game has a distinct visual identity
- personalized games visibly use the appropriate family character/dog
- character reactions are working
- phone controls are responsive
- camera/orientation choices make sense per game
- performance is prioritized over decorative excess
- gameplay has been materially improved where prototypes were too shallow

## Multiplayer/social
- applicable arcade games retain solo mode
- bots support Easy/Medium/Hard, with Easy default
- active game presence is visible
- Ask to Join flow works
- host can accept/decline
- safe mid-game join vs spectate/next-round behavior works
- reconnect remains functional

## Progression
- shared Arcade leaderboard/achievement hub exists
- Arcade Tokens are earned-only
- shared wallet works across all 17 arcade games
- cosmetics are non-gameplay
- cross-device profile persistence works
- daily/weekly and family cooperative challenges work

## Events
- annual calendar calculates correctly
- 5-before / event / 5-after window works
- birthday and holiday themes blend
- home-screen birthday spotlight works
- Birthday Challenge button works
- birthday mini-event works
- individual character greeting sequence works
- greeting becomes skippable after first viewing
- birthday rewards persist
- core rewards return in later years
- new annual collectibles can be added
- birthday memory gallery exists and only shows provided content

---

# 44. QA AND RELEASE GATES

Run automated tests, but also perform explicit manual/visual QA.

Minimum visual/device checks should include:
- representative portrait phone
- representative landscape phone
- desktop browser
- home library scrolling through all four sections
- at least one arcade game from each camera/orientation style
- multiplayer Ask to Join flow
- bot flow
- token/achievement persistence after reload
- cross-device/profile persistence where environment permits
- overlapping birthday + holiday presentation
- birthday greeting first view and repeat view
- Birthday Challenge entry
- event decoration performance

Do not claim phone/device approval if it has not actually been observed.

---

# 45. BUILD ORDER

A sensible implementation order is:

1. Snapshot and validate latest working build.
2. Fix Dorothy’s Garden entry/play failure.
3. Build shared lightweight arcade 3D/2.5D foundation.
4. Reorganize home screen into the four locked categories.
5. Upgrade the 17 arcade games in manageable batches while preserving distinct worlds.
6. Add shared avatar/reaction/audio hooks.
7. Add multiplayer-capable arcade modes, solo fallback, and bots where appropriate.
8. Add Who’s Playing / Ask to Join system.
9. Add profile-backed leaderboard, achievements, Arcade Tokens, and cosmetics.
10. Add daily/weekly and family cooperative challenges.
11. Add whole-app event calendar and decoration hooks.
12. Add birthday spotlight, Birthday Challenge, greetings, rewards, and memory galleries.
13. Run regression, automated, visual, multiplayer, and mobile-performance QA.

Do not attempt to hide unfinished steps by marking them complete based only on tests.

---

# 46. FINAL NON-NEGOTIABLES

- Preserve the family identity of the app.
- Preserve previously locked game rules.
- Keep the four general arcade game names unchanged.
- All multiplayer-capable arcade games also have solo mode.
- Bots use Easy/Medium/Hard with Easy default.
- Phone performance wins over decorative excess.
- Camera and orientation are chosen per game.
- Character reactions and personality matter.
- Arcade Tokens are earned only and shared across the Arcade Corner.
- Cosmetics never affect game balance.
- Family progression persists across devices.
- Seasonal/birthday events theme the whole app.
- Event windows use five days before and five days after.
- Birthday + holiday themes blend, with the birthday person as the focus.
- Birthday rewards remain unlocked once earned.
- Core birthday rewards return; annual collectibles can be unique.
- Birthday greetings are individual-character messages and skippable after first viewing.
- Birthday memory galleries only contain family-provided photos/memories.
- Kelsi, Molly, and Gunner birthday dates remain TBD until supplied.
- Automated tests do not equal visual approval.


---

# 47. LOCKED PHASE W.1 JOIN RESPONSE + DOROTHY GARDEN ADDENDUM

These requirements are now part of the current living-app contract and must not regress in later builds.

## 47.1 Home-screen Ask to Join response loop

- A join request must carry the actual live room ID, game ID/name, requester profile, and target player profile/name.
- The requester must never be left without an answer after the target responds.
- A decline must be shown clearly on the requester home screen as a join-request result.
- An acceptance must be claimable by the requester automatically, without requiring them to hunt for an invite link.
- If the accepted room is still in lobby, the requester enters as a normal player and can choose a seat / Ready as usual.
- If the accepted room is already in an active match, do not mutate the established hand/turn/player-order state. Enter the requester immediately as a safe spectator and clearly explain that they will become a normal participant when the group starts the next game.
- Presence must not advertise a room as joinable when all normal player seats are already occupied.
- Accepted/declined result handling must be idempotent so refreshes do not repeatedly re-open an already-claimed room or replay old result notices.

## 47.2 Dorothy's Garden Merge visual/gameplay contract

- Preserve the readable 4x4 square gameplay footprint, but do not present merge pieces as generic colored boxes.
- Every merge stage must visually resemble what its displayed name says it is.
- Locked progression chain: Seed Packet -> Tiny Sprout -> Daisy Pot -> Lavender Pot -> Rose Planter -> Peony Bed -> Cottage Flower Bed -> Blooming Trellis -> Greenhouse Corner -> Cottage Garden -> Dorothy's Family Garden.
- Overall art direction: warm, pretty, lively cozy-cottage garden with dimensional / faux-3D materials and depth.
- Empty cells must remain visibly placeable prepared-soil beds.
- Merge-ready matches must be unmistakable through glow/pulse/wiggle/sparkle feedback without hiding the plant artwork.
- Successful merges may use petals/bloom feedback.
- Garden zones visually upgrade as progression advances: Potting Corner, Cottage Beds, Blooming Walk, Greenhouse Corner, Dorothy's Family Garden.
- Themed garden obstacles may appear with progression and must remain understandable gameplay elements: weeds, tangled roots, garden stones, broken pots. Strong merges can clear them.
- Dorothy-specific set dressing is part of the identity, including her watering can and birdbath; future additions may include gloves, garden stool, seed packets, baskets, teacup planters, or family touches as long as they do not obscure the grid.
- Gameplay clarity outranks decorative density. The garden should feel alive, not cluttered or hard to read.

# 48. LOCKED PHASE W.2 GAMMON + START REPAIR ADDENDUM

Backgammon and Black Gammon are the visual gate for the next release. The board must occupy approximately 90-95% of useful gameplay width, preserve long rectangular proportions, use a shallow dimensional presentation without distorting checker faces, and strongly favor landscape readability. Every checker in state must be physically visible. Checker faces are true round 1:1 beveled discs. Standard Backgammon keeps the authoritative 15-checker 2/5/3/5 mirrored setup. Black Gammon keeps its authoritative 4/4/4/3 setup and uses the same physical board geometry with a darker skin. The center Bar is a vertical raised physical divider and captured checkers visibly stack there. Bear-off trays are built into the board and visibly retain borne-off checkers. Player home is bottom-right from the viewer perspective. Point numbers remain subtle. Controls live beneath the board. Black Gammon retains blue Forward, red Backward and gold Rescue language.

Trail Trouble and Prairie Pots must transition from lobby into gameplay reliably. Start controls must state why start is blocked. Host flow may combine readiness and start as Ready & Start. Valid solo testing should offer Quick Start vs Computer, adding a Medium bot and creating a valid start state. Team-mode player-count requirements remain authoritative.

---

# PHASE W.3 LOCKED ADDENDUM — VANESSA + LOGAN ARCADE UPGRADE

Phase W.3 implements the approved Vanessa and Logan specifications as a cumulative non-regression update.

- Vanessa's Pipe Problem: detailed dimensional pipes, physical rotation, animated flow, themed repair hazards, detailed grey transport/work truck, and Vanessa's signature pink GMC-style pickup on the transport deck.
- Logan: replace Minefield rules with Trail Logic: exactly one dirt bike per row, column and connected terrain region; no touching including diagonals; 6x6 through 9x9 Journey progression; Daily Puzzle; outdoor dirt-bike/fishing presentation; conflict feedback; X marks; hints.
- Preserve the legacy Logan URL `/logans-minefield.html` for saved links/platform compatibility while presenting the game as Logan's Trail Logic.
- These changes are cumulative with W.1 and W.2 and must not regress prior join flow, Dorothy Garden, Gammon visual repair, Trail Trouble, or Prairie Pots fixes.
