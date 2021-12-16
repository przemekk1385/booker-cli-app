import { ToastSeverity } from "primevue/api";
import { createStore } from "vuex";
import axios from "axios";
import dayjs from "dayjs";

const today = dayjs();
let database = null; // TODO: move outside

const getDatabase = () => {
  return new Promise((resolve, reject) => {
    if (database) {
      resolve(database);
    }

    const request = window.indexedDB.open("bookerClientDB");

    request.onerror = (event) => {
      console.log("ERROR: Unable to open database", event);
      reject("Error");
    };

    request.onsuccess = (event) => {
      database = event.target.result;
      resolve(database);
    };

    request.onupgradeneeded = (event) => {
      database = event.target.result;

      database.createObjectStore("slots", {
        keyPath: "value",
      });
      database.createObjectStore("bookings", {
        keyPath: "id",
      });
    };
  });
};

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
  isAppSyncing: ({ bookings, slots }) => !bookings || !slots,
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
    const bookings = await axios
      .get(`${process.env.VUE_APP_API_HOST}/api/v1/booking/`)
      .then(({ data: bookings }) => bookings)
      .catch(({ response: { status } = {} }) => {
        if (status) {
          commit("pushMessage", {
            severity: ToastSeverity.ERROR,
            summary: "Error",
            detail: `Failed to get bookings, got ${status} response code.`,
          });
        }
        return [];
      });
    commit("bookings", bookings);
  },
  async fetchSlotsFromApi({ commit }) {
    const slots = await axios
      .get(`${process.env.VUE_APP_API_HOST}/api/v1/slot/`)
      .then(({ data: slots }) => slots)
      .catch((error) => {
        const { response: { status } = {} } = error;
        if (status) {
          commit("pushMessage", {
            severity: ToastSeverity.ERROR,
            summary: "Error",
            detail: `Failed to get slots, got ${status} response code.`,
          });
        }
        return [];
      });
    commit("slots", slots);
  },
  async fetchSlotsFromStore({ commit }) {
    const database = await getDatabase();

    const slots = await new Promise((resolve, reject) => {
      const transaction = database.transaction("slots", "readonly");
      const store = transaction.objectStore("slots");
      let slots = [];

      store.openCursor().onsuccess = (event) => {
        let cursor = event.target.result;
        if (cursor) {
          slots.push(cursor.value);
          cursor.continue();
        }
      };

      transaction.oncomplete = () => {
        resolve(slots);
      };

      transaction.onerror = (event) => {
        reject(event);
      };
    });
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

  async createBooking({ commit }, { day, identifier, slot }) {
    await axios
      .post(`${process.env.VUE_APP_API_HOST}/api/v1/booking/`, {
        day,
        identifier,
        slot,
      })
      .then(({ data: booking }) => {
        commit("pushBooking", booking);
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
