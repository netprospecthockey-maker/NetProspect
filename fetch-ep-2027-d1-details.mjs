import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const source = await fs.readFile(path.join(root,'prospectOverrides.js'),'utf8');
const cacheDir = path.join(root,'.cache-ep-2027-d1');
const photoDir = path.join(root,'assets','prospects','ep-2027-d1');
const logoDir = path.join(root,'assets','teams','ep-2027-u18');
const output = path.join(root,'ep2027D1Details.js');
const refresh = process.argv.includes('--refresh');
const rows = [...source.matchAll(/\['([^']+)','([^']+)','([^']+)','([^']+)',\d+,\d+,\d+,\d+,[\d.]+,'(https:\/\/www\.eliteprospects\.com\/player\/\d+\/[^']+)'\]/g)]
  .map(([,name,team,pos,country,url])=>({name,team,pos,country,url}));
rows.push(
  {name:'Nathaniel Chizik',team:'U.S. National U18 Team',pos:'G',country:'USA',url:'https://www.eliteprospects.com/player/935455/nathaniel-chizik'},
  {name:'Ben Geiger',team:'U.S. National U18 Team',pos:'D',country:'USA',url:'https://www.eliteprospects.com/player/690042/ben-geiger'},
  {name:'Braden Horton',team:'U.S. National U18 Team',pos:'F',country:'USA',url:'https://www.eliteprospects.com/player/701434/braden-horton'},
  {name:'Freddie Schneider',team:'U.S. National U18 Team',pos:'F',country:'USA',url:'https://www.eliteprospects.com/player/951202/freddie-schneider'}
);
const slug = value => String(value).normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
const esc = value => value.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
const wait = ms => new Promise(resolve=>setTimeout(resolve,ms));
const extFor = url => new URL(url).pathname.match(/\.(jpe?g|png|webp)$/i)?.[1]?.toLowerCase()||'png';
await Promise.all([cacheDir,photoDir,logoDir].map(dir=>fs.mkdir(dir,{recursive:true})));

async function fetchText(player){
  const file=path.join(cacheDir,`${slug(player.name)}.md`);
  if(!refresh){try{return await fs.readFile(file,'utf8');}catch{}}
  for(let attempt=1;attempt<=4;attempt++){
    try{
      const response=await fetch(`https://r.jina.ai/http://${player.url.replace(/^https?:\/\//,'')}`,{headers:{'X-Engine':'browser','X-Wait-For-Selector':'img'}});
      if(!response.ok)throw new Error(`HTTP ${response.status}`);
      const text=await response.text();await fs.writeFile(file,text);return text;
    }catch(error){if(attempt===4)throw error;await wait(attempt*1500);}
  }
}
async function saveAsset(url,dir,name){
  const ext=extFor(url),file=path.join(dir,`${slug(name)}.${ext}`);
  try{await fs.access(file);return `${path.relative(root,file)}`;}catch{}
  const response=await fetch(url);if(!response.ok)throw new Error(`asset HTTP ${response.status}`);
  await fs.writeFile(file,Buffer.from(await response.arrayBuffer()));return path.relative(root,file);
}
const details={},logos={};let cursor=0;
async function worker(){
  while(cursor<rows.length){
    const player=rows[cursor++];
    try{
      const page=await fetchText(player);
      const dob=page.match(/^Date of Birth\[([^\]]+)\]/m)?.[1]||'';
      const birthplace=page.match(/^Place of Birth\[([^\]]+)\]/m)?.[1]||'';
      const heightRaw=page.match(/^Height\s+(.+)$/m)?.[1]?.trim()||'';
      const weightRaw=page.match(/^Weight\s+(.+)$/m)?.[1]?.trim()||'';
      const shot=page.match(/^Shoots\s+([LR])\s*$/m)?.[1]||'';
      const height=(heightRaw.split('/')[1]||heightRaw).trim();
      const weight=(weightRaw.split('/')[1]||weightRaw).trim().replace(/\s*lbs?$/i,'lbs');
      const photoUrl=page.match(new RegExp(`!\\[Image \\d+: ${esc(player.name)}\\]\\((https?:\\/\\/files\\.eliteprospects\\.com\\/layout\\/players\\/.+?\\.(?:jpe?g|png|webp))\\)`,'i'))?.[1]||'';
      const logoUrl=page.match(new RegExp(`!\\[Image \\d+: ${esc(player.team)}\\]\\((https?:\\/\\/files\\.eliteprospects\\.com\\/layout\\/logos\\/.+?\\.(?:jpe?g|png|webp|gif))\\)`,'i'))?.[1]||'';
      let headshot='';if(photoUrl&&!/(default|noimage|silhouette)/i.test(photoUrl))headshot=await saveAsset(photoUrl,photoDir,player.name);
      if(logoUrl&&!logos[player.team])logos[player.team]=await saveAsset(logoUrl.replace(/_(?:small|medium)\./,'_large.'),logoDir,player.team);
      details[player.name]={height,weight,shot,dob,birthplace,headshot};
      console.log(`${player.name}: ${height||'-'}, ${weight||'-'}, ${shot||'-'}, ${headshot?'photo':'no photo'}`);
    }catch(error){console.warn(`${player.name}: ${error.message}`);}
    await wait(350);
  }
}
await Promise.all([worker(),worker(),worker()]);
await fs.writeFile(output,`const EP_2027_D1_DETAILS=${JSON.stringify(details)};\nconst EP_2027_D1_TEAM_LOGOS=${JSON.stringify(logos)};\n`);
console.log(`Wrote ${Object.keys(details).length} profiles and ${Object.keys(logos).length} team logos.`);
