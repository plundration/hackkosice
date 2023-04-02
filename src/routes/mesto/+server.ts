import { getIsochrone, type IsochroneType, type Point } from '$lib/isochrone';
import { json, type RequestHandler } from '@sveltejs/kit';
import { readFileSync } from 'fs';

export const GET: RequestHandler = async ({ request, url }) => {
    let data = JSON.parse(readFileSync("static/city.json"));

    return json(data);
};
