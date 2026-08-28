# BLACK FAMILY GAME NIGHT
# MASTER PHASE W.9 PROP HUNT CHARACTER DETAIL + CONTROL QUALITY DIRECTIVE
## Approved-character fidelity, production rigging, responsive third-person controls and mobile-first playability

**Planning date:** 2026-08-27  
**Status:** LOCKED NEXT-BUILD PROP HUNT QUALITY CONTRACT  
**Precedence:** This directive is cumulative with W.5 through W.8. When it conflicts with older generic character-detail or Prop Hunt control guidance, this directive wins. Approved turnarounds still have the highest authority over character identity.

---

# 1. PURPOSE

The next Prop Hunt pass must stop treating character appearance and controls as secondary polish. They are core gameplay systems.

The target is a phone-first third-person family Prop Hunt game where:
- every approved family member reads immediately as their approved 3D cartoon self;
- characters have enough modeled depth to stop looking blocky, flat or interchangeable;
- hands, arms, shoulders and weapon grips are anatomically and directionally correct;
- the camera feels deliberately placed rather than merely following a player capsule;
- movement feels responsive, forgiving and predictable on touch, mouse/keyboard and gamepad;
- hunters can always see the Prop Zapper, crosshair, tracer and impact;
- hiders can move, jump, climb, disguise, flash and deploy decoys without fighting the controls;
- collision and camera recovery never leave a player pinned, top-down, inside geometry or unable to orient themselves.

The design reference for control feel is the clarity and immediacy of a polished Roblox-style third-person game, while preserving Black Family Game Night's own art direction and mechanics. Do not copy another game's assets or UI.

---

# 2. CHARACTER IDENTITY RULE

> **DETAIL MAY INCREASE. IDENTITY MAY NOT DRIFT.**

The approved turnaround controls:
- skin tone;
- age read;
- head silhouette;
- hair colour and hairstyle;
- facial hair;
- body proportion read;
- approved base clothing;
- shoe/boot silhouette;
- signature colour relationships.

More detail means improving the three-dimensional construction of the approved design. It does not mean making the person more realistic, changing their face, restyling their hair, replacing their clothes, changing body type or "beautifying" the approved cartoon.

Every candidate model must be shown against the approved front, front 3/4, side, back 3/4 and back views before it can be marked approved.

---

# 3. PROP HUNT CLOSE-CAMERA MODEL DETAIL STANDARD

The old 5,000 to 6,500 triangle target remains acceptable for distant fallback models, but Prop Hunt uses a close shoulder camera and needs a higher-detail LOD0 for approved hero characters.

## 3.1 Human LOD targets
Target, not hard cap:
- LOD0 close gameplay: approximately 8,000 to 12,000 triangles;
- LOD1 ordinary medium distance: approximately 4,000 to 6,500 triangles;
- LOD2 distant/spectator: approximately 1,500 to 2,500 triangles;
- optional ultra-low crowd/icon representation below that when needed.

Spend the extra geometry first on:
1. head and face silhouette;
2. hair shape;
3. shoulders/arms/hands;
4. clothing silhouette and major folds;
5. shoes/boots;
6. only then small decorative detail.

Do not spend mobile geometry on invisible seams, tiny buttons, individual hair strands or dense topology under clothing.

## 3.2 Texture/material target
For LOD0:
- one 2048 atlas is acceptable for a hero character when memory budget permits;
- otherwise use a well-packed 1024 atlas plus small shared material textures;
- use base colour, roughness and lightweight normal detail where it materially improves readability;
- avoid flat unlit plastic unless intentionally used for a specific stylized surface;
- skin, denim, cotton, hair and leather should not all have identical roughness.

The visual goal is soft stylized PBR, not photorealism and not flat blocks.

---

# 4. FACE CONSTRUCTION STANDARD

Faces are the highest-priority identity area.

