from pathlib import Path
import math
import numpy as np
import cadquery as cq
import trimesh
from trimesh.visual.material import PBRMaterial

ROOT = Path('/mnt/data/w25_vertical_slice')
OUT = ROOT / 'public/models/w25'
OUT.mkdir(parents=True, exist_ok=True)

# -----------------------------------------------------------------------------
# Materials
# -----------------------------------------------------------------------------
def rgba(hexv, a=255):
    return [(hexv >> 16) & 255, (hexv >> 8) & 255, hexv & 255, a]

def mat(name, color, metallic=0.0, rough=0.6, alpha=1.0, emissive=None, double=False):
    return PBRMaterial(
        name=name,
        baseColorFactor=rgba(color, int(alpha * 255)),
        metallicFactor=metallic,
        roughnessFactor=rough,
        emissiveFactor=([c / 255 for c in rgba(emissive)[:3]] if emissive is not None else None),
        alphaMode='BLEND' if alpha < 1 else 'OPAQUE',
        doubleSided=double,
    )

M = {
    'walnut': mat('Deep Walnut', 0x4A2B1A, 0.0, 0.50),
    'walnut_dark': mat('Walnut Edge', 0x2B160C, 0.0, 0.44),
    'cognac': mat('Cognac Leather', 0xA75B2A, 0.0, 0.38),
    'cognac_dark': mat('Leather Piping', 0x6A3118, 0.0, 0.46),
    'cream': mat('Warm Cream Textile', 0xE8DECA, 0.0, 0.86),
    'linen': mat('Natural Linen', 0xDCCDB3, 0.0, 0.93, 1.0, double=True),
    'forest': mat('Forest Wool', 0x445244, 0.0, 0.87),
    'black': mat('Blackened Steel', 0x171B1D, 0.82, 0.30),
    'bronze': mat('Aged Bronze', 0x8B5D33, 0.72, 0.33),
    'gold': mat('Polished Gold', 0xD9AA3E, 0.95, 0.16),
    'felt': mat('Dark Brown Felt', 0x483026, 0.0, 0.94),
    'felt_band': mat('Dark Leather Hat Band', 0x1F1410, 0.0, 0.52),
    'lens': mat('Warm Brown Lens', 0x704823, 0.12, 0.16, 0.43, double=True),
    'bulb': mat('Warm Bulb', 0xFFF1C7, 0.0, 0.25, 1.0, emissive=0xFFD37A),
    'brass': mat('Antique Brass', 0xB5863F, 0.80, 0.26),
}

# -----------------------------------------------------------------------------
# Helpers
# -----------------------------------------------------------------------------
def apply_material(mesh, material):
    mesh.visual = trimesh.visual.TextureVisuals(material=material)
    return mesh

def T(x=0, y=0, z=0, rx=0, ry=0, rz=0, sx=1, sy=1, sz=1):
    m = trimesh.transformations.euler_matrix(rx, ry, rz, 'sxyz')
    m[:3, :3] = m[:3, :3] @ np.diag([sx, sy, sz])
    m[:3, 3] = [x, y, z]
    return m

def add(scene, name, mesh, material, transform=None):
    mesh = mesh.copy()
    apply_material(mesh, material)
    scene.add_geometry(mesh, node_name=name, geom_name=name, transform=transform if transform is not None else np.eye(4))

def cq_to_mesh(shape, linear=0.012, angular=0.12):
    # CadQuery uses Z-up. Convert to game Y-up: (x, y, z) -> (x, z, -y)
    verts, tris = shape.tessellate(linear, angular)
    v = np.array([[p.x, p.z, -p.y] for p in verts], dtype=float)
    f = np.array(tris, dtype=np.int64)
    mesh = trimesh.Trimesh(vertices=v, faces=f, process=True)
    mesh.remove_unreferenced_vertices()
    return mesh

def rounded_box(dx, dy, dz, r):
    solid = cq.Workplane('XY').box(dx, dy, dz, centered=(True, True, True))
    if r > 0:
        solid = solid.edges().fillet(min(r, dx * .24, dy * .24, dz * .24))
    return cq_to_mesh(solid.val())

def tapered_box(bottom_x, bottom_y, top_x, top_y, h, r=0.0):
    wp = (cq.Workplane('XY')
          .rect(bottom_x, bottom_y)
          .workplane(offset=h)
          .rect(top_x, top_y)
          .loft(combine=True))
    if r > 0:
        try:
            wp = wp.edges().fillet(r)
        except Exception:
            pass
    mesh = cq_to_mesh(wp.val())
    # loft is 0..h; center vertically in game Y
    mesh.apply_translation([0, -h / 2, 0])
    return mesh

