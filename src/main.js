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

import "primevue/resources/themes/saga-green/theme.css";
import "primevue/resources/primevue.min.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";
import Toast from "primevue/toast";
import ToastService from "primevue/toastservice";

const app = createApp(App);

app.use(store);
app.use(i18n);
app.use(PrimeVue, {
  locale: {
    startsWith: "Zaczyna się od",
    contains: "Zawiera",
    notContains: "Nie zawiera",
    endsWith: "Kończy się na",
    equals: "Równe",
    notEquals: "Różne",
    noFilter: "Brak filtra",
    lt: "Mniejsze",
    lte: "Mniejsze lub równe",
    gt: "Większe",
    gte: "Większe lub równe",
    dateIs: "Data jest",
    dateIsNot: "Data nie jest",
    dateBefore: "Data jest wcześniej",
    dateAfter: "Data jest później",
    clear: "Wyczyść",
    apply: "Zatwierdź",
    matchAll: "Dopasuj wszystkie",
    matchAny: "Dopasuj dowolny",
    addRule: "Dodaj regułę",
    removeRule: "Usuń regułę",
    accept: "Tak",
    reject: "Nie",
    choose: "Wybierz",
    upload: "Wyślij",
    cancel: "Anuluj",
    dayNames: [
      "Niedziela",
      "Poniedziałek",
      "Wtorek",
      "Środa",
      "Czwartek",
      "Piątek",
      "Sobota",
    ],
    dayNamesShort: ["Pon.", "Wt.", "Śr.", "Czw.", "Pt.", "Sob.", "Niedz."],
    dayNamesMin: ["Pn.", "Wt.", "Śr.", "Cz.", "Pt.", "Sb.", "Ni."],
    monthNames: [
      "Styczeń",
      "Luty",
      "Marzec",
      "Kwiecień",
      "Maj",
      "Czerwiec",
      "Lipiec",
      "Sierpień",
      "Wrzeseń",
      "Październik",
      "Listopad",
      "Grudzień",
    ],
    monthNamesShort: [
      "Sty",
      "Lut",
      "Mar",
      "Kwi",
      "Maj",
      "Cze",
      "Lip",
      "Sie",
      "Wrz",
      "Paź",
      "Lis",
      "Gru",
    ],
    today: "Dziś",
    weekHeader: "Tydz.",
    firstDayOfWeek: 0,
    dateFormat: "yy-mm-dd",
    weak: "Słabe",
    medium: "Średnie",
    strong: "Mocne",
    passwordPrompt: "Podaj hasło",
    emptyFilterMessage: "Nie znaleziono wyników",
    emptyMessage: "Brak opcji",
  },
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
