import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@horizoncover/types': path.resolve(__dirname, '../packages/types/src/index.ts'),
      '@horizoncover/sdk': path.resolve(__dirname, '../packages/sdk/src/index.ts'),
    },
  },
})
