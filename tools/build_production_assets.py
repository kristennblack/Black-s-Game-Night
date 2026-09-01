from __future__ import annotations
import math
from pathlib import Path
import numpy as np
import trimesh
from trimesh.visual.material import PBRMaterial
from trimesh.visual.texture import TextureVisuals
from PIL import Image, ImageDraw, ImageFilter

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'public' / 'models'


def rgba(hex_value: int, alpha=1.0):
    return [((hex_value >> 16) & 255) / 255.0, ((hex_value >> 8) & 255) / 255.0, (hex_value & 255) / 255.0, alpha]


def material(name, color, roughness=.75, metallic=0.0, emissive=None):
    return PBRMaterial(
        name=name,
        baseColorFactor=rgba(color),
        roughnessFactor=roughness,
        metallicFactor=metallic,
        emissiveFactor=rgba(emissive, 1.0)[:3] if emissive is not None else None,
    )




def john_face_texture():
    """Create John's curved face texture from the locked stylized turnaround."""
    ref = Image.open(ROOT / 'public' / 'approved-character-turnarounds' / 'john-approved-turnaround.png').convert('RGB')
    crop = ref.crop((86, 285, 226, 448)).resize((384, 448), Image.Resampling.LANCZOS)
    alpha = Image.new('L', crop.size, 0)
    d = ImageDraw.Draw(alpha)
    d.ellipse((22, 5, crop.size[0]-22, crop.size[1]-5), fill=255)
    alpha = alpha.filter(ImageFilter.GaussianBlur(16))
    rgba_img = crop.convert('RGBA')
    rgba_img.putalpha(alpha)
    return rgba_img


def gunner_face_texture():
    """Create a masked front-face fur texture from the approved Gunner art."""
    ref = Image.open(ROOT / 'public' / 'characters3d' / 'gunner.png').convert('RGBA')
    crop = ref.crop((22, 0, 216, 175)).resize((420, 360), Image.Resampling.LANCZOS)
    # Preserve original alpha, then feather the outside so the patch blends into 3D fur.
    src_alpha = crop.getchannel('A')
    mask = Image.new('L', crop.size, 0)
    d = ImageDraw.Draw(mask)
    d.ellipse((16, 0, crop.size[0]-16, crop.size[1]-2), fill=255)
    mask = mask.filter(ImageFilter.GaussianBlur(14))
    import PIL.ImageChops as ImageChops
    alpha = ImageChops.multiply(src_alpha, mask)
    crop.putalpha(alpha)
    return crop


def curved_dog_face_patch(rx, ry, rz, texture, cols=18, rows=18):
    verts=[]; uvs=[]; faces=[]
    x0,x1=-0.86,0.86; y0,y1=-0.74,0.68
    for j in range(rows+1):
        v=j/rows; yn=y0+(y1-y0)*v
        for i in range(cols+1):
            u=i/cols; xn=x0+(x1-x0)*u
            q=max(0.025, 1.0-xn*xn-yn*yn)
            z=-rz*math.sqrt(q)-0.006
            verts.append([rx*xn, ry*yn, z]); uvs.append([u,1.0-v])
    stride=cols+1
    for j in range(rows):
        for i in range(cols):
            a=j*stride+i; b=a+1; c=a+stride; d=c+1
            faces.append([a,c,b]); faces.append([b,c,d])
    mesh=trimesh.Trimesh(vertices=np.asarray(verts),faces=np.asarray(faces),process=False)
    mat=PBRMaterial(name='Gunner_FacePhoto',baseColorTexture=texture,baseColorFactor=[1,1,1,1],roughnessFactor=.94,metallicFactor=0.0,doubleSided=False,alphaMode='BLEND')
    mesh.visual=TextureVisuals(uv=np.asarray(uvs),material=mat)
    return mesh


def curved_face_patch(rx, ry, rz, texture, cols=18, rows=22):
    """A UV-mapped curved patch that conforms to the front of an ellipsoid head."""
    verts=[]; uvs=[]; faces=[]
    # Keep the patch inside the facial oval, leaving ears/hair/back as actual geometry.
    x0,x1=-0.78,0.78; y0,y1=-0.73,0.68
    for j in range(rows+1):
        v=j/rows
        yn=y0+(y1-y0)*v
        for i in range(cols+1):
            u=i/cols
            xn=x0+(x1-x0)*u
            q=max(0.03, 1.0-xn*xn-yn*yn)
            z=-rz*math.sqrt(q)-0.004
            verts.append([rx*xn, ry*yn, z])
            # Texture top maps to higher Y on the face.
            uvs.append([u,1.0-v])
    stride=cols+1
    for j in range(rows):
        for i in range(cols):
            a=j*stride+i; b=a+1; c=a+stride; d=c+1
            faces.append([a,c,b]); faces.append([b,c,d])
    mesh=trimesh.Trimesh(vertices=np.asarray(verts),faces=np.asarray(faces),process=False)
    mat=PBRMaterial(name='John_FacePhoto',baseColorTexture=texture,baseColorFactor=[1,1,1,1],roughnessFactor=.78,metallicFactor=0.0,doubleSided=False,alphaMode='BLEND')
    mesh.visual=TextureVisuals(uv=np.asarray(uvs),material=mat)
    return mesh

