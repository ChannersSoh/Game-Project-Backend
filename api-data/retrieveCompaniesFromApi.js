const axios = require('axios');
const path = require('path');
const fs = require('fs').promises;

const clientID = 'kxo3vbymepq12a62tgwrcyvrhdvepq';
const accessToken = 'vpm4apu42ji32j6rkjj9xfuwqd28lc';

const DATABASE_DIR = path.join(__dirname, 'database-data');
const INVOLVED_COMPANIES_FILE_PATH = path.join(DATABASE_DIR, 'involvedCompanies.json');
const COMPANIES_FILE_PATH = path.join(DATABASE_DIR, 'companies.json');

function fetchInvolvedCompaniesBatch(offset, batchSize) {
    const apiUrl = 'https://api.igdb.com/v4/involved_companies';
    const data = `
        fields company, created_at, developer, game;
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
}

function fetchCompaniesBatch(offset, batchSize) {
    const apiUrl = 'https://api.igdb.com/v4/companies';
    const data = `
        fields changed_company_id, country, created_at, description, developed, logo, name, parent, published, slug, start_date, updated_at, url, websites;
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
}

function fetchAndSaveData() {
    const involvedCompaniesBatchSize = 500;
    const companiesBatchSize = 500;
    let involvedCompaniesOffset = 0;
    let companiesOffset = 0;

    let allInvolvedCompanies = [];
    let allCompanies = [];

    function fetchInvolvedCompanies() {
        return fetchInvolvedCompaniesBatch(involvedCompaniesOffset, involvedCompaniesBatchSize)
            .then(involvedCompanies => {
                allInvolvedCompanies = allInvolvedCompanies.concat(involvedCompanies);
                involvedCompaniesOffset += involvedCompaniesBatchSize;

                console.log(`Fetched ${allInvolvedCompanies.length} involved companies...`);

                if (involvedCompanies.length === involvedCompaniesBatchSize) {
                    return fetchInvolvedCompanies();
                }
            });
    }

    function fetchCompanies() {
        return fetchCompaniesBatch(companiesOffset, companiesBatchSize)
            .then(companies => {
                allCompanies = allCompanies.concat(companies);
                companiesOffset += companiesBatchSize;

                console.log(`Fetched ${allCompanies.length} companies...`);

                if (companies.length === companiesBatchSize) {
                    return fetchCompanies();
                }
            });
    }

    return fetchInvolvedCompanies()
        .then(() => {
            const involvedCompaniesContent = JSON.stringify(allInvolvedCompanies, null, 2);
            return fs.writeFile(INVOLVED_COMPANIES_FILE_PATH, involvedCompaniesContent);
        })
        .then(() => fetchCompanies())
        .then(() => {
            const companiesContent = JSON.stringify(allCompanies, null, 2);
            return fs.writeFile(COMPANIES_FILE_PATH, companiesContent);
        })
        .then(() => {
            console.log(`Involved companies and companies fetched and saved successfully.`);
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