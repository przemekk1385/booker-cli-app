<template>
  <form class="p-fluid" @reset="handleReset()" @submit.prevent="handleSubmit()">
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
              :value="
                $t('form.slotDropdown.optionTagValue', {
                  number: slotProps.option.apartment,
                })
              "
            ></Tag>
            <span v-else-if="slotProps.option.isOff">{{
              $t("form.slotDropdown.optionTextValue")
            }}</span>
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
        class="p-button-primary"
        :disabled="!isApiOnline"
        icon="pi pi-send"
        type="submit"
        :label="buttonLabel"
      />
      <Button
        class="p-button-outlined p-button-primary"
        icon="pi pi-times"
        type="reset"
      />
    </span>
  </form>
</template>

<script>
import { computed, ref } from "vue";
import { useStore } from "vuex";
import dayjs from "dayjs";

import i18n from "@/i18n";
import useForm from "@/use/form";
import useSlots from "@/use/slots";

const {
  global: { t },
} = i18n;

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

    const buttonLabel = computed(() =>
      !state.cancel ? t("form.bookButtonLabel") : t("form.cancelButtonLabel")
    );

    return {
      state,
      v$,
      handleSubmit,
      handleReset,

      daysSlots,

      isApiOnline,
      loading,
      lazyLoadDaysSlots,
      buttonLabel,
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
  width: 2.357rem;
}
</style>
