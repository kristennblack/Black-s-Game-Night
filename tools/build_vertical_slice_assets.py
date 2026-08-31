from __future__ import annotations
import io, json, math, struct
from pathlib import Path
from dataclasses import dataclass
import numpy as np
from PIL import Image, ImageDraw, ImageFilter
import trimesh
from skimage import measure
from trimesh.visual.material import PBRMaterial
from trimesh.visual.texture import TextureVisuals

ROOT = Path(__file__).resolve().parents[1]
PUB = ROOT / 'public'
MODELS = PUB / 'models'

# -----------------------------
# Generic helpers
# -----------------------------
def rgba(hex_value: int, alpha=1.0):
    return [((hex_value >> 16) & 255) / 255.0, ((hex_value >> 8) & 255) / 255.0, (hex_value & 255) / 255.0, alpha]

def mat(name, color, rough=.82, metal=0.0, emissive=None):
    return PBRMaterial(name=name, baseColorFactor=rgba(color), roughnessFactor=rough, metallicFactor=metal,
                       emissiveFactor=rgba(emissive)[:3] if emissive is not None else None)

def T(x=0,y=0,z=0): return trimesh.transformations.translation_matrix([x,y,z])
def R(angle,axis): return trimesh.transformations.rotation_matrix(angle,axis)
def box(ext, material):
    m=trimesh.creation.box(extents=ext);m.visual=TextureVisuals(material=material);return m

def cyl(radius,height,material,sections=24):
    m=trimesh.creation.cylinder(radius=radius,height=height,sections=sections);m.apply_transform(R(math.pi/2,[1,0,0]));m.visual=TextureVisuals(material=material);return m

def ell(rx,ry,rz,material,sub=3):
    m=trimesh.creation.icosphere(subdivisions=sub,radius=1);m.apply_scale([rx,ry,rz]);m.visual=TextureVisuals(material=material);return m

def torus(major,minor,material,maj=36,minr=12):
    m=trimesh.creation.torus(major_radius=major,minor_radius=minor,major_sections=maj,minor_sections=minr);m.visual=TextureVisuals(material=material);return m

def add(scene, mesh, name, transform=None, parent=None):
    scene.add_geometry(mesh,node_name=name,geom_name=name+'_geo',transform=np.eye(4) if transform is None else transform,parent_node_name=parent)

def beam_between(a,b,radius,material,name,scene,sections=10):
    a=np.asarray(a,float);b=np.asarray(b,float);v=b-a;L=float(np.linalg.norm(v));mid=(a+b)/2
    m=cyl(radius,L,material,sections)
    # cylinder local long axis is Y after cyl helper
    y=np.array([0.,1.,0.]);d=v/L;axis=np.cross(y,d);dot=float(np.clip(np.dot(y,d),-1,1));tr=T(*mid)
    if np.linalg.norm(axis)>1e-8: tr=tr@R(math.acos(dot),axis/np.linalg.norm(axis))
    elif dot<0: tr=tr@R(math.pi,[1,0,0])
    add(scene,m,name,tr)

# -----------------------------
# Embedded textures for John
# -----------------------------
def john_face_crop():
    """Build the runtime face texture from John's locked stylized turnaround.

    W26 proved that the rig and wearable sockets work, but the legacy photo-derived
    face patch read incorrectly beside the approved cartoon body.  W27 keeps the
    true curved facial geometry and replaces only its texture source with the
    locked turnaround, so side/rear views remain genuinely 3D.
    """
    ref=Image.open(ROOT/'public'/'approved-character-turnarounds'/'john-approved-turnaround.png').convert('RGB')
    # First/front turnaround view.  Crop tightly to the facial oval so hair, ears
    # and clothing continue to come from their real 3D meshes rather than the map.
    crop=ref.crop((86,285,226,448)).resize((512,600),Image.Resampling.LANCZOS)
    alpha=Image.new('L',crop.size,0);d=ImageDraw.Draw(alpha);d.ellipse((10,3,crop.size[0]-10,crop.size[1]-3),fill=255)
    alpha=alpha.filter(ImageFilter.GaussianBlur(22))
    out=crop.convert('RGBA');out.putalpha(alpha);return out


