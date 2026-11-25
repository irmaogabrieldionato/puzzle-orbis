const database='puzzle-orbis-local';
const collection='multi';
function open() {
 return new Promise((resolve,reject)=>{
  const request=indexedDB.open(database,1);
  request.onupgradeneeded=()=>request.result.createObjectStore(collection);
  request.onsuccess=()=>resolve(request.result);
  request.onerror=()=>reject(request.error);
 });
}
async function transaction(mode,action){
 const db=await open();
 try{
  return await new Promise((resolve,reject)=>{
   const tx=db.transaction(collection,mode);
   const request=action(tx.objectStore(collection));
   tx.oncomplete=()=>resolve(request.result);
   tx.onerror=()=>reject(tx.error);
   tx.onabort=()=>reject(tx.error||new Error('Storage transaction aborted'));
  });
 }finally{db.close();}
}
export const saveMulti=snapshot=>transaction('readwrite',store=>store.put(snapshot,'active'));
export const readMulti=()=>transaction('readonly',store=>store.get('active'));
