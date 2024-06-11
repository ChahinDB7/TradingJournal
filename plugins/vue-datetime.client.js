import { defineNuxtPlugin } from "#app";

import "@vuepic/vue-datepicker/dist/main.css";
import VueDatePicker from "@vuepic/vue-datepicker";

export default defineNuxtPlugin(async (nuxtApp) => {
  nuxtApp.vueApp.component("VueDatePicker", VueDatePicker);
});
