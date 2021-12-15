<template>
  <div class="p-grid">
    <div class="p-col">
      <div class="p-fluid">
        <form
          class="p-fluid"
          @reset="handleReset()"
          @submit.prevent="handleSubmit()"
        >
          <div class="p-field">
            <span class="p-input-icon-right">
              <i class="pi pi-phone" />
              <InputText
                id="identifier"
                v-model="v$.identifier.$model"
                :class="{
                  'p-invalid': v$.identifier.$invalid && v$.identifier.$dirty,
                }"
                type="text"
              />
            </span>
            <small
              v-for="error of v$.identifier.$errors"
              :key="error.$uid"
              class="p-d-block p-error"
            >
              {{ error.$message }}
            </small>
          </div>
          <div class="p-field">
            <Calendar
              inputId="calendar"
              v-model="v$.day.$model"
              :class="{ 'p-invalid': v$.day.$invalid && v$.day.$dirty }"
              dateFormat="yy-mm-dd"
              :minDate="calendar.minDate"
              :maxDate="calendar.maxDate"
              :showIcon="true"
            />
            <small
              v-for="error of v$.day.$errors"
              :key="error.$uid"
              class="p-d-block p-error"
            >
              {{ error.$message }}
            </small>
          </div>
          <div class="p-field">
            <Dropdown
              inputId="slot"
              v-model="v$.slot.$model"
              :class="{ 'p-invalid': v$.slot.$invalid && v$.slot.$dirty }"
              :loading="isSyncing"
              optionDisabled="apartment"
              optionLabel="label"
              optionValue="value"
              :options="daysSlots"
              placeholder="Choose slot"
            >
              <template #option="slotProps">
                <div class="p-ai-center p-jc-between p-d-flex">
                  {{ slotProps.option.label }}
                  <Tag
                    v-if="slotProps.option.apartment"
                    :value="slotProps.option.apartment"
                  ></Tag>
                </div>
              </template>
            </Dropdown>
            <small
              v-for="error of v$.slot.$errors"
              :key="error.$uid"
              class="p-d-block p-error"
            >
              {{ error.$message }}
            </small>
          </div>

          <span class="p-buttonset">
            <Button icon="pi pi-check" type="submit" />
            <Button class="p-button-danger" icon="pi pi-times" type="reset" />
          </span>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, onMounted, reactive, watch } from "vue";
import { useStore } from "vuex";
import { useVuelidate } from "@vuelidate/core";
import { maxLength, minLength, required } from "@vuelidate/validators";
import dayjs from "dayjs";

const DATE_FORMAT = "YYYY-MM-DD";

export default {
  setup() {
    const store = useStore();

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
      day: undefined,
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

      let { day } = state;
      const { identifier, slot } = state;
      store.dispatch("bookingCreate", {
        day: dayjs(day).format(DATE_FORMAT),
        identifier,
        slot,
      });
    };
    const handleReset = () => {
      state.day = undefined;
      state.identifier = undefined;
      state.slot = undefined;
      v$.value.$reset();
    };

    const calendar = reactive({
      maxDate: undefined,
      minDate: undefined,
    });

    const isSyncing = computed(() => store.getters.appIsSyncing);

    const slots = computed(() => store.state.slots || []);
    const daysSlots = computed(() =>
      slots.value.map(({ label, value }) => ({
        label,
        value,
        apartment: daysBookings.value[value],
      }))
    );

    const bookings = computed(() => store.state.bookings || []);
    const daysBookings = computed(() =>
      bookings.value
        .filter(({ day }) => {
          return day === dayjs(state.day).format(DATE_FORMAT);
        })
        .reduce((ac, { slot, apartment }) => ({ ...ac, [slot]: apartment }), {})
    );

    const formErrors = computed(() => store.getters.latestFormErrors);
    watch(
      () => formErrors.value,
      (errors) => Object.assign($externalResults, errors)
    );

    onMounted(async () => {
      const maxDate = (() => store.state.maxDate)();
      const minDate = (() => store.state.minDate)();

      state.day = minDate.toDate();
      calendar.maxDate = maxDate.toDate();
      calendar.minDate = minDate.toDate();

      store.dispatch("bookingList");
      store.dispatch("slotList");
    });

    return {
      state,
      v$,
      handleSubmit,
      handleReset,
      calendar,
      isSyncing,
      daysSlots,
    };
  },
};
</script>
