# v3.0.1 Playability Recovery

This release is a focused emergency repair after real-device screenshots showed the same third-person failure in Family Prop Hunt, Family Island Life, and John's Birthday Seat.

## Root causes fixed

1. **First-frame camera origin bug**
   - A new PerspectiveCamera begins at world origin (0,0,0).
   - The old shared rig eased from that arbitrary point instead of snapping to a solved third-person location.
   - The camera now solves and snaps on its first frame and after teleports/world transitions.

2. **Camera too high for indoor/elevated spaces**
   - The old focus + fixed vertical lift + pitch put the normal camera near roofs/awnings/platforms.
   - Normal camera focus/lift/pitch were lowered and the tuning profiles were revised.

3. **Single-ray camera collapse**
   - One blocked camera ray could pull the camera nearly onto the avatar.
   - The shared camera now tests several shoulder, vertical-lift and pitch candidates and chooses the best clear route.
   - Sustained camera collapse automatically relaxes toward a recovery pitch/distance.

4. **Non-solid geometry obstructing the camera**
   - Camera obstruction checks now ignore `solid:false` geometry.
   - Unobstructed rays no longer lose padding distance unnecessarily.

5. **Unsafe/stale spawn positions**
   - Shared deterministic safe-position search finds a non-embedded nearby point.
   - Prop Hunt validates spawn rings.
   - Island Life validates the local resident and restores the correct saved world (island vs home) before building the scene.
   - Birthday Seat validates the start position.

6. **No player recovery path**
   - All three 3D games now expose `RESET VIEW`.
   - Keyboard `R` does the same thing.
   - Recovery can depenetrate the avatar, zero invalid velocity, and snap the camera safely behind the character.

7. **Startup cinematics competing with camera initialization**
   - Prop Hunt and Birthday Seat startup reveal shots are disabled in this recovery build.
   - Optional later cinematics remain, with safer pitch values.

## Shared camera behavior after the fix

- first-frame snap to a valid third-person solution
- lower normal focus/lift
- minimum desired play distance
- multiple candidate rays around roofs/awnings/doorways
- alternate shoulder candidate
- lower/neutral pitch candidate
- automatic collapse recovery
- teleport/world-transition snap
- emergency reset

## Device diagnostics

Use `?qa3d=1` on all three 3D games. The HUD reports camera distance/recovery count plus useful position/render information.

## Scope

This release intentionally does **not** add new character art or map art. Playability has to be stable before more visual production work resumes.
