import { resolve, dirname } from 'node:path';
import url from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';

const __dirname = dirname(url.fileURLToPath(import.meta.url));

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.js'),
      name: 'react-dn-select',
      fileName: (format) => `index.${format}.js`,
    },
    rollupOptions: {
      // deps that shouldn't be bundled into the library
      external: ['react', 'react-dom'],
      output: {
        // global variables to use in the UMD build
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
      },
    },
    sourcemap: true,
    emptyOutDir: true,
  },
  plugins: [react(), dts()],
});
