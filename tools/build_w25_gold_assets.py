from pathlib import Path
import numpy as np
import trimesh
from trimesh.visual.material import PBRMaterial

OUT = Path('/mnt/data/w25_vertical_slice/public/models/w25')
OUT.mkdir(parents=True, exist_ok=True)

def rgba(hexv, a=255):
    return [(hexv>>16)&255,(hexv>>8)&255,hexv&255,a]

def mat(name, color, metallic=0.0, rough=0.6, alpha=1.0, emissive=None, double=False):
    return PBRMaterial(name=name, baseColorFactor=rgba(color, int(alpha*255)), metallicFactor=metallic,
                       roughnessFactor=rough, emissiveFactor=([c/255 for c in rgba(emissive)[:3]] if emissive is not None else None),
                       alphaMode='BLEND' if alpha < 1 else 'OPAQUE', doubleSided=double)

M = {
 'walnut': mat('Deep Walnut',0x4A2C1B,0.0,0.56),
 'walnut2': mat('Walnut Edge',0x2E1A10,0.0,0.5),
 'cognac': mat('Cognac Leather',0xA85C28,0.0,0.42),
 'cognac_dark': mat('Leather Seam',0x6D3419,0.0,0.48),
 'cream': mat('Warm Cream Textile',0xE8DDC7,0.0,0.88),
 'linen': mat('Natural Linen',0xD7C7A9,0.0,0.94,1.0,double=True),
 'black': mat('Blackened Steel',0x1C2022,0.7,0.34),
 'bronze': mat('Aged Bronze',0x8A5B2F,0.75,0.34),
 'gold': mat('Polished Gold',0xD8A83A,0.92,0.18),
 'felt': mat('Dark Brown Felt',0x4A3124,0.0,0.93),
 'felt_band': mat('Leather Hat Band',0x1E1410,0.0,0.5),
 'lens': mat('Warm Brown Lens',0x6D431F,0.15,0.12,0.48,double=True),
 'pearl': mat('Warm Bulb',0xFFF0C0,0.0,0.25,1.0,emissive=0xFFD37A),
}

def apply_material(mesh, material):
    mesh.visual = trimesh.visual.TextureVisuals(material=material)
    return mesh

def T(x=0,y=0,z=0, rx=0,ry=0,rz=0, sx=1,sy=1,sz=1):
    m = trimesh.transformations.euler_matrix(rx,ry,rz,'sxyz')
    m[:3,:3] = m[:3,:3] @ np.diag([sx,sy,sz])
    m[:3,3] = [x,y,z]
    return m

def add(scene, name, mesh, material, transform=None):
    mesh = mesh.copy()
    apply_material(mesh, material)
    scene.add_geometry(mesh, node_name=name, geom_name=name, transform=transform if transform is not None else np.eye(4))

def box(extents): return trimesh.creation.box(extents=extents)
def sphere(sub=3): return trimesh.creation.icosphere(subdivisions=sub, radius=1)
def cyl(r,h,sections=48): return trimesh.creation.cylinder(radius=r, height=h, sections=sections)
def torus(R,r,major=64,minor=16): return trimesh.creation.torus(major_radius=R, minor_radius=r, major_sections=major, minor_sections=minor)

def cylinder_between(a,b,r,sections=24):
    a=np.array(a,float); b=np.array(b,float); d=b-a; L=np.linalg.norm(d)
    mesh=cyl(r,L,sections)
    q=trimesh.geometry.align_vectors([0,0,1],d/L)
    q[:3,3]=(a+b)/2
    return mesh,q

def export(scene, filename):
    path=OUT/filename
    data=scene.export(file_type='glb')
    path.write_bytes(data)
    print(filename, len(data))

# 1. COGNAC LODGE READING CHAIR
s=trimesh.Scene()
# wooden plinth/feet
for x in (-0.38,0.38):
  for z in (-0.31,0.31):
    add(s,f'walnut_foot_{x}_{z}',box([0.10,0.26,0.10]),M['walnut2'],T(x,.13,z))
