import "@rodrigogs/vuejs-noty/dist/vuejs-noty.css";
import { defineNuxtPlugin } from "#app";

import VueNoty from "@rodrigogs/vuejs-noty";

export default defineNuxtPlugin(async (nuxtApp) => {
  nuxtApp.vueApp.use(VueNoty, {
    timeout: 4000,
    killer: true,
    progressBar: true,
    layout: "bottomRight",
    visibilityControl: true,
    theme: "bootstrap-v3",
  });
});
