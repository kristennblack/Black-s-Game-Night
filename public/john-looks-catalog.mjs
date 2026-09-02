export const JOHN_LOOKS = [
  {id:'john-look-01',name:'Everyday Check',icon:'◆',price:0,batch:'J1',tag:'STARTER',desc:'John in his everyday checked shirt. The free starter look.'},
  {id:'john-look-02',name:'Workshop John',icon:'W',price:60,batch:'J1',tag:'CABIN',desc:'Workshop-ready John in rugged overalls and a dark tee.'},
  {id:'john-look-03',name:'Birthday Legend',icon:'B',price:100,batch:'J1',tag:'BIRTHDAY',desc:'Birthday-night John in red plaid with his Birthday Legend crown and badge.'},
  {id:'john-look-04',name:'Cabin Hoodie',icon:'H',price:60,batch:'J1',tag:'CABIN',desc:'Relaxed charcoal hoodie for late-night cabin games.'},
  {id:'john-look-05',name:'Lake Toque',icon:'L',price:70,batch:'J1',tag:'OUTDOORS',desc:'Cold-weather lake look with a knit toque and rugged outerwear.'},
  {id:'john-look-06',name:'Flannel Classic',icon:'F',price:60,batch:'J1',tag:'CABIN',desc:'Red-and-black flannel, simple and classic.'},
  {id:'john-look-07',name:'Denim Rider',icon:'D',price:75,batch:'J1',tag:'WESTERN',desc:'Denim sherpa jacket and bandana for a rougher western look.'},
  {id:'john-look-08',name:'Cowboy John',icon:'C',price:90,batch:'J1',tag:'WESTERN',desc:'Full cowboy John with worn hat, ranch layers and trail-ready attitude.'},
  {id:'john-look-09',name:'Prop Hunt Hunter',icon:'P',price:120,batch:'J1',tag:'GAME',desc:'John dressed for Family Prop Hunt with tactical outdoor gear and goggles.'},
  {id:'john-look-10',name:'Game Night Fuel',icon:'G',price:70,batch:'J1',tag:'GAME NIGHT',desc:'Cabin hoodie John with his Game Night Fuel mug.'},
  {id:'john-look-11',name:'Formal Suit',icon:'S',price:100,batch:'J2',tag:'FORMAL',desc:'Dark suit and tie for the unusually respectable version of game night.'},
  {id:'john-look-12',name:'Poker Night',icon:'K',price:90,batch:'J2',tag:'GAME',desc:'Poker-table John with cards, chips and a dark collared shirt.'},
  {id:'john-look-13',name:'Black Gammon Pro',icon:'BG',price:90,batch:'J2',tag:'GAME',desc:'A polished tabletop look for Black Gammon and backgammon nights.'},
  {id:'john-look-14',name:'Explorer John',icon:'E',price:85,batch:'J2',tag:'OUTDOORS',desc:'Adventure hat, trail scarf and field gear for exploration games.'},
  {id:'john-look-15',name:'Construction John',icon:'CT',price:85,batch:'J2',tag:'WORK',desc:'Hard hat and high-visibility construction gear.'},
  {id:'john-look-16',name:'Firefighter John',icon:'FF',price:95,batch:'J2',tag:'WORK',desc:'Firefighter helmet and turnout gear inspired by the family character theme.'},
  {id:'john-look-17',name:'Holiday Plaid',icon:'HP',price:80,batch:'J2',tag:'SEASONAL',desc:'Warm holiday plaid with a game-night mug.'},
  {id:'john-look-18',name:'Winter Parka',icon:'WP',price:90,batch:'J2',tag:'SEASONAL',desc:'Heavy winter parka and toque for snowy cabin weather.'},
  {id:'john-look-19',name:'Summer Beach',icon:'SB',price:75,batch:'J2',tag:'SEASONAL',desc:'Vacation John in a breezy tropical shirt and sunglasses.'},
  {id:'john-look-20',name:'Fishing Trip',icon:'FT',price:85,batch:'J2',tag:'OUTDOORS',desc:'Fishing-cap John with layered trail gear and tackle-ready styling.'},
  {id:'john-look-21',name:'Trail Trouble Champ',icon:'TT',price:110,batch:'J3',tag:'GAME',desc:'Trail Trouble champion cap and badge with rugged outdoor layers.'},
  {id:'john-look-22',name:'Mexican Train Conductor',icon:'MT',price:110,batch:'J3',tag:'GAME',desc:'A playful conductor outfit made specifically for Mexican Train night.'},
  {id:'john-look-23',name:'Cabin Sherpa',icon:'CS',price:85,batch:'J3',tag:'CABIN',desc:'Sherpa-lined jacket, knit layers and warm lodge styling.'},
  {id:'john-look-24',name:'Vintage Leather',icon:'VL',price:100,batch:'J3',tag:'CLASSIC',desc:'Dark vintage leather jacket with a weathered lodge feel.'},
  {id:'john-look-25',name:'Varsity Cap',icon:'V',price:75,batch:'J3',tag:'CASUAL',desc:'Varsity jacket, hoodie and cap for an easy casual look.'},
  {id:'john-look-26',name:'Family Photo John',icon:'FP',price:80,batch:'J3',tag:'FAMILY',desc:'Neat cardigan and check shirt for the family-photo version of John.'},
  {id:'john-look-27',name:'Lumberjack John',icon:'LJ',price:85,batch:'J3',tag:'CABIN',desc:'Toque and red plaid for a classic lumberjack cabin look.'},
  {id:'john-look-28',name:'Celebration Crown',icon:'CC',price:125,batch:'J3',tag:'BIRTHDAY',desc:'Game Night King celebration crown with a dark party-night outfit.'},
  {id:'john-look-29',name:'Mountain Trek',icon:'M',price:90,batch:'J3',tag:'OUTDOORS',desc:'Mountain cap, layered shell and backpack-ready trail styling.'},
  {id:'john-look-30',name:'Sunday Casual',icon:'SC',price:60,batch:'J3',tag:'CASUAL',desc:'Clean cream henley for the simplest relaxed John look.'}
];
export const JOHN_LOOK_BY_ID = Object.fromEntries(JOHN_LOOKS.map((x,i)=>[x.id,{...x,index:i}]));
export const STARTER_JOHN_LOOK_ID='john-look-01';
export function johnLookIndex(id){return JOHN_LOOK_BY_ID[String(id||'')]?.index ?? 0}
export function normalizeJohnLooks(raw={}){
  const out={};
  if(raw&&typeof raw==='object') for(const [id,value] of Object.entries(raw)) if(JOHN_LOOK_BY_ID[id]) out[id]=value&&typeof value==='object'?{...value}:{unlockedAt:0,source:'legacy'};
  out[STARTER_JOHN_LOOK_ID]=out[STARTER_JOHN_LOOK_ID]||{unlockedAt:0,source:'starter'};
  return out;
}
