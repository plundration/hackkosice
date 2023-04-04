import fs, { readFileSync } from 'fs';
import poly from 'polygon-clipping';

async function getIsochrone() {
    let files = fs.readdirSync('isochrones').filter(
        (file) => ['ambulancia', 'drogeria', 'gym', 'ihrisko', 'krcma', 'lekaren', 'psi_vybeh', 'skolka', 'supermarket', 'zakladna_skola'].includes(file.split('.')[0])
    );

    let file = JSON.parse(readFileSync('isochrones/' + files[0]).toString());
    for (let i = 0; i < file.length; i++) {
        for (let j = 0; j < file[i].length; j++) {
            for (let k = 0; k < file[i][j].length; k++) {
                file[i][j][k] = [file[i][j][k][1], file[i][j][k][0]];
            }
        }
    }

    let coords = file;

    for (let i = 1; i < files.length; i++) {
        file = JSON.parse(readFileSync('isochrones/' + files[i]).toString());
        for (let i = 0; i < file.length; i++) {
            for (let j = 0; j < file[i].length; j++) {
                for (let k = 0; k < file[i][j].length; k++) {
                    file[i][j][k] = [file[i][j][k][1], file[i][j][k][0]];
                }
            }
        }

        coords = poly.intersection(coords, file);
    }

    for (let i = 0; i < coords.length; i++) {
        for (let j = 0; j < coords[i].length; j++) {
            for (let k = 0; k < coords[i][j].length; k++) {
                coords[i][j][k] = [coords[i][j][k][1], coords[i][j][k][0]];
            }
        }
    }

    fs.writeFileSync(`fifteen.json`, JSON.stringify(coords));
}

getIsochrone();
