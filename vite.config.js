import path from 'path';
import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte()],
  resolve: {
    alias: {
      $assets: path.resolve('./src/assets'),
      $components: path.resolve('./src/components'),
      $lib: path.resolve('./src/lib'),
    },
  },
});
