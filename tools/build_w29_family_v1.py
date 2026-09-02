from __future__ import annotations
import math, json, io
from pathlib import Path
import numpy as np
from PIL import Image, ImageDraw, ImageFilter
from collections import deque

# Reuse the proven W27 GLB writer, skinning helpers and implicit-surface tools.
from build_vertical_slice_assets import (
    ROOT, MODELS, GLBBuilder, image_png_bytes, make_denim,
    add_ellipsoid_prim, add_face_patch, add_tube, add_box_prim, add_boot_wedge,
    implicit_union_prim, _ellipsoid_field, _capsule_field, quat
)

OUT_DIR = MODELS / 'characters' / 'approved'
TURN_DIR = ROOT / 'public' / 'approved-character-turnarounds'

# Front-head crops are taken only from the locked individual turnaround sheets.
FACE_BOXES = {
    'kristen': (45, 90, 190, 240),
    'holly': (25, 280, 240, 485),
    'vanessa': (25, 270, 245, 480),
    'elizabeth': (25, 285, 250, 495),
    'logan': (25, 310, 245, 520),
    'james': (25, 260, 250, 480),
    'dorothy': (45, 90, 190, 245),
}

SPECS = {
    'kristen': dict(code='CHAR_KRISTEN', display='Kristen Black', height=1.77, body=.94, hips=.97, head=1.03,
        skin=0xe5a064, hair=0xd59a3a, top=0x1e1e1e, legs=0x2e6aa6, boots=0x8b5a2b,
        hairType='shoulder_wavy', outfit='short_tee', age='adult'),
    'holly': dict(code='CHAR_HOLLY', display='Holly', height=1.42, body=.88, hips=.89, head=1.13,
        skin=0xefaa66, hair=0xe9a539, top=0xe8c98f, legs=0x2f5f91, boots=0x6b431f,
        hairType='double_buns', outfit='sweater_backpack', age='child'),
    'vanessa': dict(code='CHAR_VANESSA', display='Vanessa', height=1.79, body=.95, hips=.98, head=1.02,
        skin=0xe3a064, hair=0xe0a13f, top=0x8d3b34, legs=0x2f5f91, boots=0x6b431f,
        hairType='long_curly', outfit='long_top', age='adult'),
    'elizabeth': dict(code='CHAR_LIZZIE', display='Elizabeth (Lizzy)', height=1.46, body=.89, hips=.90, head=1.12,
        skin=0xefaa66, hair=0xe9a539, top=0xf3a8b9, legs=0xf5c6a2, boots=0xf06b95,
        hairType='high_ponytail', outfit='hoodie_skirt', age='child'),
    'logan': dict(code='CHAR_LOGAN', display='Logan', height=1.82, body=.95, hips=.94, head=1.01,
        skin=0xe8a66b, hair=0xe0a13f, top=0x1b1b1b, legs=0x202020, boots=0xa36a28,
        hairType='spiky', outfit='hoodie', age='teen'),
    'james': dict(code='CHAR_JAMES', display='James', height=1.75, body=1.02, hips=1.00, head=1.03,
        skin=0xd9935e, hair=0x9e9b93, top=0x2669b3, legs=0x2f5f91, boots=0x6b431f,
        hairType='curly_short', outfit='button_shirt', age='adult'),
    'dorothy': dict(code='CHAR_DOROTHY', display='Dorothy', height=1.69, body=.94, hips=.98, head=1.04,
        skin=0xe3a064, hair=0xe0a13f, top=0x2e6fa8, legs=0x2e6fa8, boots=0x2e5e83,
        hairType='bun_updo', outfit='apron_dress', age='adult'),
}


