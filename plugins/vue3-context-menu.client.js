import { defineNuxtPlugin } from "#app";
import ContextMenu from "@imengyu/vue3-context-menu";
import "@imengyu/vue3-context-menu/lib/vue3-context-menu.css";

export default defineNuxtPlugin(async (nuxtApp) => {
  nuxtApp.vueApp.use(ContextMenu);
});
