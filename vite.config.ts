import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
  plugins: [react()],
  resolve: {
    // "@/x" means "src/x", so imports don't depend on how deep a file sits.
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
});