Every approved human character should have:
- a real rounded cranium and cheek volume rather than a flat face attached to a sphere;
- simple but readable nose bridge/tip volume;
- chin/jaw shape matching the approved cartoon silhouette;
- separate eyeballs seated correctly in the head;
- visible upper/lower eyelid shaping or equivalent geometry/texture support;
- eyebrows that follow the approved shape and colour;
- mouth/lip volume sufficient for expressions without looking pasted on;
- ears that sit at consistent height and do not intersect hair or glasses;
- glasses positioned from the nose/ear anchors rather than floating in front of the face;
- beard/moustache geometry that follows the face rather than hovering away from it.

Minimum facial animation set for close gameplay and reactions:
- blink;
- soft smile;
- concerned/frown;
- surprised/startled;
- happy/celebrate;
- hit/react squint.

Facial animation must be subtle during ordinary movement. Do not create constant exaggerated mouth motion.

---

# 5. HAIR + FACIAL HAIR STANDARD

Hair must preserve the approved silhouette from all five turnaround views.

Use layered sculpted masses rather than:
- a single featureless helmet blob;
- thousands of individual strands;
- flat billboard hair that disappears from side/back views.

Recommended construction:
- one main skull-hugging base mass;
- two to five secondary clump/mass shapes where the approved hairstyle needs them;
- a small amount of normal/texture detail for strand direction;
- clean hairline integration around forehead, ears and neck.

Special cases:
- curls/waves should read as large grouped forms, not beads or noodles;
- Holly's two buns must remain symmetrical enough to read instantly but retain the approved hand-sculpted softness;
- Vanessa's long curls need layered depth down the back so the silhouette does not become a flat sheet;
- James's grey curls need rounded clustered volume rather than a smooth grey cap;
- John's beard must remain a short full beard with clear cheek/jaw/chin volume.

---

# 6. HANDS, WRISTS AND ARM ORIENTATION

The backwards-hand problem is a release blocker.

## 6.1 Bind-pose convention
All approved humanoid rigs must use one documented forward convention:
- character faces +Z in authoring/export or the engine-equivalent agreed axis;
- palms face inward/down naturally in neutral pose;
- thumbs point anatomically toward the body in neutral relaxed pose;
- left and right hand bones are never mirrored by negative scale at runtime;
- transforms are frozen/applied before export;
- no runtime 180-degree hand correction should be required for a correctly authored GLB.

## 6.2 Weapon grip
Hunter weapon grip:
- right hand is trigger hand;
- left hand is support hand under/front of the weapon;
- wrist bend stays within a believable range;
- elbows remain visibly connected to shoulder direction;
- weapon cannot appear to float between hands;
- hands cannot intersect the chest, forearm or gun body during ordinary aim.

Required weapon sockets:
- `rightHandSocket`;
- `leftHandSupportTarget`;
- `weaponMuzzle`;
- `weaponSightTarget` or equivalent aim reference.

Left hand must use IK or an equivalent constrained solution so it remains on the support grip while the right hand/weapon aims.

## 6.3 Hand detail
At Prop Hunt camera distance, hands should read as hands. Five-finger topology is preferred for LOD0 if stable, but simplified joined fingers are acceptable if:
- the thumb is separate and correctly oriented;
- grip silhouette is convincing;
- no finger geometry visibly explodes or twists;
- LOD switching does not flip palm direction.

---

# 7. CLOTHING + BODY DEPTH

Characters should no longer look like coloured cylinders with a head attached.

Model the large forms that define the approved outfit:
- shirt/hoodie/cardigan thickness;
- collar or hood volume where visible;
- waistband/belt depth;
- skirt/apron layers where applicable;
- boot/shoe sole and toe shape;
- backpack depth/straps where approved;
- major sleeve and pant-leg folds that improve silhouette.

Keep small seams, plaid, logos, polka dots and fabric weave primarily in textures.

Clothes should move with the body cleanly. Avoid armpit collapse, sleeve spikes, waist tearing and skirt/apron clipping during run, jump, crouch and mantle.

---

# 8. APPROVED CHARACTER PRODUCTION CARDS

These are detail instructions for Prop Hunt. They do not override the actual turnaround image if any wording appears ambiguous.

