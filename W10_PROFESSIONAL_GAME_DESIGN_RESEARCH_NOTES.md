# BLACK FAMILY GAME NIGHT
# W.10 PROFESSIONAL GAME DESIGN RESEARCH NOTES

Purpose: Document the external design/engineering principles that informed the W.10 master prompt. These sources are references, not dependencies, and do not override the family's locked rules or approved character art.

## 1. Third-person action foundation

Epic's current Third Person template documentation reinforces a conventional third-person camera above/behind the player, and separates combat/platforming variants as distinct movement-quality problems. W.10 uses that as support for treating movement, camera, combat and mantling as first-class systems rather than one large animation script.

Source:
https://dev.epicgames.com/documentation/unreal-engine/third-person-template-in-unreal-engine

Applied to W.10:
- explicit movement/camera/weapon layers;
- dedicated mantle validation;
- close shoulder camera instead of accidental top-down fallback;
- John vertical slice before scaling to more content.

## 2. Contextual input architecture

Epic's Enhanced Input documentation describes action/axis mappings, runtime mapping contexts, radial dead zones and contextual actions. Fortnite/UEFN input documentation similarly emphasizes one reusable input model that adapts across devices.

Sources:
https://dev.epicgames.com/documentation/unreal-engine/enhanced-input-in-unreal-engine?lang=en-US
https://dev.epicgames.com/documentation/fortnite/inputs-in-fortnite?lang=en-US

Applied to W.10:
- hunter and hider input contexts;
- action-based controls rather than hard-coded key logic;
- dead-zone and sensitivity settings;
- role-specific HUD controls;
- gamepad/mobile/desktop mapping from the same actions.

## 3. Mobile controls and touch ergonomics

Epic's mobile guidance emphasizes designing around smaller screens, touch inputs and mobile performance. Its customizable touchscreen controls explicitly support repositioning/hiding actions per experience. Apple recommends comfortable iPhone/iPad controls around 44 x 44 points, while Android guidance recommends at least 48 x 48 dp touch targets.

Sources:
https://dev.epicgames.com/documentation/fortnite/mobile-development-in-fortnite?lang=en-US
https://dev.epicgames.com/documentation/fortnite/developer-customizable-touchscreen-controls-in-fortnite
https://developer.apple.com/design/human-interface-guidelines/accessibility
https://developer.android.com/guide/topics/ui/accessibility/apps.html

Applied to W.10:
- large Shoot and Jump/Mantle hit targets;
- safe-area awareness;
- multi-touch move + look + action requirement;
- Default / Large Buttons / Left-Handed presets;
- no unnecessary hunter buttons for hider abilities and vice versa.

## 4. Input accessibility and remapping

Microsoft's Xbox Accessibility Guideline for input highlights remappable actions, sensitivity controls, reduced dependence on rapid/repeated presses, and toggle/auto alternatives for prolonged holds. It also emphasizes updating tutorial/control labels when mappings change.

Source:
https://learn.microsoft.com/en-us/xbox/accessibility/xbox-accessibility-guidelines/107

Applied to W.10:
- sensitivity/invert settings;
- sprint hold/toggle/auto preference;
- action-based mappings;
- avoiding required multi-button chords;
- keeping tutorial glyphs/labels consistent with actual controls.

## 5. Difficulty, assists and family accessibility

Microsoft's difficulty guidance recommends treating difficulty as separate adjustable barriers, not only one Easy/Hard switch. It specifically cites assists such as auto-aim and steering as tunable mechanics.

Source:
https://learn.microsoft.com/en-us/xbox/accessibility/xbox-accessibility-guidelines/108

Applied to W.10:
- aim assist Off / Light / Standard rather than one hidden strength;
- bot competence controlled by reaction/search/aim instead of cheating;
- family-friendly options without changing competitive hidden information.

## 6. Objective clarity and multi-channel cues

Xbox Accessibility Guidelines on objective clarity and additional sensory channels emphasize making goals reviewable and important information available through more than one sensory channel.

Sources:
https://learn.microsoft.com/en-us/xbox/accessibility/xbox-accessibility-guidelines/109
https://learn.microsoft.com/en-us/xbox/accessibility/xbox-accessibility-guidelines/103

Applied to W.10:
- role/round/resource state always glanceable;
- visual + audio feedback for shots, impacts, phase transitions and abilities;
- How To/tutorial always reopenable;
- no critical state communicated only by color.

## 7. Camera comfort and motion settings

Xbox guidance on visual distractions/motion encourages adjustable camera movement, field of view and motion-related settings for comfort.

Source:
https://learn.microsoft.com/en-us/gaming/accessibility/xbox-accessibility-guidelines/117

Applied to W.10:
- camera shake Off / Low / Standard;
- reasonable FOV settings where supported;
- reduced-motion treatment for flash/effects;
- stable camera recovery rather than aggressive cinematic movement.

