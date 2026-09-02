# BLACK FAMILY GAME NIGHT
## MASTER NEXT BUILD DIRECTIVE
### Phase V - Family Prop Hunt: Papa's Shop World Expansion, Living Map & Round Experience

## GOVERNING CONTINUITY RULE

Continue from the latest working Black Family Game Night build.

Before changing anything, treat these three sources as governing:

1. The latest working project ZIP.
2. `BLACK_FAMILY_GAME_NIGHT_PROJECT_CONSTITUTION.md`.
3. The latest cumulative `MASTER_NEXT_BUILD_DEVELOPMENT_DIRECTIVE.md`.

Do not restart the project. Do not rebuild unrelated systems. Preserve all approved work from prior phases, including the Phase T / T.1 Prop Hunt camera, movement, animation, hiding-screen, hunter-release and shooting-control work, plus all later arcade and tabletop additions.

This phase is a focused flagship upgrade to **Family Prop Hunt**, beginning with the **Papa's Shop** map.

---

# 1. PRIMARY GOAL

Papa's Shop currently feels too small, too constrained and too sparse for a satisfying Prop Hunt match.

The Phase V objective is to transform it from a small test arena into a **large, replayable family farm / workshop property** that feels like a real flagship multiplayer map.

The most important success criterion is not raw polygon count. It is this:

> The map must feel dramatically larger, easier to chase through, richer with hiding opportunities, more alive, more interactive, and fun for up to 12 players without feeling cramped.

The first priority is **world scale and routing**. Animation and control polish remain important, but they should now be exercised inside a map worthy of them.

---

# 2. REQUIRED MAP SCALE

Increase the **actual traversable gameplay footprint** of the Papa's Shop map to approximately **8 times the current playable area**.

This means real walkable, hideable, searchable space. Do not satisfy the requirement by only extending the skybox, decorative terrain, unreachable background or empty scenery.

The expanded map should feel less like "one little shop" and more like a **small rural property** containing a major shop, attached / nearby barn, equipment yard, large pens, lumber/material storage, open grass and exterior circulation.

The design language should favor a **big warehouse / large open-zone feel**, not a cramped maze of tiny rooms.

Use large spaces broken up by believable equipment, shelving, work areas, stalls, vehicles, lumber, pens, props and vertical routes.

---

# 3. FLAGSHIP PAPA'S SHOP ZONES

Build the expanded map around recognizable anchor zones. The exact dimensions may be tuned during implementation, but all of the following should exist and connect naturally.

## A. Main Papa's Shop

Make the shop dramatically larger than the current version.

Include:
- multiple large shop bays
- wide work aisles
- workbenches
- toolboxes
- shelving
- welding equipment
- cords / hoses
- machinery
- buckets
- oil / fluids
- gas cans
- shop vacs
- stools
- mugs
- beer cases
- lumber and material stacks
- sawhorses
- wrenches / hammers / tools
- large overhead / shop doors
- smaller man doors
- climbable and hideable structures where sensible
- multiple routes through the space

Preserve **Papa's old yellow tattered chair with high curved arms beside the fireplace** as a permanent landmark.

The chair and fireplace area should remain recognizable even when surrounding secondary props randomize.

## B. Barn

The barn must be **fully playable, searchable and enterable**.

Expand it significantly and include:
- stalls
- open center aisle
- hay / feed storage
- ladders
- loft or upper storage route
- catwalk / loft movement where safe
- multiple doors / exits
- windows / openings where appropriate
- climbable hay or storage routes
- animal details

Avoid making the barn a one-door trap. Players should have multiple meaningful ways to enter, exit or change elevation.

## C. Animal Pens

Make the pens substantially larger.

Requirements:
- easy to jump into
- easy to jump or route back out of
- generous movement space around fencing
- no narrow collision pockets that pin players
- gates or low sections that create readable routes
- goats and pigs as ambient life
- muddy / worn ground variation
- feeding / watering objects
- shelters / small structures

The pens should be usable as real chase and hiding spaces, not decorative cages.

## D. Equipment Yard

Create a large exterior equipment / work yard containing recognizable machinery and large props.

