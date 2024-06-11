import { defineStore, acceptHMRUpdate } from "pinia";
import AES from "crypto-js/aes";
import Utf8 from "crypto-js/enc-utf8";
import SHA256 from "crypto-js/sha256";

function getKey() {
  return SHA256(window.navigator.userAgent).toString();
}

export const EncryptionStore = defineStore({
  id: "encryptionStore",
  state: () => ({}),
  getters: {},
  actions: {
    async Encrypt(payload) {
      try {
        return await AES.encrypt(
          JSON.stringify(payload.text),
          getKey(),
        ).toString();
      } catch (e) {
        return {};
      }
    },

    async Decrypt(payload) {
      try {
        const bytes = await AES.decrypt(payload.text, getKey());
        const originalText = JSON.parse(bytes.toString(Utf8));
        return originalText;
      } catch (e) {
        return {};
      }
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(EncryptionStore, import.meta.hot));
}
