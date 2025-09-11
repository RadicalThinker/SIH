import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,webp}"],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\.*/i,
            handler: "NetworkFirst",
            options: {
              cacheName: "api-cache",
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24, // 24 hours
              },
              cacheKeyWillBeUsed: async ({ request }) => {
                return `${request.url}?v=${Date.now()}`;
              },
            },
          },
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg|webp)$/,
            handler: "CacheFirst",
            options: {
              cacheName: "images-cache",
              expiration: {
                maxEntries: 200,
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
              },
            },
          },
          {
            urlPattern: /\/games\/.*\.js$/,
            handler: "CacheFirst",
            options: {
              cacheName: "games-cache",
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 7, // 7 days
              },
            },
          },
        ],
      },
      manifest: {
        name: "Rural Education Platform",
        short_name: "EduPlatform",
        description: "Gamified learning platform for rural education",
        theme_color: "#3B82F6",
        background_color: "#FFFFFF",
        display: "standalone",
        orientation: "portrait-primary",
        scope: "/",
        start_url: "/",
        icons: [
          {
            src: "/icons/icon-72x72.png",
            sizes: "72x72",
            type: "image/png",
          },
          {
            src: "/icons/icon-96x96.png",
            sizes: "96x96",
            type: "image/png",
          },
          {
            src: "/icons/icon-128x128.png",
            sizes: "128x128",
            type: "image/png",
          },
          {
            src: "/icons/icon-144x144.png",
            sizes: "144x144",
            type: "image/png",
          },
          {
            src: "/icons/icon-152x152.png",
            sizes: "152x152",
            type: "image/png",
          },
          {
            src: "/icons/icon-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/icons/icon-384x384.png",
            sizes: "384x384",
            type: "image/png",
          },
          {
            src: "/icons/icon-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@components": path.resolve(__dirname, "./src/components"),
      "@pages": path.resolve(__dirname, "./src/pages"),
      "@hooks": path.resolve(__dirname, "./src/hooks"),
      "@utils": path.resolve(__dirname, "./src/utils"),
      "@store": path.resolve(__dirname, "./src/store"),
      "@types": path.resolve(__dirname, "./src/types"),
      "@assets": path.resolve(__dirname, "./src/assets"),
      "@games": path.resolve(__dirname, "./src/games"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom", "react-router-dom"],
          redux: ["@reduxjs/toolkit", "react-redux", "redux-persist"],
          charts: ["chart.js", "react-chartjs-2"],
          i18n: ["react-i18next", "i18next"],
          ui: ["@headlessui/react", "@heroicons/react", "framer-motion"],
          utils: ["lodash-es", "date-fns", "uuid"],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
    target: "es2015", // Support older Android devices
  },
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "react-router-dom",
      "@reduxjs/toolkit",
      "react-redux",
      "redux-persist",
      "react-i18next",
      "i18next",
      "framer-motion",
      "chart.js",
      "react-chartjs-2",
      "date-fns",
      "lodash-es",
    ],
  },
  server: {
    port: 5173,
    host: true,
  },
  preview: {
    port: 5173,
    host: true,
  },
});
