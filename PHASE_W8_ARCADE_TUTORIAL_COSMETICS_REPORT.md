# Phase W.8 — Arcade Tutorials + Avatar Token Store Report

## Implemented
- Added detailed visual tutorials for all 16 active arcade games.
- Added per-profile/per-game first-use SHOW TUTORIAL / SKIP FOR ME choice.
- HOW TO remains accessible from every arcade game after the first choice.
- Preserved Logan's existing tutorial flow without a duplicate prompt.
- Preserved Cabin Breakout, Campfire Rocket and Neon Snake as self-contained single-file games by embedding their W.8 tutorial locally.
- Added Tokens Store with 14 launch cosmetics across Hat, Glasses and Accessory slots.
- Added server-side allowlist and token-cost validation for unlock/equip/unequip.
- Added equipped cosmetic persistence in player profiles and shared avatar rendering.
- Added approved-character cosmetic sockets HeadTop / Face / ChestAccessory for future 3D attachments.
- Added repeatable daily token economy: +5 first play per arcade title; +10 daily challenge for three different arcade games.
- Made achievement-linked server token awards idempotent.

## Identity protection
Cosmetics do not change approved base identity. The approved turnaround remains authoritative for skin, face, hair, body and base clothing.

## Preserved
Phase W.7 Prop Hunt character/combat work, W.6 gameplay/UX repairs, W.5 approved-character lock and all earlier cumulative work remain included.

## Validation
Working-tree validation: **473 / 473 automated tests passed** and **211 staging checks passed, 0 failed, 2 environment warnings**. Cold-ZIP validation is recorded after packaging.
