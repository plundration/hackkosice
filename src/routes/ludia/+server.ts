import { getIsochrone } from '$lib/isochrone';
import { json, type RequestHandler } from '@sveltejs/kit';
import {readFileSync} from 'fs';

export const GET: RequestHandler = async ({ request, url }) => {
    const file = JSON.parse(readFileSync('static/amenities.json').toString());

    return json({
        isochrone: await getIsochrone({ lat: parseFloat(url.searchParams.get('lat') || ''), lon: parseFloat(url.searchParams.get('lon') || '') }, 'foot-walking', 900),
        amenities: file
    });
};
