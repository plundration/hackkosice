import { getIsochrone, type IsochroneType, type Point } from '$lib/isochrone';
import { json, type RequestHandler } from '@sveltejs/kit';
import {readFileSync} from 'fs';

export const GET: RequestHandler = async ({ request, url }) => {
    const amenities = JSON.parse(readFileSync('static/amenities.json').toString());

    let closest = {};

    for (let i in amenities) {
        if(closest[amenities[i].type]) {
            
        } else {
            closest[amenities[i].type] = amenities[i];
            closest[amenities[i].type].distace_
        }
    }

    const lat = parseFloat(url.searchParams.get('lat') || '');
    const lon = parseFloat(url.searchParams.get('lon') || '');
    const type = (url.searchParams.get('type') || 'foot-walking') as IsochroneType;
    const time = parseInt(url.searchParams.get('time') || '900');

    return json({
        isochrone: await getIsochrone({ lat, lon }, type, time),
        amenities: amenities
    });
};
