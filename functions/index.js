const functions = require('firebase-functions')
const express = require('express');
const cors = require('cors');

const { selectPlatforms } = require('./model.js')
const {getGames, getAllGenres, getAllGames, getAllPublishers, getAllDevelopers, getGameTest, getGameById, getGamesByGenre, getAllUsers, getUserByUid, postToWishlist, deleteFromWishlist, postPreference, deletePreference, changeAvatar} = require('./controller.js');


/*
Charnjeet

/api/games/:genre Get games by genre
/api/Get 10 games by name
Get top 10/20 most popular games
Querying cache for exitising

Jack:

/api - gets all available endpoints
Get 10 popular genres (less: educational, family, card & board)
Get all genres
Games by genre alphabetically
Endpoints for user

Together / whoever finishes first:

Switch between app & functions.https.onRequest(app); when testing or not
Link more parts to cache
Pagenation
* */

const app = express();

app.use(express.json());

app.get('/api/platforms', selectPlatforms); //remove later
app.get('/api/genres', getAllGenres);
app.get('/api/allgames', getAllGames); //this endpoint is for the recommendations only
app.get('/api/games', getGames); //this is similar to get all games but is pageinated so it is for general use
app.get('/api/publishers', getAllPublishers);
app.get('/api/developers', getAllDevelopers);
app.get('/api/games/:gameId', getGameById);
app.get('/api/games/genres/:genreSlug', getGamesByGenre)

app.get('/api/users', getAllUsers);
app.get('/api/users/:userId', getUserByUid);
app.post('/api/users/:userId/wishlist/add', postToWishlist);
app.delete('/api/users/:userId/wishlist/delete/:toDel', deleteFromWishlist);
app.post('/api/users/:userId/preferences/add', postPreference);
app.delete('/api/users/:userId/preferences/delete/:toDel', deletePreference);
app.patch('/api/users/:userId/patch_avatar', changeAvatar);

app.get('/api/games-test', getGameTest);

app.use((req, res, next) => {
    res.status(404).send({ msg: 'Not Found' });
});

app.use((err, req, res, next) => {
    if (err.status && err.msg) {
        res.status(err.status).send({ msg: err.msg });
    } else if (err.code === '22P02') {
        res.status(400).send({ msg: 'Invalid Input' });
    } else if (err.code === '23503') {
        res.status(404).send({ msg: 'Not Found' });
    } else {
        res.status(500).send('Server Error');
    }
});


// module.exports = { app };

exports.app = functions.https.onRequest(app);
