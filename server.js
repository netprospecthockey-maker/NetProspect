const express = require('express');
require('dotenv').config({ quiet: true });

const app = express();
const PORT = Number(process.env.PORT || 8787);

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

app.use(express.static(process.cwd(), { extensions: ['html'] }));

app.listen(PORT, () => {
  console.log(`NetProspect running at http://localhost:${PORT}`);
});
