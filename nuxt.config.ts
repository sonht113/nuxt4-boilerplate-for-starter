export default defineNuxtConfig({
  compatibilityDate: "2025-12-15",
  devtools: { enabled: true },
  runtimeConfig: {
    jwtSecret: process.env.JWT_SECRET || "default-secret-change-in-production",
    public: {},
  },
  nitro: {
    experimental: {
      openAPI: true,
    },
    preset: "vercel",
  },
  modules: [
    [
      "@nuxtjs/i18n",
      {
        locales: [
          { code: "vi", file: "vi.ts", iso: "vi-VN", language: "vi" },
          { code: "en", file: "en.ts", iso: "en-US", language: "en" },
        ],
        seo: true,
        lazy: true,
        langDir: "locales/",
        defaultLocale: "en",
        strategy: "no_prefix",
        baseUrl: process.env.BASE_URL,
      },
    ],
    [
      "@pinia/nuxt",
      {
        storesDirs: ["./stores/**"],
      },
    ],
    "@nuxt/image",
    "nuxt-og-image",
    "@nuxt/eslint",
    "@nuxtjs/tailwindcss",
  ],
});
