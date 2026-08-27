export function hashString(value=''){
  let h=2166136261>>>0;
  for(let i=0;i<value.length;i++){h^=value.charCodeAt(i);h=Math.imul(h,16777619)}
  return h>>>0;
}

export function mulberry32(seed){
  let a=seed>>>0;
  return function(){a|=0;a=(a+0x6D2B79F5)|0;let t=Math.imul(a^(a>>>15),1|a);t=(t+Math.imul(t^(t>>>7),61|t))^t;return ((t^(t>>>14))>>>0)/4294967296}
}

export function shuffle(items,rng=Math.random){
  const out=[...items];
  for(let i=out.length-1;i>0;i--){const j=Math.floor(rng()*(i+1));[out[i],out[j]]=[out[j],out[i]]}
  return out;
}

export function sizeForJourneyLevel(level){
  const n=Math.max(1,Number(level)||1);
  if(n<=5)return 6;
  if(n<=10)return 7;
  if(n<=15)return 8;
  return 9;
}

export function dailyPuzzleSeed(date=new Date()){
  const y=date.getUTCFullYear(),m=String(date.getUTCMonth()+1).padStart(2,'0'),d=String(date.getUTCDate()).padStart(2,'0');
  return hashString(`logan-daily-${y}-${m}-${d}`);
}

function makeSolution(n,rng){
  const used=new Set(),cols=Array(n).fill(-1);
  function place(row){
    if(row===n)return true;
    for(const col of shuffle([...Array(n).keys()],rng)){
      if(used.has(col))continue;
      if(row>0&&Math.abs(col-cols[row-1])<=1)continue;
      cols[row]=col;used.add(col);
      if(place(row+1))return true;
      used.delete(col);cols[row]=-1;
    }
    return false;
  }
  return place(0)?cols:null;
}

function fourNeighbors(i,n){
  const x=i%n,y=Math.floor(i/n),out=[];
  if(x>0)out.push(i-1);if(x<n-1)out.push(i+1);if(y>0)out.push(i-n);if(y<n-1)out.push(i+n);
  return out;
}

function regionConnected(regions,n,region){
  const cells=[];for(let i=0;i<regions.length;i++)if(regions[i]===region)cells.push(i);
  if(!cells.length)return false;
  const pool=new Set(cells),seen=new Set([cells[0]]),stack=[cells[0]];
  while(stack.length){const i=stack.pop();for(const j of fourNeighbors(i,n))if(pool.has(j)&&!seen.has(j)){seen.add(j);stack.push(j)}}
  return seen.size===cells.length;
}

export function countSolutions(puzzle,limit=2){
  const {n,regions}=puzzle,usedCols=new Set(),usedRegions=new Set();
  let count=0;
  function walk(row,prevCol){
    if(count>=limit)return;
    if(row===n){count++;return}
    for(let col=0;col<n;col++){
      const region=regions[row*n+col];
      if(usedCols.has(col)||usedRegions.has(region))continue;
      if(row>0&&Math.abs(col-prevCol)<=1)continue;
      usedCols.add(col);usedRegions.add(region);walk(row+1,col);usedCols.delete(col);usedRegions.delete(region);
      if(count>=limit)return;
    }
  }
  walk(0,-99);return count;
}

function buildUniqueConnectedRegions(n,solution,rng){
  // Start from a deliberately unique partition: every non-solution cell belongs to
  // region 0 while each other solution cell is its own seed. Then grow those seed
  // regions only when uniqueness remains intact. This guarantees a valid unique
  // puzzle while producing connected, irregular outdoor terrain zones.
  const regions=Array(n*n).fill(0),sizes=Array(n).fill(0),seedCells=new Set();
  for(let row=0;row<n;row++){const seed=row*n+solution[row];seedCells.add(seed);regions[seed]=row;}
  for(const region of regions)sizes[region]++;
  const target=n;
  let changed=true,passes=0;
  while(changed&&passes++<180){
    changed=false;
    const order=shuffle([...Array(n).keys()].slice(1),rng).sort((a,b)=>sizes[a]-sizes[b]);
    for(const region of order){
      if(sizes[region]>=target+2)continue;
      const candidates=shuffle([...Array(n*n).keys()].filter(i=>regions[i]===0&&!seedCells.has(i)&&fourNeighbors(i,n).some(j=>regions[j]===region)),rng);
      for(const cell of candidates){
        regions[cell]=region;
        const puzzle={n,regions};
        if(regionConnected(regions,n,0)&&countSolutions(puzzle,2)===1){sizes[0]--;sizes[region]++;changed=true;break}
        regions[cell]=0;
      }
    }
  }
  return regions;
}

const TERRAIN=['mud','forest','gravel','shoreline','grass','sand','creek','camp','rock'];

export function generatePuzzle({n=6,seed=1}={}){
  n=Math.max(4,Math.min(9,Math.floor(n)));
  const rng=mulberry32((Number(seed)||1)>>>0),solution=makeSolution(n,rng);
  if(!solution)throw new Error(`Unable to build a ${n}x${n} Logan solution`);
  const regions=buildUniqueConnectedRegions(n,solution,rng);
  const terrain=shuffle([...Array(n).keys()].map((_,i)=>TERRAIN[i%TERRAIN.length]),rng);
  const puzzle={n,seed,solution:[...solution],regions,terrain};
  if(countSolutions(puzzle,2)!==1)throw new Error(`Unable to generate a unique ${n}x${n} Logan puzzle`);
  return puzzle;
}

export function placementConflicts(puzzle,marks){
  const {n,regions}=puzzle,bikes=[];
  for(let i=0;i<marks.length;i++)if(marks[i]===2)bikes.push(i);
  const bad=new Set();
  for(let a=0;a<bikes.length;a++)for(let b=a+1;b<bikes.length;b++){
    const ia=bikes[a],ib=bikes[b],ax=ia%n,ay=Math.floor(ia/n),bx=ib%n,by=Math.floor(ib/n);
    const sameRow=ay===by,sameCol=ax===bx,sameRegion=regions[ia]===regions[ib],touch=Math.max(Math.abs(ax-bx),Math.abs(ay-by))<=1;
    if(sameRow||sameCol||sameRegion||touch){bad.add(ia);bad.add(ib)}
  }
  return bad;
}

export function isSolved(puzzle,marks){
  const {n,regions}=puzzle,bikes=[];
  for(let i=0;i<marks.length;i++)if(marks[i]===2)bikes.push(i);
  if(bikes.length!==n||placementConflicts(puzzle,marks).size)return false;
  const rows=new Set(),cols=new Set(),regs=new Set();
  for(const i of bikes){rows.add(Math.floor(i/n));cols.add(i%n);regs.add(regions[i])}
  return rows.size===n&&cols.size===n&&regs.size===n;
}

export function solutionIndexForRow(puzzle,row){return row*puzzle.n+puzzle.solution[row]}
export function allRegionsConnected(puzzle){return [...Array(puzzle.n).keys()].every(region=>regionConnected(puzzle.regions,puzzle.n,region))}
