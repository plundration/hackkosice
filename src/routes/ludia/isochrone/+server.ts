import type { PageLoad } from './$types';

import { getIsochrone } from '$lib/isochrone';
import { json } from '@sveltejs/kit';


export const GET: RequestHandler = async ({ request, url }) => {
    return json({ isochrone: getIsochrone({ x: url.searchParams.get('lon'), y: url.searchParams.get('lat') }, 'driving-car', 900) });
};
