from pathlib import Path
import math
import numpy as np
from PIL import Image, ImageDraw, ImageEnhance
import trimesh

ROOT=Path('/mnt/data/w26_character_proof')
PUB=ROOT/'public'
OUT=ROOT/'visual_proofs'
OUT.mkdir(exist_ok=True)

JOHN=PUB/'models/characters/john-production-skinned.glb'
HAT=PUB/'models/w25/w25-dark-brown-ranch-cowboy-hat.glb'
GLASSES=PUB/'models/w25/w25-gold-brown-aviators.glb'

# Locked bind-pose socket from authored John rig.
HEAD_WORLD=np.array([0.0,1.66,0.0])
FIT={
    'hat': dict(scale=0.38, pos=np.array([0.0,0.135,-0.005]), rot=np.array([0.0,0.0,0.0])),
    'glasses': dict(scale=0.31, pos=np.array([0.0,0.035,-0.202]), rot=np.array([0.0,0.0,0.0])),
}

def material_color(mesh):
    try:
        c=np.array(mesh.visual.material.baseColorFactor,dtype=float)
        if c.max()<=1.0: c*=255
        return np.clip(c[:3],0,255)
    except Exception:
        try:
            return np.array(mesh.visual.main_color[:3],dtype=float)
        except Exception:
            return np.array([150,120,90],float)

def load_meshes(path):
    s=trimesh.load(path,force='scene')
    return [m.copy() for m in s.dump(concatenate=False) if hasattr(m,'faces') and len(m.faces)]

def xform_meshes(meshes, pos, scale=1.0, rot=(0,0,0)):
    rx,ry,rz=rot
    M=trimesh.transformations.euler_matrix(rx,ry,rz,'sxyz')
    M[:3,:3]*=scale
    M[:3,3]=pos
    out=[]
    for m in meshes:
        c=m.copy(); c.apply_transform(M); out.append(c)
    return out

def normalize(v):
    n=np.linalg.norm(v); return v/n if n else v

def render(meshes, camera, target, W=720,H=980):
    S=2
    img=Image.new('RGB',(W*S,H*S),(26,22,19)); px=img.load()
    for y in range(H*S):
        t=y/max(1,H*S-1); c=int(40*(1-t)+18*t)
        for x in range(W*S): px[x,y]=(c+7,c+3,c)
    d=ImageDraw.Draw(img,'RGBA')
    d.ellipse((100*S,870*S,620*S,965*S),fill=(0,0,0,75))
    cam=np.array(camera,float); tar=np.array(target,float)
    forward=normalize(tar-cam); up0=np.array([0,1,0.],float); right=normalize(np.cross(forward,up0)); up=normalize(np.cross(right,forward))
    light=normalize(np.array([-0.5,0.8,-0.6]))
    tris=[]; focal=1.27*W*S
    for mesh in meshes:
        world=mesh.vertices
        rel=world-cam; vx=rel@right; vy=rel@up; vz=rel@forward; good=vz>.02
        sx=W*S/2+focal*(vx/np.maximum(vz,.02)); sy=H*S*.52-focal*(vy/np.maximum(vz,.02))
        col=material_color(mesh); normals=mesh.face_normals
        for i,f in enumerate(mesh.faces):
            if not good[f].all(): continue
            p=np.column_stack([sx[f],sy[f]])
            if p[:,0].max()<0 or p[:,0].min()>W*S or p[:,1].max()<0 or p[:,1].min()>H*S: continue
            ctri=world[f].mean(0); view=normalize(cam-ctri); facing=float(np.dot(normals[i],view))
            if facing < -0.12: continue
            lam=.48+.52*max(0,float(np.dot(normals[i],light)))
            c=np.clip(col*lam+16,0,255).astype(int)
            tris.append((float(vz[f].mean()),p,c))
    tris.sort(key=lambda q:q[0], reverse=True)
    for _,p,c in tris:
        pts=[tuple(map(float,q)) for q in p]; d.polygon(pts,fill=(int(c[0]),int(c[1]),int(c[2]),255)); d.line(pts+[pts[0]],fill=(0,0,0,18),width=1*S)
    return ImageEnhance.Contrast(img.resize((W,H),Image.Resampling.LANCZOS)).enhance(1.04)

john=load_meshes(JOHN)
hat=load_meshes(HAT)
glasses=load_meshes(GLASSES)

# head-relative transforms translated into bind-pose world for proof renderer
hat_world=xform_meshes(hat,HEAD_WORLD+FIT['hat']['pos'],FIT['hat']['scale'],FIT['hat']['rot'])
glasses_world=xform_meshes(glasses,HEAD_WORLD+FIT['glasses']['pos'],FIT['glasses']['scale'],FIT['glasses']['rot'])

sets=[('COWBOY HAT',john+hat_world),('AVIATORS',john+glasses_world),('HAT + AVIATORS',john+hat_world+glasses_world)]
canvas=Image.new('RGB',(720*3,1045),(15,14,13));
for i,(name,meshes) in enumerate(sets):
    im=render(meshes,camera=(0.72,1.42,-3.25),target=(0,1.03,0),W=720,H=980)
    canvas.paste(im,(i*720,65))
d=ImageDraw.Draw(canvas)
for i,(name,_) in enumerate(sets):
    d.text((i*720+24,22),name,fill=(242,224,190),stroke_width=0)
d.text((24,1008),'W26 JOHN ACTUAL PRODUCTION RIG FIT PROOF  •  Same W25 GLB assets attached at Head bone coordinates',fill=(219,176,91))
canvas.save(OUT/'W26_JOHN_WEARABLE_FIT_PROOF.png',optimize=True)
print('saved',OUT/'W26_JOHN_WEARABLE_FIT_PROOF.png')
print('fit',FIT)
