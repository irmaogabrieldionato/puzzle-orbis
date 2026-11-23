import test from 'node:test';
import assert from 'node:assert/strict';
import {rectangularDimensions,rectangularPieceRect,rectangularPieceAt} from '../src/rectangular.js';

test('rectangular geometry covers every level without overlaps or gaps',()=>{
 for(const count of [4,8,16,32,64,108,216,432,862,1724]){
  const {rows,cols}=rectangularDimensions(count);
  assert.equal(rows*cols>=count,true);
  let area=0;
  for(let i=0;i<count;i++){
   const r=rectangularPieceRect(i,count);
   assert.ok(r&&r.width>0&&r.height>0);
   assert.ok(r.x>=0&&r.y>=0&&r.x+r.width<=1+1e-12&&r.y+r.height<=1+1e-12);
   assert.equal(rectangularPieceAt(r.x+r.width/2,r.y+r.height/2,count),i);
   area+=r.width*r.height;
  }
  assert.ok(Math.abs(area-1)<1e-10);
 }
});
test('rectangular coordinates reject invalid values',()=>{
 assert.equal(rectangularPieceRect(-1,4),null);
 assert.equal(rectangularPieceRect(4,4),null);
 assert.equal(rectangularPieceAt(1,0.5,4),-1);
 assert.equal(rectangularPieceAt(0.5,1,4),-1);
 assert.equal(rectangularPieceAt(NaN,0.5,4),-1);
 assert.throws(()=>rectangularDimensions(0),RangeError);
});
