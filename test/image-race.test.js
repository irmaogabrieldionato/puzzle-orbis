import test from 'node:test';
import assert from 'node:assert/strict';

test('a imagem escolhida por último prevalece mesmo se a leitura anterior terminar depois', async () => {
  const original = {};
  for (const key of ['document','Image','FileReader','navigator','localStorage','Option']) original[key] = Object.getOwnPropertyDescriptor(globalThis,key);
  const elements = new Map();
  const pendingReads = [];
  const pendingImages = [];
  const context = { clearRect(){}, drawImage(){}, strokeRect(){}, set strokeStyle(v){}, set lineWidth(v){}, set globalAlpha(v){} };
  const element = id => {
    if (!elements.has(id)) elements.set(id, {
      value: '0', textContent: '', files: [], add(){},
      getContext(){return context},
      addEventListener(){},
      getBoundingClientRect(){return {left:0,top:0,width:640,height:480}},
      width:640,height:480
    });
    return elements.get(id);
  };
  try {
    globalThis.document = {getElementById:element};
    globalThis.Option = class { constructor(label,value){this.label=label;this.value=value} };
    Object.defineProperty(globalThis,'navigator',{configurable:true,writable:true,value:{}});
    globalThis.localStorage = {getItem(){return null},setItem(){}};
    globalThis.FileReader = class {
      constructor(){pendingReads.push(this)}
      readAsDataURL(file){this.result=file.data}
    };
    globalThis.Image = class {
      constructor(){this.naturalWidth=640;this.naturalHeight=480;pendingImages.push(this)}
      set src(value){this._src=value}
      get src(){return this._src}
    };
    await import('../src/app.js?race-regression');
    const picker=element('file');
    picker.files=[{type:'image/png',size:100,data:'data:image/png;base64,first'}];
    picker.onchange({target:picker});
    picker.files=[{type:'image/png',size:100,data:'data:image/png;base64,second'}];
    picker.onchange({target:picker});
    assert.equal(pendingReads.length,2);
    pendingReads[1].onload();
    assert.equal(pendingImages.length,1);
    pendingImages[0].onload();
    assert.match(element('status').textContent,/Concluído:/);
    const statusAfterSecond=element('status').textContent;
    pendingReads[0].onload();
    assert.equal(pendingImages.length,1,'a leitura antiga não deve iniciar uma nova imagem');
    assert.equal(element('status').textContent,statusAfterSecond);

    // Two valid FileReader completions, followed by Image.onload in reverse order.
    picker.files=[{type:'image/png',size:100,data:'data:image/png;base64,third'}];
    picker.onchange({target:picker});
    pendingReads[2].onload();
    assert.equal(pendingImages.length,2);
    picker.files=[{type:'image/png',size:100,data:'data:image/png;base64,fourth'}];
    picker.onchange({target:picker});
    pendingReads[3].onload();
    assert.equal(pendingImages.length,3);
    pendingImages[2].onload();
    assert.equal(element('status').textContent,'Concluído: '+element('status').textContent.split('Concluído: ')[1]);
    const statusAfterFourth=element('status').textContent;
    pendingImages[1].onload();
    assert.equal(element('status').textContent,statusAfterFourth,'Image.onload antigo não deve substituir estado recente');
    assert.equal(pendingImages[2].src,'data:image/png;base64,fourth');
  } finally {
    for (const [key,descriptor] of Object.entries(original)) {
      if (descriptor) Object.defineProperty(globalThis,key,descriptor);
      else delete globalThis[key];
    }
  }
});
