const axios = require('axios');
const fs = require('fs');

const apiKey = 'insert rawg key here';

function fetchGenres(retryCount = 3) {
    return axios({
        url: 'https://api.rawg.io/api/genres',
        method: 'GET',
        params: {
            key: apiKey,
        }
    })
    .then(response => response.data.results)
    .catch(error => {
        if (retryCount > 0) {
            console.log(`Request failed. Retrying... Attempts left: ${retryCount}`);
            return fetchGenres(retryCount - 1);
        } else {
            const errorMessage = error.response && error.response.data ? JSON.stringify(error.response.data) : error.message;
            throw new Error(`Error fetching genres after retries: ${errorMessage}`);
        }
    });
}

fetchGenres()
    .then(genres => {
        fs.writeFileSync('genres.json', JSON.stringify(genres, null, 2));
        console.log('Genres fetched and saved successfully.');
    })
    .catch(err => {
        console.error(err.message);
    });