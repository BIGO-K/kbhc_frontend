import vue from '@vitejs/plugin-vue';
import { defineConfig, loadEnv } from 'vite';
// import tsconfigPaths from 'vite-tsconfig-paths';
import path from 'path';
import legacy from '@vitejs/plugin-legacy';

// https://vitejs.dev/config/
export default ({ mode }) => {
	const env = loadEnv(mode, process.cwd(), 'MM_') as unknown as ImportMetaEnv;

	return defineConfig({
		plugins: [
			vue(),
			// tsconfigPaths()
			legacy({
				// defaults 'edge>=79, firefox>=67, chrome>=64, safari>=12, chromeAndroid>=64, iOS>=12'
				targets: ['defaults', 'not IE 11', 'firefox >= 78', 'chrome >= 80', 'chromeAndroid >= 80', 'edge >= 80', 'safari >= 13', 'iOS >= 13'],
				// additionalLegacyPolyfills: [
				// 	'regenerator-runtime/runtime',
				// 	'whatwg-fetch',
				// 	'intersection-observer',
				// 	'core-js/proposals/global-this',
				// ]
			}),
		],
		resolve: {
			alias: {
				'@': path.resolve(__dirname, './src'),
				'$': path.resolve(__dirname, '..')
			}
		},
		css: {
			devSourcemap: true
		},
		envPrefix: 'MM_',
		base: env.MM_BASE_PATH ?? '/',
		build: {
			target: 'es2020',
			outDir: env.MM_OUT_DIR ?? 'dist',
		},
	});
};