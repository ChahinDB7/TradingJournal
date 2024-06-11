import { defineNuxtPlugin } from "#app";

import draggable from "vuedraggable";

export default defineNuxtPlugin(async (nuxtApp) => {
  nuxtApp.vueApp.component("Draggable", draggable);
});
