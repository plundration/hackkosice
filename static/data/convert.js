import { readFileSync, writeFileSync } from 'fs';

let file = JSON.parse(readFileSync('./ambulancie.json').toString());

let count = file.features.length;
for (let i = 0; i < count; i++) {
    file.features[i].geometry.coordinates[0] = file.features[i].properties.poloha_lon;
    file.features[i].geometry.coordinates[1] = file.features[i].properties.poloha_lat;
}

writeFileSync('./ambulancie.geojson', JSON.stringify(file));
