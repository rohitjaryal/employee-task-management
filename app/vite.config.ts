import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc';
import { fileURLToPath, URL } from "node:url";

// import { visualizer } from "rollup-plugin-visualizer";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(),
    // visualizer({
    //   open: true,
    // }),
  ],
  resolve: {
    alias: [
      {
        find: "@",
        replacement: fileURLToPath(new URL("./src", import.meta.url)),
      },
      {
        find: "@cmp",
        replacement: fileURLToPath(
            new URL("./src/components", import.meta.url),
        ),
      },
    ],
  },
})
