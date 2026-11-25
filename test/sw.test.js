import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';

function harness(online = true) {
  const listeners = {};
  const stored = new Map();
  const deleted = [];
  let claimed = false;
  let skipped = false;
  const cache = {
    addAll: async files => { for (const file of files) stored.set(new URL(file, 'https://example.test/app/').href, {body:'precache'}); },
    put: async (request, response) => { stored.set(request.url, response); },
  };
  const caches = {
    open: async () => cache,
    match: async request => stored.get(request.url),
    keys: async () => ['puzzle-orbis-v1', 'puzzle-orbis-v2', 'puzzle-orbis-v3', 'puzzle-orbis-v4', 'puzzle-orbis-v5', 'puzzle-orbis-v6', 'puzzle-orbis-v7', 'puzzle-orbis-v8', 'puzzle-orbis-v9', 'puzzle-orbis-v10', 'puzzle-orbis-v11', 'puzzle-orbis-v12', 'another-app-v1'],
    delete: async key => {deleted.push(key); return true;},
  };
  const response = body => ({ok:true, body, clone(){return response(body);}});
  const context = {self:{registration:{scope:'https://example.test/app/'},addEventListener:(name,fn)=>listeners[name]=fn,skipWaiting:async()=>{skipped=true;},clients:{claim:async()=>{claimed=true;}}},caches,location:{origin:'https://example.test'},URL,fetch:async()=>{if(!online)throw Error('offline');return response('network');}};
  vm.runInNewContext(readFileSync(new URL('../sw.js',import.meta.url),'utf8'),context);
  async function dispatch(name,request){const waits=[];let answer;listeners[name]({request,waitUntil:p=>waits.push(p),respondWith:p=>answer=p});const result=answer?await answer:undefined;await Promise.all(waits);return result;}
  return {dispatch,stored,deleted,get claimed(){return claimed;},get skipped(){return skipped;}};
}

test('instalação pré-armazena arquivos e ativa imediatamente',async()=>{const h=harness();await h.dispatch('install');assert.equal(h.skipped,true);for (const file of ['index.html','account.html','multi.html','multi.css','src/multi-app.js','src/multi-engine.js','src/multi-store.js','src/app.js','src/engine.js','src/i18n.js','src/locales.js','src/account.js','src/auth-config.js','src/rectangular.js','src/storage.js','src/timer.js','src/variable-cuts.js','manifest.webmanifest','icons/icon-192.png','icons/icon-512.png','icons/maskable-512.png','icons/apple-touch-icon.png']) assert.ok(h.stored.has('https://example.test/app/'+file),file);await h.dispatch('activate');assert.equal(h.claimed,true);assert.deepEqual(h.deleted,['puzzle-orbis-v1','puzzle-orbis-v2','puzzle-orbis-v3','puzzle-orbis-v4','puzzle-orbis-v5','puzzle-orbis-v6','puzzle-orbis-v7','puzzle-orbis-v8','puzzle-orbis-v9','puzzle-orbis-v10','puzzle-orbis-v11']);});
test('rede tem prioridade e atualiza cache',async()=>{const h=harness();const request={method:'GET',url:'https://example.test/app/index.html'};const result=await h.dispatch('fetch',request);assert.equal(result.body,'network');assert.equal(h.stored.get(request.url).body,'network');});
test('offline utiliza resposta armazenada',async()=>{const h=harness(false);await h.dispatch('install');const result=await h.dispatch('fetch',{method:'GET',url:'https://example.test/app/index.html'});assert.equal(result.body,'precache');});
test('não intercepta POST nem outras origens',async()=>{const h=harness();assert.equal(await h.dispatch('fetch',{method:'POST',url:'https://example.test/app/index.html'}),undefined);assert.equal(await h.dispatch('fetch',{method:'GET',url:'https://other.test/app/index.html'}),undefined);});

test('não intercepta caminhos de outros aplicativos na mesma origem',async()=>{const h=harness();assert.equal(await h.dispatch('fetch',{method:'GET',url:'https://example.test/other-app/index.html'}),undefined);assert.equal(await h.dispatch('fetch',{method:'GET',url:'https://example.test/app-other/index.html'}),undefined);});
