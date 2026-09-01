from pathlib import Path
import numpy as np
from PIL import Image, ImageDraw, ImageEnhance
import trimesh

ROOT=Path(__file__).resolve().parents[1]
PUB=ROOT/'public'
OUT=ROOT/'visual_proofs';OUT.mkdir(exist_ok=True)
JOHN=PUB/'models/characters/john-production-skinned.glb'
HAT=PUB/'models/w25/w25-dark-brown-ranch-cowboy-hat.glb'
GLASSES=PUB/'models/w25/w25-gold-brown-aviators.glb'
HEAD_WORLD=np.array([0.0,1.66,0.0])
FIT={'hat':dict(scale=.38,pos=np.array([0,.155,-.005]),rot=(0,0,0)),'glasses':dict(scale=.21,pos=np.array([0,.025,-.202]),rot=(0,0,0))}

def normalize(v):
    n=np.linalg.norm(v);return v/n if n else v

def load(path):
    s=trimesh.load(path,force='scene')
    return [m.copy() for m in s.dump(concatenate=False) if hasattr(m,'faces') and len(m.faces)]

def xform(meshes,pos,scale=1,rot=(0,0,0)):
    M=trimesh.transformations.euler_matrix(*rot,'sxyz');M[:3,:3]*=scale;M[:3,3]=pos
    out=[]
    for m in meshes:
        c=m.copy();c.apply_transform(M);out.append(c)
    return out

def base_rgba(mesh):
    mat=getattr(mesh.visual,'material',None)
    try:
        c=np.array(mat.baseColorFactor,dtype=float)
        if c.max()<=1:c*=255
        if len(c)<4:c=np.r_[c,255]
        return c[:4]
    except Exception:return np.array([160,125,92,255],float)

def texture_array(mesh):
    mat=getattr(mesh.visual,'material',None);im=getattr(mat,'baseColorTexture',None)
    if im is None:return None
    return np.asarray(im.convert('RGBA'))

def render(meshes,camera=(0.72,1.42,-3.25),target=(0,1.03,0),W=720,H=980):
    S=2;img=Image.new('RGBA',(W*S,H*S),(25,21,18,255));px=img.load()
    for y in range(H*S):
        t=y/max(1,H*S-1);c=int(40*(1-t)+18*t)
        for x in range(W*S):px[x,y]=(c+7,c+3,c,255)
    d=ImageDraw.Draw(img,'RGBA');d.ellipse((100*S,870*S,620*S,965*S),fill=(0,0,0,75))
    cam=np.array(camera,float);tar=np.array(target,float);forward=normalize(tar-cam);right=normalize(np.cross(forward,[0,1,0.]));up=normalize(np.cross(right,forward));light=normalize(np.array([-.5,.8,-.6]));focal=1.27*W*S
    tris=[]
    for mesh in meshes:
        world=np.asarray(mesh.vertices);rel=world-cam;vx=rel@right;vy=rel@up;vz=rel@forward;good=vz>.02
        sx=W*S/2+focal*(vx/np.maximum(vz,.02));sy=H*S*.52-focal*(vy/np.maximum(vz,.02))
        normals=np.asarray(mesh.face_normals);rgba=base_rgba(mesh);tex=texture_array(mesh);uv=np.asarray(mesh.visual.uv) if getattr(mesh.visual,'uv',None) is not None else None
        for i,f in enumerate(mesh.faces):
            if not good[f].all():continue
            p=np.column_stack([sx[f],sy[f]])
            if p[:,0].max()<0 or p[:,0].min()>W*S or p[:,1].max()<0 or p[:,1].min()>H*S:continue
            ctri=world[f].mean(0);view=normalize(cam-ctri);facing=float(np.dot(normals[i],view))
            if facing<-.12:continue
            col=rgba.copy()
            if tex is not None and uv is not None:
                u,v=np.mean(uv[f],axis=0);u=float(u%1.0);v=float(v%1.0)
                tx=min(tex.shape[1]-1,max(0,int(u*(tex.shape[1]-1))))
                ty=min(tex.shape[0]-1,max(0,int((1-v)*(tex.shape[0]-1))))
                sample=tex[ty,tx].astype(float);col[:3]=sample[:3];col[3]=col[3]*sample[3]/255.0
                if col[3]<8:continue
            lam=.50+.50*max(0,float(np.dot(normals[i],light)));rgb=np.clip(col[:3]*lam+14,0,255).astype(int)
            tris.append((float(vz[f].mean()),p,rgb,int(col[3])))
    tris.sort(key=lambda q:q[0],reverse=True)
    for _,p,c,a in tris:
        pts=[tuple(map(float,q)) for q in p];d.polygon(pts,fill=(int(c[0]),int(c[1]),int(c[2]),a))
    return ImageEnhance.Contrast(img.convert('RGB').resize((W,H),Image.Resampling.LANCZOS)).enhance(1.04)

john=load(JOHN);hat=xform(load(HAT),HEAD_WORLD+FIT['hat']['pos'],FIT['hat']['scale'],FIT['hat']['rot']);gl=xform(load(GLASSES),HEAD_WORLD+FIT['glasses']['pos'],FIT['glasses']['scale'],FIT['glasses']['rot'])
sets=[('NO COSMETICS',john),('COWBOY HAT',john+hat),('AVIATORS',john+gl),('HAT + AVIATORS',john+hat+gl)]
canvas=Image.new('RGB',(720*2,1045*2),(15,14,13));d=ImageDraw.Draw(canvas)
for i,(name,meshes) in enumerate(sets):
    im=render(meshes);x=(i%2)*720;y=(i//2)*1045+65;canvas.paste(im,(x,y));d.text((x+24,y-42),name,fill=(242,224,190))
d.text((24,2055),'W27 JOHN HEAD REPAIR · approved stylized turnaround mapped to true curved 3D face patch · W25 GLB wearables remain head-bone attached',fill=(219,176,91))
canvas.save(OUT/'W27_JOHN_HEAD_REPAIR_PROOF.png',quality=94)
print(OUT/'W27_JOHN_HEAD_REPAIR_PROOF.png')
