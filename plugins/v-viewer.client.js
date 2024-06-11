import { defineNuxtPlugin } from "#app";

import "viewerjs/dist/viewer.css";
import Viewer from "v-viewer";

export default defineNuxtPlugin(async (nuxtApp) => {
  nuxtApp.vueApp.use(Viewer);
});
