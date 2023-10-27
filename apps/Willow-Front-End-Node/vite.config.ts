import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@monorepo/utils": path.resolve(__dirname, "../../shared/utils"),
    },
  },
});
