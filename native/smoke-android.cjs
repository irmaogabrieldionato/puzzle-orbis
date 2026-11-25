const assert = require('node:assert/strict');
const { writeFileSync } = require('node:fs');
const { execFileSync } = require('node:child_process');
const { setTimeout: delay } = require('node:timers/promises');

const packageId = 'br.com.puzzleorbis.app';
const port = '9222';
const adb = (...args) => execFileSync('adb', args, { encoding: 'utf8', timeout: 60_000 }).trim();
const fixtureName = 'orbis-ci-photo.png';
// Synthetic sRGB PNG: 200x200, red with a blue top-left quadrant.
const fixture = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAIAAAAiOjnJAAAB10lEQVR42u3SwQkAAAgDse6/tK7Qp2DgJjiSZFRmQV9MAAsssMACCyyBBRZYYIEFlsACCyywwAJLYIEFFlhggSWwwAILLLDAElhggQUWWGAJLLDAAgsssAQWWGCBBRZYAgsssMACCyyBBRZYYIEFlsACCyywwAJLYIEFFlhggSWwwAILLLDAElhggQUWWGDJArDAAgsssMASWGCBBRZYYAkssMACCyywBBZYYIEFFlgCCyywwAILLIEFFlhggQWWwAILLLDAAktggQUWWGCBJbDAAgsssMASWGCBBRZYYAkssMACCyywBBZYYIEFFlgCCyywwAILLIEFFlhggQWWwAILLLDAAgssE8ACCyywwAJLYIEFFlhggSWwwAILLLDAElhggXUclgUCS2AJLAksgSWwJLAElsCSwBJYAksCS2AJLAksgSWwJLAElsCSwBJYAksCS2AJLAksgSWwJLAElsCSwBJYAksCS2AJLAksgSWwJLAElsCSwBJYAksCS2AJLAksgSWwJLAElsCSwBJYAksCS2AJLAksgSWwJLAElsCSwBJYAksCS2AJLAksgSWwJLAElsCSwBJYAkuyQGAJLIElgSWwBJYElsASWBJYAktgSWAJLD1sAfsVrNb5QhplAAAAAElFTkSuQmCC','base64');
const xmlPath = '/sdcard/orbis-picker.xml';


async function waitFor(check, label) {
  const end = Date.now() + 30_000;
  let error;
  do {
    try {
      const value = await check();
      if (value) return value;
    } catch (e) { error = e; }
    await delay(500);
  } while (Date.now() < end);
  throw new Error('Timed out waiting for ' + label, {cause: error});
}

class Target {
  constructor(url) {
    this.socket = new WebSocket(url);
    this.id = 0;
    this.pending = new Map();
    this.socket.addEventListener('message', ({data}) => {
      const msg = JSON.parse(data);
      this.pending.get(msg.id)?.(msg);
    });
  }
  async send(method, params = {}) {
    await waitFor(() => this.socket.readyState === WebSocket.OPEN, 'DevTools connection');
    const id = ++this.id;
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        this.pending.delete(id);
        reject(new Error('DevTools command timed out: ' + method));
      }, 4000);
      this.pending.set(id, message => {
        clearTimeout(timeout);
        this.pending.delete(id);
        if (message.error) reject(new Error(JSON.stringify(message.error)));
        else resolve(message.result);
      });
      this.socket.send(JSON.stringify({id,method,params}));
    });
  }
  async evaluate(expression) {
    const response = await this.send('Runtime.evaluate', {expression,returnByValue:true,awaitPromise:true});
    if (response.exceptionDetails) throw new Error(JSON.stringify(response.exceptionDetails));
    return response.result.value;
  }
  close() { this.socket.close(); }
}

async function launch() {
  const result = adb('shell', 'am', 'start', '-W', '-n', packageId + '/.MainActivity');
  assert.match(result, /Status: ok\b/);
  const pid = await waitFor(() => adb('shell', 'pidof', '-s', packageId), 'Android app process');
  assert.match(pid, /^\d+$/);
  adb('forward', 'tcp:' + port, 'localabstract:webview_devtools_remote_' + pid);
  const endpoint = await waitFor(async () => {
    const response = await fetch('http://127.0.0.1:' + port + '/json/list', { signal: AbortSignal.timeout(1000) });
    if (!response.ok) return;
    const targets = await response.json();
    return targets.find(t => t.url === 'https://localhost/' && t.webSocketDebuggerUrl)?.webSocketDebuggerUrl;
  }, 'packaged WebView page');
  return new Target(endpoint);
}

async function pixels(page) {
  const result = await page.evaluate(`(() => {
    const c = document.querySelector('#board'), ctx = c.getContext('2d');
    return [[.25,.25],[.75,.25],[.25,.75],[.75,.75]].map(([x,y]) =>
      Array.from(ctx.getImageData(Math.floor(c.width*x),Math.floor(c.height*y),1,1).data));
  })()`);
  assert.equal(result.filter(p => p.join() === '0,0,255,255').length, 1);
  assert.equal(result.filter(p => p.join() === '255,0,0,255').length, 3);
  return result;
}

async function tapElement(page, selector, points = [[.5,.5]]) {
  const box = await page.evaluate(`(async () => {
    const element = document.querySelector(${JSON.stringify(selector)});
    element.scrollIntoView({block:'center',inline:'nearest'});
    await new Promise(resolve => requestAnimationFrame(resolve));
    const {left,top,width,height} = element.getBoundingClientRect();
    return {left,top,width,height};
  })()`);
  for (const [x,y] of points) {
    await page.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{x:box.left+box.width*x,y:box.top+box.height*y}] });
    await page.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  }
}