Include:
- climbable tractor
- old motorcycle as a visible and usable large prop
- trailers / implements where appropriate
- pallets
- tires
- lumber
- barrels
- bins
- work tables
- scattered farm / shop equipment

Leave enough open ground around large objects for chasing and camera recovery.

## E. Lumber / Material Storage

Create a dedicated lumber / material zone with:
- stacked boards
- beams
- pallets
- pipe / steel / miscellaneous materials
- sawhorses
- covered and uncovered storage
- routes between stacks
- safe climbable surfaces where reasonable

Do not turn it into a collision labyrinth. Preserve wide movement lanes.

## F. Outdoor Apron and Grass

Greatly enlarge the exterior apron and open outdoor circulation.

The outside world should visibly include:
- grass
- natural ground variation
- gravel / dirt near work areas
- blue sky when the round's weather preset is clear
- distant trees / tree line
- fencing
- farm / rural horizon treatment

The exterior should feel like a place, not an empty rectangle around the building.

---

# 4. MAP BOUNDARY

Players must always understand where the playable world ends.

Use a clear but visually acceptable boundary treatment such as:
- red survey line / red survey tape
- low fence
- boundary posts
- subtle warning markers
- terrain / tree-line reinforcement

The boundary may use a red line treatment, but it should feel integrated into the farm / worksite rather than like a debug gizmo.

Do not rely on an invisible wall with no visual explanation.

If the player reaches the boundary, movement should stop cleanly without camera collapse, snagging or vibration.

---

# 5. ROUTING STANDARD

The expanded map must be designed for **loops**, not funnels.

Target multiple circulation loops across the property.

For major zones, aim for roughly three meaningful ways in / out whenever practical.

Avoid accidental dead ends.

Any intentional hiding nook that has limited escape should be a conscious high-risk hiding choice, not a collision accident.

Prioritize:
- wide primary chase routes
- narrower secondary hiding routes
- vertical shortcuts
- alternate doors / gates
- windows / loft routes where appropriate
- open outdoor loops
- safe spaces for the third-person camera

No player should routinely become pinned between fences, props, barn walls, doors or equipment.

---

# 6. PLAYER CAPACITY

Design Papa's Shop to comfortably support **up to 12 players**.

The map should remain readable and fun with a mix of hunters and hiders without everyone immediately clustering in the same two rooms.

Distribute:
- hiding hotspots
- traversal routes
- major landmarks
- interactive objects
- large props
- open chase spaces

so the full map gets used.

---

# 7. PROP DENSITY

The map should contain **hundreds of visible prop instances** across the shop, barn, yard, pens, lumber areas and outdoors.

The environment should feel lived-in and slightly cluttered without becoming visually unreadable.

Target approximately **150 interactive or gameplay-meaningful objects** across the expanded property.

These may include:
- usable doors
- gates
- ladders
- light switches
- horns
- buttons
- movable / animated environmental props
- climbable objects
- disguise-relevant props
- noisy distractions
- safe shortcuts

A small number should be **rare / surprising interactions** that players may not discover immediately.

Do not make all 150 interactions equally loud or gimmicky. Most should be natural world interactions, with a few memorable surprises.

---

# 8. INTERACTIVE ENVIRONMENT

The map should be highly interactive.

Examples include:
- open / close doors when safe
- working light switches
- ladders
- climbable surfaces
- gates that open routes
- tractor horn
- shop lights
- fans
- simple machinery animation
- barn doors
- noisy environmental distractions
- interactable storage / work objects

Some interactions may create small tactical chase opportunities, such as opening a shortcut.

However:

> Interactions must never permanently hard-lock another player, close an unavoidable escape path, or create an accidental prison.

Prefer "open a route" over "seal someone in."

---

# 9. DISGUISE SYSTEM - LOCKED ROUND RULE

Use a curated **Papa's Shop disguise pool of approximately 30 possible prop types**.

Each hider receives exactly **4 assigned disguise options for that round**.

These four options:
- are randomly selected each round
- may overlap with options assigned to other hiders
- do not need to be unique across players
- change from round to round
- cannot be rerolled

**No reroll button. No reroll token. No mulligan.**

The four assigned options are what the player has to work with for that round.

Preserve the established rule that a hider may change disguise up to **3 times** after their initial disguise. This naturally maps to the four assigned options: initial prop plus up to three later changes.

