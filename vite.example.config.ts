import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  root: './example',
  base: '/react-dn-select/',
  build: {
    outDir: '../example-dist',
    rollupOptions: {
      input: './example/index.html',
    },
  },
  plugins: [react()],
});
