<template>
  <div class="row text-light">
    <div class="offset-md-2 col-md-8">
      <div v-if="googleSignInUrl" class="form-group text-center">
        <a :href="googleSignInUrl" class="btn btn-lg btn-primary">
          <i class="fab fa-google fa-5x pb-2 text-success"></i>
          <h3 class="title">Bejelentkezés</h3>
        </a>
        <input-footer tooltip="Bejelentkezés Google szolgáltatással" />
      </div>
      <hr class="divider" />

      <div class="form-group">
        <label for="email">
          Email cím
          <span class="h4 text-danger">
            <strong>*</strong>
          </span>
        </label>
        <input id="email" type="email" class="form-control" v-model="loginData.email" required autocomplete="email" />
        <input-footer :validation="validationMessages.email" message="Email cím mező kötelező"
          tooltip="Érvényes email címnek kell lennie" />
      </div>

      <div class="form-group">
        <label for="password">
          Jelszó
          <span class="h4 text-danger">
            <strong>*</strong>
          </span>
        </label>
        <div class="input-group">
          <div class="input-group-prepend">
            <button class="btn btn-secondary" type="button" @click="passwordType = showPassword(passwordType)">
              <i class="fas fa-eye" v-if="passwordType == 'password'"></i>
              <i class="fas fa-eye-slash" v-else></i>
            </button>
          </div>
          <input id="password" v-model="loginData.password" :type="passwordType" class="form-control" />
        </div>
        <input-footer :validation="validationMessages.password" message="Jelszó mező kötelező"
          tooltip="Minimum 6, maximum 12 karaktert, legalább 1 nagybetűt, 1 kisbetűt, 1 számot és 1 speciális karaktert @$!%*_=():.?& kell tartalmaznia" />
      </div>

      <div class="mt-4 mb-5 text-center">
        <button type="button" class="btn btn-lg btn-primary" @click="signIn">
          <i class="fas fa-sign-in"></i>
          Bejelentkezés
        </button>
      </div>

      <h5 class="font-italic text-center text-md-left">
        <router-link :to="{ name: 'forgotPassword' }" class="text-info">
          <u>
            <strong>Kattintson ide</strong>, ha elfelejtette jelszavát.
          </u>
        </router-link>
      </h5>
    </div>
  </div>
</template>

<script>
import authenticationService from "../../services/authentication-service";
import googleLogin from "vue-google-login";
import { mapState, mapMutations } from "vuex";

export default {
  components: {
    googleLogin,
  },
  data() {
    return {
      title: "Bejelentkezés",
      passwordType: "password",
      loginData: {
        email: null,
        password: null,
      },
      submitted: null,
    };
  },
  computed: {
    validationMessages() {
      var result = [];
      if (!this.submitted)
        return result;

      result["email"] = !this.regexPatterns.email.test(this.loginData.email);
      result["password"] = !this.regexPatterns.password.test(
        this.loginData.password
      );

      return result;
    },
    ...mapState(["googleSignInUrl", "facebookSetting", "initialized"]),
  },
  methods: {
    ...mapMutations(["saveTokenData", "updateTokenExpiration", "setAvatar"]),
    async signIn() {
      this.submitted = true;
      if (Object.values(this.validationMessages).includes(true))
        return;

      this.showLoading(true, "Bejelentkezés...");
      const response = await authenticationService.signIn(this.loginData);
      this.showLoading();

      if (!response.isSuccessStatusCode) {
        this.showToast(
          "Hiba a bejelentkezés során",
          "A bejelentkezés sikertelen",
          response.data
        );

        return;
      }

      this.$router.push({ name: "home" });
    },
    signInGoogle(tokens, avatar) {
      this.showLoading(true, "Google bejelentkezés...");

      const tokensObject = JSON.parse(tokens);
      this.saveTokenData(tokensObject);
      this.updateTokenExpiration();
      this.setAvatar(avatar);

      this.showLoading();

      this.$router.push({ name: "home" });
    }
  },
  mounted() {
    this.setTitle();
  },
  watch: {
    initialized(initialized) {
      if (initialized) {
        const isSuccess = this.$route.query.isSuccess;
        if (isSuccess) {
          const tokens = this.$route.query.tokens;
          const avatar = this.$route.query.avatar;
          this.signInGoogle(tokens, avatar);
          return;
        }

        const error = this.$route.query.error;
        if (error)
          this.showToast(
            "Hiba a bejelentkezés során",
            "A Google bejelentkezés sikertelen",
            error
          );
      }
    }
  },
};
</script>