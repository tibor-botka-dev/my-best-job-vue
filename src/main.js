import Vue from "vue";
import App from "./App";
import router from "./router";
import store from "./store";
import i18n from "@/assets/localizations/index";
import moment from "moment";
import VuexRouterSync from "vuex-router-sync";
import mixins from "./stuff/mixins";
import VueDarkMode from "@growthbunker/vuedarkmode";
import { BootstrapVue } from "bootstrap-vue";

import "./assets/scss/app.scss";
// import "../node_modules/bootstrap-vue/dist/bootstrap-vue.css";

import inputFooter from "./components/global/input-footer";
import googleButton from "./components/global/google-button";

moment.locale("hu");
Vue.prototype.$moment = moment;

Vue.use(VueDarkMode);
Vue.use(BootstrapVue);
Vue.use(mixins);
Vue.config.productionTip = false;

VuexRouterSync.sync(store, router);

// Global components
Vue.component("input-footer", inputFooter);
Vue.component("google-button", googleButton);

new Vue({
  router,
  store,
  i18n,
  render: function (h) { return h(App) }
}).$mount("#app");
