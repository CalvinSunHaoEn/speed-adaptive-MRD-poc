import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// `base` must match the repo name so GitHub Pages resolves hashed assets.
export default defineConfig({
  base: '/speed-adaptive-MRD-poc/',
  plugins: [react()],
  // The pace readouts contain typographic primes (8'10"/km). Escaping all
  // non-ASCII to \uXXXX keeps the bundle readable no matter what charset the
  // host serves it under — without this it renders as mojibake wherever the
  // response omits a UTF-8 charset.
  esbuild: { charset: 'ascii' },
})
