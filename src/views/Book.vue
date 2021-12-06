<template>
  <div class="p-grid">
    <div class="p-col">
      <div class="p-fluid">
        <form
          class="p-fluid"
          @reset="resetForm()"
          @submit.prevent="handleSubmit(!v$.$invalid)"
        >
          <div class="p-field">
            <span class="p-input-icon-right">
              <i class="pi pi-phone" />
              <InputMask
                id="identifier"
                v-model="v$.identifier.$model"
                :class="{ 'p-invalid': v$.identifier.$invalid && submitted }"
                mask="999-999-999"
                type="text"
              />
            </span>
            <small
              v-if="
                (v$.identifier.$invalid && submitted) ||
                v$.identifier.$pending.$response
              "
              class="p-error"
              >{{
                v$.identifier.required.$message.replace("Value", "Phone number")
              }}</small
            >
          </div>
          <div class="p-field">
            <Calendar
              inputId="calendar"
              v-model="v$.day.$model"
              :class="{ 'p-invalid': v$.day.$invalid && submitted }"
              dateFormat="yy-mm-dd"
              :showIcon="true"
            />
            <small
              v-if="(v$.day.$invalid && submitted) || v$.day.$pending.$response"
              class="p-error"
              >{{ v$.day.required.$message.replace("Value", "Day") }}</small
            >
          </div>
          <div class="p-field">
            <Dropdown
              inputId="slot"
              v-model="v$.slot.$model"
              :class="{ 'p-invalid': v$.slot.$invalid && submitted }"
              optionDisabled="apartment"
              optionLabel="slotLabel"
              optionValue="slot"
              :options="bookings"
              placeholder="Choose slot"
            >
              <template #option="slotProps">
                <div class="p-ai-center p-jc-between p-d-flex">
                  {{ slotProps.option.slotLabel }}
                  <Tag
                    v-if="slotProps.option.apartment"
                    :value="slotProps.option.apartment"
                  ></Tag>
                </div>
              </template>
            </Dropdown>
            <small
              v-if="
                (v$.slot.$invalid && submitted) || v$.slot.$pending.$response
              "
              class="p-error"
              >{{ v$.slot.required.$message.replace("Value", "Slot") }}</small
            >
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
import { onMounted, reactive, ref } from "vue";
import { required } from "@vuelidate/validators";
import { useStore } from "vuex";
import { useVuelidate } from "@vuelidate/core";

export default {
  setup() {
    const store = useStore();

    const rules = {
      identifier: { required },
      day: { required },
      slot: { required },
    };

    const state = reactive({
      identifier: "",
      day: "",
      slot: "",
    });

    const v$ = useVuelidate(rules, state);

    const submitted = ref(false);
    let bookings = ref([]);

    const handleSubmit = (isFormValid) => {
      submitted.value = true;

      if (!isFormValid) {
        return;
      }
    };
    const resetForm = () => {
      state.identifier = "";
      state.day = "";
      state.slot = "";
      submitted.value = false;
    };

    const getTodaysDate = () => store.state.today;
    const getBookings = () => store.state.bookings;

    onMounted(() => {
      state.day = getTodaysDate();
      bookings.value = getBookings();
    });

    return { state, v$, submitted, bookings, handleSubmit, resetForm };
  },
};
</script>