## 8.1 John Black
- Adult male, sturdy/stocky cartoon build with a broad torso and slightly shorter-looking leg proportion than the slimmer adults.
- Large friendly head, strong brows, large warm eyes and short side-swept brown hair with visible clump direction.
- Full short brown beard with readable cheek, jaw and chin mass. Beard must not become a goatee or moustache-only shape.
- Red/black plaid button shirt must read clearly from medium distance through texture, with shirt volume distinct from the body.
- Blue jeans, brown belt and brown work boots.
- Keep his silhouette grounded and substantial, but do not exaggerate him into a caricature beyond the approved turnaround.
- Hunter aim pose should feel solid and confident rather than hunched.

## 8.2 Kristen
- Adult female, slimmer/average cartoon build with a clean waist/hip silhouette matching the approved turnaround.
- Shoulder-length wavy blonde hair, layered enough to read from side/back without becoming a flat sheet.
- Large bright eyes and soft rounded cartoon facial features.
- Black fitted short-sleeve top, blue jeans, brown belt and brown boots/shoes as approved.
- Preserve the simple black-shirt silhouette. Do not add jackets, graphics or game-specific costume pieces to the base model.

## 8.3 Holly
- Child proportions: noticeably shorter body, larger head-to-body ratio, smaller shoulders and shorter limbs than adults.
- Bright blonde hair in two high round buns. The buns are a primary identity feature and must read from front, side and back.
- Cream padded hoodie/vest-style top exactly as approved, blue backpack straps/backpack, blue pants and brown shoes.
- Keep the face youthful and rounded. Do not age her up through adult jaw, torso or limb proportions.
- Backpack must move as an attached accessory without clipping heavily into hair or shoulders.

## 8.4 Vanessa
- Adult female, slightly taller/slimmer visual read than the compact characters.
- Long, voluminous golden-blonde curls are the dominant silhouette feature. Hair needs layered depth across shoulders and down the back.
- Burgundy/red collared long-sleeve top, blue jeans, brown belt and brown boots.
- Preserve the clean confident posture of the turnaround.
- Do not straighten, shorten or darken the hair.

## 8.5 Elizabeth / Lizzie
- Young child proportions with a larger head-to-body ratio and shorter limbs.
- Bright blonde high ponytail with a large pink bow. Bow and ponytail silhouette must remain readable while running.
- Pink hoodie/top, pink skirt with white polka dots, white socks and pink Croc-style clogs.
- Skirt should have enough thickness/volume to read in 3D but remain inexpensive to animate.
- Ponytail may use one secondary dynamic bone or restrained spring motion. It must not whip wildly through the head.

## 8.6 Logan
- Boy/young teen proportions: shorter and narrower than adults, but older/taller in read than the youngest children.
- Tousled/spiky bright blonde hair with an irregular silhouette. Do not smooth it into a round cap.
- Black hoodie with the approved fishing/outdoor emblem, dark cargo-style pants and tan/brown work boots.
- Movement personality may feel energetic, but gameplay speed/timing remains identical to equivalent players.

## 8.7 James
- Older adult male with compact, slightly rounded cartoon proportions.
- Short clustered grey curls, round glasses and grey moustache are the three strongest face/silhouette identifiers.
- Bright blue button-up shirt, blue jeans, brown belt and brown shoes.
- Glasses must remain securely aligned during facial animation and not clip into cheeks/ears.
- Age should read through hair/moustache, posture and soft facial shapes, not through photorealistic wrinkles.

## 8.8 Dorothy
- Older adult female with compact/rounded approved proportions.
- Blonde hair gathered into the approved high bun/updo. No glasses.
- Blue long-sleeve dress/top layer, cream floral apron and blue shoes.
- Apron is a major silhouette layer and should have modest cloth movement or clean skinned deformation without floating away from the body.
- Preserve warm older-character styling without adding age-detail that changes the approved cartoon face.

## 8.9 Characters without approved turnarounds
Papa, Nana, Kelsi, Molly and Gunner remain pending individual turnaround approval. Existing compatibility assets may remain, but do not use this detail pass as permission to redesign them.

---

# 9. SHARED CHARACTER RIG + ANIMATION QUALITY

