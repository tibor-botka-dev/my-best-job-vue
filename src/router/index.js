import Vue from "vue";
import VueRouter from "vue-router";
import store from "../store/index";
import tokenService from "../services/token-service";
import initService from "../services/init-service";

const home = () => import("../views/home");
const profile = () => import("../views/profile");
const settings = () => import("../views/settings/settings");

const confirmAccount = () => import("../views/authentication/confirm-account");
const forgotPassword = () => import("../views/authentication/forgot-password");
const resetPassword = () => import("../views/authentication/reset-password");
const changePassword = () => import("../views/authentication/change-password");

const signIn = () => import("../views/authentication/sign-in");
const signUp = () => import("../views/authentication/sign-up");

const unauthorized = () => import("../views/error-pages/unauthorized");
const notFound = () => import("../views/error-pages/not-found");
const unavailable = () => import("../views/error-pages/unavailable");

Vue.use(VueRouter);

const routes = [
  { path: "/", component: home, name: "home", meta: { text: "Főoldal" } },
  { path: "/profile", component: profile, name: "profile", meta: { text: "Profil", authorize: [] } },
  { path: "/settings", component: settings, name: "settings", meta: { text: "Beállítások", authorize: ["administrator"] } },

  { path: "/sign-in", component: signIn, name: "sign-in", meta: { text: "Bejelentkezés", isAuthenticationPage: true } },
  { path: "/sign-up", component: signUp, name: "sign-up", meta: { text: "Regisztráció", isAuthenticationPage: true } },
  { path: "/confirm-account/:email/:token", component: confirmAccount, name: "confirm-account", meta: { text: "Email megerősítés", isAuthenticationPage: true } },
  { path: "/reset-password/:token", component: resetPassword, name: "reset-password", meta: { text: "Jelszó igénylés", isAuthenticationPage: true } },
  { path: "/forgot-password", component: forgotPassword, name: "forgotPassword", meta: { text: "Új jelszó igénylés", isAuthenticationPage: true } },
  { path: "/change-password", component: changePassword, name: "change-password", meta: { text: "Jelszó megváltoztatása", authorize: [] } },

  { path: "/unauthorized", component: unauthorized, name: "unauthorized", meta: { text: "A felhasználó nincs hitelesítve", isAuthenticationPage: true } },
  { path: "/unavailable", component: unavailable, name: "unavailable", meta: { text: "Az oldal nem elérhető", isAuthenticationPage: true } },
  { path: "*", component: notFound, name: "not-found", meta: { text: "Az oldal nem található", isAuthenticationPage: true } },
]

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
  linkActiveClass: "active",
  linkExactActiveClass: "active",
  scrollBehavior() {
    return { x: 0, y: 0 };
  },
})

router.beforeEach(async (to, _, next) => {
  await initService.beforeLoadInitApp().catch(_ => {
    return next({ path: "/unavailable" });
  });

  const { authorize } = to.meta;

  if (!authorize)
    return next();

  const tokenActive = await tokenService.isTokenActive();
  if (!tokenActive)
    return next({ path: "/sign-in" });

  var hasAccess = store.state.roles.find(x => authorize.some(y => y == x.name))?.hasUserAccess;
  if (!hasAccess && authorize.length)
    return next({ path: "/unauthorized" });

  return next();
});

export default router;