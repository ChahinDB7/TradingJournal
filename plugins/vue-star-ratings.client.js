import { defineNuxtPlugin } from "#app";

import StarRating from "vue-star-rating";

export default defineNuxtPlugin(async (nuxtApp) => {
  nuxtApp.vueApp.component("StarRating", StarRating);
});
