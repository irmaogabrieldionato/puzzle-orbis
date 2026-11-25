import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {LANGUAGE_TAGS} from '../src/i18n.js';
import {ACCOUNT_KEYS,accountLocale} from '../src/account-locales.js';

test('account localizes every UI and status key in the 15 supported languages',()=>{
 for(const tag of LANGUAGE_TAGS){
  const strings=accountLocale(tag);
  assert.equal(Object.keys(strings).length,27);
  assert.ok(ACCOUNT_KEYS.every(key=>strings[key]?.trim()));
  if(tag!=='pt-BR')assert.notEqual(strings.unavailable,accountLocale('pt-BR').unavailable);
 }
 assert.equal(accountLocale('other'),accountLocale('pt-BR'));
 const html=readFileSync(new URL('../account.html',import.meta.url),'utf8');
 for(const [,key] of html.matchAll(/data-account-text="([^"]+)"/g))assert.ok(ACCOUNT_KEYS.includes(key),key);
});
