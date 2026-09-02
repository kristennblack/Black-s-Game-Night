// W42A.3 portrait-anchor accessory fitting.
// This module is intentionally separate from 3D gameplay wearables.
// Coordinates are percentages of the portrait image (x right, y down).

const P=(x,y)=>({x:Number(x),y:Number(y)});
const human=(cfg)=>({
  calibrated:true,
  dog:false,
  pupils:{left:P(...cfg.leftPupil),right:P(...cfg.rightPupil)},
  bridge:P(...cfg.bridge),
  temples:{left:P(...cfg.leftTemple),right:P(...cfg.rightTemple)},
  ears:{left:P(...cfg.leftEar),right:P(...cfg.rightEar)},
  head:{top:P(...cfg.headTop),left:P(...cfg.headLeft),right:P(...cfg.headRight)},
  yaw:Number(cfg.yaw||0),
  baked:cfg.baked||{},
});
const dog=(cfg)=>({...human(cfg),dog:true});

// Exact current family portrait calibration. The first six entries are the
// user-approved W42A.3 glasses benchmark. Remaining family members establish
// the same semantic point contract so later accessory batches do not fall
// back to one generic head box.
export const FAMILY_PORTRAIT_ANCHORS={
  john:human({
    leftPupil:[36.95,45.0],rightPupil:[56.05,34.0],bridge:[46.5,39.5],
    leftTemple:[27.0,50.8],rightTemple:[66.0,28.2],leftEar:[20.5,51.5],rightEar:[70.5,25.4],
    headTop:[39.0,5.5],headLeft:[16.0,27.0],headRight:[72.0,11.0],yaw:-0.04,
  }),
  kristen:human({
    leftPupil:[41.4,25.8],rightPupil:[66.8,27.0],bridge:[54.1,26.4],
    leftTemple:[30.6,25.3],rightTemple:[77.6,27.5],leftEar:[27.5,33.0],rightEar:[80.5,34.0],
    headTop:[54.0,1.5],headLeft:[25.0,8.0],headRight:[83.0,9.0],yaw:0.08,
  }),
  holly:human({
    leftPupil:[39.9,34.9],rightPupil:[57.1,33.7],bridge:[48.5,34.3],
    leftTemple:[29.0,35.7],rightTemple:[68.0,32.9],leftEar:[25.5,42.0],rightEar:[73.0,39.0],
    headTop:[49.0,7.0],headLeft:[24.0,17.0],headRight:[74.0,15.0],yaw:-0.06,
  }),
  vanessa:human({
    leftPupil:[35.95,28.2],rightPupil:[55.25,23.8],bridge:[45.6,26.0],
    leftTemple:[24.6,30.8],rightTemple:[66.6,21.2],leftEar:[20.5,35.0],rightEar:[71.0,24.0],
    headTop:[45.0,1.5],headLeft:[16.0,10.5],headRight:[75.0,6.0],yaw:-0.06,
  }),
  elizabeth:human({
    leftPupil:[40.6,33.0],rightPupil:[58.6,35.0],bridge:[49.6,34.0],
    leftTemple:[29.7,31.7],rightTemple:[69.5,36.3],leftEar:[25.0,39.0],rightEar:[73.0,42.0],
    headTop:[50.0,6.0],headLeft:[24.0,17.0],headRight:[75.0,20.0],yaw:0.04,
  }),
  lizzy:human({
    leftPupil:[40.6,33.0],rightPupil:[58.6,35.0],bridge:[49.6,34.0],
    leftTemple:[29.7,31.7],rightTemple:[69.5,36.3],leftEar:[25.0,39.0],rightEar:[73.0,42.0],
    headTop:[50.0,6.0],headLeft:[24.0,17.0],headRight:[75.0,20.0],yaw:0.04,
  }),
  logan:human({
    leftPupil:[37.1,35.8],rightPupil:[59.3,30.0],bridge:[48.2,32.9],
    leftTemple:[25.5,38.9],rightTemple:[70.9,26.9],leftEar:[21.0,44.0],rightEar:[75.0,31.0],
    headTop:[47.0,5.0],headLeft:[18.5,20.0],headRight:[79.0,12.0],yaw:-0.05,
  }),
  // These portraits currently include baked eyewear in one or more styles.
  // Points are still recorded so a clean portrait can be swapped in without
  // changing the fitting engine.
  james:human({
    leftPupil:[30.0,32.0],rightPupil:[53.5,27.5],bridge:[41.8,29.8],
    leftTemple:[19.0,34.0],rightTemple:[66.0,25.0],leftEar:[14.0,40.0],rightEar:[70.0,30.0],
    headTop:[42.0,4.0],headLeft:[12.0,15.0],headRight:[73.0,9.0],yaw:-0.03,baked:{glasses:true},
  }),
  dorothy:human({
    leftPupil:[45.0,39.0],rightPupil:[68.0,35.5],bridge:[56.5,37.2],
    leftTemple:[34.0,41.0],rightTemple:[78.0,33.0],leftEar:[29.0,45.0],rightEar:[82.0,38.0],
    headTop:[55.0,8.0],headLeft:[26.0,20.0],headRight:[84.0,17.0],yaw:0.08,baked:{glasses:true},
  }),
  papa:human({
    leftPupil:[45.5,41.0],rightPupil:[52.0,39.0],bridge:[49.0,40.0],
    leftTemple:[38.0,44.0],rightTemple:[58.0,37.0],leftEar:[33.0,43.0],rightEar:[64.0,35.0],
    headTop:[45.0,14.0],headLeft:[28.0,26.0],headRight:[66.0,23.0],yaw:0.45,
  }),
  nana:human({
    leftPupil:[35.5,39.5],rightPupil:[57.0,36.0],bridge:[46.2,37.8],
    leftTemple:[25.0,42.0],rightTemple:[68.0,33.5],leftEar:[20.0,48.0],rightEar:[72.0,38.0],
    headTop:[45.0,7.0],headLeft:[18.0,19.0],headRight:[75.0,14.0],yaw:-0.08,baked:{glasses:true},
  }),
  kelsi:dog({
    leftPupil:[38.0,35.5],rightPupil:[55.0,33.0],bridge:[46.5,34.2],
    leftTemple:[27.0,38.0],rightTemple:[66.0,31.0],leftEar:[18.0,26.0],rightEar:[75.0,23.0],
    headTop:[48.0,9.0],headLeft:[20.0,20.0],headRight:[77.0,17.0],yaw:-0.05,
  }),
  molly:dog({
    leftPupil:[37.5,35.5],rightPupil:[56.5,34.0],bridge:[47.0,34.8],
    leftTemple:[25.5,38.0],rightTemple:[68.5,32.0],leftEar:[17.0,25.0],rightEar:[78.0,24.0],
    headTop:[48.0,9.0],headLeft:[19.0,19.0],headRight:[79.0,18.0],yaw:-0.02,
  }),
  gunner:dog({
    leftPupil:[42.0,35.0],rightPupil:[58.5,33.8],bridge:[50.2,34.4],
    leftTemple:[30.0,37.0],rightTemple:[70.0,31.5],leftEar:[18.0,23.0],rightEar:[82.0,22.0],
    headTop:[51.0,8.0],headLeft:[20.0,18.0],headRight:[82.0,17.0],yaw:0.0,
  }),
};

