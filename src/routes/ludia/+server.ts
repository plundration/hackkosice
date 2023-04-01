import { getIsochrone, type IsochroneType, type Point } from '$lib/isochrone';
import { json, type RequestHandler } from '@sveltejs/kit';
import {readFileSync} from 'fs';

export const GET: RequestHandler = async ({ request, url }) => {
    const amenities = JSON.parse(readFileSync('static/amenities.json').toString());

    const lat = parseFloat(url.searchParams.get('lat') || '');
    const lon = parseFloat(url.searchParams.get('lon') || '');

    let closest = {};

    for (let i in amenities) {
        let t = amenities[i].typ_0;
        amenities[i].dist = 0.5 * (amenities[i].x - lon)**2 + (amenities[i].y - lat)**2;
        if(!closest[t]) {
            closest[t] = amenities[i];
            continue;
        }
        if (amenities[i].dist < closest[t].dist) {
            closest[t] = amenities[i];
        }
    }

    let final_list = [];
    for (let i in closest) {
        final_list.push(closest[i]);
    }

    const type = (url.searchParams.get('type') || 'foot-walking') as IsochroneType;
    const time = parseInt(url.searchParams.get('time') || '900');

    return json({
        isochrone: await getIsochrone({ lat, lon }, type, time),
        amenities: final_list
    });
};
