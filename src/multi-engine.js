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
export function multiProgress(pieces,counts) {
 let base=0;
 let correct=0;
 const byBoard=counts.map(n=>{
  let boardCorrect=0;
  for(let i=base;i<base+n;i++)if(pieces[i]===i){correct++;boardCorrect++;}
  base+=n;
  return boardCorrect===n?100:Math.min(99,Math.round(100*boardCorrect/n));
 });
 return {byBoard,total:correct===base?100:Math.min(99,Math.round(100*correct/base)),complete:correct===base&&solved(pieces)};
}
export function swapMulti(state,first,second) {
 const n=state.pieces.length;
 if(![first,second].every(i=>Number.isInteger(i)&&i>=0&&i<n)||first===second||solved(state.pieces))return state;
 return {...state,moves:state.moves+1,pieces:swap(state.pieces,first,second)};
}
export function isMultiSnapshot(s) {
 if(!s||s.version!==1||!Array.isArray(s.images)||s.images.length!==s.imageCount||
    !s.images.every(i=>i instanceof Blob&&i.type.startsWith('image/')&&i.size>0&&i.size<=8*1024*1024)||
    !['square','rectangular','mixed','random'].includes(s.cut)||
    !Number.isSafeInteger(s.moves)||s.moves<0||!Number.isSafeInteger(s.elapsedMs)||s.elapsedMs<0)return false;
 try{
  const n=boardCounts(s.level,s.imageCount,s.policy).reduce((a,b)=>a+b,0);
  return isPermutation(s.pieces,n)&&isPermutation(s.initialPieces,n);
 }catch{return false;}
}
