// Geometria retangular independente da interface; preserva a cobertura integral.
export function rectangularDimensions(count){
 if(!Number.isSafeInteger(count)||count<1)throw new RangeError('Invalid piece count');
 const cols=Math.min(count,Math.max(1,Math.ceil(Math.sqrt(count*2))));
 return {cols,rows:Math.ceil(count/cols)};
}
export function rectangularPieceRect(index,count){
 if(!Number.isSafeInteger(count)||count<1||!Number.isInteger(index)||index<0||index>=count)return null;
 const {cols,rows}=rectangularDimensions(count);
 const row=Math.floor(index/cols),start=row*cols;
 const inRow=Math.min(cols,count-start),column=index-start;
 return {x:column/inRow,y:row/rows,width:1/inRow,height:1/rows};
}
export function rectangularPieceAt(x,y,count){
 if(!Number.isFinite(x)||!Number.isFinite(y)||x<0||x>=1||y<0||y>=1||!Number.isSafeInteger(count)||count<1)return -1;
 const {cols,rows}=rectangularDimensions(count);
 const row=Math.floor(y*rows),start=row*cols,inRow=Math.min(cols,count-start);
 return start+Math.min(inRow-1,Math.floor(x*inRow));
}
