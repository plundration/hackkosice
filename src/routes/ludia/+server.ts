import { getIsochrone, type IsochroneType, type Point } from '$lib/isochrone';
import { json, type RequestHandler } from '@sveltejs/kit';
import { readFileSync } from 'fs';

type AmenityType = { name: string, shortName: string, file: string };
const amenityTypes: AmenityType[] = [
    { name: 'Reštaurácia', shortName: 're', file: 'restauracia' },
    { name: 'Kaviarňa', shortName: 'ka', file: 'kaviaren' },
    { name: 'Krčma', shortName: 'kr', file: 'krcma' },
    { name: 'Ambulancia', shortName: 'am', file: 'ambulancia' },
    { name: 'Bar', shortName: 'ba', file: 'bar' },
    { name: 'Detská ambulancia', shortName: 'da', file: 'detska_ambulancia' },
    { name: 'Ihrisko', shortName: 'ih', file: 'ihrisko' },
    { name: 'Drogéria', shortName: 'dr', file: 'drogeria' },
    { name: 'Fastfood', shortName: 'ff', file: 'fastfood' },
    { name: 'Gym', shortName: 'gy', file: 'gym' },
    { name: 'Lekáreň', shortName: 'le', file: 'lekaren' },
    { name: 'Pošta', shortName: 'po', file: 'posta' },
    { name: 'Materská škola', shortName: 'ms', file: 'materska_skola' },
    { name: 'Základná škola', shortName: 'zs', file: 'zakladna_skola' },
    // { name: 'Stredná škola', shortName: 'ss', file: 'stredna_skola' }, // todo
    // { name: 'Vysoká škola', shortName: 'vs', file: 'vysoka_skola' }, // todo
    { name: 'Zastávka', shortName: 'za', file: 'zastavka' },
    { name: 'Supermarket', shortName: 'su', file: 'supermarket' },
    { name: 'Balíkobox', shortName: 'bb', file: 'balikobox' },
    { name: 'Obchod', shortName: 'ob', file: 'obchod' },
    { name: 'Psí výbeh', shortName: 'ps', file: 'psi_vybeh' },
    { name: 'Zubár', shortName: 'zu', file: 'zubar' },
];

export const GET: RequestHandler = async ({ request, url }) => {
    const lat = parseFloat(url.searchParams.get('lat') || '');
    const lon = parseFloat(url.searchParams.get('lon') || '');

    const closestAmenities = {};

    for (const i in amenityTypes) {
        const currentAmenity = JSON.parse(readFileSync(`static/amenities/${amenityTypes[i].file}.json`).toString());

        let closest = {};
        let closest_dist = Infinity;

        for (const j in currentAmenity) {
            const dist = 0.5 * (parseFloat(currentAmenity[j].x) - lon) ** 2 + (parseFloat(currentAmenity[j].y) - lat) ** 2;
            if (dist < closest_dist) {
                closest = currentAmenity[j];
                closest_dist = dist;
            }
        }

        closestAmenities[amenityTypes[i].shortName] = {...closest, dist: closest_dist};
    }
    
    console.log('closestAmenities', closestAmenities);

    const type = (url.searchParams.get('type') || 'foot-walking') as IsochroneType;
    const time = parseInt(url.searchParams.get('time') || '900');

    return json({
        isochrone: await getIsochrone({ lat, lon }, type, time),
        amenities: closestAmenities
    });
};
