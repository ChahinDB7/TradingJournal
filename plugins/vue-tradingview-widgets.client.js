import { defineNuxtPlugin } from "#app";

import { Chart, TickerTape } from "vue-tradingview-widgets";

export default defineNuxtPlugin(async (nuxtApp) => {
  nuxtApp.vueApp.component("Chart", Chart);
  nuxtApp.vueApp.component("TickerTape", TickerTape);
});
