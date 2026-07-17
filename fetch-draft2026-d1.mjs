import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const root=path.dirname(fileURLToPath(import.meta.url));
const season='2024-25';
const outFile=path.join(root,'draft2026D1.js');
const cacheDir=path.join(root,'.cache-draft2026-d1');
const cacheOnly=process.argv.includes('--cache-only');
const refresh=process.argv.includes('--refresh');
const picksArg=process.argv.find(arg=>arg.startsWith('--picks='));
const onlyPicks=picksArg?new Set(picksArg.slice(8).split(',').map(value=>Number(value.trim())).filter(Number.isFinite)):null;

const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));
const clean=s=>String(s??'').replace(/\*\*/g,'').replace(/!\[[^\]]*]\([^)]*\)/g,'').replace(/\[([^\]]+)]\([^)]*\)/g,'$1').replace(/&amp;/g,'&').replace(/\s+/g,' ').trim();
const num=s=>{const v=clean(s);return v===''||v==='-'?'' : Number(v);};
const loadConst=(file,name)=>{
  let source=fs.readFile(file,'utf8');
  return source.then(text=>{
    text=text.replace(new RegExp(`const\\s+${name}\\s*=`),`globalThis.${name}=`);
    const ctx={};vm.createContext(ctx);vm.runInContext(text,ctx);return ctx[name];
  });
};
async function loadExistingD1(){
  try{
    let text=await fs.readFile(outFile,'utf8');
    const ctx={};vm.createContext(ctx);
    text=text.replace('const DRAFT_2026_D1_DATA=','globalThis.DRAFT_2026_D1_DATA=').replace('const DRAFT_2026_D1_MISSING=','globalThis.DRAFT_2026_D1_MISSING=');
    vm.runInContext(text,ctx);
    return {rows:Array.isArray(ctx.DRAFT_2026_D1_DATA)?ctx.DRAFT_2026_D1_DATA:[],missing:Array.isArray(ctx.DRAFT_2026_D1_MISSING)?ctx.DRAFT_2026_D1_MISSING:[]};
  }catch{return {rows:[],missing:[]};}
}
const profileSlug=url=>url.replace(/^https?:\/\//,'').replace(/[^a-z0-9]+/gi,'-').replace(/^-|-$/g,'').toLowerCase();
async function fetchText(url){
  await fs.mkdir(cacheDir,{recursive:true});
  const cache=path.join(cacheDir,profileSlug(url)+'.md');
  if(!refresh){try{return await fs.readFile(cache,'utf8');}catch{}}
  if(cacheOnly)throw new Error('Not cached yet');
  const jina=`https://r.jina.ai/http://${url.replace(/^https?:\/\//,'')}`;
  for(let attempt=1;attempt<=4;attempt++){
    try{
      const response=await fetch(jina,{headers:{'User-Agent':'NetProspect D-1 stats loader'}});
      if(response.status===429)throw new Error('429 Too Many Requests');
      if(!response.ok)throw new Error(`${response.status} ${response.statusText}`);
      const text=await response.text();
      await fs.writeFile(cache,text);
      return text;
    }catch(error){
      if(attempt===4)throw error;
      await sleep(error.message.includes('429')?8000*attempt:1200*attempt);
    }
  }
}
function statRowsFromMarkdown(markdown,isGoalie=false,tableIndex=0){
  const rows=[];
  let inStatsTable=false;
  let statsTableCount=0;
  let currentSeason='';
  for(const rawLine of markdown.split('\n')){
    const line=rawLine.trim();
    if(line.startsWith('Regular Season + Postseason')){
      if(inStatsTable)break;
      if(statsTableCount===tableIndex)inStatsTable=true;
      statsTableCount++;
      continue;
    }
    if(!inStatsTable)continue;
    if(line==='Paid Feature'||line==='Position'||line==='Premium Feature'||line.startsWith('2025-2026'))break;
    if(!line.startsWith('|'))continue;
    const cells=line.split('|').slice(1,-1).map(cell=>cell.trim());
    if(cells.length<9)continue;
    const first=clean(cells[0]);
    if(first==='S'||first==='League'||first.includes('---'))continue;
    if(/^\d{4}-\d{2}$/.test(first)){
      if(currentSeason===season&&first!==season)break;
      currentSeason=first;
    }
    else if(first!=='')continue;
    if(currentSeason!==season)continue;
    const team=clean(cells[1]).replace(/"(?:A|C)"$/,''),league=clean(cells[2]);
    if(!team||!league||team==='Team'||league==='League'||team.includes('---')||/^\d+(\.\d+)?$/.test(team)||/^\d+(\.\d+)?$/.test(league))continue;
    const games=num(cells[3]);
    rows.push(isGoalie?{
      season,
      team,
      league,
      games,
      goals:'',
      assists:'',
      points:'',
      gaa:num(cells[4]),
      svPct:num(cells[5]),
      shutouts:num(cells[6]),
      record:clean(cells[7]),
      playoffGames:num(cells[9]),
      playoffGaa:num(cells[10]),
      playoffSvPct:num(cells[11]),
      playoffShutouts:num(cells[12])
    }:{
      season,
      team,
      league,
      games,
      goals:num(cells[4]),
      assists:num(cells[5]),
      points:num(cells[6]),
      pim:num(cells[7]),
      plusMinus:clean(cells[8]),
      playoffGames:num(cells[10]),
      playoffGoals:num(cells[11]),
      playoffAssists:num(cells[12]),
      playoffPoints:num(cells[13])
    });
  }
  return rows;
}
function usableRows(rows){
  return rows.filter(row=>['games','goals','assists','points','gaa','svPct'].some(key=>Number(row[key])>0));
}
function isNationalTeam(row){
  return /\b(all)\b/i.test(row.team)||/(Canada|USA|Sweden|Finland|Czechia|Russia|Slovakia|Latvia|Denmark|Germany|Norway|Switzerland|Belarus|Hungary|Lithuania|Moldova)\s+U\d+/i.test(row.team)||/WJC|WHC|Hlinka|International/i.test(row.league);
}
function aggregate(rows,player){
  const allValid=usableRows(rows);
  const clubValid=allValid.filter(row=>!isNationalTeam(row));
  const valid=clubValid.length?clubValid:allValid;
  if(!valid.length)return null;
  const sum=k=>valid.reduce((total,row)=>total+(Number.isFinite(Number(row[k]))?Number(row[k]):0),0);
  const unique=k=>[...new Set(valid.map(row=>row[k]).filter(Boolean))];
  const logoLine=valid.slice().sort((a,b)=>Number(b.games||0)-Number(a.games||0)).find(row=>row.team&&!isNationalTeam(row))||valid.find(row=>row.team)||{};
  const games=sum('games'),isGoalie=player.position==='G';
  if(isGoalie){
    const weighted=k=>games?valid.reduce((total,row)=>total+(Number.isFinite(Number(row[k]))?Number(row[k])*Number(row.games||0):0),0)/games:'';
    return {
      pick:player.pick,
      player:player.player,
      season,
      team:unique('team').join(' / '),
      logoTeam:logoLine.team||'',
      league:unique('league').join(' / '),
      games,
      goals:'',
      assists:'',
      points:'',
      ppg:'',
      gaa:games?Number(weighted('gaa').toFixed(2)):'',
      svPct:games?Number(weighted('svPct').toFixed(3)):'',
      lines:valid
    };
  }
  const goals=sum('goals'),assists=sum('assists'),points=sum('points');
  return {
    pick:player.pick,
    player:player.player,
    season,
    team:unique('team').join(' / '),
    logoTeam:logoLine.team||'',
    league:unique('league').join(' / '),
    games,
    goals,
    assists,
    points,
    ppg:games?Number((points/games).toFixed(2)):'',
    gaa:'',
    svPct:'',
    lines:valid
  };
}
async function main(){
  const data=await loadConst(path.join(root,'draft2026.js'),'DRAFT_2026_DATA');
  const heads=await loadConst(path.join(root,'draft2026Headshots.js'),'DRAFT_2026_PROFILES_BY_PICK');
  const players=data.filter(player=>player.player&&!/^No selection/i.test(player.player)&&heads[player.pick]?.url&&(!onlyPicks||onlyPicks.has(player.pick)));
  const results=[];
  const failures=[];
  let index=0;
  async function worker(){
    while(index<players.length){
      const player=players[index++];
      try{
        const markdown=await fetchText(heads[player.pick].url);
        let rows=statRowsFromMarkdown(markdown,player.position==='G',0);
        if(!usableRows(rows).length)rows=statRowsFromMarkdown(markdown,player.position==='G',1);
        const aggregated=aggregate(rows,player);
        if(aggregated)results.push(aggregated);
        else failures.push({pick:player.pick,player:player.player,reason:'No 2024-25 row found'});
        console.log(`${player.pick}. ${player.player}: ${aggregated?'ok':'missing'}`);
      }catch(error){
        failures.push({pick:player.pick,player:player.player,reason:error.message});
        console.log(`${player.pick}. ${player.player}: error ${error.message}`);
      }
      if(!cacheOnly)await sleep(1400);
    }
  }
  const concurrency=Number(process.env.D1_CONCURRENCY||1);
  await Promise.all(Array.from({length:concurrency},worker));
  let outputRows=results,outputFailures=failures;
  if(onlyPicks){
    const existing=await loadExistingD1();
    outputRows=[...existing.rows.filter(row=>!onlyPicks.has(row.pick)),...results];
    outputFailures=[...existing.missing.filter(row=>!onlyPicks.has(row.pick)),...failures];
  }
  outputRows.sort((a,b)=>a.pick-b.pick);
  outputFailures.sort((a,b)=>a.pick-b.pick);
  await fs.writeFile(outFile,`const DRAFT_2026_D1_DATA=${JSON.stringify(outputRows)};\nconst DRAFT_2026_D1_MISSING=${JSON.stringify(outputFailures)};\n`);
  console.log(`Wrote ${outputRows.length} D-1 rows to ${path.relative(root,outFile)} (${outputFailures.length} missing).`);
}
main().catch(error=>{console.error(error);process.exit(1);});