Preserve all previously locked hider rules:
- health carries across disguise changes
- each disguise change refreshes one flash grenade
- exactly 10 decoy props per hider per round
- hiders can move / run while disguised
- hiders can jump and climb reasonable surfaces

Suggested pool categories should cover a broad size range, including tiny / small items, medium shop props and risky large props such as a tractor, motorcycle, large barrel stack, chair, machinery, tree or similar map-appropriate object.

Do not make every visible environment object disguisable. The curated 30-type pool exists for balance, readability and round variety.

---

# 10. PROP SIZE RISK / REWARD SCORING

Add a survival scoring bonus based on disguise size and hiding difficulty.

The fundamental rule is:

> The larger and more conspicuous the prop, the greater the survival-point multiplier while the hider remains alive in that form.

Small props should be safer and earn the lowest survival rate.

Medium props earn more.

Large props earn a meaningful bonus.

Very large / absurdly risky props such as a tractor or tree should earn the highest survival bonus.

Do not award the large-prop bonus just for selecting it and instantly changing away. The bonus must be time-based while the player is alive in that disguise.

Keep exact multipliers as clearly named tuning constants so phone playtesting can balance them without rewriting the scoring system.

The scoring model must not make small props worthless. A player who survives well as a small prop should still earn a respectable score. The large-prop system is a risk bonus, not a requirement.

Use this scoring in the end-of-round hider MVP calculation.

---

# 11. HUNTERS - NO POWER PROGRESSION

Hunters should be fully functional from the beginning of the round.

Do not add mid-round hunter upgrades, scanner progression, speed power-ups or late-round stat boosts in this phase.

Preserve the established hunter rules and Phase T.1 controls:
- hunters are blacked out during the hide phase
- hunters cannot see hider locations during hiding
- hunter movement / camera / firing are locked until release
- permanent crosshair aiming
- no separate Aim button
- tap Shoot fires once
- hold Shoot rapid-fires at the tuned controlled rate
- shooting works while moving, strafing, turning and jumping
- unlimited ammo
- no penalty for shooting ordinary props
- family-safe prop-zapper presentation

Hunter skill should come from searching, map knowledge, movement and shooting, not unlockable combat power.

---

# 12. HIDING PHASE

Preserve the current proper hider setup flow from Phase T.1.

Default hide time remains **30 seconds** unless the existing host settings specify otherwise.

During hiding:

Hunters:
- see a black screen
- see a countdown and "HIDERS ARE HIDING" message
- cannot move
- cannot rotate the camera
- cannot shoot
- cannot spectate the map
- cannot receive hidden hider-position information
- do not receive positional hider audio

Hiders:
- have full movement
- can jump / climb
- can choose from their four assigned disguise options
- can position decoys
- can prepare their hiding spot

Use the synchronized 3, 2, 1, HUNT transition already established.

---

# 13. ROUND LENGTH

Default Prop Hunt round length: **5 minutes**.

Keep this as a clear tuning / host setting if the current architecture already supports match settings, but 5 minutes is the default Papa's Shop design target.

The map size, spawn distribution and hunter count must be balanced around a five-minute round.

---

# 14. ELIMINATION, PROP BREAK & GHOST MODE

When a hider's health reaches zero:

1. The disguise prop visibly breaks / bursts apart in a readable family-safe effect.
2. Briefly reveal the eliminated family character if appropriate to the animation flow.
3. Trigger the elimination audio cue described below.
4. Resolve the player's post-elimination mode.

## Classic Mode

The eliminated player becomes a **non-interacting ghost / spectator** for the remainder of the round.

Ghost mode should support:
- free-fly spectator movement
- no collisions that trap the ghost
- no ability to affect gameplay
- no ability to reveal information to hunters through game systems
- follow-player camera option
- cycle between living players
- return to free-fly view

The ghost should be clearly non-corporeal / spectator-only.

## Family Chaos Mode

Preserve the existing rule:

> A caught hider joins the hunters.

Do not replace Family Chaos conversion with ghost mode.

---

# 15. "THAT'S A SIN" ELIMINATION AUDIO

Every player elimination should trigger a short audible line:

