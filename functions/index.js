const functions = require('firebase-functions')
const express = require('express');
const cors = require('cors');

const {getGames, getAllGenres, getAllGames, getAllPublishers, getAllDevelopers, getGameById, getGamesByGenre, getAllUsers, getUserByUid, postToWishlist, deleteFromWishlist, postPreference, deletePreference, changeAvatar, getAllEndpoints, postToLibrary, deleteFromLibrary} = require('./controller.js');



const app = express();

app.use(cors({ origin: true }));

app.use(express.json());

app.get('/api', getAllEndpoints);

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
app.post('/api/users/:userId/library/add', postToLibrary);
app.delete('/api/users/:userId/library/delete/:toDel', deleteFromLibrary);
app.patch('/api/users/:userId/patch_avatar', changeAvatar);


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

exports.app = functions.runWith({ timeoutSeconds: 300, memory: '1GB' }).https.onRequest(app);