export const EXACT_PORTRAIT_STYLE_ANCHORS={
  'kristen-cute':human({leftPupil:[41.6,25.59],rightPupil:[66.41,26.95],bridge:[54.0,26.27],leftTemple:[26.22,24.74],rightTemple:[81.79,27.8],leftEar:[19.77,29.4],rightEar:[88.23,32.82],headTop:[55.27,4.45],headLeft:[22.58,25.04],headRight:[87.97,25.04]}),
  'kristen-goofy':human({leftPupil:[38.48,27.15],rightPupil:[60.55,30.47],bridge:[49.51,28.81],leftTemple:[24.79,25.09],rightTemple:[74.23,32.53],leftEar:[19.05,28.72],rightEar:[79.97,37.02],headTop:[46.09,9.14],headLeft:[18.67,26.41],headRight:[73.52,26.41]}),
  'kristen-rugged':human({leftPupil:[35.55,25.0],rightPupil:[59.77,25.78],bridge:[47.66,25.39],leftTemple:[20.53,24.52],rightTemple:[74.78,26.27],leftEar:[14.23,29.26],rightEar:[81.08,31.21],headTop:[48.44,4.45],headLeft:[15.53,25.04],headRight:[81.34,25.04],baked:{glasses:true}}),
  'kristen-glam':human({leftPupil:[26.56,26.56],rightPupil:[52.34,27.73],bridge:[39.45,27.15],leftTemple:[10.58,25.84],rightTemple:[68.33,28.46],leftEar:[3.88,30.53],rightEar:[75.03,33.46],headTop:[41.8,4.45],headLeft:[8.89,25.04],headRight:[74.7,25.04]}),
  'holly-cute':human({leftPupil:[39.84,34.77],rightPupil:[57.13,33.89],bridge:[48.49,34.33],leftTemple:[29.13,35.31],rightTemple:[67.85,33.34],leftEar:[24.63,38.92],rightEar:[72.34,36.73],headTop:[49.61,12.91],headLeft:[25.98,27.79],headRight:[73.23,27.79]}),
  'holly-goofy':human({leftPupil:[40.82,33.59],rightPupil:[57.13,33.89],bridge:[48.97,33.74],leftTemple:[30.71,33.41],rightTemple:[67.24,34.07],leftEar:[26.47,36.87],rightEar:[71.48,37.61],headTop:[49.61,17.8],headLeft:[25.98,32.67],headRight:[73.23,32.67]}),
  'holly-rugged':human({leftPupil:[39.65,33.79],rightPupil:[56.93,33.69],bridge:[48.29,33.74],leftTemple:[28.93,33.85],rightTemple:[67.65,33.63],leftEar:[24.44,37.36],rightEar:[72.14,37.12],headTop:[49.61,17.8],headLeft:[25.98,32.67],headRight:[73.23,32.67]}),
  'holly-glam':human({leftPupil:[41.41,31.84],rightPupil:[58.59,35.35],bridge:[50.0,33.59],leftTemple:[30.75,29.66],rightTemple:[69.25,37.53],leftEar:[26.28,32.12],rightEar:[73.72,40.91],headTop:[49.32,18.66],headLeft:[29.59,31.08],headRight:[69.04,31.08]}),
  'vanessa-cute':human({leftPupil:[35.74,28.32],rightPupil:[55.27,23.63],bridge:[45.51,25.98],leftTemple:[23.63,31.23],rightTemple:[67.38,20.73],leftEar:[18.55,35.9],rightEar:[72.46,24.18],headTop:[51.56,3.28],headLeft:[24.14,20.55],headRight:[78.98,20.55]}),
  'vanessa-goofy':human({leftPupil:[34.38,32.81],rightPupil:[54.69,27.73],bridge:[44.53,30.27],leftTemple:[21.78,35.96],rightTemple:[67.28,24.59],leftEar:[16.5,40.03],rightEar:[72.56,27.33],headTop:[47.46,12.08],headLeft:[24.47,26.55],headRight:[70.45,26.55]}),
  'vanessa-rugged':human({leftPupil:[35.35,26.37],rightPupil:[56.25,21.88],bridge:[45.8,24.12],leftTemple:[22.39,29.15],rightTemple:[69.21,19.09],leftEar:[16.96,33.14],rightEar:[74.64,21.91],headTop:[47.46,7.39],headLeft:[24.47,21.87],headRight:[70.45,21.87]}),
  'vanessa-glam':human({leftPupil:[34.96,25.98],rightPupil:[54.1,23.24],bridge:[44.53,24.61],leftTemple:[23.09,27.67],rightTemple:[65.97,21.55],leftEar:[18.12,31.43],rightEar:[70.95,24.6],headTop:[47.46,7.39],headLeft:[24.47,21.87],headRight:[70.45,21.87]}),
  'elizabeth-cute':human({leftPupil:[40.33,33.11],rightPupil:[58.5,35.06],bridge:[49.41,34.08],leftTemple:[29.07,31.89],rightTemple:[69.76,36.27],leftEar:[24.35,35.14],rightEar:[74.48,40.02],headTop:[49.61,17.8],headLeft:[25.98,32.67],headRight:[73.23,32.67]}),
  'elizabeth-goofy':human({leftPupil:[42.09,32.13],rightPupil:[59.38,39.06],bridge:[50.73,35.6],leftTemple:[31.37,27.83],rightTemple:[70.09,43.36],leftEar:[26.88,30.43],rightEar:[74.59,47.76],headTop:[44.73,17.8],headLeft:[21.1,32.67],headRight:[68.35,32.67],baked:{glasses:true}}),
  'elizabeth-rugged':human({leftPupil:[42.77,32.62],rightPupil:[58.3,37.21],bridge:[50.54,34.91],leftTemple:[33.15,29.77],rightTemple:[67.93,40.05],leftEar:[29.11,32.1],rightEar:[71.96,43.57],headTop:[49.32,18.66],headLeft:[29.59,31.08],headRight:[69.04,31.08]}),
  'elizabeth-glam':human({leftPupil:[41.31,33.69],rightPupil:[58.01,35.74],bridge:[49.66,34.72],leftTemple:[30.96,32.42],rightTemple:[68.36,37.01],leftEar:[26.61,35.08],rightEar:[72.7,40.2],headTop:[49.32,18.66],headLeft:[29.59,31.08],headRight:[69.04,31.08]}),
  'logan-cute':human({leftPupil:[37.3,36.13],rightPupil:[60.74,30.27],bridge:[49.02,33.2],leftTemple:[22.77,39.77],rightTemple:[75.27,26.64],leftEar:[16.68,44.59],rightEar:[81.37,29.94],headTop:[51.56,14.61],headLeft:[24.14,31.87],headRight:[78.98,31.87]}),
  'logan-goofy':human({leftPupil:[31.64,36.72],rightPupil:[54.49,28.71],bridge:[43.07,32.71],leftTemple:[17.47,41.68],rightTemple:[68.66,23.75],leftEar:[11.53,47.57],rightEar:[74.6,27.55],headTop:[48.44,4.45],headLeft:[15.53,25.04],headRight:[81.34,25.04]}),
  'logan-rugged':human({leftPupil:[24.8,33.01],rightPupil:[48.63,26.37],bridge:[36.72,29.69],leftTemple:[10.03,37.12],rightTemple:[63.41,22.25],leftEar:[3.84,42.83],rightEar:[69.6,26.23],headTop:[41.8,4.45],headLeft:[8.89,25.04],headRight:[74.7,25.04]}),
  'logan-glam':human({leftPupil:[30.08,39.06],rightPupil:[53.12,33.2],bridge:[41.6,36.13],leftTemple:[15.79,42.7],rightTemple:[67.41,29.57],leftEar:[9.8,47.52],rightEar:[73.41,32.87],headTop:[46.09,14.61],headLeft:[18.67,31.87],headRight:[73.52,31.87]}),
  'john-look-01':human({leftPupil:[35.64,47.36],rightPupil:[56.25,34.96],bridge:[45.95,41.16],leftTemple:[22.87,55.05],rightTemple:[69.03,27.27],leftEar:[17.51,61.7],rightEar:[74.38,30.69],headTop:[50.59,11.79],headLeft:[16.62,33.17],headRight:[84.55,33.17]}),
  'john-look-02':human({leftPupil:[36.52,50.78],rightPupil:[54.1,39.84],bridge:[45.31,45.31],leftTemple:[25.62,57.56],rightTemple:[65.0,33.06],leftEar:[21.05,63.17],rightEar:[69.57,35.83],headTop:[47.95,21.45],headLeft:[19.58,39.25],headRight:[76.32,39.25]}),
  'john-look-03':human({leftPupil:[33.2,43.36],rightPupil:[51.37,32.23],bridge:[42.29,37.79],leftTemple:[21.94,50.26],rightTemple:[62.63,25.32],leftEar:[17.22,55.9],rightEar:[67.35,28.06],headTop:[47.95,15.59],headLeft:[19.58,33.39],headRight:[76.32,33.39]}),
  'john-look-04':human({leftPupil:[31.84,46.88],rightPupil:[48.34,37.21],bridge:[40.09,42.04],leftTemple:[21.6,52.87],rightTemple:[58.57,31.21],leftEar:[17.31,57.63],rightEar:[62.86,33.46],headTop:[44.73,22.48],headLeft:[21.1,37.36],headRight:[68.35,37.36]}),
  'john-look-05':human({leftPupil:[31.35,41.31],rightPupil:[50.39,29.69],bridge:[40.87,35.5],leftTemple:[19.54,48.51],rightTemple:[62.2,22.48],leftEar:[14.59,54.21],rightEar:[67.15,25.16],headTop:[47.95,15.59],headLeft:[19.58,33.39],headRight:[76.32,33.39]}),
  'john-look-06':human({leftPupil:[32.23,36.72],rightPupil:[48.83,25.98],bridge:[40.53,31.35],leftTemple:[21.93,43.38],rightTemple:[59.12,19.32],leftEar:[17.62,48.28],rightEar:[63.44,21.42],headTop:[44.73,12.91],headLeft:[21.1,27.79],headRight:[68.35,27.79]}),
  'john-look-07':human({leftPupil:[33.11,42.87],rightPupil:[51.17,33.01],bridge:[42.14,37.94],leftTemple:[21.9,48.99],rightTemple:[62.37,26.89],leftEar:[17.21,54.46],rightEar:[67.07,29.8],headTop:[47.95,15.59],headLeft:[19.58,33.39],headRight:[76.32,33.39]}),
  'john-look-08':human({leftPupil:[33.69,42.09],rightPupil:[53.91,30.08],bridge:[43.8,36.08],leftTemple:[21.16,49.54],rightTemple:[66.44,22.63],leftEar:[15.9,55.29],rightEar:[71.7,25.26],headTop:[47.95,15.59],headLeft:[19.58,33.39],headRight:[76.32,33.39]}),
  'john-look-09':human({leftPupil:[30.08,42.19],rightPupil:[50.88,30.37],bridge:[40.48,36.28],leftTemple:[17.18,49.51],rightTemple:[63.78,23.04],leftEar:[11.77,55.24],rightEar:[69.18,25.7],headTop:[47.95,15.59],headLeft:[19.58,33.39],headRight:[76.32,33.39]}),
  'john-look-10':human({leftPupil:[24.9,50.68],rightPupil:[42.19,38.28],bridge:[33.54,44.48],leftTemple:[14.19,58.37],rightTemple:[52.9,30.59],leftEar:[9.69,64.17],rightEar:[57.4,33.17],headTop:[42.19,21.45],headLeft:[13.92,39.25],headRight:[70.45,39.25]}),
  'john-look-11':human({leftPupil:[27.64,42.87],rightPupil:[47.17,30.37],bridge:[37.4,36.62],leftTemple:[15.53,50.62],rightTemple:[59.28,22.62],leftEar:[10.45,56.43],rightEar:[64.36,25.18],headTop:[42.19,15.59],headLeft:[13.92,33.39],headRight:[70.45,33.39]}),
  'john-look-12':human({leftPupil:[33.11,41.5],rightPupil:[52.73,30.08],bridge:[42.92,35.79],leftTemple:[20.94,48.59],rightTemple:[64.9,22.99],leftEar:[15.83,54.26],rightEar:[70.01,25.7],headTop:[47.95,15.59],headLeft:[19.58,33.39],headRight:[76.32,33.39]}),
  'john-look-13':human({leftPupil:[26.86,46.58],rightPupil:[48.34,35.84],bridge:[37.6,41.21],leftTemple:[13.54,53.24],rightTemple:[61.66,29.18],leftEar:[7.95,58.83],rightEar:[67.25,31.97],headTop:[42.19,21.45],headLeft:[13.92,39.25],headRight:[70.45,39.25]}),
  'john-look-14':human({leftPupil:[29.98,40.53],rightPupil:[47.46,29.1],bridge:[38.72,34.81],leftTemple:[19.14,47.61],rightTemple:[58.3,22.02],leftEar:[14.6,52.6],rightEar:[62.84,24.03],headTop:[44.73,17.8],headLeft:[21.1,32.67],headRight:[68.35,32.67]}),
  'john-look-15':human({leftPupil:[33.5,40.14],rightPupil:[51.66,28.61],bridge:[42.58,34.38],leftTemple:[22.23,47.28],rightTemple:[62.92,21.47],leftEar:[17.51,52.98],rightEar:[67.64,24.17],headTop:[47.95,9.71],headLeft:[19.58,27.57],headRight:[76.32,27.57]}),
  'john-look-16':human({leftPupil:[29.3,40.43],rightPupil:[47.27,29.1],bridge:[38.28,34.77],leftTemple:[18.16,47.45],rightTemple:[58.41,22.08],leftEar:[13.48,53.13],rightEar:[63.08,24.81],headTop:[42.19,9.71],headLeft:[13.92,27.57],headRight:[70.45,27.57]})
};

