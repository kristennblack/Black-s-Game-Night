from pathlib import Path
import math
import os
import numpy as np
import trimesh
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageEnhance
import vtk
from vtk.util.numpy_support import numpy_to_vtk

ROOT=Path(__file__).resolve().parents[1]
MODE=os.getenv('PAPA_QA_MODE','exterior').strip().lower()
OUT=ROOT/('PAPA_SHOP_VERTICAL_SLICE_INTERIOR_PHONE_RENDER.png' if MODE=='interior' else 'PAPA_SHOP_VERTICAL_SLICE_PHONE_RENDER.png')
W,H=430,932

# VTK is Z-up by convention only visually; our data stays Y-up and camera uses those coordinates.
def rgba_for(geom):
    mat=getattr(getattr(geom,'visual',None),'material',None)
    c=getattr(mat,'baseColorFactor',None)
    if c is None:
        c=np.array([170,165,150,255],dtype=np.uint8)
    c=np.array(c,dtype=float).reshape(-1)
    if len(c)<4:c=np.r_[c,255]
    if c.max()<=1.0:c=c*255
    return tuple(np.clip(c[:4],0,255).astype(int))

def transformed_meshes(path, extra=None):
    s=trimesh.load(path,force='scene',process=False)
    for node in s.graph.nodes_geometry:
        T,gname=s.graph.get(node)
        if extra is not None:T=extra@T
        g=s.geometry[gname].copy()
        g.apply_transform(T)
        yield node,g,rgba_for(g)

_texture_refs=[]
_tex_cache={}
def _vtk_texture_from_pil(pil_img):
    # Use VTK's PNG reader rather than raw image memory so texture orientation and
    # component layout are deterministic in offscreen Mesa/Xvfb rendering.
    import hashlib, io
    buf=io.BytesIO();pil_img.convert('RGBA').save(buf,format='PNG');raw=buf.getvalue();key=hashlib.sha1(raw).hexdigest()
    if key in _tex_cache:return _tex_cache[key]
    path=ROOT/f'.qa_tex_{key}.png';path.write_bytes(raw)
    reader=vtk.vtkPNGReader();reader.SetFileName(str(path));reader.Update()
    tex=vtk.vtkTexture();tex.SetInputConnection(reader.GetOutputPort());tex.InterpolateOn();tex.RepeatOn()
    # OpenGL texture V axis differs from GLTF's image convention; VTK respects the
    # incoming UVs but the reader data needs the texture transform flipped.
    t=vtk.vtkTransform();t.Translate(0,1,0);t.Scale(1,-1,1);tex.SetTransform(t)
    _texture_refs.extend([reader,tex,t,path]);_tex_cache[key]=tex
    return tex

def add_mesh(renderer,g,rgba,metal=False):
    v=np.asarray(g.vertices,dtype=np.float64)
    f=np.asarray(g.faces,dtype=np.int64)
    pts=vtk.vtkPoints();pts.SetData(numpy_to_vtk(v,deep=True))
    cells=vtk.vtkCellArray()
    for tri in f:
        cells.InsertNextCell(3)
        cells.InsertCellPoint(int(tri[0]));cells.InsertCellPoint(int(tri[1]));cells.InsertCellPoint(int(tri[2]))
    poly=vtk.vtkPolyData();poly.SetPoints(pts);poly.SetPolys(cells)
    uv=getattr(getattr(g,'visual',None),'uv',None)
    mat=getattr(getattr(g,'visual',None),'material',None)
    tex_img=getattr(mat,'baseColorTexture',None)
    if uv is not None and len(uv)==len(v):
        uv_np=np.asarray(uv,dtype=np.float32)
        uv_arr=numpy_to_vtk(uv_np,deep=True);uv_arr.SetNumberOfComponents(2);uv_arr.SetName('TCoords');poly.GetPointData().SetTCoords(uv_arr)
        # Bake the embedded GLB texture to dense vertex colours for the offline QA
        # renderer. This avoids backend-specific texture bugs while keeping the
        # proof tied directly to the packaged face/plaid/denim source images.
        if tex_img is not None:
            im=np.asarray(tex_img.convert('RGBA'),dtype=np.uint8);ih,iw,_=im.shape
            uu=np.mod(uv_np[:,0],1.0);vv=np.mod(uv_np[:,1],1.0)
            xi=np.clip(np.rint(uu*(iw-1)).astype(int),0,iw-1);yi=np.clip(np.rint((1-vv)*(ih-1)).astype(int),0,ih-1)
            cols=im[yi,xi].copy()
            factor=np.asarray(getattr(mat,'baseColorFactor',[255,255,255,255]),dtype=float).reshape(-1)
            if factor.max()<=1.0:factor=factor*255
            cols[:,:3]=np.clip(cols[:,:3].astype(float)*(factor[:3]/255.0),0,255).astype(np.uint8)
            ca=numpy_to_vtk(cols,deep=True,array_type=vtk.VTK_UNSIGNED_CHAR);ca.SetNumberOfComponents(4);ca.SetName('VertexColor');poly.GetPointData().SetScalars(ca)
    normals=vtk.vtkPolyDataNormals();normals.SetInputData(poly);normals.SplittingOff();normals.ConsistencyOn();normals.AutoOrientNormalsOn();normals.ComputePointNormalsOn();normals.Update()
    mapper=vtk.vtkPolyDataMapper();mapper.SetInputConnection(normals.GetOutputPort())
    if tex_img is not None and uv is not None:
        mapper.SetScalarModeToUsePointData();mapper.SetColorModeToDirectScalars();mapper.ScalarVisibilityOn()
    actor=vtk.vtkActor();actor.SetMapper(mapper)
    r,gc,b,a=rgba
    prop=actor.GetProperty();prop.SetColor(r/255,gc/255,b/255);prop.SetOpacity(a/255)
    prop.SetInterpolationToPBR();prop.SetRoughness(.62 if not metal else .28);prop.SetMetallic(.04 if not metal else .45)
    renderer.AddActor(actor)
    return actor

