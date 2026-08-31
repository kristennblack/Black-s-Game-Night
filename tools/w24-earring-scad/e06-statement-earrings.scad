
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

module frame(){ color(GOLD) rotate([0,9,0]) linear_extrude(height=2.8,center=true,convexity=10) diamond2d(7.4,5.1); color(INK) translate([0,0,-.1]) rotate([0,9,0]) linear_extrude(height=1.5,center=true) rotate(45) square([3.2,3.2],center=true); }
module one(x,tilt){ translate([x,2,0]) rotate([0,tilt,0]) { color(GOLD) sphere(r=1.25); color(GOLD) translate([0,-2.0,0]) link(1.6,.42); translate([0,-7.3,0]) frame(); } }
one(-15,7); one(15,-7);