// Variant overrides are intentionally sparse. A missing variant inherits the
// person's calibrated semantic points rather than reverting to a global box.
// This makes the data contract variant-aware now, while allowing future QA to
// add exact per-look points without changing renderer code.
export const PORTRAIT_VARIANT_OVERRIDES={
  kristen:{2:{baked:{glasses:true}}}, // rugged portrait already contains glasses
  holly:{0:{baked:{earrings:true}}}, // cute portrait contains turquoise studs
  vanessa:{0:{baked:{earrings:true}}}, // cute portrait contains a visible stud
  elizabeth:{0:{baked:{earrings:true}},1:{baked:{glasses:true}}}, // cute has earrings; goofy includes pink glasses
  papa:{1:{baked:{glasses:true}},2:{baked:{glasses:true}}},
  james:{0:{baked:{glasses:true}},1:{baked:{glasses:true}},2:{baked:{glasses:true}},3:{baked:{glasses:true}}},
  dorothy:{0:{baked:{glasses:true}},1:{baked:{glasses:true}},2:{baked:{glasses:true}},3:{baked:{glasses:true}}},
  nana:{0:{baked:{glasses:true}},1:{baked:{glasses:true}},2:{baked:{glasses:true}},3:{baked:{glasses:true}}},
};


const PORTRAIT_STYLE_NAMES=['cute','goofy','rugged','glam'];
export function portraitStyleKey(avatar='john',variant=0){
  const key=String(avatar||'john').toLowerCase();
  const v=Math.max(0,Number(variant)||0);
  if(key==='john')return `john-look-${String(Math.min(16,v+1)).padStart(2,'0')}`;
  return `${key}-${PORTRAIT_STYLE_NAMES[v%PORTRAIT_STYLE_NAMES.length]}`;
}
export function portraitStyleAsset(avatar='john',variant=0){return `/avatars/styles/${portraitStyleKey(avatar,variant)}.jpg`;}

