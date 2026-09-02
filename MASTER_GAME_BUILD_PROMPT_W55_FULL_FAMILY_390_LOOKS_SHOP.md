# BLACK FAMILY GAME NIGHT — W55 FULL FAMILY LOOKS SHOP MASTER PROMPT

Candidate ID: `GAME-NIGHT-STAGING-CANDIDATE-W55-FULL-FAMILY-390-LOOKS-SHOP-73`
Official release identity remains: `GAME-NIGHT-STAGING-PHASE-W30-PROP-HUNT-P0-GAMEPLAY-54`

## Governing goal
Maintain one reliable Looks Shop containing the approved complete-avatar collections for the full core family roster. Every supported character has exactly 30 complete looks. Each look must retain that character's approved identity and may change only approved clothing, accessories, hats, hair arrangement, seasonal styling, or themed presentation. Do not replace or reinterpret the person/animal.

## Locked full-family roster
The Looks Shop must contain exactly these 13 complete-look collections, 30 looks each, for 390 total:

1. John
2. Holly
3. Gunner
4. Dorothy
5. Molly
6. Kelsi
7. Lizzy / Elizabeth
8. James
9. Vanessa
10. Logan
11. Papa
12. Nana
13. Kristen

### Naming locks
- Spell Elizabeth's familiar name only as **Lizzy**. Never use “Lizzie.”
- Store/runtime key for Lizzy / Elizabeth remains `elizabeth` for compatibility.

### Identity locks
- The approved image/board for each person or dog is the source of truth. Do not generate a different identity from text.
- Papa is specifically the approved older white man with shaggy gray hair, the recognizable side/profile facial structure, and the approved realistic game-avatar identity. Never substitute the unrelated older Black man that appeared in rejected Papa generations.
- Once an approval board is accepted, its identity and look concepts are locked unless the user explicitly changes them.

## Catalog contract
Each character has a catalog at:
`public/<character>-looks-catalog.mjs`

Each catalog must:
- export exactly 30 looks;
- use IDs `<character>-look-01` through `<character>-look-30`;
- make look 01 the free starter look;
- give every look a valid numeric token price;
- include at least three looks with an `earn.rewardKey` so they can also be won;
- retain any previously approved names/descriptions unless explicitly changed.

## Image contract — do not regress
For every one of the 390 looks, package both:
- primary: `public/look-assets/<look-id>.jpg`
- backup: `public/avatars/styles/<look-id>.jpg`

The Looks Shop image renderer must try, in this order:
1. primary `/look-assets/<look-id>.jpg`
2. backup `/avatars/styles/<look-id>.jpg`
3. character base avatar `/avatars/<character>.png` (John may retain its existing compatible base path)

Use the W55 cache-bust string `W55-FULL-FAMILY-390-LOOKS-SHOP-73` for current complete-look image requests. A missing/stale image path must not blank the shop.

## Looks Shop behavior
Primary player-facing shopping destinations remain:
- **Looks Shop**
- **Cabin Room Shop**

The Looks Shop must:
- show all 13 character tabs;
- show all 30 cards for the selected character;
- show starter/owned/locked/equipped state;
- show Family Token price for purchasable looks;
- show the earn condition for winable looks;
- allow preview;
- allow purchase;
- allow equip after ownership;
- preserve ownership across reload/profile synchronization.

Old approval studios/labs are not normal player shopping destinations.

## Purchase contract — critical W55 fix
Purchases for complete avatar looks must use `/api/arcade/look` with:
- `action: "buy"`
- `profileId`
- `character`
- `itemId`

The server is the source of truth when a profile ID exists. It must:
1. validate the look and price;
2. verify sufficient Game Night Tokens;
3. deduct tokens server-side exactly once;
4. add permanent ownership to `<character>Looks`;
5. set `equipped<Character>Look` to the purchased item;
6. persist the profile;
7. return the updated profile to refresh local state.

Do **not** implement a purchase by deducting tokens locally and then sending it as `action: "grant"`. That was the broken legacy behavior fixed in W55.

If no persistent profile exists yet, a local-only fallback purchase is allowed so the standalone UI remains usable, but it must migrate/sync normally once a profile is established.

## Equip contract
Equipping uses `/api/arcade/look` with `action: "equip"`.
- A player may equip only an owned look.
- Ownership must not be consumed.
- Complete portrait artwork must not be recolored or layered with generic universal clothing in a way that changes the approved look.

## Win / reward contract
Earned looks use `/api/arcade/look` with:
- `action: "grant"`
- the matching `character`
- `itemId`
- a non-empty `rewardKey`

Reward grants must be idempotent. Repeating a milestone must not create duplicate ownership or duplicate charges.

### W55 earnable mapping
**John — John's Shop Bomber**
- `john-look-08` — clear Room 2 — `john-shop-room-2`
- `john-look-15` — clear Room 4 — `john-shop-room-4`
- `john-look-28` — clear Room 6 — `john-shop-room-6`

**Holly — Holly's Memory Mayhem**
- `holly-look-08` — first win — `holly-memory-first-win`
- `holly-look-13` — medium star milestone — `holly-memory-star`
- `holly-look-25` — hard star milestone — `holly-memory-hard-star`

**Gunner**
- `gunner-look-07` — first goat save — `gunner-goat-first-save`
- `gunner-look-14` — save 5 goats — `good-boy-gunner`
- `gunner-look-24` — 20 Snack Attack snacks — `gunner-snack-attack`

**Dorothy — Dorothy's Garden Merge**
- `dorothy-look-05` — first bloom milestone — `dorothy-garden-first-bloom`
- `dorothy-look-10` — create a 512 tile — `dorothy-green-thumb`
- `dorothy-look-29` — Family Garden milestone — `dorothy-family-garden`

