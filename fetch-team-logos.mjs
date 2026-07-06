import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root=path.dirname(fileURLToPath(import.meta.url));
const source=fs.readFileSync(path.join(root,'app.js'),'utf8');
const outDir=path.join(root,'assets','teams');
fs.mkdirSync(outDir,{recursive:true});
const slug=name=>name.normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
const matches=[...source.matchAll(/(['"])(.*?)\1\s*:\s*(['"])(https:\/\/content\.sportslogos\.net\/.*?\.(gif|png))\3/g)].map(m=>[m[0],m[2],m[4],m[5]]);
if(process.argv.includes('--list')){
  console.log(JSON.stringify(matches.map(([,team,url,ext])=>({team,url,file:path.join(outDir,`${slug(team)}.${ext}`)}))));
  process.exit(0);
}
let saved=0;
for(const [,team,url,ext] of matches){
  const file=path.join(outDir,`${slug(team)}.${ext}`);
  if(fs.existsSync(file)&&fs.statSync(file).size>100)continue;
  const result=spawnSync('curl',['-k','-L','--fail','--silent','--show-error',url,'-o',file],{stdio:'inherit'});
  if(result.status!==0){try{fs.unlinkSync(file);}catch{};throw new Error(`Could not download ${team}`);}
  saved++;
}
console.log(`Verified ${matches.length} SportsLogos club crests; downloaded ${saved}.`);
