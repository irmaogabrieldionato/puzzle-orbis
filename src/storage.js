// Confirma o salvamento local; alguns ambientes ignoram setItem sem lançar erro.
export function saveLocalSnapshot(storage,key,snapshot){
 try{
  const encoded=JSON.stringify(snapshot);
  if(typeof encoded!=='string')return false;
  storage.setItem(key,encoded);
  return storage.getItem(key)===encoded;
 }catch{return false}
}
