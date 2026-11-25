// Both modes cover the entire board with deterministic, non-overlapping rectangles.
// "mixed" reserves one geometrically square piece in actual board pixels.
function randomFrom(key) {
 let state=2166136261;
 for(const ch of key) state=Math.imul(state^ch.charCodeAt(0),16777619);
 return ()=>{
  state=(state+0x6D2B79F5)|0;
  let value=Math.imul(state^(state>>>15),1|state);
  value^=value+Math.imul(value^(value>>>7),61|value);
  return ((value^(value>>>14))>>>0)/4294967296;
 };
}
export function variableLayout(mode,count,width,height,seed='') {
 if(!['mixed','random'].includes(mode)||!Number.isSafeInteger(count)||count<4||
    !Number.isFinite(width)||width<=0||!Number.isFinite(height)||height<=0) return [];
 const rng=randomFrom(String(seed));
 const result=[];
 const root={x:0,y:0,width:1,height:1};
 function split(box,n) {
  if(n===1){result.push(box);return;}
  const horizontal=box.width*width>=box.height*height;
  const left=mode==='random'?Math.max(1,Math.min(n-1,Math.round(n*(.35+.3*rng())))):Math.floor(n/2);
  const fraction=mode==='random'?Math.max(.24,Math.min(.76,left/n+(rng()-.5)*.22)):left/n;
  if(horizontal){
   const w=box.width*fraction;
   split({...box,width:w},left);
   split({...box,x:box.x+w,width:box.width-w},n-left);
  }else{
   const h=box.height*fraction;
   split({...box,height:h},left);
   split({...box,y:box.y+h,height:box.height-h},n-left);
  }
 }
 if(mode==='mixed'){
  const size=Math.min(width,height)/Math.sqrt(count),w=size/width,h=size/height;
  result.push({x:0,y:0,width:w,height:h},{x:w,y:0,width:w/2,height:h});
  const edge=w*1.5;
  const upper=Math.max(1,Math.min(count-3,Math.round((count-2)*(1-edge)*h/(1-edge*h))));
  split({x:edge,y:0,width:1-edge,height:h},upper);
  split({x:0,y:h,width:1,height:1-h},count-2-upper);
 }else split(root,count);
 return result;
}
export function layoutPieceAt(layout,x,y) {
 if(!Number.isFinite(x)||!Number.isFinite(y)||x<0||x>=1||y<0||y>=1)return -1;
 return layout.findIndex(rect=>x>=rect.x&&x<rect.x+rect.width&&y>=rect.y&&y<rect.y+rect.height);
}
