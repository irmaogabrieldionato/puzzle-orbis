import test from 'node:test';
import assert from 'node:assert/strict';
import {UI,translation} from '../src/i18n.js';
test('English and Portuguese have matching UI keys and nonempty strings',()=>{assert.deepEqual(Object.keys(UI.en).sort(),Object.keys(UI.pt).sort());for(const locale of Object.values(UI))for(const [key,value] of Object.entries(locale)){if(key==='levelNames'){assert.equal(value.length,10);assert.ok(value.every(name=>typeof name==='string'&&name.trim().length>0))}else assert.ok(typeof value==='string'&&value.trim().length>0)}});
test('language selection uses English at index 0 and Portuguese at index 8',()=>{assert.equal(translation(0),UI.en);assert.equal(translation(8),UI.pt)});
test('all ten level names are localized and differ across languages',()=>{assert.equal(UI.pt.levelNames.length,10);assert.equal(UI.en.levelNames.length,10);for(let i=0;i<10;i++)assert.notEqual(UI.en.levelNames[i],UI.pt.levelNames[i])});
test('all fifteen catalogs match the production key set, including all ten level names',()=>{
 for(let i=0;i<15;i++){
  const actual=translation(i);
  assert.deepEqual(Object.keys(actual).sort(),Object.keys(UI.en).sort(),'locale '+i);
  for(const [key,value] of Object.entries(actual)){
   if(key==='levelNames')assert.equal(value.length,10);
   else assert.ok(typeof value==='string'&&value.trim().length>0,key+' in locale '+i);
  }
  if(i!==0&&i!==8)assert.notEqual(actual.help,UI.pt.help);
 }
});
