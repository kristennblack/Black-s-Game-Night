#!/usr/bin/env python3
"""W39 furniture metadata repair.

Repairs only high-confidence core-furniture Subcategory mismatches inferred from the
human-readable Item Name. IDs, categories, pricing, ownership, art status and
approved/live status are never changed.
"""
from __future__ import annotations
import json
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
JSON_PATH=ROOT/'public/cabin-room-catalog-w20.json'
MJS_PATH=ROOT/'public/cabin-room-catalog.mjs'

RULES={
 'Beds & Bedroom Furniture':[
  (('bunk bed','loft bed'),'Bunk Bed'),(('canopy bed',),'Canopy Bed'),(('four-poster','four poster'),'Four-Poster Bed'),
  (('daybed','day bed','trundle'),'Daybed / Trundle'),(('storage bed',),'Storage Bed'),(('floating bed',),'Floating Bed'),
  (('upholstered bed',),'Upholstered Bed'),(('sleigh bed',),'Sleigh Bed'),(('platform bed',),'Platform Bed'),
  (('single bed',),'Single Bed'),(('double cabin bed','double bed',),'Double Bed'),(('cabin bed',),'Cabin Bed')],
 'Seating':[
  (('loveseat','love seat'),'Loveseat'),(('chaise',),'Chaise Lounge'),(('rocking chair','rocker'),'Rocking Chair'),
  (('recliner',),'Recliner'),(('barrel chair',),'Barrel Chair'),(('desk chair',),'Desk Chair'),(('dining chair',),'Dining Chair'),
  (('reading chair',),'Reading Chair'),(('armchair','arm chair'),'Armchair'),(('bean bag','beanbag'),'Bean Bag'),
  (('bench',),'Bench'),(('sofa','couch'),'Sofa'),(('stool',),'Stool')],
 'Tables & Desks':[
  (('nightstand','bedside table'),'Nightstand'),(('coffee table',),'Coffee Table'),(('writing desk','fold-down','fold down'),'Writing Desk'),
  (('secretary desk',),'Secretary Desk'),(('vanity',),'Vanity Desk'),(('game table',),'Game Table'),(('dining table',),'Dining Table'),
  (('farm table',),'Farm Table'),(('console table',),'Console Table'),(('side table','end table'),'Side Table'),(('desk',),'Desk')],
 'Storage':[
  (('wardrobe','armoire'),'Wardrobe'),(('bookcase','bookshelf','book shelf'),'Bookcase'),(('toy chest','storage chest'),'Storage Chest'),
  (('trophy hutch','hutch'),'Hutch'),(('dresser',),'Dresser'),(('cabinet',),'Cabinet'),(('floating wall shelf','wall shelf'),'Wall Shelf'),
  (('bookshelf','book shelf'),'Bookcase'),(('trunk',),'Storage Trunk')]
}

def infer(item):
    name=str(item.get('Item Name','')).lower()
    for keys,label in RULES.get(item.get('Category'),[]):
        if any(k in name for k in keys): return label
    return None

def main():
    rows=json.loads(JSON_PATH.read_text())
    changed=[]
    for item in rows:
        intended=infer(item)
        if not intended: continue
        item['W39 Intended Furniture Family']=intended
        old=str(item.get('Subcategory',''))
        if old!=intended:
            item['W39 Previous Subcategory']=old
            item['Subcategory']=intended
            item['W39 Subcategory Repair']='Yes'
            changed.append((item['Item ID'],old,intended))
    JSON_PATH.write_text(json.dumps(rows,indent=2,ensure_ascii=False)+'\n')
    MJS_PATH.write_text('export const CABIN_ROOM_ITEM_CATALOG='+json.dumps(rows,separators=(',',':'),ensure_ascii=False)+';\nexport const CABIN_ROOM_ITEM_BY_ID=Object.fromEntries(CABIN_ROOM_ITEM_CATALOG.map(x=>[x[\'Item ID\'],x]));\n')
    print(f'W39 repaired {len(changed)} high-confidence furniture subcategory records.')
    for r in changed[:20]: print('  ',*r)

if __name__=='__main__': main()
