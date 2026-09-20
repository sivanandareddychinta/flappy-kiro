import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  root: '.',
  server: {
    host: '0.0.0.0',
    port: 5173,
    allowedHosts: ['d19ejpg805mpho.cloudfront.net', 'localhost'],
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
      },
      output: {
        entryFileNames: 'game.js',
        chunkFileNames: '[name].js',
        assetFileNames: '[name].[ext]',
      },
    },
    minify: 'terser',
    sourcemap: true,
    target: 'es2020',
  },
  assetsInclude: ['**/*.wav', '**/*.png'],
})
