<template>
  <div v-if="!registered" class="row text-light">
    <div class="offset-md-2 col-md-8">
      <div v-if="googleSignUpUrl" class="form-group text-center">
        <a :href="googleSignUpUrl" class="btn btn-lg btn-primary">
          <i class="fab fa-google pb-2 text-success"></i>
          <!-- <h4>Regisztráció</h4> -->
        </a>
        <input-footer tooltip="Regisztráció Google szolgáltatással" />
      </div>
      <hr class="divider" />

      <div class="form-group">
        <label for="lastName">
          Vezetéknév
          <span class="h4 text-danger">
            <strong>*</strong>
          </span>
        </label>
        <input id="lastName" class="form-control" v-model="signUpData.lastName" required autocomplete="given-name" />
        <input-footer :validation="validationMessages.lastName" message="Vezetéknév mező kötelező"
          tooltip="1-30 karakter hosszú lehet" />
      </div>

      <div class="form-group">
        <label for="firstName">
          Keresztnév
          <span class="h4 text-danger">
            <strong>*</strong>
          </span>
        </label>
        <input id="firstName" class="form-control" v-model="signUpData.firstName" required autocomplete="family-name" />
        <input-footer :validation="validationMessages.firstName" message="Keresztnév mező kötelező"
          tooltip="1-30 karakter hosszú lehet" />
      </div>

      <div class="form-group">
        <label for="email">
          Email cím
          <span class="h4 text-danger">
            <strong>*</strong>
          </span>
        </label>
        <input id="email" type="email" class="form-control" v-model="signUpData.email" required autocomplete="email" />
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
          <input id="password" v-model="signUpData.password" :type="passwordType" class="form-control" />
        </div>
        <input-footer :validation="validationMessages.password" message="Jelszó mező kötelező"
          tooltip="Minimum 6, maximum 12 karaktert, legalább 1 nagybetűt, 1 kisbetűt, 1 számot és 1 speciális karaktert @$!%*_=():.?& kell tartalmaznia" />
      </div>

      <div class="form-group">
        <label for="confirm-password">
          Jelszó megerősítése
          <span class="h4 text-danger">
            <strong>*</strong>
          </span>
        </label>
        <div class="input-group">
          <div class="input-group-prepend">
            <button class="btn btn-secondary" type="button"
              @click="confirmPasswordType = showPassword(confirmPasswordType)">
              <i class="fas fa-eye" v-if="confirmPasswordType == 'password'"></i>
              <i class="fas fa-eye-slash" v-else></i>
            </button>
          </div>
          <input id="confirm-password" v-model="signUpData.confirmPassword" :type="confirmPasswordType"
            class="form-control" />
        </div>
        <input-footer :validation="validationMessages.confirmPassword" message="Jelszó megerősítése mező kötelező"
          tooltip="Meg kell egyeznie a Jelszó mezővel" />
      </div>

      <div class="mt-4 text-center">
        <button type="button" class="btn btn-lg btn-primary" @click="signUp">
          <i class="fas fa-user-plus"></i>
          Regisztráció
        </button>
      </div>
    </div>
  </div>
  <h5 v-else class="text-center text-light">
    <p class="font-weight-bold">Köszönjük, hogy regisztrált hozzánk!</p>
    A regisztráció befejezéséhez meg kell erősítenie email címét. Kérjük,
    ellenőrizze leveleit.
  </h5>
</template>

<script>
import googleLogin from "vue-google-login";
import authenticationService from "../../services/authentication-service";
import { mapState } from "vuex";

export default {
  components: {
    googleLogin,
  },
  data() {
    return {
      title: "Regisztráció",
      passwordType: "password",
      confirmPasswordType: "password",
      signUpData: {
        lastName: null,
        firstName: null,
        email: null,
        password: null,
        confirmPassword: null,
        googleAvatarUrl: null,
      },
      submitted: null,
      registered: null,
    };
  },
  computed: {
    ...mapState(["googleSignUpUrl", "facebookSetting", "initialized"]),
    validationMessages() {
      var result = [];
      if (!this.submitted)
        return result;

      result["lastName"] = !this.regexPatterns.name.test(this.signUpData.lastName);
      result["firstName"] = !this.regexPatterns.name.test(this.signUpData.firstName);
      result["email"] = !this.regexPatterns.email.test(this.signUpData.email);
      result["password"] = !this.regexPatterns.password.test(this.signUpData.password)
        || this.signUpData.password != this.signUpData.confirmPassword;
      result["confirmPassword"] = !this.regexPatterns.password.test(this.signUpData.confirmPassword)
        || this.signUpData.confirmPassword != this.signUpData.password;

      return result;
    }
  },
  methods: {
    async signUp() {
      this.submitted = true;
      if (Object.values(this.validationMessages).includes(true))
        return;

      this.showLoading(true, "Regisztráció...");
      const response = await authenticationService.signUp({
        lastName: this.signUpData.lastName,
        firstName: this.signUpData.firstName,
        email: this.signUpData.email,
        password: this.signUpData.password,
        confirmPassword: this.signUpData.confirmPassword
      });
      this.showLoading();

      if (!response.isSuccessStatusCode) {
        this.showToast(
          "Hiba a regisztráció során",
          "A regisztráció sikertelen",
          response.data
        );

        return;
      }

      this.registered = true;
    },
  },
  mounted() {
    this.setTitle();
  },
  watch: {
    initialized(initialized) {
      if (initialized) {
        const isSuccess = this.$route.query.isSuccess;

        if (isSuccess) {
          this.registered = true;
          return;
        }

        const error = this.$route.query.error;
        if (error)
          this.showToast(
            "Hiba a regisztráció során",
            "A Google regisztráció sikertelen",
            error
          );
      }
    }
  },
};
</script>