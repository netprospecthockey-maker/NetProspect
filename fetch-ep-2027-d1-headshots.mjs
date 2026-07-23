import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const source = await fs.readFile(path.join(root, 'prospectOverrides.js'), 'utf8');
const outDir = path.join(root, 'assets', 'prospects', 'ep-2027-d1');
const profiles = [...source.matchAll(/\['([^']+)'[^\n]+?'(https:\/\/www\.eliteprospects\.com\/player\/\d+\/[^']+)'\]/g)]
  .map(([,name,url]) => ({name,url}));
const slug = value => value.normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

await fs.mkdir(outDir, {recursive:true});
let cursor = 0;
async function worker(){
  while(cursor < profiles.length){
    const player = profiles[cursor++];
    try{
      const pageResponse = await fetch(`https://r.jina.ai/http://${player.url.replace(/^https?:\/\//,'')}`, {headers:{'X-Engine':'browser','X-Wait-For-Selector':'img'}});
      if(!pageResponse.ok) throw new Error(`profile ${pageResponse.status}`);
      const page = await pageResponse.text();
      const image = page.match(/!\[Image \d+:[^\]]*\]\((https?:\/\/files\.eliteprospects\.com\/layout\/players\/.+?\.(?:jpe?g|png|webp))\)/i)?.[1];
      if(!image || /(default|noimage|silhouette)/i.test(image)) throw new Error('no EP player image');
      const imageResponse = await fetch(image);
      if(!imageResponse.ok || !String(imageResponse.headers.get('content-type')).startsWith('image/')) throw new Error(`image ${imageResponse.status}`);
      const ext = new URL(image).pathname.match(/\.(jpe?g|png|webp)$/i)?.[1]?.toLowerCase() || 'jpg';
      await fs.writeFile(path.join(outDir, `${slug(player.name)}.${ext}`), Buffer.from(await imageResponse.arrayBuffer()));
      console.log(`${player.name}: saved`);
    } catch(error){
      console.log(`${player.name}: ${error.message}`);
    }
    await wait(500);
  }
}
await Promise.all([worker(), worker()]);
