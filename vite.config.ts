import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        /* Split the heavy, rarely-changing dependencies out of the app chunk
           so they cache independently and the page is interactive without
           waiting on the 3D stack. */
        manualChunks: {
          react: ["react", "react-dom", "react-router-dom"],
          three: ["three", "postprocessing"],
        },
      },
    },
  },
}));
