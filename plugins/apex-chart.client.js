import { defineNuxtPlugin } from "#app";
import VueApexCharts from "vue3-apexcharts";

export default defineNuxtPlugin(async (nuxtApp) => {
  nuxtApp.vueApp.use(VueApexCharts);
});
