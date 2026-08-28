# BLACK FAMILY GAME NIGHT - PROJECT CONSTITUTION

Status: Permanent project-level source of truth
Established: Phase U.3

## 1. Governing build order
Every future development pass must begin from, in this order:
1. the latest working project ZIP;
2. this Project Constitution;
3. the latest cumulative Master Development Directive.

A new phase extends the current project. It does not restart the project unless the user explicitly requests a rebuild.

## 2. Project purpose
Black Family Game Night is a private family-and-friends game collection built for easy invite-link play, family humor, recognizable characters, mobile use and a mix of table games, 3D family games and quick arcade games.

The product should feel like one coherent family game lodge, not a bundle of unrelated demos.

## 3. Family roster and relationships
- John and Kristen are married.
- James and Dorothy are Kristen's parents.
- Papa and Nana are John's parents. They are not married to each other and regularly bicker in the family-game characterization.
- Vanessa, Logan and Elizabeth/Lizzie are John's children.
- Holly is Kristen's child.
- The blended family is treated as one family unit.
- Dogs: Kelsi, Molly and Gunner.

## 4. Locked family characterization
### John
Serious fixer and handyman. Wrench, tools, plaid shirt, jeans, cowboy boots, workshop/shop energy. Often the person everyone relies on when chaos breaks out.

### Kristen
Organizer and family-game-night host. Central to the overall game-night presentation and the Arcade Corner host layer.

### Papa
Papa's Shop, tractor, old motorcycle, fireplace, beer, yellow tattered chair, tinkering and arguments with Nana.

### Nana
Opinionated, funny and judgmental in a family-safe way. Signature line: "That's a sin."

### James
Quiet grandfather. Calm, practical, lumber/outdoors/wood association.

### Dorothy
Relaxed family presence. Garden/outdoor themes and recurring smoke-break joke.

### Vanessa
Sarcastic, bossy, western styling, grey GMC truck and frequent eye-roll energy.

### Elizabeth / Lizzie
Dramatic, ballet/dance energy, theatrical reactions and Crocs references.

### Logan
Teenage boy, fishing, hoodie/jeans, reluctant participation, arms-crossed attitude.

### Holly
Sweet, cozy, hoodie/baggy-jeans energy, squishy/original collectible-toy themes and gentle emotional reactions.

### Kelsi
Princess dog who loves rocks. Technically associated with Vanessa but especially attached to John.

### Molly
Silly dog, tongue out, loves lights and especially loves John.

### Gunner
Very large, goofy, mellow farm dog. Slightly spaced-out farm-boy energy and deliberately lovable lumbering presentation.

## 5. Visual identity
The overall app uses a warm cabin/lodge identity with wood, firelight, cozy family-game-night atmosphere and subtle post-apocalyptic accents where appropriate.

Do not force every game into the same palette. Each game can have its own visual identity while still feeling like it belongs in the lodge.

For 3D family games, target stylized realism and recognizable characters. Avoid blocky placeholder-looking characters, fake 3D, mixed 2D/3D presentation and low-fidelity stand-ins once a benchmark has been approved.

## 6. Mobile-first philosophy
Phone play is a first-class requirement.
- Important play surfaces should fill the useful screen.
- Touch targets must be comfortably tappable.
- Do not rely on hover or keyboard-only controls.
- Canvas games must scale responsively without breaking game coordinates.
- Avoid unnecessary page scrolling while actively interacting with a game canvas.
- Tabletop games should not be shrunk inside decorative dead space.

## 7. 3D quality philosophy
Family Prop Hunt is the flagship 3D benchmark. Improve reusable character, animation, camera, input, collision, environment and interaction systems there first, then propagate proven systems to the other 3D games.

Automated tests are necessary but do not prove visual quality. Visual approval requires actual rendered inspection. Phone approval requires actual phone/device testing.

## 8. Arcade philosophy
Arcade games should be fast to load, easy to understand and fun within seconds.

Preferred architecture:
- one self-contained HTML file per game;
- inline CSS;
- vanilla JavaScript;
- Canvas where appropriate;
- no unnecessary framework or build dependency;
- Cloudflare Pages friendly;
- touch support plus keyboard/mouse where useful;
- local high scores and achievements may use localStorage.

Classic mechanics may inspire games, but presentation, art, names, dialogue and family-specific details should be original to Black Family Game Night.

## 9. Multiplayer principles
Preserve the established private-room systems unless a phase explicitly changes them:
- invite-link rooms;
- seat selection;
- Ready state;
- duplicate avatars where allowed;
- reconnect;
- bots and difficulty selection;
- player colors/outfits;
- chat/reactions and existing history systems.

Do not casually rewrite multiplayer contracts to support an unrelated visual or arcade feature.

## 10. Originality and IP rule
Do not copy copyrighted artwork, branded characters, logos, music, proprietary level layouts or rulebook wording from commercial games.

It is acceptable to use broad game mechanics as inspiration and build original family-themed implementations using original code and project-created art.

