import PocketBase from 'pocketbase';

import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	event.locals.pb = new PocketBase('https://localhost:8090');
	event.locals.pb.authStore.loadFromCookie(event.request.headers.get('cookie') || '');

	if (event.locals.pb.authStore.isValid) {
		event.locals.user = event.locals.pb.authStore.model;
	}
    
	const response = await resolve(event);

	// TODO: secure before deployment
	response.headers.set('set-cookie', event.locals.pb.authStore.exportToCookie({ secure: true, sameSite: true }));

	return response;
};