import { defineStore, acceptHMRUpdate } from "pinia";

import convert from "crypto-convert";

export const CryptoPricesStore = defineStore({
  id: "cryptoPricesStore",
  state: () => ({}),
  getters: {},
  actions: {
    async getCurrency(payload) {
      await convert.ready();
      convert.setOptions({
        binance: true,
      });

      const result = await convert[payload.symbol][payload.currency](
        payload.amount,
      );
      return result;
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(CryptoPricesStore, import.meta.hot));
}
