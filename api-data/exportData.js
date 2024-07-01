const fs = require('fs').promises;
const db = require('../firestore'); 

const DATABASE_DIR = __dirname + '/database-data'; 
const GAMES_FILE_PATH = DATABASE_DIR + '/games.json';

async function loadJSON(filePath) {
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
}

async function exportToFirestore() {
    const games = await loadJSON(GAMES_FILE_PATH);
    const batchSize = 500; 

    for (let i = 0; i < games.length; i += batchSize) {
        const batch = db.batch();
        const batchGames = games.slice(i, i + batchSize);

        batchGames.forEach(game => {
            const docRef = db.collection('games').doc(); 
            batch.set(docRef, game);
        });

        await batch.commit();
        console.log(`Processed ${Math.min(i + batchSize, games.length)}/${games.length} games`);
    }

    console.log('Games exported to Firestore successfully.');
}
exportToFirestore().catch(error => {
    console.error(`Error exporting to Firestore: ${error.message}`);
});