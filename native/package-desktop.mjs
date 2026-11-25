import { packager } from '@electron/packager';
import { cp, mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here=dirname(fileURLToPath(import.meta.url));
const stage=join(here,'desktop-stage');
await mkdir(stage,{recursive:true});
await cp(join(here,'desktop.cjs'),join(stage,'desktop.cjs'));
await cp(join(here,'www'),join(stage,'www'),{recursive:true});
await writeFile(join(stage,'package.json'),JSON.stringify({
 name:'puzzle-orbis',description:'Puzzle Orbis',productName:'Puzzle Orbis',version:'0.1.0',main:'desktop.cjs'
}));
const outputs=await packager({
 dir:stage,out:join(here,'dist'),name:'puzzle-orbis',executableName:'puzzle-orbis',
 electronVersion:'45.5.0',platform:process.platform,arch:'x64',asar:true,overwrite:true
});
console.log(outputs.join('\n'));
