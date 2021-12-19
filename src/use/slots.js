import { computed, toRefs, ref, watch } from "vue";
import { useStore } from "vuex";

import dayjs from "dayjs";

import { DATE_FORMAT } from "@/constants";

export default function useSlots(props) {
  const store = useStore();

  const { day: lookupDay } = toRefs(props);

  const daysBookings = ref({});

  watch(
    () => [lookupDay.value, [...store.state.bookings]],
    ([lookupDayVal, bookingsVal]) => {
      daysBookings.value = bookingsVal
        .filter(({ day }) => day === dayjs(lookupDayVal).format(DATE_FORMAT))
        .reduce(
          (ac, { slot, apartment }) => ({ ...ac, [slot]: apartment }),
          {}
        );
    }
  );

  const slots = computed(() => store.state.slots);

  const daysSlots = computed(() =>
    slots.value.map(({ label, value }) => ({
      label,
      value,
      apartment: (daysBookings.value || {})[value],
    }))
  );

  return { daysBookings, daysSlots };
}
