const admin = require("firebase-admin");

const serviceAccount = require("./firestore-key/debugd1vas-firebase-adminsdk.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://debugd1vas-default-rtdb.europe-west1.firebasedatabase.app"
});

const db = admin.firestore();
module.exports = { admin, db };