> **"That's a sin."**

The line should sound like an original humorous older-lady voice.

Do **not** clone or imitate a real family member's voice unless the user separately provides / authorizes an audio source for that purpose.

The elimination line should be heard reliably on participating devices when audio is enabled.

If several eliminations happen almost simultaneously, queue or rate-limit playback so the line remains understandable rather than becoming a pile of overlapping audio.

Keep the cue short enough that it remains funny instead of exhausting.

---

# 16. RANDOM WEATHER & TIME OF DAY

Each round should receive a randomly selected weather / lighting preset chosen automatically by the game.

Possible presets include:
- clear sunny
- warm late-afternoon / sunset
- overcast
- light rain
- light snow
- light fair fog
- windy / moving-cloud day

The computer chooses the preset for the round.

The **time of day remains fixed for the entire round**. Do not transition from day to night during a five-minute match.

Weather must remain gameplay-fair:
- do not hide hiders behind extreme fog
- do not make rain obscure the crosshair
- do not make snow tank mobile performance
- do not change collision rules
- do not make one team significantly harder to see than the other

Weather should provide mood and freshness, not competitive randomness.

When weather permits, the exterior should clearly show grass and a convincing blue sky.

---

# 17. HYBRID ROUND-TO-ROUND MAP RANDOMIZATION

Do not randomize the entire property into an unrecognizable layout.

Use a **hybrid landmark system**.

Permanent / stable landmarks include:
- main shop position
- barn position
- Papa's fireplace / yellow chair landmark
- major pen zones
- major exterior orientation
- main property boundaries

Randomize secondary elements each round, such as:
- lumber stack arrangement
- portable equipment placement
- barrels / crates / pallets
- hay bale clusters
- selected workbench clutter
- selected doors starting open / closed
- tractor / trailer parking within valid zones
- some pen objects
- some prop clusters
- a few interaction states
- rare surprise interactables

Randomization must preserve navigation safety and must never spawn an object inside a player or block the only route through an area.

Spawn / layout randomization should be deterministic from the authoritative round seed where multiplayer consistency requires it.

---

# 18. AMBIENT LIFE

Add subtle ambient wildlife and farm life to make the map feel alive.

Examples:
- birds
- goats
- chickens
- pigs
- turkeys / peacocks where appropriate

Ambient animals should:
- move simply and believably
- avoid blocking critical paths
- remain lightweight for mobile performance
- not reveal hidden players
- not count as disguise players unless explicitly part of the disguise system
- not create hunter penalties

Use ambient sound sparingly and spatially where supported.

---

# 19. EASTER EGGS

Add small non-gameplay family Easter eggs throughout the expanded map.

These may include:
- funny family references
- hidden notes / signs
- silly object arrangements
- subtle photos / stylized keepsakes where appropriate
- recurring jokes
- unusual little props

They provide **no gameplay advantage**.

They are there to be discovered naturally and talked about later.

In addition, include **one legendary Easter egg for the map**.

The legendary Easter egg:
- should be difficult / rare to discover
- must not be required for an achievement that pressures normal gameplay
- gives no competitive advantage
- should feel memorable enough to become a family story

Do not advertise its exact location in normal UI.

---

# 20. RARE / SURPRISING INTERACTIONS

Among the approximately 150 interactive objects, include a small handful of surprising interactions.

Examples may include:
- a strange horn / sound
- an unexpected light sequence
- a funny animal reaction
- a hidden moving shop object
- a silly machine animation
- a rare prop animation

Keep these rare enough that they are discoveries rather than constant noise.

They should never stun, damage, reveal or unfairly trap a player unless a future rule explicitly approves that mechanic.

---

# 21. END-OF-ROUND MVP SCREEN

At the end of each round, show a polished, skippable family-style MVP summary.

At minimum show:
- **Best Hider**
- **Best Hunter**

Suggested hider evaluation:
- survival time
- prop-size risk bonus
- whether the player survived the round
- useful decoy / escape contribution if already tracked reliably

Suggested hunter evaluation:
- eliminations
- meaningful damage / hits
- search effectiveness metrics already available

Do not reward simply spraying thousands of shots if a more meaningful statistic exists.