Use one compatible humanoid semantic rig wherever practical.

Required bones/semantic targets:
- root;
- hips;
- spine lower;
- chest/spine upper;
- neck;
- head;
- left/right clavicle;
- upper arm;
- forearm;
- hand;
- left/right thigh;
- shin;
- foot;
- toe where useful.

Quality requirements:
- shoulder deformation must not collapse during two-hand aiming;
- elbows bend in the correct anatomical direction;
- knees never reverse;
- feet remain grounded during idle/walk/run where terrain permits;
- foot IK may correct reasonable uneven surfaces;
- head can track aim subtly without detaching from torso motion;
- animation transitions use blending rather than hard snapping;
- lower-body locomotion and upper-body aim are independent layers;
- when aim exceeds comfortable spine twist, the whole character turns instead of corkscrewing.

Suggested aim behavior:
- up to roughly 45 to 60 degrees yaw can be absorbed through chest/shoulder aim offset;
- beyond that range, initiate turn-in-place or locomotion rotation;
- pitch distributes across chest, shoulders, arms and head, never only the wrists.

Base Prop Hunt animation set:
- idle relaxed;
- idle hunter-ready;
- walk forward/back;
- strafe left/right;
- run;
- sprint;
- start/stop acceleration blends;
- turn in place left/right;
- jump start;
- fall loop;
- land soft;
- land hard;
- crouch idle/move where used;
- mantle low;
- mantle high;
- fire/recoil;
- hit reaction;
- celebrate;
- hider prop-change reaction;
- flash throw/use reaction;
- decoy placement reaction.

---

# 10. CONTROL DESIGN PRINCIPLE

Controls must feel direct enough that the player thinks about hiding/searching, not about operating the avatar.

Core rules:
- movement is always camera-relative;
- look and movement are independent;
- input strength is analog, not binary on touch/gamepad;
- acceleration adds weight without adding lag;
- releasing movement stops promptly;
- the character must never rotate unpredictably because the camera moved;
- hunter aim must remain stable while strafing;
- hider movement must remain readable even when disguised as a prop;
- Jump must also be the context for automatic mantle where appropriate;
- no separate climb button is required;
- all controls must be reachable without covering the centre aiming region on phone.

---

# 11. MOVEMENT TUNING TARGETS

These are baseline feel targets and may be tuned after actual-device testing. Preserve relative behavior even if engine units differ.

## 11.1 Analog response
- joystick dead zone approximately 8 to 12 percent;
- preserve partial stick magnitude;
- gentle response curve around centre for careful movement;
- full stick reaches full intended locomotion speed;
- diagonal input cannot exceed forward max speed.

## 11.2 Ground acceleration/braking
Target feel:
- reach ordinary run speed in roughly 0.20 to 0.30 seconds;
- reach sprint in roughly 0.30 to 0.40 seconds;
- stop from run in roughly 0.15 to 0.22 seconds after release;
- direction reversal should brake then accelerate, not instantly teleport velocity.

Use surface friction and collision sliding so players glide along walls rather than sticking dead when moving diagonally into them.

## 11.3 Speed tiers
Use relative tiers rather than wildly different per-character speeds:
- careful walk: about 50 to 60 percent of run speed;
- run: baseline 100 percent;
- sprint: about 125 to 140 percent of run speed.

Character personality cannot grant a competitive speed advantage unless a future game rule explicitly says so.

## 11.4 Air control
- retain reduced but useful air steering;
- enough correction to land on reasonable shop/tractor/workbench surfaces;
- not enough to reverse direction unnaturally at full speed in midair.

## 11.5 Jump forgiveness
- coyote time target: about 100 to 140 ms;
- jump input buffer target: about 120 to 180 ms;
- variable jump height remains supported;
- holding Jump gives the full arc;
- early release shortens the jump cleanly.

---

# 12. AUTO-MANTLE + CLIMBING

Jumping toward a reasonable ledge should automatically mantle if the destination is valid.

The mantle solver must check:
1. obstacle is tagged/derived as climbable;
2. chest/waist probe finds a ledge;
3. top surface exists and is reasonably flat;
4. destination capsule has head/body clearance;
5. surface is not intentionally non-solid/scenic only;
6. movement would not place the player inside another collider.

