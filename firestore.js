const admin = require('firebase-admin');
const serviceAccount = require('./game-api-test-igdb-firebase-adminsdk-d8mol-bd97f7cd4c.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

module.exports = db;