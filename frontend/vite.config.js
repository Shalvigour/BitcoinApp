import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    // stompjs expects a global object, so we alias it to window for browser runtimes
    global: 'window',
  }
})
