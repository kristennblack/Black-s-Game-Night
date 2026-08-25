from __future__ import annotations
import json, sys
from pathlib import Path
import trimesh

ROOT=Path(__file__).resolve().parents[1]
PUB=ROOT/'public'
manifest=json.loads((PUB/'models/manifest.json').read_text())

checks=[
 ('characters','john',['JohnLab02Rig','JohnLab02Body','hips','upperBody','head','leftShoulder','leftElbow','leftHand','rightShoulder','rightElbow','rightHand','leftHip','leftKnee','leftFoot','rightHip','rightKnee','rightFoot','rightHandSocket']),
 ('dogs','gunner',['GunnerRig','approvedFacePatch','body','chestPivot','head','jaw','frontLeft','frontLeftKnee','frontRight','frontRightKnee','rearLeft','rearLeftKnee','rearRight','rearRightKnee','tail','backSocket']),
 ('props','propZapper',['PropZapper','muzzle']),
 ('props','tractor',['Tractor']),
 ('props','motorcycle',['Motorcycle']),
 ('furniture','papaChair',['PapaChair']),
 ('furniture','fireplace',['Fireplace']),
 ('furniture','workbench',['Workbench']),
 ('furniture','toolChest',['ToolChest']),
 ('furniture','shelving',['Shelving']),
]

failed=[]
rows=[]
for cat,key,required in checks:
    entry=manifest.get(cat,{}).get(key)
    if not entry:
        failed.append(f'{cat}.{key}: missing manifest entry');continue
    path=PUB/entry['file'].lstrip('/')
    if not path.exists():
        failed.append(f'{cat}.{key}: missing {path}');continue
    data=path.read_bytes()
    if data[:4]!=b'glTF': failed.append(f'{path}: invalid GLB magic')
    scene=trimesh.load(path,force='scene')
    names=set(scene.graph.nodes)
    missing=[n for n in required if n not in names]
    if missing: failed.append(f'{path}: missing nodes {missing}')
    if key in ('john','gunner'):
        expected_mat='John_Face' if key=='john' else 'Gunner_FacePhoto'
        mats=[getattr(getattr(g.visual,'material',None),'name',None) for g in scene.geometry.values()]
        textured=[getattr(getattr(g.visual,'material',None),'baseColorTexture',None) is not None for g in scene.geometry.values() if getattr(getattr(g.visual,'material',None),'name',None)==expected_mat]
        if expected_mat not in mats or not any(textured): failed.append(f'{path}: missing embedded face texture {expected_mat}')
    y0,y1=scene.bounds[:,1]
    raw_h=float(y1-y0);scale=float(entry.get('scale',1));visual_h=raw_h*scale
    ref=entry.get('referenceHeight')
    if ref is not None and abs(visual_h-float(ref))>.035:
        failed.append(f'{path}: calibrated height {visual_h:.3f} != {float(ref):.3f}')
    rows.append((cat,key,len(data),len(names),raw_h,visual_h))

print('Production3D asset audit')
for cat,key,size,nodes,raw_h,visual_h in rows:
    print(f'  {cat}.{key:<12} {size/1024:7.1f} KiB  nodes={nodes:3d} rawH={raw_h:.3f} finalH={visual_h:.3f}')
if failed:
    print('\nFAILED:')
    for f in failed: print(' -',f)
    sys.exit(1)
print('\nPASS: manifest, GLB headers, hierarchy and calibrated benchmark heights are valid.')
