import { createApp } from "vue";
import App from "./App.vue";
import "./registerServiceWorker";

import store from "@/store";
import i18n from "@/i18n";

import PrimeVue from "primevue/config";

import Button from "primevue/button";
import Calendar from "primevue/calendar";
import Checkbox from "primevue/checkbox";
import Dropdown from "primevue/dropdown";
import InputText from "primevue/inputtext";
import Message from "primevue/message";
import Skeleton from "primevue/skeleton";
import Tag from "primevue/tag";

import Ripple from "primevue/ripple";

import "primevue/resources/themes/lara-dark-indigo/theme.css";
import "primevue/resources/primevue.min.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";
import Toast from "primevue/toast";
import ToastService from "primevue/toastservice";

const app = createApp(App);

app.use(store);
app.use(i18n);
app.use(PrimeVue, { ripple: true });
app.use(ToastService);

app.component("Button", Button);
app.component("Calendar", Calendar);
app.component("Checkbox", Checkbox);
app.component("Dropdown", Dropdown);
app.component("InputText", InputText);
app.component("Message", Message);
app.component("Skeleton", Skeleton);
app.component("Tag", Tag);
app.component("Toast", Toast);

app.directive("ripple", Ripple);

app.mount("#app");