def assign(mesh, mat):
    mesh.visual = TextureVisuals(material=mat)
    return mesh


def T(x=0, y=0, z=0):
    return trimesh.transformations.translation_matrix([x, y, z])


def R(angle, axis):
    return trimesh.transformations.rotation_matrix(angle, axis)


def S(x=1, y=1, z=1):
    return np.diag([x, y, z, 1.0])


def compose(*mats):
    out = np.eye(4)
    for m in mats:
        out = out @ m
    return out


def ellipsoid(rx, ry, rz, mat, subdivisions=2):
    m = trimesh.creation.icosphere(subdivisions=subdivisions, radius=1.0)
    m.apply_scale([rx, ry, rz])
    return assign(m, mat)


def capsule_y(radius, length, mat, sections=16):
    m = trimesh.creation.capsule(radius=radius, height=max(.001, length - 2 * radius), count=[sections, max(8, sections // 2)])
    m.apply_transform(R(math.pi / 2, [1, 0, 0]))
    return assign(m, mat)


def cylinder_y(radius, height, mat, sections=20):
    m = trimesh.creation.cylinder(radius=radius, height=height, sections=sections)
    m.apply_transform(R(math.pi / 2, [1, 0, 0]))
    return assign(m, mat)


def box(extents, mat):
    return assign(trimesh.creation.box(extents=extents), mat)


def torus(major, minor, mat, major_sections=28, minor_sections=10):
    return assign(trimesh.creation.torus(major_radius=major, minor_radius=minor, major_sections=major_sections, minor_sections=minor_sections), mat)


def add_joint(scene, name, parent, translation=(0, 0, 0), rotation=None, metadata=None):
    matrix = T(*translation)
    if rotation:
        rx, ry, rz = rotation
        matrix = matrix @ R(rx, [1, 0, 0]) @ R(ry, [0, 1, 0]) @ R(rz, [0, 0, 1])
    scene.graph.update(frame_to=name, frame_from=parent, matrix=matrix, metadata=metadata or {})


def add_geom(scene, geom, name, parent, transform=None, metadata=None):
    scene.add_geometry(geom, node_name=name, geom_name=name + '_geo', parent_node_name=parent,
                       transform=np.eye(4) if transform is None else transform, metadata=metadata or {})


def export_scene(scene, path):
    path.parent.mkdir(parents=True, exist_ok=True)
    data = scene.export(file_type='glb')
    path.write_bytes(data)
    loaded = trimesh.load(path, force='scene')
    bounds = loaded.bounds
    extents = loaded.extents
    print(f'WROTE {path.relative_to(ROOT)}  {len(data)/1024:.1f} KiB  extents={extents.round(3)} boundsY={bounds[:,1].round(3)} nodes={len(loaded.graph.nodes)}')


def build_john():
    scene = trimesh.Scene(base_frame='world')
    # Colors sampled/approximated from the approved John references.
    skin = material('John_Skin', 0xc3906f, .72, 0.0)
    skin_shadow = material('John_SkinShadow', 0xa87358, .78, 0.0)
    hair = material('John_Hair', 0x241a15, .92, 0.0)
    beard = material('John_Beard', 0x33231b, .96, 0.0)
    shirt_red = material('John_Plaid_Red', 0x6d2c25, .86, 0.0)
    shirt_dark = material('John_Plaid_Dark', 0x1e2423, .9, 0.0)
    shirt_line = material('John_Plaid_Line', 0xa66a3f, .82, 0.0)
    denim = material('John_Denim', 0x3a5672, .9, 0.0)
    denim_dark = material('John_DenimShadow', 0x283c50, .92, 0.0)
    leather = material('John_BootLeather', 0x503723, .8, 0.0)
    leather_dark = material('John_DarkLeather', 0x2f2118, .85, 0.0)
    metal = material('John_BuckleMetal', 0xb88c4b, .38, .65)
    eye_white = material('Eye_White', 0xe9e7df, .45, 0.0)
    iris = material('Eye_Brown', 0x4a3427, .4, 0.0)
    pupil = material('Eye_Pupil', 0x151311, .34, 0.0)
    lip = material('Mouth', 0x75443f, .72, 0.0)

    add_joint(scene, 'JohnRig', 'world', (0, .143, 0), metadata={'rigKind': 'authored-jointed-human', 'characterId': 'john'})
    add_joint(scene, 'hips', 'JohnRig', (0, .93, 0))
    add_joint(scene, 'upperBody', 'JohnRig', (0, 1.08, 0))
    add_joint(scene, 'head', 'upperBody', (0, .60, 0))
    add_joint(scene, 'face', 'head', (0, 0, 0))

    # Pelvis / belt
    add_geom(scene, ellipsoid(.285, .17, .205, denim, 3), 'pelvisMesh', 'hips', T(0, 0, 0))
    add_geom(scene, box([.49, .065, .25], leather_dark), 'belt', 'hips', T(0, .14, 0))
    add_geom(scene, box([.082, .075, .025], metal), 'beltBuckle', 'hips', T(0, .14, -.14))

    # Torso is tapered visually using overlapping ellipsoids rather than a single primitive.
    add_geom(scene, ellipsoid(.34, .41, .235, shirt_red, 3), 'torso', 'upperBody', T(0, .18, 0))
    add_geom(scene, ellipsoid(.31, .20, .22, shirt_red, 2), 'lowerTorso', 'upperBody', T(0, -.08, 0))
    add_geom(scene, cylinder_y(.068, .13, skin, 18), 'neck', 'upperBody', T(0, .51, 0))
    # Collar, chest pockets and seam breaks help the shirt read as clothing instead of a torso-colored shell.
    add_geom(scene, box([.17,.045,.028], shirt_dark), 'leftCollar', 'upperBody', T(-.095,.49,-.225) @ R(-.28,[0,0,1]))
    add_geom(scene, box([.17,.045,.028], shirt_dark), 'rightCollar', 'upperBody', T(.095,.49,-.225) @ R(.28,[0,0,1]))
    for sx in (-.16,.16):
        add_geom(scene, box([.17,.14,.022], shirt_red), f'chestPocket{sx}', 'upperBody', T(sx,.25,-.242))
        add_geom(scene, box([.18,.022,.024], shirt_dark), f'chestPocketFlap{sx}', 'upperBody', T(sx,.31,-.248))
    add_geom(scene, box([.022,.66,.022], shirt_dark), 'shirtPlacket', 'upperBody', T(0,.16,-.244))

    # Plaid is real geometry wrapping front/back and sides so rear views remain honest.
    for z in (-.238, .238):
        for x in (-.23, -.08, .08, .23):
            add_geom(scene, box([.025, .63, .012], shirt_dark), f'plaidV_{z}_{x}', 'upperBody', T(x, .16, z))
        for y in (-.05, .12, .29, .45):
            add_geom(scene, box([.59, .022, .012], shirt_dark), f'plaidH_{z}_{y}', 'upperBody', T(0, y, z))
        for x in (-.16, .16):
            add_geom(scene, box([.012, .63, .008], shirt_line), f'plaidFine_{z}_{x}', 'upperBody', T(x, .16, z + (-.008 if z < 0 else .008)))
    for x in (-.338, .338):
        for y in (.0, .18, .36):
            add_geom(scene, box([.012, .022, .40], shirt_dark), f'plaidSide_{x}_{y}', 'upperBody', T(x, y, 0))

    # Head and facial structure.
    add_geom(scene, ellipsoid(.205, .255, .205, skin, 3), 'headMesh', 'head', T(0, .03, 0))
    # Curved approved-reference face texture. It follows the head surface instead of
    # facing the camera, so John remains honest from the side and rear.
    add_geom(scene, curved_face_patch(.204, .245, .207, john_face_texture()), 'approvedFacePatch', 'head', T(0, .025, 0))
    add_geom(scene, ellipsoid(.17, .13, .18, hair, 3), 'hairCap', 'head', T(0, .19, .02))
    # Short cropped hair clumps and receding front edge.
    for x, y, z, sx in [(-.12,.19,-.10,.07),(-.04,.225,-.12,.075),(.04,.225,-.12,.075),(.12,.19,-.10,.065),(-.12,.20,.06,.075),(0,.24,.05,.09),(.12,.20,.06,.075)]:
        add_geom(scene, ellipsoid(sx, .045, .06, hair, 2), f'hair_{x}_{z}', 'head', T(x,y,z))
    # Ears
    for side in (-1, 1):
        add_geom(scene, ellipsoid(.035,.055,.025,skin,2), f'ear_{side}', 'head', T(side*.205,.035,0))
    # Nose and cheek/muzzle volume.
    nose = trimesh.creation.cone(radius=.035, height=.075, sections=18)
    nose.apply_transform(R(-math.pi/2, [1,0,0]))
    assign(nose, skin_shadow)
    add_geom(scene, nose, 'nose', 'head', T(0,.03,-.225))
    # Beard/stubble is sculpted as jaw/chin and moustache pieces.
    add_geom(scene, ellipsoid(.16,.10,.03,beard,2), 'beardChin', 'head', T(0,-.12,-.185))
    add_geom(scene, ellipsoid(.18,.11,.022,beard,2), 'beardJaw', 'head', T(0,-.07,-.18))
    add_geom(scene, ellipsoid(.085,.018,.018,beard,2), 'moustache', 'head', T(0,-.025,-.22))
    # Eyes and brows as named animation targets.
    for side, label in [(-1,'left'),(1,'right')]:
        add_joint(scene, f'{label}Eye', 'head', (side*.072,.075,-.19))
        # The approved-reference face patch already carries the visible eyes.  Keep
        # semantic joints for future morph/clip animation without drawing duplicate eyes.
        add_joint(scene, f'{label}Brow', 'head', (side*.072,.12,-.19))
    add_joint(scene, 'mouth', 'head', (0,-.065,-.205))

    # Arms use actual joint hierarchy and tapered volume.
    for side, label in [(-1,'left'),(1,'right')]:
        add_joint(scene, f'{label}Shoulder', 'upperBody', (side*.365,.36,0))
        add_geom(scene, ellipsoid(.095,.105,.095,shirt_red,2), f'{label}ShoulderCap', f'{label}Shoulder', T(0,0,0))
        add_geom(scene, capsule_y(.072,.39,shirt_red,18), f'{label}UpperArm', f'{label}Shoulder', T(0,-.205,0))
        # Plaid stripe on sleeve.
        add_geom(scene, box([.15,.025,.12],shirt_dark), f'{label}SleeveStripe', f'{label}Shoulder', T(0,-.24,-.012))
        add_joint(scene, f'{label}Elbow', f'{label}Shoulder', (0,-.39,0))
        add_geom(scene, capsule_y(.060,.34,skin,18), f'{label}Forearm', f'{label}Elbow', T(0,-.18,0))
        add_joint(scene, f'{label}Hand', f'{label}Elbow', (0,-.37,0))
        add_geom(scene, ellipsoid(.075,.09,.055,skin,2), f'{label}HandMesh', f'{label}Hand', T(0,-.03,0))
        add_geom(scene, ellipsoid(.022,.045,.018,skin,2), f'{label}Thumb', f'{label}Hand', T(side*.065,-.035,-.02))

    # Legs and boots.
    for side, label in [(-1,'left'),(1,'right')]:
        add_joint(scene, f'{label}Hip', 'JohnRig', (side*.155,.89,0))
        add_geom(scene, capsule_y(.095,.48,denim,18), f'{label}Thigh', f'{label}Hip', T(0,-.25,0))
        add_joint(scene, f'{label}Knee', f'{label}Hip', (0,-.48,0))
        add_geom(scene, capsule_y(.082,.43,denim_dark,18), f'{label}Shin', f'{label}Knee', T(0,-.225,0))
        add_joint(scene, f'{label}Foot', f'{label}Knee', (0,-.46,-.035))
        add_geom(scene, box([.18,.13,.29],leather), f'{label}BootBase', f'{label}Foot', T(0,.0,-.055))
        add_geom(scene, ellipsoid(.095,.065,.135,leather,2), f'{label}BootToe', f'{label}Foot', T(0,-.005,-.18))
        add_geom(scene, box([.19,.025,.31],leather_dark), f'{label}BootSole', f'{label}Foot', T(0,-.08,-.055))
        add_geom(scene, box([.16,.22,.16],leather), f'{label}BootShaft', f'{label}Foot', T(0,.16,.02))

    # Attachment sockets used by game code.
    add_joint(scene, 'rightHandSocket', 'rightHand', (0,-.02,-.02), metadata={'socket':'rightHand'})
    add_joint(scene, 'leftHandSocket', 'leftHand', (0,-.02,-.02), metadata={'socket':'leftHand'})
    add_joint(scene, 'backSocket', 'upperBody', (0,.30,.22), metadata={'socket':'back'})
    add_joint(scene, 'headSocket', 'head', (0,.28,0), metadata={'socket':'head'})

    # Slight forward pitch in source avoided; gameplay owns root rotation.
    export_scene(scene, OUT / 'characters' / 'john.glb')


def build_gunner():
    scene = trimesh.Scene(base_frame='world')
    tan = material('Gunner_FurTan', 0xb89b72, .96, 0)
    cream = material('Gunner_Cream', 0xd9cdb5, .97, 0)
    dark = material('Gunner_Muzzle', 0x4a3b30, .96, 0)
    nose = material('Gunner_Nose', 0x211d1a, .55, 0)
    eye = material('Gunner_Eye', 0x33251b, .3, 0)
    harness = material('Gunner_Harness', 0x52665f, .88, 0)

    add_joint(scene,'GunnerRig','world',(0,.285,0),metadata={'rigKind':'authored-jointed-dog','characterId':'gunner'})
    add_joint(scene,'body','GunnerRig',(0,.68,.08))
    add_geom(scene,ellipsoid(.34,.33,.58,tan,3),'bodyMesh','body',T(0,0,.10))
    add_joint(scene,'chestPivot','body',(0,.02,-.38))
    add_geom(scene,ellipsoid(.38,.36,.34,tan,3),'chest','chestPivot',T(0,0,0))
    add_geom(scene,ellipsoid(.34,.31,.34,tan,3),'haunch','body',T(0,-.02,.48))
    add_joint(scene,'head','chestPivot',(0,.27,-.26))
    add_geom(scene,ellipsoid(.29,.26,.27,tan,3),'headMesh','head',T(0,0,0))
    add_geom(scene,curved_dog_face_patch(.288,.252,.276,gunner_face_texture()),'approvedFacePatch','head',T(0,0,0))
    add_geom(scene,ellipsoid(.18,.12,.19,cream,2),'muzzle','head',T(0,-.06,-.25))
    add_geom(scene,ellipsoid(.08,.055,.055,nose,2),'nose','head',T(0,-.03,-.39))
    add_joint(scene,'jaw','head',(0,-.11,-.22))
    add_geom(scene,ellipsoid(.15,.045,.13,dark,2),'jawMesh','jaw',T(0,0,0))
    tongue_mat=material('Gunner_Tongue',0xb8686d,.78,0)
    add_geom(scene,ellipsoid(.055,.018,.12,tongue_mat,2),'tongue','jaw',T(0,-.055,-.10) @ R(.13,[1,0,0]))
    # ears hang low and wide, matching the approved larger farm-dog silhouette.
    for side,label in [(-1,'left'),(1,'right')]:
        add_joint(scene,f'{label}Ear','head',(side*.23,.12,-.04))
        add_geom(scene,ellipsoid(.09,.16,.045,tan,2),f'{label}EarMesh',f'{label}Ear',T(side*.02,-.09,.02)@R(side*.28,[0,0,1]))
        add_joint(scene,f'{label}Eye','head',(side*.10,.055,-.235))
    # legs with joint nodes for procedural dog animation fallback.
    leg_specs=[(-.23,-.38,'frontLeft'),(.23,-.38,'frontRight'),(-.24,.42,'rearLeft'),(.24,.42,'rearRight')]
    for x,z,label in leg_specs:
        add_joint(scene,label,'body',(x,-.15,z))
        add_geom(scene,capsule_y(.075,.38,tan,16),label+'Upper',label,T(0,-.20,0))
        add_joint(scene,label+'Knee',label,(0,-.39,0))
        add_geom(scene,capsule_y(.064,.34,cream if 'front' in label else tan,16),label+'Lower',label+'Knee',T(0,-.18,0))
        add_joint(scene,label+'Paw',label+'Knee',(0,-.37,-.025))
        add_geom(scene,ellipsoid(.095,.055,.12,cream,2),label+'PawMesh',label+'Paw',T(0,0,-.045))
    add_joint(scene,'tail','body',(0,.06,.70))
    add_geom(scene,capsule_y(.055,.48,tan,14),'tailMesh','tail',compose(T(0,.20,.08),R(-.55,[1,0,0])))
    # harness/backpack area
    add_geom(scene,box([.55,.055,.48],harness),'harnessBack','body',T(0,.28,.05))
    add_geom(scene,box([.06,.55,.06],harness),'harnessL','body',T(-.25,.05,.02)@R(.18,[1,0,0]))
    add_geom(scene,box([.06,.55,.06],harness),'harnessR','body',T(.25,.05,.02)@R(.18,[1,0,0]))
    add_joint(scene,'backSocket','body',(0,.35,.02),metadata={'socket':'back'})
    export_scene(scene, OUT / 'dogs' / 'gunner.glb')


def build_zapper():
    scene = trimesh.Scene(base_frame='world')
    steel = material('Zapper_Steel',0x808b8c,.35,.82)
    dark = material('Zapper_Rubber',0x202629,.72,.05)
    body = material('Zapper_Body',0x53636b,.52,.65)
    red = material('Zapper_Accent',0x9a493b,.48,.55)
    glow = material('Zapper_Energy',0x55c9d4,.22,.18,0x2ca7b5)
    add_joint(scene,'PropZapper','world',(0,0,0),metadata={'asset':'propZapper'})
    add_geom(scene,box([.18,.20,.38],body),'receiver','PropZapper',T(0,0,-.06))
    add_geom(scene,box([.15,.15,.25],dark),'stock','PropZapper',T(0,-.015,.25)@R(.12,[1,0,0]))
    add_geom(scene,box([.09,.28,.12],dark),'grip','PropZapper',T(0,-.20,.02)@R(-.18,[1,0,0]))
    add_geom(scene,cylinder_y(.036,.40,steel,18),'barrel','PropZapper',T(0,.015,-.48)@R(math.pi/2,[1,0,0]))
    for i,z in enumerate((-.32,-.41,-.50)):
        add_geom(scene,torus(.067,.014,red,24,8),f'ring{i}','PropZapper',T(0,.015,z)@R(math.pi/2,[1,0,0]))
    add_geom(scene,cylinder_y(.05,.20,glow,18),'coil','PropZapper',T(0,.015,-.70)@R(math.pi/2,[1,0,0]))
    add_geom(scene,torus(.083,.017,steel,26,8),'muzzleRing','PropZapper',T(0,.015,-.82)@R(math.pi/2,[1,0,0]))
    add_joint(scene,'muzzle','PropZapper',(0,.015,-.94),metadata={'socket':'muzzle'})
    export_scene(scene, OUT / 'props' / 'prop-zapper.glb')


def build_papa_chair():
    scene=trimesh.Scene(base_frame='world')
    yellow=material('Chair_OldYellow',0xb59a43,.96,0)
    yellow_dark=material('Chair_WornPatch',0x796730,.98,0)
    wood=material('Chair_Wood',0x4d3826,.82,0)
    add_joint(scene,'PapaChair','world',(0,0,0),metadata={'asset':'papaChair'})
    add_geom(scene,ellipsoid(.43,.13,.38,yellow,3),'seat','PapaChair',T(0,.50,0))
    add_geom(scene,ellipsoid(.39,.55,.16,yellow,3),'back','PapaChair',T(0,1.04,.25)@R(-.08,[1,0,0]))
    for side in (-1,1):
        add_geom(scene,capsule_y(.13,.60,yellow,18),f'arm{side}','PapaChair',T(side*.49,.76,-.02)@R(math.pi/2,[1,0,0]))
        for z in (-.22,.20): add_geom(scene,box([.11,.50,.11],wood),f'leg_{side}_{z}','PapaChair',T(side*.47,.25,z))
    add_geom(scene,box([.27,.022,.24],yellow_dark),'seatPatch','PapaChair',T(-.17,.61,-.34)@R(math.pi/2,[1,0,0]))
    add_geom(scene,box([.18,.018,.13],yellow_dark),'backTear','PapaChair',T(.19,1.17,.40))
    export_scene(scene,OUT/'furniture'/'papa-chair.glb')


def build_tractor():
    scene=trimesh.Scene(base_frame='world')
    green=material('Tractor_Green',0x58713d,.48,.58)
    green_dark=material('Tractor_DarkGreen',0x40552e,.55,.62)
    black=material('Tractor_Tire',0x171a19,.95,.0)
    steel=material('Tractor_Steel',0x7f8582,.32,.78)
    seat=material('Tractor_Seat',0x262a27,.9,.02)
    glass=material('Tractor_Glass',0x6f9296,.12,.08)
    add_joint(scene,'Tractor','world',(0,.15,0),metadata={'asset':'tractor'})
    add_geom(scene,box([1.2,.66,1.22],green),'hood','Tractor',T(-.42,.70,-.05))
    add_geom(scene,box([1.02,.18,1.10],green_dark),'hoodTop','Tractor',T(-.50,1.09,-.05))
    # grille and headlights
    add_geom(scene,box([.035,.42,.72],steel),'grille','Tractor',T(-1.035,.72,-.05))
    for zz in (-.33,.33): add_geom(scene,cylinder_y(.09,.06,glass,16),f'headlight{zz}','Tractor',T(-1.07,1.0,zz)@R(math.pi/2,[0,0,1]))
    # cab/seat frame
    add_geom(scene,box([.73,.78,1.04],green),'rearBody','Tractor',T(.56,.85,.02))
    add_geom(scene,ellipsoid(.28,.09,.30,seat,2),'seat','Tractor',T(.52,1.36,.05))
    # rollover frame
    for x in (.32,.75):
        add_geom(scene,cylinder_y(.035,1.30,steel,12),f'rollbar{x}','Tractor',T(x,1.72,.45))
    add_geom(scene,box([.50,.05,.05],steel),'rollbarTop','Tractor',T(.54,2.34,.45))
    # wheels with treads
    wheel_specs=[(-.85,-.68,.43),(-.85,.68,.43),(.68,-.68,.57),(.68,.68,.57)]
    for idx,(x,z,r) in enumerate(wheel_specs):
        add_geom(scene,torus(r,.15,black,32,12),f'tire{idx}','Tractor',T(x,r,z)@R(math.pi/2,[0,1,0]))
        add_geom(scene,cylinder_y(r*.43,.12,steel,20),f'hub{idx}','Tractor',T(x,r,z)@R(math.pi/2,[1,0,0]))
        for j in range(12):
            a=j/12*math.tau
            tread=box([.07,.06,.19],black)
            add_geom(scene,tread,f'tread{idx}_{j}','Tractor',T(x+math.cos(a)*r,z*0+r+math.sin(a)*r,z)@R(-a,[0,0,1]))
    # steering and exhaust
    add_geom(scene,torus(.18,.024,black,24,8),'steering','Tractor',T(.20,1.60,-.05)@R(math.pi/2,[1,0,0])@R(.24,[0,1,0]))
    add_geom(scene,cylinder_y(.052,1.20,steel,16),'exhaust','Tractor',T(-.65,1.75,.38))
    add_geom(scene,cylinder_y(.08,.11,black,16),'exhaustCap','Tractor',T(-.65,2.36,.38))
    export_scene(scene,OUT/'props'/'tractor.glb')



def build_motorcycle():
    scene=trimesh.Scene(base_frame='world')
    black=material('Motorcycle_Rubber',0x171919,.96,0)
    chrome=material('Motorcycle_Chrome',0xb8bfbd,.24,.92)
    steel=material('Motorcycle_Steel',0x6d7472,.38,.8)
    paint=material('Motorcycle_OldPaint',0x35393a,.56,.68)
    leather=material('Motorcycle_Leather',0x4b382d,.92,0)
    brass=material('Motorcycle_Brass',0xa28048,.34,.7)
    glass=material('Motorcycle_Glass',0xd9e7e6,.12,.08)
    add_joint(scene,'Motorcycle','world',(0,0,0),metadata={'asset':'motorcycle'})
    # wheels / spokes
    for zi,z in enumerate((-.68,.68)):
        add_geom(scene,torus(.38,.065,black,36,12),f'tire{zi}','Motorcycle',T(0,.40,z)@R(math.pi/2,[0,1,0]))
        add_geom(scene,cylinder_y(.19,.055,chrome,24),f'hub{zi}','Motorcycle',T(0,.40,z)@R(math.pi/2,[1,0,0]))
        for j in range(12):
            a=j/12*math.tau
            end=[math.cos(a)*.31,.40+math.sin(a)*.31,z]
            add_geom(scene,cylinder_y(.009,.62,chrome,8),f'spoke{zi}_{j}','Motorcycle',T((end[0])/2,(.40+end[1])/2,z)@R(a,[0,0,1]))
    # frame / forks
    for a,b,name in [((0,.46,-.48),(0,.72,.10),'frameA'),((0,.72,.10),(0,.46,.50),'frameB'),((0,.46,-.48),(0,.46,.50),'frameC')]:
        # explicit tubeBetween isn't available here, so use capsule rotated approximately around Z/Y.
        vec=np.array(b)-np.array(a); length=float(np.linalg.norm(vec)); mid=(np.array(a)+np.array(b))/2
        geom=capsule_y(.032,length,chrome,14)
        # align local Y to direction vector
        yaxis=np.array([0.,1.,0.]); d=vec/length; axis=np.cross(yaxis,d); dot=float(np.clip(np.dot(yaxis,d),-1,1))
        tr=T(*mid)
        if np.linalg.norm(axis)>1e-6: tr=tr@R(math.acos(dot),axis/np.linalg.norm(axis))
        add_geom(scene,geom,name,'Motorcycle',tr)
    # tank, engine, seat, exhaust
    add_geom(scene,ellipsoid(.26,.18,.34,paint,3),'tank','Motorcycle',T(0,.82,-.16))
    add_geom(scene,ellipsoid(.18,.075,.30,leather,3),'seat','Motorcycle',T(0,.82,.35)@R(.05,[1,0,0]))
    add_geom(scene,box([.34,.30,.30],steel),'engineBlock','Motorcycle',T(0,.55,.12))
    for sx in (-.12,.12):
        add_geom(scene,cylinder_y(.055,.25,chrome,14),f'cylinder{sx}','Motorcycle',T(sx,.60,.08)@R(math.pi/2,[0,0,1]))
    add_geom(scene,cylinder_y(.035,.95,chrome,12),'exhaust','Motorcycle',T(.18,.35,.22)@R(math.pi/2,[1,0,0]))
    add_geom(scene,cylinder_y(.045,.50,chrome,12),'fork','Motorcycle',T(0,.74,-.62)@R(-.25,[1,0,0]))
    add_geom(scene,box([.65,.035,.035],chrome),'handlebar','Motorcycle',T(0,1.08,-.75))
    for sx in (-.30,.30): add_geom(scene,ellipsoid(.055,.035,.045,black,2),f'grip{sx}','Motorcycle',T(sx,1.08,-.75))
    add_geom(scene,cylinder_y(.085,.08,glass,18),'headlamp','Motorcycle',T(0,.94,-.84)@R(math.pi/2,[1,0,0]))
    add_geom(scene,box([.22,.10,.02],brass),'oldPlate','Motorcycle',T(0,.65,.79))
    export_scene(scene,OUT/'props'/'motorcycle.glb')


def build_fireplace_asset():
    scene=trimesh.Scene(base_frame='world')
    stone=material('Fireplace_Stone',0x6d6255,.94,0)
    stone2=material('Fireplace_StoneDark',0x51483f,.96,0)
    soot=material('Fireplace_Soot',0x1f1c19,.98,0)
    wood=material('Fireplace_Wood',0x4e3524,.9,0)
    metal=material('Fireplace_Iron',0x292a28,.62,.72)
    add_joint(scene,'Fireplace','world',(0,0,0),metadata={'asset':'fireplace'})
    # stones are individual uneven blocks so the silhouette and shadows read better.
    rng=np.random.default_rng(42)
    for side in (-1,1):
        for row in range(6):
            y=.18+row*.27
            for col in range(2):
                x=side*(.52+col*.13)
                z=(col-.5)*.30 + (row%2)*.05
                sx=.24+rng.uniform(-.025,.025); sy=.23+rng.uniform(-.025,.02); sz=.32+rng.uniform(-.03,.03)
                add_geom(scene,box([sx,sy,sz],stone if (row+col)%2 else stone2),f'stone_{side}_{row}_{col}','Fireplace',T(x,y,z)@R(rng.uniform(-.05,.05),[0,0,1]))
    for col in range(6):
        x=-.58+col*.23
        add_geom(scene,box([.24,.26,.33],stone if col%2 else stone2),f'lintelStone{col}','Fireplace',T(x,1.62,0))
    add_geom(scene,box([1.18,.08,.80],stone2),'hearth','Fireplace',T(0,.08,-.03))
    add_geom(scene,box([.98,1.05,.07],soot),'fireboxBack','Fireplace',T(0,.76,.31))
    add_geom(scene,box([1.16,.10,.94],wood),'mantel','Fireplace',T(0,1.90,-.01))
    for z in (-.05,.10): add_geom(scene,cylinder_y(.075,.72,wood,12),f'log{z}','Fireplace',T(-.12,.33,z)@R(math.pi/2,[0,0,1]))
    add_geom(scene,box([.88,.035,.035],metal),'grate','Fireplace',T(0,.24,-.12))
    for x in (-.35,-.12,.12,.35): add_geom(scene,box([.035,.22,.035],metal),f'grateBar{x}','Fireplace',T(x,.30,-.12))
    export_scene(scene,OUT/'furniture'/'fireplace.glb')


def build_workbench_asset():
    scene=trimesh.Scene(base_frame='world')
    top=material('Bench_Maple',0x8d6742,.88,0); dark=material('Bench_DarkWood',0x5c422f,.93,0)
    steel=material('Bench_Steel',0x7d8380,.38,.82); peg=material('Bench_Pegboard',0x987a5b,.93,0)
    blue=material('Bench_ViseBlue',0x31566a,.52,.62); orange=material('Bench_ToolOrange',0xb27332,.68,.32)
    add_joint(scene,'Workbench','world',(0,0,0),metadata={'asset':'workbench'})
    add_geom(scene,box([3.0,.14,.86],top),'top','Workbench',T(0,.93,0))
    for sx in (-1.28,1.28):
        for sz in (-.31,.31): add_geom(scene,box([.13,.88,.13],dark),f'leg{sx}_{sz}','Workbench',T(sx,.44,sz))
    add_geom(scene,box([2.7,.10,.66],dark),'lowerShelf','Workbench',T(0,.28,0))
    add_geom(scene,box([2.85,.95,.055],peg),'pegboard','Workbench',T(0,1.45,.39))
    # tool silhouettes on pegboard
    for i,x in enumerate(np.linspace(-1.08,1.08,7)):
        add_geom(scene,cylinder_y(.018,.34,steel,8),f'toolHandle{i}','Workbench',T(x,1.48,.345)@R((i-3)*.08,[0,0,1]))
        add_geom(scene,box([.10,.025,.025],steel),f'toolHead{i}','Workbench',T(x,1.30,.345))
    add_geom(scene,box([.34,.18,.28],blue),'viseBody','Workbench',T(1.05,1.05,-.12))
    add_geom(scene,box([.27,.11,.08],steel),'viseJaw','Workbench',T(1.05,1.18,-.24))
    add_geom(scene,box([.38,.22,.28],orange),'powerTool','Workbench',T(-.75,1.08,0))
    # jars/cans clutter but kept bounded
    canm=material('Bench_Cans',0x8a8e87,.4,.68)
    for i,x in enumerate((-.30,.02,.33,.62)):
        add_geom(scene,cylinder_y(.06,.18,canm,14),f'can{i}','Workbench',T(x,1.08,.12))
    export_scene(scene,OUT/'furniture'/'workbench.glb')


def build_tool_chest_asset():
    scene=trimesh.Scene(base_frame='world')
    red=material('ToolChest_Red',0x8f342e,.54,.62); red2=material('ToolChest_RedDark',0x762c28,.56,.64)
    steel=material('ToolChest_Steel',0xa9afad,.28,.9); black=material('ToolChest_Rubber',0x1c1f20,.95,0)
    add_joint(scene,'ToolChest','world',(0,0,0),metadata={'asset':'toolChest'})
    add_geom(scene,box([1.45,1.02,.64],red),'body','ToolChest',T(0,.55,0))
    add_geom(scene,box([1.50,.11,.69],black),'topPad','ToolChest',T(0,1.115,0))
    for i in range(6):
        y=.25+i*.135
        add_geom(scene,box([1.31,.105,.035],red if i%2 else red2),f'drawer{i}','ToolChest',T(0,y,-.335))
        add_geom(scene,box([.42,.025,.025],steel),f'handle{i}','ToolChest',T(0,y,-.365))
    for sx in (-.55,.55):
        for sz in (-.23,.23):
            add_geom(scene,torus(.07,.018,black,20,8),f'caster{sx}_{sz}','ToolChest',T(sx,.07,sz)@R(math.pi/2,[0,1,0]))
    add_geom(scene,box([.035,.32,.035],steel),'sideHandlePostL','ToolChest',T(.76,.82,-.18))
    add_geom(scene,box([.035,.32,.035],steel),'sideHandlePostR','ToolChest',T(.76,.82,.18))
    add_geom(scene,box([.035,.035,.40],steel),'sideHandle','ToolChest',T(.76,.98,0))
    export_scene(scene,OUT/'furniture'/'tool-chest.glb')


def build_shelving_asset():
    scene=trimesh.Scene(base_frame='world')
    steel=material('Shelf_Steel',0x454c4d,.50,.68); wood=material('Shelf_Wood',0x866646,.88,0)
    add_joint(scene,'Shelving','world',(0,0,0),metadata={'asset':'shelving'})
    width=1.55; height=2.25; depth=.66
    for sx in (-width/2+.06,width/2-.06):
        for sz in (-depth/2+.05,depth/2-.05): add_geom(scene,box([.08,height,.08],steel),f'post{sx}_{sz}','Shelving',T(sx,height/2,sz))
    colors=[0x6b795d,0x8e5941,0x445a67,0x9a783e]
    for i in range(5):
        y=.12+i*(height-.2)/4
        add_geom(scene,box([width,.07,depth],wood),f'shelf{i}','Shelving',T(0,y,0))
        if i>0:
            for k in range(3):
                bm=material(f'Bin_{i}_{k}',colors[(i+k)%4],.72,.16)
                add_geom(scene,box([.38,.22,.40],bm),f'bin{i}_{k}','Shelving',T(-.48+k*.48,y+.14,0))
    export_scene(scene,OUT/'furniture'/'shelving.glb')

def main():
    build_john()
    build_gunner()
    build_zapper()
    build_papa_chair()
    build_tractor()
    build_motorcycle()
    build_fireplace_asset()
    build_workbench_asset()
    build_tool_chest_asset()
    build_shelving_asset()

if __name__ == '__main__':
    main()
