import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {readBest,recordKey,saveBest} from '../src/timer.js';

test('atualização visual lê o recorde uma vez e preserva ausência de marca',()=>{
 const app=readFileSync(new URL('../src/app.js',import.meta.url),'utf8');
 const body=app.match(/function updateClock\(\)\{([\s\S]*?)\}function updateControls/);
 assert.ok(body,'updateClock deve existir');
 assert.equal((body[1].match(/readBest\(/g)??[]).length,1);
 assert.match(body[1],/best===null\?'--:--':formatTime\(best\)/);
});

test('consulta inconsistente de armazenamento não produz tempo fictício',()=>{
 const key=recordKey('fixture',0);
 let reads=0;
 const unstable={getItem(){reads++;return reads===1?'2000':null},setItem(){}};
 const best=readBest(unstable,key);
 assert.equal(best,2000);
 assert.equal(reads,1);
 assert.equal(best===null?'--:--':String(best),'2000');
 const missing={getItem(){return null},setItem(){}};
 assert.equal(readBest(missing,key),null);
});

test('repetir partida não altera o recorde salvo ao atualizar visor',()=>{
 const values=new Map();const storage={getItem:k=>values.get(k)??null,setItem:(k,v)=>values.set(k,v)};
 const key=recordKey('fixture',0,1,'square');
 assert.equal(saveBest(storage,key,4000).improved,true);
 assert.equal(saveBest(storage,key,9000).improved,false);
 assert.equal(readBest(storage,key),4000);
});
