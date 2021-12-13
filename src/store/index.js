import { createStore } from "vuex";
import axios from "axios";
import dayjs from "dayjs";

export default createStore({
  state: {
    errorMessage: undefined,
    minDate: dayjs(),
    maxDate: dayjs().add(1, "day"),
  },
  mutations: {
    errorMessage(state, message) {
      state.errorMessage = message;
    },
  },
  actions: {
    async slotList({ commit }) {
      try {
        const dataPromise = await axios.get(
          `${process.env.VUE_APP_API_HOST}/api/v1/slot/`
        );
        const { data } = dataPromise;
        return data;
      } catch ({ response: { data, status } }) {
        commit(
          "errorMessage",
          `Failed to get slots, got ${status} response code.`
        );
        return [];
      }
    },
    async bookingCreate({ commit }, { day, identifier, slot }) {
      try {
        const dataPromise = await axios.post(
          `${process.env.VUE_APP_API_HOST}/api/v1/booking/`,
          {
            day,
            identifier,
            slot,
          }
        );
        const { data } = dataPromise;
        return data;
      } catch ({ response: { data, status } }) {
        commit("errorMessage", `Failed to book, got ${status} response code.`);
        return { errors: data };
      }
    },
    async bookingList({ commit }) {
      try {
        const dataPromise = await axios.get(
          `${process.env.VUE_APP_API_HOST}/api/v1/booking/`
        );
        const { data } = dataPromise;
        return data;
      } catch ({ response: { data, status } }) {
        commit(
          "errorMessage",
          `Failed to get bookings, got ${status} response code.`
        );
        return [];
      }
    },
  },
  modules: {},
});
