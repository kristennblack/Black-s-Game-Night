# W40 glTF Optimization Checklist

1. Audit first. Record triangles, materials, images, skins and clips before optimization.
2. Remove unused nodes/materials/textures and duplicate data.
3. Keep hero silhouette and approved visual identity intact.
4. Merge only objects that do not need independent interaction/animation/Prop Hunt identity.
5. Use sensible texture sizes. Hero character/environment may use larger atlases than background clutter, but avoid unnecessary 4K/8K mobile payloads.
6. Prefer mesh/texture compression only after browser/device compatibility is verified.
7. Create LODs for heavy hero assets where distance makes the difference invisible.
8. Re-audit and visually compare at the gameplay camera after every aggressive optimization step.
9. Never approve based only on smaller file size.
