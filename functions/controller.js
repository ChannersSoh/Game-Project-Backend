const {retrieveGames, retrieveAllGenres, retrieveAllPublishers, retrieveAllDevelopers, retrieveGameTest, retrieveGameById} = require ('./model.js');
const req = require("express/lib/request");



exports.getGames = (req, res, next) => {
    const limit = parseInt(req.query.limit) || 20;
    const page = parseInt(req.query.page) || 1;
    const sortField = req.query.sortField || 'name';
    const sortOrder = req.query.sortOrder || 'asc';
    const searchQuery = req.query.search || ''; 

    retrieveGames(page, limit, sortField, sortOrder, searchQuery)
        .then((games) => {
            res.status(200).send({ games });
        })
        .catch((err) => {
            console.log(err);
            next(err);
        });
};

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