<template>
  <header class="header style4">
    <div class="navbar-area">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-lg-12">
            <nav class="navbar navbar-expand-lg">
              <a class="navbar-brand logo" href="/">
                <img class="logo1" src="../assets/img/logo.svg" alt="Logo" />
              </a>
              <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent"
                aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span class="toggler-icon"></span>
                <span class="toggler-icon"></span>
                <span class="toggler-icon"></span>
              </button>
              <div class="collapse navbar-collapse sub-menu-bar" id="navbarSupportedContent">
                <ul id="nav" class="navbar-nav ml-auto">
                  <li class="nav-item">
                    <a class="active" href="/">{{ $t("Főoldal") }}</a>
                  </li>
                  <li class="nav-item"><a href="#">Pages</a>
                    <ul class="sub-menu">
                      <li><a href="about-us.html">About Us</a></li>
                      <li><a href="job-list.html">Job List</a></li>
                      <li><a href="job-details.html">Job Details</a></li>
                      <li><a href="resume.html">Resume Page</a></li>
                      <li><a href="privacy-policy.html">Privacy Policy</a></li>
                      <li><a href="faq.html">Faq</a></li>
                      <li><a href="pricing.html">Our Pricing</a></li>
                      <li><a href="404.html">404 Error</a></li>
                      <li><a href="mail-success.html">Mail Success</a></li>
                    </ul>
                  </li>
                  <li class="nav-item"><a href="#">{{ $t("Munkavállalóknak") }}</a>
                    <ul class="sub-menu">
                      <li><a href="browse-jobs.html">Browse Jobs</a></li>
                      <li><a href="browse-categories.html">Browse Categories</a></li>
                      <li><a href="add-resume.html">Add Resume</a></li>
                      <li><a href="job-alerts.html">Job Alerts</a></li>
                    </ul>
                  </li>
                  <li class="nav-item"><a href="#">{{ $t("Munkáltatóknak") }}</a>
                    <ul class="sub-menu">
                      <li><a href="post-job.html">Add Job</a></li>
                      <li><a href="manage-jobs.html">Manage Jobs</a></li>
                      <li><a href="manage-applications.html">Manage Applications</a></li>
                      <li><a href="manage-resumes.html">Manage Resume</a></li>
                      <li><a href="browse-resumes.html">Browse Resumes</a></li>
                    </ul>
                  </li>
                  <li class="nav-item"><a href="#">{{ $t("Blog") }}</a>
                    <ul class="sub-menu">
                      <li><a href="blog-grid-sidebar.html">Blog Grid Sidebar</a></li>
                      <li><a href="blog-single.html">Blog Single</a></li>
                      <li><a href="blog-single-sidebar.html">Blog Single Sibebar</a></li>
                    </ul>
                  </li>
                  <li class="nav-item"><a href="/contact">{{ $t("Kapcsolat") }}</a> </li>
                </ul>
              </div>

              <div class="button">
                <a href="javacript:" data-toggle="modal" data-target="#login" class="login"><i
                    class="lni lni-lock-alt"></i> Login</a>
                <a href="javacript:" data-toggle="modal" data-target="#signup" class="btn">Sign Up</a>
              </div>
            </nav>
          </div>
        </div>
      </div>
    </div>
  </header>

  <!-- <b-navbar v-if="initialized" class="nav-border-bottom justify-content-center" toggleable="lg" sticky type="dark"
    variant="dark">
    <b-navbar-brand href="/" class="d-flex align-items-center font-weight-bold">
      <img class="logo mr-3" src="../assets/img/logo.svg" alt="My Best Job logo" />
      My Best Job
    </b-navbar-brand>

    <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
    <b-collapse id="nav-collapse" is-nav class="col-auto pr-0">
      <b-navbar-nav class="mx-auto align-items-center">
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

        <b-nav-item href="/">{{ $t("Főoldal") }}</b-nav-item>
        <b-nav-item href="/tasks">{{ $t("Feladatok") }}</b-nav-item>
      </b-navbar-nav>

      <b-navbar-nav class="mx-auto align-items-center">
        <b-nav-item v-if="!authentication.isLoggedIn" href="/sign-in">{{ $t("Bejelentkezés") }}</b-nav-item>
        <b-nav-item href="/sign-up">{{ $t("Regisztráció") }}</b-nav-item>
      </b-navbar-nav>

      <div class="form-inline row">
        <div class="col-6 input-group">
          <input id="search" class="form-control" @keyup.enter="search" v-model="searchText"
            :placeholder="$t('Keresés...')" />
          <div class="input-group-append">
            <button class="btn btn-outline-primary" @click="search" title="search">
              <i class="fa fa-search"></i>
            </button>
          </div>
        </div>

        <div class="col-6">
          <gb-select class="w-100 d-inline" v-if="languageOptions" :options="languageOptions" :value="getLanguage"
            :searchable="false" :clearable="false" @change="selectedLanguageChanged">
          </gb-select>
        </div>
      </div>
    </b-collapse>
  </b-navbar> -->
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
    ...mapState(["initialized", "authentication", "roles", "avatar", "languages"]),
    ...mapGetters(["getLanguage"]),
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