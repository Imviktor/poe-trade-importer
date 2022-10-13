import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  base: process.env.ELECTRON=="true" ? './' : ".",
  plugins: [vue()],
  server: {
    proxy: {
      '/api': {
        target: 'https://www.pathofexile.com/',
        changeOrigin: true,
        secure: true
      },
    }
  },
})
