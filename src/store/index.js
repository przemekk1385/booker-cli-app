import { ToastSeverity } from "primevue/api";
import { createStore } from "vuex";
import axios from "axios";
import dayjs from "dayjs";

import { getDatabase, slotList as storeSlotList } from "@/services/database";
import {
  bookingList,
  bookingCreate,
  slotList as apiSlotList,
} from "@/services/api";

const today = dayjs();

const state = {
  day: today.toDate(),

  minDate: today.toDate(),
  maxDate: today.add(1, "day").toDate(),

  formErrors: [],
  messages: [],

  healthStatus: undefined,

  bookings: [],
  slots: [],
};

const getters = {
  isApiOnline: ({ healthStatus }) => healthStatus === 200,
  isAppSyncing: ({ bookings, slots }) => !bookings || !slots, // TODO: fix
  latestFormErrors: ({ formErrors }) => formErrors[formErrors.length - 1],
  latestMessage: ({ messages }) => messages[messages.length - 1],

  // daysBookings: (state) =>
  //   state.bookings
  //     .filter(({ day }) => day === dayjs(state.day).format(DATE_FORMAT))
  //     .reduce((ac, { slot, apartment }) => ({ ...ac, [slot]: apartment }), {}),
  // daysSlots: (state) =>
  //   state.slots.map(({ label, value }) => ({
  //     label,
  //     value,
  //     apartment: getters.daysBookings[value],
  //   })),
};

const mutations = {
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
};

const actions = {
  async initialize({ dispatch, getters, state }) {
    await dispatch("fetchHealthStatus");

    await dispatch("fetchSlotsFromStore");
    if (getters.isApiOnline && !state.slots.length) {
      await dispatch("fetchSlotsFromApi");
    }

    await dispatch("fetchBookingsFromApi");
  },
  async fetchBookingsFromApi({ commit }) {
    const { data: bookings, status } = await bookingList();

    if (!status) {
      commit("pushMessage", {
        severity: ToastSeverity.ERROR,
        summary: "Error",
        detail: `Failed to get bookings, got ${status} response code.`,
      });
    } else {
      commit("bookings", bookings);
    }
  },
  async fetchSlotsFromApi({ commit }) {
    const { data: slots, status } = await apiSlotList();

    if (!status) {
      commit("pushMessage", {
        severity: ToastSeverity.ERROR,
        summary: "Error",
        detail: `Failed to get slots, got ${status} response code.`,
      });
    } else {
      commit("slots", slots);
    }
  },
  async fetchSlotsFromStore({ commit }) {
    const slots = await storeSlotList(); // TODO: error handling (?)

    commit("slots", slots);
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
    } else if (status === 400) {
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
  },
};

const plugins = [
  (store) => {
    store.subscribe(async ({ type, payload }) => {
      const database = await getDatabase();

      if (type === "slots") {
        return new Promise((resolve, reject) => {
          const transaction = database.transaction("slots", "readwrite");
          const store = transaction.objectStore("slots");

          payload.forEach((item) => store.put(item));

          transaction.oncomplete = () => {
            resolve("Item successfully saved.");
          };

          transaction.onerror = (event) => {
            reject(event);
          };
        });
      }
    });
    // store.subscribeAction(async ({ type, payload }) => {
    //   console.log(type, payload);
    // });
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
