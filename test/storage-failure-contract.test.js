import test from 'node:test';
import assert from 'node:assert/strict';
import { saveLocalSnapshot } from '../src/storage.js';

test('quota failure preserves previous snapshot', () => {
  const previous = JSON.stringify({bestTime: 1200});
  const storage = {setItem(){throw new Error('QuotaExceededError')}, getItem(){return previous}};
  assert.equal(saveLocalSnapshot(storage,'game',{bestTime:900}),false);
  assert.equal(storage.getItem('game'),previous);
});

test('serialization failure never writes over previous snapshot', () => {
  let writes=0;
  const storage={setItem(){writes++},getItem(){return null}};
  const cyclic={}; cyclic.self=cyclic;
  assert.equal(saveLocalSnapshot(storage,'game',cyclic),false);
  assert.equal(saveLocalSnapshot(storage,'game',undefined),false);
  assert.equal(writes,0);
});

test('silent write failure and readback failure are reported', () => {
  assert.equal(saveLocalSnapshot({setItem(){},getItem(){return null}},'game',{}),false);
  assert.equal(saveLocalSnapshot({setItem(){},getItem(){throw new Error('denied')}},'game',{}),false);
});

test('successful snapshot round trip preserves current and best time separately', () => {
  const data=new Map();
  const storage={setItem(k,v){data.set(k,v)},getItem(k){return data.get(k)}};
  const snapshot={elapsed:2500,bestTime:1200,mode:'rectangular'};
  assert.equal(saveLocalSnapshot(storage,'game',snapshot),true);
  assert.deepEqual(JSON.parse(storage.getItem('game')),snapshot);
});
