# Phase T Phone QA - Prop Hunt P3 Gameplay + Animation Feel

Build: `GAME-NIGHT-STAGING-PHASE-T-PROP-HUNT-P3-GAMEPLAY-ANIMATION-18`

This checklist is for the real-device visual/playability gate. Automated tests do not replace this pass.

## John / hunter movement

- [ ] Spawn as John in Papa's Shop without being stuck.
- [ ] Idle pose looks stable.
- [ ] Walk speed and leg speed look related.
- [ ] Run looks faster/heavier than walk.
- [ ] Sprint reads clearly and does not skate badly.
- [ ] Releasing movement gives a readable stop instead of a snap.
- [ ] Sharp left/right changes turn John's body naturally when not aiming.
- [ ] Moving diagonally does not make John moonwalk.

## Aiming locomotion

- [ ] Aim + move forward: lower body moves while upper body keeps aim.
- [ ] Aim + backpedal: John stays facing crosshair while travelling backward.
- [ ] Aim + strafe left: readable lateral movement.
- [ ] Aim + strafe right: readable lateral movement.
- [ ] Fire while moving forward.
- [ ] Fire while backpedaling.
- [ ] Fire while strafing left/right.
- [ ] Weapon stays attached to hands and points close to crosshair direction.
- [ ] No severe arm/torso clipping during aim/fire.

## Jump / fall / landing

- [ ] Jump reacts immediately.
- [ ] Airborne state does not keep running animation indefinitely.
- [ ] Small landing looks brief and controlled.
- [ ] Larger drop produces a stronger hard-land response without a long stun.
- [ ] Camera remains comfortable through jump/land.

## Mantle / climbing

- [ ] Mantle a reasonable workbench/ledge.
- [ ] Mantle/climb tractor where the established map allows it.
- [ ] Motion reads as lift + push-over rather than teleporting upward.
- [ ] No camera collapse during mantle.
- [ ] Player does not end inside geometry.

## Papa's Shop camera / traversal

- [ ] Main shop doorway entry/exit.
- [ ] Tight workbench corner.
- [ ] Shelving/clutter edge.
- [ ] Fireplace / Papa's yellow chair area.
- [ ] Tractor area.
- [ ] Motorcycle area.
- [ ] Attached barn doorway/interior.
- [ ] Outdoor apron.
- [ ] Reset View recovers camera/player if needed.
- [ ] No sustained top-down camera collapse.

## Hider / disguise gameplay

- [ ] Change disguise gives a quick visible transform effect.
- [ ] New prop appears grounded rather than floating.
- [ ] Moving prop gets subtle movement feel without becoming cartoonishly obvious.
- [ ] LOCK visibly changes to UNLOCK and stabilizes prop as expected.
- [ ] Disguise counter decreases correctly.
- [ ] Flash becomes ready again after a disguise change.
- [ ] Place a decoy in front of player at a sensible support height.
- [ ] Decoy does not routinely spawn inside a wall.
- [ ] Decoy counter decreases correctly from 10.
- [ ] Placement effect is visible but brief.
- [ ] Flash world/screen effect is readable and not painfully long.

## Damage / elimination

- [ ] Taking a hit gives a brief damage vignette/pulse.
- [ ] HP dot indicator decreases correctly.
- [ ] Elimination happens at the intended health threshold.
- [ ] Classic mode: eliminated hider enters spectator view.
- [ ] NEXT cycles to another living spectator target when available.
- [ ] Spectator camera does not get stuck inside the eliminated player.
- [ ] Family Chaos: caught hider converts to hunter rather than entering Classic spectate.

## Bots / network

- [ ] Hunter bot can move/shoot without animation crash.
- [ ] Hider bot can move/disguise without animation crash.
- [ ] Reconnect restores playable view and correct role/prop state.
- [ ] Remote players animate without severe snapping under normal connection conditions.

## Performance notes

Record device/model: ______________________________

Approximate FPS/feel: _____________________________

Phone heat after 10 minutes: ______________________

Worst camera location: ____________________________

Worst animation/state: ____________________________

Any clipping/prop bugs: ___________________________

## Visual gate decision

- [ ] PASS - ready to propagate P3 locomotion system to more family characters.
- [ ] NEEDS TUNING - engine is usable but animation/camera needs another Prop Hunt pass.
- [ ] FAIL - major playability problem remains.
