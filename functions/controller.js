
const {retrieveGames, retrieveAllGenres, retrieveAllGames, retrieveAllPublishers, retrieveAllDevelopers, retrieveGameById, retrieveAllUsers, retrieveUserByUid, addToWishlist, removeFromWishlist, addToPreferences, removePreferences, addToLibrary, removeFromLibrary,  patchAvatar, fetchAllEndpoints} = require ('./model.js');

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
}

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
        .then((developers) => {
            res.status(200).send({developers});
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

exports.getAllUsers = (req, res, next) => {

    retrieveAllUsers()
        .then((allUsers) => {
            res.status(200).send({allUsers});
        })
        .catch((err) => {
            console.log(err);
            next(err);
        })
}

exports.getUserByUid = (req, res, next) => {
    const {userId} = req.params;


    retrieveUserByUid(userId)
        .then((userById) => {
            res.status(200).send({userById});
       })
        .catch((err) => {
            console.log(err);
            next(err);
        });

}

exports.getGamesByGenre = (req, res, next) => {
    const genreSlug = req.params.genreSlug;
    const limit = parseInt(req.query.limit) || 20;
    const page = parseInt(req.query.page) || 1;
    const sortField = req.query.sortField || 'name';
    const sortOrder = req.query.sortOrder || 'asc';
    const searchQuery = req.query.search || ''; 

    retrieveGames(page, limit, sortField, sortOrder, searchQuery, genreSlug)
        .then((games) => {
            res.status(200).send({ games });
      })
        .catch((err) => {
            console.log(err);
            next(err);
        });

}

       

exports.postToWishlist = (req, res, next) => {
    const {userId} = req.params;
    const newWish = req.body;



    addToWishlist(userId, newWish)
        .then((postedWish) => {
            res.status(201).send({postedWish});
        })
        .catch((err) => {
            console.log(err);
            next(err);
        });

}

exports.deleteFromWishlist = (req, res, next) => {
    const {userId, toDel} = req.params;
    removeFromWishlist(userId, toDel)
        .then((deletedWish) => {
            res.status(204).send({deletedWish});
        })
        .catch((err) => {
            console.log(err);
            next(err);
        });

}

exports.postPreference = (req, res, next) => {
    const {userId} = req.params;
    const newPref = req.body;


    addToPreferences(userId, newPref)
        .then((postedPref) => {
            res.status(201).send({postedPref});
        })
        .catch((err) => {
            console.log(err);
            next(err);
        });

}

exports.deletePreference = (req, res, next) => {
    const {userId, toDel} = req.params;
    removePreferences(userId, toDel)
        .then((deletedPref) => {
            res.status(204).send({deletedPref});
        })
        .catch((err) => {
            console.log(err);
            next(err);
        });
};

exports.changeAvatar = (req, res, next) => {
    const {userId} = req.params;
    const newAvatar = req.body;


    patchAvatar(userId, newAvatar.avatarURL)
        .then((postedAvatar) => {
            res.status(201).send({postedAvatar});
        })
        .catch((err) => {
            console.log(err);
            next(err);
        });
}

exports.postToLibrary = (req, res, next) => {
    const {userId} = req.params;
    const libraryAdd = req.body;



    addToLibrary(userId, libraryAdd)
        .then((postedWish) => {
            res.status(201).send({postedWish});
        })
        .catch((err) => {
            console.log(err);
            next(err);
        });

}

exports.deleteFromLibrary = (req, res, next) => {
    const {userId, toDel} = req.params;

    removeFromLibrary(userId, toDel)
        .then((deletedLibrary) => {
            res.status(204).send({deletedLibrary});
        })
        .catch((err) => {
            console.log(err);
            next(err);
        });

}

exports.getAllEndpoints = (req, res, next) => {

    fetchAllEndpoints()
        .then((allEndpoints) => {
            res.status(200).send(allEndpoints);
        })
        .catch((err) => {
            console.log(err);
            next(err);
        });
}



