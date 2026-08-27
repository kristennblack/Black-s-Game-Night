# Phase W.5 — Approved Family Character Lock Report

## Purpose
Package the explicitly approved ultra-simplified family character turnarounds into the current game release and create one reusable code contract for the 3D games.

## Turnaround-approved in this release
- John
- Kristen
- Holly
- Vanessa
- Elizabeth (Lizzie)
- Logan
- James
- Dorothy

## Pending individual approval
- Papa
- Nana
- Kelsi
- Molly
- Gunner

## Added
- `public/approved-character-turnarounds/` containing the approved reference sheets.
- `public/family-3d-lineup-approved.png` replaced with the newly approved ultra-simplified master lineup.
- `public/approved-family-characters.mjs` runtime identity/build registry.
- `public/approved-family-characters.json` machine-readable registry.
- `MASTER_APPROVED_FAMILY_CHARACTER_DIRECTIVE.md` with highest-precedence identity rules.
- Manifest fields for approved turnaround references and reserved future GLB paths.
- Automated regression coverage for the approval registry and packaged reference images.

## 3D game integration
The approved registry is consumed by:
- Family Prop Hunt
- Family Island Life
- John's Birthday Seat

The procedural fallback rigs now receive approved base skin/hair/clothing colours for the locked cast, and the shared art kit contains simplified silhouette cues for the approved hairstyles/outfits. This gives the games a lower-cost visual bridge while authored GLBs are produced.

## Important limitation
Turnaround images are **source references**, not finished 3D mesh files. A candidate GLB must still be modeled/rigged and visually compared against the approved turnaround. The manifest intentionally keeps `approvalStatus: TURNAROUND_APPROVED_MODEL_PENDING` until that visual gate is passed.

## Non-regression
All W.1–W.4 gameplay, Gammon, card-hand, Join, Dorothy Garden, Vanessa Pipe and Logan Trail Logic work remains cumulative.

## Validation
- Full automated game suite: **446 / 446 passed**.
- Staging validator: **208 passed, 0 failed, 2 environment warnings**.
- Remaining warnings: existing Three.js CDN dependency and live Cloudflare deployment unavailable from this environment.
