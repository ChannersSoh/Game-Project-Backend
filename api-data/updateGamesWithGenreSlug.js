const fs = require('fs');
const path = require('path');

const inputFilePath = path.join(__dirname, 'data', 'games_with_descriptions.json');
const outputFilePath = path.join(__dirname, 'data', 'games_with_descriptions_updated.json');

const rawData = fs.readFileSync(inputFilePath, 'utf8');
const games = JSON.parse(rawData);

games.forEach(game => {
    if (game.genres) {
        game.genreSlugs = game.genres.map(genre => genre.slug);
    } else {
        game.genreSlugs = [];
    }
});

fs.writeFileSync(outputFilePath, JSON.stringify(games, null, 2));

console.log('Updated JSON file has been saved as games_with_descriptions_updated.json');