import { computed, reactive, watch } from "vue";
import { useStore } from "vuex";
import { useVuelidate } from "@vuelidate/core";
import { maxLength, minLength, required } from "@vuelidate/validators";
import dayjs from "dayjs";

import { DATE_FORMAT } from "../constants";

export default function useForm() {
  const store = useStore();

  const formErrors = computed(() => store.getters.latestFormErrors);

  watch(
    () => formErrors.value,
    (errors) => Object.assign($externalResults, errors)
  );

  const rules = {
    day: { required },
    identifier: {
      maxLength: maxLength(9),
      minLength: minLength(9),
      required,
    },
    slot: { required },
  };

  const state = reactive({
    day: dayjs().toDate(),
    identifier: undefined,
    slot: undefined,
  });

  const $externalResults = reactive({});
  const v$ = useVuelidate(rules, state, {
    $externalResults,
  });

  const handleSubmit = async () => {
    v$.value.$clearExternalResults();

    if (!(await v$.value.$validate())) return;

    const { day, identifier, slot } = state;
    if (
      await store.dispatch("createBooking", {
        day: dayjs(day).format(DATE_FORMAT),
        identifier,
        slot,
      })
    ) {
      handleReset();
    }
  };
  const handleReset = () => {
    state.day = undefined;
    state.identifier = undefined;
    state.slot = undefined;
    v$.value.$reset();
  };

  return { handleSubmit, handleReset, state, v$ };
}
