const axios = require('axios');
const fs = require('fs');

const apiKey = 'insert rawg key here';

function fetchPublishers(pageSize = 40, totalPublishers = 200, retryCount = 3) {
    const totalPages = Math.ceil(totalPublishers / pageSize);
    const requests = [];

    for (let page = 1; page <= totalPages; page++) {
        requests.push(
            axios({
                url: 'https://api.rawg.io/api/publishers',
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
                    return fetchPublishers(pageSize, totalPublishers, retryCount - 1);
                } else {
                    const errorMessage = error.response && error.response.data ? JSON.stringify(error.response.data) : error.message;
                    throw new Error(`Error fetching publishers after retries: ${errorMessage}`);
                }
            })
        );
    }

    return Promise.all(requests)
        .then(responses => {
            const allPublishers = responses.flatMap(response => response.data.results);
            return allPublishers.slice(0, totalPublishers);
        });
}

fetchPublishers()
    .then(publishers => {
        fs.writeFileSync('publishers.json', JSON.stringify(publishers, null, 2));
        console.log('Publishers fetched and saved successfully.');
    })
    .catch(err => {
        console.error(err.message);
    });