Include:
- family character presentation
- small victory / reaction animation where available
- round score / stats
- skip / continue control

Target roughly a short 8-10 second presentation if nobody skips it.

---

# 22. LONG-TERM FAMILY PROGRESSION

Prop Hunt should retain **lifetime family statistics** across sessions where the existing project persistence architecture supports it.

Track useful long-term stats such as:
- rounds played
- hider wins
- hunter wins
- total survival time
- eliminations
- favorite / most-used disguise
- largest-prop survival time
- MVP awards
- best survival streak

Long-term progression must not create combat power advantages.

If cosmetic / achievement unlocks are added later, they should remain cosmetic only.

Do not invent a second competing account / database system if the app already has persistent history or profiles. Extend the existing system cleanly.

If true cross-device persistence is not currently supported, document that limitation instead of pretending localStorage is server persistence.

---

# 23. CAMERA, MOVEMENT & COLLISION REQUIREMENTS

The much larger environment must not reintroduce the prior camera / stuck-player failures.

Preserve all recovery protections already built.

Perform a new map-specific collision pass for:
- shop corners
- barn stalls
- fences
- ladders
- tractor
- motorcycle
- lumber stacks
- shelves
- gates
- animal pens
- large disguises
- narrow doorways

Requirements:
- wide enough traversal for mobile steering
- no invisible snag strips
- no camera collapse under roofs / lofts
- no player spawning inside objects
- no props pinning players against world boundaries
- Reset View remains available
- invalid-position recovery remains available

The expanded world should improve movement freedom, not simply increase dimensions.

---

# 24. ANIMATION & CONTROL POLISH

Continue the Phase T animation direction while building this map.

The larger environment should visibly support:
- idle
- walk
- jog
- sprint
- smooth turns
- strafing
- backpedaling
- jumping
- landing
- mantle / climb
- firing while moving
- disguise transformation
- moving as different prop scales
- prop destruction on elimination
- ghost transition

Large disguises should feel heavier than small props without becoming frustratingly sluggish.

Do not add an Aim button back.

The crosshair remains the hunter's aim reference.

---

# 25. PERFORMANCE STANDARD

Eight times the playable footprint plus hundreds of props is not permission to destroy mobile performance.

Use appropriate techniques such as:
- instancing for repeated objects
- shared geometry / materials
- distance-based update throttling
- sensible shadow limits
- low-cost ambient life
- collision simplification
- culling
- pooled effects
- capped particles
- lightweight weather
- static batching where appropriate

Do not reduce the map back to a sparse test arena just to meet performance.

Instead, architect the environment efficiently.

Test specifically on phone-sized / mobile performance profiles.

---

# 26. VISUAL STANDARD

The world should remain stylized-realistic, dimensional and recognizable.

Exterior:
- grass
- believable gravel / dirt transitions
- convincing sky
- distant tree / fence treatment
- readable boundary
- weather / lighting mood

Interior:
- warm shop lighting
- realistic depth
- visible materials
- believable clutter
- clear silhouette separation
- readable hiding spaces

Do not return to flat blocky placeholder geometry as the final visual layer.

---

# 27. PROFESSIONAL GAME-DESIGN PRINCIPLES FOR THIS MAP

Use the following design principles as hard guidance:

1. **Readable landmarks** so new players can orient themselves.
2. **Multiple loops** so chases do not become corridor traps.
3. **Risk / reward hiding** through prop-size scoring.
4. **Curated disguise choice** rather than unlimited object copying.
5. **Round variety** through weather and secondary-layout randomization.
6. **No power creep for hunters.**
7. **Spectating remains fun** through ghost free-fly and follow cameras.
8. **Interactions create stories**, not unfair locks.
9. **Large open zones with dense pockets**, not uniform clutter everywhere.
10. **Mobile controls first.** Every space must be navigable with thumbs.
11. **Performance is designed in**, not used as an excuse for emptiness.
12. **Visual QA is mandatory.** Automated tests alone do not prove the map is good.

---

# 28. ITEMS NOT YET AUTHORIZED TO CHANGE

A few design topics were raised but were not fully decided before this directive was requested.

