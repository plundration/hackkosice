import type { PageLoad } from './$types';

import { getIsochrone } from '$lib/isochrone';

export const load: PageLoad = ({ url }) => {
    return { isochrone: getIsochrone({ x: 48.725149, y: 21.260283 }, 'driving-car', 900) };
};