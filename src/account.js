import {authSettings} from './auth-config.js';

const $=id=>document.getElementById(id);
const report=message=>{$('account-status').textContent=message;};
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
  catch{report('Não foi possível concluir. Confira a conexão e tente novamente.');}
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
   report('Escolha uma nova senha para a sua conta.');
  }else if(event==='SIGNED_IN'||event==='SIGNED_OUT'||event==='INITIAL_SESSION'){
   if(event==='SIGNED_OUT')recovering=false;
   render(session?.user);
  }
 });
 const {data:{user}}=await client.auth.getUser();
 if(!recovering){
  render(user);
  report(user?'Você está conectado.':'Entre, crie uma conta ou continue jogando sem entrar.');
 }
 submit('sign-in',async form=>{
  const {error}=await client.auth.signInWithPassword({email:String(form.get('email')).trim(),password:String(form.get('password'))});
  report(error?'Não foi possível entrar. Confira e-mail, senha e confirmação da conta.':'Você está conectado.');
 });
 submit('sign-up',async form=>{
  const name=String(form.get('name')).trim();
  if(!name){report('Informe seu nome.');return;}
  const {error,data}=await client.auth.signUp({
   email:String(form.get('email')).trim(),password:String(form.get('password')),
   options:{emailRedirectTo:config.redirect,data:{display_name:name}}
  });
  report(!error&&data.session?'Você está conectado.':'Se a criação for possível, você receberá um e-mail de confirmação.');
 });
 submit('request-reset',async form=>{
  await client.auth.resetPasswordForEmail(String(form.get('email')).trim(),{redirectTo:config.redirect});
  report('Se o endereço estiver cadastrado, você receberá um link de recuperação.');
 });
 submit('new-password',async form=>{
  if(!recovering)return;
  const {error,data}=await client.auth.updateUser({password:String(form.get('password'))});
  if(error){report('Não foi possível alterar a senha. Solicite um novo link de recuperação.');return;}
  recovering=false;render(data.user);report('Senha alterada.');
 });
 $('sign-out').addEventListener('click',async()=>{
  try{
   const {error}=await client.auth.signOut({scope:'local'});
   report(error?'Não foi possível sair. Tente novamente.':'Você saiu da conta neste navegador.');
  }catch{report('Não foi possível sair. Tente novamente.');}
 });
}
start().catch(()=>report('O serviço de conta não está disponível nesta versão. Você pode jogar sem conta.'));
