const { db } = require("./admin.js");
const { collection, getDocs } = require('firebase/firestore');

const NodeCache = require( "node-cache" );
const myCache = new NodeCache();


exports.retrieveAllGames = async (req, res, next) => {

    const cacheKey = 'games_all';
    const cachedData = myCache.get(cacheKey);

    if (cachedData) {
        return cachedData;
    }

    try {
        const gamesRef = db.collection('games');
        const snapshot = await gamesRef.get();

        if (snapshot.empty) {
            return [];
        }

        let games = [];
        snapshot.forEach(doc => {
            games.push({ id: doc.id, ...doc.data() });
        });

        // Set cache with a TTL of 1 hour (3600 seconds)
        myCache.set(cacheKey, games, 86400);
        return games;
    } catch (error) {
        throw error;
    }
}





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