from PIL import Image
from pathlib import Path
root=Path('/mnt/data/w24_earrings_build/public/cosmetics/w24-flagship-earrings')
scales={'e01-small-studs':.82,'e02-medium-hoops':.64,'e03-pearl-drops':.72,'e04-gem-dangles':.68,'e05-heart-charms':.70,'e06-statement-earrings':.62}
for name,scale in scales.items():
    src=Image.open(root/(name+'.png')).convert('RGBA')
    dst=Image.new('RGBA',src.size,(0,0,0,0))
    for i,(x0,x1) in enumerate([(0,256),(256,512)]):
        half=src.crop((x0,0,x1,512)); bbox=half.getbbox()
        if not bbox: continue
        obj=half.crop(bbox); nw=max(1,round(obj.width*scale)); nh=max(1,round(obj.height*scale)); obj=obj.resize((nw,nh),Image.Resampling.LANCZOS)
        cx=x0+(bbox[0]+bbox[2])//2; cy=(bbox[1]+bbox[3])//2
        dst.alpha_composite(obj,(cx-nw//2,cy-nh//2))
    out=root/('dog-'+name+'.png'); dst.save(out); print(out)
