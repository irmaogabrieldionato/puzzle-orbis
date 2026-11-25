import { build } from 'esbuild';
import { fileURLToPath } from 'node:url';
import { readFile, writeFile } from 'node:fs/promises';
import { authSettings } from '../src/auth-config.js';

const settings=authSettings({
 url:process.env.ORBIS_SUPABASE_URL,
 key:process.env.ORBIS_SUPABASE_PUBLISHABLE_KEY,
 redirect:process.env.ORBIS_AUTH_REDIRECT_URL
});
if(!settings)throw Error('Set a HTTPS Supabase URL, sb_publishable_ key and the public account HTTPS redirect.');
await build({
 stdin:{contents:"export {createClient} from '@supabase/supabase-js';",resolveDir:fileURLToPath(new URL('.',import.meta.url)),sourcefile:'orbis-auth-entry.js'},
 outfile:'www/src/supabase-client.js',bundle:true,format:'esm',platform:'browser',minify:true,target:'es2022',legalComments:'external'
});
await writeFile('www/src/orbis-public-auth.json',JSON.stringify(settings));

for(const page of ['index.html','multi.html']){
 const path='www/'+page, html=await readFile(path,'utf8');
 await writeFile(path,html.replace('<main>','<main><p><a style="color:#bae6fd" href="./account.html" lang="pt-BR">Conta Puzzle Orbis</a></p>'));
}
