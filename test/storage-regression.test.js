import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {saveLocalSnapshot} from '../src/storage.js';

test('salvamento local confirma persistência e conserva estado completo',()=>{
 const data=new Map();
 const storage={getItem:k=>data.get(k)??null,setItem:(k,v)=>data.set(k,v)};
 const snapshot={image:'data:image/png;base64,AAA',level:3,pieces:[2,1,0],moves:2,initialPieces:[2,0,1],elapsedMs:1200,paused:true,abandoned:false,completed:false};
 assert.equal(saveLocalSnapshot(storage,'puzzle-orbis-save',snapshot),true);
 assert.deepEqual(JSON.parse(storage.getItem('puzzle-orbis-save')),snapshot);
});
test('escrita silenciosamente ignorada não informa salvamento',()=>{
 const storage={getItem(){return null},setItem(){}};
 assert.equal(saveLocalSnapshot(storage,'puzzle-orbis-save',{level:1}),false);
});
test('erro de quota ou storage bloqueado não informa salvamento',()=>{
 const storage={getItem(){throw Error('blocked')},setItem(){throw Error('quota')}};
 assert.equal(saveLocalSnapshot(storage,'puzzle-orbis-save',{level:1}),false);
});
test('valor anterior não é confundido com nova gravação',()=>{
 const storage={getItem(){return '{"level":1}'},setItem(){}};
 assert.equal(saveLocalSnapshot(storage,'puzzle-orbis-save',{level:2}),false);
});
test('falha na confirmação da leitura não informa salvamento',()=>{
 const storage={getItem(){throw Error('read denied')},setItem(){}};
 assert.equal(saveLocalSnapshot(storage,'puzzle-orbis-save',{level:2}),false);
});
test('UI somente anuncia salvamento confirmado',()=>{
 const app=readFileSync(new URL('../src/app.js',import.meta.url),'utf8');
 assert.match(app,/saveLocalSnapshot\(safeStorage,'puzzle-orbis-save'/);
 assert.match(app,/translatedStatus\(saved\?'saved':'noSpace'\)/);
});
