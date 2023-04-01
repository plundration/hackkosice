import { getIsochrone, type IsochroneType, type Point } from '$lib/isochrone';
import { json, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ request, url }) => {
    const lat = parseFloat(url.searchParams.get('lat') || '');
    const lon = parseFloat(url.searchParams.get('lon') || '');
    const type = (url.searchParams.get('type') || 'foot-walking') as IsochroneType;
    const time = parseInt(url.searchParams.get('time') || '900');
    return json(await getIsochrone({ lat, lon }, type, time));
};
