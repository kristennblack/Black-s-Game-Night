# Black Family Game Night 3D QA Matrix
## v2.0.0 - Studio Realism

Use this matrix for every candidate 3D release before calling it launch-ready.

| Area | Prop Hunt | Island Life | Birthday Seat | Pass condition |
| --- | --- | --- | --- | --- |
| Real WebGL renderer | Required | Required | Required | No software Canvas 2D gameplay renderer |
| Shared 3D art kit | Required | Required | Required | Characters and reusable assets come from shared kit |
| Shared control framework | Required | Required | Required | `shared-3d-gameplay.mjs` loaded |
| Analog movement | Required | Required | Required | Half stick produces reduced movement intent |
| Acceleration/braking | Required | Required | Required | No instant full-speed starts/stops |
| Jump buffer | Required | Required | Required | Early press before landing still jumps |
| Coyote time | Required | Required | Required | Late edge press still jumps briefly |
| Variable jump height | Required | Required | Required | Short tap is visibly lower than hold |
| Auto mantle | Required | Required | Required | Reasonable ledges climb without separate button |
| Camera collision | Required | Required | Required | Camera does not pass through solid world geometry |
| Shoulder swap | Required | Required | Required | CAM, C and LB swap shoulder |
| Safe-area mobile controls | Required | Required | Required | Controls stay above phone browser/safe area |
| Persistent control preferences | Required | Required | Required | Sensitivity, invert-Y and handedness carry between games |
| Left-handed layout | Required | Required | Required | Joystick/action sides can flip without breaking look input |
| All-angle humans | Required | Required | Required | Back view shows back, not face |
| Quadruped dogs | Required | Required | Required | Four articulated legs and readable head/body |
| Semantic animations | Required | Required | Required | Shared idle/walk/run/jump/fall/land states |
| Transient actions | Hit | Work/wave/drink | Celebrate target | Short actions are not erased next frame |
| Environmental ambience | Required | Required | Required | Foliage/fire/water move visually without moving colliders |
| Dynamic FOV | Aim/sprint | Sprint | Sprint | Smooth transition, no snap |
| Multiplayer interpolation | Required | Required | N/A/local bots | Remote players do not teleport between snapshots |
| Wall-blocked hits | Required | N/A | N/A | First raycast world surface wins |
| View-based interaction | N/A | Required | N/A | Looking toward object helps choose it |
| Moving platform carry | N/A | N/A | Required | Rider follows platform delta |
| Live 3D finish | N/A | N/A | Required | Runner remains 3D and celebrates at the throne |
| Performance governor | Required | Required | Required | Pixel ratio can reduce before control quality |
| Motion-driven stride timing | Required | Required | Required | Gait cadence changes with actual travel speed |
| Acceleration/turn lean | Required | Required | Required | Body reacts subtly to starts, stops and turning |
| Airborne silhouette | Required | Required | Required | Jump, fall and landing poses read differently |
| Idle life | Required | Required | Required | Breathing/blinks/weight shift are visible but subtle |
| Scene primary landmark | Required | Required | Required | Location identity is obvious from gameplay camera |
| Secondary activity areas | Required | Required | Required | Scene has readable subareas with purpose |
| Structural support | Required | Required | Required | Elevated/large objects appear physically supported |
| Purposeful clutter | Required | Required | Required | Dressing explains activity without blocking circulation |
| Human-use detail | Required | Required | Required | Seating/signage/storage/lighting appear where appropriate |
| Ambient population | Birds/animals | Birds/residents | Birds/bots | Lightweight ambient life adds depth without physics drift |
| Material breakup | Required | Required | Required | Large surfaces do not read as one flat color field |


