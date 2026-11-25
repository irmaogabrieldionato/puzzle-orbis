const assert = require('node:assert/strict');
const { writeFileSync } = require('node:fs');
const { execFileSync } = require('node:child_process');
const { setTimeout: delay } = require('node:timers/promises');

const packageId = 'br.com.puzzleorbis.app';
const port = '9222';
const adb = (...args) => execFileSync('adb', args, { encoding: 'utf8', timeout: 60_000 }).trim();
const image = '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><rect width="200" height="200" fill="#ff0000"/><rect width="100" height="100" fill="#0000ff"/></svg>';

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

async function tapSlots(page, points) {
  const box = await page.evaluate(`(async () => {
    const c = document.querySelector('#board');
    c.scrollIntoView({block:'center',inline:'nearest'});
    await new Promise(resolve => requestAnimationFrame(resolve));
    const {left,top,width,height} = c.getBoundingClientRect();
    return {left,top,width,height};
  })()`);
  for (const [x,y] of points) {
    await page.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{x:box.left+box.width*x,y:box.top+box.height*y}] });
    await page.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  }
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
    page = await launch();
    await waitFor(() => page.evaluate(`document.querySelector('#language')?.options.length === 15`), 'game startup');
    assert.match(await page.evaluate(`document.querySelector('h1').textContent`), /Puzzle Orbis/);
    await page.evaluate(`(() => {
      const language = document.querySelector('#language');
      language.value = '8';
      language.dispatchEvent(new Event('change', {bubbles:true}));
      const input = document.querySelector('#file'), files = new DataTransfer();
      files.items.add(new File([${JSON.stringify(image)}], 'orbis-ci.svg', {type:'image/svg+xml'}));
      input.files = files.files;
      input.dispatchEvent(new Event('change', {bubbles:true}));
    })()`);
    await status(page,'Movimentos: 0');
    const before = await pixels(page);
    // Swap the blue tile with another color so the visual assertion can detect the move.
    const points = [[.25,.25],[.75,.25],[.25,.75],[.75,.75]];
    const blue = before.findIndex(p => p.join() === '0,0,255,255');
    const other = (blue+1)%4;
    await tapSlots(page, [points[blue],points[other]]);
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
