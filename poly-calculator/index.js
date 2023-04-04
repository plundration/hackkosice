import fs from 'fs';
import poly from 'polygon-clipping';

const apiUrl = 'http://localhost:8080/ors/v2/isochrones';

async function getIsochrone(fileName) {

    let file;

    try {
        file = JSON.parse(fs.readFileSync(`amenities/${fileName}.json`).toString());
    } catch (error) {
        console.log(fileName, error)
    }


    if (!file) {console.log(fileName, 'no file');  return }

    let coords = [[file[0].poly_15]];

    for (let i = 1; i < file.length; i++) {
        try {
            coords = poly.union(coords, [[file[i].poly_15]]);
        } catch (error) {
            console.log(fileName, error)
        }
    }

    for (let i = 0; i < coords.length; i++) {
        for (let j = 0; j < coords[i].length; j++) {
            for (let k = 0; k < coords[i][j].length; k++) {
                coords[i][j][k] = [coords[i][j][k][1], coords[i][j][k][0]];
            }
        }
    }

    fs.writeFileSync(`isochrones/${fileName}.json`, JSON.stringify(coords));
}

// fs.readdirSync('amenities').forEach(file => {
//     if (file === 'zastavka.json') return;
//     getIsochrone(file.replace('.json', ''));
// });

getIsochrone('kaviaren');