export const W42_PORTRAIT_ASSET_OVERRIDES={
  'round-glasses':'/cosmetics/generated/w42-portrait-3d/round-glasses.png',
  'classic-glasses':'/cosmetics/generated/w42-portrait-3d/classic-glasses.png',
  'heart-glasses':'/cosmetics/generated/w42-portrait-3d/heart-glasses.png',
  'safety-glasses':'/cosmetics/generated/w42-portrait-3d/safety-glasses.png',
};


export const W46_APPROVED_HEADWEAR_ASSET_OVERRIDES={
  'camp-cap':'/cosmetics/generated/w46-approved-headwear/camp-cap.png',
  'cowboy-hat':'/cosmetics/generated/w46-approved-headwear/cowboy-hat.png',
  'winter-toque':'/cosmetics/generated/w46-approved-headwear/winter-toque.png',
  'firefighter-helmet':'/cosmetics/generated/w46-approved-headwear/firefighter-helmet.png',
  'birthday-crown':'/cosmetics/generated/w46-approved-headwear/birthday-crown.png',
  'tiara':'/cosmetics/generated/w46-approved-headwear/tiara.png',
  'legendary-top-hat':'/cosmetics/generated/w46-approved-headwear/legendary-top-hat.png',
  'trail-trouble-cap':'/cosmetics/generated/w46-approved-headwear/trail-trouble-cap.png',
  'prop-hunt-hunter-hat':'/cosmetics/generated/w46-approved-headwear/prop-hunt-hunter-hat.png',
  'mexican-train-cap':'/cosmetics/generated/w46-approved-headwear/mexican-train-cap.png',
  'wear-flagship-w029-wide-brim-sun-hat':'/cosmetics/generated/w46-approved-headwear/wide-brim-sun-hat.png',
  'wear-flagship-w030-canvas-bucket-hat':'/cosmetics/generated/w46-approved-headwear/canvas-bucket-hat.png',
};


// W46 approved Board 01 portrait shaping. The approved product renders use
// natural transparent aspect ratios, so width alone is not enough to make them
// look worn on a portrait. targetDepthScale converts each exact portrait's
// crown-to-seat depth into the desired visible hat height without shrinking the
// approved lateral silhouette.
export const W46_APPROVED_HEADWEAR_PORTRAIT_SHAPING={
  // widthScale keeps the approved lateral silhouette; rollScale damps extreme
  // portrait tilt so a product-render hat still reads as worn rather than pasted.
  'camp-cap':{assetAspect:.787671,targetDepthScale:1.46,seatNudge:-7.0,widthScale:1.00,rollScale:.35},
  'cowboy-hat':{assetAspect:.824713,targetDepthScale:1.95,seatNudge:-6.0,widthScale:1.00,rollScale:.38},
  'winter-toque':{assetAspect:1.190,targetDepthScale:1.72,seatNudge:1.5,widthScale:.88,rollScale:.82},
  'firefighter-helmet':{assetAspect:.699219,targetDepthScale:2.34,seatNudge:0.0,widthScale:1.10,rollScale:.82},
  'birthday-crown':{assetAspect:.788079,targetDepthScale:2.28,seatNudge:0.0,widthScale:1.10,rollScale:.82},
  'tiara':{assetAspect:.524740,targetDepthScale:1.62,seatNudge:-1.0,widthScale:1.05,rollScale:.82},
  'legendary-top-hat':{assetAspect:.830013,targetDepthScale:3.22,seatNudge:0.0,widthScale:1.08,rollScale:.62},
  'trail-trouble-cap':{assetAspect:.883495,targetDepthScale:1.96,seatNudge:0.0,widthScale:1.15,rollScale:.82},
  'prop-hunt-hunter-hat':{assetAspect:1.038023,targetDepthScale:1.45,seatNudge:-7.0,widthScale:.94,rollScale:.35},
  'mexican-train-cap':{assetAspect:.730290,targetDepthScale:2.28,seatNudge:0.0,widthScale:1.10,rollScale:.65},
  'wear-flagship-w029-wide-brim-sun-hat':{assetAspect:.810687,targetDepthScale:1.82,seatNudge:-3.0,widthScale:1.10,rollScale:.52},
  'wear-flagship-w030-canvas-bucket-hat':{assetAspect:.878743,targetDepthScale:2.18,seatNudge:-4.0,widthScale:.93,rollScale:.42},
};

