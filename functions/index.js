const functions = require('firebase-functions')
const express = require('express');
const cors = require('cors');

const { selectPlatforms } = require('./model.js')
const {getAllGames, getAllGenres, getAllPublishers, getAllDevelopers, getGameTest, getGameById} = require('./controller.js');

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

app.get('/api/platforms', selectPlatforms); //remove later
app.get('/api/genres', getAllGenres);
app.get('/api/games', getAllGames);
app.get('/api/publishers', getAllPublishers);
app.get('/api/developers', getAllDevelopers);
app.get('/api/games/:gameId', getGameById);

app.get('/api/games-test', getGameTest);

app.use(cors());


// module.exports = { app };

exports.app = functions.https.onRequest(app);