## 8. Haptic feedback as optional reinforcement

Xbox haptic guidance recommends that haptics be adjustable/off and never be the only information channel. Browser Gamepad haptic support is also inconsistent across browser/controller combinations.

Sources:
https://learn.microsoft.com/en-us/gaming/accessibility/xbox-accessibility-guidelines/110
https://developer.mozilla.org/en-US/docs/Web/API/Gamepad

Applied to W.10:
- haptic feedback is optional reinforcement;
- no critical gameplay depends on vibration;
- haptic intensity/off setting where supported.

## 9. WebGL/mobile rendering discipline

MDN's WebGL best practices recommend batching draw calls, per-pixel VRAM budgeting, mipmaps for 3D textures, compressed textures, avoiding blocking API calls and considering a smaller back buffer on constrained devices.

Source:
https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/WebGL_best_practices

Applied to W.10:
- instancing and batching repeated Papa's Shop props;
- KTX2/Basis direction where the current pipeline supports it;
- dynamic render-resolution fallback before destroying core art;
- pooled effects;
- low material counts and significance-based animation/shadows;
- performance judged by frame-time profiling, not desktop appearance.

## 10. Prop Hunt structure and role separation

Epic's Prop Hunt tutorial describes the core asymmetric structure of prop players hiding/disguising while hunters search, with explicit team/class setup and end-state tracking.

Source:
https://dev.epicgames.com/documentation/fortnite/design-a-prop-hunt-game-in-fortnite-creative

Applied to W.10:
- explicit round state machine;
- role-specific controls/HUD;
- strict hide-phase information privacy;
- authoritative team/phase/health/resource state.

The family game's unique rules remain the authority: four assigned props, three changes, ten decoys, flash refresh, unlimited hunter ammo, no innocent-prop penalty, Classic/Family Chaos, etc.

## 11. Responsive movement and animation

GDC sessions on smooth movement and responsive high-fidelity character motion emphasize input buffering, deliberate movement metrics, and balancing animation quality with responsiveness.

Sources:
https://gdcvault.com/play/1035867/Grappling-with-Success-Smooth-Movement
https://www.gdcvault.com/play/1021981/Finding-Balance-Realizing-Responsive-High

Applied to W.10:
- jump buffering/coyote time;
- movement input owns responsiveness;
- animation expresses motion without locking valid input;
- upper/lower body layering;
- measured speed/acceleration tuning.

## 12. Stealth and level-design readability

GDC level-design material on stealth and multiplayer emphasizes deliberate routes, readable spaces, blockout-first iteration and playtesting. The Invisible Intuition workshop highlights blockmesh, lighting and environmental guidance instead of relying exclusively on UI arrows.

Sources:
https://gdcvault.com/play/1013435/Level-Building-for-Stealth
https://www.gdcvault.com/play/1025179/Level-Design-Workshop-Invisible-Intuition
https://gdcvault.com/play/1024423/Level-Design-Workshop-Singleplayer-vs

Applied to W.10:
- loops rather than funnels;
- stable landmarks;
- visual/material/audio zone identity;
- blockout before final art;
- map randomization that preserves route readability;
- clutter density tuned for hiding without making the whole map visual noise.

## 13. Teaching through play

GDC tutorial/onboarding talks repeatedly emphasize gradual, focused teaching, observing players and teaching mechanics through actual gameplay rather than dumping text.

Sources:
https://www.gdcvault.com/play/1024187/Teaching-by-Design-Tips-for
https://gdcvault.com/play/1020512/Prime-Teach-Observe-Tutorializing-Innovative
https://gdcvault.com/play/1021252/contactUs
https://gdcvault.com/play/1034331/Teaching-Complex-Games-Onboarding-Redesign

Applied to W.10:
- Prime -> Teach -> Observe tutorial structure;
- separate hunter/hider tutorials;
- teach one mechanic at a time;
- tutorials replayable but not forced repeatedly;
- first-time player observation is part of release QA.

## 14. Game feel as layered feedback

GDC game-feel material highlights that animation, sound, particles, camera response and timing combine to make an action readable and satisfying.

Source:
https://gdcvault.com/play/1022759/Game-Feel-Why-Your-Death

Applied to W.10:
- shot input -> muzzle -> tracer -> impact -> hit marker -> target reaction -> elimination feedback chain;
- transformation and mantle receive similarly complete feedback stacks;
- effects remain restrained enough to preserve visibility.

## W.10 research conclusion

The strongest professional upgrade is not a new feature. It is replacing vague quality language with a production system:
- one source of truth;
- one flagship vertical slice;
- measurable control/camera/performance gates;
- role-specific UX;
- character identity proof;
- blockout and playtest before decoration;
- actual-device verification;
- scale only after the slice is proven.
