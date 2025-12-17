import { defineStore } from "pinia";

export const useAppStore = defineStore("app", {
  state: () => ({
    counter: 0,
  }),
  getters: {
    doubleCounter: (state) => state.counter * 2,
  },
  actions: {
    increment() {
      this.counter++;
    },
  },
});
