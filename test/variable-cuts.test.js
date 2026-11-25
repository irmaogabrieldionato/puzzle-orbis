import test from 'node:test';
import assert from 'node:assert/strict';
import {CUTS} from '../src/engine.js';
import {variableLayout,layoutPieceAt} from '../src/variable-cuts.js';

for(const mode of ['mixed','random']){
 test(mode+' cobre as dez contagens sem lacunas nem sobreposições',()=>{
  const epsilon=1e-10;
  for(const [width,height] of [[640,320],[320,640],[640,640]]){
   for(const count of CUTS){
    const layout=variableLayout(mode,count,width,height,'fixture');
    assert.equal(layout.length,count);
    assert.deepEqual(layout,variableLayout(mode,count,width,height,'fixture'));
    assert.ok(Math.abs(layout.reduce((a,r)=>a+r.width*r.height,0)-1)<epsilon);
    if(mode==='mixed'){
     assert.ok(Math.abs(layout[0].width*width-layout[0].height*height)<epsilon);
     assert.ok(layout.some(r=>Math.abs(r.width*width-r.height*height)>epsilon));
    }
    for(let i=0;i<layout.length;i++){
     const a=layout[i];
     assert.ok(a.width>0&&a.height>0&&a.x>=0&&a.y>=0&&a.x+a.width<=1+epsilon&&a.y+a.height<=1+epsilon);
     assert.equal(layoutPieceAt(layout,a.x+a.width/2,a.y+a.height/2),i);
     for(let j=0;j<i;j++){
      const b=layout[j],x=Math.min(a.x+a.width,b.x+b.width)-Math.max(a.x,b.x),y=Math.min(a.y+a.height,b.y+b.height)-Math.max(a.y,b.y);
      assert.ok(x<=epsilon||y<=epsilon);
     }
    }
   }
  }
 });
}
test('modo aleatório usa a semente e rejeita cliques inválidos',()=>{
 const a=variableLayout('random',16,640,320,'a');
 assert.notDeepEqual(a,variableLayout('random',16,640,320,'b'));
 for(const [x,y] of [[1,0],[-1,0],[0,1],[NaN,0]])assert.equal(layoutPieceAt(a,x,y),-1);
 assert.deepEqual(variableLayout('unknown',16,640,320),[]);
});
