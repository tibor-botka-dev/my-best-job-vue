<template>
  <b-navbar v-if="initialized" class="bg-dark nav-border-bottom p-0" toggleable="sm" sticky type="dark">
    <div class="d-flex container">
      <b-navbar-brand href="/"><img src="../assets/img/logo2_35x35.png" alt="My best job - logo" /></b-navbar-brand>

      <div class="ml-auto">
        <b-navbar-toggle target="nav-collapse" class="float-end"></b-navbar-toggle>
        <b-collapse id="nav-collapse" is-nav class="text-center float-end me-3">
          <b-navbar-nav>
            <b-nav-item href="/" class="my-auto">Főoldal</b-nav-item>
            <b-nav-item href="/sign-in" class="my-auto">Bejelentkezés</b-nav-item>
            <b-nav-item href="/sign-up" class="my-auto">Regisztráció</b-nav-item>
            <b-nav-item href="/tasks" class="my-auto">Feladatok</b-nav-item>

            <b-nav-item v-if="authentication.isLoggedIn" class="ml-3" href="/profile">
              <span v-if="avatar" class="b-avatar no-mask-image b-avatar-lg badge-primary rounded-circle">
                <span class="b-avatar-img"><img :src="avatar" alt="avatar"></span>
              </span>
              <b-avatar v-else variant="primary" size="lg">
                <i class="fas fa-user-tie fa-lg"></i>
              </b-avatar>
            </b-nav-item>

            <b-nav-item-dropdown v-if="authentication.currentUser.fullName" class="my-auto">
              <template #button-content>
                <span>{{ authentication.currentUser.fullName }}</span>
              </template>

              <div v-if="hasAccess('profile')">
                <b-dropdown-item href="/profile" variant="success">
                  <i class="fas fa-user-tie"></i>
                  Profil
                </b-dropdown-item>

                <b-dropdown-divider />
              </div>

              <div v-if="hasAccess('settings')">
                <b-dropdown-item href="/settings" variant="dark">
                  <i class="fas fa-cog"></i>
                  Beállítások
                </b-dropdown-item>

                <b-dropdown-divider />
              </div>

              <div v-if="hasAccess('change-password')">
                <b-dropdown-item href="/change-password" variant="info">
                  <i class="fas fa-unlock"></i>
                  Jelszó megváltoztatása
                </b-dropdown-item>

                <b-dropdown-divider />
              </div>

              <b-dropdown-item-button @click="signOut" variant="danger">
                <i class="fas fa-sign-out-alt"></i>
                Kijelentkezés
              </b-dropdown-item-button>
            </b-nav-item-dropdown>
          </b-navbar-nav>
        </b-collapse>
      </div>
    </div>
  </b-navbar>
</template>

<script>
import authenticationService from "../services/authentication-service";
import { mapState } from "vuex";

export default {
  computed: {
    ...mapState(["initialized", "authentication", "roles", "avatar"])
  },
  methods: {
    hasAccess(routeName) {
      if (this.initialized) {
        var route = this.$router.options.routes.find(x => x.name == routeName);
        var authorize = route?.meta?.authorize;
        if (!authorize.length)
          return true;


        var hasAccess = this.roles.find(x => authorize.some(y => y == x.name))?.hasUserAccess;
        return hasAccess;
      }
    },
    async signOut() {
      this.showLoading(true, "Kijelentkezés...");
      const response = await authenticationService.signOut();
      this.showLoading();

      if (!response.isSuccessStatusCode) {
        this.showToast(
          "Hiba kijelentkezéskor",
          `Nem sikerült kijelentkeztetni a felhasználót: '${this.authentication.currentUser.fullName}'`,
          response.data
        );
      }

      authenticationService.redirectSignIn();
    },
  }
};
</script>