function https(value) {
 try{
  const url=new URL(value);
  return url.protocol==='https:'&&!url.username&&!url.password&&!url.search&&!url.hash?url:null;
 }catch{return null;}
}
export function authSettings(input) {
 const url=https(input?.url), redirect=https(input?.redirect);
 if(!url||url.pathname!=='/'||!url.hostname.endsWith('.supabase.co')||
    !redirect||!redirect.pathname.endsWith('/account.html')||
    !/^sb_publishable_[a-zA-Z0-9_-]{12,}$/.test(input?.key??''))return null;
 return {url:url.origin,key:input.key,redirect:redirect.href};
}
