import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile, mkdtemp, cp, rm, stat} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {execFileSync} from 'node:child_process';
import vm from 'node:vm';

test('web package contains every offline precache resource and manifest icon', async () => {
 const dir = await mkdtemp(join(tmpdir(), 'orbis-package-'));
 try {
  for (const name of ['scripts','src','icons','index.html','account.html','multi.html','multi.css','manifest.webmanifest','sw.js']) {
   await cp(new URL('../'+name, import.meta.url), join(dir,name), {recursive:true});
  }
  execFileSync(process.execPath,['scripts/build.mjs'],{cwd:dir});
  const root=join(dir,'www');
  const worker=await readFile(join(root,'sw.js'),'utf8');
  let files;
  const listeners={};
  const cache={addAll:async entries=>{files=Array.from(entries)}};
  vm.runInNewContext(worker,{self:{registration:{scope:'https://example.invalid/'},addEventListener:(name,fn)=>{listeners[name]=fn},skipWaiting:async()=>{}},caches:{open:async()=>cache},URL});
  let installed;
  listeners.install({waitUntil:p=>{installed=p}});
  await installed;
  assert.ok(files.includes('./index.html'));
  assert.ok(files.includes('./multi.html'));
  assert.ok(files.includes('./account.html'));
  for(const file of files) {
   assert.ok(file.startsWith('./'),file);
   await stat(join(root,file));
  }
  const manifest=JSON.parse(await readFile(join(root,'manifest.webmanifest'),'utf8'));
  for(const icon of manifest.icons) {
   assert.ok(files.includes('./'+icon.src),icon.src);
   assert.ok((await stat(join(root,icon.src))).size>0);
  }
  assert.ok(!files.some(file=>file.endsWith('orbis-public-auth.json')));
  let intercepted=false;
  listeners.fetch({request:{method:'GET',url:'https://example.invalid/src/orbis-public-auth.json'},respondWith:()=>{intercepted=true}});
  assert.equal(intercepted,false);
 } finally { await rm(dir,{recursive:true,force:true}); }
});