export const W44_HEADWEAR_ASSET_OVERRIDES={
  'cowboy-hat':'/cosmetics/generated/w44-headwear-3d/cowboy-hat.png',
  'firefighter-helmet':'/cosmetics/generated/w44-headwear-3d/firefighter-helmet.png',
  'birthday-crown':'/cosmetics/generated/w44-headwear-3d/birthday-crown.png',
  'tiara':'/cosmetics/generated/w44-headwear-3d/tiara.png',
  'legendary-top-hat':'/cosmetics/generated/w44-headwear-3d/legendary-top-hat.png',
  'mexican-train-cap':'/cosmetics/generated/w44-headwear-3d/mexican-train-cap.png',
};

export const W44_EARRING_SIDE_ASSETS={
  'wear-jewelry-0032-vanessa-modern-woven-beaded-stud-earrings':{
    left:'/cosmetics/generated/w44-earrings/wear-jewelry-0032-vanessa-modern-woven-beaded-stud-earrings-left.png',
    right:'/cosmetics/generated/w44-earrings/wear-jewelry-0032-vanessa-modern-woven-beaded-stud-earrings-right.png'},
  'wear-jewelry-0036-vanessa-modern-curved-beaded-hoop-earrings':{
    left:'/cosmetics/generated/w44-earrings/wear-jewelry-0036-vanessa-modern-curved-beaded-hoop-earrings-left.png',
    right:'/cosmetics/generated/w44-earrings/wear-jewelry-0036-vanessa-modern-curved-beaded-hoop-earrings-right.png'},
  'wear-jewelry-0041-retro-closet-woven-plaid-drop-earrings':{
    left:'/cosmetics/generated/w44-earrings/wear-jewelry-0041-retro-closet-woven-plaid-drop-earrings-left.png',
    right:'/cosmetics/generated/w44-earrings/wear-jewelry-0041-retro-closet-woven-plaid-drop-earrings-right.png'},
  'wear-jewelry-0046-vanessa-modern-slatted-gold-stud-earrings':{
    left:'/cosmetics/generated/w44-earrings/wear-jewelry-0046-vanessa-modern-slatted-gold-stud-earrings-left.png',
    right:'/cosmetics/generated/w44-earrings/wear-jewelry-0046-vanessa-modern-slatted-gold-stud-earrings-right.png'},
  'wear-jewelry-0050-vanessa-modern-woven-gold-hoop-earrings':{
    left:'/cosmetics/generated/w44-earrings/wear-jewelry-0050-vanessa-modern-woven-gold-hoop-earrings-left.png',
    right:'/cosmetics/generated/w44-earrings/wear-jewelry-0050-vanessa-modern-woven-gold-hoop-earrings-right.png'},
  'wear-jewelry-0055-retro-closet-slatted-turquoise-drop-earrings':{
    left:'/cosmetics/generated/w44-earrings/wear-jewelry-0055-retro-closet-slatted-turquoise-drop-earrings-left.png',
    right:'/cosmetics/generated/w44-earrings/wear-jewelry-0055-retro-closet-slatted-turquoise-drop-earrings-right.png'},
};

const GLASSES_GEOMETRY={
  // Width values are based on the actual GLB-derived PNG geometry. The PNGs
  // include temples, so an image-width multiplier near 2.2 made the lenses
  // visibly too small even when the CSS box looked large.
  'round-glasses':{widthMode:'eyes',widthPerEye:3.28,yNudge:0.0},
  'classic-glasses':{widthMode:'eyes',widthPerEye:3.72,yNudge:0.0},
  'heart-glasses':{widthMode:'eyes',widthPerEye:3.22,yNudge:0.45},
  'safety-glasses':{widthMode:'temples',templeScale:1.16,yNudge:0.15},
};

const merge=(base,over)=>{
  if(!over)return base;
  return {...base,...over,baked:{...(base.baked||{}),...(over.baked||{})}};
};
export function portraitAnchorProfile(avatar='john',variant=0){
  const key=String(avatar||'john').toLowerCase();
  const styleKey=portraitStyleKey(key,variant);
  const exact=EXACT_PORTRAIT_STYLE_ANCHORS[styleKey];
  const base=exact||FAMILY_PORTRAIT_ANCHORS[key];
  if(!base)return null;
  const merged=merge(base,PORTRAIT_VARIANT_OVERRIDES[key]?.[Number(variant)||0]);
  return {...merged,portraitStyleKey:styleKey,exactCalibration:!!exact};
}
export function portraitAccessoryAsset(item){
  return W46_APPROVED_HEADWEAR_ASSET_OVERRIDES[item?.id]||W44_HEADWEAR_ASSET_OVERRIDES[item?.id]||W42_PORTRAIT_ASSET_OVERRIDES[item?.id]||item?.asset||'';
}
export function portraitEarringSideAsset(item,side='left'){
  return W44_EARRING_SIDE_ASSETS[item?.id]?.[side]||'';
}
const clamp=(n,min,max)=>Math.max(min,Math.min(max,n));
const dist=(a,b)=>Math.hypot(b.x-a.x,b.y-a.y);
const angle=(a,b)=>Math.atan2(b.y-a.y,b.x-a.x)*180/Math.PI;
const midpoint=(a,b)=>P((a.x+b.x)/2,(a.y+b.y)/2);

export function portraitGlassesFit(avatar='john',variant=0,item=null){
  const p=portraitAnchorProfile(avatar,variant);
  if(!p||!p.pupils)return null;
  const id=String(item?.id||'');
  const g=GLASSES_GEOMETRY[id]||{widthMode:'eyes',widthPerEye:3.28,yNudge:0};
  const eyeMid=midpoint(p.pupils.left,p.pupils.right);
  const eyeDist=dist(p.pupils.left,p.pupils.right);
  const bridge=p.bridge||eyeMid;
  const templeDist=p.temples?dist(p.temples.left,p.temples.right):eyeDist*2.1;
  const w=g.widthMode==='temples'?templeDist*(g.templeScale||1.1):eyeDist*(g.widthPerEye||3.28);
  const conflict=!!p.baked?.glasses;
  const exact=!!p.exactCalibration;
  return {
    x:bridge.x,y:eyeMid.y+(g.yNudge||0),w:clamp(w,18,112),r:angle(p.pupils.left,p.pupils.right),
    sx:1,sy:1,skew:0,hidden:false,blocked:conflict||!exact,
    calibrated:exact,exactCalibration:exact,
    anchorMode:p.exactCalibration?'exact-portrait-pupils-bridge-temples':'fallback-pupils-bridge-temples',
    portraitKey:p.portraitStyleKey,portraitConflict:conflict,
    landmarks:{leftPupil:p.pupils.left,rightPupil:p.pupils.right,bridge:p.bridge,leftTemple:p.temples.left,rightTemple:p.temples.right},
  };
}


