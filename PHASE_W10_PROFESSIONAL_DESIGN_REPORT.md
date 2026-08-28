# PHASE W.10 PROFESSIONAL GAME DESIGN MASTER-PROMPT REPORT

Release type: design/prompt architecture update packaged with the latest known-good W.8 runtime.
Runtime gameplay code changed in this phase: NO.

## Main result

The append-only W.9 next-build prompt has been archived and replaced by a canonical W.10 professional game design/production prompt.

New canonical file:
`MASTER_GAME_DESIGN_PRODUCTION_PROMPT_W10.md`

`MASTER_NEXT_BUILD_DEVELOPMENT_DIRECTIVE.md` now contains the same W.10 canonical prompt so existing development workflows that open the historical filename automatically receive the W.10 rules.

## Major improvements

- explicit source-of-truth precedence;
- product north star and player personas;
- six experience pillars;
- quality priority ladder;
- vertical-slice build strategy;
- whole-app UX/input/accessibility/performance standards;
- detailed Prop Hunt state machine, HUD, level-design, movement, mantle, camera, weapon, hider, network and bot contracts;
- improved character production/approval pipeline;
- mobile control presets and platform-sized touch-target guidance;
- WebGL performance budgeting and significance tiers;
- local QA telemetry and professional playtest method;
- production scorecard and Definition of Done;
- release proof bundle and forbidden-shortcut list;
- continuity for W.6-W.8 rules, social/event/birthday systems and 31 Blind.

## Research

`W10_PROFESSIONAL_GAME_DESIGN_RESEARCH_NOTES.md` records the external professional sources used for the rewrite, including current Epic/Unreal/Fortnite guidance, Apple/Android touch guidance, Microsoft Xbox Accessibility Guidelines, MDN WebGL best practices and selected GDC design talks.

## Important honesty note

W.10 is a design/prompt packaging release. It does not claim that the W.10 Prop Hunt controller, character art, accessibility options or performance systems are already implemented in runtime code.

The next implementation phase should use the W.10 John/Papa's Shop phone vertical-slice gate.

## Runtime vs design-release identity

W.10 is a design/prompt packaging release, not a gameplay runtime release. Therefore:

- `VERSION.txt` remains the runtime build identity required by the unchanged W.8/T1 runtime.
- `CURRENT_RELEASE.txt` remains `GAME-NIGHT-STAGING-PHASE-W8-ARCADE-TUTORIAL-STORE-33`.
- `package.json` retains the W.8 runtime semantic version.
- `DESIGN_RELEASE.txt` identifies this documentation package as `GAME-NIGHT-DESIGN-PHASE-W10-PROFESSIONAL-MASTER-PROMPT-34`.

This separation prevents documentation work from masquerading as a new tested gameplay runtime.

## Final working-tree validation

- Full automated suite: **473 / 473 passed, 0 failed**.
- Staging validator: **211 passed, 2 warnings, 0 failed**.
- Known warnings only: core Three.js CDN dependency remains; live Cloudflare deployment is not verifiable in this local environment.
- Runtime byte audit against the W.8 baseline: **0 changed runtime/code/assets** across the audited runtime extensions.

The final release archive must be cold-extracted and these gates rerun from the exact ZIP before handoff.
