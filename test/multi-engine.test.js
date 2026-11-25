import test from 'node:test';
import assert from 'node:assert/strict';
import {CUTS} from '../src/engine.js';
import {boardCounts,boardSlots,createMulti,swapMulti,multiProgress,compatibleBoardSlots,ensureUnsolvedMulti,isMultiSnapshot} from '../src/multi-engine.js';

test('distribui os dez níveis pelos dois critérios sem alterar a contagem',()=>{
 for(const [level,n] of CUTS.entries())for(const k of [2,3]){
  const total=boardCounts(level,k,'total'), per=boardCounts(level,k,'per-image');
  assert.equal(total.reduce((a,b)=>a+b),n);
  assert.ok(Math.max(...total)-Math.min(...total)<=1);
  assert.deepEqual(per,Array(k).fill(n));
  assert.deepEqual(boardSlots(total).flat().map(s=>s.id),Array.from({length:n},(_,i)=>i));
 }
 assert.throws(()=>boardCounts(0,1,'total'),RangeError);
});
test('embaralha entre imagens e só termina quando todos os tabuleiros estão corretos',()=>{
 for(const k of [2,3]) for(const policy of ['total','per-image']){
  let state=createMulti(1,k,policy,()=>1);
  const counts=boardCounts(state.level,k,policy);
  assert.ok(state.pieces.slice(0,counts[0]).some(id=>id>=counts[0]));
  assert.equal(multiProgress(state.pieces,counts).complete,false);
  const initial=[...state.initialPieces];
  for(let i=0;i<state.pieces.length;i++)if(state.pieces[i]!==i) state=swapMulti(state,i,state.pieces.indexOf(i));
  assert.ok(state.moves>0);
  assert.deepEqual(state.initialPieces,initial);
  assert.deepEqual(multiProgress(state.pieces,counts),{byBoard:Array(k).fill(100),total:100,complete:true});
  assert.equal(swapMulti(state,0,1),state);
 }
});
test('valida imagens, permutação, posição inicial e versão dos saves',()=>{
 const images=Array.from({length:3},()=>new Blob(['fixture'],{type:'image/png'}));
 const state={...createMulti(0,3,'total'),images,version:1,cut:'random',elapsedMs:400};
 assert.equal(isMultiSnapshot(state),true);
 assert.equal(isMultiSnapshot({...state,images:images.slice(1)}),false);
 assert.equal(isMultiSnapshot({...state,pieces:[0,0,2,3]}),false);
 assert.equal(isMultiSnapshot({...state,initialPieces:[]}),false);
 assert.equal(isMultiSnapshot({...state,version:99}),false);
});

test('accepts the browser-portable bytes format without dropping v1 Blob support',()=>{
 const images=Array.from({length:2},()=>({bytes:new Uint8Array([1,2,3]).buffer,type:'image/png'}));
 const state={...createMulti(0,2,'total'),images,version:2,cut:'random',elapsedMs:400};
 assert.equal(isMultiSnapshot(structuredClone(state)),true);
 assert.equal(isMultiSnapshot({...state,version:1}),false);
 assert.equal(isMultiSnapshot({...state,images:[{bytes:new ArrayBuffer(0),type:'image/png'},images[1]]}),false);
});

test('recognizes both correctly assembled images even when their boards are swapped',()=>{
 // 16 total across three boards gives 6/5/5. The old check reports 38/100 here.
 const counts=[6,5,5];
 const swapped=[0,1,2,3,4,5,11,12,13,14,15,6,7,8,9,10];
 const compatible=[[true,false,false],[false,true,true],[false,true,true]];
 assert.deepEqual(multiProgress(swapped,counts,compatible),{byBoard:[100,100,100],total:100,complete:true});
 const almost=[...swapped];[almost[6],almost[7]]=[almost[7],almost[6]];
 assert.deepEqual(multiProgress(almost,counts,compatible),{byBoard:[100,60,100],total:88,complete:false});
 assert.deepEqual(multiProgress(swapped,counts,[[true,false,false],[false,true,false],[false,false,true]]),
  {byBoard:[100,0,0],total:38,complete:false});
});

test('matches normalized cut geometry and repairs a starting shuffle that already looks solved',()=>{
 const left={x:0,y:0,width:.5,height:1},right={x:.5,y:0,width:.5,height:1};
 const top={x:0,y:0,width:1,height:.5},bottom={x:0,y:.5,width:1,height:.5};
 const matrix=compatibleBoardSlots([[left,right],[{...left},{...right}],[top,bottom]]);
 assert.deepEqual(matrix,[[true,true,false],[true,true,false],[false,false,true]]);
 const pieces=[2,3,0,1,4,5];
 assert.equal(multiProgress(pieces,[2,2,2],matrix).complete,true);
 const initial=ensureUnsolvedMulti(pieces,[2,2,2],matrix);
 assert.deepEqual(initial,[3,2,0,1,4,5]);
 assert.equal(multiProgress(initial,[2,2,2],matrix).complete,false);
});
