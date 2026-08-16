import { defineConfig } from "vitest/config";
import path from "path";

const templateRoot = path.resolve(import.meta.dirname);

export default defineConfig({
  root: templateRoot,
  resolve: {
    alias: {
      "@": path.resolve(templateRoot, "frontend", "src"),
      "@shared": path.resolve(templateRoot, "backend", "shared"),
      "@assets": path.resolve(templateRoot, "attached_assets"),
    },
  },
  test: {
    environment: "node",
    env: {
      DATABASE_URL: "",
    },
    include: [
      "backend/**/*.test.ts",
      "backend/**/*.spec.ts",
      "frontend/**/*.test.ts",
      "frontend/**/*.spec.ts",
    ],
  },
});
