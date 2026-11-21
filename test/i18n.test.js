import test from 'node:test';
import assert from 'node:assert/strict';
import {UI,translation} from '../src/i18n.js';
test('English and Portuguese have matching UI keys and nonempty strings',()=>{assert.deepEqual(Object.keys(UI.en).sort(),Object.keys(UI.pt).sort());for(const locale of Object.values(UI))for(const value of Object.values(locale))assert.ok(typeof value==='string'&&value.trim().length>0)});
test('language selection uses English at index 0 and Portuguese at index 8',()=>{assert.equal(translation(0),UI.en);assert.equal(translation(8),UI.pt)});
