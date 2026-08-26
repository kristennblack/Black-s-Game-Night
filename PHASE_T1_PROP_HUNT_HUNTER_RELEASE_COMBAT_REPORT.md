# Phase T.1 Implementation Report
## Prop Hunt Hunter Release + Combat Controls

### Build
`GAME-NIGHT-STAGING-PHASE-T1-PROP-HUNT-HUNTER-RELEASE-COMBAT-19`

### Implemented
- Added a fully opaque hunter-only black hiding overlay with an authoritative countdown.
- Hunters are movement/look/jump/sprint/shoot locked during the hide phase.
- Hunter bots are held idle during hide.
- Server state masks hider live position and disguise from a hunter during hide.
- Hider snapshots are not broadcast to hunter connections during hide.
- Reconnect snapshot delivery respects the same hiding privacy rule.
- Network decoys are persisted as round state so decoys created during hide can appear when the hunt begins.
- Hidden-phase decoy locations are masked from hunters until hunt begins.
- Hider positional movement audio is suppressed for a blinded hunter during hide.
- Server hit handling only accepts hunter hits during the `hunt` phase.
- Removed the separate Aim button and aim-input requirement.
- Hunter body facing now uses the camera/crosshair direction as the active combat orientation.
- The stable third-person camera no longer enters a separate button-driven aim zoom state.
- Tap SHOOT fires immediately.
- Hold SHOOT repeats fire at approximately 4.8 shots/second.
- Pointer cancel/lost capture/window blur stops held fire.
- Gamepad held-fire repeats through the same cooldown.
- Existing wall-first shot/muzzle validation remains.
- Existing Phase T locomotion, mantle, disguise, flash, damage and spectator systems are preserved.

### Not claimed
- Not phone-verified in this environment.
- No claim that the chosen rapid-fire rate is final until real-device play confirms it feels fun.
- No claim that the countdown styling is visually final until device review.

### Device gate
Use `PHONE_QA_PHASE_T1_PROP_HUNT_HUNTER_RELEASE_COMBAT_19.md` on a real phone before promoting this beyond staging.
