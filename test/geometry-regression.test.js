import test from 'node:test';
import assert from 'node:assert/strict';
import {CUTS, pieceRect, pieceAt, centeredCrop} from '../src/engine.js';

test('regressão: cada peça possui um centro clicável e bordas dentro da imagem', () => {
  for (const count of CUTS) {
    for (let i = 0; i < count; i++) {
      const rect = pieceRect(i, count);
      assert.ok(rect, `peça ${i}/${count}`);
      assert.ok(rect.x >= 0 && rect.y >= 0);
      assert.ok(rect.width > 0 && rect.height > 0);
      assert.ok(rect.x + rect.width <= 1 + 1e-12);
      assert.ok(rect.y + rect.height <= 1 + 1e-12);
      assert.equal(pieceAt(rect.x + rect.width / 2, rect.y + rect.height / 2, count), i);
    }
  }
});

test('regressão: recorte proporcional funciona para todas as combinações de formatos de peças', () => {
  for (const count of CUTS) {
    const distinct = new Map();
    for (let i = 0; i < count; i++) {
      const r = pieceRect(i, count);
      distinct.set(`${r.width}:${r.height}`, r);
    }
    for (const [imageW, imageH] of [[1920,1080],[1080,1920],[1000,1000]]) {
      for (const source of distinct.values()) for (const target of distinct.values()) {
        const sw = source.width * imageW, sh = source.height * imageH;
        const tw = target.width * 640, th = target.height * 640 * imageH / imageW;
        const crop = centeredCrop(sw, sh, tw, th);
        assert.ok(crop);
        assert.ok(crop.x >= -1e-9 && crop.y >= -1e-9);
        assert.ok(crop.x + crop.width <= sw + 1e-9);
        assert.ok(crop.y + crop.height <= sh + 1e-9);
        assert.ok(Math.abs(crop.width / crop.height - tw / th) < 1e-9);
      }
    }
  }
});
