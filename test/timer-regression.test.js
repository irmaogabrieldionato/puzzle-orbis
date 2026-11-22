import test from 'node:test';
import assert from 'node:assert/strict';
import {createStopwatch,recordKey,readBest,saveBest} from '../src/timer.js';

test('reiniciar uma tentativa não preserva tempo anterior nem apaga recorde',()=>{
 let now=100;const clock=createStopwatch(()=>now);
 const values=new Map();const storage={getItem:key=>values.get(key)??null,setItem:(key,value)=>values.set(key,value)};
 const key=recordKey('same-image',4,1,'square');
 clock.start();now=5100;assert.equal(clock.finish(),5000);
 assert.deepEqual(saveBest(storage,key,clock.elapsed()),{best:5000,improved:true});
 clock.reset();assert.equal(clock.elapsed(),0);assert.equal(clock.finished,false);
 now=7000;clock.start();now=14000;assert.equal(clock.finish(),7000);
 assert.deepEqual(saveBest(storage,key,clock.elapsed()),{best:5000,improved:false});
 assert.equal(readBest(storage,key),5000);
});

test('identidades equivalentes compartilham recorde e configurações diferentes não',()=>{
 assert.equal(recordKey('img',2,1,'square'),recordKey('img',2,1,'square'));
 assert.notEqual(recordKey('img',2,1,'square'),recordKey('img',2,1,'rectangle'));
 assert.notEqual(recordKey('img',2,1,'square'),recordKey('img',2,2,'square'));
 assert.notEqual(recordKey('img',2,1,'square'),recordKey('img',3,1,'square'));
 assert.throws(()=>recordKey('',2),TypeError);
});

test('tempo parado não avança e finalizar duas vezes não altera resultado',()=>{
 let now=0;const clock=createStopwatch(()=>now);
 clock.start();now=2100;clock.pause();now=30000;
 assert.equal(clock.elapsed(),2100);
 assert.equal(clock.finish(),2100);now=50000;
 assert.equal(clock.finish(),2100);
 assert.equal(clock.elapsed(),2100);
});
