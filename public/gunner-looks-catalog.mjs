export const GUNNER_LOOKS = [
  {id:'gunner-look-01',name:'Everyday Gunner',icon:'G',price:0,batch:'G1',tag:'STARTER',desc:'Gunner exactly as his approved playable avatar appears. The free starter look.'},
  {id:'gunner-look-02',name:'Cabin Cozy',icon:'C',price:55,batch:'G1',tag:'CABIN',desc:'Warm plaid cabin layers for the big mellow guy.'},
  {id:'gunner-look-03',name:'Birthday Boy',icon:'B',price:90,batch:'G1',tag:'BIRTHDAY',desc:'Birthday hat and blue party bandana for Gunner celebrations.'},
  {id:'gunner-look-04',name:'Cowboy Gunner',icon:'CW',price:85,batch:'G1',tag:'WESTERN',desc:'Weathered cowboy hat and ranch bandana.'},
  {id:'gunner-look-05',name:'Lake Day Gunner',icon:'L',price:65,batch:'G1',tag:'OUTDOORS',desc:'Blue bucket hat and lake-day collar for summer family trips.'},
  {id:'gunner-look-06',name:'Plaid Pup',icon:'P',price:60,batch:'G1',tag:'CABIN',desc:'Red-and-black plaid cap and scarf.'},
  {id:'gunner-look-07',name:'Game Night Buddy',icon:'GN',price:70,batch:'G1',tag:'GAME',desc:'Gunner dressed for family game night.',earn:{rewardKey:'gunner-goat-first-save',label:"Save your first goat in Gunner's Goat Run"}},
  {id:'gunner-look-08',name:'Prop Hunt Pup',icon:'PH',price:95,batch:'G1',tag:'GAME',desc:'Outdoor hunter cap and trail collar for Family Prop Hunt.'},
  {id:'gunner-look-09',name:'Explorer Gunner',icon:'E',price:80,batch:'G1',tag:'OUTDOORS',desc:'Explorer hat and field-ready neckwear.'},
  {id:'gunner-look-10',name:'Winter Toque',icon:'WT',price:75,batch:'G1',tag:'WINTER',desc:'Red winter toque for snowy cabin days.'},
  {id:'gunner-look-11',name:'Campfire Buddy',icon:'CF',price:60,batch:'G2',tag:'CABIN',desc:'Campfire-pattern neckerchief for nights outside.'},
  {id:'gunner-look-12',name:'Sunday Best',icon:'SB',price:75,batch:'G2',tag:'FORMAL',desc:'A tiny collar and tie for an unusually respectable Gunner.'},
  {id:'gunner-look-13',name:'Rainy Day Pup',icon:'R',price:75,batch:'G2',tag:'WEATHER',desc:'Yellow rain hood for wet-weather adventures.'},
  {id:'gunner-look-14',name:'Trail Champion',icon:'TC',price:110,batch:'G2',tag:'PRESTIGE',desc:'Trail-champion harness and medal styling.',earn:{rewardKey:'good-boy-gunner',label:"Save 5 goats in Gunner's Goat Run"}},
  {id:'gunner-look-15',name:'Holiday Sparkle',icon:'HS',price:80,batch:'G2',tag:'SEASONAL',desc:'Festive red sparkle neckwear for holiday game night.'},
  {id:'gunner-look-16',name:'Fishing Buddy',icon:'F',price:80,batch:'G2',tag:'OUTDOORS',desc:'Fishing hat and utility collar for lake weekends.'},
  {id:'gunner-look-17',name:'Pajama Pup',icon:'PJ',price:55,batch:'G2',tag:'COZY',desc:'Moon-and-stars pajama neckwear.'},
  {id:'gunner-look-18',name:'Firefighter Pup',icon:'FF',price:95,batch:'G2',tag:'WORK',desc:'Firefighter helmet and turnout-style collar.'},
  {id:'gunner-look-19',name:'Construction Gunner',icon:'CT',price:90,batch:'G2',tag:'WORK',desc:'Hard hat and high-visibility worksite gear.'},
  {id:'gunner-look-20',name:'Family Photo Gunner',icon:'FP',price:70,batch:'G2',tag:'FAMILY',desc:'Blue bow-tie look for family-photo duty.'},
  {id:'gunner-look-21',name:'Bandana Buddy',icon:'BB',price:55,batch:'G3',tag:'CASUAL',desc:'Classic blue bandana for an easy everyday variation.'},
  {id:'gunner-look-22',name:'Ball Cap Buddy',icon:'BC',price:60,batch:'G3',tag:'CASUAL',desc:'Backward blue ball cap and sturdy collar.'},
  {id:'gunner-look-23',name:'Lumberjack Pup',icon:'LJ',price:75,batch:'G3',tag:'CABIN',desc:'Red toque and buffalo plaid for full cabin mode.'},
  {id:'gunner-look-24',name:'Adventure Harness',icon:'AH',price:100,batch:'G3',tag:'ADVENTURE',desc:'Trail-ready adventure harness.',earn:{rewardKey:'gunner-snack-attack',label:"Collect 20 snacks in Gunner's Snack Attack"}},
  {id:'gunner-look-25',name:'Celebration Crown',icon:'CC',price:120,batch:'G3',tag:'PRESTIGE',desc:'A royal celebration crown for the family farm king.'},
  {id:'gunner-look-26',name:'Cozy Scarf',icon:'CS',price:60,batch:'G3',tag:'COZY',desc:'Chunky green scarf for chilly evenings.'},
  {id:'gunner-look-27',name:'Mountain Trek',icon:'MT',price:90,batch:'G3',tag:'OUTDOORS',desc:'Backpack harness and mountain-trail gear.'},
  {id:'gunner-look-28',name:'Weekend Cutie',icon:'WC',price:60,batch:'G3',tag:'CASUAL',desc:'Blue checked neckerchief for an easy weekend look.'},
  {id:'gunner-look-29',name:'Birthday Balloons',icon:'BL',price:95,batch:'G3',tag:'BIRTHDAY',desc:'Party bandana with birthday balloons behind him.'},
  {id:'gunner-look-30',name:'Sleepy Sweater Gunner',icon:'SW',price:65,batch:'G3',tag:'COZY',desc:'Soft navy knit for sleepy cabin evenings.'}
];
export const GUNNER_LOOK_BY_ID = Object.fromEntries(GUNNER_LOOKS.map((x,i)=>[x.id,{...x,index:i}]));
export const STARTER_GUNNER_LOOK_ID='gunner-look-01';
export function gunnerLookIndex(id){return GUNNER_LOOK_BY_ID[String(id||'')]?.index ?? 0}
export function normalizeGunnerLooks(raw={}){
  const out={};
  if(raw&&typeof raw==='object') for(const [id,value] of Object.entries(raw)) if(GUNNER_LOOK_BY_ID[id]) out[id]=value&&typeof value==='object'?{...value}:{unlockedAt:0,source:'legacy'};
  out[STARTER_GUNNER_LOOK_ID]=out[STARTER_GUNNER_LOOK_ID]||{unlockedAt:0,source:'starter'};
  return out;
}
