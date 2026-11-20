import test from 'node:test';
import assert from 'node:assert/strict';
import {CUTS,pieceRect,containedFit} from '../src/engine.js';

test('all pieces remain fully visible when swapped between different aspect ratios',()=>{
 for(const count of CUTS){
  const shapes=[...new Map(Array.from({length:count},(_,i)=>{
   const r=pieceRect(i,count);return [r.width+':'+r.height,r];
  })).values()];
  for(const [imageW,imageH] of [[1920,1080],[1080,1920],[1000,1000]]){
   for(const source of shapes)for(const target of shapes){
    const sw=source.width*imageW,sh=source.height*imageH;
    const tw=target.width*640,th=target.height*640*imageH/imageW;
    const fit=containedFit(sw,sh,tw,th);
    assert.ok(fit);
    assert.ok(fit.x>=-1e-9&&fit.y>=-1e-9);
    assert.ok(fit.x+fit.width<=tw+1e-9);
    assert.ok(fit.y+fit.height<=th+1e-9);
    assert.ok(Math.abs(fit.width/fit.height-sw/sh)<1e-9);
   }
  }
 }
});
test('rejects invalid aspect-fit dimensions',()=>{
 assert.equal(containedFit(0,2,3,4),null);
 assert.equal(containedFit(2,3,Infinity,4),null);
});
