const fs = require('fs');
const path = require('path');
const {db} = require('../functions/admin');

function uploadToFirestore(collectionName, data) {
    const collectionRef = db.collection(collectionName);
    const batch = db.batch();

    data.forEach(item => {
        const docRef = collectionRef.doc(item.id.toString());
        batch.set(docRef, item, { merge: true });
    });

    return batch.commit();
}

function readAndUpload(fileName, collectionName) {
    const filePath = path.join(__dirname, 'data', fileName); 
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    const batchSize = 400; 
    const batches = [];
    for (let i = 0; i < data.length; i += batchSize) {
        batches.push(data.slice(i, i + batchSize));
    }

    return batches.reduce((promise, batch) => {
        return promise.then(() => uploadToFirestore(collectionName, batch));
    }, Promise.resolve())
    .then(() => {
        console.log(`${collectionName} uploaded to Firestore successfully.`);
    })
    .catch(err => {
        console.error(`Error uploading ${collectionName}:`, err.message);
    });
}

const filesAndCollections = [
    { fileName: 'games_with_descriptions_updated.json', collectionName: 'games' }
];


filesAndCollections.forEach(item => {
    readAndUpload(item.fileName, item.collectionName);
});