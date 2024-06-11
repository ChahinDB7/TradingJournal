import { defineStore, acceptHMRUpdate } from "pinia";

export const CompoundEntriesStore = defineStore({
  id: "compoundEntriesStore",
  state: () => ({
    entries: [],
    averageEntry: {},
  }),
  getters: {},
  actions: {
    setEntries(payload) {
      this.entries = payload;
    },

    setAverageEntry(payload) {
      this.averageEntry = payload;
    },

    clearEntries() {
      this.entries = [];
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(
    acceptHMRUpdate(CompoundEntriesStore, import.meta.hot),
  );
}