add(s,'walnut_base',box([0.88,0.10,0.76]),M['walnut'],T(0,.30,0))
# seat cushion, rounded via scaled icosphere
add(s,'seat_cushion',sphere(3),M['cognac'],T(0,.48,-.02,sx=.47,sy=.15,sz=.39))
add(s,'seat_front_roll',sphere(2),M['cognac_dark'],T(0,.46,-.37,sx=.44,sy=.035,sz=.025))
# back frame and cushion
add(s,'back_frame',box([.82,.82,.11]),M['walnut2'],T(0,.87,.32,rx=-.12))
add(s,'back_cushion',sphere(3),M['cognac'],T(0,.90,.25,rx=-.12,sx=.45,sy=.43,sz=.15))
# subtle vertical channels
for x in (-.22,0,.22): add(s,f'back_channel_{x}',box([.018,.52,.018]),M['cognac_dark'],T(x,.91,.105,rx=-.12))
# arms
for x in (-.52,.52):
    add(s,f'arm_support_{x}',box([.10,.42,.58]),M['walnut2'],T(x,.49,.00))
    add(s,f'arm_pad_{x}',sphere(2),M['cognac'],T(x,.70,-.02,sx=.095,sy=.10,sz=.36))
# decorative brass tack heads
brass=mat('Brass Tack',0xB88743,.78,.28)
for x in (-.41,.41):
  for y in (.68,.84,1.00):
    add(s,f'tack_{x}_{y}',sphere(1),brass,T(x,y,.105,sx=.014,sy=.014,sz=.014))
s.metadata.update({'asset_id':'W25-CABIN-CHAIR','interaction':'sit','style':'stylized-realism upscale rustic lodge'})
export(s,'w25-cognac-lodge-reading-chair.glb')

# 2. LIVE EDGE SIDE TABLE
s=trimesh.Scene()
add(s,'walnut_slab',box([1.04,.12,.62]),M['walnut'],T(0,.67,0))
# live-edge lips as darker irregular-looking side rails
for x in (-.49,.49): add(s,f'live_edge_{x}',sphere(2),M['walnut2'],T(x,.67,0,sx=.045,sy=.07,sz=.31))
# wood grain inlay strips
for z in (-.18,-.06,.07,.20): add(s,f'grain_{z}',box([.91,.006,.012]),M['walnut2'],T(0,.735,z))
# black steel sled legs
for x in (-.36,.36):
  for a,b,name in [((x,.08,-.24),(x,.62,-.24),'front'),((x,.08,.24),(x,.62,.24),'back'),((x,.08,-.24),(x,.08,.24),'floor')]:
    me,tr=cylinder_between(a,b,.026,16); add(s,f'leg_{x}_{name}',me,M['black'],tr)
# cross brace
me,tr=cylinder_between((-.36,.36,0),(.36,.36,0),.022,16);add(s,'cross_brace',me,M['black'],tr)
s.metadata.update({'asset_id':'W25-CABIN-SIDE-TABLE','interaction':'surface','style':'deep walnut + blackened steel'})
export(s,'w25-live-edge-side-table.glb')

# 3. LINEN + BRONZE TABLE LAMP
s=trimesh.Scene()
add(s,'bronze_base',cyl(.19,.07,48),M['bronze'],T(0,.035,0,rx=np.pi/2)) # orient z-axis cylinder to y
# careful: rotation makes axis y but translation applies after scale in transform
add(s,'bronze_stem',cyl(.028,.55,32),M['bronze'],T(0,.34,0,rx=np.pi/2))
add(s,'bronze_neck',sphere(2),M['bronze'],T(0,.62,0,sx=.06,sy=.06,sz=.06))
# shade via revolve profile around Y? revolve creates around Y? make around Z and rotate x
profile=np.array([[.30,-.24],[.18,.24]])
shade=trimesh.creation.revolve(profile,sections=64)
add(s,'linen_shade',shade,M['linen'],T(0,.83,0,rx=np.pi/2))
add(s,'bulb',sphere(2),M['pearl'],T(0,.73,0,sx=.065,sy=.09,sz=.065))
s.metadata.update({'asset_id':'W25-CABIN-LAMP','interaction':'toggle_light','light_color':'#FFD18A','style':'linen shade + aged bronze'})
export(s,'w25-linen-bronze-table-lamp.glb')

# 4. DEEP WALNUT UPHOLSTERED BED
s=trimesh.Scene()
# base rails
add(s,'bed_platform',box([2.05,.16,1.55]),M['walnut'],T(0,.27,0))
for x in (-.92,.92):
  for z in (-.67,.67): add(s,f'bed_foot_{x}_{z}',box([.11,.42,.11]),M['walnut2'],T(x,.21,z))
