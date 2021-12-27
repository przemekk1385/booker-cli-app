<template>
  <div class="p-fluid">
    <form
      class="p-fluid"
      @reset="handleReset()"
      @submit.prevent="handleSubmit()"
    >
      <div class="p-field">
        <span class="p-input-icon-right">
          <i class="pi pi-hashtag" />
          <InputText
            id="code"
            v-model="v$.code.$model"
            :class="{
              'p-invalid': v$.code.$invalid && v$.code.$dirty,
            }"
            :placeholder="$t('form.codeInputPlaceholder')"
            type="text"
          />
        </span>
        <small
          v-for="error of v$.code.$errors"
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
          :minDate="minDate"
          :maxDate="maxDate"
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
          :disabled="v$.cancel.$model || !isApiOnline"
          optionDisabled="disabled"
          optionLabel="label"
          optionValue="value"
          :options="daysSlots"
          :placeholder="$t('form.slotDropdown.placeholder')"
          @click="lazyLoadDaysSlots()"
        >
          <template #option="slotProps">
            <div v-if="!loading" class="p-ai-center p-jc-between p-d-flex">
              {{ slotProps.option.label }}
              <Tag
                v-if="slotProps.option.apartment"
                :value="`${$t('form.slotDropdown.optionTagValue')} ${
                  slotProps.option.apartment
                }`"
              ></Tag>
            </div>
            <Skeleton
              v-else
              :width="slotProps.option.value % 2 ? '75%' : '50%'"
              height="1rem"
            />
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

      <div class="p-field-checkbox">
        <Checkbox id="cancel" v-model="v$.cancel.$model" :binary="true" />
        <label for="cancel">{{ $t("form.cancelCheckboxLabel") }}</label>
      </div>

      <span class="p-buttonset p-mt-6">
        <Button
          v-if="!v$.cancel.$model"
          class="p-button-success"
          :disabled="!isApiOnline"
          icon="pi pi-calendar-plus"
          type="submit"
          :label="$t('form.bookButtonLabel')"
        />
        <Button
          v-else
          class="p-button-danger"
          :disabled="!isApiOnline"
          icon="pi pi-calendar-minus"
          type="submit"
          :label="$t('form.cancelButtonLabel')"
        />
        <Button icon="pi pi-times" type="reset" />
      </span>
    </form>
  </div>
</template>

<script>
import { computed, ref } from "vue";
import { useStore } from "vuex";
import dayjs from "dayjs";

import useForm from "@/use/form";
import useSlots from "@/use/slots";

export default {
  props: {
    minDate: {
      type: Date,
      default: dayjs().subtract(1, "day").toDate(),
    },
    maxDate: {
      type: Date,
      default: dayjs().add(2, "day").toDate(),
    },
  },
  setup() {
    const { handleSubmit, handleReset, state, v$ } = useForm();

    const { daysSlots } = useSlots(state);

    const store = useStore();
    const isApiOnline = computed(() => store.getters.isApiOnline);

    const loading = ref(false);

    const lazyLoadDaysSlots = async () => {
      loading.value = true;
      await store.dispatch("fetchBookingsFromApi");
      setTimeout(() => (loading.value = false), 500);
    };

    return {
      state,
      v$,
      handleSubmit,
      handleReset,

      daysSlots,

      isApiOnline,
      loading,
      lazyLoadDaysSlots,
    };
  },
};
</script>

<style scoped>
.p-fluid .p-buttonset .p-button {
  flex: unset;
}

.p-fluid .p-button {
  width: unset;
}

.p-buttonset .p-button:first-of-type {
  flex-grow: 1;
}

.p-buttonset .p-button:last-of-type {
  width: 3rem;
}
</style>
