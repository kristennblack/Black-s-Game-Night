from pathlib import Path
import json,re
root=Path('/mnt/data/w24_earrings_build')
p=root/'public/avatar-cosmetics.mjs'; s=p.read_text(); m=re.search(r'export const COSMETIC_CATALOG=(\[.*?\]);\nexport const COSMETIC_BY_ID=',s,re.S); cat=json.loads(m.group(1))
# Remove the temporary six added records so W20's exact 2,000-record catalog remains intact.
cat=[x for x in cat if not x.get('id','').startswith('w24-e0')]
selected=[
('wear-jewelry-0032-vanessa-modern-woven-beaded-stud-earrings','W24-E01','Small Stud Earrings','e01-small-studs.png','Premium',120,'Polished silver studs with real 3D form, soft highlights, and clean low-profile fit.'),
('wear-jewelry-0036-vanessa-modern-curved-beaded-hoop-earrings','W24-E02','Medium Hoop Earrings','e02-medium-hoops.png','Premium',160,'Polished gold hoops with dimensional tube geometry and a clean everyday silhouette.'),
('wear-jewelry-0041-retro-closet-woven-plaid-drop-earrings','W24-E03','Pearl Drop Earrings','e03-pearl-drops.png','Premium',190,'Soft pearl drops with gold hardware, dimensional shading, and a refined hanging profile.'),
('wear-jewelry-0046-vanessa-modern-slatted-gold-stud-earrings','W24-E04','Gem Dangle Earrings','e04-gem-dangles.png','Premium',220,'Emerald-tone gem dangles with gold edging and a bold, dimensional dressy finish.'),
('wear-jewelry-0050-vanessa-modern-woven-gold-hoop-earrings','W24-E05','Heart Charm Earrings','e05-heart-charms.png','Premium',170,'Pink heart charms with gold trim, dimensional enamel-style surfaces, and a playful premium finish.'),
('wear-jewelry-0055-retro-closet-slatted-turquoise-drop-earrings','W24-E06','Statement Fashion Earrings','e06-statement-earrings.png','Legendary',260,'Bold gold diamond-frame earrings with dark resin insets and a strong fashion-forward silhouette.')]
by={x['id']:x for x in cat}
for iid,sku,name,file,rarity,price,desc in selected:
    x=by[iid]
    x.update(sku=sku,name=name,price=price,asset='/cosmetics/generated/w24-flagship-earrings/'+file,shopAsset='/cosmetics/generated/w24-flagship-earrings/shop-'+file,dogAsset='/cosmetics/generated/w24-flagship-earrings/dog-'+file,category='Jewelry',collection='W24 Flagship Earrings',rarity=rarity,source='token',desc=desc,role='Hero',fitMode='semantic-earlobes',fitAnchor='earlobes',dogAdaptation='Scaled ear-charm adaptation using the same approved design identity.',giftable=True,animated=False,catalogVersion=24,artStatus='Approved Art',reviewStatus='Approve Concept',approvedForLive=False,variantStrategy='finish-options',stage1Technical='Integrated - QA Running',stage2Visual='Geometry Fit Approved - Device Pending',fitAuditStatus='Geometry Fit Approved',visualRuntimeStatus='Production Art Integrated',geometryFitProof='13/13 actual app portraits reviewed; 2026-08-31',productionNotes='Approved W24 flagship earring art integrated into an existing W20 catalog record. Store uses single-ear 3D hero render; equipped overlay uses matched human pair or scaled dog ear-charm pair. Device approval remains required.')
cat_json=json.dumps(cat,separators=(',',':'))
s=s[:m.start()]+'export const COSMETIC_CATALOG='+cat_json+';\nexport const COSMETIC_BY_ID='+s[m.end():]
p.write_text(s)
# Restore accurate 4,000 total store count while retaining W24 presentation.
sp=root/'public/tokens-store.html'; t=sp.read_text().replace('Search 4,006 items…','Search 4,000 items…').replace('<b id="catalogCount">4,006</b> staging catalog records: <b>2,000 home</b> + <b>2,006 avatar</b>.','<b id="catalogCount">4,000</b> staging catalog records: <b>2,000 home</b> + <b>2,000 avatar</b>.')
sp.write_text(t)
# Update service worker paths after moving assets under /cosmetics/generated/.
sw=root/'public/sw.js'; w=sw.read_text().replace('/cosmetics/w24-flagship-earrings/','/cosmetics/generated/w24-flagship-earrings/'); sw.write_text(w)
print('catalog',len(cat)); print('flagship',[(by[i]['id'],by[i]['name']) for i,*_ in selected])
