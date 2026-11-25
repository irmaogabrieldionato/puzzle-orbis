import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {LANGUAGE_TAGS} from '../src/i18n.js';
import {positionMessage} from '../src/board-feedback.js';

test('position feedback describes the active slot and the selected slot independently', () => {
  assert.equal(positionMessage(8, {slot:1,count:4}), 'Posição 2 de 4. Nenhuma peça selecionada.');
  assert.equal(positionMessage(8, {slot:1,count:4}, {slot:0}), 'Posição 2 de 4. Seleção: posição 1.');
  assert.equal(positionMessage(0, {slot:0,count:6}, {slot:2,board:1}), 'Position 1 of 6. Selected: board 2, position 3.');
});

test('all 15 locales have feedback and both pages expose a separate live region offline', () => {
  const messages=LANGUAGE_TAGS.map((_,index)=>positionMessage(index,{slot:0,count:4},{slot:1,board:2}));
  assert.equal(new Set(messages).size,15);
  assert.match(messages[5],/الموضع/);
  assert.match(messages[10],/جگہ/);
  for(const filename of ['index.html','multi.html']){
    const html=readFileSync(new URL('../'+filename,import.meta.url),'utf8');
    assert.match(html, /id="board-feedback" class="sr-only" role="status" aria-atomic="true"/);
  }
  assert.match(readFileSync(new URL('../sw.js',import.meta.url),'utf8'), /['"]\.\/src\/board-feedback\.js['"]/);
});