function pickerXml() {
  adb('shell','uiautomator','dump',xmlPath);
  return adb('shell','cat',xmlPath);
}

function pickerNode(xml, regex) {
  for (const node of xml.match(/<node [^>]*>/g) ?? []) {
    if (!regex.test(node)) continue;
    const bounds = node.match(/bounds="\[(\d+),(\d+)\]\[(\d+),(\d+)\]"/);
    if (!bounds) continue;
    const [x1,y1,x2,y2] = bounds.slice(1).map(Number);
    if (x2 > x1 && y2 > y1) return [Math.floor((x1+x2)/2),Math.floor((y1+y2)/2)].map(String);
  }
}

function stagePhoto() {
  const fs = require('node:fs');
  const path = require('node:path');
  const directory = fs.mkdtempSync(path.join(require('node:os').tmpdir(),'orbis-photo-'));
  const remote = '/sdcard/Download/'+fixtureName;
  try {
    const source = path.join(directory,fixtureName);
    writeFileSync(source, fixture);
    adb('shell','mkdir','-p','/sdcard/Download');
    adb('push',source,remote);
    adb('shell','am','broadcast','-a','android.intent.action.MEDIA_SCANNER_SCAN_FILE','-d','file://'+remote);
  } finally { fs.rmSync(directory,{recursive:true,force:true}); }
}

async function pickAndroidPhoto(page) {
  await tapElement(page,'#file',[[.16,.5]]);
  const seen = new Set();
  try {
    await waitFor(() => {
      const xml = pickerXml();
      const photo = pickerNode(xml, /(?:text|content-desc)="[^"]*orbis-ci-photo[.]png/i);
      if (photo) { adb('shell','input','tap',...photo); return true; }
      const paths = [
        ['Browse',/(?:text|content-desc)="Browse(?:…|[.]{3})?"/i],
        ['Files',/(?:text|content-desc)="Files"/i],
        ['Downloads',/(?:text|content-desc)="Downloads"/i],
        ['Open from',/content-desc="(?:Show roots|Open navigation drawer|Open from)"/i],
        ['More options',/content-desc="More options"/i]
      ];
      for (const [name,match] of paths) {
        if (seen.has(name)) continue;
        const point = pickerNode(xml,match);
        if (!point) continue;
        seen.add(name);
        adb('shell','input','tap',...point);
        break;
      }
    }, 'fixture photo displayed by the Android picker');
    await waitFor(() => page.evaluate(`document.querySelector('#file').files?.[0]?.name === ${JSON.stringify(fixtureName)}`),
      'Android picker returning the selected file to Puzzle Orbis');
  } catch (error) {
    try { writeFileSync('puzzle-orbis-android-picker.xml',pickerXml()); } catch {}
    try { writeFileSync('puzzle-orbis-android-picker.png',execFileSync('adb',['exec-out','screencap','-p'],{timeout:10000,maxBuffer:16000000})); } catch {}
    throw error;
  }
  console.log('PASS: Android system file picker selected the PNG and returned it to Puzzle Orbis.');
}

const status = (page, expected) => waitFor(
  () => page.evaluate(`document.querySelector('#status')?.textContent.includes(${JSON.stringify(expected)})`),
  expected
);

(async () => {
  let page;
  try {
    assert.ok(process.argv[2], 'Pass the packaged debug APK');
    assert.match(adb('install', '-r', process.argv[2]), /Success/);
    stagePhoto();
    page = await launch();
    await waitFor(() => page.evaluate(`document.querySelector('#language')?.options.length === 15`), 'game startup');
    assert.match(await page.evaluate(`document.querySelector('h1').textContent`), /Puzzle Orbis/);
    await page.evaluate(`(() => {
      const language = document.querySelector('#language');
      language.value = '8';
      language.dispatchEvent(new Event('change', {bubbles:true}));
    })()`);
    await pickAndroidPhoto(page);
    await status(page,'Movimentos: 0');
    const before = await pixels(page);
    // Swap the blue tile with another color so the visual assertion can detect the move.
    const points = [[.25,.25],[.75,.25],[.25,.75],[.75,.75]];
    const blue = before.findIndex(p => p.join() === '0,0,255,255');
    const other = (blue+1)%4;
    await tapElement(page, '#board', [points[blue],points[other]]);
    await status(page,'Movimentos: 1');
    const after = await pixels(page);
    const expected = before.slice();
    [expected[blue],expected[other]] = [expected[other],expected[blue]];
    assert.deepEqual(after, expected);
    await page.evaluate(`document.querySelector('#save').click(); true`);
    await status(page,'Salvo neste navegador');
    page.close(); page = undefined;
    adb('shell', 'am', 'force-stop', packageId);

    page = await launch();
    await status(page,'Movimentos: 1');
    assert.deepEqual(await pixels(page), after, 'The same piece arrangement must survive process restart');
    await page.evaluate(`document.querySelector('#board').scrollIntoView({block:'center'}); true`);
    writeFileSync('puzzle-orbis-android-board.png', execFileSync('adb', ['exec-out','screencap','-p'], {timeout:10000, maxBuffer:16000000}));
    console.log('PASS: APK installed, launched, rendered the puzzle, handled a touch swap and restored it after a full Android app restart.');
  } finally {
    page?.close();
    try { adb('forward', '--remove', 'tcp:' + port); } catch {}
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
