import { defineNuxtPlugin } from "#app";

import VueCtkDateTimePicker from "vue-ctk-date-time-picker3";
import "vue-ctk-date-time-picker3/dist/vue-ctk-date-time-picker3.css";

export default defineNuxtPlugin(async (nuxtApp) => {
  nuxtApp.vueApp.component("VueCtkDateTimePicker", VueCtkDateTimePicker);
});