export const W44_PORTRAIT_EARLOBE_OVERRIDES={
  'john-look-01':{left:P(20.5,51.5),right:P(70.5,25.4),visible:{left:true,right:true}},
  'kristen-cute':{left:P(27.5,33.0),right:P(80.5,34.0),visible:{left:false,right:false},reason:'ears-covered-by-hair'},
  'logan-cute':{left:P(21.0,44.0),right:P(75.0,31.0),visible:{left:true,right:true}},
};

const EARRING_GEOMETRY={
  'wear-jewelry-0032-vanessa-modern-woven-beaded-stud-earrings':{kind:'stud',headScale:.065,yNudge:0},
  'wear-jewelry-0036-vanessa-modern-curved-beaded-hoop-earrings':{kind:'hoop',headScale:.145,yNudge:0},
  'wear-jewelry-0041-retro-closet-woven-plaid-drop-earrings':{kind:'drop',headScale:.095,yNudge:0},
  'wear-jewelry-0046-vanessa-modern-slatted-gold-stud-earrings':{kind:'dangle',headScale:.11,yNudge:0},
  'wear-jewelry-0050-vanessa-modern-woven-gold-hoop-earrings':{kind:'charm',headScale:.11,yNudge:0},
  'wear-jewelry-0055-retro-closet-slatted-turquoise-drop-earrings':{kind:'statement',headScale:.135,yNudge:0},
};
// W45 visual-size recovery. These are visual wearing ratios, not collision-safe
// bounds. The prior W44 values were conservative enough that otherwise-correct
// hats looked miniaturized on the portrait heads.
export const W46_APPROVED_HEADWEAR_GEOMETRY_OVERRIDES={
  // The approved Board 01 Hunter Hat is a structured olive cap, not a cowboy hat.
  'prop-hunt-hunter-hat':{kind:'cap',widthScale:1.08,templeScale:1.34,seatMix:.58,pivotY:88,minWidth:48,maxWidth:112},
};

export const W45_HEADWEAR_GEOMETRY={
  'cowboy-hat':{kind:'cowboy',widthScale:1.27,templeScale:1.56,seatMix:.54,pivotY:88,minWidth:54,maxWidth:132},
  'firefighter-helmet':{kind:'helmet',widthScale:1.17,templeScale:1.45,seatMix:.56,pivotY:88,minWidth:52,maxWidth:120},
  'birthday-crown':{kind:'crown',widthScale:.82,templeScale:1.00,seatMix:.40,pivotY:92,minWidth:35,maxWidth:88},
  'tiara':{kind:'tiara',widthScale:.78,templeScale:.96,seatMix:.43,pivotY:92,minWidth:34,maxWidth:84},
  'legendary-top-hat':{kind:'top-hat',widthScale:.99,templeScale:1.22,seatMix:.54,pivotY:92,minWidth:44,maxWidth:102},
  'mexican-train-cap':{kind:'cap',widthScale:1.08,templeScale:1.34,seatMix:.58,pivotY:88,minWidth:48,maxWidth:112},
};

// Per-person visual corrections are applied after the semantic head measurement.
// They are intentionally small: head landmarks determine the fit, while these
// compensate for portrait crop and hair volume differences without shrinking the
// accessory into a toy-sized safe box.
export const W45_HEADWEAR_PORTRAIT_CORRECTIONS={
  john:{scale:1.00,y:0.6,x:0.0},
  kristen:{scale:1.04,y:1.2,x:0.0},
  holly:{scale:1.09,y:1.1,x:0.0},
  vanessa:{scale:1.05,y:0.9,x:0.0},
  elizabeth:{scale:1.09,y:1.1,x:0.0},
  lizzy:{scale:1.09,y:1.1,x:0.0},
  logan:{scale:1.05,y:1.0,x:0.0},
  james:{scale:1.02,y:0.8,x:0.0},
  dorothy:{scale:1.03,y:0.9,x:0.0},
  papa:{scale:1.04,y:0.8,x:0.0},
  nana:{scale:1.03,y:0.9,x:0.0},
};
const HEADWEAR_GEOMETRY=W45_HEADWEAR_GEOMETRY;

export const W45_GENERIC_HEADWEAR_PROFILES={
  cap:{kind:'cap',widthScale:1.08,templeScale:1.34,seatMix:.58,pivotY:88,minWidth:48,maxWidth:112},
  cowboy:{kind:'cowboy',widthScale:1.27,templeScale:1.56,seatMix:.54,pivotY:88,minWidth:54,maxWidth:132},
  helmet:{kind:'helmet',widthScale:1.17,templeScale:1.45,seatMix:.56,pivotY:88,minWidth:52,maxWidth:120},
  beanie:{kind:'beanie',widthScale:1.08,templeScale:1.34,seatMix:.54,pivotY:90,minWidth:48,maxWidth:112},
  beret:{kind:'beret',widthScale:1.04,templeScale:1.30,seatMix:.54,pivotY:86,minWidth:46,maxWidth:110},
  crown:{kind:'crown',widthScale:.82,templeScale:1.00,seatMix:.40,pivotY:92,minWidth:35,maxWidth:88},
  tiara:{kind:'tiara',widthScale:.78,templeScale:.96,seatMix:.43,pivotY:92,minWidth:34,maxWidth:84},
  'top-hat':{kind:'top-hat',widthScale:.99,templeScale:1.22,seatMix:.54,pivotY:92,minWidth:44,maxWidth:102},
  bucket:{kind:'bucket',widthScale:1.12,templeScale:1.38,seatMix:.56,pivotY:88,minWidth:50,maxWidth:118},
  'wide-brim':{kind:'wide-brim',widthScale:1.32,templeScale:1.62,seatMix:.54,pivotY:88,minWidth:58,maxWidth:136},
  wrap:{kind:'wrap',widthScale:1.03,templeScale:1.28,seatMix:.56,pivotY:72,minWidth:46,maxWidth:110},
  headband:{kind:'headband',widthScale:.94,templeScale:1.16,seatMix:.68,pivotY:54,minWidth:42,maxWidth:100},
  pin:{kind:'pin',widthScale:.30,templeScale:.38,seatMix:.28,pivotY:55,minWidth:12,maxWidth:36},
  earmuffs:{kind:'earmuffs',widthScale:1.10,templeScale:1.38,seatMix:.56,pivotY:50,minWidth:52,maxWidth:128},
};

