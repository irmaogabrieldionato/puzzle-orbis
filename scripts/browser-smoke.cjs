const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const { createServer } = require('node:http');
const { readFile } = require('node:fs/promises');
const { resolve, extname, sep } = require('node:path');
const root = resolve(__dirname, '../www');
const types = {'.html':'text/html','.js':'text/javascript','.webmanifest':'application/manifest+json'};
const server = createServer(async (req, res) => {
  const pathname = new URL(req.url, 'http://localhost').pathname;
  const file = resolve(root, '.'+(pathname === '/' ? '/index.html' : pathname));
  if (!file.startsWith(root+sep)) { res.writeHead(403).end(); return; }
  try {
    const content = await readFile(file);
    res.writeHead(200, {'Content-Type':types[extname(file)]||'application/octet-stream'}).end(content);
  } catch { res.writeHead(404).end(); }
});
const svg='<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200"><rect width="100%" height="100%" fill="red"/><path d="M100 0H200V100H100Z" fill="green"/><path d="M200 0H300V100H200Z" fill="blue"/><path d="M0 100H300V200H0Z" fill="orange"/></svg>';
const data='data:image/svg+xml;base64,'+Buffer.from(svg).toString('base64');
(async()=>{
await new Promise((ok,fail)=>{server.once('error',fail);server.listen(0,'127.0.0.1',ok);});
let browser;
try{
browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH});
const context=await browser.newContext({viewport:{width:390,height:844},hasTouch:true,isMobile:true});
const page=await context.newPage();
const url='http://127.0.0.1:'+server.address().port+'/';
await page.goto(url);
const state={image:data,level:0,pieces:[1,0,2,3],initialPieces:[1,0,2,3],moves:2,elapsedMs:4500,paused:true};
await page.evaluate(v=>localStorage.setItem('puzzle-orbis-save',JSON.stringify(v)),state);
await page.reload();
await page.locator('#language').selectOption('8');
await page.waitForFunction(()=>document.querySelector('#status').textContent.includes('2')&&!document.querySelector('#pause').disabled);
assert.equal(await page.locator('#cut-mode').inputValue(),'square');
assert.equal(await page.locator('#elapsed').textContent(),'00:04');
assert.equal(await page.locator('#pause').textContent(),'Continuar');
const strike=async points=>{const box=await page.locator('#board').boundingBox(); for(const [x,y] of points)await page.touchscreen.tap(box.x+box.width*x,box.y+box.height*y);};
await page.locator('#pause').click();
await strike([[.25,.25],[.75,.25]]);
assert.match(await page.locator('#status').textContent(),/100%.*Movimentos: 3/);
assert.match(await page.locator('#status').textContent(),/Novo recorde/);
const rect={...state,cut:'rectangular',pieces:[2,1,0,3],initialPieces:[2,1,0,3],moves:9};
await page.evaluate(v=>localStorage.setItem('puzzle-orbis-save',JSON.stringify(v)),rect);
await page.reload();
await page.locator('#language').selectOption('8');
await page.waitForFunction(()=>document.querySelector('#status').textContent.includes('Movimentos: 9'));
assert.equal(await page.locator('#cut-mode').inputValue(),'rectangular');
assert.equal(await page.locator('#best').textContent(),'--:--');
await page.locator('#pause').click();
await page.locator('#cut-mode').dispatchEvent('change');
assert.match(await page.locator('#status').textContent(),/Movimentos: 9/);
assert.equal(await page.locator('#pause').textContent(),'Pausar');
assert.notEqual(await page.locator('#elapsed').textContent(),'00:00');
await strike([[1/6,.25],[5/6,.25]]);
assert.match(await page.locator('#status').textContent(),/100%.*Movimentos: 10/);
const sample=await page.locator('#board').evaluate(c=>[[.16,.25],[.5,.25],[.83,.25],[.5,.75]].map(([x,y])=>[...c.getContext('2d').getImageData(Math.floor(c.width*x),Math.floor(c.height*y),1,1).data]));
assert.deepEqual(sample,[[255,0,0,255],[0,128,0,255],[0,0,255,255],[255,165,0,255]]);
if (process.env.PUZZLE_SCREENSHOT) await page.locator('#board').screenshot({path:process.env.PUZZLE_SCREENSHOT});
console.log('PASS: mobile/touch, old save, pause and resume, rectangular selection, completion, record isolation and canvas colors');
await context.close();
{
const offline=await browser.newContext();
const tab=await offline.newPage();
await tab.goto(url);
await tab.waitForFunction(()=>navigator.serviceWorker?.controller?.state==='activated');
const files=await tab.evaluate(async()=>{const result=[];for(const s of await caches.keys())for(const r of await (await caches.open(s)).keys())result.push(new URL(r.url).pathname);return result;});
// The first visit itself loaded modules before the worker controlled the page.
for(const p of ['/src/app.js','/src/timer.js','/src/i18n.js','/src/storage.js','/src/rectangular.js'])assert.ok(files.includes(p),p+' was not cached on the first visit');
await offline.setOffline(true);
await tab.reload();
await tab.locator('#file').setInputFiles({name:'puzzle.svg',mimeType:'image/svg+xml',buffer:Buffer.from(svg)});
await tab.waitForFunction(()=>!document.querySelector('#pause').disabled);
console.log('PASS: first-visit offline reload and image upload');
}
}finally{await browser?.close();server.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
