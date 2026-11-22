import test from 'node:test';
import assert from 'node:assert/strict';
import {CUTS,shuffled,swap,solved,progress,isPermutation,pieceRect,pieceAt} from '../src/engine.js';
import {createStopwatch,recordKey,readBest,saveBest} from '../src/timer.js';

// Simula partidas completas usando as mesmas operações de troca usadas pela interface.
function playToCompletion(count,random=()=>0.37){
 let pieces=shuffled(count,random);
 assert.equal(isPermutation(pieces,count),true);
 assert.equal(solved(pieces),false);
 let moves=0;
 for(let i=0;i<count;i++){
  if(pieces[i]===i)continue;
  const j=pieces.indexOf(i);
  assert.ok(j>=0);
  pieces=swap(pieces,i,j);
  moves++;
  assert.equal(isPermutation(pieces,count),true);
  assert.ok(progress(pieces)<=100);
 }
 assert.equal(solved(pieces),true);
 assert.equal(progress(pieces),100);
 return moves;
}
test('partida simulada: resolver os dez níveis sem perder ou duplicar peças',()=>{
 for(const count of CUTS){
  const moves=playToCompletion(count);
  assert.ok(moves>0&&moves<=count);
 }
});
test('partida simulada: cliques no centro de cada peça apontam para a posição correta',()=>{
 for(const count of CUTS){
  for(let i=0;i<count;i++){
   const r=pieceRect(i,count);
   assert.equal(pieceAt(r.x+r.width/2,r.y+r.height/2,count),i);
  }
 }
});
test('partida simulada: repetir para bater recorde e não premiar desistência',()=>{
 let now=0;
 const storageMap=new Map();
 const storage={getItem:key=>storageMap.get(key)??null,setItem:(key,value)=>storageMap.set(key,value)};
 const key=recordKey('image-fixture-1',2,1,'square');
 const clock=createStopwatch(()=>now);
 clock.start();playToCompletion(CUTS[2]);now=9000;
 assert.deepEqual(saveBest(storage,key,clock.finish()),{best:9000,improved:true});
 clock.reset();clock.start();now=15000;playToCompletion(CUTS[2]);
 assert.deepEqual(saveBest(storage,key,clock.finish()),{best:6000,improved:true});
 clock.reset();clock.start();now=23000;playToCompletion(CUTS[2]);
 assert.deepEqual(saveBest(storage,key,clock.finish()),{best:6000,improved:false});
 clock.reset();clock.start();now=25000;clock.pause(); // desistência: não chama saveBest
 assert.equal(readBest(storage,key),6000);
 assert.equal(readBest(storage,recordKey('image-fixture-2',2,1,'square')),null);
});
test('partida simulada: pausa e restauração não contam tempo fora da partida',()=>{
 let now=0;const c=createStopwatch(()=>now);c.start();now=1500;c.pause();now=30000;
 assert.equal(c.elapsed(),1500);c.start();now=31000;
 const saved=c.elapsed();assert.equal(saved,2500);
 const r=createStopwatch(()=>now);r.restore(saved);now=90000;assert.equal(r.elapsed(),2500);
 r.start();now=92000;assert.equal(r.finish(),4500);
});