# mattress and bedding
add(s,'mattress',sphere(3),M['cream'],T(0,.49,-.02,sx=.97,sy=.17,sz=.70))
blanket=mat('Forest Blanket',0x465342,0.0,.88)
add(s,'blanket',box([1.92,.055,.70]),blanket,T(0,.67,.28))
# headboard wood surround + upholstery
add(s,'headboard_outer',box([2.08,1.30,.13]),M['walnut2'],T(0,1.03,.72))
add(s,'headboard_inner',sphere(3),M['linen'],T(0,1.05,.64,sx=.88,sy=.48,sz=.07))
# tuft buttons
for x in (-.55,0,.55):
  for y in (.82,1.08,1.32): add(s,f'tuft_{x}_{y}',sphere(1),M['cognac_dark'],T(x,y,.568,sx=.025,sy=.025,sz=.018))
# pillows
for x in (-.46,.46): add(s,f'pillow_{x}',sphere(3),M['cream'],T(x,.73,-.40,rx=.12,sx=.40,sy=.12,sz=.22))
s.metadata.update({'asset_id':'W25-CABIN-BED','interaction':'place_rotate','style':'deep walnut + upholstered headboard'})
export(s,'w25-deep-walnut-upholstered-bed.glb')

# 5. DARK BROWN RANCH COWBOY HAT
s=trimesh.Scene()
# brim, gently elliptical and substantial
add(s,'felt_brim',cyl(.48,.045,96),M['felt'],T(0,0,0,rx=np.pi/2,sx=1.12,sy=1,sz=.86))
# crown made from revolved tapered profile around Z then rotate to Y
prof=np.array([[.30,-.18],[.31,-.10],[.28,.10],[.23,.22]])
crown=trimesh.creation.revolve(prof,sections=96)
add(s,'felt_crown',crown,M['felt'],T(0,.20,0,rx=np.pi/2))
# central crease suggestion using dark inset capsule-like strip
add(s,'crown_crease',sphere(2),M['felt_band'],T(0,.39,-.03,sx=.08,sy=.018,sz=.20))
# leather band
add(s,'leather_band',torus(.285,.018,80,12),M['felt_band'],T(0,.10,0,rx=np.pi/2,sx=1,sy=1,sz=.84))
# small bronze concho
add(s,'hat_concho',sphere(2),M['bronze'],T(.29,.105,-.03,sx=.035,sy=.035,sz=.018))
s.metadata.update({'asset_id':'W25-COS-HAT','anchor':'head','hair_behavior':'compress_or_tuck_preserve_identity'})
export(s,'w25-dark-brown-ranch-cowboy-hat.glb')

# 6. GOLD + BROWN AVIATORS
s=trimesh.Scene()
for x in (-.205,.205):
  add(s,f'frame_{x}',torus(.185,.012,80,12),M['gold'],T(x,0,0,sx=1.0,sy=.82,sz=1))
  add(s,f'lens_{x}',cyl(.172,.006,64),M['lens'],T(x,0,.006,sx=1.0,sy=.82,sz=1))
# bridge + top bar + temples
for a,b,name,r in [((-.055,.035,0),(.055,.035,0),'bridge',.009),((-.39,.09,.01),(.39,.09,.01),'topbar',.007),((-.39,.02,0),(-.61,.04,.10),'left_temple',.009),((.39,.02,0),(.61,.04,.10),'right_temple',.009)]:
    me,tr=cylinder_between(a,b,r,18); add(s,name,me,M['gold'],tr)
# nose pads
for x in (-.045,.045): add(s,f'nosepad_{x}',sphere(1),mat('Nose Pad',0xE9D5B5,.0,.5,.6),T(x,-.02,.025,sx=.018,sy=.028,sz=.010))
s.metadata.update({'asset_id':'W25-COS-GLASSES','anchor':'nose_bridge_eye_line_temples','lens':'warm brown PBR alpha'})
export(s,'w25-gold-brown-aviators.glb')

# 7. SMOOTH GOLD HOOPS
s=trimesh.Scene()
for x in (-.25,.25):
    add(s,f'hoop_{x}',torus(.13,.014,72,14),M['gold'],T(x,-.02,0))
    add(s,f'post_{x}',cyl(.012,.045,18),M['gold'],T(x,.135,.015,rx=np.pi/2))
s.metadata.update({'asset_id':'W25-COS-EARRINGS','anchor':'left_right_earlobes','style':'smooth polished gold'})
export(s,'w25-smooth-gold-hoops.glb')

print('done', OUT)
