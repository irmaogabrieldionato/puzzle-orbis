const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const { createServer } = require('node:http');
const { readFile } = require('node:fs/promises');
const { resolve, extname, sep } = require('node:path');
const root = resolve(__dirname, '../www');
const types = {'.html':'text/html','.js':'text/javascript','.webmanifest':'application/manifest+json','.png':'image/png','.css':'text/css'};
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
await page.locator('#board').focus();
await page.keyboard.press('Enter');
await page.keyboard.press('ArrowRight');
await page.keyboard.press('Enter');
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
for(const mode of ['mixed','random']){
 await page.locator('#cut-mode').selectOption(mode);
 await page.locator('#save').click();
 const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('puzzle-orbis-save')));
 assert.equal(saved.cut,mode);
 const position=await page.evaluate(async ({mode,data})=>{
  const {variableLayout}=await import('/src/variable-cuts.js');
  let a=2166136261,b=5381;
  for(let i=0;i<data.length;i++){const c=data.charCodeAt(i);a=Math.imul(a^c,16777619);b=Math.imul(b,33)^c;}
  const id=data.length+':'+(a>>>0).toString(16)+':'+(b>>>0).toString(16);
  const board=document.querySelector('#board');
  return variableLayout(mode,4,board.width,board.height,id+':0').slice(0,2).map(r=>[r.x+r.width/2,r.y+r.height/2]);
 },{mode,data});
 await page.evaluate(v=>localStorage.setItem('puzzle-orbis-save',JSON.stringify(v)),{...state,cut:mode});
 await page.reload();
 await page.locator('#language').selectOption('8');
 await page.waitForFunction(()=>document.querySelector('#status').textContent.includes('Movimentos: 2'));
 assert.equal(await page.locator('#cut-mode').inputValue(),mode);
 assert.equal(await page.locator('#best').textContent(),'--:--');
 await page.locator('#pause').click();
 await strike(position);
 assert.match(await page.locator('#status').textContent(),/100%.*Movimentos: 3/);
 assert.match(await page.locator('#status').textContent(),/Novo recorde/);
 console.log('PASS: touch playthrough, save compatibility and isolated record in '+mode);
}
await page.goto(url+'multi.html');
await page.locator('#image-count').selectOption('3');
const images=['<rect width="60" height="60" fill="red"/><rect x="60" width="60" height="60" fill="orange"/>','<rect width="120" height="60" fill="green"/>','<rect width="120" height="60" fill="blue"/>'];
const multiFile=(i)=>({name:'tabuleiro'+i+'.svg',mimeType:'image/svg+xml',buffer:Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" width="120" height="60">'+images[i]+'</svg>')});
for(let i=0;i<3;i++)await page.locator('#image-'+(i+1)).setInputFiles(multiFile(i));
await page.locator('#start').click();
await page.waitForFunction(()=>document.querySelectorAll('#boards canvas').length===3);
const spaces=[[0,.25],[0,.75],[1,.5],[2,.5]];
const canvases=page.locator('#boards canvas');
const colors=['255,0,0','255,165,0','0,128,0','0,0,255'];
const readArrangement=async()=>Promise.all(spaces.map(([board,x])=>canvases.nth(board).evaluate((c,b)=>[...c.getContext('2d').getImageData(Math.floor(c.width*b),Math.floor(c.height*.5),1,1).data].slice(0,3).join(','),x)));
const tapSpace=async (i)=>{
 const [board,x]=spaces[i], canvas=canvases.nth(board);
 await canvas.scrollIntoViewIfNeeded();
 const box=await canvas.boundingBox();
 await page.touchscreen.tap(box.x+box.width*x,box.y+box.height*.5);
};
const shuffled=await readArrangement();
assert.ok(shuffled[0]!==colors[0]||shuffled[1]!==colors[1]);
await page.locator('#multi-pause').click();
await page.locator('#multi-save').click();
await page.waitForFunction(()=>document.querySelector('#multi-status').textContent.includes('Salvo neste navegador'));
await page.reload();
await page.locator('#multi-load').click();
await page.waitForFunction(()=>document.querySelectorAll('#boards canvas').length===3);
assert.deepEqual(await readArrangement(),shuffled);
assert.equal(await page.locator('#multi-pause').textContent(),'Continuar');
await page.locator('#multi-pause').click();
let multiMoves=0;
for(let i=0;i<4;i++){
 const placement=await readArrangement();
 if(placement[i]===colors[i])continue;
 const from=placement.indexOf(colors[i]);
 assert.ok(from>=0);
 await tapSpace(i);await tapSpace(from);
 multiMoves++;
}
assert.deepEqual(await readArrangement(),colors);
assert.match(await page.locator('#multi-status').textContent(),new RegExp('Concluído: 100%.*Movimentos: '+multiMoves));
assert.ok(await page.locator('#multi-pause').isDisabled());
await page.locator('#image-count').selectOption('2');
await page.locator('#count-policy').selectOption('per-image');
for(let i=0;i<2;i++)await page.locator('#image-'+(i+1)).setInputFiles(multiFile(i));
await page.locator('#start').click();
await page.waitForFunction(()=>document.querySelectorAll('#boards canvas').length===2);
assert.equal(await page.locator('#count-policy').inputValue(),'per-image');
console.log('PASS: 3-image cross-board touch, IndexedDB reload, completion and 2-image setup');
await page.locator('#multi-language').selectOption('5');
assert.equal(await page.locator('html').getAttribute('lang'),'ar');
assert.equal(await page.locator('html').getAttribute('dir'),'rtl');
assert.equal(await page.locator('h1').textContent(),'صور مختلطة');
assert.equal(await page.locator('#boards').evaluate(el=>getComputedStyle(el).direction),'ltr');
await page.goto(url);
assert.equal(await page.locator('html').getAttribute('dir'),'rtl');
assert.equal(await page.locator('#cut-mode').getAttribute('aria-label'),'شكل القص');
await page.locator('#language').selectOption('10');
await page.reload();
assert.equal(await page.locator('html').getAttribute('lang'),'ur');
await page.locator('#language').selectOption('0');
assert.equal(await page.locator('html').getAttribute('dir'),'ltr');
console.log('PASS: multilingual pages, persistent locale, Arabic and Urdu RTL without board mirroring');
await page.goto(url+'account.html');
await page.getByRole('status').filter({hasText:'O serviço de conta não está disponível'}).waitFor();
assert.ok(await page.locator('#account-forms').isHidden());
await context.close();
{
const offline=await browser.newContext();
const tab=await offline.newPage();
await tab.goto(url);
await tab.waitForFunction(()=>navigator.serviceWorker?.controller?.state==='activated');
const manifest=await (await tab.request.get(url+'manifest.webmanifest')).json();
assert.equal(manifest.display,'standalone');
assert.equal(manifest.scope,'./');
assert.ok(manifest.icons.some(icon=>icon.purpose==='maskable'));
for(const icon of manifest.icons){
 const response=await tab.request.get(url+icon.src);
 assert.equal(response.headers()['content-type'],'image/png');
 const data=await response.body();
 assert.equal(data.readUInt32BE(16)+'x'+data.readUInt32BE(20),icon.sizes);
}
const files=await tab.evaluate(async()=>{const result=[];for(const s of await caches.keys())for(const r of await (await caches.open(s)).keys())result.push(new URL(r.url).pathname);return result;});
// The first visit itself loaded modules before the worker controlled the page.
for(const p of ['/src/app.js','/src/timer.js','/src/i18n.js','/src/locales.js','/src/storage.js','/src/rectangular.js','/src/variable-cuts.js','/icons/icon-192.png'])assert.ok(files.includes(p),p+' was not cached on the first visit');
await offline.setOffline(true);
await tab.reload();
await tab.locator('#file').setInputFiles({name:'puzzle.svg',mimeType:'image/svg+xml',buffer:Buffer.from(svg)});
await tab.waitForFunction(()=>!document.querySelector('#pause').disabled);
await tab.goto(url+'multi.html');
await tab.waitForFunction(()=>document.querySelector('#multi-level').options.length===10);
console.log('PASS: first-visit offline reload, image upload and multi-image mode');
}
}finally{await browser?.close();server.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
