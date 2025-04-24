import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: 'localhost', // bu yerga kompyuteringiz IP manzilini yozing
    port: 5173, // ixtiyoriy port, standart: 5173
  }
})