def cyl(r, h, sections=48):
    return trimesh.creation.cylinder(radius=r, height=h, sections=sections)

def sphere(sub=3):
    return trimesh.creation.icosphere(subdivisions=sub, radius=1)

def torus(R, r, major=80, minor=16):
    return trimesh.creation.torus(major_radius=R, minor_radius=r, major_sections=major, minor_sections=minor)

def cylinder_between(a, b, r, sections=24):
    a = np.array(a, float); b = np.array(b, float)
    d = b - a; L = np.linalg.norm(d)
    mesh = cyl(r, L, sections)
    q = trimesh.geometry.align_vectors([0, 0, 1], d / L)
    q[:3, 3] = (a + b) / 2
    return mesh, q

def export(scene, filename, metadata=None):
    if metadata:
        scene.metadata.update(metadata)
    path = OUT / filename
    path.write_bytes(scene.export(file_type='glb'))
    # validation before overwrite is considered done
    check = trimesh.load(path, force='scene')
    bounds = check.bounds
    if not np.isfinite(bounds).all():
        raise RuntimeError(f'Non-finite bounds: {filename}')
    print(f'{filename}: {path.stat().st_size} bytes, bounds={np.round(bounds,3).tolist()}')

# -----------------------------------------------------------------------------
# 1. Warm cognac lodge reading chair: softened, upholstered, substantial.
# -----------------------------------------------------------------------------
s = trimesh.Scene()
# sculpted walnut feet / lower apron
for x in (-0.39, 0.39):
    for z in (-0.30, 0.30):
        foot = tapered_box(.115, .115, .085, .085, .30, .015)
        add(s, f'foot_{x}_{z}', foot, M['walnut_dark'], T(x, .15, z))
add(s, 'lower_apron_front', rounded_box(.84, .09, .12, .025), M['walnut_dark'], T(0, .31, -.33))
add(s, 'lower_apron_back', rounded_box(.84, .09, .10, .025), M['walnut_dark'], T(0, .31, .32))
# seat cushion as rounded CAD volume, slight forward overhang
add(s, 'seat_cushion', rounded_box(.94, .70, .24, .095), M['cognac'], T(0, .50, -.025))
# piping around seat front and side accents
add(s, 'seat_front_piping', rounded_box(.85, .026, .026, .011), M['cognac_dark'], T(0, .405, -.372))
for x in (-.455, .455):
    add(s, f'seat_side_piping_{x}', rounded_box(.025, .62, .022, .010), M['cognac_dark'], T(x, .405, -.02))
# back wood surround and upholstered cushion, leaned back together
back_frame = rounded_box(.88, .13, .87, .05)
add(s, 'back_frame', back_frame, M['walnut_dark'], T(0, .94, .31, rx=-.13))
back_cush = rounded_box(.76, .15, .72, .10)
add(s, 'back_cushion', back_cush, M['cognac'], T(0, .96, .20, rx=-.13))
# subtle button-tuft detail and a small lumbar cushion for a softer reading-chair silhouette
for x in (-.205, .205):
    for y in (.90, 1.08):
        add(s, f'back_button_{x}_{y}', sphere(2), M['cognac_dark'], T(x, y, .111, sx=.022, sy=.022, sz=.012))
lumbar = rounded_box(.62, .17, .20, .070)
add(s, 'lumbar_cushion', lumbar, M['cognac'], T(0, .705, .075, rx=-.05))
add(s, 'lumbar_piping', rounded_box(.54, .018, .018, .008), M['cognac_dark'], T(0, .632, -.018))
# curved/substantial arm pads on walnut rails
for x in (-.535, .535):
    add(s, f'arm_rail_{x}', rounded_box(.105, .58, .44, .035), M['walnut_dark'], T(x, .56, -.02))
    pad = rounded_box(.16, .64, .13, .055)
    add(s, f'arm_pad_{x}', pad, M['cognac'], T(x, .775, -.025))
    add(s, f'arm_piping_{x}', rounded_box(.112, .56, .018, .008), M['cognac_dark'], T(x, .833, -.025))
# brass tacks at outer lower back edge
for x in (-.425, .425):
    for y in (.69, .84, .99, 1.14):
        add(s, f'tack_{x}_{y}', sphere(2), M['brass'], T(x, y, .125, sx=.014, sy=.014, sz=.014))
