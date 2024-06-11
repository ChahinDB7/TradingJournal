import { defineNuxtPlugin } from "#app";
import "quill/dist/quill.core.css";
import "quill/dist/quill.bubble.css";
import "quill/dist/quill.snow.css";
import Vue3Editor from "vue3-editor";

export default defineNuxtPlugin(async (nuxtApp) => {
  nuxtApp.vueApp.use(Vue3Editor);
});

// import { defineNuxtPlugin } from "#app";

// export default defineNuxtPlugin(async (nuxtApp) => {
//   if (process.client) {
//     const { QuillEditor } = await import("@vueup/vue-quill");
//     await import("@vueup/vue-quill/dist/vue-quill.snow.css");
//     nuxtApp.vueApp.component("quill-editor", QuillEditor);
//   }
// });
