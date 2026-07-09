import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'
import path from "path"

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'taskflow_icon.png'],
      manifest: {
        name: 'TaskFlow',
        short_name: 'TaskFlow',
        description: 'Modern SaaS task management platform',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
        icons: [
          {
            src: 'taskflow_icon.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'taskflow_icon.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'taskflow_icon.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
