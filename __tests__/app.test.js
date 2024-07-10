const {app} = require('../functions/index.js');
const request = require('supertest');
const db = require('../functions/admin.js');
const { toBeSortedBy } = require('jest-sorted');

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

describe('GET /api/games', () => {
    test('Responds with a status 200 containing an array of game objects', () => {
        return request(app)
            .get('/api/games')
            .expect(200)
            .then(({ body }) => {
                expect(body.games.length).toBe(20);
                body.games.forEach((game) => {
                    expect(game).toMatchObject({
                        name: expect.any(String),
                        id: expect.any(Number),
                        slug: expect.any(String),
                        background_image: expect.any(String),
                    });
                });
            });
    });

    test('Responds with games sorted by rating in descending order', async () => {
        const response = await request(app)
            .get('/api/games')
            .query({ sortField: 'rating', sortOrder: 'desc' })
            .expect(200);

        const games = response.body.games;
        expect(games.length).toBe(20); 
        expect(games).toBeSortedBy('rating', { descending: true });
    });

    test('Responds with games sorted by released date in ascending order', async () => {
        const response = await request(app)
            .get('/api/games')
            .query({ sortField: 'released', sortOrder: 'asc' })
            .expect(200);

        const games = response.body.games;
        expect(games.length).toBe(20); 
        expect(games).toBeSortedBy('released', { descending: false });
    });

    test('Responds with paginated results (page 2)', async () => {
        const response = await request(app)
            .get('/api/games')
            .query({ page: 2, limit: 10 })
            .expect(200);

        const games = response.body.games;
        expect(games.length).toBe(10); 
    });

    test('Responds with games filtered by search query', async () => {
        const response = await request(app)
            .get('/api/games')
            .query({ search: 'overwatch' }) 
            .expect(200);
    
        const games = response.body.games;
        expect(games.length).toBeGreaterThan(0); 
        games.forEach((game) => {
            expect(game.slug.toLowerCase()).toContain('overwatch');
        });
    });
    
    test('Responds with status 500 if limit query parameter is invalid', async () => {
        jest.spyOn(console, 'error').mockImplementation(() => {});

        const response = await request(app)
            .get('/api/games')
            .query({ limit: 'invalid' })
            .expect(500);

        expect(response.body.error).toBe('Internal Server Error');
        console.error.mockRestore();
    });
});

describe('GET /api/games/genres/:genreSlug', () => {
    test('Responds with a status 200 and a list of games for the specified genre', () => {
        const genreSlug = 'action'; 
        return request(app)
            .get(`/api/games/genres/${genreSlug}`)
            .expect(200)
            .then((response) => {
                const games = response.body.games;
                expect(games).toBeInstanceOf(Array);
                expect(games.length).toBeGreaterThan(0); 
                games.forEach((game) => {
                    expect(game).toMatchObject({
                        name: expect.any(String),
                        id: expect.any(Number),
                        slug: expect.any(String),
                        background_image: expect.any(String),
                    });
                });
            });
    });

    test('Responds with status 404 if the genre is not found', () => {
        const invalidGenreSlug = 'invalid-genre';
        return request(app)
            .get(`/api/games/genres/${invalidGenreSlug}`)
            .expect(404)
            .then((response) => {
                expect(response.body.error).toBe('Genre not found');
            });
    });

    test('Responds with games sorted by rating in descending order for the specified genre', () => {
        const genreSlug = 'action';
        return request(app)
            .get(`/api/games/genres/${genreSlug}`)
            .query({ sortField: 'rating', sortOrder: 'desc' })
            .expect(200)
            .then((response) => {
                const games = response.body.games;
                expect(games.length).toBeGreaterThan(0);
                expect(games).toBeSortedBy('rating', { descending: true });
            });
    });

    test('Responds with paginated results for the specified genre (page 2)', () => {
        const genreSlug = 'action';
        return request(app)
            .get(`/api/games/genres/${genreSlug}`)
            .query({ page: 2, limit: 10 })
            .expect(200)
            .then((response) => {
                const games = response.body.games;
                expect(games.length).toBe(10);
            });
    });

    test('Responds with status 500 if limit query parameter is invalid', () => {
        jest.spyOn(console, 'error').mockImplementation(() => {});

        const genreSlug = 'action';
        return request(app)
            .get(`/api/games/genres/${genreSlug}`)
            .query({ limit: 'invalid' })
            .expect(500)
            .then((response) => {
                expect(response.body.error).toBe('Internal Server Error');
                console.error.mockRestore();
            });
    });
});


