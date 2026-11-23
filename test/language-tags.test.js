import test from 'node:test';
import assert from 'node:assert/strict';
import {LANGUAGES} from '../src/engine.js';
import {languageTag,LANGUAGE_TAGS,translation} from '../src/i18n.js';

test('all 15 selector entries have distinct valid BCP 47 language tags',()=>{
 assert.equal(LANGUAGES.length,15);
 assert.equal(LANGUAGE_TAGS.length,LANGUAGES.length);
 assert.equal(new Set(LANGUAGE_TAGS).size,15);
 for(let i=0;i<LANGUAGES.length;i++){
  assert.equal(languageTag(i),LANGUAGE_TAGS[i]);
  assert.equal(Intl.getCanonicalLocales(languageTag(i))[0],languageTag(i));
 }
});
test('invalid selection falls back to Portuguese without breaking existing translations',()=>{
 assert.equal(languageTag(-1),'pt-BR');
 assert.equal(languageTag(99),'pt-BR');
 assert.equal(translation(0).help,'Choose an image and arrange the pieces.');
 assert.equal(translation(8).help,'Escolha uma imagem e organize as peças.');
});
