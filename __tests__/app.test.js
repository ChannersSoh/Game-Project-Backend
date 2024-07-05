const {app} = require('../functions/index.js');
const request = require('supertest');
const db = require('../functions/admin.js');

const developersData = require('./api-data/developers.json');
const gamesWithDescriptionsData = require('./api-data/games_with_descriptions.json');
const genresData = require('./api-data/genres.json');
const publishersData = require('./api-data/publishers.json');
const gamesTest = require('./api-data/games-test.json');


describe('GET /api/genres', () => {
    test('Responds with a status 200 containing an array of objects, each representing the genres of games found in our database', () => {
        return request(app).get('/api/genres').expect(200)
            .then(({body}) => {
                body.genres.forEach((genre) => {
                    expect(genre).toMatchObject({
                        name: expect.any(String),
                        games_count: expect.any(Number),
                        id: expect.any(Number),
                        slug: expect.any(String),
                        image_background: expect.any(String),
                    });
                })

            })
    })
})

describe('GET /api/games-test', () => {
    test('Responds with a status 200 containing an array of an object of test data', () => {
        return request(app).get('/api/games-test').expect(200)
            .then(({body}) => {
                expect(body.gameTest).toEqual(gamesTest);
                expect(body.gameTest.length).toBe(2);
                body.gameTest.forEach((game) => {
                    expect(game).toMatchObject({
                        name: expect.any(String),
                        id: expect.any(Number),
                        slug: expect.any(String),
                        background_image: expect.any(String),
                    });
                })

            })
    })
})

describe.only('GET /api/games:gameId', () => {
    test('Responds with a status 200 containing a the game requested by ID, with the correct properties', () => {
        return request(app).get('/api/games/3498').expect(200)
            .then(({body}) => {
                console.log(body);
                expect(body.gameById).toMatchObject({
                    name : "Grand Theft Auto V",
                    added: expect.any(Number),
                    rating: expect.any(Number),
                    metacritic: expect.any(Number),
                    description: expect.any(String),
                });

            })
    })
})

