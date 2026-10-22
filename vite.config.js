import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // relative base: works on GitHub Pages (/friendship-passport/) and on Vercel (/)
  base: './',
  plugins: [react()],
})