export(s, 'w25-cognac-lodge-reading-chair.glb', {
    'asset_id': 'W25-C01', 'interaction': 'sit',
    'style': 'stylized realism; warm cognac leather; deep walnut lodge frame',
    'approval': 'production-asset-candidate-v2'
})

# -----------------------------------------------------------------------------
# 2. Live-edge deep walnut side table with black metal frame.
# -----------------------------------------------------------------------------
s = trimesh.Scene()
# Slab uses rounded CAD volume and wavy live-edge strips generated from a polyline tube approximation.
add(s, 'walnut_slab', rounded_box(1.05, .62, .13, .035), M['walnut'], T(0, .69, 0))
# irregular live edges as a sequence of dark rounded beads/segments along long sides
for side in (-1, 1):
    pts = []
    for i in range(13):
        z = -.29 + i * (.58 / 12)
        x = side * (.515 + .012 * math.sin(i * 1.7) + .006 * math.sin(i * .53))
        pts.append((x, .69, z))
    for i in range(len(pts)-1):
        me, tr = cylinder_between(pts[i], pts[i+1], .026, 18)
        add(s, f'live_edge_{side}_{i}', me, M['walnut_dark'], tr)
# restrained inset grain lines
for z in (-.19, -.07, .08, .20):
    add(s, f'grain_{z}', rounded_box(.90, .008, .012, .004), M['walnut_dark'], T(0, .758, z))
# black metal sled frame, deliberately slender
for x in (-.36, .36):
    for a, b, name in [
        ((x,.10,-.23),(x,.62,-.23),'front'),
        ((x,.10,.23),(x,.62,.23),'back'),
        ((x,.10,-.23),(x,.10,.23),'floor')]:
        me, tr = cylinder_between(a, b, .020, 18); add(s, f'leg_{x}_{name}', me, M['black'], tr)
me, tr = cylinder_between((-.36,.36,0),(.36,.36,0),.018,18); add(s,'cross_brace',me,M['black'],tr)
export(s, 'w25-live-edge-side-table.glb', {
    'asset_id':'W25-C02', 'interaction':'surface', 'approval':'production-asset-candidate-v2'
})

# -----------------------------------------------------------------------------
# 3. Linen + bronze table lamp, proper table-lamp proportions.
# -----------------------------------------------------------------------------
s = trimesh.Scene()
# stepped bronze base, 0.72 m overall scale
for r, h, y in [(.19,.045,.0225),(.15,.045,.065),(.095,.055,.115)]:
    add(s, f'base_{r}', cyl(r,h,64), M['bronze'], T(0,y,0,rx=math.pi/2))
add(s, 'stem', cyl(.028,.34,40), M['bronze'], T(0,.31,0,rx=math.pi/2))
add(s, 'neck', sphere(3), M['bronze'], T(0,.49,0,sx=.052,sy=.052,sz=.052))
# shade: wider lower opening, narrower upper opening, thin double-sided linen
prof = np.array([[.29,-.18],[.175,.18]])
shade = trimesh.creation.revolve(prof, sections=96)
add(s, 'linen_shade', shade, M['linen'], T(0,.67,0,rx=math.pi/2))
# subtle bronze top finial
add(s, 'shade_top_cap', cyl(.050,.018,40), M['bronze'], T(0,.855,0,rx=math.pi/2))
add(s, 'finial_stem', cyl(.012,.080,24), M['bronze'], T(0,.890,0,rx=math.pi/2))
add(s, 'finial', sphere(2), M['bronze'], T(0,.940,0,sx=.027,sy=.038,sz=.027))
add(s, 'bulb', sphere(3), M['bulb'], T(0,.54,0,sx=.055,sy=.075,sz=.055))
export(s, 'w25-linen-bronze-table-lamp.glb', {
    'asset_id':'W25-C03', 'interaction':'toggle_light', 'approval':'production-asset-candidate-v2'
})

# -----------------------------------------------------------------------------
# 4. Deep walnut upholstered bed with softened bedding and inset headboard.
# -----------------------------------------------------------------------------
s = trimesh.Scene()
# frame rails / platform
add(s, 'platform', rounded_box(2.08, 1.57, .17, .045), M['walnut'], T(0,.28,0))
# feet with subtle taper
for x in (-.91,.91):
    for z in (-.67,.67):
        foot=tapered_box(.13,.13,.10,.10,.38,.018); add(s,f'foot_{x}_{z}',foot,M['walnut_dark'],T(x,.19,z))
