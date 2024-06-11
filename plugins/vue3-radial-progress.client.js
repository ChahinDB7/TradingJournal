import { defineNuxtPlugin } from "#app";
import RadialProgress from "vue3-radial-progress";

export default defineNuxtPlugin(async (nuxtApp) => {
  nuxtApp.vueApp.component("RadialProgress", RadialProgress);
});
