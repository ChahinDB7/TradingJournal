import { defineNuxtPlugin } from "#app";

import "multi-range-slider-vue/MultiRangeSliderBarOnly.css";

import MultiRangeSlider from "multi-range-slider-vue";
export default defineNuxtPlugin(async (nuxtApp) => {
  nuxtApp.vueApp.component("MultiRangeSlider", MultiRangeSlider);
});
