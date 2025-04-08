import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

let proxyConfig = {
  target: 'http://localhost:8000',
  changeOrigin: false,
  configure: (proxy: any, _options: any) => {
    proxy.on('error', (err: string, _req: any, _res: any) => {
      console.log('proxy error', err)
    })
    proxy.on('proxyReq', (proxyReq: any, req: any, _res: any) => {
      console.log('Sending Request to the Target:', req.method, req.url)
    })
    proxy.on('proxyRes', (proxyRes: any, req: any, _res: any) => {
      console.log('Received Response from the Target:', proxyRes.statusCode, req.url)
    })
  },
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), vueDevTools()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    proxy: {
      '/polls': proxyConfig,
      '/static': proxyConfig,
    },
  },
})
