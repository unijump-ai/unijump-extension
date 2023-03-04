import path from 'path';
import { defineConfig, loadEnv, UserConfigExport } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import webExtension from '@samrum/vite-plugin-web-extension';
import svelteSVG from 'vite-plugin-svelte-svg';
import { imagetools } from 'vite-imagetools';
import { getManifest } from './src/manifest';
import { pluginDevImport } from './build/vite-plugin-dev-import';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const development = env.NODE_ENV === 'development';
  const manifestVersion = env.MANIFEST_VERSION || '2';
  const outDir = `dist/mv${manifestVersion}`;

  const sharedConfig = {
    resolve: {
      alias: {
        $components: path.resolve(__dirname, './src/components'),
        $lib: path.resolve(__dirname, './src/lib'),
        $assets: path.resolve(__dirname, './src/assets'),
        $prompts: path.resolve(__dirname, './src/prompts'),
      },
    },
    build: {},
    plugins: [svelte(), svelteSVG(), imagetools()],
    envPrefix: 'CLIENT_',
  } satisfies UserConfigExport;

  if (development) {
    return {
      ...sharedConfig,
      plugins: [
        ...sharedConfig.plugins,
        pluginDevImport({
          match: /lib\/extension\/(.+)\/index.ts/,
          replace: ['index.ts', 'index.dev.ts'],
          required: true,
        }),
      ],
      build: {
        ...sharedConfig.build,
        minify: false,
      },
      server: {
        hmr: true,
      },
    } satisfies UserConfigExport;
  }

  return {
    ...sharedConfig,
    build: {
      ...sharedConfig.build,
      outDir,
      rollupOptions: {
        output: {
          entryFileNames: `assets/[name].js`,
          chunkFileNames: `assets/[name].js`,
          assetFileNames: `assets/[name].[ext]`,
        },
      },
      minify: false,
    },
    define: {
      __MANIFEST_VERSION__: manifestVersion,
    },
    server: {
      hmr: false,
    },
    plugins: [
      ...sharedConfig.plugins,
      webExtension({ manifest: getManifest(Number(manifestVersion)) }),
    ],
  } satisfies UserConfigExport;
});
