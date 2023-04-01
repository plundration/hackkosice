import { type RequestHandler, json } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request }) => {
    // const data = await request.json();
    return json([
        { lat: 48.7, lon: 21.25, name: 'Adamov Dom', type: 'skola' },
        { lat: 48.7, lon: 21.26, name: 'Paľov Dom', type: 'spital' }
    ]);
};
