<template>
  <div v-if="!requestSent" class="row">
    <div class="offset-md-2 col-md-8">
      <div class="form-group">
        <label for="email">
          Fiókjához tartozó email cím
          <span class="h4 text-danger">
            <strong>*</strong>
          </span>
        </label>
        <input id="email" type="email" class="form-control" v-model="email" required autocomplete="off" />
        <input-footer :validation="validationMessages.email" message="Email cím mező kötelező"
          tooltip="Érvényes email címnek kell lennie" />
      </div>

      <div class="mt-4 text-center">
        <button type="button" class="btn btn-lg btn-primary" @click="forgotPassword">
          <i class="fas fa-paper-plane"></i>
          Jelszó igénylése
        </button>
      </div>
    </div>
  </div>
  <h4 v-else class="text-center">
    Az <strong>új jelszó igénylés</strong>éhez szükséges információkat elküldtük
    emailben.
    <p>Kérjük, ellenőrizze leveleit.</p>
  </h4>
</template>
<script>
import authenticationService from "../../services/authentication-service";

export default {
  data() {
    return {
      title: "Új jelszó igénylés",
      email: null,
      submitted: null,
      requestSent: null,
    };
  },
  computed: {
    validationMessages() {
      var result = [];
      if (!this.submitted) {
        return result;
      }

      result["email"] = !this.regexPatterns.email.test(this.email);

      return result;
    },
  },
  methods: {
    async forgotPassword() {
      this.submitted = true;
      if (Object.values(this.validationMessages).includes(true))
        return;

      this.showLoading(true, "Új jelszó igénylése...");
      const response = await authenticationService.forgotPassword({ email: this.email });
      this.showLoading();

      if (!response.isSuccessStatusCode) {
        this.showToast(
          "Hiba az új jelszó igénylése során",
          "Új jelszó igénylése sikertelen",
          response.data
        );

        return;
      }

      this.requestSent = true;
      this.showToast(
        "Új jelszó igénylése sikeres",
        "Sikeresen igényelt új jelszót. Kérjük ellenőrizze leveleit.",
        null,
        { variant: "success" }
      );
    },
  },
  mounted() {
    this.setTitle();
  }
};
</script>