<template>
  <div>
    <Toast position="bottom-center" />
    <router-view />
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

    const latestToastMessage = computed(() => store.getters.latestToastMessage);

    watch(
      () => latestToastMessage.value,
      (message) => {
        toast.add(message);
      }
    );
  },
};
</script>

<style>
body {
  margin: 0;
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
  background-color: var(--surface-a);
  font-family: var(--font-family);
  font-weight: 400;
  color: var(--text-color);
}
</style>
