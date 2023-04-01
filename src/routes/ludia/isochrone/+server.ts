import { getIsochrone } from '$lib/isochrone';
import { json, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ request, url }) => {
    return json(await getIsochrone({ lat: parseFloat(url.searchParams.get('lat') || ''), lon: parseFloat(url.searchParams.get('lon') || '') }, 'foot-walking', 900));
};
