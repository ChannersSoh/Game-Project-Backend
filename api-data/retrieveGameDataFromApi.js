const axios = require('axios');
const fs = require('fs');

const apiKey = 'insert rawg key here';

function fetchGames(pageSize = 40, totalGames = 2000, retryCount = 3) {
    const totalPages = Math.ceil(totalGames / pageSize);
    const requests = [];

    for (let page = 1; page <= totalPages; page++) {
        requests.push(
            axios({
                url: 'https://api.rawg.io/api/games',
                method: 'GET',
                params: {
                    key: apiKey,
                    page_size: pageSize,
                    page: page,
                }
            })
            .catch(error => {
                if (retryCount > 0) {
                    console.log(`Request failed. Retrying... Attempts left: ${retryCount}`);
                    return fetchGames(pageSize, totalGames, retryCount - 1);
                } else {
                    throw new Error(`Error fetching games after retries: ${error.message}`);
                }
            })
        );
    }

    return Promise.all(requests)
        .then(responses => {
            const allGames = responses.flatMap(response => response.data.results);
            return allGames.slice(0, totalGames);
        });
}

function fetchGameDescriptions(games) {
    const descriptionRequests = games.map(game => 
        axios({
            url: `https://api.rawg.io/api/games/${game.id}`,
            method: 'GET',
            params: {
                key: apiKey,
            }
        })
        .then(response => ({
            ...game,
            description: response.data.description_raw || 'No description available'
        }))
        .catch(error => ({
            ...game,
            description: 'Error fetching description'
        }))
    );

    return Promise.all(descriptionRequests);
}

fetchGames()
    .then(games => fetchGameDescriptions(games))
    .then(gamesWithDescriptions => {
        fs.writeFileSync('games_with_descriptions.json', JSON.stringify(gamesWithDescriptions, null, 2));
        console.log('Games fetched and descriptions saved successfully.');
    })
    .catch(err => {
        console.error(err.message);
    });