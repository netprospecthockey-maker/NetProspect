const WEIGHTS = {
  F:{skating:.20, shooting:.20, iq:.18, ozone:.22, dzone:.10, phys:.10},
  D:{skating:.20, shooting:.10, iq:.20, ozone:.18, dzone:.20, phys:.12},
  G:{skating:.18, shooting:.20, iq:.18, ozone:.10, dzone:.22, phys:.12}
};
const ATTRS = [
  ['skating','Skating','SK'], ['shooting','Shooting','SH'], ['iq','Hockey IQ','IQ'],
  ['ozone','Offensive Zone','OZ'], ['dzone','Defensive Zone','DZ'], ['phys','Physicality','PH']
];
const LBL=Object.fromEntries(ATTRS.map(([k,l])=>[k,l]));
const GOALIE_ATTR_LABELS={skating:'Movement',shooting:'Reflexes',iq:'Tracking & IQ',ozone:'Puck Handling',dzone:'Positioning',phys:'Athleticism'};
const ATTR_L=['skating','shooting','iq'], ATTR_R=['ozone','dzone','phys'];
const TIERS = [
  {name:'Allstar',min:89,color:'#EFD45B'},{name:'First Line',min:85,color:'#9BD18C'},
  {name:'Second Line',min:82,color:'#9FC3EC'},{name:'Third Line',min:80,color:'#F0A78F'},
  {name:'Fringe',min:0,color:'#CDD3DA'}
];
const FLAGS={canada:'🇨🇦',usa:'🇺🇸','united states':'🇺🇸',russia:'🇷🇺',sweden:'🇸🇪',finland:'🇫🇮',czechia:'🇨🇿',
  'czech republic':'🇨🇿',switzerland:'🇨🇭',germany:'🇩🇪',latvia:'🇱🇻',slovakia:'🇸🇰',denmark:'🇩🇰',norway:'🇳🇴',china:'🇨🇳',
  belarus:'🇧🇾',austria:'🇦🇹',france:'🇫🇷',slovenia:'🇸🇮',hungary:'🇭🇺',lithuania:'🇱🇹',moldova:'🇲🇩',
  kazakhstan:'🇰🇿',kazakstan:'🇰🇿'};
const COUNTRY_GROUPS={
  'Canada':['Landon Dupont','Jaxon Jacobson','Alexis Joseph','Dima Zhilkin','Brock Cripps','Boston Tait','Rhett Sather','James Scantlebury','Shaeffer Gordon-Carroll','Ryerson Edgar','Jaakko Wycisk','Charlie Murata','Kaden Mcgregor','Colt Carter','Matthew Henderson','Peter Green','Chase Surkan','Camryn Warren','Aden Bouchard','Brock Chitaroni','Eli McKamey','Brenner Lammens','Thomas Charbonneau','Kayden Stroeder','Blake Chorney','Prabh Bhathal','Nigel Boehm','Zack Arsenault','Luca Blonda'],
  'Russia':['Nazar Privalov','Sergei Skvortsov','Vladimir Shtyrkhunov','Andrei Pustovoy','Illarion Babkin','Yevgeni Yakunin','Daniil Yermolov','Daniil Savin','Arytom Mate','Artyom Mate','Artyom Frolov','Semyon Gerasimov','Daniyar Aibatov'],
  'USA':['Carter Meyer','Sammy Nelson','Levi Harper','Brock England','Noah Davidson','Jamie Glance','Nolan Fitzhenry','Diego Gutierrez','Gunnar Conboy','Rocco Pelosi','Easton Walos','Finnegan Sears','Braden Scuderi','Braiden Scuderi','Trevor Daley Jr.'],
  'Sweden':['Milan Sundström','Bosse Meijer','Oliver Sundberg','Douglas Johnsson','Dorian Eklund Aspe','Loui Karlsson','Wiggo Forsberg','Tom Bjurman','Olle Törnqvist'],
  'Finland':['Lenni Kokkonen','Luca Santala','Roni Kuukasjärvi','Max Syrjäläinen','Miska Liljeberg','Otto Joutsen','Luukas Kokkonen'],
  'Czechia':['Timothy Kazda','Petr Tomek','Lukas Kachlir','Stepan Stejskal','Michal Hartl','Dominick Byrtus','Jonas Vanicek','Adam Nemec'],
  'Slovakia':['Matus Valek','Tomas Selic','Filip Kovalcik','Oliver Botka'],
  'Germany':['Max Calce','Jack Peterka','Liron Pellizzari'],
  'Switzerland':['Jonah Neuenschwander'],'Latvia':['Robert Naudins'],
  'Canada / USA':['Kohyn Eshkawkogan'],'Canada / Russia':['Aleks Kulemin']
};
const COUNTRY_BY_PLAYER={}; Object.entries(COUNTRY_GROUPS).forEach(([country,names])=>names.forEach(name=>COUNTRY_BY_PLAYER[name]=country));
const SEED_COUNTRY_BY_PLAYER=Object.fromEntries(SEED_PLAYERS.filter(p=>p.country).map(p=>[p.name,p.country]));
const SEED_TEAM_BY_PLAYER=Object.fromEntries(SEED_PLAYERS.filter(p=>p.team).map(p=>[p.name,p.team]));
const NHL_TEAMS=["Anaheim Ducks","Boston Bruins","Buffalo Sabres","Calgary Flames","Carolina Hurricanes","Chicago Blackhawks",
  "Colorado Avalanche","Columbus Blue Jackets","Dallas Stars","Detroit Red Wings","Edmonton Oilers","Florida Panthers",
  "Los Angeles Kings","Minnesota Wild","Montréal Canadiens","Nashville Predators","New Jersey Devils","New York Islanders",
  "New York Rangers","Ottawa Senators","Philadelphia Flyers","Pittsburgh Penguins","San Jose Sharks","Seattle Kraken",
  "St. Louis Blues","Tampa Bay Lightning","Toronto Maple Leafs","Utah Hockey Club","Vancouver Canucks","Vegas Golden Knights",
  "Washington Capitals","Winnipeg Jets"];

const $=s=>document.querySelector(s), $$=s=>Array.from(document.querySelectorAll(s));
// Admin access comes only from the signed-in Firebase profile. New accounts are always members.
const isAdmin=()=>currentUser?.role==='admin';
function applyAccessControl(){
  $('#addBtn').hidden=!isAdmin();
  const review=$('#adminReview');if(review)review.hidden=!isAdmin();
  document.body.classList.toggle('read-only',!isAdmin());
}
const esc=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const positionTokens=pos=>String(pos||'').toUpperCase().split(/\s*[/,|-]\s*/).map(v=>v.trim()).filter(Boolean).map(v=>v==='LD'||v==='RD'?'D':v);
const isD=pos=>positionTokens(pos).includes('D');
const isGoalie=p=>positionTokens(p?.pos).includes('G');
function overall(p){ const w=isGoalie(p)?WEIGHTS.G:isD(p.pos)?WEIGHTS.D:WEIGHTS.F; let s=0;
  for(const [k] of ATTRS) s+=(w[k]||0)*(Number(p[k])||0); return Math.round(s*10)/10; }
const tierOf=o=>TIERS.find(t=>o>=t.min)||TIERS[TIERS.length-1];
const flagFor=c=>String(c||'').split(/\s*\/\s*|\s*,\s*/).map(x=>FLAGS[x.trim().toLowerCase()]||'').filter(Boolean).join(' ');
const hasStat=v=>v!==''&&v!==null&&v!==undefined&&Number.isFinite(Number(v));
const showStat=(v,decimals=0)=>hasStat(v)?Number(v).toFixed(decimals):'';
const cleanTeamName=team=>String(team||'').replace(/\s*\+\d+\s*$/,'').replace(/\s*\|[^|]+\|\s*$/,'').trim();
const initials=n=>String(n||'?').split(/\s+/).map(w=>w[0]).slice(0,2).join('').toUpperCase();
const roleMeta=/^(position|shot|height|weight|skating|shooting|hockey iq|offensive zone|defensive zone|physicality)\b/i;
const cleanRole=role=>(Array.isArray(role)?role:[]).map(s=>String(s||'').trim()).filter(s=>s&&!roleMeta.test(s)).slice(0,3);
function thumb(p,cls){ return p.headshot
  ? `<img class="thumb ${cls||''}" src="${esc(p.headshot)}" alt="" loading="lazy" decoding="async" onerror="this.outerHTML='<span class=\\'thumb ${cls||''}\\'>${esc(initials(p.name))}</span>'">`
  : `<span class="thumb ${cls||''}">${esc(initials(p.name))}</span>`; }
