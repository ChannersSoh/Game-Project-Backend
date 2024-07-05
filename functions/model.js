const { db } = require("./admin.js");
const { collection, getDocs } = require('firebase/firestore');

const NodeCache = require( "node-cache" );
const myCache = new NodeCache();

exports.retrieveAllGames = async (page, limit) => {
    const cacheKey = `games_all_${page}_${limit}`;
    const cachedData = myCache.get(cacheKey);

    if (cachedData) {
        return cachedData;
    }

    try {
        let gamesRef = db.collection('games').orderBy('name').limit(limit);

        if (page > 1) {
            const startAfterIndex = (page - 1) * limit;
        
            // Query for the first page if startAfterIndex is 0
            if (startAfterIndex > 0) {
                const snapshot = await gamesRef.limit(startAfterIndex).get();
        
                if (snapshot.docs.length < startAfterIndex) {
                    console.log(`Not enough documents to start after index ${startAfterIndex}`);
                    return [];
                }
        
                const lastDoc = snapshot.docs[snapshot.docs.length - 1];
                gamesRef = gamesRef.startAfter(lastDoc);
            }
        }

        const snapshot = await gamesRef.get();

        if (snapshot.empty) {
            return []; 
        }

        let games = [];
        snapshot.forEach(doc => {
            games.push({ id: doc.id, ...doc.data() });
        });

        myCache.set(cacheKey, games, 86400);
        return games;
    } catch (error) {
        throw error; 
    }
};

exports.retrieveGames = async (searchTerm, sortField, sortOrder, page, limit) => {
    const cacheKey = `games_${searchTerm}_${sortField}_${sortOrder}_${page}_${limit}`;

    const cachedData = myCache.get(cacheKey);

    if (cachedData) {
        return cachedData;
    }

    try {
        const gamesRef = db.collection('games');

        let query = gamesRef;
        if (searchTerm) {
            query = query.where('name', '>=', searchTerm).where('name', '<=', searchTerm + '\uf8ff');
        }
        if (sortField && sortOrder) {
            query = query.orderBy(sortField, sortOrder);
        }

        query = query.offset((page - 1) * limit).limit(limit);

        const snapshot = await query.get();

        if (snapshot.empty) {
            return [];
        }

        let games = [];
        snapshot.forEach(doc => {
            games.push({ id: doc.id, ...doc.data() });
        });

        myCache.set(cacheKey, games, 86400);
        return games;
    } catch (error) {
        throw error;
    }
};



exports.selectPlatforms = async (req, res, next) => {
    try {
        const platformsCollection = db.collection('platforms');
        const snapshot = await platformsCollection.get();

        if (snapshot.empty) {
            res.status(200).send('No platforms found');
            return;
        }

        const platforms = [];
        snapshot.forEach(doc => {
            platforms.push({ id: doc.id, ...doc.data() });
        });

        res.status(200).send(platforms);
    } catch (error) {
        res.status(400).send(error.message);
    }
};



exports.retrieveAllGenres = async (req, res, next) => {
    try {
        const genreCollection = db.collection('genres');
        const snapshot = await genreCollection.get();

        if (snapshot.empty) {
            res.status(404).send('No games Found');
            return;
        }

        const genres = [];
        snapshot.forEach(doc => {
            genres.push({ id: doc.id, ...doc.data() });
        });

       return genres;
    } catch (error) {

        res.status(400).send(error.message);
    }
};

exports.retrieveAllPublishers = async (req, res, next) => {
    try {
        const publisherCollection = db.collection('publishers');
        const snapshot = await publisherCollection.get();

        if (snapshot.empty) {
            res.status(404).send('No games Found');
            return;
        }

        const publishers = [];
        snapshot.forEach(doc => {
            publishers.push({ id: doc.id, ...doc.data() });
        });

        return publishers;
    } catch (error) {
        res.status(400).send(error.message);
    }
};

exports.retrieveAllDevelopers = async (req, res, next) => {
    try {
        const developerCollection = db.collection('developers');
        const snapshot = await developerCollection.get();

        if (snapshot.empty) {
            res.status(404).send('No games Found');
            return;
        }

        const developers = [];
        snapshot.forEach(doc => {
            developers.push({ id: doc.id, ...doc.data() });
        });

        return developers;
    } catch (error) {
        res.status(400).send(error.message);
    }
};

exports.retrieveGameTest = async (req, res, next) => {
    try {
        const gameTestCollection = db.collection('games-test');
        const snapshot = await gameTestCollection.get();

        if (snapshot.empty) {
            res.status(404).send('No games Found');
            return;
        }

        const gameTest = [];
        console.log(snapshot);
        snapshot.forEach(doc => {
            gameTest.push({ id: doc.id, ...doc.data() });
        });

        return gameTest;
    } catch (error) {
        res.status(400).send(error.message);
    }
};

exports.retrieveGameById = async (req, res, next) => {
    try {
        const gameId = db.collection('games').doc(req);
        const doc = await gameId.get();
        if (!doc.exists) {
        } else {
            return doc.data();
        }


    } catch (error) {
        res.status(400).send(error.message);
    }
};