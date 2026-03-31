import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      manifest: {
        name: 'DAC - AI Content',
        short_name: 'DAC',
        description: 'Daily AI-generated LinkedIn content inspiration.',
        theme_color: '#212335',
        background_color: '#212335',
        display: 'standalone',
        icons: [
          {
            src: 'https://via.placeholder.com/192x192.png?text=DAC',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'https://via.placeholder.com/512x512.png?text=DAC',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ]
})
