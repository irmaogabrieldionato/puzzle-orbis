import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {UI} from '../src/i18n.js';
import {createStopwatch,recordKey,saveBest,readBest,formatTime} from '../src/timer.js';

const app=readFileSync(new URL('../src/app.js',import.meta.url),'utf8');

test('a interface distingue tempo final e novo recorde confirmado',()=>{
 assert.match(app,/t\('finalTime'\).*formatTime\(clock\.elapsed\(\)\)/);
 assert.match(app,/newRecord\?' · '\+t\('newRecord'\)/);
 assert.match(app,/newRecord=saveBest\(safeStorage,recordId,duration\)\.improved/);
 assert.match(app,/function beginClock\(\)\{clock\.reset\(\);completed=false;abandoned=false;newRecord=false/);
 for(const locale of [UI.pt,UI.en]){
  assert.ok(locale.finalTime.trim().length>0);
  assert.ok(locale.newRecord.trim().length>0);
 }
});

test('novo recorde só é anunciado quando armazenamento confirma gravação',()=>{
 let now=0;const clock=createStopwatch(()=>now);
 const key=recordKey('fixture',0,1,'square');
 const data=new Map();
 const storage={getItem:k=>data.get(k)??null,setItem:(k,v)=>data.set(k,v)};
 clock.start();now=10000;
 const first=saveBest(storage,key,clock.finish());
 assert.equal(first.improved,true);
 assert.equal(formatTime(clock.elapsed()),'00:10');
 clock.reset();clock.start();now=23000;
 const slower=saveBest(storage,key,clock.finish());
 assert.equal(slower.improved,false);
 assert.equal(readBest(storage,key),10000);
 const blocked={getItem:storage.getItem,setItem(){}};
 const notStored=saveBest(blocked,key,5000);
 assert.equal(notStored.improved,false);
 assert.equal(readBest(storage,key),10000);
});
