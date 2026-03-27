// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  colorMode: {
    preference: 'light'
  },
  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL || (process.env.NODE_ENV === 'development' ? 'http://localhost:4000/v1' : '')
    }
  },
  modules: ['@nuxt/ui', '@nuxtjs/tailwindcss', '@nuxt/image', '@pinia/nuxt', '@nuxtjs/google-fonts'],
  googleFonts: {
    families: {
      'Poppins': [400, 500, 600, 700],
      'Staatliches': [400],
      'Raleway': [300, 400, 500, 600, 700]
    },
    display: 'swap'
  },
  tailwindcss: {
    exposeConfig: true,
    configPath: './tailwind.config.js'
  },
})
