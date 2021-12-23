import { ToastSeverity } from "primevue/api";
import { createStore } from "vuex";

import {
  slotList as dbSlotList,
  slotBatchCreate as dbSlotBatchCreate,
} from "@/services/database";
import {
  bookingList,
  bookingCancel,
  bookingCreate,
  healthStatus,
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
  healthStatus(state, healthStatus) {
    state.healthStatus = healthStatus;
  },

  bookings(state, bookings) {
    state.bookings = bookings;
  },
  slots(state, slots) {
    state.slots = slots;
  },

  formErrors(state, errors) {
    state.formErrors.push(errors);
  },
  messages(state, message) {
    state.messages.push(message);
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
  async fetchBookingsFromApi({ commit, dispatch }) {
    commit("bookings", []);

    const { data: bookings, status } = await bookingList();

    if (status === 200) {
      commit("bookings", bookings);
    } else {
      dispatch("handleFailureNoErrors", status);
    }
  },
  async fetchSlotsFromApi({ commit, dispatch }) {
    const { data: slots, status } = await apiSlotList();

    if (status === 200) {
      commit("slots", slots);
    } else {
      dispatch("handleFailureNoErrors", status);
    }
  },

  async fetchHealthStatus({ commit }) {
    commit("healthStatus", await healthStatus());
  },

  async cancelBooking({ dispatch }, payload) {
    const { errors, status } = await bookingCancel(payload);
    let detail = "Check form fields.";

    if (errors) {
      const { non_field_errors: nonFieldErrors = [] } = errors;
      detail = nonFieldErrors[0] || detail;
    }

    const statusCodeHandlers = {
      204: () => dispatch("handleSuccess", "Booking canceled."),
      400: () => dispatch("handleFailure", { detail, errors }),
      404: () =>
        dispatch("handleFailure", {
          detail,
          errors: {
            code: "Matching booking not found.",
          },
        }),
      Xxx: () => dispatch("handleFailureNoErrors", status),
    };

    return (
      (statusCodeHandlers[status] && statusCodeHandlers[status]()) ||
      statusCodeHandlers.Xxx()
    );
  },
  async createBooking({ dispatch }, payload) {
    const { errors, status } = await bookingCreate(payload);
    let detail = "Check form fields.";

    if (errors) {
      const { non_field_errors: nonFieldErrors = [] } = errors;
      detail = nonFieldErrors[0] || detail;
    }

    const statusCodeHandlers = {
      201: () => dispatch("handleSuccess", "Booking created."),
      400: () => dispatch("handleFailure", { detail, errors }),
      404: () =>
        dispatch("handleFailure", {
          detail,
          errors: {
            code: "Matching apartment not found.",
          },
        }),
      Xxx: () => dispatch("handleFailureNoErrors", status),
    };

    return (
      (statusCodeHandlers[status] && statusCodeHandlers[status]()) ||
      statusCodeHandlers.Xxx()
    );
  },

  async fetchSlotsFromDatabase({ commit }) {
    const slots = await dbSlotList(); // TODO: error handling (?)

    commit("slots", slots);
  },
  async insertSlotsToDatabase(store, slots) {
    await dbSlotBatchCreate(slots); // TODO: error handling (?)
  },

  handleFailure({ commit }, { detail, errors }) {
    commit("formErrors", errors);
    commit("messages", {
      severity: ToastSeverity.ERROR,
      summary: "Error",
      detail,
      life: 3000,
    });
    return false;
  },
  handleFailureNoErrors({ commit }, status) {
    let detail = "Failed to book";
    if (status) {
      detail = `${detail}, got ${status} response code.`;
    }

    commit("messages", {
      severity: ToastSeverity.ERROR,
      summary: "Error",
      detail,
    });
    return false;
  },
  handleSuccess({ commit }, detail) {
    commit("messages", {
      severity: ToastSeverity.SUCCESS,
      summary: "Ok",
      detail,
      life: 3000,
    });
    return true;
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
