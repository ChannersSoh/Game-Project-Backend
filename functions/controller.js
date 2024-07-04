const {retrieveAllGames, retrieveAllGenres, retrieveAllPublishers, retrieveAllDevelopers, retrieveGameTest, retrieveGameById} = require ('./model.js');
const req = require("express/lib/request");



exports.getAllGames = (req, res, next) => {
    retrieveAllGames()
        .then((games) => {
            res.status(200).send({games});
        })
        .catch((err) => {
            console.log(err);
            next(err);
        });
} /// too large, crashes, needs to be reduced / cached

exports.getAllGenres = (req, res, next) => {
    retrieveAllGenres()
        .then((genres) => {
            res.status(200).send({genres});
        })
        .catch((err) => {
            console.log(err);
            next(err);
        });
}

exports.getAllPublishers = (req, res, next) => {
    retrieveAllPublishers()
        .then((publishers) => {
            res.status(200).send({publishers});
        })
        .catch((err) => {
            console.log(err);
            next(err);
        });
}

exports.getAllDevelopers = (req, res, next) => {
    retrieveAllDevelopers()
        .then((publishers) => {
            res.status(200).send({publishers});
        })
        .catch((err) => {
            console.log(err);
            next(err);
        });
}

exports.getGameTest = (req, res, next) => {
    retrieveGameTest()
        .then((gameTest) => {
            res.status(200).send({gameTest});
        })
        .catch((err) => {
            console.log(err);
            next(err);
        });
}

exports.getGameById = (req, res, next) => {
    const {gameId} = req.params;

    retrieveGameById(gameId)
        .then((gameById) => {
            res.status(200).send({gameById});
        })
        .catch((err) => {
            console.log(err);
            next(err);
        });
}