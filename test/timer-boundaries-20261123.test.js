import test from 'node:test';
import assert from 'node:assert/strict';
import {createStopwatch, recordKey, readBest, saveBest} from '../src/timer.js';

test('clock does not count paused intervals and ignores repeated start', () => {
  let now = 0;
  const clock = createStopwatch(() => now);
  clock.start();
  now = 1200;
  clock.start();
  now = 2300;
  clock.pause();
  assert.equal(clock.elapsed(), 2300);
  now = 9000;
  assert.equal(clock.elapsed(), 2300);
  clock.start();
  now = 9700;
  assert.equal(clock.finish(), 3000);
  now = 20000;
  clock.start();
  assert.equal(clock.elapsed(), 3000);
});

test('reset clears current attempt but cannot change a saved personal best', () => {
  let now = 0;
  const clock = createStopwatch(() => now);
  const values = new Map();
  const storage = {getItem: key => values.get(key) ?? null, setItem: (key,value) => values.set(key,value)};
  const key = recordKey('image-a', 2, 1, 'square');
  clock.start();
  now = 5000;
  assert.equal(saveBest(storage,key,clock.finish()).improved,true);
  clock.reset();
  assert.equal(clock.elapsed(),0);
  clock.start();
  now = 12000;
  assert.equal(saveBest(storage,key,clock.finish()).improved,false);
  assert.equal(readBest(storage,key),5000);
});

test('record identities isolate image, level, image count and cut mode', () => {
  const baseline = recordKey('image-a',1,1,'square');
  const others = [
    recordKey('image-b',1,1,'square'),
    recordKey('image-a',2,1,'square'),
    recordKey('image-a',1,2,'square'),
    recordKey('image-a',1,1,'rectangle')
  ];
  assert.equal(new Set([baseline,...others]).size,5);
});

test('invalid and zero durations never create records', () => {
  const values = new Map();
  const storage = {getItem: key => values.get(key) ?? null, setItem: (key,value) => values.set(key,value)};
  const key = recordKey('image-a',0);
  for (const duration of [0,-1,NaN,Infinity,1.5]) {
    assert.equal(saveBest(storage,key,duration).improved,false);
  }
  assert.equal(readBest(storage,key),null);
});
