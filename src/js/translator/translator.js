/* eslint-disable no-param-reassign */
/* eslint-disable no-prototype-builtins */
import EN from './en';
import IT from './it';

const DEFAULT_LOCALE = 'en';

export default class Translator {
  constructor() {
    this.locale = null;
    this.translations = {};

    this.registerTranslation('en', EN);
    this.registerTranslation('it', IT);

    let locale = null;
    const languages = Translator.getBrowserLanguages();
    for (let i = 0; i < languages.length; i++) {
      const lang = languages[i];
      if (this.translations.hasOwnProperty(lang)) {
        locale = lang;
        break;
      }
    }
    locale = locale || DEFAULT_LOCALE;

    this.setLocale(locale);
  }

  t(phrase, ...params) {
    return this.translate(phrase, ...params);
  }

  translate(phrase, ...params) {
    const { locale } = this;

    const translation = this.translations[locale];
    if (!translation.hasOwnProperty(phrase)) {
      console.warn(`translation '${phrase}' not found in language '${locale}'`);
      return phrase;
    }

    let translatedPhrase = translation[phrase];

    translatedPhrase = translatedPhrase.replace(/{(\d+)}/g, (match, number) => (typeof params[number] !== 'undefined'
      ? params[number]
      : match));

    return translatedPhrase;
  }

  setLocale(locale) {
    locale = locale.toLowerCase();

    if (this.translations.hasOwnProperty(locale)) {
      this.locale = locale;
    } else {
      console.warn(`locale '${locale}' not available, switch to ${DEFAULT_LOCALE}`);
      this.locale = DEFAULT_LOCALE.toLowerCase();
    }
  }

  registerTranslation(locale, translations) {
    if (!this.translations.hasOwnProperty(locale)) {
      this.translations[locale] = translations;
    } else {
      Object.assign(this.translations[locale], translations);
    }
  }

  static getBrowserLanguages() {
    return navigator.languages
      ? navigator.languages
      : ([(navigator.language || navigator.userLanguage)]);
  }
}
