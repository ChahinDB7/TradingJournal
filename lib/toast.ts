import { toast, ToastOptions } from "vue3-toastify";
type ToastType =
  | "info"
  | "success"
  | "error"
  | "warning"
  | "loading"
  | "default";
type ToastPosition =
  | "top-left"
  | "top-right"
  | "top-center"
  | "bottom-left"
  | "bottom-right"
  | "bottom-center";

export default {
  alert(
    message: string,
    duration: number = 2000,
    toastType: ToastType = "info",
    toastPosition: ToastPosition = "bottom-right",
  ) {
    toast(message, {
      autoClose: duration,
      theme: "light",
      hideProgressBar: false,
      type: toastType,
      position: toastPosition,
      limit: 1,
    } as ToastOptions);
  },
};
