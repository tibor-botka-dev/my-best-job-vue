import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

const store = new Vuex.Store({
  strict: true,
  state: {
    isAuthenticationPage: null,
    authentication: {
      accessToken: null,
      accessTokenExpires: null,
      refreshToken: null,
      refreshTokenExpires: null,
      isLoggedIn: null,
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
    googleSignInUrl: null,
    googleSignUpUrl: null,
    facebookSetting: {
      appId: null
    },
    idleSetting: {
      id: null,
      creatorUserId: null,
      duration: null,
      reminder: null,
      wait: null,
      loop: null,
      inBackground: null,
      turnedOn: null
    },
  },
  getters: {
    getAccessToken(state) {
      var accessToken = state.authentication.accessToken
        || localStorage.getItem("my-best-job-accessToken");

      return accessToken;
    },
    getAccessTokenExpires(state) {
      var accessTokenExpires = state.authentication.accessTokenExpires
        || localStorage.getItem("my-best-job-accessTokenExpires");

      return accessTokenExpires;
    },
    getRefreshToken(state) {
      var refreshToken = state.authentication.refreshToken
        || localStorage.getItem("my-best-job-refreshToken");

      return refreshToken;
    },
    getRefreshTokenExpires(state) {
      var refreshTokenExpires = state.authentication.refreshTokenExpires
        || localStorage.getItem("my-best-job-refreshTokenExpires");

      return refreshTokenExpires;
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

        state.idleSetting = data.idleSetting;
        state.googleSignInUrl = data.googleSignInUrl;
        state.googleSignUpUrl = data.googleSignUpUrl;
        // state.facebookSetting = data.facebookSetting;

        state.initialized = true;
      }
    },
    saveTokenData(state, data) {
      localStorage.setItem("my-best-job-accessToken", data.accessToken);
      localStorage.setItem("my-best-job-accessTokenExpires", data.accessTokenExpires);
      localStorage.setItem("my-best-job-refreshToken", data.refreshToken);
      localStorage.setItem("my-best-job-refreshTokenExpires", data.refreshTokenExpires);

      // const currentUser = JSON.parse(decryptedAccessToken.currentUser);
      state.authentication = {
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        accessTokenExpires: null,
        refreshTokenExpires: null,
        isLoggedIn: true
      };
    },
    updateTokenExpiration(state) {
      const decryptedAccessToken = this.getters.parseJwt;
      if (!decryptedAccessToken) {
        this._mutations.deleteTokenData[0](state);

        return;
      }

      state.authentication.accessTokenExpires = decryptedAccessToken.exp;

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
        accessToken: null,
        accessTokenExpires: null,
        refreshToken: null,
        refreshTokenExpires: null,
        isLoggedIn: null,
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