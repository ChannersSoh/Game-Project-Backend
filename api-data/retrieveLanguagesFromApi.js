const axios = require('axios');
const path = require('path');
const fs = require('fs').promises;

const clientID = 'kxo3vbymepq12a62tgwrcyvrhdvepq';
const accessToken = 'vpm4apu42ji32j6rkjj9xfuwqd28lc';

const DATABASE_DIR = path.join(__dirname, 'database-data');
const LANGUAGE_SUPPORTS_FILE_PATH = path.join(DATABASE_DIR, 'languageSupports.json');

function fetchLanguageSupportsBatch(offset, batchSize) {
    const apiUrl = 'https://api.igdb.com/v4/language_supports';
    const data = `
        fields created_at, game, language, language_support_type;
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

    const languageSupportsBatchSize = 500

    let languageSupportsOffset = 0;
 
    let allLanguageSupports = [];

    function fetchLanguageSupports() {
        return fetchLanguageSupportsBatch(languageSupportsOffset, languageSupportsBatchSize)
            .then(languageSupports => {
                allLanguageSupports = allLanguageSupports.concat(languageSupports);
                languageSupportsOffset += languageSupportsBatchSize;

                console.log(`Fetched ${allLanguageSupports.length} language...`);

                if (languageSupports.length === languageSupportsBatchSize) {
                    return fetchLanguageSupports();
                }
            });
    }

        return fetchLanguageSupports()
        .then(() => {
            const languageSupportsContent = JSON.stringify(allLanguageSupports, null, 2);
            return fs.writeFile(LANGUAGE_SUPPORTS_FILE_PATH, languageSupportsContent);
        })
        .then(() => {
            console.log(`language supports fetched and saved successfully.`);
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