Mantle presentation:
- brief hand/upper-body reach;
- hips rise over ledge;
- feet follow;
- no simple vertical teleport/sliding cylinder effect;
- camera eases with the body and never dives into the ledge.

Reasonable climbables include the previously approved Papa's Shop tractor, workbench, hay/storage routes and other sensible surfaces.

---

# 13. CAMERA + LOOK CONTROL

## 13.1 General third-person camera
- camera target is upper torso/shoulders, not the feet and not directly above the head;
- orbit stays behind/around the character with stable horizon behavior;
- no top-down collapse;
- no near-avatar pinning;
- camera collision uses multi-candidate recovery rather than one ray;
- first frame, respawn and teleport snap to a solved safe camera instead of easing from an invalid origin;
- Reset View is always available.

## 13.2 Hunter shoulder camera
Default:
- right shoulder;
- close enough to read character/weapon;
- far enough that the weapon, crosshair and target area are simultaneously visible;
- aim pivot at upper chest/neck region;
- shoulder offset scales with character size;
- character should occupy roughly the left third of the screen in right-shoulder mode, not the centre crosshair area.

Shoulder swap mirrors presentation without changing shot rules.

## 13.3 Hider camera
Hider camera is slightly wider than hunter aim camera:
- enough environment awareness to plan hiding routes;
- still close enough to appreciate the approved avatar before disguise;
- when disguised, camera follows the prop's gameplay centre while preserving stable horizon and look control.

## 13.4 Look tuning
Controls panel must support:
- sensitivity;
- invert vertical look;
- left-handed mobile layout;
- optional camera smoothing level;
- Reset View.

Mouse input should feel near-direct with minimal smoothing. Touch/gamepad may use light damping to avoid jitter.

---

# 14. DESKTOP CONTROL MAP

Shared:
- WASD / arrows: move;
- mouse movement/drag: camera/look;
- Space: jump and contextual mantle;
- Shift: hold sprint;
- C: shoulder swap;
- R: Reset View.

Hunter:
- Left Mouse: fire Prop Zapper;
- no separate aim button required by default;
- optional right mouse may temporarily tighten camera/FOV only if later testing proves useful, but must never be required to shoot accurately.

Hider recommended actions:
- Q: change disguise when a change is available;
- E: place decoy;
- F: flash grenade;
- action keys must also have visible UI equivalents and may be remapped if they collide with future interaction bindings.

Do not bind critical actions only to keyboard shortcuts. The screen UI must communicate the same actions.

---

# 15. GAMEPAD CONTROL MAP

Shared:
- Left Stick: move;
- Right Stick: look;
- A / primary bottom face button: jump/mantle;
- Left Stick Click or designated sprint button: sprint;
- Left Bumper: shoulder swap;
- menu/control action: Reset View accessible through controls/pause.

Hunter:
- Right Trigger: fire;
- no mandatory aim trigger.

Hider:
- face/bumper buttons map to Change Prop, Decoy and Flash with on-screen labels that update to match the connected controller.

Aim assist is permitted for gamepad only inside the same restricted assist rules used for touch.

---

# 16. MOBILE CONTROL MAP

## 16.1 Thumb zones
Left side:
- floating or fixed analog movement joystick;
- Sprint control close to the movement thumb, not across the screen.

Right side:
- open-look drag zone across the unobstructed game view;
- large contextual primary action near lower-right;
- Jump above/near the primary action;
- secondary role actions arranged so the thumb can reach them without crossing the crosshair.

## 16.2 Hunter mobile controls
Visible:
- movement joystick;
- Sprint;
- SHOOT large primary button;
- JUMP;
- small shoulder-swap control;
- Reset View in a safe secondary location.

Hidden while hunter:
- Change Prop;
- Decoy;
- Flash.

## 16.3 Hider mobile controls
Visible:
- movement joystick;
- Sprint;
- JUMP;
- CHANGE PROP with remaining change count;
- DECOY with remaining count out of 10;
- FLASH showing availability for the current disguise;
- shoulder swap / Reset View in smaller secondary positions.

