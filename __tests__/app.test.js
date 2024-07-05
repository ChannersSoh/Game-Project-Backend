const {app} = require('../functions/index.js');
const request = require('supertest');
const db = require('../functions/admin.js');

const developersData = require('../api-data/data/developers.json');
const gamesWithDescriptionsData = require('../api-data/data/games_with_descriptions.json');
const genresData = require('../api-data/data/genres.json');
const publishersData = require('../api-data/data/publishers.json');



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

describe.only('GET /api/games', () => {
    test('Responds with a status 200 containing an array of an object of test data', () => {
        return request(app).get('/api/games').expect(200)
            .then(({body}) => {
                expect(body.games.length).toBe(20);
                body.games.forEach((game) => {
                    expect(game).toMatchObject({
                        name: expect.any(String),
                        id: expect.any(Number),
                        slug: expect.any(String),
                        background_image: expect.any(String),
                    });
                })

            })
    })
    test('should return status 500 if something goes wrong', async () => {
        jest.spyOn(console, 'error').mockImplementation(() => {});
        
        const response = await request(app)
            .get('/games')
            .query({ limit: 'invalid' }) 
console.log(response)
        expect(response.status).toBe(500);

        console.error.mockRestore();
    });
})

describe('GET /api/games:gameId', () => {
    test('Responds with a status 200 containing a the game requested by ID, with the correct properties', () => {
        return request(app).get('/api/games/3498').expect(200)
            .then(({body}) => {
                console.log(body);
                expect(body.gameById).toMatchObject({
                    name : "Grand Theft Auto V",
                    added: expect.any(Number),
                    rating: 4.47,
                    metacritic: expect.any(Number),
                    description: expect.any(String),
                    released: "2013-09-17",
                    background_image: expect.any(String),
                    tags: expect.arrayContaining([
                        expect.objectContaining({
                            id: expect.any(Number),
                            name: expect.any(String),
                            slug: expect.any(String),
                            language: expect.any(String),
                            games_count: expect.any(Number),
                            image_background: expect.any(String)
                        })
                    ]),
                    genres: expect.arrayContaining([
                        expect.objectContaining({
                            id: expect.any(Number),
                            name: expect.any(String),
                            slug: expect.any(String),
                            games_count: expect.any(Number),
                            image_background: expect.any(String)
                        })
                    ])
                });

            })
    })
})

