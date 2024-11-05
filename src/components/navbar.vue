<template>
  <b-navbar v-if="initialized" class="nav-border-bottom justify-content-center" toggleable="lg" sticky type="dark"
    variant="dark">
    <b-navbar-brand href="/" class="d-flex align-items-center font-weight-bold">
      <img src="../assets/img/logo.svg" alt="My Best Job logo" />
      My Best Job
    </b-navbar-brand>

    <div class="col-auto ml-0 ml-lg-5">
      <gb-badge filled="true">{{ title }}</gb-badge>
    </div>

    <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
    <b-collapse id="nav-collapse" is-nav class="col-auto">
      <b-navbar-nav class="ml-auto mr-auto align-items-center">
        <b-nav-item v-if="authentication.isLoggedIn" href="/profile">
          <span v-if="avatar" class="b-avatar no-mask-image b-avatar-lg badge-primary rounded-circle">
            <span class="b-avatar-img"><img :src="avatar" alt="avatar"></span>
          </span>
          <b-avatar v-else variant="primary" size="lg">
            <i class="fas fa-user-tie fa-lg"></i>
          </b-avatar>
        </b-nav-item>

        <b-nav-item-dropdown v-if="authentication.currentUser.fullName" :text="authentication.currentUser.fullName"
          left>
          <div v-if="hasAccess('profile')">
            <b-dropdown-item href="/profile" variant="success">
              <i class="fas fa-user-tie"></i>
              {{ $t("Profil") }}
            </b-dropdown-item>

            <b-dropdown-divider />
          </div>

          <div v-if="hasAccess('settings')">
            <b-dropdown-item href="/settings" variant="dark">
              <i class="fas fa-cog"></i>
              {{ $t("Beállítások") }}
            </b-dropdown-item>

            <b-dropdown-divider />
          </div>

          <div v-if="hasAccess('change-password')">
            <b-dropdown-item href="/change-password" variant="info">
              <i class="fas fa-unlock"></i>
              {{ $t("Jelszó megváltoztatása") }}
            </b-dropdown-item>

            <b-dropdown-divider />
          </div>

          <b-dropdown-item-button @click="signOut" variant="danger">
            <i class="fas fa-sign-out-alt"></i>
            {{ $t("Kijelentkezés") }}
          </b-dropdown-item-button>
        </b-nav-item-dropdown>

        <b-nav-item href="/tasks">{{ $t("Feladatok") }}</b-nav-item>
      </b-navbar-nav>

      <b-navbar-nav class="align-items-center">
        <b-nav-item href="/sign-in">{{ $t("Bejelentkezés") }}</b-nav-item>
        <b-nav-item href="/sign-up">{{ $t("Regisztráció") }}</b-nav-item>

        <div class="d-flex">
          <button class="btn btn-outline-primary mx-2" @click="search">
            <i class="fa fa-search"></i>
          </button>
          <label for="search" class="d-none"> </label>
          <input id="search" class="mr-sm-2 form-control" @keyup.enter="search" v-model="searchText"
            :placeholder="$t('Keresés...')" />
        </div>

        <div class="d-flex mt-2 mt-lg-0">
          <gb-select v-if="languageOptions" class="w-min-140" :options="languageOptions" :value="selectedLanguage"
            :searchable="false" :clearable="false" @change="selectedLanguageChanged">
          </gb-select>
        </div>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
</template>

<script>
import authenticationService from "../services/authentication-service";
import { mapState, mapGetters, mapMutations } from "vuex";

export default {
  data() {
    return {
      searchText: null,
      submitted: null
    };
  },
  computed: {
    ...mapState(["initialized", "title", "authentication", "roles", "avatar", "languages"]),
    ...mapGetters(["getLanguage"]),
    selectedLanguage() {
      return this.getLanguage?.extendedName;
    },
    languageOptions() {
      var result = [];
      this.languages.forEach((x) => {
        result.push(
          Object.assign(
            {
              label: x.name,
              value: x.extendedName,
            },
            x
          )
        );
      });

      return result;
    },
  },
  methods: {
    ...mapMutations(["setLanguage"]),
    selectedLanguageChanged(newValue, _) {
      if (newValue) {
        this.showLoading(true, this.$t("Nyelv betöltése..."));
        var language = this.languages.find((x) => x.extendedName == newValue);
        this.setLanguage(language);
        this.showLoading();
      }
    },
    search() {
      this.searchText = "ezetre";
    },
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
      this.showLoading(true, this.$t("Kijelentkezés..."));
      const response = await authenticationService.signOut();
      this.showLoading();

      if (!response.isSuccessStatusCode) {
        this.showToast(
          this.$t("Hiba kijelentkezéskor"),
          this.$t(`Nem sikerült kijelentkeztetni a felhasználót: '${this.authentication.currentUser.fullName}'`),
          response.data
        );
      }

      authenticationService.redirectSignIn();
    },
  }
};
</script>