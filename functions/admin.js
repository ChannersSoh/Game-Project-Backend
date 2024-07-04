const admin = require("firebase-admin");

const serviceAccount = require("put path here");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://practice-560b0-default-rtdb.europe-west1.firebasedatabase.app"
});

const db = admin.firestore();
module.exports = { admin, db };