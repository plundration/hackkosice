import { getIsochrone } from '$lib/isochrone';
import { json, type RequestHandler } from '@sveltejs/kit';
import {readFileSync} from 'fs';

export const GET: RequestHandler = async ({ request, url }) => {
    const amenities = JSON.parse(readFileSync('static/amenities.json').toString());
    let lat = parseFloat(url.searchParams.get('lat') || '');
    let lon = parseFloat(url.searchParams.get('lon') || '');

    let closest = {};

    for (let i in amenities) {
        if(closest[amenities[i].type]) {
            
        } else {
            closest[amenities[i].type] = amenities[i];
            closest[amenities[i].type].distace_
        }
    }

    return json({
        isochrone: await getIsochrone({ lat: lat, lon: lon }, 'foot-walking', 900),
        amenities: amenities
    });
};
