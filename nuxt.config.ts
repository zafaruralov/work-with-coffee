// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";
export default defineNuxtConfig({
  compatibilityDate: "2025-05-15",
  devtools: { enabled: true },
  components: true,
  modules: ["@pinia/nuxt"],
  css: ["~/assets/css/main.css"],
  app: {
    baseURL: "/work-with-coffee/"
  },
  vite: {
    plugins: [tailwindcss()]
  }
});
