exports.handler = async () => ({
  statusCode: 200,
  headers: {
    'Content-Type': 'application/javascript; charset=utf-8',
    'Cache-Control': 'no-store'
  },
  body: `window.__FIREBASE_CONFIG__=${JSON.stringify({
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.FIREBASE_DATABASE_URL,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
    measurementId: process.env.FIREBASE_MEASUREMENT_ID
  })};`
});
