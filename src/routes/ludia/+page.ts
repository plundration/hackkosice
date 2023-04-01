import type { PageLoad } from './$types';

export const load: PageLoad = ({ url }) => {
    return { lat: url.searchParams.get('lat') || '',  lon: url.searchParams.get('lon') || ''};
};