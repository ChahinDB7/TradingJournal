import { defineNuxtPlugin } from "#app";
import BalmUI from "balm-ui";
import "balm-ui/dist/balm-ui.css";

export default defineNuxtPlugin(async (nuxtApp) => {
  nuxtApp.vueApp.use(BalmUI);
});
