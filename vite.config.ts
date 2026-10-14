import tailwindcss from '@tailwindcss/vite';
import adapter from '@sveltejs/adapter-static';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

// BASE_PATH is set in CI to /<repo-name> for GitHub Pages; empty locally.
const base = process.env.BASE_PATH ?? '';

export default defineConfig({
	plugins: [
		tailwindcss(),
		sveltekit({
			paths: { base },
			compilerOptions: {
				// Force runes mode for the project, except for libraries. Can be removed in svelte 6.
				runes: ({ filename }) =>
					filename.split(/[/\\]/).includes('node_modules') ? undefined : true
			},
			adapter: adapter(),
			// rooms are plain static folders, not routes
			prerender: {
				handleHttpError: ({ path, message }) => {
					if (!path.includes('/rooms/')) throw new Error(message);
				}
			}
		})
	]
});
