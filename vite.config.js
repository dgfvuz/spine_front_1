import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
  ],
  server: {
    port: 8888,
    cors: true, // 允许跨域
    hmr: true, // 开启热更新
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },
  pluginOptions: {

    electronBuilder: {
    
    customFileProtocol: "./"
    
    }
    
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  base: './', // 设置打包路径
  build: {
    chunkSizeWarningLimit: 1000 // Set to 600KB
  }
})