Do **not** invent major new rules for these yet:
- hunter cosmetic progression details
- detailed prop-mass / physics classes beyond reasonable size feel
- broad new match-customization menus beyond already existing settings
- major new sound-system settings

Preserve current behavior unless needed for the locked features above.

The long-term stat system **is approved**, but gameplay-power progression is not.

---

# 29. PHONE QA - REQUIRED PLAY SEQUENCES

Do not call Phase V complete based only on automated tests.

At minimum, visually test these sequences on a phone-sized build.

## Hider route test

1. Spawn during hide phase.
2. Receive four random disguise options.
3. Confirm there is no reroll.
4. Run from shop to barn.
5. Climb / use a ladder or mantle route.
6. Enter and exit an animal pen without becoming trapped.
7. Change disguise.
8. Confirm health persists.
9. Place decoys.
10. Use flash.
11. Hide as a large prop.
12. Confirm large-prop survival score increments correctly.
13. Get eliminated.
14. Prop breaks.
15. "That's a sin" plays.
16. Enter ghost mode in Classic.
17. Free-fly and follow another player.

## Hunter route test

1. Start round as hunter.
2. Confirm map is fully blacked out during hiding.
3. Confirm no hider position / disguise leak.
4. 3, 2, 1, HUNT release.
5. Run from exterior into shop.
6. Hold Shoot while moving and turning.
7. Search shop, barn, pens and equipment yard.
8. Use multiple route loops.
9. Open / use interactive route objects.
10. Cross the map boundary and confirm clean block / feedback.
11. Eliminate a hider.
12. Confirm elimination cue and round stats.

## World test

Test at least several round seeds and verify:
- weather changes round to round
- time of day stays fixed within a round
- secondary prop layouts change
- core landmarks stay recognizable
- no randomized object blocks a required route
- ambient animals do not obstruct play
- rare interactions exist but are not constant
- 12-player spawn / route distribution remains viable

---

# 30. ACCEPTANCE GATE

Phase V is not approved until the following are true:

- Papa's Shop playable footprint is approximately 8x the prior map.
- The added area is real gameplay space, not decorative padding.
- The shop, barn, pens and outdoor property all feel substantially larger.
- Barn is fully searchable and multi-route.
- Pens are large and easy to enter / exit.
- Exterior contains grass, sky, rural distance and a readable boundary.
- Hundreds of visible props are present.
- Approximately 150 meaningful interactions / interactive objects are distributed across the property.
- The map comfortably supports 12 players.
- Hiders receive four rotating disguise options from an approximately 30-type map pool.
- No reroll exists.
- Large prop survival receives greater scoring reward.
- Weather / lighting changes between rounds.
- Time of day is fixed within a round.
- Secondary layout changes without destroying landmark recognition.
- Eliminated Classic hiders become ghosts and can free-fly / follow.
- Family Chaos still converts caught hiders into hunters.
- Every elimination triggers the "That's a sin" audio cue.
- End-of-round Best Hider / Best Hunter MVP screen works.
- Lifetime Prop Hunt stats are preserved / extended without power advantages.
- Camera, collision and spawn recovery remain stable.
- Phone visual testing confirms the map actually feels bigger, richer and more fun.

The final qualitative test is:

> A player should be able to play many rounds on Papa's Shop and still discover different routes, hiding strategies, weather moods, prop combinations, interactions and little family details without the map feeling cramped or solved after two matches.

---

# 31. REQUIRED DELIVERABLES FOR THE BUILD CHAT

When implementing this directive, return:

1. Updated project ZIP, suggested name:
   `black-family-game-night-STAGING-PHASE-V-PROP-HUNT-PAPA-SHOP-EXPANSION-24.zip`
2. Updated cumulative `MASTER_NEXT_BUILD_DEVELOPMENT_DIRECTIVE.md`.
3. Updated `BLACK_FAMILY_GAME_NIGHT_PROJECT_CONSTITUTION.md` if any permanent project rules need to be added.
4. This Phase V directive in the package.
5. Phase V implementation report.
6. Phone QA checklist for the expanded Papa's Shop.
7. Exact-package verification report after cold extraction of the final ZIP.
8. SHA256 checksum.

Do not claim visual approval unless the map has actually been visually / device tested.

---

# END PHASE V MASTER DIRECTIVE
