from pathlib import Path
import numpy as np
from PIL import Image, ImageDraw, ImageEnhance
import trimesh

ROOT=Path(__file__).resolve().parents[1]
PUB=ROOT/'public'; OUT=ROOT/'visual_proofs'; OUT.mkdir(exist_ok=True)
JOHN=PUB/'models/characters/john-production-skinned.glb'; HAT=PUB/'models/w25/w25-dark-brown-ranch-cowboy-hat.glb'; GLASSES=PUB/'models/w25/w25-gold-brown-aviators.glb'
HEAD=np.array([0.,1.66,0.])
FIT={'hat':dict(scale=.38,pos=np.array([0,.155,-.005]),rot=(0,0,0)),'glasses':dict(scale=.21,pos=np.array([0,.025,-.202]),rot=(0,0,0))}

def norm(v):
 n=np.linalg.norm(v);return v/n if n else v

def load(path):
 s=trimesh.load(path,force='scene');return [m.copy() for m in s.dump(concatenate=False) if hasattr(m,'faces') and len(m.faces)]

def xform(meshes,pos,scale=1,rot=(0,0,0)):
 M=trimesh.transformations.euler_matrix(*rot,'sxyz');M[:3,:3]*=scale;M[:3,3]=pos
 out=[]
 for m in meshes:c=m.copy();c.apply_transform(M);out.append(c)
 return out

def rgba(mesh):
 m=getattr(mesh.visual,'material',None)
 try:
  c=np.array(m.baseColorFactor,dtype=float);c=c*255 if c.max()<=1 else c
  if len(c)<4:c=np.r_[c,255]
  return c[:4]
 except Exception:return np.array([160,125,92,255],float)

def tex(mesh):
 m=getattr(mesh.visual,'material',None);im=getattr(m,'baseColorTexture',None)
 return None if im is None else np.asarray(im.convert('RGBA'))

def render(meshes,camera,target,W=760,H=720):
 S=2;img=Image.new('RGBA',(W*S,H*S),(24,20,17,255));px=img.load()
 for y in range(H*S):
  t=y/max(1,H*S-1);c=int(41*(1-t)+17*t)
  for x in range(W*S):px[x,y]=(c+7,c+3,c,255)
 d=ImageDraw.Draw(img,'RGBA');d.ellipse((85*S,610*S,675*S,705*S),fill=(0,0,0,65))
 cam=np.array(camera,float);tar=np.array(target,float);fwd=norm(tar-cam);right=norm(np.cross(fwd,[0,1,0.]));up=norm(np.cross(right,fwd));light=norm(np.array([-.5,.8,-.6]));focal=1.04*W*S
 tris=[]
 for mesh in meshes:
  world=np.asarray(mesh.vertices);rel=world-cam;vx=rel@right;vy=rel@up;vz=rel@fwd;good=vz>.02
  sx=W*S/2+focal*(vx/np.maximum(vz,.02));sy=H*S*.50-focal*(vy/np.maximum(vz,.02))
  normals=np.asarray(mesh.face_normals);base=rgba(mesh);texture=tex(mesh);uv=np.asarray(mesh.visual.uv) if getattr(mesh.visual,'uv',None) is not None else None
  for i,f in enumerate(mesh.faces):
   if not good[f].all():continue
   p=np.column_stack([sx[f],sy[f]])
   if p[:,0].max()<0 or p[:,0].min()>W*S or p[:,1].max()<0 or p[:,1].min()>H*S:continue
   ctr=world[f].mean(0);view=norm(cam-ctr);facing=float(np.dot(normals[i],view))
   if facing<-.1:continue
   col=base.copy()
   if texture is not None and uv is not None:
    u,v=np.mean(uv[f],axis=0);u=float(u%1);v=float(v%1);tx=min(texture.shape[1]-1,max(0,int(u*(texture.shape[1]-1))));ty=min(texture.shape[0]-1,max(0,int((1-v)*(texture.shape[0]-1))));sample=texture[ty,tx].astype(float);col[:3]=sample[:3];col[3]=col[3]*sample[3]/255
    if col[3]<8:continue
   lam=.55+.45*max(0,float(np.dot(normals[i],light)));rgb=np.clip(col[:3]*lam+12,0,255).astype(int);tris.append((float(vz[f].mean()),p,rgb,int(col[3])))
 tris.sort(key=lambda q:q[0],reverse=True)
 for _,p,c,a in tris:d.polygon([tuple(map(float,q)) for q in p],fill=(int(c[0]),int(c[1]),int(c[2]),a))
 return ImageEnhance.Contrast(img.convert('RGB').resize((W,H),Image.Resampling.LANCZOS)).enhance(1.04)

john=load(JOHN);hat=xform(load(HAT),HEAD+FIT['hat']['pos'],FIT['hat']['scale']);gl=xform(load(GLASSES),HEAD+FIT['glasses']['pos'],FIT['glasses']['scale'])
panels=[
 ('REPAIRED HEAD',john,(0,1.67,-1.60),(0,1.63,0)),
 ('COWBOY HAT',john+hat,(0,1.72,-1.66),(0,1.68,0)),
 ('AVIATORS',john+gl,(0,1.67,-1.60),(0,1.63,0)),
 ('HAT + AVIATORS · 3/4',john+hat+gl,(.57,1.70,-1.52),(0,1.65,0)),
]
W,H=760,770;canvas=Image.new('RGB',(W*2,H*2),(13,12,11));d=ImageDraw.Draw(canvas)
for i,(label,meshes,cam,tar) in enumerate(panels):
 x=(i%2)*W;y=(i//2)*H+50;canvas.paste(render(meshes,cam,tar,W,H-50),(x,y));d.text((x+24,y-34),label,fill=(244,224,190))
d.text((24,H*2-25),'W27 ACTUAL GLB VISUAL GATE · approved stylized John face source · one coherent face layer · exact W27 head-bone hat/aviator transforms · device approval still pending',fill=(219,176,91))
out=OUT/'W27_JOHN_HEAD_AND_WEARABLE_FIT_PROOF.png';canvas.save(out,optimize=True);print(out)