def face_crop(cid):
    ref = Image.open(TURN_DIR / f'{cid}-approved-turnaround.png').convert('RGB')
    crop = ref.crop(FACE_BOXES[cid]).resize((512, 600), Image.Resampling.LANCZOS)
    # Connected-edge background removal: delete only cream background that can be
    # reached from the crop border, so pale skin is not erased just because its
    # colour is close to the sheet background. Then feather the cut into the skull.
    arr=np.asarray(crop).astype(np.int16); h,w=arr.shape[:2]
    samples=np.concatenate([arr[:20,:20].reshape(-1,3),arr[:20,-20:].reshape(-1,3),arr[-20:,:20].reshape(-1,3),arr[-20:,-20:].reshape(-1,3)],0)
    bg=np.median(samples,axis=0); dist=np.linalg.norm(arr-bg,axis=2); eligible=dist<70
    seen=np.zeros((h,w),bool); q=deque()
    for x in range(w):
        if eligible[0,x] and not seen[0,x]:seen[0,x]=1;q.append((0,x))
        if eligible[h-1,x] and not seen[h-1,x]:seen[h-1,x]=1;q.append((h-1,x))
    for y in range(h):
        if eligible[y,0] and not seen[y,0]:seen[y,0]=1;q.append((y,0))
        if eligible[y,w-1] and not seen[y,w-1]:seen[y,w-1]=1;q.append((y,w-1))
    while q:
        y,x=q.popleft()
        for dy,dx in ((1,0),(-1,0),(0,1),(0,-1)):
            yy,xx=y+dy,x+dx
            if 0<=yy<h and 0<=xx<w and eligible[yy,xx] and not seen[yy,xx]:seen[yy,xx]=1;q.append((yy,xx))
    a=Image.fromarray(np.where(seen,0,255).astype(np.uint8),'L').filter(ImageFilter.GaussianBlur(4))
    guard=Image.new('L',(w,h),0);d=ImageDraw.Draw(guard);d.ellipse((42,10,w-42,h-6),fill=255);guard=guard.filter(ImageFilter.GaussianBlur(18))
    alpha=Image.fromarray(np.minimum(np.asarray(a),np.asarray(guard)).astype(np.uint8),'L')
    out=crop.convert('RGBA');out.putalpha(alpha);return out


def add_hair(prims, cid, spec, J, m_hair, center, radii):
    cx, cy, cz = center; rx, ry, rz = radii; t=spec['hairType']
    # Every V1 style gets a compact rear scalp shell so rotation never reveals a pale/bald skull.
    prims.append(add_ellipsoid_prim((0,cy+.035,cz+rz*.39),(rx*1.01,ry*.78,rz*.68),J,m_hair,seg=30,rings=16))
    # W29 V1 rule: prioritize a clean silhouette over individual curl sculpting.
    # Fine strand/curl breakup is deliberately deferred to the later art-polish pass.
    if t == 'shoulder_wavy':
        prims.append(add_ellipsoid_prim((0,cy-.015,cz+rz*.54),(rx*1.02,ry*.98,rz*.64),J,m_hair,seg=34,rings=18))
        prims.append(add_ellipsoid_prim((0,cy+ry*.54,cz+.015),(rx*.98,ry*.42,rz*.96),J,m_hair,seg=30,rings=16))
        for side in (-1,1):
            prims.append(add_ellipsoid_prim((side*rx*.77,cy-.09,cz+.03),(rx*.18,ry*.46,rz*.26),J,m_hair,seg=18,rings=10))
    elif t == 'long_curly':
        prims.append(add_ellipsoid_prim((0,cy-.13,cz+rz*.55),(rx*1.08,ry*1.22,rz*.70),J,m_hair,seg=36,rings=20))
        prims.append(add_ellipsoid_prim((0,cy+ry*.53,cz+.015),(rx*1.02,ry*.43,rz*.98),J,m_hair,seg=30,rings=16))
        for side in (-1,1):
            prims.append(add_ellipsoid_prim((side*rx*.80,cy-.16,cz+.045),(rx*.19,ry*.58,rz*.27),J,m_hair,seg=18,rings=10))
    elif t == 'double_buns':
        prims.append(add_ellipsoid_prim((0,cy+ry*.48,cz+.015),(rx*.96,ry*.43,rz*.96),J,m_hair,seg=28,rings=15))
        for side in (-1,1): prims.append(add_ellipsoid_prim((side*rx*.62,cy+ry*.86,cz+.03),(rx*.36,ry*.31,rz*.35),J,m_hair,seg=20,rings=11))
    elif t == 'high_ponytail':
        prims.append(add_ellipsoid_prim((0,cy+ry*.47,cz+.015),(rx*.96,ry*.42,rz*.96),J,m_hair,seg=28,rings=15))
        prims.append(add_ellipsoid_prim((rx*.22,cy+ry*.67,cz+rz*.63),(rx*.34,ry*.31,rz*.31),J,m_hair,seg=20,rings=11))
        prims.append(add_ellipsoid_prim((rx*.33,cy+ry*.22,cz+rz*.78),(rx*.31,ry*.60,rz*.28),J,m_hair,seg=22,rings=12))
    elif t == 'spiky':
        prims.append(add_ellipsoid_prim((0,cy+ry*.51,cz+.015),(rx*.98,ry*.40,rz*.96),J,m_hair,seg=28,rings=15))
        for a in np.linspace(-1.15,1.15,7):
            x=math.sin(a)*rx*.68; z=cz-rz*.18+abs(math.sin(a))*rz*.10; y=cy+ry*(.72+.10*math.cos(a))
            prims.append(add_ellipsoid_prim((x,y,z),(rx*.16,ry*.16,rz*.16),J,m_hair,seg=12,rings=7))
    elif t == 'curly_short':
        prims.append(add_ellipsoid_prim((0,cy+ry*.50,cz+.02),(rx*1.01,ry*.43,rz*.98),J,m_hair,seg=28,rings=15))
        for a in np.linspace(-2.2,2.2,8):
            x=math.sin(a)*rx*.72;z=cz+math.cos(a)*rz*.55;y=cy+ry*.64
            prims.append(add_ellipsoid_prim((x,y,z),(rx*.16,ry*.14,rz*.16),J,m_hair,seg=12,rings=7))
    elif t == 'bun_updo':
        prims.append(add_ellipsoid_prim((0,cy+ry*.50,cz+.02),(rx*.98,ry*.42,rz*.96),J,m_hair,seg=28,rings=15))
        prims.append(add_ellipsoid_prim((0,cy+ry*.86,cz+rz*.42),(rx*.38,ry*.33,rz*.36),J,m_hair,seg=20,rings=11))


