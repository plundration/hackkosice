import { getIsochrone, type IsochroneType, type Point } from '$lib/isochrone';
import { json, type RequestHandler } from '@sveltejs/kit';
import { readFileSync } from 'fs';

type AmenityType = { name: string, file: string };
const amenityTypes: {[id: string]: AmenityType} = {
    re: { name: 'Reštaurácia', file: 'restauracia' },
    ka: { name: 'Kaviarňa', file: 'kaviaren' },
    kr: { name: 'Krčma', file: 'krcma' },
    am: { name: 'Ambulancia', file: 'ambulancia' },
    ba: { name: 'Bar', file: 'bar' },
    da: { name: 'Detská ambulancia', file: 'detska_ambulancia' },
    ih: { name: 'Ihrisko', file: 'ihrisko' },
    dr: { name: 'Drogéria', file: 'drogeria' },
    ff: { name: 'Fastfood', file: 'fastfood' },
    gy: { name: 'Gym', file: 'gym' },
    le: { name: 'Lekáreň', file: 'lekaren' },
    po: { name: 'Pošta', file: 'posta' },
    ms: { name: 'Materská škola', file: 'materska_skola' },
    zs: { name: 'Základná škola', file: 'zakladna_skola' },
    za: { name: 'Zastávka', file: 'zastavka' },
    su: { name: 'Supermarket', file: 'supermarket' },
    bb: { name: 'Balíkobox', file: 'balikobox' },
    ob: { name: 'Obchod', file: 'obchod' },
    ps: { name: 'Psí výbeh', file: 'psi_vybeh' },
    zu: { name: 'Zubár', file: 'zubar' },
};

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
