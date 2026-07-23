const prospects = typeof SEED_PLAYERS !== 'undefined' ? SEED_PLAYERS : globalThis.SEED_PLAYERS;
const RECOVERED_U18_RATINGS = {
  'Wiggo Forsberg':{skating:82,shooting:82,iq:82,ozone:85,dzone:78,phys:75},
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
  'Leonards Aleksandrs Grundmanis':{skating:75,shooting:75,iq:76,ozone:75,dzone:77,phys:79},
  'Vilmer Salén Forsberg':{skating:76,shooting:78,iq:77,ozone:74,dzone:78,phys:79}
};
if (Array.isArray(prospects)) {
  if (!prospects.some(p => p.name === 'Hampus Zirath')) {
    prospects.push({
      name: 'Hampus Zirath',
      team: 'Djurgårdens IF U20',
      statsTeam: 'Djurgårdens IF U20',
      league: 'U20 Nationell',
      pos: 'F',
      shot: 'R',
      height: '5\'10"',
      weight: '161lbs',
      country: 'Sweden',
      headshot: 'https://media.hockeysverige.se/prod/images/small_landscape/774a7771a4fa-marcus-nordmarkb1mofpkv7r.webp',
      games: 33,
      goals: 11,
      assists: 15,
      points: 26,
      ppg: 0.79,
      statLines: [
        {
          season: '2025–26',
          team: 'Djurgårdens IF U20',
          teamUrl: 'https://www.eliteprospects.com/team/599/djurgardens-if-u20/2025-2026?tab=stats',
          league: 'U20 Nationell',
          leagueUrl: 'https://www.eliteprospects.com/league/u20-nationell/stats/2025-2026',
          games: 33,
          goals: 11,
          assists: 15,
          points: 26,
          ppg: 0.79,
          playoffs: {
            games: 12,
            goals: 8,
            assists: 2,
            points: 10,
            ppg: 0.83
          }
        }
      ],
      skating: 75,
      shooting: 75,
      iq: 75,
      ozone: 75,
      dzone: 75,
      phys: 75,
      role: [],
      source: 'https://www.eliteprospects.com/player/937436/hampus-zirath'
    });
  }
  const CHL_IMPORT_PLAYERS = [
    {"name":"Paul Sintschnig","team":"Halifax Mooseheads","league":"QMJHL","pos":"LW","shot":"","height":"6'1\"","weight":"176lbs","country":"Austria","headshot":"","dob":"Mar 11, 2009","birthplace":"Klagenfurt, Aut","priorTeam":"Villacher SV EC U18","importDraft":{"round":1,"pick":2,"team":"Halifax (fr. Baie-Comeau)"},"skating":75,"shooting":75,"iq":75,"ozone":75,"dzone":75,"phys":75,"role":[],"source":"2027_Draft_Eligible_CHL_Import.xlsx"},
    {"name":"Maxmilian Mares","team":"Rimouski Océanic","league":"QMJHL","pos":"LW","shot":"","height":"6'6\"","weight":"209lbs","country":"Czechia","headshot":"","dob":"Apr 3, 2009","birthplace":"Ostrava, Cze","priorTeam":"Liberec Bili Tygri Jr.","importDraft":{"round":1,"pick":5,"team":"Rimouski"},"skating":75,"shooting":75,"iq":75,"ozone":75,"dzone":75,"phys":75,"role":[],"source":"2027_Draft_Eligible_CHL_Import.xlsx"},
    {"name":"Dario Blengino","team":"Everett Silvertips","league":"WHL","pos":"LW","shot":"","height":"6'0\"","weight":"168lbs","country":"Czechia","headshot":"","dob":"Feb 21, 2009","birthplace":"Plzen, Cze","priorTeam":"Sparta Praha Jr. B","importDraft":{"round":1,"pick":6,"team":"Everett (fr. Swift Current)"},"skating":75,"shooting":75,"iq":75,"ozone":75,"dzone":75,"phys":75,"role":[],"source":"2027_Draft_Eligible_CHL_Import.xlsx"},
    {"name":"Andrei Nikolayev","team":"Victoriaville Tigres","league":"QMJHL","pos":"G","shot":"","height":"6'4\"","weight":"168lbs","country":"Russia","headshot":"","dob":"Jun 3, 2009","birthplace":"Moscow, Rus","priorTeam":"Des Moines Buccaneers","importDraft":{"round":1,"pick":11,"team":"Victoriaville"},"skating":75,"shooting":75,"iq":75,"ozone":75,"dzone":75,"phys":75,"role":[],"source":"2027_Draft_Eligible_CHL_Import.xlsx"},
    {"name":"David Huk","team":"Tri-City Americans","league":"WHL","pos":"C","shot":"","height":"6'1.5\"","weight":"206lbs","country":"Czechia","headshot":"","dob":"Nov 10, 2008","birthplace":"Praha, Cze","priorTeam":"Linkoping HC Jr.","importDraft":{"round":1,"pick":12,"team":"Tri-City (fr. Wenatchee)"},"skating":75,"shooting":75,"iq":75,"ozone":75,"dzone":75,"phys":75,"role":[],"source":"2027_Draft_Eligible_CHL_Import.xlsx"},
    {"name":"Matyas Cancik","team":"Saint John Sea Dogs","league":"QMJHL","pos":"LW","shot":"","height":"5'9\"","weight":"170lbs","country":"Czechia","headshot":"","dob":"Jun 13, 2009","birthplace":"Frýdek-Mistek, Cze","priorTeam":"Liberec HV Bili Jr. B","importDraft":{"round":1,"pick":14,"team":"Saint John"},"skating":75,"shooting":75,"iq":75,"ozone":75,"dzone":75,"phys":75,"role":[],"source":"2027_Draft_Eligible_CHL_Import.xlsx"},
    {"name":"Dmitri Savin","team":"Saginaw Spirit","league":"OHL","pos":"LW","shot":"","height":"6'2\"","weight":"190lbs","country":"Russia","headshot":"","dob":"Apr 14, 2009","birthplace":"Novosibirsk, Rus","priorTeam":"CSKA U18 Moscow","importDraft":{"round":1,"pick":31,"team":"Saginaw (fr. North Bay)"},"skating":75,"shooting":75,"iq":75,"ozone":75,"dzone":75,"phys":75,"role":[],"source":"2027_Draft_Eligible_CHL_Import.xlsx"},
    {"name":"Bogdan Yakushevsky","team":"Windsor Spitfires","league":"OHL","pos":"RW","shot":"","height":"5'11.75\"","weight":"180lbs","country":"Russia","headshot":"","dob":"Jan 16, 2009","birthplace":"Chita, Rus","priorTeam":"CSKA U18 Moscow","importDraft":{"round":1,"pick":46,"team":"Windsor"},"skating":75,"shooting":75,"iq":75,"ozone":75,"dzone":75,"phys":75,"role":[],"source":"2027_Draft_Eligible_CHL_Import.xlsx"},
    {"name":"Oskars Luks","team":"Prince Albert Raiders","league":"WHL","pos":"LD","shot":"","height":"6'4.5\"","weight":"215lbs","country":"Latvia","headshot":"","dob":"Oct 12, 2008","birthplace":"Riga, Lat","priorTeam":"Jukurit U18 Mestis","importDraft":{"round":1,"pick":60,"team":"Prince Albert"},"skating":75,"shooting":75,"iq":75,"ozone":75,"dzone":75,"phys":75,"role":[],"source":"2027_Draft_Eligible_CHL_Import.xlsx"},
    {"name":"Sebastian Taliga","team":"Drummondville Voltigeurs","league":"QMJHL","pos":"LW","shot":"","height":"5'10\"","weight":"165lbs","country":"Slovakia","headshot":"","dob":"Mar 16, 2009","birthplace":"Martin, SVK","priorTeam":"Mora IK J18E","importDraft":{"round":2,"pick":69,"team":"Drummondville (fr. Gatineau)"},"skating":75,"shooting":75,"iq":75,"ozone":75,"dzone":75,"phys":75,"role":[],"source":"2027_Draft_Eligible_CHL_Import.xlsx"},
    {"name":"Artyom Katsuro","team":"Calgary Hitmen","league":"WHL","pos":"LW","shot":"","height":"6'0\"","weight":"167lbs","country":"Russia","headshot":"","dob":"Jan 2, 2009","birthplace":"Moscow, Rus","priorTeam":"CSKA U18 Moscow","importDraft":{"round":2,"pick":82,"team":"Calgary (fr. Tri-City)"},"skating":75,"shooting":75,"iq":75,"ozone":75,"dzone":75,"phys":75,"role":[],"source":"2027_Draft_Eligible_CHL_Import.xlsx"},
    {"name":"Pyotr Novozhilov","team":"Shawinigan Cataractes","league":"QMJHL","pos":"LD","shot":"","height":"6'3\"","weight":"198lbs","country":"Russia","headshot":"","dob":"Sep 15, 2009","birthplace":"Moscow, Rus","priorTeam":"Dynamo Moscow U17","importDraft":{"round":2,"pick":84,"team":"Shawinigan (fr. Cape Breton)"},"skating":75,"shooting":75,"iq":75,"ozone":75,"dzone":75,"phys":75,"role":[],"source":"2027_Draft_Eligible_CHL_Import.xlsx"},
    {"name":"Ilya Kuzminykh","team":"Sherbrooke Phoenix","league":"QMJHL","pos":"LW","shot":"","height":"6'0.5\"","weight":"176lbs","country":"Russia","headshot":"","dob":"Jan 23, 2009","birthplace":"Yekaterinburg, Rus","priorTeam":"Yunost Yekaterinburg U17","importDraft":{"round":2,"pick":87,"team":"Sherbrooke"},"skating":75,"shooting":75,"iq":75,"ozone":75,"dzone":75,"phys":75,"role":[],"source":"2027_Draft_Eligible_CHL_Import.xlsx"},
    {"name":"Melichar Kovar","team":"Soo Greyhounds","league":"OHL","pos":"RW","shot":"","height":"6'3\"","weight":"185lbs","country":"Czechia","headshot":"","dob":"Apr 7, 2009","birthplace":"Pardubice, Cze","priorTeam":"Pardubice Jr. B","importDraft":{"round":2,"pick":95,"team":"Soo"},"skating":75,"shooting":75,"iq":75,"ozone":75,"dzone":75,"phys":75,"role":[],"source":"2027_Draft_Eligible_CHL_Import.xlsx"},
    {"name":"Gleb Olkhovik","team":"Shawinigan Cataractes","league":"QMJHL","pos":"LW","shot":"","height":"6'3\"","weight":"197lbs","country":"Russia","headshot":"","dob":"Feb 19, 2009","birthplace":"Voronezh, Rus","priorTeam":"CSKA U18 Moscow","importDraft":{"round":2,"pick":96,"team":"Shawinigan"},"skating":75,"shooting":75,"iq":75,"ozone":75,"dzone":75,"phys":75,"role":[],"source":"2027_Draft_Eligible_CHL_Import.xlsx"},
    {"name":"Yegor Kravchenko","team":"Kamloops Blazers","league":"WHL","pos":"LW","shot":"","height":"5'11\"","weight":"157lbs","country":"Kazakhstan","headshot":"","dob":"Dec 5, 2008","birthplace":"Temirtau, Kaz","priorTeam":"Snezhnye Barsy Nur-Sultan","importDraft":{"round":2,"pick":100,"team":"Kamloops"},"skating":75,"shooting":75,"iq":75,"ozone":75,"dzone":75,"phys":75,"role":[],"source":"2027_Draft_Eligible_CHL_Import.xlsx"},
    {"name":"Fyodor Andreyev","team":"Rouyn-Noranda Huskies","league":"QMJHL","pos":"LD","shot":"","height":"6'4\"","weight":"196lbs","country":"Russia","headshot":"","dob":"Feb 26, 2009","birthplace":"Moscow, Rus","priorTeam":"CSKA U18 Moscow","importDraft":{"round":2,"pick":108,"team":"Rouyn-Noranda"},"skating":75,"shooting":75,"iq":75,"ozone":75,"dzone":75,"phys":75,"role":[],"source":"2027_Draft_Eligible_CHL_Import.xlsx"},
    {"name":"Elias Matousek","team":"Barrie Colts","league":"OHL","pos":"RW","shot":"","height":"6'2\"","weight":"196lbs","country":"Czechia","headshot":"","dob":"Jun 5, 2009","birthplace":"Plzen, Cze","priorTeam":"Karlovy Vary Jr. B","importDraft":{"round":2,"pick":110,"team":"Barrie"},"skating":75,"shooting":75,"iq":75,"ozone":75,"dzone":75,"phys":75,"role":[],"source":"2027_Draft_Eligible_CHL_Import.xlsx"},
    {"name":"Damir Aptikashev","team":"Chicoutimi Saguenéens","league":"QMJHL","pos":"LD","shot":"","height":"6'1\"","weight":"183lbs","country":"Russia","headshot":"","dob":"Apr 27, 2009","birthplace":"Lesnoy, Rus","priorTeam":"SKA Academy","importDraft":{"round":2,"pick":111,"team":"Chicoutimi"},"skating":75,"shooting":75,"iq":75,"ozone":75,"dzone":75,"phys":75,"role":[],"source":"2027_Draft_Eligible_CHL_Import.xlsx"},
    {"name":"Dominik Drabek","team":"Penticton Vees","league":"WHL","pos":"RW","shot":"","height":"5'11\"","weight":"183lbs","country":"Czechia","headshot":"","dob":"Mar 21, 2009","birthplace":"Olomouc, Cze","priorTeam":"Pardubice Jr. B","importDraft":{"round":2,"pick":119,"team":"Penticton"},"skating":75,"shooting":75,"iq":75,"ozone":75,"dzone":75,"phys":75,"role":[],"source":"2027_Draft_Eligible_CHL_Import.xlsx"},
    {"name":"Johannes Dobrovolny","team":"Baie-Comeau Drakkar","league":"QMJHL","pos":"LW","shot":"","height":"5'11\"","weight":"165lbs","country":"Austria","headshot":"","dob":"Oct 4, 2008","birthplace":"Klagenfurt, Aut","priorTeam":"Klagenfurter EC KAC","importDraft":{"round":3,"pick":124,"team":"Baie-Comeau"},"skating":75,"shooting":75,"iq":75,"ozone":75,"dzone":75,"phys":75,"role":[],"source":"2027_Draft_Eligible_CHL_Import.xlsx"},
    {"name":"Oliver Vanha","team":"Lethbridge Hurricanes","league":"WHL","pos":"C","shot":"","height":"6'3\"","weight":"187lbs","country":"Czechia","headshot":"","dob":"Apr 22, 2009","birthplace":"Praha, Cze","priorTeam":"Pardubice Jr. B","importDraft":{"round":3,"pick":125,"team":"Lethbridge"},"skating":75,"shooting":75,"iq":75,"ozone":75,"dzone":75,"phys":75,"role":[],"source":"2027_Draft_Eligible_CHL_Import.xlsx"},
    {"name":"Oleksii Kryvonos","team":"Charlottetown Islanders","league":"QMJHL","pos":"C","shot":"","height":"5'10\"","weight":"143lbs","country":"Slovakia","headshot":"","dob":"Mar 22, 2009","birthplace":"Bratislava, SVK","priorTeam":"Nitra Jr.","importDraft":{"round":3,"pick":154,"team":"Charlottetown"},"skating":75,"shooting":75,"iq":75,"ozone":75,"dzone":75,"phys":75,"role":[],"source":"2027_Draft_Eligible_CHL_Import.xlsx"}
  ];
  const importNameKey = value => String(value || '').normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
  const importNameKeys = value => {
    const tokens = importNameKey(value).split(' ').filter(Boolean);
    const keys = new Set([importNameKey(value)]);
    if (tokens.length >= 2) {
      keys.add(`${tokens[0]} ${tokens[tokens.length - 1]}`);
      keys.add([...tokens].sort().join(' '));
    }
    return keys;
  };
  const existingImportKeys = new Set(prospects.flatMap(p => [...importNameKeys(p.name)]));
  CHL_IMPORT_PLAYERS.forEach(player => {
    if (![...importNameKeys(player.name)].some(key => existingImportKeys.has(key))) {
      prospects.push(player);
      importNameKeys(player.name).forEach(key => existingImportKeys.add(key));
    }
  });

  // Elite Prospects U18 Nationell snapshot supplied for the 2027 D-1 pool.
  // Existing seed records are updated in place so a player can never be duplicated.
  const epD1AssetSlug = value => String(value || '').normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
  const epD1NoPhoto = new Set(['Mio Forssell','Wille Lönqvist','Alexandre Monarque','Elton Sandman','Patric Hellström','Emil Forslund','Emil Öberg','Melwin Högman','Josef Krantz','Alwin Jarl']);
  const epD1PhotoExtension = {'Benjamin Jismyr':'jpeg','Dorian Eklund Aspe':'jpeg','Egon Ekberg':'jpeg','Leo Papista':'jpeg','Wille Andersson Jöhnk':'jpeg','Hjalmar Nilsén':'png','Leon Roos':'png','Werner Hansson':'png'};
  const epD1Headshot = name => epD1NoPhoto.has(name) ? '' : `assets/prospects/ep-2027-d1/${epD1AssetSlug(name)}.${epD1PhotoExtension[name] || 'jpg'}`;
  const EP_2027_D1_PLAYERS = [
    ['Mio Forssell','Skellefteå AIK U18','F','Sweden',22,15,27,42,1.91,'https://www.eliteprospects.com/player/1049779/mio-forssell'],
    ['Tim Münger','IFK Täby HC U18','LW','Switzerland',19,22,14,36,1.89,'https://www.eliteprospects.com/player/1031659/tim-munger'],
    ['Lucas Roynezon','Örebro HK U18','C','Sweden',22,6,30,36,1.64,'https://www.eliteprospects.com/player/1034997/lucas-roynezon'],
    ['Oliver Sundberg','Djurgårdens IF U18','F','Sweden',22,14,19,33,1.50,'https://www.eliteprospects.com/player/978511/oliver-sundberg'],
    ['Benjamin Nyström','Luleå HF U18','C/W','Sweden',19,19,13,32,1.68,'https://www.eliteprospects.com/player/1053297/benjamin-nystrom'],
    ['Olle Zetterstedt','Frölunda HC U18','C/W','Sweden',21,18,14,32,1.52,'https://www.eliteprospects.com/player/884680/olle-zetterstedt'],
    ['Wiggo Forsberg','Frölunda HC U18','F','Sweden',19,9,23,32,1.68,'https://www.eliteprospects.com/player/971729/wiggo-forsberg'],
    ['Love Lorentzon','Skellefteå AIK U18','C','Sweden',21,10,21,31,1.48,'https://www.eliteprospects.com/player/1010866/love-lorentzon'],
    ['William Aaram-Olsen','Örebro HK U18','F','Norway',22,9,22,31,1.41,'https://www.eliteprospects.com/player/1025605/william-aaram-olsen'],
    ['Mathias Sivertsen Andresen','IF Björklöven U18','F','Norway',20,15,14,29,1.45,'https://www.eliteprospects.com/player/985556/mathias-sivertsen-andresen'],
    ['Dorian Eklund Aspe','Djurgårdens IF U18','C/W','Sweden',19,14,15,29,1.53,'https://www.eliteprospects.com/player/971366/dorian-eklund-aspe'],
    ['Vincent Bengtsson','Växjö Lakers HC U18','C','Sweden',20,11,18,29,1.45,'https://www.eliteprospects.com/player/894912/vincent-bengtsson'],
    ['Melvin Wande','Luleå HF U18','C','Sweden',20,10,19,29,1.45,'https://www.eliteprospects.com/player/887127/melvin-wande'],
    ['Tom Pråhl','Djurgårdens IF U18','C','Sweden',20,14,13,27,1.35,'https://www.eliteprospects.com/player/1010049/tom-prahl'],
    ['Isak Alvudd','HV71 U18','F','Sweden',22,13,14,27,1.23,'https://www.eliteprospects.com/player/1035450/isak-alvudd'],
    ['Loui Karlsson','Leksands IF U18','F','Sweden',21,10,17,27,1.29,'https://www.eliteprospects.com/player/1009026/loui-karlsson'],
    ['Milo Spelkvist','Örebro HK U18','RW','Sweden',17,9,18,27,1.59,'https://www.eliteprospects.com/player/1013710/milo-spelkvist'],
    ['Alvin Svanlund','Timrå IK U18','C','Sweden',20,13,13,26,1.30,'https://www.eliteprospects.com/player/1013463/alvin-svanlund'],
    ['Fabian Merkle Rohdin','HV71 U18','F','Sweden',20,8,18,26,1.30,'https://www.eliteprospects.com/player/922728/fabian-merkle-rohdin'],
    ['Nick Travergård','IF Björklöven U18','LW','Sweden',22,12,13,25,1.14,'https://www.eliteprospects.com/player/971178/nick-travergard'],
    ['William Olofsson','Örebro HK U18','C','Sweden',22,9,16,25,1.14,'https://www.eliteprospects.com/player/1029266/william-olofsson'],
    ['Victor Tjäder','Linköping HC U18','F','Sweden',21,11,13,24,1.14,'https://www.eliteprospects.com/player/927590/victor-tjader'],
    ['Wille Andersson Jöhnk','Färjestad BK U18','LW/C','Sweden',19,9,15,24,1.26,'https://www.eliteprospects.com/player/1029055/wille-andersson-johnk'],
    ['Christian Furuvik','AIK U18','LW','Sweden',22,15,8,23,1.05,'https://www.eliteprospects.com/player/903924/christian-furuvik'],
    ['Noel Nord','Leksands IF U18','C','Sweden',15,13,10,23,1.53,'https://www.eliteprospects.com/player/963863/noel-nord'],
    ['Simon Näslund','Färjestad BK U18','F','Sweden',21,12,11,23,1.10,'https://www.eliteprospects.com/player/955915/simon-naslund'],
    ['Vincent Bäckdahl','IFK Täby HC U18','W/C','Sweden',17,11,12,23,1.35,'https://www.eliteprospects.com/player/1031087/vincent-backdahl'],
    ['Svante Forsman','Örebro HK U18','C','Sweden',21,11,12,23,1.10,'https://www.eliteprospects.com/player/903910/svante-forsman'],
    ['Alexander Søyland','Brynäs IF U18','F','Norway',22,11,12,23,1.05,'https://www.eliteprospects.com/player/964664/alexander-soyland'],
    ['Kid Åkerman','MoDo Hockey U18','F','Sweden',21,10,13,23,1.10,'https://www.eliteprospects.com/player/1009022/kid-akerman'],
    ['Rasmus Kennlöv','AIK U18','F','Sweden',22,7,16,23,1.05,'https://www.eliteprospects.com/player/1010054/rasmus-kennlov'],
    ['Wille Lönqvist','Rögle BK U18','C','Sweden',13,5,18,23,1.77,'https://www.eliteprospects.com/player/881970/wille-lonqvist'],
    ['Olle Lundström','Skellefteå AIK U18','F','Sweden',22,12,10,22,1.00,'https://www.eliteprospects.com/player/880501/olle-lundstrom'],
    ['Alexandre Monarque','Malmö Redhawks U18','F','France',22,11,11,22,1.00,'https://www.eliteprospects.com/player/890726/alexandre-monarque'],
    ['Albin Dahlqvist','Mora IK U18','C','Sweden',19,10,12,22,1.16,'https://www.eliteprospects.com/player/1006896/albin-dahlqvist'],
    ['Elton Sandman','Timrå IK U18','C','Sweden',20,9,13,22,1.10,'https://www.eliteprospects.com/player/1054129/elton-sandman'],
    ['Olle Törnqvist','Örebro HK U18','D','Sweden',18,6,16,22,1.22,'https://www.eliteprospects.com/player/969728/olle-tornqvist'],
    ['Sigge Larsson','Malmö Redhawks U18','C','Sweden',20,6,16,22,1.10,'https://www.eliteprospects.com/player/994982/sigge-larsson'],
    ['Joacim Olsson','Färjestad BK U18','F','Sweden',21,5,17,22,1.05,'https://www.eliteprospects.com/player/922733/joacim-olsson'],
    ['Jonathan Sandberg','Malmö Redhawks U18','LW','Sweden',19,13,8,21,1.11,'https://www.eliteprospects.com/player/907223/jonathan-sandberg'],
    ['Patric Hellström','Mora IK U18','C','Sweden',16,11,10,21,1.31,'https://www.eliteprospects.com/player/907205/patric-hellstrom'],
    ['Carl Karmehag','IF Björklöven U18','C','Sweden',18,11,10,21,1.17,'https://www.eliteprospects.com/player/1013461/carl-karmehag'],
    ['Simon Sejc','Växjö Lakers HC U18','F','Czechia',20,11,10,21,1.05,'https://www.eliteprospects.com/player/933152/simon-sejc'],
    ['Alfred Nordén','HV71 U18','C/W','Sweden',22,11,10,21,0.95,'https://www.eliteprospects.com/player/946749/alfred-norden'],
    ['Hjalmar Nilsén','Skellefteå AIK U18','F','Sweden',19,8,13,21,1.11,'https://www.eliteprospects.com/player/853897/hjalmar-nilsen'],
    ['Egon Ekberg','Djurgårdens IF U18','D','Sweden',22,7,14,21,0.95,'https://www.eliteprospects.com/player/974097/egon-ekberg'],
    ['Simon Karlsson','Brynäs IF U18','LW','Sweden',22,5,16,21,0.95,'https://www.eliteprospects.com/player/963885/simon-karlsson'],
    ['Leon Roos','Brynäs IF U18','C','Sweden',22,13,7,20,0.91,'https://www.eliteprospects.com/player/965943/leon-roos'],
    ['Emil Strålberg','HV71 U18','LW','Sweden',15,9,11,20,1.33,'https://www.eliteprospects.com/player/878208/emil-stralberg'],
    ['Felix Selindh','Frölunda HC U18','C','Sweden',19,9,11,20,1.05,'https://www.eliteprospects.com/player/891138/felix-selindh'],
    ['Benjamin Ask Haglund','Örebro HK U18','F','Norway',20,9,11,20,1.00,'https://www.eliteprospects.com/player/993928/benjamin-ask-haglund'],
    ['Leo Papista','Rögle BK U18','F','Sweden',17,8,12,20,1.18,'https://www.eliteprospects.com/player/881890/leo-papista'],
    ['Mille Forslund','Södertälje SK U18','F','Sweden',18,8,12,20,1.11,'https://www.eliteprospects.com/player/955481/mille-forslund'],
    ['Benjamin Jismyr','Linköping HC U18','C','Sweden',19,7,13,20,1.05,'https://www.eliteprospects.com/player/968050/benjamin-jismyr'],
    ['Theodor Norström','Huddinge IK U18','RW','Sweden',21,7,13,20,0.95,'https://www.eliteprospects.com/player/916371/theodor-norstrom'],
    ['Ludvig Langermo Neuman','IFK Täby HC U18','F','Sweden',18,2,18,20,1.11,'https://www.eliteprospects.com/player/1092581/ludvig-langermo-neuman'],
    ['Filip Wahlén','Örebro HK U18','RW','Sweden',20,10,9,19,0.95,'https://www.eliteprospects.com/player/975559/filip-wahlen'],
    ['Emil Forslund','Huddinge IK U18','C','Sweden',22,9,10,19,0.86,'https://www.eliteprospects.com/player/956351/emil-forslund'],
    ['Werner Hansson','Skellefteå AIK U18','F','Norway',22,9,10,19,0.86,'https://www.eliteprospects.com/player/1087414/werner-hansson'],
    ['Emil Öberg','MoDo Hockey U18','RW','Sweden',21,8,11,19,0.90,'https://www.eliteprospects.com/player/881233/emil-oberg'],
    ['Melvin Nylén','MoDo Hockey U18','F','Sweden',22,7,12,19,0.86,'https://www.eliteprospects.com/player/1089043/melvin-nylen'],
    ['Charlie Kalldin','Frölunda HC U18','F','Sweden',19,6,13,19,1.00,'https://www.eliteprospects.com/player/1033434/charlie-kalldin'],
    ['Sebastian Nilsson','Mora IK U18','F','Sweden',22,6,13,19,0.86,'https://www.eliteprospects.com/player/963131/sebastian-nilsson'],
    ['Olle Sandberg','HV71 U18','C','Sweden',20,5,14,19,0.95,'https://www.eliteprospects.com/player/1054436/olle-sandberg'],
    ['Noel Stenlund','Malmö Redhawks U18','D','Sweden',20,4,15,19,0.95,'https://www.eliteprospects.com/player/962061/noel-stenlund'],
    ['Kalle Broberg','Växjö Lakers HC U18','LW','Sweden',20,12,6,18,0.90,'https://www.eliteprospects.com/player/1054565/kalle-broberg'],
    ['Alexander Thunblom','HV71 U18','LW','Sweden',20,11,7,18,0.90,'https://www.eliteprospects.com/player/924832/alexander-thunblom'],
    ['Axel Hillström','Brynäs IF U18','LW/RW','Sweden',15,7,11,18,1.20,'https://www.eliteprospects.com/player/952401/axel-hillstrom'],
    ['Melwin Högman','Rögle BK U18','F','Sweden',18,7,11,18,1.00,'https://www.eliteprospects.com/player/881968/melwin-hogman'],
    ['Vilgot Nygren','Färjestad BK U18','F','Sweden',21,6,12,18,0.86,'https://www.eliteprospects.com/player/973258/vilgot-nygren'],
    ['Jonathan Granquist','Färjestad BK U18','C','Sweden',20,4,14,18,0.90,'https://www.eliteprospects.com/player/1033600/jonathan-granquist'],
    ['Oscar Westberg','MoDo Hockey U18','C','Sweden',22,2,16,18,0.82,'https://www.eliteprospects.com/player/1013465/oscar-westberg'],
    ['Josef Krantz','Växjö Lakers HC U18','F','Sweden',22,11,6,17,0.77,'https://www.eliteprospects.com/player/966491/josef-krantz'],
    ['Hugo Christersson','Huddinge IK U18','D','Sweden',22,10,7,17,0.77,'https://www.eliteprospects.com/player/885552/hugo-christersson'],
    ['Alwin Jarl','Leksands IF U18','F','Sweden',22,9,8,17,0.77,'https://www.eliteprospects.com/player/897557/alwin-jarl']
  ].map(([name,team,pos,country,games,goals,assists,points,ppg,source]) => ({
    name, team, statsTeam: team, league: 'U18 Nationell', pos, country,
    games, goals, assists, points, ppg, source,
    shot: '', height: '', weight: '', headshot: epD1Headshot(name),
    skating: 75, shooting: 75, iq: 75, ozone: 75, dzone: 75, phys: 75, role: [],
    statLines: [{season:'2025–26',team,league:'U18 Nationell',games,goals,assists,points,ppg}]
  })).filter(player => {
    const dob = EP_2027_D1_DETAILS?.[player.name]?.dob;
    if (!dob) return false;
    const born = new Date(dob);
    return born >= new Date('2008-09-16T00:00:00Z') && born <= new Date('2009-09-15T23:59:59Z');
  }).map(player => ({...player,...EP_2027_D1_DETAILS[player.name],headshot:EP_2027_D1_DETAILS[player.name].headshot||player.headshot}));

  // Eligible 2009-born NTDP players verified against their Elite Prospects profiles.
  const EP_2027_NTDP_PLAYERS = [
    ['Nathaniel Chizik','U.S. National U18 Team','G','L','6\'4"','198lbs','Feb 15, 2009',null,null,null,null,'https://www.eliteprospects.com/player/935455/nathaniel-chizik'],
    ['Ben Geiger','U.S. National U18 Team','D','R','6\'2"','172lbs','Jan 21, 2009',56,3,9,12,'https://www.eliteprospects.com/player/690042/ben-geiger'],
    ['Braden Horton','U.S. National U18 Team','F','R','6\'2"','183lbs','Apr 17, 2009',47,8,12,20,'https://www.eliteprospects.com/player/701434/braden-horton'],
    ['Freddie Schneider','U.S. National U18 Team','F','R','5\'11"','163lbs','Feb 16, 2009',43,10,14,24,'https://www.eliteprospects.com/player/951202/freddie-schneider']
  ].map(([name,team,pos,shot,height,weight,dob,games,goals,assists,points,source]) => ({
    name,team,statsTeam:'U.S. National U17 Team',league:'NTDP',pos,shot,height,weight,dob,source,country:'USA',
    games,goals,assists,points,ppg:games?Number((points/games).toFixed(2)):null,
    headshot:EP_2027_D1_DETAILS?.[name]?.headshot||'',skating:75,shooting:75,iq:75,ozone:75,dzone:75,phys:75,role:[],
    statLines:[{season:'2025–26',team:'U.S. National U17 Team',league:'NTDP',games,goals,assists,points,ppg:games?Number((points/games).toFixed(2)):null}]
  }));
  EP_2027_D1_PLAYERS.push(...EP_2027_NTDP_PLAYERS);

  // Conservative first-pass scouting grades. U18 Nationell production supplies the
  // baseline; NTDP receives a small competition adjustment. No overall exceeds 75.5.
  const ep2027GradeWeights = {
    F:{skating:.20,shooting:.20,iq:.18,ozone:.22,dzone:.10,phys:.10},
    D:{skating:.20,shooting:.10,iq:.20,ozone:.18,dzone:.20,phys:.12},
    G:{skating:.18,shooting:.20,iq:.18,ozone:.10,dzone:.22,phys:.12}
  };
  const ep2027Clamp = value => Math.max(67,Math.min(77,Math.round(value*10)/10));
  const ep2027HeightInches = value => {
    const match=String(value||'').match(/(\d+)'(\d+)/);return match?(+match[1]*12)+(+match[2]):72;
  };
  EP_2027_D1_PLAYERS.forEach(player => {
    const kind=player.pos==='G'?'G':/(^|\/)D(\/|$)/.test(player.pos)?'D':'F';
    const production=Number(player.ppg)||0;
    let target=kind==='G'?73:(player.league==='NTDP'?71.8+production*4:70.2+Math.max(0,production-.7)*4.4);
    target=Math.min(75.5,Math.round(target*10)/10);
    const goalRate=player.games?Number(player.goals||0)/player.games:0;
    const shotOffset=Math.max(-.7,Math.min(1.1,(goalRate-.28)*3));
    const sizeOffset=Math.max(-.8,Math.min(.9,(ep2027HeightInches(player.height)-72)*.22));
    let grades=kind==='G'
      ? {skating:target+.1,shooting:target+.2,iq:target,ozone:target-.5,dzone:target+.2,phys:target+.1}
      : kind==='D'
        ? {skating:target+.2,shooting:target-.5,iq:target+.2,ozone:target+.1,dzone:target+.3,phys:target+sizeOffset}
        : {skating:target+.2,shooting:target+shotOffset,iq:target+.1,ozone:target+.4,dzone:target-.8,phys:target+sizeOffset};
    const weights=ep2027GradeWeights[kind];
    let calculated=Object.entries(weights).reduce((sum,[key,weight])=>sum+grades[key]*weight,0);
    if(calculated>75.5){const correction=calculated-75.5;Object.keys(grades).forEach(key=>{grades[key]-=correction;});}
    Object.entries(grades).forEach(([key,value])=>{player[key]=ep2027Clamp(value);});
  });
  prospects.forEach(player=>{
    const recovered=RECOVERED_U18_RATINGS[player.name];
    if(recovered)Object.assign(player,recovered);
  });
  const epD1Key = value => String(value || '').normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
  const epD1Existing = new Map(prospects.map(player => [epD1Key(player.name), player]));
  EP_2027_D1_PLAYERS.forEach(player => {
    const existing = epD1Existing.get(epD1Key(player.name));
    if (existing) {
      const existingRatingsArePlaceholder = ['skating','shooting','iq','ozone','dzone','phys'].every(key => Number(existing[key]) === 75);
      const preserved = {
        headshot: existing.headshot,
        shot: existing.shot,
        height: existing.height,
        weight: existing.weight,
        skating: existing.skating,
        shooting: existing.shooting,
        iq: existing.iq,
        ozone: existing.ozone,
        dzone: existing.dzone,
        phys: existing.phys,
        role: existing.role
      };
      Object.assign(existing, player);
      Object.entries(preserved).forEach(([key,value]) => {
        if (key === 'headshot' && player.headshot) return;
        if (existingRatingsArePlaceholder && ['skating','shooting','iq','ozone','dzone','phys'].includes(key)) return;
        if (value !== undefined && value !== null && value !== '') existing[key] = value;
      });
    } else {
      prospects.push(player);
      epD1Existing.set(epD1Key(player.name), player);
    }
  });
}