**Molly — Molly's Light Chase**
- `molly-look-06` — score 10 — `molly-lights-10`
- `molly-look-18` — score 25 — `molly-lights-25`
- `molly-look-30` — score 40 — `molly-lights-40`

**Kelsi — Kelsi's Rock 'n' Roll Rescue**
- `kelsi-look-03` — score 10 — `kelsi-rocks-10`
- `kelsi-look-18` — score 25 — `kelsi-rocks-25`
- `kelsi-look-30` — score 50 — `kelsi-rocks-50`

**Lizzy / Elizabeth — Lizzy's Dramatic Lights**
- `elizabeth-look-08` — reach round 5 — `lizzy-lights-5`
- `elizabeth-look-27` — reach round 10 — `lizzy-lights-10`
- `elizabeth-look-30` — Drama Queen milestone — `drama-queen`

**James — James's Lumber Stack**
- `james-look-06` — clear 5 rows — `james-lumber-5`
- `james-look-15` — clear 10 rows — `james-lumber-10`
- `james-look-30` — clear 20 rows — `james-lumber-20`

**Vanessa — Vanessa's Pipe Problem**
- `vanessa-look-04` — win 1 job — `vanessa-pipes-1`
- `vanessa-look-15` — win 3 jobs — `vanessa-pipes-3`
- `vanessa-look-30` — win 5 jobs — `vanessa-pipes-5`

**Logan — Logan's Trail Logic**
- `logan-look-07` — solve 1 trail — `logan-trail-1`
- `logan-look-18` — solve 3 trails — `logan-trail-3`
- `logan-look-30` — solve 5 trails — `logan-trail-5`

**Papa — Papa's Paddle Battle**
- `papa-look-06` — win 1 match — `papa-paddle-1`
- `papa-look-16` — win 3 matches — `papa-paddle-3`
- `papa-look-30` — win 5 matches — `papa-paddle-5`

**Nana — Nana's Goat Whack**
- `nana-look-07` — score 10 — `nana-goat-10`
- `nana-look-19` — score 25 — `nana-goat-25`
- `nana-look-30` — score 50 — `nana-goat-50`

**Kristen — Family Arcade wins**
- `kristen-look-07` — 1 family arcade win — `kristen-family-win-1`
- `kristen-look-24` — 10 family arcade wins — `kristen-family-win-10`
- `kristen-look-30` — 25 family arcade wins — `kristen-family-win-25`

## Persistent profile fields
The server profile must preserve these ownership/equip pairs:
- `johnLooks` / `equippedJohnLook`
- `hollyLooks` / `equippedHollyLook`
- `gunnerLooks` / `equippedGunnerLook`
- `dorothyLooks` / `equippedDorothyLook`
- `mollyLooks` / `equippedMollyLook`
- `kelsiLooks` / `equippedKelsiLook`
- `elizabethLooks` / `equippedElizabethLook`
- `jamesLooks` / `equippedJamesLook`
- `vanessaLooks` / `equippedVanessaLook`
- `loganLooks` / `equippedLoganLook`
- `papaLooks` / `equippedPapaLook`
- `nanaLooks` / `equippedNanaLook`
- `kristenLooks` / `equippedKristenLook`

Starter ownership must normalize automatically for every collection without deleting existing player ownership.

## Reward runtime
`public/look-reward-runtime.js` is the shared grant bridge for arcade games that do not already have a dedicated look-reward helper.
- Grant locally first for responsiveness.
- Mirror the ownership into the arcade local profile cache.
- If a persistent profile exists, POST the same grant to `/api/arcade/look` with the reward key.
- A failed network sync must not erase the locally earned look; normal profile syncing can reconcile later.

## Service worker / stale-image repair
W55 uses a candidate-specific runtime cache:
`black-family-game-night-staging-candidate-w55-full-family-390-looks-shop-73`

Requirements:
- preserve historical cache constants/markers required by regression tests;
- use W55 as the actual active runtime cache for this candidate;
- pre-cache the essential Looks Shop shell, all current catalogs, Nana/Kristen additions, and their primary/backup assets;
- use `Promise.allSettled` for install precache so one optional missing historical asset cannot abort the whole service worker install;
- use network-first GET behavior with cache fallback;
- never cache API responses through the service worker.

## Validation gates
A W55 package is not upload-ready unless all of these pass:
1. 13 catalogs are present.
2. Each catalog has exactly 30 looks.
3. Total complete looks = 390.
4. Every look has a valid numeric purchase price.
5. Every collection has at least 3 earnable looks.
6. All 390 primary look images exist and are non-empty.
7. All 390 backup look images exist and are non-empty.
8. All earnable reward keys have runtime wiring.
9. Server integration test confirms buy deducts tokens, persists ownership, equips, and survives reload for all 13 characters.
10. Server integration test confirms reward grant persists for all 13 characters.
11. Full historical regression suite passes.
12. Staging validator has zero failures.

## Packaging contract
The upload ZIP must be **root-flat**. At ZIP root it must directly contain files/folders such as:
- `worker.mjs`
- `package.json`
- `wrangler.jsonc`
- `public/`
- master prompt / release notes / validation artifacts

Do not wrap the whole game inside an extra top-level project folder.

## W55 verified baseline
At creation of this master prompt, the W55 candidate baseline verifies:
- 13 supported characters
- 30 looks each
- 390 complete looks total
- 390 primary look images
- 390 backup look images
- 3 earnable looks per character, 39 earnable looks total
- 703/703 historical automated tests passing
- 5,030 staging validation checks passing, 0 failures
- purchase + reward persistence integration passing across all 13 characters

Remaining environment warnings at this baseline are the pre-existing external Three.js CDN dependency and inability to verify a real Cloudflare deployment from the local packaging environment.
