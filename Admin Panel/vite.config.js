import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [react()],
  base: "/v1/dashboard",
  define: {
    "process.env": {
      VITE_LOCAL_STORAGE_SECURE_KEY: process.env.VITE_LOCAL_STORAGE_SECURE_KEY,
      VITE_LOCAL_STORAGE_SECURE_PREFIX:
        process.env.VITE_LOCAL_STORAGE_SECURE_PREFIX,
      VITE_APP_BASE_URL: process.env.VITE_APP_BASE_URL,
    },
  },
});
