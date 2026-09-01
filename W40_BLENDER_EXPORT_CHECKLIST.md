# W40 Blender Cleanup and GLB Export Checklist

- Scene units are metric; verify real object dimensions.
- Apply scale/rotation after final orientation.
- Character origin is at floor between feet; environment floor is y=0.
- Remove accidental hidden duplicates and unused materials.
- Recalculate/fix normals; verify mirrored geometry.
- Add sensible bevels/weighted normals where they materially improve silhouette.
- UV unwrap hero surfaces with consistent texel density.
- Use Principled BSDF-compatible PBR channels for glTF.
- Pack/relink textures deliberately; do not depend on workstation-only absolute paths.
- Character: inspect skin weights at shoulders, elbows, wrists, hips, knees, ankles and neck.
- Character: verify weapon-hand socket/bone and neutral bind pose.
- Animation: remove accidental scale animation and unsupported constraints unless baked.
- Environment: separate visible render mesh from gameplay collision plan.
- Props: give usable pivots and stable object names.
- Test LOD/decimation visually at the real gameplay camera.
- Export glTF 2.0 binary `.glb`.
- Re-open the exported GLB in a neutral viewer/proof bench before integration.
- Run `node tools/w40_audit_external_glb.mjs <file.glb>`.
