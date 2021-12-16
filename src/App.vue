<template>
  <div class="h-100 p-d-flex p-flex-column p-jc-between">
    <Toast position="bottom-center" />
    <router-view />
    <div class="p-as-bottom p-grid">
      <div class="p-col">
        <i class="pi pi-info-circle"></i>
        {{ isApiOnline ? "Online" : "Offline" }}
      </div>
      <div class="p-col"><i class="pi pi-mobile"></i> +48 111-222-333</div>
    </div>
  </div>
</template>

<script>
import { useToast } from "primevue/usetoast";
import { computed, watch } from "vue";
import { useStore } from "vuex";

export default {
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
body {
  margin: 0;
  height: 100vh;
  overflow-x: hidden;
  overflow-y: auto;
  background-color: var(--surface-a);
  font-family: var(--font-family);
  font-weight: 400;
  color: var(--text-color);
}

.h-100 {
  height: 100%;
}
</style>
