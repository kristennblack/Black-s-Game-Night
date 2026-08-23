# Black Family Game Collection Art Bible

## Shared visual identity
- Warm, rustic family-lodge presentation with readable silhouettes and slightly stylized proportions.
- Characters must remain recognizable across games without becoming photorealistic portraits.
- Avoid flat front-facing gameplay sprites in any game presented as 3D. A 3D character must have a real back, side profile, volume, shadow and consistent orientation.
- Materials should read immediately: wood has visible warm roughness, steel is cooler and tighter, fabric is softer/matte, glass is transparent and reflective, dirt/grass/mud remain visually distinct.
- Lighting should be warm and inviting, with enough contrast that gameplay objects remain readable on phones.
- Family humour comes from details, animations and props, not from intentionally broken-looking models.

## Character continuity
- John: plaid/warm dark red shirt, jeans, cowboy boots; serious fixer stance.
- Kristen: T-shirt and jeans.
- Holly: hoodie and baggy jeans.
- Elizabeth: tank top and shorts; slightly theatrical idle gestures.
- Vanessa: western styling.
- Logan: hoodie and jeans; more reluctant/slouched idle language.
- James: denim shirt and jeans.
- Dorothy: flowy clothing.
- Nana: leggings and shirt.
- Papa: shirt and jeans.
- Dogs are full quadrupeds, never circular tokens in a 3D game.

## Prop Hunt branch
- Target: stylized 3D. Readability sits closer to accessible family games while camera, physicality and hiding tension move toward modern third-person Prop Hunt.
- Third-person camera stays close behind the character, with a modest over-shoulder aim zoom.
- Solid walls always occlude opponents. No enemy silhouettes or nameplates through walls.
- Teammate help should use small directional/UI information rather than full X-ray silhouettes.
- Prop-zappers are fictional but mechanically detailed, with receiver, barrel, grip, stock, sight, recoil and impact effects.
- Human weapons attach to the character rig. Dog weapons mount to a harness/backpack.
- Disguises are actual 3D objects with dimensions that affect collision and camera height.

## Environment rules
- Buildings are constructed spaces, not background paintings: floor, exterior/interior walls, wall thickness, door openings, windows, ceiling, roof, furniture and collision.
- Windows are transparent but physically solid unless deliberately open/broken.
- Reasonable surfaces are climbable; impossible/fragile geometry is not.
- Map clutter should create hiding opportunities without turning navigation into a collision maze.
- Papa's Shop is the reference vertical slice for quality and physicality across future maps.

## Animation language
- Movement uses acceleration/deceleration, gravity, jump/fall/land, turns and automatic mantling.
- Feet and paws should visually correspond to movement speed rather than sliding.
- Weapons stay with the skeleton during movement.
- Dogs use quadruped leg cycles and tail/head secondary motion.
- Animation can be playful, but it should not expose the implementation or look like placeholder geometry.

## UI and mobile
- Left side: movement joystick.
- Right side: camera-look region plus context actions.
- Core actions: Aim/Zoom, Shoot, Jump/Auto-Mantle, Sprint toggle, Prop, Flash, Decoy, Lock.
- Crosshair remains centered and readable without dominating the scene.
- HUD must not reveal hidden enemies through geometry.
