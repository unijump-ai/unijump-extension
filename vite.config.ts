import { defineConfig, loadEnv, UserConfigExport, Plugin } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import webExtension from '@samrum/vite-plugin-web-extension';
import svelteSVG from 'vite-plugin-svelte-svg';
import { imagetools } from 'vite-imagetools';
import path from 'path';
import { readFileSync } from 'fs';
import { getManifest } from './src/manifest';

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
  } satisfies UserConfigExport;

  if (development) {
    return {
      ...sharedConfig,
      plugins: [...sharedConfig.plugins, pluginDevImport()],
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
    server: {
      hmr: false,
    },
    plugins: [
      ...sharedConfig.plugins,
      webExtension({ manifest: getManifest(Number(manifestVersion)) }),
    ],
  } satisfies UserConfigExport;
});

function pluginDevImport(): Plugin {
  return {
    name: 'vite-plugin-dev-import',
    load(id, source) {
      if (id.includes('lib/messaging/index.ts')) {
        const devMessaging = readFileSync(
          path.resolve(__dirname, './src/lib/messaging-dev/index.ts'),
          'utf-8'
        );

        return devMessaging;
      }
    },
  };
}
