import test from 'node:test';
import assert from 'node:assert/strict';
import {createStopwatch,recordKey,readBest,saveBest,formatTime} from '../src/timer.js';
test('cronômetro inicia, pausa, retoma e finaliza sem contar tempo pausado',()=>{
 let t=0;const clock=createStopwatch(()=>t);
 clock.start();t=1500;assert.equal(clock.elapsed(),1500);
 clock.pause();t=8000;assert.equal(clock.elapsed(),1500);
 clock.start();t=8500;assert.equal(clock.finish(),2000);
 t=9999;clock.start();assert.equal(clock.elapsed(),2000);
 clock.reset();assert.equal(clock.elapsed(),0);assert.equal(clock.finished,false);
});
test('recorde só melhora com tempo válido e sobrevive à repetição',()=>{
 const map=new Map();const storage={getItem:k=>map.get(k)??null,setItem:(k,v)=>map.set(k,v)};
 const key=recordKey('image-a',2);
 assert.deepEqual(saveBest(storage,key,5000),{best:5000,improved:true});
 assert.deepEqual(saveBest(storage,key,7000),{best:5000,improved:false});
 assert.deepEqual(saveBest(storage,key,0),{best:5000,improved:false});
 assert.deepEqual(saveBest(storage,key,4000),{best:4000,improved:true});
 assert.equal(readBest(storage,key),4000);
 assert.equal(readBest(storage,recordKey('image-a',3)),null);
 assert.equal(readBest(storage,recordKey('image-b',2)),null);
 assert.equal(readBest(storage,recordKey('image-a',2,2)),null);
 assert.equal(readBest(storage,recordKey('image-a',2,1,'random')),null);
});
test('falha de armazenamento não gera falso recorde',()=>{
 const storage={getItem(){throw Error('blocked')},setItem(){throw Error('blocked')}};
 assert.deepEqual(saveBest(storage,recordKey('x',0),1000),{best:null,improved:false});
 assert.equal(formatTime(125000),'02:05');
});
