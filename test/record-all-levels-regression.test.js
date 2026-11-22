import test from 'node:test';
import assert from 'node:assert/strict';
import {CUTS,shuffled,swap,solved} from '../src/engine.js';
import {createStopwatch,recordKey,readBest,saveBest} from '../src/timer.js';

const storage=()=>{const data=new Map();return {getItem:key=>data.get(key)??null,setItem:(key,value)=>data.set(key,value)}};

function finishPuzzle(pieceCount){
 let pieces=shuffled(pieceCount,()=>0.31);
 for(let i=0;i<pieceCount;i++){
  if(pieces[i]===i)continue;
  pieces=swap(pieces,i,pieces.indexOf(i));
 }
 assert.equal(solved(pieces),true);
}

test('recordes locais são independentes nos dez níveis, imagens, quantidades e modalidades',()=>{
 const store=storage();
 for(let level=0;level<CUTS.length;level++){
  finishPuzzle(CUTS[level]);
  const key=recordKey('same-image',level,1,'square');
  assert.deepEqual(saveBest(store,key,10000+level*1000),{best:10000+level*1000,improved:true});
 }
 for(let level=0;level<CUTS.length;level++){
  const key=recordKey('same-image',level,1,'square');
  assert.equal(readBest(store,key),10000+level*1000);
  for(const variant of [
   recordKey('another-image',level,1,'square'),
   recordKey('same-image',level,2,'square'),
   recordKey('same-image',level,3,'square'),
   recordKey('same-image',level,1,'rectangle'),
   recordKey('same-image',level,1,'mixed'),
   recordKey('same-image',level,1,'random')
  ])assert.equal(readBest(store,variant),null);
 }
});

test('repetição, pausa e desistência não apagam nem alteram recorde pessoal',()=>{
 let now=0;
 const store=storage(),clock=createStopwatch(()=>now);
 const key=recordKey('fixture',0,1,'square');
 clock.start();now=3200;clock.pause();now=7000;clock.start();now=8800;
 finishPuzzle(4);
 assert.deepEqual(saveBest(store,key,clock.finish()),{best:5000,improved:true});
 clock.reset();now=10000;clock.start();now=17000;finishPuzzle(4);
 assert.deepEqual(saveBest(store,key,clock.finish()),{best:5000,improved:false});
 clock.reset();now=18000;clock.start();now=20000;clock.pause(); // desistiu, sem vitória
 assert.equal(readBest(store,key),5000);
 clock.reset();now=22000;clock.start();now=25000;finishPuzzle(4);
 assert.deepEqual(saveBest(store,key,clock.finish()),{best:3000,improved:true});
});

test('identidades de recorde rejeitam números não seguros, fracionários ou inválidos',()=>{
 const invalid=[-1,1.5,NaN,Infinity,Number.MAX_SAFE_INTEGER+1];
 for(const value of invalid){
  assert.throws(()=>recordKey('fixture',value),TypeError);
  assert.throws(()=>recordKey('fixture',0,value),TypeError);
 }
 assert.equal(recordKey('fixture',Number.MAX_SAFE_INTEGER,1,'square'),recordKey('fixture',Number.MAX_SAFE_INTEGER,1,'square'));
});
