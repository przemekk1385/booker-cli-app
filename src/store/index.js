import { ToastSeverity } from "primevue/api";
import { createStore } from "vuex";
import axios from "axios";
import dayjs from "dayjs";

export default createStore({
  state: {
    minDate: dayjs(),
    maxDate: dayjs().add(1, "day"),

    formErrors: [],
    messages: [],

    healthStatus: undefined,

    bookings: undefined,
    slots: undefined,
  },
  getters: {
    isApiOnline: ({ healthStatus }) => healthStatus === 200,
    isAppSyncing: ({ bookings, slots }) => !bookings || !slots,
    latestFormErrors: ({ formErrors }) => formErrors[formErrors.length - 1],
    latestMessage: ({ messages }) => messages[messages.length - 1],
  },
  mutations: {
    bookings(state, payload) {
      state.bookings = payload;
    },
    healthStatus(state, payload) {
      state.healthStatus = payload;
    },
    slots(state, payload) {
      state.slots = payload;
    },

    clearBookings(state) {
      state.bookings = undefined;
    },
    clearSlots(state) {
      state.slots = undefined;
    },

    pushBooking(state, payload) {
      state.bookings.push(payload);
    },
    pushFormErrors(state, payload) {
      state.formErrors.push(payload);
    },
    pushMessage(state, payload) {
      state.messages.push(payload);
    },
  },
  actions: {
    async getHealthStatus({ commit }) {
      const healthStatus = await axios
        .get(`${process.env.VUE_APP_API_HOST}/api/v1/health/`)
        .then(({ status }) => status)
        .catch(() => undefined);
      commit("healthStatus", healthStatus);
    },
    async slotList({ commit }) {
      return await axios
        .get(`${process.env.VUE_APP_API_HOST}/api/v1/slot/`)
        .then(({ data }) => commit("slots", data))
        .catch((error) => {
          const { response: { status } = {} } = error;
          if (status) {
            commit("pushMessage", {
              severity: ToastSeverity.ERROR,
              summary: "Error",
              detail: `Failed to get slots, got ${status} response code.`,
            });
          }
        });
    },
    async bookingCreate({ commit }, { day, identifier, slot }) {
      return await axios
        .post(`${process.env.VUE_APP_API_HOST}/api/v1/booking/`, {
          day,
          identifier,
          slot,
        })
        .then(({ data }) => {
          commit("pushBooking", data);
          commit("pushMessage", {
            severity: ToastSeverity.SUCCESS,
            summary: "Ok",
            detail: `Booking created.`,
            life: 3000,
          });
        })
        .catch(({ response: { data: errors, status } = {} }) => {
          if (status === 400) {
            commit("pushFormErrors", errors);
            commit("pushMessage", {
              severity: ToastSeverity.INFO,
              summary: "Info",
              detail: `Check form fields.`,
              life: 3000,
            });
          } else if (status) {
            commit("pushMessage", {
              severity: ToastSeverity.ERROR,
              summary: "Error",
              detail: `Failed to book, got ${status} response code.`,
            });
          }
        });
    },
    async bookingList({ commit }) {
      commit("clearBookings");
      return await axios
        .get(`${process.env.VUE_APP_API_HOST}/api/v1/booking/`)
        .then(({ data }) => commit("bookings", data))
        .catch(({ response: { status } = {} }) => {
          if (status) {
            commit("pushMessage", {
              severity: ToastSeverity.ERROR,
              summary: "Error",
              detail: `Failed to get bookings, got ${status} response code.`,
            });
          }
        });
    },
  },
  modules: {},
});
