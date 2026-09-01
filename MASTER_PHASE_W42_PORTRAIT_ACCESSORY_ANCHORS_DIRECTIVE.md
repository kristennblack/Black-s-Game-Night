# MASTER PHASE W42 — SHOP/CARD PORTRAIT ACCESSORY ANCHOR DIRECTIVE

Status: highest-precedence accessory fitting directive until superseded.

## User-approved visual contract
The shop and card-game cosmetic system must fit accessories to the portrait/avatar artwork actually shown beside the player and in the shop. A full-body 3D gameplay character is not a valid approval surface for these portrait cosmetics.

The user approved the W42A.3 anchored-glasses target. The system must use anatomical/semantic portrait points rather than one generic x/y/width box.

## Required portrait landmark contract
Every family portrait profile must support, at minimum:
- left pupil and right pupil;
- nose bridge;
- left/right temples;
- left/right ear anchors;
- head top and left/right head sides;
- optional yaw/perspective metadata;
- baked-accessory conflict flags;
- portrait variant overrides.

Glasses derive center, scale and rotation from pupil/bridge geometry. Hats/headwear use head points. Earrings use ear/earlobe points once calibrated. Headsets use ear + head points. A generic global box may only be a temporary fallback for an uncalibrated non-family portrait and is never visual approval.

## Portrait variants
The selected avatar portrait variant is part of the fitting key. If an exact variant override is absent, inherit that person's calibrated base anchors, not a global one-size-fits-all profile. Add exact per-variant landmarks during QA whenever a style changes crop, face pose or silhouette materially.

## Baked-art conflicts
If a portrait already contains baked-in glasses, hats, or another conflicting accessory, do not stack a second accessory and call it approved. Record the conflict and require a clean base portrait or an explicitly approved adapted presentation.

## Art pipeline
For approved portrait accessories, keep a real 3D master asset when available. Render that master into a transparent portrait overlay for shop/card use. The shop/card renderer uses the transparent production-derived overlay; fully 3D games use a separate 3D wearable path and separate QA gate.

## Evidence hierarchy
1. approved visual target;
2. exact code-driven composition using real app portraits and actual production-derived overlay assets;
3. actual browser/shop/card runtime screenshot;
4. real device screenshot.

AI-generated approval art is a target, never proof that runtime implementation works.

## Release rule
Do not promote the entire accessory catalog. Only items specifically converted and verified through this anchor path may use production-derived portrait overlays. Keep live-release/device approval separate from implementation status.
