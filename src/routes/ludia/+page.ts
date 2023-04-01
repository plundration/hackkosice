import type { PageLoad } from './$types';

export const load: PageLoad = ({ url }) => {
    return { lat: parseFloat(url.searchParams.get('lat') || ''), lon: parseFloat(url.searchParams.get('lon') || '') };
};