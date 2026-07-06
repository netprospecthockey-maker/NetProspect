import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root=path.dirname(fileURLToPath(import.meta.url));
const outDir=path.join(root,'assets','draft2026-ep');
const coverageUrl='https://r.jina.ai/http://www.eliteprospects.com/nhl-entry-draft-coverage';
const slug=value=>String(value).normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
const pause=ms=>new Promise(resolve=>setTimeout(resolve,ms));

async function textWithRetry(url,browser=false){
  for(let attempt=1;attempt<=4;attempt++){
    try{
      const headers={Accept:'text/plain'};
      if(browser){headers['X-Engine']='browser';headers['X-Wait-For-Selector']='img';}
      const response=await fetch(url,{headers});
      if(response.ok)return response.text();
      if(attempt===4)throw new Error(`${response.status} ${url}`);
    }catch(error){if(attempt===4)throw error;}
    await pause(attempt*2000);
  }
}

await fs.mkdir(outDir,{recursive:true});
const coverage=await textWithRetry(coverageUrl);
const players=[];
for(const line of coverage.split('\n')){
  const row=line.match(/^\| (\d+) \|/);
  const profile=line.match(/\]\((https:\/\/www\.eliteprospects\.com\/player\/\d+\/[^)]+)\)/);
  if(row&&profile)players.push({pick:Number(row[1]),profile:profile[1]});
}

const photosByPick={},profilesByPick={};
for(const file of await fs.readdir(outDir)){
  const pick=file.match(/^(\d+)-/)?.[1];
  if(pick)photosByPick[Number(pick)]=`assets/draft2026-ep/${file}`;
}
const pending=players.filter(player=>!photosByPick[player.pick]);
let cursor=0,found=Object.keys(photosByPick).length,processed=0;
async function saveMapping(){
  await fs.writeFile(path.join(root,'draft2026Headshots.js'),`const DRAFT_2026_HEADSHOTS={};\nconst DRAFT_2026_HEADSHOTS_BY_PICK=${JSON.stringify(photosByPick)};\nconst DRAFT_2026_PROFILES_BY_PICK=${JSON.stringify(profilesByPick)};\n`);
}
async function worker(){
  while(cursor<pending.length){
    const player=pending[cursor++];
    try{
      const page=await textWithRetry(`https://r.jina.ai/http://${player.profile.replace(/^https?:\/\//,'')}`,true);
      const title=page.match(/^Title:\s*(.+?)\s+-\s+Stats,/m)?.[1]||player.profile.split('/').pop().replace(/-/g,' ');
      const image=page.match(/!\[Image \d+:[^\]]*\]\((https?:\/\/files\.eliteprospects\.com\/layout\/players\/.+?\.(?:jpe?g|png|webp))\)/i)?.[1];
      const credit=page.match(/^© Photo:\s*(.+)$/m)?.[1]?.trim()||'Elite Prospects profile';
      profilesByPick[player.pick]={url:player.profile,credit};
      if(!image||/(default|noimage|silhouette)/i.test(image))continue;
      const imageResponse=await fetch(image);
      if(!imageResponse.ok||!String(imageResponse.headers.get('content-type')).startsWith('image/'))continue;
      const ext=(new URL(image).pathname.match(/\.(jpe?g|png|webp)$/i)?.[1]||'jpg').toLowerCase();
      const file=`${String(player.pick).padStart(3,'0')}-${slug(title)}.${ext}`;
      await fs.writeFile(path.join(outDir,file),Buffer.from(await imageResponse.arrayBuffer()));
      photosByPick[player.pick]=`assets/draft2026-ep/${file}`;
      found++;
    }catch(error){
      console.warn(`Pick ${player.pick}: ${error.message}`);
    }finally{
      processed++;
      if(processed%12===0){await saveMapping();console.log(`Processed ${processed}/${pending.length}; ${found} photos saved.`);}
      await pause(650);
    }
  }
}

for(const player of players)profilesByPick[player.pick]={url:player.profile,credit:'Elite Prospects profile'};
await Promise.all(Array.from({length:2},worker));
await saveMapping();
console.log(`Saved ${found} real Elite Prospects photos for ${players.length} drafted players.`);
