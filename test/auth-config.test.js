import test from 'node:test';
import assert from 'node:assert/strict';
import {authSettings} from '../src/auth-config.js';
const base={url:'https://demo-project.supabase.co',redirect:'https://example.test/puzzle/account.html',key:'sb_publishable_1234567890-test-public'};
test('only approved publishable configuration reaches the client',()=>{
 assert.deepEqual(authSettings(base),base);
 for(const config of [null,{...base,key:'sb_secret_1234567890'},{...base,key:'a.legacy.jwt'},{...base,url:'https://demo-project.supabase.co.test'},{...base,url:'http://demo-project.supabase.co'},{...base,redirect:'http://example.test/account.html'},{...base,redirect:'https://example.test/path/?destination=account.html'},{...base,redirect:'https://example.test/'+String.fromCharCode(97)}]) assert.equal(authSettings(config),null);
});
