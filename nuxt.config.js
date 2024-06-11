import svgLoader from "vite-svg-loader";
import dynamicImport from "vite-plugin-dynamic-import";
import path from "path";

export default {
  devtools: {
    enabled: import.meta.env.DEV,
  },

  telemetry: false,

  app: {
    head: {
      title: "Trading Journal",
      meta: [],
      script: [{ src: "https://unpkg.com/marked@0.3.6" }],
      link: [
        {
          rel: "icon",
          type: "image/x-icon",
          href: `/favicon.ico`,
        },
      ],
    },
  },

  css: ["~/assets/scss/main.scss"],

  imports: {
    dirs: ["stores"],
  },
  router: {
    mode: "history",
  },
  ssr: true,
  target: "server",

  server: {
    port: 3000,
  },

  buildModules: ["@nuxtjs/moment"],

  build: {
    transpile: ["@vuepic/vue-datepicker"],
  },

  vite: {
    resolve: {
      alias: {
        "@": path.join(__dirname, ""),
        "@assets": path.join(__dirname, "assets"),
        "@img": path.join(__dirname, "assets/images"),
        "@icons": path.join(__dirname, "assets/icons"),
        "@lib": path.join(__dirname, "lib"),
      },
    },
    plugins: [svgLoader(), dynamicImport()],
  },

  modules: [
    "vue3-swatches/nuxt",
    "@nuxt/content",
    "@vueuse/nuxt",
    "@nuxtjs/color-mode",
    "nuxt-lodash",
    [
      "@pinia/nuxt",
      {
        autoImports: ["defineStore", "acceptHMRUpdate"],
      },
    ],
  ],

  plugins: [
    {
      src: "~/plugins/vue-final-modal.js",
      ssr: false,
    },
  ],

  lodash: {
    prefix: "_",
    prefixSkip: ["string"],
    upperAfterPrefix: false,
  },

  experimental: {
    defineModel: true,
    inlineSSRStyles: true,
  },

  components: [
    {
      path: "~/components/",
      pathPrefix: false,
    },
  ],
};
