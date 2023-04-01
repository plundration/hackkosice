import { type RequestHandler, json } from '@sveltejs/kit';
import { readFileSync } from 'fs';

export const GET: RequestHandler = async ({ request }) => {
    const file = readFileSync('static/data/lacne_byty.json').toString();
    return json({
        byty: JSON.parse(file)
    });
};
