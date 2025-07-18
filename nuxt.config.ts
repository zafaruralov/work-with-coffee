// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";
import { readFileSync } from "fs";
const { version } = JSON.parse(readFileSync("./package.json", "utf8"));

export default defineNuxtConfig({
  app: {
    baseURL: "/work-with-coffee/"
  },
  image: {
    staticFilename: "[name][ext]",
    provider: "static",
    screens: {}
  },
  runtimeConfig: {
    public: {
      appVersion: version
    }
  },
  compatibilityDate: "2025-05-15",
  devtools: { enabled: true },
  components: true,
  modules: ["@pinia/nuxt", "@nuxt/image"],
  css: ["~/assets/css/main.css"],
  // image: {
  //   dir: "public",
  //   screens: {
  //     sm: 320,
  //     md: 640,
  //     lg: 1024
  //   }
  // },
  vite: {
    plugins: [tailwindcss()]
  }
});
