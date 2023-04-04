import { getIsochrone, type IsochroneType, type Point } from '$lib/isochrone';
import { json, type RequestHandler } from '@sveltejs/kit';
import { readFileSync } from 'fs';

type AmenityType = { name: string, file: string };
const amenityTypes: AmenityType[] = [
    { name: 'Supermarket', file: 'supermarket' },
    { name: 'Ambulancia', file: 'ambulancia' },
    { name: 'Reštaurácia', file: 'restauracia' },
    { name: 'Základná škola', file: 'zakladna_skola' },
    { name: 'Škôlka', file: 'skolka' },
    { name: 'Ihrisko', file: 'ihrisko' },
    { name: 'Psí výbeh', file: 'psi_vybeh' },
    { name: 'Gym', file: 'gym' },
    { name: 'Kaviarňa', file: 'kaviaren' },
    { name: 'Krčma', file: 'krcma' },
    { name: 'Detská ambulancia', file: 'detska_ambulancia' },
    { name: 'Drogéria', file: 'drogeria' },
    { name: 'Lekáreň', file: 'lekaren' },
    { name: 'Zubár', file: 'zubar' },
    { name: 'Pošta', file: 'posta' },
    { name: 'Zastávka', file: 'zastavka' },
    { name: 'Balíkobox', file: 'balikobox' },
    { name: 'Fastfood', file: 'fastfood' },
    { name: 'Bar', file: 'bar' },
];

export const GET: RequestHandler = async ({ request, url }) => {
    const lat = parseFloat(url.searchParams.get('lat') || '');
    const lon = parseFloat(url.searchParams.get('lon') || '');
    const mode = (url.searchParams.get('mode') || 'foot-walking') as IsochroneType;
    const time = parseInt(url.searchParams.get('time') || '900');

    const timeMultiplier = mode === 'foot-walking' ? 1 / 1.4 : mode === 'cycling-regular' ? 1 / 6.9 : 1 / 9;

    const closestAmenities: { name: string, x: number, y: number, dist: number, generalName: string, fileName: string, time: number }[] = [];

    for (const key in amenityTypes) {
        const currentAmenity = JSON.parse(readFileSync(`static/amenities/${amenityTypes[key].file}.json`).toString());

        let closest = {};
        let closestDistance = Infinity;

        for (const j in currentAmenity) {
            const distance = Math.sqrt(0.5 * (parseFloat(currentAmenity[j].x) - lon) ** 2 + (parseFloat(currentAmenity[j].y) - lat) ** 2) * 111000;
            if (distance < closestDistance) {
                closest = currentAmenity[j];
                closestDistance = distance;
            }
        }

        const travelTime = Math.max(Math.round(closestDistance * timeMultiplier * 0.7 / 60), 1);
        closestAmenities.push({ name: closest.name, x: closest.x, y: closest.y, dist: closestDistance, generalName: amenityTypes[key].name, fileName: amenityTypes[key].file, time: travelTime });
    }
    
    /*
    const apiUrl = 'http://localhost:8080/ors/v2/matrix/foot-walking';
    const destinations = closestAmenities.map(a => [parseFloat(a.x.toString()), parseFloat(a.y.toString())]);
    const req = {
        locations: [[lon, lat], ...destinations], sources: [0], metrics: ['distance'], units: 'm'
    };

    console.log(req);

    const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=utf-8', 'Accept': 'application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8' },
        body: JSON.stringify(req)
    });

    const j = await response.json();
    console.log(j);
    */

    return json({
        isochrone: await getIsochrone({ lat, lon }, mode, time),
        amenities: closestAmenities
    });
};
