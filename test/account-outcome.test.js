import test from 'node:test';
import assert from 'node:assert/strict';
import {accountOutcome} from '../src/account-outcome.js';
import {accountLocale} from '../src/account-locales.js';
import {LANGUAGE_TAGS} from '../src/i18n.js';
test('signup session and confirmation',()=>{
 assert.equal(accountOutcome('signup',{data:{session:{}}}),'connected');
 assert.equal(accountOutcome('signup',{data:{session:null}}),'confirm');
});
test('account-specific errors preserve generic responses',()=>{
 for(const code of ['user_already_exists','email_exists','user_not_found','over_email_send_rate_limit','unknown']){
  assert.equal(accountOutcome('signup',{error:{code,message:'private'}}),'confirm');
  assert.equal(accountOutcome('reset',{error:{code,message:'private'}}),'reset');
 }
 assert.equal(accountOutcome('reset',{data:{}}),'reset');
});
test('safe operational failures use localized keys',()=>{
 for(const operation of ['signup','reset']){
  assert.equal(accountOutcome(operation,{error:{code:'over_request_rate_limit'}}),'retryLater');
  assert.equal(accountOutcome(operation,{error:{name:'AuthRetryableFetchError'}}),'failed');
  assert.equal(accountOutcome(operation,{error:{code:'email_provider_disabled'}}),'failed');
 }
 assert.equal(accountOutcome('signup',{error:{code:'unexpected_failure'}}),'failed');
 assert.equal(LANGUAGE_TAGS.length,15);
 for(const tag of LANGUAGE_TAGS)for(const key of ['failed','retryLater','confirm','reset'])assert.ok(accountLocale(tag)[key]?.trim());
});