# mattress, blanket and pillows as rounded CAD volumes
add(s, 'mattress', rounded_box(1.93,1.43,.27,.105), M['cream'], T(0,.49,-.015))
add(s, 'duvet', rounded_box(1.89,1.02,.105,.045), M['forest'], T(0,.685,-.13))
# folded throw at foot for lodge detail
throw = rounded_box(1.80,.30,.055,.025)
add(s,'foot_throw',throw,M['cognac'],T(0,.765,-.555))
# deep walnut headboard surround and inset linen panel
add(s, 'headboard_outer', rounded_box(2.08,.16,1.25,.055), M['walnut_dark'], T(0,1.02,.715))
add(s, 'headboard_inner', rounded_box(1.82,.10,.88,.085), M['linen'], T(0,1.06,.625))
# upholstered tuft buttons / shallow channels
for x in (-.55,0,.55):
    for y in (.86,1.10,1.34):
        add(s,f'tuft_{x}_{y}',sphere(2),M['cognac_dark'],T(x,y,.567,sx=.024,sy=.024,sz=.014))
# properly pillow-like rounded rectangles angled toward headboard
for x in (-.46,.46):
    p = rounded_box(.72,.40,.17,.075)
    add(s,f'pillow_{x}',p,M['cream'],T(x,.78,.405,rx=-.10))
export(s, 'w25-deep-walnut-upholstered-bed.glb', {
    'asset_id':'W25-C04', 'interaction':'place_rotate', 'approval':'production-asset-candidate-v2'
})

# -----------------------------------------------------------------------------
# 5. Dark brown ranch cowboy hat: curved brim + tapered oval crown.
# -----------------------------------------------------------------------------
def curved_oval_brim(a=.52,b=.40,thick=.035,nr=9,nt=128):
    vertices=[]
    # center + rings, top and bottom surfaces
    for layer in (-1,1):
        sign=layer
        for ri in range(nr+1):
            r=ri/nr
            if ri==0:
                vertices.append([0, sign*thick/2, 0])
                continue
            for j in range(nt):
                th=2*math.pi*j/nt
                x=a*r*math.cos(th)
                z=b*r*math.sin(th)
                # ranch brim: sides curl upward, front/back dip gently
                curl=.070*(r**1.7)*math.cos(2*th)
                # front center slightly lower than back for attitude
                fore=-.016*(r**2)*math.sin(th)
                y=curl+fore+sign*thick/2
                vertices.append([x,y,z])
    # indexing helper
    per=1+nr*nt
    def idx(layer,ri,j=0):
        off=0 if layer==0 else per
        if ri==0: return off
        return off+1+(ri-1)*nt+(j%nt)
    faces=[]
    # top and bottom faces
    for layer in (0,1):
        flip=(layer==0)
        for j in range(nt):
            tri=[idx(layer,0),idx(layer,1,j),idx(layer,1,j+1)]
            faces.append(tri[::-1] if flip else tri)
        for ri in range(1,nr):
            for j in range(nt):
                a0=idx(layer,ri,j); a1=idx(layer,ri,j+1); b0=idx(layer,ri+1,j); b1=idx(layer,ri+1,j+1)
                q=[[a0,b0,b1],[a0,b1,a1]]
                for tri in q: faces.append(tri[::-1] if flip else tri)
    # outer rim walls
    for j in range(nt):
        b0=idx(0,nr,j); b1=idx(0,nr,j+1); t0=idx(1,nr,j); t1=idx(1,nr,j+1)
        faces += [[b0,b1,t1],[b0,t1,t0]]
    return trimesh.Trimesh(vertices=np.array(vertices), faces=np.array(faces), process=True)

s=trimesh.Scene()
add(s,'curved_felt_brim',curved_oval_brim(),M['felt'],T(0,0,0))
# crown via tapered rounded-ish CAD loft (elliptical sections)
wp=(cq.Workplane('XY')
    .ellipse(.30,.245)
    .workplane(offset=.19).ellipse(.285,.225)
    .workplane(offset=.18).ellipse(.235,.195)
    .loft(combine=True))
crown=cq_to_mesh(wp.val(),.008,.08)
# center crown vertically; bottom sits at brim
crown.apply_translation([0,.018,0])
add(s,'tapered_crown',crown,M['felt'])
# crown crease: dark recessed visual line plus two shallow side dents
crease = rounded_box(.075,.34,.025,.010)
add(s,'top_crease',crease,M['felt_band'],T(0,.368,-.015,rz=math.pi/2))
for x in (-.17,.17):
    dent=rounded_box(.055,.18,.024,.010); add(s,f'side_crease_{x}',dent,M['felt_band'],T(x,.255,-.015,rz=.15*x))
