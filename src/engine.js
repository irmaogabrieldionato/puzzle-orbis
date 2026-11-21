export const CUTS=[4,8,16,32,64,108,216,432,862,1724];export const LANGUAGES=['English','中文','हिन्दी','Español','Français','العربية','বাংলা','Русский','Português','Bahasa Indonesia','اردو','Deutsch','日本語','Kiswahili','मराठी'];export function dimensions(count){if(!Number.isSafeInteger(count)||count<1)throw new RangeError('Invalid piece count');const cols=Math.ceil(Math.sqrt(count));return {rows:Math.ceil(count/cols),cols}}export function shuffled(n,random=Math.random){const a=Array.from({length:n},(_,i)=>i);for(let i=n-1;i>0;i--){const value=random();const j=Math.min(i,Math.max(0,Math.floor((Number.isFinite(value)?value:0)*(i+1))));[a[i],a[j]]=[a[j],a[i]]}if(n>1&&a.every((x,i)=>x===i))[a[0],a[1]]=[a[1],a[0]];return a}export function swap(a,i,j){if(!Number.isInteger(i)||!Number.isInteger(j)||i<0||j<0||i>=a.length||j>=a.length)return a.slice();const b=a.slice();[b[i],b[j]]=[b[j],b[i]];return b}export function solved(a){return Array.isArray(a)&&isPermutation(a,a.length)&&a.every((v,i)=>v===i)}export function progress(a){if(!Array.isArray(a)||!isPermutation(a,a.length))return 0;const correct=a.filter((v,i)=>v===i).length;return correct===a.length?100:Math.min(99,Math.round(100*correct/a.length))}
export function isPermutation(values,n){return Number.isInteger(n)&&n>0&&Array.isArray(values)&&values.length===n&&new Set(values).size===n&&Array.from(values).every(x=>Number.isInteger(x)&&x>=0&&x<n)}

export function canvasSize(width,height,maxWidth=640,maxHeight=4096){if(!Number.isFinite(width)||!Number.isFinite(height)||width<=0||height<=0||!Number.isFinite(maxWidth)||!Number.isFinite(maxHeight)||maxWidth<1||maxHeight<1)return null;const scale=Math.min(maxWidth/width,maxHeight/height);return {width:Math.max(1,Math.round(width*scale)),height:Math.max(1,Math.round(height*scale))}}

// A última linha utiliza toda a largura, sem descartar faixas da imagem.
export function pieceRect(index,count){
 if(!Number.isSafeInteger(count)||count<1||!Number.isInteger(index)||index<0||index>=count)return null;
 const {rows,cols}=dimensions(count),row=Math.floor(index/cols),start=row*cols;
 const inRow=Math.min(cols,count-start),column=index-start;
 return {x:column/inRow,y:row/rows,width:1/inRow,height:1/rows};
}
export function pieceAt(x,y,count){
 if(!Number.isFinite(x)||!Number.isFinite(y)||x<0||x>=1||y<0||y>=1||!Number.isSafeInteger(count)||count<1)return -1;
 const {rows,cols}=dimensions(count),row=Math.floor(y*rows),start=row*cols;
 const inRow=Math.min(cols,count-start);
 return start+Math.min(inRow-1,Math.floor(x*inRow));
}

// Centraliza o recorte sem deformar peças de proporções diferentes.
export function centeredCrop(sw,sh,tw,th){
 if(![sw,sh,tw,th].every(v=>Number.isFinite(v)&&v>0))return null;
 const ratio=Math.min(sw/tw,sh/th),width=tw*ratio,height=th*ratio;
 return {x:(sw-width)/2,y:(sh-height)/2,width,height};
}

// Ajusta a peça inteira ao destino sem cortar conteúdo nem deformar proporções.
export function containedFit(sw,sh,tw,th){
 if(![sw,sh,tw,th].every(v=>Number.isFinite(v)&&v>0))return null;
 const scale=Math.min(tw/sw,th/sh),width=sw*scale,height=sh*scale;
 return {x:(tw-width)/2,y:(th-height)/2,width,height};
}
