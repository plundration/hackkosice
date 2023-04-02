import { getIsochrone, type IsochroneType, type Point } from '$lib/isochrone';
import { json, type RequestHandler } from '@sveltejs/kit';
import { readFileSync } from 'fs';

export const GET: RequestHandler = async ({ request, url }) => {
    let name = url.searchParams.get("name");
    let data = JSON.parse(readFileSync(`static/heatmaps/${name}.json`));
    let isochrone = JSON.parse(readFileSync(`static/isochrones_combined/${name}.json`));

    return json({
        heat: data,
        isochrone
    });
};
