const admin = require('firebase-admin');
const serviceAccount = require('./firestore-key/game-test-api-rawg-firebase-adminsdk-x4sg6-06d0b6467f.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

module.exports = db;