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
          optionTagValue: "Apartament",
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