export function w45HeadwearKindForItem(item=null){
  const id=String(item?.id||'').toLowerCase();
  const name=String(item?.name||'').toLowerCase();
  const text=`${id} ${name}`;
  if(/earmuff/.test(text))return 'earmuffs';
  if(/hat pin|clip set/.test(text))return 'pin';
  if(/headband/.test(text))return 'headband';
  if(/bandana|headwrap/.test(text))return 'wrap';
  if(/firefighter|helmet|hard hat|hard-hat/.test(text))return 'helmet';
  if(/top hat|top-hat/.test(text))return 'top-hat';
  if(/tiara/.test(text))return 'tiara';
  if(/flower crown|party crown|birthday crown|champion crown|rock crown|\bcrown\b/.test(text))return 'crown';
  if(/wide-brim|sun hat|sun-hat/.test(text))return 'wide-brim';
  if(/bucket/.test(text))return 'bucket';
  if(/cowboy|western|hunter hat/.test(text))return 'cowboy';
  if(/toque|beanie|knit/.test(text))return 'beanie';
  if(/beret/.test(text))return 'beret';
  if(/cap|newsboy|trucker/.test(text))return 'cap';
  return 'cap';
}

function w45HeadwearGeometryForItem(item=null){
  if(!item)return null;
  if(W46_APPROVED_HEADWEAR_GEOMETRY_OVERRIDES[item.id])return W46_APPROVED_HEADWEAR_GEOMETRY_OVERRIDES[item.id];
  if(W45_HEADWEAR_GEOMETRY[item.id])return W45_HEADWEAR_GEOMETRY[item.id];
  const semantic=String(item.fitAnchor||'').toLowerCase();
  // These specialty anchors have dedicated solvers in avatar-cosmetics.
  if(['ears','bun','forehead'].includes(semantic))return null;
  return W45_GENERIC_HEADWEAR_PROFILES[w45HeadwearKindForItem(item)]||W45_GENERIC_HEADWEAR_PROFILES.cap;
}
const lerp=(a,b,t)=>a+(b-a)*t;

function portraitEarDetail(p,side='left'){
  const center=p?.ears?.[side]; if(!center||!p?.head)return null;
  const headSpan=dist(p.head.left,p.head.right);
  const ov=W44_PORTRAIT_EARLOBE_OVERRIDES[p.portraitStyleKey];
  const lobe=ov?.[side]||P(center.x,center.y);
  const top=P(lobe.x,lobe.y-headSpan*.10);
  const visible=ov?.visible?.[side]!==false;
  return {center,top,lobe,visible,reason:visible?'':(ov?.reason||'ear-not-visible')};
}

export function portraitEarringFits(avatar='john',variant=0,item=null){
  const p=portraitAnchorProfile(avatar,variant);
  if(!p||!p.exactCalibration||p.dog)return {blocked:true,reason:p?.dog?'dog-specific-ear-accessory-required':'exact-portrait-calibration-required',portraitKey:p?.portraitStyleKey||''};
  if(p.baked?.earrings)return {blocked:true,reason:'baked-earrings-clean-portrait-required',portraitKey:p.portraitStyleKey};
  const g=EARRING_GEOMETRY[item?.id];
  if(!g||!W44_EARRING_SIDE_ASSETS[item?.id])return {blocked:true,reason:'no-w44-earring-production-asset',portraitKey:p.portraitStyleKey};
  const headSpan=dist(p.head.left,p.head.right);
  const roll=angle(p.pupils.left,p.pupils.right);
  const result={blocked:false,portraitKey:p.portraitStyleKey,anchorMode:'exact-portrait-earlobes',kind:g.kind,exactCalibration:true};
  let visibleCount=0;
  for(const side of ['left','right']){
    const ear=portraitEarDetail(p,side); if(!ear){result[side]={hidden:true};continue;}
    // Hair-covered or otherwise invisible ears fail closed instead of forcing jewelry over hair.
    let visible=ear.visible!==false,scale=1;
    if(Math.abs(p.yaw||0)>.32){const far=(p.yaw>0?'left':'right');if(side===far){visible=false;scale=.72;}}
    if(visible) visibleCount++;
    result[side]={x:ear.lobe.x,y:ear.lobe.y+(g.yNudge||0),w:clamp(headSpan*g.headScale*scale,3.0,24),r:g.kind==='stud'?roll*.12:0,sx:1,sy:1,skew:0,tx:-50,ty:-6,hidden:!visible,calibrated:true,portraitKey:p.portraitStyleKey,anchorMode:'exact-earlobe',landmark:ear.lobe};
  }
  if(!visibleCount)return {blocked:true,reason:'no-visible-earlobes-hair-occluded',portraitKey:p.portraitStyleKey};
  return result;
}

