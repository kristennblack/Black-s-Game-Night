from PIL import Image, ImageOps, ImageDraw, ImageFont
from pathlib import Path
import json, math
root=Path('/mnt/data/w24_earrings_build/public')
fits=json.load(open('/mnt/data/w24_fit_values.json'))
items=[
('w24-e01-small-studs','E01 Small Stud Earrings','cosmetics/w24-flagship-earrings/e01-small-studs.png'),
('w24-e02-medium-hoops','E02 Medium Hoop Earrings','cosmetics/w24-flagship-earrings/e02-medium-hoops.png'),
('w24-e03-pearl-drops','E03 Pearl Drop Earrings','cosmetics/w24-flagship-earrings/e03-pearl-drops.png'),
('w24-e04-gem-dangles','E04 Gem Dangle Earrings','cosmetics/w24-flagship-earrings/e04-gem-dangles.png'),
('w24-e05-heart-charms','E05 Heart Charm Earrings','cosmetics/w24-flagship-earrings/e05-heart-charms.png'),
('w24-e06-statement-earrings','E06 Statement Fashion Earrings','cosmetics/w24-flagship-earrings/e06-statement-earrings.png')]
avatars=[
('john','John','avatars/styles/john-look-01.jpg'),('kristen','Kristen','avatars/styles/kristen-cute.jpg'),('holly','Holly','avatars/styles/holly-cute.jpg'),('vanessa','Vanessa','avatars/styles/vanessa-cute.jpg'),('elizabeth','Elizabeth / Lizzy','avatars/styles/elizabeth-cute.jpg'),('logan','Logan','avatars/styles/logan-cute.jpg'),('james','James','avatars/styles/james-cute.jpg'),('dorothy','Dorothy','avatars/styles/dorothy-cute.jpg'),('papa','Papa','avatars/styles/papa-cute.jpg'),('nana','Nana','avatars/styles/nana-cute.jpg'),('kelsi','Kelsi','avatars/styles/kelsi-cute.jpg'),('molly','Molly','avatars/styles/molly-cute.jpg'),('gunner','Gunner','avatars/styles/gunner-cute.jpg')]
W,H=171,214; gap=10; cols=7; cardw=185; cardh=250
canvas=Image.new('RGB',(18+cols*cardw+gap*(cols-1)+18, 110+len(items)*(2*cardh+70)),(12,17,23)); d=ImageDraw.Draw(canvas)
try:
    ftitle=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf',28)
    fhead=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf',20)
    fname=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf',12)
    fmeta=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',10)
except: ftitle=fhead=fname=fmeta=None

d.text((18,14),'W24 Flagship Earrings - Actual App Avatar Fit Matrix',font=ftitle,fill=(247,234,210))
d.text((18,52),'Six approved-art earrings | semantic earlobe anchors | 13 app avatar portraits | Build 49 integration QA',font=fmeta,fill=(184,196,208))
y0=90
for item_id,label,assetrel in items:
    d.text((18,y0),label,font=fhead,fill=(227,187,99)); y=y0+34
    asset=Image.open(root/assetrel).convert('RGBA')
    for idx,(akey,name,arel) in enumerate(avatars):
        row=idx//cols; col=idx%cols; x=18+col*(cardw+gap); cy=y+row*cardh
        d.rounded_rectangle((x,cy,x+cardw-1,cy+cardh-1),radius=10,fill=(21,30,40),outline=(66,85,107),width=1)
        av=Image.open(root/arel).convert('RGB'); av=ImageOps.fit(av,(W,H),method=Image.Resampling.LANCZOS,centering=(.5,.5)).convert('RGBA')
        f=fits[item_id][akey]
        ow=max(1,round(W*f['w']/100)); oh=round(asset.height*ow/asset.width)
        ov=asset.resize((ow,oh),Image.Resampling.LANCZOS)
        r=float(f.get('r',0) or 0)
        if abs(r)>.01: ov=ov.rotate(-r,resample=Image.Resampling.BICUBIC,expand=True)
        cx=round(W*f['x']/100); yy=round(H*f['y']/100)
        px=cx-ov.width//2; py=yy-ov.height//2
        av.alpha_composite(ov,(px,py))
        canvas.paste(av.convert('RGB'),(x+7,cy+7))
        d.text((x+7,cy+224),name,font=fname,fill=(247,234,210))
        d.text((x+7,cy+239),f"x {f['x']:.1f} y {f['y']:.1f} w {f['w']:.1f} r {r:.1f}",font=fmeta,fill=(155,176,195))
    y0=y+2*cardh+35
out='/mnt/data/W24_EARRINGS_ACTUAL_AVATAR_FIT_MATRIX.png'; canvas.save(out,quality=95); print(out)
