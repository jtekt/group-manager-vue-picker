import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import dts from "vite-plugin-dts";
import { libInjectCss } from "vite-plugin-lib-inject-css";
import { resolve } from "path";

export default defineConfig({
  plugins: [
    vue(),
    dts({
      insertTypesEntry: true,
      include: ["src/**/*.ts", "src/**/*.vue"],
    }),
    libInjectCss(),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "VueGroupPicker",
      fileName: "index",
      formats: ["es", "cjs"],
    },
    rollupOptions: {
      external: ["vue"],
      output: {
        globals: {
          vue: "Vue",
        },
      },
    },
    cssCodeSplit: true,
  },
});
