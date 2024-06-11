import Vue3Toasity from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import { defineNuxtPlugin } from "#app";

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(Vue3Toasity);
});
