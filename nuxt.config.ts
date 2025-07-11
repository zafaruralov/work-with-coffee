// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";
export default defineNuxtConfig({
  app: {
    baseURL: "/"
  },
  compatibilityDate: "2025-05-15",
  devtools: { enabled: true },
  components: true,
  modules: ["@pinia/nuxt", "@nuxt/image"],
  css: ["~/assets/css/main.css"],
  image: {
    dir: "public",
    screens: {
      sm: 320,
      md: 640,
      lg: 1024
    }
  },
  vite: {
    plugins: [tailwindcss()]
  }
});
