import {authSettings} from './auth-config.js';
import {direction,languageTag,savedLocale} from './i18n.js';
import {accountLocale} from './account-locales.js';

const $=id=>document.getElementById(id);
let locale;
try{locale=languageTag(savedLocale(window.localStorage));}catch{locale='pt-BR';}
const copy=accountLocale(locale);
document.documentElement.lang=locale;
document.documentElement.dir=direction(locale);
document.title=copy.account;
for(const item of document.querySelectorAll('[data-account-text]'))item.textContent=copy[item.dataset.accountText];
const report=key=>{$('account-status').textContent=copy[key];};
let client, recovering=false;
const locationForRedirect=new URL(location.pathname,location.origin).href;

function render(user){
 $('new-password').hidden=!recovering;
 $('account-forms').hidden=Boolean(user)||recovering;
 $('account-signed-in').hidden=!user||recovering;
 $('account-identity').textContent=user?.email??'';
}
async function submit(formId,action){
 $(formId).addEventListener('submit',async event=>{
  event.preventDefault();
  const form=event.currentTarget, button=form.querySelector('button[type="submit"]');
  if(button.disabled)return;
  button.disabled=true;
  try{await action(new FormData(form));form.reset();}
  catch{report('failed');}
  finally{button.disabled=false;}
 });
}
async function start(){
 const response=await fetch('./src/orbis-public-auth.json',{cache:'no-store'});
 if(!response.ok)throw Error('Auth not configured');
 const config=authSettings(await response.json());
 if(!config||config.redirect!==locationForRedirect)throw Error('Auth not configured for this deployment');
 const {createClient}=await import('./supabase-client.js');
 client=createClient(config.url,config.key,{auth:{flowType:'pkce',persistSession:true,autoRefreshToken:true,detectSessionInUrl:true,storageKey:'puzzle-orbis-auth-v1'}});
 client.auth.onAuthStateChange((event,session)=>{
  if(event==='PASSWORD_RECOVERY'){
   recovering=true;
   render(session?.user);
   report('choose');
  }else if(event==='SIGNED_IN'||event==='SIGNED_OUT'||event==='INITIAL_SESSION'){
   if(event==='SIGNED_OUT')recovering=false;
   render(session?.user);
  }
 });
 const {data:{user}}=await client.auth.getUser();
 if(!recovering){
  render(user);
  report(user?'connected':'start');
 }
 submit('sign-in',async form=>{
  const {error}=await client.auth.signInWithPassword({email:String(form.get('email')).trim(),password:String(form.get('password'))});
  report(error?'signInFailed':'connected');
 });
 submit('sign-up',async form=>{
  const name=String(form.get('name')).trim();
  if(!name){report('enterName');return;}
  const {error,data}=await client.auth.signUp({
   email:String(form.get('email')).trim(),password:String(form.get('password')),
   options:{emailRedirectTo:config.redirect,data:{display_name:name}}
  });
  report(!error&&data.session?'connected':'confirm');
 });
 submit('request-reset',async form=>{
  await client.auth.resetPasswordForEmail(String(form.get('email')).trim(),{redirectTo:config.redirect});
  report('reset');
 });
 submit('new-password',async form=>{
  if(!recovering)return;
  const {error,data}=await client.auth.updateUser({password:String(form.get('password'))});
  if(error){report('resetFailed');return;}
  recovering=false;render(data.user);report('changed');
 });
 $('sign-out').addEventListener('click',async()=>{
  try{
   const {error}=await client.auth.signOut({scope:'local'});
   report(error?'failed':'out');
  }catch{report('failed');}
 });
}
start().catch(()=>report('unavailable'));