def matname(geom):
    m=getattr(getattr(geom,'visual',None),'material',None)
    return str(getattr(m,'name',''))

ren=vtk.vtkRenderer();ren.SetBackground(0.66,0.77,0.82);ren.SetBackground2(0.29,0.38,0.36);ren.GradientBackgroundOn()
win=vtk.vtkRenderWindow();win.SetSize(W,H);win.SetOffScreenRendering(1);win.SetMultiSamples(8);win.AddRenderer(ren)

# Authored property and authored prop set.
for node,g,rgba in transformed_meshes(ROOT/'public/models/environments/papa-shop-barn-production.glb'):
    add_mesh(ren,g,rgba,metal='metal' in matname(g).lower())
for node,g,rgba in transformed_meshes(ROOT/'public/models/sets/papa-shop-production-props.glb'):
    add_mesh(ren,g,rgba,metal='metal' in matname(g).lower() or 'chrome' in matname(g).lower())

# John: place at the accepted Prop Hunt exterior spawn. He faces the open shop door (-Z).
S=.991826
A=np.eye(4);A[:3,:3]*=S
# Turn John partly toward the viewer in the QA proof so the approved face texture
# is visible. The actual game keeps the normal gameplay orientation.
yaw=math.radians(205 if MODE=='interior' else 155);R=np.eye(4);R[0,0]=math.cos(yaw);R[0,2]=math.sin(yaw);R[2,0]=-math.sin(yaw);R[2,2]=math.cos(yaw);A=A@R
A[:3,3]=([8.15,0.0,7.95] if MODE=='interior' else [7.55,0.0,10.55])
for node,g,rgba in transformed_meshes(ROOT/'public/models/characters/john-production-skinned.glb',A):
    add_mesh(ren,g,rgba,metal=False)

# Add soft rural ground outside the authored property so portrait framing never shows void.
ground=vtk.vtkPlaneSource();ground.SetOrigin(-28,-.09,-25);ground.SetPoint1(46,-.09,-25);ground.SetPoint2(-28,-.09,40);ground.SetResolution(1,1)
gm=vtk.vtkPolyDataMapper();gm.SetInputConnection(ground.GetOutputPort());ga=vtk.vtkActor();ga.SetMapper(gm);ga.GetProperty().SetColor(.31,.36,.25);ga.GetProperty().SetRoughness(.95);ren.AddActor(ga)

