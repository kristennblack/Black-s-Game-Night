from pathlib import Path
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageEnhance
import trimesh, math

ROOT=Path('/mnt/data/w25_vertical_slice')
OUT=ROOT/'public/catalog-review/w25-production-thumbs'
OUT.mkdir(parents=True, exist_ok=True)

ASSETS={
'w25-cognac-lodge-reading-chair.glb':'chair.png',
'w25-live-edge-side-table.glb':'side-table.png',
'w25-linen-bronze-table-lamp.glb':'lamp.png',
'w25-deep-walnut-upholstered-bed.glb':'bed.png',
'w25-dark-brown-ranch-cowboy-hat.glb':'cowboy-hat.png',
'w25-gold-brown-aviators.glb':'aviators.png',
'w25-smooth-gold-hoops.glb':'hoops.png',
}

def material_color(mesh):
    try:
        c=np.array(mesh.visual.material.baseColorFactor,dtype=float)
        if c.max()<=1.0: c*=255
        return c[:3]
    except Exception:
        try:
            c=np.array(mesh.visual.main_color,dtype=float)
            return c[:3]
        except Exception: return np.array([150,120,90],float)

def normalize(v):
    n=np.linalg.norm(v)
    return v/n if n else v

def render(path,outname,wearable=False):
    scene=trimesh.load(path,force='scene')
    meshes=scene.dump(concatenate=False)
    # dump applies transforms
    allv=np.vstack([m.vertices for m in meshes if len(m.vertices)])
    mn,mx=allv.min(0),allv.max(0); center=(mn+mx)/2; size=mx-mn; radius=max(np.linalg.norm(size)*.55,.5)
    # Asset-aware camera. Furniture fronts face -Z; eyewear faces +Z; objects remain rotatable in live preview.
    stem=Path(path).stem
    if 'chair' in stem or 'bed' in stem:
        cam=center+np.array([1.45,1.05,-2.25])*radius
    elif 'aviators' in stem:
        cam=center+np.array([0.35,0.18,2.65])*radius
    elif 'hoops' in stem:
        cam=center+np.array([0.35,0.20,2.55])*radius
    else:
        cam=center+np.array([1.55,1.15,2.25])*radius
    target=center+np.array([0,size[1]*.05,0])
    forward=normalize(target-cam)
    up0=np.array([0,1,0.],float)
    right=normalize(np.cross(forward,up0)); up=normalize(np.cross(right,forward))
    # view coordinates x=dot(v-cam,right), y=dot(...,up), z=dot(...,forward)
    W=1000; H=1000; S=2
    img=Image.new('RGB',(W*S,H*S),(20,17,14)); px=img.load()
    # gradient background
    for y in range(H*S):
        t=y/(H*S-1); r=int(44*(1-t)+18*t); g=int(36*(1-t)+17*t); b=int(29*(1-t)+15*t)
        for x in range(W*S): px[x,y]=(r,g,b)
    d=ImageDraw.Draw(img,'RGBA')
    # warm vignette / platform
    d.ellipse((180*S,760*S,820*S,925*S),fill=(0,0,0,85))
    light=normalize(np.array([-0.5,0.8,0.65]))
    tris=[]
    focal=(1.55 if wearable else 1.35)*W*S
    scale=(0.69 if wearable else 0.74)
    # choose object framing based on radius and perspective
    for mesh in meshes:
        if not len(mesh.faces): continue
        verts=mesh.vertices-center
        # no world rotation, camera does 3/4
        world=verts+center
        rel=world-cam
        vx=rel@right; vy=rel@up; vz=rel@forward
        good=vz>0.02
        sx=W*S/2 + focal*(vx/np.maximum(vz,.02))*scale
        sy=H*S*.54 - focal*(vy/np.maximum(vz,.02))*scale
        col=material_color(mesh)
        normals=mesh.face_normals
        for i,f in enumerate(mesh.faces):
            if not good[f].all(): continue
            p=np.column_stack([sx[f],sy[f]])
            if (p[:,0].max()<0 or p[:,0].min()>W*S or p[:,1].max()<0 or p[:,1].min()>H*S): continue
            # camera-facing cull softly
            ctri=world[f].mean(0); viewdir=normalize(cam-ctri)
            nd=max(-.15,float(np.dot(normals[i],viewdir)))
            if nd<-.1: continue
            lam=.44+.56*max(0,float(np.dot(normals[i],light)))
            # subtle rim from camera facing
            lam*=.94+.10*max(0,nd)
            c=np.clip(col*lam+18,0,255).astype(int)
            depth=float(vz[f].mean())
            tris.append((depth,p,c))
    # painter far to near
    tris.sort(key=lambda x:x[0], reverse=True)
    for depth,p,c in tris:
        pts=[tuple(map(float,q)) for q in p]
        d.polygon(pts,fill=(int(c[0]),int(c[1]),int(c[2]),255))
        # tiny edge for definition
        d.line(pts+[pts[0]],fill=(0,0,0,28),width=1*S,joint='curve')
    # top-left production badge
    d.rounded_rectangle((36*S,35*S,325*S,94*S),radius=18*S,fill=(24,55,39,235),outline=(214,167,78,255),width=2*S)
    d.text((58*S,51*S),'W25  •  ACTUAL 3D MODEL',fill=(255,232,182,255),stroke_width=0)
    img=img.resize((W,H),Image.Resampling.LANCZOS)
    # slight contrast
    img=ImageEnhance.Contrast(img).enhance(1.05)
    img.save(OUT/outname,optimize=True)

for glb,png in ASSETS.items():
    render(ROOT/'public/models/w25'/glb,png,wearable=glb.startswith(('w25-dark','w25-gold','w25-smooth')))
    print(png)

# Soft glam filter card derived from the exact intended effect parameters, shown on the approved Kristen reference image.
# This is a preview of the effect, not actual-avatar runtime approval.
src=Image.open(ROOT/'public/approved-character-turnarounds/kristen-approved-turnaround.png').convert('RGB')
# crop front portrait area from approved turnaround (left/front character)
w,h=src.size
crop=src.crop((40,80,int(w*.25),int(h*.49))).resize((1000,1000),Image.Resampling.LANCZOS)
# warm soft-glam treatment: gentle warmth, soft highlight, restrained blush
base=ImageEnhance.Color(crop).enhance(1.05)
base=ImageEnhance.Contrast(base).enhance(1.035)
over=Image.new('RGBA',base.size,(0,0,0,0)); od=ImageDraw.Draw(over,'RGBA')
# cheek blush and warm highlight, intentionally subtle
od.ellipse((350,390,510,520),fill=(218,111,105,28)); od.ellipse((520,390,680,520),fill=(218,111,105,28))
od.ellipse((380,250,660,570),fill=(255,226,190,16))
over=over.filter(ImageFilter.GaussianBlur(30))
base=Image.alpha_composite(base.convert('RGBA'),over).convert('RGB')
d=ImageDraw.Draw(base,'RGBA'); d.rounded_rectangle((36,35,330,94),radius=18,fill=(24,55,39,235),outline=(214,167,78,255),width=2); d.text((58,52),'W25  •  EFFECT PREVIEW',fill=(255,232,182,255))
base.save(OUT/'soft-glam-filter.png',optimize=True)
