import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
//   server: {
//     fs: {
//       // Allow importing assets from repo root (e.g. ../image/*)
//       allow: ['..'],
//     },
//   },
// })
export default defineConfig({
  plugins: [react()],
  base: "/",
})