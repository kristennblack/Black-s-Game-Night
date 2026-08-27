# Master Phase W.7 Prop Hunt Character + Combat Directive

This file is a focused extract of the Phase W.7 locked requirements. The authoritative cumulative version is also appended to `MASTER_NEXT_BUILD_DEVELOPMENT_DIRECTIVE.md`.

## Goal
Turn the Prop Hunt hunter experience from a technically functional 3D prototype into a readable third-person character/combat vertical slice on phones.

## First gate: John
John is the test character. The approved turnaround controls his identity. The old authored John GLB is not allowed to load as the runtime character unless its model manifest entry has `approvedModel: true`.

### John must show
- approved skin/hair/beard/plaid/jeans/boots identity;
- correct hands, never backwards;
- right hand on trigger grip;
- left hand under the fore-end;
- visible chunky Prop Zapper;
- close right-shoulder camera;
- center-screen crosshair matching the shot ray;
- visible muzzle light, energy tracer and impact burst;
- mild mobile aim assist only inside the small cone;
- wall/muzzle obstruction respected;
- hider hit reaction without identity reveal until caught.

## Shared implementation
- One shared humanoid semantic skeleton.
- Lightweight approved procedural fallback until an authored GLB passes the approved visual gate.
- Weapon grip sockets plus procedural grip hands for the fallback rig.
- Aim-layer upper body with directional lower-body locomotion.
- Hitscan gameplay with visible 3D tracer.
- Unlimited ammo uses energy pulse/recoil, not reload.
- Phone controls: left movement, right drag look, Shoot, Jump, Sprint, shoulder swap and Reset View.

## Expansion
Only after John passes actual-device QA should this shared character/combat foundation be propagated to the rest of the approved family turnarounds.
