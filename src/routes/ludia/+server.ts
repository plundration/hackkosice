import { getIsochrone, type IsochroneType, type Point } from '$lib/isochrone';
import { json, type RequestHandler } from '@sveltejs/kit';
import { readFileSync } from 'fs';

type AmenityType = { name: string, file: string };
const amenityTypes: AmenityType[] = [
    { name: 'Supermarket', file: 'supermarket' },
    { name: 'Reštaurácia', file: 'restauracia' },
    { name: 'Zastávka', file: 'zastavka' },
    { name: 'Kaviareň', file: 'kaviaren' },
    { name: 'Krčma', file: 'krcma' },
    { name: 'Ambulancia', file: 'ambulancia' },
    { name: 'Bar', file: 'bar' },
    { name: 'Detská ambulancia', file: 'detska_ambulancia' },
    { name: 'Ihrisko', file: 'ihrisko' },
    { name: 'Drogéria', file: 'drogeria' },
    { name: 'Fastfood', file: 'fastfood' },
    { name: 'Gym', file: 'gym' },
    { name: 'Lekáreň', file: 'lekaren' },
    { name: 'Zubár', file: 'zubar' },
    { name: 'Pošta', file: 'posta' },
    { name: 'Materská škola', file: 'materska_skola' },
    { name: 'Základná škola', file: 'zakladna_skola' },
    { name: 'Obchod', file: 'obchod' },
    { name: 'Psí výbeh', file: 'psi_vybeh' },
    { name: 'Balíkobox', file: 'balikobox' },
];

export const GET: RequestHandler = async ({ request, url }) => {
    const lat = parseFloat(url.searchParams.get('lat') || '');
    const lon = parseFloat(url.searchParams.get('lon') || '');

    const closestAmenities: { name: string, x: number, y: number, dist: number, generalName: string, fileName: string }[] = [];

    for (const key in amenityTypes) {
        const currentAmenity = JSON.parse(readFileSync(`static/amenities/${amenityTypes[key].file}.json`).toString());

        let closest = {};
        let closestDistance = Infinity;

        for (const j in currentAmenity) {
            const distance = 0.5 * (parseFloat(currentAmenity[j].x) - lon) ** 2 + (parseFloat(currentAmenity[j].y) - lat) ** 2;
            if (distance < closestDistance) {
                closest = currentAmenity[j];
                closestDistance = distance;
            }
        }

        closestAmenities.push({ name: closest.name, x: closest.x, y: closest.y, dist: closestDistance, generalName: amenityTypes[key].name, fileName: amenityTypes[key].file });
    }
    
    console.log(closestAmenities);

    const type = (url.searchParams.get('type') || 'foot-walking') as IsochroneType;
    const time = parseInt(url.searchParams.get('time') || '900');

    return json({
        isochrone: await getIsochrone({ lat, lon }, type, time),
        amenities: closestAmenities
    });
};
