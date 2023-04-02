import { getIsochrone, type IsochroneType, type Point } from '$lib/isochrone';
import { json, type RequestHandler } from '@sveltejs/kit';
import { readFileSync } from 'fs';

export const GET: RequestHandler = async ({ request, url }) => {
    let data = JSON.parse(readFileSync("static/kosice2_0.json"));

    return json(data);
};
