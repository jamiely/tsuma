import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
  base: "/tsuma",
  build: {
    rollupOptions: {
      external: ['sfxr'],
    }
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
