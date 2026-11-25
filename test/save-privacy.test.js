import test from 'node:test';
import assert from 'node:assert/strict';
import {languageTag,LANGUAGE_TAGS} from '../src/i18n.js';
import {SINGLE_KEY,privacyCopy,removeSingleSnapshot,bindSaveDeletion} from '../src/save-privacy.js';
test('clears both save copies without removing records or unrelated local data',async()=>{
 const map=new Map([[SINGLE_KEY,'photo'],['puzzle-orbis-best:record','123'],['puzzle-orbis-language','ar']]);
 const storage={removeItem:k=>map.delete(k),getItem:k=>map.get(k)??null};
 let count=0;
 await removeSingleSnapshot(storage,async()=>{count++;});
 assert.equal(count,1);
 assert.deepEqual([...map],[['puzzle-orbis-best:record','123'],['puzzle-orbis-language','ar']]);
});
test('reports partial storage failure and still attempts the other store',async()=>{
 let count=0;
 await assert.rejects(removeSingleSnapshot({removeItem(){throw Error('blocked');}},async()=>{count++;}));
 assert.equal(count,1);
 await assert.rejects(removeSingleSnapshot({removeItem(){},getItem(){return 'old image';}},null));
});
test('declining confirmation neither changes nor deletes the save',async()=>{
 const previous=globalThis.window;
 globalThis.window={confirm:()=>false};
 try{
  const button={disabled:false};let changed=0;
  const change=()=>changed++;
  bindSaveDeletion({button,locale:()=>8,busy:()=>false,onConfirmed:change,erase:change,report:change});
  await button.onclick();
  assert.equal(changed,0);
 }finally{
  if(previous===undefined)delete globalThis.window;
  else globalThis.window=previous;
 }
});
test('all supported locales supply distinct, readable confirmation copy',()=>{
 for(let i=0;i<LANGUAGE_TAGS.length;i++){
  assert.equal(languageTag(i),LANGUAGE_TAGS[i]);
  assert.ok(Object.values(privacyCopy(i)).every(x=>x.trim()));
  if(i!==8)assert.notEqual(privacyCopy(i).confirm,privacyCopy(8).confirm);
 }
});
