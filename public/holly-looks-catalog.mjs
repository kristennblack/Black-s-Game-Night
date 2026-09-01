export const HOLLY_LOOKS = [
  {id:'holly-look-01',name:'Everyday Holly',icon:'H',price:0,batch:'H1',tag:'STARTER',desc:'Holly’s everyday game-night look, built directly from her approved playable avatar identity.'},
  {id:'holly-look-02',name:'Cabin Cozy',icon:'C',price:60,batch:'H1',tag:'CABIN',desc:'Warm braided cabin layers for cozy family game nights.'},
  {id:'holly-look-03',name:'Birthday Princess',icon:'B',price:100,batch:'H1',tag:'BIRTHDAY',desc:'Pink birthday dress and tiara for Holly’s birthday celebrations.'},
  {id:'holly-look-04',name:'Dance Class Holly',icon:'D',price:70,batch:'H1',tag:'DANCE',desc:'Simple black dance-class styling with Holly’s approved face kept intact.'},
  {id:'holly-look-05',name:'Cowgirl Holly',icon:'CW',price:90,batch:'H1',tag:'WESTERN',desc:'Cowboy hat, braids and denim for a western Holly look.'},
  {id:'holly-look-06',name:'School Day Holly',icon:'S',price:60,batch:'H1',tag:'SCHOOL',desc:'Neat school-day layers with a headband and backpack-ready styling.'},
  {id:'holly-look-07',name:'Lake Day Holly',icon:'L',price:70,batch:'H1',tag:'OUTDOORS',desc:'Sunny lake-day outfit with sunglasses and casual summer layers.'},
  {id:'holly-look-08',name:'Gamer Holly',icon:'G',price:90,batch:'H1',tag:'GAME',desc:'Headset and hoodie for Holly’s Memory Mayhem and the Arcade Corner.',earn:{rewardKey:'holly-memory-first-win',label:"Win Holly's Memory Mayhem"}},
  {id:'holly-look-09',name:'Pajama Party',icon:'PJ',price:60,batch:'H1',tag:'COZY',desc:'Soft patterned pajamas for late-night family games.'},
  {id:'holly-look-10',name:'Sunday Sweet',icon:'SS',price:65,batch:'H1',tag:'CASUAL',desc:'Soft Sunday dress and cardigan styling.'},
  {id:'holly-look-11',name:'Winter Toque',icon:'WT',price:80,batch:'H2',tag:'WINTER',desc:'Warm toque, scarf and winter layers for snowy cabin days.'},
  {id:'holly-look-12',name:'Pink Hoodie Holly',icon:'PH',price:60,batch:'H2',tag:'CASUAL',desc:'A simple pink hoodie look with Holly’s curls pulled back.'},
  {id:'holly-look-13',name:'Story Time Holly',icon:'ST',price:95,batch:'H2',tag:'GAME REWARD',desc:'Cozy reading look with storybook styling.',earn:{rewardKey:'holly-memory-star',label:'Earn the Holly Memory Star'}},
  {id:'holly-look-14',name:'Campfire Cutie',icon:'CF',price:75,batch:'H2',tag:'CABIN',desc:'Braids and layered outdoor clothing for nights around the fire.'},
  {id:'holly-look-15',name:'Ballet Bow',icon:'BB',price:75,batch:'H2',tag:'DANCE',desc:'Pink ballet-inspired look finished with a soft bow.'},
  {id:'holly-look-16',name:'Family Photo Holly',icon:'FP',price:70,batch:'H2',tag:'FAMILY',desc:'A polished light outfit for family photos and celebrations.'},
  {id:'holly-look-17',name:'Holiday Sparkle',icon:'HS',price:90,batch:'H2',tag:'SEASONAL',desc:'Red holiday sparkle for winter family events.'},
  {id:'holly-look-18',name:'Ski Day Holly',icon:'SK',price:95,batch:'H2',tag:'WINTER',desc:'Ski goggles, toque and purple snow gear.'},
  {id:'holly-look-19',name:'Floral Dress Holly',icon:'FD',price:75,batch:'H2',tag:'DRESS',desc:'Soft floral dress with a flower hair accent.'},
  {id:'holly-look-20',name:'Varsity Holly',icon:'V',price:80,batch:'H2',tag:'SPORTY',desc:'Navy varsity jacket and ponytail styling.'},
  {id:'holly-look-21',name:'Little Explorer',icon:'E',price:85,batch:'H3',tag:'OUTDOORS',desc:'Explorer hat and trail layers for adventure games.'},
  {id:'holly-look-22',name:'Tea Time Holly',icon:'TT',price:80,batch:'H3',tag:'DRESS',desc:'A sweet tea-party look with a soft hat and pastel dress.'},
  {id:'holly-look-23',name:'Rainy Day Holly',icon:'R',price:75,batch:'H3',tag:'WEATHER',desc:'Bright yellow raincoat for wet-weather adventures.'},
  {id:'holly-look-24',name:'Sleepy Sweater Holly',icon:'SW',price:65,batch:'H3',tag:'COZY',desc:'Oversized soft knit for the coziest game-night mood.'},
  {id:'holly-look-25',name:'Sparkle Tiara',icon:'T',price:125,batch:'H3',tag:'PRESTIGE',desc:'A glittering tiara and princess look for a standout Holly reward.',earn:{rewardKey:'holly-memory-hard-star',label:"Beat Holly's Memory Mayhem on Hard in 18 moves or fewer"}},
  {id:'holly-look-26',name:'Summer Sunshine',icon:'SUN',price:75,batch:'H3',tag:'SUMMER',desc:'Sun hat and pastel summer dress for warm-weather family days.'},
  {id:'holly-look-27',name:'Craft Room Holly',icon:'CR',price:70,batch:'H3',tag:'HOBBY',desc:'Overalls and playful craft-room styling.'},
  {id:'holly-look-28',name:'Trail Day Holly',icon:'TR',price:85,batch:'H3',tag:'OUTDOORS',desc:'Braids and layered trail gear for a family hike.'},
  {id:'holly-look-29',name:'Birthday Balloons',icon:'BL',price:100,batch:'H3',tag:'BIRTHDAY',desc:'Pink birthday styling framed by party balloons.'},
  {id:'holly-look-30',name:'Weekend Cutie',icon:'WK',price:65,batch:'H3',tag:'CASUAL',desc:'Denim and soft pink accents for an easy weekend look.'}
];
export const HOLLY_LOOK_BY_ID = Object.fromEntries(HOLLY_LOOKS.map((x,i)=>[x.id,{...x,index:i}]));
export const STARTER_HOLLY_LOOK_ID='holly-look-01';
export function hollyLookIndex(id){return HOLLY_LOOK_BY_ID[String(id||'')]?.index ?? 0}
export function normalizeHollyLooks(raw={}){
  const out={};
  if(raw&&typeof raw==='object') for(const [id,value] of Object.entries(raw)) if(HOLLY_LOOK_BY_ID[id]) out[id]=value&&typeof value==='object'?{...value}:{unlockedAt:0,source:'legacy'};
  out[STARTER_HOLLY_LOOK_ID]=out[STARTER_HOLLY_LOOK_ID]||{unlockedAt:0,source:'starter'};
  return out;
}
