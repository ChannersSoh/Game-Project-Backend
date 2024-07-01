const axios = require('axios');
const path = require('path');
const fs = require('fs').promises;

const clientID = 'kxo3vbymepq12a62tgwrcyvrhdvepq';
const accessToken = 'vpm4apu42ji32j6rkjj9xfuwqd28lc';

const DATABASE_DIR = path.join(__dirname, 'database-data');
const GAMES_FILE_PATH = path.join(DATABASE_DIR, 'games.json');
const KEYWORDS_FILE_PATH = path.join(DATABASE_DIR, 'keywords.json');
const ARTWORKS_FILE_PATH = path.join(DATABASE_DIR, 'artworks.json');
const PLATFORMS_FILE_PATH = path.join(DATABASE_DIR, 'platforms.json');
const THEMES_FILE_PATH = path.join(DATABASE_DIR, 'themes.json');
const FRANCHISES_FILE_PATH = path.join(DATABASE_DIR, 'franchises.json');

function fetchGamesBatch(offset, batchSize) {
    const apiUrl = 'https://api.igdb.com/v4/games';
    const data = `
        fields name, genres.name, tags, rating_count, keywords, age_ratings, rating, artworks, category, themes, platforms, franchise, game_engines, involved_companies, expansions, dlcs, summary, first_release_date, cover.url;
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

function fetchKeywordsBatch(offset, batchSize) {
    const apiUrl = 'https://api.igdb.com/v4/keywords';
    const data = `
        fields checksum, id, name, slug;
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

function fetchPlatformsBatch(offset, batchSize) {
    const apiUrl = 'https://api.igdb.com/v4/platforms';
    const data = `
        fields abbreviation, category, created_at, generation, name, platform_logo, slug, summary, url;
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

function fetchArtworksBatch(offset, batchSize) {
    const apiUrl = 'https://api.igdb.com/v4/artworks';
    const data = `
        fields height, width, game, image_id, animated, url;
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

function fetchThemesBatch(offset, batchSize) {
    const apiUrl = 'https://api.igdb.com/v4/themes';
    const data = `
        fields checksum, created_at, name, slug, updated_at, url;
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

function fetchFranchisesBatch(offset, batchSize) {
    const apiUrl = 'https://api.igdb.com/v4/franchises';
    const data = `
        fields created_at, games, name, slug;
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

function fetchAndSaveData(totalGames = 75000) {
    const gameBatchSize = 500;
    const keywordBatchSize = 500;
    const artworkBatchSize = 200; 
    const platformBatchSize = 500;
    const themeBatchSize = 500;
    const franchiseBatchSize = 500;

    let gameOffset = 0;
    let keywordOffset = 0;
    let artworkOffset = 0;
    let platformOffset = 0;
    let themeOffset = 0;
    let franchiseOffset = 0;

    let allGames = [];
    let allKeywords = [];
    let allArtworks = [];
    let allPlatforms = [];
    let allThemes = [];
    let allFranchises = [];

    function fetchGames() {
        return fetchGamesBatch(gameOffset, gameBatchSize)
            .then(games => {
                if (games.length === 0) return;

                allGames = allGames.concat(games);
                gameOffset += gameBatchSize;

                console.log(`Fetched ${allGames.length} games...`);

                if (allGames.length < totalGames) {
                    return fetchGames();
                }
            });
    }

    function fetchKeywords() {
        return fetchKeywordsBatch(keywordOffset, keywordBatchSize)
            .then(keywords => {
                if (keywords.length === 0) return;

                allKeywords = allKeywords.concat(keywords);
                keywordOffset += keywordBatchSize;

                console.log(`Fetched ${allKeywords.length} keywords...`);

                if (keywords.length === keywordBatchSize) {
                    return fetchKeywords();
                }
            });
    }

    function fetchArtworks() {
        return fetchArtworksBatch(artworkOffset, artworkBatchSize)
            .then(artworks => {
                if (artworks.length === 0) return;

                allArtworks = allArtworks.concat(artworks);
                artworkOffset += artworkBatchSize;

                console.log(`Fetched ${allArtworks.length} artworks...`);

                if (artworks.length === artworkBatchSize) {
                    return fetchArtworks();
                }
            });
    }

    function fetchPlatforms() {
        return fetchPlatformsBatch(platformOffset, platformBatchSize)
            .then(platforms => {
                if (platforms.length === 0) return;

                allPlatforms = allPlatforms.concat(platforms);
                platformOffset += platformBatchSize;

                console.log(`Fetched ${allPlatforms.length} platforms...`);

                if (platforms.length === platformBatchSize) {
                    return fetchPlatforms();
                }
            });
    }

    function fetchThemes() {
        return fetchThemesBatch(themeOffset, themeBatchSize)
            .then(themes => {
                if (themes.length === 0) return;

                allThemes = allThemes.concat(themes);
                themeOffset += themeBatchSize;

                console.log(`Fetched ${allThemes.length} themes...`);

                if (themes.length === themeBatchSize) {
                    return fetchThemes();
                }
            });
    }

    function fetchFranchises() {
        return fetchFranchisesBatch(franchiseOffset, franchiseBatchSize)
            .then(franchises => {
                if (franchises.length === 0) return;

                allFranchises = allFranchises.concat(franchises);
                franchiseOffset += franchiseBatchSize;

                console.log(`Fetched ${allFranchises.length} franchises...`);

                if (franchises.length === franchiseBatchSize) {
                    return fetchFranchises();
                }
            });
    }

    return fetchGames()
        .then(() => {
            const gamesContent = JSON.stringify(allGames.slice(0, totalGames), null, 2);
            return fs.writeFile(GAMES_FILE_PATH, gamesContent);
        })
        .then(() => fetchKeywords())
        .then(() => {
            const keywordsContent = JSON.stringify(allKeywords, null, 2);
            return fs.writeFile(KEYWORDS_FILE_PATH, keywordsContent);
        })
        .then(() => fetchArtworks())
        .then(() => {
            const artworksContent = JSON.stringify(allArtworks, null, 2);
            return fs.writeFile(ARTWORKS_FILE_PATH, artworksContent);
        })
        .then(() => fetchPlatforms())
        .then(() => {
            const platformsContent = JSON.stringify(allPlatforms, null, 2);
            return fs.writeFile(PLATFORMS_FILE_PATH, platformsContent);
        })
        .then(() => fetchThemes())
        .then(() => {
            const themesContent = JSON.stringify(allThemes, null, 2);
            return fs.writeFile(THEMES_FILE_PATH, themesContent);
        })
        .then(() => fetchFranchises())
        .then(() => {
            const franchisesContent = JSON.stringify(allFranchises, null, 2);
            return fs.writeFile(FRANCHISES_FILE_PATH, franchisesContent);
        })
        .then(() => {
            console.log(`Games, keywords, platforms, artworks, themes, and franchises fetched and saved successfully.`);
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