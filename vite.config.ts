import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base relativa + rutas con hash: funciona en GitHub Pages, Vercel o cualquier subcarpeta.
export default defineConfig({ base: './', plugins: [react()] })
