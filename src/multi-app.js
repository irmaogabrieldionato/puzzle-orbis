import {positionMessage,updateFeedback} from './board-feedback.js';
import {privacyCopy,bindSaveDeletion,deleteMulti} from './save-privacy.js';
import {translation,languageTag,direction,savedLocale,saveLocale} from './i18n.js';
import {CUTS,LANGUAGES,canvasSize,containedFit,pieceRect,isBoardArrow,nextBoardSlot} from './engine.js';
import {rectangularPieceRect} from './rectangular.js';
import {layoutPieceAt,variableLayout} from './variable-cuts.js';
import {boardCounts,boardSlots,createMulti,swapMulti,multiProgress,compatibleBoardSlots,ensureUnsolvedMulti,isMultiSnapshot} from './multi-engine.js';
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
let state=null,boards=[],origins=[],selection=null,cut='square',sourceImages=[],key=null,generation=0;
let completionMatrix=[],completed=false,newRecord=false,saving=false,restoreRequest=0;
const lang=$('multi-language');
const t=k=>translation(Number(lang.value))[k];
LANGUAGES.forEach((name,i)=>lang.add(new Option(name,i)));
lang.value=String(savedLocale(storage));
function applyLanguage(){
 const index=Number(lang.value);
 document.documentElement.lang=languageTag(index);
 document.documentElement.dir=direction(document.documentElement.lang);
 const accountLink=document.querySelector('[data-orbis-account]');
 if(accountLink?.hasAttribute?.('data-orbis-account'))import('./account-locales.js').then(({accountLocale})=>{accountLink.textContent=accountLocale(document.documentElement.lang).account;});

 document.title='Puzzle Orbis · '+t('multiTitle');
 $('multi-delete').textContent=privacyCopy(index).label;
 for(const el of document.querySelectorAll('[data-t]'))el.textContent=t(el.dataset.t);
 for(const el of document.querySelectorAll('[data-image]'))el.textContent=t('image')+' '+el.dataset.image;
 const level=$('multi-level'), prev=level.value;
 level.replaceChildren();
 for(const [i,n] of CUTS.entries())level.add(new Option((i+1)+'. '+t('levelNames')[i]+' · '+n+' '+t('cuts'),i));
 if(prev)level.value=prev;
 controls();
 if(state){draw();announceBoard(boards.find(b=>b.canvas===document.activeElement));}else status(t('waiting'));
}
lang.onchange=()=>{saveLocale(storage,Number(lang.value));applyLanguage();};
$('image-count').onchange=()=>{
 const three=$('image-count').value==='3';
 $('upload-third').hidden=!three;
 fileInputs[2].disabled=!three;
 fileInputs[2].required=three;
};
function status(message){updateFeedback($('multi-status'),message);}
function announceBoard(board){updateFeedback($('board-feedback'),positionMessage(Number(lang.value),board?.cursor==null?null:{slot:board.cursor,count:board.slots.length},selection===null?null:origins[selection]));}
function controls(){
 $('multi-pause').disabled=!state||completed;
 $('multi-restart').disabled=!state;
 $('multi-save').disabled=!state;
 $('multi-pause').textContent=t(clock.running?'pause':'resume');
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
  if(!img.naturalWidth||!img.naturalHeight||img.naturalWidth*img.naturalHeight>39000000)throw Error('invalidDimensions');
  const bytes=await blob.arrayBuffer();
  const hash=await crypto.subtle.digest('SHA-256',bytes);
  const id=Array.from(new Uint8Array(hash),b=>b.toString(16).padStart(2,'0')).join('');
  // Store ordinary structured-clone bytes, not Safari file-backed blobs.
  return {img,id,storedImage:{bytes,type:blob.type}};
 }finally{URL.revokeObjectURL(url);}
}
function activate(decoded,blobs,next,mode,snapshot){
 const counts=boardCounts(next.level,next.imageCount,next.policy);
 const slots=boardSlots(counts);
 state=next;sourceImages=blobs;cut=mode;selection=null;completed=false;newRecord=false;origins=slots.flat();
 const views=$('boards');
 views.replaceChildren();announceBoard();
 boards=decoded.map(({img,id},i)=>{
  const section=document.createElement('section'), title=document.createElement('h2'), canvas=document.createElement('canvas');
  const size=canvasSize(img.naturalWidth,img.naturalHeight,600,1200);
  canvas.width=size.width;canvas.height=size.height;canvas.tabIndex=0;

  title.textContent=t('image')+' '+(i+1);
  section.append(title,canvas);views.append(section);
  const regions=layout(mode,counts[i],size.width,size.height,id+':'+next.level+':'+next.policy);
  const ctx=canvas.getContext('2d');
  const board={img,id,title,canvas,ctx,regions,slots:slots[i],cursor:null};
  canvas.addEventListener('click',event=>{
   const r=canvas.getBoundingClientRect();
   const i=layoutPieceAt(regions,(event.clientX-r.left)/r.width,(event.clientY-r.top)/r.height);
   if(i>=0){board.cursor=null;announceBoard();choose(board.slots[i].id);}
  });
  canvas.addEventListener('focus',()=>{
   if(completed||!clock.running)return;
   board.cursor??=0;draw();announceBoard(board);
  });
  canvas.addEventListener('keydown',event=>{
   if(completed||!clock.running||(!isBoardArrow(event.key)&&event.key!=='Enter'&&event.key!==' '))return;
   event.preventDefault();
   board.cursor??=0;
   if(isBoardArrow(event.key))board.cursor=nextBoardSlot(board.cursor,regions.length,i=>regions[i],event.key);
   else choose(board.slots[board.cursor].id);
   draw();announceBoard(board);
  });
  canvas.addEventListener('blur',()=>{if(board.cursor!==null){board.cursor=null;draw();announceBoard();}});
  return board;
 });
 completionMatrix=compatibleBoardSlots(boards.map(b=>b.regions));
 const initialPieces=ensureUnsolvedMulti(state.initialPieces,counts,completionMatrix);
 state={...state,initialPieces,pieces:snapshot?state.pieces:[...initialPieces]};
 completed=multiProgress(state.pieces,counts,completionMatrix).complete;
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
 selection=null;completed=false;newRecord=false;clock.reset();clock.start();announceBoard();
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
 const stats=multiProgress(state.pieces,boards.map(b=>b.slots.length),completionMatrix);
 if(!completed&&stats.complete){
  completed=true;
  const duration=clock.finish();
  newRecord=duration>0&&saveBest(storage,key,duration).improved;
  time();controls();
 }
 for(const [i,b] of boards.entries()){
  b.title.textContent=t('image')+' '+(i+1)+' · '+stats.byBoard[i]+'%';
  b.canvas.setAttribute('aria-label',t('board')+' '+(i+1)+' · ↑ ↓ ← → · Enter');
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
 status(t(completed?'completed':'progress')+': '+stats.total+'% · '+t('moves')+': '+state.moves+(newRecord?' · '+t('newRecord'):''));
}
async function begin(blobs,snapshot,version,settings,stillValid=()=>true){
 try{
  if(!blobs.every(f=>f&&f.type.startsWith('image/')&&f.size>0&&f.size<=8*1024*1024))throw Error(blobs.some(f=>f?.size>8*1024*1024)?'tooLarge':'invalidImage');
  const decoded=await Promise.all(blobs.map(decode));
  if(version!==generation||!stillValid())return;
  const {level,policy,cut:mode}=settings;
  if(!cuts.includes(mode))throw Error('openError');
  const next=snapshot?{level,imageCount:blobs.length,policy,pieces:snapshot.pieces,initialPieces:snapshot.initialPieces,moves:snapshot.moves}:createMulti(level,blobs.length,policy);
  activate(decoded,decoded.map(item=>item.storedImage),next,mode,snapshot);
 }catch(error){if(version===generation)status(['invalidImage','tooLarge','invalidDimensions'].includes(error.message)?t(error.message):t('openError'));}
}
$('setup').onsubmit=event=>{
 event.preventDefault();
 const version=++generation, n=Number($('image-count').value);
 status(t('loading'));
 begin(fileInputs.slice(0,n).map(i=>i.files[0]),null,version,{level:Number($('multi-level').value),policy:$('count-policy').value,cut:$('multi-cut').value});
};
$('multi-pause').onclick=()=>{if(!state||completed)return;if(clock.running)clock.pause();else clock.start();controls();time();};
$('multi-restart').onclick=restart;
$('multi-save').onclick=async()=>{
 if(!state||saving||$('multi-delete').disabled)return;
 saving=true;
 try{
  await saveMulti({...state,cut,images:sourceImages,version:2,elapsedMs:clock.elapsed(),paused:!clock.running});
  status(t('saved'));
 }catch{status(t('noSpace'));}
 finally{saving=false;}
};
$('multi-load').onclick=async()=>{
 if($('multi-delete').disabled)return;
 const version=++generation, token=++restoreRequest;
 try{
  const saved=await readMulti();
  if(version!==generation||token!==restoreRequest)return;
  if(!isMultiSnapshot(saved)){status(t('noSaved'));return;}
  $('image-count').value=String(saved.imageCount);$('image-count').onchange();
  $('multi-level').value=String(saved.level);$('count-policy').value=saved.policy;$('multi-cut').value=saved.cut;
  const images=saved.version===1?saved.images:saved.images.map(({bytes,type})=>new Blob([bytes],{type}));
  await begin(images,saved,version,saved,()=>token===restoreRequest);
 }catch{if(version===generation)status(t('openError'));}
};
bindSaveDeletion({
 button:$('multi-delete'),locale:()=>Number(lang.value),busy:()=>saving,
 onConfirmed:()=>{restoreRequest++;},erase:deleteMulti,report:status
});
applyLanguage();
setInterval(time,250);
if('serviceWorker'in navigator)navigator.serviceWorker.register('./sw.js').catch(()=>{});
