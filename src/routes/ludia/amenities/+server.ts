import { type RequestHandler, json } from '@sveltejs/kit';
import fs from 'fs';

export const POST: RequestHandler = async ({ request }) => {
    // const data = await request.json()
    const file = JSON.parse(fs.readFileSync('static/amenities.json').toString());

    console.log(file);
    return json(file);
};
