import test from 'node:test';
import assert from 'node:assert/strict';
import {createStopwatch,recordKey,readBest,saveBest} from '../src/timer.js';

test('pausas sucessivas não entram no tempo e concluir é idempotente', () => {
 let now=1000;
 const clock=createStopwatch(()=>now);
 clock.start();now=2200;clock.pause();
 now=12000;assert.equal(clock.elapsed(),1200);
 clock.start();now=13500;clock.pause();
 now=19000;clock.start();now=19300;
 assert.equal(clock.finish(),3000);
 now=90000;clock.start();
 assert.equal(clock.finish(),3000);
 assert.equal(clock.running,false);
 assert.equal(clock.finished,true);
});

test('recorde só melhora com tempo menor, mesmo após repetição', () => {
 const map=new Map();
 const storage={getItem:k=>map.get(k)??null,setItem:(k,v)=>map.set(k,v)};
 const key=recordKey('image-a',2,1,'square');
 assert.deepEqual(saveBest(storage,key,0),{best:null,improved:false});
 assert.equal(saveBest(storage,key,5600).improved,true);
 assert.deepEqual(saveBest(storage,key,5600),{best:5600,improved:false});
 assert.deepEqual(saveBest(storage,key,8100),{best:5600,improved:false});
 assert.equal(saveBest(storage,key,4200).improved,true);
 assert.equal(readBest(storage,key),4200);
});

test('armazenamento que falha silenciosamente não anuncia novo recorde', () => {
 const storage={getItem:()=>null,setItem:()=>{}};
 const key=recordKey('image-b',1,1,'square');
 assert.deepEqual(saveBest(storage,key,2000),{best:null,improved:false});
});
