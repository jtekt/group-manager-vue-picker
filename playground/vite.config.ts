import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";

export default defineConfig(({ command }) => {
  const isDev = command === "serve";

  return {
    plugins: [vue()],
    resolve: {
      alias: {
        ...(isDev
          ? {
              group_manager_vue_picker: path.resolve(__dirname, "../src"),
            }
          : {}),
      },
    },
  };
});
