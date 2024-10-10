<template>
  <div class="row">
    <div class="offset-md-2 col-md-8">
      <div class="form-group">
        <label for="old-password">
          Régi jelszó
          <span class="h4 text-danger">
            <strong>*</strong>
          </span>
        </label>
        <div class="input-group">
          <div class="input-group-prepend">
            <button class="btn btn-secondary" type="button" @click="oldPasswordType = showPassword(oldPasswordType)">
              <i class="fas fa-eye" v-if="oldPasswordType == 'password'"></i>
              <i class="fas fa-eye-slash" v-else></i>
            </button>
          </div>
          <input id="old-password" v-model="changePasswordData.oldPassword" :type="oldPasswordType" class="form-control"
            required autocomplete="off" />
        </div>
        <input-footer :validation="validationMessages.oldPassword" message="Régi jelszó mező kötelező"
          tooltip="Minimum 6, maximum 12 karaktert, legalább 1 nagybetűt, 1 kisbetűt, 1 számot és 1 speciális karaktert @$!%*_=():.?& kell tartalmaznia" />
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
          <input id="password" v-model="changePasswordData.password" :type="passwordType" class="form-control" required
            autocomplete="off" />
        </div>
        <input-footer :validation="validationMessages.password" message="Új jelszó mező kötelező"
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
          <input id="confirm-password" v-model="changePasswordData.confirmPassword" :type="confirmPasswordType"
            class="form-control" required autocomplete="off" />
        </div>
        <input-footer :validation="validationMessages.confirmPassword" message="Új jelszó megerősítése mező kötelező"
          tooltip="Meg kell egyeznie az Új jelszó mezővel" />
      </div>

      <div class="mt-4 text-center">
        <button type="button" class="btn btn-lg btn-primary" @click="changePassword">
          <i class="fas fa-sync"></i>
          Új jelszó beállítása
        </button>
      </div>
    </div>
  </div>
</template>
<script>
import authenticationService from "../../services/authentication-service";

export default {
  data() {
    return {
      title: "Új jelszó beállítása",
      oldPasswordType: "password",
      passwordType: "password",
      confirmPasswordType: "password",
      changePasswordData: {
        oldPassword: null,
        password: null,
        confirmPassword: null,
      },
      submitted: null,
    };
  },
  computed: {
    validationMessages() {
      var result = [];
      if (!this.submitted)
        return result;

      result["oldPassword"] = !this.regexPatterns.password.test(this.changePasswordData.oldPassword);
      result["password"] = !this.regexPatterns.password.test(this.changePasswordData.password)
        || this.changePasswordData.password != this.changePasswordData.confirmPassword;
      result["confirmPassword"] = !this.regexPatterns.password.test(this.changePasswordData.confirmPassword)
        || this.changePasswordData.confirmPassword != this.changePasswordData.password;

      return result;
    },
  },
  methods: {
    async changePassword() {
      this.submitted = true;
      if (Object.values(this.validationMessages).includes(true))
        return;

      this.showLoading(true, "Új jelszó beállítása folyamatban...");
      const response = await authenticationService.changePassword(this.changePasswordData);
      this.showLoading();

      if (!response.isSuccessStatusCode) {
        this.showToast(
          "Hiba az új jelszó beállítása során",
          "Az új jelszó beállítása sikertelen",
          response.data
        );

        return;
      }

      this.confirmMessageModal("Igen gombra kattintva kijelentkeztetjük, majd bejelentkezéskor az új jelszavával tud csak belépni.<p class='text-primary'>Biztosan kijelentkezik?</p>",
        "Új jelszó beállítása sikeres",
        {
          onOk: () => {
            authenticationService.redirectSignIn();
          },
        });
    },
  },
  mounted() {
    this.setTitle();
  },
};
</script>