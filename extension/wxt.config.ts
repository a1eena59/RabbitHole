// extension/wxt.config.ts
import { defineConfig } from 'wxt';

export default defineConfig({
  modules: ['@wxt-dev/module-react'],
  manifest: {
    name: "RabbitHole Core",
    description: "Map your digital curiosity and track your browsing journeys.",
    version: "1.0.0",
    permissions: [
      'tabs',
      'storage',
      'webNavigation'
    ],
    host_permissions: [
      'http://localhost:8000/*',
      'http://localhost:5173/*',
      'https://your-production-backend.onrender.com/*',
      'https://your-production-frontend.vercel.app/*'
    ],
    // Automatically hooks WXT to look inside extension/public/icon/
    icons: {
      "16": "icon/16.png",
      "32": "icon/32.png",
      "48": "icon/48.png",
      "96": "icon/96.png",
      "128": "icon/128.png"
    }
  }
});