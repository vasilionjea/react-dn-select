import { resolve, dirname } from 'node:path';
import url from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';

const __dirname = dirname(url.fileURLToPath(import.meta.url));

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  return {
    root: command === 'serve' ? './example' : './',
    build: {
      lib: {
        entry: resolve(__dirname, 'src/index.ts'),
        name: 'react-dn-select',
        fileName: (format: string) => `index.${format}.js`,
      },
      rollupOptions: {
        // deps that shouldn't be bundled into the library
        external: ['react', 'react-dom', 'react/jsx-runtime'],
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
  };
});
