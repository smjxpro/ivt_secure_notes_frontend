import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  let proxyConfig = undefined
  if (command === 'serve') {
    const proxyTarget = env.VITE_BACKEND_PROXY_TARGET
    if (!proxyTarget) {
      throw new Error('VITE_BACKEND_PROXY_TARGET environment variable is required for local dev server proxy')
    }

    proxyConfig = {
      '/api': {
        target: proxyTarget,
        changeOrigin: true,
      },
    }
  }

  return {
    plugins: [react()],
    server: {
      port: 5173,
      ...(proxyConfig ? { proxy: proxyConfig } : {}),
    },
  }
})
