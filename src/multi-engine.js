import {CUTS,isPermutation,shuffled,swap,solved} from './engine.js';

// The UI names both policies rather than silently multiplying a selected level.
export function boardCounts(level,imageCount,policy) {
 const n=CUTS[level];
 if(!Number.isInteger(level)||!n||![2,3].includes(imageCount)||!['total','per-image'].includes(policy)) throw new RangeError('Invalid setup');
 return Array.from({length:imageCount},(_,i)=>policy==='per-image'?n:Math.floor(n/imageCount)+(i<n%imageCount?1:0));
}
export function createMulti(level,imageCount,policy,random=Math.random) {
 const counts=boardCounts(level,imageCount,policy);
 const pieces=shuffled(counts.reduce((a,b)=>a+b,0),random);
 // Ensure there is at least one cross-image swap, even for RNG that yields
 // an identity permutation except for the shuffle's first-two fallback.
 if(pieces.slice(0,counts[0]).every(id=>id<counts[0])) {
  const other=pieces.findIndex((id,index)=>index>=counts[0]&&id>=counts[0]);
  if(other>=0)[pieces[0],pieces[other]]=[pieces[other],pieces[0]];
 }
 return {level,imageCount,policy,pieces,initialPieces:[...pieces],moves:0};
}
export function boardSlots(counts) {
 let global=0;
 return counts.map((n,board)=>Array.from({length:n},(_,slot)=>({board,slot,id:global++})));
}
const rectKeys=['x','y','width','height'];
export function compatibleBoardSlots(regions) {
 return regions.map((target,t)=>regions.map((source,s)=>t===s||(target.length===source.length&&
  target.every((rect,i)=>rectKeys.every(k=>Math.abs(rect[k]-source[i][k])<1e-9)))));
}
export function multiProgress(pieces,counts,compatible) {
 const offsets=[];
 let totalPieces=0;
 for(const n of counts){offsets.push(totalPieces);totalPieces+=n;}
 // Each board can depict one whole source image. Match it at most once, using
 // the same slot geometry, and choose the assignment with the most correct slots.
 const scores=counts.map((n,target)=>counts.map((m,source)=>{
  if(n!==m||(target!==source&&!compatible?.[target]?.[source]))return -1;
  let score=0;
  for(let i=0;i<n;i++)if(pieces[offsets[target]+i]===offsets[source]+i)score++;
  return score;
 }));
 let best=-1, matches=[];
 function assign(target,used,score,byBoard){
  if(target===counts.length){
   if(score>best){best=score;matches=[...byBoard];}
   return;
  }
  for(let source=0;source<counts.length;source++){
   if((used&(1<<source))||scores[target][source]<0)continue;
   byBoard.push(scores[target][source]);
   assign(target+1,used|(1<<source),score+scores[target][source],byBoard);
   byBoard.pop();
  }
 }
 assign(0,0,0,[]);
 const percent=(n,outOf)=>n===outOf?100:Math.min(99,Math.round(100*n/outOf));
 const complete=totalPieces>0&&best===totalPieces&&pieces.length===totalPieces;
 return {byBoard:matches.map((n,i)=>percent(n,counts[i])),total:totalPieces?percent(best,totalPieces):0,complete};
}
export function ensureUnsolvedMulti(pieces,counts,compatible) {
 if(!multiProgress(pieces,counts,compatible).complete)return pieces;
 // At least one board in a valid game has two slots. An internal swap creates
 // a genuine puzzle, not just a different mapping of whole images.
 let offset=0;
 for(const count of counts){
  if(count>=2)return swap(pieces,offset,offset+1);
  offset+=count;
 }
 return pieces;
}
export function swapMulti(state,first,second) {
 const n=state.pieces.length;
 if(![first,second].every(i=>Number.isInteger(i)&&i>=0&&i<n)||first===second||solved(state.pieces))return state;
 return {...state,moves:state.moves+1,pieces:swap(state.pieces,first,second)};
}
export function isMultiSnapshot(s) {
 if(!s||![1,2].includes(s.version)||!Array.isArray(s.images)||s.images.length!==s.imageCount||
    !s.images.every(i=>{
     const size=s.version===1?(i instanceof Blob?i.size:0):(i?.bytes instanceof ArrayBuffer?i.bytes.byteLength:0);
     return typeof i?.type==='string'&&i.type.startsWith('image/')&&size>0&&size<=8*1024*1024;
    })||
    !['square','rectangular','mixed','random'].includes(s.cut)||
    !Number.isSafeInteger(s.moves)||s.moves<0||!Number.isSafeInteger(s.elapsedMs)||s.elapsedMs<0)return false;
 try{
  const n=boardCounts(s.level,s.imageCount,s.policy).reduce((a,b)=>a+b,0);
  return isPermutation(s.pieces,n)&&isPermutation(s.initialPieces,n);
 }catch{return false;}
}
