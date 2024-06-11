import { defineNuxtPlugin } from "#app";
import BootstrapVue from "bootstrap-vue-next";

export default defineNuxtPlugin(async (nuxtApp) => {
  nuxtApp.vueApp.use(BootstrapVue);
});