| Clamped attention/gaze | Aim/targets | Interactions/social | Next platform | Head/eyes acknowledge target without impossible neck rotation |
| Context body facing | Aim/use | Work/shop/forage | Goal/interaction | Stationary character turns toward the object being used; movement input still wins |
| Semantic contextual action | Use/hit/aim | Harvest/fish/work/eat/drink/sit | Celebrate/use | Action visibly matches gameplay meaning instead of one generic arm motion |
| Step/landing contact cue | Required | Required | Required | Ground feedback appears once per contact event and hard landings read stronger than steps |
| Weapon attachment recoil | Human + dog | If equipped | N/A | Recoil moves actual weapon anchor and returns smoothly |
| Automatic shoulder relief | Required while aiming | Optional camera benefit | Optional camera benefit | Tight wall can temporarily favor clearer shoulder without changing saved preference |
| Proximity swing doors | Map entrances | Shops/homes | Theme entrances where used | Door visually opens smoothly as player approaches and never reveals hidden geometry incorrectly |
| Practical night lighting | Selected | Selected | Selected | Important lamps create restrained light pools; decorative lamps do not all become expensive lights |
| Shared renderer contract | Required | Required | Required | sRGB, ACES, exposure and shadow type come from shared helper |
| Shared shadow contract | Required | Required | Required | Directional shadow map/bias/coverage configured by shared helper |
| Human-scale lamps | Required | Required | Required | Lamp posts are visibly human-scale; Birthday summit regression stays at about 2.45 world units |
| Transform feedback | Required | N/A | N/A | Disguise/decoy change has brief local poof instead of an unexplained instant mesh swap |

## Device smoke test

At minimum test:

- one recent iPhone in Safari or Chrome
- one Android phone if available
- one desktop Chrome browser
- one touch tablet if available

Record screenshots for:

1. front character view
2. side character view
3. back character view
4. interior camera against a wall
5. mobile control layout
6. one dog character
7. one detailed environment landmark
8. one wide view that proves the place has a clear layout
9. one jump/fall/landing sequence
10. one idle character held onscreen for at least 10 seconds

Any screenshot that still reads as a grey-box prototype blocks release even if the automated suite is green.

---

# v2.0 Studio Realism QA Addendum

## Authored asset pipeline
- [ ] Empty manifest uses procedural fallback without 404 spam.
- [ ] Valid GLB can replace one human without changing gameplay logic.
- [ ] Valid dog GLB remains quadruped and receives backpack weapon socket.
- [ ] Authored animation crossfades do not pop the root position.
- [ ] Missing semantic clip falls back gracefully.

## Multiplayer
- [ ] Remote movement uses buffered local receive time.
- [ ] Remote characters do not teleport because server Date.now timestamps were mixed with local performance.now.
- [ ] Short extrapolation stops before visible runaway drift.

## Island Life
- [ ] Village building pads do not intersect heightfield terrain.
- [ ] Weather changes exposure, fog, rain/wind and ambience together.
- [ ] NPC visitors route around blocked buildings.
- [ ] Rain biases visitors toward plausible sheltered routines.
- [ ] Every furniture action is proximity checked server-side.
- [ ] Another resident cannot sleep in someone else's bed.
- [ ] Lamp state persists and changes a real 3D point light.
- [ ] Loose physics props settle and do not move structural furniture.
- [ ] Shoreline water shows restrained animated foam.

## Sound
- [ ] SND setting persists across all three 3D games.
- [ ] Grass, dirt, sand, gravel, concrete, wood and metal steps are audibly differentiated.
- [ ] Prop-zapper fire/impact cues trigger from actual fire/hit events.
- [ ] Ambient rain/birds/water are sparse enough not to become noise spam.

## Cinematics
- [ ] Normal reveal shot restores the player's original camera.
- [ ] End-of-game victory shot may intentionally remain cinematic.
- [ ] Cinematic movement never changes gameplay collider position.

## Performance
- [ ] Weather rain points remain capped.
- [ ] Water does not use an extra reflection render pass.
- [ ] Selective physics body count stays small.
- [ ] NPC visitor count remains bounded.
- [ ] Several family rigs can be visible on target phone without persistent frame collapse.
