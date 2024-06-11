import { defineNuxtPlugin } from "#app";

import VueClipboard from "vue-clipboard2";

export default defineNuxtPlugin(async (nuxtApp) => {
  nuxtApp.vueApp.use(VueClipboard);
});
