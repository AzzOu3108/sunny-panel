// Plain JavaScript Vite config for TanStack Start (run with Node: npm run dev).
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    // Use src/server.js as the server entry (SSR error wrapper).
    server: { entry: "server" },
    router: {
      generatedRouteTree: "routeTree.gen.js",
      disableTypes: true,
    },
  },
});
