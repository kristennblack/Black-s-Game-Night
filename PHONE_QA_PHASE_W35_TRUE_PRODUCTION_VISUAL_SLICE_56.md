# W35 Phone QA - True Production Visual Slice 56

Use the W35 staging candidate on a real phone. Do not judge from a generated concept image.

## A. First visual proof
1. Open Family Prop Hunt.
2. Choose Papa's Shop.
3. Start as Hunter if possible.
4. Confirm the actual world is the authored shop/barn slice, not the old sparse primitive room.
5. Capture one screenshot immediately after gameplay starts.

PASS only if the screenshot visibly contains substantial authored shop/barn geometry and production prop-set content.

## B. Character movement
Test:
- idle
- walk
- jog
- run
- sprint
- start movement
- stop movement
- 90-degree turn
- 180-degree turn
- backward movement
- strafe left/right
- diagonal movement
- jump
- landing

Watch for:
- foot skating
- stiff idle fallback during jog/sprint
- snapping turns
- hips rotating independently from feet
- double-speed animation timing
- floating or floor penetration

## C. Aim and fire
Test:
- aim while standing
- aim while walking
- strafe while aiming
- run while carrying weapon
- shoot while moving

PASS only if lower-body locomotion remains directional while upper-body aim stays readable and the weapon remains attached.

## D. Environment and collision
Walk into:
- shop front/rear/side walls
- barn walls
- doorway edges
- tractor/hero props

Confirm:
- player cannot walk through authored walls
- camera does not collapse through walls
- doorway routes remain usable
- hidden procedural collision geometry never becomes visible

## E. Materials and lighting
Check:
- concrete reads differently from wood
- rubber reads differently from metal
- painted tractor/tool surfaces do not look like one flat brown material
- doorway is brighter than interior hiding areas
- character and props have contact/readable shadows
- dark corners remain playable

## F. Performance
Play continuously for at least 3 minutes.

Record:
- device model
- browser
- approximate FPS if QA HUD is available
- any stutter, heat, input delay or camera reset needed

## G. Proof requirement
Send back:
1. one actual gameplay screenshot,
2. ideally a short screen recording showing walk, sprint, turn, jump, aim and fire.

Generated images, concept art and reconstructed screenshots do not count as W35 proof.
