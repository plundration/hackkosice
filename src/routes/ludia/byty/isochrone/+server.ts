import { type RequestHandler, json } from '@sveltejs/kit';
import { readFileSync, existsSync } from 'fs';

export const POST: RequestHandler = async ({ request }) => {
    const reqData = await request.json();

    if (!existsSync(`static/isochrone_public_transport/${reqData.id}.json`)) {
        throw Error();
    }

    const file = readFileSync(`static/isochrone_public_transport/${reqData.id}.json`).toString();

    return json({
        isochrone: JSON.parse(file)
    });
};
