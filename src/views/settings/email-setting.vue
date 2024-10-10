<template>
  <div>
    <div class="row">
      <div class="col-md-6">
        <div class="form-group">
          <label for="email">
            Email cím
            <span class="h4 text-danger">
              <strong>*</strong>
            </span>
          </label>
          <input id="email" class="form-control" v-model="mailSetting.email" autocomplete="off" required />
          <input-footer :validation="validationMessages.email" message="Email cím mező kötelező"
            tooltip="Erről az email címről kerülnek kiküldésre az email-ek" />
        </div>
      </div>

      <div class="col-md-6">
        <div class="form-group">
          <label for="email-password">
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
            <input id="email-password" class="form-control" v-model="mailSetting.password" :type="passwordType"
              autocomplete="off" required />
          </div>
          <input-footer :validation="validationMessages.password" message="Jelszó mező kötelező"
            tooltip="Email fiókhoz tartozó jelszó" />
        </div>
      </div>

      <div class="col-md-4">
        <div class="form-group">
          <label for="host">
            Host
            <span class="h4 text-danger">
              <strong>*</strong>
            </span>
          </label>
          <input id="host" class="form-control" v-model="mailSetting.host" required />
          <input-footer :validation="validationMessages.host" message="Host mező kötelező"
            tooltip="Email kiszolgáló host neve" />
        </div>
      </div>

      <div class="col-md-4">
        <div class="form-group">
          <label for="port">
            Port
            <span class="h4 text-danger">
              <strong>*</strong>
            </span>
          </label>
          <input id="port" type="number" class="form-control" v-model="mailSetting.port" @keypress="checkNumber($event)"
            required />
          <input-footer :validation="validationMessages.port" message="Port mező kötelező"
            tooltip="Email kiszolgáló portja" />
        </div>
      </div>

      <div class="col-md-4">
        <div class="form-group">
          <label for="name">
            Név
            <span class="h4 text-danger">
              <strong>*</strong>
            </span>
          </label>
          <input id="name" class="form-control" v-model="mailSetting.displayName" required />
          <input-footer :validation="validationMessages.displayName" message="Név mező kötelező"
            tooltip="Megjelenítendő név (1-30 karakter hosszú lehet)" />
        </div>
      </div>
    </div>

    <div class="mt-4 text-center">
      <button type="button" class="btn btn-lg btn-primary" @click="update">
        <i class="fas fa-at"></i>
        Email beállítások mentése
      </button>
    </div>
  </div>
</template>

<script>
import settingService from "../../services/setting-service";
import { mapState } from "vuex";

export default {
  data() {
    return {
      mailSetting: {
        email: null,
        displayName: null,
        password: null,
        host: null,
        port: null
      },
      passwordType: "password",
      submitted: null
    };
  },
  computed: {
    ...mapState(["initialized"]),
    validationMessages() {
      var result = [];
      if (!this.submitted)
        return result;

      result["email"] = !this.regexPatterns.email.test(this.mailSetting.email);
      result["displayName"] = !this.regexPatterns.name.test(this.mailSetting.displayName);
      result["password"] = !this.mailSetting.password;
      result["host"] = !this.regexPatterns.smtpHost.test(this.mailSetting.host);
      result["port"] = !this.regexPatterns.smtpPort.test(this.mailSetting.port);

      return result;
    },
  },
  methods: {
    async initialize() {
      this.showLoading(true, "Email beállítások betöltése...");
      const response = await settingService.getMailSetting();
      this.showLoading();

      if (response.isSuccessStatusCode) {
        this.mailSetting = response.data?.mailSetting;

        return;
      }

      this.showToast(
        "Hiba a beállítások lekérdezésekor",
        "Email beállítások lekérdezése nem sikerült",
        response.data
      );
    },
    async update() {
      this.submitted = true;
      if (Object.values(this.validationMessages).includes(true))
        return;

      this.showLoading(true, "Email beállítások mentése...");
      const response = await settingService.updateMailSetting(this.mailSetting);
      this.showLoading();

      if (!response.isSuccessStatusCode) {
        this.showToast(
          "Hiba a beállítások mentése közben",
          "Email beállítások mentése sikertelen",
          response.data
        );

        return;
      }

      this.showToast(
        "Beállítások mentése sikeres",
        "Email beállítások frissítve.",
        null,
        { variant: "success" }
      );
    },
  },
  watch: {
    async initialized(newValue, oldValue) {
      if (newValue && newValue != oldValue)
        await this.initialize();
    },
  },
};
</script>