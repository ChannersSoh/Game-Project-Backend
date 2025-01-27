const { db } = require("./admin.js");
const { collection, getDocs } = require('firebase/firestore');


const NodeCache = require( "node-cache" );
const {admin} = require("./admin");
const myCache = new NodeCache();
const allEndpoints = require('./endpoints.json')

exports.retrieveAllGames = async () => {
    const cacheKey = 'all_games';
    const cachedGames = myCache.get(cacheKey);

    if (cachedGames) {
        console.log('Returning cached data');
        return cachedGames;
    }

    try {
        const gameCollection = db.collection('games');
        const snapshot = await gameCollection.get();

        if (snapshot.empty) {
            console.log('No documents found');
            return [];
        }

        const games = [];
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

exports.retrieveAllUsers = async (req, res, next) => {
    try {
        const allUsersDB = db.collection('users');
        const snapshot = await allUsersDB.get();

        if (snapshot.empty) {
            res.status(404).send('No games Found');
            return;
        }

        const users = [];
        snapshot.forEach(doc => {
            users.push({ id: doc.id, ...doc.data() });
        });

        return users;
    } catch (error) {

        res.status(400).send(error.message);
    }
}

exports.retrieveUserByUid = async (req, res, next) => {
    try {
        const userData = db.collection('users').doc(req);
        const doc = await userData.get();
        if (!doc.exists) {
        } else {
            return doc.data();
        }


    } catch (error) {
        res.status(400).send(error.message);
    }
};

exports.addToWishlist = async (userId, newWish, res, next) => {
    try {
        const userByUid = db.collection('users').doc(userId);
        const fetchedUser = await userByUid.get();
        const userWishlist = fetchedUser.data().wishlist || [];
        const updatedWishlist = userWishlist.concat(newWish); 
        await userByUid.update({
            wishlist: updatedWishlist
        });

        const updatedUserDoc = await userByUid.get();
        if (!updatedUserDoc.exists) {
            throw new Error('User does not exist');
        } else {
            return updatedUserDoc.data();
        }


    } catch (error) {
        console.error('Error in addToLibrary:', error.message); // Error log
        throw error;  //changed error handling so that it is handled in controller
    }
};

exports.removeFromWishlist = async (userId, delWish) => {

    try {
        const userByUid = db.collection('users').doc(userId);
        const fetchedDoc = await userByUid.get();

        if (!fetchedDoc.exists) {
            throw new Error('User does not exist');
        }

        const userWishlist = fetchedDoc.data().wishlist || [];
        const updatedWishlist = userWishlist.filter((wish) => wish !== delWish);

        await userByUid.update({
            wishlist: updatedWishlist
        });
        const updatedUserDoc = await userByUid.get();


        return updatedUserDoc.data();

    } catch (error) {
        console.error('Error in addToLibrary:', error.message); // Error log
        throw error; //changed error handling so that it is handled in controller
    }
};

exports.addToPreferences = async (userId, newPref, res, next) => {

    try {
        const userByUid = db.collection('users').doc(userId);
        const fetchedUser = await userByUid.get();
        const userPreflist = fetchedUser.data().preferences;
        const updatedPrefList = userPreflist.concat(newPref);

        await userByUid.update({
            preferences: updatedPrefList
        });

        const updatedUserDoc = await userByUid.get();
        if (!updatedUserDoc.exists) {
            throw new Error('User does not exist');
        } else {
            return updatedUserDoc.data();
        }


    } catch (error) {
        res.status(400).send(error.message);
    }
};

exports.removePreferences = async (userId, delPref, res, next) => {

    try {
        const userByUid = db.collection('users').doc(userId);
        const fetchedDoc = await userByUid.get();

        if (!fetchedDoc.exists) {
            throw new Error('User does not exist');
        }

        const userPreflist = fetchedDoc.data().preferences;
        const updatedPreflist = userPreflist.filter((pref) => pref !== delPref);

        await userByUid.update({
            preferences: updatedPreflist
        });
        const updatedUserDoc = await userByUid.get();


        return updatedUserDoc.data();

    } catch (error) {
        res.status(400).send(error.message);
    }
};

exports.addToLibrary = async (userId, libraryAdd) => {

    try {
        const userByUid = db.collection('users').doc(userId);
        const fetchedUser = await userByUid.get();
        const userLibrary = fetchedUser.data().library || []; //create an empty library if doesnt exist
        const updatedLibraryList = userLibrary.concat(libraryAdd); //changed name of const for clarity

        await userByUid.update({
            library: updatedLibraryList
        });

        const updatedUserDoc = await userByUid.get();
        if (!updatedUserDoc.exists) {
            throw new Error('User does not exist');
        } else {
            return updatedUserDoc.data();
        }


    } catch (error) {
        console.error('Error in addToLibrary:', error.message); // Error log
        throw error;  //changed error handling so that it is handled in controller
    }
};

exports.removeFromLibrary = async (userId, libraryDel) => {

    try {
        const userByUid = db.collection('users').doc(userId);
        const fetchedDoc = await userByUid.get();

        if (!fetchedDoc.exists) {
            throw new Error('User does not exist');
        }

        const userLibrary = fetchedDoc.data().library || []; //made it so that if there is no library make one
        const updatedLibrary = userLibrary.filter((item) => item !== libraryDel);

        await userByUid.update({
           library: updatedLibrary //was preferences
        });
        const updatedUserDoc = await userByUid.get();


        return updatedUserDoc.data();

    } catch (error) {
        console.error('Error in addToLibrary:', error.message); // Error log
        throw error; //changed error handling so that it is handled in controller
    }
};

exports.patchAvatar = async (userId, newAvatar, res, next) => {
    try {
        const userByUid = db.collection('users').doc(userId);
        await userByUid.update({
            avatar: newAvatar
        });

        const updatedUserDoc = await userByUid.get();
        if (!updatedUserDoc.exists) {
            throw new Error('User does not exist');
        } else {
            return updatedUserDoc.data();
        }


    } catch (error) {
        res.status(400).send(error.message);
    }
};

exports.fetchAllEndpoints = async (req, res, next) => {
    try {
            return allEndpoints;
        }
        catch (error) {
        res.status(400).send(error.message);
    }
};


