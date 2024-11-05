import en from "./en-US.json";
import hu from "./hu-HU.json";
import Vue from 'vue';
import VueI18n from "vue-i18n";

Vue.use(VueI18n);

const defaultLocalization = "en-US";
const localizations = {
    "en-US": en,
    "hu-HU": hu,
};

const localizationMessages = Object.assign(localizations);
var i18n = new VueI18n({
    locale: defaultLocalization,
    fallbackLocale: localizations.hu,
    messages: localizationMessages
});

export default i18n;