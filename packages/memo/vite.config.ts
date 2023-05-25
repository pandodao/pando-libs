import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  define: {
    "process.env": process.env,
  },
  build: {
    sourcemap: true,
    minify: false,
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "PandoMemoProto",
      fileName: "index",
    },
    rollupOptions: {},
  },
  plugins: [],
});