const teamAbbr=team=>String(team||'FA').replace(/\b(HC|Hockey|U1[6789]|U20|Juniors?|Academy|Team)\b/gi,' ').trim().split(/\s+/).filter(Boolean).slice(0,3).map(w=>w[0]).join('').toUpperCase().slice(0,3)||'FA';
const TEAM_LOGOS={
  'CSKA Moskva U17':'assets/teams/cska-moskva.svg',
  'CSKA Moskva U18':'assets/teams/cska-moskva.svg',
  'Spartak Moskva U18':'https://files.eliteprospects.com/layout/logos/489ce210-7a1e-4b88-9be9-bdfb3ae0143f_large.png',
  'Kuznetskie Medvedi':'https://files.eliteprospects.com/layout/logos/cdc9c637-3432-42fb-aced-7871c4e20db0_large.png',
  'Krasnaya Armiya Moskva':'https://commons.wikimedia.org/wiki/Special:Redirect/file/RedArmyHockey.png',
  'Brandon Wheat Kings':'https://content.sportslogos.net/logos/11/434/thumbs/brandon-wheat-kings-logo-primary-2026-43420962026-thumb.png',
  'Calgary Hitmen':'https://content.sportslogos.net/logos/11/439/thumbs/4zbvnheq09cmyegcr1fgadb04.gif',
  'Edmonton Oil Kings':'https://content.sportslogos.net/logos/11/2317/thumbs/231755522008.gif',
  'Everett Silvertips':'https://content.sportslogos.net/logos/11/449/thumbs/44992232019.gif',
  'Lethbridge Hurricanes':'https://content.sportslogos.net/logos/11/440/thumbs/44020632014.gif',
  'Medicine Hat Tigers':'https://content.sportslogos.net/logos/11/441/thumbs/82egqaha7ql25azk459t1w0mx.gif',
  'Moose Jaw Warriors':'https://content.sportslogos.net/logos/11/435/thumbs/43568542023.gif',
  'Prince Albert Raiders':'https://content.sportslogos.net/logos/11/436/thumbs/43686782014.gif',
  'Seattle Thunderbirds':'https://content.sportslogos.net/logos/11/451/thumbs/wm7vc9zjjbrl15ups3vgjlhth.gif',
  'Spokane Chiefs':'https://content.sportslogos.net/logos/11/452/thumbs/es1gbqwjogg9h7q9isl2bj1i6.gif',
  'Swift Current Broncos':'https://content.sportslogos.net/logos/11/443/thumbs/44330312015.gif',
  'Tri-City Americans':'https://content.sportslogos.net/logos/11/453/thumbs/jufh87i7gwq3ao8mnjvuzphxq.gif',
  'Vancouver Giants':'https://content.sportslogos.net/logos/11/448/thumbs/fzgq7dqweveodcd2gj98by2ks.gif',
  'Victoria Royals':'https://content.sportslogos.net/logos/11/3036/thumbs/303673212024.gif',
  'Wenatchee Wild':'https://content.sportslogos.net/logos/11/6869/thumbs/686992952024.gif',
  'Kamloops Blazers':'assets/teams/kamloops-blazers.svg',
  'Penticton Vees':'assets/teams/penticton-vees.png',
  'Portland Winterhawks':'assets/teams/portland-winterhawks.svg',
  'Prince George Cougars':'assets/teams/prince-george-cougars.png',
  'Red Deer Rebels':'assets/teams/red-deer-rebels.svg',
  'Regina Pats':'assets/teams/regina-pats.svg',
  'Saskatoon Blades':'assets/teams/saskatoon-blades.svg',
  'Flint Firebirds':'https://content.sportslogos.net/logos/3/5665/thumbs/566545642016.gif',
  'Kingston Frontenacs':'https://content.sportslogos.net/logos/3/367/thumbs/36798182022.gif',
  'London Knights':'https://content.sportslogos.net/logos/3/369/thumbs/36962312020.gif',
  'Niagara IceDogs':'https://content.sportslogos.net/logos/3/2449/thumbs/244961502017.gif',
  'North Bay Battalion':'https://content.sportslogos.net/logos/3/5038/thumbs/503883292014.gif',
  "Ottawa 67's":'https://content.sportslogos.net/logos/3/372/thumbs/37264302021.gif',
  'Peterborough Petes':'https://content.sportslogos.net/logos/3/374/thumbs/37474292024.gif',
  'Saginaw Spirit':'https://content.sportslogos.net/logos/3/376/thumbs/1648.gif',
  'Sarnia Sting':'https://content.sportslogos.net/logos/3/377/thumbs/37790972020.gif',
  'Sudbury Wolves':'https://content.sportslogos.net/logos/3/379/thumbs/37936092019.gif',
  'Brampton Steelheads':'assets/teams/brampton-steelheads.png',
  'Barrie Colts':'assets/teams/barrie-colts.png',
  'Brantford Bulldogs':'assets/teams/brantford-bulldogs.png',
  'Erie Otters':'assets/teams/erie-otters.png',
  'Guelph Storm':'assets/teams/guelph-storm.png',
  'Kitchener Rangers':'assets/teams/kitchener-rangers.png',
  'Oshawa Generals':'assets/teams/oshawa-generals.png',
  'Owen Sound Attack':'assets/teams/owen-sound-attack.png',
  'Soo Greyhounds':'assets/teams/soo-greyhounds.png',
  'Sault Ste. Marie Greyhounds':'assets/teams/soo-greyhounds.png',
  'Windsor Spitfires':'assets/teams/windsor-spitfires.gif',
  'Québec Remparts':'https://content.sportslogos.net/logos/10/407/thumbs/40798462014.gif',
  'Blainville-Boisbriand Armada':'assets/teams/blainville-boisbriand-armada.gif',
  'Chicoutimi Saguenéens':'assets/teams/chicoutimi-sagueneens.gif',
  'Drummondville Voltigeurs':'assets/teams/drummondville-voltigeurs.gif',
  'Halifax Mooseheads':'assets/teams/halifax-mooseheads.gif',
  'Moncton Wildcats':'assets/teams/moncton-wildcats.gif',
  'Newfoundland Regiment':'assets/teams/newfoundland-regiment.gif',
  'Rimouski Océanic':'https://content.sportslogos.net/logos/10/399/thumbs/39974782014.gif',
  'Rouyn-Noranda Huskies':'assets/teams/rouyn-noranda-huskies.png',
  'Saint John Sea Dogs':'https://content.sportslogos.net/logos/10/989/thumbs/saint-john-sea-dogs-logo-primary-2026-98965772026-thumb.png',
  'Sherbrooke Phoenix':'https://content.sportslogos.net/logos/10/3649/thumbs/sherbrooke-phoenix-logo-primary-2020-364968012020-thumb.png',
  'Victoriaville Tigres':'https://content.sportslogos.net/logos/10/405/thumbs/1739.gif',
  "Val-d'Or Foreurs":'assets/teams/val-d-or-foreurs.gif',
  'Gatineau Olympiques':'assets/teams/gatineau-olympiques.svg',
  'Chicago Steel':'https://content.sportslogos.net/logos/103/3164/thumbs/9impm3ezeeixmawmz02aox1fg.gif',
  'Cedar Rapids RoughRiders':'assets/teams/cedar-rapids.svg',
  'Des Moines Buccaneers':'https://content.sportslogos.net/logos/103/3165/thumbs/0eql6j6wv9wflp6pdaf6cqc0j.gif',
  'Fargo Force':'assets/teams/fargo-force.svg',
  'Green Bay Gamblers':'assets/teams/green-bay-gamblers.svg',
  'Lincoln Stars':'assets/teams/lincoln-stars.svg',
  'Muskegon Lumberjacks':'assets/teams/muskegon-lumberjacks.gif',
  'Omaha Lancers':'assets/teams/omaha-lancers.svg',
  'Sioux City Musketeers':'assets/teams/sioux-city-musketeers.gif',
  'Sioux Falls Stampede':'https://content.sportslogos.net/logos/103/3174/thumbs/tufily6fdf6lkq8g1aqzakfxl.gif',
  'Tri-City Storm':'https://content.sportslogos.net/logos/103/3175/thumbs/xyuunx0heohms4f9mhctefh63.gif',
  'Waterloo Black Hawks':'assets/teams/waterloo-black-hawks.svg',
  'Youngstown Phantoms':'assets/teams/youngstown-phantoms.svg',
  'U.S. National U17 Team':'https://content.sportslogos.net/logos/103/3176/thumbs/317683742016.gif',
  'U.S. National U18 Team':'https://content.sportslogos.net/logos/103/3176/thumbs/317683742016.gif',
  'USNTDP Juniors':'https://content.sportslogos.net/logos/103/3176/thumbs/317683742016.gif'
  ,'EHC Biel-Bienne Spirit U21':'https://files.eliteprospects.com/layout/logos/aad2cc38-5bb7-413a-a962-24ffaf8d86ef_large.png'
  ,'EHC Biel-Bienne Spirit':'https://files.eliteprospects.com/layout/logos/aad2cc38-5bb7-413a-a962-24ffaf8d86ef_large.png'
  ,'EHC Biel-Bienne':'https://files.eliteprospects.com/layout/logos/aad2cc38-5bb7-413a-a962-24ffaf8d86ef_large.png'
  ,'HC Davos U21':'https://files.eliteprospects.com/layout/logos/74375d3e-6eab-4eda-8ad0-bea79456570f_large.png'
  ,'HC Davos':'https://files.eliteprospects.com/layout/logos/74375d3e-6eab-4eda-8ad0-bea79456570f_large.png'
  ,'IFK Täby HC U18':'https://files.eliteprospects.com/layout/logos/67eee25f-f020-41ab-95ae-b3bf0f0488ad_large.png'
  ,'IFK Täby HC':'https://files.eliteprospects.com/layout/logos/67eee25f-f020-41ab-95ae-b3bf0f0488ad_large.png'
  ,'IFK Täby Hockey':'https://files.eliteprospects.com/layout/logos/67eee25f-f020-41ab-95ae-b3bf0f0488ad_large.png'
  ,'Villacher SV':'https://files.eliteprospects.com/layout/logos/7ffc11e7-7edf-4c9a-be84-2514e08b407c_large.png'
  ,'Strathroy Rockets':'assets/teams/strathroy-rockets.png'
  ,'Jokerit':'https://content.sportslogos.net/logos/90/5213/thumbs/521318212020.gif'
  ,'Ak Bars Kazan':'https://content.sportslogos.net/logos/90/2715/thumbs/271547262019.gif'
  ,'HC Dynamo Moscow':'https://content.sportslogos.net/logos/90/2833/thumbs/283312172018.gif'
  ,'HC Spartak Moscow':'https://content.sportslogos.net/logos/90/2699/thumbs/269993592011.gif'
  ,'Torpedo Nizhny Novgorod':'https://content.sportslogos.net/logos/90/2717/thumbs/271790712019.gif'
  ,'Sibir Novosibirsk Oblast':'https://content.sportslogos.net/logos/90/2712/thumbs/271235132015.gif'
  ,'SKA Saint Petersburg':'https://content.sportslogos.net/logos/90/2707/thumbs/270725662015.gif'
  ,'Lokomotiv Yaroslavl':'https://content.sportslogos.net/logos/90/2710/thumbs/44nc0zvkg10ltefgy9s2wg8r5.gif'
  ,'AIK IF':'https://content.sportslogos.net/logos/94/2864/thumbs/lddjahidlqpl5guvbjk2nfmtt.gif'
  ,'Färjestads BK':'https://content.sportslogos.net/logos/94/2867/thumbs/k2ypp1sk2q27edw5tmdsixw3f.gif'
  ,'Leksands IF':'https://content.sportslogos.net/logos/94/5068/thumbs/506867790.gif'
  ,'Luleå HF':'https://content.sportslogos.net/logos/94/2870/thumbs/k0amfhcmpjvf94hxg8gy0frfg.gif'
  ,'Modo Hockey':'https://content.sportslogos.net/logos/94/2871/thumbs/eeh8efm4l7fzee1g7noag0rcx.gif'
  ,'Örebro HK':'https://content.sportslogos.net/logos/94/5067/thumbs/506729320.gif'
  ,'Skellefteå AIK':'https://content.sportslogos.net/logos/94/2872/thumbs/spevxbic1w34j1v5wfy6elwfb.gif'
  ,'Växjö Lakers':'https://content.sportslogos.net/logos/94/3509/thumbs/7uq1ho2q0y8pa29rc67ee3gsg.gif'
  ,'Djurgårdens IF Hockey':'https://content.sportslogos.net/logos/94/2866/thumbs/buqmj2di1cek2pehrapnfykl7.gif'
  ,'Södertälje SK':'https://content.sportslogos.net/logos/94/2873/thumbs/goajk6nigmgq1ljx37h8g3ymw.gif'
  ,'Timrå IK':'https://content.sportslogos.net/logos/94/2874/thumbs/h9580drw7j6ds4v7bhe6g11x0.gif'
  ,'Portage Terriers':'https://content.sportslogos.net/logos/156/4760/thumbs/zzzm0xna9snpc2ew8b4byq14k.gif'
  ,'Chilliwack Chiefs':'https://commons.wikimedia.org/wiki/Special:FilePath/Chilliwack%20Chiefs.svg'
  ,'Bismarck Bobcats':'https://commons.wikimedia.org/wiki/Special:FilePath/Bismarck_Bobcats.svg'
  ,'Dubuque Fighting Saints':'https://commons.wikimedia.org/wiki/Special:FilePath/Dubuque%20Fighting%20Saints%20Logo.svg'
  ,'Salmon Arm Silverbacks':'https://commons.wikimedia.org/wiki/Special:FilePath/Salmon%20Arm%20Silverbacks%20logo.png'
  ,'Vernon Vipers':'https://commons.wikimedia.org/wiki/Special:FilePath/Vernon%20Vipers%20logo.svg'
  ,'Flin Flon Bombers':'https://commons.wikimedia.org/wiki/Special:FilePath/Flin%20Flon%20Bombers%20Logo.svg'
  ,'Shattuck-Saint Mary\'s':'https://commons.wikimedia.org/wiki/Special:FilePath/Shattuck-Saint%20Mary%27s%20Logo.svg'
  ,'Long Island Gulls':'https://commons.wikimedia.org/wiki/Special:FilePath/Long_Island_Gulls_logo.png'
  ,'HV71':'https://commons.wikimedia.org/wiki/Special:FilePath/HV71_logo.svg'
  ,'Linköping HC':'https://commons.wikimedia.org/wiki/Special:FilePath/Link%C3%B6ping_HC_logo.svg'
  ,'Rögle BK':'https://commons.wikimedia.org/wiki/Special:FilePath/R%C3%B6gle_BK_logo.svg'
  ,'Malmö Redhawks':'https://commons.wikimedia.org/wiki/Special:FilePath/Malm%C3%B6_Redhawks_logo.svg'
  ,'Mountfield HK':'https://commons.wikimedia.org/wiki/Special:FilePath/Mountfield_HK_logo.svg'
  ,'BK Mladá Boleslav':'https://commons.wikimedia.org/wiki/Special:FilePath/BK_Mlad%C3%A1_Boleslav_logo.svg'
  ,'HC Litvínov':'https://commons.wikimedia.org/wiki/Special:FilePath/HC_Verva_Litv%C3%ADnov_logo.svg'
  ,'Almtuna IS':'https://commons.wikimedia.org/wiki/Special:FilePath/Almtuna_IS_logo.svg'
  ,'IF Björklöven':'https://commons.wikimedia.org/wiki/Special:FilePath/IF_Bj%C3%B6rkl%C3%B6ven_logo.svg'
  ,'Traktor Chelyabinsk':'https://commons.wikimedia.org/wiki/Special:FilePath/Traktor_Chelyabinsk_logo.svg'
  ,'Gornyak-UGMK':'https://commons.wikimedia.org/wiki/Special:FilePath/Gornyak-UGMK_logo.svg'
  ,'Chelmet Chelyabinsk':'https://commons.wikimedia.org/wiki/Special:FilePath/Chelmet_Chelyabinsk_logo.svg'
  ,'Ladia Togliatti':'https://commons.wikimedia.org/wiki/Special:FilePath/Ladia_Togliatti_logo.svg'
  ,'MHK Molot Perm':'https://commons.wikimedia.org/wiki/Special:FilePath/Molot-Prikamye_Perm_logo.svg'
  ,'Austin Bruins':'https://commons.wikimedia.org/wiki/Special:FilePath/Austin%20Bruins.svg'
  ,'Anchorage Wolverines':'https://commons.wikimedia.org/wiki/Special:FilePath/Anchorage%20Wolverines.png'
  ,'Lone Star Brahmas':'https://commons.wikimedia.org/wiki/Special:FilePath/Lone%20Star%20Brahmas.svg'
  ,'Madison Capitols':'https://commons.wikimedia.org/wiki/Special:FilePath/Madison%20Capitols%20logo.png'
  ,'KooKoo':'https://commons.wikimedia.org/wiki/Special:FilePath/KooKoo_logo.svg'
  ,'Dinamo Minsk':'https://commons.wikimedia.org/wiki/Special:FilePath/HC_Dinamo_Minsk_logo.svg'
  ,'Bonnyville Pontiacs':'assets/teams/bonnyville-pontiacs.gif'
  ,'Camrose Kodiaks':'assets/teams/camrose-kodiaks.gif'
  ,'Drumheller Dragons':'assets/teams/drumheller-dragons.gif'
  ,'Grande Prairie Storm':'assets/teams/grande-prairie-storm.gif'
  ,'Olds Grizzlys':'assets/teams/olds-grizzlys.gif'
  ,'Séminaire St-François Blizzard':'assets/teams/seminaire-st-francois-blizzard.png'
  ,'Frölunda HC':'assets/teams/frolunda-hc.gif'
  ,'Frölunda HC/U20':'assets/teams/frolunda-hc.gif'
  ,'Frölunda HC U20':'assets/teams/frolunda-hc.gif'
  ,'Frölunda HC U18':'assets/teams/frolunda-hc.gif'
  ,'HPK':'assets/teams/hpk.gif'
  ,'Ilves (ice hockey)':'assets/teams/ilves-ice-hockey.gif'
  ,'KalPa':'assets/teams/kalpa.gif'
  ,'Oulun Kärpät':'assets/teams/oulun-karpat.gif'
  ,'Lahti Pelicans':'assets/teams/lahti-pelicans.png'
  ,'Mikkelin Jukurit':'assets/teams/mikkelin-jukurit.png'
  ,'Rauman Lukko':'assets/teams/rauman-lukko.gif'
  ,'Tappara':'assets/teams/tappara.gif'
  ,'HC TPS':'assets/teams/hc-tps.gif'
  ,'Kiekko-Espoo':'assets/teams/kiekko-espoo.png'
  ,'Kiekko-Espoo/U20':'assets/teams/kiekko-espoo.png'
  ,'Kiekko-Espoo U20':'assets/teams/kiekko-espoo.png'
  ,'Kiekko-Espoo U18':'assets/teams/kiekko-espoo.png'
  ,'Boston College':'assets/teams/boston-college.png'
  ,'Boston University':'assets/teams/boston-university.png'
  ,'Michigan Wolverines':'assets/teams/michigan.svg'
  ,'Univ. of Notre Dame':'assets/teams/notre-dame.png'
  ,'Arizona State Univ.':'assets/teams/arizona-state.svg'
  ,'Boston Univ.':'assets/teams/boston-university.png'
  ,'Dartmouth College':'assets/teams/dartmouth.svg'
  ,'Miami Univ. (Ohio)':'assets/teams/miami-ohio.svg'
  ,'Penn State Univ.':'assets/teams/penn-state.svg'
  ,'Providence College':'assets/teams/providence.png'
  ,'Univ. of Massachusetts':'assets/teams/umass.svg'
  ,'Univ. of Michigan':'assets/teams/michigan.svg'
  ,'Univ. of North Dakota':'assets/teams/north-dakota.svg'
  ,'Western Michigan Univ.':'assets/teams/western-michigan.png'
  ,'Academy of Holy Angels':'assets/teams/academy-holy-angels.svg'
  ,'Deerfield Academy':'assets/teams/deerfield-academy.jpg'
  ,'Dexter Southfield School':'assets/teams/dexter-southfield.jpg'
  ,'New Hampshire Mountain Kings':'assets/teams/new-hampshire-mountain-kings.png'
  ,'Komoka Kings':'assets/teams/komoka-kings.png'
  ,"St. Andrew's College":'assets/teams/st-andrews-college.png'
  ,'Rogers High':'assets/teams/rogers-high.jpg'
  ,'Thayer Academy':'assets/teams/thayer-academy.jpg'
  ,'The Winchendon School':'assets/teams/winchendon-school.png'
  ,'Adler Mannheim':'assets/teams/adler-mannheim.svg'
  ,'Augsburger Panther':'assets/teams/augsburger-panther.svg'
  ,'Bílí Tygři Liberec':'assets/teams/bili-tygri-liberec.gif'
  ,'HC Dynamo Pardubice':'assets/teams/hc-dynamo-pardubice.svg'
  ,'HC Energie Karlovy Vary':'assets/teams/hc-energie-karlovy-vary.png'
  ,'HC Kometa Brno':'assets/teams/hc-kometa-brno.png'
  ,'HC Oceláři Třinec':'assets/teams/hc-ocelari-trinec.svg'
  ,'HC Škoda Plzeň':'assets/teams/hc-plzen.svg'
  ,'HC Sparta Praha':'assets/teams/hc-sparta-praha.svg'
  ,'HC Slovan Bratislava':'assets/teams/hc-slovan-bratislava.svg'
  ,'HK Dukla Trenčín':'assets/teams/hk-dukla-trencin.png'
  ,'HK Nitra':'assets/teams/hk-nitra.png'
  ,'EC Red Bull Salzburg':'assets/teams/ec-red-bull-salzburg.svg'
  ,'Nidaros Hockey':'assets/teams/nidaros-hockey.png'
  ,'Stavanger Oilers':'assets/teams/stavanger-oilers.svg'
  ,'Storhamar Hockey':'assets/teams/storhamar-hockey.svg'
  ,'HIFK':'assets/teams/hifk.svg'
  ,'SaiPa':'assets/teams/saipa.svg'
  ,'AKM Novomoskovsk':'assets/teams/akm-novomoskovsk.png'
  ,'Avto Yekaterinburg':'assets/teams/avto-yekaterinburg.gif'
  ,'Bars Kazan':'assets/teams/bars-kazan.png'
  ,'Belye Medvedi Chelyabinsk':'assets/teams/belye-medvedi-chelyabinsk.gif'
  ,'CSKA Moskva':'assets/teams/cska-moskva.svg'
  ,'Loko-76 Yaroslavl':'assets/teams/loko-76-yaroslavl.png'
  ,'MHK Atlant Mytishchi':'assets/teams/mhk-atlant-mytishchi.png'
  ,'Omskie Yastreby':'assets/teams/omskie-yastreby.gif'
  ,'Taifun Primorsky Krai':'assets/teams/taifun-primorsky-krai.png'
  ,'Tolpar Ufa':'assets/teams/tolpar-ufa.gif'
  ,'Toros Neftekamsk':'assets/teams/toros-neftekamsk.png'
  ,'Anaheim Ducks':'assets/nhl/ana.svg','Boston Bruins':'assets/nhl/bos.svg','Buffalo Sabres':'assets/nhl/buf.svg','Calgary Flames':'assets/nhl/cgy.svg'
  ,'Carolina Hurricanes':'assets/nhl/car.svg','Chicago Blackhawks':'assets/nhl/chi.svg','Colorado Avalanche':'assets/nhl/col.svg','Columbus Blue Jackets':'assets/nhl/cbj.svg'
  ,'Dallas Stars':'assets/nhl/dal.svg','Detroit Red Wings':'assets/nhl/det.svg','Edmonton Oilers':'assets/nhl/edm.svg','Florida Panthers':'assets/nhl/fla.svg'
  ,'Los Angeles Kings':'assets/nhl/lak.svg','Minnesota Wild':'assets/nhl/min.svg','Montréal Canadiens':'assets/nhl/mtl.svg','Montreal Canadiens':'assets/nhl/mtl.svg'
  ,'Nashville Predators':'assets/nhl/nsh.svg','New Jersey Devils':'assets/nhl/njd.svg','New York Islanders':'assets/nhl/nyi.svg','New York Rangers':'assets/nhl/nyr.svg'
  ,'Ottawa Senators':'assets/nhl/ott.svg','Philadelphia Flyers':'assets/nhl/phi.svg','Pittsburgh Penguins':'assets/nhl/pit.svg','San Jose Sharks':'assets/nhl/sjs.svg'
  ,'Seattle Kraken':'assets/nhl/sea.svg','St. Louis Blues':'assets/nhl/stl.svg','Tampa Bay Lightning':'assets/nhl/tbl.svg','Toronto Maple Leafs':'assets/nhl/tor.svg'
  ,'Utah Hockey Club':'assets/nhl/uta.svg','Utah Mammoth':'assets/nhl/uta.svg','Vancouver Canucks':'assets/nhl/van.svg','Vegas Golden Knights':'assets/nhl/vgk.svg'
  ,'Washington Capitals':'assets/nhl/wsh.svg','Winnipeg Jets':'assets/nhl/wpg.svg'
};
const teamLogoSlug=name=>String(name).normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
Object.assign(TEAM_LOGOS,{
  'Akademiya SKA St. Petersburg':'https://files.eliteprospects.com/layout/logos/a1b0f30e-1ccd-444b-879b-74ecca07f16b_large.png',
  'CSKA 2009':'assets/teams/cska-moskva.svg',
  'CSKA Juniors':'assets/teams/cska-moskva.svg',
  'Dynamo Moskva':'assets/teams/hc-dynamo-moscow.gif',
  'EC-KAC':'https://files.eliteprospects.com/layout/logos/6f7f8f1c-3669-4e21-ac34-52033f00992d_large.png',
  'Mora IK':'https://files.eliteprospects.com/layout/logos/2f5a230a-d493-4c06-a00a-8f33f491c8ad_large.png',
  'New Jersey Jr. Titans':'https://files.eliteprospects.com/layout/logos/c986b8a1-c82a-42d3-b66a-8a310e3dc239_large.png',
  'Snezhnye Barsy Astana':'https://files.eliteprospects.com/layout/logos/0fab6901-7235-4fed-b202-b1be4271802a_large.png',
  'Yunost Yekaterinburg':'https://files.eliteprospects.com/layout/logos/686b35ba-1b8d-49b2-9227-1e678e87214b_large.png'
});
Object.entries(TEAM_LOGOS).forEach(([team,url])=>{if(url.includes('content.sportslogos.net')){const ext=url.match(/\.(gif|png)(?:$|\?)/i)?.[1]||'png';TEAM_LOGOS[team]=`assets/teams/${teamLogoSlug(team)}.${ext}`;}});
const TEAM_LOGO_ALIASES={
  'AIK':'AIK IF','Akademiya SKA St. Petersburg':'SKA Saint Petersburg','Bili Tygri Liberec':'Bílí Tygři Liberec','Bili Tygri Libe':'Bílí Tygři Liberec','Ottawa 67s':"Ottawa 67's",
  'Chaika Nizhny Novgorod':'Torpedo Nizhny Novgorod','Djurgårdens IF':'Djurgårdens IF Hockey','EHC Biel-Bienne Spirit':'EHC Biel-Bienne Spirit',
  'Färjestad BK':'Färjestads BK','HC Ocelari Trinec':'HC Oceláři Třinec','HC Ocelari Trine':'HC Oceláři Třinec','HC Plzen':'HC Škoda Plzeň',
  'HC Yverdon-les-Bains':'HC Yverdon-les-Bains','HPK Akatemia':'HPK','IFK Täby HC':'IFK Täby Hockey',
  'Ilves':'Ilves (ice hockey)','Irbis Kazan':'Ak Bars Kazan','Jungadler Mannheim':'Adler Mannheim',
  'Jukurit':'Mikkelin Jukurit','Kärpät':'Oulun Kärpät','Kuznetskie Medvedi':'Kuznetskie Medvedi','Loko Yaroslavl':'Lokomotiv Yaroslavl','Lukko':'Rauman Lukko',
  'MHK Dynamo Moskva':'HC Dynamo Moscow','Dynamo Moskva':'HC Dynamo Moscow','MHK Spartak Moskva':'HC Spartak Moscow','MoDo Hockey':'Modo Hockey','Atlant Mytishchi':'MHK Atlant Mytishchi',
  'HK Dukla Trenci':'HK Dukla Trenčín','HK Dukla Trencin':'HK Dukla Trenčín','Nidaros Hockey':'Nidaros Hockey','Pelicans':'Lahti Pelicans','RB Hockey Academy':'EC Red Bull Salzburg',
  'RB Hockey':'EC Red Bull Salzburg','Shattuck St. Mary\'s':'Shattuck-Saint Mary\'s','Sibirskie Snaipery Novosibirsk':'Sibir Novosibirsk Oblast',
  'Slovakia':'Slovakia men\'s national junior ice hockey team','Stavanger Oilers':'Stavanger Oilers',
  'SKA-1946 St. Petersburg':'SKA Saint Petersburg','SKA St. Petersburg':'SKA Saint Petersburg','Storhamar':'Storhamar Hockey','TPS':'HC TPS','U.S. National':'USA Hockey National Team Development Program','Yastreby Omsk':'Omskie Yastreby','Avangard Omsk':'Omskie Yastreby','Lada Togliatti':'Ladia Togliatti',
  'USNTDP':'U.S. National U18 Team','U.S. National':'U.S. National U18 Team','U.S. National U':'U.S. National U18 Team','USA Hockey National Team Development Program':'U.S. National U18 Team','Växjö Lakers HC':'Växjö Lakers'
};
function matchedClubName(team){
  let club=String(team||'').replace(/\.{3}$/,'').replace(/\s*\|[^|]+\|\s*/g,' ').replace(/\s*\+\d+\s*$/,'').replace(/\s*Loan$/i,'').replace(/\s+(J1[6789]|J20|U1[6789]|U20|U21|18U Prep|16U AAA|18U AAA|Juniors?|Prep|AAA)\b.*$/i,'').trim();
  if(/^U\.S\. National U1[78] Team$/i.test(team))club='U.S. National';
  if(/^Slovakia U18$/i.test(team))club='Slovakia';
  club=TEAM_LOGO_ALIASES[club]||club;
  if(!TEAM_LOGOS[club]&&club.length>7){const matches=Object.keys(TEAM_LOGOS).filter(name=>name.toLocaleLowerCase().startsWith(club.toLocaleLowerCase()));if(matches.length===1)club=matches[0];}
  return club;
}
function teamMark(team,cls='',fallbackCountry=''){
  const name=String(team||''),club=matchedClubName(name),logo=TEAM_LOGOS[name]||TEAM_LOGOS[club]||'';
  const fallback=flagFor(fallbackCountry);
  return `<span class="team-mark ${cls} ${!logo&&fallback?'flag-fallback':''}" aria-hidden="true"><i>${fallback||esc(teamAbbr(name))}</i>${logo?`<img src="${esc(logo)}" alt="" loading="lazy" onerror="this.remove()">`:''}</span>`;
}
async function hydrateTeamLogos(){/* Only verified, club-specific artwork is rendered. */}
function leagueForTeam(team,country=''){
  const t=String(team||''),c=String(country||'');
  if(/CHL team TBA/i.test(t))return 'CHL';
  if(/Tri-City Storm/i.test(t))return 'USHL';
  if(/Hitmen|Wheat Kings|Silvertips|Medicine Hat Tigers|Raiders|Thunderbirds|Chiefs|Tri-City Americans|Royals|Hurricanes|Broncos|Giants|Wenatchee Wild|Moose Jaw Warriors/i.test(t))return 'WHL';
  if(/Spirit|67's|Petes|Frontenacs|Wolves|Sting|Firebirds|Battalion|IceDogs|Guelph Storm|London Knights|Steelheads/i.test(t))return 'OHL';
  if(/Sea Dogs|Remparts|Phoenix|Tigres|Voltigeurs|Océanic/i.test(t))return 'QMJHL';
  if(/National U1[78]|USNTDP/i.test(t))return 'NTDP';
  if(/Steel|Stampede|Storm|Buccaneers|Gamblers|Lancers/i.test(t))return 'USHL';
  if(/Moskva|Yaroslavl|Irbis|Snaipery|Medvedi|Chaika|Akademiya SKA/i.test(t))return 'MHL';
  if(/Pontiacs|Grande Prairie Storm|Grizzlys|Dragons|Kodiaks/i.test(t))return 'AJHL';
  if(/Portage Terriers/i.test(t))return 'MJHL';if(/Séminaire St-François/i.test(t))return 'QM18AAA';
  if(/Yverdon.*U21/i.test(t))return 'Swiss U21-Elit';if(/RB Hockey Academy U18/i.test(t))return 'Austria U18';
  if(/U20/i.test(t)&&/Finland/i.test(c))return 'U20 SM-sarja';if(/U18/i.test(t)&&/Finland/i.test(c))return 'U18 SM-sarja';
  if(/U20/i.test(t)&&/Sweden/i.test(c))return 'U20 Nationell';if(/U18/i.test(t)&&/Sweden/i.test(c))return 'U18 Nationell';
  if(/U20/i.test(t)&&/Czechia/i.test(c))return 'Czechia U20';if(/U18|U20/i.test(t)&&/Germany/i.test(c))return 'DNL U20';
  if(/U20/i.test(t)&&/Norway/i.test(c))return 'Norway U20';if(/U18/i.test(t)&&/Russia/i.test(c))return 'Russia U18';
  return '';
}
function seasonLines(p){
  if(typeof POINT_STAT_LINES==='object'&&Array.isArray(POINT_STAT_LINES[p.name]))return POINT_STAT_LINES[p.name];
  if(Array.isArray(p.statLines)&&p.statLines.length)return p.statLines;
  if(!hasStat(p.games))return [];
  const team=p.statsTeam||p.team||'';
  return [{season:'2025–26',team,league:p.league||leagueForTeam(team,p.country),games:p.games,goals:p.goals,assists:p.assists,points:p.points,ppg:p.ppg,gaa:p.gaa,svPct:p.svPct,wins:p.wins,losses:p.losses,shutouts:p.shutouts}];
}

const VERIFIED_STAT_LINES={
  'Sergei Skvortsov':[{season:'2025–26',team:'Chaika Nizhny Novgorod',league:'MHL',leagueUrl:'https://www.eliteprospects.com/league/mhl/stats/2025-2026',games:52,goals:19,assists:24,points:43,ppg:.83,playoffs:{games:17,goals:9,assists:9,points:18,ppg:1.06}}],
  'Nazar Privalov':[{season:'2025–26',team:'Krasnaya Armiya Moskva',teamUrl:'https://www.eliteprospects.com/team/4920/krasnaya-armiya-moskva/2025-2026?tab=stats',league:'MHL',leagueUrl:'https://www.eliteprospects.com/league/mhl/stats/2025-2026',games:51,goals:30,assists:19,points:49,ppg:.96,playoffs:{games:6,goals:0,assists:1,points:1,ppg:.17}}],
  'Vladimir Shtyrkhunov':[{season:'2025–26',team:'Krasnaya Armiya Moskva',teamUrl:'https://www.eliteprospects.com/team/4920/krasnaya-armiya-moskva/2025-2026?tab=stats',league:'MHL',leagueUrl:'https://www.eliteprospects.com/league/mhl/stats/2025-2026',games:55,goals:4,assists:28,points:32,ppg:.58,playoffs:{games:9,goals:2,assists:1,points:3,ppg:.33}}],
  'Ilya Kolomytsev':[{season:'2025–26',team:'Irbis Kazan',league:'MHL',leagueUrl:'https://www.eliteprospects.com/league/mhl/stats/2025-2026',games:53,goals:13,assists:17,points:30,ppg:.57,playoffs:{games:4,goals:1,assists:0,points:1,ppg:.25}}],
  'Daniyar Aibatov':[{season:'2025–26',team:'Irbis Kazan',league:'MHL',leagueUrl:'https://www.eliteprospects.com/league/mhl/stats/2025-2026',games:49,goals:2,assists:16,points:18,ppg:.37,playoffs:{games:1,goals:0,assists:0,points:0,ppg:0}}],
  'Griffin Storey':[
    {season:'2025–26',team:'Waseca High',league:'USHS-MN',games:23,goals:32,assists:43,points:75,ppg:3.26},
    {season:'2025–26',team:'Team Spade',league:'UMHSEHL',games:20,goals:5,assists:11,points:16,ppg:.80},
    {season:'2025–26',team:'U.S. National U17 Team',league:'NTDP',games:2,goals:0,assists:1,points:1,ppg:.50}
  ],
  'Riley Zupfer':[
    {season:'2025–26',team:'Des Moines Buccaneers',league:'USHL',games:61,goals:16,assists:28,points:44,ppg:.72},
    {season:'2025–26',team:'Minnesota District',league:'USA-S17',games:6,goals:5,assists:3,points:8,ppg:1.33}
  ],
  'Landon Dupont':[{season:'2025–26',team:'Everett Silvertips',league:'WHL',games:63,goals:18,assists:55,points:73,ppg:1.16,playoffs:{games:18,goals:5,assists:18,points:23,ppg:1.28}}],
  'Brock Cripps':[{season:'2025–26',team:'Prince Albert Raiders',league:'WHL',games:62,goals:6,assists:31,points:37,ppg:.60,playoffs:{games:20,goals:4,assists:17,points:21,ppg:1.05}}],
  'Noah Davidson':[{season:'2025–26',team:'Medicine Hat Tigers',league:'WHL',games:67,goals:30,assists:22,points:52,ppg:.78,playoffs:{games:15,goals:6,assists:6,points:12,ppg:.80}}],
  'Shaeffer Gordon-Carroll':[{season:'2025–26',team:'Medicine Hat Tigers',league:'WHL',games:41,goals:12,assists:25,points:37,ppg:.90,playoffs:{games:15,goals:5,assists:7,points:12,ppg:.80}}],
  'Ben Harvey':[{season:'2025–26',team:'Prince Albert Raiders',league:'WHL',games:64,goals:18,assists:15,points:33,ppg:.52,playoffs:{games:19,goals:4,assists:2,points:6,ppg:.32}}],
  'Jake Prunty':[{season:'2025–26',team:'Sioux Falls Stampede',league:'USHL',games:44,goals:4,assists:33,points:37,ppg:.84,playoffs:{games:14,goals:2,assists:2,points:4,ppg:.29}}],
  'Jake Ritson':[
    {season:'2025–26',team:'Strathroy Rockets',teamUrl:'https://www.eliteprospects.com/team/5527/strathroy-rockets/2025-2026?tab=stats',league:'GOJHL',leagueUrl:'https://www.eliteprospects.com/league/gojhl/stats/2025-2026',games:47,goals:24,assists:48,points:72,ppg:1.53,playoffs:{games:5,goals:2,assists:2,points:4,ppg:.80}},
    {season:'2025–26',team:'London Knights',teamUrl:'https://www.eliteprospects.com/team/206/london-knights/2025-2026?tab=stats',league:'OHL',leagueUrl:'https://www.eliteprospects.com/league/ohl/stats/2025-2026',games:2,goals:0,assists:0,points:0,ppg:0},
    {season:'2026–27',team:'London Knights',teamUrl:'https://www.eliteprospects.com/team/206/london-knights/2026-2027?tab=stats',league:'OHL',leagueUrl:'https://www.eliteprospects.com/league/ohl/stats/2026-2027'}
  ],
  'Dima Zhilkin':[{season:'2025–26',team:'Saginaw Spirit',league:'OHL',games:59,goals:36,assists:39,points:75,ppg:1.27,playoffs:{games:4,goals:3,assists:1,points:4,ppg:1.00}}],
  'Yevgeni Yakunin':[{season:'2025–26',team:'MHK Spartak Moskva',league:'MHL',games:58,goals:13,assists:34,points:47,ppg:.81,playoffs:{games:21,goals:5,assists:7,points:12,ppg:.57}}],
  'Andrei Pustovoy':[{season:'2025–26',team:'Loko Yaroslavl',league:'MHL',games:52,goals:32,assists:30,points:62,ppg:1.19,playoffs:{games:18,goals:5,assists:6,points:11,ppg:.61}}],
  'Daniil Savin':[
    {season:'2025–26',team:'Akademiya SKA St. Petersburg',teamUrl:'https://www.eliteprospects.com/team/37724/akademiya-ska-st-petersburg/stats/2025-2026',league:'MHL',leagueUrl:'https://www.eliteprospects.com/league/mhl/stats/2025-2026',games:43,goals:11,assists:13,points:24,ppg:.56,playoffs:{games:2,goals:0,assists:0,points:0,ppg:0}},
    {season:'2025–26',team:'SKA-1946 St. Petersburg',teamUrl:'https://www.eliteprospects.com/team/4925/ska-1946-st.-petersburg/2025-2026',league:'MHL',leagueUrl:'https://www.eliteprospects.com/league/mhl/stats/2025-2026',games:5,goals:2,assists:2,points:4,ppg:.80}
  ],
  'Daniil Yermolov':[
    {season:'2025–26',team:'CSKA Moskva U18',teamUrl:'https://www.eliteprospects.com/team/25841/cska-moskva-u18/2025-2026?tab=stats',league:'Russia U18',leagueUrl:'https://www.eliteprospects.com/league/russia-u18/stats/2025-2026',games:17,goals:21,assists:16,points:37,ppg:2.18},
    {season:'2025–26',team:'Krasnaya Armiya Moskva',teamUrl:'https://www.eliteprospects.com/team/4920/krasnaya-armiya-moskva/2025-2026?tab=stats',league:'MHL',leagueUrl:'https://www.eliteprospects.com/league/mhl/stats/2025-2026',games:4,goals:1,assists:1,points:2,ppg:.50,playoffs:{games:2,goals:0,assists:1,points:1,ppg:.50}},
    {season:'2025–26',team:'Russia U17 (all)',teamUrl:'https://www.eliteprospects.com/team/9768/russia-u17-all/2025-2026?tab=stats',league:'International-Jr',leagueUrl:'https://www.eliteprospects.com/league/international-jr/stats/2025-2026'}
  ]
};

const KEY='draftscout_v2'; let _mem=null;
const SEED_VERSION=6;
const POINT_STATS_VERSION=18;
const BIO_DATA_VERSION=7;
const STAT_LINES_VERSION=18;
const GOALIE_GRADES_VERSION=2;
const DEFAULT_GRADE_VERSION=2;
const HAMPUS_ZIRATH_PHOTO='https://media.hockeysverige.se/prod/images/small_landscape/774a7771a4fa-marcus-nordmarkb1mofpkv7r.webp';
const rawGet=()=>{ try{return localStorage.getItem(KEY);}catch(e){return _mem;} };
const rawSet=v=>{ try{localStorage.setItem(KEY,v);}catch(e){_mem=v;} };
let state;
const uid=()=>'p'+Math.random().toString(36).slice(2,9);
const COUNTRY_DATA_VERSION=4;
const PLAYER_NAME_CORRECTIONS={'Braden Scuderi':'Braiden Scuderi','Arytom Mate':'Artyom Mate'};
// Stored attribute keys are shared with skaters; goalie cards relabel them in the UI.
const GOALIE_GRADES={
  'Eric Tu':{skating:78,shooting:79,iq:79,ozone:76,dzone:79,phys:78},
  'Eli Winters':{skating:78,shooting:78,iq:77,ozone:75,dzone:78,phys:78},
  'Yaroslav Vetrov':{skating:78,shooting:79,iq:78,ozone:75,dzone:79,phys:78},
  'Vilmer Salén Forsberg':{skating:76,shooting:78,iq:77,ozone:74,dzone:78,phys:79},
  'Carter Esler':{skating:79,shooting:79,iq:78,ozone:75,dzone:78,phys:79},
  'Patrick Déniger':{skating:78,shooting:78,iq:78,ozone:75,dzone:79,phys:78},
  'Ayden Huet':{skating:76,shooting:76,iq:76,ozone:74,dzone:77,phys:78},
  'Bastian Bauer':{skating:77,shooting:78,iq:77,ozone:74,dzone:78,phys:78},
  'Vladimir Selivanov':{skating:78,shooting:78,iq:76,ozone:74,dzone:77,phys:78}
};
const DEFAULT_GRADE_OVERRIDES={
  'Gavin Harrison':{skating:77,shooting:78,iq:77,ozone:78,dzone:75,phys:76},
  'Luke Ruptash':{skating:74,shooting:75,iq:74,ozone:75,dzone:73,phys:75},
  'Jordin St. Louis':{skating:76,shooting:77,iq:76,ozone:77,dzone:74,phys:75},
  'Jensen Marsh':{skating:75,shooting:76,iq:75,ozone:76,dzone:74,phys:76},
  'Bode Edwards':{skating:75,shooting:74,iq:75,ozone:75,dzone:76,phys:76},
  'Paul Schuster':{skating:75,shooting:75,iq:74,ozone:75,dzone:73,phys:76},
  'Matěj Tománek':{skating:76,shooting:78,iq:77,ozone:78,dzone:74,phys:75},
  'Jan Fodor':{skating:76,shooting:78,iq:76,ozone:78,dzone:74,phys:75},
  'Patrik Polacek':{skating:75,shooting:76,iq:75,ozone:76,dzone:74,phys:77},
  'Matej Kucera':{skating:75,shooting:76,iq:75,ozone:76,dzone:74,phys:74},
  'Lev Alalykin':{skating:76,shooting:76,iq:75,ozone:76,dzone:73,phys:74},
  'Ilya Kolomytsev':{skating:75,shooting:75,iq:76,ozone:75,dzone:75,phys:74},
  'Felix Alexander Kvernstad':{skating:78,shooting:79,iq:78,ozone:79,dzone:74,phys:75},
  'Jonas Frostestad Gulbrandsen':{skating:76,shooting:78,iq:77,ozone:78,dzone:74,phys:79},
  'Mikael Nyland Olasveengen':{skating:77,shooting:75,iq:78,ozone:78,dzone:74,phys:75},
  'Griffin Storey':{skating:75,shooting:74,iq:75,ozone:75,dzone:74,phys:76},
  'Cole Mazzoni':{skating:74,shooting:74,iq:74,ozone:74,dzone:74,phys:76},
  'Ilya Kolmakov':{skating:76,shooting:77,iq:77,ozone:78,dzone:74,phys:75},
  'Olle Karlsson':{skating:76,shooting:77,iq:76,ozone:77,dzone:74,phys:75},
  'Mio Forssell':{skating:78,shooting:78,iq:79,ozone:79,dzone:74,phys:75},
  'Benjamin Nyström':{skating:76,shooting:78,iq:78,ozone:78,dzone:75,phys:79},
  'Noel Nord':{skating:77,shooting:77,iq:78,ozone:78,dzone:75,phys:76},
  'Olle Zetterstedt':{skating:77,shooting:78,iq:77,ozone:78,dzone:74,phys:75},
  'Vincent Bäckdahl':{skating:75,shooting:77,iq:76,ozone:77,dzone:75,phys:79},
  'Tom Pråhl':{skating:76,shooting:77,iq:77,ozone:77,dzone:75,phys:78},
  'Alvin Svanlund':{skating:76,shooting:77,iq:77,ozone:77,dzone:75,phys:76},
  'Love Lorentzon':{skating:77,shooting:76,iq:78,ozone:78,dzone:75,phys:76},
  'Mille Forslund':{skating:76,shooting:76,iq:76,ozone:76,dzone:74,phys:75},
  'Elton Sandman':{skating:75,shooting:76,iq:76,ozone:76,dzone:75,phys:78},
  'Simon Näslund':{skating:76,shooting:77,iq:76,ozone:77,dzone:74,phys:75},
  'Rasmus Kennlöv':{skating:76,shooting:75,iq:77,ozone:76,dzone:74,phys:75},
  'Kid Åkerman':{skating:77,shooting:76,iq:76,ozone:77,dzone:74,phys:74},
  'Jonathan Cremonese':{skating:75,shooting:75,iq:75,ozone:76,dzone:74,phys:77},
  'Roope Tiainen':{skating:78,shooting:79,iq:78,ozone:79,dzone:74,phys:75},
  'Max Järventie':{skating:78,shooting:79,iq:78,ozone:79,dzone:74,phys:75},
  'Joakim Torvinen':{skating:78,shooting:79,iq:79,ozone:79,dzone:75,phys:76},
  'Vito Agarth':{skating:77,shooting:78,iq:78,ozone:78,dzone:75,phys:76},
  'Joel Ikonen':{skating:77,shooting:79,iq:78,ozone:79,dzone:75,phys:77},
  'Jesse Pahkamaa':{skating:77,shooting:77,iq:78,ozone:78,dzone:75,phys:77},
  'Niklas Borgström':{skating:78,shooting:76,iq:79,ozone:78,dzone:75,phys:74},
  'Jonas Schwarz':{skating:77,shooting:78,iq:78,ozone:78,dzone:75,phys:76},
  'Oliver Rinne':{skating:78,shooting:76,iq:78,ozone:78,dzone:77,phys:75},
  'Niklas Helppi':{skating:76,shooting:78,iq:77,ozone:78,dzone:74,phys:79},
  'Romeo Mikkonen':{skating:77,shooting:76,iq:78,ozone:78,dzone:74,phys:75},
  'Petteri Vilhunen':{skating:76,shooting:77,iq:77,ozone:77,dzone:75,phys:76},
  'Alvar Soisalo':{skating:76,shooting:76,iq:77,ozone:77,dzone:74,phys:75},
  'Riley Zupfer':{skating:76,shooting:76,iq:76,ozone:76,dzone:74,phys:75},
  'Ben Harvey':{skating:76,shooting:76,iq:76,ozone:76,dzone:74,phys:76},
  'Crew Martinson':{skating:75,shooting:76,iq:75,ozone:76,dzone:74,phys:78},
  'Jake Ritson':{skating:75,shooting:76,iq:76,ozone:76,dzone:74,phys:77},
  'Loïk Gariepy':{skating:76,shooting:75,iq:77,ozone:76,dzone:75,phys:76},
  'Drayden Uhrina':{skating:75,shooting:76,iq:75,ozone:76,dzone:74,phys:76},
  'Ivan Gimmler':{skating:76,shooting:76,iq:76,ozone:77,dzone:74,phys:75},
  'Calder Hamilton':{skating:77,shooting:75,iq:76,ozone:76,dzone:76,phys:74},
  'Jake Prunty':{skating:78,shooting:75,iq:77,ozone:76,dzone:76,phys:74},
  'Nikita Bloch':{skating:76,shooting:76,iq:76,ozone:76,dzone:74,phys:76},
  'Carter Moen':{skating:75,shooting:76,iq:75,ozone:76,dzone:74,phys:75},
  'Oliver Ozogany':{skating:75,shooting:77,iq:75,ozone:76,dzone:74,phys:78},
  'Tyden Lafournaise':{skating:75,shooting:76,iq:75,ozone:76,dzone:74,phys:77},
  'Leonards Aleksandrs Grundmanis':{skating:75,shooting:75,iq:76,ozone:75,dzone:77,phys:79},
  'Louis-Émile Dumais':{skating:76,shooting:77,iq:76,ozone:77,dzone:74,phys:75},
  'Matthew Perreault':{skating:77,shooting:75,iq:77,ozone:76,dzone:76,phys:74},
  'Hampus Zirath':{skating:76,shooting:76,iq:76,ozone:77,dzone:74,phys:75},
  'Paul Sintschnig':{skating:78,shooting:79,iq:79,ozone:80,dzone:76,phys:79},
  'Maxmilian Mares':{skating:76,shooting:79,iq:77,ozone:79,dzone:74,phys:82},
  'Dario Blengino':{skating:77,shooting:76,iq:76,ozone:77,dzone:74,phys:75},
  'Andrei Nikolayev':{skating:77,shooting:78,iq:77,ozone:75,dzone:78,phys:79},
  'David Huk':{skating:76,shooting:76,iq:77,ozone:76,dzone:75,phys:80},
  'Matyas Cancik':{skating:78,shooting:76,iq:76,ozone:77,dzone:73,phys:73},
  'Dmitri Savin':{skating:77,shooting:80,iq:78,ozone:80,dzone:74,phys:78},
  'Bogdan Yakushevsky':{skating:76,shooting:75,iq:76,ozone:75,dzone:75,phys:75},
  'Oskars Luks':{skating:75,shooting:74,iq:76,ozone:75,dzone:78,phys:81},
  'Sebastian Taliga':{skating:78,shooting:76,iq:76,ozone:77,dzone:74,phys:74},
  'Artyom Katsuro':{skating:77,shooting:79,iq:78,ozone:80,dzone:74,phys:75},
  'Pyotr Novozhilov':{skating:75,shooting:73,iq:76,ozone:75,dzone:78,phys:80},
  'Ilya Kuzminykh':{skating:77,shooting:79,iq:77,ozone:80,dzone:73,phys:75},
  'Melichar Kovar':{skating:76,shooting:79,iq:77,ozone:79,dzone:74,phys:79},
  'Gleb Olkhovik':{skating:75,shooting:76,iq:78,ozone:78,dzone:74,phys:80},
  'Yegor Kravchenko':{skating:77,shooting:75,iq:76,ozone:76,dzone:74,phys:73},
  'Fyodor Andreyev':{skating:75,shooting:73,iq:76,ozone:75,dzone:79,phys:81},
  'Elias Matousek':{skating:77,shooting:79,iq:77,ozone:80,dzone:74,phys:78},
  'Damir Aptikashev':{skating:75,shooting:72,iq:76,ozone:74,dzone:79,phys:80},
  'Dominik Drabek':{skating:77,shooting:77,iq:76,ozone:77,dzone:74,phys:76},
  'Johannes Dobrovolny':{skating:77,shooting:76,iq:76,ozone:76,dzone:75,phys:76},
  'Oliver Vanha':{skating:76,shooting:78,iq:77,ozone:78,dzone:75,phys:80},
  'Oleksii Kryvonos':{skating:78,shooting:76,iq:76,ozone:77,dzone:74,phys:72}
};
const SOURCE_RATINGS_BY_PLAYER=Object.fromEntries(SEED_PLAYERS.map(player=>{
  const name=PLAYER_NAME_CORRECTIONS[player.name]||player.name,ratings=Object.fromEntries(ATTRS.map(([key])=>[key,Number(player[key])||0]));
  const goalie=GOALIE_GRADES[name],defaults=DEFAULT_GRADE_OVERRIDES[name],stillDefault=ATTRS.every(([key])=>Number(player[key])===75);
  return [name,{...ratings,...(goalie||(stillDefault&&defaults)||{})}];
}));
const seedState=()=>({players:SEED_PLAYERS.map(original=>{
  const p={...original,name:PLAYER_NAME_CORRECTIONS[original.name]||original.name},bio=EP_BIOS[p.name]||{},stats=POINT_STATS[p.name]||{},grades=GOALIE_GRADES[p.name]||DEFAULT_GRADE_OVERRIDES[p.name]||{},
    {team:rawStatsTeam,...production}=stats,statsTeam=cleanTeamName(rawStatsTeam)||p.team||'';
  return{id:uid(),...p,...grades,...bio,...production,team:p.team||statsTeam,statsTeam,statLines:(typeof POINT_STAT_LINES==='object'&&POINT_STAT_LINES[p.name])||VERIFIED_STAT_LINES[p.name]||p.statLines,headshot:p.headshot||bio.photo||'',country:COUNTRY_BY_PLAYER[p.name]||p.country,role:cleanRole(p.role)};
}),draft:{rounds:1,teams:[],picks:{}},seedVersion:SEED_VERSION,countryDataVersion:COUNTRY_DATA_VERSION,pointStatsVersion:POINT_STATS_VERSION,bioDataVersion:BIO_DATA_VERSION,statLinesVersion:STAT_LINES_VERSION,goalieGradesVersion:GOALIE_GRADES_VERSION,defaultGradeVersion:DEFAULT_GRADE_VERSION});
function load(){ const raw=rawGet(); let migrated=false;
  if(raw){ try{state=JSON.parse(raw);}catch(e){state=seedState();} } else state=seedState();
  if(state.seedVersion!==SEED_VERSION){
    const have=new Set(state.players.map(p=>(p.name||'').trim().toLowerCase()));
    SEED_PLAYERS.forEach(sp=>{ if(!have.has((sp.name||'').trim().toLowerCase())) state.players.push({id:uid(),...sp}); });
    state.seedVersion=SEED_VERSION; migrated=true;
  }
  const migrateCountries=state.countryDataVersion!==COUNTRY_DATA_VERSION,migratePoints=state.pointStatsVersion!==POINT_STATS_VERSION,migrateBios=state.bioDataVersion!==BIO_DATA_VERSION,migrateStatLines=state.statLinesVersion!==STAT_LINES_VERSION,migrateGoalieGrades=state.goalieGradesVersion!==GOALIE_GRADES_VERSION,migrateDefaultGrades=state.defaultGradeVersion!==DEFAULT_GRADE_VERSION;
  state.players.forEach(player=>{
    const name=PLAYER_NAME_CORRECTIONS[player.name]||player.name,sourceRatings=SOURCE_RATINGS_BY_PLAYER[name];
    if(sourceRatings&&ATTRS.some(([key])=>Number(player[key])!==sourceRatings[key])){Object.assign(player,sourceRatings);migrated=true;}
  });
  state.players.forEach(p=>{ if(!p.id)p.id=uid(); const correctedName=PLAYER_NAME_CORRECTIONS[p.name];if(correctedName){p.name=correctedName;migrated=true;} const country=migrateCountries&&(COUNTRY_BY_PLAYER[p.name]||SEED_COUNTRY_BY_PLAYER[p.name]); if(country&&p.country!==country){p.country=country;migrated=true;} const bio=migrateBios&&EP_BIOS[p.name]; if(bio){const{photo,...facts}=bio;Object.assign(p,facts);if(!p.headshot&&photo)p.headshot=photo;migrated=true;} const stats=migratePoints&&POINT_STATS[p.name]; if(stats){const{team:rawStatsTeam,...production}=stats;Object.assign(p,production);p.statsTeam=cleanTeamName(rawStatsTeam)||p.statsTeam||'';p.team=SEED_TEAM_BY_PLAYER[p.name]||p.team||p.statsTeam;migrated=true;} const role=cleanRole(p.role); if(JSON.stringify(role)!==JSON.stringify(p.role)){p.role=role;migrated=true;} if(p.name==='Hampus Zirath'&&!p.headshot){p.headshot=HAMPUS_ZIRATH_PHOTO;migrated=true;} if(p.headshot==null)p.headshot='';
    const cleanTeam=cleanTeamName(p.team);if(cleanTeam!==p.team){p.team=cleanTeam;migrated=true;}
    const refreshedLines=(typeof POINT_STAT_LINES==='object'&&POINT_STAT_LINES[p.name])||VERIFIED_STAT_LINES[p.name];if(migrateStatLines&&refreshedLines){p.statLines=refreshedLines;migrated=true;}
    const goalieGrades=migrateGoalieGrades&&GOALIE_GRADES[p.name];if(goalieGrades){Object.assign(p,goalieGrades);p.previousOverall=overall(p);migrated=true;}
    const defaultGrades=migrateDefaultGrades&&DEFAULT_GRADE_OVERRIDES[p.name],stillDefault=ATTRS.every(([key])=>Number(p[key])===75);if(defaultGrades&&stillDefault){Object.assign(p,defaultGrades);p.role=[];p.previousOverall=overall(p);migrated=true;}
    if(!Number.isFinite(Number(p.previousOverall))){p.previousOverall=overall(p);migrated=true;} });
  const artym=state.players.filter(p=>p.name==='Artyom Mate');
  if(artym.length>1){
    const keep=artym.find(p=>p.country)||artym[0];
    state.players=state.players.filter(p=>p.name!=='Artyom Mate'||p===keep);
    migrated=true;
  }
  const braidenRows=state.players.filter(p=>p.name==='Braiden Scuderi');
  if(braidenRows.length>1){
    const keep=braidenRows.find(p=>p.country==='USA')||braidenRows.find(p=>p.country)||braidenRows[0];
    state.players=state.players.filter(p=>p.name!=='Braiden Scuderi'||p===keep);
    migrated=true;
  }
  if(migrateCountries){state.countryDataVersion=COUNTRY_DATA_VERSION;migrated=true;}
  if(migratePoints){state.pointStatsVersion=POINT_STATS_VERSION;migrated=true;}
  if(migrateBios){state.bioDataVersion=BIO_DATA_VERSION;migrated=true;}
  if(migrateStatLines){state.statLinesVersion=STAT_LINES_VERSION;migrated=true;}
  if(migrateGoalieGrades){state.goalieGradesVersion=GOALIE_GRADES_VERSION;migrated=true;}
  if(migrateDefaultGrades){state.defaultGradeVersion=DEFAULT_GRADE_VERSION;migrated=true;}
  if(!state.draft)state.draft={rounds:1,teams:[],picks:{}}; if(!state.draft.picks)state.draft.picks={};
  if(migrated) save(); }
const save=()=>rawSet(JSON.stringify(state));
const byId=id=>state.players.find(p=>p.id===id);

$$('.tab').forEach(t=>t.onclick=()=>{
  $$('.tab').forEach(x=>x.classList.remove('active')); t.classList.add('active');
  $$('.view').forEach(v=>v.classList.remove('active')); $('#view-'+t.dataset.view).classList.add('active');
  if(t.dataset.view==='home')renderHome(); if(t.dataset.view==='draft2026')renderDraft2026(); if(t.dataset.view==='board')renderBoard(); if(t.dataset.view==='stock')renderStock(); if(t.dataset.view==='forum')renderForum(); if(t.dataset.view==='draft')renderDraft();
});
$$('[data-go]').forEach(b=>b.onclick=()=>{ const tab=$(`.tab[data-view="${b.dataset.go}"]`); if(tab)tab.click(); });
const segOn=(sel,btn)=>{ $$(sel+' button').forEach(b=>b.classList.remove('on')); btn.classList.add('on'); };
const POSITION_FILTERS=['C','LW','RW','D','G'];
const posMatch=(p,f)=>f==='all'?true:f==='F'?(!isD(p.pos)&&!positionTokens(p.pos).includes('G')):positionTokens(p.pos).includes(f);

const heightInches=h=>{const m=String(h||'').match(/(\d+)\D+(\d+)/);return m?(+m[1]*12)+(+m[2]):0;};
const weightLbs=w=>Number(String(w||'').match(/\d+/)?.[0]||0);
const PROSPECT_PRODUCTION_KEYS=['games','goals','assists','points','ppg','gaa','svPct','wins','losses','shutouts'];
const P_NUMERIC=['height','weight','games','goals','assists','points','ppg','gaa','svPct','wins','losses','shutouts','ovr'];
const P_VALUES=['country','pos','shot','team','tier'];
const P_LABELS={player:'Player',country:'Nationality',pos:'Position',shot:'Shoots / catches',height:'Height',weight:'Weight',team:'Team',games:'Games played',goals:'Goals',assists:'Assists',points:'Points',ppg:'Points per game',gaa:'Goals-against average',svPct:'Save percentage',wins:'Wins',losses:'Losses',shutouts:'Shutouts',ovr:'Overall',tier:'Tier'};
let pTableFilters={player:'',...Object.fromEntries(P_VALUES.map(k=>[k,''])),...Object.fromEntries(P_NUMERIC.map(k=>[k,{min:'',max:''}]))},pTableSort={key:'ovr',dir:'desc'},pOpenColumn=null,pPlayerType='skater',prospectSeasonView='d1';
const prospectSeasonLabel=()=>prospectSeasonView==='draft'?'Draft year':'D-1 year';
const PROSPECT_DRAFT_TEAM_OVERRIDES={
  'Carter Meyer':'Québec Remparts',
  'Sammy Nelson':'CHL team TBA',
  'Jamie Glance':'Saint John Sea Dogs',
  'Nolan Fitzhenry':'CHL team TBA',
  'Diego Gutierrez':'USNTDP Juniors',
  'Rocco Pelosi':'CHL team TBA',
  'Noah Davidson':'Medicine Hat Tigers',
  'Timothy Kazda':'CHL team TBA',
  'James Scantlebury':'CHL team TBA',
  'Ryerson Edgar':'Niagara IceDogs',
  'Eli McKamey':'Victoria Royals'
};
const FUTURE_COLLEGE_TEAMS=new Set(['Boston College','Boston University','Michigan Wolverines','Univ. of Michigan','Univ. of North Dakota','Univ. of Notre Dame']);
function futureCollegeTeamFor(p){return FUTURE_COLLEGE_TEAMS.has(p.team)?p.team:'';}
function prospectDraftTeamFor(p){
  if(PROSPECT_DRAFT_TEAM_OVERRIDES[p.name])return PROSPECT_DRAFT_TEAM_OVERRIDES[p.name];
  if(futureCollegeTeamFor(p)&&p.name!=='Landon Dupont')return p.statsTeam||'CHL team TBA';
  return p.team||p.statsTeam||'';
}
function prospectTeamFor(p){return prospectSeasonView==='draft'?prospectDraftTeamFor(p):(p.statsTeam||p.team||'');}
function prospectStatFor(p,key){return prospectSeasonView==='draft'&&PROSPECT_PRODUCTION_KEYS.includes(key)?'':p[key];}
function syncProspectSeasonToggles(){
  $$('#prospectSeasonToggle [data-prospect-season], #leaderSeasonToggle [data-prospect-season]').forEach(btn=>btn.classList.toggle('on',btn.dataset.prospectSeason===prospectSeasonView));
}
function setProspectSeasonView(view){
  prospectSeasonView=view==='draft'?'draft':'d1';
  pTableFilters.team='';
  PROSPECT_PRODUCTION_KEYS.forEach(key=>{if(pTableFilters[key])pTableFilters[key]={min:'',max:''};});
  closePlayerMenu();closeLeaderMenu();syncProspectSeasonToggles();renderPlayers();if($('#view-board').classList.contains('active'))renderBoard();
}
const pHeaderButton=(key,label,cls='')=>`<th class="${cls}"${key==='player'?' colspan="2"':''}><button class="th-filter p-th-filter" data-pcol="${key}">${label} <span${key==='player'?' class="header-icon"':''}>↕</span></button></th>`;
function renderPlayerTableFrame(){
  const goalie=pPlayerType==='goalie';
  $('#pCols').innerHTML=goalie?'<col class="p-photo"><col class="p-player"><col class="p-country"><col class="p-shot"><col class="p-height"><col class="p-weight"><col class="p-team"><col class="p-games"><col class="p-gaa"><col class="p-svpct"><col class="p-wins"><col class="p-losses"><col class="p-shutouts"><col class="p-overall"><col class="p-tier">':'<col class="p-photo"><col class="p-player"><col class="p-country"><col class="p-position"><col class="p-shot"><col class="p-height"><col class="p-weight"><col class="p-team"><col class="p-games"><col class="p-goals"><col class="p-assists"><col class="p-points"><col class="p-ppg"><col class="p-overall"><col class="p-tier">';
  const shared=`${pHeaderButton('player','Player')} ${pHeaderButton('country','Nationality')} ${goalie?'':pHeaderButton('pos','Position')} ${pHeaderButton('shot',goalie?'Catches':'Shoots','c')} ${pHeaderButton('height','Height','c')} ${pHeaderButton('weight','Weight','c')} ${pHeaderButton('team',prospectSeasonView==='draft'?'Draft Year Team':'D-1 Team')} ${pHeaderButton('games',prospectSeasonView==='draft'?'Draft GP':'D-1 GP','c')}`;
  const production=goalie?`${pHeaderButton('gaa','Goals-Against Average','c')} ${pHeaderButton('svPct','Save Percentage','c')} ${pHeaderButton('wins','Wins','c')} ${pHeaderButton('losses','Losses','c')} ${pHeaderButton('shutouts','Shutouts','c')}`:`${pHeaderButton('goals','Goals','c')} ${pHeaderButton('assists','Assists','c')} ${pHeaderButton('points','Points','c')} ${pHeaderButton('ppg','Points / Game','c')}`;
  $('#pHead').innerHTML=`<tr>${shared}${production}${pHeaderButton('ovr','Overall','c')}${pHeaderButton('tier','Tier')}</tr>`;
  $$('.players-table .p-th-filter').forEach(btn=>btn.onclick=e=>{e.stopPropagation();if(pOpenColumn===btn.dataset.pcol){closePlayerMenu();return;}renderPlayerMenu(btn.dataset.pcol,btn);});
}
function pColumnValue(p,key){ if((key==='ovr'||key==='tier')&&prospectSeasonView==='draft')return '';if(key==='ovr')return p._o;if(key==='tier')return tierOf(p._o).name;if(key==='height')return heightInches(p.height);if(key==='weight')return weightLbs(p.weight);if(key==='player')return p.name;if(key==='team')return prospectTeamFor(p);if(PROSPECT_PRODUCTION_KEYS.includes(key))return prospectStatFor(p,key);return p[key]; }
function pFilterValues(key){ if(key==='country')return [...new Set(state.players.flatMap(p=>String(p.country||'').split(/\s*\/\s*/)).filter(Boolean))].sort(); if(key==='pos')return POSITION_FILTERS.filter(pos=>state.players.some(p=>positionTokens(p.pos).includes(pos))); if(key==='tier')return TIERS.map(t=>t.name); return [...new Set(state.players.map(p=>pColumnValue(p,key)).filter(Boolean))].sort(); }
function updatePlayerHeaders(){ $$('.players-table .p-th-filter').forEach(btn=>{const key=btn.dataset.pcol,active=pTableSort&&pTableSort.key===key,filtered=P_NUMERIC.includes(key)?(pTableFilters[key].min!==''||pTableFilters[key].max!==''):pTableFilters[key]!=='';btn.classList.toggle('active',active);btn.classList.toggle('filtered',filtered);const icon=btn.querySelector('span');if(key==='player'&&!active)icon.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6.5"></circle><path d="m16 16 4 4"></path></svg>';else icon.textContent=active?(pTableSort.dir==='asc'?'↑':'↓'):'↕';}); }
function closePlayerMenu(){ $('#pColumnMenu').hidden=true;pOpenColumn=null; }
function renderPlayerMenu(key,anchor){
  const menu=$('#pColumnMenu'),numeric=P_NUMERIC.includes(key),valueColumn=P_VALUES.includes(key);
  const filter=key==='player'?`<label>Contains<input id="pTextFilter" type="text" value="${esc(pTableFilters.player)}" placeholder="Search player name"></label>`:valueColumn?`<label>Show<select id="pValueFilter"><option value="">All values</option>${pFilterValues(key).map(v=>`<option value="${esc(v)}" ${pTableFilters[key]===v?'selected':''}>${esc(v)}</option>`).join('')}</select></label>`:`<div class="column-range"><label>Minimum<input id="pMinFilter" type="number" value="${pTableFilters[key].min}" placeholder="Any"></label><label>Maximum<input id="pMaxFilter" type="number" value="${pTableFilters[key].max}" placeholder="Any"></label></div>`;
  const label=key==='team'?`${prospectSeasonLabel()} team`:P_LABELS[key];
  menu.innerHTML=`<div class="column-menu-head"><strong>${label}</strong><button id="pMenuClose">×</button></div><div class="column-sort"><button data-psort="asc">↑ Sort ascending</button><button data-psort="desc">↓ Sort descending</button></div><div class="column-menu-filter">${filter}</div><button class="column-clear" id="pClearColumn">Clear ${label} filter</button>${pTableSort?'<button class="column-clear clear-sort" id="pClearSort">Clear table sorting</button>':''}`;
  const rect=anchor.getBoundingClientRect();menu.style.left=Math.min(rect.left,window.innerWidth-255)+'px';menu.style.top=(rect.bottom+5)+'px';menu.hidden=false;pOpenColumn=key;menu.onclick=e=>e.stopPropagation();$('#pMenuClose').onclick=closePlayerMenu;
  $$('#pColumnMenu [data-psort]').forEach(b=>b.onclick=()=>{pTableSort={key,dir:b.dataset.psort};updatePlayerHeaders();renderPlayers();closePlayerMenu();});
  const text=$('#pTextFilter'),select=$('#pValueFilter'),min=$('#pMinFilter'),max=$('#pMaxFilter');if(text)text.oninput=()=>{pTableFilters.player=text.value;renderPlayers();};if(select)select.onchange=()=>{pTableFilters[key]=select.value;renderPlayers();};if(min)min.oninput=()=>{pTableFilters[key].min=min.value;renderPlayers();};if(max)max.oninput=()=>{pTableFilters[key].max=max.value;renderPlayers();};
  $('#pClearColumn').onclick=()=>{if(numeric)pTableFilters[key]={min:'',max:''};else pTableFilters[key]='';renderPlayers();renderPlayerMenu(key,anchor);};setTimeout(()=>{const focus=$('#pTextFilter')||$('#pValueFilter')||$('#pMinFilter');if(focus)focus.focus();},0);
  const clearSort=$('#pClearSort');if(clearSort)clearSort.onclick=()=>{pTableSort=null;renderPlayers();closePlayerMenu();};
}
document.addEventListener('click',e=>{if(!$('#pColumnMenu').hidden&&!e.target.closest('#pColumnMenu'))closePlayerMenu();});
function renderPlayers(){
  renderPlayerTableFrame();
  syncProspectSeasonToggles();
  let list=state.players.map(p=>({...p,_o:overall(p)})).filter(p=>pPlayerType==='goalie'?isGoalie(p):!isGoalie(p));const q=pTableFilters.player.trim().toLowerCase();
  list=list.filter(p=>(!q||p.name.toLowerCase().includes(q))&&P_VALUES.every(k=>{if(!pTableFilters[k])return true;if(k==='country')return String(p.country||'').split(/\s*\/\s*/).includes(pTableFilters[k]);if(k==='pos')return positionTokens(p.pos).includes(pTableFilters[k]);return String(pColumnValue(p,k))===pTableFilters[k];})&&P_NUMERIC.every(k=>{const f=pTableFilters[k],v=pColumnValue(p,k),missing=PROSPECT_PRODUCTION_KEYS.includes(k)&&!hasStat(v);if((f.min!==''||f.max!=='')&&missing)return false;return(f.min===''||Number(v)>=+f.min)&&(f.max===''||Number(v)<=+f.max);}));
  if(pTableSort)list.sort((a,b)=>{const av=pColumnValue(a,pTableSort.key),bv=pColumnValue(b,pTableSort.key),am=av===''||av==null,bm=bv===''||bv==null;if(am!==bm)return am?1:-1;const cmp=P_NUMERIC.includes(pTableSort.key)?Number(av)-Number(bv):String(av).localeCompare(String(bv));return pTableSort.dir==='asc'?cmp:-cmp;});
  updatePlayerHeaders();$('#pCount').textContent=`${list.length} ${list.length===1?'player':'players'}`;
  const b=$('#pBody');
  if(!list.length){ b.innerHTML=`<tr><td colspan="15" class="empty">No prospects match the current table filters.</td></tr>`; return; }
  b.innerHTML=list.map(p=>{ const t=tierOf(p._o),goalie=isGoalie(p),seasonTeam=prospectTeamFor(p);
    return `<tr data-id="${p.id}">
      <td style="width:48px">${thumb(p)}</td>
      <td><div class="pl"><div><div class="nm">${esc(p.name)}</div></div></div></td>
      <td><span class="nation-cell" title="${esc(p.country||'')}"><b>${flagFor(p.country)||'—'}</b><small>${esc(p.country||'')}</small></span></td>
      ${goalie?'':`<td><span class="posbadge">${esc(p.pos||'—')}</span></td>`}
      <td class="c">${esc(p.shot||'—')}</td><td class="c tnum">${esc(p.height||'—')}</td><td class="c tnum">${esc(p.weight||'—')}</td>
      <td><span class="team-cell">${teamMark(seasonTeam,'table-team-mark',p.country)}<span>${esc(seasonTeam||'')}</span></span></td>
      <td class="c statnum tnum">${showStat(prospectStatFor(p,'games'))}</td>${goalie?`<td class="c statnum tnum">${showStat(prospectStatFor(p,'gaa'),2)}</td><td class="c statnum strong tnum">${hasStat(prospectStatFor(p,'svPct'))?Number(prospectStatFor(p,'svPct')).toFixed(3).replace(/^0/,''):''}</td><td class="c statnum tnum">${showStat(prospectStatFor(p,'wins'))}</td><td class="c statnum tnum">${showStat(prospectStatFor(p,'losses'))}</td><td class="c statnum tnum">${showStat(prospectStatFor(p,'shutouts'))}</td>`:`<td class="c statnum tnum">${showStat(prospectStatFor(p,'goals'))}</td><td class="c statnum tnum">${showStat(prospectStatFor(p,'assists'))}</td><td class="c statnum strong tnum">${showStat(prospectStatFor(p,'points'))}</td><td class="c statnum tnum">${showStat(prospectStatFor(p,'ppg'),2)}</td>`}
      <td class="c">${prospectSeasonView==='draft'?'':`<span class="ovrn tnum">${p._o.toFixed(1)}</span>`}</td>
      <td class="tier-cell">${prospectSeasonView==='draft'?'':`<span class="chip" style="background:${t.color}">${t.name}</span>`}</td>
    </tr>`; }).join('');
  $$('#pBody tr[data-id]').forEach(tr=>tr.onclick=()=>openView(tr.dataset.id));
  hydrateTeamLogos($('#pBody'));
}
$('#playerTypeToggle').onclick=e=>{const btn=e.target.closest('[data-type]');if(!btn)return;pPlayerType=btn.dataset.type;segOn('#playerTypeToggle',btn);pTableFilters={player:'',...Object.fromEntries(P_VALUES.map(k=>[k,''])),...Object.fromEntries(P_NUMERIC.map(k=>[k,{min:'',max:''}]))};pTableSort={key:'ovr',dir:'desc'};closePlayerMenu();renderPlayers();};
$$('#prospectSeasonToggle, #leaderSeasonToggle').forEach(toggle=>toggle.addEventListener('click',e=>{const btn=e.target.closest('[data-prospect-season]');if(btn)setProspectSeasonView(btn.dataset.prospectSeason);}));

function renderStock(){
  const baseline=typeof STOCK_WATCH_BASELINE==='object'?STOCK_WATCH_BASELINE:{};
  const movers=state.players.filter(p=>Number.isFinite(Number(baseline[p.name]))).map(p=>({...p,_o:overall(p),_prev:Number(baseline[p.name])})).map(p=>({...p,_delta:Math.round((p._o-p._prev)*10)/10}));
  const row=p=>`<button class="stock-row" data-id="${p.id}">${thumb(p,'stock-thumb')}<span class="stock-player"><strong>${esc(p.name)} ${flagFor(p.country)?`<span class="inline-flags">${flagFor(p.country)}</span>`:''}</strong><small>${esc(p.pos||'—')} · ${esc(p.team||'')}</small></span><span class="stock-scores"><b>${p._o.toFixed(1)}</b><small>was ${p._prev.toFixed(1)}</small></span><span class="stock-delta ${p._delta>0?'up':'down'}">${p._delta>0?'+':''}${p._delta.toFixed(1)}</span></button>`;
  const risers=movers.filter(p=>p._delta>0).sort((a,b)=>b._delta-a._delta).slice(0,10),fallers=movers.filter(p=>p._delta<0).sort((a,b)=>a._delta-b._delta).slice(0,10);
  $('#risers').innerHTML=risers.map(row).join('')||'<div class="stock-empty">No score increases recorded yet.</div>';
  $('#fallers').innerHTML=fallers.map(row).join('')||'<div class="stock-empty">No score decreases recorded yet.</div>';
  $$('#view-stock [data-id]').forEach(b=>b.onclick=()=>openView(b.dataset.id));
}

function renderHome(){
  const counts={};state.players.forEach(p=>String(p.country||'').split(/\s*\/\s*/).filter(Boolean).forEach(country=>counts[country]=(counts[country]||0)+1));
  const countries=Object.entries(counts).sort((a,b)=>b[1]-a[1]||a[0].localeCompare(b[0])),max=countries[0]?.[1]||1;
  $('#homeProspectCount').textContent=state.players.length;
  $('#homeCountryCount').textContent=countries.length;
  $('#homeCountryBars').innerHTML=countries.map(([country,count])=>`<button data-country="${esc(country)}" style="--country-share:${Math.max(7,count/max*100).toFixed(1)}%" aria-label="Show ${count} players from ${esc(country)}"><span>${flagFor(country)} ${esc(country)}</span><i><b></b></i><strong>${count}</strong></button>`).join('');
  $$('#homeCountryBars [data-country]').forEach(btn=>btn.onclick=()=>filterPlayersByCountry(btn.dataset.country));
}
function filterPlayersByCountry(country){
  pTableFilters.country=country;
  const tab=$('.tab[data-view="players"]'); if(tab)tab.click(); renderPlayers();
}

let draft26Sort={key:'pick',dir:'asc'},draft26OpenColumn=null,draft26SeasonView='draft';
const D26_NUMERIC=['pick','round','games','goals','assists','points','ppg','gaa','svPct'];
const D26_VALUES=['country','position','nhlTeam','team','league'];
const D26_LABELS={pick:'Pick',round:'Round',player:'Player',country:'Nationality',position:'Position',nhlTeam:'Drafted by',team:'2025–26 club',league:'League',games:'Games played',goals:'Goals',assists:'Assists',points:'Points',ppg:'Points per game',gaa:'Goals-against average',svPct:'Save percentage'};
let draft26Filters={player:'',position:'',nhlTeam:'',team:'',league:'',country:'',...Object.fromEntries(D26_NUMERIC.map(k=>[k,{min:'',max:''}]))};
const draft26Country=player=>DRAFT_2026_COUNTRIES?.[player.pick]||'';
const draft26Value=(player,key)=>key==='country'?draft26Country(player):(player[key]??'');
const draft26Label=key=>key==='team'&&draft26SeasonView==='d1'?'D-1 club':D26_LABELS[key];
const draft26D1Rows=()=>typeof DRAFT_2026_D1_DATA!=='undefined'&&Array.isArray(DRAFT_2026_D1_DATA)?DRAFT_2026_D1_DATA:[];
const draft26D1Map=()=>new Map(draft26D1Rows().flatMap(row=>[[`pick:${row.pick}`,row],[`player:${String(row.player||'').toLowerCase()}`,row]]));
const draft26FirstValue=value=>String(value||'').split(/\s*\/\s*/).find(Boolean)||'';
const draft26LogoTeam=d1=>{
  if(d1?.logoTeam)return d1.logoTeam;
  const lines=Array.isArray(d1?.lines)?d1.lines:[];
  return (lines.find(line=>line.team&&!/\b(all|u1[6789]|u20)\b/i.test(line.team)&&!/(Canada|USA|Sweden|Finland|Czechia|Russia|Slovakia|Latvia|Denmark|Germany|Norway|Switzerland|Belarus|Hungary|Lithuania|Moldova)\s+U\d+/i.test(line.team))||lines.find(line=>line.team)||{}).team||d1?.team||'';
};
function draft26DisplayRow(player,d1Map=draft26D1Map()){
  if(draft26SeasonView!=='d1')return player;
  const d1=d1Map.get(`pick:${player.pick}`)||d1Map.get(`player:${String(player.player||'').toLowerCase()}`);
  return {...player,team:d1?.team||'',logoTeam:d1?draft26LogoTeam(d1):'',league:d1?.league||'',games:d1?.games??'',goals:d1?.goals??'',assists:d1?.assists??'',points:d1?.points??'',ppg:d1?.ppg??'',gaa:d1?.gaa??'',svPct:d1?.svPct??'',_d1Missing:!d1};
}
const DRAFT26_LEAGUE_LOGOS={OHL:'assets/leagues/ohl.png',WHL:'assets/leagues/whl.gif',USHL:'assets/leagues/ushl.png',QMJHL:'assets/leagues/qmjhl.png',NCAA:'assets/leagues/ncaa.svg',NTDP:'assets/teams/u-s-national-u18-team.gif',SHL:'assets/leagues/shl.svg',Liiga:'assets/leagues/liiga.svg',HockeyAllsvenskan:'assets/leagues/hockeyallsvenskan.svg','HockeyAllsv...':'assets/leagues/hockeyallsvenskan.svg',NAHL:'assets/leagues/nahl.svg',KHL:'assets/leagues/khl.png',GOJHL:'assets/leagues/gojhl.png'};
const DRAFT26_LEAGUE_COUNTRIES={OHL:'Canada',WHL:'Canada',QMJHL:'Canada',USHL:'USA',MHL:'Russia','U20 Nationell':'Sweden','J20 Nationell':'Sweden','J18 Region':'Sweden','J18 Nationell':'Sweden','J18 Div.1':'Sweden','U20 SM-sarja':'Finland','U18 SM-sarja':'Finland','U20 Mestis':'Finland','U18 Mestis':'Finland',NTDP:'USA','USHS-Prep':'USA','USHS-MN':'USA',Liiga:'Finland',Slovakia:'Slovakia','Slovakia U18':'Slovakia','Slovakia U20':'Slovakia','Czechia U17':'Czechia','Czechia U20':'Czechia',HockeyAllsvenskan:'Sweden','HockeyAllsv...':'Sweden',VHL:'Russia',KHL:'Russia',PHC:'Russia',NL:'Switzerland',NAHL:'USA',BCHL:'Canada',AJHL:'Canada',CCHL:'Canada',OJHL:'Canada',QM18AAA:'Canada','AEHL U18':'Canada','SMAAAHL':'Canada','CSSHL U18':'Canada','U18 AAA':'Canada','16U AAA':'USA','18U AAA':'USA','AYHL 16U':'USA','BEAST 18U':'USA',MPHL:'USA',UMHSEHL:'USA','Steel Icebreaker U16':'USA','Russia U17':'Russia','Russia U18':'Russia','Belarus Vysshaya':'Belarus','Belarus U18':'Belarus','WJC-18 D1A':'Denmark','U20-Elit':'Switzerland',GOJHL:'Canada','Division 2':'Sweden',Denmark:'Denmark',Latvia:'Latvia',Czechia:'Czechia'};
const leagueMark=(league,cls='')=>{const logo=DRAFT26_LEAGUE_LOGOS[league],fallback=flagFor(DRAFT26_LEAGUE_COUNTRIES[league]);return `<span class="league-mark ${cls} ${!logo&&fallback?'flag-mark':''}" aria-hidden="true"><i>${fallback||esc(String(league||'—').replace(/[^A-Za-z0-9]/g,'').slice(0,4))}</i>${logo?`<img src="${esc(logo)}" alt="" loading="lazy" onerror="this.remove()">`:''}</span>`;};
const draft26Portrait=player=>{const source=/^No selection/i.test(player.player)?'':((typeof DRAFT_2026_HEADSHOTS==='object'&&DRAFT_2026_HEADSHOTS[player.player])||(typeof DRAFT_2026_HEADSHOTS_BY_PICK==='object'&&DRAFT_2026_HEADSHOTS_BY_PICK[player.pick])||'');return `<span class="draft26-photo" aria-hidden="true"><i>${esc(initials(player.player))}</i>${source?`<img src="${esc(source)}" alt="" loading="lazy" decoding="async" onerror="this.remove()">`:''}</span>`;};
const draft26PlayerCell=player=>{const profile=typeof DRAFT_2026_PROFILES_BY_PICK==='object'?DRAFT_2026_PROFILES_BY_PICK[player.pick]:null,content=`${draft26Portrait(player)}<strong>${esc(player.player)}</strong>`;return profile?`<a class="draft26-player" href="${esc(profile.url)}" target="_blank" rel="noopener" title="Photo: ${esc(profile.credit)} · Elite Prospects profile">${content}</a>`:`<span class="draft26-player">${content}</span>`;};
const DRAFT26_NATIONS=[['Canada',71,'can'],['USA',54,'usa'],['Russia',26,'rus'],['Sweden',24,'swe'],['Czechia',13,'cze'],['Finland',13,'fin'],['Slovakia',8,'svk'],['Latvia',4,'lva'],['Belarus',3,'blr'],['Denmark',1,'dnk'],['Germany',1,'deu'],['Hungary',1,'hun'],['Lithuania',1,'ltu'],['Moldova',1,'mda'],['Norway',1,'nor'],['Switzerland',1,'che']];
const DRAFT26_LEAGUES=[['OHL',45,'ohl'],['WHL',37,'whl'],['USHL',25,'ushl'],['QMJHL',20,'qmjhl'],['MHL',16,'mhl'],['U20 Nationell',16,'u20-nationell'],['U20 SM-sarja',12,'u20-sm-sarja'],['NCAA',11,'ncaa'],['NTDP',9,'ntdp'],['SHL',5,'shl'],['USHS-Prep',4,'ushs-prep'],['Liiga',3,'liiga'],['Slovakia',3,'slovakia'],['Czechia U20',2,'czechia-u20'],['HockeyAllsvenskan',2,'hockeyallsvenskan'],['USHS-MN',2,'ushs-mn'],['VHL',2,'vhl'],['KHL',1,'khl'],['PHC',1,'phc'],['NL',1,'nl'],['NAHL',1,'nahl'],['U18 AAA',1,'u18-aaa'],['GOJHL',1,'gojhl'],['Division 2',1,'division-2'],['Denmark',1,'denmark'],['Latvia',1,'latvia'],['Czechia',1,'czechia']];
function renderDraft26Breakdown(){
  $('#draft26Nations').innerHTML=DRAFT26_NATIONS.map(([label,count])=>`<button type="button" data-d26-country="${esc(label)}"><b class="draft26-chip-flag">${flagFor(label)}</b><span>${esc(label)}</span><strong>${count}</strong><small>${count===1?'plr':'plrs'}</small></button>`).join('');
  $('#draft26Leagues').innerHTML=DRAFT26_LEAGUES.map(([label,count])=>`<button type="button" data-d26-league="${esc(label)}">${leagueMark(label,'chip-league-mark')}<span>${esc(label)}</span><strong>${count}</strong><small>${count===1?'plr':'plrs'}</small></button>`).join('');
  $$('#draft26Nations [data-d26-country]').forEach(button=>button.onclick=()=>{draft26Filters.country=draft26Filters.country===button.dataset.d26Country?'':button.dataset.d26Country;renderDraft2026();});
  $$('#draft26Leagues [data-d26-league]').forEach(button=>button.onclick=()=>{draft26Filters.league=draft26Filters.league===button.dataset.d26League?'':button.dataset.d26League;renderDraft2026();});
}
const draft26FilterValues=key=>{const d1Map=draft26D1Map();return [...new Set(DRAFT_2026_DATA.map(p=>draft26Value(draft26DisplayRow(p,d1Map),key)).filter(v=>v!==''&&v!=null))].sort((a,b)=>String(a).localeCompare(String(b)));};
function updateDraft26Headers(){
  $$('#view-draft2026 [data-d26-sort]').forEach(button=>{const key=button.dataset.d26Sort,active=draft26Sort.key===key,filtered=D26_NUMERIC.includes(key)?(draft26Filters[key].min!==''||draft26Filters[key].max!==''):draft26Filters[key]!=='';button.classList.add('th-filter','d26-th-filter');button.classList.toggle('active',active);button.classList.toggle('filtered',filtered);let icon=button.querySelector('span');if(!icon){icon=document.createElement('span');button.appendChild(icon);}icon.textContent=active?(draft26Sort.dir==='asc'?'↑':'↓'):'↕';});
}
function closeDraft26Menu(){$('#draft26ColumnMenu').hidden=true;draft26OpenColumn=null;}
function renderDraft26Menu(key,anchor){
  const menu=$('#draft26ColumnMenu'),numeric=D26_NUMERIC.includes(key),valueColumn=D26_VALUES.includes(key);
  const filter=key==='player'?`<label>Contains<input id="d26TextFilter" type="text" value="${esc(draft26Filters.player)}" placeholder="Search player name"></label>`:valueColumn?`<label>Show<select id="d26ValueFilter"><option value="">All values</option>${draft26FilterValues(key).map(v=>`<option value="${esc(v)}" ${String(draft26Filters[key])===String(v)?'selected':''}>${esc(v)}</option>`).join('')}</select></label>`:`<div class="column-range"><label>Minimum<input id="d26MinFilter" type="number" value="${draft26Filters[key].min}" placeholder="Any"></label><label>Maximum<input id="d26MaxFilter" type="number" value="${draft26Filters[key].max}" placeholder="Any"></label></div>`;
  menu.innerHTML=`<div class="column-menu-head"><strong>${draft26Label(key)}</strong><button id="d26MenuClose">×</button></div><div class="column-sort"><button data-d26-menu-sort="asc">↑ Sort ascending</button><button data-d26-menu-sort="desc">↓ Sort descending</button></div><div class="column-menu-filter">${filter}</div><button class="column-clear" id="d26ClearColumn">Clear ${draft26Label(key)} filter</button>`;
  const rect=anchor.getBoundingClientRect();menu.style.left=Math.min(rect.left,window.innerWidth-255)+'px';menu.style.top=(rect.bottom+5)+'px';menu.hidden=false;draft26OpenColumn=key;menu.onclick=e=>e.stopPropagation();$('#d26MenuClose').onclick=closeDraft26Menu;
  $$('#draft26ColumnMenu [data-d26-menu-sort]').forEach(button=>button.onclick=()=>{draft26Sort={key,dir:button.dataset.d26MenuSort};renderDraft2026();closeDraft26Menu();});
  const text=$('#d26TextFilter'),select=$('#d26ValueFilter'),min=$('#d26MinFilter'),max=$('#d26MaxFilter');if(text)text.oninput=()=>{draft26Filters.player=text.value;renderDraft2026();};if(select)select.onchange=()=>{draft26Filters[key]=select.value;renderDraft2026();};if(min)min.oninput=()=>{draft26Filters[key].min=min.value;renderDraft2026();};if(max)max.oninput=()=>{draft26Filters[key].max=max.value;renderDraft2026();};
  $('#d26ClearColumn').onclick=()=>{if(numeric)draft26Filters[key]={min:'',max:''};else draft26Filters[key]='';renderDraft2026();renderDraft26Menu(key,anchor);};setTimeout(()=>($('#d26TextFilter')||$('#d26ValueFilter')||$('#d26MinFilter'))?.focus(),0);
}
function renderDraft2026(){
  const source=Array.isArray(DRAFT_2026_DATA)?DRAFT_2026_DATA:[],d1Map=draft26D1Map(),hasD1=draft26SeasonView==='d1'&&d1Map.size>0;
  const data=source.map(player=>draft26DisplayRow(player,d1Map));
  let rows=data.filter(player=>(!draft26Filters.country||draft26Country(player)===draft26Filters.country)&&(!draft26Filters.player||player.player.toLowerCase().includes(draft26Filters.player.toLowerCase()))&&D26_VALUES.every(key=>!draft26Filters[key]||String(draft26Value(player,key))===String(draft26Filters[key]))&&D26_NUMERIC.every(key=>{const f=draft26Filters[key],v=draft26Value(player,key);if((f.min!==''||f.max!=='')&&!hasStat(v))return false;return(f.min===''||Number(v)>=+f.min)&&(f.max===''||Number(v)<=+f.max);}));
  rows.sort((a,b)=>{const av=draft26Value(a,draft26Sort.key),bv=draft26Value(b,draft26Sort.key),missingA=av==='',missingB=bv==='';if(missingA!==missingB)return missingA?1:-1;const comparison=typeof av==='number'&&typeof bv==='number'?av-bv:String(av).localeCompare(String(bv));return draft26Sort.dir==='asc'?comparison:-comparison;});
  $('#draft26Count').textContent=`${rows.length} ${rows.length===1?'player':'players'}${draft26SeasonView==='d1'&&!hasD1?' · D-1 pending':''}`;
  const note=$('#draft26DataNote');if(note){note.hidden=!(draft26SeasonView==='d1'&&!hasD1);note.textContent='D-1 team, league and stats are not included in the current 2026 dataset yet. The toggle is ready for DRAFT_2026_D1_DATA once those rows are added.';}
  const title=$('#draft26SeasonTitle'),help=$('#draft26SeasonHelp'),seasonNote=$('#draft26SeasonNote'),clubHead=$('#draft26ClubHead');
  if(title)title.textContent=draft26SeasonView==='d1'?'D-1 season production':'Draft year production';
  if(help)help.textContent=draft26SeasonView==='d1'?(hasD1?'Showing the season before each player was drafted.':'D-1 view is selected, but no D-1 stat file is loaded yet.'):'Showing the 2025–26 team and league from the current dataset.';
  if(seasonNote)seasonNote.textContent=draft26SeasonView==='d1'?'✓ D-1 season view':'✓ 2025–26 club production';
  if(clubHead)clubHead.childNodes[0].nodeValue=draft26SeasonView==='d1'?'D-1 club ':'2025–26 club ';
  $$('#draft26SeasonToggle [data-d26-season]').forEach(button=>button.classList.toggle('on',button.dataset.d26Season===draft26SeasonView));
  $('#draft26Body').innerHTML=rows.map(player=>`<tr class="${player.position==='G'?'draft26-goalie':''} ${player._d1Missing?'draft26-missing-d1':''}"><td><b class="draft26-pick">${player.pick}</b></td><td>${player.round}</td><td>${draft26PlayerCell(player)}</td><td><span class="draft26-country"><b title="${esc(draft26Country(player))}">${flagFor(draft26Country(player))||'—'}</b><span>${esc(draft26Country(player)||'—')}</span></span></td><td><span class="posbadge">${esc(player.position||'—')}</span></td><td><span class="draft26-team">${teamMark(player.nhlTeam,'draft26-nhl-mark')}<span>${esc(player.nhlTeam||'—')}</span></span></td><td><span class="draft26-team">${player.team?teamMark(player.logoTeam||player.team,'draft26-club-mark',DRAFT26_LEAGUE_COUNTRIES[draft26FirstValue(player.league)]):''}<span>${esc(player.team||(player._d1Missing?'D-1 data needed':'—'))}</span></span></td><td><span class="draft26-league-cell">${player.league?leagueMark(draft26FirstValue(player.league),'table-league-mark'):''}<span>${esc(player.league||(player._d1Missing?'Pending':'—'))}</span></span></td><td>${showStat(player.games)||'—'}</td><td>${showStat(player.goals)||'—'}</td><td>${showStat(player.assists)||'—'}</td><td><b>${showStat(player.points)||'—'}</b></td><td>${showStat(player.ppg,2)||'—'}</td><td>${showStat(player.gaa,2)||'—'}</td><td>${hasStat(player.svPct)?Number(player.svPct).toFixed(3).replace(/^0/,''):'—'}</td></tr>`).join('')||'<tr><td colspan="15" class="empty">No 2026 draft records match these filters.</td></tr>';
  updateDraft26Headers();$$('#draft26Nations [data-d26-country]').forEach(button=>button.classList.toggle('active',button.dataset.d26Country===draft26Filters.country));$$('#draft26Leagues [data-d26-league]').forEach(button=>button.classList.toggle('active',button.dataset.d26League===draft26Filters.league));
}
renderDraft26Breakdown();
$$('#view-draft2026 [data-d26-sort]').forEach(button=>button.onclick=e=>{e.stopPropagation();const key=button.dataset.d26Sort;if(draft26OpenColumn===key){closeDraft26Menu();return;}renderDraft26Menu(key,button);});
$('#draft26SeasonToggle')?.addEventListener('click',e=>{const button=e.target.closest('[data-d26-season]');if(!button)return;draft26SeasonView=button.dataset.d26Season;draft26Filters.team='';draft26Filters.league='';renderDraft2026();});
document.addEventListener('click',e=>{if(!$('#draft26ColumnMenu').hidden&&!e.target.closest('#draft26ColumnMenu'))closeDraft26Menu();});

const FORUM_KEY='draftscout_forum_v2';
const DEFAULT_TOPICS=[];
let forumTopics=(()=>{try{const saved=JSON.parse(localStorage.getItem(FORUM_KEY));return Array.isArray(saved)?saved:DEFAULT_TOPICS;}catch(e){return DEFAULT_TOPICS;}})();
let forumCategory='all';
const AUTH_TOKEN_KEY='netprospect_auth_token';
let authMode='login',currentUser=null,forumRemote=false;
const FIREBASE_CONFIG=window.__FIREBASE_CONFIG__||null;
let firebaseApp=null,firebaseAuth=null,firebaseDb=null,firebaseAuthReady=null;
function initFirebase(){
  if(firebaseApp!==null)return Boolean(firebaseApp);
  if(typeof firebase==='undefined'||!FIREBASE_CONFIG?.apiKey){firebaseApp=false;return false;}
  firebaseApp=firebase.apps.length?firebase.app():firebase.initializeApp(FIREBASE_CONFIG);
  firebaseAuth=firebase.auth();
  firebaseDb=firebase.database();
  firebaseAuthReady=new Promise(resolve=>{
    let unsubscribe=()=>{};
    unsubscribe=firebaseAuth.onAuthStateChanged(async user=>{
      try{currentUser=user?await firebaseLoadUser(user):null;}
      catch(e){currentUser=null;}
      updateAuthUI();
      if(unsubscribe)unsubscribe();
      resolve(currentUser);
    });
  });
  return true;
}
const getAuthToken=()=>{try{return localStorage.getItem(AUTH_TOKEN_KEY)||'';}catch(e){return '';}};
const setAuthToken=token=>{try{token?localStorage.setItem(AUTH_TOKEN_KEY,token):localStorage.removeItem(AUTH_TOKEN_KEY);}catch(e){}};
const forumSave=()=>{if(forumRemote)return;try{localStorage.setItem(FORUM_KEY,JSON.stringify(forumTopics));}catch(e){}};
async function apiRequest(path,{method='GET',body,auth=false}={}){
  const headers={'Content-Type':'application/json'},token=getAuthToken();
  if(auth&&token)headers.Authorization=`Bearer ${token}`;
  const response=await fetch(path,{method,headers,body:body?JSON.stringify(body):undefined});
  const data=await response.json().catch(()=>({}));
  if(!response.ok)throw new Error(data.error||'Request failed.');
  return data;
}
function setAuthMessage(message=''){const el=$('#authError');if(el)el.textContent=message;}
function updateAuthUI(){
  const btn=$('#authBtn');if(!btn)return;
  btn.innerHTML=currentUser?`<span>◎</span> ${esc(currentUser.username)}`:'<span>◎</span> Sign in';
  $$('#authMode [data-auth-mode]').forEach(button=>button.classList.toggle('on',button.dataset.authMode===authMode));
  const submit=$('#authSubmit');if(submit)submit.textContent=authMode==='signup'?'Create account':'Sign in';
  applyAccessControl();
}
function requireAuth(message='Sign in to post in Scout Room.'){
  if(currentUser)return true;
  setAuthMessage(message);$('#authOverlay').classList.add('show');setTimeout(()=>$('#authUsername')?.focus(),0);return false;
}
async function loadAccount(){
  if(initFirebase()){
    await firebaseAuthReady;
    updateAuthUI();
    return;
  }
  currentUser=null;
  updateAuthUI();
}
async function loadForumRemote(){
  if(initFirebase()){
    try{
      await firebaseAuthReady;
      const query=isAdmin()
        ?firebaseDb.ref('forumTopics').orderByChild('createdAt').limitToLast(100)
        :firebaseDb.ref('forumTopics').orderByChild('pending').equalTo(false).limitToLast(100);
      const snapshot=await query.once('value');
      const topics=[];
      snapshot.forEach(child=>topics.push(firebaseTopicOut(child.key,child.val())));
      forumTopics=topics.reverse();
      forumRemote=true;
      renderForum();
      return;
    }catch(e){forumRemote=false;renderForum();return;}
  }
  forumRemote=false;
  renderForum();
}
const normalizeForumText=s=>String(s||'').normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[@4]/g,'a').replace(/[3]/g,'e').replace(/[1!]/g,'i').replace(/[0]/g,'o').replace(/[$5]/g,'s').replace(/[7]/g,'t');
const FORUM_BLOCK_PATTERNS=[
  /\b(fuck|fucker|fucking|shit|bullshit|bitch|cunt|asshole|dickhead|motherfucker)s?\b/i,
  /\b(nigg(?:er|a)|fagg?ot|kike|spic|chink|retard(?:ed)?)s?\b/i,
  /\b(white power|heil hitler|inferior race|subhuman)\b/i,
  /\b(kill|gas|exterminate)\s+(all|every|the)\b/i,
  /\bgo back to (your|their) country\b/i
];
function moderateForumText(text){ const normalized=normalizeForumText(text); return FORUM_BLOCK_PATTERNS.some(rx=>rx.test(normalized)); }
const usernameKey=username=>String(username||'').trim().toLowerCase();
const usernameEmail=username=>`${usernameKey(username)}@netprospect.local`;
function validateFirebaseUsername(username){
  const clean=String(username||'').trim();
  if(!/^[a-zA-Z0-9_]{3,24}$/.test(clean))throw new Error('Usernames must be 3-24 letters, numbers, or underscores.');
  if(moderateForumText(clean))throw new Error('That username is not allowed.');
  return clean;
}
function firebaseFriendlyError(error){
  const code=error?.code||'';
  if(code.includes('email-already-in-use'))return 'That username is already taken.';
  if(code.includes('invalid-credential')||code.includes('wrong-password')||code.includes('user-not-found'))return 'Incorrect username or password.';
  if(code.includes('weak-password'))return 'Passwords must be at least 8 characters.';
  if(code.includes('permission-denied'))return 'Firebase rules are blocking this action.';
  return error?.message||'Firebase request failed.';
}
function firebasePublicUser(uid,profile={}){
  return {id:uid,username:profile.username||'Scout Room member',role:profile.role||'member'};
}
async function firebaseLoadUser(user){
  const snap=await firebaseDb.ref(`users/${user.uid}`).once('value');
  return firebasePublicUser(user.uid,snap.val()||{});
}
async function firebaseSignup(username,password){
  const clean=validateFirebaseUsername(username);
  if(String(password||'').length<8)throw new Error('Passwords must be at least 8 characters.');
  const credential=await firebaseAuth.createUserWithEmailAndPassword(usernameEmail(clean),password);
  const user=credential.user;
  const profile={username:clean,usernameKey:usernameKey(clean),role:'member',createdAt:Date.now()};
  await firebaseDb.ref().update({
    [`users/${user.uid}`]:profile,
    [`usernames/${profile.usernameKey}`]:{uid:user.uid,username:clean}
  });
  currentUser=firebasePublicUser(user.uid,profile);
  return currentUser;
}
async function firebaseLogin(username,password){
  const clean=validateFirebaseUsername(username);
  const credential=await firebaseAuth.signInWithEmailAndPassword(usernameEmail(clean),password);
  currentUser=await firebaseLoadUser(credential.user);
  return currentUser;
}
function firebaseTopicOut(id,topic={}){
  const commentsRaw=topic.comments||{};
  const comments=Array.isArray(commentsRaw)?commentsRaw.filter(Boolean):Object.entries(commentsRaw).map(([commentId,comment])=>({id:commentId,...comment}));
  comments.sort((a,b)=>Number(a.createdAt||0)-Number(b.createdAt||0));
  return {
    id,
    title:topic.title||'Untitled',
    body:topic.body||'',
    category:topic.category||'Mock Drafts',
    player:topic.player||'',
    team:topic.team||'',
    pos:topic.pos||'',
    country:topic.country||'',
    source:topic.source||'',
    created:topic.created||'Recently',
    pending:Boolean(topic.pending),
    approved:Boolean(topic.approved),
    views:Number(topic.views||0),
    likes:Number(topic.likes||0),
    author:topic.author||null,
    comments:comments.map(comment=>({
      id:String(comment.id||''),
      body:comment.body||'',
      created:comment.created||'Recently',
      author:comment.author||null
    }))
  };
}
async function firebaseCreateTopic(topic){
  if(!currentUser)throw new Error('Sign in required.');
  const ref=firebaseDb.ref('forumTopics').push();
  const payload={...topic,createdAt:Date.now(),updatedAt:Date.now(),views:0,likes:0,comments:{},author:currentUser};
  await ref.set(payload);
  return firebaseTopicOut(ref.key,payload);
}
async function firebaseLikeTopic(id){
  await firebaseDb.ref(`forumTopics/${id}/likes`).transaction(value=>Number(value||0)+1);
  const snap=await firebaseDb.ref(`forumTopics/${id}`).once('value');
  return firebaseTopicOut(id,snap.val()||{});
}
async function firebaseCommentTopic(id,body){
  if(!currentUser)throw new Error('Sign in required.');
  const ref=firebaseDb.ref(`forumTopics/${id}/comments`).push();
  await ref.set({body,created:'Just now',createdAt:Date.now(),author:currentUser});
  await firebaseDb.ref(`forumTopics/${id}/updatedAt`).set(Date.now());
  const snap=await firebaseDb.ref(`forumTopics/${id}`).once('value');
  return firebaseTopicOut(id,snap.val()||{});
}
const forumEmpty=copy=>`<div class="lane-empty">${esc(copy)}</div>`;
const reportScore=t=>Number(t.views||0)+Number(t.likes||0)*3;
function reportPreview(t){return `<button class="lane-post"><span>${esc(t.title.replace(/^Scouting report:\s*/i,''))}</span><small>${esc(t.body)}</small><b>${reportScore(t)} reads</b></button>`;}
function mockPickLines(body){return String(body||'').split(/\r?\n/).map(line=>line.trim()).filter(Boolean).map((line,index)=>{const match=line.match(/^(\d+)[.)]\s*(.+)$/);return {number:match?Number(match[1]):index+1,text:match?match[2]:line};});}
function mockPickPlayer(text){const haystack=normalizeForumText(text);return [...state.players].sort((a,b)=>b.name.length-a.name.length).find(player=>haystack.includes(normalizeForumText(player.name)))||null;}
function mockPickCompact(p){const player=mockPickPlayer(p.text);return `<i><b>${p.number}</b>${player?thumb(player,'mock-pick-photo'):`<span class="mock-pick-photo mock-pick-fallback">?</span>`}<em><strong>${esc(player?.name||p.text)}</strong>${player?`<small>${esc(player.team||player.pos||'Prospect')}</small>`:''}</em></i>`;}
function mockPreview(t){const count=(t.comments||[]).length,likes=Number(t.likes||0),picks=mockPickLines(t.body),preview=picks.slice(0,3),author=t.author?.username||'Scout Room member';return `<article class="mock-room-card" data-mock-id="${esc(t.id)}"><button class="mock-room-open" type="button" data-mock-open="${esc(t.id)}"><span>${esc(t.title)}</span><small class="mock-room-author">By ${esc(author)}</small><div class="mock-room-preview">${preview.map(mockPickCompact).join('')}</div><small>${picks.length} ${picks.length===1?'pick':'picks'} · Open full board</small></button><div class="mock-room-actions"><button type="button" data-mock-like="${esc(t.id)}">Like <b>${likes}</b></button><button type="button" data-mock-open="${esc(t.id)}">${count} ${count===1?'comment':'comments'}</button></div></article>`;}
function approvedPreview(t){return `<button class="lane-post"><span>${esc(t.player||t.title.replace(/^Prospect nomination:\s*/i,''))}</span><small>${esc(t.team||t.body||'Accepted for administrator review')}</small><b>Accepted · ${esc(t.created||'Recently')}</b></button>`;}
function renderForum(){
  const reports=forumTopics.filter(t=>t.category==='Scouting Report'&&!t.pending).sort((a,b)=>reportScore(b)-reportScore(a)).slice(0,3);
  const mocks=forumTopics.filter(t=>t.category==='Mock Drafts').sort((a,b)=>Number(b.createdAt||0)-Number(a.createdAt||0));
  const approved=forumTopics.filter(t=>t.category==='Player Submission'&&t.approved).slice(0,3);
  const setForumCount=(id,value)=>{const el=$('#'+id);if(el)el.textContent=value;};
  setForumCount('forumReportCount',forumTopics.filter(t=>t.category==='Scouting Report'&&!t.pending).length);
  setForumCount('forumMockCount',forumTopics.filter(t=>t.category==='Mock Drafts').length);
  setForumCount('forumSubmissionCount',forumTopics.filter(t=>t.category==='Player Submission').length);
  $('#popularReports').innerHTML=reports.map(reportPreview).join('')||forumEmpty('Popular reports will appear here after the first approved post.');
  $('#commentedMocks').innerHTML=mocks.map(mockPreview).join('')||forumEmpty('Post the first mock and start the discussion.');
  $('#approvedPlayers').innerHTML=approved.map(approvedPreview).join('')||forumEmpty('Approved player submissions will appear here.');
  $$('#commentedMocks [data-mock-open]').forEach(btn=>btn.onclick=()=>openMockDetail(btn.dataset.mockOpen));
  $$('#commentedMocks [data-mock-like]').forEach(btn=>btn.onclick=()=>likeMock(btn.dataset.mockLike));
  renderAdminReview();
}
function renderAdminReview(){
  const panel=$('#adminReview'),list=$('#adminReviewList'),count=$('#adminReviewCount');if(!panel||!list||!count)return;
  panel.hidden=!isAdmin();if(!isAdmin())return;
  const pending=forumTopics.filter(topic=>topic.pending&&(topic.category==='Scouting Report'||topic.category==='Player Submission'));
  count.textContent=`${pending.length} pending`;
  list.innerHTML=pending.map(topic=>`<article class="admin-review-card"><div><span>${esc(topic.category==='Player Submission'?'Prospect submission':'Scouting report')}</span><strong>${esc(topic.player||topic.title)}</strong><small>${esc([topic.team,topic.created].filter(Boolean).join(' · '))}</small><p>${esc(topic.body)}</p></div><div><button class="btn" data-review-reject="${esc(topic.id)}">Reject</button><button class="btn primary" data-review-approve="${esc(topic.id)}">${topic.category==='Player Submission'?'Accept request':'Publish report'}</button></div></article>`).join('')||'<div class="admin-review-empty">No submissions are waiting for review.</div>';
  $$('#adminReviewList [data-review-approve]').forEach(button=>button.onclick=()=>approveSubmission(button.dataset.reviewApprove));
  $$('#adminReviewList [data-review-reject]').forEach(button=>button.onclick=()=>rejectSubmission(button.dataset.reviewReject));
}
async function approveSubmission(id){
  if(!isAdmin()||!firebaseDb)return;const topic=forumTopics.find(item=>item.id===id);if(!topic)return;
  try{
    const updates={[`forumTopics/${id}/pending`]:false,[`forumTopics/${id}/approved`]:true,[`forumTopics/${id}/updatedAt`]:Date.now()};
    await firebaseDb.ref().update(updates);topic.pending=false;topic.approved=true;renderForum();
  }catch(error){alert(firebaseFriendlyError(error));}
}
async function rejectSubmission(id){
  if(!isAdmin()||!firebaseDb)return;if(!confirm('Reject and remove this submission?'))return;
  try{await firebaseDb.ref(`forumTopics/${id}`).remove();forumTopics=forumTopics.filter(topic=>topic.id!==id);renderForum();}catch(error){alert(firebaseFriendlyError(error));}
}
function closeTopicForm(){ $('#topicOverlay').classList.remove('show'); $('#topicError').textContent=''; }
function openMockComposer(body='',title='My early Round 1 mock'){$('#topicForm').reset();$('#topicTitle').value=title;$('#topicBody').value=body;$('#topicError').textContent='';$('#topicOverlay').classList.add('show');setTimeout(()=>$(body?'#topicTitle':'#topicBody').focus(),0);}
$$('[data-forum-action="mock"]').forEach(btn=>btn.onclick=()=>{$('.tab[data-view="draft"]')?.click();});
$('#topicClose').onclick=$('#topicCancel').onclick=closeTopicForm;
$('#topicOverlay').onclick=e=>{if(e.target.id==='topicOverlay')closeTopicForm();};
$('#topicForm').onsubmit=async e=>{ e.preventDefault(); if(!requireAuth())return; const title=$('#topicTitle').value.trim(),body=$('#topicBody').value.trim();
  if(moderateForumText(title+' '+body)){ $('#topicError').textContent='This post contains language that is not allowed in Scout Room.'; return; }
  try{
    if(initFirebase()){forumTopics.unshift(await firebaseCreateTopic({title,body,category:$('#topicCategory').value,created:'Just now',pending:false,approved:false}));forumRemote=true;}
    else {forumTopics.unshift({id:'t'+Date.now(),title,body,category:$('#topicCategory').value,created:'Just now',likes:0,comments:[],author:currentUser});forumSave();}
    closeTopicForm(); renderForum();
  }catch(error){$('#topicError').textContent=error.message;}
};
let openMockId=null;
function closeMockDetail(){$('#mockDetailOverlay').classList.remove('show');openMockId=null;$('#mockCommentError').textContent='';}
function openMockDetail(id){
  const topic=forumTopics.find(t=>t.id===id);if(!topic)return;openMockId=id;topic.views=Number(topic.views||0)+1;forumSave();
  const picks=mockPickLines(topic.body);
  $('#mockDetailTitle').textContent=topic.title;$('#mockDetailBody').innerHTML=picks.map(p=>{const player=mockPickPlayer(p.text);return `<div class="mock-detail-pick"><b>${p.number}</b>${player?thumb(player,'mock-detail-photo'):`<span class="mock-detail-photo mock-pick-fallback">?</span>`}<span><strong>${esc(player?.name||p.text)}</strong>${player?`<small>${esc(player.team||player.pos||'Prospect')}</small>`:''}</span></div>`;}).join('');
  const comments=topic.comments||[];$('#mockCommentCount').textContent=`${comments.length} ${comments.length===1?'comment':'comments'}`;
  $('#mockDetailMeta').innerHTML=`<span>By ${esc(topic.author?.username||'Scout Room member')}</span><span>${Number(topic.likes||0)} likes</span><span>${Number(topic.views||0)} views</span><span>${comments.length} comments</span>`;
  $('#mockLikeBtn').textContent=`Like (${Number(topic.likes||0)})`;
  $('#mockComments').innerHTML=comments.map(c=>`<article class="mock-comment"><strong>${esc(c.author?.username||'Scout Room member')}</strong><p>${esc(c.body)}</p><small>${esc(c.created||'Recently')}</small></article>`).join('')||'<div class="lane-empty">No comments yet. Start the discussion.</div>';
  $('#mockCommentText').value='';$('#mockDetailOverlay').classList.add('show');
}
async function likeMock(id){
  const topic=forumTopics.find(t=>t.id===id);if(!topic)return;
  if(initFirebase()&&forumRemote&&!currentUser){requireAuth('Sign in to like Scout Room posts.');return;}
  try{
    if(initFirebase()&&forumRemote){
      const updated=await firebaseLikeTopic(id);
      const index=forumTopics.findIndex(t=>t.id===id);if(index>=0)forumTopics[index]=updated;
    }else{
      topic.likes=Number(topic.likes||0)+1;forumSave();
    }
    if(openMockId===id)openMockDetail(id);
    renderForum();
  }catch(error){
    topic.likes=Number(topic.likes||0)+1;forumSave();if(openMockId===id)openMockDetail(id);renderForum();
  }
}
$('#mockDetailClose').onclick=closeMockDetail;
$('#mockDetailOverlay').onclick=e=>{if(e.target.id==='mockDetailOverlay')closeMockDetail();};
$('#mockLikeBtn').onclick=()=>{if(openMockId)likeMock(openMockId);};
$('#mockCommentForm').onsubmit=async e=>{e.preventDefault();if(!requireAuth('Sign in to comment in Scout Room.'))return;const body=$('#mockCommentText').value.trim(),topic=forumTopics.find(t=>t.id===openMockId);if(!topic)return;if(moderateForumText(body)){$('#mockCommentError').textContent='This comment contains language that is not allowed in Scout Room.';return;}try{if(initFirebase()&&forumRemote){const updated=await firebaseCommentTopic(topic.id,body);const index=forumTopics.findIndex(t=>t.id===topic.id);if(index>=0)forumTopics[index]=updated;}else{topic.comments=topic.comments||[];topic.comments.push({body,created:'Just now',author:currentUser});forumSave();}openMockDetail(topic.id);renderForum();}catch(error){$('#mockCommentError').textContent=error.message;}};
function closeScoutSubmit(){ $('#scoutOverlay').classList.remove('show'); $('#scoutSubmitError').textContent=''; }
function openScoutSubmit(type='prospect'){
  $('#scoutSubmitForm').reset(); $('#scoutSubmitType').value=type; $('#scoutSubmitError').textContent='';
  const report=type==='report'; $('#scoutSubmitTitle').textContent=report?'Submit a scouting report':'Submit a new prospect';
  $('#scoutPlayerSelectWrap').hidden=!report;$('#scoutPlayerInputWrap').hidden=report;
  $('#scoutPlayerSelect').innerHTML=report?'<option value="">Select a prospect…</option>'+state.players.slice().sort((a,b)=>a.name.localeCompare(b.name)).map(p=>`<option value="${esc(p.name)}">${esc(p.name)} · ${esc(p.team||'No team')}</option>`).join(''):'';
  $('#scoutNotesLabel').textContent=report?'Scouting report *':'Why should this player be tracked? *';
  $('#scoutNotes').placeholder=report?'Describe the player’s tools, habits, role and viewing context…':'Add eligibility, league, production or other useful context…';
  $('#scoutOverlay').classList.add('show'); setTimeout(()=>$(report?'#scoutPlayerSelect':'#scoutPlayer').focus(),0);
}
$$('[data-submit-type]').forEach(btn=>btn.onclick=()=>openScoutSubmit(btn.dataset.submitType));
$('#scoutSubmitClose').onclick=$('#scoutSubmitCancel').onclick=closeScoutSubmit;
$('#scoutOverlay').onclick=e=>{if(e.target.id==='scoutOverlay')closeScoutSubmit();};
$('#scoutSubmitForm').onsubmit=async e=>{ e.preventDefault(); if(!requireAuth('Sign in to submit reports or prospects.'))return;
  const type=$('#scoutSubmitType').value,player=(type==='report'?$('#scoutPlayerSelect').value:$('#scoutPlayer').value).trim(),pos=$('#scoutPosition').value.trim(),country=$('#scoutCountry').value.trim(),team=$('#scoutTeam').value.trim(),notes=$('#scoutNotes').value.trim(),source=$('#scoutSource').value.trim();
  if(!player){$('#scoutSubmitError').textContent='Choose or enter a player first.';return;}
  if(moderateForumText([player,pos,country,team,notes,source].join(' '))){ $('#scoutSubmitError').textContent='This submission contains language that is not allowed in Scout Room.'; return; }
  const details=[pos,country,team].filter(Boolean).join(' · '),category=type==='report'?'Scouting Report':'Player Submission';
  const title=type==='report'?`Scouting report: ${player}`:`Prospect nomination: ${player}`,body=`${details?details+' — ':''}${notes}${source?` · Source: ${source}`:''}`;
  try{
    if(initFirebase()){forumTopics.unshift(await firebaseCreateTopic({title,body,category,player,team,pos,country,source,created:'Submitted just now',pending:category!=='Mock Drafts',approved:false}));forumRemote=true;}
    else {forumTopics.unshift({id:'s'+Date.now(),title,player,team,pos,country,source,body,category,created:'Submitted just now',pending:true,author:currentUser});forumSave();}
    closeScoutSubmit(); renderForum();
  }catch(error){$('#scoutSubmitError').textContent=error.message;}
};

const L_NUMERIC=['skating','shooting','iq','ozone','dzone','phys','ovr'];
const L_LABELS={player:'Player',pos:'Position',skating:'Skating',shooting:'Shooting',iq:'Hockey IQ',ozone:'Offensive Zone',dzone:'Defensive Zone',phys:'Physicality',ovr:'Overall',tier:'Tier'};
let lFilters={player:'',pos:'',tier:'',...Object.fromEntries(L_NUMERIC.map(k=>[k,{min:'',max:''}]))},lSort={key:'ovr',dir:'desc'},lOpenColumn=null;
const lColumnValue=(p,key)=>key==='ovr'?p._o:key==='tier'?tierOf(p._o).name:key==='player'?p.name:p[key];
function updateLeaderHeaders(){
  $$('.leader-table .th-filter').forEach(btn=>{ const key=btn.dataset.lcol,active=lSort.key===key,filtered=L_NUMERIC.includes(key)?(lFilters[key].min!==''||lFilters[key].max!==''):lFilters[key]!=='';
    btn.classList.toggle('active',active); btn.classList.toggle('filtered',filtered); btn.querySelector('span').textContent=active?(lSort.dir==='asc'?'↑':'↓'):'↕'; });
}
function closeLeaderMenu(){ $('#lColumnMenu').hidden=true; lOpenColumn=null; }
function renderLeaderMenu(key,anchor){
  const menu=$('#lColumnMenu'),numeric=L_NUMERIC.includes(key),positions=POSITION_FILTERS.filter(pos=>state.players.some(p=>positionTokens(p.pos).includes(pos))),tiers=TIERS.map(t=>t.name);
  const valueFilter=key==='player'?`<label>Contains<input id="lTextFilter" type="text" value="${esc(lFilters.player)}" placeholder="Search player, team or country"></label>`:
    key==='pos'||key==='tier'?`<label>Show<select id="lValueFilter"><option value="">All values</option>${(key==='pos'?positions:tiers).map(v=>`<option value="${esc(v)}" ${lFilters[key]===v?'selected':''}>${esc(v)}</option>`).join('')}</select></label>`:
    `<div class="column-range"><label>Minimum<input id="lMinFilter" type="number" min="0" max="100" value="${lFilters[key].min}" placeholder="Any"></label><label>Maximum<input id="lMaxFilter" type="number" min="0" max="100" value="${lFilters[key].max}" placeholder="Any"></label></div>`;
  menu.innerHTML=`<div class="column-menu-head"><strong>${L_LABELS[key]}</strong><button id="lMenuClose">×</button></div><div class="column-sort"><button data-sort="asc">↑ Sort ascending</button><button data-sort="desc">↓ Sort descending</button></div><div class="column-menu-filter">${valueFilter}</div><button class="column-clear" id="lClearColumn">Clear ${L_LABELS[key]} filter</button>`;
  const rect=anchor.getBoundingClientRect(); menu.style.left=Math.min(rect.left,window.innerWidth-255)+'px'; menu.style.top=(rect.bottom+5)+'px'; menu.hidden=false; lOpenColumn=key;
  menu.onclick=e=>e.stopPropagation(); $('#lMenuClose').onclick=closeLeaderMenu;
  $$('#lColumnMenu [data-sort]').forEach(b=>b.onclick=()=>{lSort={key,dir:b.dataset.sort};updateLeaderHeaders();renderBoard();closeLeaderMenu();});
  const text=$('#lTextFilter'),select=$('#lValueFilter'),min=$('#lMinFilter'),max=$('#lMaxFilter');
  if(text)text.oninput=()=>{lFilters.player=text.value;renderBoard();}; if(select)select.onchange=()=>{lFilters[key]=select.value;renderBoard();};
  if(min)min.oninput=()=>{lFilters[key].min=min.value;renderBoard();}; if(max)max.oninput=()=>{lFilters[key].max=max.value;renderBoard();};
  $('#lClearColumn').onclick=()=>{if(numeric)lFilters[key]={min:'',max:''};else lFilters[key]='';renderBoard();renderLeaderMenu(key,anchor);};
  setTimeout(()=>{const focus=$('#lTextFilter')||$('#lValueFilter')||$('#lMinFilter');if(focus)focus.focus();},0);
}
$$('.leader-table .th-filter').forEach(btn=>btn.onclick=e=>{e.stopPropagation();if(lOpenColumn===btn.dataset.lcol){closeLeaderMenu();return;}renderLeaderMenu(btn.dataset.lcol,btn);});
document.addEventListener('click',e=>{if(!$('#lColumnMenu').hidden&&!e.target.closest('#lColumnMenu'))closeLeaderMenu();});
function renderBoard(){
  let list=state.players.map(p=>({...p,_o:overall(p)}));
  const q=lFilters.player.trim().toLowerCase();
  syncProspectSeasonToggles();
  list=list.filter(p=>(!q||(p.name+' '+prospectTeamFor(p)+' '+p.country).toLowerCase().includes(q))&&(!lFilters.pos||positionTokens(p.pos).includes(lFilters.pos))&&(!lFilters.tier||tierOf(p._o).name===lFilters.tier)&&L_NUMERIC.every(k=>{const f=lFilters[k],v=Number(lColumnValue(p,k));return(f.min===''||v>=+f.min)&&(f.max===''||v<=+f.max);}));
  list.sort((a,b)=>{const av=lColumnValue(a,lSort.key),bv=lColumnValue(b,lSort.key),cmp=typeof av==='number'||L_NUMERIC.includes(lSort.key)?Number(av)-Number(bv):String(av).localeCompare(String(bv));return lSort.dir==='asc'?cmp:-cmp;});
  updateLeaderHeaders();
  const showRatings=prospectSeasonView!=='draft';
  $('#lBody').innerHTML=list.map((p,i)=>{ const t=tierOf(p._o),seasonTeam=prospectTeamFor(p),rating=v=>showRatings?v:'';
    return `<tr data-id="${p.id}">
      <td class="rank tnum">${i+1}</td>
      <td style="width:48px">${thumb(p)}</td>
      <td><div class="nm" style="font-weight:700;color:var(--navy)">${esc(p.name)} ${flagFor(p.country)?`<span class="inline-flags">${flagFor(p.country)}</span>`:''}</div><div class="tm leader-team">${teamMark(seasonTeam,'leader-team-mark',p.country)}<span>${esc(seasonTeam||'')}</span></div></td>
      <td><span class="posbadge">${esc(p.pos||'—')}</span></td>
      <td class="at tnum">${rating(p.skating)}</td><td class="at tnum">${rating(p.shooting)}</td><td class="at tnum">${rating(p.iq)}</td>
      <td class="at tnum">${rating(p.ozone)}</td><td class="at tnum">${rating(p.dzone)}</td><td class="at tnum">${rating(p.phys)}</td>
      <td class="c">${showRatings?`<span class="ovrn tnum">${p._o.toFixed(1)}</span>`:''}</td>
      <td class="tier-cell">${showRatings?`<span class="chip" style="background:${t.color}">${t.name}</span>`:''}</td>
    </tr>`; }).join('') || `<tr><td colspan="12" class="empty">No prospects to rank.</td></tr>`;
  $$('#lBody tr[data-id]').forEach(tr=>tr.onclick=()=>openView(tr.dataset.id));
  hydrateTeamLogos($('#lBody'));
}

function ceImgMarkup(p){ return p.headshot
  ? `<img id="ceImg" src="${esc(p.headshot)}" alt="" onerror="this.outerHTML='<div id=\\'ceImg\\' class=\\'ph\\'>${esc(initials(p.name))}</div>'">`
  : `<div id="ceImg" class="ph">${esc(initials(p.name))}</div>`; }
function editAttr(p,k){ const v=Number(p[k])||0;
  return `<div class="sattr" data-k="${k}"><div class="srow"><span class="slb">${(isGoalie(p)?GOALIE_ATTR_LABELS[k]:LBL[k]).toUpperCase()}</span>
    <input class="svl ce-rate" data-k="${k}" type="number" min="0" max="100" value="${v}"></div>
    <div class="strack"><i style="width:${Math.max(0,Math.min(100,v))}%"></i></div></div>`; }
function productionEditorHTML(p){
  if(isGoalie(p))return `<div class="season-production production-editor"><div class="production-title">EDIT GOALTENDING</div><div class="production-grid goalie-production-grid">
    <label><small>GP</small><input id="ceGames" type="number" min="0" step="1" value="${esc(showStat(p.games))}"></label><label><small>GAA</small><input id="ceGaa" type="number" min="0" step="0.01" value="${esc(showStat(p.gaa,2))}"></label><label><small>SV%</small><input id="ceSvPct" type="number" min="0" max="1" step="0.001" value="${esc(showStat(p.svPct,3))}"></label><label><small>W</small><input id="ceWins" type="number" min="0" step="1" value="${esc(showStat(p.wins))}"></label><label><small>L</small><input id="ceLosses" type="number" min="0" step="1" value="${esc(showStat(p.losses))}"></label><label><small>SO</small><input id="ceShutouts" type="number" min="0" step="1" value="${esc(showStat(p.shutouts))}"></label></div></div>`;
  return `<div class="season-production production-editor"><div class="production-title">EDIT SEASON PRODUCTION</div><div class="production-grid"><label><small>GP</small><input id="ceGames" type="number" min="0" step="1" value="${esc(showStat(p.games))}"></label><label><small>G</small><input id="ceGoals" type="number" min="0" step="1" value="${esc(showStat(p.goals))}"></label><label><small>A</small><input id="ceAssists" type="number" min="0" step="1" value="${esc(showStat(p.assists))}"></label><label><small>PTS</small><input id="cePoints" type="number" min="0" step="1" value="${esc(showStat(p.points))}"></label><label><small>P/GP</small><input id="cePpg" type="number" min="0" step="0.01" value="${esc(showStat(p.ppg,2))}"></label></div></div>`;
}
function cardEditorHTML(p){
  const o=overall(p),t=tierOf(o);
  const urlVal=(p.headshot&&p.headshot.startsWith('data:'))?'':(p.headshot||'');
  return `<div class="scard">
    <div class="scard-hd">
      <input id="ceName" class="hd-name" value="${esc(p.name)}" placeholder="Player Name">
      <div class="hd-ovr"><span id="ceOvr" class="ovrnum">${o.toFixed(0)}</span><small>OVR</small>
        <span id="ceTier" class="chip" style="background:${t.color}">${t.name}</span></div>
    </div>
    <div class="scard-bd">
      <div class="scard-left">
        <div class="photo-box">${ceImgMarkup(p)}<span id="ceFlag" class="sflag">${flagFor(p.country)}</span></div>
        <input id="ceHead" class="head-url" placeholder="Headshot URL (optional)" value="${esc(urlVal)}">
        <div class="spanel"><div class="sphl">Position &nbsp;·&nbsp; Shot</div>
          <div class="duo"><input id="cePos" class="cellin" value="${esc(p.pos)}" placeholder="C">
            <input id="ceShot" class="cellin" value="${esc(p.shot)}" placeholder="L/R" maxlength="4"></div></div>
        <div class="spanel"><div class="sphl">Height &nbsp;·&nbsp; Weight</div>
          <div class="duo"><input id="ceHt" class="cellin" value="${esc(p.height)}" placeholder="6'0&quot;">
            <input id="ceWt" class="cellin" value="${esc(p.weight)}" placeholder="190lbs"></div></div>
        <div class="spanel"><div class="sphl">Team</div>
          <input id="ceTeam" class="linein" value="${esc(p.team)}" placeholder="Team name"></div>
        <div class="spanel"><div class="sphl">2025–26 League</div>
          <input id="ceLeague" class="linein" value="${esc(p.league||leagueForTeam(p.team,p.country))}" placeholder="WHL, OHL, U20 Nationell…"></div>
        <div class="spanel"><div class="sphl">Country</div>
          <input id="ceCountry" class="linein" value="${esc(p.country)}" placeholder="Canada"></div>
      </div>
      <div class="scard-right">
        <div class="attrwrap">
          <div class="attrcol">${ATTR_L.map(k=>editAttr(p,k)).join('')}</div>
          <div class="attrcol">${ATTR_R.map(k=>editAttr(p,k)).join('')}</div>
        </div>
        ${productionEditorHTML(p)}
        <div class="srole"><div class="srt">NHL ROLE</div>
          <textarea id="ceRole" class="rolein" rows="3" placeholder="Projected role&#10;Player point one&#10;Player point two">${esc(cleanRole(p.role).join('\n'))}</textarea>
          <div class="role-limit">Projected role + two player points</div></div>
      </div>
    </div>
  </div>`;
}
function viewAttr(p,k){ const v=Number(p[k])||0;
  return `<div class="vattr"><div class="vrow"><span class="vlb">${(isGoalie(p)?GOALIE_ATTR_LABELS[k]:LBL[k]).toUpperCase()}</span><span class="vnum">${v}</span></div>
    <div class="vbar"><i style="width:${Math.max(0,Math.min(100,v))}%"></i></div></div>`; }
function seasonStatsHTML(p){
  const lines=seasonLines(p),goalie=isGoalie(p),source=p.source?`<a href="${esc(p.source)}" target="_blank" rel="noopener">Elite Prospects ↗</a>`:'';
  const heads=goalie?'<th>Season</th><th>Split</th><th>Team</th><th>League</th><th>GP</th><th>GAA</th><th>SV%</th><th>W</th><th>L</th><th>SO</th>':'<th>Season</th><th>Split</th><th>Team</th><th>League</th><th>GP</th><th>G</th><th>A</th><th>PTS</th><th>P/GP</th>';
  const seasons={};lines.forEach(line=>{const season=line.season||'2025–26';(seasons[season]||(seasons[season]=[])).push(line);});
  const add=(a,k,v)=>{if(hasStat(v))a[k]=(a[k]||0)+Number(v);};
  const totalFor=seasonLines=>{const total={};seasonLines.forEach(line=>{[line,line.playoffs||{}].forEach(split=>{['games','goals','assists','points','wins','losses','shutouts'].forEach(k=>add(total,k,split[k]));});});if(!goalie&&hasStat(total.games))total.ppg=total.games?total.points/total.games:0;if(goalie){let gp=0,gaa=0,sv=0;seasonLines.forEach(line=>{[line,line.playoffs||{}].forEach(s=>{if(hasStat(s.games)){const g=Number(s.games);gp+=g;if(hasStat(s.gaa))gaa+=g*Number(s.gaa);if(hasStat(s.svPct))sv+=g*Number(s.svPct);}});});if(gp){total.gaa=gaa/gp;total.svPct=sv/gp;}}return total;};
  const row=(line,split,label,total=false)=>{const league=line.league||leagueForTeam(line.team||p.team,p.country)||'—',teamName=total?'All teams':line.team||p.team||'—',teamText=total?'<b>Season total</b>':line.teamUrl?`<a href="${esc(line.teamUrl)}" target="_blank" rel="noopener">${esc(teamName)}</a>`:`<b>${esc(teamName)}</b>`,leagueText=total?'Regular season + playoffs':line.leagueUrl?`<a href="${esc(line.leagueUrl)}" target="_blank" rel="noopener">${esc(league)}</a>`:esc(league);return goalie?`<tr class="${total?'season-total':''}"><td>${esc(line.season||'2025–26')}</td><td><span class="split-pill ${label==='Playoffs'?'playoff':''}">${label}</span></td><td><span class="line-team">${total?'':teamMark(teamName,'line-team-mark',p.country)}${teamText}</span></td><td>${leagueText}</td><td>${showStat(split.games)||'—'}</td><td>${showStat(split.gaa,2)||'—'}</td><td>${hasStat(split.svPct)?Number(split.svPct).toFixed(3).replace(/^0/,''):'—'}</td><td>${showStat(split.wins)||'—'}</td><td>${showStat(split.losses)||'—'}</td><td>${showStat(split.shutouts)||'—'}</td></tr>`:`<tr class="${total?'season-total':''}"><td>${esc(line.season||'2025–26')}</td><td><span class="split-pill ${label==='Playoffs'?'playoff':''}">${label}</span></td><td><span class="line-team">${total?'':teamMark(teamName,'line-team-mark',p.country)}${teamText}</span></td><td>${leagueText}</td><td>${showStat(split.games)||'—'}</td><td>${showStat(split.goals)||'—'}</td><td>${showStat(split.assists)||'—'}</td><td><strong>${showStat(split.points)||'—'}</strong></td><td>${showStat(split.ppg,2)||'—'}</td></tr>`;};
  let rows='';Object.entries(seasons).forEach(([season,seasonLines])=>{seasonLines.forEach(line=>{rows+=row(line,line,'Regular season');if(line.playoffs&&Object.values(line.playoffs).some(hasStat))rows+=row(line,line.playoffs,'Playoffs');});const total=totalFor(seasonLines);if(Object.values(total).some(hasStat))rows+=row({season},total,'Season total',true);});
  return `<div class="season-lines"><div class="season-lines-head"><div><span>ALL SEASONS &amp; CLUBS</span><strong>${goalie?'Goaltending by team and split':'Production by team and split'}</strong></div>${source}</div><div class="season-lines-scroll"><table><thead><tr>${heads}</tr></thead><tbody>${rows||`<tr><td colspan="${goalie?10:9}" class="no-lines">No verified season line available.</td></tr>`}</tbody></table></div></div>`; }
function teamPathHTML(p){
  const bySeason={};seasonLines(p).forEach(line=>{const season=line.season||'2025–26';(bySeason[season]||(bySeason[season]=[])).push(line.team||p.statsTeam||p.team);});
  if(!bySeason['2025–26']&&(p.statsTeam||p.team))bySeason['2025–26']=[p.statsTeam||p.team];
  const draftTeam=prospectDraftTeamFor(p),collegeTeam=futureCollegeTeamFor(p);
  if(draftTeam){const draft=bySeason['2026–27']||(bySeason['2026–27']=[]);if(!draft.includes(draftTeam))draft.push(draftTeam);}
  if(collegeTeam&&collegeTeam!==draftTeam){const future=bySeason['2027–28']||(bySeason['2027–28']=[]);if(!future.includes(collegeTeam))future.push(collegeTeam);}
  const seasons=['2025–26','2026–27','2027–28'].filter(season=>bySeason[season]?.length);
  return `<div class="spanel team-path-panel"><div class="sphl">Team path</div><div class="team-path">${seasons.map((season,index)=>`<div class="team-season"><span>${season}</span><div>${[...new Set(bySeason[season])].map(team=>`<span class="team-season-club">${teamMark(team,'card-team-mark')}<strong>${esc(team)}</strong></span>`).join('')}</div></div>${index<seasons.length-1?'<i>→</i>':''}`).join('')}</div></div>`;
}
function cardViewHTML(p){
  const o=overall(p),t=tierOf(o),fl=flagFor(p.country);
  const photo=p.headshot?`<img src="${esc(p.headshot)}" alt="">`:`<div class="ph">${esc(initials(p.name))}</div>`;
  const role=cleanRole(p.role);
  const roleHTML=`<div class="srole"><div class="srt">NHL ROLE</div>`+
    (role.length?`<div class="role-title">${esc(role[0])}</div>${role.length>1?`<ul>${role.slice(1).map(r=>`<li>${esc(r)}</li>`).join('')}</ul>`:''}`
      :`<div class="role-title" style="color:#6c7a88">No role notes yet</div>`)+`</div>`;
  return `<div class="scard">
    <div class="scard-hd">
      <div class="card-identity"><span>2027 NHL DRAFT · PROSPECT FILE</span><div class="hd-name-static">${esc(p.name)}</div><small>${esc(p.pos||'—')} · ${flagFor(p.country)} ${esc(p.country||'')}</small></div>
      <div class="hd-ovr"><span class="ovrnum">${o.toFixed(0)}</span><small>OVR</small>
        <span class="chip" style="background:${t.color}">${t.name}</span></div>
    </div>
    <div class="scard-bd">
      <div class="scard-left">
        <div class="photo-box">${photo}${fl?`<span class="sflag">${fl}</span>`:''}</div>
        <div class="spanel"><div class="sphl">Position &nbsp;·&nbsp; Shot</div>
          <div class="duo"><div class="cellv">${esc(p.pos||'—')}</div><div class="cellv">${esc(p.shot||'—')}</div></div></div>
        <div class="spanel"><div class="sphl">Height &nbsp;·&nbsp; Weight</div>
          <div class="duo"><div class="cellv">${esc(p.height||'—')}</div><div class="cellv">${esc(p.weight||'—')}</div></div></div>
        ${teamPathHTML(p)}
      </div>
      <div class="scard-right">
        <div class="attrwrap">
          <div class="attrcol">${ATTR_L.map(k=>viewAttr(p,k)).join('')}</div>
          <div class="attrcol">${ATTR_R.map(k=>viewAttr(p,k)).join('')}</div>
        </div>
        ${seasonStatsHTML(p)}
        ${roleHTML}
      </div>
    </div>
  </div>`;
}

let editId=null,draftP=null,viewId=null,mode='view';
function setFooter(){
  const v=mode==='view';
  $('#editHint').style.display=v?'none':'flex';
  $('#mClose2').style.display=v?'inline-block':'none';
  $('#mEdit').style.display=(v&&isAdmin())?'inline-block':'none';
  $('#mCancel').style.display=v?'none':'inline-block';
  $('#mSave').style.display=v?'none':'inline-block';
  $('#mDelete').style.display=(!v && editId && isAdmin())?'inline-block':'none';
}
function openView(id){
  const p=byId(id); if(!p)return;
  mode='view'; viewId=id; editId=null; draftP=null;
  $('#mTitle').textContent=p.name;
  $('#cardEditor').innerHTML=cardViewHTML(p);
  setFooter(); $('#overlay').classList.add('show'); hydrateTeamLogos($('#cardEditor'));
}
$('#addBtn').onclick=()=>{if(isAdmin())openEditor(null);};
$('#mClose').onclick=closeEditor;
$('#mClose2').onclick=closeEditor;
$('#mEdit').onclick=()=>{ if(isAdmin()&&viewId)openEditor(viewId); };
$('#mCancel').onclick=()=>{ if(editId)openView(editId); else closeEditor(); };
$('#overlay').onclick=e=>{ if(e.target.id==='overlay')closeEditor(); };
const blankPlayer=()=>({id:null,name:'',team:'',pos:'',shot:'L',country:'',height:'',weight:'',headshot:'',
  league:'',games:'',goals:'',assists:'',points:'',ppg:'',gaa:'',svPct:'',wins:'',losses:'',shutouts:'',skating:80,shooting:80,iq:80,ozone:80,dzone:80,phys:80,role:[]});
function openEditor(id){
  if(!isAdmin())return;
  mode='edit'; editId=id; const src=id?byId(id):blankPlayer(); draftP=JSON.parse(JSON.stringify(src));
  $('#mTitle').textContent=id?'Edit Prospect':'Add Prospect';
  buildCardEditor(); setFooter(); $('#overlay').classList.add('show');
}
function updateOvr(){ const o=overall(draftP),t=tierOf(o);
  const n=$('#ceOvr'); if(n)n.textContent=o.toFixed(0);
  const c=$('#ceTier'); if(c){ c.textContent=t.name; c.style.background=t.color; } }
function setCePhoto(){ const old=$('#ceImg'); if(old)old.outerHTML=ceImgMarkup(draftP); }
function buildCardEditor(){
  $('#cardEditor').innerHTML=cardEditorHTML(draftP);
  const bind=(id,key,after)=>{ const el=$('#'+id); if(el)el.oninput=()=>{ draftP[key]=el.value; if(after)after(); }; };
  bind('ceName','name'); bind('ceTeam','team'); bind('ceLeague','league'); bind('ceHt','height'); bind('ceWt','weight');
  bind('cePos','pos',updateOvr); bind('ceShot','shot');
  [['ceGames','games'],['ceGoals','goals'],['ceAssists','assists'],['cePoints','points'],['cePpg','ppg'],['ceGaa','gaa'],['ceSvPct','svPct'],['ceWins','wins'],['ceLosses','losses'],['ceShutouts','shutouts']].forEach(([id,key])=>{const el=$('#'+id);if(el)el.oninput=()=>{draftP[key]=el.value;};});
  $('#ceCountry').oninput=()=>{ draftP.country=$('#ceCountry').value; $('#ceFlag').textContent=flagFor(draftP.country); };
  $('#ceHead').oninput=()=>{ const v=$('#ceHead').value.trim();
    if(v) draftP.headshot=v;
    else { const orig=editId?byId(editId):null; draftP.headshot=(orig&&orig.headshot&&orig.headshot.startsWith('data:'))?orig.headshot:''; }
    setCePhoto(); };
  $('#ceRole').oninput=()=>{ draftP.role=cleanRole($('#ceRole').value.split('\n')); };
  $$('#cardEditor .ce-rate').forEach(inp=>inp.oninput=()=>{
    const v=Math.max(0,Math.min(100,Math.round(+inp.value||0))); draftP[inp.dataset.k]=v;
    const bar=$(`#cardEditor .sattr[data-k="${inp.dataset.k}"] .strack i`); if(bar)bar.style.width=v+'%';
    updateOvr(); });
}
function closeEditor(){ $('#overlay').classList.remove('show'); editId=null; draftP=null; viewId=null; }
$('#mSave').onclick=async()=>{
  if(!isAdmin())return;
  draftP.name=(draftP.name||'').trim();
  if(!draftP.name){ const n=$('#ceName'); if(n){ n.focus(); n.style.borderColor='#E0705A'; } return; }
  ATTRS.forEach(([k])=>draftP[k]=Math.max(0,Math.min(100,Math.round(+draftP[k]||0))));
  ['games','goals','assists','points','ppg','gaa','svPct','wins','losses','shutouts'].forEach(k=>{draftP[k]=draftP[k]===''?'':Math.max(0,Number(draftP[k])||0);});
  if(editId){ const existing=byId(editId),oldScore=overall(existing),newScore=overall(draftP);
    draftP.previousOverall=Math.abs(newScore-oldScore)>=.05?oldScore:(Number(existing.previousOverall)||oldScore);
    Object.assign(existing,draftP);
  } else { draftP.id=uid(); draftP.previousOverall=overall(draftP); state.players.push(draftP); }
  const savedId = editId || draftP.id;
  save(); renderPlayers(); if($('#view-home').classList.contains('active'))renderHome(); if($('#view-board').classList.contains('active'))renderBoard(); if($('#view-stock').classList.contains('active'))renderStock();
  openView(savedId);
};
$('#mDelete').onclick=async()=>{
  if(!isAdmin())return;
  if(!editId)return; if(!confirm('Delete this player? Also removes them from the draft board.'))return;
  state.players=state.players.filter(p=>p.id!==editId);
  Object.keys(state.draft.picks).forEach(k=>{ if(state.draft.picks[k]===editId)delete state.draft.picks[k]; });
  save(); closeEditor(); renderPlayers(); if($('#view-home').classList.contains('active'))renderHome(); if($('#view-stock').classList.contains('active'))renderStock();
};

$('#dRounds').onchange=()=>{ state.draft.rounds=+$('#dRounds').value; save(); renderDraft(); };
$('#clearDraft').onclick=()=>{ if(confirm('Clear all picks?')){ state.draft.picks={}; save(); renderDraft(); } };
let draftResultsOpen=false,draftSearch='',draftPos='all',playerPoolOpen=true,playerPoolExpanded=false,mobileDraftPane='pool';
$('#finishDraft').onclick=()=>{ draftResultsOpen=true; renderDraftResults(); };
$('#backToDraft').onclick=()=>{ draftResultsOpen=false; setDraftView(); };
$('#postDraftMock').onclick=()=>{
  const total=(state.draft.rounds||1)*32,lines=[];
  for(let slot=0;slot<total;slot++){const pl=byId(state.draft.picks[slot]);if(pl)lines.push(`${slot+1}. ${pl.name}`);}
  const forumTab=$('.tab[data-view="forum"]');if(forumTab)forumTab.click();
  openMockComposer(lines.join('\n'),`My ${state.draft.rounds||1}-round 2027 mock`);
};
$('#togglePool').onclick=()=>{ playerPoolOpen=!playerPoolOpen; setPoolVisibility(); };
$('#mobileDraftSwitch').onclick=e=>{const button=e.target.closest('[data-draft-pane]');if(!button)return;mobileDraftPane=button.dataset.draftPane;setMobileDraftPane();};
const teamName=i=>{ const t=(state.draft.teams||[])[i]; return (t&&t.length)?t:''; };
function draftedIds(except){ const s=new Set(); Object.entries(state.draft.picks).forEach(([k,v])=>{ if(k!==String(except)&&v)s.add(v); }); return s; }
function nextOpenDraftSlot(){ const total=(state.draft.rounds||1)*32;
  for(let i=0;i<total;i++)if(!state.draft.picks[i])return i; return -1; }
function fillDraftSlots(limit=1){
  let filled=0;
  while(filled<limit){
    const slot=nextOpenDraftSlot(),player=availableDraftPlayers()[0];
    if(slot<0||!player)break;
    state.draft.picks[slot]=player.id;filled++;
  }
  if(filled){save();renderDraft();}
}
function undoLastDraftPick(){
  const slots=Object.keys(state.draft.picks).map(Number).filter(slot=>state.draft.picks[slot]).sort((a,b)=>b-a);
  if(!slots.length)return;
  delete state.draft.picks[slots[0]];save();renderDraft();
}
$('#autoDraftBest').onclick=()=>fillDraftSlots(1);
$('#autoFillRound').onclick=()=>{const next=nextOpenDraftSlot();if(next<0)return;fillDraftSlots(32-(next%32));};
$('#undoDraftPick').onclick=undoLastDraftPick;
function placeDraftPlayer(pid,toSlot,fromSlot=null){
  const target=state.draft.picks[toSlot];
  if(fromSlot!==null){
    if(target)state.draft.picks[fromSlot]=target; else delete state.draft.picks[fromSlot];
  }
  state.draft.picks[toSlot]=pid; save(); renderDraft();
}
let draftDrag=null;
function availableDraftPlayers(){ const taken=draftedIds(-1);
  return state.players.filter(p=>!taken.has(p.id)).map(p=>({...p,_o:overall(p)})).sort((a,b)=>b._o-a._o); }
function setPoolVisibility(){
  $('#draftWorkspace').classList.toggle('pool-hidden',!playerPoolOpen);
  $('#draftWorkspace').classList.toggle('pool-expanded',playerPoolOpen&&playerPoolExpanded);
  $('#togglePool').textContent=playerPoolOpen?'Hide player list':'Show player list';
  const expand=$('#expandPool'); if(expand)expand.textContent=playerPoolExpanded?'Collapse':'Expand';
}
function setMobileDraftPane(){
  $('#draftWorkspace').classList.toggle('mobile-pool',mobileDraftPane==='pool');
  $('#draftWorkspace').classList.toggle('mobile-board',mobileDraftPane==='board');
  $$('#mobileDraftSwitch [data-draft-pane]').forEach(button=>button.classList.toggle('on',button.dataset.draftPane===mobileDraftPane));
}
function renderPoolPlayers(){
  const q=draftSearch.trim().toLowerCase();
  const list=availableDraftPlayers().filter(p=>posMatch(p,draftPos)).filter(p=>!q||(p.name+' '+p.team).toLowerCase().includes(q));
  const count=$('#poolCount'); if(count)count.textContent=`${list.length} available`;
  const body=$('#poolPlayers'); if(!body)return;
  body.innerHTML=list.map((p,i)=>{ const t=tierOf(p._o); return `<article class="pool-player" data-best="${p.id}" draggable="true">
    <span class="pool-rank tnum">${i+1}</span>${thumb(p,'pool-thumb')}
    <span class="pool-id"><strong>${esc(p.name)} ${flagFor(p.country)?`<span class="inline-flags">${flagFor(p.country)}</span>`:''}</strong><small>${esc(p.pos||'—')} · ${esc(p.team||'Unassigned')}</small></span>
    <span class="pool-bio"><small>Height</small><b>${esc(p.height||'—')}</b><small>Weight</small><b>${esc(p.weight||'—')}</b></span>
    <span class="pool-production"><small>GP</small><b>${showStat(p.games)||'—'}</b><small>PTS</small><b>${showStat(p.points)||'—'}</b><small>P/GP</small><b>${showStat(p.ppg,2)||'—'}</b></span>
    <span class="pool-ovr"><b class="tnum">${p._o.toFixed(0)}</b><small>${t.name}</small></span>
    <span class="pool-actions"><button class="pool-detail" data-details="${p.id}" draggable="false" title="View full breakdown">Breakdown</button>
      <button class="draft-now" data-draft="${p.id}" draggable="false" title="Draft ${esc(p.name)}">Draft</button></span>
  </article>`; }).join('')||'<div class="pool-empty">No available players match.</div>';
  $$('#poolPlayers [data-draft]').forEach(btn=>btn.onclick=e=>{ e.stopPropagation(); const slot=nextOpenDraftSlot(); if(slot>=0)placeDraftPlayer(btn.dataset.draft,slot); });
  $$('#poolPlayers [data-details]').forEach(btn=>btn.onclick=e=>{ e.stopPropagation(); openView(btn.dataset.details); });
  $$('#poolPlayers [data-best]').forEach(card=>{
    card.ondblclick=()=>{ const slot=nextOpenDraftSlot(); if(slot>=0)placeDraftPlayer(card.dataset.best,slot); };
    card.ondragstart=e=>{ draftDrag={type:'available',pid:card.dataset.best}; e.dataTransfer.effectAllowed='move'; e.dataTransfer.setData('text/plain',card.dataset.best); card.classList.add('dragging'); };
    card.ondragend=()=>{ card.classList.remove('dragging'); draftDrag=null; $$('.drop-target').forEach(el=>el.classList.remove('drop-target')); };
  });
}
function setDraftView(){
  $('#draftWorkspace').hidden=draftResultsOpen; $('#draftResults').hidden=!draftResultsOpen;
  $('#draftSetup').hidden=draftResultsOpen;
  if(!draftResultsOpen){setPoolVisibility();setMobileDraftPane();}
}
function renderDraftResults(){
  const rounds=state.draft.rounds||1,total=rounds*32;
  let picked=0,rows='';
  for(let slot=0;slot<total;slot++){ const pid=state.draft.picks[slot],pl=pid&&byId(pid),round=Math.floor(slot/32)+1,pick=(slot%32)+1;
    if(pl)picked++;
    const o=pl?overall(pl):0,t=pl?tierOf(o):null;
    rows+=`<div class="result-row ${pl?'':'open'}"><span class="result-pick"><b class="tnum">${slot+1}</b><small>R${round} · P${pick}</small></span>
      <span class="result-player">${pl?`${thumb(pl,'result-thumb')}<span><strong>${esc(pl.name)} ${flagFor(pl.country)?`<span class="inline-flags">${flagFor(pl.country)}</span>`:''}</strong><small>${esc(pl.team||'')}</small></span>`:'<em>Open pick</em>'}</span>
      <span class="result-pos">${pl?`<span class="posbadge">${esc(pl.pos||'—')}</span>`:'—'}</span>
      <span class="result-rating">${pl?`<b class="tnum">${o.toFixed(1)}</b><span class="chip" style="background:${t.color}">${t.name}</span>`:'—'}</span></div>`;
  }
  $('#resultsSummary').textContent=`${picked} of ${total} picks completed · ${rounds} ${rounds===1?'round':'rounds'}`;
  $('#resultsBody').innerHTML=`<div class="result-row result-labels"><span>Pick</span><span>Selection</span><span>Position</span><span>Rating</span></div>${rows}`;
  hydrateTeamLogos($('#resultsBody'));
  setDraftView();
}
function renderDraft(){
  $('#dRounds').value=state.draft.rounds||1;
  const totalSlots=(state.draft.rounds||1)*32, pickedCount=Object.values(state.draft.picks).filter(v=>v&&byId(v)).length;
  $('#best').innerHTML=`<div class="pool-head"><div><span class="eyebrow">Player pool</span><h3>Best available</h3></div><div class="pool-head-actions"><button id="expandPool" class="pool-expand">${playerPoolExpanded?'Collapse':'Expand'}</button><div class="draft-progress"><b>${pickedCount}</b> / ${totalSlots}</div></div></div>
    <div class="pool-search-wrap"><input class="pool-search" id="draftSearch" type="text" value="${esc(draftSearch)}" placeholder="Search all prospects…"><button id="clearDraftSearch" title="Clear search">×</button></div>
    <div class="pool-tools"><div class="pool-seg" id="draftPos">${['all',...POSITION_FILTERS].map(pos=>`<button data-v="${pos}" class="${draftPos===pos?'on':''}">${pos==='all'?'All':pos}</button>`).join('')}</div><span id="poolCount"></span></div>
    <div class="pool-columns"><span>Rank</span><span></span><span>Player</span><span>Size</span><span>Production</span><span>Overall</span><span></span></div>
    <div class="pool-players" id="poolPlayers"></div><div class="drag-hint">Use Draft for the next open pick, or drag a player onto any slot.</div>`;
  $('#draftSearch').oninput=e=>{draftSearch=e.target.value;renderPoolPlayers();};
  $('#clearDraftSearch').onclick=()=>{draftSearch='';draftPos='all';renderDraft();};
  $('#expandPool').onclick=()=>{playerPoolExpanded=!playerPoolExpanded;setPoolVisibility();};
  $('#draftPos').onclick=e=>{if(e.target.dataset.v){draftPos=e.target.dataset.v; $$('#draftPos button').forEach(b=>b.classList.toggle('on',b===e.target));renderPoolPlayers();}};
  renderPoolPlayers();
  const rounds=state.draft.rounds||1; let html='';
  for(let r=1;r<=rounds;r++){ html+=`<div class="round-h">Round ${r}</div>`;
    for(let p=0;p<32;p++){ const slot=(r-1)*32+p, op=slot+1, pid=state.draft.picks[slot];
      let body;
      if(pid){ const pl=byId(pid);
        if(pl){ const o=overall(pl),t=tierOf(o);
          body=`<div class="picked" draggable="true" data-drag-slot="${slot}" title="Drag to move or swap this pick"><span class="drag-grip" aria-hidden="true">⠿</span>${thumb(pl)}<div style="flex:1;min-width:0"><div class="nm">${esc(pl.name)} ${flagFor(pl.country)?`<span class="inline-flags">${flagFor(pl.country)}</span>`:''}</div>
            <div class="sub">${esc(pl.pos||'')} · ${esc(pl.team||'')}</div></div>
            <span class="dovr tnum">${o.toFixed(0)}</span><span class="chip" style="background:${t.color}">${t.name}</span>
            <button class="pick-details" data-pick-details="${pl.id}" draggable="false" title="View full breakdown">View</button>
            <button class="clear" data-clear="${slot}" draggable="false" title="Remove pick">✕</button></div>`;
        } else { delete state.draft.picks[slot]; body=`<div class="open-pick"><strong>Open pick</strong><small>Draft or drag a player from the table</small><button class="open-draft-best" data-draft-best-slot="${slot}" draggable="false">Draft best here</button></div>`; }
      } else body=`<div class="open-pick"><strong>Open pick</strong><small>Draft or drag a player from the table</small><button class="open-draft-best" data-draft-best-slot="${slot}" draggable="false">Draft best here</button></div>`;
      html+=`<div class="slot" data-drop-slot="${slot}"><div class="pk tnum">${op}</div><div class="body">
        <div class="pick-context"><span>Round ${r}</span><b>Pick ${op}</b></div>
        ${body}</div></div>`;
    }
  }
  $('#dBoard').innerHTML=html;
  $$('#dBoard [data-draft-best-slot]').forEach(b=>b.onclick=e=>{ e.stopPropagation(); const player=availableDraftPlayers()[0]; if(player)placeDraftPlayer(player.id,+b.dataset.draftBestSlot); });
  $$('#dBoard [data-clear]').forEach(b=>b.onclick=()=>{ delete state.draft.picks[b.dataset.clear]; save(); renderDraft(); });
  $$('#dBoard [data-pick-details]').forEach(b=>b.onclick=e=>{ e.stopPropagation(); openView(b.dataset.pickDetails); });
  $$('#dBoard [data-drag-slot]').forEach(card=>{
    card.ondragstart=e=>{ const from=+card.dataset.dragSlot; draftDrag={type:'pick',from,pid:state.draft.picks[from]};
      e.dataTransfer.effectAllowed='move'; e.dataTransfer.setData('text/plain',String(from)); card.classList.add('dragging'); };
    card.ondragend=()=>{ card.classList.remove('dragging'); draftDrag=null; $$('.drop-target').forEach(el=>el.classList.remove('drop-target')); };
  });
  $$('#dBoard [data-drop-slot]').forEach(slot=>{
    slot.ondragover=e=>{ if(!draftDrag)return; e.preventDefault(); e.dataTransfer.dropEffect='move'; slot.classList.add('drop-target'); };
    slot.ondragleave=e=>{ if(!slot.contains(e.relatedTarget))slot.classList.remove('drop-target'); };
    slot.ondrop=e=>{ e.preventDefault(); slot.classList.remove('drop-target'); if(!draftDrag)return;
      const to=+slot.dataset.dropSlot; if(draftDrag.type==='pick'&&draftDrag.from===to)return;
      placeDraftPlayer(draftDrag.pid,to,draftDrag.type==='pick'?draftDrag.from:null); draftDrag=null; };
  });
  $('#finishDraft').disabled=pickedCount===0;
  const availableCount=availableDraftPlayers().length,next=nextOpenDraftSlot();
  $('#autoDraftBest').disabled=next<0||availableCount===0;
  $('#autoFillRound').disabled=next<0||availableCount===0;
  $('#undoDraftPick').disabled=pickedCount===0;
  $('#heroProgressCount').textContent=`${pickedCount} / ${totalSlots}`;
  $('#heroProgressBar').style.width=`${Math.min(100,pickedCount/totalSlots*100)}%`;
  $('#heroOnClock').textContent=next<0?'Draft complete':`On the clock · Pick ${next+1}`;
  const orderStatus=$('#draftOrderStatus');
  if(orderStatus)orderStatus.textContent=next<0?'Draft complete':`Round ${Math.floor(next/32)+1} · Pick ${next+1} on the clock`;
  const meta=$('#draftBoardMeta'),remaining=totalSlots-pickedCount,best=availableDraftPlayers()[0];
  if(meta)meta.innerHTML=`<span><b>${pickedCount}</b> picked</span><span><b>${remaining}</b> open</span><span><b>${next<0?'Done':'Pick '+(next+1)}</b> next</span>${best?`<span><b>${esc(best.name)}</b> top available</span>`:''}`;
  if(draftResultsOpen)renderDraftResults(); else setDraftView();
  hydrateTeamLogos($('#view-draft'));
}

$('#authBtn').onclick=async ()=>{if(currentUser){if(confirm(`Sign out ${currentUser.username}?`)){if(initFirebase())await firebaseAuth.signOut();setAuthToken('');currentUser=null;updateAuthUI();}}else{$('#authOverlay').classList.add('show');setTimeout(()=>$('#authUsername')?.focus(),0);}};
$('#authClose').onclick=()=>$('#authOverlay').classList.remove('show');
$('#authOverlay').onclick=e=>{if(e.target.id==='authOverlay')$('#authOverlay').classList.remove('show');};
$('#authMode')?.addEventListener('click',e=>{const button=e.target.closest('[data-auth-mode]');if(!button)return;authMode=button.dataset.authMode;setAuthMessage('');updateAuthUI();});
$('#authForm')?.addEventListener('submit',async e=>{
  e.preventDefault();setAuthMessage('');
  const username=$('#authUsername').value.trim(),password=$('#authPassword').value;
  if(moderateForumText(username)){setAuthMessage('That username is not allowed.');return;}
  try{
    if(initFirebase()){
      currentUser=authMode==='signup'?await firebaseSignup(username,password):await firebaseLogin(username,password);
    }else{
      throw new Error('Firebase could not load. Check your internet connection and try again.');
    }
    updateAuthUI();$('#authOverlay').classList.remove('show');
    await loadForumRemote();
  }catch(error){setAuthMessage(firebaseFriendlyError(error));}
});

load(); applyAccessControl();
if(new URLSearchParams(location.search).get('type')==='goalie'){pPlayerType='goalie';$$('#playerTypeToggle button').forEach(b=>b.classList.toggle('on',b.dataset.type==='goalie'));}
renderPlayers(); renderHome();
loadAccount().then(loadForumRemote);
const initialView=location.hash.slice(1);if(initialView&&$(`.tab[data-view="${initialView}"]`))$(`.tab[data-view="${initialView}"]`).click();
const launchGate=$('#launchGate'),launchEnter=$('#launchEnter');
function enterSite(){launchGate?.classList.add('leaving');document.body.classList.remove('launch-open');setTimeout(()=>launchGate?.remove(),220);}
if(launchEnter){launchEnter.onclick=enterSite;requestAnimationFrame(()=>launchEnter.focus({preventScroll:true}));}
const profileName=new URLSearchParams(location.search).get('player');if(profileName){const profile=state.players.find(p=>p.name.toLowerCase()===profileName.toLowerCase());if(profile){$('.tab[data-view="players"]').click();setTimeout(()=>openView(profile.id),0);}}
document.addEventListener('keydown',e=>{ if(e.key==='Escape'){ closeEditor(); closeTopicForm(); closeMockDetail(); closeScoutSubmit(); $('#authOverlay').classList.remove('show'); } });
