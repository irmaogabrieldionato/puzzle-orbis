import test from 'node:test';
import assert from 'node:assert/strict';
import {createStopwatch,recordKey,readBest,saveBest} from '../src/timer.js';

function storage(){
 const data=new Map();
 return {getItem:k=>data.has(k)?data.get(k):null,setItem:(k,v)=>data.set(k,String(v)),data};
}

test('record keys distinguish ambiguous image IDs and all configuration dimensions',()=>{
 const ids=[
  recordKey('a,b',2,1,'square'),
  recordKey('a',2,1,'b,square'),
  recordKey('a,b',3,1,'square'),
  recordKey('a,b',2,2,'square'),
  recordKey('a,b',2,1,'rectangle')
 ];
 assert.equal(new Set(ids).size,ids.length);
});

test('record survives replay, ties and slower completions',()=>{
 const s=storage(),key=recordKey('image-1',0);
 assert.deepEqual(saveBest(s,key,4300),{best:4300,improved:true});
 assert.deepEqual(saveBest(s,key,4300),{best:4300,improved:false});
 assert.deepEqual(saveBest(s,key,5800),{best:4300,improved:false});
 assert.deepEqual(saveBest(s,key,3100),{best:3100,improved:true});
 assert.equal(readBest(s,key),3100);
});

test('invalid stored records and failed writes do not report false improvement',()=>{
 const s=storage(),key=recordKey('image-1',0);
 for(const value of ['NaN','-2','0','1.5','Infinity','9007199254740992']){
  s.data.set(key,value);
  assert.equal(readBest(s,key),null);
 }
 const blocked={getItem:()=>null,setItem:()=>{throw new Error('quota exceeded')}};
 assert.deepEqual(saveBest(blocked,key,1000),{best:null,improved:false});
});

test('paused restore and repeated finish never accumulate extra time',()=>{
 let now=100;
 const clock=createStopwatch(()=>now);
 clock.restore(2500);
 now=10000;
 assert.equal(clock.elapsed(),2500);
 clock.start();now=11000;clock.pause();
 assert.equal(clock.elapsed(),3500);
 assert.equal(clock.finish(),3500);
 now=25000;
 clock.start();
 assert.equal(clock.finish(),3500);
 assert.equal(clock.elapsed(),3500);
});