Hidden while hider:
- SHOOT.

## 16.4 Mobile ergonomics
- respect safe-area insets;
- minimum comfortable touch target approximately 44 CSS px, preferably larger for Shoot/Jump;
- controls cannot overlap the crosshair or central target zone;
- right-look drag must not accidentally fire;
- dragging off a button must not leave it permanently held;
- multi-touch must support moving, looking and pressing Jump/Shoot simultaneously;
- browser pinch/scroll gestures must not steal gameplay touches inside the play surface;
- left-handed layout swaps action/movement clusters while preserving readability.

---

# 17. HUNTER AIM + SHOOTING CONTROL QUALITY

Hunter aiming must be camera-led, not arm-led.

Pipeline:
1. crosshair defines camera ray;
2. camera ray finds intended target/impact;
3. weapon and upper-body aim toward that point;
4. physical muzzle ray revalidates obstruction;
5. actual hit uses the validated result;
6. tracer, muzzle flash, impact and hit marker all describe that exact same shot.

No mismatch is allowed where:
- crosshair points at one prop;
- beam visibly goes elsewhere;
- hit registers on a third object.

## 17.1 Aim assist
Touch/gamepad only:
- small assist cone;
- prefer reticle friction / mild target bias over snapping;
- never rotate the camera without player input;
- never outline enemies through walls;
- never pull through solid cover;
- assist immediately releases when target leaves the visible valid cone.

## 17.2 Feedback
Every shot:
- visible muzzle flash;
- visible fast tracer/energy streak;
- impact burst at real impact point;
- material-aware impact variation where practical;
- subtle recoil;
- optional light haptic pulse on supported mobile devices.

Hider hit:
- stronger hit marker;
- small target shake/reaction;
- clear audio cue;
- no identity reveal before elimination.

---

# 18. HIDER CONTROL QUALITY

Hider play must feel as polished as hunter play.

Locked gameplay behavior from existing Prop Hunt rules remains:
- hider health carries across disguise changes;
- up to 3 disguise changes per round;
- each disguise grants one flash grenade;
- exactly 10 decoy props total per hider per round;
- hiders can run, jump and climb reasonable surfaces.

Control requirements:
- changing prop never steals camera orientation unexpectedly;
- player retains movement control immediately after transformation;
- camera recentres around the new prop bounds safely;
- decoy placement previews legal/illegal placement before committing where practical;
- Flash has immediate readable feedback and a clear cooldown/availability state;
- hider cannot become stuck because the chosen prop's bounding box intersects nearby geometry;
- invalid disguise placement must search a safe nearby placement or cancel cleanly.

Prop movement should feel intentional. Use a stable gameplay collider separate from decorative mesh detail when needed.

---

# 19. COLLISION + UNSTICK RULES

Controls cannot feel good if collision traps the player.

Required:
- capsule/body collider uses a small skin width;
- movement slides along walls;
- small reasonable steps are traversed without snagging;
- ceilings prevent standing/mantle completion safely;
- decorative `solid:false` geometry does not block player or camera;
- spawn positions are validated before use;
- sustained camera collapse triggers automatic recovery;
- sustained player overlap/stuck state triggers a safe local recovery rather than leaving the player pinned;
- R / Reset View fixes camera only unless a separate explicit Respawn/Unstick command is selected.

Do not teleport players casually during normal wall contact. Recovery is for genuine invalid/stuck states.

---

# 20. NETWORK/REMOTE-PLAYER PRESENTATION

Local input must feel immediate even in multiplayer.

- local movement/camera respond instantly to local input;
- remote characters use interpolation/smoothing;
- remote animation state follows replicated velocity/aim rather than replaying raw key presses;
- shooting validation remains authoritative according to the existing multiplayer architecture;
- cosmetic animation smoothing cannot delay the local player's actual fire response;
- remote characters should not moonwalk because their facing direction and movement vector disagree.

---

# 21. CHARACTER DETAIL QA GATE

For every approved human character brought into Prop Hunt, capture actual gameplay views and verify:

