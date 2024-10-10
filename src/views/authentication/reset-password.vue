<template>
  <div v-if="resetPasswordData.token" class="row">
    <div class="offset-md-2 col-md-8">
      <div class="form-group">
        <label for="email">
          Fiókjához tartozó email cím
          <span class="h4 text-danger">
            <strong>*</strong>
          </span>
        </label>
        <input id="email" type="email" class="form-control" v-model="resetPasswordData.email" required
          autocomplete="off" />
        <input-footer :validation="validationMessages.email" message="Email cím mező kötelező"
          tooltip="Érvényes email címnek kell lennie" />
      </div>

      <div class="form-group">
        <label for="password">
          Új jelszó
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
          <input id="password" v-model="resetPasswordData.password" :type="passwordType" class="form-control" required
            autocomplete="off" />
        </div>
        <input-footer :validation="validationMessages.password" message="Jelszó mező kötelező"
          tooltip="Minimum 6, maximum 12 karaktert, legalább 1 nagybetűt, 1 kisbetűt, 1 számot és 1 speciális karaktert @$!%*_=():.?& kell tartalmaznia" />
      </div>

      <div class="form-group">
        <label for="confirm-password">
          Új jelszó megerősítése
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
          <input id="confirm-password" v-model="resetPasswordData.confirmPassword" :type="confirmPasswordType"
            class="form-control" required autocomplete="off" />
        </div>
        <input-footer :validation="validationMessages.confirmPassword" message="Jelszó megerősítése mező kötelező"
          tooltip="Meg kell egyeznie a Jelszó mezővel" />
      </div>

      <div class="mt-4 text-center">
        <button type="button" class="btn btn-lg btn-primary" @click="resetPassword">
          <i class="fas fa-sync"></i>
          Új jelszó beállítása
        </button>
      </div>
    </div>
  </div>
  <h4 v-else class="text-center">
    A jelszó helyreállításhoz szükséges token nem található.<br />
    <router-link :to="{ name: 'login' }" class="btn btn-primary btn-lg mt-3">
      <i class="fas fa-sign-in"></i> Bejelentkezés
    </router-link>
  </h4>
</template>

<script>
import authenticationService from "../../services/authentication-service";
import { mapState } from "vuex";

export default {
  data() {
    return {
      title: "Jelszó helyreállítása",
      passwordType: "password",
      confirmPasswordType: "password",
      resetPasswordData: {
        email: null,
        password: null,
        confirmPassword: null,
        token: null,
      },
      submitted: null,
    };
  },
  computed: {
    ...mapState(["initialized"]),
    validationMessages() {
      var result = [];
      if (!this.submitted)
        return result;

      result["email"] = !this.regexPatterns.email.test(this.resetPasswordData.email);
      result["password"] = !this.regexPatterns.password.test(this.resetPasswordData.password)
        || this.resetPasswordData.password != this.resetPasswordData.confirmPassword;
      result["confirmPassword"] = !this.regexPatterns.password.test(this.resetPasswordData.confirmPassword)
        || this.resetPasswordData.confirmPassword != this.resetPasswordData.password;

      return result;
    }
  },
  methods: {
    async resetPassword() {
      this.submitted = true;
      if (Object.values(this.validationMessages).includes(true))
        return;

      this.showLoading(true, "Új jelszó beállítása...");
      const response = await authenticationService.resetPassword(this.resetPasswordData);
      this.showLoading();

      if (!response.isSuccessStatusCode) {
        this.showToast(
          "Hiba az új jelszó beállítása során",
          "Új jelszó beállítása sikertelen",
          response.data
        );

        return;
      }

      this.confirmMessageModal("Sikeresen beállította új jelszavát. Bejelentkezéskor az új jelszavával tud csak belépni.<p class='text-primary'>Bejelentkezik?</p>",
        "Új jelszó beállítása sikeres",
        {
          onOk: () => {
            authenticationService.redirectSignIn();
          },
        });
    },
    setParams(params) {
      if (!params.token)
        return;

      this.resetPasswordData.token = params.token;
    },
  },
  mounted() {
    this.setTitle();
  },
  watch: {
    async initialized(newValue, oldValue) {
      if (newValue && newValue != oldValue)
        await this.setParams(this.$route.params);
    },
  },
};
</script>