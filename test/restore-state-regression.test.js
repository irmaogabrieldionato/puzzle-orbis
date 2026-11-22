import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createStopwatch,recordKey,readBest,saveBest} from '../src/timer.js';

const app=readFileSync(new URL('../src/app.js',import.meta.url),'utf8');

test('interface serializa estado de pausa e desistência no salvamento',()=>{
 assert.match(app,/paused:!clock\.running,abandoned,completed/);
 assert.match(app,/restore\.abandoned===true&&!completed/);
 assert.match(app,/restore\.paused!==true/);
});
test('restauração de uma tentativa pausada mantém o tempo congelado',()=>{
 let now=100;const c=createStopwatch(()=>now);c.start();now=2600;c.pause();
 const save={elapsedMs:c.elapsed(),paused:!c.running,abandoned:false};
 now=60000;const restored=createStopwatch(()=>now);restored.restore(save.elapsedMs);
 if(!save.paused&&!save.abandoned)restored.start();
 now=90000;assert.equal(restored.elapsed(),2500);
 restored.start();now=92000;assert.equal(restored.finish(),4500);
});
test('desistência preserva recorde anterior e não concede recorde novo',()=>{
 const data=new Map();
 const storage={getItem:k=>data.get(k)??null,setItem:(k,v)=>data.set(k,v)};
 const key=recordKey('fixture',0,1,'square');
 assert.deepEqual(saveBest(storage,key,4500),{best:4500,improved:true});
 let now=0;const c=createStopwatch(()=>now);c.start();now=2000;c.pause();
 const abandoned=true;
 if(!abandoned)saveBest(storage,key,c.finish());
 assert.equal(readBest(storage,key),4500);
});
