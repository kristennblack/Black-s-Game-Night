from pathlib import Path
import subprocess, textwrap

root=Path('/mnt/data/w24_earrings_build')
out=root/'public'/'cosmetics'/'w24-flagship-earrings'
work=root/'tools'/'w24-earring-scad'
out.mkdir(parents=True,exist_ok=True)
work.mkdir(parents=True,exist_ok=True)

COMMON='''
$fn=42;
GOLD=[0.92,0.65,0.12];
SILVER=[0.80,0.84,0.88];
PEARL=[0.94,0.91,0.82];
EMERALD=[0.02,0.47,0.29];
PINK=[0.95,0.45,0.55];
INK=[0.10,0.09,0.12];
module torus(R=4,t=0.65){ rotate_extrude(convexity=10) translate([R,0,0]) circle(r=t); }
module link(len=3,r=.42){ rotate([90,0,0]) cylinder(h=len,r=r,center=true); }
module heart2d(s=1){ scale([s,s]) union(){ translate([-1.1,1.0]) circle(r=1.6); translate([1.1,1.0]) circle(r=1.6); rotate([0,0,45]) translate([-1.9,-1.9]) square([3.8,3.8]); } }
module diamond2d(outer=5,inner=3){ difference(){ rotate(45) square([outer,outer],center=true); rotate(45) square([inner,inner],center=true); } }
'''

designs={
'e01-small-studs': COMMON+'''
module one(x,tilt){ translate([x,0,0]) rotate([0,tilt,0]) { color(SILVER) sphere(r=1.75); } }
one(-15,12); one(15,-12);
''',
'e02-medium-hoops': COMMON+'''
module one(x,tilt){ translate([x,-1,0]) rotate([0,tilt,0]) { color(GOLD) torus(5.3,.72); color([1.0,.78,.24]) translate([0,5.2,0]) sphere(r=.8); } }
one(-15,10); one(15,-10);
''',
'e03-pearl-drops': COMMON+'''
module one(x,tilt){ translate([x,1,0]) rotate([0,tilt,0]) { color(GOLD) sphere(r=1.15); color(GOLD) translate([0,-1.9,0]) link(1.6,.38); color(PEARL) translate([0,-5.3,0]) scale([1.0,1.22,1.0]) sphere(r=2.0); } }
one(-15,8); one(15,-8);
''',
'e04-gem-dangles': COMMON+'''
module gem(){ color(EMERALD) rotate([0,0,45]) linear_extrude(height=2.6,center=true,convexity=10) offset(r=.25) square([4.8,4.8],center=true); color([1.0,.83,.30]) translate([0,0,1.5]) rotate([0,0,45]) linear_extrude(height=.28,center=true) difference(){ square([5.4,5.4],center=true); square([4.45,4.45],center=true); } }
module one(x,tilt){ translate([x,1,0]) rotate([0,tilt,0]) { color(GOLD) sphere(r=1.05); color(GOLD) translate([0,-1.9,0]) link(1.5,.35); translate([0,-6.2,0]) gem(); } }
one(-15,8); one(15,-8);
''',
'e05-heart-charms': COMMON+'''
module charm(){ color(PINK) rotate([0,8,0]) linear_extrude(height=2.8,center=true,convexity=10) offset(r=.18) heart2d(.95); color([1.0,.78,.28]) translate([0,0,1.55]) linear_extrude(height=.24,center=true) difference(){ offset(r=.35) heart2d(.95); offset(delta=-.18) heart2d(.95); } }
module one(x,tilt){ translate([x,1,0]) rotate([0,tilt,0]) { color(GOLD) sphere(r=1.05); color(GOLD) translate([0,-1.9,0]) link(1.5,.35); translate([0,-6.5,0]) charm(); } }
one(-15,7); one(15,-7);
''',
'e06-statement-earrings': COMMON+'''
module frame(){ color(GOLD) rotate([0,9,0]) linear_extrude(height=2.8,center=true,convexity=10) diamond2d(7.4,5.1); color(INK) translate([0,0,-.1]) rotate([0,9,0]) linear_extrude(height=1.5,center=true) rotate(45) square([3.2,3.2],center=true); }
module one(x,tilt){ translate([x,2,0]) rotate([0,tilt,0]) { color(GOLD) sphere(r=1.25); color(GOLD) translate([0,-2.0,0]) link(1.6,.42); translate([0,-7.3,0]) frame(); } }
one(-15,7); one(15,-7);
'''
}

for name,scad in designs.items():
    
    sp=work/(name+'.scad'); raw=work/(name+'-raw.png'); final=out/(name+'.png')
    sp.write_text(scad)
    cmd=['xvfb-run','-a','openscad','-o',str(raw),'--imgsize=512,512','--projection=ortho','--camera=0,0,-2,0,0,0,90',str(sp)]
    subprocess.run(cmd,check=True,stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
    # OpenSCAD uses a pale background. Remove it with generous fuzz, then lightly trim only vertical excess.
    subprocess.run(['/opt/imagemagick/bin/convert',str(raw),'-alpha','on','-transparent','#ffffe5',str(final)],check=True)
    print(final)
