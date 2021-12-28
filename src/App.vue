<template>
  <Toast
    :breakpoints="{
      '27rem': { width: '100%', padding: '1rem' },
    }"
    position="bottom-center"
  />
  <div class="h-100 p-d-flex p-flex-column p-jc-between">
    <div class="p-grid">
      <div v-if="!isApiOnline" class="p-col-12 p-md-4 p-md-offset-4">
        <Message :closable="false" severity="warn">{{
          $t("app.noApiConnectionMessage")
        }}</Message>
      </div>
      <div class="p-col-12 p-md-4 p-md-offset-4">
        <BookingForm />
      </div>
    </div>
    <div class="p-grid">
      <div class="p-col-12 p-md-4 p-md-offset-4">
        <i class="pi pi-map-marker p-m-1"></i> Szczytowa 45 A/I, Szczyrk
      </div>
    </div>
  </div>
</template>

<script>
import { useToast } from "primevue/usetoast";
import { computed, watch } from "vue";
import { useStore } from "vuex";

import BookingForm from "@/components/BookingForm.vue";

export default {
  components: {
    BookingForm,
  },
  setup() {
    const store = useStore();
    const toast = useToast();

    const initialize = async () => await store.dispatch("initialize");

    const latestMessage = computed(() => store.getters.latestMessage);
    const isApiOnline = computed(() => store.getters.isApiOnline);

    watch(
      () => latestMessage.value,
      (message) => {
        toast.add(message);
      }
    );

    initialize();
    return { isApiOnline };
  },
};
</script>

<style>
html {
  height: 100%;
}

body {
  background-color: var(--surface-a);
  color: var(--text-color);
  font-family: var(--font-family);
  font-weight: 400;
  height: inherit;
  margin: 0;
  overflow-x: hidden;
  overflow-y: auto;
}

.h-100 {
  height: 100%;
}
</style>
