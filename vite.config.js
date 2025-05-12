import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import federation from '@originjs/vite-plugin-federation'

// https://vite.dev/config/
export default defineConfig({
  base: '/task-app/',
  plugins: [react(),
    federation({
      name:'taskApp',
      filename:'remoteEntry.js',
      exposes:{
        './TaskDashboard': './src/TaskDashboard.jsx'
      },
      shared:['react', 'react-dom']
    })
  ],
  build: {
    target: 'esnext',
    minify: false,
    cssCodeSplit: false,
  }
})
