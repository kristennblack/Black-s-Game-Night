export const NORTH=1,EAST=2,SOUTH=4,WEST=8;
export const DIRS=[[0,-1,NORTH,SOUTH],[1,0,EAST,WEST],[0,1,SOUTH,NORTH],[-1,0,WEST,EAST]];
export function rotateMask(mask){return ((mask<<1)&15)|((mask>>3)&1)}
export function pipeIndex(x,y,n){return y*n+x}

export function buildPipePuzzle({n=6,level=1,rng=Math.random}={}){
  const target=Array(n*n).fill(0),seen=new Set([0]),stack=[[0,0]];
  while(stack.length){
    const [x,y]=stack[stack.length-1],opts=[];
    for(const [dx,dy,a,b] of DIRS){const nx=x+dx,ny=y+dy;if(nx>=0&&ny>=0&&nx<n&&ny<n&&!seen.has(pipeIndex(nx,ny,n)))opts.push([nx,ny,a,b])}
    if(!opts.length){stack.pop();continue}
    const [nx,ny,a,b]=opts[Math.floor(rng()*opts.length)];target[pipeIndex(x,y,n)]|=a;target[pipeIndex(nx,ny,n)]|=b;seen.add(pipeIndex(nx,ny,n));stack.push([nx,ny]);
  }
  const tiles=target.map(mask=>{let r=mask;const turns=Math.floor(rng()*4);for(let i=0;i<turns;i++)r=rotateMask(r);return r});
  const hazards=Array(n*n).fill(null),hazardCount=Math.min(4,Math.max(0,Math.floor((level-1)/2)));
  const kinds=['mud','leak','valve'];
  const candidates=[...Array(n*n).keys()].filter(i=>i!==0&&i!==n*n-1);
  for(let k=0;k<hazardCount&&candidates.length;k++){
    const pos=Math.floor(rng()*candidates.length),i=candidates.splice(pos,1)[0];hazards[i]=kinds[(level+k)%kinds.length];
  }
  return {n,target,tiles,hazards};
}

export function tracePipeFlow(tiles,n){
  const depth=Array(n*n).fill(-1),queue=[[0,0]];depth[0]=0;
  while(queue.length){
    const [x,y]=queue.shift(),i=pipeIndex(x,y,n),mask=tiles[i];
    for(const [dx,dy,a,b] of DIRS)if(mask&a){
      const nx=x+dx,ny=y+dy;if(nx<0||ny<0||nx>=n||ny>=n)continue;
      const ni=pipeIndex(nx,ny,n);if(depth[ni]>=0||!(tiles[ni]&b))continue;depth[ni]=depth[i]+1;queue.push([nx,ny]);
    }
  }
  return {depth,connected:depth.every(v=>v>=0),destinationConnected:depth[n*n-1]>=0,destinationDepth:depth[n*n-1],maxDepth:Math.max(...depth)};
}
