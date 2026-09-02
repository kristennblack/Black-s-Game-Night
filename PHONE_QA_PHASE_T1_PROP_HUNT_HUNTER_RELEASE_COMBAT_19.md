# Phase T.1 Phone QA - Prop Hunt Hunter Release + Combat 19

Use a real phone for this checklist. Do not mark phone-verified from automated tests alone.

## Round start / hide phase
- [ ] Start Papa's Shop with at least one hunter and one hider.
- [ ] Hunter view is fully black during the hiding period.
- [ ] Hunter sees **HIDERS ARE HIDING**.
- [ ] Countdown starts around 30 seconds and decreases correctly.
- [ ] Hunter cannot see silhouettes, props, doors or map lighting through the overlay.
- [ ] Hunter cannot move during hide.
- [ ] Hunter cannot rotate the gameplay camera during hide.
- [ ] Hunter cannot jump/sprint/shoot during hide.
- [ ] Hider can move, jump, climb and disguise during hide.
- [ ] Hider can place decoys during hide.
- [ ] Hunter does not hear useful positional hider footsteps/landings during hide.
- [ ] Last 3 seconds are easy to notice.
- [ ] **HUNT!** appears briefly as the view opens.
- [ ] Hunter gains control immediately after release.
- [ ] Decoys placed during hiding are present after release.

## Hunter controls
- [ ] There is no Aim button.
- [ ] Crosshair is visible and is the aiming reference.
- [ ] Looking around moves the shot direction naturally.
- [ ] Tap SHOOT produces one shot.
- [ ] Hold SHOOT produces controlled rapid fire.
- [ ] Hold SHOOT does not require repeated tapping.
- [ ] Release SHOOT stops rapid fire immediately.
- [ ] Rapid fire feels quick but not absurdly fast.
- [ ] Walk while firing works.
- [ ] Run/sprint while firing works.
- [ ] Backpedal while firing works.
- [ ] Strafe left/right while firing works.
- [ ] Turn while firing works.
- [ ] Jump while firing does not break the camera.
- [ ] Shooting does not trigger an unwanted zoom.

## Combat / feedback
- [ ] Wall impacts stop shots correctly.
- [ ] Hider hits register only after the hunt begins.
- [ ] Hider cannot be damaged during the hide countdown.
- [ ] Hit feedback is readable without obscuring the target.
- [ ] Holding fire for several seconds does not cause obvious frame collapse.

## Camera / Papa's Shop
- [ ] Workbench corners remain playable.
- [ ] Tractor area remains playable.
- [ ] Fireplace / Papa chair area remains playable.
- [ ] Barn doorway does not collapse the camera.
- [ ] Outdoor apron works normally.
- [ ] Reset View still works.

## Multiplayer / reconnect
- [ ] Human hunter + human hider works.
- [ ] Hunter reconnecting during hide returns to the black countdown.
- [ ] Hider reconnecting during hide can continue hiding.
- [ ] Bot hunter remains frozen during hide.
- [ ] Bot hider can use the hiding time.

## Regression
- [ ] Disguise changes still work.
- [ ] Flash still works.
- [ ] Decoy count still begins at 10.
- [ ] Health still carries across disguise changes.
- [ ] Classic elimination still enters spectator mode.
- [ ] Family Chaos still converts caught hiders to hunters.