def john_turnaround_head_crop(view):
    """Transparent head-only crops for left/right/back curved head patches."""
    ref=Image.open(ROOT/'public'/'approved-character-turnarounds'/'john-approved-turnaround.png').convert('RGBA')
    boxes={
        'left':(500,210,730,475),
        'right':(920,210,1165,475),
        'back':(690,205,945,475),
    }
    crop=ref.crop(boxes[view])
    px=crop.load();w,h=crop.size
    samples=[px[0,0][:3],px[w-1,0][:3],px[0,h-1][:3],px[w-1,h-1][:3]]
    bg=tuple(sum(q[i] for q in samples)//len(samples) for i in range(3))
    cut_start=int(h*.80)
    for y in range(h):
        for x in range(w):
            r,g,b,a=px[x,y]
            dist=((r-bg[0])**2+(g-bg[1])**2+(b-bg[2])**2)**.5
            if dist<18 and r>210 and g>205 and b>195: aa=0
            elif dist<42 and r>190 and g>185 and b>175: aa=int(max(0,min(255,(dist-18)/24*255)))
            else: aa=255
            if y>cut_start: aa=int(aa*max(0,(h-y)/max(1,h-cut_start)))
            px[x,y]=(r,g,b,aa)
    bbox=crop.getchannel('A').getbbox()
    if bbox: crop=crop.crop(bbox)
    canvas=Image.new('RGBA',(512,600),(0,0,0,0));crop.thumbnail((490,570),Image.Resampling.LANCZOS)
    canvas.alpha_composite(crop,((512-crop.width)//2,(600-crop.height)//2))
    return canvas

def make_plaid(size=512):
    im=Image.new('RGB',(size,size),(109,47,39));d=ImageDraw.Draw(im)
    for x in range(0,size,64):
        d.rectangle((x,0,x+18,size),fill=(39,39,35));d.rectangle((x+26,0,x+31,size),fill=(175,104,62))
    for y in range(0,size,64):
        d.rectangle((0,y,size,y+18),fill=(42,39,34));d.rectangle((0,y+27,size,y+32),fill=(178,108,65))
    # weave/noise
    arr=np.array(im).astype(np.int16);rng=np.random.default_rng(73);noise=rng.normal(0,5,arr.shape[:2])[:,:,None];arr=np.clip(arr+noise,0,255).astype(np.uint8)
    return Image.fromarray(arr,'RGB')

def make_denim(size=256):
    base=np.zeros((size,size,3),dtype=np.uint8);rng=np.random.default_rng(99)
    for y in range(size):
        for x in range(size):
            n=int(rng.normal(0,7));stripe=7 if ((x+y)%8)<2 else 0
            base[y,x]=np.clip([48+n+stripe,73+n+stripe,98+n+stripe],0,255)
    return Image.fromarray(base,'RGB')

def image_png_bytes(im:Image.Image):
    bio=io.BytesIO();im.save(bio,format='PNG',optimize=True);return bio.getvalue()

# -----------------------------
# Minimal GLB writer with skin + animations
# -----------------------------
COMPONENT={
    'FLOAT':5126,'UNSIGNED_SHORT':5123,'UNSIGNED_INT':5125,'UNSIGNED_BYTE':5121
}
TYPE_COUNT={'SCALAR':1,'VEC2':2,'VEC3':3,'VEC4':4,'MAT4':16}

class GLBBuilder:
    def __init__(self):
        self.doc={'asset':{'version':'2.0','generator':'Black Family Game Night vertical-slice asset author'},
                  'scene':0,'scenes':[{'nodes':[]}], 'nodes':[], 'meshes':[], 'materials':[], 'skins':[], 'animations':[],
                  'accessors':[], 'bufferViews':[], 'buffers':[{'byteLength':0}], 'images':[], 'textures':[], 'samplers':[{'magFilter':9729,'minFilter':9987,'wrapS':10497,'wrapT':10497}]}
        self.bin=bytearray()
    def align(self,n=4):
        while len(self.bin)%n:self.bin.append(0)
    def view(self,data:bytes,target=None):
        self.align(4);off=len(self.bin);self.bin.extend(data);v={'buffer':0,'byteOffset':off,'byteLength':len(data)}
        if target is not None:v['target']=target
        self.doc['bufferViews'].append(v);return len(self.doc['bufferViews'])-1
    def accessor(self,arr,dtype,typ,target=None,normalized=False,calc_minmax=False):
        arr=np.asarray(arr,dtype=dtype)
        raw=arr.tobytes(order='C');bv=self.view(raw,target)
        comp={'float32':5126,'uint16':5123,'uint32':5125,'uint8':5121}[np.dtype(dtype).name]
        count=int(arr.shape[0]) if arr.ndim>1 else int(arr.size)
        a={'bufferView':bv,'componentType':comp,'count':count,'type':typ}
        if normalized:a['normalized']=True
        if calc_minmax:
            aa=arr.reshape(count,-1);a['min']=aa.min(axis=0).astype(float).tolist();a['max']=aa.max(axis=0).astype(float).tolist()
        self.doc['accessors'].append(a);return len(self.doc['accessors'])-1
    def image(self,png_bytes,name):
        bv=self.view(png_bytes);self.doc['images'].append({'name':name,'bufferView':bv,'mimeType':'image/png'})
        idx=len(self.doc['images'])-1;self.doc['textures'].append({'sampler':0,'source':idx,'name':name});return len(self.doc['textures'])-1
    def material(self,name,color,rough=.8,metal=0,texture=None,alpha=False,double=False,extras=None):
        pbr={'baseColorFactor':rgba(color),'roughnessFactor':rough,'metallicFactor':metal}
        if texture is not None:pbr['baseColorTexture']={'index':texture}
        m={'name':name,'pbrMetallicRoughness':pbr}
        if alpha:m.update({'alphaMode':'BLEND','doubleSided':double})
        if extras:m['extras']=extras
        self.doc['materials'].append(m);return len(self.doc['materials'])-1
    def add_node(self,name,translation=None,rotation=None,children=None,mesh=None,skin=None,extras=None):
        n={'name':name}
        if translation is not None:n['translation']=[float(x) for x in translation]
        if rotation is not None:n['rotation']=[float(x) for x in rotation]
        if children:n['children']=list(children)
        if mesh is not None:n['mesh']=mesh
        if skin is not None:n['skin']=skin
        if extras:n['extras']=extras
        self.doc['nodes'].append(n);return len(self.doc['nodes'])-1
    def finish(self,path:Path):
        self.doc['buffers'][0]['byteLength']=len(self.bin)
        js=json.dumps(self.doc,separators=(',',':')).encode('utf-8')
        while len(js)%4:js+=b' '
        self.align(4);bin_data=bytes(self.bin)
        while len(bin_data)%4:bin_data+=b'\x00'
        total=12+8+len(js)+8+len(bin_data)
        out=bytearray(struct.pack('<4sII',b'glTF',2,total));out.extend(struct.pack('<I4s',len(js),b'JSON'));out.extend(js);out.extend(struct.pack('<I4s',len(bin_data),b'BIN\x00'));out.extend(bin_data)
        path.parent.mkdir(parents=True,exist_ok=True);path.write_bytes(out)
        return len(out)

def quat(axis,angle):
    axis=np.asarray(axis,float);axis=axis/(np.linalg.norm(axis) or 1);s=math.sin(angle/2);return [axis[0]*s,axis[1]*s,axis[2]*s,math.cos(angle/2)]
def qmul(a,b):
    ax,ay,az,aw=a;bx,by,bz,bw=b
    return [aw*bx+ax*bw+ay*bz-az*by,aw*by-ay*0+ay*bw+az*bx-ax*bz,aw*bz+az*bw+ax*by-ay*bx,aw*bw-ax*bx-ay*by-az*bz]

def mesh_normals(vertices,indices):
    v=np.asarray(vertices,float);idx=np.asarray(indices,int).reshape(-1,3);n=np.zeros_like(v)
    for tri in idx:
        a,b,c=v[tri];nn=np.cross(b-a,c-a);l=np.linalg.norm(nn)
        if l>1e-9:nn/=l
        n[tri]+=nn
    l=np.linalg.norm(n,axis=1);l[l<1e-9]=1;n/=l[:,None];return n.astype(np.float32)

@dataclass
class Prim:
    pos:list; uv:list; joints:list; weights:list; idx:list; mat:int

def add_ellipsoid_prim(center,radii,joint,mat_idx,seg=24,rings=14,front_only=False,texture_patch=False):
    cx,cy,cz=center;rx,ry,rz=radii;pos=[];uv=[];j=[];w=[];idx=[]
    # full sphere, Y as latitude. Front is -Z.
    for iy in range(rings+1):
        vv=iy/rings;phi=math.pi*vv
        y=math.cos(phi);rr=math.sin(phi)
        for ix in range(seg+1):
            uu=ix/seg;theta=2*math.pi*uu
            x=rr*math.cos(theta);z=rr*math.sin(theta)
            pos.append([cx+rx*x,cy+ry*y,cz+rz*z]);uv.append([uu,1-vv]);j.append([joint,0,0,0]);w.append([1,0,0,0])
    stride=seg+1
    for iy in range(rings):
        for ix in range(seg):
            a=iy*stride+ix;b=a+1;c=a+stride;d=c+1;idx += [a,c,b,b,c,d]
    return Prim(pos,uv,j,w,idx,mat_idx)

def add_face_patch(center,radii,joint,mat_idx,cols=22,rows=26):
    cx,cy,cz=center;rx,ry,rz=radii;pos=[];uv=[];j=[];w=[];idx=[]
    # x/y patch against the -Z front of ellipsoid
    for iy in range(rows+1):
        v=iy/rows;yn=-.74+1.42*v
        for ix in range(cols+1):
            u=ix/cols;xn=-.92+1.84*u;q=max(.02,1-xn*xn-yn*yn);z=-rz*math.sqrt(q)-.004
            pos.append([cx+rx*xn,cy+ry*yn,cz+z]);uv.append([u,1-v]);j.append([joint,0,0,0]);w.append([1,0,0,0])
    st=cols+1
    for iy in range(rows):
        for ix in range(cols):
            a=iy*st+ix;b=a+1;c=a+st;d=c+1;idx += [a,c,b,b,c,d]
    return Prim(pos,uv,j,w,idx,mat_idx)


def add_side_head_patch(center,radii,joint,mat_idx,side=1,cols=44,rows=48,reverse_u=False):
    cx,cy,cz=center;rx,ry,rz=radii;pos=[];uv=[];j=[];w=[];idx=[]
    for iy in range(rows+1):
        v=iy/rows;yn=-.74+1.42*v
        for iz in range(cols+1):
            u=iz/cols;zn=-.76+1.52*u;q=max(.02,1-yn*yn-zn*zn);x=side*rx*math.sqrt(q)+side*.004
            pos.append([cx+x,cy+ry*yn,cz+rz*zn]);uv.append([1-u if reverse_u else u,1-v]);j.append([joint,0,0,0]);w.append([1,0,0,0])
    st=cols+1
    for iy in range(rows):
        for iz in range(cols):
            a=iy*st+iz;b=a+1;c=a+st;d=c+1;idx += [a,c,b,b,c,d]
    return Prim(pos,uv,j,w,idx,mat_idx)

def add_back_head_patch(center,radii,joint,mat_idx,cols=48,rows=48):
    cx,cy,cz=center;rx,ry,rz=radii;pos=[];uv=[];j=[];w=[];idx=[]
    for iy in range(rows+1):
        v=iy/rows;yn=-.74+1.42*v
        for ix in range(cols+1):
            u=ix/cols;xn=-.79+1.58*u;q=max(.02,1-xn*xn-yn*yn);z=rz*math.sqrt(q)+.004
            pos.append([cx+rx*xn,cy+ry*yn,cz+z]);uv.append([u,1-v]);j.append([joint,0,0,0]);w.append([1,0,0,0])
    st=cols+1
    for iy in range(rows):
        for ix in range(cols):
            a=iy*st+ix;b=a+1;c=a+st;d=c+1;idx += [a,b,c,b,d,c]
    return Prim(pos,uv,j,w,idx,mat_idx)


def add_back_hair_patch(center,radii,joint,mat_idx,cols=42,rows=32):
    """Smooth cropped-hair shell over upper rear skull, not a helmet band."""
    cx,cy,cz=center;rx,ry,rz=radii;pos=[];uv=[];j=[];w=[];idx=[]
    for iy in range(rows+1):
        v=iy/rows;yn=-.28+1.06*v
        for ix in range(cols+1):
            u=ix/cols;xn=-.86+1.72*u;q=max(.02,1-xn*xn-yn*yn);z=rz*math.sqrt(q)+.006
            pos.append([cx+rx*xn,cy+ry*yn,cz+z]);uv.append([u,1-v]);j.append([joint,0,0,0]);w.append([1,0,0,0])
    st=cols+1
    for iy in range(rows):
        for ix in range(cols):
            a=iy*st+ix;b=a+1;c=a+st;d=c+1;idx += [a,b,c,b,d,c]
    return Prim(pos,uv,j,w,idx,mat_idx)

def add_tube(y0,y1,cx,cz,r0x,r0z,r1x,r1z,j0,j1,mat_idx,segments=18,rings=8,uv_repeat=1):
    pos=[];uv=[];j=[];w=[];idx=[]
    for r in range(rings+1):
        t=r/rings;y=y0+(y1-y0)*t;rx=r0x+(r1x-r0x)*t;rz=r0z+(r1z-r0z)*t
        for s in range(segments+1):
            u=s/segments;ang=2*math.pi*u;x=cx+math.cos(ang)*rx;z=cz+math.sin(ang)*rz
            pos.append([x,y,z]);uv.append([u*uv_repeat,t*uv_repeat]);j.append([j0,j1,0,0]);w.append([1-t,t,0,0])
    st=segments+1
    for r in range(rings):
        for s in range(segments):
            a=r*st+s;b=a+1;c=a+st;d=c+1;idx += [a,c,b,b,c,d]
    # cap ends
    for y,cj,rx,rz,rev in [(y0,j0,r0x,r0z,True),(y1,j1,r1x,r1z,False)]:
        center_idx=len(pos);pos.append([cx,y,cz]);uv.append([.5,.5]);j.append([cj,0,0,0]);w.append([1,0,0,0])
        base=(0 if y==y0 else rings*st)
        for s in range(segments):
            a=base+s;b=base+s+1
            idx += ([center_idx,b,a] if rev else [center_idx,a,b])
    return Prim(pos,uv,j,w,idx,mat_idx)

def add_box_prim(center,ext,joint,mat_idx):
    cx,cy,cz=center;ex,ey,ez=[v/2 for v in ext]
    # 24 verts so normals/uv are crisp
    faces=[((0,0,-1),[(-ex,-ey,-ez),(ex,-ey,-ez),(ex,ey,-ez),(-ex,ey,-ez)]),
           ((0,0,1),[(ex,-ey,ez),(-ex,-ey,ez),(-ex,ey,ez),(ex,ey,ez)]),
           ((-1,0,0),[(-ex,-ey,ez),(-ex,-ey,-ez),(-ex,ey,-ez),(-ex,ey,ez)]),
           ((1,0,0),[(ex,-ey,-ez),(ex,-ey,ez),(ex,ey,ez),(ex,ey,-ez)]),
           ((0,-1,0),[(-ex,-ey,ez),(ex,-ey,ez),(ex,-ey,-ez),(-ex,-ey,-ez)]),
           ((0,1,0),[(-ex,ey,-ez),(ex,ey,-ez),(ex,ey,ez),(-ex,ey,ez)])]
    pos=[];uv=[];j=[];w=[];idx=[]
    for fi,(n,vs) in enumerate(faces):
        base=len(pos)
        for p,tuv in zip(vs,[(0,0),(1,0),(1,1),(0,1)]):pos.append([cx+p[0],cy+p[1],cz+p[2]]);uv.append(tuv);j.append([joint,0,0,0]);w.append([1,0,0,0])
        idx += [base,base+1,base+2,base,base+2,base+3]
    return Prim(pos,uv,j,w,idx,mat_idx)


def _ellipsoid_field(X,Y,Z,c,r):
    cx,cy,cz=c;rx,ry,rz=r
    return ((X-cx)/rx)**2+((Y-cy)/ry)**2+((Z-cz)/rz)**2-1.0

def _rounded_box_field(X,Y,Z,c,half,radius):
    # Signed rounded-box field in world units. Useful for clothing because it gives
    # a coherent garment silhouette instead of the balloon-like ellipsoids used by
    # the old mannequin fallback.
    cx,cy,cz=c;hx,hy,hz=half
    qx=np.abs(X-cx)-hx; qy=np.abs(Y-cy)-hy; qz=np.abs(Z-cz)-hz
    ox=np.maximum(qx,0);oy=np.maximum(qy,0);oz=np.maximum(qz,0)
    outside=np.sqrt(ox*ox+oy*oy+oz*oz)
    inside=np.minimum(np.maximum(qx,np.maximum(qy,qz)),0)
    return outside+inside-radius

def _capsule_field(X,Y,Z,a,b,r0,r1=None):
    a=np.asarray(a,float);b=np.asarray(b,float);v=b-a;vv=float(np.dot(v,v))
    P=np.stack([X,Y,Z],axis=-1);t=np.clip(np.sum((P-a)*v,axis=-1)/(vv or 1),0,1)
    Q=a+t[...,None]*v;rad=r0 if r1 is None else r0+(r1-r0)*t
    return np.linalg.norm(P-Q,axis=-1)/rad-1.0

def implicit_union_prim(bounds,res,fields,weight_fn,mat_idx,uv_mode='cyl'):
    (xmin,xmax),(ymin,ymax),(zmin,zmax)=bounds;nx,ny,nz=res
    xs=np.linspace(xmin,xmax,nx);ys=np.linspace(ymin,ymax,ny);zs=np.linspace(zmin,zmax,nz)
    X,Y,Z=np.meshgrid(xs,ys,zs,indexing='ij')
    vol=np.full(X.shape,10.0,dtype=np.float32)
    for f in fields:vol=np.minimum(vol,np.asarray(f(X,Y,Z),np.float32))
    dx=(xmax-xmin)/(nx-1);dy=(ymax-ymin)/(ny-1);dz=(zmax-zmin)/(nz-1)
    verts,faces,_,_=measure.marching_cubes(vol,level=0.0,spacing=(dx,dy,dz),allow_degenerate=False)
    verts+=np.array([xmin,ymin,zmin],float)
    # smooth once using a conservative Taubin pass, preserving silhouette but removing marching-grid stepping.
    tm=trimesh.Trimesh(vertices=verts,faces=faces,process=False)
    try:trimesh.smoothing.filter_taubin(tm,lamb=.42,nu=.45,iterations=4)
    except Exception:pass
    pos=np.asarray(tm.vertices,np.float32);idx=np.asarray(tm.faces,np.uint32).reshape(-1).tolist()
    if uv_mode=='cyl':
        uv=np.column_stack([(np.arctan2(pos[:,2],pos[:,0])/(2*np.pi)+.5)%1.0,(pos[:,1]-ymin)/(ymax-ymin)])
    else:
        uv=np.column_stack([(pos[:,0]-xmin)/(xmax-xmin),(pos[:,1]-ymin)/(ymax-ymin)])
    joints=[];weights=[]
    for v in pos:
        jj,ww=weight_fn(v);jj=list(jj)[:4]+[0]*max(0,4-len(jj));ww=list(ww)[:4]+[0]*max(0,4-len(ww));sw=sum(ww) or 1;weights.append([x/sw for x in ww]);joints.append(jj)
    return Prim(pos.tolist(),uv.astype(np.float32).tolist(),joints,weights,idx,mat_idx)

def add_boot_wedge(center,side,joint,mat_idx):
    cx,cy,cz=center;w=.17;h=.15;back=.08;front=.19
    # low-poly boot with longer toe and sloped instep, not a rectangular foot block.
    vs=np.array([[-w/2,0,-front],[w/2,0,-front],[w/2,0,back],[-w/2,0,back],
                 [-w/2,h*.58,-front],[w/2,h*.58,-front],[w/2,h,back*.62],[-w/2,h,back*.62]],float)+np.array([cx,cy,cz])
    fs=np.array([[0,2,1],[0,3,2],[4,5,6],[4,6,7],[0,1,5],[0,5,4],[1,2,6],[1,6,5],[2,3,7],[2,7,6],[3,0,4],[3,4,7]],int)
    uv=np.column_stack([(vs[:,0]-vs[:,0].min())/(np.ptp(vs[:,0])+1e-9),(vs[:,2]-vs[:,2].min())/(np.ptp(vs[:,2])+1e-9)])
    return Prim(vs.tolist(),uv.tolist(),[[joint,0,0,0]]*len(vs),[[1,0,0,0]]*len(vs),fs.reshape(-1).tolist(),mat_idx)

def build_skinned_john():
    b=GLBBuilder()
    face_tex=b.image(image_png_bytes(john_face_crop()),'JohnApprovedFace')
    plaid_tex=b.image(image_png_bytes(make_plaid()),'JohnPlaid')
    denim_tex=b.image(image_png_bytes(make_denim()),'JohnDenim')
    m_skin=b.material('John_Skin',0xe99443,.72,0)
    m_shirt=b.material('John_Shirt_PrimaryClothing',0x7a352e,.86,0,plaid_tex,extras={'materialRole':'primaryClothing'})
    m_denim=b.material('John_Denim',0x34516c,.9,0,denim_tex)
    m_boot=b.material('John_Boot_Leather',0x4a3322,.83,0)
    m_hair=b.material('John_Hair',0x241b16,.95,0)
    m_beard=b.material('John_Beard',0x35251e,.96,0)
    m_face=b.material('John_ApprovedStylizedFace',0xffffff,.78,0,face_tex,alpha=True,double=True)
    m_metal=b.material('John_Buckle',0xb28a4c,.32,.7)
    m_eye_white=b.material('John_EyeWhite',0xf2e5d6,.7,0)
    m_eye=b.material('John_Eye',0x2a201a,.64,0)
    m_iris=b.material('John_Iris',0x6a442c,.62,0)
    m_pupil=b.material('John_Pupil',0x17100c,.52,0)
    m_lip=b.material('John_Lips',0x7b463d,.82,0)

    # Absolute bind positions. Node tree below converts to local translations.
    abspos={
      'hips':(0,.92,0),'upperBody':(0,1.10,0),'chest':(0,1.35,0),'neck':(0,1.50,0),'head':(0,1.66,0),
      'leftShoulder':(-.31,1.42,0),'leftElbow':(-.31,1.10,0),'leftHand':(-.31,.78,0),
      'rightShoulder':(.31,1.42,0),'rightElbow':(.31,1.10,0),'rightHand':(.31,.78,0),
      'leftHip':(-.135,.89,0),'leftKnee':(-.135,.49,0),'leftFoot':(-.135,.11,-.035),
      'rightHip':(.135,.89,0),'rightKnee':(.135,.49,0),'rightFoot':(.135,.11,-.035),
    }
    parent={'hips':None,'upperBody':'hips','chest':'upperBody','neck':'chest','head':'neck',
            'leftShoulder':'chest','leftElbow':'leftShoulder','leftHand':'leftElbow','rightShoulder':'chest','rightElbow':'rightShoulder','rightHand':'rightElbow',
            'leftHip':'hips','leftKnee':'leftHip','leftFoot':'leftKnee','rightHip':'hips','rightKnee':'rightHip','rightFoot':'rightKnee'}
    joint_names=list(abspos.keys());joint_index={n:i for i,n in enumerate(joint_names)}

    # Character body: continuous skinned garment surfaces. The shirt is one connected mesh
    # across torso and sleeves; the jeans are one connected pelvis/leg mesh. This avoids the
    # segmented mannequin silhouette of the old runtime primitive rig.
    prims=[]
    def shirt_weights(v):
        x,y,z=v;side='left' if x<0 else 'right'
        if abs(x)>.245 and y<1.46:
            t=float(np.clip((1.43-y)/.34,0,1));return [joint_index[side+'Shoulder'],joint_index[side+'Elbow']],[1-t,t]
        t=float(np.clip((y-.90)/(.54),0,1));return [joint_index['hips'],joint_index['chest']],[1-t,t]
    shirt_fields=[
        # P2: rounded chest + tapered waist creates an adult torso instead of a square block.
        lambda X,Y,Z:_ellipsoid_field(X,Y,Z,(0,1.305,0),(.305,.235,.150)),
        lambda X,Y,Z:_ellipsoid_field(X,Y,Z,(0,1.105,0),(.235,.245,.130)),
        lambda X,Y,Z:_capsule_field(X,Y,Z,(-.245,1.405,0),(-.31,1.09,0),.112,.082),
        lambda X,Y,Z:_capsule_field(X,Y,Z,( .245,1.405,0),( .31,1.09,0),.112,.082),
        lambda X,Y,Z:_ellipsoid_field(X,Y,Z,(-.245,1.405,0),(.115,.100,.125)),
        lambda X,Y,Z:_ellipsoid_field(X,Y,Z,( .245,1.405,0),(.115,.100,.125)),
    ]
    prims.append(implicit_union_prim(((-.44,.44),(.83,1.55),(-.24,.24)),(58,66,44),shirt_fields,shirt_weights,m_shirt,'cyl'))

    def jeans_weights(v):
        x,y,z=v;side='left' if x<0 else 'right'
        if y>.82:return [joint_index['hips']],[1]
        if y>.47:
            t=float(np.clip((.89-y)/.40,0,1));return [joint_index[side+'Hip'],joint_index[side+'Knee']],[1-t,t]
        t=float(np.clip((.49-y)/.36,0,1));return [joint_index[side+'Knee'],joint_index[side+'Foot']],[1-t,t]
    pants_fields=[
        lambda X,Y,Z:_ellipsoid_field(X,Y,Z,(0,.845,0),(.225,.145,.120)),
        lambda X,Y,Z:_capsule_field(X,Y,Z,(-.125,.83,0),(-.13,.49,0),.116,.094),
        lambda X,Y,Z:_capsule_field(X,Y,Z,( .125,.83,0),( .13,.49,0),.116,.094),
        lambda X,Y,Z:_capsule_field(X,Y,Z,(-.13,.50,0),(-.13,.14,-.02),.094,.070),
        lambda X,Y,Z:_capsule_field(X,Y,Z,( .13,.50,0),( .13,.14,-.02),.094,.070),
    ]
    prims.append(implicit_union_prim(((-.34,.34),(.09,1.02),(-.20,.20)),(44,72,34),pants_fields,jeans_weights,m_denim,'cyl'))

    # Skin forearms/hands emerge from clear sleeve cuffs; heads remain a dedicated facial surface.
    for side,name in [(-1,'left'),(1,'right')]:
        x=side*.31
        prims.append(add_tube(1.105,.79,x,0,.076,.070,.059,.056,joint_index[name+'Elbow'],joint_index[name+'Hand'],m_skin,segments=22,rings=8))
        prims.append(add_ellipsoid_prim((x,.735,-.012),(.066,.082,.052),joint_index[name+'Hand'],m_skin,seg=20,rings=12))
        prims.append(add_boot_wedge((side*.135,.015,-.035),side,joint_index[name+'Foot'],m_boot))
        prims.append(add_ellipsoid_prim((side*.135,.075,-.175),(.095,.060,.135),joint_index[name+'Foot'],m_boot,seg=16,rings=8))
    # neck
    prims.append(add_tube(1.47,1.56,0,0,.064,.064,.061,.061,joint_index['neck'],joint_index['neck'],m_skin,segments=20,rings=3))
    # W27 head repair, pass 4: one curved approved face surface plus full 3D
    # head/hair/ears/jaw silhouette.  No duplicate modeled eyes or painted-photo
    # conflict: the approved turnaround controls the visible face; geometry supplies
    # volume for side/rear gameplay angles.
    prims.append(add_ellipsoid_prim((0,1.665,.008),(.196,.216,.165),joint_index['head'],m_skin,seg=48,rings=30))
    prims.append(add_face_patch((0,1.665,-.006),(.200,.210,.198),joint_index['head'],m_face,cols=56,rows=56))

    # Smooth approved short-hair silhouette: textured-looking quiff in front,
    # curved dark shell at the upper rear, and small sideburns.  This avoids the
    # W26 helmet/band and the W27-v6 floating side clumps.
    prims.append(add_back_hair_patch((0,1.690,.018),(.192,.190,.165),joint_index['head'],m_hair,cols=48,rows=36))
    prims.append(add_ellipsoid_prim((0,1.787,.012),(.188,.069,.160),joint_index['head'],m_hair,seg=38,rings=18))
    for hx,hy,hz,rx,ry,rz in [
        (-.125,1.816,-.070,.068,.038,.070),(-.065,1.828,-.100,.074,.043,.068),
        ( .005,1.833,-.112,.078,.045,.071),( .075,1.824,-.098,.071,.040,.071),
        ( .135,1.808,-.060,.060,.034,.067)]:
        prims.append(add_ellipsoid_prim((hx,hy,hz),(rx,ry,rz),joint_index['head'],m_hair,seg=20,rings=10))
    prims.append(add_ellipsoid_prim((-.171,1.690,-.002),(.025,.072,.035),joint_index['head'],m_hair,seg=18,rings=10))
    prims.append(add_ellipsoid_prim(( .171,1.690,-.002),(.025,.072,.035),joint_index['head'],m_hair,seg=18,rings=10))

    # Ears match the warmer face/skin palette.
    prims.append(add_ellipsoid_prim((-.203,1.660,-.005),(.029,.048,.024),joint_index['head'],m_skin,seg=18,rings=10))
    prims.append(add_ellipsoid_prim(( .203,1.660,-.005),(.029,.048,.024),joint_index['head'],m_skin,seg=18,rings=10))

    # Subtle dimensional nose and beard/jaw support preserve silhouette from 3/4
    # and profile views without drawing a second competing face over the texture.
    prims.append(add_ellipsoid_prim((0,1.654,-.210),(.024,.032,.024),joint_index['head'],m_skin,seg=20,rings=10))
    prims.append(add_ellipsoid_prim((0,1.565,-.146),(.116,.062,.045),joint_index['head'],m_beard,seg=28,rings=15))

    # Knuckle/finger volumes stop the authored hands from reading as mittens at the
    # over-the-shoulder weapon distance.  They stay skinned to the hand joints.
    for side,name in [(-1,'left'),(1,'right')]:
        x=side*.31
        for fi in range(4):
            fx=x+side*(-.036+fi*.024)
            prims.append(add_ellipsoid_prim((fx,.700,-.035),(.018,.049,.019),joint_index[name+'Hand'],m_skin,seg=10,rings=6))
        prims.append(add_ellipsoid_prim((x-side*.058,.724,-.018),(.022,.045,.021),joint_index[name+'Hand'],m_skin,seg=10,rings=6))
    # Collar, shirt placket, chest pockets, belt and buckle add readable clothing form.
    prims.append(add_box_prim((0,1.465,-.188),(.30,.055,.025),joint_index['chest'],m_shirt))
    prims.append(add_box_prim((0,1.270,-.128),(.025,.315,.016),joint_index['chest'],m_shirt))
    prims.append(add_box_prim((-.135,1.285,-.132),(.145,.115,.018),joint_index['chest'],m_shirt))
    prims.append(add_box_prim(( .135,1.285,-.132),(.145,.115,.018),joint_index['chest'],m_shirt))
    prims.append(add_box_prim((0,.955,0),(.49,.055,.25),joint_index['hips'],m_boot))
    prims.append(add_box_prim((0,.955,-.135),(.08,.068,.025),joint_index['hips'],m_metal))

    # Build one mesh with many primitives, all use same skin.
    gltf_prims=[]
    for pr in prims:
        pos=np.asarray(pr.pos,np.float32);idx=np.asarray(pr.idx,np.uint32);uv=np.asarray(pr.uv,np.float32);jj=np.asarray(pr.joints,np.uint16);ww=np.asarray(pr.weights,np.float32)
        normals=mesh_normals(pos,idx)
        gltf_prims.append({'attributes':{
            'POSITION':b.accessor(pos,np.float32,'VEC3',target=34962,calc_minmax=True),
            'NORMAL':b.accessor(normals,np.float32,'VEC3',target=34962),
            'TEXCOORD_0':b.accessor(uv,np.float32,'VEC2',target=34962),
            'JOINTS_0':b.accessor(jj,np.uint16,'VEC4',target=34962),
            'WEIGHTS_0':b.accessor(ww,np.float32,'VEC4',target=34962),
        },'indices':b.accessor(idx,np.uint32,'SCALAR',target=34963),'material':pr.mat})
    b.doc['meshes'].append({'name':'JohnSkinnedMesh','primitives':gltf_prims})
    mesh_index=0

    # Create joint nodes in hierarchy. Local translations from absolute bind positions.
    node_by_name={}
    for name in joint_names:
        p=parent[name];ap=np.array(abspos[name],float);lp=ap-(np.array(abspos[p],float) if p else 0)
        node_by_name[name]=b.add_node(name,translation=lp.tolist(),extras={'rigJoint':True})
    for name in joint_names:
        p=parent[name]
        if p:
            b.doc['nodes'][node_by_name[p]].setdefault('children',[]).append(node_by_name[name])
    armature=b.add_node('JohnRig',children=[node_by_name['hips']],extras={'rigKind':'skinned-humanoid','characterId':'john','productionVerticalSlice':True})
    # Sockets
    rhs=b.add_node('rightHandSocket',translation=[0,-.08,-.07],extras={'socket':'rightHand'});b.doc['nodes'][node_by_name['rightHand']].setdefault('children',[]).append(rhs)
    lhs=b.add_node('leftHandSocket',translation=[0,-.08,-.07],extras={'socket':'leftHand'});b.doc['nodes'][node_by_name['leftHand']].setdefault('children',[]).append(lhs)
    bs=b.add_node('backSocket',translation=[0,.12,.18],extras={'socket':'back'});b.doc['nodes'][node_by_name['chest']].setdefault('children',[]).append(bs)
    hs=b.add_node('headSocket',translation=[0,.20,0],extras={'socket':'head'});b.doc['nodes'][node_by_name['head']].setdefault('children',[]).append(hs)
    # Semantic helper nodes preserve the studio rig contract while the actual face/shirt are skinned mesh primitives.
    torso_alias=b.add_node('torso',translation=[0,0,0],extras={'semantic':'torso'});b.doc['nodes'][node_by_name['chest']].setdefault('children',[]).append(torso_alias)
    face_alias=b.add_node('approvedFacePatch',translation=[0,0,0],extras={'semantic':'approved-face-texture','source':'/approved-character-turnarounds/john-approved-turnaround.png'});b.doc['nodes'][node_by_name['head']].setdefault('children',[]).append(face_alias)
    for nm,pos in [('leftEye',[-.07,.035,-.18]),('rightEye',[.07,.035,-.18]),('leftBrow',[-.07,.075,-.185]),('rightBrow',[.07,.075,-.185]),('mouth',[0,-.06,-.19])]:
        ai=b.add_node(nm,translation=pos,extras={'semanticFaceTarget':True});b.doc['nodes'][node_by_name['head']].setdefault('children',[]).append(ai)

    # Inverse bind matrices from absolute joint transforms (translation-only bind pose).
    ibm=[]
    for n in joint_names:
        x,y,z=abspos[n];M=np.eye(4,dtype=np.float32);M[:3,3]=[-x,-y,-z];ibm.append(M.T.reshape(-1)) # glTF column-major
    ibm_acc=b.accessor(np.asarray(ibm,np.float32),np.float32,'MAT4')
    b.doc['skins'].append({'name':'JohnHumanoidSkin','inverseBindMatrices':ibm_acc,'skeleton':node_by_name['hips'],'joints':[node_by_name[n] for n in joint_names]})
    mesh_node=b.add_node('JohnBody',mesh=mesh_index,skin=0,extras={'primaryClothingMesh':True})
    b.doc['scenes'][0]['nodes']=[armature,mesh_node]

    # Animation clip helper. Values are local rotations relative to bind pose.
    def clip(name,duration,tracks):
        anim={'name':name,'samplers':[],'channels':[]}
        for node_name,path,times,values in tracks:
            inp=b.accessor(np.asarray(times,np.float32),np.float32,'SCALAR',calc_minmax=True)
            typ='VEC4' if path=='rotation' else 'VEC3'
            out=b.accessor(np.asarray(values,np.float32),np.float32,typ)
            si=len(anim['samplers']);anim['samplers'].append({'input':inp,'output':out,'interpolation':'LINEAR'});anim['channels'].append({'sampler':si,'target':{'node':node_by_name[node_name],'path':path}})
        b.doc['animations'].append(anim)
    def rot_track(node,times,angles,axis=(1,0,0)):
        return (node,'rotation',times,[quat(axis,a) for a in angles])
    def trans_track(node,times,offsets):
        base=np.array(abspos[node],float)-(np.array(abspos[parent[node]],float) if parent[node] else 0)
        return (node,'translation',times,[(base+np.array(o)).tolist() for o in offsets])
    # idle
    clip('Idle',2.4,[rot_track('chest',[0,1.2,2.4],[0,.025,0],(0,0,1)),rot_track('head',[0,1.2,2.4],[0,-.035,0],(0,1,0)),trans_track('hips',[0,1.2,2.4],[(0,0,0),(0,.008,0),(0,0,0)])])
    # locomotion cycles
    t=[0,.25,.5,.75,1.0]
    clip('Walk',1.0,[rot_track('leftHip',t,[.48,0,-.48,0,.48]),rot_track('rightHip',t,[-.48,0,.48,0,-.48]),rot_track('leftKnee',t,[.08,.36,.08,.03,.08]),rot_track('rightKnee',t,[.08,.03,.08,.36,.08]),rot_track('leftFoot',t,[-.10,.05,.14,.02,-.10]),rot_track('rightFoot',t,[.14,.02,-.10,.05,.14]),rot_track('leftShoulder',t,[-.42,0,.42,0,-.42]),rot_track('rightShoulder',t,[.42,0,-.42,0,.42]),rot_track('chest',t,[.025,0,-.025,0,.025],(0,1,0)),trans_track('hips',t,[(0,0,0),(0,.010,0),(0,0,0),(0,.010,0),(0,0,0)])])
    tr=[0,.18,.36,.54,.72]
    clip('Run',.72,[rot_track('leftHip',tr,[.82,0,-.82,0,.82]),rot_track('rightHip',tr,[-.82,0,.82,0,-.82]),rot_track('leftKnee',tr,[.12,.62,.12,.05,.12]),rot_track('rightKnee',tr,[.12,.05,.12,.62,.12]),rot_track('leftShoulder',tr,[-.72,0,.72,0,-.72]),rot_track('rightShoulder',tr,[.72,0,-.72,0,.72]),rot_track('chest',tr,[.045,0,-.045,0,.045],(0,1,0))])
    sr=[0,.14,.28,.42,.56]
    clip('Sprint',.56,[rot_track('leftHip',sr,[1.02,0,-1.02,0,1.02]),rot_track('rightHip',sr,[-1.02,0,1.02,0,-1.02]),rot_track('leftKnee',sr,[.16,.80,.15,.04,.16]),rot_track('rightKnee',sr,[.16,.04,.15,.80,.16]),rot_track('leftShoulder',sr,[-.86,0,.86,0,-.86]),rot_track('rightShoulder',sr,[.86,0,-.86,0,.86]),rot_track('chest',sr,[.075,.035,-.075,-.035,.075],(0,1,0))])
    clip('Start_Move',.30,[rot_track('leftHip',[0,.15,.30],[0,.32,.48]),rot_track('rightHip',[0,.15,.30],[0,-.25,-.40]),rot_track('chest',[0,.15,.30],[0,-.045,-.02],(1,0,0)),trans_track('hips',[0,.15,.30],[(0,0,0),(0,-.012,-.012),(0,0,-.025)])])
    clip('Stop_Move',.34,[rot_track('leftHip',[0,.17,.34],[.42,.16,0]),rot_track('rightHip',[0,.17,.34],[-.34,-.12,0]),rot_track('chest',[0,.17,.34],[-.02,.055,0],(1,0,0)),trans_track('hips',[0,.17,.34],[(0,0,0),(0,-.015,0),(0,0,0)])])
    clip('Turn_Left',.65,[rot_track('hips',[0,.32,.65],[0,.28,0],(0,1,0)),rot_track('chest',[0,.32,.65],[0,-.16,0],(0,1,0)),rot_track('rightHip',[0,.32,.65],[0,-.25,0])])
    clip('Turn_Right',.65,[rot_track('hips',[0,.32,.65],[0,-.28,0],(0,1,0)),rot_track('chest',[0,.32,.65],[0,.16,0],(0,1,0)),rot_track('leftHip',[0,.32,.65],[0,-.25,0])])
    clip('Jump',.55,[rot_track('leftHip',[0,.2,.55],[0,-.45,-.15]),rot_track('rightHip',[0,.2,.55],[0,-.45,-.15]),rot_track('leftKnee',[0,.2,.55],[0,.62,.25]),rot_track('rightKnee',[0,.2,.55],[0,.62,.25]),rot_track('leftShoulder',[0,.25,.55],[0,-.5,-.25]),rot_track('rightShoulder',[0,.25,.55],[0,-.5,-.25])])
    clip('Fall',.75,[rot_track('leftShoulder',[0,.75],[-.22,-.22]),rot_track('rightShoulder',[0,.75],[-.22,-.22]),rot_track('leftHip',[0,.75],[.18,.18]),rot_track('rightHip',[0,.75],[.18,.18])])
    clip('Land',.42,[rot_track('leftKnee',[0,.16,.42],[0,.7,0]),rot_track('rightKnee',[0,.16,.42],[0,.7,0]),rot_track('leftHip',[0,.16,.42],[0,-.25,0]),rot_track('rightHip',[0,.16,.42],[0,-.25,0]),rot_track('chest',[0,.16,.42],[0,.16,0])])
    clip('Mantle',.72,[rot_track('leftShoulder',[0,.20,.48,.72],[0,-1.35,-.65,0]),rot_track('rightShoulder',[0,.20,.48,.72],[0,-1.35,-.65,0]),rot_track('leftElbow',[0,.20,.48,.72],[0,-.72,-.35,0]),rot_track('rightElbow',[0,.20,.48,.72],[0,-.72,-.35,0]),rot_track('leftHip',[0,.28,.52,.72],[0,-.52,.45,0]),rot_track('rightHip',[0,.28,.52,.72],[0,.38,-.45,0]),rot_track('chest',[0,.28,.52,.72],[0,-.18,.16,0],(1,0,0))])
    clip('Crouch',1.0,[rot_track('leftHip',[0,.35,1],[0,-.38,-.38]),rot_track('rightHip',[0,.35,1],[0,-.38,-.38]),rot_track('leftKnee',[0,.35,1],[0,.62,.62]),rot_track('rightKnee',[0,.35,1],[0,.62,.62]),trans_track('hips',[0,.35,1],[(0,0,0),(0,-.13,0),(0,-.13,0)])])
    clip('Aim',1.0,[rot_track('rightShoulder',[0,1],[1.18,1.18]),rot_track('leftShoulder',[0,1],[1.05,1.05]),rot_track('rightElbow',[0,1],[-.45,-.45]),rot_track('leftElbow',[0,1],[-.85,-.85])])
    clip('Fire',.25,[rot_track('rightShoulder',[0,.08,.25],[1.18,1.32,1.18]),rot_track('leftShoulder',[0,.08,.25],[1.05,1.18,1.05]),rot_track('chest',[0,.08,.25],[0,-.05,0],(0,1,0))])
    clip('Hit_Reaction',.48,[rot_track('chest',[0,.16,.48],[0,.22,0],(0,0,1)),rot_track('head',[0,.16,.48],[0,-.20,0],(0,1,0)),rot_track('leftShoulder',[0,.16,.48],[0,-.35,0]),rot_track('rightShoulder',[0,.16,.48],[0,.25,0])])
    clip('Wave',1.5,[rot_track('rightShoulder',[0,.4,1.1,1.5],[0,-1.65,-1.65,0],(0,0,1)),rot_track('rightElbow',[0,.4,.65,.9,1.1,1.5],[0,-.6,-.25,-.7,-.35,0])])
    clip('Celebrate',1.25,[rot_track('leftShoulder',[0,.35,1.0,1.25],[0,-2.15,-2.15,0]),rot_track('rightShoulder',[0,.35,1.0,1.25],[0,-2.15,-2.15,0]),rot_track('leftElbow',[0,.35,1.0,1.25],[0,-.2,-.2,0]),rot_track('rightElbow',[0,.35,1.0,1.25],[0,-.2,-.2,0])])
    clip('Sit',1.0,[rot_track('leftHip',[0,1],[0,1.35]),rot_track('rightHip',[0,1],[0,1.35]),rot_track('leftKnee',[0,1],[0,-1.25]),rot_track('rightKnee',[0,1],[0,-1.25])])

    # Helpful extras for automated provenance/QA.
    b.doc['asset']['extras']={'productionVerticalSlice':True,'productionFlagship':True,'flagshipBenchmark':'PH-CHAR-01-P2','phase':'P2','sourceReference':'/approved-character-turnarounds/john-approved-turnaround.png','headRepair':'W27-JOHN-HEAD-REPAIR','character':'John','authoredClipCount':len(b.doc['animations']),'skinned':True,'artDirection':'stylized-realism','visualGate':'head-repair-device-pending'}
    size=b.finish(MODELS/'characters'/'john-production-skinned.glb')
    print('WROTE skinned John',size/1024,'KiB clips',len(b.doc['animations']))

# -----------------------------
# Papa shop + barn authored static asset
# -----------------------------
def wall_x(scene,z,x0,x1,h,openings,material,prefix,th=.14,interior_mat=None):
    openings=sorted(openings,key=lambda o:o[0]);cur=x0;segments=[]
    for a,b,sill,oh in openings:
        if a>cur:segments.append((cur,a,0,h))
        if sill>0:segments.append((a,b,0,sill))
        top=sill+oh
        if top<h:segments.append((a,b,top,h))
        cur=b
    if cur<x1:segments.append((cur,x1,0,h))
    is_shop='shop' in prefix
    ribmat=mat(prefix+'_SidingSeams',0x4b3629 if is_shop else 0x4b2926,.96,0)
    plank_cols=([0x7b5b40,0x6d5039,0x866347,0x604532] if is_shop else [0x88483d,0x763b34,0x934f43,0x64312d])
    plank_mats=[mat(prefix+f'_Board{i}',c,.93,0) for i,c in enumerate(plank_cols)]
    for i,(a,b,y0,y1) in enumerate(segments):
        add(scene,box([b-a,y1-y0,th],material),f'{prefix}_wall_{i}',T((a+b)/2,(y0+y1)/2,z))
        # Physical board-and-batten cladding. Broad boards give the wall real surface rhythm
        # instead of a single flat rectangle, while the base panel stays the weather seal.
        step=.30
        for j,x in enumerate(np.arange(a+.15,b-.05,step)):
            w=min(.265,b-x-.015)
            if w>.06:add(scene,box([w,y1-y0-.035,.024],plank_mats[(j+i)%len(plank_mats)]),f'{prefix}_board_{i}_{j}',T(x+w/2,(y0+y1)/2,z-th*.62))
            add(scene,box([.024,y1-y0-.02,.040],ribmat),f'{prefix}_rib_{i}_{j}',T(x-.012,(y0+y1)/2,z-th*.70))

def wall_z(scene,x,z0,z1,h,openings,material,prefix,th=.14):
    openings=sorted(openings,key=lambda o:o[0]);cur=z0;segments=[]
    for a,b,sill,oh in openings:
        if a>cur:segments.append((cur,a,0,h))
        if sill>0:segments.append((a,b,0,sill))
        top=sill+oh
        if top<h:segments.append((a,b,top,h))
        cur=b
    if cur<z1:segments.append((cur,z1,0,h))
    is_shop='shop' in prefix
    ribmat=mat(prefix+'_SidingSeams',0x4b3629 if is_shop else 0x4b2926,.96,0)
    plank_cols=([0x7b5b40,0x6d5039,0x866347,0x604532] if is_shop else [0x88483d,0x763b34,0x934f43,0x64312d])
    plank_mats=[mat(prefix+f'_Board{i}',c,.93,0) for i,c in enumerate(plank_cols)]
    for i,(a,b,y0,y1) in enumerate(segments):
        add(scene,box([th,y1-y0,b-a],material),f'{prefix}_wall_{i}',T(x,(y0+y1)/2,(a+b)/2))
        step=.30
        for j,zp in enumerate(np.arange(a+.15,b-.05,step)):
            w=min(.265,b-zp-.015)
            if w>.06:add(scene,box([.024,y1-y0-.035,w],plank_mats[(j+i)%len(plank_mats)]),f'{prefix}_board_{i}_{j}',T(x-th*.62,(y0+y1)/2,zp+w/2))
            add(scene,box([.040,y1-y0-.02,.024],ribmat),f'{prefix}_rib_{i}_{j}',T(x-th*.70,(y0+y1)/2,zp-.012))

def roof_plane(scene,x0,x1,z0,z1,y_eave,y_ridge,side,material,prefix,th=.105):
    # side -1: x0 -> ridge at x1; side +1: ridge x0 -> eave x1
    xa,xb=x0,x1;ya,yb=(y_eave,y_ridge) if side<0 else (y_ridge,y_eave)
    # rectangular slab oriented along slope
    xc=(xa+xb)/2;yc=(ya+yb)/2;dx=xb-xa;dy=yb-ya;length=math.hypot(dx,dy);angle=math.atan2(dy,dx)
    m=box([length,th,z1-z0],material)
    # box long axis X; rotate around Z to follow slope
    tr=T(xc,yc,(z0+z1)/2)@R(angle,[0,0,1]);add(scene,m,prefix,tr)
    # Standing-seam ribs make the roof read as weathered metal instead of a flat slab.
    seam=mat(prefix+'_MetalSeam',0x222625,.48,.68)
    for k,zz in enumerate(np.arange(z0+.22,z1-.12,.42)):
        add(scene,box([length*.99,.035,.026],seam),f'{prefix}_seam{k}',T(xc,yc+th*.62,zz)@R(angle,[0,0,1]))



def gable_x(scene,z,x0,x1,y_eave,y_ridge,material,prefix,th=.14):
    # Triangular end wall under a gable roof, authored as a prism rather than stacked boxes.
    xm=(x0+x1)/2
    verts=np.array([[x0,y_eave,z-th/2],[x1,y_eave,z-th/2],[xm,y_ridge,z-th/2],
                    [x0,y_eave,z+th/2],[x1,y_eave,z+th/2],[xm,y_ridge,z+th/2]],dtype=float)
    faces=np.array([[0,1,2],[3,5,4],[0,3,4],[0,4,1],[1,4,5],[1,5,2],[2,5,3],[2,3,0]],dtype=int)
    m=trimesh.Trimesh(vertices=verts,faces=faces,process=False);m.visual.material=material;add(scene,m,prefix+'_gable')
    # Vertical battens stop at the roof slope and make the facade read as siding.
    half=(x1-x0)/2
    ribmat=mat(prefix+'_GableSeams',0x59483a if 'shop' in prefix else 0x4e4035,.94,0)
    for x in np.arange(x0+.18,x1-.12,.38):
        rel=abs(x-xm)/half;top=y_ridge-(y_ridge-y_eave)*rel
        if top>y_eave+.12:add(scene,box([.027,top-y_eave-.05,.045],ribmat),prefix+f'_gable_rib_{x:.2f}',T(x,(y_eave+top)/2,z-th*.68))

def cone_frustum(r0,r1,h,material,segments=18):
    ang=np.linspace(0,2*math.pi,segments,endpoint=False);verts=[]
    for y,r in [(0,r0),(h,r1)]:
        verts.extend([[math.cos(a)*r,y,math.sin(a)*r] for a in ang])
    verts.extend([[0,0,0],[0,h,0]]);faces=[];bot=2*segments;top=bot+1
    for i in range(segments):
        j=(i+1)%segments;faces += [[i,j,segments+j],[i,segments+j,segments+i],[bot,j,i],[top,segments+i,segments+j]]
    m=trimesh.Trimesh(vertices=np.asarray(verts),faces=np.asarray(faces),process=False);m.visual.material=material;return m

def window_asset(scene,x,y,z,w,h,axis,prefix):
    frame=mat(prefix+'_CreamTrim',0xd7c8aa,.8,0);glass=mat(prefix+'_Glass',0x7ca9b6,.12,.04)
    dep=.07;th=.065
    if axis=='x':
        add(scene,box([w,h,.025],glass),prefix+'_glass',T(x,y+h/2,z))
        for xx in (x-w/2,x+w/2):add(scene,box([th,h+.14,dep],frame),prefix+f'_frameX{xx}',T(xx,y+h/2,z-.01))
        for yy in (y,y+h):add(scene,box([w+.14,th,dep],frame),prefix+f'_frameY{yy}',T(x,yy,z-.01))
        add(scene,box([th,h,dep],frame),prefix+'_mullion',T(x,y+h/2,z-.015))
    else:
        add(scene,box([.025,h,w],glass),prefix+'_glass',T(x,y+h/2,z))
        for zz in (z-w/2,z+w/2):add(scene,box([dep,h+.14,th],frame),prefix+f'_frameZ{zz}',T(x-.01,y+h/2,zz))
        for yy in (y,y+h):add(scene,box([dep,th,w+.14],frame),prefix+f'_frameY{yy}',T(x-.01,yy,z))
        add(scene,box([dep,h,th],frame),prefix+'_mullion',T(x-.015,y+h/2,z))


_FONT5={
 'P':[0b11110,0b10001,0b10001,0b11110,0b10000,0b10000,0b10000],
 'A':[0b01110,0b10001,0b10001,0b11111,0b10001,0b10001,0b10001],
 'S':[0b01111,0b10000,0b10000,0b01110,0b00001,0b00001,0b11110],
 'H':[0b10001,0b10001,0b10001,0b11111,0b10001,0b10001,0b10001],
 'O':[0b01110,0b10001,0b10001,0b10001,0b10001,0b10001,0b01110],
 "'":[0b00100,0b00100,0b01000,0,0,0,0], ' ':[0,0,0,0,0,0,0]
}
def pixel_text(scene,text,cx,cy,z,height,material,prefix):
    scale=height/7;glyph_w=5*scale;gap=scale*1.15;total=len(text)*glyph_w+(len(text)-1)*gap;x0=cx-total/2
    for ci,ch in enumerate(text):
        rows=_FONT5.get(ch.upper(),_FONT5[' '])
        gx=x0+ci*(glyph_w+gap)
        for row,bits in enumerate(rows):
            for col in range(5):
                if bits & (1<<(4-col)):
                    x=gx+(col+.5)*scale;y=cy+(6-row+.5)*scale
                    add(scene,box([scale*.72,scale*.72,.035],material),f'{prefix}_{ci}_{row}_{col}',T(x,y,z))

def make_tree(scene,x,z,scale,name):
    trunk=mat('TreeBark',0x594533,.96,0);leaf=mat('SpruceNeedles',0x2f5139,.98,0)
    add(scene,cyl(.10*scale,1.65*scale,trunk,12),name+'_trunk',T(x,.825*scale,z))
    # Layered tapered frustums create a readable spruce silhouette without sphere blobs.
    layers=[(.72,.78,.13,.62),(1.02,.72,.10,.58),(1.30,.61,.07,.53),(1.56,.49,.05,.47),(1.80,.34,.02,.40)]
    for i,(y,r0,r1,h) in enumerate(layers):
        m=cone_frustum(r0*scale,r1*scale,h*scale,leaf,20);add(scene,m,name+f'_crown{i}',T(x,y*scale,z))

def build_papa_shop_environment():
    s=trimesh.Scene(base_frame='world')
    shop=mat('Shop_WarmWeatheredSiding',0x72563d,.91,0);shop_dark=mat('Shop_SidingShadow',0x4e3829,.95,0)
    barn=mat('Barn_WornRedSiding',0x7b3e34,.92,0);roof=mat('Roof_DarkWeatheredMetal',0x34332f,.58,.46);trim=mat('Trim_Cream',0xd8c7a9,.84,0)
    concrete=mat('Shop_Concrete',0x77746c,.95,0);dirt=mat('Barn_Dirt',0x66513d,.98,0);gravel=mat('Apron_Gravel',0x6c685f,.98,0)
    steel=mat('Structural_Steel',0x5d6464,.52,.6);glass=mat('GlassBlue',0x88b9c3,.12,.05);stone=mat('ChimneyStone',0x655d54,.96,0)
    # Base terrain slabs with subtle separate zones
    add(s,box([19.1,.08,13.6],gravel),'property_gravel',T(9.7,-.04,7.0))
    add(s,box([11,.06,7.8],concrete),'shop_concrete',T(6.6,-.01,5.1))
    add(s,box([5.2,.06,6.3],dirt),'barn_floor',T(14.7,-.01,5.2))
    add(s,box([9.6,.04,3.3],gravel),'shop_apron',T(5.2,.0,10.7))
    # Shop exterior with exact gameplay openings.
    wall_x(s,1.2,1.1,12.1,2.95,[(3.0,4.25,1.15,1.05),(8.0,9.3,1.1,1.1)],shop,'shop_front')
    wall_z(s,1.1,1.2,9.0,2.95,[(4.0,5.2,1.15,1.05)],shop,'shop_left')
    wall_x(s,9.0,1.1,12.1,2.95,[(4.8,8.45,0,2.5),(10.35,11.25,0,2.18)],shop,'shop_rear')
    wall_z(s,12.1,1.2,8.2,2.95,[(4.15,6.0,0,2.5)],shop,'shop_right')
    # Barn walls
    wall_x(s,2.1,12.1,17.3,2.72,[(13.0,14.1,1.1,1.0)],barn,'barn_front')
    wall_z(s,17.3,2.1,8.25,2.72,[(4.2,5.35,0,2.15)],barn,'barn_right')
    wall_x(s,8.25,12.1,17.3,2.72,[(13.7,16.2,0,2.25)],barn,'barn_rear')
    # Roofs, proper gable silhouettes
    roof_plane(s,1.0,6.6,1.0,9.15,2.98,3.64,-1,roof,'shop_roof_left')
    roof_plane(s,6.6,12.2,1.0,9.15,2.98,3.64,1,roof,'shop_roof_right')
    roof_plane(s,12.0,14.7,1.95,8.4,2.75,3.32,-1,roof,'barn_roof_left')
    roof_plane(s,14.7,17.4,1.95,8.4,2.75,3.32,1,roof,'barn_roof_right')
    gable_x(s,1.19,1.1,12.1,2.95,3.64,shop,'shop_gable_front')
    gable_x(s,8.99,1.1,12.1,2.95,3.64,shop,'shop_gable_apron')
    gable_x(s,2.09,12.1,17.3,2.72,3.32,barn,'barn_gable_front')
    gable_x(s,8.24,12.1,17.3,2.72,3.32,barn,'barn_gable_rear')
    add(s,box([.14,.10,8.25],steel),'shop_ridge_cap',T(6.6,3.66,5.075))
    add(s,box([.13,.09,6.45],steel),'barn_ridge_cap',T(14.7,3.34,5.175))
    # Corner trim, eaves, gutters, downspouts
    for x in (1.08,12.12):
        for z in (1.18,8.98): add(s,box([.10,2.9,.10],trim),f'shop_corner_{x}_{z}',T(x,1.45,z))
    for x in (12.08,17.32):
        for z in (2.08,8.24): add(s,box([.095,2.68,.095],trim),f'barn_corner_{x}_{z}',T(x,1.34,z))
    for x in (1.05,12.15):
        add(s,cyl(.035,2.8,steel,10),f'downspout_{x}',T(x,1.4,9.08))
    add(s,box([11.25,.06,.08],steel),'shop_gutter',T(6.6,2.96,9.12))
    # Lower kick trim gives the siding a grounded architectural base.
    kick=mat('Shop_KickTrim',0x4c4b46,.72,.4)
    add(s,box([11.0,.18,.10],kick),'shop_front_kick',T(6.6,.09,1.12));add(s,box([11.0,.18,.10],kick),'shop_apron_kick',T(6.6,.09,9.02))
    add(s,box([.10,.18,7.8],kick),'shop_left_kick',T(1.12,.09,5.1));add(s,box([.10,.18,6.15],kick),'barn_right_kick',T(17.28,.09,5.17))
    # Windows exactly at source openings
    window_asset(s,3.625,1.15,1.125,1.25,1.05,'x','shop_window_front_L')
    window_asset(s,8.65,1.10,1.125,1.30,1.10,'x','shop_window_front_R')
    window_asset(s,1.075,1.15,4.6,1.2,1.05,'z','shop_window_left')
    window_asset(s,13.55,1.1,2.075,1.1,1.0,'x','barn_window_front')
    # Overhead door jamb/header only: interactive runtime door remains visible/functional inside this authored opening.
    for x in (4.8,8.45):add(s,box([.12,2.55,.14],trim),'overhead_jamb_'+str(x),T(x,1.275,8.93))
    add(s,box([3.77,.13,.15],trim),'overhead_header',T(6.625,2.52,8.93))
    door_mat=mat('OverheadDoor_WarmGrey',0xaaa69d,.68,.22)
    # Door is mostly open; visible horizontal sections sit just inside the header rather than filling the doorway.
    for i in range(4):add(s,box([3.48,.095,.075],door_mat),f'overhead_open_panel_{i}',T(6.625,2.61+i*.10,8.82))
    add(s,box([2.35,.52,.10],timber if 'timber' in locals() else shop_dark),'papa_shop_sign',T(6.625,3.17,9.075))
    signmat=mat('ShopSign_CreamLetters',0xe7d6ad,.7,.05)
    pixel_text(s,"PAPA'S SHOP",6.625,3.02,9.145,.28,signmat,'papa_sign_text')
    # Broad fascia and two warm exterior fixtures make the entrance read intentionally at phone scale.
    add(s,box([11.18,.15,.12],trim),'shop_front_fascia',T(6.6,2.91,9.03))
    lampmat=mat('ExteriorLamp',0xd6a75e,.45,.35,emissive=0xf2b85d)
    for lx in (4.25,9.0):
        add(s,cyl(.065,.24,steel,12),f'entry_lamp_arm_{lx}',T(lx,2.66,9.10)@R(math.pi/2,[1,0,0]));add(s,ell(.12,.08,.12,lampmat,2),f'entry_lamp_{lx}',T(lx,2.57,9.18))
    # Man door frame and barn passage frame
    for x in (10.35,11.25):add(s,box([.11,2.22,.13],trim),'man_door_jamb_'+str(x),T(x,1.11,8.93))
    add(s,box([1.02,.12,.14],trim),'man_door_header',T(10.8,2.20,8.93))
    for z in (4.15,6.0):add(s,box([.13,2.54,.11],trim),'passage_jamb_'+str(z),T(12.03,1.27,z))
    add(s,box([.13,.12,1.97],trim),'passage_header',T(12.03,2.48,5.075))
    # Interior beams/trusses, fewer and chunkier than old blockout lines.
    timber=mat('Interior_Timber',0x5a4331,.94,0)
    for z in (2.2,4.25,6.3,8.15):
        add(s,box([10.6,.13,.15],timber),f'shop_ceiling_beam_{z}',T(6.6,2.72,z))
        beam_between((1.3,2.74,z),(6.6,3.55,z),.045,timber,f'shop_rafterL_{z}',s,10)
        beam_between((6.6,3.55,z),(11.9,2.74,z),.045,timber,f'shop_rafterR_{z}',s,10)
    for z in (2.65,4.75,6.85):
        add(s,box([4.9,.12,.13],timber),f'barn_crossbeam_{z}',T(14.7,2.47,z))
    # Chimney with individual stone blocks
    for y in np.arange(2.5,4.15,.22):
        for x in (10.7,10.94):
            for z in (7.22,7.46):add(s,box([.25,.20,.25],stone),f'chim_{x}_{y}_{z}',T(x,y,z))
    add(s,box([.68,.10,.68],steel),'chimney_cap',T(10.82,4.16,7.34))
    # Barn stalls: actual rail-and-post structures
    rail=mat('Barn_Rail',0x72583c,.92,0)
    for sx in (12.55,14.75,16.75): add(s,box([.10,1.28,.10],rail),f'stall_post_{sx}',T(sx,.64,4.1))
    for y in (.55,1.0): add(s,box([4.25,.09,.08],rail),f'stall_rail_{y}',T(14.65,y,4.1))
    # exterior tree cluster to avoid primitive-tree screenshot read
    make_tree(s,18.1,1.2,.9,'tree_east1');make_tree(s,18.25,8.8,.8,'tree_east2');make_tree(s,.55,11.9,.75,'tree_west')
    # property sign and small utility box
    add(s,box([1.7,.9,.10],timber),'property_sign_board',T(2.0,1.15,12.65));add(s,box([.10,1.65,.10],timber),'property_sign_postL',T(1.35,.825,12.65));add(s,box([.10,1.65,.10],timber),'property_sign_postR',T(2.65,.825,12.65))

    # Reference-aligned exterior dressing for the approved rural shop/barn property.
    # This intentionally sits OUTSIDE the authoritative gameplay collision shell.
    barn_dark=mat('Barn_DarkRedTrim',0x4c2d28,.94,0);green_roof=mat('LeanTo_GreenMetal',0x405443,.62,.48)
    yardwood=mat('Yard_WeatheredWood',0x74533a,.94,0);rust=mat('Yard_RustedMetal',0x7a4b31,.82,.45)
    hay=mat('Hay_Straw',0xa98951,.96,0);fencewood=mat('Fence_WornWood',0x61452f,.96,0);mud=mat('Yard_Mud',0x514333,.99,0)

    # Old green-roof lean-to / side shelter, matching the approved property silhouette.
    for px in (.55,1.65):
        add(s,box([.12,2.25,.12],yardwood),f'lean_post_{px}',T(px,1.125,6.9))
        add(s,box([.12,2.25,.12],yardwood),f'lean_post2_{px}',T(px,1.125,8.25))
    lean=box([2.25,.10,2.15],green_roof);add(s,lean,'lean_to_roof',T(1.10,2.42,7.55)@R(-.11,[0,0,1]))
    add(s,box([2.25,.18,.16],yardwood),'lean_header',T(1.1,2.18,8.32))

    # Barn sliding doors parked open at each side of the playable rear opening.
    door_red=mat('Barn_Door_Red',0x6e352e,.92,0)
    for name,dx in [('L',13.25),('R',16.65)]:
        add(s,box([.82,2.18,.085],door_red),f'barn_slide_door_{name}',T(dx,1.09,8.32))
        # cream X brace gives the door a recognizable barn silhouette
        beam_between((dx-.34,.18,8.27),(dx+.34,2.00,8.27),.035,trim,f'barn_door_x1_{name}',s,10)
        beam_between((dx+.34,.18,8.265),(dx-.34,2.00,8.265),.035,trim,f'barn_door_x2_{name}',s,10)
        add(s,box([.72,.055,.04],trim),f'barn_door_top_{name}',T(dx,2.05,8.265))

    # Loft hatch and cupola/weather-vane massing so the barn reads like the approved reference.
    add(s,box([.78,.62,.07],door_red),'barn_loft_hatch',T(14.7,2.82,8.315))
    add(s,box([.70,.055,.085],trim),'barn_loft_trim_top',T(14.7,3.14,8.30))
    for xx in (14.30,15.10):add(s,box([.055,.70,.085],trim),f'barn_loft_trim_{xx}',T(xx,2.82,8.30))
    add(s,box([.68,.55,.68],barn),'barn_cupola',T(14.7,3.64,5.18))
    roof_plane(s,14.30,14.70,4.78,5.58,3.93,4.18,-1,roof,'cupola_roof_L',.065)
    roof_plane(s,14.70,15.10,4.78,5.58,3.93,4.18,1,roof,'cupola_roof_R',.065)
    add(s,cyl(.022,.72,steel,8),'weather_vane_post',T(14.7,4.48,5.18))
    add(s,box([.38,.035,.06],steel),'weather_vane_arrow',T(14.7,4.80,5.18))

    # Working-yard fence and pen geometry, leaving a broad opening for the playable apron.
    for x in np.arange(.55,19.0,1.55):
        if 5.2<x<9.3: continue
        add(s,box([.10,1.05,.10],fencewood),f'front_fence_post_{x:.2f}',T(x,.525,13.05))
    for y in (.42,.82):
        for xa,xb in [(.55,5.15),(9.35,18.95)]:add(s,box([xb-xa,.075,.095],fencewood),f'front_fence_rail_{y}_{xa}',T((xa+xb)/2,y,13.05))
    # Right livestock/service pen around the barn edge.
    for z in np.arange(9.0,12.9,1.15):add(s,box([.09,.95,.09],fencewood),f'pen_post_{z:.2f}',T(18.55,.475,z))
    for y in (.38,.72):add(s,box([.085,.07,3.95],fencewood),f'pen_rail_{y}',T(18.55,y,10.95))

    # Exterior working clutter, grouped deliberately rather than sprayed randomly.
    for i,(px,pz,ang) in enumerate([(2.9,11.55,.06),(3.55,11.55,-.03),(10.7,11.55,.05),(11.25,11.30,-.05)]):
        add(s,box([1.00,.13,.72],yardwood),f'yard_pallet_{i}_base',T(px,.09,pz)@R(ang,[0,1,0]))
        for j in range(4):add(s,box([.92,.055,.10],yardwood),f'yard_pallet_{i}_slat{j}',T(px-.34+j*.22,.19,pz)@R(ang,[0,1,0]))
    # lumber pile near entrance
    for j in range(7):add(s,box([2.25,.09,.13],yardwood),f'yard_lumber_{j}',T(1.9,.09+j*.10,10.45+j*.015)@R(.035,[0,1,0]))
    # stacked tires and rusty drums
    tiremat=mat('Yard_TireRubber',0x1b1d1c,.98,0)
    for k in range(4):add(s,torus(.28,.095,tiremat,28,10),f'yard_tire_{k}',T(11.75,.10+k*.17,10.20)@R(math.pi/2,[1,0,0]))
    for k,(px,pz) in enumerate([(16.95,10.15),(17.45,10.10),(17.20,10.55)]):
        add(s,cyl(.25,.72,rust,20),f'yard_drum_{k}',T(px,.36,pz))
        add(s,torus(.24,.018,steel,20,7),f'yard_drum_rim_{k}',T(px,.71,pz)@R(math.pi/2,[1,0,0]))
    # hay and feed stacks by barn
    for j,(px,pz) in enumerate([(13.0,10.65),(13.75,10.70),(14.5,10.70),(13.35,11.20),(14.10,11.25)]):
        add(s,box([.72,.45,.48],hay),f'hay_bale_{j}',T(px,.225,pz)@R((j%2)*.06,[0,1,0]))
    # muddy high-traffic patches visually break up the big gravel slab.
    for j,(px,pz,sx,sz) in enumerate([(6.7,11.2,3.2,1.25),(15.6,11.4,2.5,1.1),(9.7,12.25,2.1,.55)]):
        add(s,box([sx,.018,sz],mud),f'mud_patch_{j}',T(px,.002,pz))
    # small timber service shed on the left side of the property with green metal roof.
    add(s,box([2.4,1.85,1.8],shop_dark),'service_shed_body',T(.65,.925,3.15))
    add(s,box([2.65,.10,2.05],green_roof),'service_shed_roof',T(.65,1.95,3.15)@R(-.05,[0,0,1]))
    add(s,box([.82,1.58,.06],yardwood),'service_shed_door',T(1.88,.79,3.15))
    # Export
    out=MODELS/'environments'/'papa-shop-barn-production.glb';out.parent.mkdir(parents=True,exist_ok=True);data=s.export(file_type='glb');out.write_bytes(data);print('WROTE',out.relative_to(ROOT),len(data)/1024,'KiB',len(s.graph.nodes),'nodes')

# -----------------------------
# Papa production prop set, placed in world coordinates
# -----------------------------
def build_papa_prop_set():
    s=trimesh.Scene(base_frame='world')
    # materials
    yellow=mat('PapaChair_WornYellow',0xb58a3d,.94,0);yellow_dark=mat('PapaChair_Wear',0x80602f,.97,0);wood=mat('Shop_Wood',0x6e4d32,.9,0)
    steel=mat('Shop_Steel',0x687172,.42,.7);black=mat('Rubber',0x1d2020,.96,0);red=mat('Tool_Red',0x8f362d,.56,.5);green=mat('Tractor_Green',0x456249,.65,.42)
    stone=mat('Fireplace_Stone',0x6c6257,.97,0);soot=mat('Fireplace_Soot',0x201d1a,.98,0);chrome=mat('Chrome',0xb5bcbb,.26,.9);leather=mat('OldLeather',0x4b3525,.92,0)
    orange=mat('Cord_Orange',0xc46f2f,.78,.05);blue=mat('ShopVac_Blue',0x345f71,.7,.18);plastic=mat('Utility_Plastic',0x7d886e,.8,0);glass=mat('Vehicle_Glass',0x91b2b7,.18,.08)
    # Papa chair at 9.35,8.0; high curved arms/back, tufted cushion
    x,z=9.35,8.0
    add(s,box([1.02,.16,.88],yellow),'chair_seat',T(x,.48,z));add(s,box([.92,.18,.76],yellow_dark),'chair_cushion',T(x,.63,z-.03))
    # tall back, slightly reclined
    back=box([1.05,1.38,.18],yellow);add(s,back,'chair_high_back',T(x,1.25,z+.38)@R(-.12,[1,0,0]))
    for side in (-1,1):
        # arm posts and rounded upper bolsters
        add(s,box([.18,.78,.78],yellow),f'chair_arm_{side}',T(x+side*.55,.80,z-.01))
        add(s,ell(.16,.16,.43,yellow,2),f'chair_arm_curve_{side}',T(x+side*.55,1.17,z-.06))
        add(s,box([.12,.36,.12],wood),f'chair_leg_front_{side}',T(x+side*.43,.18,z-.30))
        add(s,box([.12,.36,.12],wood),f'chair_leg_rear_{side}',T(x+side*.43,.18,z+.30))
    # tuft buttons / wear patches
    for px in (-.28,0,.28):
        for py in (.93,1.25,1.52): add(s,ell(.025,.025,.018,yellow_dark,1),f'chair_tuft_{px}_{py}',T(x+px,py,z+.275))
    # Fireplace at 10.85,7.26
    fx,fz=10.85,7.26
    add(s,box([1.32,.10,.92],stone),'fire_hearth',T(fx,.08,fz))
    # uneven stone surround
    rng=np.random.default_rng(42)
    for side in (-1,1):
        for row in range(6):
            yy=.25+row*.25
            for col in range(2):
                xx=fx+side*(.50+col*.13);zz=fz+(col-.5)*.25
                m=box([.24+rng.uniform(-.02,.02),.22,.31],stone);add(s,m,f'fire_stone_{side}_{row}_{col}',T(xx,yy,zz)@R(rng.uniform(-.04,.04),[0,0,1]))
    for col in range(6):add(s,box([.23,.25,.33],stone),f'fire_lintel_{col}',T(fx-.57+col*.23,1.62,fz))
    add(s,box([1.0,1.05,.055],soot),'firebox',T(fx,.78,fz+.30));add(s,box([1.24,.11,.94],wood),'fire_mantel',T(fx,1.92,fz-.02))
    for dz in (-.08,.08):add(s,cyl(.075,.75,wood,14),f'fire_log_{dz}',T(fx,.31,fz+dz)@R(math.pi/2,[0,0,1]))
    # Workbench at 4.25,2.78
    wx,wz=4.25,2.78
    add(s,box([3.0,.13,.86],wood),'bench_top',T(wx,.93,wz));add(s,box([2.85,.92,.055],wood),'bench_pegboard',T(wx,1.45,wz+.39))
    for sx in (-1.28,1.28):
        for sz in (-.31,.31):add(s,box([.13,.88,.13],steel),f'bench_leg_{sx}_{sz}',T(wx+sx,.44,wz+sz))
    for i,px in enumerate(np.linspace(-1.0,1.0,7)):
        add(s,cyl(.018,.34,steel,8),f'bench_tool_{i}',T(wx+px,1.52,wz+.35)@R((i-3)*.08,[0,0,1]));add(s,box([.11,.03,.03],steel),f'bench_toolhead_{i}',T(wx+px,1.35,wz+.35))
    # tool chest 7.45,2.78
    tx,tz=7.45,2.78;add(s,box([1.45,1.02,.64],red),'toolchest_body',T(tx,.55,tz));add(s,box([1.5,.10,.69],black),'toolchest_top',T(tx,1.11,tz))
    for i in range(6):
        yy=.25+i*.135;add(s,box([1.31,.105,.035],red),f'toolchest_drawer{i}',T(tx,yy,tz-.335));add(s,box([.42,.025,.025],chrome),f'toolchest_handle{i}',T(tx,yy,tz-.365))
    # shelving 10.3,3.05
    sx,sz=10.3,3.05
    for xx in (-.72,.72):
        for zz in (-.29,.29):add(s,box([.08,2.25,.08],steel),f'shelf_post_{xx}_{zz}',T(sx+xx,1.125,sz+zz))
    for i in range(5):
        yy=.12+i*.51;add(s,box([1.55,.07,.66],wood),f'shelf_{i}',T(sx,yy,sz))
        if i:
            for k,c in enumerate((0x697857,0x8f5d43,0x455d6a)):
                bm=mat('StorageBin'+str(c),c,.76,.1);add(s,box([.38,.22,.40],bm),f'bin_{i}_{k}',T(sx-.48+k*.48,yy+.14,sz))
    # Tractor 4.25,6.75 detailed
    cx,cz=4.25,6.75
    add(s,box([1.25,.72,1.15],green),'tractor_engine',T(cx-.35,.95,cz));add(s,box([.88,.12,.96],green),'tractor_hood',T(cx-.54,1.37,cz));add(s,box([.90,.78,1.0],green),'tractor_rearbody',T(cx+.70,.90,cz))
    add(s,ell(.30,.13,.34,leather,2),'tractor_seat',T(cx+.60,1.47,cz));add(s,box([.16,.48,.35],leather),'tractor_seatback',T(cx+.85,1.72,cz+.05))
    for ix,(px,pz,r) in enumerate([(-.72,-.62,.43),(-.72,.62,.43),(.72,-.67,.60),(.72,.67,.60)]):
        add(s,torus(r,.15,black,36,12),f'tractor_tire{ix}',T(cx+px,r,cz+pz)@R(math.pi/2,[0,1,0]));add(s,cyl(r*.42,.14,steel,20),f'tractor_hub{ix}',T(cx+px,r,cz+pz)@R(math.pi/2,[1,0,0]))
    # cab/rollbar and exhaust
    for px in (cx+.35,cx+.85):add(s,cyl(.035,1.35,steel,12),'tractor_rollbar'+str(px),T(px,1.72,cz+.44))
    add(s,box([.55,.05,.05],steel),'tractor_rollbar_top',T(cx+.60,2.38,cz+.44));add(s,cyl(.055,1.25,steel,14),'tractor_exhaust',T(cx-.75,1.75,cz+.36))
    # motorcycle at 7.75,6.65
    mx,mz=7.75,6.65
    for i,dz in enumerate((-.68,.68)):
        add(s,torus(.38,.062,black,36,12),f'moto_tire{i}',T(mx,.40,mz+dz)@R(math.pi/2,[0,1,0]));add(s,cyl(.17,.06,chrome,22),f'moto_hub{i}',T(mx,.40,mz+dz)@R(math.pi/2,[1,0,0]))
    # frame tubes
    beam_between((mx,.46,mz-.50),(mx,.75,mz+.10),.032,chrome,'moto_frameA',s,12);beam_between((mx,.75,mz+.10),(mx,.46,mz+.50),.032,chrome,'moto_frameB',s,12);beam_between((mx,.46,mz-.50),(mx,.46,mz+.50),.032,chrome,'moto_frameC',s,12)
    add(s,ell(.27,.18,.34,mat('Motorcycle_OldPaint',0x343838,.56,.68),3),'moto_tank',T(mx,.82,mz-.16));add(s,ell(.19,.075,.30,leather,3),'moto_seat',T(mx,.82,mz+.35));add(s,box([.35,.30,.30],steel),'moto_engine',T(mx,.55,mz+.12));add(s,box([.66,.035,.035],chrome),'moto_handlebar',T(mx,1.08,mz-.75));add(s,ell(.09,.08,.07,glass,2),'moto_headlamp',T(mx,.94,mz-.84))
    # reusable clutter kit, distributed where gameplay already expects clutter
    # buckets
    for i,(px,pz) in enumerate([(2.2,3.8),(2.55,4.2),(12.85,7.2),(15.2,4.9)]):
        add(s,cyl(.17,.34,steel,18),f'bucket_{i}',T(px,.17,pz));add(s,torus(.18,.012,steel,22,7),f'bucket_rim_{i}',T(px,.34,pz)@R(math.pi/2,[1,0,0]))
    # gas cans
    gas=mat('GasCan_Red',0x9d3d32,.72,.18)
    for i,(px,pz) in enumerate([(8.1,3.65),(4.25,11.6)]):
        add(s,box([.34,.45,.22],gas),f'gascan_{i}',T(px,.225,pz));add(s,torus(.095,.018,gas,20,8),f'gascan_handle_{i}',T(px,.46,pz)@R(math.pi/2,[1,0,0]));add(s,cyl(.035,.16,steel,10),f'gascan_spout_{i}',T(px+.15,.42,pz-.08)@R(-.9,[0,0,1]))
    # shop vac
    add(s,cyl(.24,.50,blue,22),'shopvac_body',T(8.55,.25,3.8));add(s,torus(.14,.028,black,22,8),'shopvac_wheelL',T(8.36,.08,3.8));add(s,torus(.14,.028,black,22,8),'shopvac_wheelR',T(8.74,.08,3.8));beam_between((8.55,.45,3.8),(8.85,.78,4.0),.025,black,'shopvac_hose',s,10)
    # sawhorse + lumber
    for px in (5.25,5.85):beam_between((px,.05,8.0),(5.55,.72,8.1),.035,wood,'sawhorse_leg'+str(px),s,8)
    add(s,box([1.35,.07,.14],wood),'sawhorse_top',T(5.55,.72,8.1))
    for i in range(5):add(s,box([2.6,.10,.16],wood),f'lumber_{i}',T(2.75,.12+i*.11,8.0+i*.025))
    # extension cord coil
    for i in range(3):add(s,torus(.20+i*.025,.012,orange,28,8),f'cord_coil{i}',T(6.35,.10+i*.018,8.42)@R(math.pi/2,[1,0,0]))
    # oil jugs / cases / trash
    add(s,box([.20,.34,.14],plastic),'oil_jug',T(2.85,.17,3.95));add(s,box([.55,.28,.38],mat('BeerCase',0x6b4d2f,.86,0)),'beer_case',T(9.75,.14,6.35));add(s,cyl(.28,.75,mat('TrashBin',0x394443,.82,.12),20),'garbage_can',T(16.45,.375,5.7))
    out=MODELS/'sets'/'papa-shop-production-props.glb';out.parent.mkdir(parents=True,exist_ok=True);data=s.export(file_type='glb');out.write_bytes(data);print('WROTE',out.relative_to(ROOT),len(data)/1024,'KiB',len(s.graph.nodes),'nodes')

if __name__=='__main__':
    build_skinned_john();build_papa_shop_environment();build_papa_prop_set()
