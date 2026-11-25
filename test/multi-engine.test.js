import test from 'node:test';
import assert from 'node:assert/strict';
import {CUTS} from '../src/engine.js';
import {boardCounts,boardSlots,createMulti,swapMulti,multiProgress,isMultiSnapshot} from '../src/multi-engine.js';

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
