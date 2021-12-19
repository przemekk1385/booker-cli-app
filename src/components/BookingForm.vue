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
              optionDisabled="disabled"
              optionLabel="label"
              optionValue="value"
              :options="daysSlots"
              placeholder="Choose slot"
              @click="lazyLoadDaysSlots()"
            >
              <template #option="slotProps">
                <div v-if="!loading" class="p-ai-center p-jc-between p-d-flex">
                  {{ slotProps.option.label }}
                  <Tag
                    v-if="slotProps.option.apartment"
                    :value="slotProps.option.apartment"
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
import { ref } from "vue";
import { useStore } from "vuex";
import dayjs from "dayjs";

import useForm from "@/use/form";
import useSlots from "@/use/slots";

export default {
  props: {
    minDate: {
      type: Date,
      default: dayjs().toDate(),
    },
    maxDate: {
      type: Date,
      default: dayjs().add(1, "day").toDate(),
    },
  },
  setup() {
    const { handleSubmit, handleReset, state, v$ } = useForm();

    const { daysSlots } = useSlots(state);

    const store = useStore();

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

      loading,
      lazyLoadDaysSlots,
    };
  },
};
</script>