describe('GET /api/games:gameId', () => {
    test('Responds with a status 200 containing a the game requested by ID, with the correct properties', () => {
        return request(app).get('/api/games/3498').expect(200)
            .then(({body}) => {
               
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


describe('POST & DELETE /api/users/:userId/wishlist', () => {
    test('Responds with a status 201 containing the posted item', () => {
        const testPostComment = { type: 'genre', body: 'RPG' };
        return request(app)
            .post('/api/users/test/wishlist/add') // Use a test user ID
            .send(testPostComment)
            .expect(201)
            .then(({ body }) => {
                expect(body.wishlist).toEqual([{ type: 'genre', body: 'RPG' }]);
                console.log(body);
            });
    });
    test('Responds with a status 204 with an empty array where the ', () => {
        return request(app)
            .delete('/api/users/test/wishlist/delete/RPG') 
            .expect(204)
            .then(({ body }) => {
                expect(body).toEqual({});
            });
    });
});

describe('POST & DELETE /api/users/:userId/preferences', () => {
    test('Responds with a status 201 containing the posted item', () => {
        const testPostComment = ['thingy', 'game', 'whatever'];
        return request(app)
            .post('/api/users/test/preferences/add') // Use a test user ID
            .send(testPostComment)
            .expect(201)
            .then(({ body }) => {
                expect(body.preferences).toEqual([{ type: 'genre', body: 'RPG' }]);
                console.log(body);
            });
    });
    test('Responds with a status 201 containing the posted item', () => {
        return request(app)
            .delete('/api/users/test/wishlist/delete/RPG') //
            .expect(204)
            .then(({ body }) => {
                expect(body).toEqual({});
            });
    });
});

describe('Patch /api/users/:userId/patch_avatar', () => {
    test('Responds with a status 201 containing the posted item', () => {
        const testPostAvatar = { avatarURL :'https://i2-prod.stokesentinel.co.uk/incoming/article9009038.ece/ALTERNATES/s810/0_Screenshot-2024-01-02-140517.jpg'};
        return request(app)
            .patch('/api/users/test/patch_avatar') // Use a test user ID
            .send(testPostAvatar)
            .expect(200)
            .then(({ body }) => {
                expect(body.preferences).toEqual(testPostAvatar);
            });
    });
});

// describe('Patch /api/execute-python', () => {
//     test('Responds with a status 201 containing the posted item', () => {

//         const testPostAvatar = { scriptPath : '__tests__/test.py', args: ['dark-souls'] };
//         return request(app)
//             .post('/api/execute-python') // Use a test user ID
//             .send(testPostAvatar)
//             .expect(200)
//             .then(({ body }) => {
//                 expect(body.preferences).toEqual(testPostAvatar);
//             });
//     });
// });

    describe.only('POST /api/games/:gameId/reviews', () => {
        test('should create a new review and return it', async () => {
            const newReview = { user: 'John Doe', content: 'Great game!', rating: 5 };

            const res = await request(app)
                .post(`/api/games/21/reviews`)
                .send(newReview)
                .expect(201);

            expect(res.body.review).toHaveProperty('id');
            expect(res.body.review).toMatchObject(newReview);
        });

    });


    describe.only('GET /api/games/:gameId/reviews', () => {
        test('should return reviews when requested', async () => {
            const res = await request(app)
                .get(`/api/games/21/reviews`)
                .expect(200);
            console.log(res.body)
            expect(res.body.reviews.length).toBe(1);
            expect(res.body.reviews[0]).toHaveProperty('id');
            expect(res.body.reviews[0].user).toBe('John Doe');
            expect(res.body.reviews[0].content).toBe('Great game!');
            expect(res.body.reviews[0].rating).toBe(5);
        });

        it('should fetch reviews when gameId is valid', async () => {
            const gameId = 21; // Replace with a valid gameId for testing
            const res = await request(app)
                .get(`/api/games/${gameId}/reviews`)
                .expect(200);
        
            console.log('Fetched reviews:', res.body.reviews); // Log the fetched reviews
            expect(res.body.reviews.length).toBeGreaterThan(0); // Assert that reviews are fetched
        });

        test('should return an empty array when there are no reviews', async () => {
            const res = await request(app)
                .get(`/api/games/21/reviews`)
                .expect(200);
            
            expect(res.body.reviews).toEqual([]);
        });
    });
