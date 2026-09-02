# Authored 3D Asset Guide
## Black Family Game Night v2.0

This is the handoff specification for artists or future model-generation work.

## Coordinate and scale rules

- Y is up.
- Forward should be local -Z at bind pose where practical.
- Human eye height should land near the existing gameplay scale.
- Root origin should be centered at ground contact between the feet.
- Do not bake arbitrary 100x or 0.01x scale into the scene when it can be avoided.

## Human character GLB

Preferred file pattern:

`/public/models/characters/<family-id>.glb`

Examples:

- john.glb
- kristen.glb
- holly.glb
- elizabeth.glb
- vanessa.glb
- logan.glb
- james.glb
- dorothy.glb
- nana.glb
- papa.glb

### Required presentation

- true back, sides and front
- separate hair volume
- proper ears/nose/eyelids/brows/mouth
- real hands, preferably simple fingers rather than mitten blocks
- clothing with readable layered silhouette
- shoes/feet large enough to read in third person

### Skeleton

A conventional humanoid hierarchy is preferred. Mixamo-style names are supported by the runtime socket resolver.

Useful bones include:

- hips / pelvis
- spine
- chest / upper chest
- neck
- head
- left/right shoulder
- upper arm
- forearm
- hand
- upper leg
- lower leg
- foot

The weapon system looks for common right-hand, left-hand, head and upper-spine aliases.

## Dog GLB

Preferred file pattern:

`/public/models/dogs/<dog-id>.glb`

The dogs are Gunner, Kelsi and Molly.

Required:

- quadruped skeleton
- front and rear upper/lower legs
- paws
- spine/chest
- neck/head
- jaw if possible
- ears if independently animatable
- tail chain or tail bone
- a stable upper-back/chest location for the backpack prop-zapper

A dog must never be treated as a scaled human skeleton.

## Animation naming

The runtime performs semantic alias matching, so exact names are flexible, but these names are preferred:

### shared locomotion
- idle
- walk
- run
- walk_backward
- strafe_left
- strafe_right
- turn_left
- turn_right
- jump
- fall
- land
- hard_land
- mantle

### Prop Hunt
- aim
- fire
- hit
- transform
- throw
- place

### social/life
- wave
- celebrate
- sit
- sleep
- drink
- eat
- inspect
- work
- carry
- dance

### tools/jobs
- fish
- fish_cast
- fish_reel
- chop
- mine
- dig
- water
- cook

### dogs
- sniff
- pant
- scratch
- shake
- lie_down

## Animation technical rules

- Locomotion clips should be loopable.
- Actions may be in-place unless the gameplay explicitly owns root motion.
- Avoid large uncontrolled root translation in walk/run clips.
- Keep feet near a consistent ground plane.
- The game handles travel speed and collision, so animation should visually match motion rather than move the character through the level by itself.
- Aim/fire clips should not permanently offset the root.

## PBR texture expectations

Preferred material channels:

- base color
- normal
- roughness
- metallic when applicable
- optional ambient occlusion
- optional emissive only where physically sensible

Avoid baking strong directional lighting into base color.

### Mobile texture budgets

Hero family character:
- generally target 1K to 2K maps per material set
- avoid many separate material slots for tiny clothing pieces

Hero prop/vehicle:
- 1K to 2K depending on screen importance

Background furniture:
- 512 to 1K or shared atlases where practical

## Geometry budget philosophy

There is no single hard polygon number because silhouette quality matters, but the rule is simple:

> Spend polygons where the player's eye notices curvature and articulation.

Good places to spend them:

- face silhouette
- hair silhouette
- hands
- shoulders
- knees/elbows
- dog muzzle/ears/paws
- curved vehicle/furniture silhouettes

Bad places to waste them:

- hidden bottoms of furniture
- perfectly flat walls
- tiny bolts never visible during gameplay

## LOD strategy

Future authored hero assets should support either explicit LODs or a distance simplification policy.

Suggested tiers:

- near: full hero mesh
- medium: reduced geometry/material complexity
- far: simplified mesh, reduced animation detail

Do not switch back to a front-facing sprite for distant family members. The silhouette must remain genuinely 3D.

## Manifest example

```json
{
  "version": 1,
  "characters": {
    "john": {"file":"/models/characters/john.glb","scale":1}
  },
  "dogs": {
    "gunner": {"file":"/models/dogs/gunner.glb","scale":1}
  },
  "props": {
    "propZapper": {"file":"/models/props/prop-zapper.glb","scale":1}
  },
  "furniture": {
    "heroSofa": {"file":"/models/furniture/hero-sofa.glb","scale":1}
  }
}
```

Do not add an entry until the referenced file exists. An empty manifest is valid and intentionally means “use procedural fallback.”

## Visual acceptance checklist

Before accepting an authored asset:

- orbit it 360 degrees
- inspect front/back/side silhouette
- test under bright exterior and dim interior light
- test shadows
- test at actual third-person camera distance
- test beside procedural scenery for scale
- test locomotion clip crossfades
- test jump and landing
- test hand/socket attachments
- test on a phone with several characters visible
- confirm no missing textures or network-loaded dependencies inside the GLB
