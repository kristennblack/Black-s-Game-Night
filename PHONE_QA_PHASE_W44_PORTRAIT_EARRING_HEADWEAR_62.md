# Phone QA — W44 Portrait Earring + Headwear 62

## Required staging checks
Use the W44 candidate on the same device/browser normally used for Game Night.

### 1. Cache/build identity
- Hard-refresh after deployment.
- Confirm W44 candidate assets load rather than an older W42/W43 cosmetic bundle.

### 2. Shop headwear
Test John, Kristen, Holly, Vanessa, Elizabeth and Logan with:
- Cowboy Hat
- Firefighter Helmet
- Birthday Crown
- Family Tiara
- Legendary Top Hat
- Mexican Train Conductor Cap

PASS only if:
- brim/base sits on the head/hairline rather than eyes;
- head tilt is respected;
- no major floating or face clipping;
- changing portrait variant does not reuse the previous portrait's coordinates.

### 3. Shop earrings
Test Small Stud, Medium Gold Hoop, Pearl Drop and Statement Fashion Earrings.

Expected behavior:
- John and Logan: earrings attach to visible lobes.
- Kristen: current tested portrait should fail closed because hair obscures reliable lobes.
- Holly/Vanessa/Elizabeth: current tested portraits should fail closed because earrings are already baked into the portrait.
- Dogs: human earrings should not be forced onto dog portraits.

A blocked accessory is a PASS when the portrait cannot support an honest fit.

### 4. Card-game portrait parity
Open at least one card game using the same avatar.
- Compare shop portrait and card-game player portrait.
- Hat/earring position must be the same relative to the face/head.
- No legacy generic offset may appear at card size.

### 5. Other accessory families
Spot-check one item from each:
- hair
- headset
- face
- filter
- neck
- badge
- back
- attachment

They should use portrait-specific semantic positions, not a single generic face box.

### 6. Wristwear
Current head-and-shoulders portraits do not expose reliable wrist landmarks.
Expected W44 behavior: wristwear does not float onto the portrait. Do not fail W44 because it is intentionally hidden; a future full-body/wrist-visible preview is required.

## Result
Mark the build:
- GREEN: shop + card portrait parity and no major anchor defects.
- AMBER: minor per-portrait tuning needed, no system regression.
- RED: old generic offsets return, wrong portrait variant used, double-accessories appear, or earrings/headwear detach materially from anatomy.