Identity:
1. front/3-quarter gameplay view still matches approved turnaround;
2. side silhouette reads correctly;
3. hair silhouette is unmistakable;
4. skin tone is unchanged;
5. outfit colours/pieces are unchanged;
6. age/body proportion read is correct.

Construction:
7. face is rounded and dimensional, not flat/blocky;
8. hair has sculpted volume;
9. shoulders/elbows/wrists deform cleanly;
10. palms/thumbs face correctly;
11. shoes/boots have visible 3D shape;
12. clothing has major volume/folds without needless geometry.

Animation:
13. idle does not look frozen;
14. run has believable arm/leg cadence;
15. strafe does not twist hips backwards;
16. jump/fall/land read as separate states;
17. mantle is a real body action, not vertical sliding;
18. aim pose keeps both hands on the weapon;
19. facial reaction does not distort identity.

A model that merely loads is not approved.

---

# 22. CONTROL QA MATRIX

Each release candidate must be tested on desktop and at least one real phone for:

Movement:
- half joystick;
- full joystick;
- diagonal movement;
- immediate release/braking;
- forward to reverse;
- sprint start/stop;
- strafe while aiming;
- move while rotating camera.

Jump/climb:
- standing jump;
- running jump;
- buffered jump just before landing;
- coyote jump just after edge;
- low mantle;
- high reasonable mantle;
- rejected mantle under low ceiling;
- tractor/workbench/hay climb routes.

Camera:
- spawn;
- respawn;
- indoors;
- outside;
- camera against wall;
- camera under awning/roof;
- shoulder swap;
- Reset View;
- no top-down collapse;
- no avatar-pinned collapse.

Hunter:
- fire standing;
- fire walking;
- fire strafing;
- fire sprint transition;
- fire immediately after jump/land;
- muzzle against wall;
- target near crosshair edge with aim assist;
- impact on wood/metal/ground/prop where material feedback exists.

Hider:
- transform near open space;
- transform near wall;
- three disguise changes;
- one flash per disguise;
- ten-decoy limit;
- place decoy while moving then recover control;
- jump/mantle while disguised where allowed;
- receive hits without identity reveal until caught.

Mobile multi-touch:
- move + look;
- move + jump;
- move + look + shoot;
- sprint + look;
- hider move + look + flash;
- no browser scroll/zoom interference.

---

# 23. FIRST RELEASE GATE

Before expanding new higher-detail models to the full cast, John remains the first complete proof.

John must pass actual-phone QA showing:
- unmistakable approved John face/hair/beard/plaid silhouette;
- visibly more dimensional head, hair, beard, clothing, boots and hands than the old blocky fallback;
- correct two-hand Prop Zapper grip;
- no backwards hands;
- clean run, strafe, jump and mantle;
- close shoulder camera that keeps John and the weapon readable;
- exact crosshair/shot alignment;
- visible tracer and impact;
- responsive joystick/look/shoot multi-touch;
- no camera collapse or player pinning.

After John passes, reuse the same technical foundation for Kristen, Holly, Vanessa, Lizzie, Logan, James and Dorothy while preserving each approved production card.

---

# 24. NON-NEGOTIABLE FAILURE CONDITIONS

Do not call the Prop Hunt character/control pass complete if any of the following remains:
- approved character looks like a generic substitute;
- hair/outfit/skin tone drifts from approved art;
- backwards palms or wrists;
- weapon not visible during normal hunter play;
- crosshair and actual shot disagree;
- tracer cannot be seen;
- player cannot tell what surface/object was hit;
- camera repeatedly becomes top-down or collapses into the character;
- joystick movement feels binary or sticky;
- releasing movement produces long unwanted sliding;
- jump input is frequently missed on touch;
- reasonable climbable objects cannot be mantled reliably;
- mobile buttons overlap the aiming area;
- player cannot move, look and shoot/jump simultaneously;
- hider transform/decoy/flash actions leave movement or camera in a broken state;
- automated tests pass but the actual phone experience still looks or feels wrong.

The final judge is playable actual-device quality, not test count.
