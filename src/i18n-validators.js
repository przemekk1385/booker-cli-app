import * as validators from "@vuelidate/validators";
import { createI18nMessage } from "@vuelidate/validators";

import i18n from "@/i18n";

const {
  global: { t },
} = i18n;
const withI18nMessage = createI18nMessage({ t });

export const maxLength = withI18nMessage(validators.maxLength, {
  withArguments: true,
});
export const required = withI18nMessage(validators.required);
export const requiredUnless = withI18nMessage(validators.requiredUnless, {
  withArguments: true,
});
