const axios = require('axios');
const fs = require('fs');

const apiKey = 'insert rawg key here';

function fetchDevelopers(pageSize = 40, totalDevelopers = 200, retryCount = 3) {
    const totalPages = Math.ceil(totalDevelopers / pageSize);
    const requests = [];

    for (let page = 1; page <= totalPages; page++) {
        requests.push(
            axios({
                url: 'https://api.rawg.io/api/developers',
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
                    return fetchDevelopers(pageSize, totalDevelopers, retryCount - 1);
                } else {
                    const errorMessage = error.response && error.response.data ? JSON.stringify(error.response.data) : error.message;
                    throw new Error(`Error fetching developers after retries: ${errorMessage}`);
                }
            })
        );
    }

    return Promise.all(requests)
        .then(responses => {
            const allDevelopers = responses.flatMap(response => response.data.results);
            return allDevelopers.slice(0, totalDevelopers);
        });
}

fetchDevelopers()
    .then(developers => {
        fs.writeFileSync('developers.json', JSON.stringify(developers, null, 2));
        console.log('Developers fetched and saved successfully.');
    })
    .catch(err => {
        console.error(err.message);
    });