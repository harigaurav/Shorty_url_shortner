import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/', // ✅ Important for Vercel/static hosting

  plugins: [
    react(), // ✅ React plugin
  ],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // ✅ @ => /src
    },
  },
});
