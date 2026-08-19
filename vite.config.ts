import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// `base` must match the repo name so GitHub Pages resolves hashed assets.
export default defineConfig({
  base: '/speed-adaptive-MRD-poc/',
  plugins: [react()],
})
