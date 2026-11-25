const CACHE='puzzle-orbis-v12';
const CACHE_PREFIX='puzzle-orbis-';
const APP_SCOPE=self.registration.scope;
const FILES=['./','./index.html','./account.html','./multi.html','./multi.css','./src/app.js','./src/engine.js','./src/i18n.js','./src/locales.js','./src/account.js','./src/auth-config.js','./src/rectangular.js','./src/storage.js','./src/timer.js','./src/variable-cuts.js','./src/multi-app.js','./src/multi-engine.js','./src/multi-store.js','./manifest.webmanifest','./icons/icon-192.png','./icons/icon-512.png','./icons/maskable-512.png','./icons/apple-touch-icon.png'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith(CACHE_PREFIX)&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{if(e.request.method!=='GET'||!new URL(e.request.url).href.startsWith(APP_SCOPE))return;if(new URL(e.request.url).pathname.endsWith('/src/orbis-public-auth.json'))return;e.respondWith(fetch(e.request).then(response=>{if(response.ok){const copy=response.clone();e.waitUntil(caches.open(CACHE).then(c=>c.put(e.request,copy)))}return response}).catch(()=>caches.match(e.request)))});
