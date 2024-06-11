import { defineNuxtPlugin } from "#app";

import "floating-vue/dist/style.css";
import FloatingVue from "floating-vue";

export default defineNuxtPlugin(async (nuxtApp) => {
  nuxtApp.vueApp.use(FloatingVue);
});
