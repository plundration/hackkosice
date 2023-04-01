import type { PageLoad } from './$types';

import { getIsochrone } from '$lib/isochrone';

export const load: PageLoad = ({ url }) => {
    return { isochrone: getIsochrone({ x: 20.0, y: 30.0 }, 'driving-car', 900) };
};