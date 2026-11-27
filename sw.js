const CACHE='puzzle-orbis-v19';
const CACHE_PREFIX='puzzle-orbis-';
const APP_SCOPE=self.registration.scope;
const FILES=['./','./index.html','./account.html','./multi.html','./multi.css','./src/app.js','./src/engine.js','./src/i18n.js','./src/locales.js','./src/account.js','./src/account-locales.js','./src/account-outcome.js','./src/auth-config.js','./src/rectangular.js','./src/storage.js','./src/timer.js','./src/variable-cuts.js','./src/multi-app.js','./src/multi-engine.js','./src/multi-store.js','./src/save-privacy.js','./src/board-feedback.js','./manifest.webmanifest','./icons/icon-192.png','./icons/icon-512.png','./icons/maskable-512.png','./icons/apple-touch-icon.png'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith(CACHE_PREFIX)&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
// Installed shell assets are versioned together; avoid network failures on offline startup.
const SHELL=new Set(FILES.map(file=>new URL(file,APP_SCOPE).href));
self.addEventListener('fetch',e=>{if(e.request.method!=='GET'||!new URL(e.request.url).href.startsWith(APP_SCOPE))return;if(new URL(e.request.url).pathname.endsWith('/src/orbis-public-auth.json'))return;e.respondWith((async()=>{
 const cache=await caches.open(CACHE);
 if(SHELL.has(e.request.url)){
  const installed=await cache.match(e.request);
  if(installed)return installed;
 }
 try{
  const response=await fetch(e.request);
  if(response.ok){const copy=response.clone();await cache.put(e.request,copy).catch(()=>{});}
  return response;
 }catch(error){
  const saved=await cache.match(e.request);
  if(saved)return saved;
  throw error;
 }
})())});
