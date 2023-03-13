import webExtension from '@samrum/vite-plugin-web-extension';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import path from 'path';
import { defineConfig, loadEnv, UserConfigExport } from 'vite';
import { imagetools } from 'vite-imagetools';
import svelteSVG from 'vite-plugin-svelte-svg';
import { pluginDevImport } from './build/vite-plugin-dev-import';
import { getManifest } from './src/manifest';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const development = env.NODE_ENV === 'development';
  const manifestVersion = env.MANIFEST_VERSION || '2';
  const outDir = `dist/mv${manifestVersion}`;
  const manifest = getManifest(parseInt(manifestVersion));
  manifest.name = `${manifest.name} - (dev)`;

  const sharedConfig = {
    resolve: {
      alias: {
        $components: path.resolve(__dirname, './src/components'),
        $lib: path.resolve(__dirname, './src/lib'),
        $assets: path.resolve(__dirname, './src/assets'),
        $prompts: path.resolve(__dirname, './src/prompts'),
        $config: path.resolve(__dirname, './src/config.ts'),
      },
    },
    build: {},
    plugins: [
      svelte(),
      svelteSVG({
        svgoConfig: {
          plugins: [
            {
              name: 'preset-default',
              params: {
                overrides: {
                  removeViewBox: false,
                },
              },
            },
          ],
        },
        requireSuffix: true,
      }),
      imagetools(),
    ],
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
    plugins: [...sharedConfig.plugins, webExtension({ manifest })],
  } satisfies UserConfigExport;
});
