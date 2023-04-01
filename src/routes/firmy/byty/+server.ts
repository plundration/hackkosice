import { type RequestHandler, json } from '@sveltejs/kit';
import fs from 'fs';

export const GET: RequestHandler = async ({ request }) => {
    const file = fs.readFileSync('static/data/lacne_byty.json').toString();
    return json({
        byty: JSON.parse(file)
    });
};
