#!/usr/bin/env python3
from pathlib import Path
import json, struct, sys, hashlib
ROOT=Path(__file__).resolve().parents[1]

def glb_json(path):
    raw=path.read_bytes()
    assert raw[:4]==b'glTF', f'{path}: missing glTF header'
    version,total=struct.unpack_from('<II',raw,4)
    assert version==2 and total==len(raw), f'{path}: invalid GLB header'
    off=12;doc=None
    while off < len(raw):
        ln,typ=struct.unpack_from('<II',raw,off);off+=8
        chunk=raw[off:off+ln];off+=ln
        if typ==0x4E4F534A:doc=json.loads(chunk.decode('utf-8').rstrip('\x00 '))
    assert doc is not None, f'{path}: JSON chunk missing'
    return doc,raw

def triangles(doc):
    total=0
    for mesh in doc.get('meshes',[]):
        for p in mesh.get('primitives',[]):
            if p.get('mode',4)!=4: continue
            if 'indices' in p:
                total += doc['accessors'][p['indices']]['count']//3
            elif 'POSITION' in p.get('attributes',{}):
                total += doc['accessors'][p['attributes']['POSITION']]['count']//3
    return total

def node_names(doc): return {n.get('name','') for n in doc.get('nodes',[])}
def anim_names(doc): return {a.get('name','') for a in doc.get('animations',[])}

def audit_john():
    p=ROOT/'public/models/characters/john-production-skinned.glb';doc,raw=glb_json(p)
    required={'Idle','Walk','Run','Turn_Left','Turn_Right','Jump','Fall','Land','Aim','Fire','Hit_Reaction','Wave','Celebrate','Sit'}
    sockets={'rightHandSocket','leftHandSocket','backSocket','headSocket'}
    assert len(doc.get('skins',[]))>=1, 'John requires a real glTF skin'
    assert required <= anim_names(doc), f'John missing clips: {sorted(required-anim_names(doc))}'
    assert sockets <= node_names(doc), f'John missing sockets: {sorted(sockets-node_names(doc))}'
    attrs=[pr.get('attributes',{}) for m in doc.get('meshes',[]) for pr in m.get('primitives',[])]
    assert any('JOINTS_0' in a and 'WEIGHTS_0' in a for a in attrs), 'John mesh is not skinned'
    mats={m.get('name','') for m in doc.get('materials',[])}
    assert 'John_Shirt_PrimaryClothing' in mats, 'primary clothing material contract missing'
    assert doc.get('images'), 'John should embed approved face/clothing textures'
    print(f'PASS John: {len(raw)/1024:.1f} KiB, skins={len(doc.get("skins",[]))}, clips={len(doc.get("animations",[]))}, triangles={triangles(doc):,}, embeddedImages={len(doc.get("images",[]))}')
    return raw

def audit_scene(rel, required_names, label, min_nodes, min_bytes):
    p=ROOT/rel;doc,raw=glb_json(p);names=node_names(doc)
    assert len(doc.get('nodes',[]))>=min_nodes, f'{label}: too few nodes'
    assert len(raw)>=min_bytes, f'{label}: unexpectedly tiny file'
    for token in required_names:
        assert any(token.lower() in n.lower() for n in names), f'{label}: missing named element containing {token}'
    print(f'PASS {label}: {len(raw)/1024:.1f} KiB, nodes={len(doc.get("nodes",[]))}, triangles={triangles(doc):,}, materials={len(doc.get("materials",[]))}')
    return raw

def main():
    john=audit_john()
    env=audit_scene('public/models/environments/papa-shop-barn-production.glb', ['overhead','papa_shop_sign','barn','window','roof','chimney'], 'Papa shop + barn', 300, 150_000)
    props=audit_scene('public/models/sets/papa-shop-production-props.glb', ['chair','fire','tractor','moto','bench','shelf','toolchest','bucket','gas'], 'Papa production prop set', 120, 140_000)
    manifest=json.loads((ROOT/'public/models/manifest.json').read_text())
    assert manifest['characters']['john']['file']=='/models/characters/john-production-skinned.glb'
    assert manifest['environments']['papaShop']['file']=='/models/environments/papa-shop-barn-production.glb'
    assert manifest['sets']['papaShopProps']['file']=='/models/sets/papa-shop-production-props.glb'
    proof=ROOT/'PAPA_SHOP_VERTICAL_SLICE_PHONE_RENDER.png'
    assert proof.exists() and proof.stat().st_size>25_000, 'phone-aspect proof render missing/suspiciously small'
    print(f'PASS proof render: {proof.stat().st_size/1024:.1f} KiB')
    h=hashlib.sha256(john+env+props).hexdigest()
    print('PASS Phase G asset bundle fingerprint:',h)
    print('STATUS: technical asset gate PASS; real-phone visual gate remains UNVERIFIED.')

if __name__=='__main__':
    try:main()
    except Exception as e:
        print('FAIL:',e,file=sys.stderr);sys.exit(1)