# leather band follows crown as oval approximate: two scaled torus loops for thickness
band=torus(.27,.014,96,12)
add(s,'leather_band',band,M['felt_band'],T(0,.105,0,rx=math.pi/2,sx=1.0,sy=1.0,sz=.82))
add(s,'small_brass_concho',sphere(3),M['brass'],T(.277,.105,-.022,sx=.030,sy=.030,sz=.015))
export(s,'w25-dark-brown-ranch-cowboy-hat.glb',{
    'asset_id':'W25-A01','anchor':'head','hair_behavior':'compress_or_tuck_preserve_identity',
    'approval':'production-asset-candidate-v2'
})

# -----------------------------------------------------------------------------
# 6. Gold + warm brown aviators: unmistakable teardrop lens geometry.
#    Face plane is game X/Y with depth along game Z.
# -----------------------------------------------------------------------------
def polygon_extrude_xz(points, depth):
    # CadQuery XZ plane normal maps to game Z after the Z-up -> Y-up conversion.
    wp = cq.Workplane('XZ').polyline(points).close().extrude(depth/2, both=True)
    return cq_to_mesh(wp.val(), .004, .06)

def teardrop_points(scale=1.0):
    # Local X/Y points, smoothed as a periodic spline for an unmistakable aviator silhouette.
    from scipy.interpolate import splprep, splev
    raw=np.array([(-.13,.105),(-.055,.140),(.055,.140),(.145,.105),(.188,.040),(.178,-.050),(.135,-.130),(.070,-.190),(0,-.220),(-.070,-.188),(-.128,-.120),(-.170,-.045),(-.170,.048)],dtype=float)
    tck,_=splprep([raw[:,0],raw[:,1]],s=0.0007,per=True,k=3)
    u=np.linspace(0,1,128,endpoint=False)
    x,y=splev(u,tck)
    return [(float(a*scale),float(b*scale)) for a,b in zip(x,y)]

s=trimesh.Scene()
outer=teardrop_points(1.0); inner=teardrop_points(.88)
lensmesh=polygon_extrude_xz(inner,.010)
for side in (-1,1):
    cx=side*.215
    lm=lensmesh.copy(); lm.apply_translation([cx,0,0]); add(s,f'lens_{side}',lm,M['lens'])
    pts=[(cx+x,y,.006) for x,y in outer]
    for i in range(len(pts)):
        a=pts[i]; b=pts[(i+1)%len(pts)]; me,tr=cylinder_between(a,b,.0105,20); add(s,f'rim_{side}_{i}',me,M['gold'],tr)
# bridge, brow bridge, upper bar and temples extend rearward along +Z
for a,b,name,r in [
    ((-.055,.060,.008),(.055,.060,.008),'bridge',.0085),
    ((-.060,.115,.010),(.060,.115,.010),'brow_bridge',.0065),
    ((-.405,.105,.012),(.405,.105,.012),'top_bar',.0060),
    ((-.395,.055,.012),(-.64,.040,.145),'left_temple',.0080),
    ((.395,.055,.012),(.64,.040,.145),'right_temple',.0080),
]:
    me,tr=cylinder_between(a,b,r,16); add(s,name,me,M['gold'],tr)
padmat=mat('Nose Pads',0xEAD7BB,0.0,.55,.55)
for x in (-.045,.045): add(s,f'nose_pad_{x}',sphere(2),padmat,T(x,-.020,.020,sx=.018,sy=.027,sz=.010))
export(s,'w25-gold-brown-aviators.glb',{
    'asset_id':'W25-A02','anchor':'nose_bridge_eye_line_temples','approval':'production-asset-candidate-v2'
})

# -----------------------------------------------------------------------------
# 7. Medium smooth gold hoops, polished with posts/clasps.
# -----------------------------------------------------------------------------
s=trimesh.Scene()
for x in (-.24,.24):
    add(s,f'hoop_{x}',torus(.128,.013,96,18),M['gold'],T(x,-.02,0))
    me,tr=cylinder_between((x,.105,.0),(x,.165,.018),.009,18); add(s,f'post_{x}',me,M['gold'],tr)
    add(s,f'clasp_{x}',sphere(2),M['gold'],T(x,.171,.020,sx=.018,sy=.018,sz=.012))
export(s,'w25-smooth-gold-hoops.glb',{
    'asset_id':'W25-A03','anchor':'left_right_earlobes','approval':'production-asset-candidate-v2'
})

print('W25 v2 gold assets rebuilt successfully.')
