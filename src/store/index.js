import { createStore } from "vuex";

export default createStore({
  state: {
    today: "2021-12-06",
    bookings: [
      {
        apartment: "Apartment 1",
        day: "2021-12-06",
        slotLabel: "11:00 - 11:50",
        slot: 1,
      },
      {
        apartment: null,
        day: "2021-12-06",
        slotLabel: "12:00 - 12:50",
        slot: 2,
      },
      {
        apartment: "Apartment 2",
        day: "2021-12-06",
        slotLabel: "13:00 - 13:50",
        slot: 3,
      },
      {
        apartment: null,
        day: "2021-12-06",
        slotLabel: "14:00 - 14:50",
        slot: 4,
      },
      {
        apartment: null,
        day: "2021-12-06",
        slotLabel: "15:00 - 15:50",
        slot: 5,
      },
      {
        apartment: null,
        day: "2021-12-06",
        slotLabel: "16:00 - 16:50",
        slot: 6,
      },
      {
        apartment: null,
        day: "2021-12-06",
        slotLabel: "17:00 - 17:50",
        slot: 7,
      },
      {
        apartment: "Apartment 7",
        day: "2021-12-06",
        slotLabel: "18:00 - 18:50",
        slot: 8,
      },
      {
        apartment: null,
        day: "2021-12-06",
        slotLabel: "19:00 - 19:50",
        slot: 9,
      },
      {
        apartment: "Apartment 8",
        day: "2021-12-06",
        slotLabel: "20:00 - 20:50",
        slot: 10,
      },
      {
        apartment: "Apartment 9",
        day: "2021-12-06",
        slotLabel: "21:00 - 21:50",
        slot: 11,
      },
    ],
  },
  mutations: {},
  actions: {},
  modules: {},
});
