import test from 'node:test';
import assert from 'node:assert/strict';
import {
  GAME_TYPES, makeDeck, maxHandSize, roundHandSizes, trumpForRound, forbiddenDealerBid,
  legalCardIds, trickWinnerScrew, trickWinnerFuck, scoreBid, generateFuckSchedule,
  scoreSmearPoints, applySmearContract, teamForSeat, smearBidValue
} from '../gameEngine.mjs';

const c=(id,rank,suit,joker=null)=>({id,rank,suit,joker});
const play=(playerId,card)=>({playerId,card});

test('Screw max hands scale by player count',()=>{assert.equal(maxHandSize(4),13);assert.equal(maxHandSize(5),10);assert.equal(maxHandSize(6),8);assert.equal(maxHandSize(52),1)});
test('Fuck deck is 56 cards with 2 high and 2 low Jokers',()=>{const d=makeDeck(GAME_TYPES.FUCK);assert.equal(d.length,56);assert.equal(d.filter(x=>x.joker==='high').length,2);assert.equal(d.filter(x=>x.joker==='low').length,2)});
test('Fuck max hand stays capped at 13 but uses 56-card capacity',()=>{assert.equal(maxHandSize(4,GAME_TYPES.FUCK),13);assert.equal(maxHandSize(5,GAME_TYPES.FUCK),11);assert.equal(maxHandSize(8,GAME_TYPES.FUCK),7);assert.equal(maxHandSize(56,GAME_TYPES.FUCK),1)});
test('Screw rounds climb then descend without repeating peak',()=>{assert.deepEqual(roundHandSizes(5),[1,2,3,4,5,6,7,8,9,10,9,8,7,6,5,4,3,2,1])});
test('Screw trump cycles continuously',()=>{assert.deepEqual(Array.from({length:7},(_,i)=>trumpForRound(i)),['hearts','clubs','diamonds','spades','none','hearts','clubs'])});
test('dealer forbidden bid enforces total not equal to hand size',()=>{assert.equal(forbiddenDealerBid(5,[4,1,0]),0);assert.equal(forbiddenDealerBid(5,[2,1,0]),2);assert.equal(forbiddenDealerBid(5,[4,3,0]),null)});
test('Screw must follow suit if able',()=>{const hand=[c('h','2','hearts'),c('c','A','clubs')],trick=[play('x',c('c2','2','clubs'))];assert.deepEqual([...legalCardIds(hand,trick,GAME_TYPES.SCREW)],['c'])});
test('Fuck Joker is always legal even when player can follow suit',()=>{const hand=[c('c','A','clubs'),c('h','2','hearts'),c('jh','JOKER','joker','high')],trick=[play('x',c('c2','2','clubs'))];assert.deepEqual(new Set(legalCardIds(hand,trick,GAME_TYPES.FUCK)),new Set(['c','jh']))});
test('Fuck leading Joker allows any play until first normal card establishes suit',()=>{const hand=[c('c','A','clubs'),c('h','2','hearts')],trick=[play('x',c('jh','JOKER','joker','high'))];assert.deepEqual(new Set(legalCardIds(hand,trick,GAME_TYPES.FUCK)),new Set(['c','h']))});
test('Screw trump beats led suit',()=>{const trick=[play('a',c('a','A','clubs')),play('b',c('b','2','hearts'))];assert.equal(trickWinnerScrew(trick,'hearts'),'b')});
test('Screw no trump uses highest led suit only',()=>{const trick=[play('a',c('a','10','clubs')),play('b',c('b','A','hearts')),play('c',c('c','K','clubs'))];assert.equal(trickWinnerScrew(trick,'none'),'c')});
test('Fuck trump power-rank card is absolute highest',()=>{const trick=[play('a',c('x','3','clubs')),play('b',c('j','JOKER','joker','high')),play('c',c('t','3','diamonds'))];assert.equal(trickWinnerFuck(trick,'diamonds',3),'c')});
test('Fuck first high Joker wins a high-Joker tie',()=>{const trick=[play('a',c('j1','JOKER','joker','high')),play('b',c('j2','JOKER','joker','high'))];assert.equal(trickWinnerFuck(trick,'hearts',3),'a')});
test('Fuck first non-trump power-rank card wins ties',()=>{const trick=[play('a',c('x','3','clubs')),play('b',c('y','3','spades'))];assert.equal(trickWinnerFuck(trick,'diamonds',3),'a')});
test('Fuck later low Joker beats earlier low Joker but every normal card beats both',()=>{const only=[play('a',c('l1','JOKER','joker','low')),play('b',c('l2','JOKER','joker','low'))];assert.equal(trickWinnerFuck(only,'none',5),'b');const mixed=[...only,play('c',c('n','2','clubs'))];assert.equal(trickWinnerFuck(mixed,'none',5),'c')});
test('Fuck no-trump high Joker is above power rank',()=>{const trick=[play('a',c('q','Q','clubs')),play('b',c('j','JOKER','joker','high'))];assert.equal(trickWinnerFuck(trick,'none',12),'b')});
test('Fuck normal trick-taking resumes below special cards',()=>{const trick=[play('a',c('ac','A','clubs')),play('b',c('2d','2','diamonds')),play('c',c('kc','K','clubs'))];assert.equal(trickWinnerFuck(trick,'diamonds',3),'b')});
test('Fuck random schedule respects requested count and playable max',()=>{const schedule=generateFuckSchedule(80,8,()=>0.314159);assert.equal(schedule.length,80);assert.ok(schedule.every(r=>r.handSize>=1&&r.handSize<=7));assert.ok(schedule.every(r=>['hearts','clubs','diamonds','spades','none'].includes(r.trump)));assert.ok(schedule.every(r=>r.powerRank))});
test('exact bid scoring',()=>{assert.equal(scoreBid(0,0),10);assert.equal(scoreBid(1,1),11);assert.equal(scoreBid(2,3),0);assert.equal(scoreBid(3,2),0)});


