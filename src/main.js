import "primeflex/primeflex.css";
import "primeicons/primeicons.css";
import "primevue/resources/primevue.min.css";
import "primevue/resources/themes/saga-green/theme.css";

import { createApp } from "vue";

import Button from "primevue/button";
import Calendar from "primevue/calendar";
import Checkbox from "primevue/checkbox";
import dayjs from "dayjs";
import Dropdown from "primevue/dropdown";
import InputText from "primevue/inputtext";
import Message from "primevue/message";
import PrimeVue from "primevue/config";
import Ripple from "primevue/ripple";
import Skeleton from "primevue/skeleton";
import Tag from "primevue/tag";
import Toast from "primevue/toast";
import ToastService from "primevue/toastservice";

require("dayjs/locale/pl");

import "@/registerServiceWorker";

import { primeVueLocale as locale } from "@/i18n";
import App from "@/App.vue";
import i18n from "@/i18n";
import store from "@/store";

dayjs.locale("pl");

const app = createApp(App);

app.use(store);
app.use(i18n);
app.use(PrimeVue, {
  locale,
  ripple: true,
});
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
