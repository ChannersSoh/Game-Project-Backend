const path = require('path');
const fs = require('fs').promises;

const DATABASE_DIR = path.join(__dirname, 'database-data');
const GAMES_FILE_PATH = path.join(DATABASE_DIR, 'games.json');
const KEYWORDS_FILE_PATH = path.join(DATABASE_DIR, 'keywords.json');
const ARTWORKS_FILE_PATH = path.join(DATABASE_DIR, 'artworks.json');
const PLATFORMS_FILE_PATH = path.join(DATABASE_DIR, 'platforms.json');
const THEMES_FILE_PATH = path.join(DATABASE_DIR, 'themes.json');
const FRANCHISES_FILE_PATH = path.join(DATABASE_DIR, 'franchises.json');
const COMPANIES_FILE_PATH = path.join(DATABASE_DIR, 'companies.json');
const INVOLVED_COMPANIES_FILE_PATH = path.join(DATABASE_DIR, 'involvedCompanies.json');

async function loadJSON(filePath) {
    try {
        const data = await fs.readFile(filePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error(`Error loading file ${filePath}: ${error.message}`);
        return null;
    }
}

async function replaceIdsWithInfo() {
    const games = await loadJSON(GAMES_FILE_PATH);
    const keywords = await loadJSON(KEYWORDS_FILE_PATH);
    const artworks = await loadJSON(ARTWORKS_FILE_PATH);
    const platforms = await loadJSON(PLATFORMS_FILE_PATH);
    const themes = await loadJSON(THEMES_FILE_PATH);
    const franchises = await loadJSON(FRANCHISES_FILE_PATH);
    const involvedCompanies = await loadJSON(INVOLVED_COMPANIES_FILE_PATH);

    if (!games || !keywords || !artworks || !platforms || !themes || !franchises || !involvedCompanies) {
        console.error('One or more JSON files failed to load.');
        return;
    }

    const keywordMap = new Map(keywords.map(kw => [kw.id, kw]));
    const artworkMap = new Map(artworks.map(art => [art.id, art]));
    const platformMap = new Map(platforms.map(plt => [plt.id, plt]));
    const themeMap = new Map(themes.map(thm => [thm.id, thm]));
    const franchiseMap = new Map(franchises.map(fr => [fr.id, fr]));
    const involvedCompanyMap = new Map(involvedCompanies.map(ic => [ic.id, ic]));

    const updatedGames = games.map(game => {
        return {
            ...game,
            keywords: Array.isArray(game.keywords) ? game.keywords.map(keywordId => keywordMap.get(keywordId) || keywordId) : game.keywords,
            artworks: Array.isArray(game.artworks) ? game.artworks.map(artworkId => artworkMap.get(artworkId) || artworkId) : game.artworks,
            platforms: Array.isArray(game.platforms) ? game.platforms.map(platformId => platformMap.get(platformId) || platformId) : game.platforms,
            themes: Array.isArray(game.themes) ? game.themes.map(themeId => themeMap.get(themeId) || themeId) : game.themes,
            franchise: franchiseMap.get(game.franchise) || game.franchise,
            involved_companies: Array.isArray(game.involved_companies) ? game.involved_companies.map(icId => involvedCompanyMap.get(icId) || icId) : game.involved_companies,
        };
    });

    const updatedContent = JSON.stringify(updatedGames, null, 2);
    await fs.writeFile(GAMES_FILE_PATH, updatedContent);

    console.log('IDs replaced with respective information in games.json');
}

replaceIdsWithInfo().catch(error => {
    console.error(`Error replacing IDs: ${error.message}`);
});