test('Smear deck is 32 cards using only 7 through Ace',()=>{const d=makeDeck(GAME_TYPES.SMEAR);assert.equal(d.length,32);assert.deepEqual(new Set(d.map(x=>x.rank)),new Set(['7','8','9','10','J','Q','K','A']))});
test('Smear teams are opposite seats',()=>{assert.equal(teamForSeat(0),'A');assert.equal(teamForSeat(2),'A');assert.equal(teamForSeat(1),'B');assert.equal(teamForSeat(3),'B')});
test('Smear bid order treats 4 and out above regular 4',()=>{assert.equal(smearBidValue('pass'),0);assert.equal(smearBidValue('1'),1);assert.equal(smearBidValue('4'),4);assert.equal(smearBidValue('4out'),5)});
test('Smear follows suit when able',()=>{const hand=[c('h','7','hearts'),c('c','A','clubs')],trick=[play('x',c('c2','10','clubs'))];assert.deepEqual([...legalCardIds(hand,trick,GAME_TYPES.SMEAR)],['c'])});
test('Smear scores High and Low to teams that played them and Jack to capturer',()=>{
 const scored=scoreSmearPoints({trump:'hearts',trumpPlays:[{team:'A',card:c('h7','7','hearts')},{team:'B',card:c('ha','A','hearts')},{team:'A',card:c('hj','J','hearts')}],capturedByTeam:{A:[c('a10','10','clubs'),c('hj2','J','hearts')],B:[c('bk2','K','spades')]}});
 assert.equal(scored.awards.high,'B');assert.equal(scored.awards.low,'A');assert.equal(scored.awards.jack,'A');assert.equal(scored.awards.game,'A');assert.deepEqual(scored.points,{A:3,B:1});
});
test('Smear missing Jack simply leaves three available scoring points',()=>{const scored=scoreSmearPoints({trump:'clubs',trumpPlays:[{team:'A',card:c('c7','7','clubs')},{team:'B',card:c('ca','A','clubs')}],capturedByTeam:{A:[c('a10','10','hearts')],B:[c('bk','K','spades')]}});assert.equal(scored.awards.jack,null);assert.deepEqual(scored.points,{A:2,B:1})});
test('Smear equal game values are no game out',()=>{const scored=scoreSmearPoints({trump:'spades',trumpPlays:[{team:'A',card:c('s7','7','spades')},{team:'B',card:c('sa','A','spades')}],capturedByTeam:{A:[c('a10','10','hearts'),c('aj','J','clubs')],B:[c('ba','A','diamonds')]}});assert.equal(scored.gameValues.A,11);assert.equal(scored.gameValues.B,11);assert.equal(scored.awards.game,null)});
test('Smear bidder set loses bid while defenders still score',()=>{const r=applySmearContract({points:{A:2,B:2},biddingTeam:'A',contract:3,currentScores:{A:5,B:4}});assert.equal(r.made,false);assert.deepEqual(r.scores,{A:2,B:6})});
test('Smear bidder may score more than bid when contract is made',()=>{const r=applySmearContract({points:{A:3,B:1},biddingTeam:'A',contract:2,currentScores:{A:5,B:4}});assert.equal(r.made,true);assert.deepEqual(r.scores,{A:8,B:5})});
test('Smear failed 4 and out is minus 11 and defenders keep earned points',()=>{const r=applySmearContract({points:{A:3,B:1},biddingTeam:'A',contract:4,fourAndOut:true,currentScores:{A:7,B:2}});assert.equal(r.made,false);assert.deepEqual(r.scores,{A:-4,B:3})});
test('Smear successful 4 and out wins immediately',()=>{const r=applySmearContract({points:{A:4,B:0},biddingTeam:'A',contract:4,fourAndOut:true,currentScores:{A:-6,B:10}});assert.equal(r.winnerTeam,'A');assert.equal(r.instantWin,true);assert.equal(r.scores.A,11)});
test('Smear if both teams reach 11 on same hand bidding team wins',()=>{const r=applySmearContract({points:{A:1,B:3},biddingTeam:'A',contract:1,currentScores:{A:10,B:8}});assert.deepEqual(r.scores,{A:11,B:11});assert.equal(r.winnerTeam,'A')});
