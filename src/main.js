import Vue from "vue";
import App from "./App";
import router from "./router";
import store from "./store";
import moment from "moment";
import VuexRouterSync from "vuex-router-sync";
import mixins from "./stuff/mixins";
import Vidle from "v-idle";
import { BootstrapVue } from "bootstrap-vue";

import "./assets/scss/app.scss";
import "../node_modules/bootstrap-vue/dist/bootstrap-vue.css";

import inputFooter from "./components/global/input-footer";

moment.locale("hu");
Vue.prototype.$moment = moment;

Vue.use(BootstrapVue);
Vue.use(mixins);
Vue.use(Vidle);
Vue.config.productionTip = false;

VuexRouterSync.sync(store, router);

// Global components
Vue.component("input-footer", inputFooter);

new Vue({
  router,
  store,
  render: function (h) { return h(App) }
}).$mount("#app");
