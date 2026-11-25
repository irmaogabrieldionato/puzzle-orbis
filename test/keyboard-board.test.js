import test from 'node:test';
import assert from 'node:assert/strict';
import {pieceRect,nextBoardSlot,isBoardArrow} from '../src/engine.js';
import {rectangularPieceRect} from '../src/rectangular.js';
test('keyboard follows the visual layout and stops at board boundaries',()=>{
 const square=i=>pieceRect(i,4);
 assert.ok(isBoardArrow('ArrowRight'));
 assert.ok(!isBoardArrow('Enter'));
 assert.equal(nextBoardSlot(0,4,square,'ArrowRight'),1);
 assert.equal(nextBoardSlot(1,4,square,'ArrowRight'),1);
 assert.equal(nextBoardSlot(1,4,square,'ArrowDown'),3);
 assert.equal(nextBoardSlot(3,4,square,'ArrowLeft'),2);
 assert.equal(nextBoardSlot(0,4,square,'ArrowUp'),0);
 const long=i=>rectangularPieceRect(i,4);
 assert.equal(nextBoardSlot(0,4,long,'ArrowRight'),1);
 assert.equal(nextBoardSlot(1,4,long,'ArrowDown'),3);
 assert.equal(nextBoardSlot(3,4,long,'ArrowUp'),1);
});
