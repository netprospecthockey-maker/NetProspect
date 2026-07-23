const express = require('express');
const fs = require('fs');
const os = require('os');
const path = require('path');
require('dotenv').config({ quiet: true });

const app = express();
const PORT = Number(process.env.PORT || 8787);
const overrideJsonPath = path.join(process.cwd(), 'localPlayerOverrides.json');
const overrideScriptPath = path.join(process.cwd(), 'localPlayerOverrides.js');
const pendingOverridePath = path.join(os.tmpdir(), 'netprospect-player-overrides.pending.json');
const persistedPlayerFields = ['team','statsTeam','league','pos','shot','height','weight','country','headshot','role','games','goals','assists','points','ppg','gaa','svPct','wins','losses','shutouts','skating','shooting','iq','ozone','dzone','phys','previousOverall'];

app.use(express.json({limit:'2mb'}));

app.use('/api', (request, response, next) => {
  const origin = request.get('Origin') || '';
  if (/^https?:\/\/(localhost|127\.0\.0\.1|\[::1\])(?::\d+)?$/i.test(origin)) {
    response.set('Access-Control-Allow-Origin', origin);
    response.set('Vary', 'Origin');
    response.set('Access-Control-Allow-Headers', 'Content-Type');
    response.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  }
  if (request.method === 'OPTIONS') return response.sendStatus(204);
  next();
});

app.post('/api/player-overrides', async (request, response) => {
  const localAddresses = new Set(['127.0.0.1','::1','::ffff:127.0.0.1']);
  if (!localAddresses.has(request.socket.remoteAddress)) return response.status(403).json({error:'Local access only'});
  const name = String(request.body?.name || '').trim();
  if (!name || name.length > 100) return response.status(400).json({error:'Invalid player name'});
  const clean = {};
  persistedPlayerFields.forEach(field => {
    if (request.body[field] !== undefined) clean[field] = request.body[field];
  });
  ['skating','shooting','iq','ozone','dzone','phys'].forEach(field => {
    clean[field] = Math.max(0, Math.min(100, Math.round(Number(clean[field]) || 0)));
  });
  try {
    let overrides = {};
    try { overrides = JSON.parse(await fs.promises.readFile(pendingOverridePath, 'utf8')); } catch (error) { if (error.code !== 'ENOENT') throw error; }
    overrides[name] = clean;
    const json = `${JSON.stringify(overrides, null, 2)}\n`;
    await fs.promises.writeFile(`${pendingOverridePath}.tmp`, json);
    await fs.promises.rename(`${pendingOverridePath}.tmp`, pendingOverridePath);
    response.set('Cache-Control','no-store').json({ok:true,queued:true,count:Object.keys(overrides).length});
  } catch (error) {
    console.error('Could not queue player override:', error);
    response.status(500).json({error:'Could not queue player override'});
  }
});

app.post('/api/player-overrides/commit', async (request, response) => {
  const localAddresses = new Set(['127.0.0.1','::1','::ffff:127.0.0.1']);
  if (!localAddresses.has(request.socket.remoteAddress)) return response.status(403).json({error:'Local access only'});
  try {
    let committed = {}, pending = {};
    try { committed = JSON.parse(await fs.promises.readFile(overrideJsonPath, 'utf8')); } catch (error) { if (error.code !== 'ENOENT') throw error; }
    try { pending = JSON.parse(await fs.promises.readFile(pendingOverridePath, 'utf8')); } catch (error) { if (error.code !== 'ENOENT') throw error; }
    const overrides = {...committed, ...pending};
    const json = `${JSON.stringify(overrides, null, 2)}\n`;
    const script = `const LOCAL_PLAYER_OVERRIDES = ${JSON.stringify(overrides, null, 2)};\nif (typeof SEED_PLAYERS !== 'undefined') {\n  SEED_PLAYERS.forEach(player => {\n    const override = LOCAL_PLAYER_OVERRIDES[player.name];\n    if (override) Object.assign(player, override, {_localEdit:true});\n  });\n}\n`;
    await Promise.all([
      fs.promises.writeFile(`${overrideJsonPath}.tmp`, json),
      fs.promises.writeFile(`${overrideScriptPath}.tmp`, script)
    ]);
    await Promise.all([
      fs.promises.rename(`${overrideJsonPath}.tmp`, overrideJsonPath),
      fs.promises.rename(`${overrideScriptPath}.tmp`, overrideScriptPath)
    ]);
    try { await fs.promises.unlink(pendingOverridePath); } catch (error) { if (error.code !== 'ENOENT') throw error; }
    response.set('Cache-Control','no-store').json({ok:true,count:Object.keys(overrides).length});
  } catch (error) {
    console.error('Could not commit player overrides:', error);
    response.status(500).json({error:'Could not save player overrides to code'});
  }
});

app.get('/firebase-config.js', (_request, response) => {
  const config = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.FIREBASE_DATABASE_URL,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
    measurementId: process.env.FIREBASE_MEASUREMENT_ID
  };
  response.set('Cache-Control', 'no-store');
  response.type('application/javascript').send(`window.__FIREBASE_CONFIG__=${JSON.stringify(config)};`);
});

app.get('/localPlayerOverrides.js', (_request, response) => {
  response.set('Cache-Control','no-store');
  response.sendFile(overrideScriptPath);
});

app.use(express.static(process.cwd(), { extensions: ['html'] }));

app.listen(PORT, () => {
  console.log(`NetProspect running at http://localhost:${PORT}`);
});
