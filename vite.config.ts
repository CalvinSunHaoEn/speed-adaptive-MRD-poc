import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Served from https://<user>.github.io/speed-adaptive-MRD-poc/ on GitHub Pages.
// BASE_PATH lets the local dev/preview server run at "/" instead.
export default defineConfig({
  base: process.env.BASE_PATH ?? '/speed-adaptive-MRD-poc/',
  plugins: [react()],
  server: { port: 5173 },
  preview: { port: 4173 },
});
