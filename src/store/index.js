import { ToastSeverity } from "primevue/api";
import { createStore } from "vuex";
import axios from "axios";

import {
  slotList as dbSlotList,
  slotBatchCreate as dbSlotBatchCreate,
} from "@/services/database";
import {
  bookingList,
  bookingCreate,
  slotList as apiSlotList,
} from "@/services/api";

const state = {
  formErrors: [],
  messages: [],

  healthStatus: undefined,

  bookings: [],
  slots: [],
};

const getters = {
  isApiOnline: ({ healthStatus }) => healthStatus === 200,
  latestFormErrors: ({ formErrors }) => formErrors[formErrors.length - 1],
  latestMessage: ({ messages }) => messages[messages.length - 1],
};

const mutations = {
  healthStatus(state, payload) {
    state.healthStatus = payload;
  },

  bookings(state, payload) {
    state.bookings = payload;
  },
  slots(state, payload) {
    state.slots = payload;
  },

  pushBooking(state, payload) {
    state.bookings.push(payload);
    console.log(state.bookings);
  },
  pushFormErrors(state, payload) {
    state.formErrors.push(payload);
  },
  pushMessage(state, payload) {
    state.messages.push(payload);
  },
};

const actions = {
  async initialize({ dispatch, getters }) {
    await dispatch("fetchHealthStatus");

    await dispatch("fetchSlotsFromDatabase");
    if (getters.isApiOnline) {
      await dispatch("fetchSlotsFromApi");
    }

    // await dispatch("fetchBookingsFromApi");
  },
  async fetchBookingsFromApi({ commit }) {
    commit("bookings", []);

    const { data: bookings, status } = await bookingList();

    if (status == 200) {
      commit("bookings", bookings);
    } else {
      let detail = "Failed to get bookings";
      if (status) {
        detail = `${detail}, got ${status} response code.`;
      }

      commit("pushMessage", {
        severity: ToastSeverity.ERROR,
        summary: "Error",
        detail,
      });
    }
  },
  async fetchSlotsFromApi({ commit }) {
    const { data: slots, status } = await apiSlotList();

    if (status == 200) {
      commit("slots", slots);
    } else {
      let detail = "Failed to get slots";
      if (status) {
        detail = `${detail}, got ${status} response code.`;
      }

      commit("pushMessage", {
        severity: ToastSeverity.ERROR,
        summary: "Error",
        detail,
      });
    }
  },

  async fetchHealthStatus({ commit }) {
    commit(
      "healthStatus",
      await axios
        .get(`${process.env.VUE_APP_API_HOST}/api/v1/health/`)
        .then(({ status }) => status)
        .catch(() => undefined)
    );
  },

  async createBooking({ commit }, payload) {
    const { data: booking, errors, status } = await bookingCreate(payload);

    if (status === 201) {
      commit("pushBooking", booking);
      commit("pushMessage", {
        severity: ToastSeverity.SUCCESS,
        summary: "Ok",
        detail: `Booking created.`,
        life: 3000,
      });
      return true;
    } else if (status === 400) {
      commit("pushFormErrors", errors);
      commit("pushMessage", {
        severity: ToastSeverity.ERROR,
        summary: "Error",
        detail: `Check form fields.`,
        life: 3000,
      });
    } else {
      let detail = "Failed to book";
      if (status) {
        detail = `${detail}, got ${status} response code.`;
      }

      commit("pushMessage", {
        severity: ToastSeverity.ERROR,
        summary: "Error",
        detail,
      });
    }

    return false;
  },

  async fetchSlotsFromDatabase({ commit }) {
    const slots = await dbSlotList(); // TODO: error handling (?)

    commit("slots", slots);
  },

  async insertSlotsToDatabase(store, payload) {
    await dbSlotBatchCreate(payload); // TODO: error handling (?)
  },
};

const plugins = [
  (store) => {
    store.subscribe(async ({ type, payload }) => {
      if (type === "slots") {
        store.dispatch("insertSlotsToDatabase", payload);
      }
    });
  },
];

export default createStore({
  state,
  getters,
  mutations,
  actions,
  modules: {},
  plugins,
});
