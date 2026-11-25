const { app, BrowserWindow, protocol, session, net } = require('electron');
const { resolve } = require('node:path');
const { pathToFileURL } = require('node:url');

const local = 'orbis://game';
const www = resolve(__dirname, 'www');
const smoke = process.argv.includes('--orbis-smoke');
protocol.registerSchemesAsPrivileged([{
 scheme:'orbis',
 privileges:{standard:true,secure:true,supportFetchAPI:true,allowServiceWorkers:true,codeCache:true}
}]);
function permit(url) {
 try{
  const target=new URL(url);
  return target.protocol==='orbis:'&&target.host==='game'&&!target.username&&!target.password;
 }catch{return false;}
}
function windowForGame(){
 const win=new BrowserWindow({
  width:1000,height:820,minWidth:340,minHeight:450,show:!smoke,
  autoHideMenuBar:true,title:'Puzzle Orbis',icon:resolve(www,'icons/icon-192.png'),
  webPreferences:{contextIsolation:true,nodeIntegration:false,sandbox:true,webSecurity:true}
 });
 win.webContents.setWindowOpenHandler(()=>({action:'deny'}));
 win.webContents.on('will-navigate',(event,target)=>{if(!permit(target))event.preventDefault();});
 return win;
}
app.whenReady().then(async()=>{
 session.defaultSession.setPermissionRequestHandler((_wc,_permission,callback)=>callback(false));
 session.defaultSession.setPermissionCheckHandler(()=>false);
 protocol.handle('orbis',async request=>{
  if(!permit(request.url)||request.method!=='GET')return new Response(null,{status:403});
  const path=new URL(request.url).pathname;
  const asset=path==='/'?'index.html':path.slice(1);
  if(!/^(?:index\.html|multi\.(?:html|css)|sw\.js|manifest\.webmanifest|src\/[a-z0-9-]+\.js|icons\/[a-z0-9-]+\.png)$/.test(asset))return new Response(null,{status:404});
  try{return await net.fetch(pathToFileURL(resolve(www,asset)).toString());}
  catch{return new Response(null,{status:404});}
 });
 const win=windowForGame();
 await win.loadURL(local+'/');
 if(smoke){
  const timeout=setTimeout(()=>app.exit(1),15000);
  try{
   const levels=await win.webContents.executeJavaScript("document.querySelector('#level')?.options.length");
   if(levels!==10)throw Error('Expected ten single-image levels');
   await win.loadURL(local+'/multi.html');
   const multi=await win.webContents.executeJavaScript("document.querySelector('#multi-level')?.options.length");
   if(multi!==10)throw Error('Expected ten multi-image levels');
   console.log('Puzzle Orbis native smoke: both tabs initialized');
   clearTimeout(timeout);app.exit(0);
  }catch(err){console.error(err);clearTimeout(timeout);app.exit(1);}
 }
}).catch(err=>{console.error(err);app.exit(1);});
app.on('window-all-closed',()=>app.quit());
