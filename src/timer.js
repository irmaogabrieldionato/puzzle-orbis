// Relógio monotônico por partida; recordes são locais e nunca compartilhados.
export function createStopwatch(now=()=>performance.now()){
 let started=null,elapsed=0,finished=false;
 return {
  start(){if(started===null&&!finished)started=now()},
  pause(){if(started!==null){elapsed+=Math.max(0,now()-started);started=null}},
  reset(){started=null;elapsed=0;finished=false},
  restore(ms){if(!Number.isSafeInteger(ms)||ms<0)throw new TypeError('Invalid elapsed time');started=null;elapsed=ms;finished=false},
  finish(){if(!finished){this.pause();finished=true}return Math.floor(elapsed)},
  elapsed(){return Math.floor(elapsed+(started===null?0:Math.max(0,now()-started)))},
  get running(){return started!==null},
  get finished(){return finished}
 };
}
export function recordKey(imageId,level,imageCount=1,cutMode='square'){
 if(typeof imageId!=='string'||!imageId||!Number.isInteger(level)||level<0||!Number.isInteger(imageCount)||imageCount<1||typeof cutMode!=='string'||!cutMode)throw new TypeError('Invalid puzzle identity');
 return 'puzzle-orbis-best:'+JSON.stringify([imageId,level,imageCount,cutMode]);
}
export function readBest(storage,key){try{const value=Number(storage.getItem(key));return Number.isSafeInteger(value)&&value>0?value:null}catch{return null}}
export function saveBest(storage,key,elapsedMs){
 if(!Number.isSafeInteger(elapsedMs)||elapsedMs<=0)return {best:readBest(storage,key),improved:false};
 const previous=readBest(storage,key);
 if(previous!==null&&elapsedMs>=previous)return {best:previous,improved:false};
 try{storage.setItem(key,String(elapsedMs));if(readBest(storage,key)===elapsedMs)return {best:elapsedMs,improved:true};return {best:readBest(storage,key),improved:false}}catch{return {best:readBest(storage,key),improved:false}}
}
export function formatTime(ms){const seconds=Math.floor(Math.max(0,ms)/1000);return String(Math.floor(seconds/60)).padStart(2,'0')+':'+String(seconds%60).padStart(2,'0')}