def build_human(cid, spec):
    b=GLBBuilder(); s=spec['height']/1.82; bw=spec['body']; hw=spec['hips']; hs=spec['head']
    face_tex=b.image(image_png_bytes(face_crop(cid)),f'{spec["code"]}_ApprovedFace')
    denim_tex=b.image(image_png_bytes(make_denim()),f'{spec["code"]}_Denim')
    m_skin=b.material(f'{spec["code"]}_Skin',spec['skin'],.74,0)
    m_top=b.material(f'{spec["code"]}_PrimaryClothing',spec['top'],.86,0,extras={'materialRole':'primaryClothing'})
    m_legs=b.material(f'{spec["code"]}_Legs',spec['legs'],.90,0,denim_tex if spec['outfit'] not in ('hoodie','apron_dress') else None)
    m_boot=b.material(f'{spec["code"]}_Footwear',spec['boots'],.84,0)
    m_hair=b.material(f'{spec["code"]}_Hair',spec['hair'],.94,0)
    m_face=b.material(f'{spec["code"]}_ApprovedStylizedFace',0xffffff,.78,0,face_tex,alpha=True,double=True)
    m_belt=b.material(f'{spec["code"]}_Belt',0x5b3a23,.86,0)
    m_metal=b.material(f'{spec["code"]}_Buckle',0xb28a4c,.32,.7)
    m_cream=b.material(f'{spec["code"]}_CreamAccent',0xe7d3b5,.88,0)
    m_pink=b.material(f'{spec["code"]}_PinkAccent',0xe7809f,.78,0)
    m_blue=b.material(f'{spec["code"]}_BlueAccent',0x2e6fa8,.82,0)

    # Shared humanoid skeleton scaled to each approved reference height.
    base={
      'hips':(0,.92,0),'upperBody':(0,1.10,0),'chest':(0,1.35,0),'neck':(0,1.50,0),'head':(0,1.66,0),
      'leftShoulder':(-.31,1.42,0),'leftElbow':(-.31,1.10,0),'leftHand':(-.31,.78,0),
      'rightShoulder':(.31,1.42,0),'rightElbow':(.31,1.10,0),'rightHand':(.31,.78,0),
      'leftHip':(-.135,.89,0),'leftKnee':(-.135,.49,0),'leftFoot':(-.135,.11,-.035),
      'rightHip':(.135,.89,0),'rightKnee':(.135,.49,0),'rightFoot':(.135,.11,-.035),
    }
    abspos={k:tuple(np.asarray(v)*s) for k,v in base.items()}
    # Width is separate from height so children keep the approved stylized proportions.
    for n in ('leftShoulder','leftElbow','leftHand'):
        x,y,z=abspos[n];abspos[n]=(x*bw,y,z)
    for n in ('rightShoulder','rightElbow','rightHand'):
        x,y,z=abspos[n];abspos[n]=(x*bw,y,z)
    for n in ('leftHip','leftKnee','leftFoot'):
        x,y,z=abspos[n];abspos[n]=(x*hw,y,z)
    for n in ('rightHip','rightKnee','rightFoot'):
        x,y,z=abspos[n];abspos[n]=(x*hw,y,z)
    parent={'hips':None,'upperBody':'hips','chest':'upperBody','neck':'chest','head':'neck',
            'leftShoulder':'chest','leftElbow':'leftShoulder','leftHand':'leftElbow','rightShoulder':'chest','rightElbow':'rightShoulder','rightHand':'rightElbow',
            'leftHip':'hips','leftKnee':'leftHip','leftFoot':'leftKnee','rightHip':'hips','rightKnee':'rightHip','rightFoot':'rightKnee'}
    joint_names=list(abspos.keys()); ji={n:i for i,n in enumerate(joint_names)}

    prims=[]
    # Torso and sleeves. Adult women get a slightly tapered waist, children a softer compact torso.
    chest_w=.305*s*bw; waist_w=.235*s*bw; chest_y=1.305*s; waist_y=1.105*s
    chest_d=.150*s; waist_d=.130*s
    long_sleeve=spec['outfit'] in ('long_top','hoodie','apron_dress','sweater_backpack','hoodie_skirt')
    def shirt_weights(v):
        x,y,z=v; side='left' if x<0 else 'right'
        sh=abspos[side+'Shoulder'][1]; el=abspos[side+'Elbow'][1]
        if abs(x)>.245*s*bw and y<sh+.04:
            t=float(np.clip((sh-y)/max(.01,sh-el),0,1));return [ji[side+'Shoulder'],ji[side+'Elbow']],[1-t,t]
        t=float(np.clip((y-.90*s)/(.54*s),0,1));return [ji['hips'],ji['chest']],[1-t,t]
    shoulder_factor=.84 if spec['age'] in ('adult','child') and cid not in ('james',) else .96
    shx=.245*s*bw*shoulder_factor; elx=.31*s*bw*shoulder_factor
    sleeve_end=.80*s if long_sleeve else 1.18*s
    sleeve_r0=.112*s*(.93 if spec['age']=='child' else 1); sleeve_r1=.075*s
    shirt_fields=[
        lambda X,Y,Z:_ellipsoid_field(X,Y,Z,(0,chest_y,0),(chest_w,.235*s,chest_d)),
        lambda X,Y,Z:_ellipsoid_field(X,Y,Z,(0,waist_y,0),(waist_w,.245*s,waist_d)),
        lambda X,Y,Z:_capsule_field(X,Y,Z,(-shx,1.405*s,0),(-elx,sleeve_end,0),sleeve_r0,sleeve_r1),
        lambda X,Y,Z:_capsule_field(X,Y,Z,( shx,1.405*s,0),( elx,sleeve_end,0),sleeve_r0,sleeve_r1),
    ]
    prims.append(implicit_union_prim(((-.46*s*bw,.46*s*bw),(.72*s,1.56*s),(-.25*s,.25*s)),(54,62,40),shirt_fields,shirt_weights,m_top,'cyl'))

    # Pants/legs stay coherent even under skirts/aprons.
    def leg_weights(v):
        x,y,z=v;side='left' if x<0 else 'right'
        if y>.82*s:return [ji['hips']],[1]
        if y>.47*s:
            t=float(np.clip((.89*s-y)/(.40*s),0,1));return [ji[side+'Hip'],ji[side+'Knee']],[1-t,t]
        t=float(np.clip((.49*s-y)/(.36*s),0,1));return [ji[side+'Knee'],ji[side+'Foot']],[1-t,t]
    hx=.125*s*hw
    pants_fields=[
        lambda X,Y,Z:_ellipsoid_field(X,Y,Z,(0,.845*s,0),(.225*s*hw,.145*s,.120*s)),
        lambda X,Y,Z:_capsule_field(X,Y,Z,(-hx,.83*s,0),(-hx,.49*s,0),.116*s,.094*s),
        lambda X,Y,Z:_capsule_field(X,Y,Z,( hx,.83*s,0),( hx,.49*s,0),.116*s,.094*s),
        lambda X,Y,Z:_capsule_field(X,Y,Z,(-hx,.50*s,0),(-hx,.14*s,-.02*s),.094*s,.070*s),
        lambda X,Y,Z:_capsule_field(X,Y,Z,( hx,.50*s,0),( hx,.14*s,-.02*s),.094*s,.070*s),
    ]
    prims.append(implicit_union_prim(((-.34*s*hw,.34*s*hw),(.07*s,1.02*s),(-.20*s,.20*s)),(40,66,32),pants_fields,leg_weights,m_legs,'cyl'))

    # Exposed arms/hands begin at the garment cuff.
    arm_top=(.79 if long_sleeve else 1.20)*s
    for side,name in [(-1,'left'),(1,'right')]:
        x=abspos[name+'Elbow'][0]
        if arm_top>abspos[name+'Hand'][1]+.02:
            prims.append(add_tube(arm_top,abspos[name+'Hand'][1]+.01,x,0,.071*s,.067*s,.056*s,.052*s,ji[name+'Elbow'],ji[name+'Hand'],m_skin,segments=20,rings=7))
        prims.append(add_ellipsoid_prim((abspos[name+'Hand'][0],abspos[name+'Hand'][1]-.04*s,-.012*s),(.064*s,.078*s,.050*s),ji[name+'Hand'],m_skin,seg=18,rings=10))
        prims.append(add_boot_wedge((abspos[name+'Foot'][0],.012*s,-.035*s),side,ji[name+'Foot'],m_boot))
    prims.append(add_tube(1.47*s,1.56*s,0,0,.064*s,.064*s,.061*s,.061*s,ji['neck'],ji['neck'],m_skin,segments=18,rings=3))

    # Accepted V1 head rule: solid 3D skull + one approved front face surface. No duplicate modeled face.
    hc=(0,1.665*s,.008*s); hr=(.196*s*hs,.216*s*hs,.165*s*hs)
    prims.append(add_ellipsoid_prim(hc,hr,ji['head'],m_skin,seg=44,rings=28))
    prims.append(add_face_patch((0,1.665*s,-.006*s),(.172*s*hs,.192*s*hs,.188*s*hs),ji['head'],m_face,cols=52,rows=52))
    add_hair(prims,cid,spec,ji['head'],m_hair,hc,hr)
    # Ears give side silhouette continuity even where the face texture fades.
    prims.append(add_ellipsoid_prim((-.203*s*hs,1.660*s,-.005*s),(.029*s*hs,.048*s*hs,.024*s*hs),ji['head'],m_skin,seg=16,rings=9))
    prims.append(add_ellipsoid_prim(( .203*s*hs,1.660*s,-.005*s),(.029*s*hs,.048*s*hs,.024*s*hs),ji['head'],m_skin,seg=16,rings=9))

    # Clothing identity accents.
    prims.append(add_box_prim((0,.955*s,0),(.49*s*hw,.055*s,.25*s),ji['hips'],m_belt))
    prims.append(add_box_prim((0,.955*s,-.135*s),(.08*s,.068*s,.025*s),ji['hips'],m_metal))
    if spec['outfit']=='button_shirt':
        prims.append(add_box_prim((0,1.27*s,-.135*s),(.024*s,.33*s,.016*s),ji['chest'],m_top))
    if spec['outfit'] in ('hoodie','hoodie_skirt'):
        prims.append(add_ellipsoid_prim((0,1.43*s,.105*s),(.205*s,.135*s,.145*s),ji['chest'],m_top,seg=22,rings=12))
    if spec['outfit']=='sweater_backpack':
        prims.append(add_box_prim((0,1.25*s,.145*s),(.35*s,.42*s,.11*s),ji['chest'],m_blue))
        for side in (-1,1): prims.append(add_box_prim((side*.17*s,1.28*s,-.13*s),(.045*s,.40*s,.025*s),ji['chest'],m_blue))
    if spec['outfit']=='hoodie_skirt':
        # Flared skirt shell over the base legs.
        skirt_fields=[lambda X,Y,Z:_ellipsoid_field(X,Y,Z,(0,.79*s,0),(.27*s*hw,.17*s,.17*s))]
        prims.append(implicit_union_prim(((-.36*s,.36*s),(.58*s,.99*s),(-.28*s,.28*s)),(34,30,28),skirt_fields,lambda v:([ji['hips']],[1]),m_pink,'cyl'))
        # Bow lobes at top-back/side of head.
        prims.append(add_ellipsoid_prim((-.060*s,1.87*s,.02*s),(.072*s,.050*s,.026*s),ji['head'],m_pink,seg=16,rings=8))
        prims.append(add_ellipsoid_prim(( .060*s,1.87*s,.02*s),(.072*s,.050*s,.026*s),ji['head'],m_pink,seg=16,rings=8))
    if spec['outfit']=='apron_dress':
        prims.append(add_box_prim((0,1.14*s,-.145*s),(.31*s,.40*s,.016*s),ji['chest'],m_cream))
        prims.append(add_box_prim((0,.84*s,-.14*s),(.36*s,.18*s,.016*s),ji['hips'],m_cream))

    # Pack all primitives as a single skinned mesh.
    mesh_prims=[]
    for p in prims:
        pos=np.asarray(p.pos,np.float32); idx=np.asarray(p.idx,np.uint32)
        normals=np.zeros_like(pos); faces=idx.reshape(-1,3)
        for tri in faces:
            a,bv,c=pos[tri]; n=np.cross(bv-a,c-a); ln=np.linalg.norm(n)
            if ln>1e-9:n/=ln
            normals[tri]+=n
        ln=np.linalg.norm(normals,axis=1);ln[ln<1e-9]=1;normals/=ln[:,None]
        acc_pos=b.accessor(pos,np.float32,'VEC3',target=34962,calc_minmax=True)
        acc_n=b.accessor(normals,np.float32,'VEC3',target=34962)
        acc_uv=b.accessor(np.asarray(p.uv,np.float32),np.float32,'VEC2',target=34962)
        acc_j=b.accessor(np.asarray(p.joints,np.uint16),np.uint16,'VEC4',target=34962)
        acc_w=b.accessor(np.asarray(p.weights,np.float32),np.float32,'VEC4',target=34962)
        acc_i=b.accessor(idx,np.uint32,'SCALAR',target=34963)
        mesh_prims.append({'attributes':{'POSITION':acc_pos,'NORMAL':acc_n,'TEXCOORD_0':acc_uv,'JOINTS_0':acc_j,'WEIGHTS_0':acc_w},'indices':acc_i,'material':p.mat})
    b.doc['meshes'].append({'name':f'{spec["code"]}_BodyMesh','primitives':mesh_prims}); mesh_index=0

    # Skeleton hierarchy.
    node_by_name={}
    for n in joint_names:
        par=parent[n]; p=np.asarray(abspos[n]); pp=np.asarray(abspos[par]) if par else np.zeros(3); node_by_name[n]=b.add_node(n,translation=(p-pp).tolist(),extras={'joint':True})
    for n in joint_names:
        par=parent[n]
        if par:b.doc['nodes'][node_by_name[par]].setdefault('children',[]).append(node_by_name[n])
    armature=b.add_node(f'{spec["code"]}_Armature',children=[node_by_name['hips']],extras={'rig':'shared-humanoid-v1'})
    hsock=b.add_node('headSocket',translation=[0,.20*s,0],extras={'socket':'head'});b.doc['nodes'][node_by_name['head']].setdefault('children',[]).append(hsock)
    for nm,pos in [('leftEye',[-.07*s,.035*s,-.18*s]),('rightEye',[.07*s,.035*s,-.18*s]),('mouth',[0,-.06*s,-.19*s])]:
        ai=b.add_node(nm,translation=pos,extras={'semanticFaceTarget':True});b.doc['nodes'][node_by_name['head']].setdefault('children',[]).append(ai)
    face_alias=b.add_node('approvedFacePatch',translation=[0,0,0],extras={'semantic':'approved-face-texture','source':f'/approved-character-turnarounds/{cid}-approved-turnaround.png'});b.doc['nodes'][node_by_name['head']].setdefault('children',[]).append(face_alias)

    ibm=[]
    for n in joint_names:
        x,y,z=abspos[n];M=np.eye(4,dtype=np.float32);M[:3,3]=[-x,-y,-z];ibm.append(M.T.reshape(-1))
    ibm_acc=b.accessor(np.asarray(ibm,np.float32),np.float32,'MAT4')
    b.doc['skins'].append({'name':f'{spec["code"]}_HumanoidSkin','inverseBindMatrices':ibm_acc,'skeleton':node_by_name['hips'],'joints':[node_by_name[n] for n in joint_names]})
    mesh_node=b.add_node(f'{spec["code"]}_Body',mesh=mesh_index,skin=0,extras={'primaryClothingMesh':True,'candidate':'W29-V1'})
    b.doc['scenes'][0]['nodes']=[armature,mesh_node]

    # Animation helpers. Same names/contract as John, scaled translations.
    def clip(name,duration,tracks):
        anim={'name':name,'samplers':[],'channels':[]}
        for node_name,path,times,values in tracks:
            inp=b.accessor(np.asarray(times,np.float32),np.float32,'SCALAR',calc_minmax=True); typ='VEC4' if path=='rotation' else 'VEC3';out=b.accessor(np.asarray(values,np.float32),np.float32,typ)
            si=len(anim['samplers']);anim['samplers'].append({'input':inp,'output':out,'interpolation':'LINEAR'});anim['channels'].append({'sampler':si,'target':{'node':node_by_name[node_name],'path':path}})
        b.doc['animations'].append(anim)
    def rot_track(node,times,angles,axis=(1,0,0)):return (node,'rotation',times,[quat(axis,a) for a in angles])
    def trans_track(node,times,offsets):
        basev=np.array(abspos[node],float)-(np.array(abspos[parent[node]],float) if parent[node] else 0)
        return (node,'translation',times,[(basev+np.array(o)*s).tolist() for o in offsets])
    clip('Idle',2.4,[rot_track('chest',[0,1.2,2.4],[0,.025,0],(0,0,1)),rot_track('head',[0,1.2,2.4],[0,-.035,0],(0,1,0)),trans_track('hips',[0,1.2,2.4],[(0,0,0),(0,.008,0),(0,0,0)])])
    t=[0,.25,.5,.75,1.0]
    clip('Walk',1.0,[rot_track('leftHip',t,[.48,0,-.48,0,.48]),rot_track('rightHip',t,[-.48,0,.48,0,-.48]),rot_track('leftKnee',t,[.08,.36,.08,.03,.08]),rot_track('rightKnee',t,[.08,.03,.08,.36,.08]),rot_track('leftShoulder',t,[-.42,0,.42,0,-.42]),rot_track('rightShoulder',t,[.42,0,-.42,0,.42]),trans_track('hips',t,[(0,0,0),(0,.010,0),(0,0,0),(0,.010,0),(0,0,0)])])
    tr=[0,.18,.36,.54,.72];clip('Run',.72,[rot_track('leftHip',tr,[.82,0,-.82,0,.82]),rot_track('rightHip',tr,[-.82,0,.82,0,-.82]),rot_track('leftShoulder',tr,[-.72,0,.72,0,-.72]),rot_track('rightShoulder',tr,[.72,0,-.72,0,.72])])
    sr=[0,.14,.28,.42,.56];clip('Sprint',.56,[rot_track('leftHip',sr,[1.02,0,-1.02,0,1.02]),rot_track('rightHip',sr,[-1.02,0,1.02,0,-1.02]),rot_track('leftShoulder',sr,[-.86,0,.86,0,-.86]),rot_track('rightShoulder',sr,[.86,0,-.86,0,.86])])
    clip('Start_Move',.30,[rot_track('leftHip',[0,.15,.30],[0,.32,.48]),rot_track('rightHip',[0,.15,.30],[0,-.25,-.40])])
    clip('Stop_Move',.34,[rot_track('leftHip',[0,.17,.34],[.42,.16,0]),rot_track('rightHip',[0,.17,.34],[-.34,-.12,0])])
    clip('Turn_Left',.65,[rot_track('hips',[0,.32,.65],[0,.28,0],(0,1,0)),rot_track('chest',[0,.32,.65],[0,-.16,0],(0,1,0))])
    clip('Turn_Right',.65,[rot_track('hips',[0,.32,.65],[0,-.28,0],(0,1,0)),rot_track('chest',[0,.32,.65],[0,.16,0],(0,1,0))])
    clip('Jump',.55,[rot_track('leftHip',[0,.2,.55],[0,-.45,-.15]),rot_track('rightHip',[0,.2,.55],[0,-.45,-.15]),rot_track('leftKnee',[0,.2,.55],[0,.62,.25]),rot_track('rightKnee',[0,.2,.55],[0,.62,.25])])
    clip('Fall',.75,[rot_track('leftShoulder',[0,.75],[-.22,-.22]),rot_track('rightShoulder',[0,.75],[-.22,-.22])])
    clip('Land',.42,[rot_track('leftKnee',[0,.16,.42],[0,.7,0]),rot_track('rightKnee',[0,.16,.42],[0,.7,0]),rot_track('chest',[0,.16,.42],[0,.16,0])])
    clip('Mantle',.72,[rot_track('leftShoulder',[0,.20,.48,.72],[0,-1.35,-.65,0]),rot_track('rightShoulder',[0,.20,.48,.72],[0,-1.35,-.65,0])])
    clip('Crouch',1.0,[rot_track('leftHip',[0,.35,1],[0,-.38,-.38]),rot_track('rightHip',[0,.35,1],[0,-.38,-.38]),rot_track('leftKnee',[0,.35,1],[0,.62,.62]),rot_track('rightKnee',[0,.35,1],[0,.62,.62])])
    clip('Aim',1.0,[rot_track('rightShoulder',[0,1],[1.18,1.18]),rot_track('leftShoulder',[0,1],[1.05,1.05])])
    clip('Fire',.25,[rot_track('rightShoulder',[0,.08,.25],[1.18,1.32,1.18]),rot_track('leftShoulder',[0,.08,.25],[1.05,1.18,1.05])])
    clip('Hit_Reaction',.48,[rot_track('chest',[0,.16,.48],[0,.22,0],(0,0,1)),rot_track('head',[0,.16,.48],[0,-.20,0],(0,1,0))])
    clip('Wave',1.5,[rot_track('rightShoulder',[0,.4,1.1,1.5],[0,-1.65,-1.65,0],(0,0,1)),rot_track('rightElbow',[0,.4,.65,.9,1.1,1.5],[0,-.6,-.25,-.7,-.35,0])])
    clip('Celebrate',1.25,[rot_track('leftShoulder',[0,.35,1.0,1.25],[0,-2.15,-2.15,0]),rot_track('rightShoulder',[0,.35,1.0,1.25],[0,-2.15,-2.15,0])])
    clip('Sit',1.0,[rot_track('leftHip',[0,1],[0,1.35]),rot_track('rightHip',[0,1],[0,1.35]),rot_track('leftKnee',[0,1],[0,-1.25]),rot_track('rightKnee',[0,1],[0,-1.25])])

    b.doc['asset']['extras']={'phase':'W29','familyV1Candidate':True,'sourceReference':f'/approved-character-turnarounds/{cid}-approved-turnaround.png','character':spec['display'],'characterId':cid,'authoredClipCount':len(b.doc['animations']),'skinned':True,'artDirection':'stylized-realism-v1','visualGate':'family-v1-device-pending','knownLimitation':'side/rear hair and head refinement deferred'}
    out=OUT_DIR/f'{spec["code"]}.glb'; size=b.finish(out); print(f'WROTE {out.relative_to(ROOT)} {size/1024:.1f} KiB clips={len(b.doc["animations"])}')
    return out


def main():
    OUT_DIR.mkdir(parents=True,exist_ok=True)
    manifest={}
    for cid,spec in SPECS.items():
        out=build_human(cid,spec);manifest[cid]={'code':spec['code'],'displayName':spec['display'],'model':'/'+str(out.relative_to(ROOT/'public')).replace('\\','/'),'turnaround':f'/approved-character-turnarounds/{cid}-approved-turnaround.png','status':'V1_CANDIDATE_DEVICE_PENDING'}
    (ROOT/'public'/'w29-family-v1-manifest.json').write_text(json.dumps({'version':'W29-FAMILY-V1-CANDIDATES','characters':manifest},indent=2))

if __name__=='__main__':main()
