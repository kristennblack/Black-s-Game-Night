import crypto from 'node:crypto';

export const GAME_TYPES = {
  SCREW:'screw', FUCK:'fuck', SMEAR:'smear',
  CAMPFIRE:'campfire', TRAIL:'trail', PRAIRIE:'prairie', BURN_LOGS:'burnlogs', DECK_SWEEP:'decksweep',
  CRIBBAGE:'cribbage', MARBLES:'marbles', EUCHRE:'euchre', THIRTY_ONE:'thirtyone', GOLF:'golf',
  CRAZY_EIGHTS:'crazy8', MITTS:'mitts', POKER:'poker', PRESIDENT:'president', LAST_HAVEN:'lasthaven',
  MEXICAN_TRAIN:'mexicantrain', SKIP_BO:'skipbo', BACKGAMMON:'backgammon', BLACK_GAMMON:'blackgammon'
};
export const SUITS = ['hearts', 'clubs', 'diamonds', 'spades'];
export const TRUMP_CYCLE = ['hearts', 'clubs', 'diamonds', 'spades', 'none'];
export const RANKS = ['2','3','4','5','6','7','8','9','10','J','Q','K','A'];
export const SMEAR_RANKS = ['7','8','9','10','J','Q','K','A'];
export const SPECIAL_RANK_BY_HAND = {1:'A',2:'2',3:'3',4:'4',5:'5',6:'6',7:'7',8:'8',9:'9',10:'10',11:'J',12:'Q',13:'K'};
export const HAND_BY_RANK = {A:1,'2':2,'3':3,'4':4,'5':5,'6':6,'7':7,'8':8,'9':9,'10':10,J:11,Q:12,K:13};

function id(prefix='c') { return `${prefix}-${crypto.randomUUID().slice(0,10)}`; }

export function makeDeck(gameType = GAME_TYPES.SCREW) {
  const deck = [];
  const ranks = gameType === GAME_TYPES.SMEAR ? SMEAR_RANKS : RANKS;
  for (const suit of SUITS) {
    for (const rank of ranks) deck.push({ id:id('card'), rank, suit, joker:null });
  }
  if (gameType === GAME_TYPES.FUCK) {
    deck.push({id:id('joker'),rank:'JOKER',suit:'joker',joker:'high',jokerIndex:1});
    deck.push({id:id('joker'),rank:'JOKER',suit:'joker',joker:'high',jokerIndex:2});
    deck.push({id:id('joker'),rank:'JOKER',suit:'joker',joker:'low',jokerIndex:1});
    deck.push({id:id('joker'),rank:'JOKER',suit:'joker',joker:'low',jokerIndex:2});
  }
  return deck;
}

