import test from 'node:test';
import assert from 'node:assert/strict';
import {createStopwatch, recordKey, readBest, saveBest} from '../src/timer.js';

test('restauração começa pausada e só conta tempo após retomada explícita', () => {
  let now = 1000;
  const clock = createStopwatch(() => now);
  clock.restore(4300);
  now = 9000;
  assert.equal(clock.elapsed(), 4300);
  assert.equal(clock.running, false);
  clock.start();
  now = 10500;
  assert.equal(clock.elapsed(), 5800);
  clock.pause();
  now = 90000;
  assert.equal(clock.elapsed(), 5800);
});

test('reinício após restauração zera apenas a tentativa, não o recorde local', () => {
  let now = 0;
  const clock = createStopwatch(() => now);
  const values = new Map();
  const storage = {getItem: key => values.get(key) ?? null, setItem: (key, value) => {values.set(key, value)}};
  const key = recordKey('image-restore', 4, 1, 'square');
  saveBest(storage, key, 3700);
  clock.restore(11000);
  clock.reset();
  clock.start();
  now = 5100;
  assert.equal(clock.finish(), 5100);
  assert.deepEqual(saveBest(storage, key, 5100), {best: 3700, improved: false});
  assert.equal(readBest(storage, key), 3700);
});

test('finalização após restauração é estável e não retoma automaticamente', () => {
  let now = 1000;
  const clock = createStopwatch(() => now);
  clock.restore(2400);
  assert.equal(clock.finish(), 2400);
  now = 50000;
  clock.start();
  assert.equal(clock.elapsed(), 2400);
  assert.equal(clock.finish(), 2400);
  assert.equal(clock.finished, true);
  assert.equal(clock.running, false);
});
