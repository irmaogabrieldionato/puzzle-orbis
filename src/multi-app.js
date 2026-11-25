import {CUTS,canvasSize,containedFit,pieceRect,solved} from './engine.js';
import {rectangularPieceRect} from './rectangular.js';
import {layoutPieceAt,variableLayout} from './variable-cuts.js';
import {boardCounts,boardSlots,createMulti,swapMulti,multiProgress,isMultiSnapshot} from './multi-engine.js';
import {readMulti,saveMulti} from './multi-store.js';
import {createStopwatch,formatTime,recordKey,readBest,saveBest} from './timer.js';

const $=id=>document.getElementById(id);
const clock=createStopwatch();
const storage={
 getItem(key){return localStorage.getItem(key);},
 setItem(key,value){localStorage.setItem(key,value);}
};
const fileInputs=[1,2,3].map(i=>$('image-'+i));
const cuts=['square','rectangular','mixed','random'];
let state=null,boards=[],origins=[],selection=null,cut='square',sourceBlobs=[],key=null,generation=0;
let completed=false,newRecord=false;
for(const [i,n] of CUTS.entries())$('multi-level').add(new Option('Nível '+(i+1)+' · '+n+' peças',i));
$('image-count').onchange=()=>{
 const three=$('image-count').value==='3';
 $('upload-third').hidden=!three;
 fileInputs[2].disabled=!three;
 fileInputs[2].required=three;
};
function status(message){$('multi-status').textContent=message;}
function controls(){
 $('multi-pause').disabled=!state||completed;
 $('multi-restart').disabled=!state;
 $('multi-save').disabled=!state;
 $('multi-pause').textContent=clock.running?'Pausar':'Continuar';
}
function time(){
 $('multi-time').textContent=formatTime(clock.elapsed());
 const best=key?readBest(storage,key):null;
 $('multi-best').textContent=best===null?'--:--':formatTime(best);
}
function layout(mode,n,w,h,seed){
 if(n>=4&&['mixed','random'].includes(mode))return variableLayout(mode,n,w,h,seed);
 const rect=mode==='rectangular'?rectangularPieceRect:pieceRect;
 return Array.from({length:n},(_,i)=>rect(i,n));
}
async function decode(blob){
 const url=URL.createObjectURL(blob);
 try{
  const img=new Image();
  img.src=url;
  await img.decode();
  if(!img.naturalWidth||!img.naturalHeight||img.naturalWidth*img.naturalHeight>39000000)throw Error('Dimensões inválidas ou acima de 39 megapixels.');
  const hash=await crypto.subtle.digest('SHA-256',await blob.arrayBuffer());
  const id=Array.from(new Uint8Array(hash),b=>b.toString(16).padStart(2,'0')).join('');
  return {img,id};
 }finally{URL.revokeObjectURL(url);}
}
function activate(decoded,blobs,next,mode,snapshot){
 const counts=boardCounts(next.level,next.imageCount,next.policy);
 const slots=boardSlots(counts);
 state=next;sourceBlobs=blobs;cut=mode;selection=null;completed=solved(state.pieces);newRecord=false;origins=slots.flat();
 const views=$('boards');
 views.replaceChildren();
 boards=decoded.map(({img,id},i)=>{
  const section=document.createElement('section'), title=document.createElement('h2'), canvas=document.createElement('canvas');
  const size=canvasSize(img.naturalWidth,img.naturalHeight,600,1200);
  canvas.width=size.width;canvas.height=size.height;canvas.tabIndex=0;
  canvas.setAttribute('aria-label','Tabuleiro '+(i+1)+'. Use as setas para escolher uma peça e Enter para selecioná-la.');
  title.textContent='Imagem '+(i+1);
  section.append(title,canvas);views.append(section);
  const regions=layout(mode,counts[i],size.width,size.height,id+':'+next.level+':'+next.policy);
  const ctx=canvas.getContext('2d');
  const board={img,id,title,canvas,ctx,regions,slots:slots[i],cursor:null};
  canvas.addEventListener('click',event=>{
   const r=canvas.getBoundingClientRect();
   const i=layoutPieceAt(regions,(event.clientX-r.left)/r.width,(event.clientY-r.top)/r.height);
   if(i>=0)choose(board.slots[i].id);
  });
  canvas.addEventListener('keydown',event=>{
   const directions={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,-1],ArrowDown:[0,1]};
   if(!directions[event.key]&&event.key!=='Enter'&&event.key!==' ')return;
   event.preventDefault();
   if(board.cursor===null)board.cursor=0;
   if(directions[event.key]){
    const [dx,dy]=directions[event.key], a=regions[board.cursor], cx=a.x+a.width/2, cy=a.y+a.height/2;
    let nearest=Infinity, candidate=board.cursor;
    regions.forEach((b,j)=>{
     const x=b.x+b.width/2-cx,y=b.y+b.height/2-cy,forward=x*dx+y*dy,side=x*dy-y*dx;
     const score=forward*forward+4*side*side;
     if(forward>0&&score<nearest){nearest=score;candidate=j;}
    });
    board.cursor=candidate;
   }else choose(board.slots[board.cursor].id);
   draw();
  });
  canvas.addEventListener('blur',()=>{board.cursor=null;draw();});
  return board;
 });
 key=recordKey(JSON.stringify(boards.map(b=>b.id)),next.level,next.imageCount,mode+':'+next.policy);
 clock.reset();
 if(snapshot)clock.restore(snapshot.elapsedMs);
 if(completed)clock.finish();
 else if(!snapshot?.paused)clock.start();
 controls();time();draw();
}
function restart(){
 if(!state)return;
 state={...state,pieces:[...state.initialPieces],moves:0};
 selection=null;completed=false;newRecord=false;clock.reset();clock.start();
 controls();time();draw();
}
function choose(id){
 if(!state||completed||!clock.running)return;
 if(selection===null)selection=id;
 else{
  const first=selection;
  selection=null;
  if(first!==id)state=swapMulti(state,first,id);
 }
 draw();
}
function draw(){
 if(!state)return;
 const stats=multiProgress(state.pieces,boards.map(b=>b.slots.length));
 for(const [i,b] of boards.entries()){
  b.title.textContent='Imagem '+(i+1)+' · '+stats.byBoard[i]+'%';
  const {ctx,canvas,slots,regions}=b;
  ctx.clearRect(0,0,canvas.width,canvas.height);
  for(const target of slots){
   const a=regions[target.slot], source=origins[state.pieces[target.id]], from=boards[source.board], p=from.regions[source.slot];
   const sw=from.img.naturalWidth*p.width,sh=from.img.naturalHeight*p.height;
   const tw=a.width*canvas.width,th=a.height*canvas.height;
   const fit=containedFit(sw,sh,tw,th);
   ctx.drawImage(from.img,p.x*from.img.naturalWidth,p.y*from.img.naturalHeight,sw,sh,a.x*canvas.width+fit.x,a.y*canvas.height+fit.y,fit.width,fit.height);
   const active=target.id===selection, focus=target.slot===b.cursor;
   ctx.strokeStyle=active?'#facc15':focus?'#7dd3fc':'#fff';
   ctx.lineWidth=active||focus?4:1;
   ctx.strokeRect(a.x*canvas.width,a.y*canvas.height,tw,th);
  }
 }
 if(!completed&&stats.complete){
  completed=true;
  const duration=clock.finish();
  newRecord=duration>0&&saveBest(storage,key,duration).improved;
  time();controls();
 }
 status((completed?'Concluído':'Progresso')+': '+stats.total+'% · Movimentos: '+state.moves+(newRecord?' · Novo recorde pessoal!':''));
}
async function begin(blobs,snapshot,version,settings){
 try{
  if(!blobs.every(f=>f&&f.type.startsWith('image/')&&f.size>0&&f.size<=8*1024*1024))throw Error('Escolha imagens válidas de até 8 MB.');
  const decoded=await Promise.all(blobs.map(decode));
  if(version!==generation)return;
  const {level,policy,cut:mode}=settings;
  if(!cuts.includes(mode))throw Error('Formato de corte inválido.');
  const next=snapshot?{level,imageCount:blobs.length,policy,pieces:snapshot.pieces,initialPieces:snapshot.initialPieces,moves:snapshot.moves}:createMulti(level,blobs.length,policy);
  activate(decoded,blobs,next,mode,snapshot);
 }catch(error){if(version===generation)status('Não foi possível abrir a partida. '+error.message);}
}
$('setup').onsubmit=event=>{
 event.preventDefault();
 const version=++generation, n=Number($('image-count').value);
 status('Abrindo imagens…');
 begin(fileInputs.slice(0,n).map(i=>i.files[0]),null,version,{level:Number($('multi-level').value),policy:$('count-policy').value,cut:$('multi-cut').value});
};
$('multi-pause').onclick=()=>{if(!state||completed)return;if(clock.running)clock.pause();else clock.start();controls();time();};
$('multi-restart').onclick=restart;
$('multi-save').onclick=async()=>{
 if(!state)return;
 try{
  await saveMulti({...state,cut,images:sourceBlobs,version:1,elapsedMs:clock.elapsed(),paused:!clock.running});
  status('Partida salva neste navegador.');
 }catch{status('Não foi possível salvar. Verifique o espaço de armazenamento do navegador.');}
};
$('multi-load').onclick=async()=>{
 const version=++generation;
 try{
  const saved=await readMulti();
  if(version!==generation)return;
  if(!isMultiSnapshot(saved)){status('Nenhuma partida compatível foi encontrada.');return;}
  $('image-count').value=String(saved.imageCount);$('image-count').onchange();
  $('multi-level').value=String(saved.level);$('count-policy').value=saved.policy;$('multi-cut').value=saved.cut;
  await begin(saved.images,saved,version,saved);
 }catch{if(version===generation)status('Não foi possível carregar a partida salva.');}
};
setInterval(time,250);
if('serviceWorker'in navigator)navigator.serviceWorker.register('./sw.js').catch(()=>{});
