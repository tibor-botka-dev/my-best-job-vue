import Vue from "vue";
import Vuex from "vuex";
import i18n from "@/assets/localizations/index";

Vue.use(Vuex);

const store = new Vuex.Store({
  strict: true,
  state: {
    isAuthenticationPage: null,
    authentication: {
      tokens: {
        accessToken: null,
        accessTokenExpires: null,
        refreshToken: null,
        refreshTokenExpires: null,
      },
      isLoggedIn: null,
      language: null,
      currentUser: {
        email: null,
        firstName: null,
        lastName: null,
        fullName: null
      },
    },
    avatar: null,
    applicationName: null,
    title: null,
    urls: {},
    regexPatterns: {},
    roles: [],
    initialized: null,
    languages: [],
    defaultLanguage: null,
    googleSignInUrl: null,
    googleSignUpUrl: null,
    facebookSetting: {
      appId: null
    },
  },
  getters: {
    getAccessToken(state) {
      var accessToken = state.authentication.tokens.accessToken
        || localStorage.getItem("my-best-job-accessToken");

      return accessToken;
    },
    getAccessTokenExpires(state) {
      var accessTokenExpires = state.authentication.tokens.accessTokenExpires
        || localStorage.getItem("my-best-job-accessTokenExpires");

      return accessTokenExpires;
    },
    getRefreshToken(state) {
      var refreshToken = state.authentication.tokens.refreshToken
        || localStorage.getItem("my-best-job-refreshToken");

      return refreshToken;
    },
    getRefreshTokenExpires(state) {
      var refreshTokenExpires = state.authentication.tokens.refreshTokenExpires
        || localStorage.getItem("my-best-job-refreshTokenExpires");

      return refreshTokenExpires;
    },
    getLanguage(state) {
      if (!state.authentication.language) {
        var defaultLanguage = state.languages.find((x) => x.extendedName == state.defaultLanguage);
        if (!defaultLanguage) {
          const defaultLocale = i18n.locale;
          state.authentication.language = { extendedName: defaultLocale };
        } else
          state.authentication.language = defaultLanguage;
      }

      return state.authentication.language;
    },
    parseJwt(_state, getters) {
      const accessToken = getters.getAccessToken;
      if (!accessToken)
        return null;

      var base64Url = accessToken.split(".")[1];
      if (!base64Url)
        return null;

      var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      var jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map(function (x) { return "%" + ("00" + x.charCodeAt(0).toString(16)).slice(-2); })
          .join("")
      );

      var result = JSON.parse(jsonPayload);
      return result;
    },
  },
  mutations: {
    setBeforeLoadInit(state, data) {
      if (data)
        state.roles = data.roles;
    },
    setInit(state, data) {
      if (data) {
        state.applicationName = data.applicationName;
        state.urls = data.urls;
        state.avatar = data.avatar;

        if (data.regexPatterns)
          for (const [key, value] of Object.entries(data.regexPatterns)) {
            state.regexPatterns[key] = new RegExp(value);
          }

        state.defaultLanguage = data.defaultLanguage;
        state.languages = data.languages;
        state.googleSignInUrl = data.googleSignInUrl;
        state.googleSignUpUrl = data.googleSignUpUrl;
        // state.facebookSetting = data.facebookSetting;

        state.initialized = true;
      }
    },
    setLanguage(state, language) {
      if (language) {
        state.authentication.language = language;
        i18n.locale = language.extendedName;
        i18n.fallbackLocale = i18n.messages[language.extendedName];
      }
    },
    saveTokenData(state, data) {
      localStorage.setItem("my-best-job-accessToken", data.accessToken);
      localStorage.setItem("my-best-job-accessTokenExpires", data.accessTokenExpires);
      localStorage.setItem("my-best-job-refreshToken", data.refreshToken);
      localStorage.setItem("my-best-job-refreshTokenExpires", data.refreshTokenExpires);

      state.authentication.tokens = {
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        accessTokenExpires: null,
        refreshTokenExpires: null
      };
      state.authentication.isLoggedIn = true;
    },
    updateTokenExpiration(state) {
      const decryptedAccessToken = this.getters.parseJwt;
      if (!decryptedAccessToken) {
        this._mutations.deleteTokenData[0](state);

        return;
      }

      state.authentication.tokens.accessTokenExpires = decryptedAccessToken.exp;

      const currentUser = JSON.parse(decryptedAccessToken.currentUser);
      state.authentication.currentUser = {
        email: currentUser.email,
        firstName: currentUser.firstName,
        lastName: currentUser.lastName,
        fullName: currentUser.fullName
      };
      state.authentication.isLoggedIn = true;
    },
    deleteTokenData(state) {
      localStorage.removeItem("my-best-job-accessToken");
      localStorage.removeItem("my-best-job-accessTokenExpires");
      localStorage.removeItem("my-best-job-refreshToken");
      localStorage.removeItem("my-best-job-refreshTokenExpires");

      state.authentication = {
        tokens: {
          accessToken: null,
          accessTokenExpires: null,
          refreshToken: null,
          refreshTokenExpires: null,
        },
        isLoggedIn: null,
        language: null,
        currentUser: {
          email: null,
          firstName: null,
          lastName: null,
          fullName: null
        },
      };
    },
    setAvatar(state, data) {
      state.avatar = data;
    },
    setTitle(state, data) {
      state.title = data;
    },
  },
  actions: {},
  modules: {}
});

export default store;