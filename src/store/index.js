import { ToastSeverity } from "primevue/api";
import { createStore } from "vuex";
import axios from "axios";
import dayjs from "dayjs";

export default createStore({
  state: {
    minDate: dayjs(),
    maxDate: dayjs().add(1, "day"),

    formErrors: [],
    toastMessages: [],
    healthStatus: undefined,

    bookings: [],
    slots: [],
  },
  getters: {
    apiIsOnline: ({ healthStatus }) => healthStatus === 200,
    latestFormErrors: ({ formErrors }) => formErrors[formErrors.length - 1],
    latestToastMessage: ({ toastMessages }) =>
      toastMessages[toastMessages.length - 1],
  },
  mutations: {
    addToastMessage(state, toastMessage) {
      state.toastMessages.push(toastMessage);
    },
    addFormErrors(state, errors) {
      state.formErrors.push(errors);
    },
    setHealthStatus(state, status) {
      state.healthStatus = status;
    },

    addBooking(state, item) {
      state.bookings.push(item);
    },
    addSlot(state, item) {
      state.slots.push(item);
    },
  },
  actions: {
    async getHealthStatus({ commit }) {
      try {
        const dataPromise = await axios.get(
          `${process.env.VUE_APP_API_HOST}/api/v1/health/`
        );
        const { status } = dataPromise;
        commit("setHealthStatus", status);
      } catch {
        commit("setHealthStatus", undefined);
      }
    },
    async slotList({ commit }) {
      try {
        const dataPromise = await axios.get(
          `${process.env.VUE_APP_API_HOST}/api/v1/slot/`
        );
        const { data } = dataPromise;
        data.forEach((item) => {
          commit("addSlot", item);
        });
      } catch ({ response: { data, status } }) {
        commit("addToastMessage", {
          severity: ToastSeverity.ERROR,
          summary: "Error",
          detail: `Failed to get slots, got ${status} response code.`,
        });
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
        const { data: item } = dataPromise;
        commit("addBooking", item);
        commit("addToastMessage", {
          severity: ToastSeverity.SUCCESS,
          summary: "Ok",
          detail: `Booking created.`,
          life: 3000,
        });
      } catch ({ response: { data: errors, status } }) {
        if (status === 400) {
          commit("addFormErrors", errors);
          commit("addToastMessage", {
            severity: ToastSeverity.INFO,
            summary: "Info",
            detail: `Check form fields.`,
            life: 3000,
          });
        } else {
          commit("addToastMessage", {
            severity: ToastSeverity.ERROR,
            summary: "Error",
            detail: `Failed to book, got ${status} response code.`,
          });
        }
      }
    },
    async bookingList({ commit }) {
      try {
        const dataPromise = await axios.get(
          `${process.env.VUE_APP_API_HOST}/api/v1/booking/`
        );
        const { data } = dataPromise;
        data.forEach((item) => {
          commit("addBooking", item);
        });
      } catch ({ response: { data, status } }) {
        commit("addToastMessage", {
          severity: ToastSeverity.ERROR,
          summary: "Error",
          detail: `Failed to get bookings, got ${status} response code.`,
        });
      }
    },
  },
  modules: {},
});
