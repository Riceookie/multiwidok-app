import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base ustawiony pod GitHub Pages (project site): https://<user>.github.io/multiwidok-app/
export default defineConfig({
  plugins: [react()],
  base: '/multiwidok-app/',
})
