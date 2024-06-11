import { defineNuxtPlugin } from "#app";

import veProgress from "vue-ellipse-progress";

export default defineNuxtPlugin(async (nuxtApp) => {
  nuxtApp.vueApp.use(veProgress);
});
