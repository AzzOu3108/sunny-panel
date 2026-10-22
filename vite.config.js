// Plain JavaScript Vite config for TanStack Start (run with Node: npm run dev).
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  vite: {
    server: { port: 5173 },
    preview: { port: 5173 },
  },
  tanstackStart: {
    // Use src/server.js as the server entry (SSR error wrapper).
    server: { entry: "server" },
  },
});
