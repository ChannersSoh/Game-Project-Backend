const admin = require('firebase-admin');
const serviceAccount = require('./firestore-key/debugd1vas-firebase-adminsdk.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

module.exports = db;