export function portraitHeadwearFit(avatar='john',variant=0,item=null){
  const key=String(avatar||'john').toLowerCase();
  const p=portraitAnchorProfile(key,variant);
  if(!p?.head||!p.exactCalibration)return null;
  if(p.dog)return {blocked:true,hidden:true,reason:'dog-specific-headwear-profile-required',portraitKey:p.portraitStyleKey};
  if(p.baked?.hat||p.baked?.headwear)return {blocked:true,hidden:true,reason:'baked-headwear-clean-portrait-required',portraitKey:p.portraitStyleKey};
  const g=w45HeadwearGeometryForItem(item);
  if(!g)return null;

  const sideMid=midpoint(p.head.left,p.head.right);
  const headSpan=dist(p.head.left,p.head.right);
  const templeSpan=p.temples?dist(p.temples.left,p.temples.right):headSpan*.76;
  const eyeMid=p.pupils?midpoint(p.pupils.left,p.pupils.right):sideMid;
  const corr=W45_HEADWEAR_PORTRAIT_CORRECTIONS[key]||{scale:1,y:0,x:0};

  // Hairline is derived from head-top to eye-line distance. It keeps caps and
  // helmets seated on the skull while crowns/tiaras remain slightly higher.
  const hairline=P(
    lerp(sideMid.x,(p.bridge||eyeMid).x,.22),
    lerp(p.head.top.y,eyeMid.y,.70)
  );
  const crownCenter=P(sideMid.x,lerp(p.head.top.y,hairline.y,.48));
  const seatMix=Number.isFinite(g.seatMix)?g.seatMix:.54;
  const baseSeatY=lerp(p.head.top.y,eyeMid.y,seatMix);
  const seatX=lerp(sideMid.x,(p.bridge||eyeMid).x,.24)+(corr.x||0);
  const seat=P(seatX,baseSeatY+(corr.y||0));
  const roll=p.pupils?angle(p.pupils.left,p.pupils.right):angle(p.head.left,p.head.right);

  // Use the larger of skull width and temple-derived visual width. This prevents
  // three-quarter or tightly cropped portraits from shrinking hats merely because
  // one head-edge landmark is conservative.
  const visualBase=Math.max(headSpan*(g.widthScale||1),templeSpan*(g.templeScale||1));
  const w46Shape=W46_APPROVED_HEADWEAR_PORTRAIT_SHAPING[item?.id];
  const width=clamp(visualBase*(corr.scale||1)*(w46Shape?.widthScale||1),g.minWidth||24,g.maxWidth||132);

  // W46 keeps W45's corrected lateral size, but shapes the approved portrait
  // render vertically from real head geometry. This is intentionally separate
  // from width so a natural-aspect product render cannot become an enormous
  // face-covering overlay. Non-W46 headwear remains exactly W45-compatible.
  const crownDepth=Math.max(5,seat.y-p.head.top.y);
  const targetHeight=w46Shape?crownDepth*w46Shape.targetDepthScale:null;
  const naturalHeight=w46Shape?width*w46Shape.assetAspect:null;
  const portraitSy=w46Shape?clamp(targetHeight/Math.max(1,naturalHeight),.22,.82):1;

  return {
    x:seat.x,y:seat.y+(w46Shape?.seatNudge||0),w:width,r:roll*(w46Shape?.rollScale??1),sx:1,sy:portraitSy,skew:0,tx:-50,ty:-g.pivotY,ox:50,oy:g.pivotY,
    hidden:false,blocked:false,calibrated:true,exactCalibration:true,
    anchorMode:`w45-visual-head-${g.kind}-seat`,portraitKey:p.portraitStyleKey,
    headwearKind:g.kind,visualScaleRecovery:true,w46ApprovedArt:Boolean(w46Shape),
    w46PortraitShaping:w46Shape?{assetAspect:w46Shape.assetAspect,targetDepthScale:w46Shape.targetDepthScale,seatNudge:w46Shape.seatNudge||0,widthScale:w46Shape.widthScale||1,rollScale:w46Shape.rollScale??1,targetHeight,naturalHeight,scaleY:portraitSy}:null,
    landmarks:{headTop:p.head.top,headLeft:p.head.left,headRight:p.head.right,leftTemple:p.temples?.left,rightTemple:p.temples?.right,eyeMid,hairline,crownCenter,seat},
  };
}


export function portraitSemanticAccessoryFit(avatar='john',variant=0,item=null,slot='face'){
  const p=portraitAnchorProfile(avatar,variant);
  if(!p||!p.exactCalibration||p.dog)return null;
  const eyeMid=p.pupils?midpoint(p.pupils.left,p.pupils.right):p.bridge;
  const headSpan=dist(p.head.left,p.head.right);
  const templeSpan=p.temples?dist(p.temples.left,p.temples.right):headSpan*.72;
  const earSpan=p.ears?dist(p.ears.left,p.ears.right):headSpan*.9;
  const roll=p.pupils?angle(p.pupils.left,p.pupils.right):0;
  const earMid=p.ears?midpoint(p.ears.left,p.ears.right):eyeMid;
  const neck=P((p.bridge||eyeMid).x,Math.max(earMid.y,eyeMid.y)+headSpan*.42);
  const chest=P(neck.x,neck.y+headSpan*.34);
  let f=null;
  if(slot==='headset') f={x:earMid.x,y:lerp(p.head.top.y,earMid.y,.58),w:earSpan*1.10,r:roll,tx:-50,ty:-50,anchorMode:'exact-headset-ears-crown'};
  else if(slot==='hair') f={x:midpoint(p.head.left,p.head.right).x,y:lerp(p.head.top.y,eyeMid.y,.30),w:headSpan*1.03,r:roll,tx:-50,ty:-60,anchorMode:'exact-hair-head-crown'};
  else if(slot==='face') f={x:(p.bridge||eyeMid).x,y:eyeMid.y+headSpan*.035,w:templeSpan*1.06,r:roll,tx:-50,ty:-50,anchorMode:'exact-face-pupils-bridge-temples'};
  else if(slot==='filter') f={x:(p.bridge||eyeMid).x,y:eyeMid.y+headSpan*.16,w:headSpan*.82,r:roll*.45,tx:-50,ty:-50,anchorMode:'exact-filter-face-head'};
  else if(slot==='neck') f={x:neck.x,y:neck.y,w:headSpan*.74,r:roll*.12,tx:-50,ty:-50,anchorMode:'exact-neck-head-derived'};
  else if(slot==='badge') f={x:chest.x+headSpan*.18,y:chest.y,w:headSpan*.18,r:roll*.08,tx:-50,ty:-50,anchorMode:'exact-badge-upper-chest-derived'};
  else if(slot==='back'||slot==='attachment') f={x:chest.x,y:chest.y-headSpan*.08,w:headSpan*(slot==='attachment'?1.15:.95),r:roll*.08,tx:-50,ty:-50,anchorMode:`exact-${slot}-shoulder-derived`};
  else if(slot==='wrists') return {x:50,y:82,w:1,r:0,tx:-50,ty:-50,sx:1,sy:1,skew:0,hidden:true,blocked:true,calibrated:true,exactCalibration:true,portraitKey:p.portraitStyleKey,anchorMode:'portrait-wrists-not-visible-fail-closed',reason:'wrist-landmarks-not-visible-in-current-portrait'};
  if(!f)return null;
  return {...f,sx:1,sy:1,skew:0,hidden:false,blocked:false,calibrated:true,exactCalibration:true,portraitKey:p.portraitStyleKey};
}

export function portraitHeadFit(avatar='john',variant=0,item=null){
  const p=portraitAnchorProfile(avatar,variant);
  if(!p?.head)return null;
  const mid=midpoint(p.head.left,p.head.right);
  const span=dist(p.head.left,p.head.right);
  return {x:mid.x,y:p.head.top.y+span*.08,w:span*1.10,r:angle(p.head.left,p.head.right),sx:1,sy:1,skew:0,hidden:false,calibrated:true,anchorMode:'head-top-sides'};
}

export function portraitAnchorDebugPoints(avatar='john',variant=0){
  const p=portraitAnchorProfile(avatar,variant); if(!p)return [];
  const out=[];
  const add=(name,pt)=>pt&&out.push({name,x:pt.x,y:pt.y});
  add('leftPupil',p.pupils?.left);add('rightPupil',p.pupils?.right);add('bridge',p.bridge);
  add('leftTemple',p.temples?.left);add('rightTemple',p.temples?.right);
  add('leftEar',p.ears?.left);add('rightEar',p.ears?.right);
  add('leftEarLobe',portraitEarDetail(p,'left')?.lobe);add('rightEarLobe',portraitEarDetail(p,'right')?.lobe);
  add('headTop',p.head?.top);add('headLeft',p.head?.left);add('headRight',p.head?.right);
  return out;
}
