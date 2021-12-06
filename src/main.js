import { createApp } from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";
import PrimeVue from "primevue/config";

import Button from "primevue/button";
import Calendar from "primevue/calendar";
import Dropdown from "primevue/dropdown";
import InputMask from "primevue/inputmask";
import Listbox from "primevue/listbox";
import RadioButton from "primevue/radiobutton";
import Tag from "primevue/tag";

import Ripple from "primevue/ripple";

import "primevue/resources/themes/lara-dark-indigo/theme.css";
import "primevue/resources/primevue.min.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";

const app = createApp(App);

app.use(store).use(router).use(PrimeVue, { ripple: true });

app.component("Button", Button);
app.component("Calendar", Calendar);
app.component("Dropdown", Dropdown);
app.component("InputMask", InputMask);
app.component("Listbox", Listbox);
app.component("RadioButton", RadioButton);
app.component("Tag", Tag);

app.directive("ripple", Ripple);

app.mount("#app");
