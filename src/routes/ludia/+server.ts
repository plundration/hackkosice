import { getIsochrone } from '$lib/isochrone';
import { json, type RequestHandler } from '@sveltejs/kit';
import {readFileSync} from 'fs';

export const GET: RequestHandler = async ({ request, url }) => {
    const amenities = JSON.parse(readFileSync('static/amenities.json').toString());
    let lat = parseFloat(url.searchParams.get('lat') || '');
    let lon = parseFloat(url.searchParams.get('lon') || '');

    let closest = {};

    for (let i in amenities) {
        let t = amenities[i].type;
        if(closest[t]) {
        } else {
            closest[t] = amenities[i];
            closest[t].dist = 0.5 * (closest[t].x - lon)**2 + (closest[t].y - lat)**2;
        }
        l
    }

    return json({
        isochrone: await getIsochrone({ lat, lon }, 'foot-walking', 900),
        amenities: amenities
    });
};
