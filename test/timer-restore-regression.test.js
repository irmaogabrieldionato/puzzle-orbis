import test from 'node:test';
import assert from 'node:assert/strict';
import {createStopwatch,recordKey,readBest,saveBest} from '../src/timer.js';

test('restauração pausada não inclui tempo fora da partida', () => {
  let now = 10000;
  const clock = createStopwatch(() => now);
  clock.restore(3250);
  now = 90000;
  assert.equal(clock.elapsed(), 3250);
  assert.equal(clock.running, false);
  clock.start();
  now = 91250;
  assert.equal(clock.finish(), 4500);
  now = 200000;
  assert.equal(clock.elapsed(), 4500);
});

test('reiniciar tentativa preserva recorde salvo e descarta tempo anterior', () => {
  let now = 0;
  const clock = createStopwatch(() => now);
  const values = new Map();
  const storage = {getItem: key => values.get(key) ?? null, setItem: (key, value) => values.set(key, value)};
  const key = recordKey('same-image', 3, 1, 'square');
  clock.start();
  now = 5000;
  assert.equal(clock.finish(), 5000);
  assert.equal(saveBest(storage, key, clock.elapsed()).improved, true);
  clock.reset();
  now = 7000;
  clock.start();
  now = 13000;
  assert.equal(clock.finish(), 6000);
  assert.deepEqual(saveBest(storage, key, 6000), {best: 5000, improved: false});
  assert.equal(readBest(storage, key), 5000);
});

test('desistência por pausa não salva automaticamente recorde', () => {
  let now = 0;
  const clock = createStopwatch(() => now);
  const values = new Map();
  const storage = {getItem: key => values.get(key) ?? null, setItem: (key, value) => values.set(key, value)};
  const key = recordKey('abandoned', 0, 1, 'square');
  clock.start();
  now = 4000;
  clock.pause();
  assert.equal(clock.finished, false);
  assert.equal(readBest(storage, key), null);
  clock.reset();
  assert.equal(clock.elapsed(), 0);
});

test('identidade distingue modalidade e quantidade de imagens', () => {
  const a = recordKey('image', 4, 1, 'square');
  assert.notEqual(a, recordKey('image', 4, 1, 'rectangle'));
  assert.notEqual(a, recordKey('image', 4, 2, 'square'));
  assert.notEqual(a, recordKey('image', 5, 1, 'square'));
  assert.throws(() => recordKey('image', Number.MAX_SAFE_INTEGER + 1), TypeError);
});
