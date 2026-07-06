import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root=path.dirname(fileURLToPath(import.meta.url));
const outDir=path.join(root,'assets','draft2026');
const recordsUrl='https://records.nhl.com/site/api/draft?cayenneExp=draftYear=2026&limit=500';
const slug=value=>String(value).normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');

await fs.mkdir(outDir,{recursive:true});
const response=await fetch(recordsUrl);
if(!response.ok)throw new Error(`NHL draft records request failed: ${response.status}`);
const records=(await response.json()).data||[];
const results=new Array(records.length);
let cursor=0;

async function worker(){
  while(cursor<records.length){
    const index=cursor++;
    const player=records[index];
    const file=`${slug(player.playerName)}.png`;
    const destination=path.join(outDir,file);
    const teams=[player.triCode,'NHL'].filter(Boolean);
    let saved=false;
    for(const team of teams){
      const url=`https://assets.nhle.com/mugs/nhl/20252026/${team}/${player.playerId}.png`;
      const image=await fetch(url);
      if(!image.ok||!String(image.headers.get('content-type')).startsWith('image/'))continue;
      await fs.writeFile(destination,Buffer.from(await image.arrayBuffer()));
      saved=true;
      break;
    }
    if(saved)results[index]=[player.playerName,`assets/draft2026/${file}`];
  }
}

await Promise.all(Array.from({length:12},worker));
const mapping=Object.fromEntries(results.filter(Boolean));
const byPick=Object.fromEntries(records.map(player=>[player.overallPickNumber,mapping[player.playerName]]).filter(([,source])=>source));
await fs.writeFile(path.join(root,'draft2026Headshots.js'),`const DRAFT_2026_HEADSHOTS=${JSON.stringify(mapping)};\nconst DRAFT_2026_HEADSHOTS_BY_PICK=${JSON.stringify(byPick)};\n`);
console.log(`Saved ${Object.keys(mapping).length} of ${records.length} official NHL draft headshots.`);