export function shuffle(items, rng = Math.random) {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function maxHandSize(playerCount, gameType = GAME_TYPES.SCREW) {
  if (playerCount < 2) throw new Error('At least 2 players are required.');
  if (gameType === GAME_TYPES.SMEAR) return 6;
  const deckSize = gameType === GAME_TYPES.FUCK ? 56 : 52;
  return Math.min(13, Math.floor(deckSize / playerCount));
}

export function roundHandSizes(playerCount) {
  const max = maxHandSize(playerCount, GAME_TYPES.SCREW);
  const up = Array.from({ length: max }, (_, i) => i + 1);
  const down = Array.from({ length: Math.max(0, max - 1) }, (_, i) => max - 1 - i);
  return [...up, ...down];
}

export function trumpForRound(roundIndex) {
  return TRUMP_CYCLE[roundIndex % TRUMP_CYCLE.length];
}

export function buildScrewSchedule(playerCount) {
  return roundHandSizes(playerCount).map((handSize, i) => ({
    handSize,
    trump: trumpForRound(i),
    powerRank: null,
    source: null
  }));
}

function scheduleDeck(gameType, rng) { return shuffle(makeDeck(gameType), rng); }

/**
 * Fuck Your Buddy schedule rules:
 * - Host chooses number of rounds.
 * - A normal card sets hand size by rank (A=1, J=11, Q=12, K=13) and its suit is trump.
 * - A Joker means No Trump; keep drawing until a normal card with a playable hand size is found.
 * - Normal cards above the current player-count maximum are skipped.
 * - The schedule uses a virtual deck and reshuffles a full 56-card deck whenever needed.
 */
export function generateFuckSchedule(roundCount, playerCount, rng = Math.random) {
  const count = Math.max(1, Math.floor(Number(roundCount) || 1));
  const max = maxHandSize(playerCount, GAME_TYPES.FUCK);
  let deck = scheduleDeck(GAME_TYPES.FUCK, rng);
  const draw = () => {
    if (!deck.length) deck = scheduleDeck(GAME_TYPES.FUCK, rng);
    return deck.pop();
  };
  const schedule = [];
  while (schedule.length < count) {
    const first = draw();
    if (first.joker) {
      const source = [first];
      let normal = null;
      while (!normal) {
        const candidate = draw();
        source.push(candidate);
        if (!candidate.joker && HAND_BY_RANK[candidate.rank] <= max) normal = candidate;
      }
      const handSize = HAND_BY_RANK[normal.rank];
      schedule.push({handSize,trump:'none',powerRank:SPECIAL_RANK_BY_HAND[handSize],source});
      continue;
    }
    const handSize = HAND_BY_RANK[first.rank];
    if (handSize > max) continue;
    schedule.push({handSize,trump:first.suit,powerRank:SPECIAL_RANK_BY_HAND[handSize],source:[first]});
  }
  return schedule;
}

export function sortHand(hand) {
  const suitOrder = { hearts:0, clubs:1, diamonds:2, spades:3, joker:4 };
  const rankOrder = Object.fromEntries(RANKS.map((r, i) => [r, i]));
  return [...hand].sort((a,b) => {
    const suitDiff=(suitOrder[a.suit]??9)-(suitOrder[b.suit]??9);
    if (suitDiff) return suitDiff;
    if (a.joker || b.joker) {
      const ja = a.joker === 'high' ? 2 : a.joker === 'low' ? 1 : 0;
      const jb = b.joker === 'high' ? 2 : b.joker === 'low' ? 1 : 0;
      return jb-ja || (a.jokerIndex||0)-(b.jokerIndex||0);
    }
    return (rankOrder[b.rank]??0)-(rankOrder[a.rank]??0);
  });
}

export function firstDealerCeremony(playerIds, gameType = GAME_TYPES.SCREW, rng = Math.random) {
  if (playerIds.length < 2) throw new Error('At least 2 players are required.');
  let deck = shuffle(makeDeck(gameType), rng);
  const sequence=[];
  let i=0;
  while (deck.length) {
    const card=deck.shift();
    const playerId=playerIds[i%playerIds.length];
    sequence.push({playerId,card});
    if (!card.joker && card.rank==='J') return {dealerId:playerId,sequence};
    i++;
  }
  throw new Error('No Jack found in deck.');
}

export function randomDealer(playerIds, rng = Math.random) {
  if (playerIds.length !== 4) throw new Error('Smear requires exactly 4 players.');
  return playerIds[Math.floor(rng() * playerIds.length)];
}

export function teamForSeat(seat) {
  return Number(seat) % 2 === 0 ? 'A' : 'B';
}

export function smearBidValue(bid) {
  if (bid === '4out') return 5;
  if (bid === 'pass' || bid == null) return 0;
  return Number(bid) || 0;
}

export function orderedAfterDealer(playerIds,dealerId) {
  const idx=playerIds.indexOf(dealerId);
  if(idx<0) throw new Error('Dealer not seated.');
  return [...playerIds.slice(idx+1),...playerIds.slice(0,idx+1)];
}

export function forbiddenDealerBid(handSize,bidsBeforeDealer) {
  const sum=bidsBeforeDealer.reduce((n,b)=>n+b,0);
  const forbidden=handSize-sum;
  return forbidden>=0&&forbidden<=handSize?forbidden:null;
}

function firstNormalSuit(trick) {
  const first=trick?.find(x=>!x.card.joker);
  return first?.card?.suit || null;
}

export function legalCardIds(hand,trick,gameType=GAME_TYPES.SCREW) {
  if (!trick?.length) return new Set(hand.map(c=>c.id));
  if (gameType===GAME_TYPES.SCREW || gameType===GAME_TYPES.SMEAR) {
    const ledSuit=trick[0].card.suit;
    const following=hand.filter(c=>c.suit===ledSuit);
    return new Set((following.length?following:hand).map(c=>c.id));
  }
  // Jokers may be played at any time. A leading Joker does not establish a suit;
  // the first normal card establishes the suit for players who act after it.
  const ledSuit=firstNormalSuit(trick);
  if (!ledSuit) return new Set(hand.map(c=>c.id));
  const jokers=hand.filter(c=>c.joker);
  const following=hand.filter(c=>!c.joker&&c.suit===ledSuit);
  const legal=following.length?[...following,...jokers]:hand;
  return new Set(legal.map(c=>c.id));
}

function rankValue(rank) { return RANKS.indexOf(rank); }

export function trickWinnerScrew(trick,trump) {
  if(!trick.length) throw new Error('Cannot resolve empty trick.');
  const ledSuit=trick[0].card.suit;
  const trumpCards=trump==='none'?[]:trick.filter(x=>x.card.suit===trump);
  const contenders=trumpCards.length?trumpCards:trick.filter(x=>x.card.suit===ledSuit);
  return contenders.reduce((best,x)=>rankValue(x.card.rank)>rankValue(best.card.rank)?x:best).playerId;
}

function fuckStrength(card,index,{trump,powerRank,ledSuit}) {
  // Bigger tier wins. For equal high-joker/special tiers, scanning in play order keeps the first.
  if (card.joker==='low') return [0,index]; // later low Joker is higher, but every normal card beats it
  if (trump!=='none'&&!card.joker&&card.rank===powerRank&&card.suit===trump) return [100,0];
  if (card.joker==='high') return [90,0];
  if (!card.joker&&card.rank===powerRank) return [80,0];
  if (!card.joker&&trump!=='none'&&card.suit===trump) return [60,rankValue(card.rank)];
  if (!card.joker&&ledSuit&&card.suit===ledSuit) return [40,rankValue(card.rank)];
  if (!card.joker&&!ledSuit) return [40,rankValue(card.rank)];
  return [20,rankValue(card.rank)];
}

export function trickWinnerFuck(trick,trump,handSize) {
  if(!trick.length) throw new Error('Cannot resolve empty trick.');
  const powerRank=SPECIAL_RANK_BY_HAND[handSize];
  const ledSuit=firstNormalSuit(trick);
  let bestIndex=0;
  let best=fuckStrength(trick[0].card,0,{trump,powerRank,ledSuit});
  for(let i=1;i<trick.length;i++) {
    const score=fuckStrength(trick[i].card,i,{trump,powerRank,ledSuit});
    if(score[0]>best[0]||(score[0]===best[0]&&score[1]>best[1])) {best=score;bestIndex=i;}
  }
  return trick[bestIndex].playerId;
}

export function trickWinnerForGame(gameType,trick,trump,handSize) {
  return gameType===GAME_TYPES.FUCK?trickWinnerFuck(trick,trump,handSize):trickWinnerScrew(trick,trump);
}

export function scoreBid(bid,tricks) { return bid===tricks?10+bid:0; }

export function nextClockwise(playerIds,currentId) {
  const idx=playerIds.indexOf(currentId);
  return playerIds[(idx+1)%playerIds.length];
}

export function smearCardGameValue(card) {
  return ({A:11,'10':10,K:3,Q:2,J:1}[card?.rank] || 0);
}

function smearRankValue(rank) { return SMEAR_RANKS.indexOf(rank); }

/**
 * Score the four Smear points after all six tricks are complete.
 * High/Low belong to the teams that PLAYED the highest/lowest trump.
 * Jack belongs to the team that CAPTURED the Jack of trump, when dealt.
 * Game belongs to the team with the larger captured-card value; a tie is no game out.
 */
export function scoreSmearPoints({trump,trumpPlays=[],capturedByTeam={A:[],B:[]}}) {
  const points={A:0,B:0};
  const awards={high:null,low:null,jack:null,game:null};
  const played=[...trumpPlays].filter(x=>x?.card?.suit===trump);
  if (played.length) {
    const high=played.reduce((a,b)=>smearRankValue(b.card.rank)>smearRankValue(a.card.rank)?b:a);
    const low=played.reduce((a,b)=>smearRankValue(b.card.rank)<smearRankValue(a.card.rank)?b:a);
    awards.high=high.team; awards.low=low.team; points[high.team]++; points[low.team]++;
  }
  for (const team of ['A','B']) {
    if ((capturedByTeam[team]||[]).some(c=>c.suit===trump&&c.rank==='J')) { awards.jack=team; points[team]++; break; }
  }
  const gameValues={A:(capturedByTeam.A||[]).reduce((n,c)=>n+smearCardGameValue(c),0),B:(capturedByTeam.B||[]).reduce((n,c)=>n+smearCardGameValue(c),0)};
  if (gameValues.A!==gameValues.B) { awards.game=gameValues.A>gameValues.B?'A':'B'; points[awards.game]++; }
  return {points,awards,gameValues};
}

export function applySmearContract({points,biddingTeam,contract,fourAndOut=false,currentScores={A:0,B:0}}) {
  const defendingTeam=biddingTeam==='A'?'B':'A';
  const next={A:Number(currentScores.A)||0,B:Number(currentScores.B)||0};
  const made=(points[biddingTeam]||0)>=contract;
  next[defendingTeam]+=points[defendingTeam]||0;
  if (fourAndOut) {
    if (made && (points[biddingTeam]||0)===4) return {scores:{...next,[biddingTeam]:11},made:true,winnerTeam:biddingTeam,instantWin:true};
    next[biddingTeam]-=11;
    return {scores:next,made:false,winnerTeam:null,instantWin:false};
  }
  if (made) next[biddingTeam]+=points[biddingTeam]||0; else next[biddingTeam]-=contract;
  let winnerTeam=null;
  const a11=next.A>=11,b11=next.B>=11;
  if (a11&&b11) winnerTeam=biddingTeam;
  else if (a11) winnerTeam='A';
  else if (b11) winnerTeam='B';
  return {scores:next,made,winnerTeam,instantWin:false};
}

export function dealRound(playerIds,handSize,gameType=GAME_TYPES.SCREW,rng=Math.random) {
  const deck=shuffle(makeDeck(gameType),rng);
  const hands=Object.fromEntries(playerIds.map(id=>[id,[]]));
  let cursor=0;
  for(let i=0;i<handSize;i++) for(const id of playerIds) hands[id].push(deck[cursor++]);
  for(const id of playerIds) hands[id]=sortHand(hands[id]);
  return {hands,undealt:deck.slice(cursor)};
}