## 11. Non-regression rule
Previously working and approved systems are locked unless a new requirement directly conflicts with them.

Before packaging a new release, verify at minimum:
- home loads;
- all intended game routes exist;
- JavaScript parses;
- project tests pass;
- build validation passes;
- service-worker/static paths are valid;
- major 3D routes remain available;
- multiplayer room systems are not accidentally altered;
- newly touched games work through their main gameplay loop.

## 12. Quality labels
Use these labels precisely:
- code verified;
- tests verified;
- package verified;
- browser visually inspected;
- phone visually verified.

Never use phone-verified or visually approved language when that inspection did not actually happen.

## 13. Packaging discipline
Every major phase gets a new staging ZIP. Never overwrite the previous known-good package.

After the final ZIP is created:
1. extract that exact ZIP into a clean directory;
2. rerun syntax/tests/build/asset checks on the extracted copy;
3. verify ZIP integrity;
4. record the results;
5. provide a checksum.

## 14. Permanent development principle
Optimize for playable, recognizable, satisfying games, not for the quantity of code or the number of automated checks.

Preserve approved work. Improve weak work. Do not confuse technical proof with player experience.

## 15. Prop Hunt flagship world and round-experience principles
Papa's Shop is the first flagship map-scale benchmark for Family Prop Hunt.

Permanent design principles established in Phase V:
- A Prop Hunt map must provide enough real playable space for chasing, searching, hiding and camera recovery. Decorative background alone does not count as map expansion.
- Papa's Shop targets an approximately eight-times-larger footprint than its original prototype and should comfortably support up to 12 players.
- Favor large readable zones connected by loops over cramped mazes and accidental dead ends.
- Major landmarks should stay recognizable while secondary prop/clutter placement may vary between rounds.
- Maps should feel alive through weather, ambient animals, lights, sounds and harmless interactions, while competitive visibility and routing remain fair.
- Hider disguises are curated rather than unrestricted. Papa's Shop uses a 30-prop map pool with exactly four assigned choices per hider per round and no reroll.
- Riskier/larger disguises may earn higher survival points so choosing a tractor/tree-sized disguise is meaningfully brave without making small disguises worthless.
- Classic-mode elimination should keep people entertained through ghost/free spectator and follow-player cameras. Family Chaos retains conversion to hunter.
- Humour is part of the identity. The `That's a sin.` elimination cue is an original synthesized comedic voice treatment, not an imitation of a real individual.
- Round MVPs and lifetime statistics should celebrate both strong hiding and strong hunting without adding power progression.
- Hunters should remain mechanically simple and fully capable from the start of a round.
- Easter eggs are for family discovery and memory, not competitive advantage.
- Environment interactions can create noise, light, spectacle or safe shortcuts, but may never permanently lock a route or trap a player.
- Actual phone play remains the visual/gameplay approval gate. Automated tests may verify contracts but cannot certify that a large 3D map feels good to play.

## 16. Phase W.10 professional quality precedence
For all next-build work, `MASTER_GAME_DESIGN_PRODUCTION_PROMPT_W10.md` is the canonical professional design/production prompt. The approved family turnaround directive still has higher authority for character identity, and game-specific locked rule files remain authoritative for finalized rules.

The older phrase `stylized realism` must not be interpreted as permission to redesign an approved family avatar. For approved characters, the target is dimensional, polished cartoon 3D that preserves the exact approved identity.

The flagship 3D production strategy is vertical-slice first: prove one excellent John/Papa's Shop full-round phone experience before copying the controller/character pipeline across the cast or other maps.

## W.11 Stability Amendment — Smoothness Is Gameplay

For Family Prop Hunt, W.11 establishes a constitutional production gate: the project may not trade away stable controls, camera behavior, collision, frame pacing or real-phone usability merely to add visual complexity or new content.

- Papa's Shop + approved John is the flagship stability benchmark.
- Simulation ownership is authoritative capsule/body first; camera and animation are presentation/independent systems.
- Actual phone proof is required for smoothness claims.
- Frame-time tail latency, camera recoveries, collision failures and browser-resume behavior are QA signals, not cosmetic details.
- Asset-stage optimization requirements must be described honestly as future until authored and measured.
- `MASTER_GAME_DESIGN_PRODUCTION_PROMPT_W11.md` is the current canonical next-build prompt.


## W.12 Gameplay Correction Amendment
- `MASTER_GAME_DESIGN_PRODUCTION_PROMPT_W12.md` is the current canonical prompt.
- Current house-game spelling is **Blackgammon**.
- A core turn is not complete unless its legal action is visible and executable in shipped UI.
- Public tabletop state should be visible; private cards remain hidden.
- W.12 explicitly locks the corrected Mexican Train, Last Haven, Deck Sweep and Prairie Pots table-state requirements.
- W.11 Prop Hunt stability remains mandatory while W.12 corrects speed, controller direction and forward weapon/hand presentation.
