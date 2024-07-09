const { db } = require("./admin.js");
const { collection, getDocs } = require('firebase/firestore');

const NodeCache = require( "node-cache" );
const myCache = new NodeCache();

exports.retrieveGames = async (page, limit, sortField, sortOrder, searchQuery, genreSlug) => {
    const cacheKey = `games_all_${page}_${limit}_${sortField}_${sortOrder}_${searchQuery}_${genreSlug}`;
    const cachedData = myCache.get(cacheKey);

    if (cachedData) {
        return cachedData;
    }

    try {
        const validSortFields = ['name', 'rating', 'released', 'metacritic', 'playtime'];
        const validSortOrders = ['asc', 'desc'];

        if (!validSortFields.includes(sortField)) {
            console.warn(`Invalid sortField '${sortField}', defaulting to 'name'`);
            sortField = 'name';
        }
        if (!validSortOrders.includes(sortOrder.toLowerCase())) {
            console.warn(`Invalid sortOrder '${sortOrder}', defaulting to 'asc'`);
            sortOrder = 'asc';
        }

        let gamesRef = db.collection('games').orderBy(sortField, sortOrder);

        if (searchQuery) {
            const searchQueryLower = searchQuery.toLowerCase(); 
        
            gamesRef = gamesRef.where('slug', '>=', searchQueryLower).where('slug', '<=', searchQueryLower + '\uf8ff');
        }

        if (genreSlug) {
            gamesRef = gamesRef.where('genreSlugs', 'array-contains', genreSlug);
        }

        const offset = (page - 1) * limit;
        if (offset > 0) {
            const snapshot = await gamesRef.limit(offset).get();
            if (snapshot.docs.length < offset) {
                console.log(`Not enough documents to start after index ${offset}`);
                return [];
            }
            const lastDoc = snapshot.docs[snapshot.docs.length - 1];
            gamesRef = gamesRef.startAfter(lastDoc);
        }

        const snapshot = await gamesRef.limit(limit).get();

        if (snapshot.empty) {
            console.log('No documents found');
            return [];
        }

        let games = [];
        snapshot.forEach(doc => {
            games.push({ id: doc.id, ...doc.data() });
        });

        myCache.set(cacheKey, games, 86400);
        return games;
    } catch (error) {
        console.error('Error retrieving games:', error);
        throw new Error(`Firestore query failed: ${error.message}`);
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