const axios = require('axios');
const path = require('path');
const fs = require('fs').promises;

const clientID = 'kxo3vbymepq12a62tgwrcyvrhdvepq';
const accessToken = 'vpm4apu42ji32j6rkjj9xfuwqd28lc';

const DATABASE_DIR = path.join(__dirname, 'database-data');
const AGERATING_FILE_PATH = path.join(DATABASE_DIR, 'ageRatings.json');

function fetchAgeRatingsBatch(offset, batchSize) {
    const apiUrl = 'https://api.igdb.com/v4/age_ratings';
    const data = `
        fields category, content_descriptions, rating, rating_cover_url, synopsis;
        limit ${batchSize};
        offset ${offset};
    `;

    return axios({
        url: apiUrl,
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Client-ID': clientID,
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'text/plain',
        },
        data: data,
    }).then(response => response.data)
      .catch(error => {
          throw new Error(error.response ? JSON.stringify(error.response.data) : error.message);
      });
};

function fetchAndSaveData() {

    const ageRatingsBatchSize = 500

    let ageRatingsOffset = 0;

 
    let allAgeRatings = [];


    function fetchAgeRatings() {
        return fetchAgeRatingsBatch(ageRatingsOffset, ageRatingsBatchSize)
            .then(ageRating => {
                allAgeRatings = allAgeRatings.concat(ageRating);
                ageRatingsOffset += ageRatingsBatchSize;

                console.log(`Fetched ${allAgeRatings.length} age rating values...`);

                if (ageRating.length === ageRatingsBatchSize) {
                    return fetchAgeRatings();
                }
            });
    }

        return fetchAgeRatings()
        .then(() => {
            const ageRatingContent = JSON.stringify(allAgeRatings, null, 2);
            return fs.writeFile(AGERATING_FILE_PATH, ageRatingContent);
        })
        .then(() => {
            console.log(`age ratings fetched and saved successfully.`);
        })
        .catch(error => {
            console.error(`Error fetching or saving data: ${error.message}`);
        });
}

fetchAndSaveData()
    .then(() => {
        console.log('Process completed successfully.');
    })
    .catch(error => {
        console.error(`Process encountered an error: ${error.message}`);
    });