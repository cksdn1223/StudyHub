import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    global: 'globalThis'
  },
  server: {
    proxy: {
      '/ws-stomp': {
        target: 'http://localhost:8080', // 👈 백엔드 서버 주소
        changeOrigin: true,
        ws: true, // 👈 WebSocket 프록시 활성화 옵션
      },
    }
  }
})
