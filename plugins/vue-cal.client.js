import { defineNuxtPlugin } from "#app";

import "vue-cal/dist/vuecal.css";
import VueCal from "vue-cal";

export default defineNuxtPlugin(async (nuxtApp) => {
  nuxtApp.vueApp.component("VueCal", VueCal);
});
