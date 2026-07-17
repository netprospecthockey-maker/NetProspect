const prospects = typeof SEED_PLAYERS !== 'undefined' ? SEED_PLAYERS : globalThis.SEED_PLAYERS;
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
}
