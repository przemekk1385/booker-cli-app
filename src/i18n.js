import { createI18n } from "vue-i18n";

export default createI18n({
  legacy: false,
  locale: "pl",
  globalInjection: true,
  messages: {
    en: {
      app: {
        noApiConnectionMessage: "No API connection.",
      },
      form: {
        codeInputPlaceholder: "Code",
        slotDropdown: {
          placeholder: "Slot",
          optionTagValue: "Apartment",
        },
        cancelCheckboxLabel: "Cancel booking",
        cancelButtonLabel: "Cancel",
        bookButtonLabel: "Book",
      },
      store: {
        fetchBookingsFromApi: {
          failureDetail: "Failed to get bookings.",
        },
        fetchSlotsFromApi: {
          failureDetail: "Failed to get slots.",
        },
        cancelBooking: {
          formErrorsDetail: "Check form errors.",
          otherErrorsDetail: "Failed to cancel.",
          successDetail: "Booking canceled.",
          errors: {
            codeNotFound: "Matching booking not found.",
          },
        },
        createBooking: {
          formErrorsDetail: "Check form errors.",
          otherErrorsDetail: "Failed to book.",
          successDetail: "Booking created.",
          errors: {
            codeNotFound: "Matching apartment not found.",
          },
        },
        handleFailure: {
          errorSummary: "Error",
        },
        handleFailureNoErrors: {
          detail: "{detail} Response code {status}.",
          errorSummary: "Error",
        },
      },
    },
    pl: {
      app: {
        noApiConnectionMessage: "Brak połączenia z API.",
      },
      form: {
        codeInputPlaceholder: "Kod",
        slotDropdown: {
          placeholder: "Godzina",
          optionTagValue: "Apartament {number}",
        },
        cancelCheckboxLabel: "Odwołaj rezerwację",
        cancelButtonLabel: "Odwołaj",
        bookButtonLabel: "Rezerwuj",
      },
      store: {
        fetchBookingsFromApi: {
          failureDetail: "Nie udało się pobrać rezerwacji.",
        },
        fetchSlotsFromApi: {
          failureDetail: "Nie udało się pobrać godzin.",
        },
        cancelBooking: {
          formErrorsDetail: "Sprawdź formularz.",
          otherErrorsDetail: "Nie udało się odwołać rezerwacji.",
          successDetail: "Rezerwacja odwołana.",
          errors: {
            codeNotFound: "Nie znaleziono pasującej rezerwacji.",
          },
        },
        createBooking: {
          formErrorsDetail: "Sprawdź formularz.",
          otherErrorsDetail: "Nie udało się utworzyć rezerwacji.",
          successDetail: "Rezerwacja utworzona.",
          errors: {
            codeNotFound: "Nie znaleziono pasującego apartamentu.",
          },
        },
        handleFailure: {
          errorSummary: "Błąd",
        },
        handleFailureNoErrors: {
          detail: "{detail} Kod odpowiedzi {status}.",
          errorSummary: "Błąd",
        },
      },
      validations: {
        maxLength: "Maksymalna dozwolona długość to {max} znaków.",
        required: "Pole jest wymagane.",
        requiredUnlessCancel: "Pole jest wymagane przy tworzeniu rezerwacji.",
      },
    },
  },
});

// PrimeVUE locale
export const primeVueLocale = {
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
  dayNamesShort: ["Niedz.", "Pon.", "Wt.", "Śr.", "Czw.", "Pt.", "Sob."],
  dayNamesMin: ["Ni.", "Pn.", "Wt.", "Śr.", "Cz.", "Pt.", "Sb."],
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
  firstDayOfWeek: 1,
  dateFormat: "yy-mm-dd",
  weak: "Słabe",
  medium: "Średnie",
  strong: "Mocne",
  passwordPrompt: "Podaj hasło",
  emptyFilterMessage: "Nie znaleziono wyników",
  emptyMessage: "Brak opcji",
};