# Simple authored-property lighting: cool sky fill + warm sun.
sun=vtk.vtkLight();sun.SetLightTypeToSceneLight();sun.SetPosition(-8,15,18);sun.SetFocalPoint(7,1.5,6);sun.SetColor(1.0,.91,.78);sun.SetIntensity(1.25);ren.AddLight(sun)
fill=vtk.vtkLight();fill.SetLightTypeToSceneLight();fill.SetPosition(20,8,15);fill.SetFocalPoint(7,1.0,7);fill.SetColor(.68,.80,1.0);fill.SetIntensity(.52);ren.AddLight(fill)
front=vtk.vtkLight();front.SetLightTypeToSceneLight();front.SetPosition(5,4,18);front.SetFocalPoint(5.2,1,10.5);front.SetColor(1,.95,.88);front.SetIntensity(.45);ren.AddLight(front)

cam=ren.GetActiveCamera()
if MODE=='interior':
    cam.SetPosition(6.25,2.20,8.72);cam.SetFocalPoint(9.45,1.12,7.10);cam.SetViewAngle(54)
else:
    cam.SetPosition(11.8,3.05,16.45);cam.SetFocalPoint(6.72,1.55,7.82);cam.SetViewAngle(48)
cam.SetViewUp(0,1,0);cam.SetClippingRange(.1,100)
ren.ResetCameraClippingRange()

win.Render()
w2i=vtk.vtkWindowToImageFilter();w2i.SetInput(win);w2i.SetInputBufferTypeToRGBA();w2i.ReadFrontBufferOff();w2i.Update()
writer=vtk.vtkPNGWriter();writer.SetFileName(str(OUT.with_suffix('.raw.png')));writer.SetInputConnection(w2i.GetOutputPort());writer.Write()

# VTK's image may be upside-down depending on backend. Flip and add a very light phone HUD
# matching the new minimal control philosophy. This is a QA proof render, not a fake device capture.
img=Image.open(OUT.with_suffix('.raw.png')).convert('RGB')
# Gentle local contrast to resemble browser canvas tone mapping.
img=ImageEnhance.Contrast(img).enhance(1.06);img=ImageEnhance.Color(img).enhance(1.06)
d=ImageDraw.Draw(img,'RGBA')
# top safe-area status chips
try:
    font=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',13)
    fontb=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf',15)
    small=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',11)
except:
    font=fontb=small=None

def pill(xy,text,fill=(16,20,19,195),outline=(255,255,255,38),font=font):
    x0,y0,x1,y1=xy;d.rounded_rectangle(xy,radius=(y1-y0)//2,fill=fill,outline=outline,width=1)
    bb=d.textbbox((0,0),text,font=font);tw=bb[2]-bb[0];th=bb[3]-bb[1];d.text((x0+(x1-x0-tw)/2,y0+(y1-y0-th)/2-1),text,font=font,fill=(250,248,240,235))

pill((14,18,150,48),'PAPA’S SHOP',font=fontb)
pill((288,18,416,48),'HIDER  ♥ 3',fill=(30,46,37,195),font=font)
# tiny QA proof marker, explicitly not in-game debug UI.
pill((145,60,285,85),'VERTICAL SLICE 05',fill=(17,20,18,132),font=small)

# joystick, unobtrusive and low-opacity
cx,cy=74,H-112
d.ellipse((cx-52,cy-52,cx+52,cy+52),fill=(10,13,12,72),outline=(255,255,255,35),width=2)
d.ellipse((cx-20,cy-20,cx+20,cy+20),fill=(235,235,225,82),outline=(255,255,255,45),width=1)
# action buttons
for x,y,r,label in [(365,H-115,34,'JUMP'),(299,H-92,28,'PROP'),(373,H-185,28,'SPRINT')]:
    d.ellipse((x-r,y-r,x+r,y+r),fill=(16,22,20,145),outline=(255,255,255,54),width=2)
    bb=d.textbbox((0,0),label,font=small);d.text((x-(bb[2]-bb[0])/2,y-(bb[3]-bb[1])/2-1),label,font=small,fill=(255,250,235,230))
# lower fade for readable controls without covering scene
fade=Image.new('RGBA',img.size,(0,0,0,0));fd=ImageDraw.Draw(fade)
for i in range(160):
    alpha=int(70*(i/159)**2);fd.rectangle((0,H-160+i,W,H-160+i+1),fill=(8,10,9,alpha))
img=Image.alpha_composite(img.convert('RGBA'),fade).convert('RGB')
img.save(OUT,quality=95)
try: OUT.with_suffix('.raw.png').unlink()
except: pass

for ref in list(_texture_refs):
    if isinstance(ref,Path):
        try: ref.unlink()
        except: pass
print(OUT)
