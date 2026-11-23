import test from 'node:test';
import assert from 'node:assert/strict';
import {CUTS, pieceRect, pieceAt, dimensions, containedFit} from '../src/engine.js';

test('all ten levels partition the image without missing or overlapping cells', () => {
  for (const count of CUTS) {
    const {rows, cols} = dimensions(count);
    assert.equal(rows * cols >= count, true);
    for (let index = 0; index < count; index++) {
      const rect = pieceRect(index, count);
      assert.ok(rect, `missing rectangle for ${count}/${index}`);
      assert.ok(rect.x >= 0 && rect.y >= 0);
      assert.ok(rect.width > 0 && rect.height > 0);
      assert.ok(rect.x + rect.width <= 1 + 1e-12);
      assert.ok(rect.y + rect.height <= 1 + 1e-12);
      assert.equal(pieceAt(rect.x + rect.width / 2, rect.y + rect.height / 2, count), index);
    }
    for (let row = 0; row < rows; row++) {
      const cells = Array.from({length: count}, (_, i) => pieceRect(i, count))
        .filter(rect => Math.abs(rect.y - row / rows) < 1e-12)
        .sort((a,b) => a.x-b.x);
      assert.ok(cells.length > 0);
      let right = 0;
      for (const rect of cells) {
        assert.ok(Math.abs(rect.x - right) < 1e-12);
        right += rect.width;
      }
      assert.ok(Math.abs(right - 1) < 1e-12);
    }
  }
});

test('hit testing excludes outside coordinates and invalid counts', () => {
  for (const count of CUTS) {
    for (const [x,y] of [[-0.01,0],[0,-0.01],[1,0],[0,1],[NaN,0],[0,Infinity]]) {
      assert.equal(pieceAt(x,y,count), -1);
    }
  }
  assert.equal(pieceRect(-1,4), null);
  assert.equal(pieceRect(4,4), null);
  assert.equal(pieceAt(0.5,0.5,0), -1);
});

test('contained fit preserves aspect ratio when swapping unequal row widths', () => {
  const source = pieceRect(0, 862);
  const target = pieceRect(861, 862);
  const fit = containedFit(source.width * 1000, source.height * 1000,
    target.width * 1000, target.height * 1000);
  assert.ok(fit);
  assert.ok(fit.width <= target.width * 1000 + 1e-9);
  assert.ok(fit.height <= target.height * 1000 + 1e-9);
  assert.ok(Math.abs(fit.width / fit.height - source.width / source.height) < 1e-10);
});
