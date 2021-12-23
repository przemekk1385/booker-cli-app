import { computed, reactive, watch } from "vue";
import { useStore } from "vuex";
import { useVuelidate } from "@vuelidate/core";
import { maxLength, required, requiredUnless } from "@vuelidate/validators";
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
    cancel: {},
    code: {
      maxLength: maxLength(10),
      required,
    },
    day: { required },
    slot: {
      requiredUnlessCancel: requiredUnless(() => state.cancel),
    },
  };

  const state = reactive({
    cancel: false,
    code: undefined,
    day: dayjs().toDate(),
    slot: undefined,
  });

  const $externalResults = reactive({});
  const v$ = useVuelidate(rules, state, {
    $externalResults,
  });

  const handleSubmit = async () => {
    v$.value.$clearExternalResults();

    if (!(await v$.value.$validate())) return;

    const { cancel, code, day, slot } = state;
    let isSuccess;

    if (!cancel) {
      isSuccess = await store.dispatch("createBooking", {
        code,
        day: dayjs(day).format(DATE_FORMAT),
        slot,
      });
    } else {
      isSuccess = await store.dispatch("cancelBooking", {
        code,
        day: dayjs(day).format(DATE_FORMAT),
      });
    }

    if (isSuccess) {
      handleReset();
    }
  };
  const handleReset = () => {
    state.cancel = false;
    state.code = undefined;
    state.slot = undefined;
    v$.value.$reset();
    setTimeout(() => (state.day = dayjs().toDate()));
  };

  return { handleSubmit, handleReset, state, v$ };
}
