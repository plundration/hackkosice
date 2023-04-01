import sveltePreprocess from 'svelte-preprocess';

import adapter from '@sveltejs/adapter-auto';

/** @type {import('@sveltejs/kit').Config} */
export default {
	extensions: ['.svelte', '.svx'],
	preprocess: [
		sveltePreprocess(),
	],
	kit: {
		adapter: adapter(),
		alias: {
			'$/*': './src/'
		}
	}
};
